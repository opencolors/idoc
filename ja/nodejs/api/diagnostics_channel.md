---
title: Node.js 診断チャネル
description: Node.jsの診断チャネルモジュールは、診断情報の名前付きチャネルを作成、公開、および購読するためのAPIを提供し、アプリケーションの監視とデバッグを向上させます。
head:
  - - meta
    - name: og:title
      content: Node.js 診断チャネル | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsの診断チャネルモジュールは、診断情報の名前付きチャネルを作成、公開、および購読するためのAPIを提供し、アプリケーションの監視とデバッグを向上させます。
  - - meta
    - name: twitter:title
      content: Node.js 診断チャネル | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsの診断チャネルモジュールは、診断情報の名前付きチャネルを作成、公開、および購読するためのAPIを提供し、アプリケーションの監視とデバッグを向上させます。
---


# Diagnostics Channel {#diagnostics-channel}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.2.0, v18.13.0 | diagnostics_channel が Stable になりました。 |
| v15.1.0, v14.17.0 | 追加: v15.1.0, v14.17.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定版: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/diagnostics_channel.js](https://github.com/nodejs/node/blob/v23.5.0/lib/diagnostics_channel.js)

`node:diagnostics_channel` モジュールは、診断目的で任意のメッセージデータを報告するための名前付きチャネルを作成する API を提供します。

これは以下を使用してアクセスできます:

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
```
:::

診断メッセージを報告したいモジュール作成者は、メッセージを報告するために 1 つまたは複数のトップレベルチャネルを作成することを目的としています。 チャネルは実行時に取得することもできますが、それを行うと追加のオーバーヘッドが発生するため、推奨されません。 チャネルは便宜上エクスポートできますが、名前がわかっている限り、どこでも取得できます。

モジュールが他の人が使用する診断データを生成することを意図している場合は、どの名前付きチャネルが使用されているか、およびメッセージデータの形状に関するドキュメントを含めることをお勧めします。 チャネル名には、他のモジュールからのデータとの衝突を避けるために、通常、モジュール名を含める必要があります。

## 公開 API {#public-api}

### 概要 {#overview}

以下は、公開 API の簡単な概要です。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

// 再利用可能なチャネルオブジェクトを取得
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // データを受信
}

// チャネルをサブスクライブ
diagnostics_channel.subscribe('my-channel', onMessage);

// チャネルにアクティブなサブスクライバーがいるかどうかを確認
if (channel.hasSubscribers) {
  // チャネルにデータを公開
  channel.publish({
    some: 'data',
  });
}

// チャネルのサブスクライブを解除
diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

// 再利用可能なチャネルオブジェクトを取得
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // データを受信
}

// チャネルをサブスクライブ
diagnostics_channel.subscribe('my-channel', onMessage);

// チャネルにアクティブなサブスクライバーがいるかどうかを確認
if (channel.hasSubscribers) {
  // チャネルにデータを公開
  channel.publish({
    some: 'data',
  });
}

// チャネルのサブスクライブを解除
diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::


#### `diagnostics_channel.hasSubscribers(name)` {#diagnostics_channelhassubscribersname}

**追加:** v15.1.0, v14.17.0

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) チャネル名
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) アクティブなサブスクライバーがいるかどうか

指定された名前のチャネルにアクティブなサブスクライバーがいるかどうかを確認します。送信したいメッセージの準備にコストがかかる場合に役立ちます。

このAPIはオプションですが、非常にパフォーマンスが重要なコードからメッセージを公開しようとする場合に役立ちます。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // サブスクライバーがいるため、メッセージを準備して公開します
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // サブスクライバーがいるため、メッセージを準備して公開します
}
```
:::

#### `diagnostics_channel.channel(name)` {#diagnostics_channelchannelname}

**追加:** v15.1.0, v14.17.0

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) チャネル名
- 戻り値: [\<Channel\>](/ja/nodejs/api/diagnostics_channel#class-channel) 指定されたチャネルオブジェクト

これは、名前付きチャネルに公開したい人にとっての主要なエントリポイントです。可能な限りパブリッシュ時のオーバーヘッドを削減するように最適化されたチャネルオブジェクトを生成します。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');
```
:::

#### `diagnostics_channel.subscribe(name, onMessage)` {#diagnostics_channelsubscribename-onmessage}

**追加:** v18.7.0, v16.17.0

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) チャネル名
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) チャネルメッセージを受信するハンドラー
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) メッセージデータ
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) チャネルの名前
  
 

このチャネルをサブスクライブするためのメッセージハンドラーを登録します。このメッセージハンドラーは、メッセージがチャネルに公開されるたびに同期的に実行されます。メッセージハンドラーでスローされたエラーは、[`'uncaughtException'`](/ja/nodejs/api/process#event-uncaughtexception) をトリガーします。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // データを受信しました
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // データを受信しました
});
```
:::


#### `diagnostics_channel.unsubscribe(name, onMessage)` {#diagnostics_channelunsubscribename-onmessage}

**追加:** v18.7.0, v16.17.0

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) チャネル名
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 削除する以前にサブスクライブしたハンドラー
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ハンドラーが見つかった場合は`true`、そうでない場合は`false`。

