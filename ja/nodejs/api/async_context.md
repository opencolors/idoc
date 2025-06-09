---
title: Node.js ドキュメント - 非同期コンテキストの追跡
description: Node.jsで非同期操作を追跡する方法を学びます。async_hooksモジュールを使用して、さまざまな非同期イベントに対するコールバックを登録する方法を提供します。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - 非同期コンテキストの追跡 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsで非同期操作を追跡する方法を学びます。async_hooksモジュールを使用して、さまざまな非同期イベントに対するコールバックを登録する方法を提供します。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - 非同期コンテキストの追跡 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsで非同期操作を追跡する方法を学びます。async_hooksモジュールを使用して、さまざまな非同期イベントに対するコールバックを登録する方法を提供します。
---


# 非同期コンテキスト追跡 {#asynchronous-context-tracking}

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

## はじめに {#introduction}

これらのクラスは、状態を関連付け、コールバックと Promise チェーン全体に伝播するために使用されます。 これらを使用すると、Web リクエストまたはその他の非同期期間のライフサイクル全体にわたってデータを保存できます。 これは、他の言語のスレッドローカルストレージに似ています。

`AsyncLocalStorage` クラスと `AsyncResource` クラスは、`node:async_hooks` モジュールの一部です。

::: code-group
```js [ESM]
import { AsyncLocalStorage, AsyncResource } from 'node:async_hooks';
```

```js [CJS]
const { AsyncLocalStorage, AsyncResource } = require('node:async_hooks');
```
:::

## Class: `AsyncLocalStorage` {#class-asynclocalstorage}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.4.0 | AsyncLocalStorage が安定版になりました。 以前は実験的でした。 |
| v13.10.0, v12.17.0 | 追加: v13.10.0, v12.17.0 |
:::

このクラスは、非同期操作を通じて一貫性を維持するストアを作成します。

`node:async_hooks` モジュールの上に独自の実装を作成できますが、`AsyncLocalStorage` を使用することをお勧めします。これは、実装が簡単ではない重要な最適化を含む、パフォーマンスが高くメモリセーフな実装であるためです。

次の例では、`AsyncLocalStorage` を使用して、受信 HTTP リクエストに ID を割り当て、各リクエスト内でログに記録されたメッセージに ID を含める単純なロガーを構築します。

::: code-group
```js [ESM]
import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // ここに非同期操作のチェーンがあると想像してください
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Prints:
//   0: start
//   1: start
//   0: finish
//   1: finish
```

```js [CJS]
const http = require('node:http');
const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // ここに非同期操作のチェーンがあると想像してください
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Prints:
//   0: start
//   1: start
//   0: finish
//   1: finish
```
:::

`AsyncLocalStorage` の各インスタンスは、独立したストレージコンテキストを維持します。 複数のインスタンスが互いのデータに干渉するリスクなしに、安全に同時に存在できます。


### `new AsyncLocalStorage()` {#new-asynclocalstorage}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.7.0, v18.16.0 | `onPropagate` オプションの削除。 |
| v19.2.0, v18.13.0 | `onPropagate` オプションの追加。 |
| v13.10.0, v12.17.0 | 追加: v13.10.0, v12.17.0 |
:::

`AsyncLocalStorage` の新しいインスタンスを作成します。ストアは、`run()` の呼び出し内、または `enterWith()` の呼び出し後にのみ提供されます。

### 静的メソッド: `AsyncLocalStorage.bind(fn)` {#static-method-asynclocalstoragebindfn}

**追加: v19.8.0, v18.16.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 現在の実行コンテキストにバインドする関数。
- 戻り値: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) キャプチャされた実行コンテキスト内で `fn` を呼び出す新しい関数。

指定された関数を現在の実行コンテキストにバインドします。

### 静的メソッド: `AsyncLocalStorage.snapshot()` {#static-method-asynclocalstoragesnapshot}

**追加: v19.8.0, v18.16.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- 戻り値: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `(fn: (...args) : R, ...args) : R` のシグネチャを持つ新しい関数。

現在の実行コンテキストをキャプチャし、関数を引数として受け入れる関数を返します。返された関数が呼び出されるたびに、キャプチャされたコンテキスト内で渡された関数を呼び出します。

