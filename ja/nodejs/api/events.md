---
title: Node.js ドキュメント - イベント
description: Node.jsのイベントモジュールを探りましょう。非同期操作をイベント駆動型プログラミングで処理する方法を提供します。イベントエミッタ、リスナー、そしてイベントを効果的に管理する方法について学びます。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - イベント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのイベントモジュールを探りましょう。非同期操作をイベント駆動型プログラミングで処理する方法を提供します。イベントエミッタ、リスナー、そしてイベントを効果的に管理する方法について学びます。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - イベント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのイベントモジュールを探りましょう。非同期操作をイベント駆動型プログラミングで処理する方法を提供します。イベントエミッタ、リスナー、そしてイベントを効果的に管理する方法について学びます。
---


# イベント {#events}

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/events.js)

Node.js コア API の多くは、特定の種類のオブジェクト（「エミッター」と呼ばれる）が名前付きイベントを発行し、それによって `Function` オブジェクト（「リスナー」）が呼び出されるという、慣用的な非同期イベント駆動アーキテクチャに基づいて構築されています。

例えば、[`net.Server`](/ja/nodejs/api/net#class-netserver) オブジェクトは、ピアが接続するたびにイベントを発行します。[`fs.ReadStream`](/ja/nodejs/api/fs#class-fsreadstream) は、ファイルが開かれたときにイベントを発行します。 [stream](/ja/nodejs/api/stream) は、読み取り可能なデータがあるたびにイベントを発行します。

イベントを発行するすべてのオブジェクトは、`EventEmitter` クラスのインスタンスです。 これらのオブジェクトは、オブジェクトによって発行された名前付きイベントに 1 つ以上の関数をアタッチできる `eventEmitter.on()` 関数を公開します。 通常、イベント名はキャメルケースの文字列ですが、有効な JavaScript プロパティキーであれば使用できます。

`EventEmitter` オブジェクトがイベントを発行すると、その特定のイベントにアタッチされているすべての関数が*同期的に*呼び出されます。 呼び出されたリスナーによって返された値は*無視*され、破棄されます。

次の例は、単一のリスナーを持つ単純な `EventEmitter` インスタンスを示しています。 `eventEmitter.on()` メソッドはリスナーを登録するために使用され、`eventEmitter.emit()` メソッドはイベントをトリガーするために使用されます。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```

```js [CJS]
const EventEmitter = require('node:events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```
:::

## リスナーへの引数と `this` の受け渡し {#passing-arguments-and-this-to-listeners}

`eventEmitter.emit()` メソッドを使用すると、任意の引数をリスナー関数に渡すことができます。 通常のリスナー関数が呼び出されると、標準の `this` キーワードは、リスナーがアタッチされている `EventEmitter` インスタンスを参照するように意図的に設定されることに注意してください。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```
:::

ES6 アロー関数をリスナーとして使用することは可能ですが、その場合、`this` キーワードは `EventEmitter` インスタンスを参照しなくなります。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b undefined
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b {}
});
myEmitter.emit('event', 'a', 'b');
```
:::


## 非同期 vs 同期 {#asynchronous-vs-synchronous}

`EventEmitter` は、登録された順にすべてのリスナーを同期的に呼び出します。これにより、イベントの適切な順序付けが保証され、競合状態やロジックエラーを回避できます。必要に応じて、リスナー関数は `setImmediate()` または `process.nextTick()` メソッドを使用して非同期モードに切り替えることができます。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```
:::

## イベントを一度だけ処理する {#handling-events-only-once}

`eventEmitter.on()` メソッドを使用してリスナーが登録されると、そのリスナーは名前付きイベントが発生する *たびに* 呼び出されます。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```
:::

`eventEmitter.once()` メソッドを使用すると、特定のイベントに対して最大で一度だけ呼び出されるリスナーを登録できます。イベントが発生すると、リスナーは登録解除された *後で* 呼び出されます。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```
:::


## エラーイベント {#error-events}

`EventEmitter`インスタンス内でエラーが発生した場合、典型的な動作は`'error'`イベントが発火されることです。これらはNode.js内で特別なケースとして扱われます。

`EventEmitter`が`'error'`イベントに対して少なくとも1つのリスナーを登録 *していない* 場合、`'error'`イベントが発火されると、エラーがスローされ、スタックトレースが出力され、Node.jsプロセスが終了します。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// スローされ、Node.jsがクラッシュします
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// スローされ、Node.jsがクラッシュします
```
:::

Node.jsプロセスのクラッシュを防ぐために、[`domain`](/ja/nodejs/api/domain)モジュールを使用できます。（ただし、`node:domain`モジュールは非推奨になっていることに注意してください。）

ベストプラクティスとして、`'error'`イベントに対して常にリスナーを追加する必要があります。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Prints: whoops! there was an error
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Prints: whoops! there was an error
```
:::

シンボル`events.errorMonitor`を使用してリスナーをインストールすることにより、発火されたエラーを消費せずに`'error'`イベントを監視できます。

::: code-group
```js [ESM]
import { EventEmitter, errorMonitor } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// それでもスローされ、Node.jsがクラッシュします
```

```js [CJS]
const { EventEmitter, errorMonitor } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// それでもスローされ、Node.jsがクラッシュします
```
:::


## Promiseのリジェクションの捕捉 {#capture-rejections-of-promises}

イベントハンドラーで`async`関数を使用すると、例外がスローされた場合に未処理のリジェクションが発生する可能性があるため、問題が発生する可能性があります。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```
:::

`EventEmitter`コンストラクターの`captureRejections`オプションまたはグローバル設定を変更すると、この動作が変わり、`Promise`に`.then(undefined, handler)`ハンドラーがインストールされます。このハンドラーは、[`Symbol.for('nodejs.rejection')`](/ja/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args)メソッドがある場合は例外を非同期的にルーティングし、ない場合は[`'error'`](/ja/nodejs/api/events#error-events)イベントハンドラーにルーティングします。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```

```js [CJS]
const EventEmitter = require('node:events');
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```
:::

`events.captureRejections = true`を設定すると、`EventEmitter`のすべての新しいインスタンスのデフォルトが変更されます。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

EventEmitter.captureRejections = true;
const ee1 = new EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```

```js [CJS]
const events = require('node:events');
events.captureRejections = true;
const ee1 = new events.EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```
:::

`captureRejections`の動作によって生成された`'error'`イベントには、無限のエラーループを回避するためのキャッチハンドラーがありません。**`async`関数を<code>'error'</code>イベントハンドラーとして使用しない**ことをお勧めします。


## クラス: `EventEmitter` {#class-eventemitter}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.4.0, v12.16.0 | captureRejections オプションが追加されました。 |
| v0.1.26 | 追加: v0.1.26 |
:::

`EventEmitter` クラスは `node:events` モジュールによって定義され、公開されています。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
```

```js [CJS]
const EventEmitter = require('node:events');
```
:::

すべての `EventEmitter` は、新しいリスナーが追加されると `'newListener'` イベントを発行し、既存のリスナーが削除されると `'removeListener'` イベントを発行します。

以下のオプションをサポートしています。

- `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) [Promise のリジェクトの自動キャプチャ](/ja/nodejs/api/events#capture-rejections-of-promises)を有効にします。 **デフォルト:** `false`。

### イベント: `'newListener'` {#event-newlistener}

**追加: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) リッスンされるイベントの名前
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) イベントハンドラ関数

`EventEmitter` インスタンスは、リスナーがリスナーの内部配列に追加される*前に*、独自の `'newListener'` イベントを発行します。

`'newListener'` イベントに登録されたリスナーには、イベント名と、追加されるリスナーへの参照が渡されます。

イベントがリスナーの追加前にトリガーされるという事実は、微妙ですが重要な副作用があります。 `'newListener'` コールバック*内*で同じ `name` に登録された*追加の*リスナーは、追加処理中のリスナーの*前に*挿入されます。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// ループしないように一度だけ実行します
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // 前に新しいリスナーを挿入します
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Prints:
//   B
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// ループしないように一度だけ実行します
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // 前に新しいリスナーを挿入します
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Prints:
//   B
//   A
```
:::


### イベント: `'removeListener'` {#event-removelistener}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v6.1.0, v4.7.0 | `.once()` を使ってアタッチされたリスナーに対して、`listener` 引数は元のリスナー関数を生成するようになりました。 |
| v0.9.3 | 追加: v0.9.3 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) イベント名
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) イベントハンドラ関数

`'removeListener'` イベントは、`listener` が削除された *後* に発生します。

### `emitter.addListener(eventName, listener)` {#emitteraddlistenereventname-listener}

**追加: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`emitter.on(eventName, listener)` のエイリアスです。

### `emitter.emit(eventName[, ...args])` {#emitteremiteventname-args}

**追加: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`eventName` という名前のイベントに登録されている各リスナーを、登録された順に同期的に呼び出し、各リスナーに指定された引数を渡します。

イベントにリスナーがあった場合は `true` 、そうでない場合は `false` を返します。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

```js [CJS]
const EventEmitter = require('node:events');
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```
:::


### `emitter.eventNames()` {#emittereventnames}

**Added in: v6.0.0**

- 戻り値: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

emitter がリスナーを登録しているイベントをリストした配列を返します。配列の値は、文字列または `Symbol` です。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

```js [CJS]
const EventEmitter = require('node:events');

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```
:::

### `emitter.getMaxListeners()` {#emittergetmaxlisteners}

**Added in: v1.0.0**

- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`EventEmitter` の現在の最大リスナー値を返します。これは、[`emitter.setMaxListeners(n)`](/ja/nodejs/api/events#emittersetmaxlistenersn) によって設定されるか、デフォルトで [`events.defaultMaxListeners`](/ja/nodejs/api/events#eventsdefaultmaxlisteners) になります。

### `emitter.listenerCount(eventName[, listener])` {#emitterlistenercounteventname-listener}

::: info [History]
| Version | Changes |
| --- | --- |
| v19.8.0, v18.16.0 | `listener` 引数が追加されました。 |
| v3.2.0 | Added in: v3.2.0 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) リッスンしているイベントの名前
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) イベントハンドラー関数
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`eventName` という名前のイベントをリッスンしているリスナーの数を返します。`listener` が提供されている場合は、イベントのリスナーのリストでリスナーが見つかった回数を返します。


