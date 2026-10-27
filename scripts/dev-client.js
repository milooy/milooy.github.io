// 개발 서버(scripts/dev.ts)가 /__dev.js로 주는 브라우저 코드. 배포에는 들어가지 않는다.
const events = new EventSource("/__reload")

events.addEventListener("reload", () => location.reload())

// CSS만 바뀌면 그 <link>만 새로 받는다. 새 것이 다 받아진 뒤에 옛 것을 지워서 깜빡이지 않게 한다.
events.addEventListener("css", ({ data: file }) => {
  for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
    if (new URL(link.href).pathname !== file) continue
    // 아직 받는 중인 이전 교체본은 버린다
    if (link.dataset.loading) {
      link.remove()
      continue
    }
    const next = link.cloneNode()
    next.href = `${file}?t=${Date.now()}`
    next.dataset.loading = "true"
    next.onload = () => {
      delete next.dataset.loading
      link.remove()
    }
    link.after(next)
  }
})

// 빌드가 실패하면 에러를 화면 위에 띄운다. 고쳐서 빌드되면 새로고침되며 사라진다.
// 사이트 CSS와 섞이지 않게 shadow DOM 안에 그린다.
const overlay = document.createElement("dev-overlay")
const root = overlay.attachShadow({ mode: "open" })
root.innerHTML = `
  <style>
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      overflow: auto;
      background: rgb(0 0 0 / 0.6);
    }
    .panel {
      box-sizing: border-box;
      width: min(760px, calc(100% - 32px));
      margin: 10vh auto;
      padding: 20px 24px;
      border-top: 4px solid #e5484d;
      border-radius: 8px;
      background: #1c1c1c;
      color: #ededed;
      font: 14px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    h2 {
      margin: 0 0 12px;
      color: #ff6369;
      font-size: 16px;
    }
    pre {
      margin: 0;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-top: 16px;
      color: #a0a0a0;
    }
    button {
      font: inherit;
      color: inherit;
      background: #2e2e2e;
      border: 1px solid #444;
      border-radius: 6px;
      padding: 4px 12px;
      cursor: pointer;
    }
  </style>
  <div class="backdrop">
    <div class="panel" role="alert">
      <h2>빌드 실패</h2>
      <pre></pre>
      <footer>
        <span>고쳐서 저장하면 다시 빌드해요.</span>
        <button type="button">닫기</button>
      </footer>
    </div>
  </div>
`
root.querySelector("button").addEventListener("click", () => overlay.remove())

events.addEventListener("build-error", ({ data }) => {
  root.querySelector("pre").textContent = JSON.parse(data)
  document.body.append(overlay)
})
