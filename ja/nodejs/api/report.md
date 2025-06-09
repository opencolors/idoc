---
title: Node.js レポートドキュメント
description: Node.js レポートドキュメントは、Node.js アプリケーションの診断レポートを生成、設定、分析する方法について詳細に説明しています。'report'モジュールの使用方法、レポートのトリガー方法、レポート内容のカスタマイズ、生成されたデータの解釈方法について、デバッグやパフォーマンス分析のための情報を提供します。
head:
  - - meta
    - name: og:title
      content: Node.js レポートドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js レポートドキュメントは、Node.js アプリケーションの診断レポートを生成、設定、分析する方法について詳細に説明しています。'report'モジュールの使用方法、レポートのトリガー方法、レポート内容のカスタマイズ、生成されたデータの解釈方法について、デバッグやパフォーマンス分析のための情報を提供します。
  - - meta
    - name: twitter:title
      content: Node.js レポートドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js レポートドキュメントは、Node.js アプリケーションの診断レポートを生成、設定、分析する方法について詳細に説明しています。'report'モジュールの使用方法、レポートのトリガー方法、レポート内容のカスタマイズ、生成されたデータの解釈方法について、デバッグやパフォーマンス分析のための情報を提供します。
---


# 診断レポート {#diagnostic-report}

::: tip [Stable: 2 - 安定版]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定版
:::

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.3.0 | レポート生成から環境変数を排除するための`--report-exclude-env`オプションを追加しました。 |
| v22.0.0, v20.13.0 | 場合によってはレポート生成を遅くする可能性のあるネットワーク操作を排除するための`--report-exclude-network`オプションを追加しました。 |
:::

JSON形式の診断概要をファイルに出力します。

このレポートは、問題判別のために情報をキャプチャして保持することを目的として、開発、テスト、および本番環境で使用することを想定しています。JavaScriptおよびネイティブスタックトレース、ヒープ統計、プラットフォーム情報、リソース使用状況などが含まれます。レポートオプションを有効にすると、API呼び出しを介してプログラムでトリガーすることに加えて、未処理の例外、致命的なエラー、およびユーザシグナルで診断レポートをトリガーできます。

未処理の例外で生成された完全なレポートの例を以下に示します。

