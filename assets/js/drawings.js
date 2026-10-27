// Drawings: 그림을 누르면 그 그림과 명패 앞으로 다가간다(벽 전체를 옮기고 키우는 줌).
// 다가간 채로 ← → ↑ ↓는 옆 그림으로 옮겨 가기, Esc·스크롤·다시 누르기는 물러서기.
// 오른쪽 아래 휴지통의 B컷은 dialog로 크게 보고 ← →로 넘긴다.
// 스크립트가 없으면 그림 링크가 원본 파일을 연다.
const gallery = document.querySelector(".gallery")
const camera = gallery.querySelector(".gallery-camera")
const note = gallery.querySelector(".gallery-note")
const works = [...gallery.querySelectorAll(".work")]
const viewer = document.querySelector(".viewer")

let near = -1 // 다가가 보고 있는 그림 번호. 없으면 -1
let nearScroll = 0 // 다가갈 때의 스크롤 위치

// el이 ancestor 안 어디에 있는지 (변형 전 배치 기준)
const offsetIn = (el, ancestor) => {
  let x = 0
  let y = 0
  for (; el && el !== ancestor; el = el.offsetParent) {
    x += el.offsetLeft
    y += el.offsetTop
  }
  return { x, y }
}

// 그림과 명패를 함께 감싸는 상자 (카메라 기준)
const box = i => {
  const frame = works[i].querySelector(".frame")
  const placard = works[i].querySelector(".placard")
  const { x, y } = offsetIn(frame, camera)
  const bottom = offsetIn(placard, camera).y + placard.offsetHeight
  const width = Math.max(frame.offsetWidth, placard.offsetWidth)
  return { x, y, width, height: bottom - y }
}

// 상자가 화면 세로 가운데에 오는 스크롤 위치
const scrollFor = i => {
  const { y, height } = box(i)
  return offsetIn(camera, null).y + y + height / 2 - innerHeight / 2
}

// 상자가 화면에 꽉 차도록 카메라를 옮기고 키운다
const nearView = i => {
  const { x, y, width, height } = box(i)
  const origin = offsetIn(camera, null)
  const scale = Math.min(
    (innerHeight * 0.86) / height,
    (innerWidth * 0.86) / width,
    4,
  )
  const tx = innerWidth / 2 - (origin.x - scrollX) - scale * (x + width / 2)
  const ty = innerHeight / 2 - (origin.y - scrollY) - scale * (y + height / 2)
  return `translate(${tx}px, ${ty}px) scale(${scale})`
}

// 화면은 그대로 둔 채 스크롤만 옮긴다. 옮긴 만큼 카메라를 반대로 밀어 둔다.
const scrollQuietly = (top, transformAfter) => {
  const before = scrollY
  camera.style.transition = "none"
  scrollTo({ top, behavior: "instant" })
  camera.style.transform = transformAfter(scrollY - before)
  camera.getBoundingClientRect()
  camera.style.transition = ""
}

const approach = i => {
  // 처음 다가갈 때는 그 그림이 화면 가운데 오도록 스크롤을 먼저 맞춘다
  if (near < 0) scrollQuietly(scrollFor(i), moved => `translateY(${moved}px)`)
  near = i
  nearScroll = scrollY
  works.forEach((work, j) => work.classList.toggle("is-near", j === i))
  gallery.classList.add("is-zoomed")
  camera.style.transform = nearView(i)
  note.innerHTML = works[i].querySelector(".work-story")?.innerHTML ?? ""
  history.replaceState(null, "", `#${works[i].id}`)
}

// 물러선다. 다가간 채로 다른 그림으로 옮겨 갔다면 그 그림 앞에 서 있도록 스크롤을 먼저 맞춘다.
const stepBack = (recenter = true) => {
  if (near < 0) return
  const i = near
  if (recenter && Math.abs(scrollFor(i) - scrollY) > 1)
    scrollQuietly(scrollFor(i), () => nearView(i))
  near = -1
  works[i].querySelector(".frame").focus({ preventScroll: true })
  gallery.classList.remove("is-zoomed")
  works.forEach(work => work.classList.remove("is-near"))
  camera.style.transform = ""
  history.replaceState(null, "", location.pathname)
}

