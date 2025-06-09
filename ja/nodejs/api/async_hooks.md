---
title: Node.js ドキュメント - 非同期フック
description: Node.js の非同期フック API を探りましょう。これは、Node.js アプリケーション内での非同期リソースのライフサイクルを追跡する方法を提供します。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - 非同期フック | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js の非同期フック API を探りましょう。これは、Node.js アプリケーション内での非同期リソースのライフサイクルを追跡する方法を提供します。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - 非同期フック | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js の非同期フック API を探りましょう。これは、Node.js アプリケーション内での非同期リソースのライフサイクルを追跡する方法を提供します。
---


# Async hooks {#async-hooks}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的。可能であれば、このAPIからの移行をお願いします。[`createHook`](/ja/nodejs/api/async_hooks#async_hookscreatehookcallbacks)、[`AsyncHook`](/ja/nodejs/api/async_hooks#class-asynchook)、[`executionAsyncResource`](/ja/nodejs/api/async_hooks#async_hooksexecutionasyncresource) APIは、ユーザビリティの問題、安全性のリスク、およびパフォーマンスへの影響があるため、使用することはお勧めしません。非同期コンテキスト追跡のユースケースは、安定版の[`AsyncLocalStorage`](/ja/nodejs/api/async_context#class-asynclocalstorage) APIでより適切に処理できます。[`AsyncLocalStorage`](/ja/nodejs/api/async_context#class-asynclocalstorage)または[Diagnostics Channel](/ja/nodejs/api/diagnostics_channel)によって現在提供されている診断データによって解決されるコンテキスト追跡のニーズを超えて、`createHook`、`AsyncHook`、または`executionAsyncResource`のユースケースがある場合は、ユースケースを説明する問題を[https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues)でオープンしてください。より目的指向のAPIを作成できるようにします。
:::

**ソースコード:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

`async_hooks` APIの使用は強く推奨されません。ほとんどのユースケースをカバーできる他のAPIには以下が含まれます。

