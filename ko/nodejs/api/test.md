---
title: Node.js 테스트 러너
description: Node.js 테스트 러너 모듈은 Node.js 애플리케이션 내에서 테스트를 작성하고 실행하기 위한 내장 솔루션을 제공합니다. 다양한 테스트 형식, 커버리지 보고서를 지원하며 인기 있는 테스트 프레임워크와 통합됩니다.
head:
  - - meta
    - name: og:title
      content: Node.js 테스트 러너 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 테스트 러너 모듈은 Node.js 애플리케이션 내에서 테스트를 작성하고 실행하기 위한 내장 솔루션을 제공합니다. 다양한 테스트 형식, 커버리지 보고서를 지원하며 인기 있는 테스트 프레임워크와 통합됩니다.
  - - meta
    - name: twitter:title
      content: Node.js 테스트 러너 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 테스트 러너 모듈은 Node.js 애플리케이션 내에서 테스트를 작성하고 실행하기 위한 내장 솔루션을 제공합니다. 다양한 테스트 형식, 커버리지 보고서를 지원하며 인기 있는 테스트 프레임워크와 통합됩니다.
---


# 테스트 러너 {#test-runner}

::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0 | 테스트 러너가 이제 안정화되었습니다. |
| v18.0.0, v16.17.0 | 추가됨: v18.0.0, v16.17.0 |
:::

