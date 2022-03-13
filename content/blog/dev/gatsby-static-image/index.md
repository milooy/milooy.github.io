---
title: Gatsby의 Static Image란?
date: "2021-11-19T23:46:37.121Z"
description: "img태그에 슈퍼파워를 불어넣자"
category: dev
---

로고나 랜딩페이지의 상단 이미지(Hero 이미지)등 바뀔 일이 없는 이미지를 보여줄 때 사용한다.
(바뀌는 이미지는 DynamicImage를 사용하면 돼요~)

```jsx
import { StaticImage } from "gatsby-plugin-image"

export function Dino() {
  return <StaticImage src="../images/dino.png" alt="A dinosaur" /> // 주의: prop에서 받아온 값을 src에 쓸 수 없습니다.
}
```

참고: 리모트 이미지(e.g. https://placekitten.com/800/600)도 넣을 수 있는데 개츠비 빌드시 다운로드+리사이즈 된다. (그래서 리모트에서 이미지 변경되도 빌드 다시 하지 않으면 이미지는 업뎃 안될겨!)

## 다양한 기능

걍 img 태그 대신 쓰는 이유는 당연 다양한 기능을 지원해서쥬.

```jsx
<StaticImage
  src="../images/dino.png"
  alt="A dinosaur"
  placeholder="blurred"
  ㄴ
  layout="fixed"
  width={200}
  height={200}
/>
```

width, height에 맞춰서 자리를 잡고, 로딩중에는 블러(저퀄) 이미지를 보여줄거다.
fixed 레이아웃을 사용해서 이미지 자리가 첨부터 계속 차지하게 할것이다(일반적으로 `<img/>` 태그 사용하면 로딩되기 전에는 자리를 차지하지 않아서 레이아웃이 뚜둑 바뀌죠)

개츠비 [문서](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image) 보면 기타 다양한 기능을 볼 수 있음.

간단히 소개하면

- `as="div"`: 바깥 wrapper를 넘긴 엘리먼트 태그로 감싸준다
- `loading`: 레이지 로딩 방식(StaticImage만의 기능은 아니고 [최신 브라우저](https://caniuse.com/loading-lazy-attr)에서 가능한 스펙입니다. IE, 사파리 등 안됨!).
  - lazy: 이미지가 화면에(뷰포트에)보일때쯤 로딩
  - eager: 화면 어디에 있는 상관없이 페이지 로딩되자마자 이미지 로딩
- `layout`
  - constrained: 기본 레이아웃. 이미지 기본 사이즈로 보여주되 width, height넘겨서 최대사이즈 제한. 스크린 사이즈 작아지면 이에 맞게 작아짐.
  - fixed: 고정사이즈
  - fullWidth: 전체폭
- `placeholder`
  - dominantColor: 이미지를 대표하는 색깔로
  - blurred: 아주 저화질 이미지를 블러해서 보여주기
  - tracedSVG: 원본 이미지의 간단한 svg버전을 보여줌. 간단한 이미지에만 사용하세요!
  - none: 안보여주기. 자리만 차지해요.

## Referrer

https://www.gatsbyjs.com/plugins/gatsby-plugin-image/#static-images
