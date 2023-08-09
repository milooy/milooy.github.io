---
title: XState with Funnel
description: 퍼널 뚫자
date: "2022-10-03"
category: dev
---

## 퍼널에서 프로미스 다루기

```js
가입유형선택서브퍼널: {
    on: {
      NEXT: {
        target: '.loading',
        actions: ['setOrderTypeAndPhoneNumber'],
      },
      개통처리성공: '주민등록번호입력스텝',
    },
    initial: 'idle',
    states: {
      idle: {},
      loading: {
        invoke: {
          id: 'post개통처리시작',
          src: (context: FunnelContext, event: { phoneNumber: string; orderType: '신규가입' | '번호이동' }) =>
            post개통처리시작({
              currentPhoneNumber: event.phoneNumber,
              orderType: event.orderType,
              productId: context.productId,
            }),
          onDone: {
            target: 'success',
            actions: assign({ orderId: (_context, event: DoneInvokeEvent<{ id: number }>) => event.data.id }),
          },
        },
      },
      success: {
        entry: send('개통처리성공'),
      },
    },
  },
```

xstate는 기본적으로 fire and forget이라 이벤트를 await한다는게 컨셉상 맞지 않는다.
promise를 하려면 invoke로 하고 상태를 하나 더 만들..기?
https://github.com/statelyai/xstate/issues/437
