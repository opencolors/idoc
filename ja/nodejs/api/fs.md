---
title: Node.js ファイルシステム API ドキュメント
description: Node.js ファイルシステムモジュールの包括的なガイド。ファイル操作の方法、例えば読み取り、書き込み、開く、閉じる、ファイルの権限と統計情報の管理について詳述しています。
head:
  - - meta
    - name: og:title
      content: Node.js ファイルシステム API ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js ファイルシステムモジュールの包括的なガイド。ファイル操作の方法、例えば読み取り、書き込み、開く、閉じる、ファイルの権限と統計情報の管理について詳述しています。
  - - meta
    - name: twitter:title
      content: Node.js ファイルシステム API ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js ファイルシステムモジュールの包括的なガイド。ファイル操作の方法、例えば読み取り、書き込み、開く、閉じる、ファイルの権限と統計情報の管理について詳述しています。
---


# ファイルシステム {#file-system}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/fs.js](https://github.com/nodejs/node/blob/v23.5.0/lib/fs.js)

`node:fs`モジュールを使用すると、標準のPOSIX関数をモデルにした方法でファイルシステムを操作できます。

PromiseベースのAPIを使用するには:

::: code-group
```js [ESM]
import * as fs from 'node:fs/promises';
```

```js [CJS]
const fs = require('node:fs/promises');
```
:::

コールバックAPIと同期APIを使用するには:

::: code-group
```js [ESM]
import * as fs from 'node:fs';
```

```js [CJS]
const fs = require('node:fs');
```
:::

すべてのファイルシステム操作には、同期、コールバック、およびPromiseベースの形式があり、CommonJS構文とES6モジュール(ESM)の両方を使用してアクセスできます。

## Promiseの例 {#promise-example}

Promiseベースの操作は、非同期操作が完了すると履行されるPromiseを返します。

::: code-group
```js [ESM]
import { unlink } from 'node:fs/promises';

try {
  await unlink('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (error) {
  console.error('there was an error:', error.message);
}
```

```js [CJS]
const { unlink } = require('node:fs/promises');

(async function(path) {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello');
```
:::

## コールバックの例 {#callback-example}

コールバック形式は、完了コールバック関数を最後の引数として受け取り、操作を非同期的に呼び出します。 完了コールバックに渡される引数はメソッドによって異なりますが、最初の引数は常に例外のために予約されています。 操作が正常に完了した場合、最初の引数は`null`または`undefined`です。

::: code-group
```js [ESM]
import { unlink } from 'node:fs';

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```

```js [CJS]
const { unlink } = require('node:fs');

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```
:::

`node:fs`モジュールAPIのコールバックベースのバージョンは、実行時間とメモリー割り当ての両方の点で、最大のパフォーマンスが要求される場合に、Promise APIの使用よりも推奨されます。


## 同期的な例 {#synchronous-example}

同期的なAPIは、操作が完了するまでNode.jsのイベントループとそれ以降のJavaScriptの実行をブロックします。例外はすぐにスローされ、`try…catch`を使用して処理するか、バブルアップさせることができます。

::: code-group
```js [ESM]
import { unlinkSync } from 'node:fs';

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // エラー処理
}
```

```js [CJS]
const { unlinkSync } = require('node:fs');

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // エラー処理
}
```
:::

## Promises API {#promises-api}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.0.0 | `require('fs/promises')`として公開。 |
| v11.14.0, v10.17.0 | このAPIは実験的ではなくなりました。 |
| v10.1.0 | このAPIは`require('fs').promises`経由でのみアクセス可能です。 |
| v10.0.0 | v10.0.0で追加 |
:::

`fs/promises` APIは、Promiseを返す非同期ファイルシステムメソッドを提供します。

Promise APIは、基盤となるNode.jsのスレッドプールを使用して、イベントループスレッド外でファイルシステム操作を実行します。これらの操作は同期化されておらず、スレッドセーフでもありません。同じファイルに対して複数の同時変更を行う場合は注意が必要であり、データが破損する可能性があります。

### クラス: `FileHandle` {#class-filehandle}

**追加: v10.0.0**

[\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle)オブジェクトは、数値ファイル記述子のオブジェクトラッパーです。

[\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle)オブジェクトのインスタンスは、`fsPromises.open()`メソッドによって作成されます。

すべての[\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle)オブジェクトは[\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)です。

[\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle)が`filehandle.close()`メソッドを使用して閉じられていない場合、ファイル記述子を自動的に閉じようとし、プロセスの警告を発行してメモリリークを防ぐのに役立ちます。これは信頼性が低く、ファイルが閉じられない可能性があるため、この動作に依存しないでください。代わりに、常に[\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle)を明示的に閉じてください。 Node.jsは将来この動作を変更する可能性があります。


#### Event: `'close'` {#event-close}

**Added in: v15.4.0**

`'close'` イベントは、[\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle) が閉じられ、もはや使用できなくなったときに発生します。

#### `filehandle.appendFile(data[, options])` {#filehandleappendfiledata-options}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v21.1.0, v20.10.0 | `flush` オプションがサポートされるようになりました。 |
| v15.14.0, v14.18.0 | `data` 引数が `AsyncIterable`、`Iterable`、および `Stream` をサポートするようになりました。 |
| v14.0.0 | `data` パラメータは、サポートされていない入力を文字列に強制的に変換しなくなりました。 |
| v10.0.0 | Added in: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/ja/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `'utf8'`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、基になるファイル記述子は閉じられる前にフラッシュされます。 **デフォルト:** `false`。
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功すると `undefined` で履行されます。

[`filehandle.writeFile()`](/ja/nodejs/api/fs#filehandlewritefiledata-options) のエイリアス。

ファイルハンドルを操作する場合、モードは [`fsPromises.open()`](/ja/nodejs/api/fs#fspromisesopenpath-flags-mode) で設定された状態から変更できません。 したがって、これは [`filehandle.writeFile()`](/ja/nodejs/api/fs#filehandlewritefiledata-options) と同等です。


#### `filehandle.chmod(mode)` {#filehandlechmodmode}

**Added in: v10.0.0**

- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイルモードのビットマスク。
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功すると `undefined` で履行されます。

ファイルのパーミッションを変更します。[`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) を参照してください。

#### `filehandle.chown(uid, gid)` {#filehandlechownuid-gid}

**Added in: v10.0.0**

- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイルの新しい所有者のユーザー ID。
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイルの新しいグループのグループ ID。
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功すると `undefined` で履行されます。

ファイルの所有権を変更します。[`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) のラッパー。

#### `filehandle.close()` {#filehandleclose}

**Added in: v10.0.0**

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功すると `undefined` で履行されます。

ハンドルでの保留中の操作が完了するのを待ってから、ファイルハンドルを閉じます。

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle;
try {
  filehandle = await open('thefile.txt', 'r');
} finally {
  await filehandle?.close();
}
```
#### `filehandle.createReadStream([options])` {#filehandlecreatereadstreamoptions}

**Added in: v16.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `64 * 1024`
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **デフォルト:** `undefined`

- 戻り値: [\<fs.ReadStream\>](/ja/nodejs/api/fs#class-fsreadstream)

`options` には、ファイル全体ではなく、ファイルのバイト範囲を読み取るための `start` 値と `end` 値を含めることができます。`start` と `end` は両方とも包括的で、0 からカウントを開始します。許可される値は [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)] の範囲です。`start` が省略されるか `undefined` の場合、`filehandle.createReadStream()` は現在のファイル位置から順番に読み取ります。`encoding` は、[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) で受け入れられるもののいずれかです。

`FileHandle` が、（キーボードやサウンドカードなどの）ブロック読み込みのみをサポートする文字デバイスを指している場合、データが利用可能になるまで読み取り操作は完了しません。これにより、プロセスが終了できなくなり、ストリームが自然に閉じられなくなる可能性があります。

デフォルトでは、ストリームは破棄された後、`'close'` イベントを発行します。この動作を変更するには、`emitClose` オプションを `false` に設定します。

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('/dev/input/event0');
// 何らかの文字デバイスからストリームを作成します。
const stream = fd.createReadStream();
setTimeout(() => {
  stream.close(); // これはストリームを閉じない場合があります。
  // 基になるリソースがファイル終端をそれ自体で示したかのように、ストリームの終端を人為的にマークすると、ストリームを閉じることができます。
  // これは保留中の読み取り操作をキャンセルせず、そのような操作がある場合、プロセスはそれが完了するまで正常に終了できない場合があります。
  stream.push(null);
  stream.read(0);
}, 100);
```
`autoClose` が false の場合、エラーが発生した場合でも、ファイル記述子は閉じられません。ファイル記述子を閉じて、ファイル記述子のリークがないことを確認するのはアプリケーションの責任です。`autoClose` が true (デフォルトの動作) に設定されている場合、`'error'` または `'end'` でファイル記述子は自動的に閉じられます。

100 バイトのファイルの最後の 10 バイトを読み取る例:

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('sample.txt');
fd.createReadStream({ start: 90, end: 99 });
```

#### `filehandle.createWriteStream([options])` {#filehandlecreatewritestreamoptions}

::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0, v20.10.0 | `flush` オプションがサポートされるようになりました。 |
| v16.11.0 | Added in: v16.11.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'utf8'`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、基になるファイル記述子が閉じる前にフラッシュされます。 **Default:** `false`.
  
 
- Returns: [\<fs.WriteStream\>](/ja/nodejs/api/fs#class-fswritestream)

`options` には、ファイルの先頭より後の位置にデータを書き込めるようにする `start` オプションを含めることもできます。許可される値は、[0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)] の範囲です。ファイルを置き換えるのではなく変更するには、`flags` `open` オプションをデフォルトの `r` ではなく `r+` に設定する必要がある場合があります。`encoding` は、[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) で受け入れられるもののいずれかになります。

`autoClose` が true (デフォルトの動作) に設定されている場合、`'error'` または `'finish'` でファイル記述子が自動的に閉じられます。`autoClose` が false の場合、エラーが発生した場合でもファイル記述子は閉じられません。それを閉じて、ファイル記述子のリークがないことを確認するのは、アプリケーションの責任です。

デフォルトでは、ストリームは破棄された後に `'close'` イベントを発行します。この動作を変更するには、`emitClose` オプションを `false` に設定します。


#### `filehandle.datasync()` {#filehandledatasync}

**Added in: v10.0.0**

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に `undefined` で履行されます。

ファイルに関連付けられた現在キューに入っているすべてのI/O操作を、オペレーティングシステムの同期I/O完了状態に強制的に移行させます。詳細については、POSIXの[`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2)ドキュメントを参照してください。

`filehandle.sync`とは異なり、このメソッドは変更されたメタデータをフラッシュしません。

#### `filehandle.fd` {#filehandlefd}

**Added in: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle)オブジェクトによって管理される数値ファイル記述子。

#### `filehandle.read(buffer, offset, length, position)` {#filehandlereadbuffer-offset-length-position}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v21.0.0 | `position`として bigint 値を受け入れます。 |
| v10.0.0 | Added in: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 読み込まれたファイルデータが格納されるバッファ。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 埋め込みを開始するバッファ内の位置。**デフォルト:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込むバイト数。**デフォルト:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) ファイルからデータの読み込みを開始する場所。`null`または`-1`の場合、データは現在のファイル位置から読み込まれ、位置が更新されます。`position`が負でない整数の場合、現在のファイル位置は変更されません。**デフォルト**:`null`
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に次の 2 つのプロパティを持つオブジェクトで履行されます。
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込まれたバイト数
    - `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 渡された `buffer` 引数への参照。
  
 

ファイルからデータを読み取り、指定されたバッファに格納します。

ファイルが同時に変更されない場合、読み込まれたバイト数がゼロになると、ファイルの終わりに達します。


#### `filehandle.read([options])` {#filehandlereadoptions}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v21.0.0 | `position` として bigint 値を受け入れるようになりました。 |
| v13.11.0, v12.17.0 | 追加: v13.11.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 読み込まれたファイルデータが格納されるバッファー。**デフォルト:** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) バッファー内で書き込みを開始する場所。**デフォルト:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込むバイト数。**デフォルト:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) ファイルからデータの読み込みを開始する場所。`null` または `-1` の場合、データは現在のファイル位置から読み込まれ、位置が更新されます。`position` が負でない整数の場合、現在のファイル位置は変更されません。**デフォルト**: `null`

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功すると、以下の2つのプロパティを持つオブジェクトで履行されます。
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込まれたバイト数
    - `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 渡された `buffer` 引数への参照。

ファイルからデータを読み込み、指定されたバッファーに格納します。

ファイルが同時に変更されていない場合、読み込まれたバイト数がゼロになると、ファイルの終わりに達します。


#### `filehandle.read(buffer[, options])` {#filehandlereadbuffer-options}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v21.0.0 | `position` として bigint 値を受け入れるようになりました。 |
| v18.2.0, v16.17.0 | 追加: v18.2.0, v16.17.0 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 読み取られたファイルデータが格納されるバッファー。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) バッファー内で書き込みを開始する場所。**デフォルト:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み取るバイト数。**デフォルト:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) ファイルからデータの読み取りを開始する場所。`null` または `-1` の場合、データは現在のファイル位置から読み取られ、位置が更新されます。`position` が負でない整数の場合、現在のファイル位置は変更されません。**デフォルト:**: `null`


- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に次の 2 つのプロパティを持つオブジェクトで履行されます:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み取られたバイト数
    - `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 渡された `buffer` 引数への参照。


ファイルからデータを読み取り、指定されたバッファーに格納します。

ファイルが同時に変更されない場合、読み取られたバイト数がゼロになると、ファイルの終わりに達します。


#### `filehandle.readableWebStream([options])` {#filehandlereadablewebstreamoptions}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.0.0, v18.17.0 | 'bytes'ストリームを作成するオプションを追加。 |
| v17.0.0 | 追加: v17.0.0 |
:::

::: warning [安定度: 1 - 試験的]
[安定度: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 通常のストリームまたは `'bytes'` ストリームを開くかどうか。**デフォルト:** `undefined`
  
 
-  返却値: [\<ReadableStream\>](/ja/nodejs/api/webstreams#class-readablestream) 

ファイルのデータを読み取るために使用できる`ReadableStream`を返します。

このメソッドが複数回呼び出された場合、または`FileHandle`が閉じられた後、または閉じている間に呼び出された場合、エラーがスローされます。

::: code-group
```js [ESM]
import {
  open,
} from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const chunk of file.readableWebStream())
  console.log(chunk);

await file.close();
```

```js [CJS]
const {
  open,
} = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const chunk of file.readableWebStream())
    console.log(chunk);

  await file.close();
})();
```
:::

`ReadableStream`はファイルを最後まで読み取りますが、`FileHandle`を自動的に閉じることはありません。ユーザーコードは、`fileHandle.close()`メソッドを呼び出す必要があります。

#### `filehandle.readFile(options)` {#filehandlereadfileoptions}

**追加: v10.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `null`
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中のreadFileを中断できます。
  
 
- 返却値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ファイルの内容を正常に読み取ると解決します。エンコーディングが指定されていない場合(`options.encoding`を使用)、データは[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)オブジェクトとして返されます。それ以外の場合、データは文字列になります。

ファイルのコンテンツ全体を非同期的に読み取ります。

`options`が文字列の場合、それは`encoding`を指定します。

[\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle)は読み取りをサポートする必要があります。

ファイルハンドルに対して1つ以上の`filehandle.read()`呼び出しが行われ、その後`filehandle.readFile()`呼び出しが行われると、データは現在の位置からファイルの最後まで読み取られます。ファイルの先頭から常に読み取るわけではありません。


#### `filehandle.readLines([options])` {#filehandlereadlinesoptions}

**Added in: v18.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `64 * 1024`
  
 
- 戻り値: [\<readline.InterfaceConstructor\>](/ja/nodejs/api/readline#class-interfaceconstructor)

`readline`インターフェースを作成し、ファイルにストリームするための便利なメソッドです。オプションについては、[`filehandle.createReadStream()`](/ja/nodejs/api/fs#filehandlecreatereadstreamoptions)を参照してください。

::: code-group
```js [ESM]
import { open } from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const line of file.readLines()) {
  console.log(line);
}
```

```js [CJS]
const { open } = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const line of file.readLines()) {
    console.log(line);
  }
})();
```
:::

#### `filehandle.readv(buffers[, position])` {#filehandlereadvbuffers-position}

**Added in: v13.13.0, v12.17.0**

- `buffers` [\<Buffer[]\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) データの読み込みを開始するファイルの先頭からのオフセット。`position`が`number`でない場合、データは現在の位置から読み込まれます。**Default:** `null`
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に、次の2つのプロパティを含むオブジェクトで履行されます。
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込まれたバイト数
    - `buffers` [\<Buffer[]\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 入力`buffers`への参照を含むプロパティ。
  
 

ファイルから読み取り、[\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)の配列に書き込みます。


#### `filehandle.stat([options])` {#filehandlestatoptions}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.5.0 | 返される数値が bigint であるかどうかを指定する追加の `options` オブジェクトを受け入れます。 |
| v10.0.0 | Added in: v10.0.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返される[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats)オブジェクトの数値が`bigint`であるかどうか。**デフォルト:** `false`。

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ファイルの[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats)で履行されます。

#### `filehandle.sync()` {#filehandlesync}

**Added in: v10.0.0**

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に `undefined` で履行されます。

オープンなファイル記述子に関するすべてのデータをストレージデバイスにフラッシュするように要求します。具体的な実装は、オペレーティングシステムとデバイスに固有です。詳細については、POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2)ドキュメントを参照してください。

#### `filehandle.truncate(len)` {#filehandletruncatelen}

**Added in: v10.0.0**

- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0`
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に `undefined` で履行されます。

ファイルを切り詰めます。

ファイルが `len` バイトよりも大きい場合、ファイルの最初の `len` バイトのみが保持されます。

次の例では、ファイルの最初の4バイトのみを保持します。

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle = null;
try {
  filehandle = await open('temp.txt', 'r+');
  await filehandle.truncate(4);
} finally {
  await filehandle?.close();
}
```

ファイルが以前に `len` バイトより短かった場合は、拡張され、拡張された部分は null バイト (`'\0'`) で埋められます。

`len` が負の場合、`0` が使用されます。


#### `filehandle.utimes(atime, mtime)` {#filehandleutimesatime-mtime}

**Added in: v10.0.0**

- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

[\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle) が参照するオブジェクトのファイルシステムのタイムスタンプを変更し、成功時に引数なしでpromiseを履行します。

#### `filehandle.write(buffer, offset[, length[, position]])` {#filehandlewritebuffer-offset-length-position}

::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | `buffer` 引数は、サポートされていない入力を強制的にバッファーに変換しなくなりました。 |
| v10.0.0 | Added in: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込みを開始する `buffer` 内の開始位置。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込む `buffer` からのバイト数。**デフォルト:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) `buffer` からのデータを書き込むファイルの先頭からのオフセット。 `position` が `number` でない場合、データは現在の位置に書き込まれます。 詳細は、POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) のドキュメントを参照してください。 **デフォルト:** `null`
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

`buffer` をファイルに書き込みます。

promiseは、次の2つのプロパティを含むオブジェクトで履行されます。

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込まれたバイト数
- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 書き込まれた `buffer` への参照。

promiseが履行される（または拒否される）のを待たずに、同じファイルで `filehandle.write()` を複数回使用するのは安全ではありません。 このシナリオでは、[`filehandle.createWriteStream()`](/ja/nodejs/api/fs#filehandlecreatewritestreamoptions) を使用します。

Linuxでは、ファイルが追記モードで開かれている場合、位置指定の書き込みは機能しません。 カーネルはposition引数を無視し、常にデータのファイルの末尾に追加します。


#### `filehandle.write(buffer[, options])` {#filehandlewritebuffer-options}

**Added in: v18.3.0, v16.17.0**

- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `null`
  
 
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

`buffer` をファイルに書き込みます。

上記の `filehandle.write` 関数と同様に、このバージョンはオプションの `options` オブジェクトを取ります。`options` オブジェクトが指定されていない場合は、上記のデフォルト値が使用されます。

#### `filehandle.write(string[, position[, encoding]])` {#filehandlewritestring-position-encoding}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | `string` パラメータは、サポートされていない入力を文字列に強制変換しなくなりました。 |
| v10.0.0 | Added in: v10.0.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) `string` からのデータを書き込むファイルの先頭からのオフセット。`position` が `number` でない場合、データは現在の位置に書き込まれます。詳細については、POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) ドキュメントを参照してください。**Default:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 期待される文字列エンコーディング。**Default:** `'utf8'`
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

`string` をファイルに書き込みます。`string` が文字列でない場合、promise はエラーで拒否されます。

promise は、2 つのプロパティを含むオブジェクトで完了します。

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込まれたバイト数
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 書き込まれた `string` への参照。

promise が完了 (または拒否) されるのを待たずに、同じファイルで `filehandle.write()` を複数回使用するのは安全ではありません。このシナリオでは、[`filehandle.createWriteStream()`](/ja/nodejs/api/fs#filehandlecreatewritestreamoptions) を使用してください。

Linux では、ファイルが append モードで開かれている場合、位置指定書き込みは機能しません。カーネルは position 引数を無視し、常にデータの末尾に追加します。


#### `filehandle.writeFile(data, options)` {#filehandlewritefiledata-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.14.0, v14.18.0 | `data` 引数は `AsyncIterable`、`Iterable`、および `Stream` をサポートします。 |
| v14.0.0 | `data` パラメーターは、サポートされていない入力を文字列に強制的に変換しなくなりました。 |
| v10.0.0 | 追加: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/ja/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) `data` が文字列の場合の予期される文字エンコーディング。**デフォルト:** `'utf8'`

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

ファイルに非同期的にデータを書き込みます。ファイルが既に存在する場合は、ファイルを置き換えます。 `data` は、文字列、バッファー、[\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)、または [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) オブジェクトにすることができます。 Promise は、成功すると引数なしで履行されます。

`options` が文字列の場合、`encoding` を指定します。

[\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle) は書き込みをサポートする必要があります。

Promise が履行 (または拒否) されるのを待たずに、同じファイルに対して `filehandle.writeFile()` を複数回使用することは安全ではありません。

1 つ以上の `filehandle.write()` 呼び出しがファイルハンドルに対して行われた後、`filehandle.writeFile()` 呼び出しが行われた場合、データは現在の位置からファイルの最後まで書き込まれます。 常にファイルの先頭から書き込むわけではありません。


#### `filehandle.writev(buffers[, position])` {#filehandlewritevbuffers-position}

**Added in: v12.9.0**

- `buffers` [\<Buffer[]\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) `buffers`からのデータを書き込むファイルの先頭からのオフセット。 `position` が `number` でない場合、データは現在の位置に書き込まれます。 **デフォルト:** `null`
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

[\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView) の配列をファイルに書き込みます。

promiseは、2つのプロパティを含むオブジェクトでfulfilledされます。

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込まれたバイト数
- `buffers` [\<Buffer[]\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) `buffers` 入力への参照。

promiseがfulfilled（またはrejected）されるのを待たずに、同じファイルに対して複数回 `writev()` を呼び出すのは安全ではありません。

Linuxでは、ファイルが追記モードで開かれている場合、位置指定書き込みは機能しません。 カーネルは position 引数を無視し、常にファイルの末尾にデータを追記します。

#### `filehandle[Symbol.asyncDispose]()` {#filehandlesymbolasyncdispose}

**Added in: v20.4.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

`filehandle.close()` のエイリアス。


### `fsPromises.access(path[, mode])` {#fspromisesaccesspath-mode}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `fs.constants.F_OK`
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功すると `undefined` で fulfill します。

`path` で指定されたファイルまたはディレクトリに対するユーザーのアクセス許可をテストします。 `mode` 引数は、実行するアクセス可能性チェックを指定するオプションの整数です。 `mode` は、値 `fs.constants.F_OK`、または `fs.constants.R_OK`、`fs.constants.W_OK`、および `fs.constants.X_OK` のいずれかのビット単位の OR で構成されるマスクのいずれかである必要があります（例: `fs.constants.W_OK | fs.constants.R_OK`）。 `mode` の可能な値については、[ファイルのアクセス定数](/ja/nodejs/api/fs#file-access-constants)を確認してください。

アクセス可能性のチェックが成功した場合、Promise は値なしで fulfill されます。 アクセス可能性のチェックのいずれかが失敗した場合、Promise は [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) オブジェクトで reject されます。 次の例では、現在のプロセスがファイル `/etc/passwd` を読み書きできるかどうかを確認します。

```js [ESM]
import { access, constants } from 'node:fs/promises';

try {
  await access('/etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can access');
} catch {
  console.error('cannot access');
}
```
`fsPromises.open()` を呼び出す前に、ファイルのアクセス可能性を確認するために `fsPromises.access()` を使用することはお勧めしません。 そうすると、他のプロセスが 2 回の呼び出しの間にファイルの状態を変更する可能性があるため、競合状態が発生します。 代わりに、ユーザーコードはファイルを直接 open/read/write し、ファイルにアクセスできない場合に発生するエラーを処理する必要があります。

### `fsPromises.appendFile(path, data[, options])` {#fspromisesappendfilepath-data-options}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v21.1.0, v20.10.0 | `flush` オプションがサポートされるようになりました。 |
| v10.0.0 | Added in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle) ファイル名または [\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Default:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ファイルシステムの `flags` のサポート](/ja/nodejs/api/fs#file-system-flags) を参照してください。 **Default:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、基になるファイルディスクリプターは閉じられる前にフラッシュされます。 **Default:** `false`.

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功すると `undefined` で fulfill します。

非同期的にファイルにデータを追加します。ファイルが存在しない場合は作成します。 `data` は、文字列または [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) になります。

`options` が文字列の場合、`encoding` を指定します。

`mode` オプションは、新しく作成されたファイルにのみ影響します。 詳細については、[`fs.open()`](/ja/nodejs/api/fs#fsopenpath-flags-mode-callback) を参照してください。

`path` は、追加のために開かれた（`fsPromises.open()` を使用）[\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle) として指定できます。


### `fsPromises.chmod(path, mode)` {#fspromiseschmodpath-mode}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に `undefined` で履行されます。

ファイルの許可を変更します。

### `fsPromises.chown(path, uid, gid)` {#fspromiseschownpath-uid-gid}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に `undefined` で履行されます。

ファイルの所有者を変更します。

### `fsPromises.copyFile(src, dest[, mode])` {#fspromisescopyfilesrc-dest-mode}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | `flags` 引数を `mode` に変更し、より厳密な型検証を課しました。 |
| v10.0.0 | Added in: v10.0.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) コピー元のファイル名
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) コピー操作のコピー先のファイル名
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) コピー操作の動作を指定するオプションの修飾子。2つ以上の値のビット単位のORで構成されるマスクを作成できます（例：`fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`）。**デフォルト:** `0`。
    - `fs.constants.COPYFILE_EXCL`: `dest`がすでに存在する場合、コピー操作は失敗します。
    - `fs.constants.COPYFILE_FICLONE`: コピー操作は、copy-on-write reflinkを作成しようとします。プラットフォームがcopy-on-writeをサポートしていない場合、フォールバックコピーメカニズムが使用されます。
    - `fs.constants.COPYFILE_FICLONE_FORCE`: コピー操作は、copy-on-write reflinkを作成しようとします。プラットフォームがcopy-on-writeをサポートしていない場合、操作は失敗します。
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に `undefined` で履行されます。

非同期的に `src` を `dest` にコピーします。 デフォルトでは、`dest` がすでに存在する場合は上書きされます。

コピー操作の原子性については保証されません。 コピー先のファイルが書き込みのために開かれた後にエラーが発生した場合、コピー先の削除が試行されます。

```js [ESM]
import { copyFile, constants } from 'node:fs/promises';

try {
  await copyFile('source.txt', 'destination.txt');
  console.log('source.txt was copied to destination.txt');
} catch {
  console.error('The file could not be copied');
}

// COPYFILE_EXCLを使用すると、destination.txtが存在する場合、操作は失敗します。
try {
  await copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
  console.log('source.txt was copied to destination.txt');
} catch {
  console.error('The file could not be copied');
}
```

### `fsPromises.cp(src, dest[, options])` {#fspromisescpsrc-dest-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.3.0 | この API は実験的ではなくなりました。 |
| v20.1.0, v18.17.0 | `fs.copyFile()` の `mode` 引数としてコピーの動作を指定するための追加の `mode` オプションを受け入れます。 |
| v17.6.0, v16.15.0 | シンボリックリンクのパス解決を実行するかどうかを指定するための追加の `verbatimSymlinks` オプションを受け入れます。 |
| v16.7.0 | Added in: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) コピー元のパス。
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) コピー先のパス。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) シンボリックリンクをデリファレンスします。 **デフォルト:** `false`。
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `force` が `false` で、コピー先が存在する場合、エラーをスローします。 **デフォルト:** `false`。
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) コピーするファイル/ディレクトリをフィルタリングする関数。項目をコピーするには `true` を、無視するには `false` を返します。ディレクトリを無視すると、その内容はすべてスキップされます。 `true` または `false` に解決される `Promise` を返すこともできます。 **デフォルト:** `undefined`。
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コピー元のパス。
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コピー先のパス。
    - 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) `boolean` に強制できる値、またはそのような値で解決される `Promise`。

    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 既存のファイルまたはディレクトリを上書きします。これを false に設定し、コピー先が存在する場合、コピー操作はエラーを無視します。この動作を変更するには、`errorOnExist` オプションを使用してください。 **デフォルト:** `true`。
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) コピー操作の修飾子。 **デフォルト:** `0`。 [`fsPromises.copyFile()`](/ja/nodejs/api/fs#fspromisescopyfilesrc-dest-mode) の `mode` フラグを参照してください。
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`src` からのタイムスタンプが保持されます。 **デフォルト:** `false`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ディレクトリを再帰的にコピーします。 **デフォルト:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、シンボリックリンクのパス解決はスキップされます。 **デフォルト:** `false`

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功すると `undefined` で履行されます。

`src` から `dest` へ、サブディレクトリやファイルを含むディレクトリ構造全体を非同期的にコピーします。

ディレクトリを別のディレクトリにコピーする場合、glob はサポートされておらず、動作は `cp dir1/ dir2/` と同様です。


### `fsPromises.glob(pattern[, options])` {#fspromisesglobpattern-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.2.0 | `withFileTypes` をオプションとしてサポートを追加。 |
| v22.0.0 | v22.0.0 で追加 |
:::

::: warning [安定度: 1 - 試験的]
[安定度: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 現在のワーキングディレクトリ。**デフォルト:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) ファイル/ディレクトリを除外する関数。アイテムを除外するには `true` を返し、含めるには `false` を返します。**デフォルト:** `undefined`。
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) glob がパスを Dirent として返す場合は `true`、そうでない場合は `false`。**デフォルト:** `false`。


