---
title: XState에서 뒤로가기 구현
description: 제발 날 살려조
date: "2022-09-23"
category: dev
---

## 뒤로가기

- https://github.com/statelyai/xstate/issues/188
- https://github.com/statelyai/xstate/discussions/1654

### 문제상황 정의

복잡한 퍼널의 상태관리를 XState로 개선하고 있습니다.
XState에서는 이벤트를 통해 상태 사이를 이동할 수 있는데요,
(e.g. 개통안내스텝 상태에서 개통하기\_클릭 이벤트를 발발하면 유심시리얼번호스텝으로 상태가 변한다)
이 구조에서 뒤로가기 기능을 구현하려는데 고민이 있어요.

가장 기본적인 해결책은 ‘상태 노드마다 뒤로가기 이벤트 추가’겠지만,
(e.g. 유심시리얼번호스텝 상태에서 뒤로가기 이벤트를 발발하면 개통안내스텝으로 상태가 변한다)
이미 그래프로 흐름이 잘 표현되어있는 구조에 뒤로가기 기능만을 위하여 모든 상태노드에 이벤트를 추가하는게 번거로울 뿐더러 유지보수 측면에도 좋지 않고,
뒤로가기 해서 보여줘야 하는 페이지가 dynamic할 때 (e.g. 유심시리얼번호스텝 은 개통안내스텝 로부터 왔을수도 있고 브릿지스텝 으로부터 왔을수도 있다) 구조를 추가적으로 변경해줘야 한다는(compound한 뒤 history node쓰는 등) 단점이 있어요.

상태를 뒤로 이동할 다른 아이디어가 있을까요?
(현재 상태 이동시 shallow push를 해서 history스택 및 url(쿼리파라미터)는 관리되고 있습니다)
전 요런 방식 생각해봄

- A→B→C 상태를 이동했다고 했을 때 C에서 뒤로가기하면 쿼리파라미터는 B인데 xstate상태는 C이다
- xstate상태와 쿼리파라미터가 미스매치가 일어나면 xstate의 initial상태를 쿼리파라미터로 해서 reinitialize한다
  - 근데 이미 머신을 돌리면 재시작을 막고있는듯 ㅠ

### 방법1: 상태 배열로 이벤트를 생성해내기

```js
const steps = ["브릿지스텝", "개통안내스텝", "유심시리얼번호입력스텝"]

export const LGU개통상태머신 = createMachine({
  on: {
    BACK: globalHistory.map((currentStep: string) => {
      const previousStep = steps[steps.indexOf(currentStep) - 1]
      return {
        cond: (_context, _event, meta) => meta.state.matches(currentStep),
        target: previousStep,
      }
    }),
  },
})
```

- step 순서가 일렬로 정해져 있을 때 사용할 수 있는 방법.
  - 뒤로가기 해서 보여줘야 하는 페이지가 static하게 정해지지 않을 때는 사용 불가능.
    - xstate전제 자체가 모든 transition은 statically defined되어야 한다-인데 dynamic target은 말이 안 되니...
  - 여기서 steps 변수를 정적 말고 동적으로 관리(history를 쌓는식으로)하면 될것같았는데 state나 event는 finite갯수임이 보장되어야 하기 때문에 글케 동적으로 할수가 없군요… 머신 내에서 동적으로 관리할 수 있는 공간은 context인데 그걸 어케저케 사용해보아야 하려나
- 비슷한 디스커션: https://github.com/statelyai/xstate/discussions/1939

### 방법2: Static하게 역계산해두기 (feat. cond + context)

static하게 역계산을 해낼 수 있을까? (쨋든 트랜지션을 다 static하게 정의해낼 수 있긴 할것같음)

- 무슨 액션을 통해서 온 지 안다면 그 액션을 쏜 노드로 보내주기?

a에서 이벤트1을 하면 b로 가고 이벤트2를 하면 c로 감
b에서 이벤트3을 하면 c로 감

- c에서 뒤로가기 하면

  - meta.event.type 이 '개통하기\_클릭'임
    - 근데 이벤트가 string이기만 하고 id가 없어서 판별할수가 없음 ㅠ
  - 이벤트3을 통해 왔다면 b로
  - 이벤트2를 통해 왔다면 a로 보내면 됨.

- c에서 뒤로가기 하면

  - target을 c로 보내는 모든 노드를 찾음: a, b
  - 컨디션1: context.fromNode가 a면 a로 보낸다
  - 컨디션2: context.fromNode가 b면 b로 보낸다
  - context에 history를 동적으로 쌓으면 가능할수도? history는 면밀하게 context에 잘 쌓고,

  ```js
  {
    on: {
      BACK: [
        {
          cond: (context, _event, meta) => {
            const previousStepName =
              context.history[context.history.indexOf(currentStep) - 1]
            return meta.state.matches("c") && previousStepName === "a"
          },
          target: "a",
        },
        {
          cond: (context, _event, meta) => {
            const previousStepName =
              context.history[context.history.indexOf(currentStep) - 1]
            return meta.state.matches("c") && previousStepName === "b"
          },
          target: "b",
        },
      ]
    }
  }
  ```

  -