```js [ESM]
const asyncLocalStorage = new AsyncLocalStorage();
const runInAsyncScope = asyncLocalStorage.run(123, () => AsyncLocalStorage.snapshot());
const result = asyncLocalStorage.run(321, () => runInAsyncScope(() => asyncLocalStorage.getStore()));
console.log(result);  // returns 123
```
AsyncLocalStorage.snapshot() は、単純な非同期コンテキスト追跡の目的で AsyncResource の使用を置き換えることができます。例:

```js [ESM]
class Foo {
  #runInAsyncScope = AsyncLocalStorage.snapshot();

  get() { return this.#runInAsyncScope(() => asyncLocalStorage.getStore()); }
}

const foo = asyncLocalStorage.run(123, () => new Foo());
console.log(asyncLocalStorage.run(321, () => foo.get())); // returns 123
```

### `asyncLocalStorage.disable()` {#asynclocalstoragedisable}

**Added in: v13.10.0, v12.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

`AsyncLocalStorage`のインスタンスを無効にします。`asyncLocalStorage.getStore()`に対する以降の呼び出しは、`asyncLocalStorage.run()`または`asyncLocalStorage.enterWith()`が再び呼び出されるまで、`undefined`を返します。

`asyncLocalStorage.disable()`を呼び出すと、インスタンスにリンクされている現在のコンテキストはすべて終了します。

`asyncLocalStorage`がガベージコレクションされる前に、`asyncLocalStorage.disable()`を呼び出す必要があります。これは、`asyncLocalStorage`によって提供されるストアには適用されません。これらのオブジェクトは、対応する非同期リソースとともにガベージコレクションされるためです。

このメソッドは、`asyncLocalStorage`が現在のプロセスで不要になった場合に使用してください。

### `asyncLocalStorage.getStore()` {#asynclocalstoragegetstore}

**Added in: v13.10.0, v12.17.0**

- 戻り値: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

現在のストアを返します。`asyncLocalStorage.run()`または`asyncLocalStorage.enterWith()`の呼び出しによって初期化された非同期コンテキストの外部で呼び出された場合、`undefined`を返します。

### `asyncLocalStorage.enterWith(store)` {#asynclocalstorageenterwithstore}

**Added in: v13.11.0, v12.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

現在の同期実行の残りの期間、コンテキストに移行し、その後の非同期呼び出しを通じてストアを保持します。

例:

```js [ESM]
const store = { id: 1 };
// 以前のストアを与えられたストアオブジェクトで置き換えます
asyncLocalStorage.enterWith(store);
asyncLocalStorage.getStore(); // ストアオブジェクトを返します
someAsyncOperation(() => {
  asyncLocalStorage.getStore(); // 同じオブジェクトを返します
});
```

この移行は、*全体の*同期実行で継続します。これは、たとえば、イベントハンドラー内でコンテキストが入力された場合、後続のイベントハンドラーも、`AsyncResource`を使用して別のコンテキストに特にバインドされていない限り、そのコンテキスト内で実行されることを意味します。そのため、後者のメソッドを使用する強い理由がない限り、`enterWith()`よりも`run()`を優先する必要があります。

```js [ESM]
const store = { id: 1 };

emitter.on('my-event', () => {
  asyncLocalStorage.enterWith(store);
});
emitter.on('my-event', () => {
  asyncLocalStorage.getStore(); // 同じオブジェクトを返します
});

asyncLocalStorage.getStore(); // undefinedを返します
emitter.emit('my-event');
asyncLocalStorage.getStore(); // 同じオブジェクトを返します
```

### `asyncLocalStorage.run(store, callback[, ...args])` {#asynclocalstoragerunstore-callback-args}

**Added in: v13.10.0, v12.17.0**

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

コンテキスト内で関数を同期的に実行し、その戻り値を返します。ストアは、コールバック関数の外からはアクセスできません。ストアは、コールバック内で作成された非同期操作であればアクセス可能です。

オプションの `args` は、コールバック関数に渡されます。

コールバック関数がエラーをスローした場合、そのエラーは `run()` によってもスローされます。スタックトレースはこの呼び出しの影響を受けず、コンテキストは終了します。

例:

```js [ESM]
const store = { id: 2 };
try {
  asyncLocalStorage.run(store, () => {
    asyncLocalStorage.getStore(); // ストアオブジェクトを返します
    setTimeout(() => {
      asyncLocalStorage.getStore(); // ストアオブジェクトを返します
    }, 200);
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // undefined を返します
  // エラーはここでキャッチされます
}
```
### `asyncLocalStorage.exit(callback[, ...args])` {#asynclocalstorageexitcallback-args}

