// content/ 아래 MD + frontmatter를 읽어 타입이 있는 데이터로 바꾼다.
// 형식이 틀린 파일은 모아 두었다가 한 번에 알려준다.
import fs from "node:fs"
import path from "node:path"
import YAML from "yaml"
import { render, type TocItem } from "./markdown.ts"

const CONTENT = path.resolve("content")

export type Post = {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  draft: boolean
  html: string
  toc: TocItem[]
  readingMinutes: number
}

export type Note = {
  id: string
  date: string
  time?: string
  title?: string
  description?: string
  link?: string
  html: string
}

export type Page = {
  slug: string
  title: string
  description: string
  html: string
}

export type Book = {
  slug: string
  title: string
  author?: string
  rating: number
  readAt: string
  cover?: string
  spineColor?: string
  review?: string
  html: string
}

type Doc = {
  file: string
  slug: string
  data: Record<string, unknown>
  body: string
}

const errors: string[] = []

const fail = (doc: Doc, message: string) => {
  errors.push(`${path.relative(process.cwd(), doc.file)}: ${message}`)
}

const readDir = (dir: string): Doc[] => {
  const full = path.join(CONTENT, dir)
  if (!fs.existsSync(full)) return []
  return fs
    .readdirSync(full)
    .filter(f => f.endsWith(".md"))
    .sort()
    .map(f => {
      const file = path.join(full, f)
      const raw = fs.readFileSync(file, "utf8")
      const doc: Doc = { file, slug: f.slice(0, -3), data: {}, body: raw }
      const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
      if (!m) {
        fail(doc, "frontmatter가 없다")
        return doc
      }
      try {
        doc.data = YAML.parse(m[1]) ?? {}
      } catch (e) {
        fail(doc, `frontmatter YAML을 읽지 못했다 (${(e as Error).message})`)
      }
      doc.body = m[2]
      return doc
    })
}

const str = (doc: Doc, key: string, required = false) => {
  const value = doc.data[key]
  if (value == null || value === "") {
    if (required) fail(doc, `\`${key}\`가 필요하다`)
    return undefined
  }
  return String(value).trim()
}

const DATE = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}))?/

const date = (doc: Doc, key: string) => {
  const value = str(doc, key, true)
  const m = value?.match(DATE)
  if (value && !m)
    fail(doc, `\`${key}\`는 YYYY-MM-DD 형식이어야 한다 (지금: ${value})`)
  return { date: m?.[1] ?? "1970-01-01", time: m?.[2] }
}

const READ_AT = /^\d{4}(-\d{2})?$/

export const loadPosts = (includeDrafts: boolean): Post[] =>
  readDir("posts")
    .map(doc => {
      const tags = doc.data.tags
      if (!Array.isArray(tags) || tags.length === 0)
        fail(doc, "`tags`에 태그가 하나 이상 필요하다")
      const { html, toc, text } = render(doc.body)
      return {
        slug: doc.slug,
        title: str(doc, "title", true) ?? doc.slug,
        date: date(doc, "date").date,
        tags: Array.isArray(tags) ? tags.map(t => String(t).toLowerCase()) : [],
        description: str(doc, "description") ?? `${text.slice(0, 120)}…`,
        draft: doc.data.draft === true,
        html,
        toc,
        // 한글 기준 분당 500자
        readingMinutes: Math.max(1, Math.round(text.length / 500)),
      }
    })
    .filter(post => includeDrafts || !post.draft)
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    )

export const loadNotes = (): Note[] =>
  readDir("notes")
    .map(doc => {
      const { date: d, time } = date(doc, "date")
      return {
        id: doc.slug,
        date: d,
        time,
        title: str(doc, "title"),
        description: str(doc, "description"),
        link: str(doc, "link"),
        html: render(doc.body).html,
      }
    })
    .sort((a, b) =>
      `${b.date}${b.time ?? ""}`.localeCompare(`${a.date}${a.time ?? ""}`),
    )

export const loadPages = (): Page[] =>
  readDir("pages").map(doc => ({
    slug: doc.slug,
    title: str(doc, "title", true) ?? doc.slug,
    description: str(doc, "description") ?? "",
    html: render(doc.body).html,
  }))

export const loadBooks = (postSlugs: Set<string>): Book[] =>
  readDir("books").map(doc => {
    const rating = Number(doc.data.rating)
    if (!(
      rating >= 0.5 &&
      rating <= 5 &&
      rating * 2 === Math.round(rating * 2)
    ))
      fail(
        doc,
        `\`rating\`은 0.5~5 사이 0.5 단위여야 한다 (지금: ${doc.data.rating})`,
      )
    const readAt = str(doc, "readAt", true) ?? ""
    if (readAt && !READ_AT.test(readAt))
      fail(doc, `\`readAt\`은 YYYY 또는 YYYY-MM이어야 한다 (지금: ${readAt})`)
    const review = str(doc, "review")
    if (review && !postSlugs.has(review))
      fail(doc, `\`review\`에 적은 글(${review})이 posts/에 없다`)
    return {
      slug: doc.slug,
      title: str(doc, "title", true) ?? doc.slug,
      author: str(doc, "author"),
      rating,
      readAt,
      cover: str(doc, "cover"),
      spineColor: str(doc, "spineColor"),
      review,
      html: render(doc.body).html,
    }
  })

export const loadRedirects = (): Record<string, string> => {
  const file = path.join(CONTENT, "redirects.yaml")
  return fs.existsSync(file)
    ? (YAML.parse(fs.readFileSync(file, "utf8")) ?? {})
    : {}
}

export const assertValid = () => {
  if (errors.length === 0) return
  console.error(
    `콘텐츠 형식 오류 ${errors.length}개:\n  ${errors.join("\n  ")}`,
  )
  process.exit(1)
}
