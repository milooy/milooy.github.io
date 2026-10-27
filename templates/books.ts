import type { Book } from "../lib/content.ts"
import { html, raw } from "../lib/html.ts"
import { drawing, layout, type BuildContext } from "./layout.ts"

const SHELVES = [
  { label: "5점", note: "나를 바꾼 책", min: 5 },
  { label: "4점대", note: "꼭 권하고 싶은 책", min: 4 },
  { label: "3점대", note: "시간 내서 읽어볼 만한 책", min: 3 },
  { label: "2점대", note: "시간이 있다면", min: 2 },
  { label: "1점대 이하", note: "나에겐 크게 남지 않은 책", min: 0 },
]

// 표지가 없는 동안 쓰는 책등 색. 천 장정 느낌의 차분한 색들.
const SPINE_COLORS = [
  "#7a3b2e",
  "#2f4858",
  "#5c6b3c",
  "#b5893b",
  "#3e3a5f",
  "#8c5a6e",
  "#2e5e4e",
  "#c2b8a3",
  "#d9cbb0",
  "#4a4a48",
  "#9c6b3f",
  "#6e8a99",
]

const hash = (s: string) =>
  [...s].reduce((h, c) => (h * 31 + c.codePointAt(0)!) >>> 0, 7)

const isLight = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255]
  return 0.299 * r + 0.587 * g + 0.114 * b > 150
}

const spineStyle = (book: Book) => {
  const h = hash(book.title)
  const color = book.spineColor ?? SPINE_COLORS[h % SPINE_COLORS.length]
  const height = 78 + (h % 23)
  const width = Math.min(56, Math.max(30, 22 + [...book.title].length * 1.6))
  return `--spine:${color};--spine-ink:${isLight(color) ? "#2a2622" : "#f5f1e8"};--h:${height};--w:${Math.round(width)}px`
}

const stars = (rating: number) =>
  "★".repeat(Math.floor(rating)) + (rating % 1 ? "½" : "")

const year = (book: Book) => book.readAt.slice(0, 4)

const bookCard = (book: Book) =>
  html`<div class="book-card" id="book-${book.slug}" hidden>
    <p class="book-card-rating" aria-label="5점 만점에 ${book.rating}점">
      <span aria-hidden="true">${stars(book.rating)}</span> ${book.rating}
    </p>
    <h3>${book.title}</h3>
    <p class="book-card-meta">
      ${book.author ? `${book.author} · ` : ""}${year(book)}년에 읽음
    </p>
    ${book.html.trim() ? html`<div class="book-card-note">${raw(book.html)}</div>` : ""}
    ${book.review ? html`<p><a href="/blog/${book.review}/">리뷰 읽기 →</a></p>` : ""}
  </div>`

const shelf = (index: number, books: Book[]) => {
  const { label, note } = SHELVES[index]
  return html`<section class="shelf" aria-labelledby="shelf-${index}">
    <header class="shelf-label">
      <h2 id="shelf-${index}">${label}</h2>
      <p>${note} · <span class="shelf-count">${books.length}</span>권</p>
    </header>
    <div class="shelf-row">
      ${books.map(
        book =>
          html`<button
            type="button"
            class="spine"
            style="${spineStyle(book)}"
            data-year="${year(book)}"
            aria-expanded="false"
            aria-controls="book-${book.slug}"
            title="${book.title} · ${book.rating}점"
          >
            <span>${book.title}</span>
          </button>`,
      )}
    </div>
    <div class="book-cards">${books.map(bookCard)}</div>
  </section>`
}

export const booksPage = (ctx: BuildContext, books: Book[]) => {
  const sorted = [...books].sort(
    (a, b) =>
      b.rating - a.rating ||
      b.readAt.localeCompare(a.readAt) ||
      a.title.localeCompare(b.title),
  )
  const grouped = SHELVES.map(s => sorted.filter(b => b.rating >= s.min))
  const shelves = grouped.map((list, i) =>
    list.filter(b => i === 0 || b.rating < SHELVES[i - 1].min),
  )
  const years = [...new Set(books.map(year))].sort().reverse()
  return layout(ctx, {
    path: "/books/",
    title: "Books",
    description: `읽은 책 ${books.length}권을 별점별 책장에 꽂아 두었어요.`,
    mode: "showcase",
    styles: ["/assets/css/books.css"],
    scripts: ["/assets/js/books.js"],
    body: html`<div class="books">
      <header class="books-head">
        <div class="books-drawing">${drawing("books", "책 몇 권과 화분")}</div>
        <div>
          <h1>Books</h1>
          <p class="lede">You are what you read, ${books.length}권</p>
          <div class="year-filter" role="group" aria-label="읽은 해로 거르기">
            <button type="button" data-year="" aria-pressed="true">전체</button>
            ${years.map(y => html`<button type="button" data-year="${y}" aria-pressed="false">${y}</button>`)}
          </div>
        </div>
      </header>
      ${shelves.map((list, i) => (list.length ? shelf(i, list) : ""))}
    </div>`,
  })
}
