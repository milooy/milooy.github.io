// Drawings: 그림을 누르면 dialog로 크게 보고, ← →로 넘긴다.
// 넘기는 범위는 누른 그림이 있는 묶음(스케치북 또는 휴지통) 안이다.
// 스크립트가 없으면 링크가 원본 그림 파일을 연다.
const viewer = document.querySelector(".viewer")
let items = []
let index = 0

const show = i => {
  index = (i + items.length) % items.length
  const item = items[index]
  const img = item.querySelector("img")
  viewer.querySelector("img").src = img.src
  viewer.querySelector("img").alt = img.alt
  viewer.querySelector("figcaption").innerHTML =
    item.querySelector("figcaption").innerHTML
  viewer.querySelector(".viewer-story").innerHTML =
    item.querySelector(".drawing-story")?.innerHTML ?? ""
  viewer.querySelector(".viewer-count").textContent =
    `${index + 1} / ${items.length}`
  history.replaceState(null, "", `#${item.id}`)
}

const open = item => {
  items = [...item.parentElement.children]
  show(items.indexOf(item))
  viewer.showModal()
}

for (const item of document.querySelectorAll(".drawing"))
  item.querySelector(".drawing-open").addEventListener("click", event => {
    event.preventDefault()
    open(item)
  })

viewer
  .querySelectorAll("[data-step]")
  .forEach(button =>
    button.addEventListener("click", () =>
      show(index + Number(button.dataset.step)),
    ),
  )

viewer.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") show(index - 1)
  if (event.key === "ArrowRight") show(index + 1)
})

// 바깥(배경)을 누르면 닫는다
viewer.addEventListener("click", event => {
  if (event.target === viewer) viewer.close()
})

viewer.addEventListener("close", () => {
  history.replaceState(null, "", location.pathname)
  items[index].querySelector(".drawing-open").focus()
})

// /drawings/#slug 로 들어오면 그 그림을 바로 연다. 휴지통 속 그림이면 휴지통부터 연다.
const start = location.hash && document.getElementById(location.hash.slice(1))
if (start?.classList.contains("drawing")) {
  const trash = start.closest("details")
  if (trash) trash.open = true
  open(start)
}
