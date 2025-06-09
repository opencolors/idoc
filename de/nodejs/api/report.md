---
title: Node.js Berichtsdokumentation
description: Die Node.js Berichtsdokumentation bietet detaillierte Informationen darüber, wie man Diagnoseberichte für Node.js-Anwendungen generiert, konfiguriert und analysiert. Sie behandelt die Nutzung des 'report'-Moduls, einschließlich wie man Berichte auslöst, den Inhalt der Berichte anpasst und die generierten Daten für Debugging und Performance-Analyse interpretiert.
head:
  - - meta
    - name: og:title
      content: Node.js Berichtsdokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Die Node.js Berichtsdokumentation bietet detaillierte Informationen darüber, wie man Diagnoseberichte für Node.js-Anwendungen generiert, konfiguriert und analysiert. Sie behandelt die Nutzung des 'report'-Moduls, einschließlich wie man Berichte auslöst, den Inhalt der Berichte anpasst und die generierten Daten für Debugging und Performance-Analyse interpretiert.
  - - meta
    - name: twitter:title
      content: Node.js Berichtsdokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Die Node.js Berichtsdokumentation bietet detaillierte Informationen darüber, wie man Diagnoseberichte für Node.js-Anwendungen generiert, konfiguriert und analysiert. Sie behandelt die Nutzung des 'report'-Moduls, einschließlich wie man Berichte auslöst, den Inhalt der Berichte anpasst und die generierten Daten für Debugging und Performance-Analyse interpretiert.
---


# Diagnostikbericht {#diagnostic-report}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.3.0 | Option `--report-exclude-env` zum Ausschließen von Umgebungsvariablen aus der Berichtserstellung hinzugefügt. |
| v22.0.0, v20.13.0 | Option `--report-exclude-network` zum Ausschließen von Netzwerkoperationen hinzugefügt, die die Berichtserstellung in einigen Fällen verlangsamen können. |
:::

Liefert eine JSON-formatierte diagnostische Zusammenfassung, die in eine Datei geschrieben wird.

Der Bericht ist für die Entwicklung, das Testen und die Produktion bestimmt, um Informationen zur Problemdiagnose zu erfassen und aufzubewahren. Er enthält JavaScript- und native Stack-Traces, Heap-Statistiken, Plattforminformationen, Ressourcennutzung usw. Wenn die Berichtsoption aktiviert ist, können Diagnoseberichte bei unbehandelten Ausnahmen, schwerwiegenden Fehlern und Benutzersignalen ausgelöst werden, zusätzlich zur programmgesteuerten Auslösung über API-Aufrufe.

Ein vollständiger Beispielbericht, der bei einer nicht abgefangenen Ausnahme generiert wurde, wird unten als Referenz bereitgestellt.

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

## Verwendung {#usage}

```bash [BASH]
node --report-uncaught-exception --report-on-signal \
--report-on-fatalerror app.js
```
-  `--report-uncaught-exception` Aktiviert die Generierung eines Berichts bei unbehandelten Ausnahmen. Nützlich, um JavaScript-Stack in Verbindung mit nativem Stack und anderen Laufzeitumgebungsdaten zu untersuchen.
-  `--report-on-signal` Aktiviert die Generierung eines Berichts beim Empfang des angegebenen (oder vordefinierten) Signals an den laufenden Node.js-Prozess. (Siehe unten, wie das Signal geändert werden kann, das den Bericht auslöst.) Das Standardsignal ist `SIGUSR2`. Nützlich, wenn ein Bericht von einem anderen Programm ausgelöst werden muss. Anwendungsmonitore können diese Funktion nutzen, um in regelmäßigen Abständen Berichte zu sammeln und umfangreiche interne Laufzeitdaten in ihren Ansichten darzustellen.

Signalbasierte Berichtserstellung wird unter Windows nicht unterstützt.

