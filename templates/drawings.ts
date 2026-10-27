// Drawings: 현대미술 갤러리. 크고 작은 액자를 벽에 건다.
// 한 줄은 같은 높이로 가운데 선에 맞춰 걸고, 줄마다 높이를 달리해 크고 작은 리듬을 만든다. 세로로 스크롤한다.
// 액자 아래 명패에 제목과 날짜. 누르면 그림 앞으로 다가간다(줌).
// 오른쪽 아래 구석에는 B컷을 구겨 버린 휴지통이 늘 떠 있다. 누르면 휴지통이 엎어지며 구겨진 종이가 쏟아지고,
// 종이에 마우스를 올리면 펴진다.
import type { BCut, Drawing } from "../lib/content.ts"
import { html, raw } from "../lib/html.ts"
import { drawing, formatDate, layout, type BuildContext } from "./layout.ts"

const hash = (s: string) =>
  [...s].reduce((h, c) => (h * 31 + c.codePointAt(0)!) >>> 0, 7)

// frontmatter에 없으면 그림마다 정해진 값으로 섞는다 (빌드할 때마다 같다)
const SIZES = ["s", "m", "l", "m", "s", "m", "l", "m"] as const
const FRAMES = ["black", "white", "wood", "black", "none", "white"] as const
type Frame = (typeof FRAMES)[number]

const sizeOf = (item: Drawing) =>
  item.size ?? SIZES[hash(item.slug) % SIZES.length]
const frameOf = (item: Drawing): Frame =>
  item.frame ?? FRAMES[(hash(item.slug) >>> 4) % FRAMES.length]
const ratioOf = (item: Drawing) => item.width / item.height

// 줄 높이(그림 높이). 벽 폭에 대한 비율이다. 줄의 첫 그림 크기로 정한다.
const ROW_H = { l: 0.4, m: 0.31, s: 0.26 }
const ROW_MAX = { l: 2, m: 3, s: 3 }
// 액자 한쪽 두께(매트 + 테두리). 줄 높이에 대한 비율로, CSS의 --pad + --bw와 같다.
// 재료(색)만 다르고 모양은 모두 같다. 액자 없는 그림만 0.
const EDGE: Record<Frame, number> = {
  black: 0.1,
  white: 0.1,
  wood: 0.1,
  none: 0,
}
const GAP = 0.04 // 그림 사이. CSS의 column-gap(4cqi)과 같다

const work = (item: Drawing) =>
  html`<figure
    class="work frame-${frameOf(item)}"
    id="${item.slug}"
    style="--ratio: ${ratioOf(item).toFixed(4)}"
  >
    <a class="frame" href="/drawings/${item.image}">
      <img
        src="/drawings/${item.image}"
        width="${item.width}"
        height="${item.height}"
        alt="${item.title}"
        loading="lazy"
      />
    </a>
    <figcaption class="placard">
      <span class="placard-title">${item.title}</span>
      <span class="placard-meta">
        <time datetime="${item.date}">${formatDate(item.date)}</time>${
          item.medium ? ` · ${item.medium}` : ""
        }
      </span>
    </figcaption>
    ${
      item.html.trim()
        ? html`<div class="work-story" hidden>${raw(item.html)}</div>`
        : ""
    }
  </figure>`

// 벽에 걸었을 때 차지하는 폭 (벽 폭에 대한 비율)
const widthAt = (item: Drawing, rowH: number) =>
  rowH * (ratioOf(item) + 2 * EDGE[frameOf(item)])

// 줄을 나눈다. 줄 높이는 첫 그림 크기로 정하고, 같은 높이로 들어가는 만큼 옆에 붙인다.
// 조금 넘치는 정도면 같이 걸고 줄 높이를 살짝 낮춰 맞춘다(그림 하나만 덩그러니 남지 않게).
// 큰 줄(한두 점)과 작은 줄(세 점까지)이 섞여서 크고 작은 리듬이 생긴다. 해가 바뀌면 줄을 바꾼다.
const FILL = 0.98
const STRETCH = 1.3
const rowWidth = (items: Drawing[], h: number) =>
  items.reduce((w, it) => w + widthAt(it, h), 0) + GAP * (items.length - 1)

