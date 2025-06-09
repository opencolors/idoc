---
title: Node.js 문서 - 개요
description: Node.js의 개요, 비동기 이벤트 기반 아키텍처, 핵심 모듈 및 Node.js 개발을 시작하는 방법을 설명합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 개요 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 개요, 비동기 이벤트 기반 아키텍처, 핵심 모듈 및 Node.js 개발을 시작하는 방법을 설명합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 개요 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 개요, 비동기 이벤트 기반 아키텍처, 핵심 모듈 및 Node.js 개발을 시작하는 방법을 설명합니다.
---


# 사용법 및 예제 {#usage-and-example}

## 사용법 {#usage}

`node [옵션] [V8 옵션] [script.js | -e "script" | - ] [인수]`

자세한 내용은 [명령줄 옵션](/ko/nodejs/api/cli#options) 문서를 참조하세요.

## 예제 {#example}

Node.js로 작성되었으며 `'Hello, World!'`로 응답하는 [웹 서버](/ko/nodejs/api/http)의 예입니다.

이 문서의 명령은 사용자의 터미널에 나타나는 방식을 복제하기 위해 `$` 또는 `\>`로 시작합니다. `$` 및 `\>` 문자는 포함하지 마세요. 각 명령의 시작을 보여주기 위해 있습니다.

`$` 또는 `\>` 문자로 시작하지 않는 줄은 이전 명령의 출력을 보여줍니다.

먼저 Node.js를 다운로드하여 설치했는지 확인하세요. 추가 설치 정보는 [패키지 관리자를 통한 Node.js 설치](https://nodejs.org/en/download/package-manager/)를 참조하세요.

이제 `projects`라는 빈 프로젝트 폴더를 만들고 그 안으로 이동합니다.

Linux 및 Mac:

```bash [BASH]
mkdir ~/projects
cd ~/projects
```
Windows CMD:

```bash [BASH]
mkdir %USERPROFILE%\projects
cd %USERPROFILE%\projects
```
Windows PowerShell:

```bash [BASH]
mkdir $env:USERPROFILE\projects
cd $env:USERPROFILE\projects
```
다음으로 `projects` 폴더에 새 소스 파일을 만들고 `hello-world.js`라고 부릅니다.

원하는 텍스트 편집기에서 `hello-world.js`를 열고 다음 내용을 붙여넣습니다.

```js [ESM]
const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
파일을 저장합니다. 그런 다음 터미널 창에서 `hello-world.js` 파일을 실행하려면 다음을 입력합니다.

```bash [BASH]
node hello-world.js
```
다음과 같은 출력이 터미널에 나타납니다.

```bash [BASH]
Server running at http://127.0.0.1:3000/
```
이제 원하는 웹 브라우저를 열고 `http://127.0.0.1:3000`을 방문하세요.

브라우저에 문자열 `Hello, World!`가 표시되면 서버가 작동 중임을 나타냅니다.

