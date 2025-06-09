---
title: Documentación de REPL de Node.js
description: Explora el REPL de Node.js (Read-Eval-Print Loop) que proporciona un entorno interactivo para ejecutar código JavaScript, depurar y probar aplicaciones de Node.js.
head:
  - - meta
    - name: og:title
      content: Documentación de REPL de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explora el REPL de Node.js (Read-Eval-Print Loop) que proporciona un entorno interactivo para ejecutar código JavaScript, depurar y probar aplicaciones de Node.js.
  - - meta
    - name: twitter:title
      content: Documentación de REPL de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explora el REPL de Node.js (Read-Eval-Print Loop) que proporciona un entorno interactivo para ejecutar código JavaScript, depurar y probar aplicaciones de Node.js.
---


# REPL {#repl}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/repl.js](https://github.com/nodejs/node/blob/v23.5.0/lib/repl.js)

El módulo `node:repl` proporciona una implementación de Read-Eval-Print-Loop (REPL) que está disponible tanto como un programa independiente como para incluirse en otras aplicaciones. Se puede acceder a él usando:

::: code-group
```js [ESM]
import repl from 'node:repl';
```

```js [CJS]
const repl = require('node:repl');
```
:::

## Diseño y características {#design-and-features}

El módulo `node:repl` exporta la clase [`repl.REPLServer`](/es/nodejs/api/repl#class-replserver). Mientras se ejecuta, las instancias de [`repl.REPLServer`](/es/nodejs/api/repl#class-replserver) aceptarán líneas individuales de entrada del usuario, las evaluarán de acuerdo con una función de evaluación definida por el usuario y luego generarán el resultado. La entrada y la salida pueden ser de `stdin` y `stdout`, respectivamente, o pueden estar conectadas a cualquier [stream](/es/nodejs/api/stream) de Node.js.

Las instancias de [`repl.REPLServer`](/es/nodejs/api/repl#class-replserver) admiten la compleción automática de entradas, la vista previa de la compleción, la edición de líneas simplista al estilo Emacs, las entradas de varias líneas, la búsqueda inversa tipo [ZSH](https://en.wikipedia.org/wiki/Z_shell), la búsqueda de historial basada en subcadenas tipo [ZSH](https://en.wikipedia.org/wiki/Z_shell), la salida con estilo ANSI, el guardado y la restauración del estado actual de la sesión REPL, la recuperación de errores y las funciones de evaluación personalizables. Los terminales que no admiten estilos ANSI y la edición de líneas al estilo Emacs recurren automáticamente a un conjunto de características limitado.

### Comandos y teclas especiales {#commands-and-special-keys}

Todos los casos de REPL admiten los siguientes comandos especiales:

- `.break`: Cuando se está en el proceso de introducir una expresión de varias líneas, introduzca el comando `.break` (o pulse +) para abortar la posterior entrada o procesamiento de esa expresión.
- `.clear`: Restablece el `context` de REPL a un objeto vacío y borra cualquier expresión de varias líneas que se esté introduciendo.
- `.exit`: Cierra el flujo de E/S, provocando la salida del REPL.
- `.help`: Muestra esta lista de comandos especiales.
- `.save`: Guarda la sesión REPL actual en un archivo: `\> .save ./file/to/save.js`
- `.load`: Carga un archivo en la sesión REPL actual. `\> .load ./file/to/load.js`
- `.editor`: Entra en modo editor (+ para terminar, + para cancelar).

```bash [BASH]
> .editor
// Entering editor mode (^D to finish, ^C to cancel)
function welcome(name) {
  return `Hello ${name}!`;
}

welcome('Node.js User');

// ^D
'Hello Node.js User!'
>
```
Las siguientes combinaciones de teclas en el REPL tienen estos efectos especiales:

- +: Cuando se pulsa una vez, tiene el mismo efecto que el comando `.break`. Cuando se pulsa dos veces en una línea en blanco, tiene el mismo efecto que el comando `.exit`.
- +: Tiene el mismo efecto que el comando `.exit`.
- : Cuando se pulsa en una línea en blanco, muestra las variables globales y locales (ámbito). Cuando se pulsa al introducir otra entrada, muestra las opciones de autocompletado relevantes.

Para los atajos de teclado relacionados con la búsqueda inversa, vea [`reverse-i-search`](/es/nodejs/api/repl#reverse-i-search). Para todos los demás atajos de teclado, vea [Atajos de teclado TTY](/es/nodejs/api/readline#tty-keybindings).


### Evaluación predeterminada {#default-evaluation}

De forma predeterminada, todas las instancias de [`repl.REPLServer`](/es/nodejs/api/repl#class-replserver) usan una función de evaluación que evalúa expresiones de JavaScript y proporciona acceso a los módulos integrados de Node.js. Este comportamiento predeterminado se puede anular pasando una función de evaluación alternativa cuando se crea la instancia de [`repl.REPLServer`](/es/nodejs/api/repl#class-replserver).

#### Expresiones de JavaScript {#javascript-expressions}

El evaluador predeterminado admite la evaluación directa de expresiones de JavaScript:

```bash [BASH]
> 1 + 1
2
> const m = 2
undefined
> m + 1
3
```
A menos que se definan dentro de bloques o funciones, las variables declaradas implícitamente o usando las palabras clave `const`, `let` o `var` se declaran en el ámbito global.

#### Ámbito global y local {#global-and-local-scope}

El evaluador predeterminado proporciona acceso a cualquier variable que exista en el ámbito global. Es posible exponer una variable al REPL explícitamente asignándola al objeto `context` asociado con cada `REPLServer`:

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

repl.start('> ').context.m = msg;
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

repl.start('> ').context.m = msg;
```
:::

Las propiedades en el objeto `context` aparecen como locales dentro del REPL:

```bash [BASH]
$ node repl_test.js
> m
'message'
```
Las propiedades de contexto no son de solo lectura de forma predeterminada. Para especificar globales de solo lectura, las propiedades de contexto deben definirse utilizando `Object.defineProperty()`:

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```
:::

#### Acceder a los módulos centrales de Node.js {#accessing-core-nodejs-modules}

El evaluador predeterminado cargará automáticamente los módulos centrales de Node.js en el entorno REPL cuando se utilicen. Por ejemplo, a menos que se declare como una variable global o de ámbito, la entrada `fs` se evaluará a pedido como `global.fs = require('node:fs')`.

```bash [BASH]
> fs.createReadStream('./some/file');
```

#### Excepciones globales no capturadas {#global-uncaught-exceptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.3.0 | El evento `'uncaughtException'` se activa a partir de ahora si el REPL se utiliza como programa independiente. |
:::

El REPL utiliza el módulo [`domain`](/es/nodejs/api/domain) para capturar todas las excepciones no capturadas para esa sesión de REPL.

Este uso del módulo [`domain`](/es/nodejs/api/domain) en el REPL tiene estos efectos secundarios:

- Las excepciones no capturadas solo emiten el evento [`'uncaughtException'`](/es/nodejs/api/process#event-uncaughtexception) en el REPL independiente. Agregar un detector para este evento en un REPL dentro de otro programa de Node.js da como resultado [`ERR_INVALID_REPL_INPUT`](/es/nodejs/api/errors#err_invalid_repl_input).
- Intentar usar [`process.setUncaughtExceptionCaptureCallback()`](/es/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) lanza un error [`ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE`](/es/nodejs/api/errors#err_domain_cannot_set_uncaught_exception_capture).

#### Asignación de la variable `_` (guion bajo) {#assignment-of-the-_-underscore-variable}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.8.0 | Se añadió soporte para `_error`. |
:::

El evaluador predeterminado, de forma predeterminada, asignará el resultado de la expresión evaluada más recientemente a la variable especial `_` (guion bajo). Establecer explícitamente `_` en un valor desactivará este comportamiento.

```bash [BASH]
> [ 'a', 'b', 'c' ]
[ 'a', 'b', 'c' ]
> _.length
3
> _ += 1
Asignación de expresión a _ ahora deshabilitada.
4
> 1 + 1
2
> _
4
```
Del mismo modo, `_error` se referirá al último error visto, si lo hubo. Establecer explícitamente `_error` en un valor desactivará este comportamiento.

```bash [BASH]
> throw new Error('foo');
Uncaught Error: foo
> _error.message
'foo'
```
#### Palabra clave `await` {#await-keyword}

El soporte para la palabra clave `await` está habilitado en el nivel superior.

```bash [BASH]
> await Promise.resolve(123)
123
> await Promise.reject(new Error('REPL await'))
Uncaught Error: REPL await
    at REPL2:1:54
> const timeout = util.promisify(setTimeout);
undefined
> const old = Date.now(); await timeout(1000); console.log(Date.now() - old);
1002
undefined
```
Una limitación conocida del uso de la palabra clave `await` en el REPL es que invalidará el alcance léxico de las palabras clave `const` y `let`.

Por ejemplo:

```bash [BASH]
> const m = await Promise.resolve(123)
undefined
> m
123
> const m = await Promise.resolve(234)
undefined
> m
234
```
[`--no-experimental-repl-await`](/es/nodejs/api/cli#--no-experimental-repl-await) deberá deshabilitar await de nivel superior en REPL.


### Búsqueda inversa incremental {#reverse-i-search}

**Añadido en: v13.6.0, v12.17.0**

El REPL admite la búsqueda inversa incremental bidireccional similar a [ZSH](https://en.wikipedia.org/wiki/Z_shell). Se activa con + para buscar hacia atrás y + para buscar hacia adelante.

Las entradas de historial duplicadas se omitirán.

Las entradas se aceptan tan pronto como se presiona cualquier tecla que no se corresponda con la búsqueda inversa. La cancelación es posible presionando o +.

Cambiar la dirección busca inmediatamente la siguiente entrada en la dirección esperada desde la posición actual.

### Funciones de evaluación personalizadas {#custom-evaluation-functions}

Cuando se crea un nuevo [`repl.REPLServer`](/es/nodejs/api/repl#class-replserver), se puede proporcionar una función de evaluación personalizada. Esto se puede usar, por ejemplo, para implementar aplicaciones REPL totalmente personalizadas.

Lo siguiente ilustra un ejemplo de un REPL que eleva al cuadrado un número dado:

::: code-group
```js [ESM]
import repl from 'node:repl';

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Introduce un número: ', eval: myEval });
```

```js [CJS]
const repl = require('node:repl');

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Introduce un número: ', eval: myEval });
```
:::

#### Errores recuperables {#recoverable-errors}

En el prompt de REPL, al presionar  se envía la línea de entrada actual a la función `eval`. Para admitir la entrada de varias líneas, la función `eval` puede devolver una instancia de `repl.Recoverable` a la función de devolución de llamada proporcionada:

```js [ESM]
function myEval(cmd, context, filename, callback) {
  let result;
  try {
    result = vm.runInThisContext(cmd);
  } catch (e) {
    if (isRecoverableError(e)) {
      return callback(new repl.Recoverable(e));
    }
  }
  callback(null, result);
}

function isRecoverableError(error) {
  if (error.name === 'SyntaxError') {
    return /^(Unexpected end of input|Unexpected token)/.test(error.message);
  }
  return false;
}
```

### Personalización de la salida de REPL {#customizing-repl-output}

Por defecto, las instancias de [`repl.REPLServer`](/es/nodejs/api/repl#class-replserver) formatean la salida utilizando el método [`util.inspect()`](/es/nodejs/api/util#utilinspectobject-options) antes de escribir la salida en el flujo `Writable` proporcionado (`process.stdout` por defecto). La opción de inspección `showProxy` está establecida en true por defecto y la opción `colors` está establecida en true dependiendo de la opción `useColors` de REPL.

La opción booleana `useColors` puede especificarse en la construcción para indicar al escritor predeterminado que utilice códigos de estilo ANSI para colorear la salida del método `util.inspect()`.

Si el REPL se ejecuta como un programa independiente, también es posible cambiar los [valores predeterminados de inspección](/es/nodejs/api/util#utilinspectobject-options) del REPL desde dentro del REPL utilizando la propiedad `inspect.replDefaults` que refleja las `defaultOptions` de [`util.inspect()`](/es/nodejs/api/util#utilinspectobject-options).

```bash [BASH]
> util.inspect.replDefaults.compact = false;
false
> [1]
[
  1
]
>
```
Para personalizar completamente la salida de una instancia [`repl.REPLServer`](/es/nodejs/api/repl#class-replserver) pase una nueva función para la opción `writer` en la construcción. El siguiente ejemplo, por ejemplo, simplemente convierte cualquier texto de entrada a mayúsculas:



::: code-group
```js [ESM]
import repl from 'node:repl';

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```

```js [CJS]
const repl = require('node:repl');

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```
:::

## Clase: `REPLServer` {#class-replserver}

**Agregado en: v0.1.91**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ver [`repl.start()`](/es/nodejs/api/repl#replstartoptions)
- Extiende: [\<readline.Interface\>](/es/nodejs/api/readline#class-readlineinterface)

Las instancias de `repl.REPLServer` se crean utilizando el método [`repl.start()`](/es/nodejs/api/repl#replstartoptions) o directamente utilizando la palabra clave JavaScript `new`.



::: code-group
```js [ESM]
import repl from 'node:repl';

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```

```js [CJS]
const repl = require('node:repl');

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```
:::


### Evento: `'exit'` {#event-exit}

**Añadido en: v0.7.7**

El evento `'exit'` se emite cuando se sale del REPL ya sea al recibir el comando `.exit` como entrada, al presionar el usuario + dos veces para señalar `SIGINT`, o al presionar + para señalar `'end'` en el flujo de entrada. La retrollamada del oyente se invoca sin ningún argumento.

```js [ESM]
replServer.on('exit', () => {
  console.log('¡Recibido evento "exit" del repl!');
  process.exit();
});
```
### Evento: `'reset'` {#event-reset}

**Añadido en: v0.11.0**

El evento `'reset'` se emite cuando el contexto del REPL se reinicia. Esto ocurre cada vez que se recibe el comando `.clear` como entrada *a menos que* el REPL esté utilizando el evaluador predeterminado y la instancia `repl.REPLServer` se haya creado con la opción `useGlobal` establecida en `true`. Se llamará a la retrollamada del oyente con una referencia al objeto `context` como único argumento.

Esto se puede utilizar principalmente para reinicializar el contexto REPL a algún estado predefinido:

::: code-group
```js [ESM]
import repl from 'node:repl';

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```

```js [CJS]
const repl = require('node:repl');

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```
:::

Cuando se ejecuta este código, la variable global `'m'` se puede modificar pero luego se restablece a su valor inicial utilizando el comando `.clear`:

```bash [BASH]
$ ./node example.js
> m
'test'
> m = 1
1
> m
1
> .clear
Clearing context...
> m
'test'
>
```
### `replServer.defineCommand(keyword, cmd)` {#replserverdefinecommandkeyword-cmd}

**Añadido en: v0.3.0**

- `keyword` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La palabra clave del comando (*sin* un carácter `.` inicial).
- `cmd` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función que se invocará cuando se procese el comando.

El método `replServer.defineCommand()` se utiliza para agregar nuevos comandos con el prefijo `.` a la instancia REPL. Dichos comandos se invocan escribiendo un `.` seguido de la `keyword`. El `cmd` es una `Function` o un `Object` con las siguientes propiedades:

- `help` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Texto de ayuda que se mostrará cuando se ingrese `.help` (Opcional).
- `action` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función para ejecutar, que opcionalmente acepta un único argumento de cadena.

El siguiente ejemplo muestra dos nuevos comandos agregados a la instancia REPL:

::: code-group
```js [ESM]
import repl from 'node:repl';

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```

```js [CJS]
const repl = require('node:repl');

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```
:::

Los nuevos comandos se pueden utilizar desde dentro de la instancia REPL:

```bash [BASH]
> .sayhello Node.js User
Hello, Node.js User!
> .saybye
Goodbye!
```

### `replServer.displayPrompt([preserveCursor])` {#replserverdisplaypromptpreservecursor}

**Añadido en: v0.1.91**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

El método `replServer.displayPrompt()` prepara la instancia REPL para recibir la entrada del usuario, imprimiendo el `prompt` configurado en una nueva línea en la `output` y reanudando la `input` para aceptar nueva entrada.

Cuando se introduce una entrada de varias líneas, se imprime una elipsis en lugar del 'prompt'.

Cuando `preserveCursor` es `true`, la colocación del cursor no se restablecerá a `0`.

El método `replServer.displayPrompt` está destinado principalmente a ser llamado desde dentro de la función de acción para los comandos registrados usando el método `replServer.defineCommand()`.

### `replServer.clearBufferedCommand()` {#replserverclearbufferedcommand}

**Añadido en: v9.0.0**

El método `replServer.clearBufferedCommand()` borra cualquier comando que haya sido almacenado en búfer pero aún no ejecutado. Este método está destinado principalmente a ser llamado desde dentro de la función de acción para los comandos registrados usando el método `replServer.defineCommand()`.

### `replServer.setupHistory(historyPath, callback)` {#replserversetuphistoryhistorypath-callback}

**Añadido en: v11.10.0**

- `historyPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) la ruta al archivo de historial
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) llamada cuando las escrituras del historial están listas o en caso de error
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `repl` [\<repl.REPLServer\>](/es/nodejs/api/repl#class-replserver)
  
 

Inicializa un archivo de registro de historial para la instancia REPL. Al ejecutar el binario de Node.js y usar el REPL de línea de comandos, se inicializa un archivo de historial de forma predeterminada. Sin embargo, este no es el caso cuando se crea un REPL mediante programación. Utilice este método para inicializar un archivo de registro de historial cuando trabaje con instancias REPL mediante programación.

## `repl.builtinModules` {#replbuiltinmodules}

**Añadido en: v14.5.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Una lista de los nombres de todos los módulos de Node.js, por ejemplo, `'http'`.


## `repl.start([options])` {#replstartoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.4.0, v12.17.0 | La opción `preview` ahora está disponible. |
| v12.0.0 | La opción `terminal` ahora sigue la descripción predeterminada en todos los casos y `useColors` comprueba `hasColors()` si está disponible. |
| v10.0.0 | Se eliminó el `replMode` `REPL_MAGIC_MODE`. |
| v6.3.0 | Ahora se admite la opción `breakEvalOnSigint`. |
| v5.8.0 | El parámetro `options` ahora es opcional. |
| v0.1.91 | Añadido en: v0.1.91 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El indicador de entrada para mostrar. **Predeterminado:** `'\> '` (con un espacio al final).
    - `input` [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable) El flujo `Readable` desde el que se leerá la entrada REPL. **Predeterminado:** `process.stdin`.
    - `output` [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable) El flujo `Writable` al que se escribirá la salida REPL. **Predeterminado:** `process.stdout`.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, especifica que la `output` debe tratarse como un terminal TTY. **Predeterminado:** comprobar el valor de la propiedad `isTTY` en el flujo `output` al crear la instancia.
    - `eval` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función que se utilizará al evaluar cada línea de entrada dada. **Predeterminado:** un envoltorio asíncrono para la función `eval()` de JavaScript. Una función `eval` puede generar un error con `repl.Recoverable` para indicar que la entrada estaba incompleta y solicitar líneas adicionales.
    - `useColors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, especifica que la función `writer` predeterminada debe incluir el estilo de color ANSI para la salida REPL. Si se proporciona una función `writer` personalizada, esto no tiene ningún efecto. **Predeterminado:** comprobar la compatibilidad de color en el flujo `output` si el valor `terminal` de la instancia REPL es `true`.
    - `useGlobal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, especifica que la función de evaluación predeterminada utilizará el `global` de JavaScript como contexto en lugar de crear un nuevo contexto separado para la instancia REPL. El REPL de la CLI de node establece este valor en `true`. **Predeterminado:** `false`.
    - `ignoreUndefined` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, especifica que el escritor predeterminado no generará el valor de retorno de un comando si se evalúa como `undefined`. **Predeterminado:** `false`.
    - `writer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función que se invocará para formatear la salida de cada comando antes de escribir en `output`. **Predeterminado:** [`util.inspect()`](/es/nodejs/api/util#utilinspectobject-options).
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función opcional utilizada para la finalización automática de Tab personalizada. Consulte [`readline.InterfaceCompleter`](/es/nodejs/api/readline#use-of-the-completer-function) para ver un ejemplo.
    - `replMode` [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Un indicador que especifica si el evaluador predeterminado ejecuta todos los comandos de JavaScript en modo estricto o en modo predeterminado (flexible). Los valores aceptables son:
    - `repl.REPL_MODE_SLOPPY` para evaluar expresiones en modo flexible.
    - `repl.REPL_MODE_STRICT` para evaluar expresiones en modo estricto. Esto es equivalente a prefijar cada instrucción repl con `'use strict'`.

    - `breakEvalOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Deja de evaluar el fragmento de código actual cuando se recibe `SIGINT`, como cuando se presiona +. Esto no se puede usar junto con una función `eval` personalizada. **Predeterminado:** `false`.
    - `preview` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Define si el repl imprime vistas previas de autocompletado y salida o no. **Predeterminado:** `true` con la función eval predeterminada y `false` en caso de que se use una función eval personalizada. Si `terminal` es falso, entonces no hay vistas previas y el valor de `preview` no tiene ningún efecto.

- Devuelve: [\<repl.REPLServer\>](/es/nodejs/api/repl#class-replserver)

El método `repl.start()` crea e inicia una instancia de [`repl.REPLServer`](/es/nodejs/api/repl#class-replserver).

Si `options` es una cadena, entonces especifica el indicador de entrada:

::: code-group
```js [ESM]
import repl from 'node:repl';

// a Unix style prompt
repl.start('$ ');
```

```js [CJS]
const repl = require('node:repl');

// a Unix style prompt
repl.start('$ ');
```
:::


## El REPL de Node.js {#the-nodejs-repl}

Node.js utiliza el módulo `node:repl` para proporcionar su propia interfaz interactiva para ejecutar JavaScript. Esto se puede usar ejecutando el binario de Node.js sin pasar ningún argumento (o pasando el argumento `-i`):

```bash [BASH]
$ node
> const a = [1, 2, 3];
undefined
> a
[ 1, 2, 3 ]
> a.forEach((v) => {
...   console.log(v);
...   });
1
2
3
```
### Opciones de variables de entorno {#environment-variable-options}

Varios comportamientos del REPL de Node.js se pueden personalizar utilizando las siguientes variables de entorno:

- `NODE_REPL_HISTORY`: Cuando se proporciona una ruta válida, el historial persistente del REPL se guardará en el archivo especificado en lugar de `.node_repl_history` en el directorio de inicio del usuario. Establecer este valor en `''` (una cadena vacía) deshabilitará el historial persistente del REPL. Los espacios en blanco se eliminarán del valor. En las plataformas Windows, las variables de entorno con valores vacíos no son válidas, así que establece esta variable en uno o más espacios para deshabilitar el historial persistente del REPL.
- `NODE_REPL_HISTORY_SIZE`: Controla cuántas líneas de historial se conservarán si el historial está disponible. Debe ser un número positivo. **Predeterminado:** `1000`.
- `NODE_REPL_MODE`: Puede ser `'sloppy'` o `'strict'`. **Predeterminado:** `'sloppy'`, que permitirá que se ejecute código en modo no estricto.

### Historial persistente {#persistent-history}

De forma predeterminada, el REPL de Node.js conservará el historial entre las sesiones REPL de `node` guardando las entradas en un archivo `.node_repl_history` ubicado en el directorio de inicio del usuario. Esto se puede deshabilitar configurando la variable de entorno `NODE_REPL_HISTORY=''`.

### Usando el REPL de Node.js con editores de línea avanzados {#using-the-nodejs-repl-with-advanced-line-editors}

Para editores de línea avanzados, inicie Node.js con la variable de entorno `NODE_NO_READLINE=1`. Esto iniciará el REPL principal y el del depurador en la configuración de terminal canónica, lo que permitirá su uso con `rlwrap`.

Por ejemplo, lo siguiente se puede agregar a un archivo `.bashrc`:

```bash [BASH]
alias node="env NODE_NO_READLINE=1 rlwrap node"
```
### Iniciando múltiples instancias REPL contra una sola instancia en ejecución {#starting-multiple-repl-instances-against-a-single-running-instance}

Es posible crear y ejecutar múltiples instancias REPL contra una sola instancia en ejecución de Node.js que comparten un solo objeto `global` pero tienen interfaces de E/S separadas.

El siguiente ejemplo, por ejemplo, proporciona REPL separados en `stdin`, un socket Unix y un socket TCP:

::: code-group
```js [ESM]
import net from 'node:net';
import repl from 'node:repl';
import process from 'node:process';

let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```

```js [CJS]
const net = require('node:net');
const repl = require('node:repl');
let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```
:::

Ejecutar esta aplicación desde la línea de comandos iniciará un REPL en stdin. Otros clientes REPL pueden conectarse a través del socket Unix o el socket TCP. `telnet`, por ejemplo, es útil para conectarse a sockets TCP, mientras que `socat` se puede usar para conectarse a sockets Unix y TCP.

Al iniciar un REPL desde un servidor basado en sockets Unix en lugar de stdin, es posible conectarse a un proceso Node.js de larga duración sin reiniciarlo.

Para obtener un ejemplo de cómo ejecutar un REPL "con todas las funciones" (`terminal`) sobre una instancia de `net.Server` y `net.Socket`, consulta: [https://gist.github.com/TooTallNate/2209310](https://gist.github.com/TooTallNate/2209310).

Para obtener un ejemplo de cómo ejecutar una instancia REPL sobre [`curl(1)`](https://curl.haxx.se/docs/manpage), consulta: [https://gist.github.com/TooTallNate/2053342](https://gist.github.com/TooTallNate/2053342).

Este ejemplo tiene fines puramente educativos para demostrar cómo se pueden iniciar los REPL de Node.js utilizando diferentes flujos de E/S. **No** debe usarse en entornos de producción o en cualquier contexto donde la seguridad sea una preocupación sin medidas de protección adicionales. Si necesitas implementar REPL en una aplicación del mundo real, considera enfoques alternativos que mitiguen estos riesgos, como el uso de mecanismos de entrada seguros y evitar interfaces de red abiertas.

