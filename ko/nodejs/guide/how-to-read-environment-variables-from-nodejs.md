---
title: Node.js에서 환경 변수 읽기
description: process.env 속성과 .env 파일을 사용하여 Node.js에서 환경 변수에 액세스하는 방법을 알아보세요.
head:
  - - meta
    - name: og:title
      content: Node.js에서 환경 변수 읽기 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: process.env 속성과 .env 파일을 사용하여 Node.js에서 환경 변수에 액세스하는 방법을 알아보세요.
  - - meta
    - name: twitter:title
      content: Node.js에서 환경 변수 읽기 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: process.env 속성과 .env 파일을 사용하여 Node.js에서 환경 변수에 액세스하는 방법을 알아보세요.
---


# Node.js에서 환경 변수를 읽는 방법

Node.js의 process 코어 모듈은 프로세스가 시작될 때 설정된 모든 환경 변수를 호스팅하는 `env` 속성을 제공합니다.

아래 코드는 `app.js`를 실행하고 `USER_ID`와 `USER_KEY`를 설정합니다.

```bash
USER_ID=239482 USER_KEY=foobar node app.js
```

이렇게 하면 사용자 `USER_ID`는 239482로, `USER_KEY`는 foobar로 전달됩니다. 이는 테스트에 적합하지만, 프로덕션 환경에서는 변수를 내보내는 몇 가지 bash 스크립트를 구성해야 할 것입니다.

::: tip NOTE
`process`는 `"require"`가 필요하지 않으며, 자동으로 사용할 수 있습니다.
:::

다음은 위 코드에서 설정한 `USER_ID` 및 `USER_KEY` 환경 변수에 액세스하는 예입니다.

```javascript
process.env.USER_ID; // "239482
process.env.USER_KEY; // "foobar
```

같은 방식으로 설정한 모든 사용자 지정 환경 변수에 액세스할 수 있습니다. Node.js 20에서는 실험적인 [.env 파일 지원](/ko/nodejs/api/cli#env-file-config)이 도입되었습니다.

이제 `--env-file` 플래그를 사용하여 Node.js 애플리케이션을 실행할 때 환경 파일을 지정할 수 있습니다. 다음은 `.env` 파일의 예와 `process.env`를 사용하여 해당 변수에 액세스하는 방법입니다.

```bash
.env file
PORT=3000
```

js 파일에서

```javascript
process.env.PORT; // 3000
```

`.env` 파일에 설정된 환경 변수를 사용하여 `app.js` 파일을 실행합니다.

```js
node --env-file=.env app.js
```

이 명령은 `.env` 파일에서 모든 환경 변수를 로드하여 `process.env`에서 애플리케이션에서 사용할 수 있도록 합니다. 또한 여러 개의 --env-file 인수를 전달할 수 있습니다. 후속 파일은 이전 파일에 정의된 기존 변수를 재정의합니다.

```bash
node --env-file=.env --env-file=.development.env app.js
```
::: tip NOTE
동일한 변수가 환경과 파일 모두에 정의된 경우 환경의 값이 우선합니다.
:::

