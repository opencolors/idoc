---
title: Documentación de Node.js
description: Explora la documentación completa de Node.js, que cubre APIs, módulos y ejemplos de uso para ayudar a los desarrolladores a entender y utilizar Node.js de manera efectiva.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explora la documentación completa de Node.js, que cubre APIs, módulos y ejemplos de uso para ayudar a los desarrolladores a entender y utilizar Node.js de manera efectiva.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explora la documentación completa de Node.js, que cubre APIs, módulos y ejemplos de uso para ayudar a los desarrolladores a entender y utilizar Node.js de manera efectiva.
---


# Acerca de esta documentación {#about-this-documentation}

¡Bienvenido a la documentación oficial de referencia de la API para Node.js!

Node.js es un entorno de ejecución de JavaScript construido sobre el [motor V8 de JavaScript](https://v8.dev/).

## Contribuyendo {#contributing}

Reporte errores en esta documentación en [el rastreador de problemas](https://github.com/nodejs/node/issues/new). Consulte [la guía de contribución](https://github.com/nodejs/node/blob/HEAD/CONTRIBUTING.md) para obtener instrucciones sobre cómo enviar solicitudes de extracción.

## Índice de estabilidad {#stability-index}

A lo largo de la documentación hay indicaciones de la estabilidad de una sección. Algunas API están tan probadas y se confía tanto en ellas que es poco probable que cambien. Otras son completamente nuevas y experimentales, o se sabe que son peligrosas.

Los índices de estabilidad son los siguientes:

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) Estabilidad: 0 - Obsoleto. La característica puede emitir advertencias. No se garantiza la compatibilidad con versiones anteriores.
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) Estabilidad: 1 - Experimental. La característica no está sujeta a las reglas de [versionado semántico](https://semver.org/). Los cambios no compatibles con versiones anteriores o la eliminación pueden ocurrir en cualquier versión futura. No se recomienda el uso de la característica en entornos de producción.
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) Estabilidad: 2 - Estable. La compatibilidad con el ecosistema npm es una alta prioridad.
:::

::: info [Estable: 3 - Legado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) Estabilidad: 3 - Legado. Aunque es poco probable que esta característica se elimine y todavía está cubierta por las garantías de versionado semántico, ya no se mantiene activamente y hay otras alternativas disponibles.
:::

Las características se marcan como heredadas en lugar de obsoletas si su uso no causa daño y se confía ampliamente en ellas dentro del ecosistema npm. Es poco probable que se corrijan los errores encontrados en las características heredadas.

