---
title: Entendiendo el bucle de eventos de Node.js
description: El bucle de eventos es el núcleo de Node.js, permitiendo ejecutar operaciones I/O no bloqueantes. Es un bucle de un solo hilo que descarga operaciones al núcleo del sistema cuando es posible.
head:
  - - meta
    - name: og:title
      content: Entendiendo el bucle de eventos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El bucle de eventos es el núcleo de Node.js, permitiendo ejecutar operaciones I/O no bloqueantes. Es un bucle de un solo hilo que descarga operaciones al núcleo del sistema cuando es posible.
  - - meta
    - name: twitter:title
      content: Entendiendo el bucle de eventos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El bucle de eventos es el núcleo de Node.js, permitiendo ejecutar operaciones I/O no bloqueantes. Es un bucle de un solo hilo que descarga operaciones al núcleo del sistema cuando es posible.
---


# El Bucle de Eventos de Node.js

## ¿Qué es el Bucle de Eventos?

El bucle de eventos es lo que permite a Node.js realizar operaciones de E/S no bloqueantes, a pesar del hecho de que un solo hilo de JavaScript se utiliza por defecto, al descargar las operaciones al kernel del sistema siempre que sea posible.

Dado que la mayoría de los kernels modernos son multi-hilo, pueden manejar múltiples operaciones ejecutándose en segundo plano. Cuando una de estas operaciones se completa, el kernel le dice a Node.js para que la devolución de llamada apropiada pueda ser añadida a la cola de votación para ser eventualmente ejecutada. Explicaremos esto con más detalle más adelante en este tema.

## El Bucle de Eventos Explicado

Cuando Node.js se inicia, inicializa el bucle de eventos, procesa el script de entrada proporcionado (o entra en el REPL, que no se cubre en este documento) que puede hacer llamadas a la API asíncrona, programar temporizadores, o llamar a process.nextTick(), luego comienza a procesar el bucle de eventos.

El siguiente diagrama muestra una visión general simplificada del orden de las operaciones del bucle de eventos.

