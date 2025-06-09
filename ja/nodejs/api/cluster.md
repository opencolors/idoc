---
title: Node.js ドキュメント - クラスター
description: Node.jsのクラスターモジュールを使用して、サーバーポートを共有する子プロセスを作成し、アプリケーションのパフォーマンスとスケーラビリティを向上させる方法を学びます。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - クラスター | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのクラスターモジュールを使用して、サーバーポートを共有する子プロセスを作成し、アプリケーションのパフォーマンスとスケーラビリティを向上させる方法を学びます。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - クラスター | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのクラスターモジュールを使用して、サーバーポートを共有する子プロセスを作成し、アプリケーションのパフォーマンスとスケーラビリティを向上させる方法を学びます。
---


# Cluster {#cluster}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/cluster.js](https://github.com/nodejs/node/blob/v23.5.0/lib/cluster.js)

Node.js プロセスのクラスタは、アプリケーションスレッド間でワークロードを分散できる Node.js の複数のインスタンスを実行するために使用できます。プロセス分離が必要ない場合は、代わりに [`worker_threads`](/ja/nodejs/api/worker_threads) モジュールを使用してください。これにより、単一の Node.js インスタンス内で複数のアプリケーションスレッドを実行できます。

cluster モジュールを使用すると、サーバーポートをすべて共有する子プロセスを簡単に作成できます。

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```
:::

Node.js を実行すると、ワーカー間でポート 8000 が共有されるようになります。

```bash [BASH]
$ node server.js
Primary 3596 is running
Worker 4324 started
Worker 4520 started
Worker 6056 started
Worker 5644 started
```
Windows では、まだワーカーで名前付きパイプサーバーをセットアップすることはできません。


## 仕組み {#how-it-works}

ワーカープロセスは、[`child_process.fork()`](/ja/nodejs/api/child_process#child_processforkmodulepath-args-options) メソッドを使用して生成されます。これにより、IPCを介して親プロセスと通信し、サーバーハンドルをやり取りできます。

clusterモジュールは、受信接続を分散する2つの方法をサポートしています。

1つ目の方法（およびWindowsを除くすべてのプラットフォームでのデフォルトの方法）は、ラウンドロビン方式です。プライマリプロセスがポートをリッスンし、新しい接続を受け入れ、ワーカープロセスにラウンドロビン方式で分散します。ワーカープロセスへの過負荷を避けるための組み込みの賢さも備わっています。

2つ目の方法は、プライマリプロセスがlistenソケットを作成し、それを関心のあるワーカーに送信する方法です。次に、ワーカーは受信接続を直接受け入れます。

理論的には、2つ目の方法が最高のパフォーマンスを発揮するはずです。しかし実際には、オペレーティングシステムのスケジューラによる気まぐれにより、分散が非常に不均衡になる傾向があります。8つのプロセスのうち、70％を超える接続がわずか2つのプロセスに集中していることが観測されています。

`server.listen()` はほとんどの作業をプライマリプロセスに委ねるため、通常の Node.js プロセスとクラスターワーカーの間で動作が異なるケースが3つあります。

Node.js はルーティングロジックを提供しません。したがって、セッションやログインなどのために、インメモリデータオブジェクトに過度に依存しないようにアプリケーションを設計することが重要です。

ワーカーはすべて別のプロセスであるため、他のワーカーに影響を与えることなく、プログラムのニーズに応じてkillまたは再生成できます。生きているワーカーがいくつか存在する限り、サーバーは接続を受け入れ続けます。ワーカーが1つも存在しない場合、既存の接続は切断され、新しい接続は拒否されます。ただし、Node.js はワーカーの数を自動的に管理しません。独自のニーズに基づいてワーカープールを管理するのは、アプリケーションの責任です。

`node:cluster` モジュールの主なユースケースはネットワーキングですが、ワーカープロセスを必要とする他のユースケースにも使用できます。


## クラス: `Worker` {#class-worker}

**追加: v0.7.0**

- 拡張: [\<EventEmitter\>](/ja/nodejs/api/events#class-eventemitter)

`Worker` オブジェクトは、ワーカーに関するすべての公開情報とメソッドを含みます。プライマリでは、`cluster.workers` を使用して取得できます。ワーカーでは、`cluster.worker` を使用して取得できます。

### イベント: `'disconnect'` {#event-disconnect}

**追加: v0.7.7**

`cluster.on('disconnect')` イベントと同様ですが、このワーカーに固有です。

```js [ESM]
cluster.fork().on('disconnect', () => {
  // Worker が切断されました
});
```
### イベント: `'error'` {#event-error}

**追加: v0.7.3**

このイベントは、[`child_process.fork()`](/ja/nodejs/api/child_process#child_processforkmodulepath-args-options) によって提供されるものと同じです。

ワーカー内では、`process.on('error')` も使用できます。

### イベント: `'exit'` {#event-exit}

**追加: v0.11.2**

- `code` [\<number\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type) 正常に終了した場合の終了コード。
- `signal` [\<string\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#String_type) プロセスが強制終了された原因となったシグナルの名前 (例: `'SIGHUP'`)。

`cluster.on('exit')` イベントと同様ですが、このワーカーに固有です。

::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`worker was killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker exited with error code: ${code}`);
    } else {
      console.log('worker success!');
    }
  });
}
```

