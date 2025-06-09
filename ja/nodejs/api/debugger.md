---
title: Node.js デバッガーガイド
description: Node.js 内蔵デバッガーの使用に関する包括的なガイド。コマンド、使用方法、デバッグ技術を詳述。
head:
  - - meta
    - name: og:title
      content: Node.js デバッガーガイド | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 内蔵デバッガーの使用に関する包括的なガイド。コマンド、使用方法、デバッグ技術を詳述。
  - - meta
    - name: twitter:title
      content: Node.js デバッガーガイド | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 内蔵デバッガーの使用に関する包括的なガイド。コマンド、使用方法、デバッグ技術を詳述。
---


# デバッガー {#debugger}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

Node.jsには、コマンドラインのデバッグユーティリティが含まれています。Node.jsのデバッガークライアントは、フル機能のデバッガーではありませんが、簡単なステップ実行と検査が可能です。

これを使用するには、Node.jsを`inspect`引数と、デバッグするスクリプトへのパスを付けて起動します。

```bash [BASH]
$ node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/621111f9-ffcb-4e82-b718-48a145fa5db8
< ヘルプは、https://nodejs.org/en/docs/inspector を参照してください
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
 ok
Break on start in myscript.js:2
  1 // myscript.js
> 2 global.x = 5;
  3 setTimeout(() => {
  4   debugger;
debug>
```
デバッガーは、最初の実行可能な行で自動的に中断します。代わりに、最初のブレークポイント（[`debugger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger)ステートメントで指定）まで実行するには、`NODE_INSPECT_RESUME_ON_START`環境変数を`1`に設定します。

```bash [BASH]
$ cat myscript.js
// myscript.js
global.x = 5;
setTimeout(() => {
  debugger;
  console.log('world');
}, 1000);
console.log('hello');
$ NODE_INSPECT_RESUME_ON_START=1 node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/f1ed133e-7876-495b-83ae-c32c6fc319c2
< ヘルプは、https://nodejs.org/en/docs/inspector を参照してください
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
< hello
<
break in myscript.js:4
  2 global.x = 5;
  3 setTimeout(() => {
> 4   debugger;
  5   console.log('world');
  6 }, 1000);
debug> next
break in myscript.js:5
  3 setTimeout(() => {
  4   debugger;
> 5   console.log('world');
  6 }, 1000);
  7 console.log('hello');
debug> repl
Press Ctrl+C to leave debug repl
> x
5
> 2 + 2
4
debug> next
< world
<
break in myscript.js:6
  4   debugger;
  5   console.log('world');
> 6 }, 1000);
  7 console.log('hello');
  8
debug> .exit
$
```
`repl` コマンドを使用すると、コードをリモートで評価できます。 `next` コマンドは、次の行にステップします。 他に使用可能なコマンドを確認するには、`help` と入力します。

コマンドを入力せずに `enter` キーを押すと、前のデバッガーコマンドが繰り返されます。


## ウォッチャー {#watchers}

デバッグ中に式や変数の値を監視することができます。すべてのブレークポイントで、ウォッチャーリストの各式は現在のコンテキストで評価され、ブレークポイントのソースコードリストの直前に表示されます。

式の監視を開始するには、`watch('my_expression')`と入力します。コマンド`watchers`は、アクティブなウォッチャーを出力します。ウォッチャーを削除するには、`unwatch('my_expression')`と入力します。

## コマンドリファレンス {#command-reference}

### ステップ実行 {#stepping}

- `cont`, `c`: 実行を継続
- `next`, `n`: 次へステップ
- `step`, `s`: ステップイン
- `out`, `o`: ステップアウト
- `pause`: 実行中のコードを一時停止（開発者ツールのポーズボタンと同様）

### ブレークポイント {#breakpoints}

- `setBreakpoint()`, `sb()`: 現在の行にブレークポイントを設定
- `setBreakpoint(line)`, `sb(line)`: 特定の行にブレークポイントを設定
- `setBreakpoint('fn()')`, `sb(...)`: 関数の本体の最初のステートメントにブレークポイントを設定
- `setBreakpoint('script.js', 1)`, `sb(...)`: `script.js`の最初の行にブレークポイントを設定
- `setBreakpoint('script.js', 1, 'num \< 4')`, `sb(...)`: `script.js`の最初の行に条件付きブレークポイントを設定。`num \< 4`が`true`と評価された場合にのみ中断
- `clearBreakpoint('script.js', 1)`, `cb(...)`: `script.js`の1行目のブレークポイントをクリア

まだロードされていないファイル（モジュール）にブレークポイントを設定することもできます。

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/48a5b28a-550c-471b-b5e1-d13dd7165df9
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
Break on start in main.js:1
> 1 const mod = require('./mod.js');
  2 mod.hello();
  3 mod.hello();
debug> setBreakpoint('mod.js', 22)
Warning: script 'mod.js' was not loaded yet.
debug> c
break in mod.js:22
 20 // USE OR OTHER DEALINGS IN THE SOFTWARE.
 21
>22 exports.hello = function() {
 23   return 'hello from module';
 24 };
debug>
```
指定された式が`true`と評価された場合にのみ中断する条件付きブレークポイントを設定することもできます。

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/ce24daa8-3816-44d4-b8ab-8273c8a66d35
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
Break on start in main.js:7
  5 }
  6
