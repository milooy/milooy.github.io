---
title: XState 공식문서 탐구
description: 공식문서좀 봐라
date: "2022-09-21"
category: dev
---

## 만든 머신 돌리기

- interpret, onTransition, start, send 함수로 호출
  - 리액트에서는 useMachine훅으로 한방에 가능
- state.value==='state이름' 대신 state.matches로 하면 장점

## 기본 개념

- 트랜지션은 이벤트로부터 불림. (이벤트명으로 트랜지션을 라벨링)
- 도식 뜻
  - 점으로 시작하면 initial state, 보더가 하나 더 있으면 final state, 박스 안에 있으면 child state
- compound states
  - state안의 state. Child state라고도 불림
  - (child state가 없는 상태는 atomic state라고 부름)
- Parallel states
  - child state(region)를 여러개 동시에 가질 수 있는 상태
    - 강아지걷기CompoundState
      - 액티비티ChildState리젼: 걷기 / 달리기 / 냄새맡기
      - 꼬리ChildState리젼: 흔들기 / 안흔들기
      - (걸으면서 꼬리 흔들 수 있다)
- Self-transition
  - 이벤트는 일어났지만 상태는 변하지 않음.
  - 간식조르기상태 -> 간식주기이벤트 -> 다시 간식조르기상태 (무한반복)
- Delayed transitions
  - 특정 시간 이후에 transition 일으키는것. (표에선 이벤트에 `after n minute`처럼 보임)
  - e.g. 로그인 후 `after 3 minutes` 이벤트 일어나면 자동로그아웃 상태로 변경
- Actions
  - effects나 side-effects라고 불림.
  - 스테이트차트 시퀀스에 영향 없는 이벤트.
  - state진입이나 나갈때, 혹은 transition에 불릴 수 있음.
    - e.g. 진입시/ 유저에게 '자동로그아웃'을 안내한다.

## 머신

- 몇 개의 state들이 event로 인해 transition되는 선언적인 집합.
- state 노드랑 동일한 config를 가지지만 'context'만 추가되어있다.
- options:
  - actions: fire-and-forget액션들
  - delays: 딜레이
  - guards: 트랜지션 가드 (cond로 쓴다)
  - services:
- withConfig로 extend할 수 있음
- withContext로 initial context넣을 수 있음
  - 주의: shallow merge가 아니므로 머지할려면 ...fooMachine.context로 펼쳐줘야 한다

## States

- 애플리케이션의 특정 시점의 추상화된 표현
  - value: 상태명
  - context: 현 시점 컨텍스트
  - event: 이 상태로 변경시켜준 event
  - actions: 현 시점에 실행 가능한), context 등등 모두를 포함함
  - history: 직전 state 인스턴스
  - meta: static 메타데이터 넣을 수 있음
  - done: final state인지 여부
- 메서드
  - `state.matches(parentStateValue)`
    - 여러개의 상태 중 match여부를 알고 싶을 때는 Array.some에 인자 넘기자 (`['RED', 'GREEN'].some(state.matches)`)
  - state.nextEvents: 트랜지션을 일으킬 수 있는 이벤트 목록
  - state.changed: 트랜지션 일으킨 상태가 잘 바뀌었는가
  - state.done: final state인가
  - state.hasTag(tag): 해당 태그를 갖고 있는가. 얘도 유용하게 쓸 수 있을듯
  - state.can(event): 해당 이벤트를 발발할 수 있는가
- 상태 유지하기
  - state를 stringify해서 로컬스토리지에 저장해다 쓸 수 있다.
- 메타 데이터
  - 상태에 몇개 static한 데이터를 넘기고 싶을 때 쓴다. alert message든..

## State Nodes

- state config를 나타냄.
- child state node는 substate node라고도 부른다.
- 5가지 타입
  - 명시해두면 ts에서 체크할때 유용하다
  - atomic: child state 없는 노드
  - compound: 1개 이상의 child state있고 initial state있음.
  - parallel: 2개 이상의 child state있고 initial state없음(한번에 여러 상태 가질 수 있으니)
  - final: 마지막 state
  - history: ?
