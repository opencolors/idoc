---
title: Documentation de Rapport Node.js
description: La documentation de Rapport Node.js fournit des informations détaillées sur la manière de générer, configurer et analyser des rapports de diagnostic pour les applications Node.js. Elle couvre l'utilisation du module 'report', y compris comment déclencher des rapports, personnaliser le contenu des rapports et interpréter les données générées pour le débogage et l'analyse de performance.
head:
  - - meta
    - name: og:title
      content: Documentation de Rapport Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentation de Rapport Node.js fournit des informations détaillées sur la manière de générer, configurer et analyser des rapports de diagnostic pour les applications Node.js. Elle couvre l'utilisation du module 'report', y compris comment déclencher des rapports, personnaliser le contenu des rapports et interpréter les données générées pour le débogage et l'analyse de performance.
  - - meta
    - name: twitter:title
      content: Documentation de Rapport Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentation de Rapport Node.js fournit des informations détaillées sur la manière de générer, configurer et analyser des rapports de diagnostic pour les applications Node.js. Elle couvre l'utilisation du module 'report', y compris comment déclencher des rapports, personnaliser le contenu des rapports et interpréter les données générées pour le débogage et l'analyse de performance.
---


# Rapport de diagnostic {#diagnostic-report}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.3.0 | Ajout de l'option `--report-exclude-env` pour exclure les variables d'environnement de la génération du rapport. |
| v22.0.0, v20.13.0 | Ajout de l'option `--report-exclude-network` pour exclure les opérations réseau qui peuvent ralentir la génération du rapport dans certains cas. |
:::

Fournit un résumé de diagnostic au format JSON, écrit dans un fichier.

Le rapport est destiné à une utilisation en développement, en test et en production, afin de capturer et de conserver des informations pour la détermination des problèmes. Il comprend des traces de pile JavaScript et natives, des statistiques de tas, des informations sur la plateforme, l'utilisation des ressources, etc. Avec l'option de rapport activée, les rapports de diagnostic peuvent être déclenchés sur les exceptions non gérées, les erreurs fatales et les signaux utilisateur, en plus d'être déclenchés par programme via des appels d'API.

Un exemple complet de rapport généré sur une exception non interceptée est fourni ci-dessous à titre de référence.

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
    "REMOTEHOST": "SUPPRIMÉ",
    "MANPATH": "/opt/rh/devtoolset-3/root/usr/share/man:",
    "XDG_SESSION_ID": "66126",
    "HOSTNAME": "test_machine",
    "HOST": "test_machine",
    "TERM": "xterm-256color",
    "SHELL": "/bin/csh",
    "SSH_CLIENT": "SUPPRIMÉ",
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

## Utilisation {#usage}

```bash [BASH]
node --report-uncaught-exception --report-on-signal \
--report-on-fatalerror app.js
```
-  `--report-uncaught-exception` Active la génération d'un rapport sur les exceptions non interceptées. Utile pour inspecter la pile JavaScript en conjonction avec la pile native et d'autres données d'environnement d'exécution.
-  `--report-on-signal` Active la génération d'un rapport lors de la réception du signal spécifié (ou prédéfini) par le processus Node.js en cours d'exécution. (Voir ci-dessous comment modifier le signal qui déclenche le rapport.) Le signal par défaut est `SIGUSR2`. Utile lorsqu'un rapport doit être déclenché depuis un autre programme. Les moniteurs d'application peuvent tirer parti de cette fonctionnalité pour collecter des rapports à intervalles réguliers et tracer un ensemble riche de données d'exécution internes dans leurs vues.

La génération de rapports basée sur un signal n'est pas prise en charge sous Windows.

Dans des circonstances normales, il n'est pas nécessaire de modifier le signal de déclenchement du rapport. Cependant, si `SIGUSR2` est déjà utilisé à d'autres fins, cet indicateur permet de modifier le signal de génération de rapport et de préserver la signification originale de `SIGUSR2` pour lesdites fins.