[`diagnostics_channel.subscribe(name, onMessage)`](/ja/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage)で以前にこのチャネルに登録されたメッセージハンドラーを削除します。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::

#### `diagnostics_channel.tracingChannel(nameOrChannels)` {#diagnostics_channeltracingchannelnameorchannels}

**追加:** v19.9.0, v18.19.0

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `nameOrChannels` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TracingChannel\>](/ja/nodejs/api/diagnostics_channel#class-tracingchannel) チャネル名またはすべての[TracingChannel Channels](/ja/nodejs/api/diagnostics_channel#tracingchannel-channels)を含むオブジェクト
- 戻り値: [\<TracingChannel\>](/ja/nodejs/api/diagnostics_channel#class-tracingchannel) トレースするチャネルのコレクション

指定された[TracingChannel Channels](/ja/nodejs/api/diagnostics_channel#tracingchannel-channels)の[`TracingChannel`](/ja/nodejs/api/diagnostics_channel#class-tracingchannel)ラッパーを作成します。 名前が与えられた場合、対応するトレースチャネルは`tracing:${name}:${eventType}`の形式で作成されます。ここで、`eventType`は[TracingChannel Channels](/ja/nodejs/api/diagnostics_channel#tracingchannel-channels)のタイプに対応します。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:end'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```
:::


### クラス: `Channel` {#class-channel}

**追加:** v15.1.0, v14.17.0

クラス `Channel` は、データパイプライン内の個々の名前付きチャネルを表します。これは、サブスクライバーを追跡し、サブスクライバーが存在する場合にメッセージを公開するために使用されます。公開時のチャネル検索を回避するために、個別のオブジェクトとして存在し、非常に高速な公開速度を可能にし、非常に最小限のコストで大量の使用を可能にします。チャネルは[`diagnostics_channel.channel(name)`](/ja/nodejs/api/diagnostics_channel#diagnostics_channelchannelname)で作成され、`new Channel(name)` でチャネルを直接構築することはサポートされていません。

#### `channel.hasSubscribers` {#channelhassubscribers}

**追加:** v15.1.0, v14.17.0

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) アクティブなサブスクライバーがいるかどうか

このチャネルにアクティブなサブスクライバーがいるかどうかを確認します。これは、送信したいメッセージの準備にコストがかかる可能性がある場合に役立ちます。

この API はオプションですが、パフォーマンスが非常に重要なコードからメッセージを公開しようとする場合に役立ちます。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // サブスクライバーがいるため、メッセージを準備して公開します
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // サブスクライバーがいるため、メッセージを準備して公開します
}
```
:::

#### `channel.publish(message)` {#channelpublishmessage}

**追加:** v15.1.0, v14.17.0

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) チャネルサブスクライバーに送信するメッセージ

チャネルのサブスクライバーにメッセージを公開します。これにより、メッセージハンドラーが同期的にトリガーされ、同じコンテキスト内で実行されます。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```
:::


#### `channel.subscribe(onMessage)` {#channelsubscribeonmessage}

**追加:** v15.1.0, v14.17.0

**非推奨:** v18.7.0, v16.17.0以降

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定版: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: [`diagnostics_channel.subscribe(name, onMessage)`](/ja/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage) を使用してください
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) チャネルメッセージを受信するハンドラー
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) メッセージデータ
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) チャネルの名前
  
 

