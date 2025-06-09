---
title: Node.js ドキュメント - Zlib
description: Node.jsのzlibモジュールは、Gzip、Deflate/Inflate、Brotliアルゴリズムを使用した圧縮機能を提供します。データの圧縮と解凍のための同期および非同期メソッドを含み、圧縮動作をカスタマイズするためのさまざまなオプションがあります。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - Zlib | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのzlibモジュールは、Gzip、Deflate/Inflate、Brotliアルゴリズムを使用した圧縮機能を提供します。データの圧縮と解凍のための同期および非同期メソッドを含み、圧縮動作をカスタマイズするためのさまざまなオプションがあります。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - Zlib | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのzlibモジュールは、Gzip、Deflate/Inflate、Brotliアルゴリズムを使用した圧縮機能を提供します。データの圧縮と解凍のための同期および非同期メソッドを含み、圧縮動作をカスタマイズするためのさまざまなオプションがあります。
---


# Zlib {#zlib}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/zlib.js](https://github.com/nodejs/node/blob/v23.5.0/lib/zlib.js)

`node:zlib` モジュールは、Gzip, Deflate/Inflate, Brotli を用いて実装された圧縮機能を提供します。

これにアクセスするには:

::: code-group
```js [ESM]
import os from 'node:zlib';
```

```js [CJS]
const zlib = require('node:zlib');
```
:::

圧縮と解凍は、Node.js の [Streams API](/ja/nodejs/api/stream) を中心に構築されています。

ストリーム (ファイルなど) の圧縮または解凍は、ソースストリームを `zlib` の `Transform` ストリームを通して、宛先ストリームにパイプすることで実現できます。

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import process from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream';

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
});
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const process = require('node:process');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream');

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
});
```
:::

または、Promise `pipeline` API を使用します:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import process from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

await do_gzip('input.txt', 'input.txt.gz');
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const process = require('node:process');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream/promises');

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

do_gzip('input.txt', 'input.txt.gz')
  .catch((err) => {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  });
```
:::

データを1つのステップで圧縮または解凍することもできます。

::: code-group
```js [ESM]
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { deflate, unzip } from 'node:zlib';

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

import { promisify } from 'node:util';
const do_unzip = promisify(unzip);

const unzippedBuffer = await do_unzip(buffer);
console.log(unzippedBuffer.toString());
```

```js [CJS]
const { deflate, unzip } = require('node:zlib');

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

const { promisify } = require('node:util');
const do_unzip = promisify(unzip);

do_unzip(buffer)
  .then((buf) => console.log(buf.toString()))
  .catch((err) => {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  });
```
:::

## スレッドプールの使用法とパフォーマンスに関する考慮事項 {#threadpool-usage-and-performance-considerations}

明示的に同期的なものを除き、すべての `zlib` API は Node.js の内部スレッドプールを使用します。これにより、一部のアプリケーションで驚くべき影響とパフォーマンスの制限が発生する可能性があります。

多数の zlib オブジェクトを同時に作成および使用すると、メモリの断片化が著しくなる可能性があります。

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

const payload = Buffer.from('This is some data');

// 警告: これはしないでください!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```

```js [CJS]
const zlib = require('node:zlib');

const payload = Buffer.from('This is some data');

// 警告: これはしないでください!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```
:::

前の例では、30,000 個の deflate インスタンスが同時に作成されています。一部のオペレーティングシステムがメモリの割り当てと解放を処理する方法により、これによりメモリの断片化が著しくなる可能性があります。

圧縮操作の結果をキャッシュして、作業の重複を避けることを強くお勧めします。

## HTTP リクエストとレスポンスの圧縮 {#compressing-http-requests-and-responses}

