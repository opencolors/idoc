---
title: Guía del depurador de Node.js
description: Una guía completa sobre cómo usar el depurador integrado en Node.js, detallando comandos, uso y técnicas de depuración.
head:
  - - meta
    - name: og:title
      content: Guía del depurador de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Una guía completa sobre cómo usar el depurador integrado en Node.js, detallando comandos, uso y técnicas de depuración.
  - - meta
    - name: twitter:title
      content: Guía del depurador de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Una guía completa sobre cómo usar el depurador integrado en Node.js, detallando comandos, uso y técnicas de depuración.
---


# Depurador {#debugger}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Node.js incluye una utilidad de depuración de línea de comandos. El cliente de depuración de Node.js no es un depurador con todas las funciones, pero es posible la inspección y el paso simple.

Para usarlo, inicie Node.js con el argumento `inspect` seguido de la ruta al script a depurar.

```bash [BASH]
$ node inspect myscript.js
< Depurador escuchando en ws://127.0.0.1:9229/621111f9-ffcb-4e82-b718-48a145fa5db8
< Para obtener ayuda, consulte: https://nodejs.org/en/docs/inspector
<
conectando a 127.0.0.1:9229 ... ok
< Depurador adjunto.
<
 ok
Punto de interrupción al inicio en myscript.js:2
  1 // myscript.js
> 2 global.x = 5;
  3 setTimeout(() => {
  4   debugger;
debug>
```
El depurador se detiene automáticamente en la primera línea ejecutable. Para ejecutar en su lugar hasta el primer punto de interrupción (especificado por una declaración [`debugger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger)), establezca la variable de entorno `NODE_INSPECT_RESUME_ON_START` en `1`.

```bash [BASH]
$ cat myscript.js
// myscript.js
global.x = 5;
setTimeout(() => {
  debugger;
  console.log('world');
}, 1000);
console.log('hello');
$ NODE_INSPECT_RESUME_ON_START=1 node inspect myscript.js
< Depurador escuchando en ws://127.0.0.1:9229/f1ed133e-7876-495b-83ae-c32c6fc319c2
< Para obtener ayuda, consulte: https://nodejs.org/en/docs/inspector
<
conectando a 127.0.0.1:9229 ... ok
< Depurador adjunto.
<
< hello
<
punto de interrupción en myscript.js:4
  2 global.x = 5;
  3 setTimeout(() => {
> 4   debugger;
  5   console.log('world');
  6 }, 1000);
debug> next
punto de interrupción en myscript.js:5
  3 setTimeout(() => {
  4   debugger;
> 5   console.log('world');
  6 }, 1000);
  7 console.log('hello');
debug> repl
Presione Ctrl+C para salir del repl de depuración
> x
5
> 2 + 2
4
debug> next
< world
<
punto de interrupción en myscript.js:6
  4   debugger;
  5   console.log('world');
> 6 }, 1000);
  7 console.log('hello');
  8
debug> .exit
$
```
El comando `repl` permite que el código se evalúe de forma remota. El comando `next` avanza a la siguiente línea. Escriba `help` para ver qué otros comandos están disponibles.

Presionar `enter` sin escribir un comando repetirá el comando de depuración anterior.


## Observadores {#watchers}

Es posible observar los valores de expresiones y variables durante la depuración. En cada punto de interrupción, cada expresión de la lista de observadores se evaluará en el contexto actual y se mostrará inmediatamente antes del listado del código fuente del punto de interrupción.

Para empezar a observar una expresión, escriba `watch('mi_expresión')`. El comando `watchers` imprimirá los observadores activos. Para eliminar un observador, escriba `unwatch('mi_expresión')`.

## Referencia de comandos {#command-reference}

### Pasos {#stepping}

- `cont`, `c`: Continuar la ejecución
- `next`, `n`: Paso siguiente
- `step`, `s`: Entrar
- `out`, `o`: Salir
- `pause`: Pausar el código en ejecución (como el botón de pausa en las herramientas de desarrollo)

### Puntos de interrupción {#breakpoints}

- `setBreakpoint()`, `sb()`: Establecer un punto de interrupción en la línea actual
- `setBreakpoint(line)`, `sb(line)`: Establecer un punto de interrupción en una línea específica
- `setBreakpoint('fn()')`, `sb(...)`: Establecer un punto de interrupción en la primera instrucción del cuerpo de la función
- `setBreakpoint('script.js', 1)`, `sb(...)`: Establecer un punto de interrupción en la primera línea de `script.js`
- `setBreakpoint('script.js', 1, 'num < 4')`, `sb(...)`: Establecer un punto de interrupción condicional en la primera línea de `script.js` que solo se detiene cuando `num < 4` se evalúa como `true`
- `clearBreakpoint('script.js', 1)`, `cb(...)`: Eliminar el punto de interrupción en `script.js` en la línea 1

También es posible establecer un punto de interrupción en un archivo (módulo) que aún no se ha cargado:

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/48a5b28a-550c-471b-b5e1-d13dd7165df9
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
Break on start in main.js:1
> 1 const mod = require('./mod.js');
  2 mod.hello();
  3 mod.hello();
debug> setBreakpoint('mod.js', 22)
Warning: script 'mod.js' was not loaded yet.
debug> c
break in mod.js:22
 20 // USE OR OTHER DEALINGS IN THE SOFTWARE.
 21
>22 exports.hello = function() {
 23   return 'hello from module';
 24 };
debug>
```
También es posible establecer un punto de interrupción condicional que solo se detiene cuando una expresión dada se evalúa como `true`:

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/ce24daa8-3816-44d4-b8ab-8273c8a66d35
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
Break on start in main.js:7
  5 }
  6
