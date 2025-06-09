---
title: Node.js Web Streams API
description: Node.jsにおけるWeb Streams APIのドキュメント。効率的なデータ処理のためのストリームの扱い方を詳述し、読み取り可能、書き込み可能、変換ストリームを含む。
head:
  - - meta
    - name: og:title
      content: Node.js Web Streams API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsにおけるWeb Streams APIのドキュメント。効率的なデータ処理のためのストリームの扱い方を詳述し、読み取り可能、書き込み可能、変換ストリームを含む。
  - - meta
    - name: twitter:title
      content: Node.js Web Streams API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsにおけるWeb Streams APIのドキュメント。効率的なデータ処理のためのストリームの扱い方を詳述し、読み取り可能、書き込み可能、変換ストリームを含む。
---


# Web Streams API {#web-streams-api}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v21.0.0 | 実験的ではなくなりました。 |
| v18.0.0 | このAPIの使用は、ランタイム警告を発しなくなりました。 |
| v16.5.0 | v16.5.0で追加されました。 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

[WHATWG Streams Standard](https://streams.spec.whatwg.org/)の実装。

## 概要 {#overview}

[WHATWG Streams Standard](https://streams.spec.whatwg.org/)（または「web streams」）は、ストリーミングデータを処理するためのAPIを定義します。これはNode.jsの[Streams](/ja/nodejs/api/stream) APIに似ていますが、後発であり、多くのJavaScript環境でストリーミングデータを扱うための「標準」APIとなっています。

主なオブジェクトのタイプは3つあります。

- `ReadableStream` - ストリーミングデータのソースを表します。
- `WritableStream` - ストリーミングデータの宛先を表します。
- `TransformStream` - ストリーミングデータを変換するためのアルゴリズムを表します。

### `ReadableStream`の例 {#example-readablestream}

この例では、現在の `performance.now()` タイムスタンプを毎秒ずっとプッシュする単純な `ReadableStream` を作成します。非同期イテラブルは、ストリームからデータを読み取るために使用されます。

::: code-group
```js [ESM]
import {
  ReadableStream,
} from 'node:stream/web';

import {
  setInterval as every,
} from 'node:timers/promises';

import {
  performance,
} from 'node:perf_hooks';

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

for await (const value of stream)
  console.log(value);
```

```js [CJS]
const {
  ReadableStream,
} = require('node:stream/web');

const {
  setInterval: every,
} = require('node:timers/promises');

const {
  performance,
} = require('node:perf_hooks');

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

(async () => {
  for await (const value of stream)
    console.log(value);
})();
```
:::


## API {#api}

### クラス: `ReadableStream` {#class-readablestream}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | このクラスはグローバルオブジェクトで公開されるようになりました。 |
| v16.5.0 | 追加: v16.5.0 |
:::

#### `new ReadableStream([underlyingSource [, strategy]])` {#new-readablestreamunderlyingsource--strategy}

**追加: v16.5.0**

- `underlyingSource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `ReadableStream`の作成直後に呼び出されるユーザー定義関数。
    - `controller` [\<ReadableStreamDefaultController\>](/ja/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/ja/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - 戻り値: `undefined`または`undefined`で解決されるpromise。


    - `pull` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `ReadableStream`の内部キューが満杯でない場合に繰り返し呼び出されるユーザー定義関数。操作は同期または非同期にできます。非同期の場合、以前に返されたpromiseが解決されるまで、関数は再度呼び出されません。
    - `controller` [\<ReadableStreamDefaultController\>](/ja/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/ja/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - 戻り値: `undefined`で解決されるpromise。


    - `cancel` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `ReadableStream`がキャンセルされたときに呼び出されるユーザー定義関数。
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 戻り値: `undefined`で解決されるpromise。


    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'bytes'`または`undefined`である必要があります。
    - `autoAllocateChunkSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `type`が`'bytes'`に等しい場合にのみ使用されます。ゼロ以外の値に設定すると、ビューバッファは`ReadableByteStreamController.byobRequest`に自動的に割り当てられます。設定されていない場合は、ストリームの内部キューを使用して、デフォルトのリーダー`ReadableStreamDefaultReader`を介してデータを転送する必要があります。


- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 背圧が適用される前の最大の内部キューサイズ。
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 各データチャンクのサイズを識別するために使用されるユーザー定義関数。
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


#### `readableStream.locked` {#readablestreamlocked}

**Added in: v16.5.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) この[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)にアクティブなリーダーが存在する場合、`true`に設定されます。

`readableStream.locked`プロパティは、デフォルトでは`false`であり、ストリームのデータを消費するアクティブなリーダーが存在する場合は`true`に切り替わります。

#### `readableStream.cancel([reason])` {#readablestreamcancelreason}

**Added in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: キャンセルが完了すると`undefined`で履行されるPromise。

#### `readableStream.getReader([options])` {#readablestreamgetreaderoptions}

**Added in: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'byob'` または `undefined`
  
 
- Returns: [\<ReadableStreamDefaultReader\>](/ja/nodejs/api/webstreams#class-readablestreamdefaultreader) | [\<ReadableStreamBYOBReader\>](/ja/nodejs/api/webstreams#class-readastreambyobreader)

::: code-group
```js [ESM]
import { ReadableStream } from 'node:stream/web';

const stream = new ReadableStream();

const reader = stream.getReader();

console.log(await reader.read());
```

```js [CJS]
const { ReadableStream } = require('node:stream/web');

const stream = new ReadableStream();

const reader = stream.getReader();

reader.read().then(console.log);
```
:::

`readableStream.locked`を`true`にします。

#### `readableStream.pipeThrough(transform[, options])` {#readablestreampipethroughtransform-options}

**Added in: v16.5.0**

- `transform` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) `transform.writable`がこの`ReadableStream`から受信した、潜在的に変更されたデータをプッシュする`ReadableStream`。
    - `writable` [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream) この`ReadableStream`のデータが書き込まれる`WritableStream`。
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、この`ReadableStream`のエラーは`transform.writable`が中断される原因になりません。
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、宛先`transform.writable`のエラーは、この`ReadableStream`がキャンセルされる原因になりません。
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、この`ReadableStream`を閉じても`transform.writable`が閉じられることはありません。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) [\<AbortController\>](/ja/nodejs/api/globals#class-abortcontroller)を使用してデータ転送をキャンセルできます。
  
 
- Returns: [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) `transform.readable`から。

この[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)を、`transform`引数で提供される[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)と[\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)のペアに接続し、この[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)からのデータが`transform.writable`に書き込まれ、場合によっては変換され、`transform.readable`にプッシュされるようにします。 パイプラインが構成されると、`transform.readable`が返されます。

パイプ操作がアクティブな間、`readableStream.locked`を`true`にします。

::: code-group
```js [ESM]
import {
  ReadableStream,
  TransformStream,
} from 'node:stream/web';

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

for await (const chunk of transformedStream)
  console.log(chunk);
  // Prints: A
```

```js [CJS]
const {
  ReadableStream,
  TransformStream,
} = require('node:stream/web');

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

(async () => {
  for await (const chunk of transformedStream)
    console.log(chunk);
    // Prints: A
})();
```
:::


#### `readableStream.pipeTo(destination[, options])` {#readablestreampipetodestination-options}

**Added in: v16.5.0**

- `destination` [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream) この`ReadableStream`のデータが書き込まれる[\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、この`ReadableStream`のエラーは`destination`を中断させません。
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、`destination`のエラーは、この`ReadableStream`をキャンセルさせません。
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、この`ReadableStream`を閉じても`destination`が閉じられることはありません。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) [\<AbortController\>](/ja/nodejs/api/globals#class-abortcontroller)を使用して、データ転送をキャンセルできます。

- 戻り値: `undefined`で解決されるPromise

パイプ操作がアクティブな間、`readableStream.locked`を`true`にします。

#### `readableStream.tee()` {#readablestreamtee}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.10.0, v16.18.0 | 可読バイトストリームのティーイングをサポートします。 |
| v16.5.0 | Added in: v16.5.0 |
:::

- 戻り値: [\<ReadableStream[]\>](/ja/nodejs/api/webstreams#class-readablestream)

この`ReadableStream`のデータが転送される、新しい[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)インスタンスのペアを返します。 それぞれが同じデータを受信します。

`readableStream.locked`を`true`にします。

#### `readableStream.values([options])` {#readablestreamvaluesoptions}

**Added in: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、非同期イテレーターが突然終了したときに[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)が閉じられるのを防ぎます。 **デフォルト**: `false`。

この`ReadableStream`のデータを使用するために使用できる非同期イテレーターを作成して返します。

非同期イテレーターがアクティブな間、`readableStream.locked`を`true`にします。

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream.values({ preventCancel: true }))
  console.log(Buffer.from(chunk).toString());
```

#### Async Iteration {#async-iteration}

[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) オブジェクトは、`for await` 構文を使用した async iterator プロトコルをサポートします。

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream)
  console.log(Buffer.from(chunk).toString());
```
async iterator は、[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) が終了するまで消費します。

デフォルトでは、async iterator が（`break`、`return`、または `throw` によって）途中で終了した場合、[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) は閉じられます。[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) の自動クローズを防止するには、`readableStream.values()` メソッドを使用して async iterator を取得し、`preventCancel` オプションを `true` に設定します。

[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) はロックされていてはなりません（つまり、アクティブな reader が存在してはなりません）。async iteration 中、[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) はロックされます。

#### `postMessage()` での転送 {#transferring-with-postmessage}

[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) インスタンスは、[\<MessagePort\>](/ja/nodejs/api/worker_threads#class-messageport) を使用して転送できます。

```js [ESM]
const stream = new ReadableStream(getReadableSourceSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getReader().read().then((chunk) => {
    console.log(chunk);
  });
};

port2.postMessage(stream, [stream]);
```
### `ReadableStream.from(iterable)` {#readablestreamfromiterable}

**Added in: v20.6.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) `Symbol.asyncIterator` または `Symbol.iterator` iterable プロトコルを実装するオブジェクト。

iterable から新しい [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) を作成するユーティリティメソッド。

::: code-group
```js [ESM]
import { ReadableStream } from 'node:stream/web';

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

const stream = ReadableStream.from(asyncIterableGenerator());

for await (const chunk of stream)
  console.log(chunk); // Prints: 'a', 'b', 'c'
```

```js [CJS]
const { ReadableStream } = require('node:stream/web');

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

(async () => {
  const stream = ReadableStream.from(asyncIterableGenerator());

  for await (const chunk of stream)
    console.log(chunk); // Prints: 'a', 'b', 'c'
})();
```
:::


### クラス: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v18.0.0 | このクラスはグローバルオブジェクトで公開されるようになりました。 |
| v16.5.0 | 追加: v16.5.0 |
:::

デフォルトでは、引数なしで `readableStream.getReader()` を呼び出すと、`ReadableStreamDefaultReader` のインスタンスが返されます。デフォルトのリーダーは、ストリームを通過するデータのチャンクを不透明な値として扱い、これにより、[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) は一般的に任意の JavaScript 値で動作できます。

#### `new ReadableStreamDefaultReader(stream)` {#new-readablestreamdefaultreaderstream}

**追加: v16.5.0**

- `stream` [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)

指定された[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)にロックされた新しい[\<ReadableStreamDefaultReader\>](/ja/nodejs/api/webstreams#class-readablestreamdefaultreader)を作成します。

#### `readableStreamDefaultReader.cancel([reason])` {#readablestreamdefaultreadercancelreason}

**追加: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: `undefined` で解決される Promise。

[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)を取り消し、基になるストリームが取り消されたときに解決される Promise を返します。

#### `readableStreamDefaultReader.closed` {#readablestreamdefaultreaderclosed}

**追加: v16.5.0**

- 型: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 関連付けられた[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)が閉じられたときに `undefined` で解決されるか、ストリームでエラーが発生した場合、またはストリームが閉じる前にリーダーのロックが解除された場合は拒否されます。

#### `readableStreamDefaultReader.read()` {#readablestreamdefaultreaderread}

**追加: v16.5.0**

- 戻り値: オブジェクトで解決される Promise:
    - `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

基になる[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)からデータの次のチャンクを要求し、データが利用可能になると、データで解決される Promise を返します。


#### `readableStreamDefaultReader.releaseLock()` {#readablestreamdefaultreaderreleaselock}

**Added in: v16.5.0**

基になる[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)に対するこのリーダーのロックを解放します。

### Class: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | このクラスはグローバルオブジェクトで公開されるようになりました。 |
| v16.5.0 | Added in: v16.5.0 |
:::

`ReadableStreamBYOBReader` は、バイト指向の[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)の代替コンシューマーです (これは、`ReadableStream` の作成時に `underlyingSource.type` が `'bytes'` と等しく設定されて作成されたものです)。

`BYOB` は "bring your own buffer" の略です。これは、余分なコピーを回避する、バイト指向のデータのより効率的な読み取りを可能にするパターンです。

```js [ESM]
import {
  open,
} from 'node:fs/promises';

import {
  ReadableStream,
} from 'node:stream/web';

import { Buffer } from 'node:buffer';

class Source {
  type = 'bytes';
  autoAllocateChunkSize = 1024;

  async start(controller) {
    this.file = await open(new URL(import.meta.url));
    this.controller = controller;
  }

  async pull(controller) {
    const view = controller.byobRequest?.view;
    const {
      bytesRead,
    } = await this.file.read({
      buffer: view,
      offset: view.byteOffset,
      length: view.byteLength,
    });

    if (bytesRead === 0) {
      await this.file.close();
      this.controller.close();
    }
    controller.byobRequest.respond(bytesRead);
  }
}

const stream = new ReadableStream(new Source());

async function read(stream) {
  const reader = stream.getReader({ mode: 'byob' });

  const chunks = [];
  let result;
  do {
    result = await reader.read(Buffer.alloc(100));
    if (result.value !== undefined)
      chunks.push(Buffer.from(result.value));
  } while (!result.done);

  return Buffer.concat(chunks);
}

const data = await read(stream);
console.log(Buffer.from(data).toString());
```
#### `new ReadableStreamBYOBReader(stream)` {#new-readablestreambyobreaderstream}

**Added in: v16.5.0**

- `stream` [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)

指定された[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)にロックされた新しい`ReadableStreamBYOBReader`を作成します。


#### `readableStreamBYOBReader.cancel([reason])` {#readablestreambyobreadercancelreason}

**Added in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: `undefined` で解決される Promise。

[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) をキャンセルし、基になるストリームがキャンセルされたときに解決される Promise を返します。

#### `readableStreamBYOBReader.closed` {#readablestreambyobreaderclosed}

**Added in: v16.5.0**

- 型: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 関連付けられた[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)が閉じられたときに`undefined`で解決されるか、ストリームのエラーが発生した場合、またはストリームが閉じる前にリーダーのロックが解除された場合に拒否されます。

#### `readableStreamBYOBReader.read(view[, options])` {#readablestreambyobreaderreadview-options}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v21.7.0, v20.17.0 | `min` オプションが追加されました。 |
| v16.5.0 | Added in: v16.5.0 |
:::

- `view` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 設定すると、`min` 個の要素が利用可能になるとすぐに、返される Promise が解決されます。設定しない場合、少なくとも 1 つの要素が利用可能になると Promise は解決されます。
  
 
- 戻り値: オブジェクトで解決される Promise:
    - `value` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

基になる[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)から次のデータのチャンクをリクエストし、データが利用可能になるとデータで解決される Promise を返します。

このメソッドにプールされた[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)オブジェクトのインスタンスを渡さないでください。プールされた`Buffer`オブジェクトは、`Buffer.allocUnsafe()`または`Buffer.from()`を使用して作成されるか、さまざまな`node:fs`モジュールのコールバックによって返されることがよくあります。これらのタイプの`Buffer`は、すべてのプールされた`Buffer`インスタンスからのすべてのデータを含む共有の基になる[\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)オブジェクトを使用します。`Buffer`、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、または[\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)が`readableStreamBYOBReader.read()`に渡されると、ビューの基になる`ArrayBuffer`は*デタッチ*され、その`ArrayBuffer`に存在する可能性のある既存のすべてのビューが無効になります。これは、アプリケーションに悲惨な結果をもたらす可能性があります。


#### `readableStreamBYOBReader.releaseLock()` {#readablestreambyobreaderreleaselock}

**Added in: v16.5.0**

基になる[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)に対するこのリーダーのロックを解除します。

### クラス: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Added in: v16.5.0**

すべての[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)には、ストリームのキューの内部状態と管理を担当するコントローラーがあります。`ReadableStreamDefaultController`は、バイト指向でない`ReadableStream`のデフォルトのコントローラー実装です。

#### `readableStreamDefaultController.close()` {#readablestreamdefaultcontrollerclose}

**Added in: v16.5.0**

このコントローラーが関連付けられている[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)を閉じます。

#### `readableStreamDefaultController.desiredSize` {#readablestreamdefaultcontrollerdesiredsize}

**Added in: v16.5.0**

- 型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)のキューを満たすために残っているデータの量を返します。

#### `readableStreamDefaultController.enqueue([chunk])` {#readablestreamdefaultcontrollerenqueuechunk}

**Added in: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)のキューに新しいデータのチャンクを追加します。

#### `readableStreamDefaultController.error([error])` {#readablestreamdefaultcontrollererrorerror}

**Added in: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)をエラーにして閉じるエラーを通知します。

### クラス: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.10.0 | リリースされたリーダーからの BYOB プルリクエストの処理のサポート。 |
| v16.5.0 | Added in: v16.5.0 |
:::

すべての[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)には、ストリームのキューの内部状態と管理を担当するコントローラーがあります。`ReadableByteStreamController`は、バイト指向の`ReadableStream`用です。


#### `readableByteStreamController.byobRequest` {#readablebytestreamcontrollerbyobrequest}

**Added in: v16.5.0**

- タイプ: [\<ReadableStreamBYOBRequest\>](/ja/nodejs/api/webstreams#class-readablestreambyobrequest)

#### `readableByteStreamController.close()` {#readablebytestreamcontrollerclose}

**Added in: v16.5.0**

このコントローラーが関連付けられている[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)を閉じます。

#### `readableByteStreamController.desiredSize` {#readablebytestreamcontrollerdesiredsize}

**Added in: v16.5.0**

- タイプ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)のキューを満たすために残っているデータ量を返します。

#### `readableByteStreamController.enqueue(chunk)` {#readablebytestreamcontrollerenqueuechunk}

**Added in: v16.5.0**

- `chunk`: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)のキューに新しいデータのチャンクを追加します。

#### `readableByteStreamController.error([error])` {#readablebytestreamcontrollererrorerror}

**Added in: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)をエラーにして閉じるエラーを通知します。

### クラス: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | このクラスはグローバルオブジェクトで公開されるようになりました。 |
| v16.5.0 | Added in: v16.5.0 |
:::

バイト指向のストリームで `ReadableByteStreamController` を使用する場合、および `ReadableStreamBYOBReader` を使用する場合、`readableByteStreamController.byobRequest` プロパティは、現在の読み取りリクエストを表す `ReadableStreamBYOBRequest` インスタンスへのアクセスを提供します。 このオブジェクトは、読み取りリクエストを満たすために提供された `ArrayBuffer`/`TypedArray` へのアクセスを取得するために使用され、データが提供されたことを通知するためのメソッドを提供します。


#### `readableStreamBYOBRequest.respond(bytesWritten)` {#readablestreambyobrequestrespondbyteswritten}

**Added in: v16.5.0**

- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`readableStreamBYOBRequest.view` に `bytesWritten` バイト数が書き込まれたことを通知します。

#### `readableStreamBYOBRequest.respondWithNewView(view)` {#readablestreambyobrequestrespondwithnewviewview}

**Added in: v16.5.0**

- `view` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

リクエストが新しい `Buffer`、`TypedArray`、または `DataView` に書き込まれたバイトで完了したことを通知します。

#### `readableStreamBYOBRequest.view` {#readablestreambyobrequestview}

**Added in: v16.5.0**

- Type: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

### Class: `WritableStream` {#class-writablestream}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | このクラスはグローバルオブジェクトで公開されるようになりました。 |
| v16.5.0 | Added in: v16.5.0 |
:::

`WritableStream` は、ストリームデータが送信される宛先です。

```js [ESM]
import {
  WritableStream,
} from 'node:stream/web';

const stream = new WritableStream({
  write(chunk) {
    console.log(chunk);
  },
});

await stream.getWriter().write('Hello World');
```
#### `new WritableStream([underlyingSink[, strategy]])` {#new-writablestreamunderlyingsink-strategy}

**Added in: v16.5.0**

- `underlyingSink` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `WritableStream` が作成された直後に呼び出されるユーザー定義関数。
    - `controller` [\<WritableStreamDefaultController\>](/ja/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - 戻り値: `undefined` または `undefined` で fulfilled される Promise。
  
 
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) データチャンクが `WritableStream` に書き込まれたときに呼び出されるユーザー定義関数。
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<WritableStreamDefaultController\>](/ja/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - 戻り値: `undefined` で fulfilled される Promise。
  
 
    - `close` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `WritableStream` が閉じられたときに呼び出されるユーザー定義関数。
    - 戻り値: `undefined` で fulfilled される Promise。
  
 
    - `abort` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `WritableStream` を急に閉じるために呼び出されるユーザー定義関数。
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 戻り値: `undefined` で fulfilled される Promise。
  
 
    - `type` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `type` オプションは将来の使用のために予約されており、*必ず* undefined にする必要があります。
  
 
- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 背圧が適用される前の内部キューの最大サイズ。
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 各データチャンクのサイズを識別するために使用されるユーザー定義関数。
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  


#### `writableStream.abort([reason])` {#writablestreamabortreason}

**Added in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: `undefined` で解決される Promise。

`WritableStream` を中断します。 キューに登録された書き込みはすべてキャンセルされ、関連する Promise は拒否されます。

#### `writableStream.close()` {#writablestreamclose}

**Added in: v16.5.0**

- 戻り値: `undefined` で解決される Promise。

追加の書き込みが予想されない場合に `WritableStream` を閉じます。

#### `writableStream.getWriter()` {#writablestreamgetwriter}

**Added in: v16.5.0**

- 戻り値: [\<WritableStreamDefaultWriter\>](/ja/nodejs/api/webstreams#class-writablestreamdefaultwriter)

`WritableStream` にデータを書き込むために使用できる新しいライターインスタンスを作成して返します。

#### `writableStream.locked` {#writablestreamlocked}

**Added in: v16.5.0**

- 型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`writableStream.locked` プロパティは、デフォルトでは `false` であり、この `WritableStream` にアクティブなライターがアタッチされている間は `true` に切り替わります。

#### postMessage() での転送 {#transferring-with-postmessage_1}

[\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream) インスタンスは、[\<MessagePort\>](/ja/nodejs/api/worker_threads#class-messageport) を使用して転送できます。

```js [ESM]
const stream = new WritableStream(getWritableSinkSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getWriter().write('hello');
};

port2.postMessage(stream, [stream]);
```
### Class: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | このクラスはグローバルオブジェクトで公開されるようになりました。 |
| v16.5.0 | Added in: v16.5.0 |
:::

#### `new WritableStreamDefaultWriter(stream)` {#new-writablestreamdefaultwriterstream}

**Added in: v16.5.0**

- `stream` [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)

指定された `WritableStream` にロックされた新しい `WritableStreamDefaultWriter` を作成します。

#### `writableStreamDefaultWriter.abort([reason])` {#writablestreamdefaultwriterabortreason}

**Added in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: `undefined` で解決される Promise。

`WritableStream` を中断します。 キューに登録された書き込みはすべてキャンセルされ、関連する Promise は拒否されます。


#### `writableStreamDefaultWriter.close()` {#writablestreamdefaultwriterclose}

**Added in: v16.5.0**

- 戻り値: `undefined` で履行される Promise。

追加の書き込みが予期されない場合に `WritableStream` を閉じます。

#### `writableStreamDefaultWriter.closed` {#writablestreamdefaultwriterclosed}

**Added in: v16.5.0**

- 型: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 関連付けられた[\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)が閉じられたときに `undefined` で履行されるか、ストリームでエラーが発生した場合、またはストリームが閉じる前にライターのロックが解除された場合に拒否されます。

#### `writableStreamDefaultWriter.desiredSize` {#writablestreamdefaultwriterdesiredsize}

**Added in: v16.5.0**

- 型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

[\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)のキューを埋めるために必要なデータ量。

#### `writableStreamDefaultWriter.ready` {#writablestreamdefaultwriterready}

**Added in: v16.5.0**

- 型: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ライターが使用できる状態になったときに `undefined` で履行されます。

#### `writableStreamDefaultWriter.releaseLock()` {#writablestreamdefaultwriterreleaselock}

**Added in: v16.5.0**

基になる[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)に対するこのライターのロックを解除します。

#### `writableStreamDefaultWriter.write([chunk])` {#writablestreamdefaultwriterwritechunk}

**Added in: v16.5.0**

- `chunk`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: `undefined` で履行される Promise。

[\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)のキューに新しいデータのチャンクを追加します。

### Class: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | このクラスはグローバルオブジェクトで公開されるようになりました。 |
| v16.5.0 | Added in: v16.5.0 |
:::

`WritableStreamDefaultController` は、[\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)の内部状態を管理します。

#### `writableStreamDefaultController.error([error])` {#writablestreamdefaultcontrollererrorerror}

**Added in: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

ユーザーコードによって呼び出され、`WritableStream` データの処理中にエラーが発生したことを通知します。 呼び出されると、[\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)が中止され、現在保留中の書き込みがキャンセルされます。


#### `writableStreamDefaultController.signal` {#writablestreamdefaultcontrollersignal}

- 型: [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream) が中断されたときに、保留中の書き込みまたはクローズ操作をキャンセルするために使用できる `AbortSignal`。

### クラス: `TransformStream` {#class-transformstream}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | このクラスはグローバルオブジェクトで公開されるようになりました。 |
| v16.5.0 | 追加: v16.5.0 |
:::

`TransformStream` は、[\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) と[\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream) で構成され、`WritableStream` に書き込まれたデータが受信され、変換されてから `ReadableStream` のキューにプッシュされるように接続されています。

```js [ESM]
import {
  TransformStream,
} from 'node:stream/web';

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

await Promise.all([
  transform.writable.getWriter().write('A'),
  transform.readable.getReader().read(),
]);
```
#### `new TransformStream([transformer[, writableStrategy[, readableStrategy]]])` {#new-transformstreamtransformer-writablestrategy-readablestrategy}

**追加: v16.5.0**

- `transformer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `TransformStream` が作成された直後に呼び出されるユーザー定義の関数。
    - `controller` [\<TransformStreamDefaultController\>](/ja/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - 戻り値: `undefined` または `undefined` で解決されるPromise

    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `transformStream.writable` に書き込まれたデータのチャンクを受信し、場合によっては変更してから、`transformStream.readable` に転送するユーザー定義の関数。
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<TransformStreamDefaultController\>](/ja/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - 戻り値: `undefined` で解決されるPromise。

    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `TransformStream` の書き込み側が閉じられる直前に呼び出され、変換プロセスの終了を示すユーザー定義の関数。
    - `controller` [\<TransformStreamDefaultController\>](/ja/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - 戻り値: `undefined` で解決されるPromise。

    - `readableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `readableType` オプションは将来の使用のために予約されており、*必ず* `undefined` でなければなりません。
    - `writableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `writableType` オプションは将来の使用のために予約されており、*必ず* `undefined` でなければなりません。

- `writableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) バックプレッシャーが適用される前の最大内部キューサイズ。
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 各データのチャンクのサイズを識別するために使用されるユーザー定義関数。
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

- `readableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) バックプレッシャーが適用される前の最大内部キューサイズ。
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 各データのチャンクのサイズを識別するために使用されるユーザー定義関数。
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


#### `transformStream.readable` {#transformstreamreadable}

**Added in: v16.5.0**

- Type: [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)

#### `transformStream.writable` {#transformstreamwritable}

**Added in: v16.5.0**

- Type: [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)

#### postMessage() での転送 {#transferring-with-postmessage_2}

[\<TransformStream\>](/ja/nodejs/api/webstreams#class-transformstream) インスタンスは、[\<MessagePort\>](/ja/nodejs/api/worker_threads#class-messageport) を使用して転送できます。

```js [ESM]
const stream = new TransformStream();

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  const { writable, readable } = data;
  // ...
};

port2.postMessage(stream, [stream]);
```
### クラス: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | このクラスはグローバルオブジェクトで公開されるようになりました。 |
| v16.5.0 | Added in: v16.5.0 |
:::

`TransformStreamDefaultController` は、`TransformStream` の内部状態を管理します。

#### `transformStreamDefaultController.desiredSize` {#transformstreamdefaultcontrollerdesiredsize}

**Added in: v16.5.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

読み取り側のキューを埋めるために必要なデータ量。

#### `transformStreamDefaultController.enqueue([chunk])` {#transformstreamdefaultcontrollerenqueuechunk}

**Added in: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

データを読み取り側のキューに追加します。

#### `transformStreamDefaultController.error([reason])` {#transformstreamdefaultcontrollererrorreason}

**Added in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

変換データの処理中にエラーが発生したことを読み取り側と書き込み側の両方に通知し、両側が突然閉じられるようにします。

#### `transformStreamDefaultController.terminate()` {#transformstreamdefaultcontrollerterminate}

**Added in: v16.5.0**

トランスポートの読み取り側を閉じ、書き込み側がエラーで突然閉じられるようにします。

### クラス: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | このクラスはグローバルオブジェクトで公開されるようになりました。 |
| v16.5.0 | Added in: v16.5.0 |
:::


#### `new ByteLengthQueuingStrategy(init)` {#new-bytelengthqueuingstrategyinit}

**Added in: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

#### `byteLengthQueuingStrategy.highWaterMark` {#bytelengthqueuingstrategyhighwatermark}

**Added in: v16.5.0**

- 型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `byteLengthQueuingStrategy.size` {#bytelengthqueuingstrategysize}

**Added in: v16.5.0**

- 型: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

### クラス: `CountQueuingStrategy` {#class-countqueuingstrategy}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | このクラスはグローバルオブジェクトで公開されるようになりました。 |
| v16.5.0 | Added in: v16.5.0 |
:::

#### `new CountQueuingStrategy(init)` {#new-countqueuingstrategyinit}

**Added in: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

#### `countQueuingStrategy.highWaterMark` {#countqueuingstrategyhighwatermark}

**Added in: v16.5.0**

- 型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `countQueuingStrategy.size` {#countqueuingstrategysize}

**Added in: v16.5.0**

- 型: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

### クラス: `TextEncoderStream` {#class-textencoderstream}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | このクラスはグローバルオブジェクトで公開されるようになりました。 |
| v16.6.0 | Added in: v16.6.0 |
:::


#### `new TextEncoderStream()` {#new-textencoderstream}

**Added in: v16.6.0**

新しい `TextEncoderStream` インスタンスを作成します。

#### `textEncoderStream.encoding` {#textencoderstreamencoding}

**Added in: v16.6.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`TextEncoderStream` インスタンスでサポートされているエンコーディング。

#### `textEncoderStream.readable` {#textencoderstreamreadable}

**Added in: v16.6.0**

- Type: [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)

#### `textEncoderStream.writable` {#textencoderstreamwritable}

**Added in: v16.6.0**

- Type: [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)

### Class: `TextDecoderStream` {#class-textdecoderstream}


::: info [履歴]
| Version | Changes |
| --- | --- |
| v18.0.0 | このクラスはグローバルオブジェクトで公開されるようになりました。 |
| v16.6.0 | Added in: v16.6.0 |
:::

#### `new TextDecoderStream([encoding[, options]])` {#new-textdecoderstreamencoding-options}

**Added in: v16.6.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) この `TextDecoder` インスタンスがサポートする `encoding` を識別します。 **デフォルト:** `'utf-8'`。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) デコードの失敗が致命的な場合は `true`。
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`TextDecoderStream` はデコードされた結果にバイトオーダーマークを含めます。`false` の場合、バイトオーダーマークは出力から削除されます。このオプションは、`encoding` が `'utf-8'`、`'utf-16be'`、または `'utf-16le'` の場合にのみ使用されます。 **デフォルト:** `false`。
  
 

新しい `TextDecoderStream` インスタンスを作成します。

#### `textDecoderStream.encoding` {#textdecoderstreamencoding}

**Added in: v16.6.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`TextDecoderStream` インスタンスでサポートされているエンコーディング。

#### `textDecoderStream.fatal` {#textdecoderstreamfatal}

**Added in: v16.6.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

デコードエラーが発生した場合に `TypeError` がスローされる場合、値は `true` になります。


#### `textDecoderStream.ignoreBOM` {#textdecoderstreamignorebom}

**Added in: v16.6.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

デコード結果にバイトオーダーマークが含まれる場合、値は `true` になります。

#### `textDecoderStream.readable` {#textdecoderstreamreadable}

**Added in: v16.6.0**

- Type: [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)

#### `textDecoderStream.writable` {#textdecoderstreamwritable}

**Added in: v16.6.0**

- Type: [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)

### Class: `CompressionStream` {#class-compressionstream}


::: info [履歴]
| Version | 変更 |
| --- | --- |
| v18.0.0 | このクラスはグローバルオブジェクトで公開されるようになりました。 |
| v17.0.0 | Added in: v17.0.0 |
:::

#### `new CompressionStream(format)` {#new-compressionstreamformat}


::: info [履歴]
| Version | 変更 |
| --- | --- |
| v21.2.0, v20.12.0 | format で `deflate-raw` 値を受け入れるようになりました。 |
| v17.0.0 | Added in: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'deflate'`, `'deflate-raw'`, または `'gzip'` のいずれか。

#### `compressionStream.readable` {#compressionstreamreadable}

**Added in: v17.0.0**

- Type: [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)

#### `compressionStream.writable` {#compressionstreamwritable}

**Added in: v17.0.0**

- Type: [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)

### Class: `DecompressionStream` {#class-decompressionstream}


::: info [履歴]
| Version | 変更 |
| --- | --- |
| v18.0.0 | このクラスはグローバルオブジェクトで公開されるようになりました。 |
| v17.0.0 | Added in: v17.0.0 |
:::

#### `new DecompressionStream(format)` {#new-decompressionstreamformat}


::: info [履歴]
| Version | 変更 |
| --- | --- |
| v21.2.0, v20.12.0 | format で `deflate-raw` 値を受け入れるようになりました。 |
| v17.0.0 | Added in: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'deflate'`, `'deflate-raw'`, または `'gzip'` のいずれか。

#### `decompressionStream.readable` {#decompressionstreamreadable}

**Added in: v17.0.0**

- Type: [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)

#### `decompressionStream.writable` {#decompressionstreamwritable}

**Added in: v17.0.0**

- Type: [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)


### ユーティリティコンシューマー {#utility-consumers}

**追加: v16.7.0**

ユーティリティコンシューマー関数は、ストリームを消費するための共通オプションを提供します。

これらは以下を使用してアクセスできます。

::: code-group
```js [ESM]
import {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} from 'node:stream/consumers';
```

```js [CJS]
const {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} = require('node:stream/consumers');
```
:::

#### `streamConsumers.arrayBuffer(stream)` {#streamconsumersarraybufferstream}

**追加: v16.7.0**

- `stream` [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ストリームのすべてのコンテンツを含む `ArrayBuffer` で履行します。

::: code-group
```js [ESM]
import { arrayBuffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { TextEncoder } from 'node:util';

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');

const readable = Readable.from(dataArray);
const data = await arrayBuffer(readable);
console.log(`from readable: ${data.byteLength}`);
// Prints: from readable: 76
```

```js [CJS]
const { arrayBuffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { TextEncoder } = require('node:util');

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');
const readable = Readable.from(dataArray);
arrayBuffer(readable).then((data) => {
  console.log(`from readable: ${data.byteLength}`);
  // Prints: from readable: 76
});
```
:::

#### `streamConsumers.blob(stream)` {#streamconsumersblobstream}

**追加: v16.7.0**

- `stream` [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ストリームのすべてのコンテンツを含む [\<Blob\>](/ja/nodejs/api/buffer#class-blob) で履行します。

::: code-group
```js [ESM]
import { blob } from 'node:stream/consumers';

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
const data = await blob(readable);
console.log(`from readable: ${data.size}`);
// Prints: from readable: 27
```

```js [CJS]
const { blob } = require('node:stream/consumers');

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
blob(readable).then((data) => {
  console.log(`from readable: ${data.size}`);
  // Prints: from readable: 27
});
```
:::


#### `streamConsumers.buffer(stream)` {#streamconsumersbufferstream}

**Added in: v16.7.0**

- `stream` [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ストリームのすべてのコンテンツを含む[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)で履行される。

::: code-group
```js [ESM]
import { buffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { Buffer } from 'node:buffer';

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
const data = await buffer(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 27
```

```js [CJS]
const { buffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { Buffer } = require('node:buffer');

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
buffer(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```
:::

#### `streamConsumers.json(stream)` {#streamconsumersjsonstream}

**Added in: v16.7.0**

- `stream` [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) `JSON.parse()` を通過する UTF-8 エンコード文字列として解析されたストリームのコンテンツで履行される。

::: code-group
```js [ESM]
import { json } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
const data = await json(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 100
```

```js [CJS]
const { json } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
json(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 100
});
```
:::


#### `streamConsumers.text(stream)` {#streamconsumerstextstream}

**追加:** v16.7.0

- `stream` [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ストリームの内容をUTF-8エンコードされた文字列として解析し、履行します。



::: code-group
```js [ESM]
import { text } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const readable = Readable.from('Hello world from consumers!');
const data = await text(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 27
```

```js [CJS]
const { text } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const readable = Readable.from('Hello world from consumers!');
text(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```
:::

