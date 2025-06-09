---
title: Node.js 보고서 문서
description: Node.js 보고서 문서는 Node.js 애플리케이션의 진단 보고서를 생성, 설정, 분석하는 방법에 대해 자세히 설명합니다. 'report' 모듈의 사용 방법, 보고서를 트리거하는 방법, 보고서 내용을 커스터마이징하는 방법, 생성된 데이터를 디버깅 및 성능 분석을 위해 해석하는 방법을 다룹니다.
head:
  - - meta
    - name: og:title
      content: Node.js 보고서 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 보고서 문서는 Node.js 애플리케이션의 진단 보고서를 생성, 설정, 분석하는 방법에 대해 자세히 설명합니다. 'report' 모듈의 사용 방법, 보고서를 트리거하는 방법, 보고서 내용을 커스터마이징하는 방법, 생성된 데이터를 디버깅 및 성능 분석을 위해 해석하는 방법을 다룹니다.
  - - meta
    - name: twitter:title
      content: Node.js 보고서 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 보고서 문서는 Node.js 애플리케이션의 진단 보고서를 생성, 설정, 분석하는 방법에 대해 자세히 설명합니다. 'report' 모듈의 사용 방법, 보고서를 트리거하는 방법, 보고서 내용을 커스터마이징하는 방법, 생성된 데이터를 디버깅 및 성능 분석을 위해 해석하는 방법을 다룹니다.
---


# 진단 보고서 {#diagnostic-report}

::: tip [Stable: 2 - 안정됨]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.3.0 | 보고서 생성에서 환경 변수를 제외하기 위한 `--report-exclude-env` 옵션이 추가되었습니다. |
| v22.0.0, v20.13.0 | 일부 경우 보고서 생성 속도를 늦출 수 있는 네트워킹 작업을 제외하기 위한 `--report-exclude-network` 옵션이 추가되었습니다. |
:::

JSON 형식의 진단 요약을 파일에 제공합니다.

이 보고서는 문제 해결을 위해 정보를 캡처하고 보존하기 위해 개발, 테스트 및 프로덕션 용도로 사용됩니다. JavaScript 및 네이티브 스택 추적, 힙 통계, 플랫폼 정보, 리소스 사용량 등이 포함됩니다. 보고서 옵션을 활성화하면 API 호출을 통해 프로그래밍 방식으로 트리거하는 것 외에도 처리되지 않은 예외, 치명적인 오류 및 사용자 신호에 따라 진단 보고서를 트리거할 수 있습니다.

참고로 처리되지 않은 예외에서 생성된 전체 예제 보고서가 아래에 제공됩니다.

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
    "REMOTEHOST": "제거됨",
    "MANPATH": "/opt/rh/devtoolset-3/root/usr/share/man:",
    "XDG_SESSION_ID": "66126",
    "HOSTNAME": "test_machine",
    "HOST": "test_machine",
    "TERM": "xterm-256color",
    "SHELL": "/bin/csh",
    "SSH_CLIENT": "제거됨",
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
-  `--report-uncaught-exception` 처리되지 않은 예외가 발생했을 때 보고서를 생성하도록 설정합니다. 네이티브 스택 및 기타 런타임 환경 데이터와 함께 JavaScript 스택을 검사할 때 유용합니다.
-  `--report-on-signal` 실행 중인 Node.js 프로세스에 지정된 (또는 미리 정의된) 신호를 수신할 때 보고서를 생성하도록 설정합니다. (보고서를 트리거하는 신호를 수정하는 방법은 아래 참조). 기본 신호는 `SIGUSR2`입니다. 다른 프로그램에서 보고서를 트리거해야 할 때 유용합니다. 애플리케이션 모니터는 이 기능을 활용하여 정기적으로 보고서를 수집하고 풍부한 내부 런타임 데이터 세트를 뷰에 플롯할 수 있습니다.

신호 기반 보고서 생성은 Windows에서 지원되지 않습니다.

일반적인 상황에서는 보고서 트리거 신호를 수정할 필요가 없습니다. 그러나 `SIGUSR2`가 이미 다른 용도로 사용되고 있는 경우 이 플래그는 보고서 생성에 대한 신호를 변경하고 해당 목적을 위해 `SIGUSR2`의 원래 의미를 보존하는 데 도움이 됩니다.

