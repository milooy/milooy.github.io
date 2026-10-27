// Drawings: 그림을 누르면 dialog로 크게 보고, ← →로 넘긴다.
// 스크립트가 없으면 링크가 원본 그림 파일을 연다.
const viewer = document.querySelector(".viewer")
const items = [...document.querySelectorAll(".drawing")]
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

items.forEach((item, i) => {
  item.querySelector(".drawing-open").addEventListener("click", event => {
    event.preventDefault()
    show(i)
    viewer.showModal()
  })
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

// /drawings/#slug 로 들어오면 그 그림을 바로 연다
const start = items.findIndex(item => `#${item.id}` === location.hash)
if (start >= 0) {
  show(start)
  viewer.showModal()
}
