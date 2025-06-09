---
title: Documentación de Node.js - Proceso Hijo
description: La documentación de Node.js para el módulo de Proceso Hijo, que detalla cómo generar procesos hijos, gestionar su ciclo de vida y manejar la comunicación entre procesos.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Proceso Hijo | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentación de Node.js para el módulo de Proceso Hijo, que detalla cómo generar procesos hijos, gestionar su ciclo de vida y manejar la comunicación entre procesos.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Proceso Hijo | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentación de Node.js para el módulo de Proceso Hijo, que detalla cómo generar procesos hijos, gestionar su ciclo de vida y manejar la comunicación entre procesos.
---


# Proceso hijo {#child-process}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/child_process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/child_process.js)

El módulo `node:child_process` proporciona la capacidad de generar subprocesos de una manera similar, pero no idéntica, a [`popen(3)`](http://man7.org/linux/man-pages/man3/popen.3). Esta capacidad es proporcionada principalmente por la función [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options):

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

De forma predeterminada, se establecen pipes para `stdin`, `stdout` y `stderr` entre el proceso padre de Node.js y el subproceso generado. Estos pipes tienen una capacidad limitada (y específica de la plataforma). Si el subproceso escribe en stdout excediendo ese límite sin que se capture la salida, el subproceso se bloquea esperando que el buffer del pipe acepte más datos. Esto es idéntico al comportamiento de los pipes en la shell. Use la opción `{ stdio: 'ignore' }` si la salida no va a ser consumida.

La búsqueda del comando se realiza utilizando la variable de entorno `options.env.PATH` si `env` está en el objeto `options`. De lo contrario, se usa `process.env.PATH`. Si `options.env` está configurado sin `PATH`, la búsqueda en Unix se realiza en una ruta de búsqueda predeterminada de `/usr/bin:/bin` (consulte el manual de su sistema operativo para execvpe/execvp), en Windows se utiliza la variable de entorno `PATH` del proceso actual.

En Windows, las variables de entorno no distinguen entre mayúsculas y minúsculas. Node.js ordena lexicográficamente las claves `env` y utiliza la primera que coincida sin distinción entre mayúsculas y minúsculas. Solo la primera entrada (en orden lexicográfico) se pasará al subproceso. Esto podría generar problemas en Windows al pasar objetos a la opción `env` que tienen múltiples variantes de la misma clave, como `PATH` y `Path`.

El método [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options) genera el proceso hijo de forma asíncrona, sin bloquear el bucle de eventos de Node.js. La función [`child_process.spawnSync()`](/es/nodejs/api/child_process#child_processspawnsynccommand-args-options) proporciona una funcionalidad equivalente de forma síncrona que bloquea el bucle de eventos hasta que el proceso generado se cierra o se termina.

Para mayor comodidad, el módulo `node:child_process` proporciona un puñado de alternativas síncronas y asíncronas a [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options) y [`child_process.spawnSync()`](/es/nodejs/api/child_process#child_processspawnsynccommand-args-options). Cada una de estas alternativas se implementa sobre [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options) o [`child_process.spawnSync()`](/es/nodejs/api/child_process#child_processspawnsynccommand-args-options).

- [`child_process.exec()`](/es/nodejs/api/child_process#child_processexeccommand-options-callback): genera una shell y ejecuta un comando dentro de esa shell, pasando el `stdout` y el `stderr` a una función de callback cuando se completa.
- [`child_process.execFile()`](/es/nodejs/api/child_process#child_processexecfilefile-args-options-callback): similar a [`child_process.exec()`](/es/nodejs/api/child_process#child_processexeccommand-options-callback) excepto que genera el comando directamente sin generar primero una shell de forma predeterminada.
- [`child_process.fork()`](/es/nodejs/api/child_process#child_processforkmodulepath-args-options): genera un nuevo proceso de Node.js e invoca un módulo especificado con un canal de comunicación IPC establecido que permite el envío de mensajes entre el padre y el hijo.
- [`child_process.execSync()`](/es/nodejs/api/child_process#child_processexecsynccommand-options): una versión síncrona de [`child_process.exec()`](/es/nodejs/api/child_process#child_processexeccommand-options-callback) que bloqueará el bucle de eventos de Node.js.
- [`child_process.execFileSync()`](/es/nodejs/api/child_process#child_processexecfilesyncfile-args-options): una versión síncrona de [`child_process.execFile()`](/es/nodejs/api/child_process#child_processexecfilefile-args-options-callback) que bloqueará el bucle de eventos de Node.js.

Para ciertos casos de uso, como la automatización de scripts de shell, las [contrapartes síncronas](/es/nodejs/api/child_process#synchronous-process-creation) pueden ser más convenientes. Sin embargo, en muchos casos, los métodos síncronos pueden tener un impacto significativo en el rendimiento debido a la paralización del bucle de eventos mientras se completan los procesos generados.


## Creación de procesos asíncronos {#asynchronous-process-creation}

Los métodos [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.fork()`](/es/nodejs/api/child_process#child_processforkmodulepath-args-options), [`child_process.exec()`](/es/nodejs/api/child_process#child_processexeccommand-options-callback) y [`child_process.execFile()`](/es/nodejs/api/child_process#child_processexecfilefile-args-options-callback) siguen el patrón de programación asíncrona idiomático típico de otras API de Node.js.

Cada uno de los métodos devuelve una instancia de [`ChildProcess`](/es/nodejs/api/child_process#class-childprocess). Estos objetos implementan la API [`EventEmitter`](/es/nodejs/api/events#class-eventemitter) de Node.js, lo que permite que el proceso principal registre funciones de escucha que se llaman cuando ocurren ciertos eventos durante el ciclo de vida del proceso hijo.

Los métodos [`child_process.exec()`](/es/nodejs/api/child_process#child_processexeccommand-options-callback) y [`child_process.execFile()`](/es/nodejs/api/child_process#child_processexecfilefile-args-options-callback) también permiten especificar una función `callback` opcional que se invoca cuando el proceso hijo finaliza.

### Generación de archivos `.bat` y `.cmd` en Windows {#spawning-bat-and-cmd-files-on-windows}

La importancia de la distinción entre [`child_process.exec()`](/es/nodejs/api/child_process#child_processexeccommand-options-callback) y [`child_process.execFile()`](/es/nodejs/api/child_process#child_processexecfilefile-args-options-callback) puede variar según la plataforma. En sistemas operativos de tipo Unix (Unix, Linux, macOS) [`child_process.execFile()`](/es/nodejs/api/child_process#child_processexecfilefile-args-options-callback) puede ser más eficiente porque no genera un shell de forma predeterminada. Sin embargo, en Windows, los archivos `.bat` y `.cmd` no son ejecutables por sí solos sin una terminal y, por lo tanto, no se pueden iniciar usando [`child_process.execFile()`](/es/nodejs/api/child_process#child_processexecfilefile-args-options-callback). Cuando se ejecuta en Windows, los archivos `.bat` y `.cmd` se pueden invocar usando [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options) con la opción `shell` establecida, con [`child_process.exec()`](/es/nodejs/api/child_process#child_processexeccommand-options-callback) o generando `cmd.exe` y pasando el archivo `.bat` o `.cmd` como argumento (que es lo que hacen la opción `shell` y [`child_process.exec()`](/es/nodejs/api/child_process#child_processexeccommand-options-callback)). En cualquier caso, si el nombre de archivo del script contiene espacios, debe entrecomillarse.

::: code-group
```js [CJS]
// OR...
const { exec, spawn } = require('node:child_process');

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script with spaces in the filename:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```

```js [ESM]
// OR...
import { exec, spawn } from 'node:child_process';

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script with spaces in the filename:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```
:::


### `child_process.exec(command[, options][, callback])` {#child_processexeccommand-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.4.0 | Se añadió soporte para AbortSignal. |
| v16.4.0, v14.18.0 | La opción `cwd` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v8.8.0 | Ahora se soporta la opción `windowsHide`. |
| v0.1.90 | Añadido en: v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El comando a ejecutar, con argumentos separados por espacios.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Directorio de trabajo actual del proceso hijo. **Predeterminado:** `process.cwd()`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares clave-valor del entorno. **Predeterminado:** `process.env`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Shell con el que se ejecutará el comando. Consulta [Requisitos de Shell](/es/nodejs/api/child_process#shell-requirements) y [Shell predeterminado de Windows](/es/nodejs/api/child_process#default-windows-shell). **Predeterminado:** `'/bin/sh'` en Unix, `process.env.ComSpec` en Windows.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite abortar el proceso hijo usando un AbortSignal.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La mayor cantidad de datos en bytes permitidos en stdout o stderr. Si se excede, el proceso hijo se termina y cualquier salida se trunca. Consulta la advertencia en [`maxBuffer` y Unicode](/es/nodejs/api/child_process#maxbuffer-and-unicode). **Predeterminado:** `1024 * 1024`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad de usuario del proceso (consulta [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad de grupo del proceso (consulta [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Oculta la ventana de la consola del subproceso que normalmente se crearía en los sistemas Windows. **Predeterminado:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) se llama con la salida cuando el proceso termina.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)


- Devuelve: [\<ChildProcess\>](/es/nodejs/api/child_process#class-childprocess)

Crea un shell y luego ejecuta el `command` dentro de ese shell, almacenando en búfer cualquier salida generada. La cadena `command` pasada a la función exec es procesada directamente por el shell y los caracteres especiales (varían según el [shell](https://en.wikipedia.org/wiki/List_of_command-line_interpreters)) deben tratarse en consecuencia:

::: code-group
```js [CJS]
const { exec } = require('node:child_process');

exec('"/path/to/test file/test.sh" arg1 arg2');
// Se utilizan comillas dobles para que el espacio en la ruta no se interprete como
// un delimitador de múltiples argumentos.

exec('echo "La variable \\$HOME es $HOME"');
// La variable $HOME se escapa en la primera instancia, pero no en la segunda.
```

```js [ESM]
import { exec } from 'node:child_process';

exec('"/path/to/test file/test.sh" arg1 arg2');
// Se utilizan comillas dobles para que el espacio en la ruta no se interprete como
// un delimitador de múltiples argumentos.

exec('echo "La variable \\$HOME es $HOME"');
// La variable $HOME se escapa en la primera instancia, pero no en la segunda.
```
:::

**Nunca pases entradas de usuario no saneadas a esta función. Cualquier entrada que contenga
metacaracteres del shell puede utilizarse para activar la ejecución de comandos arbitrarios.**

Si se proporciona una función `callback`, se llama con los argumentos `(error, stdout, stderr)`. Si tiene éxito, `error` será `null`. En caso de error, `error` será una instancia de [`Error`](/es/nodejs/api/errors#class-error). La propiedad `error.code` será el código de salida del proceso. Por convención, cualquier código de salida distinto de `0` indica un error. `error.signal` será la señal que terminó el proceso.

Los argumentos `stdout` y `stderr` pasados a la callback contendrán la salida stdout y stderr del proceso hijo. De forma predeterminada, Node.js decodificará la salida como UTF-8 y pasará cadenas a la callback. La opción `encoding` puede utilizarse para especificar la codificación de caracteres utilizada para decodificar la salida stdout y stderr. Si `encoding` es `'buffer'`, o una codificación de caracteres no reconocida, se pasarán objetos `Buffer` a la callback en su lugar.

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

```js [ESM]
import { exec } from 'node:child_process';
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```
:::

Si `timeout` es mayor que `0`, el proceso padre enviará la señal identificada por la propiedad `killSignal` (el valor predeterminado es `'SIGTERM'`) si el proceso hijo se ejecuta durante más de `timeout` milisegundos.

A diferencia de la llamada al sistema POSIX [`exec(3)`](http://man7.org/linux/man-pages/man3/exec.3), `child_process.exec()` no reemplaza el proceso existente y utiliza un shell para ejecutar el comando.

Si este método se invoca como su versión [`util.promisify()`](/es/nodejs/api/util#utilpromisifyoriginal)ed, devuelve una `Promise` para un `Object` con propiedades `stdout` y `stderr`. La instancia `ChildProcess` devuelta se adjunta a la `Promise` como una propiedad `child`. En caso de error (incluido cualquier error que resulte en un código de salida distinto de 0), se devuelve una promesa rechazada, con el mismo objeto `error` dado en la callback, pero con dos propiedades adicionales `stdout` y `stderr`.

::: code-group
```js [CJS]
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const exec = promisify(child_process.exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```
:::

Si la opción `signal` está habilitada, llamar a `.abort()` en el `AbortController` correspondiente es similar a llamar a `.kill()` en el proceso hijo, excepto que el error pasado a la callback será un `AbortError`:

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { exec } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::

### `child_process.execFile(file[, args][, options][, callback])` {#child_processexecfilefile-args-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.4.0, v14.18.0 | La opción `cwd` puede ser un objeto `URL` WHATWG que usa el protocolo `file:`. |
| v15.4.0, v14.17.0 | Se agregó soporte para AbortSignal. |
| v8.8.0 | Ahora se admite la opción `windowsHide`. |
| v0.1.91 | Agregado en: v0.1.91 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre o la ruta del archivo ejecutable que se va a ejecutar.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista de argumentos de cadena.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Directorio de trabajo actual del proceso hijo.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares clave-valor del entorno. **Predeterminado:** `process.env`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La mayor cantidad de datos en bytes permitida en stdout o stderr. Si se excede, el proceso hijo se termina y cualquier salida se trunca. Consulta la advertencia en [`maxBuffer` y Unicode](/es/nodejs/api/child_process#maxbuffer-and-unicode). **Predeterminado:** `1024 * 1024`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad de usuario del proceso (consulta [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad de grupo del proceso (consulta [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Oculta la ventana de la consola del subproceso que normalmente se crearía en los sistemas Windows. **Predeterminado:** `false`.
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) No se realizan comillas ni escapes de argumentos en Windows. Ignorado en Unix. **Predeterminado:** `false`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si es `true`, ejecuta `command` dentro de un shell. Utiliza `'/bin/sh'` en Unix y `process.env.ComSpec` en Windows. Se puede especificar un shell diferente como una cadena. Consulta [Requisitos del shell](/es/nodejs/api/child_process#shell-requirements) y [Shell predeterminado de Windows](/es/nodejs/api/child_process#default-windows-shell). **Predeterminado:** `false` (sin shell).
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite abortar el proceso hijo usando un AbortSignal.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se llama con la salida cuando el proceso termina.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
  
 
- Devuelve: [\<ChildProcess\>](/es/nodejs/api/child_process#class-childprocess)

La función `child_process.execFile()` es similar a [`child_process.exec()`](/es/nodejs/api/child_process#child_processexeccommand-options-callback) excepto que no genera un shell de forma predeterminada. En cambio, el `file` ejecutable especificado se genera directamente como un nuevo proceso, lo que lo hace un poco más eficiente que [`child_process.exec()`](/es/nodejs/api/child_process#child_processexeccommand-options-callback).

Se admiten las mismas opciones que [`child_process.exec()`](/es/nodejs/api/child_process#child_processexeccommand-options-callback). Dado que no se genera un shell, no se admiten comportamientos como el redireccionamiento de E/S y el globbing de archivos.

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

```js [ESM]
import { execFile } from 'node:child_process';
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```
:::

Los argumentos `stdout` y `stderr` pasados al callback contendrán la salida stdout y stderr del proceso hijo. De forma predeterminada, Node.js decodificará la salida como UTF-8 y pasará cadenas al callback. La opción `encoding` se puede usar para especificar la codificación de caracteres utilizada para decodificar la salida stdout y stderr. Si `encoding` es `'buffer'`, o una codificación de caracteres no reconocida, los objetos `Buffer` se pasarán al callback en su lugar.

Si este método se invoca como su versión [`util.promisify()`](/es/nodejs/api/util#utilpromisifyoriginal)ed, devuelve una `Promise` para un `Object` con propiedades `stdout` y `stderr`. La instancia `ChildProcess` devuelta se adjunta a la `Promise` como una propiedad `child`. En caso de un error (incluido cualquier error que resulte en un código de salida diferente de 0), se devuelve una promesa rechazada, con el mismo objeto `error` dado en el callback, pero con dos propiedades adicionales `stdout` y `stderr`.

::: code-group
```js [CJS]
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const execFile = promisify(child_process.execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```
:::

**Si la opción <code>shell</code> está habilitada, no pases entradas de usuario no limpiadas a esta función. Cualquier entrada que contenga metacaracteres del shell puede usarse para activar la ejecución de comandos arbitrarios.**

Si la opción `signal` está habilitada, llamar a `.abort()` en el `AbortController` correspondiente es similar a llamar a `.kill()` en el proceso hijo, excepto que el error pasado al callback será un `AbortError`:

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { execFile } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::


### `child_process.fork(modulePath[, args][, options])` {#child_processforkmodulepath-args-options}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v17.4.0, v16.14.0 | El parámetro `modulePath` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v16.4.0, v14.18.0 | La opción `cwd` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v15.13.0, v14.18.0 | Se añadió timeout. |
| v15.11.0, v14.18.0 | Se añadió killSignal para AbortSignal. |
| v15.6.0, v14.17.0 | Se añadió soporte para AbortSignal. |
| v13.2.0, v12.16.0 | La opción `serialization` ahora es soportada. |
| v8.0.0 | La opción `stdio` ahora puede ser una string. |
| v6.4.0 | La opción `stdio` ahora es soportada. |
| v0.5.0 | Añadido en: v0.5.0 |
:::

- `modulePath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) El módulo para ejecutar en el hijo.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista de argumentos string.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Directorio de trabajo actual del proceso hijo.
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Prepara el proceso hijo para que se ejecute independientemente de su proceso padre. El comportamiento específico depende de la plataforma, ver [`options.detached`](/es/nodejs/api/child_process#optionsdetached)).
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares clave-valor del entorno. **Predeterminado:** `process.env`.
    - `execPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ejecutable utilizado para crear el proceso hijo.
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista de argumentos string pasados al ejecutable. **Predeterminado:** `process.execArgv`.
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad del grupo del proceso (ver [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica el tipo de serialización utilizado para enviar mensajes entre procesos. Los valores posibles son `'json'` y `'advanced'`. Ver [Serialización avanzada](/es/nodejs/api/child_process#advanced-serialization) para más detalles. **Predeterminado:** `'json'`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite cerrar el proceso hijo usando un AbortSignal.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El valor de la señal que se utilizará cuando el proceso generado sea terminado por timeout o señal de aborto. **Predeterminado:** `'SIGTERM'`.
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, stdin, stdout, y stderr del proceso hijo serán canalizados al proceso padre, de lo contrario, serán heredados del proceso padre, ver las opciones `'pipe'` e `'inherit'` para el [`stdio`](/es/nodejs/api/child_process#optionsstdio) de [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options) para más detalles. **Predeterminado:** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ver el [`stdio`](/es/nodejs/api/child_process#optionsstdio) de [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options). Cuando se proporciona esta opción, anula `silent`. Si se utiliza la variante de array, debe contener exactamente un elemento con el valor `'ipc'` o se producirá un error. Por ejemplo, `[0, 1, 2, 'ipc']`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad del usuario del proceso (ver [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) No se realiza ningún quoting o escaping de argumentos en Windows. Ignorado en Unix. **Predeterminado:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) En milisegundos, la cantidad máxima de tiempo que se permite ejecutar el proceso. **Predeterminado:** `undefined`.

- Devuelve: [\<ChildProcess\>](/es/nodejs/api/child_process#class-childprocess)

El método `child_process.fork()` es un caso especial de [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options) que se utiliza específicamente para generar nuevos procesos Node.js. Al igual que [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options), se devuelve un objeto [`ChildProcess`](/es/nodejs/api/child_process#class-childprocess). El [`ChildProcess`](/es/nodejs/api/child_process#class-childprocess) devuelto tendrá un canal de comunicación adicional incorporado que permite que los mensajes se pasen de un lado a otro entre el padre y el hijo. Ver [`subprocess.send()`](/es/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) para más detalles.

Tenga en cuenta que los procesos secundarios de Node.js generados son independientes del padre, con la excepción del canal de comunicación IPC que se establece entre los dos. Cada proceso tiene su propia memoria, con sus propias instancias de V8. Debido a las asignaciones de recursos adicionales requeridas, no se recomienda generar un gran número de procesos secundarios de Node.js.

Por defecto, `child_process.fork()` generará nuevas instancias de Node.js utilizando el [`process.execPath`](/es/nodejs/api/process#processexecpath) del proceso padre. La propiedad `execPath` en el objeto `options` permite utilizar una ruta de ejecución alternativa.

Los procesos de Node.js lanzados con un `execPath` personalizado se comunicarán con el proceso padre utilizando el descriptor de archivo (fd) identificado mediante la variable de entorno `NODE_CHANNEL_FD` en el proceso hijo.

A diferencia de la llamada al sistema POSIX [`fork(2)`](http://man7.org/linux/man-pages/man2/fork.2), `child_process.fork()` no clona el proceso actual.

La opción `shell` disponible en [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options) no es soportada por `child_process.fork()` y será ignorada si se establece.

Si la opción `signal` está habilitada, llamar a `.abort()` en el `AbortController` correspondiente es similar a llamar a `.kill()` en el proceso hijo, excepto que el error pasado al callback será un `AbortError`:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const process = require('node:process');

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(__filename, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```

```js [ESM]
import { fork } from 'node:child_process';
import process from 'node:process';

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(import.meta.url, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```
:::


### `child_process.spawn(command[, args][, options])` {#child_processspawncommand-args-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.4.0, v14.18.0 | La opción `cwd` puede ser un objeto WHATWG `URL` utilizando el protocolo `file:`. |
| v15.13.0, v14.18.0 | Se añadió timeout. |
| v15.11.0, v14.18.0 | Se añadió killSignal para AbortSignal. |
| v15.5.0, v14.17.0 | Se añadió soporte para AbortSignal. |
| v13.2.0, v12.16.0 | Ahora se soporta la opción `serialization`. |
| v8.8.0 | Ahora se soporta la opción `windowsHide`. |
| v6.4.0 | Ahora se soporta la opción `argv0`. |
| v5.7.0 | Ahora se soporta la opción `shell`. |
| v0.1.90 | Añadido en: v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El comando a ejecutar.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista de argumentos de cadena.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Directorio de trabajo actual del proceso hijo.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares clave-valor del entorno. **Predeterminado:** `process.env`.
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Establece explícitamente el valor de `argv[0]` enviado al proceso hijo. Se establecerá a `command` si no se especifica.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Configuración stdio del hijo (véase [`options.stdio`](/es/nodejs/api/child_process#optionsstdio)).
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Prepara el proceso hijo para que se ejecute independientemente de su proceso padre. El comportamiento específico depende de la plataforma, véase [`options.detached`](/es/nodejs/api/child_process#optionsdetached)).
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad del usuario del proceso (véase [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad del grupo del proceso (véase [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica el tipo de serialización utilizado para enviar mensajes entre procesos. Los valores posibles son `'json'` y `'advanced'`. Véase [Serialización avanzada](/es/nodejs/api/child_process#advanced-serialization) para obtener más detalles. **Predeterminado:** `'json'`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si es `true`, ejecuta `command` dentro de un shell. Utiliza `'/bin/sh'` en Unix y `process.env.ComSpec` en Windows. Se puede especificar un shell diferente como una cadena. Véase [Requisitos del shell](/es/nodejs/api/child_process#shell-requirements) y [Shell predeterminado de Windows](/es/nodejs/api/child_process#default-windows-shell). **Predeterminado:** `false` (sin shell).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) No se realiza ninguna cita o escape de argumentos en Windows. Ignorado en Unix. Esto se establece automáticamente en `true` cuando se especifica `shell` y es CMD. **Predeterminado:** `false`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Oculta la ventana de la consola del subproceso que normalmente se crearía en los sistemas Windows. **Predeterminado:** `false`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite abortar el proceso hijo utilizando un AbortSignal.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) En milisegundos, la cantidad máxima de tiempo que se permite ejecutar el proceso. **Predeterminado:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El valor de la señal que se utilizará cuando el proceso generado sea terminado por timeout o señal de aborto. **Predeterminado:** `'SIGTERM'`.


- Devuelve: [\<ChildProcess\>](/es/nodejs/api/child_process#class-childprocess)

El método `child_process.spawn()` genera un nuevo proceso utilizando el `command` dado, con argumentos de línea de comandos en `args`. Si se omite, `args` por defecto es un array vacío.

**Si la opción <code>shell</code> está habilitada, no pase entradas de usuario no saneadas a esta
función. Cualquier entrada que contenga metacaracteres del shell puede utilizarse para activar
la ejecución de comandos arbitrarios.**

Se puede utilizar un tercer argumento para especificar opciones adicionales, con estos valores predeterminados:

```js [ESM]
const defaults = {
  cwd: undefined,
  env: process.env,
};
```
Utilice `cwd` para especificar el directorio de trabajo desde el que se genera el proceso. Si no se indica, el valor predeterminado es heredar el directorio de trabajo actual. Si se indica, pero la ruta no existe, el proceso hijo emite un error `ENOENT` y se cierra inmediatamente. `ENOENT` también se emite cuando el comando no existe.

Utilice `env` para especificar las variables de entorno que serán visibles para el nuevo proceso, el valor predeterminado es [`process.env`](/es/nodejs/api/process#processenv).

Los valores `undefined` en `env` se ignorarán.

Ejemplo de ejecución de `ls -lh /usr`, capturando `stdout`, `stderr` y el código de salida:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

Ejemplo: Una forma muy elaborada de ejecutar `ps ax | grep ssh`

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```
:::

Ejemplo de comprobación de un `spawn` fallido:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```
:::

Ciertas plataformas (macOS, Linux) utilizarán el valor de `argv[0]` para el título del proceso, mientras que otras (Windows, SunOS) utilizarán `command`.

Node.js sobrescribe `argv[0]` con `process.execPath` al inicio, por lo que `process.argv[0]` en un proceso hijo de Node.js no coincidirá con el parámetro `argv0` pasado a `spawn` desde el padre. Recupérelo con la propiedad `process.argv0` en su lugar.

Si la opción `signal` está habilitada, llamar a `.abort()` en el `AbortController` correspondiente es similar a llamar a `.kill()` en el proceso hijo, excepto que el error pasado a la devolución de llamada será un `AbortError`:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // Esto se llamará con err siendo un AbortError si el controlador aborta
});
controller.abort(); // Detiene el proceso hijo
```

```js [ESM]
import { spawn } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // Esto se llamará con err siendo un AbortError si el controlador aborta
});
controller.abort(); // Detiene el proceso hijo
```
:::


#### `options.detached` {#optionsdetached}

**Añadido en: v0.7.10**

En Windows, establecer `options.detached` a `true` permite que el proceso hijo continúe ejecutándose después de que el padre termine. El proceso hijo tendrá su propia ventana de consola. Una vez habilitado para un proceso hijo, no se puede deshabilitar.

En plataformas que no son Windows, si `options.detached` se establece en `true`, el proceso hijo se convertirá en el líder de un nuevo grupo de procesos y sesión. Los procesos hijo pueden continuar ejecutándose después de que el padre termine, independientemente de si están separados o no. Consulte [`setsid(2)`](http://man7.org/linux/man-pages/man2/setsid.2) para obtener más información.

De forma predeterminada, el padre esperará a que termine el proceso hijo separado. Para evitar que el proceso padre espere a que termine un `subprocess` dado, utilice el método `subprocess.unref()`. Hacerlo hará que el bucle de eventos del proceso padre no incluya el proceso hijo en su recuento de referencias, lo que permitirá que el proceso padre termine independientemente del proceso hijo, a menos que haya un canal IPC establecido entre el proceso hijo y el padre.

Cuando se utiliza la opción `detached` para iniciar un proceso de larga duración, el proceso no permanecerá ejecutándose en segundo plano después de que el padre termine a menos que se le proporcione una configuración `stdio` que no esté conectada al padre. Si el `stdio` del proceso padre se hereda, el proceso hijo permanecerá adjunto a la terminal de control.

Ejemplo de un proceso de larga duración, separando y también ignorando los descriptores de archivo `stdio` de su padre, para ignorar la terminación del padre:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::

Alternativamente, se puede redirigir la salida del proceso hijo a archivos:

::: code-group
```js [CJS]
const { openSync } = require('node:fs');
const { spawn } = require('node:child_process');
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```

```js [ESM]
import { openSync } from 'node:fs');
import { spawn } from 'node:child_process';
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```
:::


#### `options.stdio` {#optionsstdio}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.6.0, v14.18.0 | Se agregó el indicador stdio `overlapped`. |
| v3.3.1 | Ahora se acepta el valor `0` como descriptor de archivo. |
| v0.7.10 | Agregado en: v0.7.10 |
:::

La opción `options.stdio` se utiliza para configurar las tuberías que se establecen entre el proceso padre y el proceso hijo. De forma predeterminada, la entrada estándar, la salida estándar y el error estándar del hijo se redirigen a los flujos correspondientes [`subprocess.stdin`](/es/nodejs/api/child_process#subprocessstdin), [`subprocess.stdout`](/es/nodejs/api/child_process#subprocessstdout) y [`subprocess.stderr`](/es/nodejs/api/child_process#subprocessstderr) en el objeto [`ChildProcess`](/es/nodejs/api/child_process#class-childprocess). Esto equivale a establecer `options.stdio` igual a `['pipe', 'pipe', 'pipe']`.

Por conveniencia, `options.stdio` puede ser una de las siguientes cadenas:

- `'pipe'`: equivalente a `['pipe', 'pipe', 'pipe']` (el valor predeterminado)
- `'overlapped'`: equivalente a `['overlapped', 'overlapped', 'overlapped']`
- `'ignore'`: equivalente a `['ignore', 'ignore', 'ignore']`
- `'inherit'`: equivalente a `['inherit', 'inherit', 'inherit']` o `[0, 1, 2]`

De lo contrario, el valor de `options.stdio` es un array donde cada índice corresponde a un fd en el hijo. Los fd 0, 1 y 2 corresponden a la entrada estándar, la salida estándar y el error estándar, respectivamente. Se pueden especificar fd adicionales para crear tuberías adicionales entre el padre y el hijo. El valor es uno de los siguientes:



::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

// El hijo utilizará los stdios del padre.
spawn('prg', [], { stdio: 'inherit' });

// Genera un hijo compartiendo solo el error estándar.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// Abre un fd=4 adicional, para interactuar con programas que presentan una
// interfaz de estilo startd.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

// El hijo utilizará los stdios del padre.
spawn('prg', [], { stdio: 'inherit' });

// Genera un hijo compartiendo solo el error estándar.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// Abre un fd=4 adicional, para interactuar con programas que presentan una
// interfaz de estilo startd.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```
:::

*Vale la pena señalar que cuando se establece un canal IPC entre los
procesos padre e hijo, y el proceso hijo es una instancia de Node.js,
el proceso hijo se inicia con el canal IPC sin referencia (usando
<code>unref()</code>) hasta que el proceso hijo registra un controlador de eventos para el
<a href="process.html#event-disconnect"><code>'disconnect'</code></a> evento o el <a href="process.html#event-message"><code>'message'</code></a> evento. Esto permite que el
proceso hijo salga normalmente sin que el proceso se mantenga abierto por el
canal IPC abierto.* Véase también: [`child_process.exec()`](/es/nodejs/api/child_process#child_processexeccommand-options-callback) y [`child_process.fork()`](/es/nodejs/api/child_process#child_processforkmodulepath-args-options).


## Creación síncrona de procesos {#synchronous-process-creation}

Los métodos [`child_process.spawnSync()`](/es/nodejs/api/child_process#child_processspawnsynccommand-args-options), [`child_process.execSync()`](/es/nodejs/api/child_process#child_processexecsynccommand-options) y [`child_process.execFileSync()`](/es/nodejs/api/child_process#child_processexecfilesyncfile-args-options) son síncronos y bloquearán el bucle de eventos de Node.js, pausando la ejecución de cualquier código adicional hasta que el proceso generado finalice.

Las llamadas de bloqueo como estas son principalmente útiles para simplificar tareas de scripting de propósito general y para simplificar la carga/procesamiento de la configuración de la aplicación al inicio.

### `child_process.execFileSync(file[, args][, options])` {#child_processexecfilesyncfile-args-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.4.0, v14.18.0 | La opción `cwd` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v10.10.0 | La opción `input` ahora puede ser cualquier `TypedArray` o `DataView`. |
| v8.8.0 | La opción `windowsHide` ahora es compatible. |
| v8.0.0 | La opción `input` ahora puede ser un `Uint8Array`. |
| v6.2.1, v4.5.0 | La opción `encoding` ahora se puede establecer explícitamente en `buffer`. |
| v0.11.12 | Añadido en: v0.11.12 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre o la ruta del archivo ejecutable a ejecutar.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista de argumentos de cadena.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Directorio de trabajo actual del proceso hijo.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) El valor que se pasará como stdin al proceso generado. Si `stdio[0]` está establecido en `'pipe'`, proporcionar este valor anulará `stdio[0]`.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configuración stdio del hijo. Consulte el [`stdio`](/es/nodejs/api/child_process#optionsstdio) de [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options). `stderr` por defecto se enviará a la salida de error del proceso padre a menos que se especifique `stdio`. **Predeterminado:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares clave-valor del entorno. **Predeterminado:** `process.env`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad del usuario del proceso (consulte [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad del grupo del proceso (consulte [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) En milisegundos, la cantidad máxima de tiempo que se permite que se ejecute el proceso. **Predeterminado:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El valor de señal que se utilizará cuando se elimine el proceso generado. **Predeterminado:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La mayor cantidad de datos en bytes permitidos en stdout o stderr. Si se excede, el proceso hijo se termina. Consulte la advertencia en [`maxBuffer` y Unicode](/es/nodejs/api/child_process#maxbuffer-and-unicode). **Predeterminado:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación utilizada para todas las entradas y salidas de stdio. **Predeterminado:** `'buffer'`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Oculta la ventana de la consola del subproceso que normalmente se crearía en los sistemas Windows. **Predeterminado:** `false`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si es `true`, ejecuta `command` dentro de un shell. Utiliza `'/bin/sh'` en Unix y `process.env.ComSpec` en Windows. Se puede especificar un shell diferente como una cadena. Consulte [Requisitos del shell](/es/nodejs/api/child_process#shell-requirements) y [Shell predeterminado de Windows](/es/nodejs/api/child_process#default-windows-shell). **Predeterminado:** `false` (sin shell).

- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El stdout del comando.

El método `child_process.execFileSync()` es generalmente idéntico a [`child_process.execFile()`](/es/nodejs/api/child_process#child_processexecfilefile-args-options-callback) con la excepción de que el método no regresará hasta que el proceso hijo se haya cerrado por completo. Cuando se ha encontrado un tiempo de espera y se envía `killSignal`, el método no regresará hasta que el proceso haya salido por completo.

Si el proceso hijo intercepta y gestiona la señal `SIGTERM` y no sale, el proceso padre seguirá esperando hasta que el proceso hijo haya salido.

Si el proceso se agota o tiene un código de salida distinto de cero, este método lanzará un [`Error`](/es/nodejs/api/errors#class-error) que incluirá el resultado completo del [`child_process.spawnSync()`](/es/nodejs/api/child_process#child_processspawnsynccommand-args-options) subyacente.

**Si la opción <code>shell</code> está habilitada, no pase la entrada del usuario sin
saneamiento a esta función. Cualquier entrada que contenga metacaracteres del shell
puede usarse para activar la ejecución arbitraria de comandos.**

::: code-group
```js [CJS]
const { execFileSync } = require('node:child_process');

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Capture stdout and stderr from child process. Overrides the
    // default behavior of streaming child stderr to the parent stderr
    stdio: 'pipe',

    // Use utf8 encoding for stdio pipes
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Spawning child process failed
    console.error(err.code);
  } else {
    // Child was spawned but exited with non-zero exit code
    // Error contains any stdout and stderr from the child
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```

```js [ESM]
import { execFileSync } from 'node:child_process';

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Capture stdout and stderr from child process. Overrides the
    // default behavior of streaming child stderr to the parent stderr
    stdio: 'pipe',

    // Use utf8 encoding for stdio pipes
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Spawning child process failed
    console.error(err.code);
  } else {
    // Child was spawned but exited with non-zero exit code
    // Error contains any stdout and stderr from the child
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```
:::


### `child_process.execSync(command[, options])` {#child_processexecsynccommand-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.4.0, v14.18.0 | La opción `cwd` puede ser un objeto WHATWG `URL` usando el protocolo `file:`. |
| v10.10.0 | La opción `input` ahora puede ser cualquier `TypedArray` o una `DataView`. |
| v8.8.0 | La opción `windowsHide` ahora es compatible. |
| v8.0.0 | La opción `input` ahora puede ser una `Uint8Array`. |
| v0.11.12 | Añadido en: v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El comando a ejecutar.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Directorio de trabajo actual del proceso hijo.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) El valor que se pasará como stdin al proceso generado. Si `stdio[0]` está establecido en `'pipe'`, el suministro de este valor anulará `stdio[0]`.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configuración de stdio del hijo. Vea el [`stdio`](/es/nodejs/api/child_process#optionsstdio) de [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options). `stderr` por defecto se enviará a la salida de error del proceso padre a menos que se especifique `stdio`. **Predeterminado:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares clave-valor del entorno. **Predeterminado:** `process.env`.
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Shell para ejecutar el comando con. Vea los [Requisitos del Shell](/es/nodejs/api/child_process#shell-requirements) y [Shell predeterminado de Windows](/es/nodejs/api/child_process#default-windows-shell). **Predeterminado:** `'/bin/sh'` en Unix, `process.env.ComSpec` en Windows.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad de usuario del proceso. (Ver [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad de grupo del proceso. (Ver [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) En milisegundos, la cantidad máxima de tiempo que se permite la ejecución del proceso. **Predeterminado:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El valor de la señal que se utilizará cuando se elimine el proceso generado. **Predeterminado:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La mayor cantidad de datos en bytes permitidos en stdout o stderr. Si se excede, el proceso hijo finaliza y cualquier salida se trunca. Vea la advertencia en [`maxBuffer` y Unicode](/es/nodejs/api/child_process#maxbuffer-and-unicode). **Predeterminado:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación utilizada para todas las entradas y salidas stdio. **Predeterminado:** `'buffer'`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Oculta la ventana de la consola del subproceso que normalmente se crearía en los sistemas Windows. **Predeterminado:** `false`.
  
 
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La salida estándar del comando.

El método `child_process.execSync()` es generalmente idéntico a [`child_process.exec()`](/es/nodejs/api/child_process#child_processexeccommand-options-callback) con la excepción de que el método no regresará hasta que el proceso hijo se haya cerrado por completo. Cuando se ha encontrado un tiempo de espera y se envía `killSignal`, el método no regresará hasta que el proceso haya salido por completo. Si el proceso hijo intercepta y gestiona la señal `SIGTERM` y no sale, el proceso padre esperará hasta que el proceso hijo haya salido.

Si el proceso se agota o tiene un código de salida distinto de cero, este método arrojará un error. El objeto [`Error`](/es/nodejs/api/errors#class-error) contendrá todo el resultado de [`child_process.spawnSync()`](/es/nodejs/api/child_process#child_processspawnsynccommand-args-options).

**Nunca pase entradas de usuario no saneadas a esta función. Cualquier entrada que contenga
metacaracteres de shell puede utilizarse para activar la ejecución de comandos arbitrarios.**


### `child_process.spawnSync(command[, args][, options])` {#child_processspawnsynccommand-args-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.4.0, v14.18.0 | La opción `cwd` puede ser un objeto `URL` WHATWG que utiliza el protocolo `file:`. |
| v10.10.0 | La opción `input` ahora puede ser cualquier `TypedArray` o una `DataView`. |
| v8.8.0 | Ahora se admite la opción `windowsHide`. |
| v8.0.0 | La opción `input` ahora puede ser un `Uint8Array`. |
| v5.7.0 | Ahora se admite la opción `shell`. |
| v6.2.1, v4.5.0 | La opción `encoding` ahora se puede establecer explícitamente en `buffer`. |
| v0.11.12 | Añadido en: v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El comando a ejecutar.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista de argumentos de cadena.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Directorio de trabajo actual del proceso hijo.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) El valor que se pasará como stdin al proceso generado. Si `stdio[0]` está establecido en `'pipe'`, proporcionar este valor anulará `stdio[0]`.
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Establece explícitamente el valor de `argv[0]` enviado al proceso hijo. Esto se establecerá en `command` si no se especifica.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configuración de stdio del hijo. Consulte [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/es/nodejs/api/child_process#optionsstdio). **Predeterminado:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares clave-valor del entorno. **Predeterminado:** `process.env`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad del usuario del proceso (véase [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad del grupo del proceso (véase [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) En milisegundos, la cantidad máxima de tiempo que se permite ejecutar el proceso. **Predeterminado:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El valor de la señal que se utilizará cuando se interrumpa el proceso generado. **Predeterminado:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La mayor cantidad de datos en bytes permitida en stdout o stderr. Si se excede, el proceso hijo se termina y cualquier salida se trunca. Consulte la advertencia en [`maxBuffer` y Unicode](/es/nodejs/api/child_process#maxbuffer-and-unicode). **Predeterminado:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación utilizada para todas las entradas y salidas de stdio. **Predeterminado:** `'buffer'`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si es `true`, ejecuta `command` dentro de un shell. Utiliza `'/bin/sh'` en Unix y `process.env.ComSpec` en Windows. Se puede especificar un shell diferente como una cadena. Consulte [Requisitos del shell](/es/nodejs/api/child_process#shell-requirements) y [Shell predeterminado de Windows](/es/nodejs/api/child_process#default-windows-shell). **Predeterminado:** `false` (sin shell).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) No se realiza ninguna cita o escape de argumentos en Windows. Se ignora en Unix. Esto se establece en `true` automáticamente cuando se especifica `shell` y es CMD. **Predeterminado:** `false`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Oculta la ventana de la consola del subproceso que normalmente se crearía en los sistemas Windows. **Predeterminado:** `false`.
  
 
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Pid del proceso hijo.
    - `output` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Array de resultados de la salida de stdio.
    - `stdout` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El contenido de `output[1]`.
    - `stderr` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El contenido de `output[2]`.
    - `status` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) El código de salida del subproceso, o `null` si el subproceso terminó debido a una señal.
    - `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) La señal utilizada para interrumpir el subproceso, o `null` si el subproceso no terminó debido a una señal.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) El objeto de error si el proceso hijo falló o excedió el tiempo de espera.
  
 

El método `child_process.spawnSync()` es generalmente idéntico a [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options) con la excepción de que la función no regresará hasta que el proceso hijo se haya cerrado por completo. Cuando se ha encontrado un tiempo de espera y se envía `killSignal`, el método no regresará hasta que el proceso haya salido por completo. Si el proceso intercepta y maneja la señal `SIGTERM` y no sale, el proceso padre esperará hasta que el proceso hijo haya salido.

**Si la opción <code>shell</code> está habilitada, no pase entradas de usuario no saneadas a esta función. Cualquier entrada que contenga metacaracteres del shell puede utilizarse para desencadenar la ejecución arbitraria de comandos.**


## Clase: `ChildProcess` {#class-childprocess}

**Agregado en: v2.2.0**

- Extiende: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Las instancias de `ChildProcess` representan procesos hijo generados.

No se pretende que las instancias de `ChildProcess` se creen directamente. En su lugar, utilice los métodos [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.exec()`](/es/nodejs/api/child_process#child_processexeccommand-options-callback), [`child_process.execFile()`](/es/nodejs/api/child_process#child_processexecfilefile-args-options-callback) o [`child_process.fork()`](/es/nodejs/api/child_process#child_processforkmodulepath-args-options) para crear instancias de `ChildProcess`.

### Evento: `'close'` {#event-close}

**Agregado en: v0.7.7**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El código de salida si el proceso hijo salió por sí solo.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La señal por la cual el proceso hijo fue terminado.

El evento `'close'` se emite después de que un proceso ha terminado *y* los flujos stdio de un proceso hijo se han cerrado. Esto es distinto del evento [`'exit'`](/es/nodejs/api/child_process#event-exit), ya que varios procesos podrían compartir los mismos flujos stdio. El evento `'close'` siempre se emitirá después de que [`'exit'`](/es/nodejs/api/child_process#event-exit) ya se haya emitido, o [`'error'`](/es/nodejs/api/child_process#event-error) si el proceso hijo no pudo generarse.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::


### Evento: `'disconnect'` {#event-disconnect}

**Añadido en: v0.7.2**

El evento `'disconnect'` se emite después de llamar al método [`subprocess.disconnect()`](/es/nodejs/api/child_process#subprocessdisconnect) en el proceso padre o [`process.disconnect()`](/es/nodejs/api/process#processdisconnect) en el proceso hijo. Después de la desconexión, ya no es posible enviar ni recibir mensajes, y la propiedad [`subprocess.connected`](/es/nodejs/api/child_process#subprocessconnected) es `false`.

### Evento: `'error'` {#event-error}

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) El error.

El evento `'error'` se emite siempre que:

- El proceso no pudo ser generado.
- El proceso no pudo ser terminado.
- El envío de un mensaje al proceso hijo falló.
- El proceso hijo fue abortado a través de la opción `signal`.

El evento `'exit'` puede o no dispararse después de que haya ocurrido un error. Al escuchar los eventos `'exit'` y `'error'`, protéjase contra la invocación accidental de funciones de controlador varias veces.

Vea también [`subprocess.kill()`](/es/nodejs/api/child_process#subprocesskillsignal) y [`subprocess.send()`](/es/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback).

### Evento: `'exit'` {#event-exit}

**Añadido en: v0.1.90**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El código de salida si el proceso hijo salió por sí solo.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La señal por la cual el proceso hijo fue terminado.

El evento `'exit'` se emite después de que el proceso hijo finaliza. Si el proceso salió, `code` es el código de salida final del proceso, de lo contrario `null`. Si el proceso terminó debido a la recepción de una señal, `signal` es el nombre de cadena de la señal, de lo contrario `null`. Uno de los dos siempre será no-`null`.

Cuando se activa el evento `'exit'`, los flujos stdio del proceso hijo aún pueden estar abiertos.

Node.js establece controladores de señales para `SIGINT` y `SIGTERM` y los procesos de Node.js no terminarán inmediatamente debido a la recepción de esas señales. Más bien, Node.js realizará una secuencia de acciones de limpieza y luego volverá a generar la señal manejada.

Vea [`waitpid(2)`](http://man7.org/linux/man-pages/man2/waitpid.2).


### Evento: `'message'` {#event-message}

**Añadido en: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto JSON analizado o valor primitivo.
- `sendHandle` [\<Handle\>](/es/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined` o un objeto [`net.Socket`](/es/nodejs/api/net#class-netsocket), [`net.Server`](/es/nodejs/api/net#class-netserver) o [`dgram.Socket`](/es/nodejs/api/dgram#class-dgramsocket).

El evento `'message'` se activa cuando un proceso hijo usa [`process.send()`](/es/nodejs/api/process#processsendmessage-sendhandle-options-callback) para enviar mensajes.

El mensaje pasa por serialización y análisis. El mensaje resultante podría no ser el mismo que se envió originalmente.

Si la opción `serialization` se estableció en `'advanced'` cuando se generó el proceso hijo, el argumento `message` puede contener datos que JSON no puede representar. Consulte [Serialización avanzada](/es/nodejs/api/child_process#advanced-serialization) para obtener más detalles.

### Evento: `'spawn'` {#event-spawn}

**Añadido en: v15.1.0, v14.17.0**

El evento `'spawn'` se emite una vez que el proceso hijo se ha generado correctamente. Si el proceso hijo no se genera correctamente, el evento `'spawn'` no se emite y, en cambio, se emite el evento `'error'`.

Si se emite, el evento `'spawn'` aparece antes que todos los demás eventos y antes de que se reciban datos a través de `stdout` o `stderr`.

El evento `'spawn'` se activará independientemente de si ocurre un error **dentro** del proceso generado. Por ejemplo, si `bash some-command` se genera correctamente, el evento `'spawn'` se activará, aunque `bash` podría no generar `some-command`. Esta advertencia también se aplica cuando se usa `{ shell: true }`.

### `subprocess.channel` {#subprocesschannel}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | El objeto ya no expone accidentalmente enlaces C++ nativos. |
| v7.1.0 | Añadido en: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Una tubería que representa el canal IPC al proceso hijo.

La propiedad `subprocess.channel` es una referencia al canal IPC del hijo. Si no existe ningún canal IPC, esta propiedad es `undefined`.


#### `subprocess.channel.ref()` {#subprocesschannelref}

**Agregado en: v7.1.0**

Este método hace que el canal IPC mantenga el bucle de eventos del proceso padre en ejecución si `.unref()` se ha llamado antes.

#### `subprocess.channel.unref()` {#subprocesschannelunref}

**Agregado en: v7.1.0**

Este método hace que el canal IPC no mantenga el bucle de eventos del proceso padre en ejecución y permite que termine incluso mientras el canal está abierto.

### `subprocess.connected` {#subprocessconnected}

**Agregado en: v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Establecido en `false` después de que se llama a `subprocess.disconnect()`.

La propiedad `subprocess.connected` indica si todavía es posible enviar y recibir mensajes desde un proceso hijo. Cuando `subprocess.connected` es `false`, ya no es posible enviar o recibir mensajes.

### `subprocess.disconnect()` {#subprocessdisconnect}

**Agregado en: v0.7.2**

Cierra el canal IPC entre los procesos padre e hijo, permitiendo que el proceso hijo salga correctamente una vez que no haya otras conexiones que lo mantengan vivo. Después de llamar a este método, las propiedades `subprocess.connected` y `process.connected` en los procesos padre e hijo (respectivamente) se establecerán en `false`, y ya no será posible pasar mensajes entre los procesos.

El evento `'disconnect'` se emitirá cuando no haya mensajes en el proceso de ser recibidos. Esto se activará con mayor frecuencia inmediatamente después de llamar a `subprocess.disconnect()`.

Cuando el proceso hijo es una instancia de Node.js (por ejemplo, generado usando [`child_process.fork()`](/es/nodejs/api/child_process#child_processforkmodulepath-args-options)), el método `process.disconnect()` se puede invocar dentro del proceso hijo para cerrar también el canal IPC.

### `subprocess.exitCode` {#subprocessexitcode}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La propiedad `subprocess.exitCode` indica el código de salida del proceso hijo. Si el proceso hijo todavía se está ejecutando, el campo será `null`.

### `subprocess.kill([signal])` {#subprocesskillsignal}

**Agregado en: v0.1.90**

- `signal` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

El método `subprocess.kill()` envía una señal al proceso hijo. Si no se proporciona ningún argumento, se enviará al proceso la señal `'SIGTERM'`. Consulte [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) para obtener una lista de las señales disponibles. Esta función devuelve `true` si [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) tiene éxito, y `false` en caso contrario.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```
:::

El objeto [`ChildProcess`](/es/nodejs/api/child_process#class-childprocess) puede emitir un evento [`'error'`](/es/nodejs/api/child_process#event-error) si la señal no se puede entregar. Enviar una señal a un proceso hijo que ya ha salido no es un error, pero puede tener consecuencias imprevistas. Específicamente, si el identificador de proceso (PID) se ha reasignado a otro proceso, la señal se entregará a ese proceso en su lugar, lo que puede tener resultados inesperados.

Si bien la función se llama `kill`, la señal entregada al proceso hijo puede no terminar realmente el proceso.

Consulte [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) como referencia.

En Windows, donde no existen señales POSIX, el argumento `signal` se ignorará excepto para `'SIGKILL'`, `'SIGTERM'`, `'SIGINT'` y `'SIGQUIT'`, y el proceso siempre se terminará por la fuerza y abruptamente (similar a `'SIGKILL'`). Consulte [Eventos de señal](/es/nodejs/api/process#signal-events) para obtener más detalles.

En Linux, los procesos hijos de los procesos hijos no se terminarán al intentar matar a su padre. Es probable que esto suceda al ejecutar un nuevo proceso en un shell o con el uso de la opción `shell` de `ChildProcess`:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```
:::


### `subprocess[Symbol.dispose]()` {#subprocesssymboldispose}

**Agregado en: v20.5.0, v18.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Llama a [`subprocess.kill()`](/es/nodejs/api/child_process#subprocesskillsignal) con `'SIGTERM'`.

### `subprocess.killed` {#subprocesskilled}

**Agregado en: v0.5.10**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Establecido en `true` después de que se utiliza `subprocess.kill()` para enviar con éxito una señal al proceso hijo.

La propiedad `subprocess.killed` indica si el proceso hijo recibió con éxito una señal de `subprocess.kill()`. La propiedad `killed` no indica que el proceso hijo haya terminado.

### `subprocess.pid` {#subprocesspid}

**Agregado en: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Devuelve el identificador de proceso (PID) del proceso hijo. Si el proceso hijo no puede iniciarse debido a errores, entonces el valor es `undefined` y se emite `error`.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

console.log(`PID del hijo generado: ${grep.pid}`);
grep.stdin.end();
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

console.log(`PID del hijo generado: ${grep.pid}`);
grep.stdin.end();
```
:::

### `subprocess.ref()` {#subprocessref}

**Agregado en: v0.7.10**

Llamar a `subprocess.ref()` después de hacer una llamada a `subprocess.unref()` restaurará el recuento de referencias eliminado para el proceso hijo, forzando al proceso principal a esperar a que el proceso hijo salga antes de salir él mismo.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```
:::


### `subprocess.send(message[, sendHandle[, options]][, callback])` {#subprocesssendmessage-sendhandle-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v5.8.0 | El parámetro `options`, y la opción `keepOpen` en particular, ahora son compatibles. |
| v5.0.0 | Este método ahora devuelve un booleano para el control de flujo. |
| v4.0.0 | El parámetro `callback` ahora es compatible. |
| v0.5.9 | Añadido en: v0.5.9 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/es/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined`, o un objeto [`net.Socket`](/es/nodejs/api/net#class-netsocket), [`net.Server`](/es/nodejs/api/net#class-netserver), o [`dgram.Socket`](/es/nodejs/api/dgram#class-dgramsocket).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El argumento `options`, si está presente, es un objeto utilizado para parametrizar el envío de ciertos tipos de controladores. `options` admite las siguientes propiedades:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Un valor que se puede utilizar al pasar instancias de `net.Socket`. Cuando es `true`, el socket se mantiene abierto en el proceso de envío. **Predeterminado:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Cuando se ha establecido un canal IPC entre los procesos padre e hijo (es decir, cuando se utiliza [`child_process.fork()`](/es/nodejs/api/child_process#child_processforkmodulepath-args-options)), el método `subprocess.send()` se puede utilizar para enviar mensajes al proceso hijo. Cuando el proceso hijo es una instancia de Node.js, estos mensajes se pueden recibir a través del evento [`'message'`](/es/nodejs/api/process#event-message).

El mensaje pasa por serialización y análisis. El mensaje resultante podría no ser el mismo que se envió originalmente.

Por ejemplo, en el script padre:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const forkedProcess = fork(`${__dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PADRE recibió el mensaje:', message);
});

// Hace que el hijo imprima: HIJO recibió el mensaje: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```

```js [ESM]
import { fork } from 'node:child_process';
const forkedProcess = fork(`${import.meta.dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PADRE recibió el mensaje:', message);
});

// Hace que el hijo imprima: HIJO recibió el mensaje: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```
:::

Y luego el script hijo, `'sub.js'` podría verse así:

```js [ESM]
process.on('message', (message) => {
  console.log('HIJO recibió el mensaje:', message);
});

// Hace que el padre imprima: PADRE recibió el mensaje: { foo: 'bar', baz: null }
process.send({ foo: 'bar', baz: NaN });
```
Los procesos hijo de Node.js tendrán su propio método [`process.send()`](/es/nodejs/api/process#processsendmessage-sendhandle-options-callback) que permite al proceso hijo enviar mensajes de vuelta al proceso padre.

Hay un caso especial al enviar un mensaje `{cmd: 'NODE_foo'}`. Los mensajes que contienen un prefijo `NODE_` en la propiedad `cmd` están reservados para su uso dentro del núcleo de Node.js y no se emitirán en el evento [`'message'`](/es/nodejs/api/process#event-message) del hijo. Más bien, tales mensajes se emiten utilizando el evento `'internalMessage'` y son consumidos internamente por Node.js. Las aplicaciones deben evitar el uso de tales mensajes o la escucha de eventos `'internalMessage'` ya que está sujeto a cambios sin previo aviso.

El argumento opcional `sendHandle` que se puede pasar a `subprocess.send()` es para pasar un servidor TCP o un objeto de socket al proceso hijo. El proceso hijo recibirá el objeto como el segundo argumento pasado a la función de devolución de llamada registrada en el evento [`'message'`](/es/nodejs/api/process#event-message). Cualquier dato que se reciba y se almacene en el socket no se enviará al hijo. El envío de sockets IPC no es compatible con Windows.

La `callback` opcional es una función que se invoca después de que se envía el mensaje, pero antes de que el proceso hijo lo haya recibido. La función se llama con un solo argumento: `null` en caso de éxito, o un objeto [`Error`](/es/nodejs/api/errors#class-error) en caso de fallo.

Si no se proporciona ninguna función `callback` y el mensaje no se puede enviar, el objeto [`ChildProcess`](/es/nodejs/api/child_process#class-childprocess) emitirá un evento `'error'`. Esto puede suceder, por ejemplo, cuando el proceso hijo ya ha salido.

`subprocess.send()` devolverá `false` si el canal se ha cerrado o cuando la acumulación de mensajes no enviados supera un umbral que hace que no sea prudente enviar más. De lo contrario, el método devuelve `true`. La función `callback` se puede utilizar para implementar el control de flujo.


#### Ejemplo: enviando un objeto de servidor {#example-sending-a-server-object}

El argumento `sendHandle` se puede usar, por ejemplo, para pasar el manejador de un objeto de servidor TCP al proceso hijo, como se ilustra en el siguiente ejemplo:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const subprocess = fork('subprocess.js');

// Abre el objeto de servidor y envía el manejador.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const subprocess = fork('subprocess.js');

// Abre el objeto de servidor y envía el manejador.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```
:::

El proceso hijo recibiría entonces el objeto del servidor como:

```js [ESM]
process.on('message', (m, server) => {
  if (m === 'server') {
    server.on('connection', (socket) => {
      socket.end('handled by child');
    });
  }
});
```

Una vez que el servidor se comparte entre el padre y el hijo, algunas conexiones pueden ser manejadas por el padre y otras por el hijo.

Si bien el ejemplo anterior utiliza un servidor creado con el módulo `node:net`, los servidores del módulo `node:dgram` utilizan exactamente el mismo flujo de trabajo con las excepciones de escuchar un evento `'message'` en lugar de `'connection'` y usar `server.bind()` en lugar de `server.listen()`. Sin embargo, esto solo es compatible con plataformas Unix.

#### Ejemplo: enviando un objeto de socket {#example-sending-a-socket-object}

De manera similar, el argumento `sendHandler` se puede usar para pasar el manejador de un socket al proceso hijo. El siguiente ejemplo genera dos hijos que manejan cada uno las conexiones con prioridad "normal" o "especial":

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// Abre el servidor y envía sockets al hijo. Usa pauseOnConnect para evitar
// que los sockets se lean antes de que se envíen al proceso hijo.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // Si esta es prioridad especial...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // Esta es la prioridad normal.
  normal.send('socket', socket);
});
server.listen(1337);
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// Abre el servidor y envía sockets al hijo. Usa pauseOnConnect para evitar
// que los sockets se lean antes de que se envíen al proceso hijo.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // Si esta es prioridad especial...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // Esta es la prioridad normal.
  normal.send('socket', socket);
});
server.listen(1337);
```
:::

`subprocess.js` recibiría el manejador del socket como el segundo argumento pasado a la función de devolución de llamada del evento:

```js [ESM]
process.on('message', (m, socket) => {
  if (m === 'socket') {
    if (socket) {
      // Comprueba que el socket del cliente existe.
      // Es posible que el socket se cierre entre el momento en que se
      // envía y el momento en que se recibe en el proceso hijo.
      socket.end(`Request handled with ${process.argv[2]} priority`);
    }
  }
});
```
No uses `.maxConnections` en un socket que se haya pasado a un subproceso. El padre no puede rastrear cuándo se destruye el socket.

Cualquier manejador de `'message'` en el subproceso debe verificar que `socket` exista, ya que la conexión puede haberse cerrado durante el tiempo que lleva enviar la conexión al hijo.


### `subprocess.signalCode` {#subprocesssignalcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

La propiedad `subprocess.signalCode` indica la señal recibida por el proceso hijo, si la hay, sino `null`.

### `subprocess.spawnargs` {#subprocessspawnargs}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

La propiedad `subprocess.spawnargs` representa la lista completa de argumentos de línea de comandos con los que se inició el proceso hijo.

### `subprocess.spawnfile` {#subprocessspawnfile}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad `subprocess.spawnfile` indica el nombre del archivo ejecutable del proceso hijo que se inicia.

Para [`child_process.fork()`](/es/nodejs/api/child_process#child_processforkmodulepath-args-options), su valor será igual a [`process.execPath`](/es/nodejs/api/process#processexecpath). Para [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options), su valor será el nombre del archivo ejecutable. Para [`child_process.exec()`](/es/nodejs/api/child_process#child_processexeccommand-options-callback), su valor será el nombre del shell en el que se inicia el proceso hijo.

### `subprocess.stderr` {#subprocessstderr}

**Agregado en: v0.1.90**

- [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Un `Readable Stream` que representa el `stderr` del proceso hijo.

Si el proceso hijo se generó con `stdio[2]` establecido en algo que no sea `'pipe'`, entonces esto será `null`.

`subprocess.stderr` es un alias para `subprocess.stdio[2]`. Ambas propiedades se referirán al mismo valor.

La propiedad `subprocess.stderr` puede ser `null` o `undefined` si el proceso hijo no se pudo generar correctamente.


### `subprocess.stdin` {#subprocessstdin}

**Agregado en: v0.1.90**

- [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable) | [\<null\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Undefined_type)

Un `Writable Stream` que representa el `stdin` del proceso hijo.

Si un proceso hijo espera leer toda su entrada, el proceso hijo no continuará hasta que este stream se haya cerrado mediante `end()`.

Si el proceso hijo se generó con `stdio[0]` establecido en algo que no sea `'pipe'`, entonces esto será `null`.

`subprocess.stdin` es un alias para `subprocess.stdio[0]`. Ambas propiedades se referirán al mismo valor.

La propiedad `subprocess.stdin` puede ser `null` o `undefined` si el proceso hijo no pudo generarse correctamente.

### `subprocess.stdio` {#subprocessstdio}

**Agregado en: v0.7.10**

- [\<Array\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array)

Un array disperso de pipes al proceso hijo, que corresponde con las posiciones en la opción [`stdio`](/es/nodejs/api/child_process#optionsstdio) pasada a [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options) que se han establecido en el valor `'pipe'`. `subprocess.stdio[0]`, `subprocess.stdio[1]` y `subprocess.stdio[2]` también están disponibles como `subprocess.stdin`, `subprocess.stdout` y `subprocess.stderr`, respectivamente.

En el siguiente ejemplo, solo el fd `1` (stdout) del hijo se configura como un pipe, por lo que solo el `subprocess.stdio[1]` del padre es un stream, todos los demás valores en el array son `null`.

::: code-group
```js [CJS]
const assert = require('node:assert');
const fs = require('node:fs');
const child_process = require('node:child_process');

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```

```js [ESM]
import assert from 'node:assert';
import fs from 'node:fs';
import child_process from 'node:child_process';

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```
:::

La propiedad `subprocess.stdio` puede ser `undefined` si el proceso hijo no pudo generarse correctamente.


### `subprocess.stdout` {#subprocessstdout}

**Agregado en: v0.1.90**

- [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Un `Readable Stream` que representa el `stdout` del proceso hijo.

Si el proceso hijo se generó con `stdio[1]` establecido en algo diferente a `'pipe'`, entonces esto será `null`.

`subprocess.stdout` es un alias para `subprocess.stdio[1]`. Ambas propiedades se referirán al mismo valor.



::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```
:::

La propiedad `subprocess.stdout` puede ser `null` o `undefined` si el proceso hijo no pudo generarse correctamente.

### `subprocess.unref()` {#subprocessunref}

**Agregado en: v0.7.10**

De forma predeterminada, el proceso padre esperará a que el proceso hijo separado se cierre. Para evitar que el proceso padre espere a que un `subprocess` dado se cierre, utilice el método `subprocess.unref()`. Hacerlo hará que el bucle de eventos del padre no incluya el proceso hijo en su conteo de referencias, lo que permite que el padre se cierre independientemente del hijo, a menos que haya un canal IPC establecido entre el hijo y los procesos padre.



::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::


## `maxBuffer` y Unicode {#maxbuffer-and-unicode}

La opción `maxBuffer` especifica el número máximo de bytes permitidos en `stdout` o `stderr`. Si se excede este valor, el proceso hijo se termina. Esto afecta a la salida que incluye codificaciones de caracteres multibyte como UTF-8 o UTF-16. Por ejemplo, `console.log('中文测试')` enviará 13 bytes codificados en UTF-8 a `stdout` aunque solo haya 4 caracteres.

## Requisitos del shell {#shell-requirements}

El shell debe entender el modificador `-c`. Si el shell es `'cmd.exe'`, debe entender los modificadores `/d /s /c` y el análisis de la línea de comandos debe ser compatible.

## Shell predeterminado de Windows {#default-windows-shell}

Aunque Microsoft especifica que `%COMSPEC%` debe contener la ruta a `'cmd.exe'` en el entorno raíz, los procesos hijos no siempre están sujetos al mismo requisito. Por lo tanto, en las funciones `child_process` donde se puede generar un shell, `'cmd.exe'` se utiliza como alternativa si `process.env.ComSpec` no está disponible.

## Serialización avanzada {#advanced-serialization}

**Añadido en: v13.2.0, v12.16.0**

Los procesos hijos admiten un mecanismo de serialización para IPC que se basa en la [API de serialización del módulo `node:v8`](/es/nodejs/api/v8#serialization-api), basada en el [algoritmo de clonación estructurada HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). Esto es generalmente más potente y admite más tipos de objetos JavaScript incorporados, como `BigInt`, `Map` y `Set`, `ArrayBuffer` y `TypedArray`, `Buffer`, `Error`, `RegExp`, etc.

Sin embargo, este formato no es un superconjunto completo de JSON, y, por ejemplo, las propiedades establecidas en objetos de tales tipos incorporados no se pasarán a través del paso de serialización. Además, el rendimiento puede no ser equivalente al de JSON, dependiendo de la estructura de los datos pasados. Por lo tanto, esta característica requiere optar por ella configurando la opción `serialization` a `'advanced'` al llamar a [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options) o [`child_process.fork()`](/es/nodejs/api/child_process#child_processforkmodulepath-args-options).

