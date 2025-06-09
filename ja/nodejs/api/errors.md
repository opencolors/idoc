---
title: Node.js ドキュメント - エラー
description: Node.jsのドキュメントのこのセクションでは、エラークラス、エラーコード、およびNode.jsアプリケーションでのエラー処理方法について詳しく説明しています。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - エラー | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのドキュメントのこのセクションでは、エラークラス、エラーコード、およびNode.jsアプリケーションでのエラー処理方法について詳しく説明しています。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - エラー | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのドキュメントのこのセクションでは、エラークラス、エラーコード、およびNode.jsアプリケーションでのエラー処理方法について詳しく説明しています。
---


# エラー {#errors}

Node.jsで実行されているアプリケーションは、一般的に以下の4つのカテゴリーのエラーに遭遇します。

- [\<EvalError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError)、[\<SyntaxError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError)、[\<RangeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)、[\<ReferenceError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)、[\<TypeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)、[\<URIError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError)のような標準的なJavaScriptエラー。
- 存在しないファイルを開こうとしたり、閉じられたソケットを介してデータを送信しようとするなど、基盤となるオペレーティングシステムの制約によってトリガーされるシステムエラー。
- アプリケーションコードによってトリガーされるユーザー指定のエラー。
- `AssertionError`は、Node.jsが起こりえない例外的なロジック違反を検出したときにトリガーされる可能性のある特殊な種類のエラーです。これらは通常、`node:assert`モジュールによって発生します。

Node.jsによって発生するすべてのJavaScriptおよびシステムエラーは、標準のJavaScriptの[\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)クラスから継承されるか、そのインスタンスであり、*少なくとも*そのクラスで使用可能なプロパティを提供することが保証されています。

## エラーの伝播と傍受 {#error-propagation-and-interception}

Node.jsは、アプリケーションの実行中に発生するエラーを伝播および処理するためのいくつかのメカニズムをサポートしています。これらのエラーがどのように報告され、処理されるかは、`Error`の種類と呼び出されるAPIのスタイルによって異なります。

すべてのJavaScriptエラーは例外として処理され、標準のJavaScriptの`throw`メカニズムを使用してエラーを*直ちに*生成およびスローします。これらは、JavaScript言語によって提供される[`try…catch`構造](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)を使用して処理されます。

```js [ESM]
// zが定義されていないため、ReferenceErrorでスローします。
try {
  const m = 1;
  const n = m + z;
} catch (err) {
  // ここでエラーを処理します。
}
```
JavaScriptの`throw`メカニズムを使用すると、例外が発生し、*必ず*処理する必要があります。そうでない場合、Node.jsプロセスは直ちに終了します。

