---
title: Documentación de la API de Consola de Node.js
description: La API de Consola de Node.js proporciona una consola de depuración simple, similar al mecanismo de consola JavaScript que proporcionan los navegadores web. Esta documentación detalla los métodos disponibles para el registro, la depuración y la inspección de objetos JavaScript en un entorno Node.js.
head:
  - - meta
    - name: og:title
      content: Documentación de la API de Consola de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La API de Consola de Node.js proporciona una consola de depuración simple, similar al mecanismo de consola JavaScript que proporcionan los navegadores web. Esta documentación detalla los métodos disponibles para el registro, la depuración y la inspección de objetos JavaScript en un entorno Node.js.
  - - meta
    - name: twitter:title
      content: Documentación de la API de Consola de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La API de Consola de Node.js proporciona una consola de depuración simple, similar al mecanismo de consola JavaScript que proporcionan los navegadores web. Esta documentación detalla los métodos disponibles para el registro, la depuración y la inspección de objetos JavaScript en un entorno Node.js.
---


# Consola {#console}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código Fuente:** [lib/console.js](https://github.com/nodejs/node/blob/v23.5.0/lib/console.js)

El módulo `node:console` proporciona una consola de depuración simple que es similar al mecanismo de consola de JavaScript proporcionado por los navegadores web.

El módulo exporta dos componentes específicos:

