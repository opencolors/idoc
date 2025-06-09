---
title: Node.js Assert 모듈 문서
description: Node.js의 Assert 모듈은 불변성을 테스트하기 위한 간단한 어설션 테스트 세트를 제공합니다. 이 문서는 Node.js에서 assert 모듈의 사용법, 메서드 및 예제를 다룹니다.
head:
  - - meta
    - name: og:title
      content: Node.js Assert 모듈 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 Assert 모듈은 불변성을 테스트하기 위한 간단한 어설션 테스트 세트를 제공합니다. 이 문서는 Node.js에서 assert 모듈의 사용법, 메서드 및 예제를 다룹니다.
  - - meta
    - name: twitter:title
      content: Node.js Assert 모듈 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 Assert 모듈은 불변성을 테스트하기 위한 간단한 어설션 테스트 세트를 제공합니다. 이 문서는 Node.js에서 assert 모듈의 사용법, 메서드 및 예제를 다룹니다.
---


# 어설션 {#assert}

::: tip [안정됨: 2 - 안정됨]
[안정됨: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

**소스 코드:** [lib/assert.js](https://github.com/nodejs/node/blob/v23.5.0/lib/assert.js)

`node:assert` 모듈은 불변성을 검증하기 위한 어설션 함수 집합을 제공합니다.

## 엄격 어설션 모드 {#strict-assertion-mode}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | `require('node:assert/strict')`로 노출됨. |
| v13.9.0, v12.16.2 | "엄격 모드"를 "엄격 어설션 모드"로, "레거시 모드"를 "레거시 어설션 모드"로 변경하여 "엄격 모드"의 일반적인 의미와의 혼동을 피함. |
| v9.9.0 | 엄격 어설션 모드에 오류 차이점을 추가함. |
| v9.9.0 | 어설트 모듈에 엄격 어설션 모드를 추가함. |
| v9.9.0 | 추가됨: v9.9.0 |
:::

엄격 어설션 모드에서 비엄격 메서드는 해당 엄격 메서드처럼 동작합니다. 예를 들어, [`assert.deepEqual()`](/ko/nodejs/api/assert#assertdeepequalactual-expected-message)은 [`assert.deepStrictEqual()`](/ko/nodejs/api/assert#assertdeepstrictequalactual-expected-message)처럼 동작합니다.

엄격 어설션 모드에서 객체에 대한 오류 메시지는 차이점을 표시합니다. 레거시 어설션 모드에서 객체에 대한 오류 메시지는 객체를 표시하며, 종종 잘립니다.

엄격 어설션 모드를 사용하려면:

::: code-group
```js [ESM]
import { strict as assert } from 'node:assert';
```

```js [CJS]
const assert = require('node:assert').strict;
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';
```

```js [CJS]
const assert = require('node:assert/strict');
```
:::

오류 차이점 예시:

::: code-group
```js [ESM]
import { strict as assert } from 'node:assert';

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
```

```js [CJS]
const assert = require('node:assert/strict');

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
```
:::

색상을 비활성화하려면 `NO_COLOR` 또는 `NODE_DISABLE_COLORS` 환경 변수를 사용하십시오. 이렇게 하면 REPL에서도 색상이 비활성화됩니다. 터미널 환경의 색상 지원에 대한 자세한 내용은 tty [`getColorDepth()`](/ko/nodejs/api/tty#writestreamgetcolordepthenv) 문서를 참조하십시오.


## 레거시 어설션 모드 {#legacy-assertion-mode}

레거시 어설션 모드는 다음에서 [`==` 연산자](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality)를 사용합니다.

- [`assert.deepEqual()`](/ko/nodejs/api/assert#assertdeepequalactual-expected-message)
- [`assert.equal()`](/ko/nodejs/api/assert#assertequalactual-expected-message)
- [`assert.notDeepEqual()`](/ko/nodejs/api/assert#assertnotdeepequalactual-expected-message)
- [`assert.notEqual()`](/ko/nodejs/api/assert#assertnotequalactual-expected-message)

레거시 어설션 모드를 사용하려면:

::: code-group
```js [ESM]
import assert from 'node:assert';
```

```js [CJS]
const assert = require('node:assert');
```
:::

레거시 어설션 모드는 특히 [`assert.deepEqual()`](/ko/nodejs/api/assert#assertdeepequalactual-expected-message)을 사용할 때 놀라운 결과를 초래할 수 있습니다.

```js [CJS]
// 경고: 레거시 어설션 모드에서는 AssertionError가 발생하지 않습니다!
assert.deepEqual(/a/gi, new Date());
```
## 클래스: assert.AssertionError {#class-assertassertionerror}

- 확장: [\<errors.Error\>](/ko/nodejs/api/errors#class-error)

어설션 실패를 나타냅니다. `node:assert` 모듈에서 throw되는 모든 오류는 `AssertionError` 클래스의 인스턴스입니다.

### `new assert.AssertionError(options)` {#new-assertassertionerroroptions}

**추가된 버전: v0.1.21**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 제공된 경우 오류 메시지가 이 값으로 설정됩니다.
    - `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 오류 인스턴스의 `actual` 속성입니다.
    - `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 오류 인스턴스의 `expected` 속성입니다.
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 오류 인스턴스의 `operator` 속성입니다.
    - `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 제공된 경우 생성된 스택 추적은 이 함수 이전의 프레임을 생략합니다.


어설션 실패를 나타내는 `Error`의 서브클래스입니다.

모든 인스턴스에는 내장된 `Error` 속성(`message` 및 `name`)이 포함되어 있으며 다음이 포함됩니다.

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) [`assert.strictEqual()`](/ko/nodejs/api/assert#assertstrictequalactual-expected-message)과 같은 메서드의 `actual` 인수로 설정됩니다.
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) [`assert.strictEqual()`](/ko/nodejs/api/assert#assertstrictequalactual-expected-message)과 같은 메서드의 `expected` 값으로 설정됩니다.
- `generatedMessage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 메시지가 자동 생성되었는지(`true`) 여부를 나타냅니다.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 오류가 어설션 오류임을 나타내기 위해 값은 항상 `ERR_ASSERTION`입니다.
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 전달된 연산자 값으로 설정됩니다.

::: code-group
```js [ESM]
import assert from 'node:assert';

// 오류 메시지를 나중에 비교하기 위해 AssertionError를 생성합니다.
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// 오류 출력을 확인합니다.
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
```

```js [CJS]
const assert = require('node:assert');

// 오류 메시지를 나중에 비교하기 위해 AssertionError를 생성합니다.
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// 오류 출력을 확인합니다.
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
```
:::

## 클래스: `assert.CallTracker` {#class-assertcalltracker}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.1.0 | `assert.CallTracker` 클래스가 더 이상 사용되지 않으며 이후 버전에서 제거될 예정입니다. |
| v14.2.0, v12.19.0 | 추가됨: v14.2.0, v12.19.0 |
:::

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음
:::

이 기능은 더 이상 사용되지 않으며 이후 버전에서 제거될 예정입니다. [`mock`](/ko/nodejs/api/test#mocking) 헬퍼 함수와 같은 대안을 사용하는 것이 좋습니다.

### `new assert.CallTracker()` {#new-assertcalltracker}

**추가됨: v14.2.0, v12.19.0**

함수가 특정 횟수만큼 호출되었는지 추적하는 데 사용할 수 있는 새로운 [`CallTracker`](/ko/nodejs/api/assert#class-assertcalltracker) 객체를 만듭니다. 확인을 수행하려면 `tracker.verify()`를 호출해야 합니다. 일반적인 패턴은 [`process.on('exit')`](/ko/nodejs/api/process#event-exit) 핸들러에서 호출하는 것입니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
import process from 'node:process';

const tracker = new assert.CallTracker();

function func() {}

// callsfunc()는 tracker.verify() 전에 정확히 1번 호출되어야 합니다.
const callsfunc = tracker.calls(func, 1);

callsfunc();

// tracker.verify()를 호출하고 모든 tracker.calls() 함수가 정확한 횟수만큼
// 호출되었는지 확인합니다.
process.on('exit', () => {
  tracker.verify();
});
```

```js [CJS]
const assert = require('node:assert');
const process = require('node:process');

const tracker = new assert.CallTracker();

function func() {}

// callsfunc()는 tracker.verify() 전에 정확히 1번 호출되어야 합니다.
const callsfunc = tracker.calls(func, 1);

callsfunc();

// tracker.verify()를 호출하고 모든 tracker.calls() 함수가 정확한 횟수만큼
// 호출되었는지 확인합니다.
process.on('exit', () => {
  tracker.verify();
});
```
:::

### `tracker.calls([fn][, exact])` {#trackercallsfn-exact}

**추가됨: v14.2.0, v12.19.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **기본값:** 아무 작업도 수행하지 않는 함수.
- `exact` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `1`.
- 반환: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `fn`을 래핑하는 함수.

래퍼 함수는 정확히 `exact`번 호출될 것으로 예상됩니다. [`tracker.verify()`](/ko/nodejs/api/assert#trackerverify)가 호출될 때 함수가 정확히 `exact`번 호출되지 않은 경우 [`tracker.verify()`](/ko/nodejs/api/assert#trackerverify)는 오류를 발생시킵니다.

::: code-group
```js [ESM]
import assert from 'node:assert';

// 호출 추적기를 만듭니다.
const tracker = new assert.CallTracker();

function func() {}

// tracker.verify() 전에 정확한 횟수만큼 호출해야 하는 func()를 래핑하는 함수를
// 반환합니다.
const callsfunc = tracker.calls(func);
```

```js [CJS]
const assert = require('node:assert');

// 호출 추적기를 만듭니다.
const tracker = new assert.CallTracker();

function func() {}

// tracker.verify() 전에 정확한 횟수만큼 호출해야 하는 func()를 래핑하는 함수를
// 반환합니다.
const callsfunc = tracker.calls(func);
```
:::


### `tracker.getCalls(fn)` {#trackergetcallsfn}

**추가된 버전: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환값: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 추적된 함수에 대한 모든 호출이 있는 배열입니다.
- 객체 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 추적된 함수에 전달된 인수

::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
```

```js [CJS]
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
```
:::

### `tracker.report()` {#trackerreport}

**추가된 버전: v14.2.0, v12.19.0**

- 반환값: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) [`tracker.calls()`](/ko/nodejs/api/assert#trackercallsfn-exact)에서 반환된 래퍼 함수에 대한 정보가 포함된 객체 배열입니다.
- 객체 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `actual` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 함수가 호출된 실제 횟수입니다.
    - `expected` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 함수가 호출될 것으로 예상된 횟수입니다.
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 래핑된 함수의 이름입니다.
    - `stack` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 함수의 스택 추적입니다.

배열에는 예상 횟수만큼 호출되지 않은 함수의 예상 및 실제 호출 횟수에 대한 정보가 포함되어 있습니다.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Returns an array containing information on callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
```

```js [CJS]
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Returns an array containing information on callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
```
:::


### `tracker.reset([fn])` {#trackerresetfn}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 재설정할 추적된 함수입니다.

호출 트래커의 호출을 재설정합니다. 추적된 함수가 인수로 전달되면 해당 함수에 대한 호출이 재설정됩니다. 인수가 전달되지 않으면 추적된 모든 함수가 재설정됩니다.

::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// 트래커가 한 번 호출되었습니다.
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```

```js [CJS]
const assert = require('node:assert');

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// 트래커가 한 번 호출되었습니다.
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```
:::

### `tracker.verify()` {#trackerverify}

**Added in: v14.2.0, v12.19.0**

[`tracker.calls()`](/ko/nodejs/api/assert#trackercallsfn-exact)에 전달된 함수 목록을 반복하고 예상 횟수만큼 호출되지 않은 함수에 대해 오류를 발생시킵니다.

::: code-group
```js [ESM]
import assert from 'node:assert';

// 호출 트래커를 만듭니다.
const tracker = new assert.CallTracker();

function func() {}

// tracker.verify() 전에 정확한 횟수만큼 호출해야 하는 func()을 래핑하는 함수를 반환합니다.
const callsfunc = tracker.calls(func, 2);

callsfunc();

// callsfunc()가 한 번만 호출되었으므로 오류를 발생시킵니다.
tracker.verify();
```

```js [CJS]
const assert = require('node:assert');

// 호출 트래커를 만듭니다.
const tracker = new assert.CallTracker();

function func() {}

// tracker.verify() 전에 정확한 횟수만큼 호출해야 하는 func()을 래핑하는 함수를 반환합니다.
const callsfunc = tracker.calls(func, 2);

callsfunc();

// callsfunc()가 한 번만 호출되었으므로 오류를 발생시킵니다.
tracker.verify();
```
:::


## `assert(value[, message])` {#assertvalue-message}

**Added in: v0.5.9**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 참인지 확인되는 입력.
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`assert.ok()`](/ko/nodejs/api/assert#assertokvalue-message)의 별칭입니다.

## `assert.deepEqual(actual, expected[, message])` {#assertdeepequalactual-expected-message}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.2.0, v20.15.0 | 오류 원인과 errors 속성도 이제 비교됩니다. |
| v18.0.0 | 정규 표현식 lastIndex 속성도 이제 비교됩니다. |
| v16.0.0, v14.18.0 | 레거시 어설션 모드에서, 상태가 Deprecated에서 Legacy로 변경되었습니다. |
| v14.0.0 | NaN은 이제 양쪽 모두 NaN인 경우 동일한 것으로 간주됩니다. |
| v12.0.0 | 이제 타입 태그가 올바르게 비교되며, 확인이 덜 놀랍도록 몇 가지 사소한 비교 조정이 있습니다. |
| v9.0.0 | 이제 `Error` 이름과 메시지가 올바르게 비교됩니다. |
| v8.0.0 | 이제 `Set` 및 `Map` 콘텐츠도 비교됩니다. |
| v6.4.0, v4.7.1 | 이제 Typed 배열 슬라이스가 올바르게 처리됩니다. |
| v6.1.0, v4.5.0 | 이제 순환 참조가 있는 객체를 입력으로 사용할 수 있습니다. |
| v5.10.1, v4.4.3 | 비-`Uint8Array` Typed 배열을 올바르게 처리합니다. |
| v0.1.21 | Added in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**엄격한 어설션 모드**

[`assert.deepStrictEqual()`](/ko/nodejs/api/assert#assertdeepstrictequalactual-expected-message)의 별칭입니다.

**레거시 어설션 모드**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ko/nodejs/api/documentation#stability-index) [Stability: 3](/ko/nodejs/api/documentation#stability-index) - Legacy: 대신 [`assert.deepStrictEqual()`](/ko/nodejs/api/assert#assertdeepstrictequalactual-expected-message)을 사용하십시오.
:::

`actual` 및 `expected` 매개변수 간의 깊은 동등성을 테스트합니다. 대신 [`assert.deepStrictEqual()`](/ko/nodejs/api/assert#assertdeepstrictequalactual-expected-message)을 사용하는 것을 고려하십시오. [`assert.deepEqual()`](/ko/nodejs/api/assert#assertdeepequalactual-expected-message)은 놀라운 결과를 가져올 수 있습니다.

*깊은 동등성*은 하위 객체의 열거 가능한 "자체" 속성도 다음 규칙에 따라 재귀적으로 평가됨을 의미합니다.


### 비교 세부 사항 {#comparison-details}

- 기본값은 `NaN`을 제외하고 [`==` 연산자](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality)로 비교됩니다. 양쪽 모두 `NaN`인 경우 동일한 것으로 취급됩니다.
- 객체의 [타입 태그](https://tc39.github.io/ecma262/#sec-object.prototype.tostring)는 동일해야 합니다.
- [열거 가능한 "own" 속성](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)만 고려됩니다.
- [`Error`](/ko/nodejs/api/errors#class-error) 이름, 메시지, 원인 및 오류는 열거 가능한 속성이 아니더라도 항상 비교됩니다.
- [객체 래퍼](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript)는 객체 및 래핑 해제된 값으로 모두 비교됩니다.
- `Object` 속성은 순서 없이 비교됩니다.
- [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 키와 [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 항목은 순서 없이 비교됩니다.
- 재귀는 양쪽이 다르거나 양쪽 모두 순환 참조를 만날 때 중지됩니다.
- 구현은 객체의 [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots)을 테스트하지 않습니다.
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 속성은 비교되지 않습니다.
- [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 및 [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 비교는 값에 의존하지 않고 인스턴스에만 의존합니다.
- [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) lastIndex, flags 및 source는 열거 가능한 속성이 아니더라도 항상 비교됩니다.

다음 예제는 기본값이 [`==` 연산자](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality)를 사용하여 비교되기 때문에 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)를 발생시키지 않습니다.

::: code-group
```js [ESM]
import assert from 'node:assert';
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
```

```js [CJS]
const assert = require('node:assert');
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
```
:::

"Deep" equality는 자식 객체의 열거 가능한 "own" 속성도 평가된다는 의미입니다.

::: code-group
```js [ESM]
import assert from 'node:assert';

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
```

```js [CJS]
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
```
:::

값이 같지 않으면 `message` 속성이 `message` 매개변수의 값과 동일하게 설정된 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)가 발생합니다. `message` 매개변수가 정의되지 않은 경우 기본 오류 메시지가 할당됩니다. `message` 매개변수가 [`Error`](/ko/nodejs/api/errors#class-error)의 인스턴스인 경우 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror) 대신 발생합니다.


## `assert.deepStrictEqual(actual, expected[, message])` {#assertdeepstrictequalactual-expected-message}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v22.2.0, v20.15.0 | 오류 원인 및 errors 속성도 비교됩니다. |
| v18.0.0 | 정규 표현식 lastIndex 속성도 비교됩니다. |
| v9.0.0 | 열거 가능한 심볼 속성이 이제 비교됩니다. |
| v9.0.0 | `NaN`이 이제 [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero) 비교를 사용하여 비교됩니다. |
| v8.5.0 | `Error` 이름과 메시지가 이제 올바르게 비교됩니다. |
| v8.0.0 | `Set` 및 `Map` 콘텐츠도 비교됩니다. |
| v6.1.0 | 순환 참조가 있는 객체를 이제 입력으로 사용할 수 있습니다. |
| v6.4.0, v4.7.1 | 유형화된 배열 슬라이스가 이제 올바르게 처리됩니다. |
| v5.10.1, v4.4.3 | 비-`Uint8Array` 유형화된 배열을 올바르게 처리합니다. |
| v1.2.0 | 추가됨: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`actual` 및 `expected` 매개변수 간의 깊은 동일성을 테스트합니다. "깊은" 동일성은 하위 객체의 열거 가능한 "자체" 속성이 다음 규칙에 따라 재귀적으로 평가됨을 의미합니다.

### 비교 세부 정보 {#comparison-details_1}

- 원시 값은 [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)를 사용하여 비교됩니다.
- 객체의 [타입 태그](https://tc39.github.io/ecma262/#sec-object.prototype.tostring)는 동일해야 합니다.
- 객체의 [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots)은 [`=== 연산자`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)를 사용하여 비교됩니다.
- [열거 가능한 "자체" 속성](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)만 고려됩니다.
- [`Error`](/ko/nodejs/api/errors#class-error) 이름, 메시지, 원인 및 오류는 열거 가능한 속성이 아니더라도 항상 비교됩니다. `errors`도 비교됩니다.
- 열거 가능한 자체 [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 속성도 비교됩니다.
- [객체 래퍼](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript)는 객체와 언래핑된 값으로 모두 비교됩니다.
- `Object` 속성은 순서 없이 비교됩니다.
- [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 키와 [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 항목은 순서 없이 비교됩니다.
- 재귀는 양쪽 모두 다르거나 양쪽 모두 순환 참조를 만날 때 중지됩니다.
- [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 및 [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 비교는 해당 값에 의존하지 않습니다. 자세한 내용은 아래를 참조하세요.
- [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) lastIndex, flags 및 source는 열거 가능한 속성이 아니더라도 항상 비교됩니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// 1 !== '1'이므로 실패합니다.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// 다음 객체에는 자체 속성이 없습니다.
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// 다른 [[Prototype]]:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// 다른 타입 태그:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// Object.is(NaN, NaN)가 true이므로 OK입니다.

// 다른 언래핑된 숫자:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// 객체와 문자열이 언래핑될 때 동일하므로 OK입니다.

assert.deepStrictEqual(-0, -0);
// OK

// 다른 0:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// 두 객체 모두에서 동일한 심볼이므로 OK입니다.

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   [Symbol()]: 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, {}]]);
const weakMap3 = new WeakMap();
weakMap3.unequal = true;

assert.deepStrictEqual(weakMap1, weakMap2);
// 항목을 비교하는 것이 불가능하므로 OK입니다.

// weakMap3에는 weakMap1에 없는 속성이 있으므로 실패합니다.
assert.deepStrictEqual(weakMap1, weakMap3);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   WeakMap {
// +   [items unknown]
// -   [items unknown],
// -   unequal: true
//   }
```

```js [CJS]
const assert = require('node:assert/strict');

// 1 !== '1'이므로 실패합니다.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// 다음 객체에는 자체 속성이 없습니다.
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// 다른 [[Prototype]]:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// 다른 타입 태그:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// Object.is(NaN, NaN)가 true이므로 OK입니다.

// 다른 언래핑된 숫자:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// 객체와 문자열이 언래핑될 때 동일하므로 OK입니다.

assert.deepStrictEqual(-0, -0);
// OK

// 다른 0:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// 두 객체 모두에서 동일한 심볼이므로 OK입니다.

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   [Symbol()]: 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, {}]]);
const weakMap3 = new WeakMap();
weakMap3.unequal = true;

assert.deepStrictEqual(weakMap1, weakMap2);
// 항목을 비교하는 것이 불가능하므로 OK입니다.

// weakMap3에는 weakMap1에 없는 속성이 있으므로 실패합니다.
assert.deepStrictEqual(weakMap1, weakMap3);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   WeakMap {
// +   [items unknown]
// -   [items unknown],
// -   unequal: true
//   }
```
:::

값이 같지 않으면 `message` 속성이 `message` 매개변수 값과 같은 값으로 설정된 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)가 throw됩니다. `message` 매개변수가 정의되지 않은 경우 기본 오류 메시지가 할당됩니다. `message` 매개변수가 [`Error`](/ko/nodejs/api/errors#class-error)의 인스턴스인 경우 `AssertionError` 대신 throw됩니다.


## `assert.doesNotMatch(string, regexp[, message])` {#assertdoesnotmatchstring-regexp-message}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v13.6.0, v12.16.0 | 추가됨: v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`string` 입력이 정규 표현식과 일치하지 않을 것으로 예상합니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: 입력이 일치하지 않을 것으로 예상되었습니다. ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: "string" 인수는 string 유형이어야 합니다.

assert.doesNotMatch('I will pass', /different/);
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: 입력이 일치하지 않을 것으로 예상되었습니다. ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: "string" 인수는 string 유형이어야 합니다.

assert.doesNotMatch('I will pass', /different/);
// OK
```
:::

값이 일치하거나 `string` 인수가 `string` 유형이 아닌 경우 `message` 속성이 `message` 매개변수의 값과 동일하게 설정된 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)가 발생합니다. `message` 매개변수가 정의되지 않은 경우 기본 오류 메시지가 할당됩니다. `message` 매개변수가 [`Error`](/ko/nodejs/api/errors#class-error)의 인스턴스인 경우 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror) 대신 해당 인스턴스가 발생합니다.

## `assert.doesNotReject(asyncFn[, error][, message])` {#assertdoesnotrejectasyncfn-error-message}

**추가됨: v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`asyncFn` 프로미스를 기다리거나, `asyncFn`이 함수인 경우 즉시 함수를 호출하고 반환된 프로미스가 완료될 때까지 기다립니다. 그런 다음 프로미스가 거부되지 않았는지 확인합니다.

`asyncFn`이 함수이고 오류를 동기적으로 발생시키면 `assert.doesNotReject()`는 해당 오류와 함께 거부된 `Promise`를 반환합니다. 함수가 프로미스를 반환하지 않으면 `assert.doesNotReject()`는 [`ERR_INVALID_RETURN_VALUE`](/ko/nodejs/api/errors#err_invalid_return_value) 오류와 함께 거부된 `Promise`를 반환합니다. 두 경우 모두 오류 처리기가 건너뜁니다.

`assert.doesNotReject()`를 사용하는 것은 실제로 유용하지 않습니다. 거부를 포착한 다음 다시 거부하는 것은 거의 이점이 없기 때문입니다. 대신 거부해서는 안 되는 특정 코드 경로 옆에 주석을 추가하고 오류 메시지를 가능한 한 명확하게 유지하는 것을 고려하십시오.

지정된 경우 `error`는 [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) 또는 유효성 검사 함수일 수 있습니다. 자세한 내용은 [`assert.throws()`](/ko/nodejs/api/assert#assertthrowsfn-error-message)를 참조하십시오.

완료를 기다리는 비동기적 특성 외에도 [`assert.doesNotThrow()`](/ko/nodejs/api/assert#assertdoesnotthrowfn-error-message)와 동일하게 작동합니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.doesNotReject(
  async () => {
    throw new TypeError('잘못된 값');
  },
  SyntaxError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.doesNotReject(
    async () => {
      throw new TypeError('잘못된 값');
    },
    SyntaxError,
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotReject(Promise.reject(new TypeError('잘못된 값')))
  .then(() => {
    // ...
  });
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotReject(Promise.reject(new TypeError('잘못된 값')))
  .then(() => {
    // ...
  });
```
:::


## `assert.doesNotThrow(fn[, error][, message])` {#assertdoesnotthrowfn-error-message}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v5.11.0, v4.4.5 | 이제 `message` 매개변수가 적용됩니다. |
| v4.2.0 | `error` 매개변수가 이제 화살표 함수가 될 수 있습니다. |
| v0.1.21 | 추가됨: v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

함수 `fn`이 오류를 발생시키지 않는다고 주장합니다.

`assert.doesNotThrow()`를 사용하는 것은 오류를 잡았다가 다시 던지는 이점이 없기 때문에 실제로 유용하지 않습니다. 대신 오류를 발생시키지 않아야 하는 특정 코드 경로 옆에 주석을 추가하고 오류 메시지를 가능한 한 표현력 있게 유지하는 것이 좋습니다.

`assert.doesNotThrow()`가 호출되면 즉시 `fn` 함수를 호출합니다.

오류가 발생하고 `error` 매개변수로 지정된 것과 동일한 유형인 경우 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)가 발생합니다. 오류가 다른 유형이거나 `error` 매개변수가 정의되지 않은 경우 오류는 호출자에게 다시 전파됩니다.

지정된 경우 `error`는 [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) 또는 유효성 검사 함수일 수 있습니다. 자세한 내용은 [`assert.throws()`](/ko/nodejs/api/assert#assertthrowsfn-error-message)를 참조하십시오.

예를 들어 다음은 어설션에 일치하는 오류 유형이 없기 때문에 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)를 발생시킵니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('잘못된 값');
  },
  SyntaxError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('잘못된 값');
  },
  SyntaxError,
);
```
:::

그러나 다음은 '원치 않는 예외가 발생했습니다...'라는 메시지와 함께 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)를 발생시킵니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('잘못된 값');
  },
  TypeError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('잘못된 값');
  },
  TypeError,
);
```
:::

[`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)가 발생하고 `message` 매개변수에 값이 제공되면 `message` 값이 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror) 메시지에 추가됩니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('잘못된 값');
  },
  /잘못된 값/,
  '이런',
);
// 발생: AssertionError: 원치 않는 예외가 발생했습니다: 이런
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('잘못된 값');
  },
  /잘못된 값/,
  '이런',
);
// 발생: AssertionError: 원치 않는 예외가 발생했습니다: 이런
```
:::


## `assert.equal(actual, expected[, message])` {#assertequalactual-expected-message}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0, v14.18.0 | 레거시 어설션 모드에서 상태가 더 이상 사용되지 않음에서 레거시로 변경되었습니다. |
| v14.0.0 | NaN은 이제 양쪽 모두 NaN인 경우 동일한 것으로 취급됩니다. |
| v0.1.21 | v0.1.21에 추가됨 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**엄격한 어설션 모드**

[`assert.strictEqual()`](/ko/nodejs/api/assert#assertstrictequalactual-expected-message)의 별칭입니다.

**레거시 어설션 모드**

::: info [안정성: 3 - 레거시]
[안정성: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시: 대신 [`assert.strictEqual()`](/ko/nodejs/api/assert#assertstrictequalactual-expected-message)을 사용하세요.
:::

[`==` 연산자](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality)를 사용하여 `actual` 및 `expected` 매개변수 간의 얕고 강제적인 동등성을 테스트합니다. `NaN`은 특별히 처리되며 양쪽 모두 `NaN`인 경우 동일한 것으로 취급됩니다.

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
```

```js [CJS]
const assert = require('node:assert');

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
```
:::

값이 같지 않으면 `message` 속성이 `message` 매개변수의 값과 같게 설정된 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)가 발생합니다. `message` 매개변수가 정의되지 않은 경우 기본 오류 메시지가 할당됩니다. `message` 매개변수가 [`Error`](/ko/nodejs/api/errors#class-error)의 인스턴스인 경우 `AssertionError` 대신 발생합니다.


## `assert.fail([message])` {#assertfailmessage}

**Added in: v0.1.21**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) **기본:** `'Failed'`

제공된 오류 메시지 또는 기본 오류 메시지와 함께 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)를 발생시킵니다. `message` 매개변수가 [`Error`](/ko/nodejs/api/errors#class-error)의 인스턴스인 경우 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror) 대신 발생합니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
```

```js [CJS]
const assert = require('node:assert/strict');

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
```
:::

두 개 이상의 인수를 사용하여 `assert.fail()`을 사용하는 것은 가능하지만 더 이상 사용되지 않습니다. 자세한 내용은 아래를 참조하십시오.

## `assert.fail(actual, expected[, message[, operator[, stackStartFn]]])` {#assertfailactual-expected-message-operator-stackstartfn}

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | 둘 이상의 인수로 `assert.fail()`을 호출하는 것은 더 이상 사용되지 않으며 경고를 발생시킵니다. |
| v0.1.21 | Added in: v0.1.21 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [Stability: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음: 대신 `assert.fail([message])` 또는 다른 assert 함수를 사용하십시오.
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본:** `'!='`
- `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **기본:** `assert.fail`

`message`가 falsy인 경우 오류 메시지는 제공된 `operator`로 구분된 `actual` 및 `expected` 값으로 설정됩니다. 두 개의 `actual` 및 `expected` 인수만 제공되는 경우 `operator`는 기본적으로 `'!='`가 됩니다. `message`가 세 번째 인수로 제공되면 오류 메시지로 사용되고 다른 인수는 throw된 객체의 속성으로 저장됩니다. `stackStartFn`이 제공되면 해당 함수 위의 모든 스택 프레임이 스택 추적에서 제거됩니다 ([`/api/errors#errorcapturestacktracetargetobject-constructoropt`](/ko/nodejs/api/errors#errorcapturestacktracetargetobject-constructoropt) 참조). 인수가 제공되지 않으면 기본 메시지 `Failed`가 사용됩니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.fail('a', 'b');
// AssertionError [ERR_ASSERTION]: 'a' != 'b'

assert.fail(1, 2, undefined, '>');
// AssertionError [ERR_ASSERTION]: 1 > 2

assert.fail(1, 2, 'fail');
// AssertionError [ERR_ASSERTION]: fail

assert.fail(1, 2, 'whoops', '>');
// AssertionError [ERR_ASSERTION]: whoops

assert.fail(1, 2, new TypeError('need array'));
// TypeError: need array
```

```js [CJS]
const assert = require('node:assert/strict');

assert.fail('a', 'b');
// AssertionError [ERR_ASSERTION]: 'a' != 'b'

assert.fail(1, 2, undefined, '>');
// AssertionError [ERR_ASSERTION]: 1 > 2

assert.fail(1, 2, 'fail');
// AssertionError [ERR_ASSERTION]: fail

assert.fail(1, 2, 'whoops', '>');
// AssertionError [ERR_ASSERTION]: whoops

assert.fail(1, 2, new TypeError('need array'));
// TypeError: need array
```
:::

마지막 세 가지 경우에서 `actual`, `expected` 및 `operator`는 오류 메시지에 영향을 미치지 않습니다.

예외의 스택 추적을 잘라내기 위한 `stackStartFn`의 사용 예:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

function suppressFrame() {
  assert.fail('a', 'b', undefined, '!==', suppressFrame);
}
suppressFrame();
// AssertionError [ERR_ASSERTION]: 'a' !== 'b'
//     at repl:1:1
//     at ContextifyScript.Script.runInThisContext (vm.js:44:33)
//     ...
```

```js [CJS]
const assert = require('node:assert/strict');

function suppressFrame() {
  assert.fail('a', 'b', undefined, '!==', suppressFrame);
}
suppressFrame();
// AssertionError [ERR_ASSERTION]: 'a' !== 'b'
//     at repl:1:1
//     at ContextifyScript.Script.runInThisContext (vm.js:44:33)
//     ...
```
:::


## `assert.ifError(value)` {#assertiferrorvalue}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 원래 오류를 발생시키는 대신 전체 스택 추적을 포함하는 [`AssertionError`][]에 래핑됩니다. |
| v10.0.0 | 이제 `value`는 `undefined` 또는 `null`만 가능합니다. 이전에는 모든 거짓 값이 `null`과 동일하게 처리되었고 오류가 발생하지 않았습니다. |
| v0.1.97 | 다음에서 추가됨: v0.1.97 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`value`가 `undefined` 또는 `null`이 아니면 `value`를 발생시킵니다. 이는 콜백에서 `error` 인수를 테스트할 때 유용합니다. 스택 추적에는 `ifError()` 자체에 대한 잠재적인 새 프레임을 포함하여 `ifError()`에 전달된 오류의 모든 프레임이 포함됩니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error

// Create some random error frames.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: test error
//     at ifErrorFrame
//     at errorFrame
```

```js [CJS]
const assert = require('node:assert/strict');

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error

// Create some random error frames.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: test error
//     at ifErrorFrame
//     at errorFrame
```
:::


## `assert.match(string, regexp[, message])` {#assertmatchstring-regexp-message}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v13.6.0, v12.16.0 | 추가됨: v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`string` 입력이 정규 표현식과 일치할 것으로 예상합니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
```
:::

값이 일치하지 않거나 `string` 인수가 `string` 유형이 아닌 경우, [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)가 발생하고 `message` 속성이 `message` 매개 변수의 값과 같게 설정됩니다. `message` 매개 변수가 정의되지 않은 경우 기본 오류 메시지가 할당됩니다. `message` 매개 변수가 [`Error`](/ko/nodejs/api/errors#class-error)의 인스턴스인 경우 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror) 대신 발생합니다.

## `assert.notDeepEqual(actual, expected[, message])` {#assertnotdeepequalactual-expected-message}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0, v14.18.0 | 레거시 어설션 모드에서 상태가 더 이상 사용되지 않음에서 레거시로 변경되었습니다. |
| v14.0.0 | NaN은 이제 양쪽이 NaN인 경우 동일하게 취급됩니다. |
| v9.0.0 | `Error` 이름과 메시지가 이제 올바르게 비교됩니다. |
| v8.0.0 | `Set` 및 `Map` 콘텐츠도 비교됩니다. |
| v6.4.0, v4.7.1 | Typed array 슬라이스가 이제 올바르게 처리됩니다. |
| v6.1.0, v4.5.0 | 순환 참조가 있는 객체를 이제 입력으로 사용할 수 있습니다. |
| v5.10.1, v4.4.3 | non-`Uint8Array` typed array를 올바르게 처리합니다. |
| v0.1.21 | 추가됨: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**엄격한 어설션 모드**

[`assert.notDeepStrictEqual()`](/ko/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message)의 별칭입니다.

**레거시 어설션 모드**

::: info [안정성: 3 - 레거시]
[안정성: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시: 대신 [`assert.notDeepStrictEqual()`](/ko/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message)을 사용하세요.
:::

모든 깊은 불평등을 테스트합니다. [`assert.deepEqual()`](/ko/nodejs/api/assert#assertdeepequalactual-expected-message)의 반대입니다.

::: code-group
```js [ESM]
import assert from 'node:assert';

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
```

```js [CJS]
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
```
:::

값이 깊이 동일한 경우, [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)가 발생하고 `message` 속성이 `message` 매개 변수의 값과 같게 설정됩니다. `message` 매개 변수가 정의되지 않은 경우 기본 오류 메시지가 할당됩니다. `message` 매개 변수가 [`Error`](/ko/nodejs/api/errors#class-error)의 인스턴스인 경우 `AssertionError` 대신 발생합니다.


## `assert.notDeepStrictEqual(actual, expected[, message])` {#assertnotdeepstrictequalactual-expected-message}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v9.0.0 | `-0`과 `+0`은 더 이상 동일하게 간주되지 않습니다. |
| v9.0.0 | `NaN`은 이제 [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero) 비교를 사용하여 비교됩니다. |
| v9.0.0 | 이제 `Error` 이름과 메시지가 올바르게 비교됩니다. |
| v8.0.0 | `Set` 및 `Map` 콘텐츠도 비교됩니다. |
| v6.1.0 | 순환 참조가 있는 객체를 이제 입력으로 사용할 수 있습니다. |
| v6.4.0, v4.7.1 | 형식화된 배열 슬라이스가 이제 올바르게 처리됩니다. |
| v5.10.1, v4.4.3 | `Uint8Array`가 아닌 형식화된 배열을 올바르게 처리합니다. |
| v1.2.0 | 추가됨: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

엄격한 깊이 불일치를 테스트합니다. [`assert.deepStrictEqual()`](/ko/nodejs/api/assert#assertdeepstrictequalactual-expected-message)의 반대입니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
```
:::

값이 깊고 엄격하게 동일하면 `message` 속성이 `message` 매개변수의 값과 같게 설정된 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)가 발생합니다. `message` 매개변수가 정의되지 않은 경우 기본 오류 메시지가 할당됩니다. `message` 매개변수가 [`Error`](/ko/nodejs/api/errors#class-error)의 인스턴스인 경우 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror) 대신 throw됩니다.

## `assert.notEqual(actual, expected[, message])` {#assertnotequalactual-expected-message}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0, v14.18.0 | 레거시 어설션 모드에서 상태가 더 이상 사용되지 않음에서 레거시로 변경되었습니다. |
| v14.0.0 | 이제 NaN은 양쪽이 NaN인 경우 동일한 것으로 처리됩니다. |
| v0.1.21 | 추가됨: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**엄격한 어설션 모드**

[`assert.notStrictEqual()`](/ko/nodejs/api/assert#assertnotstrictequalactual-expected-message)의 별칭입니다.

**레거시 어설션 모드**

::: info [안정성: 3 - 레거시]
[안정성: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시: 대신 [`assert.notStrictEqual()`](/ko/nodejs/api/assert#assertnotstrictequalactual-expected-message)을 사용하십시오.
:::

[`!=` 연산자](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Inequality)를 사용하여 얕은 강제 불일치를 테스트합니다. `NaN`은 특별히 처리되며 양쪽이 `NaN`인 경우 동일한 것으로 취급됩니다.

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
```

```js [CJS]
const assert = require('node:assert');

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
```
:::

값이 같으면 `message` 속성이 `message` 매개변수의 값과 같게 설정된 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)가 발생합니다. `message` 매개변수가 정의되지 않은 경우 기본 오류 메시지가 할당됩니다. `message` 매개변수가 [`Error`](/ko/nodejs/api/errors#class-error)의 인스턴스인 경우 `AssertionError` 대신 throw됩니다.


## `assert.notStrictEqual(actual, expected[, message])` {#assertnotstrictequalactual-expected-message}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 사용된 비교가 엄격한 동일성에서 `Object.is()`로 변경되었습니다. |
| v0.1.21 | 추가됨: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)에 의해 결정된 `actual` 및 `expected` 매개변수 간의 엄격한 부등식을 테스트합니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: "actual"이 엄격하게 같지 않을 것으로 예상됨:
//
// 1

assert.notStrictEqual(1, '1');
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: "actual"이 엄격하게 같지 않을 것으로 예상됨:
//
// 1

assert.notStrictEqual(1, '1');
// OK
```
:::

값이 엄격하게 같으면 `message` 속성이 `message` 매개변수의 값과 같게 설정된 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)가 throw됩니다. `message` 매개변수가 정의되지 않은 경우 기본 오류 메시지가 할당됩니다. `message` 매개변수가 [`Error`](/ko/nodejs/api/errors#class-error)의 인스턴스인 경우 `AssertionError` 대신 throw됩니다.

## `assert.ok(value[, message])` {#assertokvalue-message}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | `assert.ok()`(인수 없음)는 이제 미리 정의된 오류 메시지를 사용합니다. |
| v0.1.21 | 추가됨: v0.1.21 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`value`가 참 같은 값인지 테스트합니다. 이는 `assert.equal(!!value, true, message)`과 같습니다.

`value`가 참 같은 값이 아니면 `message` 속성이 `message` 매개변수의 값과 같게 설정된 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)가 throw됩니다. `message` 매개변수가 `undefined`이면 기본 오류 메시지가 할당됩니다. `message` 매개변수가 [`Error`](/ko/nodejs/api/errors#class-error)의 인스턴스인 경우 `AssertionError` 대신 throw됩니다. 인수가 전혀 전달되지 않으면 `message`는 문자열 `'No value argument passed to `assert.ok()`'`로 설정됩니다.

`repl`에서 오류 메시지가 파일에서 throw되는 오류 메시지와 다를 수 있다는 점에 유의하십시오! 자세한 내용은 아래를 참조하십시오.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.ok(true);
// OK
assert.ok(1);
// OK

assert.ok();
// AssertionError: `assert.ok()`에 값 인수가 전달되지 않았습니다.

assert.ok(false, '거짓입니다.');
// AssertionError: 거짓입니다.

// repl에서:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// 파일에서 (예: test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: 표현식이 거짓 같은 값으로 평가되었습니다.
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: 표현식이 거짓 같은 값으로 평가되었습니다.
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: 표현식이 거짓 같은 값으로 평가되었습니다.
//
//   assert.ok(0)
```

```js [CJS]
const assert = require('node:assert/strict');

assert.ok(true);
// OK
assert.ok(1);
// OK

assert.ok();
// AssertionError: `assert.ok()`에 값 인수가 전달되지 않았습니다.

assert.ok(false, '거짓입니다.');
// AssertionError: 거짓입니다.

// repl에서:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// 파일에서 (예: test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: 표현식이 거짓 같은 값으로 평가되었습니다.
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: 표현식이 거짓 같은 값으로 평가되었습니다.
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: 표현식이 거짓 같은 값으로 평가되었습니다.
//
//   assert.ok(0)
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// `assert()`를 사용하는 것도 동일하게 작동합니다.
assert(0);
// AssertionError: 표현식이 거짓 같은 값으로 평가되었습니다.
//
//   assert(0)
```

```js [CJS]
const assert = require('node:assert');

// `assert()`를 사용하는 것도 동일하게 작동합니다.
assert(0);
// AssertionError: 표현식이 거짓 같은 값으로 평가되었습니다.
//
//   assert(0)
```
:::


## `assert.rejects(asyncFn[, error][, message])` {#assertrejectsasyncfn-error-message}

**추가된 버전: v10.0.0**

- `asyncFn` [\<함수\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<함수\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<객체\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<오류\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type)

`asyncFn` 프로미스를 대기하거나, `asyncFn`이 함수인 경우 즉시 함수를 호출하고 반환된 프로미스가 완료될 때까지 기다립니다. 그런 다음 프로미스가 거부되는지 확인합니다.

`asyncFn`이 함수이고 오류를 동기적으로 발생시키는 경우 `assert.rejects()`는 해당 오류와 함께 거부된 `Promise`를 반환합니다. 함수가 프로미스를 반환하지 않으면 `assert.rejects()`는 [`ERR_INVALID_RETURN_VALUE`](/ko/nodejs/api/errors#err_invalid_return_value) 오류와 함께 거부된 `Promise`를 반환합니다. 두 경우 모두 오류 처리기가 건너뜁니다.

완료를 기다리는 비동기적 특성 외에는 [`assert.throws()`](/ko/nodejs/api/assert#assertthrowsfn-error-message)와 동일하게 동작합니다.

지정된 경우 `error`는 [`클래스`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_Expressions), 유효성 검사 함수, 각 속성이 테스트될 객체 또는 열거할 수 없는 `message` 및 `name` 속성을 포함하여 각 속성이 테스트될 오류의 인스턴스일 수 있습니다.

지정된 경우 `asyncFn`이 거부되지 못할 경우 `message`는 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)에서 제공하는 메시지가 됩니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.rejects(
  async () => {
    throw new TypeError('잘못된 값');
  },
  {
    name: 'TypeError',
    message: '잘못된 값',
  },
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('잘못된 값');
    },
    {
      name: 'TypeError',
      message: '잘못된 값',
    },
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.rejects(
  async () => {
    throw new TypeError('잘못된 값');
  },
  (err) => {
    assert.strictEqual(err.name, 'TypeError');
    assert.strictEqual(err.message, '잘못된 값');
    return true;
  },
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('잘못된 값');
    },
    (err) => {
      assert.strictEqual(err.name, 'TypeError');
      assert.strictEqual(err.message, '잘못된 값');
      return true;
    },
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.rejects(
  Promise.reject(new Error('잘못된 값')),
  Error,
).then(() => {
  // ...
});
```

```js [CJS]
const assert = require('node:assert/strict');

assert.rejects(
  Promise.reject(new Error('잘못된 값')),
  Error,
).then(() => {
  // ...
});
```
:::

`error`는 문자열일 수 없습니다. 문자열이 두 번째 인수로 제공되면 `error`는 생략된 것으로 간주되고 문자열은 대신 `message`에 사용됩니다. 이로 인해 쉽게 놓칠 수 있는 실수가 발생할 수 있습니다. 두 번째 인수로 문자열을 사용하는 것이 고려되는 경우 [`assert.throws()`](/ko/nodejs/api/assert#assertthrowsfn-error-message)의 예제를 주의 깊게 읽으십시오.


## `assert.strictEqual(actual, expected[, message])` {#assertstrictequalactual-expected-message}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 사용된 비교가 엄격한 동일성에서 `Object.is()`로 변경됨. |
| v0.1.21 | 추가됨: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)에 의해 결정된 대로 `actual` 및 `expected` 매개변수 간의 엄격한 동일성을 테스트합니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// OK

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical
```

```js [CJS]
const assert = require('node:assert/strict');

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// OK

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical
```
:::

값이 엄격하게 같지 않으면 `message` 속성이 `message` 매개변수의 값과 같게 설정된 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)가 발생합니다. `message` 매개변수가 정의되지 않은 경우 기본 오류 메시지가 할당됩니다. `message` 매개변수가 [`Error`](/ko/nodejs/api/errors#class-error)의 인스턴스인 경우 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror) 대신 해당 오류가 발생합니다.


## `assert.throws(fn[, error][, message])` {#assertthrowsfn-error-message}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.2.0 | 이제 `error` 매개변수가 정규식을 포함하는 객체가 될 수 있습니다. |
| v9.9.0 | 이제 `error` 매개변수가 객체가 될 수도 있습니다. |
| v4.2.0 | 이제 `error` 매개변수가 화살표 함수가 될 수 있습니다. |
| v0.1.21 | v0.1.21에 추가됨 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

함수 `fn`이 오류를 발생시킬 것으로 예상합니다.

지정된 경우, `error`는 [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), 유효성 검사 함수, 각 속성이 엄격한 깊은 동등성에 대해 테스트될 유효성 검사 객체, 또는 열거할 수 없는 `message` 및 `name` 속성을 포함하여 각 속성이 엄격한 깊은 동등성에 대해 테스트될 오류의 인스턴스일 수 있습니다. 객체를 사용할 때 문자열 속성에 대해 유효성을 검사할 때 정규식을 사용하는 것도 가능합니다. 예시는 아래를 참조하세요.

지정된 경우, `message`는 `fn` 호출이 오류를 발생시키지 못하거나 오류 유효성 검사가 실패하는 경우 `AssertionError`에서 제공하는 메시지에 추가됩니다.

사용자 지정 유효성 검사 객체/오류 인스턴스:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

const err = new TypeError('잘못된 값');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: '잘못된 값',
    info: {
      nested: true,
      baz: 'text',
    },
    // 유효성 검사 객체의 속성만 테스트됩니다.
    // 중첩된 객체를 사용하려면 모든 속성이 있어야 합니다. 그렇지 않으면
    // 유효성 검사가 실패합니다.
  },
);

// 정규식을 사용하여 오류 속성 유효성 검사:
assert.throws(
  () => {
    throw err;
  },
  {
    // `name` 및 `message` 속성은 문자열이며 정규식을 사용하여 해당 속성을
    // 검사하면 문자열과 일치합니다. 실패하면 오류가 발생합니다.
    name: /^TypeError$/,
    message: /잘못된/,
    foo: 'bar',
    info: {
      nested: true,
      // 중첩된 속성에 정규식을 사용할 수 없습니다!
      baz: 'text',
    },
    // `reg` 속성은 정규식을 포함하며 유효성 검사 객체에 동일한 정규식이 포함된 경우에만
    // 통과합니다.
    reg: /abc/i,
  },
);

// 다른 `message` 및 `name` 속성으로 인해 실패합니다.
assert.throws(
  () => {
    const otherErr = new Error('찾을 수 없음');
    // `err`의 모든 열거 가능한 속성을 `otherErr`에 복사합니다.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // 오류의 `message` 및 `name` 속성은 유효성 검사 객체로 오류를 사용할 때도 확인됩니다.
  err,
);
```

```js [CJS]
const assert = require('node:assert/strict');

const err = new TypeError('잘못된 값');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: '잘못된 값',
    info: {
      nested: true,
      baz: 'text',
    },
    // 유효성 검사 객체의 속성만 테스트됩니다.
    // 중첩된 객체를 사용하려면 모든 속성이 있어야 합니다. 그렇지 않으면
    // 유효성 검사가 실패합니다.
  },
);

// 정규식을 사용하여 오류 속성 유효성 검사:
assert.throws(
  () => {
    throw err;
  },
  {
    // `name` 및 `message` 속성은 문자열이며 정규식을 사용하여 해당 속성을
    // 검사하면 문자열과 일치합니다. 실패하면 오류가 발생합니다.
    name: /^TypeError$/,
    message: /잘못된/,
    foo: 'bar',
    info: {
      nested: true,
      // 중첩된 속성에 정규식을 사용할 수 없습니다!
      baz: 'text',
    },
    // `reg` 속성은 정규식을 포함하며 유효성 검사 객체에 동일한 정규식이 포함된 경우에만
    // 통과합니다.
    reg: /abc/i,
  },
);

// 다른 `message` 및 `name` 속성으로 인해 실패합니다.
assert.throws(
  () => {
    const otherErr = new Error('찾을 수 없음');
    // `err`의 모든 열거 가능한 속성을 `otherErr`에 복사합니다.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // 오류의 `message` 및 `name` 속성은 유효성 검사 객체로 오류를 사용할 때도 확인됩니다.
  err,
);
```
:::

생성자를 사용하여 instanceof 유효성 검사:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('잘못된 값');
  },
  Error,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('잘못된 값');
  },
  Error,
);
```
:::

[`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)를 사용하여 오류 메시지 유효성 검사:

정규식을 사용하면 오류 객체에서 `.toString`이 실행되므로 오류 이름도 포함됩니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('잘못된 값');
  },
  /^Error: 잘못된 값$/,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('잘못된 값');
  },
  /^Error: 잘못된 값$/,
);
```
:::

사용자 지정 오류 유효성 검사:

함수는 모든 내부 유효성 검사가 통과되었음을 나타내기 위해 `true`를 반환해야 합니다. 그렇지 않으면 [`AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)로 실패합니다.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('잘못된 값');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // 유효성 검사 함수에서 `true` 이외의 다른 것을 반환하지 마십시오.
    // 그렇지 않으면 유효성 검사의 어느 부분이 실패했는지 명확하지 않습니다. 대신
    // 실패한 특정 유효성 검사에 대한 오류를 발생시키고 (이 예에서 수행된 것처럼) 해당 오류에
    // 최대한 많은 유용한 디버깅 정보를 추가하십시오.
    return true;
  },
  '예상치 못한 오류',
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('잘못된 값');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // 유효성 검사 함수에서 `true` 이외의 다른 것을 반환하지 마십시오.
    // 그렇지 않으면 유효성 검사의 어느 부분이 실패했는지 명확하지 않습니다. 대신
    // 실패한 특정 유효성 검사에 대한 오류를 발생시키고 (이 예에서 수행된 것처럼) 해당 오류에
    // 최대한 많은 유용한 디버깅 정보를 추가하십시오.
    return true;
  },
  '예상치 못한 오류',
);
```
:::

`error`는 문자열일 수 없습니다. 문자열이 두 번째 인수로 제공되면 `error`는 생략된 것으로 간주되고 문자열은 `message`에 사용됩니다. 이로 인해 쉽게 놓칠 수 있는 실수가 발생할 수 있습니다. 발생된 오류 메시지와 동일한 메시지를 사용하면 `ERR_AMBIGUOUS_ARGUMENT` 오류가 발생합니다. 문자열을 두 번째 인수로 사용하는 것을 고려하는 경우 아래 예제를 주의 깊게 읽으십시오.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

function throwingFirst() {
  throw new Error('First');
}

function throwingSecond() {
  throw new Error('Second');
}

function notThrowing() {}

// 두 번째 인수는 문자열이고 입력 함수가 Error를 발생시켰습니다.
// 첫 번째 경우는 입력 함수에서 발생한 오류 메시지와 일치하지 않으므로 발생하지 않습니다!
assert.throws(throwingFirst, 'Second');
// 다음 예제에서 메시지는 오류의 메시지보다 이점이 없으며 사용자가 실제로
// 오류 메시지와 일치시키려고 했는지 명확하지 않으므로 Node.js는 `ERR_AMBIGUOUS_ARGUMENT` 오류를 발생시킵니다.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// 문자열은 함수가 오류를 발생시키지 않는 경우에만 (메시지로) 사용됩니다.
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Missing expected exception: Second

// 오류 메시지와 일치시키려는 경우 대신 이렇게 하십시오.
// 오류 메시지가 일치하므로 발생하지 않습니다.
assert.throws(throwingSecond, /Second$/);

// 오류 메시지가 일치하지 않으면 AssertionError가 발생합니다.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```

```js [CJS]
const assert = require('node:assert/strict');

function throwingFirst() {
  throw new Error('First');
}

function throwingSecond() {
  throw new Error('Second');
}

function notThrowing() {}

// 두 번째 인수는 문자열이고 입력 함수가 Error를 발생시켰습니다.
// 첫 번째 경우는 입력 함수에서 발생한 오류 메시지와 일치하지 않으므로 발생하지 않습니다!
assert.throws(throwingFirst, 'Second');
// 다음 예제에서 메시지는 오류의 메시지보다 이점이 없으며 사용자가 실제로
// 오류 메시지와 일치시키려고 했는지 명확하지 않으므로 Node.js는 `ERR_AMBIGUOUS_ARGUMENT` 오류를 발생시킵니다.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// 문자열은 함수가 오류를 발생시키지 않는 경우에만 (메시지로) 사용됩니다.
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Missing expected exception: Second

// 오류 메시지와 일치시키려는 경우 대신 이렇게 하십시오.
// 오류 메시지가 일치하므로 발생하지 않습니다.
assert.throws(throwingSecond, /Second$/);

// 오류 메시지가 일치하지 않으면 AssertionError가 발생합니다.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```
:::

혼란스럽고 오류가 발생하기 쉬운 표기법 때문에 문자열을 두 번째 인수로 사용하지 마십시오.


## `assert.partialDeepStrictEqual(actual, expected[, message])` {#assertpartialdeepstrictequalactual-expected-message}

**추가됨: v23.4.0**

::: warning [Stable: 1 - 실험적]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).0 - 초기 개발
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`assert.partialDeepStrictEqual()`](/ko/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message)은 `actual` 및 `expected` 매개변수 간의 동등성을 깊은 비교를 통해 단언하여 `expected` 매개변수의 모든 속성이 타입 강제 변환 없이 동등한 값을 가진 `actual` 매개변수에 있는지 확인합니다. [`assert.deepStrictEqual()`](/ko/nodejs/api/assert#assertdeepstrictequalactual-expected-message)과의 주요 차이점은 [`assert.partialDeepStrictEqual()`](/ko/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message)은 `actual` 매개변수의 모든 속성이 `expected` 매개변수에 있을 필요가 없다는 것입니다. 이 메서드는 항상 [`assert.deepStrictEqual()`](/ko/nodejs/api/assert#assertdeepstrictequalactual-expected-message)과 동일한 테스트 케이스를 통과해야 하며, 슈퍼 세트처럼 동작합니다.

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.partialDeepStrictEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } });
// OK

assert.partialDeepStrictEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual(new Set(['value1', 'value2']), new Set(['value1', 'value2']));
// OK

assert.partialDeepStrictEqual(new Map([['key1', 'value1']]), new Map([['key1', 'value1']]));
// OK

assert.partialDeepStrictEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]));
// OK

assert.partialDeepStrictEqual(/abc/, /abc/);
// OK

assert.partialDeepStrictEqual([{ a: 5 }, { b: 5 }], [{ a: 5 }]);
// OK

assert.partialDeepStrictEqual(new Set([{ a: 1 }, { b: 1 }]), new Set([{ a: 1 }]));
// OK

assert.partialDeepStrictEqual(new Date(0), new Date(0));
// OK

assert.partialDeepStrictEqual({ a: 1 }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: 1, b: '2' }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: { b: 2 } }, { a: { b: '2' } });
// AssertionError
```

```js [CJS]
const assert = require('node:assert');

assert.partialDeepStrictEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } });
// OK

assert.partialDeepStrictEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual([{ a: 5 }, { b: 5 }], [{ a: 5 }]);
// OK

assert.partialDeepStrictEqual(new Set([{ a: 1 }, { b: 1 }]), new Set([{ a: 1 }]));
// OK

assert.partialDeepStrictEqual({ a: 1 }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: 1, b: '2' }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: { b: 2 } }, { a: { b: '2' } });
// AssertionError
```
:::

