---
title: Node.js REPL 사용 방법
description: Node.js REPL을 사용하여 간단한 JavaScript 코드를 빠르게 테스트하고, 멀티라인 모드, 특수 변수, 점 명령어 등 기능을 탐색하는 방법을 배웁니다.
head:
  - - meta
    - name: og:title
      content: Node.js REPL 사용 방법 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js REPL을 사용하여 간단한 JavaScript 코드를 빠르게 테스트하고, 멀티라인 모드, 특수 변수, 점 명령어 등 기능을 탐색하는 방법을 배웁니다.
  - - meta
    - name: twitter:title
      content: Node.js REPL 사용 방법 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js REPL을 사용하여 간단한 JavaScript 코드를 빠르게 테스트하고, 멀티라인 모드, 특수 변수, 점 명령어 등 기능을 탐색하는 방법을 배웁니다.
---


# Node.js REPL 사용법

`node` 명령어는 Node.js 스크립트를 실행하는 데 사용됩니다.

```bash
node script.js
```

실행할 스크립트나 인수가 없이 `node` 명령어를 실행하면 REPL 세션이 시작됩니다.

```bash
node
```

::: tip 참고
REPL은 Read Evaluate Print Loop의 약자로, 사용자 입력을 단일 표현식으로 받아들여 실행 후 결과를 콘솔에 반환하는 프로그래밍 언어 환경(기본적으로 콘솔 창)입니다. REPL 세션은 간단한 JavaScript 코드를 빠르게 테스트하는 편리한 방법을 제공합니다.
:::

터미널에서 지금 시도하면 다음과 같은 결과가 나타납니다.

```bash
> node
>
```

명령어는 유휴 모드로 유지되며 우리가 무언가를 입력하기를 기다립니다.

::: tip
터미널을 여는 방법을 모르는 경우 "운영 체제에서 터미널을 여는 방법"을 검색하세요.
:::

REPL은 더 정확하게 말하면 우리가 JavaScript 코드를 입력하기를 기다리고 있습니다.

간단하게 시작하여 다음을 입력하세요.

```bash
> console.log('test')
test
undefined
>
```

첫 번째 값인 `test`는 콘솔에 출력하도록 지시한 출력이고, 그 다음에는 `console.log()` 실행의 반환 값인 `undefined`를 얻습니다. Node는 이 코드 줄을 읽고 평가하고 결과를 출력한 다음 더 많은 코드 줄을 기다리기 위해 돌아갔습니다. Node는 세션을 종료할 때까지 REPL에서 실행하는 모든 코드에 대해 이 세 단계를 반복합니다. 그것이 REPL의 이름이 붙여진 이유입니다.

Node는 코드를 출력하라는 지시 없이도 JavaScript 코드 줄의 결과를 자동으로 출력합니다. 예를 들어 다음 줄을 입력하고 Enter 키를 누르세요.

```bash
> 5==5
false
>
```

위 두 줄의 출력 차이에 주목하세요. Node REPL은 `console.log()`를 실행한 후 `undefined`를 출력했지만, 반면에 `5== '5'`의 결과만 출력했습니다. 전자는 JavaScript의 문장일 뿐이고 후자는 표현식이라는 것을 명심해야 합니다.

경우에 따라 테스트하려는 코드가 여러 줄이 필요할 수 있습니다. 예를 들어, 난수를 생성하는 함수를 정의한다고 가정해 보겠습니다. REPL 세션에서 다음 줄을 입력하고 Enter 키를 누르세요.

```javascript
function generateRandom()
...
```

Node REPL은 아직 코드 작성이 완료되지 않았음을 판단할 수 있을 만큼 똑똑하며 더 많은 코드를 입력할 수 있도록 다중 줄 모드로 전환됩니다. 이제 함수 정의를 완료하고 Enter 키를 누르세요.

```javascript
function generateRandom()
...return Math.random()
```

### 특수 변수:

코드 뒤에 `_`를 입력하면 마지막 연산의 결과가 출력됩니다.

### 위쪽 화살표 키:

위쪽 화살표 키를 누르면 현재 및 이전 REPL 세션에서 실행된 이전 코드 줄의 기록에 액세스할 수 있습니다.

## 점 명령어

REPL에는 점(`.`)으로 시작하는 몇 가지 특수 명령어가 있습니다. 그들은:
- `.help`: 점 명령어 도움말을 표시합니다.
- `.editor`: 여러 줄의 JavaScript 코드를 쉽게 작성할 수 있도록 편집기 모드를 활성화합니다. 이 모드에 들어가면 `ctrl-D`를 눌러 작성한 코드를 실행합니다.
- `.break`: 여러 줄 표현식을 입력할 때 `.break` 명령어를 입력하면 추가 입력을 중단합니다. `ctrl-C`를 누르는 것과 같습니다.
- `.clear`: REPL 컨텍스트를 빈 객체로 재설정하고 현재 입력 중인 여러 줄 표현식을 지웁니다.
- `.1oad`: 현재 작업 디렉토리를 기준으로 JavaScript 파일을 로드합니다.
- `.save`: REPL 세션에서 입력한 모든 내용을 파일에 저장합니다 (파일 이름을 지정하십시오).
- `.exit`: repl을 종료합니다 (`ctrl-C`를 두 번 누르는 것과 같습니다).

REPL은 `.editor`를 호출할 필요 없이 여러 줄 문을 입력하고 있는지 감지합니다. 예를 들어 다음과 같이 반복을 입력하기 시작하면:
```javascript
[1, 2,3].foxEach(num=>{
```
Enter 키를 누르면 REPL은 3개의 점으로 시작하는 새 줄로 이동하여 해당 블록에서 계속 작업할 수 있음을 나타냅니다.
```javascript
1... console.log (num)
2...}
```

줄 끝에 `.break`를 입력하면 여러 줄 모드가 중지되고 문이 실행되지 않습니다.

## JavaScript 파일에서 REPL 실행

`repl`을 사용하여 JavaScript 파일에서 REPL을 가져올 수 있습니다.
```javascript
const repl = require('node:repl');
```

`repl` 변수를 사용하여 다양한 작업을 수행할 수 있습니다. REPL 명령 프롬프트를 시작하려면 다음 줄을 입력하십시오.
```javascript
repl.start();
```

명령줄에서 파일을 실행합니다.
```bash
node repl.js
```

REPL이 시작될 때 표시되는 문자열을 전달할 수 있습니다. 기본값은 '>'(후행 공백 포함)이지만 사용자 정의 프롬프트를 정의할 수 있습니다.
```javascript
// Unix 스타일 프롬프트 
const local = repl.start('$ ');
```

REPL을 종료하는 동안 메시지를 표시할 수 있습니다.

```javascript
local.on('exit', () => {
  console.log('repl 종료');
  process.exit();
});
```

REPL 모듈에 대한 자세한 내용은 [repl documentation](/ko/nodejs/api/repl)에서 확인할 수 있습니다.