- Una clase `Console` con métodos como `console.log()`, `console.error()` y `console.warn()` que se pueden usar para escribir en cualquier flujo de Node.js.
- Una instancia global `console` configurada para escribir en [`process.stdout`](/es/nodejs/api/process#processstdout) y [`process.stderr`](/es/nodejs/api/process#processstderr). La `console` global se puede usar sin llamar a `require('node:console')`.

*<strong>Advertencia</strong>*: Los métodos del objeto global `console` no son consistentemente síncronos como las API del navegador a las que se parecen, ni son consistentemente asíncronos como todos los demás flujos de Node.js. Los programas que deseen depender del comportamiento síncrono / asíncrono de las funciones de la consola deben primero averiguar la naturaleza del flujo de respaldo de la consola. Esto se debe a que el flujo depende de la plataforma subyacente y la configuración del flujo estándar del proceso actual. Consulte la [nota sobre E/S del proceso](/es/nodejs/api/process#a-note-on-process-io) para obtener más información.

Ejemplo usando la `console` global:

```js [ESM]
console.log('hola mundo');
// Imprime: hola mundo, a stdout
console.log('hola %s', 'mundo');
// Imprime: hola mundo, a stdout
console.error(new Error('Ups, algo malo pasó'));
// Imprime el mensaje de error y el seguimiento de la pila a stderr:
//   Error: Ups, algo malo pasó
//     en [eval]:5:15
//     en Script.runInThisContext (node:vm:132:18)
//     en Object.runInThisContext (node:vm:309:38)
//     en node:internal/process/execution:77:19
//     en [eval]-wrapper:6:22
//     en evalScript (node:internal/process/execution:76:60)
//     en node:internal/main/eval_string:23:3

const name = 'Will Robinson';
console.warn(`¡Peligro ${name}! ¡Peligro!`);
// Imprime: ¡Peligro Will Robinson! ¡Peligro!, a stderr
```
Ejemplo usando la clase `Console`:

```js [ESM]
const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);

myConsole.log('hola mundo');
// Imprime: hola mundo, a out
myConsole.log('hola %s', 'mundo');
// Imprime: hola mundo, a out
myConsole.error(new Error('Ups, algo malo pasó'));
// Imprime: [Error: Ups, algo malo pasó], a err

const name = 'Will Robinson';
myConsole.warn(`¡Peligro ${name}! ¡Peligro!`);
// Imprime: ¡Peligro Will Robinson! ¡Peligro!, a err
```

## Clase: `Console` {#class-console}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | Los errores que se produzcan al escribir en los flujos subyacentes ahora se ignorarán de forma predeterminada. |
:::

La clase `Console` se puede utilizar para crear un registrador simple con flujos de salida configurables y se puede acceder a ella utilizando `require('node:console').Console` o `console.Console` (o sus contrapartes desestructuradas):

::: code-group
```js [ESM]
import { Console } from 'node:console';
```

```js [CJS]
const { Console } = require('node:console');
```
:::

```js [ESM]
const { Console } = console;
```
### `new Console(stdout[, stderr][, ignoreErrors])` {#new-consolestdout-stderr-ignoreerrors}

### `new Console(options)` {#new-consoleoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.2.0, v12.17.0 | Se introdujo la opción `groupIndentation`. |
| v11.7.0 | Se introdujo la opción `inspectOptions`. |
| v10.0.0 | El constructor `Console` ahora admite un argumento `options`, y se introdujo la opción `colorMode`. |
| v8.0.0 | Se introdujo la opción `ignoreErrors`. |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stdout` [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable)
    - `stderr` [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable)
    - `ignoreErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ignora los errores al escribir en los flujos subyacentes. **Predeterminado:** `true`.
    - `colorMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Establece el soporte de color para esta instancia de `Console`. Establecer en `true` activa el coloreado al inspeccionar valores. Establecer en `false` desactiva el coloreado al inspeccionar valores. Establecer en `'auto'` hace que el soporte de color dependa del valor de la propiedad `isTTY` y del valor devuelto por `getColorDepth()` en el flujo respectivo. Esta opción no se puede utilizar si también se establece `inspectOptions.colors`. **Predeterminado:** `'auto'`.
    - `inspectOptions` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Especifica las opciones que se pasan a [`util.inspect()`](/es/nodejs/api/util#utilinspectobject-options).
    - `groupIndentation` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la sangría del grupo. **Predeterminado:** `2`.
  
 

Crea una nueva `Console` con una o dos instancias de flujo de escritura. `stdout` es un flujo de escritura para imprimir el registro o la salida de información. `stderr` se utiliza para la salida de advertencia o error. Si no se proporciona `stderr`, `stdout` se utiliza para `stderr`.

::: code-group
```js [ESM]
import { createWriteStream } from 'node:fs';
import { Console } from 'node:console';
// Alternatively
// const { Console } = console;

const output = createWriteStream('./stdout.log');
const errorOutput = createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```

```js [CJS]
const fs = require('node:fs');
const { Console } = require('node:console');
// Alternatively
// const { Console } = console;

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```
:::

La `console` global es una `Console` especial cuya salida se envía a [`process.stdout`](/es/nodejs/api/process#processstdout) y [`process.stderr`](/es/nodejs/api/process#processstderr). Es equivalente a llamar a:

```js [ESM]
new Console({ stdout: process.stdout, stderr: process.stderr });
```

### `console.assert(value[, ...message])` {#consoleassertvalue-message}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | La implementación ahora cumple con las especificaciones y ya no lanza errores. |
| v0.1.101 | Añadido en: v0.1.101 |
:::

- `value` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Tipos_de_datos) El valor probado para ser verdadero.
- `...message` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Tipos_de_datos) Todos los argumentos además de `value` se utilizan como mensaje de error.

`console.assert()` escribe un mensaje si `value` es [falso](https://developer.mozilla.org/es/docs/Glossary/Falsy) u omitido. Solo escribe un mensaje y no afecta la ejecución de otra manera. La salida siempre comienza con `"Assertion failed"`. Si se proporciona, `message` se formatea usando [`util.format()`](/es/nodejs/api/util#utilformatformat-args).

Si `value` es [verdadero](https://developer.mozilla.org/es/docs/Glossary/Truthy), no ocurre nada.

```js [ESM]
console.assert(true, 'no hace nada');

console.assert(false, 'Oops %s trabajo', 'no');
// Assertion failed: Oops no trabajo

console.assert();
// Assertion failed
```
### `console.clear()` {#consoleclear}

**Añadido en: v8.3.0**

Cuando `stdout` es un TTY, llamar a `console.clear()` intentará limpiar el TTY. Cuando `stdout` no es un TTY, este método no hace nada.

La operación específica de `console.clear()` puede variar entre sistemas operativos y tipos de terminales. Para la mayoría de los sistemas operativos Linux, `console.clear()` funciona de manera similar al comando de shell `clear`. En Windows, `console.clear()` borrará solo la salida en la ventana gráfica actual del terminal para el binario de Node.js.

### `console.count([label])` {#consolecountlabel}

**Añadido en: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Tipo_String) La etiqueta de visualización para el contador. **Predeterminado:** `'default'`.

Mantiene un contador interno específico de `label` y emite a `stdout` el número de veces que se ha llamado a `console.count()` con la `label` dada.

```js [ESM]
> console.count()
default: 1
undefined
> console.count('default')
default: 2
undefined
> console.count('abc')
abc: 1
undefined
> console.count('xyz')
xyz: 1
undefined
> console.count('abc')
abc: 2
undefined
> console.count()
default: 3
undefined
>
```

### `console.countReset([label])` {#consolecountresetlabel}

**Agregado en: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La etiqueta de visualización para el contador. **Predeterminado:** `'default'`.

Restablece el contador interno específico de `label`.

```js [ESM]
> console.count('abc');
abc: 1
undefined
> console.countReset('abc');
undefined
> console.count('abc');
abc: 1
undefined
>
```
### `console.debug(data[, ...args])` {#consoledebugdata-args}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.10.0 | `console.debug` ahora es un alias para `console.log`. |
| v8.0.0 | Agregado en: v8.0.0 |
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

La función `console.debug()` es un alias para [`console.log()`](/es/nodejs/api/console#consolelogdata-args).

### `console.dir(obj[, options])` {#consoledirobj-options}

**Agregado en: v0.1.101**

- `obj` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, también se mostrarán las propiedades no enumerables y de símbolos del objeto. **Predeterminado:** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Indica a [`util.inspect()`](/es/nodejs/api/util#utilinspectobject-options) cuántas veces debe recurrir al formatear el objeto. Esto es útil para inspeccionar objetos grandes y complicados. Para que recurra indefinidamente, pase `null`. **Predeterminado:** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, la salida se estilizará con códigos de color ANSI. Los colores son personalizables; consulte [personalización de los colores de `util.inspect()` ](/es/nodejs/api/util#customizing-utilinspect-colors). **Predeterminado:** `false`.
  
 

Utiliza [`util.inspect()`](/es/nodejs/api/util#utilinspectobject-options) en `obj` e imprime la cadena resultante en `stdout`. Esta función omite cualquier función `inspect()` personalizada definida en `obj`.


### `console.dirxml(...data)` {#consoledirxmldata}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.3.0 | `console.dirxml` ahora llama a `console.log` para sus argumentos. |
| v8.0.0 | Añadido en: v8.0.0 |
:::

- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Este método llama a `console.log()` pasándole los argumentos recibidos. Este método no produce ningún formato XML.

### `console.error([data][, ...args])` {#consoleerrordata-args}

**Añadido en: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Imprime en `stderr` con una nueva línea. Se pueden pasar múltiples argumentos, con el primero usado como el mensaje primario y todos los adicionales usados como valores de sustitución similar a [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) (todos los argumentos son pasados a [`util.format()`](/es/nodejs/api/util#utilformatformat-args)).

```js [ESM]
const code = 5;
console.error('error #%d', code);
// Imprime: error #5, a stderr
console.error('error', code);
// Imprime: error 5, a stderr
```
Si los elementos de formato (p. ej., `%d`) no se encuentran en la primera cadena, entonces se llama a [`util.inspect()`](/es/nodejs/api/util#utilinspectobject-options) en cada argumento y los valores de cadena resultantes se concatenan. Consulte [`util.format()`](/es/nodejs/api/util#utilformatformat-args) para obtener más información.

### `console.group([...label])` {#consolegrouplabel}

**Añadido en: v8.5.0**

- `...label` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Aumenta la indentación de las líneas siguientes en espacios para la longitud de `groupIndentation`.

Si se proporciona una o más `label`s, se imprimen primero sin la indentación adicional.

### `console.groupCollapsed()` {#consolegroupcollapsed}

**Añadido en: v8.5.0**

Un alias para [`console.group()`](/es/nodejs/api/console#consolegrouplabel).

### `console.groupEnd()` {#consolegroupend}

**Añadido en: v8.5.0**

Disminuye la indentación de las líneas siguientes en espacios para la longitud de `groupIndentation`.


### `console.info([data][, ...args])` {#consoleinfodata-args}

**Añadido en: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

La función `console.info()` es un alias de [`console.log()`](/es/nodejs/api/console#consolelogdata-args).

### `console.log([data][, ...args])` {#consolelogdata-args}

**Añadido en: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Imprime a `stdout` con una nueva línea. Se pueden pasar múltiples argumentos, utilizándose el primero como mensaje principal y todos los adicionales como valores de sustitución similares a [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) (todos los argumentos se pasan a [`util.format()`](/es/nodejs/api/util#utilformatformat-args)).

```js [ESM]
const count = 5;
console.log('count: %d', count);
// Imprime: count: 5, a stdout
console.log('count:', count);
// Imprime: count: 5, a stdout
```
Ver [`util.format()`](/es/nodejs/api/util#utilformatformat-args) para más información.

### `console.table(tabularData[, properties])` {#consoletabletabulardata-properties}

**Añadido en: v10.0.0**

- `tabularData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `properties` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Propiedades alternativas para construir la tabla.

Intenta construir una tabla con las columnas de las propiedades de `tabularData` (o usa `properties`) y las filas de `tabularData` y la registra. Vuelve a registrar solo el argumento si no se puede analizar como tabular.

```js [ESM]
// Estos no se pueden analizar como datos tabulares
console.table(Symbol());
// Symbol()

console.table(undefined);
// undefined

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
// ┌─────────┬─────┬─────┐
// │ (index) │ a   │ b   │
// ├─────────┼─────┼─────┤
// │ 0       │ 1   │ 'Y' │
// │ 1       │ 'Z' │ 2   │
// └─────────┴─────┴─────┘

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
// ┌─────────┬─────┐
// │ (index) │ a   │
// ├─────────┼─────┤
// │ 0       │ 1   │
// │ 1       │ 'Z' │
// └─────────┴─────┘
```

### `console.time([label])` {#consoletimelabel}

**Añadido en: v0.1.104**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'default'`

Inicia un temporizador que se puede utilizar para calcular la duración de una operación. Los temporizadores se identifican mediante una `etiqueta` única. Utilice la misma `etiqueta` al llamar a [`console.timeEnd()`](/es/nodejs/api/console#consoletimeendlabel) para detener el temporizador y mostrar el tiempo transcurrido en unidades de tiempo adecuadas en `stdout`. Por ejemplo, si el tiempo transcurrido es de 3869ms, `console.timeEnd()` muestra "3.869s".

### `console.timeEnd([label])` {#consoletimeendlabel}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.0.0 | El tiempo transcurrido se muestra con una unidad de tiempo adecuada. |
| v6.0.0 | Este método ya no admite varias llamadas que no se asignan a llamadas `console.time()` individuales; consulte los detalles a continuación. |
| v0.1.104 | Añadido en: v0.1.104 |
:::

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'default'`

Detiene un temporizador que se inició previamente llamando a [`console.time()`](/es/nodejs/api/console#consoletimelabel) e imprime el resultado en `stdout`:

```js [ESM]
console.time('bunch-of-stuff');
// Haz un montón de cosas.
console.timeEnd('bunch-of-stuff');
// Imprime: bunch-of-stuff: 225.438ms
```
### `console.timeLog([label][, ...data])` {#consoletimeloglabel-data}

**Añadido en: v10.7.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'default'`
- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Para un temporizador que se inició previamente llamando a [`console.time()`](/es/nodejs/api/console#consoletimelabel), imprime el tiempo transcurrido y otros argumentos de `datos` en `stdout`:

```js [ESM]
console.time('process');
const value = expensiveProcess1(); // Devuelve 42
console.timeLog('process', value);
// Imprime "process: 365.227ms 42".
doExpensiveProcess2(value);
console.timeEnd('process');
```
### `console.trace([message][, ...args])` {#consoletracemessage-args}

**Añadido en: v0.1.104**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Imprime en `stderr` la cadena `'Trace: '`, seguida del mensaje formateado [`util.format()`](/es/nodejs/api/util#utilformatformat-args) y el seguimiento de la pila hasta la posición actual en el código.

```js [ESM]
console.trace('Show me');
// Imprime: (el seguimiento de la pila variará según dónde se llame al seguimiento)
//  Trace: Show me
//    at repl:2:9
//    at REPLServer.defaultEval (repl.js:248:27)
//    at bound (domain.js:287:14)
//    at REPLServer.runBound [as eval] (domain.js:300:12)
//    at REPLServer.<anonymous> (repl.js:412:12)
//    at emitOne (events.js:82:20)
//    at REPLServer.emit (events.js:169:7)
//    at REPLServer.Interface._onLine (readline.js:210:10)
//    at REPLServer.Interface._line (readline.js:549:8)
//    at REPLServer.Interface._ttyWrite (readline.js:826:14)
```

### `console.warn([data][, ...args])` {#consolewarndata-args}

**Agregado en: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

La función `console.warn()` es un alias de [`console.error()`](/es/nodejs/api/console#consoleerrordata-args).

## Métodos solo para el inspector {#inspector-only-methods}

Los siguientes métodos son expuestos por el motor V8 en la API general pero no muestran nada a menos que se utilicen en conjunto con el [inspector](/es/nodejs/api/debugger) (flag `--inspect`).

### `console.profile([label])` {#consoleprofilelabel}

**Agregado en: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Este método no muestra nada a menos que se utilice en el inspector. El método `console.profile()` inicia un perfil de CPU de JavaScript con una etiqueta opcional hasta que se llama a [`console.profileEnd()`](/es/nodejs/api/console#consoleprofileendlabel). El perfil se agrega entonces al panel **Profile** del inspector.

```js [ESM]
console.profile('MyLabel');
// Some code
console.profileEnd('MyLabel');
// Adds the profile 'MyLabel' to the Profiles panel of the inspector.
```
### `console.profileEnd([label])` {#consoleprofileendlabel}

**Agregado en: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Este método no muestra nada a menos que se utilice en el inspector. Detiene la sesión actual de creación de perfiles de CPU de JavaScript si se ha iniciado una e imprime el informe en el panel **Profiles** del inspector. Vea [`console.profile()`](/es/nodejs/api/console#consoleprofilelabel) para un ejemplo.

Si se llama a este método sin una etiqueta, se detiene el perfil iniciado más recientemente.

### `console.timeStamp([label])` {#consoletimestamplabel}

**Agregado en: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Este método no muestra nada a menos que se utilice en el inspector. El método `console.timeStamp()` agrega un evento con la etiqueta `'label'` al panel **Timeline** del inspector.

