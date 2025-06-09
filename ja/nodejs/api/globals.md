---
title: Node.jsのグローバルオブジェクト
description: このページでは、Node.jsで利用可能なグローバルオブジェクトについて記載しています。モジュールから明示的なインポートを必要とせずにアクセス可能なグローバル変数、関数、クラスを含みます。
head:
  - - meta
    - name: og:title
      content: Node.jsのグローバルオブジェクト | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: このページでは、Node.jsで利用可能なグローバルオブジェクトについて記載しています。モジュールから明示的なインポートを必要とせずにアクセス可能なグローバル変数、関数、クラスを含みます。
  - - meta
    - name: twitter:title
      content: Node.jsのグローバルオブジェクト | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: このページでは、Node.jsで利用可能なグローバルオブジェクトについて記載しています。モジュールから明示的なインポートを必要とせずにアクセス可能なグローバル変数、関数、クラスを含みます。
---


# グローバルオブジェクト {#global-objects}

これらのオブジェクトは、すべてのモジュールで使用できます。

次の変数はグローバルに見えるかもしれませんが、そうではありません。これらは、[CommonJS モジュール](/ja/nodejs/api/modules)のスコープ内でのみ存在します。

- [`__dirname`](/ja/nodejs/api/modules#__dirname)
- [`__filename`](/ja/nodejs/api/modules#__filename)
- [`exports`](/ja/nodejs/api/modules#exports)
- [`module`](/ja/nodejs/api/modules#module)
- [`require()`](/ja/nodejs/api/modules#requireid)

ここにリストされているオブジェクトは、Node.js に固有のものです。JavaScript 言語自体の一部である [組み込みオブジェクト](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)もあり、これらもグローバルにアクセス可能です。

## Class: `AbortController` {#class-abortcontroller}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.4.0 | 実験的ではなくなりました。 |
| v15.0.0, v14.17.0 | 追加: v15.0.0, v14.17.0 |
:::

選択された `Promise` ベースの API でキャンセルを通知するために使用されるユーティリティクラス。API は、Web API の [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) に基づいています。

```js [ESM]
const ac = new AbortController();

ac.signal.addEventListener('abort', () => console.log('Aborted!'),
                           { once: true });

ac.abort();

console.log(ac.signal.aborted);  // true を出力
```
### `abortController.abort([reason])` {#abortcontrollerabortreason}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v17.2.0, v16.14.0 | 新しいオプションの reason 引数を追加しました。 |
| v15.0.0, v14.17.0 | 追加: v15.0.0, v14.17.0 |
:::

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) オプションの理由で、`AbortSignal` の `reason` プロパティで取得できます。

abort シグナルをトリガーし、`abortController.signal` が `'abort'` イベントを発行するようにします。

### `abortController.signal` {#abortcontrollersignal}

**追加: v15.0.0, v14.17.0**

- タイプ: [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)

### Class: `AbortSignal` {#class-abortsignal}

**追加: v15.0.0, v14.17.0**

- 拡張: [\<EventTarget\>](/ja/nodejs/api/events#class-eventtarget)

`AbortSignal` は、`abortController.abort()` メソッドが呼び出されたときにオブザーバーに通知するために使用されます。


#### 静的メソッド: `AbortSignal.abort([reason])` {#static-method-abortsignalabortreason}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v17.2.0, v16.14.0 | 新しいオプションの reason 引数が追加されました。 |
| v15.12.0, v14.17.0 | 追加: v15.12.0, v14.17.0 |
:::

- `reason`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)

すでに中断された新しい `AbortSignal` を返します。

#### 静的メソッド: `AbortSignal.timeout(delay)` {#static-method-abortsignaltimeoutdelay}

**追加: v17.3.0, v16.14.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) AbortSignal をトリガーするまで待機するミリ秒数。

`delay` ミリ秒後に中断される新しい `AbortSignal` を返します。

#### 静的メソッド: `AbortSignal.any(signals)` {#static-method-abortsignalanysignals}

**追加: v20.3.0, v18.17.0**

- `signals` [\<AbortSignal[]\>](/ja/nodejs/api/globals#class-abortsignal) 新しい `AbortSignal` を構成する `AbortSignal`。

指定されたシグナルのいずれかが中断された場合に中断される新しい `AbortSignal` を返します。 その [`abortSignal.reason`](/ja/nodejs/api/globals#abortsignalreason) は、中断の原因となった `signals` のいずれかに設定されます。

#### イベント: `'abort'` {#event-abort}

**追加: v15.0.0, v14.17.0**

`'abort'` イベントは、`abortController.abort()` メソッドが呼び出されたときに発生します。 コールバックは、`type` プロパティが `'abort'` に設定された単一のオブジェクト引数で呼び出されます。

```js [ESM]
const ac = new AbortController();

// onabort プロパティを使用...
ac.signal.onabort = () => console.log('aborted!');

// または EventTarget API を使用...
ac.signal.addEventListener('abort', (event) => {
  console.log(event.type);  // 'abort' を出力
}, { once: true });

ac.abort();
```
`AbortSignal` が関連付けられている `AbortController` は、`'abort'` イベントを 1 回だけトリガーします。 コードは、`'abort'` イベントリスナーを追加する前に、`abortSignal.aborted` 属性が `false` であることを確認することをお勧めします。

`AbortSignal` にアタッチされたイベントリスナーは、`{ once: true }` オプションを使用するか（または、`EventEmitter` API を使用してリスナーをアタッチする場合は、`once()` メソッドを使用します）、`'abort'` イベントが処理されるとすぐにイベントリスナーが削除されるようにする必要があります。 そうしないと、メモリリークが発生する可能性があります。


#### `abortSignal.aborted` {#abortsignalaborted}

**Added in: v15.0.0, v14.17.0**

- 型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `AbortController` が中止された後、真になります。

#### `abortSignal.onabort` {#abortsignalonabort}

**Added in: v15.0.0, v14.17.0**

- 型: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`abortController.abort()` 関数が呼び出されたときに通知されるように、ユーザーコードによって設定できるオプションのコールバック関数です。

#### `abortSignal.reason` {#abortsignalreason}

**Added in: v17.2.0, v16.14.0**

- 型: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`AbortSignal` がトリガーされたときに指定されたオプションの理由です。

```js [ESM]
const ac = new AbortController();
ac.abort(new Error('boom!'));
console.log(ac.signal.reason);  // Error: boom!
```
#### `abortSignal.throwIfAborted()` {#abortsignalthrowifaborted}

**Added in: v17.3.0, v16.17.0**

`abortSignal.aborted` が `true` の場合、`abortSignal.reason` をスローします。

## Class: `Blob` {#class-blob}

**Added in: v18.0.0**

[\<Blob\>](/ja/nodejs/api/buffer#class-blob) を参照してください。

## Class: `Buffer` {#class-buffer}

**Added in: v0.1.103**

- [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

バイナリデータを扱うために使用されます。[buffer section](/ja/nodejs/api/buffer) を参照してください。

## Class: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的。
:::

[`ByteLengthQueuingStrategy`](/ja/nodejs/api/webstreams#class-bytelengthqueuingstrategy) のブラウザ互換実装。

## `__dirname` {#__dirname}

この変数はグローバルのように見えるかもしれませんが、そうではありません。[`__dirname`](/ja/nodejs/api/modules#__dirname) を参照してください。

## `__filename` {#__filename}

この変数はグローバルのように見えるかもしれませんが、そうではありません。[`__filename`](/ja/nodejs/api/modules#__filename) を参照してください。

## `atob(data)` {#atobdata}

**Added in: v16.0.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ja/nodejs/api/documentation#stability-index) [Stability: 3](/ja/nodejs/api/documentation#stability-index) - レガシー。代わりに `Buffer.from(data, 'base64')` を使用してください。
:::

[`buffer.atob()`](/ja/nodejs/api/buffer#bufferatobdata) のグローバルエイリアス。


## `BroadcastChannel` {#broadcastchannel}

**Added in: v18.0.0**

[\<BroadcastChannel\>](/ja/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget) を参照してください。

## `btoa(data)` {#btoadata}

**Added in: v16.0.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ja/nodejs/api/documentation#stability-index) [安定度: 3](/ja/nodejs/api/documentation#stability-index) - レガシー。代わりに `buf.toString('base64')` を使用してください。
:::

[`buffer.btoa()`](/ja/nodejs/api/buffer#bufferbtoadata) のグローバルエイリアス。

## `clearImmediate(immediateObject)` {#clearimmediateimmediateobject}

**Added in: v0.9.1**

[`clearImmediate`](/ja/nodejs/api/timers#clearimmediateimmediate) は [timers](/ja/nodejs/api/timers) セクションで説明されています。

## `clearInterval(intervalObject)` {#clearintervalintervalobject}

**Added in: v0.0.1**

[`clearInterval`](/ja/nodejs/api/timers#clearintervaltimeout) は [timers](/ja/nodejs/api/timers) セクションで説明されています。

## `clearTimeout(timeoutObject)` {#cleartimeouttimeoutobject}

**Added in: v0.0.1**

[`clearTimeout`](/ja/nodejs/api/timers#cleartimeouttimeout) は [timers](/ja/nodejs/api/timers) セクションで説明されています。

## `CloseEvent` {#closeevent}

**Added in: v23.0.0**

`CloseEvent` クラス。詳細については、[`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent) を参照してください。

[`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent) のブラウザ互換実装。[`--no-experimental-websocket`](/ja/nodejs/api/cli#--no-experimental-websocket) CLI フラグでこの API を無効にします。

## Class: `CompressionStream` {#class-compressionstream}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的。
:::

[`CompressionStream`](/ja/nodejs/api/webstreams#class-compressionstream) のブラウザ互換実装。

## `console` {#console}

**Added in: v0.1.100**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

stdout および stderr に出力するために使用されます。[`console`](/ja/nodejs/api/console) セクションを参照してください。

## Class: `CountQueuingStrategy` {#class-countqueuingstrategy}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的。
:::

[`CountQueuingStrategy`](/ja/nodejs/api/webstreams#class-countqueuingstrategy) のブラウザ互換実装。


## `Crypto` {#crypto}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | 実験的ではなくなりました。 |
| v19.0.0 | `--experimental-global-webcrypto` CLI フラグの背後になくなりました。 |
| v17.6.0, v16.15.0 | 追加: v17.6.0, v16.15.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定。
:::

[\<Crypto\>](/ja/nodejs/api/webcrypto#class-crypto)のブラウザ互換実装。このグローバル変数は、Node.jsバイナリが`node:crypto`モジュールのサポートを含めてコンパイルされた場合にのみ利用可能です。

## `crypto` {#crypto_1}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | 実験的ではなくなりました。 |
| v19.0.0 | `--experimental-global-webcrypto` CLI フラグの背後になくなりました。 |
| v17.6.0, v16.15.0 | 追加: v17.6.0, v16.15.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定。
:::

[Web Crypto API](/ja/nodejs/api/webcrypto)のブラウザ互換実装。

## `CryptoKey` {#cryptokey}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | 実験的ではなくなりました。 |
| v19.0.0 | `--experimental-global-webcrypto` CLI フラグの背後になくなりました。 |
| v17.6.0, v16.15.0 | 追加: v17.6.0, v16.15.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定。
:::

[\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey)のブラウザ互換実装。このグローバル変数は、Node.jsバイナリが`node:crypto`モジュールのサポートを含めてコンパイルされた場合にのみ利用可能です。

## `CustomEvent` {#customevent}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | 実験的ではなくなりました。 |
| v22.1.0, v20.13.0 | CustomEvent は安定版になりました。 |
| v19.0.0 | `--experimental-global-customevent` CLI フラグの背後になくなりました。 |
| v18.7.0, v16.17.0 | 追加: v18.7.0, v16.17.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

[`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent)のブラウザ互換実装。


## Class: `DecompressionStream` {#class-decompressionstream}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - Experimental.
:::

[`DecompressionStream`](/ja/nodejs/api/webstreams#class-decompressionstream) のブラウザ互換実装。

## `Event` {#event}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.4.0 | Experimentalではなくなりました。 |
| v15.0.0 | Added in: v15.0.0 |
:::

`Event` クラスのブラウザ互換実装。詳細は [`EventTarget` および `Event` API](/ja/nodejs/api/events#eventtarget-and-event-api) を参照してください。

## `EventSource` {#eventsource}

**Added in: v22.3.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - Experimental. このAPIを有効にするには、[`--experimental-eventsource`](/ja/nodejs/api/cli#--experimental-eventsource) CLIフラグを使用してください。
:::

[`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) クラスのブラウザ互換実装。

## `EventTarget` {#eventtarget}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.4.0 | Experimentalではなくなりました。 |
| v15.0.0 | Added in: v15.0.0 |
:::

`EventTarget` クラスのブラウザ互換実装。詳細は [`EventTarget` および `Event` API](/ja/nodejs/api/events#eventtarget-and-event-api) を参照してください。

## `exports` {#exports}

この変数はグローバルに見えるかもしれませんが、そうではありません。[`exports`](/ja/nodejs/api/modules#exports) を参照してください。

## `fetch` {#fetch}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | Experimentalではなくなりました。 |
| v18.0.0 | `--experimental-fetch` CLIフラグの背後に隠されなくなりました。 |
| v17.5.0, v16.15.0 | Added in: v17.5.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - Stable
:::

[`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) 関数のブラウザ互換実装。

## Class: `File` {#class-file}

**Added in: v20.0.0**

[\<File\>](/ja/nodejs/api/buffer#class-file) を参照してください。


## Class `FormData` {#class-formdata}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v21.0.0 | 実験的ではなくなりました。 |
| v18.0.0 | `--experimental-fetch` CLI フラグの背後になくなりました。 |
| v17.6.0, v16.15.0 | 追加: v17.6.0, v16.15.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

[\<FormData\>](https://developer.mozilla.org/en-US/docs/Web/API/FormData) のブラウザ互換実装。

## `global` {#global}

**追加: v0.1.27**

::: info [安定版: 3 - レガシー]
[安定版: 3](/ja/nodejs/api/documentation#stability-index) [安定性: 3](/ja/nodejs/api/documentation#stability-index) - レガシー。代わりに [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) を使用してください。
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) グローバル名前空間オブジェクト。

ブラウザでは、トップレベルのスコープは伝統的にグローバルスコープでした。これは、ECMAScript モジュール内を除き、`var something` が新しいグローバル変数を定義することを意味します。Node.js では、これは異なります。トップレベルのスコープはグローバルスコープではありません。Node.js モジュール内の `var something` は、それが [CommonJS モジュール](/ja/nodejs/api/modules) であるか [ECMAScript モジュール](/ja/nodejs/api/esm) であるかに関わらず、そのモジュールに対してローカルになります。

## Class `Headers` {#class-headers}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v21.0.0 | 実験的ではなくなりました。 |
| v18.0.0 | `--experimental-fetch` CLI フラグの背後になくなりました。 |
| v17.5.0, v16.15.0 | 追加: v17.5.0, v16.15.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

[\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers) のブラウザ互換実装。

## `localStorage` {#localstorage}

**追加: v22.4.0**

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 早期開発。
:::

[`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) のブラウザ互換実装。データは、[`--localstorage-file`](/ja/nodejs/api/cli#--localstorage-filefile) CLI フラグで指定されたファイルに暗号化されずに保存されます。保存できるデータの最大量は 10 MB です。Web Storage API 以外でのこのデータの変更はサポートされていません。[`--experimental-webstorage`](/ja/nodejs/api/cli#--experimental-webstorage) CLI フラグを使用してこの API を有効にします。サーバーのコンテキストで使用する場合、`localStorage` データはユーザーごとまたはリクエストごとに保存されず、すべてのユーザーとリクエストで共有されます。


## `MessageChannel` {#messagechannel}

**Added in: v15.0.0**

`MessageChannel` クラス。詳細については、[`MessageChannel`](/ja/nodejs/api/worker_threads#class-messagechannel) を参照してください。

## `MessageEvent` {#messageevent}

**Added in: v15.0.0**

`MessageEvent` クラス。詳細については、[`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/MessageEvent) を参照してください。

## `MessagePort` {#messageport}

**Added in: v15.0.0**

`MessagePort` クラス。詳細については、[`MessagePort`](/ja/nodejs/api/worker_threads#class-messageport) を参照してください。

## `module` {#module}

この変数はグローバルに見えるかもしれませんが、そうではありません。[`module`](/ja/nodejs/api/modules#module) を参照してください。

## `Navigator` {#navigator}

**Added in: v21.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発。この API を無効にするには、[`--no-experimental-global-navigator`](/ja/nodejs/api/cli#--no-experimental-global-navigator) CLI フラグを使用します。
:::

[Navigator API](https://html.spec.whatwg.org/multipage/system-state#the-navigator-object) の部分的な実装。

## `navigator` {#navigator_1}

**Added in: v21.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発。この API を無効にするには、[`--no-experimental-global-navigator`](/ja/nodejs/api/cli#--no-experimental-global-navigator) CLI フラグを使用します。
:::

[`window.navigator`](https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator) の部分的な実装。

### `navigator.hardwareConcurrency` {#navigatorhardwareconcurrency}

**Added in: v21.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`navigator.hardwareConcurrency` 読み取り専用プロパティは、現在の Node.js インスタンスで使用可能な論理プロセッサの数を返します。

```js [ESM]
console.log(`このプロセスは ${navigator.hardwareConcurrency} 個の論理プロセッサで実行されています`);
```
### `navigator.language` {#navigatorlanguage}

**Added in: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`navigator.language` 読み取り専用プロパティは、Node.js インスタンスの優先言語を表す文字列を返します。言語は、実行時に Node.js が使用する ICU ライブラリによって、オペレーティングシステムのデフォルト言語に基づいて決定されます。

この値は、[RFC 5646](https://www.rfc-editor.org/rfc/rfc5646.txt) で定義されている言語バージョンを表しています。

ICU なしのビルドのフォールバック値は `'en-US'` です。

```js [ESM]
console.log(`Node.js インスタンスの優先言語にはタグ '${navigator.language}' があります`);
```

### `navigator.languages` {#navigatorlanguages}

**Added in: v21.2.0**

- {Array

`navigator.languages`の読み取り専用プロパティは、Node.jsインスタンスの優先言語を表す文字列の配列を返します。デフォルトでは、`navigator.languages`は`navigator.language`の値のみを含み、これはNode.jsが実行時に使用するICUライブラリによって、オペレーティングシステムのデフォルト言語に基づいて決定されます。

ICUなしでビルドする場合のフォールバック値は`['en-US']`です。

```js [ESM]
console.log(`優先言語は '${navigator.languages}'`);
```
### `navigator.platform` {#navigatorplatform}

**Added in: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`navigator.platform`の読み取り専用プロパティは、Node.jsインスタンスが実行されているプラットフォームを識別する文字列を返します。

```js [ESM]
console.log(`このプロセスは ${navigator.platform} 上で実行されています`);
```
### `navigator.userAgent` {#navigatoruseragent}

**Added in: v21.1.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`navigator.userAgent`の読み取り専用プロパティは、ランタイム名とメジャーバージョン番号で構成されるユーザーエージェントを返します。

```js [ESM]
console.log(`ユーザーエージェントは ${navigator.userAgent} です`); // Prints "Node.js/21"
```
## `PerformanceEntry` {#performanceentry}

**Added in: v19.0.0**

`PerformanceEntry` クラス。詳細は [`PerformanceEntry`](/ja/nodejs/api/perf_hooks#class-performanceentry) を参照してください。

## `PerformanceMark` {#performancemark}

**Added in: v19.0.0**

`PerformanceMark` クラス。詳細は [`PerformanceMark`](/ja/nodejs/api/perf_hooks#class-performancemark) を参照してください。

## `PerformanceMeasure` {#performancemeasure}

**Added in: v19.0.0**

`PerformanceMeasure` クラス。詳細は [`PerformanceMeasure`](/ja/nodejs/api/perf_hooks#class-performancemeasure) を参照してください。

## `PerformanceObserver` {#performanceobserver}

**Added in: v19.0.0**

`PerformanceObserver` クラス。詳細は [`PerformanceObserver`](/ja/nodejs/api/perf_hooks#class-performanceobserver) を参照してください。

## `PerformanceObserverEntryList` {#performanceobserverentrylist}

**Added in: v19.0.0**

`PerformanceObserverEntryList` クラス。詳細は [`PerformanceObserverEntryList`](/ja/nodejs/api/perf_hooks#class-performanceobserverentrylist) を参照してください。


## `PerformanceResourceTiming` {#performanceresourcetiming}

**Added in: v19.0.0**

`PerformanceResourceTiming` クラス。詳細は[`PerformanceResourceTiming`](/ja/nodejs/api/perf_hooks#class-performanceresourcetiming)を参照してください。

## `performance` {#performance}

**Added in: v16.0.0**

[`perf_hooks.performance`](/ja/nodejs/api/perf_hooks#perf_hooksperformance) オブジェクト。

## `process` {#process}

**Added in: v0.1.7**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

process オブジェクト。[`process` オブジェクト](/ja/nodejs/api/process#process)のセクションを参照してください。

## `queueMicrotask(callback)` {#queuemicrotaskcallback}

**Added in: v11.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) キューに入れる関数。

`queueMicrotask()` メソッドは、`callback` を呼び出すマイクロタスクをキューに入れます。`callback` が例外をスローすると、[`process` オブジェクト](/ja/nodejs/api/process#process) の `'uncaughtException'` イベントが発生します。

マイクロタスクキューは V8 によって管理され、Node.js によって管理される [`process.nextTick()`](/ja/nodejs/api/process#processnexttickcallback-args) キューと同様の方法で使用できます。`process.nextTick()` キューは、Node.js イベントループの各ターンにおいて、常にマイクロタスクキューの前に処理されます。

```js [ESM]
// ここでは、`queueMicrotask()` を使用して、'load' イベントが常に
// 非同期で、したがって一貫して発行されるようにしています。
// ここで `process.nextTick()` を使用すると、'load' イベントが常に
// 他のすべての Promise ジョブの前に発行されることになります。

DataHandler.prototype.load = async function load(key) {
  const hit = this._cache.get(key);
  if (hit !== undefined) {
    queueMicrotask(() => {
      this.emit('load', hit);
    });
    return;
  }

  const data = await fetchData(key);
  this._cache.set(key, data);
  this.emit('load', data);
};
```
## Class: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

**Added in: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的。
:::

[`ReadableByteStreamController`](/ja/nodejs/api/webstreams#class-readablebytestreamcontroller) のブラウザ互換実装。


## クラス: `ReadableStream` {#class-readablestream}

**追加: v18.0.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index) - 試験的。
:::

[`ReadableStream`](/ja/nodejs/api/webstreams#class-readablestream) のブラウザ互換実装。

## クラス: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}

**追加: v18.0.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index) - 試験的。
:::

[`ReadableStreamBYOBReader`](/ja/nodejs/api/webstreams#class-readablestreambyobreader) のブラウザ互換実装。

## クラス: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

**追加: v18.0.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index) - 試験的。
:::

[`ReadableStreamBYOBRequest`](/ja/nodejs/api/webstreams#class-readablestreambyobrequest) のブラウザ互換実装。

## クラス: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**追加: v18.0.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index) - 試験的。
:::

[`ReadableStreamDefaultController`](/ja/nodejs/api/webstreams#class-readablestreamdefaultcontroller) のブラウザ互換実装。

## クラス: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

**追加: v18.0.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index) - 試験的。
:::

[`ReadableStreamDefaultReader`](/ja/nodejs/api/webstreams#class-readablestreamdefaultreader) のブラウザ互換実装。

## `require()` {#require}

この変数はグローバルに見えるかもしれませんが、そうではありません。[`require()`](/ja/nodejs/api/modules#requireid) を参照してください。

## `Response` {#response}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v21.0.0 | 試験的ではなくなりました。 |
| v18.0.0 | `--experimental-fetch` CLIフラグの背後に隠れなくなりました。 |
| v17.5.0, v16.15.0 | 追加: v17.5.0, v16.15.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定版: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

[\<Response\>](https://developer.mozilla.org/en-US/docs/Web/API/Response) のブラウザ互換実装。


## `Request` {#request}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v21.0.0 | 実験的ではなくなりました。 |
| v18.0.0 | `--experimental-fetch` CLI フラグの背後に隠されなくなりました。 |
| v17.5.0, v16.15.0 | 追加: v17.5.0, v16.15.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

[\<Request\>](https://developer.mozilla.org/en-US/docs/Web/API/Request) のブラウザ互換実装。

## `sessionStorage` {#sessionstorage}

**追加: v22.4.0**

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index).0 - 早期開発。
:::

[`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) のブラウザ互換実装。データはメモリに保存され、ストレージクォータは 10 MB です。`sessionStorage` データは、現在実行中のプロセス内でのみ保持され、ワーカー間で共有されません。

## `setImmediate(callback[, ...args])` {#setimmediatecallback-args}

**追加: v0.9.1**

[`setImmediate`](/ja/nodejs/api/timers#setimmediatecallback-args) は [timers](/ja/nodejs/api/timers) セクションで説明されています。

## `setInterval(callback, delay[, ...args])` {#setintervalcallback-delay-args}

**追加: v0.0.1**

[`setInterval`](/ja/nodejs/api/timers#setintervalcallback-delay-args) は [timers](/ja/nodejs/api/timers) セクションで説明されています。

## `setTimeout(callback, delay[, ...args])` {#settimeoutcallback-delay-args}

**追加: v0.0.1**

[`setTimeout`](/ja/nodejs/api/timers#settimeoutcallback-delay-args) は [timers](/ja/nodejs/api/timers) セクションで説明されています。

## Class: `Storage` {#class-storage}

**追加: v22.4.0**

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index).0 - 早期開発。
:::

[`Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage) のブラウザ互換実装。この API を有効にするには、[`--experimental-webstorage`](/ja/nodejs/api/cli#--experimental-webstorage) CLI フラグを使用します。

## `structuredClone(value[, options])` {#structuredclonevalue-options}

**追加: v17.0.0**

WHATWG [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) メソッド。


## `SubtleCrypto` {#subtlecrypto}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.0.0 | `--experimental-global-webcrypto` CLI フラグの背後に隠されていなくなりました。 |
| v17.6.0, v16.15.0 | 追加: v17.6.0, v16.15.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定。
:::

[\<SubtleCrypto\>](/ja/nodejs/api/webcrypto#class-subtlecrypto) のブラウザ互換実装です。このグローバル変数は、Node.js バイナリが `node:crypto` モジュールのサポートを含めてコンパイルされている場合にのみ使用可能です。

## `DOMException` {#domexception}

**追加: v17.0.0**

WHATWG `DOMException` クラス。詳細は [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException) を参照してください。

## `TextDecoder` {#textdecoder}

**追加: v11.0.0**

WHATWG `TextDecoder` クラス。[`TextDecoder`](/ja/nodejs/api/util#class-utiltextdecoder) セクションを参照してください。

## クラス: `TextDecoderStream` {#class-textdecoderstream}

**追加: v18.0.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的。
:::

[`TextDecoderStream`](/ja/nodejs/api/webstreams#class-textdecoderstream) のブラウザ互換実装です。

## `TextEncoder` {#textencoder}

**追加: v11.0.0**

WHATWG `TextEncoder` クラス。[`TextEncoder`](/ja/nodejs/api/util#class-utiltextencoder) セクションを参照してください。

## クラス: `TextEncoderStream` {#class-textencoderstream}

**追加: v18.0.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的。
:::

[`TextEncoderStream`](/ja/nodejs/api/webstreams#class-textencoderstream) のブラウザ互換実装です。

## クラス: `TransformStream` {#class-transformstream}

**追加: v18.0.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的。
:::

[`TransformStream`](/ja/nodejs/api/webstreams#class-transformstream) のブラウザ互換実装です。

## クラス: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}

**追加: v18.0.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的。
:::

[`TransformStreamDefaultController`](/ja/nodejs/api/webstreams#class-transformstreamdefaultcontroller) のブラウザ互換実装です。


## `URL` {#url}

**Added in: v10.0.0**

WHATWG の `URL` クラスです。[`URL`](/ja/nodejs/api/url#class-url) セクションを参照してください。

## `URLSearchParams` {#urlsearchparams}

**Added in: v10.0.0**

WHATWG の `URLSearchParams` クラスです。[`URLSearchParams`](/ja/nodejs/api/url#class-urlsearchparams) セクションを参照してください。

## `WebAssembly` {#webassembly}

**Added in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

すべての W3C [WebAssembly](https://webassembly.org/) 関連機能の名前空間として機能するオブジェクト。使用方法と互換性については、[Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/WebAssembly) を参照してください。

## `WebSocket` {#websocket}

::: info [履歴]
| Version | Changes |
| --- | --- |
| v22.4.0 | 実験的ではなくなりました。 |
| v22.0.0 | `--experimental-websocket` CLI フラグの背後になくなりました。 |
| v21.0.0, v20.10.0 | Added in: v21.0.0, v20.10.0 |
:::

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定。
:::

[`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) のブラウザ互換実装。[`--no-experimental-websocket`](/ja/nodejs/api/cli#--no-experimental-websocket) CLI フラグを使用して、この API を無効にします。

## Class: `WritableStream` {#class-writablestream}

**Added in: v18.0.0**

::: warning [Stable: 1 - 実験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 実験的。
:::

[`WritableStream`](/ja/nodejs/api/webstreams#class-writablestream) のブラウザ互換実装。

## Class: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

**Added in: v18.0.0**

::: warning [Stable: 1 - 実験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 実験的。
:::

[`WritableStreamDefaultController`](/ja/nodejs/api/webstreams#class-writablestreamdefaultcontroller) のブラウザ互換実装。

## Class: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}

**Added in: v18.0.0**

::: warning [Stable: 1 - 実験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 実験的。
:::

[`WritableStreamDefaultWriter`](/ja/nodejs/api/webstreams#class-writablestreamdefaultwriter) のブラウザ互換実装。