- [`AsyncLocalStorage`](/ja/nodejs/api/async_context#class-asynclocalstorage) は非同期コンテキストを追跡します
- [`process.getActiveResourcesInfo()`](/ja/nodejs/api/process#processgetactiveresourcesinfo) はアクティブなリソースを追跡します

`node:async_hooks`モジュールは、非同期リソースを追跡するためのAPIを提供します。これは以下を使用してアクセスできます。

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
```

```js [CJS]
const async_hooks = require('node:async_hooks');
```
:::

## 用語 {#terminology}

非同期リソースは、関連付けられたコールバックを持つオブジェクトを表します。このコールバックは、`net.createServer()`の`'connection'`イベントのように複数回呼び出されることもあれば、`fs.open()`のように1回だけ呼び出されることもあります。リソースは、コールバックが呼び出される前に閉じられることもあります。`AsyncHook`は、これらの異なるケースを明示的に区別しませんが、リソースという抽象的な概念として表現します。

[`Worker`](/ja/nodejs/api/worker_threads#class-worker)が使用されている場合、各スレッドには独立した`async_hooks`インターフェースがあり、各スレッドは新しい非同期IDのセットを使用します。


## 概要 {#overview}

以下は、パブリックAPIの簡単な概要です。

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';

// 現在の実行コンテキストのIDを返します。
const eid = async_hooks.executionAsyncId();

// 現在の実行スコープのコールバックを呼び出すトリガーとなったハンドルのIDを返します。
const tid = async_hooks.triggerAsyncId();

// 新しい AsyncHook インスタンスを作成します。これらのコールバックはすべてオプションです。
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// この AsyncHook インスタンスのコールバックの呼び出しを許可します。これはコンストラクタの実行後の暗黙的な
// アクションではなく、コールバックの実行を開始するには明示的に実行する必要があります。
asyncHook.enable();

// 新しい非同期イベントのリスンを無効にします。
asyncHook.disable();

//
// 以下は、createHook() に渡すことができるコールバックです。
//

// init() はオブジェクトの構築中に呼び出されます。このコールバックが実行されるとき、リソースの構築が完了していない場合があります。
// したがって、"asyncId" によって参照されるリソースのすべてのフィールドが入力されていない可能性があります。
function init(asyncId, type, triggerAsyncId, resource) { }

// before() は、リソースのコールバックが呼び出される直前に呼び出されます。ハンドル (TCPWrap など) の場合は 0～N 回呼び出すことができ、
// リクエスト (FSReqCallback など) の場合は正確に 1 回呼び出されます。
function before(asyncId) { }

// after() は、リソースのコールバックが完了した直後に呼び出されます。
function after(asyncId) { }

// destroy() は、リソースが破棄されるときに呼び出されます。
function destroy(asyncId) { }

// promiseResolve() は、Promise コンストラクタに渡された resolve() 関数が呼び出されたときに
// (直接的または他の Promise の解決手段を通じて) Promise リソースに対してのみ呼び出されます。
function promiseResolve(asyncId) { }
```

```js [CJS]
const async_hooks = require('node:async_hooks');

// 現在の実行コンテキストのIDを返します。
const eid = async_hooks.executionAsyncId();

// 現在の実行スコープのコールバックを呼び出すトリガーとなったハンドルのIDを返します。
const tid = async_hooks.triggerAsyncId();

// 新しい AsyncHook インスタンスを作成します。これらのコールバックはすべてオプションです。
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// この AsyncHook インスタンスのコールバックの呼び出しを許可します。これはコンストラクタの実行後の暗黙的な
// アクションではなく、コールバックの実行を開始するには明示的に実行する必要があります。
asyncHook.enable();

// 新しい非同期イベントのリスンを無効にします。
asyncHook.disable();

//
// 以下は、createHook() に渡すことができるコールバックです。
//

// init() はオブジェクトの構築中に呼び出されます。このコールバックが実行されるとき、リソースの構築が完了していない場合があります。
// したがって、"asyncId" によって参照されるリソースのすべてのフィールドが入力されていない可能性があります。
function init(asyncId, type, triggerAsyncId, resource) { }

// before() は、リソースのコールバックが呼び出される直前に呼び出されます。ハンドル (TCPWrap など) の場合は 0～N 回呼び出すことができ、
// リクエスト (FSReqCallback など) の場合は正確に 1 回呼び出されます。
function before(asyncId) { }

// after() は、リソースのコールバックが完了した直後に呼び出されます。
function after(asyncId) { }

// destroy() は、リソースが破棄されるときに呼び出されます。
function destroy(asyncId) { }

// promiseResolve() は、Promise コンストラクタに渡された resolve() 関数が呼び出されたときに
// (直接的または他の Promise の解決手段を通じて) Promise リソースに対してのみ呼び出されます。
function promiseResolve(asyncId) { }
```
:::


## `async_hooks.createHook(callbacks)` {#async_hookscreatehookcallbacks}

**Added in: v8.1.0**

- `callbacks` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 登録する[Hook Callbacks](/ja/nodejs/api/async_hooks#hook-callbacks)
    - `init` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`init` コールバック](/ja/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource)。
    - `before` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`before` コールバック](/ja/nodejs/api/async_hooks#beforeasyncid)。
    - `after` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`after` コールバック](/ja/nodejs/api/async_hooks#afterasyncid)。
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`destroy` コールバック](/ja/nodejs/api/async_hooks#destroyasyncid)。
    - `promiseResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`promiseResolve` コールバック](/ja/nodejs/api/async_hooks#promiseresolveasyncid)。
  
 
- 戻り値: [\<AsyncHook\>](/ja/nodejs/api/async_hooks#async_hookscreatehookcallbacks) フックの無効化と有効化に使用されるインスタンス

各非同期操作のさまざまなライフタイムイベントに対して呼び出される関数を登録します。

コールバック `init()`/`before()`/`after()`/`destroy()` は、リソースのライフタイム中にそれぞれの非同期イベントに対して呼び出されます。

すべてのコールバックはオプションです。 たとえば、リソースのクリーンアップのみを追跡する必要がある場合は、`destroy` コールバックのみを渡す必要があります。 `callbacks` に渡すことができるすべての関数の詳細は、[Hook Callbacks](/ja/nodejs/api/async_hooks#hook-callbacks) セクションにあります。

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const asyncHook = createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```
:::

コールバックはプロトタイプチェーンを介して継承されます。

```js [ESM]
class MyAsyncCallbacks {
  init(asyncId, type, triggerAsyncId, resource) { }
  destroy(asyncId) {}
}

class MyAddedCallbacks extends MyAsyncCallbacks {
  before(asyncId) { }
  after(asyncId) { }
}

const asyncHook = async_hooks.createHook(new MyAddedCallbacks());
```
Promise は非同期フック機構によってライフサイクルが追跡される非同期リソースであるため、`init()`、`before()`、`after()`、および `destroy()` コールバックは、Promise を返す非同期関数 *であってはなりません*。


### エラー処理 {#error-handling}

`AsyncHook`のコールバックで例外が発生した場合、アプリケーションはスタックトレースを出力して終了します。終了の経路はキャッチされない例外と同じですが、`'uncaughtException'`リスナーはすべて削除され、強制的にプロセスが終了します。`'exit'`コールバックは、`--abort-on-uncaught-exception`を指定してアプリケーションを実行した場合を除き、引き続き呼び出されます。この場合、スタックトレースが出力され、アプリケーションは終了し、コアファイルが残ります。

このエラー処理の動作の理由は、これらのコールバックがオブジェクトのライフサイクルの潜在的に不安定な時点、たとえばクラスの構築や破棄の際に実行されているためです。そのため、将来意図しない中断を防ぐために、プロセスを迅速に停止する必要があると判断されています。包括的な分析を実施して、例外が意図しない副作用なしに通常の制御フローに従うことができることを確認できれば、将来的に変更される可能性があります。

### `AsyncHook`コールバックでの出力 {#printing-in-asynchook-callbacks}

コンソールへの出力は非同期操作であるため、`console.log()`を呼び出すと`AsyncHook`コールバックが呼び出されます。`AsyncHook`コールバック関数内で`console.log()`または同様の非同期操作を使用すると、無限再帰が発生します。デバッグを行う際の簡単な解決策は、`fs.writeFileSync(file, msg, flag)`のような同期ロギング操作を使用することです。これにより、ファイルに出力され、同期であるため`AsyncHook`を再帰的に呼び出しません。

::: code-group
```js [ESM]
import { writeFileSync } from 'node:fs';
import { format } from 'node:util';

function debug(...args) {
  // Use a function like this one when debugging inside an AsyncHook callback
  writeFileSync('log.out', `${format(...args)}\n`, { flag: 'a' });
}
```

```js [CJS]
const fs = require('node:fs');
const util = require('node:util');

function debug(...args) {
  // Use a function like this one when debugging inside an AsyncHook callback
  fs.writeFileSync('log.out', `${util.format(...args)}\n`, { flag: 'a' });
}
```
:::

ロギングに非同期操作が必要な場合は、`AsyncHook`自体が提供する情報を使用して、非同期操作の原因を追跡できます。ロギング自体が`AsyncHook`コールバックを呼び出した原因である場合は、ロギングをスキップする必要があります。これにより、無限再帰が中断されます。


## クラス: `AsyncHook` {#class-asynchook}

`AsyncHook` クラスは、非同期操作のライフタイムイベントを追跡するためのインターフェースを公開します。

### `asyncHook.enable()` {#asynchookenable}

- 戻り値: [\<AsyncHook\>](/ja/nodejs/api/async_hooks#async_hookscreatehookcallbacks) `asyncHook` への参照。

指定された `AsyncHook` インスタンスのコールバックを有効にします。コールバックが提供されない場合、有効化は何も行いません。

`AsyncHook` インスタンスはデフォルトで無効になっています。`AsyncHook` インスタンスを作成直後に有効にする必要がある場合は、次のパターンを使用できます。

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const hook = createHook(callbacks).enable();
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const hook = async_hooks.createHook(callbacks).enable();
```
:::

### `asyncHook.disable()` {#asynchookdisable}

- 戻り値: [\<AsyncHook\>](/ja/nodejs/api/async_hooks#async_hookscreatehookcallbacks) `asyncHook` への参照。

実行される `AsyncHook` コールバックのグローバルプールから、指定された `AsyncHook` インスタンスのコールバックを無効にします。フックが無効になると、再度有効になるまで呼び出されることはありません。

API の一貫性のため、`disable()` も `AsyncHook` インスタンスを返します。

### フックコールバック {#hook-callbacks}

非同期イベントのライフタイムにおける主要なイベントは、インスタンス化、コールバックが呼び出される前/後、およびインスタンスが破棄されるときの 4 つの領域に分類されています。

#### `init(asyncId, type, triggerAsyncId, resource)` {#initasyncid-type-triggerasyncid-resource}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 非同期リソースの一意の ID。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 非同期リソースのタイプ。
- `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この非同期リソースが作成された実行コンテキスト内の非同期リソースの一意の ID。
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 非同期操作を表すリソースへの参照。*destroy* 中に解放する必要があります。

非同期イベントを発行する *可能性* があるクラスが構築されるときに呼び出されます。これは、インスタンスが `destroy` が呼び出される前に `before` / `after` を呼び出す *必要はない* ことを意味し、可能性が存在するだけです。

この動作は、リソースを開いてから、リソースが使用される前に閉じるなどの操作を行うことで観察できます。次のスニペットは、これを示しています。

::: code-group
```js [ESM]
import { createServer } from 'node:net';

createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```

```js [CJS]
require('node:net').createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```
:::

すべての新しいリソースには、現在の Node.js インスタンスのスコープ内で一意の ID が割り当てられます。


##### `type` {#type}

`type` は、`init` の呼び出しを引き起こしたリソースの型を識別する文字列です。 一般的に、これはリソースのコンストラクターの名前と一致します。

Node.js自体によって作成されたリソースの `type` は、Node.jsのリリースごとに変更される可能性があります。 有効な値には、`TLSWRAP`、`TCPWRAP`、`TCPSERVERWRAP`、`GETADDRINFOREQWRAP`、`FSREQCALLBACK`、`Microtask`、および`Timeout`が含まれます。 完全なリストを取得するには、使用されているNode.jsバージョンのソースコードを調べてください。

さらに、[`AsyncResource`](/ja/nodejs/api/async_context#class-asyncresource) のユーザーは、Node.js自体とは独立して非同期リソースを作成します。

`PROMISE` リソースタイプもあり、これは `Promise` インスタンスとそれらによってスケジュールされた非同期作業を追跡するために使用されます。

ユーザーは、パブリック埋め込みAPIを使用するときに、独自の `type` を定義できます。

型の名前が衝突する可能性があります。 埋め込み担当者は、フックをリッスンするときに衝突を防ぐために、npmパッケージ名など、一意のプレフィックスを使用することをお勧めします。

##### `triggerAsyncId` {#triggerasyncid}

`triggerAsyncId` は、新しいリソースの初期化を引き起こし (`init` の呼び出しをトリガーした) リソースの `asyncId` です。 これは、リソースが *いつ* 作成されたかを示すだけの `async_hooks.executionAsyncId()` とは異なり、`triggerAsyncId` はリソースが *なぜ* 作成されたかを示します。

以下は、`triggerAsyncId` の簡単なデモンストレーションです。

::: code-group
```js [ESM]
import { createHook, executionAsyncId } from 'node:async_hooks';
import { stdout } from 'node:process';
import net from 'node:net';
import fs from 'node:fs';

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```

```js [CJS]
const { createHook, executionAsyncId } = require('node:async_hooks');
const { stdout } = require('node:process';
const net = require('node:net');
const fs = require('node:fs');

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```
:::

`nc localhost 8080` でサーバーにアクセスしたときの出力:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TCPWRAP(7): trigger: 5 execution: 0
```

`TCPSERVERWRAP` は、接続を受信するサーバーです。

`TCPWRAP` は、クライアントからの新しい接続です。 新しい接続が確立されると、`TCPWrap` インスタンスがすぐに構築されます。 これは、JavaScriptスタックの外で行われます。 (`executionAsyncId()` の `0` は、JavaScriptスタックなしでC++から実行されていることを意味します。) その情報だけでは、リソースの作成の原因という点でリソースをリンクすることは不可能であるため、`triggerAsyncId` に新しいリソースの存在に責任のあるリソースを伝播するというタスクが与えられます。


##### `resource` {#resource}

`resource` は、初期化された実際的な非同期リソースを表すオブジェクトです。オブジェクトへのアクセスAPIは、リソースの作成者によって指定される場合があります。Node.js自体によって作成されたリソースは内部的なものであり、いつでも変更される可能性があります。したがって、これらに対するAPIは指定されていません。

場合によっては、パフォーマンス上の理由からリソースオブジェクトが再利用されるため、`WeakMap`のキーとして使用したり、プロパティを追加したりするのは安全ではありません。

##### 非同期コンテキストの例 {#asynchronous-context-example}

コンテキスト追跡のユースケースは、安定版API [`AsyncLocalStorage`](/ja/nodejs/api/async_context#class-asynclocalstorage) でカバーされています。この例は非同期フックの動作を示すだけですが、このユースケースには [`AsyncLocalStorage`](/ja/nodejs/api/async_context#class-asynclocalstorage) の方が適しています。

以下は、`before` と `after` の呼び出しの間の `init` への呼び出しに関する追加情報を含む例です。特に、`listen()` へのコールバックがどのように見えるかを示します。出力のフォーマットは、呼び出しコンテキストを見やすくするためにわずかに複雑になっています。

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
import fs from 'node:fs';
import net from 'node:net';
import { stdout } from 'node:process';
const { fd } = stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');
const net = require('node:net');
const { fd } = process.stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```
:::

サーバーを起動した場合のみの出力:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TickObject(6): trigger: 5 execution: 1
before:  6
  Timeout(7): trigger: 6 execution: 6
after:   6
destroy: 6
before:  7
>>> 7
  TickObject(8): trigger: 7 execution: 7
after:   7
before:  8
after:   8
```
この例で示されているように、`executionAsyncId()` と `execution` はそれぞれ、現在の実行コンテキストの値を指定します。これは、`before` と `after` の呼び出しによって区切られます。

リソース割り当てをグラフ化するために `execution` のみを使用すると、次のようになります。

```bash [BASH]
  root(1)
     ^
     |
TickObject(6)
     ^
     |
 Timeout(7)
```
ホスト名なしでポートにバインドするのは *同期* 操作ですが、完全に非同期のAPIを維持するために、ユーザーのコールバックは `process.nextTick()` に配置されるため、`TCPSERVERWRAP`はこのグラフの一部ではありません。そのため、`TickObject` が出力に存在し、`.listen()` コールバックの「親」となります。

グラフは、リソースが *いつ* 作成されたかのみを示し、*なぜ* 作成されたかを示さないため、*なぜ* を追跡するには `triggerAsyncId` を使用します。これは、次のグラフで表すことができます。

```bash [BASH]
 bootstrap(1)
     |
     ˅
TCPSERVERWRAP(5)
     |
     ˅
 TickObject(6)
     |
     ˅
  Timeout(7)
```

#### `before(asyncId)` {#beforeasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

非同期処理が開始された (例えば、TCPサーバーが新しい接続を受信した場合) または完了した (例えば、ディスクにデータを書き込んだ場合) とき、ユーザーに通知するためにコールバックが呼び出されます。`before` コールバックは、上記のコールバックが実行される直前に呼び出されます。`asyncId` は、コールバックを実行しようとしているリソースに割り当てられた一意の識別子です。

`before` コールバックは、0 回から N 回呼び出されます。`before` コールバックは通常、非同期処理がキャンセルされた場合、または例えば、TCPサーバーが接続を受信しなかった場合など、0 回呼び出されます。TCPサーバーのような永続的な非同期リソースは通常、`before` コールバックを複数回呼び出しますが、`fs.open()` のような他の処理は 1 回だけ呼び出します。

#### `after(asyncId)` {#afterasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`before` で指定されたコールバックが完了した直後に呼び出されます。

コールバックの実行中にキャッチされない例外が発生した場合、`after` は `'uncaughtException'` イベントが発行された*後*、または `domain` のハンドラーが実行された後に実行されます。

#### `destroy(asyncId)` {#destroyasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`asyncId` に対応するリソースが破棄された後に呼び出されます。また、embedder API `emitDestroy()` から非同期的に呼び出されます。

一部のリソースは、クリーンアップのためにガベージコレクションに依存しているため、`init` に渡された `resource` オブジェクトへの参照がある場合、`destroy` が呼び出されず、アプリケーションでメモリリークが発生する可能性があります。リソースがガベージコレクションに依存していない場合は、これは問題になりません。

destroy フックを使用すると、ガベージコレクターを介して `Promise` インスタンスの追跡が可能になるため、追加のオーバーヘッドが発生します。

#### `promiseResolve(asyncId)` {#promiseresolveasyncid}

**Added in: v8.6.0**

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`Promise` コンストラクターに渡された `resolve` 関数が (直接または promise を解決する他の手段を介して) 呼び出されたときに呼び出されます。

`resolve()` は、観察可能な同期処理を行いません。

`Promise` が別の `Promise` の状態を引き継ぐことによって解決された場合、この時点で `Promise` が必ずしも fulfilled または rejected されるとは限りません。

```js [ESM]
new Promise((resolve) => resolve(true)).then((a) => {});
```
は、次のコールバックを呼び出します。

```text [TEXT]
init for PROMISE with id 5, trigger id: 1
  promise resolve 5      # corresponds to resolve(true)
init for PROMISE with id 6, trigger id: 5  # the Promise returned by then()
  before 6               # the then() callback is entered
  promise resolve 6      # the then() callback resolves the promise by returning
  after 6
```

### `async_hooks.executionAsyncResource()` {#async_hooksexecutionasyncresource}

**追加:** v13.9.0, v12.17.0

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 現在の実行を表すリソース。リソース内にデータを格納するのに役立ちます。

`executionAsyncResource()` によって返されるリソースオブジェクトは、ほとんどの場合、ドキュメント化されていない API を持つ内部 Node.js ハンドルオブジェクトです。オブジェクトの関数やプロパティを使用すると、アプリケーションがクラッシュする可能性が高いため、避ける必要があります。

トップレベルの実行コンテキストで `executionAsyncResource()` を使用すると、使用するハンドルまたはリクエストオブジェクトがないため、空のオブジェクトが返されますが、トップレベルを表すオブジェクトがあると役立つ場合があります。

::: code-group
```js [ESM]
import { open } from 'node:fs';
import { executionAsyncId, executionAsyncResource } from 'node:async_hooks';

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(new URL(import.meta.url), 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```

```js [CJS]
const { open } = require('node:fs');
const { executionAsyncId, executionAsyncResource } = require('node:async_hooks');

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(__filename, 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```
:::

これは、メタデータを格納するために追跡用の `Map` を使用せずに、継続的ローカルストレージを実装するために使用できます。

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} from 'node:async_hooks';
const sym = Symbol('state'); // 汚染を避けるためのプライベートシンボル

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} = require('node:async_hooks');
const sym = Symbol('state'); // 汚染を避けるためのプライベートシンボル

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```
:::


### `async_hooks.executionAsyncId()` {#async_hooksexecutionasyncid}

::: info [History]
| Version | Changes |
| --- | --- |
| v8.2.0 | `currentId` から名前が変更されました。 |
| v8.1.0 | Added in: v8.1.0 |
:::

- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 現在の実行コンテキストの `asyncId`。何かがコールされたタイミングを追跡するのに役立ちます。

::: code-group
```js [ESM]
import { executionAsyncId } from 'node:async_hooks';
import fs from 'node:fs';

console.log(executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(executionAsyncId());  // 6 - open()
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');

console.log(async_hooks.executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(async_hooks.executionAsyncId());  // 6 - open()
});
```
:::

`executionAsyncId()` から返される ID は、因果関係 (これは `triggerAsyncId()` でカバーされます) ではなく、実行タイミングに関連しています:

```js [ESM]
const server = net.createServer((conn) => {
  // コールバックはサーバーの MakeCallback() の実行スコープで実行されるため、
  // 新しい接続の ID ではなく、サーバーの ID を返します。
  async_hooks.executionAsyncId();

}).listen(port, () => {
  // .listen() に渡されるすべてのコールバックは nextTick() でラップされているため、
  // TickObject (process.nextTick()) の ID を返します。
  async_hooks.executionAsyncId();
});
```
Promise コンテキストは、デフォルトでは正確な `executionAsyncId` を取得できない場合があります。[promise 実行追跡](/ja/nodejs/api/async_hooks#promise-execution-tracking)に関するセクションを参照してください。

### `async_hooks.triggerAsyncId()` {#async_hookstriggerasyncid}

- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 現在実行されているコールバックの呼び出しを担当するリソースの ID。

```js [ESM]
const server = net.createServer((conn) => {
  // このコールバックが呼び出される原因となった (またはトリガーした) リソースは、
  // 新しい接続のリソースでした。 したがって、triggerAsyncId() の戻り値は
  // "conn" の asyncId です。
  async_hooks.triggerAsyncId();

}).listen(port, () => {
  // .listen() に渡されるすべてのコールバックが nextTick() でラップされている場合でも、
  // コールバック自体は、サーバーの .listen() の呼び出しが行われたために存在します。
  // したがって、戻り値はサーバーの ID になります。
  async_hooks.triggerAsyncId();
});
```
Promise コンテキストは、デフォルトでは有効な `triggerAsyncId` を取得できない場合があります。[promise 実行追跡](/ja/nodejs/api/async_hooks#promise-execution-tracking)に関するセクションを参照してください。


### `async_hooks.asyncWrapProviders` {#async_hooksasyncwrapproviders}

**追加:** v17.2.0, v16.14.0

- 戻り値: プロバイダーの型とそれに対応する数値 ID のマップ。このマップには、`async_hooks.init()` イベントによって発行される可能性のあるすべてのイベントタイプが含まれています。

この機能は、非推奨の `process.binding('async_wrap').Providers` の使用を抑制します。参照: [DEP0111](/ja/nodejs/api/deprecations#dep0111-processbinding)

## Promise 実行の追跡 {#promise-execution-tracking}

デフォルトでは、V8 によって提供される [promise introspection API](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) の性質上、promise の実行に `asyncId` は割り当てられません。これは、promise または `async`/`await` を使用するプログラムでは、デフォルトで promise コールバックコンテキストに対して正しい実行 ID とトリガー ID が取得されないことを意味します。

::: code-group
```js [ESM]
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```

```js [CJS]
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```
:::

`then()` コールバックは、非同期のホップがあったにもかかわらず、外側のスコープのコンテキストで実行されたと主張していることに注意してください。また、`triggerAsyncId` の値は `0` であり、`then()` コールバックの実行を引き起こした (トリガーした) リソースに関するコンテキストが欠落していることを意味します。

`async_hooks.createHook` 経由で async hooks をインストールすると、promise の実行追跡が有効になります。

::: code-group
```js [ESM]
import { createHook, executionAsyncId, triggerAsyncId } from 'node:async_hooks';
createHook({ init() {} }).enable(); // forces PromiseHooks to be enabled.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```

```js [CJS]
const { createHook, executionAsyncId, triggerAsyncId } = require('node:async_hooks');

createHook({ init() {} }).enable(); // forces PromiseHooks to be enabled.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```
:::

この例では、実際のフック関数を追加すると、promise の追跡が有効になります。上記の例には、`Promise.resolve()` によって作成された promise と `then()` の呼び出しによって返された promise の 2 つの promise があります。上記の例では、最初の promise に `asyncId` `6` が、後者の promise に `asyncId` `7` が与えられました。`then()` コールバックの実行中、`asyncId` `7` を持つ promise のコンテキストで実行しています。この promise は、非同期リソース `6` によってトリガーされました。

promise のもう 1 つの微妙な点は、`before` および `after` コールバックは、連鎖された promise に対してのみ実行されることです。つまり、`then()`/`catch()` によって作成されていない promise では、`before` および `after` コールバックが起動されません。詳細については、V8 [PromiseHooks](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) API の詳細を参照してください。


## JavaScript embedder API {#javascript-embedder-api}

I/O、接続プール、コールバックキューの管理などのタスクを実行する独自の非同期リソースを処理するライブラリ開発者は、適切なコールバックがすべて呼び出されるように、`AsyncResource` JavaScript API を使用できます。

### クラス: `AsyncResource` {#class-asyncresource}

このクラスのドキュメントは [`AsyncResource`](/ja/nodejs/api/async_context#class-asyncresource) に移動しました。

## クラス: `AsyncLocalStorage` {#class-asynclocalstorage}

このクラスのドキュメントは [`AsyncLocalStorage`](/ja/nodejs/api/async_context#class-asynclocalstorage) に移動しました。

