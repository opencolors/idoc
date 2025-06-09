---
title: Node.js OSモジュールのドキュメント
description: Node.jsのOSモジュールは、OS関連のユーティリティメソッドを提供します。これを使って、基盤となるオペレーティングシステムと対話し、システム情報を取得し、システムレベルの操作を行うことができます。
head:
  - - meta
    - name: og:title
      content: Node.js OSモジュールのドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのOSモジュールは、OS関連のユーティリティメソッドを提供します。これを使って、基盤となるオペレーティングシステムと対話し、システム情報を取得し、システムレベルの操作を行うことができます。
  - - meta
    - name: twitter:title
      content: Node.js OSモジュールのドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのOSモジュールは、OS関連のユーティリティメソッドを提供します。これを使って、基盤となるオペレーティングシステムと対話し、システム情報を取得し、システムレベルの操作を行うことができます。
---


# OS {#os}

::: tip [Stable: 2 - 安定版]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定版: 2](/ja/nodejs/api/documentation#stability-index) - 安定版
:::

**ソースコード:** [lib/os.js](https://github.com/nodejs/node/blob/v23.5.0/lib/os.js)

`node:os` モジュールは、オペレーティングシステム関連のユーティリティメソッドとプロパティを提供します。これは、以下を使用してアクセスできます。

::: code-group
```js [ESM]
import os from 'node:os';
```

```js [CJS]
const os = require('node:os');
```
:::

## `os.EOL` {#oseol}

**追加:** v0.7.8

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

オペレーティングシステム固有の改行マーカー。

- POSIX では `\n`
- Windows では `\r\n`

## `os.availableParallelism()` {#osavailableparallelism}

**追加:** v19.4.0, v18.14.0

- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

プログラムが使用するデフォルトの並列処理の量を推定して返します。常にゼロより大きい値を返します。

この関数は、libuv の [`uv_available_parallelism()`](https://docs.libuv.org/en/v1.x/misc#c.uv_available_parallelism) に関する小さなラッパーです。

## `os.arch()` {#osarch}

**追加:** v0.5.0

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js バイナリがコンパイルされたオペレーティングシステムの CPU アーキテクチャを返します。 可能な値は、`'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'`, および `'x64'` です。

戻り値は、[`process.arch`](/ja/nodejs/api/process#processarch) と同等です。

## `os.constants` {#osconstants}

**追加:** v6.3.0

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

エラーコード、プロセスシグナルなど、一般的に使用されるオペレーティングシステム固有の定数が含まれています。 定義されている特定の定数は、[OS 定数](/ja/nodejs/api/os#os-constants)で説明されています。

## `os.cpus()` {#oscpus}

**追加:** v0.3.3

- 戻り値: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

各論理 CPU コアに関する情報を含むオブジェクトの配列を返します。 `/proc` ファイルシステムが利用できない場合など、CPU 情報が利用できない場合、配列は空になります。

各オブジェクトに含まれるプロパティは次のとおりです。

- `model` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `speed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (MHz 単位)
- `times` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU がユーザーモードで費やしたミリ秒数。
    - `nice` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU がナイスモードで費やしたミリ秒数。
    - `sys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU がシステムモードで費やしたミリ秒数。
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU がアイドルモードで費やしたミリ秒数。
    - `irq` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU が irq モードで費やしたミリ秒数。

```js [ESM]
[
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 252020,
      nice: 0,
      sys: 30340,
      idle: 1070356870,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 306960,
      nice: 0,
      sys: 26980,
      idle: 1071569080,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 248450,
      nice: 0,
      sys: 21750,
      idle: 1070919370,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 256880,
      nice: 0,
      sys: 19430,
      idle: 1070905480,
      irq: 20,
    },
  },
]
```

`nice` の値は POSIX 限定です。 Windows では、すべてのプロセッサの `nice` の値は常に 0 です。

`os.cpus().length` は、アプリケーションで利用可能な並列処理の量を計算するために使用しないでください。 この目的には、[`os.availableParallelism()`](/ja/nodejs/api/os#osavailableparallelism) を使用してください。


## `os.devNull` {#osdevnull}

**Added in: v16.3.0, v14.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

nullデバイスのプラットフォーム固有のファイルパス。

- Windowsでは`\\.\nul`
- POSIXでは`/dev/null`

## `os.endianness()` {#osendianness}

**Added in: v0.9.4**

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.jsバイナリがコンパイルされたCPUのエンディアンを識別する文字列を返します。

可能な値は、ビッグエンディアンの場合は`'BE'`、リトルエンディアンの場合は`'LE'`です。

## `os.freemem()` {#osfreemem}

**Added in: v0.3.3**

- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

空きシステムメモリ量をバイト単位の整数で返します。

## `os.getPriority([pid])` {#osgetprioritypid}

**Added in: v10.10.0**

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) スケジューリング優先度を取得するプロセスID。 **デフォルト:** `0`。
- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`pid`で指定されたプロセスのスケジューリング優先度を返します。 `pid`が提供されていないか`0`の場合、現在のプロセスの優先度が返されます。

## `os.homedir()` {#oshomedir}

**Added in: v2.3.0**

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

現在のユーザーのホームディレクトリの文字列パスを返します。

POSIXでは、`$HOME`環境変数が定義されている場合はそれを使用します。 それ以外の場合は、[実効UID](https://en.wikipedia.org/wiki/User_identifier#Effective_user_ID)を使用して、ユーザーのホームディレクトリを検索します。

Windowsでは、`USERPROFILE`環境変数が定義されている場合はそれを使用します。 それ以外の場合は、現在のユーザーのプロファイルディレクトリへのパスを使用します。

## `os.hostname()` {#oshostname}

**Added in: v0.3.3**

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

オペレーティングシステムのホスト名を文字列として返します。


## `os.loadavg()` {#osloadavg}

**Added in: v0.3.3**

- 戻り値: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

1分、5分、15分のロードアベレージを含む配列を返します。

ロードアベレージは、オペレーティングシステムによって計算され、小数で表されるシステムアクティビティの尺度です。

ロードアベレージはUnix固有の概念です。Windowsでは、戻り値は常に`[0, 0, 0]`です。

## `os.machine()` {#osmachine}

**Added in: v18.9.0, v16.18.0**

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`arm`、`arm64`、`aarch64`、`mips`、`mips64`、`ppc64`、`ppc64le`、`s390`、`s390x`、`i386`、`i686`、`x86_64`のようなマシンタイプを文字列として返します。

POSIXシステムでは、マシンタイプは[`uname(3)`](https://linux.die.net/man/3/uname)を呼び出すことによって決定されます。 Windowsでは、`RtlGetVersion()`が使用され、利用できない場合は`GetVersionExW()`が使用されます。 詳細については、[https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples)を参照してください。

## `os.networkInterfaces()` {#osnetworkinterfaces}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.4.0 | `family`プロパティが数値の代わりに文字列を返すようになりました。 |
| v18.0.0 | `family`プロパティが文字列の代わりに数値を返すようになりました。 |
| v0.6.0 | Added in: v0.6.0 |
:::

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

ネットワークアドレスが割り当てられているネットワークインターフェースを含むオブジェクトを返します。

返されたオブジェクトの各キーは、ネットワークインターフェースを識別します。 関連付けられた値は、割り当てられたネットワークアドレスをそれぞれ記述するオブジェクトの配列です。

割り当てられたネットワークアドレスオブジェクトで使用可能なプロパティは次のとおりです。

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 割り当てられた IPv4 または IPv6 アドレス
- `netmask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPv4 または IPv6 ネットワークマスク
- `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `IPv4` または `IPv6`
- `mac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ネットワークインターフェースの MAC アドレス
- `internal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ネットワークインターフェースがループバックであるか、リモートからアクセスできない同様のインターフェースである場合は `true`。それ以外の場合は `false`
- `scopeid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 数値 IPv6 スコープ ID (`family` が `IPv6` の場合にのみ指定)
- `cidr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) CIDR表記でのルーティングプレフィックスを持つ割り当てられた IPv4 または IPv6 アドレス。 `netmask` が無効な場合、このプロパティは `null` に設定されます。

```js [ESM]
{
  lo: [
    {
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true,
      cidr: '127.0.0.1/8'
    },
    {
      address: '::1',
      netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
      family: 'IPv6',
      mac: '00:00:00:00:00:00',
      scopeid: 0,
      internal: true,
      cidr: '::1/128'
    }
  ],
  eth0: [
    {
      address: '192.168.1.108',
      netmask: '255.255.255.0',
      family: 'IPv4',
      mac: '01:02:03:0a:0b:0c',
      internal: false,
      cidr: '192.168.1.108/24'
    },
    {
      address: 'fe80::a00:27ff:fe4e:66a1',
      netmask: 'ffff:ffff:ffff:ffff::',
      family: 'IPv6',
      mac: '01:02:03:0a:0b:0c',
      scopeid: 1,
      internal: false,
      cidr: 'fe80::a00:27ff:fe4e:66a1/64'
    }
  ]
}
```

## `os.platform()` {#osplatform}

**Added in: v0.5.0**

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.jsバイナリがコンパイルされたオペレーティングシステムのプラットフォームを識別する文字列を返します。 この値はコンパイル時に設定されます。 使用可能な値は、`'aix'`, `'darwin'`, `'freebsd'`, `'linux'`, `'openbsd'`, `'sunos'`, および `'win32'` です。

戻り値は、[`process.platform`](/ja/nodejs/api/process#processplatform) と同じです。

Node.jsがAndroidオペレーティングシステム上に構築されている場合、値 `'android'` も返されることがあります。 [Androidのサポートは実験段階です](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android)。

## `os.release()` {#osrelease}

**Added in: v0.3.3**

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

オペレーティングシステムを文字列として返します。

POSIXシステムでは、オペレーティングシステムのリリースは[`uname(3)`](https://linux.die.net/man/3/uname)を呼び出すことによって決定されます。 Windowsでは、`GetVersionExW()` が使用されます。 詳細については、[https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) を参照してください。

## `os.setPriority([pid, ]priority)` {#ossetprioritypid-priority}

**Added in: v10.10.0**

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) スケジューリング優先度を設定するプロセスID。 **Default:** `0`.
- `priority` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) プロセスに割り当てるスケジューリング優先度。

`pid`で指定されたプロセスのスケジューリング優先度を設定しようとします。 `pid` が指定されていないか、`0` の場合、現在のプロセスのプロセスIDが使用されます。

`priority` 入力は、`-20` (高優先度) から `19` (低優先度) までの整数である必要があります。 Unixの優先度レベルとWindowsの優先度クラスの違いにより、`priority`は`os.constants.priority`の6つの優先度定数のいずれかにマップされます。 プロセスの優先度レベルを取得する場合、この範囲マッピングにより、Windowsでの戻り値がわずかに異なる場合があります。 混乱を避けるために、`priority`を優先度定数のいずれかに設定してください。

Windowsでは、優先度を `PRIORITY_HIGHEST` に設定するには、昇格されたユーザー権限が必要です。 そうでない場合、設定された優先度は暗黙的に `PRIORITY_HIGH` に引き下げられます。


## `os.tmpdir()` {#ostmpdir}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v2.0.0 | この関数はクロスプラットフォームで一貫性を持つようになり、どのプラットフォームでも末尾にスラッシュが付いたパスを返さなくなりました。 |
| v0.9.9 | 追加: v0.9.9 |
:::

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

オペレーティングシステムのテンポラリファイル用デフォルトディレクトリを文字列として返します。

Windows では、`TEMP` および `TMP` 環境変数で結果を上書きでき、`TEMP` が `TMP` より優先されます。どちらも設定されていない場合、デフォルトは `%SystemRoot%\temp` または `%windir%\temp` になります。

Windows 以外のプラットフォームでは、このメソッドの結果を上書きするために、`TMPDIR`、`TMP`、および `TEMP` 環境変数が記述された順にチェックされます。いずれも設定されていない場合、デフォルトは `/tmp` になります。

一部のオペレーティングシステムのディストリビューションでは、システム管理者による追加設定なしに、デフォルトで `TMPDIR` (Windows 以外) または `TEMP` および `TMP` (Windows) を構成します。`os.tmpdir()` の結果は、ユーザーによって明示的に上書きされない限り、通常はシステムの優先設定を反映します。

## `os.totalmem()` {#ostotalmem}

**追加: v0.3.3**

- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

システムの総メモリ量をバイト単位の整数として返します。

## `os.type()` {#ostype}

**追加: v0.3.3**

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

[`uname(3)`](https://linux.die.net/man/3/uname) によって返されるオペレーティングシステム名を返します。たとえば、Linux では `'Linux'`、macOS では `'Darwin'`、Windows では `'Windows_NT'` を返します。

さまざまなオペレーティングシステムで [`uname(3)`](https://linux.die.net/man/3/uname) を実行した出力の詳細については、[https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) を参照してください。

## `os.uptime()` {#osuptime}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | この関数の結果に、Windows では小数部分が含まれなくなりました。 |
| v0.3.3 | 追加: v0.3.3 |
:::

- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

システムの稼働時間を秒単位の数値で返します。


## `os.userInfo([options])` {#osuserinfooptions}

**追加: v6.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 結果の文字列を解釈するために使用される文字エンコーディング。`encoding` が `'buffer'` に設定されている場合、`username`、`shell`、および `homedir` の値は `Buffer` インスタンスになります。**デフォルト:** `'utf8'`。


- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

現在有効なユーザーに関する情報を返します。POSIX プラットフォームでは、これは通常、パスワードファイルのサブセットです。返されるオブジェクトには、`username`、`uid`、`gid`、`shell`、および `homedir` が含まれます。Windows では、`uid` および `gid` フィールドは `-1` であり、`shell` は `null` です。

`os.userInfo()` によって返される `homedir` の値は、オペレーティングシステムによって提供されます。これは、オペレーティングシステムの応答にフォールバックする前に、ホームディレクトリの環境変数をクエリする `os.homedir()` の結果とは異なります。

ユーザーに `username` または `homedir` がない場合、[`SystemError`](/ja/nodejs/api/errors#class-systemerror) をスローします。

## `os.version()` {#osversion}

**追加: v13.11.0, v12.17.0**

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

カーネルのバージョンを識別する文字列を返します。

POSIX システムでは、オペレーティングシステムのリリースは [`uname(3)`](https://linux.die.net/man/3/uname) を呼び出すことによって決定されます。Windows では、`RtlGetVersion()` が使用され、利用できない場合は `GetVersionExW()` が使用されます。詳細については、[https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) を参照してください。

## OS 定数 {#os-constants}

次の定数は `os.constants` によってエクスポートされます。

すべての定数がすべてのオペレーティングシステムで利用できるわけではありません。

### シグナル定数 {#signal-constants}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v5.11.0 | `SIGINFO` のサポートが追加されました。 |
:::

次のシグナル定数は `os.constants.signals` によってエクスポートされます。

| 定数 | 説明 |
| --- | --- |
| `SIGHUP` | 制御端末が閉じられたとき、または親プロセスが終了したときに送信されます。 |
| `SIGINT` | ユーザーがプロセスを中断したい場合（+）に送信されます。 |
| `SIGQUIT` | ユーザーがプロセスを終了し、コアダンプを実行したい場合に送信されます。 |
| `SIGILL` | プロセスに、不正な、不正な形式の、不明な、または特権的な命令を実行しようとしたことを通知するために送信されます。 |
| `SIGTRAP` | 例外が発生したときにプロセスに送信されます。 |
| `SIGABRT` | プロセスに中止を要求するために送信されます。 |
| `SIGIOT` | `SIGABRT` の同義語 |
| `SIGBUS` | プロセスにバスエラーが発生したことを通知するために送信されます。 |
| `SIGFPE` | プロセスに不正な算術演算を実行したことを通知するために送信されます。 |
| `SIGKILL` | プロセスをすぐに終了するために送信されます。 |
| `SIGUSR1`     `SIGUSR2` | ユーザー定義の条件を識別するためにプロセスに送信されます。 |
| `SIGSEGV` | プロセスにセグメンテーション違反を通知するために送信されます。 |
| `SIGPIPE` | プロセスが切断されたパイプに書き込もうとしたときに送信されます。 |
| `SIGALRM` | システムタイマーが経過したときにプロセスに送信されます。 |
| `SIGTERM` | 終了を要求するためにプロセスに送信されます。 |
| `SIGCHLD` | 子プロセスが終了したときにプロセスに送信されます。 |
| `SIGSTKFLT` | コプロセッサのスタックフォルトを示すためにプロセスに送信されます。 |
| `SIGCONT` | 一時停止されたプロセスを続行するようにオペレーティングシステムに指示するために送信されます。 |
| `SIGSTOP` | プロセスを停止するようにオペレーティングシステムに指示するために送信されます。 |
| `SIGTSTP` | プロセスに停止を要求するために送信されます。 |
| `SIGBREAK` | ユーザーがプロセスを中断したい場合に送信されます。 |
| `SIGTTIN` | プロセスがバックグラウンドで TTY から読み取るときに送信されます。 |
| `SIGTTOU` | プロセスがバックグラウンドで TTY に書き込むときに送信されます。 |
| `SIGURG` | ソケットに読み取る緊急データがある場合にプロセスに送信されます。 |
| `SIGXCPU` | プロセスが CPU 使用量の制限を超えた場合に送信されます。 |
| `SIGXFSZ` | プロセスが許可されている最大値よりも大きなファイルを拡張した場合に送信されます。 |
| `SIGVTALRM` | 仮想タイマーが経過したときにプロセスに送信されます。 |
| `SIGPROF` | システムタイマーが経過したときにプロセスに送信されます。 |
| `SIGWINCH` | 制御端末がサイズを変更した場合にプロセスに送信されます。 |
| `SIGIO` | I/O が利用可能なときにプロセスに送信されます。 |
| `SIGPOLL` | `SIGIO` の同義語 |
| `SIGLOST` | ファイルロックが失われたときにプロセスに送信されます。 |
| `SIGPWR` | 電源障害を通知するためにプロセスに送信されます。 |
| `SIGINFO` | `SIGPWR` の同義語 |
| `SIGSYS` | 不正な引数を通知するためにプロセスに送信されます。 |
| `SIGUNUSED` | `SIGSYS` の同義語 |

### エラー定数 {#error-constants}

以下のエラー定数は、`os.constants.errno`によってエクスポートされます。

#### POSIXエラー定数 {#posix-error-constants}

| 定数 | 説明 |
| --- | --- |
| `E2BIG` | 引数のリストが予期されるよりも長いことを示します。 |
| `EACCES` | 操作に十分な権限がないことを示します。 |
| `EADDRINUSE` | ネットワークアドレスが既に使用中であることを示します。 |
| `EADDRNOTAVAIL` | ネットワークアドレスが現在使用できないことを示します。 |
| `EAFNOSUPPORT` | ネットワークアドレスファミリがサポートされていないことを示します。 |
| `EAGAIN` | 利用可能なデータがないため、後で操作を再試行することを示します。 |
| `EALREADY` | ソケットに保留中の接続が既に進行中であることを示します。 |
| `EBADF` | ファイル記述子が有効でないことを示します。 |
| `EBADMSG` | 無効なデータメッセージを示します。 |
| `EBUSY` | デバイスまたはリソースがビジー状態であることを示します。 |
| `ECANCELED` | 操作がキャンセルされたことを示します。 |
| `ECHILD` | 子プロセスがないことを示します。 |
| `ECONNABORTED` | ネットワーク接続が中断されたことを示します。 |
| `ECONNREFUSED` | ネットワーク接続が拒否されたことを示します。 |
| `ECONNRESET` | ネットワーク接続がリセットされたことを示します。 |
| `EDEADLK` | リソースデッドロックが回避されたことを示します。 |
| `EDESTADDRREQ` | 宛先アドレスが必要であることを示します。 |
| `EDOM` | 引数が関数のドメイン外にあることを示します。 |
| `EDQUOT` | ディスククォータを超えたことを示します。 |
| `EEXIST` | ファイルが既に存在することを示します。 |
| `EFAULT` | 無効なポインタアドレスを示します。 |
| `EFBIG` | ファイルが大きすぎることを示します。 |
| `EHOSTUNREACH` | ホストに到達できないことを示します。 |
| `EIDRM` | 識別子が削除されたことを示します。 |
| `EILSEQ` | 無効なバイトシーケンスを示します。 |
| `EINPROGRESS` | 操作が既に進行中であることを示します。 |
| `EINTR` | 関数呼び出しが中断されたことを示します。 |
| `EINVAL` | 無効な引数が提供されたことを示します。 |
| `EIO` | それ以外の場合は特定されないI/Oエラーを示します。 |
| `EISCONN` | ソケットが接続されていることを示します。 |
| `EISDIR` | パスがディレクトリであることを示します。 |
| `ELOOP` | パス内のシンボリックリンクのレベルが多すぎることを示します。 |
| `EMFILE` | 開いているファイルが多すぎることを示します。 |
| `EMLINK` | ファイルへのハードリンクが多すぎることを示します。 |
| `EMSGSIZE` | 提供されたメッセージが長すぎることを示します。 |
| `EMULTIHOP` | マルチホップが試行されたことを示します。 |
| `ENAMETOOLONG` | ファイル名が長すぎることを示します。 |
| `ENETDOWN` | ネットワークがダウンしていることを示します。 |
| `ENETRESET` | ネットワークによって接続が中断されたことを示します。 |
| `ENETUNREACH` | ネットワークに到達できないことを示します。 |
| `ENFILE` | システムで開いているファイルが多すぎることを示します。 |
| `ENOBUFS` | バッファスペースがないことを示します。 |
| `ENODATA` | ストリームヘッド読み取りキューで利用可能なメッセージがないことを示します。 |
| `ENODEV` | そのようなデバイスがないことを示します。 |
| `ENOENT` | そのようなファイルまたはディレクトリがないことを示します。 |
| `ENOEXEC` | exec形式のエラーを示します。 |
| `ENOLCK` | 利用可能なロックがないことを示します。 |
| `ENOLINK` | リンクが切断されたことを示します。 |
| `ENOMEM` | 十分なスペースがないことを示します。 |
| `ENOMSG` | 目的のタイプのメッセージがないことを示します。 |
| `ENOPROTOOPT` | 指定されたプロトコルが利用できないことを示します。 |
| `ENOSPC` | デバイスに使用可能なスペースがないことを示します。 |
| `ENOSR` | 利用可能なストリームリソースがないことを示します。 |
| `ENOSTR` | 指定されたリソースがストリームではないことを示します。 |
| `ENOSYS` | 関数が実装されていないことを示します。 |
| `ENOTCONN` | ソケットが接続されていないことを示します。 |
| `ENOTDIR` | パスがディレクトリではないことを示します。 |
| `ENOTEMPTY` | ディレクトリが空でないことを示します。 |
| `ENOTSOCK` | 指定されたアイテムがソケットではないことを示します。 |
| `ENOTSUP` | 指定された操作がサポートされていないことを示します。 |
| `ENOTTY` | 不適切なI/O制御操作を示します。 |
| `ENXIO` | そのようなデバイスまたはアドレスがないことを示します。 |
| `EOPNOTSUPP` | 操作がソケットでサポートされていないことを示します。（Linuxでは`ENOTSUP`と`EOPNOTSUPP`は同じ値ですが、POSIX.1によると、これらのエラー値は異なる必要があります。） |
| `EOVERFLOW` | 値が大きすぎて、指定されたデータ型に格納できないことを示します。 |
| `EPERM` | 操作が許可されていないことを示します。 |
| `EPIPE` | 壊れたパイプを示します。 |
| `EPROTO` | プロトコルエラーを示します。 |
| `EPROTONOSUPPORT` | プロトコルがサポートされていないことを示します。 |
| `EPROTOTYPE` | ソケットのプロトコルのタイプが間違っていることを示します。 |
| `ERANGE` | 結果が大きすぎることを示します。 |
| `EROFS` | ファイルシステムが読み取り専用であることを示します。 |
| `ESPIPE` | 無効なシーク操作を示します。 |
| `ESRCH` | そのようなプロセスがないことを示します。 |
| `ESTALE` | ファイルハンドルが古いことを示します。 |
| `ETIME` | タイマーが期限切れになったことを示します。 |
| `ETIMEDOUT` | 接続がタイムアウトしたことを示します。 |
| `ETXTBSY` | テキストファイルがビジー状態であることを示します。 |
| `EWOULDBLOCK` | 操作がブロックされることを示します。 |
| `EXDEV` | 不適切なリンクを示します。 |

#### Windows固有のエラー定数 {#windows-specific-error-constants}

以下のエラーコードは、Windowsオペレーティングシステムに固有のものです。

| 定数 | 説明 |
| --- | --- |
| `WSAEINTR` | 関数呼び出しが中断されたことを示します。 |
| `WSAEBADF` | 無効なファイルハンドルを示します。 |
| `WSAEACCES` | 操作を完了するための十分なアクセス許可がないことを示します。 |
| `WSAEFAULT` | 無効なポインタアドレスを示します。 |
| `WSAEINVAL` | 無効な引数が渡されたことを示します。 |
| `WSAEMFILE` | 開いているファイルが多すぎることを示します。 |
| `WSAEWOULDBLOCK` | リソースが一時的に利用できないことを示します。 |
| `WSAEINPROGRESS` | 操作が現在進行中であることを示します。 |
| `WSAEALREADY` | 操作が既に進行中であることを示します。 |
| `WSAENOTSOCK` | リソースがソケットではないことを示します。 |
| `WSAEDESTADDRREQ` | 宛先アドレスが必要であることを示します。 |
| `WSAEMSGSIZE` | メッセージサイズが長すぎることを示します。 |
| `WSAEPROTOTYPE` | ソケットのプロトコルタイプが間違っていることを示します。 |
| `WSAENOPROTOOPT` | 無効なプロトコルオプションを示します。 |
| `WSAEPROTONOSUPPORT` | プロトコルがサポートされていないことを示します。 |
| `WSAESOCKTNOSUPPORT` | ソケットタイプがサポートされていないことを示します。 |
| `WSAEOPNOTSUPP` | 操作がサポートされていないことを示します。 |
| `WSAEPFNOSUPPORT` | プロトコルファミリがサポートされていないことを示します。 |
| `WSAEAFNOSUPPORT` | アドレスファミリがサポートされていないことを示します。 |
| `WSAEADDRINUSE` | ネットワークアドレスが既に使用中であることを示します。 |
| `WSAEADDRNOTAVAIL` | ネットワークアドレスが利用できないことを示します。 |
| `WSAENETDOWN` | ネットワークがダウンしていることを示します。 |
| `WSAENETUNREACH` | ネットワークに到達できないことを示します。 |
| `WSAENETRESET` | ネットワーク接続がリセットされたことを示します。 |
| `WSAECONNABORTED` | 接続が中止されたことを示します。 |
| `WSAECONNRESET` | ピアによって接続がリセットされたことを示します。 |
| `WSAENOBUFS` | 利用可能なバッファスペースがないことを示します。 |
| `WSAEISCONN` | ソケットが既に接続されていることを示します。 |
| `WSAENOTCONN` | ソケットが接続されていないことを示します。 |
| `WSAESHUTDOWN` | ソケットがシャットダウンされた後、データを送信できないことを示します。 |
| `WSAETOOMANYREFS` | 参照が多すぎることを示します。 |
| `WSAETIMEDOUT` | 接続がタイムアウトしたことを示します。 |
| `WSAECONNREFUSED` | 接続が拒否されたことを示します。 |
| `WSAELOOP` | 名前を変換できないことを示します。 |
| `WSAENAMETOOLONG` | 名前が長すぎることを示します。 |
| `WSAEHOSTDOWN` | ネットワークホストがダウンしていることを示します。 |
| `WSAEHOSTUNREACH` | ネットワークホストへのルートがないことを示します。 |
| `WSAENOTEMPTY` | ディレクトリが空ではないことを示します。 |
| `WSAEPROCLIM` | プロセスが多すぎることを示します。 |
| `WSAEUSERS` | ユーザーのクォータを超過したことを示します。 |
| `WSAEDQUOT` | ディスククォータを超過したことを示します。 |
| `WSAESTALE` | 古いファイルハンドル参照を示します。 |
| `WSAEREMOTE` | 項目がリモートであることを示します。 |
| `WSASYSNOTREADY` | ネットワークサブシステムが準備できていないことを示します。 |
| `WSAVERNOTSUPPORTED` | `winsock.dll` のバージョンが範囲外であることを示します。 |
| `WSANOTINITIALISED` | WSAStartup がまだ正常に実行されていないことを示します。 |
| `WSAEDISCON` | グレースフルシャットダウンが進行中であることを示します。 |
| `WSAENOMORE` | 結果がもうないことを示します。 |
| `WSAECANCELLED` | 操作がキャンセルされたことを示します。 |
| `WSAEINVALIDPROCTABLE` | プロシージャコールテーブルが無効であることを示します。 |
| `WSAEINVALIDPROVIDER` | 無効なサービスプロバイダを示します。 |
| `WSAEPROVIDERFAILEDINIT` | サービスプロバイダの初期化に失敗したことを示します。 |
| `WSASYSCALLFAILURE` | システムコールが失敗したことを示します。 |
| `WSASERVICE_NOT_FOUND` | サービスが見つからなかったことを示します。 |
| `WSATYPE_NOT_FOUND` | クラスタイプが見つからなかったことを示します。 |
| `WSA_E_NO_MORE` | 結果がもうないことを示します。 |
| `WSA_E_CANCELLED` | 呼び出しがキャンセルされたことを示します。 |
| `WSAEREFUSED` | データベースクエリが拒否されたことを示します。 |


### dlopen 定数 {#dlopen-constants}

オペレーティングシステムで利用可能な場合、次の定数は `os.constants.dlopen` でエクスポートされます。 詳細については、[`dlopen(3)`](http://man7.org/linux/man-pages/man3/dlopen.3) を参照してください。

| 定数 | 説明 |
| --- | --- |
| `RTLD_LAZY` | 遅延バインディングを実行します。 Node.js はデフォルトでこのフラグを設定します。 |
| `RTLD_NOW` | dlopen(3) が返る前に、ライブラリ内のすべての未定義のシンボルを解決します。 |
| `RTLD_GLOBAL` | ライブラリによって定義されたシンボルは、後でロードされるライブラリのシンボル解決に利用可能になります。 |
| `RTLD_LOCAL` | `RTLD_GLOBAL` の逆。 いずれのフラグも指定されていない場合、これがデフォルトの動作です。 |
| `RTLD_DEEPBIND` | 自己完結型のライブラリに、以前にロードされたライブラリからのシンボルよりも優先して、自身のシンボルを使用させます。 |
### 優先度定数 {#priority-constants}

**追加: v10.10.0**

次のプロセススケジューリング定数は、`os.constants.priority` によってエクスポートされます。

| 定数 | 説明 |
| --- | --- |
| `PRIORITY_LOW` | 最も低いプロセススケジューリングの優先度。 これは、Windows では `IDLE_PRIORITY_CLASS` に、他のすべてのプラットフォームではナイス値 `19` に対応します。 |
| `PRIORITY_BELOW_NORMAL` | `PRIORITY_LOW` より上で `PRIORITY_NORMAL` より下のプロセススケジューリングの優先度。 これは、Windows では `BELOW_NORMAL_PRIORITY_CLASS` に、他のすべてのプラットフォームではナイス値 `10` に対応します。 |
| `PRIORITY_NORMAL` | デフォルトのプロセススケジューリングの優先度。 これは、Windows では `NORMAL_PRIORITY_CLASS` に、他のすべてのプラットフォームではナイス値 `0` に対応します。 |
| `PRIORITY_ABOVE_NORMAL` | `PRIORITY_NORMAL` より上で `PRIORITY_HIGH` より下のプロセススケジューリングの優先度。 これは、Windows では `ABOVE_NORMAL_PRIORITY_CLASS` に、他のすべてのプラットフォームではナイス値 `-7` に対応します。 |
| `PRIORITY_HIGH` | `PRIORITY_ABOVE_NORMAL` より上で `PRIORITY_HIGHEST` より下のプロセススケジューリングの優先度。 これは、Windows では `HIGH_PRIORITY_CLASS` に、他のすべてのプラットフォームではナイス値 `-14` に対応します。 |
| `PRIORITY_HIGHEST` | 最も高いプロセススケジューリングの優先度。 これは、Windows では `REALTIME_PRIORITY_CLASS` に、他のすべてのプラットフォームではナイス値 `-20` に対応します。 |

### libuv 定数 {#libuv-constants}

| 定数 | 説明 |
| --- | --- |
| `UV_UDP_REUSEADDR` ||