- Transient state nodes
  - 스쳐 지나가는 state node. 이벤트 없이 `always`만 명시하면 된다.
  - e.g. initial state가 동적으로 결정될 때 `unknown: {always: [{target: 'morning', cond: 'isBeforeNoon'}]}`이런식으로 하기.
- tags
  - 서로 다른 state node를 카테고라이징할 때 편함.

## transition

- self transitions
  - internal transition: 나가거나 들어온게 아니라서 `entry`, `exit`액션이 발발 안된다. target을 명시 안하면 기본적으로 internal.
  - external transition: 위와 반대. 현상태에서 현상태로 self transition할 때 target을 현상태이름으로 명시 하면 external로.
- always 트랜지션(이벤트 없이!)
- 와일드카드
  - '\*'을 쓰면 따로 명시한 이벤트가 아닌 모든 이벤트가 여기로 들어온다

## Effects

- 사이드이펙트는 2가지.

### 1. Fire-and-forget events

- 동기적으로 보내기만 하고 statechart에 추가로 반영되는 이벤트 없음.

1. Actions

- A. entry 액션: 스테이트 노드 내부에 명시.
- B. exit 액션: 스테이트 노드 내부에 명시.
- C. transition 액션: 이벤트에 명시. `actions: ['consolelog']`
  - 굳이 machine config에 안 적고 이벤트 내에 바로 inline function으로 적어도 됨!
- send action: send(event)는 액션 크리에이터.
  - 잘 이해 안감

2. Activities

### 2. Invoked effects

- 비동기로 데이터를 받을 수 있음

1. Invoked Promises
2. Invoked callbacks
3. Invoked observables
4. Invoked machines

## Guarded transitions

- inline으로 짤 수도 있음 (이게 더 코드상으론 읽기 편해뵈네) (visualize되었을땐 어케 보이려나?)
- custom guards
  - cond에 원하는 데이터 추가로 넘겨서 가드 함수에서 받아서 쓸 수 있다 (e.g. minLength: 3)

## Context

- 다이나믹한 initial context 주입을 원한다면 factory function 만들어서 createMachine호출하면 된다.
- custom initial state를 원한다면 withContext.
- assign 함수를 통해서 컨텍스트 업데이트

## Models

- 옵셔널. context랑 events를 createModel메서드를 통해 모델링할 수 있다. 두개를 타이핑하는 편한 방법.

## Invoking Services

- 머신 하나만 쓰는건 복잡해질 수 있다. 여러 머신이 소통하게 만드는게 좋음.
  - Actor model과 닮음. 각 머신이 actor고 이벤트를 보내고 받을 수 있다.
- state node에 `invoke`를 추가한다
  - src를 넣음: string일수도, machine일수도, 프로미스/콜백/옵저버블을 뱉는 함수가 될수도 있음.
- 흥미롭군. 유용하게 쓸듯!

## Actors

- 여러 개의 액터가 서로 커뮤니케이트 하는 모델

## Delayed events and transitions

- state node안에 `after: {3000: target: 'yellow'}`이렇게 쓸 수 있음.

## History

- state node의 특수한 종류. 해당 리전의 last state value로 이동한다.
  - e.g. fanOff 상태에서 선풍기 파워 키면 fanOn상태에서 기존에 종료되었던 서브스테이트(1단/2단/3단)로 트랜지션 (히스토리가 없다면 initial state로. 혹은 target지정하면 initial state 변경가능)

## Interpreting machines

- 현재 상태 유지하고 사이드이펙 돌리고 delayed transition 다루고 external service랑 커뮤니케이션 하기 위해선
  - interpreter로 인스턴스 시작 필요 (이렇게 시작된 인스턴스는 service라 부른다)
- service.send에 여러 이벤트를 배치성으로 보낼수 있음.
- service.onTransition으로 트랜지션 일어날 때 listening 할 수 있음.

## 리액트랑 같이 쓰기

https://xstate.js.org/docs/recipes/react.html#global-state-react-context
