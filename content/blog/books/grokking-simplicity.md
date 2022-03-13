---
title: Grokking Simplicity 독서노트
date: "2021-11-23"
category: book
---

## Ch.8~9 계층화하기

### 추상화 단계 통일

전에 Slash21에서 [발표](https://www.youtube.com/watch?v=edWbHp_k_9Y)시 얘기했던 내용인데 사실 어케 디테일하게 설명하지 하고 고민했는데

여기서 어느정도 명확히 말해줘서 만족!

계층은 대략 이렇게 트리형태로 그려볼 수 있음. 여기서는 '카트'코드에 대한 함수로 예시.

1. 카트에 대한 비지니스 룰: 가장 높은 추상화. `freeTieClip()`(넥타이를 사면 클립을 공짜로 줌), `gets_free_shipping()`(무료배송임)
2. 제네럴한 비지니스 룰: `calc_tax()`(세금계산. 비지니스 룰이지만 여러 섹션에서 가져다쓸 수 있음)
3. 카트 기본 동작: `add_item()`, `isInCart()`
4. 물건 기본 동작: `setPrice()`
5. copy-on-write 동작: `removeItems()`
6. js 언어 피쳐: `.slice`, `for loop`

- 하나의 함수 안엔 최대한 비슷한 추상화 레벨들끼리 모아둬야한다. (단일 세부 수준 - single level of detail)
  예를 들어 2단계인 `calc_tax()`랑 6단계인 `for loop`가 섞여있다면 의식의 흐름이 날뛰게 됨.
- 이를 정리해서 2단계끼리, 4단계끼리 모아두면 뇌가 디테일을 감지하는데 편할껴! 여러번 해보면서 디자인 감각을 기르세요.
- 함수를 추출하다보면(위 리스트에서 보면 6쪽으로 갈수록) 더 제네럴해져서 재사용하기 편해집니다. 테스트하기도 쉬움. 이름짓기도 쉬움. 즉 읽기도 쉬움.
- 무분별하게 복잡한 코드를 퉁쳐서 숨기는게 능사가 아님. 계층화를 잘 해서 모든 레이어를 간단하게 만들기!
- 비지니스 룰 레벨을 명시적으로 최상단 추상화로 뺀게 인상깊었다.
- 상단 레이어일수록 변경 쉽고, 하단일수록 (상위에 영향미치니)변경 어렵다. 하단일수록 시간을 초월한 기능이어야 함. 하단일수록 테스트코드가 중요.

### 추상화 장벽 세우자

추상화 장벽이란? 세부사항을 모른채로 기능을 쓸 수 있도록 도와주는 장벽

e.g. 날씨 오픈API는 이걸 어디서 쓰든 상관 없이 날씨데이터서비스 구현에만 집중하면 됨. 추상화 장벽 잘 세움!

---

## Ch. 10~11 일급시민 함수

### 리팩터링 코드스멜: 함수 이름에 있는 값을 본문에서도 참조하고있음

해결: 이름의 값을 떼어버리고 인자로 넘기도록!

```js
// bad
function setPriceByName(cart, name, price) {
  set("price", name)
}
function setTaxByName(cart, name, tax) {
  set("tax", name)
}

// good
function setFieldByName(cart, name, field, value) {
  set(field, name)
}
```

### 리팩터링 수법: 콜백으로 바디 교체

```js
// before
try {
  saveUser(user)
} catch (error) {
  logToSnapErrors(error)
}
```

모든 API에 try catch 감싸려면 넘 많이 반복해야함.

```js
function withLogging(callback) {
  try {
    callback()
  } catch (error) {
    logToSnapErrors(error)
  }
}

withLogging(() => saveUser(user))
```

인수에 함수를 받는 함수를 만들어서 원하는대로 넘긴 함수가 실행되도록 리팩터링

### 일급개체 특징

1. 변수 할당 가능
2. 함수에 인수로 전달 가능
3. 함수에서 리턴 가능
4. 배열이나 객체에 저장 가능

= 마구마구 담거나 넘길 수 있다

예를 들어 `+`같은건 일급객체가 아니지만
`function plus(a, b){return a + b}` 처럼 함수로 감싸 일급객체로 만들 수 있다. 이젠 이걸 맘대로 던지고 받을 수 있겠지.

### 고차 함수(High Order Function)란?

다른 함수를 인수로 받거나 리턴하는 함수. 이걸 응용해서 다양한 동작을 추상활 할 수 있다.
대표적으로 `forEach(arr, fn)`

## Ch.12

map, filter, reduce 써라

## Ch.13

### 가비지 배열

```js
var goodCustomers = filter(customers, isGoodCustomer) // 여기서 goodCustomers는 필터링 중간에 한번만 쓰이고 다신 안쓰임. 쓰레기임.
var withAddress = filter(goodCustomers, hasAddress)
```