このチャネルを購読するために、メッセージハンドラーを登録します。このメッセージハンドラーは、メッセージがチャネルに公開されるたびに同期的に実行されます。メッセージハンドラーでスローされたエラーは、[`'uncaughtException'`](/ja/nodejs/api/process#event-uncaughtexception)をトリガーします。



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // 受信したデータ
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // 受信したデータ
});
```
:::

#### `channel.unsubscribe(onMessage)` {#channelunsubscribeonmessage}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.7.0, v16.17.0 | 非推奨: v18.7.0, v16.17.0以降 |
| v17.1.0, v16.14.0, v14.19.0 | 戻り値を追加しました。サブスクライバーのいないチャネルに追加しました。 |
| v15.1.0, v14.17.0 | 追加: v15.1.0, v14.17.0 |
:::

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定版: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: [`diagnostics_channel.unsubscribe(name, onMessage)`](/ja/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage) を使用してください
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 削除する、以前にサブスクライブしたハンドラー
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ハンドラーが見つかった場合は `true`、それ以外の場合は `false`。

[`channel.subscribe(onMessage)`](/ja/nodejs/api/diagnostics_channel#channelsubscribeonmessage)を使用して、以前にこのチャネルに登録されたメッセージハンドラーを削除します。



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // 受信したデータ
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // 受信したデータ
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```
:::

#### `channel.bindStore(store[, transform])` {#channelbindstorestore-transform}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `store` [\<AsyncLocalStorage\>](/ja/nodejs/api/async_context#class-asynclocalstorage) コンテキストデータをバインドするストア
- `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) ストアコンテキストを設定する前にコンテキストデータを変換します。

[`channel.runStores(context, ...)`](/ja/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) が呼び出されると、指定されたコンテキストデータは、チャネルにバインドされているすべてのストアに適用されます。ストアがすでにバインドされている場合、以前の `transform` 関数は新しい関数に置き換えられます。指定されたコンテキストデータをコンテキストとして直接設定するために、`transform` 関数は省略できます。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```
:::

#### `channel.unbindStore(store)` {#channelunbindstorestore}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `store` [\<AsyncLocalStorage\>](/ja/nodejs/api/async_context#class-asynclocalstorage) チャネルからバインド解除するストア。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ストアが見つかった場合は `true`、それ以外の場合は `false`。

[`channel.bindStore(store)`](/ja/nodejs/api/diagnostics_channel#channelbindstorestore-transform) で以前にこのチャネルに登録されたメッセージハンドラーを削除します。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```
:::


#### `channel.runStores(context, fn[, thisArg[, ...args]])` {#channelrunstorescontext-fn-thisarg-args}

**追加:** v19.9.0, v18.19.0

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `context` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) サブスクライバーに送信し、ストアにバインドするメッセージ
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 入力されたストレージコンテキスト内で実行するハンドラー
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 関数呼び出しに使用されるレシーバー。
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 関数に渡すオプションの引数。

指定された関数の期間中、チャネルにバインドされたAsyncLocalStorageインスタンスに指定されたデータを適用し、そのデータがストアに適用される範囲内でチャネルに公開します。