-  `--report-on-fatalerror` Permet de déclencher le rapport sur les erreurs fatales (erreurs internes au sein de l'environnement d'exécution Node.js, telles qu'un manque de mémoire) qui entraînent la fin de l'application. Utile pour inspecter divers éléments de données de diagnostic tels que le tas, la pile, l'état de la boucle d'événements, la consommation de ressources, etc. pour comprendre l'erreur fatale.
-  `--report-compact` Ecrit les rapports dans un format compact, JSON sur une seule ligne, plus facilement consommable par les systèmes de traitement des journaux que le format multiligne par défaut conçu pour la consommation humaine.
-  `--report-directory` Emplacement où le rapport sera généré.
-  `--report-filename` Nom du fichier dans lequel le rapport sera écrit.
-  `--report-signal` Définit ou réinitialise le signal pour la génération du rapport (non pris en charge sous Windows). Le signal par défaut est `SIGUSR2`.
-  `--report-exclude-network` Exclut `header.networkInterfaces` et désactive les requêtes DNS inversées dans `libuv.*.(remote|local)Endpoint.host` du rapport de diagnostic. Par défaut, ceci n'est pas défini et les interfaces réseau sont incluses.
-  `--report-exclude-env` Exclut `environmentVariables` du rapport de diagnostic. Par défaut, ceci n'est pas défini et les variables d'environnement sont incluses.

Un rapport peut également être déclenché via un appel API depuis une application JavaScript :

```js [ESM]
process.report.writeReport();
```
Cette fonction prend un argument supplémentaire optionnel `filename`, qui est le nom d'un fichier dans lequel le rapport est écrit.

```js [ESM]
process.report.writeReport('./foo.json');
```
Cette fonction prend un argument supplémentaire optionnel `err` qui est un objet `Error` qui sera utilisé comme contexte pour la pile JavaScript imprimée dans le rapport. Lors de l'utilisation d'un rapport pour gérer les erreurs dans un rappel ou un gestionnaire d'exceptions, cela permet au rapport d'inclure l'emplacement de l'erreur d'origine ainsi que l'endroit où elle a été gérée.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(err);
}
// Any other code
```
Si à la fois le nom de fichier et l'objet d'erreur sont passés à `writeReport()`, l'objet d'erreur doit être le deuxième paramètre.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(filename, err);
}
// Any other code
```
Le contenu du rapport de diagnostic peut être renvoyé sous forme d'objet JavaScript via un appel API depuis une application JavaScript :

```js [ESM]
const report = process.report.getReport();
console.log(typeof report === 'object'); // true

// Similar to process.report.writeReport() output
console.log(JSON.stringify(report, null, 2));
```
Cette fonction prend un argument supplémentaire optionnel `err`, qui est un objet `Error` qui sera utilisé comme contexte pour la pile JavaScript imprimée dans le rapport.

```js [ESM]
const report = process.report.getReport(new Error('custom error'));
console.log(typeof report === 'object'); // true
```
Les versions d'API sont utiles pour inspecter l'état d'exécution depuis l'application, dans l'attente d'un auto-ajustement de la consommation de ressources, de l'équilibrage de charge, de la surveillance, etc.

Le contenu du rapport se compose d'une section d'en-tête contenant le type d'événement, la date, l'heure, le PID et la version de Node.js, de sections contenant les traces de pile JavaScript et natives, d'une section contenant des informations sur le tas V8, d'une section contenant des informations sur le descripteur `libuv` et d'une section d'informations sur la plate-forme du système d'exploitation indiquant l'utilisation du CPU et de la mémoire et les limites du système. Un exemple de rapport peut être déclenché à l'aide du REPL Node.js :

```bash [BASH]
$ node
> process.report.writeReport();
Writing Node.js report to file: report.20181126.091102.8480.0.001.json
Node.js report completed
>
```
Lorsqu'un rapport est écrit, les messages de début et de fin sont envoyés à stderr et le nom de fichier du rapport est renvoyé à l'appelant. Le nom de fichier par défaut inclut la date, l'heure, le PID et un numéro de séquence. Le numéro de séquence permet d'associer le vidage de rapport à l'état d'exécution s'il est généré plusieurs fois pour le même processus Node.js.


## Version du rapport {#report-version}

Le rapport de diagnostic est associé à un numéro de version à un chiffre (`report.header.reportVersion`), représentant de manière unique le format du rapport. Le numéro de version est incrémenté lorsqu'une nouvelle clé est ajoutée ou supprimée, ou lorsque le type de données d'une valeur est modifié. Les définitions de version du rapport sont cohérentes entre les versions LTS.

### Historique des versions {#version-history}

#### Version 5 {#version-5}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.5.0 | Correction de fautes de frappe dans les unités de limite de mémoire. |
:::

Remplacez les clés `data_seg_size_kbytes`, `max_memory_size_kbytes` et `virtual_memory_kbytes` par `data_seg_size_bytes`, `max_memory_size_bytes` et `virtual_memory_bytes` respectivement dans la section `userLimits`, car ces valeurs sont données en octets.

```json [JSON]
{
  "userLimits": {
    // Ignorer certaines clés ...
    "data_seg_size_bytes": { // remplacement de data_seg_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "max_memory_size_bytes": { // remplacement de max_memory_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "virtual_memory_bytes": { // remplacement de virtual_memory_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    }
  }
}
```
#### Version 4 {#version-4}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.3.0 | Ajout de l'option `--report-exclude-env` pour exclure les variables d'environnement de la génération de rapports. |
:::