### `emitter.listeners(eventName)` {#emitterlistenerseventname}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v7.0.0 | `.once()` を使用してアタッチされたリスナーの場合、ラッパー関数の代わりに元のリスナーが返されるようになりました。 |
| v0.1.26 | Added in: v0.1.26 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- 戻り値: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`eventName` という名前のイベントのリスナーの配列のコピーを返します。

```js [ESM]
server.on('connection', (stream) => {
  console.log('誰かが接続しました!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```
### `emitter.off(eventName, listener)` {#emitteroffeventname-listener}

**Added in: v10.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

[`emitter.removeListener()`](/ja/nodejs/api/events#emitterremovelistenereventname-listener) のエイリアスです。

### `emitter.on(eventName, listener)` {#emitteroneventname-listener}

**Added in: v0.1.101**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) イベントの名前。
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) コールバック関数
- 戻り値: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

`listener` 関数を、`eventName` という名前のイベントのリスナー配列の末尾に追加します。 `listener` が既に追加されているかどうかを確認するためのチェックは行われません。 同じ `eventName` と `listener` の組み合わせを渡す複数の呼び出しは、`listener` が複数回追加され、呼び出される結果になります。

```js [ESM]
server.on('connection', (stream) => {
  console.log('誰かが接続しました!');
});
```
`EventEmitter` への参照を返し、呼び出しをチェーンできるようにします。

デフォルトでは、イベントリスナーは追加された順に呼び出されます。 `emitter.prependListener()` メソッドは、イベントリスナーをリスナー配列の先頭に追加する代替手段として使用できます。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```
:::


### `emitter.once(eventName, listener)` {#emitteronceeventname-listener}

**Added in: v0.3.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) イベントの名前。
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) コールバック関数
- 戻り値: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

`eventName`という名前のイベントに対して**1回限りの**`listener`関数を追加します。次に`eventName`がトリガーされると、このリスナーは削除され、その後呼び出されます。

```js [ESM]
server.once('connection', (stream) => {
  console.log('ああ、初めてのユーザーだ！');
});
```
呼び出しをチェーンできるように、`EventEmitter`への参照を返します。

デフォルトでは、イベントリスナーは追加された順に呼び出されます。`emitter.prependOnceListener()`メソッドを使用すると、イベントリスナーをリスナー配列の先頭に追加する代替手段として使用できます。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```
:::

### `emitter.prependListener(eventName, listener)` {#emitterprependlistenereventname-listener}

**Added in: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) イベントの名前。
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) コールバック関数
- 戻り値: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

