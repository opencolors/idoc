---
title: Node.js ストリームAPIドキュメント
description: Node.jsのストリームAPIに関する詳細なドキュメントで、読み取り可能、書き込み可能、ダブル、トランスフォームストリームとそのメソッド、イベント、使用例をカバーしています。
head:
  - - meta
    - name: og:title
      content: Node.js ストリームAPIドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのストリームAPIに関する詳細なドキュメントで、読み取り可能、書き込み可能、ダブル、トランスフォームストリームとそのメソッド、イベント、使用例をカバーしています。
  - - meta
    - name: twitter:title
      content: Node.js ストリームAPIドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのストリームAPIに関する詳細なドキュメントで、読み取り可能、書き込み可能、ダブル、トランスフォームストリームとそのメソッド、イベント、使用例をカバーしています。
---


# Stream {#stream}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/stream.js](https://github.com/nodejs/node/blob/v23.5.0/lib/stream.js)

ストリームは、Node.js でストリーミングデータを扱うための抽象インターフェースです。 `node:stream` モジュールは、ストリームインターフェースを実装するための API を提供します。

Node.js によって提供されるストリームオブジェクトは多数あります。 たとえば、[HTTP サーバーへのリクエスト](/ja/nodejs/api/http#class-httpincomingmessage) と [`process.stdout`](/ja/nodejs/api/process#processstdout) はどちらもストリームインスタンスです。

ストリームは、読み取り可能、書き込み可能、またはその両方にすることができます。 すべてのストリームは、[`EventEmitter`](/ja/nodejs/api/events#class-eventemitter) のインスタンスです。

`node:stream` モジュールにアクセスするには:

```js [ESM]
const stream = require('node:stream');
```
`node:stream` モジュールは、新しいタイプのストリームインスタンスを作成するのに役立ちます。 通常、ストリームを使用するために `node:stream` モジュールを使用する必要はありません。

## このドキュメントの構成 {#organization-of-this-document}

このドキュメントには、2 つの主要なセクションと、注釈用の 3 番目のセクションが含まれています。 最初のセクションでは、アプリケーション内で既存のストリームを使用する方法について説明します。 2 番目のセクションでは、新しいタイプのストリームを作成する方法について説明します。

## ストリームの種類 {#types-of-streams}

Node.js には、4 つの基本的なストリームタイプがあります。

- [`Writable`](/ja/nodejs/api/stream#class-streamwritable): データが書き込まれるストリーム (例: [`fs.createWriteStream()`](/ja/nodejs/api/fs#fscreatewritestreampath-options))。
- [`Readable`](/ja/nodejs/api/stream#class-streamreadable): データが読み取られるストリーム (例: [`fs.createReadStream()`](/ja/nodejs/api/fs#fscreatereadstreampath-options))。
- [`Duplex`](/ja/nodejs/api/stream#class-streamduplex): `Readable` と `Writable` の両方のストリーム (例: [`net.Socket`](/ja/nodejs/api/net#class-netsocket))。
- [`Transform`](/ja/nodejs/api/stream#class-streamtransform): 書き込まれ読み取られる際にデータを変更または変換できる `Duplex` ストリーム (例: [`zlib.createDeflate()`](/ja/nodejs/api/zlib#zlibcreatedeflateoptions))。

さらに、このモジュールには、ユーティリティ関数の [`stream.duplexPair()`](/ja/nodejs/api/stream#streamduplexpairoptions)、[`stream.pipeline()`](/ja/nodejs/api/stream#streampipelinesource-transforms-destination-callback)、[`stream.finished()`](/ja/nodejs/api/stream#streamfinishedstream-options-callback) [`stream.Readable.from()`](/ja/nodejs/api/stream#streamreadablefromiterable-options)、および [`stream.addAbortSignal()`](/ja/nodejs/api/stream#streamaddabortsignalsignal-stream) が含まれています。


### Streams Promises API {#streams-promises-api}

**Added in: v15.0.0**

`stream/promises` API は、コールバックを使用する代わりに `Promise` オブジェクトを返すストリーム用の一連の非同期ユーティリティ関数を提供します。 API は、`require('node:stream/promises')` または `require('node:stream').promises` を介してアクセスできます。

### `stream.pipeline(source[, ...transforms], destination[, options])` {#streampipelinesource-transforms-destination-options}

### `stream.pipeline(streams[, options])` {#streampipelinestreams-options}


::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v18.0.0, v17.2.0, v16.14.0 | `end` オプションを追加しました。これは、source が終了したときに宛先ストリームを自動的に閉じないようにするために `false` に設定できます。 |
| v15.0.0 | Added in: v15.0.0 |
:::

- `streams` [\<Stream[]>](/ja/nodejs/api/stream#stream) | [\<Iterable[]>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `source` [\<Stream\>](/ja/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `...transforms` [\<Stream\>](/ja/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `destination` [\<Stream\>](/ja/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) パイプラインオプション
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ソースストリームが終了したときに宛先ストリームを終了します。 変換ストリームは、この値が `false` であっても常に終了します。 **デフォルト:** `true`。
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) パイプラインが完了すると履行されます。



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('archive.tar'),
  createGzip(),
  createWriteStream('archive.tar.gz'),
);
console.log('Pipeline succeeded.');
```
:::

`AbortSignal` を使用するには、オプションオブジェクトの中に入れ、最後の引数として渡します。 シグナルが中止されると、`destroy` が基になるパイプラインで `AbortError` を伴って呼び出されます。



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  const ac = new AbortController();
  const signal = ac.signal;

  setImmediate(() => ac.abort());
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
    { signal },
  );
}

run().catch(console.error); // AbortError
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

const ac = new AbortController();
const { signal } = ac;
setImmediate(() => ac.abort());
try {
  await pipeline(
    createReadStream('archive.tar'),
    createGzip(),
    createWriteStream('archive.tar.gz'),
    { signal },
  );
} catch (err) {
  console.error(err); // AbortError
}
```
:::

`pipeline` API は、非同期ジェネレーターもサポートしています。



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    fs.createReadStream('lowercase.txt'),
    async function* (source, { signal }) {
      source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
      for await (const chunk of source) {
        yield await processChunk(chunk, { signal });
      }
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

await pipeline(
  createReadStream('lowercase.txt'),
  async function* (source, { signal }) {
    source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
    for await (const chunk of source) {
      yield await processChunk(chunk, { signal });
    }
  },
  createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```
:::

非同期ジェネレーターに渡される `signal` 引数を処理することを忘れないでください。 特に、非同期ジェネレーターがパイプラインのソース（つまり、最初の引数）である場合、またはパイプラインが完了しない場合はそうです。



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    async function* ({ signal }) {
      await someLongRunningfn({ signal });
      yield 'asd';
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
await pipeline(
  async function* ({ signal }) {
    await someLongRunningfn({ signal });
    yield 'asd';
  },
  fs.createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```
:::

`pipeline` API は、[コールバックバージョン](/ja/nodejs/api/stream#streampipelinesource-transforms-destination-callback) を提供します。


### `stream.finished(stream[, options])` {#streamfinishedstream-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.5.0, v18.14.0 | `ReadableStream`と`WritableStream`のサポートが追加されました。 |
| v19.1.0, v18.13.0 | `cleanup`オプションが追加されました。 |
| v15.0.0 | 追加: v15.0.0 |
:::

- `stream` [\<Stream\>](/ja/nodejs/api/stream#stream) | [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream) 読み取り可能および/または書き込み可能なストリーム/ウェブストリーム。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `cleanup` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true`の場合、promiseが履行される前に、この関数によって登録されたリスナーを削除します。 **デフォルト:** `false`。
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ストリームが読み取りまたは書き込みできなくなると履行されます。

::: code-group
```js [CJS]
const { finished } = require('node:stream/promises');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Stream is done reading.');
}

run().catch(console.error);
rs.resume(); // Drain the stream.
```

```js [ESM]
import { finished } from 'node:stream/promises';
import { createReadStream } from 'node:fs';

const rs = createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Stream is done reading.');
}

run().catch(console.error);
rs.resume(); // Drain the stream.
```
:::

`finished` APIは[コールバックバージョン](/ja/nodejs/api/stream#streamfinishedstream-options-callback)も提供します。

`stream.finished()`は、返されたpromiseが解決または拒否された後も、ぶら下がっているイベントリスナー（特に`'error'`、`'end'`、`'finish'`、および`'close'`）を残します。 この理由は、（正しくないストリーム実装による）予期しない`'error'`イベントが予期しないクラッシュを引き起こさないようにするためです。 これが不要な動作である場合は、`options.cleanup`を`true`に設定する必要があります。

```js [ESM]
await finished(rs, { cleanup: true });
```

### オブジェクトモード {#object-mode}

Node.js APIによって作成されるすべてのストリームは、文字列、[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)オブジェクトでのみ動作します。

- `Strings`と`Buffers`は、ストリームで最も一般的に使用される型です。
- `TypedArray`と`DataView`を使用すると、`Int32Array`や`Uint8Array`などの型でバイナリデータを処理できます。TypedArrayまたはDataViewをストリームに書き込むと、Node.jsは生のバイトを処理します。

ただし、ストリームの実装は、他の型のJavaScript値（ストリーム内で特別な目的を果たす`null`を除く）でも動作することができます。このようなストリームは、「オブジェクトモード」で動作すると見なされます。

ストリームインスタンスは、ストリームの作成時に`objectMode`オプションを使用してオブジェクトモードに切り替えられます。既存のストリームをオブジェクトモードに切り替えようとするのは安全ではありません。

### バッファリング {#buffering}

[`Writable`](/ja/nodejs/api/stream#class-streamwritable)ストリームと[`Readable`](/ja/nodejs/api/stream#class-streamreadable)ストリームはどちらも、内部バッファにデータを格納します。

バッファリングされる可能性のあるデータ量は、ストリームのコンストラクタに渡される`highWaterMark`オプションによって異なります。通常のストリームの場合、`highWaterMark`オプションは[バイトの合計数](/ja/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding)を指定します。オブジェクトモードで動作するストリームの場合、`highWaterMark`はオブジェクトの合計数を指定します。（デコードせずに）文字列を処理するストリームの場合、`highWaterMark`はUTF-16コードユニットの合計数を指定します。

データは、実装が[`stream.push(chunk)`](/ja/nodejs/api/stream#readablepushchunk-encoding)を呼び出すときに`Readable`ストリームにバッファリングされます。ストリームのコンシューマが[`stream.read()`](/ja/nodejs/api/stream#readablereadsize)を呼び出さない場合、データは消費されるまで内部キューに保持されます。

内部読み取りバッファの合計サイズが`highWaterMark`で指定されたしきい値に達すると、ストリームは、現在バッファリングされているデータが消費されるまで、基になるリソースからのデータの読み取りを一時的に停止します（つまり、ストリームは、読み取りバッファを埋めるために使用される内部[`readable._read()`](/ja/nodejs/api/stream#readable_readsize)メソッドの呼び出しを停止します）。

データは、[`writable.write(chunk)`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback)メソッドが繰り返し呼び出されるときに`Writable`ストリームにバッファリングされます。内部書き込みバッファの合計サイズが`highWaterMark`で設定されたしきい値を下回っている間は、`writable.write()`の呼び出しは`true`を返します。内部バッファのサイズが`highWaterMark`に達するか超えると、`false`が返されます。

`stream` API、特に[`stream.pipe()`](/ja/nodejs/api/stream#readablepipedestination-options)メソッドの重要な目標は、データのバッファリングを許容できるレベルに制限し、速度の異なるソースとデスティネーションが利用可能なメモリを圧倒しないようにすることです。

`highWaterMark`オプションは、しきい値であり、制限ではありません。これは、ストリームがそれ以上のデータを要求するのを停止する前にバッファリングするデータ量を指示します。これは、一般的に厳密なメモリ制限を強制するものではありません。特定のストリーム実装は、より厳密な制限を強制することを選択できますが、そうすることはオプションです。

[`Duplex`](/ja/nodejs/api/stream#class-streamduplex)ストリームと[`Transform`](/ja/nodejs/api/stream#class-streamtransform)ストリームはどちらも`Readable`と`Writable`であるため、それぞれが読み取りと書き込みに使用される*2つ*の別個の内部バッファを保持し、各サイドが適切な効率的なデータの流れを維持しながら、互いに独立して動作できるようにします。たとえば、[`net.Socket`](/ja/nodejs/api/net#class-netsocket)インスタンスは[`Duplex`](/ja/nodejs/api/stream#class-streamduplex)ストリームであり、その`Readable`側はソケット*から*受信したデータの消費を許可し、その`Writable`側はソケット*へ*のデータの書き込みを許可します。データは、データが受信されるよりも速いまたは遅いレートでソケットに書き込まれる可能性があるため、各サイドは互いに独立して動作（およびバッファリング）する必要があります。

内部バッファリングのメカニズムは、内部実装の詳細であり、いつでも変更される可能性があります。ただし、特定の高度な実装では、`writable.writableBuffer`または`readable.readableBuffer`を使用して内部バッファを取得できます。これらのドキュメント化されていないプロパティの使用は推奨されません。


## ストリームコンシューマーのAPI {#api-for-stream-consumers}

どんなに単純なNode.jsアプリケーションでも、何らかの形でストリームを使用しています。以下は、HTTPサーバーを実装するNode.jsアプリケーションでストリームを使用する例です。

```js [ESM]
const http = require('node:http');

const server = http.createServer((req, res) => {
  // `req` は http.IncomingMessage であり、readableストリームです。
  // `res` は http.ServerResponse であり、writableストリームです。

  let body = '';
  // データをutf8文字列として取得します。
  // エンコーディングが設定されていない場合、Bufferオブジェクトが受信されます。
  req.setEncoding('utf8');

  // Readableストリームは、リスナーが追加されると 'data' イベントを発行します。
  req.on('data', (chunk) => {
    body += chunk;
  });

  // 'end' イベントは、ボディ全体が受信されたことを示します。
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // ユーザーに面白いものを書き戻します:
      res.write(typeof data);
      res.end();
    } catch (er) {
      // おっと！不正なJSON！
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });
});

server.listen(1337);

// $ curl localhost:1337 -d "{}"
// object
// $ curl localhost:1337 -d "\"foo\""
// string
// $ curl localhost:1337 -d "not json"
// error: Unexpected token 'o', "not json" is not valid JSON
```

[`Writable`](/ja/nodejs/api/stream#class-streamwritable) ストリーム（例の`res`など）は、ストリームにデータを書き込むために使用される `write()` や `end()` などのメソッドを公開します。

[`Readable`](/ja/nodejs/api/stream#class-streamreadable) ストリームは、ストリームから読み取ることができるデータがある場合にアプリケーションコードに通知するために、[`EventEmitter`](/ja/nodejs/api/events#class-eventemitter) APIを使用します。その利用可能なデータは、複数の方法でストリームから読み取ることができます。

[`Writable`](/ja/nodejs/api/stream#class-streamwritable) ストリームと [`Readable`](/ja/nodejs/api/stream#class-streamreadable) ストリームの両方が、ストリームの現在の状態を伝達するために、さまざまな方法で [`EventEmitter`](/ja/nodejs/api/events#class-eventemitter) APIを使用します。

[`Duplex`](/ja/nodejs/api/stream#class-streamduplex) ストリームと [`Transform`](/ja/nodejs/api/stream#class-streamtransform) ストリームは、[`Writable`](/ja/nodejs/api/stream#class-streamwritable) と [`Readable`](/ja/nodejs/api/stream#class-streamreadable) の両方です。

ストリームにデータを書き込んでいる、またはストリームからデータを消費しているアプリケーションは、ストリームインターフェースを直接実装する必要はなく、通常は `require('node:stream')` を呼び出す理由はありません。

新しいタイプのストリームを実装したい開発者は、[ストリーム実装者のためのAPI](/ja/nodejs/api/stream#api-for-stream-implementers)のセクションを参照してください。


### 書き込み可能ストリーム {#writable-streams}

書き込み可能ストリームは、データが書き込まれる*宛先*の抽象化です。

[`Writable`](/ja/nodejs/api/stream#class-streamwritable) ストリームの例:

- [クライアント上の HTTP リクエスト](/ja/nodejs/api/http#class-httpclientrequest)
- [サーバー上の HTTP レスポンス](/ja/nodejs/api/http#class-httpserverresponse)
- [fs 書き込みストリーム](/ja/nodejs/api/fs#class-fswritestream)
- [zlib ストリーム](/ja/nodejs/api/zlib)
- [crypto ストリーム](/ja/nodejs/api/crypto)
- [TCP ソケット](/ja/nodejs/api/net#class-netsocket)
- [子プロセス stdin](/ja/nodejs/api/child_process#subprocessstdin)
- [`process.stdout`](/ja/nodejs/api/process#processstdout), [`process.stderr`](/ja/nodejs/api/process#processstderr)

これらの例の中には、[`Writable`](/ja/nodejs/api/stream#class-streamwritable) インターフェースを実装する [`Duplex`](/ja/nodejs/api/stream#class-streamduplex) ストリームであるものもあります。

すべての [`Writable`](/ja/nodejs/api/stream#class-streamwritable) ストリームは、`stream.Writable` クラスで定義されたインターフェースを実装します。

[`Writable`](/ja/nodejs/api/stream#class-streamwritable) ストリームの特定のインスタンスはさまざまな点で異なる場合がありますが、すべての `Writable` ストリームは、以下の例に示すように、同じ基本的な使用パターンに従います。

```js [ESM]
const myStream = getWritableStreamSomehow();
myStream.write('some data');
myStream.write('some more data');
myStream.end('done writing data');
```
#### クラス: `stream.Writable` {#class-streamwritable}

**追加: v0.9.4**

##### イベント: `'close'` {#event-close}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `emitClose` オプションを追加して、`'close'` が破棄時に発行されるかどうかを指定します。 |
| v0.9.4 | 追加: v0.9.4 |
:::

`'close'` イベントは、ストリームとその基になるリソース（ファイル記述子など）が閉じられたときに発行されます。このイベントは、これ以上イベントが発行されず、それ以上の計算が行われないことを示します。

[`Writable`](/ja/nodejs/api/stream#class-streamwritable) ストリームは、`emitClose` オプションを使用して作成された場合、常に `'close'` イベントを発行します。

##### イベント: `'drain'` {#event-drain}

**追加: v0.9.4**

[`stream.write(chunk)`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback) の呼び出しが `false` を返した場合、ストリームへのデータの書き込みを再開するのに適切なタイミングで `'drain'` イベントが発行されます。

```js [ESM]
// 指定された書き込み可能ストリームに 100 万回データを書き込みます。
// バックプレッシャーに注意してください。
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // 最後です！
        writer.write(data, encoding, callback);
      } else {
        // 続行するか、待機するかを確認します。
        // まだ完了していないため、コールバックを渡さないでください。
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // 早く停止する必要がありました！
      // ドレインしたらもっと書き込みます。
      writer.once('drain', write);
    }
  }
}
```

##### イベント: `'error'` {#event-error}

**追加: v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

書き込みまたはパイプ処理中にエラーが発生した場合、`'error'` イベントが発生します。リスナーコールバックは、呼び出されると単一の `Error` 引数が渡されます。

ストリームの作成時に [`autoDestroy`](/ja/nodejs/api/stream#new-streamwritableoptions) オプションが `false` に設定されていない限り、`'error'` イベントが発生するとストリームは閉じられます。

`'error'` の後、`'close'` 以外のイベント（`'error'` イベントを含む）は発生 *しないはず* です。

##### イベント: `'finish'` {#event-finish}

**追加: v0.9.4**

[`stream.end()`](/ja/nodejs/api/stream#writableendchunk-encoding-callback) メソッドが呼び出され、すべてのデータが基盤となるシステムにフラッシュされた後、`'finish'` イベントが発生します。

```js [ESM]
const writer = getWritableStreamSomehow();
for (let i = 0; i < 100; i++) {
  writer.write(`hello, #${i}!\n`);
}
writer.on('finish', () => {
  console.log('All writes are now complete.');
});
writer.end('This is the end\n');
```
##### イベント: `'pipe'` {#event-pipe}

**追加: v0.9.4**

- `src` [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable) この書き込み可能オブジェクトにパイプしているソースストリーム

[`stream.pipe()`](/ja/nodejs/api/stream#readablepipedestination-options) メソッドが読み取り可能ストリームで呼び出され、この書き込み可能オブジェクトを宛先のセットに追加すると、`'pipe'` イベントが発生します。

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('pipe', (src) => {
  console.log('Something is piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
```
##### イベント: `'unpipe'` {#event-unpipe}

**追加: v0.9.4**

- `src` [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable) この書き込み可能オブジェクトを [unpiped](/ja/nodejs/api/stream#readableunpipedestination) したソースストリーム

[`stream.unpipe()`](/ja/nodejs/api/stream#readableunpipedestination) メソッドが [`Readable`](/ja/nodejs/api/stream#class-streamreadable) ストリームで呼び出され、この [`Writable`](/ja/nodejs/api/stream#class-streamwritable) が宛先のセットから削除されると、`'unpipe'` イベントが発生します。

また、[`Readable`](/ja/nodejs/api/stream#class-streamreadable) ストリームがパイプ処理されるときに、この [`Writable`](/ja/nodejs/api/stream#class-streamwritable) ストリームがエラーを発生させた場合にも、このイベントが発生します。

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('unpipe', (src) => {
  console.log('Something has stopped piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
reader.unpipe(writer);
```

##### `writable.cork()` {#writablecork}

**Added in: v0.11.2**

`writable.cork()` メソッドは、書き込まれたすべてのデータを強制的にメモリにバッファリングさせます。バッファリングされたデータは、[`stream.uncork()`](/ja/nodejs/api/stream#writableuncork) または [`stream.end()`](/ja/nodejs/api/stream#writableendchunk-encoding-callback) メソッドのいずれかが呼び出されたときにフラッシュされます。

`writable.cork()` の主な目的は、いくつかの小さなチャンクが連続してストリームに書き込まれる状況に対応することです。基になる宛先にすぐに転送する代わりに、`writable.cork()` は `writable.uncork()` が呼び出されるまで、すべてのチャンクをバッファリングし、存在する場合はそれらすべてを `writable._writev()` に渡します。これにより、最初の小さなチャンクが処理されるのを待っている間にデータがバッファリングされるヘッドオブラインブロッキング状況を防ぎます。ただし、`writable._writev()` を実装せずに `writable.cork()` を使用すると、スループットに悪影響を与える可能性があります。

参照: [`writable.uncork()`](/ja/nodejs/api/stream#writableuncork), [`writable._writev()`](/ja/nodejs/api/stream#writable_writevchunks-callback)。

##### `writable.destroy([error])` {#writabledestroyerror}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.0.0 | 既に破棄されたストリームでは、操作なしとして機能します。 |
| v8.0.0 | Added in: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 省略可能。`'error'` イベントで発生させるエラー。
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

ストリームを破棄します。必要に応じて `'error'` イベントを発行し、`'close'` イベントを発行します（`emitClose` が `false` に設定されていない場合）。この呼び出し後、書き込み可能ストリームは終了し、`write()` または `end()` への後続の呼び出しは `ERR_STREAM_DESTROYED` エラーになります。これは、ストリームを破棄するための破壊的かつ即時的な方法です。以前の `write()` の呼び出しはドレインされていない可能性があり、`ERR_STREAM_DESTROYED` エラーをトリガーする可能性があります。データをフラッシュしてから閉じる必要がある場合は、destroy の代わりに `end()` を使用するか、ストリームを破棄する前に `'drain'` イベントを待ちます。

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

const fooErr = new Error('foo error');
myStream.destroy(fooErr);
myStream.on('error', (fooErr) => console.error(fooErr.message)); // foo error
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

myStream.destroy();
myStream.on('error', function wontHappen() {});
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();
myStream.destroy();

myStream.write('foo', (error) => console.error(error.code));
// ERR_STREAM_DESTROYED
```
`destroy()` が呼び出されると、それ以降の呼び出しは操作なしになり、`_destroy()` からのエラーを除き、`'error'` としてエラーが発生することはありません。

実装者はこのメソッドをオーバーライドするのではなく、[`writable._destroy()`](/ja/nodejs/api/stream#writable_destroyerr-callback) を実装する必要があります。


##### `writable.closed` {#writableclosed}

**追加:** v18.0.0以降

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`'close'` が発生した後、`true` になります。

##### `writable.destroyed` {#writabledestroyed}

**追加:** v8.0.0以降

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`writable.destroy()`](/ja/nodejs/api/stream#writabledestroyerror) が呼び出された後、`true` になります。

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

console.log(myStream.destroyed); // false
myStream.destroy();
console.log(myStream.destroyed); // true
```
##### `writable.end([chunk[, encoding]][, callback])` {#writableendchunk-encoding-callback}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.0.0, v20.13.0 | `chunk` 引数に `TypedArray` または `DataView` インスタンスを指定できるようになりました。 |
| v15.0.0 | `callback` は 'finish' の前またはエラー時に呼び出されます。 |
| v14.0.0 | 'finish' または 'error' が発生した場合、`callback` が呼び出されます。 |
| v10.0.0 | このメソッドは `writable` への参照を返すようになりました。 |
| v8.0.0 | `chunk` 引数に `Uint8Array` インスタンスを指定できるようになりました。 |
| v0.9.4 | 追加: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 書き込むオプションのデータ。 オブジェクトモードで動作していないストリームの場合、`chunk` は [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)、[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) または [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) でなければなりません。 オブジェクトモードのストリームの場合、`chunk` は `null` 以外の任意の JavaScript 値を指定できます。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `chunk` が文字列の場合のエンコーディング
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) ストリームが完了したときに呼び出されるコールバック。
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`writable.end()` メソッドを呼び出すと、[`Writable`](/ja/nodejs/api/stream#class-streamwritable) にそれ以上のデータが書き込まれないことが通知されます。 オプションの `chunk` および `encoding` 引数を使用すると、ストリームを閉じる直前に、最後のデータの追加チャンクを書き込むことができます。

[`stream.end()`](/ja/nodejs/api/stream#writableendchunk-encoding-callback) を呼び出した後に [`stream.write()`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback) メソッドを呼び出すと、エラーが発生します。

```js [ESM]
// 'hello, ' を書き込み、'world!' で終了します。
const fs = require('node:fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
// これ以上書き込むことは許可されていません!
```

##### `writable.setDefaultEncoding(encoding)` {#writablesetdefaultencodingencoding}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v6.1.0 | このメソッドは `writable` への参照を返すようになりました。 |
| v0.11.15 | 追加: v0.11.15 |
:::

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 新しいデフォルトエンコーディング
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`writable.setDefaultEncoding()` メソッドは、[`Writable`](/ja/nodejs/api/stream#class-streamwritable) ストリームのデフォルトの `encoding` を設定します。

##### `writable.uncork()` {#writableuncork}

**追加: v0.11.2**

`writable.uncork()` メソッドは、[`stream.cork()`](/ja/nodejs/api/stream#writablecork) が呼び出されてからバッファリングされたすべてのデータをフラッシュします。

[`writable.cork()`](/ja/nodejs/api/stream#writablecork) と `writable.uncork()` を使用してストリームへの書き込みのバッファリングを管理する場合は、`process.nextTick()` を使用して `writable.uncork()` の呼び出しを遅らせます。
そうすることで、特定の Node.js イベントループフェーズ内で発生するすべての `writable.write()` 呼び出しをバッチ処理できます。

```js [ESM]
stream.cork();
stream.write('some ');
stream.write('data ');
process.nextTick(() => stream.uncork());
```
[`writable.cork()`](/ja/nodejs/api/stream#writablecork) メソッドがストリームで複数回呼び出された場合、バッファリングされたデータをフラッシュするには、`writable.uncork()` への同じ回数の呼び出しを行う必要があります。

```js [ESM]
stream.cork();
stream.write('some ');
stream.cork();
stream.write('data ');
process.nextTick(() => {
  stream.uncork();
  // uncork() が 2 回目に呼び出されるまで、データはフラッシュされません。
  stream.uncork();
});
```
参照: [`writable.cork()`](/ja/nodejs/api/stream#writablecork)。

##### `writable.writable` {#writablewritable}

**追加: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`writable.write()`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback) の呼び出しが安全な場合は `true` です。これは、ストリームが破棄、エラー発生、または終了していないことを意味します。

##### `writable.writableAborted` {#writablewritableaborted}

**追加: v18.0.0, v16.17.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ストリームが `'finish'` を発行する前に破棄されたか、エラーが発生したかを返します。


##### `writable.writableEnded` {#writablewritableended}

**Added in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`writable.end()`](/ja/nodejs/api/stream#writableendchunk-encoding-callback) が呼び出された後、`true` になります。このプロパティは、データがフラッシュされたかどうかを示すものではありません。代わりに [`writable.writableFinished`](/ja/nodejs/api/stream#writablewritablefinished) を使用してください。

##### `writable.writableCorked` {#writablewritablecorked}

**Added in: v13.2.0, v12.16.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ストリームを完全にアングロックするために [`writable.uncork()`](/ja/nodejs/api/stream#writableuncork) を呼び出す必要がある回数。

##### `writable.errored` {#writableerrored}

**Added in: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

ストリームがエラーで破棄された場合、エラーを返します。

##### `writable.writableFinished` {#writablewritablefinished}

**Added in: v12.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`'finish'`](/ja/nodejs/api/stream#event-finish) イベントが発行される直前に `true` に設定されます。

##### `writable.writableHighWaterMark` {#writablewritablehighwatermark}

**Added in: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

この `Writable` の作成時に渡された `highWaterMark` の値を返します。

##### `writable.writableLength` {#writablewritablelength}

**Added in: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

このプロパティには、書き込み準備ができているキュー内のバイト数（またはオブジェクト数）が含まれます。この値は、`highWaterMark` の状態に関するイントロスペクションデータを提供します。

##### `writable.writableNeedDrain` {#writablewritableneeddrain}

**Added in: v15.2.0, v14.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ストリームのバッファがいっぱいで、ストリームが `'drain'` を発行する場合、`true` になります。


##### `writable.writableObjectMode` {#writablewritableobjectmode}

**Added in: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

指定された `Writable` ストリームのプロパティ `objectMode` のゲッター。

##### `writable[Symbol.asyncDispose]()` {#writablesymbolasyncdispose}

**Added in: v22.4.0, v20.16.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

`AbortError` で [`writable.destroy()`](/ja/nodejs/api/stream#writabledestroyerror) を呼び出し、ストリームが終了したときに履行されるPromiseを返します。

##### `writable.write(chunk[, encoding][, callback])` {#writablewritechunk-encoding-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.0.0, v20.13.0 | `chunk` 引数は `TypedArray` または `DataView` インスタンスにすることができます。 |
| v8.0.0 | `chunk` 引数は `Uint8Array` インスタンスにすることができます。 |
| v6.0.0 | `chunk` パラメーターとして `null` を渡すと、オブジェクトモードであっても、常に無効と見なされるようになりました。 |
| v0.9.4 | Added in: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 書き込むオプションのデータ。 オブジェクトモードで動作していないストリームの場合、`chunk` は [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)、[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 、または [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) でなければなりません。 オブジェクトモードのストリームの場合、`chunk` は `null` 以外の任意の JavaScript 値にすることができます。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) `chunk` が文字列の場合のエンコーディング。 **デフォルト:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) このデータのチャンクがフラッシュされたときのコールバック。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ストリームが追加のデータの書き込みを続行する前に、呼び出し元のコードに `'drain'` イベントが発行されるのを待つことを希望する場合は `false`。それ以外の場合は `true`。

`writable.write()` メソッドはストリームにいくつかのデータを書き込み、データが完全に処理されたら、指定された `callback` を呼び出します。 エラーが発生した場合、`callback` は最初のエラー引数とともに呼び出されます。 `callback` は非同期的に呼び出され、`'error'` が発行される前に呼び出されます。

戻り値は、`chunk` を許可した後、内部バッファーがストリームの作成時に設定された `highWaterMark` より小さい場合は `true` です。 `false` が返された場合は、[`'drain'`](/ja/nodejs/api/stream#event-drain) イベントが発行されるまで、ストリームへのデータの書き込みのさらなる試みを停止する必要があります。

ストリームが排出されていない間は、`write()` の呼び出しは `chunk` をバッファリングし、false を返します。 現在バッファリングされているすべてのチャンクが排出される (オペレーティングシステムによる配信のために受け入れられる) と、`'drain'` イベントが発行されます。 `write()` が false を返したら、`'drain'` イベントが発行されるまで、それ以上のチャンクを書き込まないでください。 排出されていないストリームで `write()` を呼び出すことは許可されていますが、Node.js は最大のメモリ使用量が発生するまで、書き込まれたすべてのチャンクをバッファリングし、その時点で無条件に中止します。 中止する前であっても、メモリ使用量が多いと、ガベージコレクターのパフォーマンスが低下し、RSS が高くなります (これは通常、メモリが不要になった後でもシステムに解放されません)。 TCP ソケットは、リモートピアがデータを読み取らない場合、排出されない可能性があるため、排出されていないソケットへの書き込みは、リモートから悪用可能な脆弱性につながる可能性があります。

ストリームが排出されていない間にデータを書き込むことは、[`Transform`](/ja/nodejs/api/stream#class-streamtransform) で特に問題があります。これは、`Transform` ストリームは、パイプされるか、`'data'` または `'readable'` イベントハンドラーが追加されるまで、デフォルトで一時停止されるためです。

書き込むデータがオンデマンドで生成またはフェッチできる場合は、ロジックを [`Readable`](/ja/nodejs/api/stream#class-streamreadable) にカプセル化し、[`stream.pipe()`](/ja/nodejs/api/stream#readablepipedestination-options) を使用することをお勧めします。 ただし、`write()` の呼び出しが優先される場合は、[`'drain'`](/ja/nodejs/api/stream#event-drain) イベントを使用して、バックプレッシャーを尊重し、メモリの問題を回避することができます。

```js [ESM]
function write(data, cb) {
  if (!stream.write(data)) {
    stream.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

// 他の書き込みを行う前に、cb が呼び出されるのを待ちます。
write('hello', () => {
  console.log('書き込みが完了しました。他の書き込みを行います。');
});
```
オブジェクトモードの `Writable` ストリームは、常に `encoding` 引数を無視します。


### Readableストリーム {#readable-streams}

Readableストリームは、データを消費する*ソース*の抽象化です。

`Readable`ストリームの例には、以下が含まれます。

- [クライアント上のHTTPレスポンス](/ja/nodejs/api/http#class-httpincomingmessage)
- [サーバー上のHTTPリクエスト](/ja/nodejs/api/http#class-httpincomingmessage)
- [fsリードストリーム](/ja/nodejs/api/fs#class-fsreadstream)
- [zlibストリーム](/ja/nodejs/api/zlib)
- [cryptoストリーム](/ja/nodejs/api/crypto)
- [TCPソケット](/ja/nodejs/api/net#class-netsocket)
- [子プロセスのstdoutとstderr](/ja/nodejs/api/child_process#subprocessstdout)
- [`process.stdin`](/ja/nodejs/api/process#processstdin)

すべての[`Readable`](/ja/nodejs/api/stream#class-streamreadable)ストリームは、`stream.Readable`クラスで定義されたインターフェースを実装します。

#### 2つの読み込みモード {#two-reading-modes}

`Readable`ストリームは、効果的にフローモードと一時停止モードの2つのモードのいずれかで動作します。これらのモードは、[オブジェクトモード](/ja/nodejs/api/stream#object-mode)とは別です。[`Readable`](/ja/nodejs/api/stream#class-streamreadable)ストリームは、フローモードであるか一時停止モードであるかに関係なく、オブジェクトモードである場合とそうでない場合があります。

- フローモードでは、データは基礎となるシステムから自動的に読み取られ、[`EventEmitter`](/ja/nodejs/api/events#class-eventemitter)インターフェースを介してイベントを使用して、できるだけ早くアプリケーションに提供されます。
- 一時停止モードでは、ストリームからデータのチャンクを読み取るには、[`stream.read()`](/ja/nodejs/api/stream#readablereadsize)メソッドを明示的に呼び出す必要があります。

すべての[`Readable`](/ja/nodejs/api/stream#class-streamreadable)ストリームは一時停止モードで開始されますが、次のいずれかの方法でフローモードに切り替えることができます。

- [`'data'`](/ja/nodejs/api/stream#event-data)イベントハンドラーを追加する。
- [`stream.resume()`](/ja/nodejs/api/stream#readableresume)メソッドを呼び出す。
- [`stream.pipe()`](/ja/nodejs/api/stream#readablepipedestination-options)メソッドを呼び出して、データを[`Writable`](/ja/nodejs/api/stream#class-streamwritable)に送信する。

`Readable`は、次のいずれかを使用して一時停止モードに戻すことができます。

- パイプの宛先がない場合は、[`stream.pause()`](/ja/nodejs/api/stream#readablepause)メソッドを呼び出す。
- パイプの宛先がある場合は、すべてのパイプの宛先を削除する。複数のパイプの宛先は、[`stream.unpipe()`](/ja/nodejs/api/stream#readableunpipedestination)メソッドを呼び出すことで削除できます。

覚えておくべき重要な概念は、`Readable`は、そのデータを消費または無視するためのメカニズムが提供されるまで、データを生成しないということです。消費メカニズムが無効になるか取り除かれると、`Readable`はデータの生成を停止しようと*試みます*。

下位互換性の理由から、[`'data'`](/ja/nodejs/api/stream#event-data)イベントハンドラーを削除しても、ストリームは自動的に一時停止**しません**。また、パイプされた宛先がある場合、[`stream.pause()`](/ja/nodejs/api/stream#readablepause)を呼び出しても、それらの宛先がドレインされ、より多くのデータを要求したときに、ストリームが*一時停止したままになる*とは限りません。

[`Readable`](/ja/nodejs/api/stream#class-streamreadable)がフローモードに切り替えられ、データを処理できるコンシューマーがいない場合、そのデータは失われます。これは、たとえば、`readable.resume()`メソッドが`'data'`イベントにアタッチされたリスナーなしで呼び出された場合、または`'data'`イベントハンドラーがストリームから削除された場合に発生する可能性があります。

[`'readable'`](/ja/nodejs/api/stream#event-readable)イベントハンドラーを追加すると、ストリームは自動的にフローを停止し、データは[`readable.read()`](/ja/nodejs/api/stream#readablereadsize)を介して消費する必要があります。[`'readable'`](/ja/nodejs/api/stream#event-readable)イベントハンドラーが削除されると、[`'data'`](/ja/nodejs/api/stream#event-data)イベントハンドラーがある場合、ストリームは再びフローを開始します。


#### 3つの状態 {#three-states}

`Readable`ストリームの「2つのモード」は、`Readable`ストリームの実装内で発生している、より複雑な内部状態管理を単純化した抽象概念です。

具体的には、任意の時点で、すべての`Readable`は、次の3つの可能な状態のいずれかにあります。

- `readable.readableFlowing === null`
- `readable.readableFlowing === false`
- `readable.readableFlowing === true`

`readable.readableFlowing`が`null`の場合、ストリームのデータを消費するメカニズムは提供されません。したがって、ストリームはデータを生成しません。この状態の間は、`'data'`イベントのリスナーのアタッチ、`readable.pipe()`メソッドの呼び出し、または`readable.resume()`メソッドの呼び出しにより、`readable.readableFlowing`が`true`に切り替わり、`Readable`がデータの生成時に積極的にイベントを発行し始めます。

`readable.pause()`、`readable.unpipe()`の呼び出し、またはバックプレッシャーの受信により、`readable.readableFlowing`が`false`に設定され、イベントの流れが一時的に停止しますが、データの生成は*停止しません*。この状態の間は、`'data'`イベントのリスナーをアタッチしても、`readable.readableFlowing`は`true`に切り替わりません。

```js [ESM]
const { PassThrough, Writable } = require('node:stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing は false になりました。

pass.on('data', (chunk) => { console.log(chunk.toString()); });
// readableFlowing はまだ false です。
pass.write('ok');  // 'data' は発行されません。
pass.resume();     // ストリームに 'data' を発行させるには、呼び出す必要があります。
// readableFlowing は true になりました。
```
`readable.readableFlowing`が`false`の場合、データはストリームの内部バッファーに蓄積されている可能性があります。

#### 1つのAPIスタイルを選択する {#choose-one-api-style}

`Readable`ストリームAPIは、複数のNode.jsバージョンにわたって進化し、ストリームデータを消費する複数の方法を提供します。一般的に、開発者はデータの消費方法の*いずれか1つ*を選択し、*決して*複数の方法を使用して単一のストリームからデータを消費すべきではありません。具体的には、`on('data')`、`on('readable')`、`pipe()`、または非同期イテレーターの組み合わせを使用すると、直感に反する動作につながる可能性があります。


#### クラス: `stream.Readable` {#class-streamreadable}

**追加: v0.9.4**

##### イベント: `'close'` {#event-close_1}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `'close'` が destroy で発生するかどうかを指定する `emitClose` オプションを追加。 |
| v0.9.4 | 追加: v0.9.4 |
:::

`'close'` イベントは、ストリームとその基になるリソース (たとえば、ファイル記述子) がすべて閉じられたときに発生します。 このイベントは、これ以上イベントが発生せず、これ以上計算が行われないことを示します。

[`Readable`](/ja/nodejs/api/stream#class-streamreadable) ストリームは、`emitClose` オプションを指定して作成された場合、常に `'close'` イベントを発生させます。

##### イベント: `'data'` {#event-data}

**追加: v0.9.4**

- `chunk` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) データのチャンク。 オブジェクトモードで動作していないストリームの場合、チャンクは文字列または `Buffer` になります。 オブジェクトモードのストリームの場合、チャンクは `null` 以外の任意の JavaScript 値にすることができます。

`'data'` イベントは、ストリームがデータのチャンクの所有権をコンシューマーに譲渡するたびに発生します。 これは、`readable.pipe()`、`readable.resume()` を呼び出すか、`'data'` イベントにリスナーコールバックをアタッチして、ストリームがフローモードに切り替えられたときに発生する可能性があります。 `'data'` イベントは、`readable.read()` メソッドが呼び出され、返されるデータチャンクがある場合にも発生します。

明示的に一時停止されていないストリームに `'data'` イベントリスナーをアタッチすると、ストリームがフローモードに切り替わります。 データは、利用可能になるとすぐに渡されます。

リスナーコールバックには、`readable.setEncoding()` メソッドを使用してストリームにデフォルトエンコーディングが指定されている場合は、データのチャンクが文字列として渡されます。 そうでない場合、データは `Buffer` として渡されます。

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
```

##### Event: `'end'` {#event-end}

**Added in: v0.9.4**

`'end'` イベントは、ストリームから消費するデータがなくなったときに発生します。

`'end'` イベントは、データが完全に消費されない限り**発生しません**。これは、ストリームをフローモードに切り替えるか、すべてのデータが消費されるまで繰り返し[`stream.read()`](/ja/nodejs/api/stream#readablereadsize)を呼び出すことで実現できます。

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
readable.on('end', () => {
  console.log('There will be no more data.');
});
```
##### Event: `'error'` {#event-error_1}

**Added in: v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`'error'` イベントは、`Readable` 実装によっていつでも発生する可能性があります。通常、これは、基礎となるストリームが内部的な障害のためにデータを生成できない場合、またはストリーム実装が無効なデータのチャンクをプッシュしようとした場合に発生する可能性があります。

リスナーのコールバックには、単一の `Error` オブジェクトが渡されます。

##### Event: `'pause'` {#event-pause}

**Added in: v0.9.4**

`'pause'` イベントは、[`stream.pause()`](/ja/nodejs/api/stream#readablepause)が呼び出され、`readableFlowing` が `false` でない場合に発生します。

##### Event: `'readable'` {#event-readable}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | `'readable'` は、`.push()` が呼び出された後の次のティックで常に発行されます。 |
| v10.0.0 | `'readable'` を使用するには、`.read()` を呼び出す必要があります。 |
| v0.9.4 | Added in: v0.9.4 |
:::

`'readable'` イベントは、ストリームから読み取ることができるデータがある場合、設定された high water mark (`state.highWaterMark`) まで発行されます。実質的に、これはストリームがバッファ内に新しい情報を持っていることを示します。このバッファ内にデータがある場合、[`stream.read()`](/ja/nodejs/api/stream#readablereadsize)を呼び出してそのデータを取得できます。さらに、`'readable'` イベントは、ストリームの終わりに達した場合にも発行されることがあります。

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('readable', function() {
  // There is some data to read now.
  let data;

  while ((data = this.read()) !== null) {
    console.log(data);
  }
});
```
ストリームの終わりに達した場合、[`stream.read()`](/ja/nodejs/api/stream#readablereadsize)を呼び出すと `null` が返され、`'end'` イベントがトリガーされます。これは、読み取るデータがまったくない場合も同様です。たとえば、次の例では、`foo.txt` は空のファイルです。

```js [ESM]
const fs = require('node:fs');
const rr = fs.createReadStream('foo.txt');
rr.on('readable', () => {
  console.log(`readable: ${rr.read()}`);
});
rr.on('end', () => {
  console.log('end');
});
```
このスクリプトを実行した出力は次のとおりです。

```bash [BASH]
$ node test.js
readable: null
end
```
場合によっては、`'readable'` イベントのリスナーをアタッチすると、ある程度のデータが内部バッファに読み込まれることがあります。

一般に、`readable.pipe()` および `'data'` イベントのメカニズムは、`'readable'` イベントよりも理解しやすいものです。ただし、`'readable'` を処理すると、スループットが向上する可能性があります。

`'readable'` と [`'data'`](/ja/nodejs/api/stream#event-data) の両方が同時に使用される場合、`'readable'` がフローの制御において優先されます。つまり、`'data'` は [`stream.read()`](/ja/nodejs/api/stream#readablereadsize) が呼び出された場合にのみ発行されます。`readableFlowing` プロパティは `false` になります。`'readable'` が削除されたときに `'data'` リスナーがある場合、ストリームはフローを開始します。つまり、`.resume()` を呼び出さなくても `'data'` イベントが発行されます。


##### イベント: `'resume'` {#event-resume}

**追加:** v0.9.4

`'resume'` イベントは、[`stream.resume()`](/ja/nodejs/api/stream#readableresume) が呼び出され、`readableFlowing` が `true` でない場合に発生します。

##### `readable.destroy([error])` {#readabledestroyerror}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.0.0 | 既に破棄されているストリームでは、何もしないようになりました。 |
| v8.0.0 | 追加: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) `'error'` イベントでペイロードとして渡されるエラー
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

ストリームを破棄します。オプションで `'error'` イベントを発行し、`'close'` イベントを発行します（`emitClose` が `false` に設定されていない場合）。この呼び出しの後、readable ストリームは内部リソースを解放し、以降の `push()` の呼び出しは無視されます。

`destroy()` が呼び出されると、それ以降の呼び出しは何もしなくなり、`_destroy()` からのものを除き、`'error'` としてエラーが発行されることはありません。

実装者はこのメソッドをオーバーライドするべきではなく、代わりに [`readable._destroy()`](/ja/nodejs/api/stream#readable_destroyerr-callback) を実装する必要があります。

##### `readable.closed` {#readableclosed}

**追加:** v18.0.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`'close'` が発行された後、`true` になります。

##### `readable.destroyed` {#readabledestroyed}

**追加:** v8.0.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`readable.destroy()`](/ja/nodejs/api/stream#readabledestroyerror) が呼び出された後、`true` になります。

##### `readable.isPaused()` {#readableispaused}

**追加:** v0.11.14

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`readable.isPaused()` メソッドは、`Readable` の現在の動作状態を返します。これは主に、`readable.pipe()` メソッドの基礎となるメカニズムによって使用されます。ほとんどの場合、このメソッドを直接使用する理由はありません。

```js [ESM]
const readable = new stream.Readable();

readable.isPaused(); // === false
readable.pause();
readable.isPaused(); // === true
readable.resume();
readable.isPaused(); // === false
```

##### `readable.pause()` {#readablepause}

**追加:** v0.9.4

- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`readable.pause()`メソッドは、フローモードのストリームで[`'data'`](/ja/nodejs/api/stream#event-data)イベントの発行を停止させ、フローモードを終了させます。利用可能になったデータは、内部バッファーに残ります。

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
  readable.pause();
  console.log('There will be no additional data for 1 second.');
  setTimeout(() => {
    console.log('Now data will start flowing again.');
    readable.resume();
  }, 1000);
});
```
`readable.pause()`メソッドは、`'readable'`イベントリスナーが存在する場合は効果がありません。

##### `readable.pipe(destination[, options])` {#readablepipedestination-options}

**追加:** v0.9.4

- `destination` [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable) データの書き込み先
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) パイプのオプション
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) リーダーが終了したときにライターを終了します。 **デフォルト:** `true`。

- 戻り値: [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable) *destination* は、[`Duplex`](/ja/nodejs/api/stream#class-streamduplex) または [`Transform`](/ja/nodejs/api/stream#class-streamtransform) ストリームの場合、パイプのチェーンを可能にします。

`readable.pipe()`メソッドは、[`Writable`](/ja/nodejs/api/stream#class-streamwritable)ストリームを`readable`に接続し、自動的にフローモードに切り替わり、そのすべてのデータを接続された[`Writable`](/ja/nodejs/api/stream#class-streamwritable)にプッシュさせます。データの流れは自動的に管理され、宛先の`Writable`ストリームがより高速な`Readable`ストリームによって圧倒されないようにします。

次の例では、`readable`からのすべてのデータを`file.txt`という名前のファイルにパイプします。

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// All the data from readable goes into 'file.txt'.
readable.pipe(writable);
```
複数の`Writable`ストリームを単一の`Readable`ストリームに接続することが可能です。

`readable.pipe()`メソッドは*destination*ストリームへの参照を返し、パイプされたストリームのチェーンをセットアップすることが可能になります。

```js [ESM]
const fs = require('node:fs');
const zlib = require('node:zlib');
const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
```
デフォルトでは、ソースの`Readable`ストリームが[`'end'`](/ja/nodejs/api/stream#event-end)を発行すると、宛先の`Writable`ストリームで[`stream.end()`](/ja/nodejs/api/stream#writableendchunk-encoding-callback)が呼び出され、宛先は書き込み可能ではなくなります。このデフォルトの動作を無効にするには、`end`オプションを`false`として渡すと、宛先ストリームは開いたままになります。

```js [ESM]
reader.pipe(writer, { end: false });
reader.on('end', () => {
  writer.end('Goodbye\n');
});
```
1つの重要な注意点は、`Readable`ストリームが処理中にエラーを発行した場合、`Writable`宛先*は自動的に閉じられない*ことです。エラーが発生した場合は、メモリリークを防ぐために、各ストリームを*手動で*閉じる必要があります。

[`process.stderr`](/ja/nodejs/api/process#processstderr) および [`process.stdout`](/ja/nodejs/api/process#processstdout) `Writable` ストリームは、指定されたオプションに関係なく、Node.js プロセスが終了するまで閉じられません。


##### `readable.read([size])` {#readablereadsize}

**Added in: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込むデータ量を指定するオプションの引数。
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`readable.read()` メソッドは、内部バッファーからデータを読み取り、それを返します。読み取るデータがない場合、`null` が返されます。デフォルトでは、`readable.setEncoding()` メソッドを使用してエンコーディングが指定されていない場合、またはストリームがオブジェクトモードで動作していない限り、データは `Buffer` オブジェクトとして返されます。

オプションの `size` 引数は、読み込む特定のバイト数を指定します。`size` バイトを読み取ることができない場合、ストリームが終了していない *限り* `null` が返されます。終了している場合は、内部バッファーに残っているすべてのデータが返されます。

`size` 引数が指定されていない場合、内部バッファーに含まれるすべてのデータが返されます。

`size` 引数は、1 GiB 以下でなければなりません。

`readable.read()` メソッドは、一時停止モードで動作している `Readable` ストリームでのみ呼び出す必要があります。フローモードでは、内部バッファーが完全に排出されるまで `readable.read()` が自動的に呼び出されます。

```js [ESM]
const readable = getReadableStreamSomehow();

// データがバッファリングされると、'readable' が複数回トリガーされる可能性があります
readable.on('readable', () => {
  let chunk;
  console.log('Stream is readable (new data received in buffer)');
  // 現在利用可能なすべてのデータを読み取るためにループを使用します
  while (null !== (chunk = readable.read())) {
    console.log(`Read ${chunk.length} bytes of data...`);
  }
});

// データがなくなると、'end' が一度トリガーされます
readable.on('end', () => {
  console.log('Reached end of stream.');
});
```
`readable.read()` の各呼び出しは、データのチャンクまたは `null` を返し、その時点では読み取るデータがこれ以上ないことを示します。これらのチャンクは自動的に連結されません。単一の `read()` 呼び出しですべてのデータが返されるわけではないため、すべてのデータが取得されるまでチャンクを継続的に読み取るには、while ループの使用が必要になる場合があります。大きなファイルを読み取るとき、`.read()` は一時的に `null` を返すことがあります。これは、バッファリングされたコンテンツをすべて消費したが、まだバッファリングされるデータが残っている可能性があることを示します。このような場合、バッファーにデータが追加されると、新しい `'readable'` イベントが発生し、`'end'` イベントはデータ転送の終了を示します。

したがって、`readable` からファイルの内容全体を読み取るには、複数の `'readable'` イベントにわたってチャンクを収集する必要があります。

```js [ESM]
const chunks = [];

readable.on('readable', () => {
  let chunk;
  while (null !== (chunk = readable.read())) {
    chunks.push(chunk);
  }
});

readable.on('end', () => {
  const content = chunks.join('');
});
```
オブジェクトモードの `Readable` ストリームは、`size` 引数の値に関係なく、[`readable.read(size)`](/ja/nodejs/api/stream#readablereadsize) の呼び出しから常に単一の項目を返します。

`readable.read()` メソッドがデータのチャンクを返した場合、`'data'` イベントも発生します。

[`'end'`](/ja/nodejs/api/stream#event-end) イベントが発生した後で [`stream.read([size])`](/ja/nodejs/api/stream#readablereadsize) を呼び出すと、`null` が返されます。ランタイムエラーは発生しません。


##### `readable.readable` {#readablereadable}

**Added in: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`readable.read()`](/ja/nodejs/api/stream#readablereadsize) を呼び出すのが安全かどうかを示す `true` です。これはストリームが破棄されていないか、`'error'` または `'end'` を発行していないことを意味します。

##### `readable.readableAborted` {#readablereadableaborted}

**Added in: v16.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`'end'` を発行する前にストリームが破棄されたか、エラーが発生したかを示す値を返します。

##### `readable.readableDidRead` {#readablereadabledidread}

**Added in: v16.7.0, v14.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`'data'` が発行されたかどうかを示す値を返します。

##### `readable.readableEncoding` {#readablereadableencoding}

**Added in: v12.7.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

指定された `Readable` ストリームのプロパティ `encoding` のゲッター。 `encoding` プロパティは、[`readable.setEncoding()`](/ja/nodejs/api/stream#readablesetencodingencoding) メソッドを使用して設定できます。

##### `readable.readableEnded` {#readablereadableended}

**Added in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`'end'`](/ja/nodejs/api/stream#event-end) イベントが発行されると `true` になります。

##### `readable.errored` {#readableerrored}

**Added in: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

ストリームがエラーで破棄された場合、エラーを返します。

##### `readable.readableFlowing` {#readablereadableflowing}

**Added in: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

このプロパティは、[3 つの状態](/ja/nodejs/api/stream#three-states) セクションで説明されている `Readable` ストリームの現在の状態を反映します。


##### `readable.readableHighWaterMark` {#readablereadablehighwatermark}

**追加: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

この `Readable` の作成時に渡された `highWaterMark` の値を返します。

##### `readable.readableLength` {#readablereadablelength}

**追加: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

このプロパティには、読み取り可能なキュー内のバイト数（またはオブジェクト数）が含まれています。 この値は、`highWaterMark` のステータスに関するイントロスペクションデータを提供します。

##### `readable.readableObjectMode` {#readablereadableobjectmode}

**追加: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

指定された `Readable` ストリームのプロパティ `objectMode` のゲッター。

##### `readable.resume()` {#readableresume}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | `'readable'` イベントをリッスンしている場合、`resume()` は効果がありません。 |
| v0.9.4 | 追加: v0.9.4 |
:::

- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`readable.resume()` メソッドは、明示的に一時停止された `Readable` ストリームに [`'data'`](/ja/nodejs/api/stream#event-data) イベントの発行を再開させ、ストリームをフローモードに切り替えます。

`readable.resume()` メソッドを使用すると、実際にデータを処理せずに、ストリームからデータを完全に消費できます。

```js [ESM]
getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('最後に到達しましたが、何も読んでいません。');
  });
```
`readable.resume()` メソッドは、`'readable'` イベントリスナーがある場合には効果がありません。

##### `readable.setEncoding(encoding)` {#readablesetencodingencoding}

**追加: v0.9.4**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 使用するエンコーディング。
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`readable.setEncoding()` メソッドは、`Readable` ストリームから読み取られたデータの文字エンコーディングを設定します。

デフォルトでは、エンコーディングは割り当てられず、ストリームデータは `Buffer` オブジェクトとして返されます。 エンコーディングを設定すると、ストリームデータは `Buffer` オブジェクトではなく、指定されたエンコーディングの文字列として返されるようになります。 たとえば、`readable.setEncoding('utf8')` を呼び出すと、出力データは UTF-8 データとして解釈され、文字列として渡されます。 `readable.setEncoding('hex')` を呼び出すと、データは16進数文字列形式でエンコードされます。

`Readable` ストリームは、ストリームを介して配信されるマルチバイト文字を適切に処理します。そうしないと、ストリームから `Buffer` オブジェクトとして単純にプルすると、不適切にデコードされます。

```js [ESM]
const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log('文字列データの %d 文字を取得しました:', chunk.length);
});
```

##### `readable.unpipe([destination])` {#readableunpipedestination}

**Added in: v0.9.4**

- `destination` [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable) 取り外すオプションの特定のストリーム
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`readable.unpipe()` メソッドは、以前に [`stream.pipe()`](/ja/nodejs/api/stream#readablepipedestination-options) メソッドを使用して接続された `Writable` ストリームを取り外します。

`destination` が指定されていない場合、*すべて* のパイプが取り外されます。

`destination` が指定されているものの、パイプが設定されていない場合、メソッドは何もしません。

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// readable からのすべてのデータは 'file.txt' に入りますが、
// 最初の 1 秒間のみです。
readable.pipe(writable);
setTimeout(() => {
  console.log('Stop writing to file.txt.');
  readable.unpipe(writable);
  console.log('Manually close the file stream.');
  writable.end();
}, 1000);
```
##### `readable.unshift(chunk[, encoding])` {#readableunshiftchunk-encoding}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.0.0, v20.13.0 | `chunk` 引数に `TypedArray` または `DataView` インスタンスを使用できるようになりました。 |
| v8.0.0 | `chunk` 引数に `Uint8Array` インスタンスを使用できるようになりました。 |
| v0.9.11 | Added in: v0.9.11 |
:::

- `chunk` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 読み取りキューにアンシフトするデータのチャンク。 オブジェクトモードで動作していないストリームの場合、`chunk` は [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)、[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) または `null` である必要があります。 オブジェクトモードストリームの場合、`chunk` は任意の JavaScript 値にすることができます。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 文字列チャンクのエンコーディング。 `'utf8'` や `'ascii'` などの有効な `Buffer` エンコーディングである必要があります。

`chunk` を `null` として渡すと、ストリームの終わり (EOF) を示し、`readable.push(null)` と同じように動作し、その後はデータを書き込むことができません。 EOF 信号はバッファーの最後に配置され、バッファーされたデータはすべてフラッシュされます。

`readable.unshift()` メソッドは、データのチャンクを内部バッファーに戻します。 これは、ストリームが、ソースから楽観的に引き出したデータの一部を "消費解除" し、そのデータを他のパーティに渡す必要のあるコードによって消費されている特定の状況で役立ちます。

`stream.unshift(chunk)` メソッドは、[`'end'`](/ja/nodejs/api/stream#event-end) イベントが発生した後では呼び出すことができず、実行時エラーがスローされます。

`stream.unshift()` を使用する開発者は、代わりに [`Transform`](/ja/nodejs/api/stream#class-streamtransform) ストリームの使用に切り替えることを検討する必要があります。 詳細については、[ストリーム実装者のための API](/ja/nodejs/api/stream#api-for-stream-implementers) セクションを参照してください。

```js [ESM]
// \n\n で区切られたヘッダーを取り出します。
// 多すぎる場合は unshift() を使用します。
// (error, header, stream) でコールバックを呼び出します。
const { StringDecoder } = require('node:string_decoder');
function parseHeader(stream, callback) {
  stream.on('error', callback);
  stream.on('readable', onReadable);
  const decoder = new StringDecoder('utf8');
  let header = '';
  function onReadable() {
    let chunk;
    while (null !== (chunk = stream.read())) {
      const str = decoder.write(chunk);
      if (str.includes('\n\n')) {
        // ヘッダーの境界が見つかりました。
        const split = str.split(/\n\n/);
        header += split.shift();
        const remaining = split.join('\n\n');
        const buf = Buffer.from(remaining, 'utf8');
        stream.removeListener('error', callback);
        // unshifting の前に 'readable' リスナーを削除します。
        stream.removeListener('readable', onReadable);
        if (buf.length)
          stream.unshift(buf);
        // これで、メッセージの本文をストリームから読み取ることができます。
        callback(null, header, stream);
        return;
      }
      // まだヘッダーを読み取っています。
      header += str;
    }
  }
}
```
[`stream.push(chunk)`](/ja/nodejs/api/stream#readablepushchunk-encoding) とは異なり、`stream.unshift(chunk)` は、ストリームの内部読み取り状態をリセットすることによって読み取りプロセスを終了しません。 これにより、`readable.unshift()` が読み取り中に (つまり、カスタムストリームの [`stream._read()`](/ja/nodejs/api/stream#readable_readsize) 実装内から) 呼び出された場合、予期しない結果が発生する可能性があります。 `readable.unshift()` の呼び出しの後にすぐに [`stream.push('')`](/ja/nodejs/api/stream#readablepushchunk-encoding) を呼び出すと、読み取り状態が適切にリセットされますが、読み取りの実行中に `readable.unshift()` を呼び出すことを回避するのが最善です。


##### `readable.wrap(stream)` {#readablewrapstream}

**追加:** v0.9.4

- `stream` [\<Stream\>](/ja/nodejs/api/stream#stream) 古いスタイルの readable ストリーム
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Node.js 0.10 以前では、ストリームは現在定義されている `node:stream` モジュール API 全体を実装していませんでした。（詳細については、[互換性](/ja/nodejs/api/stream#compatibility-with-older-nodejs-versions)を参照してください。）

[`'data'`](/ja/nodejs/api/stream#event-data) イベントを発行し、アドバイザリのみの [`stream.pause()`](/ja/nodejs/api/stream#readablepause) メソッドを持つ古い Node.js ライブラリを使用する場合、`readable.wrap()` メソッドを使用して、古いストリームをデータソースとして使用する [`Readable`](/ja/nodejs/api/stream#class-streamreadable) ストリームを作成できます。

`readable.wrap()` を使用する必要性はほとんどありませんが、古い Node.js アプリケーションやライブラリとのやり取りを容易にするために、このメソッドが提供されています。

```js [ESM]
const { OldReader } = require('./old-api-module.js');
const { Readable } = require('node:stream');
const oreader = new OldReader();
const myReader = new Readable().wrap(oreader);

myReader.on('readable', () => {
  myReader.read(); // etc.
});
```
##### `readable[Symbol.asyncIterator]()` {#readablesymbolasynciterator}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v11.14.0 | Symbol.asyncIterator のサポートは実験的ではなくなりました。 |
| v10.0.0 | 追加: v10.0.0 |
:::

- 戻り値: ストリームを完全に消費するための [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)。

```js [ESM]
const fs = require('node:fs');

async function print(readable) {
  readable.setEncoding('utf8');
  let data = '';
  for await (const chunk of readable) {
    data += chunk;
  }
  console.log(data);
}

print(fs.createReadStream('file')).catch(console.error);
```
ループが `break`、`return`、または `throw` で終了した場合、ストリームは破棄されます。 言い換えれば、ストリームを反復処理すると、ストリームが完全に消費されます。 ストリームは、`highWaterMark` オプションと同じサイズのチャンクで読み取られます。 上記のコード例では、[`fs.createReadStream()`](/ja/nodejs/api/fs#fscreatereadstreampath-options) に `highWaterMark` オプションが指定されていないため、ファイルに 64 KiB 未満のデータしかない場合、データは単一のチャンクになります。


##### `readable[Symbol.asyncDispose]()` {#readablesymbolasyncdispose}

**追加:** v20.4.0, v18.18.0

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

`AbortError` を伴って [`readable.destroy()`](/ja/nodejs/api/stream#readabledestroyerror) を呼び出し、ストリームが完了したときに解決する Promise を返します。

##### `readable.compose(stream[, options])` {#readablecomposestream-options}

**追加:** v19.1.0, v18.13.0

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `stream` [\<Stream\>](/ja/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) シグナルが中止された場合にストリームの破棄を許可します。
  
 
- 戻り値: [\<Duplex\>](/ja/nodejs/api/stream#class-streamduplex) ストリーム `stream` と合成されたストリーム。

```js [ESM]
import { Readable } from 'node:stream';

async function* splitToWords(source) {
  for await (const chunk of source) {
    const words = String(chunk).split(' ');

    for (const word of words) {
      yield word;
    }
  }
}

const wordsStream = Readable.from(['this is', 'compose as operator']).compose(splitToWords);
const words = await wordsStream.toArray();

console.log(words); // prints ['this', 'is', 'compose', 'as', 'operator']
```
詳細については、[`stream.compose`](/ja/nodejs/api/stream#streamcomposestreams) を参照してください。

##### `readable.iterator([options])` {#readableiteratoroptions}

**追加:** v16.3.0

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `destroyOnReturn` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` に設定すると、async iterator で `return` を呼び出すか、`break`、`return`、または `throw` を使用して `for await...of` イテレーションを終了しても、ストリームは破棄されません。 **デフォルト:** `true`。
  
 
- 戻り値: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) ストリームを消費するための。

このメソッドで作成されたイテレーターは、`return`、`break`、または `throw` で `for await...of` ループが終了した場合、またはストリームがイテレーション中にエラーを発した場合にイテレーターがストリームを破棄する必要がある場合に、ストリームの破棄をキャンセルするオプションをユーザーに提供します。

```js [ESM]
const { Readable } = require('node:stream');

async function printIterator(readable) {
  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // false

  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // Will print 2 and then 3
  }

  console.log(readable.destroyed); // True, stream was totally consumed
}

async function printSymbolAsyncIterator(readable) {
  for await (const chunk of readable) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // true
}

async function showBoth() {
  await printIterator(Readable.from([1, 2, 3]));
  await printSymbolAsyncIterator(Readable.from([1, 2, 3]));
}

showBoth();
```

##### `readable.map(fn[, options])` {#readablemapfn-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v20.7.0, v18.19.0 | `highWaterMark` が options に追加されました。 |
| v17.4.0, v16.14.0 | Added in: v17.4.0, v16.14.0 |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) ストリーム内のすべてのチャンクをマップする関数。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) ストリームからのデータのチャンク。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) ストリームが破棄された場合に中止され、`fn` の呼び出しを早期に中止することができます。

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ストリーム上で一度に呼び出す `fn` の同時実行の最大数。**デフォルト:** `1`。
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) マップされたアイテムのユーザーによる消費を待っている間にバッファするアイテムの数。**デフォルト:** `concurrency * 2 - 1`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) シグナルが中止された場合にストリームを破棄することができます。

- 戻り値: [\<Readable\>](/ja/nodejs/api/stream#class-streamreadable) 関数 `fn` でマップされたストリーム。

このメソッドは、ストリームをマップすることができます。`fn` 関数は、ストリーム内のすべてのチャンクに対して呼び出されます。`fn` 関数が promise を返す場合、その promise は、結果ストリームに渡される前に `await` されます。

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// 同期マッパーを使用します。
for await (const chunk of Readable.from([1, 2, 3, 4]).map((x) => x * 2)) {
  console.log(chunk); // 2, 4, 6, 8
}
// 非同期マッパーを使用し、一度に最大 2 つのクエリを実行します。
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map((domain) => resolver.resolve4(domain), { concurrency: 2 });
for await (const result of dnsResults) {
  console.log(result); // resolver.resolve4 の DNS 結果をログに記録します。
}
```

##### `readable.filter(fn[, options])` {#readablefilterfn-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v20.7.0, v18.19.0 | オプションに `highWaterMark` を追加。 |
| v17.4.0, v16.14.0 | 追加: v17.4.0, v16.14.0 |
:::

::: warning [安定度: 1 - 試験的]
[安定度: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) ストリームからチャンクをフィルタリングする関数。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) ストリームからのデータのチャンク。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) ストリームが破棄された場合に中止され、`fn` の呼び出しを早期に中止できます。



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ストリーム上で一度に呼び出す `fn` の同時実行の最大数。 **デフォルト:** `1`。
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) フィルタリングされたアイテムのユーザーによる消費を待機している間にバッファするアイテムの数。 **デフォルト:** `concurrency * 2 - 1`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) シグナルが中止された場合にストリームを破棄できます。


- 戻り値: [\<Readable\>](/ja/nodejs/api/stream#class-streamreadable) 述語 `fn` でフィルタリングされたストリーム。

このメソッドを使用すると、ストリームをフィルタリングできます。ストリーム内の各チャンクに対して `fn` 関数が呼び出され、それが truthy な値を返した場合、チャンクは結果ストリームに渡されます。`fn` 関数が Promise を返す場合、その Promise は `await` されます。

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// 同期的な述語を使用する。
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// 非同期的な述語を使用し、一度に最大 2 つのクエリを実行する。
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).filter(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address.ttl > 60;
}, { concurrency: 2 });
for await (const result of dnsResults) {
  // 解決された DNS レコードに 60 秒以上の時間があるドメインをログに記録します。
  console.log(result);
}
```

##### `readable.forEach(fn[, options])` {#readableforeachfn-options}

**Added in: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) ストリームの各チャンクで呼び出す関数。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) ストリームからのデータのチャンク。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) ストリームが破棄された場合に中断され、`fn` の呼び出しを早期に中止できます。

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ストリームで一度に呼び出す `fn` の同時実行の最大数。 **Default:** `1`.
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) シグナルが中止された場合にストリームを破棄できるようにします。

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ストリームが終了したときの promise。

このメソッドは、ストリームを反復処理できます。ストリーム内の各チャンクに対して、`fn` 関数が呼び出されます。`fn` 関数が promise を返す場合、その promise は `await` されます。

このメソッドは、チャンクを同時に処理できるという点で、`for await...of` ループとは異なります。さらに、`forEach` 反復処理は、`signal` オプションを渡して関連する `AbortController` を中止することによってのみ停止できますが、`for await...of` は `break` または `return` で停止できます。どちらの場合も、ストリームは破棄されます。

このメソッドは、基盤となる機構で [`readable`](/ja/nodejs/api/stream#class-streamreadable) イベントを使用し、同時 `fn` 呼び出しの数を制限できるという点で、[`'data'`](/ja/nodejs/api/stream#event-data) イベントをリッスンするのとは異なります。

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// 同期述語を使用します。
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// 非同期述語を使用して、一度に最大 2 つのクエリを実行します。
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 });
await dnsResults.forEach((result) => {
  // `for await (const result of dnsResults)` と同様に、結果をログに記録します。
  console.log(result);
});
console.log('done'); // ストリームが終了しました
```

##### `readable.toArray([options])` {#readabletoarrayoptions}

**追加:** v17.5.0, v16.15.0

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) シグナルが中止された場合に、toArray 操作のキャンセルを許可します。


- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ストリームの内容を含む配列を含むPromise。

このメソッドを使用すると、ストリームの内容を簡単に取得できます。

このメソッドはストリーム全体をメモリに読み込むため、ストリームの利点を打ち消します。 これは、ストリームを使用する主な方法としてではなく、相互運用性と利便性を目的としています。

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

await Readable.from([1, 2, 3, 4]).toArray(); // [1, 2, 3, 4]

// .map を使用して DNS クエリを同時実行し、
// toArray を使用して結果を配列に収集します
const dnsResults = await Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 }).toArray();
```
##### `readable.some(fn[, options])` {#readablesomefn-options}

**追加:** v17.5.0, v16.15.0

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) ストリームの各チャンクで呼び出す関数。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) ストリームからのデータのチャンク。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) ストリームが破棄された場合に中止され、`fn` 呼び出しを早期に中止できるようにします。



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ストリームで一度に呼び出す `fn` の最大同時呼び出し数。 **デフォルト:** `1`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) シグナルが中止された場合にストリームの破棄を許可します。


- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 少なくとも1つのチャンクに対して `fn` が truthy な値を返した場合に `true` に評価される Promise。

このメソッドは `Array.prototype.some` と同様であり、待機された戻り値が `true` (または任意の truthy 値)になるまで、ストリーム内の各チャンクで `fn` を呼び出します。 チャンクに対する `fn` 呼び出しの待機された戻り値が truthy になると、ストリームは破棄され、Promise は `true` で履行されます。 チャンクに対する `fn` 呼び出しのいずれも truthy な値を返さない場合、Promise は `false` で履行されます。

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// 同期述語を使用。
await Readable.from([1, 2, 3, 4]).some((x) => x > 2); // true
await Readable.from([1, 2, 3, 4]).some((x) => x < 0); // false

// 非同期述語を使用し、一度に最大 2 つのファイル チェックを実行。
const anyBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).some(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(anyBigFile); // リスト内のいずれかのファイルが 1MB より大きい場合は `true`
console.log('done'); // ストリームが終了しました
```

##### `readable.find(fn[, options])` {#readablefindfn-options}

**Added in: v17.5.0, v16.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) ストリームの各チャンクで呼び出す関数。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) ストリームからのデータのチャンク。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) ストリームが破棄された場合に中断され、`fn` の呼び出しを早期に中断できるようにします。



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ストリームで一度に呼び出す `fn` の最大同時呼び出し数。 **デフォルト:** `1`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) シグナルが中断された場合にストリームを破棄できるようにします。


- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) `fn` が真の値を評価した最初のチャンクに評価される Promise。要素が見つからなかった場合は `undefined`。

このメソッドは `Array.prototype.find` と似ており、ストリーム内の各チャンクで `fn` を呼び出して、`fn` の真の値を持つチャンクを見つけます。 `fn` 呼び出しの待機された戻り値が真であると、ストリームは破棄され、Promise は `fn` が真の値を返した値で fulfilled されます。チャンクに対するすべての `fn` 呼び出しが偽の値を返した場合、Promise は `undefined` で fulfilled されます。

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// 同期述語を使用。
await Readable.from([1, 2, 3, 4]).find((x) => x > 2); // 3
await Readable.from([1, 2, 3, 4]).find((x) => x > 0); // 1
await Readable.from([1, 2, 3, 4]).find((x) => x > 10); // undefined

// 非同期述語を使用し、一度に最大2つのファイルチェックを実行。
const foundBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).find(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(foundBigFile); // リスト内のいずれかのファイルが1MBより大きい場合、大きなファイルの名前
console.log('done'); // ストリームが終了しました
```

##### `readable.every(fn[, options])` {#readableeveryfn-options}

**Added in: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) ストリームの各チャンクで呼び出す関数。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) ストリームからのデータのチャンク。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) ストリームが破棄された場合に中断され、`fn` の呼び出しを早期に中断できます。
  
 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ストリーム上で一度に呼び出す `fn` の最大同時実行数。**Default:** `1`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) シグナルが中断された場合、ストリームを破棄できます。
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) `fn` がすべてのチャンクに対して truthy な値を返した場合に `true` と評価される Promise。

このメソッドは `Array.prototype.every` と似ており、ストリーム内の各チャンクに対して `fn` を呼び出し、待機されたすべての戻り値が `fn` に対して truthy な値であるかどうかを確認します。チャンクに対する `fn` の呼び出しの待機された戻り値が falsy である場合、ストリームは破棄され、Promise は `false` で満たされます。チャンクに対する `fn` の呼び出しがすべて truthy な値を返した場合、Promise は `true` で満たされます。

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// 同期述語を使用。
await Readable.from([1, 2, 3, 4]).every((x) => x > 2); // false
await Readable.from([1, 2, 3, 4]).every((x) => x > 0); // true

// 非同期述語を使用。一度に最大 2 つのファイルチェックを実行。
const allBigFiles = await Readable.from([
  'file1',
  'file2',
  'file3',
]).every(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
// リスト内のすべてのファイルが 1MiB より大きい場合は `true`
console.log(allBigFiles);
console.log('done'); // ストリームが完了しました
```

##### `readable.flatMap(fn[, options])` {#readableflatmapfn-options}

**Added in: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) ストリーム内のすべてのチャンクにマップする関数。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) ストリームからのデータのチャンク。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) ストリームが破棄された場合に中断され、`fn`の呼び出しを早期に中断できるようにします。

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ストリーム上で一度に呼び出す`fn`の同時実行の最大数。**デフォルト:** `1`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) シグナルが中断された場合にストリームを破棄できるようにします。

- 戻り値: [\<Readable\>](/ja/nodejs/api/stream#class-streamreadable) 関数`fn`でフラットマップされたストリーム。

このメソッドは、ストリームの各チャンクに与えられたコールバックを適用し、その結果を平坦化することによって、新しいストリームを返します。

`fn`からストリーム、または別のイテラブルまたは非同期イテラブルを返すことが可能であり、結果のストリームはマージ（平坦化）されて返されたストリームになります。

```js [ESM]
import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';

// 同期マッパーを使用。
for await (const chunk of Readable.from([1, 2, 3, 4]).flatMap((x) => [x, x])) {
  console.log(chunk); // 1, 1, 2, 2, 3, 3, 4, 4
}
// 非同期マッパーを使用し、4つのファイルの内容を結合する
const concatResult = Readable.from([
  './1.mjs',
  './2.mjs',
  './3.mjs',
  './4.mjs',
]).flatMap((fileName) => createReadStream(fileName));
for await (const result of concatResult) {
  // これには、4つのファイルすべての内容（すべてのチャンク）が含まれます
  console.log(result);
}
```

##### `readable.drop(limit[, options])` {#readabledroplimit-options}

**追加:** v17.5.0, v16.15.0

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) readable から削除するチャンクの数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) シグナルが中断された場合にストリームを破棄できます。


- 戻り値: [\<Readable\>](/ja/nodejs/api/stream#class-streamreadable) `limit` 個のチャンクが削除されたストリーム。

このメソッドは、最初の `limit` 個のチャンクが削除された新しいストリームを返します。

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).drop(2).toArray(); // [3, 4]
```
##### `readable.take(limit[, options])` {#readabletakelimit-options}

**追加:** v17.5.0, v16.15.0

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) readable から取得するチャンクの数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) シグナルが中断された場合にストリームを破棄できます。


- 戻り値: [\<Readable\>](/ja/nodejs/api/stream#class-streamreadable) `limit` 個のチャンクが取得されたストリーム。

このメソッドは、最初の `limit` 個のチャンクを含む新しいストリームを返します。

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).take(2).toArray(); // [1, 2]
```
##### `readable.reduce(fn[, initial[, options]])` {#readablereducefn-initial-options}

**追加:** v17.5.0, v16.15.0

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) ストリーム内のすべてのチャンクに対して呼び出すリデューサー関数。
    - `previous` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `fn` の最後の呼び出しから取得した値。指定された場合は `initial` 値。それ以外の場合はストリームの最初のチャンク。
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) ストリームからのデータのチャンク。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) ストリームが破棄された場合に中断され、`fn` の呼び出しを早期に中断できます。



- `initial` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) リダクションで使用する初期値。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) シグナルが中断された場合にストリームを破棄できます。


- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) リダクションの最終値の Promise。

このメソッドは、ストリームの各チャンクに対して `fn` を順番に呼び出し、前の要素の計算結果を渡します。 リダクションの最終値の Promise を返します。

`initial` 値が指定されていない場合、ストリームの最初のチャンクが初期値として使用されます。 ストリームが空の場合、Promise は `TypeError` で拒否され、`ERR_INVALID_ARGS` コードプロパティが設定されます。

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .reduce(async (totalSize, file) => {
    const { size } = await stat(join(directoryPath, file));
    return totalSize + size;
  }, 0);

console.log(folderSize);
```
リデューサー関数はストリーム要素を要素ごとに反復処理します。つまり、`concurrency` パラメーターや並列処理はありません。 `reduce` を並行して実行するには、async 関数を [`readable.map`](/ja/nodejs/api/stream#readablemapfn-options) メソッドに抽出できます。

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .map((file) => stat(join(directoryPath, file)), { concurrency: 2 })
  .reduce((totalSize, { size }) => totalSize + size, 0);

console.log(folderSize);
```

### Duplex および変換ストリーム {#duplex-and-transform-streams}

#### クラス: `stream.Duplex` {#class-streamduplex}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v6.8.0 | `Duplex` のインスタンスは、`instanceof stream.Writable` をチェックすると `true` を返すようになりました。 |
| v0.9.4 | 追加: v0.9.4 |
:::

Duplex ストリームは、[`Readable`](/ja/nodejs/api/stream#class-streamreadable) と [`Writable`](/ja/nodejs/api/stream#class-streamwritable) の両方のインターフェースを実装するストリームです。

`Duplex` ストリームの例:

- [TCP ソケット](/ja/nodejs/api/net#class-netsocket)
- [zlib ストリーム](/ja/nodejs/api/zlib)
- [crypto ストリーム](/ja/nodejs/api/crypto)

##### `duplex.allowHalfOpen` {#duplexallowhalfopen}

**追加: v0.9.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`false` の場合、ストリームは読み取り側が終了すると書き込み側を自動的に終了します。最初に `allowHalfOpen` コンストラクターオプションによって設定され、デフォルトは `true` です。

これは、既存の `Duplex` ストリームインスタンスのハーフオープン動作を変更するために手動で変更できますが、`'end'` イベントが発生する前に変更する必要があります。

#### クラス: `stream.Transform` {#class-streamtransform}

**追加: v0.9.4**

変換ストリームは、出力が何らかの形で入力に関連付けられている [`Duplex`](/ja/nodejs/api/stream#class-streamduplex) ストリームです。すべての [`Duplex`](/ja/nodejs/api/stream#class-streamduplex) ストリームと同様に、`Transform` ストリームは、[`Readable`](/ja/nodejs/api/stream#class-streamreadable) と [`Writable`](/ja/nodejs/api/stream#class-streamwritable) の両方のインターフェースを実装します。

`Transform` ストリームの例:

- [zlib ストリーム](/ja/nodejs/api/zlib)
- [crypto ストリーム](/ja/nodejs/api/crypto)

##### `transform.destroy([error])` {#transformdestroyerror}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.0.0 | すでに破棄されているストリームでは、no-op として動作します。 |
| v8.0.0 | 追加: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

ストリームを破棄し、オプションで `'error'` イベントを発行します。この呼び出し後、変換ストリームは内部リソースを解放します。実装者はこのメソッドをオーバーライドするべきではなく、代わりに [`readable._destroy()`](/ja/nodejs/api/stream#readable_destroyerr-callback) を実装するべきです。`Transform` の `_destroy()` のデフォルト実装では、`emitClose` が false に設定されていない限り、`'close'` も発行します。

`destroy()` が呼び出されると、それ以降の呼び出しはすべて no-op になり、`_destroy()` からのエラーを除き、`'error'` としてエラーが発行されることはありません。


#### `stream.duplexPair([options])` {#streamduplexpairoptions}

**Added in: v22.6.0, v20.17.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 両方の[`Duplex`](/ja/nodejs/api/stream#class-streamduplex)コンストラクターに渡す値で、バッファリングなどのオプションを設定します。
- 戻り値: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 2つの[`Duplex`](/ja/nodejs/api/stream#class-streamduplex)インスタンスの配列。

ユーティリティ関数`duplexPair`は、それぞれが相手側に接続された`Duplex`ストリームである2つのアイテムを持つ配列を返します。

```js [ESM]
const [ sideA, sideB ] = duplexPair();
```
一方のストリームに書き込まれたものは、他方で読み取り可能になります。これは、クライアントによって書き込まれたデータがサーバーによって読み取り可能になるネットワーク接続と同様の動作を提供します。

Duplexストリームは対称的です。どちらを使用しても動作に違いはありません。

### `stream.finished(stream[, options], callback)` {#streamfinishedstream-options-callback}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.5.0 | `ReadableStream`と`WritableStream`のサポートを追加。 |
| v15.11.0 | `signal`オプションが追加されました。 |
| v14.0.0 | `finished(stream, cb)`は、コールバックを呼び出す前に`'close'`イベントを待ちます。この実装は、レガシーストリームを検出し、`'close'`を発行することが期待されるストリームにのみこの動作を適用しようとします。 |
| v14.0.0 | `Readable`ストリームで`'end'`の前に`'close'`を発行すると、`ERR_STREAM_PREMATURE_CLOSE`エラーが発生します。 |
| v14.0.0 | コールバックは、`finished(stream, cb)`の呼び出し前に既に終了しているストリームで呼び出されます。 |
| v10.0.0 | Added in: v10.0.0 |
:::

- `stream` [\<Stream\>](/ja/nodejs/api/stream#stream) | [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream) 読み取り可能および/または書き込み可能なストリーム/ウェブストリーム。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`に設定すると、`emit('error', err)`の呼び出しは終了したとは見なされません。 **デフォルト:** `true`。
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`に設定すると、ストリームがまだ読み取り可能であっても、ストリームが終了したときにコールバックが呼び出されます。 **デフォルト:** `true`。
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`に設定すると、ストリームがまだ書き込み可能であっても、ストリームが終了したときにコールバックが呼び出されます。 **デフォルト:** `true`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) ストリームの終了を待機するのを中断できます。シグナルが中断されても、基になるストリームは中断*されません*。コールバックは`AbortError`で呼び出されます。この関数によって追加されたすべての登録済みリスナーも削除されます。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) オプションのエラー引数を受け取るコールバック関数。
- 戻り値: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 登録されているすべてのリスナーを削除するクリーンアップ関数。

ストリームが読み取り可能、書き込み可能、またはエラーや早期終了イベントが発生しなくなったときに通知を受け取るための関数。

```js [ESM]
const { finished } = require('node:stream');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

finished(rs, (err) => {
  if (err) {
    console.error('ストリームが失敗しました。', err);
  } else {
    console.log('ストリームの読み取りが完了しました。');
  }
});

rs.resume(); // ストリームをドレインします。
```
ストリームが早期に破棄される（中止されたHTTPリクエストなど）、`'end'`または`'finish'`を発行しないエラー処理シナリオで特に役立ちます。

`finished` APIは[promise バージョン](/ja/nodejs/api/stream#streamfinishedstream-options)を提供します。

`stream.finished()`は、`callback`が呼び出された後も、宙ぶらりんのイベントリスナー（特に`'error'`、`'end'`、`'finish'`、`'close'`）を残します。これは、予期しない`'error'`イベント（正しくないストリームの実装による）が予期しないクラッシュを引き起こさないようにするためです。これが不要な動作である場合は、返されたクリーンアップ関数をコールバックで呼び出す必要があります。

```js [ESM]
const cleanup = finished(rs, (err) => {
  cleanup();
  // ...
});
```

### ``stream.pipeline(source[, ...transforms], destination, callback)`` {#streampipelinesource-transforms-destination-callback}

### ``stream.pipeline(streams, callback)`` {#streampipelinestreams-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.7.0, v18.16.0 | Webstreamのサポートが追加されました。 |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v14.0.0 | `pipeline(..., cb)` は、コールバックを呼び出す前に `'close'` イベントを待ちます。この実装は、レガシーストリームを検出し、`'close'` を発行することが予想されるストリームにのみこの動作を適用しようとします。 |
| v13.10.0 | 非同期ジェネレーターのサポートを追加しました。 |
| v10.0.0 | バージョン 10.0.0 で追加 |
:::

- `streams` [\<Stream[]\>](/ja/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/ja/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/ja/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/ja/nodejs/api/webstreams#class-transformstream)
- `source` [\<Stream\>](/ja/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)
    - 返り値: [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)


- `...transforms` [\<Stream\>](/ja/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<TransformStream\>](/ja/nodejs/api/webstreams#class-transformstream)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - 返り値: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)


- `destination` [\<Stream\>](/ja/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - 返り値: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) パイプラインが完全に完了したときに呼び出されます。
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `val` `destination` によって返された `Promise` の解決値。


- 返り値: [\<Stream\>](/ja/nodejs/api/stream#stream)

ストリームとジェネレーターの間でパイプ処理を行うためのモジュールメソッド。エラーを転送し、適切にクリーンアップし、パイプラインが完了したときにコールバックを提供します。

```js [ESM]
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');

// pipeline API を使用して、一連のストリームを簡単にパイプ処理し、
// パイプラインが完全に完了したときに通知を受け取ります。

// 効率的に巨大な tar ファイルを gzip 圧縮するパイプライン:

pipeline(
  fs.createReadStream('archive.tar'),
  zlib.createGzip(),
  fs.createWriteStream('archive.tar.gz'),
  (err) => {
    if (err) {
      console.error('パイプラインが失敗しました。', err);
    } else {
      console.log('パイプラインが成功しました。');
    }
  },
);
```
`pipeline` API は、[promise バージョン](/ja/nodejs/api/stream#streampipelinesource-transforms-destination-options)を提供します。

`stream.pipeline()` は、以下のストリームを除くすべてのストリームで `stream.destroy(err)` を呼び出します。

- `'end'` または `'close'` を発行した `Readable` ストリーム。
- `'finish'` または `'close'` を発行した `Writable` ストリーム。

`stream.pipeline()` は、`callback` が呼び出された後も、ストリームにぶら下がっているイベントリスナーを残します。障害後にストリームを再利用する場合、これによりイベントリスナーのリークやエラーの握りつぶしが発生する可能性があります。最後のストリームが読み取り可能な場合、ぶら下がっているイベントリスナーは削除されるため、最後のストリームを後で消費できます。

`stream.pipeline()` は、エラーが発生するとすべてのストリームを閉じます。 `pipeline` を使用した `IncomingRequest` の使用は、予期される応答を送信せずにソケットを破棄するため、予期しない動作につながる可能性があります。以下の例を参照してください。

```js [ESM]
const fs = require('node:fs');
const http = require('node:http');
const { pipeline } = require('node:stream');

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('./fileNotExist.txt');
  pipeline(fileStream, res, (err) => {
    if (err) {
      console.log(err); // No such file
      // `pipeline` がすでにソケットを破棄しているため、このメッセージを送信できません
      return res.end('error!!!');
    }
  });
});
```

### `stream.compose(...streams)` {#streamcomposestreams}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v21.1.0, v20.10.0 | ストリームクラスのサポートが追加されました。 |
| v19.8.0, v18.16.0 | Web ストリームのサポートが追加されました。 |
| v16.9.0 | v16.9.0 で追加されました |
:::

::: warning [安定性: 1 - 試験的]
[安定性: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - `stream.compose` は試験的です。
:::

- `streams` [\<Stream[]\>](/ja/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/ja/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/ja/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/ja/nodejs/api/webstreams#class-transformstream) | [\<Duplex[]\>](/ja/nodejs/api/stream#class-streamduplex) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

2つ以上のストリームを結合して、最初のストリームに書き込み、最後のストリームから読み取る `Duplex` ストリームにします。 指定された各ストリームは、`stream.pipeline` を使用して次のストリームにパイプされます。 ストリームのいずれかでエラーが発生した場合、外部の `Duplex` ストリームを含め、すべて破棄されます。

`stream.compose` は新しいストリームを返し、それは他のストリームにパイプできる (そしてパイプすべき) ため、コンポジションが可能です。 対照的に、ストリームを `stream.pipeline` に渡す場合、通常、最初のストリームは Readable ストリームで、最後は Writable ストリームであり、閉じた回路を形成します。

`Function` が渡された場合、`source` `Iterable` を取るファクトリメソッドである必要があります。

```js [ESM]
import { compose, Transform } from 'node:stream';

const removeSpaces = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, String(chunk).replace(' ', ''));
  },
});

async function* toUpper(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
}

let res = '';
for await (const buf of compose(removeSpaces, toUpper).end('hello world')) {
  res += buf;
}

console.log(res); // prints 'HELLOWORLD'
```
`stream.compose` は、async iterable、ジェネレーター、および関数をストリームに変換するために使用できます。

- `AsyncIterable` は読み取り可能な `Duplex` に変換されます。 `null` を yield することはできません。
- `AsyncGeneratorFunction` は読み取り/書き込み可能な変換 `Duplex` に変換されます。 最初のパラメータとしてソース `AsyncIterable` を取る必要があります。 `null` を yield することはできません。
- `AsyncFunction` は書き込み可能な `Duplex` に変換されます。 `null` または `undefined` のいずれかを返す必要があります。

```js [ESM]
import { compose } from 'node:stream';
import { finished } from 'node:stream/promises';

// Convert AsyncIterable into readable Duplex.
const s1 = compose(async function*() {
  yield 'Hello';
  yield 'World';
}());

// Convert AsyncGenerator into transform Duplex.
const s2 = compose(async function*(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
});

let res = '';

// Convert AsyncFunction into writable Duplex.
const s3 = compose(async function(source) {
  for await (const chunk of source) {
    res += chunk;
  }
});

await finished(compose(s1, s2, s3));

console.log(res); // prints 'HELLOWORLD'
```
演算子としての `stream.compose` については、[`readable.compose(stream)`](/ja/nodejs/api/stream#readablecomposestream-options) を参照してください。


### `stream.Readable.from(iterable[, options])` {#streamreadablefromiterable-options}

**Added in: v12.3.0, v10.17.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) `Symbol.asyncIterator` または `Symbol.iterator` のイテラブルプロトコルを実装しているオブジェクト。null 値が渡された場合、'error' イベントを発行します。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `new stream.Readable([options])` に提供されるオプション。デフォルトでは、`Readable.from()` は `options.objectMode` を `true` に設定します。ただし、`options.objectMode` を `false` に設定して明示的にオプトアウトしない限り。
- 戻り値: [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable)

イテレーターから Readable ストリームを作成するためのユーティリティメソッドです。

```js [ESM]
const { Readable } = require('node:stream');

async function * generate() {
  yield 'hello';
  yield 'streams';
}

const readable = Readable.from(generate());

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
`Readable.from(string)` または `Readable.from(buffer)` を呼び出しても、パフォーマンス上の理由から、文字列またはバッファーは他のストリームのセマンティクスに合わせて反復処理されません。

Promise を含む `Iterable` オブジェクトが引数として渡されると、未処理の拒否が発生する可能性があります。

```js [ESM]
const { Readable } = require('node:stream');

Readable.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // 未処理の拒否
]);
```
### `stream.Readable.fromWeb(readableStream[, options])` {#streamreadablefromwebreadablestream-options}

**Added in: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `readableStream` [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)
  
 
- 戻り値: [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable)


### `stream.Readable.isDisturbed(stream)` {#streamreadableisdisturbedstream}

**Added in: v16.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `stream` [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable) | [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)
- 戻り値: `boolean`

ストリームから読み込まれたか、キャンセルされたかどうかを返します。

### `stream.isErrored(stream)` {#streamiserroredstream}

**Added in: v17.3.0, v16.14.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `stream` [\<Readable\>](/ja/nodejs/api/stream#class-streamreadable) | [\<Writable\>](/ja/nodejs/api/stream#class-streamwritable) | [\<Duplex\>](/ja/nodejs/api/stream#class-streamduplex) | [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream) | [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ストリームがエラーに遭遇したかどうかを返します。

### `stream.isReadable(stream)` {#streamisreadablestream}

**Added in: v17.4.0, v16.14.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `stream` [\<Readable\>](/ja/nodejs/api/stream#class-streamreadable) | [\<Duplex\>](/ja/nodejs/api/stream#class-streamduplex) | [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ストリームが読み取り可能かどうかを返します。

### `stream.Readable.toWeb(streamReadable[, options])` {#streamreadabletowebstreamreadable-options}

**Added in: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `streamReadable` [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 指定された`stream.Readable`から読み込む際にバックプレッシャーが適用される前に、(作成された`ReadableStream`の)最大内部キューサイズ。値が指定されていない場合、指定された`stream.Readable`から取得されます。
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 与えられたデータのチャンクのサイズを計算する関数。値が指定されていない場合、サイズはすべてのチャンクに対して`1`になります。
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)





- 戻り値: [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)


### `stream.Writable.fromWeb(writableStream[, options])` {#streamwritablefromwebwritablestream-options}

**Added in: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `writableStream` [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)


- 戻り値: [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable)

### `stream.Writable.toWeb(streamWritable)` {#streamwritabletowebstreamwritable}

**Added in: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `streamWritable` [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable)
- 戻り値: [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)

### `stream.Duplex.from(src)` {#streamduplexfromsrc}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.5.0, v18.17.0 | `src` 引数は `ReadableStream` または `WritableStream` になれるようになりました。 |
| v16.8.0 | Added in: v16.8.0 |
:::

- `src` [\<Stream\>](/ja/nodejs/api/stream#stream) | [\<Blob\>](/ja/nodejs/api/buffer#class-blob) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)

双方向ストリームを作成するためのユーティリティメソッド。

- `Stream` は書き込み可能なストリームを書き込み可能な `Duplex` に、読み取り可能なストリームを `Duplex` に変換します。
- `Blob` は読み取り可能な `Duplex` に変換します。
- `string` は読み取り可能な `Duplex` に変換します。
- `ArrayBuffer` は読み取り可能な `Duplex` に変換します。
- `AsyncIterable` は読み取り可能な `Duplex` に変換します。 `null` を yield することはできません。
- `AsyncGeneratorFunction` は読み取り/書き込み可能な変換 `Duplex` に変換します。 最初のパラメータとしてソース `AsyncIterable` を取る必要があります。 `null` を yield することはできません。
- `AsyncFunction` は書き込み可能な `Duplex` に変換します。 `null` または `undefined` のいずれかを返す必要があります。
- `Object ({ writable, readable })` は `readable` と `writable` を `Stream` に変換し、それらを `Duplex` に結合します。ここで、 `Duplex` は `writable` に書き込み、 `readable` から読み取ります。
- `Promise` は読み取り可能な `Duplex` に変換します。 値 `null` は無視されます。
- `ReadableStream` は読み取り可能な `Duplex` に変換します。
- `WritableStream` は書き込み可能な `Duplex` に変換します。
- 戻り値: [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)

Promise を含む `Iterable` オブジェクトが引数として渡されると、未処理の拒否が発生する可能性があります。

```js [ESM]
const { Duplex } = require('node:stream');

Duplex.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // 未処理の拒否
]);
```

### `stream.Duplex.fromWeb(pair[, options])` {#streamduplexfromwebpair-options}

**Added in: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `pair` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)
  
 
- Returns: [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)



::: code-group
```js [ESM]
import { Duplex } from 'node:stream';
import {
  ReadableStream,
  WritableStream,
} from 'node:stream/web';

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');

for await (const chunk of duplex) {
  console.log('readable', chunk);
}
```

```js [CJS]
const { Duplex } = require('node:stream');
const {
  ReadableStream,
  WritableStream,
} = require('node:stream/web');

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');
duplex.once('readable', () => console.log('readable', duplex.read()));
```
:::


### `stream.Duplex.toWeb(streamDuplex)` {#streamduplextowebstreamduplex}

**Added in: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `streamDuplex` [\<stream.Duplex\>](/ja/nodejs/api/stream#class-streamduplex)
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `readable` [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream)
  
 



::: code-group
```js [ESM]
import { Duplex } from 'node:stream';

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

const { value } = await readable.getReader().read();
console.log('readable', value);
```

```js [CJS]
const { Duplex } = require('node:stream');

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

readable.getReader().read().then((result) => {
  console.log('readable', result.value);
});
```
:::

### `stream.addAbortSignal(signal, stream)` {#streamaddabortsignalsignal-stream}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.7.0, v18.16.0 | Added support for `ReadableStream` and `WritableStream`. |
| v15.4.0 | Added in: v15.4.0 |
:::

- `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 取り消しを表す可能性のあるシグナル
- `stream` [\<Stream\>](/ja/nodejs/api/stream#stream) | [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ja/nodejs/api/webstreams#class-writablestream) シグナルをアタッチするストリーム。

AbortSignalをreadableまたはwriteableストリームにアタッチします。 これにより、コードは`AbortController`を使用してストリームの破棄を制御できます。

渡された`AbortSignal`に対応する`AbortController`で`abort`を呼び出すと、ストリームで`.destroy(new AbortError())`を呼び出すのと同じように動作し、webstreamの場合は`controller.error(new AbortError())`を呼び出すのと同じように動作します。

```js [ESM]
const fs = require('node:fs');

const controller = new AbortController();
const read = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
// Later, abort the operation closing the stream
controller.abort();
```
または、非同期イテラブルとしてreadableストリームで`AbortSignal`を使用します。

```js [ESM]
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000); // set a timeout
const stream = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
(async () => {
  try {
    for await (const chunk of stream) {
      await process(chunk);
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      // The operation was cancelled
    } else {
      throw e;
    }
  }
})();
```
または、ReadableStreamで`AbortSignal`を使用します。

```js [ESM]
const controller = new AbortController();
const rs = new ReadableStream({
  start(controller) {
    controller.enqueue('hello');
    controller.enqueue('world');
    controller.close();
  },
});

addAbortSignal(controller.signal, rs);

finished(rs, (err) => {
  if (err) {
    if (err.name === 'AbortError') {
      // The operation was cancelled
    }
  }
});

const reader = rs.getReader();

reader.read().then(({ value, done }) => {
  console.log(value); // hello
  console.log(done); // false
  controller.abort();
});
```

### `stream.getDefaultHighWaterMark(objectMode)` {#streamgetdefaulthighwatermarkobjectmode}

**Added in: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ストリームで使用されるデフォルトの highWaterMark を返します。 デフォルトは `65536` (64 KiB)、または `objectMode` の場合は `16` です。

### `stream.setDefaultHighWaterMark(objectMode, value)` {#streamsetdefaulthighwatermarkobjectmode-value}

**Added in: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) highWaterMark 値

ストリームで使用されるデフォルトの highWaterMark を設定します。

## ストリーム実装者のための API {#api-for-stream-implementers}

`node:stream` モジュール API は、JavaScript のプロトタイプ継承モデルを使用してストリームを簡単に実装できるように設計されています。

まず、ストリーム開発者は、4 つの基本的なストリーム クラス (`stream.Writable`、`stream.Readable`、`stream.Duplex`、または `stream.Transform`) のいずれかを拡張する新しい JavaScript クラスを宣言し、適切な親クラス コンストラクターを呼び出すようにします。

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor({ highWaterMark, ...options }) {
    super({ highWaterMark });
    // ...
  }
}
```

ストリームを拡張するときは、ユーザーがどのオプションを提供できるか、また提供すべきかを念頭に置いてから、これらのオプションを基本コンストラクターに転送してください。 たとえば、実装が `autoDestroy` および `emitClose` オプションに関して想定している場合は、ユーザーがこれらのオプションを上書きできないようにしてください。 すべてのオプションを暗黙的に転送するのではなく、どのオプションが転送されるかを明示的にしてください。

次に、新しいストリーム クラスは、作成されるストリームのタイプに応じて、以下の表に示すように、1 つまたは複数の特定のメソッドを実装する必要があります。

| ユースケース | クラス | 実装するメソッド |
|---|---|---|
| 読み取り専用 | [`Readable`](/ja/nodejs/api/stream#class-streamreadable) | [`_read()`](/ja/nodejs/api/stream#readable_readsize) |
| 書き込み専用 | [`Writable`](/ja/nodejs/api/stream#class-streamwritable) | [`_write()`](/ja/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/ja/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/ja/nodejs/api/stream#writable_finalcallback) |
| 読み取りと書き込み | [`Duplex`](/ja/nodejs/api/stream#class-streamduplex) | [`_read()`](/ja/nodejs/api/stream#readable_readsize)  ,   [`_write()`](/ja/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/ja/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/ja/nodejs/api/stream#writable_finalcallback) |
| 書き込まれたデータを操作し、結果を読み取る | [`Transform`](/ja/nodejs/api/stream#class-streamtransform) | [`_transform()`](/ja/nodejs/api/stream#transform_transformchunk-encoding-callback)  ,   [`_flush()`](/ja/nodejs/api/stream#transform_flushcallback)  ,   [`_final()`](/ja/nodejs/api/stream#writable_finalcallback) |

ストリームの実装コードは、([ストリーム消費者のための API](/ja/nodejs/api/stream#api-for-stream-consumers) セクションで説明されている) コンシューマーが使用することを目的としたストリームの「パブリック」メソッドを *決して* 呼び出すべきではありません。 そうすると、ストリームを消費するアプリケーション コードに悪影響が生じる可能性があります。

`write()`、`end()`、`cork()`、`uncork()`、`read()` などのパブリック メソッドをオーバーライドしたり、`.emit()` を介して `'error'`、`'data'`、`'end'`、`'finish'`、`'close'` などの内部イベントを発行したりすることは避けてください。 そうすると、現在および将来のストリーム不変条件が壊れ、他のストリーム、ストリーム ユーティリティ、およびユーザーの期待との動作や互換性の問題が発生する可能性があります。


### 簡略化された構築 {#simplified-construction}

**追加:** v1.2.0

多くの場合、継承に頼らずにストリームを作成できます。これは、`stream.Writable`、`stream.Readable`、`stream.Duplex`、または`stream.Transform`オブジェクトのインスタンスを直接作成し、適切なメソッドをコンストラクターオプションとして渡すことで実現できます。

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  construct(callback) {
    // 状態を初期化し、リソースをロードします...
  },
  write(chunk, encoding, callback) {
    // ...
  },
  destroy() {
    // リソースを解放します...
  },
});
```
### 書き込み可能なストリームの実装 {#implementing-a-writable-stream}

`stream.Writable`クラスは、[`Writable`](/ja/nodejs/api/stream#class-streamwritable)ストリームを実装するために拡張されます。

カスタム`Writable`ストリームは、*必ず*`new stream.Writable([options])`コンストラクターを呼び出し、`writable._write()`および/または`writable._writev()`メソッドを実装する必要があります。

#### `new stream.Writable([options])` {#new-streamwritableoptions}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.0.0 | デフォルトの highWaterMark を引き上げました。 |
| v15.5.0 | AbortSignal の受け渡しをサポートしました。 |
| v14.0.0 | `autoDestroy` オプションのデフォルトを `true` に変更しました。 |
| v11.2.0, v10.16.0 | `'finish'` またはエラーが発生した場合にストリームを自動的に `destroy()` する `autoDestroy` オプションを追加しました。 |
| v10.0.0 | 破棄時に `'close'` を発生させるかどうかを指定する `emitClose` オプションを追加しました。 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`stream.write()`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback)が`false`を返すようになるバッファーレベル。**デフォルト:** `65536`(64 KiB)、または`objectMode`ストリームの場合は`16`。
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) [`stream.write()`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback)に渡された`string`を、[`stream._write()`](/ja/nodejs/api/stream#writable_writechunk-encoding-callback)に渡す前に、( [`stream.write()`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback)呼び出しで指定されたエンコーディングを使用して) `Buffer`にエンコードするかどうか。他の種類のデータは変換されません(つまり、`Buffer`は`string`にデコードされません)。falseに設定すると、`string`の変換が防止されます。**デフォルト:** `true`。
    - `defaultEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) エンコーディングが[`stream.write()`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback)への引数として指定されていない場合に使用されるデフォルトのエンコーディング。**デフォルト:** `'utf8'`。
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) [`stream.write(anyObj)`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback)が有効な操作であるかどうか。設定すると、ストリーム実装でサポートされている場合、文字列、[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)または[\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)以外のJavaScript値を書き込むことができるようになります。**デフォルト:** `false`。
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ストリームが破棄された後に`'close'`を発行するかどうか。**デフォルト:** `true`。
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._write()`](/ja/nodejs/api/stream#writable_writechunk-encoding-callback)メソッドの実装。
    - `writev` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._writev()`](/ja/nodejs/api/stream#writable_writevchunks-callback)メソッドの実装。
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._destroy()`](/ja/nodejs/api/stream#writable_destroyerr-callback)メソッドの実装。
    - `final` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._final()`](/ja/nodejs/api/stream#writable_finalcallback)メソッドの実装。
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._construct()`](/ja/nodejs/api/stream#writable_constructcallback)メソッドの実装。
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) このストリームが終了後に自動的に `.destroy()` を呼び出すかどうか。**デフォルト:** `true`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) キャンセルされる可能性を表すシグナル。

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor(options) {
    // stream.Writable() コンストラクターを呼び出します。
    super(options);
    // ...
  }
}
```
または、ES6以前のスタイルのコンストラクターを使用する場合:

```js [ESM]
const { Writable } = require('node:stream');
const util = require('node:util');

function MyWritable(options) {
  if (!(this instanceof MyWritable))
    return new MyWritable(options);
  Writable.call(this, options);
}
util.inherits(MyWritable, Writable);
```
または、簡略化されたコンストラクターアプローチを使用する場合:

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
});
```
渡された `AbortSignal` に対応する `AbortController` で `abort` を呼び出すと、書き込み可能なストリームで `.destroy(new AbortError())` を呼び出すのと同じように動作します。

```js [ESM]
const { Writable } = require('node:stream');

const controller = new AbortController();
const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
  signal: controller.signal,
});
// 後で、操作を中止してストリームを閉じます
controller.abort();
```

#### `writable._construct(callback)` {#writable_constructcallback}

**Added in: v15.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) ストリームの初期化が完了したときに、この関数を（必要に応じてエラー引数を付けて）呼び出します。

`_construct()` メソッドは直接呼び出してはいけません。子クラスによって実装される可能性があり、実装された場合、内部の `Writable` クラスメソッドのみによって呼び出されます。

このオプションの関数は、ストリームのコンストラクターが返された後のティックで呼び出され、`_write()`、`_final()`、および `_destroy()` の呼び出しを `callback` が呼び出されるまで遅延させます。これは、ストリームを使用する前に、状態を初期化したり、リソースを非同期的に初期化したりするのに役立ちます。

```js [ESM]
const { Writable } = require('node:stream');
const fs = require('node:fs');

class WriteStream extends Writable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, 'w', (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _write(chunk, encoding, callback) {
    fs.write(this.fd, chunk, callback);
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `writable._write(chunk, encoding, callback)` {#writable_writechunk-encoding-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.11.0 | _writev() を提供する場合、_write() はオプションです。 |
:::

- `chunk` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 書き込まれる `Buffer` であり、[`stream.write()`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback) に渡された `string` から変換されます。ストリームの `decodeStrings` オプションが `false` であるか、ストリームがオブジェクトモードで動作している場合、チャンクは変換されず、[`stream.write()`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback) に渡されたものがそのまま使用されます。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) チャンクが文字列の場合、`encoding` はその文字列の文字エンコーディングです。チャンクが `Buffer` である場合、またはストリームがオブジェクトモードで動作している場合、`encoding` は無視されることがあります。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 提供されたチャンクの処理が完了したら、この関数を（必要に応じてエラー引数を付けて）呼び出します。

すべての `Writable` ストリーム実装は、基になるリソースにデータを送信するために、[`writable._write()`](/ja/nodejs/api/stream#writable_writechunk-encoding-callback) および/または [`writable._writev()`](/ja/nodejs/api/stream#writable_writevchunks-callback) メソッドを提供する必要があります。

[`Transform`](/ja/nodejs/api/stream#class-streamtransform) ストリームは、[`writable._write()`](/ja/nodejs/api/stream#writable_writechunk-encoding-callback) の独自の実装を提供します。

この関数は、アプリケーションコードから直接呼び出してはいけません。子クラスによって実装され、内部の `Writable` クラスメソッドのみによって呼び出される必要があります。

`callback` 関数は、書き込みが正常に完了したか、エラーで失敗したかを通知するために、`writable._write()` 内で同期的に、または非同期的に（つまり、異なるティックで）呼び出す必要があります。`callback` に渡される最初の引数は、呼び出しが失敗した場合は `Error` オブジェクト、書き込みが成功した場合は `null` である必要があります。

`writable._write()` が呼び出されてから `callback` が呼び出されるまでの間に発生する `writable.write()` へのすべての呼び出しにより、書き込まれたデータがバッファリングされます。`callback` が呼び出されると、ストリームは [`'drain'`](/ja/nodejs/api/stream#event-drain) イベントを発行する可能性があります。ストリーム実装が複数のデータのチャンクを一度に処理できる場合、`writable._writev()` メソッドを実装する必要があります。

コンストラクターオプションで `decodeStrings` プロパティが明示的に `false` に設定されている場合、`chunk` は `.write()` に渡されるオブジェクトと同じオブジェクトのままであり、`Buffer` ではなく文字列である可能性があります。これは、特定の文字列データエンコーディングに対して最適化された処理を行う実装をサポートするためです。その場合、`encoding` 引数は文字列の文字エンコーディングを示します。それ以外の場合、`encoding` 引数は安全に無視できます。

`writable._write()` メソッドにはアンダースコアがプレフィックスとして付いています。これは、それが定義されているクラスの内部であり、ユーザープログラムから直接呼び出されるべきではないためです。


#### `writable._writev(chunks, callback)` {#writable_writevchunks-callback}

- `chunks` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 書き込まれるデータ。 この値は、書き込むデータの個別のチャンクをそれぞれ表す[\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)の配列です。 これらのオブジェクトのプロパティは次のとおりです。
    - `chunk` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 書き込むデータを含むバッファーインスタンスまたは文字列。 `Writable` が `decodeStrings` オプションを `false` に設定して作成され、文字列が `write()` に渡された場合、`chunk` は文字列になります。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `chunk` の文字エンコーディング。 `chunk` が `Buffer` の場合、`encoding` は `'buffer'` になります。


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 指定されたチャンクの処理が完了したときに呼び出されるコールバック関数（オプションでエラー引数付き）。

この関数は、アプリケーションコードから直接呼び出すべきではありません。 子クラスによって実装され、内部の `Writable` クラスメソッドのみによって呼び出される必要があります。

`writable._writev()` メソッドは、一度に複数のデータチャンクを処理できるストリーム実装で、`writable._write()` に加えて、または代替として実装できます。 実装されていて、前の書き込みからのバッファリングされたデータがある場合、`_write()` の代わりに `_writev()` が呼び出されます。

`writable._writev()` メソッドにはアンダースコアが付いています。これは、それがそれを定義するクラスの内部のものであり、ユーザープログラムによって直接呼び出されるべきではないためです。

#### `writable._destroy(err, callback)` {#writable_destroyerr-callback}

**Added in: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 起こりうるエラー。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) オプションのエラー引数を取るコールバック関数。

`_destroy()` メソッドは、[`writable.destroy()`](/ja/nodejs/api/stream#writabledestroyerror) によって呼び出されます。 子クラスによってオーバーライドできますが、**直接呼び出すべきではありません**。


#### `writable._final(callback)` {#writable_finalcallback}

**Added in: v8.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 残りのデータの書き込みが完了したら、この関数を（オプションでエラー引数とともに）呼び出します。

`_final()` メソッドを直接呼び出しては**なりません**。これは子クラスによって実装される可能性があり、実装された場合、内部の `Writable` クラスメソッドのみによって呼び出されます。

このオプションの関数は、ストリームが閉じる前に呼び出され、`'finish'` イベントが `callback` が呼び出されるまで遅延されます。これは、ストリームが終了する前にリソースを閉じたり、バッファリングされたデータを書き込んだりするのに役立ちます。

#### 書き込み中のエラー {#errors-while-writing}

[`writable._write()`](/ja/nodejs/api/stream#writable_writechunk-encoding-callback)、[`writable._writev()`](/ja/nodejs/api/stream#writable_writevchunks-callback)、および [`writable._final()`](/ja/nodejs/api/stream#writable_finalcallback) メソッドの処理中に発生したエラーは、コールバックを呼び出し、エラーを最初の引数として渡すことによって伝播する必要があります。これらのメソッド内から `Error` をスローしたり、手動で `'error'` イベントを発生させたりすると、未定義の動作になります。

`Writable` がエラーを発生させたときに `Readable` ストリームが `Writable` ストリームにパイプされている場合、`Readable` ストリームはアンパイプされます。

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  },
});
```
#### 書き込み可能ストリームの例 {#an-example-writable-stream}

以下は、かなり単純化された（そしてやや無意味な）カスタム `Writable` ストリームの実装を示しています。この特定の `Writable` ストリームインスタンスは実際には特に有用ではありませんが、この例はカスタム [`Writable`](/ja/nodejs/api/stream#class-streamwritable) ストリームインスタンスに必要な各要素を示しています。

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  }
}
```

#### 書き込み可能なストリームでのバッファのデコード {#decoding-buffers-in-a-writable-stream}

バッファのデコードは一般的なタスクです。たとえば、入力が文字列であるトランスフォーマーを使用する場合などです。これは、UTF-8などのマルチバイト文字エンコーディングを使用する場合、簡単なプロセスではありません。次の例は、`StringDecoder`と[`Writable`](/ja/nodejs/api/stream#class-streamwritable)を使用してマルチバイト文字列をデコードする方法を示しています。

```js [ESM]
const { Writable } = require('node:stream');
const { StringDecoder } = require('node:string_decoder');

class StringWritable extends Writable {
  constructor(options) {
    super(options);
    this._decoder = new StringDecoder(options?.defaultEncoding);
    this.data = '';
  }
  _write(chunk, encoding, callback) {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }
    this.data += chunk;
    callback();
  }
  _final(callback) {
    this.data += this._decoder.end();
    callback();
  }
}

const euro = [[0xE2, 0x82], [0xAC]].map(Buffer.from);
const w = new StringWritable();

w.write('currency: ');
w.write(euro[0]);
w.end(euro[1]);

console.log(w.data); // currency: €
```
### Readableストリームの実装 {#implementing-a-readable-stream}

`stream.Readable`クラスは、[`Readable`](/ja/nodejs/api/stream#class-streamreadable)ストリームを実装するために拡張されます。

カスタム`Readable`ストリームは、*必ず* `new stream.Readable([options])`コンストラクターを呼び出し、[`readable._read()`](/ja/nodejs/api/stream#readable_readsize)メソッドを実装する必要があります。

#### `new stream.Readable([options])` {#new-streamreadableoptions}

::: info 【履歴】
| バージョン | 変更点 |
| --- | --- |
| v22.0.0 | デフォルトの highWaterMark を引き上げます。 |
| v15.5.0 | AbortSignal の受け渡しをサポートします。 |
| v14.0.0 | `autoDestroy`オプションのデフォルトを`true`に変更します。 |
| v11.2.0, v10.16.0 | `'end'`を発行またはエラーが発生した場合に、ストリームを自動的に`destroy()`する`autoDestroy`オプションを追加します。 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 基になるリソースからの読み取りを停止する前に、内部バッファーに格納する最大[バイト数](/ja/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding)。 **デフォルト:** `65536` (64 KiB)、または`objectMode`ストリームの場合は`16`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定された場合、バッファーは指定されたエンコーディングを使用して文字列にデコードされます。 **デフォルト:** `null`。
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) このストリームがオブジェクトのストリームとして動作するかどうか。 つまり、[`stream.read(n)`](/ja/nodejs/api/stream#readablereadsize)は、サイズ`n`の`Buffer`の代わりに単一の値を返します。 **デフォルト:** `false`。
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ストリームが破棄された後に`'close'`を発行するかどうか。 **デフォルト:** `true`。
    - `read` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._read()`](/ja/nodejs/api/stream#readable_readsize)メソッドの実装。
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._destroy()`](/ja/nodejs/api/stream#readable_destroyerr-callback)メソッドの実装。
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._construct()`](/ja/nodejs/api/stream#readable_constructcallback)メソッドの実装。
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) このストリームが終了後に自動的に`.destroy()`を呼び出すかどうか。 **デフォルト:** `true`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) キャンセルされる可能性を表すシグナル。

```js [ESM]
const { Readable } = require('node:stream');

class MyReadable extends Readable {
  constructor(options) {
    // stream.Readable(options)コンストラクターを呼び出します。
    super(options);
    // ...
  }
}
```
または、pre-ES6スタイルのコンストラクターを使用する場合:

```js [ESM]
const { Readable } = require('node:stream');
const util = require('node:util');

function MyReadable(options) {
  if (!(this instanceof MyReadable))
    return new MyReadable(options);
  Readable.call(this, options);
}
util.inherits(MyReadable, Readable);
```
または、簡略化されたコンストラクターアプローチを使用する場合:

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    // ...
  },
});
```
渡された`AbortSignal`に対応する`AbortController`で`abort`を呼び出すと、作成されたreadableで`.destroy(new AbortError())`を呼び出すのと同じように動作します。

```js [ESM]
const { Readable } = require('node:stream');
const controller = new AbortController();
const read = new Readable({
  read(size) {
    // ...
  },
  signal: controller.signal,
});
// 後で、ストリームを閉じる操作を中止します
controller.abort();
```

#### `readable._construct(callback)` {#readable_constructcallback}

**Added in: v15.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) ストリームの初期化が完了したときに、この関数を(オプションでエラー引数とともに)呼び出します。

`_construct()`メソッドを直接呼び出してはいけません。これは子クラスによって実装される可能性があり、その場合、内部の`Readable`クラスメソッドのみによって呼び出されます。

このオプションの関数は、ストリームコンストラクターによって次のチックでスケジュールされ、`callback`が呼び出されるまで`_read()`および`_destroy()`の呼び出しを遅らせます。これは、ストリームを使用する前に、状態を初期化したり、リソースを非同期的に初期化したりするのに役立ちます。

```js [ESM]
const { Readable } = require('node:stream');
const fs = require('node:fs');

class ReadStream extends Readable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _read(n) {
    const buf = Buffer.alloc(n);
    fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `readable._read(size)` {#readable_readsize}

**Added in: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 非同期的に読み取るバイト数

この関数は、アプリケーションコードから直接呼び出してはいけません。子クラスによって実装される必要があり、内部の`Readable`クラスメソッドのみによって呼び出されます。

すべての`Readable`ストリーム実装は、基になるリソースからデータをフェッチするために、[`readable._read()`](/ja/nodejs/api/stream#readable_readsize)メソッドの実装を提供する必要があります。

[`readable._read()`](/ja/nodejs/api/stream#readable_readsize)が呼び出されたとき、リソースからデータが利用可能な場合、実装は[`this.push(dataChunk)`](/ja/nodejs/api/stream#readablepushchunk-encoding)メソッドを使用して、そのデータを読み取りキューにプッシュし始める必要があります。ストリームがより多くのデータを受け入れる準備ができると、[`this.push(dataChunk)`](/ja/nodejs/api/stream#readablepushchunk-encoding)の各呼び出しの後に、`_read()`が再度呼び出されます。`readable.push()`が`false`を返すまで、`_read()`はリソースからの読み取りとデータのプッシュを継続できます。停止した後、`_read()`が再度呼び出された場合にのみ、追加のデータをキューにプッシュすることを再開する必要があります。

[`readable._read()`](/ja/nodejs/api/stream#readable_readsize)メソッドが呼び出されると、[`readable.push()`](/ja/nodejs/api/stream#readablepushchunk-encoding)メソッドを通じてより多くのデータがプッシュされるまで、再度呼び出されることはありません。空のバッファーや文字列などの空のデータは、[`readable._read()`](/ja/nodejs/api/stream#readable_readsize)を呼び出させません。

`size`引数はアドバイスです。「読み取り」がデータを返す単一の操作である実装では、`size`引数を使用して、フェッチするデータの量を決定できます。他の実装では、この引数を無視し、利用可能になったらすぐにデータを提供できます。[`stream.push(chunk)`](/ja/nodejs/api/stream#readablepushchunk-encoding)を呼び出す前に、`size`バイトが利用可能になるまで「待つ」必要はありません。

[`readable._read()`](/ja/nodejs/api/stream#readable_readsize)メソッドにはアンダースコアが付いています。これは、クラスの内部であり、ユーザープログラムから直接呼び出すことは決してありません。


#### `readable._destroy(err, callback)` {#readable_destroyerr-callback}

**Added in: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 起こりうるエラー。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) オプションのエラー引数を取るコールバック関数。

`_destroy()` メソッドは、[`readable.destroy()`](/ja/nodejs/api/stream#readabledestroyerror) によって呼び出されます。子クラスでオーバーライドできますが、直接呼び出すことは**できません**。

#### `readable.push(chunk[, encoding])` {#readablepushchunk-encoding}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.0.0, v20.13.0 | `chunk` 引数は `TypedArray` または `DataView` インスタンスにできます。 |
| v8.0.0 | `chunk` 引数は `Uint8Array` インスタンスにできます。 |
:::

- `chunk` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 読み込みキューにプッシュするデータのチャンク。オブジェクトモードで動作していないストリームの場合、`chunk` は [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)、[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) または [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) である必要があります。オブジェクトモードのストリームの場合、`chunk` は任意の JavaScript 値にすることができます。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 文字列チャンクのエンコーディング。`'utf8'` や `'ascii'` などの有効な `Buffer` エンコーディングである必要があります。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 追加のデータチャンクをプッシュし続けることができる場合は `true`、それ以外の場合は `false`。

`chunk` が [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) または [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) の場合、データの `chunk` はストリームのユーザーが消費するための内部キューに追加されます。`chunk` を `null` として渡すと、ストリームの終了 (EOF) が通知され、それ以降はデータを書き込むことができません。

`Readable` が一時停止モードで動作している場合、`readable.push()` で追加されたデータは、[`'readable'`](/ja/nodejs/api/stream#event-readable) イベントが発生したときに [`readable.read()`](/ja/nodejs/api/stream#readablereadsize) メソッドを呼び出すことで読み出すことができます。

`Readable` がフローモードで動作している場合、`readable.push()` で追加されたデータは、`'data'` イベントを発生させることによって配信されます。

`readable.push()` メソッドは、可能な限り柔軟になるように設計されています。たとえば、何らかの一時停止/再開メカニズムとデータコールバックを提供する下位レベルのソースをラップする場合、低レベルのソースはカスタム `Readable` インスタンスによってラップできます。

```js [ESM]
// `_source` は、readStop() および readStart() メソッドを持つオブジェクトであり、
// データがあるときに呼び出される `ondata` メンバーと、
// データが終了したときに呼び出される `onend` メンバーを持ちます。

class SourceWrapper extends Readable {
  constructor(options) {
    super(options);

    this._source = getLowLevelSourceObject();

    // データがあるたびに、内部バッファーにプッシュします。
    this._source.ondata = (chunk) => {
      // push() が false を返す場合、ソースからの読み取りを停止します。
      if (!this.push(chunk))
        this._source.readStop();
    };

    // ソースが終了したら、EOF を示す `null` チャンクをプッシュします。
    this._source.onend = () => {
      this.push(null);
    };
  }
  // ストリームがより多くのデータをプルしたい場合、_read() が呼び出されます。
  // この場合、アドバイザリの size 引数は無視されます。
  _read(size) {
    this._source.readStart();
  }
}
```
`readable.push()` メソッドは、コンテンツを内部バッファーにプッシュするために使用されます。これは、[`readable._read()`](/ja/nodejs/api/stream#readable_readsize) メソッドによって駆動できます。

オブジェクトモードで動作していないストリームの場合、`readable.push()` の `chunk` パラメーターが `undefined` の場合、空の文字列またはバッファーとして扱われます。詳細については、[`readable.push('')`](/ja/nodejs/api/stream#readablepush) を参照してください。


#### 読み取り中のエラー {#errors-while-reading}

[`readable._read()`](/ja/nodejs/api/stream#readable_readsize) の処理中に発生したエラーは、[`readable.destroy(err)`](/ja/nodejs/api/stream#readable_destroyerr-callback) メソッドを通じて伝播させる必要があります。[`readable._read()`](/ja/nodejs/api/stream#readable_readsize) 内から `Error` をスローしたり、手動で `'error'` イベントを発行したりすると、未定義の動作になります。

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    const err = checkSomeErrorCondition();
    if (err) {
      this.destroy(err);
    } else {
      // Do some work.
    }
  },
});
```
#### ストリームのカウント例 {#an-example-counting-stream}

以下は、1 から 1,000,000 までの数値を昇順で発行し、終了する `Readable` ストリームの基本的な例です。

```js [ESM]
const { Readable } = require('node:stream');

class Counter extends Readable {
  constructor(opt) {
    super(opt);
    this._max = 1000000;
    this._index = 1;
  }

  _read() {
    const i = this._index++;
    if (i > this._max)
      this.push(null);
    else {
      const str = String(i);
      const buf = Buffer.from(str, 'ascii');
      this.push(buf);
    }
  }
}
```
### Duplex ストリームの実装 {#implementing-a-duplex-stream}

[`Duplex`](/ja/nodejs/api/stream#class-streamduplex) ストリームは、TCP ソケット接続など、[`Readable`](/ja/nodejs/api/stream#class-streamreadable) と [`Writable`](/ja/nodejs/api/stream#class-streamwritable) の両方を実装するものです。

JavaScript は多重継承をサポートしていないため、`stream.Duplex` クラスは [`Duplex`](/ja/nodejs/api/stream#class-streamduplex) ストリームを実装するために拡張されています ( `stream.Readable` *および* `stream.Writable` クラスを拡張するのではなく)。

`stream.Duplex` クラスは、プロトタイプ的に `stream.Readable` から、寄生的に `stream.Writable` から継承しますが、`instanceof` は `stream.Writable` の [`Symbol.hasInstance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance) をオーバーライドすることにより、両方の基本クラスで適切に機能します。

カスタム `Duplex` ストリームは、`new stream.Duplex([options])` コンストラクターを呼び出し、[`readable._read()`](/ja/nodejs/api/stream#readable_readsize) および `writable._write()` メソッド *両方* を実装する *必要があります*。


#### `new stream.Duplex(options)` {#new-streamduplexoptions}

::: info [履歴]
| バージョン | 変更 |
|---|---|
| v8.4.0 | `readableHighWaterMark` と `writableHighWaterMark` オプションがサポートされるようになりました。 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `Writable` と `Readable` の両方のコンストラクターに渡されます。以下のフィールドも持ちます:
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` に設定すると、readable 側が終了したときに、ストリームは自動的に writable 側を終了します。**デフォルト:** `true`。
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `Duplex` を readable にするかどうかを設定します。**デフォルト:** `true`。
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `Duplex` を writable にするかどうかを設定します。**デフォルト:** `true`。
    - `readableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ストリームの readable 側の `objectMode` を設定します。`objectMode` が `true` の場合は効果がありません。**デフォルト:** `false`。
    - `writableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ストリームの writable 側の `objectMode` を設定します。`objectMode` が `true` の場合は効果がありません。**デフォルト:** `false`。
    - `readableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ストリームの readable 側の `highWaterMark` を設定します。`highWaterMark` が指定されている場合は効果がありません。
    - `writableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ストリームの writable 側の `highWaterMark` を設定します。`highWaterMark` が指定されている場合は効果がありません。
  
 

```js [ESM]
const { Duplex } = require('node:stream');

class MyDuplex extends Duplex {
  constructor(options) {
    super(options);
    // ...
  }
}
```
または、pre-ES6スタイルのコンストラクターを使用する場合:

```js [ESM]
const { Duplex } = require('node:stream');
const util = require('node:util');

function MyDuplex(options) {
  if (!(this instanceof MyDuplex))
    return new MyDuplex(options);
  Duplex.call(this, options);
}
util.inherits(MyDuplex, Duplex);
```
または、簡略化されたコンストラクターアプローチを使用する場合:

```js [ESM]
const { Duplex } = require('node:stream');

const myDuplex = new Duplex({
  read(size) {
    // ...
  },
  write(chunk, encoding, callback) {
    // ...
  },
});
```
pipelineを使用する場合:

```js [ESM]
const { Transform, pipeline } = require('node:stream');
const fs = require('node:fs');

pipeline(
  fs.createReadStream('object.json')
    .setEncoding('utf8'),
  new Transform({
    decodeStrings: false, // Accept string input rather than Buffers
    construct(callback) {
      this.data = '';
      callback();
    },
    transform(chunk, encoding, callback) {
      this.data += chunk;
      callback();
    },
    flush(callback) {
      try {
        // Make sure is valid json.
        JSON.parse(this.data);
        this.push(this.data);
        callback();
      } catch (err) {
        callback(err);
      }
    },
  }),
  fs.createWriteStream('valid-object.json'),
  (err) => {
    if (err) {
      console.error('failed', err);
    } else {
      console.log('completed');
    }
  },
);
```

#### 双方向ストリームの例 {#an-example-duplex-stream}

以下は、データを書き込み可能であり、データが読み取り可能である、仮説的な下位レベルのソースオブジェクトをラップする単純な `Duplex` ストリームの例を示しています。ただし、Node.js ストリームと互換性のない API を使用します。以下は、[`Writable`](/ja/nodejs/api/stream#class-streamwritable) インターフェイスを介して受信した書き込みデータをバッファリングし、[`Readable`](/ja/nodejs/api/stream#class-streamreadable) インターフェイスを介して読み取り返す単純な `Duplex` ストリームの例を示しています。

```js [ESM]
const { Duplex } = require('node:stream');
const kSource = Symbol('source');

class MyDuplex extends Duplex {
  constructor(source, options) {
    super(options);
    this[kSource] = source;
  }

  _write(chunk, encoding, callback) {
    // 基になるソースは文字列のみを扱います。
    if (Buffer.isBuffer(chunk))
      chunk = chunk.toString();
    this[kSource].writeSomeData(chunk);
    callback();
  }

  _read(size) {
    this[kSource].fetchSomeData(size, (data, encoding) => {
      this.push(Buffer.from(data, encoding));
    });
  }
}
```
`Duplex` ストリームの最も重要な点は、`Readable` 側と `Writable` 側が、単一のオブジェクトインスタンス内に共存しているにもかかわらず、互いに独立して動作することです。

#### オブジェクトモード双方向ストリーム {#object-mode-duplex-streams}

`Duplex` ストリームの場合、`objectMode` は、`readableObjectMode` および `writableObjectMode` オプションを使用して、`Readable` 側または `Writable` 側のいずれかに対して排他的に設定できます。

たとえば、次の例では、オブジェクトモードの `Writable` 側を持ち、JavaScript 数値を受け入れて、`Readable` 側で 16 進文字列に変換する新しい `Transform` ストリーム（[`Duplex`](/ja/nodejs/api/stream#class-streamduplex) ストリームの一種）が作成されます。

```js [ESM]
const { Transform } = require('node:stream');

// すべての Transform ストリームは Duplex ストリームでもあります。
const myTransform = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    // 必要に応じて、チャンクを数値に強制します。
    chunk |= 0;

    // チャンクを別のものに変換します。
    const data = chunk.toString(16);

    // データを読み取り可能なキューにプッシュします。
    callback(null, '0'.repeat(data.length % 2) + data);
  },
});

myTransform.setEncoding('ascii');
myTransform.on('data', (chunk) => console.log(chunk));

myTransform.write(1);
// Prints: 01
myTransform.write(10);
// Prints: 0a
myTransform.write(100);
// Prints: 64
```

### Transformストリームの実装 {#implementing-a-transform-stream}

[`Transform`](/ja/nodejs/api/stream#class-streamtransform)ストリームは、出力が何らかの方法で入力から計算される[`Duplex`](/ja/nodejs/api/stream#class-streamduplex)ストリームです。例としては、データを圧縮、暗号化、または復号化する[zlib](/ja/nodejs/api/zlib)ストリームや[crypto](/ja/nodejs/api/crypto)ストリームなどがあります。

出力が入力と同じサイズである必要も、同じ数のチャンクである必要も、同じタイミングで到達する必要もありません。たとえば、`Hash`ストリームは、入力が終了したときに提供される単一の出力チャンクしか持ちません。`zlib`ストリームは、入力よりもはるかに小さいまたは大きい出力を生成します。

[`Transform`](/ja/nodejs/api/stream#class-streamtransform)ストリームを実装するために、`stream.Transform`クラスが拡張されます。

`stream.Transform`クラスは、`stream.Duplex`からプロトタイプ的に継承し、`writable._write()`メソッドと[`readable._read()`](/ja/nodejs/api/stream#readable_readsize)メソッドの独自のバージョンを実装します。カスタム`Transform`実装は、[`transform._transform()`](/ja/nodejs/api/stream#transform_transformchunk-encoding-callback)メソッドを*必ず*実装し、[`transform._flush()`](/ja/nodejs/api/stream#transform_flushcallback)メソッドも*実装可能*です。

`Transform`ストリームを使用する場合は、ストリームに書き込まれたデータによって、`Readable`側の出力が消費されない場合、ストリームの`Writable`側が一時停止する可能性があることに注意する必要があります。

#### `new stream.Transform([options])` {#new-streamtransformoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `Writable`コンストラクターと`Readable`コンストラクターの両方に渡されます。また、次のフィールドがあります。
    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._transform()`](/ja/nodejs/api/stream#transform_transformchunk-encoding-callback)メソッドの実装。
    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`stream._flush()`](/ja/nodejs/api/stream#transform_flushcallback)メソッドの実装。
  
 

```js [ESM]
const { Transform } = require('node:stream');

class MyTransform extends Transform {
  constructor(options) {
    super(options);
    // ...
  }
}
```
または、ES6以前のスタイルのコンストラクターを使用する場合：

```js [ESM]
const { Transform } = require('node:stream');
const util = require('node:util');

function MyTransform(options) {
  if (!(this instanceof MyTransform))
    return new MyTransform(options);
  Transform.call(this, options);
}
util.inherits(MyTransform, Transform);
```
または、簡略化されたコンストラクターアプローチを使用する場合：

```js [ESM]
const { Transform } = require('node:stream');

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // ...
  },
});
```

#### イベント: `'end'` {#event-end_1}

[`'end'`](/ja/nodejs/api/stream#event-end) イベントは、`stream.Readable` クラスからのものです。`'end'` イベントは、すべてのデータが出力された後に発生します。これは、[`transform._flush()`](/ja/nodejs/api/stream#transform_flushcallback) のコールバックが呼び出された後に発生します。エラーが発生した場合、`'end'` は発生しません。

#### イベント: `'finish'` {#event-finish_1}

[`'finish'`](/ja/nodejs/api/stream#event-finish) イベントは、`stream.Writable` クラスからのものです。`'finish'` イベントは、[`stream.end()`](/ja/nodejs/api/stream#writableendchunk-encoding-callback) が呼び出され、すべてのチャンクが [`stream._transform()`](/ja/nodejs/api/stream#transform_transformchunk-encoding-callback) によって処理された後に発生します。エラーが発生した場合、`'finish'` は発生しません。

#### `transform._flush(callback)` {#transform_flushcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 残りのデータがフラッシュされたときに呼び出されるコールバック関数（オプションでエラー引数とデータ付き）。

この関数は、アプリケーションコードから直接呼び出してはなりません。子クラスによって実装され、内部の `Readable` クラスメソッドのみによって呼び出される必要があります。

場合によっては、変換操作はストリームの最後にデータの追加のビットを出力する必要がある場合があります。たとえば、`zlib` 圧縮ストリームは、出力を最適に圧縮するために使用される内部状態の量を格納します。ただし、ストリームが終了すると、その追加のデータをフラッシュして、圧縮されたデータが完成するようにする必要があります。

カスタム [`Transform`](/ja/nodejs/api/stream#class-streamtransform) 実装は、`transform._flush()` メソッドを実装 *する場合があります*。これは、消費する書き込みデータがなくなったときに呼び出されますが、[`'end'`](/ja/nodejs/api/stream#event-end) イベントが発生して [`Readable`](/ja/nodejs/api/stream#class-streamreadable) ストリームの終わりを示す前に呼び出されます。

`transform._flush()` の実装内では、`transform.push()` メソッドを必要に応じて 0 回以上呼び出すことができます。フラッシュ操作が完了したら、`callback` 関数を呼び出す必要があります。

`transform._flush()` メソッドにはアンダースコアが付いています。これは、それがそれを定義するクラスの内部であり、ユーザープログラムから直接呼び出すべきではないためです。


#### `transform._transform(chunk, encoding, callback)` {#transform_transformchunk-encoding-callback}

- `chunk` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 変換される`Buffer`。[`stream.write()`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback)に渡された`string`から変換されます。ストリームの`decodeStrings`オプションが`false`であるか、ストリームがオブジェクトモードで動作している場合、チャンクは変換されず、[`stream.write()`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback)に渡されたものがそのままになります。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) チャンクが文字列の場合、これはエンコーディングの種類です。チャンクがバッファの場合、これは特別な値`'buffer'`です。その場合は無視してください。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 提供された`chunk`が処理された後に呼び出されるコールバック関数（オプションでエラー引数とデータ付き）。

この関数は、アプリケーションコードから直接呼び出してはなりません。子クラスによって実装され、内部の`Readable`クラスメソッドによってのみ呼び出されるべきです。

すべての`Transform`ストリーム実装は、入力を受け入れて出力を生成するための`_transform()`メソッドを提供する必要があります。`transform._transform()`の実装は、書き込まれるバイトを処理し、出力を計算し、`transform.push()`メソッドを使用してその出力を読み取り可能な部分に渡します。

`transform.push()`メソッドは、チャンクの結果として出力される量に応じて、単一の入力チャンクから出力を生成するために、ゼロ回以上呼び出すことができます。

特定の入力データのチャンクから出力が生成されない可能性があります。

`callback`関数は、現在のチャンクが完全に消費された場合にのみ呼び出す必要があります。`callback`に渡される最初の引数は、入力の処理中にエラーが発生した場合は`Error`オブジェクト、そうでない場合は`null`である必要があります。2番目の引数が`callback`に渡される場合、それは`transform.push()`メソッドに転送されますが、最初の引数がfalsyの場合のみです。言い換えれば、以下は同等です。

```js [ESM]
transform.prototype._transform = function(data, encoding, callback) {
  this.push(data);
  callback();
};

transform.prototype._transform = function(data, encoding, callback) {
  callback(null, data);
};
```
`transform._transform()`メソッドにはアンダースコアが付いています。これは、それが定義するクラスの内部的なものであり、ユーザープログラムによって直接呼び出されるべきではないためです。

`transform._transform()`は並行して呼び出されることはありません。ストリームはキューメカニズムを実装しており、次のチャンクを受信するには、`callback`を同期または非同期で呼び出す必要があります。


#### クラス: `stream.PassThrough` {#class-streampassthrough}

`stream.PassThrough` クラスは、入力をそのまま出力に渡す [`Transform`](/ja/nodejs/api/stream#class-streamtransform) ストリームの自明な実装です。その目的は主に例やテストのためですが、`stream.PassThrough` が新しい種類のストリームの構成要素として役立つユースケースもあります。

## 追加の注意点 {#additional-notes}

### async ジェネレーターおよび async イテレーターとのストリームの互換性 {#streams-compatibility-with-async-generators-and-async-iterators}

JavaScript での async ジェネレーターおよびイテレーターのサポートにより、async ジェネレーターは事実上、この時点で第一級の言語レベルのストリーム構造です。

Node.js ストリームを async ジェネレーターおよび async イテレーターで使用する一般的な相互運用ケースを以下に示します。

#### async イテレーターを使用した読み取り可能なストリームの消費 {#consuming-readable-streams-with-async-iterators}

```js [ESM]
(async function() {
  for await (const chunk of readable) {
    console.log(chunk);
  }
})();
```
Async イテレーターは、破棄後の未処理エラーを防ぐために、ストリームに永続的なエラーハンドラーを登録します。

#### async ジェネレーターを使用した読み取り可能なストリームの作成 {#creating-readable-streams-with-async-generators}

Node.js の読み取り可能なストリームは、`Readable.from()` ユーティリティメソッドを使用して、非同期ジェネレーターから作成できます。

```js [ESM]
const { Readable } = require('node:stream');

const ac = new AbortController();
const signal = ac.signal;

async function * generate() {
  yield 'a';
  await someLongRunningFn({ signal });
  yield 'b';
  yield 'c';
}

const readable = Readable.from(generate());
readable.on('close', () => {
  ac.abort();
});

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
#### async イテレーターから書き込み可能なストリームへのパイプ {#piping-to-writable-streams-from-async-iterators}

async イテレーターから書き込み可能なストリームに書き込む場合は、バックプレッシャーとエラーの適切な処理を確保してください。[`stream.pipeline()`](/ja/nodejs/api/stream#streampipelinesource-transforms-destination-callback) は、バックプレッシャーとバックプレッシャー関連のエラーの処理を抽象化します。

```js [ESM]
const fs = require('node:fs');
const { pipeline } = require('node:stream');
const { pipeline: pipelinePromise } = require('node:stream/promises');

const writable = fs.createWriteStream('./file');

const ac = new AbortController();
const signal = ac.signal;

const iterator = createIterator({ signal });

// Callback Pattern
pipeline(iterator, writable, (err, value) => {
  if (err) {
    console.error(err);
  } else {
    console.log(value, 'value returned');
  }
}).on('close', () => {
  ac.abort();
});

// Promise Pattern
pipelinePromise(iterator, writable)
  .then((value) => {
    console.log(value, 'value returned');
  })
  .catch((err) => {
    console.error(err);
    ac.abort();
  });
```

### 古い Node.js バージョンとの互換性 {#compatibility-with-older-nodejs-versions}

Node.js 0.10 より前のバージョンでは、`Readable` ストリームインターフェースはより単純でしたが、機能が少なく、使い勝手も良くありませんでした。

- [`stream.read()`](/ja/nodejs/api/stream#readablereadsize) メソッドの呼び出しを待つのではなく、[`'data'`](/ja/nodejs/api/stream#event-data) イベントがすぐに発生し始めました。データの処理方法を決定するために何らかの作業を行う必要のあるアプリケーションでは、データが失われないように、読み取ったデータをバッファーに保存する必要がありました。
- [`stream.pause()`](/ja/nodejs/api/stream#readablepause) メソッドは、保証されたものではなく、推奨的なものでした。これは、ストリームが一時停止状態にある場合でも、[`'data'`](/ja/nodejs/api/stream#event-data) イベントを受信する準備ができている必要があることを意味していました。

Node.js 0.10 では、[`Readable`](/ja/nodejs/api/stream#class-streamreadable) クラスが追加されました。古い Node.js プログラムとの下位互換性のために、`Readable` ストリームは、[`'data'`](/ja/nodejs/api/stream#event-data) イベントハンドラーが追加されたとき、または [`stream.resume()`](/ja/nodejs/api/stream#readableresume) メソッドが呼び出されたときに、「フローイングモード」に切り替わります。その結果、新しい [`stream.read()`](/ja/nodejs/api/stream#readablereadsize) メソッドと [`'readable'`](/ja/nodejs/api/stream#event-readable) イベントを使用していない場合でも、[`'data'`](/ja/nodejs/api/stream#event-data) チャンクが失われる心配はなくなりました。

ほとんどのアプリケーションは通常どおり機能し続けますが、これにより、次の条件下でエッジケースが発生します。

- [`'data'`](/ja/nodejs/api/stream#event-data) イベントリスナーが追加されていません。
- [`stream.resume()`](/ja/nodejs/api/stream#readableresume) メソッドが呼び出されていません。
- ストリームは書き込み可能な宛先にパイプされていません。

たとえば、次のコードを考えてみましょう。

```js [ESM]
// 警告！ 壊れています！
net.createServer((socket) => {

  // 'end' リスナーを追加しますが、データは消費しません。
  socket.on('end', () => {
    // ここには到達しません。
    socket.end('メッセージは受信されましたが、処理されませんでした。\n');
  });

}).listen(1337);
```
Node.js 0.10 より前では、受信メッセージデータは単純に破棄されていました。ただし、Node.js 0.10 以降では、ソケットは永久に一時停止したままになります。

この状況での回避策は、[`stream.resume()`](/ja/nodejs/api/stream#readableresume) メソッドを呼び出して、データの流れを開始することです。

```js [ESM]
// 回避策。
net.createServer((socket) => {
  socket.on('end', () => {
    socket.end('メッセージは受信されましたが、処理されませんでした。\n');
  });

  // データの流れを開始し、破棄します。
  socket.resume();
}).listen(1337);
```
フローイングモードに切り替わる新しい `Readable` ストリームに加えて、0.10 より前のスタイルのストリームは、[`readable.wrap()`](/ja/nodejs/api/stream#readablewrapstream) メソッドを使用して `Readable` クラスでラップできます。


### `readable.read(0)` {#readableread0}

データを実際に消費せずに、基になる readable ストリームのメカニズムのリフレッシュをトリガーする必要がある場合があります。そのような場合、`readable.read(0)` を呼び出すことができ、これは常に `null` を返します。

内部の読み取りバッファーが `highWaterMark` を下回り、ストリームが現在読み取り中でない場合、`stream.read(0)` を呼び出すと、低レベルの [`stream._read()`](/ja/nodejs/api/stream#readable_readsize) 呼び出しがトリガーされます。

ほとんどのアプリケーションではこれをほとんど必要としませんが、Node.js 内、特に `Readable` ストリームクラスの内部では、これが行われる状況があります。

### `readable.push('')` {#readablepush}

`readable.push('')` の使用は推奨されません。

オブジェクトモードではないストリームに、ゼロバイトの [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)、[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)、[\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) または [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) を push すると、興味深い副作用があります。これは [`readable.push()`](/ja/nodejs/api/stream#readablepushchunk-encoding) の呼び出しであるため、呼び出しは読み取りプロセスを終了します。ただし、引数が空の文字列であるため、データは readable バッファーに追加されず、ユーザーが消費するものがありません。

### `readable.setEncoding()` 呼び出し後の `highWaterMark` の不一致 {#highwatermark-discrepancy-after-calling-readablesetencoding}

`readable.setEncoding()` を使用すると、非オブジェクトモードでの `highWaterMark` の動作が変更されます。

通常、現在のバッファーのサイズは *バイト* 単位で `highWaterMark` と比較されます。ただし、`setEncoding()` が呼び出された後、比較関数はバッファーのサイズを *文字* 単位で測定し始めます。

これは `latin1` または `ascii` を使用する一般的なケースでは問題ありません。ただし、マルチバイト文字を含む可能性のある文字列を扱う場合は、この動作に注意することをお勧めします。