`node:zlib` モジュールを使用して、[HTTP](https://tools.ietf.org/html/rfc7230#section-4.2) で定義されている `gzip`、`deflate`、および `br` コンテンツエンコーディングメカニズムのサポートを実装できます。

HTTP [`Accept-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.3) ヘッダーは、クライアントが受け入れる圧縮エンコーディングを識別するために HTTP リクエスト内で使用されます。[`Content-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.11) ヘッダーは、メッセージに実際に適用された圧縮エンコーディングを識別するために使用されます。

以下の例は、基本的な概念を示すために大幅に簡略化されています。`zlib` エンコーディングの使用はコストがかかる可能性があり、結果はキャッシュする必要があります。`zlib` の使用に関わる速度/メモリ/圧縮のトレードオフの詳細については、[メモリ使用量の調整](/ja/nodejs/api/zlib#memory-usage-tuning)を参照してください。

::: code-group
```js [ESM]
// クライアントリクエストの例
import fs from 'node:fs';
import zlib from 'node:zlib';
import http from 'node:http';
import process from 'node:process';
import { pipeline } from 'node:stream';

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // または、次の両方のケースを処理するために zlib.createUnzip() を使用します。
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```

```js [CJS]
// クライアントリクエストの例
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // または、次の両方のケースを処理するために zlib.createUnzip() を使用します。
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```
:::

::: code-group
```js [ESM]
// サーバーの例
// すべてのリクエストで gzip 操作を実行するのは非常にコストがかかります。
// 圧縮されたバッファをキャッシュする方がはるかに効率的です。
import zlib from 'node:zlib';
import http from 'node:http';
import fs from 'node:fs';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // 圧縮バージョンと非圧縮バージョンの両方のリソースを保存します。
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // エラーが発生した場合、サーバーはすでに 200 レスポンスコードを送信し、
      // ある程度のデータがすでにクライアントに送信されているため、できることはあまりありません。
      // できる最善のことは、レスポンスをすぐに終了し、エラーをログに記録することです。
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // 注: これは適合する accept-encoding パーサーではありません。
  // https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3 を参照してください。
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```

```js [CJS]
// サーバーの例
// すべてのリクエストで gzip 操作を実行するのは非常にコストがかかります。
// 圧縮されたバッファをキャッシュする方がはるかに効率的です。
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // 圧縮バージョンと非圧縮バージョンの両方のリソースを保存します。
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // エラーが発生した場合、サーバーはすでに 200 レスポンスコードを送信し、
      // ある程度のデータがすでにクライアントに送信されているため、できることはあまりありません。
      // できる最善のことは、レスポンスをすぐに終了し、エラーをログに記録することです。
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // 注: これは適合する accept-encoding パーサーではありません。
  // https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3 を参照してください。
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```
:::

デフォルトでは、`zlib` メソッドは、切り捨てられたデータを解凍するときにエラーをスローします。ただし、データが不完全であることがわかっている場合、または圧縮ファイルの先頭のみを検査したい場合は、入力データの最後のチャンクを解凍するために使用されるフラッシュメソッドを変更することで、デフォルトのエラー処理を抑制できます。

```js [ESM]
// これは上記の例からのバッファの切り捨てられたバージョンです
const buffer = Buffer.from('eJzT0yMA', 'base64');

zlib.unzip(
  buffer,
  // Brotli の場合、同等のものは zlib.constants.BROTLI_OPERATION_FLUSH です。
  { finishFlush: zlib.constants.Z_SYNC_FLUSH },
  (err, buffer) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
    console.log(buffer.toString());
  });
```
これにより、入力データが無効な形式である場合など、他のエラーをスローする状況での動作は変更されません。このメソッドを使用すると、入力が途中で終了したのか、整合性チェックがないのかを判断できなくなるため、解凍された結果が有効であることを手動で確認する必要があります。


## メモリ使用量の調整 {#memory-usage-tuning}

### zlib ベースのストリームの場合 {#for-zlib-based-streams}

`zlib/zconf.h` から、Node.js の使用に合わせて修正:

deflate のメモリ要件は (バイト単位):

```js [ESM]
(1 << (windowBits + 2)) + (1 << (memLevel + 9))
```
つまり、`windowBits` = 15 の場合は 128K + `memLevel` = 8 (デフォルト値) の場合は 128K に、小さなオブジェクト用に数キロバイトが加算されます。

たとえば、デフォルトのメモリ要件を 256K から 128K に減らすには、オプションを次のように設定します。

```js [ESM]
const options = { windowBits: 14, memLevel: 7 };
```
ただし、これは一般に圧縮を劣化させます。

inflate のメモリ要件は (バイト単位) `1 \<\< windowBits` です。 つまり、`windowBits` = 15 (デフォルト値) の場合は 32K に、小さなオブジェクト用に数キロバイトが加算されます。

これは、サイズ `chunkSize` の単一の内部出力スラブバッファー (デフォルトは 16K) に加えて必要です。

`zlib` 圧縮の速度は、`level` 設定によって最も劇的に影響を受けます。レベルが高いほど、圧縮は向上しますが、完了までに時間がかかります。レベルが低いほど、圧縮は少なくなりますが、はるかに高速になります。

一般に、メモリ使用量のオプションを大きくすると、各 `write` 操作でより多くのデータを処理できるようになるため、Node.js が `zlib` を呼び出す回数を減らすことができます。したがって、これはメモリ使用量を犠牲にして速度に影響を与えるもう 1 つの要因です。

### Brotli ベースのストリームの場合 {#for-brotli-based-streams}

Brotli ベースのストリームには zlib オプションに相当するものがありますが、これらのオプションの範囲は zlib のものとは異なります。

- zlib の `level` オプションは、Brotli の `BROTLI_PARAM_QUALITY` オプションに対応します。
- zlib の `windowBits` オプションは、Brotli の `BROTLI_PARAM_LGWIN` オプションに対応します。

Brotli 固有のオプションの詳細については、[下記](/ja/nodejs/api/zlib#brotli-constants) を参照してください。

## フラッシュ {#flushing}

圧縮ストリームで [`.flush()`](/ja/nodejs/api/zlib#zlibflushkind-callback) を呼び出すと、`zlib` は現在可能な限り多くの出力を返します。これは圧縮品質の低下を招く可能性がありますが、データをできるだけ早く利用できるようにする必要がある場合に役立ちます。

次の例では、`flush()` を使用して、圧縮された部分的な HTTP 応答をクライアントに書き込んでいます。

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import http from 'node:http';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  // For the sake of simplicity, the Accept-Encoding checks are omitted.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // If an error occurs, there's not much we can do because
      // the server has already sent the 200 response code and
      // some amount of data has already been sent to the client.
      // The best we can do is terminate the response immediately
      // and log the error.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // The data has been passed to zlib, but the compression algorithm may
      // have decided to buffer the data for more efficient compression.
      // Calling .flush() will make the data available as soon as the client
      // is ready to receive it.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```

```js [CJS]
const zlib = require('node:zlib');
const http = require('node:http');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  // For the sake of simplicity, the Accept-Encoding checks are omitted.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // If an error occurs, there's not much we can do because
      // the server has already sent the 200 response code and
      // some amount of data has already been sent to the client.
      // The best we can do is terminate the response immediately
      // and log the error.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // The data has been passed to zlib, but the compression algorithm may
      // have decided to buffer the data for more efficient compression.
      // Calling .flush() will make the data available as soon as the client
      // is ready to receive it.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```
:::


## 定数 {#constants}

**追加: v0.5.8**

### zlib 定数 {#zlib-constants}

`zlib.h` で定義されているすべての定数は、`require('node:zlib').constants` でも定義されています。通常の操作では、これらの定数を使用する必要はありません。これらの定数が存在することに驚かないように、ドキュメント化されています。このセクションは、[zlib ドキュメント](https://zlib.net/manual#Constants)からほぼ直接引用しています。

以前は、定数は `require('node:zlib')` から直接アクセスできました (例: `zlib.Z_NO_FLUSH`)。モジュールから直接定数にアクセスすることは現在も可能ですが、非推奨です。

許可されているフラッシュ値。

- `zlib.constants.Z_NO_FLUSH`
- `zlib.constants.Z_PARTIAL_FLUSH`
- `zlib.constants.Z_SYNC_FLUSH`
- `zlib.constants.Z_FULL_FLUSH`
- `zlib.constants.Z_FINISH`
- `zlib.constants.Z_BLOCK`
- `zlib.constants.Z_TREES`

圧縮/解凍関数の戻り値。負の値はエラー、正の値は特別だが正常なイベントに使用されます。

- `zlib.constants.Z_OK`
- `zlib.constants.Z_STREAM_END`
- `zlib.constants.Z_NEED_DICT`
- `zlib.constants.Z_ERRNO`
- `zlib.constants.Z_STREAM_ERROR`
- `zlib.constants.Z_DATA_ERROR`
- `zlib.constants.Z_MEM_ERROR`
- `zlib.constants.Z_BUF_ERROR`
- `zlib.constants.Z_VERSION_ERROR`

圧縮レベル。

- `zlib.constants.Z_NO_COMPRESSION`
- `zlib.constants.Z_BEST_SPEED`
- `zlib.constants.Z_BEST_COMPRESSION`
- `zlib.constants.Z_DEFAULT_COMPRESSION`

圧縮戦略。

- `zlib.constants.Z_FILTERED`
- `zlib.constants.Z_HUFFMAN_ONLY`
- `zlib.constants.Z_RLE`
- `zlib.constants.Z_FIXED`
- `zlib.constants.Z_DEFAULT_STRATEGY`

### Brotli 定数 {#brotli-constants}

**追加: v11.7.0, v10.16.0**

Brotli ベースのストリームで使用できるオプションと定数がいくつかあります。

#### フラッシュ操作 {#flush-operations}

次の値は、Brotli ベースのストリームで有効なフラッシュ操作です。

- `zlib.constants.BROTLI_OPERATION_PROCESS` (すべての操作のデフォルト)
- `zlib.constants.BROTLI_OPERATION_FLUSH` (`.flush()` を呼び出すときのデフォルト)
- `zlib.constants.BROTLI_OPERATION_FINISH` (最後のチャンクのデフォルト)
- `zlib.constants.BROTLI_OPERATION_EMIT_METADATA`
    - この特定の操作は、ストリーミングレイヤーにより、どのデータがこのフレームに最終的に含まれるかを知ることが難しいため、Node.js のコンテキストでは使いにくい場合があります。また、現在、Node.js API を介してこのデータを使用する方法はありません。


#### コンプレッサーのオプション {#compressor-options}

Brotliエンコーダーには、圧縮効率と速度に影響を与えるいくつかのオプションを設定できます。キーと値はどちらも `zlib.constants` オブジェクトのプロパティとしてアクセスできます。

最も重要なオプションは次のとおりです。

- `BROTLI_PARAM_MODE`
    - `BROTLI_MODE_GENERIC` (デフォルト)
    - `BROTLI_MODE_TEXT`、UTF-8テキスト用に調整
    - `BROTLI_MODE_FONT`、WOFF 2.0フォント用に調整

- `BROTLI_PARAM_QUALITY`
    - `BROTLI_MIN_QUALITY` から `BROTLI_MAX_QUALITY` の範囲で、デフォルトは `BROTLI_DEFAULT_QUALITY` です。

- `BROTLI_PARAM_SIZE_HINT`
    - 予想される入力サイズを表す整数値。デフォルトは、不明な入力サイズの場合は `0` です。

以下のフラグは、圧縮アルゴリズムとメモリ使用量の調整を高度に制御するために設定できます。

- `BROTLI_PARAM_LGWIN`
    - `BROTLI_MIN_WINDOW_BITS` から `BROTLI_MAX_WINDOW_BITS` の範囲で、デフォルトは `BROTLI_DEFAULT_WINDOW` です。`BROTLI_PARAM_LARGE_WINDOW` フラグが設定されている場合は、最大で `BROTLI_LARGE_MAX_WINDOW_BITS` までです。

- `BROTLI_PARAM_LGBLOCK`
    - `BROTLI_MIN_INPUT_BLOCK_BITS` から `BROTLI_MAX_INPUT_BLOCK_BITS` の範囲です。

- `BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING`
    - 伸張速度を優先して圧縮率を下げるブールフラグ。

- `BROTLI_PARAM_LARGE_WINDOW`
    - 「Large Window Brotli」モードを有効にするブールフラグ ([RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt) で標準化されているBrotli形式との互換性はありません)。

- `BROTLI_PARAM_NPOSTFIX`
    - `0` から `BROTLI_MAX_NPOSTFIX` の範囲です。

- `BROTLI_PARAM_NDIRECT`
    - `0` から `15 << NPOSTFIX` の範囲で、`1 << NPOSTFIX` 刻みです。

#### デコンプレッサーのオプション {#decompressor-options}

これらの高度なオプションは、伸張を制御するために使用できます。

- `BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION`
    - 内部メモリ割り当てパターンに影響を与えるブールフラグ。

- `BROTLI_DECODER_PARAM_LARGE_WINDOW`
    - 「Large Window Brotli」モードを有効にするブールフラグ ([RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt) で標準化されているBrotli形式との互換性はありません)。


## クラス: `Options` {#class-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.5.0, v12.19.0 | `maxOutputLength` オプションがサポートされるようになりました。 |
| v9.4.0 | `dictionary` オプションは `ArrayBuffer` にできます。 |
| v8.0.0 | `dictionary` オプションは `Uint8Array` にできるようになりました。 |
| v5.11.0 | `finishFlush` オプションがサポートされるようになりました。 |
| v0.11.1 | v0.11.1 で追加されました |
:::

各 zlib ベースのクラスは `options` オブジェクトを受け取ります。オプションは必須ではありません。

一部のオプションは圧縮時にのみ関連し、解凍クラスでは無視されます。

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `zlib.constants.Z_NO_FLUSH`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `zlib.constants.Z_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `16 * 1024`
- `windowBits` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (圧縮のみ)
- `memLevel` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (圧縮のみ)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (圧縮のみ)
- `dictionary` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) (deflate/inflate のみ、デフォルトでは空の辞書)
- `info` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) (`true` の場合、`buffer` と `engine` を含むオブジェクトを返します。)
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [簡便なメソッド](/ja/nodejs/api/zlib#convenience-methods) を使用する場合の出力サイズを制限します。**デフォルト:** [`buffer.kMaxLength`](/ja/nodejs/api/buffer#bufferkmaxlength)

詳細については、[`deflateInit2` および `inflateInit2`](https://zlib.net/manual#Advanced) のドキュメントを参照してください。


## クラス: `BrotliOptions` {#class-brotlioptions}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.5.0, v12.19.0 | `maxOutputLength` オプションがサポートされました。 |
| v11.7.0 | 追加: v11.7.0 |
:::

各 Brotli ベースのクラスは、`options` オブジェクトを取ります。すべてのオプションはオプションです。

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `zlib.constants.BROTLI_OPERATION_PROCESS`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `zlib.constants.BROTLI_OPERATION_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `16 * 1024`
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) インデックス化された [Brotli パラメータ](/ja/nodejs/api/zlib#brotli-constants) を含むキーと値のオブジェクト。
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [便利なメソッド](/ja/nodejs/api/zlib#convenience-methods) を使用する場合、出力サイズを制限します。**デフォルト:** [`buffer.kMaxLength`](/ja/nodejs/api/buffer#bufferkmaxlength)

例:

```js [ESM]
const stream = zlib.createBrotliCompress({
  chunkSize: 32 * 1024,
  params: {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
    [zlib.constants.BROTLI_PARAM_SIZE_HINT]: fs.statSync(inputFile).size,
  },
});
```
## クラス: `zlib.BrotliCompress` {#class-zlibbrotlicompress}

**追加: v11.7.0, v10.16.0**

Brotli アルゴリズムを使用してデータを圧縮します。

## クラス: `zlib.BrotliDecompress` {#class-zlibbrotlidecompress}

**追加: v11.7.0, v10.16.0**

Brotli アルゴリズムを使用してデータを解凍します。

## クラス: `zlib.Deflate` {#class-zlibdeflate}

**追加: v0.5.8**

deflate を使用してデータを圧縮します。

## クラス: `zlib.DeflateRaw` {#class-zlibdeflateraw}

**追加: v0.5.8**

deflate を使用してデータを圧縮し、`zlib` ヘッダーを追加しません。

## クラス: `zlib.Gunzip` {#class-zlibgunzip}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v6.0.0 | 入力ストリームの末尾にある末尾のガベージは `'error'` イベントが発生するようになります。 |
| v5.9.0 | 複数の連結された gzip ファイルメンバがサポートされるようになりました。 |
| v5.0.0 | 切り捨てられた入力ストリームは `'error'` イベントが発生するようになります。 |
| v0.5.8 | 追加: v0.5.8 |
:::

gzip ストリームを解凍します。


## クラス: `zlib.Gzip` {#class-zlibgzip}

**追加: v0.5.8**

gzip を使用してデータを圧縮します。

## クラス: `zlib.Inflate` {#class-zlibinflate}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v5.0.0 | 入力ストリームが途中で切断されると、`'error'` イベントが発生するようになりました。 |
| v0.5.8 | 追加: v0.5.8 |
:::

deflate ストリームを解凍します。

## クラス: `zlib.InflateRaw` {#class-zlibinflateraw}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v6.8.0 | カスタム辞書が `InflateRaw` でサポートされるようになりました。 |
| v5.0.0 | 入力ストリームが途中で切断されると、`'error'` イベントが発生するようになりました。 |
| v0.5.8 | 追加: v0.5.8 |
:::

raw deflate ストリームを解凍します。

## クラス: `zlib.Unzip` {#class-zlibunzip}

**追加: v0.5.8**

ヘッダーを自動検出して、Gzip または Deflate で圧縮されたストリームを解凍します。

## クラス: `zlib.ZlibBase` {#class-zlibzlibbase}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v11.7.0, v10.16.0 | このクラスは、`Zlib` から `ZlibBase` に名前が変更されました。 |
| v0.5.8 | 追加: v0.5.8 |
:::

`node:zlib` モジュールによってエクスポートされません。これは、コンプレッサー/デコンプレッサー クラスの基本クラスであるため、ここにドキュメントされています。

このクラスは [`stream.Transform`](/ja/nodejs/api/stream#class-streamtransform) から継承しており、`node:zlib` オブジェクトをパイプや同様のストリーム操作で使用できます。

### `zlib.bytesWritten` {#zlibbyteswritten}

**追加: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`zlib.bytesWritten` プロパティは、バイトが処理される（派生クラスに適したように圧縮または解凍される）前に、エンジンに書き込まれたバイト数を指定します。

### `zlib.crc32(data[, value])` {#zlibcrc32data-value}

**追加: v22.2.0, v20.15.0**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) `data` が文字列の場合、計算に使用される前に UTF-8 としてエンコードされます。
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) オプションの開始値。32 ビットの符号なし整数である必要があります。**デフォルト:** `0`
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) チェックサムを含む 32 ビットの符号なし整数。

`data` の 32 ビット [巡回冗長検査](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) チェックサムを計算します。`value` が指定されている場合、チェックサムの開始値として使用されます。それ以外の場合は、0 が開始値として使用されます。

CRC アルゴリズムは、チェックサムを計算し、データ伝送のエラーを検出するように設計されています。暗号化認証には適していません。

他の API との一貫性を保つために、`data` が文字列の場合、計算に使用される前に UTF-8 でエンコードされます。ユーザーが Node.js のみを使用してチェックサムを計算して照合する場合、これはデフォルトで UTF-8 エンコードを使用する他の API でうまく機能します。

一部のサードパーティの JavaScript ライブラリは、ブラウザーで実行できるように、`str.charCodeAt()` に基づいて文字列のチェックサムを計算します。ユーザーがブラウザーでこの種のライブラリで計算されたチェックサムと一致させたい場合は、Node.js でも実行される場合は、Node.js で同じライブラリを使用することをお勧めします。ユーザーがこのようなサードパーティライブラリによって生成されたチェックサムと一致させるために `zlib.crc32()` を使用する必要がある場合：

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```

```js [CJS]
const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```
:::


### `zlib.close([callback])` {#zlibclosecallback}

**Added in: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

基になるハンドルを閉じます。

### `zlib.flush([kind, ]callback)` {#zlibflushkind-callback}

**Added in: v0.5.8**

- `kind` **Default:** zlibベースのストリームの場合は `zlib.constants.Z_FULL_FLUSH` 、Brotliベースのストリームの場合は `zlib.constants.BROTLI_OPERATION_FLUSH` 。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

保留中のデータをフラッシュします。
これを軽率に呼び出さないでください。時期尚早なフラッシュは圧縮アルゴリズムの有効性に悪影響を及ぼします。

これを呼び出すと、内部の `zlib` の状態からのみデータがフラッシュされ、ストリームレベルではどのような種類のフラッシュも実行されません。
むしろ、 `.write()` への通常の呼び出しのように動作します。つまり、他の保留中の書き込みの後ろにキューに入れられ、ストリームからデータが読み取られるときにのみ出力が生成されます。

### `zlib.params(level, strategy, callback)` {#zlibparamslevel-strategy-callback}

**Added in: v0.11.4**

- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

この関数はzlibベースのストリームでのみ使用できます。つまり、Brotliではありません。

圧縮レベルと圧縮戦略を動的に更新します。 deflateアルゴリズムにのみ適用できます。

### `zlib.reset()` {#zlibreset}

**Added in: v0.7.0**

コンプレッサー/デコンプレッサーを工場出荷時のデフォルトにリセットします。 inflateおよびdeflateアルゴリズムにのみ適用できます。

## `zlib.constants` {#zlibconstants}

**Added in: v7.0.0**

Zlib関連の定数を列挙するオブジェクトを提供します。

## `zlib.createBrotliCompress([options])` {#zlibcreatebrotlicompressoptions}

**Added in: v11.7.0, v10.16.0**

- `options` [\<brotli options\>](/ja/nodejs/api/zlib#class-brotlioptions)

新しい [`BrotliCompress`](/ja/nodejs/api/zlib#class-zlibbrotlicompress) オブジェクトを作成して返します。


## `zlib.createBrotliDecompress([options])` {#zlibcreatebrotlidecompressoptions}

**Added in: v11.7.0, v10.16.0**

- `options` [\<brotli options\>](/ja/nodejs/api/zlib#class-brotlioptions)

新しい [`BrotliDecompress`](/ja/nodejs/api/zlib#class-zlibbrotlidecompress) オブジェクトを作成して返します。

## `zlib.createDeflate([options])` {#zlibcreatedeflateoptions}

**Added in: v0.5.8**

- `options` [\<zlib options\>](/ja/nodejs/api/zlib#class-options)

新しい [`Deflate`](/ja/nodejs/api/zlib#class-zlibdeflate) オブジェクトを作成して返します。

## `zlib.createDeflateRaw([options])` {#zlibcreatedeflaterawoptions}

**Added in: v0.5.8**

- `options` [\<zlib options\>](/ja/nodejs/api/zlib#class-options)

新しい [`DeflateRaw`](/ja/nodejs/api/zlib#class-zlibdeflateraw) オブジェクトを作成して返します。

zlibの1.2.8から1.2.11へのアップグレードにより、raw deflateストリームに対して`windowBits`が8に設定されている場合の動作が変更されました。 zlibは、最初に8に設定されている場合、自動的に`windowBits`を9に設定します。 新しいバージョンのzlibは例外をスローするため、Node.jsは8の値を9にアップグレードする元の動作を復元しました。これは、`windowBits = 9`をzlibに渡すと、実際には8ビットのウィンドウのみを効果的に使用する圧縮ストリームになるためです。

## `zlib.createGunzip([options])` {#zlibcreategunzipoptions}

**Added in: v0.5.8**

- `options` [\<zlib options\>](/ja/nodejs/api/zlib#class-options)

新しい [`Gunzip`](/ja/nodejs/api/zlib#class-zlibgunzip) オブジェクトを作成して返します。

## `zlib.createGzip([options])` {#zlibcreategzipoptions}

**Added in: v0.5.8**

- `options` [\<zlib options\>](/ja/nodejs/api/zlib#class-options)

新しい [`Gzip`](/ja/nodejs/api/zlib#class-zlibgzip) オブジェクトを作成して返します。 [example](/ja/nodejs/api/zlib#zlib) を参照してください。

## `zlib.createInflate([options])` {#zlibcreateinflateoptions}

**Added in: v0.5.8**

- `options` [\<zlib options\>](/ja/nodejs/api/zlib#class-options)

新しい [`Inflate`](/ja/nodejs/api/zlib#class-zlibinflate) オブジェクトを作成して返します。

## `zlib.createInflateRaw([options])` {#zlibcreateinflaterawoptions}

**Added in: v0.5.8**

- `options` [\<zlib options\>](/ja/nodejs/api/zlib#class-options)

新しい [`InflateRaw`](/ja/nodejs/api/zlib#class-zlibinflateraw) オブジェクトを作成して返します。

## `zlib.createUnzip([options])` {#zlibcreateunzipoptions}

**Added in: v0.5.8**

- `options` [\<zlib options\>](/ja/nodejs/api/zlib#class-options)

新しい [`Unzip`](/ja/nodejs/api/zlib#class-zlibunzip) オブジェクトを作成して返します。


## 便利なメソッド {#convenience-methods}

これらのメソッドはすべて、最初の引数として[`Buffer`](/ja/nodejs/api/buffer#class-buffer)、[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)、[`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)、または文字列を受け取り、オプションの 2 番目の引数として `zlib` クラスにオプションを提供し、`callback(error, result)` で提供されたコールバックを呼び出します。

すべてのメソッドには、コールバックなしで同じ引数を受け入れる `*Sync` という対応するものがあります。

### `zlib.brotliCompress(buffer[, options], callback)` {#zlibbrotlicompressbuffer-options-callback}

**追加: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/ja/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliCompressSync(buffer[, options])` {#zlibbrotlicompresssyncbuffer-options}

**追加: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/ja/nodejs/api/zlib#class-brotlioptions)

[`BrotliCompress`](/ja/nodejs/api/zlib#class-zlibbrotlicompress)を使用してデータのチャンクを圧縮します。


### `zlib.brotliDecompress(buffer[, options], callback)` {#zlibbrotlidecompressbuffer-options-callback}

**Added in: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/ja/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliDecompressSync(buffer[, options])` {#zlibbrotlidecompresssyncbuffer-options}

**Added in: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/ja/nodejs/api/zlib#class-brotlioptions)

[`BrotliDecompress`](/ja/nodejs/api/zlib#class-zlibbrotlidecompress) でデータのチャンクを解凍します。

### `zlib.deflate(buffer[, options], callback)` {#zlibdeflatebuffer-options-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v9.4.0 | `buffer` パラメーターは `ArrayBuffer` にできます。 |
| v8.0.0 | `buffer` パラメーターは任意の `TypedArray` または `DataView` にできます。 |
| v8.0.0 | `buffer` パラメーターは `Uint8Array` にできるようになりました。 |
| v0.6.0 | Added in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ja/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.deflateSync(buffer[, options])` {#zlibdeflatesyncbuffer-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.4.0 | `buffer` パラメータは `ArrayBuffer` にできます。 |
| v8.0.0 | `buffer` パラメータは任意の `TypedArray` または `DataView` にできます。 |
| v8.0.0 | `buffer` パラメータは `Uint8Array` になりました。 |
| v0.11.12 | 追加: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib オプション\>](/ja/nodejs/api/zlib#class-options)

データチャンクを [`Deflate`](/ja/nodejs/api/zlib#class-zlibdeflate) で圧縮します。

### `zlib.deflateRaw(buffer[, options], callback)` {#zlibdeflaterawbuffer-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v8.0.0 | `buffer` パラメータは任意の `TypedArray` または `DataView` にできます。 |
| v8.0.0 | `buffer` パラメータは `Uint8Array` になりました。 |
| v0.6.0 | 追加: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib オプション\>](/ja/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.deflateRawSync(buffer[, options])` {#zlibdeflaterawsyncbuffer-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.4.0 | `buffer` パラメータは `ArrayBuffer` にできます。 |
| v8.0.0 | `buffer` パラメータは任意の `TypedArray` または `DataView` にできます。 |
| v8.0.0 | `buffer` パラメータは `Uint8Array` になりました。 |
| v0.11.12 | 追加: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib オプション\>](/ja/nodejs/api/zlib#class-options)

データチャンクを [`DeflateRaw`](/ja/nodejs/api/zlib#class-zlibdeflateraw) で圧縮します。


### `zlib.gunzip(buffer[, options], callback)` {#zlibgunzipbuffer-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.4.0 | `buffer` パラメーターは `ArrayBuffer` にできます。 |
| v8.0.0 | `buffer` パラメーターは任意の `TypedArray` または `DataView` にできます。 |
| v8.0.0 | `buffer` パラメーターは `Uint8Array` になりました。 |
| v0.6.0 | 追加: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib オプション\>](/ja/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.gunzipSync(buffer[, options])` {#zlibgunzipsyncbuffer-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.4.0 | `buffer` パラメーターは `ArrayBuffer` にできます。 |
| v8.0.0 | `buffer` パラメーターは任意の `TypedArray` または `DataView` にできます。 |
| v8.0.0 | `buffer` パラメーターは `Uint8Array` になりました。 |
| v0.11.12 | 追加: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib オプション\>](/ja/nodejs/api/zlib#class-options)

[`Gunzip`](/ja/nodejs/api/zlib#class-zlibgunzip)でデータのチャンクを解凍します。

### `zlib.gzip(buffer[, options], callback)` {#zlibgzipbuffer-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.4.0 | `buffer` パラメーターは `ArrayBuffer` にできます。 |
| v8.0.0 | `buffer` パラメーターは任意の `TypedArray` または `DataView` にできます。 |
| v8.0.0 | `buffer` パラメーターは `Uint8Array` になりました。 |
| v0.6.0 | 追加: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib オプション\>](/ja/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.gzipSync(buffer[, options])` {#zlibgzipsyncbuffer-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.4.0 | `buffer` パラメーターは `ArrayBuffer` にできます。 |
| v8.0.0 | `buffer` パラメーターは任意の `TypedArray` または `DataView` にできます。 |
| v8.0.0 | `buffer` パラメーターは `Uint8Array` になりました。 |
| v0.11.12 | 追加: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib オプション\>](/ja/nodejs/api/zlib#class-options)

[`Gzip`](/ja/nodejs/api/zlib#class-zlibgzip)でデータのチャンクを圧縮します。

### `zlib.inflate(buffer[, options], callback)` {#zlibinflatebuffer-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.4.0 | `buffer` パラメーターは `ArrayBuffer` にできます。 |
| v8.0.0 | `buffer` パラメーターは任意の `TypedArray` または `DataView` にできます。 |
| v8.0.0 | `buffer` パラメーターは `Uint8Array` になりました。 |
| v0.6.0 | 追加: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib オプション\>](/ja/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateSync(buffer[, options])` {#zlibinflatesyncbuffer-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.4.0 | `buffer` パラメーターは `ArrayBuffer` にできます。 |
| v8.0.0 | `buffer` パラメーターは任意の `TypedArray` または `DataView` にできます。 |
| v8.0.0 | `buffer` パラメーターは `Uint8Array` になりました。 |
| v0.11.12 | 追加: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib オプション\>](/ja/nodejs/api/zlib#class-options)

[`Inflate`](/ja/nodejs/api/zlib#class-zlibinflate)でデータのチャンクを解凍します。


### `zlib.inflateRaw(buffer[, options], callback)` {#zlibinflaterawbuffer-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.4.0 | `buffer` パラメーターは `ArrayBuffer` にできます。 |
| v8.0.0 | `buffer` パラメーターは任意の `TypedArray` または `DataView` にできます。 |
| v8.0.0 | `buffer` パラメーターは `Uint8Array` でも可能になりました。 |
| v0.6.0 | 追加: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ja/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateRawSync(buffer[, options])` {#zlibinflaterawsyncbuffer-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.4.0 | `buffer` パラメーターは `ArrayBuffer` にできます。 |
| v8.0.0 | `buffer` パラメーターは任意の `TypedArray` または `DataView` にできます。 |
| v8.0.0 | `buffer` パラメーターは `Uint8Array` でも可能になりました。 |
| v0.11.12 | 追加: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ja/nodejs/api/zlib#class-options)

[`InflateRaw`](/ja/nodejs/api/zlib#class-zlibinflateraw) でデータのチャンクを解凍します。

### `zlib.unzip(buffer[, options], callback)` {#zlibunzipbuffer-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.4.0 | `buffer` パラメーターは `ArrayBuffer` にできます。 |
| v8.0.0 | `buffer` パラメーターは任意の `TypedArray` または `DataView` にできます。 |
| v8.0.0 | `buffer` パラメーターは `Uint8Array` でも可能になりました。 |
| v0.6.0 | 追加: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/ja/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.unzipSync(buffer[, options])` {#zlibunzipsyncbuffer-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v9.4.0 | `buffer` 引数は `ArrayBuffer` にできます。 |
| v8.0.0 | `buffer` 引数は、任意の `TypedArray` または `DataView` にできます。 |
| v8.0.0 | `buffer` 引数は `Uint8Array` になりました。 |
| v0.11.12 | 追加: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib オプション\>](/ja/nodejs/api/zlib#class-options)

[`Unzip`](/ja/nodejs/api/zlib#class-zlibunzip) を使ってデータのチャンクを解凍します。

