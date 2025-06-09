---
title: Documentación de Node.js - Utilidades
description: La documentación de Node.js para el módulo 'util', que proporciona funciones de utilidad para aplicaciones de Node.js, incluyendo depuración, inspección de objetos, y más.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Utilidades | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentación de Node.js para el módulo 'util', que proporciona funciones de utilidad para aplicaciones de Node.js, incluyendo depuración, inspección de objetos, y más.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Utilidades | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentación de Node.js para el módulo 'util', que proporciona funciones de utilidad para aplicaciones de Node.js, incluyendo depuración, inspección de objetos, y más.
---


# Util {#util}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código Fuente:** [lib/util.js](https://github.com/nodejs/node/blob/v23.5.0/lib/util.js)

El módulo `node:util` soporta las necesidades de las APIs internas de Node.js. Muchas de las utilidades son útiles también para desarrolladores de aplicaciones y módulos. Para acceder a él:

```js [ESM]
const util = require('node:util');
```
## `util.callbackify(original)` {#utilcallbackifyoriginal}

**Agregado en: v8.2.0**

- `original` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función `async`
- Devuelve: [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) una función estilo callback

Toma una función `async` (o una función que devuelve una `Promise`) y devuelve una función siguiendo el estilo callback de error primero, es decir, tomando un callback `(err, value) => ...` como el último argumento. En el callback, el primer argumento será la razón del rechazo (o `null` si la `Promise` se resolvió), y el segundo argumento será el valor resuelto.

```js [ESM]
const util = require('node:util');

async function fn() {
  return 'hola mundo';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```
Imprimirá:

