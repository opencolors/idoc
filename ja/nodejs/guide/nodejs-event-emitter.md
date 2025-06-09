---
title: Node.js イベントエミッター
description: Node.js イベントエミッターについて学びます。サーバーサイドアプリケーションでイベントを処理するための強力なツールです。
head:
  - - meta
    - name: og:title
      content: Node.js イベントエミッター | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js イベントエミッターについて学びます。サーバーサイドアプリケーションでイベントを処理するための強力なツールです。
  - - meta
    - name: twitter:title
      content: Node.js イベントエミッター | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js イベントエミッターについて学びます。サーバーサイドアプリケーションでイベントを処理するための強力なツールです。
---


# Node.js のイベントエミッター

もしブラウザで JavaScript を扱ったことがあるなら、ユーザーのインタラクションの多くがイベントを通して処理されることをご存知でしょう。マウスのクリック、キーボードのボタン押下、マウスの動きへの反応などです。

バックエンド側では、Node.js は **[events モジュール](/ja/nodejs/api/events)** を使用して同様のシステムを構築するオプションを提供します。

このモジュールは特に、EventEmitter クラスを提供しており、これを使用してイベントを処理します。

次のように初期化します。

```js
import EventEmitter from 'node:events';
const eventEmitter = new EventEmitter();
```

このオブジェクトは、特に `on` および `emit` メソッドを公開します。

- `emit` はイベントをトリガーするために使用されます
- `on` は、イベントがトリガーされたときに実行されるコールバック関数を追加するために使用されます

たとえば、`start` イベントを作成し、サンプルを提供するために、コンソールに出力することでそれに応答してみましょう。

```js
eventEmitter.on('start', () => {
  console.log('started');
});
```

これを実行すると

```js
eventEmitter.emit('start');
```

イベントハンドラー関数がトリガーされ、コンソールログが表示されます。

引数を `emit()` への追加の引数として渡すことで、イベントハンドラーに引数を渡すことができます。

```js
eventEmitter.on('start', number => {
  console.log(`started ${number}`);
});
eventEmitter.emit('start', 23);
```

複数の引数:

```js
eventEmitter.on('start', (start, end) => {
  console.log(`started from ${start} to ${end}`);
});
eventEmitter.emit('start', 1, 100);
```

EventEmitter オブジェクトは、イベントと対話するための他のいくつかのメソッドも公開しています。

- `once()`: 一度限りのリスナーを追加します
- `removeListener()` / `off()`: イベントからイベントリスナーを削除します
- `removeAllListeners()`: イベントのすべてのリスナーを削除します

これらのメソッドの詳細については、[events モジュールのドキュメント](/ja/nodejs/api/events)を参照してください。

