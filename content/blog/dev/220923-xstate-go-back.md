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

### 방법3: 인접노드 이동만 Static하게 생성해두기 (feat. cond + event)

#### 방법 2의 한계: 뒤로가기만 되고 앞으로가기는 안됨..

앞으로가기를 구현하려고 봤더니 브라우저 히스토리가 그냥 stack + pop방식이 아니라는걸 인지함.

예를 들어 a, b, c , 뒤로가기해서 b, 앞으로가기해서 a
했을 때

- stack이라면 히스토리가 [a, b, c, b, a]일테고
- stack + pop이라면 히스토리가 [a]..일텐데 이건 말이 안됨. pop해버리면 앞으로가기 할수가 없음.

그래서 브라우저 히스토리는 stack + pop없이 index로 계산해야한다.
위 경우는 히스토리가 [a, b, c]이되 index가 a를 가리키고 있어야함 (그래야 앞으로가기시 b, c를 기억해서 이동할 수 있으니)

앞으로가기를 위해 브라우저 히스토리와 동일하게 context에 stack + index를 구현해두는건 넘 빡세고 위험해보인다; single source of truth가 아니니께.

#### 다시 생각해보자

바텀업 말고 탑다운으로 out of box에서 다시 생각해보자.
[a, b, c, b] 상황의 b페이지에서

- 뒤로가기 하면 a
- 앞으로가기하면 b로 이동해야 한다.

문제는 `Router.beforePopState` 는 뒤로가기와 앞으로가기를 구분할 수 없다는거.
둘 모두에서 불린다. history pop 이벤트핸들러의 리스너 함수니까.

뒤로가기, 앞으로가기 구분 없이 다음 페이지를 알아내야한다.

그런데... 생각해보니 브라우저 히스토리 스택이 이미 내 다음 행선지를 다 알고 있네?
xstate내부에 history context를 따로 관리하지 말고
브라우저 히스토리만 single source of truth로 관리하고
xstate에선 앞으로가기/뒤로가기시 가용한 모든 이벤트를 뚫어두고
얘가 다음 행선지를 안내하도록 해볼까?

#### 히스토리 기반으로 from, to 알아내기

일단 xstate를 떠나서 브라우저의 Router.beforePopState 이벤트로 뒤로가기, 앞으로가기시 현재페이지/이동할페이지 경로를 알아낸다.

위에서 service.onTransition 으로 경로가 변할 때마다 router shallow push를 하고있었기 때문에 브라우저 히스토리 스택은 착실히 쌓이고 있었을 것이다.

```js
Router.beforePopState(prop => {
  const { as } = prop
  console.log({ to: decodeURI(as), from: decodeURI(Router.asPath) })
  return true
})
```

굿. 뒤로가기, 앞으로가기 해보니 from, to 가 잘 찍힌다.

#### xstate 이벤트에 행선지 보내기

```js
Router.beforePopState(prop => {
  const { as } = prop

  const nextPageName = QS.parse(as)[stepQueryKey]
  if (as !== Router.asPath) {
    send("NAVIGATE", { navigateTarget: nextPageName })
  }
  return true
})

// xstate 머신
machine = {
  on: {
    PUSH_HISTORY: {
      actions: "pushHistory",
    },
    NAVIGATE: [
      {
        // B에서 A로 뒤로가기
        // 현재페이지가 B고 히스토리 이벤트에서 넘겨준 타겟이 A라면 A로 이동해라
        cond: (_context, event, meta) => {
          const currentStateValueMatched = meta.state.value === "B"
          const navigateTargetMatched = event.navigateTarget === "A"
          return (
            currentStateValueMatched === true && navigateTargetMatched === true
          )
        },
        target: "A",
      },
      {
        cond: (_context, event, meta) => {
          // A에서 B로 앞으로가기
          // 현재페이지가 A고 히스토리 이벤트에서 넘겨준 타겟이 B라면 B로 이동해라
          const currentStateValueMatched = meta.state.value === "A"
          const navigateTargetMatched = event.navigateTarget === "B"
          return (
            currentStateValueMatched === true && navigateTargetMatched === true
          )
        },
        target: "B",
      },
    ],
  },
  states,
}
```

generate 함수를 만들기 전에, 잘 되는지 static하게 테스트를 해본다.
A ↔ B 사이를 앞으로 가기, 뒤로가기 할 수 있도록

A에서 B로 이동하는 이벤트, B에서 A로 가는 이벤트를 뚫어준다.

- 컨디션: 현재 머신상태가 b + 푸시타겟이 a라면: 타겟은 a
- 컨디션: 현재 머신상태가 a + 푸시타겟이 b라면: 타겟은 b