[`channel.bindStore(store)`](/ja/nodejs/api/diagnostics_channel#channelbindstorestore-transform) に変換関数が与えられた場合、メッセージデータがストアのコンテキスト値になる前に、メッセージデータを変換するために適用されます。コンテキストのリンクが必要な場合、変換関数内から前のストレージコンテキストにアクセスできます。

ストアに適用されたコンテキストは、指定された関数中に開始された実行から継続する非同期コードでアクセスできるはずですが、[コンテキストの喪失](/ja/nodejs/api/async_context#troubleshooting-context-loss)が発生する状況もあります。



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```
:::


### クラス: `TracingChannel` {#class-tracingchannel}

**追加: v19.9.0, v18.19.0**

::: warning [Stable: 1 - 実験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

クラス `TracingChannel` は、単一の追跡可能なアクションをまとめて表現する [TracingChannel Channels](/ja/nodejs/api/diagnostics_channel#tracingchannel-channels) のコレクションです。これは、アプリケーションフローを追跡するためのイベントを生成するプロセスを形式化し、簡素化するために使用されます。[`diagnostics_channel.tracingChannel()`](/ja/nodejs/api/diagnostics_channel#diagnostics_channeltracingchannelnameorchannels) は、`TracingChannel` を構築するために使用されます。`Channel` と同様に、`TracingChannel` を動的に作成するのではなく、ファイルのトップレベルで単一の `TracingChannel` を作成して再利用することをお勧めします。

#### `tracingChannel.subscribe(subscribers)` {#tracingchannelsubscribesubscribers}

**追加: v19.9.0, v18.19.0**

::: warning [Stable: 1 - 実験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [TracingChannel Channels](/ja/nodejs/api/diagnostics_channel#tracingchannel-channels) のサブスクライバーのセット
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`start` イベント](/ja/nodejs/api/diagnostics_channel#startevent) サブスクライバー
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`end` イベント](/ja/nodejs/api/diagnostics_channel#endevent) サブスクライバー
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`asyncStart` イベント](/ja/nodejs/api/diagnostics_channel#asyncstartevent) サブスクライバー
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`asyncEnd` イベント](/ja/nodejs/api/diagnostics_channel#asyncendevent) サブスクライバー
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`error` イベント](/ja/nodejs/api/diagnostics_channel#errorevent) サブスクライバー
  
 

対応するチャネルに関数のコレクションをサブスクライブするためのヘルパー。これは、各チャネルで [`channel.subscribe(onMessage)`](/ja/nodejs/api/diagnostics_channel#channelsubscribeonmessage) を個別に呼び出すのと同じです。



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::


#### `tracingChannel.unsubscribe(subscribers)` {#tracingchannelunsubscribesubscribers}

**追加:** v19.9.0, v18.19.0

::: warning [Stable: 1 - 実験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [TracingChannel Channels](/ja/nodejs/api/diagnostics_channel#tracingchannel-channels) サブスクライバーのセット
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`start` イベント](/ja/nodejs/api/diagnostics_channel#startevent) サブスクライバー
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`end` イベント](/ja/nodejs/api/diagnostics_channel#endevent) サブスクライバー
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`asyncStart` イベント](/ja/nodejs/api/diagnostics_channel#asyncstartevent) サブスクライバー
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`asyncEnd` イベント](/ja/nodejs/api/diagnostics_channel#asyncendevent) サブスクライバー
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`error` イベント](/ja/nodejs/api/diagnostics_channel#errorevent) サブスクライバー
  
 
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) すべてのハンドラーが正常に登録解除された場合は `true`、それ以外の場合は `false`。

対応するチャネルから関数のコレクションを登録解除するためのヘルパーです。これは、各チャネルで個別に [`channel.unsubscribe(onMessage)`](/ja/nodejs/api/diagnostics_channel#channelunsubscribeonmessage) を呼び出すのと同じです。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::


#### `tracingChannel.traceSync(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracesyncfn-context-thisarg-args}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) トレースでラップする関数
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) イベントを関連付けるための共有オブジェクト
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 関数呼び出しで使用されるレシーバー
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 関数に渡すオプションの引数
- 戻り値: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 指定された関数の戻り値

