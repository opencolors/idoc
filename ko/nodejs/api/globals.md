---
title: Node.js 글로벌 객체
description: 이 페이지는 Node.js에서 사용 가능한 글로벌 객체를 문서화합니다. 명시적인 임포트 없이 모든 모듈에서 접근 가능한 글로벌 변수, 함수 및 클래스를 포함합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 글로벌 객체 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 이 페이지는 Node.js에서 사용 가능한 글로벌 객체를 문서화합니다. 명시적인 임포트 없이 모든 모듈에서 접근 가능한 글로벌 변수, 함수 및 클래스를 포함합니다.
  - - meta
    - name: twitter:title
      content: Node.js 글로벌 객체 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 이 페이지는 Node.js에서 사용 가능한 글로벌 객체를 문서화합니다. 명시적인 임포트 없이 모든 모듈에서 접근 가능한 글로벌 변수, 함수 및 클래스를 포함합니다.
---


# 전역 객체 {#global-objects}

이 객체들은 모든 모듈에서 사용할 수 있습니다.

다음 변수들은 전역처럼 보일 수 있지만 그렇지 않습니다. 이 변수들은 [CommonJS 모듈](/ko/nodejs/api/modules)의 범위 내에서만 존재합니다.

- [`__dirname`](/ko/nodejs/api/modules#__dirname)
- [`__filename`](/ko/nodejs/api/modules#__filename)
- [`exports`](/ko/nodejs/api/modules#exports)
- [`module`](/ko/nodejs/api/modules#module)
- [`require()`](/ko/nodejs/api/modules#requireid)

여기에 나열된 객체들은 Node.js에 특화되어 있습니다. JavaScript 언어 자체의 일부인 [내장 객체](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)들도 있으며, 이는 전역적으로 접근 가능합니다.

## 클래스: `AbortController` {#class-abortcontroller}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v15.4.0 | 더 이상 실험적이지 않습니다. |
| v15.0.0, v14.17.0 | 추가됨: v15.0.0, v14.17.0 |
:::

선택된 `Promise` 기반 API에서 취소를 알리는 데 사용되는 유틸리티 클래스입니다. API는 Web API [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)를 기반으로 합니다.

```js [ESM]
const ac = new AbortController();

ac.signal.addEventListener('abort', () => console.log('중단됨!'),
                           { once: true });

ac.abort();

console.log(ac.signal.aborted);  // true 출력
```
### `abortController.abort([reason])` {#abortcontrollerabortreason}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v17.2.0, v16.14.0 | 새로운 선택적 reason 인수가 추가되었습니다. |
| v15.0.0, v14.17.0 | 추가됨: v15.0.0, v14.17.0 |
:::

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 선택적 이유이며, `AbortSignal`의 `reason` 속성에서 검색할 수 있습니다.

중단 신호를 트리거하여 `abortController.signal`이 `'abort'` 이벤트를 발생시키도록 합니다.

### `abortController.signal` {#abortcontrollersignal}

**추가됨: v15.0.0, v14.17.0**

- 타입: [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)

### 클래스: `AbortSignal` {#class-abortsignal}

**추가됨: v15.0.0, v14.17.0**

- 확장: [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget)

`AbortSignal`은 `abortController.abort()` 메서드가 호출될 때 옵저버에게 알리는 데 사용됩니다.


#### 정적 메서드: `AbortSignal.abort([reason])` {#static-method-abortsignalabortreason}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.2.0, v16.14.0 | 새로운 선택적 reason 인수가 추가되었습니다. |
| v15.12.0, v14.17.0 | 추가됨: v15.12.0, v14.17.0 |
:::

- `reason`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)

새로 이미 중단된 `AbortSignal`을 반환합니다.

#### 정적 메서드: `AbortSignal.timeout(delay)` {#static-method-abortsignaltimeoutdelay}

**추가됨: v17.3.0, v16.14.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) AbortSignal을 트리거하기 전에 기다릴 밀리초 수입니다.

`delay` 밀리초 후에 중단되는 새로운 `AbortSignal`을 반환합니다.

#### 정적 메서드: `AbortSignal.any(signals)` {#static-method-abortsignalanysignals}

**추가됨: v20.3.0, v18.17.0**

- `signals` [\<AbortSignal[]\>](/ko/nodejs/api/globals#class-abortsignal) 새로운 `AbortSignal`을 구성할 `AbortSignal`입니다.

제공된 신호 중 하나라도 중단되면 중단되는 새로운 `AbortSignal`을 반환합니다. 해당 [`abortSignal.reason`](/ko/nodejs/api/globals#abortsignalreason)은 중단되게 한 `signals` 중 하나로 설정됩니다.

#### 이벤트: `'abort'` {#event-abort}

**추가됨: v15.0.0, v14.17.0**

`'abort'` 이벤트는 `abortController.abort()` 메서드가 호출될 때 발생합니다. 콜백은 `type` 속성이 `'abort'`로 설정된 단일 객체 인수로 호출됩니다.

```js [ESM]
const ac = new AbortController();

// onabort 속성을 사용하거나...
ac.signal.onabort = () => console.log('aborted!');

// 또는 EventTarget API를 사용합니다...
ac.signal.addEventListener('abort', (event) => {
  console.log(event.type);  // 'abort'를 출력합니다.
}, { once: true });

ac.abort();
```
`AbortSignal`이 연결된 `AbortController`는 `'abort'` 이벤트를 한 번만 트리거합니다. 코드가 `'abort'` 이벤트 리스너를 추가하기 전에 `abortSignal.aborted` 속성이 `false`인지 확인하는 것이 좋습니다.

`AbortSignal`에 연결된 모든 이벤트 리스너는 이벤트 리스너가 `'abort'` 이벤트가 처리되는 즉시 제거되도록 `{ once: true }` 옵션(또는 `EventEmitter` API를 사용하여 리스너를 연결하는 경우 `once()` 메서드)을 사용해야 합니다. 그렇지 않으면 메모리 누수가 발생할 수 있습니다.


#### `abortSignal.aborted` {#abortsignalaborted}

**Added in: v15.0.0, v14.17.0**

- 유형: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `AbortController`가 중단된 후 True입니다.

#### `abortSignal.onabort` {#abortsignalonabort}

**Added in: v15.0.0, v14.17.0**

- 유형: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`abortController.abort()` 함수가 호출되었을 때 알림을 받기 위해 사용자 코드가 설정할 수 있는 선택적 콜백 함수입니다.

#### `abortSignal.reason` {#abortsignalreason}

**Added in: v17.2.0, v16.14.0**

- 유형: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`AbortSignal`이 트리거되었을 때 지정된 선택적 이유입니다.

```js [ESM]
const ac = new AbortController();
ac.abort(new Error('boom!'));
console.log(ac.signal.reason);  // Error: boom!
```
#### `abortSignal.throwIfAborted()` {#abortsignalthrowifaborted}

**Added in: v17.3.0, v16.17.0**

`abortSignal.aborted`가 `true`이면 `abortSignal.reason`을 던집니다.

## Class: `Blob` {#class-blob}

**Added in: v18.0.0**

[\<Blob\>](/ko/nodejs/api/buffer#class-blob)을 참조하세요.

## Class: `Buffer` {#class-buffer}

**Added in: v0.1.103**

- [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

이진 데이터를 처리하는 데 사용됩니다. [버퍼 섹션](/ko/nodejs/api/buffer)을 참조하세요.

## Class: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적입니다.
:::

[`ByteLengthQueuingStrategy`](/ko/nodejs/api/webstreams#class-bytelengthqueuingstrategy)의 브라우저 호환 구현입니다.

## `__dirname` {#__dirname}

이 변수는 전역 변수처럼 보일 수 있지만 그렇지 않습니다. [`__dirname`](/ko/nodejs/api/modules#__dirname)을 참조하세요.

## `__filename` {#__filename}

이 변수는 전역 변수처럼 보일 수 있지만 그렇지 않습니다. [`__filename`](/ko/nodejs/api/modules#__filename)을 참조하세요.

## `atob(data)` {#atobdata}

**Added in: v16.0.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시. 대신 `Buffer.from(data, 'base64')`를 사용하세요.
:::

[`buffer.atob()`](/ko/nodejs/api/buffer#bufferatobdata)의 전역 별칭입니다.


## `BroadcastChannel` {#broadcastchannel}

**Added in: v18.0.0**

[\<BroadcastChannel\>](/ko/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget)을 참조하십시오.

## `btoa(data)` {#btoadata}

**Added in: v16.0.0**

::: info [안정성: 3 - 레거시]
[안정성: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시. 대신 `buf.toString('base64')`를 사용하십시오.
:::

[`buffer.btoa()`](/ko/nodejs/api/buffer#bufferbtoadata)의 전역 별칭입니다.

## `clearImmediate(immediateObject)` {#clearimmediateimmediateobject}

**Added in: v0.9.1**

[`clearImmediate`](/ko/nodejs/api/timers#clearimmediateimmediate)는 [타이머](/ko/nodejs/api/timers) 섹션에 설명되어 있습니다.

## `clearInterval(intervalObject)` {#clearintervalintervalobject}

**Added in: v0.0.1**

[`clearInterval`](/ko/nodejs/api/timers#clearintervaltimeout)는 [타이머](/ko/nodejs/api/timers) 섹션에 설명되어 있습니다.

## `clearTimeout(timeoutObject)` {#cleartimeouttimeoutobject}

**Added in: v0.0.1**

[`clearTimeout`](/ko/nodejs/api/timers#cleartimeouttimeout)는 [타이머](/ko/nodejs/api/timers) 섹션에 설명되어 있습니다.

## `CloseEvent` {#closeevent}

**Added in: v23.0.0**

`CloseEvent` 클래스. 자세한 내용은 [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent)를 참조하십시오.

[`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent)의 브라우저 호환 구현입니다. [`--no-experimental-websocket`](/ko/nodejs/api/cli#--no-experimental-websocket) CLI 플래그로 이 API를 비활성화하십시오.

## Class: `CompressionStream` {#class-compressionstream}

**Added in: v18.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적.
:::

[`CompressionStream`](/ko/nodejs/api/webstreams#class-compressionstream)의 브라우저 호환 구현입니다.

## `console` {#console}

**Added in: v0.1.100**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

stdout 및 stderr로 출력하는 데 사용됩니다. [`console`](/ko/nodejs/api/console) 섹션을 참조하십시오.

## Class: `CountQueuingStrategy` {#class-countqueuingstrategy}

**Added in: v18.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적.
:::

[`CountQueuingStrategy`](/ko/nodejs/api/webstreams#class-countqueuingstrategy)의 브라우저 호환 구현입니다.


## `Crypto` {#crypto}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 더 이상 실험적이지 않습니다. |
| v19.0.0 | 더 이상 `--experimental-global-webcrypto` CLI 플래그 뒤에 있지 않습니다. |
| v17.6.0, v16.15.0 | 추가됨: v17.6.0, v16.15.0 |
:::

::: tip [안정됨: 2 - 안정됨]
[안정됨: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨.
:::

[\<Crypto\>](/ko/nodejs/api/webcrypto#class-crypto)의 브라우저 호환 구현입니다. 이 전역 변수는 Node.js 바이너리가 `node:crypto` 모듈 지원을 포함하여 컴파일된 경우에만 사용할 수 있습니다.

## `crypto` {#crypto_1}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 더 이상 실험적이지 않습니다. |
| v19.0.0 | 더 이상 `--experimental-global-webcrypto` CLI 플래그 뒤에 있지 않습니다. |
| v17.6.0, v16.15.0 | 추가됨: v17.6.0, v16.15.0 |
:::

::: tip [안정됨: 2 - 안정됨]
[안정됨: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨.
:::

[Web Crypto API](/ko/nodejs/api/webcrypto)의 브라우저 호환 구현입니다.

## `CryptoKey` {#cryptokey}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 더 이상 실험적이지 않습니다. |
| v19.0.0 | 더 이상 `--experimental-global-webcrypto` CLI 플래그 뒤에 있지 않습니다. |
| v17.6.0, v16.15.0 | 추가됨: v17.6.0, v16.15.0 |
:::

::: tip [안정됨: 2 - 안정됨]
[안정됨: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨.
:::

[\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)의 브라우저 호환 구현입니다. 이 전역 변수는 Node.js 바이너리가 `node:crypto` 모듈 지원을 포함하여 컴파일된 경우에만 사용할 수 있습니다.

## `CustomEvent` {#customevent}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 더 이상 실험적이지 않습니다. |
| v22.1.0, v20.13.0 | 이제 CustomEvent가 안정적입니다. |
| v19.0.0 | 더 이상 `--experimental-global-customevent` CLI 플래그 뒤에 있지 않습니다. |
| v18.7.0, v16.17.0 | 추가됨: v18.7.0, v16.17.0 |
:::

::: tip [안정됨: 2 - 안정됨]
[안정됨: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

[`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent)의 브라우저 호환 구현입니다.


## Class: `DecompressionStream` {#class-decompressionstream}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - Experimental.
:::

[`DecompressionStream`](/ko/nodejs/api/webstreams#class-decompressionstream)의 브라우저 호환 구현입니다.

## `Event` {#event}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.4.0 | 더 이상 실험적이지 않습니다. |
| v15.0.0 | Added in: v15.0.0 |
:::

`Event` 클래스의 브라우저 호환 구현입니다. 자세한 내용은 [`EventTarget` 및 `Event` API](/ko/nodejs/api/events#eventtarget-and-event-api)를 참조하세요.

## `EventSource` {#eventsource}

**Added in: v22.3.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - Experimental. [`--experimental-eventsource`](/ko/nodejs/api/cli#--experimental-eventsource) CLI 플래그로 이 API를 활성화하세요.
:::

[`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) 클래스의 브라우저 호환 구현입니다.

## `EventTarget` {#eventtarget}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.4.0 | 더 이상 실험적이지 않습니다. |
| v15.0.0 | Added in: v15.0.0 |
:::

`EventTarget` 클래스의 브라우저 호환 구현입니다. 자세한 내용은 [`EventTarget` 및 `Event` API](/ko/nodejs/api/events#eventtarget-and-event-api)를 참조하세요.

## `exports` {#exports}

이 변수는 전역으로 보일 수 있지만 그렇지 않습니다. [`exports`](/ko/nodejs/api/modules#exports)를 참조하세요.

## `fetch` {#fetch}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | 더 이상 실험적이지 않습니다. |
| v18.0.0 | 더 이상 `--experimental-fetch` CLI 플래그 뒤에 있지 않습니다. |
| v17.5.0, v16.15.0 | Added in: v17.5.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [Stability: 2](/ko/nodejs/api/documentation#stability-index) - Stable
:::

[`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) 함수의 브라우저 호환 구현입니다.

## Class: `File` {#class-file}

**Added in: v20.0.0**

[\<File\>](/ko/nodejs/api/buffer#class-file)을 참조하세요.


## Class `FormData` {#class-formdata}

::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | 더 이상 실험적이지 않습니다. |
| v18.0.0 | 더 이상 `--experimental-fetch` CLI 플래그 뒤에 있지 않습니다. |
| v17.6.0, v16.15.0 | 추가됨: v17.6.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적임
:::

[\<FormData\>](https://developer.mozilla.org/en-US/docs/Web/API/FormData)의 브라우저 호환 구현입니다.

## `global` {#global}

**Added in: v0.1.27**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시. [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis)를 대신 사용하세요.
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 전역 네임스페이스 객체.

브라우저에서 최상위 범위는 전통적으로 전역 범위였습니다. 즉, ECMAScript 모듈 내부를 제외하고 `var something`은 새로운 전역 변수를 정의합니다. Node.js에서는 이것이 다릅니다. 최상위 범위는 전역 범위가 아닙니다. Node.js 모듈 내부의 `var something`은 [CommonJS 모듈](/ko/nodejs/api/modules)인지 [ECMAScript 모듈](/ko/nodejs/api/esm)인지에 관계없이 해당 모듈에 로컬입니다.

## Class `Headers` {#class-headers}

::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | 더 이상 실험적이지 않습니다. |
| v18.0.0 | 더 이상 `--experimental-fetch` CLI 플래그 뒤에 있지 않습니다. |
| v17.5.0, v16.15.0 | 추가됨: v17.5.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적임
:::

[\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers)의 브라우저 호환 구현입니다.

## `localStorage` {#localstorage}

**Added in: v22.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).0 - 초기 개발.
:::

[`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)의 브라우저 호환 구현입니다. 데이터는 [`--localstorage-file`](/ko/nodejs/api/cli#--localstorage-filefile) CLI 플래그로 지정된 파일에 암호화되지 않은 상태로 저장됩니다. 저장할 수 있는 최대 데이터 양은 10MB입니다. Web Storage API 외부에서 이 데이터를 수정하는 것은 지원되지 않습니다. [`--experimental-webstorage`](/ko/nodejs/api/cli#--experimental-webstorage) CLI 플래그를 사용하여 이 API를 활성화하세요. 서버 컨텍스트에서 사용될 때 `localStorage` 데이터는 사용자별 또는 요청별로 저장되지 않고 모든 사용자와 요청 간에 공유됩니다.


## `MessageChannel` {#messagechannel}

**Added in: v15.0.0**

`MessageChannel` 클래스. 자세한 내용은 [`MessageChannel`](/ko/nodejs/api/worker_threads#class-messagechannel)을 참조하십시오.

## `MessageEvent` {#messageevent}

**Added in: v15.0.0**

`MessageEvent` 클래스. 자세한 내용은 [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/MessageEvent)를 참조하십시오.

## `MessagePort` {#messageport}

**Added in: v15.0.0**

`MessagePort` 클래스. 자세한 내용은 [`MessagePort`](/ko/nodejs/api/worker_threads#class-messageport)를 참조하십시오.

## `module` {#module}

이 변수는 전역으로 보일 수 있지만 그렇지 않습니다. [`module`](/ko/nodejs/api/modules#module)을 참조하십시오.

## `Navigator` {#navigator}

**Added in: v21.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발. [`--no-experimental-global-navigator`](/ko/nodejs/api/cli#--no-experimental-global-navigator) CLI 플래그를 사용하여 이 API를 비활성화하십시오.
:::

[Navigator API](https://html.spec.whatwg.org/multipage/system-state#the-navigator-object)의 부분적인 구현입니다.

## `navigator` {#navigator_1}

**Added in: v21.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발. [`--no-experimental-global-navigator`](/ko/nodejs/api/cli#--no-experimental-global-navigator) CLI 플래그를 사용하여 이 API를 비활성화하십시오.
:::

[`window.navigator`](https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator)의 부분적인 구현입니다.

### `navigator.hardwareConcurrency` {#navigatorhardwareconcurrency}

**Added in: v21.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`navigator.hardwareConcurrency` 읽기 전용 속성은 현재 Node.js 인스턴스에서 사용할 수 있는 논리 프로세서 수를 반환합니다.

```js [ESM]
console.log(`이 프로세스는 ${navigator.hardwareConcurrency}개의 논리 프로세서에서 실행 중입니다.`);
```
### `navigator.language` {#navigatorlanguage}

**Added in: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`navigator.language` 읽기 전용 속성은 Node.js 인스턴스의 기본 설정 언어를 나타내는 문자열을 반환합니다. 언어는 런타임 시 Node.js에서 사용하는 ICU 라이브러리에 의해 운영 체제의 기본 언어를 기반으로 결정됩니다.

이 값은 [RFC 5646](https://www.rfc-editor.org/rfc/rfc5646.txt)에 정의된 언어 버전을 나타냅니다.

ICU 없이 빌드된 경우 대체 값은 `'en-US'`입니다.

```js [ESM]
console.log(`Node.js 인스턴스의 기본 설정 언어에는 '${navigator.language}' 태그가 있습니다.`);
```

### `navigator.languages` {#navigatorlanguages}

**Added in: v21.2.0**

- {Array

`navigator.languages` 읽기 전용 속성은 Node.js 인스턴스가 선호하는 언어를 나타내는 문자열 배열을 반환합니다. 기본적으로 `navigator.languages`에는 `navigator.language` 값만 포함되어 있으며, 이는 운영 체제의 기본 언어를 기반으로 런타임 시 Node.js에서 사용하는 ICU 라이브러리에 의해 결정됩니다.

ICU가 없는 빌드의 폴백 값은 `['en-US']`입니다.

```js [ESM]
console.log(`The preferred languages are '${navigator.languages}'`);
```
### `navigator.platform` {#navigatorplatform}

**Added in: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`navigator.platform` 읽기 전용 속성은 Node.js 인스턴스가 실행 중인 플랫폼을 식별하는 문자열을 반환합니다.

```js [ESM]
console.log(`This process is running on ${navigator.platform}`);
```
### `navigator.userAgent` {#navigatoruseragent}

**Added in: v21.1.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`navigator.userAgent` 읽기 전용 속성은 런타임 이름과 주요 버전 번호로 구성된 사용자 에이전트를 반환합니다.

```js [ESM]
console.log(`The user-agent is ${navigator.userAgent}`); // Prints "Node.js/21"
```
## `PerformanceEntry` {#performanceentry}

**Added in: v19.0.0**

`PerformanceEntry` 클래스. 자세한 내용은 [`PerformanceEntry`](/ko/nodejs/api/perf_hooks#class-performanceentry)를 참조하세요.

## `PerformanceMark` {#performancemark}

**Added in: v19.0.0**

`PerformanceMark` 클래스. 자세한 내용은 [`PerformanceMark`](/ko/nodejs/api/perf_hooks#class-performancemark)를 참조하세요.

## `PerformanceMeasure` {#performancemeasure}

**Added in: v19.0.0**

`PerformanceMeasure` 클래스. 자세한 내용은 [`PerformanceMeasure`](/ko/nodejs/api/perf_hooks#class-performancemeasure)를 참조하세요.

## `PerformanceObserver` {#performanceobserver}

**Added in: v19.0.0**

`PerformanceObserver` 클래스. 자세한 내용은 [`PerformanceObserver`](/ko/nodejs/api/perf_hooks#class-performanceobserver)를 참조하세요.

## `PerformanceObserverEntryList` {#performanceobserverentrylist}

**Added in: v19.0.0**

`PerformanceObserverEntryList` 클래스. 자세한 내용은 [`PerformanceObserverEntryList`](/ko/nodejs/api/perf_hooks#class-performanceobserverentrylist)를 참조하세요.


## `PerformanceResourceTiming` {#performanceresourcetiming}

**추가된 버전: v19.0.0**

`PerformanceResourceTiming` 클래스. 자세한 내용은 [`PerformanceResourceTiming`](/ko/nodejs/api/perf_hooks#class-performanceresourcetiming)을 참조하십시오.

## `performance` {#performance}

**추가된 버전: v16.0.0**

[`perf_hooks.performance`](/ko/nodejs/api/perf_hooks#perf_hooksperformance) 객체.

## `process` {#process}

**추가된 버전: v0.1.7**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

process 객체. [`process` 객체](/ko/nodejs/api/process#process) 섹션을 참조하십시오.

## `queueMicrotask(callback)` {#queuemicrotaskcallback}

**추가된 버전: v11.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 큐에 넣을 함수.

`queueMicrotask()` 메서드는 마이크로태스크를 큐에 넣어 `callback`을 호출합니다. `callback`이 예외를 발생시키면 [`process` 객체](/ko/nodejs/api/process#process) `'uncaughtException'` 이벤트가 발생합니다.

마이크로태스크 큐는 V8에 의해 관리되며 Node.js에 의해 관리되는 [`process.nextTick()`](/ko/nodejs/api/process#processnexttickcallback-args) 큐와 유사한 방식으로 사용될 수 있습니다. `process.nextTick()` 큐는 Node.js 이벤트 루프의 각 턴에서 항상 마이크로태스크 큐보다 먼저 처리됩니다.

```js [ESM]
// 여기에서 `queueMicrotask()`는 'load' 이벤트가 항상
// 비동기적으로 발생하도록 보장하는 데 사용되므로 일관성이 유지됩니다.
// `process.nextTick()`을 여기에서 사용하면 'load' 이벤트가 항상 다른 프라미스 작업보다
// 먼저 발생합니다.

DataHandler.prototype.load = async function load(key) {
  const hit = this._cache.get(key);
  if (hit !== undefined) {
    queueMicrotask(() => {
      this.emit('load', hit);
    });
    return;
  }

  const data = await fetchData(key);
  this._cache.set(key, data);
  this.emit('load', data);
};
```
## 클래스: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

**추가된 버전: v18.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적.
:::

[`ReadableByteStreamController`](/ko/nodejs/api/webstreams#class-readablebytestreamcontroller)의 브라우저 호환 구현입니다.


## 클래스: `ReadableStream` {#class-readablestream}

**추가된 버전: v18.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적.
:::

[`ReadableStream`](/ko/nodejs/api/webstreams#class-readablestream)의 브라우저 호환 구현입니다.

## 클래스: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}

**추가된 버전: v18.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적.
:::

[`ReadableStreamBYOBReader`](/ko/nodejs/api/webstreams#class-readablestreambyobreader)의 브라우저 호환 구현입니다.

## 클래스: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

**추가된 버전: v18.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적.
:::

[`ReadableStreamBYOBRequest`](/ko/nodejs/api/webstreams#class-readablestreambyobrequest)의 브라우저 호환 구현입니다.

## 클래스: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**추가된 버전: v18.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적.
:::

[`ReadableStreamDefaultController`](/ko/nodejs/api/webstreams#class-readablestreamdefaultcontroller)의 브라우저 호환 구현입니다.

## 클래스: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

**추가된 버전: v18.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적.
:::

[`ReadableStreamDefaultReader`](/ko/nodejs/api/webstreams#class-readablestreamdefaultreader)의 브라우저 호환 구현입니다.

## `require()` {#require}

이 변수는 전역으로 보일 수 있지만 그렇지 않습니다. [`require()`](/ko/nodejs/api/modules#requireid)를 참조하십시오.

## `Response` {#response}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.0.0 | 더 이상 실험적이지 않습니다. |
| v18.0.0 | 더 이상 `--experimental-fetch` CLI 플래그 뒤에 있지 않습니다. |
| v17.5.0, v16.15.0 | 추가된 버전: v17.5.0, v16.15.0 |
:::

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

[\<Response\>](https://developer.mozilla.org/en-US/docs/Web/API/Response)의 브라우저 호환 구현입니다.


## `Request` {#request}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v21.0.0 | 더 이상 실험적이지 않습니다. |
| v18.0.0 | 더 이상 `--experimental-fetch` CLI 플래그 뒤에 있지 않습니다. |
| v17.5.0, v16.15.0 | 추가됨: v17.5.0, v16.15.0 |
:::

::: tip [안정적: 2 - 안정적]
[안정적: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

[\<Request\>](https://developer.mozilla.org/en-US/docs/Web/API/Request)의 브라우저 호환 구현입니다.

## `sessionStorage` {#sessionstorage}

**추가됨: v22.4.0**

::: warning [안정적: 1 - 실험적]
[안정적: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).0 - 초기 개발 단계입니다.
:::

[`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)의 브라우저 호환 구현입니다. 데이터는 10MB의 저장 공간 할당량으로 메모리에 저장됩니다. `sessionStorage` 데이터는 현재 실행 중인 프로세스 내에서만 유지되며 워커 간에 공유되지 않습니다.

## `setImmediate(callback[, ...args])` {#setimmediatecallback-args}

**추가됨: v0.9.1**

[`setImmediate`](/ko/nodejs/api/timers#setimmediatecallback-args)는 [타이머](/ko/nodejs/api/timers) 섹션에 설명되어 있습니다.

## `setInterval(callback, delay[, ...args])` {#setintervalcallback-delay-args}

**추가됨: v0.0.1**

[`setInterval`](/ko/nodejs/api/timers#setintervalcallback-delay-args)은 [타이머](/ko/nodejs/api/timers) 섹션에 설명되어 있습니다.

## `setTimeout(callback, delay[, ...args])` {#settimeoutcallback-delay-args}

**추가됨: v0.0.1**

[`setTimeout`](/ko/nodejs/api/timers#settimeoutcallback-delay-args)은 [타이머](/ko/nodejs/api/timers) 섹션에 설명되어 있습니다.

## Class: `Storage` {#class-storage}

**추가됨: v22.4.0**

::: warning [안정적: 1 - 실험적]
[안정적: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).0 - 초기 개발 단계입니다.
:::

[`Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage)의 브라우저 호환 구현입니다. [`--experimental-webstorage`](/ko/nodejs/api/cli#--experimental-webstorage) CLI 플래그를 사용하여 이 API를 활성화하십시오.

## `structuredClone(value[, options])` {#structuredclonevalue-options}

**추가됨: v17.0.0**

WHATWG [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) 메서드.


## `SubtleCrypto` {#subtlecrypto}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 더 이상 `--experimental-global-webcrypto` CLI 플래그 뒤에 있지 않습니다. |
| v17.6.0, v16.15.0 | 추가됨: v17.6.0, v16.15.0 |
:::

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적입니다.
:::

[\<SubtleCrypto\>](/ko/nodejs/api/webcrypto#class-subtlecrypto)의 브라우저 호환 구현입니다. 이 전역은 Node.js 바이너리가 `node:crypto` 모듈에 대한 지원을 포함하여 컴파일된 경우에만 사용할 수 있습니다.

## `DOMException` {#domexception}

**추가됨: v17.0.0**

WHATWG `DOMException` 클래스입니다. 자세한 내용은 [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException)을 참조하세요.

## `TextDecoder` {#textdecoder}

**추가됨: v11.0.0**

WHATWG `TextDecoder` 클래스입니다. [`TextDecoder`](/ko/nodejs/api/util#class-utiltextdecoder) 섹션을 참조하세요.

## 클래스: `TextDecoderStream` {#class-textdecoderstream}

**추가됨: v18.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적입니다.
:::

[`TextDecoderStream`](/ko/nodejs/api/webstreams#class-textdecoderstream)의 브라우저 호환 구현입니다.

## `TextEncoder` {#textencoder}

**추가됨: v11.0.0**

WHATWG `TextEncoder` 클래스입니다. [`TextEncoder`](/ko/nodejs/api/util#class-utiltextencoder) 섹션을 참조하세요.

## 클래스: `TextEncoderStream` {#class-textencoderstream}

**추가됨: v18.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적입니다.
:::

[`TextEncoderStream`](/ko/nodejs/api/webstreams#class-textencoderstream)의 브라우저 호환 구현입니다.

## 클래스: `TransformStream` {#class-transformstream}

**추가됨: v18.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적입니다.
:::

[`TransformStream`](/ko/nodejs/api/webstreams#class-transformstream)의 브라우저 호환 구현입니다.

## 클래스: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}

**추가됨: v18.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적입니다.
:::

[`TransformStreamDefaultController`](/ko/nodejs/api/webstreams#class-transformstreamdefaultcontroller)의 브라우저 호환 구현입니다.


## `URL` {#url}

**Added in: v10.0.0**

WHATWG `URL` 클래스입니다. [`URL`](/ko/nodejs/api/url#class-url) 섹션을 참조하십시오.

## `URLSearchParams` {#urlsearchparams}

**Added in: v10.0.0**

WHATWG `URLSearchParams` 클래스입니다. [`URLSearchParams`](/ko/nodejs/api/url#class-urlsearchparams) 섹션을 참조하십시오.

## `WebAssembly` {#webassembly}

**Added in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

모든 W3C [WebAssembly](https://webassembly.org/) 관련 기능의 네임스페이스 역할을 하는 객체입니다. 사용법 및 호환성은 [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/WebAssembly)를 참조하십시오.

## `WebSocket` {#websocket}

::: info [History]
| Version | Changes |
| --- | --- |
| v22.4.0 | 더 이상 실험적이지 않습니다. |
| v22.0.0 | 더 이상 `--experimental-websocket` CLI 플래그 뒤에 있지 않습니다. |
| v21.0.0, v20.10.0 | Added in: v21.0.0, v20.10.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [Stability: 2](/ko/nodejs/api/documentation#stability-index) - 안정적입니다.
:::

[`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)의 브라우저 호환 구현입니다. [`--no-experimental-websocket`](/ko/nodejs/api/cli#--no-experimental-websocket) CLI 플래그로 이 API를 비활성화합니다.

## Class: `WritableStream` {#class-writablestream}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적입니다.
:::

[`WritableStream`](/ko/nodejs/api/webstreams#class-writablestream)의 브라우저 호환 구현입니다.

## Class: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적입니다.
:::

[`WritableStreamDefaultController`](/ko/nodejs/api/webstreams#class-writablestreamdefaultcontroller)의 브라우저 호환 구현입니다.

## Class: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적입니다.
:::

[`WritableStreamDefaultWriter`](/ko/nodejs/api/webstreams#class-writablestreamdefaultwriter)의 브라우저 호환 구현입니다.

