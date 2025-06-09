---
title: Node.js 문서 - 비동기 컨텍스트 추적
description: Node.js에서 비동기 작업을 추적하는 방법을 배웁니다. async_hooks 모듈을 사용하여 다양한 비동기 이벤트에 대한 콜백을 등록하는 방법을 제공합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 비동기 컨텍스트 추적 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js에서 비동기 작업을 추적하는 방법을 배웁니다. async_hooks 모듈을 사용하여 다양한 비동기 이벤트에 대한 콜백을 등록하는 방법을 제공합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 비동기 컨텍스트 추적 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js에서 비동기 작업을 추적하는 방법을 배웁니다. async_hooks 모듈을 사용하여 다양한 비동기 이벤트에 대한 콜백을 등록하는 방법을 제공합니다.
---


# 비동기 컨텍스트 추적 {#asynchronous-context-tracking}

::: tip [안정성: 2 - 안정됨]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

**소스 코드:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

## 소개 {#introduction}

이 클래스들은 상태를 연결하고 콜백 및 프로미스 체인을 통해 전파하는 데 사용됩니다. 웹 요청 또는 다른 비동기 기간 동안 데이터를 저장할 수 있습니다. 다른 언어의 스레드 로컬 저장소와 유사합니다.

`AsyncLocalStorage` 및 `AsyncResource` 클래스는 `node:async_hooks` 모듈의 일부입니다.

::: code-group
```js [ESM]
import { AsyncLocalStorage, AsyncResource } from 'node:async_hooks';
```

```js [CJS]
const { AsyncLocalStorage, AsyncResource } = require('node:async_hooks');
```
:::

## 클래스: `AsyncLocalStorage` {#class-asynclocalstorage}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.4.0 | AsyncLocalStorage가 이제 안정화되었습니다. 이전에는 실험적이었음. |
| v13.10.0, v12.17.0 | 추가됨: v13.10.0, v12.17.0 |
:::

이 클래스는 비동기 작업을 통해 일관성을 유지하는 저장소를 만듭니다.

`node:async_hooks` 모듈을 기반으로 자체 구현을 만들 수 있지만, `AsyncLocalStorage`는 구현하기 쉽지 않은 상당한 최적화가 포함된 성능이 뛰어나고 메모리 안전한 구현이므로 선호되어야 합니다.

다음 예제에서는 `AsyncLocalStorage`를 사용하여 들어오는 HTTP 요청에 ID를 할당하고 각 요청 내에서 기록된 메시지에 해당 ID를 포함하는 간단한 로거를 빌드합니다.

::: code-group
```js [ESM]
import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // 여기에서 비동기 작업 체인을 상상해보세요.
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// 출력:
//   0: start
//   1: start
//   0: finish
//   1: finish
```

```js [CJS]
const http = require('node:http');
const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // 여기에서 비동기 작업 체인을 상상해보세요.
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// 출력:
//   0: start
//   1: start
//   0: finish
//   1: finish
```
:::

`AsyncLocalStorage`의 각 인스턴스는 독립적인 저장소 컨텍스트를 유지합니다. 여러 인스턴스가 서로의 데이터를 방해할 위험 없이 동시에 안전하게 존재할 수 있습니다.


### `new AsyncLocalStorage()` {#new-asynclocalstorage}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v19.7.0, v18.16.0 | experimental onPropagate 옵션 제거. |
| v19.2.0, v18.13.0 | onPropagate 옵션 추가. |
| v13.10.0, v12.17.0 | 추가됨: v13.10.0, v12.17.0 |
:::

`AsyncLocalStorage`의 새 인스턴스를 만듭니다. 저장소는 `run()` 호출 내에서 또는 `enterWith()` 호출 후에만 제공됩니다.

### 정적 메서드: `AsyncLocalStorage.bind(fn)` {#static-method-asynclocalstoragebindfn}

**추가됨: v19.8.0, v18.16.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 현재 실행 컨텍스트에 바인딩할 함수입니다.
- 반환: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 캡처된 실행 컨텍스트 내에서 `fn`을 호출하는 새 함수입니다.