```json [JSON]
{
  "header": {
    "reportVersion": 5,
    "event": "exception",
    "trigger": "Exception",
    "filename": "report.20181221.005011.8974.0.001.json",
    "dumpEventTime": "2018-12-21T00:50:11Z",
    "dumpEventTimeStamp": "1545371411331",
    "processId": 8974,
    "cwd": "/home/nodeuser/project/node",
    "commandLine": [
      "/home/nodeuser/project/node/out/Release/node",
      "--report-uncaught-exception",
      "/home/nodeuser/project/node/test/report/test-exception.js",
      "child"
    ],
    "nodejsVersion": "v12.0.0-pre",
    "glibcVersionRuntime": "2.17",
    "glibcVersionCompiler": "2.17",
    "wordSize": "64 bit",
    "arch": "x64",
    "platform": "linux",
    "componentVersions": {
      "node": "12.0.0-pre",
      "v8": "7.1.302.28-node.5",
      "uv": "1.24.1",
      "zlib": "1.2.11",
      "ares": "1.15.0",
      "modules": "68",
      "nghttp2": "1.34.0",
      "napi": "3",
      "llhttp": "1.0.1",
      "openssl": "1.1.0j"
    },
    "release": {
      "name": "node"
    },
    "osName": "Linux",
    "osRelease": "3.10.0-862.el7.x86_64",
    "osVersion": "#1 SMP Wed Mar 21 18:14:51 EDT 2018",
    "osMachine": "x86_64",
    "cpus": [
      {
        "model": "Intel(R) Core(TM) i7-6820HQ CPU @ 2.70GHz",
        "speed": 2700,
        "user": 88902660,
        "nice": 0,
        "sys": 50902570,
        "idle": 241732220,
        "irq": 0
      },
      {
        "model": "Intel(R) Core(TM) i7-6820HQ CPU @ 2.70GHz",
        "speed": 2700,
        "user": 88902660,
        "nice": 0,
        "sys": 50902570,
        "idle": 241732220,
        "irq": 0
      }
    ],
    "networkInterfaces": [
      {
        "name": "en0",
        "internal": false,
        "mac": "13:10:de:ad:be:ef",
        "address": "10.0.0.37",
        "netmask": "255.255.255.0",
        "family": "IPv4"
      }
    ],
    "host": "test_machine"
  },
  "javascriptStack": {
    "message": "Error: *** test-exception.js: throwing uncaught Error",
    "stack": [
      "at myException (/home/nodeuser/project/node/test/report/test-exception.js:9:11)",
      "at Object.<anonymous> (/home/nodeuser/project/node/test/report/test-exception.js:12:3)",
      "at Module._compile (internal/modules/cjs/loader.js:718:30)",
      "at Object.Module._extensions..js (internal/modules/cjs/loader.js:729:10)",
      "at Module.load (internal/modules/cjs/loader.js:617:32)",
      "at tryModuleLoad (internal/modules/cjs/loader.js:560:12)",
      "at Function.Module._load (internal/modules/cjs/loader.js:552:3)",
      "at Function.Module.runMain (internal/modules/cjs/loader.js:771:12)",
      "at executeUserCode (internal/bootstrap/node.js:332:15)"
    ]
  },
  "nativeStack": [
    {
      "pc": "0x000055b57f07a9ef",
      "symbol": "report::GetNodeReport(v8::Isolate*, node::Environment*, char const*, char const*, v8::Local<v8::String>, std::ostream&) [./node]"
    },
    {
      "pc": "0x000055b57f07cf03",
      "symbol": "report::GetReport(v8::FunctionCallbackInfo<v8::Value> const&) [./node]"
    },
    {
      "pc": "0x000055b57f1bccfd",
      "symbol": " [./node]"
    },
    {
      "pc": "0x000055b57f1be048",
      "symbol": "v8::internal::Builtin_HandleApiCall(int, v8::internal::Object**, v8::internal::Isolate*) [./node]"
    },
    {
      "pc": "0x000055b57feeda0e",
      "symbol": " [./node]"
    }
  ],
  "javascriptHeap": {
    "totalMemory": 5660672,
    "executableMemory": 524288,
    "totalCommittedMemory": 5488640,
    "availableMemory": 4341379928,
    "totalGlobalHandlesMemory": 8192,
    "usedGlobalHandlesMemory": 3136,
    "usedMemory": 4816432,
    "memoryLimit": 4345298944,
    "mallocedMemory": 254128,
    "externalMemory": 315644,
    "peakMallocedMemory": 98752,
    "nativeContextCount": 1,
    "detachedContextCount": 0,
    "doesZapGarbage": 0,
    "heapSpaces": {
      "read_only_space": {
        "memorySize": 524288,
        "committedMemory": 39208,
        "capacity": 515584,
        "used": 30504,
        "available": 485080
      },
      "new_space": {
        "memorySize": 2097152,
        "committedMemory": 2019312,
        "capacity": 1031168,
        "used": 985496,
        "available": 45672
      },
      "old_space": {
        "memorySize": 2273280,
        "committedMemory": 1769008,
        "capacity": 1974640,
        "used": 1725488,
        "available": 249152
      },
      "code_space": {
        "memorySize": 696320,
        "committedMemory": 184896,
        "capacity": 152128,
        "used": 152128,
        "available": 0
      },
      "map_space": {
        "memorySize": 536576,
        "committedMemory": 344928,
        "capacity": 327520,
        "used": 327520,
        "available": 0
      },
      "large_object_space": {
        "memorySize": 0,
        "committedMemory": 0,
        "capacity": 1520590336,
        "used": 0,
        "available": 1520590336
      },
      "new_large_object_space": {
        "memorySize": 0,
        "committedMemory": 0,
        "capacity": 0,
        "used": 0,
        "available": 0
      }
    }
  },
  "resourceUsage": {
    "rss": "35766272",
    "free_memory": "1598337024",
    "total_memory": "17179869184",
    "available_memory": "1598337024",
    "maxRss": "36624662528",
    "constrained_memory": "36624662528",
    "userCpuSeconds": 0.040072,
    "kernelCpuSeconds": 0.016029,
    "cpuConsumptionPercent": 5.6101,
    "userCpuConsumptionPercent": 4.0072,
    "kernelCpuConsumptionPercent": 1.6029,
    "pageFaults": {
      "IORequired": 0,
      "IONotRequired": 4610
    },
    "fsActivity": {
      "reads": 0,
      "writes": 0
    }
  },
  "uvthreadResourceUsage": {
    "userCpuSeconds": 0.039843,
    "kernelCpuSeconds": 0.015937,
    "cpuConsumptionPercent": 5.578,
    "userCpuConsumptionPercent": 3.9843,
    "kernelCpuConsumptionPercent": 1.5937,
    "fsActivity": {
      "reads": 0,
      "writes": 0
    }
  },
  "libuv": [
    {
      "type": "async",
      "is_active": true,
      "is_referenced": false,
      "address": "0x0000000102910900",
      "details": ""
    },
    {
      "type": "timer",
      "is_active": false,
      "is_referenced": false,
      "address": "0x00007fff5fbfeab0",
      "repeat": 0,
      "firesInMsFromNow": 94403548320796,
      "expired": true
    },
    {
      "type": "check",
      "is_active": true,
      "is_referenced": false,
      "address": "0x00007fff5fbfeb48"
    },
    {
      "type": "idle",
      "is_active": false,
      "is_referenced": true,
      "address": "0x00007fff5fbfebc0"
    },
    {
      "type": "prepare",
      "is_active": false,
      "is_referenced": false,
      "address": "0x00007fff5fbfec38"
    },
    {
      "type": "check",
      "is_active": false,
      "is_referenced": false,
      "address": "0x00007fff5fbfecb0"
    },
    {
      "type": "async",
      "is_active": true,
      "is_referenced": false,
      "address": "0x000000010188f2e0"
    },
    {
      "type": "tty",
      "is_active": false,
      "is_referenced": true,
      "address": "0x000055b581db0e18",
      "width": 204,
      "height": 55,
      "fd": 17,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    },
    {
      "type": "signal",
      "is_active": true,
      "is_referenced": false,
      "address": "0x000055b581d80010",
      "signum": 28,
      "signal": "SIGWINCH"
    },
    {
      "type": "tty",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055b581df59f8",
      "width": 204,
      "height": 55,
      "fd": 19,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    },
    {
      "type": "loop",
      "is_active": true,
      "address": "0x000055fc7b2cb180",
      "loopIdleTimeSeconds": 22644.8
    },
    {
      "type": "tcp",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055e70fcb85d8",
      "localEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1",
        "port": 48986
      },
      "remoteEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1",
        "port": 38573
      },
      "sendBufferSize": 2626560,
      "recvBufferSize": 131072,
      "fd": 24,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    }
  ],
  "workers": [],
  "environmentVariables": {
    "REMOTEHOST": "REMOVED",
    "MANPATH": "/opt/rh/devtoolset-3/root/usr/share/man:",
    "XDG_SESSION_ID": "66126",
    "HOSTNAME": "test_machine",
    "HOST": "test_machine",
    "TERM": "xterm-256color",
    "SHELL": "/bin/csh",
    "SSH_CLIENT": "REMOVED",
    "PERL5LIB": "/opt/rh/devtoolset-3/root//usr/lib64/perl5/vendor_perl:/opt/rh/devtoolset-3/root/usr/lib/perl5:/opt/rh/devtoolset-3/root//usr/share/perl5/vendor_perl",
    "OLDPWD": "/home/nodeuser/project/node/src",
    "JAVACONFDIRS": "/opt/rh/devtoolset-3/root/etc/java:/etc/java",
    "SSH_TTY": "/dev/pts/0",
    "PCP_DIR": "/opt/rh/devtoolset-3/root",
    "GROUP": "normaluser",
    "USER": "nodeuser",
    "LD_LIBRARY_PATH": "/opt/rh/devtoolset-3/root/usr/lib64:/opt/rh/devtoolset-3/root/usr/lib",
    "HOSTTYPE": "x86_64-linux",
    "XDG_CONFIG_DIRS": "/opt/rh/devtoolset-3/root/etc/xdg:/etc/xdg",
    "MAIL": "/var/spool/mail/nodeuser",
    "PATH": "/home/nodeuser/project/node:/opt/rh/devtoolset-3/root/usr/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin",
    "PWD": "/home/nodeuser/project/node",
    "LANG": "en_US.UTF-8",
    "PS1": "\\u@\\h : \\[\\e[31m\\]\\w\\[\\e[m\\] >  ",
    "SHLVL": "2",
    "HOME": "/home/nodeuser",
    "OSTYPE": "linux",
    "VENDOR": "unknown",
    "PYTHONPATH": "/opt/rh/devtoolset-3/root/usr/lib64/python2.7/site-packages:/opt/rh/devtoolset-3/root/usr/lib/python2.7/site-packages",
    "MACHTYPE": "x86_64",
    "LOGNAME": "nodeuser",
    "XDG_DATA_DIRS": "/opt/rh/devtoolset-3/root/usr/share:/usr/local/share:/usr/share",
    "LESSOPEN": "||/usr/bin/lesspipe.sh %s",
    "INFOPATH": "/opt/rh/devtoolset-3/root/usr/share/info",
    "XDG_RUNTIME_DIR": "/run/user/50141",
    "_": "./node"
  },
  "userLimits": {
    "core_file_size_blocks": {
      "soft": "",
      "hard": "unlimited"
    },
    "data_seg_size_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "file_size_blocks": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "max_locked_memory_bytes": {
      "soft": "unlimited",
      "hard": 65536
    },
    "max_memory_size_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "open_files": {
      "soft": "unlimited",
      "hard": 4096
    },
    "stack_size_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "cpu_time_seconds": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "max_user_processes": {
      "soft": "unlimited",
      "hard": 4127290
    },
    "virtual_memory_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    }
  },
  "sharedObjects": [
    "/lib64/libdl.so.2",
    "/lib64/librt.so.1",
    "/lib64/libstdc++.so.6",
    "/lib64/libm.so.6",
    "/lib64/libgcc_s.so.1",
    "/lib64/libpthread.so.0",
    "/lib64/libc.so.6",
    "/lib64/ld-linux-x86-64.so.2"
  ]
}
```

