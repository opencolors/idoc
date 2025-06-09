---
title: Node.js 디버거 가이드
description: Node.js 내장 디버거 사용에 관한 포괄적인 가이드. 명령어, 사용법, 디버깅 기술을 상세히 설명합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 디버거 가이드 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 내장 디버거 사용에 관한 포괄적인 가이드. 명령어, 사용법, 디버깅 기술을 상세히 설명합니다.
  - - meta
    - name: twitter:title
      content: Node.js 디버거 가이드 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 내장 디버거 사용에 관한 포괄적인 가이드. 명령어, 사용법, 디버깅 기술을 상세히 설명합니다.
---


# 디버거 {#debugger}

::: tip [Stable: 2 - 안정됨]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

Node.js는 명령줄 디버깅 유틸리티를 포함합니다. Node.js 디버거 클라이언트는 모든 기능을 갖춘 디버거는 아니지만 간단한 단계별 실행 및 검사가 가능합니다.

이를 사용하려면 디버그할 스크립트의 경로와 함께 `inspect` 인수를 사용하여 Node.js를 시작하십시오.

```bash [BASH]
$ node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/621111f9-ffcb-4e82-b718-48a145fa5db8
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
 ok
Break on start in myscript.js:2
  1 // myscript.js
> 2 global.x = 5;
  3 setTimeout(() => {
  4   debugger;
debug>
```
디버거는 자동으로 첫 번째 실행 가능한 줄에서 중단됩니다. 대신 첫 번째 중단점( [`debugger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) 문으로 지정됨)까지 실행하려면 `NODE_INSPECT_RESUME_ON_START` 환경 변수를 `1`로 설정하십시오.

```bash [BASH]
$ cat myscript.js
// myscript.js
global.x = 5;
setTimeout(() => {
  debugger;
  console.log('world');
}, 1000);
console.log('hello');
$ NODE_INSPECT_RESUME_ON_START=1 node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/f1ed133e-7876-495b-83ae-c32c6fc319c2
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
< hello
<
break in myscript.js:4
  2 global.x = 5;
  3 setTimeout(() => {
> 4   debugger;
  5   console.log('world');
  6 }, 1000);
debug> next
break in myscript.js:5
  3 setTimeout(() => {
  4   debugger;
> 5   console.log('world');
  6 }, 1000);
  7 console.log('hello');
debug> repl
Press Ctrl+C to leave debug repl
> x
5
> 2 + 2
4
debug> next
< world
<
break in myscript.js:6
  4   debugger;
  5   console.log('world');
> 6 }, 1000);
  7 console.log('hello');
  8
debug> .exit
$
```
`repl` 명령을 사용하면 코드를 원격으로 평가할 수 있습니다. `next` 명령은 다음 줄로 단계별로 실행합니다. 사용 가능한 다른 명령을 보려면 `help`를 입력하십시오.

명령을 입력하지 않고 `enter` 키를 누르면 이전 디버거 명령이 반복됩니다.


## 워처(Watchers) {#watchers}

디버깅하는 동안 표현식과 변수 값을 감시할 수 있습니다. 각 중단점에서 워처 목록의 각 표현식은 현재 컨텍스트에서 평가되어 중단점의 소스 코드 목록 바로 앞에 표시됩니다.

표현식 감시를 시작하려면 `watch('my_expression')`을 입력하십시오. `watchers` 명령은 활성 워처를 출력합니다. 워처를 제거하려면 `unwatch('my_expression')`을 입력하십시오.

## 명령 참조 {#command-reference}

### 단계별 실행 {#stepping}

- `cont`, `c`: 실행 계속
- `next`, `n`: 다음 단계
- `step`, `s`: 코드 안으로 들어가기
- `out`, `o`: 코드 밖으로 나가기
- `pause`: 실행 중인 코드 일시 중지 (개발자 도구의 일시 중지 버튼과 유사)

### 중단점 {#breakpoints}

- `setBreakpoint()`, `sb()`: 현재 줄에 중단점 설정
- `setBreakpoint(line)`, `sb(line)`: 특정 줄에 중단점 설정
- `setBreakpoint('fn()')`, `sb(...)`: 함수의 본문에서 첫 번째 명령문에 중단점 설정
- `setBreakpoint('script.js', 1)`, `sb(...)`: `script.js`의 첫 번째 줄에 중단점 설정
- `setBreakpoint('script.js', 1, 'num \< 4')`, `sb(...)`: `num \< 4`가 `true`로 평가될 때만 중단되는 `script.js`의 첫 번째 줄에 조건부 중단점 설정
- `clearBreakpoint('script.js', 1)`, `cb(...)`: `script.js`의 1번째 줄에 있는 중단점 제거

아직 로드되지 않은 파일(모듈)에 중단점을 설정할 수도 있습니다.

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/48a5b28a-550c-471b-b5e1-d13dd7165df9
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
Break on start in main.js:1
> 1 const mod = require('./mod.js');
  2 mod.hello();
  3 mod.hello();
debug> setBreakpoint('mod.js', 22)
Warning: script 'mod.js' was not loaded yet.
debug> c
break in mod.js:22
 20 // USE OR OTHER DEALINGS IN THE SOFTWARE.
 21
>22 exports.hello = function() {
 23   return 'hello from module';
 24 };
debug>
```
주어진 표현식이 `true`로 평가될 때만 중단되는 조건부 중단점을 설정할 수도 있습니다.

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/ce24daa8-3816-44d4-b8ab-8273c8a66d35
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
Break on start in main.js:7
  5 }
  6
