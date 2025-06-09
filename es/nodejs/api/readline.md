---
title: Documentación de Node.js - Readline
description: El módulo readline de Node.js proporciona una interfaz para leer datos de un flujo legible (como process.stdin) línea por línea. Soporta la creación de interfaces para leer entradas desde la consola, manejar la entrada del usuario y gestionar operaciones línea por línea.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Readline | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo readline de Node.js proporciona una interfaz para leer datos de un flujo legible (como process.stdin) línea por línea. Soporta la creación de interfaces para leer entradas desde la consola, manejar la entrada del usuario y gestionar operaciones línea por línea.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Readline | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo readline de Node.js proporciona una interfaz para leer datos de un flujo legible (como process.stdin) línea por línea. Soporta la creación de interfaces para leer entradas desde la consola, manejar la entrada del usuario y gestionar operaciones línea por línea.
---


# Readline {#readline}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/readline.js](https://github.com/nodejs/node/blob/v23.5.0/lib/readline.js)

El módulo `node:readline` proporciona una interfaz para leer datos de un flujo [Readable](/es/nodejs/api/stream#readable-streams) (como [`process.stdin`](/es/nodejs/api/process#processstdin)) una línea a la vez.

Para usar las API basadas en promesas:

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
```

```js [CJS]
const readline = require('node:readline/promises');
```
:::

Para usar las API de callback y síncronas:

::: code-group
```js [ESM]
import * as readline from 'node:readline';
```

```js [CJS]
const readline = require('node:readline');
```
:::

El siguiente ejemplo simple ilustra el uso básico del módulo `node:readline`.

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const answer = await rl.question('¿Qué opinas de Node.js? ');

console.log(`Gracias por tus valiosos comentarios: ${answer}`);

rl.close();
```

```js [CJS]
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('¿Qué opinas de Node.js? ', (answer) => {
  // TODO: Registrar la respuesta en una base de datos
  console.log(`Gracias por tus valiosos comentarios: ${answer}`);

  rl.close();
});
```
:::

Una vez que se invoca este código, la aplicación Node.js no terminará hasta que se cierre `readline.Interface` porque la interfaz espera a que se reciban datos en el flujo `input`.

## Clase: `InterfaceConstructor` {#class-interfaceconstructor}

**Agregado en: v0.1.104**

- Extiende: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Las instancias de la clase `InterfaceConstructor` se construyen utilizando el método `readlinePromises.createInterface()` o `readline.createInterface()`. Cada instancia está asociada con un único flujo `input` [Readable](/es/nodejs/api/stream#readable-streams) y un único flujo `output` [Writable](/es/nodejs/api/stream#writable-streams). El flujo `output` se utiliza para imprimir indicaciones para la entrada del usuario que llega al flujo `input` y se lee de él.


### Evento: `'close'` {#event-close}

**Añadido en: v0.1.98**

El evento `'close'` se emite cuando ocurre una de las siguientes situaciones:

- Se llama al método `rl.close()` y la instancia `InterfaceConstructor` ha renunciado al control sobre los flujos `input` y `output`;
- El flujo `input` recibe su evento `'end'`;
- El flujo `input` recibe + para indicar el final de la transmisión (EOT);
- El flujo `input` recibe + para indicar `SIGINT` y no hay ningún detector de eventos `'SIGINT'` registrado en la instancia `InterfaceConstructor`.

La función de escucha se llama sin pasar ningún argumento.

La instancia `InterfaceConstructor` termina una vez que se emite el evento `'close'`.

### Evento: `'line'` {#event-line}

**Añadido en: v0.1.98**

El evento `'line'` se emite cada vez que el flujo `input` recibe una entrada de fin de línea (`\n`, `\r` o `\r\n`). Esto suele ocurrir cuando el usuario presiona  o .

El evento `'line'` también se emite si se han leído nuevos datos de un flujo y ese flujo termina sin un marcador final de fin de línea.

La función de escucha se llama con una cadena que contiene la única línea de entrada recibida.

```js [ESM]
rl.on('line', (input) => {
  console.log(`Recibido: ${input}`);
});
```
### Evento: `'history'` {#event-history}

**Añadido en: v15.8.0, v14.18.0**

El evento `'history'` se emite cada vez que el array de historial ha cambiado.

La función de escucha se llama con un array que contiene el array de historial. Reflejará todos los cambios, líneas añadidas y líneas eliminadas debido a `historySize` y `removeHistoryDuplicates`.

El propósito principal es permitir que un detector de eventos persista el historial. También es posible que el detector de eventos cambie el objeto del historial. Esto podría ser útil para evitar que ciertas líneas se añadan al historial, como una contraseña.

```js [ESM]
rl.on('history', (history) => {
  console.log(`Recibido: ${history}`);
});
```
### Evento: `'pause'` {#event-pause}

**Añadido en: v0.7.5**

El evento `'pause'` se emite cuando ocurre una de las siguientes situaciones:

- El flujo `input` está en pausa.
- El flujo `input` no está en pausa y recibe el evento `'SIGCONT'`. (Consulte los eventos [`'SIGTSTP'`](/es/nodejs/api/readline#event-sigtstp) y [`'SIGCONT'`](/es/nodejs/api/readline#event-sigcont).)

La función de escucha se llama sin pasar ningún argumento.

```js [ESM]
rl.on('pause', () => {
  console.log('Readline pausado.');
});
```

### Evento: `'resume'` {#event-resume}

**Agregado en: v0.7.5**

El evento `'resume'` se emite cada vez que se reanuda el flujo `input`.

La función de escucha se llama sin pasar ningún argumento.

```js [ESM]
rl.on('resume', () => {
  console.log('Readline reanudado.');
});
```
### Evento: `'SIGCONT'` {#event-sigcont}

**Agregado en: v0.7.5**

El evento `'SIGCONT'` se emite cuando un proceso de Node.js previamente movido al segundo plano usando + (es decir, `SIGTSTP`) se devuelve al primer plano usando [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p).

Si el flujo `input` se pausó *antes* de la solicitud `SIGTSTP`, este evento no se emitirá.

La función de escucha se invoca sin pasar ningún argumento.

```js [ESM]
rl.on('SIGCONT', () => {
  // `prompt` reanudará automáticamente el flujo
  rl.prompt();
});
```
El evento `'SIGCONT'` *no* es compatible con Windows.

### Evento: `'SIGINT'` {#event-sigint}

**Agregado en: v0.3.0**

El evento `'SIGINT'` se emite cada vez que el flujo `input` recibe una entrada , conocida típicamente como `SIGINT`. Si no hay listeners del evento `'SIGINT'` registrados cuando el flujo `input` recibe un `SIGINT`, el evento `'pause'` será emitido.

La función de escucha se invoca sin pasar ningún argumento.

```js [ESM]
rl.on('SIGINT', () => {
  rl.question('¿Está seguro de que quiere salir? ', (answer) => {
    if (answer.match(/^y(es)?$/i)) rl.pause();
  });
});
```
### Evento: `'SIGTSTP'` {#event-sigtstp}

**Agregado en: v0.7.5**

El evento `'SIGTSTP'` se emite cuando el flujo `input` recibe una entrada +, normalmente conocida como `SIGTSTP`. Si no hay listeners del evento `'SIGTSTP'` registrados cuando el flujo `input` recibe un `SIGTSTP`, el proceso de Node.js se enviará al segundo plano.

Cuando el programa se reanuda usando [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p), los eventos `'pause'` y `'SIGCONT'` se emitirán. Estos se pueden usar para reanudar el flujo `input`.

Los eventos `'pause'` y `'SIGCONT'` no se emitirán si el `input` se pausó antes de que el proceso se enviara al segundo plano.

La función de escucha se invoca sin pasar ningún argumento.

```js [ESM]
rl.on('SIGTSTP', () => {
  // Esto anulará SIGTSTP e impedirá que el programa se vaya al
  // segundo plano.
  console.log('Atrapado SIGTSTP.');
});
```
El evento `'SIGTSTP'` *no* es compatible con Windows.


### `rl.close()` {#rlclose}

**Agregado en: v0.1.98**

El método `rl.close()` cierra la instancia `InterfaceConstructor` y renuncia al control sobre los flujos `input` y `output`. Cuando se llama, se emitirá el evento `'close'`.

Llamar a `rl.close()` no detiene inmediatamente la emisión de otros eventos (incluido `'line'`) por parte de la instancia `InterfaceConstructor`.

### `rl.pause()` {#rlpause}

**Agregado en: v0.3.4**

El método `rl.pause()` pausa el flujo `input`, permitiendo que se reanude más tarde si es necesario.

Llamar a `rl.pause()` no pausa inmediatamente la emisión de otros eventos (incluido `'line'`) por parte de la instancia `InterfaceConstructor`.

### `rl.prompt([preserveCursor])` {#rlpromptpreservecursor}

**Agregado en: v0.1.98**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, evita que la posición del cursor se restablezca a `0`.

El método `rl.prompt()` escribe el `prompt` configurado de las instancias `InterfaceConstructor` en una nueva línea en `output` para proporcionar al usuario una nueva ubicación en la que proporcionar la entrada.

Cuando se llama, `rl.prompt()` reanudará el flujo `input` si ha sido pausado.

Si el `InterfaceConstructor` se creó con `output` establecido en `null` o `undefined`, el prompt no se escribe.

### `rl.resume()` {#rlresume}

**Agregado en: v0.3.4**

El método `rl.resume()` reanuda el flujo `input` si ha sido pausado.

### `rl.setPrompt(prompt)` {#rlsetpromptprompt}

**Agregado en: v0.1.98**

- `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `rl.setPrompt()` establece el prompt que se escribirá en `output` cada vez que se llame a `rl.prompt()`.

### `rl.getPrompt()` {#rlgetprompt}

**Agregado en: v15.3.0, v14.17.0**

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) la cadena de prompt actual

El método `rl.getPrompt()` devuelve el prompt actual utilizado por `rl.prompt()`.

### `rl.write(data[, key])` {#rlwritedata-key}

**Agregado en: v0.1.98**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ctrl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` para indicar la tecla Ctrl.
    - `meta` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `true` para indicar la tecla Meta.
    - `shift` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` para indicar la tecla Shift.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de una tecla.

El método `rl.write()` escribirá `data` o una secuencia de teclas identificada por `key` en la `output`. El argumento `key` solo se admite si `output` es un terminal de texto [TTY](/es/nodejs/api/tty). Consulte [Combinaciones de teclas TTY](/es/nodejs/api/readline#tty-keybindings) para obtener una lista de combinaciones de teclas.

Si se especifica `key`, se ignora `data`.

Cuando se llama, `rl.write()` reanudará el flujo `input` si ha sido pausado.

Si el `InterfaceConstructor` se creó con `output` establecido en `null` o `undefined`, no se escriben `data` y `key`.

```js [ESM]
rl.write('¡Borra esto!');
// Simula Ctrl+U para borrar la línea escrita anteriormente
rl.write(null, { ctrl: true, name: 'u' });
```
El método `rl.write()` escribirá los datos en la `Interface` `readline` `input` *como si fueran proporcionados por el usuario*.


### `rl[Symbol.asyncIterator]()` {#rlsymbolasynciterator}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.14.0, v10.17.0 | El soporte para Symbol.asyncIterator ya no es experimental. |
| v11.4.0, v10.16.0 | Añadido en: v11.4.0, v10.16.0 |
:::

- Devuelve: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)

Crea un objeto `AsyncIterator` que itera a través de cada línea en el flujo de entrada como una cadena. Este método permite la iteración asíncrona de objetos `InterfaceConstructor` a través de bucles `for await...of`.

Los errores en el flujo de entrada no se reenvían.

Si el bucle se termina con `break`, `throw` o `return`, se llamará a [`rl.close()`](/es/nodejs/api/readline#rlclose). En otras palabras, iterar sobre un `InterfaceConstructor` siempre consumirá el flujo de entrada por completo.

El rendimiento no está a la par con la API de eventos `'line'` tradicional. Utilice `'line'` en su lugar para aplicaciones sensibles al rendimiento.

```js [ESM]
async function processLineByLine() {
  const rl = readline.createInterface({
    // ...
  });

  for await (const line of rl) {
    // Cada línea en la entrada de readline estará disponible sucesivamente aquí como
    // `line`.
  }
}
```
`readline.createInterface()` comenzará a consumir el flujo de entrada una vez invocado. Tener operaciones asíncronas entre la creación de la interfaz y la iteración asíncrona puede resultar en líneas perdidas.

### `rl.line` {#rlline}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.8.0, v14.18.0 | El valor siempre será una cadena, nunca indefinido. |
| v0.1.98 | Añadido en: v0.1.98 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Los datos de entrada actuales que están siendo procesados por node.

Esto se puede utilizar al recopilar la entrada de un flujo TTY para recuperar el valor actual que se ha procesado hasta el momento, antes de que se emita el evento `line`. Una vez que se ha emitido el evento `line`, esta propiedad será una cadena vacía.

Tenga en cuenta que modificar el valor durante el tiempo de ejecución de la instancia puede tener consecuencias no deseadas si `rl.cursor` tampoco está controlado.

**Si no está utilizando un flujo TTY para la entrada, utilice el evento <a href="#event-line"><code>'line'</code></a>.**

Un posible caso de uso sería el siguiente:

```js [ESM]
const values = ['lorem ipsum', 'dolor sit amet'];
const rl = readline.createInterface(process.stdin);
const showResults = debounce(() => {
  console.log(
    '\n',
    values.filter((val) => val.startsWith(rl.line)).join(' '),
  );
}, 300);
process.stdin.on('keypress', (c, k) => {
  showResults();
});
```

### `rl.cursor` {#rlcursor}

**Añadido en: v0.1.98**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

La posición del cursor relativa a `rl.line`.

Esto rastreará dónde aterriza el cursor actual en la cadena de entrada, al leer la entrada de un flujo TTY. La posición del cursor determina la porción de la cadena de entrada que se modificará a medida que se procesa la entrada, así como la columna donde se representará el cursor del terminal.

### `rl.getCursorPos()` {#rlgetcursorpos}

**Añadido en: v13.5.0, v12.16.0**

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `rows` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la fila del prompt donde se encuentra actualmente el cursor
    - `cols` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la columna de la pantalla donde se encuentra actualmente el cursor
  
 

Devuelve la posición real del cursor en relación con el prompt de entrada + la cadena. Las cadenas de entrada largas (que se ajustan), así como los prompts de varias líneas, se incluyen en los cálculos.

## API de Promesas {#promises-api}

**Añadido en: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

### Clase: `readlinePromises.Interface` {#class-readlinepromisesinterface}

**Añadido en: v17.0.0**

- Extiende: [\<readline.InterfaceConstructor\>](/es/nodejs/api/readline#class-interfaceconstructor)

Las instancias de la clase `readlinePromises.Interface` se construyen utilizando el método `readlinePromises.createInterface()`. Cada instancia está asociada con un solo flujo `input` [Readable](/es/nodejs/api/stream#readable-streams) y un solo flujo `output` [Writable](/es/nodejs/api/stream#writable-streams). El flujo `output` se utiliza para imprimir prompts para la entrada del usuario que llega y se lee desde el flujo `input`.


#### `rl.question(query[, options])` {#rlquestionquery-options}

**Agregado en: v17.0.0**

- `query` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una declaración o consulta para escribir en `output`, antepuesta al prompt.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite opcionalmente que `question()` se cancele usando una `AbortSignal`.


- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Una promesa que se cumple con la entrada del usuario en respuesta a la `query`.

El método `rl.question()` muestra la `query` escribiéndola en la `output`, espera a que se proporcione la entrada del usuario en `input`, luego invoca la función `callback` pasando la entrada proporcionada como el primer argumento.

Cuando se llama, `rl.question()` reanudará el flujo `input` si se ha pausado.

Si `readlinePromises.Interface` se creó con `output` establecido en `null` o `undefined`, la `query` no se escribe.

Si se llama a la pregunta después de `rl.close()`, devuelve una promesa rechazada.

Ejemplo de uso:

```js [ESM]
const answer = await rl.question('¿Cuál es tu comida favorita? ');
console.log(`Oh, así que tu comida favorita es ${answer}`);
```
Usando una `AbortSignal` para cancelar una pregunta.

```js [ESM]
const signal = AbortSignal.timeout(10_000);

signal.addEventListener('abort', () => {
  console.log('La pregunta de la comida se agotó');
}, { once: true });

const answer = await rl.question('¿Cuál es tu comida favorita? ', { signal });
console.log(`Oh, así que tu comida favorita es ${answer}`);
```
### Clase: `readlinePromises.Readline` {#class-readlinepromisesreadline}

**Agregado en: v17.0.0**

#### `new readlinePromises.Readline(stream[, options])` {#new-readlinepromisesreadlinestream-options}

**Agregado en: v17.0.0**

- `stream` [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable) Un flujo [TTY](/es/nodejs/api/tty).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `autoCommit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, no es necesario llamar a `rl.commit()`.


#### `rl.clearLine(dir)` {#rlclearlinedir}

**Agregado en: v17.0.0**

- `dir` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 
    - `-1`: a la izquierda del cursor
    - `1`: a la derecha del cursor
    - `0`: la línea completa
  
 
- Devuelve: this

El método `rl.clearLine()` agrega a la lista interna de acciones pendientes una acción que borra la línea actual del `stream` asociado en una dirección especificada identificada por `dir`. Llama a `rl.commit()` para ver el efecto de este método, a menos que se haya pasado `autoCommit: true` al constructor.

#### `rl.clearScreenDown()` {#rlclearscreendown}

**Agregado en: v17.0.0**

- Devuelve: this

El método `rl.clearScreenDown()` agrega a la lista interna de acciones pendientes una acción que borra el stream asociado desde la posición actual del cursor hacia abajo. Llama a `rl.commit()` para ver el efecto de este método, a menos que se haya pasado `autoCommit: true` al constructor.

#### `rl.commit()` {#rlcommit}

**Agregado en: v17.0.0**

- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

El método `rl.commit()` envía todas las acciones pendientes al `stream` asociado y borra la lista interna de acciones pendientes.

#### `rl.cursorTo(x[, y])` {#rlcursortox-y}

**Agregado en: v17.0.0**

- `x` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Devuelve: this

El método `rl.cursorTo()` agrega a la lista interna de acciones pendientes una acción que mueve el cursor a la posición especificada en el `stream` asociado. Llama a `rl.commit()` para ver el efecto de este método, a menos que se haya pasado `autoCommit: true` al constructor.

#### `rl.moveCursor(dx, dy)` {#rlmovecursordx-dy}

**Agregado en: v17.0.0**

- `dx` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Devuelve: this

El método `rl.moveCursor()` agrega a la lista interna de acciones pendientes una acción que mueve el cursor *relativamente* a su posición actual en el `stream` asociado. Llama a `rl.commit()` para ver el efecto de este método, a menos que se haya pasado `autoCommit: true` al constructor.


#### `rl.rollback()` {#rlrollback}

**Agregado en: v17.0.0**

- Devuelve: this

El método `rl.rollback` borra la lista interna de acciones pendientes sin enviarla al `stream` asociado.

### `readlinePromises.createInterface(options)` {#readlinepromisescreateinterfaceoptions}

**Agregado en: v17.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable) El stream [Readable](/es/nodejs/api/stream#readable-streams) para escuchar. Esta opción es *obligatoria*.
    - `output` [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable) El stream [Writable](/es/nodejs/api/stream#writable-streams) para escribir los datos de readline.
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función opcional utilizada para la autocompletación con Tab.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si los streams `input` y `output` deben tratarse como un TTY, y se deben escribir códigos de escape ANSI/VT100. **Predeterminado:** verificar `isTTY` en el stream `output` al momento de la instanciación.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista inicial de líneas del historial. Esta opción tiene sentido solo si `terminal` está configurado como `true` por el usuario o por una verificación `output` interna, de lo contrario, el mecanismo de almacenamiento en caché del historial no se inicializa en absoluto. **Predeterminado:** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número máximo de líneas de historial retenidas. Para deshabilitar el historial, establezca este valor en `0`. Esta opción tiene sentido solo si `terminal` está configurado como `true` por el usuario o por una verificación `output` interna, de lo contrario, el mecanismo de almacenamiento en caché del historial no se inicializa en absoluto. **Predeterminado:** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, cuando una nueva línea de entrada agregada a la lista del historial duplica una anterior, esto elimina la línea anterior de la lista. **Predeterminado:** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La cadena de prompt para usar. **Predeterminado:** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si el retraso entre `\r` y `\n` excede `crlfDelay` milisegundos, tanto `\r` como `\n` se tratarán como entradas de fin de línea separadas. `crlfDelay` se convertirá a un número no menor que `100`. Se puede establecer en `Infinity`, en cuyo caso `\r` seguido de `\n` siempre se considerará una sola nueva línea (lo cual puede ser razonable para [leer archivos](/es/nodejs/api/readline#example-read-file-stream-line-by-line) con el delimitador de línea `\r\n`). **Predeterminado:** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La duración que `readlinePromises` esperará por un carácter (al leer una secuencia de teclas ambigua en milisegundos, una que puede formar una secuencia de teclas completa usando la entrada leída hasta ahora y puede tomar entrada adicional para completar una secuencia de teclas más larga). **Predeterminado:** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de espacios a los que equivale una tabulación (mínimo 1). **Predeterminado:** `8`.
  
 
- Devuelve: [\<readlinePromises.Interface\>](/es/nodejs/api/readline#class-readlinepromisesinterface)

El método `readlinePromises.createInterface()` crea una nueva instancia de `readlinePromises.Interface`.



::: code-group
```js [ESM]
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline/promises');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

Una vez que se crea la instancia de `readlinePromises.Interface`, el caso más común es escuchar el evento `'line'`:

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
Si `terminal` es `true` para esta instancia, entonces el stream `output` obtendrá la mejor compatibilidad si define una propiedad `output.columns` y emite un evento `'resize'` en el `output` si o cuando las columnas cambien ([`process.stdout`](/es/nodejs/api/process#processstdout) hace esto automáticamente cuando es un TTY).


#### Uso de la función `completer` {#use-of-the-completer-function}

La función `completer` toma la línea actual ingresada por el usuario como un argumento y devuelve un `Array` con 2 entradas:

- Un `Array` con entradas coincidentes para la finalización.
- La subcadena que se utilizó para la coincidencia.

Por ejemplo: `[[substr1, substr2, ...], originalsubstring]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : completions, line];
}
```
La función `completer` también puede devolver un [\<Promise\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise) o ser asíncrona:

```js [ESM]
async function completer(linePartial) {
  await someAsyncWork();
  return [['123'], linePartial];
}
```
## API de Callback {#callback-api}

**Agregado en: v0.1.104**

### Clase: `readline.Interface` {#class-readlineinterface}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.0.0 | La clase `readline.Interface` ahora hereda de `Interface`. |
| v0.1.104 | Agregado en: v0.1.104 |
:::

- Extiende: [\<readline.InterfaceConstructor\>](/es/nodejs/api/readline#class-interfaceconstructor)

Las instancias de la clase `readline.Interface` se construyen utilizando el método `readline.createInterface()`. Cada instancia está asociada con un único flujo `input` [Readable](/es/nodejs/api/stream#readable-streams) y un único flujo `output` [Writable](/es/nodejs/api/stream#writable-streams). El flujo `output` se utiliza para imprimir mensajes para la entrada del usuario que llega en el flujo `input` y se lee desde él.

#### `rl.question(query[, options], callback)` {#rlquestionquery-options-callback}

**Agregado en: v0.3.3**

- `query` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) Una declaración o consulta para escribir en `output`, antepuesta al mensaje.
- `options` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Opcionalmente, permite cancelar `question()` usando un `AbortController`.


- `callback` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función de callback que se invoca con la entrada del usuario en respuesta a la `query`.

El método `rl.question()` muestra la `query` escribiéndola en la `output`, espera a que se proporcione la entrada del usuario en `input`, luego invoca la función `callback` pasando la entrada proporcionada como el primer argumento.

Cuando se llama, `rl.question()` reanudará el flujo `input` si se ha pausado.

Si el `readline.Interface` se creó con `output` establecido en `null` o `undefined`, la `query` no se escribe.

La función `callback` pasada a `rl.question()` no sigue el patrón típico de aceptar un objeto `Error` o `null` como el primer argumento. Se llama al `callback` con la respuesta proporcionada como el único argumento.

Se generará un error si se llama a `rl.question()` después de `rl.close()`.

Ejemplo de uso:

```js [ESM]
rl.question('¿Cuál es tu comida favorita? ', (answer) => {
  console.log(`Ah, entonces tu comida favorita es ${answer}`);
});
```
Usando un `AbortController` para cancelar una pregunta.

```js [ESM]
const ac = new AbortController();
const signal = ac.signal;

rl.question('¿Cuál es tu comida favorita? ', { signal }, (answer) => {
  console.log(`Ah, entonces tu comida favorita es ${answer}`);
});

signal.addEventListener('abort', () => {
  console.log('La pregunta sobre la comida se agotó');
}, { once: true });

setTimeout(() => ac.abort(), 10000);
```

### `readline.clearLine(stream, dir[, callback])` {#readlineclearlinestream-dir-callback}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v12.7.0 | La callback de write() del stream y el valor de retorno están expuestos. |
| v0.7.7 | Añadido en: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable)
- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: a la izquierda desde el cursor
    - `1`: a la derecha desde el cursor
    - `0`: la línea completa


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocada una vez que la operación se completa.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si `stream` desea que el código de llamada espere a que el evento `'drain'` sea emitido antes de continuar escribiendo datos adicionales; de lo contrario, `true`.

El método `readline.clearLine()` limpia la línea actual del stream [TTY](/es/nodejs/api/tty) dado en una dirección especificada identificada por `dir`.

### `readline.clearScreenDown(stream[, callback])` {#readlineclearscreendownstream-callback}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v12.7.0 | La callback de write() del stream y el valor de retorno están expuestos. |
| v0.7.7 | Añadido en: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocada una vez que la operación se completa.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si `stream` desea que el código de llamada espere a que el evento `'drain'` sea emitido antes de continuar escribiendo datos adicionales; de lo contrario, `true`.

El método `readline.clearScreenDown()` limpia el stream [TTY](/es/nodejs/api/tty) dado desde la posición actual del cursor hacia abajo.


### `readline.createInterface(options)` {#readlinecreateinterfaceoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.14.0, v14.18.0 | La opción `signal` ahora es compatible. |
| v15.8.0, v14.18.0 | La opción `history` ahora es compatible. |
| v13.9.0 | La opción `tabSize` ahora es compatible. |
| v8.3.0, v6.11.4 | Eliminar el límite máximo de la opción `crlfDelay`. |
| v6.6.0 | La opción `crlfDelay` ahora es compatible. |
| v6.3.0 | La opción `prompt` ahora es compatible. |
| v6.0.0 | La opción `historySize` ahora puede ser `0`. |
| v0.1.98 | Añadido en: v0.1.98 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable) El flujo [Readable](/es/nodejs/api/stream#readable-streams) para escuchar. Esta opción es *obligatoria*.
    - `output` [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable) El flujo [Writable](/es/nodejs/api/stream#writable-streams) para escribir datos de readline.
    - `completer` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función opcional utilizada para la autocompletación con la tecla Tab.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si los flujos `input` y `output` deben tratarse como un TTY y tener códigos de escape ANSI/VT100 escritos en él. **Predeterminado:** comprobar `isTTY` en el flujo `output` al instanciar.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista inicial de líneas del historial. Esta opción tiene sentido solo si `terminal` se establece en `true` por el usuario o por una comprobación interna de `output`; de lo contrario, el mecanismo de almacenamiento en caché del historial no se inicializa en absoluto. **Predeterminado:** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número máximo de líneas del historial retenidas. Para deshabilitar el historial, establezca este valor en `0`. Esta opción tiene sentido solo si `terminal` se establece en `true` por el usuario o por una comprobación interna de `output`; de lo contrario, el mecanismo de almacenamiento en caché del historial no se inicializa en absoluto. **Predeterminado:** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, cuando una nueva línea de entrada añadida a la lista del historial duplica una anterior, esto elimina la línea anterior de la lista. **Predeterminado:** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La cadena de solicitud (prompt) que se utilizará. **Predeterminado:** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si el retraso entre `\r` y `\n` supera los `crlfDelay` milisegundos, tanto `\r` como `\n` se tratarán como entradas de fin de línea separadas. `crlfDelay` se convertirá en un número no inferior a `100`. Se puede establecer en `Infinity`, en cuyo caso `\r` seguido de `\n` siempre se considerará una única nueva línea (lo cual puede ser razonable para [leer archivos](/es/nodejs/api/readline#example-read-file-stream-line-by-line) con el delimitador de línea `\r\n`). **Predeterminado:** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La duración que `readline` esperará un carácter (al leer una secuencia de teclas ambigua en milisegundos, una que puede formar una secuencia de teclas completa utilizando la entrada leída hasta ahora y puede tomar entrada adicional para completar una secuencia de teclas más larga). **Predeterminado:** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de espacios al que equivale una tabulación (mínimo 1). **Predeterminado:** `8`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite cerrar la interfaz utilizando un AbortSignal. La anulación de la señal llamará internamente a `close` en la interfaz.

- Devuelve: [\<readline.Interface\>](/es/nodejs/api/readline#class-readlineinterface)

El método `readline.createInterface()` crea una nueva instancia de `readline.Interface`.

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

Una vez creada la instancia de `readline.Interface`, el caso más común es escuchar el evento `'line'`:

```js [ESM]
rl.on('line', (line) => {
  console.log(`Recibido: ${line}`);
});
```
Si `terminal` es `true` para esta instancia, entonces el flujo `output` obtendrá la mejor compatibilidad si define una propiedad `output.columns` y emite un evento `'resize'` en el `output` si las columnas cambian alguna vez ([`process.stdout`](/es/nodejs/api/process#processstdout) hace esto automáticamente cuando es un TTY).

Al crear una `readline.Interface` utilizando `stdin` como entrada, el programa no finalizará hasta que reciba un [carácter EOF](https://en.wikipedia.org/wiki/End-of-file#EOF_character). Para salir sin esperar la entrada del usuario, llame a `process.stdin.unref()`.


#### Uso de la función `completer` {#use-of-the-completer-function_1}

La función `completer` toma la línea actual introducida por el usuario como argumento y devuelve un `Array` con 2 entradas:

- Un `Array` con las entradas coincidentes para la autocompletación.
- La subcadena que se utilizó para la coincidencia.

Por ejemplo: `[[substr1, substr2, ...], originalsubstring]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Mostrar todas las autocompletaciones si no se encuentra ninguna
  return [hits.length ? hits : completions, line];
}
```
La función `completer` se puede llamar de forma asíncrona si acepta dos argumentos:

```js [ESM]
function completer(linePartial, callback) {
  callback(null, [['123'], linePartial]);
}
```
### `readline.cursorTo(stream, x[, y][, callback])` {#readlinecursortostream-x-y-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Se exponen la devolución de llamada write() y el valor de retorno del stream. |
| v0.7.7 | Agregado en: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable)
- `x` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) Se invoca una vez que se completa la operación.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si `stream` desea que el código de llamada espere a que se emita el evento `'drain'` antes de continuar escribiendo datos adicionales; de lo contrario, `true`.

El método `readline.cursorTo()` mueve el cursor a la posición especificada en un `stream` [TTY](/es/nodejs/api/tty) dado.

### `readline.moveCursor(stream, dx, dy[, callback])` {#readlinemovecursorstream-dx-dy-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Se exponen la devolución de llamada write() y el valor de retorno del stream. |
| v0.7.7 | Agregado en: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable)
- `dx` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) Se invoca una vez que se completa la operación.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si `stream` desea que el código de llamada espere a que se emita el evento `'drain'` antes de continuar escribiendo datos adicionales; de lo contrario, `true`.

El método `readline.moveCursor()` mueve el cursor *relativamente* a su posición actual en un `stream` [TTY](/es/nodejs/api/tty) dado.


## `readline.emitKeypressEvents(stream[, interface])` {#readlineemitkeypresseventsstream-interface}

**Agregado en: v0.7.7**

- `stream` [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable)
- `interface` [\<readline.InterfaceConstructor\>](/es/nodejs/api/readline#class-interfaceconstructor)

El método `readline.emitKeypressEvents()` hace que el flujo [Readable](/es/nodejs/api/stream#readable-streams) dado comience a emitir eventos `'keypress'` correspondientes a la entrada recibida.

Opcionalmente, `interface` especifica una instancia de `readline.Interface` para la cual se deshabilita la autocompletación cuando se detecta una entrada copiada y pegada.

Si el `stream` es un [TTY](/es/nodejs/api/tty), entonces debe estar en modo raw.

Esto es llamado automáticamente por cualquier instancia de readline en su `input` si el `input` es una terminal. Cerrar la instancia de `readline` no detiene la emisión de eventos `'keypress'` por parte del `input`.

```js [ESM]
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
```
## Ejemplo: CLI Pequeña {#example-tiny-cli}

El siguiente ejemplo ilustra el uso de la clase `readline.Interface` para implementar una pequeña interfaz de línea de comandos:

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { exit, stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  exit(0);
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
```
:::


## Ejemplo: Leer un flujo de archivos línea por línea {#example-read-file-stream-line-by-line}

Un caso de uso común para `readline` es consumir un archivo de entrada una línea a la vez. La forma más fácil de hacerlo es aprovechando la API [`fs.ReadStream`](/es/nodejs/api/fs#class-fsreadstream) así como un bucle `for await...of`:

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
  }
}

processLineByLine();
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
  }
}

processLineByLine();
```
:::

Alternativamente, uno podría usar el evento [`'line'`](/es/nodejs/api/readline#event-line):

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});
```
:::

Actualmente, el bucle `for await...of` puede ser un poco más lento. Si el flujo `async` / `await` y la velocidad son esenciales, se puede aplicar un enfoque mixto:

::: code-group
```js [ESM]
import { once } from 'node:events';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```

```js [CJS]
const { once } = require('node:events');
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```
:::


## Atajos de teclado TTY {#tty-keybindings}

| Atajos de teclado | Descripción | Notas |
|---|---|---|
|   +    +   | Borrar línea a la izquierda | No funciona en Linux, Mac ni Windows |
|   +    +   | Borrar línea a la derecha | No funciona en Mac |
|   +   | Emitir   `SIGINT`   o cerrar la instancia de readline ||
|   +   | Borrar a la izquierda ||
|   +   | Borrar a la derecha o cerrar la instancia de readline en caso de que la línea actual esté vacía / EOF | No funciona en Windows |
|   +   | Borrar desde la posición actual hasta el inicio de la línea ||
|   +   | Borrar desde la posición actual hasta el final de la línea ||
|   +   | Pegar (Recordar) el texto borrado previamente | Solo funciona con texto borrado por     +     o     +   |
|   +   | Ciclar entre textos borrados previamente | Solo disponible cuando la última pulsación es     +     o     +   |
|   +   | Ir al inicio de la línea ||
|   +   | Ir al final de la línea ||
|   +   | Retroceder un carácter ||
|   +   | Avanzar un carácter ||
|   +   | Limpiar la pantalla ||
|   +   | Siguiente elemento del historial ||
|   +   | Elemento anterior del historial ||
|   +   | Deshacer el cambio anterior | Cualquier pulsación de tecla que emita el código de tecla   `0x1F`   realizará esta acción.     En muchos terminales, por ejemplo   `xterm`  ,     esto está vinculado a     +    . |
|   +   | Rehacer el cambio anterior | Muchos terminales no tienen una pulsación de tecla predeterminada para rehacer.     Elegimos el código de tecla   `0x1E`   para realizar la acción de rehacer.     En   `xterm`  , está vinculado a     +         de forma predeterminada. |
|   +   | Mueve el proceso en ejecución al segundo plano. Escriba       `fg`   y presione          para regresar. | No funciona en Windows |
|   +     o         +   | Borrar hacia atrás hasta un límite de palabra |   +     No funciona     en Linux, Mac ni Windows |
|   +   | Borrar hacia adelante hasta un límite de palabra | No funciona en Mac |
|   +     o         +   | Palabra a la izquierda |   +     No funciona     en Mac |
|   +     o         +   | Palabra a la derecha |   +     No funciona     en Mac |
|   +     o         +   | Borrar palabra a la derecha |   +     No funciona     en Windows |
|   +   | Borrar palabra a la izquierda | No funciona en Mac |

