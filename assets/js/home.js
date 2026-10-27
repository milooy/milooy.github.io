// 홈: 이름 밑 혼잣말. 게임 대사처럼 한 글자씩 찍히고, 누르면 다음 말로 넘어간다.
// 찍히는 중에 누르면 그 말을 바로 끝까지 보여 준다. 다 보고 나면 숨은 말이 한 번 나온다.
// 움직임 줄이기를 켜 두면 찍지 않고 바로 바꾼다.
const STEP = 45
const SECRET = "…더 할 말 없어"
const still = matchMedia("(prefers-reduced-motion: reduce)").matches

const shuffle = list => {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// 말줄임표나 쉼표 뒤에서는 잠깐 숨을 고른다
const pauseAfter = char =>
  char === "." || char === "…" ? 220 : char === "," ? 140 : STEP

const setup = button => {
  const sayings = JSON.parse(button.dataset.sayings)
  const full = button.querySelector(".saying-full")
  const typed = button.querySelector(".saying-typed")
  let queue = shuffle(sayings)
  let secretShown = false
  let timer = null

  const next = () => {
    if (queue.length > 0) return queue.shift()
    if (!secretShown) {
      secretShown = true
      return SECRET
    }
    queue = shuffle(sayings)
    return queue.shift()
  }

  const finish = () => {
    clearTimeout(timer)
    timer = null
    typed.textContent = full.textContent
    button.classList.remove("is-typing")
  }

  const say = text => {
    full.textContent = text
    if (still) return finish()
    const chars = Array.from(text)
    let shown = 0
    typed.textContent = ""
    button.classList.add("is-typing")
    const tick = () => {
      typed.textContent += chars[shown++]
      if (shown === chars.length) return finish()
      timer = setTimeout(tick, pauseAfter(chars[shown - 1]))
    }
    tick()
  }

  button.addEventListener("click", () => (timer ? finish() : say(next())))
  say(next())
}

document.querySelectorAll(".saying").forEach(setup)
