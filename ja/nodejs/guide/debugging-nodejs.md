---
title: Node.js デバッグ
description: Node.js デバッグ オプション、--inspect、--inspect-brk、--debug を含むリモート デバッグ シナリオとレガシ デバッガーの情報。
head:
  - - meta
    - name: og:title
      content: Node.js デバッグ | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js デバッグ オプション、--inspect、--inspect-brk、--debug を含むリモート デバッグ シナリオとレガシ デバッガーの情報。
  - - meta
    - name: twitter:title
      content: Node.js デバッグ | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js デバッグ オプション、--inspect、--inspect-brk、--debug を含むリモート デバッグ シナリオとレガシ デバッガーの情報。
---


# Node.js のデバッグ

このガイドは、Node.js アプリケーションとスクリプトのデバッグを開始するのに役立ちます。

## インスペクターの有効化

`--inspect` スイッチを付けて起動すると、Node.js プロセスはデバッグクライアントをリッスンします。 デフォルトでは、ホストとポート `127.0.0.1:9229` でリッスンします。 各プロセスには、一意の UUID も割り当てられます。

インスペクタークライアントは、接続するためにホストアドレス、ポート、UUID を知って指定する必要があります。 完全な URL は、`ws://127.0.0.1:9229/0f2c936f-b1cd-4ac9-aab3-f63b0f33d55e` のようになります。

Node.js は、`SIGUSR1` シグナルを受信した場合も、デバッグメッセージのリッスンを開始します (Windows では `SIGUSR1` は利用できません)。 Node.js 7 以前では、これによりレガシーデバッガー API がアクティブになります。 Node.js 8 以降では、インスペクター API がアクティブになります。

## セキュリティへの影響

デバッガーは Node.js の実行環境にフルアクセスできるため、このポートに接続できる悪意のある人物は、Node.js プロセスの代わりに任意のコードを実行できる可能性があります。 パブリックネットワークおよびプライベートネットワークでデバッガーポートを公開することのセキュリティへの影響を理解することが重要です。

### デバッグポートを公開することは安全ではありません

デバッガーがパブリック IP アドレスまたは 0.0.0.0 にバインドされている場合、IP アドレスに到達できるすべてのクライアントは、制限なしにデバッガーに接続でき、任意のコードを実行できます。

デフォルトでは、`node --inspect` は 127.0.0.1 にバインドされます。 デバッガーへの外部接続を許可する場合は、パブリック IP アドレスまたは 0.0.0.0 などを明示的に指定する必要があります。 これを行うと、潜在的に重大なセキュリティ上の脅威にさらされる可能性があります。 セキュリティ上の露出を防ぐために、適切なファイアウォールとアクセス制御が整備されていることを確認することをお勧めします。

リモートデバッガークライアントの安全な接続を許可する方法については、 '[リモートデバッグシナリオの有効化](/ja/nodejs/guide/debugging-nodejs#enabling-remote-debugging-scenarios)' のセクションを参照してください。

### ローカルアプリケーションはインスペクターへのフルアクセス権を持っています

インスペクターポートを 127.0.0.1 (デフォルト) にバインドした場合でも、マシン上でローカルに実行されているすべてのアプリケーションは無制限にアクセスできます。 これは、ローカルデバッガーが簡単にアタッチできるようにするための設計によるものです。


### ブラウザ、WebSocket、同一生成元ポリシー

