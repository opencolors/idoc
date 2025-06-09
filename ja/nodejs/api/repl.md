---
title: Node.js REPL ドキュメント
description: Node.js REPL（Read-Eval-Print Loop）を探りましょう。これはJavaScriptコードの実行、デバッグ、Node.jsアプリケーションのテストのためのインタラクティブな環境を提供します。
head:
  - - meta
    - name: og:title
      content: Node.js REPL ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js REPL（Read-Eval-Print Loop）を探りましょう。これはJavaScriptコードの実行、デバッグ、Node.jsアプリケーションのテストのためのインタラクティブな環境を提供します。
  - - meta
    - name: twitter:title
      content: Node.js REPL ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js REPL（Read-Eval-Print Loop）を探りましょう。これはJavaScriptコードの実行、デバッグ、Node.jsアプリケーションのテストのためのインタラクティブな環境を提供します。
---


# REPL {#repl}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/repl.js](https://github.com/nodejs/node/blob/v23.5.0/lib/repl.js)

`node:repl` モジュールは、スタンドアロンのプログラムとして、または他のアプリケーションに組み込むことができる Read-Eval-Print-Loop (REPL) の実装を提供します。これは以下を使用してアクセスできます:

::: code-group
```js [ESM]
import repl from 'node:repl';
```

```js [CJS]
const repl = require('node:repl');
```
:::

## 設計と機能 {#design-and-features}

