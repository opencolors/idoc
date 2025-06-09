---
title: Documentazione del Report di Node.js
description: La documentazione del Report di Node.js fornisce informazioni dettagliate su come generare, configurare e analizzare report diagnostici per le applicazioni Node.js. Copre l'uso del modulo 'report', inclusi come attivare i report, personalizzare il contenuto dei report e interpretare i dati generati per il debug e l'analisi delle prestazioni.
head:
  - - meta
    - name: og:title
      content: Documentazione del Report di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentazione del Report di Node.js fornisce informazioni dettagliate su come generare, configurare e analizzare report diagnostici per le applicazioni Node.js. Copre l'uso del modulo 'report', inclusi come attivare i report, personalizzare il contenuto dei report e interpretare i dati generati per il debug e l'analisi delle prestazioni.
  - - meta
    - name: twitter:title
      content: Documentazione del Report di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentazione del Report di Node.js fornisce informazioni dettagliate su come generare, configurare e analizzare report diagnostici per le applicazioni Node.js. Copre l'uso del modulo 'report', inclusi come attivare i report, personalizzare il contenuto dei report e interpretare i dati generati per il debug e l'analisi delle prestazioni.
---


# Rapporto diagnostico {#diagnostic-report}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.3.0 | Aggiunta l'opzione `--report-exclude-env` per escludere le variabili d'ambiente dalla generazione del report. |
| v22.0.0, v20.13.0 | Aggiunta l'opzione `--report-exclude-network` per escludere le operazioni di rete che possono rallentare la generazione del report in alcuni casi. |
:::

Fornisce un riepilogo diagnostico in formato JSON, scritto in un file.

Il report è destinato all'uso in fase di sviluppo, test e produzione, per acquisire e preservare informazioni per la determinazione dei problemi. Include JavaScript e stack trace nativi, statistiche sull'heap, informazioni sulla piattaforma, utilizzo delle risorse, ecc. Con l'opzione report abilitata, i report diagnostici possono essere attivati ​​su eccezioni non gestite, errori irreversibili e segnali utente, oltre all'attivazione programmatica tramite chiamate API.

Un esempio completo di report generato su un'eccezione non rilevata è fornito di seguito come riferimento.

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

## Uso {#usage}

```bash [BASH]
node --report-uncaught-exception --report-on-signal \
--report-on-fatalerror app.js
```
-  `--report-uncaught-exception` Abilita la generazione di report sulle eccezioni non gestite. Utile per ispezionare lo stack JavaScript in combinazione con lo stack nativo e altri dati dell'ambiente di runtime.
-  `--report-on-signal` Abilita la generazione di report alla ricezione del segnale specificato (o predefinito) al processo Node.js in esecuzione. (Vedi sotto come modificare il segnale che attiva il report.) Il segnale predefinito è `SIGUSR2`. Utile quando è necessario attivare un report da un altro programma. I monitor delle applicazioni possono sfruttare questa funzionalità per raccogliere report a intervalli regolari e tracciare un ricco set di dati di runtime interni nelle loro viste.

La generazione di report basata su segnale non è supportata in Windows.

In circostanze normali, non è necessario modificare il segnale di attivazione del report. Tuttavia, se `SIGUSR2` è già utilizzato per altri scopi, questo flag aiuta a modificare il segnale per la generazione di report e a preservare il significato originale di `SIGUSR2` per tali scopi.

-  `--report-on-fatalerror` Abilita l'attivazione del report in caso di errori irreversibili (errori interni all'interno del runtime di Node.js, come esaurimento della memoria) che portano alla terminazione dell'applicazione. Utile per ispezionare vari elementi di dati diagnostici come heap, stack, stato del ciclo di eventi, consumo di risorse ecc. per ragionare sull'errore irreversibile.
-  `--report-compact` Scrive i report in un formato compatto, JSON a riga singola, più facilmente utilizzabile dai sistemi di elaborazione dei log rispetto al formato multilinea predefinito progettato per il consumo umano.
-  `--report-directory` Posizione in cui verrà generato il report.
-  `--report-filename` Nome del file in cui verrà scritto il report.
-  `--report-signal` Imposta o reimposta il segnale per la generazione di report (non supportato su Windows). Il segnale predefinito è `SIGUSR2`.
-  `--report-exclude-network` Esclude `header.networkInterfaces` e disabilita le query DNS inverse in `libuv.*.(remote|local)Endpoint.host` dal report diagnostico. Per impostazione predefinita, questa opzione non è impostata e le interfacce di rete sono incluse.
-  `--report-exclude-env` Esclude `environmentVariables` dal report diagnostico. Per impostazione predefinita, questa opzione non è impostata e le variabili di ambiente sono incluse.