```text [TEXT]
hola mundo
```
El callback se ejecuta asíncronamente, y tendrá un stack trace limitado. Si el callback lanza un error, el proceso emitirá un evento [`'uncaughtException'`](/es/nodejs/api/process#event-uncaughtexception), y si no se maneja, se cerrará.

Dado que `null` tiene un significado especial como el primer argumento para un callback, si una función envuelta rechaza una `Promise` con un valor falsy como razón, el valor se envuelve en un `Error` con el valor original almacenado en un campo llamado `reason`.

```js [ESM]
function fn() {
  return Promise.reject(null);
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  // Cuando la Promise fue rechazada con `null`, se envuelve con un Error y
  // el valor original se almacena en `reason`.
  err && Object.hasOwn(err, 'reason') && err.reason === null;  // true
});
```

## `util.debuglog(section[, callback])` {#utildebuglogsection-callback}

**Añadido en: v0.11.3**

- `section` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una cadena que identifica la parte de la aplicación para la que se está creando la función `debuglog`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una retrollamada invocada la primera vez que se llama a la función de registro con un argumento de función que es una función de registro más optimizada.
- Devuelve: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función de registro

El método `util.debuglog()` se utiliza para crear una función que escribe condicionalmente mensajes de depuración en `stderr` basándose en la existencia de la variable de entorno `NODE_DEBUG`. Si el nombre de la `section` aparece dentro del valor de esa variable de entorno, entonces la función devuelta opera de forma similar a [`console.error()`](/es/nodejs/api/console#consoleerrordata-args). Si no, entonces la función devuelta es una operación no op.

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo');

debuglog('hello from foo [%d]', 123);
```
Si este programa se ejecuta con `NODE_DEBUG=foo` en el entorno, entonces mostrará algo como:

```bash [BASH]
FOO 3245: hello from foo [123]
```
donde `3245` es el id del proceso. Si no se ejecuta con esa variable de entorno establecida, entonces no imprimirá nada.

La `section` también admite comodines:

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo-bar');

debuglog('hi there, it\'s foo-bar [%d]', 2333);
```
Si se ejecuta con `NODE_DEBUG=foo*` en el entorno, entonces mostrará algo como:

```bash [BASH]
FOO-BAR 3257: hi there, it's foo-bar [2333]
```
Se pueden especificar múltiples nombres de `section` separados por comas en la variable de entorno `NODE_DEBUG`: `NODE_DEBUG=fs,net,tls`.

El argumento opcional `callback` puede utilizarse para reemplazar la función de registro con una función diferente que no tenga ninguna inicialización o envoltura innecesaria.

```js [ESM]
const util = require('node:util');
let debuglog = util.debuglog('internals', (debug) => {
  // Reemplaza con una función de registro que optimiza
  // la prueba de si la sección está habilitada
  debuglog = debug;
});
```

### `debuglog().enabled` {#debuglogenabled}

**Añadido en: v14.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

El getter `util.debuglog().enabled` se utiliza para crear una prueba que puede utilizarse en condicionales basados en la existencia de la variable de entorno `NODE_DEBUG`. Si el nombre de la `sección` aparece dentro del valor de esa variable de entorno, entonces el valor devuelto será `true`. Si no, entonces el valor devuelto será `false`.

```js [ESM]
const util = require('node:util');
const enabled = util.debuglog('foo').enabled;
if (enabled) {
  console.log('hola desde foo [%d]', 123);
}
```
Si este programa se ejecuta con `NODE_DEBUG=foo` en el entorno, entonces mostrará algo como:

```bash [BASH]
hola desde foo [123]
```
## `util.debug(section)` {#utildebugsection}

**Añadido en: v14.9.0**

Alias para `util.debuglog`. El uso permite la legibilidad de que no implica el registro cuando solo se usa `util.debuglog().enabled`.

## `util.deprecate(fn, msg[, code])` {#utildeprecatefn-msg-code}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Las advertencias de obsolescencia solo se emiten una vez para cada código. |
| v0.8.0 | Añadido en: v0.8.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función que está en desuso.
- `msg` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un mensaje de advertencia para mostrar cuando se invoca la función en desuso.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un código de obsolescencia. Consulta la [lista de APIs obsoletas](/es/nodejs/api/deprecations#list-of-deprecated-apis) para obtener una lista de códigos.
- Devuelve: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función obsoleta envuelta para emitir una advertencia.

El método `util.deprecate()` envuelve `fn` (que puede ser una función o clase) de tal manera que se marca como obsoleta.

```js [ESM]
const util = require('node:util');

exports.obsoleteFunction = util.deprecate(() => {
  // Hacer algo aquí.
}, 'obsoleteFunction() está obsoleta. Use newShinyFunction() en su lugar.');
```
Cuando se llama, `util.deprecate()` devolverá una función que emitirá una `DeprecationWarning` usando el evento [`'warning'`](/es/nodejs/api/process#event-warning). La advertencia se emitirá e imprimirá en `stderr` la primera vez que se llame a la función devuelta. Después de que se emita la advertencia, se llama a la función envuelta sin emitir una advertencia.

Si se proporciona el mismo `code` opcional en múltiples llamadas a `util.deprecate()`, la advertencia se emitirá solo una vez para ese `code`.

```js [ESM]
const util = require('node:util');

const fn1 = util.deprecate(someFunction, someMessage, 'DEP0001');
const fn2 = util.deprecate(someOtherFunction, someOtherMessage, 'DEP0001');
fn1(); // Emite una advertencia de obsolescencia con el código DEP0001
fn2(); // No emite una advertencia de obsolescencia porque tiene el mismo código
```
Si se utilizan los indicadores de línea de comandos `--no-deprecation` o `--no-warnings`, o si la propiedad `process.noDeprecation` se establece en `true` *antes* de la primera advertencia de obsolescencia, el método `util.deprecate()` no hace nada.

Si se establecen los indicadores de línea de comandos `--trace-deprecation` o `--trace-warnings`, o la propiedad `process.traceDeprecation` se establece en `true`, se imprimen una advertencia y un seguimiento de la pila en `stderr` la primera vez que se llama a la función obsoleta.

Si se establece el indicador de línea de comandos `--throw-deprecation`, o la propiedad `process.throwDeprecation` se establece en `true`, se lanzará una excepción cuando se llame a la función obsoleta.

El indicador de línea de comandos `--throw-deprecation` y la propiedad `process.throwDeprecation` tienen prioridad sobre `--trace-deprecation` y `process.traceDeprecation`.


## `util.format(format[, ...args])` {#utilformatformat-args}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.11.0 | El especificador `%c` ahora se ignora. |
| v12.0.0 | El argumento `format` ahora solo se toma como tal si realmente contiene especificadores de formato. |
| v12.0.0 | Si el argumento `format` no es una cadena de formato, el formato de la cadena de salida ya no depende del tipo del primer argumento. Este cambio elimina las comillas previamente presentes de las cadenas que se emitían cuando el primer argumento no era una cadena. |
| v11.4.0 | Los especificadores `%d`, `%f` y `%i` ahora admiten Símbolos correctamente. |
| v11.4.0 | La `profundidad` del especificador `%o` vuelve a tener una profundidad predeterminada de 4. |
| v11.0.0 | La opción `depth` del especificador `%o` ahora volverá a la profundidad predeterminada. |
| v10.12.0 | Los especificadores `%d` e `%i` ahora admiten BigInt. |
| v8.4.0 | Los especificadores `%o` y `%O` ahora son compatibles. |
| v0.5.3 | Añadido en: v0.5.3 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una cadena de formato similar a `printf`.

El método `util.format()` devuelve una cadena con formato utilizando el primer argumento como una cadena de formato similar a `printf` que puede contener cero o más especificadores de formato. Cada especificador se reemplaza con el valor convertido del argumento correspondiente. Los especificadores compatibles son:

- `%s`: `String` se utilizará para convertir todos los valores excepto `BigInt`, `Object` y `-0`. Los valores `BigInt` se representarán con una `n` y los Objetos que no tengan una función `toString` definida por el usuario se inspeccionan utilizando `util.inspect()` con las opciones `{ depth: 0, colors: false, compact: 3 }`.
- `%d`: `Number` se utilizará para convertir todos los valores excepto `BigInt` y `Symbol`.
- `%i`: `parseInt(value, 10)` se utiliza para todos los valores excepto `BigInt` y `Symbol`.
- `%f`: `parseFloat(value)` se utiliza para todos los valores excepto `Symbol`.
- `%j`: JSON. Se reemplaza con la cadena `'[Circular]'` si el argumento contiene referencias circulares.
- `%o`: `Object`. Una representación de cadena de un objeto con formato de objeto JavaScript genérico. Similar a `util.inspect()` con las opciones `{ showHidden: true, showProxy: true }`. Esto mostrará el objeto completo, incluidas las propiedades no enumerables y los proxies.
- `%O`: `Object`. Una representación de cadena de un objeto con formato de objeto JavaScript genérico. Similar a `util.inspect()` sin opciones. Esto mostrará el objeto completo sin incluir las propiedades no enumerables y los proxies.
- `%c`: `CSS`. Este especificador se ignora y omitirá cualquier CSS que se pase.
- `%%`: signo de porcentaje único (`'%'`). Esto no consume un argumento.
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La cadena con formato

Si un especificador no tiene un argumento correspondiente, no se reemplaza:

```js [ESM]
util.format('%s:%s', 'foo');
// Devuelve: 'foo:%s'
```
Los valores que no forman parte de la cadena de formato se formatean utilizando `util.inspect()` si su tipo no es `string`.

Si se pasan más argumentos al método `util.format()` que el número de especificadores, los argumentos adicionales se concatenan a la cadena devuelta, separados por espacios:

```js [ESM]
util.format('%s:%s', 'foo', 'bar', 'baz');
// Devuelve: 'foo:bar baz'
```
Si el primer argumento no contiene un especificador de formato válido, `util.format()` devuelve una cadena que es la concatenación de todos los argumentos separados por espacios:

```js [ESM]
util.format(1, 2, 3);
// Devuelve: '1 2 3'
```
Si solo se pasa un argumento a `util.format()`, se devuelve tal cual sin ningún formato:

```js [ESM]
util.format('%% %s');
// Devuelve: '%% %s'
```
`util.format()` es un método síncrono que está diseñado como una herramienta de depuración. Algunos valores de entrada pueden tener una sobrecarga de rendimiento significativa que puede bloquear el bucle de eventos. Utilice esta función con cuidado y nunca en una ruta de código activa.


## `util.formatWithOptions(inspectOptions, format[, ...args])` {#utilformatwithoptionsinspectoptions-format-args}

**Añadido en: v10.0.0**

- `inspectOptions` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Esta función es idéntica a [`util.format()`](/es/nodejs/api/util#utilformatformat-args), excepto en que toma un argumento `inspectOptions` que especifica las opciones que se pasan a [`util.inspect()`](/es/nodejs/api/util#utilinspectobject-options).

```js [ESM]
util.formatWithOptions({ colors: true }, 'Ver objeto %O', { foo: 42 });
// Devuelve 'Ver objeto { foo: 42 }', donde `42` está coloreado como un número
// cuando se imprime en una terminal.
```
## `util.getCallSites(frameCountOrOptions, [options])` {#utilgetcallsitesframecountoroptions-options}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.3.0 | La API se renombra de `util.getCallSite` a `util.getCallSites()`. |
| v22.9.0 | Añadido en: v22.9.0 |
:::

- `frameCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número opcional de marcos para capturar como objetos de sitio de llamada. **Predeterminado:** `10`. El rango permitido está entre 1 y 200.
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opcional
    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Reconstruye la ubicación original en el stacktrace desde el source-map. Habilitado por defecto con el flag `--enable-source-maps`.
  
 
- Devuelve: [\<Objeto[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un array de objetos de sitio de llamada
    - `functionName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Devuelve el nombre de la función asociada con este sitio de llamada.
    - `scriptName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Devuelve el nombre del recurso que contiene el script para la función para este sitio de llamada.
    - `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Devuelve el número, basado en 1, de la línea para la llamada de función asociada.
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Devuelve el desplazamiento de columna basado en 1 en la línea para la llamada de función asociada.
  
 

Devuelve un array de objetos de sitio de llamada que contienen la pila de la función que llama.

```js [ESM]
const util = require('node:util');

function exampleFunction() {
  const callSites = util.getCallSites();

  console.log('Sitios de llamada:');
  callSites.forEach((callSite, index) => {
    console.log(`Sitio de llamada ${index + 1}:`);
    console.log(`Nombre de la función: ${callSite.functionName}`);
    console.log(`Nombre del script: ${callSite.scriptName}`);
    console.log(`Número de línea: ${callSite.lineNumber}`);
    console.log(`Número de columna: ${callSite.column}`);
  });
  // Sitio de llamada 1:
  // Nombre de la función: exampleFunction
  // Nombre del script: /home/example.js
  // Número de línea: 5
  // Número de columna: 26

  // Sitio de llamada 2:
  // Nombre de la función: anotherFunction
  // Nombre del script: /home/example.js
  // Número de línea: 22
  // Número de columna: 3

  // ...
}

// Una función para simular otra capa de pila
function anotherFunction() {
  exampleFunction();
}

anotherFunction();
```
Es posible reconstruir las ubicaciones originales configurando la opción `sourceMap` en `true`. Si el mapa de origen no está disponible, la ubicación original será la misma que la ubicación actual. Cuando el flag `--enable-source-maps` está habilitado, por ejemplo, cuando se usa `--experimental-transform-types`, `sourceMap` será verdadero de forma predeterminada.

```ts [TYPESCRIPT]
import util from 'node:util';

interface Foo {
  foo: string;
}

const callSites = util.getCallSites({ sourceMap: true });

// Con sourceMap:
// Nombre de la función: ''
// Nombre del script: example.js
// Número de línea: 7
// Número de columna: 26

// Sin sourceMap:
// Nombre de la función: ''
// Nombre del script: example.js
// Número de línea: 2
// Número de columna: 26
```

## `util.getSystemErrorName(err)` {#utilgetsystemerrornameerr}

**Agregado en: v9.7.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve el nombre de cadena para un código de error numérico que proviene de una API de Node.js. La asignación entre códigos de error y nombres de error depende de la plataforma. Consulta [Errores comunes del sistema](/es/nodejs/api/errors#common-system-errors) para conocer los nombres de los errores comunes.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorName(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMap()` {#utilgetsystemerrormap}

**Agregado en: v16.0.0, v14.17.0**

- Devuelve: [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Devuelve un Mapa de todos los códigos de error del sistema disponibles desde la API de Node.js. La asignación entre los códigos de error y los nombres de los errores depende de la plataforma. Consulta [Errores comunes del sistema](/es/nodejs/api/errors#common-system-errors) para conocer los nombres de los errores comunes.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const errorMap = util.getSystemErrorMap();
  const name = errorMap.get(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMessage(err)` {#utilgetsystemerrormessageerr}

**Agregado en: v23.1.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve el mensaje de cadena para un código de error numérico que proviene de una API de Node.js. La asignación entre los códigos de error y los mensajes de cadena depende de la plataforma.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorMessage(err.errno);
  console.error(name);  // No such file or directory
});
```
## `util.inherits(constructor, superConstructor)` {#utilinheritsconstructor-superconstructor}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v5.0.0 | El parámetro `constructor` ahora puede referirse a una clase ES6. |
| v0.3.0 | Agregado en: v0.3.0 |
:::

::: info [Estable: 3 - Legado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Legado: Utilice la sintaxis de clase ES2015 y la palabra clave `extends` en su lugar.
:::

- `constructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `superConstructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Se desaconseja el uso de `util.inherits()`. Por favor, use las palabras clave `class` y `extends` de ES6 para obtener soporte de herencia a nivel de lenguaje. También tenga en cuenta que los dos estilos son [semánticamente incompatibles](https://github.com/nodejs/node/issues/4179).

Hereda los métodos de prototipo de un [constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor) en otro. El prototipo de `constructor` se establecerá en un nuevo objeto creado a partir de `superConstructor`.

Esto principalmente añade algo de validación de entrada sobre `Object.setPrototypeOf(constructor.prototype, superConstructor.prototype)`. Como conveniencia adicional, `superConstructor` será accesible a través de la propiedad `constructor.super_`.

```js [ESM]
const util = require('node:util');
const EventEmitter = require('node:events');

function MyStream() {
  EventEmitter.call(this);
}

util.inherits(MyStream, EventEmitter);

MyStream.prototype.write = function(data) {
  this.emit('data', data);
};

const stream = new MyStream();

console.log(stream instanceof EventEmitter); // true
console.log(MyStream.super_ === EventEmitter); // true

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('It works!'); // Received data: "It works!"
```
Ejemplo ES6 utilizando `class` y `extends`:

```js [ESM]
const EventEmitter = require('node:events');

class MyStream extends EventEmitter {
  write(data) {
    this.emit('data', data);
  }
}

const stream = new MyStream();

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('With ES6');
```

## `util.inspect(object[, options])` {#utilinspectobject-options}

## `util.inspect(object[, showHidden[, depth[, colors]]])` {#utilinspectobject-showhidden-depth-colors}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.18.0 | Se añade soporte para `maxArrayLength` al inspeccionar `Set` y `Map`. |
| v17.3.0, v16.14.0 | Ahora se admite la opción `numericSeparator`. |
| v13.0.0 | Las referencias circulares ahora incluyen un marcador a la referencia. |
| v14.6.0, v12.19.0 | Si `object` proviene ahora de un `vm.Context` diferente, una función de inspección personalizada en él ya no recibirá argumentos específicos del contexto. |
| v13.13.0, v12.17.0 | Ahora se admite la opción `maxStringLength`. |
| v13.5.0, v12.16.0 | Las propiedades de prototipo definidas por el usuario se inspeccionan en caso de que `showHidden` sea `true`. |
| v12.0.0 | El valor predeterminado de las opciones `compact` se cambia a `3` y el valor predeterminado de las opciones `breakLength` se cambia a `80`. |
| v12.0.0 | Las propiedades internas ya no aparecen en el argumento de contexto de una función de inspección personalizada. |
| v11.11.0 | La opción `compact` acepta números para un nuevo modo de salida. |
| v11.7.0 | ArrayBuffers ahora también muestra su contenido binario. |
| v11.5.0 | Ahora se admite la opción `getters`. |
| v11.4.0 | El valor predeterminado de `depth` volvió a `2`. |
| v11.0.0 | El valor predeterminado de `depth` se cambió a `20`. |
| v11.0.0 | La salida de inspección ahora está limitada a aproximadamente 128 MiB. Los datos por encima de ese tamaño no se inspeccionarán completamente. |
| v10.12.0 | Ahora se admite la opción `sorted`. |
| v10.6.0 | Ahora es posible inspeccionar listas enlazadas y objetos similares hasta el tamaño máximo de la pila de llamadas. |
| v10.0.0 | Las entradas `WeakMap` y `WeakSet` ahora también se pueden inspeccionar. |
| v9.9.0 | Ahora se admite la opción `compact`. |
| v6.6.0 | Las funciones de inspección personalizadas ahora pueden devolver `this`. |
| v6.3.0 | Ahora se admite la opción `breakLength`. |
| v6.1.0 | Ahora se admite la opción `maxArrayLength`; en particular, los arreglos largos se truncan de forma predeterminada. |
| v6.1.0 | Ahora se admite la opción `showProxy`. |
| v0.3.0 | Añadido en: v0.3.0 |
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Cualquier JavaScript primitivo u `Object`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, los símbolos y las propiedades no enumerables de `object` se incluyen en el resultado formateado. Las entradas [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) y [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) también se incluyen, así como las propiedades de prototipo definidas por el usuario (excluyendo las propiedades de método). **Predeterminado:** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el número de veces que se debe recurrir durante el formateo de `object`. Esto es útil para inspeccionar objetos grandes. Para recurrir hasta el tamaño máximo de la pila de llamadas, pase `Infinity` o `null`. **Predeterminado:** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, la salida se estiliza con códigos de color ANSI. Los colores son personalizables. Consulte [Personalización de los colores `util.inspect`](/es/nodejs/api/util#customizing-utilinspect-colors). **Predeterminado:** `false`.
    - `customInspect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `false`, no se invocan las funciones `[util.inspect.custom](depth, opts, inspect)`. **Predeterminado:** `true`.
    - `showProxy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, la inspección de `Proxy` incluye los objetos [`target` y `handler`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Terminology). **Predeterminado:** `false`.
    - `maxArrayLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el número máximo de elementos `Array`, [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set), [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) y [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) para incluir al formatear. Establezca en `null` o `Infinity` para mostrar todos los elementos. Establezca en `0` o negativo para no mostrar ningún elemento. **Predeterminado:** `100`.
    - `maxStringLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el número máximo de caracteres para incluir al formatear. Establezca en `null` o `Infinity` para mostrar todos los elementos. Establezca en `0` o negativo para no mostrar ningún carácter. **Predeterminado:** `10000`.
    - `breakLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longitud en la que los valores de entrada se dividen en varias líneas. Establezca en `Infinity` para formatear la entrada como una sola línea (en combinación con `compact` establecido en `true` o cualquier número \>= `1`). **Predeterminado:** `80`.
    - `compact` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establecer esto en `false` hace que cada clave de objeto se muestre en una nueva línea. Se romperá en nuevas líneas en texto que sea más largo que `breakLength`. Si se establece en un número, los `n` elementos internos más se unirán en una sola línea siempre que todas las propiedades quepan en `breakLength`. Los elementos de matriz cortos también se agrupan. Para obtener más información, consulte el ejemplo a continuación. **Predeterminado:** `3`.
    - `sorted` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Si se establece en `true` o en una función, todas las propiedades de un objeto y las entradas `Set` y `Map` se ordenan en la cadena resultante. Si se establece en `true`, se utiliza el [ordenamiento predeterminado](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort). Si se establece en una función, se utiliza como una [función de comparación](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters).
    - `getters` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si se establece en `true`, se inspeccionan los getters. Si se establece en `'get'`, solo se inspeccionan los getters sin un setter correspondiente. Si se establece en `'set'`, solo se inspeccionan los getters con un setter correspondiente. Esto podría causar efectos secundarios dependiendo de la función getter. **Predeterminado:** `false`.
    - `numericSeparator` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `true`, se utiliza un guion bajo para separar cada tres dígitos en todos los bigint y números. **Predeterminado:** `false`.
  
 
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La representación de `object`.

El método `util.inspect()` devuelve una representación en cadena de `object` que está destinada a la depuración. La salida de `util.inspect` puede cambiar en cualquier momento y no se debe depender de ella programáticamente. Se pueden pasar `options` adicionales que alteren el resultado. `util.inspect()` utilizará el nombre del constructor y/o `@@toStringTag` para crear una etiqueta identificable para un valor inspeccionado.

```js [ESM]
class Foo {
  get [Symbol.toStringTag]() {
    return 'bar';
  }
}

class Bar {}

const baz = Object.create(null, { [Symbol.toStringTag]: { value: 'foo' } });

util.inspect(new Foo()); // 'Foo [bar] {}'
util.inspect(new Bar()); // 'Bar {}'
util.inspect(baz);       // '[foo] {}'
```
Las referencias circulares apuntan a su ancla utilizando un índice de referencia:

```js [ESM]
const { inspect } = require('node:util');

const obj = {};
obj.a = [obj];
obj.b = {};
obj.b.inner = obj.b;
obj.b.obj = obj;

console.log(inspect(obj));
// <ref *1> {
//   a: [ [Circular *1] ],
//   b: <ref *2> { inner: [Circular *2], obj: [Circular *1] }
// }
```
El siguiente ejemplo inspecciona todas las propiedades del objeto `util`:

```js [ESM]
const util = require('node:util');

console.log(util.inspect(util, { showHidden: true, depth: null }));
```
El siguiente ejemplo destaca el efecto de la opción `compact`:

```js [ESM]
const util = require('node:util');

const o = {
  a: [1, 2, [[
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit, sed do ' +
      'eiusmod \ntempor incididunt ut labore et dolore magna aliqua.',
    'test',
    'foo']], 4],
  b: new Map([['za', 1], ['zb', 'test']]),
};
console.log(util.inspect(o, { compact: true, depth: 5, breakLength: 80 }));

// { a:
//   [ 1,
//     2,
//     [ [ 'Lorem ipsum dolor sit amet,\nconsectetur [...]', // A long line
//           'test',
//           'foo' ] ],
//     4 ],
//   b: Map(2) { 'za' => 1, 'zb' => 'test' } }

// Setting `compact` to false or an integer creates more reader friendly output.
console.log(util.inspect(o, { compact: false, depth: 5, breakLength: 80 }));

// {
//   a: [
//     1,
//     2,
//     [
//       [
//         'Lorem ipsum dolor sit amet,\n' +
//           'consectetur adipiscing elit, sed do eiusmod \n' +
//           'tempor incididunt ut labore et dolore magna aliqua.',
//         'test',
//         'foo'
//       ]
//     ],
//     4
//   ],
//   b: Map(2) {
//     'za' => 1,
//     'zb' => 'test'
//   }
// }

// Setting `breakLength` to e.g. 150 will print the "Lorem ipsum" text in a
// single line.
```
La opción `showHidden` permite inspeccionar las entradas [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) y [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet). Si hay más entradas que `maxArrayLength`, no hay garantía de qué entradas se muestran. Esto significa que recuperar las mismas entradas [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) dos veces puede dar como resultado una salida diferente. Además, las entradas sin referencias fuertes restantes pueden ser recolectadas por el recolector de basura en cualquier momento.

```js [ESM]
const { inspect } = require('node:util');

const obj = { a: 1 };
const obj2 = { b: 2 };
const weakSet = new WeakSet([obj, obj2]);

console.log(inspect(weakSet, { showHidden: true }));
// WeakSet { { a: 1 }, { b: 2 } }
```
La opción `sorted` garantiza que el orden de inserción de propiedades de un objeto no afecte el resultado de `util.inspect()`.

```js [ESM]
const { inspect } = require('node:util');
const assert = require('node:assert');

const o1 = {
  b: [2, 3, 1],
  a: '`a` comes before `b`',
  c: new Set([2, 3, 1]),
};
console.log(inspect(o1, { sorted: true }));
// { a: '`a` comes before `b`', b: [ 2, 3, 1 ], c: Set(3) { 1, 2, 3 } }
console.log(inspect(o1, { sorted: (a, b) => b.localeCompare(a) }));
// { c: Set(3) { 3, 2, 1 }, b: [ 2, 3, 1 ], a: '`a` comes before `b`' }

const o2 = {
  c: new Set([2, 1, 3]),
  a: '`a` comes before `b`',
  b: [2, 3, 1],
};
assert.strict.equal(
  inspect(o1, { sorted: true }),
  inspect(o2, { sorted: true }),
);
```
La opción `numericSeparator` añade un guion bajo cada tres dígitos a todos los números.

```js [ESM]
const { inspect } = require('node:util');

const thousand = 1_000;
const million = 1_000_000;
const bigNumber = 123_456_789n;
const bigDecimal = 1_234.123_45;

console.log(inspect(thousand, { numericSeparator: true }));
// 1_000
console.log(inspect(million, { numericSeparator: true }));
// 1_000_000
console.log(inspect(bigNumber, { numericSeparator: true }));
// 123_456_789n
console.log(inspect(bigDecimal, { numericSeparator: true }));
// 1_234.123_45
```
`util.inspect()` es un método sincrónico destinado a la depuración. Su longitud máxima de salida es de aproximadamente 128 MiB. Las entradas que dan como resultado una salida más larga se truncarán.


### Personalización de los colores de `util.inspect` {#customizing-utilinspect-colors}

La salida de color (si está habilitada) de `util.inspect` se puede personalizar globalmente a través de las propiedades `util.inspect.styles` y `util.inspect.colors`.

`util.inspect.styles` es un mapa que asocia un nombre de estilo a un color de `util.inspect.colors`.

Los estilos predeterminados y los colores asociados son:

- `bigint`: `yellow`
- `boolean`: `yellow`
- `date`: `magenta`
- `module`: `underline`
- `name`: (sin estilo)
- `null`: `bold`
- `number`: `yellow`
- `regexp`: `red`
- `special`: `cyan` (p. ej., `Proxies`)
- `string`: `green`
- `symbol`: `green`
- `undefined`: `grey`

El estilo de color utiliza códigos de control ANSI que pueden no ser compatibles con todos los terminales. Para verificar la compatibilidad de color, utilice [`tty.hasColors()`](/es/nodejs/api/tty#writestreamhascolorscount-env).

Los códigos de control predefinidos se enumeran a continuación (agrupados como "Modificadores", "Colores de primer plano" y "Colores de fondo").

#### Modificadores {#modifiers}

La compatibilidad con los modificadores varía según los diferentes terminales. En su mayoría se ignorarán, si no son compatibles.

- `reset` - Restablece todos los modificadores (de color) a sus valores predeterminados
- **bold** - Poner el texto en negrita
- *italic* - Poner el texto en cursiva
- underline - Subrayar el texto
- ~~strikethrough~~ - Coloca una línea horizontal en el centro del texto (Alias: `strikeThrough`, `crossedout`, `crossedOut`)
- `hidden` - Imprime el texto, pero lo hace invisible (Alias: conceal)
- dim - Disminución de la intensidad del color (Alias: `faint`)
- overlined - Poner el texto sobre rayado
- blink - Oculta y muestra el texto en un intervalo
- inverse - Intercambia los colores de primer plano y de fondo (Alias: `swapcolors`, `swapColors`)
- doubleunderline - Poner el texto doble subrayado (Alias: `doubleUnderline`)
- framed - Dibuja un marco alrededor del texto

#### Colores de primer plano {#foreground-colors}

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
- `gray` (alias: `grey`, `blackBright`)
- `redBright`
- `greenBright`
- `yellowBright`
- `blueBright`
- `magentaBright`
- `cyanBright`
- `whiteBright`

#### Colores de fondo {#background-colors}

- `bgBlack`
- `bgRed`
- `bgGreen`
- `bgYellow`
- `bgBlue`
- `bgMagenta`
- `bgCyan`
- `bgWhite`
- `bgGray` (alias: `bgGrey`, `bgBlackBright`)
- `bgRedBright`
- `bgGreenBright`
- `bgYellowBright`
- `bgBlueBright`
- `bgMagentaBright`
- `bgCyanBright`
- `bgWhiteBright`


### Funciones de inspección personalizadas en objetos {#custom-inspection-functions-on-objects}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.3.0, v16.14.0 | Se agrega el argumento inspect para mayor interoperabilidad. |
| v0.1.97 | Agregado en: v0.1.97 |
:::

Los objetos también pueden definir su propia función [`[util.inspect.custom](depth, opts, inspect)`](/es/nodejs/api/util#utilinspectcustom), que `util.inspect()` invocará y utilizará el resultado al inspeccionar el objeto.

```js [ESM]
const util = require('node:util');

class Box {
  constructor(value) {
    this.value = value;
  }

  [util.inspect.custom](depth, options, inspect) {
    if (depth < 0) {
      return options.stylize('[Box]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1,
    });

    // Relleno de cinco espacios porque ese es el tamaño de "Box< ".
    const padding = ' '.repeat(5);
    const inner = inspect(this.value, newOptions)
                  .replace(/\n/g, `\n${padding}`);
    return `${options.stylize('Box', 'special')}< ${inner} >`;
  }
}

const box = new Box(true);

util.inspect(box);
// Returns: "Box< true >"
```
Las funciones personalizadas `[util.inspect.custom](depth, opts, inspect)` normalmente devuelven una cadena, pero pueden devolver un valor de cualquier tipo que `util.inspect()` formateará en consecuencia.

```js [ESM]
const util = require('node:util');

const obj = { foo: 'esto no se mostrará en la salida de inspect()' };
obj[util.inspect.custom] = (depth) => {
  return { bar: 'baz' };
};

util.inspect(obj);
// Returns: "{ bar: 'baz' }"
```
### `util.inspect.custom` {#utilinspectcustom}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.12.0 | Esto ahora se define como un símbolo compartido. |
| v6.6.0 | Agregado en: v6.6.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) que se puede utilizar para declarar funciones de inspección personalizadas.

Además de ser accesible a través de `util.inspect.custom`, este símbolo está [registrado globalmente](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) y se puede acceder a él en cualquier entorno como `Symbol.for('nodejs.util.inspect.custom')`.

El uso de esto permite que el código se escriba de forma portátil, de modo que la función de inspección personalizada se utilice en un entorno de Node.js y se ignore en el navegador. La función `util.inspect()` en sí misma se pasa como tercer argumento a la función de inspección personalizada para permitir una mayor portabilidad.

```js [ESM]
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

class Password {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return 'xxxxxxxx';
  }

  [customInspectSymbol](depth, inspectOptions, inspect) {
    return `Password <${this.toString()}>`;
  }
}

const password = new Password('r0sebud');
console.log(password);
// Prints Password <xxxxxxxx>
```
Consulte [Funciones de inspección personalizadas en objetos](/es/nodejs/api/util#custom-inspection-functions-on-objects) para obtener más detalles.


### `util.inspect.defaultOptions` {#utilinspectdefaultoptions}

**Añadido en: v6.4.0**

El valor `defaultOptions` permite la personalización de las opciones predeterminadas utilizadas por `util.inspect`. Esto es útil para funciones como `console.log` o `util.format` que llaman implícitamente a `util.inspect`. Debe establecerse a un objeto que contenga una o más opciones válidas de [`util.inspect()`](/es/nodejs/api/util#utilinspectobject-options). También se admite la configuración directa de las propiedades de las opciones.

```js [ESM]
const util = require('node:util');
const arr = Array(101).fill(0);

console.log(arr); // Registra el array truncado
util.inspect.defaultOptions.maxArrayLength = null;
console.log(arr); // registra el array completo
```
## `util.isDeepStrictEqual(val1, val2)` {#utilisdeepstrictequalval1-val2}

**Añadido en: v9.0.0**

- `val1` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `val2` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si hay una igualdad estricta profunda entre `val1` y `val2`. De lo contrario, devuelve `false`.

Consulta [`assert.deepStrictEqual()`](/es/nodejs/api/assert#assertdeepstrictequalactual-expected-message) para obtener más información sobre la igualdad estricta profunda.

## Clase: `util.MIMEType` {#class-utilmimetype}

**Añadido en: v19.1.0, v18.13.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Una implementación de [la clase MIMEType](https://bmeck.github.io/node-proposal-mime-api/).

De acuerdo con las convenciones del navegador, todas las propiedades de los objetos `MIMEType` se implementan como getters y setters en el prototipo de la clase, en lugar de como propiedades de datos en el objeto en sí.

Una cadena MIME es una cadena estructurada que contiene múltiples componentes significativos. Cuando se analiza, se devuelve un objeto `MIMEType` que contiene propiedades para cada uno de estos componentes.

### Constructor: `new MIMEType(input)` {#constructor-new-mimetypeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El MIME de entrada a analizar

Crea un nuevo objeto `MIMEType` analizando la `input`.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/plain');
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/plain');
```
:::

Se lanzará un `TypeError` si la `input` no es un MIME válido. Ten en cuenta que se hará un esfuerzo para forzar los valores dados a cadenas. Por ejemplo:



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```

```js [CJS]
const { MIMEType } = require('node:util');
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```
:::


### `mime.type` {#mimetype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtiene y establece la porción de tipo del MIME.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```
:::

### `mime.subtype` {#mimesubtype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtiene y establece la porción de subtipo del MIME.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```
:::

### `mime.essence` {#mimeessence}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtiene la esencia del MIME. Esta propiedad es de solo lectura. Utilice `mime.type` o `mime.subtype` para alterar el MIME.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```
:::


### `mime.params` {#mimeparams}

- [\<MIMEParams\>](/es/nodejs/api/util#class-utilmimeparams)

Obtiene el objeto [`MIMEParams`](/es/nodejs/api/util#class-utilmimeparams) que representa los parámetros del MIME. Esta propiedad es de solo lectura. Consulte la documentación de [`MIMEParams`](/es/nodejs/api/util#class-utilmimeparams) para obtener más detalles.

### `mime.toString()` {#mimetostring}

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `toString()` en el objeto `MIMEType` devuelve el MIME serializado.

Debido a la necesidad de cumplimiento estándar, este método no permite a los usuarios personalizar el proceso de serialización del MIME.

### `mime.toJSON()` {#mimetojson}

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Alias para [`mime.toString()`](/es/nodejs/api/util#mimetostring).

Este método se llama automáticamente cuando un objeto `MIMEType` se serializa con [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```
:::

## Clase: `util.MIMEParams` {#class-utilmimeparams}

**Agregado en: v19.1.0, v18.13.0**

La API `MIMEParams` proporciona acceso de lectura y escritura a los parámetros de un `MIMEType`.

### Constructor: `new MIMEParams()` {#constructor-new-mimeparams}

Crea un nuevo objeto `MIMEParams` con parámetros vacíos

::: code-group
```js [ESM]
import { MIMEParams } from 'node:util';

const myParams = new MIMEParams();
```

```js [CJS]
const { MIMEParams } = require('node:util');

const myParams = new MIMEParams();
```
:::

### `mimeParams.delete(name)` {#mimeparamsdeletename}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Elimina todos los pares nombre-valor cuyo nombre es `name`.


### `mimeParams.entries()` {#mimeparamsentries}

- Devuelve: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Devuelve un iterador sobre cada uno de los pares nombre-valor en los parámetros. Cada elemento del iterador es un `Array` de JavaScript. El primer elemento del array es el `nombre`, el segundo elemento del array es el `valor`.

### `mimeParams.get(name)` {#mimeparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Una cadena de texto o `null` si no hay ningún par nombre-valor con el `nombre` dado.

Devuelve el valor del primer par nombre-valor cuyo nombre es `name`. Si no existen tales pares, se devuelve `null`.

### `mimeParams.has(name)` {#mimeparamshasname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si existe al menos un par nombre-valor cuyo nombre es `name`.

### `mimeParams.keys()` {#mimeparamskeys}

- Devuelve: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Devuelve un iterador sobre los nombres de cada par nombre-valor.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```
:::

### `mimeParams.set(name, value)` {#mimeparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Establece el valor en el objeto `MIMEParams` asociado con `name` a `value`. Si hay algún par nombre-valor preexistente cuyos nombres son `name`, establece el valor del primer par a `value`.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```
:::


### `mimeParams.values()` {#mimeparamsvalues}

- Devuelve: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Devuelve un iterador sobre los valores de cada par nombre-valor.

### `mimeParams[@@iterator]()` {#mimeparams@@iterator}

- Devuelve: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Alias para [`mimeParams.entries()`](/es/nodejs/api/util#mimeparamsentries).



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```
:::

## `util.parseArgs([config])` {#utilparseargsconfig}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | add support for allowing negative options in input `config`. |
| v20.0.0 | The API is no longer experimental. |
| v18.11.0, v16.19.0 | Add support for default values in input `config`. |
| v18.7.0, v16.17.0 | add support for returning detailed parse information using `tokens` in input `config` and returned properties. |
| v18.3.0, v16.17.0 | Added in: v18.3.0, v16.17.0 |
:::

-  `config` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se utiliza para proporcionar argumentos para el análisis y para configurar el analizador. `config` admite las siguientes propiedades:
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) array de strings de argumentos. **Predeterminado:** `process.argv` con `execPath` y `filename` removidos.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se utiliza para describir los argumentos conocidos por el analizador. Las claves de `options` son los nombres largos de las opciones y los valores son un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que acepta las siguientes propiedades:
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Tipo de argumento, que debe ser `boolean` o `string`.
    - `multiple` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si esta opción se puede proporcionar varias veces. Si es `true`, todos los valores se recopilarán en un array. Si es `false`, los valores de la opción son los últimos en ganar. **Predeterminado:** `false`.
    - `short` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un alias de un solo carácter para la opción.
    - `default` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) El valor de opción predeterminado cuando no se establece mediante args. Debe ser del mismo tipo que la propiedad `type`. Cuando `multiple` es `true`, debe ser un array.
  
 
    - `strict` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se debe generar un error cuando se encuentran argumentos desconocidos o cuando se pasan argumentos que no coinciden con el `type` configurado en `options`. **Predeterminado:** `true`.
    - `allowPositionals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si este comando acepta argumentos posicionales. **Predeterminado:** `false` si `strict` es `true`, de lo contrario `true`.
    - `allowNegative` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, permite establecer explícitamente las opciones booleanas en `false` prefijando el nombre de la opción con `--no-`. **Predeterminado:** `false`.
    - `tokens` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Devuelve los tokens analizados. Esto es útil para extender el comportamiento incorporado, desde agregar comprobaciones adicionales hasta reprocesar los tokens de diferentes maneras. **Predeterminado:** `false`.
  
 
-  Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Los argumentos de línea de comandos analizados:
    - `values` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un mapeo de nombres de opciones analizadas con sus valores [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) o [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).
    - `positionals` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Argumentos posicionales.
    - `tokens` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Consulte la sección [tokens de parseArgs](/es/nodejs/api/util#parseargs-tokens). Solo se devuelve si `config` incluye `tokens: true`.
  
 

Proporciona una API de nivel superior para el análisis de argumentos de línea de comandos que interactuar directamente con `process.argv`. Toma una especificación para los argumentos esperados y devuelve un objeto estructurado con las opciones y posiciones analizadas.



::: code-group
```js [ESM]
import { parseArgs } from 'node:util';
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```

```js [CJS]
const { parseArgs } = require('node:util');
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```
:::

### `parseArgs` `tokens` {#parseargs-tokens}

La información detallada del análisis está disponible para agregar comportamientos personalizados especificando `tokens: true` en la configuración. Los tokens devueltos tienen propiedades que describen:

- todos los tokens
    - `kind` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uno de 'option', 'positional' o 'option-terminator'.
    - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Índice del elemento en `args` que contiene el token. Por lo tanto, el argumento de origen para un token es `args[token.index]`.
  
 
- tokens de opción
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre largo de la opción.
    - `rawName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Cómo se utiliza la opción en args, como `-f` o `--foo`.
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Valor de la opción especificado en args. Indefinido para opciones booleanas.
    - `inlineValue` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Si el valor de la opción se especifica en línea, como `--foo=bar`.
  
 
- tokens posicionales
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El valor del argumento posicional en args (es decir, `args[index]`).
  
 
- token option-terminator

Los tokens devueltos están en el orden en que se encuentran en los args de entrada. Las opciones que aparecen más de una vez en args producen un token para cada uso. Los grupos de opciones cortas como `-xy` se expanden a un token para cada opción. Por lo tanto, `-xxx` produce tres tokens.

Por ejemplo, para agregar soporte para una opción negada como `--no-color` (que `allowNegative` admite cuando la opción es de tipo `boolean`), los tokens devueltos se pueden reprocesar para cambiar el valor almacenado para la opción negada.



::: code-group
```js [ESM]
import { parseArgs } from 'node:util';

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Reprocesa los tokens de opción y sobrescribe los valores devueltos.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Almacena foo:false para --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Guarda el valor para que el último gane si tanto --foo como --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```

```js [CJS]
const { parseArgs } = require('node:util');

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Reprocesa los tokens de opción y sobrescribe los valores devueltos.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Almacena foo:false para --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Guarda el valor para que el último gane si tanto --foo como --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```
:::

Ejemplo de uso que muestra opciones negadas, y cuando una opción se utiliza de múltiples maneras, la última gana.

```bash [BASH]
$ node negate.js
{ logfile: 'default.log', color: undefined }
$ node negate.js --no-logfile --no-color
{ logfile: false, color: false }
$ node negate.js --logfile=test.log --color
{ logfile: 'test.log', color: true }
$ node negate.js --no-logfile --logfile=test.log --color --no-color
{ logfile: 'test.log', color: false }
```

## `util.parseEnv(content)` {#utilparseenvcontent}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/es/nodejs/api/documentation#stability-index) [Stability: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

**Agregado en: v21.7.0, v20.12.0**

- `content` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El contenido sin procesar de un archivo `.env`.

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Dado un archivo `.env` de ejemplo:



::: code-group
```js [CJS]
const { parseEnv } = require('node:util');

parseEnv('HELLO=world\nHELLO=oh my\n');
// Devuelve: { HELLO: 'oh my' }
```

```js [ESM]
import { parseEnv } from 'node:util';

parseEnv('HELLO=world\nHELLO=oh my\n');
// Devuelve: { HELLO: 'oh my' }
```
:::

## `util.promisify(original)` {#utilpromisifyoriginal}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.8.0 | Llamar a `promisify` en una función que devuelve una `Promise` está obsoleto. |
| v8.0.0 | Agregado en: v8.0.0 |
:::

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Toma una función que sigue el estilo común de callback con primer error, es decir, que toma un callback `(err, value) => ...` como el último argumento, y devuelve una versión que devuelve promesas.

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // Hacer algo con `stats`
}).catch((error) => {
  // Manejar el error.
});
```
O, equivalentemente usando funciones `async function`:

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);

async function callStat() {
  const stats = await stat('.');
  console.log(`Este directorio es propiedad de ${stats.uid}`);
}

callStat();
```
Si existe una propiedad `original[util.promisify.custom]`, `promisify` devolverá su valor, consulte [Funciones promisificadas personalizadas](/es/nodejs/api/util#custom-promisified-functions).

`promisify()` asume que `original` es una función que toma un callback como su argumento final en todos los casos. Si `original` no es una función, `promisify()` lanzará un error. Si `original` es una función, pero su último argumento no es un callback de primer error, aún se le pasará un callback de primer error como su último argumento.

El uso de `promisify()` en métodos de clase u otros métodos que usan `this` puede no funcionar como se espera a menos que se maneje especialmente:

```js [ESM]
const util = require('node:util');

class Foo {
  constructor() {
    this.a = 42;
  }

  bar(callback) {
    callback(null, this.a);
  }
}

const foo = new Foo();

const naiveBar = util.promisify(foo.bar);
// TypeError: Cannot read property 'a' of undefined
// naiveBar().then(a => console.log(a));

naiveBar.call(foo).then((a) => console.log(a)); // '42'

const bindBar = naiveBar.bind(foo);
bindBar().then((a) => console.log(a)); // '42'
```

### Funciones promisificadas personalizadas {#custom-promisified-functions}

Usando el símbolo `util.promisify.custom` se puede anular el valor de retorno de [`util.promisify()`](/es/nodejs/api/util#utilpromisifyoriginal):

```js [ESM]
const util = require('node:util');

function doSomething(foo, callback) {
  // ...
}

doSomething[util.promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

const promisified = util.promisify(doSomething);
console.log(promisified === doSomething[util.promisify.custom]);
// prints 'true'
```
Esto puede ser útil para los casos en que la función original no sigue el formato estándar de tomar una retrollamada de primer error como último argumento.

Por ejemplo, con una función que toma `(foo, onSuccessCallback, onErrorCallback)`:

```js [ESM]
doSomething[util.promisify.custom] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```
Si `promisify.custom` está definido pero no es una función, `promisify()` lanzará un error.

### `util.promisify.custom` {#utilpromisifycustom}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v13.12.0, v12.16.2 | Ahora se define como un símbolo compartido. |
| v8.0.0 | Agregado en: v8.0.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) que se puede utilizar para declarar variantes promisificadas personalizadas de funciones, vea [Funciones promisificadas personalizadas](/es/nodejs/api/util#custom-promisified-functions).

Además de ser accesible a través de `util.promisify.custom`, este símbolo está [registrado globalmente](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) y se puede acceder a él en cualquier entorno como `Symbol.for('nodejs.util.promisify.custom')`.

Por ejemplo, con una función que toma `(foo, onSuccessCallback, onErrorCallback)`:

```js [ESM]
const kCustomPromisifiedSymbol = Symbol.for('nodejs.util.promisify.custom');

doSomething[kCustomPromisifiedSymbol] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```

## `util.stripVTControlCharacters(str)` {#utilstripvtcontrolcharactersstr}

**Añadido en: v16.11.0**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve `str` con cualquier código de escape ANSI eliminado.

```js [ESM]
console.log(util.stripVTControlCharacters('\u001B[4mvalue\u001B[0m'));
// Imprime "value"
```
## `util.styleText(format, text[, options])` {#utilstyletextformat-text-options}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable.
:::


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.5.0 | styleText ahora es estable. |
| v22.8.0, v20.18.0 | Respeta isTTY y las variables de entorno como NO_COLORS, NODE_DISABLE_COLORS y FORCE_COLOR. |
| v21.7.0, v20.12.0 | Añadido en: v21.7.0, v20.12.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un formato de texto o una Array de formatos de texto definidos en `util.inspect.colors`.
- `text` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El texto a formatear.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `validateStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es verdadero, se comprueba `stream` para ver si puede manejar colores. **Predeterminado:** `true`.
    - `stream` [\<Stream\>](/es/nodejs/api/stream#stream) Un stream que será validado si puede ser coloreado. **Predeterminado:** `process.stdout`.
  
 

Esta función devuelve un texto formateado considerando el `format` pasado para imprimir en una terminal. Es consciente de las capacidades de la terminal y actúa de acuerdo con la configuración establecida a través de las variables de entorno `NO_COLORS`, `NODE_DISABLE_COLORS` y `FORCE_COLOR`.



::: code-group
```js [ESM]
import { styleText } from 'node:util';
import { stderr } from 'node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Valida si process.stderr tiene TTY
  { stream: stderr },
);
console.error(successMessage);
```

```js [CJS]
const { styleText } = require('node:util');
const { stderr } = require('node:process');

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Valida si process.stderr tiene TTY
  { stream: stderr },
);
console.error(successMessage);
```
:::

`util.inspect.colors` también proporciona formatos de texto como `italic` y `underline` y puedes combinar ambos:

```js [CJS]
console.log(
  util.styleText(['underline', 'italic'], 'My italic underlined message'),
);
```
Cuando se pasa un array de formatos, el orden del formato aplicado es de izquierda a derecha, por lo que el siguiente estilo podría sobrescribir el anterior.

```js [CJS]
console.log(
  util.styleText(['red', 'green'], 'text'), // green
);
```
La lista completa de formatos se puede encontrar en [modificadores](/es/nodejs/api/util#modifiers).


## Clase: `util.TextDecoder` {#class-utiltextdecoder}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.0.0 | La clase ahora está disponible en el objeto global. |
| v8.3.0 | Añadido en: v8.3.0 |
:::

Una implementación de la API `TextDecoder` del [Estándar de Codificación WHATWG](https://encoding.spec.whatwg.org/).

```js [ESM]
const decoder = new TextDecoder();
const u8arr = new Uint8Array([72, 101, 108, 108, 111]);
console.log(decoder.decode(u8arr)); // Hello
```
### Codificaciones compatibles con WHATWG {#whatwg-supported-encodings}

Según el [Estándar de Codificación WHATWG](https://encoding.spec.whatwg.org/), las codificaciones compatibles con la API `TextDecoder` se describen en las tablas a continuación. Para cada codificación, se pueden utilizar uno o más alias.

Diferentes configuraciones de compilación de Node.js admiten diferentes conjuntos de codificaciones. (ver [Internacionalización](/es/nodejs/api/intl))

#### Codificaciones admitidas por defecto (con datos ICU completos) {#encodings-supported-by-default-with-full-icu-data}

| Codificación | Alias |
| --- | --- |
| `'ibm866'` | `'866'`  ,   `'cp866'`  ,   `'csibm866'` |
| `'iso-8859-2'` | `'csisolatin2'`  ,   `'iso-ir-101'`  ,   `'iso8859-2'`  ,   `'iso88592'`  ,   `'iso_8859-2'`  ,   `'iso_8859-2:1987'`  ,   `'l2'`  ,   `'latin2'` |
| `'iso-8859-3'` | `'csisolatin3'`  ,   `'iso-ir-109'`  ,   `'iso8859-3'`  ,   `'iso88593'`  ,   `'iso_8859-3'`  ,   `'iso_8859-3:1988'`  ,   `'l3'`  ,   `'latin3'` |
| `'iso-8859-4'` | `'csisolatin4'`  ,   `'iso-ir-110'`  ,   `'iso8859-4'`  ,   `'iso88594'`  ,   `'iso_8859-4'`  ,   `'iso_8859-4:1988'`  ,   `'l4'`  ,   `'latin4'` |
| `'iso-8859-5'` | `'csisolatincyrillic'`  ,   `'cyrillic'`  ,   `'iso-ir-144'`  ,   `'iso8859-5'`  ,   `'iso88595'`  ,   `'iso_8859-5'`  ,   `'iso_8859-5:1988'` |
| `'iso-8859-6'` | `'arabic'`  ,   `'asmo-708'`  ,   `'csiso88596e'`  ,   `'csiso88596i'`  ,   `'csisolatinarabic'`  ,   `'ecma-114'`  ,   `'iso-8859-6-e'`  ,   `'iso-8859-6-i'`  ,   `'iso-ir-127'`  ,   `'iso8859-6'`  ,   `'iso88596'`  ,   `'iso_8859-6'`  ,   `'iso_8859-6:1987'` |
| `'iso-8859-7'` | `'csisolatingreek'`  ,   `'ecma-118'`  ,   `'elot_928'`  ,   `'greek'`  ,   `'greek8'`  ,   `'iso-ir-126'`  ,   `'iso8859-7'`  ,   `'iso88597'`  ,   `'iso_8859-7'`  ,   `'iso_8859-7:1987'`  ,   `'sun_eu_greek'` |
| `'iso-8859-8'` | `'csiso88598e'`  ,   `'csisolatinhebrew'`  ,   `'hebrew'`  ,   `'iso-8859-8-e'`  ,   `'iso-ir-138'`  ,   `'iso8859-8'`  ,   `'iso88598'`  ,   `'iso_8859-8'`  ,   `'iso_8859-8:1988'`  ,   `'visual'` |
| `'iso-8859-8-i'` | `'csiso88598i'`  ,   `'logical'` |
| `'iso-8859-10'` | `'csisolatin6'`  ,   `'iso-ir-157'`  ,   `'iso8859-10'`  ,   `'iso885910'`  ,   `'l6'`  ,   `'latin6'` |
| `'iso-8859-13'` | `'iso8859-13'`  ,   `'iso885913'` |
| `'iso-8859-14'` | `'iso8859-14'`  ,   `'iso885914'` |
| `'iso-8859-15'` | `'csisolatin9'`  ,   `'iso8859-15'`  ,   `'iso885915'`  ,   `'iso_8859-15'`  ,   `'l9'` |
| `'koi8-r'` | `'cskoi8r'`  ,   `'koi'`  ,   `'koi8'`  ,   `'koi8_r'` |
| `'koi8-u'` | `'koi8-ru'` |
| `'macintosh'` | `'csmacintosh'`  ,   `'mac'`  ,   `'x-mac-roman'` |
| `'windows-874'` | `'dos-874'`  ,   `'iso-8859-11'`  ,   `'iso8859-11'`  ,   `'iso885911'`  ,   `'tis-620'` |
| `'windows-1250'` | `'cp1250'`  ,   `'x-cp1250'` |
| `'windows-1251'` | `'cp1251'`  ,   `'x-cp1251'` |
| `'windows-1252'` | `'ansi_x3.4-1968'`  ,   `'ascii'`  ,   `'cp1252'`  ,   `'cp819'`  ,   `'csisolatin1'`  ,   `'ibm819'`  ,   `'iso-8859-1'`  ,   `'iso-ir-100'`  ,   `'iso8859-1'`  ,   `'iso88591'`  ,   `'iso_8859-1'`  ,   `'iso_8859-1:1987'`  ,   `'l1'`  ,   `'latin1'`  ,   `'us-ascii'`  ,   `'x-cp1252'` |
| `'windows-1253'` | `'cp1253'`  ,   `'x-cp1253'` |
| `'windows-1254'` | `'cp1254'`  ,   `'csisolatin5'`  ,   `'iso-8859-9'`  ,   `'iso-ir-148'`  ,   `'iso8859-9'`  ,   `'iso88599'`  ,   `'iso_8859-9'`  ,   `'iso_8859-9:1989'`  ,   `'l5'`  ,   `'latin5'`  ,   `'x-cp1254'` |
| `'windows-1255'` | `'cp1255'`  ,   `'x-cp1255'` |
| `'windows-1256'` | `'cp1256'`  ,   `'x-cp1256'` |
| `'windows-1257'` | `'cp1257'`  ,   `'x-cp1257'` |
| `'windows-1258'` | `'cp1258'`  ,   `'x-cp1258'` |
| `'x-mac-cyrillic'` | `'x-mac-ukrainian'` |
| `'gbk'` | `'chinese'`  ,   `'csgb2312'`  ,   `'csiso58gb231280'`  ,   `'gb2312'`  ,   `'gb_2312'`  ,   `'gb_2312-80'`  ,   `'iso-ir-58'`  ,   `'x-gbk'` |
| `'gb18030'` ||
| `'big5'` | `'big5-hkscs'`  ,   `'cn-big5'`  ,   `'csbig5'`  ,   `'x-x-big5'` |
| `'euc-jp'` | `'cseucpkdfmtjapanese'`  ,   `'x-euc-jp'` |
| `'iso-2022-jp'` | `'csiso2022jp'` |
| `'shift_jis'` | `'csshiftjis'`  ,   `'ms932'`  ,   `'ms_kanji'`  ,   `'shift-jis'`  ,   `'sjis'`  ,   `'windows-31j'`  ,   `'x-sjis'` |
| `'euc-kr'` | `'cseuckr'`  ,   `'csksc56011987'`  ,   `'iso-ir-149'`  ,   `'korean'`  ,   `'ks_c_5601-1987'`  ,   `'ks_c_5601-1989'`  ,   `'ksc5601'`  ,   `'ksc_5601'`  ,   `'windows-949'` |

#### Codificaciones admitidas cuando Node.js se construye con la opción `small-icu` {#encodings-supported-when-nodejs-is-built-with-the-small-icu-option}

| Codificación | Alias |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
| `'utf-16be'` ||
#### Codificaciones admitidas cuando ICU está desactivado {#encodings-supported-when-icu-is-disabled}

| Codificación | Alias |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
La codificación `'iso-8859-16'` que se enumera en el [Estándar de codificación WHATWG](https://encoding.spec.whatwg.org/) no es compatible.

### `new TextDecoder([encoding[, options]])` {#new-textdecoderencoding-options}

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identifica la `encoding` que admite esta instancia de `TextDecoder`. **Predeterminado:** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si los fallos de decodificación son fatales. Esta opción no es compatible cuando ICU está desactivado (véase [Internacionalización](/es/nodejs/api/intl)). **Predeterminado:** `false`.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, el `TextDecoder` incluirá la marca de orden de bytes en el resultado decodificado. Cuando es `false`, la marca de orden de bytes se eliminará del resultado. Esta opción solo se utiliza cuando `encoding` es `'utf-8'`, `'utf-16be'` o `'utf-16le'`. **Predeterminado:** `false`.
  
 

Crea una nueva instancia de `TextDecoder`. El `encoding` puede especificar una de las codificaciones admitidas o un alias.

La clase `TextDecoder` también está disponible en el objeto global.

### `textDecoder.decode([input[, options]])` {#textdecoderdecodeinput-options}

- `input` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Una instancia de `ArrayBuffer`, `DataView` o `TypedArray` que contiene los datos codificados.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `stream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si se esperan fragmentos de datos adicionales. **Predeterminado:** `false`.
  
 
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Decodifica la `input` y devuelve una cadena. Si `options.stream` es `true`, cualquier secuencia de bytes incompleta que se produzca al final de la `input` se almacena en búfer internamente y se emite después de la siguiente llamada a `textDecoder.decode()`.

Si `textDecoder.fatal` es `true`, los errores de decodificación que se produzcan darán como resultado que se lance un `TypeError`.


### `textDecoder.encoding` {#textdecoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La codificación compatible con la instancia de `TextDecoder`.

### `textDecoder.fatal` {#textdecoderfatal}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

El valor será `true` si los errores de decodificación resultan en que se lance un `TypeError`.

### `textDecoder.ignoreBOM` {#textdecoderignorebom}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

El valor será `true` si el resultado de la decodificación incluye la marca de orden de bytes.

## Clase: `util.TextEncoder` {#class-utiltextencoder}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v11.0.0 | La clase ahora está disponible en el objeto global. |
| v8.3.0 | Añadido en: v8.3.0 |
:::

Una implementación de la [Especificación de codificación WHATWG](https://encoding.spec.whatwg.org/) API `TextEncoder`. Todas las instancias de `TextEncoder` solo admiten la codificación UTF-8.

```js [ESM]
const encoder = new TextEncoder();
const uint8array = encoder.encode('this is some data');
```
La clase `TextEncoder` también está disponible en el objeto global.

### `textEncoder.encode([input])` {#textencoderencodeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El texto para codificar. **Predeterminado:** una cadena vacía.
- Devuelve: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Codifica en UTF-8 la cadena `input` y devuelve un `Uint8Array` que contiene los bytes codificados.

### `textEncoder.encodeInto(src, dest)` {#textencoderencodeintosrc-dest}

**Añadido en: v12.11.0**

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El texto para codificar.
- `dest` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) La matriz para guardar el resultado de la codificación.
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `read` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Las unidades de código Unicode leídas de src.
    - `written` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Los bytes UTF-8 escritos de dest.
  
 

Codifica en UTF-8 la cadena `src` al `dest` Uint8Array y devuelve un objeto que contiene las unidades de código Unicode leídas y los bytes UTF-8 escritos.

```js [ESM]
const encoder = new TextEncoder();
const src = 'this is some data';
const dest = new Uint8Array(10);
const { read, written } = encoder.encodeInto(src, dest);
```

### `textEncoder.encoding` {#textencoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La codificación soportada por la instancia de `TextEncoder`. Siempre establecido en `'utf-8'`.

## `util.toUSVString(string)` {#utiltousvstringstring}

**Agregado en: v16.8.0, v14.18.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve la `string` después de reemplazar cualquier punto de código sustituto (o equivalentemente, cualquier unidad de código sustituta no emparejada) con el "carácter de reemplazo" Unicode U+FFFD.

## `util.transferableAbortController()` {#utiltransferableabortcontroller}

**Agregado en: v18.11.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Crea y devuelve una instancia de [\<AbortController\>](/es/nodejs/api/globals#class-abortcontroller) cuyo [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) está marcado como transferible y se puede utilizar con `structuredClone()` o `postMessage()`.

## `util.transferableAbortSignal(signal)` {#utiltransferableabortsignalsignal}

**Agregado en: v18.11.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal)
- Devuelve: [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal)

Marca el [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) dado como transferible para que se pueda utilizar con `structuredClone()` y `postMessage()`.

```js [ESM]
const signal = transferableAbortSignal(AbortSignal.timeout(100));
const channel = new MessageChannel();
channel.port2.postMessage(signal, [signal]);
```
## `util.aborted(signal, resource)` {#utilabortedsignal-resource}

**Agregado en: v19.7.0, v18.16.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal)
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Cualquier objeto no nulo vinculado a la operación anulable y mantenido débilmente. Si `resource` se recolecta como basura antes de que el `signal` se anule, la promesa permanece pendiente, lo que permite que Node.js deje de rastrearla. Esto ayuda a prevenir fugas de memoria en operaciones de larga duración o no cancelables.
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Escucha el evento de anulación en el `signal` proporcionado y devuelve una promesa que se resuelve cuando se anula el `signal`. Si se proporciona `resource`, hace referencia débil al objeto asociado de la operación, por lo que si `resource` se recolecta como basura antes de que el `signal` se anule, entonces la promesa devuelta permanecerá pendiente. Esto evita fugas de memoria en operaciones de larga duración o no cancelables.



::: code-group
```js [CJS]
const { aborted } = require('node:util');

// Obtain an object with an abortable signal, like a custom resource or operation.
const dependent = obtainSomethingAbortable();

// Pass `dependent` as the resource, indicating the promise should only resolve
// if `dependent` is still in memory when the signal is aborted.
aborted(dependent.signal, dependent).then(() => {

  // This code runs when `dependent` is aborted.
  console.log('Dependent resource was aborted.');
});

// Simulate an event that triggers the abort.
dependent.on('event', () => {
  dependent.abort(); // This will cause the `aborted` promise to resolve.
});
```

```js [ESM]
import { aborted } from 'node:util';

// Obtain an object with an abortable signal, like a custom resource or operation.
const dependent = obtainSomethingAbortable();

// Pass `dependent` as the resource, indicating the promise should only resolve
// if `dependent` is still in memory when the signal is aborted.
aborted(dependent.signal, dependent).then(() => {

  // This code runs when `dependent` is aborted.
  console.log('Dependent resource was aborted.');
});

// Simulate an event that triggers the abort.
dependent.on('event', () => {
  dependent.abort(); // This will cause the `aborted` promise to resolve.
});
```
:::


## `util.types` {#utiltypes}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.3.0 | Expuesto como `require('util/types')`. |
| v10.0.0 | Añadido en: v10.0.0 |
:::

`util.types` proporciona comprobaciones de tipo para diferentes tipos de objetos integrados. A diferencia de `instanceof` u `Object.prototype.toString.call(value)`, estas comprobaciones no inspeccionan las propiedades del objeto que son accesibles desde JavaScript (como su prototipo), y usualmente tienen la sobrecarga de llamar a C++.

El resultado generalmente no ofrece ninguna garantía sobre qué tipo de propiedades o comportamiento expone un valor en JavaScript. Son principalmente útiles para desarrolladores de addons que prefieren hacer la comprobación de tipos en JavaScript.

Se puede acceder a la API a través de `require('node:util').types` o `require('node:util/types')`.

### `util.types.isAnyArrayBuffer(value)` {#utiltypesisanyarraybuffervalue}

**Añadido en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia incorporada de [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) o [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer).

Ver también [`util.types.isArrayBuffer()`](/es/nodejs/api/util#utiltypesisarraybuffervalue) y [`util.types.isSharedArrayBuffer()`](/es/nodejs/api/util#utiltypesissharedarraybuffervalue).

```js [ESM]
util.types.isAnyArrayBuffer(new ArrayBuffer());  // Devuelve true
util.types.isAnyArrayBuffer(new SharedArrayBuffer());  // Devuelve true
```
### `util.types.isArrayBufferView(value)` {#utiltypesisarraybufferviewvalue}

**Añadido en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia de una de las vistas de [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), como los objetos de matriz tipada o [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Equivalente a [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

```js [ESM]
util.types.isArrayBufferView(new Int8Array());  // true
util.types.isArrayBufferView(Buffer.from('hello world')); // true
util.types.isArrayBufferView(new DataView(new ArrayBuffer(16)));  // true
util.types.isArrayBufferView(new ArrayBuffer());  // false
```

### `util.types.isArgumentsObject(value)` {#utiltypesisargumentsobjectvalue}

**Añadido en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es un objeto `arguments`.

```js [ESM]
function foo() {
  util.types.isArgumentsObject(arguments);  // Devuelve true
}
```
### `util.types.isArrayBuffer(value)` {#utiltypesisarraybuffervalue}

**Añadido en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia incorporada de [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Esto *no* incluye instancias de [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer). Por lo general, es deseable probar ambos; Vea [`util.types.isAnyArrayBuffer()`](/es/nodejs/api/util#utiltypesisanyarraybuffervalue) para eso.

```js [ESM]
util.types.isArrayBuffer(new ArrayBuffer());  // Devuelve true
util.types.isArrayBuffer(new SharedArrayBuffer());  // Devuelve false
```
### `util.types.isAsyncFunction(value)` {#utiltypesisasyncfunctionvalue}

**Añadido en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una [función asíncrona](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function). Esto solo informa lo que el motor de JavaScript está viendo; en particular, el valor de retorno puede no coincidir con el código fuente original si se utilizó una herramienta de transpilación.

```js [ESM]
util.types.isAsyncFunction(function foo() {});  // Devuelve false
util.types.isAsyncFunction(async function foo() {});  // Devuelve true
```

### `util.types.isBigInt64Array(value)` {#utiltypesisbigint64arrayvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia de `BigInt64Array`.

```js [ESM]
util.types.isBigInt64Array(new BigInt64Array());   // Devuelve true
util.types.isBigInt64Array(new BigUint64Array());  // Devuelve false
```
### `util.types.isBigIntObject(value)` {#utiltypesisbigintobjectvalue}

**Agregado en: v10.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es un objeto BigInt, por ejemplo, creado por `Object(BigInt(123))`.

```js [ESM]
util.types.isBigIntObject(Object(BigInt(123)));   // Devuelve true
util.types.isBigIntObject(BigInt(123));   // Devuelve false
util.types.isBigIntObject(123);  // Devuelve false
```
### `util.types.isBigUint64Array(value)` {#utiltypesisbiguint64arrayvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia de `BigUint64Array`.

```js [ESM]
util.types.isBigUint64Array(new BigInt64Array());   // Devuelve false
util.types.isBigUint64Array(new BigUint64Array());  // Devuelve true
```
### `util.types.isBooleanObject(value)` {#utiltypesisbooleanobjectvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es un objeto boolean, por ejemplo, creado por `new Boolean()`.

```js [ESM]
util.types.isBooleanObject(false);  // Devuelve false
util.types.isBooleanObject(true);   // Devuelve false
util.types.isBooleanObject(new Boolean(false)); // Devuelve true
util.types.isBooleanObject(new Boolean(true));  // Devuelve true
util.types.isBooleanObject(Boolean(false)); // Devuelve false
util.types.isBooleanObject(Boolean(true));  // Devuelve false
```

### `util.types.isBoxedPrimitive(value)` {#utiltypesisboxedprimitivevalue}

**Agregado en: v10.11.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es cualquier objeto primitivo empaquetado, p. ej., creado por `new Boolean()`, `new String()` u `Object(Symbol())`.

Por ejemplo:

```js [ESM]
util.types.isBoxedPrimitive(false); // Devuelve false
util.types.isBoxedPrimitive(new Boolean(false)); // Devuelve true
util.types.isBoxedPrimitive(Symbol('foo')); // Devuelve false
util.types.isBoxedPrimitive(Object(Symbol('foo'))); // Devuelve true
util.types.isBoxedPrimitive(Object(BigInt(5))); // Devuelve true
```
### `util.types.isCryptoKey(value)` {#utiltypesiscryptokeyvalue}

**Agregado en: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si `value` es una [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey), `false` en caso contrario.

### `util.types.isDataView(value)` {#utiltypesisdataviewvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia incorporada de [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView).

```js [ESM]
const ab = new ArrayBuffer(20);
util.types.isDataView(new DataView(ab));  // Devuelve true
util.types.isDataView(new Float64Array());  // Devuelve false
```
Véase también [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

### `util.types.isDate(value)` {#utiltypesisdatevalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia incorporada de [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).

```js [ESM]
util.types.isDate(new Date());  // Devuelve true
```

### `util.types.isExternal(value)` {#utiltypesisexternalvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es un valor nativo `External`.

Un valor nativo `External` es un tipo especial de objeto que contiene un puntero C++ sin procesar (`void*`) para el acceso desde el código nativo y no tiene otras propiedades. Tales objetos son creados ya sea por internos de Node.js o por complementos nativos. En JavaScript, son objetos [congelados](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) con un prototipo `null`.

```C [C]
#include <js_native_api.h>
#include <stdlib.h>
napi_value result;
static napi_value MyNapi(napi_env env, napi_callback_info info) {
  int* raw = (int*) malloc(1024);
  napi_status status = napi_create_external(env, (void*) raw, NULL, NULL, &result);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "napi_create_external failed");
    return NULL;
  }
  return result;
}
...
DECLARE_NAPI_PROPERTY("myNapi", MyNapi)
...
```
```js [ESM]
const native = require('napi_addon.node');
const data = native.myNapi();
util.types.isExternal(data); // returns true
util.types.isExternal(0); // returns false
util.types.isExternal(new String('foo')); // returns false
```
Para obtener más información sobre `napi_create_external`, consulte [`napi_create_external()`](/es/nodejs/api/n-api#napi_create_external).

### `util.types.isFloat32Array(value)` {#utiltypesisfloat32arrayvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia incorporada [`Float32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array).

```js [ESM]
util.types.isFloat32Array(new ArrayBuffer());  // Returns false
util.types.isFloat32Array(new Float32Array());  // Returns true
util.types.isFloat32Array(new Float64Array());  // Returns false
```

### `util.types.isFloat64Array(value)` {#utiltypesisfloat64arrayvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia incorporada de [`Float64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array).

```js [ESM]
util.types.isFloat64Array(new ArrayBuffer());  // Devuelve false
util.types.isFloat64Array(new Uint8Array());  // Devuelve false
util.types.isFloat64Array(new Float64Array());  // Devuelve true
```
### `util.types.isGeneratorFunction(value)` {#utiltypesisgeneratorfunctionvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una función generadora. Esto solo informa lo que el motor de JavaScript está viendo; en particular, el valor de retorno puede no coincidir con el código fuente original si se utilizó una herramienta de transpilación.

```js [ESM]
util.types.isGeneratorFunction(function foo() {});  // Devuelve false
util.types.isGeneratorFunction(function* foo() {});  // Devuelve true
```
### `util.types.isGeneratorObject(value)` {#utiltypesisgeneratorobjectvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es un objeto generador tal como lo devuelve una función generadora incorporada. Esto solo informa lo que el motor de JavaScript está viendo; en particular, el valor de retorno puede no coincidir con el código fuente original si se utilizó una herramienta de transpilación.

```js [ESM]
function* foo() {}
const generator = foo();
util.types.isGeneratorObject(generator);  // Devuelve true
```
### `util.types.isInt8Array(value)` {#utiltypesisint8arrayvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia incorporada de [`Int8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array).

```js [ESM]
util.types.isInt8Array(new ArrayBuffer());  // Devuelve false
util.types.isInt8Array(new Int8Array());  // Devuelve true
util.types.isInt8Array(new Float64Array());  // Devuelve false
```

### `util.types.isInt16Array(value)` {#utiltypesisint16arrayvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Regresa `true` si el valor es una instancia incorporada de [`Int16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array).

```js [ESM]
util.types.isInt16Array(new ArrayBuffer());  // Regresa false
util.types.isInt16Array(new Int16Array());  // Regresa true
util.types.isInt16Array(new Float64Array());  // Regresa false
```
### `util.types.isInt32Array(value)` {#utiltypesisint32arrayvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Regresa `true` si el valor es una instancia incorporada de [`Int32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array).

```js [ESM]
util.types.isInt32Array(new ArrayBuffer());  // Regresa false
util.types.isInt32Array(new Int32Array());  // Regresa true
util.types.isInt32Array(new Float64Array());  // Regresa false
```
### `util.types.isKeyObject(value)` {#utiltypesiskeyobjectvalue}

**Agregado en: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Regresa `true` si `value` es un [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject), `false` de lo contrario.

### `util.types.isMap(value)` {#utiltypesismapvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Regresa `true` si el valor es una instancia incorporada de [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

```js [ESM]
util.types.isMap(new Map());  // Regresa true
```

### `util.types.isMapIterator(value)` {#utiltypesismapiteratorvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es un iterador devuelto para una instancia [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) incorporada.

```js [ESM]
const map = new Map();
util.types.isMapIterator(map.keys());  // Devuelve true
util.types.isMapIterator(map.values());  // Devuelve true
util.types.isMapIterator(map.entries());  // Devuelve true
util.types.isMapIterator(map[Symbol.iterator]());  // Devuelve true
```
### `util.types.isModuleNamespaceObject(value)` {#utiltypesismodulenamespaceobjectvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia de un [Objeto de Espacio de Nombres del Módulo](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects).

```js [ESM]
import * as ns from './a.js';

util.types.isModuleNamespaceObject(ns);  // Devuelve true
```
### `util.types.isNativeError(value)` {#utiltypesisnativeerrorvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor fue devuelto por el constructor de un [tipo `Error` incorporado](https://tc39.es/ecma262/#sec-error-objects).

```js [ESM]
console.log(util.types.isNativeError(new Error()));  // true
console.log(util.types.isNativeError(new TypeError()));  // true
console.log(util.types.isNativeError(new RangeError()));  // true
```
Las subclases de los tipos de error nativos también son errores nativos:

```js [ESM]
class MyError extends Error {}
console.log(util.types.isNativeError(new MyError()));  // true
```
Que un valor sea `instanceof` una clase de error nativo no es equivalente a que `isNativeError()` devuelva `true` para ese valor. `isNativeError()` devuelve `true` para los errores que provienen de un [ámbito](https://tc39.es/ecma262/#realm) diferente, mientras que `instanceof Error` devuelve `false` para estos errores:

```js [ESM]
const vm = require('node:vm');
const context = vm.createContext({});
const myError = vm.runInContext('new Error()', context);
console.log(util.types.isNativeError(myError)); // true
console.log(myError instanceof Error); // false
```
Por el contrario, `isNativeError()` devuelve `false` para todos los objetos que no fueron devueltos por el constructor de un error nativo. Eso incluye valores que son `instanceof` errores nativos:

```js [ESM]
const myError = { __proto__: Error.prototype };
console.log(util.types.isNativeError(myError)); // false
console.log(myError instanceof Error); // true
```

### `util.types.isNumberObject(value)` {#utiltypesisnumberobjectvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Regresa `true` si el valor es un objeto número, por ejemplo, creado por `new Number()`.

```js [ESM]
util.types.isNumberObject(0);  // Regresa false
util.types.isNumberObject(new Number(0));   // Regresa true
```
### `util.types.isPromise(value)` {#utiltypesispromisevalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Regresa `true` si el valor es un [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) integrado.

```js [ESM]
util.types.isPromise(Promise.resolve(42));  // Regresa true
```
### `util.types.isProxy(value)` {#utiltypesisproxyvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Regresa `true` si el valor es una instancia de [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

```js [ESM]
const target = {};
const proxy = new Proxy(target, {});
util.types.isProxy(target);  // Regresa false
util.types.isProxy(proxy);  // Regresa true
```
### `util.types.isRegExp(value)` {#utiltypesisregexpvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Regresa `true` si el valor es un objeto de expresión regular.

```js [ESM]
util.types.isRegExp(/abc/);  // Regresa true
util.types.isRegExp(new RegExp('abc'));  // Regresa true
```

### `util.types.isSet(value)` {#utiltypesissetvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia incorporada de [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).

```js [ESM]
util.types.isSet(new Set());  // Devuelve true
```
### `util.types.isSetIterator(value)` {#utiltypesissetiteratorvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es un iterador devuelto para una instancia incorporada de [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).

```js [ESM]
const set = new Set();
util.types.isSetIterator(set.keys());  // Devuelve true
util.types.isSetIterator(set.values());  // Devuelve true
util.types.isSetIterator(set.entries());  // Devuelve true
util.types.isSetIterator(set[Symbol.iterator]());  // Devuelve true
```
### `util.types.isSharedArrayBuffer(value)` {#utiltypesissharedarraybuffervalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia incorporada de [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer). Esto *no* incluye instancias de [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Por lo general, es deseable probar ambos; Ver [`util.types.isAnyArrayBuffer()`](/es/nodejs/api/util#utiltypesisanyarraybuffervalue) para eso.

```js [ESM]
util.types.isSharedArrayBuffer(new ArrayBuffer());  // Devuelve false
util.types.isSharedArrayBuffer(new SharedArrayBuffer());  // Devuelve true
```

### `util.types.isStringObject(value)` {#utiltypesisstringobjectvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es un objeto string, p. ej., creado por `new String()`.

```js [ESM]
util.types.isStringObject('foo');  // Devuelve false
util.types.isStringObject(new String('foo'));   // Devuelve true
```
### `util.types.isSymbolObject(value)` {#utiltypesissymbolobjectvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es un objeto symbol, creado llamando a `Object()` en un primitivo `Symbol`.

```js [ESM]
const symbol = Symbol('foo');
util.types.isSymbolObject(symbol);  // Devuelve false
util.types.isSymbolObject(Object(symbol));   // Devuelve true
```
### `util.types.isTypedArray(value)` {#utiltypesistypedarrayvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) incorporada.

```js [ESM]
util.types.isTypedArray(new ArrayBuffer());  // Devuelve false
util.types.isTypedArray(new Uint8Array());  // Devuelve true
util.types.isTypedArray(new Float64Array());  // Devuelve true
```
Ver también [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

### `util.types.isUint8Array(value)` {#utiltypesisuint8arrayvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) incorporada.

```js [ESM]
util.types.isUint8Array(new ArrayBuffer());  // Devuelve false
util.types.isUint8Array(new Uint8Array());  // Devuelve true
util.types.isUint8Array(new Float64Array());  // Devuelve false
```

### `util.types.isUint8ClampedArray(value)` {#utiltypesisuint8clampedarrayvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia [`Uint8ClampedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray) integrada.

```js [ESM]
util.types.isUint8ClampedArray(new ArrayBuffer());  // Devuelve false
util.types.isUint8ClampedArray(new Uint8ClampedArray());  // Devuelve true
util.types.isUint8ClampedArray(new Float64Array());  // Devuelve false
```
### `util.types.isUint16Array(value)` {#utiltypesisuint16arrayvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia [`Uint16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array) integrada.

```js [ESM]
util.types.isUint16Array(new ArrayBuffer());  // Devuelve false
util.types.isUint16Array(new Uint16Array());  // Devuelve true
util.types.isUint16Array(new Float64Array());  // Devuelve false
```
### `util.types.isUint32Array(value)` {#utiltypesisuint32arrayvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia [`Uint32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array) integrada.

```js [ESM]
util.types.isUint32Array(new ArrayBuffer());  // Devuelve false
util.types.isUint32Array(new Uint32Array());  // Devuelve true
util.types.isUint32Array(new Float64Array());  // Devuelve false
```
### `util.types.isWeakMap(value)` {#utiltypesisweakmapvalue}

**Agregado en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) integrada.

```js [ESM]
util.types.isWeakMap(new WeakMap());  // Devuelve true
```

### `util.types.isWeakSet(value)` {#utiltypesisweaksetvalue}

**Añadido en: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el valor es una instancia [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) incorporada.

```js [ESM]
util.types.isWeakSet(new WeakSet());  // Devuelve true
```
## APIs en desuso {#deprecated-apis}

Las siguientes APIs están en desuso y ya no deben utilizarse. Las aplicaciones y módulos existentes deben actualizarse para encontrar enfoques alternativos.

### `util._extend(target, source)` {#util_extendtarget-source}

**Añadido en: v0.7.5**

**Obsoleto desde: v6.0.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Use [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) en su lugar.
:::

- `target` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `source` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

El método `util._extend()` nunca tuvo la intención de ser utilizado fuera de los módulos internos de Node.js. La comunidad lo encontró y lo usó de todos modos.

Está obsoleto y no debe usarse en código nuevo. JavaScript viene con una funcionalidad incorporada muy similar a través de [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

### `util.isArray(object)` {#utilisarrayobject}

**Añadido en: v0.6.0**

**Obsoleto desde: v4.0.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Use [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) en su lugar.
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Alias para [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray).

Devuelve `true` si el `objeto` dado es un `Array`. De lo contrario, devuelve `false`.

```js [ESM]
const util = require('node:util');

util.isArray([]);
// Devuelve: true
util.isArray(new Array());
// Devuelve: true
util.isArray({});
// Devuelve: false
```

