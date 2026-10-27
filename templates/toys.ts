// Toys: 직접 만든 것들을 장난감 상자처럼 늘어놓는다. 전체 목록은 늘 한 번에 보인다.
// 만든 이야기(md 본문)는 Blog 글처럼 읽기 모드 페이지로 따로 연다.
import type { Toy } from "../lib/content.ts"
import { html, raw } from "../lib/html.ts"
import { comments } from "./blog.ts"
import { drawing, layout, type BuildContext } from "./layout.ts"

const VIDEO = /\.(mp4|webm)$/i

export const toyPath = (toy: Toy) => `/toys/${toy.slug}/`
export const hasStory = (toy: Toy) => toy.html.trim() !== ""

const toyLinks = (toy: Toy, story: boolean) =>
  html`<p class="toy-links">
    <a href="${toy.url}">가지고 놀기 →</a>
    ${story && hasStory(toy) ? html`<a href="${toyPath(toy)}">만든 이야기</a>` : ""}
    ${toy.repo ? html`<a href="${toy.repo}">소스</a>` : ""}
  </p>`

// 미리보기는 md 옆 파일(움직이는 gif·영상 권장). 없으면 임시 그림을 넣는다.
const preview = (toy: Toy) => {
  if (!toy.preview) return drawing("toys")
  const src = `/toys/${toy.preview}`
  return VIDEO.test(toy.preview)
    ? html`<video src="${src}" autoplay muted loop playsinline></video>`
    : html`<img src="${src}" alt="" loading="lazy" />`
}

const toyCard = (toy: Toy) =>
  html`<li class="toy">
    <a class="toy-window" href="${toy.url}" tabindex="-1" aria-hidden="true"
      >${preview(toy)}</a
    >
    <div class="toy-body">
      <h2><a href="${toy.url}">${toy.title}</a></h2>
      <p class="toy-summary">${toy.summary}</p>
      <p class="toy-meta">
        <span>${toy.year}</span>
        ${toy.stack.map(s => html`<span>${s}</span>`)}
      </p>
      ${toyLinks(toy, true)}
    </div>
  </li>`

export const toyPage = (ctx: BuildContext, toy: Toy) =>
  layout(ctx, {
    path: toyPath(toy),
    title: toy.title,
    description: toy.summary,
    mode: "reading",
    styles: ["/assets/css/reading.css", "/assets/css/toys.css"],
    body: html`<article class="reading post">
      <header class="post-head">
        <h1>${toy.title}</h1>
        <p class="meta">
          <span>${toy.year}</span>
          ${toy.stack.map(s => html`<span>${s}</span>`)}
        </p>
        <p class="lede">${toy.summary}</p>
        ${toyLinks(toy, false)}
      </header>
      <div class="prose">${raw(toy.html)}</div>
      <footer class="post-foot">
        <nav class="pager" aria-label="Toys">
          <a href="/toys/"><span>Toys</span>장난감 상자로 돌아가기</a>
        </nav>
        ${comments()}
      </footer>
    </article>`,
  })

export const toysPage = (ctx: BuildContext, toys: Toy[]) =>
  layout(ctx, {
    path: "/toys/",
    title: "Toys",
    description: "직접 만든 장난감들",
    mode: "showcase",
    styles: ["/assets/css/showcase.css", "/assets/css/toys.css"],
    body: html`<div class="showcase">
      <header class="section-head">
        <div class="section-drawing">
          ${drawing("toys", "장난감 상자와 팽이")}
        </div>
        <div>
          <h1>Toys</h1>
          <p class="lede">만들면 기분이 조커든요</p>
        </div>
      </header>
      <ul class="toy-list">
        ${toys.map(toyCard)}
      </ul>
    </div>`,
  })
