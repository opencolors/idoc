---
title: Node.js タイマーAPIドキュメント
description: Node.jsのタイマーモジュールは、将来のある時点で関数を呼び出すための機能を提供します。これには、setTimeout、setInterval、setImmediateなどのメソッドとそのクリアメソッド、およびイベントループの次の反復でコードを実行するためのprocess.nextTickが含まれます。
head:
  - - meta
    - name: og:title
      content: Node.js タイマーAPIドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのタイマーモジュールは、将来のある時点で関数を呼び出すための機能を提供します。これには、setTimeout、setInterval、setImmediateなどのメソッドとそのクリアメソッド、およびイベントループの次の反復でコードを実行するためのprocess.nextTickが含まれます。
  - - meta
    - name: twitter:title
      content: Node.js タイマーAPIドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのタイマーモジュールは、将来のある時点で関数を呼び出すための機能を提供します。これには、setTimeout、setInterval、setImmediateなどのメソッドとそのクリアメソッド、およびイベントループの次の反復でコードを実行するためのprocess.nextTickが含まれます。
---


# タイマー {#timers}

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/timers.js](https://github.com/nodejs/node/blob/v23.5.0/lib/timers.js)

`timer` モジュールは、将来のある時点で呼び出される関数をスケジュールするためのグローバル API を公開します。タイマー関数はグローバルであるため、API を使用するために `require('node:timers')` を呼び出す必要はありません。

Node.js 内のタイマー関数は、Web ブラウザーによって提供されるタイマー API と同様の API を実装しますが、Node.js の [イベントループ](https://nodejs.org/ja/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) を中心に構築された異なる内部実装を使用します。

## クラス: `Immediate` {#class-immediate}

このオブジェクトは内部的に作成され、[`setImmediate()`](/ja/nodejs/api/timers#setimmediatecallback-args) から返されます。スケジュールされたアクションをキャンセルするために、[`clearImmediate()`](/ja/nodejs/api/timers#clearimmediateimmediate) に渡すことができます。

デフォルトでは、immediate がスケジュールされると、Node.js イベントループは、immediate がアクティブである限り実行し続けます。[`setImmediate()`](/ja/nodejs/api/timers#setimmediatecallback-args) によって返される `Immediate` オブジェクトは、このデフォルトの動作を制御するために使用できる `immediate.ref()` 関数と `immediate.unref()` 関数の両方をエクスポートします。

### `immediate.hasRef()` {#immediatehasref}

**追加:** v11.0.0

- 戻り値: [\<boolean\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Boolean_type)

true の場合、`Immediate` オブジェクトは Node.js イベントループをアクティブな状態に保ちます。

### `immediate.ref()` {#immediateref}

**追加:** v9.7.0

- 戻り値: [\<Immediate\>](/ja/nodejs/api/timers#class-immediate) `immediate` への参照

呼び出されると、`Immediate` がアクティブである限り、Node.js イベントループが終了*しない*ように要求します。`immediate.ref()` を複数回呼び出しても効果はありません。

デフォルトでは、すべての `Immediate` オブジェクトは "ref'ed" になっているため、以前に `immediate.unref()` が呼び出されていない限り、通常は `immediate.ref()` を呼び出す必要はありません。


### `immediate.unref()` {#immediateunref}

**追加: v9.7.0**

- 戻り値: [\<Immediate\>](/ja/nodejs/api/timers#class-immediate) `immediate`への参照

呼び出されると、アクティブな`Immediate`オブジェクトは、Node.jsイベントループがアクティブな状態を維持することを要求しません。 イベントループを稼働させ続ける他のアクティビティがない場合、`Immediate`オブジェクトのコールバックが呼び出される前にプロセスが終了する可能性があります。 `immediate.unref()`を複数回呼び出しても効果はありません。

### `immediate[Symbol.dispose]()` {#immediatesymboldispose}

**追加: v20.5.0, v18.18.0**

::: warning [安定性: 1 - 試験的]
[安定性: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

immediateをキャンセルします。 これは`clearImmediate()`の呼び出しに似ています。

## Class: `Timeout` {#class-timeout}

このオブジェクトは内部的に作成され、[`setTimeout()`](/ja/nodejs/api/timers#settimeoutcallback-delay-args)と[`setInterval()`](/ja/nodejs/api/timers#setintervalcallback-delay-args)から返されます。 スケジュールされたアクションをキャンセルするために、[`clearTimeout()`](/ja/nodejs/api/timers#cleartimeouttimeout)または[`clearInterval()`](/ja/nodejs/api/timers#clearintervaltimeout)のいずれかに渡すことができます。

デフォルトでは、[`setTimeout()`](/ja/nodejs/api/timers#settimeoutcallback-delay-args)または[`setInterval()`](/ja/nodejs/api/timers#setintervalcallback-delay-args)を使用してタイマーがスケジュールされると、Node.jsイベントループはタイマーがアクティブである限り実行され続けます。 これらの関数によって返される各`Timeout`オブジェクトは、このデフォルトの動作を制御するために使用できる`timeout.ref()`関数と`timeout.unref()`関数の両方をエクスポートします。

### `timeout.close()` {#timeoutclose}

**追加: v0.9.1**

::: info [安定性: 3 - レガシー]
[安定性: 3](/ja/nodejs/api/documentation#stability-index) [安定性: 3](/ja/nodejs/api/documentation#stability-index) - レガシー: 代わりに[`clearTimeout()`](/ja/nodejs/api/timers#cleartimeouttimeout)を使用してください。
:::

- 戻り値: [\<Timeout\>](/ja/nodejs/api/timers#class-timeout) `timeout`への参照

タイムアウトをキャンセルします。

### `timeout.hasRef()` {#timeouthasref}

**追加: v11.0.0**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

trueの場合、`Timeout`オブジェクトはNode.jsイベントループをアクティブな状態に保ちます。


### `timeout.ref()` {#timeoutref}

**追加:** v0.9.1

- 戻り値: [\<Timeout\>](/ja/nodejs/api/timers#class-timeout) `timeout`への参照

呼び出されると、`Timeout`がアクティブである限り、Node.jsイベントループが終了*しない*ように要求します。`timeout.ref()`を複数回呼び出しても効果はありません。

デフォルトでは、すべての`Timeout`オブジェクトは「ref」されているため、以前に`timeout.unref()`が呼び出されていない限り、通常は`timeout.ref()`を呼び出す必要はありません。

### `timeout.refresh()` {#timeoutrefresh}

**追加:** v10.2.0

- 戻り値: [\<Timeout\>](/ja/nodejs/api/timers#class-timeout) `timeout`への参照

タイマーの開始時間を現在時刻に設定し、タイマーを再スケジュールして、以前に指定された期間で、現在時刻に合わせて調整されたコールバックを呼び出します。これは、新しいJavaScriptオブジェクトを割り当てることなくタイマーを更新する場合に役立ちます。

コールバックをすでに呼び出したタイマーでこれを使用すると、タイマーが再度アクティブになります。

### `timeout.unref()` {#timeoutunref}

**追加:** v0.9.1

- 戻り値: [\<Timeout\>](/ja/nodejs/api/timers#class-timeout) `timeout`への参照

呼び出されると、アクティブな`Timeout`オブジェクトは、Node.jsイベントループがアクティブな状態を維持することを要求しません。イベントループを実行し続ける他のアクティビティがない場合、プロセスは`Timeout`オブジェクトのコールバックが呼び出される前に終了する可能性があります。`timeout.unref()`を複数回呼び出しても効果はありません。

### `timeout[Symbol.toPrimitive]()` {#timeoutsymboltoprimitive}

**追加:** v14.9.0, v12.19.0

- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この`timeout`を参照するために使用できる数値

`Timeout`をプリミティブに強制します。プリミティブは、`Timeout`をクリアするために使用できます。プリミティブは、タイムアウトが作成された同じスレッドでのみ使用できます。したがって、[`worker_threads`](/ja/nodejs/api/worker_threads)を介して使用するには、最初に正しいスレッドに渡す必要があります。これにより、ブラウザの`setTimeout()`および`setInterval()`の実装との互換性が向上します。

### `timeout[Symbol.dispose]()` {#timeoutsymboldispose}

**追加:** v20.5.0, v18.18.0

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

タイムアウトをキャンセルします。


## タイマーのスケジュール {#scheduling-timers}

Node.js のタイマーは、一定期間後に指定された関数を呼び出す内部構造です。タイマーの関数が呼び出されるタイミングは、タイマーの作成に使用されたメソッドや、Node.js イベントループが行っている他の作業によって異なります。

### `setImmediate(callback[, ...args])` {#setimmediatecallback-args}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` の代わりに `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v0.9.1 | 追加: v0.9.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Node.js の [イベントループ](https://nodejs.org/ja/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) のこのターン終了時に呼び出す関数
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `callback` が呼び出されるときに渡すオプションの引数。
- 戻り値: [`clearImmediate()`](/ja/nodejs/api/timers#clearimmediateimmediate) で使用する [\<Immediate\>](/ja/nodejs/api/timers#class-immediate)

I/O イベントのコールバックの後、`callback` の「即時」実行をスケジュールします。

`setImmediate()` への複数の呼び出しが行われた場合、`callback` 関数は作成された順に実行待ち行列に入れられます。コールバックキュー全体が、イベントループの反復ごとに処理されます。実行中のコールバック内から即時タイマーがキューに入れられた場合、そのタイマーは次のイベントループの反復までトリガーされません。

`callback` が関数でない場合、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。

このメソッドには、[`timersPromises.setImmediate()`](/ja/nodejs/api/timers#timerspromisessetimmediatevalue-options) を使用して利用できる Promise のカスタムバリアントがあります。

### `setInterval(callback[, delay[, ...args]])` {#setintervalcallback-delay-args}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` の代わりに `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v0.0.1 | 追加: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) タイマーが経過したときに呼び出す関数。
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `callback` を呼び出す前に待機するミリ秒数。**デフォルト:** `1`。
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `callback` が呼び出されるときに渡すオプションの引数。
- 戻り値: [`clearInterval()`](/ja/nodejs/api/timers#clearintervaltimeout) で使用する [\<Timeout\>](/ja/nodejs/api/timers#class-timeout)

`callback` の反復実行を `delay` ミリ秒ごとにスケジュールします。

`delay` が `2147483647` より大きいか、`1` より小さいか、`NaN` の場合、`delay` は `1` に設定されます。整数でない遅延は整数に切り捨てられます。

`callback` が関数でない場合、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。

このメソッドには、[`timersPromises.setInterval()`](/ja/nodejs/api/timers#timerspromisessetintervaldelay-value-options) を使用して利用できる Promise のカスタムバリアントがあります。


### `setTimeout(callback[, delay[, ...args]])` {#settimeoutcallback-delay-args}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`の代わりに`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v0.0.1 | Added in: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) タイマーが経過したときに呼び出す関数。
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `callback`を呼び出す前に待機するミリ秒数。 **デフォルト:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `callback`が呼び出されたときに渡すオプションの引数。
- 戻り値: [`clearTimeout()`](/ja/nodejs/api/timers#cleartimeouttimeout)で使用するための[\<Timeout\>](/ja/nodejs/api/timers#class-timeout)

`delay`ミリ秒後に1回限りの`callback`の実行をスケジュールします。

`callback`は正確に`delay`ミリ秒で呼び出されるとは限りません。 Node.jsは、コールバックが発生する正確なタイミングや、その順序について保証しません。 コールバックは、指定された時間にできるだけ近いタイミングで呼び出されます。

`delay`が`2147483647`より大きいか、`1`より小さいか、`NaN`の場合、`delay`は`1`に設定されます。 非整数の遅延は整数に切り捨てられます。

`callback`が関数でない場合は、[`TypeError`](/ja/nodejs/api/errors#class-typeerror)がスローされます。

このメソッドには、[`timersPromises.setTimeout()`](/ja/nodejs/api/timers#timerspromisessettimeoutdelay-value-options)を使用して利用できる、プロミス用のカスタムバリアントがあります。

## タイマーのキャンセル {#cancelling-timers}

[`setImmediate()`](/ja/nodejs/api/timers#setimmediatecallback-args)、[`setInterval()`](/ja/nodejs/api/timers#setintervalcallback-delay-args)、および[`setTimeout()`](/ja/nodejs/api/timers#settimeoutcallback-delay-args)メソッドはそれぞれ、スケジュールされたタイマーを表すオブジェクトを返します。 これらは、タイマーをキャンセルして、トリガーを防ぐために使用できます。

[`setImmediate()`](/ja/nodejs/api/timers#setimmediatecallback-args)および[`setTimeout()`](/ja/nodejs/api/timers#settimeoutcallback-delay-args)のPromise化されたバリアントでは、[`AbortController`](/ja/nodejs/api/globals#class-abortcontroller)を使用してタイマーをキャンセルできます。 キャンセルされると、返されたPromiseは`'AbortError'`でリジェクトされます。

`setImmediate()`の場合:

::: code-group
```js [ESM]
import { setImmediate as setImmediatePromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// Promiseを`await`しないため、`ac.abort()`は同時に呼び出されます。
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

`setTimeout()`の場合:

::: code-group
```js [ESM]
import { setTimeout as setTimeoutPromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// Promiseを`await`しないため、`ac.abort()`は同時に呼び出されます。
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

- `immediate` [\<Immediate\>](/ja/nodejs/api/timers#class-immediate) [`setImmediate()`](/ja/nodejs/api/timers#setimmediatecallback-args) によって返される `Immediate` オブジェクト。

[`setImmediate()`](/ja/nodejs/api/timers#setimmediatecallback-args) によって作成された `Immediate` オブジェクトをキャンセルします。

### `clearInterval(timeout)` {#clearintervaltimeout}

**Added in: v0.0.1**

- `timeout` [\<Timeout\>](/ja/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`setInterval()`](/ja/nodejs/api/timers#setintervalcallback-delay-args) によって返される `Timeout` オブジェクト、または文字列または数値としての `Timeout` オブジェクトの [primitive](/ja/nodejs/api/timers#timeoutsymboltoprimitive)。

[`setInterval()`](/ja/nodejs/api/timers#setintervalcallback-delay-args) によって作成された `Timeout` オブジェクトをキャンセルします。

### `clearTimeout(timeout)` {#cleartimeouttimeout}

**Added in: v0.0.1**

- `timeout` [\<Timeout\>](/ja/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`setTimeout()`](/ja/nodejs/api/timers#settimeoutcallback-delay-args) によって返される `Timeout` オブジェクト、または文字列または数値としての `Timeout` オブジェクトの [primitive](/ja/nodejs/api/timers#timeoutsymboltoprimitive)。

[`setTimeout()`](/ja/nodejs/api/timers#settimeoutcallback-delay-args) によって作成された `Timeout` オブジェクトをキャンセルします。

## Timers Promises API {#timers-promises-api}

::: info [History]
| Version | Changes |
| --- | --- |
| v16.0.0 | Graduated from experimental. |
| v15.0.0 | Added in: v15.0.0 |
:::

`timers/promises` API は、`Promise` オブジェクトを返すタイマー関数の代替セットを提供します。API は `require('node:timers/promises')` を介してアクセス可能です。

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

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Promiseが履行されるまで待機するミリ秒数。 **Default:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Promiseが履行される値。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) スケジュールされた`Timeout`がNode.jsのイベントループをアクティブな状態に保つ必要がないことを示すには、`false`に設定します。 **Default:** `true`.
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) スケジュールされた`Timeout`をキャンセルするために使用できるオプションの`AbortSignal`。

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

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Promiseが履行される値。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) スケジュールされた`Immediate`がNode.jsのイベントループをアクティブな状態に保つ必要がないことを示すには、`false`に設定します。 **Default:** `true`.
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) スケジュールされた`Immediate`をキャンセルするために使用できるオプションの`AbortSignal`。

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

`delay` ms 間隔で値を生成する非同期イテレーターを返します。`ref` が `true` の場合、イベントループを維持するためには、明示的または暗黙的に非同期イテレーターの `next()` を呼び出す必要があります。

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) イテレーション間の待機時間（ミリ秒単位）。**デフォルト:** `1`。
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) イテレーターが返す値。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) イテレーション間のスケジュールされた `Timeout` が、Node.js イベントループをアクティブに保つ必要がないことを示すために `false` に設定します。**デフォルト:** `true`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 操作間のスケジュールされた `Timeout` をキャンセルするために使用できるオプションの `AbortSignal`。

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
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Promise が解決されるまでの待機時間（ミリ秒単位）。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) スケジュールされた `Timeout` が、Node.js イベントループをアクティブに保つ必要がないことを示すために `false` に設定します。**デフォルト:** `true`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 待機をキャンセルするために使用できるオプションの `AbortSignal`。

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

標準ウェブプラットフォーム API として開発されている [Scheduling APIs](https://github.com/WICG/scheduling-apis) ドラフト仕様によって定義された試験的な API。

`timersPromises.scheduler.wait(delay, options)` の呼び出しは、`timersPromises.setTimeout(delay, undefined, options)` の呼び出しと同等です。

```js [ESM]
import { scheduler } from 'node:timers/promises';

await scheduler.wait(1000); // 継続する前に 1 秒間待機
```

### `timersPromises.scheduler.yield()` {#timerspromisesscheduleryield}

**追加:** v17.3.0, v16.14.0

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

[Scheduling APIs](https://github.com/WICG/scheduling-apis)ドラフト仕様によって定義される試験的なAPIであり、標準WebプラットフォームAPIとして開発されています。

`timersPromises.scheduler.yield()`の呼び出しは、引数なしで`timersPromises.setImmediate()`を呼び出すことと同等です。

