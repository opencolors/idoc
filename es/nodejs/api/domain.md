---
title: Documentación de Node.js - Módulo de Dominio
description: El módulo de Dominio en Node.js proporciona una forma de manejar errores y excepciones en código asíncrono, permitiendo una gestión de errores y operaciones de limpieza más robustas.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Módulo de Dominio | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo de Dominio en Node.js proporciona una forma de manejar errores y excepciones en código asíncrono, permitiendo una gestión de errores y operaciones de limpieza más robustas.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Módulo de Dominio | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo de Dominio en Node.js proporciona una forma de manejar errores y excepciones en código asíncrono, permitiendo una gestión de errores y operaciones de limpieza más robustas.
---


# Dominio {#domain}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v8.8.0 | Cualquier `Promise` creado en contextos de VM ya no tiene una propiedad `.domain`. Sin embargo, sus manejadores todavía se ejecutan en el dominio adecuado, y los `Promise` creados en el contexto principal todavía poseen una propiedad `.domain`. |
| v8.0.0 | Los manejadores para `Promise` ahora se invocan en el dominio en el que se creó la primera promesa de una cadena. |
| v1.4.2 | Obsoleto desde: v1.4.2 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto
:::

**Código fuente:** [lib/domain.js](https://github.com/nodejs/node/blob/v23.5.0/lib/domain.js)

**Este módulo está pendiente de obsolescencia.** Una vez que se haya finalizado una API de reemplazo, este módulo quedará totalmente obsoleto. La mayoría de los desarrolladores **no** deberían tener motivos para usar este módulo. Los usuarios que absolutamente deban tener la funcionalidad que proporcionan los dominios pueden confiar en él por el momento, pero deben esperar tener que migrar a una solución diferente en el futuro.

Los dominios proporcionan una forma de manejar múltiples operaciones de IO diferentes como un solo grupo. Si alguno de los emisores de eventos o devoluciones de llamada registrados en un dominio emite un evento `'error'`, o lanza un error, entonces el objeto de dominio será notificado, en lugar de perder el contexto del error en el manejador `process.on('uncaughtException')`, o causar que el programa se cierre inmediatamente con un código de error.

## Advertencia: ¡No ignore los errores! {#warning-dont-ignore-errors!}

Los manejadores de errores de dominio no son un sustituto para cerrar un proceso cuando ocurre un error.

Por la propia naturaleza de cómo funciona [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) en JavaScript, casi nunca hay una manera de "retomar donde lo dejó" de forma segura, sin filtrar referencias o crear algún otro tipo de estado frágil indefinido.

La forma más segura de responder a un error lanzado es cerrar el proceso. Por supuesto, en un servidor web normal, puede haber muchas conexiones abiertas, y no es razonable cerrarlas abruptamente porque un error fue provocado por otra persona.

El mejor enfoque es enviar una respuesta de error a la solicitud que desencadenó el error, mientras se permite que las otras terminen en su tiempo normal, y dejar de escuchar nuevas solicitudes en ese worker.

De esta manera, el uso de `domain` va de la mano con el módulo cluster, ya que el proceso primario puede bifurcar un nuevo worker cuando un worker encuentra un error. Para los programas de Node.js que escalan a múltiples máquinas, el proxy de terminación o el registro de servicios pueden tomar nota del fallo y reaccionar en consecuencia.

Por ejemplo, esta no es una buena idea:

```js [ESM]
// XXX ¡ADVERTENCIA! ¡MALA IDEA!

const d = require('node:domain').create();
d.on('error', (er) => {
  // El error no bloqueará el proceso, ¡pero lo que hace es peor!
  // Aunque hemos evitado el reinicio abrupto del proceso, estamos filtrando
  // una gran cantidad de recursos si esto alguna vez sucede.
  // ¡Esto no es mejor que process.on('uncaughtException')!
  console.log(`error, but oh well ${er.message}`);
});
d.run(() => {
  require('node:http').createServer((req, res) => {
    handleRequest(req, res);
  }).listen(PORT);
});
```
Al usar el contexto de un dominio y la resiliencia de separar nuestro programa en múltiples procesos worker, podemos reaccionar de manera más apropiada y manejar los errores con mucha mayor seguridad.

```js [ESM]
// ¡Mucho mejor!

const cluster = require('node:cluster');
const PORT = +process.env.PORT || 1337;

if (cluster.isPrimary) {
  // Un escenario más realista tendría más de 2 workers,
  // y tal vez no poner el primario y el worker en el mismo archivo.
  //
  // También es posible ser un poco más elegante con el registro, y
  // implementar cualquier lógica personalizada necesaria para prevenir DoS
  // ataques y otro mal comportamiento.
  //
  // Consulte las opciones en la documentación del cluster.
  //
  // Lo importante es que el primario haga muy poco,
  // aumentando nuestra resiliencia a errores inesperados.

  cluster.fork();
  cluster.fork();

  cluster.on('disconnect', (worker) => {
    console.error('disconnect!');
    cluster.fork();
  });

} else {
  // el worker
  //
  // ¡Aquí es donde ponemos nuestros errores!

  const domain = require('node:domain');

  // Consulte la documentación del cluster para obtener más detalles sobre el uso de
  // procesos worker para servir solicitudes. Cómo funciona, advertencias, etc.

  const server = require('node:http').createServer((req, res) => {
    const d = domain.create();
    d.on('error', (er) => {
      console.error(`error ${er.stack}`);

      // ¡Estamos en territorio peligroso!
      // Por definición, ocurrió algo inesperado,
      // que probablemente no queríamos.
      // ¡Cualquier cosa puede pasar ahora! ¡Ten mucho cuidado!

      try {
        // Asegúrese de que cerremos dentro de 30 segundos
        const killtimer = setTimeout(() => {
          process.exit(1);
        }, 30000);
        // ¡Pero no mantenga el proceso abierto solo para eso!
        killtimer.unref();

        // Deje de aceptar nuevas solicitudes.
        server.close();

        // Hágale saber al primario que estamos muertos. Esto activará un
        // 'disconnect' en el primario del cluster, y luego bifurcará
        // un nuevo worker.
        cluster.worker.disconnect();

        // Intente enviar un error a la solicitud que desencadenó el problema
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('Oops, there was a problem!\n');
      } catch (er2) {
        // Bueno, no hay mucho que podamos hacer en este punto.
        console.error(`Error sending 500! ${er2.stack}`);
      }
    });

    // Debido a que req y res se crearon antes de que existiera este dominio,
    // necesitamos agregarlos explícitamente.
    // Vea la explicación del enlace implícito vs explícito a continuación.
    d.add(req);
    d.add(res);

    // Ahora ejecute la función de manejador en el dominio.
    d.run(() => {
      handleRequest(req, res);
    });
  });
  server.listen(PORT);
}

// Esta parte no es importante. Solo un ejemplo de enrutamiento.
// Ponga la lógica de aplicación elegante aquí.
function handleRequest(req, res) {
  switch (req.url) {
    case '/error':
      // Hacemos algunas cosas asíncronas, y luego...
      setTimeout(() => {
        // ¡Ups!
        flerb.bark();
      }, timeout);
      break;
    default:
      res.end('ok');
  }
}
```

## Adiciones a los objetos `Error` {#additions-to-error-objects}

Cada vez que un objeto `Error` se enruta a través de un dominio, se le añaden algunos campos extra.

- `error.domain`: El dominio que manejó el error por primera vez.
- `error.domainEmitter`: El emisor de eventos que emitió un evento `'error'` con el objeto de error.
- `error.domainBound`: La función de callback que se vinculó al dominio y a la que se le pasó un error como primer argumento.
- `error.domainThrown`: Un booleano que indica si el error fue lanzado, emitido o pasado a una función de callback vinculada.

## Vinculación implícita {#implicit-binding}

Si los dominios están en uso, entonces todos los objetos `EventEmitter` **nuevos** (incluidos los objetos Stream, las solicitudes, las respuestas, etc.) se vincularán implícitamente al dominio activo en el momento de su creación.

Además, los callbacks pasados a las solicitudes de bucle de eventos de bajo nivel (como a `fs.open()` u otros métodos que toman callbacks) se vincularán automáticamente al dominio activo. Si lanzan una excepción, el dominio capturará el error.

Para evitar el uso excesivo de memoria, los objetos `Domain` en sí mismos no se añaden implícitamente como hijos del dominio activo. Si lo hicieran, sería demasiado fácil evitar que los objetos de solicitud y respuesta se recolectaran correctamente como basura.

Para anidar objetos `Domain` como hijos de un `Domain` padre, deben añadirse explícitamente.

La vinculación implícita enruta los errores lanzados y los eventos `'error'` al evento `'error'` del `Domain`, pero no registra el `EventEmitter` en el `Domain`. La vinculación implícita solo se ocupa de los errores lanzados y los eventos `'error'`.

## Vinculación explícita {#explicit-binding}

A veces, el dominio en uso no es el que debería utilizarse para un emisor de eventos específico. O, el emisor de eventos podría haberse creado en el contexto de un dominio, pero debería enlazarse a algún otro dominio.

Por ejemplo, podría haber un dominio en uso para un servidor HTTP, pero tal vez nos gustaría tener un dominio separado para cada solicitud.

Eso es posible a través de la vinculación explícita.

```js [ESM]
// Crear un dominio de nivel superior para el servidor
const domain = require('node:domain');
const http = require('node:http');
const serverDomain = domain.create();

serverDomain.run(() => {
  // El servidor se crea en el ámbito de serverDomain
  http.createServer((req, res) => {
    // Req y res también se crean en el ámbito de serverDomain
    // sin embargo, preferiríamos tener un dominio separado para cada solicitud.
    // créelo primero y añada req y res a él.
    const reqd = domain.create();
    reqd.add(req);
    reqd.add(res);
    reqd.on('error', (er) => {
      console.error('Error', er, req.url);
      try {
        res.writeHead(500);
        res.end('Error occurred, sorry.');
      } catch (er2) {
        console.error('Error sending 500', er2, req.url);
      }
    });
  }).listen(1337);
});
```

## `domain.create()` {#domaincreate}

- Devuelve: [\<Domain\>](/es/nodejs/api/domain#class-domain)

## Clase: `Domain` {#class-domain}

- Extiende: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

La clase `Domain` encapsula la funcionalidad de enrutar errores y excepciones no detectadas al objeto `Domain` activo.

Para manejar los errores que detecta, escuche su evento `'error'`.

### `domain.members` {#domainmembers}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Un array de temporizadores y emisores de eventos que se han agregado explícitamente al dominio.

### `domain.add(emitter)` {#domainaddemitter}

- `emitter` [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter) | [\<Timer\>](/es/nodejs/api/timers#timers) emisor o temporizador que se agregará al dominio

Agrega explícitamente un emisor al dominio. Si algún manejador de eventos llamado por el emisor lanza un error, o si el emisor emite un evento `'error'`, se enrutará al evento `'error'` del dominio, al igual que con el enlace implícito.

Esto también funciona con los temporizadores que se devuelven de [`setInterval()`](/es/nodejs/api/timers#setintervalcallback-delay-args) y [`setTimeout()`](/es/nodejs/api/timers#settimeoutcallback-delay-args). Si su función de callback lanza una excepción, será capturada por el manejador `'error'` del dominio.

Si el Timer o `EventEmitter` ya estaba vinculado a un dominio, se elimina de ese y se vincula a este en su lugar.

### `domain.bind(callback)` {#domainbindcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función de callback
- Devuelve: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función vinculada

La función devuelta será un envoltorio alrededor de la función de callback proporcionada. Cuando se llama a la función devuelta, cualquier error que se lance se enrutará al evento `'error'` del dominio.

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.bind((er, data) => {
    // Si esto lanza, también se pasará al dominio.
    return cb(er, data ? JSON.parse(data) : null);
  }));
}

d.on('error', (er) => {
  // Se produjo un error en alguna parte. Si lo lanzamos ahora, se bloqueará el programa
  // con el número de línea normal y el mensaje de la pila.
});
```

### `domain.enter()` {#domainenter}

El método `enter()` es una utilidad utilizada por los métodos `run()`, `bind()` e `intercept()` para establecer el dominio activo. Establece `domain.active` y `process.domain` al dominio, e implícitamente inserta el dominio en la pila de dominios gestionada por el módulo domain (consulta [`domain.exit()`](/es/nodejs/api/domain#domainexit) para obtener detalles sobre la pila de dominios). La llamada a `enter()` delimita el comienzo de una cadena de llamadas asíncronas y operaciones de E/S vinculadas a un dominio.

Llamar a `enter()` solo cambia el dominio activo y no altera el dominio en sí. Se puede llamar a `enter()` y `exit()` un número arbitrario de veces en un solo dominio.

### `domain.exit()` {#domainexit}

El método `exit()` sale del dominio actual, sacándolo de la pila de dominios. Cada vez que la ejecución va a cambiar al contexto de una cadena diferente de llamadas asíncronas, es importante asegurarse de que se salga del dominio actual. La llamada a `exit()` delimita el final o una interrupción de la cadena de llamadas asíncronas y operaciones de E/S vinculadas a un dominio.

Si hay varios dominios anidados vinculados al contexto de ejecución actual, `exit()` saldrá de cualquier dominio anidado dentro de este dominio.

Llamar a `exit()` solo cambia el dominio activo y no altera el dominio en sí. Se puede llamar a `enter()` y `exit()` un número arbitrario de veces en un solo dominio.

### `domain.intercept(callback)` {#domaininterceptcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función de callback
- Devuelve: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función interceptada

Este método es casi idéntico a [`domain.bind(callback)`](/es/nodejs/api/domain#domainbindcallback). Sin embargo, además de capturar errores lanzados, también interceptará objetos [`Error`](/es/nodejs/api/errors#class-error) enviados como el primer argumento a la función.

De esta manera, el patrón común `if (err) return callback(err);` se puede reemplazar con un solo manejador de errores en un solo lugar.

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.intercept((data) => {
    // Note, the first argument is never passed to the
    // callback since it is assumed to be the 'Error' argument
    // and thus intercepted by the domain.

    // If this throws, it will also be passed to the domain
    // so the error-handling logic can be moved to the 'error'
    // event on the domain instead of being repeated throughout
    // the program.
    return cb(null, JSON.parse(data));
  }));
}

d.on('error', (er) => {
  // An error occurred somewhere. If we throw it now, it will crash the program
  // with the normal line number and stack message.
});
```

### `domain.remove(emitter)` {#domainremoveemitter}

- `emitter` [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter) | [\<Timer\>](/es/nodejs/api/timers#timers) emisor o temporizador que se va a eliminar del dominio

Lo opuesto de [`domain.add(emitter)`](/es/nodejs/api/domain#domainaddemitter). Elimina el manejo de dominio del emisor especificado.

### `domain.run(fn[, ...args])` {#domainrunfn-args}

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Ejecuta la función suministrada en el contexto del dominio, vinculando implícitamente todos los emisores de eventos, temporizadores y solicitudes de bajo nivel que se crean en ese contexto. Opcionalmente, se pueden pasar argumentos a la función.

Esta es la forma más básica de usar un dominio.

```js [ESM]
const domain = require('node:domain');
const fs = require('node:fs');
const d = domain.create();
d.on('error', (er) => {
  console.error('¡Error detectado!', er);
});
d.run(() => {
  process.nextTick(() => {
    setTimeout(() => { // Simulación de algunas cosas asíncronas varias
      fs.open('archivo no existente', 'r', (er, fd) => {
        if (er) throw er;
        // continuar...
      });
    }, 100);
  });
});
```
En este ejemplo, se activará el controlador `d.on('error')`, en lugar de bloquear el programa.

## Dominios y promesas {#domains-and-promises}

A partir de Node.js 8.0.0, los controladores de promesas se ejecutan dentro del dominio en el que se realizó la propia llamada a `.then()` o `.catch()`:

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then((v) => {
    // ejecutándose en d2
  });
});
```
Se puede vincular una retrollamada a un dominio específico utilizando [`domain.bind(callback)`](/es/nodejs/api/domain#domainbindcallback):

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then(p.domain.bind((v) => {
    // ejecutándose en d1
  }));
});
```
Los dominios no interferirán con los mecanismos de manejo de errores para las promesas. En otras palabras, no se emitirá ningún evento `'error'` para los rechazos `Promise` no manejados.

