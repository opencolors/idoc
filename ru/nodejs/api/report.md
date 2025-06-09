---
title: Документация по отчетам Node.js
description: Документация по отчетам Node.js предоставляет подробную информацию о том, как генерировать, настраивать и анализировать диагностические отчеты для приложений Node.js. Она охватывает использование модуля 'report', включая как инициировать отчеты, настраивать содержание отчетов и интерпретировать сгенерированные данные для отладки и анализа производительности.
head:
  - - meta
    - name: og:title
      content: Документация по отчетам Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Документация по отчетам Node.js предоставляет подробную информацию о том, как генерировать, настраивать и анализировать диагностические отчеты для приложений Node.js. Она охватывает использование модуля 'report', включая как инициировать отчеты, настраивать содержание отчетов и интерпретировать сгенерированные данные для отладки и анализа производительности.
  - - meta
    - name: twitter:title
      content: Документация по отчетам Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Документация по отчетам Node.js предоставляет подробную информацию о том, как генерировать, настраивать и анализировать диагностические отчеты для приложений Node.js. Она охватывает использование модуля 'report', включая как инициировать отчеты, настраивать содержание отчетов и интерпретировать сгенерированные данные для отладки и анализа производительности.
---


# Диагностический отчет {#diagnostic-report}

::: tip [Stable: 2 - Стабильный]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильный
:::


::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.3.0 | Добавлена опция `--report-exclude-env` для исключения переменных окружения из генерации отчета. |
| v22.0.0, v20.13.0 | Добавлена опция `--report-exclude-network` для исключения сетевых операций, которые могут замедлить генерацию отчета в некоторых случаях. |
:::

Предоставляет диагностическую сводку в формате JSON, записанную в файл.

Отчет предназначен для использования при разработке, тестировании и эксплуатации для сбора и сохранения информации для определения проблем. Он включает трассировки стека JavaScript и native, статистику кучи, информацию о платформе, использование ресурсов и т.д. Если опция отчета включена, диагностические отчеты могут быть запущены при необработанных исключениях, фатальных ошибках и пользовательских сигналах, в дополнение к запуску программно через вызовы API.

Полный пример отчета, сгенерированного при необработанном исключении, приведен ниже для справки.

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

## Использование {#usage}

```bash [BASH]
node --report-uncaught-exception --report-on-signal \
--report-on-fatalerror app.js
```
-  `--report-uncaught-exception` Включает генерацию отчета о необработанных исключениях. Полезно при изучении стека JavaScript в сочетании с машинным стеком и другими данными среды выполнения.
-  `--report-on-signal` Включает генерацию отчета при получении указанного (или предопределенного) сигнала запущенным процессом Node.js. (См. ниже, как изменить сигнал, запускающий отчет.) Сигнал по умолчанию - `SIGUSR2`. Полезно, когда отчет необходимо запустить из другой программы. Мониторы приложений могут использовать эту функцию для сбора отчетов через регулярные промежутки времени и отображать богатый набор внутренних данных среды выполнения в своих представлениях.

Генерация отчетов на основе сигналов не поддерживается в Windows.

В нормальных условиях нет необходимости изменять сигнал, запускающий отчет. Однако, если `SIGUSR2` уже используется для других целей, этот флаг помогает изменить сигнал для генерации отчета и сохранить исходное значение `SIGUSR2` для указанных целей.

-  `--report-on-fatalerror` Включает запуск отчета о фатальных ошибках (внутренних ошибках в среде выполнения Node.js, таких как нехватка памяти), которые приводят к завершению работы приложения. Полезно для изучения различных диагностических элементов данных, таких как куча, стек, состояние цикла событий, потребление ресурсов и т. д., чтобы рассуждать о фатальной ошибке.
-  `--report-compact` Записывает отчеты в компактном формате, в виде однострочного JSON, который легче обрабатывается системами обработки журналов, чем многострочный формат по умолчанию, предназначенный для потребления человеком.
-  `--report-directory` Место, где будет создан отчет.
-  `--report-filename` Имя файла, в который будет записан отчет.
-  `--report-signal` Устанавливает или сбрасывает сигнал для генерации отчетов (не поддерживается в Windows). Сигнал по умолчанию - `SIGUSR2`.
-  `--report-exclude-network` Исключает `header.networkInterfaces` и отключает обратные DNS-запросы в `libuv.*.(remote|local)Endpoint.host` из диагностического отчета. По умолчанию это не установлено, и сетевые интерфейсы включены.
-  `--report-exclude-env` Исключает `environmentVariables` из диагностического отчета. По умолчанию это не установлено, и переменные среды включены.

