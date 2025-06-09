---
title: Documentación de TTY de Node.js
description: El módulo TTY de Node.js proporciona una interfaz para interactuar con dispositivos TTY, incluyendo métodos para verificar si un flujo es un TTY, obtener el tamaño de la ventana y manejar eventos del terminal.
head:
  - - meta
    - name: og:title
      content: Documentación de TTY de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo TTY de Node.js proporciona una interfaz para interactuar con dispositivos TTY, incluyendo métodos para verificar si un flujo es un TTY, obtener el tamaño de la ventana y manejar eventos del terminal.
  - - meta
    - name: twitter:title
      content: Documentación de TTY de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo TTY de Node.js proporciona una interfaz para interactuar con dispositivos TTY, incluyendo métodos para verificar si un flujo es un TTY, obtener el tamaño de la ventana y manejar eventos del terminal.
---


# TTY {#tty}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código Fuente:** [lib/tty.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tty.js)

El módulo `node:tty` proporciona las clases `tty.ReadStream` y `tty.WriteStream`. En la mayoría de los casos, no será necesario ni posible utilizar este módulo directamente. Sin embargo, se puede acceder a él usando:

```js [ESM]
const tty = require('node:tty');
```
Cuando Node.js detecta que se está ejecutando con una terminal de texto ("TTY") adjunta, [`process.stdin`](/es/nodejs/api/process#processstdin) se inicializará, de forma predeterminada, como una instancia de `tty.ReadStream` y tanto [`process.stdout`](/es/nodejs/api/process#processstdout) como [`process.stderr`](/es/nodejs/api/process#processstderr) serán, de forma predeterminada, instancias de `tty.WriteStream`. El método preferido para determinar si Node.js se está ejecutando dentro de un contexto TTY es verificar que el valor de la propiedad `process.stdout.isTTY` sea `true`:

```bash [BASH]
$ node -p -e "Boolean(process.stdout.isTTY)"
true
$ node -p -e "Boolean(process.stdout.isTTY)" | cat
false
```
En la mayoría de los casos, no debería haber ninguna razón para que una aplicación cree manualmente instancias de las clases `tty.ReadStream` y `tty.WriteStream`.

## Clase: `tty.ReadStream` {#class-ttyreadstream}

**Agregado en: v0.5.8**

- Extiende: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket)

