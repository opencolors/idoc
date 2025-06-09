---
title: Node.js WASI ドキュメント
description: Node.jsのWebAssemblyシステムインターフェース(WASI)に関するドキュメントを探求し、Node.js環境でWASIを使用する方法を詳細に説明します。ファイルシステム操作、環境変数などのAPIを含む。
head:
  - - meta
    - name: og:title
      content: Node.js WASI ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのWebAssemblyシステムインターフェース(WASI)に関するドキュメントを探求し、Node.js環境でWASIを使用する方法を詳細に説明します。ファイルシステム操作、環境変数などのAPIを含む。
  - - meta
    - name: twitter:title
      content: Node.js WASI ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのWebAssemblyシステムインターフェース(WASI)に関するドキュメントを探求し、Node.js環境でWASIを使用する方法を詳細に説明します。ファイルシステム操作、環境変数などのAPIを含む。
---


# WebAssembly System Interface (WASI) {#webassembly-system-interface-wasi}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

**<code>node:wasi</code> モジュールは現在、一部の WASI ランタイムが提供する包括的なファイルシステムセキュリティプロパティを提供していません。安全なファイルシステムサンドボックスの完全なサポートは、将来実装される可能性もあれば、されない可能性もあります。それまでの間、信頼できないコードを実行するためにそれを使用しないでください。**

