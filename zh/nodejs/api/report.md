---
title: Node.js 报告文档
description: Node.js 报告文档详细介绍了如何为 Node.js 应用程序生成、配置和分析诊断报告。文档涵盖了'report'模块的使用，包括如何触发报告、自定义报告内容以及如何解释生成的数据以进行调试和性能分析。
head:
  - - meta
    - name: og:title
      content: Node.js 报告文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 报告文档详细介绍了如何为 Node.js 应用程序生成、配置和分析诊断报告。文档涵盖了'report'模块的使用，包括如何触发报告、自定义报告内容以及如何解释生成的数据以进行调试和性能分析。
  - - meta
    - name: twitter:title
      content: Node.js 报告文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 报告文档详细介绍了如何为 Node.js 应用程序生成、配置和分析诊断报告。文档涵盖了'report'模块的使用，包括如何触发报告、自定义报告内容以及如何解释生成的数据以进行调试和性能分析。
---


# 诊断报告 {#diagnostic-report}

::: tip [稳定版: 2 - 稳定]
[稳定版: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.3.0 | 添加了 `--report-exclude-env` 选项，用于从报告生成中排除环境变量。 |
| v22.0.0, v20.13.0 | 添加了 `--report-exclude-network` 选项，用于排除可能在某些情况下降低报告生成速度的网络操作。 |
:::

提供 JSON 格式的诊断摘要，写入文件。

该报告旨在用于开发、测试和生产，以捕获和保存信息以进行问题确定。 它包括 JavaScript 和原生堆栈跟踪、堆统计信息、平台信息、资源使用情况等。启用报告选项后，除了通过 API 调用以编程方式触发之外，还可以在未处理的异常、致命错误和用户信号上触发诊断报告。

下面提供了一个完整的示例报告，该报告是在未捕获的异常上生成的，供参考。

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

## 用法 {#usage}

```bash [BASH]
node --report-uncaught-exception --report-on-signal \
--report-on-fatalerror app.js
```
-  `--report-uncaught-exception` 启用在未捕获的异常上生成报告。 在结合本机堆栈和其他运行时环境数据检查 JavaScript 堆栈时非常有用。
-  `--report-on-signal` 启用在收到指定（或预定义）信号到正在运行的 Node.js 进程时生成报告。（请参阅下文，了解如何修改触发报告的信号。）默认信号为 `SIGUSR2`。 当需要从另一个程序触发报告时非常有用。 应用程序监视器可以利用此功能以有规律的间隔收集报告，并将丰富的内部运行时数据绘制到其视图中。

Windows 中不支持基于信号的报告生成。

在正常情况下，无需修改报告触发信号。 但是，如果 `SIGUSR2` 已用于其他目的，则此标志有助于更改报告生成的信号，并为所述目的保留 `SIGUSR2` 的原始含义。

-  `--report-on-fatalerror` 启用在导致应用程序终止的致命错误（Node.js 运行时中的内部错误，例如内存不足）时触发报告。 可用于检查各种诊断数据元素，例如堆、堆栈、事件循环状态、资源消耗等，以推断致命错误的原因。
-  `--report-compact` 以紧凑的格式（单行 JSON）写入报告，与为人工使用而设计的默认多行格式相比，日志处理系统更容易使用。
-  `--report-directory` 将生成报告的位置。
-  `--report-filename` 将报告写入到的文件的名称。
-  `--report-signal` 设置或重置用于生成报告的信号（Windows 上不支持）。 默认信号为 `SIGUSR2`。
-  `--report-exclude-network` 从诊断报告中排除 `header.networkInterfaces` 并禁用 `libuv.*.(remote|local)Endpoint.host` 中的反向 DNS 查询。 默认情况下，未设置此选项，并且包含网络接口。
-  `--report-exclude-env` 从诊断报告中排除 `environmentVariables`。 默认情况下，未设置此选项，并且包含环境变量。

也可以通过 JavaScript 应用程序的 API 调用来触发报告：

```js [ESM]
process.report.writeReport();
```
此函数采用一个可选的附加参数 `filename`，该参数是写入报告的文件的名称。

```js [ESM]
process.report.writeReport('./foo.json');
```
此函数采用一个可选的附加参数 `err`，它是一个 `Error` 对象，将用作报告中打印的 JavaScript 堆栈的上下文。 当使用报告来处理回调或异常处理程序中的错误时，这允许报告包括原始错误的位置以及处理错误的位置。

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(err);
}
// Any other code
```
如果同时将文件名和错误对象传递给 `writeReport()`，则错误对象必须是第二个参数。

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(filename, err);
}
// Any other code
```
诊断报告的内容可以通过来自 JavaScript 应用程序的 API 调用作为 JavaScript 对象返回：

```js [ESM]
const report = process.report.getReport();
console.log(typeof report === 'object'); // true

// Similar to process.report.writeReport() output
console.log(JSON.stringify(report, null, 2));
```
此函数采用一个可选的附加参数 `err`，它是一个 `Error` 对象，将用作报告中打印的 JavaScript 堆栈的上下文。

```js [ESM]
const report = process.report.getReport(new Error('custom error'));
console.log(typeof report === 'object'); // true
```
当从应用程序内部检查运行时状态时，API 版本很有用，期望自我调整资源消耗、负载平衡、监视等。

报告的内容由一个标头部分组成，该标头部分包含事件类型、日期、时间、PID 和 Node.js 版本，包含 JavaScript 和本机堆栈跟踪的部分，包含 V8 堆信息的部分，包含 `libuv` 句柄信息的部分，以及一个操作系统平台信息部分，其中显示了 CPU 和内存使用情况以及系统限制。 可以使用 Node.js REPL 触发示例报告：