::: tip [Stable: 2 - 안정적]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [Stability: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/test.js](https://github.com/nodejs/node/blob/v23.5.0/lib/test.js)

`node:test` 모듈은 JavaScript 테스트 생성을 용이하게 합니다. 액세스하려면:

::: code-group
```js [ESM]
import test from 'node:test';
```

```js [CJS]
const test = require('node:test');
```
:::

이 모듈은 `node:` 스킴에서만 사용할 수 있습니다.

`test` 모듈을 통해 생성된 테스트는 다음 세 가지 방법 중 하나로 처리되는 단일 함수로 구성됩니다.

다음 예제는 `test` 모듈을 사용하여 테스트를 작성하는 방법을 보여줍니다.

```js [ESM]
test('동기 통과 테스트', (t) => {
  // 이 테스트는 예외를 던지지 않기 때문에 통과합니다.
  assert.strictEqual(1, 1);
});

test('동기 실패 테스트', (t) => {
  // 이 테스트는 예외를 던지기 때문에 실패합니다.
  assert.strictEqual(1, 2);
});

test('비동기 통과 테스트', async (t) => {
  // 이 테스트는 async 함수에서 반환된 Promise가
  // 해결되고 거부되지 않았기 때문에 통과합니다.
  assert.strictEqual(1, 1);
});

test('비동기 실패 테스트', async (t) => {
  // 이 테스트는 async 함수에서 반환된 Promise가
  // 거부되었기 때문에 실패합니다.
  assert.strictEqual(1, 2);
});

test('Promises를 사용한 실패 테스트', (t) => {
  // Promises는 직접 사용할 수도 있습니다.
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      reject(new Error('이것은 테스트를 실패하게 만듭니다'));
    });
  });
});

test('콜백 통과 테스트', (t, done) => {
  // done()은 콜백 함수입니다. setImmediate()가 실행되면
  // 인수를 사용하지 않고 done()을 호출합니다.
  setImmediate(done);
});

test('콜백 실패 테스트', (t, done) => {
  // setImmediate()가 실행되면 done()은 Error 객체와 함께 호출되고
  // 테스트가 실패합니다.
  setImmediate(() => {
    done(new Error('콜백 실패'));
  });
});
```
테스트가 실패하면 프로세스 종료 코드가 `1`로 설정됩니다.


## 하위 테스트 {#subtests}

테스트 컨텍스트의 `test()` 메서드를 사용하여 하위 테스트를 만들 수 있습니다. 이를 통해 더 큰 테스트 내에서 중첩된 테스트를 만들 수 있는 계층적 방식으로 테스트를 구성할 수 있습니다. 이 메서드는 최상위 `test()` 함수와 동일하게 작동합니다. 다음 예제에서는 두 개의 하위 테스트가 있는 최상위 테스트를 만드는 방법을 보여줍니다.

```js [ESM]
test('최상위 테스트', async (t) => {
  await t.test('하위 테스트 1', (t) => {
    assert.strictEqual(1, 1);
  });

  await t.test('하위 테스트 2', (t) => {
    assert.strictEqual(2, 2);
  });
});
```
이 예제에서는 `await`를 사용하여 두 하위 테스트가 모두 완료되었는지 확인합니다. 이는 스위트 내에서 생성된 테스트와 달리 테스트가 하위 테스트의 완료를 기다리지 않기 때문에 필요합니다. 상위 항목이 완료될 때까지 미결 상태인 하위 테스트는 취소되어 실패로 처리됩니다. 하위 테스트 실패는 상위 테스트를 실패하게 만듭니다.

## 테스트 건너뛰기 {#skipping-tests}

다음 예제와 같이 테스트에 `skip` 옵션을 전달하거나 테스트 컨텍스트의 `skip()` 메서드를 호출하여 개별 테스트를 건너뛸 수 있습니다.

```js [ESM]
// skip 옵션이 사용되지만 메시지는 제공되지 않습니다.
test('skip 옵션', { skip: true }, (t) => {
  // 이 코드는 실행되지 않습니다.
});

// skip 옵션이 사용되고 메시지가 제공됩니다.
test('메시지와 함께 skip 옵션', { skip: '건너뜁니다.' }, (t) => {
  // 이 코드는 실행되지 않습니다.
});

test('skip() 메서드', (t) => {
  // 테스트에 추가 로직이 포함된 경우 여기에서 반환해야 합니다.
  t.skip();
});

test('메시지와 함께 skip() 메서드', (t) => {
  // 테스트에 추가 로직이 포함된 경우 여기에서 반환해야 합니다.
  t.skip('건너뜁니다.');
});
```
## TODO 테스트 {#todo-tests}

다음 예제와 같이 테스트에 `todo` 옵션을 전달하거나 테스트 컨텍스트의 `todo()` 메서드를 호출하여 개별 테스트를 불안정하거나 불완전한 것으로 표시할 수 있습니다. 이러한 테스트는 수정해야 할 보류 중인 구현 또는 버그를 나타냅니다. TODO 테스트는 실행되지만 테스트 실패로 처리되지 않으므로 프로세스 종료 코드에 영향을 미치지 않습니다. 테스트가 TODO 및 건너뛰기로 모두 표시된 경우 TODO 옵션은 무시됩니다.

```js [ESM]
// todo 옵션이 사용되지만 메시지는 제공되지 않습니다.
test('todo 옵션', { todo: true }, (t) => {
  // 이 코드는 실행되지만 실패로 처리되지는 않습니다.
  throw new Error('테스트를 실패하지 않습니다.');
});

// todo 옵션이 사용되고 메시지가 제공됩니다.
test('메시지와 함께 todo 옵션', { todo: 'todo 테스트입니다.' }, (t) => {
  // 이 코드가 실행됩니다.
});

test('todo() 메서드', (t) => {
  t.todo();
});

test('메시지와 함께 todo() 메서드', (t) => {
  t.todo('todo 테스트이며 실패로 처리되지 않습니다.');
  throw new Error('테스트를 실패하지 않습니다.');
});
```

## `describe()` 및 `it()` 별칭 {#describe-and-it-aliases}

스위트 및 테스트는 `describe()` 및 `it()` 함수를 사용하여 작성할 수도 있습니다. [`describe()`](/ko/nodejs/api/test#describename-options-fn)는 [`suite()`](/ko/nodejs/api/test#suitename-options-fn)의 별칭이고, [`it()`](/ko/nodejs/api/test#itname-options-fn)는 [`test()`](/ko/nodejs/api/test#testname-options-fn)의 별칭입니다.

```js [ESM]
describe('A thing', () => {
  it('should work', () => {
    assert.strictEqual(1, 1);
  });

  it('should be ok', () => {
    assert.strictEqual(2, 2);
  });

  describe('a nested thing', () => {
    it('should work', () => {
      assert.strictEqual(3, 3);
    });
  });
});
```
`describe()` 및 `it()`는 `node:test` 모듈에서 가져옵니다.

::: code-group
```js [ESM]
import { describe, it } from 'node:test';
```

```js [CJS]
const { describe, it } = require('node:test');
```
:::

## `only` 테스트 {#only-tests}

Node.js가 [`--test-only`](/ko/nodejs/api/cli#--test-only) 명령줄 옵션으로 시작되거나 테스트 격리가 비활성화된 경우, 실행해야 하는 테스트에 `only` 옵션을 전달하여 선택한 하위 집합을 제외한 모든 테스트를 건너뛸 수 있습니다. `only` 옵션이 설정된 테스트가 있으면 모든 하위 테스트도 실행됩니다. 스위트에 `only` 옵션이 설정된 경우, 스위트 내의 모든 테스트가 실행됩니다. 단, `only` 옵션이 설정된 하위 항목이 있는 경우에는 해당 테스트만 실행됩니다.

`test()`/`it()` 내에서 [하위 테스트](/ko/nodejs/api/test#subtests)를 사용하는 경우, 선택한 테스트 하위 집합만 실행하려면 모든 상위 테스트를 `only` 옵션으로 표시해야 합니다.

테스트 컨텍스트의 `runOnly()` 메서드를 사용하여 하위 테스트 수준에서 동일한 동작을 구현할 수 있습니다. 실행되지 않은 테스트는 테스트 러너 출력에서 생략됩니다.

```js [ESM]
// Node.js가 --test-only 명령줄 옵션으로 실행된다고 가정합니다.
// 스위트의 'only' 옵션이 설정되어 있으므로 이러한 테스트가 실행됩니다.
test('this test is run', { only: true }, async (t) => {
  // 이 테스트 내에서 모든 하위 테스트는 기본적으로 실행됩니다.
  await t.test('running subtest');

  // 'only' 옵션으로 하위 테스트를 실행하도록 테스트 컨텍스트를 업데이트할 수 있습니다.
  t.runOnly(true);
  await t.test('this subtest is now skipped');
  await t.test('this subtest is run', { only: true });

  // 컨텍스트를 다시 전환하여 모든 테스트를 실행합니다.
  t.runOnly(false);
  await t.test('this subtest is now run');

  // 이러한 테스트를 명시적으로 실행하지 마십시오.
  await t.test('skipped subtest 3', { only: false });
  await t.test('skipped subtest 4', { skip: true });
});

// 'only' 옵션이 설정되어 있지 않으므로 이 테스트는 건너뜁니다.
test('this test is not run', () => {
  // 이 코드는 실행되지 않습니다.
  throw new Error('fail');
});

describe('a suite', () => {
  // 'only' 옵션이 설정되어 있으므로 이 테스트가 실행됩니다.
  it('this test is run', { only: true }, () => {
    // 이 코드는 실행됩니다.
  });

  it('this test is not run', () => {
    // 이 코드는 실행되지 않습니다.
    throw new Error('fail');
  });
});

describe.only('a suite', () => {
  // 'only' 옵션이 설정되어 있으므로 이 테스트가 실행됩니다.
  it('this test is run', () => {
    // 이 코드는 실행됩니다.
  });

  it('this test is run', () => {
    // 이 코드는 실행됩니다.
  });
});
```

## 이름으로 테스트 필터링 {#filtering-tests-by-name}

[`--test-name-pattern`](/ko/nodejs/api/cli#--test-name-pattern) 명령줄 옵션을 사용하면 제공된 패턴과 일치하는 이름의 테스트만 실행할 수 있으며, [`--test-skip-pattern`](/ko/nodejs/api/cli#--test-skip-pattern) 옵션을 사용하면 제공된 패턴과 일치하는 이름의 테스트를 건너뛸 수 있습니다. 테스트 이름 패턴은 JavaScript 정규식으로 해석됩니다. `--test-name-pattern` 및 `--test-skip-pattern` 옵션은 중첩된 테스트를 실행하기 위해 여러 번 지정할 수 있습니다. 실행되는 각 테스트에 대해 `beforeEach()`와 같은 해당 테스트 후크도 실행됩니다. 실행되지 않은 테스트는 테스트 러너 출력에서 생략됩니다.

다음 테스트 파일이 주어지면 `--test-name-pattern="test [1-3]"` 옵션으로 Node.js를 시작하면 테스트 러너가 `test 1`, `test 2` 및 `test 3`을 실행합니다. `test 1`이 테스트 이름 패턴과 일치하지 않으면 패턴과 일치하더라도 해당 하위 테스트는 실행되지 않습니다. `--test-name-pattern`을 여러 번 전달하여 동일한 테스트 세트를 실행할 수도 있습니다(예: `--test-name-pattern="test 1"`, `--test-name-pattern="test 2"` 등).

```js [ESM]
test('test 1', async (t) => {
  await t.test('test 2');
  await t.test('test 3');
});

test('Test 4', async (t) => {
  await t.test('Test 5');
  await t.test('test 6');
});
```
테스트 이름 패턴은 정규식 리터럴을 사용하여 지정할 수도 있습니다. 이를 통해 정규식 플래그를 사용할 수 있습니다. 이전 예제에서 `--test-name-pattern="/test [4-5]/i"`(또는 `--test-skip-pattern="/test [4-5]/i"`)로 Node.js를 시작하면 패턴이 대소문자를 구분하지 않으므로 `Test 4` 및 `Test 5`가 일치합니다.

패턴으로 단일 테스트를 일치시키려면 고유성을 보장하기 위해 공백으로 구분된 모든 상위 테스트 이름을 접두사로 지정할 수 있습니다. 예를 들어 다음 테스트 파일이 주어지면:

```js [ESM]
describe('test 1', (t) => {
  it('some test');
});

describe('test 2', (t) => {
  it('some test');
});
```
`--test-name-pattern="test 1 some test"`로 Node.js를 시작하면 `test 1`에서 `some test`만 일치합니다.

테스트 이름 패턴은 테스트 러너가 실행하는 파일 집합을 변경하지 않습니다.

`--test-name-pattern`과 `--test-skip-pattern`이 모두 제공되면 테스트를 실행하려면 **두** 요구 사항을 모두 충족해야 합니다.


## 불필요한 비동기 활동 {#extraneous-asynchronous-activity}

테스트 함수 실행이 완료되면 테스트 순서를 유지하면서 가능한 한 빨리 결과를 보고합니다. 그러나 테스트 함수가 테스트 자체보다 오래 지속되는 비동기 활동을 생성할 수 있습니다. 테스트 러너는 이러한 유형의 활동을 처리하지만 이를 수용하기 위해 테스트 결과 보고를 지연시키지 않습니다.

다음 예에서 테스트는 여전히 미해결 상태인 두 개의 `setImmediate()` 작업으로 완료됩니다. 첫 번째 `setImmediate()`는 새 하위 테스트를 만들려고 시도합니다. 상위 테스트가 이미 완료되고 결과를 출력했기 때문에 새 하위 테스트는 즉시 실패한 것으로 표시되고 나중에 [\<TestsStream\>](/ko/nodejs/api/test#class-testsstream)에 보고됩니다.

두 번째 `setImmediate()`는 `uncaughtException` 이벤트를 만듭니다. 완료된 테스트에서 발생하는 `uncaughtException` 및 `unhandledRejection` 이벤트는 `test` 모듈에 의해 실패한 것으로 표시되고 [\<TestsStream\>](/ko/nodejs/api/test#class-testsstream)에 의해 최상위 수준에서 진단 경고로 보고됩니다.

```js [ESM]
test('비동기 활동을 생성하는 테스트', (t) => {
  setImmediate(() => {
    t.test('너무 늦게 생성된 하위 테스트', (t) => {
      throw new Error('error1');
    });
  });

  setImmediate(() => {
    throw new Error('error2');
  });

  // 이 줄 뒤에 테스트가 완료됩니다.
});
```
## 감시 모드 {#watch-mode}

**추가됨: v19.2.0, v18.13.0**

::: warning [안정적: 1 - 실험적]
[안정적: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

Node.js 테스트 러너는 `--watch` 플래그를 전달하여 감시 모드에서 실행하는 것을 지원합니다.

```bash [BASH]
node --test --watch
```
감시 모드에서 테스트 러너는 테스트 파일과 해당 종속성의 변경 사항을 감시합니다. 변경 사항이 감지되면 테스트 러너는 변경 사항의 영향을 받는 테스트를 다시 실행합니다. 테스트 러너는 프로세스가 종료될 때까지 계속 실행됩니다.

## 명령줄에서 테스트 실행 {#running-tests-from-the-command-line}

Node.js 테스트 러너는 [`--test`](/ko/nodejs/api/cli#--test) 플래그를 전달하여 명령줄에서 호출할 수 있습니다.

```bash [BASH]
node --test
```
기본적으로 Node.js는 다음 패턴과 일치하는 모든 파일을 실행합니다.

- `**/*.test.{cjs,mjs,js}`
- `**/*-test.{cjs,mjs,js}`
- `**/*_test.{cjs,mjs,js}`
- `**/test-*.{cjs,mjs,js}`
- `**/test.{cjs,mjs,js}`
- `**/test/**/*.{cjs,mjs,js}`

[`--experimental-strip-types`](/ko/nodejs/api/cli#--experimental-strip-types)가 제공되면 다음 추가 패턴이 일치됩니다.

- `**/*.test.{cts,mts,ts}`
- `**/*-test.{cts,mts,ts}`
- `**/*_test.{cts,mts,ts}`
- `**/test-*.{cts,mts,ts}`
- `**/test.{cts,mts,ts}`
- `**/test/**/*.{cts,mts,ts}`

또는 아래와 같이 하나 이상의 glob 패턴을 Node.js 명령에 대한 최종 인수(들)로 제공할 수 있습니다. Glob 패턴은 [`glob(7)`](https://man7.org/linux/man-pages/man7/glob.7)의 동작을 따릅니다. glob 패턴은 시스템 간의 이식성을 줄일 수 있는 셸 확장을 방지하기 위해 명령줄에서 큰따옴표로 묶어야 합니다.

```bash [BASH]
node --test "**/*.test.js" "**/*.spec.js"
```
일치하는 파일은 테스트 파일로 실행됩니다. 테스트 파일 실행에 대한 자세한 내용은 [테스트 러너 실행 모델](/ko/nodejs/api/test#test-runner-execution-model) 섹션에서 확인할 수 있습니다.


### 테스트 러너 실행 모델 {#test-runner-execution-model}

프로세스 수준 테스트 격리가 활성화되면 일치하는 각 테스트 파일은 별도의 자식 프로세스에서 실행됩니다. 임의의 시간에 실행되는 자식 프로세스의 최대 수는 [`--test-concurrency`](/ko/nodejs/api/cli#--test-concurrency) 플래그로 제어됩니다. 자식 프로세스가 종료 코드 0으로 완료되면 테스트는 통과된 것으로 간주됩니다. 그렇지 않으면 테스트는 실패한 것으로 간주됩니다. 테스트 파일은 Node.js에서 실행할 수 있어야 하지만 내부적으로 `node:test` 모듈을 사용할 필요는 없습니다.

각 테스트 파일은 일반 스크립트인 것처럼 실행됩니다. 즉, 테스트 파일 자체에서 `node:test`를 사용하여 테스트를 정의하는 경우 이러한 모든 테스트는 [`test()`](/ko/nodejs/api/test#testname-options-fn)의 `concurrency` 옵션 값에 관계없이 단일 애플리케이션 스레드 내에서 실행됩니다.

프로세스 수준 테스트 격리가 비활성화되면 일치하는 각 테스트 파일이 테스트 러너 프로세스로 가져와집니다. 모든 테스트 파일이 로드되면 최상위 테스트가 concurrency 1로 실행됩니다. 테스트 파일이 모두 동일한 컨텍스트 내에서 실행되기 때문에 격리가 활성화된 경우에는 불가능한 방식으로 테스트가 서로 상호 작용할 수 있습니다. 예를 들어 테스트가 전역 상태에 의존하는 경우 해당 상태는 다른 파일에서 발생한 테스트에 의해 수정될 수 있습니다.

## 코드 커버리지 수집 {#collecting-code-coverage}

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

Node.js가 [`--experimental-test-coverage`](/ko/nodejs/api/cli#--experimental-test-coverage) 명령줄 플래그로 시작되면 코드 커버리지가 수집되고 모든 테스트가 완료되면 통계가 보고됩니다. [`NODE_V8_COVERAGE`](/ko/nodejs/api/cli#node_v8_coveragedir) 환경 변수를 사용하여 코드 커버리지 디렉터리를 지정하면 생성된 V8 커버리지 파일이 해당 디렉터리에 기록됩니다. Node.js 코어 모듈과 `node_modules/` 디렉터리 내의 파일은 기본적으로 커버리지 보고서에 포함되지 않습니다. 그러나 [`--test-coverage-include`](/ko/nodejs/api/cli#--test-coverage-include) 플래그를 통해 명시적으로 포함할 수 있습니다. 기본적으로 일치하는 모든 테스트 파일은 커버리지 보고서에서 제외됩니다. 제외는 [`--test-coverage-exclude`](/ko/nodejs/api/cli#--test-coverage-exclude) 플래그를 사용하여 재정의할 수 있습니다. 커버리지가 활성화되면 커버리지 보고서는 `'test:coverage'` 이벤트를 통해 모든 [테스트 리포터](/ko/nodejs/api/test#test-reporters)로 전송됩니다.

다음 주석 구문을 사용하여 일련의 라인에서 커버리지를 비활성화할 수 있습니다.

```js [ESM]
/* node:coverage disable */
if (anAlwaysFalseCondition) {
  // 이 분기의 코드는 절대 실행되지 않지만 커버리지 목적으로 라인은 무시됩니다.
  // 'disable' 주석 뒤에 오는 모든 라인은 해당 'enable' 주석이 나타날 때까지 무시됩니다.
  console.log('this is never executed');
}
/* node:coverage enable */
```
지정된 라인 수에 대해서도 커버리지를 비활성화할 수 있습니다. 지정된 라인 수 이후에는 커버리지가 자동으로 다시 활성화됩니다. 라인 수가 명시적으로 제공되지 않으면 단일 라인이 무시됩니다.

```js [ESM]
/* node:coverage ignore next */
if (anAlwaysFalseCondition) { console.log('this is never executed'); }

/* node:coverage ignore next 3 */
if (anAlwaysFalseCondition) {
  console.log('this is never executed');
}
```

### 커버리지 리포터 {#coverage-reporters}

`tap` 및 `spec` 리포터는 커버리지 통계 요약을 출력합니다. 또한 심층적인 커버리지 보고서로 사용할 수 있는 lcov 파일을 생성하는 lcov 리포터도 있습니다.

```bash [BASH]
node --test --experimental-test-coverage --test-reporter=lcov --test-reporter-destination=lcov.info
```
- 이 리포터는 테스트 결과를 보고하지 않습니다.
- 이 리포터는 다른 리포터와 함께 사용하는 것이 좋습니다.

## 모의화 {#mocking}

`node:test` 모듈은 최상위 `mock` 객체를 통해 테스트 중 모의화를 지원합니다. 다음 예제에서는 두 숫자를 더하는 함수에 대한 스파이를 만듭니다. 그런 다음 스파이를 사용하여 함수가 예상대로 호출되었는지 확인합니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('함수에 대한 스파이', () => {
  const sum = mock.fn((a, b) => {
    return a + b;
  });

  assert.strictEqual(sum.mock.callCount(), 0);
  assert.strictEqual(sum(3, 4), 7);
  assert.strictEqual(sum.mock.callCount(), 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [3, 4]);
  assert.strictEqual(call.result, 7);
  assert.strictEqual(call.error, undefined);

  // 전역적으로 추적된 모의화 재설정.
  mock.reset();
});
```

```js [CJS]
'use strict';
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('함수에 대한 스파이', () => {
  const sum = mock.fn((a, b) => {
    return a + b;
  });

  assert.strictEqual(sum.mock.callCount(), 0);
  assert.strictEqual(sum(3, 4), 7);
  assert.strictEqual(sum.mock.callCount(), 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [3, 4]);
  assert.strictEqual(call.result, 7);
  assert.strictEqual(call.error, undefined);

  // 전역적으로 추적된 모의화 재설정.
  mock.reset();
});
```
:::

동일한 모의화 기능이 각 테스트의 [`TestContext`](/ko/nodejs/api/test#class-testcontext) 객체에도 노출됩니다. 다음 예제에서는 `TestContext`에 노출된 API를 사용하여 객체 메서드에 대한 스파이를 만듭니다. 테스트 컨텍스트를 통한 모의화의 장점은 테스트 러너가 테스트가 완료되면 자동으로 모든 모의화된 기능을 복원한다는 것입니다.

```js [ESM]
test('객체 메서드에 대한 스파이', (t) => {
  const number = {
    value: 5,
    add(a) {
      return this.value + a;
    },
  };

  t.mock.method(number, 'add');
  assert.strictEqual(number.add.mock.callCount(), 0);
  assert.strictEqual(number.add(3), 8);
  assert.strictEqual(number.add.mock.callCount(), 1);

  const call = number.add.mock.calls[0];

  assert.deepStrictEqual(call.arguments, [3]);
  assert.strictEqual(call.result, 8);
  assert.strictEqual(call.target, undefined);
  assert.strictEqual(call.this, number);
});
```

### 타이머 {#timers}

타이머 모의화는 `setInterval` 및 `setTimeout`과 같은 타이머의 동작을 실제로 지정된 시간 간격을 기다리지 않고 시뮬레이션하고 제어하기 위해 소프트웨어 테스트에서 일반적으로 사용되는 기술입니다.

전체 메서드 및 기능 목록은 [`MockTimers`](/ko/nodejs/api/test#class-mocktimers) 클래스를 참조하세요.

이를 통해 개발자는 시간에 종속적인 기능에 대해 더 안정적이고 예측 가능한 테스트를 작성할 수 있습니다.

아래 예제는 `setTimeout`을 모의화하는 방법을 보여줍니다. `.enable({ apis: ['setTimeout'] });`을 사용하면 [node:timers](/ko/nodejs/api/timers) 및 [node:timers/promises](/ko/nodejs/api/timers#timers-promises-api) 모듈과 Node.js 전역 컨텍스트에서 `setTimeout` 함수를 모의화합니다.

**참고:** `import { setTimeout } from 'node:timers'`와 같은 함수의 구조 분해는 현재 이 API에서 지원되지 않습니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('setTimeout이 실제로 기다릴 필요 없이 동기적으로 실행되도록 모의화합니다.', () => {
  const fn = mock.fn();

  // 필요에 따라 모의화할 항목을 선택합니다.
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // 시간을 진행합니다.
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // 전역적으로 추적된 모의화를 재설정합니다.
  mock.timers.reset();

  // reset mock 인스턴스를 호출하면 타이머 인스턴스도 재설정됩니다.
  mock.reset();
});
```

```js [CJS]
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('setTimeout이 실제로 기다릴 필요 없이 동기적으로 실행되도록 모의화합니다.', () => {
  const fn = mock.fn();

  // 필요에 따라 모의화할 항목을 선택합니다.
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // 시간을 진행합니다.
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // 전역적으로 추적된 모의화를 재설정합니다.
  mock.timers.reset();

  // reset mock 인스턴스를 호출하면 타이머 인스턴스도 재설정됩니다.
  mock.reset();
});
```
:::

동일한 모의화 기능이 각 테스트의 [`TestContext`](/ko/nodejs/api/test#class-testcontext) 객체의 mock 속성에도 노출됩니다. 테스트 컨텍스트를 통해 모의화하는 이점은 테스트 러너가 테스트가 완료되면 모든 모의화된 타이머 기능을 자동으로 복원한다는 것입니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('setTimeout이 실제로 기다릴 필요 없이 동기적으로 실행되도록 모의화합니다.', (context) => {
  const fn = context.mock.fn();

  // 필요에 따라 모의화할 항목을 선택합니다.
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // 시간을 진행합니다.
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('setTimeout이 실제로 기다릴 필요 없이 동기적으로 실행되도록 모의화합니다.', (context) => {
  const fn = context.mock.fn();

  // 필요에 따라 모의화할 항목을 선택합니다.
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // 시간을 진행합니다.
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::


### 날짜 {#dates}

Mock 타이머 API는 `Date` 객체의 모의도 허용합니다. 이는 시간 종속적인 기능을 테스트하거나 `Date.now()`와 같은 내부 캘린더 기능을 시뮬레이션하는 데 유용한 기능입니다.

날짜 구현은 [`MockTimers`](/ko/nodejs/api/test#class-mocktimers) 클래스의 일부이기도 합니다. 전체 메서드 및 기능 목록은 해당 클래스를 참조하세요.

**참고:** 날짜와 타이머는 함께 모의될 때 서로 의존합니다. 즉, `Date`와 `setTimeout`을 모두 모의한 경우 시간을 진행시키면 모의된 날짜도 함께 진행되는데, 이는 단일 내부 시계를 시뮬레이션하기 때문입니다.

아래 예제는 `Date` 객체를 모의하고 현재 `Date.now()` 값을 얻는 방법을 보여줍니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks the Date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'] });
  // If not specified, the initial date will be based on 0 in the UNIX epoch
  assert.strictEqual(Date.now(), 0);

  // Advance in time will also advance the date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks the Date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'] });
  // If not specified, the initial date will be based on 0 in the UNIX epoch
  assert.strictEqual(Date.now(), 0);

  // Advance in time will also advance the date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

초기 에포크가 설정되지 않은 경우 초기 날짜는 Unix 에포크의 0을 기준으로 합니다. 이는 1970년 1월 1일 00:00:00 UTC입니다. `.enable()` 메서드에 `now` 속성을 전달하여 초기 날짜를 설정할 수 있습니다. 이 값은 모의된 `Date` 객체의 초기 날짜로 사용됩니다. 양의 정수 또는 다른 Date 객체가 될 수 있습니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks the Date object with initial time', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks the Date object with initial time', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```
:::

`.setTime()` 메서드를 사용하여 모의된 날짜를 수동으로 다른 시간으로 이동할 수 있습니다. 이 메서드는 양의 정수만 허용합니다.

**참고:** 이 메서드는 새 시간보다 과거에 있는 모의된 타이머를 실행합니다.

아래 예에서는 모의된 날짜에 대한 새 시간을 설정합니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('sets the time of a date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('sets the time of a date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

과거에 실행되도록 설정된 타이머가 있는 경우 `.tick()` 메서드가 호출된 것처럼 실행됩니다. 이는 이미 과거에 있는 시간 종속적인 기능을 테스트하려는 경우에 유용합니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Timer is not executed as the time is not yet reached
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Timer is executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } require('node:test');

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Timer is not executed as the time is not yet reached
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Timer is executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

`.runAll()`을 사용하면 현재 대기열에 있는 모든 타이머가 실행됩니다. 또한 시간이 경과한 것처럼 모의된 날짜를 마지막으로 실행된 타이머의 시간으로 진행시킵니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // All timers are executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } require('node:test');

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // All timers are executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```
:::


## 스냅샷 테스팅 {#snapshot-testing}

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).0 - 초기 개발
:::

스냅샷 테스트는 임의의 값을 문자열 값으로 직렬화하고 알려진 양호한 값 세트와 비교할 수 있도록 합니다. 알려진 양호한 값은 스냅샷이라고 하며 스냅샷 파일에 저장됩니다. 스냅샷 파일은 테스트 러너에서 관리하지만 디버깅에 도움이 되도록 사람이 읽을 수 있도록 설계되었습니다. 모범 사례는 스냅샷 파일을 테스트 파일과 함께 소스 제어에 체크인하는 것입니다.

스냅샷 파일은 [`--test-update-snapshots`](/ko/nodejs/api/cli#--test-update-snapshots) 명령줄 플래그를 사용하여 Node.js를 시작하여 생성됩니다. 각 테스트 파일에 대해 별도의 스냅샷 파일이 생성됩니다. 기본적으로 스냅샷 파일은 `.snapshot` 파일 확장명을 가진 테스트 파일과 동일한 이름을 갖습니다. 이 동작은 `snapshot.setResolveSnapshotPath()` 함수를 사용하여 구성할 수 있습니다. 각 스냅샷 어설션은 스냅샷 파일의 내보내기에 해당합니다.

아래에 스냅샷 테스트의 예가 나와 있습니다. 이 테스트를 처음 실행하면 해당 스냅샷 파일이 존재하지 않으므로 실패합니다.

```js [ESM]
// test.js
suite('스냅샷 테스트 모음', () => {
  test('스냅샷 테스트', (t) => {
    t.assert.snapshot({ value1: 1, value2: 2 });
    t.assert.snapshot(5);
  });
});
```
`--test-update-snapshots`를 사용하여 테스트 파일을 실행하여 스냅샷 파일을 생성합니다. 테스트가 통과되고 `test.js.snapshot`이라는 파일이 테스트 파일과 동일한 디렉터리에 생성됩니다. 스냅샷 파일의 내용은 아래와 같습니다. 각 스냅샷은 테스트의 전체 이름과 동일한 테스트의 스냅샷을 구별하기 위한 카운터로 식별됩니다.

```js [ESM]
exports[`스냅샷 테스트 모음 > 스냅샷 테스트 1`] = `
{
  "value1": 1,
  "value2": 2
}
`;

exports[`스냅샷 테스트 모음 > 스냅샷 테스트 2`] = `
5
`;
```
스냅샷 파일이 생성되면 `--test-update-snapshots` 플래그 없이 테스트를 다시 실행합니다. 이제 테스트가 통과해야 합니다.


## 테스트 리포터 {#test-reporters}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v19.9.0, v18.17.0 | 리포터가 이제 `node:test/reporters`에서 노출됩니다. |
| v19.6.0, v18.15.0 | 추가됨: v19.6.0, v18.15.0 |
:::

`node:test` 모듈은 테스트 러너가 특정 리포터를 사용하도록 [`--test-reporter`](/ko/nodejs/api/cli#--test-reporter) 플래그 전달을 지원합니다.

다음 내장 리포터가 지원됩니다.

- `spec` `spec` 리포터는 사람이 읽을 수 있는 형식으로 테스트 결과를 출력합니다. 이것이 기본 리포터입니다.
- `tap` `tap` 리포터는 테스트 결과를 [TAP](https://testanything.org/) 형식으로 출력합니다.
- `dot` `dot` 리포터는 테스트 결과를 압축된 형식으로 출력합니다. 여기서 각 통과하는 테스트는 `.`으로 표시되고, 각 실패하는 테스트는 `X`로 표시됩니다.
- `junit` junit 리포터는 테스트 결과를 jUnit XML 형식으로 출력합니다.
- `lcov` `lcov` 리포터는 [`--experimental-test-coverage`](/ko/nodejs/api/cli#--experimental-test-coverage) 플래그와 함께 사용될 때 테스트 커버리지를 출력합니다.

이러한 리포터의 정확한 출력은 Node.js 버전 간에 변경될 수 있으며 프로그래밍 방식으로 의존해서는 안 됩니다. 테스트 러너의 출력에 프로그래밍 방식으로 접근해야 하는 경우 [\<TestsStream\>](/ko/nodejs/api/test#class-testsstream)에서 내보낸 이벤트를 사용하십시오.

리포터는 `node:test/reporters` 모듈을 통해 사용할 수 있습니다.

::: code-group
```js [ESM]
import { tap, spec, dot, junit, lcov } from 'node:test/reporters';
```

```js [CJS]
const { tap, spec, dot, junit, lcov } = require('node:test/reporters');
```
:::

### 사용자 정의 리포터 {#custom-reporters}

[`--test-reporter`](/ko/nodejs/api/cli#--test-reporter)는 사용자 정의 리포터의 경로를 지정하는 데 사용할 수 있습니다. 사용자 정의 리포터는 [stream.compose](/ko/nodejs/api/stream#streamcomposestreams)에서 허용하는 값을 내보내는 모듈입니다. 리포터는 [\<TestsStream\>](/ko/nodejs/api/test#class-testsstream)에서 내보낸 이벤트를 변환해야 합니다.

[\<stream.Transform\>](/ko/nodejs/api/stream#class-streamtransform)을 사용하는 사용자 정의 리포터의 예:

::: code-group
```js [ESM]
import { Transform } from 'node:stream';

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

export default customReporter;
```

```js [CJS]
const { Transform } = require('node:stream');

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

module.exports = customReporter;
```
:::

생성기 함수를 사용하는 사용자 정의 리포터의 예:

::: code-group
```js [ESM]
export default async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
}
```

```js [CJS]
module.exports = async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
};
```
:::

`--test-reporter`에 제공된 값은 JavaScript 코드의 `import()`에서 사용되는 문자열과 같거나 [`--import`](/ko/nodejs/api/cli#--importmodule)에 제공된 값과 같아야 합니다.


### 여러 리포터 {#multiple-reporters}

[`--test-reporter`](/ko/nodejs/api/cli#--test-reporter) 플래그를 여러 번 지정하여 테스트 결과를 여러 형식으로 보고할 수 있습니다. 이 경우 [`--test-reporter-destination`](/ko/nodejs/api/cli#--test-reporter-destination)을 사용하여 각 리포터의 대상을 지정해야 합니다. 대상은 `stdout`, `stderr` 또는 파일 경로가 될 수 있습니다. 리포터와 대상은 지정된 순서에 따라 쌍을 이룹니다.

다음 예제에서는 `spec` 리포터가 `stdout`으로 출력되고 `dot` 리포터가 `file.txt`로 출력됩니다.

```bash [BASH]
node --test-reporter=spec --test-reporter=dot --test-reporter-destination=stdout --test-reporter-destination=file.txt
```
단일 리포터를 지정하면 대상을 명시적으로 제공하지 않는 한 대상은 기본적으로 `stdout`으로 설정됩니다.

## `run([options])` {#runoptions}

::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | `cwd` 옵션이 추가되었습니다. |
| v23.0.0 | 커버리지 옵션이 추가되었습니다. |
| v22.8.0 | `isolation` 옵션이 추가되었습니다. |
| v22.6.0 | `globPatterns` 옵션이 추가되었습니다. |
| v22.0.0, v20.14.0 | `forceExit` 옵션이 추가되었습니다. |
| v20.1.0, v18.17.0 | testNamePatterns 옵션이 추가되었습니다. |
| v18.9.0, v16.19.0 | 다음 버전에서 추가되었습니다: v18.9.0, v16.19.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 테스트 실행을 위한 구성 옵션. 다음 속성이 지원됩니다.
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 숫자가 제공되면 해당 수만큼의 테스트 프로세스가 병렬로 실행됩니다. 여기서 각 프로세스는 하나의 테스트 파일에 해당합니다. `true`이면 `os.availableParallelism() - 1`개의 테스트 파일을 병렬로 실행합니다. `false`이면 한 번에 하나의 테스트 파일만 실행합니다. **기본값:** `false`.
    - `cwd`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 테스트 러너가 사용할 현재 작업 디렉터리를 지정합니다. [테스트 러너 실행 모델](/ko/nodejs/api/test#test-runner-execution-model)에 따라 파일을 확인하기 위한 기본 경로 역할을 합니다. **기본값:** `process.cwd()`.
    - `files`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 실행할 파일 목록을 포함하는 배열입니다. **기본값:** [테스트 러너 실행 모델](/ko/nodejs/api/test#test-runner-execution-model)에서 일치하는 파일.
    - `forceExit`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이벤트 루프가 활성 상태로 유지되더라도 알려진 모든 테스트가 완료되면 프로세스를 종료하도록 테스트 러너를 구성합니다. **기본값:** `false`.
    - `globPatterns`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 테스트 파일을 일치시킬 glob 패턴 목록을 포함하는 배열입니다. 이 옵션은 `files`와 함께 사용할 수 없습니다. **기본값:** [테스트 러너 실행 모델](/ko/nodejs/api/test#test-runner-execution-model)에서 일치하는 파일.
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 테스트 자식 프로세스의 검사기 포트를 설정합니다. 이는 숫자 또는 인수를 받지 않고 숫자를 반환하는 함수일 수 있습니다. nullish 값이 제공되면 각 프로세스는 기본 프로세스의 `process.debugPort`에서 증가된 자체 포트를 가져옵니다. 이 옵션은 자식 프로세스가 생성되지 않으므로 `isolation` 옵션이 `'none'`으로 설정된 경우 무시됩니다. **기본값:** `undefined`.
    - `isolation` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 테스트 격리 유형을 구성합니다. `'process'`로 설정하면 각 테스트 파일이 별도의 자식 프로세스에서 실행됩니다. `'none'`으로 설정하면 모든 테스트 파일이 현재 프로세스에서 실행됩니다. **기본값:** `'process'`.
    - `only`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) truthy이면 테스트 컨텍스트는 `only` 옵션이 설정된 테스트만 실행합니다.
    - `setup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `TestsStream` 인스턴스를 받아 테스트가 실행되기 전에 리스너를 설정하는 데 사용할 수 있는 함수입니다. **기본값:** `undefined`.
    - `execArgv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 하위 프로세스를 생성할 때 `node` 실행 파일에 전달할 CLI 플래그 배열입니다. 이 옵션은 `isolation`이 `'none'`인 경우 아무런 효과가 없습니다. **기본값:** `[]`.
    - `argv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 하위 프로세스를 생성할 때 각 테스트 파일에 전달할 CLI 플래그 배열입니다. 이 옵션은 `isolation`이 `'none'`인 경우 아무런 효과가 없습니다. **기본값:** `[]`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 테스트 실행을 중단할 수 있습니다.
    - `testNamePatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 제공된 패턴과 일치하는 이름의 테스트만 실행하는 데 사용할 수 있는 문자열, RegExp 또는 RegExp 배열입니다. 테스트 이름 패턴은 JavaScript 정규식으로 해석됩니다. 실행되는 각 테스트에 대해 `beforeEach()`와 같은 해당 테스트 후크도 실행됩니다. **기본값:** `undefined`.
    - `testSkipPatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 제공된 패턴과 일치하는 이름의 테스트 실행을 제외하는 데 사용할 수 있는 문자열, RegExp 또는 RegExp 배열입니다. 테스트 이름 패턴은 JavaScript 정규식으로 해석됩니다. 실행되는 각 테스트에 대해 `beforeEach()`와 같은 해당 테스트 후크도 실행됩니다. **기본값:** `undefined`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트 실행이 실패하는 데 걸리는 시간(밀리초)입니다. 지정하지 않으면 하위 테스트는 부모로부터 이 값을 상속합니다. **기본값:** `Infinity`.
    - `watch` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 감시 모드에서 실행할지 여부입니다. **기본값:** `false`.
    - `shard` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 특정 샤드에서 테스트를 실행합니다. **기본값:** `undefined`.
        - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 실행할 샤드의 인덱스를 지정하는 1과 `\<total\>` 사이의 양의 정수입니다. 이 옵션은 *필수*입니다.
        - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트 파일을 분할할 총 샤드 수를 지정하는 양의 정수입니다. 이 옵션은 *필수*입니다.

    - `coverage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) [코드 커버리지](/ko/nodejs/api/test#collecting-code-coverage) 수집을 활성화합니다. **기본값:** `false`.
    - `coverageExcludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 절대 및 상대 파일 경로와 일치할 수 있는 glob 패턴을 사용하여 코드 커버리지에서 특정 파일을 제외합니다. 이 속성은 `coverage`가 `true`로 설정된 경우에만 적용됩니다. `coverageExcludeGlobs`와 `coverageIncludeGlobs`가 모두 제공된 경우 파일은 커버리지 보고서에 포함되려면 **두** 기준을 모두 충족해야 합니다. **기본값:** `undefined`.
    - `coverageIncludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 절대 및 상대 파일 경로와 일치할 수 있는 glob 패턴을 사용하여 특정 파일을 코드 커버리지에 포함합니다. 이 속성은 `coverage`가 `true`로 설정된 경우에만 적용됩니다. `coverageExcludeGlobs`와 `coverageIncludeGlobs`가 모두 제공된 경우 파일은 커버리지 보고서에 포함되려면 **두** 기준을 모두 충족해야 합니다. **기본값:** `undefined`.
    - `lineCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커버된 라인의 최소 백분율을 요구합니다. 코드 커버리지가 지정된 임계값에 도달하지 못하면 프로세스가 코드 `1`로 종료됩니다. **기본값:** `0`.
    - `branchCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커버된 분기의 최소 백분율을 요구합니다. 코드 커버리지가 지정된 임계값에 도달하지 못하면 프로세스가 코드 `1`로 종료됩니다. **기본값:** `0`.
    - `functionCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커버된 함수의 최소 백분율을 요구합니다. 코드 커버리지가 지정된 임계값에 도달하지 못하면 프로세스가 코드 `1`로 종료됩니다. **기본값:** `0`.

- 반환 값: [\<TestsStream\>](/ko/nodejs/api/test#class-testsstream)

**참고:** `shard`는 머신 또는 프로세스 간에 테스트 실행을 수평적으로 병렬화하는 데 사용되며 다양한 환경에서 대규모 실행에 적합합니다. 파일 변경 시 테스트를 자동으로 다시 실행하여 빠른 코드 반복에 맞춰진 `watch` 모드와는 호환되지 않습니다.

::: code-group
```js [ESM]
import { tap } from 'node:test/reporters';
import { run } from 'node:test';
import process from 'node:process';
import path from 'node:path';

run({ files: [path.resolve('./tests/test.js')] })
 .on('test:fail', () => {
   process.exitCode = 1;
 })
 .compose(tap)
 .pipe(process.stdout);
```

```js [CJS]
const { tap } = require('node:test/reporters');
const { run } = require('node:test');
const path = require('node:path');

run({ files: [path.resolve('./tests/test.js')] })
 .on('test:fail', () => {
   process.exitCode = 1;
 })
 .compose(tap)
 .pipe(process.stdout);
```
:::


## `suite([name][, options][, fn])` {#suitename-options-fn}

**추가된 버전: v22.0.0, v20.13.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 테스트 결과를 보고할 때 표시되는 스위트 이름. **기본값:** `fn`의 `name` 속성 또는 `fn`에 이름이 없는 경우 `'\<anonymous\>'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 스위트에 대한 선택적 구성 옵션입니다. 이는 `test([name][, options][, fn])`과 동일한 옵션을 지원합니다.
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 중첩된 테스트 및 스위트를 선언하는 스위트 함수입니다. 이 함수의 첫 번째 인수는 [`SuiteContext`](/ko/nodejs/api/test#class-suitecontext) 객체입니다. **기본값:** 아무 작업도 수행하지 않는 함수입니다.
- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) `undefined`로 즉시 완료됩니다.

`suite()` 함수는 `node:test` 모듈에서 가져옵니다.

## `suite.skip([name][, options][, fn])` {#suiteskipname-options-fn}

**추가된 버전: v22.0.0, v20.13.0**

스위트를 건너뛰기 위한 약식입니다. 이는 [`suite([name], { skip: true }[, fn])`](/ko/nodejs/api/test#suitename-options-fn)과 같습니다.

## `suite.todo([name][, options][, fn])` {#suitetodoname-options-fn}

**추가된 버전: v22.0.0, v20.13.0**

스위트를 `TODO`로 표시하기 위한 약식입니다. 이는 [`suite([name], { todo: true }[, fn])`](/ko/nodejs/api/test#suitename-options-fn)과 같습니다.

## `suite.only([name][, options][, fn])` {#suiteonlyname-options-fn}

**추가된 버전: v22.0.0, v20.13.0**

스위트를 `only`로 표시하기 위한 약식입니다. 이는 [`suite([name], { only: true }[, fn])`](/ko/nodejs/api/test#suitename-options-fn)과 같습니다.

## `test([name][, options][, fn])` {#testname-options-fn}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.2.0, v18.17.0 | `skip`, `todo` 및 `only` 약어가 추가되었습니다. |
| v18.8.0, v16.18.0 | `signal` 옵션이 추가되었습니다. |
| v18.7.0, v16.17.0 | `timeout` 옵션이 추가되었습니다. |
| v18.0.0, v16.17.0 | 추가된 버전: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 테스트 결과를 보고할 때 표시되는 테스트 이름. **기본값:** `fn`의 `name` 속성 또는 `fn`에 이름이 없는 경우 `'\<anonymous\>'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 테스트에 대한 구성 옵션입니다. 다음 속성이 지원됩니다.
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 숫자가 제공되면 해당 숫자만큼의 테스트가 애플리케이션 스레드 내에서 병렬로 실행됩니다. `true`인 경우 예약된 모든 비동기 테스트가 스레드 내에서 동시에 실행됩니다. `false`인 경우 한 번에 하나의 테스트만 실행됩니다. 지정되지 않은 경우 하위 테스트는 이 값을 부모로부터 상속합니다. **기본값:** `false`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 참이고 테스트 컨텍스트가 `only` 테스트를 실행하도록 구성된 경우 이 테스트가 실행됩니다. 그렇지 않으면 테스트가 건너뜁니다. **기본값:** `false`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 테스트를 중단할 수 있습니다.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 참이면 테스트가 건너뜁니다. 문자열이 제공되면 해당 문자열이 테스트를 건너뛰는 이유로 테스트 결과에 표시됩니다. **기본값:** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 참이면 테스트가 `TODO`로 표시됩니다. 문자열이 제공되면 해당 문자열이 테스트가 `TODO`인 이유로 테스트 결과에 표시됩니다. **기본값:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트가 실패하는 밀리초 수입니다. 지정되지 않은 경우 하위 테스트는 이 값을 부모로부터 상속합니다. **기본값:** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트에서 실행될 것으로 예상되는 어설션 및 하위 테스트의 수입니다. 테스트에서 실행되는 어설션 수가 계획에 지정된 수와 일치하지 않으면 테스트가 실패합니다. **기본값:** `undefined`.
  
 
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 테스트 중인 함수입니다. 이 함수의 첫 번째 인수는 [`TestContext`](/ko/nodejs/api/test#class-testcontext) 객체입니다. 테스트에서 콜백을 사용하는 경우 콜백 함수가 두 번째 인수로 전달됩니다. **기본값:** 아무 작업도 수행하지 않는 함수입니다.
- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 테스트가 완료되면 `undefined`로 완료되거나 테스트가 스위트 내에서 실행되는 경우 즉시 완료됩니다.

`test()` 함수는 `test` 모듈에서 가져온 값입니다. 이 함수를 호출할 때마다 [\<TestsStream\>](/ko/nodejs/api/test#class-testsstream)에 테스트를 보고합니다.

`fn` 인수에 전달된 `TestContext` 객체는 현재 테스트와 관련된 작업을 수행하는 데 사용할 수 있습니다. 예를 들어 테스트 건너뛰기, 추가 진단 정보 추가 또는 하위 테스트 만들기가 있습니다.

`test()`는 테스트가 완료되면 완료되는 `Promise`를 반환합니다. `test()`가 스위트 내에서 호출되면 즉시 완료됩니다. 반환 값은 일반적으로 최상위 테스트의 경우 삭제할 수 있습니다. 그러나 다음 예제에서 볼 수 있듯이 하위 테스트의 반환 값을 사용하여 상위 테스트가 먼저 완료되어 하위 테스트를 취소하는 것을 방지해야 합니다.

```js [ESM]
test('최상위 테스트', async (t) => {
  // 다음 하위 테스트의 setTimeout()은 다음 줄에서 'await'가 제거되면 상위 테스트보다 오래 지속됩니다. 상위 테스트가 완료되면 보류 중인 모든 하위 테스트가 취소됩니다.
  await t.test('더 오래 실행되는 하위 테스트', async (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });
  });
});
```
`timeout` 옵션을 사용하여 완료하는 데 `timeout` 밀리초보다 오래 걸리면 테스트를 실패할 수 있습니다. 그러나 실행 중인 테스트가 애플리케이션 스레드를 차단하여 예약된 취소를 방지할 수 있으므로 테스트를 취소하는 안정적인 메커니즘은 아닙니다.


## `test.skip([name][, options][, fn])` {#testskipname-options-fn}

테스트를 건너뛰기 위한 속기 표현으로, [`test([name], { skip: true }[, fn])`](/ko/nodejs/api/test#testname-options-fn)과 동일합니다.

## `test.todo([name][, options][, fn])` {#testtodoname-options-fn}

테스트를 `TODO`로 표시하기 위한 속기 표현으로, [`test([name], { todo: true }[, fn])`](/ko/nodejs/api/test#testname-options-fn)과 동일합니다.

## `test.only([name][, options][, fn])` {#testonlyname-options-fn}

테스트를 `only`로 표시하기 위한 속기 표현으로, [`test([name], { only: true }[, fn])`](/ko/nodejs/api/test#testname-options-fn)과 동일합니다.

## `describe([name][, options][, fn])` {#describename-options-fn}

[`suite()`](/ko/nodejs/api/test#suitename-options-fn)의 별칭입니다.

`describe()` 함수는 `node:test` 모듈에서 가져옵니다.

## `describe.skip([name][, options][, fn])` {#describeskipname-options-fn}

스위트를 건너뛰기 위한 속기 표현입니다. 이는 [`describe([name], { skip: true }[, fn])`](/ko/nodejs/api/test#describename-options-fn)과 동일합니다.

## `describe.todo([name][, options][, fn])` {#describetodoname-options-fn}

스위트를 `TODO`로 표시하기 위한 속기 표현입니다. 이는 [`describe([name], { todo: true }[, fn])`](/ko/nodejs/api/test#describename-options-fn)과 동일합니다.

## `describe.only([name][, options][, fn])` {#describeonlyname-options-fn}

**Added in: v19.8.0, v18.15.0**

스위트를 `only`로 표시하기 위한 속기 표현입니다. 이는 [`describe([name], { only: true }[, fn])`](/ko/nodejs/api/test#describename-options-fn)과 동일합니다.

## `it([name][, options][, fn])` {#itname-options-fn}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.8.0, v18.16.0 | 이제 `it()`을 호출하는 것은 `test()`를 호출하는 것과 같습니다. |
| v18.6.0, v16.17.0 | Added in: v18.6.0, v16.17.0 |
:::

[`test()`](/ko/nodejs/api/test#testname-options-fn)의 별칭입니다.

`it()` 함수는 `node:test` 모듈에서 가져옵니다.

## `it.skip([name][, options][, fn])` {#itskipname-options-fn}

테스트를 건너뛰기 위한 속기 표현으로, [`it([name], { skip: true }[, fn])`](/ko/nodejs/api/test#testname-options-fn)과 동일합니다.

## `it.todo([name][, options][, fn])` {#ittodoname-options-fn}

테스트를 `TODO`로 표시하기 위한 속기 표현으로, [`it([name], { todo: true }[, fn])`](/ko/nodejs/api/test#testname-options-fn)과 동일합니다.

## `it.only([name][, options][, fn])` {#itonlyname-options-fn}

**Added in: v19.8.0, v18.15.0**

테스트를 `only`로 표시하기 위한 속기 표현으로, [`it([name], { only: true }[, fn])`](/ko/nodejs/api/test#testname-options-fn)과 동일합니다.


## `before([fn][, options])` {#beforefn-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 훅 함수입니다. 훅이 콜백을 사용하는 경우, 콜백 함수는 두 번째 인수로 전달됩니다. **기본값:** 아무 작업도 수행하지 않는 함수.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 훅에 대한 구성 옵션입니다. 다음 속성이 지원됩니다.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 훅을 중단할 수 있습니다.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 훅이 실패하는 데 걸리는 밀리초 단위의 시간입니다. 지정하지 않으면 하위 테스트는 이 값을 부모로부터 상속합니다. **기본값:** `Infinity`.
  
 

이 함수는 스위트를 실행하기 전에 실행되는 훅을 만듭니다.

```js [ESM]
describe('tests', async () => {
  before(() => console.log('about to run some test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `after([fn][, options])` {#afterfn-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 훅 함수입니다. 훅이 콜백을 사용하는 경우, 콜백 함수는 두 번째 인수로 전달됩니다. **기본값:** 아무 작업도 수행하지 않는 함수.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 훅에 대한 구성 옵션입니다. 다음 속성이 지원됩니다.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 훅을 중단할 수 있습니다.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 훅이 실패하는 데 걸리는 밀리초 단위의 시간입니다. 지정하지 않으면 하위 테스트는 이 값을 부모로부터 상속합니다. **기본값:** `Infinity`.
  
 

이 함수는 스위트를 실행한 후에 실행되는 훅을 만듭니다.

```js [ESM]
describe('tests', async () => {
  after(() => console.log('finished running tests'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
**참고:** `after` 훅은 스위트 내의 테스트가 실패하더라도 실행이 보장됩니다.


## `beforeEach([fn][, options])` {#beforeeachfn-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 훅 함수. 훅이 콜백을 사용하는 경우 콜백 함수가 두 번째 인수로 전달됩니다. **기본값:** 아무것도 하지 않는 함수.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 훅에 대한 구성 옵션. 다음 속성이 지원됩니다.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 훅을 중단할 수 있습니다.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 훅이 실패하는 데 걸리는 시간(밀리초)입니다. 지정하지 않으면 하위 테스트는 이 값을 상위 테스트에서 상속합니다. **기본값:** `Infinity`.
  
 

이 함수는 현재 스위트의 각 테스트 전에 실행되는 훅을 생성합니다.

```js [ESM]
describe('tests', async () => {
  beforeEach(() => console.log('about to run a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `afterEach([fn][, options])` {#aftereachfn-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 훅 함수. 훅이 콜백을 사용하는 경우 콜백 함수가 두 번째 인수로 전달됩니다. **기본값:** 아무것도 하지 않는 함수.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 훅에 대한 구성 옵션. 다음 속성이 지원됩니다.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 훅을 중단할 수 있습니다.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 훅이 실패하는 데 걸리는 시간(밀리초)입니다. 지정하지 않으면 하위 테스트는 이 값을 상위 테스트에서 상속합니다. **기본값:** `Infinity`.
  
 

이 함수는 현재 스위트의 각 테스트 후에 실행되는 훅을 생성합니다. `afterEach()` 훅은 테스트가 실패하더라도 실행됩니다.

```js [ESM]
describe('tests', async () => {
  afterEach(() => console.log('finished running a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```

## `snapshot` {#snapshot}

**추가된 버전: v22.3.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).0 - 초기 개발
:::

현재 프로세스에서 기본 스냅샷 설정을 구성하는 데 사용되는 메서드를 가진 객체입니다. `--require` 또는 `--import`로 미리 로드된 모듈에 공통 구성 코드를 배치하여 모든 파일에 동일한 구성을 적용할 수 있습니다.

### `snapshot.setDefaultSnapshotSerializers(serializers)` {#snapshotsetdefaultsnapshotserializersserializers}

**추가된 버전: v22.3.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).0 - 초기 개발
:::

- `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 스냅샷 테스트를 위한 기본 직렬 변환기로 사용되는 동기 함수 배열입니다.

이 함수는 테스트 러너에서 사용되는 기본 직렬화 메커니즘을 사용자 정의하는 데 사용됩니다. 기본적으로 테스트 러너는 제공된 값에 대해 `JSON.stringify(value, null, 2)`를 호출하여 직렬화를 수행합니다. `JSON.stringify()`는 순환 구조 및 지원되는 데이터 유형에 대한 제한 사항이 있습니다. 더 강력한 직렬화 메커니즘이 필요한 경우 이 함수를 사용해야 합니다.

### `snapshot.setResolveSnapshotPath(fn)` {#snapshotsetresolvesnapshotpathfn}

**추가된 버전: v22.3.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).0 - 초기 개발
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 스냅샷 파일의 위치를 계산하는 데 사용되는 함수입니다. 이 함수는 테스트 파일의 경로를 유일한 인수로 받습니다. 테스트가 파일과 연결되지 않은 경우 (예: REPL) 입력은 정의되지 않습니다. `fn()`은 스냅샷 파일의 위치를 지정하는 문자열을 반환해야 합니다.

이 함수는 스냅샷 테스트에 사용되는 스냅샷 파일의 위치를 사용자 정의하는 데 사용됩니다. 기본적으로 스냅샷 파일 이름은 `.snapshot` 파일 확장자를 가진 진입점 파일 이름과 동일합니다.


## 클래스: `MockFunctionContext` {#class-mockfunctioncontext}

**추가된 버전: v19.1.0, v18.13.0**

`MockFunctionContext` 클래스는 [`MockTracker`](/ko/nodejs/api/test#class-mocktracker) API를 통해 생성된 모의 함수의 동작을 검사하거나 조작하는 데 사용됩니다.

### `ctx.calls` {#ctxcalls}

**추가된 버전: v19.1.0, v18.13.0**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

모의 함수 호출을 추적하는 데 사용되는 내부 배열의 복사본을 반환하는 getter입니다. 배열의 각 항목은 다음 속성을 가진 객체입니다.

- `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 모의 함수에 전달된 인수 배열입니다.
- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 모의 함수가 예외를 던진 경우 이 속성은 던져진 값을 포함합니다. **기본값:** `undefined`.
- `result` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 모의 함수가 반환한 값입니다.
- `stack` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 모의 함수 호출의 호출 위치를 결정하는 데 사용할 수 있는 스택을 가진 `Error` 객체입니다.
- `target` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 모의 함수가 생성자인 경우 이 필드는 생성 중인 클래스를 포함합니다. 그렇지 않으면 `undefined`입니다.
- `this` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 모의 함수의 `this` 값입니다.

### `ctx.callCount()` {#ctxcallcount}

**추가된 버전: v19.1.0, v18.13.0**

- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 모의 함수가 호출된 횟수입니다.

이 함수는 이 모의 함수가 호출된 횟수를 반환합니다. 이 함수는 `ctx.calls.length`를 확인하는 것보다 효율적인데, `ctx.calls`는 내부 호출 추적 배열의 복사본을 생성하는 getter이기 때문입니다.


### `ctx.mockImplementation(implementation)` {#ctxmockimplementationimplementation}

**추가됨: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 모의의 새로운 구현으로 사용할 함수입니다.

이 함수는 기존 모의의 동작을 변경하는 데 사용됩니다.

다음 예는 `t.mock.fn()`을 사용하여 모의 함수를 만들고, 모의 함수를 호출한 다음, 모의 구현을 다른 함수로 변경합니다.

```js [ESM]
test('모의 동작 변경', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne);

  assert.strictEqual(fn(), 1);
  fn.mock.mockImplementation(addTwo);
  assert.strictEqual(fn(), 3);
  assert.strictEqual(fn(), 5);
});
```
### `ctx.mockImplementationOnce(implementation[, onCall])` {#ctxmockimplementationonceimplementation-oncall}

**추가됨: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) `onCall`로 지정된 호출 번호에 대한 모의의 구현으로 사용할 함수입니다.
- `onCall` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `implementation`을 사용할 호출 번호입니다. 지정된 호출이 이미 발생한 경우 예외가 발생합니다. **기본값:** 다음 호출 번호.

이 함수는 단일 호출에 대한 기존 모의의 동작을 변경하는 데 사용됩니다. 호출 `onCall`이 발생하면 모의는 `mockImplementationOnce()`가 호출되지 않은 경우 사용했을 동작으로 되돌아갑니다.

다음 예는 `t.mock.fn()`을 사용하여 모의 함수를 만들고, 모의 함수를 호출하고, 다음 호출에 대해 모의 구현을 다른 함수로 변경한 다음, 이전 동작을 재개합니다.

```js [ESM]
test('모의 동작을 한 번 변경', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne);

  assert.strictEqual(fn(), 1);
  fn.mock.mockImplementationOnce(addTwo);
  assert.strictEqual(fn(), 3);
  assert.strictEqual(fn(), 4);
});
```

### `ctx.resetCalls()` {#ctxresetcalls}

**추가된 버전: v19.3.0, v18.13.0**

모의 함수의 호출 기록을 재설정합니다.

### `ctx.restore()` {#ctxrestore}

**추가된 버전: v19.1.0, v18.13.0**

모의 함수의 구현을 원래 동작으로 재설정합니다. 이 함수를 호출한 후에도 모의 함수를 계속 사용할 수 있습니다.

## 클래스: `MockModuleContext` {#class-mockmodulecontext}

**추가된 버전: v22.3.0, v20.18.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).0 - 초기 개발
:::

`MockModuleContext` 클래스는 [`MockTracker`](/ko/nodejs/api/test#class-mocktracker) API를 통해 생성된 모듈 모의의 동작을 조작하는 데 사용됩니다.

### `ctx.restore()` {#ctxrestore_1}

**추가된 버전: v22.3.0, v20.18.0**

모의 모듈의 구현을 재설정합니다.

## 클래스: `MockTracker` {#class-mocktracker}

**추가된 버전: v19.1.0, v18.13.0**

`MockTracker` 클래스는 모의 기능을 관리하는 데 사용됩니다. 테스트 러너 모듈은 최상위 `mock` 내보내기를 제공하며 이는 `MockTracker` 인스턴스입니다. 각 테스트는 테스트 컨텍스트의 `mock` 속성을 통해 자체 `MockTracker` 인스턴스도 제공합니다.

### `mock.fn([original[, implementation]][, options])` {#mockfnoriginal-implementation-options}

**추가된 버전: v19.1.0, v18.13.0**

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 모의를 생성할 선택적 함수입니다. **기본값:** no-op 함수입니다.
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) `original`에 대한 모의 구현으로 사용되는 선택적 함수입니다. 이는 지정된 횟수만큼 호출에 대해 하나의 동작을 보이고 `original`의 동작을 복원하는 모의를 만드는 데 유용합니다. **기본값:** `original`에서 지정한 함수입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 모의 함수에 대한 선택적 구성 옵션입니다. 다음 속성이 지원됩니다.
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 모의가 `implementation`의 동작을 사용하는 횟수입니다. 모의 함수가 `times` 횟수만큼 호출되면 `original`의 동작을 자동으로 복원합니다. 이 값은 0보다 큰 정수여야 합니다. **기본값:** `Infinity`.

- 반환값: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 모의된 함수입니다. 모의된 함수는 [`MockFunctionContext`](/ko/nodejs/api/test#class-mockfunctioncontext) 인스턴스인 특수한 `mock` 속성을 포함하며 모의된 함수의 동작을 검사하고 변경하는 데 사용할 수 있습니다.

이 함수는 모의 함수를 만드는 데 사용됩니다.

다음 예제는 호출될 때마다 카운터를 1씩 증가시키는 모의 함수를 만듭니다. `times` 옵션은 처음 두 번의 호출이 1 대신 카운터에 2를 더하도록 모의 동작을 수정하는 데 사용됩니다.

```js [ESM]
test('mocks a counting function', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne, addTwo, { times: 2 });

  assert.strictEqual(fn(), 2);
  assert.strictEqual(fn(), 4);
  assert.strictEqual(fn(), 5);
  assert.strictEqual(fn(), 6);
});
```

### `mock.getter(object, methodName[, implementation][, options])` {#mockgetterobject-methodname-implementation-options}

**추가된 버전: v19.3.0, v18.13.0**

이 함수는 `options.getter`가 `true`로 설정된 [`MockTracker.method`](/ko/nodejs/api/test#mockmethodobject-methodname-implementation-options)에 대한 구문 설탕입니다.

### `mock.method(object, methodName[, implementation][, options])` {#mockmethodobject-methodname-implementation-options}

**추가된 버전: v19.1.0, v18.13.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 모의 처리될 메서드를 가진 객체입니다.
- `methodName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) `object`에서 모의 처리할 메서드의 식별자입니다. `object[methodName]`이 함수가 아니면 오류가 발생합니다.
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) `object[methodName]`에 대한 모의 구현으로 사용되는 선택적 함수입니다. **기본값:** `object[methodName]`에 의해 지정된 원래 메서드입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 모의 메서드에 대한 선택적 구성 옵션입니다. 다음 속성이 지원됩니다.
    - `getter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, `object[methodName]`은 getter로 처리됩니다. 이 옵션은 `setter` 옵션과 함께 사용할 수 없습니다. **기본값:** false.
    - `setter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, `object[methodName]`은 setter로 처리됩니다. 이 옵션은 `getter` 옵션과 함께 사용할 수 없습니다. **기본값:** false.
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 모의가 `implementation`의 동작을 사용할 횟수입니다. 모의 처리된 메서드가 `times`번 호출되면 원래 동작으로 자동 복원됩니다. 이 값은 0보다 큰 정수여야 합니다. **기본값:** `Infinity`.

- 반환: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 모의 처리된 메서드입니다. 모의 처리된 메서드에는 [`MockFunctionContext`](/ko/nodejs/api/test#class-mockfunctioncontext)의 인스턴스인 특수한 `mock` 속성이 포함되어 있으며, 모의 처리된 메서드의 동작을 검사하고 변경하는 데 사용할 수 있습니다.

이 함수는 기존 객체 메서드에 대한 모의를 만드는 데 사용됩니다. 다음 예제에서는 기존 객체 메서드에 모의가 생성되는 방법을 보여줍니다.

```js [ESM]
test('객체 메서드를 스파이합니다.', (t) => {
  const number = {
    value: 5,
    subtract(a) {
      return this.value - a;
    },
  };

  t.mock.method(number, 'subtract');
  assert.strictEqual(number.subtract.mock.callCount(), 0);
  assert.strictEqual(number.subtract(3), 2);
  assert.strictEqual(number.subtract.mock.callCount(), 1);

  const call = number.subtract.mock.calls[0];

  assert.deepStrictEqual(call.arguments, [3]);
  assert.strictEqual(call.result, 2);
  assert.strictEqual(call.error, undefined);
  assert.strictEqual(call.target, undefined);
  assert.strictEqual(call.this, number);
});
```

### `mock.module(specifier[, options])` {#mockmodulespecifier-options}

**다음 버전부터 추가됨: v22.3.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).0 - 초기 개발
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 모의할 모듈을 식별하는 문자열입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 모의 모듈에 대한 선택적 구성 옵션입니다. 다음 속성이 지원됩니다.
    - `cache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`인 경우 `require()` 또는 `import()`를 호출할 때마다 새로운 모의 모듈이 생성됩니다. `true`인 경우 이후 호출은 동일한 모듈 모의를 반환하고 모의 모듈은 CommonJS 캐시에 삽입됩니다. **기본값:** false.
    - `defaultExport` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 모의 모듈의 기본 내보내기로 사용되는 선택적 값입니다. 이 값이 제공되지 않으면 ESM 모의는 기본 내보내기를 포함하지 않습니다. 모의가 CommonJS 또는 내장 모듈인 경우 이 설정은 `module.exports`의 값으로 사용됩니다. 이 값이 제공되지 않으면 CJS 및 내장 모의는 빈 객체를 `module.exports`의 값으로 사용합니다.
    - `namedExports` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 모의 모듈의 명명된 내보내기를 만드는 데 사용되는 키와 값이 있는 선택적 객체입니다. 모의가 CommonJS 또는 내장 모듈인 경우 이러한 값은 `module.exports`에 복사됩니다. 따라서 명명된 내보내기와 객체가 아닌 기본 내보내기를 모두 사용하여 모의를 생성하면 CJS 또는 내장 모듈로 사용될 때 모의가 예외를 발생시킵니다.
  
 
- 반환: [\<MockModuleContext\>](/ko/nodejs/api/test#class-mockmodulecontext) 모의를 조작하는 데 사용할 수 있는 객체입니다.

이 함수는 ECMAScript 모듈, CommonJS 모듈 및 Node.js 내장 모듈의 내보내기를 모의하는 데 사용됩니다. 모의하기 전에 원래 모듈에 대한 모든 참조는 영향을 받지 않습니다. 모듈 모의를 활성화하려면 Node.js를 [`--experimental-test-module-mocks`](/ko/nodejs/api/cli#--experimental-test-module-mocks) 명령줄 플래그로 시작해야 합니다.

다음 예제는 모듈에 대한 모의가 생성되는 방법을 보여줍니다.

```js [ESM]
test('모듈 시스템 모두에서 내장 모듈을 모의합니다.', async (t) => {
  // 원래 'node:readline' 모듈에 존재하지 않는 'fn'이라는 명명된 내보내기가 있는
  // 'node:readline'의 모의를 만듭니다.
  const mock = t.mock.module('node:readline', {
    namedExports: { fn() { return 42; } },
  });

  let esmImpl = await import('node:readline');
  let cjsImpl = require('node:readline');

  // cursorTo()는 원래 'node:readline' 모듈의 내보내기입니다.
  assert.strictEqual(esmImpl.cursorTo, undefined);
  assert.strictEqual(cjsImpl.cursorTo, undefined);
  assert.strictEqual(esmImpl.fn(), 42);
  assert.strictEqual(cjsImpl.fn(), 42);

  mock.restore();

  // 모의가 복원되어 원래 내장 모듈이 반환됩니다.
  esmImpl = await import('node:readline');
  cjsImpl = require('node:readline');

  assert.strictEqual(typeof esmImpl.cursorTo, 'function');
  assert.strictEqual(typeof cjsImpl.cursorTo, 'function');
  assert.strictEqual(esmImpl.fn, undefined);
  assert.strictEqual(cjsImpl.fn, undefined);
});
```

### `mock.reset()` {#mockreset}

**Added in: v19.1.0, v18.13.0**

이 함수는 이 `MockTracker`에 의해 이전에 생성된 모든 모의의 기본 동작을 복원하고 모의를 `MockTracker` 인스턴스와 연결 해제합니다. 연결이 해제되면 모의를 계속 사용할 수 있지만 `MockTracker` 인스턴스를 사용하여 해당 동작을 재설정하거나 다른 방식으로 상호 작용할 수 없습니다.

각 테스트가 완료되면 이 함수가 테스트 컨텍스트의 `MockTracker`에서 호출됩니다. 전역 `MockTracker`를 광범위하게 사용하는 경우 이 함수를 수동으로 호출하는 것이 좋습니다.

### `mock.restoreAll()` {#mockrestoreall}

**Added in: v19.1.0, v18.13.0**

이 함수는 이 `MockTracker`에 의해 이전에 생성된 모든 모의의 기본 동작을 복원합니다. `mock.reset()`과 달리 `mock.restoreAll()`은 모의를 `MockTracker` 인스턴스와 연결 해제하지 않습니다.

### `mock.setter(object, methodName[, implementation][, options])` {#mocksetterobject-methodname-implementation-options}

**Added in: v19.3.0, v18.13.0**

이 함수는 `options.setter`가 `true`로 설정된 [`MockTracker.method`](/ko/nodejs/api/test#mockmethodobject-methodname-implementation-options)에 대한 구문 슈가입니다.

## Class: `MockTimers` {#class-mocktimers}


::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v23.1.0 | 모의 타이머가 이제 안정되었습니다. |
| v20.4.0, v18.19.0 | Added in: v20.4.0, v18.19.0 |
:::

::: tip [안정성: 2 - 안정됨]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

모의 타이머는 소프트웨어 테스트에서 지정된 시간 간격을 실제로 기다리지 않고 `setInterval` 및 `setTimeout`과 같은 타이머의 동작을 시뮬레이션하고 제어하는 데 일반적으로 사용되는 기술입니다.

MockTimers는 `Date` 객체를 모의할 수도 있습니다.

[`MockTracker`](/ko/nodejs/api/test#class-mocktracker)는 `MockTimers` 인스턴스인 최상위 `timers` 내보내기를 제공합니다.

### `timers.enable([enableOptions])` {#timersenableenableoptions}


::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v21.2.0, v20.11.0 | 사용 가능한 API와 기본 초기 에포크를 사용하여 매개 변수를 옵션 객체로 업데이트했습니다. |
| v20.4.0, v18.19.0 | Added in: v20.4.0, v18.19.0 |
:::

지정된 타이머에 대한 타이머 모의를 활성화합니다.

- `enableOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 타이머 모의를 활성화하기 위한 선택적 구성 옵션입니다. 다음 속성이 지원됩니다.
    - `apis` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 모의할 타이머를 포함하는 선택적 배열입니다. 현재 지원되는 타이머 값은 `'setInterval'`, `'setTimeout'`, `'setImmediate'` 및 `'Date'`입니다. **기본값:** `['setInterval', 'setTimeout', 'setImmediate', 'Date']`. 배열이 제공되지 않으면 모든 시간 관련 API(`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'`, `'clearImmediate'` 및 `'Date'`)가 기본적으로 모의됩니다.
    - `now` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) `Date.now()`의 값으로 사용할 초기 시간(밀리초)을 나타내는 선택적 숫자 또는 Date 객체입니다. **기본값:** `0`.



**참고:** 특정 타이머에 대한 모의를 활성화하면 관련 clear 함수도 암시적으로 모의됩니다.

**참고:** `Date`를 모의하면 동일한 내부 클록을 사용하므로 모의된 타이머의 동작에 영향을 미칩니다.

초기 시간을 설정하지 않고 사용하는 예:



::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['setInterval'] });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['setInterval'] });
```
:::

위의 예는 `setInterval` 타이머에 대한 모의를 활성화하고 `clearInterval` 함수를 암시적으로 모의합니다. [node:timers](/ko/nodejs/api/timers), [node:timers/promises](/ko/nodejs/api/timers#timers-promises-api) 및 `globalThis`의 `setInterval` 및 `clearInterval` 함수만 모의됩니다.

초기 시간을 설정하여 사용하는 예:



::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['Date'], now: 1000 });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['Date'], now: 1000 });
```
:::

초기 Date 객체를 시간으로 설정하여 사용하는 예:



::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['Date'], now: new Date() });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['Date'], now: new Date() });
```
:::

또는 매개 변수 없이 `mock.timers.enable()`을 호출하는 경우:

모든 타이머(`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'` 및 `'clearImmediate'`)가 모의됩니다. `node:timers`, `node:timers/promises` 및 `globalThis`의 `setInterval`, `clearInterval`, `setTimeout`, `clearTimeout`, `setImmediate` 및 `clearImmediate` 함수가 모의됩니다. 전역 `Date` 객체도 마찬가지입니다.


### `timers.reset()` {#timersreset}

**추가됨: v20.4.0, v18.19.0**

이 함수는 이 `MockTimers` 인스턴스에 의해 이전에 생성된 모든 모의의 기본 동작을 복원하고 모의를 `MockTracker` 인스턴스와 분리합니다.

**참고:** 각 테스트가 완료된 후 이 함수는 테스트 컨텍스트의 `MockTracker`에서 호출됩니다.

::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.reset();
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.reset();
```
:::

### `timers[Symbol.dispose]()` {#timerssymboldispose}

`timers.reset()`을 호출합니다.

### `timers.tick([milliseconds])` {#timerstickmilliseconds}

**추가됨: v20.4.0, v18.19.0**

모든 모의된 타이머의 시간을 진행시킵니다.

- `milliseconds` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 타이머를 진행시킬 시간 (밀리초)입니다. **기본값:** `1`.

**참고:** 이는 Node.js의 `setTimeout` 동작과 다르며 양수만 허용합니다. Node.js에서 음수를 사용하는 `setTimeout`은 웹 호환성 이유로만 지원됩니다.

다음 예제는 `setTimeout` 함수를 모의하고 `.tick`을 사용하여 시간이 지나면 보류 중인 모든 타이머를 트리거합니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('setTimeout을 실제로 기다릴 필요 없이 동기적으로 실행되도록 모의합니다.', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);

  // 시간 진행
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('setTimeout을 실제로 기다릴 필요 없이 동기적으로 실행되도록 모의합니다.', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // 시간 진행
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

또는 `.tick` 함수를 여러 번 호출할 수 있습니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('setTimeout을 실제로 기다릴 필요 없이 동기적으로 실행되도록 모의합니다.', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const nineSecs = 9000;
  setTimeout(fn, nineSecs);

  const threeSeconds = 3000;
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('setTimeout을 실제로 기다릴 필요 없이 동기적으로 실행되도록 모의합니다.', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const nineSecs = 9000;
  setTimeout(fn, nineSecs);

  const threeSeconds = 3000;
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

`.tick`을 사용하여 시간을 진행하면 모의가 활성화된 후에 생성된 모든 `Date` 객체의 시간도 진행됩니다 (`Date`도 모의하도록 설정된 경우).

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('setTimeout을 실제로 기다릴 필요 없이 동기적으로 실행되도록 모의합니다.', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // 시간 진행
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('setTimeout을 실제로 기다릴 필요 없이 동기적으로 실행되도록 모의합니다.', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // 시간 진행
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

#### 명확한 함수 사용하기 {#using-clear-functions}

언급했듯이 타이머의 모든 clear 함수(`clearTimeout`, `clearInterval` 및 `clearImmediate`)는 암묵적으로 모의됩니다. `setTimeout`을 사용하는 다음 예제를 살펴보세요.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('실제로 기다릴 필요 없이 setTimeout을 동기적으로 실행되도록 모의합니다.', (context) => {
  const fn = context.mock.fn();

  // 선택적으로 모의할 항목을 선택합니다.
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // 암묵적으로도 모의됨
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // setTimeout이 지워졌으므로 모의 함수는 절대 호출되지 않습니다.
  assert.strictEqual(fn.mock.callCount(), 0);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('실제로 기다릴 필요 없이 setTimeout을 동기적으로 실행되도록 모의합니다.', (context) => {
  const fn = context.mock.fn();

  // 선택적으로 모의할 항목을 선택합니다.
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // 암묵적으로도 모의됨
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // setTimeout이 지워졌으므로 모의 함수는 절대 호출되지 않습니다.
  assert.strictEqual(fn.mock.callCount(), 0);
});
```
:::

#### Node.js 타이머 모듈 작업하기 {#working-with-nodejs-timers-modules}

타이머 모의를 활성화하면 [node:timers](/ko/nodejs/api/timers), [node:timers/promises](/ko/nodejs/api/timers#timers-promises-api) 모듈과 Node.js 전역 컨텍스트의 타이머가 활성화됩니다.

**참고:** `import { setTimeout } from 'node:timers'`와 같은 함수의 구조 분해 할당은 현재 이 API에서 지원되지 않습니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimers from 'node:timers';
import nodeTimersPromises from 'node:timers/promises';

test('실제로 기다릴 필요 없이 setTimeout을 동기적으로 실행되도록 모의합니다.', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // 선택적으로 모의할 항목을 선택합니다.
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // 시간 진행
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');
const nodeTimers = require('node:timers');
const nodeTimersPromises = require('node:timers/promises');

test('실제로 기다릴 필요 없이 setTimeout을 동기적으로 실행되도록 모의합니다.', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // 선택적으로 모의할 항목을 선택합니다.
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // 시간 진행
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```
:::

Node.js에서 [node:timers/promises](/ko/nodejs/api/timers#timers-promises-api)의 `setInterval`은 `AsyncGenerator`이며 이 API에서도 지원됩니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimersPromises from 'node:timers/promises';
test('실제 사용 사례를 테스트하는 다섯 번의 틱', async (context) => {
  context.mock.timers.enable({ apis: ['setInterval'] });

  const expectedIterations = 3;
  const interval = 1000;
  const startedAt = Date.now();
  async function run() {
    const times = [];
    for await (const time of nodeTimersPromises.setInterval(interval, startedAt)) {
      times.push(time);
      if (times.length === expectedIterations) break;
    }
    return times;
  }

  const r = run();
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);

  const timeResults = await r;
  assert.strictEqual(timeResults.length, expectedIterations);
  for (let it = 1; it < expectedIterations; it++) {
    assert.strictEqual(timeResults[it - 1], startedAt + (interval * it));
  }
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');
const nodeTimersPromises = require('node:timers/promises');
test('실제 사용 사례를 테스트하는 다섯 번의 틱', async (context) => {
  context.mock.timers.enable({ apis: ['setInterval'] });

  const expectedIterations = 3;
  const interval = 1000;
  const startedAt = Date.now();
  async function run() {
    const times = [];
    for await (const time of nodeTimersPromises.setInterval(interval, startedAt)) {
      times.push(time);
      if (times.length === expectedIterations) break;
    }
    return times;
  }

  const r = run();
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);

  const timeResults = await r;
  assert.strictEqual(timeResults.length, expectedIterations);
  for (let it = 1; it < expectedIterations; it++) {
    assert.strictEqual(timeResults[it - 1], startedAt + (interval * it));
  }
});
```
:::


### `timers.runAll()` {#timersrunall}

**추가된 버전: v20.4.0, v18.19.0**

보류 중인 모든 모의 타이머를 즉시 트리거합니다. `Date` 객체도 모의된 경우 `Date` 객체도 가장 먼 타이머의 시간으로 진행됩니다.

아래 예제는 보류 중인 모든 타이머를 즉시 트리거하여 지연 없이 실행되도록 합니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('주어진 순서에 따라 runAll 함수 실행', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // 두 타이머의 제한 시간이 같으면
  // 실행 순서가 보장됩니다.
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // Date 객체도 가장 먼 타이머의 시간으로 진행됩니다.
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('주어진 순서에 따라 runAll 함수 실행', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // 두 타이머의 제한 시간이 같으면
  // 실행 순서가 보장됩니다.
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // Date 객체도 가장 먼 타이머의 시간으로 진행됩니다.
  assert.strictEqual(Date.now(), 9999);
});
```
:::

**참고:** `runAll()` 함수는 타이머 모의 환경에서 타이머를 트리거하도록 특별히 설계되었습니다. 모의 환경 외부의 실시간 시스템 시계 또는 실제 타이머에는 아무런 영향을 미치지 않습니다.

### `timers.setTime(milliseconds)` {#timerssettimemilliseconds}

**추가된 버전: v21.2.0, v20.11.0**

모의된 `Date` 객체에 대한 참조로 사용될 현재 Unix 타임스탬프를 설정합니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('주어진 순서에 따라 runAll 함수 실행', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now는 모의되지 않았습니다.
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // 이제 Date.now는 1000입니다.
  assert.strictEqual(Date.now(), setTime);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('setTime은 현재 시간을 대체합니다.', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now는 모의되지 않았습니다.
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // 이제 Date.now는 1000입니다.
  assert.strictEqual(Date.now(), setTime);
});
```
:::


#### 날짜 및 타이머가 함께 작동 {#dates-and-timers-working-together}

날짜 및 타이머 객체는 서로 의존적입니다. `setTime()`을 사용하여 현재 시간을 모의 `Date` 객체에 전달하는 경우 `setTimeout` 및 `setInterval`로 설정된 타이머는 영향을 **받지 않습니다**.

그러나 `tick` 메서드는 모의 `Date` 객체를 **진행시킵니다**.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('주어진 순서에 따라 모든 함수 실행', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // 날짜는 진행되지만 타이머는 작동하지 않습니다.
  assert.strictEqual(Date.now(), 12000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('주어진 순서에 따라 모든 함수 실행', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // 날짜는 진행되지만 타이머는 작동하지 않습니다.
  assert.strictEqual(Date.now(), 12000);
});
```
:::

## 클래스: `TestsStream` {#class-testsstream}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0, v19.9.0, v18.17.0 | 테스트가 스위트인 경우 test:pass 및 test:fail 이벤트에 유형 추가. |
| v18.9.0, v16.19.0 | 추가됨: v18.9.0, v16.19.0 |
:::

- [\<Readable\>](/ko/nodejs/api/stream#class-streamreadable) 확장

[`run()`](/ko/nodejs/api/test#runoptions) 메서드를 성공적으로 호출하면 테스트 실행을 나타내는 일련의 이벤트를 스트리밍하는 새 [\<TestsStream\>](/ko/nodejs/api/test#class-testsstream) 객체가 반환됩니다. `TestsStream`은 테스트 정의 순서대로 이벤트를 발생시킵니다.

일부 이벤트는 테스트가 정의된 순서와 동일한 순서로 발생하도록 보장되는 반면, 다른 이벤트는 테스트가 실행되는 순서대로 발생합니다.


### 이벤트: `'test:coverage'` {#event-testcoverage}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `summary` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 커버리지 보고서를 포함하는 객체입니다.
    - `files` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 개별 파일에 대한 커버리지 보고서 배열입니다. 각 보고서는 다음 스키마를 가진 객체입니다.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 파일의 절대 경로입니다.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 총 라인 수입니다.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 총 분기 수입니다.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 총 함수 수입니다.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커버된 라인 수입니다.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커버된 분기 수입니다.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커버된 함수 수입니다.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커버된 라인 비율입니다.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커버된 분기 비율입니다.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커버된 함수 비율입니다.
    - `functions` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 함수 커버리지를 나타내는 함수 배열입니다.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 함수의 이름입니다.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 함수가 정의된 라인 번호입니다.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 함수가 호출된 횟수입니다.
  
 
    - `branches` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 분기 커버리지를 나타내는 분기 배열입니다.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 분기가 정의된 라인 번호입니다.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 분기가 실행된 횟수입니다.
  
 
    - `lines` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 라인 번호와 커버된 횟수를 나타내는 라인 배열입니다.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 라인 번호입니다.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 라인이 커버된 횟수입니다.
  
 
  
 
    - `thresholds` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 각 커버리지 유형에 대한 커버리지 여부를 포함하는 객체입니다.
    - `function` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 함수 커버리지 임계값입니다.
    - `branch` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 분기 커버리지 임계값입니다.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 라인 커버리지 임계값입니다.
  
 
    - `totals` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 모든 파일에 대한 커버리지 요약을 포함하는 객체입니다.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 총 라인 수입니다.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 총 분기 수입니다.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 총 함수 수입니다.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커버된 라인 수입니다.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커버된 분기 수입니다.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커버된 함수 수입니다.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커버된 라인 비율입니다.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커버된 분기 비율입니다.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커버된 함수 비율입니다.
  
 
    - `workingDirectory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 코드 커버리지가 시작될 때의 작업 디렉토리입니다. 이는 테스트가 Node.js 프로세스의 작업 디렉토리를 변경한 경우 상대 경로 이름을 표시하는 데 유용합니다.
  
 
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트의 중첩 수준입니다.
  
 

코드 커버리지가 활성화되고 모든 테스트가 완료되면 발생합니다.


### 이벤트: `'test:complete'` {#event-testcomplete}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 열 번호 또는 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 추가 실행 메타데이터.
    - `passed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 테스트 통과 여부.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트 지속 시간(밀리초).
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 통과하지 못한 경우 테스트에서 발생한 오류를 래핑하는 오류입니다.
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 테스트에서 발생한 실제 오류입니다.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트 유형, 이것이 스위트인지 여부를 나타내는 데 사용됩니다.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트 파일의 경로, 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 줄 번호 또는 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 테스트 이름.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트의 중첩 수준.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트의 서수.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`context.todo`](/ko/nodejs/api/test#contexttodomessage)가 호출된 경우 제공됩니다.
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`context.skip`](/ko/nodejs/api/test#contextskipmessage)가 호출된 경우 제공됩니다.
  
 

테스트 실행이 완료되면 발생합니다. 이 이벤트는 테스트가 정의된 순서와 동일한 순서로 발생하지 않습니다. 해당 선언 순서 이벤트는 `'test:pass'` 및 `'test:fail'`입니다.


### 이벤트: `'test:dequeue'` {#event-testdequeue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 열 번호 또는 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트 파일의 경로, 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 줄 번호 또는 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 테스트 이름입니다.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트의 중첩 수준입니다.

테스트가 실행되기 직전에 큐에서 제거될 때 발생합니다. 이 이벤트는 테스트가 정의된 순서와 동일한 순서로 발생한다고 보장되지 않습니다. 해당 선언 순서 이벤트는 `'test:start'`입니다.

### 이벤트: `'test:diagnostic'` {#event-testdiagnostic}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 열 번호 또는 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트 파일의 경로, 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 줄 번호 또는 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 진단 메시지입니다.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트의 중첩 수준입니다.

[`context.diagnostic`](/ko/nodejs/api/test#contextdiagnosticmessage)이 호출될 때 발생합니다. 이 이벤트는 테스트가 정의된 순서와 동일한 순서로 발생한다고 보장됩니다.


### 이벤트: `'test:enqueue'` {#event-testenqueue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 열 번호이거나, REPL을 통해 테스트가 실행된 경우 `undefined`입니다.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트 파일의 경로이며, REPL을 통해 테스트가 실행된 경우 `undefined`입니다.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 줄 번호이거나, REPL을 통해 테스트가 실행된 경우 `undefined`입니다.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 테스트 이름입니다.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트의 중첩 수준입니다.
  
 

테스트가 실행 대기열에 추가될 때 발생합니다.

### 이벤트: `'test:fail'` {#event-testfail}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 열 번호이거나, REPL을 통해 테스트가 실행된 경우 `undefined`입니다.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 추가 실행 메타데이터입니다. 
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트의 지속 시간(밀리초)입니다.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 테스트에서 발생한 오류를 감싸는 오류입니다. 
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 테스트에서 발생한 실제 오류입니다.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 스위트인지 여부를 나타내는 데 사용되는 테스트 유형입니다.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트 파일의 경로이며, REPL을 통해 테스트가 실행된 경우 `undefined`입니다.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 줄 번호이거나, REPL을 통해 테스트가 실행된 경우 `undefined`입니다.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 테스트 이름입니다.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트의 중첩 수준입니다.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트의 순서 번호입니다.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`context.todo`](/ko/nodejs/api/test#contexttodomessage)가 호출된 경우 존재합니다.
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`context.skip`](/ko/nodejs/api/test#contextskipmessage)가 호출된 경우 존재합니다.
  
 

테스트가 실패할 때 발생합니다. 이 이벤트는 테스트가 정의된 순서와 동일한 순서로 발생하도록 보장됩니다. 해당 실행 순서 이벤트는 `'test:complete'`입니다.


### 이벤트: `'test:pass'` {#event-testpass}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 열 번호이거나 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 추가 실행 메타데이터.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트 기간 (밀리초).
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 이것이 스위트인지 나타내는 데 사용되는 테스트 유형입니다.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트 파일의 경로, 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 줄 번호이거나 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 테스트 이름.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트의 중첩 수준.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트의 순서 번호.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`context.todo`](/ko/nodejs/api/test#contexttodomessage)가 호출된 경우 존재합니다.
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`context.skip`](/ko/nodejs/api/test#contextskipmessage)가 호출된 경우 존재합니다.
  
 

테스트가 통과할 때 발생합니다. 이 이벤트는 테스트가 정의된 것과 동일한 순서로 발생하도록 보장됩니다. 해당 실행 순서 이벤트는 `'test:complete'`입니다.


### Event: `'test:plan'` {#event-testplan}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 열 번호 또는 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트 파일의 경로, 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 줄 번호 또는 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트의 중첩 수준입니다.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 실행된 하위 테스트의 수입니다.
  
 

주어진 테스트에 대해 모든 하위 테스트가 완료되면 발생합니다. 이 이벤트는 테스트가 정의된 것과 동일한 순서로 발생하는 것이 보장됩니다.

### Event: `'test:start'` {#event-teststart}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 열 번호 또는 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트 파일의 경로, 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 테스트가 정의된 줄 번호 또는 테스트가 REPL을 통해 실행된 경우 `undefined`입니다.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 테스트 이름입니다.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트의 중첩 수준입니다.
  
 

테스트가 자체 및 하위 테스트 상태 보고를 시작할 때 발생합니다. 이 이벤트는 테스트가 정의된 것과 동일한 순서로 발생하는 것이 보장됩니다. 해당 실행 순서 이벤트는 `'test:dequeue'`입니다.


### 이벤트: `'test:stderr'` {#event-teststderr}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 테스트 파일의 경로입니다.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `stderr`에 기록된 메시지입니다.

 

실행 중인 테스트가 `stderr`에 쓸 때 발생합니다. 이 이벤트는 `--test` 플래그가 전달된 경우에만 발생합니다. 이 이벤트가 테스트가 정의된 순서와 동일한 순서로 발생한다고 보장할 수 없습니다.

### 이벤트: `'test:stdout'` {#event-teststdout}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 테스트 파일의 경로입니다.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `stdout`에 기록된 메시지입니다.

 

실행 중인 테스트가 `stdout`에 쓸 때 발생합니다. 이 이벤트는 `--test` 플래그가 전달된 경우에만 발생합니다. 이 이벤트가 테스트가 정의된 순서와 동일한 순서로 발생한다고 보장할 수 없습니다.

### 이벤트: `'test:summary'` {#event-testsummary}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `counts` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 다양한 테스트 결과의 개수를 포함하는 객체입니다.
    - `cancelled` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 취소된 총 테스트 수입니다.
    - `failed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 실패한 총 테스트 수입니다.
    - `passed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 통과한 총 테스트 수입니다.
    - `skipped` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 건너뛴 총 테스트 수입니다.
    - `suites` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 실행된 총 스위트 수입니다.
    - `tests` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스위트를 제외한 실행된 총 테스트 수입니다.
    - `todo` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 총 TODO 테스트 수입니다.
    - `topLevel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 총 최상위 테스트 및 스위트 수입니다.

 
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트 실행 기간(밀리초)입니다.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 요약을 생성한 테스트 파일의 경로입니다. 요약이 여러 파일에 해당하는 경우 이 값은 `undefined`입니다.
    - `success` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 테스트 실행이 성공적인 것으로 간주되는지 여부를 나타냅니다. 실패하는 테스트 또는 충족되지 않은 커버리지 임계값과 같은 오류 조건이 발생하면 이 값이 `false`로 설정됩니다.

 

테스트 실행이 완료되면 발생합니다. 이 이벤트에는 완료된 테스트 실행과 관련된 메트릭이 포함되어 있으며 테스트 실행이 통과했는지 또는 실패했는지 확인하는 데 유용합니다. 프로세스 수준 테스트 격리가 사용되는 경우 최종 누적 요약 외에도 각 테스트 파일에 대해 `'test:summary'` 이벤트가 생성됩니다.


### 이벤트: `'test:watch:drained'` {#event-testwatchdrained}

더 이상 감시 모드에서 실행을 위해 대기 중인 테스트가 없을 때 발생합니다.

## 클래스: `TestContext` {#class-testcontext}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.1.0, v18.17.0 | `before` 함수가 TestContext에 추가되었습니다. |
| v18.0.0, v16.17.0 | 추가됨: v18.0.0, v16.17.0 |
:::

`TestContext`의 인스턴스는 테스트 러너와 상호 작용하기 위해 각 테스트 함수에 전달됩니다. 그러나 `TestContext` 생성자는 API의 일부로 노출되지 않습니다.

### `context.before([fn][, options])` {#contextbeforefn-options}

**추가됨: v20.1.0, v18.17.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 훅 함수입니다. 이 함수의 첫 번째 인수는 [`TestContext`](/ko/nodejs/api/test#class-testcontext) 객체입니다. 훅이 콜백을 사용하는 경우 콜백 함수가 두 번째 인수로 전달됩니다. **기본값:** no-op 함수입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 훅의 구성 옵션입니다. 다음 속성이 지원됩니다.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 훅을 중단할 수 있습니다.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 훅이 실패하는 데 걸리는 시간(밀리초)입니다. 지정하지 않으면 하위 테스트는 이 값을 부모로부터 상속받습니다. **기본값:** `Infinity`입니다.

이 함수는 현재 테스트의 하위 테스트 전에 실행되는 훅을 만드는 데 사용됩니다.

### `context.beforeEach([fn][, options])` {#contextbeforeeachfn-options}

**추가됨: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 훅 함수입니다. 이 함수의 첫 번째 인수는 [`TestContext`](/ko/nodejs/api/test#class-testcontext) 객체입니다. 훅이 콜백을 사용하는 경우 콜백 함수가 두 번째 인수로 전달됩니다. **기본값:** no-op 함수입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 훅의 구성 옵션입니다. 다음 속성이 지원됩니다.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 훅을 중단할 수 있습니다.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 훅이 실패하는 데 걸리는 시간(밀리초)입니다. 지정하지 않으면 하위 테스트는 이 값을 부모로부터 상속받습니다. **기본값:** `Infinity`입니다.

이 함수는 현재 테스트의 각 하위 테스트 전에 실행되는 훅을 만드는 데 사용됩니다.

```js [ESM]
test('최상위 테스트', async (t) => {
  t.beforeEach((t) => t.diagnostic(`실행 예정 ${t.name}`));
  await t.test(
    '이것은 하위 테스트입니다',
    (t) => {
      assert.ok('여기서 일부 관련 어설션');
    },
  );
});
```

### `context.after([fn][, options])` {#contextafterfn-options}

**Added in: v19.3.0, v18.13.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 훅 함수. 이 함수의 첫 번째 인수는 [`TestContext`](/ko/nodejs/api/test#class-testcontext) 객체입니다. 훅이 콜백을 사용하는 경우 콜백 함수가 두 번째 인수로 전달됩니다. **기본값:** no-op 함수.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 훅의 구성 옵션. 다음 속성이 지원됩니다.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 훅을 중단할 수 있습니다.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 훅이 실패하는 데 걸리는 밀리초 수입니다. 지정하지 않으면 하위 테스트는 이 값을 부모로부터 상속받습니다. **기본값:** `Infinity`.
  
 

이 함수는 현재 테스트가 완료된 후 실행되는 훅을 만드는 데 사용됩니다.

```js [ESM]
test('top level test', async (t) => {
  t.after((t) => t.diagnostic(`finished running ${t.name}`));
  assert.ok('some relevant assertion here');
});
```
### `context.afterEach([fn][, options])` {#contextaftereachfn-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 훅 함수. 이 함수의 첫 번째 인수는 [`TestContext`](/ko/nodejs/api/test#class-testcontext) 객체입니다. 훅이 콜백을 사용하는 경우 콜백 함수가 두 번째 인수로 전달됩니다. **기본값:** no-op 함수.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 훅의 구성 옵션. 다음 속성이 지원됩니다.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 훅을 중단할 수 있습니다.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 훅이 실패하는 데 걸리는 밀리초 수입니다. 지정하지 않으면 하위 테스트는 이 값을 부모로부터 상속받습니다. **기본값:** `Infinity`.
  
 

이 함수는 현재 테스트의 각 하위 테스트 후에 실행되는 훅을 만드는 데 사용됩니다.

```js [ESM]
test('top level test', async (t) => {
  t.afterEach((t) => t.diagnostic(`finished running ${t.name}`));
  await t.test(
    'This is a subtest',
    (t) => {
      assert.ok('some relevant assertion here');
    },
  );
});
```

### `context.assert` {#contextassert}

**Added in: v22.2.0, v20.15.0**

`context`에 바인딩된 어설션 메서드를 포함하는 객체입니다. `node:assert` 모듈의 최상위 함수는 테스트 계획을 생성하기 위해 여기에 노출됩니다.

```js [ESM]
test('test', (t) => {
  t.plan(1);
  t.assert.strictEqual(true, true);
});
```
#### `context.assert.snapshot(value[, options])` {#contextassertsnapshotvalue-options}

**Added in: v22.3.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index).0 - 초기 개발
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 문자열로 직렬화할 값입니다. Node.js가 [`--test-update-snapshots`](/ko/nodejs/api/cli#--test-update-snapshots) 플래그로 시작된 경우 직렬화된 값이 스냅샷 파일에 기록됩니다. 그렇지 않으면 직렬화된 값이 기존 스냅샷 파일의 해당 값과 비교됩니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 선택적 구성 옵션입니다. 다음 속성이 지원됩니다.
    - `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) `value`를 문자열로 직렬화하는 데 사용되는 동기 함수 배열입니다. `value`는 첫 번째 직렬 변환기 함수에 유일한 인수로 전달됩니다. 각 직렬 변환기의 반환 값은 다음 직렬 변환기에 입력으로 전달됩니다. 모든 직렬 변환기가 실행되면 결과 값은 문자열로 강제 변환됩니다. **기본값:** 직렬 변환기가 제공되지 않으면 테스트 러너의 기본 직렬 변환기가 사용됩니다.
  
 

이 함수는 스냅샷 테스트를 위한 어설션을 구현합니다.

```js [ESM]
test('기본 직렬화를 사용한 스냅샷 테스트', (t) => {
  t.assert.snapshot({ value1: 1, value2: 2 });
});

test('사용자 정의 직렬화를 사용한 스냅샷 테스트', (t) => {
  t.assert.snapshot({ value3: 3, value4: 4 }, {
    serializers: [(value) => JSON.stringify(value)],
  });
});
```

### `context.diagnostic(message)` {#contextdiagnosticmessage}

**추가된 버전: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 보고할 메시지입니다.

이 함수는 진단을 출력에 쓰는 데 사용됩니다. 모든 진단 정보는 테스트 결과의 끝에 포함됩니다. 이 함수는 값을 반환하지 않습니다.

```js [ESM]
test('최상위 테스트', (t) => {
  t.diagnostic('진단 메시지');
});
```
### `context.filePath` {#contextfilepath}

**추가된 버전: v22.6.0, v20.16.0**

현재 테스트를 생성한 테스트 파일의 절대 경로입니다. 테스트 파일이 테스트를 생성하는 추가 모듈을 가져오는 경우, 가져온 테스트는 루트 테스트 파일의 경로를 반환합니다.

### `context.fullName` {#contextfullname}

**추가된 버전: v22.3.0**

테스트의 이름과 각 상위 항목의 이름으로, `\>`로 구분됩니다.

### `context.name` {#contextname}

**추가된 버전: v18.8.0, v16.18.0**

테스트의 이름입니다.

### `context.plan(count)` {#contextplancount}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.4.0 | 이 함수는 더 이상 실험적이지 않습니다. |
| v22.2.0, v20.15.0 | 추가된 버전: v22.2.0, v20.15.0 |
:::

- `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 실행될 것으로 예상되는 어설션 및 하위 테스트의 수입니다.

이 함수는 테스트 내에서 실행될 것으로 예상되는 어설션 및 하위 테스트의 수를 설정하는 데 사용됩니다. 실행되는 어설션 및 하위 테스트의 수가 예상 개수와 일치하지 않으면 테스트가 실패합니다.

```js [ESM]
test('최상위 테스트', (t) => {
  t.plan(2);
  t.assert.ok('여기에 관련된 어설션');
  t.test('하위 테스트', () => {});
});
```
비동기 코드를 사용하는 경우 `plan` 함수를 사용하여 올바른 수의 어설션이 실행되도록 할 수 있습니다.

```js [ESM]
test('스트림을 사용한 계획', (t, done) => {
  function* generate() {
    yield 'a';
    yield 'b';
    yield 'c';
  }
  const expected = ['a', 'b', 'c'];
  t.plan(expected.length);
  const stream = Readable.from(generate());
  stream.on('data', (chunk) => {
    t.assert.strictEqual(chunk, expected.shift());
  });

  stream.on('end', () => {
    done();
  });
});
```

### `context.runOnly(shouldRunOnlyTests)` {#contextrunonlyshouldrunonlytests}

**추가된 버전: v18.0.0, v16.17.0**

- `shouldRunOnlyTests` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `only` 테스트를 실행할지 여부입니다.

`shouldRunOnlyTests`가 truthy 값이면 테스트 컨텍스트는 `only` 옵션이 설정된 테스트만 실행합니다. 그렇지 않으면 모든 테스트가 실행됩니다. Node.js가 [`--test-only`](/ko/nodejs/api/cli#--test-only) 명령줄 옵션으로 시작되지 않은 경우 이 함수는 아무 작업도 수행하지 않습니다.

```js [ESM]
test('최상위 테스트', (t) => {
  // 테스트 컨텍스트를 'only' 옵션으로 서브 테스트를 실행하도록 설정할 수 있습니다.
  t.runOnly(true);
  return Promise.all([
    t.test('이 서브 테스트는 이제 건너뜁니다.'),
    t.test('이 서브 테스트는 실행됩니다.', { only: true }),
  ]);
});
```
### `context.signal` {#contextsignal}

**추가된 버전: v18.7.0, v16.17.0**

- 유형: [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)

테스트가 중단된 경우 테스트 하위 작업을 중단하는 데 사용할 수 있습니다.

```js [ESM]
test('최상위 테스트', async (t) => {
  await fetch('some/uri', { signal: t.signal });
});
```
### `context.skip([message])` {#contextskipmessage}

**추가된 버전: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 선택적 건너뛰기 메시지입니다.

이 함수는 테스트의 출력이 테스트를 건너뛴 것으로 나타내도록 합니다. `message`가 제공되면 출력에 포함됩니다. `skip()`을 호출해도 테스트 함수의 실행이 종료되지는 않습니다. 이 함수는 값을 반환하지 않습니다.

```js [ESM]
test('최상위 테스트', (t) => {
  // 테스트에 추가 로직이 포함된 경우 여기에서도 반환해야 합니다.
  t.skip('이것은 건너뜁니다.');
});
```
### `context.todo([message])` {#contexttodomessage}

**추가된 버전: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 선택적 `TODO` 메시지입니다.

이 함수는 테스트의 출력에 `TODO` 지시문을 추가합니다. `message`가 제공되면 출력에 포함됩니다. `todo()`를 호출해도 테스트 함수의 실행이 종료되지는 않습니다. 이 함수는 값을 반환하지 않습니다.

```js [ESM]
test('최상위 테스트', (t) => {
  // 이 테스트는 `TODO`로 표시됩니다.
  t.todo('이것은 할 일입니다.');
});
```

### `context.test([name][, options][, fn])` {#contexttestname-options-fn}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.8.0, v16.18.0 | `signal` 옵션 추가. |
| v18.7.0, v16.17.0 | `timeout` 옵션 추가. |
| v18.0.0, v16.17.0 | 다음에서 추가됨: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 하위 테스트의 이름이며, 테스트 결과를 보고할 때 표시됩니다. **기본값:** `fn`의 `name` 속성 또는 `fn`에 이름이 없는 경우 `'\<anonymous\>'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 하위 테스트에 대한 구성 옵션입니다. 다음 속성이 지원됩니다.
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 숫자가 제공되면 해당 수만큼의 테스트가 애플리케이션 스레드 내에서 병렬로 실행됩니다. `true`이면 모든 하위 테스트가 병렬로 실행됩니다. `false`이면 한 번에 하나의 테스트만 실행됩니다. 지정되지 않은 경우 하위 테스트는 이 값을 부모로부터 상속받습니다. **기본값:** `null`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 참이고 테스트 컨텍스트가 `only` 테스트를 실행하도록 구성된 경우 이 테스트가 실행됩니다. 그렇지 않으면 테스트가 건너뜁니다. **기본값:** `false`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 테스트를 중단할 수 있습니다.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 참이면 테스트가 건너뜁니다. 문자열이 제공되면 해당 문자열이 테스트 결과를 테스트를 건너뛰는 이유로 표시됩니다. **기본값:** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 참이면 테스트가 `TODO`로 표시됩니다. 문자열이 제공되면 해당 문자열이 테스트 결과를 테스트가 `TODO`인 이유로 표시됩니다. **기본값:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트가 실패할 때까지의 밀리초 수입니다. 지정되지 않은 경우 하위 테스트는 이 값을 부모로부터 상속받습니다. **기본값:** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 테스트에서 실행될 것으로 예상되는 어설션 및 하위 테스트의 수입니다. 테스트에서 실행되는 어설션 수가 계획에 지정된 수와 일치하지 않으면 테스트가 실패합니다. **기본값:** `undefined`.


- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) 테스트 중인 함수입니다. 이 함수의 첫 번째 인수는 [`TestContext`](/ko/nodejs/api/test#class-testcontext) 객체입니다. 테스트가 콜백을 사용하는 경우 콜백 함수가 두 번째 인수로 전달됩니다. **기본값:** no-op 함수.
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 테스트가 완료되면 `undefined`로 이행됩니다.

이 함수는 현재 테스트에서 하위 테스트를 만드는 데 사용됩니다. 이 함수는 최상위 [`test()`](/ko/nodejs/api/test#testname-options-fn) 함수와 동일한 방식으로 작동합니다.

```js [ESM]
test('최상위 테스트', async (t) => {
  await t.test(
    '이것은 하위 테스트입니다.',
    { only: false, skip: false, concurrency: 1, todo: false, plan: 1 },
    (t) => {
      t.assert.ok('관련 어설션이 여기에 있습니다.');
    },
  );
});
```

## 클래스: `SuiteContext` {#class-suitecontext}

**추가된 버전: v18.7.0, v16.17.0**

`SuiteContext`의 인스턴스는 테스트 러너와 상호 작용하기 위해 각 스위트 함수에 전달됩니다. 그러나 `SuiteContext` 생성자는 API의 일부로 노출되지 않습니다.

### `context.filePath` {#contextfilepath_1}

**추가된 버전: v22.6.0**

현재 스위트를 생성한 테스트 파일의 절대 경로입니다. 테스트 파일이 스위트를 생성하는 추가 모듈을 가져오는 경우, 가져온 스위트는 루트 테스트 파일의 경로를 반환합니다.

### `context.name` {#contextname_1}

**추가된 버전: v18.8.0, v16.18.0**

스위트의 이름입니다.

### `context.signal` {#contextsignal_1}

**추가된 버전: v18.7.0, v16.17.0**

- 유형: [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)

테스트가 중단되었을 때 테스트 하위 작업을 중단하는 데 사용할 수 있습니다.