```bash
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

::: tip
Cada caja se referirá como una "fase" del bucle de eventos.
:::

Cada fase tiene una cola FIFO de devoluciones de llamada para ejecutar. Si bien cada fase es especial a su manera, generalmente, cuando el bucle de eventos entra en una fase dada, realizará cualquier operación específica de esa fase, luego ejecutará las devoluciones de llamada en la cola de esa fase hasta que la cola se haya agotado o se haya ejecutado el número máximo de devoluciones de llamada. Cuando la cola se ha agotado o se ha alcanzado el límite de devoluciones de llamada, el bucle de eventos se moverá a la siguiente fase, y así sucesivamente.

Dado que cualquiera de estas operaciones puede programar más operaciones y los nuevos eventos procesados en la fase de **votación** son encolados por el kernel, los eventos de votación pueden ser encolados mientras los eventos de votación están siendo procesados. Como resultado, las devoluciones de llamada de larga duración pueden permitir que la fase de votación se ejecute mucho más tiempo que el umbral de un temporizador. Consulte las secciones de temporizadores y votación para obtener más detalles.

::: tip
Existe una ligera discrepancia entre la implementación de Windows y la de Unix/Linux, pero eso no es importante para esta demostración. Las partes más importantes están aquí. En realidad, hay siete u ocho pasos, pero los que nos importan, los que Node.js realmente usa, son los anteriores.
:::


## Descripción general de las fases
- **timers**: esta fase ejecuta las devoluciones de llamada programadas por `setTimeout()` y `setInterval()`.
- **pending callbacks**: ejecuta las devoluciones de llamada de E/S diferidas a la siguiente iteración del bucle.
- **idle, prepare**: solo se utiliza internamente.
- **poll**: recupera nuevos eventos de E/S; ejecuta devoluciones de llamada relacionadas con la E/S (casi todas, con la excepción de las devoluciones de llamada de cierre, las programadas por temporizadores y `setImmediate()`); el nodo se bloqueará aquí cuando corresponda.
- **check**: aquí se invocan las devoluciones de llamada de `setImmediate()`.
- **close callbacks**: algunas devoluciones de llamada de cierre, por ejemplo, `socket.on('close', ...)`.

Entre cada ejecución del bucle de eventos, Node.js comprueba si está esperando alguna E/S o temporizadores asíncronos y se apaga limpiamente si no hay ninguno.

## Fases en detalle

### timers

Un temporizador especifica el **umbral** después del cual se puede ejecutar una devolución de llamada proporcionada en lugar del tiempo **exacto** en que una persona *quiere que se ejecute*. Las devoluciones de llamada de los temporizadores se ejecutarán tan pronto como se puedan programar después de que haya transcurrido la cantidad de tiempo especificada; sin embargo, la programación del sistema operativo o la ejecución de otras devoluciones de llamada pueden retrasarlas.

::: tip
Técnicamente, la fase [poll](/es/nodejs/guide/nodejs-event-loop#poll) controla cuándo se ejecutan los temporizadores.
:::

Por ejemplo, digamos que programa un tiempo de espera para que se ejecute después de un umbral de 100 ms, luego su script comienza a leer asíncronamente un archivo que tarda 95 ms:

```js
const fs = require('node:fs');
function someAsyncOperation(callback) {
  // Supongamos que esto tarda 95 ms en completarse
  fs.readFile('/path/to/file', callback);
}
const timeoutScheduled = Date.now();
setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;
  console.log(`${delay}ms have passed since I was scheduled`);
}, 100);
// do someAsyncOperation which takes 95 ms to complete
someAsyncOperation(() => {
  const startCallback = Date.now();
  // do something that will take 10ms...
  while (Date.now() - startCallback < 10) {
    // do nothing
  }
});
```

Cuando el bucle de eventos entra en la fase **poll**, tiene una cola vacía (`fs.readFile()` no se ha completado), por lo que esperará la cantidad de ms restantes hasta que se alcance el umbral del temporizador más próximo. Mientras espera, pasan 95 ms, `fs.readFile()` termina de leer el archivo y su devolución de llamada que tarda 10 ms en completarse se agrega a la cola de la fase poll y se ejecuta. Cuando la devolución de llamada termina, no hay más devoluciones de llamada en la cola, por lo que el bucle de eventos verá que se ha alcanzado el umbral del temporizador más próximo y luego volverá a la fase de temporizadores para ejecutar la devolución de llamada del temporizador. En este ejemplo, verá que el retraso total entre la programación del temporizador y la ejecución de su devolución de llamada será de 105 ms.

::: tip
Para evitar que la fase poll prive de recursos al bucle de eventos, [libuv](https://libuv.org/) (la biblioteca C que implementa el bucle de eventos de Node.js y todos los comportamientos asíncronos de la plataforma) también tiene un máximo estricto (dependiente del sistema) antes de que deje de buscar más eventos.
:::


## callbacks pendientes
Esta fase ejecuta callbacks para algunas operaciones del sistema, como tipos de errores de TCP. Por ejemplo, si un socket TCP recibe `ECONNREFUSED` al intentar conectarse, algunos sistemas *nix quieren esperar para informar del error. Esto se pondrá en cola para ejecutarse en la fase de **callbacks pendientes**.

### poll (encuesta)

La fase de **poll (encuesta)** tiene dos funciones principales:

1. Calcular cuánto tiempo debe bloquearse y sondear para E/S, luego
2. Procesar eventos en la cola de **poll (encuesta)**.

Cuando el bucle de eventos entra en la fase de **poll (encuesta)** y no hay temporizadores programados, sucederá una de dos cosas:

- Si la cola de ***poll (encuesta)*** ***no está vacía***, el bucle de eventos iterará a través de su cola de callbacks ejecutándolos sincrónicamente hasta que la cola se haya agotado o se haya alcanzado el límite estricto dependiente del sistema.

- Si la cola de ***poll (encuesta)*** ***está vacía***, sucederá una de dos cosas más:

    - Si los scripts han sido programados por `setImmediate()`, el bucle de eventos finalizará la fase de **poll (encuesta)** y continuará a la fase de check (verificación) para ejecutar esos scripts programados.

    - Si los scripts **no han** sido programados por `setImmediate()`, el bucle de eventos esperará a que se agreguen callbacks a la cola y luego los ejecutará inmediatamente.

Una vez que la cola de **poll (encuesta)** está vacía, el bucle de eventos verificará si hay temporizadores *cuyos umbrales de tiempo* se hayan alcanzado. Si uno o más temporizadores están listos, el bucle de eventos volverá a la fase de **temporizadores** para ejecutar los callbacks de esos temporizadores.

### check (verificación)

Esta fase permite a una persona ejecutar callbacks inmediatamente después de que se haya completado la fase de **poll (encuesta)**. Si la fase de **poll (encuesta)** se vuelve inactiva y se han puesto en cola scripts con `setImmediate()`, el bucle de eventos puede continuar a la fase de check (verificación) en lugar de esperar.

`setImmediate()` es en realidad un temporizador especial que se ejecuta en una fase separada del bucle de eventos. Utiliza una API de libuv que programa callbacks para que se ejecuten después de que se haya completado la fase de **poll (encuesta)**.

Generalmente, a medida que se ejecuta el código, el bucle de eventos eventualmente llegará a la fase de **poll (encuesta)** donde esperará una conexión entrante, solicitud, etc. Sin embargo, si se ha programado un callback con `setImmediate()` y la fase de **poll (encuesta)** se vuelve inactiva, terminará y continuará a la fase de **check (verificación)** en lugar de esperar los eventos de **poll (encuesta)**.


### devoluciones de llamada de cierre

Si un socket o un manejador se cierra abruptamente (p. ej., `socket.destroy()`), el evento `'close'` se emitirá en esta fase. De lo contrario, se emitirá a través de `process.nextTick()`.

## `setImmediate()` vs `setTimeout()`

`setImmediate()` y `setTimeout()` son similares, pero se comportan de maneras diferentes dependiendo de cuándo se les llama.

- `setImmediate()` está diseñado para ejecutar un script una vez que se completa la fase de **sondeo** actual.
- `setTimeout()` programa un script para que se ejecute después de que haya transcurrido un umbral mínimo en ms.

El orden en el que se ejecutan los temporizadores variará dependiendo del contexto en el que se les llama. Si ambos se llaman desde dentro del módulo principal, entonces la temporización estará limitada por el rendimiento del proceso (que puede verse afectado por otras aplicaciones que se ejecutan en la máquina).

Por ejemplo, si ejecutamos el siguiente script que no está dentro de un ciclo de E/S (es decir, el módulo principal), el orden en el que se ejecutan los dos temporizadores no es determinista, ya que está limitado por el rendimiento del proceso:

::: code-group

```js [JS]
// timeout_vs_immediate.js
setTimeout(() => {
  console.log('timeout');
}, 0);
setImmediate(() => {
  console.log('immediate');
});
```

```bash [BASH]
$ node timeout_vs_immediate.js
timeout
immediate
$ node timeout_vs_immediate.js
immediate
timeout
```

:::

Sin embargo, si mueve las dos llamadas dentro de un ciclo de E/S, la devolución de llamada inmediata siempre se ejecuta primero:

::: code-group

```js [JS]
// timeout_vs_immediate.js
const fs = require('node:fs');
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```

```bash [BASH]
$ node timeout_vs_immediate.js
immediate
timeout
$ node timeout_vs_immediate.js
immediate
timeout
```

:::

La principal ventaja de usar `setImmediate()` sobre `setTimeout()` es que `setImmediate()` siempre se ejecutará antes que cualquier temporizador si se programa dentro de un ciclo de E/S, independientemente de cuántos temporizadores estén presentes.


## `process.nextTick()`

### Entendiendo `process.nextTick()`

Es posible que haya notado que `process.nextTick()` no se mostró en el diagrama, aunque es parte de la API asíncrona. Esto se debe a que `process.nextTick()` no es técnicamente parte del bucle de eventos. En cambio, la `nextTickQueue` se procesará después de que se complete la operación actual, independientemente de la fase actual del bucle de eventos. Aquí, una operación se define como una transición desde el controlador C/C++ subyacente y el manejo del JavaScript que necesita ser ejecutado.

Volviendo a nuestro diagrama, cada vez que llama a `process.nextTick()` en una fase dada, todas las devoluciones de llamada pasadas a `process.nextTick()` se resolverán antes de que continúe el bucle de eventos. Esto puede crear algunas situaciones malas porque **le permite "matar de hambre" a su E/S haciendo llamadas recursivas a** `process.nextTick()`, lo que evita que el bucle de eventos alcance la fase de **sondeo**.

### ¿Por qué se permitiría eso?

¿Por qué algo como esto se incluiría en Node.js? Parte de esto es una filosofía de diseño donde una API siempre debe ser asíncrona incluso cuando no tiene que serlo. Tome este fragmento de código como ejemplo:

```js
function apiCall(arg, callback) {
  if (typeof arg !== 'string')
    return process.nextTick(
      callback,
      new TypeError('argument should be string')
    );
}
```

El fragmento realiza una verificación de argumentos y, si no es correcto, pasará el error a la devolución de llamada. La API se actualizó hace relativamente poco para permitir el paso de argumentos a `process.nextTick()`, lo que le permite tomar cualquier argumento pasado después de la devolución de llamada para que se propague como los argumentos a la devolución de llamada, de modo que no tenga que anidar funciones.

Lo que estamos haciendo es devolver un error al usuario, pero solo después de que hayamos permitido que se ejecute el resto del código del usuario. Al usar `process.nextTick()` garantizamos que `apiCall()` siempre ejecuta su devolución de llamada después del resto del código del usuario y antes de que se permita que continúe el bucle de eventos. Para lograr esto, se permite que la pila de llamadas JS se desenrolle y luego ejecute inmediatamente la devolución de llamada proporcionada, lo que permite a una persona realizar llamadas recursivas a `process.nextTick()` sin alcanzar un `RangeError: Maximum call stack size exceeded from v8`.

Esta filosofía puede llevar a algunas situaciones potencialmente problemáticas. Tome este fragmento como ejemplo:

```js
let bar;
// this has an asynchronous signature, but calls callback synchronously
function someAsyncApiCall(callback) {
  callback();
}
// the callback is called before `someAsyncApiCall` completes.
someAsyncApiCall(() => {
  // since someAsyncApiCall hasn't completed, bar hasn't been assigned any value
  console.log('bar', bar); // undefined
});
bar = 1;
```

El usuario define `someAsyncApiCall()` para que tenga una firma asíncrona, pero en realidad opera de forma síncrona. Cuando se llama, la devolución de llamada proporcionada a `someAsyncApiCall()` se llama en la misma fase del bucle de eventos porque `someAsyncApiCall()` en realidad no hace nada de forma asíncrona. Como resultado, la devolución de llamada intenta hacer referencia a bar aunque es posible que aún no tenga esa variable en el alcance, porque el script no ha podido ejecutarse hasta su finalización.

Al colocar la devolución de llamada en un `process.nextTick()`, el script todavía tiene la capacidad de ejecutarse hasta su finalización, lo que permite que todas las variables, funciones, etc., se inicialicen antes de que se llame a la devolución de llamada. También tiene la ventaja de no permitir que el bucle de eventos continúe. Puede ser útil para el usuario ser alertado de un error antes de que se permita que el bucle de eventos continúe. Aquí está el ejemplo anterior usando `process.nextTick()`:

```js
let bar;
function someAsyncApiCall(callback) {
  process.nextTick(callback);
}
someAsyncApiCall(() => {
  console.log('bar', bar); // 1
});
bar = 1;
```

Aquí hay otro ejemplo del mundo real:

```js
const server = net.createServer(() => {}).listen(8080);
server.on('listening', () => {});
```

Cuando solo se pasa un puerto, el puerto se enlaza inmediatamente. Por lo tanto, la devolución de llamada `'listening'` podría llamarse inmediatamente. El problema es que la devolución de llamada `.on('listening')` no se habrá establecido para ese momento.

Para evitar esto, el evento `'listening'` se pone en cola en un `nextTick()` para permitir que el script se ejecute hasta su finalización. Esto permite al usuario establecer los controladores de eventos que desee.


## `process.nextTick()` vs `setImmediate()`

Tenemos dos llamadas que son similares en lo que respecta a los usuarios, pero sus nombres son confusos.

- `process.nextTick()` se dispara inmediatamente en la misma fase
- `setImmediate()` se dispara en la siguiente iteración o `'tick'` del bucle de eventos

En esencia, los nombres deberían intercambiarse. `process.nextTick()` se dispara más inmediatamente que `setImmediate()`, pero esto es un artefacto del pasado que es poco probable que cambie. Realizar este cambio rompería un gran porcentaje de los paquetes en npm. Cada día se añaden más módulos nuevos, lo que significa que cada día que esperamos, se producen más roturas potenciales. Aunque son confusos, los nombres en sí mismos no cambiarán.

::: tip
Recomendamos a los desarrolladores que utilicen `setImmediate()` en todos los casos porque es más fácil razonar sobre ello.
:::

## ¿Por qué usar `process.nextTick()`?

Hay dos razones principales:

1. Permitir a los usuarios gestionar los errores, limpiar los recursos innecesarios o quizás intentar la solicitud de nuevo antes de que continúe el bucle de eventos.

2. A veces es necesario permitir que una retrollamada se ejecute después de que la pila de llamadas se haya desenrollado pero antes de que continúe el bucle de eventos.

Un ejemplo es para coincidir con las expectativas del usuario. Ejemplo sencillo:

```js
const server = net.createServer();
server.on('connection', conn => {});
server.listen(8080);
server.on('listening', () => {});
```

Digamos que `listen()` se ejecuta al principio del bucle de eventos, pero la retrollamada de escucha se coloca en un `setImmediate()`. A menos que se pase un nombre de host, la vinculación al puerto se producirá inmediatamente. Para que el bucle de eventos continúe, debe llegar a la fase de sondeo, lo que significa que hay una probabilidad no nula de que se haya recibido una conexión permitiendo que el evento de conexión se dispare antes del evento de escucha.

Otro ejemplo es extender un `EventEmitter` y emitir un evento desde dentro del constructor:

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    this.emit('event');
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```

No se puede emitir un evento desde el constructor inmediatamente porque el script no habrá procesado hasta el punto en que el usuario asigne una retrollamada a ese evento. Por lo tanto, dentro del propio constructor, se puede usar `process.nextTick()` para establecer una retrollamada para emitir el evento después de que el constructor haya terminado, lo que proporciona los resultados esperados:

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    // use nextTick to emit the event once a handler is assigned
    process.nextTick(() => {
      this.emit('event');
    });
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```
