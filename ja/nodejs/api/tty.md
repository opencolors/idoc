---
title: Node.js TTY ドキュメント
description: Node.jsのTTYモジュールは、TTY（テレタイプライター）デバイスとのインタラクションのためのインターフェースを提供し、ストリームがTTYかどうかを確認する方法、ウィンドウサイズの取得、ターミナルイベントの処理を含む。
head:
  - - meta
    - name: og:title
      content: Node.js TTY ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのTTYモジュールは、TTY（テレタイプライター）デバイスとのインタラクションのためのインターフェースを提供し、ストリームがTTYかどうかを確認する方法、ウィンドウサイズの取得、ターミナルイベントの処理を含む。
  - - meta
    - name: twitter:title
      content: Node.js TTY ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのTTYモジュールは、TTY（テレタイプライター）デバイスとのインタラクションのためのインターフェースを提供し、ストリームがTTYかどうかを確認する方法、ウィンドウサイズの取得、ターミナルイベントの処理を含む。
---


# TTY {#tty}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/tty.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tty.js)

`node:tty` モジュールは、`tty.ReadStream` と `tty.WriteStream` クラスを提供します。ほとんどの場合、このモジュールを直接使用する必要も可能性もありません。ただし、以下を使用してアクセスできます。

```js [ESM]
const tty = require('node:tty');
```
Node.js がテキスト端末 ("TTY") が接続された状態で実行されていることを検出すると、デフォルトで [`process.stdin`](/ja/nodejs/api/process#processstdin) が `tty.ReadStream` のインスタンスとして初期化され、[`process.stdout`](/ja/nodejs/api/process#processstdout) と [`process.stderr`](/ja/nodejs/api/process#processstderr) の両方が、デフォルトで `tty.WriteStream` のインスタンスとして初期化されます。Node.js が TTY コンテキスト内で実行されているかどうかを判断する推奨される方法は、`process.stdout.isTTY` プロパティの値が `true` であることを確認することです。

```bash [BASH]
$ node -p -e "Boolean(process.stdout.isTTY)"
true
$ node -p -e "Boolean(process.stdout.isTTY)" | cat
false
```
ほとんどの場合、アプリケーションが `tty.ReadStream` および `tty.WriteStream` クラスのインスタンスを手動で作成する理由はありません。

## クラス: `tty.ReadStream` {#class-ttyreadstream}

**追加:** v0.5.8

- 拡張: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)

