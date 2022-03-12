---
title: (TypeScript) catch절의 error변수 접근시 'Argument of type 'unknown' is not assignable...'에러가 나요!
date: "2021-11-22"
description: "TS 4.0의 unknown on catch Clause Bindings 업뎃 때문이랍니다"
---

## TL;DR

> catch절의 e변수 타입이 any에서 unknown으로 바뀌었습니다. <br/>type을 any로 명시해주거나 원하는 타입으로 좁혀서 사용하세요.

## 부레이킹 췌인지

![unknown on catch clause 에러](https://user-images.githubusercontent.com/3839771/142794836-38d559d2-3fc3-48db-a1bb-8ad61854e203.png)

TS v4로 업뎃하고 타입체크(`yarn tsc --noEmit`)를 돌려보니 에러가 107개가 쏟아지더라.

대부분 try catch문에서 error변수 접근시 나는 에러였음

## 에러 변수 타입이 바뀌었어요. any → unknown

지금까지 catch절 error변수는 any타입이었다. 그래서 아무렇게나 메서드를 호출해도 타입오류가 나지 않았어요.

```js
try {
  // 어쩌구
} catch (x) { // x가 any라서
  x.message; // 오브젝트라 가정할수도 있고
  x.toUpperCase(); // 스트링이라 가정할수도 있었음.
  x++;
  x.yadda.yadda.yadda(); // 맘대로 다 불러도 타입에러가 나지 않았음.
}
```

그러다보니 error변수 관련 코드에서 오타가 있어도 타입스크립트가 잡지 못하는 아쉬움이 있었음 ㅠㅠ
~에러가 나는 에러핸들링 코드~

그래서 TS 4.0부터는 error변수를 unknown으로 명세해서 사용하는 개발자가 직접 error변수의 타입을 명시해주도록 업데이트함!

## 해결책

```js
try {
  // 어쩌구
} catch (x) {
  x.message; // type error: Object is of type 'unknown'
	if (typeof e === 'string') {
		x.toUpperCase(); // 해결!
	}
}
```

간단하게는 아래와 같이 해결할수도 있는데, 이는 추후에 strict모드에서 막힐 예정임

```js
try {
  // 어쩌구
} catch (x: any) {
  x.message; // 해결!
}
```

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#unknown-on-catch-clause-bindings