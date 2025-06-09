---
title: Node.js 를 사용한 명령줄 출력
description: Node.js 는 콘솔 모듈을 제공하며, 로깅, 카운팅, 타이밍 등과 같은 명령줄과 상호 작용하는 다양한 메소드가 있습니다.
head:
  - - meta
    - name: og:title
      content: Node.js 를 사용한 명령줄 출력 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 는 콘솔 모듈을 제공하며, 로깅, 카운팅, 타이밍 등과 같은 명령줄과 상호 작용하는 다양한 메소드가 있습니다.
  - - meta
    - name: twitter:title
      content: Node.js 를 사용한 명령줄 출력 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 는 콘솔 모듈을 제공하며, 로깅, 카운팅, 타이밍 등과 같은 명령줄과 상호 작용하는 다양한 메소드가 있습니다.
---


# Node.js를 사용하여 명령줄에 출력하기

콘솔 모듈을 사용한 기본 출력
Node.js는 명령줄과 상호 작용하는 데 매우 유용한 방법을 많이 제공하는 콘솔 모듈을 제공합니다. 기본적으로 브라우저에서 찾을 수 있는 콘솔 객체와 동일합니다.

가장 기본적이고 가장 많이 사용되는 메서드는 `console.log()`이며, 이 메서드는 전달된 문자열을 콘솔에 출력합니다. 객체를 전달하면 문자열로 렌더링됩니다.

예를 들어 다음과 같이 여러 변수를 `console.log`에 전달할 수 있습니다.
```javascript
const x = 'x';
const y = 'y';
console.log(x, y);
```

변수와 형식 지정자를 전달하여 멋진 문구를 형식화할 수도 있습니다. 예를 들어 다음과 같습니다.
```javascript
console.log('내 %s에는 %d개의 귀가 있습니다.', '고양이', 2);
```

- %s 변수를 문자열로 형식화 - %d 변수를 숫자로 형식화 - %i 변수를 정수 부분만 형식화 - %o 변수를 객체로 형식화
예:
```javascript
console.log('%o', Number);
```
## 콘솔 지우기

`console.clear()`는 콘솔을 지웁니다 (동작은 사용된 콘솔에 따라 다를 수 있음).

## 요소 개수 세기

`console.count()`는 편리한 메서드입니다.
다음 코드를 사용하세요.
```javascript
const x = 1;
const y = 2;
const z = 3;
console.count('x의 값은 '+x+'이고 확인되었습니다..몇 번이나 확인되었습니까?');
console.count('x의 값은'+x+'이고 확인되었습니다..몇 번이나 확인되었습니까?');
console.count('y의 값은'+y+'이고 확인되었습니다..몇 번이나 확인되었습니까?');
```

여기서 일어나는 일은 `console.count()`가 문자열이 인쇄된 횟수를 세고 그 옆에 횟수를 인쇄한다는 것입니다.

사과와 오렌지만 셀 수 있습니다.

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
```

## 개수 재설정

`console.countReset()` 메서드는 `console.count()`에 사용된 카운터를 재설정합니다.

이를 설명하기 위해 사과와 오렌지 예제를 사용합니다.

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
console.countReset('orange');
oranges.forEach(fruit => console.count(fruit));
```


## 스택 트레이스 출력하기

함수의 호출 스택 트레이스를 출력하는 것이 유용할 수 있습니다. 예를 들어, 코드의 해당 부분에 어떻게 도달했는지에 대한 질문에 답하기 위해서입니다.

`console.trace()`를 사용하여 이를 수행할 수 있습니다.

```javascript
const function2 = () => console.trace();
const function1 = () => function2();
function1();
```

이렇게 하면 스택 트레이스가 출력됩니다. Node.js REPL에서 시도하면 다음과 같이 출력됩니다.

```bash
Trace
at function2 (repl:1:33)
at function1 (rep1:1:25)
at rep1:1:1
at ContextifyScript.Script.xunInThisContext (vm.js:44:33)
at REPLServer.defaultEval(repl.js:239:29)
at bound (domain.js:301:14)
at REPLServer.xunBound [as eval](domain.js:314:12)
at REPLServer.onLine (repl.js:440:10)
at emitone (events.js:120:20)
at REPLServer.emit (events.js:210:7)
```

## 소요 시간 계산하기

`time()` 및 `timeEnd()`를 사용하여 함수를 실행하는 데 걸리는 시간을 쉽게 계산할 수 있습니다.

```javascript
const doSomething = () => console.log('test');
const measureDoingSomething = () => {
    console.time('doSomething()');
    // 무언가를 수행하고 소요 시간을 측정합니다.
    doSomething();
    console.timeEnd('doSomething()');
};
measureDoingSomething();
```

### stdout 및 stderr

우리가 본 것처럼 `console.log`는 콘솔에 메시지를 출력하는 데 좋습니다. 이것을 표준 출력 또는 stdout이라고 합니다.

`console.error`는 stderr 스트림에 출력합니다.

콘솔에는 나타나지 않지만 오류 로그에 나타납니다.

## 출력 색상 지정하기

이스케이프 시퀀스를 사용하여 콘솔에서 텍스트의 출력을 색상화할 수 있습니다. 이스케이프 시퀀스는 색상을 식별하는 문자 집합입니다.

예:

```javascript
console.log('x1b[33ms/x1b[0m', 'hi!');
```

Node.js REPL에서 시도해 볼 수 있으며 hi!가 노란색으로 출력됩니다.

그러나 이것은 하위 수준의 방법입니다. 콘솔 출력을 색상화하는 가장 간단한 방법은 라이브러리를 사용하는 것입니다. Chalk는 그러한 라이브러리이며, 색상 지정 외에도 텍스트를 굵게, 기울임꼴 또는 밑줄로 만드는 것과 같은 다른 스타일 지정 기능을 제공합니다.

`npm install chalk`로 설치한 다음 사용할 수 있습니다.

```javascript
const chalk = require('chalk');
console.log(chalk.yellow('hi!'));
```

`chalk.yellow`를 사용하는 것이 이스케이프 코드를 기억하려고 노력하는 것보다 훨씬 편리하며 코드가 훨씬 읽기 쉽습니다.

더 많은 사용 예는 위에 게시된 프로젝트 링크를 확인하십시오.


## 진행률 표시줄 만들기

`progress`는 콘솔에 진행률 표시줄을 만드는 데 유용한 멋진 패키지입니다. `npm install progress`를 사용하여 설치하십시오.

이 스니펫은 10단계 진행률 표시줄을 만들고 매 100ms마다 한 단계씩 완료됩니다. 막대가 완료되면 간격을 지웁니다.

```javascript
const ProgressBar = require('progress');
const bar = new ProgressBar(':bar', { total: 10 });
const timer = setInterval(() => {
    bar.tick();
    if (bar.complete) {
        clearInterval(timer);
    }
}, 100);
```