## Usage {#usage}

```bash [BASH]
node --report-uncaught-exception --report-on-signal \
--report-on-fatalerror app.js
```
- `--report-uncaught-exception` 未捕捉の例外が発生した場合にレポートが生成されるようにします。ネイティブスタックやその他のランタイム環境データと組み合わせてJavaScriptスタックを検査する際に役立ちます。
- `--report-on-signal` 実行中のNode.jsプロセスに指定された（または事前定義された）シグナルを受信したときにレポートが生成されるようにします。（レポートをトリガーするシグナルを変更する方法については、下記を参照してください。）デフォルトのシグナルは`SIGUSR2`です。レポートを別のプログラムからトリガーする必要がある場合に役立ちます。アプリケーション監視は、この機能を活用して定期的にレポートを収集し、豊富な内部ランタイムデータをビューにプロットできます。

シグナルベースのレポート生成は、Windowsではサポートされていません。

通常の状態では、レポートをトリガーするシグナルを変更する必要はありません。ただし、`SIGUSR2`がすでに他の目的で使用されている場合は、このフラグを使用すると、レポート生成のシグナルを変更し、`SIGUSR2`の元の意味を前記の目的のために保持できます。

- `--report-on-fatalerror` アプリケーションの終了につながる致命的なエラー（メモリ不足など、Node.jsランタイム内の内部エラー）が発生した場合にレポートがトリガーされるようにします。ヒープ、スタック、イベントループの状態、リソース消費など、さまざまな診断データ要素を検査して、致命的なエラーについて推論するのに役立ちます。
- `--report-compact` レポートをコンパクトな形式、つまりシングルラインJSONで書き込みます。デフォルトの複数行形式は人間が消費するように設計されていますが、ログ処理システムにとってはより簡単に消費できます。
- `--report-directory` レポートが生成される場所。
- `--report-filename` レポートの書き込み先のファイルの名前。
- `--report-signal` レポート生成のシグナルを設定またはリセットします（Windowsではサポートされていません）。デフォルトのシグナルは`SIGUSR2`です。
- `--report-exclude-network` `header.networkInterfaces`を除外し、診断レポートの`libuv.*.(remote|local)Endpoint.host`のリバースDNSクエリを無効にします。デフォルトでは、これは設定されておらず、ネットワークインターフェースが含まれています。
- `--report-exclude-env` `environmentVariables`を診断レポートから除外します。デフォルトでは、これは設定されておらず、環境変数が含まれています。

