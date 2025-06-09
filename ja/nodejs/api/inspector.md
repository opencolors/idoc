---
title: Node.js インスペクターモジュールのドキュメント
description: Node.jsのインスペクターモジュールは、V8インスペクターと対話するためのAPIを提供し、開発者がインスペクタープロトコルに接続してNode.jsアプリケーションをデバッグできるようにします。
head:
  - - meta
    - name: og:title
      content: Node.js インスペクターモジュールのドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのインスペクターモジュールは、V8インスペクターと対話するためのAPIを提供し、開発者がインスペクタープロトコルに接続してNode.jsアプリケーションをデバッグできるようにします。
  - - meta
    - name: twitter:title
      content: Node.js インスペクターモジュールのドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのインスペクターモジュールは、V8インスペクターと対話するためのAPIを提供し、開発者がインスペクタープロトコルに接続してNode.jsアプリケーションをデバッグできるようにします。
---


# Inspector {#inspector}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - 安定版
:::

**ソースコード:** [lib/inspector.js](https://github.com/nodejs/node/blob/v23.5.0/lib/inspector.js)

`node:inspector`モジュールは、V8インスペクターと対話するためのAPIを提供します。

以下を使用してアクセスできます。

::: code-group
```js [ESM]
import * as inspector from 'node:inspector/promises';
```

```js [CJS]
const inspector = require('node:inspector/promises');
```
:::

または

::: code-group
```js [ESM]
import * as inspector from 'node:inspector';
```

```js [CJS]
const inspector = require('node:inspector');
```
:::

## Promises API {#promises-api}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

**追加:** v19.0.0

### クラス: `inspector.Session` {#class-inspectorsession}

- 拡張: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

`inspector.Session`は、V8インスペクターバックエンドにメッセージをディスパッチし、メッセージ応答と通知を受信するために使用されます。

#### `new inspector.Session()` {#new-inspectorsession}

**追加:** v8.0.0

`inspector.Session`クラスの新しいインスタンスを作成します。 インスペクターバックエンドにメッセージをディスパッチする前に、インスペクターセッションを[`session.connect()`](/ja/nodejs/api/inspector#sessionconnect)を介して接続する必要があります。

`Session`を使用する場合、console APIによって出力されたオブジェクトは、手動で`Runtime.DiscardConsoleEntries`コマンドを実行しない限り解放されません。

#### イベント: `'inspectorNotification'` {#event-inspectornotification}

**追加:** v8.0.0

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 通知メッセージオブジェクト

V8インスペクターからの通知を受信すると発生します。

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
特定の方法でのみ通知をサブスクライブすることも可能です。


#### イベント: `&lt;inspector-protocol-method&gt;`; {#event-&lt;inspector-protocol-method&gt;;}

**追加:** v8.0.0

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 通知メッセージオブジェクト

`method` フィールドが `\<inspector-protocol-method\>` 値に設定されているインスペクター通知を受信したときに発生します。

次のスニペットは、[`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused) イベントにリスナーをインストールし、プログラムの実行が中断されるたびに (たとえば、ブレークポイントを介して) プログラムの中断理由を出力します。

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect}

**追加:** v8.0.0

セッションをインスペクターバックエンドに接続します。

#### `session.connectToMainThread()` {#sessionconnecttomainthread}

**追加:** v12.11.0

セッションをメインスレッドのインスペクターバックエンドに接続します。 このAPIがWorkerスレッドで呼び出されなかった場合、例外がスローされます。

#### `session.disconnect()` {#sessiondisconnect}

**追加:** v8.0.0

セッションをすぐに閉じます。 保留中のすべてのメッセージコールバックはエラーで呼び出されます。 メッセージを再度送信できるようにするには、[`session.connect()`](/ja/nodejs/api/inspector#sessionconnect) を呼び出す必要があります。 再接続されたセッションは、有効になっているエージェントや構成済みのブレークポイントなど、すべてのインスペクター状態を失います。

#### `session.post(method[, params])` {#sessionpostmethod-params}

**追加:** v19.0.0

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

メッセージをインスペクターバックエンドにポストします。

```js [ESM]
import { Session } from 'node:inspector/promises';
try {
  const session = new Session();
  session.connect();
  const result = await session.post('Runtime.evaluate', { expression: '2 + 2' });
  console.log(result);
} catch (error) {
  console.error(error);
}
// Output: { result: { type: 'number', value: 4, description: '4' } }
```
V8インスペクタープロトコルの最新バージョンは、[Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/) に公開されています。

Node.jsインスペクターは、V8によって宣言されたすべてのChrome DevTools Protocolドメインをサポートしています。 Chrome DevTools Protocolドメインは、アプリケーションの状態を検査し、実行時イベントをリッスンするために使用されるランタイムエージェントの1つと対話するためのインターフェイスを提供します。


#### 使用例 {#example-usage}

デバッガー以外にも、さまざまなV8プロファイラーがDevToolsプロトコルを通じて利用可能です。

##### CPUプロファイラー {#cpu-profiler}

[CPUプロファイラー](https://chromedevtools.github.io/devtools-protocol/v8/Profiler)の使用例を以下に示します。

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();
session.connect();

await session.post('Profiler.enable');
await session.post('Profiler.start');
// ここで測定対象のビジネスロジックを呼び出します...

// しばらくして...
const { profile } = await session.post('Profiler.stop');

// プロファイルをディスクに書き込み、アップロードなど
fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
```
##### ヒーププロファイラー {#heap-profiler}

[ヒーププロファイラー](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler)の使用例を以下に示します。

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

const result = await session.post('HeapProfiler.takeHeapSnapshot', null);
console.log('HeapProfiler.takeHeapSnapshot done:', result);
session.disconnect();
fs.closeSync(fd);
```
## コールバックAPI {#callback-api}

### クラス: `inspector.Session` {#class-inspectorsession_1}

- 拡張: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

`inspector.Session`は、V8インスペクターバックエンドにメッセージをディスパッチし、メッセージ応答と通知を受信するために使用されます。

#### `new inspector.Session()` {#new-inspectorsession_1}

**追加: v8.0.0**

`inspector.Session`クラスの新しいインスタンスを作成します。 インスペクターセッションは、[`session.connect()`](/ja/nodejs/api/inspector#sessionconnect)を介して接続してから、メッセージをインスペクターバックエンドにディスパッチする必要があります。

`Session`を使用する場合、コンソールAPIによって出力されたオブジェクトは、手動で`Runtime.DiscardConsoleEntries`コマンドを実行しない限り、解放されません。


#### Event: `'inspectorNotification'` {#event-inspectornotification_1}

**Added in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 通知メッセージオブジェクト

V8 Inspectorからの通知を受信したときに発生します。

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
特定メソッドの通知のみをサブスクライブすることも可能です。

#### Event: `&lt;inspector-protocol-method&gt;`; {#event-&lt;inspector-protocol-method&gt;;_1}

**Added in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 通知メッセージオブジェクト

methodフィールドが `\<inspector-protocol-method\>` の値に設定されたインスペクター通知を受信したときに発生します。

次のスニペットは、[`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused) イベントにリスナーをインストールし、プログラムの実行が中断されるたびに（ブレークポイントなどによって）プログラムが中断された理由を出力します。

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect_1}

**Added in: v8.0.0**

セッションをインスペクターバックエンドに接続します。

#### `session.connectToMainThread()` {#sessionconnecttomainthread_1}

**Added in: v12.11.0**

セッションをメインスレッドのインスペクターバックエンドに接続します。この API が Worker スレッドで呼び出されなかった場合は、例外がスローされます。

#### `session.disconnect()` {#sessiondisconnect_1}

**Added in: v8.0.0**

セッションを直ちに閉じます。保留中のすべてのメッセージコールバックは、エラーとともに呼び出されます。メッセージを再度送信できるようにするには、[`session.connect()`](/ja/nodejs/api/inspector#sessionconnect) を呼び出す必要があります。再接続されたセッションは、有効化されたエージェントや構成されたブレークポイントなど、すべてのインスペクター状態を失います。

#### `session.post(method[, params][, callback])` {#sessionpostmethod-params-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v8.0.0 | Added in: v8.0.0 |
:::

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

メッセージをインスペクターバックエンドに投稿します。応答を受信すると、`callback` に通知されます。`callback` は、error とメッセージ固有の結果という 2 つのオプションの引数を受け入れる関数です。

```js [ESM]
session.post('Runtime.evaluate', { expression: '2 + 2' },
             (error, { result }) => console.log(result));
// Output: { type: 'number', value: 4, description: '4' }
```
V8インスペクタープロトコルの最新バージョンは、[Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/)で公開されています。

Node.jsインスペクターは、V8によって宣言されたすべてのChrome DevToolsプロトコルドメインをサポートしています。Chrome DevToolsプロトコルドメインは、アプリケーションの状態を検査し、ランタイムイベントをリッスンするために使用されるランタイムエージェントの1つと対話するためのインターフェースを提供します。

V8に `HeapProfiler.takeHeapSnapshot` または `HeapProfiler.stopTrackingHeapObjects` コマンドを送信するときに、`reportProgress` を `true` に設定することはできません。


#### Example usage {#example-usage_1}

デバッガーの他に、さまざまな V8 プロファイラーが DevTools プロトコルを通じて利用できます。

##### CPU プロファイラー {#cpu-profiler_1}

[CPU プロファイラー](https://chromedevtools.github.io/devtools-protocol/v8/Profiler) の使用例を以下に示します。

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // ここで測定対象のビジネスロジックを呼び出します...

    // しばらくして...
    session.post('Profiler.stop', (err, { profile }) => {
      // プロファイルをディスクに書き込み、アップロードなどを行います。
      if (!err) {
        fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
      }
    });
  });
});
```
##### ヒーププロファイラー {#heap-profiler_1}

[ヒーププロファイラー](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler) の使用例を以下に示します。

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
  console.log('HeapProfiler.takeHeapSnapshot done:', err, r);
  session.disconnect();
  fs.closeSync(fd);
});
```
## Common Objects {#common-objects}

