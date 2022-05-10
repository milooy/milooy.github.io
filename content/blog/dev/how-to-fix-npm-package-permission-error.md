---
title: 글로벌로 npm 패키지 설치지 Permission 에러 해결방법
description: sudo npm install -g <something> 을 멈추시오
date: "2022-05-09"
category: dev
---

## 글로벌로 패키지 설치하니 permission denied 에러가 나와요

살다보면 글로벌로 패키지를 설치할 일이 종종 있습니다.

> "우왕 vue cli 설치해야지~ [독스](https://cli.vuejs.org/#getting-started) 보니까 npm -g 옵션으로 설치하라네. 터미널에서 cli명령어를 돌리는거니까 global로 설치하라는게 맞지맞지~"

```sh
$ npm install -g @vue/cli
```

하지만 바로 권한 에러를 맞게 됩니다

```sh
npm ERR! code EACCES
npm ERR! syscall mkdir
npm ERR! path /usr/local/lib/node_modules/@vue
npm ERR! errno -13
npm ERR! Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/@vue'
```

`usr/local/lib/node_modules`에 설치 권한이 없다네요.
어떻게 권한을 줄 수 있을까요?

## 나쁜 해결책: 만능열쇠 sudo

가장 쉬운 해결책으로는 sudo가 있습니다.

관리자 권한을 사용해서 강제로 설치 시켜버리는거죠.

![sudo meme](https://img.devrant.com/devrant/rant/r_2221074_Z99iL.jpg)

```sh
$ sudo npm install -g @vue/cli
```

하지만 이 방법에는 몇 가지 문제점이 있습니다.

1. 보안 이슈: 나쁜 마음 먹은 패키지(혹은 그냥 잘못 짠 패키지일수도) 등을 sudo로 설치시 내 컴퓨터의 제어를 넘겨줄 수 있게 됩니다.
2. 폴더 꼬임: -g없이 `sudo npm install`시 루트유저만 접근가능한 특수한 로컬 디렉토리를 만듭니다. 나중에 일반적으로 설치한 패키지와 꼬일 수 있어요.
3. 잠정적 권한 꼬임: npm configuration 등 수정햇을 때 등 sudo없이는 일반적 패키지도 인스톨이 잘 안되는 경우를 맞을 수도 있습니다.

## 제일 깔끔한 해결책: npm을 node version manager로 재설치

맥은 n이나 nvm, 윈도우는 nodist나 nvm-windows같은 노드 버전 매니저를 통해서 설치하면 에러가 발생하지 않습니다.
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

## 괜찮은 해결책1: -g없이 npx를 통해 cli명령어 사용하기

npx를 통하면 cli명령어를 바로 사용할 수 있습니다.

즉

```sh
// 이렇게 글로벌로 설치 안 해도
$ npm install -g react-native && react-native init

// 바로 CLi 명령어를 돌릴 수 있습니다
$ npx react-native init
```

그러면 글로벌 대신 로컬 `node_modules/.bin/react-native`에 설치된 패키지를 참고합니다.

## 괜찮은 해결책2: global install 폴더를 홈 디렉토리 내부로 변경

```sh
$ mkdir ~/.npm-global

$ npm config set prefix ~/.npm-global
```

을 통해 -g를 통해 설치한 패키지의 폴더를 변경합니다.

다만 내 터미널도 이를 인식해야 하기 때문에 .zshrc나 .bash-profile에 다음을 추가합니다.

```sh
export PATH=~/.npm-global/bin:$PATH
```

https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally#manually-change-npms-default-directory

## Reference

- https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally
- https://medium.com/@ExplosionPills/dont-use-sudo-with-npm-still-66e609f5f92
