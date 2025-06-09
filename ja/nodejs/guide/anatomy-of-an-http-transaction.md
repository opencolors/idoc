---
title: Node.js の HTTP 処理の理解
description: Node.js で HTTP リクエストを処理するための包括的なガイド。サーバーの作成、リクエストとレスポンスの処理、ルーティング、エラー処理などを網羅しています。
head:
  - - meta
    - name: og:title
      content: Node.js の HTTP 処理の理解 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js で HTTP リクエストを処理するための包括的なガイド。サーバーの作成、リクエストとレスポンスの処理、ルーティング、エラー処理などを網羅しています。
  - - meta
    - name: twitter:title
      content: Node.js の HTTP 処理の理解 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js で HTTP リクエストを処理するための包括的なガイド。サーバーの作成、リクエストとレスポンスの処理、ルーティング、エラー処理などを網羅しています。
---


# HTTPトランザクションの構造

このガイドの目的は、Node.jsのHTTP処理プロセスに関する確固たる理解を与えることです。言語やプログラミング環境に関わらず、HTTPリクエストがどのように機能するかについて一般的な知識を持っていることを前提とします。また、Node.jsのEventEmitterとStreamについても多少の知識があることを前提とします。もしそれらにあまり馴染みがない場合は、それぞれのAPIドキュメントをざっと読んでみる価値があります。

## サーバーの作成

NodeのWebサーバーアプリケーションは、ある時点でWebサーバーオブジェクトを作成する必要があります。これは`createServer`を使用することで行われます。

```javascript
const http = require('node:http');
const server = http.createServer((request, response) => {
    // ここで魔法が起こる！
});
```

`createServer`に渡される関数は、そのサーバーに対して行われたすべてのHTTPリクエストに対して一度呼び出されるため、リクエストハンドラーと呼ばれます。実際、`createServer`によって返されるServerオブジェクトはEventEmitterであり、ここで示しているのはサーバーオブジェクトを作成し、後でリスナーを追加するための単なる省略形です。

```javascript
const server = http.createServer();
server.on('request', (request, response) => {
    // ここでも同じような魔法が起こる！
});
```

HTTPリクエストがサーバーに到達すると、Nodeはトランザクション、リクエスト、レスポンスを処理するためのいくつかの便利なオブジェクトとともにリクエストハンドラー関数を呼び出します。これらについては後ほど説明します。実際にリクエストを処理するためには、サーバーオブジェクトで`listen`メソッドを呼び出す必要があります。ほとんどの場合、`listen`に渡す必要があるのは、サーバーがリッスンするポート番号だけです。他にもいくつかのオプションがあるので、APIリファレンスを参照してください。

## メソッド、URL、ヘッダー

リクエストを処理する際、最初に行いたいのは、メソッドとURLを確認し、適切なアクションを実行できるようにすることでしょう。Node.jsは、リクエストオブジェクトに便利なプロパティを配置することで、これを比較的容易にしています。

```javascript
const { method, url } = request;
```

リクエストオブジェクトは`IncomingMessage`のインスタンスです。ここでのメソッドは常に通常のHTTPメソッド/動詞になります。URLは、サーバー、プロトコル、ポートを含まない完全なURLです。典型的なURLの場合、これは3番目のスラッシュ以降のすべてを意味します。

ヘッダーもすぐそこにあります。それらはリクエストの`headers`という独自のオブジェクトにあります。

```javascript
const { headers } = request;
const userAgent = headers['user-agent'];
```

ここで重要なのは、すべてのヘッダーは、クライアントが実際にどのように送信したかに関わらず、小文字のみで表されることです。これにより、あらゆる目的でヘッダーを解析する作業が簡素化されます。

一部のヘッダーが繰り返される場合、その値は上書きされるか、ヘッダーに応じてコンマ区切りの文字列として結合されます。場合によっては、これは問題になる可能性があるため、`rawHeaders`も利用できます。


## リクエストボディ

POSTまたはPUTリクエストを受信する際、リクエストボディはアプリケーションにとって重要になる場合があります。ボディデータへのアクセスは、リクエストヘッダーへのアクセスよりも少し複雑です。ハンドラーに渡されるリクエストオブジェクトは、`ReadableStream`インターフェースを実装しています。このストリームは、他のストリームと同様に、リスニングしたり、別の場所にパイプすることができます。ストリームの`'data'`イベントと`'end'`イベントをリッスンすることで、ストリームから直接データを取得できます。

各`'data'`イベントで出力されるチャンクは`Buffer`です。それが文字列データであることがわかっている場合は、データを配列に収集し、`'end'`で連結して文字列化するのが最善の方法です。

