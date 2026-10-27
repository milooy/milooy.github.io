// Drawings: 펼친 스케치북에 그림을 붙여 둔 갤러리. 누르면 크게 보고 ← →로 넘긴다.
// 아래에는 B컷을 구겨 버린 휴지통이 있다. 열면 휴지통이 엎어지고, 종이에 마우스를 올리면 펴진다.
import type { BCut, Drawing } from "../lib/content.ts"
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

// 구겨진 종이는 더 많이 기울이고(-8° ~ 8°) 위아래로 흩뜨린다
const crumpled = (item: BCut) => {
  const h = hash(item.slug)
  const date = item.date ? formatDate(item.date) : ""
  return html`<li
    class="drawing crumpled"
    id="${item.slug}"
    style="--tilt: ${(h % 17) - 8}deg; --drop: ${(h >>> 5) % 13}px"
  >
    <figure>
      <a class="drawing-open" href="/drawings/${item.image}">
        <img src="/drawings/${item.image}" alt="B컷 ${date}" loading="lazy" />
      </a>
      <figcaption>
        <span class="drawing-title">B컷</span>
        <span class="drawing-meta">${date}</span>
      </figcaption>
    </figure>
  </li>`
}

const trash = (bcuts: BCut[]) =>
  html`<details class="trash" id="b-cuts">
    <summary>
      <span class="trash-can"
        >${drawing("trash", "구겨진 종이가 담긴 휴지통")}</span
      >
      <span class="trash-label">
        <span class="eyebrow">B Cuts</span>
        <strong>휴지통</strong>
        <span class="trash-count"
          >걸기엔 민망하고 버리긴 아까운 그림 ${bcuts.length}장</span
        >
        <span class="trash-toggle">
          <span class="when-closed">뒤져 보기 →</span>
          <span class="when-open">다시 주워 담기</span>
        </span>
      </span>
    </summary>
    <ol class="crumpled-list">
      ${bcuts.map(crumpled)}
    </ol>
  </details>`

export const drawingsPage = (
  ctx: BuildContext,
  drawings: Drawing[],
  bcuts: BCut[],
) =>
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
      ${bcuts.length ? trash(bcuts) : ""}
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