주어진 함수를 현재 실행 컨텍스트에 바인딩합니다.

### 정적 메서드: `AsyncLocalStorage.snapshot()` {#static-method-asynclocalstoragesnapshot}

**추가됨: v19.8.0, v18.16.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- 반환: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `(fn: (...args) : R, ...args) : R` 시그니처를 가진 새 함수입니다.

현재 실행 컨텍스트를 캡처하고 함수를 인수로 받는 함수를 반환합니다. 반환된 함수가 호출될 때마다 캡처된 컨텍스트 내에서 전달된 함수를 호출합니다.

```js [ESM]
const asyncLocalStorage = new AsyncLocalStorage();
const runInAsyncScope = asyncLocalStorage.run(123, () => AsyncLocalStorage.snapshot());
const result = asyncLocalStorage.run(321, () => runInAsyncScope(() => asyncLocalStorage.getStore()));
console.log(result);  // 123을 반환합니다
```
AsyncLocalStorage.snapshot()은 간단한 비동기 컨텍스트 추적 목적으로 AsyncResource 사용을 대체할 수 있습니다. 예를 들어:

```js [ESM]
class Foo {
  #runInAsyncScope = AsyncLocalStorage.snapshot();

  get() { return this.#runInAsyncScope(() => asyncLocalStorage.getStore()); }
}

const foo = asyncLocalStorage.run(123, () => new Foo());
console.log(asyncLocalStorage.run(321, () => foo.get())); // 123을 반환합니다
```

### `asyncLocalStorage.disable()` {#asynclocalstoragedisable}

**추가된 버전: v13.10.0, v12.17.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

`AsyncLocalStorage`의 인스턴스를 비활성화합니다. 이후에 `asyncLocalStorage.getStore()`를 호출하면 `asyncLocalStorage.run()` 또는 `asyncLocalStorage.enterWith()`가 다시 호출될 때까지 `undefined`가 반환됩니다.

`asyncLocalStorage.disable()`을 호출하면 인스턴스에 연결된 모든 현재 컨텍스트가 종료됩니다.

`asyncLocalStorage`가 가비지 수집되기 전에 `asyncLocalStorage.disable()`을 호출해야 합니다. `asyncLocalStorage`에서 제공하는 저장소에는 적용되지 않으며, 해당 객체는 해당 비동기 리소스와 함께 가비지 수집됩니다.

현재 프로세스에서 `asyncLocalStorage`를 더 이상 사용하지 않을 때 이 메서드를 사용하십시오.

### `asyncLocalStorage.getStore()` {#asynclocalstoragegetstore}

**추가된 버전: v13.10.0, v12.17.0**

- 반환 값: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

현재 저장소를 반환합니다. `asyncLocalStorage.run()` 또는 `asyncLocalStorage.enterWith()`를 호출하여 초기화된 비동기 컨텍스트 외부에서 호출하면 `undefined`를 반환합니다.

### `asyncLocalStorage.enterWith(store)` {#asynclocalstorageenterwithstore}

**추가된 버전: v13.11.0, v12.17.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

현재 동기 실행의 나머지 부분에 대한 컨텍스트로 전환한 다음 후속 비동기 호출을 통해 저장소를 유지합니다.

예:

```js [ESM]
const store = { id: 1 };
// 이전 저장소를 지정된 저장소 객체로 바꿉니다.
asyncLocalStorage.enterWith(store);
asyncLocalStorage.getStore(); // 저장소 객체를 반환합니다.
someAsyncOperation(() => {
  asyncLocalStorage.getStore(); // 동일한 객체를 반환합니다.
});
```
이 전환은 *전체* 동기 실행 동안 계속됩니다. 즉, 예를 들어 컨텍스트가 이벤트 핸들러 내에서 입력되면 후속 이벤트 핸들러도 `AsyncResource`로 다른 컨텍스트에 특별히 바인딩되지 않는 한 해당 컨텍스트 내에서 실행됩니다. 그렇기 때문에 후자의 메서드를 사용할 강력한 이유가 없는 한 `run()`을 `enterWith()`보다 선호해야 합니다.