Un report può anche essere attivato tramite una chiamata API da un'applicazione JavaScript:

```js [ESM]
process.report.writeReport();
```
Questa funzione accetta un argomento aggiuntivo facoltativo `filename`, che è il nome di un file in cui viene scritto il report.

```js [ESM]
process.report.writeReport('./foo.json');
```
Questa funzione accetta un argomento aggiuntivo facoltativo `err` che è un oggetto `Error` che verrà utilizzato come contesto per lo stack JavaScript stampato nel report. Quando si utilizza il report per gestire gli errori in un callback o in un gestore di eccezioni, questo consente al report di includere la posizione dell'errore originale e il punto in cui è stato gestito.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(err);
}
// Qualsiasi altro codice
```
Se sia il nome del file che l'oggetto errore vengono passati a `writeReport()`, l'oggetto errore deve essere il secondo parametro.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(filename, err);
}
// Qualsiasi altro codice
```
Il contenuto del report diagnostico può essere restituito come oggetto JavaScript tramite una chiamata API da un'applicazione JavaScript:

```js [ESM]
const report = process.report.getReport();
console.log(typeof report === 'object'); // true

// Simile all'output di process.report.writeReport()
console.log(JSON.stringify(report, null, 2));
```
Questa funzione accetta un argomento aggiuntivo facoltativo `err`, che è un oggetto `Error` che verrà utilizzato come contesto per lo stack JavaScript stampato nel report.

```js [ESM]
const report = process.report.getReport(new Error('custom error'));
console.log(typeof report === 'object'); // true
```
Le versioni API sono utili quando si ispeziona lo stato di runtime dall'interno dell'applicazione, in previsione di un auto-adeguamento del consumo di risorse, del bilanciamento del carico, del monitoraggio ecc.

Il contenuto del report è costituito da una sezione di intestazione contenente il tipo di evento, la data, l'ora, il PID e la versione di Node.js, sezioni contenenti stack trace JavaScript e nativi, una sezione contenente informazioni sull'heap V8, una sezione contenente informazioni sull'handle `libuv` e una sezione di informazioni sulla piattaforma del sistema operativo che mostra l'utilizzo di CPU e memoria e i limiti di sistema. Un report di esempio può essere attivato utilizzando la REPL di Node.js:

```bash [BASH]
$ node
> process.report.writeReport();
Writing Node.js report to file: report.20181126.091102.8480.0.001.json
Node.js report completed
>
```
Quando viene scritto un report, i messaggi di inizio e fine vengono emessi su stderr e il nome del file del report viene restituito al chiamante. Il nome del file predefinito include la data, l'ora, il PID e un numero di sequenza. Il numero di sequenza aiuta ad associare il dump del report allo stato di runtime se generato più volte per lo stesso processo Node.js.


## Versione del Report {#report-version}

Il report diagnostico ha un numero di versione a una singola cifra associato (`report.header.reportVersion`), che rappresenta in modo univoco il formato del report. Il numero di versione viene incrementato quando una nuova chiave viene aggiunta o rimossa, oppure il tipo di dati di un valore viene modificato. Le definizioni della versione del report sono coerenti tra le release LTS.

### Cronologia delle versioni {#version-history}

#### Versione 5 {#version-5}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.5.0 | Corretti errori di battitura nelle unità di limite di memoria. |
:::

Sostituisci le chiavi `data_seg_size_kbytes`, `max_memory_size_kbytes` e `virtual_memory_kbytes` con `data_seg_size_bytes`, `max_memory_size_bytes` e `virtual_memory_bytes` rispettivamente nella sezione `userLimits`, poiché questi valori sono forniti in byte.

```json [JSON]
{
  "userLimits": {
    // Salta alcune chiavi ...
    "data_seg_size_bytes": { // sostituisce data_seg_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "max_memory_size_bytes": { // sostituisce max_memory_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "virtual_memory_bytes": { // sostituisce virtual_memory_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    }
  }
}
```
#### Versione 4 {#version-4}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.3.0 | Aggiunta l'opzione `--report-exclude-env` per escludere le variabili d'ambiente dalla generazione del report. |
:::

