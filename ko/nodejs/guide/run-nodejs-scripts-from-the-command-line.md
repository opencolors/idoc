---
title: 명령줄에서 Node.js 스크립트 실행
description: 명령줄에서 Node.js 프로그램을 실행하는 방법을 알아보세요. node 명령어 사용법, shebang 행, 실행 권한, 문자열을 인수로 전달하는 방법, 자동으로 애플리케이션을 재시작하는 방법 등이 포함됩니다.
head:
  - - meta
    - name: og:title
      content: 명령줄에서 Node.js 스크립트 실행 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 명령줄에서 Node.js 프로그램을 실행하는 방법을 알아보세요. node 명령어 사용법, shebang 행, 실행 권한, 문자열을 인수로 전달하는 방법, 자동으로 애플리케이션을 재시작하는 방법 등이 포함됩니다.
  - - meta
    - name: twitter:title
      content: 명령줄에서 Node.js 스크립트 실행 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 명령줄에서 Node.js 프로그램을 실행하는 방법을 알아보세요. node 명령어 사용법, shebang 행, 실행 권한, 문자열을 인수로 전달하는 방법, 자동으로 애플리케이션을 재시작하는 방법 등이 포함됩니다.
---


# 명령줄에서 Node.js 스크립트 실행하기

일반적으로 Node.js 프로그램을 실행하는 방법은 (Node.js를 설치한 후) 전역적으로 사용 가능한 `node` 명령어를 실행하고 실행하려는 파일의 이름을 전달하는 것입니다.

주 Node.js 애플리케이션 파일이 `app.js`인 경우 다음과 같이 입력하여 호출할 수 있습니다.

```bash
node app.js
```

위에서 셸에 `node`를 사용하여 스크립트를 실행하도록 명시적으로 지시하고 있습니다. "Shebang" 라인을 사용하여 이 정보를 JavaScript 파일에 포함할 수도 있습니다. "Shebang"은 파일의 첫 번째 줄이며, OS에 스크립트를 실행하는 데 사용할 인터프리터를 알려줍니다. 다음은 JavaScript의 첫 번째 줄입니다.

```javascript
#!/usr/bin/node
```

위에서 인터프리터의 절대 경로를 명시적으로 제공하고 있습니다. 모든 운영체제가 `bin` 폴더에 `node`를 가지고 있는 것은 아니지만, 모든 운영체제가 `env`를 가지고 있어야 합니다. OS에 `node`를 매개변수로 사용하여 `env`를 실행하도록 지시할 수 있습니다.

```javascript
#!/usr/bin/env node
// your javascript code
```

## Shebang을 사용하려면 파일에 실행 권한이 있어야 합니다.

다음 명령을 실행하여 `app.js`에 실행 권한을 부여할 수 있습니다.

```bash
chmod u+x app.js
```

명령을 실행하는 동안 `app.js` 파일이 포함된 동일한 디렉토리에 있는지 확인하십시오.

## 파일 경로 대신 문자열을 노드에 인수로 전달하기

문자열을 인수로 실행하려면 `-e`, `--eval "script"`를 사용할 수 있습니다. 다음 인수를 JavaScript로 평가합니다. REPL에서 미리 정의된 모듈도 스크립트에서 사용할 수 있습니다. Windows에서 `cmd.exe`를 사용하는 경우 작은따옴표는 따옴표로 묶는 데 큰따옴표 `"`만 인식하므로 제대로 작동하지 않습니다. Powershell 또는 Git bash에서는 `"`와 `''`를 모두 사용할 수 있습니다.

```bash
node -e "console.log(123)"
```

## 애플리케이션을 자동으로 다시 시작하기

nodejs V 16부터 파일이 변경될 때 애플리케이션을 자동으로 다시 시작하는 기본 제공 옵션이 있습니다. 이는 개발 목적으로 유용합니다. 이 기능을 사용하려면 `watch` 플래그를 nodejs에 전달해야 합니다.

```bash
node --watch app.js
```

따라서 파일을 변경하면 애플리케이션이 자동으로 다시 시작됩니다. --watch [플래그 설명서](/ko/nodejs/api/cli#watch)를 읽으십시오.