```javascript
let body = [];
request.on('data', chunk => {
    body.push(chunk);
});
request.on('end', () => {
    body = Buffer.concat(body).toString();
    // この時点で、'body'にはリクエストボディ全体が文字列として格納されています
});
```
::: tip NOTE
これは少し面倒に思えるかもしれませんが、多くの場合、実際そうです。幸いなことに、npmには`concat-stream`や`body`のようなモジュールがあり、このロジックの一部を隠すのに役立ちます。その道に進む前に、何が起こっているのかをよく理解しておくことが重要です。それがあなたがここにいる理由です！
:::

## エラーに関する簡単な注意事項

リクエストオブジェクトは`ReadableStream`であるため、`EventEmitter`でもあり、エラーが発生するとEventEmitterのように動作します。

リクエストストリームのエラーは、ストリームで`'error'`イベントを発行することによって発生します。そのイベントのリスナーがない場合、エラーがスローされ、Node.jsプログラムがクラッシュする可能性があります。したがって、ログに記録して続行する場合でも、リクエストストリームに`'error'`リスナーを追加する必要があります。（ただし、何らかのHTTPエラー応答を送信するのがおそらく最善です。これについては後で詳しく説明します。）

```javascript
request.on('error', err => {
    // これはエラーメッセージとスタックトレースをstderrに出力します。
    console.error(err.stack);
});
```

他の抽象化やツールなど、[これらのエラーを処理する](/ja/nodejs/api/errors)他の方法もありますが、エラーは起こりうるものであり、対処する必要があることを常に意識してください。


## これまでの内容

現時点では、サーバーの作成、リクエストからのメソッド、URL、ヘッダー、および本文の取得について説明しました。これらをすべてまとめると、次のようになるかもしれません。

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', err => console.error(err));
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        // この時点で、ヘッダー、メソッド、URL、および本文が揃っているので、
        // このリクエストに応答するために必要な処理を行うことができます。
    });
});

.listen(8080); // このサーバーを有効にし、ポート 8080 でリッスンします。
```

この例を実行すると、リクエストを受信できますが、応答することはできません。実際、Web ブラウザでこの例にアクセスすると、何もクライアントに返送されないため、リクエストはタイムアウトします。

これまでのところ、`ServerResponse`のインスタンスである response オブジェクトにはまったく触れていません。これは`WritableStream`です。これには、クライアントにデータを送り返すための便利なメソッドが多数含まれています。これについては、次に説明します。

## HTTPステータスコード

設定しない場合、レスポンスのHTTPステータスコードは常に200になります。もちろん、すべてのHTTPレスポンスがこれを保証するわけではなく、いつか別のステータスコードを送信する必要が生じるはずです。そのためには、`statusCode`プロパティを設定します。

```javascript
response.statusCode = 404; // リソースが見つからなかったことをクライアントに伝えます。
```

これに対するいくつかのショートカットもすぐにわかります。

## レスポンスヘッダーの設定

ヘッダーは、`setHeader`と呼ばれる便利なメソッドを通じて設定されます。

```javascript
response.setHeader('Content-Type', 'application/json');
response.setHeader('X-Powered-By', 'bacon');
```

レスポンスにヘッダーを設定する場合、ヘッダー名の大文字と小文字は区別されません。ヘッダーを繰り返し設定すると、最後に設定した値が送信される値になります。


## ヘッダーデータを明示的に送信する

すでに説明したヘッダーとステータスコードの設定方法は、「暗黙的なヘッダー」を使用することを前提としています。これは、Nodeが本体データを送信する前に、適切なタイミングでヘッダーを送信することを期待しているということです。

必要であれば、ヘッダーをレスポンスストリームに明示的に書き込むことができます。これを行うには、ステータスコードとヘッダーをストリームに書き込む`writeHead`というメソッドがあります。

## ヘッダーデータを明示的に送信する

```javascript
response.writeHead(200, {
    'Content-Type': 'application/json',
    'X-Powered-By': 'bacon',
});
```

ヘッダーを設定したら（暗黙的または明示的に）、レスポンスデータの送信を開始できます。

## レスポンスボディの送信

レスポンスオブジェクトは`WritableStream`なので、レスポンスボディをクライアントに書き出すのは、通常のストリームメソッドを使用するだけです。

```javascript
response.write('<html>');
response.write('<body>');
response.write('<h1>Hello, World!</h1>');
response.write('</body>');
response.write('</html>');
response.end();
```

ストリームの`end`関数は、ストリームの最後のデータとして送信するオプションのデータを受け取ることもできるため、上記の例は次のように簡略化できます。

```javascript
response.end('<html><body><h1>hello,world!</h1></body></html>');
```

::: tip NOTE
本体にデータのチャンクを書き込み始める前に、ステータスとヘッダーを設定することが重要です。これは、HTTPレスポンスではヘッダーが本体の前に来るため、理にかなっています。
:::

## エラーに関するもう1つの簡単なこと

レスポンスストリームは「error」イベントも発行することができ、いずれそれに対処する必要があります。リクエストストリームのエラーに関するアドバイスはすべてここにも当てはまります。

## すべてをまとめる

HTTPレスポンスの作成について学んだので、すべてをまとめてみましょう。前の例を基に、ユーザーから送信されたすべてのデータを送り返すサーバーを作成します。そのデータを`JSON.stringify`を使用してJSONとしてフォーマットします。

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request
      .on('error', err => {
        console.error(err);
      })
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        // BEGINNING OF NEW STUFF
        response.on('error', err => {
          console.error(err);
        });
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        // Note: the 2 lines above could be replaced with this next one:
        // response.writeHead(200, {'Content-Type': 'application/json'})
        const responseBody = { headers, method, url, body };
        response.write(JSON.stringify(responseBody));
        response.end();
        // Note: the 2 lines above could be replaced with this next one:
        // response.end(JSON.stringify(responseBody))
        // END OF NEW STUFF
      });
  })
  .listen(8080);
```


