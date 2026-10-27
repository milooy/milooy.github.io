import type { Post } from "../lib/content.ts"
import { html, raw } from "../lib/html.ts"
import { site } from "../lib/site.ts"
import { formatDate, layout, type BuildContext } from "./layout.ts"

const READING_STYLES = ["/assets/css/reading.css"]

// 목차는 소제목이 이만큼 이상인 긴 글에만 붙인다
const TOC_MIN = 4

export const postPath = (post: Post) => `/blog/${post.slug}/`
export const tagPath = (tag: string) => `/blog/tags/${tag}/`

export const tagCounts = (posts: Post[]) => {
  const counts = new Map<string, number>()
  for (const post of posts)
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

const tagLinks = (tags: string[]) =>
  html`<ul class="tags">
    ${tags.map(tag => html`<li><a href="${tagPath(tag)}">#${tag}</a></li>`)}
  </ul>`

const postItem = (post: Post) =>
  html`<li>
    <time datetime="${post.date}">${formatDate(post.date).slice(5)}</time>
    <div>
      <a class="post-title" href="${postPath(post)}">${post.title}</a>
      ${post.draft ? html`<span class="draft">초안</span>` : ""}
      <p>${post.description}</p>
      ${tagLinks(post.tags)}
    </div>
  </li>`

const postSection = (heading: string, posts: Post[]) =>
  html`<section class="year">
    <h2>${heading}</h2>
    <ol class="post-list">
      ${posts.map(postItem)}
    </ol>
  </section>`

export const postList = (posts: Post[]) => {
  const byYear = new Map<string, Post[]>()
  for (const post of posts) {
    const year = post.date.slice(0, 4)
    byYear.set(year, [...(byYear.get(year) ?? []), post])
  }
  return [...byYear].map(([year, items]) => postSection(year, items))
}

// 전체 목록에서는 고정한 글(pinned)을 맨 위에 따로 모으고, 아래 연도별 목록에서는 뺀다.
// 태그로 거른 목록은 날짜 순서 그대로 둔다.
const pinnedFirst = (posts: Post[]) => {
  const pinned = posts.filter(p => p.pinned)
  return html`${pinned.length ? postSection("고정", pinned) : ""}${postList(
    posts.filter(p => !p.pinned),
  )}`
}

export const blogIndex = (
  ctx: BuildContext,
  posts: Post[],
  activeTag?: string,
) => {
  const shown = activeTag
    ? posts.filter(p => p.tags.includes(activeTag))
    : posts
  const path = activeTag ? tagPath(activeTag) : "/blog/"
  return layout(ctx, {
    path,
    title: activeTag ? `#${activeTag}` : "Blog",
    description: activeTag
      ? `#${activeTag} 태그가 붙은 글 ${shown.length}편`
      : undefined,
    mode: "reading",
    styles: READING_STYLES,
    body: html`<div class="reading">
      <header class="page-head">
        <h1>
          ${activeTag ? html`<a href="/blog/">Blog</a> / #${activeTag}` : "Blog"}
        </h1>
        <p class="lede">현상 밑의 패턴을 찾아서. ${posts.length}편.</p>
      </header>
      <nav class="tag-filter" aria-label="태그로 거르기">
        <ul>
          <li>
            <a href="/blog/" ${activeTag ? "" : raw('aria-current="page"')}
              >전체</a
            >
          </li>
          ${tagCounts(posts).map(
            ([tag, count]) =>
              html`<li>
                <a
                  href="${tagPath(tag)}"
                  ${tag === activeTag ? raw('aria-current="page"') : ""}
                  >#${tag} <span>${count}</span></a
                >
              </li>`,
          )}
        </ul>
      </nav>
      ${activeTag ? postList(shown) : pinnedFirst(shown)}
    </div>`,
  })
}

export const comments = () => {
  const { repo, repoId, category, categoryId } = site.giscus
  if (!repoId || !categoryId) return ""
  return html`<section class="comments" aria-label="댓글">
    <script
      src="https://giscus.app/client.js"
      data-repo="${repo}"
      data-repo-id="${repoId}"
      data-category="${category}"
      data-category-id="${categoryId}"
      data-mapping="pathname"
      data-strict="0"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="top"
      data-theme="preferred_color_scheme"
      data-lang="ko"
      data-loading="lazy"
      crossorigin="anonymous"
      async
    ></script>
  </section>`
}

export const postPage = (
  ctx: BuildContext,
  post: Post,
  prev?: Post,
  next?: Post,
) =>
  layout(ctx, {
    path: postPath(post),
    title: post.title,
    description: post.description,
    mode: "reading",
    styles: READING_STYLES,
    body: html`<article class="reading post">
      <header class="post-head">
        <h1>${post.title}</h1>
        <p class="meta">
          <time datetime="${post.date}">${formatDate(post.date)}</time>
          <span>${post.readingMinutes}분</span>
          ${post.draft ? html`<span class="draft">초안</span>` : ""}
        </p>
        ${tagLinks(post.tags)}
      </header>
      ${
        post.toc.length >= TOC_MIN
          ? html`<nav class="toc" aria-label="목차">
              <p>목차</p>
              <ol>
                ${post.toc.map(
                  item =>
                    html`<li class="toc-${item.level}">
                      <a href="#${item.id}">${item.text}</a>
                    </li>`,
                )}
              </ol>
            </nav>`
          : ""
      }
      <div class="prose">${raw(post.html)}</div>
      <footer class="post-foot">
        <nav class="pager" aria-label="이전·다음 글">
          ${
            next
              ? html`<a class="newer" href="${postPath(next)}"
                  ><span>다음 글</span>${next.title}</a
                >`
              : html`<span></span>`
          }
          ${prev ? html`<a class="older" href="${postPath(prev)}"><span>이전 글</span>${prev.title}</a>` : ""}
        </nav>
        ${comments()}
      </footer>
    </article>`,
  })