잘 동작한다! 감덩.

이로 인해 브라우저 history와 xstate context history 가 꼬일 걱정도 덜었다

#### 인접한 노드 사이를 이동할 수 있는 이벤트 generate 함수

위에서 만들었던 함수를 조금만 고쳤다!

```js
function generateNavigateConditions(states: StatesConfig<any, any, any>) {
  const conditions: TransitionsConfig<any, any> = []

  Object.keys(states).map(stateValue => {
    const stateNodeConfig = states[stateValue]
    if (stateNodeConfig === undefined) {
      return
    }
    const targetStepNodes = deepSearchItems(stateNodeConfig, "target")

    targetStepNodes.map(({ target }) => {
      conditions.push(
        getCondition({ before: stateValue, after: target }),
        getCondition({ before: target, after: stateValue })
      )
    })
  })

  return conditions
}

const getCondition = ({
  before,
  after,
}: {
  before: string,
  after: string,
}) => ({
  cond: (_context: any, event: any, meta: any) => {
    const currentStateValueMatched = meta.state.value === before
    const navigateTargetMatched = event.navigateTarget === after
    return currentStateValueMatched === true && navigateTargetMatched === true
  },
  target: after,
  event: undefined, // 필요 없지만 타입을 맞추기 위해 넣음
})

// xstate 머신
machine = {
  on: {
    PUSH_HISTORY: {
      actions: "pushHistory",
    },
    NAVIGATE: generateNavigateConditions(states),
  },
  states,
}
```

#### 요약

XState 그래프를 받아 앞으로/뒤로 이동 가능한 모든 케이스의 컨디션을 생성합니다.
브라우저의 뒤로가기, 앞으로가기 이벤트에서 사용합니다.
utils.spec.tsx 를 참고하세요.

[왜 필요한가요?]
XState는 정해진 개수의 이벤트를 통해 상태를 변경시키는 컨셉을 가지고 있습니다.
예를 들어 NEXT라는 이벤트를 통해 A페이지에서 B페이지로 상태를 이동했다면,
뒤로가기를 위해서 B페이지에서 A페이지로 상태를 이동하는 이벤트도 사전에 정의해줘야 합니다.

하지만 이를 위해 모든 노드에 뒤로가기 이벤트를 하드코딩으로 심는건 비효율적일 뿐더러
동적으로 이동한 경우나 앞으로가는 경우는 실제 브라우저의 history가 쌓이기 전까진 알 수 없습니다
(e.g. C에서 뒤로가기시 A에서 왔는지, B에서 왔는지 정적으로는 판별 불가능)

이를 해결하기 위해 XState의 그래프를 받아 이동 가능한 모든 케이스의 컨디션을 생성해두고,
브라우저의 뒤로가기, 앞으로가기 이벤트 발생시 이동해야 하는 페이지를 XState이벤트 인자에 넘겨
걸맞는 condition을 타서 원하는 target으로 상태를 변경시킵니다.

[Use case]

1. 브라우저의 popState이벤트 발생. 브라우저는 현재 페이지와 이동해야할 페이지를 알고 있다.
2. 브라우저가 XState에 "나는 지금 B페이지야. A페이지로 이동해" 라고 요청한다.
3. XState는 해당 이벤트를 듣고, 현재 B페이지일때(state.value == 'B') 이벤트 인자가 A페이지라는(event. navigateTarget == 'A') 조건을 찾는다. 해당 조건은 target을 'A'로 변경해준다.
4. 이로서 브라우저도, XState도 현재 상태가 A페이지가 된다.

<!-- - 이렇게 하려면 step 이동시마다 history를 쌓아야 한다
  - 머신 밖에서 동적으로 쌓기
    - onTransition에서 `send('PUSH_HISTORY', {currentStep: state.value})` 하면 이 이벤트가 상태 전이를 일으키지 않더라도 다시 onTransition을 부르나봄... 그래서 무한호출
      - send 호출로 일어난 onTransition을 발라낼 수 있다면 거기선 send를 안 하면 될텐데
        - => 이렇게 해서 성공! 무한호출이 일어나서 보기 어렵다면 debugger를 걸자
  - 머신 내부에서 정적으로 정의해두기
    - 모든 transition이 일어날 때마다 추가적으로 호출되는 이펙트에 PUSH_HISTORY 액션을 태우자
    - 머신 최상단에 `always: { actions: 'pushHistory', cond: 'isAlways' },` 를 정의하고, isAlways 가드를 true로 반환하게 하니까 maximum call stack 에러가 난다. -->