## EchoServer の例

前の例を簡略化して、シンプルなエコーサーバーを作成してみましょう。これは、リクエストで受信したデータをそのままレスポンスで返信するものです。必要なのは、リクエストストリームからデータを取得し、それをレスポンスストリームに書き込むことだけです。以前に行ったことと似ています。

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        response.end(body);
    });
});

.listen(8080);
```

これを少し調整してみましょう。以下の条件でのみエコーを送信するようにします。
- リクエストメソッドは POST であること。
- URL は /echo であること。

それ以外の場合は、単純に 404 を返信します。

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
      let body = [];
      request
        .on('data', chunk => {
          body.push(chunk);
        })
        .on('end', () => {
          body = Buffer.concat(body).toString();
          response.end(body);
        });
    } else {
      response.statusCode = 404;
      response.end();
    }
  })
  .listen(8080);
```

::: tip NOTE
このように URL をチェックすることで、「ルーティング」の一種を行っています。他のルーティング形式は、`switch` ステートメントのように単純なものから、`express` のようなフレームワーク全体のように複雑なものまであります。ルーティングだけを行うものを探している場合は、`router` を試してみてください。
:::

素晴らしい！それでは、これをさらに簡略化してみましょう。リクエストオブジェクトは `ReadableStream` であり、レスポンスオブジェクトは `WritableStream` であることを思い出してください。つまり、`pipe` を使用して、あるオブジェクトから別のオブジェクトにデータを送信できます。これはエコーサーバーでまさにやりたいことです！

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

やったー！ストリームだ！

しかし、まだ終わりではありません。このガイドで何度も述べているように、エラーは発生する可能性があり、それに対処する必要があります。

リクエストストリームのエラーを処理するには、エラーを `stderr` にログ出力し、`Bad Request` を示す 400 ステータスコードを送信します。ただし、実際のアプリケーションでは、エラーを調べて、正しいステータスコードとメッセージを把握する必要があります。エラーに関する通常の処理と同様に、[エラーに関するドキュメント](/ja/nodejs/api/errors)を参照してください。

レスポンスについては、エラーを `stderr` にログ出力するだけです。

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    request.on('error', err => {
        console.error(err);
        response.statusCode = 400;
        response.end();
    });
    response.on('error', err => {
        console.error(err);
    });
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

これで、HTTP リクエストの処理に関する基本のほとんどを網羅しました。現時点で、次のことができるはずです。
- `request` ハンドラー関数を使用して HTTP サーバーをインスタンス化し、ポートをリッスンさせる。
- `request` オブジェクトからヘッダー、URL、メソッド、およびボディデータを取得する。
- `request` オブジェクトの URL やその他のデータに基づいてルーティングを決定する。
- `response` オブジェクトを介して、ヘッダー、HTTP ステータスコード、およびボディデータを送信する。
- `request` オブジェクトからレスポンスオブジェクトにデータをパイプする。
- `request` ストリームと `response` ストリームの両方でストリームエラーを処理する。

これらの基本から、多くの一般的なユースケースに対応する Node.js HTTP サーバーを構築できます。これらの API は他にも多くの機能を提供しているので、[`EventEmitters`](/ja/nodejs/api/events)、[`Streams`](/ja/nodejs/api/stream)、および [`HTTP`](/ja/nodejs/api/http) の API ドキュメントを必ずお読みください。

