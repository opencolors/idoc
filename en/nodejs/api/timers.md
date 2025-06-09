---
title: Node.js Timers API Documentation
description: The Node.js Timers module provides functions for scheduling functions to be called at some future period of time. This includes methods like setTimeout, setInterval, setImmediate, and their clear counterparts, along with process.nextTick for executing code in the next iteration of the event loop.
head:
  - - meta
    - name: og:title
      content: Node.js Timers API Documentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: The Node.js Timers module provides functions for scheduling functions to be called at some future period of time. This includes methods like setTimeout, setInterval, setImmediate, and their clear counterparts, along with process.nextTick for executing code in the next iteration of the event loop.
  - - meta
    - name: twitter:title
      content: Node.js Timers API Documentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: The Node.js Timers module provides functions for scheduling functions to be called at some future period of time. This includes methods like setTimeout, setInterval, setImmediate, and their clear counterparts, along with process.nextTick for executing code in the next iteration of the event loop.
---

# Timers {#timers}

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

**Source Code:** [lib/timers.js](https://github.com/nodejs/node/blob/v23.8.0/lib/timers.js)

The `timer` module exposes a global API for scheduling functions to be called at some future period of time. Because the timer functions are globals, there is no need to call `require('node:timers')` to use the API.

The timer functions within Node.js implement a similar API as the timers API provided by Web Browsers but use a different internal implementation that is built around the Node.js [Event Loop](https://nodejs.org/en/docs/nodejs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout).

## Class: `Immediate` {#class-immediate}

This object is created internally and is returned from [`setImmediate()`](/nodejs/api/timers#setimmediatecallback-args). It can be passed to [`clearImmediate()`](/nodejs/api/timers#clearimmediateimmediate) in order to cancel the scheduled actions.

By default, when an immediate is scheduled, the Node.js event loop will continue running as long as the immediate is active. The `Immediate` object returned by [`setImmediate()`](/nodejs/api/timers#setimmediatecallback-args) exports both `immediate.ref()` and `immediate.unref()` functions that can be used to control this default behavior.

### `immediate.hasRef()` {#immediatehasref}

**Added in: v11.0.0**

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

If true, the `Immediate` object will keep the Node.js event loop active.

### `immediate.ref()` {#immediateref}

**Added in: v9.7.0**

- Returns: [\<Immediate\>](/nodejs/api/timers#class-immediate) a reference to `immediate`

When called, requests that the Node.js event loop *not* exit so long as the `Immediate` is active. Calling `immediate.ref()` multiple times will have no effect.

By default, all `Immediate` objects are "ref'ed", making it normally unnecessary to call `immediate.ref()` unless `immediate.unref()` had been called previously.

### `immediate.unref()` {#immediateunref}

**Added in: v9.7.0**

- Returns: [\<Immediate\>](/nodejs/api/timers#class-immediate) a reference to `immediate`

When called, the active `Immediate` object will not require the Node.js event loop to remain active. If there is no other activity keeping the event loop running, the process may exit before the `Immediate` object's callback is invoked. Calling `immediate.unref()` multiple times will have no effect.

### `immediate[Symbol.dispose]()` {#immediatesymboldispose}

**Added in: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

Cancels the immediate. This is similar to calling `clearImmediate()`.

## Class: `Timeout` {#class-timeout}

This object is created internally and is returned from [`setTimeout()`](/nodejs/api/timers#settimeoutcallback-delay-args) and [`setInterval()`](/nodejs/api/timers#setintervalcallback-delay-args). It can be passed to either [`clearTimeout()`](/nodejs/api/timers#cleartimeouttimeout) or [`clearInterval()`](/nodejs/api/timers#clearintervaltimeout) in order to cancel the scheduled actions.

By default, when a timer is scheduled using either [`setTimeout()`](/nodejs/api/timers#settimeoutcallback-delay-args) or [`setInterval()`](/nodejs/api/timers#setintervalcallback-delay-args), the Node.js event loop will continue running as long as the timer is active. Each of the `Timeout` objects returned by these functions export both `timeout.ref()` and `timeout.unref()` functions that can be used to control this default behavior.

### `timeout.close()` {#timeoutclose}

**Added in: v0.9.1**

::: info [Stable: 3 - Legacy]
[Stable: 3](/nodejs/api/documentation#stability-index) [Stability: 3](/nodejs/api/documentation#stability-index) - Legacy: Use [`clearTimeout()`](/nodejs/api/timers#cleartimeouttimeout) instead.
:::

- Returns: [\<Timeout\>](/nodejs/api/timers#class-timeout) a reference to `timeout`

Cancels the timeout.

### `timeout.hasRef()` {#timeouthasref}

**Added in: v11.0.0**

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

If true, the `Timeout` object will keep the Node.js event loop active.

### `timeout.ref()` {#timeoutref}

**Added in: v0.9.1**

- Returns: [\<Timeout\>](/nodejs/api/timers#class-timeout) a reference to `timeout`

When called, requests that the Node.js event loop *not* exit so long as the `Timeout` is active. Calling `timeout.ref()` multiple times will have no effect.

By default, all `Timeout` objects are "ref'ed", making it normally unnecessary to call `timeout.ref()` unless `timeout.unref()` had been called previously.

### `timeout.refresh()` {#timeoutrefresh}

**Added in: v10.2.0**

- Returns: [\<Timeout\>](/nodejs/api/timers#class-timeout) a reference to `timeout`

Sets the timer's start time to the current time, and reschedules the timer to call its callback at the previously specified duration adjusted to the current time. This is useful for refreshing a timer without allocating a new JavaScript object.

Using this on a timer that has already called its callback will reactivate the timer.

### `timeout.unref()` {#timeoutunref}

**Added in: v0.9.1**

- Returns: [\<Timeout\>](/nodejs/api/timers#class-timeout) a reference to `timeout`

When called, the active `Timeout` object will not require the Node.js event loop to remain active. If there is no other activity keeping the event loop running, the process may exit before the `Timeout` object's callback is invoked. Calling `timeout.unref()` multiple times will have no effect.

### `timeout[Symbol.toPrimitive]()` {#timeoutsymboltoprimitive}

**Added in: v14.9.0, v12.19.0**

- Returns: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) a number that can be used to reference this `timeout`

Coerce a `Timeout` to a primitive. The primitive can be used to clear the `Timeout`. The primitive can only be used in the same thread where the timeout was created. Therefore, to use it across [`worker_threads`](/nodejs/api/worker_threads) it must first be passed to the correct thread. This allows enhanced compatibility with browser `setTimeout()` and `setInterval()` implementations.

### `timeout[Symbol.dispose]()` {#timeoutsymboldispose}

**Added in: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

Cancels the timeout.

## Scheduling timers {#scheduling-timers}

A timer in Node.js is an internal construct that calls a given function after a certain period of time. When a timer's function is called varies depending on which method was used to create the timer and what other work the Node.js event loop is doing.

### `setImmediate(callback[, ...args])` {#setimmediatecallback-args}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v0.9.1 | Added in: v0.9.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The function to call at the end of this turn of the Node.js [Event Loop](https://nodejs.org/en/docs/nodejs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optional arguments to pass when the `callback` is called.
- Returns: [\<Immediate\>](/nodejs/api/timers#class-immediate) for use with [`clearImmediate()`](/nodejs/api/timers#clearimmediateimmediate)

Schedules the "immediate" execution of the `callback` after I/O events' callbacks.

When multiple calls to `setImmediate()` are made, the `callback` functions are queued for execution in the order in which they are created. The entire callback queue is processed every event loop iteration. If an immediate timer is queued from inside an executing callback, that timer will not be triggered until the next event loop iteration.

If `callback` is not a function, a [`TypeError`](/nodejs/api/errors#class-typeerror) will be thrown.

This method has a custom variant for promises that is available using [`timersPromises.setImmediate()`](/nodejs/api/timers#timerspromisessetimmediatevalue-options).

### `setInterval(callback[, delay[, ...args]])` {#setintervalcallback-delay-args}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v0.0.1 | Added in: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The function to call when the timer elapses.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of milliseconds to wait before calling the `callback`. **Default:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optional arguments to pass when the `callback` is called.
- Returns: [\<Timeout\>](/nodejs/api/timers#class-timeout) for use with [`clearInterval()`](/nodejs/api/timers#clearintervaltimeout)

Schedules repeated execution of `callback` every `delay` milliseconds.

When `delay` is larger than `2147483647` or less than `1` or `NaN`, the `delay` will be set to `1`. Non-integer delays are truncated to an integer.

If `callback` is not a function, a [`TypeError`](/nodejs/api/errors#class-typeerror) will be thrown.

This method has a custom variant for promises that is available using [`timersPromises.setInterval()`](/nodejs/api/timers#timerspromisessetintervaldelay-value-options).

### `setTimeout(callback[, delay[, ...args]])` {#settimeoutcallback-delay-args}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Passing an invalid callback to the `callback` argument now throws `ERR_INVALID_ARG_TYPE` instead of `ERR_INVALID_CALLBACK`. |
| v0.0.1 | Added in: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The function to call when the timer elapses.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of milliseconds to wait before calling the `callback`. **Default:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optional arguments to pass when the `callback` is called.
- Returns: [\<Timeout\>](/nodejs/api/timers#class-timeout) for use with [`clearTimeout()`](/nodejs/api/timers#cleartimeouttimeout)

Schedules execution of a one-time `callback` after `delay` milliseconds.

The `callback` will likely not be invoked in precisely `delay` milliseconds. Node.js makes no guarantees about the exact timing of when callbacks will fire, nor of their ordering. The callback will be called as close as possible to the time specified.

When `delay` is larger than `2147483647` or less than `1` or `NaN`, the `delay` will be set to `1`. Non-integer delays are truncated to an integer.

If `callback` is not a function, a [`TypeError`](/nodejs/api/errors#class-typeerror) will be thrown.

This method has a custom variant for promises that is available using [`timersPromises.setTimeout()`](/nodejs/api/timers#timerspromisessettimeoutdelay-value-options).

## Cancelling timers {#cancelling-timers}

The [`setImmediate()`](/nodejs/api/timers#setimmediatecallback-args), [`setInterval()`](/nodejs/api/timers#setintervalcallback-delay-args), and [`setTimeout()`](/nodejs/api/timers#settimeoutcallback-delay-args) methods each return objects that represent the scheduled timers. These can be used to cancel the timer and prevent it from triggering.

For the promisified variants of [`setImmediate()`](/nodejs/api/timers#setimmediatecallback-args) and [`setTimeout()`](/nodejs/api/timers#settimeoutcallback-delay-args), an [`AbortController`](/nodejs/api/globals#class-abortcontroller) may be used to cancel the timer. When canceled, the returned Promises will be rejected with an `'AbortError'`.

For `setImmediate()`:



::: code-group
```js [ESM]
import { setImmediate as setImmediatePromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// We do not `await` the promise so `ac.abort()` is called concurrently.
setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The immediate was aborted');
  });

ac.abort();
```

```js [CJS]
const { setImmediate: setImmediatePromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The immediate was aborted');
  });

ac.abort();
```
:::

For `setTimeout()`:



::: code-group
```js [ESM]
import { setTimeout as setTimeoutPromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// We do not `await` the promise so `ac.abort()` is called concurrently.
setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The timeout was aborted');
  });

ac.abort();
```

```js [CJS]
const { setTimeout: setTimeoutPromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The timeout was aborted');
  });

ac.abort();
```
:::

### `clearImmediate(immediate)` {#clearimmediateimmediate}

**Added in: v0.9.1**

- `immediate` [\<Immediate\>](/nodejs/api/timers#class-immediate) An `Immediate` object as returned by [`setImmediate()`](/nodejs/api/timers#setimmediatecallback-args).

Cancels an `Immediate` object created by [`setImmediate()`](/nodejs/api/timers#setimmediatecallback-args).

### `clearInterval(timeout)` {#clearintervaltimeout}

**Added in: v0.0.1**

- `timeout` [\<Timeout\>](/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A `Timeout` object as returned by [`setInterval()`](/nodejs/api/timers#setintervalcallback-delay-args) or the [primitive](/nodejs/api/timers#timeoutsymboltoprimitive) of the `Timeout` object as a string or a number.

Cancels a `Timeout` object created by [`setInterval()`](/nodejs/api/timers#setintervalcallback-delay-args).

### `clearTimeout(timeout)` {#cleartimeouttimeout}

**Added in: v0.0.1**

- `timeout` [\<Timeout\>](/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A `Timeout` object as returned by [`setTimeout()`](/nodejs/api/timers#settimeoutcallback-delay-args) or the [primitive](/nodejs/api/timers#timeoutsymboltoprimitive) of the `Timeout` object as a string or a number.

Cancels a `Timeout` object created by [`setTimeout()`](/nodejs/api/timers#settimeoutcallback-delay-args).

## Timers Promises API {#timers-promises-api}


::: info [History]
| Version | Changes |
| --- | --- |
| v16.0.0 | Graduated from experimental. |
| v15.0.0 | Added in: v15.0.0 |
:::

The `timers/promises` API provides an alternative set of timer functions that return `Promise` objects. The API is accessible via `require('node:timers/promises')`.



::: code-group
```js [ESM]
import {
  setTimeout,
  setImmediate,
  setInterval,
} from 'node:timers/promises';
```

```js [CJS]
const {
  setTimeout,
  setImmediate,
  setInterval,
} = require('node:timers/promises');
```
:::

### `timersPromises.setTimeout([delay[, value[, options]]])` {#timerspromisessettimeoutdelay-value-options}

**Added in: v15.0.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of milliseconds to wait before fulfilling the promise. **Default:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) A value with which the promise is fulfilled.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Set to `false` to indicate that the scheduled `Timeout` should not require the Node.js event loop to remain active. **Default:** `true`.
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) An optional `AbortSignal` that can be used to cancel the scheduled `Timeout`.
  
 



::: code-group
```js [ESM]
import {
  setTimeout,
} from 'node:timers/promises';

const res = await setTimeout(100, 'result');

console.log(res);  // Prints 'result'
```

```js [CJS]
const {
  setTimeout,
} = require('node:timers/promises');

setTimeout(100, 'result').then((res) => {
  console.log(res);  // Prints 'result'
});
```
:::

### `timersPromises.setImmediate([value[, options]])` {#timerspromisessetimmediatevalue-options}

**Added in: v15.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) A value with which the promise is fulfilled.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Set to `false` to indicate that the scheduled `Immediate` should not require the Node.js event loop to remain active. **Default:** `true`.
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) An optional `AbortSignal` that can be used to cancel the scheduled `Immediate`.
  
 



::: code-group
```js [ESM]
import {
  setImmediate,
} from 'node:timers/promises';

const res = await setImmediate('result');

console.log(res);  // Prints 'result'
```

```js [CJS]
const {
  setImmediate,
} = require('node:timers/promises');

setImmediate('result').then((res) => {
  console.log(res);  // Prints 'result'
});
```
:::

### `timersPromises.setInterval([delay[, value[, options]]])` {#timerspromisessetintervaldelay-value-options}

**Added in: v15.9.0**

Returns an async iterator that generates values in an interval of `delay` ms. If `ref` is `true`, you need to call `next()` of async iterator explicitly or implicitly to keep the event loop alive.

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of milliseconds to wait between iterations. **Default:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) A value with which the iterator returns.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Set to `false` to indicate that the scheduled `Timeout` between iterations should not require the Node.js event loop to remain active. **Default:** `true`.
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) An optional `AbortSignal` that can be used to cancel the scheduled `Timeout` between operations.
  
 



::: code-group
```js [ESM]
import {
  setInterval,
} from 'node:timers/promises';

const interval = 100;
for await (const startTime of setInterval(interval, Date.now())) {
  const now = Date.now();
  console.log(now);
  if ((now - startTime) > 1000)
    break;
}
console.log(Date.now());
```

```js [CJS]
const {
  setInterval,
} = require('node:timers/promises');
const interval = 100;

(async function() {
  for await (const startTime of setInterval(interval, Date.now())) {
    const now = Date.now();
    console.log(now);
    if ((now - startTime) > 1000)
      break;
  }
  console.log(Date.now());
})();
```
:::

### `timersPromises.scheduler.wait(delay[, options])` {#timerspromisesschedulerwaitdelay-options}

**Added in: v17.3.0, v16.14.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of milliseconds to wait before resolving the promise.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Set to `false` to indicate that the scheduled `Timeout` should not require the Node.js event loop to remain active. **Default:** `true`.
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) An optional `AbortSignal` that can be used to cancel waiting.
  
 
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

An experimental API defined by the [Scheduling APIs](https://github.com/WICG/scheduling-apis) draft specification being developed as a standard Web Platform API.

Calling `timersPromises.scheduler.wait(delay, options)` is equivalent to calling `timersPromises.setTimeout(delay, undefined, options)`.

```js [ESM]
import { scheduler } from 'node:timers/promises';

await scheduler.wait(1000); // Wait one second before continuing
```
### `timersPromises.scheduler.yield()` {#timerspromisesscheduleryield}

**Added in: v17.3.0, v16.14.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

An experimental API defined by the [Scheduling APIs](https://github.com/WICG/scheduling-apis) draft specification being developed as a standard Web Platform API.

Calling `timersPromises.scheduler.yield()` is equivalent to calling `timersPromises.setImmediate()` with no arguments.