**Added in: v13.10.0, v12.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

コンテキストの外で関数を同期的に実行し、その戻り値を返します。ストアは、コールバック関数内、またはコールバック内で作成された非同期操作からはアクセスできません。コールバック関数内で行われた `getStore()` 呼び出しは、常に `undefined` を返します。

オプションの `args` は、コールバック関数に渡されます。

コールバック関数がエラーをスローした場合、そのエラーは `exit()` によってもスローされます。スタックトレースはこの呼び出しの影響を受けず、コンテキストは再開されます。

例:

```js [ESM]
// run の呼び出し内
try {
  asyncLocalStorage.getStore(); // ストアオブジェクトまたは値を返します
  asyncLocalStorage.exit(() => {
    asyncLocalStorage.getStore(); // undefined を返します
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // 同じオブジェクトまたは値を返します
  // エラーはここでキャッチされます
}
```

### `async/await` での使用 {#usage-with-async/await}

非同期関数内で、あるコンテキスト内で実行する `await` 呼び出しが1つだけの場合、次のパターンを使用する必要があります。

```js [ESM]
async function fn() {
  await asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set('key', value);
    return foo(); // foo の戻り値は await されます
  });
}
```
この例では、ストアはコールバック関数と `foo` によって呼び出される関数でのみ利用可能です。 `run` の外部で `getStore` を呼び出すと `undefined` が返されます。

### トラブルシューティング: コンテキストの喪失 {#troubleshooting-context-loss}

ほとんどの場合、`AsyncLocalStorage` は問題なく動作します。まれに、非同期操作の1つで現在のストアが失われることがあります。

