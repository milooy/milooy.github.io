import MarkdownIt from "markdown-it"
import { createHighlighter } from "shiki"

export type TocItem = { level: number; id: string; text: string }
export type Rendered = { html: string; toc: TocItem[]; text: string }

const LANGS = [
  "js",
  "jsx",
  "ts",
  "tsx",
  "sh",
  "json",
  "yaml",
  "css",
  "html",
  "diff",
  "md",
]
const THEMES = { light: "github-light", dark: "github-dark" }

const highlighter = await createHighlighter({
  themes: Object.values(THEMES),
  langs: LANGS,
})
const loaded = new Set(highlighter.getLoadedLanguages())

const md = new MarkdownIt({
  html: true,
  linkify: true,
  highlight: (code, lang) =>
    highlighter.codeToHtml(code, {
      lang: loaded.has(lang) ? lang : "text",
      themes: THEMES,
      defaultColor: false,
    }),
})

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")

// h2~h4에 id를 붙이고, 목차용으로 h2·h3를 모은다
md.core.ruler.push("heading_ids", state => {
  const seen = new Map<string, number>()
  const toc: TocItem[] = []
  state.tokens.forEach((token, i) => {
    if (token.type !== "heading_open") return
    const text =
      state.tokens[i + 1].children
        ?.filter(t => t.type === "text" || t.type === "code_inline")
        .map(t => t.content)
        .join("")
        .trim() ?? ""
    const base = slugify(text) || "section"
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    const id = count ? `${base}-${count}` : base
    token.attrSet("id", id)
    const level = Number(token.tag.slice(1))
    if (level === 2 || level === 3) toc.push({ level, id, text })
  })
  state.env.toc = toc
})

const defaultImage = md.renderer.rules.image!
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet("loading", "lazy")
  return defaultImage(tokens, idx, options, env, self)
}

// Gatsby 시절 문법: 한 줄짜리 `youtube: URL`
const youtubeId = (url: string) =>
  url.match(/youtu\.be\/([\w-]+)/)?.[1] ?? url.match(/[?&]v=([\w-]+)/)?.[1]

const embedVideos = (src: string) =>
  src.replace(/^`youtube:\s*(\S+?)`\s*$/gm, (line, url: string) => {
    const id = youtubeId(url)
    if (!id) return line
    return `<div class="embed"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube 영상" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>\n`
  })

export const stripTags = (html: string) =>
  html
    .replace(/<pre[\s\S]*?<\/pre>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()

export const render = (src: string): Rendered => {
  const env: { toc?: TocItem[] } = {}
  const html = md.render(embedVideos(src), env)
  return { html, toc: env.toc ?? [], text: stripTags(html) }
}

export const renderInline = (src: string) => md.renderInline(src)
