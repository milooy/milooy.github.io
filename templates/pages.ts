// 홈, 조각글, 단독 페이지, 404, 리다이렉트
import type { Note, Page, Post } from "../lib/content.ts"
import { html, raw } from "../lib/html.ts"
import { site } from "../lib/site.ts"
import { comments, postList } from "./blog.ts"
import { drawing, formatDate, layout, type BuildContext } from "./layout.ts"

const READING_STYLES = ["/assets/css/reading.css"]

// M5에서 손그림 일러스트와 함께 다시 만든다. 지금은 최근 글로 가는 길만 있는 임시 홈.
export const homePage = (ctx: BuildContext, posts: Post[], notes: Note[]) =>
  layout(ctx, {
    path: "/",
    mode: "showcase",
    styles: ["/assets/css/home.css", ...READING_STYLES],
    scripts: ["/assets/js/home.js"],
    body: html`<section class="hero">
        <div class="hero-drawing">
          ${drawing("home", "노트북, 깃발, 붓, 책이 놓인 책상")}
        </div>
        <h1>${site.title}</h1>
        ${saying()}
      </section>
      <div class="reading">
        <section class="home-section">
          <h2><a href="/blog/">최근 글</a></h2>
          ${postList(posts.slice(0, 5))}
          <p class="more">
            <a href="/blog/">글 ${posts.length}편 모두 보기 →</a>
          </p>
        </section>
        <section class="home-section">
          <h2><a href="/notes/">조각글</a></h2>
          <ol class="note-list compact">
            ${notes.slice(0, 3).map(note => noteItem(note, true))}
          </ol>
        </section>
      </div>`,
  })

// 이름 밑 혼잣말. 스크립트가 없으면 첫 마디만 보인다 (assets/js/home.js)
const saying = () =>
  html`<button
    type="button"
    class="saying"
    data-sayings="${JSON.stringify(site.sayings)}"
  >
    <span class="saying-frame">${drawing("saying-box")}</span>
    <span class="saying-text">
      <span class="saying-full">${site.sayings[0]}</span>
      <span class="saying-typed" aria-hidden="true"></span>
    </span>
    <span class="saying-next">${drawing("next", "다음 말")}</span>
  </button>`

// 홈에서는 제목을 눌러 조각글 타임라인의 그 자리로 간다
const noteItem = (note: Note, linkTitle = false) =>
  html`<li class="note" id="${note.id}">
    <a class="note-date" href="/notes/#${note.id}">
      <time datetime="${note.date}${note.time ? `T${note.time}` : ""}"
        >${formatDate(note.date)}${note.time ? ` ${note.time}` : ""}</time
      >
    </a>
    <div class="note-body">
      ${
        note.title
          ? html`<h3>
              ${
                linkTitle
                  ? html`<a href="/notes/#${note.id}">${note.title}</a>`
                  : note.title
              }
            </h3>`
          : ""
      }
      ${note.description ? html`<p class="note-desc">${note.description}</p>` : ""}
      <div class="prose">${raw(note.html)}</div>
      ${
        note.image
          ? html`<img
              class="note-image"
              src="${note.image}"
              alt=""
              loading="lazy"
            />`
          : ""
      }
      ${note.link ? html`<p><a href="${note.link}">${note.link}</a></p>` : ""}
    </div>
  </li>`

export const notesPage = (ctx: BuildContext, notes: Note[]) => {
  const byYear = new Map<string, Note[]>()
  for (const note of notes) {
    const year = note.date.slice(0, 4)
    byYear.set(year, [...(byYear.get(year) ?? []), note])
  }
  return layout(ctx, {
    path: "/notes/",
    title: "Notes",
    description: "짧게 남기는 조각글",
    mode: "reading",
    styles: READING_STYLES,
    body: html`<div class="reading">
      <header class="page-head">
        <h1>Notes</h1>
        <p class="lede">포슬포슬 굽다 만 조각</p>
      </header>
      ${[...byYear].map(
        ([year, items]) =>
          html`<section class="year">
            <h2>${year}</h2>
            <ol class="note-list">
              ${items.map(note => noteItem(note))}
            </ol>
          </section>`,
      )}
    </div>`,
  })
}

export const standalonePage = (ctx: BuildContext, page: Page) =>
  layout(ctx, {
    path: `/${page.slug}/`,
    title: page.title,
    description: page.description,
    mode: "reading",
    styles: READING_STYLES,
    body: html`<article class="reading post">
      <header class="post-head">
        <h1>${page.title}</h1>
        ${page.description ? html`<p class="lede">${page.description}</p>` : ""}
      </header>
      <div class="prose">${raw(page.html)}</div>
      <footer class="post-foot">${comments()}</footer>
    </article>`,
  })

export const notFoundPage = (ctx: BuildContext) =>
  layout(ctx, {
    path: "/404.html",
    title: "페이지를 찾을 수 없어요",
    mode: "reading",
    styles: READING_STYLES,
    body: html`<div class="reading not-found">
      <h1>404</h1>
      <p>찾는 페이지가 없어요. 주소가 바뀌었을 수도 있어요.</p>
      <p><a href="/blog/">글 목록으로 가기 →</a></p>
    </div>`,
  })

export const redirectPage = (to: string) => {
  const canonical = site.url + to.split("#")[0]
  return html`<!doctype html>
    <html lang="${site.lang}">
      <head>
        <meta charset="utf-8" />
        <title>옮겨진 페이지</title>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="${canonical}" />
        <meta http-equiv="refresh" content="0; url=${to}" />
      </head>
      <body>
        <p><a href="${to}">새 주소</a>로 옮겨졌어요.</p>
      </body>
    </html> `
}
