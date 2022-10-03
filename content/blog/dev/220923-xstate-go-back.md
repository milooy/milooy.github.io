---
title: XState에서 뒤로가기 구현
description: 유한 상태머신에 동적인 이벤트 끼얹기
date: "2022-09-23"
category: dev
---

XState를 들어보셨나요?
복잡한 이벤트, 상태를 선언적으로 개발할 수 있는 FSM이란 모델을
자바스크립트에서 쉽게 쓸 수 있게 구현해둔 라이브러리입니다.
(XState가 더 궁금하다면? → https://milooy.github.io/dev/220913-xstate/)

저는 핸드폰 요금제 가입 Flow를 개발할 때 XState를 사용했는데요,
여러 페이지에 거쳐 유저가 기입한 정보를 얻어내는 flow를 한번에 정의하기 참 좋아서 만족도가 높았습니다

예를 들면

```
[통신사 선택 페이지] ->(다음 버튼 클릭) -> [납부카드 입력 페이지]
                                 -> (직접기입 버튼 클릭) -> [직접입력 페이지]
```

디자이너가 한 판으로 그려주는 이런 일련의 flow를 다음과 같이 객체 하나로 정의할 수 있게 되는거죠.

```js
{
  state: {
    통신사선택페이지: {
      on: {
        다음버튼클릭: { target: '납부카드입력페이지' },
        직접기입버튼클릭: { target: '통신사직접입력페이지' },
      }
    },
    통신사직접입력페이지: {
      on: {
        직접기입버튼클릭: { target: '납부카드입력페이지' },
      }
    },
    납부카드입력페이지: {
      type: 'final'
    }
  }
}
```

다만 큰 산이 하나 있었습니다.
여러 페이지에 거쳐 정보를 받아내는 설문조사형 UX라 뒤로가기, 앞으로가기가 가능해야하는데
"가용한 모든 이벤트와 상태를 정적으로 미리 생성해둔다!" 란 XState의 컨셉에선
"동적으로 쌓이는 history를 참조해서 페이지를 이동시킨다!" 가 근본적으로 들어맞지 않더라구요.

조금 더 상세히 보면,
XState는 정해진 개수의 이벤트를 통해 상태를 변경시키는 컨셉을 가지고 있습니다.
예를 들어 NEXT라는 이벤트를 통해 A페이지에서 B페이지로 상태를 이동했다면,
뒤로가기를 위해서 B페이지에서 A페이지로 상태를 이동하는 이벤트도 사전에 정의해줘야 합니다.

하지만 이를 위해 모든 노드에 뒤로가기 이벤트를 하드코딩으로 심는건 비효율적일 뿐더러
동적으로 이동한 경우나 앞으로가는 경우는 실제 브라우저의 history가 쌓이기 전까진 알 수 없습니다
(e.g. C에서 뒤로가기시 A에서 왔는지, B에서 왔는지 정적으로는 판별 불가능)

하지만 결국 그랬듯이 우리는 답을 찾아낼 수 있습니다.

### 방법1: 정적인 배열을 참고해 뒤로갈, 앞으로 갈 페이지 알아내기

```js
const steps = ["a페이지", "b페이지", "c페이지"]

export const machine = createMachine({
  on: {
    BACK: steps.map((currentStep: string) => {
      const previousStep = steps[steps.indexOf(currentStep) - 1]
      return {
        cond: (_context, _event, meta) => meta.state.matches(currentStep),
        target: previousStep,
      }
    }),
  },
})
```

페이지를 이동하는 순서가 정해져있다면 쉽게 앞으로가기, 뒤로가기 이벤트를 정적으로 생성해낼 수 있습니다.

다만 뒤로가기 해서 보여줘야 하는 페이지가 런타임에 동적으로 정해진다면 사용할 수 없습니다.

(C페이지가 A에서 왔는지, B에서 왔는지는 사용자가 어떻게 쓰냐에 따라 달라지니)

- 비슷한 디스커션: https://github.com/statelyai/xstate/discussions/1939

### 방법2: 상태 그래프를 통해 정적으로 역계산 + Context에서 History객체 관리

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

### 방법3: 인접노드 이동만 Static하게 생성해두기 (feat. cond + event)

#### 방법 2의 한계: 뒤로가기만 되고 앞으로가기는 안됨..

앞으로가기를 구현하려고 봤더니 브라우저 히스토리가 그냥 stack + pop방식이 아니라는걸 인지했습니다.

예를 들어 a, b, c , 뒤로가기해서 b, 앞으로가기해서 a 했을 때

- stack이라면 히스토리가 [a, b, c, b, a]일테고
- stack + pop이라면 히스토리가 [a]..일텐데 이건 말이 안됨. pop해버리면 앞으로가기 할수가 없더라구요.

그래서 브라우저 히스토리는 stack + pop없이 index로 계산해야 합니다.
위 경우는 히스토리가 [a, b, c]이되 index가 a를 가리키고 있어야 하죠 (그래야 앞으로가기시 b, c를 기억해서 이동할 수 있으니)

그렇다고 앞으로가기를 위해 브라우저 히스토리와 동일하게 context에 stack + index를 구현해두는건 넘 빡세고 위험해보입니다. single source of truth가 아니니까요.

#### 다시 생각해보자

바텀업 말고 탑다운으로 out of box에서 다시 생각해봅니다.
[a, b, c, b] 상황의 b페이지에서

- 뒤로가기 하면 a
- 앞으로가기하면 b로 이동해야 합니다.

문제는 `Router.beforePopState` 는 뒤로가기와 앞으로가기를 구분할 수 없다는 거예요.
둘 모두에서 불립니다... history pop 이벤트핸들러의 리스너 함수니까요.

우리는 뒤로가기, 앞으로가기 구분 없이 다음 페이지를 알아내야 합니다.

그런데... 생각해보니 브라우저 히스토리 스택이 이미 내 다음 행선지를 다 알고 있네요?

xstate내부에 history context를 따로 관리하지 말고
브라우저 히스토리만 single source of truth로 관리하고
xstate에선 앞으로가기/뒤로가기시 가용한 모든 이벤트를 뚫어두고
얘가 다음 행선지를 안내하도록 해보면 어떨까요?

#### 히스토리 기반으로 from, to 알아내기

일단 xstate를 떠나서 브라우저의 Router.beforePopState 이벤트로 뒤로가기, 앞으로가기시 현재페이지/이동할페이지 경로를 알아냅니다.

위에서 service.onTransition 으로 경로가 변할 때마다 router shallow push를 하고있었기 때문에 브라우저 히스토리 스택은 착실히 쌓이고 있었을 것예요.

```js
Router.beforePopState(prop => {
  const { as } = prop
  console.log({ to: decodeURI(as), from: decodeURI(Router.asPath) })
  return true
})
```

굿. 뒤로가기, 앞으로가기 해보니 from, to 가 잘 찍히네요.

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

generate 함수를 만들기 전에, 잘 되는지 static하게 테스트를 해봅니다.
A ↔ B 사이를 앞으로 가기, 뒤로가기 할 수 있도록

A에서 B로 이동하는 이벤트, B에서 A로 가는 이벤트를 뚫어줍니다.

- 컨디션: 현재 머신상태가 b + 푸시타겟이 a라면: 타겟은 a
- 컨디션: 현재 머신상태가 a + 푸시타겟이 b라면: 타겟은 b

잘 동작한다! 감덩...

이로 인해 브라우저 history와 xstate context history 가 꼬일 걱정도 덜었습니다.

#### 인접한 노드 사이를 이동할 수 있는 이벤트 generate 함수

방법2 에서 만들었던 함수를 조금만 고치면 됩니다.

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

## 나 말고 다른 사람들의 Needs...

아무도 사용하지 않았던 방식. 라이브러리로 만들어서 제공해보자

- https://github.com/statelyai/xstate/issues/188
- https://github.com/statelyai/xstate/discussions/1654

<!-- - 이렇게 하려면 step 이동시마다 history를 쌓아야 한다
  - 머신 밖에서 동적으로 쌓기
    - onTransition에서 `send('PUSH_HISTORY', {currentStep: state.value})` 하면 이 이벤트가 상태 전이를 일으키지 않더라도 다시 onTransition을 부르나봄... 그래서 무한호출
      - send 호출로 일어난 onTransition을 발라낼 수 있다면 거기선 send를 안 하면 될텐데
        - => 이렇게 해서 성공! 무한호출이 일어나서 보기 어렵다면 debugger를 걸자
  - 머신 내부에서 정적으로 정의해두기
    - 모든 transition이 일어날 때마다 추가적으로 호출되는 이펙트에 PUSH_HISTORY 액션을 태우자
    - 머신 최상단에 `always: { actions: 'pushHistory', cond: 'isAlways' },` 를 정의하고, isAlways 가드를 true로 반환하게 하니까 maximum call stack 에러가 난다. -->