`node:repl` モジュールは、[`repl.REPLServer`](/ja/nodejs/api/repl#class-replserver) クラスをエクスポートします。実行中、[`repl.REPLServer`](/ja/nodejs/api/repl#class-replserver) のインスタンスは、ユーザー入力の個々の行を受け入れ、ユーザー定義の評価関数に従ってそれらを評価し、結果を出力します。入力と出力はそれぞれ `stdin` と `stdout` からの場合もあれば、任意の Node.js [ストリーム](/ja/nodejs/api/stream) に接続される場合もあります。

[`repl.REPLServer`](/ja/nodejs/api/repl#class-replserver) のインスタンスは、入力の自動補完、補完プレビュー、簡素化された Emacs スタイルの行編集、複数行入力、[ZSH](https://en.wikipedia.org/wiki/Z_shell) のような逆方向 i-search、[ZSH](https://en.wikipedia.org/wiki/Z_shell) のような部分文字列ベースの履歴検索、ANSI スタイルの出力、現在の REPL セッション状態の保存と復元、エラー回復、およびカスタマイズ可能な評価関数をサポートします。ANSI スタイルと Emacs スタイルの行編集をサポートしない端末は、自動的に制限された機能セットにフォールバックします。

### コマンドと特殊キー {#commands-and-special-keys}

次の特殊コマンドは、すべての REPL インスタンスでサポートされています:

- `.break`: 複数行の式を入力している途中で、`.break` コマンドを入力する (または + を押す) と、その式のさらなる入力または処理を中止します。
- `.clear`: REPL の `context` を空のオブジェクトにリセットし、入力中の複数行の式をすべてクリアします。
- `.exit`: I/O ストリームを閉じ、REPL を終了させます。
- `.help`: 特殊コマンドのこのリストを表示します。
- `.save`: 現在の REPL セッションをファイルに保存します: `\> .save ./file/to/save.js`
- `.load`: ファイルを現在の REPL セッションにロードします。 `\> .load ./file/to/load.js`
- `.editor`: エディターモードに入ります (+ で終了、 + でキャンセル)。

```bash [BASH]
> .editor
// エディターモードに入ります (^D で終了、^C でキャンセル)
function welcome(name) {
  return `Hello ${name}!`;
}

welcome('Node.js User');

// ^D
'Hello Node.js User!'
>
```
REPL の次のキーの組み合わせには、これらの特別な効果があります:

- +: 1 回押すと、`.break` コマンドと同じ効果があります。空白行で 2 回押すと、`.exit` コマンドと同じ効果があります。
- +: `.exit` コマンドと同じ効果があります。
- : 空白行で押すと、グローバル変数とローカル (スコープ) 変数が表示されます。他の入力を入力中に押すと、関連するオートコンプリートオプションが表示されます。

逆方向 i-search に関連するキーバインドについては、[`reverse-i-search`](/ja/nodejs/api/repl#reverse-i-search) を参照してください。他のすべてのキーバインドについては、[TTY キーバインド](/ja/nodejs/api/readline#tty-keybindings) を参照してください。


### デフォルトの評価 {#default-evaluation}

デフォルトでは、[`repl.REPLServer`](/ja/nodejs/api/repl#class-replserver) のすべてのインスタンスは、JavaScript 式を評価し、Node.js の組み込みモジュールへのアクセスを提供する評価関数を使用します。このデフォルトの動作は、[`repl.REPLServer`](/ja/nodejs/api/repl#class-replserver) インスタンスの作成時に代替の評価関数を渡すことでオーバーライドできます。

#### JavaScript 式 {#javascript-expressions}

デフォルトのエバリュエーターは、JavaScript 式の直接評価をサポートしています。

```bash [BASH]
> 1 + 1
2
> const m = 2
undefined
> m + 1
3
```
ブロックまたは関数内で別途スコープが設定されていない限り、暗黙的に宣言された変数、または `const`、`let`、`var` キーワードを使用して宣言された変数は、グローバルスコープで宣言されます。

#### グローバルスコープとローカルスコープ {#global-and-local-scope}

デフォルトのエバリュエーターは、グローバルスコープに存在するすべての変数へのアクセスを提供します。各 `REPLServer` に関連付けられた `context` オブジェクトに代入することで、変数を REPL に明示的に公開できます。

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

repl.start('> ').context.m = msg;
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

repl.start('> ').context.m = msg;
```
:::

`context` オブジェクトのプロパティは、REPL 内でローカルとして表示されます。

```bash [BASH]
$ node repl_test.js
> m
'message'
```
コンテキストプロパティは、デフォルトでは読み取り専用ではありません。読み取り専用のグローバル変数を指定するには、`Object.defineProperty()` を使用してコンテキストプロパティを定義する必要があります。

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```
:::

#### Node.js コアモジュールへのアクセス {#accessing-core-nodejs-modules}

デフォルトのエバリュエーターは、使用時に Node.js コアモジュールを REPL 環境に自動的にロードします。たとえば、グローバル変数またはスコープ変数として別途宣言されていない限り、入力 `fs` はオンデマンドで `global.fs = require('node:fs')` として評価されます。

```bash [BASH]
> fs.createReadStream('./some/file');
```

#### グローバルな未処理例外 {#global-uncaught-exceptions}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.3.0 | REPL がスタンドアロンプログラムとして使用されている場合、`'uncaughtException'` イベントがトリガーされるようになりました。 |
:::

REPL は、[`domain`](/ja/nodejs/api/domain) モジュールを使用して、その REPL セッションのすべての未処理例外をキャッチします。

REPL での [`domain`](/ja/nodejs/api/domain) モジュールの使用には、次の副作用があります。

- 未処理例外は、スタンドアロン REPL でのみ [`'uncaughtException'`](/ja/nodejs/api/process#event-uncaughtexception) イベントを発行します。別の Node.js プログラム内の REPL でこのイベントのリスナーを追加すると、[`ERR_INVALID_REPL_INPUT`](/ja/nodejs/api/errors#err_invalid_repl_input) が発生します。
- [`process.setUncaughtExceptionCaptureCallback()`](/ja/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) を使用しようとすると、[`ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE`](/ja/nodejs/api/errors#err_domain_cannot_set_uncaught_exception_capture) エラーがスローされます。

#### `_` (アンダースコア) 変数の割り当て {#assignment-of-the-_-underscore-variable}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.8.0 | `_error` のサポートが追加されました。 |
:::

デフォルトの評価器は、デフォルトで、最後に評価された式の結果を特殊変数 `_` (アンダースコア) に割り当てます。`_` に値を明示的に設定すると、この動作は無効になります。

```bash [BASH]
> [ 'a', 'b', 'c' ]
[ 'a', 'b', 'c' ]
> _.length
3
> _ += 1
Expression assignment to _ now disabled.
4
> 1 + 1
2
> _
4
```

同様に、`_error` は、エラーがあった場合、最後に発生したエラーを参照します。`_error` に値を明示的に設定すると、この動作は無効になります。

```bash [BASH]
> throw new Error('foo');
Uncaught Error: foo
> _error.message
'foo'
```

#### `await` キーワード {#await-keyword}

`await` キーワードのサポートは、トップレベルで有効になっています。

```bash [BASH]
> await Promise.resolve(123)
123
> await Promise.reject(new Error('REPL await'))
Uncaught Error: REPL await
    at REPL2:1:54
> const timeout = util.promisify(setTimeout);
undefined
> const old = Date.now(); await timeout(1000); console.log(Date.now() - old);
1002
undefined
```

REPL で `await` キーワードを使用する場合の既知の制限事項の 1 つは、`const` および `let` キーワードのレキシカルスコープが無効になることです。

例:

```bash [BASH]
> const m = await Promise.resolve(123)
undefined
> m
123
> const m = await Promise.resolve(234)
undefined
> m
234
```

[`--no-experimental-repl-await`](/ja/nodejs/api/cli#--no-experimental-repl-await) は、REPL でのトップレベルの await を無効にします。


### Reverse-i-search {#reverse-i-search}

**追加:** v13.6.0, v12.17.0

REPLは[ZSH](https://en.wikipedia.org/wiki/Z_shell)と同様の双方向reverse-i-searchをサポートします。 これは + で後方検索、 + で前方検索がトリガーされます。

重複した履歴エントリはスキップされます。

reverse searchに対応しないキーが押されると、すぐにエントリが受け入れられます。 キャンセルするには、 または + を押します。

方向を変更すると、現在の位置から期待される方向の次のエントリがすぐに検索されます。

### カスタム評価関数 {#custom-evaluation-functions}

新しい [`repl.REPLServer`](/ja/nodejs/api/repl#class-replserver) が作成される際、カスタム評価関数を指定できます。 これは例えば、完全にカスタマイズされたREPLアプリケーションを実装するために使用できます。

以下は、与えられた数の二乗を計算するREPLの例です。

::: code-group
```js [ESM]
import repl from 'node:repl';

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Enter a number: ', eval: myEval });
```

```js [CJS]
const repl = require('node:repl');

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Enter a number: ', eval: myEval });
```
:::

#### 回復可能なエラー {#recoverable-errors}

REPLプロンプトで、 を押すと、現在の入力行が `eval` 関数に送信されます。 複数行の入力をサポートするために、`eval` 関数は `repl.Recoverable` のインスタンスを提供されたコールバック関数に返すことができます。

```js [ESM]
function myEval(cmd, context, filename, callback) {
  let result;
  try {
    result = vm.runInThisContext(cmd);
  } catch (e) {
    if (isRecoverableError(e)) {
      return callback(new repl.Recoverable(e));
    }
  }
  callback(null, result);
}

function isRecoverableError(error) {
  if (error.name === 'SyntaxError') {
    return /^(Unexpected end of input|Unexpected token)/.test(error.message);
  }
  return false;
}
```

### REPL 出力のカスタマイズ {#customizing-repl-output}

デフォルトでは、[`repl.REPLServer`](/ja/nodejs/api/repl#class-replserver) インスタンスは、提供された `Writable` ストリーム（デフォルトでは `process.stdout`）に出力を書き込む前に、[`util.inspect()`](/ja/nodejs/api/util#utilinspectobject-options) メソッドを使用して出力をフォーマットします。`showProxy` インスペクションオプションはデフォルトで true に設定され、`colors` オプションは REPL の `useColors` オプションに応じて true に設定されます。

`useColors` ブール値オプションは、構築時に指定して、デフォルトのライターに、`util.inspect()` メソッドからの出力を色付けするために ANSI スタイルコードを使用するように指示できます。

REPL がスタンドアロンプログラムとして実行される場合、REPL の [インスペクションのデフォルト値](/ja/nodejs/api/util#utilinspectobject-options) を、[`util.inspect()`](/ja/nodejs/api/util#utilinspectobject-options) の `defaultOptions` を反映する `inspect.replDefaults` プロパティを使用して、REPL 内部から変更することもできます。

```bash [BASH]
> util.inspect.replDefaults.compact = false;
false
> [1]
[
  1
]
>
```
[`repl.REPLServer`](/ja/nodejs/api/repl#class-replserver) インスタンスの出力を完全にカスタマイズするには、構築時に `writer` オプションに新しい関数を渡します。たとえば、次の例では、すべての入力テキストを大文字に変換します。



::: code-group
```js [ESM]
import repl from 'node:repl';

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```

```js [CJS]
const repl = require('node:repl');

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```
:::

## クラス: `REPLServer` {#class-replserver}

**追加:** v0.1.91**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [`repl.start()`](/ja/nodejs/api/repl#replstartoptions) を参照
- 拡張: [\<readline.Interface\>](/ja/nodejs/api/readline#class-readlineinterface)

`repl.REPLServer` のインスタンスは、[`repl.start()`](/ja/nodejs/api/repl#replstartoptions) メソッドを使用するか、JavaScript の `new` キーワードを直接使用して作成されます。



::: code-group
```js [ESM]
import repl from 'node:repl';

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```

```js [CJS]
const repl = require('node:repl');

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```
:::


### Event: `'exit'` {#event-exit}

**追加: v0.7.7**

`'exit'` イベントは、REPL が終了する際に発行されます。終了は、`.exit` コマンドが入力された場合、ユーザーが + を 2 回押して `SIGINT` を送信した場合、または + を押して入力ストリームで `'end'` を送信した場合に発生します。リスナーコールバックは引数なしで呼び出されます。

```js [ESM]
replServer.on('exit', () => {
  console.log('Received "exit" event from repl!');
  process.exit();
});
```
### Event: `'reset'` {#event-reset}

**追加: v0.11.0**

`'reset'` イベントは、REPL のコンテキストがリセットされたときに発行されます。これは、`.clear` コマンドが入力されたときに常に発生します。*ただし*、REPL がデフォルトの評価器を使用しており、`repl.REPLServer` インスタンスが `useGlobal` オプションを `true` に設定して作成された場合は除きます。リスナーコールバックは、唯一の引数として `context` オブジェクトへの参照とともに呼び出されます。

これは主に、REPL コンテキストを事前に定義された状態に再初期化するために使用できます。

::: code-group
```js [ESM]
import repl from 'node:repl';

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```

```js [CJS]
const repl = require('node:repl');

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```
:::

このコードが実行されると、グローバルの `'m'` 変数は変更できますが、`.clear` コマンドを使用して初期値にリセットできます。

```bash [BASH]
$ ./node example.js
> m
'test'
> m = 1
1
> m
1
> .clear
Clearing context...
> m
'test'
>
```
### `replServer.defineCommand(keyword, cmd)` {#replserverdefinecommandkeyword-cmd}

**追加: v0.3.0**

- `keyword` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コマンドキーワード（先頭の `.` 文字*なし*）。
- `cmd` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) コマンドが処理されるときに呼び出す関数。

`replServer.defineCommand()` メソッドは、新しい `.` で始まるコマンドを REPL インスタンスに追加するために使用されます。このようなコマンドは、`.` の後に `keyword` を入力することで呼び出されます。`cmd` は `Function` または次のプロパティを持つ `Object` のいずれかです。

- `help` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `.help` が入力されたときに表示されるヘルプテキスト（オプション）。
- `action` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 実行する関数。オプションで、単一の文字列引数を受け入れます。

次の例は、REPL インスタンスに追加された 2 つの新しいコマンドを示しています。

::: code-group
```js [ESM]
import repl from 'node:repl';

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```

```js [CJS]
const repl = require('node:repl');

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```
:::

新しいコマンドは、REPL インスタンス内から使用できます。

```bash [BASH]
> .sayhello Node.js User
Hello, Node.js User!
> .saybye
Goodbye!
```

### `replServer.displayPrompt([preserveCursor])` {#replserverdisplaypromptpreservecursor}

**Added in: v0.1.91**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`replServer.displayPrompt()` メソッドは、REPLインスタンスがユーザーからの入力を受け入れる準備をします。設定された `prompt` を `output` の新しい行に出力し、新しい入力を受け入れるために `input` を再開します。

複数行の入力が行われている場合、「プロンプト」ではなく省略記号が出力されます。

`preserveCursor` が `true` の場合、カーソルの位置は `0` にリセットされません。

`replServer.displayPrompt` メソッドは、主に `replServer.defineCommand()` メソッドを使用して登録されたコマンドのアクション関数内から呼び出されることを目的としています。

### `replServer.clearBufferedCommand()` {#replserverclearbufferedcommand}

**Added in: v9.0.0**

`replServer.clearBufferedCommand()` メソッドは、バッファリングされているがまだ実行されていないコマンドをすべてクリアします。このメソッドは、主に `replServer.defineCommand()` メソッドを使用して登録されたコマンドのアクション関数内から呼び出されることを目的としています。

### `replServer.setupHistory(historyPath, callback)` {#replserversetuphistoryhistorypath-callback}

**Added in: v11.10.0**

- `historyPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ヒストリーファイルへのパス
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) ヒストリーの書き込み準備完了時またはエラー時に呼び出されます
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `repl` [\<repl.REPLServer\>](/ja/nodejs/api/repl#class-replserver)
  
 

REPLインスタンスのヒストリーログファイルを初期化します。Node.jsバイナリを実行し、コマンドラインREPLを使用する場合、ヒストリーファイルはデフォルトで初期化されます。ただし、REPLをプログラムで作成する場合はそうではありません。REPLインスタンスをプログラムで使用する場合は、このメソッドを使用してヒストリーログファイルを初期化します。

## `repl.builtinModules` {#replbuiltinmodules}

**Added in: v14.5.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

すべてのNode.jsモジュールの名前のリスト。たとえば、 `'http'` などです。


## `repl.start([options])` {#replstartoptions}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.4.0, v12.17.0 | `preview` オプションが利用可能になりました。 |
| v12.0.0 | `terminal` オプションは、すべての場合においてデフォルトの説明に従うようになり、`useColors` は利用可能な場合は `hasColors()` をチェックします。 |
| v10.0.0 | `REPL_MAGIC_MODE` `replMode` が削除されました。 |
| v6.3.0 | `breakEvalOnSigint` オプションがサポートされるようになりました。 |
| v5.8.0 | `options` パラメーターがオプションになりました。 |
| v0.1.91 | 追加: v0.1.91 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 表示する入力プロンプト。**デフォルト:** `'\> '` (末尾にスペースあり)。
    - `input` [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable) REPL 入力が読み込まれる `Readable` ストリーム。**デフォルト:** `process.stdin`。
    - `output` [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable) REPL 出力が書き込まれる `Writable` ストリーム。**デフォルト:** `process.stdout`。
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`output` は TTY 端末として扱われるべきであることを指定します。**デフォルト:** インスタンス化時に `output` ストリームの `isTTY` プロパティの値をチェックします。
    - `eval` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 入力された各行を評価するときに使用される関数。**デフォルト:** JavaScript の `eval()` 関数用の非同期ラッパー。`eval` 関数は `repl.Recoverable` でエラーを出し、入力が不完全であることを示し、追加の行を要求できます。
    - `useColors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、デフォルトの `writer` 関数に REPL 出力への ANSI カラー スタイルを含めることを指定します。カスタムの `writer` 関数が指定されている場合、これは効果がありません。**デフォルト:** REPL インスタンスの `terminal` 値が `true` の場合に `output` ストリームのカラー サポートをチェックします。
    - `useGlobal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、デフォルトの評価関数が REPL インスタンスに対して新しい別のコンテキストを作成するのではなく、コンテキストとして JavaScript の `global` を使用することを指定します。node CLI REPL はこの値を `true` に設定します。**デフォルト:** `false`。
    - `ignoreUndefined` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、デフォルトのライターは、コマンドの戻り値が `undefined` と評価される場合、出力しないことを指定します。**デフォルト:** `false`。
    - `writer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `output` に書き込む前に、各コマンドの出力をフォーマットするために呼び出す関数。**デフォルト:** [`util.inspect()`](/ja/nodejs/api/util#utilinspectobject-options)。
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) カスタムの Tab キーによるオートコンプリートに使用されるオプションの関数。例については、[`readline.InterfaceCompleter`](/ja/nodejs/api/readline#use-of-the-completer-function) を参照してください。
    - `replMode` [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) デフォルトのエバリュエーターがすべての JavaScript コマンドを厳格モードまたはデフォルト (sloppy) モードで実行するかどうかを指定するフラグ。使用できる値は次のとおりです。
        - 式を sloppy モードで評価するための `repl.REPL_MODE_SLOPPY`。
        - 式を strict モードで評価するための `repl.REPL_MODE_STRICT`。これは、すべての repl ステートメントの前に `'use strict'` を付加するのと同じです。

    - `breakEvalOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) + が押されたときなど、`SIGINT` を受信すると、現在のコードの評価を停止します。これは、カスタムの `eval` 関数と一緒に使用することはできません。**デフォルト:** `false`。
    - `preview` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) repl がオートコンプリートと出力のプレビューを出力するかどうかを定義します。**デフォルト:** デフォルトの eval 関数を使用する場合は `true` で、カスタムの eval 関数を使用する場合は `false` です。`terminal` が falsy の場合、プレビューはなく、`preview` の値は効果がありません。

- 返却値: [\<repl.REPLServer\>](/ja/nodejs/api/repl#class-replserver)

`repl.start()` メソッドは、[`repl.REPLServer`](/ja/nodejs/api/repl#class-replserver) インスタンスを作成して開始します。

`options` が文字列の場合、入力プロンプトを指定します。

::: code-group
```js [ESM]
import repl from 'node:repl';

// Unix スタイルのプロンプト
repl.start('$ ');
```

```js [CJS]
const repl = require('node:repl');

// Unix スタイルのプロンプト
repl.start('$ ');
```
:::


## Node.js REPL {#the-nodejs-repl}

Node.js自体は、JavaScriptを実行するためのインタラクティブなインターフェースを提供するために、`node:repl`モジュールを使用します。これは、引数を渡さずにNode.jsバイナリを実行する（または`-i`引数を渡す）ことで使用できます。

```bash [BASH]
$ node
> const a = [1, 2, 3];
undefined
> a
[ 1, 2, 3 ]
> a.forEach((v) => {
...   console.log(v);
...   });
1
2
3
```
### 環境変数オプション {#environment-variable-options}

Node.js REPLのさまざまな動作は、次の環境変数を使用してカスタマイズできます。

- `NODE_REPL_HISTORY`: 有効なパスが指定されている場合、永続的なREPL履歴は、ユーザーのホームディレクトリにある`.node_repl_history`ではなく、指定されたファイルに保存されます。この値を`''`（空文字列）に設定すると、永続的なREPL履歴が無効になります。空白は値から削除されます。Windowsプラットフォームでは、空の値を持つ環境変数は無効であるため、永続的なREPL履歴を無効にするには、この変数を1つ以上のスペースに設定します。
- `NODE_REPL_HISTORY_SIZE`: 履歴が利用可能な場合に永続化される履歴の行数を制御します。正の数である必要があります。**デフォルト:** `1000`。
- `NODE_REPL_MODE`: `'sloppy'`または`'strict'`のいずれかになります。**デフォルト:** `'sloppy'`で、非strictモードのコードを実行できます。

### 永続的な履歴 {#persistent-history}

デフォルトでは、Node.js REPLは、ユーザーのホームディレクトリにある`.node_repl_history`ファイルに入力を保存することにより、`node` REPLセッション間で履歴を保持します。これは、環境変数`NODE_REPL_HISTORY=''`を設定することで無効にできます。

### 高度なラインエディタでのNode.js REPLの使用 {#using-the-nodejs-repl-with-advanced-line-editors}

高度なラインエディタの場合は、環境変数`NODE_NO_READLINE=1`を設定してNode.jsを起動します。これにより、メインおよびデバッガーREPLが標準のターミナル設定で起動し、`rlwrap`で使用できるようになります。

たとえば、次のものを`.bashrc`ファイルに追加できます。

```bash [BASH]
alias node="env NODE_NO_READLINE=1 rlwrap node"
```
### 単一の実行中のインスタンスに対して複数のREPLインスタンスを開始する {#starting-multiple-repl-instances-against-a-single-running-instance}

単一の`global`オブジェクトを共有するが、別々のI/Oインターフェースを持つNode.jsの単一の実行中のインスタンスに対して、複数のREPLインスタンスを作成して実行できます。

たとえば、次の例では、`stdin`、Unixソケット、およびTCPソケットで個別のREPLを提供します。

::: code-group
```js [ESM]
import net from 'node:net';
import repl from 'node:repl';
import process from 'node:process';

let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```

```js [CJS]
const net = require('node:net');
const repl = require('node:repl');
let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```
:::

コマンドラインからこのアプリケーションを実行すると、stdinでREPLが開始されます。他のREPLクライアントは、UnixソケットまたはTCPソケットを介して接続できます。たとえば、`telnet`はTCPソケットへの接続に役立ち、`socat`はUnixソケットとTCPソケットの両方に接続するために使用できます。

stdinの代わりにUnixソケットベースのサーバーからREPLを起動することにより、再起動せずに長時間実行されているNode.jsプロセスに接続できます。

`net.Server`および`net.Socket`インスタンスを介して"フル機能"（`terminal`）REPLを実行する例については、[https://gist.github.com/TooTallNate/2209310](https://gist.github.com/TooTallNate/2209310)を参照してください。

[`curl(1)`](https://curl.haxx.se/docs/manpage)を介してREPLインスタンスを実行する例については、[https://gist.github.com/TooTallNate/2053342](https://gist.github.com/TooTallNate/2053342)を参照してください。

この例は、Node.js REPLをさまざまなI/Oストリームを使用して開始する方法を示すことを目的としています。追加の保護対策なしに、本番環境やセキュリティが懸念される状況で使用**しないでください**。実際のアプリケーションでREPLを実装する必要がある場合は、安全な入力メカニズムを使用したり、オープンネットワークインターフェースを回避したりするなど、これらのリスクを軽減する代替アプローチを検討してください。

