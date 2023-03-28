---
title: 타입챌린지 풀기
description: typeof Yurim === 'BABO'
date: "2023-03-28"
category: dev
---

## 230328: 12 - Chainable Options

by Anthony Fu (@antfu) #보통 #application

### 질문

체인 가능 옵션은 일반적으로 Javascript에서 사용됩니다. 하지만 TypeScript로 전환하면 제대로 구현할 수 있나요?

이 챌린지에서는 `option(key, value)`과 `get()` 두가지 함수를 제공하는 객체(또는 클래스) 타입을 구현해야 합니다. 현재 타입을 `option`으로 지정된 키와 값으로 확장할 수 있고 `get`으로 최종 결과를 가져올 수 있어야 합니다.

예시

```ts
declare const config: Chainable

const result = config
  .option("foo", 123)
  .option("name", "type-challenges")
  .option("bar", { value: "Hello World" })
  .get()

// 결과는 다음과 같습니다:
interface Result {
  foo: number
  name: string
  bar: {
    value: string
  }
}
```

### 유림답
```ts
type Chainable<T = {}> = {
  option<Key extends string, Value>(key: Key, value: Value): Chainable<Omit<T, Key> & {[ReturnKey in Key]: Value}>
  get(): T
}
```
- ChatGPT랑 같이 여차저차 풀다가 기존 Key 겹치면 뒤에 들어온 값 리턴시키는거 못찾고 결국 정답 봤다. Omit으로 Merge할 대상에 현재Key 제거해주면 되는구나.
- 제네릭에 기본값을 주면 제네릭 옵셔널하게 넘길 수 있구나
  - 그러면 메서드에서 전역처럼 공유해서 쓸 수 있겠구나

## 230325: 10 - Tuple to Union

by Anthony Fu (@antfu) #보통 #infer #tuple #union

### 질문

튜플 값으로 유니온 타입을 생성하는 제네릭 `TupleToUnion<T>`를 구현하세요.

예시:

```ts
type Arr = ["1", "2", "3"]

type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'
```

> GitHub에서 보기: https://tsch.js.org/10/ko

### 유림답

```ts
type TupleToUnion<T extends any[]> = T[number]
```

- 배열이나 객체의 값을 접근하는데 `[number]`를 유용히 써봐야겠다.
  - 저러면 union으로 나오는구나

---

## 230324: 9 - Deep Readonly

by Anthony Fu (@antfu) #보통 #readonly #object-keys #deep

### 질문

객체의 프로퍼티와 모든 하위 객체를 재귀적으로 읽기 전용으로 설정하는 제네릭 `DeepReadonly<T>`를 구현하세요.

이 챌린지에서는 타입 파라미터 `T`를 객체 타입으로 제한하고 있습니다. 객체뿐만 아니라 배열, 함수, 클래스 등 가능한 다양한 형태의 타입 파라미터를 사용하도록 도전해 보세요.

예시:

```ts
type X = {
  x: {
    a: 1
    b: "hi"
  }
  y: "hey"
}

type Expected = {
  readonly x: {
    readonly a: 1
    readonly b: "hi"
  }
  readonly y: "hey"
}

type Todo = DeepReadonly<X> // should be same as `Expected`
```

> GitHub에서 보기: https://tsch.js.org/9/ko

### 유림답

```ts
type DeepReadonly<T> = T extends Function
  ? T
  : T extends object
  ? { readonly [Key in keyof T]: DeepReadonly<T[Key]> }
  : T
```

- 리턴값을 재귀로 둘 수 있구나
- Mapped type 에 익숙해져야겠다
- 타입의 리턴값에서 삼항연산자를 쓸 수 있구나
- 타입에서 제네릭이 어떤 타입인지 알려면 extends를 쓰는구나
- readonly가 있구나