Отчет также можно запустить с помощью вызова API из приложения JavaScript:

```js [ESM]
process.report.writeReport();
```
Эта функция принимает необязательный дополнительный аргумент `filename`, который является именем файла, в который записывается отчет.

```js [ESM]
process.report.writeReport('./foo.json');
```
Эта функция принимает необязательный дополнительный аргумент `err`, который является объектом `Error`, который будет использоваться в качестве контекста для стека JavaScript, напечатанного в отчете. При использовании отчета для обработки ошибок в обратном вызове или обработчике исключений это позволяет отчету включать местоположение исходной ошибки, а также место, где она была обработана.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(err);
}
// Любой другой код
```
Если и имя файла, и объект ошибки передаются в `writeReport()`, объект ошибки должен быть вторым параметром.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(filename, err);
}
// Любой другой код
```
Содержимое диагностического отчета можно вернуть в виде объекта JavaScript с помощью вызова API из приложения JavaScript:

```js [ESM]
const report = process.report.getReport();
console.log(typeof report === 'object'); // true

// Аналогично выводу process.report.writeReport()
console.log(JSON.stringify(report, null, 2));
```
Эта функция принимает необязательный дополнительный аргумент `err`, который является объектом `Error`, который будет использоваться в качестве контекста для стека JavaScript, напечатанного в отчете.

```js [ESM]
const report = process.report.getReport(new Error('custom error'));
console.log(typeof report === 'object'); // true
```
Версии API полезны при проверке состояния среды выполнения из приложения с ожиданием самостоятельной корректировки потребления ресурсов, балансировки нагрузки, мониторинга и т. д.

Содержимое отчета состоит из раздела заголовка, содержащего тип события, дату, время, PID и версию Node.js, разделов, содержащих трассировки стека JavaScript и native, раздела, содержащего информацию о куче V8, раздела, содержащего информацию об обработчиках `libuv`, и раздела информации о платформе ОС, показывающего использование ЦП и памяти, а также системные ограничения. Пример отчета можно запустить с помощью Node.js REPL:

```bash [BASH]
$ node
> process.report.writeReport();
Writing Node.js report to file: report.20181126.091102.8480.0.001.json
Node.js report completed
>
```
Когда отчет записывается, сообщения о начале и завершении выводятся в stderr, а имя файла отчета возвращается вызывающей стороне. Имя файла по умолчанию включает дату, время, PID и порядковый номер. Порядковый номер помогает связать дамп отчета с состоянием среды выполнения, если он создается несколько раз для одного и того же процесса Node.js.


## Версия отчета {#report-version}

Диагностический отчет имеет связанный с ним однозначный номер версии (`report.header.reportVersion`), однозначно представляющий формат отчета. Номер версии увеличивается при добавлении или удалении нового ключа или изменении типа данных значения. Определения версий отчетов согласованы во всех LTS-релизах.

### История версий {#version-history}

#### Версия 5 {#version-5}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.5.0 | Исправление опечаток в единицах измерения лимита памяти. |
:::

Ключи `data_seg_size_kbytes`, `max_memory_size_kbytes` и `virtual_memory_kbytes` заменены на `data_seg_size_bytes`, `max_memory_size_bytes` и `virtual_memory_bytes` соответственно в разделе `userLimits`, поскольку эти значения указаны в байтах.

```json [JSON]
{
  "userLimits": {
    // Пропустить некоторые ключи ...
    "data_seg_size_bytes": { // замена data_seg_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "max_memory_size_bytes": { // замена max_memory_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "virtual_memory_bytes": { // замена virtual_memory_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    }
  }
}
```
#### Версия 4 {#version-4}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.3.0 | Добавлена опция `--report-exclude-env` для исключения переменных окружения из генерации отчета. |
:::

