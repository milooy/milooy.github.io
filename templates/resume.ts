// Resume: 읽기 모드 한 장짜리 문서. 경력은 <details>로 접고, 인쇄하면 모두 펼친다.
import type { Resume } from "../lib/content.ts"
import { html, raw } from "../lib/html.ts"
import { layout, type BuildContext } from "./layout.ts"

export const resumePage = (ctx: BuildContext, resume: Resume) =>
  layout(ctx, {
    path: "/resume/",
    title: "Resume",
    description: resume.description,
    mode: "reading",
    styles: ["/assets/css/reading.css", "/assets/css/resume.css"],
    body: html`<article class="reading resume">
      <header class="post-head">
        <p class="eyebrow">Resume</p>
        <h1>${resume.title}</h1>
        <button class="print-button" type="button" onclick="print()">
          인쇄 · PDF로 저장
        </button>
      </header>
      <div class="prose">${raw(resume.html)}</div>
    </article>`,
  })
