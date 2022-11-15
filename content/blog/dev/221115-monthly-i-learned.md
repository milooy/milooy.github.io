---
title: 2022년 11월 Monthly I Learned
description: 읽고 짧게 요약하자
date: "2022-11-15"
category: dev
---

## 11/15

### (번역) 블로그 답변: React 렌더링 동작에 대한 (거의) 완벽한 가이드

https://velog.io/@superlipbalm/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior

1. 리액트가 DOM을 그릴때
   1. 컴포넌트 트리 전체에서 렌더 출력 수집
   2. 재조정(reconciliation): 새로운 객체트리(가상DOM)과 비교해 실제 DOM을 원하는 출력처럼 보이기 위해 비교하고 계산하는 작업
      1. (요즘 리액트팀은 가상DOM 용어 안씀. 그건 DOM문제에 초점맞춘거같은데 리액트는 실은 UI를 값으로 취급할 수 있다는 좀 더 큰/다른 의의가 있기 때문.)
   3. 렌더 단계(컴포넌트 렌더, 변경사항 계산) → 커밋 단계 (변경사항 DOM적용)
      1. 리액트 18은 useTransition과 같은 동시렌더링 기능으로 브라우저가 이벤트 처리 가능하도록 렌더 단계에서 작업을 일시 중지하고 나중에 손 남을 때 렌더패스 완료 및 커밋.
2. 렌더 로직이 수행해도 되는것과 안되는것
   1. side effect와 순수에 대해 생각해보게 되넹 ㅎ

### useLayoutEffect

- 모든 DOM 변경 이후에 동기적으로 발생.
- 화면을 paint하기 이전시점에 동기적으로 수행.
  - SSR상황에선 우리가 원하는것처럼 화면그리기 이전시점에 호출되지 않음을 주의.

### React18의 새로운 훅: useTransition, useDefferedValue

너무 많이 함수가 호출되거나 값 바뀌지 말라고 전에는 스로틀링이나 디바운스 하곤했다.

- 스로틀링: 지정시간동안 함수 최대한번
- 디바운스: 너무 자주 일어나지 않도록 일정시간동안 함수 지연 (e.g. 자동완성)

다만 이 방식의 한계는 변화하는 상황에 따라 delay를 조절할 수 없다는게 있음 (빠른 컴퓨터는 작게, 느린 컴은 크게?...)

리액트 18은 fiber라는 엔진을 개선해서 자체 스케쥴러로 작업의 우선순위를 정하고 유저경험(빠른 interaction)에 중요한 일이 아니면 우선순위 낮춰 프레임률 유지하도록 함!

그래서 멍충하게(ㅠ) 일정시간 불필요하게 함수 지연하게는게 아니고, 끊김없이 사용자가 상호작용하게 해주고 그렇지 않을때 무거운 값 업뎃하도록.

- useTransition: 함수 실행의 우선순위를 늦춤

```js
const [isPending, startTransition] = useTransition()
const [count, setCount] = useState(0)

function handleClick() {
  startTransition(() => {
    setCount(c => c + 1) // 요 함수업뎃이 낮은우선순위로 진행됨. 중요한 이벤트가 있는경우 걜 먼저하고 얘는 노업뎃.
  })
}
```

useDefferedValue: 값의 업데이트 우선순위를 늦춤

```js
const query = useSearchQuery("")
const deferredQuery = useDeferredValue(query) // 우선순위 높은 작업이 없을때만 query값이 업뎃됨

const suggestions = useMemo(
  () => <SearchSuggestions query={deferredQuery} />,
  [deferredQuery]
)

return (
  <>
    <SearchInput query={query} />
    <Suspense fallback="Loading results...">{suggestions}</Suspense>
  </>
)
```