- 戻り値: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) パターンに一致するファイルのパスを生成する AsyncIterator。

::: code-group
```js [ESM]
import { glob } from 'node:fs/promises';

for await (const entry of glob('**/*.js'))
  console.log(entry);
```

```js [CJS]
const { glob } = require('node:fs/promises');

(async () => {
  for await (const entry of glob('**/*.js'))
    console.log(entry);
})();
```
:::

### `fsPromises.lchmod(path, mode)` {#fspromiseslchmodpath-mode}

**非推奨: v10.0.0 以降**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に `undefined` で履行されます。

シンボリックリンクのパーミッションを変更します。

このメソッドは macOS でのみ実装されています。


### `fsPromises.lchown(path, uid, gid)` {#fspromiseslchownpath-uid-gid}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.6.0 | この API は非推奨ではなくなりました。 |
| v10.0.0 | 追加: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  成功時に `undefined` で履行されます。

シンボリックリンクの所有者を変更します。

### `fsPromises.lutimes(path, atime, mtime)` {#fspromiseslutimespath-atime-mtime}

**追加: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  成功時に `undefined` で履行されます。

[`fsPromises.utimes()`](/ja/nodejs/api/fs#fspromisesutimespath-atime-mtime) と同じ方法でファイルのアクセス時間と変更時間を変更します。パスがシンボリックリンクを参照する場合、リンクは参照解除されません。代わりに、シンボリックリンク自体のタイムスタンプが変更されます。


### `fsPromises.link(existingPath, newPath)` {#fspromiseslinkexistingpath-newpath}

**Added in: v10.0.0**

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  成功時に `undefined` で履行されます。

`existingPath` から `newPath` への新しいリンクを作成します。詳細については、POSIX の [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) ドキュメントを参照してください。

### `fsPromises.lstat(path[, options])` {#fspromiseslstatpath-options}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.5.0 | 返される数値が bigint であるべきかを指定する追加の `options` オブジェクトを受け入れます。 |
| v10.0.0 | Added in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返される [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトの数値が `bigint` であるべきかどうか。**デフォルト:** `false`。


- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  指定されたシンボリックリンク `path` の [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトで履行されます。

`path` がシンボリックリンクを参照する場合を除き、[`fsPromises.stat()`](/ja/nodejs/api/fs#fspromisesstatpath-options) と同等です。その場合、リンク自体が stat され、それが参照するファイルは stat されません。詳細については、POSIX の [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) ドキュメントを参照してください。


### `fsPromises.mkdir(path[, options])` {#fspromisesmkdirpath-options}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Windows ではサポートされていません。 **Default:** `0o777`.
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功すると、`recursive` が `false` の場合は `undefined` で、`recursive` が `true` の場合は最初に作成されたディレクトリパスで履行されます。

非同期的にディレクトリを作成します。

オプションの `options` 引数は、`mode` (許可およびスティッキービット) を指定する整数、または `mode` プロパティと、親ディレクトリを作成する必要があるかどうかを示す `recursive` プロパティを持つオブジェクトにすることができます。 `path` が既存のディレクトリである場合に `fsPromises.mkdir()` を呼び出すと、`recursive` が false の場合にのみリジェクトされます。

::: code-group
```js [ESM]
import { mkdir } from 'node:fs/promises';

try {
  const projectFolder = new URL('./test/project/', import.meta.url);
  const createDir = await mkdir(projectFolder, { recursive: true });

  console.log(`created ${createDir}`);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');

async function makeDirectory() {
  const projectFolder = join(__dirname, 'test', 'project');
  const dirCreation = await mkdir(projectFolder, { recursive: true });

  console.log(dirCreation);
  return dirCreation;
}

makeDirectory().catch(console.error);
```
:::


### `fsPromises.mkdtemp(prefix[, options])` {#fspromisesmkdtempprefix-options}

::: info [History]
| バージョン | 変更点 |
| --- | --- |
| v20.6.0, v18.19.0 | `prefix` パラメータがバッファと URL を受け入れるようになりました。 |
| v16.5.0, v14.18.0 | `prefix` パラメータが空文字列を受け入れるようになりました。 |
| v10.0.0 | Added in: v10.0.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `'utf8'`
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  新しく作成された一時ディレクトリのファイルシステムパスを含む文字列で解決される Promise。

ユニークな一時ディレクトリを作成します。 ユニークなディレクトリ名は、指定された `prefix` の末尾に 6 文字のランダムな文字を追加することで生成されます。 プラットフォームによる非一貫性のため、`prefix` の末尾に `X` 文字を使用しないでください。 一部のプラットフォーム (特に BSD) では、6 文字を超えるランダムな文字を返し、`prefix` の末尾の `X` 文字をランダムな文字に置き換えることがあります。

オプションの `options` 引数には、エンコーディングを指定する文字列、または使用する文字エンコーディングを指定する `encoding` プロパティを持つオブジェクトを指定できます。

```js [ESM]
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

try {
  await mkdtemp(join(tmpdir(), 'foo-'));
} catch (err) {
  console.error(err);
}
```
`fsPromises.mkdtemp()` メソッドは、ランダムに選択された 6 文字を `prefix` 文字列に直接追加します。 たとえば、ディレクトリ `/tmp` があり、`/tmp` *内* に一時ディレクトリを作成する場合、`prefix` はプラットフォーム固有の末尾のパス区切り文字 (`require('node:path').sep`) で終わる必要があります。


### `fsPromises.open(path, flags[, mode])` {#fspromisesopenpath-flags-mode}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v11.1.0 | `flags` 引数はオプションになり、デフォルトは `'r'` になりました。 |
| v10.0.0 | 追加: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [ファイルシステムの `flags` のサポート](/ja/nodejs/api/fs#file-system-flags)を参照してください。 **デフォルト:** `'r'`。
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイルが作成される場合のファイルモード（許可とスティッキービット）を設定します。 **デフォルト:** `0o666` （読み書き可能）
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle) オブジェクトで履行します。

[\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle) を開きます。

詳細については、POSIX の [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) ドキュメントを参照してください。

一部の文字 (`\< \> : " / \ | ? *`) は、Windows では [ファイル、パス、名前空間の名前付け](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file) でドキュメント化されているように予約されています。 NTFS では、ファイル名にコロンが含まれている場合、Node.js は [この MSDN ページ](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams) で説明されているように、ファイルシステムストリームを開きます。

### `fsPromises.opendir(path[, options])` {#fspromisesopendirpath-options}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v20.1.0, v18.17.0 | `recursive` オプションが追加されました。 |
| v13.1.0, v12.16.0 | `bufferSize` オプションが導入されました。 |
| v12.12.0 | 追加: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ディレクトリから読み取る際に内部でバッファリングされるディレクトリ エントリの数。 値が高いほどパフォーマンスは向上しますが、メモリ使用量が増えます。 **デフォルト:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 解決された `Dir` は、すべてのサブファイルとディレクトリを含む [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) になります。 **デフォルト:** `false`


- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  [\<fs.Dir\>](/ja/nodejs/api/fs#class-fsdir) で履行します。

反復スキャンのためにディレクトリを非同期的に開きます。 詳細については、POSIX の [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) ドキュメントを参照してください。

[\<fs.Dir\>](/ja/nodejs/api/fs#class-fsdir) を作成します。これには、ディレクトリからの読み取りとクリーンアップのためのすべての追加関数が含まれています。

`encoding` オプションは、ディレクトリのオープン時と後続の読み取り操作時の `path` のエンコーディングを設定します。

非同期イテレーションを使用する例:

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
非同期イテレータを使用する場合、[\<fs.Dir\>](/ja/nodejs/api/fs#class-fsdir) オブジェクトはイテレータが終了した後に自動的に閉じられます。


### `fsPromises.readdir(path[, options])` {#fspromisesreaddirpath-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v20.1.0, v18.17.0 | `recursive` オプションが追加されました。 |
| v10.11.0 | 新しいオプション `withFileTypes` が追加されました。 |
| v10.0.0 | Added in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、ディレクトリの内容を再帰的に読み取ります。再帰モードでは、すべてのファイル、サブファイル、ディレクトリがリストされます。 **Default:** `false`.
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  ディレクトリ内のファイル名の配列で `'.'` と `'..'` を除いたものが解決されます。

ディレクトリの内容を読み取ります。

オプションの `options` 引数は、エンコーディングを指定する文字列、またはファイル名に使用する文字エンコーディングを指定する `encoding` プロパティを持つオブジェクトにすることができます。`encoding` が `'buffer'` に設定されている場合、返されるファイル名は [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) オブジェクトとして渡されます。

`options.withFileTypes` が `true` に設定されている場合、返される配列には [\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) オブジェクトが含まれます。

```js [ESM]
import { readdir } from 'node:fs/promises';

try {
  const files = await readdir(path);
  for (const file of files)
    console.log(file);
} catch (err) {
  console.error(err);
}
```

### `fsPromises.readFile(path[, options])` {#fspromisesreadfilepath-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.2.0, v14.17.0 | `options` 引数は、進行中の readFile リクエストを中断するための AbortSignal を含めることができるようになりました。 |
| v10.0.0 | 追加: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle) ファイル名または `FileHandle`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ファイルシステムの `flags` のサポート](/ja/nodejs/api/fs#file-system-flags)を参照してください。 **デフォルト:** `'r'`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中の readFile を中断できます

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ファイルの内容で履行します。

ファイルのすべての内容を非同期で読み取ります。

`encoding` を指定しない場合（`options.encoding` を使用）、データは [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) オブジェクトとして返されます。 それ以外の場合、データは文字列になります。

`options` が文字列の場合、エンコーディングを指定します。

`path` がディレクトリの場合、`fsPromises.readFile()` の動作はプラットフォーム固有です。 macOS、Linux、および Windows では、promise はエラーで拒否されます。 FreeBSD では、ディレクトリの内容の表現が返されます。

実行中のコードと同じディレクトリにある `package.json` ファイルを読み取る例:

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
try {
  const filePath = new URL('./package.json', import.meta.url);
  const contents = await readFile(filePath, { encoding: 'utf8' });
  console.log(contents);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
async function logFile() {
  try {
    const filePath = resolve('./package.json');
    const contents = await readFile(filePath, { encoding: 'utf8' });
    console.log(contents);
  } catch (err) {
    console.error(err.message);
  }
}
logFile();
```
:::

[\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) を使用して、進行中の `readFile` を中止することができます。 リクエストが中止された場合、返される promise は `AbortError` で拒否されます。

```js [ESM]
import { readFile } from 'node:fs/promises';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // promise が確定する前にリクエストを中止します。
  controller.abort();

  await promise;
} catch (err) {
  // リクエストが中止された場合 - err は AbortError です
  console.error(err);
}
```

進行中のリクエストを中止しても、個々のオペレーティングシステムのリクエストは中止されませんが、`fs.readFile` が実行する内部バッファリングは中止されます。

指定された [\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle) は、読み取りをサポートしている必要があります。


### `fsPromises.readlink(path[, options])` {#fspromisesreadlinkpath-options}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'utf8'`
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に`linkString`で解決されます。

`path`が指すシンボリックリンクの内容を読み込みます。詳細はPOSIXの[`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2)ドキュメントを参照してください。promiseは成功時に`linkString`で解決されます。

オプションの`options`引数は、エンコーディングを指定する文字列、または返されるリンクパスに使用する文字エンコーディングを指定する`encoding`プロパティを持つオブジェクトにできます。`encoding`が`'buffer'`に設定されている場合、返されるリンクパスは[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)オブジェクトとして渡されます。

### `fsPromises.realpath(path[, options])` {#fspromisesrealpathpath-options}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'utf8'`
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に解決されたパスで解決されます。

`fs.realpath.native()`関数と同じセマンティクスを使用して、`path`の実際の場所を決定します。

UTF8文字列に変換できるパスのみがサポートされます。

オプションの`options`引数は、エンコーディングを指定する文字列、またはパスに使用する文字エンコーディングを指定する`encoding`プロパティを持つオブジェクトにできます。`encoding`が`'buffer'`に設定されている場合、返されるパスは[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)オブジェクトとして渡されます。

Linuxでは、Node.jsがmusl libcにリンクされている場合、この関数が機能するためには、procfsファイルシステムが`/proc`にマウントされている必要があります。Glibcにはこの制限はありません。


### `fsPromises.rename(oldPath, newPath)` {#fspromisesrenameoldpath-newpath}

**Added in: v10.0.0**

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に `undefined` で履行します。

`oldPath` を `newPath` にリネームします。

### `fsPromises.rmdir(path[, options])` {#fspromisesrmdirpath-options}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | ファイルである `path` で `fsPromises.rmdir(path, { recursive: true })` を使用することが許可されなくなり、Windows で `ENOENT` エラー、POSIX で `ENOTDIR` エラーが発生します。 |
| v16.0.0 | 存在しない `path` で `fsPromises.rmdir(path, { recursive: true })` を使用することが許可されなくなり、`ENOENT` エラーが発生します。 |
| v16.0.0 | `recursive` オプションは非推奨であり、使用すると非推奨の警告が発生します。 |
| v14.14.0 | `recursive` オプションは非推奨です。代わりに `fsPromises.rm` を使用してください。 |
| v13.3.0, v12.16.0 | `maxBusyTries` オプションの名前が `maxRetries` に変更され、デフォルトは 0 です。`emfileWait` オプションは削除され、`EMFILE` エラーは他のエラーと同じ再試行ロジックを使用します。`retryDelay` オプションがサポートされるようになりました。`ENFILE` エラーが再試行されるようになりました。 |
| v12.10.0 | `recursive`、`maxBusyTries`、および `emfileWait` オプションがサポートされるようになりました。 |
| v10.0.0 | Added in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `EBUSY`、`EMFILE`、`ENFILE`、`ENOTEMPTY`、または `EPERM` エラーが発生した場合、Node.js は操作を再試行します。各試行で `retryDelay` ミリ秒ずつ線形バックオフで待ちます。このオプションは、再試行回数を表します。`recursive` オプションが `true` でない場合、このオプションは無視されます。**デフォルト:** `0`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、再帰的なディレクトリ削除を実行します。再帰モードでは、操作は失敗時に再試行されます。**デフォルト:** `false`。**非推奨。**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 再試行の間に待機する時間（ミリ秒単位）。`recursive` オプションが `true` でない場合、このオプションは無視されます。**デフォルト:** `100`。
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に `undefined` で履行します。

`path` で識別されるディレクトリを削除します。

ファイル（ディレクトリではない）で `fsPromises.rmdir()` を使用すると、Windows では `ENOENT` エラー、POSIX では `ENOTDIR` エラーで promise が拒否されます。

`rm -rf` Unix コマンドと同様の動作を得るには、`fsPromises.rm()`](/ja/nodejs/api/fs#fspromisesrmpath-options) をオプション `{ recursive: true, force: true }` で使用してください。


### `fsPromises.rm(path[, options])` {#fspromisesrmpath-options}

**Added in: v14.14.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、`path`が存在しなくても例外は無視されます。 **Default:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `EBUSY`、`EMFILE`、`ENFILE`、`ENOTEMPTY`、または `EPERM` エラーが発生した場合、Node.js は操作をリトライし、各試行で `retryDelay` ミリ秒ずつ線形バックオフで待機します。このオプションは、リトライの回数を表します。このオプションは、`recursive` オプションが `true` でない場合は無視されます。 **Default:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、再帰的なディレクトリ削除を実行します。再帰モードでは、操作は失敗時にリトライされます。**Default:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) リトライ間の待機時間（ミリ秒単位）。このオプションは、`recursive` オプションが `true` でない場合は無視されます。**Default:** `100`.
  
 
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功すると `undefined` で履行されます。

ファイルとディレクトリを削除します（標準の POSIX `rm` ユーティリティをモデルにしています）。

### `fsPromises.stat(path[, options])` {#fspromisesstatpath-options}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.5.0 | 返される数値が bigint であるかどうかを指定するための追加の `options` オブジェクトを受け入れます。 |
| v10.0.0 | Added in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返される[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトの数値が `bigint` であるかどうか。 **Default:** `false`.
  
 
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  指定された `path` の[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトで履行されます。


### `fsPromises.statfs(path[, options])` {#fspromisesstatfspath-options}

**Added in: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返される[\<fs.StatFs\>](/ja/nodejs/api/fs#class-fsstatfs)オブジェクトの数値が`bigint`であるかどうか。**既定:** `false`。


- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 指定された`path`に対する[\<fs.StatFs\>](/ja/nodejs/api/fs#class-fsstatfs)オブジェクトで履行されます。

### `fsPromises.symlink(target, path[, type])` {#fspromisessymlinktarget-path-type}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | `type`引数が`null`または省略された場合、Node.jsは`target`の型を自動検出し、自動的に`dir`または`file`を選択します。 |
| v10.0.0 | Added in: v10.0.0 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **既定:** `null`
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に`undefined`で履行されます。

シンボリックリンクを作成します。

`type`引数は、Windowsプラットフォームでのみ使用され、`'dir'`、`'file'`、または`'junction'`のいずれかになります。 `type`引数が`null`の場合、Node.jsは`target`の型を自動検出し、`'file'`または`'dir'`を使用します。 `target`が存在しない場合は、`'file'`が使用されます。 Windowsのジャンクションポイントでは、宛先パスが絶対パスである必要があります。 `'junction'`を使用すると、`target`引数は自動的に絶対パスに正規化されます。 NTFSボリューム上のジャンクションポイントは、ディレクトリのみを指すことができます。


### `fsPromises.truncate(path[, len])` {#fspromisestruncatepath-len}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0`
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に `undefined` で履行します。

`path` にあるコンテンツを `len` バイトに切り捨て（短縮または拡張）します。

### `fsPromises.unlink(path)` {#fspromisesunlinkpath}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に `undefined` で履行します。

`path` がシンボリックリンクを参照する場合、そのリンクが参照するファイルまたはディレクトリに影響を与えることなく、リンクが削除されます。`path` がシンボリックリンクではないファイルパスを参照する場合、ファイルは削除されます。詳細については、POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) のドキュメントを参照してください。

### `fsPromises.utimes(path, atime, mtime)` {#fspromisesutimespath-atime-mtime}

**Added in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に `undefined` で履行します。

`path` によって参照されるオブジェクトのファイルシステムのタイムスタンプを変更します。

`atime` と `mtime` 引数は以下のルールに従います。

- 値は、Unixエポック時間を表す数値、`Date`、または `'123456789.0'` のような数値文字列のいずれかです。
- 値が数値に変換できない場合、または `NaN`、`Infinity`、`-Infinity` の場合、`Error` がスローされます。


### `fsPromises.watch(filename[, options])` {#fspromiseswatchfilename-options}

**追加:** v15.9.0, v14.18.0

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ファイルが監視されている間、プロセスが実行を継続するかどうかを示します。**デフォルト:** `true`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) すべてのサブディレクトリを監視するか、現在のディレクトリのみを監視するかを示します。 これはディレクトリが指定された場合に適用され、サポートされているプラットフォームでのみ適用されます([注意点](/ja/nodejs/api/fs#caveats)を参照)。**デフォルト:** `false`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リスナーに渡されるファイル名に使用される文字エンコーディングを指定します。**デフォルト:** `'utf8'`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) ウォッチャーを停止するタイミングを知らせるために使用される[\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)。
  
 
- 戻り値: プロパティを持つオブジェクトの[\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface):
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 変更の種類
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 変更されたファイルの名前。
  
 

`filename`の変更を監視する非同期イテレーターを返します。`filename`はファイルまたはディレクトリです。

```js [ESM]
const { watch } = require('node:fs/promises');

const ac = new AbortController();
const { signal } = ac;
setTimeout(() => ac.abort(), 10000);

(async () => {
  try {
    const watcher = watch(__filename, { signal });
    for await (const event of watcher)
      console.log(event);
  } catch (err) {
    if (err.name === 'AbortError')
      return;
    throw err;
  }
})();
```
ほとんどのプラットフォームでは、ディレクトリにファイル名が表示または消滅するたびに`'rename'`が出力されます。

`fs.watch()`の[注意点](/ja/nodejs/api/fs#caveats)はすべて`fsPromises.watch()`にも適用されます。


### `fsPromises.writeFile(file, data[, options])` {#fspromiseswritefilefile-data-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v21.0.0, v20.10.0 | `flush`オプションがサポートされるようになりました。 |
| v15.14.0, v14.18.0 | `data`引数は、`AsyncIterable`、`Iterable`、および`Stream`をサポートします。 |
| v15.2.0, v14.17.0 | options 引数には、進行中の writeFile リクエストを中断するための AbortSignal を含めることができます。 |
| v14.0.0 | `data`パラメータは、サポートされていない入力を文字列に強制変換しなくなりました。 |
| v10.0.0 | Added in: v10.0.0 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle) ファイル名 または `FileHandle`
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/ja/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ファイルシステムの`flags`のサポート](/ja/nodejs/api/fs#file-system-flags)を参照してください。 **デフォルト:** `'w'`。
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) すべてのデータがファイルに正常に書き込まれ、`flush`が`true`の場合、`filehandle.sync()`を使用してデータをフラッシュします。 **デフォルト:** `false`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中の writeFile を中止できます
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功すると `undefined` で履行される Promise。

非同期的にファイルにデータを書き込み、ファイルが既に存在する場合はファイルを置き換えます。`data`は、文字列、バッファー、[\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)、または[\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)オブジェクトにすることができます。

`data`がバッファーの場合、`encoding`オプションは無視されます。

`options`が文字列の場合、エンコーディングを指定します。

`mode`オプションは、新しく作成されたファイルにのみ影響します。詳細については、[`fs.open()`](/ja/nodejs/api/fs#fsopenpath-flags-mode-callback)を参照してください。

指定された[\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle)は書き込みをサポートする必要があります。

Promise が解決されるのを待たずに、同じファイルで `fsPromises.writeFile()` を複数回使用するのは安全ではありません。

`fsPromises.readFile`と同様に、`fsPromises.writeFile`は、渡されたバッファーを書き込むために内部で複数の`write`呼び出しを実行する便利なメソッドです。パフォーマンスが重要なコードの場合は、[`fs.createWriteStream()`](/ja/nodejs/api/fs#fscreatewritestreampath-options)または[`filehandle.createWriteStream()`](/ja/nodejs/api/fs#filehandlecreatewritestreamoptions)の使用を検討してください。

[\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)を使用して`fsPromises.writeFile()`をキャンセルできます。キャンセルは「ベストエフォート」であり、ある程度のデータが書き込まれる可能性が高くなります。

```js [ESM]
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });

  // Promise が解決される前にリクエストを中止します。
  controller.abort();

  await promise;
} catch (err) {
  // リクエストが中止されると、err は AbortError になります
  console.error(err);
}
```
進行中のリクエストを中止しても、個々のオペレーティングシステムのリクエストは中止されませんが、内部バッファリング`fs.writeFile`が実行されます。


### `fsPromises.constants` {#fspromisesconstants}

**Added in: v18.4.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

ファイルシステム操作で一般的に使用される定数を含むオブジェクトを返します。このオブジェクトは `fs.constants` と同じです。詳細については、[FS 定数](/ja/nodejs/api/fs#fs-constants)を参照してください。

## コールバック API {#callback-api}

コールバック API は、イベントループをブロックせずに、すべての操作を非同期的に実行し、完了またはエラー時にコールバック関数を呼び出します。

コールバック API は、基盤となる Node.js スレッドプールを使用して、イベントループスレッドからファイルシステム操作を実行します。これらの操作は同期化されておらず、スレッドセーフではありません。同じファイルに対して複数の同時変更を行う場合は注意が必要で、データが破損する可能性があります。

### `fs.access(path[, mode], callback)` {#fsaccesspath-mode-callback}

::: info [履歴]
| Version | Changes |
| --- | --- |
| v20.8.0 | `fs` に直接存在していた定数 `fs.F_OK`、`fs.R_OK`、`fs.W_OK` および `fs.X_OK` は非推奨になりました。 |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_ARG_TYPE` が `ERR_INVALID_CALLBACK` の代わりにスローされるようになりました。 |
| v7.6.0 | `path` パラメータは `file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v6.3.0 | `fs` に直接存在していた `fs.R_OK` などの定数は、ソフト非推奨として `fs.constants` に移動されました。したがって、Node.js `\< v6.3.0` では、これらの定数にアクセスするには `fs` を使用するか、`fs.constants || fs).R_OK` のようにしてすべてのバージョンで動作するようにします。 |
| v0.11.15 | Added in: v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `fs.constants.F_OK`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`path` で指定されたファイルまたはディレクトリに対するユーザーの権限をテストします。 `mode` 引数は、実行されるアクセシビリティチェックを指定するオプションの整数です。 `mode` は、値 `fs.constants.F_OK` 、または `fs.constants.R_OK`、`fs.constants.W_OK`、および `fs.constants.X_OK` のビット単位の OR で構成されるマスクのいずれかである必要があります（例：`fs.constants.W_OK | fs.constants.R_OK`）。 `mode` の可能な値については、[ファイルアクセス定数](/ja/nodejs/api/fs#file-access-constants)を確認してください。

最後の引数である `callback` は、エラー引数と共に呼び出されるコールバック関数です。アクセシビリティチェックのいずれかが失敗した場合、エラー引数は `Error` オブジェクトになります。次の例では、`package.json` が存在するかどうか、および読み取り可能または書き込み可能かどうかを確認します。

```js [ESM]
import { access, constants } from 'node:fs';

const file = 'package.json';

// 現在のディレクトリにファイルが存在するかどうかを確認します。
access(file, constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
});

// ファイルが読み取り可能かどうかを確認します。
access(file, constants.R_OK, (err) => {
  console.log(`${file} ${err ? 'is not readable' : 'is readable'}`);
});

// ファイルが書き込み可能かどうかを確認します。
access(file, constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'is not writable' : 'is writable'}`);
});

// ファイルが読み取り可能で書き込み可能かどうかを確認します。
access(file, constants.R_OK | constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'is not' : 'is'} readable and writable`);
});
```

`fs.open()`、`fs.readFile()`、または `fs.writeFile()` を呼び出す前に、`fs.access()` を使用してファイルのアクセシビリティを確認しないでください。そうすると、2つの呼び出しの間に他のプロセスがファイルの状態を変更する可能性があるため、競合状態が発生します。代わりに、ユーザーコードはファイルを直接開く/読み取る/書き込む必要があり、ファイルにアクセスできない場合に発生するエラーを処理する必要があります。

**書き込み (推奨されません)**

```js [ESM]
import { access, open, close } from 'node:fs';

access('myfile', (err) => {
  if (!err) {
    console.error('myfile already exists');
    return;
  }

  open('myfile', 'wx', (err, fd) => {
    if (err) throw err;

    try {
      writeMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```

**書き込み (推奨)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```

**読み込み (推奨されません)**

```js [ESM]
import { access, open, close } from 'node:fs';
access('myfile', (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  open('myfile', 'r', (err, fd) => {
    if (err) throw err;

    try {
      readMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```

**読み込み (推奨)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```

上記の「推奨されない」例では、アクセシビリティを確認してからファイルを使用します。「推奨される」例は、ファイルを直接使用し、エラーがあれば処理するため、より優れています。

一般に、ファイルのアクセシビリティは、ファイルが直接使用されない場合にのみ確認してください。たとえば、そのアクセシビリティが別のプロセスからのシグナルである場合などです。

Windows では、ディレクトリのアクセス制御ポリシー (ACL) によって、ファイルまたはディレクトリへのアクセスが制限される場合があります。 ただし、`fs.access()` 関数は ACL をチェックしないため、ACL によってユーザーがファイルを読み書きすることが制限されている場合でも、パスがアクセス可能であると報告する場合があります。


### `fs.appendFile(path, data[, options], callback)` {#fsappendfilepath-data-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v21.1.0, v20.10.0 | `flush` オプションがサポートされるようになりました。 |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`の代わりに`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v10.0.0 | `callback` パラメータはオプションではなくなりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.0.0 | `callback` パラメータはオプションではなくなりました。渡さないと、ID DEP0013 の非推奨警告が表示されます。 |
| v7.0.0 | 渡された `options` オブジェクトは変更されなくなります。 |
| v5.0.0 | `file` パラメータはファイル記述子を指定できるようになりました。 |
| v0.6.7 | Added in: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイル名またはファイル記述子
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ファイルシステムの `flags` のサポート](/ja/nodejs/api/fs#file-system-flags)を参照してください。 **デフォルト:** `'a'`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、基になるファイル記述子は閉じられる前にフラッシュされます。 **デフォルト:** `false`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)


データをファイルに非同期的に追加します。ファイルが存在しない場合は作成されます。 `data` には、文字列または [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) を指定できます。

`mode` オプションは、新しく作成されたファイルにのみ影響します。詳細については、[`fs.open()`](/ja/nodejs/api/fs#fsopenpath-flags-mode-callback)を参照してください。

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
```
`options` が文字列の場合、エンコーディングを指定します。

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', 'utf8', callback);
```
`path` は、追加用にオープンされた数値ファイル記述子として指定できます（`fs.open()` または `fs.openSync()` を使用）。ファイル記述子は自動的に閉じられません。

```js [ESM]
import { open, close, appendFile } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('message.txt', 'a', (err, fd) => {
  if (err) throw err;

  try {
    appendFile(fd, 'data to append', 'utf8', (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```

### `fs.chmod(path, mode, callback)` {#fschmodpath-mode-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.0.0 | `callback` パラメーターはオプションではなくなりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.6.0 | `path` パラメーターは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v7.0.0 | `callback` パラメーターはオプションではなくなりました。渡さないと、ID DEP0013 で非推奨の警告が表示されます。 |
| v0.1.30 | 追加: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

ファイルの権限を非同期的に変更します。 完了コールバックには、例外が発生した場合を除き、引数は渡されません。

詳細については、POSIX の [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) ドキュメントを参照してください。

```js [ESM]
import { chmod } from 'node:fs';

chmod('my_file.txt', 0o775, (err) => {
  if (err) throw err;
  console.log('The permissions for file "my_file.txt" have been changed!');
});
```

#### ファイルモード {#file-modes}

`fs.chmod()` および `fs.chmodSync()` メソッドの両方で使用される `mode` 引数は、次の定数の論理 OR を使用して作成された数値ビットマスクです。

| 定数 | 8進数 | 説明 |
| --- | --- | --- |
| `fs.constants.S_IRUSR` | `0o400` | 所有者による読み取り |
| `fs.constants.S_IWUSR` | `0o200` | 所有者による書き込み |
| `fs.constants.S_IXUSR` | `0o100` | 所有者による実行/検索 |
| `fs.constants.S_IRGRP` | `0o40` | グループによる読み取り |
| `fs.constants.S_IWGRP` | `0o20` | グループによる書き込み |
| `fs.constants.S_IXGRP` | `0o10` | グループによる実行/検索 |
| `fs.constants.S_IROTH` | `0o4` | 他者による読み取り |
| `fs.constants.S_IWOTH` | `0o2` | 他者による書き込み |
| `fs.constants.S_IXOTH` | `0o1` | 他者による実行/検索 |

`mode` を構築するより簡単な方法は、3 桁の 8 進数 (例: `765`) のシーケンスを使用することです。 一番左の桁 (例では `7`) は、ファイル所有者の権限を指定します。 真ん中の桁 (例では `6`) は、グループの権限を指定します。 一番右の桁 (例では `5`) は、他のユーザーの権限を指定します。

| 番号 | 説明 |
| --- | --- |
| `7` | 読み取り、書き込み、実行 |
| `6` | 読み取りと書き込み |
| `5` | 読み取りと実行 |
| `4` | 読み取り専用 |
| `3` | 書き込みと実行 |
| `2` | 書き込み専用 |
| `1` | 実行のみ |
| `0` | 権限なし |

たとえば、8 進数値 `0o765` は次の意味を持ちます。

- 所有者は、ファイルを読み取り、書き込み、実行できます。
- グループは、ファイルを読み書きできます。
- 他のユーザーは、ファイルを読み取り、実行できます。

ファイルモードが想定される場所で生の数値を使用する場合、`0o777` より大きい値を使用すると、一貫して動作するようにサポートされていないプラットフォーム固有の動作が発生する可能性があります。 したがって、`S_ISVTX`、`S_ISGID`、または `S_ISUID` のような定数は、`fs.constants` で公開されていません。

注意点: Windows では、書き込み権限のみを変更でき、グループ、所有者、または他のユーザーの権限の区別は実装されていません。


### `fs.chown(path, uid, gid, callback)` {#fschownpath-uid-gid-callback}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと実行時に `TypeError` がスローされます。 |
| v7.6.0 | `path` パラメーターは `file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v7.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと、id DEP0013 の非推奨警告が出力されます。 |
| v0.1.97 | 追加: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

ファイルの所有者とグループを非同期的に変更します。完了コールバックには、考えられる例外以外の引数は与えられません。

詳細については、POSIX の [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) のドキュメントを参照してください。

### `fs.close(fd[, callback])` {#fsclosefd-callback}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v15.9.0, v14.17.0 | コールバックが提供されない場合、デフォルトのコールバックが使用されるようになりました。 |
| v10.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと実行時に `TypeError` がスローされます。 |
| v7.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと、id DEP0013 の非推奨警告が出力されます。 |
| v0.0.2 | 追加: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

ファイルディスクリプターを閉じます。完了コールバックには、考えられる例外以外の引数は与えられません。

他の `fs` 操作を通じて現在使用中のファイルディスクリプター (`fd`) に対して `fs.close()` を呼び出すと、未定義の動作につながる可能性があります。

詳細については、POSIX の [`close(2)`](http://man7.org/linux/man-pages/man2/close.2) のドキュメントを参照してください。


### `fs.copyFile(src, dest[, mode], callback)` {#fscopyfilesrc-dest-mode-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v14.0.0 | `flags` 引数を `mode` に変更し、より厳密な型検証を課しました。 |
| v8.5.0 | 追加: v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) コピー元のファイル名
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) コピー先のファイル名
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) コピー操作の修飾子。**デフォルト:** `0`。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

`src` を `dest` に非同期的にコピーします。 デフォルトでは、`dest` が既に存在する場合、上書きされます。 コールバック関数には、例外が発生した場合を除き、引数は渡されません。 Node.js は、コピー操作のアトミシティを保証しません。 書き込みのためにコピー先のファイルが開かれた後にエラーが発生した場合、Node.js はコピー先の削除を試みます。

`mode` は、コピー操作の動作を指定するオプションの整数です。 2つ以上の値のビット単位の OR で構成されるマスクを作成できます (例: `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`)。

- `fs.constants.COPYFILE_EXCL`: `dest` が既に存在する場合、コピー操作は失敗します。
- `fs.constants.COPYFILE_FICLONE`: コピー操作は、copy-on-write reflink の作成を試みます。 プラットフォームが copy-on-write をサポートしていない場合、フォールバック コピー メカニズムが使用されます。
- `fs.constants.COPYFILE_FICLONE_FORCE`: コピー操作は、copy-on-write reflink の作成を試みます。 プラットフォームが copy-on-write をサポートしていない場合、操作は失敗します。

```js [ESM]
import { copyFile, constants } from 'node:fs';

function callback(err) {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
}

// destination.txt will be created or overwritten by default.
copyFile('source.txt', 'destination.txt', callback);

// By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL, callback);
```

### `fs.cp(src, dest[, options], callback)` {#fscpsrc-dest-options-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.3.0 | この API は実験的ではなくなりました。 |
| v20.1.0, v18.17.0 | `fs.copyFile()` の `mode` 引数としてコピーの動作を指定するための追加の `mode` オプションを受け入れます。 |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v17.6.0, v16.15.0 | シンボリックリンクのパス解決を実行するかどうかを指定するための追加の `verbatimSymlinks` オプションを受け入れます。 |
| v16.7.0 | Added in: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) コピー元のソースパス。
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) コピー先の宛先パス。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) シンボリックリンクの参照を解決します。 **デフォルト:** `false`。
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `force` が `false` で、宛先が存在する場合、エラーをスローします。 **デフォルト:** `false`。
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) コピーされたファイル/ディレクトリをフィルタリングする関数。 アイテムをコピーするには `true` を、無視するには `false` を返します。 ディレクトリを無視すると、その内容もすべてスキップされます。 `true` または `false` に解決される `Promise` を返すこともできます。 **デフォルト:** `undefined`。
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コピー元のソースパス。
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コピー先の宛先パス。
    - 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) `boolean` に強制変換可能な値、またはそのような値で完了する `Promise`。

    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 既存のファイルまたはディレクトリを上書きします。 これを false に設定して宛先が存在する場合、コピー操作はエラーを無視します。 この動作を変更するには `errorOnExist` オプションを使用します。 **デフォルト:** `true`。
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) コピー操作の修飾子。 **デフォルト:** `0`。 [`fs.copyFile()`](/ja/nodejs/api/fs#fscopyfilesrc-dest-mode-callback) の `mode` フラグを参照してください。
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`src` からのタイムスタンプが保持されます。 **デフォルト:** `false`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ディレクトリを再帰的にコピーします **デフォルト:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、シンボリックリンクのパス解決はスキップされます。 **デフォルト:** `false`

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

ディレクトリ構造全体を `src` から `dest` に非同期でコピーします。サブディレクトリとファイルを含みます。

ディレクトリを別のディレクトリにコピーする場合、グロブはサポートされず、動作は `cp dir1/ dir2/` と似ています。


### `fs.createReadStream(path[, options])` {#fscreatereadstreampath-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v16.10.0 | `fd` が提供された場合、`fs` オプションは `open` メソッドを必要としません。 |
| v16.10.0 | `autoClose` が `false` の場合、`fs` オプションは `close` メソッドを必要としません。 |
| v15.5.0 | `AbortSignal` のサポートを追加。 |
| v15.4.0 | `fd` オプションは FileHandle 引数を受け入れます。 |
| v14.0.0 | `emitClose` のデフォルトを `true` に変更。 |
| v13.6.0, v12.17.0 | `fs` オプションにより、使用される `fs` 実装をオーバーライドできます。 |
| v12.10.0 | `emitClose` オプションを有効化。 |
| v11.0.0 | `start` および `end` に新しい制限を課し、入力値を適切に処理できない場合に、より適切なエラーをスローします。 |
| v7.6.0 | `path` パラメータは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v7.0.0 | 渡された `options` オブジェクトは変更されません。 |
| v2.3.0 | 渡された `options` オブジェクトは文字列にできます。 |
| v0.1.31 | Added in: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ファイルシステムの `flags` のサポート](/ja/nodejs/api/fs#file-system-flags)を参照してください。 **デフォルト:** `'r'`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `null`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle) **デフォルト:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `64 * 1024`
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `null`
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `null`

- 戻り値: [\<fs.ReadStream\>](/ja/nodejs/api/fs#class-fsreadstream)

`options` には、ファイル全体ではなく、ファイルのバイト範囲を読み取るための `start` および `end` の値を含めることができます。`start` と `end` は両方とも包括的で、0 からカウントを開始し、許可される値は [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)] の範囲です。`fd` が指定され、`start` が省略されているか `undefined` の場合、`fs.createReadStream()` は現在のファイル位置から順番に読み取ります。`encoding` は、[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) で受け入れられるもののいずれかです。

`fd` が指定されている場合、`ReadStream` は `path` 引数を無視し、指定されたファイル記述子を使用します。これは、`'open'` イベントが発行されないことを意味します。`fd` はブロッキングである必要があります。ノンブロッキング `fd` は、[\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) に渡す必要があります。

`fd` が（キーボードやサウンドカードなどの）ブロッキング読み取りのみをサポートする文字デバイスを指している場合、データが利用可能になるまで読み取り操作は完了しません。これにより、プロセスが終了できず、ストリームが自然に閉じることができなくなる可能性があります。

デフォルトでは、ストリームは破棄された後に `'close'` イベントを発行します。この動作を変更するには、`emitClose` オプションを `false` に設定します。

`fs` オプションを提供することで、`open`、`read`、および `close` の対応する `fs` 実装をオーバーライドできます。`fs` オプションを提供する場合、`read` のオーバーライドが必要です。`fd` が提供されていない場合は、`open` のオーバーライドも必要です。`autoClose` が `true` の場合、`close` のオーバーライドも必要です。

```js [ESM]
import { createReadStream } from 'node:fs';

// いくつかの文字デバイスからストリームを作成します。
const stream = createReadStream('/dev/input/event0');
setTimeout(() => {
  stream.close(); // これはストリームを閉じない可能性があります。
  // 基になるリソースがファイル終端をそれ自体で示したかのように、
  // 人工的にストリームの終端をマークすると、ストリームを閉じることができます。
  // これは保留中の読み取り操作をキャンセルしません。そのような操作がある場合、
  // 処理が完了するまで、プロセスは正常に終了できない可能性があります。
  stream.push(null);
  stream.read(0);
}, 100);
```
`autoClose` が false の場合、エラーが発生した場合でもファイル記述子は閉じられません。それを閉じて、ファイル記述子のリークがないことを確認するのは、アプリケーションの責任です。`autoClose` が true （デフォルトの動作）に設定されている場合、`'error'` または `'end'` でファイル記述子は自動的に閉じられます。

`mode` はファイルモード（許可とスティッキービット）を設定しますが、ファイルが作成された場合に限ります。

100 バイトのファイルの最後の 10 バイトを読み取る例：

```js [ESM]
import { createReadStream } from 'node:fs';

createReadStream('sample.txt', { start: 90, end: 99 });
```
`options` が文字列の場合、それはエンコーディングを指定します。


### `fs.createWriteStream(path[, options])` {#fscreatewritestreampath-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0, v20.10.0 | `flush` オプションがサポートされるようになりました。 |
| v16.10.0 | `fd` が提供されている場合、`fs` オプションは `open` メソッドを必要としません。 |
| v16.10.0 | `autoClose` が `false` の場合、`fs` オプションは `close` メソッドを必要としません。 |
| v15.5.0 | `AbortSignal` のサポートを追加しました。 |
| v15.4.0 | `fd` オプションは FileHandle 引数を受け入れます。 |
| v14.0.0 | `emitClose` のデフォルトを `true` に変更します。 |
| v13.6.0, v12.17.0 | `fs` オプションで、使用する `fs` 実装をオーバーライドできます。 |
| v12.10.0 | `emitClose` オプションを有効にします。 |
| v7.6.0 | `path` パラメーターは `file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v7.0.0 | 渡された `options` オブジェクトは変更されません。 |
| v5.5.0 | `autoClose` オプションがサポートされるようになりました。 |
| v2.3.0 | 渡された `options` オブジェクトは文字列にできます。 |
| v0.1.31 | Added in: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ファイルシステム `flags` のサポート](/ja/nodejs/api/fs#file-system-flags)を参照してください。 **デフォルト:** `'w'`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `'utf8'`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle) **デフォルト:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `null`
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `null`
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、基になるファイル記述子は、閉じる前にフラッシュされます。 **デフォルト:** `false`。
  
 
- 戻り値: [\<fs.WriteStream\>](/ja/nodejs/api/fs#class-fswritestream)

`options` には、ファイルの先頭を越えた位置にデータを書き込めるようにする `start` オプションを含めることもできます。許可される値は [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)] の範囲です。ファイルを置き換えるのではなく変更するには、`flags` オプションをデフォルトの `w` ではなく `r+` に設定する必要がある場合があります。`encoding` は、[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) で受け入れられるもののいずれかになります。

`autoClose` が true (デフォルトの動作) に設定されている場合、`'error'` または `'finish'` でファイル記述子が自動的に閉じられます。 `autoClose` が false の場合、エラーが発生した場合でもファイル記述子は閉じられません。それを閉じて、ファイル記述子のリークがないことを確認するのはアプリケーションの責任です。

デフォルトでは、ストリームは破棄された後に `'close'` イベントを発生させます。この動作を変更するには、`emitClose` オプションを `false` に設定します。

`fs` オプションを指定することで、`open`、`write`、`writev`、および `close` に対応する `fs` 実装をオーバーライドできます。`write()` を `writev()` なしでオーバーライドすると、一部の最適化 (`_writev()`) が無効になるため、パフォーマンスが低下する可能性があります。`fs` オプションを指定する場合、`write` と `writev` の少なくとも 1 つのオーバーライドが必要です。`fd` オプションが指定されていない場合は、`open` のオーバーライドも必要です。`autoClose` が `true` の場合は、`close` のオーバーライドも必要です。

[\<fs.ReadStream\>](/ja/nodejs/api/fs#class-fsreadstream) と同様に、`fd` が指定されている場合、[\<fs.WriteStream\>](/ja/nodejs/api/fs#class-fswritestream) は `path` 引数を無視し、指定されたファイル記述子を使用します。これは、`'open'` イベントが発生しないことを意味します。`fd` はブロッキングである必要があります。ノンブロッキング `fd` は [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket) に渡す必要があります。

`options` が文字列の場合、エンコーディングを指定します。


### `fs.exists(path, callback)` {#fsexistspath-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v7.6.0 | `path` パラメータは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v1.0.0 | 非推奨: v1.0.0 以降 |
| v0.0.2 | v0.0.2 で追加 |
:::

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定性: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに [`fs.stat()`](/ja/nodejs/api/fs#fsstatpath-options-callback) または [`fs.access()`](/ja/nodejs/api/fs#fsaccesspath-mode-callback) を使用してください。
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `exists` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

指定された `path` にある要素がファイルシステムに存在するかどうかをテストします。 次に、`true` または `false` のいずれかで `callback` 引数を呼び出します。

```js [ESM]
import { exists } from 'node:fs';

exists('/etc/passwd', (e) => {
  console.log(e ? 'it exists' : 'no passwd!');
});
```
**このコールバックのパラメータは、他の Node.js コールバックと一貫性がありません。** 通常、Node.js コールバックの最初のパラメータは `err` パラメータであり、オプションで他のパラメータが続きます。 `fs.exists()` コールバックには、ブール値のパラメータが 1 つしかありません。 これが、`fs.exists()` の代わりに `fs.access()` が推奨される理由の 1 つです。

`path` がシンボリックリンクの場合、追跡されます。 したがって、`path` が存在しても、存在しない要素を指している場合、コールバックは値 `false` を受け取ります。

`fs.exists()` を使用して、`fs.open()`、`fs.readFile()`、または `fs.writeFile()` を呼び出す前にファイルの存在を確認することはお勧めできません。 そうすると、他のプロセスが 2 回の呼び出しの間にファイルの状態を変更する可能性があるため、競合状態が発生します。 代わりに、ユーザーコードはファイルを直接開く/読み取る/書き込む必要があり、ファイルが存在しない場合に発生するエラーを処理する必要があります。

**書き込み (非推奨)**

```js [ESM]
import { exists, open, close } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    console.error('myfile already exists');
  } else {
    open('myfile', 'wx', (err, fd) => {
      if (err) throw err;

      try {
        writeMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  }
});
```
**書き込み (推奨)**

```js [ESM]
import { open, close } from 'node:fs';
open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**読み込み (非推奨)**

```js [ESM]
import { open, close, exists } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    open('myfile', 'r', (err, fd) => {
      if (err) throw err;

      try {
        readMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  } else {
    console.error('myfile does not exist');
  }
});
```
**読み込み (推奨)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
上記の「非推奨」の例では、存在を確認してからファイルを使用します。 「推奨」の例は、ファイルを直接使用し、エラーがある場合はそれを処理するため、より優れています。

一般に、ファイルの存在は、別のプロセスからのシグナルである場合など、ファイルが直接使用されない場合にのみ確認してください。


### `fs.fchmod(fd, mode, callback)` {#fsfchmodfd-mode-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.0.0 | `callback` パラメーターは必須になりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと、ID DEP0013 で非推奨警告が発生します。 |
| v0.4.7 | Added in: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

ファイルの権限を設定します。完了コールバックには、例外が発生した場合を除き、引数は渡されません。

詳細については、POSIX の [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) ドキュメントを参照してください。

### `fs.fchown(fd, uid, gid, callback)` {#fsfchownfd-uid-gid-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.0.0 | `callback` パラメーターは必須になりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと、ID DEP0013 で非推奨警告が発生します。 |
| v0.4.7 | Added in: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

ファイルの所有者を設定します。完了コールバックには、例外が発生した場合を除き、引数は渡されません。

詳細については、POSIX の [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) ドキュメントを参照してください。


### `fs.fdatasync(fd, callback)` {#fsfdatasyncfd-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.0.0 | `callback` パラメータは必須ではなくなりました。渡さないと実行時に `TypeError` がスローされます。 |
| v7.0.0 | `callback` パラメータは必須ではなくなりました。渡さないと ID DEP0013 の非推奨警告が出力されます。 |
| v0.1.96 | Added in: v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

ファイルに関連付けられている現在キューに入っているすべての I/O 操作を、オペレーティングシステムの同期 I/O 完了状態に強制します。詳細については、POSIX の [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) ドキュメントを参照してください。完了コールバックには、起こりうる例外以外の引数は与えられません。

### `fs.fstat(fd[, options], callback)` {#fsfstatfd-options-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.5.0 | 返される数値が bigint であるかどうかを指定するための追加の `options` オブジェクトを受け入れます。 |
| v10.0.0 | `callback` パラメータは必須ではなくなりました。渡さないと実行時に `TypeError` がスローされます。 |
| v7.0.0 | `callback` パラメータは必須ではなくなりました。渡さないと ID DEP0013 の非推奨警告が出力されます。 |
| v0.1.95 | Added in: v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返される [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトの数値が `bigint` であるかどうか。**Default:** `false`.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats)

ファイル記述子の [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) を持つコールバックを呼び出します。

詳細については、POSIX の [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2) ドキュメントを参照してください。


### `fs.fsync(fd, callback)` {#fsfsyncfd-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと、ID DEP0013 の非推奨警告が発生します。 |
| v0.1.96 | 追加: v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

開いているファイル記述子に関するすべてのデータをストレージデバイスにフラッシュすることを要求します。具体的な実装は、オペレーティングシステムとデバイスに固有です。詳細については、POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) のドキュメントを参照してください。完了コールバックには、例外が発生した場合を除き、引数は渡されません。

### `fs.ftruncate(fd[, len], callback)` {#fsftruncatefd-len-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと、ID DEP0013 の非推奨警告が発生します。 |
| v0.8.6 | 追加: v0.8.6 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

ファイル記述子を切り詰めます。完了コールバックには、例外が発生した場合を除き、引数は渡されません。

詳細については、POSIX [`ftruncate(2)`](http://man7.org/linux/man-pages/man2/ftruncate.2) のドキュメントを参照してください。

ファイル記述子が参照するファイルが `len` バイトより大きい場合、ファイルの最初の `len` バイトのみが保持されます。

たとえば、次のプログラムはファイルの最初の 4 バイトのみを保持します。

```js [ESM]
import { open, close, ftruncate } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('temp.txt', 'r+', (err, fd) => {
  if (err) throw err;

  try {
    ftruncate(fd, 4, (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    if (err) throw err;
  }
});
```
ファイルが以前に `len` バイトより短い場合、拡張され、拡張された部分は NULL バイト (`'\0'`) で埋められます。

`len` が負の場合、`0` が使用されます。


### `fs.futimes(fd, atime, mtime, callback)` {#fsfutimesfd-atime-mtime-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと、id DEP0013 の非推奨警告が発生します。 |
| v4.1.0 | 数値文字列、`NaN`、および `Infinity` が時間指定子として許可されるようになりました。 |
| v0.4.2 | Added in: v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

指定されたファイル記述子が参照するオブジェクトのファイルシステムのタイムスタンプを変更します。[`fs.utimes()`](/ja/nodejs/api/fs#fsutimespath-atime-mtime-callback)を参照してください。

### `fs.glob(pattern[, options], callback)` {#fsglobpattern-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.2.0 | `withFileTypes` のオプションとしてのサポートを追加しました。 |
| v22.0.0 | Added in: v22.0.0 |
:::

::: warning [安定性: 1 - 試験的]
[安定性: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 現在の作業ディレクトリ。 **Default:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) ファイル/ディレクトリを除外する関数。アイテムを除外するには `true`、含めるには `false` を返します。 **Default:** `undefined`。
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) glob がパスを Dirent として返す場合は `true`、そうでない場合は `false`。 **Default:** `false`。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

- 指定されたパターンに一致するファイルを取得します。

::: code-group
```js [ESM]
import { glob } from 'node:fs';

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```

```js [CJS]
const { glob } = require('node:fs');

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```
:::


### `fs.lchmod(path, mode, callback)` {#fslchmodpath-mode-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v16.0.0 | 返されるエラーは、複数のエラーが返される場合は `AggregateError` になる場合があります。 |
| v10.0.0 | `callback` パラメーターはオプションではなくなりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.0.0 | `callback` パラメーターはオプションではなくなりました。渡さないと、id DEP0013 の非推奨警告が出力されます。 |
| v0.4.7 | 非推奨: v0.4.7 以降 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

シンボリックリンクの権限を変更します。完了コールバックには、例外を除いて引数は渡されません。

このメソッドは macOS でのみ実装されています。

詳細については、POSIX の [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2) ドキュメントを参照してください。

### `fs.lchown(path, uid, gid, callback)` {#fslchownpath-uid-gid-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.6.0 | この API は非推奨ではなくなりました。 |
| v10.0.0 | `callback` パラメーターはオプションではなくなりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.0.0 | `callback` パラメーターはオプションではなくなりました。渡さないと、id DEP0013 の非推奨警告が出力されます。 |
| v0.4.7 | ドキュメントのみの非推奨。 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

シンボリックリンクの所有者を設定します。完了コールバックには、例外を除いて引数は渡されません。

詳細については、POSIX の [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) ドキュメントを参照してください。


### `fs.lutimes(path, atime, mtime, callback)` {#fslutimespath-atime-mtime-callback}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v14.5.0, v12.19.0 | 追加: v14.5.0, v12.19.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`fs.utimes()`](/ja/nodejs/api/fs#fsutimespath-atime-mtime-callback) と同じ方法でファイルのアクセス時間と修正時間を変更しますが、パスがシンボリックリンクを参照する場合、リンクは間接参照されず、代わりにシンボリックリンク自体のタイムスタンプが変更される点が異なります。

完了時のコールバックには、例外が発生した場合を除き、引数は与えられません。

### `fs.link(existingPath, newPath, callback)` {#fslinkexistingpath-newpath-callback}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.6.0 | `existingPath` および `newPath` パラメーターは、`file:` プロトコルを使用した WHATWG `URL` オブジェクトにすることができます。現在、サポートはまだ *実験的* です。 |
| v7.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと、id DEP0013 で非推奨の警告が出力されます。 |
| v0.1.31 | 追加: v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`existingPath` から `newPath` への新しいリンクを作成します。詳細については、POSIX の [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) のドキュメントを参照してください。完了時のコールバックには、例外が発生した場合を除き、引数は与えられません。


### `fs.lstat(path[, options], callback)` {#fslstatpath-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.5.0 | 返される数値が bigint であるかどうかを指定するために、追加の `options` オブジェクトを受け入れるようになりました。 |
| v10.0.0 | `callback` パラメーターは必須になりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.6.0 | `path` パラメーターは、`file:` プロトコルを使用した WHATWG `URL` オブジェクトにすることができます。 |
| v7.0.0 | `callback` パラメーターは必須になりました。渡さないと、ID DEP0013 で非推奨の警告が表示されます。 |
| v0.1.30 | Added in: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返される [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトの数値が `bigint` であるかどうか。**デフォルト:** `false`。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats)

パスが参照するシンボリックリンクの [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) を取得します。コールバックは 2 つの引数 `(err, stats)` を取得します。`stats` は [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトです。`lstat()` は `stat()` と同じですが、`path` がシンボリックリンクの場合、参照先のファイルではなく、リンク自体が stat される点が異なります。

詳細については、POSIX の [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) ドキュメントを参照してください。


### `fs.mkdir(path[, options], callback)` {#fsmkdirpath-options-callback}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v13.11.0, v12.17.0 | `recursive`モードでは、コールバックは最初に作成されたパスを引数として受け取るようになりました。 |
| v10.12.0 | 2番目の引数は、`recursive`と`mode`プロパティを持つ`options`オブジェクトにすることができます。 |
| v10.0.0 | `callback`パラメータは必須になりました。渡さないと、実行時に`TypeError`がスローされます。 |
| v7.6.0 | `path`パラメータは、`file:`プロトコルを使用するWHATWG `URL`オブジェクトにすることができます。 |
| v7.0.0 | `callback`パラメータは必須ではなくなりました。渡さないと、ID DEP0013の非推奨警告が発生します。 |
| v0.1.8 | 追加: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type) Windowsではサポートされていません。 **デフォルト:** `0o777`。

- `callback` [\<Function\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `path` [\<string\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Undefined_type) `recursive`が`true`に設定されている場合にディレクトリが作成された場合にのみ存在します。

ディレクトリを非同期的に作成します。

コールバックには、可能性のある例外と、`recursive`が`true`の場合、最初に作成されたディレクトリパス`(err[, path])`が与えられます。ディレクトリが作成されなかった場合（たとえば、以前に作成された場合）、`recursive`が`true`の場合でも、`path`は`undefined`になる可能性があります。

オプションの`options`引数は、`mode`（許可とスティッキービット）を指定する整数、または`mode`プロパティと、親ディレクトリを作成する必要があるかどうかを示す`recursive`プロパティを持つオブジェクトにすることができます。 `path`が存在するディレクトリである場合に`fs.mkdir()`を呼び出すと、`recursive`がfalseの場合にのみエラーが発生します。 `recursive`がfalseでディレクトリが存在する場合、`EEXIST`エラーが発生します。

```js [ESM]
import { mkdir } from 'node:fs';

// ./tmpと./tmp/aが存在するかどうかにかかわらず、./tmp/a/appleを作成します。
mkdir('./tmp/a/apple', { recursive: true }, (err) => {
  if (err) throw err;
});
```
Windowsでは、再帰を使用してもルートディレクトリで`fs.mkdir()`を使用すると、エラーが発生します。

```js [ESM]
import { mkdir } from 'node:fs';

mkdir('/', { recursive: true }, (err) => {
  // => [Error: EPERM: operation not permitted, mkdir 'C:\']
});
```
詳細については、POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2)のドキュメントを参照してください。


### `fs.mkdtemp(prefix[, options], callback)` {#fsmkdtempprefix-options-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.6.0, v18.19.0 | `prefix` パラメータがバッファと URL を受け入れるようになりました。 |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` の代わりに `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v16.5.0, v14.18.0 | `prefix` パラメータが空文字列を受け入れるようになりました。 |
| v10.0.0 | `callback` パラメータが必須になりました。渡さないと実行時に `TypeError` がスローされます。 |
| v7.0.0 | `callback` パラメータが必須になりました。渡さないと、ID DEP0013 の非推奨警告が表示されます。 |
| v6.2.1 | `callback` パラメータがオプションになりました。 |
| v5.10.0 | 追加: v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `'utf8'`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

ユニークな一時ディレクトリを作成します。

ユニークな一時ディレクトリを作成するために、必須の `prefix` の後ろに付加する6つのランダムな文字を生成します。プラットフォーム間の不整合のため、`prefix` に末尾の `X` 文字を使用することは避けてください。一部のプラットフォーム (特に BSD) では、6つ以上のランダムな文字を返し、`prefix` の末尾の `X` 文字をランダムな文字に置き換えることがあります。

作成されたディレクトリパスは、コールバックの2番目のパラメータとして文字列で渡されます。

オプションの `options` 引数は、エンコーディングを指定する文字列、または使用する文字エンコーディングを指定する `encoding` プロパティを持つオブジェクトにすることができます。

```js [ESM]
import { mkdtemp } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

mkdtemp(join(tmpdir(), 'foo-'), (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Prints: /tmp/foo-itXde2 or C:\Users\...\AppData\Local\Temp\foo-itXde2
});
```
`fs.mkdtemp()` メソッドは、ランダムに選択された6つの文字を `prefix` 文字列に直接付加します。たとえば、ディレクトリ `/tmp` が与えられた場合、`/tmp` *内*に一時ディレクトリを作成することを意図している場合は、`prefix` はプラットフォーム固有の末尾のパス区切り文字 (`require('node:path').sep`) で終わる必要があります。

```js [ESM]
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs';

// 新しい一時ディレクトリの親ディレクトリ
const tmpDir = tmpdir();

// この方法は*不正解*です:
mkdtemp(tmpDir, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // `/tmpabc123` のようなものが表示されます。
  // 新しい一時ディレクトリは、/tmp ディレクトリ*内*ではなく、
  // ファイルシステムのルートに作成されます。
});

// この方法は*正解*です:
import { sep } from 'node:path';
mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // `/tmp/abc123` のようなものが表示されます。
  // 新しい一時ディレクトリは、
  // /tmp ディレクトリ内に作成されます。
});
```

### `fs.open(path[, flags[, mode]], callback)` {#fsopenpath-flags-mode-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v11.1.0 | `flags`引数はオプションになり、デフォルトは`'r'`になりました。 |
| v9.9.0 | `as` と `as+` フラグがサポートされるようになりました。 |
| v7.6.0 | `path` パラメータは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v0.0.2 | 追加: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [ファイルシステムの `flags` のサポート](/ja/nodejs/api/fs#file-system-flags) を参照してください。**デフォルト:** `'r'`。
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0o666` (読み取りと書き込み)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

非同期ファイルオープン。詳細については、POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) ドキュメントを参照してください。

`mode` は、ファイルが作成された場合にのみ、ファイルモード（パーミッションとスティッキービット）を設定します。Windows では、書き込み権限のみを操作できます。[`fs.chmod()`](/ja/nodejs/api/fs#fschmodpath-mode-callback) を参照してください。

コールバックは2つの引数 `(err, fd)` を取得します。

一部の文字 (`\< \> : " / \ | ? *`) は、[ファイル、パス、および名前空間の命名](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file) に記載されているように、Windows では予約されています。NTFS では、ファイル名にコロンが含まれている場合、Node.js は [この MSDN ページ](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams) で説明されているように、ファイルシステムストリームを開きます。

`fs.open()` に基づく関数もこの動作を示します: `fs.writeFile()`、`fs.readFile()` など。


### `fs.openAsBlob(path[, options])` {#fsopenasblobpath-options}

**Added in: v19.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Blob のオプションの MIME タイプ。
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功した場合、[\<Blob\>](/ja/nodejs/api/buffer#class-blob) で履行されます。

データが指定されたファイルによってバックアップされる [\<Blob\>](/ja/nodejs/api/buffer#class-blob) を返します。

[\<Blob\>](/ja/nodejs/api/buffer#class-blob) が作成された後、ファイルを変更してはなりません。 変更を加えると、[\<Blob\>](/ja/nodejs/api/buffer#class-blob) データの読み取りが `DOMException` エラーで失敗します。 `Blob` の作成時、およびディスク上のファイルデータが変更されたかどうかを検出するために読み取りを行う前に、ファイルに対する同期 stat 操作を行います。

::: code-group
```js [ESM]
import { openAsBlob } from 'node:fs';

const blob = await openAsBlob('the.file.txt');
const ab = await blob.arrayBuffer();
blob.stream();
```

```js [CJS]
const { openAsBlob } = require('node:fs');

(async () => {
  const blob = await openAsBlob('the.file.txt');
  const ab = await blob.arrayBuffer();
  blob.stream();
})();
```
:::

### `fs.opendir(path[, options], callback)` {#fsopendirpath-options-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.1.0, v18.17.0 | `recursive` オプションが追加されました。 |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` の代わりに `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v13.1.0, v12.16.0 | `bufferSize` オプションが導入されました。 |
| v12.12.0 | Added in: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Default:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ディレクトリから読み取るときに内部的にバッファリングされるディレクトリ エントリの数。 値が大きいほどパフォーマンスが向上しますが、メモリ使用量も増加します。 **Default:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `false`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dir` [\<fs.Dir\>](/ja/nodejs/api/fs#class-fsdir)
  
 

ディレクトリを非同期的に開きます。 詳細は、POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) ドキュメントを参照してください。

[\<fs.Dir\>](/ja/nodejs/api/fs#class-fsdir) を作成します。これには、ディレクトリからの読み取りとクリーンアップのためのすべての追加機能が含まれています。

`encoding` オプションは、ディレクトリを開くとき、および後続の読み取り操作中に `path` のエンコーディングを設定します。


### `fs.read(fd, buffer, offset, length, position, callback)` {#fsreadfd-buffer-offset-length-position-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`の代わりに`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v10.10.0 | `buffer`パラメータは、任意の`TypedArray`または`DataView`にすることができます。 |
| v7.4.0 | `buffer`パラメータは、`Uint8Array`にすることができます。 |
| v6.0.0 | `length`パラメータは`0`にすることができます。 |
| v0.0.2 | Added in: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) データが書き込まれるバッファ。
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) データを書き込む`buffer`内の位置。
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み取るバイト数。
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) ファイル内の読み取りを開始する位置を指定します。 `position`が`null`または`-1`の場合、データは現在のファイル位置から読み取られ、ファイル位置が更新されます。 `position`が負でない整数の場合、ファイル位置は変更されません。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

`fd`で指定されたファイルからデータを読み取ります。

コールバックには、3つの引数`(err, bytesRead, buffer)`が与えられます。

ファイルが同時に変更されない場合、読み取られたバイト数がゼロになると、ファイルの終わりに達します。

このメソッドが[`util.promisify()`](/ja/nodejs/api/util#utilpromisifyoriginal)されたバージョンとして呼び出された場合、`bytesRead`と`buffer`プロパティを持つ`Object`のPromiseを返します。

`fs.read()`メソッドは、ファイル記述子（`fd`）で指定されたファイルからデータを読み取ります。 `length`引数は、Node.jsがカーネルから読み取ろうとする最大バイト数を示します。 ただし、読み取られた実際のバイト数（`bytesRead`）は、さまざまな理由で指定された`length`よりも少なくなる可能性があります。

例：

- ファイルが指定された`length`よりも短い場合、`bytesRead`は実際に読み取られたバイト数に設定されます。
- バッファがいっぱいになる前にファイルがEOF（End of File）に遭遇した場合、Node.jsはEOFに遭遇するまですべての利用可能なバイトを読み取り、コールバックの`bytesRead`パラメータは実際に読み取られたバイト数を示します。これは指定された`length`よりも少ない場合があります。
- ファイルが遅いネットワーク`filesystem`上にあるか、読み取り中に他の問題が発生した場合、`bytesRead`は指定された`length`よりも少なくなる可能性があります。

したがって、`fs.read()`を使用する場合、ファイルから実際に読み取られたバイト数を判断するために、`bytesRead`の値を確認することが重要です。 アプリケーションのロジックに応じて、`bytesRead`が指定された`length`よりも少ない場合を処理する必要がある場合があります。たとえば、最小バイト数が必要な場合は、読み取り呼び出しをループでラップするなどです。

この動作は、POSIX `preadv2`関数に似ています。


### `fs.read(fd[, options], callback)` {#fsreadfd-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.11.0, v12.17.0 | buffer、offset、length、position をオプションにするために、options オブジェクトを渡せるようになりました。 |
| v13.11.0, v12.17.0 | 追加: v13.11.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **デフォルト:** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `null`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)



[`fs.read()`](/ja/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) 関数と同様に、このバージョンはオプションの `options` オブジェクトを受け取ります。`options` オブジェクトが指定されていない場合は、上記のデフォルト値になります。


### `fs.read(fd, buffer[, options], callback)` {#fsreadfd-buffer-options-callback}

**Added in: v18.2.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) データが書き込まれるバッファー。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) **Default:** `null`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
  
 

[`fs.read()`](/ja/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) 関数と同様に、このバージョンはオプションの `options` オブジェクトを受け取ります。`options` オブジェクトが指定されていない場合、上記のデフォルト値になります。

### `fs.readdir(path[, options], callback)` {#fsreaddirpath-options-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.1.0, v18.17.0 | `recursive` オプションが追加されました。 |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.10.0 | 新しいオプション `withFileTypes` が追加されました。 |
| v10.0.0 | `callback` パラメーターはオプションではなくなりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.6.0 | `path` パラメーターは `file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v7.0.0 | `callback` パラメーターはオプションではなくなりました。渡さないと、ID DEP0013 で非推奨警告が発行されます。 |
| v6.0.0 | `options` パラメーターが追加されました。 |
| v0.1.8 | Added in: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、ディレクトリの内容を再帰的に読み取ります。再帰モードでは、すべてのファイル、サブファイル、およびディレクトリが一覧表示されます。**Default:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `files` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ja/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/ja/nodejs/api/fs#class-fsdirent)
  
 

ディレクトリの内容を読み取ります。コールバックは2つの引数 `(err, files)` を取得します。`files` はディレクトリ内のファイル名の配列で、`'.'` と `'..'` は除外されます。

詳細については、POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) のドキュメントを参照してください。

オプションの `options` 引数は、エンコーディングを指定する文字列、またはコールバックに渡されるファイル名に使用する文字エンコーディングを指定する `encoding` プロパティを持つオブジェクトにすることができます。`encoding` が `'buffer'` に設定されている場合、返されるファイル名は [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) オブジェクトとして渡されます。

`options.withFileTypes` が `true` に設定されている場合、`files` 配列には [\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) オブジェクトが含まれます。


### `fs.readFile(path[, options], callback)` {#fsreadfilepath-options-callback}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v16.0.0 | 返されるエラーは、複数のエラーが返された場合に `AggregateError` になることがあります。 |
| v15.2.0, v14.17.0 | options 引数に、進行中の readFile リクエストを中止するための AbortSignal を含めることができるようになりました。 |
| v10.0.0 | `callback` パラメータは必須になりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.6.0 | `path` パラメータは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v7.0.0 | `callback` パラメータは必須ではなくなりました。渡さないと、ID DEP0013 で非推奨の警告が表示されます。 |
| v5.1.0 | `callback` は、成功した場合に常に `error` パラメータとして `null` を指定して呼び出されます。 |
| v5.0.0 | `path` パラメータはファイルディスクリプタにすることができます。 |
| v0.1.29 | 追加: v0.1.29 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイル名またはファイルディスクリプタ
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ファイルシステムの `flags` のサポート](/ja/nodejs/api/fs#file-system-flags) を参照してください。 **デフォルト:** `'r'`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中の readFile を中止できます。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
    - `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
  
 

ファイルのコンテンツ全体を非同期に読み取ります。

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```
コールバックには 2 つの引数 `(err, data)` が渡されます。ここで、`data` はファイルの内容です。

エンコーディングが指定されていない場合、生のバッファーが返されます。

`options` が文字列の場合、エンコーディングを指定します。

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', 'utf8', callback);
```
パスがディレクトリの場合、`fs.readFile()` および [`fs.readFileSync()`](/ja/nodejs/api/fs#fsreadfilesyncpath-options) の動作はプラットフォーム固有です。macOS、Linux、および Windows では、エラーが返されます。FreeBSD では、ディレクトリの内容の表現が返されます。

```js [ESM]
import { readFile } from 'node:fs';

// macOS, Linux, および Windows
readFile('<directory>', (err, data) => {
  // => [Error: EISDIR: ディレクトリに対する不正な操作、read <directory>]
});

//  FreeBSD
readFile('<directory>', (err, data) => {
  // => null, <data>
});
```
`AbortSignal` を使用して、進行中のリクエストを中止できます。リクエストが中止されると、コールバックは `AbortError` を指定して呼び出されます。

```js [ESM]
import { readFile } from 'node:fs';

const controller = new AbortController();
const signal = controller.signal;
readFile(fileInfo[0].name, { signal }, (err, buf) => {
  // ...
});
// リクエストを中止する場合
controller.abort();
```
`fs.readFile()` 関数はファイル全体をバッファリングします。メモリコストを最小限に抑えるために、可能な場合は `fs.createReadStream()` を介したストリーミングを優先してください。

進行中のリクエストを中止しても、個々のオペレーティングシステムリクエストは中止されず、`fs.readFile` が実行する内部バッファリングが中止されます。


#### ファイル記述子 {#file-descriptors}

#### パフォーマンスに関する考慮事項 {#performance-considerations}

`fs.readFile()` メソッドは、ファイルのコンテンツを一度に 1 つのチャンクずつ非同期的にメモリに読み込みます。これにより、イベントループは各チャンクの間でターンできます。これにより、読み込み操作が基盤となる libuv スレッドプールを使用している可能性のある他のアクティビティへの影響を少なくすることができますが、完全なファイルをメモリに読み込むのに時間がかかることを意味します。

追加の読み込みオーバーヘッドは、システムによって大きく異なり、読み込んでいるファイルの種類によって異なります。ファイルタイプが通常のファイル（パイプなど）で、Node.js が実際のファイルサイズを判別できない場合、各読み込み操作は 64 KiB のデータをロードします。通常のファイルの場合、各読み込みは 512 KiB のデータを処理します。

ファイルの内容を可能な限り高速に読み取る必要があるアプリケーションの場合は、`fs.read()` を直接使用し、アプリケーションコードがファイルの内容全体を自分で管理して読み取る方が適切です。

Node.js GitHub の issue [#25741](https://github.com/nodejs/node/issues/25741) には、異なる Node.js バージョンの複数のファイルサイズに対する `fs.readFile()` のパフォーマンスに関する詳細情報と詳細な分析が記載されています。

### `fs.readlink(path[, options], callback)` {#fsreadlinkpath-options-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.0.0 | `callback` パラメータはオプションではなくなりました。渡さない場合、実行時に `TypeError` がスローされます。 |
| v7.6.0 | `path` パラメータは、`file:` プロトコルを使用した WHATWG `URL` オブジェクトにすることができます。 |
| v7.0.0 | `callback` パラメータはオプションではなくなりました。渡さない場合、ID DEP0013 で非推奨警告が出力されます。 |
| v0.1.31 | 追加: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `linkString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)



`path` で参照されるシンボリックリンクの内容を読み取ります。コールバックは 2 つの引数 `(err, linkString)` を受け取ります。

詳細については、POSIX の [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) ドキュメントを参照してください。

オプションの `options` 引数は、エンコーディングを指定する文字列、またはコールバックに渡されるリンクパスに使用する文字エンコーディングを指定する `encoding` プロパティを持つオブジェクトにすることができます。`encoding` が `'buffer'` に設定されている場合、返されるリンクパスは [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) オブジェクトとして渡されます。


### `fs.readv(fd, buffers[, position], callback)` {#fsreadvfd-buffers-position-callback}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v13.13.0, v12.17.0 | 追加: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **既定:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)

`fd` で指定されたファイルから読み込み、`readv()` を使用して `ArrayBufferView` の配列に書き込みます。

`position` は、データを読み込むファイルの先頭からのオフセットです。 `typeof position !== 'number'` の場合、データは現在の位置から読み込まれます。

コールバックには、`err`、`bytesRead`、および `buffers` の3つの引数が渡されます。 `bytesRead` は、ファイルから読み込まれたバイト数です。

このメソッドが [`util.promisify()`](/ja/nodejs/api/util#utilpromisifyoriginal) でプロミス化されたバージョンとして呼び出された場合、`bytesRead` および `buffers` プロパティを持つ `Object` のプロミスを返します。

### `fs.realpath(path[, options], callback)` {#fsrealpathpath-options-callback}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.0.0 | `callback` パラメータはオプションではなくなりました。 渡さないと、実行時に `TypeError` がスローされます。 |
| v8.0.0 | パイプ/ソケットの解決のサポートが追加されました。 |
| v7.6.0 | `path` パラメータは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v7.0.0 | `callback` パラメータはオプションではなくなりました。 渡さないと、ID DEP0013 の非推奨の警告が出力されます。 |
| v6.4.0 | `realpath` の呼び出しが、Windows のさまざまなエッジケースで再び機能するようになりました。 |
| v6.0.0 | `cache` パラメータが削除されました。 |
| v0.1.31 | 追加: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **既定:** `'utf8'`

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

非同期的に、`.`、`..`、およびシンボリックリンクを解決して、正規のパス名を計算します。

正規のパス名は必ずしも一意ではありません。 ハードリンクとバインドマウントは、多くのパス名を介してファイルシステムエンティティを公開できます。

この関数は、[`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3) と同様に動作しますが、いくつかの例外があります。

`callback` は、2つの引数 `(err, resolvedPath)` を受け取ります。 相対パスを解決するために `process.cwd` を使用する場合があります。

UTF8文字列に変換できるパスのみがサポートされます。

オプションの `options` 引数は、エンコーディングを指定する文字列、またはコールバックに渡されるパスに使用する文字エンコーディングを指定する `encoding` プロパティを持つオブジェクトにすることができます。 `encoding` が `'buffer'` に設定されている場合、返されるパスは [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) オブジェクトとして渡されます。

`path` がソケットまたはパイプに解決される場合、関数はそのオブジェクトのシステム依存の名前を返します。

存在しないパスは、ENOENT エラーになります。 `error.path` は絶対ファイルパスです。


### `fs.realpath.native(path[, options], callback)` {#fsrealpathnativepath-options-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v9.2.0 | 追加: v9.2.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `'utf8'`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
  
 

非同期の [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3)。

`callback` は2つの引数 `(err, resolvedPath)` を受け取ります。

UTF8文字列に変換できるパスのみがサポートされます。

オプションの `options` 引数は、エンコーディングを指定する文字列、またはコールバックに渡されるパスに使用する文字エンコーディングを指定する `encoding` プロパティを持つオブジェクトにすることができます。 `encoding` が `'buffer'` に設定されている場合、返されるパスは [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) オブジェクトとして渡されます。

Linux では、Node.js が musl libc に対してリンクされている場合、この関数が動作するためには procfs ファイルシステムが `/proc` にマウントされている必要があります。 Glibc にはこの制限はありません。

### `fs.rename(oldPath, newPath, callback)` {#fsrenameoldpath-newpath-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.0.0 | `callback` パラメータは必須になりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.6.0 | `oldPath` および `newPath` パラメータは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 現在、サポートはまだ *実験的* です。 |
| v7.0.0 | `callback` パラメータは必須ではなくなりました。渡さないと、ID DEP0013 の非推奨警告が発行されます。 |
| v0.0.2 | 追加: v0.0.2 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

`oldPath` にあるファイルの名前を、`newPath` として指定されたパス名に非同期で変更します。 `newPath` が既に存在する場合は、上書きされます。 `newPath` にディレクトリがある場合は、代わりにエラーが発生します。 可能な例外以外の引数は、完了コールバックには渡されません。

参照: [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2)。

```js [ESM]
import { rename } from 'node:fs';

rename('oldFile.txt', 'newFile.txt', (err) => {
  if (err) throw err;
  console.log('Rename complete!');
});
```

### `fs.rmdir(path[, options], callback)` {#fsrmdirpath-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v16.0.0 | ファイルである`path`に対して`fs.rmdir(path, { recursive: true })`を使用すると、許可されなくなり、Windowsでは`ENOENT`エラー、POSIXでは`ENOTDIR`エラーが発生します。 |
| v16.0.0 | 存在しない`path`に対して`fs.rmdir(path, { recursive: true })`を使用すると、許可されなくなり、`ENOENT`エラーが発生します。 |
| v16.0.0 | `recursive`オプションは非推奨になり、使用すると非推奨の警告が表示されます。 |
| v14.14.0 | `recursive`オプションは非推奨になりました。代わりに`fs.rm`を使用してください。 |
| v13.3.0, v12.16.0 | `maxBusyTries`オプションの名前が`maxRetries`に変更され、デフォルト値が0になりました。`emfileWait`オプションは削除され、`EMFILE`エラーは他のエラーと同じ再試行ロジックを使用します。`retryDelay`オプションがサポートされるようになりました。`ENFILE`エラーが再試行されるようになりました。 |
| v12.10.0 | `recursive`、`maxBusyTries`、および`emfileWait`オプションがサポートされるようになりました。 |
| v10.0.0 | `callback`パラメータは必須になりました。渡さないと、実行時に`TypeError`がスローされます。 |
| v7.6.0 | `path`パラメータは、`file:`プロトコルを使用するWHATWG `URL`オブジェクトにすることができます。 |
| v7.0.0 | `callback`パラメータは必須になりました。渡さないと、ID DEP0013の非推奨警告が出力されます。 |
| v0.0.2 | 追加: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `EBUSY`、`EMFILE`、`ENFILE`、`ENOTEMPTY`、または`EPERM`エラーが発生した場合、Node.jsは各試行で`retryDelay`ミリ秒長い線形バックオフ待機で操作を再試行します。このオプションは、再試行回数を表します。このオプションは、`recursive`オプションが`true`でない場合は無視されます。**デフォルト:** `0`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、再帰的なディレクトリ削除を実行します。再帰モードでは、操作は失敗時に再試行されます。**デフォルト:** `false`。**非推奨。**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 再試行間の待機時間（ミリ秒単位）。このオプションは、`recursive`オプションが`true`でない場合は無視されます。**デフォルト:** `100`。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

非同期[`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2)。完了コールバックには、例外を除いて引数は渡されません。

ファイル（ディレクトリではない）で`fs.rmdir()`を使用すると、Windowsでは`ENOENT`エラー、POSIXでは`ENOTDIR`エラーが発生します。

`rm -rf` Unixコマンドと同様の動作を得るには、`{ recursive: true, force: true }`オプションを指定して[`fs.rm()`](/ja/nodejs/api/fs#fsrmpath-options-callback)を使用します。


### `fs.rm(path[, options], callback)` {#fsrmpath-options-callback}

::: info [履歴]
| バージョン | 変更 |
|---|---|
| v17.3.0, v16.14.0 | `path` パラメータは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v14.14.0 | 追加: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`path` が存在しない場合は例外が無視されます。 **デフォルト:** `false`。
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `EBUSY`、`EMFILE`、`ENFILE`、`ENOTEMPTY`、または `EPERM` エラーが発生した場合、Node.js は試行ごとに `retryDelay` ミリ秒ずつ線形バックオフして操作を再試行します。このオプションは、再試行回数を表します。このオプションは、`recursive` オプションが `true` でない場合は無視されます。 **デフォルト:** `0`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、再帰的な削除を実行します。再帰モードでは、操作は失敗時に再試行されます。 **デフォルト:** `false`。
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 再試行間の待機時間（ミリ秒単位）。このオプションは、`recursive` オプションが `true` でない場合は無視されます。 **デフォルト:** `100`。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

ファイルとディレクトリを非同期的に削除します（標準の POSIX `rm` ユーティリティをモデル化）。完了コールバックには、例外が発生する可能性のある引数以外は渡されません。


### `fs.stat(path[, options], callback)` {#fsstatpath-options-callback}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` の代わりに `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.5.0 | 追加の `options` オブジェクトを受け入れ、返される数値が bigint であるかどうかを指定できるようになりました。 |
| v10.0.0 | `callback` パラメーターは必須になりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.6.0 | `path` パラメーターは、`file:` プロトコルを使用した WHATWG `URL` オブジェクトにできます。 |
| v7.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと、ID DEP0013 の非推奨警告が出力されます。 |
| v0.0.2 | Added in: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返される [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトの数値が `bigint` であるかどうか。**デフォルト:** `false`。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats)
  
 

非同期 [`stat(2)`](http://man7.org/linux/man-pages/man2/stat.2)。コールバックは2つの引数 `(err, stats)` を受け取ります。`stats` は [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトです。

エラーの場合、`err.code` は [Common System Errors](/ja/nodejs/api/errors#common-system-errors) のいずれかになります。

[`fs.stat()`](/ja/nodejs/api/fs#fsstatpath-options-callback) はシンボリックリンクをたどります。リンク自体を見るには、[`fs.lstat()`](/ja/nodejs/api/fs#fslstatpath-options-callback) を使用してください。

`fs.open()`、`fs.readFile()`、または `fs.writeFile()` を呼び出す前に `fs.stat()` を使用してファイルの存在を確認することはお勧めできません。代わりに、ユーザーコードはファイルを直接開く/読み取る/書き込むようにし、ファイルが利用できない場合に発生するエラーを処理する必要があります。

後で操作せずにファイルの存在を確認するには、[`fs.access()`](/ja/nodejs/api/fs#fsaccesspath-mode-callback) をお勧めします。

たとえば、次のディレクトリ構造があるとします。

```text [TEXT]
- txtDir
-- file.txt
- app.js
```
次のプログラムは、指定されたパスの統計情報を確認します。

```js [ESM]
import { stat } from 'node:fs';

const pathsToCheck = ['./txtDir', './txtDir/file.txt'];

for (let i = 0; i < pathsToCheck.length; i++) {
  stat(pathsToCheck[i], (err, stats) => {
    console.log(stats.isDirectory());
    console.log(stats);
  });
}
```
結果の出力は次のようになります。

```bash [BASH]
true
Stats {
  dev: 16777220,
  mode: 16877,
  nlink: 3,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214262,
  size: 96,
  blocks: 0,
  atimeMs: 1561174653071.963,
  mtimeMs: 1561174614583.3518,
  ctimeMs: 1561174626623.5366,
  birthtimeMs: 1561174126937.2893,
  atime: 2019-06-22T03:37:33.072Z,
  mtime: 2019-06-22T03:36:54.583Z,
  ctime: 2019-06-22T03:37:06.624Z,
  birthtime: 2019-06-22T03:28:46.937Z
}
false
Stats {
  dev: 16777220,
  mode: 33188,
  nlink: 1,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214074,
  size: 8,
  blocks: 8,
  atimeMs: 1561174616618.8555,
  mtimeMs: 1561174614584,
  ctimeMs: 1561174614583.8145,
  birthtimeMs: 1561174007710.7478,
  atime: 2019-06-22T03:36:56.619Z,
  mtime: 2019-06-22T03:36:54.584Z,
  ctime: 2019-06-22T03:36:54.584Z,
  birthtime: 2019-06-22T03:26:47.711Z
}
```

### `fs.statfs(path[, options], callback)` {#fsstatfspath-options-callback}

**Added in: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返される[\<fs.StatFs\>](/ja/nodejs/api/fs#class-fsstatfs)オブジェクトの数値が`bigint`であるかどうか。 **デフォルト:** `false`。


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.StatFs\>](/ja/nodejs/api/fs#class-fsstatfs)



非同期の[`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2)。 `path`を含むマウントされたファイルシステムに関する情報を返します。 コールバックは2つの引数`(err, stats)`を取得し、`stats`は[\<fs.StatFs\>](/ja/nodejs/api/fs#class-fsstatfs)オブジェクトです。

エラーが発生した場合、`err.code`は[共通システムエラー](/ja/nodejs/api/errors#common-system-errors)のいずれかになります。

### `fs.symlink(target, path[, type], callback)` {#fssymlinktarget-path-type-callback}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v12.0.0 | `type`引数が未定義のままの場合、Nodeは`target`の型を自動検出し、自動的に`dir`または`file`を選択します。 |
| v7.6.0 | `target`と`path`のパラメータは、`file:`プロトコルを使用するWHATWG `URL`オブジェクトにすることができます。 現在、サポートはまだ*実験的*です。 |
| v0.1.31 | Added in: v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



`target`を指す`path`という名前のリンクを作成します。 完了コールバックには、例外を除いて引数は与えられません。

詳細については、POSIX [`symlink(2)`](http://man7.org/linux/man-pages/man2/symlink.2)ドキュメントを参照してください。

`type`引数はWindowsでのみ使用可能で、他のプラットフォームでは無視されます。 `'dir'`、`'file'`、または`'junction'`に設定できます。 `type`引数が`null`の場合、Node.jsは`target`の型を自動検出し、`'file'`または`'dir'`を使用します。 `target`が存在しない場合は、`'file'`が使用されます。 Windowsジャンクションポイントでは、宛先パスが絶対パスである必要があります。 `'junction'`を使用する場合、`target`引数は自動的に絶対パスに正規化されます。 NTFSボリューム上のジャンクションポイントは、ディレクトリのみを指すことができます。

相対ターゲットは、リンクの親ディレクトリからの相対です。

```js [ESM]
import { symlink } from 'node:fs';

symlink('./mew', './mewtwo', callback);
```
上記の例では、同じディレクトリ内の`mew`を指すシンボリックリンク`mewtwo`を作成します。

```bash [BASH]
$ tree .
.
├── mew
└── mewtwo -> ./mew
```

### `fs.truncate(path[, len], callback)` {#fstruncatepath-len-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v16.0.0 | 複数のエラーが返された場合、返されるエラーは `AggregateError` になる可能性があります。 |
| v10.0.0 | `callback` パラメータは必須ではなくなりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.0.0 | `callback` パラメータは必須ではなくなりました。渡さないと、ID DEP0013 の非推奨警告が出力されます。 |
| v0.8.6 | Added in: v0.8.6 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
  
 

ファイルを切り詰めます。 起こりうる例外以外の引数は、完了コールバックには与えられません。 ファイル記述子を最初の引数として渡すこともできます。 この場合、`fs.ftruncate()` が呼び出されます。

::: code-group
```js [ESM]
import { truncate } from 'node:fs';
// 'path/file.txt' が通常のファイルであると仮定します。
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt was truncated');
});
```

```js [CJS]
const { truncate } = require('node:fs');
// 'path/file.txt' が通常のファイルであると仮定します。
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt was truncated');
});
```
:::

ファイル記述子を渡すことは非推奨であり、将来エラーがスローされる可能性があります。

詳細については、POSIX [`truncate(2)`](http://man7.org/linux/man-pages/man2/truncate.2) のドキュメントを参照してください。


### `fs.unlink(path, callback)` {#fsunlinkpath-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v10.0.0 | `callback` パラメーターはオプションではなくなりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.6.0 | `path` パラメーターは `file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v7.0.0 | `callback` パラメーターはオプションではなくなりました。渡さないと、ID DEP0013 の非推奨警告が出力されます。 |
| v0.0.2 | 追加: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

ファイルまたはシンボリックリンクを非同期的に削除します。完了コールバックには、発生する可能性のある例外以外の引数は与えられません。

```js [ESM]
import { unlink } from 'node:fs';
// 'path/file.txt' が通常のファイルであると仮定します。
unlink('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt was deleted');
});
```
`fs.unlink()` は、ディレクトリ (空かどうかにかかわらず) では機能しません。ディレクトリを削除するには、[`fs.rmdir()`](/ja/nodejs/api/fs#fsrmdirpath-options-callback) を使用してください。

詳細については、POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) のドキュメントを参照してください。

### `fs.unwatchFile(filename[, listener])` {#fsunwatchfilefilename-listener}

**追加: v0.1.31**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) オプション。以前に `fs.watchFile()` を使用してアタッチされたリスナー。

`filename` の変更の監視を停止します。 `listener` が指定されている場合、その特定のリスナーのみが削除されます。それ以外の場合は、*すべての* リスナーが削除され、事実上 `filename` の監視が停止します。

監視されていないファイル名で `fs.unwatchFile()` を呼び出すことは、エラーではなく、no-op です。

[`fs.watch()`](/ja/nodejs/api/fs#fswatchfilename-options-listener) を使用する方が、`fs.watchFile()` と `fs.unwatchFile()` よりも効率的です。可能な場合は、`fs.watchFile()` と `fs.unwatchFile()` の代わりに `fs.watch()` を使用する必要があります。


### `fs.utimes(path, atime, mtime, callback)` {#fsutimespath-atime-mtime-callback}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v10.0.0 | `callback`パラメータは必須ではなくなりました。渡さないと、実行時に`TypeError`がスローされます。 |
| v8.0.0 | `NaN`、`Infinity`、および`-Infinity`は、有効な時間指定子ではなくなりました。 |
| v7.6.0 | `path`パラメータは、`file:`プロトコルを使用したWHATWG `URL`オブジェクトにすることができます。 |
| v7.0.0 | `callback`パラメータは必須ではなくなりました。渡さないと、ID DEP0013の非推奨警告が出力されます。 |
| v4.1.0 | 数値文字列、`NaN`、および`Infinity`が時間指定子として許可されるようになりました。 |
| v0.4.2 | 追加: v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`path`によって参照されるオブジェクトのファイルシステムのタイムスタンプを変更します。

`atime`と`mtime`引数は、次の規則に従います。

- 値は、Unixエポック時間を秒単位で表す数値、`Date`、または`'123456789.0'`のような数値文字列のいずれかになります。
- 値を数値に変換できない場合、または`NaN`、`Infinity`、`-Infinity`の場合、`Error`がスローされます。


### `fs.watch(filename[, options][, listener])` {#fswatchfilename-options-listener}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v19.1.0 | Linux、AIX、IBMi に対する再帰的サポートが追加されました。 |
| v15.9.0, v14.17.0 | AbortSignal でウォッチャーを閉じることができるサポートが追加されました。 |
| v7.6.0 | `filename` パラメーターは `file:` プロトコルを使用した WHATWG `URL` オブジェクトにすることができます。 |
| v7.0.0 | 渡された `options` オブジェクトが変更されることはありません。 |
| v0.5.10 | 追加: v0.5.10 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ファイルが監視されている間、プロセスを実行し続けるかどうかを示します。**デフォルト:** `true`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) すべてのサブディレクトリを監視するか、現在のディレクトリのみを監視するかを示します。これはディレクトリが指定されている場合に適用され、サポートされているプラットフォームでのみ適用されます（[注意点](/ja/nodejs/api/fs#caveats)を参照）。**デフォルト:** `false`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リスナーに渡されるファイル名に使用する文字エンコーディングを指定します。**デフォルト:** `'utf8'`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) AbortSignal でウォッチャーを閉じることができます。
  
 
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **デフォルト:** `undefined`
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
  
 
- 戻り値: [\<fs.FSWatcher\>](/ja/nodejs/api/fs#class-fsfswatcher)

`filename` の変更を監視します。`filename` はファイルまたはディレクトリです。

2番目の引数はオプションです。`options` が文字列として指定されている場合、エンコーディングを指定します。それ以外の場合、`options` はオブジェクトとして渡す必要があります。

リスナーコールバックは、2つの引数 `(eventType, filename)` を取得します。`eventType` は `'rename'` または `'change'` のいずれかで、`filename` はイベントをトリガーしたファイルの名前です。

ほとんどのプラットフォームでは、ファイル名がディレクトリに表示または消滅するたびに `'rename'` が発生します。

リスナーコールバックは、[\<fs.FSWatcher\>](/ja/nodejs/api/fs#class-fsfswatcher) によって発生する `'change'` イベントにアタッチされますが、`eventType` の `'change'` 値と同じではありません。

`signal` が渡された場合、対応する AbortController を中断すると、返された [\<fs.FSWatcher\>](/ja/nodejs/api/fs#class-fsfswatcher) が閉じられます。


#### 注意点 {#caveats}

`fs.watch` APIはプラットフォーム間で100%一貫性があるわけではなく、一部の状況では利用できません。

Windowsでは、監視対象のディレクトリが移動または名前変更された場合、イベントは発生しません。監視対象のディレクトリが削除されると、`EPERM`エラーが報告されます。

##### 可用性 {#availability}

この機能は、基盤となるオペレーティングシステムがファイルシステムの変更を通知する方法を提供していることに依存しています。

- Linuxシステムでは、[`inotify(7)`](https://man7.org/linux/man-pages/man7/inotify.7)を使用します。
- BSDシステムでは、[`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2)を使用します。
- macOSでは、ファイルには[`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2)を使用し、ディレクトリには[`FSEvents`](https://developer.apple.com/documentation/coreservices/file_system_events)を使用します。
- SunOSシステム（SolarisおよびSmartOSを含む）では、[`event ports`](https://illumos.org/man/port_create)を使用します。
- Windowsシステムでは、この機能は[`ReadDirectoryChangesW`](https://docs.microsoft.com/en-us/windows/desktop/api/winbase/nf-winbase-readdirectorychangesw)に依存しています。
- AIXシステムでは、この機能は[`AHAFS`](https://developer.ibm.com/articles/au-aix_event_infrastructure/)に依存しており、有効にする必要があります。
- IBM iシステムでは、この機能はサポートされていません。

基盤となる機能が何らかの理由で利用できない場合、`fs.watch()`は機能せず、例外をスローする可能性があります。たとえば、ファイルまたはディレクトリの監視は、ネットワークファイルシステム（NFS、SMBなど）や、VagrantやDockerなどの仮想化ソフトウェアを使用する場合、ホストファイルシステム上では信頼性が低く、場合によっては不可能です。

`fs.watchFile()`を使用することも可能ですが、これはstatポーリングを使用するため、より遅く、信頼性が低くなります。

##### inode {#inodes}

LinuxおよびmacOSシステムでは、`fs.watch()`はパスを[inode](https://en.wikipedia.org/wiki/Inode)に解決し、inodeを監視します。監視対象のパスが削除され、再作成された場合、新しいinodeが割り当てられます。監視は削除のイベントを発行しますが、*元の*inodeの監視を継続します。新しいinodeのイベントは発行されません。これは想定される動作です。

AIXファイルは、ファイルの存続期間中同じinodeを保持します。AIXで監視対象のファイルを保存して閉じると、2つの通知（新しいコンテンツの追加と切り捨てに対して1つずつ）が発生します。


##### Filename 引数 {#filename-argument}

コールバックでの `filename` 引数の提供は、Linux、macOS、Windows、および AIX でのみサポートされています。サポートされているプラットフォームであっても、`filename` が常に提供されるとは限りません。したがって、コールバックで `filename` 引数が常に提供されることを前提とせず、`null` の場合のフォールバックロジックを用意してください。

```js [ESM]
import { watch } from 'node:fs';
watch('somedir', (eventType, filename) => {
  console.log(`event type is: ${eventType}`);
  if (filename) {
    console.log(`filename provided: ${filename}`);
  } else {
    console.log('filename not provided');
  }
});
```
### `fs.watchFile(filename[, options], listener)` {#fswatchfilefilename-options-listener}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.5.0 | `bigint` オプションがサポートされるようになりました。 |
| v7.6.0 | `filename` パラメータは、`file:` プロトコルを使用した WHATWG `URL` オブジェクトにすることができます。 |
| v0.1.31 | 追加: v0.1.31 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `false`
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `true`
    - `interval` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `5007`
  
 
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `current` [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats)
    - `previous` [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats)
  
 
- 戻り値: [\<fs.StatWatcher\>](/ja/nodejs/api/fs#class-fsstatwatcher)

`filename` の変更を監視します。コールバック `listener` は、ファイルがアクセスされるたびに呼び出されます。

`options` 引数は省略できます。指定する場合は、オブジェクトである必要があります。`options` オブジェクトには、ファイルが監視されている限りプロセスが実行を継続するかどうかを示す boolean 型の `persistent` を含めることができます。`options` オブジェクトには、ターゲットをポーリングする頻度をミリ秒単位で示す `interval` プロパティを指定できます。

`listener` は、現在の stat オブジェクトと前の stat オブジェクトの 2 つの引数を取得します。

```js [ESM]
import { watchFile } from 'node:fs';

watchFile('message.text', (curr, prev) => {
  console.log(`the current mtime is: ${curr.mtime}`);
  console.log(`the previous mtime was: ${prev.mtime}`);
});
```
これらの stat オブジェクトは `fs.Stat` のインスタンスです。`bigint` オプションが `true` の場合、これらのオブジェクトの数値は `BigInt` として指定されます。

ファイルがアクセスされただけでなく、変更されたときに通知を受け取るには、`curr.mtimeMs` と `prev.mtimeMs` を比較する必要があります。

`fs.watchFile` 操作の結果として `ENOENT` エラーが発生した場合、すべてのフィールドがゼロ（または日付の場合は Unix エポック）で、リスナーが 1 回呼び出されます。ファイルが後で作成された場合、リスナーは最新の stat オブジェクトで再度呼び出されます。これは、v0.10 以降の機能の変更です。

[`fs.watch()`](/ja/nodejs/api/fs#fswatchfilename-options-listener) を使用する方が、`fs.watchFile` および `fs.unwatchFile` よりも効率的です。可能な場合は、`fs.watchFile` および `fs.unwatchFile` の代わりに `fs.watch` を使用する必要があります。

`fs.watchFile()` で監視されているファイルが消えて再び現れた場合、2 番目のコールバックイベント（ファイルの再出現）の `previous` の内容は、最初のコールバックイベント（その消失）の `previous` の内容と同じになります。

これは、以下の場合に発生します。

- ファイルが削除され、続いて復元された場合
- ファイルの名前が変更され、元の名前に再度変更された場合


### `fs.write(fd, buffer, offset[, length[, position]], callback)` {#fswritefd-buffer-offset-length-position-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`の代わりに`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v14.0.0 | `buffer`パラメーターは、サポートされていない入力を文字列に強制変換しなくなりました。 |
| v10.10.0 | `buffer`パラメーターは、任意の`TypedArray`または`DataView`にすることができます。 |
| v10.0.0 | `callback`パラメーターは必須ではなくなりました。渡さないと、実行時に`TypeError`がスローされます。 |
| v7.4.0 | `buffer`パラメーターは、`Uint8Array`にすることができます。 |
| v7.2.0 | `offset`および`length`パラメーターはオプションになりました。 |
| v7.0.0 | `callback`パラメーターは必須ではなくなりました。渡さないと、id DEP0013の非推奨警告が発生します。 |
| v0.0.2 | Added in: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **既定値:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **既定値:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **既定値:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

`buffer`を`fd`で指定されたファイルに書き込みます。

`offset`は書き込むバッファーの部分を決定し、`length`は書き込むバイト数を指定する整数です。

`position`は、このデータを書き込む必要があるファイルの先頭からのオフセットを指します。`typeof position !== 'number'`の場合、データは現在の位置に書き込まれます。[`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2)を参照してください。

コールバックには、3つの引数`(err, bytesWritten, buffer)`が与えられます。ここで、`bytesWritten`は`buffer`から書き込まれた*バイト*数を指定します。

このメソッドが[`util.promisify()`](/ja/nodejs/api/util#utilpromisifyoriginal)されたバージョンとして呼び出された場合、`bytesWritten`と`buffer`プロパティを持つ`Object`のPromiseを返します。

コールバックを待たずに同じファイルに対して複数回`fs.write()`を使用するのは安全ではありません。このシナリオでは、[`fs.createWriteStream()`](/ja/nodejs/api/fs#fscreatewritestreampath-options)が推奨されます。

Linuxでは、ファイルが追加モードで開かれている場合、位置指定書き込みは機能しません。カーネルはposition引数を無視し、常にデータの最後にデータを追加します。


### `fs.write(fd, buffer[, options], callback)` {#fswritefd-buffer-options-callback}

**Added in: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `null`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)



`buffer`を`fd`で指定されたファイルに書き込みます。

上記の`fs.write`関数と同様に、このバージョンはオプションの`options`オブジェクトを取ります。`options`オブジェクトが指定されていない場合は、上記の値をデフォルトとします。

### `fs.write(fd, string[, position[, encoding]], callback)` {#fswritefd-string-position-encoding-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | `string` パラメーターに独自の `toString` 関数を持つオブジェクトを渡すことはサポートされなくなりました。 |
| v17.8.0 | `string` パラメーターに独自の `toString` 関数を持つオブジェクトを渡すことは非推奨になりました。 |
| v14.12.0 | `string` パラメーターは、明示的な `toString` 関数を持つオブジェクトを文字列化します。 |
| v14.0.0 | `string` パラメーターは、サポートされていない入力を文字列に強制変換しなくなりました。 |
| v10.0.0 | `callback` パラメーターは必須になりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.2.0 | `position` パラメーターはオプションになりました。 |
| v7.0.0 | `callback` パラメーターは必須になりました。渡さないと、id DEP0013 の非推奨警告が表示されます。 |
| v0.11.5 | Added in: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Default:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `written` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)



`string` を `fd` で指定されたファイルに書き込みます。 `string` が文字列でない場合、例外がスローされます。

`position` は、このデータを書き込むファイルの先頭からのオフセットを指します。 `typeof position !== 'number'` の場合、データは現在の位置に書き込まれます。 [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) を参照してください。

`encoding` は、予期される文字列エンコーディングです。

コールバックは、引数 `(err, written, string)` を受け取ります。ここで、 `written` は、渡された文字列を書き込むために必要な *バイト数* を指定します。 書き込まれたバイト数は、書き込まれた文字列の文字数と必ずしも同じではありません。 [`Buffer.byteLength`](/ja/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) を参照してください。

コールバックを待たずに、同じファイルに対して `fs.write()` を複数回使用するのは安全ではありません。 このシナリオでは、[`fs.createWriteStream()`](/ja/nodejs/api/fs#fscreatewritestreampath-options) を推奨します。

Linux では、ファイルが追記モードで開かれている場合、位置指定書き込みは機能しません。 カーネルは position 引数を無視し、常にファイルの最後にデータを追加します。

Windows では、ファイル記述子がコンソールに接続されている場合 (たとえば、`fd == 1` または `stdout`) 、使用されるエンコーディングに関係なく、非 ASCII 文字を含む文字列はデフォルトでは適切にレンダリングされません。 `chcp 65001` コマンドでアクティブなコードページを変更することにより、コンソールが UTF-8 を適切にレンダリングするように構成できます。 詳細については、[chcp](https://ss64.com/nt/chcp) のドキュメントを参照してください。


### `fs.writeFile(file, data[, options], callback)` {#fswritefilefile-data-options-callback}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v21.0.0, v20.10.0 | `flush` オプションがサポートされるようになりました。 |
| v19.0.0 | 独自の `toString` 関数を持つオブジェクトを `string` パラメーターに渡すことはサポートされなくなりました。 |
| v18.0.0 | 無効なコールバックを `callback` 引数に渡すと、`ERR_INVALID_CALLBACK` の代わりに `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v17.8.0 | 独自の `toString` 関数を持つオブジェクトを `string` パラメーターに渡すことは非推奨になりました。 |
| v16.0.0 | 複数のエラーが返された場合、返されるエラーは `AggregateError` になる場合があります。 |
| v15.2.0, v14.17.0 | options 引数に、進行中の writeFile リクエストを中止するための AbortSignal を含めることができます。 |
| v14.12.0 | `data` パラメーターは、明示的な `toString` 関数を持つオブジェクトを文字列化します。 |
| v14.0.0 | `data` パラメーターは、サポートされていない入力を文字列に強制変換しなくなりました。 |
| v10.10.0 | `data` パラメーターは、任意の `TypedArray` または `DataView` にできるようになりました。 |
| v10.0.0 | `callback` パラメーターは必須になりました。渡さないと、実行時に `TypeError` がスローされます。 |
| v7.4.0 | `data` パラメーターは `Uint8Array` にできるようになりました。 |
| v7.0.0 | `callback` パラメーターは必須ではなくなりました。渡さないと、ID DEP0013 の非推奨警告が発行されます。 |
| v5.0.0 | `file` パラメーターはファイル記述子にできるようになりました。 |
| v0.1.29 | Added in: v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイル名またはファイル記述子
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ファイルシステムの `flags` のサポート](/ja/nodejs/api/fs#file-system-flags)を参照してください。**デフォルト:** `'w'`。
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) すべてのデータがファイルに正常に書き込まれ、`flush` が `true` の場合、`fs.fsync()` が使用されてデータがフラッシュされます。 **デフォルト:** `false`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中の writeFile を中止できます。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
  
 

`file` がファイル名の場合、非同期的にデータをファイルに書き込み、ファイルが既に存在する場合は置き換えます。`data` は文字列またはバッファにできます。

`file` がファイル記述子の場合、動作は `fs.write()` を直接呼び出すのと同様です (推奨されます)。ファイル記述子の使用に関する以下の注記を参照してください。

`data` がバッファの場合、`encoding` オプションは無視されます。

`mode` オプションは、新しく作成されたファイルにのみ影響します。詳細については、[`fs.open()`](/ja/nodejs/api/fs#fsopenpath-flags-mode-callback) を参照してください。

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
```
`options` が文字列の場合、エンコードを指定します。

```js [ESM]
import { writeFile } from 'node:fs';

writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
```
コールバックを待たずに同じファイルで `fs.writeFile()` を複数回使用するのは安全ではありません。このシナリオでは、[`fs.createWriteStream()`](/ja/nodejs/api/fs#fscreatewritestreampath-options) をお勧めします。

`fs.readFile` と同様に、`fs.writeFile` は、渡されたバッファを書き込むために内部で複数の `write` 呼び出しを実行する便利なメソッドです。パフォーマンスが重要なコードの場合は、[`fs.createWriteStream()`](/ja/nodejs/api/fs#fscreatewritestreampath-options) の使用を検討してください。

[\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) を使用して `fs.writeFile()` をキャンセルできます。キャンセルは「ベストエフォート」であり、ある程度のデータは書き込まれる可能性があります。

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const controller = new AbortController();
const { signal } = controller;
const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, { signal }, (err) => {
  // リクエストが中止されると、AbortError でコールバックが呼び出されます
});
// リクエストを中止する必要がある場合
controller.abort();
```
進行中のリクエストを中止しても、個々のオペレーティング システムのリクエストは中止されませんが、`fs.writeFile` が実行する内部バッファリングは中止されます。


#### ファイル記述子での`fs.writeFile()`の使用 {#using-fswritefile-with-file-descriptors}

`file`がファイル記述子の場合、その動作は直接`fs.write()`を呼び出すのとほぼ同じです。

```js [ESM]
import { write } from 'node:fs';
import { Buffer } from 'node:buffer';

write(fd, Buffer.from(data, options.encoding), callback);
```
`fs.write()`を直接呼び出す場合との違いは、いくつかの異常な状況下では、`fs.write()`はバッファーの一部のみを書き込み、残りのデータを書き込むために再試行が必要になる可能性があるのに対し、`fs.writeFile()`はデータが完全に書き込まれる（またはエラーが発生する）まで再試行することです。

このことの含意は、一般的な混乱の原因です。ファイル記述子の場合、ファイルは置き換えられません！データが必ずしもファイルの先頭に書き込まれるとは限らず、ファイルの元のデータが新しく書き込まれたデータの前後にも残る可能性があります。

たとえば、`fs.writeFile()`が連続して2回呼び出され、最初に文字列`'Hello'`を書き込み、次に文字列`', World'`を書き込む場合、ファイルには`'Hello, World'`が含まれ、ファイルの元のデータの一部が含まれている可能性があります（元のファイルのサイズとファイル記述子の位置によって異なります）。ファイル記述子の代わりにファイル名が使用されていた場合、ファイルには`', World'`のみが含まれることが保証されます。

### `fs.writev(fd, buffers[, position], callback)` {#fswritevfd-buffers-position-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback`引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK`ではなく`ERR_INVALID_ARG_TYPE`がスローされるようになりました。 |
| v12.9.0 | 追加: v12.9.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)

`writev()`を使用して、`ArrayBufferView`の配列を`fd`で指定されたファイルに書き込みます。

`position`は、このデータを書き込む必要のあるファイルの先頭からのオフセットです。`typeof position !== 'number'`の場合、データは現在の位置に書き込まれます。

コールバックには、`err`、`bytesWritten`、`buffers`の3つの引数が与えられます。`bytesWritten`は、`buffers`から書き込まれたバイト数です。

このメソッドが[`util.promisify()`](/ja/nodejs/api/util#utilpromisifyoriginal)される場合、`bytesWritten`および`buffers`プロパティを持つ`Object`のpromiseを返します。

コールバックを待たずに同じファイルに対して複数回`fs.writev()`を使用するのは安全ではありません。このシナリオでは、[`fs.createWriteStream()`](/ja/nodejs/api/fs#fscreatewritestreampath-options)を使用してください。

Linuxでは、ファイルが追加モードで開かれている場合、位置指定書き込みは機能しません。カーネルはposition引数を無視し、常にデータの末尾に追加します。


## 同期 API {#synchronous-api}

同期 API はすべての操作を同期的に実行し、操作が完了または失敗するまでイベントループをブロックします。

### `fs.accessSync(path[, mode])` {#fsaccesssyncpath-mode}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v7.6.0 | `path` パラメーターは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v0.11.15 | v0.11.15 で追加 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `fs.constants.F_OK`

`path` で指定されたファイルまたはディレクトリに対するユーザーの権限を同期的にテストします。 `mode` 引数は、実行するアクセシビリティチェックを指定するオプションの整数です。 `mode` は、値 `fs.constants.F_OK`、または `fs.constants.R_OK`、`fs.constants.W_OK`、および `fs.constants.X_OK` のビット単位の OR で構成されるマスクのいずれかである必要があります（例：`fs.constants.W_OK | fs.constants.R_OK`）。 `mode` の可能な値については、[ファイルアクセス定数](/ja/nodejs/api/fs#file-access-constants)を確認してください。

アクセシビリティチェックのいずれかが失敗した場合、`Error` がスローされます。 それ以外の場合、このメソッドは `undefined` を返します。

```js [ESM]
import { accessSync, constants } from 'node:fs';

try {
  accessSync('etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can read/write');
} catch (err) {
  console.error('no access!');
}
```
### `fs.appendFileSync(path, data[, options])` {#fsappendfilesyncpath-data-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v21.1.0, v20.10.0 | `flush` オプションがサポートされるようになりました。 |
| v7.0.0 | 渡された `options` オブジェクトは変更されません。 |
| v5.0.0 | `file` パラメータはファイルディスクリプタになりました。 |
| v0.6.7 | v0.6.7 で追加 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイル名またはファイルディスクリプタ
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ファイルシステムの `flags` のサポート](/ja/nodejs/api/fs#file-system-flags)を参照してください。 **デフォルト:** `'a'`。
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、基になるファイル記述子は、閉じる前にフラッシュされます。 **デフォルト:** `false`。
  
 

ファイルにデータを同期的に追加します。ファイルが存在しない場合は作成します。 `data` は文字列または[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)にすることができます。

`mode` オプションは、新しく作成されたファイルにのみ影響します。 詳細については、[`fs.open()`](/ja/nodejs/api/fs#fsopenpath-flags-mode-callback)を参照してください。

```js [ESM]
import { appendFileSync } from 'node:fs';

try {
  appendFileSync('message.txt', 'data to append');
  console.log('The "data to append" was appended to file!');
} catch (err) {
  /* Handle the error */
}
```
`options` が文字列の場合、エンコーディングを指定します。

```js [ESM]
import { appendFileSync } from 'node:fs';

appendFileSync('message.txt', 'data to append', 'utf8');
```
`path` は、追加用にオープンされた数値ファイルディスクリプタとして指定できます（`fs.open()` または `fs.openSync()` を使用）。 ファイルディスクリプタは自動的に閉じられません。

```js [ESM]
import { openSync, closeSync, appendFileSync } from 'node:fs';

let fd;

try {
  fd = openSync('message.txt', 'a');
  appendFileSync(fd, 'data to append', 'utf8');
} catch (err) {
  /* Handle the error */
} finally {
  if (fd !== undefined)
    closeSync(fd);
}
```

### `fs.chmodSync(path, mode)` {#fschmodsyncpath-mode}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v7.6.0 | `path` パラメーターは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v0.6.7 | 追加: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

詳細については、このAPIの非同期バージョンのドキュメントを参照してください: [`fs.chmod()`](/ja/nodejs/api/fs#fschmodpath-mode-callback)。

詳細はPOSIXの[`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2)ドキュメントを参照してください。

### `fs.chownSync(path, uid, gid)` {#fschownsyncpath-uid-gid}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v7.6.0 | `path` パラメーターは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v0.1.97 | 追加: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ファイルの所有者とグループを同期的に変更します。 `undefined` を返します。 これは [`fs.chown()`](/ja/nodejs/api/fs#fschownpath-uid-gid-callback) の同期バージョンです。

詳細はPOSIXの[`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2)ドキュメントを参照してください。

### `fs.closeSync(fd)` {#fsclosesyncfd}

**追加: v0.1.21**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ファイル記述子を閉じます。 `undefined` を返します。

他の `fs` 操作で使用中のファイル記述子 (`fd`) に対して `fs.closeSync()` を呼び出すと、未定義の動作が発生する可能性があります。

詳細はPOSIXの[`close(2)`](http://man7.org/linux/man-pages/man2/close.2)ドキュメントを参照してください。


### `fs.copyFileSync(src, dest[, mode])` {#fscopyfilesyncsrc-dest-mode}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v14.0.0 | `flags` 引数を `mode` に変更し、より厳密な型の検証を課しました。 |
| v8.5.0 | 追加: v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) コピー元のファイル名
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) コピー先のファイル名
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) コピー操作の修飾子。**デフォルト:** `0`。

`src` を `dest` に同期的にコピーします。デフォルトでは、`dest` が既に存在する場合、上書きされます。`undefined` を返します。Node.js は、コピー操作のアトミック性について保証しません。書き込みのためにコピー先のファイルを開いた後にエラーが発生した場合、Node.js はコピー先の削除を試みます。

`mode` は、コピー操作の動作を指定するオプションの整数です。2つ以上の値のビット単位の OR で構成されるマスクを作成できます（例：`fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`）。

- `fs.constants.COPYFILE_EXCL`: `dest` が既に存在する場合、コピー操作は失敗します。
- `fs.constants.COPYFILE_FICLONE`: コピー操作は、copy-on-write reflink を作成しようとします。プラットフォームが copy-on-write をサポートしていない場合、フォールバック コピー機構が使用されます。
- `fs.constants.COPYFILE_FICLONE_FORCE`: コピー操作は、copy-on-write reflink を作成しようとします。プラットフォームが copy-on-write をサポートしていない場合、操作は失敗します。

```js [ESM]
import { copyFileSync, constants } from 'node:fs';

// destination.txt はデフォルトで作成または上書きされます。
copyFileSync('source.txt', 'destination.txt');
console.log('source.txt が destination.txt にコピーされました');

// COPYFILE_EXCL を使用すると、destination.txt が存在する場合、操作は失敗します。
copyFileSync('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
```

### `fs.cpSync(src, dest[, options])` {#fscpsyncsrc-dest-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v22.3.0 | このAPIはもはや実験的ではありません。 |
| v20.1.0, v18.17.0 | `fs.copyFile()` の `mode` 引数としてコピーの動作を指定する追加の `mode` オプションを受け入れます。 |
| v17.6.0, v16.15.0 | シンボリックリンクのパス解決を実行するかどうかを指定する追加の `verbatimSymlinks` オプションを受け入れます。 |
| v16.7.0 | Added in: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) コピー元のパス。
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) コピー先のパス。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) シンボリックリンクを解決します。**Default:** `false`。
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `force` が `false` のとき、コピー先にファイルが存在する場合にエラーを発生させます。**Default:** `false`。
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) コピーするファイル/ディレクトリをフィルタリングする関数。アイテムをコピーするには `true` を、無視するには `false` を返します。ディレクトリを無視すると、そのすべてのコンテンツもスキップされます。**Default:** `undefined`
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コピー元のパス。
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コピー先のパス。
    - 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `boolean` に型変換可能な `Promise` 以外の値。

    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 既存のファイルまたはディレクトリを上書きします。これを false に設定してコピー先にファイルが存在する場合、コピー操作はエラーを無視します。この動作を変更するには `errorOnExist` オプションを使用します。**Default:** `true`。
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) コピー操作の修飾子。**Default:** `0`。[`fs.copyFileSync()`](/ja/nodejs/api/fs#fscopyfilesyncsrc-dest-mode) の `mode` フラグを参照してください。
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` のとき、`src` のタイムスタンプが保持されます。**Default:** `false`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ディレクトリを再帰的にコピーします。**Default:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` のとき、シンボリックリンクのパス解決はスキップされます。**Default:** `false`

`src` から `dest` へ、サブディレクトリとファイルを含むディレクトリ構造全体を同期的にコピーします。

ディレクトリを別のディレクトリにコピーする場合、グロブはサポートされず、動作は `cp dir1/ dir2/` と似ています。


### `fs.existsSync(path)` {#fsexistssyncpath}

::: info [History]
| Version | Changes |
| --- | --- |
| v7.6.0 | `path` パラメーターは `file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v0.1.21 | Added in: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

パスが存在する場合は `true` 、そうでない場合は `false` を返します。

詳細については、この API の非同期バージョンのドキュメント [`fs.exists()`](/ja/nodejs/api/fs#fsexistspath-callback) を参照してください。

`fs.exists()` は非推奨ですが、 `fs.existsSync()` は非推奨ではありません。 `fs.exists()` の `callback` パラメーターは、他の Node.js コールバックと一貫性のないパラメーターを受け入れます。 `fs.existsSync()` はコールバックを使用しません。

```js [ESM]
import { existsSync } from 'node:fs';

if (existsSync('/etc/passwd'))
  console.log('The path exists.');
```
### `fs.fchmodSync(fd, mode)` {#fsfchmodsyncfd-mode}

**Added in: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ファイルのパーミッションを設定します。 `undefined` を返します。

詳細については、POSIX の [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) のドキュメントを参照してください。

### `fs.fchownSync(fd, uid, gid)` {#fsfchownsyncfd-uid-gid}

**Added in: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイルの新しい所有者のユーザー ID。
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイルの新しいグループのグループ ID。

ファイルの所有者を設定します。 `undefined` を返します。

詳細については、POSIX の [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) のドキュメントを参照してください。


### `fs.fdatasyncSync(fd)` {#fsfdatasyncsyncfd}

**Added in: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ファイルに関連付けられている現在キューに登録されているすべての I/O 操作を、オペレーティングシステムの同期 I/O 完了状態に強制します。詳細については、POSIX の [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) ドキュメントを参照してください。`undefined` を返します。

### `fs.fstatSync(fd[, options])` {#fsfstatsyncfd-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.5.0 | 返される数値が bigint であるかどうかを指定する追加の `options` オブジェクトを受け入れます。 |
| v0.1.95 | Added in: v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返される [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトの数値が `bigint` であるべきかどうか。**デフォルト:** `false`.

- 戻り値: [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats)

ファイルディスクリプタの [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) を取得します。

詳細については、POSIX の [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2) ドキュメントを参照してください。

### `fs.fsyncSync(fd)` {#fsfsyncsyncfd}

**Added in: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

オープンファイルディスクリプタのすべてのデータをストレージデバイスにフラッシュするように要求します。特定の実装は、オペレーティングシステムとデバイスに固有です。詳細については、POSIX の [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) ドキュメントを参照してください。`undefined` を返します。

### `fs.ftruncateSync(fd[, len])` {#fsftruncatesyncfd-len}

**Added in: v0.8.6**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0`

ファイルディスクリプタを切り捨てます。`undefined` を返します。

詳細については、この API の非同期バージョンのドキュメント [`fs.ftruncate()`](/ja/nodejs/api/fs#fsftruncatefd-len-callback) を参照してください。


### `fs.futimesSync(fd, atime, mtime)` {#fsfutimessyncfd-atime-mtime}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v4.1.0 | 数値文字列、`NaN`、および `Infinity` が時間指定子として許可されるようになりました。 |
| v0.4.2 | Added in: v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

[`fs.futimes()`](/ja/nodejs/api/fs#fsfutimesfd-atime-mtime-callback) の同期バージョンです。 `undefined` を返します。

### `fs.globSync(pattern[, options])` {#fsglobsyncpattern-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.2.0 | オプションとして `withFileTypes` のサポートを追加。 |
| v22.0.0 | Added in: v22.0.0 |
:::

::: warning [Stable: 1 - 実験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 現在の作業ディレクトリ。 **デフォルト:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) ファイル/ディレクトリを除外する関数。 アイテムを除外するには `true` を返し、含めるには `false` を返します。 **デフォルト:** `undefined`。
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) glob がパスを Dirent として返す場合は `true`、それ以外の場合は `false`。 **デフォルト:** `false`。


- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) パターンに一致するファイルのパス。

::: code-group
```js [ESM]
import { globSync } from 'node:fs';

console.log(globSync('**/*.js'));
```

```js [CJS]
const { globSync } = require('node:fs');

console.log(globSync('**/*.js'));
```
:::


### `fs.lchmodSync(path, mode)` {#fslchmodsyncpath-mode}

**Deprecated since: v0.4.7**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

シンボリックリンクの権限を変更します。 `undefined` を返します。

このメソッドは macOS でのみ実装されています。

詳細については、POSIX の [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2) ドキュメントを参照してください。

### `fs.lchownSync(path, uid, gid)` {#fslchownsyncpath-uid-gid}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.6.0 | この API は非推奨ではなくなりました。 |
| v0.4.7 | ドキュメントのみの非推奨。 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイルの新しい所有者のユーザー ID。
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイルの新しいグループのグループ ID。

パスの所有者を設定します。 `undefined` を返します。

詳細については、POSIX の [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) ドキュメントを参照してください。

### `fs.lutimesSync(path, atime, mtime)` {#fslutimessyncpath-atime-mtime}

**Added in: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

`path` によって参照されるシンボリックリンクのファイルシステムのタイムスタンプを変更します。 `undefined` を返します。パラメータが正しくない場合や操作が失敗した場合は、例外をスローします。 これは [`fs.lutimes()`](/ja/nodejs/api/fs#fslutimespath-atime-mtime-callback) の同期バージョンです。


### `fs.linkSync(existingPath, newPath)` {#fslinksyncexistingpath-newpath}

::: info [History]
| Version | Changes |
| --- | --- |
| v7.6.0 | `existingPath` および `newPath` パラメーターは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。現在、サポートはまだ *実験的* です。 |
| v0.1.31 | Added in: v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)

`existingPath` から `newPath` への新しいリンクを作成します。詳細については、POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) のドキュメントを参照してください。`undefined` を返します。

### `fs.lstatSync(path[, options])` {#fslstatsyncpath-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.3.0, v14.17.0 | エントリが存在しない場合に例外をスローするかどうかを指定する `throwIfNoEntry` オプションを受け入れます。 |
| v10.5.0 | 返される数値が bigint であるかどうかを指定するために、追加の `options` オブジェクトを受け入れます。 |
| v7.6.0 | `path` パラメーターは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v0.1.30 | Added in: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返される[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats)オブジェクトの数値が`bigint`であるかどうか。**デフォルト:** `false`。
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ファイルシステムエントリが存在しない場合に、`undefined`を返すのではなく例外をスローするかどうか。**デフォルト:** `true`。

- Returns: [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats)

`path` が参照するシンボリックリンクの[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats)を取得します。

詳細については、POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) のドキュメントを参照してください。


### `fs.mkdirSync(path[, options])` {#fsmkdirsyncpath-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.11.0, v12.17.0 | `recursive` モードで、最初に作成されたパスが返されるようになりました。 |
| v10.12.0 | 2番目の引数は、`recursive` および `mode` プロパティを持つ `options` オブジェクトにすることができます。 |
| v7.6.0 | `path` パラメーターは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v0.1.21 | 追加: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Windowsではサポートされていません。 **デフォルト:** `0o777`.
  
 
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

ディレクトリを同期的に作成します。 `undefined` を返すか、`recursive` が `true` の場合は、最初に作成されたディレクトリパスを返します。 これは、[`fs.mkdir()`](/ja/nodejs/api/fs#fsmkdirpath-options-callback) の同期バージョンです。

詳細については、POSIX の [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) のドキュメントを参照してください。

### `fs.mkdtempSync(prefix[, options])` {#fsmkdtempsyncprefix-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.6.0, v18.19.0 | `prefix` パラメーターでバッファーと URL を受け入れるようになりました。 |
| v16.5.0, v14.18.0 | `prefix` パラメーターで空文字列を受け入れるようになりました。 |
| v5.10.0 | 追加: v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `'utf8'`
  
 
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

作成されたディレクトリパスを返します。

詳細については、このAPIの非同期バージョンのドキュメントを参照してください: [`fs.mkdtemp()`](/ja/nodejs/api/fs#fsmkdtempprefix-options-callback)。

オプションの `options` 引数には、エンコーディングを指定する文字列、または使用する文字エンコーディングを指定する `encoding` プロパティを持つオブジェクトを指定できます。


### `fs.opendirSync(path[, options])` {#fsopendirsyncpath-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.1.0, v18.17.0 | `recursive` オプションが追加されました。 |
| v13.1.0, v12.16.0 | `bufferSize` オプションが導入されました。 |
| v12.12.0 | Added in: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ディレクトリから読み込む際に内部でバッファリングされるディレクトリ エントリの数。値を大きくするとパフォーマンスが向上しますが、メモリ使用量が増加します。**デフォルト:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `false`
  
 
- 戻り値: [\<fs.Dir\>](/ja/nodejs/api/fs#class-fsdir)

ディレクトリを同期的に開きます。[`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) を参照してください。

[\<fs.Dir\>](/ja/nodejs/api/fs#class-fsdir) を作成します。これには、ディレクトリからの読み取りおよびクリーンアップのためのすべての関数が含まれています。

`encoding` オプションは、ディレクトリを開く際と後続の読み取り操作の際に、`path` のエンコーディングを設定します。

### `fs.openSync(path[, flags[, mode]])` {#fsopensyncpath-flags-mode}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v11.1.0 | `flags` 引数はオプションになり、デフォルトは `'r'` になりました。 |
| v9.9.0 | `as` および `as+` フラグがサポートされるようになりました。 |
| v7.6.0 | `path` パラメーターは `file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v0.1.21 | Added in: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `'r'`. [ファイルシステムの `flags` のサポート](/ja/nodejs/api/fs#file-system-flags) を参照してください。
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0o666`
- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

ファイル記述子を表す整数を返します。

詳細については、この API の非同期バージョンのドキュメントを参照してください: [`fs.open()`](/ja/nodejs/api/fs#fsopenpath-flags-mode-callback)。


### `fs.readdirSync(path[, options])` {#fsreaddirsyncpath-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.1.0, v18.17.0 | `recursive` オプションが追加されました。 |
| v10.10.0 | 新しいオプション `withFileTypes` が追加されました。 |
| v7.6.0 | `path` パラメーターは `file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v0.1.21 | 追加: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、ディレクトリの内容を再帰的に読み取ります。 再帰モードでは、すべてのファイル、サブファイル、およびディレクトリがリストされます。 **デフォルト:** `false`。


- 戻り値: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ja/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/ja/nodejs/api/fs#class-fsdirent)

ディレクトリの内容を読み取ります。

詳細については、POSIX の [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) ドキュメントを参照してください。

オプションの `options` 引数は、エンコーディングを指定する文字列、または返されるファイル名に使用する文字エンコーディングを指定する `encoding` プロパティを持つオブジェクトにすることができます。 `encoding` が `'buffer'` に設定されている場合、返されるファイル名は [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) オブジェクトとして渡されます。

`options.withFileTypes` が `true` に設定されている場合、結果には [\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) オブジェクトが含まれます。


### `fs.readFileSync(path[, options])` {#fsreadfilesyncpath-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v7.6.0 | `path` パラメーターは、`file:` プロトコルを使用した WHATWG `URL` オブジェクトにできます。 |
| v5.0.0 | `path` パラメーターはファイル記述子にできます。 |
| v0.1.8 | 追加: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイル名またはファイル記述子
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ファイルシステムの`flag`のサポート](/ja/nodejs/api/fs#file-system-flags)を参照してください。 **デフォルト:** `'r'`。
  
 
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

`path` の内容を返します。

詳細については、このAPIの非同期バージョンのドキュメントを参照してください: [`fs.readFile()`](/ja/nodejs/api/fs#fsreadfilepath-options-callback)。

`encoding` オプションが指定されている場合、この関数は文字列を返します。それ以外の場合は、バッファーを返します。

[`fs.readFile()`](/ja/nodejs/api/fs#fsreadfilepath-options-callback)と同様に、パスがディレクトリの場合、`fs.readFileSync()`の動作はプラットフォームによって異なります。

```js [ESM]
import { readFileSync } from 'node:fs';

// macOS、Linux、およびWindows
readFileSync('<directory>');
// => [Error: EISDIR: ディレクトリに対する不正な操作、read <directory>]

//  FreeBSD
readFileSync('<directory>'); // => <data>
```

### `fs.readlinkSync(path[, options])` {#fsreadlinksyncpath-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v7.6.0 | `path` 引数は `file:` プロトコルを使用した WHATWG `URL` オブジェクトにできます。 |
| v0.1.31 | 追加: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `'utf8'`
  
 
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

シンボリックリンクの文字列値を返します。

詳細については、POSIX の [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) ドキュメントを参照してください。

オプションの `options` 引数は、エンコーディングを指定する文字列、または返されるリンクパスに使用する文字エンコーディングを指定する `encoding` プロパティを持つオブジェクトにできます。 `encoding` が `'buffer'` に設定されている場合、返されるリンクパスは [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) オブジェクトとして渡されます。

### `fs.readSync(fd, buffer, offset, length[, position])` {#fsreadsyncfd-buffer-offset-length-position}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.10.0 | `buffer` 引数は任意の `TypedArray` または `DataView` になりました。 |
| v6.0.0 | `length` 引数は `0` になりました。 |
| v0.1.21 | 追加: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `null`
- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`bytesRead` の数を返します。

詳細については、この API の非同期バージョンのドキュメントを参照してください: [`fs.read()`](/ja/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback)。


### `fs.readSync(fd, buffer[, options])` {#fsreadsyncfd-buffer-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v13.13.0, v12.17.0 | オプションオブジェクトを渡して、offset、length、position をオプションにできるようになりました。 |
| v13.13.0, v12.17.0 | Added in: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Default:** `null`
  
 
- Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`bytesRead` の数を返します。

上記の `fs.readSync` 関数と同様に、このバージョンはオプションの `options` オブジェクトを受け取ります。`options` オブジェクトが指定されていない場合は、上記のデフォルト値が使用されます。

詳細については、この API の非同期バージョンのドキュメントを参照してください: [`fs.read()`](/ja/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback)。

### `fs.readvSync(fd, buffers[, position])` {#fsreadvsyncfd-buffers-position}

**Added in: v13.13.0, v12.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Default:** `null`
- Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 読み込まれたバイト数。

詳細については、この API の非同期バージョンのドキュメントを参照してください: [`fs.readv()`](/ja/nodejs/api/fs#fsreadvfd-buffers-position-callback)。


### `fs.realpathSync(path[, options])` {#fsrealpathsyncpath-options}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v8.0.0 | パイプ/ソケットの解決のサポートが追加されました。 |
| v7.6.0 | `path` パラメータは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v6.4.0 | `realpathSync` の呼び出しが、Windows のさまざまなエッジケースで再び機能するようになりました。 |
| v6.0.0 | `cache` パラメータが削除されました。 |
| v0.1.31 | 追加: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `'utf8'`
  
 
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

解決されたパス名を返します。

詳細については、このAPIの非同期バージョンのドキュメントを参照してください: [`fs.realpath()`](/ja/nodejs/api/fs#fsrealpathpath-options-callback)。

### `fs.realpathSync.native(path[, options])` {#fsrealpathsyncnativepath-options}

**追加: v9.2.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `'utf8'`
  
 
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

同期 [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3)。

UTF8文字列に変換できるパスのみがサポートされています。

オプションの `options` 引数は、エンコーディングを指定する文字列、または返されるパスに使用する文字エンコーディングを指定する `encoding` プロパティを持つオブジェクトにすることができます。 `encoding` が `'buffer'` に設定されている場合、返されるパスは [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) オブジェクトとして渡されます。

Linuxでは、Node.jsがmusl libcにリンクされている場合、この関数が動作するためには、procfsファイルシステムが`/proc`にマウントされている必要があります。 Glibcにはこの制限はありません。


### `fs.renameSync(oldPath, newPath)` {#fsrenamesyncoldpath-newpath}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v7.6.0 | `oldPath` と `newPath` パラメータは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 現在、サポートはまだ*実験的*です。 |
| v0.1.21 | Added in: v0.1.21 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)

`oldPath` から `newPath` にファイル名を変更します。 `undefined` を返します。

詳細は、POSIX [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2) のドキュメントを参照してください。

### `fs.rmdirSync(path[, options])` {#fsrmdirsyncpath-options}

::: info [沿革]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | ファイルである `path` で `fs.rmdirSync(path, { recursive: true })` を使用することは許可されなくなり、Windows では `ENOENT` エラー、POSIX では `ENOTDIR` エラーが発生します。 |
| v16.0.0 | 存在しない `path` で `fs.rmdirSync(path, { recursive: true })` を使用することは許可されなくなり、`ENOENT` エラーが発生します。 |
| v16.0.0 | `recursive` オプションは非推奨であり、使用すると非推奨警告が発生します。 |
| v14.14.0 | `recursive` オプションは非推奨です。代わりに `fs.rmSync` を使用してください。 |
| v13.3.0, v12.16.0 | `maxBusyTries` オプションの名前が `maxRetries` に変更され、デフォルトは 0 になりました。 `emfileWait` オプションは削除され、`EMFILE` エラーは他のエラーと同じ再試行ロジックを使用します。 `retryDelay` オプションがサポートされるようになりました。 `ENFILE` エラーが再試行されるようになりました。 |
| v12.10.0 | `recursive`、`maxBusyTries`、および `emfileWait` オプションがサポートされるようになりました。 |
| v7.6.0 | `path` パラメータは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v0.1.21 | Added in: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `EBUSY`、`EMFILE`、`ENFILE`、`ENOTEMPTY`、または `EPERM` エラーが発生した場合、Node.js は試行ごとに `retryDelay` ミリ秒長い線形バックオフ待機で操作を再試行します。 このオプションは、再試行回数を表します。 `recursive` オプションが `true` でない場合、このオプションは無視されます。 **デフォルト:** `0`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、再帰的なディレクトリ削除を実行します。 再帰モードでは、操作は失敗時に再試行されます。 **デフォルト:** `false`。 **非推奨。**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 再試行間の待機時間（ミリ秒単位）。 `recursive` オプションが `true` でない場合、このオプションは無視されます。 **デフォルト:** `100`。

同期的な [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2)。 `undefined` を返します。

ファイル（ディレクトリではない）で `fs.rmdirSync()` を使用すると、Windows では `ENOENT` エラー、POSIX では `ENOTDIR` エラーが発生します。

`rm -rf` Unix コマンドと同様の動作を得るには、`{ recursive: true, force: true }` オプションを指定して [`fs.rmSync()`](/ja/nodejs/api/fs#fsrmsyncpath-options) を使用します。


### `fs.rmSync(path[, options])` {#fsrmsyncpath-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v17.3.0, v16.14.0 | `path` パラメーターは `file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v14.14.0 | Added in: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`path` が存在しない場合、例外は無視されます。**デフォルト:** `false`。
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `EBUSY`、`EMFILE`、`ENFILE`、`ENOTEMPTY`、または `EPERM` エラーが発生した場合、Node.js は試行ごとに `retryDelay` ミリ秒ずつ長くなる線形バックオフ待機で操作を再試行します。このオプションは、再試行回数を表します。このオプションは、`recursive` オプションが `true` でない場合は無視されます。**デフォルト:** `0`。
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、再帰的なディレクトリ削除を実行します。再帰モードでは、操作は失敗時に再試行されます。**デフォルト:** `false`。
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 再試行の間隔をミリ秒単位で指定します。このオプションは、`recursive` オプションが `true` でない場合は無視されます。**デフォルト:** `100`。

ファイルとディレクトリを同期的に削除します (標準の POSIX `rm` ユーティリティをモデル化)。`undefined` を返します。

### `fs.statSync(path[, options])` {#fsstatsyncpath-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.3.0, v14.17.0 | エントリが存在しない場合に例外をスローするかどうかを指定する `throwIfNoEntry` オプションを受け入れます。 |
| v10.5.0 | 返される数値が bigint であるかどうかを指定するために、追加の `options` オブジェクトを受け入れます。 |
| v7.6.0 | `path` パラメーターは `file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v0.1.21 | Added in: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返される[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトの数値が `bigint` であるかどうか。**デフォルト:** `false`。
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ファイルシステムエントリが存在しない場合に、`undefined` を返すのではなく、例外をスローするかどうか。**デフォルト:** `true`。

- 戻り値: [\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats)

パスの[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) を取得します。


### `fs.statfsSync(path[, options])` {#fsstatfssyncpath-options}

**Added in: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 返される[\<fs.StatFs\>](/ja/nodejs/api/fs#class-fsstatfs)オブジェクトの数値が`bigint`であるべきかどうか。**デフォルト:** `false`。


- 戻り値: [\<fs.StatFs\>](/ja/nodejs/api/fs#class-fsstatfs)

[`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2)の同期版。 `path`を含むマウントされたファイルシステムに関する情報を返します。

エラーが発生した場合、`err.code`は[共通システムエラー](/ja/nodejs/api/errors#common-system-errors)のいずれかになります。

### `fs.symlinkSync(target, path[, type])` {#fssymlinksynctarget-path-type}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.0.0 | `type`引数が未定義のままの場合、Nodeは`target`のタイプを自動検出し、自動的に`dir`または`file`を選択します。 |
| v7.6.0 | `target`および`path`パラメーターは、`file:`プロトコルを使用してWHATWG `URL`オブジェクトにすることができます。 現在、サポートはまだ*実験的*です。 |
| v0.1.31 | Added in: v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `null`

`undefined`を返します。

詳細については、このAPIの非同期バージョンのドキュメントを参照してください: [`fs.symlink()`](/ja/nodejs/api/fs#fssymlinktarget-path-type-callback)。


### `fs.truncateSync(path[, len])` {#fstruncatesyncpath-len}

**Added in: v0.8.6**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0`

ファイルを切り詰めます。 `undefined` を返します。 ファイル記述子を最初の引数として渡すこともできます。 この場合、 `fs.ftruncateSync()` が呼び出されます。

ファイル記述子を渡すことは非推奨であり、将来エラーがスローされる可能性があります。

### `fs.unlinkSync(path)` {#fsunlinksyncpath}


::: info [History]
| Version | Changes |
| --- | --- |
| v7.6.0 | `path` パラメータは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v0.1.21 | Added in: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)

同期的な [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2)。 `undefined` を返します。

### `fs.utimesSync(path, atime, mtime)` {#fsutimessyncpath-atime-mtime}


::: info [History]
| Version | Changes |
| --- | --- |
| v8.0.0 | `NaN`、`Infinity`、および `-Infinity` は、有効な時間指定子ではなくなりました。 |
| v7.6.0 | `path` パラメータは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v4.1.0 | 数値文字列、`NaN`、および `Infinity` が時間指定子として許可されるようになりました。 |
| v0.4.2 | Added in: v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

`undefined` を返します。

詳細については、このAPIの非同期バージョンのドキュメントを参照してください：[`fs.utimes()`](/ja/nodejs/api/fs#fsutimespath-atime-mtime-callback)。


### `fs.writeFileSync(file, data[, options])` {#fswritefilesyncfile-data-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0, v20.10.0 | `flush` オプションがサポートされるようになりました。 |
| v19.0.0 | 独自の `toString` 関数を持つオブジェクトを `data` パラメータに渡すことはサポートされなくなりました。 |
| v17.8.0 | 独自の `toString` 関数を持つオブジェクトを `data` パラメータに渡すことは非推奨になりました。 |
| v14.12.0 | `data` パラメータは、明示的な `toString` 関数を持つオブジェクトを文字列化します。 |
| v14.0.0 | `data` パラメータは、サポートされていない入力を文字列に強制変換しなくなりました。 |
| v10.10.0 | `data` パラメータは、任意の `TypedArray` または `DataView` を指定できるようになりました。 |
| v7.4.0 | `data` パラメータは、`Uint8Array` を指定できるようになりました。 |
| v5.0.0 | `file` パラメータは、ファイル記述子を指定できるようになりました。 |
| v0.1.29 | Added in: v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ファイル名またはファイル記述子
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **デフォルト:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [ファイルシステム `flags` のサポート](/ja/nodejs/api/fs#file-system-flags)を参照してください。 **デフォルト:** `'w'`。
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) すべてのデータがファイルに正常に書き込まれ、`flush` が `true` の場合、`fs.fsyncSync()` がデータのフラッシュに使用されます。
  
 

返り値: `undefined`.

`mode` オプションは、新しく作成されたファイルにのみ影響します。 詳細は、[`fs.open()`](/ja/nodejs/api/fs#fsopenpath-flags-mode-callback) を参照してください。

詳細については、このAPIの非同期バージョンのドキュメントを参照してください: [`fs.writeFile()`](/ja/nodejs/api/fs#fswritefilefile-data-options-callback)。


### `fs.writeSync(fd, buffer, offset[, length[, position]])` {#fswritesyncfd-buffer-offset-length-position}

::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | `buffer` パラメータは、サポートされていない入力を文字列に強制変換しなくなりました。 |
| v10.10.0 | `buffer` パラメータは、任意の `TypedArray` または `DataView` になれるようになりました。 |
| v7.4.0 | `buffer` パラメータは、`Uint8Array` になれるようになりました。 |
| v7.2.0 | `offset` と `length` パラメータはオプションになりました。 |
| v0.1.21 | Added in: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Default:** `null`
- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込まれたバイト数。

詳細については、このAPIの非同期バージョンのドキュメントを参照してください: [`fs.write(fd, buffer...)`](/ja/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback)。

### `fs.writeSync(fd, buffer[, options])` {#fswritesyncfd-buffer-options}

**Added in: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `null`
  
 
- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込まれたバイト数。

詳細については、このAPIの非同期バージョンのドキュメントを参照してください: [`fs.write(fd, buffer...)`](/ja/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback)。


### `fs.writeSync(fd, string[, position[, encoding]])` {#fswritesyncfd-string-position-encoding}

::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | `string` パラメーターは、サポートされていない入力を文字列に強制変換しなくなりました。 |
| v7.2.0 | `position` パラメーターはオプションになりました。 |
| v0.11.5 | Added in: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Default:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'utf8'`
- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込まれたバイト数。

詳細については、このAPIの非同期バージョンのドキュメントを参照してください: [`fs.write(fd, string...)`](/ja/nodejs/api/fs#fswritefd-string-position-encoding-callback).

### `fs.writevSync(fd, buffers[, position])` {#fswritevsyncfd-buffers-position}

**Added in: v12.9.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Default:** `null`
- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 書き込まれたバイト数。

詳細については、このAPIの非同期バージョンのドキュメントを参照してください: [`fs.writev()`](/ja/nodejs/api/fs#fswritevfd-buffers-position-callback).

## Common Objects {#common-objects}

共通オブジェクトは、すべてのファイルシステムAPIバリアント（promise、callback、およびsynchronous）で共有されます。


### クラス: `fs.Dir` {#class-fsdir}

**追加:** v12.12.0

ディレクトリストリームを表すクラス。

[`fs.opendir()`](/ja/nodejs/api/fs#fsopendirpath-options-callback)、[`fs.opendirSync()`](/ja/nodejs/api/fs#fsopendirsyncpath-options)、または [`fsPromises.opendir()`](/ja/nodejs/api/fs#fspromisesopendirpath-options) によって作成されます。

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
async イテレータを使用すると、[\<fs.Dir\>](/ja/nodejs/api/fs#class-fsdir) オブジェクトはイテレータの終了後に自動的に閉じられます。

#### `dir.close()` {#dirclose}

**追加:** v12.12.0

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

ディレクトリの基になるリソースハンドルを非同期的に閉じます。後続の読み取りはエラーになります。

リソースが閉じられた後に fulfilled される Promise が返されます。

#### `dir.close(callback)` {#dirclosecallback}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v12.12.0 | 追加: v12.12.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

ディレクトリの基になるリソースハンドルを非同期的に閉じます。後続の読み取りはエラーになります。

`callback` は、リソースハンドルが閉じられた後に呼び出されます。

#### `dir.closeSync()` {#dirclosesync}

**追加:** v12.12.0

ディレクトリの基になるリソースハンドルを同期的に閉じます。後続の読み取りはエラーになります。

#### `dir.path` {#dirpath}

**追加:** v12.12.0

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

[`fs.opendir()`](/ja/nodejs/api/fs#fsopendirpath-options-callback)、[`fs.opendirSync()`](/ja/nodejs/api/fs#fsopendirsyncpath-options)、または [`fsPromises.opendir()`](/ja/nodejs/api/fs#fspromisesopendirpath-options) に提供された、このディレクトリの読み取り専用パス。


#### `dir.read()` {#dirread}

**Added in: v12.12.0**

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) で解決されます。

[`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3)を介して次のディレクトリエントリを非同期的に[\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent)として読み取ります。

[\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent)または、読み取るディレクトリエントリがなくなった場合は`null`で解決されるPromiseが返されます。

この関数によって返されるディレクトリ エントリは、オペレーティング システムの基盤となるディレクトリ メカニズムによって提供されるため、特定の順序にはなりません。ディレクトリの反復処理中にエントリが追加または削除された場合、反復処理の結果に含まれない可能性があります。

#### `dir.read(callback)` {#dirreadcallback}

**Added in: v12.12.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dirent` [\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
  
 

[`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3)を介して次のディレクトリエントリを非同期的に[\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent)として読み取ります。

読み取りが完了すると、`callback`が[\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent)で呼び出されるか、読み取るディレクトリ エントリがなくなった場合は`null`で呼び出されます。

この関数によって返されるディレクトリ エントリは、オペレーティング システムの基盤となるディレクトリ メカニズムによって提供されるため、特定の順序にはなりません。ディレクトリの反復処理中にエントリが追加または削除された場合、反復処理の結果に含まれない可能性があります。

#### `dir.readSync()` {#dirreadsync}

**Added in: v12.12.0**

- 戻り値: [\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

次のディレクトリ エントリを[\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent)として同期的に読み取ります。詳細については、POSIXの[`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3)のドキュメントを参照してください。

読み取るディレクトリ エントリがなくなった場合は、`null`が返されます。

この関数によって返されるディレクトリ エントリは、オペレーティング システムの基盤となるディレクトリ メカニズムによって提供されるため、特定の順序にはなりません。ディレクトリの反復処理中にエントリが追加または削除された場合、反復処理の結果に含まれない可能性があります。


#### `dir[Symbol.asyncIterator]()` {#dirsymbolasynciterator}

**Added in: v12.12.0**

- 戻り値: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) [\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) の AsyncIterator

すべてのエントリが読み込まれるまで、ディレクトリを非同期にイテレートします。詳細については、POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) ドキュメントを参照してください。

async iterator によって返されるエントリは、常に [\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) です。`dir.read()` の `null` の場合は内部で処理されます。

例については、[\<fs.Dir\>](/ja/nodejs/api/fs#class-fsdir) を参照してください。

このイテレータによって返されるディレクトリ エントリは、オペレーティング システムの基盤となるディレクトリ メカニズムによって提供されるため、特定の順序ではありません。ディレクトリの反復処理中に追加または削除されたエントリは、反復処理の結果に含まれない場合があります。

### クラス: `fs.Dirent` {#class-fsdirent}

**Added in: v10.10.0**

[\<fs.Dir\>](/ja/nodejs/api/fs#class-fsdir) からの読み取りによって返される、ディレクトリ内のファイルまたはサブディレクトリであるディレクトリ エントリの表現。ディレクトリ エントリは、ファイル名とファイルタイプのペアの組み合わせです。

さらに、[`fs.readdir()`](/ja/nodejs/api/fs#fsreaddirpath-options-callback) または [`fs.readdirSync()`](/ja/nodejs/api/fs#fsreaddirsyncpath-options) が `withFileTypes` オプションを `true` に設定して呼び出された場合、結果の配列は、文字列または [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) ではなく、[\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) オブジェクトで埋められます。

#### `dirent.isBlockDevice()` {#direntisblockdevice}

**Added in: v10.10.0**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) オブジェクトがブロック デバイスを表す場合は `true` を返します。

#### `dirent.isCharacterDevice()` {#direntischaracterdevice}

**Added in: v10.10.0**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) オブジェクトが文字デバイスを表す場合は `true` を返します。


#### `dirent.isDirectory()` {#direntisdirectory}

**Added in: v10.10.0**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) オブジェクトがファイルシステムのディレクトリを表す場合は `true` を返します。

#### `dirent.isFIFO()` {#direntisfifo}

**Added in: v10.10.0**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) オブジェクトが FIFO (first-in-first-out) パイプを表す場合は `true` を返します。

#### `dirent.isFile()` {#direntisfile}

**Added in: v10.10.0**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) オブジェクトが通常のファイルを表す場合は `true` を返します。

#### `dirent.isSocket()` {#direntissocket}

**Added in: v10.10.0**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) オブジェクトがソケットを表す場合は `true` を返します。

#### `dirent.isSymbolicLink()` {#direntissymboliclink}

**Added in: v10.10.0**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) オブジェクトがシンボリックリンクを表す場合は `true` を返します。

#### `dirent.name` {#direntname}

**Added in: v10.10.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

この [\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) オブジェクトが参照するファイル名。 この値の型は、[`fs.readdir()`](/ja/nodejs/api/fs#fsreaddirpath-options-callback) または [`fs.readdirSync()`](/ja/nodejs/api/fs#fsreaddirsyncpath-options) に渡された `options.encoding` によって決まります。

#### `dirent.parentPath` {#direntparentpath}

**Added in: v21.4.0, v20.12.0, v18.20.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

この [\<fs.Dirent\>](/ja/nodejs/api/fs#class-fsdirent) オブジェクトが参照するファイルの親ディレクトリへのパス。


#### `dirent.path` {#direntpath}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.2.0 | このプロパティは読み取り専用ではなくなりました。 |
| v23.0.0 | このプロパティにアクセスすると警告が発生します。 読み取り専用になりました。 |
| v21.5.0, v20.12.0, v18.20.0 | 非推奨: v21.5.0, v20.12.0, v18.20.0 以降 |
| v20.1.0, v18.17.0 | 追加: v20.1.0, v18.17.0 |
:::

::: danger [Stable: 0 - 非推奨]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: 代わりに [`dirent.parentPath`](/ja/nodejs/api/fs#direntparentpath) を使用してください。
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`dirent.parentPath` のエイリアス。

### Class: `fs.FSWatcher` {#class-fsfswatcher}

**追加: v0.5.8**

- [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter) を拡張

[`fs.watch()`](/ja/nodejs/api/fs#fswatchfilename-options-listener) メソッドの呼び出しが成功すると、新しい [\<fs.FSWatcher\>](/ja/nodejs/api/fs#class-fsfswatcher) オブジェクトが返されます。

すべての [\<fs.FSWatcher\>](/ja/nodejs/api/fs#class-fsfswatcher) オブジェクトは、特定の監視対象ファイルが変更されると常に `'change'` イベントを発行します。

#### Event: `'change'` {#event-change}

**追加: v0.5.8**

- `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 発生した変更イベントのタイプ
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) 変更されたファイル名（関連/利用可能な場合）

監視対象のディレクトリまたはファイルで何らかの変更が発生した場合に発行されます。 詳細については、[`fs.watch()`](/ja/nodejs/api/fs#fswatchfilename-options-listener) を参照してください。

`filename` 引数は、オペレーティングシステムのサポートによっては提供されない場合があります。 `filename` が提供される場合、`fs.watch()` が `encoding` オプションを `'buffer'` に設定して呼び出されると、[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) として提供され、それ以外の場合は `filename` は UTF-8 文字列になります。

```js [ESM]
import { watch } from 'node:fs';
// fs.watch() リスナーを通じて処理される場合の例
watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // 出力: <Buffer ...>
  }
});
```

#### イベント: `'close'` {#event-close_1}

**追加:** v10.0.0

ウォッチャーが変更の監視を停止したときに発生します。クローズされた[\<fs.FSWatcher\>](/ja/nodejs/api/fs#class-fsfswatcher)オブジェクトは、イベントハンドラーではもう使用できません。

#### イベント: `'error'` {#event-error}

**追加:** v0.5.8

- `error` [\<Error\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error)

ファイルの監視中にエラーが発生した場合に発生します。エラーが発生した[\<fs.FSWatcher\>](/ja/nodejs/api/fs#class-fsfswatcher)オブジェクトは、イベントハンドラーではもう使用できません。

#### `watcher.close()` {#watcherclose}

**追加:** v0.5.8

指定された[\<fs.FSWatcher\>](/ja/nodejs/api/fs#class-fsfswatcher)での変更の監視を停止します。停止すると、[\<fs.FSWatcher\>](/ja/nodejs/api/fs#class-fsfswatcher)オブジェクトはもう使用できません。

#### `watcher.ref()` {#watcherref}

**追加:** v14.3.0, v12.20.0

- 戻り値: [\<fs.FSWatcher\>](/ja/nodejs/api/fs#class-fsfswatcher)

呼び出されると、Node.jsイベントループが[\<fs.FSWatcher\>](/ja/nodejs/api/fs#class-fsfswatcher)がアクティブである限り終了*しない*ように要求します。`watcher.ref()`を複数回呼び出しても効果はありません。

デフォルトでは、すべての[\<fs.FSWatcher\>](/ja/nodejs/api/fs#class-fsfswatcher)オブジェクトは「ref」になっているため、通常、以前に`watcher.unref()`が呼び出されていない限り、`watcher.ref()`を呼び出す必要はありません。

#### `watcher.unref()` {#watcherunref}

**追加:** v14.3.0, v12.20.0

- 戻り値: [\<fs.FSWatcher\>](/ja/nodejs/api/fs#class-fsfswatcher)

呼び出されると、アクティブな[\<fs.FSWatcher\>](/ja/nodejs/api/fs#class-fsfswatcher)オブジェクトは、Node.jsイベントループがアクティブな状態を維持することを要求しません。イベントループを稼働させ続ける他のアクティビティがない場合、[\<fs.FSWatcher\>](/ja/nodejs/api/fs#class-fsfswatcher)オブジェクトのコールバックが呼び出される前にプロセスが終了する可能性があります。`watcher.unref()`を複数回呼び出しても効果はありません。

### クラス: `fs.StatWatcher` {#class-fsstatwatcher}

**追加:** v14.3.0, v12.20.0

- 拡張: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

`fs.watchFile()`メソッドへの呼び出しが成功すると、新しい[\<fs.StatWatcher\>](/ja/nodejs/api/fs#class-fsstatwatcher)オブジェクトが返されます。

#### `watcher.ref()` {#watcherref_1}

**追加:** v14.3.0, v12.20.0

- 戻り値: [\<fs.StatWatcher\>](/ja/nodejs/api/fs#class-fsstatwatcher)

呼び出されると、Node.jsイベントループが[\<fs.StatWatcher\>](/ja/nodejs/api/fs#class-fsstatwatcher)がアクティブである限り終了*しない*ように要求します。`watcher.ref()`を複数回呼び出しても効果はありません。

デフォルトでは、すべての[\<fs.StatWatcher\>](/ja/nodejs/api/fs#class-fsstatwatcher)オブジェクトは「ref」になっているため、通常、以前に`watcher.unref()`が呼び出されていない限り、`watcher.ref()`を呼び出す必要はありません。


#### `watcher.unref()` {#watcherunref_1}

**追加:** v14.3.0, v12.20.0

- 戻り値: [\<fs.StatWatcher\>](/ja/nodejs/api/fs#class-fsstatwatcher)

呼び出されると、アクティブな [\<fs.StatWatcher\>](/ja/nodejs/api/fs#class-fsstatwatcher) オブジェクトは、Node.js イベントループがアクティブな状態を維持することを要求しません。イベントループを稼働させ続ける他のアクティビティがない場合、[\<fs.StatWatcher\>](/ja/nodejs/api/fs#class-fsstatwatcher) オブジェクトのコールバックが呼び出される前にプロセスが終了する可能性があります。`watcher.unref()`を複数回呼び出しても効果はありません。

### クラス: `fs.ReadStream` {#class-fsreadstream}

**追加:** v0.1.93

- 拡張: [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable)

[\<fs.ReadStream\>](/ja/nodejs/api/fs#class-fsreadstream) のインスタンスは、[`fs.createReadStream()`](/ja/nodejs/api/fs#fscreatereadstreampath-options) 関数を使用して作成および返されます。

#### イベント: `'close'` {#event-close_2}

**追加:** v0.1.93

[\<fs.ReadStream\>](/ja/nodejs/api/fs#class-fsreadstream) の基になるファイル記述子が閉じられたときに発生します。

#### イベント: `'open'` {#event-open}

**追加:** v0.1.93

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [\<fs.ReadStream\>](/ja/nodejs/api/fs#class-fsreadstream) によって使用される整数のファイル記述子。

[\<fs.ReadStream\>](/ja/nodejs/api/fs#class-fsreadstream) のファイル記述子が開かれたときに発生します。

#### イベント: `'ready'` {#event-ready}

**追加:** v9.11.0

[\<fs.ReadStream\>](/ja/nodejs/api/fs#class-fsreadstream) が使用できる状態になったときに発生します。

`'open'` の直後に発火します。

#### `readStream.bytesRead` {#readstreambytesread}

**追加:** v6.4.0

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

これまでに読み取られたバイト数。

#### `readStream.path` {#readstreampath}

**追加:** v0.1.93

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

ストリームが読み込んでいるファイルのパス。`fs.createReadStream()` の最初の引数で指定されています。`path` が文字列として渡された場合、`readStream.path` は文字列になります。`path` が [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) として渡された場合、`readStream.path` は [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) になります。`fd` が指定されている場合、`readStream.path` は `undefined` になります。


#### `readStream.pending` {#readstreampending}

**Added in: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

このプロパティは、基になるファイルがまだ開かれていない場合、つまり `'ready'` イベントが発行される前に `true` になります。

### Class: `fs.Stats` {#class-fsstats}

::: info [History]
| Version | Changes |
| --- | --- |
| v22.0.0, v20.13.0 | Public constructor is deprecated. |
| v8.1.0 | Added times as numbers. |
| v0.1.21 | Added in: v0.1.21 |
:::

[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトは、ファイルに関する情報を提供します。

[`fs.stat()`](/ja/nodejs/api/fs#fsstatpath-options-callback)、[`fs.lstat()`](/ja/nodejs/api/fs#fslstatpath-options-callback)、[`fs.fstat()`](/ja/nodejs/api/fs#fsfstatfd-options-callback)、およびそれらの同期的な対応するものから返されるオブジェクトは、この型になります。 これらのメソッドに渡される `options` の `bigint` が true の場合、数値は `number` の代わりに `bigint` になり、オブジェクトには `Ns` が付加されたナノ秒精度のプロパティが追加されます。 `Stat` オブジェクトは、`new` キーワードを使用して直接作成することはできません。

```bash [BASH]
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1,
  mtimeMs: 1318289051000.1,
  ctimeMs: 1318289051000.1,
  birthtimeMs: 1318289051000.1,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```
`bigint` バージョン:

```bash [BASH]
BigIntStats {
  dev: 2114n,
  ino: 48064969n,
  mode: 33188n,
  nlink: 1n,
  uid: 85n,
  gid: 100n,
  rdev: 0n,
  size: 527n,
  blksize: 4096n,
  blocks: 8n,
  atimeMs: 1318289051000n,
  mtimeMs: 1318289051000n,
  ctimeMs: 1318289051000n,
  birthtimeMs: 1318289051000n,
  atimeNs: 1318289051000000000n,
  mtimeNs: 1318289051000000000n,
  ctimeNs: 1318289051000000000n,
  birthtimeNs: 1318289051000000000n,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```

#### `stats.isBlockDevice()` {#statsisblockdevice}

**Added in: v0.1.10**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトがブロックデバイスを表す場合、`true` を返します。

#### `stats.isCharacterDevice()` {#statsischaracterdevice}

**Added in: v0.1.10**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトがキャラクタデバイスを表す場合、`true` を返します。

#### `stats.isDirectory()` {#statsisdirectory}

**Added in: v0.1.10**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトがファイルシステムのディレクトリを表す場合、`true` を返します。

[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトが、ディレクトリに解決されるシンボリックリンクに対して [`fs.lstat()`](/ja/nodejs/api/fs#fslstatpath-options-callback) を呼び出すことによって取得された場合、このメソッドは `false` を返します。 これは、[`fs.lstat()`](/ja/nodejs/api/fs#fslstatpath-options-callback) がシンボリックリンク自体に関する情報を返し、解決されるパスに関する情報を返さないためです。

#### `stats.isFIFO()` {#statsisfifo}

**Added in: v0.1.10**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトが FIFO (first-in-first-out) パイプを表す場合、`true` を返します。

#### `stats.isFile()` {#statsisfile}

**Added in: v0.1.10**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトが通常のファイルを表す場合、`true` を返します。

#### `stats.isSocket()` {#statsissocket}

**Added in: v0.1.10**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトがソケットを表す場合、`true` を返します。

#### `stats.isSymbolicLink()` {#statsissymboliclink}

**Added in: v0.1.10**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトがシンボリックリンクを表す場合、`true` を返します。

このメソッドは、[`fs.lstat()`](/ja/nodejs/api/fs#fslstatpath-options-callback) を使用する場合にのみ有効です。


#### `stats.dev` {#statsdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

ファイルを含むデバイスの数値識別子。

#### `stats.ino` {#statsino}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

ファイルシステム固有のファイルの「Inode」番号。

#### `stats.mode` {#statsmode}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

ファイルの種類とモードを記述するビットフィールド。

#### `stats.nlink` {#statsnlink}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

ファイルに存在するハードリンクの数。

#### `stats.uid` {#statsuid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

ファイルを所有するユーザーの数値ユーザー識別子（POSIX）。

#### `stats.gid` {#statsgid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

ファイルを所有するグループの数値グループ識別子（POSIX）。

#### `stats.rdev` {#statsrdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

ファイルがデバイスを表す場合の数値デバイス識別子。

#### `stats.size` {#statssize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

ファイルのサイズ（バイト単位）。

基盤となるファイルシステムがファイルのサイズの取得をサポートしていない場合、これは `0` になります。


#### `stats.blksize` {#statsblksize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

I/O操作のためのファイルシステムブロックサイズ。

#### `stats.blocks` {#statsblocks}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

このファイルに割り当てられたブロック数。

#### `stats.atimeMs` {#statsatimems}

**Added in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

このファイルに最後にアクセスされた時刻を示すタイムスタンプ。POSIXエポックからの経過ミリ秒数で表されます。

#### `stats.mtimeMs` {#statsmtimems}

**Added in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

このファイルが最後に変更された時刻を示すタイムスタンプ。POSIXエポックからの経過ミリ秒数で表されます。

#### `stats.ctimeMs` {#statsctimems}

**Added in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

ファイルステータスが最後に変更された時刻を示すタイムスタンプ。POSIXエポックからの経過ミリ秒数で表されます。

#### `stats.birthtimeMs` {#statsbirthtimems}

**Added in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

このファイルの作成時刻を示すタイムスタンプ。POSIXエポックからの経過ミリ秒数で表されます。

#### `stats.atimeNs` {#statsatimens}

**Added in: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

オブジェクトを生成するメソッドに`bigint: true`が渡された場合にのみ存在します。このファイルに最後にアクセスされた時刻を示すタイムスタンプ。POSIXエポックからの経過ナノ秒数で表されます。


#### `stats.mtimeNs` {#statsmtimens}

**Added in: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

`bigint: true` がオブジェクトを生成するメソッドに渡された場合にのみ存在します。POSIX Epoch からのナノ秒で表される、このファイルが最後に変更された時刻を示すタイムスタンプです。

#### `stats.ctimeNs` {#statsctimens}

**Added in: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

`bigint: true` がオブジェクトを生成するメソッドに渡された場合にのみ存在します。POSIX Epoch からのナノ秒で表される、ファイルステータスが最後に変更された時刻を示すタイムスタンプです。

#### `stats.birthtimeNs` {#statsbirthtimens}

**Added in: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

`bigint: true` がオブジェクトを生成するメソッドに渡された場合にのみ存在します。POSIX Epoch からのナノ秒で表される、このファイルの作成時刻を示すタイムスタンプです。

#### `stats.atime` {#statsatime}

**Added in: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

このファイルが最後にアクセスされた時刻を示すタイムスタンプです。

#### `stats.mtime` {#statsmtime}

**Added in: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

このファイルが最後に変更された時刻を示すタイムスタンプです。

#### `stats.ctime` {#statsctime}

**Added in: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

ファイルステータスが最後に変更された時刻を示すタイムスタンプです。

#### `stats.birthtime` {#statsbirthtime}

**Added in: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

このファイルの作成時刻を示すタイムスタンプです。

#### Stat time values {#stat-time-values}

`atimeMs`, `mtimeMs`, `ctimeMs`, `birthtimeMs` プロパティは、対応する時間をミリ秒単位で保持する数値です。それらの精度はプラットフォームに固有です。`bigint: true` がオブジェクトを生成するメソッドに渡されると、プロパティは [bigints](https://tc39.github.io/proposal-bigint) になり、そうでない場合は [numbers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) になります。

`atimeNs`, `mtimeNs`, `ctimeNs`, `birthtimeNs` プロパティは、対応する時間をナノ秒単位で保持する [bigints](https://tc39.github.io/proposal-bigint) です。これらは、`bigint: true` がオブジェクトを生成するメソッドに渡された場合にのみ存在します。それらの精度はプラットフォームに固有です。

`atime`, `mtime`, `ctime`, および `birthtime` は、さまざまな時刻の [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) オブジェクトの代替表現です。`Date` と数値は接続されていません。新しい数値を割り当てるか、`Date` 値を変更しても、対応する代替表現には反映されません。

stat オブジェクトの時刻には、次のセマンティクスがあります。

- `atime` "アクセス時間": ファイルデータが最後にアクセスされた時刻。[`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2), および [`read(2)`](http://man7.org/linux/man-pages/man2/read.2) システムコールによって変更されます。
- `mtime` "修正時間": ファイルデータが最後に修正された時刻。[`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2), および [`write(2)`](http://man7.org/linux/man-pages/man2/write.2) システムコールによって変更されます。
- `ctime` "変更時間": ファイルステータスが最後に変更された時刻 (inode データの変更)。[`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2), [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2), [`link(2)`](http://man7.org/linux/man-pages/man2/link.2), [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2), [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2), [`read(2)`](http://man7.org/linux/man-pages/man2/read.2), および [`write(2)`](http://man7.org/linux/man-pages/man2/write.2) システムコールによって変更されます。
- `birthtime` "作成時間": ファイルの作成時刻。ファイルが作成されるときに一度設定されます。birthtime が利用できないファイルシステムでは、このフィールドには代わりに `ctime` または `1970-01-01T00:00Z` (つまり、Unix epoch タイムスタンプ `0`) が保持される場合があります。この場合、この値は `atime` または `mtime` より大きくなる可能性があります。Darwin およびその他の FreeBSD バリアントでは、[`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) システムコールを使用して、`atime` が現在の `birthtime` よりも前の値に明示的に設定されている場合にも設定されます。

Node.js 0.12 より前では、`ctime` は Windows システムの `birthtime` を保持していました。0.12 以降、`ctime` は「作成時間」ではなく、Unix システムでは決してそうではありませんでした。


### クラス: `fs.StatFs` {#class-fsstatfs}

**追加:** v19.6.0, v18.15.0

マウントされたファイルシステムに関する情報を提供します。

[`fs.statfs()`](/ja/nodejs/api/fs#fsstatfspath-options-callback) とその同期版から返されるオブジェクトは、この型です。これらのメソッドに渡された `options` の `bigint` が `true` の場合、数値は `number` ではなく `bigint` になります。

```bash [BASH]
StatFs {
  type: 1397114950,
  bsize: 4096,
  blocks: 121938943,
  bfree: 61058895,
  bavail: 61058895,
  files: 999,
  ffree: 1000000
}
```
`bigint` バージョン:

```bash [BASH]
StatFs {
  type: 1397114950n,
  bsize: 4096n,
  blocks: 121938943n,
  bfree: 61058895n,
  bavail: 61058895n,
  files: 999n,
  ffree: 1000000n
}
```
#### `statfs.bavail` {#statfsbavail}

**追加:** v19.6.0, v18.15.0

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

特権のないユーザーが利用できる空きブロック。

#### `statfs.bfree` {#statfsbfree}

**追加:** v19.6.0, v18.15.0

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

ファイルシステム内の空きブロック。

#### `statfs.blocks` {#statfsblocks}

**追加:** v19.6.0, v18.15.0

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

ファイルシステム内の合計データブロック。

#### `statfs.bsize` {#statfsbsize}

**追加:** v19.6.0, v18.15.0

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

最適な転送ブロックサイズ。

#### `statfs.ffree` {#statfsffree}

**追加:** v19.6.0, v18.15.0

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

ファイルシステム内の空きファイルノード。


#### `statfs.files` {#statfsfiles}

**Added in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

ファイルシステム内のファイルノードの合計数。

#### `statfs.type` {#statfstype}

**Added in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

ファイルシステムのタイプ。

### Class: `fs.WriteStream` {#class-fswritestream}

**Added in: v0.1.93**

- Extends [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable)

[\<fs.WriteStream\>](/ja/nodejs/api/fs#class-fswritestream) のインスタンスは、[`fs.createWriteStream()`](/ja/nodejs/api/fs#fscreatewritestreampath-options) 関数を使用して作成および返されます。

#### Event: `'close'` {#event-close_3}

**Added in: v0.1.93**

[\<fs.WriteStream\>](/ja/nodejs/api/fs#class-fswritestream) の基になるファイル記述子が閉じられたときに発生します。

#### Event: `'open'` {#event-open_1}

**Added in: v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [\<fs.WriteStream\>](/ja/nodejs/api/fs#class-fswritestream) によって使用される整数のファイル記述子。

[\<fs.WriteStream\>](/ja/nodejs/api/fs#class-fswritestream) のファイルが開かれたときに発生します。

#### Event: `'ready'` {#event-ready_1}

**Added in: v9.11.0**

[\<fs.WriteStream\>](/ja/nodejs/api/fs#class-fswritestream) を使用する準備ができたときに発生します。

`'open'` の直後に発生します。

#### `writeStream.bytesWritten` {#writestreambyteswritten}

**Added in: v0.4.7**

これまでに書き込まれたバイト数。 まだ書き込みのためにキューに入れられているデータは含まれません。

#### `writeStream.close([callback])` {#writestreamclosecallback}

**Added in: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

`writeStream` を閉じます。 オプションで、`writeStream` が閉じられた後に実行されるコールバックを受け入れます。


#### `writeStream.path` {#writestreampath}

**追加:** v0.1.93

[`fs.createWriteStream()`](/ja/nodejs/api/fs#fscreatewritestreampath-options) の最初の引数で指定された、ストリームが書き込みを行うファイルのパスです。`path` が文字列として渡された場合、`writeStream.path` は文字列になります。`path` が [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) として渡された場合、`writeStream.path` は [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) になります。

#### `writeStream.pending` {#writestreampending}

**追加:** v11.2.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

このプロパティは、基になるファイルがまだ開かれていない場合、つまり `'ready'` イベントが発生する前は `true` になります。

### `fs.constants` {#fsconstants}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

ファイルシステム操作で一般的に使用される定数を含むオブジェクトを返します。

#### FS 定数 {#fs-constants}

次の定数は、`fs.constants` および `fsPromises.constants` によってエクスポートされます。

すべての定数がすべてのオペレーティングシステムで使用できるとは限りません。これは、POSIX 固有の定義の多くが利用できない Windows では特に重要です。移植可能なアプリケーションでは、使用前にその存在を確認することをお勧めします。

複数の定数を使用するには、ビット単位の OR 演算子 `|` を使用します。

例:

```js [ESM]
import { open, constants } from 'node:fs';

const {
  O_RDWR,
  O_CREAT,
  O_EXCL,
} = constants;

open('/path/to/my/file', O_RDWR | O_CREAT | O_EXCL, (err, fd) => {
  // ...
});
```
##### ファイルアクセス定数 {#file-access-constants}

次の定数は、[`fsPromises.access()`](/ja/nodejs/api/fs#fspromisesaccesspath-mode), [`fs.access()`](/ja/nodejs/api/fs#fsaccesspath-mode-callback), および [`fs.accessSync()`](/ja/nodejs/api/fs#fsaccesssyncpath-mode) に渡される `mode` パラメーターとして使用することを目的としています。

| 定数 | 説明 |
| --- | --- |
| `F_OK` | ファイルが呼び出し元プロセスに表示されることを示すフラグ。これは、ファイルが存在するかどうかを判断するのに役立ちますが、`rwx` パーミッションについては何も示しません。モードが指定されていない場合のデフォルト。 |
| `R_OK` | ファイルが呼び出し元プロセスによって読み取り可能であることを示すフラグ。 |
| `W_OK` | ファイルが呼び出し元プロセスによって書き込み可能であることを示すフラグ。 |
| `X_OK` | ファイルが呼び出し元プロセスによって実行可能であることを示すフラグ。これは Windows では効果がありません ( `fs.constants.F_OK` のように動作します)。 |

これらの定義は Windows でも利用できます。


##### ファイルコピー定数 {#file-copy-constants}

以下の定数は、[`fs.copyFile()`](/ja/nodejs/api/fs#fscopyfilesrc-dest-mode-callback) での使用を意図しています。

| 定数 | 説明 |
| --- | --- |
| `COPYFILE_EXCL` | これが存在する場合、コピー先のパスがすでに存在する場合、コピー操作はエラーで失敗します。 |
| `COPYFILE_FICLONE` | これが存在する場合、コピー操作は copy-on-write の reflink を作成しようとします。基盤となるプラットフォームが copy-on-write をサポートしていない場合、フォールバックコピーメカニズムが使用されます。 |
| `COPYFILE_FICLONE_FORCE` | これが存在する場合、コピー操作は copy-on-write の reflink を作成しようとします。基盤となるプラットフォームが copy-on-write をサポートしていない場合、操作はエラーで失敗します。 |
定義は Windows でも利用可能です。

##### ファイルオープン定数 {#file-open-constants}

以下の定数は、`fs.open()` での使用を意図しています。

| 定数 | 説明 |
| --- | --- |
| `O_RDONLY` | ファイルを読み取り専用アクセスでオープンすることを示すフラグ。 |
| `O_WRONLY` | ファイルを書き込み専用アクセスでオープンすることを示すフラグ。 |
| `O_RDWR` | ファイルを読み取り/書き込みアクセスでオープンすることを示すフラグ。 |
| `O_CREAT` | ファイルが存在しない場合にファイルを作成することを示すフラグ。 |
| `O_EXCL` | `O_CREAT` フラグが設定されていて、ファイルがすでに存在する場合、ファイルを開くと失敗することを示すフラグ。 |
| `O_NOCTTY` | path が端末デバイスを識別する場合、その path を開いても、その端末がプロセスの制御端末にならないようにすることを示すフラグ (プロセスがまだ制御端末を持っていない場合)。 |
| `O_TRUNC` | ファイルが存在し、通常のファイルであり、ファイルが書き込みアクセスで正常にオープンされた場合、その長さがゼロに切り捨てられることを示すフラグ。 |
| `O_APPEND` | データがファイルの末尾に追加されることを示すフラグ。 |
| `O_DIRECTORY` | path がディレクトリでない場合、オープンが失敗することを示すフラグ。 |
| `O_NOATIME` | ファイルシステムへの読み取りアクセスによって、ファイルに関連付けられている `atime` 情報が更新されなくなることを示すフラグ。このフラグは Linux オペレーティングシステムでのみ使用できます。 |
| `O_NOFOLLOW` | path がシンボリックリンクの場合、オープンが失敗することを示すフラグ。 |
| `O_SYNC` | ファイルの整合性を待機する書き込み操作で、同期 I/O 用にファイルがオープンされることを示すフラグ。 |
| `O_DSYNC` | データの整合性を待機する書き込み操作で、同期 I/O 用にファイルがオープンされることを示すフラグ。 |
| `O_SYMLINK` | シンボリックリンクが指しているリソースではなく、シンボリックリンク自体をオープンすることを示すフラグ。 |
| `O_DIRECT` | 設定されている場合、ファイル I/O のキャッシュ効果を最小限に抑える試みが行われます。 |
| `O_NONBLOCK` | 可能な場合、ファイルを非ブロッキングモードでオープンすることを示すフラグ。 |
| `UV_FS_O_FILEMAP` | 設定されている場合、メモリファイルマッピングを使用してファイルにアクセスします。このフラグは Windows オペレーティングシステムでのみ使用できます。他のオペレーティングシステムでは、このフラグは無視されます。 |
Windows では、`O_APPEND`、`O_CREAT`、`O_EXCL`、`O_RDONLY`、`O_RDWR`、`O_TRUNC`、`O_WRONLY`、および `UV_FS_O_FILEMAP` のみが利用可能です。


##### ファイルタイプ定数 {#file-type-constants}

以下の定数は、ファイルのタイプを決定するために、[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトの `mode` プロパティで使用することを意図しています。

| 定数 | 説明 |
| --- | --- |
| `S_IFMT` | ファイルタイプコードを抽出するために使用されるビットマスク。 |
| `S_IFREG` | 通常ファイルのファイルタイプ定数。 |
| `S_IFDIR` | ディレクトリのファイルタイプ定数。 |
| `S_IFCHR` | 文字指向デバイスファイルのファイルタイプ定数。 |
| `S_IFBLK` | ブロック指向デバイスファイルのファイルタイプ定数。 |
| `S_IFIFO` | FIFO/パイプのファイルタイプ定数。 |
| `S_IFLNK` | シンボリックリンクのファイルタイプ定数。 |
| `S_IFSOCK` | ソケットのファイルタイプ定数。 |
Windowsでは、`S_IFCHR`、`S_IFDIR`、`S_IFLNK`、`S_IFMT`、および`S_IFREG`のみが利用可能です。

##### ファイルモード定数 {#file-mode-constants}

以下の定数は、ファイルのアクセス許可を決定するために、[\<fs.Stats\>](/ja/nodejs/api/fs#class-fsstats) オブジェクトの `mode` プロパティで使用することを意図しています。

| 定数 | 説明 |
| --- | --- |
| `S_IRWXU` | 所有者による読み取り、書き込み、および実行可能を示すファイルモード。 |
| `S_IRUSR` | 所有者による読み取り可能を示すファイルモード。 |
| `S_IWUSR` | 所有者による書き込み可能を示すファイルモード。 |
| `S_IXUSR` | 所有者による実行可能を示すファイルモード。 |
| `S_IRWXG` | グループによる読み取り、書き込み、および実行可能を示すファイルモード。 |
| `S_IRGRP` | グループによる読み取り可能を示すファイルモード。 |
| `S_IWGRP` | グループによる書き込み可能を示すファイルモード。 |
| `S_IXGRP` | グループによる実行可能を示すファイルモード。 |
| `S_IRWXO` | 他者による読み取り、書き込み、および実行可能を示すファイルモード。 |
| `S_IROTH` | 他者による読み取り可能を示すファイルモード。 |
| `S_IWOTH` | 他者による書き込み可能を示すファイルモード。 |
| `S_IXOTH` | 他者による実行可能を示すファイルモード。 |
Windowsでは、`S_IRUSR`と`S_IWUSR`のみが利用可能です。

## 注記 {#notes}

### コールバックとPromiseベースの操作の順序 {#ordering-of-callback-and-promise-based-operations}

基盤となるスレッドプールによって非同期的に実行されるため、コールバックまたはPromiseベースのメソッドを使用する場合、保証された順序はありません。

たとえば、以下のコードは、`fs.stat()`操作が`fs.rename()`操作の前に完了する可能性があるため、エラーが発生しやすくなります。

```js [ESM]
const fs = require('node:fs');

fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  console.log('renamed complete');
});
fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  console.log(`stats: ${JSON.stringify(stats)}`);
});
```
一方を呼び出す前に、もう一方の結果を待機して、操作を正しく順序付けることが重要です。

::: code-group
```js [ESM]
import { rename, stat } from 'node:fs/promises';

const oldPath = '/tmp/hello';
const newPath = '/tmp/world';

try {
  await rename(oldPath, newPath);
  const stats = await stat(newPath);
  console.log(`stats: ${JSON.stringify(stats)}`);
} catch (error) {
  console.error('there was an error:', error.message);
}
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

(async function(oldPath, newPath) {
  try {
    await rename(oldPath, newPath);
    const stats = await stat(newPath);
    console.log(`stats: ${JSON.stringify(stats)}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello', '/tmp/world');
```
:::

または、コールバックAPIを使用する場合、`fs.stat()`呼び出しを`fs.rename()`操作のコールバックに移動します。

::: code-group
```js [ESM]
import { rename, stat } from 'node:fs';

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```
:::


### ファイルパス {#file-paths}

ほとんどの `fs` 操作は、文字列、[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)、または `file:` プロトコルを使用する[\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)オブジェクトの形式で指定できるファイルパスを受け入れます。

#### 文字列パス {#string-paths}

文字列パスは、絶対または相対ファイル名を識別する UTF-8 文字シーケンスとして解釈されます。相対パスは、`process.cwd()` の呼び出しによって決定される現在の作業ディレクトリを基準に解決されます。

POSIX での絶対パスの使用例:

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('/open/some/file.txt', 'r');
  // ファイルに対して何か処理を行う
} finally {
  await fd?.close();
}
```
POSIX での相対パスの使用例 (`process.cwd()` を基準):

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('file.txt', 'r');
  // ファイルに対して何か処理を行う
} finally {
  await fd?.close();
}
```
#### File URL パス {#file-url-paths}

**追加: v7.6.0**

ほとんどの `node:fs` モジュール関数では、`path` または `filename` 引数は、`file:` プロトコルを使用する[\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api)オブジェクトとして渡すことができます。

```js [ESM]
import { readFileSync } from 'node:fs';

readFileSync(new URL('file:///tmp/hello'));
```
`file:` URL は常に絶対パスです。

##### プラットフォーム固有の考慮事項 {#platform-specific-considerations}

Windows では、ホスト名を持つ `file:` [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) は UNC パスに変換され、ドライブ文字を持つ `file:` [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) はローカルの絶対パスに変換されます。ホスト名もドライブ文字もない `file:` [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) は、エラーになります。

```js [ESM]
import { readFileSync } from 'node:fs';
// Windows の場合:

// - ホスト名を持つ WHATWG ファイル URL は UNC パスに変換されます
// file://hostname/p/a/t/h/file => \\hostname\p\a\t\h\file
readFileSync(new URL('file://hostname/p/a/t/h/file'));

// - ドライブ文字を持つ WHATWG ファイル URL は絶対パスに変換されます
// file:///C:/tmp/hello => C:\tmp\hello
readFileSync(new URL('file:///C:/tmp/hello'));

// - ホスト名を持たない WHATWG ファイル URL はドライブ文字を持つ必要があります
readFileSync(new URL('file:///notdriveletter/p/a/t/h/file'));
readFileSync(new URL('file:///c/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: ファイル URL パスは絶対パスである必要があります
```
ドライブ文字を持つ `file:` [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) は、ドライブ文字の直後に区切り文字として `:` を使用する必要があります。別の区切り文字を使用すると、エラーが発生します。

他のすべてのプラットフォームでは、ホスト名を持つ `file:` [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) はサポートされておらず、エラーが発生します。

```js [ESM]
import { readFileSync } from 'node:fs';
// 他のプラットフォームの場合:

// - ホスト名を持つ WHATWG ファイル URL はサポートされていません
// file://hostname/p/a/t/h/file => throw!
readFileSync(new URL('file://hostname/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: 絶対パスである必要があります

// - WHATWG ファイル URL は絶対パスに変換されます
// file:///tmp/hello => /tmp/hello
readFileSync(new URL('file:///tmp/hello'));
```
エンコードされたスラッシュ文字を持つ `file:` [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) は、すべてのプラットフォームでエラーになります。

```js [ESM]
import { readFileSync } from 'node:fs';

// Windows の場合
readFileSync(new URL('file:///C:/p/a/t/h/%2F'));
readFileSync(new URL('file:///C:/p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: ファイル URL パスにエンコードされた
\ または / 文字を含めることはできません */

// POSIX の場合
readFileSync(new URL('file:///p/a/t/h/%2F'));
readFileSync(new URL('file:///p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: ファイル URL パスにエンコードされた
/ 文字を含めることはできません */
```
Windows では、エンコードされたバックスラッシュを持つ `file:` [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) はエラーになります。

```js [ESM]
import { readFileSync } from 'node:fs';

// Windows の場合
readFileSync(new URL('file:///C:/path/%5C'));
readFileSync(new URL('file:///C:/path/%5c'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: ファイル URL パスにエンコードされた
\ または / 文字を含めることはできません */
```

#### Buffer パス {#buffer-paths}

[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) を使用して指定されたパスは、ファイルパスを不透明なバイトシーケンスとして扱う特定の POSIX オペレーティングシステムで主に役立ちます。そのようなシステムでは、単一のファイルパスに複数の文字エンコーディングを使用するサブシーケンスが含まれている可能性があります。文字列パスと同様に、[\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) パスは相対パスまたは絶対パスにすることができます。

POSIX での絶対パスの使用例:

```js [ESM]
import { open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

let fd;
try {
  fd = await open(Buffer.from('/open/some/file.txt'), 'r');
  // ファイルで何かをする
} finally {
  await fd?.close();
}
```
#### Windows でのドライブごとの作業ディレクトリ {#per-drive-working-directories-on-windows}

Windows では、Node.js はドライブごとの作業ディレクトリの概念に従います。この動作は、バックスラッシュなしでドライブパスを使用する場合に観察できます。たとえば、`fs.readdirSync('C:\\')` は、`fs.readdirSync('C:')` とは異なる結果を返す可能性があります。詳細については、[この MSDN ページ](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths)を参照してください。

### ファイル記述子 {#file-descriptors_1}

POSIX システムでは、プロセスごとに、カーネルは現在開いているファイルとリソースのテーブルを維持します。各オープンファイルには、*ファイル記述子*と呼ばれる単純な数値識別子が割り当てられます。システムレベルでは、すべてのファイルシステム操作で、これらのファイル記述子を使用して、特定のファイルを識別および追跡します。Windows システムは、リソースを追跡するために概念的には似ていますが、異なるメカニズムを使用します。ユーザーのために物事を簡素化するために、Node.js はオペレーティングシステム間の違いを抽象化し、すべてのオープンファイルに数値ファイル記述子を割り当てます。

コールバックベースの `fs.open()` および同期の `fs.openSync()` メソッドは、ファイルを開き、新しいファイル記述子を割り当てます。割り当てられると、ファイル記述子を使用して、ファイルからデータを読み取ったり、ファイルにデータを書き込んだり、ファイルに関する情報を要求したりできます。

オペレーティングシステムは、いつでも開くことができるファイル記述子の数を制限するため、操作が完了したら記述子を閉じることが重要です。そうしないと、メモリリークが発生し、最終的にアプリケーションがクラッシュします。

```js [ESM]
import { open, close, fstat } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  try {
    fstat(fd, (err, stat) => {
      if (err) {
        closeFd(fd);
        throw err;
      }

      // stat を使用する

      closeFd(fd);
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```
Promise ベースの API は、数値ファイル記述子の代わりに [\<FileHandle\>](/ja/nodejs/api/fs#class-filehandle) オブジェクトを使用します。これらのオブジェクトは、リソースがリークしないようにシステムによってより適切に管理されます。ただし、操作が完了したら閉じる必要は依然としてあります。

```js [ESM]
import { open } from 'node:fs/promises';

let file;
try {
  file = await open('/open/some/file.txt', 'r');
  const stat = await file.stat();
  // stat を使用する
} finally {
  await file.close();
}
```

### スレッドプールの使用 {#threadpool-usage}

すべてのコールバックおよび Promise ベースのファイルシステム API（`fs.FSWatcher()` を除く）は、libuv のスレッドプールを使用します。これは、一部のアプリケーションにとって、驚くほどネガティブなパフォーマンスへの影響をもたらす可能性があります。詳細については、[`UV_THREADPOOL_SIZE`](/ja/nodejs/api/cli#uv_threadpool_sizesize) のドキュメントを参照してください。

### ファイルシステムのフラグ {#file-system-flags}

以下のフラグは、`flag` オプションが文字列を受け取る場所で使用できます。

-  `'a'`: 追加のためにファイルを開きます。ファイルが存在しない場合は作成されます。
-  `'ax'`: `'a'` と同様ですが、パスが存在する場合は失敗します。
-  `'a+'`: 読み取りと追加のためにファイルを開きます。ファイルが存在しない場合は作成されます。
-  `'ax+'`: `'a+'` と同様ですが、パスが存在する場合は失敗します。
-  `'as'`: 同期モードで追加するためにファイルを開きます。ファイルが存在しない場合は作成されます。
-  `'as+'`: 同期モードで読み取りと追加のためにファイルを開きます。ファイルが存在しない場合は作成されます。
-  `'r'`: 読み取りのためにファイルを開きます。ファイルが存在しない場合は例外が発生します。
-  `'rs'`: 同期モードで読み取りのためにファイルを開きます。ファイルが存在しない場合は例外が発生します。
-  `'r+'`: 読み取りと書き込みのためにファイルを開きます。ファイルが存在しない場合は例外が発生します。
-  `'rs+'`: 同期モードで読み取りと書き込みのためにファイルを開きます。ローカルファイルシステムキャッシュをバイパスするようにオペレーティングシステムに指示します。これは主に NFS マウント上のファイルを開く場合に役立ちます。ローカルキャッシュが古くなっている可能性があるためです。これは I/O パフォーマンスに非常に大きな影響を与えるため、必要な場合を除き、このフラグの使用はお勧めしません。これは `fs.open()` または `fsPromises.open()` を同期的なブロッキング呼び出しにするものではありません。同期操作が必要な場合は、`fs.openSync()` のようなものを使用する必要があります。
-  `'w'`: 書き込みのためにファイルを開きます。ファイルが存在しない場合は作成され、（存在する場合は）切り捨てられます。
-  `'wx'`: `'w'` と同様ですが、パスが存在する場合は失敗します。
-  `'w+'`: 読み取りと書き込みのためにファイルを開きます。ファイルが存在しない場合は作成され、（存在する場合は）切り捨てられます。
-  `'wx+'`: `'w+'` と同様ですが、パスが存在する場合は失敗します。

`flag` は、[`open(2)`](http://man7.org/linux/man-pages/man2/open.2) に記載されているように数値である場合もあります。一般的に使用される定数は `fs.constants` から入手できます。Windows では、フラグは該当する場合に同等のものに変換されます。例えば、`O_WRONLY` は `FILE_GENERIC_WRITE` に、または `O_EXCL|O_CREAT` は `CreateFileW` で受け入れられるように `CREATE_NEW` に変換されます。

排他フラグ `'x'` ([`open(2)`](http://man7.org/linux/man-pages/man2/open.2) の `O_EXCL` フラグ) は、パスが既に存在する場合に操作がエラーを返すようにします。POSIX では、パスがシンボリックリンクの場合、`O_EXCL` を使用すると、リンクが存在しないパスを指している場合でもエラーが返されます。排他フラグは、ネットワークファイルシステムでは機能しない場合があります。

Linux では、ファイルが追加モードで開かれている場合、位置指定書き込みは機能しません。カーネルは位置引数を無視し、常にファイルの末尾にデータを追加します。

ファイルを置き換えるのではなく変更するには、`flag` オプションをデフォルトの `'w'` ではなく `'r+'` に設定する必要がある場合があります。

一部のフラグの動作はプラットフォーム固有です。そのため、以下の例のように、macOS および Linux で `'a+'` フラグを使用してディレクトリを開くと、エラーが返されます。対照的に、Windows および FreeBSD では、ファイルディスクリプタまたは `FileHandle` が返されます。

```js [ESM]
// macOS and Linux
fs.open('<directory>', 'a+', (err, fd) => {
  // => [Error: EISDIR: ディレクトリに対する不正な操作です, open <directory>]
});

// Windows and FreeBSD
fs.open('<directory>', 'a+', (err, fd) => {
  // => null, <fd>
});
```
Windows では、`'w'` フラグを使用して既存の隠しファイルを開く（`fs.open()`、`fs.writeFile()`、または `fsPromises.open()` のいずれかを使用）と、`EPERM` で失敗します。既存の隠しファイルは、`'r+'` フラグを使用して書き込み用に開くことができます。

`fs.ftruncate()` または `filehandle.truncate()` の呼び出しを使用して、ファイルの内容をリセットできます。