```js [ESM]
const store = { id: 1 };

emitter.on('my-event', () => {
  asyncLocalStorage.enterWith(store);
});
emitter.on('my-event', () => {
  asyncLocalStorage.getStore(); // 동일한 객체를 반환합니다.
});

asyncLocalStorage.getStore(); // undefined를 반환합니다.
emitter.emit('my-event');
asyncLocalStorage.getStore(); // 동일한 객체를 반환합니다.
```

### `asyncLocalStorage.run(store, callback[, ...args])` {#asynclocalstoragerunstore-callback-args}

**추가된 버전: v13.10.0, v12.17.0**

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

컨텍스트 내에서 함수를 동기적으로 실행하고 반환 값을 반환합니다. 스토어는 콜백 함수 외부에서는 접근할 수 없습니다. 스토어는 콜백 내에서 생성된 모든 비동기 작업에 접근할 수 있습니다.

선택적 `args`는 콜백 함수에 전달됩니다.

콜백 함수가 오류를 던지면 `run()`도 오류를 던집니다. 스택 추적은 이 호출의 영향을 받지 않고 컨텍스트가 종료됩니다.

예시:

```js [ESM]
const store = { id: 2 };
try {
  asyncLocalStorage.run(store, () => {
    asyncLocalStorage.getStore(); // 스토어 객체를 반환합니다.
    setTimeout(() => {
      asyncLocalStorage.getStore(); // 스토어 객체를 반환합니다.
    }, 200);
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // undefined를 반환합니다.
  // 오류는 여기에서 잡힙니다.
}
```
### `asyncLocalStorage.exit(callback[, ...args])` {#asynclocalstorageexitcallback-args}

**추가된 버전: v13.10.0, v12.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

컨텍스트 외부에서 함수를 동기적으로 실행하고 반환 값을 반환합니다. 스토어는 콜백 함수 또는 콜백 내에서 생성된 비동기 작업 내에서 접근할 수 없습니다. 콜백 함수 내에서 수행된 `getStore()` 호출은 항상 `undefined`를 반환합니다.

선택적 `args`는 콜백 함수에 전달됩니다.

콜백 함수가 오류를 던지면 `exit()`도 오류를 던집니다. 스택 추적은 이 호출의 영향을 받지 않고 컨텍스트가 다시 시작됩니다.

예시:

```js [ESM]
// run 호출 내에서
try {
  asyncLocalStorage.getStore(); // 스토어 객체 또는 값을 반환합니다.
  asyncLocalStorage.exit(() => {
    asyncLocalStorage.getStore(); // undefined를 반환합니다.
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // 동일한 객체 또는 값을 반환합니다.
  // 오류는 여기에서 잡힙니다.
}
```

### `async/await` 사용법 {#usage-with-async/await}

async 함수 내에서 하나의 `await` 호출만 컨텍스트 내에서 실행해야 하는 경우 다음 패턴을 사용해야 합니다.

```js [ESM]
async function fn() {
  await asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set('key', value);
    return foo(); // foo의 반환 값은 await됩니다.
  });
}
```
이 예제에서 저장소는 콜백 함수 및 `foo`에서 호출된 함수에서만 사용할 수 있습니다. `run` 외부에서 `getStore`를 호출하면 `undefined`가 반환됩니다.

### 문제 해결: 컨텍스트 손실 {#troubleshooting-context-loss}

대부분의 경우 `AsyncLocalStorage`는 문제 없이 작동합니다. 드물게 비동기 작업 중 하나에서 현재 저장소가 손실됩니다.