Tenga cuidado al utilizar características experimentales, particularmente al crear bibliotecas. Es posible que los usuarios no sean conscientes de que se están utilizando características experimentales. Los errores o los cambios de comportamiento pueden sorprender a los usuarios cuando se producen modificaciones en la API experimental. Para evitar sorpresas, el uso de una característica experimental puede necesitar un indicador de línea de comandos. Las características experimentales también pueden emitir una [advertencia](/es/nodejs/api/process#event-warning).


## Resumen de estabilidad {#stability-overview}

| API | Estabilidad |
| --- | --- |
| [Assert](/es/nodejs/api/assert) |<div class="custom-block tip"> (2) Estable </div>|
| [Async hooks](/es/nodejs/api/async_hooks) |<div class="custom-block warning"> (1) Experimental </div>|
| [Asynchronous context tracking](/es/nodejs/api/async_context) |<div class="custom-block tip"> (2) Estable </div>|
| [Buffer](/es/nodejs/api/buffer) |<div class="custom-block tip"> (2) Estable </div>|
| [Child process](/es/nodejs/api/child_process) |<div class="custom-block tip"> (2) Estable </div>|
| [Cluster](/es/nodejs/api/cluster) |<div class="custom-block tip"> (2) Estable </div>|
| [Console](/es/nodejs/api/console) |<div class="custom-block tip"> (2) Estable </div>|
| [Crypto](/es/nodejs/api/crypto) |<div class="custom-block tip"> (2) Estable </div>|
| [Diagnostics Channel](/es/nodejs/api/diagnostics_channel) |<div class="custom-block tip"> (2) Estable </div>|
| [DNS](/es/nodejs/api/dns) |<div class="custom-block tip"> (2) Estable </div>|
| [Domain](/es/nodejs/api/domain) |<div class="custom-block danger"> (0) Obsoleto </div>|
| [File system](/es/nodejs/api/fs) |<div class="custom-block tip"> (2) Estable </div>|
| [HTTP](/es/nodejs/api/http) |<div class="custom-block tip"> (2) Estable </div>|
| [HTTP/2](/es/nodejs/api/http2) |<div class="custom-block tip"> (2) Estable </div>|
| [HTTPS](/es/nodejs/api/https) |<div class="custom-block tip"> (2) Estable </div>|
| [Inspector](/es/nodejs/api/inspector) |<div class="custom-block tip"> (2) Estable </div>|
| [Modules: `node:module` API](/es/nodejs/api/module) |<div class="custom-block warning"> (1) .2 - Candidato de lanzamiento (versión asíncrona) Estabilidad: 1.1 - Desarrollo activo (versión síncrona) </div>|
| [Modules: CommonJS modules](/es/nodejs/api/modules) |<div class="custom-block tip"> (2) Estable </div>|
| [Modules: TypeScript](/es/nodejs/api/typescript) |<div class="custom-block warning"> (1) .1 - Desarrollo activo </div>|
| [OS](/es/nodejs/api/os) |<div class="custom-block tip"> (2) Estable </div>|
| [Path](/es/nodejs/api/path) |<div class="custom-block tip"> (2) Estable </div>|
| [Performance measurement APIs](/es/nodejs/api/perf_hooks) |<div class="custom-block tip"> (2) Estable </div>|
| [Punycode](/es/nodejs/api/punycode) |<div class="custom-block danger"> (0) Obsoleto </div>|
| [Query string](/es/nodejs/api/querystring) |<div class="custom-block tip"> (2) Estable </div>|
| [Readline](/es/nodejs/api/readline) |<div class="custom-block tip"> (2) Estable </div>|
| [REPL](/es/nodejs/api/repl) |<div class="custom-block tip"> (2) Estable </div>|
| [Single executable applications](/es/nodejs/api/single-executable-applications) |<div class="custom-block warning"> (1) .1 - Desarrollo activo </div>|
| [SQLite](/es/nodejs/api/sqlite) |<div class="custom-block warning"> (1) .1 - Desarrollo activo. </div>|
| [Stream](/es/nodejs/api/stream) |<div class="custom-block tip"> (2) Estable </div>|
| [String decoder](/es/nodejs/api/string_decoder) |<div class="custom-block tip"> (2) Estable </div>|
| [Test runner](/es/nodejs/api/test) |<div class="custom-block tip"> (2) Estable </div>|
| [Timers](/es/nodejs/api/timers) |<div class="custom-block tip"> (2) Estable </div>|
| [TLS (SSL)](/es/nodejs/api/tls) |<div class="custom-block tip"> (2) Estable </div>|
| [Trace events](/es/nodejs/api/tracing) |<div class="custom-block warning"> (1) Experimental </div>|
| [TTY](/es/nodejs/api/tty) |<div class="custom-block tip"> (2) Estable </div>|
| [UDP/datagram sockets](/es/nodejs/api/dgram) |<div class="custom-block tip"> (2) Estable </div>|
| [URL](/es/nodejs/api/url) |<div class="custom-block tip"> (2) Estable </div>|
| [Util](/es/nodejs/api/util) |<div class="custom-block tip"> (2) Estable </div>|
| [VM (executing JavaScript)](/es/nodejs/api/vm) |<div class="custom-block tip"> (2) Estable </div>|
| [Web Crypto API](/es/nodejs/api/webcrypto) |<div class="custom-block tip"> (2) Estable </div>|
| [Web Streams API](/es/nodejs/api/webstreams) |<div class="custom-block tip"> (2) Estable </div>|
| [WebAssembly System Interface (WASI)](/es/nodejs/api/wasi) |<div class="custom-block warning"> (1) Experimental </div>|
| [Worker threads](/es/nodejs/api/worker_threads) |<div class="custom-block tip"> (2) Estable </div>|
| [Zlib](/es/nodejs/api/zlib) |<div class="custom-block tip"> (2) Estable </div>|


## Salida JSON {#json-output}

**Añadido en: v0.6.12**

Cada documento `.html` tiene un documento `.json` correspondiente. Esto es para IDEs y otras utilidades que consumen la documentación.

## Llamadas al sistema y páginas de manual {#system-calls-and-man-pages}

Las funciones de Node.js que encapsulan una llamada al sistema lo documentarán. La documentación enlaza a las páginas de manual correspondientes que describen cómo funciona la llamada al sistema.

La mayoría de las llamadas al sistema Unix tienen análogos en Windows. Aún así, las diferencias de comportamiento pueden ser inevitables.

