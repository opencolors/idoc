---
title: Node.js トレースイベント
description: Node.jsのトレースイベントAPIを使用してパフォーマンスプロファイリングとデバッグを行う方法に関するドキュメント。
head:
  - - meta
    - name: og:title
      content: Node.js トレースイベント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのトレースイベントAPIを使用してパフォーマンスプロファイリングとデバッグを行う方法に関するドキュメント。
  - - meta
    - name: twitter:title
      content: Node.js トレースイベント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのトレースイベントAPIを使用してパフォーマンスプロファイリングとデバッグを行う方法に関するドキュメント。
---


# トレースイベント {#trace-events}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

**ソースコード:** [lib/trace_events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/trace_events.js)

`node:trace_events` モジュールは、V8、Node.js コア、およびユーザースペースコードによって生成されたトレース情報を一元化するメカニズムを提供します。

トレースは、`--trace-event-categories` コマンドラインフラグを使用するか、`node:trace_events` モジュールを使用して有効にできます。`--trace-event-categories` フラグは、コンマ区切りのカテゴリ名のリストを受け入れます。

利用可能なカテゴリは次のとおりです。

- `node`: 空のプレースホルダー。
- `node.async_hooks`: 詳細な [`async_hooks`](/ja/nodejs/api/async_hooks) トレースデータのキャプチャを有効にします。[`async_hooks`](/ja/nodejs/api/async_hooks) イベントには、一意の `asyncId` と特別な `triggerId` `triggerAsyncId` プロパティがあります。
- `node.bootstrap`: Node.js ブートストラップのマイルストーンのキャプチャを有効にします。
- `node.console`: `console.time()` および `console.count()` 出力のキャプチャを有効にします。
- `node.threadpoolwork.sync`: `blob`、`zlib`、`crypto`、および `node_api` などのスレッドプール同期操作のトレースデータのキャプチャを有効にします。
- `node.threadpoolwork.async`: `blob`、`zlib`、`crypto`、および `node_api` などのスレッドプール非同期操作のトレースデータのキャプチャを有効にします。
- `node.dns.native`: DNS クエリのトレースデータのキャプチャを有効にします。
- `node.net.native`: ネットワークのトレースデータのキャプチャを有効にします。
- `node.environment`: Node.js 環境のマイルストーンのキャプチャを有効にします。
- `node.fs.sync`: ファイルシステム同期メソッドのトレースデータのキャプチャを有効にします。
- `node.fs_dir.sync`: ファイルシステム同期ディレクトリメソッドのトレースデータのキャプチャを有効にします。
- `node.fs.async`: ファイルシステム非同期メソッドのトレースデータのキャプチャを有効にします。
- `node.fs_dir.async`: ファイルシステム非同期ディレクトリメソッドのトレースデータのキャプチャを有効にします。
- `node.perf`: [Performance API](/ja/nodejs/api/perf_hooks) 測定のキャプチャを有効にします。
    - `node.perf.usertiming`: Performance API ユーザタイミングのメジャーとマークのみのキャプチャを有効にします。
    - `node.perf.timerify`: Performance API timerify 測定のみのキャプチャを有効にします。
  
 
- `node.promises.rejections`: 未処理の Promise の拒否と、拒否後の処理の数を追跡するトレースデータのキャプチャを有効にします。
- `node.vm.script`: `node:vm` モジュールの `runInNewContext()`、`runInContext()`、および `runInThisContext()` メソッドのトレースデータのキャプチャを有効にします。
- `v8`: [V8](/ja/nodejs/api/v8) イベントは、GC、コンパイル、および実行に関連しています。
- `node.http`: HTTP リクエスト/レスポンスのトレースデータのキャプチャを有効にします。
- `node.module_timer`: CJS モジュールのロードのトレースデータのキャプチャを有効にします。

デフォルトでは、`node`、`node.async_hooks`、および `v8` カテゴリが有効になっています。

```bash [BASH]
node --trace-event-categories v8,node,node.async_hooks server.js
```
Node.js の以前のバージョンでは、トレースイベントを有効にするために `--trace-events-enabled` フラグを使用する必要がありました。この要件は削除されました。ただし、`--trace-events-enabled` フラグは *引き続き* 使用でき、デフォルトで `node`、`node.async_hooks`、および `v8` トレースイベントカテゴリを有効にします。

```bash [BASH]
node --trace-events-enabled

# は以下と同等です {#is-equivalent-to}

node --trace-event-categories v8,node,node.async_hooks
```
または、`node:trace_events` モジュールを使用してトレースイベントを有効にすることもできます。

```js [ESM]
const trace_events = require('node:trace_events');
const tracing = trace_events.createTracing({ categories: ['node.perf'] });
tracing.enable();  // 'node.perf' カテゴリのトレースイベントキャプチャを有効にする

// 作業を行う

tracing.disable();  // 'node.perf' カテゴリのトレースイベントキャプチャを無効にする
```
トレースを有効にして Node.js を実行すると、Chrome の [`chrome://tracing`](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) タブで開くことができるログファイルが生成されます。

ログファイルはデフォルトで `node_trace.${rotation}.log` と呼ばれます。ここで `${rotation}` はインクリメントされるログローテーション ID です。ファイルパスパターンは、`${rotation}` と `${pid}` をサポートするテンプレート文字列を受け入れる `--trace-event-file-pattern` で指定できます。

