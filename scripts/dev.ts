// 개발 서버: 파일이 바뀌면 다시 빌드하고, 열린 페이지를 새로고침한다.
// CSS만 바뀌면 빌드 없이 스타일시트만 갈아 끼우고, 빌드가 실패하면 에러를 화면에 띄운다.
// 브라우저 쪽 코드는 scripts/dev-client.js (/__dev.js).
import { spawn } from "node:child_process"
import fs from "node:fs"
import http from "node:http"
import path from "node:path"
import { stripVTControlCharacters } from "node:util"

const PORT = Number(process.env.PORT ?? 3000)
const OUT = path.resolve("dist")
const WATCH = ["content", "templates", "assets", "lib", "static"]
const CLIENT = "scripts/dev-client.js"

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
}

const clients = new Set<http.ServerResponse>()
// 마지막 빌드의 에러. 실패한 뒤에 연 페이지에도 띄우려고 둔다.
let lastError = ""

const sendTo = (res: http.ServerResponse, event: string, data = "") =>
  res.write(`event: ${event}\ndata: ${data}\n\n`)
const send = (event: string, data?: string) => {
  for (const res of clients) sendTo(res, event, data)
}

// 빌드는 별도 프로세스로 돌려서, 바뀐 템플릿·lib 모듈을 매번 새로 읽게 한다
let building: Promise<void> | null = null
let queued = false
const build = (): Promise<void> => {
  if (building) {
    queued = true
    return building
  }
  building = new Promise<void>(resolve => {
    const child = spawn(process.execPath, ["build.ts", "--dev"], {
      stdio: ["ignore", "inherit", "pipe"],
    })
    let stderr = ""
    child.stderr.setEncoding("utf8")
    child.stderr.on("data", chunk => {
      process.stderr.write(chunk)
      stderr += chunk
    })
    // exit 대신 close: stderr를 끝까지 받은 뒤에 온다
    child.on("close", code => {
      building = null
      // 터미널 색 코드는 브라우저에서 깨져 보이니 뺀다
      lastError =
        code === 0
          ? ""
          : stripVTControlCharacters(stderr).trim() ||
            `빌드 실패 (코드 ${code})`
      if (lastError) send("build-error", JSON.stringify(lastError))
      else send("reload")
      if (queued) {
        queued = false
        build()
      }
      resolve()
    })
  })
  return building
}

let timer: NodeJS.Timeout | undefined
const schedule = () => {
  clearTimeout(timer)
  timer = setTimeout(build, 80)
}

// CSS는 dist로 복사만 하고 열린 페이지에 알린다. 빌드 중이면 그 빌드가 복사하게 둔다.
const changedCss = new Set<string>()
let cssTimer: NodeJS.Timeout | undefined
const swapCss = (file: string) => {
  changedCss.add(file)
  clearTimeout(cssTimer)
  cssTimer = setTimeout(() => {
    for (const file of changedCss) {
      const src = path.join("assets", file)
      if (building || !fs.existsSync(src)) {
        schedule()
        continue
      }
      const dest = path.join(OUT, "assets", file)
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.copyFileSync(src, dest)
      send("css", `/assets/${file}`)
      console.log(`CSS 교체 /assets/${file}`)
    }
    changedCss.clear()
  }, 30)
}

for (const target of WATCH)
  fs.watch(target, { recursive: true }, (_, file) => {
    if (target === "assets" && file?.endsWith(".css")) swapCss(file)
    else schedule()
  })
// build.ts 파일 자체를 지켜보면 빌드가 읽을 때(접근 시간 갱신)마다 이벤트가 와서
// 빌드가 끝없이 돈다. 루트 폴더를 지켜보고 이름으로 거른다.
fs.watch(".", (_, file) => {
  if (file === "build.ts") schedule()
})

const resolveFile = (urlPath: string) => {
  const file = path.join(OUT, decodeURIComponent(urlPath))
  if (!file.startsWith(OUT)) return undefined
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!urlPath.endsWith("/")) return { redirect: `${urlPath}/` }
    return { file: path.join(file, "index.html") }
  }
  return { file }
}

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost")
    if (url.pathname === "/__reload") {
      res.writeHead(200, {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
      })
      res.write(": connected\n\n")
      if (lastError) sendTo(res, "build-error", JSON.stringify(lastError))
      clients.add(res)
      req.on("close", () => clients.delete(res))
      return
    }
    if (url.pathname === "/__dev.js") {
      res.writeHead(200, {
        "content-type": TYPES[".js"],
        "cache-control": "no-store",
      })
      fs.createReadStream(CLIENT).pipe(res)
      return
    }
    const resolved = resolveFile(url.pathname)
    if (resolved?.redirect) {
      res.writeHead(301, { location: resolved.redirect })
      res.end()
      return
    }
    const file = resolved?.file
    if (!file || !fs.existsSync(file)) {
      const notFound = path.join(OUT, "404.html")
      res.writeHead(404, { "content-type": TYPES[".html"] })
      // 404.html도 없으면(첫 빌드가 실패했거나 아직 안 끝남) 에러를 띄울 스크립트만 넣는다
      res.end(
        fs.existsSync(notFound)
          ? fs.readFileSync(notFound)
          : `<!doctype html><meta charset="utf-8"><p>빌드 중…</p><script src="/__dev.js"></script>`,
      )
      return
    }
    res.writeHead(200, {
      "content-type": TYPES[path.extname(file)] ?? "application/octet-stream",
      "cache-control": "no-store",
    })
    fs.createReadStream(file).pipe(res)
  })
  .listen(PORT, async () => {
    await build()
    console.log(`개발 서버: http://localhost:${PORT}`)
  })
