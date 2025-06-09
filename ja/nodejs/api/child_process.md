---
title: Node.js ドキュメント - 子プロセス
description: Node.jsのドキュメントで、子プロセスの生成、ライフサイクル管理、プロセス間通信の処理方法を詳述しています。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - 子プロセス | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのドキュメントで、子プロセスの生成、ライフサイクル管理、プロセス間通信の処理方法を詳述しています。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - 子プロセス | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのドキュメントで、子プロセスの生成、ライフサイクル管理、プロセス間通信の処理方法を詳述しています。
---


# 子プロセス {#child-process}

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/child_process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/child_process.js)

`node:child_process`モジュールは、[`popen(3)`](http://man7.org/linux/man-pages/man3/popen.3)と同様だが同一ではない方法で、サブプロセスを生成する機能を提供します。この機能は、主に[`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options)関数によって提供されます。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

デフォルトでは、`stdin`、`stdout`、および`stderr`のパイプは、親Node.jsプロセスと生成されたサブプロセスの間に確立されます。これらのパイプには、制限された（プラットフォーム固有の）容量があります。サブプロセスが出力をキャプチャせずにその制限を超えてstdoutに書き込むと、サブプロセスはパイプバッファがより多くのデータを受け入れるのを待ってブロックされます。これは、シェルにおけるパイプの動作と同じです。出力が消費されない場合は、`{ stdio: 'ignore' }`オプションを使用してください。

コマンドの検索は、`options`オブジェクトに`env`がある場合、`options.env.PATH`環境変数を使用して実行されます。それ以外の場合は、`process.env.PATH`が使用されます。`options.env`が`PATH`なしで設定されている場合、Unixでの検索は`/usr/bin:/bin`のデフォルトの検索パス検索で実行されます（execvpe/execvpについては、オペレーティングシステムのマニュアルを参照してください）。Windowsでは、現在のプロセス環境変数`PATH`が使用されます。

Windowsでは、環境変数は大文字と小文字を区別しません。Node.jsは`env`キーを字句的にソートし、大文字と小文字を区別せずに一致する最初のキーを使用します。最初の（辞書式順序で）エントリのみがサブプロセスに渡されます。これにより、`PATH`や`Path`など、同じキーの複数のバリアントを持つオブジェクトを`env`オプションに渡す場合に、Windowsで問題が発生する可能性があります。

[`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options)メソッドは、Node.jsイベントループをブロックせずに、子プロセスを非同期的に生成します。[`child_process.spawnSync()`](/ja/nodejs/api/child_process#child_processspawnsynccommand-args-options)関数は、生成されたプロセスが終了するか終了するまでイベントループをブロックする同期的な方法で、同等の機能を提供します。

便宜上、`node:child_process`モジュールは、[`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options)および[`child_process.spawnSync()`](/ja/nodejs/api/child_process#child_processspawnsynccommand-args-options)に対するいくつかの同期および非同期の代替手段を提供します。これらの代替手段は、[`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options)または[`child_process.spawnSync()`](/ja/nodejs/api/child_process#child_processspawnsynccommand-args-options)の上に実装されています。

- [`child_process.exec()`](/ja/nodejs/api/child_process#child_processexeccommand-options-callback): シェルを生成し、そのシェル内でコマンドを実行し、完了時に`stdout`と`stderr`をコールバック関数に渡します。
- [`child_process.execFile()`](/ja/nodejs/api/child_process#child_processexecfilefile-args-options-callback): [`child_process.exec()`](/ja/nodejs/api/child_process#child_processexeccommand-options-callback)に似ていますが、デフォルトでは最初にシェルを生成せずにコマンドを直接生成点が異なります。
- [`child_process.fork()`](/ja/nodejs/api/child_process#child_processforkmodulepath-args-options): 新しいNode.jsプロセスを生成し、親と子の間でメッセージを送信できるように確立されたIPC通信チャネルを使用して、指定されたモジュールを呼び出します。
- [`child_process.execSync()`](/ja/nodejs/api/child_process#child_processexecsynccommand-options): Node.jsイベントループをブロックする[`child_process.exec()`](/ja/nodejs/api/child_process#child_processexeccommand-options-callback)の同期バージョン。
- [`child_process.execFileSync()`](/ja/nodejs/api/child_process#child_processexecfilesyncfile-args-options): Node.jsイベントループをブロックする[`child_process.execFile()`](/ja/nodejs/api/child_process#child_processexecfilefile-args-options-callback)の同期バージョン。

シェルスクリプトの自動化など、特定のユースケースでは、[同期的な対応物](/ja/nodejs/api/child_process#synchronous-process-creation)の方が便利な場合があります。ただし、多くの場合、同期メソッドは、生成されたプロセスが完了するまでイベントループを停止させるため、パフォーマンスに大きな影響を与える可能性があります。


## 非同期プロセス作成 {#asynchronous-process-creation}

[`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.fork()`](/ja/nodejs/api/child_process#child_processforkmodulepath-args-options), [`child_process.exec()`](/ja/nodejs/api/child_process#child_processexeccommand-options-callback), および [`child_process.execFile()`](/ja/nodejs/api/child_process#child_processexecfilefile-args-options-callback) メソッドはすべて、他の Node.js API に典型的な慣用的な非同期プログラミングパターンに従います。

各メソッドは、[`ChildProcess`](/ja/nodejs/api/child_process#class-childprocess) インスタンスを返します。これらのオブジェクトは、Node.js の [`EventEmitter`](/ja/nodejs/api/events#class-eventemitter) API を実装しており、親プロセスは、子プロセスのライフサイクル中に特定のイベントが発生したときに呼び出されるリスナー関数を登録できます。

[`child_process.exec()`](/ja/nodejs/api/child_process#child_processexeccommand-options-callback) および [`child_process.execFile()`](/ja/nodejs/api/child_process#child_processexecfilefile-args-options-callback) メソッドでは、子プロセスが終了したときに呼び出されるオプションの `callback` 関数を指定することもできます。

### Windows での `.bat` および `.cmd` ファイルの起動 {#spawning-bat-and-cmd-files-on-windows}

[`child_process.exec()`](/ja/nodejs/api/child_process#child_processexeccommand-options-callback) と [`child_process.execFile()`](/ja/nodejs/api/child_process#child_processexecfilefile-args-options-callback) の区別の重要性は、プラットフォームによって異なる場合があります。Unix 系のオペレーティングシステム (Unix、Linux、macOS) では、[`child_process.execFile()`](/ja/nodejs/api/child_process#child_processexecfilefile-args-options-callback) はデフォルトでシェルを起動しないため、より効率的です。ただし、Windows では、`.bat` および `.cmd` ファイルはターミナルなしでは単独で実行できないため、[`child_process.execFile()`](/ja/nodejs/api/child_process#child_processexecfilefile-args-options-callback) を使用して起動することはできません。Windows で実行する場合、`.bat` および `.cmd` ファイルは、`shell` オプションが設定された [`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options) を使用するか、[`child_process.exec()`](/ja/nodejs/api/child_process#child_processexeccommand-options-callback) を使用するか、または `cmd.exe` を起動して `.bat` または `.cmd` ファイルを引数として渡すことによって呼び出すことができます (これが `shell` オプションと [`child_process.exec()`](/ja/nodejs/api/child_process#child_processexeccommand-options-callback) が行うことです)。いずれにせよ、スクリプトのファイル名にスペースが含まれている場合は、引用符で囲む必要があります。

::: code-group
```js [CJS]
// OR...
const { exec, spawn } = require('node:child_process');

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script with spaces in the filename:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```

```js [ESM]
// OR...
import { exec, spawn } from 'node:child_process';

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script with spaces in the filename:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```
:::


### `child_process.exec(command[, options][, callback])` {#child_processexeccommand-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.4.0 | AbortSignal のサポートが追加されました。 |
| v16.4.0, v14.18.0 | `cwd` オプションは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v8.8.0 | `windowsHide` オプションがサポートされるようになりました。 |
| v0.1.90 | 追加: v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 実行するコマンド。引数はスペースで区切ります。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) 子プロセスの現在のワーキングディレクトリ。**デフォルト:** `process.cwd()`。
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 環境キーと値のペア。**デフォルト:** `process.env`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `'utf8'`
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コマンドを実行するシェル。[シェルの要件](/ja/nodejs/api/child_process#shell-requirements) および [Windows のデフォルトシェル](/ja/nodejs/api/child_process#default-windows-shell) を参照してください。**デフォルト:** Unix では `'/bin/sh'`、Windows では `process.env.ComSpec`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) AbortSignal を使用して子プロセスを中断できるようにします。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) stdout または stderr で許可されるデータの最大量（バイト単位）。これを超えると、子プロセスは終了し、出力は切り捨てられます。[`maxBuffer` と Unicode](/ja/nodejs/api/child_process#maxbuffer-and-unicode) の注意点をご覧ください。**デフォルト:** `1024 * 1024`。
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのユーザー ID を設定します ([`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) を参照)。
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのグループ ID を設定します ([`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) を参照)。
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Windows システムで通常作成されるサブプロセスコンソールウィンドウを非表示にします。**デフォルト:** `false`。

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) プロセスが終了したときに出力とともに呼び出されます。
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

- 戻り値: [\<ChildProcess\>](/ja/nodejs/api/child_process#class-childprocess)

シェルを起動し、そのシェル内で `command` を実行して、生成された出力をバッファリングします。`exec` 関数に渡される `command` 文字列はシェルによって直接処理されるため、特殊文字 (シェルによって異なります。[シェル](https://en.wikipedia.org/wiki/List_of_command-line_interpreters) に基づいて異なります) は適切に処理する必要があります。

::: code-group
```js [CJS]
const { exec } = require('node:child_process');

exec('"/path/to/test file/test.sh" arg1 arg2');
// パス内のスペースが複数の引数の区切り文字として解釈されないように、二重引用符が使用されています。

exec('echo "The \\$HOME variable is $HOME"');
// $HOME 変数は最初のインスタンスではエスケープされますが、2 番目のインスタンスではエスケープされません。
```

```js [ESM]
import { exec } from 'node:child_process';

exec('"/path/to/test file/test.sh" arg1 arg2');
// パス内のスペースが複数の引数の区切り文字として解釈されないように、二重引用符が使用されています。

exec('echo "The \\$HOME variable is $HOME"');
// $HOME 変数は最初のインスタンスではエスケープされますが、2 番目のインスタンスではエスケープされません。
```
:::

**この関数にサニタイズされていないユーザー入力を渡さないでください。シェルメタ文字を含む入力は、任意のコマンド実行をトリガーするために使用される可能性があります。**

`callback` 関数が指定されている場合、引数 `(error, stdout, stderr)` で呼び出されます。成功すると、`error` は `null` になります。エラーが発生すると、`error` は [`Error`](/ja/nodejs/api/errors#class-error) のインスタンスになります。`error.code` プロパティはプロセスの終了コードになります。慣例により、`0` 以外の終了コードはエラーを示します。`error.signal` はプロセスを終了させたシグナルになります。

コールバックに渡される `stdout` および `stderr` 引数には、子プロセスの stdout および stderr 出力が含まれます。デフォルトでは、Node.js は出力を UTF-8 としてデコードし、文字列をコールバックに渡します。`encoding` オプションを使用して、stdout および stderr 出力のデコードに使用する文字エンコーディングを指定できます。`encoding` が `'buffer'` であるか、認識されない文字エンコーディングである場合、代わりに `Buffer` オブジェクトがコールバックに渡されます。

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

```js [ESM]
import { exec } from 'node:child_process';
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```
:::

`timeout` が `0` より大きい場合、子プロセスが `timeout` ミリ秒より長く実行されると、親プロセスは `killSignal` プロパティによって識別されるシグナル (デフォルトは `'SIGTERM'`) を送信します。

[`exec(3)`](http://man7.org/linux/man-pages/man3/exec.3) POSIX システムコールとは異なり、`child_process.exec()` は既存のプロセスを置き換えずに、シェルを使用してコマンドを実行します。

このメソッドが [`util.promisify()`](/ja/nodejs/api/util#utilpromisifyoriginal) されたバージョンとして呼び出される場合、`stdout` および `stderr` プロパティを持つ `Object` の `Promise` を返します。返される `ChildProcess` インスタンスは、`child` プロパティとして `Promise` にアタッチされます。エラーが発生した場合 (0 以外の終了コードになるエラーを含む)、拒否された Promise が返されます。コールバックで提供されるのと同じ `error` オブジェクトが返されますが、2 つの追加プロパティ `stdout` および `stderr` があります。

::: code-group
```js [CJS]
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const exec = promisify(child_process.exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```
:::

`signal` オプションが有効になっている場合、対応する `AbortController` で `.abort()` を呼び出すことは、子プロセスで `.kill()` を呼び出すのと似ていますが、コールバックに渡されるエラーは `AbortError` になります。

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { exec } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::


### `child_process.execFile(file[, args][, options][, callback])` {#child_processexecfilefile-args-options-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.4.0, v14.18.0 | `cwd` オプションは `file:` プロトコルを使用する WHATWG `URL` オブジェクトにできます。 |
| v15.4.0, v14.17.0 | AbortSignal のサポートが追加されました。 |
| v8.8.0 | `windowsHide` オプションがサポートされるようになりました。 |
| v0.1.91 | 追加: v0.1.91 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 実行する実行可能ファイルの名前またはパス。
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 文字列引数のリスト。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) 子プロセスの現在の作業ディレクトリ。
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 環境キーと値のペア。**デフォルト:** `process.env`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `'utf8'`
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) stdoutまたはstderrで許可される最大のデータ量（バイト単位）。これを超えると、子プロセスは終了し、出力は切り捨てられます。[`maxBuffer` と Unicode](/ja/nodejs/api/child_process#maxbuffer-and-unicode) の注意点をご覧ください。**デフォルト:** `1024 * 1024`。
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのユーザーIDを設定します（[`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)を参照）。
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのグループIDを設定します（[`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)を参照）。
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 通常 Windows システムで作成されるサブプロセスのコンソールウィンドウを非表示にします。**デフォルト:** `false`。
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Windows では引数の引用符やエスケープは行われません。Unix では無視されます。**デフォルト:** `false`。
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `true` の場合、`command` をシェル内で実行します。Unix では `'/bin/sh'` を、Windows では `process.env.ComSpec` を使用します。文字列として別のシェルを指定できます。[シェルの要件](/ja/nodejs/api/child_process#shell-requirements) と [デフォルトの Windows シェル](/ja/nodejs/api/child_process#default-windows-shell) を参照してください。**デフォルト:** `false` (シェルなし)。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) AbortSignal を使用して子プロセスを中止できるようにします。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) プロセスが終了したときに出力とともに呼び出されます。
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)
  
 
- 戻り値: [\<ChildProcess\>](/ja/nodejs/api/child_process#class-childprocess)

`child_process.execFile()` 関数は、[`child_process.exec()`](/ja/nodejs/api/child_process#child_processexeccommand-options-callback) と似ていますが、デフォルトではシェルを起動しない点が異なります。代わりに、指定された実行可能ファイル `file` は新しいプロセスとして直接起動されるため、[`child_process.exec()`](/ja/nodejs/api/child_process#child_processexeccommand-options-callback) よりもわずかに効率的です。

[`child_process.exec()`](/ja/nodejs/api/child_process#child_processexeccommand-options-callback) と同じオプションがサポートされています。シェルが起動されないため、I/Oリダイレクトやファイルグロビングなどの動作はサポートされていません。

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

```js [ESM]
import { execFile } from 'node:child_process';
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```
:::

コールバックに渡される `stdout` および `stderr` 引数には、子プロセスの stdout および stderr 出力が含まれます。デフォルトでは、Node.js は出力を UTF-8 としてデコードし、文字列をコールバックに渡します。`encoding` オプションを使用すると、stdout および stderr 出力のデコードに使用される文字エンコーディングを指定できます。`encoding` が `'buffer'` である場合、または認識されない文字エンコーディングである場合、代わりに `Buffer` オブジェクトがコールバックに渡されます。

このメソッドが [`util.promisify()`](/ja/nodejs/api/util#utilpromisifyoriginal) されたバージョンとして呼び出された場合、`stdout` および `stderr` プロパティを持つ `Object` の `Promise` を返します。返された `ChildProcess` インスタンスは、`child` プロパティとして `Promise` にアタッチされます。エラーが発生した場合 (0 以外の終了コードになるエラーを含む)、拒否された Promise が返され、コールバックで与えられたものと同じ `error` オブジェクトが返されますが、2 つの追加プロパティ `stdout` および `stderr` があります。

::: code-group
```js [CJS]
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const execFile = promisify(child_process.execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```
:::

**<code>shell</code> オプションが有効になっている場合は、サニタイズされていないユーザー入力をこの関数に渡さないでください。シェルメタ文字を含む入力は、任意のコマンド実行をトリガーするために使用される可能性があります。**

`signal` オプションが有効になっている場合、対応する `AbortController` で `.abort()` を呼び出すことは、子プロセスで `.kill()` を呼び出すのと似ていますが、コールバックに渡されるエラーは `AbortError` になります。

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { execFile } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::


### `child_process.fork(modulePath[, args][, options])` {#child_processforkmodulepath-args-options}

::: info [履歴]
| バージョン | 変更 |
|---|---|
| v17.4.0, v16.14.0 | `modulePath` パラメータは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v16.4.0, v14.18.0 | `cwd` オプションは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v15.13.0, v14.18.0 | timeout が追加されました。 |
| v15.11.0, v14.18.0 | AbortSignal の killSignal が追加されました。 |
| v15.6.0, v14.17.0 | AbortSignal のサポートが追加されました。 |
| v13.2.0, v12.16.0 | `serialization` オプションがサポートされるようになりました。 |
| v8.0.0 | `stdio` オプションは文字列にすることができます。 |
| v6.4.0 | `stdio` オプションがサポートされるようになりました。 |
| v0.5.0 | 追加: v0.5.0 |
:::

- `modulePath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) 子で実行するモジュール。
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 文字列引数のリスト。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) 子プロセスの現在のワーキングディレクトリ。
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 親プロセスから独立して実行できるように子プロセスを準備します。特定の動作はプラットフォームに依存します。[`options.detached`](/ja/nodejs/api/child_process#optionsdetached) を参照してください。
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 環境キーと値のペア。**デフォルト:** `process.env`。
    - `execPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 子プロセスの作成に使用する実行可能ファイル。
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 実行可能ファイルに渡される文字列引数のリスト。**デフォルト:** `process.execArgv`。
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのグループ ID を設定します ([`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) を参照)。
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) プロセス間でメッセージを送信するために使用するシリアライゼーションの種類を指定します。有効な値は `'json'` および `'advanced'` です。詳細については、[高度なシリアライゼーション](/ja/nodejs/api/child_process#advanced-serialization) を参照してください。**デフォルト:** `'json'`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) AbortSignal を使用して子プロセスを閉じることができます。
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) スポーンされたプロセスがタイムアウトまたは中止シグナルによって強制終了されるときに使用されるシグナル値。**デフォルト:** `'SIGTERM'`。
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、子プロセスの stdin、stdout、および stderr は親プロセスにパイプされます。そうでない場合は、親プロセスから継承されます。詳細については、[`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options) の [`stdio`](/ja/nodejs/api/child_process#optionsstdio) の `'pipe'` および `'inherit'` オプションを参照してください。**デフォルト:** `false`。
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options) の [`stdio`](/ja/nodejs/api/child_process#optionsstdio) を参照してください。このオプションを指定すると、`silent` がオーバーライドされます。配列形式を使用する場合は、値 `'ipc'` を持つ項目を 1 つだけ含める必要があります。そうでない場合は、エラーがスローされます。たとえば、`[0, 1, 2, 'ipc']` です。
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのユーザー ID を設定します ([`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) を参照)。
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Windows では、引数の引用符またはエスケープは行われません。Unix では無視されます。**デフォルト:** `false`。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスの実行が許可される最大時間 (ミリ秒単位)。**デフォルト:** `undefined`。

- 戻り値: [\<ChildProcess\>](/ja/nodejs/api/child_process#class-childprocess)

`child_process.fork()` メソッドは、新しい Node.js プロセスを生成するために特別に使用される [`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options) の特殊なケースです。[`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options) と同様に、[`ChildProcess`](/ja/nodejs/api/child_process#class-childprocess) オブジェクトが返されます。返された [`ChildProcess`](/ja/nodejs/api/child_process#class-childprocess) には、親と子の間でメッセージをやり取りできる追加の通信チャネルが組み込まれます。詳細については、[`subprocess.send()`](/ja/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) を参照してください。

生成された Node.js 子プロセスは、2 つの間に確立された IPC 通信チャネルを除き、親から独立していることに注意してください。各プロセスは、独自の V8 インスタンスを持つ独自のメモリを持っています。追加のリソース割り当てが必要になるため、多数の子 Node.js プロセスを生成することはお勧めしません。

デフォルトでは、`child_process.fork()` は、親プロセスの [`process.execPath`](/ja/nodejs/api/process#processexecpath) を使用して新しい Node.js インスタンスを生成します。`options` オブジェクトの `execPath` プロパティを使用すると、代替の実行パスを使用できます。

カスタム `execPath` で起動された Node.js プロセスは、子プロセスの環境変数 `NODE_CHANNEL_FD` を使用して識別されるファイル記述子 (fd) を使用して親プロセスと通信します。

[`fork(2)`](http://man7.org/linux/man-pages/man2/fork.2) POSIX システムコールとは異なり、`child_process.fork()` は現在のプロセスを複製しません。

[`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options) で利用可能な `shell` オプションは、`child_process.fork()` ではサポートされておらず、設定されている場合は無視されます。

`signal` オプションが有効になっている場合、対応する `AbortController` で `.abort()` を呼び出すことは、子プロセスで `.kill()` を呼び出すのと似ていますが、コールバックに渡されるエラーは `AbortError` になります。

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const process = require('node:process');

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(__filename, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```

```js [ESM]
import { fork } from 'node:child_process';
import process from 'node:process';

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(import.meta.url, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```
:::


### `child_process.spawn(command[, args][, options])` {#child_processspawncommand-args-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.4.0, v14.18.0 | `cwd`オプションは、`file:`プロトコルを使用したWHATWG `URL`オブジェクトにすることができます。 |
| v15.13.0, v14.18.0 | timeout が追加されました。 |
| v15.11.0, v14.18.0 | AbortSignal の killSignal が追加されました。 |
| v15.5.0, v14.17.0 | AbortSignal のサポートが追加されました。 |
| v13.2.0, v12.16.0 | `serialization`オプションがサポートされるようになりました。 |
| v8.8.0 | `windowsHide`オプションがサポートされるようになりました。 |
| v6.4.0 | `argv0`オプションがサポートされるようになりました。 |
| v5.7.0 | `shell`オプションがサポートされるようになりました。 |
| v0.1.90 | 追加: v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 実行するコマンド。
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 文字列引数のリスト。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) 子プロセスのカレントワーキングディレクトリ。
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 環境変数のキーと値のペア。 **デフォルト:** `process.env`。
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 子プロセスに送信される`argv[0]`の値を明示的に設定します。指定しない場合は、`command`に設定されます。
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 子の stdio 設定 ([`options.stdio`](/ja/nodejs/api/child_process#optionsstdio) を参照)。
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 親プロセスから独立して実行されるように子プロセスを準備します。具体的な動作はプラットフォームによって異なります。[`options.detached`](/ja/nodejs/api/child_process#optionsdetached) を参照してください。
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのユーザーIDを設定します ([`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) を参照)。
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのグループIDを設定します ([`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) を参照)。
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) プロセス間でメッセージを送信するために使用されるシリアライゼーションの種類を指定します。使用可能な値は、`'json'` と `'advanced'` です。詳細については、[高度なシリアライゼーション](/ja/nodejs/api/child_process#advanced-serialization)を参照してください。**デフォルト:** `'json'`。
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `true`の場合、シェル内で`command`を実行します。Unix では `'/bin/sh'` を使用し、Windows では `process.env.ComSpec` を使用します。文字列として別のシェルを指定できます。[シェルの要件](/ja/nodejs/api/child_process#shell-requirements)と[Windowsのデフォルトシェル](/ja/nodejs/api/child_process#default-windows-shell)を参照してください。**デフォルト:** `false` (シェルなし)。
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Windowsでは、引数の引用符やエスケープは行われません。Unixでは無視されます。`shell`が指定され、CMDである場合、これは自動的に`true`に設定されます。**デフォルト:** `false`。
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Windowsシステムで通常作成されるサブプロセスのコンソールウィンドウを非表示にします。**デフォルト:** `false`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) AbortSignal を使用して子プロセスを中止できます。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスの実行が許可される最大時間（ミリ秒単位）。**デフォルト:** `undefined`。
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) スポーンされたプロセスがタイムアウトまたはアボートシグナルによって強制終了される場合に使用されるシグナル値。**デフォルト:** `'SIGTERM'`。

- 戻り値: [\<ChildProcess\>](/ja/nodejs/api/child_process#class-childprocess)

`child_process.spawn()`メソッドは、指定された`command`を使用して新しいプロセスを起動し、コマンドライン引数を`args`に指定します。省略した場合、`args`のデフォルトは空の配列になります。

**<code>shell</code>オプションが有効になっている場合、サニタイズされていないユーザー入力をこの関数に渡さないでください。シェルメタ文字を含む入力は、任意のコマンド実行をトリガーするために使用される可能性があります。**

3番目の引数を使用して、追加のオプションを指定できます。これらのデフォルトは次のとおりです。

```js [ESM]
const defaults = {
  cwd: undefined,
  env: process.env,
};
```
プロセスが起動されるワーキングディレクトリを指定するには、`cwd`を使用します。指定されていない場合、デフォルトは現在のワーキングディレクトリを継承することです。指定されているが、パスが存在しない場合、子プロセスは`ENOENT`エラーを発行し、すぐに終了します。`ENOENT`は、コマンドが存在しない場合にも発行されます。

新しいプロセスに表示される環境変数を指定するには`env`を使用します。デフォルトは[`process.env`](/ja/nodejs/api/process#processenv)です。

`env`の`undefined`値は無視されます。

`ls -lh /usr`を実行し、`stdout`、`stderr`、および終了コードをキャプチャする例:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

例:`ps ax | grep ssh`を実行する非常に手の込んだ方法

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```
:::

失敗した`spawn`のチェック例:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```
:::

特定のプラットフォーム（macOS、Linux）では、プロセスタイトルに`argv[0]`の値が使用され、他のプラットフォーム（Windows、SunOS）では`command`が使用されます。

Node.jsは起動時に`argv[0]`を`process.execPath`で上書きするため、Node.jsの子プロセスの`process.argv[0]`は、親から`spawn`に渡された`argv0`パラメータと一致しません。代わりに、`process.argv0`プロパティで取得します。

`signal`オプションが有効になっている場合、対応する`AbortController`で`.abort()`を呼び出すことは、子プロセスで`.kill()`を呼び出すのと似ていますが、コールバックに渡されるエラーは`AbortError`になります。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // This will be called with err being an AbortError if the controller aborts
});
controller.abort(); // Stops the child process
```

```js [ESM]
import { spawn } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // This will be called with err being an AbortError if the controller aborts
});
controller.abort(); // Stops the child process
```
:::


#### `options.detached` {#optionsdetached}

**追加: v0.7.10**

Windows では、`options.detached` を `true` に設定すると、親プロセスが終了した後も子プロセスが実行を継続できるようになります。子プロセスは独自のコンソールウィンドウを持つようになります。子プロセスで有効にすると、無効にすることはできません。

Windows 以外のプラットフォームでは、`options.detached` が `true` に設定されている場合、子プロセスは新しいプロセスグループとセッションのリーダーになります。子プロセスは、デタッチされているかどうかに関係なく、親プロセスが終了した後も実行を継続できます。詳細については、[`setsid(2)`](http://man7.org/linux/man-pages/man2/setsid.2) を参照してください。

デフォルトでは、親プロセスはデタッチされた子プロセスが終了するのを待ちます。特定の `subprocess` が終了するのを親プロセスが待たないようにするには、`subprocess.unref()` メソッドを使用します。そうすることで、親プロセスのイベントループは、その参照カウントに子プロセスを含めなくなり、子プロセスと親プロセス間に確立された IPC チャネルがない限り、親プロセスは子プロセスとは独立して終了できます。

`detached` オプションを使用して長時間実行されるプロセスを開始する場合、親に接続されていない `stdio` 構成が提供されない限り、プロセスは親が終了した後もバックグラウンドで実行されません。親プロセスの `stdio` が継承される場合、子プロセスは制御端末に接続されたままになります。

親の終了を無視するために、デタッチし、親の `stdio` ファイルディスクリプタも無視することによる、長時間実行されるプロセスの例:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::

あるいは、子プロセスの出力をファイルにリダイレクトすることもできます。

::: code-group
```js [CJS]
const { openSync } = require('node:fs');
const { spawn } = require('node:child_process');
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```

```js [ESM]
import { openSync } from 'node:fs';
import { spawn } from 'node:child_process';
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```
:::


#### `options.stdio` {#optionsstdio}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.6.0, v14.18.0 | `overlapped` stdio フラグが追加されました。 |
| v3.3.1 | 値 `0` がファイル記述子として受け入れられるようになりました。 |
| v0.7.10 | v0.7.10 で追加されました |
:::

`options.stdio` オプションは、親プロセスと子プロセスの間に確立されるパイプを構成するために使用されます。デフォルトでは、子プロセスの stdin、stdout、および stderr は、[`ChildProcess`](/ja/nodejs/api/child_process#class-childprocess) オブジェクト上の対応する [`subprocess.stdin`](/ja/nodejs/api/child_process#subprocessstdin)、[`subprocess.stdout`](/ja/nodejs/api/child_process#subprocessstdout)、および [`subprocess.stderr`](/ja/nodejs/api/child_process#subprocessstderr) ストリームにリダイレクトされます。これは、`options.stdio` を `['pipe', 'pipe', 'pipe']` に設定するのと同じです。

便宜上、`options.stdio` は次のいずれかの文字列にすることができます。

- `'pipe'`: `['pipe', 'pipe', 'pipe']` と同等（デフォルト）
- `'overlapped'`: `['overlapped', 'overlapped', 'overlapped']` と同等
- `'ignore'`: `['ignore', 'ignore', 'ignore']` と同等
- `'inherit'`: `['inherit', 'inherit', 'inherit']` または `[0, 1, 2]` と同等

それ以外の場合、`options.stdio` の値は配列であり、各インデックスは子プロセスの fd に対応します。fd 0、1、および 2 は、それぞれ stdin、stdout、および stderr に対応します。追加の fd を指定して、親プロセスと子プロセスの間に追加のパイプを作成できます。値は次のいずれかになります。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

// 子プロセスは親プロセスの stdios を使用します。
spawn('prg', [], { stdio: 'inherit' });

// stderr のみを共有する子プロセスを生成します。
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// startd スタイルのインターフェースを提供するプログラムと対話するために、
// 追加の fd=4 を開きます。
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```

```js [ESM]
import { spawn } from require('node:child_process');
import process from 'node:process';

// 子プロセスは親プロセスの stdios を使用します。
spawn('prg', [], { stdio: 'inherit' });

// stderr のみを共有する子プロセスを生成します。
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// startd スタイルのインターフェースを提供するプログラムと対話するために、
// 追加の fd=4 を開きます。
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```
:::

*親プロセスと子プロセスの間に IPC チャネルが確立され、子プロセスが Node.js インスタンスである場合、子プロセスは <a href="process.html#event-disconnect"><code>'disconnect'</code></a> イベントまたは <a href="process.html#event-message"><code>'message'</code></a> イベントのイベントハンドラーを登録するまで、参照解除された（<code>unref()</code> を使用して）IPC チャネルで起動されることに注意してください。これにより、子プロセスは、開いている IPC チャネルによってプロセスが開かれたままになることなく、正常に終了できます。* 参照: [`child_process.exec()`](/ja/nodejs/api/child_process#child_processexeccommand-options-callback) および [`child_process.fork()`](/ja/nodejs/api/child_process#child_processforkmodulepath-args-options)。


## 同期的なプロセスの生成 {#synchronous-process-creation}

[`child_process.spawnSync()`](/ja/nodejs/api/child_process#child_processspawnsynccommand-args-options)、[`child_process.execSync()`](/ja/nodejs/api/child_process#child_processexecsynccommand-options)、および [`child_process.execFileSync()`](/ja/nodejs/api/child_process#child_processexecfilesyncfile-args-options) メソッドは同期的であり、Node.js イベントループをブロックし、生成されたプロセスが終了するまで追加のコードの実行を一時停止します。

このようなブロッキング呼び出しは、主に汎用スクリプトタスクを簡素化したり、起動時のアプリケーション構成のロード/処理を簡素化したりするのに役立ちます。

### `child_process.execFileSync(file[, args][, options])` {#child_processexecfilesyncfile-args-options}

::: info [履歴]
| バージョン | 変更 |
|---|---|
| v16.4.0, v14.18.0 | `cwd` オプションは `file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v10.10.0 | `input` オプションは、任意の `TypedArray` または `DataView` になりました。 |
| v8.8.0 | `windowsHide` オプションがサポートされるようになりました。 |
| v8.0.0 | `input` オプションは `Uint8Array` になりました。 |
| v6.2.1, v4.5.0 | `encoding` オプションを明示的に `buffer` に設定できるようになりました。 |
| v0.11.12 | バージョン v0.11.12 で追加されました。 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 実行する実行可能ファイルの名前またはパス。
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 文字列引数のリスト。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) 子プロセスの現在の作業ディレクトリ。
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 生成されたプロセスに stdin として渡される値。 `stdio[0]` が `'pipe'` に設定されている場合、この値を指定すると `stdio[0]` がオーバーライドされます。
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 子の stdio 構成。 [`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options) の [`stdio`](/ja/nodejs/api/child_process#optionsstdio) を参照してください。 `stdio` が指定されていない限り、`stderr` はデフォルトで親プロセスの stderr に出力されます。 **デフォルト:** `'pipe'`。
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 環境のキーと値のペア。 **デフォルト:** `process.env`。
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのユーザー ID を設定します ([`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) を参照)。
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのグループ ID を設定します ([`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) を参照)。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスの実行を許可する最大時間 (ミリ秒単位)。 **デフォルト:** `undefined`。
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成されたプロセスが強制終了されるときに使用されるシグナル値。 **デフォルト:** `'SIGTERM'`。
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) stdout または stderr で許可されるデータの最大量 (バイト単位)。 これを超えると、子プロセスは終了します。 [`maxBuffer` と Unicode](/ja/nodejs/api/child_process#maxbuffer-and-unicode) の注意点をご覧ください。 **デフォルト:** `1024 * 1024`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) すべての stdio 入出力に使用されるエンコーディング。 **デフォルト:** `'buffer'`。
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 通常 Windows システムで作成されるサブプロセス コンソール ウィンドウを非表示にします。 **デフォルト:** `false`。
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `true` の場合、シェル内で `command` を実行します。 Unix では `'/bin/sh'` を、Windows では `process.env.ComSpec` を使用します。 文字列として別のシェルを指定できます。 [シェルの要件](/ja/nodejs/api/child_process#shell-requirements) と [Windows のデフォルトシェル](/ja/nodejs/api/child_process#default-windows-shell) を参照してください。 **デフォルト:** `false` (シェルなし)。

- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コマンドからの stdout。

`child_process.execFileSync()` メソッドは、通常、[`child_process.execFile()`](/ja/nodejs/api/child_process#child_processexecfilefile-args-options-callback) と同じですが、このメソッドは子プロセスが完全に閉じるまで戻らない点が異なります。 タイムアウトが発生し、`killSignal` が送信された場合、メソッドはプロセスが完全に終了するまで戻りません。

子プロセスが `SIGTERM` シグナルをインターセプトして処理し、終了しない場合でも、親プロセスは子プロセスが終了するまで待機します。

プロセスがタイムアウトするか、ゼロ以外の終了コードが発生した場合、このメソッドは、基になる [`child_process.spawnSync()`](/ja/nodejs/api/child_process#child_processspawnsynccommand-args-options) の完全な結果を含む [`Error`](/ja/nodejs/api/errors#class-error) をスローします。

**<code>shell</code> オプションが有効になっている場合は、サニタイズされていないユーザー入力をこの関数に渡さないでください。 シェルのメタ文字を含む入力は、任意のコマンド実行をトリガーするために使用される可能性があります。**

::: code-group
```js [CJS]
const { execFileSync } = require('node:child_process');

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // 子プロセスからの stdout および stderr をキャプチャします。
    // 子 stderr を親 stderr にストリーミングするデフォルトの動作をオーバーライドします
    stdio: 'pipe',

    // stdio パイプに utf8 エンコーディングを使用します
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // 子プロセスの生成に失敗しました
    console.error(err.code);
  } else {
    // 子は生成されましたが、ゼロ以外の終了コードで終了しました
    // エラーには子からの stdout および stderr が含まれています
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```

```js [ESM]
import { execFileSync } from 'node:child_process';

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // 子プロセスからの stdout および stderr をキャプチャします。
    // 子 stderr を親 stderr にストリーミングするデフォルトの動作をオーバーライドします
    stdio: 'pipe',

    // stdio パイプに utf8 エンコーディングを使用します
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // 子プロセスの生成に失敗しました
    console.error(err.code);
  } else {
    // 子は生成されましたが、ゼロ以外の終了コードで終了しました
    // エラーには子からの stdout および stderr が含まれています
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```
:::


### `child_process.execSync(command[, options])` {#child_processexecsynccommand-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v16.4.0, v14.18.0 | `cwd` オプションは `file:` プロトコルを使用した WHATWG `URL` オブジェクトにできます。 |
| v10.10.0 | `input` オプションは、任意の `TypedArray` または `DataView` にできるようになりました。 |
| v8.8.0 | `windowsHide` オプションがサポートされるようになりました。 |
| v8.0.0 | `input` オプションは `Uint8Array` にできるようになりました。 |
| v0.11.12 | 追加: v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 実行するコマンド。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) 子プロセスの現在の作業ディレクトリ。
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) スポーンされたプロセスに stdin として渡される値。 `stdio[0]` が `'pipe'` に設定されている場合、この値を指定すると `stdio[0]` が上書きされます。
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 子の stdio 設定。 [`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options) の [`stdio`](/ja/nodejs/api/child_process#optionsstdio) を参照してください。 `stdio` が指定されていない限り、デフォルトでは `stderr` は親プロセスの stderr に出力されます。 **デフォルト:** `'pipe'`。
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 環境キーと値のペア。 **デフォルト:** `process.env`。
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コマンドを実行するシェル。 [シェルの要件](/ja/nodejs/api/child_process#shell-requirements) と [Windows のデフォルトシェル](/ja/nodejs/api/child_process#default-windows-shell) を参照してください。 **デフォルト:** Unix では `'/bin/sh'`、Windows では `process.env.ComSpec`。
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのユーザー ID を設定します。（[`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) を参照してください）。
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのグループ ID を設定します。（[`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) を参照してください）。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスの実行が許可される最大時間（ミリ秒単位）。 **デフォルト:** `undefined`。
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) スポーンされたプロセスが強制終了されるときに使用されるシグナル値。 **デフォルト:** `'SIGTERM'`。
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) stdout または stderr で許可されるデータの最大量（バイト単位）。 これを超えると、子プロセスは終了し、出力は切り捨てられます。 [`maxBuffer` と Unicode](/ja/nodejs/api/child_process#maxbuffer-and-unicode) の注意点 を参照してください。 **デフォルト:** `1024 * 1024`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) すべての stdio 入出力に使用されるエンコーディング。 **デフォルト:** `'buffer'`。
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 通常 Windows システムで作成されるサブプロセスのコンソールウィンドウを非表示にします。 **デフォルト:** `false`。


- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コマンドからの stdout。

`child_process.execSync()` メソッドは、子プロセスが完全に閉じるまでメソッドが戻らないことを除いて、通常 [`child_process.exec()`](/ja/nodejs/api/child_process#child_processexeccommand-options-callback) と同じです。 タイムアウトが発生し、`killSignal` が送信された場合、プロセスが完全に終了するまでメソッドは戻りません。 子プロセスが `SIGTERM` シグナルをインターセプトして処理し、終了しない場合、親プロセスは子プロセスが終了するまで待機します。

プロセスがタイムアウトするか、ゼロ以外の終了コードがある場合、このメソッドは例外をスローします。 [`Error`](/ja/nodejs/api/errors#class-error) オブジェクトには、[`child_process.spawnSync()`](/ja/nodejs/api/child_process#child_processspawnsynccommand-args-options) からの結果全体が含まれます。

**サニタイズされていないユーザー入力をこの関数に渡さないでください。シェルメタ文字を含む入力は、任意のコマンド実行をトリガーするために使用される可能性があります。**


### `child_process.spawnSync(command[, args][, options])` {#child_processspawnsynccommand-args-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.4.0, v14.18.0 | `cwd` オプションは、`file:` プロトコルを使用する WHATWG `URL` オブジェクトにすることができます。 |
| v10.10.0 | `input` オプションは、任意の `TypedArray` または `DataView` にすることができるようになりました。 |
| v8.8.0 | `windowsHide` オプションがサポートされるようになりました。 |
| v8.0.0 | `input` オプションは、`Uint8Array` にすることができるようになりました。 |
| v5.7.0 | `shell` オプションがサポートされるようになりました。 |
| v6.2.1, v4.5.0 | `encoding` オプションを明示的に `buffer` に設定できるようになりました。 |
| v0.11.12 | 追加: v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 実行するコマンド。
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 文字列引数のリスト。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) 子プロセスの現在のワーキングディレクトリ。
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) スポーンされたプロセスに stdin として渡される値。 `stdio[0]` が `'pipe'` に設定されている場合、この値を指定すると `stdio[0]` が上書きされます。
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 子プロセスに送信される `argv[0]` の値を明示的に設定します。 指定しない場合は `command` に設定されます。
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 子の stdio 構成。 [`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options) の [`stdio`](/ja/nodejs/api/child_process#optionsstdio) を参照してください。 **デフォルト:** `'pipe'`。
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 環境のキーと値のペア。 **デフォルト:** `process.env`。
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのユーザーIDを設定します ([`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) を参照)。
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのグループIDを設定します ([`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) を参照)。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスの実行が許可される最大時間をミリ秒単位で指定します。 **デフォルト:** `undefined`。
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) スポーンされたプロセスが強制終了されるときに使用されるシグナル値。 **デフォルト:** `'SIGTERM'`。
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) stdout または stderr で許可されるデータの最大量 (バイト単位)。 これを超えると、子プロセスは終了し、出力は切り捨てられます。 [`maxBuffer` と Unicode](/ja/nodejs/api/child_process#maxbuffer-and-unicode) の注意点をご覧ください。 **デフォルト:** `1024 * 1024`。
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) すべての stdio 入出力に使用されるエンコーディング。 **デフォルト:** `'buffer'`。
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `true` の場合、`command` をシェル内で実行します。 Unix では `'/bin/sh'` を使用し、Windows では `process.env.ComSpec` を使用します。 文字列として別のシェルを指定できます。 [シェルの要件](/ja/nodejs/api/child_process#shell-requirements) と [Windows のデフォルトシェル](/ja/nodejs/api/child_process#default-windows-shell) を参照してください。 **デフォルト:** `false` (シェルなし)。
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Windows では、引数のクォートやエスケープは行われません。 Unix では無視されます。 これは、`shell` が指定され、CMD の場合に自動的に `true` に設定されます。 **デフォルト:** `false`。
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 通常 Windows システムで作成されるサブプロセスのコンソールウィンドウを非表示にします。 **デフォルト:** `false`。
 
 
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 子プロセスの Pid。
    - `output` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) stdio 出力からの結果の配列。
    - `stdout` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `output[1]` の内容。
    - `stderr` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `output[2]` の内容。
    - `status` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) サブプロセスの終了コード。シグナルが原因でサブプロセスが終了した場合は `null`。
    - `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) サブプロセスの強制終了に使用されたシグナル。シグナルが原因でサブプロセスが終了しなかった場合は `null`。
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 子プロセスが失敗した場合、またはタイムアウトした場合のエラーオブジェクト。
 
 

`child_process.spawnSync()` メソッドは、一般的に [`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options) と同じですが、関数が子プロセスが完全に閉じるまで戻らない点が異なります。 タイムアウトが発生し、`killSignal` が送信された場合、メソッドはプロセスが完全に終了するまで戻りません。 プロセスが `SIGTERM` シグナルをインターセプトして処理し、終了しない場合、親プロセスは子プロセスが終了するまで待機します。

**<code>shell</code> オプションが有効になっている場合、サニタイズされていないユーザー入力をこの関数に渡さないでください。 シェルのメタ文字を含む入力は、任意のコマンド実行をトリガーするために使用される可能性があります。**


## クラス: `ChildProcess` {#class-childprocess}

**追加:** v2.2.0

- 拡張: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

`ChildProcess` のインスタンスは、生成された子プロセスを表します。

`ChildProcess` のインスタンスは、直接作成することを意図していません。代わりに、[`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options)、[`child_process.exec()`](/ja/nodejs/api/child_process#child_processexeccommand-options-callback)、[`child_process.execFile()`](/ja/nodejs/api/child_process#child_processexecfilefile-args-options-callback)、または [`child_process.fork()`](/ja/nodejs/api/child_process#child_processforkmodulepath-args-options) メソッドを使用して、`ChildProcess` のインスタンスを作成します。

### イベント: `'close'` {#event-close}

**追加:** v0.7.7

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 子プロセスが単独で終了した場合の終了コード。
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 子プロセスが終了させられたシグナル。

`'close'` イベントは、プロセスが終了*し*、子プロセスの stdio ストリームが閉じられた後に発生します。 これは、複数のプロセスが同じ stdio ストリームを共有する可能性があるため、[`'exit'`](/ja/nodejs/api/child_process#event-exit) イベントとは異なります。 `'close'` イベントは常に [`'exit'`](/ja/nodejs/api/child_process#event-exit) がすでに発生した後、または子プロセスの生成に失敗した場合は [`'error'`](/ja/nodejs/api/child_process#event-error) の後に発生します。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::


### イベント: `'disconnect'` {#event-disconnect}

**追加: v0.7.2**

`'disconnect'` イベントは、親プロセスで [`subprocess.disconnect()`](/ja/nodejs/api/child_process#subprocessdisconnect) メソッドを呼び出すか、子プロセスで [`process.disconnect()`](/ja/nodejs/api/process#processdisconnect) を呼び出した後に発行されます。切断後、メッセージの送受信はできなくなり、[`subprocess.connected`](/ja/nodejs/api/child_process#subprocessconnected) プロパティは `false` になります。

### イベント: `'error'` {#event-error}

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) エラー。

`'error'` イベントは、以下の場合に発行されます。

- プロセスを起動できなかった。
- プロセスを強制終了できなかった。
- 子プロセスへのメッセージの送信に失敗した。
- 子プロセスが `signal` オプションによって中断された。

`'exit'` イベントは、エラーが発生した後に発生する場合と発生しない場合があります。`'exit'` イベントと `'error'` イベントの両方をリッスンする場合は、ハンドラー関数を誤って複数回呼び出さないように注意してください。

[`subprocess.kill()`](/ja/nodejs/api/child_process#subprocesskillsignal) と [`subprocess.send()`](/ja/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) も参照してください。

### イベント: `'exit'` {#event-exit}

**追加: v0.1.90**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 子プロセスが独自に終了した場合の終了コード。
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 子プロセスが終了したシグナル。

`'exit'` イベントは、子プロセスが終了した後に発行されます。プロセスが終了した場合、`code` はプロセスの最終終了コードであり、それ以外の場合は `null` です。プロセスがシグナルの受信によって終了した場合、`signal` はシグナルの文字列名であり、それ以外の場合は `null` です。いずれか一方は常に非 `null` になります。

`'exit'` イベントがトリガーされると、子プロセスの stdio ストリームはまだ開いている可能性があります。

Node.js は `SIGINT` および `SIGTERM` のシグナルハンドラを確立し、Node.js プロセスはこれらのシグナルの受信によってすぐに終了することはありません。代わりに、Node.js は一連のクリーンアップアクションを実行し、処理されたシグナルを再度発生させます。

[`waitpid(2)`](http://man7.org/linux/man-pages/man2/waitpid.2) を参照してください。


### イベント: `'message'` {#event-message}

**追加:** v0.5.9

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) パースされたJSONオブジェクトまたはプリミティブ値。
- `sendHandle` [\<Handle\>](/ja/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined`、または[`net.Socket`](/ja/nodejs/api/net#class-netsocket)、[`net.Server`](/ja/nodejs/api/net#class-netserver)、または[`dgram.Socket`](/ja/nodejs/api/dgram#class-dgramsocket)オブジェクト。

`'message'`イベントは、子プロセスが[`process.send()`](/ja/nodejs/api/process#processsendmessage-sendhandle-options-callback)を使用してメッセージを送信するときにトリガーされます。

メッセージはシリアライズとパース処理を経ます。その結果得られるメッセージは、元々送信されたものと同じではない可能性があります。

子プロセスの生成時に`serialization`オプションが`'advanced'`に設定されている場合、`message`引数にはJSONでは表現できないデータが含まれる可能性があります。詳細については、[高度なシリアライズ](/ja/nodejs/api/child_process#advanced-serialization)を参照してください。

### イベント: `'spawn'` {#event-spawn}

**追加:** v15.1.0, v14.17.0

`'spawn'`イベントは、子プロセスが正常に生成されたときに一度だけ発生します。子プロセスが正常に生成されない場合、`'spawn'`イベントは発生せず、代わりに`'error'`イベントが発生します。

発生した場合、`'spawn'`イベントは他のすべてのイベントよりも前に発生し、`stdout`または`stderr`を介してデータを受信するよりも前に発生します。

`'spawn'`イベントは、生成されたプロセス**内**でエラーが発生するかどうかに関係なく発生します。たとえば、`bash some-command`が正常に生成された場合、`'spawn'`イベントが発生しますが、`bash`は`some-command`の生成に失敗する可能性があります。この注意点は`{ shell: true }`を使用する場合にも当てはまります。

### `subprocess.channel` {#subprocesschannel}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.0.0 | オブジェクトがネイティブC++バインディングを誤って公開しなくなりました。 |
| v7.1.0 | 追加: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 子プロセスへのIPCチャネルを表すパイプ。

`subprocess.channel`プロパティは、子プロセスのIPCチャネルへの参照です。IPCチャネルが存在しない場合、このプロパティは`undefined`になります。


#### `subprocess.channel.ref()` {#subprocesschannelref}

**追加:** v7.1.0

このメソッドは、以前に `.unref()` が呼び出された場合に、IPC チャネルが親プロセスのイベントループを実行し続けるようにします。

#### `subprocess.channel.unref()` {#subprocesschannelunref}

**追加:** v7.1.0

このメソッドは、IPC チャネルが親プロセスのイベントループを実行し続けず、チャネルが開いている間でも終了できるようにします。

### `subprocess.connected` {#subprocessconnected}

**追加:** v0.7.2

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `subprocess.disconnect()` が呼び出された後、`false` に設定されます。

`subprocess.connected` プロパティは、子プロセスとの間でメッセージを送受信できるかどうかを示します。 `subprocess.connected` が `false` の場合、メッセージを送受信することはできません。

### `subprocess.disconnect()` {#subprocessdisconnect}

**追加:** v0.7.2

親プロセスと子プロセス間の IPC チャネルを閉じ、子プロセスが存続し続ける他の接続がない場合に、子プロセスが正常に終了できるようにします。 このメソッドを呼び出すと、親プロセスと子プロセス (それぞれ) の `subprocess.connected` および `process.connected` プロパティが `false` に設定され、プロセス間でメッセージを渡すことができなくなります。

受信中のメッセージがない場合、`'disconnect'` イベントが発生します。 これは、`subprocess.disconnect()` の呼び出し直後にトリガーされることが最も多いです。

子プロセスが Node.js インスタンス (たとえば、[`child_process.fork()`](/ja/nodejs/api/child_process#child_processforkmodulepath-args-options) を使用して生成) の場合、子プロセス内で `process.disconnect()` メソッドを呼び出して、IPC チャネルを閉じることもできます。

### `subprocess.exitCode` {#subprocessexitcode}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`subprocess.exitCode` プロパティは、子プロセスの終了コードを示します。 子プロセスがまだ実行中の場合、フィールドは `null` になります。

### `subprocess.kill([signal])` {#subprocesskillsignal}

**追加:** v0.1.90

- `signal` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`subprocess.kill()` メソッドは、子プロセスにシグナルを送信します。 引数が指定されていない場合、プロセスには `'SIGTERM'` シグナルが送信されます。 使用可能なシグナルの一覧については、[`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) を参照してください。 この関数は、[`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) が成功した場合は `true` を返し、それ以外の場合は `false` を返します。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```
:::

シグナルを配信できない場合、[`ChildProcess`](/ja/nodejs/api/child_process#class-childprocess) オブジェクトは [`'error'`](/ja/nodejs/api/child_process#event-error) イベントを発生させる可能性があります。 すでに終了した子プロセスにシグナルを送信することはエラーではありませんが、予期しない結果になる可能性があります。 具体的には、プロセス識別子 (PID) が別のプロセスに再割り当てされている場合、シグナルはそのプロセスに配信され、予期しない結果になる可能性があります。

関数は `kill` と呼ばれますが、子プロセスに配信されるシグナルは、実際にはプロセスを終了させない場合があります。

参照については、[`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) を参照してください。

Windows では、POSIX シグナルが存在しないため、`signal` 引数は `'SIGKILL'`, `'SIGTERM'`, `'SIGINT'`, `'SIGQUIT'` を除いて無視され、プロセスは常に強制的に中断して強制終了されます ( `'SIGKILL'` と同様)。 詳細については、[シグナルイベント](/ja/nodejs/api/process#signal-events) を参照してください。

Linux では、子プロセスの親を強制終了しようとしても、子プロセスのさらに子プロセスは終了しません。 これは、シェルで新しいプロセスを実行したり、`ChildProcess` の `shell` オプションを使用したりする場合によく発生します。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```
:::


### `subprocess[Symbol.dispose]()` {#subprocesssymboldispose}

**追加: v20.5.0, v18.18.0**

::: warning [Stable: 1 - 試験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

`'SIGTERM'` を指定して [`subprocess.kill()`](/ja/nodejs/api/child_process#subprocesskillsignal) を呼び出します。

### `subprocess.killed` {#subprocesskilled}

**追加: v0.5.10**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `subprocess.kill()` が子プロセスにシグナルを正常に送信するために使用された後、`true` に設定されます。

`subprocess.killed` プロパティは、子プロセスが `subprocess.kill()` からシグナルを正常に受信したかどうかを示します。 `killed` プロパティは、子プロセスが終了したことを示すものではありません。

### `subprocess.pid` {#subprocesspid}

**追加: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

子プロセスのプロセス識別子（PID）を返します。 エラーにより子プロセスの生成に失敗した場合、値は `undefined` であり、`error` が発生します。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```
:::

### `subprocess.ref()` {#subprocessref}

**追加: v0.7.10**

`subprocess.unref()` を呼び出した後に `subprocess.ref()` を呼び出すと、子プロセスの削除された参照カウントが復元され、親プロセスは、自身が終了する前に子プロセスが終了するのを強制的に待ちます。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```
:::


### `subprocess.send(message[, sendHandle[, options]][, callback])` {#subprocesssendmessage-sendhandle-options-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v5.8.0 | `options` パラメーター、特に `keepOpen` オプションがサポートされるようになりました。 |
| v5.0.0 | このメソッドは、フロー制御のためにブール値を返すようになりました。 |
| v4.0.0 | `callback` パラメーターがサポートされるようになりました。 |
| v0.5.9 | v0.5.9 で追加されました |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/ja/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined`、または [`net.Socket`](/ja/nodejs/api/net#class-netsocket)、[`net.Server`](/ja/nodejs/api/net#class-netserver)、または [`dgram.Socket`](/ja/nodejs/api/dgram#class-dgramsocket) オブジェクト。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `options` 引数（存在する場合）は、特定の種類のハンドルの送信をパラメーター化するために使用されるオブジェクトです。`options` は次のプロパティをサポートしています。
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `net.Socket` のインスタンスを渡すときに使用できる値です。`true` の場合、ソケットは送信プロセスで開いたままになります。**デフォルト:** `false`。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

親プロセスと子プロセスの間に IPC チャネルが確立されている場合（つまり、[`child_process.fork()`](/ja/nodejs/api/child_process#child_processforkmodulepath-args-options) を使用している場合）、`subprocess.send()` メソッドを使用して、子プロセスにメッセージを送信できます。子プロセスが Node.js インスタンスの場合、これらのメッセージは [`'message'`](/ja/nodejs/api/process#event-message) イベントを介して受信できます。

メッセージはシリアライズと解析を経由します。結果のメッセージは、最初に送信されたものと同じではない可能性があります。

たとえば、親スクリプトでは次のようになります。

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const forkedProcess = fork(`${__dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Causes the child to print: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```

```js [ESM]
import { fork } from 'node:child_process';
const forkedProcess = fork(`${import.meta.dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Causes the child to print: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```
:::

そして、子スクリプト `'sub.js'` は次のようになります。

```js [ESM]
process.on('message', (message) => {
  console.log('CHILD got message:', message);
});

// Causes the parent to print: PARENT got message: { foo: 'bar', baz: null }
process.send({ foo: 'bar', baz: NaN });
```
子 Node.js プロセスには、子プロセスが親プロセスにメッセージを送信できるようにする独自の [`process.send()`](/ja/nodejs/api/process#processsendmessage-sendhandle-options-callback) メソッドがあります。

`{cmd: 'NODE_foo'}` メッセージを送信する場合は特別なケースがあります。`cmd` プロパティに `NODE_` プレフィックスを含むメッセージは、Node.js コア内で使用するために予約されており、子の [`'message'`](/ja/nodejs/api/process#event-message) イベントでは発行されません。代わりに、このようなメッセージは `'internalMessage'` イベントを使用して発行され、Node.js 内部で消費されます。アプリケーションは、このようなメッセージの使用や `'internalMessage'` イベントのリッスンを避ける必要があります。予告なしに変更される可能性があるためです。

`subprocess.send()` に渡すことができるオプションの `sendHandle` 引数は、TCP サーバーまたはソケットオブジェクトを子プロセスに渡すためのものです。子プロセスは、[`'message'`](/ja/nodejs/api/process#event-message) イベントに登録されたコールバック関数に渡される2番目の引数としてオブジェクトを受け取ります。ソケットで受信およびバッファリングされたデータは、子に送信されません。IPC ソケットの送信は Windows ではサポートされていません。

オプションの `callback` は、メッセージが送信された後、子プロセスがそれを受信する前に呼び出される関数です。この関数は、成功した場合は `null`、失敗した場合は [`Error`](/ja/nodejs/api/errors#class-error) オブジェクトの単一の引数で呼び出されます。

`callback` 関数が提供されず、メッセージを送信できない場合、[`ChildProcess`](/ja/nodejs/api/child_process#class-childprocess) オブジェクトによって `'error'` イベントが発行されます。これは、たとえば、子プロセスがすでに終了している場合に発生する可能性があります。

`subprocess.send()` は、チャネルが閉じている場合、または未送信メッセージのバックログが、それ以上送信しない方が賢明な閾値を超えた場合に `false` を返します。それ以外の場合、メソッドは `true` を返します。`callback` 関数を使用して、フロー制御を実装できます。


#### 例: サーバーオブジェクトの送信 {#example-sending-a-server-object}

`sendHandle` 引数は、例えば、以下の例に示すように、TCPサーバーオブジェクトのハンドルを子プロセスに渡すために使用できます。

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const subprocess = fork('subprocess.js');

// サーバーオブジェクトを開き、ハンドルを送信します。
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const subprocess = fork('subprocess.js');

// サーバーオブジェクトを開き、ハンドルを送信します。
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```
:::

子プロセスは、サーバーオブジェクトを次のように受信します。

```js [ESM]
process.on('message', (m, server) => {
  if (m === 'server') {
    server.on('connection', (socket) => {
      socket.end('handled by child');
    });
  }
});
```
サーバーが親と子の間で共有されると、一部の接続は親が処理し、一部は子が処理できます。

上記の例では、`node:net` モジュールを使用して作成されたサーバーを使用していますが、`node:dgram` モジュールのサーバーは、`'connection'` の代わりに `'message'` イベントをリッスンし、`server.listen()` の代わりに `server.bind()` を使用することを除いて、まったく同じワークフローを使用します。ただし、これはUnixプラットフォームでのみサポートされています。

#### 例: ソケットオブジェクトの送信 {#example-sending-a-socket-object}

同様に、`sendHandler` 引数を使用して、ソケットのハンドルを子プロセスに渡すことができます。以下の例では、それぞれ「通常」または「特別」な優先度で接続を処理する2つの子を生成します。

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// サーバーを開き、ソケットを子に送信します。 pauseOnConnectを使用して、
// ソケットが子プロセスに送信される前に読み取られないようにします。
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // これが特別な優先度の場合...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // これは通常の優先度です。
  normal.send('socket', socket);
});
server.listen(1337);
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// サーバーを開き、ソケットを子に送信します。 pauseOnConnectを使用して、
// ソケットが子プロセスに送信される前に読み取られないようにします。
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // これが特別な優先度の場合...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // これは通常の優先度です。
  normal.send('socket', socket);
});
server.listen(1337);
```
:::

`subprocess.js` は、イベントコールバック関数に渡される2番目の引数としてソケットハンドルを受信します。

```js [ESM]
process.on('message', (m, socket) => {
  if (m === 'socket') {
    if (socket) {
      // クライアントソケットが存在することを確認してください。
      // ソケットは、送信されてから子プロセスで受信されるまでの間に閉じられる可能性があります。
      socket.end(`Request handled with ${process.argv[2]} priority`);
    }
  }
});
```
サブプロセスに渡されたソケットで `.maxConnections` を使用しないでください。親はソケットが破棄されたことを追跡できません。

サブプロセスの任意の `'message'` ハンドラーは、接続が子への送信にかかる時間内に閉じられた可能性があるため、`socket` が存在することを確認する必要があります。


### `subprocess.signalCode` {#subprocesssignalcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

`subprocess.signalCode` プロパティは、子プロセスが受信したシグナル（もしあれば）を示します。それ以外の場合は `null` です。

### `subprocess.spawnargs` {#subprocessspawnargs}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

`subprocess.spawnargs` プロパティは、子プロセスが起動された際のコマンドライン引数の完全なリストを表します。

### `subprocess.spawnfile` {#subprocessspawnfile}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`subprocess.spawnfile` プロパティは、起動された子プロセスの実行可能ファイル名を示します。

[`child_process.fork()`](/ja/nodejs/api/child_process#child_processforkmodulepath-args-options) の場合、その値は [`process.execPath`](/ja/nodejs/api/process#processexecpath) と等しくなります。[`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options) の場合、その値は実行可能ファイルの名前になります。[`child_process.exec()`](/ja/nodejs/api/child_process#child_processexeccommand-options-callback) の場合、その値は子プロセスが起動されるシェルの名前になります。

### `subprocess.stderr` {#subprocessstderr}

**Added in: v0.1.90**

- [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

子プロセスの `stderr` を表す `Readable Stream` です。

子プロセスが `stdio[2]` を `'pipe'` 以外に設定して生成された場合、これは `null` になります。

`subprocess.stderr` は `subprocess.stdio[2]` のエイリアスです。両方のプロパティは同じ値を参照します。

子プロセスが正常に生成されなかった場合、`subprocess.stderr` プロパティは `null` または `undefined` になる可能性があります。


### `subprocess.stdin` {#subprocessstdin}

**追加: v0.1.90**

- [\<stream.Writable\>](/ja/nodejs/api/stream#class-streamwritable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

子プロセスの `stdin` を表す `Writable Stream` です。

子プロセスがすべての入力を読み込むのを待っている場合、このストリームが `end()` を介して閉じられるまで、子プロセスは続行されません。

子プロセスが `stdio[0]` を `'pipe'` 以外の何かに設定して生成された場合、これは `null` になります。

`subprocess.stdin` は `subprocess.stdio[0]` のエイリアスです。両方のプロパティは同じ値を参照します。

子プロセスが正常に生成されなかった場合、`subprocess.stdin` プロパティは `null` または `undefined` になる可能性があります。

### `subprocess.stdio` {#subprocessstdio}

**追加: v0.7.10**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

[`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options) に渡された [`stdio`](/ja/nodejs/api/child_process#optionsstdio) オプションの位置に対応する、子プロセスへのパイプの疎配列。`subprocess.stdio[0]`、`subprocess.stdio[1]`、`subprocess.stdio[2]` は、それぞれ `subprocess.stdin`、`subprocess.stdout`、`subprocess.stderr` としても使用できます。

次の例では、子プロセスの fd `1` (stdout) のみがパイプとして構成されているため、親プロセスの `subprocess.stdio[1]` のみがストリームであり、配列内の他のすべての値は `null` です。

::: code-group
```js [CJS]
const assert = require('node:assert');
const fs = require('node:fs');
const child_process = require('node:child_process');

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```

```js [ESM]
import assert from 'node:assert';
import fs from 'node:fs';
import child_process from 'node:child_process';

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```
:::

子プロセスが正常に生成されなかった場合、`subprocess.stdio` プロパティは `undefined` になる可能性があります。


### `subprocess.stdout` {#subprocessstdout}

**Added in: v0.1.90**

- [\<stream.Readable\>](/ja/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

子プロセスの `stdout` を表す `Readable Stream` です。

子プロセスが `'pipe'` 以外の値に設定された `stdio[1]` で生成された場合、これは `null` になります。

`subprocess.stdout` は `subprocess.stdio[1]` のエイリアスです。どちらのプロパティも同じ値を参照します。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```
:::

子プロセスが正常に生成されなかった場合、`subprocess.stdout` プロパティは `null` または `undefined` になることがあります。

### `subprocess.unref()` {#subprocessunref}

**Added in: v0.7.10**

デフォルトでは、親プロセスは切り離された子プロセスが終了するのを待ちます。特定の `subprocess` が終了するのを親プロセスが待たないようにするには、`subprocess.unref()` メソッドを使用します。そうすることで、親のイベントループは、その参照カウントに子プロセスを含めなくなり、子プロセスと親プロセスの間に確立された IPC チャネルがない限り、親は子とは独立して終了できます。

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::


## `maxBuffer` と Unicode {#maxbuffer-and-unicode}

`maxBuffer` オプションは、`stdout` または `stderr` で許可される最大バイト数を指定します。この値を超えると、子プロセスは終了します。これは、UTF-8 や UTF-16 などのマルチバイト文字エンコーディングを含む出力に影響します。たとえば、`console.log('中文测试')` は、文字数は 4 文字だけですが、13 バイトの UTF-8 エンコードされたバイトを `stdout` に送信します。

## シェルの要件 {#shell-requirements}

シェルは `-c` スイッチを理解する必要があります。シェルが `'cmd.exe'` の場合は、`/d /s /c` スイッチを理解し、コマンドライン解析が互換性を持つ必要があります。

## Windows のデフォルトシェル {#default-windows-shell}

Microsoft は、ルート環境の `%COMSPEC%` に `'cmd.exe'` へのパスを含める必要があると規定していますが、子プロセスは常に同じ要件に従うとは限りません。したがって、シェルを生成できる `child_process` 関数では、`process.env.ComSpec` が利用できない場合、フォールバックとして `'cmd.exe'` が使用されます。

## 高度なシリアライズ {#advanced-serialization}

**追加: v13.2.0, v12.16.0**

子プロセスは、[`node:v8` モジュールのシリアライゼーション API](/ja/nodejs/api/v8#serialization-api) に基づく、IPC のためのシリアライゼーションメカニズムをサポートしており、これは [HTML の構造化クローンアルゴリズム](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) に基づいています。これは一般的に強力で、`BigInt`、`Map`、`Set`、`ArrayBuffer`、`TypedArray`、`Buffer`、`Error`、`RegExp` など、より多くの組み込み JavaScript オブジェクト型をサポートしています。

ただし、このフォーマットは JSON の完全なスーパーセットではなく、例えば、そのような組み込み型のオブジェクトに設定されたプロパティは、シリアライゼーションのステップを通じて引き継がれません。さらに、パフォーマンスは、渡されるデータの構造によっては JSON と同等ではない可能性があります。したがって、この機能は、[`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options) または [`child_process.fork()`](/ja/nodejs/api/child_process#child_processforkmodulepath-args-options) を呼び出すときに、`serialization` オプションを `'advanced'` に設定することによって、オプトインする必要があります。

