---
title: Node.js コンソールAPIドキュメント
description: Node.jsのコンソールAPIは、ウェブブラウザが提供するJavaScriptコンソールメカニズムに似たシンプルなデバッグコンソールを提供します。このドキュメントでは、Node.js環境でのJavaScriptオブジェクトのログ記録、デバッグ、および検査に使用できるメソッドを詳述しています。
head:
  - - meta
    - name: og:title
      content: Node.js コンソールAPIドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのコンソールAPIは、ウェブブラウザが提供するJavaScriptコンソールメカニズムに似たシンプルなデバッグコンソールを提供します。このドキュメントでは、Node.js環境でのJavaScriptオブジェクトのログ記録、デバッグ、および検査に使用できるメソッドを詳述しています。
  - - meta
    - name: twitter:title
      content: Node.js コンソールAPIドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのコンソールAPIは、ウェブブラウザが提供するJavaScriptコンソールメカニズムに似たシンプルなデバッグコンソールを提供します。このドキュメントでは、Node.js環境でのJavaScriptオブジェクトのログ記録、デバッグ、および検査に使用できるメソッドを詳述しています。
---


# Console {#console}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/console.js](https://github.com/nodejs/node/blob/v23.5.0/lib/console.js)

`node:console` モジュールは、ウェブブラウザによって提供される JavaScript コンソール機構に似た、シンプルなデバッグコンソールを提供します。

このモジュールは 2 つの特定のコンポーネントをエクスポートします。

