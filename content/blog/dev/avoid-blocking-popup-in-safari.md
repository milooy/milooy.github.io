---
title: 사파리 팝업차단 우회하기
description: 간단한데 삽질했네
date: "2022-03-15"
category: dev
---

사파리는 비동기 콜 안에서 window.open으로 연 팝업을 차단합니다. (크롬은 ㄱㅊ)

1.빈 팝업을 열고 2.필요한 비동기콜을 한 후 3.팝업 url을 바꿔주세요.

2와 1이 바뀌어도 차단되는걸 유념해주세요.

- 데모 사이트: https://milooy.github.io/avoid-blocking-popup-in-safari/
- 데모 사이트의 코드: https://github.com/milooy/avoid-blocking-popup-in-safari/blob/main/index.html