```js [CJS]
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`worker was killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker exited with error code: ${code}`);
    } else {
      console.log('worker success!');
    }
  });
}
```
:::

### イベント: `'listening'` {#event-listening}

**追加: v0.7.0**

- `address` [\<Object\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object)

`cluster.on('listening')` イベントと同様ですが、このワーカーに固有です。

::: code-group
```js [ESM]
cluster.fork().on('listening', (address) => {
  // Worker がリッスンしています
});
```

```js [CJS]
cluster.fork().on('listening', (address) => {
  // Worker がリッスンしています
});
```
:::

ワーカー内では発行されません。


### イベント: `'message'` {#event-message}

**追加: v0.7.0**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`cluster` の `'message'` イベントに似ていますが、このワーカーに固有です。

ワーカー内では、`process.on('message')` も使用できます。

[`process` イベント: `'message'`](/ja/nodejs/api/process#event-message) を参照してください。

以下は、メッセージシステムを使用する例です。これは、ワーカーが受信した HTTP リクエストの数をプライマリプロセスでカウントし続けます。

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

if (cluster.isPrimary) {

  // HTTPリクエストを追跡
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // リクエストをカウント
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // ワーカーを起動し、notifyRequestを含むメッセージをリッスンする
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // ワーカープロセスはHTTPサーバーを持っています。
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // リクエストについてプライマリに通知する
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {

  // HTTPリクエストを追跡
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // リクエストをカウント
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // ワーカーを起動し、notifyRequestを含むメッセージをリッスンする
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // ワーカープロセスはHTTPサーバーを持っています。
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // リクエストについてプライマリに通知する
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```
:::


### イベント: `'online'` {#event-online}

**追加:** v0.7.0

`cluster.on('online')` イベントと同様ですが、このワーカーに固有のイベントです。

```js [ESM]
cluster.fork().on('online', () => {
  // Worker is online
});
```

ワーカー内では発生しません。

### `worker.disconnect()` {#workerdisconnect}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v7.3.0 | このメソッドは `worker` への参照を返すようになりました。 |
| v0.7.7 | 追加: v0.7.7 |
:::

- 戻り値: [\<cluster.Worker\>](/ja/nodejs/api/cluster#class-worker) `worker` への参照。

ワーカー内では、この関数はすべてのサーバーを閉じ、それらのサーバーでの `'close'` イベントを待ち、その後 IPC チャネルを切断します。

プライマリでは、ワーカーに内部メッセージが送信され、それ自身で `.disconnect()` を呼び出すようにします。

`.exitedAfterDisconnect` を設定する原因となります。

サーバーが閉じられた後、新しい接続は受け入れられなくなりますが、他のリッスン中のワーカーによって接続が受け入れられる可能性があります。既存の接続は通常どおりに閉じることができます。接続がなくなったとき、[`server.close()`](/ja/nodejs/api/net#event-close) を参照してください。ワーカーへの IPC チャネルが閉じられ、正常に終了できます。

上記は *サーバー* 接続に *のみ* 適用されます。クライアント接続はワーカーによって自動的に閉じられることはなく、disconnect は終了前にそれらが閉じるのを待ちません。

ワーカー内では、`process.disconnect` が存在しますが、これはこの関数ではありません。これは [`disconnect()`](/ja/nodejs/api/child_process#subprocessdisconnect) です。

長寿命のサーバー接続がワーカーの切断を妨げる可能性があるため、メッセージを送信して、アプリケーション固有のアクションを実行してそれらを閉じることができるようにすると役立つ場合があります。また、`'disconnect'` イベントが一定時間後に発生しなかった場合にワーカーを強制終了するタイムアウトを実装することも役立つ場合があります。

```js [ESM]
if (cluster.isPrimary) {
  const worker = cluster.fork();
  let timeout;

  worker.on('listening', (address) => {
    worker.send('shutdown');
    worker.disconnect();
    timeout = setTimeout(() => {
      worker.kill();
    }, 2000);
  });

  worker.on('disconnect', () => {
    clearTimeout(timeout);
  });

} else if (cluster.isWorker) {
  const net = require('node:net');
  const server = net.createServer((socket) => {
    // Connections never end
  });

  server.listen(8000);

  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      // Initiate graceful close of any connections to server
    }
  });
}
```

### `worker.exitedAfterDisconnect` {#workerexitedafterdisconnect}

**Added in: v6.0.0**

- [\<boolean\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Boolean_type)

このプロパティは、workerが`.disconnect()`によって終了した場合に`true`になります。workerが他の方法で終了した場合は`false`です。workerが終了していない場合は`undefined`です。

ブール値の[`worker.exitedAfterDisconnect`](/ja/nodejs/api/cluster#workerexitedafterdisconnect)を使用すると、自発的な終了と偶発的な終了を区別できるため、プライマリはこの値に基づいてworkerを再生成しないことを選択できます。

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  if (worker.exitedAfterDisconnect === true) {
    console.log('あら、それは自発的なものでした - 心配する必要はありません');
  }
});

// workerをkillする
worker.kill();
```
### `worker.id` {#workerid}

