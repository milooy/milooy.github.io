// 책등을 누르면 책이 빠져나오며 카드가 열리고, 읽은 해로 책장을 거른다.
const shelves = document.querySelectorAll(".shelf")
const yearButtons = document.querySelectorAll(".year-filter button")
let openSpine = null

const cardOf = spine =>
  document.getElementById(spine.getAttribute("aria-controls"))

const close = () => {
  if (!openSpine) return
  openSpine.setAttribute("aria-expanded", "false")
  cardOf(openSpine).hidden = true
  openSpine = null
}

document.addEventListener("click", event => {
  const spine = event.target.closest(".spine")
  if (!spine) return
  const wasOpen = spine === openSpine
  close()
  if (wasOpen) return
  spine.setAttribute("aria-expanded", "true")
  cardOf(spine).hidden = false
  openSpine = spine
})

document.addEventListener("keydown", event => {
  if (event.key !== "Escape" || !openSpine) return
  const spine = openSpine
  close()
  spine.focus()
})

const filterByYear = year => {
  close()
  for (const button of yearButtons)
    button.setAttribute("aria-pressed", String(button.dataset.year === year))
  for (const shelf of shelves) {
    let count = 0
    for (const spine of shelf.querySelectorAll(".spine")) {
      spine.hidden = Boolean(year) && spine.dataset.year !== year
      if (!spine.hidden) count++
    }
    shelf.hidden = count === 0
    shelf.querySelector(".shelf-count").textContent = count
  }
  const url = new URL(location.href)
  if (year) url.searchParams.set("year", year)
  else url.searchParams.delete("year")
  history.replaceState(null, "", url)
}

for (const button of yearButtons)
  button.addEventListener("click", () => filterByYear(button.dataset.year))

const initialYear = new URL(location.href).searchParams.get("year")
if (initialYear) filterByYear(initialYear)
