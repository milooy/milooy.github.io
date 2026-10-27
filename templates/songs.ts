// Songs: 플레이리스트 하나. 커버 + 트랙 목록, 트랙을 누르면 페이지 안 SoundCloud 위젯이 튼다.
import type { Song } from "../lib/content.ts"
import { html, raw } from "../lib/html.ts"
import { drawing, formatDate, layout, type BuildContext } from "./layout.ts"

const PROFILE = "https://soundcloud.com/hellojayjin"

const seconds = (duration?: string) => {
  const [m, s] = (duration ?? "0:00").split(":").map(Number)
  return m * 60 + s
}

const track = (song: Song, i: number) =>
  html`<li class="track" data-src="${song.soundcloud}">
    <span class="track-no" aria-hidden="true">${i + 1}</span>
    ${
      song.cover
        ? html`<img
            class="track-cover"
            src="${song.cover}"
            alt=""
            loading="lazy"
          />`
        : html`<span class="track-cover track-cover-default"
            >${drawing("track")}</span
          >`
    }
    <div class="track-main">
      <a class="track-title" href="${song.soundcloud}">${song.title}</a>
      <span class="track-credit"
        >${song.original ? `원곡 · ${song.original}` : "자작곡"}</span
      >
      ${
        song.html.trim()
          ? html`<details class="track-note">
              <summary>코멘트</summary>
              <div class="prose">${raw(song.html)}</div>
            </details>`
          : ""
      }
    </div>
    <time class="track-date" datetime="${song.date}"
      >${formatDate(song.date)}</time
    >
    <span class="track-duration">${song.duration ?? ""}</span>
  </li>`

export const songsPage = (ctx: BuildContext, songs: Song[]) => {
  const minutes = Math.round(
    songs.reduce((sum, s) => sum + seconds(s.duration), 0) / 60,
  )
  return layout(ctx, {
    path: "/songs/",
    title: "Songs",
    description: "직접 부른 노래 플레이리스트",
    mode: "showcase",
    styles: ["/assets/css/showcase.css", "/assets/css/songs.css"],
    scripts: ["/assets/js/songs.js"],
    body: html`<div class="showcase">
      <header class="section-head">
        <div class="section-drawing">${drawing("songs", "마이크와 음표")}</div>
        <div>
          <h1>Sing sing sing!</h1>
          <p class="lede">홈레코딩은 즐거워</p>
          <div class="playlist-actions">
            <button class="play-all" type="button">▶ 재생</button>
            <span class="playlist-meta">${songs.length}곡 · ${minutes}분</span>
          </div>
        </div>
      </header>
      <div class="player" aria-live="polite">
        <p>아직은 조용하다.</p>
      </div>
      <ol class="tracklist">
        ${songs.map(track)}
      </ol>
      <p class="playlist-more">
        <a class="soundcloud-more" href="${PROFILE}"
          >SoundCloud에서 더 보기 <span aria-hidden="true">↗</span></a
        >
      </p>
    </div>`,
  })
}