> 7 addOne(10);
  8 addOne(-1);
  9
debug> setBreakpoint('main.js', 4, 'num < 0')
  1 'use strict';
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
  7 addOne(10);
  8 addOne(-1);
  9
debug> cont
break in main.js:4
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
debug> exec('num')
-1
debug>
```

### Información {#information}

- `backtrace`, `bt`: Imprime el rastreo de la pila del marco de ejecución actual
- `list(5)`: Lista el código fuente del script con un contexto de 5 líneas (5 líneas antes y después)
- `watch(expr)`: Agrega una expresión a la lista de observación
- `unwatch(expr)`: Elimina una expresión de la lista de observación
- `unwatch(index)`: Elimina una expresión en un índice específico de la lista de observación
- `watchers`: Lista todos los observadores y sus valores (listados automáticamente en cada punto de interrupción)
- `repl`: Abre el repl del depurador para la evaluación en el contexto del script de depuración
- `exec expr`, `p expr`: Ejecuta una expresión en el contexto del script de depuración e imprime su valor
- `profile`: Inicia una sesión de creación de perfiles de la CPU
- `profileEnd`: Detiene la sesión actual de creación de perfiles de la CPU
- `profiles`: Lista todas las sesiones completadas de creación de perfiles de la CPU
- `profiles[n].save(filepath = 'node.cpuprofile')`: Guarda la sesión de creación de perfiles de la CPU en el disco como JSON
- `takeHeapSnapshot(filepath = 'node.heapsnapshot')`: Toma una instantánea del montón y la guarda en el disco como JSON

### Control de ejecución {#execution-control}

- `run`: Ejecuta el script (se ejecuta automáticamente al iniciar el depurador)
- `restart`: Reinicia el script
- `kill`: Detiene el script

### Varios {#various}

- `scripts`: Lista todos los scripts cargados
- `version`: Muestra la versión de V8

## Uso avanzado {#advanced-usage}

### Integración del inspector V8 para Node.js {#v8-inspector-integration-for-nodejs}

La integración del inspector V8 permite adjuntar Chrome DevTools a las instancias de Node.js para la depuración y la creación de perfiles. Utiliza el [Protocolo de Chrome DevTools](https://chromedevtools.github.io/devtools-protocol/).

El inspector V8 se puede habilitar pasando el indicador `--inspect` al iniciar una aplicación Node.js. También es posible suministrar un puerto personalizado con ese indicador, por ejemplo, `--inspect=9222` aceptará conexiones DevTools en el puerto 9222.

El uso del indicador `--inspect` ejecutará el código inmediatamente antes de que se conecte el depurador. Esto significa que el código comenzará a ejecutarse antes de que pueda comenzar a depurar, lo que podría no ser ideal si desea depurar desde el principio.

En tales casos, tiene dos alternativas:

Por lo tanto, al decidir entre `--inspect`, `--inspect-wait` y `--inspect-brk`, considere si desea que el código comience a ejecutarse inmediatamente, espere a que se adjunte el depurador antes de la ejecución o interrumpa en la primera línea para la depuración paso a paso.

```bash [BASH]
$ node --inspect index.js
Debugger listening on ws://127.0.0.1:9229/dc9010dd-f8b8-4ac5-a510-c1a114ec7d29
For help, see: https://nodejs.org/en/docs/inspector
```
(En el ejemplo anterior, el UUID dc9010dd-f8b8-4ac5-a510-c1a114ec7d29 al final de la URL se genera sobre la marcha, varía en diferentes sesiones de depuración).

Si el navegador Chrome es anterior a 66.0.3345.0, use `inspector.html` en lugar de `js_app.html` en la URL anterior.

Chrome DevTools aún no admite la depuración de [hilos de trabajo](/es/nodejs/api/worker_threads). [ndb](https://github.com/GoogleChromeLabs/ndb/) se puede utilizar para depurarlos.