-  `--report-on-fatalerror` 애플리케이션 종료로 이어지는 심각한 오류 (메모리 부족과 같은 Node.js 런타임 내의 내부 오류)가 발생했을 때 보고서를 트리거하도록 설정합니다. 힙, 스택, 이벤트 루프 상태, 리소스 소비 등과 같은 다양한 진단 데이터 요소를 검사하여 심각한 오류에 대해 추론하는 데 유용합니다.
-  `--report-compact` 보고서를 간결한 형식인 단일 줄 JSON으로 작성합니다. 사람이 소비하도록 설계된 기본 다중 줄 형식보다 로그 처리 시스템에서 더 쉽게 사용할 수 있습니다.
-  `--report-directory` 보고서가 생성될 위치입니다.
-  `--report-filename` 보고서가 작성될 파일 이름입니다.
-  `--report-signal` 보고서 생성을 위한 신호를 설정하거나 재설정합니다 (Windows에서는 지원되지 않음). 기본 신호는 `SIGUSR2`입니다.
-  `--report-exclude-network` 진단 보고서에서 `header.networkInterfaces`를 제외하고 `libuv.*.(remote|local)Endpoint.host`에서 역방향 DNS 쿼리를 비활성화합니다. 기본적으로 설정되어 있지 않으며 네트워크 인터페이스가 포함됩니다.
-  `--report-exclude-env` 진단 보고서에서 `environmentVariables`를 제외합니다. 기본적으로 설정되어 있지 않으며 환경 변수가 포함됩니다.

JavaScript 애플리케이션에서 API 호출을 통해 보고서를 트리거할 수도 있습니다.

```js [ESM]
process.report.writeReport();
```
이 함수는 보고서가 작성될 파일 이름인 선택적 추가 인수 `filename`을 사용합니다.

```js [ESM]
process.report.writeReport('./foo.json');
```
이 함수는 보고서에 인쇄된 JavaScript 스택의 컨텍스트로 사용될 `Error` 객체인 선택적 추가 인수 `err`을 사용합니다. 보고서를 사용하여 콜백 또는 예외 처리기에서 오류를 처리할 때 보고서에 원래 오류 위치와 처리된 위치를 포함할 수 있습니다.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(err);
}
// Any other code
```
파일 이름과 오류 객체가 모두 `writeReport()`에 전달되면 오류 객체가 두 번째 매개변수여야 합니다.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(filename, err);
}
// Any other code
```
진단 보고서의 내용은 JavaScript 애플리케이션에서 API 호출을 통해 JavaScript 객체로 반환할 수 있습니다.

```js [ESM]
const report = process.report.getReport();
console.log(typeof report === 'object'); // true

// Similar to process.report.writeReport() output
console.log(JSON.stringify(report, null, 2));
```
이 함수는 보고서에 인쇄된 JavaScript 스택의 컨텍스트로 사용될 `Error` 객체인 선택적 추가 인수 `err`을 사용합니다.

```js [ESM]
const report = process.report.getReport(new Error('custom error'));
console.log(typeof report === 'object'); // true
```
API 버전은 리소스 소비, 로드 밸런싱, 모니터링 등을 자체 조정하기 위해 애플리케이션 내에서 런타임 상태를 검사할 때 유용합니다.

보고서의 내용은 이벤트 유형, 날짜, 시간, PID 및 Node.js 버전이 포함된 헤더 섹션, JavaScript 및 네이티브 스택 추적을 포함하는 섹션, V8 힙 정보를 포함하는 섹션, `libuv` 핸들 정보를 포함하는 섹션, CPU 및 메모리 사용량과 시스템 제한을 보여주는 OS 플랫폼 정보 섹션으로 구성됩니다. Node.js REPL을 사용하여 예제 보고서를 트리거할 수 있습니다.

```bash [BASH]
$ node
> process.report.writeReport();
Writing Node.js report to file: report.20181126.091102.8480.0.001.json
Node.js report completed
>
```
보고서가 작성되면 시작 및 종료 메시지가 stderr로 발행되고 보고서의 파일 이름이 호출자에게 반환됩니다. 기본 파일 이름에는 날짜, 시간, PID 및 시퀀스 번호가 포함됩니다. 시퀀스 번호는 동일한 Node.js 프로세스에 대해 여러 번 생성된 경우 보고서 덤프를 런타임 상태와 연결하는 데 도움이 됩니다.


## 보고서 버전 {#report-version}

진단 보고서에는 보고서 형식을 고유하게 나타내는 한 자리 버전 번호(`report.header.reportVersion`)가 연결되어 있습니다. 새 키가 추가되거나 제거되거나 값의 데이터 유형이 변경되면 버전 번호가 올라갑니다. 보고서 버전 정의는 LTS 릴리스 전반에 걸쳐 일관성이 있습니다.

### 버전 기록 {#version-history}

#### 버전 5 {#version-5}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.5.0 | 메모리 제한 단위의 오타를 수정했습니다. |
:::

`userLimits` 섹션에서 `data_seg_size_kbytes`, `max_memory_size_kbytes` 및 `virtual_memory_kbytes` 키를 각각 `data_seg_size_bytes`, `max_memory_size_bytes` 및 `virtual_memory_bytes`로 바꿉니다. 이러한 값은 바이트 단위로 제공되기 때문입니다.

```json [JSON]
{
  "userLimits": {
    // 일부 키 생략 ...
    "data_seg_size_bytes": { // data_seg_size_kbytes 대체
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "max_memory_size_bytes": { // max_memory_size_kbytes 대체
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "virtual_memory_bytes": { // virtual_memory_kbytes 대체
      "soft": "unlimited",
      "hard": "unlimited"
    }
  }
}
```
#### 버전 4 {#version-4}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.3.0 | 보고서 생성에서 환경 변수를 제외하기 위한 `--report-exclude-env` 옵션이 추가되었습니다. |
:::