`listener`関数を、`eventName`という名前のイベントのリスナー配列の*先頭*に追加します。`listener`が既に追加されているかどうかを確認するためのチェックは行われません。同じ`eventName`と`listener`の組み合わせを渡して複数回呼び出すと、`listener`が複数回追加され、呼び出されます。

```js [ESM]
server.prependListener('connection', (stream) => {
  console.log('誰かが接続しました！');
});
```
呼び出しをチェーンできるように、`EventEmitter`への参照を返します。


### `emitter.prependOnceListener(eventName, listener)` {#emitterprependoncelistenereventname-listener}

**Added in: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) イベントの名前。
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) コールバック関数
- 戻り値: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

`eventName` という名前のイベントに対する **1 回限り** の `listener` 関数を、リスナー配列の *先頭* に追加します。 次回 `eventName` がトリガーされると、このリスナーは削除され、その後呼び出されます。

```js [ESM]
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```
`EventEmitter` への参照を返すので、呼び出しをチェーンできます。

### `emitter.removeAllListeners([eventName])` {#emitterremovealllistenerseventname}

**Added in: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- 戻り値: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

すべてのリスナー、または指定された `eventName` のリスナーを削除します。

コードの別の場所で追加されたリスナーを削除すること、特に `EventEmitter` インスタンスが他のコンポーネントまたはモジュール (ソケットやファイルストリームなど) によって作成された場合は、望ましくありません。

`EventEmitter` への参照を返すので、呼び出しをチェーンできます。

### `emitter.removeListener(eventName, listener)` {#emitterremovelistenereventname-listener}

**Added in: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

指定された `listener` を、`eventName` という名前のイベントのリスナー配列から削除します。

```js [ESM]
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```
`removeListener()` は、リスナー配列からリスナーのインスタンスを最大で 1 つ削除します。 指定された `eventName` のリスナー配列に単一のリスナーが複数回追加されている場合は、`removeListener()` を複数回呼び出して、各インスタンスを削除する必要があります。

イベントが一度発生すると、発生時にアタッチされているすべてのリスナーが順番に呼び出されます。 これは、`removeListener()` または `removeAllListeners()` の呼び出しが、イベント発生 *後* であり、最後のリスナーの実行が完了する *前* である場合、進行中の `emit()` からそれらを削除しないことを意味します。 後続のイベントは期待どおりに動作します。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```
:::

リスナーは内部配列を使用して管理されるため、これを呼び出すと、削除されるリスナー *の後* に登録されたリスナーの位置インデックスが変更されます。 これはリスナーが呼び出される順序には影響しませんが、`emitter.listeners()` メソッドによって返されるリスナー配列のコピーを再作成する必要があることを意味します。

単一の関数が単一のイベントのハンドラーとして複数回追加された場合 (以下の例のように)、`removeListener()` は最も最近追加されたインスタンスを削除します。 例では、`once('ping')` リスナーが削除されます。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```
:::

`EventEmitter` への参照を返すので、呼び出しをチェーンできます。


### `emitter.setMaxListeners(n)` {#emittersetmaxlistenersn}

**追加: v0.3.5**

- `n` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 戻り値: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

デフォルトでは、特定のイベントに対して `10` 個を超えるリスナーが追加されると、`EventEmitter` は警告を出力します。これは、メモリリークを見つけるのに役立つ便利なデフォルトです。`emitter.setMaxListeners()` メソッドを使用すると、この特定の `EventEmitter` インスタンスの制限を変更できます。値は、無制限のリスナーを示すために `Infinity` (または `0`) に設定できます。

`EventEmitter` への参照を返すため、呼び出しをチェーンできます。

### `emitter.rawListeners(eventName)` {#emitterrawlistenerseventname}

**追加: v9.4.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- 戻り値: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`.once()` で作成されたラッパーなど、`eventName` という名前のイベントのリスナーの配列のコピーを返します。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// `onceWrapper` という関数を持つ新しい配列を返します。この関数には、上記でバインドされた元のリスナーを含むプロパティ `listener` があります。
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// コンソールに "log once" と出力し、`once` イベントのバインドを解除しません
logFnWrapper.listener();

// コンソールに "log once" と出力し、リスナーを削除します
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// 上記の `.on()` によってバインドされた単一の関数を持つ新しい配列を返します
const newListeners = emitter.rawListeners('log');

// "log persistently" を 2 回出力します
newListeners[0]();
emitter.emit('log');
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// `onceWrapper` という関数を持つ新しい配列を返します。この関数には、上記でバインドされた元のリスナーを含むプロパティ `listener` があります。
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// コンソールに "log once" と出力し、`once` イベントのバインドを解除しません
logFnWrapper.listener();

// コンソールに "log once" と出力し、リスナーを削除します
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// 上記の `.on()` によってバインドされた単一の関数を持つ新しい配列を返します
const newListeners = emitter.rawListeners('log');

// "log persistently" を 2 回出力します
newListeners[0]();
emitter.emit('log');
```
:::


### `emitter[Symbol.for('nodejs.rejection')](err, eventName[, ...args])` {#emittersymbolfornodejsrejectionerr-eventname-args}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v17.4.0, v16.14.0 | 実験的ではなくなりました。 |
| v13.4.0, v12.16.0 | 追加: v13.4.0, v12.16.0 |
:::

- `err` Error
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`Symbol.for('nodejs.rejection')` メソッドは、イベントの発行時に Promise のリジェクトが発生し、[`captureRejections`](/ja/nodejs/api/events#capture-rejections-of-promises) が EventEmitter で有効になっている場合に呼び出されます。`Symbol.for('nodejs.rejection')` の代わりに [`events.captureRejectionSymbol`](/ja/nodejs/api/events#eventscapturerejectionsymbol) を使用することも可能です。

::: code-group
```js [ESM]
import { EventEmitter, captureRejectionSymbol } from 'node:events';

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
```

```js [CJS]
const { EventEmitter, captureRejectionSymbol } = require('node:events');

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
```
:::

## `events.defaultMaxListeners` {#eventsdefaultmaxlisteners}

**追加: v0.11.2**

デフォルトでは、単一のイベントに対して最大 `10` 個のリスナーを登録できます。 この制限は、[`emitter.setMaxListeners(n)`](/ja/nodejs/api/events#emittersetmaxlistenersn) メソッドを使用して、個々の `EventEmitter` インスタンスに対して変更できます。 *すべての* `EventEmitter` インスタンスのデフォルトを変更するには、`events.defaultMaxListeners` プロパティを使用できます。 この値が正の数でない場合は、`RangeError` がスローされます。

`events.defaultMaxListeners` を設定する際は注意してください。変更は、変更が行われる前に作成されたものを含め、*すべての* `EventEmitter` インスタンスに影響を与えるためです。 ただし、[`emitter.setMaxListeners(n)`](/ja/nodejs/api/events#emittersetmaxlistenersn) の呼び出しは、`events.defaultMaxListeners` よりも優先されます。

これはハードリミットではありません。 `EventEmitter` インスタンスは、より多くのリスナーの追加を許可しますが、"EventEmitter のメモリリークの可能性" が検出されたことを示すトレース警告を stderr に出力します。 単一の `EventEmitter` に対して、この警告を一時的に回避するために `emitter.getMaxListeners()` および `emitter.setMaxListeners()` メソッドを使用できます。

`defaultMaxListeners` は `AbortSignal` インスタンスには影響しません。 [`emitter.setMaxListeners(n)`](/ja/nodejs/api/events#emittersetmaxlistenersn) を使用して個々の `AbortSignal` インスタンスの警告制限を設定することはできますが、デフォルトでは `AbortSignal` インスタンスは警告しません。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```
:::

