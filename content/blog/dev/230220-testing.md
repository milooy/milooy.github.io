---
title: JS 테스팅
description: 테스팅 안하면 생산성 마이너스라 더 이상 미룰 수 없다
date: "2023-02-20"
category: dev
---

## 뭘 테스트해야할지 알기
https://kentcdodds.com/blog/how-to-know-what-to-test

1. Knowing HOW to test만큼 knowing WHAT to test도 중요함
2. "TC는 테스트할 때 코드보다 유즈케이스를 더 생각하도록 만든다"
   - 테스트가 실제 유즈케이스랑 닮을수록 컨피던스 레벨 높아짐
3. 코드 커버리지보다 유즈케이스 커버리지가 높아야함
  - 코드 커버리지 100이라도 유즈케이스 커버리지는 낮을 수 있음 (동일한 코드라인도 다른 유즈케이스로 run될 수 있으니)

## 그 다음 읽을 아티클들
- https://kentcdodds.com/blog/testing-implementation-details