**ソースコード:** [lib/wasi.js](https://github.com/nodejs/node/blob/v23.5.0/lib/wasi.js)

WASI API は、[WebAssembly System Interface](https://wasi.dev/) 仕様の実装を提供します。WASI は、一連の POSIX のような関数を介して、WebAssembly アプリケーションに基盤となるオペレーティングシステムへのアクセスを提供します。

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
import { WASI } from 'node:wasi';
import { argv, env } from 'node:process';

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

const wasm = await WebAssembly.compile(
  await readFile(new URL('./demo.wasm', import.meta.url)),
);
const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

wasi.start(instance);
```

```js [CJS]
'use strict';
const { readFile } = require('node:fs/promises');
const { WASI } = require('node:wasi');
const { argv, env } = require('node:process');
const { join } = require('node:path');

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

(async () => {
  const wasm = await WebAssembly.compile(
    await readFile(join(__dirname, 'demo.wasm')),
  );
  const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

  wasi.start(instance);
})();
```
:::

上記の例を実行するには、`demo.wat` という名前の新しい WebAssembly テキスト形式ファイルを作成します。

```text [TEXT]
(module
    ;; Import the required fd_write WASI function which will write the given io vectors to stdout
    ;; The function signature for fd_write is:
    ;; (File Descriptor, *iovs, iovs_len, nwritten) -> Returns number of bytes written
    (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

    (memory 1)
    (export "memory" (memory 0))

    ;; Write 'hello world\n' to memory at an offset of 8 bytes
    ;; Note the trailing newline which is required for the text to appear
    (data (i32.const 8) "hello world\n")

    (func $main (export "_start")
        ;; Creating a new io vector within linear memory
        (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - This is a pointer to the start of the 'hello world\n' string
        (i32.store (i32.const 4) (i32.const 12))  ;; iov.iov_len - The length of the 'hello world\n' string

        (call $fd_write
            (i32.const 1) ;; file_descriptor - 1 for stdout
            (i32.const 0) ;; *iovs - The pointer to the iov array, which is stored at memory location 0
            (i32.const 1) ;; iovs_len - We're printing 1 string stored in an iov - so one.
            (i32.const 20) ;; nwritten - A place in memory to store the number of bytes written
        )
        drop ;; Discard the number of bytes written from the top of the stack
    )
)
```
[wabt](https://github.com/WebAssembly/wabt) を使用して `.wat` を `.wasm` にコンパイルします

```bash [BASH]
wat2wasm demo.wat
```

## Security {#security}

::: info [History]
| バージョン | 変更点 |
| --- | --- |
| v21.2.0, v20.11.0 | WASIのセキュリティプロパティを明確化。 |
| v21.2.0, v20.11.0 | Added in: v21.2.0, v20.11.0 |
:::

WASIは、アプリケーションに独自のカスタム`env`、`preopens`、`stdin`、`stdout`、`stderr`、および`exit`機能を提供する、capabilityベースのモデルを提供します。

**現在のNode.jsの脅威モデルは、一部のWASIランタイムに存在するような安全なサンドボックスを提供しません。**

capability機能はサポートされていますが、Node.jsではセキュリティモデルを形成しません。 たとえば、ファイルシステムサンドボックスは、さまざまな手法でエスケープできます。 プロジェクトは、これらのセキュリティ保証を将来追加できるかどうかを検討しています。

## Class: `WASI` {#class-wasi}

**Added in: v13.3.0, v12.16.0**

`WASI` クラスは、WASI システムコール API と、WASI ベースのアプリケーションを操作するための追加の便利なメソッドを提供します。 各 `WASI` インスタンスは、個別の環境を表します。

### `new WASI([options])` {#new-wasioptions}


::: info [History]
| バージョン | 変更点 |
| --- | --- |
| v20.1.0 | returnOnExitのデフォルト値がtrueに変更されました。 |
| v20.0.0 | versionオプションが必須になり、デフォルト値がなくなりました。 |
| v19.8.0 | versionフィールドがオプションに追加されました。 |
| v13.3.0, v12.16.0 | Added in: v13.3.0, v12.16.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `args` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) WebAssemblyアプリケーションがコマンドライン引数として認識する文字列の配列。 最初の引数は、WASIコマンド自体の仮想パスです。 **デフォルト:** `[]`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) WebAssemblyアプリケーションが環境として認識する `process.env` に似たオブジェクト。 **デフォルト:** `{}`.
    - `preopens` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) このオブジェクトは、WebAssemblyアプリケーションのローカルディレクトリ構造を表します。 `preopens` の文字列キーは、ファイルシステム内のディレクトリとして扱われます。 `preopens` の対応する値は、ホストマシン上のそれらのディレクトリへの実際のパスです。
    - `returnOnExit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) デフォルトでは、WASIアプリケーションが `__wasi_proc_exit()` を呼び出すと、`wasi.start()` はプロセスを終了するのではなく、指定された終了コードで返されます。 このオプションを `false` に設定すると、Node.jsプロセスが代わりに指定された終了コードで終了します。 **デフォルト:** `true`.
    - `stdin` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) WebAssemblyアプリケーションで標準入力として使用されるファイル記述子。 **デフォルト:** `0`.
    - `stdout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) WebAssemblyアプリケーションで標準出力として使用されるファイル記述子。 **デフォルト:** `1`.
    - `stderr` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) WebAssemblyアプリケーションで標準エラーとして使用されるファイル記述子。 **デフォルト:** `2`.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要求されたWASIのバージョン。 現在サポートされているバージョンは `unstable` と `preview1` のみです。 このオプションは必須です。


### `wasi.getImportObject()` {#wasigetimportobject}

**Added in: v19.8.0**

WASI によって提供されるもの以外の WASM インポートが不要な場合に、`WebAssembly.instantiate()` に渡すことができるインポートオブジェクトを返します。

コンストラクタにバージョン `unstable` が渡された場合、以下を返します。

```json [JSON]
{ wasi_unstable: wasi.wasiImport }
```
コンストラクタにバージョン `preview1` が渡されたか、バージョンが指定されなかった場合、以下を返します。

```json [JSON]
{ wasi_snapshot_preview1: wasi.wasiImport }
```
### `wasi.start(instance)` {#wasistartinstance}

**Added in: v13.3.0, v12.16.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

`instance` の `_start()` エクスポートを呼び出して、WASI コマンドとしての `instance` の実行を開始しようとします。 `instance` が `_start()` エクスポートを含まない場合、または `instance` が `_initialize()` エクスポートを含む場合、例外がスローされます。

`start()` は、`instance` が `memory` という名前の [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) をエクスポートすることを要求します。 `instance` に `memory` エクスポートがない場合、例外がスローされます。

`start()` が複数回呼び出された場合、例外がスローされます。

### `wasi.initialize(instance)` {#wasiinitializeinstance}

**Added in: v14.6.0, v12.19.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

`instance` に `_initialize()` エクスポートが存在する場合、それを呼び出すことによって、WASI リアクタとして `instance` を初期化しようとします。 `instance` が `_start()` エクスポートを含む場合、例外がスローされます。

`initialize()` は、`instance` が `memory` という名前の [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) をエクスポートすることを要求します。 `instance` に `memory` エクスポートがない場合、例外がスローされます。

`initialize()` が複数回呼び出された場合、例外がスローされます。

### `wasi.wasiImport` {#wasiwasiimport}

**Added in: v13.3.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`wasiImport` は、WASI システムコール API を実装するオブジェクトです。 このオブジェクトは、[`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance) のインスタンス化中に `wasi_snapshot_preview1` インポートとして渡される必要があります。

