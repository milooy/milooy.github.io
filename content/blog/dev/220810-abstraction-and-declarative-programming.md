---
title: 선언형, 명령형 코드 그리고 추상화
description: 모호한 그 삼각관계
date: "2022-08-10"
category: dev
---

회사 프론트 동료들과 추상화와 선언적인 코드의 관계에 대해서 이런저런 이야기를 나눴습니다.
머릿속에 추상적으로 있던 개념이 좀 각이 잡혀서 ㅎㅎ
한 번 글로 적어보려 합니다.

## 선언형이 뭐냐?

가장 많이들 알고 있는 정의는 How/What 키워드죠.

> 명령형은 어떻게(How)에, 선언형은 무엇을(What)에 집중합니다

이렇게 보면 어떤 코드는 명령형이고, 어떤 코드는 선언형인지 무 자르듯이 나뉠 것처럼 보이지만, 실은 선언형이란 **명령형 코드에서 '어떻게'를 감추고 '무엇을'만 노출하는 방식의 추상화**(일종의 리팩토링)입니다.

![기둥 뒤에 공간있어요](https://blog.kakaocdn.net/dn/bopSdw/btqEN9L59C3/bFiJmNHGlIEOP0t0KTQz41/img.jpg)
(선언형 안에 명령형 있어요...)

### 실생활로 예시를 들어보자

- 명령형: "내 앞의 테이블을 하나씩 확인해서 4명 자리가 있다면 그 테이블로 걸어가서 앉는다"
- 선언형: "4명 자리에 앉을게요"

선언형에선 마법처럼 테이블 확인이 끝난게 아니고, **내부에서 명령형 로직으로 구현**이 되어있음을 가정한 것입니다.

### 코드로 예시를 들어보자

- 명령형: "배열에 있는 모든 숫자를 하나씩 제곱해서 result배열에 넣는다"

```js
function double(arr) {
  let results = []
  for (let i = 0; i < arr.length; i++) {
    results.push(arr[i] * 2)
  }
  return results
}
```

- 선언형: "숫자가 제곱된다. 모든 배열에서."

```js
function double(arr) {
  return arr.map(item => item * 2)
}
```

여기서도 선언형이 마법처럼 모든 배열을 순회해준게 아니라, `map`이란 함수에서 **내부적으로 명령형**으로 for문을 돌았습니다.

## 그럼 함수로 묶으면 선언적이게 되냐?

그렇다면 What만 이름/인자에 노출하고, How는 함수 내부에 때려박으면 그건 선언형으로 리팩토링 한걸까요?

위의 실생활 예시를 다시 가져와볼게요.

```js
let myPosition

// 4인 테이블이 보일때까지 테이블을 순회한다
for (let i = 0; i < tables.length; i++) {
  if (tables[i].emptySeat >= 4) {
    myPosition = tables[i].position
  }
}
```

이 코드가 명령형이라는건 다들 느낌 올 거예요.

근데 그렇다면 다음과 같이 How를 감추고 What만 노출한 함수를 만든다면 '선언적 코드'라고 할 수 있을까요?

```js
moveToEmptyTable(myPosition, tables)
```

좀 애매하쥬?

![hmm cat](https://i.pinimg.com/originals/fb/65/a2/fb65a2eb1a2aedca817c4569bf87fcd4.png)

## 선언적 코드의 추가 조건: 순수하길 바라 >\_<

[위키피디아](https://en.wikipedia.org/wiki/Declarative_programming)에서 `Declarative programming`을 검색해보면

> 선언적 프로그래밍은 '명령형이 아닌 스타일' 외에도 대중적인 정의들이 몇 가지 더 있다
>
> - A high-level program that describes what a computation should perform.
> - Any programming language that lacks side effects (or more specifically, is referentially transparent)
> - A language with a clear correspondence to mathematical logic.

여기서 새롭게 주목할만한 곳은 두 번째 불렛인데,
**사이드 이펙트가 적고 순수하다**라는 포인트 입니다.

```js
moveToEmptyTable(myPosition, tables)
```

위 함수는 왜 충분히 선언적이지 못할까요?

여러 번 불렀을 때, 혹은 다양한 상황에서 불렀을 때 다른 결과물을 줄 수 있기 때문입니다. 이로써 충분히 **재사용하기가 어려워**졌죠.

예를 들어 빈 자리에 이미 앉아있는 경우에 또 `moveToEmptyTable`을 호출했다면 그 다음에 있는 빈 자리를 찾아갈지, 아니면 아예 꼬여버릴지 모르는 코드이기 때문이에요.

**언제 불러도 같은 결과를 줄 수 있는 함수**로 리팩토링해본다면, 다음과 같이 두 함수로 쪼개면 어떨까요?

```js
const emptyTablePosition = getEmptyTablePosition(tables)
move(me, emptyTablePosition)
```

- 코드의 절차적인 순서에 상관 없이 언제 어디서 불러도 동일한 결과물을 주고 (재사용성 up!)
- What이 함수명에 적절히 표현되었으며
- 세부 구현은 함수 내부에 추상화 된

코드가 되었네요.

## 선언적 함수의 또 다른 특징: 코드순서 노상관

**'절차적인 순서'** 키워드를 좀 더 얘기해볼게요.

라인 바이 라인의 **코드 순서가 중요하지 않아질수록 더 선언적이게** 됩니다.

순서 의존도가 없기 때문에 사이드이펙트도 줄어들고 이해하기도 쉬워지구요.

예를 들면, 리액트 컴포넌트의 prop은 순서에 상관 없이 동일한 동작을 하죠?

```jsx
<Modal
  title="뭐먹지"
  onClick={() => alert("짬뽕")}
  description="중국음식?"
>
```

_여기서 title, onclick, description 의 코드 순서는 중요하지 않습니다. 그저 필요한 명세를 때려박으면 되어요._

## 명령형 추상화, 선언형 추상화

기본 구현을 명령형으로 추상화, 선언형으로 추상화 해보면서 확실히 이해해볼게요.

동, 읍, 면 Input이 있고,
동을 입력하면 자동으로 읍으로,
읍을 입력하면 자동으로 면으로 넘어가는 코드입니다.

**(Original) 명령형 코드**

```js
if (value.length < maxLength) {
  return
}
if (cursorPosition === "동") {
  읍input.focus()
  읍input.selectionStart = 읍input.value.length
} else if (cursorPosition === "읍") {
  면input.focus()
  면input.selectionStart = 면input.value.length
}
```

**(Refactor - A) 명령형 추상화**

```js
const isInputFull = value.length === maxLength
if (!isInputFull) {
  return
}
if (cursorPosition === "동") {
  moveToInput("읍")
} else if (cursorPosition === "읍") {
  moveToInput("면")
}
```

**(Refactor - B) 선언형 추상화**

```jsx
<Input name="동" onFull={() => moveFocusTo('읍')}/>
<Input name="읍" onFull={() => moveFocusTo('면')}/>
<Input name="면"/>
```

정답은 없습니다 ㅎㅎ 여러분은 위와 다른 방식으로 선언형 추상화를 해보셔도 좋겠어요.

## 정리

그럼 정리 해볼게요.

명령형 코드를

- What을 적절히 인터페이스에 노출하면서
- How를 내부에 감추고
- 언제 어디서 불러도 동일한 결과가 나와서 재사용하기 편하게 추상화 한다면

적당~히 만족스러운 선언적 코드가 나오는 것 같습니다 ㅋㅋ

선언형이 명령형보다 진보한 코드 스타일이라는건 아니에요.

필요한 만큼 어느 레벨까지 추상화하면 좋을까- 라는 Case by case별로 다른 문제입니다.

다만 복잡한 웹 코드를 선언적으로 짰을 때 읽기도, 디버깅하기도, 재사용하기도 좋다는 장점이 있죠.

명령형 코드는 흐름을 따라가면서 읽어줘야하는, `시간축`이라는 레이어가 추가되어 있으니까요.

그럼 오늘도 Happy coding!

## Thanks to

논의를 꺼내준 유성님, 함께 발전시켜준 병철님 창영님 땡큐쓰
