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

상태를 뒤로 이동할 좋은 아이디어가 있을까?
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

### 예시 상황

> A페이지에서 이벤트1을 하면 B페이지로 가고, 이벤트2를 하면 C페이지로 갑니다.
> B페이지에서 이벤트3을 하면 C페이지로 갑니다.

```js
{
  state: {
    A페이지: {
      on: {
        이벤트1: { target: 'B페이지' },
        이벤트2: { target: 'C페이지' },
      }
    },
    B페이지: {
      on: {
        이벤트3: { target: 'C페이지' },
      }
    },
    C페이지: {
      type: 'final'
    }
  }
}
```

여기서 C페이지에서 뒤로가기 하면 히스토리에 따라 B페이지/A페이지로 갈 수 있습니다.
이를 미리 정의해놓기 위해 state를 참고해 target을 C페이지로 보내는 모든 노드를 찾고(A페이지, B페이지)

- cond에서 context를 참고해 이전 페이지로 돌아갈 수 있는 조건을 만들어줍니다.
  - 컨디션1: context.previousStep이 A페이지면 A페이지로 보낸다
  - 컨디션2: context.previousStep이 B페이지면 B페이지로 보낸다

```js
{
  on: {
    BACK: [
      {
        cond: (context, _event, meta) => {
          const currentStepName = "C페이지"
          const previousStepName =
            context.history[context.history.indexOf(currentStep) - 1]
          return (
            meta.state.matches(currentStepName) &&
            previousStepName === "A페이지"
          )
        },
        target: "A페이지",
      },
      {
        cond: (context, _event, meta) => {
          const currentStepName = "C페이지"
          const previousStepName =
            context.history[context.history.indexOf(currentStep) - 1]
          return (
            meta.state.matches(currentStepName) &&
            previousStepName === "B페이지"
          )
        },
        target: "B페이지",
      },
    ]
  }
}
```

### 코드

이는 코드로 다음과 같이 표현할 수 있습니다.

```js
export function generateBackConditionsWithContext(
  states: StatesConfig<any, any, any>
) {
  const backConditions: TransitionsConfig<any, any> = []

  Object.keys(states).map(state => {
    const stateNodeConfig = states[state]
    if (stateNodeConfig === undefined) {
      return
    }
    const targetStepNodes = deepSearchItems(stateNodeConfig, "target")

    targetStepNodes.map(({ target }) => {
      backConditions.push({
        cond: (context, _event, meta) => {
          const currentStepName = target
          // TODO: 뭔가 히스토리가 이상한데? indexOf인지 lastIndexOf인지 확인필요
          const previousStepName =
            context.history[context.history.lastIndexOf(currentStepName) - 1]
          return (
            meta.state.matches(currentStepName) && previousStepName === state
          )
        },
        target: state,
        event: undefined, // 필요 없지만 타입을 맞추기 위해 넣음
      })
    })
  })

  return backConditions
}

// @see https://stackoverflow.com/a/54470906
export function deepSearchItems(object: Record<any, any>, keyToFind: string) {
  let result: any[] = []
  const hasKeyProperty = Object.prototype.hasOwnProperty.call(object, keyToFind)

  if (hasKeyProperty) {
    result = [...result, object]
  }
  if (Object.keys(object).length) {
    for (let i = 0; i < Object.keys(object).length; i++) {
      const objectKey = Object.keys(object)[i]
      if (objectKey === undefined) {
        return []
      }
      const value = object[objectKey]
      if (typeof value === "object" && value != null) {
        const o = deepSearchItems(object[objectKey], keyToFind)
        if (o != null && o instanceof Array) {
          result = [...result, ...o]
        }
      }
    }
  }
  return result
}
```

머신을 사용하는 측에서 히스토리 관련 코드를 추가합니다.

```js
// 1. 상태 전이가 일어날 때마다 URL을 shallow업데이트 해서 history를 관리하고, xstate context에 history를 추가적으로 쌓는 액션을 호출합니다.
useEffect(() => {
  service.onTransition(state => {
    const isTransitionBySendingPushHistoryEvent =
      state.event.type === "PUSH_HISTORY"
    if (isTransitionBySendingPushHistoryEvent) {
      return
    }

    const url = `${QS.create({ ...Router.query, [stepQueryKey]: state.value })}`
    Router.push(url, undefined, {
      shallow: true,
    })
    send("PUSH_HISTORY", { currentStep: state.value })
  })
}, [send, service, stepQueryKey])

// 2. 뒤로가기시에 xstate 상태도 동기화를 시켜주기 위해 xstate액션을 호출합니다
useEffect(() => {
  Router.beforePopState(({ as }) => {
    if (as !== Router.asPath) {
      // TODO: 앞으로 가기 대응필요
      send("BACK")
    }
    return true
  })

  return () => {
    Router.beforePopState(() => true)
  }
}, [send])
```

xstate 머신에도 PUSH_HISTORY, BACK 이벤트를 추가해주면 완성!

```js
export const machine = createMachine<FunnelContext, AnyEventObject, FunnelTypeState>(
  {
    predictableActionArguments: true,
    id: '뒤로가기가능머신',
    on: {
      PUSH_HISTORY: {
        actions: 'pushHistory',
      },
      BACK: generateBackConditionsWithContext(states),
    },
    states,
  },

  {
    actions: {
      pushHistory: assign({
        history: (prev, event) => [...prev.history, event.currentStep],
      }),
      // ...
    },
    guards: {
      // ...
    },
  }
);
```

사실 좀 더 폴리싱 필요.. 근데 얼추 됨! ㅎㅎ

<!-- - 이렇게 하려면 step 이동시마다 history를 쌓아야 한다
  - 머신 밖에서 동적으로 쌓기
    - onTransition에서 `send('PUSH_HISTORY', {currentStep: state.value})` 하면 이 이벤트가 상태 전이를 일으키지 않더라도 다시 onTransition을 부르나봄... 그래서 무한호출
      - send 호출로 일어난 onTransition을 발라낼 수 있다면 거기선 send를 안 하면 될텐데
        - => 이렇게 해서 성공! 무한호출이 일어나서 보기 어렵다면 debugger를 걸자
  - 머신 내부에서 정적으로 정의해두기
    - 모든 transition이 일어날 때마다 추가적으로 호출되는 이펙트에 PUSH_HISTORY 액션을 태우자
    - 머신 최상단에 `always: { actions: 'pushHistory', cond: 'isAlways' },` 를 정의하고, isAlways 가드를 true로 반환하게 하니까 maximum call stack 에러가 난다. -->