レポートは、JavaScriptアプリケーションからのAPI呼び出しによってもトリガーできます。

```js [ESM]
process.report.writeReport();
```
この関数はオプションの追加引数`filename`を受け取ります。これは、レポートの書き込み先のファイルの名前です。

```js [ESM]
process.report.writeReport('./foo.json');
```
この関数はオプションの追加引数`err`を受け取ります。これは、レポートに出力されるJavaScriptスタックのコンテキストとして使用される`Error`オブジェクトです。レポートを使用してコールバックまたは例外ハンドラーのエラーを処理する場合、これにより、レポートに元のエラーの場所と処理された場所を含めることができます。

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(err);
}
// Any other code
```
ファイル名とエラーオブジェクトの両方が`writeReport()`に渡される場合、エラーオブジェクトは2番目のパラメーターである必要があります。

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(filename, err);
}
// Any other code
```
診断レポートの内容は、JavaScriptアプリケーションからのAPI呼び出しを介してJavaScriptオブジェクトとして返すことができます。

```js [ESM]
const report = process.report.getReport();
console.log(typeof report === 'object'); // true

// Similar to process.report.writeReport() output
console.log(JSON.stringify(report, null, 2));
```
この関数はオプションの追加引数`err`を受け取ります。これは、レポートに出力されるJavaScriptスタックのコンテキストとして使用される`Error`オブジェクトです。

