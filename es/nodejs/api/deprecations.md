---
title: Desuso en Node.js
description: Esta página documenta las características obsoletas en Node.js, proporcionando orientación sobre cómo actualizar el código para evitar el uso de APIs y prácticas anticuadas.
head:
  - - meta
    - name: og:title
      content: Desuso en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta página documenta las características obsoletas en Node.js, proporcionando orientación sobre cómo actualizar el código para evitar el uso de APIs y prácticas anticuadas.
  - - meta
    - name: twitter:title
      content: Desuso en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta página documenta las características obsoletas en Node.js, proporcionando orientación sobre cómo actualizar el código para evitar el uso de APIs y prácticas anticuadas.
---


# APIs Obsoletas {#deprecated-apis}

Las APIs de Node.js pueden quedar obsoletas por cualquiera de las siguientes razones:

- El uso de la API no es seguro.
- Existe una API alternativa mejorada.
- Se esperan cambios importantes en la API en una futura versión principal.

Node.js utiliza cuatro tipos de obsolescencia:

- Solo en la documentación
- Aplicación (solo código que no es `node_modules`)
- Tiempo de ejecución (todo el código)
- Fin de vida útil

Una obsolescencia solo en la documentación es aquella que se expresa únicamente en la documentación de la API de Node.js. Estas no generan efectos secundarios al ejecutar Node.js. Algunas obsolescencias solo en la documentación activan una advertencia en tiempo de ejecución cuando se inician con el indicador [`--pending-deprecation`](/es/nodejs/api/cli#--pending-deprecation) (o su alternativa, la variable de entorno `NODE_PENDING_DEPRECATION=1`), de forma similar a las obsolescencias en tiempo de ejecución que se describen a continuación. Las obsolescencias solo en la documentación que admiten ese indicador se etiquetan explícitamente como tales en la [lista de APIs Obsoletas](/es/nodejs/api/deprecations#list-of-deprecated-apis).

Una obsolescencia de aplicación solo para código que no es `node_modules` generará, de forma predeterminada, una advertencia de proceso que se imprimirá en `stderr` la primera vez que la API obsoleta se utilice en código que no se carga desde `node_modules`. Cuando se utiliza el indicador de línea de comandos [`--throw-deprecation`](/es/nodejs/api/cli#--throw-deprecation), una obsolescencia en tiempo de ejecución provocará que se lance un error. Cuando se utiliza [`--pending-deprecation`](/es/nodejs/api/cli#--pending-deprecation), también se emitirán advertencias para el código cargado desde `node_modules`.

Una obsolescencia en tiempo de ejecución para todo el código es similar a la obsolescencia en tiempo de ejecución para código que no es `node_modules`, excepto que también emite una advertencia para el código cargado desde `node_modules`.

Una obsolescencia de fin de vida útil se utiliza cuando una funcionalidad se elimina o se eliminará pronto de Node.js.

## Revocación de obsolescencias {#revoking-deprecations}

Ocasionalmente, la obsolescencia de una API podría revertirse. En tales situaciones, este documento se actualizará con información relevante para la decisión. Sin embargo, el identificador de obsolescencia no se modificará.

## Lista de APIs obsoletas {#list-of-deprecated-apis}

### DEP0001: `http.OutgoingMessage.prototype.flush` {#dep0001-httpoutgoingmessageprototypeflush}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | Fin de vida útil. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v1.6.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`OutgoingMessage.prototype.flush()` ha sido eliminada. Utilice `OutgoingMessage.prototype.flushHeaders()` en su lugar.


### DEP0002: `require('_linklist')` {#dep0002-require_linklist}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | Fin de vida útil. |
| v6.12.0 | Se ha asignado un código de obsolescencia. |
| v5.0.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

El módulo `_linklist` está obsoleto. Por favor, utilice una alternativa de espacio de usuario.

### DEP0003: `_writableState.buffer` {#dep0003-_writablestatebuffer}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | Fin de vida útil. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.11.15 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

Se ha eliminado `_writableState.buffer`. Use `_writableState.getBuffer()` en su lugar.

### DEP0004: `CryptoStream.prototype.readyState` {#dep0004-cryptostreamprototypereadystate}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Fin de vida útil. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.4.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Fin de vida útil

Se eliminó la propiedad `CryptoStream.prototype.readyState`.

### DEP0005: Constructor `Buffer()` {#dep0005-buffer-constructor}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Obsolescencia en tiempo de ejecución. |
| v6.12.0 | Se ha asignado un código de obsolescencia. |
| v6.0.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Aplicación (solo código que no sea `node_modules`)

La función `Buffer()` y el constructor `new Buffer()` están obsoletos debido a problemas de usabilidad de la API que pueden provocar problemas de seguridad accidentales.

Como alternativa, utilice uno de los siguientes métodos para construir objetos `Buffer`:

- [`Buffer.alloc(size[, fill[, encoding]])`](/es/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding): Crea un `Buffer` con memoria *inicializada*.
- [`Buffer.allocUnsafe(size)`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize): Crea un `Buffer` con memoria *no inicializada*.
- [`Buffer.allocUnsafeSlow(size)`](/es/nodejs/api/buffer#static-method-bufferallocunsafeslowsize): Crea un `Buffer` con memoria *no inicializada*.
- [`Buffer.from(array)`](/es/nodejs/api/buffer#static-method-bufferfromarray): Crea un `Buffer` con una copia de `array`.
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/es/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) - Crea un `Buffer` que envuelve el `arrayBuffer` dado.
- [`Buffer.from(buffer)`](/es/nodejs/api/buffer#static-method-bufferfrombuffer): Crea un `Buffer` que copia `buffer`.
- [`Buffer.from(string[, encoding])`](/es/nodejs/api/buffer#static-method-bufferfromstring-encoding): Crea un `Buffer` que copia `string`.

Sin `--pending-deprecation`, las advertencias de tiempo de ejecución solo ocurren para el código que no está en `node_modules`. Esto significa que no habrá advertencias de obsolescencia para el uso de `Buffer()` en las dependencias. Con `--pending-deprecation`, se produce una advertencia de tiempo de ejecución sin importar dónde ocurra el uso de `Buffer()`.


### DEP0006: `child_process` `options.customFds` {#dep0006-child_process-optionscustomfds}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Fin de vida útil. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.11.14 | Obsolescencia en tiempo de ejecución. |
| v0.5.10 | Obsolescencia solo de documentación. |
:::

Tipo: Fin de vida útil

Dentro de los métodos `spawn()`, `fork()` y `exec()` del módulo [`child_process`](/es/nodejs/api/child_process), la opción `options.customFds` está obsoleta. En su lugar, se debe utilizar la opción `options.stdio`.

### DEP0007: Reemplace `cluster` `worker.suicide` con `worker.exitedAfterDisconnect` {#dep0007-replace-cluster-workersuicide-with-workerexitedafterdisconnect}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.0.0 | Fin de vida útil. |
| v7.0.0 | Obsolescencia en tiempo de ejecución. |
| v6.12.0 | Se ha asignado un código de obsolescencia. |
| v6.0.0 | Obsolescencia solo de documentación. |
:::

Tipo: Fin de vida útil

En una versión anterior del `cluster` de Node.js, se añadió una propiedad booleana con el nombre `suicide` al objeto `Worker`. La intención de esta propiedad era proporcionar una indicación de cómo y por qué salió la instancia `Worker`. En Node.js 6.0.0, la propiedad antigua se consideró obsoleta y se sustituyó por una nueva propiedad [`worker.exitedAfterDisconnect`](/es/nodejs/api/cluster#workerexitedafterdisconnect). El nombre de la propiedad antigua no describía con precisión la semántica real y estaba innecesariamente cargado de emoción.

### DEP0008: `require('node:constants')` {#dep0008-requirenodeconstants}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.12.0 | Se ha asignado un código de obsolescencia. |
| v6.3.0 | Obsolescencia solo de documentación. |
:::

Tipo: Solo documentación

El módulo `node:constants` está obsoleto. Cuando se requiere acceso a constantes relevantes para módulos integrados específicos de Node.js, los desarrolladores deben consultar la propiedad `constants` expuesta por el módulo correspondiente. Por ejemplo, `require('node:fs').constants` y `require('node:os').constants`.

### DEP0009: `crypto.pbkdf2` sin digest {#dep0009-cryptopbkdf2-without-digest}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | Fin de vida útil (para `digest === null`). |
| v11.0.0 | Obsolescencia en tiempo de ejecución (para `digest === null`). |
| v8.0.0 | Fin de vida útil (para `digest === undefined`). |
| v6.12.0 | Se ha asignado un código de obsolescencia. |
| v6.0.0 | Obsolescencia en tiempo de ejecución (para `digest === undefined`). |
:::

Tipo: Fin de vida útil

El uso de la API [`crypto.pbkdf2()`](/es/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) sin especificar un digest quedó obsoleto en Node.js 6.0 porque el método predeterminaba el uso del digest `'SHA1'`, que no se recomienda. Anteriormente, se imprimía una advertencia de obsolescencia. A partir de Node.js 8.0.0, llamar a `crypto.pbkdf2()` o `crypto.pbkdf2Sync()` con `digest` establecido en `undefined` lanzará un `TypeError`.

A partir de Node.js v11.0.0, llamar a estas funciones con `digest` establecido en `null` imprimiría una advertencia de obsolescencia para alinearse con el comportamiento cuando `digest` es `undefined`.

Ahora, sin embargo, pasar `undefined` o `null` lanzará un `TypeError`.


### DEP0010: `crypto.createCredentials` {#dep0010-cryptocreatecredentials}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.0.0 | Fin de vida útil. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.11.13 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

La API `crypto.createCredentials()` fue eliminada. Por favor, use [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions) en su lugar.

### DEP0011: `crypto.Credentials` {#dep0011-cryptocredentials}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.0.0 | Fin de vida útil. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.11.13 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

La clase `crypto.Credentials` fue eliminada. Por favor, use [`tls.SecureContext`](/es/nodejs/api/tls#tlscreatesecurecontextoptions) en su lugar.

### DEP0012: `Domain.dispose` {#dep0012-domaindispose}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.0.0 | Fin de vida útil. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.11.7 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`Domain.dispose()` ha sido eliminada. Recupérese de acciones de E/S fallidas explícitamente a través de controladores de eventos de error establecidos en el dominio en su lugar.

### DEP0013: Función asíncrona `fs` sin callback {#dep0013-fs-asynchronous-function-without-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Fin de vida útil. |
| v7.0.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

Llamar a una función asíncrona sin un callback lanza un `TypeError` en Node.js 10.0.0 en adelante. Vea [https://github.com/nodejs/node/pull/12562](https://github.com/nodejs/node/pull/12562).

### DEP0014: Interfaz String heredada de `fs.read` {#dep0014-fsread-legacy-string-interface}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | Fin de vida útil. |
| v6.0.0 | Obsolescencia en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.1.96 | Obsolescencia solo en la documentación. |
:::

Tipo: Fin de vida útil

La interfaz `String` heredada de [`fs.read()`](/es/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) está obsoleta. Use la API `Buffer` como se menciona en la documentación en su lugar.

### DEP0015: Interfaz String heredada de `fs.readSync` {#dep0015-fsreadsync-legacy-string-interface}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | Fin de vida útil. |
| v6.0.0 | Obsolescencia en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.1.96 | Obsolescencia solo en la documentación. |
:::

Tipo: Fin de vida útil

La interfaz `String` heredada de [`fs.readSync()`](/es/nodejs/api/fs#fsreadsyncfd-buffer-offset-length-position) está obsoleta. Use la API `Buffer` como se menciona en la documentación en su lugar.


### DEP0016: `GLOBAL`/`root` {#dep0016-global/root}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | Fin de vida útil. |
| v6.12.0 | Se ha asignado un código de obsolescencia. |
| v6.0.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

Los alias `GLOBAL` y `root` para la propiedad `global` quedaron obsoletos en Node.js 6.0.0 y desde entonces se han eliminado.

### DEP0017: `Intl.v8BreakIterator` {#dep0017-intlv8breakiterator}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.0.0 | Fin de vida útil. |
| v7.0.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`Intl.v8BreakIterator` era una extensión no estándar y se ha eliminado. Ver [`Intl.Segmenter`](https://github.com/tc39/proposal-intl-segmenter).

### DEP0018: Rechazos de promesa no manejados {#dep0018-unhandled-promise-rejections}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Fin de vida útil. |
| v7.0.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

Los rechazos de promesa no manejados están obsoletos. De forma predeterminada, los rechazos de promesa que no se manejan terminan el proceso de Node.js con un código de salida distinto de cero. Para cambiar la forma en que Node.js trata los rechazos no manejados, use la opción de línea de comandos [`--unhandled-rejections`](/es/nodejs/api/cli#--unhandled-rejectionsmode).

### DEP0019: `require('.')` resuelto fuera del directorio {#dep0019-require-resolved-outside-directory}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Funcionalidad eliminada. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v1.8.1 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

En ciertos casos, `require('.')` podría resolverse fuera del directorio del paquete. Este comportamiento ha sido eliminado.

### DEP0020: `Server.connections` {#dep0020-serverconnections}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Server.connections ha sido eliminado. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.9.7 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

La propiedad `Server.connections` quedó obsoleta en Node.js v0.9.7 y se ha eliminado. Utilice el método [`Server.getConnections()`](/es/nodejs/api/net#servergetconnectionscallback) en su lugar.

### DEP0021: `Server.listenFD` {#dep0021-serverlistenfd}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Fin de vida útil. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.7.12 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

El método `Server.listenFD()` quedó obsoleto y se eliminó. Utilice [`Server.listen({fd: \<number\>})`](/es/nodejs/api/net#serverlistenhandle-backlog-callback) en su lugar.


### DEP0022: `os.tmpDir()` {#dep0022-ostmpdir}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | Fin de vida útil. |
| v7.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

La API `os.tmpDir()` quedó obsoleta en Node.js 7.0.0 y desde entonces ha sido eliminada. Por favor, use [`os.tmpdir()`](/es/nodejs/api/os#ostmpdir) en su lugar.

### DEP0023: `os.getNetworkInterfaces()` {#dep0023-osgetnetworkinterfaces}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Fin de vida útil. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.6.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

El método `os.getNetworkInterfaces()` está obsoleto. Por favor, use el método [`os.networkInterfaces()`](/es/nodejs/api/os#osnetworkinterfaces) en su lugar.

### DEP0024: `REPLServer.prototype.convertToContext()` {#dep0024-replserverprototypeconverttocontext}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.0.0 | Fin de vida útil. |
| v7.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

La API `REPLServer.prototype.convertToContext()` ha sido eliminada.

### DEP0025: `require('node:sys')` {#dep0025-requirenodesys}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v1.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

El módulo `node:sys` está obsoleto. Por favor, use el módulo [`util`](/es/nodejs/api/util) en su lugar.

### DEP0026: `util.print()` {#dep0026-utilprint}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Fin de vida útil. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.11.3 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`util.print()` ha sido eliminado. Por favor, use [`console.log()`](/es/nodejs/api/console#consolelogdata-args) en su lugar.

### DEP0027: `util.puts()` {#dep0027-utilputs}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Fin de vida útil. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.11.3 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`util.puts()` ha sido eliminado. Por favor, use [`console.log()`](/es/nodejs/api/console#consolelogdata-args) en su lugar.

### DEP0028: `util.debug()` {#dep0028-utildebug}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Fin de vida útil. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.11.3 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`util.debug()` ha sido eliminado. Por favor, use [`console.error()`](/es/nodejs/api/console#consoleerrordata-args) en su lugar.


### DEP0029: `util.error()` {#dep0029-utilerror}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Fin de vida útil. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.11.3 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`util.error()` ha sido eliminado. Por favor, utilice [`console.error()`](/es/nodejs/api/console#consoleerrordata-args) en su lugar.

### DEP0030: `SlowBuffer` {#dep0030-slowbuffer}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.12.0 | Se ha asignado un código de obsolescencia. |
| v6.0.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Solo en la documentación

La clase [`SlowBuffer`](/es/nodejs/api/buffer#class-slowbuffer) está obsoleta. Por favor, utilice [`Buffer.allocUnsafeSlow(size)`](/es/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) en su lugar.

### DEP0031: `ecdh.setPublicKey()` {#dep0031-ecdhsetpublickey}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.12.0 | Se ha asignado un código de obsolescencia. |
| v5.2.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Solo en la documentación

El método [`ecdh.setPublicKey()`](/es/nodejs/api/crypto#ecdhsetpublickeypublickey-encoding) ahora está obsoleto ya que su inclusión en la API no es útil.

### DEP0032: Módulo `node:domain` {#dep0032-nodedomain-module}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v1.4.2 | Obsolescencia solo en la documentación. |
:::

Tipo: Solo en la documentación

El módulo [`domain`](/es/nodejs/api/domain) está obsoleto y no debe utilizarse.

### DEP0033: `EventEmitter.listenerCount()` {#dep0033-eventemitterlistenercount}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v3.2.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Solo en la documentación

La API [`events.listenerCount(emitter, eventName)`](/es/nodejs/api/events#eventslistenercountemitter-eventname) está obsoleta. Por favor, utilice [`emitter.listenerCount(eventName)`](/es/nodejs/api/events#emitterlistenercounteventname-listener) en su lugar.

### DEP0034: `fs.exists(path, callback)` {#dep0034-fsexistspath-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v1.0.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Solo en la documentación

La API [`fs.exists(path, callback)`](/es/nodejs/api/fs#fsexistspath-callback) está obsoleta. Por favor, utilice [`fs.stat()`](/es/nodejs/api/fs#fsstatpath-options-callback) o [`fs.access()`](/es/nodejs/api/fs#fsaccesspath-mode-callback) en su lugar.


### DEP0035: `fs.lchmod(path, mode, callback)` {#dep0035-fslchmodpath-mode-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.4.7 | Obsoleto solo en documentación. |
:::

Tipo: Solo en documentación

La API [`fs.lchmod(path, mode, callback)`](/es/nodejs/api/fs#fslchmodpath-mode-callback) está obsoleta.

### DEP0036: `fs.lchmodSync(path, mode)` {#dep0036-fslchmodsyncpath-mode}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.4.7 | Obsoleto solo en documentación. |
:::

Tipo: Solo en documentación

La API [`fs.lchmodSync(path, mode)`](/es/nodejs/api/fs#fslchmodsyncpath-mode) está obsoleta.

### DEP0037: `fs.lchown(path, uid, gid, callback)` {#dep0037-fslchownpath-uid-gid-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.6.0 | Obsolecencia revocada. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.4.7 | Obsoleto solo en documentación. |
:::

Tipo: Obsolecencia revocada

La API [`fs.lchown(path, uid, gid, callback)`](/es/nodejs/api/fs#fslchownpath-uid-gid-callback) estaba obsoleta. La obsolescencia fue revocada porque las API de soporte necesarias fueron agregadas en libuv.

### DEP0038: `fs.lchownSync(path, uid, gid)` {#dep0038-fslchownsyncpath-uid-gid}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.6.0 | Obsolecencia revocada. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.4.7 | Obsoleto solo en documentación. |
:::

Tipo: Obsolecencia revocada

La API [`fs.lchownSync(path, uid, gid)`](/es/nodejs/api/fs#fslchownsyncpath-uid-gid) estaba obsoleta. La obsolescencia fue revocada porque las API de soporte necesarias fueron agregadas en libuv.

### DEP0039: `require.extensions` {#dep0039-requireextensions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.10.6 | Obsoleto solo en documentación. |
:::

Tipo: Solo en documentación

La propiedad [`require.extensions`](/es/nodejs/api/modules#requireextensions) está obsoleta.

### DEP0040: módulo `node:punycode` {#dep0040-nodepunycode-module}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0 | Obsolecencia en tiempo de ejecución. |
| v16.6.0 | Se añadió soporte para `--pending-deprecation`. |
| v7.0.0 | Obsoleto solo en documentación. |
:::

Tipo: Tiempo de ejecución

El módulo [`punycode`](/es/nodejs/api/punycode) está obsoleto. Por favor, use una alternativa userland en su lugar.


### DEP0041: Variable de entorno `NODE_REPL_HISTORY_FILE` {#dep0041-node_repl_history_file-environment-variable}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Fin de vida útil. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v3.0.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Fin de vida útil

Se eliminó la variable de entorno `NODE_REPL_HISTORY_FILE`. Por favor, use `NODE_REPL_HISTORY` en su lugar.

### DEP0042: `tls.CryptoStream` {#dep0042-tlscryptostream}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Fin de vida útil. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v0.11.3 | Obsolescencia solo en la documentación. |
:::

Tipo: Fin de vida útil

Se eliminó la clase [`tls.CryptoStream`](/es/nodejs/api/tls#class-tlscryptostream). Por favor, use [`tls.TLSSocket`](/es/nodejs/api/tls#class-tlstlssocket) en su lugar.

### DEP0043: `tls.SecurePair` {#dep0043-tlssecurepair}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | Obsolescencia en tiempo de ejecución. |
| v6.12.0 | Se ha asignado un código de obsolescencia. |
| v6.0.0 | Obsolescencia solo en la documentación. |
| v0.11.15 | Obsolescencia revocada. |
| v0.11.3 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Solo en la documentación

La clase [`tls.SecurePair`](/es/nodejs/api/tls#class-tlssecurepair) está obsoleta. Por favor, use [`tls.TLSSocket`](/es/nodejs/api/tls#class-tlstlssocket) en su lugar.

### DEP0044: `util.isArray()` {#dep0044-utilisarray}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0 | Obsolescencia en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v4.0.0, v3.3.1 | Obsolescencia solo en la documentación. |
:::

Tipo: Tiempo de ejecución

La API [`util.isArray()`](/es/nodejs/api/util#utilisarrayobject) está obsoleta. Por favor, use `Array.isArray()` en su lugar.

### DEP0045: `util.isBoolean()` {#dep0045-utilisboolean}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Obsolescencia de fin de vida útil. |
| v22.0.0 | Obsolescencia en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v4.0.0, v3.3.1 | Obsolescencia solo en la documentación. |
:::

Tipo: Fin de vida útil

Se ha eliminado la API `util.isBoolean()`. Por favor, use `typeof arg === 'boolean'` en su lugar.

### DEP0046: `util.isBuffer()` {#dep0046-utilisbuffer}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Obsolescencia de fin de vida útil. |
| v22.0.0 | Obsolescencia en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v4.0.0, v3.3.1 | Obsolescencia solo en la documentación. |
:::

Tipo: Fin de vida útil

Se ha eliminado la API `util.isBuffer()`. Por favor, use [`Buffer.isBuffer()`](/es/nodejs/api/buffer#static-method-bufferisbufferobj) en su lugar.


### DEP0047: `util.isDate()` {#dep0047-utilisdate}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Desaprobación de fin de vida útil. |
| v22.0.0 | Desaprobación en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de desaprobación. |
| v4.0.0, v3.3.1 | Desaprobación solo de documentación. |
:::

Tipo: Fin de vida útil

La API `util.isDate()` ha sido eliminada. Por favor, use `arg instanceof Date` en su lugar.

### DEP0048: `util.isError()` {#dep0048-utiliserror}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Desaprobación de fin de vida útil. |
| v22.0.0 | Desaprobación en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de desaprobación. |
| v4.0.0, v3.3.1 | Desaprobación solo de documentación. |
:::

Tipo: Fin de vida útil

La API `util.isError()` ha sido eliminada. Por favor, use `Object.prototype.toString(arg) === '[object Error]' || arg instanceof Error` en su lugar.

### DEP0049: `util.isFunction()` {#dep0049-utilisfunction}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Desaprobación de fin de vida útil. |
| v22.0.0 | Desaprobación en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de desaprobación. |
| v4.0.0, v3.3.1 | Desaprobación solo de documentación. |
:::

Tipo: Fin de vida útil

La API `util.isFunction()` ha sido eliminada. Por favor, use `typeof arg === 'function'` en su lugar.

### DEP0050: `util.isNull()` {#dep0050-utilisnull}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Desaprobación de fin de vida útil. |
| v22.0.0 | Desaprobación en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de desaprobación. |
| v4.0.0, v3.3.1 | Desaprobación solo de documentación. |
:::

Tipo: Fin de vida útil

La API `util.isNull()` ha sido eliminada. Por favor, use `arg === null` en su lugar.

### DEP0051: `util.isNullOrUndefined()` {#dep0051-utilisnullorundefined}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Desaprobación de fin de vida útil. |
| v22.0.0 | Desaprobación en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de desaprobación. |
| v4.0.0, v3.3.1 | Desaprobación solo de documentación. |
:::

Tipo: Fin de vida útil

La API `util.isNullOrUndefined()` ha sido eliminada. Por favor, use `arg === null || arg === undefined` en su lugar.


### DEP0052: `util.isNumber()` {#dep0052-utilisnumber}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Desaprobación de fin de vida útil. |
| v22.0.0 | Desaprobación en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de desaprobación. |
| v4.0.0, v3.3.1 | Desaprobación solo de documentación. |
:::

Tipo: Fin de vida útil

La API `util.isNumber()` ha sido eliminada. Por favor, utilice `typeof arg === 'number'` en su lugar.

### DEP0053: `util.isObject()` {#dep0053-utilisobject}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Desaprobación de fin de vida útil. |
| v22.0.0 | Desaprobación en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de desaprobación. |
| v4.0.0, v3.3.1 | Desaprobación solo de documentación. |
:::

Tipo: Fin de vida útil

La API `util.isObject()` ha sido eliminada. Por favor, utilice `arg && typeof arg === 'object'` en su lugar.

### DEP0054: `util.isPrimitive()` {#dep0054-utilisprimitive}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Desaprobación de fin de vida útil. |
| v22.0.0 | Desaprobación en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de desaprobación. |
| v4.0.0, v3.3.1 | Desaprobación solo de documentación. |
:::

Tipo: Fin de vida útil

La API `util.isPrimitive()` ha sido eliminada. Por favor, utilice `arg === null || (typeof arg !=='object' && typeof arg !== 'function')` en su lugar.

### DEP0055: `util.isRegExp()` {#dep0055-utilisregexp}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Desaprobación de fin de vida útil. |
| v22.0.0 | Desaprobación en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de desaprobación. |
| v4.0.0, v3.3.1 | Desaprobación solo de documentación. |
:::

Tipo: Fin de vida útil

La API `util.isRegExp()` ha sido eliminada. Por favor, utilice `arg instanceof RegExp` en su lugar.

### DEP0056: `util.isString()` {#dep0056-utilisstring}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Desaprobación de fin de vida útil. |
| v22.0.0 | Desaprobación en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de desaprobación. |
| v4.0.0, v3.3.1 | Desaprobación solo de documentación. |
:::

Tipo: Fin de vida útil

La API `util.isString()` ha sido eliminada. Por favor, utilice `typeof arg === 'string'` en su lugar.


### DEP0057: `util.isSymbol()` {#dep0057-utilissymbol}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Deprecación de fin de vida útil. |
| v22.0.0 | Deprecación en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v4.0.0, v3.3.1 | Deprecación solo en la documentación. |
:::

Tipo: Fin de vida útil

La API `util.isSymbol()` ha sido eliminada. Por favor, use `typeof arg === 'symbol'` en su lugar.

### DEP0058: `util.isUndefined()` {#dep0058-utilisundefined}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Deprecación de fin de vida útil. |
| v22.0.0 | Deprecación en tiempo de ejecución. |
| v6.12.0, v4.8.6 | Se ha asignado un código de obsolescencia. |
| v4.0.0, v3.3.1 | Deprecación solo en la documentación. |
:::

Tipo: Fin de vida útil

La API `util.isUndefined()` ha sido eliminada. Por favor, use `arg === undefined` en su lugar.

### DEP0059: `util.log()` {#dep0059-utillog}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Deprecación de fin de vida útil. |
| v22.0.0 | Deprecación en tiempo de ejecución. |
| v6.12.0 | Se ha asignado un código de obsolescencia. |
| v6.0.0 | Deprecación solo en la documentación. |
:::

Tipo: Fin de vida útil

La API `util.log()` ha sido eliminada porque es una API heredada sin mantenimiento que se expuso al espacio de usuario por accidente. En su lugar, considere las siguientes alternativas según sus necesidades específicas:

-  **Librerías de registro de terceros**
-  **Use <code>console.log(new Date().toLocaleString(), message)</code>**

Al adoptar una de estas alternativas, puede alejarse de `util.log()` y elegir una estrategia de registro que se alinee con los requisitos específicos y la complejidad de su aplicación.

### DEP0060: `util._extend()` {#dep0060-util_extend}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0 | Deprecación en tiempo de ejecución. |
| v6.12.0 | Se ha asignado un código de obsolescencia. |
| v6.0.0 | Deprecación solo en la documentación. |
:::

Tipo: Tiempo de ejecución

La API [`util._extend()`](/es/nodejs/api/util#util_extendtarget-source) está obsoleta porque es una API heredada sin mantenimiento que se expuso al espacio de usuario por accidente. Por favor, use `target = Object.assign(target, source)` en su lugar.


### DEP0061: `fs.SyncWriteStream` {#dep0061-fssyncwritestream}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.0.0 | Fin de vida útil. |
| v8.0.0 | Obsoleto en tiempo de ejecución. |
| v7.0.0 | Obsoleto solo en la documentación. |
:::

Tipo: Fin de vida útil

La clase `fs.SyncWriteStream` nunca se pensó para ser una API accesible públicamente y ha sido eliminada. No hay una API alternativa disponible. Por favor, utilice una alternativa en espacio de usuario.

### DEP0062: `node --debug` {#dep0062-node---debug}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Fin de vida útil. |
| v8.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`--debug` activa la interfaz de depuración V8 heredada, que se eliminó a partir de V8 5.8. Se reemplaza por Inspector, que se activa con `--inspect` en su lugar.

### DEP0063: `ServerResponse.prototype.writeHeader()` {#dep0063-serverresponseprototypewriteheader}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | Obsoleto solo en la documentación. |
:::

Tipo: Solo en la documentación

La API `ServerResponse.prototype.writeHeader()` del módulo `node:http` está obsoleta. Por favor, utilice `ServerResponse.prototype.writeHead()` en su lugar.

El método `ServerResponse.prototype.writeHeader()` nunca se documentó como una API oficialmente compatible.

### DEP0064: `tls.createSecurePair()` {#dep0064-tlscreatesecurepair}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | Obsoleto en tiempo de ejecución. |
| v6.12.0 | Se ha asignado un código de obsolescencia. |
| v6.0.0 | Obsoleto solo en la documentación. |
| v0.11.15 | Obsolecencia revocada. |
| v0.11.3 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

La API `tls.createSecurePair()` se consideró obsoleta en la documentación en Node.js 0.11.3. Los usuarios deben usar `tls.Socket` en su lugar.

### DEP0065: `repl.REPL_MODE_MAGIC` y `NODE_REPL_MODE=magic` {#dep0065-replrepl_mode_magic-and-node_repl_mode=magic}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Fin de vida útil. |
| v8.0.0 | Obsoleto solo en la documentación. |
:::

Tipo: Fin de vida útil

La constante `REPL_MODE_MAGIC` del módulo `node:repl`, utilizada para la opción `replMode`, ha sido eliminada. Su comportamiento ha sido funcionalmente idéntico al de `REPL_MODE_SLOPPY` desde Node.js 6.0.0, cuando se importó V8 5.0. Por favor, utilice `REPL_MODE_SLOPPY` en su lugar.

La variable de entorno `NODE_REPL_MODE` se utiliza para establecer el `replMode` subyacente de una sesión interactiva de `node`. Su valor, `magic`, también se elimina. Por favor, utilice `sloppy` en su lugar.


### DEP0066: `OutgoingMessage.prototype._headers, OutgoingMessage.prototype._headerNames` {#dep0066-outgoingmessageprototype_headers-outgoingmessageprototype_headernames}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Obsoleto en tiempo de ejecución. |
| v8.0.0 | Obsoleto solo en la documentación. |
:::

Tipo: Tiempo de ejecución

Las propiedades `OutgoingMessage.prototype._headers` y `OutgoingMessage.prototype._headerNames` del módulo `node:http` están obsoletas. Utilice uno de los métodos públicos (p. ej., `OutgoingMessage.prototype.getHeader()`, `OutgoingMessage.prototype.getHeaders()`, `OutgoingMessage.prototype.getHeaderNames()`, `OutgoingMessage.prototype.getRawHeaderNames()`, `OutgoingMessage.prototype.hasHeader()`, `OutgoingMessage.prototype.removeHeader()`, `OutgoingMessage.prototype.setHeader()`) para trabajar con los encabezados salientes.

Las propiedades `OutgoingMessage.prototype._headers` y `OutgoingMessage.prototype._headerNames` nunca se documentaron como propiedades oficialmente compatibles.

### DEP0067: `OutgoingMessage.prototype._renderHeaders` {#dep0067-outgoingmessageprototype_renderheaders}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | Obsoleto solo en la documentación. |
:::

Tipo: Solo documentación

La API `OutgoingMessage.prototype._renderHeaders()` del módulo `node:http` está obsoleta.

La propiedad `OutgoingMessage.prototype._renderHeaders` nunca se documentó como una API oficialmente compatible.

### DEP0068: `node debug` {#dep0068-node-debug}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Se eliminó el comando heredado `node debug`. |
| v8.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`node debug` corresponde al depurador de CLI heredado que ha sido reemplazado con un depurador de CLI basado en V8-inspector disponible a través de `node inspect`.

### DEP0069: `vm.runInDebugContext(string)` {#dep0069-vmrunindebugcontextstring}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Fin de vida útil. |
| v9.0.0 | Obsoleto en tiempo de ejecución. |
| v8.0.0 | Obsoleto solo en la documentación. |
:::

Tipo: Fin de vida útil

DebugContext se ha eliminado en V8 y no está disponible en Node.js 10+.

DebugContext era una API experimental.

### DEP0070: `async_hooks.currentId()` {#dep0070-async_hookscurrentid}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.0.0 | Fin de vida útil. |
| v8.2.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`async_hooks.currentId()` se renombró a `async_hooks.executionAsyncId()` para mayor claridad.

Este cambio se realizó mientras que `async_hooks` era una API experimental.


### DEP0071: `async_hooks.triggerId()` {#dep0071-async_hookstriggerid}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v9.0.0 | Fin de vida útil. |
| v8.2.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`async_hooks.triggerId()` se renombró a `async_hooks.triggerAsyncId()` para mayor claridad.

Este cambio se realizó mientras `async_hooks` era una API experimental.

### DEP0072: `async_hooks.AsyncResource.triggerId()` {#dep0072-async_hooksasyncresourcetriggerid}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v9.0.0 | Fin de vida útil. |
| v8.2.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`async_hooks.AsyncResource.triggerId()` se renombró a `async_hooks.AsyncResource.triggerAsyncId()` para mayor claridad.

Este cambio se realizó mientras `async_hooks` era una API experimental.

### DEP0073: Varias propiedades internas de `net.Server` {#dep0073-several-internal-properties-of-netserver}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Fin de vida útil. |
| v9.0.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

El acceso a varias propiedades internas no documentadas de las instancias de `net.Server` con nombres inapropiados está desaprobado.

Como la API original no estaba documentada y no era generalmente útil para el código no interno, no se proporciona ninguna API de reemplazo.

### DEP0074: `REPLServer.bufferedCommand` {#dep0074-replserverbufferedcommand}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Fin de vida útil. |
| v9.0.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

La propiedad `REPLServer.bufferedCommand` se desaprobó en favor de [`REPLServer.clearBufferedCommand()`](/es/nodejs/api/repl#replserverclearbufferedcommand).

### DEP0075: `REPLServer.parseREPLKeyword()` {#dep0075-replserverparsereplkeyword}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Fin de vida útil. |
| v9.0.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`REPLServer.parseREPLKeyword()` se eliminó de la visibilidad del espacio de usuario.

### DEP0076: `tls.parseCertString()` {#dep0076-tlsparsecertstring}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Fin de vida útil. |
| v9.0.0 | Desaprobación en tiempo de ejecución. |
| v8.6.0 | Desaprobación solo en la documentación. |
:::

Tipo: Fin de vida útil

`tls.parseCertString()` era una ayuda de análisis trivial que se hizo pública por error. Si bien se suponía que debía analizar las cadenas de sujeto y emisor del certificado, nunca manejó correctamente los Nombres Distinguidos Relativos de valores múltiples.

Las versiones anteriores de este documento sugerían usar `querystring.parse()` como una alternativa a `tls.parseCertString()`. Sin embargo, `querystring.parse()` tampoco maneja correctamente todos los sujetos del certificado y no debe usarse.


### DEP0077: `Module._debug()` {#dep0077-module_debug}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v9.0.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

`Module._debug()` está desaprobado.

La función `Module._debug()` nunca se documentó como una API oficialmente compatible.

### DEP0078: `REPLServer.turnOffEditorMode()` {#dep0078-replserverturnoffeditormode}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Fin de vida útil. |
| v9.0.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`REPLServer.turnOffEditorMode()` se eliminó de la visibilidad del espacio de usuario.

### DEP0079: Función de inspección personalizada en objetos a través de `.inspect()` {#dep0079-custom-inspection-function-on-objects-via-inspect}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v11.0.0 | Fin de vida útil. |
| v10.0.0 | Desaprobación en tiempo de ejecución. |
| v8.7.0 | Desaprobación solo de documentación. |
:::

Tipo: Fin de vida útil

El uso de una propiedad llamada `inspect` en un objeto para especificar una función de inspección personalizada para [`util.inspect()`](/es/nodejs/api/util#utilinspectobject-options) está desaprobado. Utilice [`util.inspect.custom`](/es/nodejs/api/util#utilinspectcustom) en su lugar. Para la compatibilidad con versiones anteriores de Node.js anteriores a la versión 6.4.0, se pueden especificar ambos.

### DEP0080: `path._makeLong()` {#dep0080-path_makelong}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v9.0.0 | Desaprobación solo de documentación. |
:::

Tipo: Solo documentación

El `path._makeLong()` interno no estaba destinado al uso público. Sin embargo, los módulos del espacio de usuario lo han encontrado útil. La API interna está obsoleta y se reemplaza con un método `path.toNamespacedPath()` público e idéntico.

### DEP0081: `fs.truncate()` usando un descriptor de archivo {#dep0081-fstruncate-using-a-file-descriptor}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v9.0.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

El uso de `fs.truncate()` `fs.truncateSync()` con un descriptor de archivo está desaprobado. Utilice `fs.ftruncate()` o `fs.ftruncateSync()` para trabajar con descriptores de archivos.

### DEP0082: `REPLServer.prototype.memory()` {#dep0082-replserverprototypememory}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Fin de vida útil. |
| v9.0.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`REPLServer.prototype.memory()` solo es necesario para la mecánica interna del propio `REPLServer`. No utilice esta función.


### DEP0083: Desactivación de ECDH estableciendo `ecdhCurve` en `false` {#dep0083-disabling-ecdh-by-setting-ecdhcurve-to-false}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Fin de ciclo de vida. |
| v9.2.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de ciclo de vida.

La opción `ecdhCurve` para `tls.createSecureContext()` y `tls.TLSSocket` podía establecerse en `false` para desactivar ECDH por completo solo en el servidor. Este modo quedó obsoleto en preparación para la migración a OpenSSL 1.1.0 y la coherencia con el cliente y ahora no es compatible. Utilice el parámetro `ciphers` en su lugar.

### DEP0084: Requerir dependencias internas agrupadas {#dep0084-requiring-bundled-internal-dependencies}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Esta funcionalidad ha sido eliminada. |
| v10.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de ciclo de vida

Desde las versiones 4.4.0 y 5.2.0 de Node.js, varios módulos destinados únicamente para uso interno fueron expuestos erróneamente al código de usuario a través de `require()`. Estos módulos fueron:

- `v8/tools/codemap`
- `v8/tools/consarray`
- `v8/tools/csvparser`
- `v8/tools/logreader`
- `v8/tools/profile_view`
- `v8/tools/profile`
- `v8/tools/SourceMap`
- `v8/tools/splaytree`
- `v8/tools/tickprocessor-driver`
- `v8/tools/tickprocessor`
- `node-inspect/lib/_inspect` (desde 7.6.0)
- `node-inspect/lib/internal/inspect_client` (desde 7.6.0)
- `node-inspect/lib/internal/inspect_repl` (desde 7.6.0)

Los módulos `v8/*` no tienen ninguna exportación y, si no se importan en un orden específico, de hecho, arrojarían errores. Como tal, prácticamente no existen casos de uso legítimos para importarlos a través de `require()`.

Por otro lado, `node-inspect` se puede instalar localmente a través de un administrador de paquetes, ya que se publica en el registro npm con el mismo nombre. No es necesaria ninguna modificación del código fuente si eso se hace.

### DEP0085: API sensible de AsyncHooks {#dep0085-asynchooks-sensitive-api}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Fin de ciclo de vida. |
| v9.4.0, v8.10.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de ciclo de vida

La API sensible de AsyncHooks nunca fue documentada y tuvo varios problemas menores. Utilice la API `AsyncResource` en su lugar. Consulte [https://github.com/nodejs/node/issues/15572](https://github.com/nodejs/node/issues/15572).


### DEP0086: Eliminar `runInAsyncIdScope` {#dep0086-remove-runinasyncidscope}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Fin de vida útil. |
| v9.4.0, v8.10.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`runInAsyncIdScope` no emite el evento `'before'` o `'after'` y, por lo tanto, puede causar muchos problemas. Ver [https://github.com/nodejs/node/issues/14328](https://github.com/nodejs/node/issues/14328).

### DEP0089: `require('node:assert')` {#dep0089-requirenodeassert}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.8.0 | Desaprobación revocada. |
| v9.9.0, v8.13.0 | Desaprobación solo en la documentación. |
:::

Tipo: Desaprobación revocada

No se recomendaba importar assert directamente, ya que las funciones expuestas utilizan verificaciones de igualdad flexibles. La desaprobación fue revocada porque no se desaconseja el uso del módulo `node:assert`, y la desaprobación causó confusión entre los desarrolladores.

### DEP0090: Longitudes de etiquetas de autenticación GCM no válidas {#dep0090-invalid-gcm-authentication-tag-lengths}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.0.0 | Fin de vida útil. |
| v10.0.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

Node.js solía admitir todas las longitudes de etiquetas de autenticación GCM que acepta OpenSSL al llamar a [`decipher.setAuthTag()`](/es/nodejs/api/crypto#deciphersetauthtagbuffer-encoding). A partir de Node.js v11.0.0, solo se permiten longitudes de etiquetas de autenticación de 128, 120, 112, 104, 96, 64 y 32 bits. Las etiquetas de autenticación de otras longitudes no son válidas según [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

### DEP0091: `crypto.DEFAULT_ENCODING` {#dep0091-cryptodefault_encoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | Fin de vida útil. |
| v10.0.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

La propiedad `crypto.DEFAULT_ENCODING` solo existía para la compatibilidad con versiones de Node.js anteriores a las versiones 0.9.3 y se ha eliminado.

### DEP0092: `this` de nivel superior enlazado a `module.exports` {#dep0092-top-level-this-bound-to-moduleexports}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Desaprobación solo en la documentación. |
:::

Tipo: Solo en la documentación

Asignar propiedades al `this` de nivel superior como alternativa a `module.exports` está obsoleto. Los desarrolladores deben usar `exports` o `module.exports` en su lugar.


### DEP0093: `crypto.fips` está obsoleto y ha sido reemplazado {#dep0093-cryptofips-is-deprecated-and-replaced}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Obsoleto en tiempo de ejecución. |
| v10.0.0 | Obsoleto solo en documentación. |
:::

Tipo: Tiempo de ejecución

La propiedad [`crypto.fips`](/es/nodejs/api/crypto#cryptofips) está obsoleta. Por favor, use `crypto.setFips()` y `crypto.getFips()` en su lugar.

### DEP0094: Usar `assert.fail()` con más de un argumento {#dep0094-using-assertfail-with-more-than-one-argument}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

Usar `assert.fail()` con más de un argumento está obsoleto. Use `assert.fail()` con solo un argumento o use un método diferente del módulo `node:assert`.

### DEP0095: `timers.enroll()` {#dep0095-timersenroll}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

`timers.enroll()` está obsoleto. Por favor, use los documentados públicamente [`setTimeout()`](/es/nodejs/api/timers#settimeoutcallback-delay-args) o [`setInterval()`](/es/nodejs/api/timers#setintervalcallback-delay-args) en su lugar.

### DEP0096: `timers.unenroll()` {#dep0096-timersunenroll}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

`timers.unenroll()` está obsoleto. Por favor, use los documentados públicamente [`clearTimeout()`](/es/nodejs/api/timers#cleartimeouttimeout) o [`clearInterval()`](/es/nodejs/api/timers#clearintervaltimeout) en su lugar.

### DEP0097: `MakeCallback` con la propiedad `domain` {#dep0097-makecallback-with-domain-property}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

Los usuarios de `MakeCallback` que añaden la propiedad `domain` para llevar el contexto, deberían empezar a usar la variante `async_context` de `MakeCallback` o `CallbackScope`, o la clase de alto nivel `AsyncResource`.

### DEP0098: APIs `AsyncResource.emitBefore` y `AsyncResource.emitAfter` para incrustar AsyncHooks {#dep0098-asynchooks-embedder-asyncresourceemitbefore-and-asyncresourceemitafter-apis}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Fin de vida. |
| v10.0.0, v9.6.0, v8.12.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de vida

La API incrustada proporcionada por AsyncHooks expone los métodos `.emitBefore()` y `.emitAfter()` que son muy fáciles de usar incorrectamente, lo que puede llevar a errores irrecuperables.

Use la API [`asyncResource.runInAsyncScope()`](/es/nodejs/api/async_context#asyncresourceruninasyncscopefn-thisarg-args) en su lugar, la cual proporciona una alternativa mucho más segura y conveniente. Vea [https://github.com/nodejs/node/pull/18513](https://github.com/nodejs/node/pull/18513).


### DEP0099: APIs C++ `node::MakeCallback` sin contexto asíncrono {#dep0099-async-context-unaware-nodemakecallback-c-apis}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Obsoleto en tiempo de compilación. |
:::

Tipo: Tiempo de compilación

Ciertas versiones de las API `node::MakeCallback` disponibles para complementos nativos están obsoletas. Utilice las versiones de la API que aceptan un parámetro `async_context`.

### DEP0100: `process.assert()` {#dep0100-processassert}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Fin de vida útil. |
| v10.0.0 | Obsoleto en tiempo de ejecución. |
| v0.3.7 | Obsoleto solo en la documentación. |
:::

Tipo: Fin de vida útil

`process.assert()` está obsoleto. Utilice el módulo [`assert`](/es/nodejs/api/assert) en su lugar.

Esta nunca fue una característica documentada.

### DEP0101: `--with-lttng` {#dep0101---with-lttng}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Fin de vida útil. |
:::

Tipo: Fin de vida útil

Se ha eliminado la opción de tiempo de compilación `--with-lttng`.

### DEP0102: Usar `noAssert` en operaciones `Buffer#(read|write)` {#dep0102-using-noassert-in-bufferread|write-operations}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Fin de vida útil. |
:::

Tipo: Fin de vida útil

El uso del argumento `noAssert` ya no tiene ninguna funcionalidad. Toda la entrada se verifica independientemente del valor de `noAssert`. Omitir la verificación podría provocar errores y bloqueos difíciles de encontrar.

### DEP0103: Comprobaciones de tipo `process.binding('util').is[...]` {#dep0103-processbindingutilis-typechecks}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.9.0 | Sustituido por [DEP0111](/es/nodejs/api/deprecations#DEP0111). |
| v10.0.0 | Obsoleto solo en la documentación. |
:::

Tipo: Solo documentación (admite [`--pending-deprecation`](/es/nodejs/api/cli#--pending-deprecation))

En general, se debe evitar el uso de `process.binding()`. Los métodos de verificación de tipo en particular se pueden reemplazar mediante el uso de [`util.types`](/es/nodejs/api/util#utiltypes).

Esta obsolescencia ha sido reemplazada por la obsolescencia de la API `process.binding()` ([DEP0111](/es/nodejs/api/deprecations#DEP0111)).

### DEP0104: Coerción de cadenas `process.env` {#dep0104-processenv-string-coercion}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Obsoleto solo en la documentación. |
:::

Tipo: Solo documentación (admite [`--pending-deprecation`](/es/nodejs/api/cli#--pending-deprecation))

Al asignar una propiedad que no es una cadena a [`process.env`](/es/nodejs/api/process#processenv), el valor asignado se convierte implícitamente en una cadena. Este comportamiento está en desuso si el valor asignado no es una cadena, booleano o número. En el futuro, tal asignación podría resultar en un error arrojado. Convierta la propiedad a una cadena antes de asignarla a `process.env`.


### DEP0105: `decipher.finaltol` {#dep0105-decipherfinaltol}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.0.0 | Fin de vida útil. |
| v10.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`decipher.finaltol()` nunca ha sido documentado y era un alias para [`decipher.final()`](/es/nodejs/api/crypto#decipherfinaloutputencoding). Esta API ha sido eliminada, y se recomienda usar [`decipher.final()`](/es/nodejs/api/crypto#decipherfinaloutputencoding) en su lugar.

### DEP0106: `crypto.createCipher` y `crypto.createDecipher` {#dep0106-cryptocreatecipher-and-cryptocreatedecipher}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0 | Fin de vida útil. |
| v11.0.0 | Obsoleto en tiempo de ejecución. |
| v10.0.0 | Obsoleto solo en la documentación. |
:::

Tipo: Fin de vida útil

`crypto.createCipher()` y `crypto.createDecipher()` han sido eliminados ya que usan una función de derivación de clave débil (MD5 sin salt) y vectores de inicialización estáticos. Se recomienda derivar una clave usando [`crypto.pbkdf2()`](/es/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) o [`crypto.scrypt()`](/es/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) con sales aleatorias y usar [`crypto.createCipheriv()`](/es/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) y [`crypto.createDecipheriv()`](/es/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) para obtener los objetos [`Cipher`](/es/nodejs/api/crypto#class-cipher) y [`Decipher`](/es/nodejs/api/crypto#class-decipher) respectivamente.

### DEP0107: `tls.convertNPNProtocols()` {#dep0107-tlsconvertnpnprotocols}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.0.0 | Fin de vida útil. |
| v10.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

Esta era una función auxiliar no documentada no destinada a ser utilizada fuera del núcleo de Node.js y quedó obsoleta por la eliminación del soporte de NPN (Negociación de Protocolo Siguiente).

### DEP0108: `zlib.bytesRead` {#dep0108-zlibbytesread}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Fin de vida útil. |
| v11.0.0 | Obsoleto en tiempo de ejecución. |
| v10.0.0 | Obsoleto solo en la documentación. |
:::

Tipo: Fin de vida útil

Alias obsoleto para [`zlib.bytesWritten`](/es/nodejs/api/zlib#zlibbyteswritten). Este nombre original fue elegido porque también tenía sentido interpretar el valor como el número de bytes leídos por el motor, pero es inconsistente con otros streams en Node.js que exponen valores con estos nombres.


### DEP0109: Soporte de `http`, `https` y `tls` para URLs inválidas {#dep0109-http-https-and-tls-support-for-invalid-urls}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Fin de vida útil. |
| v11.0.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

Algunas URLs previamente admitidas (pero estrictamente inválidas) fueron aceptadas a través de las APIs [`http.request()`](/es/nodejs/api/http#httprequestoptions-callback), [`http.get()`](/es/nodejs/api/http#httpgetoptions-callback), [`https.request()`](/es/nodejs/api/https#httpsrequestoptions-callback), [`https.get()`](/es/nodejs/api/https#httpsgetoptions-callback) y [`tls.checkServerIdentity()`](/es/nodejs/api/tls#tlscheckserveridentityhostname-cert) porque fueron aceptadas por la API `url.parse()` heredada. Las APIs mencionadas ahora utilizan el analizador de URL WHATWG que requiere URLs estrictamente válidas. Pasar una URL inválida está obsoleto y el soporte se eliminará en el futuro.

### DEP0110: Datos en caché de `vm.Script` {#dep0110-vmscript-cached-data}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.6.0 | Desaprobación solo en la documentación. |
:::

Tipo: Solo en la documentación

La opción `produceCachedData` está obsoleta. Utilice [`script.createCachedData()`](/es/nodejs/api/vm#scriptcreatecacheddata) en su lugar.

### DEP0111: `process.binding()` {#dep0111-processbinding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.12.0 | Se añadió soporte para `--pending-deprecation`. |
| v10.9.0 | Desaprobación solo en la documentación. |
:::

Tipo: Solo en la documentación (admite [`--pending-deprecation`](/es/nodejs/api/cli#--pending-deprecation))

`process.binding()` es solo para uso del código interno de Node.js.

Si bien `process.binding()` no ha alcanzado el estado de Fin de vida útil en general, no está disponible cuando el [modelo de permisos](/es/nodejs/api/permissions#permission-model) está habilitado.

### DEP0112: APIs privadas de `dgram` {#dep0112-dgram-private-apis}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.0.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

El módulo `node:dgram` contenía anteriormente varias APIs que nunca fueron diseñadas para ser accedidas fuera del núcleo de Node.js: `Socket.prototype._handle`, `Socket.prototype._receiving`, `Socket.prototype._bindState`, `Socket.prototype._queue`, `Socket.prototype._reuseAddr`, `Socket.prototype._healthCheck()`, `Socket.prototype._stopReceiving()` y `dgram._createSocketHandle()`.


### DEP0113: `Cipher.setAuthTag()`, `Decipher.getAuthTag()` {#dep0113-ciphersetauthtag-deciphergetauthtag}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Fin de vida útil. |
| v11.0.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

`Cipher.setAuthTag()` y `Decipher.getAuthTag()` ya no están disponibles. Nunca fueron documentados y generarían un error al ser llamados.

### DEP0114: `crypto._toBuf()` {#dep0114-crypto_tobuf}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Fin de vida útil. |
| v11.0.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

La función `crypto._toBuf()` no fue diseñada para ser utilizada por módulos fuera del núcleo de Node.js y fue eliminada.

### DEP0115: `crypto.prng()`, `crypto.pseudoRandomBytes()`, `crypto.rng()` {#dep0115-cryptoprng-cryptopseudorandombytes-cryptorng}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.0.0 | Se agregó la obsolescencia solo de documentación con soporte para `--pending-deprecation`. |
:::

Tipo: Solo documentación (soporta [`--pending-deprecation`](/es/nodejs/api/cli#--pending-deprecation))

En versiones recientes de Node.js, no hay diferencia entre [`crypto.randomBytes()`](/es/nodejs/api/crypto#cryptorandombytessize-callback) y `crypto.pseudoRandomBytes()`. Este último está obsoleto junto con los alias no documentados `crypto.prng()` y `crypto.rng()` en favor de [`crypto.randomBytes()`](/es/nodejs/api/crypto#cryptorandombytessize-callback) y podría ser eliminado en una versión futura.

### DEP0116: API de URL heredada {#dep0116-legacy-url-api}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0, v18.13.0 | `url.parse()` está obsoleto nuevamente en DEP0169. |
| v15.13.0, v14.17.0 | Obsolescencia revocada. El estado cambió a "Heredado". |
| v11.0.0 | Obsolescencia solo de documentación. |
:::

Tipo: Obsolescencia revocada

La [API de URL heredada](/es/nodejs/api/url#legacy-url-api) está obsoleta. Esto incluye [`url.format()`](/es/nodejs/api/url#urlformaturlobject), [`url.parse()`](/es/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost), [`url.resolve()`](/es/nodejs/api/url#urlresolvefrom-to), y el [`urlObject`](/es/nodejs/api/url#legacy-urlobject) heredado. Por favor, utilice la [API de URL WHATWG](/es/nodejs/api/url#the-whatwg-url-api) en su lugar.


### DEP0117: Controladores criptográficos nativos {#dep0117-native-crypto-handles}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Fin de vida útil. |
| v11.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

Las versiones anteriores de Node.js exponían controladores a objetos nativos internos a través de la propiedad `_handle` de las clases `Cipher`, `Decipher`, `DiffieHellman`, `DiffieHellmanGroup`, `ECDH`, `Hash`, `Hmac`, `Sign` y `Verify`. La propiedad `_handle` se ha eliminado porque el uso inadecuado del objeto nativo puede provocar el bloqueo de la aplicación.

### DEP0118: Soporte de `dns.lookup()` para un nombre de host falsy {#dep0118-dnslookup-support-for-a-falsy-host-name}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

Las versiones anteriores de Node.js admitían `dns.lookup()` con un nombre de host falsy como `dns.lookup(false)` debido a la compatibilidad con versiones anteriores. Este comportamiento no está documentado y se cree que no se utiliza en aplicaciones del mundo real. Se convertirá en un error en futuras versiones de Node.js.

### DEP0119: API privada `process.binding('uv').errname()` {#dep0119-processbindinguverrname-private-api}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.0.0 | Obsoleto solo en la documentación. |
:::

Tipo: Solo documentación (admite [`--pending-deprecation`](/es/nodejs/api/cli#--pending-deprecation))

`process.binding('uv').errname()` está obsoleto. Por favor, use [`util.getSystemErrorName()`](/es/nodejs/api/util#utilgetsystemerrornameerr) en su lugar.

### DEP0120: Soporte de contador de rendimiento de Windows {#dep0120-windows-performance-counter-support}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Fin de vida útil. |
| v11.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

El soporte del contador de rendimiento de Windows se ha eliminado de Node.js. Las funciones no documentadas `COUNTER_NET_SERVER_CONNECTION()`, `COUNTER_NET_SERVER_CONNECTION_CLOSE()`, `COUNTER_HTTP_SERVER_REQUEST()`, `COUNTER_HTTP_SERVER_RESPONSE()`, `COUNTER_HTTP_CLIENT_REQUEST()` y `COUNTER_HTTP_CLIENT_RESPONSE()` han quedado obsoletas.

### DEP0121: `net._setSimultaneousAccepts()` {#dep0121-net_setsimultaneousaccepts}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

La función no documentada `net._setSimultaneousAccepts()` fue originalmente pensada para la depuración y la optimización del rendimiento cuando se utilizan los módulos `node:child_process` y `node:cluster` en Windows. La función no es generalmente útil y se está eliminando. Vea la discusión aquí: [https://github.com/nodejs/node/issues/18391](https://github.com/nodejs/node/issues/18391)


### DEP0122: `tls` `Server.prototype.setOptions()` {#dep0122-tls-serverprototypesetoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

Por favor, utilice `Server.prototype.setSecureContext()` en su lugar.

### DEP0123: establecer el nombre del servidor TLS a una dirección IP {#dep0123-setting-the-tls-servername-to-an-ip-address}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

Establecer el nombre del servidor TLS a una dirección IP no está permitido por [RFC 6066](https://tools.ietf.org/html/rfc6066#section-3). Esto será ignorado en una versión futura.

### DEP0124: usando `REPLServer.rli` {#dep0124-using-replserverrli}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Fin de vida útil. |
| v12.0.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

Esta propiedad es una referencia a la propia instancia.

### DEP0125: `require('node:_stream_wrap')` {#dep0125-requirenode_stream_wrap}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

El módulo `node:_stream_wrap` está obsoleto.

### DEP0126: `timers.active()` {#dep0126-timersactive}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.14.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

El previamente indocumentado `timers.active()` está obsoleto. Por favor, utilice el [`timeout.refresh()`](/es/nodejs/api/timers#timeoutrefresh) documentado públicamente en su lugar. Si es necesario volver a referenciar el tiempo de espera, se puede utilizar [`timeout.ref()`](/es/nodejs/api/timers#timeoutref) sin impacto en el rendimiento desde Node.js 10.

### DEP0127: `timers._unrefActive()` {#dep0127-timers_unrefactive}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.14.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

El previamente indocumentado y "privado" `timers._unrefActive()` está obsoleto. Por favor, utilice el [`timeout.refresh()`](/es/nodejs/api/timers#timeoutrefresh) documentado públicamente en su lugar. Si es necesario eliminar la referencia al tiempo de espera, se puede utilizar [`timeout.unref()`](/es/nodejs/api/timers#timeoutunref) sin impacto en el rendimiento desde Node.js 10.

### DEP0128: módulos con una entrada `main` no válida y un archivo `index.js` {#dep0128-modules-with-an-invalid-main-entry-and-an-indexjs-file}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Obsolescencia en tiempo de ejecución. |
| v12.0.0 | Solo documentación. |
:::

Tipo: Tiempo de ejecución

Los módulos que tienen una entrada `main` no válida (por ejemplo, `./does-not-exist.js`) y también tienen un archivo `index.js` en el directorio de nivel superior resolverán el archivo `index.js`. Esto está obsoleto y va a lanzar un error en futuras versiones de Node.js.


### DEP0129: `ChildProcess._channel` {#dep0129-childprocess_channel}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v13.0.0 | Deprecación en tiempo de ejecución. |
| v11.14.0 | Solo documentación. |
:::

Tipo: Tiempo de ejecución

La propiedad `_channel` de los objetos de proceso hijo devueltos por `spawn()` y funciones similares no está destinada al uso público. Utilice `ChildProcess.channel` en su lugar.

### DEP0130: `Module.createRequireFromPath()` {#dep0130-modulecreaterequirefrompath}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Fin de vida útil. |
| v13.0.0 | Deprecación en tiempo de ejecución. |
| v12.2.0 | Solo documentación. |
:::

Tipo: Fin de vida útil

Utilice [`module.createRequire()`](/es/nodejs/api/module#modulecreaterequirefilename) en su lugar.

### DEP0131: Analizador HTTP heredado {#dep0131-legacy-http-parser}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v13.0.0 | Esta característica ha sido eliminada. |
| v12.22.0 | Deprecación en tiempo de ejecución. |
| v12.3.0 | Solo documentación. |
:::

Tipo: Fin de vida útil

El analizador HTTP heredado, utilizado de forma predeterminada en las versiones de Node.js anteriores a la 12.0.0, está obsoleto y se ha eliminado en la v13.0.0. Antes de la v13.0.0, se podía utilizar el indicador de línea de comandos `--http-parser=legacy` para volver a utilizar el analizador heredado.

### DEP0132: `worker.terminate()` con callback {#dep0132-workerterminate-with-callback}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v12.5.0 | Deprecación en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

Pasar un callback a [`worker.terminate()`](/es/nodejs/api/worker_threads#workerterminate) está obsoleto. Utilice la `Promise` devuelta en su lugar, o un listener para el evento `'exit'` del worker.

### DEP0133: `http` `connection` {#dep0133-http-connection}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v12.12.0 | Deprecación solo de documentación. |
:::

Tipo: Solo documentación

Prefiera [`response.socket`](/es/nodejs/api/http#responsesocket) sobre [`response.connection`](/es/nodejs/api/http#responseconnection) y [`request.socket`](/es/nodejs/api/http#requestsocket) sobre [`request.connection`](/es/nodejs/api/http#requestconnection).

### DEP0134: `process._tickCallback` {#dep0134-process_tickcallback}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v12.12.0 | Deprecación solo de documentación. |
:::

Tipo: Solo documentación (admite [`--pending-deprecation`](/es/nodejs/api/cli#--pending-deprecation))

La propiedad `process._tickCallback` nunca se documentó como una API oficialmente compatible.


### DEP0135: `WriteStream.open()` y `ReadStream.open()` son internas {#dep0135-writestreamopen-and-readstreamopen-are-internal}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.0.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

[`WriteStream.open()`](/es/nodejs/api/fs#class-fswritestream) y [`ReadStream.open()`](/es/nodejs/api/fs#class-fsreadstream) son APIs internas no documentadas que no tiene sentido usar en userland. Los flujos de archivos siempre deben abrirse a través de sus métodos de fábrica correspondientes [`fs.createWriteStream()`](/es/nodejs/api/fs#fscreatewritestreampath-options) y [`fs.createReadStream()`](/es/nodejs/api/fs#fscreatereadstreampath-options)) o pasando un descriptor de archivo en las opciones.

### DEP0136: `http` `finished` {#dep0136-http-finished}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.4.0, v12.16.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Solo documentación

[`response.finished`](/es/nodejs/api/http#responsefinished) indica si se ha llamado a [`response.end()`](/es/nodejs/api/http#responseenddata-encoding-callback), no si se ha emitido `'finish'` y se han vaciado los datos subyacentes.

Utilice [`response.writableFinished`](/es/nodejs/api/http#responsewritablefinished) o [`response.writableEnded`](/es/nodejs/api/http#responsewritableended) en su lugar para evitar la ambigüedad.

Para mantener el comportamiento existente, `response.finished` debe reemplazarse con `response.writableEnded`.

### DEP0137: Cerrar fs.FileHandle en la recolección de basura {#dep0137-closing-fsfilehandle-on-garbage-collection}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

Permitir que un objeto [`fs.FileHandle`](/es/nodejs/api/fs#class-filehandle) se cierre en la recolección de basura está obsoleto. En el futuro, hacerlo podría resultar en un error que terminará el proceso.

Asegúrese de que todos los objetos `fs.FileHandle` se cierren explícitamente utilizando `FileHandle.prototype.close()` cuando ya no se necesite el `fs.FileHandle`:

```js [ESM]
const fsPromises = require('node:fs').promises;
async function openAndClose() {
  let filehandle;
  try {
    filehandle = await fsPromises.open('thefile.txt', 'r');
  } finally {
    if (filehandle !== undefined)
      await filehandle.close();
  }
}
```

### DEP0138: `process.mainModule` {#dep0138-processmainmodule}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | Deprecación solo de documentación. |
:::

Tipo: Solo documentación

[`process.mainModule`](/es/nodejs/api/process#processmainmodule) es una característica exclusiva de CommonJS, mientras que el objeto global `process` se comparte con entornos que no son CommonJS. Su uso dentro de los módulos de ECMAScript no es compatible.

Está obsoleto en favor de [`require.main`](/es/nodejs/api/modules#accessing-the-main-module), porque sirve para el mismo propósito y solo está disponible en el entorno CommonJS.

### DEP0139: `process.umask()` sin argumentos {#dep0139-processumask-with-no-arguments}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0, v12.19.0 | Deprecación solo de documentación. |
:::

Tipo: Solo documentación

Llamar a `process.umask()` sin argumentos hace que la umask de todo el proceso se escriba dos veces. Esto introduce una condición de carrera entre los hilos y es una posible vulnerabilidad de seguridad. No existe una API alternativa segura y multiplataforma.

### DEP0140: Usar `request.destroy()` en lugar de `request.abort()` {#dep0140-use-requestdestroy-instead-of-requestabort}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.1.0, v13.14.0 | Deprecación solo de documentación. |
:::

Tipo: Solo documentación

Use [`request.destroy()`](/es/nodejs/api/http#requestdestroyerror) en lugar de [`request.abort()`](/es/nodejs/api/http#requestabort).

### DEP0141: `repl.inputStream` y `repl.outputStream` {#dep0141-replinputstream-and-reploutputstream}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.3.0 | Solo documentación (admite [`--pending-deprecation`][]). |
:::

Tipo: Solo documentación (admite [`--pending-deprecation`](/es/nodejs/api/cli#--pending-deprecation))

El módulo `node:repl` exportó el flujo de entrada y salida dos veces. Use `.input` en lugar de `.inputStream` y `.output` en lugar de `.outputStream`.

### DEP0142: `repl._builtinLibs` {#dep0142-repl_builtinlibs}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.3.0 | Solo documentación (admite [`--pending-deprecation`][]). |
:::

Tipo: Solo documentación

El módulo `node:repl` exporta una propiedad `_builtinLibs` que contiene una matriz de módulos incorporados. Hasta ahora estaba incompleta y, en cambio, es mejor confiar en `require('node:module').builtinModules`.


### DEP0143: `Transform._transformState` {#dep0143-transform_transformstate}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v14.5.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución `Transform._transformState` se eliminará en futuras versiones donde ya no sea necesario debido a la simplificación de la implementación.

### DEP0144: `module.parent` {#dep0144-moduleparent}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v14.6.0, v12.19.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Solo documentación (admite [`--pending-deprecation`](/es/nodejs/api/cli#--pending-deprecation))

Un módulo CommonJS puede acceder al primer módulo que lo requirió utilizando `module.parent`. Esta característica está obsoleta porque no funciona de manera consistente en presencia de módulos ECMAScript y porque proporciona una representación inexacta del gráfico de módulos CommonJS.

Algunos módulos lo usan para verificar si son el punto de entrada del proceso actual. En cambio, se recomienda comparar `require.main` y `module`:

```js [ESM]
if (require.main === module) {
  // Sección de código que se ejecutará solo si el archivo actual es el punto de entrada.
}
```
Al buscar los módulos CommonJS que han requerido el actual, se pueden usar `require.cache` y `module.children`:

```js [ESM]
const moduleParents = Object.values(require.cache)
  .filter((m) => m.children.includes(module));
```
### DEP0145: `socket.bufferSize` {#dep0145-socketbuffersize}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v14.6.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Solo documentación

[`socket.bufferSize`](/es/nodejs/api/net#socketbuffersize) es solo un alias para [`writable.writableLength`](/es/nodejs/api/stream#writablewritablelength).

### DEP0146: `new crypto.Certificate()` {#dep0146-new-cryptocertificate}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v14.9.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Solo documentación

El [`constructor crypto.Certificate()`](/es/nodejs/api/crypto#legacy-api) está obsoleto. Utilice [métodos estáticos de `crypto.Certificate()`](/es/nodejs/api/crypto#class-certificate) en su lugar.

### DEP0147: `fs.rmdir(path, { recursive: true })` {#dep0147-fsrmdirpath-{-recursive-true-}}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Obsolescencia en tiempo de ejecución. |
| v15.0.0 | Obsolescencia en tiempo de ejecución para el comportamiento permisivo. |
| v14.14.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Tiempo de ejecución

En futuras versiones de Node.js, la opción `recursive` se ignorará para `fs.rmdir`, `fs.rmdirSync` y `fs.promises.rmdir`.

Utilice `fs.rm(path, { recursive: true, force: true })`, `fs.rmSync(path, { recursive: true, force: true })` o `fs.promises.rm(path, { recursive: true, force: true })` en su lugar.


### DEP0148: Asignaciones de carpeta en `"exports"` (barra final `"/"`) {#dep0148-folder-mappings-in-"exports"-trailing-"/"}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.0.0 | Fin de vida útil. |
| v16.0.0 | Desaprobación en tiempo de ejecución. |
| v15.1.0 | Desaprobación en tiempo de ejecución para importaciones autorreferenciales. |
| v14.13.0 | Desaprobación solo de documentación. |
:::

Tipo: Tiempo de ejecución

El uso de una barra final `"/"` para definir asignaciones de carpetas de subruta en los campos [exportaciones de subruta](/es/nodejs/api/packages#subpath-exports) o [importaciones de subruta](/es/nodejs/api/packages#subpath-imports) está obsoleto. Utilice [patrones de subruta](/es/nodejs/api/packages#subpath-patterns) en su lugar.

### DEP0149: `http.IncomingMessage#connection` {#dep0149-httpincomingmessageconnection}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Desaprobación solo de documentación. |
:::

Tipo: Solo documentación.

Prefiera [`message.socket`](/es/nodejs/api/http#messagesocket) sobre [`message.connection`](/es/nodejs/api/http#messageconnection).

### DEP0150: Cambiar el valor de `process.config` {#dep0150-changing-the-value-of-processconfig}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Fin de vida útil. |
| v16.0.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Fin de vida útil

La propiedad `process.config` proporciona acceso a la configuración de tiempo de compilación de Node.js. Sin embargo, la propiedad es mutable y, por lo tanto, está sujeta a manipulación. La capacidad de cambiar el valor se eliminará en una futura versión de Node.js.

### DEP0151: Búsqueda del índice principal y búsqueda de extensión {#dep0151-main-index-lookup-and-extension-searching}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Desaprobación en tiempo de ejecución. |
| v15.8.0, v14.18.0 | Desaprobación solo de documentación con soporte de `--pending-deprecation`. |
:::

Tipo: Tiempo de ejecución

Anteriormente, las búsquedas de `index.js` y la búsqueda de extensión se aplicarían a la resolución del punto de entrada principal `import 'pkg'`, incluso al resolver módulos ES.

Con esta desaprobación, todas las resoluciones de puntos de entrada principales del módulo ES requieren una [entrada `"exports"` o `"main"` explícita](/es/nodejs/api/packages#main-entry-point-export) con la extensión de archivo exacta.

### DEP0152: Propiedades de extensión PerformanceEntry {#dep0152-extension-performanceentry-properties}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Desaprobación en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

Los tipos de objeto [\<PerformanceEntry\>](/es/nodejs/api/perf_hooks#class-performanceentry) `'gc'`, `'http2'` y `'http'` tienen propiedades adicionales asignadas que proporcionan información adicional. Estas propiedades ahora están disponibles dentro de la propiedad `detail` estándar del objeto `PerformanceEntry`. Los accesores existentes han quedado obsoletos y ya no deben utilizarse.


### DEP0153: Coerción de tipo de opciones de `dns.lookup` y `dnsPromises.lookup` {#dep0153-dnslookup-and-dnspromiseslookup-options-type-coercion}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Fin de vida útil. |
| v17.0.0 | Obsoleto en tiempo de ejecución. |
| v16.8.0 | Obsoleto solo en la documentación. |
:::

Tipo: Fin de vida útil

Usar un valor no nulo ni entero para la opción `family`, un valor no nulo ni numérico para la opción `hints`, un valor no nulo ni booleano para la opción `all`, o un valor no nulo ni booleano para la opción `verbatim` en [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback) y [`dnsPromises.lookup()`](/es/nodejs/api/dns#dnspromiseslookuphostname-options) arroja un error `ERR_INVALID_ARG_TYPE`.

### DEP0154: Opciones de generación de pares de claves RSA-PSS {#dep0154-rsa-pss-generate-key-pair-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | Obsoleto en tiempo de ejecución. |
| v16.10.0 | Obsoleto solo en la documentación. |
:::

Tipo: Tiempo de ejecución

Las opciones `'hash'` y `'mgf1Hash'` se reemplazan con `'hashAlgorithm'` y `'mgf1HashAlgorithm'`.

### DEP0155: Barras diagonales finales en las resoluciones de especificadores de patrón {#dep0155-trailing-slashes-in-pattern-specifier-resolutions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.0.0 | Obsoleto en tiempo de ejecución. |
| v16.10.0 | Obsoleto solo en la documentación con soporte de `--pending-deprecation`. |
:::

Tipo: Tiempo de ejecución

La reasignación de especificadores que terminan en `"/"` como `import 'pkg/x/'` está obsoleta para las resoluciones de patrones `"exports"` e `"imports"` del paquete.

### DEP0156: Propiedad `.aborted` y evento `'abort'`, `'aborted'` en `http` {#dep0156-aborted-property-and-abort-aborted-event-in-http}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.0.0, v16.12.0 | Obsoleto solo en la documentación. |
:::

Tipo: Solo documentación

Mueva a la API [\<Stream\>](/es/nodejs/api/stream#stream) en su lugar, ya que [`http.ClientRequest`](/es/nodejs/api/http#class-httpclientrequest), [`http.ServerResponse`](/es/nodejs/api/http#class-httpserverresponse) y [`http.IncomingMessage`](/es/nodejs/api/http#class-httpincomingmessage) están basados ​​en secuencias. Verifique `stream.destroyed` en lugar de la propiedad `.aborted`, y escuche `'close'` en lugar del evento `'abort'`, `'aborted'`.

La propiedad `.aborted` y el evento `'abort'` solo son útiles para detectar llamadas a `.abort()`. Para cerrar una solicitud anticipadamente, use Stream `.destroy([error])`, luego verifique que la propiedad `.destroyed` y el evento `'close'` deberían tener el mismo efecto. El extremo receptor también debe verificar el valor de [`readable.readableEnded`](/es/nodejs/api/stream#readablereadableended) en [`http.IncomingMessage`](/es/nodejs/api/http#class-httpincomingmessage) para obtener si fue una destrucción anulada o correcta.


### DEP0157: Soporte de `Thenable` en los flujos {#dep0157-thenable-support-in-streams}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Fin de vida útil. |
| v17.2.0, v16.14.0 | Obsoleto solo en la documentación. |
:::

Tipo: Fin de vida útil

Una característica no documentada de los flujos de Node.js era admitir "thenables" en los métodos de implementación. Esto ahora está obsoleto, utilice devoluciones de llamada en su lugar y evite el uso de funciones async para los métodos de implementación de flujos.

Esta característica causó que los usuarios encontraran problemas inesperados donde el usuario implementa la función en estilo de devolución de llamada pero usa, por ejemplo, un método async que causaría un error ya que la mezcla de semántica de promesa y devolución de llamada no es válida.

```js [ESM]
const w = new Writable({
  async final(callback) {
    await someOp();
    callback();
  },
});
```
### DEP0158: `buffer.slice(start, end)` {#dep0158-bufferslicestart-end}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.5.0, v16.15.0 | Obsoleto solo en la documentación. |
:::

Tipo: Solo documentación

Este método quedó obsoleto porque no es compatible con `Uint8Array.prototype.slice()`, que es una superclase de `Buffer`.

Utilice [`buffer.subarray`](/es/nodejs/api/buffer#bufsubarraystart-end) que hace lo mismo en su lugar.

### DEP0159: `ERR_INVALID_CALLBACK` {#dep0159-err_invalid_callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Fin de vida útil. |
:::

Tipo: Fin de vida útil

Este código de error se eliminó debido a que agregaba más confusión a los errores utilizados para la validación del tipo de valor.

### DEP0160: `process.on('multipleResolves', handler)` {#dep0160-processonmultipleresolves-handler}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Obsoleto en tiempo de ejecución. |
| v17.6.0, v16.15.0 | Obsoleto solo en la documentación. |
:::

Tipo: Tiempo de ejecución.

Este evento quedó obsoleto porque no funcionaba con los combinadores de promesas V8, lo que disminuyó su utilidad.

### DEP0161: `process._getActiveRequests()` y `process._getActiveHandles()` {#dep0161-process_getactiverequests-and-process_getactivehandles}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.6.0, v16.15.0 | Obsoleto solo en la documentación. |
:::

Tipo: Solo documentación

Las funciones `process._getActiveHandles()` y `process._getActiveRequests()` no están destinadas para uso público y se pueden eliminar en futuras versiones.

Utilice [`process.getActiveResourcesInfo()`](/es/nodejs/api/process#processgetactiveresourcesinfo) para obtener una lista de tipos de recursos activos y no las referencias reales.


### DEP0162: Coerción a cadena de `fs.write()`, `fs.writeFileSync()` {#dep0162-fswrite-fswritefilesync-coercion-to-string}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Fin de vida útil. |
| v18.0.0 | Obsolescencia en tiempo de ejecución. |
| v17.8.0, v16.15.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Fin de vida útil

La coerción implícita de objetos con la propiedad `toString` propia, pasados como segundo parámetro en [`fs.write()`](/es/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback), [`fs.writeFile()`](/es/nodejs/api/fs#fswritefilefile-data-options-callback), [`fs.appendFile()`](/es/nodejs/api/fs#fsappendfilepath-data-options-callback), [`fs.writeFileSync()`](/es/nodejs/api/fs#fswritefilesyncfile-data-options) y [`fs.appendFileSync()`](/es/nodejs/api/fs#fsappendfilesyncpath-data-options) está obsoleta. Conviértalos en cadenas primitivas.

### DEP0163: `channel.subscribe(onMessage)`, `channel.unsubscribe(onMessage)` {#dep0163-channelsubscribeonmessage-channelunsubscribeonmessage}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.7.0, v16.17.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Solo documentación

Estos métodos quedaron obsoletos porque se pueden usar de una manera que no mantiene la referencia del canal activa el tiempo suficiente para recibir los eventos.

Use [`diagnostics_channel.subscribe(name, onMessage)`](/es/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage) o [`diagnostics_channel.unsubscribe(name, onMessage)`](/es/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage) que hace lo mismo en su lugar.

### DEP0164: Coerción a entero de `process.exit(code)`, `process.exitCode` {#dep0164-processexitcode-processexitcode-coercion-to-integer}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | Fin de vida útil. |
| v19.0.0 | Obsolescencia en tiempo de ejecución. |
| v18.10.0, v16.18.0 | Obsolescencia solo en la documentación de la coerción de enteros de `process.exitCode`. |
| v18.7.0, v16.17.0 | Obsolescencia solo en la documentación de la coerción de enteros de `process.exit(code)`. |
:::

Tipo: Fin de vida útil

Los valores distintos de `undefined`, `null`, números enteros y cadenas de enteros (por ejemplo, `'1'`) están obsoletos como valor para el parámetro `code` en [`process.exit()`](/es/nodejs/api/process#processexitcode) y como valor para asignar a [`process.exitCode`](/es/nodejs/api/process#processexitcode_1).


### DEP0165: `--trace-atomics-wait` {#dep0165---trace-atomics-wait}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Fin de vida útil. |
| v22.0.0 | Obsoleto en tiempo de ejecución. |
| v18.8.0, v16.18.0 | Obsoleto solo en la documentación. |
:::

Tipo: Fin de vida útil

La bandera `--trace-atomics-wait` ha sido eliminada porque usa el enlace V8 `SetAtomicsWaitCallback`, que será eliminado en una futura versión de V8.

### DEP0166: Dobles barras diagonales en objetivos de importaciones y exportaciones {#dep0166-double-slashes-in-imports-and-exports-targets}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Obsoleto en tiempo de ejecución. |
| v18.10.0 | Obsoleto solo en la documentación con soporte para `--pending-deprecation`. |
:::

Tipo: Tiempo de ejecución

Las importaciones de paquetes y los objetivos de exportación que se asignan a rutas que incluyen una doble barra diagonal (de *"/"* o *"\"*) están obsoletos y fallarán con un error de validación de resolución en una futura versión. Esta misma obsolescencia también se aplica a las coincidencias de patrones que comienzan o terminan con una barra diagonal.

### DEP0167: Instancias débiles de `DiffieHellmanGroup` (`modp1`, `modp2`, `modp5`) {#dep0167-weak-diffiehellmangroup-instances-modp1-modp2-modp5}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.10.0, v16.18.0 | Obsoleto solo en la documentación. |
:::

Tipo: Solo en la documentación

Los grupos MODP conocidos `modp1`, `modp2` y `modp5` están obsoletos porque no son seguros contra ataques prácticos. Consulte la [Sección 2.4 de RFC 8247](https://www.rfc-editor.org/rfc/rfc8247#section-2.4) para obtener más detalles.

Estos grupos podrían eliminarse en futuras versiones de Node.js. Las aplicaciones que dependen de estos grupos deben evaluar el uso de grupos MODP más fuertes en su lugar.

### DEP0168: Excepción no controlada en las devoluciones de llamada de Node-API {#dep0168-unhandled-exception-in-node-api-callbacks}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.3.0, v16.17.0 | Obsoleto en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

La supresión implícita de excepciones no capturadas en las devoluciones de llamada de Node-API ahora está obsoleta.

Establezca el indicador [`--force-node-api-uncaught-exceptions-policy`](/es/nodejs/api/cli#--force-node-api-uncaught-exceptions-policy) para forzar a Node.js a emitir un evento [`'uncaughtException'`](/es/nodejs/api/process#event-uncaughtexception) si la excepción no se maneja en las devoluciones de llamada de Node-API.


### DEP0169: `url.parse()` inseguro {#dep0169-insecure-urlparse}


::: info [Historial]
| Versión | Cambios |
|---|---|
| v19.9.0, v18.17.0 | Se agregó soporte para `--pending-deprecation`. |
| v19.0.0, v18.13.0 | Obsolescencia solo de documentación. |
:::

Tipo: Solo documentación (admite [`--pending-deprecation`](/es/nodejs/api/cli#--pending-deprecation))

El comportamiento de [`url.parse()`](/es/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) no está estandarizado y es propenso a errores que tienen implicaciones de seguridad. Utilice la [API URL WHATWG](/es/nodejs/api/url#the-whatwg-url-api) en su lugar. No se emiten CVE para vulnerabilidades de `url.parse()`.

### DEP0170: Puerto no válido al usar `url.parse()` {#dep0170-invalid-port-when-using-urlparse}


::: info [Historial]
| Versión | Cambios |
|---|---|
| v20.0.0 | Obsolescencia en tiempo de ejecución. |
| v19.2.0, v18.13.0 | Obsolescencia solo de documentación. |
:::

Tipo: Tiempo de ejecución

[`url.parse()`](/es/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) acepta URL con puertos que no son números. Este comportamiento podría resultar en una suplantación del nombre de host con una entrada inesperada. Estas URL lanzarán un error en futuras versiones de Node.js, como ya lo hace la [API URL WHATWG](/es/nodejs/api/url#the-whatwg-url-api).

### DEP0171: Modificadores para encabezados y trailers de `http.IncomingMessage` {#dep0171-setters-for-httpincomingmessage-headers-and-trailers}


::: info [Historial]
| Versión | Cambios |
|---|---|
| v19.3.0, v18.13.0 | Obsolescencia solo de documentación. |
:::

Tipo: Solo documentación

En una futura versión de Node.js, [`message.headers`](/es/nodejs/api/http#messageheaders), [`message.headersDistinct`](/es/nodejs/api/http#messageheadersdistinct), [`message.trailers`](/es/nodejs/api/http#messagetrailers) y [`message.trailersDistinct`](/es/nodejs/api/http#messagetrailersdistinct) serán de solo lectura.

### DEP0172: La propiedad `asyncResource` de las funciones enlazadas a `AsyncResource` {#dep0172-the-asyncresource-property-of-asyncresource-bound-functions}


::: info [Historial]
| Versión | Cambios |
|---|---|
| v20.0.0 | Obsolescencia en tiempo de ejecución. |
:::

Tipo: Tiempo de ejecución

En una futura versión de Node.js, la propiedad `asyncResource` ya no se agregará cuando una función se vincule a un `AsyncResource`.

### DEP0173: La clase `assert.CallTracker` {#dep0173-the-assertcalltracker-class}


::: info [Historial]
| Versión | Cambios |
|---|---|
| v20.1.0 | Obsolescencia solo de documentación. |
:::

Tipo: Solo documentación

En una futura versión de Node.js, [`assert.CallTracker`](/es/nodejs/api/assert#class-assertcalltracker) será eliminado. Considere usar alternativas como la función auxiliar [`mock`](/es/nodejs/api/test#mocking).


### DEP0174: llamar a `promisify` en una función que devuelve una `Promise` {#dep0174-calling-promisify-on-a-function-that-returns-a-promise}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0 | Obsoleto en tiempo de ejecución. |
| v20.8.0 | Obsoleto solo en la documentación. |
:::

Tipo: Tiempo de ejecución

Llamar a [`util.promisify`](/es/nodejs/api/util#utilpromisifyoriginal) en una función que devuelve una

### DEP0175: `util.toUSVString` {#dep0175-utiltousvstring}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.8.0 | Obsoleto solo en la documentación. |
:::

Tipo: Solo documentación

La API [`util.toUSVString()`](/es/nodejs/api/util#utiltousvstringstring) está obsoleta. Utilice [`String.prototype.toWellFormed`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toWellFormed) en su lugar.

### DEP0176: `fs.F_OK`, `fs.R_OK`, `fs.W_OK`, `fs.X_OK` {#dep0176-fsf_ok-fsr_ok-fsw_ok-fsx_ok}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.8.0 | Obsoleto solo en la documentación. |
:::

Tipo: Solo documentación

Los captadores `F_OK`, `R_OK`, `W_OK` y `X_OK` expuestos directamente en `node:fs` están obsoletos. Obténgalos de `fs.constants` o `fs.promises.constants` en su lugar.

### DEP0177: `util.types.isWebAssemblyCompiledModule` {#dep0177-utiltypesiswebassemblycompiledmodule}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.7.0, v20.12.0 | Fin de vida útil. |
| v21.3.0, v20.11.0 | Se ha asignado un código de obsolescencia. |
| v14.0.0 | Obsoleto solo en la documentación. |
:::

Tipo: Fin de vida útil

La API `util.types.isWebAssemblyCompiledModule` ha sido eliminada. Utilice `value instanceof WebAssembly.Module` en su lugar.

### DEP0178: `dirent.path` {#dep0178-direntpath}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Obsoleto en tiempo de ejecución. |
| v21.5.0, v20.12.0, v18.20.0 | Obsoleto solo en la documentación. |
:::

Tipo: Tiempo de ejecución

El [`dirent.path`](/es/nodejs/api/fs#direntpath) está obsoleto debido a su falta de consistencia entre las líneas de lanzamiento. Utilice [`dirent.parentPath`](/es/nodejs/api/fs#direntparentpath) en su lugar.

### DEP0179: Constructor `Hash` {#dep0179-hash-constructor}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0 | Obsoleto en tiempo de ejecución. |
| v21.5.0, v20.12.0 | Obsoleto solo en la documentación. |
:::

Tipo: Tiempo de ejecución

Llamar a la clase `Hash` directamente con `Hash()` o `new Hash()` está obsoleto debido a que es interno, no está destinado al uso público. Utilice el método [`crypto.createHash()`](/es/nodejs/api/crypto#cryptocreatehashalgorithm-options) para crear instancias de Hash.


### DEP0180: Constructor `fs.Stats` {#dep0180-fsstats-constructor}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0 | Obsolescencia en tiempo de ejecución. |
| v20.13.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Tiempo de ejecución

Llamar a la clase `fs.Stats` directamente con `Stats()` o `new Stats()` está obsoleto debido a que son elementos internos, no destinados al uso público.

### DEP0181: Constructor `Hmac` {#dep0181-hmac-constructor}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0 | Obsolescencia en tiempo de ejecución. |
| v20.13.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Tiempo de ejecución

Llamar a la clase `Hmac` directamente con `Hmac()` o `new Hmac()` está obsoleto debido a que son elementos internos, no destinados al uso público. Utilice el método [`crypto.createHmac()`](/es/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) para crear instancias de Hmac.

### DEP0182: Etiquetas de autenticación GCM cortas sin `authTagLength` explícito {#dep0182-short-gcm-authentication-tags-without-explicit-authtaglength}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Obsolescencia en tiempo de ejecución. |
| v20.13.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Tiempo de ejecución

Las aplicaciones que tengan la intención de utilizar etiquetas de autenticación que sean más cortas que la longitud de la etiqueta de autenticación predeterminada deben establecer la opción `authTagLength` de la función [`crypto.createDecipheriv()`](/es/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) a la longitud apropiada.

Para los cifrados en modo GCM, la función [`decipher.setAuthTag()`](/es/nodejs/api/crypto#deciphersetauthtagbuffer-encoding) acepta etiquetas de autenticación de cualquier longitud válida (consulte [DEP0090](/es/nodejs/api/deprecations#DEP0090)). Este comportamiento está obsoleto para alinearse mejor con las recomendaciones de [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

### DEP0183: API basadas en el motor OpenSSL {#dep0183-openssl-engine-based-apis}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.4.0, v20.16.0 | Obsolescencia solo en la documentación. |
:::

Tipo: Solo documentación

OpenSSL 3 ha dejado de admitir motores personalizados con una recomendación de cambiar a su nuevo modelo de proveedor. La opción `clientCertEngine` para `https.request()`, [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions) y [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener); `privateKeyEngine` y `privateKeyIdentifier` para [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions); y [`crypto.setEngine()`](/es/nodejs/api/crypto#cryptosetengineengine-flags) todos dependen de esta funcionalidad de OpenSSL.


### DEP0184: Instanciación de clases `node:zlib` sin `new` {#dep0184-instantiating-nodezlib-classes-without-new}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.9.0, v20.18.0 | Desaprobación solo en la documentación. |
:::

Tipo: Solo en la documentación

La instanciación de clases sin el calificador `new` exportado por el módulo `node:zlib` está en desuso. Se recomienda utilizar el calificador `new` en su lugar. Esto se aplica a todas las clases Zlib, como `Deflate`, `DeflateRaw`, `Gunzip`, `Inflate`, `InflateRaw`, `Unzip` y `Zlib`.

### DEP0185: Instanciación de clases `node:repl` sin `new` {#dep0185-instantiating-noderepl-classes-without-new}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.9.0, v20.18.0 | Desaprobación solo en la documentación. |
:::

Tipo: Solo en la documentación

La instanciación de clases sin el calificador `new` exportado por el módulo `node:repl` está en desuso. Se recomienda utilizar el calificador `new` en su lugar. Esto se aplica a todas las clases REPL, incluyendo `REPLServer` y `Recoverable`.

### DEP0187: Pasar tipos de argumentos no válidos a `fs.existsSync` {#dep0187-passing-invalid-argument-types-to-fsexistssync}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.4.0 | Solo en la documentación. |
:::

Tipo: Solo en la documentación

Pasar tipos de argumentos no admitidos está en desuso y, en lugar de devolver `false`, lanzará un error en una versión futura.

### DEP0188: `process.features.ipv6` y `process.features.uv` {#dep0188-processfeaturesipv6-and-processfeaturesuv}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.4.0 | Desaprobación solo en la documentación. |
:::

Tipo: Solo en la documentación

Estas propiedades son incondicionalmente `true`. Cualquier comprobación basada en estas propiedades es redundante.

### DEP0189: `process.features.tls_*` {#dep0189-processfeaturestls_*}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.4.0 | Desaprobación solo en la documentación. |
:::

Tipo: Solo en la documentación

`process.features.tls_alpn`, `process.features.tls_ocsp` y `process.features.tls_sni` están en desuso, ya que se garantiza que sus valores serán idénticos a los de `process.features.tls`.

