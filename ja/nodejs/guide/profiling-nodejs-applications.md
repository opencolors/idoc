---
title: Node.js アプリのパフォーマンス分析
description: Node.js の組み込みプロファイラーを使用して、アプリのパフォーマンスの瓶頸を特定し、パフォーマンスを向上させる方法を学びます。
head:
  - - meta
    - name: og:title
      content: Node.js アプリのパフォーマンス分析 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js の組み込みプロファイラーを使用して、アプリのパフォーマンスの瓶頸を特定し、パフォーマンスを向上させる方法を学びます。
  - - meta
    - name: twitter:title
      content: Node.js アプリのパフォーマンス分析 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js の組み込みプロファイラーを使用して、アプリのパフォーマンスの瓶頸を特定し、パフォーマンスを向上させる方法を学びます。
---


# Node.jsアプリケーションのプロファイリング

Node.jsアプリケーションをプロファイリングするために利用できるサードパーティツールは数多くありますが、多くの場合、最も簡単な方法はNode.jsの組み込みプロファイラを使用することです。組み込みプロファイラは、[V8内のプロファイラ](https://v8.dev/docs/profile)を使用しており、プログラムの実行中に一定の間隔でスタックをサンプリングします。これらのサンプルの結果を、jitコンパイルなどの重要な最適化イベントとともに、一連のティックとして記録します。

```bash
code-creation,LazyCompile,0,0x2d5000a337a0,396,"bp native array.js:1153:16",0x289f644df68,~
code-creation,LazyCompile,0,0x2d5000a33940,716,"hasOwnProperty native v8natives.js:198:30",0x289f64438d0,~
code-creation,LazyCompile,0,0x2d5000a33c20,284,"ToName native runtime.js:549:16",0x289f643bb28,~
code-creation,Stub,2,0x2d5000a33d40,182,"DoubleToIStub"
code-creation,Stub,2,0x2d5000a33e00,507,"NumberToStringStub"
```
以前は、ティックを解釈するためにV8のソースコードが必要でした。幸いなことに、Node.js 4.4.0以降、V8をソースから別途ビルドせずにこの情報を利用できるようにするツールが導入されました。組み込みプロファイラがアプリケーションのパフォーマンスに関する洞察を提供するのにどのように役立つかを見てみましょう。

ティックプロファイラの使いやすさを説明するために、簡単なExpressアプリケーションを使用します。アプリケーションには2つのハンドラがあります。1つは新しいユーザーをシステムに追加するためのものです。

```javascript
app.get('/newUser', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || users[username]) {
    return res.sendStatus(400);
  }
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  users[username] = { salt, hash };
  res.sendStatus(200);
});
```

もう1つは、ユーザー認証試行を検証するためのものです。

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  const { salt, hash } = users[username];
  const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  if (crypto.timingSafeEqual(hash, encryptHash)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
```

*これらは、Node.jsアプリケーションでユーザーを認証するための推奨されるハンドラではないことに注意してください。これらは純粋に説明のために使用されています。一般的に、独自の暗号認証メカニズムを設計しようとしないでください。既存の、実績のある認証ソリューションを使用する方がはるかに優れています。*

ここで、アプリケーションをデプロイし、ユーザーがリクエストの高レイテンシについて不満を抱いていると仮定します。組み込みプロファイラを使用してアプリを簡単に実行できます。

```bash
NODE_ENV=production node --prof app.js
```

`ab` (ApacheBench)を使用してサーバーに負荷をかけます。

```bash
curl -X GET "http://localhost:8080/newUser?username=matt&password=password"
ab -k -c 20 -n 250 "http://localhost:8080/auth?username=matt&password=password"
```

そして、abの出力を取得します。

```bash
Concurrency Level:      20
Time taken for tests:   46.932 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    5.33 [#/sec] (mean)
Time per request:       3754.556 [ms] (mean)
Time per request:       187.728 [ms] (mean, across all concurrent requests)
Transfer rate:          1.05 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   3755
  66%   3804
  75%   3818
  80%   3825
  90%   3845
  95%   3858
  98%   3874
  99%   3875
 100%   4225 (longest request)
```

この出力から、1秒あたり約5リクエストしか処理できておらず、平均リクエストのラウンドトリップに4秒弱かかっていることがわかります。実際の例では、ユーザーリクエストの代わりに多くの関数で多くの作業を行っている可能性がありますが、単純な例でも、正規表現のコンパイル、ランダムなソルトの生成、ユーザーパスワードからのユニークなハッシュの生成、またはExpressフレームワーク自体の中で時間が失われる可能性があります。

`--prof`オプションを使用してアプリケーションを実行したため、ティックファイルがアプリケーションのローカル実行と同じディレクトリに生成されました。形式は`isolate-0xnnnnnnnnnnnn-v8.log` (nは数字)である必要があります。

このファイルを理解するには、Node.jsバイナリにバンドルされているティックプロセッサを使用する必要があります。プロセッサを実行するには、`--prof-process`フラグを使用します。

```bash
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

お気に入りのテキストエディタでprocessed.txtを開くと、いくつかの異なる種類の情報が表示されます。ファイルはセクションに分割され、セクションはさらに言語ごとに分割されます。まず、概要セクションを見てみます。

```bash
[Summary]:
   ticks  total  nonlib   name
     79    0.2%    0.2%  JavaScript
  36703   97.2%   99.2%  C++
      7    0.0%    0.0%  GC
    767    2.0%          Shared libraries
    215    0.6%          Unaccounted
```

これは、収集されたすべてのサンプルの97％がC ++コードで発生したこと、および処理された出力の他のセクションを表示するときは、JavaScriptではなくC ++で行われている作業に最も注意を払う必要があることを示しています。これを念頭に置いて、次に[C ++]セクションを見つけます。このセクションには、どのC ++関数が最もCPU時間を費やしているかに関する情報が含まれています。

```bash
 [C++]:
   ticks  total  nonlib   name
  19557   51.8%   52.9%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
   4510   11.9%   12.2%  _sha1_block_data_order
   3165    8.4%    8.6%  _malloc_zone_malloc
```

上位3つのエントリがプログラムによって消費されるCPU時間の72.1％を占めていることがわかります。この出力から、少なくとも51.8％のCPU時間がPBKDF2という関数によって占められていることがすぐにわかります。これは、ユーザーのパスワードからのハッシュ生成に対応します。ただし、下位の2つのエントリがアプリケーションにどのように影響するかはすぐにはわからない場合があります（またはそうである場合は、例のためにそうではないふりをします）。これらの関数間の関係をよりよく理解するために、次に[ボトムアップ（ヘビー）プロファイル]セクションを見ていきます。このセクションには、各関数のプライマリ呼び出し元に関する情報が記載されています。このセクションを調べると、次のようになります。

```bash
  ticks parent  name
  19557   51.8%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
  19557  100.0%    v8::internal::Builtins::~Builtins()
  19557  100.0%      LazyCompile: ~pbkdf2 crypto.js:557:16
   4510   11.9%  _sha1_block_data_order
   4510  100.0%    LazyCompile: *pbkdf2 crypto.js:557:16
   4510  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
   3165    8.4%  _malloc_zone_malloc
   3161   99.9%    LazyCompile: *pbkdf2 crypto.js:557:16
   3161  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
```

このセクションの解析には、上記の生のティック数よりも少し手間がかかります。上記の各「コールスタック」内で、親列のパーセンテージは、上の行の関数が現在の行の関数によって呼び出されたサンプルのパーセンテージを示しています。たとえば、上記の`_sha1_block_data_order`の中間の「コールスタック」では、`_sha1_block_data_order`がサンプルの11.9％で発生したことがわかります。これは上記の生の数からわかっていました。ただし、ここでは、常にNode.js cryptoモジュール内のpbkdf2関数によって呼び出されたこともわかります。同様に、_malloc_zone_mallocがほとんど排他的に同じpbkdf2関数によって呼び出されたことがわかります。したがって、このビューの情報を使用すると、ユーザーのパスワードからのハッシュ計算は、上記の51.8％だけでなく、`_sha1_block_data_order`と`_malloc_zone_malloc`の呼び出しはpbkdf2関数の代わりに行われたため、上位3つの最もサンプリングされた関数のすべてのCPU時間を占めていることがわかります。

現時点では、パスワードベースのハッシュ生成が最適化のターゲットになるはずであることが非常に明確です。ありがたいことに、あなたは[非同期プログラミングの利点](https://nodesource.com/blog/why-asynchronous)を完全に内部化しており、ユーザーのパスワードからハッシュを生成する作業は同期的な方法で行われているため、イベントループを拘束していることに気付きます。これにより、ハッシュの計算中に他の着信リクエストを処理できなくなります。

この問題を解決するために、上記のハンドラに小さな変更を加えて、pbkdf2関数の非同期バージョンを使用します。

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  crypto.pbkdf2(
    password,
    users[username].salt,
    10000,
    512,
    'sha512',
    (err, hash) => {
      if (users[username].hash.toString() === hash.toString()) {
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    }
  );
});
```

非同期バージョンのアプリを使用した上記のabベンチマークの新しい実行では、次のようになります。

```bash
Concurrency Level:      20
Time taken for tests:   12.846 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    19.46 [#/sec] (mean)
Time per request:       1027.689 [ms] (mean)
Time per request:       51.384 [ms] (mean, across all concurrent requests)
Transfer rate:          3.82 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   1018
  66%   1035
  75%   1041
  80%   1043
  90%   1049
  95%   1063
  98%   1070
  99%   1071
 100%   1079 (longest request)
```

やったー！アプリは1秒あたり約20リクエストを処理するようになり、同期ハッシュ生成の場合よりも約4倍多くなりました。さらに、平均レイテンシは以前の4秒から1秒強に短縮されました。

この（仮定された）例のパフォーマンス調査を通じて、V8ティックプロセッサがNode.jsアプリケーションのパフォーマンスをより深く理解するのにどのように役立つかを見ていただければ幸いです。

[フレームグラフの作成方法](/ja/nodejs/guide/flame-graphs)も役立つ場合があります。