코드가 콜백 기반인 경우 [`util.promisify()`](/ko/nodejs/api/util#utilpromisifyoriginal)로 프로미스화하여 기본 프로미스와 함께 작동하도록 하면 충분합니다.

콜백 기반 API를 사용해야 하거나 코드가 사용자 지정 thenable 구현을 가정하는 경우 [`AsyncResource`](/ko/nodejs/api/async_context#class-asyncresource) 클래스를 사용하여 비동기 작업을 올바른 실행 컨텍스트와 연결합니다. 손실을 유발하는 것으로 의심되는 호출 후 `asyncLocalStorage.getStore()`의 내용을 로깅하여 컨텍스트 손실을 담당하는 함수 호출을 찾습니다. 코드가 `undefined`를 기록하면 마지막으로 호출된 콜백이 컨텍스트 손실을 담당할 가능성이 큽니다.

## 클래스: `AsyncResource` {#class-asyncresource}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.4.0 | AsyncResource가 이제 안정적입니다. 이전에는 실험적이었습니다. |
:::

`AsyncResource` 클래스는 임베더의 비동기 리소스에 의해 확장되도록 설계되었습니다. 이를 사용하여 사용자는 자신의 리소스의 수명 주기 이벤트를 쉽게 트리거할 수 있습니다.

`init` 훅은 `AsyncResource`가 인스턴스화될 때 트리거됩니다.

다음은 `AsyncResource` API의 개요입니다.

::: code-group
```js [ESM]
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

// AsyncResource()는 확장하도록 만들어졌습니다.
// new AsyncResource()를 인스턴스화하면 init도 트리거됩니다. triggerAsyncId가 생략되면
// async_hook.executionAsyncId()가 사용됩니다.
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// 리소스의 실행 컨텍스트에서 함수를 실행합니다. 이는
// * 리소스의 컨텍스트를 설정합니다.
// * AsyncHooks before 콜백을 트리거합니다.
// * 제공된 함수 `fn`을 제공된 인수와 함께 호출합니다.
// * AsyncHooks after 콜백을 트리거합니다.
// * 원래 실행 컨텍스트를 복원합니다.
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// AsyncHooks destroy 콜백을 호출합니다.
asyncResource.emitDestroy();

// AsyncResource 인스턴스에 할당된 고유 ID를 반환합니다.
asyncResource.asyncId();

// AsyncResource 인스턴스의 트리거 ID를 반환합니다.
asyncResource.triggerAsyncId();
```

```js [CJS]
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

// AsyncResource()는 확장하도록 만들어졌습니다.
// new AsyncResource()를 인스턴스화하면 init도 트리거됩니다. triggerAsyncId가 생략되면
// async_hook.executionAsyncId()가 사용됩니다.
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// 리소스의 실행 컨텍스트에서 함수를 실행합니다. 이는
// * 리소스의 컨텍스트를 설정합니다.
// * AsyncHooks before 콜백을 트리거합니다.
// * 제공된 함수 `fn`을 제공된 인수와 함께 호출합니다.
// * AsyncHooks after 콜백을 트리거합니다.
// * 원래 실행 컨텍스트를 복원합니다.
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// AsyncHooks destroy 콜백을 호출합니다.
asyncResource.emitDestroy();

// AsyncResource 인스턴스에 할당된 고유 ID를 반환합니다.
asyncResource.asyncId();

// AsyncResource 인스턴스의 트리거 ID를 반환합니다.
asyncResource.triggerAsyncId();
```
:::


### `new AsyncResource(type[, options])` {#new-asyncresourcetype-options}

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 비동기 이벤트의 유형입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 비동기 이벤트를 생성한 실행 컨텍스트의 ID입니다. **기본값:** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`로 설정하면 객체가 가비지 수집될 때 `emitDestroy`를 비활성화합니다. 이는 일반적으로 리소스의 `asyncId`가 검색되고 중요한 API의 `emitDestroy`가 호출되는 경우가 아니라면 (수동으로 `emitDestroy`를 호출하는 경우에도) 설정할 필요가 없습니다. `false`로 설정하면 가비지 수집 시 `emitDestroy` 호출은 활성 `destroy` 훅이 하나 이상 있는 경우에만 발생합니다. **기본값:** `false`.

사용 예시:

```js [ESM]
class DBQuery extends AsyncResource {
  constructor(db) {
    super('DBQuery');
    this.db = db;
  }

  getInfo(query, callback) {
    this.db.get(query, (err, data) => {
      this.runInAsyncScope(callback, null, err, data);
    });
  }

  close() {
    this.db = null;
    this.emitDestroy();
  }
}
```
### 정적 메서드: `AsyncResource.bind(fn[, type[, thisArg]])` {#static-method-asyncresourcebindfn-type-thisarg}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0 | 바인딩된 함수에 추가된 `asyncResource` 속성은 더 이상 사용되지 않으며 이후 버전에서 제거될 예정입니다. |
| v17.8.0, v16.15.0 | `thisArg`가 정의되지 않았을 때 호출자에서 `this`를 사용하도록 기본값을 변경했습니다. |
| v16.0.0 | 선택적 thisArg를 추가했습니다. |
| v14.8.0, v12.19.0 | 추가됨: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 현재 실행 컨텍스트에 바인딩할 함수입니다.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 기본 `AsyncResource`와 연결할 선택적 이름입니다.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

주어진 함수를 현재 실행 컨텍스트에 바인딩합니다.


### `asyncResource.bind(fn[, thisArg])` {#asyncresourcebindfn-thisarg}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0 | 바인딩된 함수에 추가된 `asyncResource` 속성이 더 이상 사용되지 않으며 향후 버전에서 제거될 예정입니다. |
| v17.8.0, v16.15.0 | `thisArg`가 정의되지 않은 경우 호출자의 `this`를 사용하도록 기본값이 변경되었습니다. |
| v16.0.0 | 선택적 thisArg가 추가되었습니다. |
| v14.8.0, v12.19.0 | 추가됨: v14.8.0, v12.19.0 |
:::

- `fn` [\<함수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 현재 `AsyncResource`에 바인딩할 함수입니다.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

지정된 함수를 이 `AsyncResource`의 범위에서 실행되도록 바인딩합니다.

### `asyncResource.runInAsyncScope(fn[, thisArg, ...args])` {#asyncresourceruninasyncscopefn-thisarg-args}

**추가됨: v9.6.0**

- `fn` [\<함수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 이 비동기 리소스의 실행 컨텍스트에서 호출할 함수입니다.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 함수 호출에 사용할 수신자입니다.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 함수에 전달할 선택적 인수입니다.

비동기 리소스의 실행 컨텍스트에서 제공된 인수로 제공된 함수를 호출합니다. 이는 컨텍스트를 설정하고, AsyncHooks before 콜백을 트리거하고, 함수를 호출하고, AsyncHooks after 콜백을 트리거한 다음 원래 실행 컨텍스트를 복원합니다.

### `asyncResource.emitDestroy()` {#asyncresourceemitdestroy}

- 반환: [\<AsyncResource\>](/ko/nodejs/api/async_hooks#class-asyncresource) `asyncResource`에 대한 참조입니다.

모든 `destroy` 훅을 호출합니다. 이것은 한 번만 호출되어야 합니다. 두 번 이상 호출되면 오류가 발생합니다. 이는 반드시 수동으로 호출해야 합니다. 리소스가 GC에 의해 수집되도록 남겨지면 `destroy` 훅은 절대 호출되지 않습니다.


### `asyncResource.asyncId()` {#asyncresourceasyncid}

- 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 리소스에 할당된 고유한 `asyncId`입니다.

### `asyncResource.triggerAsyncId()` {#asyncresourcetriggerasyncid}

- 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `AsyncResource` 생성자에 전달된 것과 동일한 `triggerAsyncId`입니다.

### `Worker` 스레드 풀에 `AsyncResource` 사용 {#using-asyncresource-for-a-worker-thread-pool}

다음 예는 `AsyncResource` 클래스를 사용하여 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 풀에 대한 비동기 추적을 올바르게 제공하는 방법을 보여줍니다. 데이터베이스 연결 풀과 같은 다른 리소스 풀도 유사한 모델을 따를 수 있습니다.

작업이 두 숫자를 더하는 것이라고 가정하고, 다음 내용으로 `task_processor.js`라는 파일을 사용합니다.

::: code-group
```js [ESM]
import { parentPort } from 'node:worker_threads';
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```

```js [CJS]
const { parentPort } = require('node:worker_threads');
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```
:::

그 주위에 Worker 풀은 다음 구조를 사용할 수 있습니다.

::: code-group
```js [ESM]
import { AsyncResource } from 'node:async_hooks';
import { EventEmitter } from 'node:events';
import { Worker } from 'node:worker_threads';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`는 한 번만 사용됩니다.
  }
}

export default class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // kWorkerFreedEvent가 발생할 때마다,
    // 큐에 보류 중인 다음 작업을 디스패치합니다(있는 경우).
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(new URL('task_processor.js', import.meta.url));
    worker.on('message', (result) => {
      // 성공한 경우: `runTask`에 전달된 콜백을 호출하고,
      // Worker와 관련된 `TaskInfo`를 제거하고, 다시 사용 가능한 상태로 표시합니다.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // 잡히지 않은 예외의 경우: 오류와 함께 `runTask`에 전달된 콜백을 호출합니다.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // 목록에서 워커를 제거하고 현재 워커를 대체할 새 워커를 시작합니다.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // 사용 가능한 스레드가 없으므로 워커 스레드가 사용 가능해질 때까지 기다립니다.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}
```

```js [CJS]
const { AsyncResource } = require('node:async_hooks');
const { EventEmitter } = require('node:events');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`는 한 번만 사용됩니다.
  }
}