Unter normalen Umständen ist es nicht erforderlich, das Signal zum Auslösen des Berichts zu ändern. Wenn `SIGUSR2` jedoch bereits für andere Zwecke verwendet wird, hilft dieses Flag, das Signal für die Berichtserstellung zu ändern und die ursprüngliche Bedeutung von `SIGUSR2` für die genannten Zwecke beizubehalten.

-  `--report-on-fatalerror` Aktiviert das Auslösen des Berichts bei schwerwiegenden Fehlern (interne Fehler innerhalb der Node.js-Laufzeitumgebung, z. B. unzureichender Speicher), die zur Beendigung der Anwendung führen. Nützlich, um verschiedene diagnostische Datenelemente wie Heap, Stack, Event-Loop-Status, Ressourcenverbrauch usw. zu untersuchen, um den schwerwiegenden Fehler zu verstehen.
-  `--report-compact` Schreibt Berichte in einem kompakten Format, einzeiliges JSON, das von Log-Verarbeitungssystemen leichter verarbeitet werden kann als das standardmäßige mehrzeilige Format, das für die menschliche Nutzung konzipiert ist.
-  `--report-directory` Speicherort, an dem der Bericht generiert wird.
-  `--report-filename` Name der Datei, in die der Bericht geschrieben wird.
-  `--report-signal` Setzt oder setzt das Signal für die Berichtserstellung zurück (wird unter Windows nicht unterstützt). Das Standardsignal ist `SIGUSR2`.
-  `--report-exclude-network` Schließt `header.networkInterfaces` aus und deaktiviert die Reverse-DNS-Abfragen in `libuv.*.(remote|local)Endpoint.host` aus dem Diagnosebericht. Standardmäßig ist dies nicht festgelegt und die Netzwerkschnittstellen sind enthalten.
-  `--report-exclude-env` Schließt `environmentVariables` aus dem Diagnosebericht aus. Standardmäßig ist dies nicht festgelegt und die Umgebungsvariablen sind enthalten.

Ein Bericht kann auch über einen API-Aufruf aus einer JavaScript-Anwendung ausgelöst werden:

```js [ESM]
process.report.writeReport();
```
Diese Funktion nimmt ein optionales zusätzliches Argument `filename` entgegen, das der Name einer Datei ist, in die der Bericht geschrieben wird.

```js [ESM]
process.report.writeReport('./foo.json');
```
Diese Funktion akzeptiert ein optionales zusätzliches Argument `err`, das ein `Error`-Objekt ist, das als Kontext für den im Bericht gedruckten JavaScript-Stack verwendet wird. Wenn der Bericht verwendet wird, um Fehler in einem Callback oder einem Ausnahmehandler zu behandeln, kann der Bericht mithilfe dessen den Ort des ursprünglichen Fehlers sowie den Ort, an dem er behandelt wurde, enthalten.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(err);
}
// Any other code
```
Wenn sowohl Dateiname als auch Fehlerobjekt an `writeReport()` übergeben werden, muss das Fehlerobjekt der zweite Parameter sein.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(filename, err);
}
// Any other code
```
Der Inhalt des Diagnoseberichts kann als JavaScript-Objekt über einen API-Aufruf aus einer JavaScript-Anwendung zurückgegeben werden:

```js [ESM]
const report = process.report.getReport();
console.log(typeof report === 'object'); // true

// Similar to process.report.writeReport() output
console.log(JSON.stringify(report, null, 2));
```
Diese Funktion nimmt ein optionales zusätzliches Argument `err` entgegen, das ein `Error`-Objekt ist, das als Kontext für den im Bericht gedruckten JavaScript-Stack verwendet wird.

```js [ESM]
const report = process.report.getReport(new Error('custom error'));
console.log(typeof report === 'object'); // true
```
Die API-Versionen sind nützlich, um den Laufzeitstatus innerhalb der Anwendung zu untersuchen, in Erwartung einer Selbstanpassung des Ressourcenverbrauchs, des Lastausgleichs, der Überwachung usw.

