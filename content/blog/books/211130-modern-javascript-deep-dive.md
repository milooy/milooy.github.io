---
title: 모던 자바스크립트 Deep Dive
description: test2
category: book
date: "2022-01-01"
---

## 코드를 짜기 위한 사전능력: 컴퓨팅 사고

인간에게 '걷다'를 설명해보라고 하면 "그냥 뭐 걷는거죠..." 할 수 있지만
컴퓨터에게 '걷다'를 설명해보라 하면 장르가 달라진다.

> 오른발이 왼발보다 앞에 있으면 왼발을 선택해서 x축으로 30~50cm(상황에 따라 다름) 움직인다. 전방에 장애물(크기, 거리 정의 필요)이 있으면...

기존에 당연하다고 여겼던 개념들을 쪼개고 패턴화하는 능력이 컴퓨팅 사고임! 논리/수학적 사고가 필요하다.

## 즉 프로그래밍이란?

즉 프로그래밍 = 0,1밖에 모르는 기계가 이해할 수 있도록 상세하게 요구사항을 설명하기!

이렇게 정의한 요구사항을 프로그래밍 언어(인간친화적)를 사용해 작성하고

이를 기계어(컴퓨터친화적)로 번역해서 넘겨준다. 바로 0,1만 사용해서 기곗말(ㅎㅎ)을 쓰긴 어려우니까 통역가(컴파일러)를 끼는거임.

프로그래밍 언어 배우기는 문법 배우기인데, 영문법만 공부한다고 회화를 잘하는게 아니듯이 문법 + 컴퓨팅사고가 모두 필요함.

> 프로그래밍이란: 요구사항의 집합을 분석해 이를 적절한 자료구조와 함수의 모음으로 바꾸고 이 flow를 제어하는것!

## 자바스크립트는 나보다 한 살 어리구나

95년생이래

(ES1은 97년에.) (2020년은 ES11(ECMAScript2020))

## JS성장의 키포인트들

1. Ajax등장 (화면 바뀔일 있을때마다 매번 서버에서 안데려와도 돼)
2. jQuery 등장 (돔조작이 쉬워졌어)
3. 구글 V8엔진 등장 (성능빨라짐)
4. Node.js 등장 (브라우저 밖에서도 쓸수있어)
5. SPA 프레임워크 등장

## 컴파일 안해도 되지롱

인터프리터 언어라서 개발자가 별도 컴파일 없이 엔진(V8 등)이 바로 실행함.

(여기서잠깐: 컴파일언어는 개발 후 소스코드 전체를 머신코드로 변환필요. 인터프리터 언어는 런타임에 한줄한줄 바이트코드로 변환해줌(컴파일됨))

## JS는 객체지향 언어인가요?

ㄴㄴ. 명령형 / 함수형 / 프로토타입 / 객체지향 모두 지원하는 멀티패러다임.

굳이 말하자면 프로토타입 기반의 객체지향 언어.
