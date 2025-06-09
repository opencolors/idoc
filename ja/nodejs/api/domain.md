---
title: Node.js ドキュメント - ドメインモジュール
description: Node.jsのドメインモジュールは、非同期コードでのエラーと例外の処理方法を提供し、エラーマネジメントとクリーンアップ操作をより堅牢にします。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - ドメインモジュール | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのドメインモジュールは、非同期コードでのエラーと例外の処理方法を提供し、エラーマネジメントとクリーンアップ操作をより堅牢にします。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - ドメインモジュール | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのドメインモジュールは、非同期コードでのエラーと例外の処理方法を提供し、エラーマネジメントとクリーンアップ操作をより堅牢にします。
---


# Domain {#domain}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v8.8.0 | VM コンテキストで作成された `Promise` は、`.domain` プロパティを持たなくなりました。ただし、ハンドラーは適切なドメインで実行され、メインコンテキストで作成された `Promise` は `.domain` プロパティを引き続き保持します。 |
| v8.0.0 | `Promise` のハンドラーは、チェーンの最初の Promise が作成されたドメインで呼び出されるようになりました。 |
| v1.4.2 | 非推奨: v1.4.2 以降 |
:::

::: danger [Stable: 0 - 非推奨]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨
:::

**ソースコード:** [lib/domain.js](https://github.com/nodejs/node/blob/v23.5.0/lib/domain.js)

**このモジュールは非推奨になる予定です。** 代替 API が確定したら、このモジュールは完全に非推奨になります。ほとんどの開発者はこのモジュールを使用する必要はありません。ドメインが提供する機能をどうしても使用する必要がある場合は、当面はそれに依存できますが、将来的には別のソリューションに移行する必要があることを想定しておく必要があります。

ドメインは、複数の異なる IO 操作を単一のグループとして処理する方法を提供します。ドメインに登録されたイベントエミッターまたはコールバックのいずれかが `'error'` イベントを発生させるか、エラーをスローすると、ドメインオブジェクトに通知されます。これにより、エラーのコンテキストが `process.on('uncaughtException')` ハンドラーで失われたり、プログラムがエラーコードで即座に終了したりすることを防ぎます。

## 警告: エラーを無視しないでください！ {#warning-dont-ignore-errors!}

ドメインのエラーハンドラーは、エラーが発生したときにプロセスを停止することの代替手段ではありません。

JavaScript における [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) の性質上、参照をリークしたり、他の種類の未定義の脆弱な状態を作成したりすることなく、安全に「中断したところから再開する」方法はほとんどありません。

スローされたエラーに対応する最も安全な方法は、プロセスをシャットダウンすることです。もちろん、通常の Web サーバーでは、多くのオープンな接続が存在する可能性があり、誰かがトリガーしたエラーのために、それらを突然シャットダウンするのは妥当ではありません。

より良いアプローチは、エラーをトリガーしたリクエストにエラー応答を送信し、他のリクエストが通常の時間内に完了できるようにし、そのワーカーでの新しいリクエストのリスニングを停止することです。

このように、`domain` の使用はクラスターモジュールと密接に関連しています。プライマリプロセスは、ワーカーがエラーに遭遇したときに新しいワーカーをフォークできるからです。複数のマシンにスケールする Node.js プログラムの場合、ターミネーティングプロキシまたはサービスレジストリは障害を記録し、それに応じて対応できます。

たとえば、これは良い考えではありません。

```js [ESM]
// XXX 警告！悪い考えです！

const d = require('node:domain').create();
d.on('error', (er) => {
  // このエラーはプロセスをクラッシュさせませんが、それよりも悪いことをします！
  // プロセスの突然の再起動を防いでも、これが発生すると多くのリソースがリークします。
  // これは process.on('uncaughtException') と同じくらい悪いことです！
  console.log(`error, but oh well ${er.message}`);
});
d.run(() => {
  require('node:http').createServer((req, res) => {
    handleRequest(req, res);
  }).listen(PORT);
});
```
ドメインのコンテキストと、プログラムを複数のワーカープロセスに分離することによる回復力を使用することで、より適切に対応し、より安全にエラーを処理できます。

```js [ESM]
// はるかに良いです！

const cluster = require('node:cluster');
const PORT = +process.env.PORT || 1337;

if (cluster.isPrimary) {
  // より現実的なシナリオでは、2 つ以上のワーカーを使用し、
  // プライマリとワーカーを同じファイルに配置しないかもしれません。
  //
  // また、ログ記録を少し凝ったものにしたり、DoS 攻撃やその他の
  // 悪意のある動作を防ぐために必要なカスタムロジックを実装したりすることもできます。
  //
  // クラスターのドキュメントのオプションを参照してください。
  //
  // 重要なことは、プライマリが行うことが非常に少なく、
  // 予期しないエラーに対する回復力が高まるということです。

  cluster.fork();
  cluster.fork();

  cluster.on('disconnect', (worker) => {
    console.error('disconnect!');
    cluster.fork();
  });

} else {
  // ワーカー
  //
  // ここにバグを配置します！

  const domain = require('node:domain');

  // リクエストを処理するためにワーカープロセスを使用する方法の詳細については、
  // クラスターのドキュメントを参照してください。仕組み、注意点など。

  const server = require('node:http').createServer((req, res) => {
    const d = domain.create();
    d.on('error', (er) => {
      console.error(`error ${er.stack}`);

      // 危険な領域にいます！
      // 定義上、予期しないことが発生しました。
      // おそらく望んでいなかったことです。
      // これから何が起こるかわかりません！十分に注意してください！

      try {
        // 30 秒以内にシャットダウンするようにします
        const killtimer = setTimeout(() => {
          process.exit(1);
        }, 30000);
        // ただし、そのためにプロセスを開いたままにしないでください！
        killtimer.unref();

        // 新しいリクエストの受付を停止します。
        server.close();

        // プライマリに死亡を通知します。これにより、クラスタープライマリで
        // 'disconnect' がトリガーされ、新しいワーカーがフォークされます。
        cluster.worker.disconnect();

        // 問題をトリガーしたリクエストにエラーを送信しようとします
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('申し訳ありませんが、問題が発生しました！\n');
      } catch (er2) {
        // まあ、この時点では何もできません。
        console.error(`500 の送信中にエラーが発生しました！ ${er2.stack}`);
      }
    });

    // req と res はこのドメインが存在する前に作成されたため、
    // 明示的に追加する必要があります。
    // 以下の暗黙的 vs 明示的なバインディングの説明を参照してください。
    d.add(req);
    d.add(res);

    // ドメインでハンドラー関数を実行します。
    d.run(() => {
      handleRequest(req, res);
    });
  });
  server.listen(PORT);
}

// この部分は重要ではありません。単なるルーティングの例です。
// ここに凝ったアプリケーションロジックを配置します。
function handleRequest(req, res) {
  switch (req.url) {
    case '/error':
      // いくつかの非同期処理を実行してから...
      setTimeout(() => {
        // おっと！
        flerb.bark();
      }, timeout);
      break;
    default:
      res.end('ok');
  }
}
```

## `Error` オブジェクトへの追加 {#additions-to-error-objects}

`Error` オブジェクトがドメインを経由するたびに、いくつかの追加フィールドが追加されます。

- `error.domain`: エラーを最初に処理したドメイン。
- `error.domainEmitter`: エラーオブジェクトを持つ `'error'` イベントを発行したイベントエミッタ。
- `error.domainBound`: ドメインにバインドされ、最初のエラーとして渡されたコールバック関数。
- `error.domainThrown`: エラーがスロー、発行、またはバインドされたコールバック関数に渡されたかどうかを示すブール値。

## 暗黙的なバインディング {#implicit-binding}

ドメインが使用されている場合、すべての **新しい** `EventEmitter` オブジェクト (Stream オブジェクト、リクエスト、レスポンスなどを含む) は、作成時にアクティブなドメインに暗黙的にバインドされます。

さらに、( `fs.open()` やその他のコールバックを受け取るメソッドなど) 低レベルのイベントループリクエストに渡されるコールバックは、自動的にアクティブなドメインにバインドされます。それらがスローすると、ドメインがエラーをキャッチします。

過剰なメモリ使用量を防ぐために、`Domain` オブジェクト自体は、アクティブなドメインの子として暗黙的に追加されません。もしそうであれば、リクエストおよびレスポンスオブジェクトが適切にガベージコレクションされるのを防ぐのが容易になりすぎます。

`Domain` オブジェクトを親の `Domain` の子としてネストするには、明示的に追加する必要があります。

暗黙的なバインディングは、スローされたエラーと `'error'` イベントを `Domain` の `'error'` イベントにルーティングしますが、`EventEmitter` を `Domain` に登録しません。暗黙的なバインディングは、スローされたエラーと `'error'` イベントのみを処理します。

## 明示的なバインディング {#explicit-binding}

場合によっては、使用されているドメインが、特定のイベントエミッタに使用するべきドメインではないことがあります。または、イベントエミッタがあるドメインのコンテキストで作成されたが、代わりに別のドメインにバインドされるべき場合があります。

たとえば、HTTPサーバーに使用するドメインが1つあるかもしれませんが、リクエストごとに個別のドメインを使用したい場合があります。

それは明示的なバインディングを介して可能です。

```js [ESM]
// サーバーのトップレベルドメインを作成します
const domain = require('node:domain');
const http = require('node:http');
const serverDomain = domain.create();

serverDomain.run(() => {
  // サーバーはserverDomainのスコープ内で作成されます
  http.createServer((req, res) => {
    // ReqとresもserverDomainのスコープ内で作成されます
    // ただし、リクエストごとに個別のドメインを持つことを好みます。
    // 最初にそれを作成し、reqとresをそれに追加します。
    const reqd = domain.create();
    reqd.add(req);
    reqd.add(res);
    reqd.on('error', (er) => {
      console.error('Error', er, req.url);
      try {
        res.writeHead(500);
        res.end('Error occurred, sorry.');
      } catch (er2) {
        console.error('Error sending 500', er2, req.url);
      }
    });
  }).listen(1337);
});
```

## `domain.create()` {#domaincreate}

- 戻り値: [\<Domain\>](/ja/nodejs/api/domain#class-domain)

## Class: `Domain` {#class-domain}

- 継承元: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

`Domain` クラスは、エラーとキャッチされない例外をアクティブな `Domain` オブジェクトにルーティングする機能をカプセル化します。

キャッチしたエラーを処理するには、`'error'` イベントをリッスンします。

### `domain.members` {#domainmembers}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

ドメインに明示的に追加されたタイマーとイベントエミッターの配列。

### `domain.add(emitter)` {#domainaddemitter}

- `emitter` [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter) | [\<Timer\>](/ja/nodejs/api/timers#timers) ドメインに追加されるエミッターまたはタイマー

エミッターをドメインに明示的に追加します。 エミッターによって呼び出されるイベントハンドラーがエラーをスローした場合、またはエミッターが `'error'` イベントを発行した場合、暗黙的なバインディングと同様に、ドメインの `'error'` イベントにルーティングされます。

これは、[`setInterval()`](/ja/nodejs/api/timers#setintervalcallback-delay-args) および [`setTimeout()`](/ja/nodejs/api/timers#settimeoutcallback-delay-args) から返されるタイマーでも機能します。 コールバック関数が例外をスローした場合、ドメインの `'error'` ハンドラーによってキャッチされます。

Timer または `EventEmitter` がすでにドメインにバインドされている場合、それはそのドメインから削除され、代わりにこのドメインにバインドされます。

### `domain.bind(callback)` {#domainbindcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) コールバック関数
- 戻り値: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) バインドされた関数

返される関数は、指定されたコールバック関数をラップしたものです。 返される関数が呼び出されると、スローされたエラーはドメインの `'error'` イベントにルーティングされます。

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.bind((er, data) => {
    // これが例外をスローした場合も、ドメインに渡されます。
    return cb(er, data ? JSON.parse(data) : null);
  }));
}

d.on('error', (er) => {
  // どこかでエラーが発生しました。 今それをスローすると、プログラムは通常の行番号とスタックメッセージでクラッシュします
  // with the normal line number and stack message.
});
```

### `domain.enter()` {#domainenter}

`enter()` メソッドは、アクティブなドメインを設定するために `run()`、`bind()`、および `intercept()` メソッドで使用される配管です。`domain.active` と `process.domain` をドメインに設定し、ドメインモジュールによって管理されるドメインスタックにドメインを暗黙的にプッシュします（ドメインスタックの詳細については、[`domain.exit()`](/ja/nodejs/api/domain#domainexit) を参照してください）。`enter()` の呼び出しは、ドメインにバインドされた非同期呼び出しと I/O 操作のチェーンの始まりを区切ります。

`enter()` を呼び出しても、アクティブなドメインのみが変更され、ドメイン自体は変更されません。`enter()` と `exit()` は、単一のドメインで任意の回数呼び出すことができます。

### `domain.exit()` {#domainexit}

`exit()` メソッドは、現在のドメインを終了し、ドメインスタックからポップします。実行が異なる非同期呼び出しのチェーンのコンテキストに切り替わる場合は常に、現在のドメインが終了していることを確認することが重要です。`exit()` の呼び出しは、ドメインにバインドされた非同期呼び出しと I/O 操作のチェーンの終わりまたは中断を区切ります。

現在の実行コンテキストに複数のネストされたドメインがバインドされている場合、`exit()` はこのドメイン内にネストされているすべてのドメインを終了します。

`exit()` を呼び出しても、アクティブなドメインのみが変更され、ドメイン自体は変更されません。`enter()` と `exit()` は、単一のドメインで任意の回数呼び出すことができます。

### `domain.intercept(callback)` {#domaininterceptcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) コールバック関数
- 戻り値: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) インターセプトされた関数

このメソッドは、[`domain.bind(callback)`](/ja/nodejs/api/domain#domainbindcallback) とほぼ同じです。ただし、スローされたエラーをキャッチすることに加えて、関数への最初の引数として送信された [`Error`](/ja/nodejs/api/errors#class-error) オブジェクトもインターセプトします。

このようにして、一般的な `if (err) return callback(err);` パターンを、1つの場所にある単一のエラーハンドラーに置き換えることができます。

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.intercept((data) => {
    // 注：最初引数は、'Error' 引数であると見なされ、
    // ドメインによってインターセプトされるため、
    // コールバックに渡されることはありません。

    // これがスローされた場合、エラー処理ロジックが
    // プログラム全体で繰り返される代わりに、
    // ドメインの 'error' イベントに移動できるように、
    // ドメインにも渡されます。
    return cb(null, JSON.parse(data));
  }));
}

d.on('error', (er) => {
  // どこかでエラーが発生しました。 今スローすると、
  // 通常の行番号とスタックメッセージでプログラムがクラッシュします。
});
```

### `domain.remove(emitter)` {#domainremoveemitter}

- `emitter` [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter) | [\<Timer\>](/ja/nodejs/api/timers#timers) ドメインから削除される emitter またはタイマー

[`domain.add(emitter)`](/ja/nodejs/api/domain#domainaddemitter) の反対です。指定された emitter からドメイン処理を削除します。

### `domain.run(fn[, ...args])` {#domainrunfn-args}

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

指定された関数をドメインのコンテキストで実行し、そのコンテキストで作成されたすべてのイベントエミッター、タイマー、および低レベルのリクエストを暗黙的にバインドします。オプションで、引数を関数に渡すことができます。

これは、ドメインを使用する最も基本的な方法です。

```js [ESM]
const domain = require('node:domain');
const fs = require('node:fs');
const d = domain.create();
d.on('error', (er) => {
  console.error('Caught error!', er);
});
d.run(() => {
  process.nextTick(() => {
    setTimeout(() => { // 何らかのさまざまな非同期処理をシミュレート
      fs.open('non-existent file', 'r', (er, fd) => {
        if (er) throw er;
        // 続行...
      });
    }, 100);
  });
});
```
この例では、プログラムがクラッシュするのではなく、`d.on('error')` ハンドラーがトリガーされます。

## ドメインと Promise {#domains-and-promises}

Node.js 8.0.0の時点で、Promise のハンドラーは、`.then()` または `.catch()` の呼び出し自体が行われたドメイン内で実行されます。

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then((v) => {
    // d2 で実行
  });
});
```
コールバックは、[`domain.bind(callback)`](/ja/nodejs/api/domain#domainbindcallback) を使用して特定のドメインにバインドできます。

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then(p.domain.bind((v) => {
    // d1 で実行
  }));
});
```
ドメインは Promise のエラー処理メカニズムを妨げません。言い換えれば、処理されない `Promise` のリジェクションに対して `'error'` イベントは発行されません。

