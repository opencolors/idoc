---
title: Documentación de Informe de Node.js
description: La documentación de Informe de Node.js ofrece información detallada sobre cómo generar, configurar y analizar informes de diagnóstico para aplicaciones Node.js. Cubre el uso del módulo 'report', incluyendo cómo activar informes, personalizar el contenido de los informes e interpretar los datos generados para depuración y análisis de rendimiento.
head:
  - - meta
    - name: og:title
      content: Documentación de Informe de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentación de Informe de Node.js ofrece información detallada sobre cómo generar, configurar y analizar informes de diagnóstico para aplicaciones Node.js. Cubre el uso del módulo 'report', incluyendo cómo activar informes, personalizar el contenido de los informes e interpretar los datos generados para depuración y análisis de rendimiento.
  - - meta
    - name: twitter:title
      content: Documentación de Informe de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentación de Informe de Node.js ofrece información detallada sobre cómo generar, configurar y analizar informes de diagnóstico para aplicaciones Node.js. Cubre el uso del módulo 'report', incluyendo cómo activar informes, personalizar el contenido de los informes e interpretar los datos generados para depuración y análisis de rendimiento.
---


# Informe de diagnóstico {#diagnostic-report}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.3.0 | Se agregó la opción `--report-exclude-env` para excluir las variables de entorno de la generación de informes. |
| v22.0.0, v20.13.0 | Se agregó la opción `--report-exclude-network` para excluir las operaciones de red que pueden ralentizar la generación de informes en algunos casos. |
:::

Entrega un resumen de diagnóstico con formato JSON, escrito en un archivo.

El informe está destinado al uso en desarrollo, pruebas y producción, para capturar y preservar información para la determinación de problemas. Incluye trazas de pila de JavaScript y nativas, estadísticas de montón, información de la plataforma, uso de recursos, etc. Con la opción de informe habilitada, los informes de diagnóstico se pueden activar en excepciones no controladas, errores fatales y señales de usuario, además de activarse mediante programación a través de llamadas API.

A continuación, se proporciona un ejemplo completo de informe que se generó en una excepción no detectada como referencia.

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
- `--report-uncaught-exception` Permite que se genere un informe sobre excepciones no capturadas. Útil cuando se inspecciona la pila de JavaScript junto con la pila nativa y otros datos del entorno de ejecución.
- `--report-on-signal` Permite que se genere un informe al recibir la señal especificada (o predefinida) al proceso de Node.js en ejecución. (Consulte a continuación cómo modificar la señal que activa el informe). La señal predeterminada es `SIGUSR2`. Útil cuando es necesario activar un informe desde otro programa. Los monitores de aplicaciones pueden aprovechar esta función para recopilar informes a intervalos regulares y trazar un rico conjunto de datos internos del tiempo de ejecución en sus vistas.

La generación de informes basada en señales no se admite en Windows.

En circunstancias normales, no es necesario modificar la señal de activación del informe. Sin embargo, si `SIGUSR2` ya se utiliza para otros fines, este indicador ayuda a cambiar la señal para la generación de informes y preservar el significado original de `SIGUSR2` para dichos fines.

- `--report-on-fatalerror` Permite que el informe se active en errores fatales (errores internos dentro del tiempo de ejecución de Node.js, como falta de memoria) que conducen a la finalización de la aplicación. Útil para inspeccionar varios elementos de datos de diagnóstico, como el montón, la pila, el estado del bucle de eventos, el consumo de recursos, etc., para razonar sobre el error fatal.
- `--report-compact` Escriba los informes en un formato compacto, JSON de una sola línea, más fácilmente consumible por los sistemas de procesamiento de registros que el formato predeterminado de varias líneas diseñado para el consumo humano.
- `--report-directory` Ubicación en la que se generará el informe.
- `--report-filename` Nombre del archivo en el que se escribirá el informe.
- `--report-signal` Establece o restablece la señal para la generación de informes (no compatible con Windows). La señal predeterminada es `SIGUSR2`.
- `--report-exclude-network` Excluye `header.networkInterfaces` y deshabilita las consultas DNS inversas en `libuv.*.(remote|local)Endpoint.host` del informe de diagnóstico. De forma predeterminada, esto no está configurado y las interfaces de red están incluidas.
- `--report-exclude-env` Excluye `environmentVariables` del informe de diagnóstico. De forma predeterminada, esto no está configurado y las variables de entorno están incluidas.

