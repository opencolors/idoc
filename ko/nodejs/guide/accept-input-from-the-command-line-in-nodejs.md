---
title: Node.js 에서 사용자 입력 받기
description: readline 모듈과 Inquirer.js 패키지를 사용하여 Node.js CLI 프로그램을 인터랙티브하게 만드는 방법을 배우십시오.
head:
  - - meta
    - name: og:title
      content: Node.js 에서 사용자 입력 받기 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: readline 모듈과 Inquirer.js 패키지를 사용하여 Node.js CLI 프로그램을 인터랙티브하게 만드는 방법을 배우십시오.
  - - meta
    - name: twitter:title
      content: Node.js 에서 사용자 입력 받기 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: readline 모듈과 Inquirer.js 패키지를 사용하여 Node.js CLI 프로그램을 인터랙티브하게 만드는 방법을 배우십시오.
---


# Node.js에서 명령줄로부터 입력 받기

Node.js CLI 프로그램을 상호 작용적으로 만드는 방법은 무엇일까요?

Node.js는 7 버전부터 이 작업을 수행하기 위해 `readline` 모듈을 제공합니다. 이는 `process.stdin` 스트림과 같은 읽기 가능한 스트림으로부터 입력을 한 번에 한 줄씩 가져오는 역할을 합니다. Node.js 프로그램 실행 중에는 터미널 입력이 됩니다.

```javascript
const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("이름이 무엇인가요?", name => {
    console.log('안녕하세요 ' + name + '님!');
    rl.close();
});
```

이 코드는 사용자의 이름을 묻고, 텍스트를 입력하고 사용자가 Enter 키를 누르면 인사말을 보냅니다.

`question()` 메서드는 첫 번째 매개변수(질문)를 표시하고 사용자 입력을 기다립니다. Enter 키를 누르면 콜백 함수를 호출합니다.

이 콜백 함수에서 readline 인터페이스를 닫습니다.

`readline`은 여러 가지 다른 메서드를 제공합니다. 위에 연결된 패키지 설명서를 확인하십시오.

비밀번호를 요구해야 하는 경우 비밀번호를 다시 에코하지 않고 * 기호를 표시하는 것이 가장 좋습니다.

가장 간단한 방법은 API 측면에서 매우 유사하고 바로 사용할 수 있는 readline-sync 패키지를 사용하는 것입니다. 더 완전하고 추상적인 솔루션은 Inquirer.js 패키지에서 제공합니다.

`npm install inquirer`를 사용하여 설치한 다음 다음과 같이 위의 코드를 복제할 수 있습니다.

```javascript
const inquirer = require('inquirer');
const questions = [
    {
        type: 'input',
        name: 'name',
        message: "이름이 무엇인가요?"
    }
];
inquirer.prompt(questions).then(answers => {
    console.log('안녕하세요 ' + answers.name + '님!');
});
```

`Inquirer.js`를 사용하면 여러 선택지를 묻거나, 라디오 버튼을 사용하거나, 확인 등을 수행하는 등 다양한 작업을 수행할 수 있습니다.

특히 Node.js에서 제공하는 내장된 대안을 모두 아는 것이 중요하지만 CLI 입력을 다음 단계로 끌어올릴 계획이라면 `Inquirer.js`가 최적의 선택입니다.

