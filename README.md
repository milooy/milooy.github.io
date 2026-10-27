# milooy.github.io

Yurim Jin(진유림)의 개인 사이트. 프레임워크 없이 `build.ts` 하나가 `content/`의 마크다운을 `templates/`에 맞춰 HTML로 만든다. 기획은 [docs/PRD.md](docs/PRD.md).

## 실행

```sh
npm install
npm run dev     # http://localhost:3000, 저장하면 자동 새로고침
npm run build   # dist/에 배포용 빌드
```

main에 push하면 GitHub Actions가 빌드해서 GitHub Pages에 올린다.

## 글쓰기

| 무엇        | 어디에                               | frontmatter                                                                  |
| ----------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| 블로그 글   | `content/posts/<slug>.md`            | `title`, `date`, `tags` (+ `description`, `draft`)                           |
| 조각글      | `content/notes/<YYYY-MM-DD-HHmm>.md` | `date` (+ `title`, `link`)                                                   |
| 책          | `content/books/<slug>.md`            | `title`, `rating`(0.5~5), `readAt`(YYYY 또는 YYYY-MM) (+ `author`, `review`) |
| 단독 페이지 | `content/pages/<slug>.md`            | `title` (+ `description`)                                                    |

```md
---
title: 타입가드 간단 톺아보기
date: "2023-04-02"
tags: [dev, typescript]
description: 한 줄 설명
---

본문
```

- `draft: true`인 글은 `npm run dev`에서만 보인다.
- frontmatter 형식이 틀리면 빌드가 파일 이름과 필드를 알려주고 멈춘다.
- 옛 주소를 옮길 때는 `content/redirects.yaml`에 `"옛 주소": "새 주소"`를 적는다.

## 구조

```text
build.ts          빌드 진입점
lib/              콘텐츠 읽기, 마크다운, RSS·sitemap
templates/        페이지 템플릿 (HTML 문자열을 돌려주는 TS 함수)
assets/css/       tokens.css(색·폰트), 공통·섹션별 스타일
assets/js/        전시 모드 페이지용 작은 스크립트
assets/drawings/  임시 손그림 SVG (TODO: 직접 그린 그림으로 교체)
static/           그대로 복사되는 파일
content/          글, 조각글, 책, 페이지
scripts/dev.ts    개발 서버
```