I nuovi campi `ipv4` e `ipv6` vengono aggiunti agli endpoint degli handle libuv `tcp` e `udp`. Esempi:

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
        "ip4": "127.0.0.1", // nuova chiave
        "port": 48986
      },
      "remoteEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1", // nuova chiave
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
        "ip6": "::1", // nuova chiave
        "port": 52266
      },
      "remoteEndpoint": {
        "host": "ip6-localhost",
        "ip6": "::1", // nuova chiave
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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.1.0, v18.13.0 | Aggiunte ulteriori informazioni sulla memoria. |
:::

Le seguenti chiavi di utilizzo della memoria sono state aggiunte alla sezione `resourceUsage`.

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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.9.0, v12.16.2 | I worker sono ora inclusi nel report. |
:::

Aggiunto il supporto per [`Worker`](/it/nodejs/api/worker_threads). Fare riferimento alla sezione [Interazione con i worker](/it/nodejs/api/report#interaction-with-workers) per maggiori dettagli.

#### Version 1 {#version-1}

Questa è la prima versione del report diagnostico.

## Configurazione {#configuration}

Ulteriori configurazioni di runtime della generazione di report sono disponibili tramite le seguenti proprietà di `process.report`:

`reportOnFatalError` attiva la creazione di report diagnostici su errori irreversibili quando è `true`. Il valore predefinito è `false`.

`reportOnSignal` attiva la creazione di report diagnostici sul segnale quando è `true`. Questo non è supportato su Windows. Il valore predefinito è `false`.

`reportOnUncaughtException` attiva la creazione di report diagnostici su eccezioni non gestite quando è `true`. Il valore predefinito è `false`.

`signal` specifica l'identificatore del segnale POSIX che verrà utilizzato per intercettare i trigger esterni per la generazione del report. Il valore predefinito è `'SIGUSR2'`.

`filename` specifica il nome del file di output nel file system. Un significato speciale è attribuito a `stdout` e `stderr`. L'uso di questi comporterà la scrittura del report nei relativi stream standard. Nei casi in cui vengono utilizzati stream standard, il valore in `directory` viene ignorato. Gli URL non sono supportati. Il valore predefinito è un nome file composito che contiene timestamp, PID e numero di sequenza.

`directory` specifica la directory del file system in cui verrà scritto il report. Gli URL non sono supportati. Il valore predefinito è la directory di lavoro corrente del processo Node.js.

`excludeNetwork` esclude `header.networkInterfaces` dal report diagnostico.

```js [ESM]
// Attiva il report solo su eccezioni non gestite.
process.report.reportOnFatalError = false;
process.report.reportOnSignal = false;
process.report.reportOnUncaughtException = true;

// Attiva il report sia per errori interni che per segnali esterni.
process.report.reportOnFatalError = true;
process.report.reportOnSignal = true;
process.report.reportOnUncaughtException = false;

// Modifica il segnale predefinito in 'SIGQUIT' e abilitalo.
process.report.reportOnFatalError = false;
process.report.reportOnUncaughtException = false;
process.report.reportOnSignal = true;
process.report.signal = 'SIGQUIT';

// Disabilita la creazione di report delle interfacce di rete
process.report.excludeNetwork = true;
```
La configurazione all'inizializzazione del modulo è disponibile anche tramite variabili d'ambiente:

```bash [BASH]
NODE_OPTIONS="--report-uncaught-exception \
  --report-on-fatalerror --report-on-signal \
  --report-signal=SIGUSR2  --report-filename=./report.json \
  --report-directory=/home/nodeuser"
```
La documentazione specifica dell'API è disponibile nella sezione [`process API documentation`](/it/nodejs/api/process).


## Interazione con i worker {#interaction-with-workers}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.9.0, v12.16.2 | I worker sono ora inclusi nel report. |
:::

I thread [`Worker`](/it/nodejs/api/worker_threads) possono creare report nello stesso modo in cui lo fa il thread principale.

I report includeranno informazioni su eventuali Worker che sono figli del thread corrente come parte della sezione `workers`, con ogni Worker che genera un report nel formato standard del report.

Il thread che sta generando il report attenderà il completamento dei report dai thread Worker. Tuttavia, la latenza per questo sarà di solito bassa, poiché sia l'esecuzione di JavaScript che l'event loop vengono interrotti per generare il report.