De nouveaux champs `ipv4` et `ipv6` sont ajoutés aux points de terminaison des handles libuv `tcp` et `udp`. Exemples :

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
        "ip4": "127.0.0.1", // nouvelle clé
        "port": 48986
      },
      "remoteEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1", // nouvelle clé
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
        "ip6": "::1", // nouvelle clé
        "port": 52266
      },
      "remoteEndpoint": {
        "host": "ip6-localhost",
        "ip6": "::1", // nouvelle clé
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

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.1.0, v18.13.0 | Ajout d'informations supplémentaires sur la mémoire. |
:::

Les clés d'utilisation de la mémoire suivantes sont ajoutées à la section `resourceUsage`.

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

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.9.0, v12.16.2 | Les workers sont désormais inclus dans le rapport. |
:::

Ajout du support de [`Worker`](/fr/nodejs/api/worker_threads). Consultez la section [Interaction avec les workers](/fr/nodejs/api/report#interaction-with-workers) pour plus de détails.

#### Version 1 {#version-1}

Il s'agit de la première version du rapport de diagnostic.

## Configuration {#configuration}

Une configuration d'exécution supplémentaire de la génération de rapports est disponible via les propriétés suivantes de `process.report` :

`reportOnFatalError` déclenche la génération de rapports de diagnostic sur les erreurs fatales lorsque la valeur est `true`. La valeur par défaut est `false`.

`reportOnSignal` déclenche la génération de rapports de diagnostic sur le signal lorsque la valeur est `true`. Ceci n'est pas pris en charge sur Windows. La valeur par défaut est `false`.

`reportOnUncaughtException` déclenche la génération de rapports de diagnostic sur les exceptions non interceptées lorsque la valeur est `true`. La valeur par défaut est `false`.

`signal` spécifie l'identifiant de signal POSIX qui sera utilisé pour intercepter les déclencheurs externes pour la génération de rapports. La valeur par défaut est `'SIGUSR2'`.

`filename` spécifie le nom du fichier de sortie dans le système de fichiers. Une signification particulière est attachée à `stdout` et `stderr`. Leur utilisation entraînera l'écriture du rapport dans les flux standard associés. Dans les cas où des flux standard sont utilisés, la valeur dans `directory` est ignorée. Les URL ne sont pas prises en charge. La valeur par défaut est un nom de fichier composite qui contient l'horodatage, le PID et le numéro de séquence.

`directory` spécifie le répertoire du système de fichiers où le rapport sera écrit. Les URL ne sont pas prises en charge. La valeur par défaut est le répertoire de travail actuel du processus Node.js.

`excludeNetwork` exclut `header.networkInterfaces` du rapport de diagnostic.

```js [ESM]
// Déclencher un rapport uniquement sur les exceptions non interceptées.
process.report.reportOnFatalError = false;
process.report.reportOnSignal = false;
process.report.reportOnUncaughtException = true;

// Déclencher un rapport pour les erreurs internes ainsi que pour les signaux externes.
process.report.reportOnFatalError = true;
process.report.reportOnSignal = true;
process.report.reportOnUncaughtException = false;

// Changer le signal par défaut à 'SIGQUIT' et l'activer.
process.report.reportOnFatalError = false;
process.report.reportOnUncaughtException = false;
process.report.reportOnSignal = true;
process.report.signal = 'SIGQUIT';

// Désactiver le rapport des interfaces réseau
process.report.excludeNetwork = true;
```
La configuration lors de l'initialisation du module est également disponible via les variables d'environnement :

```bash [BASH]
NODE_OPTIONS="--report-uncaught-exception \
  --report-on-fatalerror --report-on-signal \
  --report-signal=SIGUSR2  --report-filename=./report.json \
  --report-directory=/home/nodeuser"
```
La documentation spécifique de l'API se trouve dans la section [`documentation de l'API process`](/fr/nodejs/api/process).


## Interaction avec les workers {#interaction-with-workers}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.9.0, v12.16.2 | Les workers sont désormais inclus dans le rapport. |
:::

Les threads [`Worker`](/fr/nodejs/api/worker_threads) peuvent créer des rapports de la même manière que le thread principal.

Les rapports incluront des informations sur tous les Workers qui sont des enfants du thread actuel dans la section `workers`, chaque Worker générant un rapport au format standard.

Le thread qui génère le rapport attendra la fin des rapports des threads Worker. Cependant, la latence pour cela sera généralement faible, car l'exécution de JavaScript et la boucle d'événements sont interrompues pour générer le rapport.