```bash [BASH]
$ node
> process.report.writeReport();
Writing Node.js report to file: report.20181126.091102.8480.0.001.json
Node.js report completed
>
```
写入报告时，会将开始和结束消息发送到 stderr，并将报告的文件名返回给调用方。 默认文件名包括日期、时间、PID 和序列号。 如果为同一 Node.js 进程多次生成，则序列号有助于将报告转储与运行时状态相关联。


## 报告版本 {#report-version}

诊断报告具有一个与之关联的单位数版本号 (`report.header.reportVersion`)，它唯一地代表了报告格式。当添加或删除新的键，或者更改值的类型时，版本号会递增。报告版本定义在 LTS 版本之间保持一致。

### 版本历史 {#version-history}

#### 版本 5 {#version-5}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.5.0 | 修复了内存限制单位中的拼写错误。 |
:::

将 `userLimits` 部分中的键 `data_seg_size_kbytes`、`max_memory_size_kbytes` 和 `virtual_memory_kbytes` 分别替换为 `data_seg_size_bytes`、`max_memory_size_bytes` 和 `virtual_memory_bytes`，因为这些值以字节为单位给出。

```json [JSON]
{
  "userLimits": {
    // 跳过一些键 ...
    "data_seg_size_bytes": { // 替换 data_seg_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "max_memory_size_bytes": { // 替换 max_memory_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "virtual_memory_bytes": { // 替换 virtual_memory_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    }
  }
}
```
#### 版本 4 {#version-4}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.3.0 | 添加了 `--report-exclude-env` 选项，用于从报告生成中排除环境变量。 |
:::

新的字段 `ipv4` 和 `ipv6` 被添加到 `tcp` 和 `udp` libuv 句柄的端点。 例子：

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
        "ip4": "127.0.0.1", // 新键
        "port": 48986
      },
      "remoteEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1", // 新键
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
        "ip6": "::1", // 新键
        "port": 52266
      },
      "remoteEndpoint": {
        "host": "ip6-localhost",
        "ip6": "::1", // 新键
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

#### 版本 3 {#version-3}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.1.0, v18.13.0 | 添加更多内存信息。 |
:::

以下内存使用键已添加到 `resourceUsage` 部分。

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
#### 版本 2 {#version-2}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.9.0, v12.16.2 | 工作线程现在包含在报告中。 |
:::

添加了 [`Worker`](/zh/nodejs/api/worker_threads) 支持。 有关更多详细信息，请参阅 [与工作线程的交互](/zh/nodejs/api/report#interaction-with-workers) 部分。

#### 版本 1 {#version-1}

这是诊断报告的第一个版本。

## 配置 {#configuration}

报告生成的其他运行时配置可通过 `process.report` 的以下属性获得：

`reportOnFatalError` 如果为 `true`，则在发生致命错误时触发诊断报告。 默认为 `false`。

`reportOnSignal` 如果为 `true`，则在收到信号时触发诊断报告。 Windows 不支持此功能。 默认为 `false`。

`reportOnUncaughtException` 如果为 `true`，则在发生未捕获的异常时触发诊断报告。 默认为 `false`。

`signal` 指定将用于拦截报告生成外部触发器的 POSIX 信号标识符。 默认为 `'SIGUSR2'`。

`filename` 指定文件系统中输出文件的名称。 `stdout` 和 `stderr` 具有特殊的含义。 使用这些会导致报告被写入相关的标准流。 在使用标准流的情况下，`directory` 中的值将被忽略。 不支持 URL。 默认为包含时间戳、PID 和序列号的复合文件名。

`directory` 指定将在其中写入报告的文件系统目录。 不支持 URL。 默认为 Node.js 进程的当前工作目录。

`excludeNetwork` 从诊断报告中排除 `header.networkInterfaces`。

```js [ESM]
// 仅在未捕获的异常时触发报告。
process.report.reportOnFatalError = false;
process.report.reportOnSignal = false;
process.report.reportOnUncaughtException = true;

// 触发内部错误和外部信号的报告。
process.report.reportOnFatalError = true;
process.report.reportOnSignal = true;
process.report.reportOnUncaughtException = false;

// 将默认信号更改为 'SIGQUIT' 并启用它。
process.report.reportOnFatalError = false;
process.report.reportOnUncaughtException = false;
process.report.reportOnSignal = true;
process.report.signal = 'SIGQUIT';

// 禁用网络接口报告
process.report.excludeNetwork = true;
```
模块初始化时的配置也可以通过环境变量获得：

```bash [BASH]
NODE_OPTIONS="--report-uncaught-exception \
  --report-on-fatalerror --report-on-signal \
  --report-signal=SIGUSR2  --report-filename=./report.json \
  --report-directory=/home/nodeuser"
```
可以在 [`process API 文档`](/zh/nodejs/api/process) 部分下找到特定的 API 文档。


## 与工作线程交互 {#interaction-with-workers}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v13.9.0, v12.16.2 | 工作线程现在包含在报告中。 |
:::

[`Worker`](/zh/nodejs/api/worker_threads) 线程可以像主线程一样创建报告。

报告将在 `workers` 部分中包含当前线程的任何子工作线程的信息，每个工作线程都以标准报告格式生成报告。

生成报告的线程将等待工作线程的报告完成。但是，此延迟通常很低，因为正在运行的 JavaScript 和事件循环都会中断以生成报告。

