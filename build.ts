// content/ + templates/ → dist/
// node build.ts         배포용 빌드
// node build.ts --dev   초안 포함, 분석 스크립트 대신 자동 새로고침
import fs from "node:fs"
import path from "node:path"
import {
  assertValid,
  loadBooks,
  loadNotes,
  loadPages,
  loadPosts,
  loadRedirects,
} from "./lib/content.ts"
import { rss, sitemap } from "./lib/feed.ts"
import { toString, type Html } from "./lib/html.ts"
import {
  blogIndex,
  postPage,
  postPath,
  tagCounts,
  tagPath,
} from "./templates/blog.ts"
import { booksPage } from "./templates/books.ts"
import type { BuildContext } from "./templates/layout.ts"
import {
  homePage,
  notesPage,
  notFoundPage,
  redirectPage,
  standalonePage,
} from "./templates/pages.ts"

const OUT = path.resolve("dist")
const started = performance.now()
const ctx: BuildContext = { dev: process.argv.includes("--dev") }

const posts = loadPosts(ctx.dev)
const notes = loadNotes()
const pages = loadPages()
const books = loadBooks(new Set(posts.map(p => p.slug)))
const redirects = loadRedirects()
assertValid()

fs.rmSync(OUT, { recursive: true, force: true })
fs.cpSync("static", OUT, { recursive: true })
fs.cpSync("assets", path.join(OUT, "assets"), { recursive: true })

const written = new Set<string>()
const write = (urlPath: string, content: Html | string) => {
  const file = urlPath.endsWith("/") ? `${urlPath}index.html` : urlPath
  if (written.has(file))
    throw new Error(`같은 주소에 두 번 쓰려고 했다: ${urlPath}`)
  written.add(file)
  const out = path.join(OUT, file)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(
    out,
    typeof content === "string" ? content : toString(content),
  )
}

write("/", homePage(ctx, posts, notes))
write("/blog/", blogIndex(ctx, posts))
for (const [tag] of tagCounts(posts))
  write(tagPath(tag), blogIndex(ctx, posts, tag))
posts.forEach((post, i) =>
  write(postPath(post), postPage(ctx, post, posts[i + 1], posts[i - 1])),
)
write("/notes/", notesPage(ctx, notes))
write("/books/", booksPage(ctx, books))
for (const page of pages) write(`/${page.slug}/`, standalonePage(ctx, page))
write("/404.html", notFoundPage(ctx))

const pagePaths = [...written]
  .map(f => f.replace(/index\.html$/, ""))
  .filter(p => p !== "/404.html")
const published = posts.filter(p => !p.draft)
write("/rss.xml", rss(published))
write("/sitemap.xml", sitemap(pagePaths))

let skipped = 0
for (const [from, to] of Object.entries(redirects)) {
  if (written.has(`${from}index.html`)) {
    skipped++
    continue
  }
  write(from, redirectPage(to))
}

const ms = Math.round(performance.now() - started)
console.log(
  `빌드 완료 ${ms}ms · 글 ${posts.length} · 조각글 ${notes.length} · 책 ${books.length} · ` +
    `리다이렉트 ${Object.keys(redirects).length - skipped}${ctx.dev ? " · dev" : ""}`,
)
