---
title: Node.js Global Objects
description: This page documents the global objects available in Node.js, including global variables, functions, and classes that are accessible from any module without requiring explicit import.
head:
  - - meta
    - name: og:title
      content: Node.js Global Objects | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: This page documents the global objects available in Node.js, including global variables, functions, and classes that are accessible from any module without requiring explicit import.
  - - meta
    - name: twitter:title
      content: Node.js Global Objects | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: This page documents the global objects available in Node.js, including global variables, functions, and classes that are accessible from any module without requiring explicit import.
---

# Global objects {#global-objects}

These objects are available in all modules.

The following variables may appear to be global but are not. They exist only in the scope of [CommonJS modules](/nodejs/api/modules):

- [`__dirname`](/nodejs/api/modules#__dirname)
- [`__filename`](/nodejs/api/modules#__filename)
- [`exports`](/nodejs/api/modules#exports)
- [`module`](/nodejs/api/modules#module)
- [`require()`](/nodejs/api/modules#requireid)

The objects listed here are specific to Node.js. There are [built-in objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects) that are part of the JavaScript language itself, which are also globally accessible.

## Class: `AbortController` {#class-abortcontroller}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.4.0 | No longer experimental. |
| v15.0.0, v14.17.0 | Added in: v15.0.0, v14.17.0 |
:::

A utility class used to signal cancelation in selected `Promise`-based APIs. The API is based on the Web API [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/AbortController).

```js [ESM]
const ac = new AbortController();

ac.signal.addEventListener('abort', () => console.log('Aborted!'),
                           { once: true });

ac.abort();

console.log(ac.signal.aborted);  // Prints true
```
### `abortController.abort([reason])` {#abortcontrollerabortreason}


::: info [History]
| Version | Changes |
| --- | --- |
| v17.2.0, v16.14.0 | Added the new optional reason argument. |
| v15.0.0, v14.17.0 | Added in: v15.0.0, v14.17.0 |
:::

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) An optional reason, retrievable on the `AbortSignal`'s `reason` property.

Triggers the abort signal, causing the `abortController.signal` to emit the `'abort'` event.

### `abortController.signal` {#abortcontrollersignal}

**Added in: v15.0.0, v14.17.0**

- Type: [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal)

### Class: `AbortSignal` {#class-abortsignal}

**Added in: v15.0.0, v14.17.0**

- Extends: [\<EventTarget\>](/nodejs/api/events#class-eventtarget)

The `AbortSignal` is used to notify observers when the `abortController.abort()` method is called.

#### Static method: `AbortSignal.abort([reason])` {#static-method-abortsignalabortreason}


::: info [History]
| Version | Changes |
| --- | --- |
| v17.2.0, v16.14.0 | Added the new optional reason argument. |
| v15.12.0, v14.17.0 | Added in: v15.12.0, v14.17.0 |
:::

- `reason`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal)

Returns a new already aborted `AbortSignal`.

#### Static method: `AbortSignal.timeout(delay)` {#static-method-abortsignaltimeoutdelay}

**Added in: v17.3.0, v16.14.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of milliseconds to wait before triggering the AbortSignal.

Returns a new `AbortSignal` which will be aborted in `delay` milliseconds.

#### Static method: `AbortSignal.any(signals)` {#static-method-abortsignalanysignals}

**Added in: v20.3.0, v18.17.0**

- `signals` [\<AbortSignal[]\>](/nodejs/api/globals#class-abortsignal) The `AbortSignal`s of which to compose a new `AbortSignal`.

Returns a new `AbortSignal` which will be aborted if any of the provided signals are aborted. Its [`abortSignal.reason`](/nodejs/api/globals#abortsignalreason) will be set to whichever one of the `signals` caused it to be aborted.

#### Event: `'abort'` {#event-abort}

**Added in: v15.0.0, v14.17.0**

The `'abort'` event is emitted when the `abortController.abort()` method is called. The callback is invoked with a single object argument with a single `type` property set to `'abort'`:

```js [ESM]
const ac = new AbortController();

// Use either the onabort property...
ac.signal.onabort = () => console.log('aborted!');

// Or the EventTarget API...
ac.signal.addEventListener('abort', (event) => {
  console.log(event.type);  // Prints 'abort'
}, { once: true });

ac.abort();
```
The `AbortController` with which the `AbortSignal` is associated will only ever trigger the `'abort'` event once. We recommended that code check that the `abortSignal.aborted` attribute is `false` before adding an `'abort'` event listener.

Any event listeners attached to the `AbortSignal` should use the `{ once: true }` option (or, if using the `EventEmitter` APIs to attach a listener, use the `once()` method) to ensure that the event listener is removed as soon as the `'abort'` event is handled. Failure to do so may result in memory leaks.

#### `abortSignal.aborted` {#abortsignalaborted}

**Added in: v15.0.0, v14.17.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) True after the `AbortController` has been aborted.

#### `abortSignal.onabort` {#abortsignalonabort}

**Added in: v15.0.0, v14.17.0**

- Type: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

An optional callback function that may be set by user code to be notified when the `abortController.abort()` function has been called.

#### `abortSignal.reason` {#abortsignalreason}

**Added in: v17.2.0, v16.14.0**

- Type: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

An optional reason specified when the `AbortSignal` was triggered.

```js [ESM]
const ac = new AbortController();
ac.abort(new Error('boom!'));
console.log(ac.signal.reason);  // Error: boom!
```
#### `abortSignal.throwIfAborted()` {#abortsignalthrowifaborted}

**Added in: v17.3.0, v16.17.0**

If `abortSignal.aborted` is `true`, throws `abortSignal.reason`.

## Class: `Blob` {#class-blob}

**Added in: v18.0.0**

See [\<Blob\>](/nodejs/api/buffer#class-blob).

## Class: `Buffer` {#class-buffer}

**Added in: v0.1.103**

- [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Used to handle binary data. See the [buffer section](/nodejs/api/buffer).

## Class: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`ByteLengthQueuingStrategy`](/nodejs/api/webstreams#class-bytelengthqueuingstrategy).

## `__dirname` {#__dirname}

This variable may appear to be global but is not. See [`__dirname`](/nodejs/api/modules#__dirname).

## `__filename` {#__filename}

This variable may appear to be global but is not. See [`__filename`](/nodejs/api/modules#__filename).

## `atob(data)` {#atobdata}

**Added in: v16.0.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/nodejs/api/documentation#stability-index) [Stability: 3](/nodejs/api/documentation#stability-index) - Legacy. Use `Buffer.from(data, 'base64')` instead.
:::

Global alias for [`buffer.atob()`](/nodejs/api/buffer#bufferatobdata).

## `BroadcastChannel` {#broadcastchannel}

**Added in: v18.0.0**

See [\<BroadcastChannel\>](/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget).

## `btoa(data)` {#btoadata}

**Added in: v16.0.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/nodejs/api/documentation#stability-index) [Stability: 3](/nodejs/api/documentation#stability-index) - Legacy. Use `buf.toString('base64')` instead.
:::

Global alias for [`buffer.btoa()`](/nodejs/api/buffer#bufferbtoadata).

## `clearImmediate(immediateObject)` {#clearimmediateimmediateobject}

**Added in: v0.9.1**

[`clearImmediate`](/nodejs/api/timers#clearimmediateimmediate) is described in the [timers](/nodejs/api/timers) section.

## `clearInterval(intervalObject)` {#clearintervalintervalobject}

**Added in: v0.0.1**

[`clearInterval`](/nodejs/api/timers#clearintervaltimeout) is described in the [timers](/nodejs/api/timers) section.

## `clearTimeout(timeoutObject)` {#cleartimeouttimeoutobject}

**Added in: v0.0.1**

[`clearTimeout`](/nodejs/api/timers#cleartimeouttimeout) is described in the [timers](/nodejs/api/timers) section.

## `CloseEvent` {#closeevent}

**Added in: v23.0.0**

The `CloseEvent` class. See [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/CloseEvent/CloseEvent) for more details.

A browser-compatible implementation of [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/CloseEvent/CloseEvent). Disable this API with the [`--no-experimental-websocket`](/nodejs/api/cli#--no-experimental-websocket) CLI flag.

## Class: `CompressionStream` {#class-compressionstream}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`CompressionStream`](/nodejs/api/webstreams#class-compressionstream).

## `console` {#console}

**Added in: v0.1.100**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Used to print to stdout and stderr. See the [`console`](/nodejs/api/console) section.

## Class: `CountQueuingStrategy` {#class-countqueuingstrategy}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`CountQueuingStrategy`](/nodejs/api/webstreams#class-countqueuingstrategy).

## `Crypto` {#crypto}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | No longer experimental. |
| v19.0.0 | No longer behind `--experimental-global-webcrypto` CLI flag. |
| v17.6.0, v16.15.0 | Added in: v17.6.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable.
:::

A browser-compatible implementation of [\<Crypto\>](/nodejs/api/webcrypto#class-crypto). This global is available only if the Node.js binary was compiled with including support for the `node:crypto` module.

## `crypto` {#crypto_1}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | No longer experimental. |
| v19.0.0 | No longer behind `--experimental-global-webcrypto` CLI flag. |
| v17.6.0, v16.15.0 | Added in: v17.6.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable.
:::

A browser-compatible implementation of the [Web Crypto API](/nodejs/api/webcrypto).

## `CryptoKey` {#cryptokey}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | No longer experimental. |
| v19.0.0 | No longer behind `--experimental-global-webcrypto` CLI flag. |
| v17.6.0, v16.15.0 | Added in: v17.6.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable.
:::

A browser-compatible implementation of [\<CryptoKey\>](/nodejs/api/webcrypto#class-cryptokey). This global is available only if the Node.js binary was compiled with including support for the `node:crypto` module.

## `CustomEvent` {#customevent}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | No longer experimental. |
| v22.1.0, v20.13.0 | CustomEvent is now stable. |
| v19.0.0 | No longer behind `--experimental-global-customevent` CLI flag. |
| v18.7.0, v16.17.0 | Added in: v18.7.0, v16.17.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

A browser-compatible implementation of the [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent).

## Class: `DecompressionStream` {#class-decompressionstream}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`DecompressionStream`](/nodejs/api/webstreams#class-decompressionstream).

## `Event` {#event}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.4.0 | No longer experimental. |
| v15.0.0 | Added in: v15.0.0 |
:::

A browser-compatible implementation of the `Event` class. See [`EventTarget` and `Event` API](/nodejs/api/events#eventtarget-and-event-api) for more details.

## `EventSource` {#eventsource}

**Added in: v22.3.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental. Enable this API with the [`--experimental-eventsource`](/nodejs/api/cli#--experimental-eventsource) CLI flag.
:::

A browser-compatible implementation of the [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/EventSource) class.

## `EventTarget` {#eventtarget}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.4.0 | No longer experimental. |
| v15.0.0 | Added in: v15.0.0 |
:::

A browser-compatible implementation of the `EventTarget` class. See [`EventTarget` and `Event` API](/nodejs/api/events#eventtarget-and-event-api) for more details.

## `exports` {#exports}

This variable may appear to be global but is not. See [`exports`](/nodejs/api/modules#exports).

## `fetch` {#fetch}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | No longer experimental. |
| v18.0.0 | No longer behind `--experimental-fetch` CLI flag. |
| v17.5.0, v16.15.0 | Added in: v17.5.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

A browser-compatible implementation of the [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/fetch) function.

## Class: `File` {#class-file}

**Added in: v20.0.0**

See [\<File\>](/nodejs/api/buffer#class-file).

## Class `FormData` {#class-formdata}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | No longer experimental. |
| v18.0.0 | No longer behind `--experimental-fetch` CLI flag. |
| v17.6.0, v16.15.0 | Added in: v17.6.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

A browser-compatible implementation of [\<FormData\>](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/FormData).

## `global` {#global}

**Added in: v0.1.27**

::: info [Stable: 3 - Legacy]
[Stable: 3](/nodejs/api/documentation#stability-index) [Stability: 3](/nodejs/api/documentation#stability-index) - Legacy. Use [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) instead.
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) The global namespace object.

In browsers, the top-level scope has traditionally been the global scope. This means that `var something` will define a new global variable, except within ECMAScript modules. In Node.js, this is different. The top-level scope is not the global scope; `var something` inside a Node.js module will be local to that module, regardless of whether it is a [CommonJS module](/nodejs/api/modules) or an [ECMAScript module](/nodejs/api/esm).

## Class `Headers` {#class-headers}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | No longer experimental. |
| v18.0.0 | No longer behind `--experimental-fetch` CLI flag. |
| v17.5.0, v16.15.0 | Added in: v17.5.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

A browser-compatible implementation of [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/Headers).

## `localStorage` {#localstorage}

**Added in: v22.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).0 - Early development.
:::

A browser-compatible implementation of [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/Window/localStorage). Data is stored unencrypted in the file specified by the [`--localstorage-file`](/nodejs/api/cli#--localstorage-filefile) CLI flag. The maximum amount of data that can be stored is 10 MB. Any modification of this data outside of the Web Storage API is not supported. Enable this API with the [`--experimental-webstorage`](/nodejs/api/cli#--experimental-webstorage) CLI flag. `localStorage` data is not stored per user or per request when used in the context of a server, it is shared across all users and requests.

## `MessageChannel` {#messagechannel}

**Added in: v15.0.0**

The `MessageChannel` class. See [`MessageChannel`](/nodejs/api/worker_threads#class-messagechannel) for more details.

## `MessageEvent` {#messageevent}

**Added in: v15.0.0**

The `MessageEvent` class. See [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/MessageEvent/MessageEvent) for more details.

## `MessagePort` {#messageport}

**Added in: v15.0.0**

The `MessagePort` class. See [`MessagePort`](/nodejs/api/worker_threads#class-messageport) for more details.

## `module` {#module}

This variable may appear to be global but is not. See [`module`](/nodejs/api/modules#module).

## `Navigator` {#navigator}

**Added in: v21.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).1 - Active development. Disable this API with the [`--no-experimental-global-navigator`](/nodejs/api/cli#--no-experimental-global-navigator) CLI flag.
:::

A partial implementation of the [Navigator API](https://html.spec.whatwg.org/multipage/system-state#the-navigator-object).

## `navigator` {#navigator_1}

**Added in: v21.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).1 - Active development. Disable this API with the [`--no-experimental-global-navigator`](/nodejs/api/cli#--no-experimental-global-navigator) CLI flag.
:::

A partial implementation of [`window.navigator`](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/Window/navigator).

### `navigator.hardwareConcurrency` {#navigatorhardwareconcurrency}

**Added in: v21.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The `navigator.hardwareConcurrency` read-only property returns the number of logical processors available to the current Node.js instance.

```js [ESM]
console.log(`This process is running on ${navigator.hardwareConcurrency} logical processors`);
```
### `navigator.language` {#navigatorlanguage}

**Added in: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The `navigator.language` read-only property returns a string representing the preferred language of the Node.js instance. The language will be determined by the ICU library used by Node.js at runtime based on the default language of the operating system.

The value is representing the language version as defined in [RFC 5646](https://www.rfc-editor.org/rfc/rfc5646.txt).

The fallback value on builds without ICU is `'en-US'`.

```js [ESM]
console.log(`The preferred language of the Node.js instance has the tag '${navigator.language}'`);
```
### `navigator.languages` {#navigatorlanguages}

**Added in: v21.2.0**

- {Array

The `navigator.languages` read-only property returns an array of strings representing the preferred languages of the Node.js instance. By default `navigator.languages` contains only the value of `navigator.language`, which will be determined by the ICU library used by Node.js at runtime based on the default language of the operating system.

The fallback value on builds without ICU is `['en-US']`.

```js [ESM]
console.log(`The preferred languages are '${navigator.languages}'`);
```
### `navigator.platform` {#navigatorplatform}

**Added in: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The `navigator.platform` read-only property returns a string identifying the platform on which the Node.js instance is running.

```js [ESM]
console.log(`This process is running on ${navigator.platform}`);
```
### `navigator.userAgent` {#navigatoruseragent}

**Added in: v21.1.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The `navigator.userAgent` read-only property returns user agent consisting of the runtime name and major version number.

```js [ESM]
console.log(`The user-agent is ${navigator.userAgent}`); // Prints "Node.js/21"
```
## `PerformanceEntry` {#performanceentry}

**Added in: v19.0.0**

The `PerformanceEntry` class. See [`PerformanceEntry`](/nodejs/api/perf_hooks#class-performanceentry) for more details.

## `PerformanceMark` {#performancemark}

**Added in: v19.0.0**

The `PerformanceMark` class. See [`PerformanceMark`](/nodejs/api/perf_hooks#class-performancemark) for more details.

## `PerformanceMeasure` {#performancemeasure}

**Added in: v19.0.0**

The `PerformanceMeasure` class. See [`PerformanceMeasure`](/nodejs/api/perf_hooks#class-performancemeasure) for more details.

## `PerformanceObserver` {#performanceobserver}

**Added in: v19.0.0**

The `PerformanceObserver` class. See [`PerformanceObserver`](/nodejs/api/perf_hooks#class-performanceobserver) for more details.

## `PerformanceObserverEntryList` {#performanceobserverentrylist}

**Added in: v19.0.0**

The `PerformanceObserverEntryList` class. See [`PerformanceObserverEntryList`](/nodejs/api/perf_hooks#class-performanceobserverentrylist) for more details.

## `PerformanceResourceTiming` {#performanceresourcetiming}

**Added in: v19.0.0**

The `PerformanceResourceTiming` class. See [`PerformanceResourceTiming`](/nodejs/api/perf_hooks#class-performanceresourcetiming) for more details.

## `performance` {#performance}

**Added in: v16.0.0**

The [`perf_hooks.performance`](/nodejs/api/perf_hooks#perf_hooksperformance) object.

## `process` {#process}

**Added in: v0.1.7**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

The process object. See the [`process` object](/nodejs/api/process#process) section.

## `queueMicrotask(callback)` {#queuemicrotaskcallback}

**Added in: v11.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Function to be queued.

The `queueMicrotask()` method queues a microtask to invoke `callback`. If `callback` throws an exception, the [`process` object](/nodejs/api/process#process) `'uncaughtException'` event will be emitted.

The microtask queue is managed by V8 and may be used in a similar manner to the [`process.nextTick()`](/nodejs/api/process#processnexttickcallback-args) queue, which is managed by Node.js. The `process.nextTick()` queue is always processed before the microtask queue within each turn of the Node.js event loop.

```js [ESM]
// Here, `queueMicrotask()` is used to ensure the 'load' event is always
// emitted asynchronously, and therefore consistently. Using
// `process.nextTick()` here would result in the 'load' event always emitting
// before any other promise jobs.

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
## Class: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`ReadableByteStreamController`](/nodejs/api/webstreams#class-readablebytestreamcontroller).

## Class: `ReadableStream` {#class-readablestream}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`ReadableStream`](/nodejs/api/webstreams#class-readablestream).

## Class: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`ReadableStreamBYOBReader`](/nodejs/api/webstreams#class-readablestreambyobreader).

## Class: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`ReadableStreamBYOBRequest`](/nodejs/api/webstreams#class-readablestreambyobrequest).

## Class: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`ReadableStreamDefaultController`](/nodejs/api/webstreams#class-readablestreamdefaultcontroller).

## Class: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`ReadableStreamDefaultReader`](/nodejs/api/webstreams#class-readablestreamdefaultreader).

## `require()` {#require}

This variable may appear to be global but is not. See [`require()`](/nodejs/api/modules#requireid).

## `Response` {#response}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | No longer experimental. |
| v18.0.0 | No longer behind `--experimental-fetch` CLI flag. |
| v17.5.0, v16.15.0 | Added in: v17.5.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

A browser-compatible implementation of [\<Response\>](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/Response).

## `Request` {#request}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | No longer experimental. |
| v18.0.0 | No longer behind `--experimental-fetch` CLI flag. |
| v17.5.0, v16.15.0 | Added in: v17.5.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

A browser-compatible implementation of [\<Request\>](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/Request).

## `sessionStorage` {#sessionstorage}

**Added in: v22.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).0 - Early development.
:::

A browser-compatible implementation of [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/Window/sessionStorage). Data is stored in memory, with a storage quota of 10 MB. `sessionStorage` data persists only within the currently running process, and is not shared between workers.

## `setImmediate(callback[, ...args])` {#setimmediatecallback-args}

**Added in: v0.9.1**

[`setImmediate`](/nodejs/api/timers#setimmediatecallback-args) is described in the [timers](/nodejs/api/timers) section.

## `setInterval(callback, delay[, ...args])` {#setintervalcallback-delay-args}

**Added in: v0.0.1**

[`setInterval`](/nodejs/api/timers#setintervalcallback-delay-args) is described in the [timers](/nodejs/api/timers) section.

## `setTimeout(callback, delay[, ...args])` {#settimeoutcallback-delay-args}

**Added in: v0.0.1**

[`setTimeout`](/nodejs/api/timers#settimeoutcallback-delay-args) is described in the [timers](/nodejs/api/timers) section.

## Class: `Storage` {#class-storage}

**Added in: v22.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).0 - Early development.
:::

A browser-compatible implementation of [`Storage`](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/Storage). Enable this API with the [`--experimental-webstorage`](/nodejs/api/cli#--experimental-webstorage) CLI flag.

## `structuredClone(value[, options])` {#structuredclonevalue-options}

**Added in: v17.0.0**

The WHATWG [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/structuredClone) method.

## `SubtleCrypto` {#subtlecrypto}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | No longer behind `--experimental-global-webcrypto` CLI flag. |
| v17.6.0, v16.15.0 | Added in: v17.6.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable.
:::

A browser-compatible implementation of [\<SubtleCrypto\>](/nodejs/api/webcrypto#class-subtlecrypto). This global is available only if the Node.js binary was compiled with including support for the `node:crypto` module.

## `DOMException` {#domexception}

**Added in: v17.0.0**

The WHATWG `DOMException` class. See [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/DOMException) for more details.

## `TextDecoder` {#textdecoder}

**Added in: v11.0.0**

The WHATWG `TextDecoder` class. See the [`TextDecoder`](/nodejs/api/util#class-utiltextdecoder) section.

## Class: `TextDecoderStream` {#class-textdecoderstream}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`TextDecoderStream`](/nodejs/api/webstreams#class-textdecoderstream).

## `TextEncoder` {#textencoder}

**Added in: v11.0.0**

The WHATWG `TextEncoder` class. See the [`TextEncoder`](/nodejs/api/util#class-utiltextencoder) section.

## Class: `TextEncoderStream` {#class-textencoderstream}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`TextEncoderStream`](/nodejs/api/webstreams#class-textencoderstream).

## Class: `TransformStream` {#class-transformstream}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`TransformStream`](/nodejs/api/webstreams#class-transformstream).

## Class: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`TransformStreamDefaultController`](/nodejs/api/webstreams#class-transformstreamdefaultcontroller).

## `URL` {#url}

**Added in: v10.0.0**

The WHATWG `URL` class. See the [`URL`](/nodejs/api/url#class-url) section.

## `URLSearchParams` {#urlsearchparams}

**Added in: v10.0.0**

The WHATWG `URLSearchParams` class. See the [`URLSearchParams`](/nodejs/api/url#class-urlsearchparams) section.

## `WebAssembly` {#webassembly}

**Added in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

The object that acts as the namespace for all W3C [WebAssembly](https://webassembly.org/) related functionality. See the [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/WebAssembly) for usage and compatibility.

## `WebSocket` {#websocket}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.4.0 | No longer experimental. |
| v22.0.0 | No longer behind `--experimental-websocket` CLI flag. |
| v21.0.0, v20.10.0 | Added in: v21.0.0, v20.10.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable.
:::

A browser-compatible implementation of [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/nodejs/api/WebSocket). Disable this API with the [`--no-experimental-websocket`](/nodejs/api/cli#--no-experimental-websocket) CLI flag.

## Class: `WritableStream` {#class-writablestream}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`WritableStream`](/nodejs/api/webstreams#class-writablestream).

## Class: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`WritableStreamDefaultController`](/nodejs/api/webstreams#class-writablestreamdefaultcontroller).

## Class: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental.
:::

A browser-compatible implementation of [`WritableStreamDefaultWriter`](/nodejs/api/webstreams#class-writablestreamdefaultwriter).

