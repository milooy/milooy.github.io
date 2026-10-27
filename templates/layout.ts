import fs from "node:fs"
import { html, raw, type Html } from "../lib/html.ts"
import { site } from "../lib/site.ts"

export type Mode = "reading" | "showcase"

export type LayoutProps = {
  path: string
  title?: string
  description?: string
  mode: Mode
  styles?: string[]
  scripts?: string[]
  body: Html
}

export type BuildContext = { dev: boolean }

// 임시 손그림. assets/drawings/<name>.svg 파일을 바꾸면 사이트 전체에 반영된다.
export const drawing = (name: string, label = "") => {
  const svg = fs.readFileSync(`assets/drawings/${name}.svg`, "utf8")
  return raw(
    label
      ? svg.replace("<svg", `<svg role="img" aria-label="${label}"`)
      : svg.replace("<svg", '<svg aria-hidden="true"'),
  )
}

const isCurrent = (path: string, href: string) =>
  path === href || path.startsWith(href)

const analytics = () => html`
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=${site.gaId}"
  ></script>
  <script>
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    gtag("js", new Date())
    gtag("config", "${site.gaId}")
  </script>
`

// 개발 서버 스크립트: 다시 빌드하면 새로고침, CSS 교체, 빌드 에러 표시 (scripts/dev-client.js)
const devClient = () => html`<script src="/__dev.js"></script>`

export const layout = (ctx: BuildContext, props: LayoutProps) => {
  const { path, title, mode, body, styles = [], scripts = [] } = props
  const description = props.description || site.description
  const fullTitle = title ? `${title} · ${site.title}` : site.title
  return html`<!doctype html>
    <html lang="${site.lang}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${fullTitle}</title>
        <meta name="description" content="${description}" />
        <link rel="canonical" href="${site.url}${path}" />
        <meta
          property="og:type"
          content="${path.startsWith("/blog/") && path !== "/blog/" ? "article" : "website"}"
        />
        <meta property="og:title" content="${title ?? site.title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:url" content="${site.url}${path}" />
        <meta property="og:locale" content="ko_KR" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="${site.title}"
          href="/rss.xml"
        />
        <link rel="stylesheet" href="/assets/css/tokens.css" />
        <link rel="stylesheet" href="/assets/css/base.css" />
        ${styles.map(href => html`<link rel="stylesheet" href="${href}" />`)}
        ${ctx.dev ? "" : analytics()}
      </head>
      <body class="mode-${mode}">
        <a class="skip-link" href="#main">본문으로 건너뛰기</a>
        <header class="site-header">
          <a class="logo" href="/">${site.title}</a>
          <nav aria-label="사이트">
            <ul>
              ${site.nav.map(
                item =>
                  html`<li>
                    <a
                      href="${item.href}"
                      ${isCurrent(path, item.href) ? raw('aria-current="page"') : ""}
                      >${item.label}</a
                    >
                  </li>`,
              )}
            </ul>
          </nav>
        </header>
        <main id="main">${body}</main>
        <footer class="site-footer">
          <div class="divider">${drawing("divider")}</div>
          <p>
            © ${new Date().getFullYear()} ${site.title} ·
            <a href="/rss.xml">RSS</a> ·
            <a href="${site.github}">GitHub</a>
          </p>
        </footer>
        ${scripts.map(src => html`<script type="module" src="${src}"></script>`)}
        ${ctx.dev ? devClient() : ""}
      </body>
    </html> `
}

export const formatDate = (date: string) => date.replaceAll("-", ".")