いくつかの例外を除いて、*同期*API（[\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)を返さず、`callback`関数を受け入れないすべてのブロッキングメソッド。[`fs.readFileSync`](/ja/nodejs/api/fs#fsreadfilesyncpath-options)など）は、`throw`を使用してエラーを報告します。

*非同期API*内で発生するエラーは、複数の方法で報告される可能性があります。

- 一部の非同期メソッドは[\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)を返します。常にそれが拒否される可能性があることを考慮する必要があります。未処理のPromiseの拒否に対するプロセスの反応については、[`--unhandled-rejections`](/ja/nodejs/api/cli#--unhandled-rejectionsmode)フラグを参照してください。
- `callback`関数を受け入れるほとんどの非同期メソッドは、その関数の最初の引数として渡される`Error`オブジェクトを受け入れます。その最初の引数が`null`ではなく、`Error`のインスタンスである場合、処理する必要があるエラーが発生しました。
- 非同期メソッドが[`EventEmitter`](/ja/nodejs/api/events#class-eventemitter)であるオブジェクトで呼び出されると、エラーはそのオブジェクトの`'error'`イベントにルーティングできます。
- Node.js APIの一部の通常非同期メソッドは、`throw`メカニズムを使用して、`try…catch`を使用して処理する必要がある例外を発生させる場合があります。このようなメソッドの包括的なリストはありません。必要な適切なエラー処理メカニズムを判断するには、各メソッドのドキュメントを参照してください。

`'error'`イベントメカニズムの使用は、[ストリームベース](/ja/nodejs/api/stream)および[イベントエミッターベース](/ja/nodejs/api/events#class-eventemitter)のAPIで最も一般的です。これらは、時間経過に伴う一連の非同期操作（成功または失敗する可能性のある単一の操作とは対照的）を表します。

*すべての*[`EventEmitter`](/ja/nodejs/api/events#class-eventemitter)オブジェクトについて、`'error'`イベントハンドラーが提供されていない場合、エラーはスローされ、Node.jsプロセスはキャッチされない例外を報告し、クラッシュします。ただし、[`'uncaughtException'`](/ja/nodejs/api/process#event-uncaughtexception)イベントのハンドラーが登録されているか、非推奨の[`node:domain`](/ja/nodejs/api/domain)モジュールが使用されている場合は除きます。

```js [ESM]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

setImmediate(() => {
  // 'error'イベントハンドラーが追加されていないため、プロセスがクラッシュします。
  ee.emit('error', new Error('This will crash'));
});
```
この方法で生成されたエラーは、呼び出し元のコードがすでに終了した*後*にスローされるため、`try…catch`を使用して傍受*できません*。

開発者は、各メソッドのドキュメントを参照して、それらのメソッドによって発生するエラーがどのように伝播されるかを正確に判断する必要があります。


## クラス: `Error` {#class-error}

JavaScript の汎用的な [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) オブジェクトであり、エラーが発生した特定の状況を示すものではありません。 `Error` オブジェクトは、`Error` がインスタンス化されたコード内の場所を詳細に示す "スタックトレース" をキャプチャし、エラーのテキストによる説明を提供する場合があります。

Node.js によって生成されるすべてのエラーは、すべてのシステムエラーと JavaScript エラーを含めて、`Error` クラスのインスタンスであるか、`Error` クラスから継承されます。

### `new Error(message[, options])` {#new-errormessage-options}

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cause` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 新しく作成されたエラーの原因となったエラー。

新しい `Error` オブジェクトを作成し、`error.message` プロパティに指定されたテキストメッセージを設定します。 オブジェクトが `message` として渡された場合、テキストメッセージは `String(message)` を呼び出すことによって生成されます。 `cause` オプションが指定された場合、`error.cause` プロパティに割り当てられます。 `error.stack` プロパティは、`new Error()` が呼び出されたコード内の場所を表します。 スタックトレースは、[V8 のスタックトレース API](https://v8.dev/docs/stack-trace-api) に依存します。 スタックトレースは、(a) *同期コードの実行* の開始時、または (b) プロパティ `Error.stackTraceLimit` で指定されたフレーム数のうち、小さい方までしか拡張されません。

### `Error.captureStackTrace(targetObject[, constructorOpt])` {#errorcapturestacktracetargetobject-constructoropt}

- `targetObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `constructorOpt` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`targetObject` に `.stack` プロパティを作成します。このプロパティにアクセスすると、`Error.captureStackTrace()` が呼び出されたコード内の場所を表す文字列が返されます。

```js [ESM]
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // `new Error().stack` と同様
```

トレースの最初の行には `${myObject.name}: ${myObject.message}` がプレフィックスとして付加されます。

オプションの `constructorOpt` 引数は関数を受け取ります。 指定された場合、`constructorOpt` を含む `constructorOpt` より上のすべてのフレームは、生成されたスタックトレースから除外されます。

`constructorOpt` 引数は、エラー生成の実装の詳細をユーザーから隠すのに役立ちます。 例えば：

```js [ESM]
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // スタックトレースを2回計算することを避けるために、スタックトレースなしでエラーを作成します。
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // 関数 b より上のスタックトレースをキャプチャします
  Error.captureStackTrace(error, b); // 関数 c も b もスタックトレースに含まれていません
  throw error;
}

a();
```

### `Error.stackTraceLimit` {#errorstacktracelimit}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`Error.stackTraceLimit` プロパティは、スタックトレースによって収集されるスタックフレームの数を指定します（`new Error().stack` または `Error.captureStackTrace(obj)` によって生成されるかどうかに関わらず）。

デフォルト値は `10` ですが、有効な JavaScript 数値に設定できます。変更は、値が変更された *後* にキャプチャされたすべてのスタックトレースに影響します。

数値以外の値に設定した場合、または負の数値に設定した場合、スタックトレースはどのフレームもキャプチャしません。

### `error.cause` {#errorcause}

**追加:** v16.9.0

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

存在する場合、`error.cause` プロパティは、`Error` の根本的な原因です。エラーをキャッチし、別のメッセージまたはコードで新しいエラーをスローして、元のエラーにアクセスできるようにする場合に使用されます。

`error.cause` プロパティは通常、`new Error(message, { cause })` を呼び出すことによって設定されます。`cause` オプションが指定されていない場合、コンストラクターによって設定されません。

このプロパティを使用すると、エラーをチェーン化できます。`Error` オブジェクトをシリアライズする場合、[`util.inspect()`](/ja/nodejs/api/util#utilinspectobject-options) は、`error.cause` が設定されている場合は再帰的にシリアライズします。

```js [ESM]
const cause = new Error('リモート HTTP サーバーが 500 ステータスで応答しました');
const symptom = new Error('メッセージの送信に失敗しました', { cause });

console.log(symptom);
// 出力:
//   Error: メッセージの送信に失敗しました
//       at REPL2:1:17
//       at Script.runInThisContext (node:vm:130:12)
//       ... cause スタックトレースと一致する 7 行 ...
//       at [_line] [as _line] (node:internal/readline/interface:886:18) {
//     [cause]: Error: リモート HTTP サーバーが 500 ステータスで応答しました
//         at REPL1:1:15
//         at Script.runInThisContext (node:vm:130:12)
//         at REPLServer.defaultEval (node:repl:574:29)
//         at bound (node:domain:426:15)
//         at REPLServer.runBound [as eval] (node:domain:437:12)
//         at REPLServer.onLine (node:repl:902:10)
//         at REPLServer.emit (node:events:549:35)
//         at REPLServer.emit (node:domain:482:12)
//         at [_onLine] [as _onLine] (node:internal/readline/interface:425:12)
//         at [_line] [as _line] (node:internal/readline/interface:886:18)
```

### `error.code` {#errorcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.code` プロパティは、エラーの種類を識別する文字列ラベルです。`error.code` は、エラーを識別する最も安定した方法です。これは Node.js のメジャーバージョン間でのみ変更されます。対照的に、`error.message` 文字列は Node.js の任意のバージョン間で変更される可能性があります。特定のコードの詳細については、[Node.js エラーコード](/ja/nodejs/api/errors#nodejs-error-codes) を参照してください。

### `error.message` {#errormessage}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.message` プロパティは、`new Error(message)` を呼び出すことによって設定されたエラーの文字列記述です。コンストラクターに渡される `message` は、`Error` のスタックトレースの最初の行にも表示されます。ただし、`Error` オブジェクトの作成後にこのプロパティを変更しても、スタックトレースの最初の行が変更されない *可能性があり* ます (たとえば、このプロパティが変更される前に `error.stack` が読み取られた場合)。

```js [ESM]
const err = new Error('The message');
console.error(err.message);
// Prints: The message
```
### `error.stack` {#errorstack}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.stack` プロパティは、`Error` がインスタンス化されたコード内の場所を記述する文字列です。

```bash [BASH]
Error: Things keep happening!
   at /home/gbusey/file.js:525:2
   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
   at increaseSynergy (/home/gbusey/actors.js:701:6)
```
最初の行は `\<error class name\>: \<error message\>` としてフォーマットされ、その後に一連のスタックフレーム（各行は "at " で始まる）が続きます。各フレームは、エラーの生成につながったコード内の呼び出しサイトを記述します。V8 は、各関数の名前を（変数名、関数名、またはオブジェクトメソッド名で）表示しようとしますが、適切な名前を見つけられない場合があります。V8 が関数の名前を特定できない場合、そのフレームには場所情報のみが表示されます。それ以外の場合、決定された関数名は、括弧で囲まれた場所情報ととも​​に表示されます。

フレームは JavaScript 関数に対してのみ生成されます。たとえば、実行が C++ アドオン関数 `cheetahify` を介して同期的に渡され、それ自体が JavaScript 関数を呼び出す場合、`cheetahify` 呼び出しを表すフレームはスタックトレースに存在しません。

```js [ESM]
const cheetahify = require('./native-binding.node');

function makeFaster() {
  // `cheetahify()` *synchronously* calls speedy.
  cheetahify(function speedy() {
    throw new Error('oh no!');
  });
}

makeFaster();
// will throw:
//   /home/gbusey/file.js:6
//       throw new Error('oh no!');
//           ^
//   Error: oh no!
//       at speedy (/home/gbusey/file.js:6:11)
//       at makeFaster (/home/gbusey/file.js:5:3)
//       at Object.<anonymous> (/home/gbusey/file.js:10:1)
//       at Module._compile (module.js:456:26)
//       at Object.Module._extensions..js (module.js:474:10)
//       at Module.load (module.js:356:32)
//       at Function.Module._load (module.js:312:12)
//       at Function.Module.runMain (module.js:497:10)
//       at startup (node.js:119:16)
//       at node.js:906:3
```
場所情報は次のいずれかになります。

- フレームが V8 内部の呼び出しを表す場合は `native`（`[].forEach` など）。
- フレームが Node.js 内部の呼び出しを表す場合は `plain-filename.js:line:column`。
- フレームが（CommonJS モジュールシステムを使用した）ユーザープログラムまたはその依存関係の呼び出しを表す場合は `/absolute/path/to/file.js:line:column`。
- フレームが（ES モジュールシステムを使用した）ユーザープログラムまたはその依存関係の呼び出しを表す場合は `\<transport-protocol\>:///url/to/module/file.mjs:line:column`。

スタックトレースを表す文字列は、`error.stack` プロパティが **アクセスされた** ときに遅延生成されます。

スタックトレースによってキャプチャされるフレームの数は、`Error.stackTraceLimit` または現在のイベントループティックで使用可能なフレーム数のうち小さい方によって制限されます。


## クラス: `AssertionError` {#class-assertionerror}

- 継承元: [\<errors.Error\>](/ja/nodejs/api/errors#class-error)

アサーションの失敗を示します。詳細については、[`Class: assert.AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) を参照してください。

## クラス: `RangeError` {#class-rangeerror}

- 継承元: [\<errors.Error\>](/ja/nodejs/api/errors#class-error)

提供された引数が、関数の許容可能な値のセットまたは範囲内にないことを示します。これは数値範囲であるか、特定の関数パラメーターのオプションのセットの範囲外であるかを問いません。

```js [ESM]
require('node:net').connect(-1);
// "RangeError: "port" option should be >= 0 and < 65536: -1" をスロー
```
Node.jsは、引数検証の形式として、`RangeError`インスタンスを*即座に*生成してスローします。

## クラス: `ReferenceError` {#class-referenceerror}

- 継承元: [\<errors.Error\>](/ja/nodejs/api/errors#class-error)

定義されていない変数にアクセスしようとしていることを示します。このようなエラーは通常、コードのタイプミスや、その他の壊れたプログラムを示します。

クライアントコードがこれらのエラーを生成して伝播することはできますが、実際にはV8のみがそれを行います。

```js [ESM]
doesNotExist;
// ReferenceErrorをスローします。doesNotExistはこのプログラムの変数ではありません。
```
アプリケーションが動的にコードを生成して実行していない限り、`ReferenceError`インスタンスはコードまたはその依存関係のバグを示します。

## クラス: `SyntaxError` {#class-syntaxerror}

- 継承元: [\<errors.Error\>](/ja/nodejs/api/errors#class-error)

プログラムが有効なJavaScriptではないことを示します。これらのエラーは、コード評価の結果としてのみ生成および伝播される可能性があります。コード評価は、`eval`、`Function`、`require`、または[vm](/ja/nodejs/api/vm)の結果として発生する可能性があります。これらのエラーは、ほとんどの場合、壊れたプログラムを示しています。

```js [ESM]
try {
  require('node:vm').runInThisContext('binary ! isNotOk');
} catch (err) {
  // 'err' はSyntaxErrorになります。
}
```
`SyntaxError`インスタンスは、それを作成したコンテキストでは回復できません。他のコンテキストによってのみキャッチできます。

## クラス: `SystemError` {#class-systemerror}

- 継承元: [\<errors.Error\>](/ja/nodejs/api/errors#class-error)

Node.jsは、ランタイム環境内で例外が発生した場合にシステムエラーを生成します。これらは通常、アプリケーションがオペレーティングシステムの制約に違反した場合に発生します。たとえば、アプリケーションが存在しないファイルを読み取ろうとすると、システムエラーが発生します。

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 存在する場合、ネットワーク接続が失敗したアドレス
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 文字列のエラーコード
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 存在する場合、ファイルシステムエラーを報告する際のファイルパスの宛先
- `errno` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) システムが提供するエラー番号
- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 存在する場合、エラー状態に関する追加の詳細
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) システムが提供する人間が読めるエラーの説明
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 存在する場合、ファイルシステムエラーを報告する際のファイルパス
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 存在する場合、利用できないネットワーク接続ポート
- `syscall` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) エラーをトリガーしたシステムコールの名前


### `error.address` {#erroraddress}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

存在する場合、`error.address` はネットワーク接続に失敗したアドレスを記述する文字列です。

### `error.code` {#errorcode_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.code` プロパティは、エラーコードを表す文字列です。

### `error.dest` {#errordest}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

存在する場合、`error.dest` は、ファイルシステムエラーを報告する際のファイルパスの宛先です。

### `error.errno` {#errorerrno}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`error.errno` プロパティは、[`libuv Error handling`](https://docs.libuv.org/en/v1.x/errors) で定義されたエラーコードに対応する負の数です。

Windows では、システムから提供されたエラー番号は libuv によって正規化されます。

エラーコードの文字列表現を取得するには、[`util.getSystemErrorName(error.errno)`](/ja/nodejs/api/util#utilgetsystemerrornameerr) を使用してください。

### `error.info` {#errorinfo}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

存在する場合、`error.info` はエラー状態に関する詳細情報を持つオブジェクトです。

### `error.message` {#errormessage_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.message` は、システムが提供する、人間が読めるエラーの説明です。

### `error.path` {#errorpath}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

存在する場合、`error.path` は関連する無効なパス名を含む文字列です。

### `error.port` {#errorport}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

存在する場合、`error.port` は利用できないネットワーク接続ポートです。

### `error.syscall` {#errorsyscall}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.syscall` プロパティは、失敗した [syscall](https://man7.org/linux/man-pages/man2/syscalls.2) を記述する文字列です。


### 一般的なシステムエラー {#common-system-errors}

Node.jsプログラムの作成時によく遭遇するシステムエラーの一覧です。包括的なリストについては、[`errno`(3) man page](https://man7.org/linux/man-pages/man3/errno.3)を参照してください。

-  `EACCES` (Permission denied): ファイルアクセス権限によって禁止されている方法でファイルにアクセスしようとしました。
-  `EADDRINUSE` (Address already in use): ローカルシステム上の別のサーバーがすでにそのアドレスを使用しているため、サーバー（[`net`](/ja/nodejs/api/net)、[`http`](/ja/nodejs/api/http)、または[`https`](/ja/nodejs/api/https)）をローカルアドレスにバインドしようとしました。
-  `ECONNREFUSED` (Connection refused): 対象のマシンが積極的に拒否したため、接続を確立できませんでした。これは通常、外国のホストで非アクティブなサービスに接続しようとした場合に発生します。
-  `ECONNRESET` (Connection reset by peer): ピアによって接続が強制的に閉じられました。これは通常、タイムアウトまたは再起動により、リモートソケットでの接続が失われた場合に発生します。[`http`](/ja/nodejs/api/http)および[`net`](/ja/nodejs/api/net)モジュールを介してよく遭遇します。
-  `EEXIST` (File exists): 既存のファイルが、ターゲットが存在しないことを必要とする操作のターゲットになりました。
-  `EISDIR` (Is a directory): 操作はファイルを予期していましたが、指定されたパス名はディレクトリでした。
-  `EMFILE` (Too many open files in system): システムで許可されている[ファイル記述子](https://en.wikipedia.org/wiki/File_descriptor)の最大数に達し、少なくとも1つが閉じられるまで、別の記述子の要求を満たすことができません。これは、特にプロセスに対するファイル記述子の制限が低いシステム（特にmacOS）で、多数のファイルを並行して一度に開く場合に発生します。低い制限を修正するには、Node.jsプロセスを実行するのと同じシェルで`ulimit -n 2048`を実行します。
-  `ENOENT` (No such file or directory): 指定されたパス名のコンポーネントが存在しないことを示すために、[`fs`](/ja/nodejs/api/fs)操作によって一般的に発生します。指定されたパスでエンティティ（ファイルまたはディレクトリ）が見つかりませんでした。
-  `ENOTDIR` (Not a directory): 指定されたパス名のコンポーネントは存在しましたが、予期されたディレクトリではありませんでした。[`fs.readdir`](/ja/nodejs/api/fs#fsreaddirpath-options-callback)によって一般的に発生します。
-  `ENOTEMPTY` (Directory not empty): エントリを持つディレクトリが、空のディレクトリを必要とする操作のターゲットになりました。通常は[`fs.unlink`](/ja/nodejs/api/fs#fsunlinkpath-callback)です。
-  `ENOTFOUND` (DNS lookup failed): `EAI_NODATA`または`EAI_NONAME`のいずれかのDNS障害を示します。これは標準のPOSIXエラーではありません。
-  `EPERM` (Operation not permitted): 特権の昇格を必要とする操作を実行しようとしました。
-  `EPIPE` (Broken pipe): データを読み取るプロセスがないパイプ、ソケット、またはFIFOへの書き込み。[`net`](/ja/nodejs/api/net)および[`http`](/ja/nodejs/api/http)レイヤーで一般的に発生し、書き込み先のストリームのリモート側が閉じられていることを示します。
-  `ETIMEDOUT` (Operation timed out): 接続された相手が一定期間後に適切に応答しなかったため、接続または送信要求が失敗しました。通常、[`http`](/ja/nodejs/api/http)または[`net`](/ja/nodejs/api/net)で発生します。多くの場合、`socket.end()`が適切に呼び出されなかった兆候です。


## クラス: `TypeError` {#class-typeerror}

- [\<errors.Error\>](/ja/nodejs/api/errors#class-error) を拡張

提供された引数が許可された型ではないことを示します。 たとえば、文字列を期待するパラメーターに関数を渡すと、`TypeError` になります。

```js [ESM]
require('node:url').parse(() => { });
// TypeError をスローします。文字列が期待されるためです。
```

Node.js は、引数の検証の形式として、`TypeError` インスタンスを*即座に*生成してスローします。

## 例外とエラー {#exceptions-vs-errors}

JavaScript の例外は、無効な操作の結果として、または `throw` ステートメントのターゲットとしてスローされる値です。 これらの値が `Error` のインスタンスまたは `Error` から継承するクラスである必要はありませんが、Node.js または JavaScript ランタイムによってスローされるすべての例外は `Error` のインスタンス*になります*。

一部の例外は、JavaScript レイヤーでは*回復不能*です。 このような例外は、*常に* Node.js プロセスをクラッシュさせます。 例としては、C++ レイヤーでの `assert()` チェックまたは `abort()` 呼び出しなどがあります。

## OpenSSL エラー {#openssl-errors}

`crypto` または `tls` に起因するエラーは `Error` クラスであり、標準の `.code` および `.message` プロパティに加えて、OpenSSL 固有のプロパティが追加されている場合があります。

### `error.opensslErrorStack` {#erroropensslerrorstack}

OpenSSL ライブラリ内のエラーの発生源に関するコンテキストを提供する可能性のあるエラーの配列。

### `error.function` {#errorfunction}

エラーの発生源である OpenSSL 関数。

### `error.library` {#errorlibrary}

エラーの発生源である OpenSSL ライブラリ。

### `error.reason` {#errorreason}

エラーの理由を説明する人間が読める文字列。

## Node.js エラーコード {#nodejs-error-codes}

### `ABORT_ERR` {#abort_err}

**追加: v15.0.0**

操作が中止された場合に使用されます（通常は `AbortController` を使用）。

`AbortSignal` を使用*しない* API は、通常、このコードでエラーを発生させません。

このコードは、Web プラットフォームの `AbortError` との互換性を保つために、Node.js エラーが使用する通常の `ERR_*` 規則を使用していません。

### `ERR_ACCESS_DENIED` {#err_access_denied}

Node.js が [パーミッションモデル](/ja/nodejs/api/permissions#permission-model) によって制限されたリソースへのアクセスを試みるときにトリガーされる特別なタイプのエラー。


### ``ERR_AMBIGUOUS_ARGUMENT`` {#err_ambiguous_argument}

関数の引数が、関数シグネチャが誤解されている可能性を示唆する方法で使用されています。これは、`assert.throws(block, message)` の `message` パラメーターが `block` によってスローされたエラーメッセージと一致する場合に、`node:assert` モジュールによってスローされます。これは、その使用法が、ユーザーが `message` を、`block` がスローしない場合に `AssertionError` が表示するメッセージではなく、期待されるメッセージであると考えていることを示唆するためです。

### ``ERR_ARG_NOT_ITERABLE`` {#err_arg_not_iterable}

反復可能な引数（つまり、`for...of` ループで動作する値）が必要でしたが、Node.js API に提供されませんでした。

### ``ERR_ASSERTION`` {#err_assertion}

Node.js が発生してはならない例外的な論理違反を検出したときにトリガーされる可能性がある特別なタイプのエラー。これらは通常、`node:assert` モジュールによって発生します。

### ``ERR_ASYNC_CALLBACK`` {#err_async_callback}

関数ではないものを `AsyncHooks` コールバックとして登録しようとしました。

### ``ERR_ASYNC_TYPE`` {#err_async_type}

非同期リソースのタイプが無効でした。パブリック埋め込み API を使用している場合、ユーザーは独自のタイプを定義することもできます。

### ``ERR_BROTLI_COMPRESSION_FAILED`` {#err_brotli_compression_failed}

Brotli ストリームに渡されたデータが正常に圧縮されませんでした。

### ``ERR_BROTLI_INVALID_PARAM`` {#err_brotli_invalid_param}

Brotli ストリームの構築中に無効なパラメーターキーが渡されました。

### ``ERR_BUFFER_CONTEXT_NOT_AVAILABLE`` {#err_buffer_context_not_available}

Node.js インスタンスに関連付けられていない JS エンジンコンテキストで、アドオンまたは埋め込みコードから Node.js `Buffer` インスタンスを作成しようとしました。`Buffer` メソッドに渡されたデータは、メソッドが返されるまでに解放されます。

このエラーが発生した場合、`Buffer` インスタンスを作成する代わりに、通常の `Uint8Array` を作成する方法があります。これは、結果のオブジェクトのプロトタイプのみが異なります。`Uint8Array` は、一般に `Buffer` が存在するすべての Node.js コア API で受け入れられます。これらはすべてのコンテキストで使用できます。

### ``ERR_BUFFER_OUT_OF_BOUNDS`` {#err_buffer_out_of_bounds}

`Buffer` の範囲外の操作が試みられました。

### ``ERR_BUFFER_TOO_LARGE`` {#err_buffer_too_large}

許可される最大サイズを超える `Buffer` を作成しようとしました。


### `ERR_CANNOT_WATCH_SIGINT` {#err_cannot_watch_sigint}

Node.jsが`SIGINT`シグナルを監視できませんでした。

### `ERR_CHILD_CLOSED_BEFORE_REPLY` {#err_child_closed_before_reply}

親プロセスが応答を受信する前に、子プロセスが閉じられました。

### `ERR_CHILD_PROCESS_IPC_REQUIRED` {#err_child_process_ipc_required}

IPCチャネルを指定せずに子プロセスがforkされようとした場合に使用されます。

### `ERR_CHILD_PROCESS_STDIO_MAXBUFFER` {#err_child_process_stdio_maxbuffer}

メインプロセスが子プロセスのSTDERR/STDOUTからデータを読み取ろうとしており、データの長さが`maxBuffer`オプションよりも長い場合に使用されます。

### `ERR_CLOSED_MESSAGE_PORT` {#err_closed_message_port}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v16.2.0, v14.17.1 | エラーメッセージが再導入されました。 |
| v11.12.0 | エラーメッセージが削除されました。 |
| v10.5.0 | 追加: v10.5.0 |
:::

通常、`.close()`が呼び出された後など、閉じられた状態の`MessagePort`インスタンスを使用しようとしました。

### `ERR_CONSOLE_WRITABLE_STREAM` {#err_console_writable_stream}

`Console`が`stdout`ストリームなしでインスタンス化されたか、`Console`が書き込み不可能な`stdout`または`stderr`ストリームを持っています。

### `ERR_CONSTRUCT_CALL_INVALID` {#err_construct_call_invalid}

**追加: v12.5.0**

呼び出し可能ではないクラスコンストラクタが呼び出されました。

### `ERR_CONSTRUCT_CALL_REQUIRED` {#err_construct_call_required}

クラスのコンストラクタが`new`なしで呼び出されました。

### `ERR_CONTEXT_NOT_INITIALIZED` {#err_context_not_initialized}

APIに渡されたVMコンテキストがまだ初期化されていません。 これは、たとえば、コンテキストの作成中にエラーが発生し（キャッチされた場合）、アロケーションに失敗した場合や、コンテキストの作成時に最大コールスタックサイズに達した場合に発生する可能性があります。

### `ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED` {#err_crypto_custom_engine_not_supported}

OpenSSLエンジンが要求されました（たとえば、`clientCertEngine`または`privateKeyEngine` TLSオプションを通じて）。これは、使用されているOpenSSLのバージョンではサポートされていません。コンパイル時のフラグ`OPENSSL_NO_ENGINE`が原因である可能性があります。

### `ERR_CRYPTO_ECDH_INVALID_FORMAT` {#err_crypto_ecdh_invalid_format}

`format`引数の無効な値が、`crypto.ECDH()`クラスの`getPublicKey()`メソッドに渡されました。

### `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` {#err_crypto_ecdh_invalid_public_key}

`key`引数の無効な値が、`crypto.ECDH()`クラスの`computeSecret()`メソッドに渡されました。 これは、公開鍵が楕円曲線の外にあることを意味します。


### `ERR_CRYPTO_ENGINE_UNKNOWN` {#err_crypto_engine_unknown}

無効な暗号エンジン識別子が [`require('node:crypto').setEngine()`](/ja/nodejs/api/crypto#cryptosetengineengine-flags) に渡されました。

### `ERR_CRYPTO_FIPS_FORCED` {#err_crypto_fips_forced}

[`--force-fips`](/ja/nodejs/api/cli#--force-fips) コマンドライン引数が使用されましたが、`node:crypto` モジュールで FIPS モードを有効または無効にしようとする試みがありました。

### `ERR_CRYPTO_FIPS_UNAVAILABLE` {#err_crypto_fips_unavailable}

FIPS モードを有効または無効にしようとしましたが、FIPS モードは利用できませんでした。

### `ERR_CRYPTO_HASH_FINALIZED` {#err_crypto_hash_finalized}

[`hash.digest()`](/ja/nodejs/api/crypto#hashdigestencoding) が複数回呼び出されました。`hash.digest()` メソッドは、`Hash` オブジェクトのインスタンスごとに 1 回しか呼び出すことはできません。

### `ERR_CRYPTO_HASH_UPDATE_FAILED` {#err_crypto_hash_update_failed}

[`hash.update()`](/ja/nodejs/api/crypto#hashupdatedata-inputencoding) が何らかの理由で失敗しました。これはめったに起こらないはずです。

### `ERR_CRYPTO_INCOMPATIBLE_KEY` {#err_crypto_incompatible_key}

指定された暗号鍵が、試行された操作と互換性がありません。

### `ERR_CRYPTO_INCOMPATIBLE_KEY_OPTIONS` {#err_crypto_incompatible_key_options}

選択された公開鍵または秘密鍵のエンコードは、他のオプションと互換性がありません。

### `ERR_CRYPTO_INITIALIZATION_FAILED` {#err_crypto_initialization_failed}

**追加: v15.0.0**

暗号サブシステムの初期化に失敗しました。

### `ERR_CRYPTO_INVALID_AUTH_TAG` {#err_crypto_invalid_auth_tag}

**追加: v15.0.0**

無効な認証タグが提供されました。

### `ERR_CRYPTO_INVALID_COUNTER` {#err_crypto_invalid_counter}

**追加: v15.0.0**

カウンターモードの暗号に対して無効なカウンターが提供されました。

### `ERR_CRYPTO_INVALID_CURVE` {#err_crypto_invalid_curve}

**追加: v15.0.0**

無効な楕円曲線が提供されました。

### `ERR_CRYPTO_INVALID_DIGEST` {#err_crypto_invalid_digest}

無効な[暗号ダイジェストアルゴリズム](/ja/nodejs/api/crypto#cryptogethashes)が指定されました。

### `ERR_CRYPTO_INVALID_IV` {#err_crypto_invalid_iv}

**追加: v15.0.0**

無効な初期化ベクトルが提供されました。

### `ERR_CRYPTO_INVALID_JWK` {#err_crypto_invalid_jwk}

**追加: v15.0.0**

無効な JSON Web Key が提供されました。

### `ERR_CRYPTO_INVALID_KEYLEN` {#err_crypto_invalid_keylen}

**追加: v15.0.0**

無効なキー長が提供されました。

### `ERR_CRYPTO_INVALID_KEYPAIR` {#err_crypto_invalid_keypair}

**追加: v15.0.0**

無効なキーペアが提供されました。

### `ERR_CRYPTO_INVALID_KEYTYPE` {#err_crypto_invalid_keytype}

**追加: v15.0.0**

無効なキータイプが提供されました。


### `ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE` {#err_crypto_invalid_key_object_type}

指定された暗号鍵オブジェクトの型が、試みられた操作に対して無効です。

### `ERR_CRYPTO_INVALID_MESSAGELEN` {#err_crypto_invalid_messagelen}

**Added in: v15.0.0**

無効なメッセージ長が提供されました。

### `ERR_CRYPTO_INVALID_SCRYPT_PARAMS` {#err_crypto_invalid_scrypt_params}

**Added in: v15.0.0**

[`crypto.scrypt()`](/ja/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) または [`crypto.scryptSync()`](/ja/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options) の1つ以上のパラメータが、法的範囲外です。

### `ERR_CRYPTO_INVALID_STATE` {#err_crypto_invalid_state}

暗号メソッドが無効な状態のオブジェクトで使用されました。 たとえば、`cipher.final()` を呼び出す前に [`cipher.getAuthTag()`](/ja/nodejs/api/crypto#ciphergetauthtag) を呼び出すなど。

### `ERR_CRYPTO_INVALID_TAG_LENGTH` {#err_crypto_invalid_tag_length}

**Added in: v15.0.0**

無効な認証タグ長が提供されました。

### `ERR_CRYPTO_JOB_INIT_FAILED` {#err_crypto_job_init_failed}

**Added in: v15.0.0**

非同期暗号操作の初期化に失敗しました。

### `ERR_CRYPTO_JWK_UNSUPPORTED_CURVE` {#err_crypto_jwk_unsupported_curve}

キーの楕円曲線は、[JSON Web Key Elliptic Curve Registry](https://www.iana.org/assignments/jose/jose.xhtml#web-key-elliptic-curve) での使用に登録されていません。

### `ERR_CRYPTO_JWK_UNSUPPORTED_KEY_TYPE` {#err_crypto_jwk_unsupported_key_type}

キーの非対称キータイプは、[JSON Web Key Types Registry](https://www.iana.org/assignments/jose/jose.xhtml#web-key-types) での使用に登録されていません。

### `ERR_CRYPTO_OPERATION_FAILED` {#err_crypto_operation_failed}

**Added in: v15.0.0**

暗号操作が、特に指定されていない理由で失敗しました。

### `ERR_CRYPTO_PBKDF2_ERROR` {#err_crypto_pbkdf2_error}

PBKDF2アルゴリズムが、特定の理由で失敗しました。 OpenSSLは詳細を提供していないため、Node.jsも提供していません。

### `ERR_CRYPTO_SCRYPT_NOT_SUPPORTED` {#err_crypto_scrypt_not_supported}

Node.jsは `scrypt` サポートなしでコンパイルされました。 公式リリースバイナリでは不可能ですが、ディストリビューションビルドを含むカスタムビルドで発生する可能性があります。

### `ERR_CRYPTO_SIGN_KEY_REQUIRED` {#err_crypto_sign_key_required}

署名 `key` が [`sign.sign()`](/ja/nodejs/api/crypto#signsignprivatekey-outputencoding) メソッドに提供されていませんでした。

### `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` {#err_crypto_timing_safe_equal_length}

[`crypto.timingSafeEqual()`](/ja/nodejs/api/crypto#cryptotimingsafeequala-b) が、長さの異なる `Buffer`、`TypedArray`、または `DataView` 引数で呼び出されました。


### `ERR_CRYPTO_UNKNOWN_CIPHER` {#err_crypto_unknown_cipher}

不明な暗号が指定されました。

### `ERR_CRYPTO_UNKNOWN_DH_GROUP` {#err_crypto_unknown_dh_group}

不明な Diffie-Hellman グループ名が指定されました。有効なグループ名の一覧については、[`crypto.getDiffieHellman()`](/ja/nodejs/api/crypto#cryptogetdiffiehellmangroupname) を参照してください。

### `ERR_CRYPTO_UNSUPPORTED_OPERATION` {#err_crypto_unsupported_operation}

**追加: v15.0.0, v14.18.0**

サポートされていない暗号操作を呼び出そうとしました。

### `ERR_DEBUGGER_ERROR` {#err_debugger_error}

**追加: v16.4.0, v14.17.4**

[デバッガー](/ja/nodejs/api/debugger) でエラーが発生しました。

### `ERR_DEBUGGER_STARTUP_ERROR` {#err_debugger_startup_error}

**追加: v16.4.0, v14.17.4**

[デバッガー](/ja/nodejs/api/debugger) は、必要なホスト/ポートが解放されるのを待機中にタイムアウトしました。

### `ERR_DIR_CLOSED` {#err_dir_closed}

[`fs.Dir`](/ja/nodejs/api/fs#class-fsdir) は以前に閉じられました。

### `ERR_DIR_CONCURRENT_OPERATION` {#err_dir_concurrent_operation}

**追加: v14.3.0**

非同期操作が進行中の [`fs.Dir`](/ja/nodejs/api/fs#class-fsdir) に対して、同期的な read または close の呼び出しが試行されました。

### `ERR_DLOPEN_DISABLED` {#err_dlopen_disabled}

**追加: v16.10.0, v14.19.0**

ネイティブアドオンの読み込みは、[`--no-addons`](/ja/nodejs/api/cli#--no-addons) を使用して無効になっています。

### `ERR_DLOPEN_FAILED` {#err_dlopen_failed}

**追加: v15.0.0**

`process.dlopen()` の呼び出しに失敗しました。

### `ERR_DNS_SET_SERVERS_FAILED` {#err_dns_set_servers_failed}

`c-ares` は DNS サーバーの設定に失敗しました。

### `ERR_DOMAIN_CALLBACK_NOT_AVAILABLE` {#err_domain_callback_not_available}

`node:domain` モジュールは、必要なエラー処理フックを確立できなかったため、使用できませんでした。これは、[`process.setUncaughtExceptionCaptureCallback()`](/ja/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) が以前に呼び出されていたためです。

### `ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE` {#err_domain_cannot_set_uncaught_exception_capture}

[`process.setUncaughtExceptionCaptureCallback()`](/ja/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) は、`node:domain` モジュールが以前にロードされていたため、呼び出すことができませんでした。

スタックトレースは、`node:domain` モジュールがロードされた時点を含むように拡張されます。

### `ERR_DUPLICATE_STARTUP_SNAPSHOT_MAIN_FUNCTION` {#err_duplicate_startup_snapshot_main_function}

[`v8.startupSnapshot.setDeserializeMainFunction()`](/ja/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) は、以前に呼び出されていたため、呼び出すことができませんでした。


### `ERR_ENCODING_INVALID_ENCODED_DATA` {#err_encoding_invalid_encoded_data}

`TextDecoder()` API に提供されたデータが、提供されたエンコーディングに従って無効でした。

### `ERR_ENCODING_NOT_SUPPORTED` {#err_encoding_not_supported}

`TextDecoder()` API に提供されたエンコーディングが、[WHATWG Supported Encodings](/ja/nodejs/api/util#whatwg-supported-encodings) のいずれでもありませんでした。

### `ERR_EVAL_ESM_CANNOT_PRINT` {#err_eval_esm_cannot_print}

`--print` は ESM 入力では使用できません。

### `ERR_EVENT_RECURSION` {#err_event_recursion}

`EventTarget` でイベントを再帰的にディスパッチしようとした場合にスローされます。

### `ERR_EXECUTION_ENVIRONMENT_NOT_AVAILABLE` {#err_execution_environment_not_available}

JS 実行コンテキストが Node.js 環境に関連付けられていません。これは、Node.js が埋め込みライブラリとして使用され、JS エンジンの一部のフックが正しく設定されていない場合に発生する可能性があります。

### `ERR_FALSY_VALUE_REJECTION` {#err_falsy_value_rejection}

`util.callbackify()` を介してコールバック化された `Promise` が、偽の値で拒否されました。

### `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` {#err_feature_unavailable_on_platform}

**Added in: v14.0.0**

Node.js を実行している現在のプラットフォームで使用できない機能が使用された場合に使用されます。

### `ERR_FS_CP_DIR_TO_NON_DIR` {#err_fs_cp_dir_to_non_dir}

**Added in: v16.7.0**

[`fs.cp()`](/ja/nodejs/api/fs#fscpsrc-dest-options-callback) を使用して、ディレクトリを非ディレクトリ (ファイル、シンボリックリンクなど) にコピーしようとしました。

### `ERR_FS_CP_EEXIST` {#err_fs_cp_eexist}

**Added in: v16.7.0**

`force` と `errorOnExist` が `true` に設定されている状態で、[`fs.cp()`](/ja/nodejs/api/fs#fscpsrc-dest-options-callback) を使用して、既に存在するファイルを上書きしようとしました。

### `ERR_FS_CP_EINVAL` {#err_fs_cp_einval}

**Added in: v16.7.0**

[`fs.cp()`](/ja/nodejs/api/fs#fscpsrc-dest-options-callback) を使用する際に、`src` または `dest` が無効なパスを指していました。

### `ERR_FS_CP_FIFO_PIPE` {#err_fs_cp_fifo_pipe}

**Added in: v16.7.0**

[`fs.cp()`](/ja/nodejs/api/fs#fscpsrc-dest-options-callback) を使用して、名前付きパイプをコピーしようとしました。

### `ERR_FS_CP_NON_DIR_TO_DIR` {#err_fs_cp_non_dir_to_dir}

**Added in: v16.7.0**

[`fs.cp()`](/ja/nodejs/api/fs#fscpsrc-dest-options-callback) を使用して、非ディレクトリ (ファイル、シンボリックリンクなど) をディレクトリにコピーしようとしました。

### `ERR_FS_CP_SOCKET` {#err_fs_cp_socket}

**Added in: v16.7.0**

[`fs.cp()`](/ja/nodejs/api/fs#fscpsrc-dest-options-callback) を使用して、ソケットにコピーしようとしました。


### `ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY` {#err_fs_cp_symlink_to_subdirectory}

**Added in: v16.7.0**

[`fs.cp()`](/ja/nodejs/api/fs#fscpsrc-dest-options-callback) を使用する際、`dest` 内のシンボリックリンクが `src` のサブディレクトリを指していました。

### `ERR_FS_CP_UNKNOWN` {#err_fs_cp_unknown}

**Added in: v16.7.0**

[`fs.cp()`](/ja/nodejs/api/fs#fscpsrc-dest-options-callback) で、不明なファイルタイプへのコピーが試みられました。

### `ERR_FS_EISDIR` {#err_fs_eisdir}

パスがディレクトリです。

### `ERR_FS_FILE_TOO_LARGE` {#err_fs_file_too_large}

ファイルのサイズが `Buffer` で許容される最大サイズよりも大きいため、読み込もうとしました。

### `ERR_HTTP2_ALTSVC_INVALID_ORIGIN` {#err_http2_altsvc_invalid_origin}

HTTP/2 ALTSVC フレームには有効なオリジンが必要です。

### `ERR_HTTP2_ALTSVC_LENGTH` {#err_http2_altsvc_length}

HTTP/2 ALTSVC フレームは、最大 16,382 バイトのペイロードに制限されています。

### `ERR_HTTP2_CONNECT_AUTHORITY` {#err_http2_connect_authority}

`CONNECT` メソッドを使用する HTTP/2 リクエストでは、`:authority` 疑似ヘッダーが必要です。

### `ERR_HTTP2_CONNECT_PATH` {#err_http2_connect_path}

`CONNECT` メソッドを使用する HTTP/2 リクエストでは、`:path` 疑似ヘッダーは禁止されています。

### `ERR_HTTP2_CONNECT_SCHEME` {#err_http2_connect_scheme}

`CONNECT` メソッドを使用する HTTP/2 リクエストでは、`:scheme` 疑似ヘッダーは禁止されています。

### `ERR_HTTP2_ERROR` {#err_http2_error}

特定できない HTTP/2 エラーが発生しました。

### `ERR_HTTP2_GOAWAY_SESSION` {#err_http2_goaway_session}

`Http2Session` が接続されたピアから `GOAWAY` フレームを受信した後、新しい HTTP/2 ストリームを開くことはできません。

### `ERR_HTTP2_HEADERS_AFTER_RESPOND` {#err_http2_headers_after_respond}

HTTP/2 レスポンスの開始後に、追加のヘッダーが指定されました。

### `ERR_HTTP2_HEADERS_SENT` {#err_http2_headers_sent}

複数のレスポンスヘッダーを送信しようとしました。

### `ERR_HTTP2_HEADER_SINGLE_VALUE` {#err_http2_header_single_value}

単一の値のみを持つ必要のある HTTP/2 ヘッダーフィールドに複数の値が指定されました。

### `ERR_HTTP2_INFO_STATUS_NOT_ALLOWED` {#err_http2_info_status_not_allowed}

情報 HTTP ステータスコード (`1xx`) は、HTTP/2 レスポンスのレスポンスステータスコードとして設定できません。

### `ERR_HTTP2_INVALID_CONNECTION_HEADERS` {#err_http2_invalid_connection_headers}

HTTP/1 の接続固有のヘッダーは、HTTP/2 のリクエストおよびレスポンスで使用することが禁止されています。

### `ERR_HTTP2_INVALID_HEADER_VALUE` {#err_http2_invalid_header_value}

無効な HTTP/2 ヘッダー値が指定されました。


### `ERR_HTTP2_INVALID_INFO_STATUS` {#err_http2_invalid_info_status}

無効な HTTP 情報ステータスコードが指定されました。情報ステータスコードは、`100` から `199` までの整数でなければなりません（両端を含む）。

### `ERR_HTTP2_INVALID_ORIGIN` {#err_http2_invalid_origin}

HTTP/2 `ORIGIN` フレームには、有効なオリジンが必要です。

### `ERR_HTTP2_INVALID_PACKED_SETTINGS_LENGTH` {#err_http2_invalid_packed_settings_length}

`http2.getUnpackedSettings()` API に渡される入力 `Buffer` および `Uint8Array` インスタンスの長さは、6 の倍数である必要があります。

### `ERR_HTTP2_INVALID_PSEUDOHEADER` {#err_http2_invalid_pseudoheader}

有効な HTTP/2 疑似ヘッダー (`:status`, `:path`, `:authority`, `:scheme`, および `:method`) のみを使用できます。

### `ERR_HTTP2_INVALID_SESSION` {#err_http2_invalid_session}

すでに破棄された `Http2Session` オブジェクトに対してアクションが実行されました。

### `ERR_HTTP2_INVALID_SETTING_VALUE` {#err_http2_invalid_setting_value}

HTTP/2 設定に無効な値が指定されました。

### `ERR_HTTP2_INVALID_STREAM` {#err_http2_invalid_stream}

すでに破棄されたストリームに対して操作が実行されました。

### `ERR_HTTP2_MAX_PENDING_SETTINGS_ACK` {#err_http2_max_pending_settings_ack}

HTTP/2 `SETTINGS` フレームが接続されたピアに送信されるたびに、ピアは新しい `SETTINGS` を受信して適用したことを確認する応答を送信する必要があります。デフォルトでは、未応答の `SETTINGS` フレームの最大数が一度に送信される可能性があります。このエラーコードは、その制限に達した場合に使用されます。

### `ERR_HTTP2_NESTED_PUSH` {#err_http2_nested_push}

プッシュストリーム内から新しいプッシュストリームを開始しようとしました。ネストされたプッシュストリームは許可されていません。

### `ERR_HTTP2_NO_MEM` {#err_http2_no_mem}

`http2session.setLocalWindowSize(windowSize)` API の使用中にメモリ不足になりました。

### `ERR_HTTP2_NO_SOCKET_MANIPULATION` {#err_http2_no_socket_manipulation}

`Http2Session` にアタッチされたソケットを直接操作しようとしました（読み取り、書き込み、一時停止、再開など）。

### `ERR_HTTP2_ORIGIN_LENGTH` {#err_http2_origin_length}

HTTP/2 `ORIGIN` フレームは、長さが 16382 バイトに制限されています。

### `ERR_HTTP2_OUT_OF_STREAMS` {#err_http2_out_of_streams}

単一の HTTP/2 セッションで作成されたストリームの数が最大制限に達しました。

### `ERR_HTTP2_PAYLOAD_FORBIDDEN` {#err_http2_payload_forbidden}

ペイロードが禁止されている HTTP 応答コードにメッセージペイロードが指定されました。


### `ERR_HTTP2_PING_CANCEL` {#err_http2_ping_cancel}

HTTP/2 ping がキャンセルされました。

### `ERR_HTTP2_PING_LENGTH` {#err_http2_ping_length}

HTTP/2 ping ペイロードの長さは正確に 8 バイトでなければなりません。

### `ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED` {#err_http2_pseudoheader_not_allowed}

HTTP/2 疑似ヘッダーが不適切に使用されました。疑似ヘッダーは、`:` プレフィックスで始まるヘッダーキー名です。

### `ERR_HTTP2_PUSH_DISABLED` {#err_http2_push_disabled}

クライアントによって無効にされたプッシュストリームを作成しようとしました。

### `ERR_HTTP2_SEND_FILE` {#err_http2_send_file}

`Http2Stream.prototype.responseWithFile()` API を使用してディレクトリを送信しようとしました。

### `ERR_HTTP2_SEND_FILE_NOSEEK` {#err_http2_send_file_noseek}

`Http2Stream.prototype.responseWithFile()` API を使用して、通常のファイル以外のものを送信しようとしましたが、`offset` または `length` オプションが指定されました。

### `ERR_HTTP2_SESSION_ERROR` {#err_http2_session_error}

`Http2Session` はゼロ以外のエラーコードで閉じられました。

### `ERR_HTTP2_SETTINGS_CANCEL` {#err_http2_settings_cancel}

`Http2Session` 設定がキャンセルされました。

### `ERR_HTTP2_SOCKET_BOUND` {#err_http2_socket_bound}

すでに別の `Http2Session` オブジェクトにバインドされている `net.Socket` または `tls.TLSSocket` に `Http2Session` オブジェクトを接続しようとしました。

### `ERR_HTTP2_SOCKET_UNBOUND` {#err_http2_socket_unbound}

すでに閉じられている `Http2Session` の `socket` プロパティを使用しようとしました。

### `ERR_HTTP2_STATUS_101` {#err_http2_status_101}

HTTP/2 では、`101` 情報ステータスコードの使用は禁止されています。

### `ERR_HTTP2_STATUS_INVALID` {#err_http2_status_invalid}

無効な HTTP ステータスコードが指定されました。ステータスコードは、`100` から `599` (両端を含む) までの整数でなければなりません。

### `ERR_HTTP2_STREAM_CANCEL` {#err_http2_stream_cancel}

`Http2Stream` は、接続されたピアにデータが送信される前に破棄されました。

### `ERR_HTTP2_STREAM_ERROR` {#err_http2_stream_error}

ゼロ以外のエラーコードが `RST_STREAM` フレームで指定されました。

### `ERR_HTTP2_STREAM_SELF_DEPENDENCY` {#err_http2_stream_self_dependency}

HTTP/2 ストリームの優先度を設定するときに、ストリームを親ストリームの依存関係としてマークできます。このエラーコードは、ストリームをそれ自体の依存関係としてマークしようとした場合に使用されます。

### `ERR_HTTP2_TOO_MANY_CUSTOM_SETTINGS` {#err_http2_too_many_custom_settings}

サポートされているカスタム設定の数 (10) を超えました。


### `ERR_HTTP2_TOO_MANY_INVALID_FRAMES` {#err_http2_too_many_invalid_frames}

**Added in: v15.14.0**

`maxSessionInvalidFrames` オプションで指定された、ピアから送信された許容可能な無効な HTTP/2 プロトコルフレームの制限を超えました。

### `ERR_HTTP2_TRAILERS_ALREADY_SENT` {#err_http2_trailers_already_sent}

トレーリングヘッダーはすでに `Http2Stream` で送信されています。

### `ERR_HTTP2_TRAILERS_NOT_READY` {#err_http2_trailers_not_ready}

`http2stream.sendTrailers()` メソッドは、`Http2Stream` オブジェクトで `'wantTrailers'` イベントが発生するまで呼び出すことはできません。 `'wantTrailers'` イベントは、`Http2Stream` に対して `waitForTrailers` オプションが設定されている場合にのみ発生します。

### `ERR_HTTP2_UNSUPPORTED_PROTOCOL` {#err_http2_unsupported_protocol}

`http2.connect()` に、`http:` または `https:` 以外のプロトコルを使用する URL が渡されました。

### `ERR_HTTP_BODY_NOT_ALLOWED` {#err_http_body_not_allowed}

コンテンツを許可しない HTTP レスポンスに書き込もうとしたときにエラーがスローされます。

### `ERR_HTTP_CONTENT_LENGTH_MISMATCH` {#err_http_content_length_mismatch}

レスポンスボディのサイズが、指定された content-length ヘッダーの値と一致しません。

### `ERR_HTTP_HEADERS_SENT` {#err_http_headers_sent}

ヘッダーがすでに送信された後に、さらにヘッダーを追加しようとしました。

### `ERR_HTTP_INVALID_HEADER_VALUE` {#err_http_invalid_header_value}

無効な HTTP ヘッダー値が指定されました。

### `ERR_HTTP_INVALID_STATUS_CODE` {#err_http_invalid_status_code}

ステータスコードが通常のステータスコード範囲 (100-999) を超えています。

### `ERR_HTTP_REQUEST_TIMEOUT` {#err_http_request_timeout}

クライアントが、許可された時間内にリクエスト全体を送信しませんでした。

### `ERR_HTTP_SOCKET_ASSIGNED` {#err_http_socket_assigned}

指定された [`ServerResponse`](/ja/nodejs/api/http#class-httpserverresponse) には、すでにソケットが割り当てられています。

### `ERR_HTTP_SOCKET_ENCODING` {#err_http_socket_encoding}

[RFC 7230 Section 3](https://tools.ietf.org/html/rfc7230#section-3) に基づき、ソケットエンコーディングの変更は許可されていません。

### `ERR_HTTP_TRAILER_INVALID` {#err_http_trailer_invalid}

転送エンコーディングがそれをサポートしていないにもかかわらず、`Trailer` ヘッダーが設定されました。

### `ERR_ILLEGAL_CONSTRUCTOR` {#err_illegal_constructor}

非公開コンストラクターを使用してオブジェクトを構築しようとしました。

### `ERR_IMPORT_ATTRIBUTE_MISSING` {#err_import_attribute_missing}

**Added in: v21.1.0**

インポート属性が欠落しているため、指定されたモジュールをインポートできません。


### `ERR_IMPORT_ATTRIBUTE_TYPE_INCOMPATIBLE` {#err_import_attribute_type_incompatible}

**Added in: v21.1.0**

インポートの `type` 属性が指定されましたが、指定されたモジュールのタイプが異なっています。

### `ERR_IMPORT_ATTRIBUTE_UNSUPPORTED` {#err_import_attribute_unsupported}

**Added in: v21.0.0, v20.10.0, v18.19.0**

インポート属性は、このバージョンの Node.js ではサポートされていません。

### `ERR_INCOMPATIBLE_OPTION_PAIR` {#err_incompatible_option_pair}

オプションの組み合わせに互換性がなく、同時に使用できません。

### `ERR_INPUT_TYPE_NOT_ALLOWED` {#err_input_type_not_allowed}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

`--input-type` フラグがファイルをを実行するために使用されました。このフラグは `--eval`、`--print`、または `STDIN` を介した入力でのみ使用できます。

### `ERR_INSPECTOR_ALREADY_ACTIVATED` {#err_inspector_already_activated}

`node:inspector` モジュールを使用しているときに、インスペクターがポートで既にリッスンを開始しているときにアクティブ化しようとしました。別のアドレスでアクティブ化する前に、`inspector.close()` を使用してください。

### `ERR_INSPECTOR_ALREADY_CONNECTED` {#err_inspector_already_connected}

`node:inspector` モジュールを使用しているときに、インスペクターが既に接続されているときに接続しようとしました。

### `ERR_INSPECTOR_CLOSED` {#err_inspector_closed}

`node:inspector` モジュールを使用しているときに、セッションが既に閉じられた後にインスペクターを使用しようとしました。

### `ERR_INSPECTOR_COMMAND` {#err_inspector_command}

`node:inspector` モジュールを介してコマンドを発行中にエラーが発生しました。

### `ERR_INSPECTOR_NOT_ACTIVE` {#err_inspector_not_active}

`inspector.waitForDebugger()` が呼び出されたときに、`inspector` がアクティブではありません。

### `ERR_INSPECTOR_NOT_AVAILABLE` {#err_inspector_not_available}

`node:inspector` モジュールは使用できません。

### `ERR_INSPECTOR_NOT_CONNECTED` {#err_inspector_not_connected}

`node:inspector` モジュールを使用しているときに、接続される前にインスペクターを使用しようとしました。

### `ERR_INSPECTOR_NOT_WORKER` {#err_inspector_not_worker}

ワーカー スレッドからのみ使用できる API が、メイン スレッドで呼び出されました。

### `ERR_INTERNAL_ASSERTION` {#err_internal_assertion}

Node.js にバグがあるか、Node.js の内部構造の誤った使用方法がありました。エラーを修正するには、[https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues) で問題を報告してください。


### `ERR_INVALID_ADDRESS` {#err_invalid_address}

指定されたアドレスは、Node.js API によって理解されません。

### `ERR_INVALID_ADDRESS_FAMILY` {#err_invalid_address_family}

指定されたアドレスファミリは、Node.js API によって理解されません。

### `ERR_INVALID_ARG_TYPE` {#err_invalid_arg_type}

誤った型の引数が Node.js API に渡されました。

### `ERR_INVALID_ARG_VALUE` {#err_invalid_arg_value}

無効またはサポートされていない値が、指定された引数に渡されました。

### `ERR_INVALID_ASYNC_ID` {#err_invalid_async_id}

無効な `asyncId` または `triggerAsyncId` が `AsyncHooks` を使用して渡されました。 -1 未満の ID が発生することはありません。

### `ERR_INVALID_BUFFER_SIZE` {#err_invalid_buffer_size}

`Buffer` に対してスワップが実行されましたが、そのサイズは操作と互換性がありませんでした。

### `ERR_INVALID_CHAR` {#err_invalid_char}

ヘッダーで無効な文字が検出されました。

### `ERR_INVALID_CURSOR_POS` {#err_invalid_cursor_pos}

指定されたストリーム上のカーソルは、指定された列なしに、指定された行に移動できません。

### `ERR_INVALID_FD` {#err_invalid_fd}

ファイル記述子 ('fd') が無効でした (たとえば、負の値でした)。

### `ERR_INVALID_FD_TYPE` {#err_invalid_fd_type}

ファイル記述子 ('fd') の型が無効でした。

### `ERR_INVALID_FILE_URL_HOST` {#err_invalid_file_url_host}

`file:` URL を消費する Node.js API (たとえば、[`fs`](/ja/nodejs/api/fs) モジュールの特定の関数) が、互換性のないホストを持つファイル URL を検出しました。 この状況は、`localhost` または空のホストのみがサポートされている Unix 系システムでのみ発生する可能性があります。

### `ERR_INVALID_FILE_URL_PATH` {#err_invalid_file_url_path}

`file:` URL を消費する Node.js API (たとえば、[`fs`](/ja/nodejs/api/fs) モジュールの特定の関数) が、互換性のないパスを持つファイル URL を検出しました。 パスを使用できるかどうかを判断するための正確なセマンティクスは、プラットフォームに依存します。

### `ERR_INVALID_HANDLE_TYPE` {#err_invalid_handle_type}

サポートされていない「ハンドル」を、IPC 通信チャネル経由で子プロセスに送信しようとしました。 詳細については、[`subprocess.send()`](/ja/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) および [`process.send()`](/ja/nodejs/api/process#processsendmessage-sendhandle-options-callback) を参照してください。

### `ERR_INVALID_HTTP_TOKEN` {#err_invalid_http_token}

無効な HTTP トークンが提供されました。

### `ERR_INVALID_IP_ADDRESS` {#err_invalid_ip_address}

IP アドレスが無効です。


### `ERR_INVALID_MIME_SYNTAX` {#err_invalid_mime_syntax}

MIME の構文が無効です。

### `ERR_INVALID_MODULE` {#err_invalid_module}

**追加: v15.0.0, v14.18.0**

存在しないか、他の点で無効なモジュールをロードしようとしました。

### `ERR_INVALID_MODULE_SPECIFIER` {#err_invalid_module_specifier}

インポートされたモジュール文字列が無効な URL、パッケージ名、またはパッケージのサブパス指定子です。

### `ERR_INVALID_OBJECT_DEFINE_PROPERTY` {#err_invalid_object_define_property}

オブジェクトのプロパティに無効な属性を設定中にエラーが発生しました。

### `ERR_INVALID_PACKAGE_CONFIG` {#err_invalid_package_config}

無効な [`package.json`](/ja/nodejs/api/packages#nodejs-packagejson-field-definitions) ファイルの解析に失敗しました。

### `ERR_INVALID_PACKAGE_TARGET` {#err_invalid_package_target}

`package.json` の [`"exports"`](/ja/nodejs/api/packages#exports) フィールドに、試行されたモジュール解決に対して無効なターゲットマッピング値が含まれています。

### `ERR_INVALID_PROTOCOL` {#err_invalid_protocol}

無効な `options.protocol` が `http.request()` に渡されました。

### `ERR_INVALID_REPL_EVAL_CONFIG` {#err_invalid_repl_eval_config}

[`REPL`](/ja/nodejs/api/repl) 構成で `breakEvalOnSigint` オプションと `eval` オプションの両方が設定されていますが、これはサポートされていません。

### `ERR_INVALID_REPL_INPUT` {#err_invalid_repl_input}

入力は [`REPL`](/ja/nodejs/api/repl) で使用できません。 このエラーが使用される条件は、[`REPL`](/ja/nodejs/api/repl) ドキュメントに記載されています。

### `ERR_INVALID_RETURN_PROPERTY` {#err_invalid_return_property}

関数オプションが、実行時に返されるオブジェクトのプロパティのいずれかに有効な値を提供しない場合にスローされます。

### `ERR_INVALID_RETURN_PROPERTY_VALUE` {#err_invalid_return_property_value}

関数オプションが、実行時に返されるオブジェクトのプロパティのいずれかに予期される値の型を提供しない場合にスローされます。

### `ERR_INVALID_RETURN_VALUE` {#err_invalid_return_value}

関数オプションが、関数が promise を返すことが期待される場合など、実行時に予期される値の型を返さない場合にスローされます。

### `ERR_INVALID_STATE` {#err_invalid_state}

**追加: v15.0.0**

無効な状態のために操作を完了できないことを示します。 たとえば、オブジェクトがすでに破棄されているか、別の操作を実行している可能性があります。

### `ERR_INVALID_SYNC_FORK_INPUT` {#err_invalid_sync_fork_input}

`Buffer`、`TypedArray`、`DataView`、または `string` が、非同期フォークへの stdio 入力として提供されました。 詳細については、[`child_process`](/ja/nodejs/api/child_process) モジュールのドキュメントを参照してください。


### `ERR_INVALID_THIS` {#err_invalid_this}

Node.js API 関数が、互換性のない `this` 値で呼び出されました。

```js [ESM]
const urlSearchParams = new URLSearchParams('foo=bar&baz=new');

const buf = Buffer.alloc(1);
urlSearchParams.has.call(buf, 'foo');
// 'ERR_INVALID_THIS' コードで TypeError をスローします。
```
### `ERR_INVALID_TUPLE` {#err_invalid_tuple}

[WHATWG](/ja/nodejs/api/url#the-whatwg-url-api) の [`URLSearchParams` コンストラクタ](/ja/nodejs/api/url#new-urlsearchparamsiterable) に提供された `iterable` 内の要素が `[name, value]` タプルを表していません。つまり、要素が iterable でないか、または正確に 2 つの要素で構成されていません。

### `ERR_INVALID_TYPESCRIPT_SYNTAX` {#err_invalid_typescript_syntax}

**Added in: v23.0.0**

提供された TypeScript 構文が無効であるか、サポートされていません。 これは、[型除去](/ja/nodejs/api/typescript#type-stripping)による変換を必要とする TypeScript 構文を使用する場合に発生する可能性があります。

### `ERR_INVALID_URI` {#err_invalid_uri}

無効な URI が渡されました。

### `ERR_INVALID_URL` {#err_invalid_url}

無効な URL が [WHATWG](/ja/nodejs/api/url#the-whatwg-url-api) の [`URL` コンストラクタ](/ja/nodejs/api/url#new-urlinput-base) またはレガシーな [`url.parse()`](/ja/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) に渡され、パースされようとしました。 スローされたエラーオブジェクトは通常、パースに失敗した URL を含む追加のプロパティ `'input'` を持っています。

### `ERR_INVALID_URL_SCHEME` {#err_invalid_url_scheme}

特定の目的のために、互換性のないスキーム（プロトコル）の URL を使用しようとしました。 これは、[`fs`](/ja/nodejs/api/fs) モジュール（`'file'` スキームの URL のみを受け入れます）の [WHATWG URL API](/ja/nodejs/api/url#the-whatwg-url-api) サポートでのみ使用されますが、将来的には他の Node.js API でも使用される可能性があります。

### `ERR_IPC_CHANNEL_CLOSED` {#err_ipc_channel_closed}

すでに閉じられている IPC 通信チャネルを使用しようとしました。

### `ERR_IPC_DISCONNECTED` {#err_ipc_disconnected}

すでに切断されている IPC 通信チャネルを切断しようとしました。 詳しくは、[`child_process`](/ja/nodejs/api/child_process) モジュールのドキュメントをご覧ください。

### `ERR_IPC_ONE_PIPE` {#err_ipc_one_pipe}

複数の IPC 通信チャネルを使用して子 Node.js プロセスを作成しようとしました。 詳しくは、[`child_process`](/ja/nodejs/api/child_process) モジュールのドキュメントをご覧ください。


### `ERR_IPC_SYNC_FORK` {#err_ipc_sync_fork}

同期的にフォークされたNode.jsプロセスとの間でIPC通信チャネルを開こうとしました。詳細については、[`child_process`](/ja/nodejs/api/child_process)モジュールのドキュメントを参照してください。

### `ERR_IP_BLOCKED` {#err_ip_blocked}

IPは`net.BlockList`によってブロックされています。

### `ERR_LOADER_CHAIN_INCOMPLETE` {#err_loader_chain_incomplete}

**Added in: v18.6.0, v16.17.0**

ESMローダーフックが`next()`を呼び出さずに、また明示的にショートサーキットを通知せずに戻りました。

### `ERR_LOAD_SQLITE_EXTENSION` {#err_load_sqlite_extension}

**Added in: v23.5.0**

SQLite拡張機能のロード中にエラーが発生しました。

### `ERR_MEMORY_ALLOCATION_FAILED` {#err_memory_allocation_failed}

メモリを割り当てようとしましたが（通常はC++レイヤーで）、失敗しました。

### `ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE` {#err_message_target_context_unavailable}

**Added in: v14.5.0, v12.19.0**

[`MessagePort`](/ja/nodejs/api/worker_threads#class-messageport)に投稿されたメッセージを、ターゲット[vm](/ja/nodejs/api/vm)`Context`でデシリアライズできませんでした。現時点では、すべてのNode.jsオブジェクトを任意のコンテキストで正常にインスタンス化できるわけではなく、`postMessage()`を使用して転送しようとすると、受信側で失敗する可能性があります。

### `ERR_METHOD_NOT_IMPLEMENTED` {#err_method_not_implemented}

メソッドが必要ですが、実装されていません。

### `ERR_MISSING_ARGS` {#err_missing_args}

Node.js APIの必須引数が渡されませんでした。これは、API仕様への厳密な準拠のためにのみ使用されます（場合によっては`func(undefined)`は受け入れますが、`func()`は受け入れない場合があります）。ほとんどのネイティブNode.js APIでは、`func(undefined)`と`func()`は同じように扱われ、代わりに[`ERR_INVALID_ARG_TYPE`](/ja/nodejs/api/errors#err-invalid-arg-type)エラーコードが使用される場合があります。

### `ERR_MISSING_OPTION` {#err_missing_option}

オプションオブジェクトを受け入れるAPIの場合、いくつかのオプションは必須である可能性があります。必須オプションがない場合、このコードがスローされます。

### `ERR_MISSING_PASSPHRASE` {#err_missing_passphrase}

パスフレーズを指定せずに暗号化されたキーを読み取ろうとしました。

### `ERR_MISSING_PLATFORM_FOR_WORKER` {#err_missing_platform_for_worker}

このNode.jsインスタンスで使用されているV8プラットフォームは、Workerの作成をサポートしていません。これは、Workerに対する埋め込み側のサポートが不足していることが原因です。特に、このエラーはNode.jsの標準ビルドでは発生しません。


### `ERR_MODULE_NOT_FOUND` {#err_module_not_found}

`import` 操作の試行時またはプログラムのエントリポイントのロード時に、ECMAScript モジュールローダーがモジュールファイルを解決できませんでした。

### `ERR_MULTIPLE_CALLBACK` {#err_multiple_callback}

コールバックが複数回呼び出されました。

コールバックは、クエリが満たされるか拒否されるかのいずれかであり、同時に両方ではないため、ほぼ常に一度だけ呼び出されることを意図しています。後者は、コールバックを複数回呼び出すことによって可能になります。

### `ERR_NAPI_CONS_FUNCTION` {#err_napi_cons_function}

`Node-API` を使用中に、渡されたコンストラクターが関数ではありませんでした。

### `ERR_NAPI_INVALID_DATAVIEW_ARGS` {#err_napi_invalid_dataview_args}

`napi_create_dataview()` の呼び出し中に、指定された `offset` がデータビューの範囲外にあるか、`offset + length` が指定された `buffer` の長さよりも大きくなっています。

### `ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT` {#err_napi_invalid_typedarray_alignment}

`napi_create_typedarray()` の呼び出し中に、指定された `offset` が要素サイズの倍数ではありませんでした。

### `ERR_NAPI_INVALID_TYPEDARRAY_LENGTH` {#err_napi_invalid_typedarray_length}

`napi_create_typedarray()` の呼び出し中に、`(length * size_of_element) + byte_offset` が指定された `buffer` の長さよりも大きくなっています。

### `ERR_NAPI_TSFN_CALL_JS` {#err_napi_tsfn_call_js}

スレッドセーフ関数の JavaScript 部分を呼び出すときにエラーが発生しました。

### `ERR_NAPI_TSFN_GET_UNDEFINED` {#err_napi_tsfn_get_undefined}

JavaScript の `undefined` 値を取得しようとしたときにエラーが発生しました。

### `ERR_NON_CONTEXT_AWARE_DISABLED` {#err_non_context_aware_disabled}

非コンテキスト対応のネイティブアドオンが、それを許可しないプロセスでロードされました。

### `ERR_NOT_BUILDING_SNAPSHOT` {#err_not_building_snapshot}

Node.js が V8 スタートアップスナップショットを作成していないにもかかわらず、スナップショットの作成時にのみ使用できる操作を使用しようとしました。

### `ERR_NOT_IN_SINGLE_EXECUTABLE_APPLICATION` {#err_not_in_single_executable_application}

**追加:** v21.7.0, v20.12.0

シングル実行可能アプリケーション内ではない場合、操作は実行できません。

### `ERR_NOT_SUPPORTED_IN_SNAPSHOT` {#err_not_supported_in_snapshot}

スタートアップスナップショットの作成時にサポートされていない操作を実行しようとしました。

### `ERR_NO_CRYPTO` {#err_no_crypto}

Node.js が OpenSSL 暗号化サポートなしでコンパイルされているときに、暗号化機能を使用しようとしました。


### `ERR_NO_ICU` {#err_no_icu}

[ICU](/ja/nodejs/api/intl#internationalization-support) を必要とする機能を使用しようとしましたが、Node.js は ICU サポート付きでコンパイルされていません。

### `ERR_NO_TYPESCRIPT` {#err_no_typescript}

**追加:** v23.0.0

[ネイティブ TypeScript サポート](/ja/nodejs/api/typescript#type-stripping) を必要とする機能を使用しようとしましたが、Node.js は TypeScript サポート付きでコンパイルされていません。

### `ERR_OPERATION_FAILED` {#err_operation_failed}

**追加:** v15.0.0

操作が失敗しました。 これは通常、非同期操作の一般的な失敗を示すために使用されます。

### `ERR_OUT_OF_RANGE` {#err_out_of_range}

指定された値が許容範囲外です。

### `ERR_PACKAGE_IMPORT_NOT_DEFINED` {#err_package_import_not_defined}

`package.json` の [`"imports"`](/ja/nodejs/api/packages#imports) フィールドに、指定された内部パッケージ指定子のマッピングが定義されていません。

### `ERR_PACKAGE_PATH_NOT_EXPORTED` {#err_package_path_not_exported}

`package.json` の [`"exports"`](/ja/nodejs/api/packages#exports) フィールドが、要求されたサブパスをエクスポートしていません。 エクスポートはカプセル化されているため、エクスポートされていないプライベート内部モジュールは、絶対 URL を使用しない限り、パッケージ解決を介してインポートできません。

### `ERR_PARSE_ARGS_INVALID_OPTION_VALUE` {#err_parse_args_invalid_option_value}

**追加:** v18.3.0, v16.17.0

`strict` が `true` に設定されている場合、[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 型のオプションに[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 値が指定された場合、または[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 型のオプションに[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 値が指定された場合に、[`util.parseArgs()`](/ja/nodejs/api/util#utilparseargsconfig) によってスローされます。

### `ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL` {#err_parse_args_unexpected_positional}

**追加:** v18.3.0, v16.17.0

位置引数が指定され、`allowPositionals` が `false` に設定されている場合に、[`util.parseArgs()`](/ja/nodejs/api/util#utilparseargsconfig) によってスローされます。

### `ERR_PARSE_ARGS_UNKNOWN_OPTION` {#err_parse_args_unknown_option}

**追加:** v18.3.0, v16.17.0

`strict` が `true` に設定されている場合、引数が `options` で構成されていない場合に、[`util.parseArgs()`](/ja/nodejs/api/util#utilparseargsconfig) によってスローされます。


### `ERR_PERFORMANCE_INVALID_TIMESTAMP` {#err_performance_invalid_timestamp}

パフォーマンスマークまたはメジャーに無効なタイムスタンプ値が指定されました。

### `ERR_PERFORMANCE_MEASURE_INVALID_OPTIONS` {#err_performance_measure_invalid_options}

パフォーマンスメジャーに無効なオプションが指定されました。

### `ERR_PROTO_ACCESS` {#err_proto_access}

`Object.prototype.__proto__`へのアクセスは、[`--disable-proto=throw`](/ja/nodejs/api/cli#--disable-protomode)を使用して禁止されています。 オブジェクトのプロトタイプを取得および設定するには、[`Object.getPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) および [`Object.setPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) を使用する必要があります。

### `ERR_QUIC_APPLICATION_ERROR` {#err_quic_application_error}

**追加: v23.4.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

QUIC アプリケーションエラーが発生しました。

### `ERR_QUIC_CONNECTION_FAILED` {#err_quic_connection_failed}

**追加: v23.0.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

QUIC 接続の確立に失敗しました。

### `ERR_QUIC_ENDPOINT_CLOSED` {#err_quic_endpoint_closed}

**追加: v23.0.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

QUIC エンドポイントがエラーで閉じられました。

### `ERR_QUIC_OPEN_STREAM_FAILED` {#err_quic_open_stream_failed}

**追加: v23.0.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

QUIC ストリームのオープンに失敗しました。

### `ERR_QUIC_TRANSPORT_ERROR` {#err_quic_transport_error}

**追加: v23.4.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

QUIC トランスポートエラーが発生しました。

### `ERR_QUIC_VERSION_NEGOTIATION_ERROR` {#err_quic_version_negotiation_error}

**追加: v23.4.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

バージョンネゴシエーションが必要なため、QUIC セッションが失敗しました。


### `ERR_REQUIRE_ASYNC_MODULE` {#err_require_async_module}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

[ES Module](/ja/nodejs/api/esm) を `require()` しようとしたところ、モジュールが非同期であることが判明しました。つまり、トップレベルの await が含まれています。

トップレベルの await がどこにあるかを確認するには、`--experimental-print-required-tla` を使用します (これにより、トップレベルの await を探す前にモジュールが実行されます)。

### `ERR_REQUIRE_CYCLE_MODULE` {#err_require_cycle_module}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

[ES Module](/ja/nodejs/api/esm) を `require()` しようとしたとき、CommonJS から ESM へ、または ESM から CommonJS へのエッジが即時のサイクルに参加しています。ES Module は評価中に評価できないため、これは許可されていません。

サイクルを回避するには、サイクルに関与する `require()` 呼び出しが、ES Module ( `createRequire()` 経由) または CommonJS モジュールのトップレベルで発生するべきではなく、内部関数で遅延的に行う必要があります。

### `ERR_REQUIRE_ESM` {#err_require_esm}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | require() が既定で同期 ES モジュールのロードをサポートするようになりました。 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨
:::

[ES Module](/ja/nodejs/api/esm) を `require()` しようとしました。

このエラーは、`require()` が同期 ES モジュールのロードをサポートするようになったため、非推奨になりました。`require()` がトップレベルの `await` を含む ES モジュールを検出すると、代わりに [`ERR_REQUIRE_ASYNC_MODULE`](/ja/nodejs/api/errors#err_require_async_module) をスローします。

### `ERR_SCRIPT_EXECUTION_INTERRUPTED` {#err_script_execution_interrupted}

スクリプトの実行が `SIGINT` によって中断されました (たとえば、+ が押されました)。

### `ERR_SCRIPT_EXECUTION_TIMEOUT` {#err_script_execution_timeout}

スクリプトの実行がタイムアウトしました。実行中のスクリプトにバグがある可能性があります。

### `ERR_SERVER_ALREADY_LISTEN` {#err_server_already_listen}

`net.Server` がすでに listen している状態で、[`server.listen()`](/ja/nodejs/api/net#serverlisten) メソッドが呼び出されました。これは、HTTP、HTTPS、および HTTP/2 `Server` インスタンスを含む、`net.Server` のすべてのインスタンスに適用されます。


### `ERR_SERVER_NOT_RUNNING` {#err_server_not_running}

[`server.close()`](/ja/nodejs/api/net#serverclosecallback) メソッドが、`net.Server` が実行されていないときに呼び出されました。これは、HTTP、HTTPS、HTTP/2 `Server` インスタンスを含む、`net.Server` のすべてのインスタンスに適用されます。

### `ERR_SINGLE_EXECUTABLE_APPLICATION_ASSET_NOT_FOUND` {#err_single_executable_application_asset_not_found}

**Added in: v21.7.0, v20.12.0**

アセットを識別するために、シングル実行可能アプリケーション API にキーが渡されましたが、一致するものが見つかりませんでした。

### `ERR_SOCKET_ALREADY_BOUND` {#err_socket_already_bound}

既にバインドされているソケットをバインドしようとしました。

### `ERR_SOCKET_BAD_BUFFER_SIZE` {#err_socket_bad_buffer_size}

[`dgram.createSocket()`](/ja/nodejs/api/dgram#dgramcreatesocketoptions-callback) の `recvBufferSize` または `sendBufferSize` オプションに無効な (負の) サイズが渡されました。

### `ERR_SOCKET_BAD_PORT` {#err_socket_bad_port}

\>= 0 かつ \< 65536 のポートを期待する API 関数が無効な値を受け取りました。

### `ERR_SOCKET_BAD_TYPE` {#err_socket_bad_type}

ソケットタイプ (`udp4` または `udp6`) を期待する API 関数が無効な値を受け取りました。

### `ERR_SOCKET_BUFFER_SIZE` {#err_socket_buffer_size}

[`dgram.createSocket()`](/ja/nodejs/api/dgram#dgramcreatesocketoptions-callback) の使用中に、受信または送信 `Buffer` のサイズを特定できませんでした。

### `ERR_SOCKET_CLOSED` {#err_socket_closed}

既に閉じられたソケットを操作しようとしました。

### `ERR_SOCKET_CLOSED_BEFORE_CONNECTION` {#err_socket_closed_before_connection}

接続中のソケットで [`net.Socket.write()`](/ja/nodejs/api/net#socketwritedata-encoding-callback) を呼び出した際に、接続が確立される前にソケットが閉じられました。

### `ERR_SOCKET_CONNECTION_TIMEOUT` {#err_socket_connection_timeout}

ファミリー自動選択アルゴリズムを使用している場合、ソケットは許可されたタイムアウト内に DNS から返されたどのアドレスにも接続できませんでした。

### `ERR_SOCKET_DGRAM_IS_CONNECTED` {#err_socket_dgram_is_connected}

既に接続されているソケットで [`dgram.connect()`](/ja/nodejs/api/dgram#socketconnectport-address-callback) 呼び出しが行われました。

### `ERR_SOCKET_DGRAM_NOT_CONNECTED` {#err_socket_dgram_not_connected}

切断されたソケットで [`dgram.disconnect()`](/ja/nodejs/api/dgram#socketdisconnect) または [`dgram.remoteAddress()`](/ja/nodejs/api/dgram#socketremoteaddress) 呼び出しが行われました。

### `ERR_SOCKET_DGRAM_NOT_RUNNING` {#err_socket_dgram_not_running}

呼び出しが行われましたが、UDP サブシステムが実行されていませんでした。


### `ERR_SOURCE_MAP_CORRUPT` {#err_source_map_corrupt}

ソースマップが存在しないか破損しているため、解析できませんでした。

### `ERR_SOURCE_MAP_MISSING_SOURCE` {#err_source_map_missing_source}

ソースマップからインポートされたファイルが見つかりませんでした。

### `ERR_SQLITE_ERROR` {#err_sqlite_error}

**Added in: v22.5.0**

[SQLite](/ja/nodejs/api/sqlite) からエラーが返されました。

### `ERR_SRI_PARSE` {#err_sri_parse}

Subresource Integrity チェックのために文字列が提供されましたが、解析できませんでした。[Subresource Integrity 仕様](https://www.w3.org/TR/SRI/#the-integrity-attribute) を参照して、integrity 属性の形式を確認してください。

### `ERR_STREAM_ALREADY_FINISHED` {#err_stream_already_finished}

ストリームが終了したため、完了できないストリームメソッドが呼び出されました。

### `ERR_STREAM_CANNOT_PIPE` {#err_stream_cannot_pipe}

[`Writable`](/ja/nodejs/api/stream#class-streamwritable) ストリームで [`stream.pipe()`](/ja/nodejs/api/stream#readablepipedestination-options) を呼び出そうとしました。

### `ERR_STREAM_DESTROYED` {#err_stream_destroyed}

`stream.destroy()` を使用してストリームが破棄されたため、完了できないストリームメソッドが呼び出されました。

### `ERR_STREAM_NULL_VALUES` {#err_stream_null_values}

`null` チャンクで [`stream.write()`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback) を呼び出そうとしました。

### `ERR_STREAM_PREMATURE_CLOSE` {#err_stream_premature_close}

ストリームまたはパイプラインが明示的なエラーなしに正常に終了しない場合に、`stream.finished()` および `stream.pipeline()` によって返されるエラー。

### `ERR_STREAM_PUSH_AFTER_EOF` {#err_stream_push_after_eof}

ストリームに `null`(EOF) がプッシュされた後で、[`stream.push()`](/ja/nodejs/api/stream#readablepushchunk-encoding) を呼び出そうとしました。

### `ERR_STREAM_UNABLE_TO_PIPE` {#err_stream_unable_to_pipe}

パイプラインで閉じられたストリームまたは破棄されたストリームにパイプしようとしました。

### `ERR_STREAM_UNSHIFT_AFTER_END_EVENT` {#err_stream_unshift_after_end_event}

`'end'` イベントが発行された後で、[`stream.unshift()`](/ja/nodejs/api/stream#readableunshiftchunk-encoding) を呼び出そうとしました。

### `ERR_STREAM_WRAP` {#err_stream_wrap}

Socket に文字列デコーダーが設定されている場合、またはデコーダーが `objectMode` である場合に、アボートを防ぎます。

```js [ESM]
const Socket = require('node:net').Socket;
const instance = new Socket();

instance.setEncoding('utf8');
```

### `ERR_STREAM_WRITE_AFTER_END` {#err_stream_write_after_end}

`stream.end()` が呼び出された後で、[`stream.write()`](/ja/nodejs/api/stream#writablewritechunk-encoding-callback) を呼び出そうとしました。

### `ERR_STRING_TOO_LONG` {#err_string_too_long}

許可されている最大長を超える文字列を作成しようとしました。

### `ERR_SYNTHETIC` {#err_synthetic}

診断レポートの呼び出しスタックをキャプチャするために使用される人工的なエラーオブジェクト。

### `ERR_SYSTEM_ERROR` {#err_system_error}

Node.js プロセス内で、指定されていない、または非特定的なシステムエラーが発生しました。エラーオブジェクトには、追加の詳細情報を含む `err.info` オブジェクトプロパティがあります。

### `ERR_TAP_LEXER_ERROR` {#err_tap_lexer_error}

lexer の状態の失敗を表すエラー。

### `ERR_TAP_PARSER_ERROR` {#err_tap_parser_error}

parser の状態の失敗を表すエラー。エラーの原因となったトークンに関する追加情報は、`cause` プロパティを介して利用できます。

### `ERR_TAP_VALIDATION_ERROR` {#err_tap_validation_error}

このエラーは、TAP 検証の失敗を表します。

### `ERR_TEST_FAILURE` {#err_test_failure}

このエラーは、テストの失敗を表します。失敗に関する追加情報は、`cause` プロパティを介して利用できます。`failureType` プロパティは、失敗が発生したときにテストが行っていたことを指定します。

### `ERR_TLS_ALPN_CALLBACK_INVALID_RESULT` {#err_tls_alpn_callback_invalid_result}

このエラーは、`ALPNCallback` がクライアントによって提供される ALPN プロトコルのリストにない値を返した場合にスローされます。

### `ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS` {#err_tls_alpn_callback_with_protocols}

このエラーは、TLS オプションに `ALPNProtocols` と `ALPNCallback` の両方が含まれている場合に `TLSServer` を作成するときにスローされます。これらのオプションは相互に排他的です。

### `ERR_TLS_CERT_ALTNAME_FORMAT` {#err_tls_cert_altname_format}

このエラーは、ユーザーが提供した `subjectaltname` プロパティがエンコードルールに違反している場合、`checkServerIdentity` によってスローされます。Node.js 自体が生成した証明書オブジェクトは常にエンコードルールに準拠しており、このエラーが発生することはありません。

### `ERR_TLS_CERT_ALTNAME_INVALID` {#err_tls_cert_altname_invalid}

TLS を使用しているときに、ピアのホスト名/IP が証明書の `subjectAltNames` のいずれとも一致しませんでした。

### `ERR_TLS_DH_PARAM_SIZE` {#err_tls_dh_param_size}

TLS を使用しているときに、Diffie-Hellman (`DH`) 鍵共有プロトコルに提供されるパラメータが小さすぎます。デフォルトでは、脆弱性を回避するために鍵長は 1024 ビット以上である必要があります。より強力なセキュリティのためには、2048 ビット以上を使用することを強くお勧めします。


### `ERR_TLS_HANDSHAKE_TIMEOUT` {#err_tls_handshake_timeout}

TLS/SSLハンドシェイクがタイムアウトしました。この場合、サーバーも接続を中断する必要があります。

### `ERR_TLS_INVALID_CONTEXT` {#err_tls_invalid_context}

**Added in: v13.3.0**

コンテキストは `SecureContext` である必要があります。

### `ERR_TLS_INVALID_PROTOCOL_METHOD` {#err_tls_invalid_protocol_method}

指定された `secureProtocol` メソッドは無効です。不明であるか、安全でないため無効になっています。

### `ERR_TLS_INVALID_PROTOCOL_VERSION` {#err_tls_invalid_protocol_version}

有効なTLSプロトコルバージョンは、`'TLSv1'`、`'TLSv1.1'`、または`'TLSv1.2'`です。

### `ERR_TLS_INVALID_STATE` {#err_tls_invalid_state}

**Added in: v13.10.0, v12.17.0**

TLSソケットは接続され、安全に確立されている必要があります。続行する前に、'secure'イベントが発行されることを確認してください。

### `ERR_TLS_PROTOCOL_VERSION_CONFLICT` {#err_tls_protocol_version_conflict}

TLSプロトコルの `minVersion` または `maxVersion` を設定しようとすると、 `secureProtocol` を明示的に設定しようとする試みと競合します。どちらかのメカニズムを使用してください。

### `ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED` {#err_tls_psk_set_identity_hint_failed}

PSK IDヒントの設定に失敗しました。ヒントが長すぎる可能性があります。

### `ERR_TLS_RENEGOTIATION_DISABLED` {#err_tls_renegotiation_disabled}

再ネゴシエーションが無効になっているソケットインスタンスでTLSを再ネゴシエーションしようとしました。

### `ERR_TLS_REQUIRED_SERVER_NAME` {#err_tls_required_server_name}

TLSを使用しているときに、最初のパラメータでホスト名を指定せずに `server.addContext()` メソッドが呼び出されました。

### `ERR_TLS_SESSION_ATTACK` {#err_tls_session_attack}

過剰な量のTLS再ネゴシエーションが検出されました。これはサービス拒否攻撃の潜在的なベクトルです。

### `ERR_TLS_SNI_FROM_SERVER` {#err_tls_sni_from_server}

TLSサーバー側のソケットからサーバー名表示を発行しようとしましたが、これはクライアントからのみ有効です。

### `ERR_TRACE_EVENTS_CATEGORY_REQUIRED` {#err_trace_events_category_required}

`trace_events.createTracing()` メソッドには、少なくとも1つのトレースイベントカテゴリが必要です。

### `ERR_TRACE_EVENTS_UNAVAILABLE` {#err_trace_events_unavailable}

Node.jsが `--without-v8-platform` フラグでコンパイルされたため、 `node:trace_events` モジュールをロードできませんでした。

### `ERR_TRANSFORM_ALREADY_TRANSFORMING` {#err_transform_already_transforming}

`Transform` ストリームは、まだ変換中に終了しました。

### `ERR_TRANSFORM_WITH_LENGTH_0` {#err_transform_with_length_0}

`Transform` ストリームは、書き込みバッファにデータが残った状態で終了しました。


### `ERR_TTY_INIT_FAILED` {#err_tty_init_failed}

TTYの初期化がシステムエラーにより失敗しました。

### `ERR_UNAVAILABLE_DURING_EXIT` {#err_unavailable_during_exit}

関数が、[`process.on('exit')`](/ja/nodejs/api/process#event-exit) ハンドラ内で呼び出されるべきではない [`process.on('exit')`](/ja/nodejs/api/process#event-exit) ハンドラ内で呼び出されました。

### `ERR_UNCAUGHT_EXCEPTION_CAPTURE_ALREADY_SET` {#err_uncaught_exception_capture_already_set}

[`process.setUncaughtExceptionCaptureCallback()`](/ja/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) が、コールバックを最初に `null` にリセットせずに2回呼び出されました。

このエラーは、別のモジュールから登録されたコールバックを誤って上書きすることを防ぐように設計されています。

### `ERR_UNESCAPED_CHARACTERS` {#err_unescaped_characters}

エスケープされていない文字を含む文字列を受信しました。

### `ERR_UNHANDLED_ERROR` {#err_unhandled_error}

未処理のエラーが発生しました（たとえば、[`EventEmitter`](/ja/nodejs/api/events#class-eventemitter) によって `'error'` イベントが発行されたが、`'error'` ハンドラが登録されていない場合）。

### `ERR_UNKNOWN_BUILTIN_MODULE` {#err_unknown_builtin_module}

ユーザーコードによって通常トリガーされるべきではない特定種類の Node.js 内部エラーを識別するために使用されます。このエラーのインスタンスは、Node.js バイナリ自体の内部バグを指しています。

### `ERR_UNKNOWN_CREDENTIAL` {#err_unknown_credential}

存在しないUnixグループまたはユーザー識別子が渡されました。

### `ERR_UNKNOWN_ENCODING` {#err_unknown_encoding}

無効または不明なエンコーディングオプションがAPIに渡されました。

### `ERR_UNKNOWN_FILE_EXTENSION` {#err_unknown_file_extension}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

不明またはサポートされていないファイル拡張子を持つモジュールをロードしようとしました。

### `ERR_UNKNOWN_MODULE_FORMAT` {#err_unknown_module_format}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

不明またはサポートされていないフォーマットを持つモジュールをロードしようとしました。

### `ERR_UNKNOWN_SIGNAL` {#err_unknown_signal}

無効または不明なプロセスシグナルが、有効なシグナルを期待するAPI（[`subprocess.kill()`](/ja/nodejs/api/child_process#subprocesskillsignal) など）に渡されました。


### `ERR_UNSUPPORTED_DIR_IMPORT` {#err_unsupported_dir_import}

ディレクトリ URL の `import` はサポートされていません。代わりに、[パッケージ名を使用してパッケージ自身を参照](/ja/nodejs/api/packages#self-referencing-a-package-using-its-name)し、[`"exports"`](/ja/nodejs/api/packages#exports) フィールドの [`package.json`](/ja/nodejs/api/packages#nodejs-packagejson-field-definitions) ファイルで [カスタムサブパスを定義](/ja/nodejs/api/packages#subpath-exports)してください。

```js [ESM]
import './'; // サポートされていません
import './index.js'; // サポートされています
import 'package-name'; // サポートされています
```
### `ERR_UNSUPPORTED_ESM_URL_SCHEME` {#err_unsupported_esm_url_scheme}

`file` および `data` 以外の URL スキームでの `import` はサポートされていません。

### `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` {#err_unsupported_node_modules_type_stripping}

**Added in: v22.6.0**

型ストリッピングは、`node_modules` ディレクトリの子孫ファイルではサポートされていません。

### `ERR_UNSUPPORTED_RESOLVE_REQUEST` {#err_unsupported_resolve_request}

無効なモジュールリファラーを解決しようとしました。これは、次の場合にインポートするか、`import.meta.resolve()` を呼び出すときに発生する可能性があります。

- URL スキームが `file` ではないモジュールからの、組み込みモジュールではないベア指定子。
- URL スキームが [特別なスキーム](https://url.spec.whatwg.org/#special-scheme) ではないモジュールからの [相対 URL](https://url.spec.whatwg.org/#relative-url-string)。

```js [ESM]
try {
  // `data:` URL モジュールからパッケージ 'bare-specifier' をインポートしようとしています:
  await import('data:text/javascript,import "bare-specifier"');
} catch (e) {
  console.log(e.code); // ERR_UNSUPPORTED_RESOLVE_REQUEST
}
```
### `ERR_USE_AFTER_CLOSE` {#err_use_after_close}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

すでに閉じられたものを使用しようとしました。

### `ERR_VALID_PERFORMANCE_ENTRY_TYPE` {#err_valid_performance_entry_type}

Performance Timing API (`perf_hooks`) の使用中に、有効なパフォーマンスエントリタイプが見つかりません。

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` {#err_vm_dynamic_import_callback_missing}

動的インポートコールバックが指定されていません。

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` {#err_vm_dynamic_import_callback_missing_flag}

`--experimental-vm-modules` なしで動的インポートコールバックが呼び出されました。


### `ERR_VM_MODULE_ALREADY_LINKED` {#err_vm_module_already_linked}

リンクしようとしたモジュールは、次のいずれかの理由によりリンクできません。

- 既にリンクされている (`linkingStatus` が `'linked'` である)
- リンク中である (`linkingStatus` が `'linking'` である)
- このモジュールのリンクに失敗した (`linkingStatus` が `'errored'` である)

### `ERR_VM_MODULE_CACHED_DATA_REJECTED` {#err_vm_module_cached_data_rejected}

モジュールコンストラクターに渡された `cachedData` オプションが無効です。

### `ERR_VM_MODULE_CANNOT_CREATE_CACHED_DATA` {#err_vm_module_cannot_create_cached_data}

評価済みのモジュールに対してキャッシュされたデータを作成することはできません。

### `ERR_VM_MODULE_DIFFERENT_CONTEXT` {#err_vm_module_different_context}

リンカー関数から返されるモジュールが、親モジュールとは異なるコンテキストからのものです。リンクされたモジュールは同じコンテキストを共有する必要があります。

### `ERR_VM_MODULE_LINK_FAILURE` {#err_vm_module_link_failure}

モジュールは、失敗のためリンクできませんでした。

### `ERR_VM_MODULE_NOT_MODULE` {#err_vm_module_not_module}

リンクプロミスの fulfilled 値は `vm.Module` オブジェクトではありません。

### `ERR_VM_MODULE_STATUS` {#err_vm_module_status}

現在のモジュールのステータスでは、この操作は許可されていません。エラーの具体的な意味は、特定の関数によって異なります。

### `ERR_WASI_ALREADY_STARTED` {#err_wasi_already_started}

WASI インスタンスは既に開始されています。

### `ERR_WASI_NOT_STARTED` {#err_wasi_not_started}

WASI インスタンスは開始されていません。

### `ERR_WEBASSEMBLY_RESPONSE` {#err_webassembly_response}

**Added in: v18.1.0**

`WebAssembly.compileStreaming` または `WebAssembly.instantiateStreaming` に渡された `Response` が有効な WebAssembly レスポンスではありません。

### `ERR_WORKER_INIT_FAILED` {#err_worker_init_failed}

`Worker` の初期化に失敗しました。

### `ERR_WORKER_INVALID_EXEC_ARGV` {#err_worker_invalid_exec_argv}

`Worker` コンストラクターに渡された `execArgv` オプションに無効なフラグが含まれています。

### `ERR_WORKER_MESSAGING_ERRORED` {#err_worker_messaging_errored}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

[`postMessageToThread()`](/ja/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) 経由で送信されたメッセージの処理中に、宛先スレッドがエラーをスローしました。


### `ERR_WORKER_MESSAGING_FAILED` {#err_worker_messaging_failed}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

[`postMessageToThread()`](/ja/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) で要求されたスレッドが無効であるか、`workerMessage` リスナーがありません。

### `ERR_WORKER_MESSAGING_SAME_THREAD` {#err_worker_messaging_same_thread}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

[`postMessageToThread()`](/ja/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) で要求されたスレッド ID が現在のスレッド ID です。

### `ERR_WORKER_MESSAGING_TIMEOUT` {#err_worker_messaging_timeout}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

[`postMessageToThread()`](/ja/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) を介したメッセージの送信がタイムアウトしました。

### `ERR_WORKER_NOT_RUNNING` {#err_worker_not_running}

操作は、`Worker` インスタンスが現在実行されていないため失敗しました。

### `ERR_WORKER_OUT_OF_MEMORY` {#err_worker_out_of_memory}

`Worker` インスタンスは、メモリ制限に達したため終了しました。

### `ERR_WORKER_PATH` {#err_worker_path}

ワーカーのメインスクリプトのパスは、絶対パスでも `./` または `../` で始まる相対パスでもありません。

### `ERR_WORKER_UNSERIALIZABLE_ERROR` {#err_worker_unserializable_error}

ワーカー スレッドからのキャッチされない例外をシリアル化するすべての試みが失敗しました。

### `ERR_WORKER_UNSUPPORTED_OPERATION` {#err_worker_unsupported_operation}

要求された機能は、ワーカー スレッドではサポートされていません。

### `ERR_ZLIB_INITIALIZATION_FAILED` {#err_zlib_initialization_failed}

不正な設定のため、[`zlib`](/ja/nodejs/api/zlib) オブジェクトの作成に失敗しました。

### `HPE_CHUNK_EXTENSIONS_OVERFLOW` {#hpe_chunk_extensions_overflow}

**Added in: v21.6.2, v20.11.1, v18.19.1**

チャンク拡張機能に対して受信されたデータが多すぎます。 悪意のあるクライアントまたは誤って構成されたクライアントから保護するために、16 KiB を超えるデータを受信した場合、このコードのエラーが発行されます。


### `HPE_HEADER_OVERFLOW` {#hpe_header_overflow}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v11.4.0, v10.15.0 | `http_parser` の最大ヘッダーサイズが 8 KiB に設定されました。 |
:::

HTTPヘッダーデータが多すぎます。悪意のあるクライアントや誤った設定のクライアントから保護するために、`maxHeaderSize` を超えるHTTPヘッダーデータを受信した場合、HTTP解析はリクエストまたはレスポンスオブジェクトを作成せずに中止され、このコードを持つ `Error` が発行されます。

### `HPE_UNEXPECTED_CONTENT_LENGTH` {#hpe_unexpected_content_length}

サーバーが `Content-Length` ヘッダーと `Transfer-Encoding: chunked` の両方を送信しています。

`Transfer-Encoding: chunked` を使用すると、サーバーは動的に生成されたコンテンツのHTTP永続接続を維持できます。この場合、`Content-Length` HTTPヘッダーは使用できません。

`Content-Length` または `Transfer-Encoding: chunked` を使用してください。

### `MODULE_NOT_FOUND` {#module_not_found}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.0.0 | `requireStack` プロパティが追加されました。 |
:::

[`require()`](/ja/nodejs/api/modules#requireid) 操作を実行しようとしたとき、またはプログラムのエントリーポイントをロードするときに、CommonJSモジュールローダーがモジュールファイルを解決できませんでした。

## レガシー Node.js エラーコード {#legacy-nodejs-error-codes}

::: danger [安定: 0 - 非推奨]
[安定: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨。これらのエラーコードは一貫性がないか、削除されています。
:::

### `ERR_CANNOT_TRANSFER_OBJECT` {#err_cannot_transfer_object}

**追加: v10.5.0**

**削除: v12.5.0**

`postMessage()` に渡された値に、転送がサポートされていないオブジェクトが含まれていました。

### `ERR_CPU_USAGE` {#err_cpu_usage}

**削除: v15.0.0**

`process.cpuUsage` からのネイティブ呼び出しを処理できませんでした。

### `ERR_CRYPTO_HASH_DIGEST_NO_UTF16` {#err_crypto_hash_digest_no_utf16}

**追加: v9.0.0**

**削除: v12.12.0**

UTF-16エンコーディングが [`hash.digest()`](/ja/nodejs/api/crypto#hashdigestencoding) で使用されました。 `hash.digest()` メソッドは、メソッドが `Buffer` ではなく文字列を返すようにする `encoding` 引数を渡すことができますが、UTF-16エンコーディング (例: `ucs` または `utf16le`) はサポートされていません。


### `ERR_CRYPTO_SCRYPT_INVALID_PARAMETER` {#err_crypto_scrypt_invalid_parameter}

**削除: v23.0.0**

互換性のないオプションの組み合わせが[`crypto.scrypt()`](/ja/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback)または[`crypto.scryptSync()`](/ja/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options)に渡されました。 新しいバージョンのNode.jsでは、代わりにエラーコード[`ERR_INCOMPATIBLE_OPTION_PAIR`](/ja/nodejs/api/errors#err_incompatible_option_pair)が使用されます。これは他のAPIと一貫性があります。

### `ERR_FS_INVALID_SYMLINK_TYPE` {#err_fs_invalid_symlink_type}

**削除: v23.0.0**

無効なシンボリックリンクタイプが[`fs.symlink()`](/ja/nodejs/api/fs#fssymlinktarget-path-type-callback)または[`fs.symlinkSync()`](/ja/nodejs/api/fs#fssymlinksynctarget-path-type)メソッドに渡されました。

### `ERR_HTTP2_FRAME_ERROR` {#err_http2_frame_error}

**追加: v9.0.0**

**削除: v10.0.0**

HTTP/2セッションで個々のフレームの送信に失敗した場合に使用されます。

### `ERR_HTTP2_HEADERS_OBJECT` {#err_http2_headers_object}

**追加: v9.0.0**

**削除: v10.0.0**

HTTP/2 Headersオブジェクトが期待される場合に使用されます。

### `ERR_HTTP2_HEADER_REQUIRED` {#err_http2_header_required}

**追加: v9.0.0**

**削除: v10.0.0**

HTTP/2メッセージで必要なヘッダーが見つからない場合に使用されます。

### `ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND` {#err_http2_info_headers_after_respond}

**追加: v9.0.0**

**削除: v10.0.0**

HTTP/2情報ヘッダーは、`Http2Stream.prototype.respond()`メソッドを呼び出す*前*にのみ送信する必要があります。

### `ERR_HTTP2_STREAM_CLOSED` {#err_http2_stream_closed}

**追加: v9.0.0**

**削除: v10.0.0**

既に閉じられているHTTP/2ストリームに対してアクションが実行された場合に使用されます。

### `ERR_HTTP_INVALID_CHAR` {#err_http_invalid_char}

**追加: v9.0.0**

**削除: v10.0.0**

HTTP応答ステータスメッセージ（理由句）に無効な文字が見つかった場合に使用されます。

### `ERR_IMPORT_ASSERTION_TYPE_FAILED` {#err_import_assertion_type_failed}

**追加: v17.1.0, v16.14.0**

**削除: v21.1.0**

インポートアサーションが失敗し、指定されたモジュールをインポートできません。

### `ERR_IMPORT_ASSERTION_TYPE_MISSING` {#err_import_assertion_type_missing}

**追加: v17.1.0, v16.14.0**

**削除: v21.1.0**

インポートアサーションが欠落しているため、指定されたモジュールをインポートできません。


### `ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED` {#err_import_assertion_type_unsupported}

**追加: v17.1.0, v16.14.0**

**削除: v21.1.0**

インポート属性が、このバージョンのNode.jsでサポートされていません。

### `ERR_INDEX_OUT_OF_RANGE` {#err_index_out_of_range}

**追加: v10.0.0**

**削除: v11.0.0**

指定されたインデックスが、許可された範囲外でした（例：負のオフセット）。

### `ERR_INVALID_OPT_VALUE` {#err_invalid_opt_value}

**追加: v8.0.0**

**削除: v15.0.0**

オプションオブジェクトで、無効または予期しない値が渡されました。

### `ERR_INVALID_OPT_VALUE_ENCODING` {#err_invalid_opt_value_encoding}

**追加: v9.0.0**

**削除: v15.0.0**

無効または不明なファイルエンコーディングが渡されました。

### `ERR_INVALID_PERFORMANCE_MARK` {#err_invalid_performance_mark}

**追加: v8.5.0**

**削除: v16.7.0**

Performance Timing API（`perf_hooks`）を使用中に、パフォーマンスマークが無効です。

### `ERR_INVALID_TRANSFER_OBJECT` {#err_invalid_transfer_object}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v21.0.0 | 代わりに `DOMException` がスローされます。 |
| v21.0.0 | 削除: v21.0.0 |
:::

無効な転送オブジェクトが `postMessage()` に渡されました。

### `ERR_MANIFEST_ASSERT_INTEGRITY` {#err_manifest_assert_integrity}

**削除: v22.2.0**

リソースをロードしようとしましたが、リソースがポリシーマニフェストで定義された整合性と一致しませんでした。詳細については、ポリシーマニフェストのドキュメントを参照してください。

### `ERR_MANIFEST_DEPENDENCY_MISSING` {#err_manifest_dependency_missing}

**削除: v22.2.0**

リソースをロードしようとしましたが、リソースはそれをロードしようとした場所からの依存関係としてリストされていませんでした。詳細については、ポリシーマニフェストのドキュメントを参照してください。

### `ERR_MANIFEST_INTEGRITY_MISMATCH` {#err_manifest_integrity_mismatch}

**削除: v22.2.0**

ポリシーマニフェストをロードしようとしましたが、マニフェストにリソースに対して一致しない複数のエントリがありました。このエラーを解決するには、マニフェストエントリが一致するように更新してください。詳細については、ポリシーマニフェストのドキュメントを参照してください。

### `ERR_MANIFEST_INVALID_RESOURCE_FIELD` {#err_manifest_invalid_resource_field}

**削除: v22.2.0**

ポリシーマニフェストリソースのフィールドの1つに無効な値がありました。このエラーを解決するには、マニフェストエントリが一致するように更新してください。詳細については、ポリシーマニフェストのドキュメントを参照してください。


### `ERR_MANIFEST_INVALID_SPECIFIER` {#err_manifest_invalid_specifier}

**Removed in: v22.2.0**

ポリシーマニフェストリソースに、依存関係のマッピングの無効な値がありました。このエラーを解決するには、マニフェストエントリを一致するように更新してください。詳細については、ポリシーマニフェストのドキュメントを参照してください。

### `ERR_MANIFEST_PARSE_POLICY` {#err_manifest_parse_policy}

**Removed in: v22.2.0**

ポリシーマニフェストをロードしようとしましたが、マニフェストを解析できませんでした。詳細については、ポリシーマニフェストのドキュメントを参照してください。

### `ERR_MANIFEST_TDZ` {#err_manifest_tdz}

**Removed in: v22.2.0**

ポリシーマニフェストから読み取ろうとしましたが、マニフェストの初期化がまだ行われていません。これは Node.js のバグである可能性があります。

### `ERR_MANIFEST_UNKNOWN_ONERROR` {#err_manifest_unknown_onerror}

**Removed in: v22.2.0**

ポリシーマニフェストがロードされましたが、"onerror" の動作に不明な値がありました。詳細については、ポリシーマニフェストのドキュメントを参照してください。

### `ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST` {#err_missing_message_port_in_transfer_list}

**Removed in: v15.0.0**

このエラーコードは、Node.js v15.0.0 で [`ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST`](/ja/nodejs/api/errors#err_missing_transferable_in_transfer_list) に置き換えられました。これは、他の種類の転送可能なオブジェクトも存在するようになったため、もはや正確ではないためです。

### `ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST` {#err_missing_transferable_in_transfer_list}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v21.0.0 | `DOMException` が代わりにスローされます。 |
| v21.0.0 | Removed in: v21.0.0 |
| v15.0.0 | Added in: v15.0.0 |
:::

`transferList` 引数に明示的にリストする必要があるオブジェクトが、[`postMessage()`](/ja/nodejs/api/worker_threads#portpostmessagevalue-transferlist) 呼び出しに渡されるオブジェクト内にありますが、その呼び出しの `transferList` には提供されていません。通常、これは `MessagePort` です。

Node.js の v15.0.0 より前のバージョンでは、ここで使用されていたエラーコードは [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/ja/nodejs/api/errors#err_missing_message_port_in_transfer_list) でした。ただし、転送可能なオブジェクトの種類のセットは、`MessagePort` よりも多くの種類をカバーするように拡張されました。

### `ERR_NAPI_CONS_PROTOTYPE_OBJECT` {#err_napi_cons_prototype_object}

**Added in: v9.0.0**

**Removed in: v10.0.0**

`Constructor.prototype` がオブジェクトでない場合に `Node-API` によって使用されます。


### `ERR_NAPI_TSFN_START_IDLE_LOOP` {#err_napi_tsfn_start_idle_loop}

**Added in: v10.6.0, v8.16.0**

**Removed in: v14.2.0, v12.17.0**

メインスレッドで、スレッドセーフ関数に関連付けられたキューから値がアイドルループで削除されます。このエラーは、ループの開始を試みるときにエラーが発生したことを示します。

### `ERR_NAPI_TSFN_STOP_IDLE_LOOP` {#err_napi_tsfn_stop_idle_loop}

**Added in: v10.6.0, v8.16.0**

**Removed in: v14.2.0, v12.17.0**

キューにアイテムが残っていない場合、アイドルループは中断される必要があります。このエラーは、アイドルループが停止に失敗したことを示します。

### `ERR_NO_LONGER_SUPPORTED` {#err_no_longer_supported}

Node.js APIがサポートされていない方法で呼び出されました。たとえば、`Buffer.write(string, encoding, offset[, length])` などです。

### `ERR_OUTOFMEMORY` {#err_outofmemory}

**Added in: v9.0.0**

**Removed in: v10.0.0**

操作がメモリ不足の状態を引き起こしたことを特定するために一般的に使用されます。

### `ERR_PARSE_HISTORY_DATA` {#err_parse_history_data}

**Added in: v9.0.0**

**Removed in: v10.0.0**

`node:repl` モジュールがREPL履歴ファイルからデータを解析できませんでした。

### `ERR_SOCKET_CANNOT_SEND` {#err_socket_cannot_send}

**Added in: v9.0.0**

**Removed in: v14.0.0**

ソケットでデータを送信できませんでした。

### `ERR_STDERR_CLOSE` {#err_stderr_close}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.12.0 | エラーを発生させる代わりに、`process.stderr.end()` はストリーム側のみを閉じ、基になるリソースは閉じなくなり、このエラーは廃止されました。 |
| v10.12.0 | Removed in: v10.12.0 |
:::

`process.stderr` ストリームを閉じようとしました。設計上、Node.jsでは、ユーザーコードが `stdout` または `stderr` ストリームを閉じることはできません。

### `ERR_STDOUT_CLOSE` {#err_stdout_close}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.12.0 | エラーを発生させる代わりに、`process.stderr.end()` はストリーム側のみを閉じ、基になるリソースは閉じなくなり、このエラーは廃止されました。 |
| v10.12.0 | Removed in: v10.12.0 |
:::

`process.stdout` ストリームを閉じようとしました。設計上、Node.jsでは、ユーザーコードが `stdout` または `stderr` ストリームを閉じることはできません。

### `ERR_STREAM_READ_NOT_IMPLEMENTED` {#err_stream_read_not_implemented}

**Added in: v9.0.0**

**Removed in: v10.0.0**

[`readable._read()`](/ja/nodejs/api/stream#readable_readsize) を実装していないReadableストリームを使用しようとした場合に使用されます。


### `ERR_TLS_RENEGOTIATION_FAILED` {#err_tls_renegotiation_failed}

**Added in: v9.0.0**

**Removed in: v10.0.0**

TLS再ネゴシエーションリクエストが特定できない方法で失敗した場合に使用されます。

### `ERR_TRANSFERRING_EXTERNALIZED_SHAREDARRAYBUFFER` {#err_transferring_externalized_sharedarraybuffer}

**Added in: v10.5.0**

**Removed in: v14.0.0**

JavaScriptエンジンまたはNode.jsによってメモリが管理されていない`SharedArrayBuffer`が、シリアライズ中に検出されました。このような`SharedArrayBuffer`はシリアライズできません。

これは、ネイティブアドオンが「外部化」モードで`SharedArrayBuffer`を作成するか、既存の`SharedArrayBuffer`を外部化モードにした場合にのみ発生する可能性があります。

### `ERR_UNKNOWN_STDIN_TYPE` {#err_unknown_stdin_type}

**Added in: v8.0.0**

**Removed in: v11.7.0**

不明な`stdin`ファイルタイプでNode.jsプロセスを起動しようとしました。このエラーは通常、Node.js自体のバグを示していますが、ユーザーコードがトリガーする可能性もあります。

### `ERR_UNKNOWN_STREAM_TYPE` {#err_unknown_stream_type}

**Added in: v8.0.0**

**Removed in: v11.7.0**

不明な`stdout`または`stderr`ファイルタイプでNode.jsプロセスを起動しようとしました。このエラーは通常、Node.js自体のバグを示していますが、ユーザーコードがトリガーする可能性もあります。

### `ERR_V8BREAKITERATOR` {#err_v8breakiterator}

V8 `BreakIterator` APIが使用されましたが、完全なICUデータセットがインストールされていません。

### `ERR_VALUE_OUT_OF_RANGE` {#err_value_out_of_range}

**Added in: v9.0.0**

**Removed in: v10.0.0**

指定された値が許容範囲外の場合に使用されます。

### `ERR_VM_MODULE_LINKING_ERRORED` {#err_vm_module_linking_errored}

**Added in: v10.0.0**

**Removed in: v18.1.0, v16.17.0**

リンカー関数が、リンキングに失敗したモジュールを返しました。

### `ERR_VM_MODULE_NOT_LINKED` {#err_vm_module_not_linked}

インスタンス化する前に、モジュールを正常にリンクする必要があります。

### `ERR_WORKER_UNSUPPORTED_EXTENSION` {#err_worker_unsupported_extension}

**Added in: v11.0.0**

**Removed in: v16.9.0**

ワーカーのメインスクリプトに使用されたパス名に、不明なファイル拡張子があります。

### `ERR_ZLIB_BINDING_CLOSED` {#err_zlib_binding_closed}

**Added in: v9.0.0**

**Removed in: v10.0.0**

すでに閉じられている`zlib`オブジェクトを使用しようとした場合に使用されます。


## OpenSSL エラーコード {#openssl-error-codes}

### 時間の有効性エラー {#time-validity-errors}

#### `CERT_NOT_YET_VALID` {#cert_not_yet_valid}

証明書はまだ有効ではありません。notBefore 日付が現在時刻より後です。

#### `CERT_HAS_EXPIRED` {#cert_has_expired}

証明書は期限切れです。notAfter 日付が現在時刻より前です。

#### `CRL_NOT_YET_VALID` {#crl_not_yet_valid}

証明書失効リスト (CRL) の発行日が未来です。

#### `CRL_HAS_EXPIRED` {#crl_has_expired}

証明書失効リスト (CRL) は期限切れです。

#### `CERT_REVOKED` {#cert_revoked}

証明書は失効しています。証明書失効リスト (CRL) に記載されています。

### 信頼またはチェーン関連のエラー {#trust-or-chain-related-errors}

#### `UNABLE_TO_GET_ISSUER_CERT` {#unable_to_get_issuer_cert}

検索された証明書の発行者証明書が見つかりませんでした。これは通常、信頼できる証明書のリストが完全ではないことを意味します。

#### `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` {#unable_to_get_issuer_cert_locally}

証明書の発行者が不明です。これは、発行者が信頼できる証明書リストに含まれていない場合に発生します。

#### `DEPTH_ZERO_SELF_SIGNED_CERT` {#depth_zero_self_signed_cert}

渡された証明書は自己署名であり、同じ証明書が信頼できる証明書のリストに見つかりません。

#### `SELF_SIGNED_CERT_IN_CHAIN` {#self_signed_cert_in_chain}

証明書の発行者が不明です。これは、発行者が信頼できる証明書リストに含まれていない場合に発生します。

#### `CERT_CHAIN_TOO_LONG` {#cert_chain_too_long}

証明書チェーンの長さが最大深度を超えています。

#### `UNABLE_TO_GET_CRL` {#unable_to_get_crl}

証明書によって参照される CRL が見つかりませんでした。

#### `UNABLE_TO_VERIFY_LEAF_SIGNATURE` {#unable_to_verify_leaf_signature}

チェーンに証明書が 1 つしか含まれておらず、自己署名ではないため、署名を検証できませんでした。

#### `CERT_UNTRUSTED` {#cert_untrusted}

ルート認証局 (CA) は、指定された目的のために信頼できるものとしてマークされていません。

### 基本拡張エラー {#basic-extension-errors}

#### `INVALID_CA` {#invalid_ca}

CA 証明書が無効です。CA でないか、拡張機能が指定された目的に一致していません。

#### `PATH_LENGTH_EXCEEDED` {#path_length_exceeded}

basicConstraints pathlength パラメータを超えました。

### 名前関連のエラー {#name-related-errors}

#### `HOSTNAME_MISMATCH` {#hostname_mismatch}

証明書が提供された名前と一致しません。

### 使用法とポリシーのエラー {#usage-and-policy-errors}


#### `INVALID_PURPOSE` {#invalid_purpose}

指定された目的のために、提供された証明書を使用できません。

#### `CERT_REJECTED` {#cert_rejected}

ルートCAは、指定された目的を拒否するようにマークされています。

### フォーマットエラー {#formatting-errors}

#### `CERT_SIGNATURE_FAILURE` {#cert_signature_failure}

証明書の署名が無効です。

#### `CRL_SIGNATURE_FAILURE` {#crl_signature_failure}

証明書失効リスト (CRL) の署名が無効です。

#### `ERROR_IN_CERT_NOT_BEFORE_FIELD` {#error_in_cert_not_before_field}

証明書の notBefore フィールドに無効な時間が含まれています。

#### `ERROR_IN_CERT_NOT_AFTER_FIELD` {#error_in_cert_not_after_field}

証明書の notAfter フィールドに無効な時間が含まれています。

#### `ERROR_IN_CRL_LAST_UPDATE_FIELD` {#error_in_crl_last_update_field}

CRL の lastUpdate フィールドに無効な時間が含まれています。

#### `ERROR_IN_CRL_NEXT_UPDATE_FIELD` {#error_in_crl_next_update_field}

CRL の nextUpdate フィールドに無効な時間が含まれています。

#### `UNABLE_TO_DECRYPT_CERT_SIGNATURE` {#unable_to_decrypt_cert_signature}

証明書の署名を復号化できませんでした。これは、期待される値と一致しないのではなく、実際の署名値を判別できなかったことを意味します。これは RSA キーに対してのみ意味があります。

#### `UNABLE_TO_DECRYPT_CRL_SIGNATURE` {#unable_to_decrypt_crl_signature}

証明書失効リスト (CRL) の署名を復号化できませんでした。これは、期待される値と一致しないのではなく、実際の署名値を判別できなかったことを意味します。

#### `UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY` {#unable_to_decode_issuer_public_key}

証明書の SubjectPublicKeyInfo の公開鍵を読み取ることができませんでした。

### その他の OpenSSL エラー {#other-openssl-errors}

#### `OUT_OF_MEM` {#out_of_mem}

メモリを割り当てようとしてエラーが発生しました。これは決して起こりません。

