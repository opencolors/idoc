---
title: Documentación de Node.js - Errores
description: Esta sección de la documentación de Node.js ofrece detalles exhaustivos sobre el manejo de errores, incluyendo clases de errores, códigos de error y cómo manejar errores en aplicaciones Node.js.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Errores | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta sección de la documentación de Node.js ofrece detalles exhaustivos sobre el manejo de errores, incluyendo clases de errores, códigos de error y cómo manejar errores en aplicaciones Node.js.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Errores | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta sección de la documentación de Node.js ofrece detalles exhaustivos sobre el manejo de errores, incluyendo clases de errores, códigos de error y cómo manejar errores en aplicaciones Node.js.
---


# Errores {#errors}

Las aplicaciones que se ejecutan en Node.js generalmente experimentan cuatro categorías de errores:

- Errores estándar de JavaScript como [\<EvalError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError), [\<SyntaxError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError), [\<RangeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError), [\<ReferenceError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError), [\<TypeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) y [\<URIError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError).
- Errores del sistema activados por las limitaciones del sistema operativo subyacente, como intentar abrir un archivo que no existe o intentar enviar datos a través de un socket cerrado.
- Errores especificados por el usuario activados por el código de la aplicación.
- Los `AssertionError` son una clase especial de error que se puede activar cuando Node.js detecta una violación lógica excepcional que nunca debería ocurrir. Estos suelen ser provocados por el módulo `node:assert`.

Todos los errores de JavaScript y del sistema generados por Node.js heredan, o son instancias de, la clase estándar de JavaScript [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) y se garantiza que proporcionarán *al menos* las propiedades disponibles en esa clase.

## Propagación e interceptación de errores {#error-propagation-and-interception}

Node.js admite varios mecanismos para propagar y manejar los errores que ocurren mientras se ejecuta una aplicación. La forma en que se informan y manejan estos errores depende completamente del tipo de `Error` y del estilo de la API a la que se llama.

