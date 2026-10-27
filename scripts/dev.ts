// 개발 서버: 파일이 바뀌면 다시 빌드하고, 열린 페이지를 새로고침한다.
import { spawn } from "node:child_process"
import fs from "node:fs"
import http from "node:http"
import path from "node:path"

const PORT = Number(process.env.PORT ?? 3000)
const OUT = path.resolve("dist")
const WATCH = ["content", "templates", "assets", "lib", "static"]

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
      stdio: "inherit",
    })
    child.on("exit", code => {
      building = null
      if (code === 0) for (const res of clients) res.write("data: reload\n\n")
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
for (const target of WATCH) fs.watch(target, { recursive: true }, schedule)
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
      clients.add(res)
      req.on("close", () => clients.delete(res))
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
      res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : "빌드 중…")
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