> 7 addOne(10);
  8 addOne(-1);
  9
debug> setBreakpoint('main.js', 4, 'num < 0')
  1 'use strict';
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
  7 addOne(10);
  8 addOne(-1);
  9
debug> cont
break in main.js:4
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
debug> exec('num')
-1
debug>
```

### 정보 {#information}

- `backtrace`, `bt`: 현재 실행 프레임의 백트레이스 출력
- `list(5)`: 스크립트 소스 코드를 앞뒤로 5줄씩 표시 (5줄 전후)
- `watch(expr)`: 감시 목록에 표현식 추가
- `unwatch(expr)`: 감시 목록에서 표현식 제거
- `unwatch(index)`: 감시 목록에서 특정 인덱스의 표현식 제거
- `watchers`: 모든 감시자와 해당 값 나열 (각 중단점에서 자동 나열)
- `repl`: 디버깅 스크립트 컨텍스트에서 평가하기 위해 디버거의 repl 열기
- `exec expr`, `p expr`: 디버깅 스크립트 컨텍스트에서 표현식을 실행하고 해당 값 출력
- `profile`: CPU 프로파일링 세션 시작
- `profileEnd`: 현재 CPU 프로파일링 세션 중지
- `profiles`: 완료된 모든 CPU 프로파일링 세션 나열
- `profiles[n].save(filepath = 'node.cpuprofile')`: CPU 프로파일링 세션을 JSON으로 디스크에 저장
- `takeHeapSnapshot(filepath = 'node.heapsnapshot')`: 힙 스냅샷을 찍어 JSON으로 디스크에 저장

### 실행 제어 {#execution-control}

- `run`: 스크립트 실행 (디버거 시작 시 자동 실행)
- `restart`: 스크립트 재시작
- `kill`: 스크립트 종료

### 기타 {#various}

- `scripts`: 로드된 모든 스크립트 나열
- `version`: V8 버전 표시

## 고급 사용법 {#advanced-usage}

### Node.js용 V8 Inspector 통합 {#v8-inspector-integration-for-nodejs}

V8 Inspector 통합을 통해 디버깅 및 프로파일링을 위해 Chrome DevTools를 Node.js 인스턴스에 연결할 수 있습니다. 이는 [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)을 사용합니다.

V8 Inspector는 Node.js 애플리케이션을 시작할 때 `--inspect` 플래그를 전달하여 활성화할 수 있습니다. 해당 플래그로 사용자 지정 포트를 제공할 수도 있습니다. 예를 들어 `--inspect=9222`는 포트 9222에서 DevTools 연결을 허용합니다.

`--inspect` 플래그를 사용하면 디버거가 연결되기 직전에 코드가 실행됩니다. 즉, 디버깅을 시작하기 전에 코드가 실행되기 시작합니다. 처음부터 디버깅하려는 경우 이상적이지 않을 수 있습니다.

이러한 경우 두 가지 대안이 있습니다.

따라서 `--inspect`, `--inspect-wait` 및 `--inspect-brk` 중에서 결정할 때 코드를 즉시 실행할지, 실행 전에 디버거 연결을 기다릴지, 아니면 단계별 디버깅을 위해 첫 번째 줄에서 중단할지 고려하십시오.

```bash [BASH]
$ node --inspect index.js
Debugger listening on ws://127.0.0.1:9229/dc9010dd-f8b8-4ac5-a510-c1a114ec7d29
For help, see: https://nodejs.org/en/docs/inspector
```
(위 예에서 URL 끝에 있는 UUID dc9010dd-f8b8-4ac5-a510-c1a114ec7d29는 즉석에서 생성되며, 디버깅 세션마다 다릅니다.)

Chrome 브라우저가 66.0.3345.0보다 오래된 경우 위의 URL에서 `js_app.html` 대신 `inspector.html`을 사용하십시오.

Chrome DevTools는 아직 [worker threads](/ko/nodejs/api/worker_threads) 디버깅을 지원하지 않습니다. [ndb](https://github.com/GoogleChromeLabs/ndb/)를 사용하여 디버깅할 수 있습니다.

