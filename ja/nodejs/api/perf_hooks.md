---
title: Node.js ドキュメント - パフォーマンスフック
description: Node.js のパフォーマンスフック API を探り、Node.js アプリケーションのパフォーマンスを測定するためのメトリックとツールへのアクセスを提供します。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - パフォーマンスフック | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js のパフォーマンスフック API を探り、Node.js アプリケーションのパフォーマンスを測定するためのメトリックとツールへのアクセスを提供します。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - パフォーマンスフック | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js のパフォーマンスフック API を探り、Node.js アプリケーションのパフォーマンスを測定するためのメトリックとツールへのアクセスを提供します。
---


# パフォーマンス測定 API {#performance-measurement-apis}

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/perf_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/perf_hooks.js)

このモジュールは、W3C [Web Performance APIs](https://w3c.github.io/perf-timing-primer/) のサブセットと、Node.js 固有のパフォーマンス測定のための追加 API の実装を提供します。

Node.js は、以下の [Web Performance APIs](https://w3c.github.io/perf-timing-primer/) をサポートしています。

- [高分解能時間](https://www.w3.org/TR/hr-time-2)
- [Performance Timeline](https://w3c.github.io/performance-timeline/)
- [User Timing](https://www.w3.org/TR/user-timing/)
- [Resource Timing](https://www.w3.org/TR/resource-timing-2/)



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
doSomeLongRunningProcess(() => {
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
});
```

```js [CJS]
const { PerformanceObserver, performance } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
(async function doSomeLongRunningProcess() {
  await new Promise((r) => setTimeout(r, 5000));
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
})();
```
:::

## `perf_hooks.performance` {#perf_hooksperformance}

**追加:** v8.5.0

現在の Node.js インスタンスからパフォーマンスメトリクスを収集するために使用できるオブジェクト。 ブラウザの [`window.performance`](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance) と同様です。


### `performance.clearMarks([name])` {#performanceclearmarksname}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.0.0 | このメソッドは、レシーバーとして `performance` オブジェクトを指定して呼び出す必要があります。 |
| v8.5.0 | Added in: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`name` が指定されていない場合、Performance Timeline からすべての `PerformanceMark` オブジェクトを削除します。 `name` が指定されている場合は、指定された名前のマークのみを削除します。

### `performance.clearMeasures([name])` {#performanceclearmeasuresname}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.0.0 | このメソッドは、レシーバーとして `performance` オブジェクトを指定して呼び出す必要があります。 |
| v16.7.0 | Added in: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`name` が指定されていない場合、Performance Timeline からすべての `PerformanceMeasure` オブジェクトを削除します。 `name` が指定されている場合は、指定された名前のメジャーのみを削除します。

### `performance.clearResourceTimings([name])` {#performanceclearresourcetimingsname}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.0.0 | このメソッドは、レシーバーとして `performance` オブジェクトを指定して呼び出す必要があります。 |
| v18.2.0, v16.17.0 | Added in: v18.2.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`name` が指定されていない場合、Resource Timeline からすべての `PerformanceResourceTiming` オブジェクトを削除します。 `name` が指定されている場合は、指定された名前のリソースのみを削除します。

### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**Added in: v14.10.0, v12.19.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `eventLoopUtilization()` の以前の呼び出しの結果。
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `utilization1` より前の `eventLoopUtilization()` の以前の呼び出しの結果。
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

`eventLoopUtilization()` メソッドは、イベントループがアイドル状態であった累積時間とアクティブ状態であった累積時間を、高分解能のミリ秒タイマーとして含むオブジェクトを返します。 `utilization` の値は、計算された Event Loop Utilization (ELU) です。

メインスレッドでブートストラップがまだ完了していない場合、プロパティの値は `0` になります。 ELU は、[Worker threads](/ja/nodejs/api/worker_threads#worker-threads) では、ブートストラップがイベントループ内で発生するため、すぐに利用可能です。

`utilization1` と `utilization2` はどちらもオプションのパラメータです。

`utilization1` が渡された場合、現在の呼び出しの `active` 時間と `idle` 時間の差、および対応する `utilization` 値が計算されて返されます（[`process.hrtime()`](/ja/nodejs/api/process#processhrtimetime) と同様）。

`utilization1` と `utilization2` の両方が渡された場合、2 つの引数間の差が計算されます。 これは、[`process.hrtime()`](/ja/nodejs/api/process#processhrtimetime) とは異なり、ELU の計算が単一の減算よりも複雑であるため、便利なオプションです。

ELU は CPU 使用率に似ていますが、CPU 使用率ではなくイベントループの統計のみを測定します。 これは、イベントループがイベントループのイベントプロバイダー（例： `epoll_wait`）の外で費やした時間の割合を表します。 他の CPU アイドル時間は考慮されません。 以下は、ほとんどアイドル状態のプロセスが高い ELU を持つ例です。

::: code-group
```js [ESM]
import { eventLoopUtilization } from 'node:perf_hooks';
import { spawnSync } from 'node:child_process';

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```

```js [CJS]
'use strict';
const { eventLoopUtilization } = require('node:perf_hooks').performance;
const { spawnSync } = require('node:child_process');

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```
:::

このスクリプトの実行中、CPU はほとんどアイドル状態ですが、`utilization` の値は `1` です。 これは、[`child_process.spawnSync()`](/ja/nodejs/api/child_process#child_processspawnsynccommand-args-options) の呼び出しがイベントループの進行をブロックするためです。

`eventLoopUtilization()` の以前の呼び出しの結果ではなく、ユーザー定義のオブジェクトを渡すと、未定義の動作につながります。 戻り値は、イベントループの正しい状態を反映することを保証されていません。


### `performance.getEntries()` {#performancegetentries}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | このメソッドは、レシーバーとして `performance` オブジェクトとともに呼び出す必要があります。 |
| v16.7.0 | 追加: v16.7.0 |
:::

- 戻り値: [\<PerformanceEntry[]\>](/ja/nodejs/api/perf_hooks#class-performanceentry)

`performanceEntry.startTime` に関して時系列順に並んだ `PerformanceEntry` オブジェクトのリストを返します。 特定のタイプまたは特定の名前のパフォーマンスエントリのみに関心がある場合は、`performance.getEntriesByType()` および `performance.getEntriesByName()` を参照してください。

### `performance.getEntriesByName(name[, type])` {#performancegetentriesbynamename-type}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | このメソッドは、レシーバーとして `performance` オブジェクトとともに呼び出す必要があります。 |
| v16.7.0 | 追加: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<PerformanceEntry[]\>](/ja/nodejs/api/perf_hooks#class-performanceentry)

`performanceEntry.name` が `name` と等しく、オプションで `performanceEntry.entryType` が `type` と等しい、`performanceEntry.startTime` に関して時系列順に並んだ `PerformanceEntry` オブジェクトのリストを返します。

### `performance.getEntriesByType(type)` {#performancegetentriesbytypetype}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | このメソッドは、レシーバーとして `performance` オブジェクトとともに呼び出す必要があります。 |
| v16.7.0 | 追加: v16.7.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<PerformanceEntry[]\>](/ja/nodejs/api/perf_hooks#class-performanceentry)

`performanceEntry.entryType` が `type` と等しい、`performanceEntry.startTime` に関して時系列順に並んだ `PerformanceEntry` オブジェクトのリストを返します。

### `performance.mark(name[, options])` {#performancemarkname-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | このメソッドは、レシーバーとして `performance` オブジェクトとともに呼び出す必要があります。 name 引数はオプションではなくなりました。 |
| v16.0.0 | User Timing Level 3 仕様に準拠するように更新されました。 |
| v8.5.0 | 追加: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) マークに含める追加のオプションの詳細。
    - `startTime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) マーク時間として使用されるオプションのタイムスタンプ。 **デフォルト**: `performance.now()`。

Performance Timeline に新しい `PerformanceMark` エントリを作成します。 `PerformanceMark` は `PerformanceEntry` のサブクラスであり、`performanceEntry.entryType` は常に `'mark'` であり、`performanceEntry.duration` は常に `0` です。 パフォーマンスマークは、Performance Timeline 内の特定の重要な瞬間をマークするために使用されます。

作成された `PerformanceMark` エントリはグローバル Performance Timeline に配置され、`performance.getEntries`、`performance.getEntriesByName`、および `performance.getEntriesByType` でクエリできます。 観測を実行する場合、エントリは `performance.clearMarks` を使用してグローバル Performance Timeline から手動でクリアする必要があります。


### `performance.markResourceTiming(timingInfo, requestedUrl, initiatorType, global, cacheMode, bodyInfo, responseStatus[, deliveryType])` {#performancemarkresourcetimingtiminginfo-requestedurl-initiatortype-global-cachemode-bodyinfo-responsestatus-deliverytype}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.2.0 | bodyInfo、responseStatus、deliveryType 引数が追加されました。 |
| v18.2.0, v16.17.0 | 以下で追加: v18.2.0, v16.17.0 |
:::

- `timingInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Fetch Timing Info](https://fetch.spec.whatwg.org/#fetch-timing-info)
- `requestedUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リソースの URL
- `initiatorType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) イニシエータ名。例: 'fetch'
- `global` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `cacheMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) キャッシュモードは空文字列 ('') または 'local' である必要があります。
- `bodyInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Fetch Response Body Info](https://fetch.spec.whatwg.org/#response-body-info)
- `responseStatus` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) レスポンスのステータスコード
- `deliveryType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 配信タイプ。 **デフォルト:** `''`。

*このプロパティは Node.js による拡張です。Web ブラウザでは利用できません。*

リソースタイムラインに新しい `PerformanceResourceTiming` エントリを作成します。`PerformanceResourceTiming` は `PerformanceEntry` のサブクラスであり、その `performanceEntry.entryType` は常に `'resource'` です。パフォーマンスリソースは、リソースタイムラインの瞬間をマークするために使用されます。

作成された `PerformanceMark` エントリはグローバルリソースタイムラインに配置され、`performance.getEntries`、`performance.getEntriesByName`、および `performance.getEntriesByType` でクエリできます。観測を実行する場合、エントリは `performance.clearResourceTimings` を使用してグローバルパフォーマンスタイムラインから手動でクリアする必要があります。


### `performance.measure(name[, startMarkOrOptions[, endMark]])` {#performancemeasurename-startmarkoroptions-endmark}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.0.0 | このメソッドはレシーバーとして `performance` オブジェクトとともに呼び出されなければなりません。 |
| v16.0.0 | User Timing Level 3 仕様に準拠するように更新されました。 |
| v13.13.0, v12.16.3 | `startMark` と `endMark` パラメータを省略可能にしました。 |
| v8.5.0 | 追加: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `startMarkOrOptions` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) オプション。
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) measure に含める追加のオプションの詳細。
    - `duration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 開始時間と終了時間の間の期間。
    - `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 終了時間として使用されるタイムスタンプ、または以前に記録された mark を識別する文字列。
    - `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 開始時間として使用されるタイムスタンプ、または以前に記録された mark を識別する文字列。


- `endMark` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) オプション。 `startMarkOrOptions` が [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) の場合は省略する必要があります。

Performance Timeline に新しい `PerformanceMeasure` エントリを作成します。 `PerformanceMeasure` は `performanceEntry.entryType` が常に `'measure'` である `PerformanceEntry` のサブクラスであり、`performanceEntry.duration` は `startMark` と `endMark` から経過したミリ秒数を測定します。

`startMark` 引数は、Performance Timeline に*存在する* `PerformanceMark`、または `PerformanceNodeTiming` クラスによって提供されるタイムスタンププロパティのいずれかを識別できます。 指定された `startMark` が存在しない場合は、エラーがスローされます。

オプションの `endMark` 引数は、Performance Timeline に*存在する* `PerformanceMark`、または `PerformanceNodeTiming` クラスによって提供されるタイムスタンププロパティのいずれかを識別する必要があります。 パラメータが渡されない場合、`endMark` は `performance.now()` になり、それ以外の場合、指定された `endMark` が存在しない場合は、エラーがスローされます。

作成された `PerformanceMeasure` エントリはグローバル Performance Timeline に配置され、`performance.getEntries`、`performance.getEntriesByName`、および `performance.getEntriesByType` でクエリできます。 観測が実行されると、エントリは `performance.clearMeasures` を使用してグローバル Performance Timeline から手動でクリアする必要があります。


### `performance.nodeTiming` {#performancenodetiming}

**Added in: v8.5.0**

- [\<PerformanceNodeTiming\>](/ja/nodejs/api/perf_hooks#class-performancenodetiming)

*このプロパティはNode.jsによる拡張です。Webブラウザーでは利用できません。*

Node.jsの特定の操作上のマイルストーンのパフォーマンスメトリクスを提供する`PerformanceNodeTiming`クラスのインスタンス。

### `performance.now()` {#performancenow}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | このメソッドは、レシーバーとして`performance`オブジェクトとともに呼び出す必要があります。 |
| v8.5.0 | Added in: v8.5.0 |
:::

- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

現在の高解像度ミリ秒タイムスタンプを返します。ここで、0は現在の`node`プロセスの開始を表します。

### `performance.setResourceTimingBufferSize(maxSize)` {#performancesetresourcetimingbuffersizemaxsize}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | このメソッドは、レシーバーとして`performance`オブジェクトとともに呼び出す必要があります。 |
| v18.8.0 | Added in: v18.8.0 |
:::

グローバルなパフォーマンスリソースタイミングバッファーサイズを指定された数の「resource」タイプのパフォーマンスエントリオブジェクトに設定します。

デフォルトでは、最大バッファーサイズは250に設定されています。

### `performance.timeOrigin` {#performancetimeorigin}

**Added in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

[`timeOrigin`](https://w3c.github.io/hr-time/#dom-performance-timeorigin)は、現在の`node`プロセスがUnix時間で測定された開始時の高解像度ミリ秒タイムスタンプを指定します。

### `performance.timerify(fn[, options])` {#performancetimerifyfn-options}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | ヒストグラムオプションが追加されました。 |
| v16.0.0 | 純粋なJavaScriptと非同期関数を計測する機能を使用するように再実装されました。 |
| v8.5.0 | Added in: v8.5.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `histogram` [\<RecordableHistogram\>](/ja/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram) ナノ秒単位で実行時間を記録する`perf_hooks.createHistogram()`を使用して作成されたヒストグラムオブジェクト。
  
 

*このプロパティはNode.jsによる拡張です。Webブラウザーでは利用できません。*

ラップされた関数の実行時間を測定する新しい関数内で関数をラップします。タイミングの詳細にアクセスするには、`PerformanceObserver`を`'function'`イベントタイプにサブスクライブする必要があります。



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// パフォーマンスタイムラインエントリが作成されます
wrapped();
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// パフォーマンスタイムラインエントリが作成されます
wrapped();
```
:::

ラップされた関数がpromiseを返す場合、finallyハンドラーがpromiseにアタッチされ、finallyハンドラーが呼び出されると継続時間が報告されます。


### `performance.toJSON()` {#performancetojson}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | このメソッドは、レシーバーとして `performance` オブジェクトを指定して呼び出す必要があります。 |
| v16.1.0 | 追加: v16.1.0 |
:::

`performance` オブジェクトの JSON 表現であるオブジェクト。ブラウザーの [`window.performance.toJSON`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/toJSON) と同様です。

#### イベント: `'resourcetimingbufferfull'` {#event-resourcetimingbufferfull}

**追加: v18.8.0**

グローバルな performance resource timing バッファーがいっぱいになると、`'resourcetimingbufferfull'` イベントが発生します。performance timeline バッファーにさらにエントリを追加できるようにするには、イベントリスナーで `performance.setResourceTimingBufferSize()` でリソースタイミングバッファーのサイズを調整するか、`performance.clearResourceTimings()` でバッファーをクリアします。

## クラス: `PerformanceEntry` {#class-performanceentry}

**追加: v8.5.0**

このクラスのコンストラクターは、ユーザーに直接公開されていません。

### `performanceEntry.duration` {#performanceentryduration}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | このプロパティゲッターは、レシーバーとして `PerformanceEntry` オブジェクトを指定して呼び出す必要があります。 |
| v8.5.0 | 追加: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

このエントリに経過した合計ミリ秒数。この値は、すべてのパフォーマンスエントリタイプで意味があるとは限りません。

### `performanceEntry.entryType` {#performanceentryentrytype}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | このプロパティゲッターは、レシーバーとして `PerformanceEntry` オブジェクトを指定して呼び出す必要があります。 |
| v8.5.0 | 追加: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

パフォーマンスエントリのタイプ。次のいずれかになります。

- `'dns'` (Node.js のみ)
- `'function'` (Node.js のみ)
- `'gc'` (Node.js のみ)
- `'http2'` (Node.js のみ)
- `'http'` (Node.js のみ)
- `'mark'` (Web で利用可能)
- `'measure'` (Web で利用可能)
- `'net'` (Node.js のみ)
- `'node'` (Node.js のみ)
- `'resource'` (Web で利用可能)


### `performanceEntry.name` {#performanceentryname}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.0.0 | このプロパティゲッターは、レシーバーとして `PerformanceEntry` オブジェクトを指定して呼び出す必要があります。 |
| v8.5.0 | 追加: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

パフォーマンスエントリーの名前。

### `performanceEntry.startTime` {#performanceentrystarttime}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.0.0 | このプロパティゲッターは、レシーバーとして `PerformanceEntry` オブジェクトを指定して呼び出す必要があります。 |
| v8.5.0 | 追加: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

パフォーマンスエントリーの開始時刻を示す高分解能のミリ秒タイムスタンプ。

## クラス: `PerformanceMark` {#class-performancemark}

**追加: v18.2.0, v16.17.0**

- 拡張: [\<PerformanceEntry\>](/ja/nodejs/api/perf_hooks#class-performanceentry)

`Performance.mark()` メソッドを使用して作成されたマークを公開します。

### `performanceMark.detail` {#performancemarkdetail}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.0.0 | このプロパティゲッターは、レシーバーとして `PerformanceMark` オブジェクトを指定して呼び出す必要があります。 |
| v16.0.0 | 追加: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`Performance.mark()` メソッドで作成するときに指定された追加の詳細。

## クラス: `PerformanceMeasure` {#class-performancemeasure}

**追加: v18.2.0, v16.17.0**

- 拡張: [\<PerformanceEntry\>](/ja/nodejs/api/perf_hooks#class-performanceentry)

`Performance.measure()` メソッドを使用して作成されたメジャーを公開します。

このクラスのコンストラクターは、ユーザーに直接公開されていません。

### `performanceMeasure.detail` {#performancemeasuredetail}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.0.0 | このプロパティゲッターは、レシーバーとして `PerformanceMeasure` オブジェクトを指定して呼び出す必要があります。 |
| v16.0.0 | 追加: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`Performance.measure()` メソッドで作成するときに指定された追加の詳細。


## クラス: `PerformanceNodeEntry` {#class-performancenodeentry}

**追加:** v19.0.0

- 拡張: [\<PerformanceEntry\>](/ja/nodejs/api/perf_hooks#class-performanceentry)

*このクラスは Node.js による拡張です。Web ブラウザーでは利用できません。*

詳細な Node.js タイミングデータを提供します。

このクラスのコンストラクターは、ユーザーに直接公開されていません。

### `performanceNodeEntry.detail` {#performancenodeentrydetail}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | このプロパティゲッターは、レシーバーとして `PerformanceNodeEntry` オブジェクトとともに呼び出す必要があります。 |
| v16.0.0 | 追加: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`entryType` に固有の追加の詳細。

### `performanceNodeEntry.flags` {#performancenodeentryflags}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | ランタイムで非推奨になりました。entryType が 'gc' の場合、detail プロパティに移動されました。 |
| v13.9.0, v12.17.0 | 追加: v13.9.0, v12.17.0 |
:::

::: danger [Stable: 0 - 非推奨]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに `performanceNodeEntry.detail` を使用してください。
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`performanceEntry.entryType` が `'gc'` に等しい場合、`performance.flags` プロパティにはガベージコレクション操作に関する追加情報が含まれます。値は次のいずれかになります。

- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`

### `performanceNodeEntry.kind` {#performancenodeentrykind}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | ランタイムで非推奨になりました。entryType が 'gc' の場合、detail プロパティに移動されました。 |
| v8.5.0 | 追加: v8.5.0 |
:::

::: danger [Stable: 0 - 非推奨]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに `performanceNodeEntry.detail` を使用してください。
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`performanceEntry.entryType` が `'gc'` に等しい場合、`performance.kind` プロパティは発生したガベージコレクション操作の種類を識別します。値は次のいずれかになります。

- `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`


### Garbage Collection ('gc') の詳細 {#garbage-collection-gc-details}

`performanceEntry.type` が `'gc'` に等しい場合、`performanceNodeEntry.detail` プロパティは、以下の2つのプロパティを持つ[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)になります。

- `kind` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 次のいずれか:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`
  
 
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 次のいずれか:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`
  
 

### HTTP ('http') の詳細 {#http-http-details}

`performanceEntry.type` が `'http'` に等しい場合、`performanceNodeEntry.detail` プロパティは、追加情報を含む[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)になります。

`performanceEntry.name` が `HttpClient` に等しい場合、`detail` には次のプロパティが含まれます: `req`, `res`。そして、`req` プロパティは、`method`, `url`, `headers` を含む[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)になり、`res` プロパティは、`statusCode`, `statusMessage`, `headers` を含む[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)になります。

`performanceEntry.name` が `HttpRequest` に等しい場合、`detail` には次のプロパティが含まれます: `req`, `res`。そして、`req` プロパティは、`method`, `url`, `headers` を含む[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)になり、`res` プロパティは、`statusCode`, `statusMessage`, `headers` を含む[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)になります。

これは追加のメモリオーバーヘッドを加える可能性があり、診断目的でのみ使用されるべきで、デフォルトで本番環境でオンのままにすべきではありません。


### HTTP/2 ('http2') の詳細 {#http/2-http2-details}

`performanceEntry.type` が `'http2'` と等しい場合、`performanceNodeEntry.detail` プロパティは、追加のパフォーマンス情報を含む[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)になります。

`performanceEntry.name` が `Http2Stream` と等しい場合、`detail` には次のプロパティが含まれます。

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この `Http2Stream` に対して受信した `DATA` フレームのバイト数。
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この `Http2Stream` に対して送信した `DATA` フレームのバイト数。
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 関連する `Http2Stream` の識別子。
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry` の `startTime` から最初の `DATA` フレームを受信するまでの経過時間（ミリ秒単位）。
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry` の `startTime` から最初の `DATA` フレームを送信するまでの経過時間（ミリ秒単位）。
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry` の `startTime` から最初のヘッダーを受信するまでの経過時間（ミリ秒単位）。

`performanceEntry.name` が `Http2Session` と等しい場合、`detail` には次のプロパティが含まれます。

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この `Http2Session` に対して受信したバイト数。
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この `Http2Session` に対して送信したバイト数。
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session` が受信した HTTP/2 フレームの数。
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session` が送信した HTTP/2 フレームの数。
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session` の存続期間中に同時にオープンされたストリームの最大数。
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PING` フレームの送信からその確認応答の受信までの経過時間（ミリ秒単位）。 `PING` フレームが `Http2Session` で送信された場合にのみ存在します。
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) すべての `Http2Stream` インスタンスの平均継続時間（ミリ秒単位）。
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session` によって処理された `Http2Stream` インスタンスの数。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `Http2Session` の種類を識別するための `'server'` または `'client'`。


### Timerify ('function') の詳細 {#timerify-function-details}

`performanceEntry.type` が `'function'` と等しい場合、`performanceNodeEntry.detail` プロパティは、時間計測された関数への入力引数をリストした [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) になります。

### Net ('net') の詳細 {#net-net-details}

`performanceEntry.type` が `'net'` と等しい場合、`performanceNodeEntry.detail` プロパティは、追加情報を含む [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) になります。

`performanceEntry.name` が `connect` と等しい場合、`detail` は次のプロパティを含みます: `host`, `port`。

### DNS ('dns') の詳細 {#dns-dns-details}

`performanceEntry.type` が `'dns'` と等しい場合、`performanceNodeEntry.detail` プロパティは、追加情報を含む [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) になります。

`performanceEntry.name` が `lookup` と等しい場合、`detail` は次のプロパティを含みます: `hostname`, `family`, `hints`, `verbatim`, `addresses`。

`performanceEntry.name` が `lookupService` と等しい場合、`detail` は次のプロパティを含みます: `host`, `port`, `hostname`, `service`。

`performanceEntry.name` が `queryxxx` または `getHostByAddr` と等しい場合、`detail` は次のプロパティを含みます: `host`, `ttl`, `result`。`result` の値は、`queryxxx` または `getHostByAddr` の結果と同じです。

## Class: `PerformanceNodeTiming` {#class-performancenodetiming}

**Added in: v8.5.0**

- 継承: [\<PerformanceEntry\>](/ja/nodejs/api/perf_hooks#class-performanceentry)

*このプロパティは Node.js による拡張です。Web ブラウザーでは利用できません。*

Node.js 自体のタイミングに関する詳細を提供します。このクラスのコンストラクターはユーザーに公開されていません。

### `performanceNodeTiming.bootstrapComplete` {#performancenodetimingbootstrapcomplete}

**Added in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js プロセスがブートストラップを完了した高解像度ミリ秒タイムスタンプ。ブートストラップがまだ完了していない場合、プロパティの値は -1 です。


### `performanceNodeTiming.environment` {#performancenodetimingenvironment}

**Added in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js環境が初期化された時点での高解像度ミリ秒タイムスタンプ。

### `performanceNodeTiming.idleTime` {#performancenodetimingidletime}

**Added in: v14.10.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

イベントループのイベントプロバイダー（例：`epoll_wait`）内で、イベントループがアイドル状態だった時間の高解像度ミリ秒タイムスタンプ。 これはCPU使用率を考慮していません。 イベントループがまだ開始されていない場合（例：メインスクリプトの最初のティック）、プロパティの値は0です。

### `performanceNodeTiming.loopExit` {#performancenodetimingloopexit}

**Added in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.jsのイベントループが終了した時点での高解像度ミリ秒タイムスタンプ。 イベントループがまだ終了していない場合、プロパティの値は-1です。 これは、[`'exit'`](/ja/nodejs/api/process#event-exit)イベントのハンドラーでのみ、-1以外の値を持ちます。

### `performanceNodeTiming.loopStart` {#performancenodetimingloopstart}

**Added in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.jsのイベントループが開始された時点での高解像度ミリ秒タイムスタンプ。 イベントループがまだ開始されていない場合（例：メインスクリプトの最初のティック）、プロパティの値は-1です。

### `performanceNodeTiming.nodeStart` {#performancenodetimingnodestart}

**Added in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.jsプロセスが初期化された時点での高解像度ミリ秒タイムスタンプ。

### `performanceNodeTiming.uvMetricsInfo` {#performancenodetiminguvmetricsinfo}

**Added in: v22.8.0, v20.18.0**

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `loopCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) イベントループのイテレーション数。
    - `events` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) イベントハンドラーによって処理されたイベントの数。
    - `eventsWaiting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) イベントプロバイダーが呼び出されたときに、処理されるのを待っていたイベントの数。
  
 

これは `uv_metrics_info` 関数へのラッパーです。 イベントループの現在のメトリクスセットを返します。

現在のループイテレーション中にスケジュールされたすべての操作が終了する前にメトリクスを収集しないように、`setImmediate` を使用して実行がスケジュールされた関数内でこのプロパティを使用することをお勧めします。

::: code-group
```js [CJS]
const { performance } = require('node:perf_hooks');

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```

```js [ESM]
import { performance } from 'node:perf_hooks';

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```
:::


### `performanceNodeTiming.v8Start` {#performancenodetimingv8start}

**Added in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

V8プラットフォームが初期化された高解像度ミリ秒のタイムスタンプ。

## Class: `PerformanceResourceTiming` {#class-performanceresourcetiming}

**Added in: v18.2.0, v16.17.0**

- Extends: [\<PerformanceEntry\>](/ja/nodejs/api/perf_hooks#class-performanceentry)

アプリケーションのリソースのロードに関する詳細なネットワークタイミングデータを提供します。

このクラスのコンストラクターは、ユーザーに直接公開されていません。

### `performanceResourceTiming.workerStart` {#performanceresourcetimingworkerstart}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | このプロパティゲッターは、`PerformanceResourceTiming`オブジェクトをレシーバーとして呼び出す必要があります。 |
| v18.2.0, v16.17.0 | Added in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`fetch`リクエストのディスパッチ直前の高解像度ミリ秒のタイムスタンプ。 リソースがワーカーによってインターセプトされない場合、このプロパティは常に0を返します。

### `performanceResourceTiming.redirectStart` {#performanceresourcetimingredirectstart}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | このプロパティゲッターは、`PerformanceResourceTiming`オブジェクトをレシーバーとして呼び出す必要があります。 |
| v18.2.0, v16.17.0 | Added in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

リダイレクトを開始するfetchの開始時刻を表す高解像度ミリ秒のタイムスタンプ。

### `performanceResourceTiming.redirectEnd` {#performanceresourcetimingredirectend}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | このプロパティゲッターは、`PerformanceResourceTiming`オブジェクトをレシーバーとして呼び出す必要があります。 |
| v18.2.0, v16.17.0 | Added in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

最後のリダイレクトのレスポンスの最後のバイトを受信した直後に作成される高解像度ミリ秒のタイムスタンプ。


### `performanceResourceTiming.fetchStart` {#performanceresourcetimingfetchstart}

::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | このプロパティのゲッターは、`PerformanceResourceTiming` オブジェクトをレシーバーとして呼び出す必要があります。 |
| v18.2.0, v16.17.0 | Added in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js がリソースのフェッチを開始する直前の高解像度ミリ秒タイムスタンプ。

### `performanceResourceTiming.domainLookupStart` {#performanceresourcetimingdomainlookupstart}

::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | このプロパティのゲッターは、`PerformanceResourceTiming` オブジェクトをレシーバーとして呼び出す必要があります。 |
| v18.2.0, v16.17.0 | Added in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js がリソースのドメイン名ルックアップを開始する直前の高解像度ミリ秒タイムスタンプ。

### `performanceResourceTiming.domainLookupEnd` {#performanceresourcetimingdomainlookupend}

::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | このプロパティのゲッターは、`PerformanceResourceTiming` オブジェクトをレシーバーとして呼び出す必要があります。 |
| v18.2.0, v16.17.0 | Added in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js がリソースのドメイン名ルックアップを完了した直後の時間を表す高解像度ミリ秒タイムスタンプ。

### `performanceResourceTiming.connectStart` {#performanceresourcetimingconnectstart}

::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | このプロパティのゲッターは、`PerformanceResourceTiming` オブジェクトをレシーバーとして呼び出す必要があります。 |
| v18.2.0, v16.17.0 | Added in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js がリソースを取得するためにサーバーへの接続を確立し始める直前の時間を表す高解像度ミリ秒タイムスタンプ。


### `performanceResourceTiming.connectEnd` {#performanceresourcetimingconnectend}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.0.0 | このプロパティのゲッターは、レシーバーとして `PerformanceResourceTiming` オブジェクトを指定して呼び出す必要があります。 |
| v18.2.0, v16.17.0 | v18.2.0, v16.17.0 で追加 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js がリソースを取得するためにサーバーへの接続を確立した後、すぐに経過した時間を示す高解像度のミリ秒タイムスタンプ。

### `performanceResourceTiming.secureConnectionStart` {#performanceresourcetimingsecureconnectionstart}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.0.0 | このプロパティのゲッターは、レシーバーとして `PerformanceResourceTiming` オブジェクトを指定して呼び出す必要があります。 |
| v18.2.0, v16.17.0 | v18.2.0, v16.17.0 で追加 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js が現在の接続をセキュリティで保護するためのハンドシェイクプロセスを開始する直前に経過した時間を示す高解像度のミリ秒タイムスタンプ。

### `performanceResourceTiming.requestStart` {#performanceresourcetimingrequeststart}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.0.0 | このプロパティのゲッターは、レシーバーとして `PerformanceResourceTiming` オブジェクトを指定して呼び出す必要があります。 |
| v18.2.0, v16.17.0 | v18.2.0, v16.17.0 で追加 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js がサーバーから応答の最初のバイトを受信する直前に経過した時間を示す高解像度のミリ秒タイムスタンプ。

### `performanceResourceTiming.responseEnd` {#performanceresourcetimingresponseend}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.0.0 | このプロパティのゲッターは、レシーバーとして `PerformanceResourceTiming` オブジェクトを指定して呼び出す必要があります。 |
| v18.2.0, v16.17.0 | v18.2.0, v16.17.0 で追加 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js がリソースの最後のバイトを受信した直後、またはトランスポート接続が閉じられる直前のいずれか早い方で経過した時間を示す高解像度のミリ秒タイムスタンプ。


### `performanceResourceTiming.transferSize` {#performanceresourcetimingtransfersize}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | このプロパティゲッターは、レシーバーとして `PerformanceResourceTiming` オブジェクトを使用して呼び出す必要があります。 |
| v18.2.0, v16.17.0 | 追加: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

フェッチされたリソースのサイズ（オクテット単位）を表す数値。 サイズには、レスポンスヘッダーフィールドとレスポンスペイロードボディが含まれます。

### `performanceResourceTiming.encodedBodySize` {#performanceresourcetimingencodedbodysize}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | このプロパティゲッターは、レシーバーとして `PerformanceResourceTiming` オブジェクトを使用して呼び出す必要があります。 |
| v18.2.0, v16.17.0 | 追加: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

適用されたcontent-codingを削除する前に、フェッチ（HTTPまたはキャッシュ）から受信したペイロードボディのサイズ（オクテット単位）を表す数値。

### `performanceResourceTiming.decodedBodySize` {#performanceresourcetimingdecodedbodysize}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | このプロパティゲッターは、レシーバーとして `PerformanceResourceTiming` オブジェクトを使用して呼び出す必要があります。 |
| v18.2.0, v16.17.0 | 追加: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

適用されたcontent-codingを削除した後に、フェッチ（HTTPまたはキャッシュ）から受信したメッセージボディのサイズ（オクテット単位）を表す数値。

### `performanceResourceTiming.toJSON()` {#performanceresourcetimingtojson}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | このメソッドは、レシーバーとして `PerformanceResourceTiming` オブジェクトを使用して呼び出す必要があります。 |
| v18.2.0, v16.17.0 | 追加: v18.2.0, v16.17.0 |
:::

`PerformanceResourceTiming`オブジェクトのJSON表現である`object`を返します。

## クラス: `PerformanceObserver` {#class-performanceobserver}

**追加: v8.5.0**

### `PerformanceObserver.supportedEntryTypes` {#performanceobserversupportedentrytypes}

**追加: v16.0.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

サポートされている型を取得します。


### `new PerformanceObserver(callback)` {#new-performanceobservercallback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v8.5.0 | 追加: v8.5.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `list` [\<PerformanceObserverEntryList\>](/ja/nodejs/api/perf_hooks#class-performanceobserverentrylist)
    - `observer` [\<PerformanceObserver\>](/ja/nodejs/api/perf_hooks#class-performanceobserver)
  
 

`PerformanceObserver` オブジェクトは、新しい `PerformanceEntry` インスタンスが Performance Timeline に追加されたときに通知を提供します。

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```
:::

`PerformanceObserver` インスタンスは独自のパフォーマンスオーバーヘッドを発生させるため、インスタンスを無期限に通知に登録したままにすべきではありません。ユーザーは不要になったらすぐにオブザーバーを切断する必要があります。

`callback` は、`PerformanceObserver` が新しい `PerformanceEntry` インスタンスについて通知されたときに呼び出されます。コールバックは、`PerformanceObserverEntryList` インスタンスと `PerformanceObserver` への参照を受け取ります。

### `performanceObserver.disconnect()` {#performanceobserverdisconnect}

**追加: v8.5.0**

`PerformanceObserver` インスタンスをすべての通知から切断します。


### `performanceObserver.observe(options)` {#performanceobserverobserveoptions}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v16.7.0 | Performance Timeline Level 2 に準拠するように更新されました。 `buffered` オプションが再び追加されました。 |
| v16.0.0 | User Timing Level 3 に準拠するように更新されました。 `buffered` オプションが削除されました。 |
| v8.5.0 | 追加: v8.5.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 単一の[\<PerformanceEntry\>](/ja/nodejs/api/perf_hooks#class-performanceentry)型。 `entryTypes` がすでに指定されている場合は、指定しないでください。
    - `entryTypes` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) オブザーバーが関心を持つ[\<PerformanceEntry\>](/ja/nodejs/api/perf_hooks#class-performanceentry)インスタンスの型を識別する文字列の配列。 提供されない場合、エラーがスローされます。
    - `buffered` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) true の場合、オブザーバーのコールバックはグローバルな `PerformanceEntry` バッファリングされたエントリのリストで呼び出されます。 false の場合、タイムポイント以降に作成された `PerformanceEntry` のみがオブザーバーのコールバックに送信されます。 **デフォルト:** `false`。

[\<PerformanceObserver\>](/ja/nodejs/api/perf_hooks#class-performanceobserver)インスタンスを、`options.entryTypes` または `options.type` のいずれかで識別される新しい[\<PerformanceEntry\>](/ja/nodejs/api/perf_hooks#class-performanceentry)インスタンスの通知にサブスクライブします。

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  // 非同期で一度呼び出されます。 `list` には 3 つのアイテムが含まれています。
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  // 非同期で一度呼び出されます。 `list` には 3 つのアイテムが含まれています。
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```
:::


### `performanceObserver.takeRecords()` {#performanceobservertakerecords}

**追加:** v16.0.0

- 戻り値: [\<PerformanceEntry[]\>](/ja/nodejs/api/perf_hooks#class-performanceentry) パフォーマンスオブザーバーに保存されているエントリの現在のリストを返し、それを空にします。

## クラス: `PerformanceObserverEntryList` {#class-performanceobserverentrylist}

**追加:** v8.5.0

`PerformanceObserverEntryList` クラスは、`PerformanceObserver` に渡された `PerformanceEntry` インスタンスへのアクセスを提供するために使用されます。このクラスのコンストラクターは、ユーザーには公開されていません。

### `performanceObserverEntryList.getEntries()` {#performanceobserverentrylistgetentries}

**追加:** v8.5.0

- 戻り値: [\<PerformanceEntry[]\>](/ja/nodejs/api/perf_hooks#class-performanceentry)

`performanceEntry.startTime` を基準にして、`PerformanceEntry` オブジェクトのリストを時系列順に返します。

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByName(name[, type])` {#performanceobserverentrylistgetentriesbynamename-type}

**Added in: v8.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<PerformanceEntry[]\>](/ja/nodejs/api/perf_hooks#class-performanceentry)

`performanceEntry.name` が `name` と等しく、オプションで、`performanceEntry.entryType` が `type` と等しい `PerformanceEntry` オブジェクトのリストを、`performanceEntry.startTime` に関して時系列順で返します。

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByType(type)` {#performanceobserverentrylistgetentriesbytypetype}

**Added in: v8.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<PerformanceEntry[]\>](/ja/nodejs/api/perf_hooks#class-performanceentry)

`performanceEntry.entryType` が `type` と等しい `PerformanceEntry` オブジェクトのリストを、`performanceEntry.startTime` を基準にして時系列順に返します。

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::

## `perf_hooks.createHistogram([options])` {#perf_hookscreatehistogramoptions}

**Added in: v15.9.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `lowest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 識別可能な最小値。0 より大きい整数値でなければなりません。 **Default:** `1`.
    - `highest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 記録可能な最大値。`lowest` の 2 倍以上の整数値でなければなりません。 **Default:** `Number.MAX_SAFE_INTEGER`.
    - `figures` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 精度桁数。`1` から `5` の間の数値でなければなりません。 **Default:** `3`.
  
 
- 戻り値: [\<RecordableHistogram\>](/ja/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

[\<RecordableHistogram\>](/ja/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram) を返します。


## `perf_hooks.monitorEventLoopDelay([options])` {#perf_hooksmonitoreventloopdelayoptions}

**Added in: v11.10.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `resolution` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) サンプリングレート（ミリ秒単位）。ゼロより大きくなければなりません。**デフォルト:** `10`。
  
 
- 戻り値: [\<IntervalHistogram\>](/ja/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram)

*このプロパティはNode.jsによる拡張です。Webブラウザーでは利用できません。*

時間経過に伴うイベントループの遅延をサンプリングして報告する`IntervalHistogram`オブジェクトを作成します。遅延はナノ秒単位で報告されます。

タイマーを使用してイベントループのおおよその遅延を検出するのは、タイマーの実行がlibuvイベントループのライフサイクルに具体的に結びついているためです。つまり、ループの遅延はタイマーの実行の遅延を引き起こし、それらの遅延は具体的にこのAPIが検出することを意図しているものです。

::: code-group
```js [ESM]
import { monitorEventLoopDelay } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Do something.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```

```js [CJS]
const { monitorEventLoopDelay } = require('node:perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Do something.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```
:::

## Class: `Histogram` {#class-histogram}

**Added in: v11.10.0**

### `histogram.count` {#histogramcount}

**Added in: v17.4.0, v16.14.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ヒストグラムによって記録されたサンプル数。

### `histogram.countBigInt` {#histogramcountbigint}

**Added in: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

ヒストグラムによって記録されたサンプル数。


### `histogram.exceeds` {#histogramexceeds}

**Added in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

イベントループの遅延が最大1時間のイベントループ遅延の閾値を超えた回数。

### `histogram.exceedsBigInt` {#histogramexceedsbigint}

**Added in: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

イベントループの遅延が最大1時間のイベントループ遅延の閾値を超えた回数。

### `histogram.max` {#histogrammax}

**Added in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

記録されたイベントループ遅延の最大値。

### `histogram.maxBigInt` {#histogrammaxbigint}

**Added in: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

記録されたイベントループ遅延の最大値。

### `histogram.mean` {#histogrammean}

**Added in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

記録されたイベントループ遅延の平均値。

### `histogram.min` {#histogrammin}

**Added in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

記録されたイベントループ遅延の最小値。

### `histogram.minBigInt` {#histogramminbigint}

**Added in: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

記録されたイベントループ遅延の最小値。

### `histogram.percentile(percentile)` {#histogrampercentilepercentile}

**Added in: v11.10.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 範囲 (0, 100] のパーセンタイル値。
- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

指定されたパーセンタイルの値を返します。

### `histogram.percentileBigInt(percentile)` {#histogrampercentilebigintpercentile}

**Added in: v17.4.0, v16.14.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 範囲 (0, 100] のパーセンタイル値。
- 戻り値: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

指定されたパーセンタイルの値を返します。


### `histogram.percentiles` {#histogrampercentiles}

**Added in: v11.10.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

累積されたパーセンタイル分布の詳細を示す `Map` オブジェクトを返します。

### `histogram.percentilesBigInt` {#histogrampercentilesbigint}

**Added in: v17.4.0, v16.14.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

累積されたパーセンタイル分布の詳細を示す `Map` オブジェクトを返します。

### `histogram.reset()` {#histogramreset}

**Added in: v11.10.0**

収集されたヒストグラムデータをリセットします。

### `histogram.stddev` {#histogramstddev}

**Added in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

記録されたイベントループ遅延の標準偏差。

## Class: `IntervalHistogram extends Histogram` {#class-intervalhistogram-extends-histogram}

指定された間隔で定期的に更新される `Histogram`。

### `histogram.disable()` {#histogramdisable}

**Added in: v11.10.0**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

更新間隔タイマーを無効にします。タイマーが停止した場合は `true`、すでに停止していた場合は `false` を返します。

### `histogram.enable()` {#histogramenable}

**Added in: v11.10.0**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

更新間隔タイマーを有効にします。タイマーが開始された場合は `true`、すでに開始されていた場合は `false` を返します。

### `IntervalHistogram` のクローン {#cloning-an-intervalhistogram}

[\<IntervalHistogram\>](/ja/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram) インスタンスは [\<MessagePort\>](/ja/nodejs/api/worker_threads#class-messageport) を介して複製できます。受信側では、ヒストグラムは `enable()` および `disable()` メソッドを実装していないプレーンな [\<Histogram\>](/ja/nodejs/api/perf_hooks#class-histogram) オブジェクトとして複製されます。

## Class: `RecordableHistogram extends Histogram` {#class-recordablehistogram-extends-histogram}

**Added in: v15.9.0, v14.18.0**

### `histogram.add(other)` {#histogramaddother}

**Added in: v17.4.0, v16.14.0**

- `other` [\<RecordableHistogram\>](/ja/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

`other` の値をこのヒストグラムに追加します。


### `histogram.record(val)` {#histogramrecordval}

**追加:** v15.9.0, v14.18.0

- `val` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) ヒストグラムに記録する量。

### `histogram.recordDelta()` {#histogramrecorddelta}

**追加:** v15.9.0, v14.18.0

`recordDelta()` の前回の呼び出しから経過した時間（ナノ秒単位）を計算し、その量をヒストグラムに記録します。

## 例 {#examples}

### 非同期操作の期間の測定 {#measuring-the-duration-of-async-operations}

次の例では、[Async Hooks](/ja/nodejs/api/async_hooks) および Performance API を使用して、Timeout 操作の実際の期間 (コールバックの実行にかかった時間を含む) を測定します。

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';
import { performance, PerformanceObserver } from 'node:perf_hooks';

const set = new Set();
const hook = createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```

```js [CJS]
'use strict';
const async_hooks = require('node:async_hooks');
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const set = new Set();
const hook = async_hooks.createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```
:::


### 依存関係のロードにかかる時間の計測 {#measuring-how-long-it-takes-to-load-dependencies}

以下の例では、依存関係をロードするための `require()` 操作の時間を測定します。

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

// オブザーバーを有効化
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`import('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

const timedImport = performance.timerify(async (module) => {
  return await import(module);
});

await timedImport('some-module');
```

```js [CJS]
'use strict';
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');
const mod = require('node:module');

// require 関数にモンキーパッチを当てる
mod.Module.prototype.require =
  performance.timerify(mod.Module.prototype.require);
require = performance.timerify(require);

// オブザーバーを有効化
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`require('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

require('some-module');
```
:::

### 1 回の HTTP ラウンドトリップにかかる時間の計測 {#measuring-how-long-one-http-round-trip-takes}

以下の例は、HTTP クライアント (`OutgoingMessage`) および HTTP リクエスト (`IncomingMessage`) で費やされた時間を追跡するために使用されます。HTTP クライアントの場合、これはリクエストの開始からレスポンスの受信までの時間間隔を意味し、HTTP リクエストの場合、これはリクエストの受信からレスポンスの送信までの時間間隔を意味します。

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { createServer, get } from 'node:http';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  get(`http://127.0.0.1:${PORT}`);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const http = require('node:http');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

http.createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  http.get(`http://127.0.0.1:${PORT}`);
});
```
:::


### `net.connect` (TCP のみ) が成功した場合の所要時間の測定 {#measuring-how-long-the-netconnect-only-for-tcp-takes-when-the-connection-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { connect, createServer } from 'node:net';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  connect(PORT);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const net = require('node:net');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
net.createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  net.connect(PORT);
});
```
:::

### リクエストが成功した場合の DNS の所要時間の測定 {#measuring-how-long-the-dns-takes-when-the-request-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { lookup, promises } from 'node:dns';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
lookup('localhost', () => {});
promises.resolve('localhost');
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const dns = require('node:dns');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
dns.lookup('localhost', () => {});
dns.promises.resolve('localhost');
```
:::