> 7 addOne(10);
  8 addOne(-1);
  9
debug> setBreakpoint('main.js', 4, 'num < 0')
  1 'use strict';
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
  7 addOne(10);
  8 addOne(-1);
  9
debug> cont
break in main.js:4
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
debug> exec('num')
-1
debug>
```

### 情報 {#information}

- `backtrace`, `bt`: 現在の実行フレームのバックトレースを印刷
- `list(5)`: スクリプトのソースコードを5行のコンテキストでリスト表示 (前後に5行)
- `watch(expr)`: 式をウォッチリストに追加
- `unwatch(expr)`: ウォッチリストから式を削除
- `unwatch(index)`: ウォッチリストの特定のインデックスにある式を削除
- `watchers`: すべてのウォッチャーとその値をリスト表示 (各ブレークポイントで自動的にリスト表示)
- `repl`: デバッグスクリプトのコンテキストで評価するためのデバッガーのREPLを開く
- `exec expr`, `p expr`: デバッグスクリプトのコンテキストで式を実行し、その値を印刷
- `profile`: CPUプロファイリングセッションを開始
- `profileEnd`: 現在のCPUプロファイリングセッションを停止
- `profiles`: 完了したすべてのCPUプロファイリングセッションをリスト表示
- `profiles[n].save(filepath = 'node.cpuprofile')`: CPUプロファイリングセッションをJSONとしてディスクに保存
- `takeHeapSnapshot(filepath = 'node.heapsnapshot')`: ヒープスナップショットを取得し、JSONとしてディスクに保存

### 実行制御 {#execution-control}

- `run`: スクリプトを実行 (デバッガーの起動時に自動的に実行)
- `restart`: スクリプトを再起動
- `kill`: スクリプトを強制終了

### その他 {#various}

- `scripts`: ロードされたすべてのスクリプトをリスト表示
- `version`: V8のバージョンを表示

## 高度な使用法 {#advanced-usage}

### Node.jsのV8インスペクター統合 {#v8-inspector-integration-for-nodejs}

V8インスペクター統合により、デバッグとプロファイリングのためにChrome DevToolsをNode.jsインスタンスにアタッチできます。[Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)を使用します。

V8インスペクターは、Node.jsアプリケーションの起動時に`--inspect`フラグを渡すことで有効にできます。また、`--inspect=9222`のように、カスタムポートをそのフラグで指定することもできます。これにより、ポート9222でDevTools接続を受け入れます。

`--inspect`フラグを使用すると、デバッガーが接続される直前にコードが実行されます。つまり、デバッグを開始する前にコードが実行され始めますが、これは最初からデバッグしたい場合には理想的ではない可能性があります。

このような場合、2つの選択肢があります。

したがって、`--inspect`、`--inspect-wait`、および`--inspect-brk`のいずれを選択するかを決定する際には、コードをすぐに実行するか、実行前にデバッガーがアタッチされるのを待つか、ステップバイステップデバッグのために最初の行で中断するかを検討してください。

```bash [BASH]
$ node --inspect index.js
Debugger listening on ws://127.0.0.1:9229/dc9010dd-f8b8-4ac5-a510-c1a114ec7d29
For help, see: https://nodejs.org/en/docs/inspector
```
(上記の例では、URLの末尾にあるUUID dc9010dd-f8b8-4ac5-a510-c1a114ec7d29は動的に生成され、デバッグセッションごとに異なります。)

Chromeブラウザが66.0.3345.0より古い場合は、上記のURLで`js_app.html`の代わりに`inspector.html`を使用してください。

Chrome DevToolsは、まだ[ワーカー スレッド](/ja/nodejs/api/worker_threads)のデバッグをサポートしていません。[ndb](https://github.com/GoogleChromeLabs/ndb/)を使用してデバッグできます。

