---
title: 타입가드 간단 톺아보기
description: 늘 헷갈렸음
date: "2023-04-02"
category: dev
---

울 팀 치원님께서 변수를 통해 타입가드를 쓰고 싶을 때의 불편함을 제기해주셨다.
나도 옛날부터 어렴풋이만 이해하고 잘 모르고 있어서 함 찾아봤다.

## 치원님의 불편제기


```tsx

const isPromotion = planUsageInfo.data.promotion != null;

// 1.
if (isPromotion) {
  const foo = planUsageInfo.data.promotion; // nullable
}

// 2.
if (planUsageInfo.data.promotion != null) {
  const foo = planUsageInfo.data.promotion; // not nullable
}

// 3.
const promotion = planUsageInfo.data.promotion;
const isPromotion2 = promotion != null;
if (isPromotion2) {
  const foo = promotion; // not nullable
}
```

“1번 케이스 일 때 nullable 인거는 겪을 때마다 유감스럽네요.”

## 3번은 왜 되는것인가

```tsx
const singleValue: number | null = planUsageInfo.data.promotion ? 1 : null;
const isSingleValueNotNull = singleValue != null;

if (isSingleValueNotNull) {
  const foo = singleValue; // not nullable
}

const objectValue: { foo: number | null } = planUsageInfo.data.promotion ? { foo: 1 } : { foo: null };
const isObjectValueNotNull = objectValue.foo != null;

objectValue.foo = something_from_outside; // object면 이런식으로 중간에 값이 갈아채질 수 있음!!
// objectValue.foo = 3; // 이런 정적 보장 되는 값이 들어갔다면 아래에 foo는 오히려 타입이 number!
if (isObjectValueNotNull) {
  const foo = objectValue.foo; // nullable (타입가드 안됨!)
}
if (objectValue.foo !== null) {
  const foo = objectValue.foo; // non nullable
}
```

- 3번 같은 경우는 object라서 중간에 값이 변경될 위험이 있음.
- 원시타입으로 하면 const 로 빼도 타입가드가 된다.

```tsx
const objectValue: { foo: number | null } = planUsageInfo.data.promotion ? { foo: 1 } : { foo: null };
const isObjectValueNotNull = objectValue.foo != null;

objectValue.foo = null; // 이런 정적 보장 되는 값이 들어갔다면
if (isObjectValueNotNull) {
  const foo = objectValue.foo; // 여기는 오히려 타입이 null
}
```

- [`objectValue.foo](http://objectValue.foo) = null` 처럼 정적으로 보장되는 타입이 중간에 들어가면 foo 타입은 null로 고정됨. objectValueNotNull 에 감싸진 block이라도.

## 매번 if (planUsageInfo.data.promotion != null) 로 검사해야하는가? 재사용하고싶다면?

⇒ 타입가드를 쓰시오

```tsx
function isPromotionType(promotion: Promotion | null): promotion is Promotion {
  return planUsageInfo.data.promotion !== null;
}

if (isPromotionType(planUsageInfo.data.promotion)) {
  const foo = planUsageInfo.data.promotion; // not nullable
}
```