コードがコールバックベースの場合、[`util.promisify()`](/ja/nodejs/api/util#utilpromisifyoriginal) でプロミス化するだけで、ネイティブプロミスで動作し始めます。

コールバックベースの API を使用する必要がある場合、またはコードがカスタム thenable の実装を想定している場合は、[`AsyncResource`](/ja/nodejs/api/async_context#class-asyncresource) クラスを使用して、非同期操作を正しい実行コンテキストに関連付けます。コンテキストの喪失の原因となっている関数呼び出しを特定するには、喪失の原因となっていると思われる呼び出しの後に `asyncLocalStorage.getStore()` の内容をログに記録します。コードが `undefined` をログに記録する場合、最後に呼び出されたコールバックがコンテキストの喪失の原因である可能性があります。

## クラス: `AsyncResource` {#class-asyncresource}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.4.0 | AsyncResource は安定版になりました。以前は、実験的でした。 |
:::

クラス `AsyncResource` は、埋め込み側の非同期リソースによって拡張されるように設計されています。これを使用すると、ユーザーは独自のリソースのライフタイムイベントを簡単にトリガーできます。

`init` フックは、`AsyncResource` がインスタンス化されるときにトリガーされます。

以下は、`AsyncResource` API の概要です。

::: code-group
```js [ESM]
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

// AsyncResource() は拡張されることを意図しています。
// 新しい AsyncResource() をインスタンス化すると、init もトリガーされます。
// triggerAsyncId が省略されている場合、async_hook.executionAsyncId() が使用されます。
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// リソースの実行コンテキストで関数を実行します。これは、次のことを行います。
// * リソースのコンテキストを確立します
// * AsyncHooks before コールバックをトリガーします
// * 指定された引数で、提供された関数 `fn` を呼び出します
// * AsyncHooks after コールバックをトリガーします
// * 元の実行コンテキストを復元します
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// AsyncHooks destroy コールバックを呼び出します。
asyncResource.emitDestroy();

// AsyncResource インスタンスに割り当てられた一意の ID を返します。
asyncResource.asyncId();

// AsyncResource インスタンスのトリガー ID を返します。
asyncResource.triggerAsyncId();
```

```js [CJS]
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

// AsyncResource() は拡張されることを意図しています。
// 新しい AsyncResource() をインスタンス化すると、init もトリガーされます。
// triggerAsyncId が省略されている場合、async_hook.executionAsyncId() が使用されます。
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// リソースの実行コンテキストで関数を実行します。これは、次のことを行います。
// * リソースのコンテキストを確立します
// * AsyncHooks before コールバックをトリガーします
// * 指定された引数で、提供された関数 `fn` を呼び出します
// * AsyncHooks after コールバックをトリガーします
// * 元の実行コンテキストを復元します
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// AsyncHooks destroy コールバックを呼び出します。
asyncResource.emitDestroy();

// AsyncResource インスタンスに割り当てられた一意の ID を返します。
asyncResource.asyncId();

// AsyncResource インスタンスのトリガー ID を返します。
asyncResource.triggerAsyncId();
```
:::


### `new AsyncResource(type[, options])` {#new-asyncresourcetype-options}

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 非同期イベントの型。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この非同期イベントを作成した実行コンテキストの ID。**既定:** `executionAsyncId()`。
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` に設定すると、オブジェクトがガベージコレクションされたときに `emitDestroy` を無効にします。 通常、リソースの `asyncId` が取得され、機密 API の `emitDestroy` がそれを使用して呼び出されない限り、これを設定する必要はありません (手動で `emitDestroy` が呼び出された場合でも)。 `false` に設定すると、少なくとも 1 つのアクティブな `destroy` フックがある場合にのみ、ガベージコレクションでの `emitDestroy` 呼び出しが行われます。 **既定:** `false`。

使用例:

```js [ESM]
class DBQuery extends AsyncResource {
  constructor(db) {
    super('DBQuery');
    this.db = db;
  }

  getInfo(query, callback) {
    this.db.get(query, (err, data) => {
      this.runInAsyncScope(callback, null, err, data);
    });
  }

  close() {
    this.db = null;
    this.emitDestroy();
  }
}
```
### 静的メソッド: `AsyncResource.bind(fn[, type[, thisArg]])` {#static-method-asyncresourcebindfn-type-thisarg}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v20.0.0 | バインドされた関数に追加された `asyncResource` プロパティは非推奨となり、将来のバージョンで削除されます。 |
| v17.8.0, v16.15.0 | `thisArg` が未定義の場合のデフォルトを、呼び出し元からの `this` を使用するように変更しました。 |
| v16.0.0 | オプションの thisArg を追加しました。 |
| v14.8.0, v12.19.0 | 追加: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 現在の実行コンテキストにバインドする関数。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 基になる `AsyncResource` に関連付けるオプションの名前。
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

指定された関数を現在の実行コンテキストにバインドします。


### `asyncResource.bind(fn[, thisArg])` {#asyncresourcebindfn-thisarg}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.0.0 | バインドされた関数に追加された `asyncResource` プロパティは非推奨となり、将来のバージョンで削除されます。 |
| v17.8.0, v16.15.0 | `thisArg` が未定義の場合のデフォルトを、呼び出し元からの `this` を使用するように変更しました。 |
| v16.0.0 | オプションの thisArg を追加しました。 |
| v14.8.0, v12.19.0 | 追加: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 現在の `AsyncResource` にバインドする関数。
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

指定された関数をこの `AsyncResource` のスコープで実行するようにバインドします。

### `asyncResource.runInAsyncScope(fn[, thisArg, ...args])` {#asyncresourceruninasyncscopefn-thisarg-args}

**追加: v9.6.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) この非同期リソースの実行コンテキストで呼び出す関数。
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 関数呼び出しに使用されるレシーバー。
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 関数に渡すオプションの引数。

提供された関数に、非同期リソースの実行コンテキストで提供された引数を付けて呼び出します。これにより、コンテキストが確立され、AsyncHooks の before コールバックがトリガーされ、関数が呼び出され、AsyncHooks の after コールバックがトリガーされ、元の実行コンテキストが復元されます。

### `asyncResource.emitDestroy()` {#asyncresourceemitdestroy}

- 戻り値: [\<AsyncResource\>](/ja/nodejs/api/async_hooks#class-asyncresource) `asyncResource` への参照。

すべての `destroy` フックを呼び出します。これは一度だけ呼び出す必要があります。複数回呼び出すとエラーがスローされます。これは**手動で**呼び出す必要があります。リソースが GC によって回収されるように放置された場合、`destroy` フックは呼び出されません。


### `asyncResource.asyncId()` {#asyncresourceasyncid}

- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) リソースに割り当てられた一意の `asyncId`。

### `asyncResource.triggerAsyncId()` {#asyncresourcetriggerasyncid}

- 戻り値: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `AsyncResource` コンストラクターに渡されるのと同じ `triggerAsyncId`。

### `Worker` スレッドプールに `AsyncResource` を使用する {#using-asyncresource-for-a-worker-thread-pool}

次の例は、`AsyncResource` クラスを使用して、[`Worker`](/ja/nodejs/api/worker_threads#class-worker) プールに非同期追跡を適切に提供する方法を示しています。データベース接続プールなどの他のリソースプールも、同様のモデルに従うことができます。

タスクが2つの数値を加算することであると仮定して、`task_processor.js` という名前のファイルを使用し、次のコンテンツを使用します。

::: code-group
```js [ESM]
import { parentPort } from 'node:worker_threads';
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```

```js [CJS]
const { parentPort } = require('node:worker_threads');
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```
:::

それに関する Worker プールは、次の構造を使用できます。

::: code-group
```js [ESM]
import { AsyncResource } from 'node:async_hooks';
import { EventEmitter } from 'node:events';
import { Worker } from 'node:worker_threads';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s are used only once.
  }
}

