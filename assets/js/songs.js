// Songs: 트랙을 누르면 페이지 안 SoundCloud 위젯 하나로 튼다.
// 위젯은 처음 누를 때 만든다(그 전엔 SoundCloud를 부르지 않는다).
// 스크립트가 없으면 트랙 제목이 SoundCloud 페이지로 간다.
const player = document.querySelector(".player")
const tracks = [...document.querySelectorAll(".track")]

const widgetUrl = src =>
  "https://w.soundcloud.com/player/?" +
  new URLSearchParams({
    url: src,
    auto_play: "true",
    color: "#b4462e",
    hide_related: "true",
    show_comments: "false",
    show_reposts: "false",
    show_teaser: "false",
    visual: "false",
  })

const play = track => {
  let iframe = player.querySelector("iframe")
  if (!iframe) {
    iframe = document.createElement("iframe")
    iframe.title = "SoundCloud 플레이어"
    iframe.allow = "autoplay"
    player.replaceChildren(iframe)
  }
  iframe.src = widgetUrl(track.dataset.src)
  for (const t of tracks) t.setAttribute("aria-current", String(t === track))
}

for (const track of tracks)
  track.querySelector(".track-title").addEventListener("click", event => {
    event.preventDefault()
    play(track)
  })

document
  .querySelector(".play-all")
  .addEventListener("click", () => play(tracks[0]))