Новые поля `ipv4` и `ipv6` добавлены в конечные точки дескрипторов libuv `tcp` и `udp`. Примеры:

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
        "ip4": "127.0.0.1", // новый ключ
        "port": 48986
      },
      "remoteEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1", // новый ключ
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
        "ip6": "::1", // новый ключ
        "port": 52266
      },
      "remoteEndpoint": {
        "host": "ip6-localhost",
        "ip6": "::1", // новый ключ
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

#### Версия 3 {#version-3}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.1.0, v18.13.0 | Добавлена дополнительная информация о памяти. |
:::

Следующие ключи использования памяти добавлены в раздел `resourceUsage`.

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
#### Версия 2 {#version-2}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.9.0, v12.16.2 | Worker теперь включены в отчет. |
:::

Добавлена поддержка [`Worker`](/ru/nodejs/api/worker_threads). Подробнее см. в разделе [Взаимодействие с worker](/ru/nodejs/api/report#interaction-with-workers).

#### Версия 1 {#version-1}

Это первая версия диагностического отчета.

## Конфигурация {#configuration}

Дополнительная конфигурация времени выполнения генерации отчетов доступна через следующие свойства `process.report`:

`reportOnFatalError` запускает диагностическую отчетность о фатальных ошибках, когда `true`. По умолчанию `false`.

`reportOnSignal` запускает диагностическую отчетность о сигнале, когда `true`. Не поддерживается в Windows. По умолчанию `false`.

`reportOnUncaughtException` запускает диагностическую отчетность о неперехваченных исключениях, когда `true`. По умолчанию `false`.

`signal` указывает идентификатор сигнала POSIX, который будет использоваться для перехвата внешних триггеров для генерации отчета. По умолчанию `'SIGUSR2'`.

`filename` указывает имя выходного файла в файловой системе. Особое значение придается `stdout` и `stderr`. Использование этих значений приведет к тому, что отчет будет записан в соответствующие стандартные потоки. В случаях, когда используются стандартные потоки, значение в `directory` игнорируется. URL не поддерживаются. По умолчанию используется составное имя файла, содержащее временную метку, PID и порядковый номер.

`directory` указывает каталог файловой системы, куда будет записан отчет. URL не поддерживаются. По умолчанию используется текущий рабочий каталог процесса Node.js.

`excludeNetwork` исключает `header.networkInterfaces` из диагностического отчета.

```js [ESM]
// Запускать отчет только при неперехваченных исключениях.
process.report.reportOnFatalError = false;
process.report.reportOnSignal = false;
process.report.reportOnUncaughtException = true;

// Запускать отчет как для внутренних ошибок, так и для внешнего сигнала.
process.report.reportOnFatalError = true;
process.report.reportOnSignal = true;
process.report.reportOnUncaughtException = false;

// Изменить сигнал по умолчанию на 'SIGQUIT' и включить его.
process.report.reportOnFatalError = false;
process.report.reportOnUncaughtException = false;
process.report.reportOnSignal = true;
process.report.signal = 'SIGQUIT';

// Отключить отчетность по сетевым интерфейсам
process.report.excludeNetwork = true;
```
Конфигурация при инициализации модуля также доступна через переменные среды:

```bash [BASH]
NODE_OPTIONS="--report-uncaught-exception \
  --report-on-fatalerror --report-on-signal \
  --report-signal=SIGUSR2  --report-filename=./report.json \
  --report-directory=/home/nodeuser"
```
Конкретную документацию по API можно найти в разделе [`process API documentation`](/ru/nodejs/api/process).


## Взаимодействие с рабочими потоками {#interaction-with-workers}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.9.0, v12.16.2 | Рабочие потоки теперь включены в отчет. |
:::

[`Worker`](/ru/nodejs/api/worker_threads) потоки могут создавать отчеты так же, как и основной поток.

Отчеты будут содержать информацию о любых Worker потоках, являющихся дочерними для текущего потока, как часть секции `workers`, при этом каждый Worker будет генерировать отчет в стандартном формате отчета.

Поток, который генерирует отчет, будет ждать завершения отчетов от Worker потоков. Однако задержка для этого обычно будет небольшой, поскольку как выполняющийся JavaScript, так и цикл событий прерываются для создания отчета.