Webブラウザで開かれたウェブサイトは、ブラウザのセキュリティモデルに基づいてWebSocketおよびHTTPリクエストを行うことができます。一意のデバッガセッションIDを取得するには、最初のHTTP接続が必要です。同一生成元ポリシーにより、ウェブサイトはこのHTTP接続を行うことができません。[DNSリバインディング攻撃](https://en.wikipedia.org/wiki/DNS_rebinding)に対する追加のセキュリティとして、Node.jsは接続の「Host」ヘッダーがIPアドレスまたは`localhost`を正確に指定していることを検証します。

これらのセキュリティポリシーにより、ホスト名を指定してリモートデバッグサーバーに接続することは許可されません。IPアドレスを指定するか、以下に示すようにSSHトンネルを使用することで、この制限を回避できます。

## インスペクタークライアント

最小限のCLIデバッガは、`node inspect myscript.js`で使用できます。いくつかの商用およびオープンソースツールも、Node.jsインスペクターに接続できます。

### Chrome DevTools 55+、Microsoft Edge
+ **オプション1**: Chromiumベースのブラウザで`chrome://inspect`を開くか、Edgeで`edge://inspect`を開きます。「Configure」ボタンをクリックし、ターゲットのホストとポートがリストされていることを確認します。
+ **オプション2**: `/json/list`の出力（上記参照）または`--inspect`のヒントテキストから`devtoolsFrontendUrl`をコピーしてChromeに貼り付けます。

詳細については、[https://github.com/ChromeDevTools/devtools-frontend](https://github.com/ChromeDevTools/devtools-frontend)、[https://www.microsoftedgeinsider.com](https://www.microsoftedgeinsider.com)を参照してください。

### Visual Studio Code 1.10+
+ デバッグパネルで、設定アイコンをクリックして`.vscode/launch.json`を開きます。初期設定として「Node.js」を選択します。

詳細については、[https://github.com/microsoft/vscode](https://github.com/microsoft/vscode)を参照してください。

### JetBrains WebStormおよびその他のJetBrains IDE

+ 新しいNode.jsデバッグ構成を作成し、「Debug」をクリックします。Node.js 7+では、`--inspect`がデフォルトで使用されます。無効にするには、IDEレジストリで`js.debugger.node.use.inspect`のチェックを外してください。WebStormおよびその他のJetBrains IDEでのNode.jsの実行とデバッグの詳細については、[WebStormオンラインヘルプ](https://www.jetbrains.com/help/webstorm/running-and-debugging-node-js.html)を参照してください。


### chrome-remote-interface

+ [Inspector Protocol](https://chromedevtools.github.io/debugger-protocol-viewer/v8/) エンドポイントへの接続を容易にするライブラリ。
詳細については、[https://github.com/cyrus-and/chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface) を参照してください。

### Gitpod

+ `Debug` ビューから Node.js デバッグ構成を開始するか、`F5` キーを押します。詳しい手順は以下を参照してください。

詳細については、[https://www.gitpod.io](https://www.gitpod.io) を参照してください。

### Eclipse IDE with Eclipse Wild Web Developer extension

+ `.js` ファイルから `Debug As... > Node program` を選択するか、実行中の Node.js アプリケーションにデバッガーをアタッチするためのデバッグ構成を作成します（すでに `--inspect` で開始されている必要があります）。

詳細については、[https://eclipse.org/eclipseide](https://eclipse.org/eclipseide) を参照してください。

## コマンドラインオプション

次の表は、さまざまなランタイムフラグがデバッグに与える影響を示しています。

| フラグ | 意味 |
| --- | --- |
| `--inspect` | Node.js Inspector を使用したデバッグを有効にします。デフォルトのアドレスとポート (127.0.0.1:9229) でリッスンします。 |
| `--inspect-brk` | Node.js Inspector を使用したデバッグを有効にします。デフォルトのアドレスとポート (127.0.0.1:9229) でリッスンします。ユーザーコードが開始する前に中断します。|
| `--inspect=[host:port]` | Inspector エージェントを有効にします。アドレスまたはホスト名 host にバインドします (デフォルト: 127.0.0.1)。ポート port でリッスンします (デフォルト: 9229)。 |
| `--inspect-brk=[host:port]` | Inspector エージェントを有効にします。アドレスまたはホスト名 host にバインドします (デフォルト: 127.0.0.1)。ポート port でリッスンします (デフォルト: 9229)。ユーザーコードが開始する前に中断します。 |
| `--inspect-wait` | Inspector エージェントを有効にします。デフォルトのアドレスとポート (127.0.0.1:9229) でリッスンします。デバッガーがアタッチされるのを待ちます。 |
| `--inspect-wait=[host:port]` | Inspector エージェントを有効にします。アドレスまたはホスト名 host にバインドします (デフォルト: 127.0.0.1)。ポート port でリッスンします (デフォルト: 9229)。デバッガーがアタッチされるのを待ちます。 |
| `node inspect script.js` | 子プロセスを生成して、ユーザーのスクリプトを --inspect フラグで実行します。メインプロセスを使用して CLI デバッガーを実行します。 |
| `node inspect --port=xxxx script.js` | 子プロセスを生成して、ユーザーのスクリプトを --inspect フラグで実行します。メインプロセスを使用して CLI デバッガーを実行します。ポート port でリッスンします (デフォルト: 9229)。 |


## リモートデバッグシナリオの有効化

デバッガーをパブリックIPアドレスでリッスンさせることは決して推奨しません。リモートデバッグ接続を許可する必要がある場合は、代わりにsshトンネルを使用することをお勧めします。以下の例は、説明のみを目的として提供しています。続行する前に、特権サービスへのリモートアクセスを許可することによるセキュリティリスクを理解してください。

Node.jsをリモートマシン (remote.example.com) で実行していて、デバッグできるようにしたいとします。そのマシンでは、インスペクターがlocalhost (デフォルト) のみでリッスンするようにNode.jsプロセスを開始する必要があります。

```bash
node --inspect app.js
```

次に、デバッグクライアント接続を開始したいローカルマシンで、sshトンネルを設定できます。

```bash
ssh -L 9225:localhost:9229 remote.example.com
```

これはsshトンネルセッションを開始し、ローカルマシンのポート9221への接続がremote.example.comのポート9229に転送されます。Chrome DevToolsやVisual Studio Codeなどのデバッガーをlocalhost:9221にアタッチできるようになり、Node.jsアプリケーションがローカルで実行されているかのようにデバッグできるはずです。

## レガシーデバッガー

**レガシーデバッガーはNode.js 7.7.0以降で非推奨になりました。代わりに--inspectとInspectorを使用してください。**

バージョン7以前で`--debug`または`--debug-brk`スイッチを付けて起動すると、Node.jsはTCPポート (デフォルトでは`5858`) 上で、廃止されたV8デバッグプロトコルで定義されたデバッグコマンドをリッスンします。このプロトコルを話すデバッガークライアントは、実行中のプロセスに接続してデバッグできます。以下に、いくつかの一般的なものをリストします。

V8デバッグプロトコルは、もはやメンテナンスもドキュメント化もされていません。

### ビルトインデバッガー

`node debug script_name.js` を実行して、ビルトインコマンドラインデバッガーでスクリプトを開始します。スクリプトは、`--debug-brk`オプションで開始された別のNode.jsプロセスで開始され、初期のNode.jsプロセスは`_debugger.js`スクリプトを実行してターゲットに接続します。詳細については、[ドキュメント](/ja/nodejs/api/debugger)を参照してください。


### node-inspector

Node.js アプリを Chrome DevTools でデバッグします。Chromium で使用される [Inspector Protocol](https://chromedevtools.github.io/debugger-protocol-viewer/v8/) を Node.js で使用される V8 Debugger プロトコルに変換する中間プロセスを使用します。詳細については、[https://github.com/node-inspector/node-inspector](https://github.com/node-inspector/node-inspector) を参照してください。