class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // kWorkerFreedEvent가 발생할 때마다,
    // 큐에 보류 중인 다음 작업을 디스패치합니다(있는 경우).
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(path.resolve(__dirname, 'task_processor.js'));
    worker.on('message', (result) => {
      // 성공한 경우: `runTask`에 전달된 콜백을 호출하고,
      // Worker와 관련된 `TaskInfo`를 제거하고, 다시 사용 가능한 상태로 표시합니다.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // 잡히지 않은 예외의 경우: 오류와 함께 `runTask`에 전달된 콜백을 호출합니다.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // 목록에서 워커를 제거하고 현재 워커를 대체할 새 워커를 시작합니다.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // 사용 가능한 스레드가 없으므로 워커 스레드가 사용 가능해질 때까지 기다립니다.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}

module.exports = WorkerPool;
```
:::

`WorkerPoolTaskInfo` 객체로 추가된 명시적 추적 없이는 콜백이 개별 `Worker` 객체와 연결된 것처럼 보입니다. 그러나 `Worker` 생성은 작업 생성과 연결되어 있지 않으며 작업이 예약된 시점에 대한 정보를 제공하지 않습니다.

이 풀은 다음과 같이 사용할 수 있습니다.

::: code-group
```js [ESM]
import WorkerPool from './worker_pool.js';
import os from 'node:os';

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```

```js [CJS]
const WorkerPool = require('./worker_pool.js');
const os = require('node:os');

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```
:::


### `AsyncResource`를 `EventEmitter`와 통합하기 {#integrating-asyncresource-with-eventemitter}

[`EventEmitter`](/ko/nodejs/api/events#class-eventemitter)에 의해 트리거되는 이벤트 리스너는 `eventEmitter.on()`이 호출되었을 때 활성화되었던 실행 컨텍스트와 다른 실행 컨텍스트에서 실행될 수 있습니다.

다음 예제는 `AsyncResource` 클래스를 사용하여 이벤트 리스너를 올바른 실행 컨텍스트와 연결하는 방법을 보여줍니다. 동일한 접근 방식을 [`Stream`](/ko/nodejs/api/stream#stream) 또는 유사한 이벤트 기반 클래스에 적용할 수 있습니다.

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // 실행 컨텍스트는 현재 외부 스코프에 바인딩됩니다.
  }));
  req.on('close', () => {
    // 실행 컨텍스트는 'close'를 발생시킨 스코프에 바인딩됩니다.
  });
  res.end();
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // 실행 컨텍스트는 현재 외부 스코프에 바인딩됩니다.
  }));
  req.on('close', () => {
    // 실행 컨텍스트는 'close'를 발생시킨 스코프에 바인딩됩니다.
  });
  res.end();
}).listen(3000);
```
:::