```js [ESM]
const report = process.report.getReport(new Error('custom error'));
console.log(typeof report === 'object'); // true
```
APIバージョンは、リソース消費、ロードバランシング、監視などを自己調整することを期待して、アプリケーション内からランタイム状態を検査する場合に役立ちます。

レポートの内容は、イベントタイプ、日付、時刻、PID、およびNode.jsバージョンを含むヘッダーセクション、JavaScriptおよびネイティブスタックトレースを含むセクション、V8ヒープ情報を含むセクション、`libuv`ハンドル情報を含むセクション、およびCPUとメモリの使用量とシステム制限を示すOSプラットフォーム情報セクションで構成されます。Node.js REPLを使用して、レポートの例をトリガーできます。

```bash [BASH]
$ node
> process.report.writeReport();
Writing Node.js report to file: report.20181126.091102.8480.0.001.json
Node.js report completed
>
```
レポートが書き込まれると、開始メッセージと終了メッセージがstderrに出力され、レポートのファイル名が呼び出し元に返されます。デフォルトのファイル名には、日付、時刻、PID、およびシーケンス番号が含まれます。シーケンス番号は、同じNode.jsプロセスに対して複数回生成された場合に、レポートダンプをランタイム状態に関連付けるのに役立ちます。


## レポートのバージョン {#report-version}

診断レポートには、レポート形式を一意に表す一桁のバージョン番号 (`report.header.reportVersion`) が関連付けられています。新しいキーが追加または削除された場合、または値のデータ型が変更された場合に、バージョン番号が上がります。レポートのバージョン定義は、LTS リリース全体で一貫しています。

### バージョン履歴 {#version-history}

#### バージョン 5 {#version-5}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.5.0 | メモリ制限の単位の誤字を修正しました。 |
:::

`userLimits` セクションで、キー `data_seg_size_kbytes`、`max_memory_size_kbytes`、および `virtual_memory_kbytes` を、それぞれ `data_seg_size_bytes`、`max_memory_size_bytes`、および `virtual_memory_bytes` に置き換えます。これらの値はバイト単位で指定されるためです。

```json [JSON]
{
  "userLimits": {
    // 一部のキーを省略 ...
    "data_seg_size_bytes": { // data_seg_size_kbytes を置き換え
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "max_memory_size_bytes": { // max_memory_size_kbytes を置き換え
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "virtual_memory_bytes": { // virtual_memory_kbytes を置き換え
      "soft": "unlimited",
      "hard": "unlimited"
    }
  }
}
```
#### バージョン 4 {#version-4}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.3.0 | レポート生成から環境変数を除外するための `--report-exclude-env` オプションを追加しました。 |
:::

新しいフィールド `ipv4` および `ipv6` が、`tcp` および `udp` libuv ハンドルのエンドポイントに追加されました。 例：

```json [JSON]
{
  "libuv": [
    {
      "type": "tcp",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055e70fcb85d8",
      "localEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1", // 新しいキー
        "port": 48986
      },
      "remoteEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1", // 新しいキー
        "port": 38573
      },
      "sendBufferSize": 2626560,
      "recvBufferSize": 131072,
      "fd": 24,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    },
    {
      "type": "tcp",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055e70fcd68c8",
      "localEndpoint": {
        "host": "ip6-localhost",
        "ip6": "::1", // 新しいキー
        "port": 52266
      },
      "remoteEndpoint": {
        "host": "ip6-localhost",
        "ip6": "::1", // 新しいキー
        "port": 38573
      },
      "sendBufferSize": 2626560,
      "recvBufferSize": 131072,
      "fd": 25,
      "writeQueueSize": 0,
      "readable": false,
      "writable": false
    }
  ]
}
```