### `inspector.close()` {#inspectorclose}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.10.0 | API が worker スレッドで公開されました。 |
| v9.0.0 | Added in: v9.0.0 |
:::

残りのすべての接続を閉じようとし、すべてが閉じるまでイベントループをブロックします。すべての接続が閉じられると、インスペクターを非アクティブ化します。

### `inspector.console` {#inspectorconsole}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) リモートインスペクターコンソールにメッセージを送信するオブジェクト。

```js [ESM]
require('node:inspector').console.log('a message');
```
インスペクターコンソールは、Node.js console と API の同等性を持っていません。


### `inspector.open([port[, host[, wait]]])` {#inspectoropenport-host-wait}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.6.0 | inspector.open() が `Disposable` オブジェクトを返すようになりました。 |
:::

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) インスペクター接続をリッスンするポート。省略可能です。**デフォルト:** CLI で指定されたもの。
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) インスペクター接続をリッスンするホスト。省略可能です。**デフォルト:** CLI で指定されたもの。
- `wait` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) クライアントが接続するまでブロックします。省略可能です。**デフォルト:** `false`。
- 戻り値: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) [`inspector.close()`](/ja/nodejs/api/inspector#inspectorclose) を呼び出す Disposable。

ホストとポートでインスペクターを有効にします。 `node --inspect=[[host:]port]` と同等ですが、node の起動後にプログラム的に実行できます。

wait が `true` の場合、クライアントがインスペクトポートに接続し、フロー制御がデバッガークライアントに渡されるまでブロックします。

`host` パラメーターの使用に関する [セキュリティ警告](/ja/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) を参照してください。

### `inspector.url()` {#inspectorurl}

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

アクティブなインスペクターの URL を返します。存在しない場合は `undefined` を返します。

```bash [BASH]
$ node --inspect -p 'inspector.url()'
Debugger listening on ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34
For help, see: https://nodejs.org/en/docs/inspector
ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34

$ node --inspect=localhost:3000 -p 'inspector.url()'
Debugger listening on ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a
For help, see: https://nodejs.org/en/docs/inspector
ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a

$ node -p 'inspector.url()'
undefined
```

### `inspector.waitForDebugger()` {#inspectorwaitfordebugger}

**追加:** v12.7.0

クライアント（既存または後から接続されたもの）が `Runtime.runIfWaitingForDebugger` コマンドを送信するまでブロックします。

アクティブなインスペクターがない場合、例外がスローされます。

## DevTools との統合 {#integration-with-devtools}

`node:inspector` モジュールは、Chrome DevTools Protocol をサポートする devtools と統合するための API を提供します。実行中の Node.js インスタンスに接続された DevTools フロントエンドは、インスタンスから発行されたプロトコルイベントをキャプチャし、デバッグを容易にするためにそれに応じて表示できます。以下のメソッドは、接続されたすべてのフロントエンドにプロトコルイベントをブロードキャストします。メソッドに渡される `params` は、プロトコルに応じてオプションになる場合があります。

```js [ESM]
// `Network.requestWillBeSent` イベントが発火されます。
inspector.Network.requestWillBeSent({
  requestId: 'request-id-1',
  timestamp: Date.now() / 1000,
  wallTime: Date.now(),
  request: {
    url: 'https://nodejs.org/en',
    method: 'GET',
  },
});
```
### `inspector.Network.requestWillBeSent([params])` {#inspectornetworkrequestwillbesentparams}

**追加:** v22.6.0, v20.18.0

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

この機能は、`--experimental-network-inspection` フラグが有効になっている場合にのみ使用できます。

接続されたフロントエンドに `Network.requestWillBeSent` イベントをブロードキャストします。このイベントは、アプリケーションが HTTP リクエストを送信しようとしていることを示します。

### `inspector.Network.responseReceived([params])` {#inspectornetworkresponsereceivedparams}

**追加:** v22.6.0, v20.18.0

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

この機能は、`--experimental-network-inspection` フラグが有効になっている場合にのみ使用できます。

接続されたフロントエンドに `Network.responseReceived` イベントをブロードキャストします。このイベントは、HTTP レスポンスが利用可能になったことを示します。


### `inspector.Network.loadingFinished([params])` {#inspectornetworkloadingfinishedparams}

**Added in: v22.6.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - Experimental
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

この機能は、`--experimental-network-inspection` フラグが有効になっている場合にのみ利用可能です。

接続されたフロントエンドに `Network.loadingFinished` イベントをブロードキャストします。このイベントは、HTTP リクエストのロードが終了したことを示します。

### `inspector.Network.loadingFailed([params])` {#inspectornetworkloadingfailedparams}

**Added in: v22.7.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - Experimental
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

この機能は、`--experimental-network-inspection` フラグが有効になっている場合にのみ利用可能です。

接続されたフロントエンドに `Network.loadingFailed` イベントをブロードキャストします。このイベントは、HTTP リクエストのロードに失敗したことを示します。

## ブレークポイントのサポート {#support-of-breakpoints}

Chrome DevTools Protocol の [`Debugger` ドメイン](https://chromedevtools.github.io/devtools-protocol/v8/Debugger) により、`inspector.Session` はプログラムにアタッチし、コードをステップ実行するためのブレークポイントを設定できます。

ただし、[`session.connect()`](/ja/nodejs/api/inspector#sessionconnect) で接続された同じスレッドの `inspector.Session` でブレークポイントを設定することは避ける必要があります。アタッチおよび一時停止されているプログラムは、まさにデバッガー自体であるためです。代わりに、[`session.connectToMainThread()`](/ja/nodejs/api/inspector#sessionconnecttomainthread) でメインスレッドに接続し、ワーカースレッドにブレークポイントを設定するか、WebSocket 接続を介して [Debugger](/ja/nodejs/api/debugger) プログラムに接続してみてください。