Todos los errores de JavaScript se manejan como excepciones que *inmediatamente* generan y arrojan un error utilizando el mecanismo estándar `throw` de JavaScript. Estos se manejan utilizando la construcción [`try…catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) proporcionada por el lenguaje JavaScript.

```js [ESM]
// Lanza con un ReferenceError porque z no está definido.
try {
  const m = 1;
  const n = m + z;
} catch (err) {
  // Maneja el error aquí.
}
```
Cualquier uso del mecanismo `throw` de JavaScript generará una excepción que *debe* ser manejada o el proceso de Node.js saldrá inmediatamente.

Con pocas excepciones, las APIs *Síncronas* (cualquier método de bloqueo que no devuelva una [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ni acepte una función `callback`, como [`fs.readFileSync`](/es/nodejs/api/fs#fsreadfilesyncpath-options)), utilizarán `throw` para informar de los errores.

Los errores que ocurren dentro de las *APIs Asíncronas* pueden ser reportados de múltiples maneras:

-  Algunos métodos asíncronos devuelven una [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), siempre debes tener en cuenta que podría ser rechazada. Consulta el flag [`--unhandled-rejections`](/es/nodejs/api/cli#--unhandled-rejectionsmode) para saber cómo reaccionará el proceso a un rechazo de promesa no manejado.   
-  La mayoría de los métodos asíncronos que aceptan una función `callback` aceptarán un objeto `Error` pasado como primer argumento a esa función. Si ese primer argumento no es `null` y es una instancia de `Error`, entonces ocurrió un error que debe ser manejado.
-  Cuando se llama a un método asíncrono en un objeto que es un [`EventEmitter`](/es/nodejs/api/events#class-eventemitter), los errores pueden ser enrutados al evento `'error'` de ese objeto.
-  Un puñado de métodos típicamente asíncronos en la API de Node.js todavía pueden usar el mecanismo `throw` para lanzar excepciones que deben ser manejadas usando `try…catch`. No hay una lista completa de tales métodos; por favor, consulta la documentación de cada método para determinar el mecanismo de manejo de errores apropiado requerido.

El uso del mecanismo de evento `'error'` es más común para las APIs [basadas en streams](/es/nodejs/api/stream) y [basadas en emisores de eventos](/es/nodejs/api/events#class-eventemitter), que en sí mismas representan una serie de operaciones asíncronas a lo largo del tiempo (en contraposición a una sola operación que puede pasar o fallar).

Para *todos* los objetos [`EventEmitter`](/es/nodejs/api/events#class-eventemitter), si no se proporciona un controlador de eventos `'error'`, el error será lanzado, causando que el proceso de Node.js reporte una excepción no capturada y se bloquee a menos que: se haya registrado un controlador para el evento [`'uncaughtException'`](/es/nodejs/api/process#event-uncaughtexception), o se utilice el módulo obsoleto [`node:domain`](/es/nodejs/api/domain).

```js [ESM]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

setImmediate(() => {
  // Esto bloqueará el proceso porque no se ha añadido ningún controlador
  // de eventos 'error'.
  ee.emit('error', new Error('Esto bloqueará'));
});
```
Los errores generados de esta manera *no pueden* ser interceptados usando `try…catch` ya que se lanzan *después* de que el código de llamada ya haya salido.

Los desarrolladores deben consultar la documentación de cada método para determinar exactamente cómo se propagan los errores generados por esos métodos.


## Clase: `Error` {#class-error}

Un objeto genérico de JavaScript [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) que no denota ninguna circunstancia específica de por qué ocurrió el error. Los objetos `Error` capturan un "rastreo de pila" que detalla el punto en el código en el que se instanció el `Error`, y pueden proporcionar una descripción textual del error.

Todos los errores generados por Node.js, incluidos todos los errores del sistema y de JavaScript, serán instancias de la clase `Error` o heredarán de ella.

### `new Error(message[, options])` {#new-errormessage-options}

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cause` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El error que causó el error recién creado.

Crea un nuevo objeto `Error` y establece la propiedad `error.message` al mensaje de texto proporcionado. Si se pasa un objeto como `message`, el mensaje de texto se genera llamando a `String(message)`. Si se proporciona la opción `cause`, se asigna a la propiedad `error.cause`. La propiedad `error.stack` representará el punto en el código en el que se llamó a `new Error()`. Los rastreos de pila dependen de la [API de rastreo de pila de V8](https://v8.dev/docs/stack-trace-api). Los rastreos de pila se extienden solo hasta (a) el comienzo de la *ejecución síncrona del código* o (b) el número de fotogramas dado por la propiedad `Error.stackTraceLimit`, lo que sea menor.

### `Error.captureStackTrace(targetObject[, constructorOpt])` {#errorcapturestacktracetargetobject-constructoropt}

- `targetObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `constructorOpt` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Crea una propiedad `.stack` en `targetObject`, que cuando se accede devuelve una cadena que representa la ubicación en el código en la que se llamó a `Error.captureStackTrace()`.

```js [ESM]
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar a `new Error().stack`
```
La primera línea del rastreo tendrá el prefijo `${myObject.name}: ${myObject.message}`.

El argumento opcional `constructorOpt` acepta una función. Si se proporciona, todos los fotogramas por encima de `constructorOpt`, incluido `constructorOpt`, se omitirán del rastreo de pila generado.

El argumento `constructorOpt` es útil para ocultar los detalles de implementación de la generación de errores al usuario. Por ejemplo:

```js [ESM]
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

### `Error.stackTraceLimit` {#errorstacktracelimit}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La propiedad `Error.stackTraceLimit` especifica el número de marcos de pila recopilados por un seguimiento de pila (ya sea generado por `new Error().stack` o `Error.captureStackTrace(obj)`).

El valor predeterminado es `10`, pero se puede establecer en cualquier número JavaScript válido. Los cambios afectarán a cualquier seguimiento de pila capturado *después* de que se haya cambiado el valor.

Si se establece en un valor que no sea un número, o si se establece en un número negativo, los seguimientos de pila no capturarán ningún marco.

### `error.cause` {#errorcause}

**Agregado en: v16.9.0**

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Si está presente, la propiedad `error.cause` es la causa subyacente del `Error`. Se utiliza al detectar un error y lanzar uno nuevo con un mensaje o código diferente para seguir teniendo acceso al error original.

La propiedad `error.cause` normalmente se establece llamando a `new Error(message, { cause })`. No se establece mediante el constructor si no se proporciona la opción `cause`.

Esta propiedad permite encadenar errores. Al serializar objetos `Error`, [`util.inspect()`](/es/nodejs/api/util#utilinspectobject-options) serializa recursivamente `error.cause` si está establecida.

```js [ESM]
const cause = new Error('El servidor HTTP remoto respondió con un estado 500');
const symptom = new Error('No se pudo enviar el mensaje', { cause });

console.log(symptom);
// Prints:
//   Error: No se pudo enviar el mensaje
//       at REPL2:1:17
//       at Script.runInThisContext (node:vm:130:12)
//       ... 7 líneas que coinciden con el seguimiento de pila de la causa ...
//       at [_line] [as _line] (node:internal/readline/interface:886:18) {
//     [cause]: Error: El servidor HTTP remoto respondió con un estado 500
//         at REPL1:1:15
//         at Script.runInThisContext (node:vm:130:12)
//         at REPLServer.defaultEval (node:repl:574:29)
//         at bound (node:domain:426:15)
//         at REPLServer.runBound [as eval] (node:domain:437:12)
//         at REPLServer.onLine (node:repl:902:10)
//         at REPLServer.emit (node:events:549:35)
//         at REPLServer.emit (node:domain:482:12)
//         at [_onLine] [as _onLine] (node:internal/readline/interface:425:12)
//         at [_line] [as _line] (node:internal/readline/interface:886:18)
```

### `error.code` {#errorcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad `error.code` es una etiqueta de cadena que identifica el tipo de error. `error.code` es la forma más estable de identificar un error. Solo cambiará entre versiones principales de Node.js. Por el contrario, las cadenas `error.message` pueden cambiar entre cualquier versión de Node.js. Consulte [Códigos de error de Node.js](/es/nodejs/api/errors#nodejs-error-codes) para obtener detalles sobre códigos específicos.

### `error.message` {#errormessage}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad `error.message` es la descripción en cadena del error tal como se establece al llamar a `new Error(message)`. El `message` pasado al constructor también aparecerá en la primera línea del rastreo de la pila del `Error`, sin embargo, cambiar esta propiedad después de que se crea el objeto `Error` *puede no* cambiar la primera línea del rastreo de la pila (por ejemplo, cuando se lee `error.stack` antes de que se cambie esta propiedad).

```js [ESM]
const err = new Error('El mensaje');
console.error(err.message);
// Imprime: El mensaje
```
### `error.stack` {#errorstack}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad `error.stack` es una cadena que describe el punto en el código en el que se instanció el `Error`.

```bash [BASH]
Error: ¡Las cosas siguen sucediendo!
   at /home/gbusey/file.js:525:2
   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
   at increaseSynergy (/home/gbusey/actors.js:701:6)
```
La primera línea tiene el formato `\<nombre de clase de error\>: \<mensaje de error\>`, y le sigue una serie de marcos de pila (cada línea comienza con "at "). Cada marco describe un sitio de llamada dentro del código que condujo a la generación del error. V8 intenta mostrar un nombre para cada función (por nombre de variable, nombre de función o nombre de método de objeto), pero ocasionalmente no podrá encontrar un nombre adecuado. Si V8 no puede determinar un nombre para la función, solo se mostrará información de ubicación para ese marco. De lo contrario, el nombre de función determinado se mostrará con la información de ubicación adjunta entre paréntesis.

Los marcos solo se generan para funciones de JavaScript. Si, por ejemplo, la ejecución pasa sincrónicamente a través de una función de complemento C++ llamada `cheetahify` que a su vez llama a una función de JavaScript, el marco que representa la llamada `cheetahify` no estará presente en los rastreos de la pila:

```js [ESM]
const cheetahify = require('./native-binding.node');

function makeFaster() {
  // `cheetahify()` llama *sincrónicamente* a speedy.
  cheetahify(function speedy() {
    throw new Error('¡oh no!');
  });
}

makeFaster();
// lanzará:
//   /home/gbusey/file.js:6
//       throw new Error('¡oh no!');
//           ^
//   Error: ¡oh no!
//       at speedy (/home/gbusey/file.js:6:11)
//       at makeFaster (/home/gbusey/file.js:5:3)
//       at Object.<anonymous> (/home/gbusey/file.js:10:1)
//       at Module._compile (module.js:456:26)
//       at Object.Module._extensions..js (module.js:474:10)
//       at Module.load (module.js:356:32)
//       at Function.Module._load (module.js:312:12)
//       at Function.Module.runMain (module.js:497:10)
//       at startup (node.js:119:16)
//       at node.js:906:3
```
La información de ubicación será una de las siguientes:

- `native`, si el marco representa una llamada interna a V8 (como en `[].forEach`).
- `plain-filename.js:line:column`, si el marco representa una llamada interna a Node.js.
- `/absolute/path/to/file.js:line:column`, si el marco representa una llamada en un programa de usuario (utilizando el sistema de módulos CommonJS) o sus dependencias.
- `\<transport-protocol\>:///url/to/module/file.mjs:line:column`, si el marco representa una llamada en un programa de usuario (utilizando el sistema de módulos ES) o sus dependencias.

La cadena que representa el rastreo de la pila se genera de forma diferida cuando se **accede** a la propiedad `error.stack`.

El número de marcos capturados por el rastreo de la pila está limitado por el menor de `Error.stackTraceLimit` o el número de marcos disponibles en el tick actual del bucle de eventos.


## Clase: `AssertionError` {#class-assertionerror}

- Extiende: [\<errors.Error\>](/es/nodejs/api/errors#class-error)

Indica el fallo de una aserción. Para obtener más detalles, consulta [`Class: assert.AssertionError`](/es/nodejs/api/assert#class-assertassertionerror).

## Clase: `RangeError` {#class-rangeerror}

- Extiende: [\<errors.Error\>](/es/nodejs/api/errors#class-error)

Indica que un argumento proporcionado no estaba dentro del conjunto o rango de valores aceptables para una función; ya sea un rango numérico o fuera del conjunto de opciones para un parámetro de función dado.

```js [ESM]
require('node:net').connect(-1);
// Lanza "RangeError: "port" option should be >= 0 and < 65536: -1"
```
Node.js generará y lanzará instancias de `RangeError` *inmediatamente* como una forma de validación de argumentos.

## Clase: `ReferenceError` {#class-referenceerror}

- Extiende: [\<errors.Error\>](/es/nodejs/api/errors#class-error)

Indica que se está intentando acceder a una variable que no está definida. Tales errores comúnmente indican errores tipográficos en el código, o un programa roto de otra manera.

Si bien el código del cliente puede generar y propagar estos errores, en la práctica, solo V8 lo hará.

```js [ESM]
doesNotExist;
// Lanza ReferenceError, doesNotExist no es una variable en este programa.
```
A menos que una aplicación esté generando y ejecutando código dinámicamente, las instancias de `ReferenceError` indican un error en el código o sus dependencias.

## Clase: `SyntaxError` {#class-syntaxerror}

- Extiende: [\<errors.Error\>](/es/nodejs/api/errors#class-error)

Indica que un programa no es JavaScript válido. Estos errores solo pueden generarse y propagarse como resultado de la evaluación del código. La evaluación del código puede ocurrir como resultado de `eval`, `Function`, `require` o [vm](/es/nodejs/api/vm). Estos errores son casi siempre indicativos de un programa roto.

```js [ESM]
try {
  require('node:vm').runInThisContext('binary ! isNotOk');
} catch (err) {
  // 'err' será un SyntaxError.
}
```
Las instancias de `SyntaxError` son irrecuperables en el contexto que las creó; solo pueden ser capturadas por otros contextos.

## Clase: `SystemError` {#class-systemerror}

- Extiende: [\<errors.Error\>](/es/nodejs/api/errors#class-error)

Node.js genera errores del sistema cuando ocurren excepciones dentro de su entorno de tiempo de ejecución. Estos generalmente ocurren cuando una aplicación viola una restricción del sistema operativo. Por ejemplo, ocurrirá un error del sistema si una aplicación intenta leer un archivo que no existe.

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si está presente, la dirección a la que falló una conexión de red
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El código de error de cadena
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si está presente, la ruta del archivo de destino al informar un error del sistema de archivos
- `errno` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de error proporcionado por el sistema
- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Si está presente, detalles adicionales sobre la condición de error
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una descripción del error legible por humanos proporcionada por el sistema
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si está presente, la ruta del archivo al informar un error del sistema de archivos
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si está presente, el puerto de conexión de red que no está disponible
- `syscall` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de la llamada al sistema que activó el error


### `error.address` {#erroraddress}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Si está presente, `error.address` es una cadena que describe la dirección a la que falló una conexión de red.

### `error.code` {#errorcode_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad `error.code` es una cadena que representa el código de error.

### `error.dest` {#errordest}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Si está presente, `error.dest` es la ruta de destino del archivo al informar un error del sistema de archivos.

### `error.errno` {#errorerrno}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La propiedad `error.errno` es un número negativo que corresponde al código de error definido en [`Manejo de errores de libuv`](https://docs.libuv.org/en/v1.x/errors).

En Windows, el número de error proporcionado por el sistema será normalizado por libuv.

Para obtener la representación de cadena del código de error, use [`util.getSystemErrorName(error.errno)`](/es/nodejs/api/util#utilgetsystemerrornameerr).

### `error.info` {#errorinfo}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si está presente, `error.info` es un objeto con detalles sobre la condición de error.

### `error.message` {#errormessage_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.message` es una descripción del error legible por humanos proporcionada por el sistema.

### `error.path` {#errorpath}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Si está presente, `error.path` es una cadena que contiene un nombre de ruta no válido relevante.

### `error.port` {#errorport}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Si está presente, `error.port` es el puerto de conexión de red que no está disponible.

### `error.syscall` {#errorsyscall}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad `error.syscall` es una cadena que describe la [llamada al sistema](https://man7.org/linux/man-pages/man2/syscalls.2) que falló.


### Errores comunes del sistema {#common-system-errors}

Esta es una lista de errores del sistema que se encuentran comúnmente al escribir un programa Node.js. Para obtener una lista completa, consulte la página del manual [`errno`(3)](https://man7.org/linux/man-pages/man3/errno.3).

-  `EACCES` (Permiso denegado): Se intentó acceder a un archivo de una manera prohibida por sus permisos de acceso al archivo.
-  `EADDRINUSE` (Dirección ya en uso): Un intento de enlazar un servidor ([`net`](/es/nodejs/api/net), [`http`](/es/nodejs/api/http) o [`https`](/es/nodejs/api/https)) a una dirección local falló debido a que otro servidor en el sistema local ya ocupaba esa dirección.
-  `ECONNREFUSED` (Conexión rechazada): No se pudo realizar ninguna conexión porque la máquina de destino la rechazó activamente. Esto generalmente resulta de intentar conectarse a un servicio que está inactivo en el host externo.
-  `ECONNRESET` (Conexión restablecida por el par): Un par cerró una conexión por la fuerza. Esto normalmente resulta de una pérdida de la conexión en el socket remoto debido a un tiempo de espera o reinicio. Se encuentra comúnmente a través de los módulos [`http`](/es/nodejs/api/http) y [`net`](/es/nodejs/api/net).
-  `EEXIST` (El archivo existe): Un archivo existente era el objetivo de una operación que requería que el objetivo no existiera.
-  `EISDIR` (Es un directorio): Una operación esperaba un archivo, pero la ruta dada era un directorio.
-  `EMFILE` (Demasiados archivos abiertos en el sistema): Se ha alcanzado el número máximo de [descriptores de archivos](https://en.wikipedia.org/wiki/File_descriptor) permitidos en el sistema, y las solicitudes de otro descriptor no se pueden cumplir hasta que se haya cerrado al menos uno. Esto se encuentra al abrir muchos archivos a la vez en paralelo, especialmente en sistemas (en particular, macOS) donde hay un límite bajo de descriptores de archivos para los procesos. Para solucionar un límite bajo, ejecute `ulimit -n 2048` en el mismo shell que ejecutará el proceso de Node.js.
-  `ENOENT` (No existe tal archivo o directorio): Comúnmente generado por las operaciones de [`fs`](/es/nodejs/api/fs) para indicar que un componente de la ruta especificada no existe. No se pudo encontrar ninguna entidad (archivo o directorio) por la ruta dada.
-  `ENOTDIR` (No es un directorio): Un componente de la ruta dada existía, pero no era un directorio como se esperaba. Comúnmente generado por [`fs.readdir`](/es/nodejs/api/fs#fsreaddirpath-options-callback).
-  `ENOTEMPTY` (Directorio no vacío): Un directorio con entradas era el objetivo de una operación que requiere un directorio vacío, generalmente [`fs.unlink`](/es/nodejs/api/fs#fsunlinkpath-callback).
-  `ENOTFOUND` (Error de búsqueda de DNS): Indica un error de DNS de `EAI_NODATA` o `EAI_NONAME`. Este no es un error POSIX estándar.
-  `EPERM` (Operación no permitida): Se intentó realizar una operación que requiere privilegios elevados.
-  `EPIPE` (Tubería rota): Una escritura en una tubería, socket o FIFO para la cual no hay ningún proceso para leer los datos. Se encuentra comúnmente en las capas [`net`](/es/nodejs/api/net) y [`http`](/es/nodejs/api/http), lo que indica que el lado remoto de la transmisión a la que se está escribiendo se ha cerrado.
-  `ETIMEDOUT` (Tiempo de espera agotado de la operación): Una solicitud de conexión o envío falló porque la parte conectada no respondió correctamente después de un período de tiempo. Generalmente encontrado por [`http`](/es/nodejs/api/http) o [`net`](/es/nodejs/api/net). A menudo es una señal de que no se llamó correctamente a `socket.end()`.


## Clase: `TypeError` {#class-typeerror}

- Extiende [\<errors.Error\>](/es/nodejs/api/errors#class-error)

Indica que un argumento proporcionado no es un tipo permitido. Por ejemplo, pasar una función a un parámetro que espera una cadena sería un `TypeError`.

```js [ESM]
require('node:url').parse(() => { });
// Lanza TypeError, ya que esperaba una cadena.
```
Node.js generará y lanzará instancias de `TypeError` *inmediatamente* como una forma de validación de argumentos.

## Excepciones vs. errores {#exceptions-vs-errors}

Una excepción de JavaScript es un valor que se lanza como resultado de una operación no válida o como el objetivo de una declaración `throw`. Si bien no es obligatorio que estos valores sean instancias de `Error` o clases que hereden de `Error`, todas las excepciones lanzadas por Node.js o el tiempo de ejecución de JavaScript *serán* instancias de `Error`.

Algunas excepciones son *irrecuperables* en la capa de JavaScript. Tales excepciones *siempre* harán que el proceso de Node.js falle. Los ejemplos incluyen comprobaciones de `assert()` o llamadas a `abort()` en la capa C++.

## Errores de OpenSSL {#openssl-errors}

Los errores que se originan en `crypto` o `tls` son de clase `Error` y, además de las propiedades estándar `.code` y `.message`, pueden tener algunas propiedades adicionales específicas de OpenSSL.

### `error.opensslErrorStack` {#erroropensslerrorstack}

Un array de errores que puede dar contexto a dónde se origina un error en la biblioteca OpenSSL.

### `error.function` {#errorfunction}

La función de OpenSSL en la que se origina el error.

### `error.library` {#errorlibrary}

La biblioteca de OpenSSL en la que se origina el error.

### `error.reason` {#errorreason}

Una cadena legible por humanos que describe el motivo del error.

## Códigos de error de Node.js {#nodejs-error-codes}

### `ABORT_ERR` {#abort_err}

**Agregado en: v15.0.0**

Se utiliza cuando una operación se ha abortado (normalmente utilizando un `AbortController`).

Las API que *no* utilizan `AbortSignal` normalmente no generan un error con este código.

Este código no utiliza la convención regular `ERR_*` que utilizan los errores de Node.js para ser compatible con `AbortError` de la plataforma web.

### `ERR_ACCESS_DENIED` {#err_access_denied}

Un tipo especial de error que se activa cada vez que Node.js intenta obtener acceso a un recurso restringido por el [Modelo de Permisos](/es/nodejs/api/permissions#permission-model).


### `ERR_AMBIGUOUS_ARGUMENT` {#err_ambiguous_argument}

Un argumento de función se está utilizando de una manera que sugiere que la firma de la función puede no entenderse. Esto lo lanza el módulo `node:assert` cuando el parámetro `message` en `assert.throws(block, message)` coincide con el mensaje de error lanzado por `block` porque ese uso sugiere que el usuario cree que `message` es el mensaje esperado en lugar del mensaje que `AssertionError` mostrará si `block` no lanza.

### `ERR_ARG_NOT_ITERABLE` {#err_arg_not_iterable}

Se requirió un argumento iterable (es decir, un valor que funcione con los bucles `for...of`), pero no se proporcionó a una API de Node.js.

### `ERR_ASSERTION` {#err_assertion}

Un tipo especial de error que puede activarse cuando Node.js detecta una violación lógica excepcional que nunca debería ocurrir. Estos son lanzados típicamente por el módulo `node:assert`.

### `ERR_ASYNC_CALLBACK` {#err_async_callback}

Se intentó registrar algo que no es una función como una devolución de llamada `AsyncHooks`.

### `ERR_ASYNC_TYPE` {#err_async_type}

El tipo de un recurso asíncrono no era válido. Los usuarios también pueden definir sus propios tipos si utilizan la API pública de incrustación.

### `ERR_BROTLI_COMPRESSION_FAILED` {#err_brotli_compression_failed}

Los datos pasados a un flujo Brotli no se comprimieron correctamente.

### `ERR_BROTLI_INVALID_PARAM` {#err_brotli_invalid_param}

Se pasó una clave de parámetro no válida durante la construcción de un flujo Brotli.

### `ERR_BUFFER_CONTEXT_NOT_AVAILABLE` {#err_buffer_context_not_available}

Se intentó crear una instancia de Node.js `Buffer` a partir de código de complementos o incrustador, mientras que en un Contexto del motor JS que no está asociado con una instancia de Node.js. Los datos pasados al método `Buffer` se habrán liberado cuando el método regrese.

Cuando se encuentra este error, una posible alternativa a la creación de una instancia de `Buffer` es crear un `Uint8Array` normal, que solo difiere en el prototipo del objeto resultante. Los `Uint8Array` son generalmente aceptados en todas las API centrales de Node.js donde están los `Buffer`; están disponibles en todos los Contextos.

### `ERR_BUFFER_OUT_OF_BOUNDS` {#err_buffer_out_of_bounds}

Se intentó realizar una operación fuera de los límites de un `Buffer`.

### `ERR_BUFFER_TOO_LARGE` {#err_buffer_too_large}

Se ha intentado crear un `Buffer` más grande que el tamaño máximo permitido.


### `ERR_CANNOT_WATCH_SIGINT` {#err_cannot_watch_sigint}

Node.js no pudo detectar la señal `SIGINT`.

### `ERR_CHILD_CLOSED_BEFORE_REPLY` {#err_child_closed_before_reply}

Un proceso hijo se cerró antes de que el padre recibiera una respuesta.

### `ERR_CHILD_PROCESS_IPC_REQUIRED` {#err_child_process_ipc_required}

Se utiliza cuando un proceso hijo se está bifurcando sin especificar un canal IPC.

### `ERR_CHILD_PROCESS_STDIO_MAXBUFFER` {#err_child_process_stdio_maxbuffer}

Se utiliza cuando el proceso principal intenta leer datos del STDERR/STDOUT del proceso hijo, y la longitud de los datos es mayor que la opción `maxBuffer`.

### `ERR_CLOSED_MESSAGE_PORT` {#err_closed_message_port}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v16.2.0, v14.17.1 | Se reintrodujo el mensaje de error. |
| v11.12.0 | Se eliminó el mensaje de error. |
| v10.5.0 | Añadido en: v10.5.0 |
:::

Hubo un intento de usar una instancia `MessagePort` en un estado cerrado, generalmente después de que se ha llamado a `.close()`.

### `ERR_CONSOLE_WRITABLE_STREAM` {#err_console_writable_stream}

`Console` se instanció sin un flujo `stdout`, o `Console` tiene un flujo `stdout` o `stderr` no grabable.

### `ERR_CONSTRUCT_CALL_INVALID` {#err_construct_call_invalid}

**Añadido en: v12.5.0**

Se llamó a un constructor de clase que no es invocable.

### `ERR_CONSTRUCT_CALL_REQUIRED` {#err_construct_call_required}

Se llamó a un constructor para una clase sin `new`.

### `ERR_CONTEXT_NOT_INITIALIZED` {#err_context_not_initialized}

El contexto de vm pasado a la API aún no está inicializado. Esto podría suceder cuando ocurre un error (y se detecta) durante la creación del contexto, por ejemplo, cuando falla la asignación o se alcanza el tamaño máximo de la pila de llamadas cuando se crea el contexto.

### `ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED` {#err_crypto_custom_engine_not_supported}

Se solicitó un motor OpenSSL (por ejemplo, a través de las opciones TLS `clientCertEngine` o `privateKeyEngine`) que no es compatible con la versión de OpenSSL que se está utilizando, probablemente debido al indicador de tiempo de compilación `OPENSSL_NO_ENGINE`.

### `ERR_CRYPTO_ECDH_INVALID_FORMAT` {#err_crypto_ecdh_invalid_format}

Se pasó un valor no válido para el argumento `format` al método `getPublicKey()` de la clase `crypto.ECDH()`.

### `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` {#err_crypto_ecdh_invalid_public_key}

Se ha pasado un valor no válido para el argumento `key` al método `computeSecret()` de la clase `crypto.ECDH()`. Significa que la clave pública se encuentra fuera de la curva elíptica.


### `ERR_CRYPTO_ENGINE_UNKNOWN` {#err_crypto_engine_unknown}

Se pasó un identificador de motor criptográfico no válido a [`require('node:crypto').setEngine()`](/es/nodejs/api/crypto#cryptosetengineengine-flags).

### `ERR_CRYPTO_FIPS_FORCED` {#err_crypto_fips_forced}

Se usó el argumento de línea de comandos [`--force-fips`](/es/nodejs/api/cli#--force-fips), pero hubo un intento de habilitar o deshabilitar el modo FIPS en el módulo `node:crypto`.

### `ERR_CRYPTO_FIPS_UNAVAILABLE` {#err_crypto_fips_unavailable}

Se intentó habilitar o deshabilitar el modo FIPS, pero el modo FIPS no estaba disponible.

### `ERR_CRYPTO_HASH_FINALIZED` {#err_crypto_hash_finalized}

[`hash.digest()`](/es/nodejs/api/crypto#hashdigestencoding) se llamó varias veces. El método `hash.digest()` no debe llamarse más de una vez por instancia de un objeto `Hash`.

### `ERR_CRYPTO_HASH_UPDATE_FAILED` {#err_crypto_hash_update_failed}

[`hash.update()`](/es/nodejs/api/crypto#hashupdatedata-inputencoding) falló por alguna razón. Esto rara vez, o nunca, debería suceder.

### `ERR_CRYPTO_INCOMPATIBLE_KEY` {#err_crypto_incompatible_key}

Las claves criptográficas dadas son incompatibles con la operación intentada.

### `ERR_CRYPTO_INCOMPATIBLE_KEY_OPTIONS` {#err_crypto_incompatible_key_options}

La codificación de clave pública o privada seleccionada es incompatible con otras opciones.

### `ERR_CRYPTO_INITIALIZATION_FAILED` {#err_crypto_initialization_failed}

**Agregado en: v15.0.0**

Falló la inicialización del subsistema criptográfico.

### `ERR_CRYPTO_INVALID_AUTH_TAG` {#err_crypto_invalid_auth_tag}

**Agregado en: v15.0.0**

Se proporcionó una etiqueta de autenticación no válida.

### `ERR_CRYPTO_INVALID_COUNTER` {#err_crypto_invalid_counter}

**Agregado en: v15.0.0**

Se proporcionó un contador no válido para un cifrado en modo contador.

### `ERR_CRYPTO_INVALID_CURVE` {#err_crypto_invalid_curve}

**Agregado en: v15.0.0**

Se proporcionó una curva elíptica no válida.

### `ERR_CRYPTO_INVALID_DIGEST` {#err_crypto_invalid_digest}

Se especificó un [algoritmo de resumen criptográfico](/es/nodejs/api/crypto#cryptogethashes) no válido.

### `ERR_CRYPTO_INVALID_IV` {#err_crypto_invalid_iv}

**Agregado en: v15.0.0**

Se proporcionó un vector de inicialización no válido.

### `ERR_CRYPTO_INVALID_JWK` {#err_crypto_invalid_jwk}

**Agregado en: v15.0.0**

Se proporcionó una clave web JSON no válida.

### `ERR_CRYPTO_INVALID_KEYLEN` {#err_crypto_invalid_keylen}

**Agregado en: v15.0.0**

Se proporcionó una longitud de clave no válida.

### `ERR_CRYPTO_INVALID_KEYPAIR` {#err_crypto_invalid_keypair}

**Agregado en: v15.0.0**

Se proporcionó un par de claves no válido.

### `ERR_CRYPTO_INVALID_KEYTYPE` {#err_crypto_invalid_keytype}

**Agregado en: v15.0.0**

Se proporcionó un tipo de clave no válido.


### `ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE` {#err_crypto_invalid_key_object_type}

El tipo del objeto de clave criptográfica proporcionado no es válido para la operación intentada.

### `ERR_CRYPTO_INVALID_MESSAGELEN` {#err_crypto_invalid_messagelen}

**Agregado en: v15.0.0**

Se proporcionó una longitud de mensaje no válida.

### `ERR_CRYPTO_INVALID_SCRYPT_PARAMS` {#err_crypto_invalid_scrypt_params}

**Agregado en: v15.0.0**

Uno o más parámetros de [`crypto.scrypt()`](/es/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) o [`crypto.scryptSync()`](/es/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options) están fuera de su rango legal.

### `ERR_CRYPTO_INVALID_STATE` {#err_crypto_invalid_state}

Se utilizó un método criptográfico en un objeto que estaba en un estado no válido. Por ejemplo, llamar a [`cipher.getAuthTag()`](/es/nodejs/api/crypto#ciphergetauthtag) antes de llamar a `cipher.final()`.

### `ERR_CRYPTO_INVALID_TAG_LENGTH` {#err_crypto_invalid_tag_length}

**Agregado en: v15.0.0**

Se proporcionó una longitud de etiqueta de autenticación no válida.

### `ERR_CRYPTO_JOB_INIT_FAILED` {#err_crypto_job_init_failed}

**Agregado en: v15.0.0**

Falló la inicialización de una operación criptográfica asíncrona.

### `ERR_CRYPTO_JWK_UNSUPPORTED_CURVE` {#err_crypto_jwk_unsupported_curve}

La curva elíptica de la clave no está registrada para su uso en el [Registro de curvas elípticas de clave web JSON](https://www.iana.org/assignments/jose/jose.xhtml#web-key-elliptic-curve).

### `ERR_CRYPTO_JWK_UNSUPPORTED_KEY_TYPE` {#err_crypto_jwk_unsupported_key_type}

El tipo de clave asimétrica de la clave no está registrado para su uso en el [Registro de tipos de clave web JSON](https://www.iana.org/assignments/jose/jose.xhtml#web-key-types).

### `ERR_CRYPTO_OPERATION_FAILED` {#err_crypto_operation_failed}

**Agregado en: v15.0.0**

Una operación criptográfica falló por una razón no especificada.

### `ERR_CRYPTO_PBKDF2_ERROR` {#err_crypto_pbkdf2_error}

El algoritmo PBKDF2 falló por razones no especificadas. OpenSSL no proporciona más detalles y, por lo tanto, Node.js tampoco.

### `ERR_CRYPTO_SCRYPT_NOT_SUPPORTED` {#err_crypto_scrypt_not_supported}

Node.js se compiló sin soporte para `scrypt`. No es posible con los binarios de lanzamiento oficiales, pero puede ocurrir con compilaciones personalizadas, incluidas las compilaciones de distribución.

### `ERR_CRYPTO_SIGN_KEY_REQUIRED` {#err_crypto_sign_key_required}

No se proporcionó una `clave` de firma al método [`sign.sign()`](/es/nodejs/api/crypto#signsignprivatekey-outputencoding).

### `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` {#err_crypto_timing_safe_equal_length}

Se llamó a [`crypto.timingSafeEqual()`](/es/nodejs/api/crypto#cryptotimingsafeequala-b) con argumentos `Buffer`, `TypedArray` o `DataView` de diferentes longitudes.


### `ERR_CRYPTO_UNKNOWN_CIPHER` {#err_crypto_unknown_cipher}

Se especificó un cifrado desconocido.

### `ERR_CRYPTO_UNKNOWN_DH_GROUP` {#err_crypto_unknown_dh_group}

Se proporcionó un nombre de grupo Diffie-Hellman desconocido. Consulte [`crypto.getDiffieHellman()`](/es/nodejs/api/crypto#cryptogetdiffiehellmangroupname) para obtener una lista de nombres de grupo válidos.

### `ERR_CRYPTO_UNSUPPORTED_OPERATION` {#err_crypto_unsupported_operation}

**Agregado en: v15.0.0, v14.18.0**

Se intentó invocar una operación criptográfica no admitida.

### `ERR_DEBUGGER_ERROR` {#err_debugger_error}

**Agregado en: v16.4.0, v14.17.4**

Se produjo un error con el [depurador](/es/nodejs/api/debugger).

### `ERR_DEBUGGER_STARTUP_ERROR` {#err_debugger_startup_error}

**Agregado en: v16.4.0, v14.17.4**

El [depurador](/es/nodejs/api/debugger) agotó el tiempo de espera mientras esperaba que el host/puerto requerido estuviera libre.

### `ERR_DIR_CLOSED` {#err_dir_closed}

El [`fs.Dir`](/es/nodejs/api/fs#class-fsdir) se cerró previamente.

### `ERR_DIR_CONCURRENT_OPERATION` {#err_dir_concurrent_operation}

**Agregado en: v14.3.0**

Se intentó una llamada síncrona de lectura o cierre en un [`fs.Dir`](/es/nodejs/api/fs#class-fsdir) que tiene operaciones asíncronas en curso.

### `ERR_DLOPEN_DISABLED` {#err_dlopen_disabled}

**Agregado en: v16.10.0, v14.19.0**

Se ha deshabilitado la carga de complementos nativos utilizando [`--no-addons`](/es/nodejs/api/cli#--no-addons).

### `ERR_DLOPEN_FAILED` {#err_dlopen_failed}

**Agregado en: v15.0.0**

Falló una llamada a `process.dlopen()`.

### `ERR_DNS_SET_SERVERS_FAILED` {#err_dns_set_servers_failed}

`c-ares` no pudo configurar el servidor DNS.

### `ERR_DOMAIN_CALLBACK_NOT_AVAILABLE` {#err_domain_callback_not_available}

El módulo `node:domain` no era utilizable ya que no pudo establecer los hooks de manejo de errores requeridos, porque [`process.setUncaughtExceptionCaptureCallback()`](/es/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) había sido llamado en un momento anterior.

### `ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE` {#err_domain_cannot_set_uncaught_exception_capture}

No se pudo llamar a [`process.setUncaughtExceptionCaptureCallback()`](/es/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) porque el módulo `node:domain` se había cargado en un momento anterior.

El stack trace se extiende para incluir el momento en que se cargó el módulo `node:domain`.

### `ERR_DUPLICATE_STARTUP_SNAPSHOT_MAIN_FUNCTION` {#err_duplicate_startup_snapshot_main_function}

No se pudo llamar a [`v8.startupSnapshot.setDeserializeMainFunction()`](/es/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) porque ya se había llamado antes.


### `ERR_ENCODING_INVALID_ENCODED_DATA` {#err_encoding_invalid_encoded_data}

Los datos proporcionados a la API `TextDecoder()` no eran válidos según la codificación proporcionada.

### `ERR_ENCODING_NOT_SUPPORTED` {#err_encoding_not_supported}

La codificación proporcionada a la API `TextDecoder()` no era una de las [Codificaciones Soportadas por WHATWG](/es/nodejs/api/util#whatwg-supported-encodings).

### `ERR_EVAL_ESM_CANNOT_PRINT` {#err_eval_esm_cannot_print}

`--print` no se puede utilizar con entradas ESM.

### `ERR_EVENT_RECURSION` {#err_event_recursion}

Se lanza cuando se intenta despachar recursivamente un evento en `EventTarget`.

### `ERR_EXECUTION_ENVIRONMENT_NOT_AVAILABLE` {#err_execution_environment_not_available}

El contexto de ejecución de JS no está asociado con un entorno Node.js. Esto puede ocurrir cuando Node.js se utiliza como una biblioteca integrada y algunos ganchos para el motor de JS no están configurados correctamente.

### `ERR_FALSY_VALUE_REJECTION` {#err_falsy_value_rejection}

Una `Promise` que fue callbackificada a través de `util.callbackify()` fue rechazada con un valor falsy.

### `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` {#err_feature_unavailable_on_platform}

**Agregado en: v14.0.0**

Se utiliza cuando se usa una característica que no está disponible para la plataforma actual que ejecuta Node.js.

### `ERR_FS_CP_DIR_TO_NON_DIR` {#err_fs_cp_dir_to_non_dir}

**Agregado en: v16.7.0**

Se intentó copiar un directorio a un no directorio (archivo, enlace simbólico, etc.) usando [`fs.cp()`](/es/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_EEXIST` {#err_fs_cp_eexist}

**Agregado en: v16.7.0**

Se intentó copiar sobre un archivo que ya existía con [`fs.cp()`](/es/nodejs/api/fs#fscpsrc-dest-options-callback), con `force` y `errorOnExist` establecidos en `true`.

### `ERR_FS_CP_EINVAL` {#err_fs_cp_einval}

**Agregado en: v16.7.0**

Cuando se usa [`fs.cp()`](/es/nodejs/api/fs#fscpsrc-dest-options-callback), `src` o `dest` apuntaban a una ruta inválida.

### `ERR_FS_CP_FIFO_PIPE` {#err_fs_cp_fifo_pipe}

**Agregado en: v16.7.0**

Se intentó copiar una tubería nombrada con [`fs.cp()`](/es/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_NON_DIR_TO_DIR` {#err_fs_cp_non_dir_to_dir}

**Agregado en: v16.7.0**

Se intentó copiar un no directorio (archivo, enlace simbólico, etc.) a un directorio usando [`fs.cp()`](/es/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_SOCKET` {#err_fs_cp_socket}

**Agregado en: v16.7.0**

Se intentó copiar a un socket con [`fs.cp()`](/es/nodejs/api/fs#fscpsrc-dest-options-callback).


### `ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY` {#err_fs_cp_symlink_to_subdirectory}

**Agregado en: v16.7.0**

Cuando se usa [`fs.cp()`](/es/nodejs/api/fs#fscpsrc-dest-options-callback), un enlace simbólico en `dest` apuntaba a un subdirectorio de `src`.

### `ERR_FS_CP_UNKNOWN` {#err_fs_cp_unknown}

**Agregado en: v16.7.0**

Se intentó copiar a un tipo de archivo desconocido con [`fs.cp()`](/es/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_EISDIR` {#err_fs_eisdir}

La ruta es un directorio.

### `ERR_FS_FILE_TOO_LARGE` {#err_fs_file_too_large}

Se ha intentado leer un archivo cuyo tamaño es mayor que el tamaño máximo permitido para un `Buffer`.

### `ERR_HTTP2_ALTSVC_INVALID_ORIGIN` {#err_http2_altsvc_invalid_origin}

Los marcos HTTP/2 ALTSVC requieren un origen válido.

### `ERR_HTTP2_ALTSVC_LENGTH` {#err_http2_altsvc_length}

Los marcos HTTP/2 ALTSVC están limitados a un máximo de 16,382 bytes de carga útil.

### `ERR_HTTP2_CONNECT_AUTHORITY` {#err_http2_connect_authority}

Para las solicitudes HTTP/2 que usan el método `CONNECT`, se requiere el pseudoencabezado `:authority`.

### `ERR_HTTP2_CONNECT_PATH` {#err_http2_connect_path}

Para las solicitudes HTTP/2 que usan el método `CONNECT`, el pseudoencabezado `:path` está prohibido.

### `ERR_HTTP2_CONNECT_SCHEME` {#err_http2_connect_scheme}

Para las solicitudes HTTP/2 que usan el método `CONNECT`, el pseudoencabezado `:scheme` está prohibido.

### `ERR_HTTP2_ERROR` {#err_http2_error}

Se ha producido un error HTTP/2 no específico.

### `ERR_HTTP2_GOAWAY_SESSION` {#err_http2_goaway_session}

No se pueden abrir nuevos Streams HTTP/2 después de que la `Http2Session` haya recibido un marco `GOAWAY` del par conectado.

### `ERR_HTTP2_HEADERS_AFTER_RESPOND` {#err_http2_headers_after_respond}

Se especificaron encabezados adicionales después de que se iniciara una respuesta HTTP/2.

### `ERR_HTTP2_HEADERS_SENT` {#err_http2_headers_sent}

Se intentó enviar varios encabezados de respuesta.

### `ERR_HTTP2_HEADER_SINGLE_VALUE` {#err_http2_header_single_value}

Se proporcionaron varios valores para un campo de encabezado HTTP/2 que debía tener solo un valor.

### `ERR_HTTP2_INFO_STATUS_NOT_ALLOWED` {#err_http2_info_status_not_allowed}

Los códigos de estado HTTP informativos (`1xx`) no se pueden establecer como el código de estado de respuesta en las respuestas HTTP/2.

### `ERR_HTTP2_INVALID_CONNECTION_HEADERS` {#err_http2_invalid_connection_headers}

Los encabezados específicos de la conexión HTTP/1 tienen prohibido usarse en solicitudes y respuestas HTTP/2.

### `ERR_HTTP2_INVALID_HEADER_VALUE` {#err_http2_invalid_header_value}

Se especificó un valor de encabezado HTTP/2 no válido.


### `ERR_HTTP2_INVALID_INFO_STATUS` {#err_http2_invalid_info_status}

Se ha especificado un código de estado informativo HTTP no válido. Los códigos de estado informativos deben ser un entero entre `100` y `199` (inclusive).

### `ERR_HTTP2_INVALID_ORIGIN` {#err_http2_invalid_origin}

Los marcos `ORIGIN` de HTTP/2 requieren un origen válido.

### `ERR_HTTP2_INVALID_PACKED_SETTINGS_LENGTH` {#err_http2_invalid_packed_settings_length}

Las instancias de `Buffer` y `Uint8Array` pasadas a la API `http2.getUnpackedSettings()` deben tener una longitud que sea múltiplo de seis.

### `ERR_HTTP2_INVALID_PSEUDOHEADER` {#err_http2_invalid_pseudoheader}

Solo se pueden usar pseudoencabezados HTTP/2 válidos (`:status`, `:path`, `:authority`, `:scheme` y `:method`).

### `ERR_HTTP2_INVALID_SESSION` {#err_http2_invalid_session}

Se realizó una acción en un objeto `Http2Session` que ya había sido destruido.

### `ERR_HTTP2_INVALID_SETTING_VALUE` {#err_http2_invalid_setting_value}

Se ha especificado un valor no válido para una configuración HTTP/2.

### `ERR_HTTP2_INVALID_STREAM` {#err_http2_invalid_stream}

Se realizó una operación en un flujo que ya había sido destruido.

### `ERR_HTTP2_MAX_PENDING_SETTINGS_ACK` {#err_http2_max_pending_settings_ack}

Cada vez que se envía un marco `SETTINGS` de HTTP/2 a un par conectado, se requiere que el par envíe un acuse de recibo de que ha recibido y aplicado la nueva `SETTINGS`. Por defecto, se puede enviar un número máximo de marcos `SETTINGS` no reconocidos en un momento dado. Este código de error se utiliza cuando se ha alcanzado ese límite.

### `ERR_HTTP2_NESTED_PUSH` {#err_http2_nested_push}

Se intentó iniciar un nuevo flujo push desde dentro de un flujo push. No se permiten flujos push anidados.

### `ERR_HTTP2_NO_MEM` {#err_http2_no_mem}

Sin memoria al usar la API `http2session.setLocalWindowSize(windowSize)`.

### `ERR_HTTP2_NO_SOCKET_MANIPULATION` {#err_http2_no_socket_manipulation}

Se intentó manipular directamente (leer, escribir, pausar, reanudar, etc.) un socket adjunto a un `Http2Session`.

### `ERR_HTTP2_ORIGIN_LENGTH` {#err_http2_origin_length}

Los marcos `ORIGIN` de HTTP/2 están limitados a una longitud de 16382 bytes.

### `ERR_HTTP2_OUT_OF_STREAMS` {#err_http2_out_of_streams}

El número de flujos creados en una sola sesión HTTP/2 alcanzó el límite máximo.

### `ERR_HTTP2_PAYLOAD_FORBIDDEN` {#err_http2_payload_forbidden}

Se especificó una carga útil de mensaje para un código de respuesta HTTP para el cual está prohibida una carga útil.


### `ERR_HTTP2_PING_CANCEL` {#err_http2_ping_cancel}

Un ping HTTP/2 fue cancelado.

### `ERR_HTTP2_PING_LENGTH` {#err_http2_ping_length}

Las cargas útiles de ping HTTP/2 deben tener exactamente 8 bytes de longitud.

### `ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED` {#err_http2_pseudoheader_not_allowed}

Se ha utilizado un pseudoencabezado HTTP/2 de forma inapropiada. Los pseudoencabezados son nombres de clave de encabezado que comienzan con el prefijo `:`.

### `ERR_HTTP2_PUSH_DISABLED` {#err_http2_push_disabled}

Se intentó crear un flujo push, que había sido deshabilitado por el cliente.

### `ERR_HTTP2_SEND_FILE` {#err_http2_send_file}

Se intentó utilizar la API `Http2Stream.prototype.responseWithFile()` para enviar un directorio.

### `ERR_HTTP2_SEND_FILE_NOSEEK` {#err_http2_send_file_noseek}

Se intentó utilizar la API `Http2Stream.prototype.responseWithFile()` para enviar algo que no es un archivo regular, pero se proporcionaron las opciones `offset` o `length`.

### `ERR_HTTP2_SESSION_ERROR` {#err_http2_session_error}

La `Http2Session` se cerró con un código de error distinto de cero.

### `ERR_HTTP2_SETTINGS_CANCEL` {#err_http2_settings_cancel}

La configuración de `Http2Session` fue cancelada.

### `ERR_HTTP2_SOCKET_BOUND` {#err_http2_socket_bound}

Se intentó conectar un objeto `Http2Session` a un `net.Socket` o `tls.TLSSocket` que ya se había vinculado a otro objeto `Http2Session`.

### `ERR_HTTP2_SOCKET_UNBOUND` {#err_http2_socket_unbound}

Se intentó utilizar la propiedad `socket` de una `Http2Session` que ya ha sido cerrada.

### `ERR_HTTP2_STATUS_101` {#err_http2_status_101}

El uso del código de estado informativo `101` está prohibido en HTTP/2.

### `ERR_HTTP2_STATUS_INVALID` {#err_http2_status_invalid}

Se ha especificado un código de estado HTTP no válido. Los códigos de estado deben ser un entero entre `100` y `599` (inclusive).

### `ERR_HTTP2_STREAM_CANCEL` {#err_http2_stream_cancel}

Un `Http2Stream` fue destruido antes de que se transmitieran datos al peer conectado.

### `ERR_HTTP2_STREAM_ERROR` {#err_http2_stream_error}

Se especificó un código de error distinto de cero en un frame `RST_STREAM`.

### `ERR_HTTP2_STREAM_SELF_DEPENDENCY` {#err_http2_stream_self_dependency}

Al establecer la prioridad para un flujo HTTP/2, el flujo puede marcarse como una dependencia para un flujo primario. Este código de error se utiliza cuando se intenta marcar un flujo como dependiente de sí mismo.

### `ERR_HTTP2_TOO_MANY_CUSTOM_SETTINGS` {#err_http2_too_many_custom_settings}

Se ha excedido el número de configuraciones personalizadas admitidas (10).


### `ERR_HTTP2_TOO_MANY_INVALID_FRAMES` {#err_http2_too_many_invalid_frames}

**Añadido en: v15.14.0**

Se ha excedido el límite de tramas de protocolo HTTP/2 no válidas aceptables enviadas por el par, según se especifica mediante la opción `maxSessionInvalidFrames`.

### `ERR_HTTP2_TRAILERS_ALREADY_SENT` {#err_http2_trailers_already_sent}

Los encabezados finales ya se han enviado en el `Http2Stream`.

### `ERR_HTTP2_TRAILERS_NOT_READY` {#err_http2_trailers_not_ready}

El método `http2stream.sendTrailers()` no se puede llamar hasta después de que se emita el evento `'wantTrailers'` en un objeto `Http2Stream`. El evento `'wantTrailers'` solo se emitirá si la opción `waitForTrailers` está configurada para el `Http2Stream`.

### `ERR_HTTP2_UNSUPPORTED_PROTOCOL` {#err_http2_unsupported_protocol}

Se pasó a `http2.connect()` una URL que utiliza cualquier protocolo que no sea `http:` o `https:`.

### `ERR_HTTP_BODY_NOT_ALLOWED` {#err_http_body_not_allowed}

Se produce un error al escribir en una respuesta HTTP que no permite contenido.

### `ERR_HTTP_CONTENT_LENGTH_MISMATCH` {#err_http_content_length_mismatch}

El tamaño del cuerpo de la respuesta no coincide con el valor del encabezado content-length especificado.

### `ERR_HTTP_HEADERS_SENT` {#err_http_headers_sent}

Se intentó agregar más encabezados después de que ya se habían enviado los encabezados.

### `ERR_HTTP_INVALID_HEADER_VALUE` {#err_http_invalid_header_value}

Se especificó un valor de encabezado HTTP no válido.

### `ERR_HTTP_INVALID_STATUS_CODE` {#err_http_invalid_status_code}

El código de estado estaba fuera del rango de código de estado regular (100-999).

### `ERR_HTTP_REQUEST_TIMEOUT` {#err_http_request_timeout}

El cliente no ha enviado la solicitud completa dentro del tiempo permitido.

### `ERR_HTTP_SOCKET_ASSIGNED` {#err_http_socket_assigned}

Al [`ServerResponse`](/es/nodejs/api/http#class-httpserverresponse) dado ya se le asignó un socket.

### `ERR_HTTP_SOCKET_ENCODING` {#err_http_socket_encoding}

No se permite cambiar la codificación del socket según la [RFC 7230 Sección 3](https://tools.ietf.org/html/rfc7230#section-3).

### `ERR_HTTP_TRAILER_INVALID` {#err_http_trailer_invalid}

El encabezado `Trailer` se estableció aunque la codificación de transferencia no lo admita.

### `ERR_ILLEGAL_CONSTRUCTOR` {#err_illegal_constructor}

Se intentó construir un objeto utilizando un constructor no público.

### `ERR_IMPORT_ATTRIBUTE_MISSING` {#err_import_attribute_missing}

**Añadido en: v21.1.0**

Falta un atributo de importación, lo que impide que se importe el módulo especificado.


### `ERR_IMPORT_ATTRIBUTE_TYPE_INCOMPATIBLE` {#err_import_attribute_type_incompatible}

**Añadido en: v21.1.0**

Se proporcionó un atributo `type` de importación, pero el módulo especificado es de un tipo diferente.

### `ERR_IMPORT_ATTRIBUTE_UNSUPPORTED` {#err_import_attribute_unsupported}

**Añadido en: v21.0.0, v20.10.0, v18.19.0**

Esta versión de Node.js no admite un atributo de importación.

### `ERR_INCOMPATIBLE_OPTION_PAIR` {#err_incompatible_option_pair}

Un par de opciones es incompatible entre sí y no se puede utilizar al mismo tiempo.

### `ERR_INPUT_TYPE_NOT_ALLOWED` {#err_input_type_not_allowed}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Se utilizó la bandera `--input-type` para intentar ejecutar un archivo. Esta bandera solo se puede utilizar con la entrada a través de `--eval`, `--print` o `STDIN`.

### `ERR_INSPECTOR_ALREADY_ACTIVATED` {#err_inspector_already_activated}

Mientras se utilizaba el módulo `node:inspector`, se intentó activar el inspector cuando ya había comenzado a escuchar en un puerto. Utilice `inspector.close()` antes de activarlo en una dirección diferente.

### `ERR_INSPECTOR_ALREADY_CONNECTED` {#err_inspector_already_connected}

Mientras se utilizaba el módulo `node:inspector`, se intentó conectar cuando el inspector ya estaba conectado.

### `ERR_INSPECTOR_CLOSED` {#err_inspector_closed}

Mientras se utilizaba el módulo `node:inspector`, se intentó utilizar el inspector después de que la sesión ya se hubiera cerrado.

### `ERR_INSPECTOR_COMMAND` {#err_inspector_command}

Se produjo un error al emitir un comando a través del módulo `node:inspector`.

### `ERR_INSPECTOR_NOT_ACTIVE` {#err_inspector_not_active}

El `inspector` no está activo cuando se llama a `inspector.waitForDebugger()`.

### `ERR_INSPECTOR_NOT_AVAILABLE` {#err_inspector_not_available}

El módulo `node:inspector` no está disponible para su uso.

### `ERR_INSPECTOR_NOT_CONNECTED` {#err_inspector_not_connected}

Mientras se utilizaba el módulo `node:inspector`, se intentó utilizar el inspector antes de que estuviera conectado.

### `ERR_INSPECTOR_NOT_WORKER` {#err_inspector_not_worker}

Se llamó a una API en el hilo principal que solo se puede utilizar desde el hilo de trabajo.

### `ERR_INTERNAL_ASSERTION` {#err_internal_assertion}

Hubo un error en Node.js o un uso incorrecto de los internos de Node.js. Para solucionar el error, abra un problema en [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues).


### `ERR_INVALID_ADDRESS` {#err_invalid_address}

La API de Node.js no entiende la dirección proporcionada.

### `ERR_INVALID_ADDRESS_FAMILY` {#err_invalid_address_family}

La API de Node.js no entiende la familia de direcciones proporcionada.

### `ERR_INVALID_ARG_TYPE` {#err_invalid_arg_type}

Se pasó un argumento del tipo incorrecto a una API de Node.js.

### `ERR_INVALID_ARG_VALUE` {#err_invalid_arg_value}

Se pasó un valor no válido o no admitido para un argumento dado.

### `ERR_INVALID_ASYNC_ID` {#err_invalid_async_id}

Se pasó un `asyncId` o `triggerAsyncId` no válido utilizando `AsyncHooks`. Un ID menor que -1 nunca debería ocurrir.

### `ERR_INVALID_BUFFER_SIZE` {#err_invalid_buffer_size}

Se realizó un intercambio en un `Buffer` pero su tamaño no era compatible con la operación.

### `ERR_INVALID_CHAR` {#err_invalid_char}

Se detectaron caracteres no válidos en los encabezados.

### `ERR_INVALID_CURSOR_POS` {#err_invalid_cursor_pos}

No se puede mover un cursor en una transmisión dada a una fila especificada sin una columna especificada.

### `ERR_INVALID_FD` {#err_invalid_fd}

Un descriptor de archivo ('fd') no era válido (p. ej., era un valor negativo).

### `ERR_INVALID_FD_TYPE` {#err_invalid_fd_type}

Un tipo de descriptor de archivo ('fd') no era válido.

### `ERR_INVALID_FILE_URL_HOST` {#err_invalid_file_url_host}

Una API de Node.js que consume URL `file:` (como ciertas funciones en el módulo [`fs`](/es/nodejs/api/fs)) encontró una URL de archivo con un host incompatible. Esta situación solo puede ocurrir en sistemas tipo Unix donde solo se admite `localhost` o un host vacío.

### `ERR_INVALID_FILE_URL_PATH` {#err_invalid_file_url_path}

Una API de Node.js que consume URL `file:` (como ciertas funciones en el módulo [`fs`](/es/nodejs/api/fs)) encontró una URL de archivo con una ruta incompatible. La semántica exacta para determinar si se puede usar una ruta depende de la plataforma.

### `ERR_INVALID_HANDLE_TYPE` {#err_invalid_handle_type}

Se intentó enviar un "handle" no admitido a través de un canal de comunicación IPC a un proceso hijo. Consulte [`subprocess.send()`](/es/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) y [`process.send()`](/es/nodejs/api/process#processsendmessage-sendhandle-options-callback) para obtener más información.

### `ERR_INVALID_HTTP_TOKEN` {#err_invalid_http_token}

Se proporcionó un token HTTP no válido.

### `ERR_INVALID_IP_ADDRESS` {#err_invalid_ip_address}

Una dirección IP no es válida.


### `ERR_INVALID_MIME_SYNTAX` {#err_invalid_mime_syntax}

La sintaxis de un MIME no es válida.

### `ERR_INVALID_MODULE` {#err_invalid_module}

**Agregado en: v15.0.0, v14.18.0**

Se intentó cargar un módulo que no existe o que no era válido.

### `ERR_INVALID_MODULE_SPECIFIER` {#err_invalid_module_specifier}

La cadena de módulo importada no es una URL, un nombre de paquete o un especificador de subruta de paquete válidos.

### `ERR_INVALID_OBJECT_DEFINE_PROPERTY` {#err_invalid_object_define_property}

Se produjo un error al establecer un atributo no válido en la propiedad de un objeto.

### `ERR_INVALID_PACKAGE_CONFIG` {#err_invalid_package_config}

Un archivo [`package.json`](/es/nodejs/api/packages#nodejs-packagejson-field-definitions) no válido no se pudo analizar.

### `ERR_INVALID_PACKAGE_TARGET` {#err_invalid_package_target}

El campo [`"exports"`](/es/nodejs/api/packages#exports) de `package.json` contiene un valor de mapeo de destino no válido para la resolución de módulo intentada.

### `ERR_INVALID_PROTOCOL` {#err_invalid_protocol}

Se pasó un `options.protocol` no válido a `http.request()`.

### `ERR_INVALID_REPL_EVAL_CONFIG` {#err_invalid_repl_eval_config}

Se establecieron las opciones `breakEvalOnSigint` y `eval` en la configuración de [`REPL`](/es/nodejs/api/repl), lo cual no es compatible.

### `ERR_INVALID_REPL_INPUT` {#err_invalid_repl_input}

La entrada no se puede usar en el [`REPL`](/es/nodejs/api/repl). Las condiciones bajo las cuales se usa este error se describen en la documentación de [`REPL`](/es/nodejs/api/repl).

### `ERR_INVALID_RETURN_PROPERTY` {#err_invalid_return_property}

Se lanza en caso de que una opción de función no proporcione un valor válido para una de las propiedades de objeto devueltas en la ejecución.

### `ERR_INVALID_RETURN_PROPERTY_VALUE` {#err_invalid_return_property_value}

Se lanza en caso de que una opción de función no proporcione un tipo de valor esperado para una de las propiedades de objeto devueltas en la ejecución.

### `ERR_INVALID_RETURN_VALUE` {#err_invalid_return_value}

Se lanza en caso de que una opción de función no devuelva un tipo de valor esperado en la ejecución, como cuando se espera que una función devuelva una promesa.

### `ERR_INVALID_STATE` {#err_invalid_state}

**Agregado en: v15.0.0**

Indica que una operación no se puede completar debido a un estado no válido. Por ejemplo, un objeto puede haber sido destruido o puede estar realizando otra operación.

### `ERR_INVALID_SYNC_FORK_INPUT` {#err_invalid_sync_fork_input}

Se proporcionó un `Buffer`, `TypedArray`, `DataView` o `string` como entrada stdio a una bifurcación asíncrona. Consulte la documentación del módulo [`child_process`](/es/nodejs/api/child_process) para obtener más información.


### `ERR_INVALID_THIS` {#err_invalid_this}

Se llamó a una función de la API de Node.js con un valor `this` incompatible.

```js [ESM]
const urlSearchParams = new URLSearchParams('foo=bar&baz=new');

const buf = Buffer.alloc(1);
urlSearchParams.has.call(buf, 'foo');
// Lanza un TypeError con el código 'ERR_INVALID_THIS'
```
### `ERR_INVALID_TUPLE` {#err_invalid_tuple}

Un elemento en el `iterable` proporcionado al [`constructor URLSearchParams`](/es/nodejs/api/url#new-urlsearchparamsiterable) [WHATWG](/es/nodejs/api/url#the-whatwg-url-api) no representaba una tupla `[nombre, valor]` – es decir, si un elemento no es iterable, o no consta exactamente de dos elementos.

### `ERR_INVALID_TYPESCRIPT_SYNTAX` {#err_invalid_typescript_syntax}

**Agregado en: v23.0.0**

La sintaxis de TypeScript proporcionada no es válida o no es compatible. Esto podría suceder al usar la sintaxis de TypeScript que requiere transformación con [eliminación de tipos](/es/nodejs/api/typescript#type-stripping).

### `ERR_INVALID_URI` {#err_invalid_uri}

Se pasó una URI no válida.

### `ERR_INVALID_URL` {#err_invalid_url}

Se pasó una URL no válida al [`constructor URL`](/es/nodejs/api/url#new-urlinput-base) [WHATWG](/es/nodejs/api/url#the-whatwg-url-api) o al legado [`url.parse()`](/es/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) para ser analizada. El objeto de error lanzado normalmente tiene una propiedad adicional `'input'` que contiene la URL que no se pudo analizar.

### `ERR_INVALID_URL_SCHEME` {#err_invalid_url_scheme}

Se intentó utilizar una URL de un esquema (protocolo) incompatible para un propósito específico. Solo se usa en el soporte de la [API URL WHATWG](/es/nodejs/api/url#the-whatwg-url-api) en el módulo [`fs`](/es/nodejs/api/fs) (que solo acepta URLs con el esquema `'file'`), pero también se puede usar en otras API de Node.js en el futuro.

### `ERR_IPC_CHANNEL_CLOSED` {#err_ipc_channel_closed}

Se intentó usar un canal de comunicación IPC que ya estaba cerrado.

### `ERR_IPC_DISCONNECTED` {#err_ipc_disconnected}

Se intentó desconectar un canal de comunicación IPC que ya estaba desconectado. Consulte la documentación del módulo [`child_process`](/es/nodejs/api/child_process) para obtener más información.

### `ERR_IPC_ONE_PIPE` {#err_ipc_one_pipe}

Se intentó crear un proceso secundario de Node.js utilizando más de un canal de comunicación IPC. Consulte la documentación del módulo [`child_process`](/es/nodejs/api/child_process) para obtener más información.


### `ERR_IPC_SYNC_FORK` {#err_ipc_sync_fork}

Se intentó abrir un canal de comunicación IPC con un proceso de Node.js bifurcado sincrónicamente. Consulte la documentación del módulo [`child_process`](/es/nodejs/api/child_process) para obtener más información.

### `ERR_IP_BLOCKED` {#err_ip_blocked}

IP bloqueada por `net.BlockList`.

### `ERR_LOADER_CHAIN_INCOMPLETE` {#err_loader_chain_incomplete}

**Agregado en: v18.6.0, v16.17.0**

Un hook del cargador de ESM regresó sin llamar a `next()` y sin señalar explícitamente un cortocircuito.

### `ERR_LOAD_SQLITE_EXTENSION` {#err_load_sqlite_extension}

**Agregado en: v23.5.0**

Se produjo un error al cargar una extensión de SQLite.

### `ERR_MEMORY_ALLOCATION_FAILED` {#err_memory_allocation_failed}

Se intentó asignar memoria (generalmente en la capa C++), pero falló.

### `ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE` {#err_message_target_context_unavailable}

**Agregado en: v14.5.0, v12.19.0**

Un mensaje publicado en un [`MessagePort`](/es/nodejs/api/worker_threads#class-messageport) no se pudo deserializar en el [`Context`](/es/nodejs/api/vm) de [vm](/es/nodejs/api/vm) de destino. No todos los objetos de Node.js se pueden instanciar correctamente en cualquier contexto en este momento, e intentar transferirlos usando `postMessage()` puede fallar en el lado receptor en ese caso.

### `ERR_METHOD_NOT_IMPLEMENTED` {#err_method_not_implemented}

Se requiere un método pero no se implementa.

### `ERR_MISSING_ARGS` {#err_missing_args}

No se pasó un argumento requerido de una API de Node.js. Esto solo se usa para el cumplimiento estricto de la especificación de la API (que en algunos casos puede aceptar `func(undefined)` pero no `func()`). En la mayoría de las API nativas de Node.js, `func(undefined)` y `func()` se tratan de forma idéntica, y el código de error [`ERR_INVALID_ARG_TYPE`](/es/nodejs/api/errors#err_invalid_arg_type) puede usarse en su lugar.

### `ERR_MISSING_OPTION` {#err_missing_option}

Para las API que aceptan objetos de opciones, algunas opciones podrían ser obligatorias. Este código se lanza si falta una opción requerida.

### `ERR_MISSING_PASSPHRASE` {#err_missing_passphrase}

Se intentó leer una clave encriptada sin especificar una frase de contraseña.

### `ERR_MISSING_PLATFORM_FOR_WORKER` {#err_missing_platform_for_worker}

La plataforma V8 utilizada por esta instancia de Node.js no admite la creación de Workers. Esto se debe a la falta de soporte del incrustador para Workers. En particular, este error no ocurrirá con las compilaciones estándar de Node.js.


### `ERR_MODULE_NOT_FOUND` {#err_module_not_found}

Un archivo de módulo no pudo ser resuelto por el cargador de módulos ECMAScript al intentar una operación de `import` o al cargar el punto de entrada del programa.

### `ERR_MULTIPLE_CALLBACK` {#err_multiple_callback}

Una función de retorno (callback) fue llamada más de una vez.

Una función de retorno casi siempre está destinada a ser llamada solo una vez, ya que la consulta puede ser satisfecha o rechazada, pero no ambas al mismo tiempo. Esto último sería posible al llamar a una función de retorno más de una vez.

### `ERR_NAPI_CONS_FUNCTION` {#err_napi_cons_function}

Al usar `Node-API`, un constructor pasado no era una función.

### `ERR_NAPI_INVALID_DATAVIEW_ARGS` {#err_napi_invalid_dataview_args}

Al llamar a `napi_create_dataview()`, un `offset` dado estaba fuera de los límites de la dataview o `offset + length` era mayor que la longitud del `buffer` dado.

### `ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT` {#err_napi_invalid_typedarray_alignment}

Al llamar a `napi_create_typedarray()`, el `offset` proporcionado no era un múltiplo del tamaño del elemento.

### `ERR_NAPI_INVALID_TYPEDARRAY_LENGTH` {#err_napi_invalid_typedarray_length}

Al llamar a `napi_create_typedarray()`, `(length * size_of_element) + byte_offset` era mayor que la longitud del `buffer` dado.

### `ERR_NAPI_TSFN_CALL_JS` {#err_napi_tsfn_call_js}

Ocurrió un error al invocar la parte de JavaScript de la función segura para subprocesos.

### `ERR_NAPI_TSFN_GET_UNDEFINED` {#err_napi_tsfn_get_undefined}

Ocurrió un error al intentar recuperar el valor `undefined` de JavaScript.

### `ERR_NON_CONTEXT_AWARE_DISABLED` {#err_non_context_aware_disabled}

Un complemento nativo no consciente del contexto se cargó en un proceso que no los permite.

### `ERR_NOT_BUILDING_SNAPSHOT` {#err_not_building_snapshot}

Se intentó utilizar operaciones que solo se pueden usar al construir una instantánea de inicio de V8, aunque Node.js no está construyendo una.

### `ERR_NOT_IN_SINGLE_EXECUTABLE_APPLICATION` {#err_not_in_single_executable_application}

**Agregado en: v21.7.0, v20.12.0**

La operación no se puede realizar cuando no está en una aplicación de un solo ejecutable.

### `ERR_NOT_SUPPORTED_IN_SNAPSHOT` {#err_not_supported_in_snapshot}

Se intentó realizar operaciones que no son compatibles al construir una instantánea de inicio.

### `ERR_NO_CRYPTO` {#err_no_crypto}

Se intentó utilizar funciones criptográficas mientras que Node.js no se compiló con soporte criptográfico OpenSSL.


### `ERR_NO_ICU` {#err_no_icu}

Se intentó usar características que requieren [ICU](/es/nodejs/api/intl#internationalization-support), pero Node.js no se compiló con soporte para ICU.

### `ERR_NO_TYPESCRIPT` {#err_no_typescript}

**Agregado en: v23.0.0**

Se intentó usar características que requieren [soporte nativo de TypeScript](/es/nodejs/api/typescript#type-stripping), pero Node.js no se compiló con soporte para TypeScript.

### `ERR_OPERATION_FAILED` {#err_operation_failed}

**Agregado en: v15.0.0**

Una operación falló. Esto se usa normalmente para indicar el fallo general de una operación asíncrona.

### `ERR_OUT_OF_RANGE` {#err_out_of_range}

Un valor dado está fuera del rango aceptado.

### `ERR_PACKAGE_IMPORT_NOT_DEFINED` {#err_package_import_not_defined}

El campo [`"imports"`](/es/nodejs/api/packages#imports) de `package.json` no define la asignación del especificador de paquete interno dado.

### `ERR_PACKAGE_PATH_NOT_EXPORTED` {#err_package_path_not_exported}

El campo [`"exports"`](/es/nodejs/api/packages#exports) de `package.json` no exporta la subruta solicitada. Debido a que las exportaciones están encapsuladas, los módulos internos privados que no se exportan no se pueden importar a través de la resolución del paquete, a menos que se use una URL absoluta.

### `ERR_PARSE_ARGS_INVALID_OPTION_VALUE` {#err_parse_args_invalid_option_value}

**Agregado en: v18.3.0, v16.17.0**

Cuando `strict` se establece en `true`, [`util.parseArgs()`](/es/nodejs/api/util#utilparseargsconfig) lo arroja si se proporciona un valor [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) para una opción de tipo [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), o si se proporciona un valor [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) para una opción de tipo [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).

### `ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL` {#err_parse_args_unexpected_positional}

**Agregado en: v18.3.0, v16.17.0**

Arrojado por [`util.parseArgs()`](/es/nodejs/api/util#utilparseargsconfig), cuando se proporciona un argumento posicional y `allowPositionals` se establece en `false`.

### `ERR_PARSE_ARGS_UNKNOWN_OPTION` {#err_parse_args_unknown_option}

**Agregado en: v18.3.0, v16.17.0**

Cuando `strict` se establece en `true`, [`util.parseArgs()`](/es/nodejs/api/util#utilparseargsconfig) lo arroja si un argumento no está configurado en `options`.


### `ERR_PERFORMANCE_INVALID_TIMESTAMP` {#err_performance_invalid_timestamp}

Se proporcionó un valor de marca de tiempo no válido para una marca o medida de rendimiento.

### `ERR_PERFORMANCE_MEASURE_INVALID_OPTIONS` {#err_performance_measure_invalid_options}

Se proporcionaron opciones no válidas para una medida de rendimiento.

### `ERR_PROTO_ACCESS` {#err_proto_access}

Se ha prohibido el acceso a `Object.prototype.__proto__` utilizando [`--disable-proto=throw`](/es/nodejs/api/cli#--disable-protomode). Se deben utilizar [`Object.getPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) y [`Object.setPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) para obtener y establecer el prototipo de un objeto.

### `ERR_QUIC_APPLICATION_ERROR` {#err_quic_application_error}

**Agregado en: v23.4.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Ocurrió un error de aplicación QUIC.

### `ERR_QUIC_CONNECTION_FAILED` {#err_quic_connection_failed}

**Agregado en: v23.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Falló el establecimiento de una conexión QUIC.

### `ERR_QUIC_ENDPOINT_CLOSED` {#err_quic_endpoint_closed}

**Agregado en: v23.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Un punto final QUIC se cerró con un error.

### `ERR_QUIC_OPEN_STREAM_FAILED` {#err_quic_open_stream_failed}

**Agregado en: v23.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Falló la apertura de un flujo QUIC.

### `ERR_QUIC_TRANSPORT_ERROR` {#err_quic_transport_error}

**Agregado en: v23.4.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Ocurrió un error de transporte QUIC.

### `ERR_QUIC_VERSION_NEGOTIATION_ERROR` {#err_quic_version_negotiation_error}

**Agregado en: v23.4.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Una sesión QUIC falló porque se requiere la negociación de la versión.


### `ERR_REQUIRE_ASYNC_MODULE` {#err_require_async_module}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Cuando se intenta `require()` un [Módulo ES](/es/nodejs/api/esm), el módulo resulta ser asíncrono. Es decir, contiene un await de nivel superior.

Para ver dónde está el await de nivel superior, use `--experimental-print-required-tla` (esto ejecutaría los módulos antes de buscar los awaits de nivel superior).

### `ERR_REQUIRE_CYCLE_MODULE` {#err_require_cycle_module}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Cuando se intenta `require()` un [Módulo ES](/es/nodejs/api/esm), un borde de CommonJS a ESM o de ESM a CommonJS participa en un ciclo inmediato. Esto no está permitido porque los módulos ES no se pueden evaluar mientras ya se están evaluando.

Para evitar el ciclo, la llamada a `require()` involucrada en un ciclo no debe ocurrir en el nivel superior de un Módulo ES (a través de `createRequire()`) o un módulo CommonJS, y debe realizarse de manera diferida en una función interna.

### `ERR_REQUIRE_ESM` {#err_require_esm}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | require() ahora admite la carga de módulos ES síncronos de forma predeterminada. |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto
:::

Se intentó `require()` un [Módulo ES](/es/nodejs/api/esm).

Este error ha quedado obsoleto ya que `require()` ahora admite la carga de módulos ES síncronos. Cuando `require()` encuentra un módulo ES que contiene `await` de nivel superior, lanzará [`ERR_REQUIRE_ASYNC_MODULE`](/es/nodejs/api/errors#err_require_async_module) en su lugar.

### `ERR_SCRIPT_EXECUTION_INTERRUPTED` {#err_script_execution_interrupted}

La ejecución del script fue interrumpida por `SIGINT` (Por ejemplo, se presionó +).

### `ERR_SCRIPT_EXECUTION_TIMEOUT` {#err_script_execution_timeout}

La ejecución del script se agotó, posiblemente debido a errores en el script que se está ejecutando.

### `ERR_SERVER_ALREADY_LISTEN` {#err_server_already_listen}

Se llamó al método [`server.listen()`](/es/nodejs/api/net#serverlisten) mientras que un `net.Server` ya estaba escuchando. Esto se aplica a todas las instancias de `net.Server`, incluidas las instancias `Server` HTTP, HTTPS y HTTP/2.


### `ERR_SERVER_NOT_RUNNING` {#err_server_not_running}

Se llamó al método [`server.close()`](/es/nodejs/api/net#serverclosecallback) cuando un `net.Server` no estaba en ejecución. Esto se aplica a todas las instancias de `net.Server`, incluidas las instancias `Server` de HTTP, HTTPS y HTTP/2.

### `ERR_SINGLE_EXECUTABLE_APPLICATION_ASSET_NOT_FOUND` {#err_single_executable_application_asset_not_found}

**Añadido en: v21.7.0, v20.12.0**

Se pasó una clave a las APIs de aplicación ejecutable única para identificar un activo, pero no se pudo encontrar ninguna coincidencia.

### `ERR_SOCKET_ALREADY_BOUND` {#err_socket_already_bound}

Se intentó enlazar un socket que ya ha sido enlazado.

### `ERR_SOCKET_BAD_BUFFER_SIZE` {#err_socket_bad_buffer_size}

Se pasó un tamaño inválido (negativo) para las opciones `recvBufferSize` o `sendBufferSize` en [`dgram.createSocket()`](/es/nodejs/api/dgram#dgramcreatesocketoptions-callback).

### `ERR_SOCKET_BAD_PORT` {#err_socket_bad_port}

Una función API que esperaba un puerto \>= 0 y \< 65536 recibió un valor inválido.

### `ERR_SOCKET_BAD_TYPE` {#err_socket_bad_type}

Una función API que esperaba un tipo de socket (`udp4` o `udp6`) recibió un valor inválido.

### `ERR_SOCKET_BUFFER_SIZE` {#err_socket_buffer_size}

Mientras se usaba [`dgram.createSocket()`](/es/nodejs/api/dgram#dgramcreatesocketoptions-callback), no se pudo determinar el tamaño del `Buffer` de recepción o envío.

### `ERR_SOCKET_CLOSED` {#err_socket_closed}

Se intentó operar en un socket ya cerrado.

### `ERR_SOCKET_CLOSED_BEFORE_CONNECTION` {#err_socket_closed_before_connection}

Cuando se llama a [`net.Socket.write()`](/es/nodejs/api/net#socketwritedata-encoding-callback) en un socket de conexión y el socket se cierra antes de que se establezca la conexión.

### `ERR_SOCKET_CONNECTION_TIMEOUT` {#err_socket_connection_timeout}

El socket no pudo conectarse a ninguna dirección devuelta por el DNS dentro del tiempo de espera permitido al usar el algoritmo de autoselección de familia.

### `ERR_SOCKET_DGRAM_IS_CONNECTED` {#err_socket_dgram_is_connected}

Se realizó una llamada [`dgram.connect()`](/es/nodejs/api/dgram#socketconnectport-address-callback) en un socket ya conectado.

### `ERR_SOCKET_DGRAM_NOT_CONNECTED` {#err_socket_dgram_not_connected}

Se realizó una llamada [`dgram.disconnect()`](/es/nodejs/api/dgram#socketdisconnect) o [`dgram.remoteAddress()`](/es/nodejs/api/dgram#socketremoteaddress) en un socket desconectado.

### `ERR_SOCKET_DGRAM_NOT_RUNNING` {#err_socket_dgram_not_running}

Se realizó una llamada y el subsistema UDP no se estaba ejecutando.


### `ERR_SOURCE_MAP_CORRUPT` {#err_source_map_corrupt}

El mapa de origen no se pudo analizar porque no existe o está dañado.

### `ERR_SOURCE_MAP_MISSING_SOURCE` {#err_source_map_missing_source}

No se encontró un archivo importado desde un mapa de origen.

### `ERR_SQLITE_ERROR` {#err_sqlite_error}

**Añadido en: v22.5.0**

Se devolvió un error de [SQLite](/es/nodejs/api/sqlite).

### `ERR_SRI_PARSE` {#err_sri_parse}

Se proporcionó una cadena para una verificación de Integridad de Subrecursos, pero no se pudo analizar. Consulte el formato de los atributos de integridad consultando la [especificación de Integridad de Subrecursos](https://www.w3.org/TR/SRI/#the-integrity-attribute).

### `ERR_STREAM_ALREADY_FINISHED` {#err_stream_already_finished}

Se llamó a un método de transmisión que no se puede completar porque la transmisión finalizó.

### `ERR_STREAM_CANNOT_PIPE` {#err_stream_cannot_pipe}

Se intentó llamar a [`stream.pipe()`](/es/nodejs/api/stream#readablepipedestination-options) en una transmisión [`Writable`](/es/nodejs/api/stream#class-streamwritable).

### `ERR_STREAM_DESTROYED` {#err_stream_destroyed}

Se llamó a un método de transmisión que no se puede completar porque la transmisión se destruyó usando `stream.destroy()`.

### `ERR_STREAM_NULL_VALUES` {#err_stream_null_values}

Se intentó llamar a [`stream.write()`](/es/nodejs/api/stream#writablewritechunk-encoding-callback) con un fragmento `null`.

### `ERR_STREAM_PREMATURE_CLOSE` {#err_stream_premature_close}

Un error devuelto por `stream.finished()` y `stream.pipeline()`, cuando una transmisión o una canalización finaliza de forma no correcta sin un error explícito.

### `ERR_STREAM_PUSH_AFTER_EOF` {#err_stream_push_after_eof}

Se intentó llamar a [`stream.push()`](/es/nodejs/api/stream#readablepushchunk-encoding) después de que se enviara un `null` (EOF) a la transmisión.

### `ERR_STREAM_UNABLE_TO_PIPE` {#err_stream_unable_to_pipe}

Se intentó canalizar a una transmisión cerrada o destruida en una canalización.

### `ERR_STREAM_UNSHIFT_AFTER_END_EVENT` {#err_stream_unshift_after_end_event}

Se intentó llamar a [`stream.unshift()`](/es/nodejs/api/stream#readableunshiftchunk-encoding) después de que se emitiera el evento `'end'`.

### `ERR_STREAM_WRAP` {#err_stream_wrap}

Evita una interrupción si se estableció un decodificador de cadenas en el Socket o si el decodificador está en `objectMode`.

```js [ESM]
const Socket = require('node:net').Socket;
const instance = new Socket();

instance.setEncoding('utf8');
```

### `ERR_STREAM_WRITE_AFTER_END` {#err_stream_write_after_end}

Se intentó llamar a [`stream.write()`](/es/nodejs/api/stream#writablewritechunk-encoding-callback) después de que se llamara a `stream.end()`.

### `ERR_STRING_TOO_LONG` {#err_string_too_long}

Se ha intentado crear una cadena de texto más larga que la longitud máxima permitida.

### `ERR_SYNTHETIC` {#err_synthetic}

Un objeto de error artificial utilizado para capturar la pila de llamadas para informes de diagnóstico.

### `ERR_SYSTEM_ERROR` {#err_system_error}

Se ha producido un error del sistema no especificado o no específico dentro del proceso de Node.js. El objeto de error tendrá una propiedad de objeto `err.info` con detalles adicionales.

### `ERR_TAP_LEXER_ERROR` {#err_tap_lexer_error}

Un error que representa un estado de analizador léxico fallido.

### `ERR_TAP_PARSER_ERROR` {#err_tap_parser_error}

Un error que representa un estado de analizador sintáctico fallido. La información adicional sobre el token que causa el error está disponible a través de la propiedad `cause`.

### `ERR_TAP_VALIDATION_ERROR` {#err_tap_validation_error}

Este error representa una validación TAP fallida.

### `ERR_TEST_FAILURE` {#err_test_failure}

Este error representa una prueba fallida. La información adicional sobre el fallo está disponible a través de la propiedad `cause`. La propiedad `failureType` especifica lo que la prueba estaba haciendo cuando ocurrió el fallo.

### `ERR_TLS_ALPN_CALLBACK_INVALID_RESULT` {#err_tls_alpn_callback_invalid_result}

Este error se lanza cuando una `ALPNCallback` devuelve un valor que no está en la lista de protocolos ALPN ofrecidos por el cliente.

### `ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS` {#err_tls_alpn_callback_with_protocols}

Este error se lanza al crear un `TLSServer` si las opciones TLS incluyen tanto `ALPNProtocols` como `ALPNCallback`. Estas opciones son mutuamente excluyentes.

### `ERR_TLS_CERT_ALTNAME_FORMAT` {#err_tls_cert_altname_format}

Este error lo lanza `checkServerIdentity` si una propiedad `subjectaltname` proporcionada por el usuario viola las reglas de codificación. Los objetos de certificado producidos por el propio Node.js siempre cumplen con las reglas de codificación y nunca causarán este error.

### `ERR_TLS_CERT_ALTNAME_INVALID` {#err_tls_cert_altname_invalid}

Al usar TLS, el nombre de host/IP del par no coincidió con ninguno de los `subjectAltNames` en su certificado.

### `ERR_TLS_DH_PARAM_SIZE` {#err_tls_dh_param_size}

Al usar TLS, el parámetro ofrecido para el protocolo de acuerdo de clave Diffie-Hellman (`DH`) es demasiado pequeño. De forma predeterminada, la longitud de la clave debe ser mayor o igual que 1024 bits para evitar vulnerabilidades, aunque se recomienda encarecidamente utilizar 2048 bits o más para una mayor seguridad.


### `ERR_TLS_HANDSHAKE_TIMEOUT` {#err_tls_handshake_timeout}

Un handshake TLS/SSL excedió el tiempo límite. En este caso, el servidor también debe abortar la conexión.

### `ERR_TLS_INVALID_CONTEXT` {#err_tls_invalid_context}

**Agregado en: v13.3.0**

El contexto debe ser un `SecureContext`.

### `ERR_TLS_INVALID_PROTOCOL_METHOD` {#err_tls_invalid_protocol_method}

El método `secureProtocol` especificado no es válido. Es desconocido o está deshabilitado porque no es seguro.

### `ERR_TLS_INVALID_PROTOCOL_VERSION` {#err_tls_invalid_protocol_version}

Las versiones válidas del protocolo TLS son `'TLSv1'`, `'TLSv1.1'` o `'TLSv1.2'`.

### `ERR_TLS_INVALID_STATE` {#err_tls_invalid_state}

**Agregado en: v13.10.0, v12.17.0**

El socket TLS debe estar conectado y establecido de forma segura. Asegúrese de que se emita el evento 'secure' antes de continuar.

### `ERR_TLS_PROTOCOL_VERSION_CONFLICT` {#err_tls_protocol_version_conflict}

Intentar establecer un protocolo TLS `minVersion` o `maxVersion` entra en conflicto con un intento de establecer el `secureProtocol` explícitamente. Utilice un mecanismo u otro.

### `ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED` {#err_tls_psk_set_identity_hint_failed}

No se pudo establecer la sugerencia de identidad PSK. La sugerencia puede ser demasiado larga.

### `ERR_TLS_RENEGOTIATION_DISABLED` {#err_tls_renegotiation_disabled}

Se intentó renegociar TLS en una instancia de socket con la renegociación deshabilitada.

### `ERR_TLS_REQUIRED_SERVER_NAME` {#err_tls_required_server_name}

Mientras se usaba TLS, se llamó al método `server.addContext()` sin proporcionar un nombre de host en el primer parámetro.

### `ERR_TLS_SESSION_ATTACK` {#err_tls_session_attack}

Se detecta una cantidad excesiva de renegociaciones TLS, lo cual es un vector potencial para ataques de denegación de servicio.

### `ERR_TLS_SNI_FROM_SERVER` {#err_tls_sni_from_server}

Se intentó emitir la Indicación de Nombre de Servidor desde un socket TLS del lado del servidor, que solo es válido desde un cliente.

### `ERR_TRACE_EVENTS_CATEGORY_REQUIRED` {#err_trace_events_category_required}

El método `trace_events.createTracing()` requiere al menos una categoría de evento de rastreo.

### `ERR_TRACE_EVENTS_UNAVAILABLE` {#err_trace_events_unavailable}

No se pudo cargar el módulo `node:trace_events` porque Node.js se compiló con el indicador `--without-v8-platform`.

### `ERR_TRANSFORM_ALREADY_TRANSFORMING` {#err_transform_already_transforming}

Un flujo `Transform` finalizó mientras aún se estaba transformando.

### `ERR_TRANSFORM_WITH_LENGTH_0` {#err_transform_with_length_0}

Un flujo `Transform` finalizó con datos aún en el búfer de escritura.


### `ERR_TTY_INIT_FAILED` {#err_tty_init_failed}

La inicialización de un TTY falló debido a un error del sistema.

### `ERR_UNAVAILABLE_DURING_EXIT` {#err_unavailable_during_exit}

Se llamó a una función dentro de un controlador [`process.on('exit')`](/es/nodejs/api/process#event-exit) que no debería llamarse dentro del controlador [`process.on('exit')`](/es/nodejs/api/process#event-exit).

### `ERR_UNCAUGHT_EXCEPTION_CAPTURE_ALREADY_SET` {#err_uncaught_exception_capture_already_set}

Se llamó a [`process.setUncaughtExceptionCaptureCallback()`](/es/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) dos veces, sin restablecer primero la devolución de llamada a `null`.

Este error está diseñado para evitar sobrescribir accidentalmente una devolución de llamada registrada desde otro módulo.

### `ERR_UNESCAPED_CHARACTERS` {#err_unescaped_characters}

Se recibió una cadena que contenía caracteres sin escape.

### `ERR_UNHANDLED_ERROR` {#err_unhandled_error}

Se produjo un error no controlado (por ejemplo, cuando un evento `'error'` es emitido por un [`EventEmitter`](/es/nodejs/api/events#class-eventemitter) pero no se registra un controlador `'error'`).

### `ERR_UNKNOWN_BUILTIN_MODULE` {#err_unknown_builtin_module}

Se utiliza para identificar un tipo específico de error interno de Node.js que normalmente no debería ser desencadenado por el código del usuario. Las instancias de este error apuntan a un error interno dentro del propio binario de Node.js.

### `ERR_UNKNOWN_CREDENTIAL` {#err_unknown_credential}

Se pasó un identificador de grupo o usuario de Unix que no existe.

### `ERR_UNKNOWN_ENCODING` {#err_unknown_encoding}

Se pasó una opción de codificación no válida o desconocida a una API.

### `ERR_UNKNOWN_FILE_EXTENSION` {#err_unknown_file_extension}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Se intentó cargar un módulo con una extensión de archivo desconocida o no admitida.

### `ERR_UNKNOWN_MODULE_FORMAT` {#err_unknown_module_format}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Se intentó cargar un módulo con un formato desconocido o no admitido.

### `ERR_UNKNOWN_SIGNAL` {#err_unknown_signal}

Se pasó una señal de proceso no válida o desconocida a una API que espera una señal válida (como [`subprocess.kill()`](/es/nodejs/api/child_process#subprocesskillsignal)).


### `ERR_UNSUPPORTED_DIR_IMPORT` {#err_unsupported_dir_import}

No se admite `import` de una URL de directorio. En su lugar, [autorreferencie un paquete utilizando su nombre](/es/nodejs/api/packages#self-referencing-a-package-using-its-name) y [defina una subruta personalizada](/es/nodejs/api/packages#subpath-exports) en el campo [`"exports"`](/es/nodejs/api/packages#exports) del archivo [`package.json`](/es/nodejs/api/packages#nodejs-packagejson-field-definitions).

```js [ESM]
import './'; // no compatible
import './index.js'; // compatible
import 'package-name'; // compatible
```
### `ERR_UNSUPPORTED_ESM_URL_SCHEME` {#err_unsupported_esm_url_scheme}

No se admite `import` con esquemas de URL distintos de `file` y `data`.

### `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` {#err_unsupported_node_modules_type_stripping}

**Añadido en: v22.6.0**

No se admite la eliminación de tipos para archivos descendientes de un directorio `node_modules`.

### `ERR_UNSUPPORTED_RESOLVE_REQUEST` {#err_unsupported_resolve_request}

Se intentó resolver un remitente de módulo no válido. Esto puede ocurrir al importar o llamar a `import.meta.resolve()` con:

- Un especificador simple que no es un módulo incorporado desde un módulo cuyo esquema de URL no es `file`.
- Una [URL relativa](https://url.spec.whatwg.org/#relative-url-string) desde un módulo cuyo esquema de URL no es un [esquema especial](https://url.spec.whatwg.org/#special-scheme).

```js [ESM]
try {
  // Intentando importar el paquete 'bare-specifier' desde un módulo de URL `data:`:
  await import('data:text/javascript,import "bare-specifier"');
} catch (e) {
  console.log(e.code); // ERR_UNSUPPORTED_RESOLVE_REQUEST
}
```
### `ERR_USE_AFTER_CLOSE` {#err_use_after_close}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Se intentó usar algo que ya estaba cerrado.

### `ERR_VALID_PERFORMANCE_ENTRY_TYPE` {#err_valid_performance_entry_type}

Mientras se utiliza la API de temporización de rendimiento (`perf_hooks`), no se encuentran tipos de entrada de rendimiento válidos.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` {#err_vm_dynamic_import_callback_missing}

No se especificó una devolución de llamada de importación dinámica.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` {#err_vm_dynamic_import_callback_missing_flag}

Se invocó una devolución de llamada de importación dinámica sin `--experimental-vm-modules`.


### `ERR_VM_MODULE_ALREADY_LINKED` {#err_vm_module_already_linked}

El módulo que se intentó vincular no es elegible para la vinculación, debido a una de las siguientes razones:

- Ya ha sido vinculado (`linkingStatus` es `'linked'`)
- Está siendo vinculado (`linkingStatus` es `'linking'`)
- La vinculación ha fallado para este módulo (`linkingStatus` es `'errored'`)

### `ERR_VM_MODULE_CACHED_DATA_REJECTED` {#err_vm_module_cached_data_rejected}

La opción `cachedData` pasada a un constructor de módulo no es válida.

### `ERR_VM_MODULE_CANNOT_CREATE_CACHED_DATA` {#err_vm_module_cannot_create_cached_data}

Los datos en caché no se pueden crear para módulos que ya han sido evaluados.

### `ERR_VM_MODULE_DIFFERENT_CONTEXT` {#err_vm_module_different_context}

El módulo que se devuelve de la función de enlazador es de un contexto diferente al del módulo padre. Los módulos enlazados deben compartir el mismo contexto.

### `ERR_VM_MODULE_LINK_FAILURE` {#err_vm_module_link_failure}

El módulo no pudo vincularse debido a una falla.

### `ERR_VM_MODULE_NOT_MODULE` {#err_vm_module_not_module}

El valor cumplido de una promesa de vinculación no es un objeto `vm.Module`.

### `ERR_VM_MODULE_STATUS` {#err_vm_module_status}

El estado actual del módulo no permite esta operación. El significado específico del error depende de la función específica.

### `ERR_WASI_ALREADY_STARTED` {#err_wasi_already_started}

La instancia WASI ya ha comenzado.

### `ERR_WASI_NOT_STARTED` {#err_wasi_not_started}

La instancia WASI no ha comenzado.

### `ERR_WEBASSEMBLY_RESPONSE` {#err_webassembly_response}

**Agregado en: v18.1.0**

La `Response` que se ha pasado a `WebAssembly.compileStreaming` o a `WebAssembly.instantiateStreaming` no es una respuesta WebAssembly válida.

### `ERR_WORKER_INIT_FAILED` {#err_worker_init_failed}

La inicialización de `Worker` falló.

### `ERR_WORKER_INVALID_EXEC_ARGV` {#err_worker_invalid_exec_argv}

La opción `execArgv` pasada al constructor `Worker` contiene flags inválidos.

### `ERR_WORKER_MESSAGING_ERRORED` {#err_worker_messaging_errored}

**Agregado en: v22.5.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

El hilo de destino arrojó un error al procesar un mensaje enviado a través de [`postMessageToThread()`](/es/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).


### `ERR_WORKER_MESSAGING_FAILED` {#err_worker_messaging_failed}

**Agregado en: v22.5.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

El hilo solicitado en [`postMessageToThread()`](/es/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) no es válido o no tiene un listener `workerMessage`.

### `ERR_WORKER_MESSAGING_SAME_THREAD` {#err_worker_messaging_same_thread}

**Agregado en: v22.5.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

El id del hilo solicitado en [`postMessageToThread()`](/es/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) es el id del hilo actual.

### `ERR_WORKER_MESSAGING_TIMEOUT` {#err_worker_messaging_timeout}

**Agregado en: v22.5.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

El envío de un mensaje a través de [`postMessageToThread()`](/es/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) excedió el tiempo de espera.

### `ERR_WORKER_NOT_RUNNING` {#err_worker_not_running}

Una operación falló porque la instancia `Worker` no se está ejecutando actualmente.

### `ERR_WORKER_OUT_OF_MEMORY` {#err_worker_out_of_memory}

La instancia `Worker` terminó porque alcanzó su límite de memoria.

### `ERR_WORKER_PATH` {#err_worker_path}

La ruta para el script principal de un worker no es una ruta absoluta ni una ruta relativa que comience con `./` o `../`.

### `ERR_WORKER_UNSERIALIZABLE_ERROR` {#err_worker_unserializable_error}

Todos los intentos de serializar una excepción no capturada de un hilo de worker fallaron.

### `ERR_WORKER_UNSUPPORTED_OPERATION` {#err_worker_unsupported_operation}

La funcionalidad solicitada no es compatible con los hilos de worker.

### `ERR_ZLIB_INITIALIZATION_FAILED` {#err_zlib_initialization_failed}

La creación de un objeto [`zlib`](/es/nodejs/api/zlib) falló debido a una configuración incorrecta.

### `HPE_CHUNK_EXTENSIONS_OVERFLOW` {#hpe_chunk_extensions_overflow}

**Agregado en: v21.6.2, v20.11.1, v18.19.1**

Se recibieron demasiados datos para las extensiones de un fragmento. Para protegerse contra clientes maliciosos o mal configurados, si se reciben más de 16 KiB de datos, se emitirá un `Error` con este código.


### `HPE_HEADER_OVERFLOW` {#hpe_header_overflow}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v11.4.0, v10.15.0 | El tamaño máximo de la cabecera en `http_parser` se estableció en 8 KiB. |
:::

Se recibieron demasiados datos de la cabecera HTTP. Para protegerse contra clientes maliciosos o mal configurados, si se reciben más de `maxHeaderSize` datos de cabecera HTTP, el análisis HTTP se abortará sin que se cree un objeto de solicitud o respuesta, y se emitirá un `Error` con este código.

### `HPE_UNEXPECTED_CONTENT_LENGTH` {#hpe_unexpected_content_length}

El servidor está enviando tanto una cabecera `Content-Length` como `Transfer-Encoding: chunked`.

`Transfer-Encoding: chunked` permite al servidor mantener una conexión persistente HTTP para contenido generado dinámicamente. En este caso, no se puede utilizar la cabecera HTTP `Content-Length`.

Utilice `Content-Length` o `Transfer-Encoding: chunked`.

### `MODULE_NOT_FOUND` {#module_not_found}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Se añadió la propiedad `requireStack`. |
:::

Un archivo de módulo no pudo ser resuelto por el cargador de módulos CommonJS al intentar una operación [`require()`](/es/nodejs/api/modules#requireid) o al cargar el punto de entrada del programa.

## Códigos de error heredados de Node.js {#legacy-nodejs-error-codes}

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Estos códigos de error son inconsistentes o han sido eliminados.
:::

### `ERR_CANNOT_TRANSFER_OBJECT` {#err_cannot_transfer_object}

**Añadido en: v10.5.0**

**Eliminado en: v12.5.0**

El valor pasado a `postMessage()` contenía un objeto que no es compatible para la transferencia.

### `ERR_CPU_USAGE` {#err_cpu_usage}

**Eliminado en: v15.0.0**

La llamada nativa desde `process.cpuUsage` no pudo ser procesada.

### `ERR_CRYPTO_HASH_DIGEST_NO_UTF16` {#err_crypto_hash_digest_no_utf16}

**Añadido en: v9.0.0**

**Eliminado en: v12.12.0**

La codificación UTF-16 se utilizó con [`hash.digest()`](/es/nodejs/api/crypto#hashdigestencoding). Si bien el método `hash.digest()` permite que se pase un argumento `encoding`, lo que hace que el método devuelva una cadena en lugar de un `Buffer`, la codificación UTF-16 (por ejemplo, `ucs` o `utf16le`) no es compatible.


### `ERR_CRYPTO_SCRYPT_INVALID_PARAMETER` {#err_crypto_scrypt_invalid_parameter}

**Eliminado en: v23.0.0**

Se pasó una combinación incompatible de opciones a [`crypto.scrypt()`](/es/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) o [`crypto.scryptSync()`](/es/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options). Las nuevas versiones de Node.js usan el código de error [`ERR_INCOMPATIBLE_OPTION_PAIR`](/es/nodejs/api/errors#err_incompatible_option_pair) en su lugar, que es consistente con otras APIs.

### `ERR_FS_INVALID_SYMLINK_TYPE` {#err_fs_invalid_symlink_type}

**Eliminado en: v23.0.0**

Se pasó un tipo de enlace simbólico inválido a los métodos [`fs.symlink()`](/es/nodejs/api/fs#fssymlinktarget-path-type-callback) o [`fs.symlinkSync()`](/es/nodejs/api/fs#fssymlinksynctarget-path-type).

### `ERR_HTTP2_FRAME_ERROR` {#err_http2_frame_error}

**Agregado en: v9.0.0**

**Eliminado en: v10.0.0**

Se utiliza cuando se produce un fallo al enviar un marco individual en la sesión HTTP/2.

### `ERR_HTTP2_HEADERS_OBJECT` {#err_http2_headers_object}

**Agregado en: v9.0.0**

**Eliminado en: v10.0.0**

Se utiliza cuando se espera un Objeto de Cabeceras HTTP/2.

### `ERR_HTTP2_HEADER_REQUIRED` {#err_http2_header_required}

**Agregado en: v9.0.0**

**Eliminado en: v10.0.0**

Se utiliza cuando falta una cabecera requerida en un mensaje HTTP/2.

### `ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND` {#err_http2_info_headers_after_respond}

**Agregado en: v9.0.0**

**Eliminado en: v10.0.0**

Las cabeceras informativas HTTP/2 solo deben enviarse *antes* de llamar al método `Http2Stream.prototype.respond()`.

### `ERR_HTTP2_STREAM_CLOSED` {#err_http2_stream_closed}

**Agregado en: v9.0.0**

**Eliminado en: v10.0.0**

Se utiliza cuando se ha realizado una acción en un Flujo HTTP/2 que ya se ha cerrado.

### `ERR_HTTP_INVALID_CHAR` {#err_http_invalid_char}

**Agregado en: v9.0.0**

**Eliminado en: v10.0.0**

Se utiliza cuando se encuentra un carácter inválido en un mensaje de estado de respuesta HTTP (frase de motivo).

### `ERR_IMPORT_ASSERTION_TYPE_FAILED` {#err_import_assertion_type_failed}

**Agregado en: v17.1.0, v16.14.0**

**Eliminado en: v21.1.0**

Una aserción de importación ha fallado, impidiendo que se importe el módulo especificado.

### `ERR_IMPORT_ASSERTION_TYPE_MISSING` {#err_import_assertion_type_missing}

**Agregado en: v17.1.0, v16.14.0**

**Eliminado en: v21.1.0**

Falta una aserción de importación, impidiendo que se importe el módulo especificado.


### `ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED` {#err_import_assertion_type_unsupported}

**Añadido en: v17.1.0, v16.14.0**

**Eliminado en: v21.1.0**

Un atributo de importación no es compatible con esta versión de Node.js.

### `ERR_INDEX_OUT_OF_RANGE` {#err_index_out_of_range}

**Añadido en: v10.0.0**

**Eliminado en: v11.0.0**

Un índice dado estaba fuera del rango aceptado (por ejemplo, desplazamientos negativos).

### `ERR_INVALID_OPT_VALUE` {#err_invalid_opt_value}

**Añadido en: v8.0.0**

**Eliminado en: v15.0.0**

Se pasó un valor inválido o inesperado en un objeto de opciones.

### `ERR_INVALID_OPT_VALUE_ENCODING` {#err_invalid_opt_value_encoding}

**Añadido en: v9.0.0**

**Eliminado en: v15.0.0**

Se pasó una codificación de archivo inválida o desconocida.

### `ERR_INVALID_PERFORMANCE_MARK` {#err_invalid_performance_mark}

**Añadido en: v8.5.0**

**Eliminado en: v16.7.0**

Al usar la API de Performance Timing (`perf_hooks`), una marca de rendimiento no es válida.

### `ERR_INVALID_TRANSFER_OBJECT` {#err_invalid_transfer_object}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0 | En su lugar, se lanza una `DOMException`. |
| v21.0.0 | Eliminado en: v21.0.0 |
:::

Se pasó un objeto de transferencia inválido a `postMessage()`.

### `ERR_MANIFEST_ASSERT_INTEGRITY` {#err_manifest_assert_integrity}

**Eliminado en: v22.2.0**

Se intentó cargar un recurso, pero el recurso no coincidió con la integridad definida por el manifiesto de la política. Consulte la documentación de los manifiestos de la política para obtener más información.

### `ERR_MANIFEST_DEPENDENCY_MISSING` {#err_manifest_dependency_missing}

**Eliminado en: v22.2.0**

Se intentó cargar un recurso, pero el recurso no figuraba como una dependencia de la ubicación que intentó cargarlo. Consulte la documentación de los manifiestos de la política para obtener más información.

### `ERR_MANIFEST_INTEGRITY_MISMATCH` {#err_manifest_integrity_mismatch}

**Eliminado en: v22.2.0**

Se intentó cargar un manifiesto de política, pero el manifiesto tenía múltiples entradas para un recurso que no coincidían entre sí. Actualice las entradas del manifiesto para que coincidan con el fin de resolver este error. Consulte la documentación de los manifiestos de la política para obtener más información.

### `ERR_MANIFEST_INVALID_RESOURCE_FIELD` {#err_manifest_invalid_resource_field}

**Eliminado en: v22.2.0**

Un recurso de manifiesto de política tenía un valor inválido para uno de sus campos. Actualice la entrada del manifiesto para que coincida con el fin de resolver este error. Consulte la documentación de los manifiestos de la política para obtener más información.


### `ERR_MANIFEST_INVALID_SPECIFIER` {#err_manifest_invalid_specifier}

**Eliminado en: v22.2.0**

Un recurso de manifiesto de política tenía un valor no válido para una de sus asignaciones de dependencia. Actualice la entrada del manifiesto para que coincida y resolver este error. Consulte la documentación de los manifiestos de política para obtener más información.

### `ERR_MANIFEST_PARSE_POLICY` {#err_manifest_parse_policy}

**Eliminado en: v22.2.0**

Se intentó cargar un manifiesto de política, pero no se pudo analizar el manifiesto. Consulte la documentación de los manifiestos de política para obtener más información.

### `ERR_MANIFEST_TDZ` {#err_manifest_tdz}

**Eliminado en: v22.2.0**

Se intentó leer desde un manifiesto de política, pero la inicialización del manifiesto aún no ha tenido lugar. Es probable que sea un error en Node.js.

### `ERR_MANIFEST_UNKNOWN_ONERROR` {#err_manifest_unknown_onerror}

**Eliminado en: v22.2.0**

Se cargó un manifiesto de política, pero tenía un valor desconocido para su comportamiento "onerror". Consulte la documentación de los manifiestos de política para obtener más información.

### `ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST` {#err_missing_message_port_in_transfer_list}

**Eliminado en: v15.0.0**

Este código de error fue reemplazado por [`ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST`](/es/nodejs/api/errors#err_missing_transferable_in_transfer_list) en Node.js v15.0.0, porque ya no es preciso ya que ahora también existen otros tipos de objetos transferibles.

### `ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST` {#err_missing_transferable_in_transfer_list}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0 | Se lanza una `DOMException` en su lugar. |
| v21.0.0 | Eliminado en: v21.0.0 |
| v15.0.0 | Agregado en: v15.0.0 |
:::

Un objeto que necesita estar listado explícitamente en el argumento `transferList` está en el objeto pasado a una llamada de [`postMessage()`](/es/nodejs/api/worker_threads#portpostmessagevalue-transferlist), pero no se proporciona en el `transferList` para esa llamada. Por lo general, esto es un `MessagePort`.

En las versiones de Node.js anteriores a v15.0.0, el código de error que se utilizaba aquí era [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/es/nodejs/api/errors#err_missing_message_port_in_transfer_list). Sin embargo, el conjunto de tipos de objetos transferibles se ha ampliado para cubrir más tipos que `MessagePort`.

### `ERR_NAPI_CONS_PROTOTYPE_OBJECT` {#err_napi_cons_prototype_object}

**Agregado en: v9.0.0**

**Eliminado en: v10.0.0**

Utilizado por la `Node-API` cuando `Constructor.prototype` no es un objeto.


### `ERR_NAPI_TSFN_START_IDLE_LOOP` {#err_napi_tsfn_start_idle_loop}

**Agregado en: v10.6.0, v8.16.0**

**Eliminado en: v14.2.0, v12.17.0**

En el hilo principal, los valores se eliminan de la cola asociada con la función segura para subprocesos en un bucle inactivo. Este error indica que se ha producido un error al intentar iniciar el bucle.

### `ERR_NAPI_TSFN_STOP_IDLE_LOOP` {#err_napi_tsfn_stop_idle_loop}

**Agregado en: v10.6.0, v8.16.0**

**Eliminado en: v14.2.0, v12.17.0**

Una vez que no quedan más elementos en la cola, el bucle inactivo debe suspenderse. Este error indica que el bucle inactivo no se ha detenido.

### `ERR_NO_LONGER_SUPPORTED` {#err_no_longer_supported}

Se llamó a una API de Node.js de una manera no compatible, como `Buffer.write(string, encoding, offset[, length])`.

### `ERR_OUTOFMEMORY` {#err_outofmemory}

**Agregado en: v9.0.0**

**Eliminado en: v10.0.0**

Se utiliza genéricamente para identificar que una operación causó una condición de falta de memoria.

### `ERR_PARSE_HISTORY_DATA` {#err_parse_history_data}

**Agregado en: v9.0.0**

**Eliminado en: v10.0.0**

El módulo `node:repl` no pudo analizar los datos del archivo de historial REPL.

### `ERR_SOCKET_CANNOT_SEND` {#err_socket_cannot_send}

**Agregado en: v9.0.0**

**Eliminado en: v14.0.0**

No se pudieron enviar datos en un socket.

### `ERR_STDERR_CLOSE` {#err_stderr_close}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.12.0 | En lugar de emitir un error, `process.stderr.end()` ahora solo cierra el lado del flujo pero no el recurso subyacente, lo que hace que este error sea obsoleto. |
| v10.12.0 | Eliminado en: v10.12.0 |
:::

Se intentó cerrar el flujo `process.stderr`. Por diseño, Node.js no permite que el código de usuario cierre los flujos `stdout` o `stderr`.

### `ERR_STDOUT_CLOSE` {#err_stdout_close}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.12.0 | En lugar de emitir un error, `process.stderr.end()` ahora solo cierra el lado del flujo pero no el recurso subyacente, lo que hace que este error sea obsoleto. |
| v10.12.0 | Eliminado en: v10.12.0 |
:::

Se intentó cerrar el flujo `process.stdout`. Por diseño, Node.js no permite que el código de usuario cierre los flujos `stdout` o `stderr`.

### `ERR_STREAM_READ_NOT_IMPLEMENTED` {#err_stream_read_not_implemented}

**Agregado en: v9.0.0**

**Eliminado en: v10.0.0**

Se utiliza cuando se intenta usar un flujo legible que no ha implementado [`readable._read()`](/es/nodejs/api/stream#readable_readsize).


### `ERR_TLS_RENEGOTIATION_FAILED` {#err_tls_renegotiation_failed}

**Añadido en: v9.0.0**

**Eliminado en: v10.0.0**

Se usa cuando una solicitud de renegociación TLS ha fallado de una manera no específica.

### `ERR_TRANSFERRING_EXTERNALIZED_SHAREDARRAYBUFFER` {#err_transferring_externalized_sharedarraybuffer}

**Añadido en: v10.5.0**

**Eliminado en: v14.0.0**

Se encontró un `SharedArrayBuffer` cuya memoria no está gestionada por el motor de JavaScript o por Node.js durante la serialización. Tal `SharedArrayBuffer` no se puede serializar.

Esto solo puede suceder cuando los complementos nativos crean `SharedArrayBuffer`s en modo "externalizado", o ponen `SharedArrayBuffer` existentes en modo externalizado.

### `ERR_UNKNOWN_STDIN_TYPE` {#err_unknown_stdin_type}

**Añadido en: v8.0.0**

**Eliminado en: v11.7.0**

Se intentó iniciar un proceso de Node.js con un tipo de archivo `stdin` desconocido. Este error suele ser una indicación de un error dentro de Node.js, aunque es posible que el código de usuario lo desencadene.

### `ERR_UNKNOWN_STREAM_TYPE` {#err_unknown_stream_type}

**Añadido en: v8.0.0**

**Eliminado en: v11.7.0**

Se intentó iniciar un proceso de Node.js con un tipo de archivo `stdout` o `stderr` desconocido. Este error suele ser una indicación de un error dentro de Node.js, aunque es posible que el código de usuario lo desencadene.

### `ERR_V8BREAKITERATOR` {#err_v8breakiterator}

Se utilizó la API `BreakIterator` de V8, pero no está instalado el conjunto de datos ICU completo.

### `ERR_VALUE_OUT_OF_RANGE` {#err_value_out_of_range}

**Añadido en: v9.0.0**

**Eliminado en: v10.0.0**

Se usa cuando un valor dado está fuera del rango aceptado.

### `ERR_VM_MODULE_LINKING_ERRORED` {#err_vm_module_linking_errored}

**Añadido en: v10.0.0**

**Eliminado en: v18.1.0, v16.17.0**

La función del enlazador devolvió un módulo para el cual ha fallado el enlace.

### `ERR_VM_MODULE_NOT_LINKED` {#err_vm_module_not_linked}

El módulo debe enlazarse correctamente antes de la instanciación.

### `ERR_WORKER_UNSUPPORTED_EXTENSION` {#err_worker_unsupported_extension}

**Añadido en: v11.0.0**

**Eliminado en: v16.9.0**

El nombre de ruta utilizado para el script principal de un worker tiene una extensión de archivo desconocida.

### `ERR_ZLIB_BINDING_CLOSED` {#err_zlib_binding_closed}

**Añadido en: v9.0.0**

**Eliminado en: v10.0.0**

Se usa cuando se intenta utilizar un objeto `zlib` después de que ya se haya cerrado.


## Códigos de Error de OpenSSL {#openssl-error-codes}

### Errores de Validez Temporal {#time-validity-errors}

#### `CERT_NOT_YET_VALID` {#cert_not_yet_valid}

El certificado aún no es válido: la fecha notBefore es posterior a la hora actual.

#### `CERT_HAS_EXPIRED` {#cert_has_expired}

El certificado ha expirado: la fecha notAfter es anterior a la hora actual.

#### `CRL_NOT_YET_VALID` {#crl_not_yet_valid}

La lista de revocación de certificados (CRL) tiene una fecha de emisión futura.

#### `CRL_HAS_EXPIRED` {#crl_has_expired}

La lista de revocación de certificados (CRL) ha expirado.

#### `CERT_REVOKED` {#cert_revoked}

El certificado ha sido revocado; está en una lista de revocación de certificados (CRL).

### Errores Relacionados con la Confianza o la Cadena {#trust-or-chain-related-errors}

#### `UNABLE_TO_GET_ISSUER_CERT` {#unable_to_get_issuer_cert}

No se pudo encontrar el certificado emisor de un certificado buscado. Normalmente, esto significa que la lista de certificados de confianza no está completa.

#### `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` {#unable_to_get_issuer_cert_locally}

Se desconoce el emisor del certificado. Este es el caso si el emisor no está incluido en la lista de certificados de confianza.

#### `DEPTH_ZERO_SELF_SIGNED_CERT` {#depth_zero_self_signed_cert}

El certificado pasado está autofirmado y no se puede encontrar el mismo certificado en la lista de certificados de confianza.

#### `SELF_SIGNED_CERT_IN_CHAIN` {#self_signed_cert_in_chain}

Se desconoce el emisor del certificado. Este es el caso si el emisor no está incluido en la lista de certificados de confianza.

#### `CERT_CHAIN_TOO_LONG` {#cert_chain_too_long}

La longitud de la cadena de certificados es mayor que la profundidad máxima.

#### `UNABLE_TO_GET_CRL` {#unable_to_get_crl}

No se pudo encontrar la CRL referenciada por el certificado.

#### `UNABLE_TO_VERIFY_LEAF_SIGNATURE` {#unable_to_verify_leaf_signature}

No se pudo verificar ninguna firma porque la cadena contiene solo un certificado y no está autofirmado.

#### `CERT_UNTRUSTED` {#cert_untrusted}

La autoridad de certificación (CA) raíz no está marcada como de confianza para el propósito especificado.

### Errores Básicos de Extensión {#basic-extension-errors}

#### `INVALID_CA` {#invalid_ca}

Un certificado de CA no es válido. O no es una CA o sus extensiones no son coherentes con el propósito suministrado.

#### `PATH_LENGTH_EXCEEDED` {#path_length_exceeded}

Se ha excedido el parámetro pathlength de basicConstraints.

### Errores Relacionados con el Nombre {#name-related-errors}

#### `HOSTNAME_MISMATCH` {#hostname_mismatch}

El certificado no coincide con el nombre proporcionado.

### Errores de Uso y Política {#usage-and-policy-errors}


#### `INVALID_PURPOSE` {#invalid_purpose}

El certificado suministrado no se puede utilizar para el propósito especificado.

#### `CERT_REJECTED` {#cert_rejected}

La CA raíz está marcada para rechazar el propósito especificado.

### Errores de Formato {#formatting-errors}

#### `CERT_SIGNATURE_FAILURE` {#cert_signature_failure}

La firma del certificado no es válida.

#### `CRL_SIGNATURE_FAILURE` {#crl_signature_failure}

La firma de la lista de revocación de certificados (CRL) no es válida.

#### `ERROR_IN_CERT_NOT_BEFORE_FIELD` {#error_in_cert_not_before_field}

El campo notBefore del certificado contiene una hora no válida.

#### `ERROR_IN_CERT_NOT_AFTER_FIELD` {#error_in_cert_not_after_field}

El campo notAfter del certificado contiene una hora no válida.

#### `ERROR_IN_CRL_LAST_UPDATE_FIELD` {#error_in_crl_last_update_field}

El campo lastUpdate de la CRL contiene una hora no válida.

#### `ERROR_IN_CRL_NEXT_UPDATE_FIELD` {#error_in_crl_next_update_field}

El campo nextUpdate de la CRL contiene una hora no válida.

#### `UNABLE_TO_DECRYPT_CERT_SIGNATURE` {#unable_to_decrypt_cert_signature}

No se pudo descifrar la firma del certificado. Esto significa que no se pudo determinar el valor real de la firma en lugar de que no coincida con el valor esperado, esto solo es significativo para las claves RSA.

#### `UNABLE_TO_DECRYPT_CRL_SIGNATURE` {#unable_to_decrypt_crl_signature}

No se pudo descifrar la firma de la lista de revocación de certificados (CRL): esto significa que no se pudo determinar el valor real de la firma en lugar de que no coincida con el valor esperado.

#### `UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY` {#unable_to_decode_issuer_public_key}

No se pudo leer la clave pública en el SubjectPublicKeyInfo del certificado.

### Otros errores de OpenSSL {#other-openssl-errors}

#### `OUT_OF_MEM` {#out_of_mem}

Se produjo un error al intentar asignar memoria. Esto nunca debería suceder.