works.forEach((work, i) =>
  work.querySelector(".frame").addEventListener("click", event => {
    event.preventDefault()
    if (near === i) stepBack()
    else approach(i)
  }),
)

// 다가간 채로 그림 밖을 누르면 물러선다
gallery.addEventListener("click", event => {
  if (near >= 0 && !event.target.closest(".frame")) stepBack()
})

// 다가간 채로는 스크롤 대신 물러선다
const leaveOnScroll = event => {
  if (near < 0) return
  event.preventDefault()
  stepBack()
}
addEventListener("wheel", leaveOnScroll, { passive: false })
addEventListener("touchmove", leaveOnScroll, { passive: false })

// 다가간 채로 스크롤바를 끌어서 움직였을 때
addEventListener(
  "scroll",
  () => {
    if (near >= 0 && Math.abs(scrollY - nearScroll) > 1) stepBack(false)
  },
  { passive: true },
)

addEventListener("resize", () => stepBack(false))

addEventListener("keydown", event => {
  if (near < 0 || viewer?.open) return
  if (event.altKey || event.metaKey || event.ctrlKey) return
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[
    event.key
  ]
  if (step) {
    event.preventDefault()
    approach(Math.min(works.length - 1, Math.max(0, near + step)))
  } else if (["Escape", "PageUp", "PageDown", " "].includes(event.key)) {
    event.preventDefault()
    stepBack()
  }
})

// B컷 크게 보기
const bcuts = [...document.querySelectorAll(".crumpled")]
let index = 0

const show = i => {
  index = (i + bcuts.length) % bcuts.length
  const item = bcuts[index]
  const img = item.querySelector("img")
  viewer.querySelector("img").src = img.src
  viewer.querySelector("img").alt = img.alt
  viewer.querySelector("figcaption").innerHTML =
    item.querySelector("figcaption").innerHTML
  viewer.querySelector(".viewer-count").textContent =
    `${index + 1} / ${bcuts.length}`
  history.replaceState(null, "", `#${item.id}`)
}

const open = item => {
  show(bcuts.indexOf(item))
  viewer.showModal()
}

for (const item of bcuts)
  item.querySelector(".crumpled-open").addEventListener("click", event => {
    event.preventDefault()
    open(item)
  })

viewer
  ?.querySelectorAll("[data-step]")
  .forEach(button =>
    button.addEventListener("click", () =>
      show(index + Number(button.dataset.step)),
    ),
  )

viewer?.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") show(index - 1)
  if (event.key === "ArrowRight") show(index + 1)
})

// 바깥(배경)을 누르면 닫는다
viewer?.addEventListener("click", event => {
  if (event.target === viewer) viewer.close()
})

viewer?.addEventListener("close", () => {
  history.replaceState(null, "", location.pathname)
  bcuts[index].querySelector(".crumpled-open").focus()
})

// 휴지통 판은 바깥을 누르거나 Esc를 누르면 닫는다 (B컷을 크게 보는 중이면 그대로 둔다)
const trash = document.querySelector(".trash")

document.addEventListener("click", event => {
  if (!trash?.open || viewer?.open) return
  if (trash.contains(event.target) || event.target.closest(".viewer")) return
  trash.open = false
})

addEventListener("keydown", event => {
  if (event.key !== "Escape" || !trash?.open || viewer?.open) return
  trash.open = false
  trash.querySelector("summary").focus()
})

// /drawings/#slug 로 오면 그 그림 앞으로 간다. 휴지통 속 그림이면 휴지통을 열고 크게 본다.
// 브라우저가 #slug로 스크롤해 주는 일(과 새로고침 때 스크롤 되돌리기)이 끝난 뒤에 해야 한다.
// 먼저 하면 그 스크롤을 사람이 움직인 걸로 알고 바로 물러선다.
const goToHash = () => {
  const target = location.hash
    ? document.getElementById(decodeURIComponent(location.hash.slice(1)))
    : null
  if (target?.classList.contains("work")) {
    const i = works.indexOf(target)
    requestAnimationFrame(() => approach(i))
  } else if (target?.classList.contains("crumpled")) {
    target.closest("details").open = true
    open(target)
  }
}

addEventListener("hashchange", goToHash)
if (document.readyState === "complete") goToHash()
else addEventListener("load", goToHash, { once: true })