Der Inhalt des Berichts besteht aus einem Header-Abschnitt mit dem Ereignistyp, Datum, Uhrzeit, PID und der Node.js-Version, Abschnitten mit JavaScript- und nativen Stack-Traces, einem Abschnitt mit V8-Heap-Informationen, einem Abschnitt mit `libuv`-Handle-Informationen und einem OS-Plattforminformationsabschnitt, der die CPU- und Speicherauslastung sowie Systemlimits anzeigt. Ein Beispielbericht kann mit der Node.js-REPL ausgelöst werden:

```bash [BASH]
$ node
> process.report.writeReport();
Writing Node.js report to file: report.20181126.091102.8480.0.001.json
Node.js report completed
>
```
Wenn ein Bericht geschrieben wird, werden Start- und Endmeldungen an stderr ausgegeben und der Dateiname des Berichts wird an den Aufrufer zurückgegeben. Der Standarddateiname enthält Datum, Uhrzeit, PID und eine Sequenznummer. Die Sequenznummer hilft bei der Zuordnung des Report-Dumps zum Laufzeitstatus, wenn dieser mehrmals für denselben Node.js-Prozess generiert wurde.


## Berichtversion {#report-version}

Einem Diagnosebericht ist eine einstellige Versionsnummer (`report.header.reportVersion`) zugeordnet, die das Berichtsformat eindeutig repräsentiert. Die Versionsnummer wird erhöht, wenn ein neuer Schlüssel hinzugefügt oder entfernt wird oder sich der Datentyp eines Wertes ändert. Die Definitionen der Berichtsversion sind über LTS-Releases hinweg konsistent.

### Versionshistorie {#version-history}

#### Version 5 {#version-5}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.5.0 | Tippfehler in den Einheiten für das Speicherlimit behoben. |
:::

Ersetzen Sie die Schlüssel `data_seg_size_kbytes`, `max_memory_size_kbytes` und `virtual_memory_kbytes` im Abschnitt `userLimits` durch `data_seg_size_bytes`, `max_memory_size_bytes` bzw. `virtual_memory_bytes`, da diese Werte in Byte angegeben werden.

```json [JSON]
{
  "userLimits": {
    // Einige Schlüssel überspringen ...
    "data_seg_size_bytes": { // ersetzt data_seg_size_kbytes
      "soft": "unbegrenzt",
      "hard": "unbegrenzt"
    },
    // ...
    "max_memory_size_bytes": { // ersetzt max_memory_size_kbytes
      "soft": "unbegrenzt",
      "hard": "unbegrenzt"
    },
    // ...
    "virtual_memory_bytes": { // ersetzt virtual_memory_kbytes
      "soft": "unbegrenzt",
      "hard": "unbegrenzt"
    }
  }
}
```
#### Version 4 {#version-4}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.3.0 | Option `--report-exclude-env` zum Ausschließen von Umgebungsvariablen aus der Berichtserstellung hinzugefügt. |
:::