同期関数呼び出しをトレースします。これは常に実行の前後で[`start` イベント](/ja/nodejs/api/diagnostics_channel#startevent)と[`end` イベント](/ja/nodejs/api/diagnostics_channel#endevent)を生成し、指定された関数がエラーをスローした場合は[`error` イベント](/ja/nodejs/api/diagnostics_channel#errorevent)を生成することがあります。これは、[`channel.runStores(context, ...)`](/ja/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args)を`start`チャンネルで使って指定された関数を実行します。これにより、すべてのイベントがこのトレースコンテキストと一致するようにバインドされたストアを持つことが保証されます。

正しいトレースグラフのみが形成されるようにするために、イベントはトレースを開始する前にサブスクライバーが存在する場合にのみ公開されます。トレースの開始後に追加されたサブスクリプションは、そのトレースからの将来のイベントを受信せず、将来のトレースのみが表示されます。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.tracePromise(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracepromisefn-context-thisarg-args}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) トレースをラップする Promise を返す関数
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) トレースイベントを関連付けるための共有オブジェクト
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 関数呼び出しで使用されるレシーバー
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 関数に渡すオプションの引数
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 指定された関数から返された Promise からチェーンされたもの

Promise を返す関数呼び出しをトレースします。これは常に、関数実行の同期部分の周りに [`start` イベント](/ja/nodejs/api/diagnostics_channel#startevent) と [`end` イベント](/ja/nodejs/api/diagnostics_channel#endevent) を生成し、Promise の継続に到達すると [`asyncStart` イベント](/ja/nodejs/api/diagnostics_channel#asyncstartevent) と [`asyncEnd` イベント](/ja/nodejs/api/diagnostics_channel#asyncendevent) を生成します。 また、指定された関数がエラーをスローするか、返された Promise が拒否された場合、[`error` イベント](/ja/nodejs/api/diagnostics_channel#errorevent) を生成する可能性もあります。 これは、`start` チャンネルで [`channel.runStores(context, ...)`](/ja/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) を使用して指定された関数を実行し、すべてのイベントに、このトレースコンテキストに一致するように設定されたバインドストアがあるようにします。

正しいトレースグラフのみが形成されるようにするために、イベントはトレースを開始する前にサブスクライバーが存在する場合にのみ公開されます。 トレースの開始後に追加されたサブスクリプションは、そのトレースからの将来のイベントを受信せず、将来のトレースのみが表示されます。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.traceCallback(fn[, position[, context[, thisArg[, ...args]]]])` {#tracingchanneltracecallbackfn-position-context-thisarg-args}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) トレースをラップする関数を使用したコールバック
- `position` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 期待されるコールバックのゼロから始まる引数の位置（`undefined` が渡された場合は最後の引数がデフォルト）
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) トレースイベントを関連付ける共有オブジェクト（`undefined` が渡された場合は `{}` がデフォルト）
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 関数呼び出しに使用されるレシーバー
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 関数に渡す引数（コールバックを含む必要があります）
- 戻り値: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 指定された関数の戻り値

コールバックを受け取る関数呼び出しをトレースします。コールバックは通常使用されるエラーを最初の引数とする規約に従うことが期待されます。これは常に、関数実行の同期部分の周囲に [`start` イベント](/ja/nodejs/api/diagnostics_channel#startevent) および [`end` イベント](/ja/nodejs/api/diagnostics_channel#endevent) を生成し、コールバック実行の周囲に [`asyncStart` イベント](/ja/nodejs/api/diagnostics_channel#asyncstartevent) および [`asyncEnd` イベント](/ja/nodejs/api/diagnostics_channel#asyncendevent) を生成します。指定された関数が例外をスローするか、コールバックに渡された最初の引数が設定されている場合は、[`error` イベント](/ja/nodejs/api/diagnostics_channel#errorevent) を生成することもできます。これは、`start` チャネルで [`channel.runStores(context, ...)`](/ja/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) を使用して指定された関数を実行します。これにより、すべてのイベントに、このトレースコンテキストと一致するように設定されたバインドされたストアがあることが保証されます。

正しいトレースグラフのみが形成されるように、イベントはトレースの開始前にサブスクライバーが存在する場合にのみ公開されます。トレースの開始後に追加されたサブスクリプションは、そのトレースからの将来のイベントを受信せず、将来のトレースのみが表示されます。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```
:::

コールバックも [`channel.runStores(context, ...)`](/ja/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) で実行されます。これにより、場合によってはコンテキストの損失を回復できます。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```
:::


#### `tracingChannel.hasSubscribers` {#tracingchannelhassubscribers}

**追加:** v22.0.0, v20.13.0

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 個々のチャネルのいずれかにサブスクライバーが存在する場合は `true`、そうでない場合は `false`。

これは、[TracingChannel Channels](/ja/nodejs/api/diagnostics_channel#tracingchannel-channels)のいずれかにサブスクライバーが存在するかどうかを確認するために、[`TracingChannel`](/ja/nodejs/api/diagnostics_channel#class-tracingchannel)インスタンスで使用できるヘルパーメソッドです。いずれかに少なくとも 1 つのサブスクライバーが存在する場合は `true` が返され、そうでない場合は `false` が返されます。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```
:::

### TracingChannel Channels {#tracingchannel-channels}

TracingChannel は、単一の追跡可能なアクションの実行ライフサイクルにおける特定のポイントを表す、いくつかの diagnostics_channels のコレクションです。動作は、`start`、`end`、`asyncStart`、`asyncEnd`、および `error` で構成される 5 つの diagnostics_channels に分割されます。単一の追跡可能なアクションは、すべてのイベント間で同じイベントオブジェクトを共有します。これは、weakmap を介した相関関係の管理に役立ちます。

これらのイベントオブジェクトは、タスクが「完了」すると、`result` または `error` の値で拡張されます。同期タスクの場合、`result` は戻り値になり、`error` は関数からスローされたものになります。コールバックベースの非同期関数では、`result` はコールバックの 2 番目の引数になり、`error` は `end` イベントで表示されるスローされたエラー、または `asyncStart` イベントまたは `asyncEnd` イベントのいずれかの最初のコールバック引数になります。

正しいトレースグラフのみが形成されるようにするには、トレースを開始する前にサブスクライバーが存在する場合にのみイベントを公開する必要があります。トレースの開始後に追加されたサブスクリプションは、そのトレースからの将来のイベントを受信せず、将来のトレースのみが表示されます。

トレースチャネルは、次の命名パターンに従う必要があります。

- `tracing:module.class.method:start` または `tracing:module.function:start`
- `tracing:module.class.method:end` または `tracing:module.function:end`
- `tracing:module.class.method:asyncStart` または `tracing:module.function:asyncStart`
- `tracing:module.class.method:asyncEnd` または `tracing:module.function:asyncEnd`
- `tracing:module.class.method:error` または `tracing:module.function:error`


#### `start(event)` {#startevent}

- Name: `tracing:${name}:start`

`start` イベントは、関数が呼び出された時点を表します。この時点で、イベントデータには関数の引数、または関数の実行開始時に利用可能なその他のものが含まれている場合があります。

#### `end(event)` {#endevent}

- Name: `tracing:${name}:end`

`end` イベントは、関数の呼び出しが値を返す時点を表します。非同期関数の場合、これは関数自体が内部で return ステートメントを作成したときではなく、返された Promise が解決されたときです。この時点で、トレースされた関数が同期的であった場合、`result` フィールドは関数の戻り値に設定されます。あるいは、スローされたエラーを表すために `error` フィールドが存在する場合があります。

トレース可能なアクションが複数のエラーを生成する可能性があるため、エラーを追跡するには、特に `error` イベントをリッスンすることをお勧めします。たとえば、失敗した非同期タスクは、タスクの同期部分の前に内部で開始され、エラーをスローする場合があります。

#### `asyncStart(event)` {#asyncstartevent}

- Name: `tracing:${name}:asyncStart`

`asyncStart` イベントは、トレース可能な関数のコールバックまたは継続に到達したことを表します。この時点で、コールバック引数などの、アクションの「結果」を表すものが利用可能になる場合があります。

コールバックベースの関数の場合、コールバックの最初の引数は、`undefined` または `null` でない場合、`error` フィールドに割り当てられ、2 番目の引数は `result` フィールドに割り当てられます。

Promise の場合、`resolve` パスへの引数は `result` に割り当てられ、`reject` パスへの引数は `error` に割り当てられます。

トレース可能なアクションが複数のエラーを生成する可能性があるため、エラーを追跡するには、特に `error` イベントをリッスンすることをお勧めします。たとえば、失敗した非同期タスクは、タスクの同期部分の前に内部で開始され、エラーをスローする場合があります。

#### `asyncEnd(event)` {#asyncendevent}

- Name: `tracing:${name}:asyncEnd`

`asyncEnd` イベントは、非同期関数のコールバックが戻ることを表します。`asyncStart` イベントの後にイベントデータが変更される可能性は低いですが、コールバックが完了する時点を確認するのに役立つ場合があります。


#### `error(event)` {#errorevent}

- 名前: `tracing:${name}:error`

`error` イベントは、トレース可能な関数が同期または非同期で生成したすべてのエラーを表します。トレースされた関数の同期部分でエラーがスローされた場合、エラーはイベントの `error` フィールドに割り当てられ、`error` イベントがトリガーされます。コールバックまたは Promise の拒否を通じて非同期的にエラーを受信した場合も、エラーはイベントの `error` フィールドに割り当てられ、`error` イベントがトリガーされます。

単一のトレース可能な関数呼び出しで複数回エラーが発生する可能性があるため、このイベントを使用する際には注意が必要です。たとえば、内部的にトリガーされた別のアシンクタスクが失敗し、その後、関数の同期部分がエラーをスローした場合、2つの `error` イベントが発生します。1つは同期エラー用、もう1つは非同期エラー用です。

### ビルトインチャネル {#built-in-channels}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

diagnostics_channel APIは現在安定版と見なされていますが、現在利用可能なビルトインチャネルは安定版ではありません。各チャネルは個別に安定版として宣言される必要があります。

#### HTTP {#http}

`http.client.request.created`

- `request` [\<http.ClientRequest\>](/ja/nodejs/api/http#class-httpclientrequest)

クライアントがリクエストオブジェクトを作成したときに発生します。`http.client.request.start`とは異なり、このイベントはリクエストが送信される前に発生します。

`http.client.request.start`

- `request` [\<http.ClientRequest\>](/ja/nodejs/api/http#class-httpclientrequest)

クライアントがリクエストを開始したときに発生します。

`http.client.request.error`

- `request` [\<http.ClientRequest\>](/ja/nodejs/api/http#class-httpclientrequest)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

クライアントリクエスト中にエラーが発生したときに発生します。

`http.client.response.finish`

- `request` [\<http.ClientRequest\>](/ja/nodejs/api/http#class-httpclientrequest)
- `response` [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage)

クライアントがレスポンスを受信したときに発生します。

`http.server.request.start`

- `request` [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ja/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/ja/nodejs/api/http#class-httpserver)

サーバーがリクエストを受信したときに発生します。

`http.server.response.created`

- `request` [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ja/nodejs/api/http#class-httpserverresponse)

サーバーがレスポンスを作成したときに発生します。イベントはレスポンスが送信される前に発生します。

`http.server.response.finish`

- `request` [\<http.IncomingMessage\>](/ja/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ja/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/ja/nodejs/api/http#class-httpserver)

サーバーがレスポンスを送信したときに発生します。


#### モジュール {#modules}

`module.require.start`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 次のプロパティを含む
    - `id` - `require()` に渡された引数。モジュール名。
    - `parentFilename` - require(id) を試みたモジュールの名前。
  
 

`require()` が実行されると発生します。[`start` イベント](/ja/nodejs/api/diagnostics_channel#startevent)を参照してください。

`module.require.end`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 次のプロパティを含む
    - `id` - `require()` に渡された引数。モジュール名。
    - `parentFilename` - require(id) を試みたモジュールの名前。
  
 

`require()` の呼び出しが返されると発生します。[`end` イベント](/ja/nodejs/api/diagnostics_channel#endevent)を参照してください。

`module.require.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 次のプロパティを含む
    - `id` - `require()` に渡された引数。モジュール名。
    - `parentFilename` - require(id) を試みたモジュールの名前。
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`require()` がエラーをスローすると発生します。[`error` イベント](/ja/nodejs/api/diagnostics_channel#errorevent)を参照してください。

`module.import.asyncStart`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 次のプロパティを含む
    - `id` - `import()` に渡された引数。モジュール名。
    - `parentURL` - import(id) を試みたモジュールの URL オブジェクト。
  
 

`import()` が呼び出されると発生します。[`asyncStart` イベント](/ja/nodejs/api/diagnostics_channel#asyncstartevent)を参照してください。

`module.import.asyncEnd`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 次のプロパティを含む
    - `id` - `import()` に渡された引数。モジュール名。
    - `parentURL` - import(id) を試みたモジュールの URL オブジェクト。
  
 

`import()` が完了すると発生します。[`asyncEnd` イベント](/ja/nodejs/api/diagnostics_channel#asyncendevent)を参照してください。

`module.import.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 次のプロパティを含む
    - `id` - `import()` に渡された引数。モジュール名。
    - `parentURL` - import(id) を試みたモジュールの URL オブジェクト。
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`import()` がエラーをスローすると発生します。[`error` イベント](/ja/nodejs/api/diagnostics_channel#errorevent)を参照してください。


#### NET {#net}

`net.client.socket`

- `socket` [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)

新しい TCP またはパイプのクライアントソケットが作成されたときに発生します。

`net.server.socket`

- `socket` [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)

新しい TCP またはパイプの接続を受信したときに発生します。

`tracing:net.server.listen:asyncStart`

- `server` [\<net.Server\>](/ja/nodejs/api/net#class-netserver)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[`net.Server.listen()`](/ja/nodejs/api/net#serverlisten) が呼び出されたときに、ポートまたはパイプが実際に設定される前に発生します。

`tracing:net.server.listen:asyncEnd`

- `server` [\<net.Server\>](/ja/nodejs/api/net#class-netserver)

[`net.Server.listen()`](/ja/nodejs/api/net#serverlisten) が完了し、サーバーが接続を受け入れる準備ができたときに発生します。

`tracing:net.server.listen:error`

- `server` [\<net.Server\>](/ja/nodejs/api/net#class-netserver)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`net.Server.listen()`](/ja/nodejs/api/net#serverlisten) がエラーを返すときに発生します。

#### UDP {#udp}

`udp.socket`

- `socket` [\<dgram.Socket\>](/ja/nodejs/api/dgram#class-dgramsocket)

新しい UDP ソケットが作成されたときに発生します。

#### Process {#process}

**Added in: v16.18.0**

`child_process`

- `process` [\<ChildProcess\>](/ja/nodejs/api/child_process#class-childprocess)

新しいプロセスが作成されたときに発生します。

#### Worker Thread {#worker-thread}

**Added in: v16.18.0**

`worker_threads`

- `worker` [`Worker`](/ja/nodejs/api/worker_threads#class-worker)

新しいスレッドが作成されたときに発生します。