También se puede activar un informe mediante una llamada API desde una aplicación JavaScript:

```js [ESM]
process.report.writeReport();
```
Esta función toma un argumento adicional opcional `filename`, que es el nombre de un archivo en el que se escribe el informe.

```js [ESM]
process.report.writeReport('./foo.json');
```
Esta función toma un argumento adicional opcional `err`, que es un objeto `Error` que se utilizará como contexto para la pila de JavaScript impresa en el informe. Cuando se utiliza el informe para manejar errores en una devolución de llamada o un manejador de excepciones, esto permite que el informe incluya la ubicación del error original, así como dónde se manejó.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(err);
}
// Any other code
```
Si tanto el nombre del archivo como el objeto de error se pasan a `writeReport()`, el objeto de error debe ser el segundo parámetro.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(filename, err);
}
// Any other code
```
El contenido del informe de diagnóstico se puede devolver como un objeto JavaScript a través de una llamada API desde una aplicación JavaScript:

```js [ESM]
const report = process.report.getReport();
console.log(typeof report === 'object'); // true

// Similar to process.report.writeReport() output
console.log(JSON.stringify(report, null, 2));
```
Esta función toma un argumento adicional opcional `err`, que es un objeto `Error` que se utilizará como contexto para la pila de JavaScript impresa en el informe.

```js [ESM]
const report = process.report.getReport(new Error('custom error'));
console.log(typeof report === 'object'); // true
```
Las versiones de la API son útiles cuando se inspecciona el estado del tiempo de ejecución desde dentro de la aplicación, en previsión de autoajustar el consumo de recursos, el equilibrio de carga, la supervisión, etc.

El contenido del informe consta de una sección de encabezado que contiene el tipo de evento, la fecha, la hora, el PID y la versión de Node.js, secciones que contienen rastreos de pila de JavaScript y nativos, una sección que contiene información del montón de V8, una sección que contiene información de manejo de `libuv` y una sección de información de la plataforma del sistema operativo que muestra el uso de la CPU y la memoria y los límites del sistema. Se puede activar un informe de ejemplo utilizando el REPL de Node.js:

```bash [BASH]
$ node
> process.report.writeReport();
Writing Node.js report to file: report.20181126.091102.8480.0.001.json
Node.js report completed
>
```
Cuando se escribe un informe, se emiten mensajes de inicio y fin a stderr y el nombre del archivo del informe se devuelve a la persona que llama. El nombre de archivo predeterminado incluye la fecha, la hora, el PID y un número de secuencia. El número de secuencia ayuda a asociar el volcado del informe con el estado del tiempo de ejecución si se genera varias veces para el mismo proceso de Node.js.


## Versión del informe {#report-version}

El informe de diagnóstico tiene un número de versión de un solo dígito asociado (`report.header.reportVersion`), que representa de forma única el formato del informe. El número de versión se incrementa cuando se añade o se elimina una nueva clave, o cuando se cambia el tipo de datos de un valor. Las definiciones de la versión del informe son consistentes en todas las versiones LTS.

### Historial de versiones {#version-history}

#### Versión 5 {#version-5}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.5.0 | Corrección de errores tipográficos en las unidades de límite de memoria. |
:::

Reemplazar las claves `data_seg_size_kbytes`, `max_memory_size_kbytes` y `virtual_memory_kbytes` con `data_seg_size_bytes`, `max_memory_size_bytes` y `virtual_memory_bytes` respectivamente en la sección `userLimits`, ya que estos valores se dan en bytes.

```json [JSON]
{
  "userLimits": {
    // Omitir algunas claves ...
    "data_seg_size_bytes": { // reemplazando data_seg_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "max_memory_size_bytes": { // reemplazando max_memory_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "virtual_memory_bytes": { // reemplazando virtual_memory_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    }
  }
}
```
#### Versión 4 {#version-4}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.3.0 | Se añadió la opción `--report-exclude-env` para excluir variables de entorno de la generación de informes. |
:::

