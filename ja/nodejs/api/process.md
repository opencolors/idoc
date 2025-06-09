---
title: Node.js プロセスAPIドキュメント
description: Node.jsのプロセスモジュールに関する詳細なドキュメント。プロセス管理、環境変数、シグナルなどについてカバーしています。
head:
  - - meta
    - name: og:title
      content: Node.js プロセスAPIドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのプロセスモジュールに関する詳細なドキュメント。プロセス管理、環境変数、シグナルなどについてカバーしています。
  - - meta
    - name: twitter:title
      content: Node.js プロセスAPIドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのプロセスモジュールに関する詳細なドキュメント。プロセス管理、環境変数、シグナルなどについてカバーしています。
---


# Process {#process}

**ソースコード:** [lib/process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/process.js)

`process` オブジェクトは、現在の Node.js プロセスに関する情報を提供し、それを制御します。

::: code-group
```js [ESM]
import process from 'node:process';
```

```js [CJS]
const process = require('node:process');
```
:::

## プロセスイベント {#process-events}

`process` オブジェクトは [`EventEmitter`](/ja/nodejs/api/events#class-eventemitter) のインスタンスです。

### イベント: `'beforeExit'` {#event-beforeexit}

**追加: v0.11.12**

`'beforeExit'` イベントは、Node.js がイベントループを空にし、スケジュールする追加の作業がない場合に発生します。 通常、Node.js プロセスはスケジュールされた作業がない場合に終了しますが、`'beforeExit'` イベントに登録されたリスナーは非同期呼び出しを行うことができ、それによって Node.js プロセスを続行させることができます。

リスナーのコールバック関数は、[`process.exitCode`](/ja/nodejs/api/process#processexitcode_1) の値が唯一の引数として渡されて呼び出されます。

`'beforeExit'` イベントは、[`process.exit()`](/ja/nodejs/api/process#processexitcode) の呼び出しやキャッチされない例外など、明示的な終了を引き起こす状態では *発生しません*。

`'beforeExit'` は、追加の作業をスケジュールすることが目的でない限り、`'exit'` イベントの代替として *使用すべきではありません*。

::: code-group
```js [ESM]
import process from 'node:process';

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
```

```js [CJS]
const process = require('node:process');

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
```
:::


### イベント: `'disconnect'` {#event-disconnect}

**追加: v0.7.7**

Node.js プロセスが IPC チャネルで起動された場合（[子プロセス](/ja/nodejs/api/child_process)および[Cluster](/ja/nodejs/api/cluster)ドキュメントを参照）、IPC チャネルが閉じられると `'disconnect'` イベントが発行されます。

### イベント: `'exit'` {#event-exit}

**追加: v0.1.7**

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`'exit'` イベントは、次のいずれかの結果として Node.js プロセスが終了しようとするときに発行されます。

- `process.exit()` メソッドが明示的に呼び出された場合。
- Node.js イベントループがこれ以上実行する追加の作業を持っていない場合。

この時点でイベントループの終了を防ぐ方法はなく、すべての `'exit'` リスナーの実行が完了すると、Node.js プロセスは終了します。

リスナーのコールバック関数は、[`process.exitCode`](/ja/nodejs/api/process#processexitcode_1) プロパティ、または [`process.exit()`](/ja/nodejs/api/process#processexitcode) メソッドに渡された `exitCode` 引数のいずれかで指定された終了コードで呼び出されます。

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```
:::

リスナー関数は、**同期**操作のみを実行**しなければなりません**。 Node.js プロセスは `'exit'` イベントリスナーを呼び出した直後に終了し、イベントループでまだキューに入れられている追加の作業はすべて放棄されます。 たとえば、次の例では、タイムアウトは発生しません。

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```
:::


### Event: `'message'` {#event-message}

**Added in: v0.5.10**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) パースされた JSON オブジェクトまたはシリアライズ可能なプリミティブ値。
- `sendHandle` [\<net.Server\>](/ja/nodejs/api/net#class-netserver) | [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) [`net.Server`](/ja/nodejs/api/net#class-netserver) または [`net.Socket`](/ja/nodejs/api/net#class-netsocket) オブジェクト、または undefined。

Node.js プロセスが IPC チャネルで生成される場合（[Child Process](/ja/nodejs/api/child_process) および [Cluster](/ja/nodejs/api/cluster) ドキュメントを参照）、`'message'` イベントは、親プロセスが [`childprocess.send()`](/ja/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) を使用して送信したメッセージが子プロセスによって受信されるたびに発生します。

メッセージはシリアライズとパース処理を経ます。結果として得られるメッセージは、最初に送信されたものと同じではない可能性があります。

プロセスの生成時に `serialization` オプションが `advanced` に設定されていた場合、`message` 引数には JSON が表現できないデータが含まれる可能性があります。詳細については、[`child_process` の高度なシリアライズ](/ja/nodejs/api/child_process#advanced-serialization) を参照してください。

### Event: `'multipleResolves'` {#event-multipleresolves}

**Added in: v10.12.0**

**Deprecated since: v17.6.0, v16.15.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - Deprecated
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 解決タイプ。 `'resolve'` または `'reject'` のいずれか。
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 複数回解決または拒否された Promise。
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 元の解決後に Promise が解決または拒否された値。

`'multipleResolves'` イベントは、`Promise` が次のいずれかの場合に発生します。

- 複数回解決された。
- 複数回拒否された。
- 解決後に拒否された。
- 拒否後に解決された。

これは、`Promise` コンストラクターの使用中にアプリケーションで潜在的なエラーを追跡するのに役立ちます。複数の解決は通知なしに破棄されるためです。ただし、このイベントの発生は必ずしもエラーを示すものではありません。たとえば、[`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) は `'multipleResolves'` イベントをトリガーする可能性があります。

[`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) の上記の例のような場合におけるイベントの信頼性の低さから、非推奨となりました。

::: code-group
```js [ESM]
import process from 'node:process';

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```

```js [CJS]
const process = require('node:process');

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```
:::


### イベント: `'rejectionHandled'` {#event-rejectionhandled}

**追加: v1.4.1**

- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 遅れて処理された Promise。

`'rejectionHandled'` イベントは、`Promise`が拒否され、そのPromiseにエラーハンドラが（例えば、[`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) を使用して）Node.jsイベントループの1ターン後に追加された場合に発生します。

`Promise` オブジェクトは、以前に `'unhandledRejection'` イベントで発生していましたが、処理中に拒否ハンドラを取得しました。

拒否が常に処理される `Promise` チェーンのトップレベルという概念はありません。本質的に非同期であるため、`Promise` の拒否は将来のある時点で処理される可能性があり、`'unhandledRejection'` イベントが発生するイベントループのターンよりもずっと遅くなる可能性があります。

これを別の言い方をすると、未処理の例外のリストが常に増加する同期コードとは異なり、Promise では未処理の拒否のリストが増減する可能性があります。

同期コードでは、未処理の例外のリストが増加すると、`'uncaughtException'` イベントが発生します。

非同期コードでは、未処理の拒否のリストが増加すると `'unhandledRejection'` イベントが発生し、未処理の拒否のリストが減少すると `'rejectionHandled'` イベントが発生します。

::: code-group
```js [ESM]
import process from 'node:process';

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```

```js [CJS]
const process = require('node:process');

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```
:::

この例では、`unhandledRejections` `Map` は時間の経過とともに増減し、最初は未処理で後で処理される拒否を反映します。このようなエラーは、エラーログに記録することができます。定期的に（長期間実行されるアプリケーションに最適です）またはプロセス終了時（スクリプトに最も便利です）。


### イベント: `'workerMessage'` {#event-workermessage}

**追加: v22.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) [`postMessageToThread()`](/ja/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) を使用して送信された値。
- `source` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 送信元のワーカースレッドID、またはメインスレッドの場合は `0`。

`'workerMessage'` イベントは、[`postMessageToThread()`](/ja/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) を使用して相手側から送信されたメッセージに対して発生します。

### イベント: `'uncaughtException'` {#event-uncaughtexception}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.0.0, v10.17.0 | `origin` 引数を追加。 |
| v0.1.18 | 追加: v0.1.18 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) キャッチされない例外。
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 例外が未処理のリジェクト、または同期エラーのいずれに起因するかを示します。 `'uncaughtException'` または `'unhandledRejection'` のいずれかになります。後者は、`Promise` ベースの非同期コンテキストで例外が発生した場合（または `Promise` がリジェクトされた場合）、および [`--unhandled-rejections`](/ja/nodejs/api/cli#--unhandled-rejectionsmode) フラグが `strict` または `throw` (デフォルト) に設定されていて、リジェクトが処理されない場合、またはコマンドラインのエントリーポイントのESモジュールの静的読み込みフェーズ中にリジェクトが発生した場合に使用されます。

`'uncaughtException'` イベントは、キャッチされない JavaScript 例外がイベントループまでバブルアップしたときに発生します。デフォルトでは、Node.js は、スタックトレースを `stderr` に出力し、以前に設定された [`process.exitCode`](/ja/nodejs/api/process#processexitcode_1) を上書きして、コード 1 で終了することにより、このような例外を処理します。 `'uncaughtException'` イベントのハンドラーを追加すると、このデフォルトの動作が上書きされます。または、`'uncaughtException'` ハンドラーで [`process.exitCode`](/ja/nodejs/api/process#processexitcode_1) を変更すると、指定された終了コードでプロセスが終了します。それ以外の場合、このようなハンドラーが存在する場合、プロセスは 0 で終了します。

::: code-group
```js [ESM]
import process from 'node:process';
import fs from 'node:fs';

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```

```js [CJS]
const process = require('node:process');
const fs = require('node:fs');

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```
:::

`'uncaughtExceptionMonitor'` リスナーをインストールすることで、プロセスを終了するデフォルトの動作を上書きせずに `'uncaughtException'` イベントを監視できます。


#### 警告: `'uncaughtException'` の正しい使い方 {#warning-using-uncaughtexception-correctly}

`'uncaughtException'` は、例外処理のための粗雑なメカニズムであり、最後の手段としてのみ使用することを意図しています。このイベントは `On Error Resume Next` と同等のものとして*使用すべきではありません*。未処理の例外は、アプリケーションが本質的に未定義の状態にあることを意味します。例外から適切に回復することなくアプリケーションコードを再開しようとすると、予期せぬ予測不可能な問題が発生する可能性があります。

イベントハンドラ内からスローされた例外はキャッチされません。代わりに、プロセスはゼロ以外の終了コードで終了し、スタックトレースが出力されます。これは無限再帰を回避するためです。

キャッチされない例外の後に通常どおり再開しようとすることは、コンピュータのアップグレード中に電源コードを抜くのと似ています。10回中9回は何事も起こりません。しかし、10回目にシステムが破損します。

`'uncaughtException'` の正しい使い方は、プロセスをシャットダウンする前に、割り当てられたリソース（ファイル記述子、ハンドルなど）の同期的なクリーンアップを実行することです。**<code>'uncaughtException'</code> の後で通常の操作を再開するのは安全ではありません。**

`'uncaughtException'` が発生するかどうかにかかわらず、クラッシュしたアプリケーションをより信頼性の高い方法で再起動するには、外部モニターを別のプロセスで使用して、アプリケーションの障害を検出し、必要に応じて回復または再起動する必要があります。

### イベント: `'uncaughtExceptionMonitor'` {#event-uncaughtexceptionmonitor}

**追加: v13.7.0, v12.17.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) キャッチされなかった例外。
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 例外が未処理のリジェクトまたは同期エラーのどちらから発生したかを示します。`'uncaughtException'` または `'unhandledRejection'` のいずれかになります。後者は、`Promise` ベースの非同期コンテキストで例外が発生した場合（または `Promise` がリジェクトされた場合）に、[`--unhandled-rejections`](/ja/nodejs/api/cli#--unhandled-rejectionsmode) フラグが `strict` または `throw` (デフォルト) に設定されており、リジェクトが処理されない場合、またはコマンドラインエントリポイントの ES モジュール静的ロードフェーズ中にリジェクトが発生した場合に使用されます。

`'uncaughtExceptionMonitor'` イベントは、`'uncaughtException'` イベントが発生する前、または [`process.setUncaughtExceptionCaptureCallback()`](/ja/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) を介してインストールされたフックが呼び出される前に発生します。

`'uncaughtExceptionMonitor'` リスナーをインストールしても、`'uncaughtException'` イベントが発生した後の動作は変わりません。`'uncaughtException'` リスナーがインストールされていない場合、プロセスは引き続きクラッシュします。

::: code-group
```js [ESM]
import process from 'node:process';

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// 意図的に例外を発生させますが、キャッチしません。
nonexistentFunc();
// まだ Node.js がクラッシュします
```

```js [CJS]
const process = require('node:process');

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// 意図的に例外を発生させますが、キャッチしません。
nonexistentFunc();
// まだ Node.js がクラッシュします
```
:::


### イベント: `'unhandledRejection'` {#event-unhandledrejection}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v7.0.0 | `Promise` のリジェクションを処理しないことは非推奨になりました。 |
| v6.6.0 | 未処理の `Promise` のリジェクションは、プロセス警告を発行するようになりました。 |
| v1.4.1 | 追加: v1.4.1 |
:::

- `reason` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Promise がリジェクトされたオブジェクト (通常は [`Error`](/ja/nodejs/api/errors#class-error) オブジェクト)。
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) リジェクトされた Promise。

`'unhandledRejection'` イベントは、`Promise` がリジェクトされ、イベントループのターン内に Promise にエラーハンドラがアタッチされていない場合に常に発行されます。 Promise を使用したプログラミングでは、例外は「リジェクトされた Promise」としてカプセル化されます。 リジェクションは [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) を使用してキャッチおよび処理でき、`Promise` チェーンを介して伝播されます。 `'unhandledRejection'` イベントは、リジェクションがまだ処理されていないリジェクトされた Promise を検出および追跡するのに役立ちます。

::: code-group
```js [ESM]
import process from 'node:process';

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // ここにアプリケーション固有のロギング、エラーのスロー、またはその他のロジックを記述します
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // タイプミス (`pasre`) に注意してください
}); // `.catch()` または `.then()` がありません
```

```js [CJS]
const process = require('node:process');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // ここにアプリケーション固有のロギング、エラーのスロー、またはその他のロジックを記述します
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // タイプミス (`pasre`) に注意してください
}); // `.catch()` または `.then()` がありません
```
:::

次のものも `'unhandledRejection'` イベントが発行されるトリガーになります。

::: code-group
```js [ESM]
import process from 'node:process';

function SomeResource() {
  // 最初は、ロードされたステータスをリジェクトされた Promise に設定します
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// 少なくとも 1 ターンは resource.loaded に .catch または .then がありません
```

```js [CJS]
const process = require('node:process');

function SomeResource() {
  // 最初は、ロードされたステータスをリジェクトされた Promise に設定します
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// 少なくとも 1 ターンは resource.loaded に .catch または .then がありません
```
:::

この例の場合、他の `'unhandledRejection'` イベントの場合と同様に、リジェクションを開発者エラーとして追跡できます。 このような失敗に対処するには、非操作型の [`.catch(() =\> { })`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) ハンドラを `resource.loaded` にアタッチすると、`'unhandledRejection'` イベントが発行されなくなります。


### Event: `'warning'` {#event-warning}

**Added in: v6.0.0**

- `warning` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 警告のキーとなるプロパティは以下の通りです。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 警告の名前。 **デフォルト:** `'Warning'`。
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) システムが提供する警告の説明。
    - `stack` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 警告が発行されたコード内の場所へのスタックトレース。
  
 

`'warning'` イベントは、Node.js がプロセスの警告を発行するたびに発生します。

プロセスの警告は、ユーザーの注意を引くべき例外的な状態を説明するという点で、エラーに似ています。 ただし、警告は通常の Node.js および JavaScript のエラー処理フローの一部ではありません。 Node.js は、アプリケーションのパフォーマンスの低下、バグ、またはセキュリティの脆弱性につながる可能性のある悪いコーディングプラクティスを検出するたびに、警告を発行できます。

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 警告名を出力
  console.warn(warning.message); // 警告メッセージを出力
  console.warn(warning.stack);   // スタックトレースを出力
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // 警告名を出力
  console.warn(warning.message); // 警告メッセージを出力
  console.warn(warning.stack);   // スタックトレースを出力
});
```
:::

デフォルトでは、Node.js はプロセスの警告を `stderr` に出力します。 `--no-warnings` コマンドラインオプションを使用すると、デフォルトのコンソール出力を抑制できますが、`'warning'` イベントは `process` オブジェクトによって発行されます。 現在、非推奨の警告以外の特定の警告タイプを抑制することはできません。 非推奨の警告を抑制するには、[`--no-deprecation`](/ja/nodejs/api/cli#--no-deprecation) フラグを確認してください。

次の例は、イベントにリスナーが多すぎる場合、`stderr` に出力される警告を示しています。

```bash [BASH]
$ node
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> (node:38638) MaxListenersExceededWarning: Possible EventEmitter memory leak
detected. 2 foo listeners added. Use emitter.setMaxListeners() to increase limit
```
対照的に、次の例では、デフォルトの警告出力をオフにし、`'warning'` イベントにカスタムハンドラーを追加します。

```bash [BASH]
$ node --no-warnings
> const p = process.on('warning', (warning) => console.warn('Do not do that!'));
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> Do not do that!
```
`--trace-warnings` コマンドラインオプションを使用すると、警告のデフォルトのコンソール出力に警告の完全なスタックトレースを含めることができます。

`--throw-deprecation` コマンドラインフラグを使用して Node.js を起動すると、カスタムの非推奨警告が例外としてスローされます。

`--trace-deprecation` コマンドラインフラグを使用すると、カスタムの非推奨がスタックトレースとともに `stderr` に出力されます。

`--no-deprecation` コマンドラインフラグを使用すると、カスタムの非推奨のすべてのレポートが抑制されます。

`*-deprecation` コマンドラインフラグは、`'DeprecationWarning'` という名前を使用する警告にのみ影響します。


#### カスタム警告の発行 {#emitting-custom-warnings}

カスタムまたはアプリケーション固有の警告を発行するには、[`process.emitWarning()`](/ja/nodejs/api/process#processemitwarningwarning-type-code-ctor) メソッドを参照してください。

#### Node.js の警告名 {#nodejs-warning-names}

Node.js によって発行される警告の種類（`name` プロパティで識別される）に関する厳密なガイドラインはありません。 新しい種類の警告はいつでも追加できます。 最も一般的な警告の種類を以下に示します。

- `'DeprecationWarning'` - 非推奨の Node.js API または機能の使用を示します。 このような警告には、[非推奨コード](/ja/nodejs/api/deprecations) を識別する `'code'` プロパティを含める必要があります。
- `'ExperimentalWarning'` - 実験的な Node.js API または機能の使用を示します。 このような機能はいつでも変更される可能性があり、サポートされている機能と同じ厳格なセマンティックバージョニングおよび長期サポートポリシーの対象とならないため、注意して使用する必要があります。
- `'MaxListenersExceededWarning'` - 特定のイベントに対して過剰な数のリスナーが `EventEmitter` または `EventTarget` に登録されていることを示します。 これは多くの場合、メモリリークの兆候です。
- `'TimeoutOverflowWarning'` - 32 ビット符号付き整数に収まらない数値が `setTimeout()` または `setInterval()` 関数に提供されたことを示します。
- `'TimeoutNegativeWarning'` - 負の数が `setTimeout()` または `setInterval()` 関数に提供されたことを示します。
- `'TimeoutNaNWarning'` - 数値ではない値が `setTimeout()` または `setInterval()` 関数に提供されたことを示します。
- `'UnsupportedWarning'` - エラーとして扱われるのではなく、無視されるサポートされていないオプションまたは機能の使用を示します。 1つの例として、HTTP/2 互換性 API を使用する場合の HTTP レスポンスステータスメッセージの使用があります。

### イベント: `'worker'` {#event-worker}

**追加: v16.2.0, v14.18.0**

- `worker` [\<Worker\>](/ja/nodejs/api/worker_threads#class-worker) 作成された[\<Worker\>](/ja/nodejs/api/worker_threads#class-worker)。

`'worker'` イベントは、新しい[\<Worker\>](/ja/nodejs/api/worker_threads#class-worker)スレッドが作成された後に発行されます。


### シグナルイベント {#signal-events}

シグナルイベントは、Node.jsプロセスがシグナルを受信したときに発生します。標準的なPOSIXシグナル名（`'SIGINT'`、`'SIGHUP'`など）のリストについては、[`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7)を参照してください。

シグナルは[`Worker`](/ja/nodejs/api/worker_threads#class-worker)スレッドでは利用できません。

シグナルハンドラは、シグナルの名前（`'SIGINT'`、`'SIGTERM'`など）を最初の引数として受け取ります。

各イベントの名前は、シグナルの大文字の一般的な名前になります（例：`SIGINT`シグナルに対して`'SIGINT'`）。

::: code-group
```js [ESM]
import process from 'node:process';

// プロセスが終了しないように、stdinからの読み取りを開始します。
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// 複数のシグナルを処理するために単一の関数を使用する
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```

```js [CJS]
const process = require('node:process');

// プロセスが終了しないように、stdinからの読み取りを開始します。
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// 複数のシグナルを処理するために単一の関数を使用する
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```
:::

- `'SIGUSR1'`は、[デバッガー](/ja/nodejs/api/debugger)を起動するためにNode.jsによって予約されています。リスナーをインストールすることは可能ですが、デバッガーの動作を妨げる可能性があります。
- `'SIGTERM'`と`'SIGINT'`は、Windows以外のプラットフォームでは、コード`128 + シグナル番号`で終了する前にターミナルモードをリセットするデフォルトハンドラーを持っています。これらのシグナルのいずれかにリスナーがインストールされている場合、そのデフォルトの動作は削除されます（Node.jsはもはや終了しません）。
- `'SIGPIPE'`はデフォルトで無視されます。リスナーをインストールできます。
- `'SIGHUP'`は、コンソールウィンドウが閉じられたときにWindowsで生成され、他のプラットフォームではさまざまな同様の条件下で生成されます。[`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7)を参照してください。リスナーをインストールできますが、約10秒後にWindowsによってNode.jsは無条件に終了されます。Windows以外のプラットフォームでは、`SIGHUP`のデフォルトの動作はNode.jsを終了することですが、リスナーがインストールされると、そのデフォルトの動作は削除されます。
- `'SIGTERM'`はWindowsではサポートされていませんが、リッスンできます。
- ターミナルからの`'SIGINT'`はすべてのプラットフォームでサポートされており、通常は+で生成できます（ただし、これは構成可能な場合があります）。[ターミナルrawモード](/ja/nodejs/api/tty#readstreamsetrawmodemode)が有効になっている場合、+を使用しても生成されません。
- `'SIGBREAK'`は、+が押されるとWindowsで配信されます。Windows以外のプラットフォームでは、リッスンできますが、送信または生成する方法はありません。
- `'SIGWINCH'`は、コンソールのサイズが変更されたときに配信されます。Windowsでは、これはカーソルが移動されているときにコンソールに書き込む場合、または読み取り可能なttyがrawモードで使用されている場合にのみ発生します。
- `'SIGKILL'`はリスナーをインストールできず、すべてのプラットフォームでNode.jsを無条件に終了します。
- `'SIGSTOP'`はリスナーをインストールできません。
- [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2)を使用して人為的に発生させない場合、`'SIGBUS'`、`'SIGFPE'`、`'SIGSEGV'`、および`'SIGILL'`は、本質的にプロセスをJSリスナーを呼び出すことが安全ではない状態にします。そうすると、プロセスが応答しなくなる可能性があります。
- `0`は、プロセスの存在をテストするために送信できます。プロセスが存在する場合は効果がありませんが、プロセスが存在しない場合はエラーがスローされます。

Windowsはシグナルをサポートしていないため、シグナルによる終了に相当するものはありませんが、Node.jsは[`process.kill()`](/ja/nodejs/api/process#processkillpid-signal)と[`subprocess.kill()`](/ja/nodejs/api/child_process#subprocesskillsignal)によるエミュレーションを提供します。

- `SIGINT`、`SIGTERM`、および`SIGKILL`を送信すると、ターゲットプロセスが無条件に終了し、その後、サブプロセスはプロセスがシグナルによって終了したことを報告します。
- シグナル`0`を送信すると、プロセスの存在をテストするためのプラットフォームに依存しない方法として使用できます。


## `process.abort()` {#processabort}

**Added in: v0.7.0**

`process.abort()` メソッドは、Node.js プロセスを即座に終了させ、コアファイルを生成します。

この機能は、[`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドでは利用できません。

## `process.allowedNodeEnvironmentFlags` {#processallowednodeenvironmentflags}

**Added in: v10.10.0**

- [\<Set\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

`process.allowedNodeEnvironmentFlags` プロパティは、[`NODE_OPTIONS`](/ja/nodejs/api/cli#node_optionsoptions) 環境変数内で許可されているフラグの特別な読み取り専用の `Set` です。

`process.allowedNodeEnvironmentFlags` は `Set` を拡張していますが、いくつかの異なるフラグ表現を認識するために `Set.prototype.has` をオーバーライドしています。`process.allowedNodeEnvironmentFlags.has()` は、次の場合に `true` を返します。

- フラグは、先頭の単一 (`-`) または二重 (`--`) ダッシュを省略できます。例えば、`--inspect-brk` の場合は `inspect-brk`、`-r` の場合は `r` です。
- V8 に渡されるフラグ (`--v8-options` にリストされている) は、1 つ以上の *先頭以外の* ダッシュをアンダースコアに置き換えることができます。例えば、`--perf_basic_prof`、`--perf-basic-prof`、`--perf_basic-prof` などです。
- フラグには、1 つ以上のイコール (`=`) 文字を含めることができます。最初のイコール以降のすべての文字は無視されます。例えば、`--stack-trace-limit=100` です。
- フラグは、[`NODE_OPTIONS`](/ja/nodejs/api/cli#node_optionsoptions) 内で許可されている *必要があります*。

`process.allowedNodeEnvironmentFlags` を反復処理する場合、フラグは *1 回だけ* 表示されます。各フラグは、1 つ以上のダッシュで始まります。V8 に渡されるフラグには、先頭以外のダッシュの代わりにアンダースコアが含まれます。

::: code-group
```js [ESM]
import { allowedNodeEnvironmentFlags } from 'node:process';

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```

```js [CJS]
const { allowedNodeEnvironmentFlags } = require('node:process');

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```
:::

`process.allowedNodeEnvironmentFlags` の `add()`、`clear()`、および `delete()` メソッドは何も行わず、何もせずに失敗します。

Node.js が [`NODE_OPTIONS`](/ja/nodejs/api/cli#node_optionsoptions) のサポート *なしで* コンパイルされた場合 ([`process.config`](/ja/nodejs/api/process#processconfig) に表示)、`process.allowedNodeEnvironmentFlags` には *許可されているであろう* ものが含まれます。


## `process.arch` {#processarch}

**Added in: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js バイナリがコンパイルされたオペレーティングシステムの CPU アーキテクチャです。 使用可能な値は、`'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'`, および `'x64'` です。

::: code-group
```js [ESM]
import { arch } from 'node:process';

console.log(`This processor architecture is ${arch}`);
```

```js [CJS]
const { arch } = require('node:process');

console.log(`This processor architecture is ${arch}`);
```
:::

## `process.argv` {#processargv}

**Added in: v0.1.27**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.argv` プロパティは、Node.js プロセスの起動時に渡されたコマンドライン引数を含む配列を返します。 最初の要素は [`process.execPath`](/ja/nodejs/api/process#processexecpath) になります。 `argv[0]` の元の値へのアクセスが必要な場合は、`process.argv0` を参照してください。 2 番目の要素は、実行される JavaScript ファイルへのパスになります。 残りの要素は、追加のコマンドライン引数になります。

例えば、`process-args.js` の次のスクリプトを仮定します。

::: code-group
```js [ESM]
import { argv } from 'node:process';

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```

```js [CJS]
const { argv } = require('node:process');

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```
:::

Node.js プロセスを次のように起動します。

```bash [BASH]
node process-args.js one two=three four
```
次の出力が生成されます。

```text [TEXT]
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```
## `process.argv0` {#processargv0}

**Added in: v6.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.argv0` プロパティは、Node.js の起動時に渡された `argv[0]` の元の値の読み取り専用コピーを格納します。

```bash [BASH]
$ bash -c 'exec -a customArgv0 ./node'
> process.argv[0]
'/Volumes/code/external/node/out/Release/node'
> process.argv0
'customArgv0'
```

## `process.channel` {#processchannel}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v14.0.0 | このオブジェクトは、ネイティブの C++ バインディングを誤って公開しなくなりました。 |
| v7.1.0 | 追加: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Node.js プロセスが IPC チャネルで生成された場合 ( [Child Process](/ja/nodejs/api/child_process) のドキュメントを参照)、`process.channel` プロパティは IPC チャネルへの参照です。IPC チャネルが存在しない場合、このプロパティは `undefined` です。

### `process.channel.ref()` {#processchannelref}

**追加: v7.1.0**

このメソッドは、以前に `.unref()` が呼び出された場合に、IPC チャネルがプロセスのイベントループを実行し続けるようにします。

通常、これは `process` オブジェクトの `'disconnect'` および `'message'` リスナーの数によって管理されます。ただし、このメソッドを使用すると、特定の動作を明示的にリクエストできます。

### `process.channel.unref()` {#processchannelunref}

**追加: v7.1.0**

このメソッドは、IPC チャネルがプロセスのイベントループを実行し続けず、チャネルが開いている場合でも終了できるようにします。

通常、これは `process` オブジェクトの `'disconnect'` および `'message'` リスナーの数によって管理されます。ただし、このメソッドを使用すると、特定の動作を明示的にリクエストできます。

## `process.chdir(directory)` {#processchdirdirectory}

**追加: v0.1.17**

- `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.chdir()` メソッドは、Node.js プロセスの現在のワーキングディレクトリを変更するか、失敗した場合 (たとえば、指定された `directory` が存在しない場合) に例外をスローします。

::: code-group
```js [ESM]
import { chdir, cwd } from 'node:process';

console.log(`Starting directory: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`New directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```

```js [CJS]
const { chdir, cwd } = require('node:process');

console.log(`Starting directory: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`New directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```
:::

この機能は [`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドでは使用できません。


## `process.config` {#processconfig}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | `process.config` オブジェクトが freeze されました。 |
| v16.0.0 | process.config の変更は非推奨となりました。 |
| v0.7.7 | 追加: v0.7.7 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.config` プロパティは、現在の Node.js 実行ファイルのコンパイルに使用された設定オプションの JavaScript 表現を含む freeze された `Object` を返します。これは、`./configure` スクリプトの実行時に生成された `config.gypi` ファイルと同じです。

考えられる出力の例を次に示します。

```js [ESM]
{
  target_defaults:
   { cflags: [],
     default_configuration: 'Release',
     defines: [],
     include_dirs: [],
     libraries: [] },
  variables:
   {
     host_arch: 'x64',
     napi_build_version: 5,
     node_install_npm: 'true',
     node_prefix: '',
     node_shared_cares: 'false',
     node_shared_http_parser: 'false',
     node_shared_libuv: 'false',
     node_shared_zlib: 'false',
     node_use_openssl: 'true',
     node_shared_openssl: 'false',
     target_arch: 'x64',
     v8_use_snapshot: 1
   }
}
```
## `process.connected` {#processconnected}

**追加: v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Node.js プロセスが IPC チャネルで生成された場合（[子プロセス](/ja/nodejs/api/child_process)および[クラスタ](/ja/nodejs/api/cluster)ドキュメントを参照）、`process.connected` プロパティは IPC チャネルが接続されている限り `true` を返し、`process.disconnect()` が呼び出された後に `false` を返します。

`process.connected` が `false` になると、`process.send()` を使用して IPC チャネル経由でメッセージを送信することはできなくなります。

## `process.constrainedMemory()` {#processconstrainedmemory}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.0.0, v20.13.0 | 戻り値を `uv_get_constrained_memory` と一致させました。 |
| v19.6.0, v18.15.0 | 追加: v19.6.0, v18.15.0 |
:::

::: warning [安定性: 1 - 試験的]
[安定性: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

OS によって課せられた制限に基づいて、プロセスが利用できるメモリ量（バイト単位）を取得します。そのような制約がない場合、または制約が不明な場合は、`0` が返されます。

詳細については、[`uv_get_constrained_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_constrained_memory) を参照してください。


## `process.availableMemory()` {#processavailablememory}

**Added in: v22.0.0, v20.13.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

プロセスが使用できる空きメモリの量（バイト単位）を取得します。

詳細については、[`uv_get_available_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_available_memory)を参照してください。

## `process.cpuUsage([previousValue])` {#processcpuusagepreviousvalue}

**Added in: v6.1.0**

- `previousValue` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `process.cpuUsage()` を呼び出した前回の戻り値
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `system` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.cpuUsage()` メソッドは、現在のプロセスのユーザー CPU 時間とシステム CPU 時間の使用量を、`user` および `system` プロパティを持つオブジェクトで返します。これらの値はマイクロ秒単位（100 万分の 1 秒）です。 これらの値は、それぞれユーザー コードとシステム コードで費やされた時間を測定し、複数の CPU コアがこのプロセスのために作業を行っている場合、実際の経過時間よりも大きくなる可能性があります。

`process.cpuUsage()` の以前の呼び出しの結果を関数の引数として渡して、差分を取得できます。

::: code-group
```js [ESM]
import { cpuUsage } from 'node:process';

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// CPU を 500 ミリ秒スピンさせる
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```

```js [CJS]
const { cpuUsage } = require('node:process');

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// CPU を 500 ミリ秒スピンさせる
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```
:::


## `process.cwd()` {#processcwd}

**追加:** v0.1.8

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.cwd()` メソッドは、Node.js プロセスの現在の作業ディレクトリを返します。

::: code-group
```js [ESM]
import { cwd } from 'node:process';

console.log(`Current directory: ${cwd()}`);
```

```js [CJS]
const { cwd } = require('node:process');

console.log(`Current directory: ${cwd()}`);
```
:::

## `process.debugPort` {#processdebugport}

**追加:** v0.7.2

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

有効になっている場合、Node.js デバッガーで使用されるポート。

::: code-group
```js [ESM]
import process from 'node:process';

process.debugPort = 5858;
```

```js [CJS]
const process = require('node:process');

process.debugPort = 5858;
```
:::

## `process.disconnect()` {#processdisconnect}

**追加:** v0.7.2

Node.js プロセスが IPC チャネルを使用して生成された場合（[Child Process](/ja/nodejs/api/child_process) および [Cluster](/ja/nodejs/api/cluster) ドキュメントを参照）、`process.disconnect()` メソッドは、親プロセスへの IPC チャネルを閉じ、他にプロセスを存続させる接続がない場合に、子プロセスが正常に終了できるようにします。

`process.disconnect()` の呼び出しの効果は、親プロセスから [`ChildProcess.disconnect()`](/ja/nodejs/api/child_process#subprocessdisconnect) を呼び出すのと同じです。

Node.js プロセスが IPC チャネルを使用して生成されなかった場合、`process.disconnect()` は `undefined` になります。

## `process.dlopen(module, filename[, flags])` {#processdlopenmodule-filename-flags}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v9.0.0 | `flags` 引数のサポートが追加されました。 |
| v0.1.16 | 追加: v0.1.16 |
:::

- `module` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<os.constants.dlopen\>](/ja/nodejs/api/os#dlopen-constants) **デフォルト:** `os.constants.dlopen.RTLD_LAZY`

`process.dlopen()` メソッドを使用すると、共有オブジェクトを動的にロードできます。 これは主に `require()` で C++ アドオンをロードするために使用され、特別な場合を除いて直接使用するべきではありません。 言い換えれば、カスタム dlopen フラグや ES モジュールからのロードなどの特定の理由がない限り、[`require()`](/ja/nodejs/api/globals#require) を `process.dlopen()` より優先する必要があります。

`flags` 引数は、dlopen の動作を指定できる整数です。 詳細については、[`os.constants.dlopen`](/ja/nodejs/api/os#dlopen-constants) ドキュメントを参照してください。

`process.dlopen()` を呼び出す際の重要な要件は、`module` インスタンスを渡す必要があることです。 C++ アドオンによってエクスポートされた関数は、`module.exports` を介してアクセスできるようになります。

以下の例は、`foo` 関数をエクスポートする `local.node` という名前の C++ アドオンをロードする方法を示しています。 `RTLD_NOW` 定数を渡すことによって、呼び出しが返される前にすべてのシンボルがロードされます。 この例では、定数が利用可能であると想定されています。

::: code-group
```js [ESM]
import { dlopen } from 'node:process';
import { constants } from 'node:os';
import { fileURLToPath } from 'node:url';

const module = { exports: {} };
dlopen(module, fileURLToPath(new URL('local.node', import.meta.url)),
       constants.dlopen.RTLD_NOW);
module.exports.foo();
```

```js [CJS]
const { dlopen } = require('node:process');
const { constants } = require('node:os');
const { join } = require('node:path');

const module = { exports: {} };
dlopen(module, join(__dirname, 'local.node'), constants.dlopen.RTLD_NOW);
module.exports.foo();
```
:::


## `process.emitWarning(warning[, options])` {#processemitwarningwarning-options}

**Added in: v8.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 発行する警告。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `warning` が `String` の場合、`type` は発行される警告の *種類* に使用される名前です。**デフォルト:** `'Warning'`。
    - `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 発行される警告インスタンスの一意の識別子。
    - `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `warning` が `String` の場合、`ctor` は生成されたスタックトレースを制限するために使用されるオプションの関数です。**デフォルト:** `process.emitWarning`。
    - `detail` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) エラーに含める追加のテキスト。

`process.emitWarning()` メソッドは、カスタムまたはアプリケーション固有のプロセス警告を発行するために使用できます。 これらは、[`'warning'`](/ja/nodejs/api/process#event-warning) イベントにハンドラを追加することでリッスンできます。

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// コードと詳細を追加して警告を発行します。
emitWarning('Something happened!', {
  code: 'MY_WARNING',
  detail: 'This is some additional information',
});
// 発行:
// (node:56338) [MY_WARNING] Warning: Something happened!
// This is some additional information
```

```js [CJS]
const { emitWarning } = require('node:process');

// コードと詳細を追加して警告を発行します。
emitWarning('Something happened!', {
  code: 'MY_WARNING',
  detail: 'This is some additional information',
});
// 発行:
// (node:56338) [MY_WARNING] Warning: Something happened!
// This is some additional information
```
:::

この例では、`Error` オブジェクトは `process.emitWarning()` によって内部的に生成され、[`'warning'`](/ja/nodejs/api/process#event-warning) ハンドラに渡されます。

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Something happened!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // スタックトレース
  console.warn(warning.detail);  // 'This is some additional information'
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Something happened!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // スタックトレース
  console.warn(warning.detail);  // 'This is some additional information'
});
```
:::

`warning` が `Error` オブジェクトとして渡された場合、`options` 引数は無視されます。


## `process.emitWarning(warning[, type[, code]][, ctor])` {#processemitwarningwarning-type-code-ctor}

**Added in: v6.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 発行する警告。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `warning` が `String` の場合、`type` は発行される警告の *type* に使用する名前です。**デフォルト:** `'Warning'`。
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 発行される警告インスタンスの一意の識別子。
- `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `warning` が `String` の場合、`ctor` は生成されたスタックトレースを制限するために使用されるオプションの関数です。 **デフォルト:** `process.emitWarning`。

`process.emitWarning()` メソッドは、カスタムまたはアプリケーション固有のプロセスの警告を発行するために使用できます。 これらは、[`'warning'`](/ja/nodejs/api/process#event-warning) イベントにハンドラーを追加することでリッスンできます。

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// 文字列を使用して警告を発行します。
emitWarning('Something happened!');
// 出力: (node: 56338) Warning: Something happened!
```

```js [CJS]
const { emitWarning } = require('node:process');

// 文字列を使用して警告を発行します。
emitWarning('Something happened!');
// 出力: (node: 56338) Warning: Something happened!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// 文字列と種類を使用して警告を発行します。
emitWarning('Something Happened!', 'CustomWarning');
// 出力: (node:56338) CustomWarning: Something Happened!
```

```js [CJS]
const { emitWarning } = require('node:process');

// 文字列と種類を使用して警告を発行します。
emitWarning('Something Happened!', 'CustomWarning');
// 出力: (node:56338) CustomWarning: Something Happened!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

emitWarning('Something happened!', 'CustomWarning', 'WARN001');
// 出力: (node:56338) [WARN001] CustomWarning: Something happened!
```

```js [CJS]
const { emitWarning } = require('node:process');

process.emitWarning('Something happened!', 'CustomWarning', 'WARN001');
// 出力: (node:56338) [WARN001] CustomWarning: Something happened!
```
:::

上記の各例では、`Error` オブジェクトが `process.emitWarning()` によって内部的に生成され、[`'warning'`](/ja/nodejs/api/process#event-warning) ハンドラーに渡されます。

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```
:::

`warning` が `Error` オブジェクトとして渡された場合、変更されずに `'warning'` イベントハンドラーに渡されます（そして、オプションの `type`、`code`、および `ctor` 引数は無視されます）。

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Errorオブジェクトを使用して警告を発行します。
const myWarning = new Error('Something happened!');
// Errorのnameプロパティを使用して型の名前を指定します。
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// 出力: (node:56338) [WARN001] CustomWarning: Something happened!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Errorオブジェクトを使用して警告を発行します。
const myWarning = new Error('Something happened!');
// Errorのnameプロパティを使用して型の名前を指定します。
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// 出力: (node:56338) [WARN001] CustomWarning: Something happened!
```
:::

`warning` が文字列または `Error` オブジェクト以外のものの場合、`TypeError` がスローされます。

プロセスの警告は `Error` オブジェクトを使用しますが、プロセスの警告メカニズムは通常のエラー処理メカニズムの代替**ではありません**。

警告の `type` が `'DeprecationWarning'` の場合は、次の追加処理が実装されます。

- `--throw-deprecation` コマンドラインフラグが使用されている場合、非推奨の警告はイベントとして発行されるのではなく、例外としてスローされます。
- `--no-deprecation` コマンドラインフラグが使用されている場合、非推奨の警告は抑制されます。
- `--trace-deprecation` コマンドラインフラグが使用されている場合、非推奨の警告は完全なスタックトレースとともに `stderr` に出力されます。


### 重複警告の回避 {#avoiding-duplicate-warnings}

ベストプラクティスとして、警告はプロセスごとに一度だけ出力されるべきです。そのためには、`emitWarning()` をブール値の背後に配置します。

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// 出力: (node: 56339) Warning: Only warn once!
emitMyWarning();
// 何も出力しない
```

```js [CJS]
const { emitWarning } = require('node:process');

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// 出力: (node: 56339) Warning: Only warn once!
emitMyWarning();
// 何も出力しない
```
:::

## `process.env` {#processenv}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v11.14.0 | Workerスレッドはデフォルトで親スレッドの `process.env` のコピーを使用するようになりました。これは `Worker` コンストラクタの `env` オプションで設定可能です。 |
| v10.0.0 | 変数値の文字列への暗黙的な変換は非推奨になりました。 |
| v0.1.27 | v0.1.27 で追加 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.env` プロパティは、ユーザー環境を含むオブジェクトを返します。[`environ(7)`](http://man7.org/linux/man-pages/man7/environ.7) を参照してください。

このオブジェクトの例は次のようになります。

```js [ESM]
{
  TERM: 'xterm-256color',
  SHELL: '/usr/local/bin/bash',
  USER: 'maciej',
  PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
  PWD: '/Users/maciej',
  EDITOR: 'vim',
  SHLVL: '1',
  HOME: '/Users/maciej',
  LOGNAME: 'maciej',
  _: '/usr/local/bin/node'
}
```
このオブジェクトを変更することは可能ですが、そのような変更はNode.jsプロセスの外部、または（明示的に要求されない限り）他の [`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドには反映されません。言い換えれば、次の例は動作しません。

```bash [BASH]
node -e 'process.env.foo = "bar"' && echo $foo
```
ただし、以下は動作します。

::: code-group
```js [ESM]
import { env } from 'node:process';

env.foo = 'bar';
console.log(env.foo);
```

```js [CJS]
const { env } = require('node:process');

env.foo = 'bar';
console.log(env.foo);
```
:::

`process.env` にプロパティを割り当てると、値は暗黙的に文字列に変換されます。**この動作は非推奨です。** Node.jsの将来のバージョンでは、値が文字列、数値、またはブール値でない場合にエラーをスローする可能性があります。

::: code-group
```js [ESM]
import { env } from 'node:process';

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```

```js [CJS]
const { env } = require('node:process');

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```
:::

`process.env` からプロパティを削除するには `delete` を使用します。

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```
:::

Windowsオペレーティングシステムでは、環境変数は大文字と小文字を区別しません。

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
console.log(env.test);
// => 1
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
console.log(env.test);
// => 1
```
:::

[`Worker`](/ja/nodejs/api/worker_threads#class-worker) インスタンスを作成するときに明示的に指定しない限り、各 [`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドは、親スレッドの `process.env` に基づいた、または [`Worker`](/ja/nodejs/api/worker_threads#class-worker) コンストラクタへの `env` オプションとして指定されたものの、独自の `process.env` のコピーを持ちます。`process.env` への変更は [`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッド間で表示されず、オペレーティングシステムまたはネイティブアドオンに表示される変更を行うことができるのはメインスレッドのみです。Windowsでは、[`Worker`](/ja/nodejs/api/worker_threads#class-worker)インスタンス上の `process.env` のコピーは、メインスレッドとは異なり、大文字と小文字を区別して動作します。


## `process.execArgv` {#processexecargv}

**Added in: v0.7.7**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.execArgv` プロパティは、Node.js プロセスの起動時に渡された Node.js 固有のコマンドラインオプションのセットを返します。これらのオプションは、[`process.argv`](/ja/nodejs/api/process#processargv) プロパティによって返される配列には表示されず、Node.js 実行可能ファイル、スクリプト名、またはスクリプト名の後に続くオプションは含まれません。これらのオプションは、親プロセスと同じ実行環境で子プロセスを生成するために役立ちます。

```bash [BASH]
node --icu-data-dir=./foo --require ./bar.js script.js --version
```
`process.execArgv` の結果:

```json [JSON]
["--icu-data-dir=./foo", "--require", "./bar.js"]
```
そして `process.argv`:

```js [ESM]
['/usr/local/bin/node', 'script.js', '--version']
```
このプロパティを持つワーカーースレッドの詳細な動作については、[`Worker` constructor](/ja/nodejs/api/worker_threads#new-workerfilename-options) を参照してください。

## `process.execPath` {#processexecpath}

**Added in: v0.1.100**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.execPath` プロパティは、Node.js プロセスを開始した実行可能ファイルの絶対パス名を返します。シンボリックリンクがある場合は解決されます。

```js [ESM]
'/usr/local/bin/node'
```
## `process.exit([code])` {#processexitcode}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0 | 数値型、または整数を表す文字列型の場合のみコードを受け入れます。 |
| v0.1.13 | Added in: v0.1.13 |
:::

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 終了コード。文字列型の場合、整数文字列（例：'1'）のみが許可されます。**デフォルト:** `0`。

`process.exit()` メソッドは、終了ステータス `code` で Node.js にプロセスを同期的に終了するように指示します。`code` が省略された場合、exit は 'success' コード `0` か、設定されている場合は `process.exitCode` の値を使用します。Node.js は、すべての [`'exit'`](/ja/nodejs/api/process#event-exit) イベントリスナーが呼び出されるまで終了しません。

'failure' コードで終了するには:

::: code-group
```js [ESM]
import { exit } from 'node:process';

exit(1);
```

```js [CJS]
const { exit } = require('node:process');

exit(1);
```
:::

Node.js を実行したシェルは、終了コードを `1` と見なすはずです。

`process.exit()` を呼び出すと、`process.stdout` および `process.stderr` への I/O 操作を含め、まだ完全に完了していない保留中の非同期操作がある場合でも、プロセスが可能な限り迅速に終了します。

ほとんどの場合、`process.exit()` を明示的に呼び出す必要はありません。Node.js プロセスは、イベントループで *追加の作業が保留されていない場合* に自動的に終了します。`process.exitCode` プロパティを設定して、プロセスが正常に終了するときに使用する終了コードをプロセスに伝えることができます。

たとえば、次の例は、stdout に出力されたデータが切り捨てられて失われる可能性がある `process.exit()` メソッドの *誤用* を示しています。

::: code-group
```js [ESM]
import { exit } from 'node:process';

// これは *しない* ことの例です。
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```

```js [CJS]
const { exit } = require('node:process');

// これは *しない* ことの例です。
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```
:::

これが問題なのは、Node.js での `process.stdout` への書き込みが *非同期* であり、Node.js イベントループの複数のティックにわたって発生する可能性があるためです。ただし、`process.exit()` を呼び出すと、プロセスは stdout への追加の書き込みが実行される *前に* 終了します。

`process.exit()` を直接呼び出すのではなく、コードは `process.exitCode` を設定し、イベントループの追加の作業のスケジュールを回避することで、プロセスが自然に終了するようにする必要があります。

::: code-group
```js [ESM]
import process from 'node:process';

// 終了コードを適切に設定し、
// プロセスが正常に終了できるようにする方法。
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```

```js [CJS]
const process = require('node:process');

// 終了コードを適切に設定し、
// プロセスが正常に終了できるようにする方法。
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```
:::

エラー状態のために Node.js プロセスを終了する必要がある場合は、*キャッチされない* エラーをスローし、プロセスがそれに応じて終了できるようにする方が、`process.exit()` を呼び出すよりも安全です。

[`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドでは、この関数は現在のプロセスではなく、現在のスレッドを停止します。


## `process.exitCode` {#processexitcode_1}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v20.0.0 | number 型、または整数を表す文字列型のみがコードとして許可されるようになりました。 |
| v0.11.8 | 追加: v0.11.8 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 終了コード。 文字列型の場合、整数の文字列 (例: '1') のみが許可されます。 **デフォルト:** `undefined`。

プロセスが正常に終了するか、コードを指定せずに [`process.exit()`](/ja/nodejs/api/process#processexitcode) で終了した場合の、プロセスの終了コードとなる数値です。

[`process.exit(code)`](/ja/nodejs/api/process#processexitcode) にコードを指定すると、以前に設定された `process.exitCode` が上書きされます。

## `process.features.cached_builtins` {#processfeaturescached_builtins}

**追加: v12.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

現在の Node.js ビルドが組み込みモジュールをキャッシュしている場合は `true` であるブール値。

## `process.features.debug` {#processfeaturesdebug}

**追加: v0.5.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

現在の Node.js ビルドがデバッグビルドである場合は `true` であるブール値。

## `process.features.inspector` {#processfeaturesinspector}

**追加: v11.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

現在の Node.js ビルドにインスペクターが含まれている場合は `true` であるブール値。

## `process.features.ipv6` {#processfeaturesipv6}

**追加: v0.5.3**

**非推奨: v23.4.0**

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨。 このプロパティは常に true であり、これに基づくチェックは冗長です。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

現在の Node.js ビルドに IPv6 のサポートが含まれている場合は `true` であるブール値。

すべての Node.js ビルドに IPv6 のサポートが含まれているため、この値は常に `true` です。


## `process.features.require_module` {#processfeaturesrequire_module}

**Added in: v23.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

現在の Node.js ビルドが[`require()` を使用した ECMAScript モジュールの読み込み](/ja/nodejs/api/modules#loading-ecmascript-modules-using-require)をサポートしている場合、`true` である boolean 値です。

## `process.features.tls` {#processfeaturestls}

**Added in: v0.5.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

現在の Node.js ビルドに TLS のサポートが含まれている場合、`true` である boolean 値です。

## `process.features.tls_alpn` {#processfeaturestls_alpn}

**Added in: v4.8.0**

**Deprecated since: v23.4.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨。 代わりに `process.features.tls` を使用してください。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

現在の Node.js ビルドに TLS での ALPN のサポートが含まれている場合、`true` である boolean 値です。

Node.js 11.0.0 以降のバージョンでは、OpenSSL 依存関係の機能は無条件の ALPN サポートを備えています。 したがって、この値は `process.features.tls` の値と同じです。

## `process.features.tls_ocsp` {#processfeaturestls_ocsp}

**Added in: v0.11.13**

**Deprecated since: v23.4.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨。 代わりに `process.features.tls` を使用してください。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

現在の Node.js ビルドに TLS での OCSP のサポートが含まれている場合、`true` である boolean 値です。

Node.js 11.0.0 以降のバージョンでは、OpenSSL 依存関係の機能は無条件の OCSP サポートを備えています。 したがって、この値は `process.features.tls` の値と同じです。

## `process.features.tls_sni` {#processfeaturestls_sni}

**Added in: v0.5.3**

**Deprecated since: v23.4.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨。 代わりに `process.features.tls` を使用してください。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

現在の Node.js ビルドに TLS での SNI のサポートが含まれている場合、`true` である boolean 値です。

Node.js 11.0.0 以降のバージョンでは、OpenSSL 依存関係の機能は無条件の SNI サポートを備えています。 したがって、この値は `process.features.tls` の値と同じです。


## `process.features.typescript` {#processfeaturestypescript}

**追加:** v23.0.0

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js が `--experimental-strip-types` で実行されている場合は `"strip"`、Node.js が `--experimental-transform-types` で実行されている場合は `"transform"`、それ以外の場合は `false` の値です。

## `process.features.uv` {#processfeaturesuv}

**追加:** v0.5.3

**非推奨:** v23.4.0 以降

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定版: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨。 このプロパティは常に true であり、これに基づくチェックは冗長です。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

現在の Node.js ビルドに libuv のサポートが含まれている場合は `true` のブール値。

libuv なしで Node.js をビルドすることはできないため、この値は常に `true` です。

## `process.finalization.register(ref, callback)` {#processfinalizationregisterref-callback}

**追加:** v22.5.0

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) トラッキングされているリソースへの参照。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) リソースがファイナライズされるときに呼び出されるコールバック関数。
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) トラッキングされているリソースへの参照。
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ファイナライズをトリガーしたイベント。 デフォルトは 'exit'。

この関数は、`ref` オブジェクトがガベージコレクションされなかった場合に、プロセスが `exit` イベントを発生させたときに呼び出されるコールバックを登録します。 オブジェクト `ref` が `exit` イベントが発生する前にガベージコレクションされた場合、コールバックはファイナライズレジストリから削除され、プロセスの終了時に呼び出されません。

コールバック内では、`ref` オブジェクトによって割り当てられたリソースを解放できます。 `beforeExit` イベントに適用されるすべての制限が `callback` 関数にも適用されることに注意してください。つまり、特別な状況下ではコールバックが呼び出されない可能性があります。

この関数のアイデアは、プロセスが終了を開始するときにリソースを解放するのに役立つだけでなく、オブジェクトが使用されなくなった場合はガベージコレクションされるようにすることです。

たとえば、バッファーを含むオブジェクトを登録できます。プロセスの終了時にそのバッファーが確実に解放されるようにしたいとします。ただし、オブジェクトがプロセスの終了前にガベージコレクションされた場合は、バッファーを解放する必要がなくなるため、この場合は、ファイナライズレジストリからコールバックを削除するだけです。

::: code-group
```js [CJS]
const { finalization } = require('node:process');

// finalization.register() に渡される関数が
// 不要なオブジェクトのクロージャを作成しないようにしてください。
function onFinalize(obj, event) {
  // オブジェクトで好きなことを実行できます
  obj.dispose();
}

function setup() {
  // このオブジェクトは安全にガベージコレクションできます。
  // 結果として得られるシャットダウン関数は呼び出されません。
  // リークはありません。
  const myDisposableObject = {
    dispose() {
      // リソースを同期的に解放します
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// finalization.register() に渡される関数が
// 不要なオブジェクトのクロージャを作成しないようにしてください。
function onFinalize(obj, event) {
  // オブジェクトで好きなことを実行できます
  obj.dispose();
}

function setup() {
  // このオブジェクトは安全にガベージコレクションできます。
  // 結果として得られるシャットダウン関数は呼び出されません。
  // リークはありません。
  const myDisposableObject = {
    dispose() {
      // リソースを同期的に解放します
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```
:::

上記のコードは、次の前提に基づいています。

- アロー関数は避ける
- 通常の関数はグローバルコンテキスト (ルート) 内にあることが推奨されます

通常の関数は、`obj` が存在するコンテキストを参照する *可能性* があり、`obj` がガベージコレクション可能にならない可能性があります。

アロー関数は以前のコンテキストを保持します。 たとえば、次のようにします。

```js [ESM]
class Test {
  constructor() {
    finalization.register(this, (ref) => ref.dispose());

    // これのようなものでも非常に推奨されません
    // finalization.register(this, () => this.dispose());
  }
  dispose() {}
}
```

このオブジェクトがガベージコレクションされる可能性は非常に低い (不可能ではない) ですが、ガベージコレクションされない場合は、`process.exit` が呼び出されたときに `dispose` が呼び出されます。

コールバックがすべての状況下で呼び出されるとは限らないため、重要なリソースの破棄のためにこの機能に依存することは避けてください。


## `process.finalization.registerBeforeExit(ref, callback)` {#processfinalizationregisterbeforeexitref-callback}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - Active Development
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) トラッキングされているリソースへの参照。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) リソースがファイナライズされるときに呼び出されるコールバック関数。
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) トラッキングされているリソースへの参照。
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ファイナライズをトリガーしたイベント。 デフォルトは 'beforeExit' です。

この関数は `register` とまったく同じように動作しますが、`ref` オブジェクトがガベージコレクションされなかった場合に、プロセスが `beforeExit` イベントを発行するときにコールバックが呼び出される点が異なります。

`beforeExit` イベントに適用されるすべての制限が `callback` 関数にも適用されることに注意してください。これは、特別な状況下ではコールバックが呼び出されない可能性があることを意味します。

## `process.finalization.unregister(ref)` {#processfinalizationunregisterref}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - Active Development
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 以前に登録されたリソースへの参照。

この関数はファイナライゼーションレジストリからオブジェクトの登録を削除するため、コールバックはもう呼び出されません。

::: code-group
```js [CJS]
const { finalization } = require('node:process');

// finalization.register() に渡される関数が、
// 不必要なオブジェクトの周りにクロージャーを作成しないようにしてください。
function onFinalize(obj, event) {
  // オブジェクトを使って好きなことができます
  obj.dispose();
}

function setup() {
  // このオブジェクトは安全にガベージコレクションでき、
  // 結果として得られるシャットダウン関数は呼び出されません。
  // リークはありません。
  const myDisposableObject = {
    dispose() {
      // リソースを同期的に解放します
    },
  };

  finalization.register(myDisposableObject, onFinalize);

  // 何かする

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// finalization.register() に渡される関数が、
// 不必要なオブジェクトの周りにクロージャーを作成しないようにしてください。
function onFinalize(obj, event) {
  // オブジェクトを使って好きなことができます
  obj.dispose();
}

function setup() {
  // このオブジェクトは安全にガベージコレクションでき、
  // 結果として得られるシャットダウン関数は呼び出されません。
  // リークはありません。
  const myDisposableObject = {
    dispose() {
      // リソースを同期的に解放します
    },
  };

  // finalization.register() に渡される関数が、
  // 不必要なオブジェクトの周りにクロージャーを作成しないようにしてください。
  function onFinalize(obj, event) {
    // オブジェクトを使って好きなことができます
    obj.dispose();
  }

  finalization.register(myDisposableObject, onFinalize);

  // 何かする

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```
:::


## `process.getActiveResourcesInfo()` {#processgetactiveresourcesinfo}

**Added in: v17.3.0, v16.14.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.getActiveResourcesInfo()` メソッドは、現在イベントループを稼働させているアクティブなリソースのタイプを含む文字列の配列を返します。

::: code-group
```js [ESM]
import { getActiveResourcesInfo } from 'node:process';
import { setTimeout } from 'node:timers';

console.log('Before:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('After:', getActiveResourcesInfo());
// Prints:
//   Before: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   After: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```

```js [CJS]
const { getActiveResourcesInfo } = require('node:process');
const { setTimeout } = require('node:timers');

console.log('Before:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('After:', getActiveResourcesInfo());
// Prints:
//   Before: [ 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   After: [ 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```
:::

## `process.getBuiltinModule(id)` {#processgetbuiltinmoduleid}

**Added in: v22.3.0, v20.16.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要求されている組み込みモジュールの ID。
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`process.getBuiltinModule(id)` は、グローバルに利用可能な関数で組み込みモジュールをロードする方法を提供します。 他の環境をサポートする必要がある ES モジュールは、これを使用して、Node.js で実行されているときに Node.js 組み込みモジュールを条件付きでロードできます。これにより、非 Node.js 環境で `import` によってスローされる可能性のある解決エラーに対処したり、モジュールを非同期モジュールに変換したり、同期 API を非同期 API に変換したりする動的 `import()` を使用したりする必要がなくなります。

```js [ESM]
if (globalThis.process?.getBuiltinModule) {
  // Node.js で実行する場合、Node.js fs モジュールを使用します。
  const fs = globalThis.process.getBuiltinModule('fs');
  // ユーザーモジュールをロードするために `require()` が必要な場合は、createRequire() を使用します
  const module = globalThis.process.getBuiltinModule('module');
  const require = module.createRequire(import.meta.url);
  const foo = require('foo');
}
```
`id` が現在の Node.js プロセスで使用可能な組み込みモジュールを指定する場合、`process.getBuiltinModule(id)` メソッドは、対応する組み込みモジュールを返します。 `id` が組み込みモジュールに対応しない場合、`undefined` が返されます。

`process.getBuiltinModule(id)` は、[`module.isBuiltin(id)`](/ja/nodejs/api/module#moduleisbuiltinmodulename) によって認識される組み込みモジュール ID を受け入れます。 一部の組み込みモジュールは、`node:` プレフィックスを付けてロードする必要があります。[`node:` プレフィックスが必須の組み込みモジュール](/ja/nodejs/api/modules#built-in-modules-with-mandatory-node-prefix) を参照してください。 ユーザーが [`require.cache`](/ja/nodejs/api/modules#requirecache) を変更して `require(id)` が別のものを返すようにしても、`process.getBuiltinModule(id)` によって返される参照は、常に `id` に対応する組み込みモジュールを指します。


## `process.getegid()` {#processgetegid}

**Added in: v2.0.0**

`process.getegid()` メソッドは、Node.js プロセスの数値的な実効グループ ID を返します。（[`getegid(2)`](http://man7.org/linux/man-pages/man2/getegid.2) を参照してください。）

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid) {
  console.log(`Current gid: ${process.getegid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid) {
  console.log(`Current gid: ${process.getegid()}`);
}
```
:::

この関数は、POSIX プラットフォーム（つまり、Windows または Android ではない）でのみ利用可能です。

## `process.geteuid()` {#processgeteuid}

**Added in: v2.0.0**

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.geteuid()` メソッドは、プロセスの数値的な実効ユーザー ID を返します。（[`geteuid(2)`](http://man7.org/linux/man-pages/man2/geteuid.2) を参照してください。）

::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
}
```
:::

この関数は、POSIX プラットフォーム（つまり、Windows または Android ではない）でのみ利用可能です。

## `process.getgid()` {#processgetgid}

**Added in: v0.1.31**

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.getgid()` メソッドは、プロセスの数値的なグループ ID を返します。（[`getgid(2)`](http://man7.org/linux/man-pages/man2/getgid.2) を参照してください。）

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid) {
  console.log(`Current gid: ${process.getgid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid) {
  console.log(`Current gid: ${process.getgid()}`);
}
```
:::

この関数は、POSIX プラットフォーム（つまり、Windows または Android ではない）でのみ利用可能です。

## `process.getgroups()` {#processgetgroups}

**Added in: v0.9.4**

- 戻り値: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.getgroups()` メソッドは、補助グループ ID の配列を返します。POSIX は、実効グループ ID が含まれているかどうかを指定していませんが、Node.js は常に含まれるようにしています。

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```
:::

この関数は、POSIX プラットフォーム（つまり、Windows または Android ではない）でのみ利用可能です。


## `process.getuid()` {#processgetuid}

**Added in: v0.1.28**

- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.getuid()` メソッドは、プロセスの数値ユーザIDを返します。( [`getuid(2)`](http://man7.org/linux/man-pages/man2/getuid.2) を参照してください。)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid) {
  console.log(`Current uid: ${process.getuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid) {
  console.log(`Current uid: ${process.getuid()}`);
}
```
:::

この関数は、POSIXプラットフォームでのみ利用可能です(つまり、WindowsまたはAndroidではありません)。

## `process.hasUncaughtExceptionCaptureCallback()` {#processhasuncaughtexceptioncapturecallback}

**Added in: v9.3.0**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`process.setUncaughtExceptionCaptureCallback()`](/ja/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) を使用してコールバックが設定されているかどうかを示します。

## `process.hrtime([time])` {#processhrtimetime}

**Added in: v0.7.6**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ja/nodejs/api/documentation#stability-index) [Stability: 3](/ja/nodejs/api/documentation#stability-index) - Legacy. 代わりに [`process.hrtime.bigint()`](/ja/nodejs/api/process#processhrtimebigint) を使用してください。
:::

- `time` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `process.hrtime()` の以前の呼び出しの結果
- 戻り値: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

これは、JavaScriptに `bigint` が導入される前の、[`process.hrtime.bigint()`](/ja/nodejs/api/process#processhrtimebigint) のレガシーバージョンです。

`process.hrtime()` メソッドは、現在の高分解能の実時間を `[seconds, nanoseconds]` タプルの `Array` で返します。ここで、`nanoseconds` は、秒精度で表現できない実時間の残りの部分です。

`time` はオプションのパラメータであり、現在の時間との差分をとるために、以前の `process.hrtime()` の呼び出しの結果でなければなりません。 渡されたパラメータがタプルの `Array` でない場合、`TypeError` がスローされます。 以前の `process.hrtime()` の呼び出しの結果ではなく、ユーザ定義の配列を渡すと、未定義の動作につながります。

これらの時間は過去の任意の時間からの相対時間であり、時刻とは関係がないため、クロックドリフトの影響を受けません。 主な用途は、間隔間のパフォーマンスを測定することです。

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  // Benchmark took 1000000552 nanoseconds
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  // Benchmark took 1000000552 nanoseconds
}, 1000);
```
:::


## `process.hrtime.bigint()` {#processhrtimebigint}

**Added in: v10.7.0**

- 戻り値: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

[`process.hrtime()`](/ja/nodejs/api/process#processhrtimetime) メソッドの `bigint` バージョンであり、現在の高分解能の実時間をナノ秒単位で `bigint` として返します。

[`process.hrtime()`](/ja/nodejs/api/process#processhrtimetime) とは異なり、差は 2 つの `bigint` の減算によって直接計算できるため、追加の `time` 引数はサポートされていません。

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```
:::

## `process.initgroups(user, extraGroup)` {#processinitgroupsuser-extragroup}

**Added in: v0.9.4**

- `user` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ユーザー名または数値識別子。
- `extraGroup` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) グループ名または数値識別子。

`process.initgroups()` メソッドは `/etc/group` ファイルを読み取り、ユーザーがメンバーであるすべてのグループを使用して、グループアクセスリストを初期化します。 これは、Node.js プロセスが `root` アクセス権または `CAP_SETGID` ケーパビリティを持っている必要がある特権操作です。

特権を削除するときは注意してください。

::: code-group
```js [ESM]
import { getgroups, initgroups, setgid } from 'node:process';

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```

```js [CJS]
const { getgroups, initgroups, setgid } = require('node:process');

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```
:::

この関数は、POSIX プラットフォーム (つまり、Windows または Android ではない) でのみ使用できます。 この機能は [`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドでは利用できません。


## `process.kill(pid[, signal])` {#processkillpid-signal}

**Added in: v0.0.6**

- `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセス ID
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 送信するシグナル。文字列または数値で指定します。**デフォルト:** `'SIGTERM'`。

`process.kill()` メソッドは、`pid` によって識別されるプロセスに `signal` を送信します。

シグナル名は `'SIGINT'` や `'SIGHUP'` のような文字列です。詳細は[シグナルイベント](/ja/nodejs/api/process#signal-events)と[`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2)を参照してください。

このメソッドは、ターゲットの `pid` が存在しない場合、エラーを投げます。特別なケースとして、シグナル `0` を使用して、プロセスの存在をテストできます。Windows プラットフォームでは、`pid` がプロセスグループを kill するために使用される場合、エラーを投げます。

この関数の名前は `process.kill()` ですが、実際には `kill` システムコールのようなシグナル送信機にすぎません。送信されたシグナルは、ターゲットプロセスを kill する以外のことを行う場合があります。

::: code-group
```js [ESM]
import process, { kill } from 'node:process';

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

kill(process.pid, 'SIGHUP');
```

```js [CJS]
const process = require('node:process');

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

process.kill(process.pid, 'SIGHUP');
```
:::

Node.js プロセスが `SIGUSR1` を受信すると、Node.js はデバッガーを起動します。 [シグナルイベント](/ja/nodejs/api/process#signal-events) を参照してください。

## `process.loadEnvFile(path)` {#processloadenvfilepath}

**Added in: v21.7.0, v20.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type). **デフォルト:** `'./.env'`

`.env` ファイルを `process.env` にロードします。 `.env` ファイルでの `NODE_OPTIONS` の使用は Node.js に影響を与えません。

::: code-group
```js [CJS]
const { loadEnvFile } = require('node:process');
loadEnvFile();
```

```js [ESM]
import { loadEnvFile } from 'node:process';
loadEnvFile();
```
:::


## `process.mainModule` {#processmainmodule}

**追加:** v0.1.17

**非推奨:** v14.0.0 以降

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定版: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに [`require.main`](/ja/nodejs/api/modules#accessing-the-main-module) を使用してください。
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.mainModule` プロパティは、[`require.main`](/ja/nodejs/api/modules#accessing-the-main-module) を取得する別の方法を提供します。 違いは、メインモジュールが実行時に変更された場合、[`require.main`](/ja/nodejs/api/modules#accessing-the-main-module) は、変更が発生する前に require されたモジュール内の元のメインモジュールを参照し続ける可能性があることです。 一般に、これら 2 つが同じモジュールを参照していると想定しても安全です。

[`require.main`](/ja/nodejs/api/modules#accessing-the-main-module) と同様に、エントリスクリプトがない場合、`process.mainModule` は `undefined` になります。

## `process.memoryUsage()` {#processmemoryusage}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.9.0, v12.17.0 | 返されるオブジェクトに `arrayBuffers` を追加しました。 |
| v7.2.0 | 返されるオブジェクトに `external` を追加しました。 |
| v0.1.16 | 追加: v0.1.16 |
:::

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rss` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapTotal` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapUsed` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `external` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `arrayBuffers` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js プロセスのメモリ使用量をバイト単位で記述したオブジェクトを返します。

::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage());
// Prints:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage());
// Prints:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```
:::

- `heapTotal` と `heapUsed` は、V8 のメモリ使用量を指します。
- `external` は、V8 によって管理される JavaScript オブジェクトにバインドされた C++ オブジェクトのメモリ使用量を指します。
- `rss` (Resident Set Size) は、プロセスがメインメモリデバイス (割り当てられた総メモリのサブセット) で占有するスペースの量であり、すべての C++ および JavaScript オブジェクトとコードが含まれます。
- `arrayBuffers` は、すべての Node.js [`Buffer`](/ja/nodejs/api/buffer) を含む、`ArrayBuffer` および `SharedArrayBuffer` に割り当てられたメモリを指します。 これは `external` 値にも含まれます。 Node.js が埋め込みライブラリとして使用されている場合、`ArrayBuffer` の割り当てがその場合に追跡されない可能性があるため、この値は `0` になる場合があります。

[`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドを使用する場合、`rss` はプロセス全体に対して有効な値になりますが、他のフィールドは現在のスレッドのみを参照します。

`process.memoryUsage()` メソッドは、各ページを反復処理してメモリ使用量に関する情報を収集します。これは、プログラムのメモリ割り当てによっては遅くなる可能性があります。


## `process.memoryUsage.rss()` {#processmemoryusagerss}

**追加:** v15.6.0, v14.18.0

- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.memoryUsage.rss()` メソッドは、Resident Set Size (RSS) をバイト単位で表す整数を返します。

Resident Set Size は、プロセスがメインメモリデバイス (割り当てられた総メモリのサブセット) で占有している容量であり、すべての C++ および JavaScript のオブジェクトとコードを含みます。

これは `process.memoryUsage()` によって提供される `rss` プロパティと同じ値ですが、`process.memoryUsage.rss()` の方が高速です。

::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage.rss());
// 35655680
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage.rss());
// 35655680
```
:::

## `process.nextTick(callback[, ...args])` {#processnexttickcallback-args}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.7.0, v20.18.0 | 安定性がレガシーに変更されました。 |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` の代わりに `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v1.8.1 | `callback` の後の追加の引数がサポートされるようになりました。 |
| v0.1.26 | 追加: v0.1.26 |
:::

::: info [安定性: 3 - レガシー]
[安定性: 3](/ja/nodejs/api/documentation#stability-index) [安定性: 3](/ja/nodejs/api/documentation#stability-index) - レガシー: 代わりに [`queueMicrotask()`](/ja/nodejs/api/globals#queuemicrotaskcallback) を使用してください。
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `callback` を呼び出すときに渡す追加の引数

`process.nextTick()` は `callback` を "next tick queue" に追加します。 このキューは、JavaScript スタック上の現在の操作が完了した後、イベントループが続行できるようになる前に完全に排出されます。 `process.nextTick()` を再帰的に呼び出すと、無限ループが発生する可能性があります。 詳細については、[イベントループ](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#understanding-processnexttick) ガイドを参照してください。

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```

```js [CJS]
const { nextTick } = require('node:process');

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```
:::

これは、オブジェクトが構築された*後*、I/O が発生する*前*に、ユーザーがイベントハンドラーを割り当てる機会を提供するために、API を開発する際に重要です。

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() は、以前ではなく、今呼び出されます。
```

```js [CJS]
const { nextTick } = require('node:process');

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() は、以前ではなく、今呼び出されます。
```
:::

API は 100% 同期であるか、100% 非同期であるかのどちらかであることが非常に重要です。 次の例を検討してください。

```js [ESM]
// 警告！ 使用しないでください！ 危険で安全ではありません！
function maybeSync(arg, cb) {
  if (arg) {
    cb();
    return;
  }

  fs.stat('file', cb);
}
```
この API は、次のような場合に危険です。

```js [ESM]
const maybeTrue = Math.random() > 0.5;

maybeSync(maybeTrue, () => {
  foo();
});

bar();
```
`foo()` と `bar()` のどちらが最初に呼び出されるかは明確ではありません。

次のアプローチの方がはるかに優れています。

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```

```js [CJS]
const { nextTick } = require('node:process');

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```
:::


### `queueMicrotask()` と `process.nextTick()` の使い分け {#when-to-use-queuemicrotask-vs-processnexttick}

[`queueMicrotask()`](/ja/nodejs/api/globals#queuemicrotaskcallback) APIは、解決済みPromiseの then、catch、finallyハンドラーを実行するために使用されるのと同じマイクロタスクキューを使用して関数の実行を延期する、`process.nextTick()` の代替手段です。Node.js 内では、「ネクストティックキュー」が空になるたびに、マイクロタスクキューが直後に空になります。

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Output:
// 1
// 2
// 3
```

```js [CJS]
const { nextTick } = require('node:process');

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Output:
// 1
// 2
// 3
```
:::

*ほとんどの* ユーザーランドのユースケースでは、`queueMicrotask()` APIは、複数のJavaScriptプラットフォーム環境で動作する実行を延期するための移植可能で信頼性の高いメカニズムを提供し、`process.nextTick()` よりも推奨されるべきです。単純なシナリオでは、`queueMicrotask()` は `process.nextTick()` のドロップイン代替として使用できます。

```js [ESM]
console.log('start');
queueMicrotask(() => {
  console.log('microtask callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// microtask callback
```
2つのAPIの注目すべき違いの1つは、`process.nextTick()` が、遅延関数が呼び出されたときに関数に引数として渡される追加の値を指定できることです。`queueMicrotask()` で同じ結果を達成するには、クロージャまたはバインドされた関数のいずれかを使用する必要があります。

```js [ESM]
function deferred(a, b) {
  console.log('microtask', a + b);
}

console.log('start');
queueMicrotask(deferred.bind(undefined, 1, 2));
console.log('scheduled');
// Output:
// start
// scheduled
// microtask 3
```
ネクストティックキューとマイクロタスクキュー内で発生したエラーの処理方法には、わずかな違いがあります。キューに入れられたマイクロタスクコールバック内でスローされたエラーは、可能な限りキューに入れられたコールバック内で処理する必要があります。そうでない場合は、`process.on('uncaughtException')` イベントハンドラーを使用して、エラーをキャプチャして処理できます。

迷った場合は、`process.nextTick()` の特定の機能が必要な場合を除き、`queueMicrotask()` を使用してください。


## `process.noDeprecation` {#processnodeprecation}

**追加:** v0.8.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`process.noDeprecation` プロパティは、現在の Node.js プロセスで `--no-deprecation` フラグが設定されているかどうかを示します。このフラグの動作に関する詳細は、[`'warning'` イベント](/ja/nodejs/api/process#event-warning) と [`emitWarning()` メソッド](/ja/nodejs/api/process#processemitwarningwarning-type-code-ctor) のドキュメントを参照してください。

## `process.permission` {#processpermission}

**追加:** v20.0.0

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

この API は、[`--permission`](/ja/nodejs/api/cli#--permission) フラグを通じて利用可能です。

`process.permission` は、現在のプロセスのパーミッションを管理するために使用されるメソッドを持つオブジェクトです。追加のドキュメントは、[パーミッションモデル](/ja/nodejs/api/permissions#permission-model) にあります。

### `process.permission.has(scope[, reference])` {#processpermissionhasscope-reference}

**追加:** v20.0.0

- `scope` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `reference` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

プロセスが指定されたスコープとリファレンスにアクセスできるかどうかを検証します。リファレンスが提供されない場合、グローバルスコープが想定されます。たとえば、`process.permission.has('fs.read')` は、プロセスがすべてのファイルシステム読み取りパーミッションを持っているかどうかをチェックします。

リファレンスには、提供されたスコープに基づいて意味があります。たとえば、スコープがファイルシステムの場合、リファレンスはファイルとフォルダを意味します。

利用可能なスコープは次のとおりです。

- `fs` - すべてのファイルシステム
- `fs.read` - ファイルシステムの読み取り操作
- `fs.write` - ファイルシステムの書き込み操作
- `child` - 子プロセスの生成操作
- `worker` - Worker スレッドの生成操作

```js [ESM]
// プロセスが README ファイルを読み取る権限を持っているかどうかを確認します
process.permission.has('fs.read', './README.md');
// プロセスが読み取り権限操作を持っているかどうかを確認します
process.permission.has('fs.read');
```

## `process.pid` {#processpid}

**追加: v0.1.15**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.pid` プロパティは、プロセスの PID を返します。

::: code-group
```js [ESM]
import { pid } from 'node:process';

console.log(`This process is pid ${pid}`);
```

```js [CJS]
const { pid } = require('node:process');

console.log(`This process is pid ${pid}`);
```
:::

## `process.platform` {#processplatform}

**追加: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.platform` プロパティは、Node.js のバイナリがコンパイルされたオペレーティングシステムのプラットフォームを識別する文字列を返します。

現在可能な値は次のとおりです。

- `'aix'`
- `'darwin'`
- `'freebsd'`
- `'linux'`
- `'openbsd'`
- `'sunos'`
- `'win32'`

::: code-group
```js [ESM]
import { platform } from 'node:process';

console.log(`This platform is ${platform}`);
```

```js [CJS]
const { platform } = require('node:process');

console.log(`This platform is ${platform}`);
```
:::

Node.jsがAndroidオペレーティングシステム上に構築されている場合、`'android'`という値も返される可能性があります。ただし、Node.jsにおけるAndroidのサポートは[実験的](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android)です。

## `process.ppid` {#processppid}

**追加: v9.2.0, v8.10.0, v6.13.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.ppid` プロパティは、現在のプロセスの親プロセスの PID を返します。

::: code-group
```js [ESM]
import { ppid } from 'node:process';

console.log(`The parent process is pid ${ppid}`);
```

```js [CJS]
const { ppid } = require('node:process');

console.log(`The parent process is pid ${ppid}`);
```
:::

## `process.release` {#processrelease}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v4.2.0 | `lts` プロパティがサポートされるようになりました。 |
| v3.0.0 | 追加: v3.0.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.release` プロパティは、ソースの tarball およびヘッダーのみの tarball の URL を含む、現在のリリースに関連するメタデータを含む `Object` を返します。

`process.release` には次のプロパティが含まれています。

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 常に `'node'` となる値。
- `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 現在のリリースのソースコードを含む *<code>.tar.gz</code>* ファイルを指す絶対 URL。
- `headersUrl`[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 現在のリリースのソースヘッダーファイルのみを含む *<code>.tar.gz</code>* ファイルを指す絶対 URL。 このファイルは完全なソースファイルよりも大幅に小さく、Node.js ネイティブアドオンのコンパイルに使用できます。
- `libUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 現在のリリースのアーキテクチャとバージョンに一致する *<code>node.lib</code>* ファイルを指す絶対 URL。 このファイルは、Node.js ネイティブアドオンのコンパイルに使用されます。 *このプロパティは、Node.js の Windows ビルドにのみ存在し、他のすべてのプラットフォームでは欠落しています。*
- `lts` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) このリリースの [LTS](https://github.com/nodejs/Release) ラベルを識別する文字列ラベル。 このプロパティは LTS リリースにのみ存在し、*Current* リリースを含む他のすべてのリリースタイプでは `undefined` です。 有効な値には、LTS リリースコード名が含まれます (サポートされなくなったものも含む)。
    - 14.15.0 から始まる 14.x LTS ラインの `'Fermium'`。
    - 16.13.0 から始まる 16.x LTS ラインの `'Gallium'`。
    - 18.12.0 から始まる 18.x LTS ラインの `'Hydrogen'`。 その他のLTSリリースコード名については、[Node.js Changelog Archive](https://github.com/nodejs/node/blob/HEAD/doc/changelogs/CHANGELOG_ARCHIVE.md) を参照してください。

```js [ESM]
{
  name: 'node',
  lts: 'Hydrogen',
  sourceUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0.tar.gz',
  headersUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0-headers.tar.gz',
  libUrl: 'https://nodejs.org/download/release/v18.12.0/win-x64/node.lib'
}
```
ソースツリーの非リリースバージョンからのカスタムビルドでは、`name` プロパティのみが存在する場合があります。 追加のプロパティの存在に依存しないでください。


## `process.report` {#processreport}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v13.12.0, v12.17.0 | この API は実験的ではなくなりました。 |
| v11.8.0 | Added in: v11.8.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.report` は、現在のプロセスに対する診断レポートを生成するために使用されるメソッドを持つオブジェクトです。追加のドキュメントは、[report documentation](/ja/nodejs/api/report) にあります。

### `process.report.compact` {#processreportcompact}

**Added in: v13.12.0, v12.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

レポートをコンパクトな形式、つまり、ログ処理システムでより容易に利用できる単一行 JSON で記述します。デフォルトの複数行形式は、人間が消費するように設計されています。

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Reports are compact? ${report.compact}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Reports are compact? ${report.compact}`);
```
:::

### `process.report.directory` {#processreportdirectory}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v13.12.0, v12.17.0 | この API は実験的ではなくなりました。 |
| v11.12.0 | Added in: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

レポートが書き込まれるディレクトリ。デフォルト値は空文字列で、レポートが Node.js プロセスの現在のワーキングディレクトリに書き込まれることを示します。

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report directory is ${report.directory}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report directory is ${report.directory}`);
```
:::

### `process.report.filename` {#processreportfilename}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v13.12.0, v12.17.0 | この API は実験的ではなくなりました。 |
| v11.12.0 | Added in: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

レポートが書き込まれるファイル名。空文字列に設定した場合、出力ファイル名はタイムスタンプ、PID、およびシーケンス番号で構成されます。デフォルト値は空文字列です。

`process.report.filename` の値が `'stdout'` または `'stderr'` に設定されている場合、レポートはそれぞれプロセスの stdout または stderr に書き込まれます。

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report filename is ${report.filename}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report filename is ${report.filename}`);
```
:::


### `process.report.getReport([err])` {#processreportgetreporterr}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.12.0, v12.17.0 | この API は実験的ではなくなりました。 |
| v11.8.0 | Added in: v11.8.0 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) JavaScript スタックの報告に使用されるカスタムエラー。
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

実行中のプロセスの診断レポートの JavaScript オブジェクト表現を返します。レポートの JavaScript スタックトレースは、存在する場合は `err` から取得されます。



::: code-group
```js [ESM]
import { report } from 'node:process';
import util from 'node:util';

const data = report.getReport();
console.log(data.header.nodejsVersion);

// process.report.writeReport() と同様
import fs from 'node:fs';
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```

```js [CJS]
const { report } = require('node:process');
const util = require('node:util');

const data = report.getReport();
console.log(data.header.nodejsVersion);

// process.report.writeReport() と同様
const fs = require('node:fs');
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```
:::

追加のドキュメントは、[report documentation](/ja/nodejs/api/report) で利用できます。

### `process.report.reportOnFatalError` {#processreportreportonfatalerror}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.0.0, v14.17.0 | この API は実験的ではなくなりました。 |
| v11.12.0 | Added in: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true` の場合、メモリ不足エラーや C++ アサーションの失敗など、致命的なエラーが発生した場合に診断レポートが生成されます。



::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report on fatal error: ${report.reportOnFatalError}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report on fatal error: ${report.reportOnFatalError}`);
```
:::


### `process.report.reportOnSignal` {#processreportreportonsignal}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.12.0, v12.17.0 | このAPIはもはや実験的ではありません。 |
| v11.12.0 | 追加: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true`の場合、`process.report.signal`で指定されたシグナルをプロセスが受信すると、診断レポートが生成されます。

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report on signal: ${report.reportOnSignal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report on signal: ${report.reportOnSignal}`);
```
:::

### `process.report.reportOnUncaughtException` {#processreportreportonuncaughtexception}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.12.0, v12.17.0 | このAPIはもはや実験的ではありません。 |
| v11.12.0 | 追加: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true`の場合、キャッチされない例外が発生すると診断レポートが生成されます。

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report on exception: ${report.reportOnUncaughtException}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report on exception: ${report.reportOnUncaughtException}`);
```
:::

### `process.report.excludeEnv` {#processreportexcludeenv}

**追加: v23.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true`の場合、環境変数なしで診断レポートが生成されます。

### `process.report.signal` {#processreportsignal}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.12.0, v12.17.0 | このAPIはもはや実験的ではありません。 |
| v11.12.0 | 追加: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

診断レポートの作成をトリガーするために使用されるシグナル。 デフォルトは`'SIGUSR2'`です。

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report signal: ${report.signal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report signal: ${report.signal}`);
```
:::


### `process.report.writeReport([filename][, err])` {#processreportwritereportfilename-err}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.12.0, v12.17.0 | この API は実験的ではなくなりました。 |
| v11.8.0 | Added in: v11.8.0 |
:::

-  `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) レポートが書き込まれるファイルの名前。 これは相対パスである必要があり、`process.report.directory` で指定されたディレクトリ、または指定されていない場合は Node.js プロセスの現在のワーキングディレクトリに追加されます。
-  `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) JavaScript スタックのレポートに使用されるカスタムエラー。
-  戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 生成されたレポートのファイル名を返します。

診断レポートをファイルに書き込みます。 `filename` が指定されていない場合、デフォルトのファイル名には日付、時刻、PID、およびシーケンス番号が含まれます。 レポートの JavaScript スタックトレースは、存在する場合は `err` から取得されます。

`filename` の値が `'stdout'` または `'stderr'` に設定されている場合、レポートはそれぞれプロセスの stdout または stderr に書き込まれます。

::: code-group
```js [ESM]
import { report } from 'node:process';

report.writeReport();
```

```js [CJS]
const { report } = require('node:process');

report.writeReport();
```
:::

追加のドキュメントは、[レポートのドキュメント](/ja/nodejs/api/report)にあります。

## `process.resourceUsage()` {#processresourceusage}

**Added in: v12.6.0**

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 現在のプロセスのリソース使用量。 これらの値はすべて `uv_getrusage` 呼び出しから取得され、[`uv_rusage_t` 構造体](https://docs.libuv.org/en/v1.x/misc#c.uv_rusage_t)を返します。
    - `userCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) マイクロ秒単位で計算された `ru_utime` に対応します。 これは [`process.cpuUsage().user`](/ja/nodejs/api/process#processcpuusagepreviousvalue) と同じ値です。
    - `systemCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) マイクロ秒単位で計算された `ru_stime` に対応します。 これは [`process.cpuUsage().system`](/ja/nodejs/api/process#processcpuusagepreviousvalue) と同じ値です。
    - `maxRSS` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) キロバイト単位で使用される最大常駐セットサイズである `ru_maxrss` に対応します。
    - `sharedMemorySize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `ru_ixrss` に対応しますが、どのプラットフォームでもサポートされていません。
    - `unsharedDataSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `ru_idrss` に対応しますが、どのプラットフォームでもサポートされていません。
    - `unsharedStackSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `ru_isrss` に対応しますが、どのプラットフォームでもサポートされていません。
    - `minorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのマイナーページフォールトの数である `ru_minflt` に対応します。[詳細については、こちらの記事を参照してください](https://en.wikipedia.org/wiki/Page_fault#Minor)。
    - `majorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのメジャーページフォールトの数である `ru_majflt` に対応します。[詳細については、こちらの記事を参照してください](https://en.wikipedia.org/wiki/Page_fault#Major)。 このフィールドは Windows ではサポートされていません。
    - `swappedOut` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `ru_nswap` に対応しますが、どのプラットフォームでもサポートされていません。
    - `fsRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイルシステムが入力実行する必要があった回数である `ru_inblock` に対応します。
    - `fsWrite` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイルシステムが出力実行する必要があった回数である `ru_oublock` に対応します。
    - `ipcSent` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `ru_msgsnd` に対応しますが、どのプラットフォームでもサポートされていません。
    - `ipcReceived` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `ru_msgrcv` に対応しますが、どのプラットフォームでもサポートされていません。
    - `signalsCount` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `ru_nsignals` に対応しますが、どのプラットフォームでもサポートされていません。
    - `voluntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスがそのタイムスライスが完了する前にプロセッサを自発的に放棄した（通常はリソースの可用性を待つため）CPU コンテキストスイッチが発生した回数である `ru_nvcsw` に対応します。 このフィールドは Windows ではサポートされていません。
    - `involuntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 優先度の高いプロセスが実行可能になったか、現在のプロセスがそのタイムスライスを超過したために CPU コンテキストスイッチが発生した回数である `ru_nivcsw` に対応します。 このフィールドは Windows ではサポートされていません。

::: code-group
```js [ESM]
import { resourceUsage } from 'node:process';

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```

```js [CJS]
const { resourceUsage } = require('node:process');

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```
:::


## `process.send(message[, sendHandle[, options]][, callback])` {#processsendmessage-sendhandle-options-callback}

**Added in: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<net.Server\>](/ja/nodejs/api/net#class-netserver) | [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 特定の種類のハンドル送信をパラメータ化するために使用されます。`options` は次のプロパティをサポートします。
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `net.Socket` のインスタンスを渡す際に使用できる値。 `true` の場合、ソケットは送信プロセスで開いたままになります。**Default:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Node.jsがIPCチャネルで生成された場合、`process.send()`メソッドを使用して、親プロセスにメッセージを送信できます。メッセージは、親の[`ChildProcess`](/ja/nodejs/api/child_process#class-childprocess)オブジェクトの[`'message'`](/ja/nodejs/api/child_process#event-message)イベントとして受信されます。

Node.jsがIPCチャネルで生成されなかった場合、`process.send`は`undefined`になります。

メッセージはシリアライズと解析を経ます。結果として得られるメッセージは、最初に送信されたものと同じではない可能性があります。

## `process.setegid(id)` {#processsetegidid}

**Added in: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) グループ名またはID

`process.setegid()`メソッドは、プロセスの実効グループIDを設定します。（[`setegid(2)`](http://man7.org/linux/man-pages/man2/setegid.2)を参照してください。） `id`は数値IDまたはグループ名文字列として渡すことができます。グループ名が指定された場合、このメソッドは関連する数値IDを解決する間ブロックします。

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```
:::

この関数は、POSIXプラットフォーム（つまり、WindowsまたはAndroidではない）でのみ使用できます。この機能は[`Worker`](/ja/nodejs/api/worker_threads#class-worker)スレッドでは利用できません。


## `process.seteuid(id)` {#processseteuidid}

**Added in: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ユーザー名または ID

`process.seteuid()` メソッドは、プロセスの実効ユーザーIDを設定します。([`seteuid(2)`](http://man7.org/linux/man-pages/man2/seteuid.2) を参照してください。) `id` は、数値 ID またはユーザー名の文字列として渡すことができます。ユーザー名が指定された場合、このメソッドは関連する数値 ID の解決中にブロックします。

::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

この関数は POSIX プラットフォーム (Windows または Android ではない) でのみ使用できます。この機能は [`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドでは利用できません。

## `process.setgid(id)` {#processsetgidid}

**Added in: v0.1.31**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) グループ名または ID

`process.setgid()` メソッドは、プロセスのグループ ID を設定します。( [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) を参照してください。) `id` は、数値 ID またはグループ名の文字列として渡すことができます。グループ名が指定された場合、このメソッドは関連する数値 ID の解決中にブロックします。

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```
:::

この関数は POSIX プラットフォーム (Windows または Android ではない) でのみ使用できます。この機能は [`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドでは利用できません。


## `process.setgroups(groups)` {#processsetgroupsgroups}

**Added in: v0.9.4**

- `groups` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.setgroups()` メソッドは、Node.js プロセスの補助グループ ID を設定します。これは特権操作であり、Node.js プロセスが `root` または `CAP_SETGID` 権限を持っている必要があります。

`groups` 配列には、数値グループ ID、グループ名、またはその両方を含めることができます。

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```
:::

この関数は、POSIX プラットフォーム（つまり、Windows や Android ではない）でのみ利用可能です。この機能は [`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドでは利用できません。

## `process.setuid(id)` {#processsetuidid}

**Added in: v0.1.28**

- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.setuid(id)` メソッドは、プロセスのユーザー ID を設定します。（[`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) を参照）。`id` は、数値 ID またはユーザー名文字列として渡すことができます。ユーザー名が指定された場合、メソッドは関連する数値 ID を解決する間ブロックします。

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

この関数は、POSIX プラットフォーム（つまり、Windows や Android ではない）でのみ利用可能です。この機能は [`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドでは利用できません。


## `process.setSourceMapsEnabled(val)` {#processsetsourcemapsenabledval}

**Added in: v16.6.0, v14.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `val` [\<boolean\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Boolean_type)

この関数は、スタックトレースの[Source Map v3](https://sourcemaps.info/spec)サポートを有効または無効にします。

コマンドラインオプション`--enable-source-maps`でNode.jsプロセスを起動するのと同じ機能を提供します。

ソースマップが有効になった後にロードされるJavaScriptファイル内のソースマップのみが、解析およびロードされます。

## `process.setUncaughtExceptionCaptureCallback(fn)` {#processsetuncaughtexceptioncapturecallbackfn}

**Added in: v9.3.0**

- `fn` [\<Function\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<null\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Null_type)

`process.setUncaughtExceptionCaptureCallback()`関数は、キャッチされない例外が発生したときに呼び出される関数を設定します。この関数は、例外値そのものを最初の引数として受け取ります。

このような関数が設定されている場合、[`'uncaughtException'`](/ja/nodejs/api/process#event-uncaughtexception)イベントは発生しません。`--abort-on-uncaught-exception`がコマンドラインから渡されたか、[`v8.setFlagsFromString()`](/ja/nodejs/api/v8#v8setflagsfromstringflags)を通じて設定された場合、プロセスは中断しません。レポート生成などの例外時に実行されるように設定されたアクションも影響を受けます。

キャプチャ関数を解除するには、`process.setUncaughtExceptionCaptureCallback(null)`を使用できます。別のキャプチャ関数が設定されているときに、`null`以外の引数でこのメソッドを呼び出すと、エラーがスローされます。

この関数の使用は、非推奨の[`domain`](/ja/nodejs/api/domain)組み込みモジュールの使用とは排他的です。

## `process.sourceMapsEnabled` {#processsourcemapsenabled}

**Added in: v20.7.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stable: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- [\<boolean\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Boolean_type)

`process.sourceMapsEnabled`プロパティは、スタックトレースの[Source Map v3](https://sourcemaps.info/spec)サポートが有効になっているかどうかを返します。


## `process.stderr` {#processstderr}

- [\<Stream\>](/ja/nodejs/api/stream#stream)

`process.stderr` プロパティは、`stderr` (fd `2`) に接続されたストリームを返します。fd `2` がファイルを指していない限り、[`net.Socket`](/ja/nodejs/api/net#class-netsocket) ([Duplex](/ja/nodejs/api/stream#duplex-and-transform-streams) ストリーム) です。fd `2` がファイルを指している場合は、[Writable](/ja/nodejs/api/stream#writable-streams) ストリームになります。

`process.stderr` は、他の Node.js ストリームとは重要な点で異なります。詳細については、[プロセス I/O に関する注意](/ja/nodejs/api/process#a-note-on-process-io)を参照してください。

### `process.stderr.fd` {#processstderrfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

このプロパティは、`process.stderr` の基になるファイル記述子の値を指します。値は `2` に固定されています。[`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドでは、このフィールドは存在しません。

## `process.stdin` {#processstdin}

- [\<Stream\>](/ja/nodejs/api/stream#stream)

`process.stdin` プロパティは、`stdin` (fd `0`) に接続されたストリームを返します。fd `0` がファイルを指していない限り、[`net.Socket`](/ja/nodejs/api/net#class-netsocket) ([Duplex](/ja/nodejs/api/stream#duplex-and-transform-streams) ストリーム) です。fd `0` がファイルを指している場合は、[Readable](/ja/nodejs/api/stream#readable-streams) ストリームになります。

`stdin` からの読み取り方法の詳細については、[`readable.read()`](/ja/nodejs/api/stream#readablereadsize) を参照してください。

[Duplex](/ja/nodejs/api/stream#duplex-and-transform-streams) ストリームとして、`process.stdin` は v0.10 より前の Node.js 用に記述されたスクリプトと互換性のある「古い」モードでも使用できます。詳細については、[ストリームの互換性](/ja/nodejs/api/stream#compatibility-with-older-nodejs-versions) を参照してください。

「古い」ストリーム モードでは、`stdin` ストリームはデフォルトで一時停止されているため、そこから読み取るには `process.stdin.resume()` を呼び出す必要があります。また、`process.stdin.resume()` を呼び出すと、ストリームが「古い」モードに切り替わることに注意してください。

### `process.stdin.fd` {#processstdinfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

このプロパティは、`process.stdin` の基になるファイル記述子の値を指します。値は `0` に固定されています。[`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドでは、このフィールドは存在しません。


## `process.stdout` {#processstdout}

- [\<Stream\>](/ja/nodejs/api/stream#stream)

`process.stdout` プロパティは、`stdout` (fd `1`) に接続されたストリームを返します。fd `1` がファイルを参照していない限り、これは [`net.Socket`](/ja/nodejs/api/net#class-netsocket) ([Duplex](/ja/nodejs/api/stream#duplex-and-transform-streams) ストリーム) です。その場合、これは [Writable](/ja/nodejs/api/stream#writable-streams) ストリームです。

たとえば、`process.stdin` を `process.stdout` にコピーするには:

::: code-group
```js [ESM]
import { stdin, stdout } from 'node:process';

stdin.pipe(stdout);
```

```js [CJS]
const { stdin, stdout } = require('node:process');

stdin.pipe(stdout);
```
:::

`process.stdout` は、他の Node.js ストリームとは重要な点で異なります。詳細については、[process I/O に関する注記](/ja/nodejs/api/process#a-note-on-process-io) を参照してください。

### `process.stdout.fd` {#processstdoutfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

このプロパティは、`process.stdout` の基になるファイル記述子の値を参照します。値は `1` で固定されています。[`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドでは、このフィールドは存在しません。

### process I/O に関する注記 {#a-note-on-process-i/o}

`process.stdout` と `process.stderr` は、他の Node.js ストリームとは重要な点で異なります。

これらの動作は、一部には歴史的な理由によるもので、変更すると後方互換性が失われるためですが、一部のユーザーからは期待されています。

同期書き込みは、`console.log()` または `console.error()` で書き込まれた出力が予期せずインターリーブされたり、非同期書き込みが完了する前に `process.exit()` が呼び出された場合にまったく書き込まれなくなったりするなどの問題を回避します。詳細については、[`process.exit()`](/ja/nodejs/api/process#processexitcode) を参照してください。

*<strong>警告</strong>*: 同期書き込みは、書き込みが完了するまでイベントループをブロックします。これはファイルへの出力の場合にはほぼ瞬時ですが、システム負荷が高い場合、受信側で読み取られていないパイプ、または低速な端末またはファイルシステムでは、イベントループが頻繁に、また十分に長くブロックされ、パフォーマンスに深刻な悪影響を与える可能性があります。これはインタラクティブなターミナルセッションへの書き込みでは問題にならない可能性がありますが、プロセス出力ストリームへの本番環境ロギングを行う場合は特に注意してください。

ストリームが [TTY](/ja/nodejs/api/tty#tty) コンテキストに接続されているかどうかを確認するには、`isTTY` プロパティを確認します。

たとえば:

```bash [BASH]
$ node -p "Boolean(process.stdin.isTTY)"
true
$ echo "foo" | node -p "Boolean(process.stdin.isTTY)"
false
$ node -p "Boolean(process.stdout.isTTY)"
true
$ node -p "Boolean(process.stdout.isTTY)" | cat
false
```
詳細については、[TTY](/ja/nodejs/api/tty#tty) ドキュメントを参照してください。


## `process.throwDeprecation` {#processthrowdeprecation}

**Added in: v0.9.12**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`process.throwDeprecation` の初期値は、現在の Node.js プロセスで `--throw-deprecation` フラグが設定されているかどうかを示します。 `process.throwDeprecation` は変更可能であるため、非推奨の警告がエラーになるかどうかは、実行時に変更される可能性があります。 詳細については、[`'warning'` イベント](/ja/nodejs/api/process#event-warning)と[`emitWarning()` メソッド](/ja/nodejs/api/process#processemitwarningwarning-type-code-ctor)のドキュメントを参照してください。

```bash [BASH]
$ node --throw-deprecation -p "process.throwDeprecation"
true
$ node -p "process.throwDeprecation"
undefined
$ node
> process.emitWarning('test', 'DeprecationWarning');
undefined
> (node:26598) DeprecationWarning: test
> process.throwDeprecation = true;
true
> process.emitWarning('test', 'DeprecationWarning');
Thrown:
[DeprecationWarning: test] { name: 'DeprecationWarning' }
```
## `process.title` {#processtitle}

**Added in: v0.1.104**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.title` プロパティは、現在のプロセス・タイトル（つまり、`ps` の現在の値を返す）を返します。 `process.title` に新しい値を代入すると、`ps` の現在の値が変更されます。

新しい値を代入する場合、プラットフォームによってタイトルの最大長の制限が異なります。 通常、このような制限はかなり限定されています。 例えば、Linux および macOS では、`process.title` は、バイナリ名にコマンドライン引数の長さを加えたサイズに制限されます。これは、`process.title` を設定すると、プロセスの `argv` メモリが上書きされるためです。 Node.js v0.8 では、`environ` メモリも上書きすることで、より長いプロセス・タイトル文字列が可能になりましたが、いくつかの（かなりあいまいな）ケースでは潜在的に安全ではなく、混乱を招く可能性がありました。

`process.title` に値を割り当てても、macOS の Activity Monitor や Windows のサービスマネージャーなどのプロセス管理アプリケーションで正確なラベルが表示されない場合があります。


## `process.traceDeprecation` {#processtracedeprecation}

**Added in: v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`process.traceDeprecation` プロパティは、現在の Node.js プロセスで `--trace-deprecation` フラグが設定されているかどうかを示します。このフラグの動作に関する詳細については、[`'warning'` イベント](/ja/nodejs/api/process#event-warning) および [`emitWarning()` メソッド](/ja/nodejs/api/process#processemitwarningwarning-type-code-ctor) のドキュメントを参照してください。

## `process.umask()` {#processumask}

::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0, v12.19.0 | 引数なしで `process.umask()` を呼び出すことは非推奨となりました。 |
| v0.1.19 | Added in: v0.1.19 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨。引数なしで `process.umask()` を呼び出すと、プロセス全体の umask が 2 回書き込まれます。これにより、スレッド間に競合状態が発生し、潜在的なセキュリティ脆弱性となります。安全でクロスプラットフォームな代替 API はありません。
:::

`process.umask()` は、Node.js プロセスのファイルモード作成マスクを返します。子プロセスは、親プロセスからマスクを継承します。

## `process.umask(mask)` {#processumaskmask}

**Added in: v0.1.19**

- `mask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.umask(mask)` は、Node.js プロセスのファイルモード作成マスクを設定します。子プロセスは、親プロセスからマスクを継承します。以前のマスクを返します。

::: code-group
```js [ESM]
import { umask } from 'node:process';

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```

```js [CJS]
const { umask } = require('node:process');

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```
:::

[`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドでは、`process.umask(mask)` は例外をスローします。


## `process.uptime()` {#processuptime}

**Added in: v0.5.0**

- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.uptime()` メソッドは、現在の Node.js プロセスが実行されている秒数を返します。

戻り値には、秒の端数も含まれます。整数秒を取得するには、`Math.floor()` を使用します。

## `process.version` {#processversion}

**Added in: v0.1.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.version` プロパティには、Node.js のバージョン文字列が含まれています。



::: code-group
```js [ESM]
import { version } from 'node:process';

console.log(`Version: ${version}`);
// Version: v14.8.0
```

```js [CJS]
const { version } = require('node:process');

console.log(`Version: ${version}`);
// Version: v14.8.0
```
:::

先頭の *v* なしでバージョン文字列を取得するには、`process.versions.node` を使用します。

## `process.versions` {#processversions}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v9.0.0 | `v8` プロパティに Node.js 固有のサフィックスが含まれるようになりました。 |
| v4.2.0 | `icu` プロパティがサポートされるようになりました。 |
| v0.2.0 | Added in: v0.2.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.versions` プロパティは、Node.js とその依存関係のバージョン文字列をリストするオブジェクトを返します。 `process.versions.modules` は、現在の ABI バージョンを示します。これは、C++ API が変更されるたびに増加します。 Node.js は、異なるモジュール ABI バージョンに対してコンパイルされたモジュールのロードを拒否します。



::: code-group
```js [ESM]
import { versions } from 'node:process';

console.log(versions);
```

```js [CJS]
const { versions } = require('node:process');

console.log(versions);
```
:::

次のようなオブジェクトが生成されます。

```bash [BASH]
{ node: '23.0.0',
  acorn: '8.11.3',
  ada: '2.7.8',
  ares: '1.28.1',
  base64: '0.5.2',
  brotli: '1.1.0',
  cjs_module_lexer: '1.2.2',
  cldr: '45.0',
  icu: '75.1',
  llhttp: '9.2.1',
  modules: '127',
  napi: '9',
  nghttp2: '1.61.0',
  nghttp3: '0.7.0',
  ngtcp2: '1.3.0',
  openssl: '3.0.13+quic',
  simdjson: '3.8.0',
  simdutf: '5.2.4',
  sqlite: '3.46.0',
  tz: '2024a',
  undici: '6.13.0',
  unicode: '15.1',
  uv: '1.48.0',
  uvwasi: '0.0.20',
  v8: '12.4.254.14-node.11',
  zlib: '1.3.0.1-motley-7d77fb7' }
```

## Exit codes {#exit-codes}

Node.js は、非同期操作が保留中でなくなった場合、通常はステータスコード `0` で終了します。 それ以外の場合は、次のステータスコードが使用されます。

- `1` **捕捉されない致命的な例外**: 捕捉されない例外が発生し、domain または [`'uncaughtException'`](/ja/nodejs/api/process#event-uncaughtexception) イベントハンドラーによって処理されませんでした。
- `2`: 未使用 (Bash が組み込みの誤用として予約)
- `3` **内部 JavaScript パースエラー**: Node.js のブートストラップ処理内部の JavaScript ソースコードが、パースエラーを引き起こしました。 これは非常にまれであり、通常は Node.js 自体の開発中にのみ発生する可能性があります。
- `4` **内部 JavaScript 評価の失敗**: Node.js のブートストラップ処理内部の JavaScript ソースコードが、評価時に関数値を返すことに失敗しました。 これは非常にまれであり、通常は Node.js 自体の開発中にのみ発生する可能性があります。
- `5` **致命的なエラー**: V8 で回復不能な致命的なエラーが発生しました。 通常、メッセージはプレフィックス `FATAL ERROR` 付きで stderr に出力されます。
- `6` **非関数内部例外ハンドラー**: 捕捉されない例外が発生しましたが、内部の致命的な例外ハンドラー関数が何らかの形で非関数に設定されており、呼び出すことができませんでした。
- `7` **内部例外ハンドラーの実行時エラー**: 捕捉されない例外が発生し、内部の致命的な例外ハンドラー関数自体が、それを処理しようとしているときにエラーをスローしました。 たとえば、[`'uncaughtException'`](/ja/nodejs/api/process#event-uncaughtexception) または `domain.on('error')` ハンドラーがエラーをスローした場合に発生する可能性があります。
- `8`: 未使用。 以前のバージョンの Node.js では、終了コード 8 は捕捉されない例外を示していた場合があります。
- `9` **無効な引数**: 不明なオプションが指定されたか、値を必要とするオプションが値なしで指定されました。
- `10` **内部 JavaScript 実行時エラー**: Node.js のブートストラップ処理内部の JavaScript ソースコードが、ブートストラップ関数が呼び出されたときにエラーをスローしました。 これは非常にまれであり、通常は Node.js 自体の開発中にのみ発生する可能性があります。
- `12` **無効なデバッグ引数**: `--inspect` および/または `--inspect-brk` オプションが設定されましたが、選択されたポート番号が無効であるか、利用できません。
- `13` **未解決のトップレベル Await**: `await` がトップレベルコードの関数外で使用されましたが、渡された `Promise` は解決されませんでした。
- `14` **スナップショットの失敗**: Node.js は V8 スタートアップスナップショットを構築するために開始されましたが、アプリケーションの状態の特定の要件が満たされなかったため、失敗しました。
- `\>128` **シグナルによる終了**: Node.js が `SIGKILL` や `SIGHUP` などの致命的なシグナルを受信した場合、その終了コードは `128` にシグナルコードの値を加えたものになります。 これは標準的な POSIX の慣例です。終了コードは 7 ビット整数として定義され、シグナルによる終了は上位ビットを設定し、シグナルコードの値を含みます。 たとえば、シグナル `SIGABRT` の値は `6` であるため、予想される終了コードは `128` + `6`、つまり `134` になります。

