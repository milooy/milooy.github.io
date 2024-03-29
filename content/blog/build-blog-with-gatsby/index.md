---
title: Gatsby로 간단하게 블로그 만들고 GitHub Pages로 배포하기(feat. GitHub Actions)
date: "2021-11-19T16:46:37.121Z"
description: "맘에 드는 템플릿이 없다면 그냥 기본으로 만들어버려"
---

## 워드프레스 멈춰

2013년도부터 Wordpress 블로그를 운영했다.
SEO도 잘 되고 유입도 많았지만... 큰 단점이 2개 있었다.

1. 코드 가독성 구림
2. 자잘 커스텀 불가

다시 블로그를 좀 써보려고 새로운 마음으로 Gatsby로 이사갔는데,
맘에 들었던 디자인인 [Prist 테마](https://github.com/margueriteroth/gatsby-prismic-starter-prist)으로 만들었더니
CMS를 Prismic이란 친구를 쓰는거였다!

Prismic은 블로그 글을 코드로 작성하는게 아니고 걔네 사이트에서 쓰고 이를 API를 통해 개츠비 블로그(든 어디든)에 뿌려줄 수 있게 하는 플랫폼인디,
데이터가 내가 눈에 볼 수 있게 GitHub에 코드로 올라가있음에 안심을 느끼는 나는 맘에 안들더라구.

넷플릭스나 구글도 쓴다는데.. 뭐 내가 non developer도 아니고 굳이 CMS를 붙일 필욘 없었다.
결정적으로 글쓸수있는 에디터도 불편했음. VSCode가 훨 나음.

그래서 Prismic 없는 순정 템플릿을 찾다가... 다 맘에 안들어서 걍 기본 블로그 템플릿 + 추후커스텀 하기로 함

## 기본 블로그 템플릿으로 슈슈슉 스캐폴딩 하기

개츠비 공식 테마인 [gatsby-starter-blog](https://www.gatsbyjs.com/starters/gatsbyjs/gatsby-starter-blog)를 사용하면 아주 무난하게 시작할 수 있다.

```sh
npx gatsby new 여러분블로그이름써조 https://github.com/gatsbyjs/gatsby-starter-blog
```

그러면 완성;
뭐라 하기도 민망하네 흐흐

## 글 쓰기

```sh
yarn start
```
로 로컬에 블로그를 띄운다. 

글은 content/blog/뭐시기/index.md

에 마크다운 포맷으로 쓰면 됩니다.

## 깃헙 저장소에 올리기

`본인깃헙닉네임.github.io`란 이름으로 깃헙 저장소를 만들면 추후 GitHub pages로 배포시 깔끔한 URL을 얻을 수 있다.
https://github.com/milooy/milooy.github.io 로 저장소를 만들면 주소는

https://milooy.github.io/가 되는거지!

(물론 `blog`등 원하는 이름으로 만들어도 무방하다. 그렇다면 https://milooy.github.io/blog 로 주소가 나오겠죠.)

```sh
git remote add origin 여러분깃헙레포주소
git push origin -u main
```

쏘 간단합니다.

## GitHub Pages에 배포하기

가장 기본적인 방법은 package.json의 scripts부분에 deploy 를 추가하고,

(gatsby-starter-blog로 스캐폴딩하신 분들은 이미 있을거예요!)

```json
{
  "scripts": {
    "deploy": "gatsby build --prefix-paths && gh-pages -d public"
  }
}
```
배포가 필요한 순간마다 내 컴퓨터에서 `yarn deploy` 명령어를 쳐서 배포하는것이다.

참고: https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/how-gatsby-works-with-github-pages/

하지만 귀찮죠? 깃헙의 기본 기능인 GitHub Action을 달아서 우리가 main브랜치에 푸시할때마다 깃헙이 서버에서 위 명령어로 배포하도록 해봅시다.

## GitHub Action으로 배포 자동화

GitHub Action은 우리가 수기로 해줘야 하는 귀찮은 일들을 깃헙에서 자동으로/주기적으로 해달라고 명령하는거예요.

예를 들어

- "풀 리퀘스트를 쓸때마다 테스트코드를 돌려줘!"
- "이슈를 생성한지 한달이 넘었는데 아무 반응이 없다면 사람들에게 알려줘!"
- "풀리퀘스트 제목이 우리가 미리 정한 포맷에 맞는지 검사해줘!"

등이 있죠.
우리가 추가할 명령은

> "main브랜치에 코드가 올라갈 때마다 `yarn deploy` 명령을 쳐서 GitHub pages에 배포해줘!"

입니다.

저는 일단 GitHub Action 마켓플레이스에서 'Gatsby'를 검색해봤어요. 물론 직접 만들어도 큰 공수는 안들거예요~
그리고 https://github.com/marketplace/actions/gatsby-publish 를 찾음.

사용하는 방법은

내 코드 루트폴더에 `.github/workflows/내가원하는이름.yml` 파일을 만들면 된다.

나는 deploy.yml 이름으로 아래와같이 만들어줬다.

```yml
name: Gatsby Publish

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: enriikke/gatsby-gh-pages-action@v2
        with:
          access-token: ${{ secrets.ACCESS_TOKEN }}
					deploy-branch: gh-pages
```

Gatsby Publish 기본 코드에서 2군데를 고쳤다.

- branches: dev -> main (혼자쓰는거니까 dev브랜치 없이 main에 바로 커밋할거라서!)
- deploy-branch: gh-pages 추가 (기본브랜치 대신 gh-pages 브랜치에 빌드파일을 올리고 싶어서)

정리해보면

> main 브랜치에 push할때마다 access-token을 이용해서 gh-pages브랜치에 gatsby-gh-pages-action을 해라

입니다.

access-token은 얘네에게 브랜치 생성 및 푸시 권한을 주기 위해 필요한데, 
GitHub에서 생성하고 저장소 settings -> secrets 에 `access-token`이란 이름으로 추가해주면 된다.

안 해보신분들은 [이 블로그](https://alstn2468.github.io/Automation/2020-01-24-GatsbyGithubAction/#token-%EC%83%9D%EC%84%B1-%EB%B0%8F-%ED%82%A4-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0) 를 참고하셔요

우리는 gh-pages 브랜치에 배포하기로 했으니
저장소 settings -> Pages 에서 브랜치명을 'gh-pages'로 바꾸면 된다.

여기서 브랜치는 실제 만들어진 브랜치만 뜨니까
한번 아무 커밋이나 main 브랜치에 푸시해보고 gh-pages가 만들어지면 바꾸면 됩니당

## 끝!

끝났습니다. 이후에 할일은

- [ ] 디자인 다듬기
- [ ] TS대응
- [ ] GA달기
- [ ] 뷰카운트 달기
- [ ] 댓글 달기

인데.. 글 10개 쓰고 해야겠다 ㅋㅋ 글이 중요하쥬

