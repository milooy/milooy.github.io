---
title: 프론트엔드에서 302 Redirection을 처리하는 2가지 방법 - 브라우저, 자바스크립트
description: fetch로 쏜 요청이 302 Redirect되었을 때, 페이지 이동 없이 요청만 이동한다는 점 아셨나요?
date: "2024-04-22"
category: dev
---

| 토스비즈니스 로그인 만들면서... 삽질Log

## TL;DR

1. API 응답이 302 redirection이라면 브라우저 방식을 사용하는걸 추천
   1. → 자바스크립트 방식은 다중 302 redirection시 페이지 이동이 아닌 API 콜을 시도
   2. → 1중 리디렉션이라면 자바스크립트 방식도 무방 (첨부한 코드 참조)
2. UI 깜빡임이 덜한 자바스크립트 방식을 사용하고 싶다면 302 redirection보다 200 response 응답으로 브라우저에서 수동 리디렉션 하는 방식을 추천

## 프론트 연동 방식 2가지

### Opt1. 브라우저 방식: HTML `<form>` 태그로 서브밋 / location.href 로 페이지 이동

- 브라우저 제어: 브라우저는 폼 제출을 완전히 제어하며, 폼 액션 URL로 HTTP 요청을 보내고 페이지를 새 응답으로 리프레시합니다.
- 리디렉션 처리: 서버에서 리디렉션 응답을 반환하면 브라우저는 자동으로 그 리디렉션을 따릅니다. 이 과정은 JavaScript 없이도 완전히 자동으로 이루어집니다.
- 쿠키 전송: 브라우저는 동일 출처 정책에 따라 자동으로 쿠키를 요청에 포함시킵니다.

<br/>

→ 다중 리디렉션 등, 다양한 302 케이스를 대응하려면 브라우저 방식 ㄱㄱ
→ 다만 브라우저가 리프레쉬되며, 에러를 비동기가 아닌 페이지 이동으로 처리해야함.

### Opt2. 자바스크립트 방식: fetch API로 POST 요청

- 프로그래밍 제어: fetch API를 사용하면 요청의 세부 사항(헤더, 바디 등)을 프로그래밍 방식으로 정밀하게 제어할 수 있습니다.
- 비동기 처리: JavaScript를 사용하면 비동기적으로 데이터를 전송하고 응답을 처리할 수 있습니다. 이는 페이지를 리프레시하지 않고도 서버와 통신을 할 수 있음을 의미합니다.
- 쿠키 옵션: 쿠키를 요청에 포함시키려면 credentials 옵션을 'include'로 설정해야 합니다. 이것은 기본적으로 fetch에서는 수행되지 않습니다
  - 기본적으로, 웹 브라우저는 동일 출처 정책(Same-Origin Policy)을 적용하여, 다른 출처의 리소스와 상호 작용할 때 쿠키나 인증 정보를 보내지 않습니다. 하지만 withCredentials가 true로 설정된 경우, 요청에 사용자 인증 정보를 포함시켜 다른 출처의 서버와도 쿠키나 인증 헤더를 주고받을 수 있게 됩니다.
- 리디렉션 옵션: fetch API에서는 redirect 옵션을 설정하여 리디렉션의 처리 방법(follow, error, manual)을 선택할 수 있습니다.
  - 주의! 리다이렉트 되는건 웹 페이지가 아닌 AJAX 요청이다.
    - 웹 페이지는 머물러 있고, AJAX요청은 리다이렉트되어서 get/post 요청의 결과로 반환됨
      - 아래 코드 참고해서 수동 리디렉션 하면 됨
    - 다만 2중 리디렉션은 아래 코드도 동작 안함
      - e.g. /foo API요청 (res- Location: bar1) → /bar1로 302 리디렉션(res- Location: bar2) → /bar2로 302 리디렉션(res- Location: /success) → /success로 페이지 이동하는게 아니고 /success로 API 콜 시도함
      - 이런 상황에서는 브라우저 방식 form submit을 활용하자.
- ky, axios interceptor 를 활용해 수동 리디렉션하는 코드

```ts
const ManualRedirectionHook: AfterResponseHook = async (
  _input,
  _options,
  res
) => {
  if (res.type === "opaqueredirect") {
    const errorMessage =
      "opaqueredirect: 응답이 리디렉션을 따랐으나, 보안상의 이유로 리디렉션된 응답의 내용이 브라우저에서는 접근 불가합니다."
    console.error(errorMessage, res)
    throw new Error("잘못된 리디렉션입니다.")
  }
  if (res.redirected && res.url) {
    location.href = res.url
  }
  return res
}
```

### 참고: 'opaqueredirect'란?

- 요청이 리디렉션을 따랐으나, 보안상의 이유로 리디렉션된 응답의 내용이 브라우저에서는 접근 불가능하게 처리되었을 때 사용됩니다. 이 경우 응답의 바디(body)는 읽을 수 없고, 일부 속성들은 제한된 정보만 제공합니다.
- 이러한 응답은 특히 `no-cors` 모드에서 CORS 정책을 회피하려는 경우나 리디렉션을 수동으로 처리하도록 설정했을 때 자주 볼 수 있습니다. 그러나, 실제로 `response.url`을 사용하여 리디렉션된 URL을 알아낼 수 없습니다. `response.type`이 `'opaqueredirect'`일 때는 `response.url`은 빈 문자열이 됩니다.

따라서 `fetch`로 리디렉션을 수동 처리하려 할 때, 실제로 리디렉션된 위치를 찾는 것은 서버가 CORS 헤더를 적절히 제공하지 않으면 브라우저에서 할 수 없습니다. 이런 경우 서버 측에서 API의 리디렉션 응답을 다루는 방법을 변경하거나, 클라이언트 측에서 다른 방법을 모색해야 합니다. 서버 측에서 리디렉션을 처리하는 로직을 클라이언트로 명시적으로 전달하거나, 서버가 직접 최종 목적지 페이지로 리디렉션하지 않고 클라이언트에 필요한 정보만을 전달하고 클라이언트에서 그 정보를 바탕으로 직접 리디렉션하는 방식 등을 고려할 수 있습니다.

## P.S

자바스크립트에서 API 콜시 다중으로 302 redirection이 되었을 때 최종 Location으로 브라우저 리디렉션시켜주는 방법을 저는 찾지 못했는데 혹시 아시는 분 계시면 알려주세요
