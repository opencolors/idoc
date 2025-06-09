---
title: Node.js ワーカースレッド
description: Node.jsでワーカースレッドを使用してCPU集約型タスクのためのマルチスレッドを活用する方法に関するドキュメント。Workerクラスの概要、スレッド間通信、使用例を提供します。
head:
  - - meta
    - name: og:title
      content: Node.js ワーカースレッド | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsでワーカースレッドを使用してCPU集約型タスクのためのマルチスレッドを活用する方法に関するドキュメント。Workerクラスの概要、スレッド間通信、使用例を提供します。
  - - meta
    - name: twitter:title
      content: Node.js ワーカースレッド | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsでワーカースレッドを使用してCPU集約型タスクのためのマルチスレッドを活用する方法に関するドキュメント。Workerクラスの概要、スレッド間通信、使用例を提供します。
---


# Worker threads {#worker-threads}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/worker_threads.js](https://github.com/nodejs/node/blob/v23.5.0/lib/worker_threads.js)

`node:worker_threads` モジュールは、JavaScript を並列に実行するスレッドの使用を可能にします。 それにアクセスするには:

```js [ESM]
const worker = require('node:worker_threads');
```

ワーカー（スレッド）は、CPU 負荷の高い JavaScript 操作を実行するのに役立ちます。 I/O 負荷の高い作業にはあまり役立ちません。 Node.js の組み込みの非同期 I/O 操作は、ワーカーよりも効率的です。

`child_process` や `cluster` とは異なり、`worker_threads` はメモリを共有できます。 これを行うには、`ArrayBuffer` インスタンスを転送するか、`SharedArrayBuffer` インスタンスを共有します。

```js [ESM]
const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

if (isMainThread) {
  module.exports = function parseJSAsync(script) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: script,
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  };
} else {
  const { parse } = require('some-js-parsing-library');
  const script = workerData;
  parentPort.postMessage(parse(script));
}
```

上記の例では、`parseJSAsync()` の呼び出しごとにワーカースレッドを生成します。 実際には、これらの種類のタスクにはワーカーのプールを使用します。 そうしないと、ワーカーの作成のオーバーヘッドが、そのメリットを上回る可能性があります。

