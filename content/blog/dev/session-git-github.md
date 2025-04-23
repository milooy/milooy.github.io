---
marp: true
---

# Git & GitHub

---

# 사전 조사

1. Git 을 사용해서 2명 이상의 개발자와 협업해봤다(하트) vs 아직 경험이 없거나, 혼자만 써봤다 (따봉)
2. Stage 가 어떤 개념인지 안다 (하트) vs 아직 모른다 (따봉)
3. Interactive Rebase 를 사용해봤다 (하트) vs 아직 모른다 (따봉)

---

# 오늘 배울 내용

- Git의 기본 개념 (10m)
- Git의 내부 원리 (5m)
- 실무에서 IDE와 함께 편하게 Git 쓰는 꿀팁 (10m)
- 커밋 메세지를 정리해서 Code review를 원활하게 하는 법 (10m)

---

# 실무에서 IDE와 함께 편하게 Git 쓰는 꿀팁

---

## Ai활용

- Cursor Ai 버튼를 통해 commit message generate
- Cursor agent를 통해 PR 바디 생성 + main과 diff를 떠 코드리뷰
- cmd + k 로 cli 명령어 생성

---

## 단축키 할당

- Push: ctrl + opt + cmd + ↑
- PR생성(gitlens 플러그인): ctrl + opt + cmd + ↑
- 브랜치 전환: ctrl + opt + cmd + →
- Pull: ctrl + opt + cmd + ↓

---

## 유용한 플러그인

- GitLens
  - 코드별 최종 수정자 (Git blame 자동 + PR 바로가기)
- Git Graph
  - (제 기준)Git log가 가장 편하게 보임

---

# 커밋 메세지를 정리해서 Code review를 원활하게 하는 법

---

## Interactive rebase

사용예시

- 커밋 메세지 수정
- 커밋 순서 수정
- 커밋 합치기

---

### 수정할 커밋의 직전 커밋 찍고 interactive rebase 꼬!

- pick: 수정 없이 사용하겠다
- reword: 커밋 메세지 수정
- squash: 커밋 합치기
- edit: 커밋 수정

vi

- dd: 줄 자르기
- p: 줄 붙이기
- i: 수정 모드
- esc: 수정 모드 종료
- wq: 저장 후 종료

---

## 보너스: cli 명령어 ai로 생성하기

- 브랜치 삭제 명령어 만들어서 테스트 브랜치 삭제
