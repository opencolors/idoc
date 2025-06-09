---
title: Node.js ドキュメント - Readline
description: Node.jsのreadlineモジュールは、Readableストリーム（例えばprocess.stdin）から一行ずつデータを読み取るためのインターフェースを提供します。コンソールからの入力読み取り、ユーザー入力を処理し、行ごとの操作を管理するためのインターフェースを作成することをサポートします。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - Readline | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのreadlineモジュールは、Readableストリーム（例えばprocess.stdin）から一行ずつデータを読み取るためのインターフェースを提供します。コンソールからの入力読み取り、ユーザー入力を処理し、行ごとの操作を管理するためのインターフェースを作成することをサポートします。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - Readline | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのreadlineモジュールは、Readableストリーム（例えばprocess.stdin）から一行ずつデータを読み取るためのインターフェースを提供します。コンソールからの入力読み取り、ユーザー入力を処理し、行ごとの操作を管理するためのインターフェースを作成することをサポートします。
---


# Readline {#readline}

::: tip [Stable: 2 - 安定版]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定版: 2](/ja/nodejs/api/documentation#stability-index) - 安定版
:::

**ソースコード:** [lib/readline.js](https://github.com/nodejs/node/blob/v23.5.0/lib/readline.js)

`node:readline`モジュールは、([`process.stdin`](/ja/nodejs/api/process#processstdin)のような)[Readable](/ja/nodejs/api/stream#readable-streams)ストリームからデータを一度に1行ずつ読み取るためのインターフェースを提供します。

PromiseベースのAPIを使用するには:

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
```

```js [CJS]
const readline = require('node:readline/promises');
```
:::

コールバックと同期APIを使用するには:

::: code-group
```js [ESM]
import * as readline from 'node:readline';
```

```js [CJS]
const readline = require('node:readline');
```
:::

次の簡単な例は、`node:readline`モジュールの基本的な使用法を示しています。

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const answer = await rl.question('Node.jsについてどう思いますか？ ');

console.log(`貴重なフィードバックありがとうございます: ${answer}`);

rl.close();
```

```js [CJS]
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('Node.jsについてどう思いますか？ ', (answer) => {
  // TODO: データベースに回答を記録する
  console.log(`貴重なフィードバックありがとうございます: ${answer}`);

  rl.close();
});
```
:::

このコードが呼び出されると、インターフェースは`input`ストリームでデータを受信するのを待機するため、Node.jsアプリケーションは`readline.Interface`が閉じられるまで終了しません。

## クラス: `InterfaceConstructor` {#class-interfaceconstructor}

**追加:** v0.1.104

- 拡張: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

`InterfaceConstructor`クラスのインスタンスは、`readlinePromises.createInterface()`または`readline.createInterface()`メソッドを使用して構築されます。すべてのインスタンスは、単一の`input` [Readable](/ja/nodejs/api/stream#readable-streams)ストリームと単一の`output` [Writable](/ja/nodejs/api/stream#writable-streams)ストリームに関連付けられています。`output`ストリームは、`input`ストリームに到着し、そこから読み取られるユーザー入力のプロンプトを表示するために使用されます。


### イベント: `'close'` {#event-close}

**追加:** v0.1.98

`'close'` イベントは、次のいずれかが発生したときに発生します。

- `rl.close()` メソッドが呼び出され、`InterfaceConstructor` インスタンスが `input` および `output` ストリームの制御を放棄した場合。
- `input` ストリームが `'end'` イベントを受信した場合。
- `input` ストリームが + を受信して、伝送終了 (EOT) を通知した場合。
- `input` ストリームが + を受信して `SIGINT` を通知し、`InterfaceConstructor` インスタンスに登録されている `'SIGINT'` イベントリスナーがない場合。

リスナー関数は、引数を渡さずに呼び出されます。

`InterfaceConstructor` インスタンスは、`'close'` イベントが発生すると完了します。

### イベント: `'line'` {#event-line}

**追加:** v0.1.98

`'line'` イベントは、`input` ストリームが行末入力 (`\n`、`\r`、または `\r\n`) を受信するたびに発生します。 これは通常、ユーザーが  または を押したときに発生します。

`'line'` イベントは、新しいデータがストリームから読み取られ、そのストリームが最終的な行末マーカーなしに終了した場合にも発生します。

リスナー関数は、受信した入力の単一行を含む文字列とともに呼び出されます。

```js [ESM]
rl.on('line', (input) => {
  console.log(`Received: ${input}`);
});
```
### イベント: `'history'` {#event-history}

**追加:** v15.8.0, v14.18.0

`'history'` イベントは、履歴配列が変更されるたびに発生します。

リスナー関数は、履歴配列を含む配列とともに呼び出されます。 これは、`historySize` および `removeHistoryDuplicates` によるすべての変更、追加された行、および削除された行を反映します。

主な目的は、リスナーが履歴を永続化できるようにすることです。 リスナーが履歴オブジェクトを変更することも可能です。 これは、パスワードのように、特定の行が履歴に追加されないようにするのに役立ちます。

```js [ESM]
rl.on('history', (history) => {
  console.log(`Received: ${history}`);
});
```
### イベント: `'pause'` {#event-pause}

**追加:** v0.7.5

`'pause'` イベントは、次のいずれかが発生したときに発生します。

- `input` ストリームが一時停止された場合。
- `input` ストリームが一時停止されておらず、`'SIGCONT'` イベントを受信した場合。（イベント [`'SIGTSTP'`](/ja/nodejs/api/readline#event-sigtstp) および [`'SIGCONT'`](/ja/nodejs/api/readline#event-sigcont) を参照してください。）

リスナー関数は、引数を渡さずに呼び出されます。

```js [ESM]
rl.on('pause', () => {
  console.log('Readline paused.');
});
```

### イベント: `'resume'` {#event-resume}

**追加:** v0.7.5

`'resume'` イベントは、`input` ストリームが再開されるたびに発生します。

リスナー関数は引数を渡されずに呼び出されます。

```js [ESM]
rl.on('resume', () => {
  console.log('Readline resumed.');
});
```
### イベント: `'SIGCONT'` {#event-sigcont}

**追加:** v0.7.5

`'SIGCONT'` イベントは、+（つまり `SIGTSTP`）を使用して以前にバックグラウンドに移動された Node.js プロセスが、[`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p) を使用してフォアグラウンドに戻されたときに発生します。

`input` ストリームが `SIGTSTP` リクエスト *より前* に一時停止されていた場合、このイベントは発生しません。

リスナー関数は、引数を渡されずに呼び出されます。

```js [ESM]
rl.on('SIGCONT', () => {
  // `prompt` は自動的にストリームを再開します
  rl.prompt();
});
```
`'SIGCONT'` イベントは、Windows では *サポートされていません*。

### イベント: `'SIGINT'` {#event-sigint}

**追加:** v0.3.0

`'SIGINT'` イベントは、`input` ストリームが  入力を受信したときに発生します。通常は `SIGINT` として知られています。 `input` ストリームが `SIGINT` を受信したときに登録されている `'SIGINT'` イベントリスナーがない場合、`'pause'` イベントが発生します。

リスナー関数は、引数を渡されずに呼び出されます。

```js [ESM]
rl.on('SIGINT', () => {
  rl.question('Are you sure you want to exit? ', (answer) => {
    if (answer.match(/^y(es)?$/i)) rl.pause();
  });
});
```
### イベント: `'SIGTSTP'` {#event-sigtstp}

**追加:** v0.7.5

`'SIGTSTP'` イベントは、`input` ストリームが + 入力（通常は `SIGTSTP` と呼ばれる）を受信したときに発生します。 `input` ストリームが `SIGTSTP` を受信したときに登録されている `'SIGTSTP'` イベントリスナーがない場合、Node.js プロセスはバックグラウンドに送られます。

プログラムが [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p) を使用して再開されると、`'pause'` イベントと `'SIGCONT'` イベントが発生します。 これらを使用して `input` ストリームを再開できます。

プロセスがバックグラウンドに送られる前に `input` が一時停止されていた場合、`'pause'` イベントと `'SIGCONT'` イベントは発生しません。

リスナー関数は、引数を渡されずに呼び出されます。

```js [ESM]
rl.on('SIGTSTP', () => {
  // これは SIGTSTP を上書きし、プログラムがバックグラウンドに移行するのを防ぎます。
  console.log('Caught SIGTSTP.');
});
```
`'SIGTSTP'` イベントは、Windows では *サポートされていません*。


### `rl.close()` {#rlclose}

**Added in: v0.1.98**

`rl.close()` メソッドは、`InterfaceConstructor` インスタンスを閉じ、`input` および `output` ストリームの制御を放棄します。呼び出されると、`'close'` イベントが発生します。

`rl.close()` を呼び出しても、`InterfaceConstructor` インスタンスから他のイベント（`'line'` を含む）が発生するのが直ちに停止するわけではありません。

### `rl.pause()` {#rlpause}

**Added in: v0.3.4**

`rl.pause()` メソッドは、`input` ストリームを一時停止し、必要に応じて後で再開できるようにします。

`rl.pause()` を呼び出しても、`InterfaceConstructor` インスタンスから他のイベント（`'line'` を含む）が発生するのが直ちに一時停止するわけではありません。

### `rl.prompt([preserveCursor])` {#rlpromptpreservecursor}

**Added in: v0.1.98**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、カーソルの位置が `0` にリセットされるのを防ぎます。

`rl.prompt()` メソッドは、ユーザーが新しい入力を提供できる場所を提供するために、`InterfaceConstructor` インスタンスの設定済みの `prompt` を `output` の新しい行に書き込みます。

呼び出されると、`rl.prompt()` は、`input` ストリームが一時停止されている場合に再開します。

`InterfaceConstructor` が `output` を `null` または `undefined` に設定して作成された場合、プロンプトは書き込まれません。

### `rl.resume()` {#rlresume}

**Added in: v0.3.4**

`rl.resume()` メソッドは、`input` ストリームが一時停止されている場合に再開します。

### `rl.setPrompt(prompt)` {#rlsetpromptprompt}

**Added in: v0.1.98**

- `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`rl.setPrompt()` メソッドは、`rl.prompt()` が呼び出されるたびに `output` に書き込まれるプロンプトを設定します。

### `rl.getPrompt()` {#rlgetprompt}

**Added in: v15.3.0, v14.17.0**

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 現在のプロンプト文字列

`rl.getPrompt()` メソッドは、`rl.prompt()` で使用される現在のプロンプトを返します。

### `rl.write(data[, key])` {#rlwritedata-key}

**Added in: v0.1.98**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ctrl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) キーを示す場合は `true` です。
    - `meta` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) キーを示す場合は `true` です。
    - `shift` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) キーを示す場合は `true` です。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) キーの名前。

`rl.write()` メソッドは、`data` または `key` で識別されるキーシーケンスを `output` に書き込みます。`key` 引数は、`output` が [TTY](/ja/nodejs/api/tty) テキストターミナルの場合にのみサポートされます。キーの組み合わせのリストについては、[TTY キーバインド](/ja/nodejs/api/readline#tty-keybindings) を参照してください。

`key` が指定されている場合、`data` は無視されます。

呼び出されると、`rl.write()` は、`input` ストリームが一時停止されている場合に再開します。

`InterfaceConstructor` が `output` を `null` または `undefined` に設定して作成された場合、`data` および `key` は書き込まれません。

```js [ESM]
rl.write('Delete this!');
// Simulate Ctrl+U to delete the line written previously
rl.write(null, { ctrl: true, name: 'u' });
```

`rl.write()` メソッドは、`readline` `Interface` の `input` に、*ユーザーから提供されたかのように* データを書き込みます。


### `rl[Symbol.asyncIterator]()` {#rlsymbolasynciterator}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v11.14.0, v10.17.0 | Symbol.asyncIterator のサポートは実験的ではなくなりました。 |
| v11.4.0, v10.16.0 | 追加: v11.4.0, v10.16.0 |
:::

- 戻り値: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)

入力ストリーム内の各行を文字列として反復処理する `AsyncIterator` オブジェクトを作成します。 このメソッドを使用すると、`for await...of` ループを介して `InterfaceConstructor` オブジェクトを非同期で反復処理できます。

入力ストリームのエラーは転送されません。

ループが `break`、`throw`、または `return` で終了した場合、[`rl.close()`](/ja/nodejs/api/readline#rlclose) が呼び出されます。 言い換えれば、`InterfaceConstructor` を反復処理すると、常に入力ストリームが完全に消費されます。

パフォーマンスは、従来の `'line'` イベント API と同等ではありません。 パフォーマンスが重要なアプリケーションでは、代わりに `'line'` を使用してください。

```js [ESM]
async function processLineByLine() {
  const rl = readline.createInterface({
    // ...
  });

  for await (const line of rl) {
    // readline 入力の各行は、ここで `line` として連続して利用可能になります。
  }
}
```
`readline.createInterface()` は、呼び出されると入力ストリームの消費を開始します。 インターフェースの作成と非同期反復の間に非同期操作があると、行が失われる可能性があります。

### `rl.line` {#rlline}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.8.0, v14.18.0 | 値は常に文字列になり、undefined になることはありません。 |
| v0.1.98 | 追加: v0.1.98 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

node によって処理されている現在の入力データ。

これは、TTY ストリームから入力を収集するときに、`line` イベントが発生する前に、これまでに処理された現在の値を取得するために使用できます。 `line` イベントが発生すると、このプロパティは空の文字列になります。

インスタンスの実行中に値を変更すると、`rl.cursor` も制御されていない場合、意図しない結果が生じる可能性があることに注意してください。

**入力に TTY ストリームを使用しない場合は、<a href="#event-line"><code>'line'</code></a> イベントを使用してください。**

考えられるユースケースの 1 つは次のとおりです。

```js [ESM]
const values = ['lorem ipsum', 'dolor sit amet'];
const rl = readline.createInterface(process.stdin);
const showResults = debounce(() => {
  console.log(
    '\n',
    values.filter((val) => val.startsWith(rl.line)).join(' '),
  );
}, 300);
process.stdin.on('keypress', (c, k) => {
  showResults();
});
```

### `rl.cursor` {#rlcursor}

**Added in: v0.1.98**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`rl.line` に対するカーソルの位置です。

これは、TTYストリームから入力を読み込む際に、現在のカーソルが入力文字列のどこにあるかを追跡します。カーソルの位置によって、入力処理中に変更される入力文字列の部分と、ターミナルのキャレットがレンダリングされる列が決まります。

### `rl.getCursorPos()` {#rlgetcursorpos}

**Added in: v13.5.0, v12.16.0**

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `rows` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カーソルが現在あるプロンプトの行
    - `cols` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カーソルが現在ある画面の列
  
 

入力プロンプト + 文字列に対するカーソルの実際の位置を返します。長い入力（折り返し）文字列や、複数行のプロンプトも計算に含まれます。

## Promises API {#promises-api}

**Added in: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

### Class: `readlinePromises.Interface` {#class-readlinepromisesinterface}

**Added in: v17.0.0**

- 拡張: [\<readline.InterfaceConstructor\>](/ja/nodejs/api/readline#class-interfaceconstructor)

`readlinePromises.Interface` クラスのインスタンスは、`readlinePromises.createInterface()` メソッドを使用して構築されます。すべてのインスタンスは、単一の `input` [Readable](/ja/nodejs/api/stream#readable-streams) ストリームと単一の `output` [Writable](/ja/nodejs/api/stream#writable-streams) ストリームに関連付けられています。`output` ストリームは、`input` ストリームに到着し、そこから読み取られるユーザー入力のプロンプトを表示するために使用されます。


#### `rl.question(query[, options])` {#rlquestionquery-options}

**Added in: v17.0.0**

- `query` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `output` に書き込むステートメントまたはクエリで、プロンプトの前に付加されます。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) オプションで、`AbortSignal` を使用して `question()` をキャンセルできます。
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) `query` への応答としてユーザーの入力で満たされる Promise。

`rl.question()` メソッドは、`query` を `output` に書き込むことによって表示し、`input` でのユーザー入力の提供を待ってから、提供された入力を最初の引数として渡して `callback` 関数を呼び出します。

呼び出されると、`rl.question()` は、`input` ストリームが一時停止されている場合、それを再開します。

`readlinePromises.Interface` が `output` を `null` または `undefined` に設定して作成された場合、`query` は書き込まれません。

質問が `rl.close()` の後に呼び出された場合、拒否された Promise を返します。

使用例:

```js [ESM]
const answer = await rl.question('好きな食べ物は何ですか？ ');
console.log(`ああ、あなたの好きな食べ物は ${answer} なのですね`);
```
`AbortSignal` を使用して質問をキャンセルします。

```js [ESM]
const signal = AbortSignal.timeout(10_000);

signal.addEventListener('abort', () => {
  console.log('食べ物の質問はタイムアウトしました');
}, { once: true });

const answer = await rl.question('好きな食べ物は何ですか？ ', { signal });
console.log(`ああ、あなたの好きな食べ物は ${answer} なのですね`);
```
### Class: `readlinePromises.Readline` {#class-readlinepromisesreadline}

**Added in: v17.0.0**

#### `new readlinePromises.Readline(stream[, options])` {#new-readlinepromisesreadlinestream-options}

**Added in: v17.0.0**

- `stream` [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable) [TTY](/ja/nodejs/api/tty) ストリーム。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `autoCommit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`rl.commit()` を呼び出す必要はありません。
  
 


#### `rl.clearLine(dir)` {#rlclearlinedir}

**Added in: v17.0.0**

- `dir` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: カーソルから左
    - `1`: カーソルから右
    - `0`: 行全体
  
 
- 戻り値: this

`rl.clearLine()` メソッドは、`dir` で指定された方向に、関連付けられた `stream` の現在の行をクリアするアクションを、保留中のアクションの内部リストに追加します。`autoCommit: true` がコンストラクターに渡されない限り、このメソッドの効果を確認するには `rl.commit()` を呼び出してください。

#### `rl.clearScreenDown()` {#rlclearscreendown}

**Added in: v17.0.0**

- 戻り値: this

`rl.clearScreenDown()` メソッドは、関連付けられたストリームをカーソルの現在の位置から下方向にクリアするアクションを、保留中のアクションの内部リストに追加します。`autoCommit: true` がコンストラクターに渡されない限り、このメソッドの効果を確認するには `rl.commit()` を呼び出してください。

#### `rl.commit()` {#rlcommit}

**Added in: v17.0.0**

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

`rl.commit()` メソッドは、保留中のすべてのアクションを関連付けられた `stream` に送信し、保留中のアクションの内部リストをクリアします。

#### `rl.cursorTo(x[, y])` {#rlcursortox-y}

**Added in: v17.0.0**

- `x` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 戻り値: this

`rl.cursorTo()` メソッドは、関連付けられた `stream` 内の指定された位置にカーソルを移動するアクションを、保留中のアクションの内部リストに追加します。`autoCommit: true` がコンストラクターに渡されない限り、このメソッドの効果を確認するには `rl.commit()` を呼び出してください。

#### `rl.moveCursor(dx, dy)` {#rlmovecursordx-dy}

**Added in: v17.0.0**

- `dx` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 戻り値: this

`rl.moveCursor()` メソッドは、関連付けられた `stream` 内の現在の位置を*基準*にしてカーソルを移動するアクションを、保留中のアクションの内部リストに追加します。`autoCommit: true` がコンストラクターに渡されない限り、このメソッドの効果を確認するには `rl.commit()` を呼び出してください。


#### `rl.rollback()` {#rlrollback}

**Added in: v17.0.0**

- 戻り値: this

`rl.rollback` メソッドは、関連付けられた `stream` に送信せずに、保留中のアクションの内部リストをクリアします。

### `readlinePromises.createInterface(options)` {#readlinepromisescreateinterfaceoptions}

**Added in: v17.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable) 監視する [Readable](/ja/nodejs/api/stream#readable-streams) ストリーム。 このオプションは*必須*です。
    - `output` [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable) readline データを書き込む [Writable](/ja/nodejs/api/stream#writable-streams) ストリーム。
    - `completer` [\<Function\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function) Tab オートコンプリートに使用されるオプションの関数。
    - `terminal` [\<boolean\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Boolean_type) `input` および `output` ストリームを TTY として扱い、ANSI/VT100 エスケープコードを書き込む必要がある場合は `true`。 **デフォルト:** インスタンス化時に `output` ストリームで `isTTY` をチェックします。
    - `history` [\<string[]\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#String_type) 履歴行の初期リスト。 このオプションは、ユーザーまたは内部 `output` チェックによって `terminal` が `true` に設定されている場合にのみ意味があります。そうでない場合、履歴キャッシュメカニズムはまったく初期化されません。 **デフォルト:** `[]`。
    - `historySize` [\<number\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type) 保持される履歴行の最大数。 履歴を無効にするには、この値を `0` に設定します。 このオプションは、ユーザーまたは内部 `output` チェックによって `terminal` が `true` に設定されている場合にのみ意味があります。そうでない場合、履歴キャッシュメカニズムはまったく初期化されません。 **デフォルト:** `30`。
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、履歴リストに追加された新しい入力行が古い行と重複すると、古い行がリストから削除されます。 **デフォルト:** `false`。
    - `prompt` [\<string\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#String_type) 使用するプロンプト文字列。 **デフォルト:** `'\> '`。
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type) `\r` と `\n` の間の遅延が `crlfDelay` ミリ秒を超えると、`\r` と `\n` の両方が個別の行末入力として扱われます。 `crlfDelay` は `100` 以上の数値に強制的に変換されます。 `Infinity` に設定すると、`\r` の後に `\n` が続く場合、常に単一の改行と見なされます（これは、`\r\n` 行区切り文字で [ファイルを読み取る](/ja/nodejs/api/readline#example-read-file-stream-line-by-line) 場合に適切です）。 **デフォルト:** `100`。
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type) あいまいなキーシーケンス（これまでに読み取った入力を利用して完全なキーシーケンスを形成でき、追加の入力を受け入れてより長いキーシーケンスを完成させることができるもの）をミリ秒単位で読み取る際に、`readlinePromises` が文字を待機する時間。 **デフォルト:** `500`。
    - `tabSize` [\<integer\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type) タブが等しいスペースの数（最小 1）。 **デフォルト:** `8`。
  
 
- 戻り値: [\<readlinePromises.Interface\>](/ja/nodejs/api/readline#class-readlinepromisesinterface)

`readlinePromises.createInterface()` メソッドは、新しい `readlinePromises.Interface` インスタンスを作成します。

::: code-group
```js [ESM]
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline/promises');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

`readlinePromises.Interface` インスタンスが作成されると、最も一般的なケースは `'line'` イベントをリッスンすることです。

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
このインスタンスで `terminal` が `true` の場合、`output` ストリームは、`output.columns` プロパティを定義し、列が変更された場合（または変更された場合）に `output` で `'resize'` イベントを発生させると、最適な互換性が得られます（[`process.stdout`](/ja/nodejs/api/process#processstdout) は、TTY の場合にこれを自動的に行います）。


#### `completer` 関数の使用 {#use-of-the-completer-function}

`completer` 関数は、ユーザーが入力した現在の行を引数として受け取り、2つのエントリを持つ `Array` を返します。

- 補完に一致するエントリを持つ `Array`。
- 一致に使用された部分文字列。

例えば： `[[substr1, substr2, ...], originalsubstring]`。

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // 一致するものが見つからない場合は、すべての補完を表示する
  return [hits.length ? hits : completions, line];
}
```
`completer` 関数は、[\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) を返すことも、非同期にすることもできます。

```js [ESM]
async function completer(linePartial) {
  await someAsyncWork();
  return [['123'], linePartial];
}
```
## コールバック API {#callback-api}

**追加: v0.1.104**

### クラス: `readline.Interface` {#class-readlineinterface}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v17.0.0 | クラス `readline.Interface` が `Interface` を継承するようになりました。 |
| v0.1.104 | 追加: v0.1.104 |
:::

- 拡張: [\<readline.InterfaceConstructor\>](/ja/nodejs/api/readline#class-interfaceconstructor)

`readline.Interface` クラスのインスタンスは、`readline.createInterface()` メソッドを使用して構築されます。すべてのインスタンスは、単一の `input` [Readable](/ja/nodejs/api/stream#readable-streams) ストリームと単一の `output` [Writable](/ja/nodejs/api/stream#writable-streams) ストリームに関連付けられています。 `output` ストリームは、`input` ストリームに到着し、そこから読み取られるユーザー入力のプロンプトを表示するために使用されます。

#### `rl.question(query[, options], callback)` {#rlquestionquery-options-callback}

**追加: v0.3.3**

- `query` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `output` に書き込むステートメントまたはクエリで、プロンプトの前に付加されます。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) オプションで、`AbortController` を使用して `question()` をキャンセルできます。


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `query` への応答としてユーザーの入力を引数として呼び出されるコールバック関数。

`rl.question()` メソッドは、`output` に書き込むことによって `query` を表示し、`input` でユーザーからの入力が提供されるのを待ってから、提供された入力を最初の引数として渡して `callback` 関数を呼び出します。

呼び出されると、`rl.question()` は、一時停止されている場合は `input` ストリームを再開します。

`readline.Interface` が `output` を `null` または `undefined` に設定して作成された場合、`query` は書き込まれません。

`rl.question()` に渡される `callback` 関数は、最初のエラーオブジェクトまたは `null` を最初引数として受け入れるという典型的なパターンに従いません。 `callback` は、提供された答えのみを引数として呼び出されます。

`rl.close()` の後に `rl.question()` を呼び出すと、エラーがスローされます。

使用例：

```js [ESM]
rl.question('好きな食べ物は何ですか？ ', (answer) => {
  console.log(`ああ、あなたの好きな食べ物は ${answer} ですね`);
});
```
`AbortController` を使用して質問をキャンセルします。

```js [ESM]
const ac = new AbortController();
const signal = ac.signal;

rl.question('好きな食べ物は何ですか？ ', { signal }, (answer) => {
  console.log(`ああ、あなたの好きな食べ物は ${answer} ですね`);
});

signal.addEventListener('abort', () => {
  console.log('食べ物の質問はタイムアウトしました');
}, { once: true });

setTimeout(() => ac.abort(), 10000);
```

### `readline.clearLine(stream, dir[, callback])` {#readlineclearlinestream-dir-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v12.7.0 | ストリームの write() コールバックと戻り値が公開されました。 |
| v0.7.7 | 追加: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable)
- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: カーソルの左側
    - `1`: カーソルの右側
    - `0`: 行全体


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作が完了すると呼び出されます。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 追加のデータを書き込む前に、呼び出し元のコードが `'drain'` イベントが発行されるのを待つことを `stream` が望む場合は `false`。そうでない場合は `true`。

`readline.clearLine()` メソッドは、`dir` で識別される指定された方向に、指定された [TTY](/ja/nodejs/api/tty) ストリームの現在の行をクリアします。

### `readline.clearScreenDown(stream[, callback])` {#readlineclearscreendownstream-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` ではなく `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v12.7.0 | ストリームの write() コールバックと戻り値が公開されました。 |
| v0.7.7 | 追加: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作が完了すると呼び出されます。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 追加のデータを書き込む前に、呼び出し元のコードが `'drain'` イベントが発行されるのを待つことを `stream` が望む場合は `false`。そうでない場合は `true`。

`readline.clearScreenDown()` メソッドは、カーソルの現在位置から下の指定された [TTY](/ja/nodejs/api/tty) ストリームをクリアします。


### `readline.createInterface(options)` {#readlinecreateinterfaceoptions}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.14.0, v14.18.0 | `signal` オプションがサポートされるようになりました。 |
| v15.8.0, v14.18.0 | `history` オプションがサポートされるようになりました。 |
| v13.9.0 | `tabSize` オプションがサポートされるようになりました。 |
| v8.3.0, v6.11.4 | `crlfDelay` オプションの最大制限を削除しました。 |
| v6.6.0 | `crlfDelay` オプションがサポートされるようになりました。 |
| v6.3.0 | `prompt` オプションがサポートされるようになりました。 |
| v6.0.0 | `historySize` オプションに `0` を指定できるようになりました。 |
| v0.1.98 | Added in: v0.1.98 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable) 監視する [Readable](/ja/nodejs/api/stream#readable-streams) ストリーム。 このオプションは *必須* です。
    - `output` [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable) readline データを書き込む [Writable](/ja/nodejs/api/stream#writable-streams) ストリーム。
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Tab キーによる自動補完に使用されるオプションの関数。
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `input` および `output` ストリームを TTY のように扱い、ANSI/VT100 エスケープコードを書き込む場合は `true`。 **デフォルト:** インスタンス化時に `output` ストリームで `isTTY` を確認します。
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 履歴行の初期リスト。 このオプションは、ユーザーまたは内部 `output` チェックによって `terminal` が `true` に設定されている場合にのみ意味があります。そうでない場合、履歴キャッシュメカニズムはまったく初期化されません。 **デフォルト:** `[]`。
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 保持される履歴行の最大数。 履歴を無効にするには、この値を `0` に設定します。 このオプションは、ユーザーまたは内部 `output` チェックによって `terminal` が `true` に設定されている場合にのみ意味があります。そうでない場合、履歴キャッシュメカニズムはまったく初期化されません。 **デフォルト:** `30`。
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、履歴リストに追加された新しい入力行が古い行と重複している場合、古い行がリストから削除されます。 **デフォルト:** `false`。
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 使用するプロンプト文字列。 **デフォルト:** `'\> '`。
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `\r` と `\n` の間の遅延が `crlfDelay` ミリ秒を超えると、`\r` と `\n` の両方が個別の行末入力として扱われます。 `crlfDelay` は、`100` 以上の数値に強制変換されます。 `Infinity` に設定することもできます。その場合、`\r` の後に `\n` が続く場合は常に単一の改行と見なされます (これは、`\r\n` 行区切り文字を使用して [ファイルを読み取る](/ja/nodejs/api/readline#example-read-file-stream-line-by-line) 場合に適切です)。 **デフォルト:** `100`。
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `readline` が文字を待機する期間 (曖昧なキーシーケンスをミリ秒単位で読み取る場合。これは、これまで読み取った入力を使用して完全なキーシーケンスを形成でき、追加の入力を受け入れてより長いキーシーケンスを完了できます)。 **デフォルト:** `500`。
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) タブが等しいスペースの数 (最小 1)。 **デフォルト:** `8`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) AbortSignal を使用してインターフェースを閉じることができます。 シグナルを中止すると、インターフェースで内部的に `close` が呼び出されます。
  
 
- 戻り値: [\<readline.Interface\>](/ja/nodejs/api/readline#class-readlineinterface)

`readline.createInterface()` メソッドは、新しい `readline.Interface` インスタンスを作成します。

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

`readline.Interface` インスタンスが作成されたら、最も一般的なケースは `'line'` イベントをリッスンすることです。

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
このインスタンスで `terminal` が `true` の場合、`output` ストリームは、`output.columns` プロパティを定義し、列が変更された場合 (または変更された場合) に `output` で `'resize'` イベントを発行する場合、最適な互換性が得られます ([`process.stdout`](/ja/nodejs/api/process#processstdout) は、TTY の場合にこれを自動的に行います)。

`stdin` を入力として使用して `readline.Interface` を作成する場合、プログラムは [EOF 文字](https://en.wikipedia.org/wiki/End-of-file#EOF_character) を受信するまで終了しません。 ユーザー入力を待たずに終了するには、`process.stdin.unref()` を呼び出します。


#### `completer` 関数の使用 {#use-of-the-completer-function_1}

`completer` 関数は、ユーザーが入力した現在の行を引数として受け取り、2つのエントリを持つ `Array` を返します。

- 補完の一致するエントリを持つ `Array`。
- マッチングに使用された部分文字列。

例えば: `[[substr1, substr2, ...], originalsubstring]`。

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // 一致するものが見つからない場合は、すべての補完候補を表示します
  return [hits.length ? hits : completions, line];
}
```
`completer` 関数は、2つの引数を受け取る場合、非同期的に呼び出すことができます。

```js [ESM]
function completer(linePartial, callback) {
  callback(null, [['123'], linePartial]);
}
```
### `readline.cursorTo(stream, x[, y][, callback])` {#readlinecursortostream-x-y-callback}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` の代わりに `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v12.7.0 | ストリームの write() コールバックと戻り値が公開されました。 |
| v0.7.7 | v0.7.7 で追加されました。 |
:::

- `stream` [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable)
- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作が完了すると呼び出されます。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `stream` が追加のデータを書き込む前に、呼び出し元のコードが `'drain'` イベントが発行されるのを待つことを希望する場合は `false`。それ以外の場合は `true`。

`readline.cursorTo()` メソッドは、指定された [TTY](/ja/nodejs/api/tty) `stream` 内の指定された位置にカーソルを移動します。

### `readline.moveCursor(stream, dx, dy[, callback])` {#readlinemovecursorstream-dx-dy-callback}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | `callback` 引数に無効なコールバックを渡すと、`ERR_INVALID_CALLBACK` の代わりに `ERR_INVALID_ARG_TYPE` がスローされるようになりました。 |
| v12.7.0 | ストリームの write() コールバックと戻り値が公開されました。 |
| v0.7.7 | v0.7.7 で追加されました。 |
:::

- `stream` [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable)
- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 操作が完了すると呼び出されます。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `stream` が追加のデータを書き込む前に、呼び出し元のコードが `'drain'` イベントが発行されるのを待つことを希望する場合は `false`。それ以外の場合は `true`。

`readline.moveCursor()` メソッドは、指定された [TTY](/ja/nodejs/api/tty) `stream` 内の現在の位置を*基準*にしてカーソルを移動します。


## `readline.emitKeypressEvents(stream[, interface])` {#readlineemitkeypresseventsstream-interface}

**Added in: v0.7.7**

- `stream` [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable)
- `interface` [\<readline.InterfaceConstructor\>](/ja/nodejs/api/readline#class-interfaceconstructor)

`readline.emitKeypressEvents()` メソッドは、指定された [Readable](/ja/nodejs/api/stream#readable-streams) ストリームに対し、受信した入力に対応する `'keypress'` イベントの発行を開始させます。

オプションで、`interface` は、コピー＆ペーストされた入力が検出されたときに自動補完が無効になる `readline.Interface` インスタンスを指定します。

`stream` が [TTY](/ja/nodejs/api/tty) の場合、raw モードである必要があります。

これは、`input` がターミナルである場合、すべての readline インスタンスによって `input` 上で自動的に呼び出されます。`readline` インスタンスを閉じても、`input` からの `'keypress'` イベントの発行は停止しません。

```js [ESM]
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
```
## 例: Tiny CLI {#example-tiny-cli}

次の例は、`readline.Interface` クラスを使用して小さなコマンドラインインターフェースを実装する方法を示しています。

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { exit, stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  exit(0);
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
```
:::


## 例: ファイルストリームを1行ずつ読み込む {#example-read-file-stream-line-by-line}

`readline`の一般的なユースケースは、入力ファイルを一度に1行ずつ消費することです。最も簡単な方法は、[`fs.ReadStream`](/ja/nodejs/api/fs#class-fsreadstream) APIと`for await...of`ループを活用することです。

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // 注: crlfDelayオプションを使用して、input.txt内のCR LF ('\r\n')のすべてのインスタンスを単一行の改行として認識します。

  for await (const line of rl) {
    // input.txtの各行は、ここで`line`として連続して利用可能になります。
    console.log(`ファイルからの行: ${line}`);
  }
}

processLineByLine();
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // 注: crlfDelayオプションを使用して、input.txt内のCR LF ('\r\n')のすべてのインスタンスを単一行の改行として認識します。

  for await (const line of rl) {
    // input.txtの各行は、ここで`line`として連続して利用可能になります。
    console.log(`ファイルからの行: ${line}`);
  }
}

processLineByLine();
```
:::

あるいは、[`'line'`](/ja/nodejs/api/readline#event-line)イベントを使用することもできます。

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`ファイルからの行: ${line}`);
});
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`ファイルからの行: ${line}`);
});
```
:::

現在、`for await...of`ループは少し遅くなる可能性があります。`async` / `await`フローと速度の両方が重要な場合は、混合アプローチを適用できます。

::: code-group
```js [ESM]
import { once } from 'node:events';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // 行を処理します。
    });

    await once(rl, 'close');

    console.log('ファイル処理済み。');
  } catch (err) {
    console.error(err);
  }
})();
```

```js [CJS]
const { once } = require('node:events');
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // 行を処理します。
    });

    await once(rl, 'close');

    console.log('ファイル処理済み。');
  } catch (err) {
    console.error(err);
  }
})();
```
:::


## TTY キーバインディング {#tty-keybindings}

| キーバインディング | 説明 | 注釈 |
| --- | --- | --- |
|   +    +   | 行の左側を削除 | Linux、Mac、Windows では動作しません |
|   +    +   | 行の右側を削除 | Mac では動作しません |
|   +   | `SIGINT` を送信するか、readline インスタンスを閉じます ||
|   +   | 左を削除 ||
|   +   | 右を削除するか、現在の行が空/EOF の場合は readline インスタンスを閉じます | Windows では動作しません |
|   +   | 現在の位置から行の先頭まで削除 ||
|   +   | 現在の位置から行の末尾まで削除 ||
|   +   | 以前に削除したテキストをヤンク (リコール) します |     +     または     +   で削除されたテキストでのみ動作します |
|   +   | 以前に削除したテキストを順番に切り替えます | 最後のキーストロークが     +     または     +   の場合にのみ利用可能です |
|   +   | 行の先頭に移動 ||
|   +   | 行の末尾に移動 ||
|   +   | 1 文字戻る ||
|   +   | 1 文字進む ||
|   +   | 画面をクリア ||
|   +   | 次の履歴項目 ||
|   +   | 前の履歴項目 ||
|   +   | 前の変更を元に戻す | キーコード `0x1F` を送信するキーストロークはすべてこのアクションを実行します。 たとえば、多くのターミナル (例: `xterm`) では、これは     +    にバインドされています。 |
|   +   | 前の変更をやり直す | 多くのターミナルにはデフォルトのやり直しキーストロークがありません。 やり直しを実行するためにキーコード `0x1E` を選択します。 `xterm` では、デフォルトで     +         にバインドされています。 |
|   +   | 実行中のプロセスをバックグラウンドに移動します。 `fg` と入力して          を押すと、戻ります。 | Windows では動作しません |
|   +     または         +   | 単語境界まで後方に削除 |   +     Linux、Mac、Windows では動作しません |
|   +   | 単語境界まで前方に削除 | Mac では動作しません |
|   +     または         +   | 左へ単語移動 |   +     Mac では動作しません |
|   +     または         +   | 右へ単語移動 |   +     Mac では動作しません |
|   +     または         +   | 右側の単語を削除 |   +     Windows では動作しません |
|   +   | 左側の単語を削除 | Mac では動作しません |