- `console.log()`、`console.error()`、`console.warn()` などのメソッドを持つ `Console` クラス。任意の Node.js ストリームに書き込むために使用できます。
- [`process.stdout`](/ja/nodejs/api/process#processstdout) と [`process.stderr`](/ja/nodejs/api/process#processstderr) に書き込むように設定されたグローバルな `console` インスタンス。グローバルな `console` は `require('node:console')` を呼び出さずに使用できます。

*<strong>警告</strong>*: グローバルな console オブジェクトのメソッドは、それが似ているブラウザ API のように一貫して同期的なものでも、他のすべての Node.js ストリームのように一貫して非同期的なものでもありません。console 関数の同期/非同期の挙動に依存することを望むプログラムは、最初に console のバッキングストリームの性質を把握する必要があります。これは、ストリームが現在のプロセスの基盤となるプラットフォームと標準ストリーム構成に依存するためです。詳細については、[プロセス I/O に関する注意](/ja/nodejs/api/process#a-note-on-process-io) を参照してください。

グローバルな `console` を使用する例:

```js [ESM]
console.log('hello world');
// stdout に hello world と出力
console.log('hello %s', 'world');
// stdout に hello world と出力
console.error(new Error('Whoops, something bad happened'));
// エラーメッセージとスタックトレースを stderr に出力:
//   Error: Whoops, something bad happened
//     at [eval]:5:15
//     at Script.runInThisContext (node:vm:132:18)
//     at Object.runInThisContext (node:vm:309:38)
//     at node:internal/process/execution:77:19
//     at [eval]-wrapper:6:22
//     at evalScript (node:internal/process/execution:76:60)
//     at node:internal/main/eval_string:23:3

const name = 'Will Robinson';
console.warn(`Danger ${name}! Danger!`);
// stderr に Danger Will Robinson! Danger! と出力
```
`Console` クラスを使用する例:

```js [ESM]
const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);

myConsole.log('hello world');
// out に hello world と出力
myConsole.log('hello %s', 'world');
// out に hello world と出力
myConsole.error(new Error('Whoops, something bad happened'));
// err に [Error: Whoops, something bad happened] と出力

const name = 'Will Robinson';
myConsole.warn(`Danger ${name}! Danger!`);
// err に Danger Will Robinson! Danger! と出力
```

## クラス: `Console` {#class-console}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v8.0.0 | 基になるストリームへの書き込み中に発生するエラーは、デフォルトで無視されるようになりました。 |
:::

`Console`クラスは、構成可能な出力ストリームを持つシンプルなロガーを作成するために使用でき、`require('node:console').Console`または`console.Console`（またはそれらの分割代入された対応物）を使用してアクセスできます。

::: code-group
```js [ESM]
import { Console } from 'node:console';
```

```js [CJS]
const { Console } = require('node:console');
```
:::

```js [ESM]
const { Console } = console;
```
### `new Console(stdout[, stderr][, ignoreErrors])` {#new-consolestdout-stderr-ignoreerrors}

### `new Console(options)` {#new-consoleoptions}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.2.0, v12.17.0 | `groupIndentation`オプションが導入されました。 |
| v11.7.0 | `inspectOptions`オプションが導入されました。 |
| v10.0.0 | `Console`コンストラクターが`options`引数をサポートするようになり、`colorMode`オプションが導入されました。 |
| v8.0.0 | `ignoreErrors`オプションが導入されました。 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stdout` [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable)
    - `stderr` [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable)
    - `ignoreErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 基になるストリームへの書き込み時にエラーを無視します。 **デフォルト:** `true`。
    - `colorMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) この`Console`インスタンスの色サポートを設定します。 `true`に設定すると、値を検査するときに色付けが有効になります。 `false`に設定すると、値を検査するときに色付けが無効になります。 `'auto'`に設定すると、色サポートは、それぞれのストリームの`isTTY`プロパティの値と`getColorDepth()`によって返される値に依存します。 `inspectOptions.colors`も設定されている場合、このオプションは使用できません。 **デフォルト:** `'auto'`。
    - `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`util.inspect()`](/ja/nodejs/api/util#utilinspectobject-options)に渡されるオプションを指定します。
    - `groupIndentation` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) グループのインデントを設定します。 **デフォルト:** `2`。

1つまたは2つの書き込み可能なストリームインスタンスを持つ新しい`Console`を作成します。 `stdout`は、ログまたは情報出力を印刷するための書き込み可能なストリームです。 `stderr`は、警告またはエラー出力に使用されます。 `stderr`が提供されない場合、`stdout`が`stderr`に使用されます。

::: code-group
```js [ESM]
import { createWriteStream } from 'node:fs';
import { Console } from 'node:console';
// Alternatively
// const { Console } = console;

const output = createWriteStream('./stdout.log');
const errorOutput = createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```

```js [CJS]
const fs = require('node:fs');
const { Console } = require('node:console');
// Alternatively
// const { Console } = console;

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```
:::

グローバルの`console`は、出力が[`process.stdout`](/ja/nodejs/api/process#processstdout)および[`process.stderr`](/ja/nodejs/api/process#processstderr)に送信される特別な`Console`です。 これは、次を呼び出すことと同等です。

```js [ESM]
new Console({ stdout: process.stdout, stderr: process.stderr });
```

### `console.assert(value[, ...message])` {#consoleassertvalue-message}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | 実装が仕様に準拠し、例外をスローしなくなりました。 |
| v0.1.101 | 追加: v0.1.101 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 真偽値としてテストされる値。
- `...message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `value` 以外のすべての引数は、エラーメッセージとして使用されます。

`console.assert()` は、`value` が [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) であるか、省略されている場合にメッセージを書き込みます。 メッセージを書き込むだけで、実行には影響しません。 出力は常に `"Assertion failed"` で始まります。 指定された場合、`message` は [`util.format()`](/ja/nodejs/api/util#utilformatformat-args) を使用してフォーマットされます。

`value` が [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) の場合、何も起こりません。

```js [ESM]
console.assert(true, 'does nothing');

console.assert(false, 'Whoops %s work', 'didn\'t');
// Assertion failed: Whoops didn't work

console.assert();
// Assertion failed
```
### `console.clear()` {#consoleclear}

**追加: v8.3.0**

`stdout` が TTY の場合、`console.clear()` を呼び出すと、TTY のクリアが試行されます。 `stdout` が TTY でない場合、このメソッドは何もしません。

`console.clear()` の具体的な動作は、オペレーティングシステムや端末の種類によって異なる場合があります。 ほとんどの Linux オペレーティングシステムでは、`console.clear()` は `clear` シェルコマンドと同様に動作します。 Windows では、`console.clear()` は Node.js バイナリの現在の端末ビューポートの出力のみをクリアします。

### `console.count([label])` {#consolecountlabel}

**追加: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) カウンターの表示ラベル。 **デフォルト:** `'default'`。

`label` に固有の内部カウンターを維持し、指定された `label` で `console.count()` が呼び出された回数を `stdout` に出力します。

```js [ESM]
> console.count()
default: 1
undefined
> console.count('default')
default: 2
undefined
> console.count('abc')
abc: 1
undefined
> console.count('xyz')
xyz: 1
undefined
> console.count('abc')
abc: 2
undefined
> console.count()
default: 3
undefined
>
```

### `console.countReset([label])` {#consolecountresetlabel}

**Added in: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) カウンターの表示ラベル。 **デフォルト:** `'default'`。

`label` に固有の内部カウンターをリセットします。

```js [ESM]
> console.count('abc');
abc: 1
undefined
> console.countReset('abc');
undefined
> console.count('abc');
abc: 1
undefined
>
```
### `console.debug(data[, ...args])` {#consoledebugdata-args}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v8.10.0 | `console.debug` が `console.log` のエイリアスになりました。 |
| v8.0.0 | Added in: v8.0.0 |
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`console.debug()` 関数は [`console.log()`](/ja/nodejs/api/console#consolelogdata-args) のエイリアスです。

### `console.dir(obj[, options])` {#consoledirobj-options}

**Added in: v0.1.101**

- `obj` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、オブジェクトの列挙不可能なプロパティとシンボルプロパティも表示されます。 **デフォルト:** `false`。
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) オブジェクトのフォーマット時に再帰する回数を [`util.inspect()`](/ja/nodejs/api/util#utilinspectobject-options) に指示します。 これは、大規模で複雑なオブジェクトを検査するのに役立ちます。 無限に再帰させるには、`null` を渡します。 **デフォルト:** `2`。
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、出力は ANSI カラーコードでスタイルされます。 色はカスタマイズ可能です。[`util.inspect()` の色のカスタマイズ](/ja/nodejs/api/util#customizing-utilinspect-colors) を参照してください。 **デフォルト:** `false`。

`obj` に対して [`util.inspect()`](/ja/nodejs/api/util#utilinspectobject-options) を使用し、結果の文字列を `stdout` に出力します。 この関数は、`obj` で定義されているカスタム `inspect()` 関数をバイパスします。


### `console.dirxml(...data)` {#consoledirxmldata}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.3.0 | `console.dirxml` は引数に対して `console.log` を呼び出すようになりました。 |
| v8.0.0 | v8.0.0 で追加 |
:::

- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

このメソッドは、受け取った引数を渡して `console.log()` を呼び出します。このメソッドは XML 形式を生成しません。

### `console.error([data][, ...args])` {#consoleerrordata-args}

**追加: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

改行付きで `stderr` に出力します。複数の引数を渡すことができ、最初の引数が主要なメッセージとして使用され、追加の引数は [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) と同様に置換値として使用されます (引数はすべて [`util.format()`](/ja/nodejs/api/util#utilformatformat-args) に渡されます)。

```js [ESM]
const code = 5;
console.error('error #%d', code);
// stderr に error #5 と出力されます
console.error('error', code);
// stderr に error 5 と出力されます
```
フォーマット要素 (例: `%d`) が最初の文字列に見つからない場合、[`util.inspect()`](/ja/nodejs/api/util#utilinspectobject-options) が各引数に対して呼び出され、結果の文字列値が連結されます。詳細については、[`util.format()`](/ja/nodejs/api/util#utilformatformat-args) を参照してください。

### `console.group([...label])` {#consolegrouplabel}

**追加: v8.5.0**

- `...label` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

後続の行のインデントを `groupIndentation` の長さ分だけスペースで増やします。

1 つ以上の `label` が指定されている場合、それらは追加のインデントなしで最初に出力されます。

### `console.groupCollapsed()` {#consolegroupcollapsed}

**追加: v8.5.0**

[`console.group()`](/ja/nodejs/api/console#consolegrouplabel) のエイリアスです。

### `console.groupEnd()` {#consolegroupend}

**追加: v8.5.0**

後続の行のインデントを `groupIndentation` の長さ分だけスペースで減らします。


### `console.info([data][, ...args])` {#consoleinfodata-args}

**Added in: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`console.info()` 関数は、[`console.log()`](/ja/nodejs/api/console#consolelogdata-args) のエイリアスです。

### `console.log([data][, ...args])` {#consolelogdata-args}

**Added in: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

改行付きで `stdout` に出力します。複数の引数を渡すことができ、最初の引数は主なメッセージとして使用され、追加の引数は [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) と同様の置換値として使用されます（引数はすべて [`util.format()`](/ja/nodejs/api/util#utilformatformat-args) に渡されます）。

```js [ESM]
const count = 5;
console.log('count: %d', count);
// Prints: count: 5, to stdout
console.log('count:', count);
// Prints: count: 5, to stdout
```
詳細については、[`util.format()`](/ja/nodejs/api/util#utilformatformat-args) を参照してください。

### `console.table(tabularData[, properties])` {#consoletabletabulardata-properties}

**Added in: v10.0.0**

- `tabularData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `properties` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) テーブルを構築するための代替プロパティ。

`tabularData` のプロパティの列（または `properties` を使用）と `tabularData` の行を含むテーブルを構築し、ログに記録します。テーブルとして解析できない場合は、単に引数をログに記録するようにフォールバックします。

```js [ESM]
// これらは表形式データとして解析できません
console.table(Symbol());
// Symbol()

console.table(undefined);
// undefined

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
// ┌─────────┬─────┬─────┐
// │ (index) │ a   │ b   │
// ├─────────┼─────┼─────┤
// │ 0       │ 1   │ 'Y' │
// │ 1       │ 'Z' │ 2   │
// └─────────┴─────┴─────┘

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
// ┌─────────┬─────┐
// │ (index) │ a   │
// ├─────────┼─────┤
// │ 0       │ 1   │
// │ 1       │ 'Z' │
// └─────────┴─────┘
```

### `console.time([label])` {#consoletimelabel}

**Added in: v0.1.104**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'default'`

操作の実行時間を計算するために使用できるタイマーを開始します。タイマーは一意の`label`によって識別されます。[`console.timeEnd()`](/ja/nodejs/api/console#consoletimeendlabel)を呼び出す際に同じ`label`を使用してタイマーを停止し、経過時間を適切な時間単位で`stdout`に出力します。たとえば、経過時間が3869msの場合、`console.timeEnd()`は「3.869s」と表示します。

### `console.timeEnd([label])` {#consoletimeendlabel}

::: info [History]
| Version | Changes |
| --- | --- |
| v13.0.0 | 経過時間が適切な時間単位で表示されるようになりました。 |
| v6.0.0 | このメソッドは、個々の`console.time()`呼び出しに対応しない複数の呼び出しをサポートしなくなりました。詳細は以下を参照してください。 |
| v0.1.104 | Added in: v0.1.104 |
:::

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'default'`

[`console.time()`](/ja/nodejs/api/console#consoletimelabel)を呼び出して以前に開始されたタイマーを停止し、結果を`stdout`に出力します。

```js [ESM]
console.time('bunch-of-stuff');
// Do a bunch of stuff.
console.timeEnd('bunch-of-stuff');
// Prints: bunch-of-stuff: 225.438ms
```
### `console.timeLog([label][, ...data])` {#consoletimeloglabel-data}

**Added in: v10.7.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'default'`
- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

[`console.time()`](/ja/nodejs/api/console#consoletimelabel)を呼び出して以前に開始されたタイマーについて、経過時間とその他の`data`引数を`stdout`に出力します。

```js [ESM]
console.time('process');
const value = expensiveProcess1(); // Returns 42
console.timeLog('process', value);
// Prints "process: 365.227ms 42".
doExpensiveProcess2(value);
console.timeEnd('process');
```
### `console.trace([message][, ...args])` {#consoletracemessage-args}

**Added in: v0.1.104**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

文字列 `'Trace: '`、続いて[`util.format()`](/ja/nodejs/api/util#utilformatformat-args)でフォーマットされたメッセージ、およびコード内の現在の位置へのスタックトレースを`stderr`に出力します。

```js [ESM]
console.trace('Show me');
// Prints: (stack trace will vary based on where trace is called)
//  Trace: Show me
//    at repl:2:9
//    at REPLServer.defaultEval (repl.js:248:27)
//    at bound (domain.js:287:14)
//    at REPLServer.runBound [as eval] (domain.js:300:12)
//    at REPLServer.<anonymous> (repl.js:412:12)
//    at emitOne (events.js:82:20)
//    at REPLServer.emit (events.js:169:7)
//    at REPLServer.Interface._onLine (readline.js:210:10)
//    at REPLServer.Interface._line (readline.js:549:8)
//    at REPLServer.Interface._ttyWrite (readline.js:826:14)
```

### `console.warn([data][, ...args])` {#consolewarndata-args}

**追加: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`console.warn()` 関数は、[`console.error()`](/ja/nodejs/api/console#consoleerrordata-args) のエイリアスです。

## インスペクターのみのメソッド {#inspector-only-methods}

以下のメソッドは、一般的な API で V8 エンジンによって公開されていますが、[インスペクター](/ja/nodejs/api/debugger) (`--inspect` フラグ) と組み合わせて使用しない限り、何も表示しません。

### `console.profile([label])` {#consoleprofilelabel}

**追加: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

このメソッドは、インスペクターで使用しない限り何も表示しません。`console.profile()` メソッドは、[`console.profileEnd()`](/ja/nodejs/api/console#consoleprofileendlabel) が呼び出されるまで、オプションのラベル付きで JavaScript CPU プロファイルを起動します。その後、プロファイルはインスペクターの **Profile** パネルに追加されます。

```js [ESM]
console.profile('MyLabel');
// 何らかのコード
console.profileEnd('MyLabel');
// インスペクターの Profiles パネルに 'MyLabel' プロファイルを追加します。
```
### `console.profileEnd([label])` {#consoleprofileendlabel}

**追加: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

このメソッドは、インスペクターで使用しない限り何も表示しません。開始されている場合は、現在の JavaScript CPU プロファイリングセッションを停止し、**Profiles** パネルにレポートを出力します。例については、[`console.profile()`](/ja/nodejs/api/console#consoleprofilelabel) を参照してください。

このメソッドがラベルなしで呼び出された場合、最後に開始されたプロファイルが停止されます。

### `console.timeStamp([label])` {#consoletimestamplabel}

**追加: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

このメソッドは、インスペクターで使用しない限り何も表示しません。`console.timeStamp()` メソッドは、ラベル `'label'` のイベントをインスペクターの **Timeline** パネルに追加します。