export default class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Any time the kWorkerFreedEvent is emitted, dispatch
    // the next task pending in the queue, if any.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(new URL('task_processor.js', import.meta.url));
    worker.on('message', (result) => {
      // In case of success: Call the callback that was passed to `runTask`,
      // remove the `TaskInfo` associated with the Worker, and mark it as free
      // again.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // In case of an uncaught exception: Call the callback that was passed to
      // `runTask` with the error.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Remove the worker from the list and start a new Worker to replace the
      // current one.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // No free threads, wait until a worker thread becomes free.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}
```

```js [CJS]
const { AsyncResource } = require('node:async_hooks');
const { EventEmitter } = require('node:events');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s are used only once.
  }
}

class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Any time the kWorkerFreedEvent is emitted, dispatch
    // the next task pending in the queue, if any.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(path.resolve(__dirname, 'task_processor.js'));
    worker.on('message', (result) => {
      // In case of success: Call the callback that was passed to `runTask`,
      // remove the `TaskInfo` associated with the Worker, and mark it as free
      // again.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // In case of an uncaught exception: Call the callback that was passed to
      // `runTask` with the error.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Remove the worker from the list and start a new Worker to replace the
      // current one.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // No free threads, wait until a worker thread becomes free.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}

module.exports = WorkerPool;
```
:::

`WorkerPoolTaskInfo` オブジェクトによって追加された明示的な追跡がない場合、コールバックは個々の `Worker` オブジェクトに関連付けられているように見えます。ただし、`Worker` の作成はタスクの作成と関連付けられておらず、タスクがいつスケジュールされたかに関する情報を提供しません。

このプールは次のように使用できます。

::: code-group
```js [ESM]
import WorkerPool from './worker_pool.js';
import os from 'node:os';

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```

```js [CJS]
const WorkerPool = require('./worker_pool.js');
const os = require('node:os');

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```
:::


### `AsyncResource` と `EventEmitter` の統合 {#integrating-asyncresource-with-eventemitter}

[`EventEmitter`](/ja/nodejs/api/events#class-eventemitter) によってトリガーされたイベントリスナーは、`eventEmitter.on()` が呼び出されたときにアクティブだった実行コンテキストとは異なる実行コンテキストで実行される可能性があります。

次の例は、`AsyncResource` クラスを使用して、イベントリスナーを正しい実行コンテキストに適切に関連付ける方法を示しています。同じアプローチは、[`Stream`](/ja/nodejs/api/stream#stream) または同様のイベント駆動型クラスに適用できます。

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Execution context is bound to the current outer scope.
    // 実行コンテキストは現在の外側のスコープにバインドされています。
  }));
  req.on('close', () => {
    // Execution context is bound to the scope that caused 'close' to emit.
    // 実行コンテキストは 'close' の発行を引き起こしたスコープにバインドされています。
  });
  res.end();
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Execution context is bound to the current outer scope.
    // 実行コンテキストは現在の外側のスコープにバインドされています。
  }));
  req.on('close', () => {
    // Execution context is bound to the scope that caused 'close' to emit.
    // 実行コンテキストは 'close' の発行を引き起こしたスコープにバインドされています。
  });
  res.end();
}).listen(3000);
```
:::