**Added in: v0.8.0**

- [\<integer\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type)

新しいworkerにはそれぞれ一意のidが与えられ、このidは`id`に格納されます。

workerが生きている間、これは`cluster.workers`でworkerをインデックス化するキーです。

### `worker.isConnected()` {#workerisconnected}

**Added in: v0.11.14**

この関数は、workerがIPCチャネルを介してプライマリに接続されている場合は`true`、そうでない場合は`false`を返します。workerは作成されるとプライマリに接続されます。`'disconnect'`イベントが発生すると、切断されます。

### `worker.isDead()` {#workerisdead}

**Added in: v0.11.14**

この関数は、workerのプロセスが終了した場合（終了またはシグナルによる）は`true`を返します。それ以外の場合は、`false`を返します。

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log('worker is dead:', worker.isDead());
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker is dead:', worker.isDead());
  });
} else {
  // Workers can share any TCP connection. In this case, it is an HTTP server.
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Current process\n ${process.pid}`);
    process.kill(process.pid);
  }).listen(8000);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log('worker is dead:', worker.isDead());
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker is dead:', worker.isDead());
  });
} else {
  // Workers can share any TCP connection. In this case, it is an HTTP server.
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Current process\n ${process.pid}`);
    process.kill(process.pid);
  }).listen(8000);
}
```
:::


### `worker.kill([signal])` {#workerkillsignal}

**追加:** v0.9.12

- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ワーカープロセスに送信するkillシグナルの名前。**デフォルト:** `'SIGTERM'`

この関数はワーカーをkillします。プライマリワーカーでは、`worker.process`を切断し、切断後に`signal`でkillします。ワーカーでは、`signal`でプロセスをkillします。

`kill()`関数は、正常な切断を待たずにワーカープロセスをkillします。これは`worker.process.kill()`と同じ動作です。

このメソッドは、後方互換性のために`worker.destroy()`としてエイリアスされています。

ワーカーでは、`process.kill()`は存在しますが、この関数ではありません。これは[`kill()`](/ja/nodejs/api/process#processkillpid-signal)です。

### `worker.process` {#workerprocess}

**追加:** v0.7.0

- [\<ChildProcess\>](/ja/nodejs/api/child_process#class-childprocess)

すべてのワーカーは[`child_process.fork()`](/ja/nodejs/api/child_process#child_processforkmodulepath-args-options)を使用して作成され、この関数から返されるオブジェクトは`.process`として保存されます。ワーカーでは、グローバルな`process`が保存されます。

参照: [子プロセスモジュール](/ja/nodejs/api/child_process#child_processforkmodulepath-args-options)。

ワーカーは、`'disconnect'`イベントが`process`で発生し、`.exitedAfterDisconnect`が`true`でない場合、`process.exit(0)`を呼び出します。これは偶発的な切断を防ぎます。

### `worker.send(message[, sendHandle[, options]][, callback])` {#workersendmessage-sendhandle-options-callback}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v4.0.0 | `callback`パラメータがサポートされました。 |
| v0.7.0 | 追加: v0.7.0 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/ja/nodejs/api/net#serverlistenhandle-backlog-callback)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `options`引数（存在する場合）は、特定の種類のハンドルを送信するためのパラメータを設定するために使用されるオブジェクトです。`options`は次のプロパティをサポートします。
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `net.Socket`のインスタンスを渡すときに使用できる値。`true`の場合、ソケットは送信プロセスで開いたままになります。**デフォルト:** `false`。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

ワーカーまたはプライマリに、オプションでハンドルを付けてメッセージを送信します。

プライマリでは、これは特定のワーカーにメッセージを送信します。これは[`ChildProcess.send()`](/ja/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback)と同じです。

ワーカーでは、これはプライマリにメッセージを送信します。これは`process.send()`と同じです。

この例では、プライマリからのすべてのメッセージをエコーバックします。

```js [ESM]
if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.send('hi there');

} else if (cluster.isWorker) {
  process.on('message', (msg) => {
    process.send(msg);
  });
}
```

## Event: `'disconnect'` {#event-disconnect_1}

**Added in: v0.7.9**

- `worker` [\<cluster.Worker\>](/ja/nodejs/api/cluster#class-worker)

worker IPCチャネルが切断された後に発生します。これは、workerが正常に終了した場合、強制終了された場合、または手動で切断された場合（`worker.disconnect()`など）に発生する可能性があります。

`'disconnect'`イベントと`'exit'`イベントの間には遅延がある場合があります。これらのイベントを使用すると、プロセスがクリーンアップでスタックしているかどうか、または存続期間の長い接続があるかどうかを検出できます。

```js [ESM]
cluster.on('disconnect', (worker) => {
  console.log(`The worker #${worker.id} has disconnected`);
});
```
## Event: `'exit'` {#event-exit_1}

**Added in: v0.7.9**

- `worker` [\<cluster.Worker\>](/ja/nodejs/api/cluster#class-worker)
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 正常に終了した場合の終了コード。
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) プロセスが強制終了された原因となったシグナルの名前（例：`'SIGHUP'`）。

いずれかのworkerが停止すると、clusterモジュールは`'exit'`イベントを発行します。

これは、[`.fork()`](/ja/nodejs/api/cluster#clusterforkenv)を再度呼び出してworkerを再起動するために使用できます。

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  console.log('worker %d died (%s). restarting...',
              worker.process.pid, signal || code);
  cluster.fork();
});
```
[`child_process` event: `'exit'`](/ja/nodejs/api/child_process#event-exit)を参照してください。

## Event: `'fork'` {#event-fork}

**Added in: v0.7.0**

- `worker` [\<cluster.Worker\>](/ja/nodejs/api/cluster#class-worker)

新しいworkerがフォークされると、clusterモジュールは`'fork'`イベントを発行します。これは、workerのアクティビティをログに記録したり、カスタムタイムアウトを作成したりするために使用できます。

```js [ESM]
const timeouts = [];
function errorMsg() {
  console.error('Something must be wrong with the connection ...');
}

cluster.on('fork', (worker) => {
  timeouts[worker.id] = setTimeout(errorMsg, 2000);
});
cluster.on('listening', (worker, address) => {
  clearTimeout(timeouts[worker.id]);
});
cluster.on('exit', (worker, code, signal) => {
  clearTimeout(timeouts[worker.id]);
  errorMsg();
});
```

## Event: `'listening'` {#event-listening_1}

**Added in: v0.7.0**

- `worker` [\<cluster.Worker\>](/ja/nodejs/api/cluster#class-worker)
- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

ワーカーから `listen()` を呼び出した後、サーバーで `'listening'` イベントが発生すると、プライマリの `cluster` でも `'listening'` イベントが発生します。

イベントハンドラーは、2つの引数（ワーカーオブジェクトを含む `worker` と、次の接続プロパティを含む `address` オブジェクト: `address`、`port`、`addressType`）で実行されます。これは、ワーカーが複数のアドレスでリッスンしている場合に非常に役立ちます。

```js [ESM]
cluster.on('listening', (worker, address) => {
  console.log(
    `ワーカーが ${address.address}:${address.port} に接続されました`);
});
```
`addressType` は次のいずれかです。

- `4` (TCPv4)
- `6` (TCPv6)
- `-1` (Unix ドメインソケット)
- `'udp4'` または `'udp6'` (UDPv4 または UDPv6)

## Event: `'message'` {#event-message_1}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v6.0.0 | `worker` パラメータが渡されるようになりました。詳細については下記を参照してください。 |
| v2.5.0 | Added in: v2.5.0 |
:::

- `worker` [\<cluster.Worker\>](/ja/nodejs/api/cluster#class-worker)
- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

クラスタプライマリが任意のワーカーからメッセージを受信したときに発生します。

[`child_process` event: `'message'`](/ja/nodejs/api/child_process#event-message) を参照してください。

## Event: `'online'` {#event-online_1}

**Added in: v0.7.0**

- `worker` [\<cluster.Worker\>](/ja/nodejs/api/cluster#class-worker)

新しいワーカーをフォークした後、ワーカーはオンラインメッセージで応答する必要があります。プライマリがオンラインメッセージを受信すると、このイベントが発生します。 `'fork'` と `'online'` の違いは、`fork` はプライマリがワーカーをフォークしたときに発生し、`'online'` はワーカーが実行されているときに発生することです。

```js [ESM]
cluster.on('online', (worker) => {
  console.log('やった、ワーカーがフォーク後に応答しました');
});
```

## イベント: `'setup'` {#event-setup}

**追加:** v0.7.1

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[`.setupPrimary()`](/ja/nodejs/api/cluster#clustersetupprimarysettings) が呼び出されるたびに発生します。

`settings` オブジェクトは、[`.setupPrimary()`](/ja/nodejs/api/cluster#clustersetupprimarysettings) が呼び出された時点の `cluster.settings` オブジェクトであり、単一のティックで [`.setupPrimary()`](/ja/nodejs/api/cluster#clustersetupprimarysettings) への複数の呼び出しが行われる可能性があるため、参考情報としてのみ利用してください。

精度が重要な場合は、`cluster.settings` を使用してください。

## `cluster.disconnect([callback])` {#clusterdisconnectcallback}

**追加:** v0.7.7

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) すべてのワーカーが切断され、ハンドルが閉じられたときに呼び出されます。

`cluster.workers` 内の各ワーカーで `.disconnect()` を呼び出します。

それらが切断されると、すべての内部ハンドルが閉じられ、他のイベントが待機していない場合、プライマリプロセスが正常に終了できます。

このメソッドは、終了時に呼び出されるオプションのコールバック引数を受け取ります。

これは、プライマリプロセスからのみ呼び出すことができます。

## `cluster.fork([env])` {#clusterforkenv}

**追加:** v0.6.0

- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) ワーカープロセスの環境に追加するキーと値のペア。
- 戻り値: [\<cluster.Worker\>](/ja/nodejs/api/cluster#class-worker)

新しいワーカープロセスを生成します。

これは、プライマリプロセスからのみ呼び出すことができます。

## `cluster.isMaster` {#clusterismaster}

**追加:** v0.8.1

**非推奨:** v16.0.0 以降

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨
:::

[`cluster.isPrimary`](/ja/nodejs/api/cluster#clusterisprimary) の非推奨のエイリアス。

## `cluster.isPrimary` {#clusterisprimary}

**追加:** v16.0.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

プロセスがプライマリである場合は true。 これは `process.env.NODE_UNIQUE_ID` によって決定されます。 `process.env.NODE_UNIQUE_ID` が未定義の場合、`isPrimary` は `true` です。


## `cluster.isWorker` {#clusterisworker}

**追加:** v0.6.0

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

プロセスがプライマリでない場合にtrueになります（`cluster.isPrimary` の否定です）。

## `cluster.schedulingPolicy` {#clusterschedulingpolicy}

**追加:** v0.11.2

スケジューリングポリシー。ラウンドロビンの場合は `cluster.SCHED_RR`、オペレーティングシステムに任せる場合は `cluster.SCHED_NONE` です。これはグローバルな設定であり、最初にワーカーが生成された時点、または [`setupPrimary()`](/ja/nodejs/api/cluster#clustersetupprimarysettings) が呼び出された時点のいずれか早い方で事実上固定されます。

`SCHED_RR` は、Windowsを除くすべてのオペレーティングシステムでデフォルトです。Windowsは、libuvが大きなパフォーマンスの低下なしにIOCPハンドルを効果的に分散できるようになった時点で、`SCHED_RR` に変更されます。

`cluster.schedulingPolicy` は、`NODE_CLUSTER_SCHED_POLICY` 環境変数を介して設定することもできます。有効な値は `'rr'` と `'none'` です。

## `cluster.settings` {#clustersettings}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.2.0, v12.16.0 | `serialization` オプションがサポートされるようになりました。 |
| v9.5.0 | `cwd` オプションがサポートされるようになりました。 |
| v9.4.0 | `windowsHide` オプションがサポートされるようになりました。 |
| v8.2.0 | `inspectPort` オプションがサポートされるようになりました。 |
| v6.4.0 | `stdio` オプションがサポートされるようになりました。 |
| v0.7.1 | 追加: v0.7.1 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Node.js実行可能ファイルに渡される文字列引数のリスト。**デフォルト:** `process.execArgv`。
    - `exec` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ワーカーファイルのファイルパス。**デフォルト:** `process.argv[1]`。
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ワーカーに渡される文字列引数。**デフォルト:** `process.argv.slice(2)`。
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ワーカープロセスの現在のワーキングディレクトリ。**デフォルト:** `undefined` (親プロセスから継承)。
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) プロセス間でメッセージを送信するために使用されるシリアライゼーションの種類を指定します。使用可能な値は `'json'` と `'advanced'` です。詳細については、[`child_process` の高度なシリアライゼーション](/ja/nodejs/api/child_process#advanced-serialization) を参照してください。**デフォルト:** `false`。
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 出力を親のstdioに送信するかどうか。**デフォルト:** `false`。
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) フォークされたプロセスのstdioを設定します。clusterモジュールはIPCに依存して機能するため、この構成には `'ipc'` エントリが含まれている必要があります。このオプションを指定すると、`silent` がオーバーライドされます。[`child_process.spawn()`](/ja/nodejs/api/child_process#child_processspawncommand-args-options) の [`stdio`](/ja/nodejs/api/child_process#optionsstdio) を参照してください。
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのユーザーIDを設定します。( [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) を参照してください。)
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスのグループIDを設定します。( [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) を参照してください。)
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) ワーカーのインスペクターポートを設定します。これは数値、または引数を取らずに数値を返す関数です。デフォルトでは、各ワーカーは独自のポートを取得し、プライマリの `process.debugPort` からインクリメントされます。
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Windowsシステムで通常作成されるフォークされたプロセスのコンソールウィンドウを非表示にします。**デフォルト:** `false`。

[`.setupPrimary()`](/ja/nodejs/api/cluster#clustersetupprimarysettings) (または [`.fork()`](/ja/nodejs/api/cluster#clusterforkenv)) を呼び出した後、この設定オブジェクトには、デフォルト値を含む設定が含まれます。

このオブジェクトは、手動で変更または設定することを意図していません。


## `cluster.setupMaster([settings])` {#clustersetupmastersettings}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | Deprecated since: v16.0.0 |
| v6.4.0 | `stdio` オプションがサポートされるようになりました。 |
| v0.7.1 | Added in: v0.7.1 |
:::

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定版: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨
:::

[`.setupPrimary()`](/ja/nodejs/api/cluster#clustersetupprimarysettings) の非推奨エイリアス。

## `cluster.setupPrimary([settings])` {#clustersetupprimarysettings}

**追加: v16.0.0**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`cluster.settings`](/ja/nodejs/api/cluster#clustersettings) を参照してください。

`setupPrimary` はデフォルトの 'fork' の振る舞いを変更するために使用されます。一度呼び出されると、設定は `cluster.settings` に存在します。

設定の変更は、[`.fork()`](/ja/nodejs/api/cluster#clusterforkenv) の将来の呼び出しにのみ影響し、すでに実行中のワーカーには影響しません。

`.setupPrimary()` で設定できないワーカーの唯一の属性は、[`.fork()`](/ja/nodejs/api/cluster#clusterforkenv) に渡される `env` です。

上記のデフォルトは最初の呼び出しにのみ適用されます。後続の呼び出しのデフォルトは、`cluster.setupPrimary()` が呼び出された時点での現在の値です。

::: code-group
```js [ESM]
import cluster from 'node:cluster';

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true,
});
cluster.fork(); // https worker
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http'],
});
cluster.fork(); // http worker
```

```js [CJS]
const cluster = require('node:cluster');

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true,
});
cluster.fork(); // https worker
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http'],
});
cluster.fork(); // http worker
```
:::

これはプライマリプロセスからのみ呼び出すことができます。

## `cluster.worker` {#clusterworker}

**追加: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

現在のワーカーオブジェクトへの参照。プライマリプロセスでは使用できません。

::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  console.log('I am primary');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`I am worker #${cluster.worker.id}`);
}
```

```js [CJS]
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  console.log('I am primary');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`I am worker #${cluster.worker.id}`);
}
```
:::


## `cluster.workers` {#clusterworkers}

**追加:** v0.7.0

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

アクティブなワーカーオブジェクトを `id` フィールドをキーとして格納するハッシュです。これにより、すべてのワーカーを簡単にループ処理できます。プライマリプロセスでのみ利用可能です。

ワーカーは、ワーカーが切断*および*終了した後に `cluster.workers` から削除されます。これらの2つのイベント間の順序は事前に決定できません。ただし、`cluster.workers` リストからの削除は、最後の `'disconnect'` または `'exit'` イベントが発行される前に行われることが保証されています。

::: code-group
```js [ESM]
import cluster from 'node:cluster';

for (const worker of Object.values(cluster.workers)) {
  worker.send('big announcement to all workers');
}
```

```js [CJS]
const cluster = require('node:cluster');

for (const worker of Object.values(cluster.workers)) {
  worker.send('big announcement to all workers');
}
```
:::