Neue Felder `ipv4` und `ipv6` wurden den Endpunkten der libuv-Handles `tcp` und `udp` hinzugefügt. Beispiele:

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
        "ip4": "127.0.0.1", // neuer Schlüssel
        "port": 48986
      },
      "remoteEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1", // neuer Schlüssel
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
        "ip6": "::1", // neuer Schlüssel
        "port": 52266
      },
      "remoteEndpoint": {
        "host": "ip6-localhost",
        "ip6": "::1", // neuer Schlüssel
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


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.1.0, v18.13.0 | Weitere Speicherinformationen hinzugefügt. |
:::

Die folgenden Schlüssel zur Speichernutzung wurden zum Abschnitt `resourceUsage` hinzugefügt.

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


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.9.0, v12.16.2 | Worker sind jetzt im Bericht enthalten. |
:::

[`Worker`](/de/nodejs/api/worker_threads)-Unterstützung hinzugefügt. Weitere Informationen finden Sie im Abschnitt [Interaktion mit Workern](/de/nodejs/api/report#interaction-with-workers).

#### Version 1 {#version-1}

Dies ist die erste Version des Diagnoseberichts.

## Konfiguration {#configuration}

Zusätzliche Laufzeitkonfiguration der Berichtserstellung ist über die folgenden Eigenschaften von `process.report` verfügbar:

`reportOnFatalError` löst die Diagnoseberichterstattung bei schwerwiegenden Fehlern aus, wenn `true`. Standardwert ist `false`.

`reportOnSignal` löst die Diagnoseberichterstattung bei einem Signal aus, wenn `true`. Dies wird unter Windows nicht unterstützt. Standardwert ist `false`.

`reportOnUncaughtException` löst die Diagnoseberichterstattung bei unbehandelten Ausnahmen aus, wenn `true`. Standardwert ist `false`.

`signal` gibt die POSIX-Signal-ID an, die zum Abfangen externer Auslöser für die Berichtserstellung verwendet wird. Standardwert ist `'SIGUSR2'`.

`filename` gibt den Namen der Ausgabedatei im Dateisystem an. `stdout` und `stderr` haben eine besondere Bedeutung. Die Verwendung dieser Werte führt dazu, dass der Bericht in die zugehörigen Standardstreams geschrieben wird. In Fällen, in denen Standardstreams verwendet werden, wird der Wert in `directory` ignoriert. URLs werden nicht unterstützt. Standardmäßig wird ein zusammengesetzter Dateiname verwendet, der Zeitstempel, PID und Sequenznummer enthält.

`directory` gibt das Dateisystemverzeichnis an, in dem der Bericht geschrieben wird. URLs werden nicht unterstützt. Standardmäßig wird das aktuelle Arbeitsverzeichnis des Node.js-Prozesses verwendet.

`excludeNetwork` schließt `header.networkInterfaces` aus dem Diagnosebericht aus.

```js [ESM]
// Bericht nur bei unbehandelten Ausnahmen auslösen.
process.report.reportOnFatalError = false;
process.report.reportOnSignal = false;
process.report.reportOnUncaughtException = true;

// Bericht sowohl für interne Fehler als auch für externe Signale auslösen.
process.report.reportOnFatalError = true;
process.report.reportOnSignal = true;
process.report.reportOnUncaughtException = false;

// Das Standardsignal in 'SIGQUIT' ändern und aktivieren.
process.report.reportOnFatalError = false;
process.report.reportOnUncaughtException = false;
process.report.reportOnSignal = true;
process.report.signal = 'SIGQUIT';

// Deaktivieren der Berichterstattung über Netzwerkschnittstellen
process.report.excludeNetwork = true;
```
Die Konfiguration bei der Modulinitialisierung ist auch über Umgebungsvariablen möglich:

```bash [BASH]
NODE_OPTIONS="--report-uncaught-exception \
  --report-on-fatalerror --report-on-signal \
  --report-signal=SIGUSR2  --report-filename=./report.json \
  --report-directory=/home/nodeuser"
```
Spezifische API-Dokumentation finden Sie im Abschnitt [`process API documentation`](/de/nodejs/api/process).


## Interaktion mit Workern {#interaction-with-workers}

::: info [Historie]
| Version | Änderungen |
|---|---|
| v13.9.0, v12.16.2 | Worker sind jetzt im Bericht enthalten. |
:::

[`Worker`](/de/nodejs/api/worker_threads)-Threads können Berichte auf die gleiche Weise erstellen wie der Haupt-Thread.

Berichte enthalten Informationen zu allen Workern, die Kinder des aktuellen Threads sind, im Abschnitt `workers`, wobei jeder Worker einen Bericht im Standardberichtsformat generiert.

Der Thread, der den Bericht generiert, wartet, bis die Berichte von Worker-Threads abgeschlossen sind. Die Latenz hierfür ist jedoch normalerweise gering, da sowohl die Ausführung von JavaScript als auch die Event-Loop unterbrochen werden, um den Bericht zu generieren.