Se añaden los nuevos campos `ipv4` e `ipv6` a los endpoints de los manejadores libuv `tcp` y `udp`. Ejemplos:

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
        "ip4": "127.0.0.1", // nueva clave
        "port": 48986
      },
      "remoteEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1", // nueva clave
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
        "ip6": "::1", // nueva clave
        "port": 52266
      },
      "remoteEndpoint": {
        "host": "ip6-localhost",
        "ip6": "::1", // nueva clave
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

#### Versión 3 {#version-3}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.1.0, v18.13.0 | Agrega más información de memoria. |
:::

Las siguientes claves de uso de memoria se agregan a la sección `resourceUsage`.

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
#### Versión 2 {#version-2}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.9.0, v12.16.2 | Ahora los workers están incluidos en el informe. |
:::

Se agregó soporte para [`Worker`](/es/nodejs/api/worker_threads). Consulte la sección [Interacción con workers](/es/nodejs/api/report#interaction-with-workers) para obtener más detalles.

#### Versión 1 {#version-1}

Esta es la primera versión del informe de diagnóstico.

## Configuración {#configuration}

La configuración adicional en tiempo de ejecución de la generación de informes está disponible a través de las siguientes propiedades de `process.report`:

`reportOnFatalError` activa la generación de informes de diagnóstico en errores fatales cuando es `true`. El valor predeterminado es `false`.

`reportOnSignal` activa la generación de informes de diagnóstico en la señal cuando es `true`. Esto no es compatible con Windows. El valor predeterminado es `false`.

`reportOnUncaughtException` activa la generación de informes de diagnóstico en la excepción no detectada cuando es `true`. El valor predeterminado es `false`.

`signal` especifica el identificador de señal POSIX que se utilizará para interceptar los activadores externos para la generación de informes. El valor predeterminado es `'SIGUSR2'`.

`filename` especifica el nombre del archivo de salida en el sistema de archivos. Se adjunta un significado especial a `stdout` y `stderr`. El uso de estos dará como resultado que el informe se escriba en los flujos estándar asociados. En los casos en que se utilizan flujos estándar, se ignora el valor en `directory`. Las URL no son compatibles. El valor predeterminado es un nombre de archivo compuesto que contiene la marca de tiempo, el PID y el número de secuencia.

`directory` especifica el directorio del sistema de archivos donde se escribirá el informe. Las URL no son compatibles. El valor predeterminado es el directorio de trabajo actual del proceso Node.js.

`excludeNetwork` excluye `header.networkInterfaces` del informe de diagnóstico.

```js [ESM]
// Activar el informe solo en excepciones no detectadas.
process.report.reportOnFatalError = false;
process.report.reportOnSignal = false;
process.report.reportOnUncaughtException = true;

// Activar el informe tanto para errores internos como para señales externas.
process.report.reportOnFatalError = true;
process.report.reportOnSignal = true;
process.report.reportOnUncaughtException = false;

// Cambiar la señal predeterminada a 'SIGQUIT' y habilitarla.
process.report.reportOnFatalError = false;
process.report.reportOnUncaughtException = false;
process.report.reportOnSignal = true;
process.report.signal = 'SIGQUIT';

// Deshabilitar el reporte de interfaces de red
process.report.excludeNetwork = true;
```
La configuración en la inicialización del módulo también está disponible a través de variables de entorno:

```bash [BASH]
NODE_OPTIONS="--report-uncaught-exception \
  --report-on-fatalerror --report-on-signal \
  --report-signal=SIGUSR2  --report-filename=./report.json \
  --report-directory=/home/nodeuser"
```
La documentación específica de la API se puede encontrar en la sección [`documentación de la API de proceso`](/es/nodejs/api/process).


## Interacción con Workers {#interaction-with-workers}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.9.0, v12.16.2 | Los Workers ahora están incluidos en el informe. |
:::

Los hilos [`Worker`](/es/nodejs/api/worker_threads) pueden crear informes de la misma manera que lo hace el hilo principal.

Los informes incluirán información sobre cualquier Worker que sea hijo del hilo actual como parte de la sección `workers`, con cada Worker generando un informe en el formato de informe estándar.

El hilo que está generando el informe esperará a que los informes de los hilos Worker finalicen. Sin embargo, la latencia para esto suele ser baja, ya que tanto la ejecución de JavaScript como el bucle de eventos se interrumpen para generar el informe.

