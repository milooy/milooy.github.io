---
title: Xcode 시뮬레이터에서 스킴 쉽게 열기 (feat. Alfred)
description: 생산성을 높여보자
date: "2023-02-18"
category: dev
---

## 배경

웹뷰 기반의 개발을 할 땐
앱과의 소통 등의 이유로 앱 위에서 띄워봐야 할 때가 종종 있다.

이 때마다 알파나 라이브앱에 배포하면서 테스트 해볼 수 있지만... 

생산성을 위해 Xcode의 Simulator로 가상 앱을 띄우고, Safari Technlogy Preview를 통해 해당 웹뷰의 개발자 도구를 열어 
`location.href = "http://localhost:3000/my/app"` 을 콘솔에 입력해 로컬 개발환경을 앱 위에 띄우곤 한다.

다만 이를 위해선

1. Xcode simulator 열어야함
2. Safari technology preview 열어야함
3. 토스앱 열어야함
4. Safari 개발자 도구 열어서 location.href 고쳐둬야함


하는 쏘 귀찮음쓰가 있음...

막 엄청자주 하는것도 아니니까 손도 느림...

아무래도 자동화 해야겠슴...

## 해결

<video src="https://user-images.githubusercontent.com/3839771/219665869-66244e6c-46ed-42b5-863e-98c709bb98e6.mp4"></video>

Working good!

알프레드에 `sim http://localhost:3000/my/app(원하는 localhost url)` 을 입력하면 알파앱에서 해당 웹뷰가 뿅

## 어케 해결?

<img width="1292" alt="image" src="https://user-images.githubusercontent.com/3839771/219667025-f9ede299-cb54-43a5-89fa-fe6b0512e486.png">

알프레드 워크플로우를 통해 shell script를 실행하면 된당

<img width="507" alt="image" src="https://user-images.githubusercontent.com/3839771/219667179-de346f6a-c25e-48c7-a1ae-3d1165e36fe6.png">

원하는 키워드(나는 시뮬레이터의 약자인 sim으로 함)를 입력 후 URL을 붙여넣고 다음 스크립트를 실행시킨다

<img width="825" alt="image" src="https://user-images.githubusercontent.com/3839771/219668054-bd3c9430-c059-44ef-a798-60c86abe805a.png">


```sh
# Xcode 앱 열기
open /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app

# Safari Technology Preview 앱 열기
open "/Applications/Safari Technology Preview.app"

# Alfred로 부터 받은 첫 번째 인자 저장 (e.g. http://localhost:3000/my/app)
LOCALHOST_VAR=$1

# 해당 인자에 http://localhost:3000 이란 string을 원하는 스킴(e.g. 노션이라면 notion:/) 으로 replace
URL="${LOCALHOST_VAR/http:\/\/localhost:3000/"notion:/"}"

# 8초간 기다린다 (Simulator가 뜨는 시간 고려)
sleep 8

# 스킴을 Simulator에서 연다. 노션스킴이라면 노션 앱이, 토스스킴이라면 토스 앱이 열리겠쥬
xcrun simctl openurl booted "${URL}"
```