[`--trace-warnings`](/ja/nodejs/api/cli#--trace-warnings) コマンドラインフラグを使用して、このような警告のスタックトレースを表示できます。

出力された警告は [`process.on('warning')`](/ja/nodejs/api/process#event-warning) で検査でき、イベントエミッタインスタンス、イベント名、およびアタッチされたリスナーの数をそれぞれ参照する、追加の `emitter`、`type`、および `count` プロパティを持ちます。 その `name` プロパティは `'MaxListenersExceededWarning'` に設定されます。


## `events.errorMonitor` {#eventserrormonitor}

**追加: v13.6.0, v12.17.0**

このシンボルは、`'error'` イベントのみを監視するためのリスナーをインストールするために使用されます。このシンボルを使用してインストールされたリスナーは、通常の `'error'` リスナーが呼び出される前に呼び出されます。

このシンボルを使用してリスナーをインストールしても、`'error'` イベントが発行された後の動作は変更されません。したがって、通常の `'error'` リスナーがインストールされていない場合、プロセスは引き続きクラッシュします。

## `events.getEventListeners(emitterOrTarget, eventName)` {#eventsgeteventlistenersemitterortarget-eventname}

**追加: v15.2.0, v14.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- 戻り値: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`eventName` という名前のイベントのリスナーの配列のコピーを返します。

`EventEmitter` の場合、これはエミッターで `.listeners` を呼び出すのとまったく同じように動作します。

`EventTarget` の場合、これはイベントターゲットのイベントリスナーを取得する唯一の方法です。これは、デバッグおよび診断の目的で役立ちます。

::: code-group
```js [ESM]
import { getEventListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

```js [CJS]
const { getEventListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```
:::


## `events.getMaxListeners(emitterOrTarget)` {#eventsgetmaxlistenersemitterortarget}

**Added in: v19.9.0, v18.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget)
- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

現在設定されているリスナーの最大数を返します。

`EventEmitter` の場合、これはエミッターで `.getMaxListeners` を呼び出すのとまったく同じように動作します。

`EventTarget` の場合、これはイベントターゲットの最大イベントリスナーを取得する唯一の方法です。単一の EventTarget のイベントハンドラーの数が設定された最大値を超えると、EventTarget は警告を出力します。

::: code-group
```js [ESM]
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```

```js [CJS]
const { getMaxListeners, setMaxListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```
:::

## `events.once(emitter, name[, options])` {#eventsonceemitter-name-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.0.0 | `signal` オプションがサポートされるようになりました。 |
| v11.13.0, v10.16.0 | Added in: v11.13.0, v10.16.0 |
:::

- `emitter` [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) イベントの待機をキャンセルするために使用できます。


- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

`EventEmitter` が指定されたイベントを発行したときに履行される `Promise` を作成します。または、待機中に `EventEmitter` が `'error'` を発行した場合は拒否されます。`Promise` は、指定されたイベントに発行されたすべての引数の配列で解決されます。

このメソッドは意図的に汎用的であり、特別な `'error'` イベントセマンティクスを持たず、`'error'` イベントをリッスンしない Web プラットフォームの [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) インターフェースで動作します。

::: code-group
```js [ESM]
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
```

```js [CJS]
const { once, EventEmitter } = require('node:events');

async function run() {
  const ee = new EventEmitter();

  process.nextTick(() => {
    ee.emit('myevent', 42);
  });

  const [value] = await once(ee, 'myevent');
  console.log(value);

  const err = new Error('kaboom');
  process.nextTick(() => {
    ee.emit('error', err);
  });

  try {
    await once(ee, 'myevent');
  } catch (err) {
    console.error('error happened', err);
  }
}

run();
```
:::

`'error'` イベントの特別な処理は、`events.once()` が別のイベントを待機するために使用される場合にのみ使用されます。`events.once()` が `'error'` イベント自体を待機するために使用される場合、特別な処理なしに他の種類のイベントとして扱われます。

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```
:::

[\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) を使用して、イベントの待機をキャンセルできます。

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```
:::


### `process.nextTick()` で発生する複数のイベントの待機 {#awaiting-multiple-events-emitted-on-processnexttick}

`process.nextTick()` 操作の同じバッチ内で、または複数のイベントが同期的に発生する場合に、`events.once()` 関数を使用して複数のイベントを待機するときに注意すべきエッジケースがあります。具体的には、`process.nextTick()` キューは `Promise` マイクロタスクキューの前にドレインされ、`EventEmitter` はすべてのイベントを同期的に発生させるため、`events.once()` がイベントを見逃す可能性があります。

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // この Promise は、'foo' イベントが Promise が作成される前に
  // 既に発生しているため、決して解決されません。
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // この Promise は、'foo' イベントが Promise が作成される前に
  // 既に発生しているため、決して解決されません。
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::

両方のイベントをキャッチするには、それらのいずれかを待機する*前に*、各 Promise を作成します。これにより、`Promise.all()`、`Promise.race()`、または `Promise.allSettled()` を使用できるようになります。

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::


## `events.captureRejections` {#eventscapturerejections}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v17.4.0, v16.14.0 | 実験的ではなくなりました。 |
| v13.4.0, v12.16.0 | 追加: v13.4.0, v12.16.0 |
:::

値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

すべての新しい `EventEmitter` オブジェクトのデフォルトの `captureRejections` オプションを変更します。

## `events.captureRejectionSymbol` {#eventscapturerejectionsymbol}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v17.4.0, v16.14.0 | 実験的ではなくなりました。 |
| v13.4.0, v12.16.0 | 追加: v13.4.0, v12.16.0 |
:::

値: `Symbol.for('nodejs.rejection')`

カスタムの[リジェクションハンドラー](/ja/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args)の書き方をご覧ください。

## `events.listenerCount(emitter, eventName)` {#eventslistenercountemitter-eventname}

**追加: v0.9.12**

**非推奨: v3.2.0**

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定性: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに [`emitter.listenerCount()`](/ja/nodejs/api/events#emitterlistenercounteventname-listener) を使用してください。
:::

- `emitter` [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter) クエリーするエミッター
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) イベント名

与えられた `emitter` に登録されている、与えられた `eventName` のリスナーの数を返すクラスメソッドです。

::: code-group
```js [ESM]
import { EventEmitter, listenerCount } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

```js [CJS]
const { EventEmitter, listenerCount } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```
:::


## `events.on(emitter, eventName[, options])` {#eventsonemitter-eventname-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.0.0, v20.13.0 | 一貫性のため、`highWaterMark` および `lowWaterMark` オプションをサポートします。 古いオプションも引き続きサポートされています。 |
| v20.0.0 | `close`、`highWatermark`、および `lowWatermark` オプションがサポートされるようになりました。 |
| v13.6.0, v12.16.0 | Added in: v13.6.0, v12.16.0 |
:::

- `emitter` [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) リッスンするイベントの名前
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) イベントの待機をキャンセルするために使用できます。
    - `close` - [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) イテレーションを終了するイベントの名前。
    - `highWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `Number.MAX_SAFE_INTEGER` 高水位標。 バッファリングされるイベントのサイズがこれよりも大きい場合、エミッターは毎回一時停止されます。 `pause()` メソッドと `resume()` メソッドを実装するエミッターでのみサポートされます。
    - `lowWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `1` 低水位標。 バッファリングされるイベントのサイズがこれよりも小さい場合、エミッターは毎回再開されます。 `pause()` メソッドと `resume()` メソッドを実装するエミッターでのみサポートされます。

- 戻り値: `emitter` によって発行された `eventName` イベントをイテレートする [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// 後で発行
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // この内部ブロックの実行は同期的であり、
  // 一度に 1 つのイベントを処理します (await を使用しても)。 使用しないでください
  // 同時実行が必要な場合。
  console.log(event); // prints ['bar'] [42]
}
// ここには到達できません
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

(async () => {
  const ee = new EventEmitter();

  // 後で発行
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // この内部ブロックの実行は同期的であり、
    // 一度に 1 つのイベントを処理します (await を使用しても)。 使用しないでください
    // 同時実行が必要な場合。
    console.log(event); // prints ['bar'] [42]
  }
  // ここには到達できません
})();
```
:::

`eventName` イベントを反復処理する `AsyncIterator` を返します。 `EventEmitter` が `'error'` を発行すると、例外をスローします。 ループを終了すると、すべてのリスナーが削除されます。 各イテレーションによって返される `value` は、発行されたイベント引数で構成される配列です。

[\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) を使用して、イベントの待機をキャンセルできます。

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // 後で発行
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // この内部ブロックの実行は同期的であり、
    // 一度に 1 つのイベントを処理します (await を使用しても)。 使用しないでください
    // 同時実行が必要な場合。
    console.log(event); // prints ['bar'] [42]
  }
  // ここには到達できません
})();

process.nextTick(() => ac.abort());
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // 後で発行
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // この内部ブロックの実行は同期的であり、
    // 一度に 1 つのイベントを処理します (await を使用しても)。 使用しないでください
    // 同時実行が必要な場合。
    console.log(event); // prints ['bar'] [42]
  }
  // ここには到達できません
})();

process.nextTick(() => ac.abort());
```
:::


## `events.setMaxListeners(n[, ...eventTargets])` {#eventssetmaxlistenersn-eventtargets}

**追加:** v15.4.0

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 負でない数値。`EventTarget`イベントごとのリスナーの最大数。
- `...eventsTargets` [\<EventTarget[]\>](/ja/nodejs/api/events#class-eventtarget) | [\<EventEmitter[]\>](/ja/nodejs/api/events#class-eventemitter) ゼロ個以上の[\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget)または[\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)のインスタンス。何も指定しない場合、`n`は新しく作成されるすべての[\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget)および[\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)オブジェクトのデフォルトの最大値として設定されます。

::: code-group
```js [ESM]
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

```js [CJS]
const {
  setMaxListeners,
  EventEmitter,
} = require('node:events');

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```
:::

## `events.addAbortListener(signal, listener)` {#eventsaddabortlistenersignal-listener}

**追加:** v20.5.0, v18.18.0

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ja/nodejs/api/events#event-listener)
- 戻り値: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) `abort`リスナーを削除するDisposable。

指定された`signal`の`abort`イベントを一度だけリッスンします。

AbortSignalで`abort`イベントをリッスンすることは安全ではなく、シグナルを持つ別のサードパーティが[`e.stopImmediatePropagation()`](/ja/nodejs/api/events#eventstopimmediatepropagation)を呼び出す可能性があるため、リソースリークにつながる可能性があります。残念ながら、Node.jsはWeb標準に違反するため、これを変更することはできません。さらに、元のAPIではリスナーの削除を忘れやすくなっています。

このAPIは、`stopImmediatePropagation`がリスナーの実行を妨げないようにイベントをリッスンすることで、これらの2つの問題を解決することにより、Node.js APIで`AbortSignal`を安全に使用できるようにします。

より簡単に購読解除できるように、Disposableを返します。

::: code-group
```js [CJS]
const { addAbortListener } = require('node:events');

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```

```js [ESM]
import { addAbortListener } from 'node:events';

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```
:::


## クラス: `events.EventEmitterAsyncResource extends EventEmitter` {#class-eventseventemitterasyncresource-extends-eventemitter}

**追加: v17.4.0, v16.14.0**

手動の非同期追跡を必要とする `EventEmitter` 用に、[\<AsyncResource\>](/ja/nodejs/api/async_hooks#class-asyncresource) と `EventEmitter` を統合します。具体的には、`events.EventEmitterAsyncResource` のインスタンスによって発行されるすべてのイベントは、その [async context](/ja/nodejs/api/async_context) 内で実行されます。

::: code-group
```js [ESM]
import { EventEmitterAsyncResource, EventEmitter } from 'node:events';
import { notStrictEqual, strictEqual } from 'node:assert';
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

// 非同期追跡ツールはこれを 'Q' として識別します。
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// 'foo' リスナーは EventEmitters の非同期コンテキストで実行されます。
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// ただし、非同期コンテキストを追跡しない通常の EventEmitters の 'foo' リスナーは、emit() と同じ非同期コンテキストで実行されます。
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```

```js [CJS]
const { EventEmitterAsyncResource, EventEmitter } = require('node:events');
const { notStrictEqual, strictEqual } = require('node:assert');
const { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

// 非同期追跡ツールはこれを 'Q' として識別します。
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// 'foo' リスナーは EventEmitters の非同期コンテキストで実行されます。
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// ただし、非同期コンテキストを追跡しない通常の EventEmitters の 'foo' リスナーは、emit() と同じ非同期コンテキストで実行されます。
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```
:::

`EventEmitterAsyncResource` クラスは、`EventEmitter` および `AsyncResource` 自体と同じメソッドを持ち、同じオプションを取ります。


### `new events.EventEmitterAsyncResource([options])` {#new-eventseventemitterasyncresourceoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) [Promiseのリジェクトの自動キャプチャ](/ja/nodejs/api/events#capture-rejections-of-promises)を有効にします。**デフォルト:** `false`。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 非同期イベントのタイプ。**デフォルト:** [`new.target.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target)。
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この非同期イベントを作成した実行コンテキストのID。**デフォルト:** `executionAsyncId()`。
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` に設定すると、オブジェクトがガベージコレクションされるときに `emitDestroy` が無効になります。リソースの `asyncId` が取得され、機密性の高いAPIの `emitDestroy` がそれとともに呼び出される場合を除き、通常、これを設定する必要はありません（`emitDestroy` が手動で呼び出された場合でも）。`false` に設定すると、ガベージコレクションでの `emitDestroy` 呼び出しは、少なくとも1つのアクティブな `destroy` フックがある場合にのみ実行されます。**デフォルト:** `false`。
  
 

### `eventemitterasyncresource.asyncId` {#eventemitterasyncresourceasyncid}

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) リソースに割り当てられた一意の `asyncId`。

### `eventemitterasyncresource.asyncResource` {#eventemitterasyncresourceasyncresource}

- Type: 基になる[\<AsyncResource\>](/ja/nodejs/api/async_hooks#class-asyncresource)。

返された `AsyncResource` オブジェクトには、この `EventEmitterAsyncResource` への参照を提供する追加の `eventEmitter` プロパティがあります。

### `eventemitterasyncresource.emitDestroy()` {#eventemitterasyncresourceemitdestroy}

すべての `destroy` フックを呼び出します。これは一度だけ呼び出す必要があります。複数回呼び出すとエラーがスローされます。これは手動で呼び出す**必要があります**。リソースがGCによって収集されるまで放置されると、`destroy` フックは決して呼び出されません。


### `eventemitterasyncresource.triggerAsyncId` {#eventemitterasyncresourcetriggerasyncid}

- タイプ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `AsyncResource` コンストラクターに渡されるのと同じ `triggerAsyncId`。

## `EventTarget` と `Event` API {#eventtarget-and-event-api}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | EventTarget のエラー処理を変更しました。 |
| v15.4.0 | 実験的ではなくなりました。 |
| v15.0.0 | `EventTarget` および `Event` クラスがグローバル変数として利用できるようになりました。 |
| v14.5.0 | 追加: v14.5.0 |
:::

`EventTarget` および `Event` オブジェクトは、[`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget) の Node.js 固有の実装であり、一部の Node.js コア API によって公開されます。

```js [ESM]
const target = new EventTarget();

target.addEventListener('foo', (event) => {
  console.log('foo event happened!');
});
```
### Node.js `EventTarget` と DOM `EventTarget` の比較 {#nodejs-eventtarget-vs-dom-eventtarget}

Node.js `EventTarget` と [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget) には、2 つの重要な違いがあります。

### `NodeEventTarget` と `EventEmitter` の比較 {#nodeeventtarget-vs-eventemitter}

`NodeEventTarget` オブジェクトは、特定の状況で `EventEmitter` を厳密に*エミュレート*できるようにする、`EventEmitter` API の変更されたサブセットを実装します。 `NodeEventTarget` は `EventEmitter` のインスタンス*ではありません*。ほとんどの場合、`EventEmitter` の代わりに使用することはできません。

### イベントリスナー {#event-listener}

イベント `type` に登録されたイベントリスナーは、JavaScript 関数、または値が関数の `handleEvent` プロパティを持つオブジェクトのいずれかになります。

どちらの場合も、ハンドラー関数は `eventTarget.dispatchEvent()` 関数に渡される `event` 引数を使用して呼び出されます。

非同期関数をイベントリスナーとして使用できます。 非同期ハンドラー関数が拒否された場合、拒否はキャプチャされ、[`EventTarget` エラー処理](/ja/nodejs/api/events#eventtarget-error-handling) で説明されているように処理されます。

1 つのハンドラー関数によってスローされたエラーは、他のハンドラーが呼び出されるのを妨げません。

ハンドラーの戻り値は無視されます。

ハンドラーは、常にそれらが追加された順序で呼び出されます。

ハンドラー関数は `event` オブジェクトを変更できます。

```js [ESM]
function handler1(event) {
  console.log(event.type);  // Prints 'foo'
  event.a = 1;
}

async function handler2(event) {
  console.log(event.type);  // Prints 'foo'
  console.log(event.a);  // Prints 1
}

const handler3 = {
  handleEvent(event) {
    console.log(event.type);  // Prints 'foo'
  },
};

const handler4 = {
  async handleEvent(event) {
    console.log(event.type);  // Prints 'foo'
  },
};

const target = new EventTarget();

target.addEventListener('foo', handler1);
target.addEventListener('foo', handler2);
target.addEventListener('foo', handler3);
target.addEventListener('foo', handler4, { once: true });
```

### `EventTarget` エラー処理 {#eventtarget-error-handling}

登録されたイベントリスナーが例外をスローする（またはリジェクトされる Promise を返す）場合、デフォルトでは、エラーは `process.nextTick()` 上でキャッチされない例外として扱われます。これは、`EventTarget` でキャッチされない例外が発生すると、デフォルトで Node.js プロセスが終了することを意味します。

イベントリスナー内で例外をスローしても、他の登録されたハンドラーの呼び出しが停止されることは *ありません*。

`EventTarget` は、`EventEmitter` のように、`'error'` タイプのイベントに対する特別なデフォルト処理を実装していません。

現在、エラーは最初に `process.on('error')` イベントに転送されてから、`process.on('uncaughtException')` に到達します。この動作は非推奨であり、将来のリリースで `EventTarget` を他の Node.js API と整合するように変更されます。`process.on('error')` イベントに依存するすべてのコードは、新しい動作に合わせて調整する必要があります。

### Class: `Event` {#class-event}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.0.0 | `Event` クラスがグローバルオブジェクトを通じて利用可能になりました。 |
| v14.5.0 | 追加: v14.5.0 |
:::

`Event` オブジェクトは、[`Event` Web API](https://dom.spec.whatwg.org/#event) の適応です。インスタンスは Node.js によって内部的に作成されます。

#### `event.bubbles` {#eventbubbles}

**追加: v14.5.0**

- 型: [\<boolean\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Boolean_type) 常に `false` を返します。

これは Node.js では使用されず、完全性のためだけに提供されています。

#### `event.cancelBubble` {#eventcancelbubble}

**追加: v14.5.0**

::: info [安定版: 3 - レガシー]
[安定版: 3](/ja/nodejs/api/documentation#stability-index) [安定度: 3](/ja/nodejs/api/documentation#stability-index) - レガシー: 代わりに [`event.stopPropagation()`](/ja/nodejs/api/events#eventstoppropagation) を使用してください。
:::

- 型: [\<boolean\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Boolean_type)

`true` に設定されている場合、`event.stopPropagation()` のエイリアスです。これは Node.js では使用されず、完全性のためだけに提供されています。

#### `event.cancelable` {#eventcancelable}

**追加: v14.5.0**

- 型: [\<boolean\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Boolean_type) イベントが `cancelable` オプションを使用して作成された場合は true。


#### `event.composed` {#eventcomposed}

**Added in: v14.5.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 常に `false` を返します。

これはNode.jsでは使用されず、完全を期すためにのみ提供されています。

#### `event.composedPath()` {#eventcomposedpath}

**Added in: v14.5.0**

現在の `EventTarget` を唯一のエントリーとして含む配列を返します。イベントがディスパッチされていない場合は空です。これはNode.jsでは使用されず、完全を期すためにのみ提供されています。

#### `event.currentTarget` {#eventcurrenttarget}

**Added in: v14.5.0**

- Type: [\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget) イベントをディスパッチしている `EventTarget`。

`event.target` のエイリアス。

#### `event.defaultPrevented` {#eventdefaultprevented}

**Added in: v14.5.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`cancelable` が `true` であり、`event.preventDefault()` が呼び出された場合は `true`。

#### `event.eventPhase` {#eventeventphase}

**Added in: v14.5.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) イベントがディスパッチされていない間は `0` を返し、ディスパッチされている間は `2` を返します。

これはNode.jsでは使用されず、完全を期すためにのみ提供されています。

#### `event.initEvent(type[, bubbles[, cancelable]])` {#eventiniteventtype-bubbles-cancelable}

**Added in: v19.5.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ja/nodejs/api/documentation#stability-index) [Stability: 3](/ja/nodejs/api/documentation#stability-index) - レガシー: WHATWG仕様では非推奨とされており、ユーザーはまったく使用すべきではありません。
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `bubbles` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `cancelable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

イベントコンストラクターと冗長であり、`composed` を設定できません。これはNode.jsでは使用されず、完全を期すためにのみ提供されています。

#### `event.isTrusted` {#eventistrusted}

**Added in: v14.5.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) `"abort"` イベントは、`isTrusted` が `true` に設定されて発行されます。それ以外の場合は `false` です。


#### `event.preventDefault()` {#eventpreventdefault}

**Added in: v14.5.0**

`cancelable` が `true` の場合、`defaultPrevented` プロパティを `true` に設定します。

#### `event.returnValue` {#eventreturnvalue}

**Added in: v14.5.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ja/nodejs/api/documentation#stability-index) [Stability: 3](/ja/nodejs/api/documentation#stability-index) - Legacy: 代わりに [`event.defaultPrevented`](/ja/nodejs/api/events#eventdefaultprevented) を使用してください。
:::

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) イベントがキャンセルされていない場合は true。

`event.returnValue` の値は常に `event.defaultPrevented` の反対です。 これは Node.js では使用されず、完全に網羅するために提供されています。

#### `event.srcElement` {#eventsrcelement}

**Added in: v14.5.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ja/nodejs/api/documentation#stability-index) [Stability: 3](/ja/nodejs/api/documentation#stability-index) - Legacy: 代わりに [`event.target`](/ja/nodejs/api/events#eventtarget) を使用してください。
:::

- Type: [\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget) イベントをディスパッチする `EventTarget`。

`event.target` のエイリアス。

#### `event.stopImmediatePropagation()` {#eventstopimmediatepropagation}

**Added in: v14.5.0**

現在のイベントリスナーが完了した後、イベントリスナーの呼び出しを停止します。

#### `event.stopPropagation()` {#eventstoppropagation}

**Added in: v14.5.0**

これは Node.js では使用されず、完全に網羅するために提供されています。

#### `event.target` {#eventtarget}

**Added in: v14.5.0**

- Type: [\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget) イベントをディスパッチする `EventTarget`。

#### `event.timeStamp` {#eventtimestamp}

**Added in: v14.5.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`Event` オブジェクトが作成されたときのミリ秒単位のタイムスタンプ。

#### `event.type` {#eventtype}

**Added in: v14.5.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

イベントタイプ識別子。

### Class: `EventTarget` {#class-eventtarget}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | `EventTarget` クラスがグローバルオブジェクトから利用可能になりました。 |
| v14.5.0 | Added in: v14.5.0 |
:::


#### `eventTarget.addEventListener(type, listener[, options])` {#eventtargetaddeventlistenertype-listener-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.4.0 | `signal` オプションのサポートを追加。 |
| v14.5.0 | Added in: v14.5.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ja/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `once` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、リスナーは最初に呼び出されたときに自動的に削除されます。**デフォルト:** `false`。
    - `passive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、リスナーが `Event` オブジェクトの `preventDefault()` メソッドを呼び出さないというヒントとして機能します。**デフォルト:** `false`。
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Node.js では直接使用されません。API の完全性のために追加されました。**デフォルト:** `false`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 指定された AbortSignal オブジェクトの `abort()` メソッドが呼び出されると、リスナーが削除されます。

`type` イベントの新しいハンドラを追加します。指定された `listener` は、`type` ごとに、また `capture` オプションの値ごとに一度だけ追加されます。

`once` オプションが `true` の場合、`listener` は次回 `type` イベントがディスパッチされた後に削除されます。

`capture` オプションは、`EventTarget` 仕様に従って登録されたイベントリスナーを追跡する以外の機能的な方法では、Node.js によって使用されません。具体的には、`capture` オプションは `listener` を登録する際のキーの一部として使用されます。個々の `listener` は、`capture = false` で一度、`capture = true` で一度追加できます。

```js [ESM]
function handler(event) {}

const target = new EventTarget();
target.addEventListener('foo', handler, { capture: true });  // first
target.addEventListener('foo', handler, { capture: false }); // second

// Removes the second instance of handler
target.removeEventListener('foo', handler);

// Removes the first instance of handler
target.removeEventListener('foo', handler, { capture: true });
```

#### `eventTarget.dispatchEvent(event)` {#eventtargetdispatcheventevent}

**Added in: v14.5.0**

- `event` [\<Event\>](/ja/nodejs/api/events#class-event)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) event の `cancelable` 属性値が false であるか、または `preventDefault()` メソッドが呼び出されなかった場合は `true`。それ以外の場合は `false`。

`event.type` のハンドラーのリストに `event` をディスパッチします。

登録されたイベントリスナーは、登録された順に同期的に呼び出されます。

#### `eventTarget.removeEventListener(type, listener[, options])` {#eventtargetremoveeventlistenertype-listener-options}

**Added in: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ja/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

イベント `type` のハンドラーのリストから `listener` を削除します。

### Class: `CustomEvent` {#class-customevent}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | No longer experimental. |
| v22.1.0, v20.13.0 | CustomEvent is now stable. |
| v19.0.0 | No longer behind `--experimental-global-customevent` CLI flag. |
| v18.7.0, v16.17.0 | Added in: v18.7.0, v16.17.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

- 拡張: [\<Event\>](/ja/nodejs/api/events#class-event)

`CustomEvent` オブジェクトは、[`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent) のアダプテーションです。インスタンスは Node.js によって内部的に作成されます。

#### `event.detail` {#eventdetail}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.1.0, v20.13.0 | CustomEvent is now stable. |
| v18.7.0, v16.17.0 | Added in: v18.7.0, v16.17.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

- タイプ: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 初期化時に渡されるカスタムデータを返します。

読み取り専用。


### クラス: `NodeEventTarget` {#class-nodeeventtarget}

**追加: v14.5.0**

- 拡張: [\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget)

`NodeEventTarget` は、`EventEmitter` API のサブセットをエミュレートする Node.js 固有の `EventTarget` の拡張です。

#### `nodeEventTarget.addListener(type, listener)` {#nodeeventtargetaddlistenertype-listener}

**追加: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ja/nodejs/api/events#event-listener)
-  戻り値: [\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget) `this`

`EventEmitter` API と同等のものをエミュレートする、`EventTarget` クラスの Node.js 固有の拡張。 `addListener()` と `addEventListener()` の唯一の違いは、`addListener()` が `EventTarget` への参照を返すことです。

#### `nodeEventTarget.emit(type, arg)` {#nodeeventtargetemittype-arg}

**追加: v15.2.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `arg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `type` に登録されたイベントリスナーが存在する場合は `true`、それ以外の場合は `false`。

`EventTarget` クラスの Node.js 固有の拡張で、`type` のハンドラーのリストに `arg` をディスパッチします。

#### `nodeEventTarget.eventNames()` {#nodeeventtargeteventnames}

**追加: v14.5.0**

- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

イベントリスナーが登録されているイベントの `type` 名の配列を返す、`EventTarget` クラスの Node.js 固有の拡張。

#### `nodeEventTarget.listenerCount(type)` {#nodeeventtargetlistenercounttype}

**追加: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`type` に登録されているイベントリスナーの数を返す、`EventTarget` クラスの Node.js 固有の拡張。


#### `nodeEventTarget.setMaxListeners(n)` {#nodeeventtargetsetmaxlistenersn}

**Added in: v14.5.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js固有の`EventTarget`クラスの拡張で、最大イベントリスナー数を`n`として設定します。

#### `nodeEventTarget.getMaxListeners()` {#nodeeventtargetgetmaxlisteners}

**Added in: v14.5.0**

- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js固有の`EventTarget`クラスの拡張で、最大イベントリスナー数を返します。

#### `nodeEventTarget.off(type, listener[, options])` {#nodeeventtargetofftype-listener-options}

**Added in: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ja/nodejs/api/events#event-listener) 
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 
-  戻り値: [\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget) this 

Node.js固有の`eventTarget.removeEventListener()`のエイリアスです。

#### `nodeEventTarget.on(type, listener)` {#nodeeventtargetontype-listener}

**Added in: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ja/nodejs/api/events#event-listener) 
-  戻り値: [\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget) this 

Node.js固有の`eventTarget.addEventListener()`のエイリアスです。

#### `nodeEventTarget.once(type, listener)` {#nodeeventtargetoncetype-listener}

**Added in: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ja/nodejs/api/events#event-listener) 
-  戻り値: [\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget) this 

Node.js固有の`EventTarget`クラスの拡張で、指定されたイベント`type`に対して`once`リスナーを追加します。これは、`once`オプションを`true`に設定して`on`を呼び出すことと同等です。


#### `nodeEventTarget.removeAllListeners([type])` {#nodeeventtargetremovealllistenerstype}

**Added in: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  返します: [\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget) this 

Node.js 固有の `EventTarget` クラスの拡張です。`type` が指定された場合、`type` に登録されているすべてのリスナーを削除します。それ以外の場合は、登録されているすべてのリスナーを削除します。

#### `nodeEventTarget.removeListener(type, listener[, options])` {#nodeeventtargetremovelistenertype-listener-options}

**Added in: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ja/nodejs/api/events#event-listener) 
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 
-  返します: [\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget) this 

Node.js 固有の `EventTarget` クラスの拡張で、指定された `type` の `listener` を削除します。`removeListener()` と `removeEventListener()` の唯一の違いは、`removeListener()` が `EventTarget` への参照を返すことです。

