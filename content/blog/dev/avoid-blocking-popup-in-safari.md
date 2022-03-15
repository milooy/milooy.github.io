---
title: 사파리 팝업차단 우회하기
description: 간단한데 삽질했네
date: "2022-03-15"
category: dev
---

사파리는 비동기 콜 안에서 window.open으로 연 팝업을 차단합니다. (크롬은 ㄱㅊ)

1.빈 팝업을 열고<br/> 2.필요한 비동기콜을 한 후 <br/>3.팝업 url을 바꿔주세요.

2와 1이 바뀌어도 차단되는걸 유념해주세요.

## 차단 예시 1: 비동기 콜 안에서 팝업 열기

```js
fetchCat("야옹").then(url => {
  var popup = window.open(
    url,
    "cert",
    "top=10, left=10, width=500, height=600, status=no, menubar=no, toolbar=no, resizable=no"
  )
})
```

## 차단 예시 2: 비동기 콜 이후 팝업 열기

```js
const url = await fetchCat("야옹")
var popup = window.open(
  url,
  "cert",
  "top=10, left=10, width=500, height=600, status=no, menubar=no, toolbar=no, resizable=no"
)
```

## 성공 예시: 비동기 콜 전에 팝업 열고 이후에 url 할당

```js
var popup = window.open(
  undefined,
  "cert",
  "top=10, left=10, width=500, height=600, status=no, menubar=no, toolbar=no, resizable=no"
)
const url = await fetchCat("야옹")
popup.location.href = url
```

- 데모 사이트: https://milooy.github.io/avoid-blocking-popup-in-safari/
- 데모 사이트의 코드: https://github.com/milooy/avoid-blocking-popup-in-safari/blob/main/index.html