TTY の読み取り可能な側を表します。通常の場合、[`process.stdin`](/ja/nodejs/api/process#processstdin) は Node.js プロセス内で唯一の `tty.ReadStream` インスタンスであり、追加のインスタンスを作成する理由はありません。

### `readStream.isRaw` {#readstreamisraw}

**追加:** v0.7.7

TTY が現在、生のデバイスとして動作するように構成されている場合は `true` である `boolean`。

ターミナルが生モードで動作している場合でも、プロセスが開始されるとこのフラグは常に `false` になります。その値は、その後の `setRawMode` の呼び出しによって変化します。

### `readStream.isTTY` {#readstreamistty}

**追加:** v0.5.8

`tty.ReadStream` インスタンスの場合、常に `true` である `boolean`。


### `readStream.setRawMode(mode)` {#readstreamsetrawmodemode}

**Added in: v0.7.7**

- `mode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`tty.ReadStream` を raw デバイスとして動作するように設定します。`false` の場合、`tty.ReadStream` をデフォルトモードで動作するように設定します。`readStream.isRaw` プロパティは、結果のモードに設定されます。
- 戻り値: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) リードストリームのインスタンス。

`tty.ReadStream` を設定して、raw デバイスとして動作させることができます。

raw モードの場合、入力は常に文字単位で利用可能であり、修飾子は含まれません。さらに、端末による文字の特殊な処理はすべて無効になり、入力文字のエコーも無効になります。このモードでは、+ を押しても `SIGINT` は発生しません。

## Class: `tty.WriteStream` {#class-ttywritestream}

**Added in: v0.5.8**

- 継承元: [\<net.Socket\>](/ja/nodejs/api/net#class-netsocket)

TTY の書き込み可能な側を表します。通常、[`process.stdout`](/ja/nodejs/api/process#processstdout) と [`process.stderr`](/ja/nodejs/api/process#processstderr) は、Node.js プロセスで作成される唯一の `tty.WriteStream` インスタンスであり、追加のインスタンスを作成する理由はありません。

### `new tty.ReadStream(fd[, options])` {#new-ttyreadstreamfd-options}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v0.9.4 | `options` 引数がサポートされています。 |
| v0.5.8 | Added in: v0.5.8 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) TTY に関連付けられたファイル記述子。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 親の `net.Socket` に渡されるオプション。[`net.Socket` コンストラクター](/ja/nodejs/api/net#new-netsocketoptions) の `options` を参照してください。
- 戻り値 [\<tty.ReadStream\>](/ja/nodejs/api/tty#class-ttyreadstream)

TTY に関連付けられた `fd` の `ReadStream` を作成します。

### `new tty.WriteStream(fd)` {#new-ttywritestreamfd}

**Added in: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) TTY に関連付けられたファイル記述子。
- 戻り値 [\<tty.WriteStream\>](/ja/nodejs/api/tty#class-ttywritestream)

TTY に関連付けられた `fd` の `WriteStream` を作成します。


### イベント: `'resize'` {#event-resize}

**追加: v0.7.7**

`'resize'` イベントは、`writeStream.columns` または `writeStream.rows` プロパティのいずれかが変更されるたびに発生します。呼び出される際、リスナーコールバックに引数は渡されません。

```js [ESM]
process.stdout.on('resize', () => {
  console.log('screen size has changed!');
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});
```
### `writeStream.clearLine(dir[, callback])` {#writestreamclearlinedir-callback}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.7.0 | ストリームの write() コールバックと戻り値が公開されました。 |
| v0.7.7 | 追加: v0.7.7 |
:::

- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: カーソルから左
    - `1`: カーソルから右
    - `0`: 行全体
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作が完了すると呼び出されます。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ストリームが、追加のデータを書き込む前に `'drain'` イベントが発行されるのを呼び出し元のコードに待機させたい場合は `false`。それ以外の場合は `true`。

`writeStream.clearLine()` は、`dir` で指定された方向にこの `WriteStream` の現在の行をクリアします。

### `writeStream.clearScreenDown([callback])` {#writestreamclearscreendowncallback}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.7.0 | ストリームの write() コールバックと戻り値が公開されました。 |
| v0.7.7 | 追加: v0.7.7 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作が完了すると呼び出されます。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ストリームが、追加のデータを書き込む前に `'drain'` イベントが発行されるのを呼び出し元のコードに待機させたい場合は `false`。それ以外の場合は `true`。

`writeStream.clearScreenDown()` は、この `WriteStream` を現在のカーソル位置から下方向にクリアします。


### `writeStream.columns` {#writestreamcolumns}

**追加:** v0.7.7

TTYが現在持っているカラム数を指定する`number`。このプロパティは、`'resize'`イベントが発生するたびに更新されます。

### `writeStream.cursorTo(x[, y][, callback])` {#writestreamcursortox-y-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.7.0 | ストリームのwrite()コールバックと戻り値が公開されました。 |
| v0.7.7 | 追加: v0.7.7 |
:::

- `x` [\<number\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作が完了すると呼び出されます。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Boolean_type) ストリームが、追加のデータを書き込む前に `'drain'` イベントが発行されるのを呼び出し元のコードが待機することを望む場合は `false`、それ以外の場合は `true`。

`writeStream.cursorTo()` は、この `WriteStream` のカーソルを指定された位置に移動します。

### `writeStream.getColorDepth([env])` {#writestreamgetcolordepthenv}

**追加:** v9.9.0

- `env` [\<Object\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object) チェックする環境変数を含むオブジェクト。 これにより、特定のターミナルの使用をシミュレートできます。 **デフォルト:** `process.env`。
- 戻り値: [\<number\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type)

戻り値:

- 2色の場合 `1`
- 16色の場合 `4`
- 256色の場合 `8`
- 16,777,216色サポートの場合 `24`

これをターミナルがサポートする色を判断するために使用します。 ターミナルの色の性質上、偽陽性または偽陰性が発生する可能性があります。 プロセス情報と、使用されているターミナルについて嘘をつく可能性のある環境変数によって異なります。 特定のターミナルの使用をシミュレートするために `env` オブジェクトを渡すことが可能です。 これは、特定の環境設定がどのように動作するかを確認するのに役立ちます。

特定の色サポートを強制するには、以下の環境設定のいずれかを使用します。

- 2色: `FORCE_COLOR = 0` (色を無効にします)
- 16色: `FORCE_COLOR = 1`
- 256色: `FORCE_COLOR = 2`
- 16,777,216色: `FORCE_COLOR = 3`

色サポートの無効化は、`NO_COLOR` および `NODE_DISABLE_COLORS` 環境変数を使用しても可能です。


### `writeStream.getWindowSize()` {#writestreamgetwindowsize}

**Added in: v0.7.7**

- 戻り値: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`writeStream.getWindowSize()` は、この `WriteStream` に対応する TTY のサイズを返します。配列は `[numColumns, numRows]` の型で、`numColumns` と `numRows` は対応する TTY の列数と行数を表します。

### `writeStream.hasColors([count][, env])` {#writestreamhascolorscount-env}

**Added in: v11.13.0, v10.16.0**

- `count` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要求される色の数（最低2）。**デフォルト:** 16。
- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) チェックする環境変数を含むオブジェクト。これにより、特定のターミナルの使用をシミュレートできます。**デフォルト:** `process.env`。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`writeStream` が `count` で指定された数以上の色をサポートしている場合は `true` を返します。最小サポートは 2 色（白黒）です。

これは、[`writeStream.getColorDepth()`](/ja/nodejs/api/tty#writestreamgetcolordepthenv) で説明されているのと同じ誤検出と誤陰性があります。

```js [ESM]
process.stdout.hasColors();
// `stdout` が少なくとも 16 色をサポートしている場合は true または false を返します。
process.stdout.hasColors(256);
// `stdout` が少なくとも 256 色をサポートしている場合は true または false を返します。
process.stdout.hasColors({ TMUX: '1' });
// true を返します。
process.stdout.hasColors(2 ** 24, { TMUX: '1' });
// false を返します（環境設定は 2 ** 8 色をサポートしているふりをします）。
```
### `writeStream.isTTY` {#writestreamistty}

**Added in: v0.5.8**

常に `true` である `boolean`。

### `writeStream.moveCursor(dx, dy[, callback])` {#writestreammovecursordx-dy-callback}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.7.0 | ストリームの write() コールバックと戻り値が公開されました。 |
| v0.7.7 | Added in: v0.7.7 |
:::

- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作が完了すると呼び出されます。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ストリームが追加のデータを書き込む前に、呼び出し元のコードに `'drain'` イベントが発行されるのを待つように要求する場合は `false`、そうでない場合は `true`。

`writeStream.moveCursor()` は、この `WriteStream` のカーソルを現在の位置から*相対的に*移動します。


### `writeStream.rows` {#writestreamrows}

**追加:** v0.7.7

TTY が現在持つ行数を指定する `number`。このプロパティは、`'resize'` イベントが発行されるたびに更新されます。

## `tty.isatty(fd)` {#ttyisattyfd}

**追加:** v0.5.8

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 数値ファイル記述子
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`tty.isatty()` メソッドは、与えられた `fd` が TTY に関連付けられている場合は `true` を、そうでない場合は `false` を返します。これには、`fd` が非負の整数でない場合も含まれます。