const plan = (drawings: Drawing[]) => {
  const rows: { h: number; items: Drawing[] }[] = []
  for (const item of drawings) {
    const last = rows.at(-1)
    const fits =
      last &&
      last.items.length < ROW_MAX[sizeOf(last.items[0])] &&
      last.items[0].date.slice(0, 4) === item.date.slice(0, 4) &&
      rowWidth([...last.items, item], last.h) <= STRETCH
    if (fits) last.items.push(item)
    else rows.push({ h: ROW_H[sizeOf(item)], items: [item] })
  }
  // 넘치는 줄은 높이를 낮춰 벽 폭에 맞춘다
  for (const row of rows) {
    const width = rowWidth(row.items, row.h)
    if (width > FILL) {
      const gaps = GAP * (row.items.length - 1)
      row.h = (row.h * (FILL - gaps)) / (width - gaps)
    }
  }
  return rows
}

// 한 줄은 같은 높이로 맞추고 가운데 선에 건다. 해가 바뀌는 자리마다 연도를 작게 적어 둔다.
const hang = (drawings: Drawing[]) => {
  const rows = plan(drawings)
  return rows.map(({ h, items }, i) => {
    const year = items[0].date.slice(0, 4)
    const mark =
      i === 0 || rows[i - 1].items[0].date.slice(0, 4) !== year
        ? html`<p class="year-mark">${year}</p>`
        : ""
    return html`${mark}
      <div class="hang-row" style="--h: ${h.toFixed(4)}">
        ${items.map(work)}
      </div>`
  })
}

// 구겨진 종이는 더 많이 기울이고(-8° ~ 8°) 위아래로 흩뜨린다
const crumpled = (item: BCut) => {
  const h = hash(item.slug)
  const date = item.date ? formatDate(item.date) : ""
  return html`<li
    class="crumpled"
    id="${item.slug}"
    style="--tilt: ${(h % 17) - 8}deg; --drop: ${(h >>> 5) % 13}px"
  >
    <figure>
      <a class="crumpled-open" href="/drawings/${item.image}">
        <img src="/drawings/${item.image}" alt="B컷 ${date}" loading="lazy" />
      </a>
      <figcaption>
        <span class="crumpled-title">B컷</span>
        <span class="crumpled-meta">${date}</span>
      </figcaption>
    </figure>
  </li>`
}

const trash = (bcuts: BCut[]) =>
  html`<details class="trash" id="b-cuts">
    <summary aria-label="B컷 휴지통, ${bcuts.length}장">
      <span class="trash-can">${drawing("trash")}</span>
      <span class="trash-badge" aria-hidden="true">${bcuts.length}</span>
    </summary>
    <div class="trash-panel">
      <header class="trash-head">
        <p class="eyebrow">B Cuts</p>
        <h2>휴지통</h2>
        <p class="trash-count">차마 못 버린 ${bcuts.length}장</p>
      </header>
      <ol class="crumpled-list">
        ${bcuts.map(crumpled)}
      </ol>
    </div>
  </details>`

export const drawingsPage = (
  ctx: BuildContext,
  drawings: Drawing[],
  bcuts: BCut[],
) => {
  return layout(ctx, {
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
              프론트 개발자는 그림을 그려야지, ${drawings.length}장
            </p>
          </div>
        </header>
      </div>
      <section class="gallery" aria-label="전시장">
        <div class="gallery-camera">
          <div class="hang">${hang(drawings)}</div>
        </div>
        <div class="gallery-note" aria-live="polite"></div>
      </section>
      ${bcuts.length ? trash(bcuts) : ""}
      <dialog class="viewer" aria-label="B컷 크게 보기">
        <figure>
          <img alt="" />
          <figcaption></figcaption>
        </figure>
        <div class="viewer-nav">
          <button type="button" data-step="-1" aria-label="이전 그림">←</button>
          <span class="viewer-count"></span>
          <button type="button" data-step="1" aria-label="다음 그림">→</button>
        </div>
        <form method="dialog">
          <button class="viewer-close" aria-label="닫기">×</button>
        </form>
      </dialog> `,
  })
}
