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
        : html`<span class="track-cover" aria-hidden="true"></span>`
    }
    <div class="track-main">
      <a class="track-title" href="${song.soundcloud}">${song.title}</a>
      <span class="track-artist">${song.artist}</span>
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
      <header class="playlist-head">
        <div class="playlist-cover">${drawing("songs", "마이크와 음표")}</div>
        <div class="playlist-info">
          <p class="eyebrow">Playlist</p>
          <h1>부른 노래</h1>
          <p class="playlist-by">JayJin · 홈 레코딩</p>
          <p class="lede">${songs.length}곡 · ${minutes}분</p>
          <div class="playlist-actions">
            <button class="play-all" type="button">▶ 재생</button>
            <a href="${PROFILE}">SoundCloud에서 보기</a>
          </div>
        </div>
      </header>
      <div class="player" aria-live="polite">
        <p>곡을 누르면 여기서 재생돼요.</p>
      </div>
      <ol class="tracklist">
        ${songs.map(track)}
      </ol>
    </div>`,
  })
}