Representa el lado legible de un TTY. En circunstancias normales, [`process.stdin`](/es/nodejs/api/process#processstdin) será la única instancia de `tty.ReadStream` en un proceso de Node.js y no debería haber ninguna razón para crear instancias adicionales.

### `readStream.isRaw` {#readstreamisraw}

**Agregado en: v0.7.7**

Un `boolean` que es `true` si el TTY está configurado actualmente para operar como un dispositivo raw.

Este indicador siempre es `false` cuando se inicia un proceso, incluso si la terminal está operando en modo raw. Su valor cambiará con las llamadas posteriores a `setRawMode`.

### `readStream.isTTY` {#readstreamistty}

**Agregado en: v0.5.8**

Un `boolean` que siempre es `true` para las instancias de `tty.ReadStream`.


### `readStream.setRawMode(mode)` {#readstreamsetrawmodemode}

**Agregado en: v0.7.7**

- `mode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, configura el `tty.ReadStream` para que funcione como un dispositivo raw. Si es `false`, configura el `tty.ReadStream` para que funcione en su modo predeterminado. La propiedad `readStream.isRaw` se establecerá en el modo resultante.
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) La instancia de la secuencia de lectura.

Permite la configuración de `tty.ReadStream` para que funcione como un dispositivo raw.

Cuando está en modo raw, la entrada siempre está disponible carácter por carácter, sin incluir los modificadores. Además, todo el procesamiento especial de caracteres por parte del terminal está deshabilitado, incluido el eco de los caracteres de entrada. + ya no causará un `SIGINT` cuando esté en este modo.

## Clase: `tty.WriteStream` {#class-ttywritestream}

**Agregado en: v0.5.8**

- Extiende: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket)

Representa el lado de escritura de un TTY. En circunstancias normales, [`process.stdout`](/es/nodejs/api/process#processstdout) y [`process.stderr`](/es/nodejs/api/process#processstderr) serán las únicas instancias de `tty.WriteStream` creadas para un proceso de Node.js y no debería haber ninguna razón para crear instancias adicionales.

### `new tty.ReadStream(fd[, options])` {#new-ttyreadstreamfd-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v0.9.4 | El argumento `options` es soportado. |
| v0.5.8 | Agregado en: v0.5.8 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un descriptor de archivo asociado con un TTY.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones pasadas al `net.Socket` padre, vea `options` de [`net.Socket` constructor](/es/nodejs/api/net#new-netsocketoptions).
- Devuelve [\<tty.ReadStream\>](/es/nodejs/api/tty#class-ttyreadstream)

Crea un `ReadStream` para `fd` asociado con un TTY.

### `new tty.WriteStream(fd)` {#new-ttywritestreamfd}

**Agregado en: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un descriptor de archivo asociado con un TTY.
- Devuelve [\<tty.WriteStream\>](/es/nodejs/api/tty#class-ttywritestream)

Crea un `WriteStream` para `fd` asociado con un TTY.


### Evento: `'resize'` {#event-resize}

**Agregado en: v0.7.7**

El evento `'resize'` se emite siempre que cambian las propiedades `writeStream.columns` o `writeStream.rows`. No se pasan argumentos a la función de callback del listener cuando se llama.

```js [ESM]
process.stdout.on('resize', () => {
  console.log('¡el tamaño de la pantalla ha cambiado!');
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});
```
### `writeStream.clearLine(dir[, callback])` {#writestreamclearlinedir-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.7.0 | Se exponen la función de callback y el valor de retorno de write() del stream. |
| v0.7.7 | Agregado en: v0.7.7 |
:::

- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: a la izquierda del cursor
    - `1`: a la derecha del cursor
    - `0`: toda la línea
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se invoca una vez que se completa la operación.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si el stream desea que el código que llama espere a que se emita el evento `'drain'` antes de continuar escribiendo datos adicionales; de lo contrario, `true`.

`writeStream.clearLine()` borra la línea actual de este `WriteStream` en una dirección identificada por `dir`.

### `writeStream.clearScreenDown([callback])` {#writestreamclearscreendowncallback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.7.0 | Se exponen la función de callback y el valor de retorno de write() del stream. |
| v0.7.7 | Agregado en: v0.7.7 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se invoca una vez que se completa la operación.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si el stream desea que el código que llama espere a que se emita el evento `'drain'` antes de continuar escribiendo datos adicionales; de lo contrario, `true`.

`writeStream.clearScreenDown()` borra este `WriteStream` desde el cursor actual hacia abajo.


### `writeStream.columns` {#writestreamcolumns}

**Agregado en: v0.7.7**

Un `number` que especifica el número de columnas que tiene actualmente el TTY. Esta propiedad se actualiza cada vez que se emite el evento `'resize'`.

### `writeStream.cursorTo(x[, y][, callback])` {#writestreamcursortox-y-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.7.0 | Se exponen la función de retrollamada write() y el valor de retorno del stream. |
| v0.7.7 | Agregado en: v0.7.7 |
:::

- `x` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) Se invoca una vez que se completa la operación.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si el stream desea que el código que llama espere a que se emita el evento `'drain'` antes de continuar escribiendo datos adicionales; de lo contrario, `true`.

`writeStream.cursorTo()` mueve el cursor de este `WriteStream` a la posición especificada.

### `writeStream.getColorDepth([env])` {#writestreamgetcolordepthenv}

**Agregado en: v9.9.0**

- `env` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto que contiene las variables de entorno para verificar. Esto permite simular el uso de un terminal específico. **Predeterminado:** `process.env`.
- Devuelve: [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve:

- `1` para 2,
- `4` para 16,
- `8` para 256,
- `24` para 16,777,216 colores admitidos.

Úselo para determinar qué colores admite el terminal. Debido a la naturaleza de los colores en los terminales, es posible tener falsos positivos o falsos negativos. Depende de la información del proceso y las variables de entorno que pueden mentir sobre qué terminal se está utilizando. Es posible pasar un objeto `env` para simular el uso de un terminal específico. Esto puede ser útil para verificar cómo se comportan configuraciones de entorno específicas.

Para forzar una compatibilidad de color específica, utilice una de las siguientes configuraciones de entorno.

- 2 colores: `FORCE_COLOR = 0` (Desactiva los colores)
- 16 colores: `FORCE_COLOR = 1`
- 256 colores: `FORCE_COLOR = 2`
- 16,777,216 colores: `FORCE_COLOR = 3`

También es posible desactivar la compatibilidad con colores mediante las variables de entorno `NO_COLOR` y `NODE_DISABLE_COLORS`.


### `writeStream.getWindowSize()` {#writestreamgetwindowsize}

**Agregado en: v0.7.7**

- Regresa: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`writeStream.getWindowSize()` regresa el tamaño de la TTY correspondiente a este `WriteStream`. El array es del tipo `[numColumns, numRows]` donde `numColumns` y `numRows` representan el número de columnas y filas en la TTY correspondiente.

### `writeStream.hasColors([count][, env])` {#writestreamhascolorscount-env}

**Agregado en: v11.13.0, v10.16.0**

- `count` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de colores que se solicitan (mínimo 2). **Predeterminado:** 16.
- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto que contiene las variables de entorno para verificar. Esto permite simular el uso de una terminal específica. **Predeterminado:** `process.env`.
- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Regresa `true` si el `writeStream` soporta al menos tantos colores como los provistos en `count`. El soporte mínimo es 2 (blanco y negro).

Esto tiene los mismos falsos positivos y negativos como se describe en [`writeStream.getColorDepth()`](/es/nodejs/api/tty#writestreamgetcolordepthenv).

```js [ESM]
process.stdout.hasColors();
// Regresa true o false dependiendo de si `stdout` soporta al menos 16 colores.
process.stdout.hasColors(256);
// Regresa true o false dependiendo de si `stdout` soporta al menos 256 colores.
process.stdout.hasColors({ TMUX: '1' });
// Regresa true.
process.stdout.hasColors(2 ** 24, { TMUX: '1' });
// Regresa false (la configuración del entorno pretende soportar 2 ** 8 colores).
```
### `writeStream.isTTY` {#writestreamistty}

**Agregado en: v0.5.8**

Un `boolean` que siempre es `true`.

### `writeStream.moveCursor(dx, dy[, callback])` {#writestreammovecursordx-dy-callback}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v12.7.0 | El callback de write() y el valor de retorno del stream están expuestos. |
| v0.7.7 | Agregado en: v0.7.7 |
:::

- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocado una vez que la operación se completa.
- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si el stream desea que el código de llamada espere a que el evento `'drain'` sea emitido antes de continuar escribiendo datos adicionales; de lo contrario `true`.

`writeStream.moveCursor()` mueve el cursor de este `WriteStream` *relativo* a su posición actual.


### `writeStream.rows` {#writestreamrows}

**Agregado en: v0.7.7**

Un `number` que especifica el número de filas que tiene actualmente el TTY. Esta propiedad se actualiza cada vez que se emite el evento `'resize'`.

## `tty.isatty(fd)` {#ttyisattyfd}

**Agregado en: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un descriptor de archivo numérico
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

El método `tty.isatty()` devuelve `true` si el `fd` dado está asociado con un TTY y `false` si no lo está, incluyendo cuando `fd` no es un entero no negativo.