#### Version 3 {#version-3}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.1.0, v18.13.0 | メモリ情報を追加。 |
:::

以下のメモリ使用量のキーが `resourceUsage` セクションに追加されました。

```json [JSON]
{
  "resourceUsage": {
    "rss": "35766272",
    "free_memory": "1598337024",
    "total_memory": "17179869184",
    "available_memory": "1598337024",
    "constrained_memory": "36624662528"
  }
}
```
#### Version 2 {#version-2}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.9.0, v12.16.2 | ワーカーがレポートに含まれるようになりました。 |
:::

[`Worker`](/ja/nodejs/api/worker_threads) のサポートが追加されました。詳細については、[ワーカーとのインタラクション](/ja/nodejs/api/report#interaction-with-workers) セクションを参照してください。

#### Version 1 {#version-1}

これは診断レポートの最初のバージョンです。

## 設定 {#configuration}

レポート生成の追加のランタイム設定は、`process.report` の次のプロパティから利用できます。

`reportOnFatalError` は、`true` の場合に致命的なエラーに関する診断レポートをトリガーします。デフォルトは `false` です。

`reportOnSignal` は、`true` の場合にシグナルに関する診断レポートをトリガーします。これは Windows ではサポートされていません。デフォルトは `false` です。

`reportOnUncaughtException` は、`true` の場合にキャッチされない例外に関する診断レポートをトリガーします。デフォルトは `false` です。

`signal` は、レポート生成の外部トリガーをインターセプトするために使用される POSIX シグナル識別子を指定します。デフォルトは `'SIGUSR2'` です。

`filename` は、ファイルシステム内の出力ファイルの名前を指定します。`stdout` および `stderr` には特別な意味があります。これらを使用すると、レポートは関連する標準ストリームに書き込まれます。標準ストリームが使用される場合、`directory` の値は無視されます。URL はサポートされていません。デフォルトは、タイムスタンプ、PID、およびシーケンス番号を含む複合ファイル名です。

`directory` は、レポートが書き込まれるファイルシステムのディレクトリを指定します。URL はサポートされていません。デフォルトは、Node.js プロセスの現在の作業ディレクトリです。

`excludeNetwork` は、診断レポートから `header.networkInterfaces` を除外します。

```js [ESM]
// キャッチされない例外でのみレポートをトリガーします。
process.report.reportOnFatalError = false;
process.report.reportOnSignal = false;
process.report.reportOnUncaughtException = true;

// 内部エラーと外部シグナルの両方に対してレポートをトリガーします。
process.report.reportOnFatalError = true;
process.report.reportOnSignal = true;
process.report.reportOnUncaughtException = false;

// デフォルトのシグナルを 'SIGQUIT' に変更して有効にします。
process.report.reportOnFatalError = false;
process.report.reportOnUncaughtException = false;
process.report.reportOnSignal = true;
process.report.signal = 'SIGQUIT';

// ネットワークインターフェイスのレポートを無効にします
process.report.excludeNetwork = true;
```
モジュール初期化時の設定は、環境変数からも利用できます。

```bash [BASH]
NODE_OPTIONS="--report-uncaught-exception \
  --report-on-fatalerror --report-on-signal \
  --report-signal=SIGUSR2  --report-filename=./report.json \
  --report-directory=/home/nodeuser"
```
特定 API のドキュメントは、[`process API ドキュメント`](/ja/nodejs/api/process) セクションにあります。


## worker とのやり取り {#interaction-with-workers}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.9.0, v12.16.2 | worker がレポートに含まれるようになりました。 |
:::

[`Worker`](/ja/nodejs/api/worker_threads) スレッドは、メインスレッドと同様の方法でレポートを作成できます。

レポートには、現在のスレッドの子であるすべての Worker に関する情報が `workers` セクションの一部として含まれ、各 Worker は標準レポート形式でレポートを生成します。

レポートを生成するスレッドは、Worker スレッドからのレポートが完了するのを待ちます。ただし、JavaScript の実行とイベントループの両方が中断されてレポートが生成されるため、このレイテンシーは通常低くなります。