새 필드 `ipv4` 및 `ipv6`이 `tcp` 및 `udp` libuv 핸들 엔드포인트에 추가되었습니다. 예시:

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
        "ip4": "127.0.0.1", // 새 키
        "port": 48986
      },
      "remoteEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1", // 새 키
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
        "ip6": "::1", // 새 키
        "port": 52266
      },
      "remoteEndpoint": {
        "host": "ip6-localhost",
        "ip6": "::1", // 새 키
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

#### 버전 3 {#version-3}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.1.0, v18.13.0 | 메모리 정보를 더 추가합니다. |
:::

다음 메모리 사용량 키가 `resourceUsage` 섹션에 추가됩니다.

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
#### 버전 2 {#version-2}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.9.0, v12.16.2 | 이제 보고서에 워커가 포함됩니다. |
:::

[`Worker`](/ko/nodejs/api/worker_threads) 지원이 추가되었습니다. 자세한 내용은 [워커와의 상호 작용](/ko/nodejs/api/report#interaction-with-workers) 섹션을 참조하십시오.

#### 버전 1 {#version-1}

진단 보고서의 첫 번째 버전입니다.

## 구성 {#configuration}

보고서 생성의 추가 런타임 구성은 `process.report`의 다음 속성을 통해 사용할 수 있습니다.

`reportOnFatalError`는 `true`이면 치명적인 오류가 발생할 때 진단 보고를 트리거합니다. 기본값은 `false`입니다.

`reportOnSignal`은 `true`이면 신호에 대한 진단 보고를 트리거합니다. 이는 Windows에서는 지원되지 않습니다. 기본값은 `false`입니다.

`reportOnUncaughtException`은 `true`이면 잡히지 않은 예외에 대한 진단 보고를 트리거합니다. 기본값은 `false`입니다.

`signal`은 보고서 생성을 위한 외부 트리거를 가로채는 데 사용될 POSIX 신호 식별자를 지정합니다. 기본값은 `'SIGUSR2'`입니다.

`filename`은 파일 시스템에서 출력 파일의 이름을 지정합니다. `stdout` 및 `stderr`에는 특별한 의미가 부여됩니다. 이를 사용하면 보고서가 관련 표준 스트림에 기록됩니다. 표준 스트림이 사용되는 경우 `directory`의 값은 무시됩니다. URL은 지원되지 않습니다. 기본값은 타임스탬프, PID 및 시퀀스 번호가 포함된 복합 파일 이름입니다.

`directory`는 보고서가 기록될 파일 시스템 디렉터리를 지정합니다. URL은 지원되지 않습니다. 기본값은 Node.js 프로세스의 현재 작업 디렉터리입니다.

`excludeNetwork`는 진단 보고서에서 `header.networkInterfaces`를 제외합니다.

```js [ESM]
// 잡히지 않은 예외에서만 보고서를 트리거합니다.
process.report.reportOnFatalError = false;
process.report.reportOnSignal = false;
process.report.reportOnUncaughtException = true;

// 내부 오류와 외부 신호 모두에 대해 보고서를 트리거합니다.
process.report.reportOnFatalError = true;
process.report.reportOnSignal = true;
process.report.reportOnUncaughtException = false;

// 기본 신호를 'SIGQUIT'로 변경하고 활성화합니다.
process.report.reportOnFatalError = false;
process.report.reportOnUncaughtException = false;
process.report.reportOnSignal = true;
process.report.signal = 'SIGQUIT';

// 네트워크 인터페이스 보고 비활성화
process.report.excludeNetwork = true;
```
모듈 초기화 시의 구성은 환경 변수를 통해 사용할 수도 있습니다.

```bash [BASH]
NODE_OPTIONS="--report-uncaught-exception \
  --report-on-fatalerror --report-on-signal \
  --report-signal=SIGUSR2  --report-filename=./report.json \
  --report-directory=/home/nodeuser"
```
특정 API 문서는 [`process API 문서`](/ko/nodejs/api/process) 섹션에서 확인할 수 있습니다.


## 작업자 상호 작용 {#interaction-with-workers}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.9.0, v12.16.2 | 작업자가 이제 보고서에 포함됩니다. |
:::

[`Worker`](/ko/nodejs/api/worker_threads) 스레드는 메인 스레드와 같은 방식으로 보고서를 생성할 수 있습니다.

보고서에는 현재 스레드의 자식인 모든 작업자에 대한 정보가 `workers` 섹션의 일부로 포함되며, 각 작업자는 표준 보고서 형식으로 보고서를 생성합니다.

보고서를 생성하는 스레드는 작업자 스레드의 보고서가 완료될 때까지 기다립니다. 그러나 JavaScript 실행 및 이벤트 루프가 모두 중단되어 보고서를 생성하므로 대기 시간은 일반적으로 짧습니다.

