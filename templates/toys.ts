// Toys: 직접 만든 것들을 장난감 상자처럼 늘어놓는다. 전체 목록은 늘 한 번에 보인다.
import type { Toy } from "../lib/content.ts"
import { html, raw } from "../lib/html.ts"
import { drawing, layout, type BuildContext } from "./layout.ts"

const VIDEO = /\.(mp4|webm)$/i

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
      <p class="toy-links">
        <a href="${toy.url}">가지고 놀기 →</a>
        ${toy.repo ? html`<a href="${toy.repo}">소스</a>` : ""}
      </p>
      ${
        toy.html.trim()
          ? html`<details>
              <summary>만든 이야기</summary>
              <div class="prose">${raw(toy.html)}</div>
            </details>`
          : ""
      }
    </div>
  </li>`

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
          <p class="lede">
            재미로, 필요해서 만든 것들. 상자를 열어 직접 가지고 놀아보세요.
          </p>
        </div>
      </header>
      <ul class="toy-list">
        ${toys.map(toyCard)}
      </ul>
    </div>`,
  })