ワーカープールを実装する場合は、[`AsyncResource`](/ja/nodejs/api/async_hooks#class-asyncresource) API を使用して、タスクとその結果の間の相関関係について診断ツール (たとえば、非同期スタックトレースを提供するため) に通知します。 実装例については、`async_hooks` ドキュメントの ["`Worker` スレッドプールに `AsyncResource` を使用する"](/ja/nodejs/api/async_context#using-asyncresource-for-a-worker-thread-pool) を参照してください。

ワーカースレッドは、デフォルトでプロセス固有でないオプションを継承します。 ワーカースレッドのオプション、特に `argv` および `execArgv` オプションをカスタマイズする方法については、[`Worker コンストラクターオプション`](/ja/nodejs/api/worker_threads#new-workerfilename-options) を参照してください。


## `worker.getEnvironmentData(key)` {#workergetenvironmentdatakey}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v17.5.0, v16.15.0 | 実験的ではなくなりました。 |
| v15.12.0, v14.18.0 | 追加: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) キーとして使用できる、任意の複製可能な JavaScript 値。
- 戻り値: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

ワーカー スレッド内では、`worker.getEnvironmentData()` は、起動スレッドの `worker.setEnvironmentData()` に渡されたデータの複製を返します。新しい `Worker` はすべて、環境データの独自のコピーを自動的に受信します。

```js [ESM]
const {
  Worker,
  isMainThread,
  setEnvironmentData,
  getEnvironmentData,
} = require('node:worker_threads');

if (isMainThread) {
  setEnvironmentData('Hello', 'World!');
  const worker = new Worker(__filename);
} else {
  console.log(getEnvironmentData('Hello'));  // Prints 'World!'.
}
```
## `worker.isMainThread` {#workerismainthread}

**追加: v10.5.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

このコードが [`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッド内で実行されていない場合は `true`。

```js [ESM]
const { Worker, isMainThread } = require('node:worker_threads');

if (isMainThread) {
  // This re-loads the current file inside a Worker instance.
  new Worker(__filename);
} else {
  console.log('Inside Worker!');
  console.log(isMainThread);  // Prints 'false'.
}
```
## `worker.markAsUntransferable(object)` {#workermarkasuntransferableobject}

**追加: v14.5.0, v12.19.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任意の JavaScript 値。

オブジェクトを転送不可としてマークします。`object` が [`port.postMessage()`](/ja/nodejs/api/worker_threads#portpostmessagevalue-transferlist) 呼び出しの転送リストに出現する場合、エラーがスローされます。`object` がプリミティブ値の場合、これは何もしません。

特に、これは、転送されるのではなく、複製できるオブジェクト、および送信側の他のオブジェクトで使用されるオブジェクトに適しています。たとえば、Node.js は、[`Buffer` プール](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize)に使用する `ArrayBuffer` にこれでマークを付けます。

この操作は元に戻せません。

```js [ESM]
const { MessageChannel, markAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
const typedArray1 = new Uint8Array(pooledBuffer);
const typedArray2 = new Float64Array(pooledBuffer);

markAsUntransferable(pooledBuffer);

const { port1 } = new MessageChannel();
try {
  // This will throw an error, because pooledBuffer is not transferable.
  port1.postMessage(typedArray1, [ typedArray1.buffer ]);
} catch (error) {
  // error.name === 'DataCloneError'
}

// The following line prints the contents of typedArray1 -- it still owns
// its memory and has not been transferred. Without
// `markAsUntransferable()`, this would print an empty Uint8Array and the
// postMessage call would have succeeded.
// typedArray2 is intact as well.
console.log(typedArray1);
console.log(typedArray2);
```
ブラウザには、これに相当する API はありません。


## `worker.isMarkedAsUntransferable(object)` {#workerismarkedasuntransferableobject}

**追加:** v21.0.0

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任意のJavaScript値。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

オブジェクトが [`markAsUntransferable()`](/ja/nodejs/api/worker_threads#workermarkasuntransferableobject) で譲渡不可能としてマークされているかどうかを確認します。

```js [ESM]
const { markAsUntransferable, isMarkedAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
markAsUntransferable(pooledBuffer);

isMarkedAsUntransferable(pooledBuffer);  // trueを返します。
```
このAPIに相当するものはブラウザーにはありません。

## `worker.markAsUncloneable(object)` {#workermarkasuncloneableobject}

**追加:** v23.0.0

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任意のJavaScript値。

オブジェクトを複製不可能としてマークします。`object` が [`port.postMessage()`](/ja/nodejs/api/worker_threads#portpostmessagevalue-transferlist) 呼び出しで [`message`](/ja/nodejs/api/worker_threads#event-message) として使用された場合、エラーがスローされます。`object` がプリミティブ値の場合、これはnoopです。

これは `ArrayBuffer`、または `Buffer` のようなオブジェクトには影響しません。

この操作は元に戻すことはできません。

```js [ESM]
const { markAsUncloneable } = require('node:worker_threads');

const anyObject = { foo: 'bar' };
markAsUncloneable(anyObject);
const { port1 } = new MessageChannel();
try {
  // anyObjectは複製不可能であるため、これはエラーをスローします。
  port1.postMessage(anyObject);
} catch (error) {
  // error.name === 'DataCloneError'
}
```
このAPIに相当するものはブラウザーにはありません。

## `worker.moveMessagePortToContext(port, contextifiedSandbox)` {#workermovemessageporttocontextport-contextifiedsandbox}

**追加:** v11.13.0

- `port` [\<MessagePort\>](/ja/nodejs/api/worker_threads#class-messageport) 転送するメッセージポート。
- `contextifiedSandbox` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `vm.createContext()` メソッドによって返される [コンテキスト化](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) オブジェクト。
- 戻り値: [\<MessagePort\>](/ja/nodejs/api/worker_threads#class-messageport)

`MessagePort` を別の [`vm`](/ja/nodejs/api/vm) コンテキストに転送します。元の `port` オブジェクトは使用不能になり、返された `MessagePort` インスタンスがその代わりになります。

返された `MessagePort` はターゲットコンテキスト内のオブジェクトであり、そのグローバル `Object` クラスから継承します。[`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage) リスナーに渡されるオブジェクトもターゲットコンテキストで作成され、そのグローバル `Object` クラスから継承します。

ただし、作成された `MessagePort` は [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) から継承しなくなり、[`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage) のみを使用してイベントを受信できます。


## `worker.parentPort` {#workerparentport}

**追加:** v10.5.0

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<MessagePort\>](/ja/nodejs/api/worker_threads#class-messageport)

このスレッドが [`Worker`](/ja/nodejs/api/worker_threads#class-worker) である場合、これは親スレッドとの通信を可能にする [`MessagePort`](/ja/nodejs/api/worker_threads#class-messageport) です。`parentPort.postMessage()` を使用して送信されたメッセージは、親スレッドで `worker.on('message')` を使用して利用でき、親スレッドから `worker.postMessage()` を使用して送信されたメッセージは、このスレッドで `parentPort.on('message')` を使用して利用できます。

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.once('message', (message) => {
    console.log(message);  // Prints 'Hello, world!'.
  });
  worker.postMessage('Hello, world!');
} else {
  // When a message from the parent thread is received, send it back:
  parentPort.once('message', (message) => {
    parentPort.postMessage(message);
  });
}
```
## `worker.postMessageToThread(threadId, value[, transferList][, timeout])` {#workerpostmessagetothreadthreadid-value-transferlist-timeout}

**追加:** v22.5.0

::: warning [Stable: 1 - 実験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

- `threadId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ターゲットのスレッドID。スレッドIDが無効な場合、[`ERR_WORKER_MESSAGING_FAILED`](/ja/nodejs/api/errors#err_worker_messaging_failed)エラーがスローされます。ターゲットのスレッドIDが現在のスレッドIDと同じ場合、[`ERR_WORKER_MESSAGING_SAME_THREAD`](/ja/nodejs/api/errors#err_worker_messaging_same_thread)エラーがスローされます。
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 送信する値。
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 1つ以上の `MessagePort` のようなオブジェクトが `value` で渡される場合、それらのアイテムには `transferList` が必要です。そうでない場合、[`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/ja/nodejs/api/errors#err_missing_message_port_in_transfer_list) がスローされます。詳細については、[`port.postMessage()`](/ja/nodejs/api/worker_threads#portpostmessagevalue-transferlist) を参照してください。
- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) メッセージが配信されるまで待機する時間（ミリ秒単位）。デフォルトは `undefined` で、これは永遠に待機することを意味します。操作がタイムアウトした場合、[`ERR_WORKER_MESSAGING_TIMEOUT`](/ja/nodejs/api/errors#err_worker_messaging_timeout)エラーがスローされます。
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) メッセージが宛先スレッドによって正常に処理された場合に解決されるPromise。

スレッドIDで識別される別のワーカーに値を送信します。

ターゲットスレッドが `workerMessage` イベントのリスナーを持っていない場合、操作は [`ERR_WORKER_MESSAGING_FAILED`](/ja/nodejs/api/errors#err_worker_messaging_failed) エラーをスローします。

ターゲットスレッドが `workerMessage` イベントの処理中にエラーをスローした場合、操作は [`ERR_WORKER_MESSAGING_ERRORED`](/ja/nodejs/api/errors#err_worker_messaging_errored) エラーをスローします。

このメソッドは、ターゲットスレッドが現在のスレッドの直接の親または子ではない場合に使用する必要があります。2つのスレッドが親子関係にある場合は、[`require('node:worker_threads').parentPort.postMessage()`](/ja/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) および [`worker.postMessage()`](/ja/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) を使用してスレッドに通信させます。

以下の例は、`postMessageToThread` の使用を示しています。これは10個のネストされたスレッドを作成し、最後のスレッドがメインスレッドと通信しようとします。

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} from 'node:worker_threads';

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(fileURLToPath(import.meta.url), {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  await postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```

```js [CJS]
const {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} = require('node:worker_threads');

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(__filename, {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```
:::


## `worker.receiveMessageOnPort(port)` {#workerreceivemessageonportport}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.12.0 | `port` 引数は `BroadcastChannel` を参照できるようになりました。 |
| v12.3.0 | 追加: v12.3.0 |
:::

-  `port` [\<MessagePort\>](/ja/nodejs/api/worker_threads#class-messageport) | [\<BroadcastChannel\>](/ja/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget) 
-  戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 

指定された `MessagePort` から単一のメッセージを受信します。メッセージがない場合、`undefined` が返されます。それ以外の場合は、`message` プロパティを1つだけ持つオブジェクトが返されます。このプロパティには、`MessagePort` のキュー内の最も古いメッセージに対応するメッセージペイロードが含まれています。

```js [ESM]
const { MessageChannel, receiveMessageOnPort } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();
port1.postMessage({ hello: 'world' });

console.log(receiveMessageOnPort(port2));
// Prints: { message: { hello: 'world' } }
console.log(receiveMessageOnPort(port2));
// Prints: undefined
```
この関数を使用すると、`'message'` イベントは発行されず、`onmessage` リスナーは呼び出されません。

## `worker.resourceLimits` {#workerresourcelimits}

**追加: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

この Worker スレッド内の JS エンジンのリソース制約のセットを提供します。`resourceLimits` オプションが [`Worker`](/ja/nodejs/api/worker_threads#class-worker) コンストラクタに渡された場合、これはその値と一致します。

これがメインスレッドで使用されている場合、その値は空のオブジェクトです。


## `worker.SHARE_ENV` {#workershare_env}

**追加:** v11.14.0

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

[`Worker`](/ja/nodejs/api/worker_threads#class-worker)コンストラクターの `env` オプションとして渡すことができる特別な値。現在のスレッドと Worker スレッドが同じ環境変数のセットへの読み書きアクセスを共有することを示すために使用されます。

```js [ESM]
const { Worker, SHARE_ENV } = require('node:worker_threads');
new Worker('process.env.SET_IN_WORKER = "foo"', { eval: true, env: SHARE_ENV })
  .on('exit', () => {
    console.log(process.env.SET_IN_WORKER);  // 'foo' と出力されます。
  });
```
## `worker.setEnvironmentData(key[, value])` {#workersetenvironmentdatakey-value}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v17.5.0, v16.15.0 | 実験的ではなくなりました。 |
| v15.12.0, v14.18.0 | 追加: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) キーとして使用できる任意のクローン可能な JavaScript 値。
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任意のクローン可能な JavaScript 値。クローンされ、すべての新しい `Worker` インスタンスに自動的に渡されます。 `value` が `undefined` として渡された場合、`key` に対して以前に設定された値は削除されます。

`worker.setEnvironmentData()` API は、現在のスレッドと、現在のコンテキストから生成されたすべての新しい `Worker` インスタンスで `worker.getEnvironmentData()` の内容を設定します。

## `worker.threadId` {#workerthreadid}

**追加:** v10.5.0

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

現在のスレッドの整数識別子。 対応する worker オブジェクト（もしあれば）では、[`worker.threadId`](/ja/nodejs/api/worker_threads#workerthreadid_1) として利用できます。 この値は、単一のプロセス内の各 [`Worker`](/ja/nodejs/api/worker_threads#class-worker) インスタンスに対して一意です。


## `worker.workerData` {#workerworkerdata}

**追加:** v10.5.0

このスレッドの `Worker` コンストラクターに渡されたデータのクローンを含む任意の JavaScript 値。

データは、[HTML 構造化クローンアルゴリズム](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)に従って、[`postMessage()`](/ja/nodejs/api/worker_threads#portpostmessagevalue-transferlist) を使用するのと同じようにクローンされます。

```js [ESM]
const { Worker, isMainThread, workerData } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: 'Hello, world!' });
} else {
  console.log(workerData);  // 'Hello, world!' と出力。
}
```
## Class: `BroadcastChannel extends EventTarget` {#class-broadcastchannel-extends-eventtarget}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | 実験的ではなくなりました。 |
| v15.4.0 | 追加: v15.4.0 |
:::

`BroadcastChannel` のインスタンスは、同じチャネル名にバインドされた他のすべての `BroadcastChannel` インスタンスとの非同期の一対多の通信を可能にします。

```js [ESM]
'use strict';

const {
  isMainThread,
  BroadcastChannel,
  Worker,
} = require('node:worker_threads');

const bc = new BroadcastChannel('hello');

if (isMainThread) {
  let c = 0;
  bc.onmessage = (event) => {
    console.log(event.data);
    if (++c === 10) bc.close();
  };
  for (let n = 0; n < 10; n++)
    new Worker(__filename);
} else {
  bc.postMessage('hello from every worker');
  bc.close();
}
```
### `new BroadcastChannel(name)` {#new-broadcastchannelname}

**追加:** v15.4.0

- `name` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 接続するチャネルの名前。 ``${name}`` を使用して文字列に変換できる JavaScript 値はすべて許可されます。

### `broadcastChannel.close()` {#broadcastchannelclose}

**追加:** v15.4.0

`BroadcastChannel` 接続を閉じます。

### `broadcastChannel.onmessage` {#broadcastchannelonmessage}

**追加:** v15.4.0

- Type: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) メッセージを受信すると、単一の `MessageEvent` 引数で呼び出されます。


### `broadcastChannel.onmessageerror` {#broadcastchannelonmessageerror}

**追加:** v15.4.0

- タイプ: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 受信したメッセージがデシリアライズできない場合に呼び出されます。

### `broadcastChannel.postMessage(message)` {#broadcastchannelpostmessagemessage}

**追加:** v15.4.0

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) クローン可能な JavaScript 値。

### `broadcastChannel.ref()` {#broadcastchannelref}

**追加:** v15.4.0

`unref()` の反対です。以前に `unref()` された BroadcastChannel で `ref()` を呼び出しても、それが残された唯一のアクティブなハンドルである場合、プログラムは終了しません（デフォルトの動作）。ポートが `ref()` されている場合、再度 `ref()` を呼び出しても効果はありません。

### `broadcastChannel.unref()` {#broadcastchannelunref}

**追加:** v15.4.0

BroadcastChannel で `unref()` を呼び出すと、これがイベントシステム内の唯一のアクティブなハンドルである場合に、スレッドが終了できます。BroadcastChannel が既に `unref()` されている場合、再度 `unref()` を呼び出しても効果はありません。

## クラス: `MessageChannel` {#class-messagechannel}

**追加:** v10.5.0

`worker.MessageChannel` クラスのインスタンスは、非同期の双方向通信チャネルを表します。`MessageChannel` 自体にはメソッドはありません。`new MessageChannel()` は、リンクされた [`MessagePort`](/ja/nodejs/api/worker_threads#class-messageport) インスタンスを参照する `port1` および `port2` プロパティを持つオブジェクトを生成します。

```js [ESM]
const { MessageChannel } = require('node:worker_threads');

const { port1, port2 } = new MessageChannel();
port1.on('message', (message) => console.log('received', message));
port2.postMessage({ foo: 'bar' });
// `port1.on('message')` リスナーから 'received { foo: 'bar' }' を出力します。
```
## クラス: `MessagePort` {#class-messageport}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.7.0 | このクラスは `EventEmitter` からではなく、`EventTarget` から継承するようになりました。 |
| v10.5.0 | 追加: v10.5.0 |
:::

- 継承: [\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget)

`worker.MessagePort` クラスのインスタンスは、非同期の双方向通信チャネルの一端を表します。構造化データ、メモリ領域、および他の `MessagePort` を異なる [`Worker`](/ja/nodejs/api/worker_threads#class-worker) 間で転送するために使用できます。

この実装は、[ブラウザの `MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort) と一致します。


### イベント: `'close'` {#event-close}

**追加: v10.5.0**

チャネルのどちらかの側が切断されると、`'close'` イベントが一度発生します。

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

// 出力:
//   foobar
//   closed!
port2.on('message', (message) => console.log(message));
port2.on('close', () => console.log('closed!'));

port1.postMessage('foobar');
port1.close();
```
### イベント: `'message'` {#event-message}

**追加: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#データ型) 送信された値

`'message'` イベントは、[`port.postMessage()`](/ja/nodejs/api/worker_threads#portpostmessagevalue-transferlist) のクローンされた入力を含む、すべての受信メッセージに対して発生します。

このイベントのリスナーは、`postMessage()` に渡された `value` パラメーターのクローンを受け取り、それ以上の引数は受け取りません。

### イベント: `'messageerror'` {#event-messageerror}

**追加: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error) エラーオブジェクト

メッセージのデシリアライズに失敗した場合、`'messageerror'` イベントが発生します。

現在、このイベントは、投稿されたJSオブジェクトを受信側でインスタンス化する際にエラーが発生した場合に発生します。 このような状況はまれですが、たとえば、特定のNode.js APIオブジェクトが`vm.Context`で受信された場合（Node.js APIは現在利用できません）に発生する可能性があります。

### `port.close()` {#portclose}

**追加: v10.5.0**

接続の両側でのメッセージのさらなる送信を無効にします。 このメソッドは、この `MessagePort` を介したこれ以上の通信が行われない場合に呼び出すことができます。

[`'close'` イベント](/ja/nodejs/api/worker_threads#event-close) は、チャネルの一部である両方の `MessagePort` インスタンスで発生します。

### `port.postMessage(value[, transferList])` {#portpostmessagevalue-transferlist}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v21.0.0 | 転送できないオブジェクトが転送リストにある場合にエラーがスローされます。 |
| v15.6.0 | クローン可能な型のリストに `X509Certificate` を追加しました。 |
| v15.0.0 | クローン可能な型のリストに `CryptoKey` を追加しました。 |
| v15.14.0, v14.18.0 | クローン可能な型のリストに 'BlockList' を追加します。 |
| v15.9.0, v14.18.0 | クローン可能な型のリストに 'Histogram' 型を追加します。 |
| v14.5.0, v12.19.0 | クローン可能な型のリストに `KeyObject` を追加しました。 |
| v14.5.0, v12.19.0 | 転送可能な型のリストに `FileHandle` を追加しました。 |
| v10.5.0 | 追加: v10.5.0 |
:::

- `value` [\<any\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#データ型)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object)

JavaScriptの値をこのチャネルの受信側に送信します。 `value` は、[HTML構造化クローンアルゴリズム](https://developer.mozilla.org/ja/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)と互換性のある方法で転送されます。

特に、`JSON` との重要な違いは次のとおりです。

- `value` は循環参照を含む場合があります。
- `value` は、`RegExp`、`BigInt`、`Map`、`Set` などの組み込み JS 型のインスタンスを含む場合があります。
- `value` は、`ArrayBuffer` と `SharedArrayBuffer` の両方を使用する型付き配列を含む場合があります。
- `value` は、[`WebAssembly.Module`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module) インスタンスを含む場合があります。
- `value` は、次のネイティブ（C++ ベース）オブジェクト以外は含むことができません。
    - [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)s、
    - [\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle)s、
    - [\<Histogram\>](/ja/nodejs/api/perf_hooks#class-histogram)s、
    - [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject)s、
    - [\<MessagePort\>](/ja/nodejs/api/worker_threads#class-messageport)s、
    - [\<net.BlockList\>](/ja/nodejs/api/net#class-netblocklist)s、
    - [\<net.SocketAddress\>](/ja/nodejs/api/net#class-netsocketaddress)es、
    - [\<X509Certificate\>](/ja/nodejs/api/crypto#class-x509certificate)s.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const circularData = {};
circularData.foo = circularData;
// 出力: { foo: [Circular] }
port2.postMessage(circularData);
```
`transferList` は、[`ArrayBuffer`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)、[`MessagePort`](/ja/nodejs/api/worker_threads#class-messageport)、および [`FileHandle`](/ja/nodejs/api/fs#class-filehandle) オブジェクトのリストである可能性があります。 転送後、それらはチャネルの送信側では使用できなくなります（たとえそれらが `value` に含まれていなくても）。 [子プロセス](/ja/nodejs/api/child_process)とは異なり、ネットワークソケットなどのハンドル転送は現在サポートされていません。

`value` に [`SharedArrayBuffer`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) インスタンスが含まれている場合、それらはどちらのスレッドからもアクセスできます。 それらは `transferList` にリストできません。

`value` には、`transferList` にない `ArrayBuffer` インスタンスが含まれている場合があります。その場合、基になるメモリは移動されるのではなくコピーされます。

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const uint8Array = new Uint8Array([ 1, 2, 3, 4 ]);
// これは `uint8Array` のコピーを投稿します:
port2.postMessage(uint8Array);
// これはデータをコピーしませんが、`uint8Array` を使用不能にします:
port2.postMessage(uint8Array, [ uint8Array.buffer ]);

// `sharedUint8Array` のメモリは、元のメモリと `.on('message')` で受信したコピーの両方からアクセスできます:
const sharedUint8Array = new Uint8Array(new SharedArrayBuffer(4));
port2.postMessage(sharedUint8Array);

// これは、新しく作成されたメッセージポートを受信者に転送します。
// これは、たとえば、同じ親スレッドの子である複数の `Worker` スレッド間の通信チャネルを作成するために使用できます。
const otherChannel = new MessageChannel();
port2.postMessage({ port: otherChannel.port1 }, [ otherChannel.port1 ]);
```
メッセージオブジェクトはすぐに複製され、投稿後に副作用なしに変更できます。

このAPIの背後にあるシリアル化およびデシリアル化メカニズムの詳細については、[`node:v8` モジュールのシリアル化API](/ja/nodejs/api/v8#serialization-api)を参照してください。


#### TypedArray と Buffer を転送する際の考慮事項 {#considerations-when-transferring-typedarrays-and-buffers}

すべての `TypedArray` と `Buffer` のインスタンスは、基盤となる `ArrayBuffer` 上のビューです。つまり、生のデータを実際に保存するのは `ArrayBuffer` であり、`TypedArray` と `Buffer` オブジェクトはデータの表示および操作方法を提供します。同じ `ArrayBuffer` インスタンス上に複数のビューを作成することは可能であり、一般的です。転送リストを使用して `ArrayBuffer` を転送する場合は、細心の注意が必要です。そうすると、同じ `ArrayBuffer` を共有するすべての `TypedArray` と `Buffer` インスタンスが使用できなくなるためです。

```js [ESM]
const ab = new ArrayBuffer(10);

const u1 = new Uint8Array(ab);
const u2 = new Uint16Array(ab);

console.log(u2.length);  // 5 と出力

port.postMessage(u1, [u1.buffer]);

console.log(u2.length);  // 0 と出力
```
特に `Buffer` インスタンスの場合、基盤となる `ArrayBuffer` を転送または複製できるかどうかは、インスタンスがどのように作成されたかによって完全に異なり、多くの場合、それを確実に判断することはできません。

`ArrayBuffer` は、常に複製され、決して転送されるべきではないことを示すために、[`markAsUntransferable()`](/ja/nodejs/api/worker_threads#workermarkasuntransferableobject) でマークできます。

`Buffer` インスタンスがどのように作成されたかに応じて、基盤となる `ArrayBuffer` を所有している場合とそうでない場合があります。`Buffer` インスタンスがそれを所有していることがわかっている場合を除き、`ArrayBuffer` を転送してはなりません。特に、内部 `Buffer` プールから作成された `Buffer` (たとえば `Buffer.from()` または `Buffer.allocUnsafe()` を使用) の場合、それらを転送することはできず、常に複製され、`Buffer` プール全体のコピーが送信されます。この動作は、意図しないメモリ使用量の増加と、潜在的なセキュリティ上の懸念を伴う可能性があります。

`Buffer` のプーリングの詳細については、[`Buffer.allocUnsafe()`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize) を参照してください。

`Buffer.alloc()` または `Buffer.allocUnsafeSlow()` を使用して作成された `Buffer` インスタンスの `ArrayBuffer` は、常に転送できますが、そうすると、それらの `ArrayBuffer` の他の既存のビューがすべて使用できなくなります。


#### プロトタイプ、クラス、およびアクセサを持つオブジェクトを複製する際の考慮事項 {#considerations-when-cloning-objects-with-prototypes-classes-and-accessors}

オブジェクトの複製は[HTML 構造化クローンアルゴリズム](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)を使用するため、列挙不可能なプロパティ、プロパティアクセサ、およびオブジェクトのプロトタイプは保持されません。特に、[`Buffer`](/ja/nodejs/api/buffer)オブジェクトは受信側でプレーンな[`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)として読み取られ、JavaScript クラスのインスタンスはプレーンな JavaScript オブジェクトとして複製されます。

```js [ESM]
const b = Symbol('b');

class Foo {
  #a = 1;
  constructor() {
    this[b] = 2;
    this.c = 3;
  }

  get d() { return 4; }
}

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new Foo());

// Prints: { c: 3 }
```
この制限は、グローバルな `URL` オブジェクトなど、多くの組み込みオブジェクトに拡張されます。

```js [ESM]
const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new URL('https://example.org'));

// Prints: { }
```
### `port.hasRef()` {#porthasref}

**追加: v18.1.0, v16.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

true の場合、`MessagePort` オブジェクトは Node.js イベントループをアクティブに保ちます。

### `port.ref()` {#portref}

**追加: v10.5.0**

`unref()` の反対です。 以前に `unref()` されたポートで `ref()` を呼び出しても、残りのアクティブなハンドルがそれだけの場合、プログラムは終了しません（デフォルトの動作）。 ポートが `ref()` されている場合、`ref()` を再度呼び出しても効果はありません。

`.on('message')` を使用してリスナーがアタッチまたは削除される場合、イベントのリスナーが存在するかどうかに応じて、ポートは自動的に `ref()` および `unref()` されます。


### `port.start()` {#portstart}

**Added in: v10.5.0**

この`MessagePort`でメッセージの受信を開始します。このポートをイベントエミッターとして使用する場合、`'message'`リスナーがアタッチされると、これは自動的に呼び出されます。

このメソッドは、Web `MessagePort` APIとのパリティのために存在します。Node.jsでは、イベントリスナーが存在しない場合にメッセージを無視する場合にのみ役立ちます。Node.jsは、`.onmessage`の処理も異なります。それを設定すると、自動的に`.start()`が呼び出されますが、設定を解除すると、新しいハンドラーが設定されるか、ポートが破棄されるまでメッセージがキューに格納されます。

### `port.unref()` {#portunref}

**Added in: v10.5.0**

ポートで`unref()`を呼び出すと、これがイベントシステムで唯一のアクティブなハンドルである場合、スレッドは終了できます。ポートが既に`unref()`されている場合、再度`unref()`を呼び出しても効果はありません。

`.on('message')`を使用してリスナーがアタッチまたは削除される場合、イベントのリスナーが存在するかどうかに応じて、ポートは自動的に`ref()`および`unref()`されます。

## Class: `Worker` {#class-worker}

**Added in: v10.5.0**

- 継承元: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

`Worker`クラスは、独立したJavaScript実行スレッドを表します。ほとんどのNode.js APIは、その内部で利用できます。

Worker環境内の注目すべき違いは次のとおりです。

- [`process.stdin`](/ja/nodejs/api/process#processstdin)、[`process.stdout`](/ja/nodejs/api/process#processstdout)、および[`process.stderr`](/ja/nodejs/api/process#processstderr)ストリームは、親スレッドによってリダイレクトされる場合があります。
- [`require('node:worker_threads').isMainThread`](/ja/nodejs/api/worker_threads#workerismainthread)プロパティは`false`に設定されます。
- [`require('node:worker_threads').parentPort`](/ja/nodejs/api/worker_threads#workerparentport)メッセージポートが利用可能です。
- [`process.exit()`](/ja/nodejs/api/process#processexitcode)はプログラム全体を停止せず、単一のスレッドのみを停止し、[`process.abort()`](/ja/nodejs/api/process#processabort)は利用できません。
- [`process.chdir()`](/ja/nodejs/api/process#processchdirdirectory)およびグループまたはユーザーIDを設定する`process`メソッドは利用できません。
- [`process.env`](/ja/nodejs/api/process#processenv)は、特に指定がない限り、親スレッドの環境変数のコピーです。1つのコピーへの変更は他のスレッドでは表示されず、ネイティブアドオンにも表示されません（[`worker.SHARE_ENV`](/ja/nodejs/api/worker_threads#workershare_env)が[`Worker`](/ja/nodejs/api/worker_threads#class-worker)コンストラクターへの`env`オプションとして渡されない限り）。Windowsでは、メインスレッドとは異なり、環境変数のコピーは大文字と小文字を区別して動作します。
- [`process.title`](/ja/nodejs/api/process#processtitle)は変更できません。
- シグナルは、[`process.on('...')`](/ja/nodejs/api/process#signal-events)を介して配信されません。
- 実行は、[`worker.terminate()`](/ja/nodejs/api/worker_threads#workerterminate)が呼び出された結果として、いつでも停止する可能性があります。
- 親プロセスからのIPCチャネルにはアクセスできません。
- [`trace_events`](/ja/nodejs/api/tracing)モジュールはサポートされていません。
- ネイティブアドオンは、[特定の条件](/ja/nodejs/api/addons#worker-support)を満たす場合にのみ、複数のスレッドからロードできます。

他の`Worker`内で`Worker`インスタンスを作成できます。

[Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)や[`node:cluster`モジュール](/ja/nodejs/api/cluster)と同様に、スレッド間メッセージパッシングを通じて双方向通信を実現できます。内部的には、`Worker`には、`Worker`の作成時にすでにお互いに関連付けられている[`MessagePort`](/ja/nodejs/api/worker_threads#class-messageport)の組み込みペアがあります。親側の`MessagePort`オブジェクトは直接公開されていませんが、その機能は[`worker.postMessage()`](/ja/nodejs/api/worker_threads#workerpostmessagevalue-transferlist)および親スレッドの`Worker`オブジェクトの[`worker.on('message')`](/ja/nodejs/api/worker_threads#event-message_1)イベントを介して公開されます。

カスタムメッセージングチャネルを作成するために（これは、関心の分離を促進するため、デフォルトのグローバルチャネルを使用するよりも推奨されます）、ユーザーはどちらかのスレッドで`MessageChannel`オブジェクトを作成し、既存のチャネル（グローバルチャネルなど）を介して`MessageChannel`の`MessagePort`の1つを他のスレッドに渡すことができます。

メッセージがどのように渡されるか、およびどの種類のJavaScript値がスレッドバリアを介して正常に転送できるかの詳細については、[`port.postMessage()`](/ja/nodejs/api/worker_threads#portpostmessagevalue-transferlist)を参照してください。

```js [ESM]
const assert = require('node:assert');
const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort,
} = require('node:worker_threads');
if (isMainThread) {
  const worker = new Worker(__filename);
  const subChannel = new MessageChannel();
  worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  parentPort.once('message', (value) => {
    assert(value.hereIsYourPort instanceof MessagePort);
    value.hereIsYourPort.postMessage('the worker is sending this');
    value.hereIsYourPort.close();
  });
}
```

### `new Worker(filename[, options])` {#new-workerfilename-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.8.0, v18.16.0 | デバッグのためにworkerタイトルに名前を追加できる`name`オプションのサポートを追加しました。 |
| v14.9.0 | `filename` パラメーターは、`data:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v14.9.0 | `trackUnmanagedFds` オプションは、デフォルトで `true` に設定されました。 |
| v14.6.0, v12.19.0 | `trackUnmanagedFds` オプションが導入されました。 |
| v13.13.0, v12.17.0 | `transferList` オプションが導入されました。 |
| v13.12.0, v12.17.0 | `filename` パラメーターは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v13.4.0, v12.16.0 | `argv` オプションが導入されました。 |
| v13.2.0, v12.16.0 | `resourceLimits` オプションが導入されました。 |
| v10.5.0 | v10.5.0 で追加されました。 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) Worker のメインスクリプトまたはモジュールへのパス。絶対パスまたは相対パス（つまり、現在の作業ディレクトリからの相対パス）であり、`./` または `../` で始まるか、`file:` または `data:` プロトコルを使用する WHATWG `URL` オブジェクトである必要があります。[`data:` URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) を使用する場合、データは [ECMAScript モジュールローダー](/ja/nodejs/api/esm#data-imports) を使用して MIME タイプに基づいて解釈されます。`options.eval` が `true` の場合、これはパスではなく JavaScript コードを含む文字列です。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `argv` [\<any[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) workerで文字列化され、`process.argv`に追加される引数のリスト。 これは主に`workerData`に似ていますが、値はスクリプトにCLIオプションとして渡されたかのように、グローバル`process.argv`で利用できます。
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 設定されている場合、Worker スレッド内の `process.env` の初期値を指定します。特別な値として、親スレッドと子スレッドがそれらの環境変数を共有するように指定するために、[`worker.SHARE_ENV`](/ja/nodejs/api/worker_threads#workershare_env) を使用できます。その場合、一方のスレッドの `process.env` オブジェクトへの変更は、他方のスレッドにも影響します。**デフォルト:** `process.env`。
    - `eval` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` であり、最初の引数が `string` である場合、コンストラクターへの最初の引数を、worker がオンラインになったときに一度実行されるスクリプトとして解釈します。
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) worker に渡される node CLI オプションのリスト。V8 オプション（`--max-old-space-size` など）およびプロセスに影響を与えるオプション（`--title` など）はサポートされていません。設定されている場合、これは worker 内で [`process.execArgv`](/ja/nodejs/api/process#processexecargv) として提供されます。デフォルトでは、オプションは親スレッドから継承されます。
    - `stdin` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) これが `true` に設定されている場合、`worker.stdin` は書き込み可能なストリームを提供し、その内容は Worker 内で `process.stdin` として表示されます。デフォルトでは、データは提供されません。
    - `stdout` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) これが `true` に設定されている場合、`worker.stdout` は親の `process.stdout` に自動的にパイプされません。
    - `stderr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) これが `true` に設定されている場合、`worker.stderr` は親の `process.stderr` に自動的にパイプされません。
    - `workerData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) クローンされ、[`require('node:worker_threads').workerData`](/ja/nodejs/api/worker_threads#workerworkerdata) として利用可能になる任意の JavaScript 値。クローンは、[HTML構造化クローンアルゴリズム](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) で説明されているように行われ、オブジェクトをクローンできない場合（例えば、`function` が含まれているため）、エラーがスローされます。
    - `trackUnmanagedFds` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) これが `true` に設定されている場合、Worker は [`fs.open()`](/ja/nodejs/api/fs#fsopenpath-flags-mode-callback) および [`fs.close()`](/ja/nodejs/api/fs#fsclosefd-callback) を介して管理される生のファイル記述子を追跡し、[`FileHandle`](/ja/nodejs/api/fs#class-filehandle) API を介して管理されるネットワークソケットやファイル記述子などの他のリソースと同様に、Worker が終了するとそれらを閉じます。このオプションは、すべてのネストされた `Worker` に自動的に継承されます。**デフォルト:** `true`。
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 1つ以上の `MessagePort` のようなオブジェクトが `workerData` で渡される場合、それらのアイテムには `transferList` が必要です。そうでない場合、[`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/ja/nodejs/api/errors#err_missing_message_port_in_transfer_list) がスローされます。詳細については、[`port.postMessage()`](/ja/nodejs/api/worker_threads#portpostmessagevalue-transferlist) を参照してください。
    - `resourceLimits` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 新しい JS エンジンインスタンスのオプションのリソース制限のセット。これらの制限に達すると、`Worker` インスタンスが終了します。これらの制限は、JS エンジンのみに影響し、`ArrayBuffer` を含む外部データには影響しません。これらの制限が設定されていても、グローバルなメモリ不足の状態が発生した場合、プロセスは中止される可能性があります。
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) メインヒープの最大サイズ（MB）。コマンドライン引数 [`--max-old-space-size`](/ja/nodejs/api/cli#--max-old-space-sizesize-in-mib) が設定されている場合、この設定よりも優先されます。
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 最近作成されたオブジェクトのヒープ領域の最大サイズ。コマンドライン引数 [`--max-semi-space-size`](/ja/nodejs/api/cli#--max-semi-space-sizesize-in-mib) が設定されている場合、この設定よりも優先されます。
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成されたコードに使用される事前に割り当てられたメモリ範囲のサイズ。
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) スレッドのデフォルトの最大スタックサイズ。値が小さいと、使用できない Worker インスタンスになる可能性があります。**デフォルト:** `4`。
  
 
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) デバッグ/識別の目的で worker タイトルに追加されるオプションの `name`。最終的なタイトルは `[worker ${id}] ${name}` になります。**デフォルト:** `''`。


### イベント: `'error'` {#event-error}

**追加: v10.5.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`'error'` イベントは、ワーカースレッドがキャッチされない例外をスローした場合に発生します。その場合、ワーカーは終了します。

### イベント: `'exit'` {#event-exit}

**追加: v10.5.0**

- `exitCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`'exit'` イベントは、ワーカーが停止したときに発生します。ワーカーが [`process.exit()`](/ja/nodejs/api/process#processexitcode) を呼び出して終了した場合、`exitCode` パラメーターは渡された終了コードです。ワーカーが強制終了された場合、`exitCode` パラメーターは `1` です。

これは、すべての `Worker` インスタンスによって発生する最後のイベントです。

### イベント: `'message'` {#event-message_1}

**追加: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 伝送された値

`'message'` イベントは、ワーカースレッドが [`require('node:worker_threads').parentPort.postMessage()`](/ja/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) を呼び出したときに発生します。詳細については、[`port.on('message')`](/ja/nodejs/api/worker_threads#event-message) イベントを参照してください。

ワーカースレッドから送信されたすべてのメッセージは、[`'exit'` イベント](/ja/nodejs/api/worker_threads#event-exit) が `Worker` オブジェクトで発生する前に発生します。

### イベント: `'messageerror'` {#event-messageerror_1}

**追加: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Errorオブジェクト

`'messageerror'` イベントは、メッセージのデシリアライズに失敗した場合に発生します。

### イベント: `'online'` {#event-online}

**追加: v10.5.0**

`'online'` イベントは、ワーカースレッドが JavaScript コードの実行を開始したときに発生します。

### `worker.getHeapSnapshot([options])` {#workergetheapsnapshotoptions}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.1.0 | ヒープスナップショットを構成するためのオプションをサポートします。 |
| v13.9.0, v12.17.0 | 追加: v13.9.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exposeInternals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) trueの場合、ヒープスナップショットで内部を公開します。**デフォルト:** `false`。
    - `exposeNumericValues` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) trueの場合、人工的なフィールドに数値の値を公開します。**デフォルト:** `false`。
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) V8ヒープスナップショットを含むReadable StreamのPromise

Workerの現在の状態のV8スナップショットのreadable streamを返します。詳細については、[`v8.getHeapSnapshot()`](/ja/nodejs/api/v8#v8getheapsnapshotoptions)を参照してください。

Workerスレッドがすでに実行されていない場合（[`'exit'` イベント](/ja/nodejs/api/worker_threads#event-exit)が発生する前に発生する可能性があります）、返された`Promise`は[`ERR_WORKER_NOT_RUNNING`](/ja/nodejs/api/errors#err_worker_not_running) エラーですぐに拒否されます。


### `worker.performance` {#workerperformance}

**追加:** v15.1.0, v14.17.0, v12.22.0

ワーカーインスタンスからパフォーマンス情報をクエリするために使用できるオブジェクト。 [`perf_hooks.performance`](/ja/nodejs/api/perf_hooks#perf_hooksperformance) と同様です。

#### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**追加:** v15.1.0, v14.17.0, v12.22.0

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `eventLoopUtilization()` の以前の呼び出しの結果。
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `utilization1` より前の `eventLoopUtilization()` の以前の呼び出しの結果。
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

[`perf_hooks` `eventLoopUtilization()`](/ja/nodejs/api/perf_hooks#performanceeventlooputilizationutilization1-utilization2) と同じ呼び出しですが、ワーカーインスタンスの値が返される点が異なります。

1 つの違いは、メインスレッドとは異なり、ワーカー内のブートストラップはイベントループ内で行われることです。 そのため、ワーカーのスクリプトが実行を開始するとすぐに、イベントループの使用率が利用可能になります。

増加しない `idle` 時間は、ワーカーがブートストラップでスタックしていることを示すものではありません。 次の例は、ワーカーの全期間にわたって `idle` 時間が累積されないにもかかわらず、メッセージを処理できることを示しています。

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  setInterval(() => {
    worker.postMessage('hi');
    console.log(worker.performance.eventLoopUtilization());
  }, 100).unref();
  return;
}

parentPort.on('message', () => console.log('msg')).unref();
(function r(n) {
  if (--n < 0) return;
  const t = Date.now();
  while (Date.now() - t < 300);
  setImmediate(r, n);
})(10);
```
ワーカーのイベントループの使用率は、[`'online'` イベント](/ja/nodejs/api/worker_threads#event-online) が発生した後にのみ利用可能になり、これより前、または [`'exit'` イベント](/ja/nodejs/api/worker_threads#event-exit) の後に呼び出された場合、すべてのプロパティの値は `0` になります。


### `worker.postMessage(value[, transferList])` {#workerpostmessagevalue-transferlist}

**Added in: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[`require('node:worker_threads').parentPort.on('message')`](/ja/nodejs/api/worker_threads#event-message) 経由で受信されるメッセージをワーカーに送信します。詳細については、[`port.postMessage()`](/ja/nodejs/api/worker_threads#portpostmessagevalue-transferlist) を参照してください。

### `worker.ref()` {#workerref}

**Added in: v10.5.0**

`unref()` の反対です。以前に `unref()` されたワーカーで `ref()` を呼び出しても、それが唯一のアクティブなハンドルである場合、プログラムは終了しません (デフォルトの動作)。ワーカーが `ref()` されている場合、`ref()` を再度呼び出しても効果はありません。

### `worker.resourceLimits` {#workerresourcelimits_1}

**Added in: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

この Worker スレッドの JS エンジンリソース制約のセットを提供します。`resourceLimits` オプションが [`Worker`](/ja/nodejs/api/worker_threads#class-worker) コンストラクターに渡された場合、これはその値と一致します。

ワーカーが停止した場合、戻り値は空のオブジェクトになります。

### `worker.stderr` {#workerstderr}

**Added in: v10.5.0**

- [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable)

これは、ワーカー スレッド内の [`process.stderr`](/ja/nodejs/api/process#processstderr) に書き込まれたデータを含む読み取り可能なストリームです。`stderr: true` が [`Worker`](/ja/nodejs/api/worker_threads#class-worker) コンストラクターに渡されなかった場合、データは親スレッドの [`process.stderr`](/ja/nodejs/api/process#processstderr) ストリームにパイプされます。


### `worker.stdin` {#workerstdin}

**Added in: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable)

`stdin: true` が [`Worker`](/ja/nodejs/api/worker_threads#class-worker) コンストラクターに渡された場合、これは書き込み可能なストリームです。このストリームに書き込まれたデータは、ワーカー スレッド内で [`process.stdin`](/ja/nodejs/api/process#processstdin) として利用可能になります。

### `worker.stdout` {#workerstdout}

**Added in: v10.5.0**

- [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable)

これは、ワーカー スレッド内の [`process.stdout`](/ja/nodejs/api/process#processstdout) に書き込まれたデータを含む読み取り可能なストリームです。`stdout: true` が [`Worker`](/ja/nodejs/api/worker_threads#class-worker) コンストラクターに渡されなかった場合、データは親スレッドの [`process.stdout`](/ja/nodejs/api/process#processstdout) ストリームにパイプされます。

### `worker.terminate()` {#workerterminate}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.5.0 | この関数は Promise を返すようになりました。コールバックを渡すことは非推奨であり、Worker は実際には同期的に終了していたため、このバージョンまでは役に立ちませんでした。終了は完全に非同期操作になりました。 |
| v10.5.0 | Added in: v10.5.0 |
:::

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

可能な限り早くワーカー スレッドでのすべての JavaScript 実行を停止します。[`'exit'` イベント](/ja/nodejs/api/worker_threads#event-exit) が発生したときに解決される終了コードの Promise を返します。

### `worker.threadId` {#workerthreadid_1}

**Added in: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

参照されるスレッドの整数識別子。ワーカー スレッド内では、[`require('node:worker_threads').threadId`](/ja/nodejs/api/worker_threads#workerthreadid) として利用できます。この値は、単一のプロセス内の各 `Worker` インスタンスに対して一意です。

### `worker.unref()` {#workerunref}

**Added in: v10.5.0**

ワーカーで `unref()` を呼び出すと、イベント システムでこれが唯一のアクティブなハンドルである場合に、スレッドが終了できます。ワーカーがすでに `unref()` されている場合、再度 `unref()` を呼び出しても効果はありません。


## 注記 {#notes}

### stdio の同期的なブロッキング {#synchronous-blocking-of-stdio}

`Worker` は、[\<MessagePort\>](/ja/nodejs/api/worker_threads#class-messageport) を介したメッセージパッシングを利用して、`stdio` とのインタラクションを実装します。これは、`Worker` から発生した `stdio` 出力が、Node.js イベントループをブロックしている受信側の同期コードによってブロックされる可能性があることを意味します。

::: code-group
```js [ESM]
import {
  Worker,
  isMainThread,
} from 'node:worker_threads';

if (isMainThread) {
  new Worker(new URL(import.meta.url));
  for (let n = 0; n < 1e10; n++) {
    // 作業をシミュレートするためのループ。
  }
} else {
  // この出力は、メインスレッドの for ループによってブロックされます。
  console.log('foo');
}
```

```js [CJS]
'use strict';

const {
  Worker,
  isMainThread,
} = require('node:worker_threads');

if (isMainThread) {
  new Worker(__filename);
  for (let n = 0; n < 1e10; n++) {
    // 作業をシミュレートするためのループ。
  }
} else {
  // この出力は、メインスレッドの for ループによってブロックされます。
  console.log('foo');
}
```
:::

### プリロードスクリプトからのワーカースレッドの起動 {#launching-worker-threads-from-preload-scripts}

プリロードスクリプト (`-r` コマンドラインフラグを使用してロードおよび実行されるスクリプト) からワーカースレッドを起動する際は注意が必要です。 `execArgv` オプションが明示的に設定されていない限り、新しい Worker スレッドは実行中のプロセスからコマンドラインフラグを自動的に継承し、メインスレッドと同じプリロードスクリプトをプリロードします。 プリロードスクリプトが無条件にワーカースレッドを起動する場合、生成されたすべてのスレッドはアプリケーションがクラッシュするまで別のスレッドを生成します。

