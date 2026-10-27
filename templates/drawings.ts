// Drawings: 펼친 스케치북에 그림을 붙여 둔 갤러리. 누르면 크게 보고 ← →로 넘긴다.
import type { Drawing } from "../lib/content.ts"
import { html, raw } from "../lib/html.ts"
import { drawing, formatDate, layout, type BuildContext } from "./layout.ts"

const hash = (s: string) =>
  [...s].reduce((h, c) => (h * 31 + c.codePointAt(0)!) >>> 0, 7)

// 손으로 붙인 듯 그림마다 조금씩 기울인다 (-1.5° ~ 1.5°)
const tilt = (slug: string) => ((hash(slug) % 31) - 15) / 10

const caption = (item: Drawing) =>
  html`<span class="drawing-title">${item.title}</span>
    <span class="drawing-meta"
      >${formatDate(item.date)}${item.medium ? ` · ${item.medium}` : ""}</span
    >`

const piece = (item: Drawing) =>
  html`<li
    class="drawing"
    id="${item.slug}"
    style="--tilt: ${tilt(item.slug)}deg"
  >
    <figure>
      <a class="drawing-open" href="/drawings/${item.image}">
        <img src="/drawings/${item.image}" alt="${item.title}" loading="lazy" />
      </a>
      <figcaption>${caption(item)}</figcaption>
    </figure>
    ${
      item.html.trim()
        ? html`<div class="drawing-story" hidden>${raw(item.html)}</div>`
        : ""
    }
  </li>`

export const drawingsPage = (ctx: BuildContext, drawings: Drawing[]) =>
  layout(ctx, {
    path: "/drawings/",
    title: "Drawings",
    description: "그린 그림들",
    mode: "showcase",
    styles: ["/assets/css/showcase.css", "/assets/css/drawings.css"],
    scripts: ["/assets/js/drawings.js"],
    body: html`<div class="showcase">
      <header class="section-head">
        <div class="section-drawing">
          ${drawing("drawings", "펼친 스케치북과 연필")}
        </div>
        <div>
          <h1>Drawings</h1>
          <p class="lede">
            틈틈이 그린 그림 ${drawings.length}장. 누르면 크게 볼 수 있어요.
          </p>
        </div>
      </header>
      <div class="sketchbook">
        <ol class="drawing-list">
          ${drawings.map(piece)}
        </ol>
      </div>
      <dialog class="viewer" aria-label="그림 크게 보기">
        <figure>
          <img alt="" />
          <figcaption></figcaption>
        </figure>
        <div class="viewer-story"></div>
        <div class="viewer-nav">
          <button type="button" data-step="-1" aria-label="이전 그림">←</button>
          <span class="viewer-count"></span>
          <button type="button" data-step="1" aria-label="다음 그림">→</button>
        </div>
        <form method="dialog">
          <button class="viewer-close" aria-label="닫기">×</button>
        </form>
      </dialog>
    </div>`,
  })