```bash [BASH]
node --trace-event-categories v8 --trace-event-file-pattern '${pid}-${rotation}.log' server.js
```
`SIGINT`、`SIGTERM`、または `SIGBREAK` などのシグナルイベント後にログファイルが適切に生成されるようにするには、次のように、コードに適切なハンドラーがあることを確認してください。

```js [ESM]
process.on('SIGINT', function onSigint() {
  console.info('Received SIGINT.');
  process.exit(130);  // または、OS とシグナルに応じて適用可能な終了コード
});
```
トレースシステムは、`process.hrtime()` で使用されるものと同じタイムソースを使用します。ただし、トレースイベントのタイムスタンプはマイクロ秒で表されます。`process.hrtime()` はナノ秒を返します。

このモジュールの機能は、[`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドでは利用できません。


## `node:trace_events` モジュール {#the-nodetrace_events-module}

**追加:** v10.0.0

### `Tracing` オブジェクト {#tracing-object}

**追加:** v10.0.0

`Tracing` オブジェクトは、カテゴリのセットに対してトレースを有効または無効にするために使用されます。インスタンスは、`trace_events.createTracing()` メソッドを使用して作成されます。

作成時、`Tracing` オブジェクトは無効になっています。`tracing.enable()` メソッドを呼び出すと、カテゴリが有効なトレースイベントカテゴリのセットに追加されます。`tracing.disable()` を呼び出すと、カテゴリが有効なトレースイベントカテゴリのセットから削除されます。

#### `tracing.categories` {#tracingcategories}

**追加:** v10.0.0

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

この `Tracing` オブジェクトでカバーされるトレースイベントカテゴリのカンマ区切りリスト。

#### `tracing.disable()` {#tracingdisable}

**追加:** v10.0.0

この `Tracing` オブジェクトを無効にします。

他の有効な `Tracing` オブジェクトで*カバーされていない*トレースイベントカテゴリ、および `--trace-event-categories` フラグで*指定されていない*トレースイベントカテゴリのみが無効になります。

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node', 'v8'] });
const t2 = trace_events.createTracing({ categories: ['node.perf', 'node'] });
t1.enable();
t2.enable();

// 'node,node.perf,v8' を出力
console.log(trace_events.getEnabledCategories());

t2.disable(); // 'node.perf' カテゴリの発行のみを無効にします

// 'node,v8' を出力
console.log(trace_events.getEnabledCategories());
```
#### `tracing.enable()` {#tracingenable}

**追加:** v10.0.0

`Tracing` オブジェクトによってカバーされるカテゴリのセットに対して、この `Tracing` オブジェクトを有効にします。

#### `tracing.enabled` {#tracingenabled}

**追加:** v10.0.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `Tracing` オブジェクトが有効になっている場合にのみ `true`。

### `trace_events.createTracing(options)` {#trace_eventscreatetracingoptions}

**追加:** v10.0.0

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `categories` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) トレースカテゴリ名の配列。配列に含まれる値は、可能な場合は文字列に強制されます。値を強制できない場合は、エラーがスローされます。


- 戻り値: [\<Tracing\>](/ja/nodejs/api/tracing#tracing-object)。

指定された `categories` のセットに対して `Tracing` オブジェクトを作成して返します。

```js [ESM]
const trace_events = require('node:trace_events');
const categories = ['node.perf', 'node.async_hooks'];
const tracing = trace_events.createTracing({ categories });
tracing.enable();
// 何かする
tracing.disable();
```

### `trace_events.getEnabledCategories()` {#trace_eventsgetenabledcategories}

**追加:** v10.0.0

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String-type)

現在有効になっているすべてのトレースイベントカテゴリをカンマ区切りのリストで返します。現在有効になっているトレースイベントカテゴリのセットは、現在有効になっているすべての `Tracing` オブジェクトと、`--trace-event-categories` フラグを使用して有効になっているカテゴリの *和* によって決定されます。

以下のファイル `test.js` が与えられたとき、コマンド `node --trace-event-categories node.perf test.js` はコンソールに `'node.async_hooks,node.perf'` と出力します。

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node.async_hooks'] });
const t2 = trace_events.createTracing({ categories: ['node.perf'] });
const t3 = trace_events.createTracing({ categories: ['v8'] });

t1.enable();
t2.enable();

console.log(trace_events.getEnabledCategories());
```
## 例 {#examples}

### インスペクターによるトレースイベントデータの収集 {#collect-trace-events-data-by-inspector}

```js [ESM]
'use strict';

const { Session } = require('node:inspector');
const session = new Session();
session.connect();

function post(message, data) {
  return new Promise((resolve, reject) => {
    session.post(message, data, (err, result) => {
      if (err)
        reject(new Error(JSON.stringify(err)));
      else
        resolve(result);
    });
  });
}

async function collect() {
  const data = [];
  session.on('NodeTracing.dataCollected', (chunk) => data.push(chunk));
  session.on('NodeTracing.tracingComplete', () => {
    // done
  });
  const traceConfig = { includedCategories: ['v8'] };
  await post('NodeTracing.start', { traceConfig });
  // do something
  setTimeout(() => {
    post('NodeTracing.stop').then(() => {
      session.disconnect();
      console.log(data);
    });
  }, 1000);
}

collect();
```
