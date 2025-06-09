---
title: Emisor de eventos de Node.js
description: Aprenda sobre el emisor de eventos de Node.js, una herramienta poderosa para manejar eventos en sus aplicaciones backend.
head:
  - - meta
    - name: og:title
      content: Emisor de eventos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda sobre el emisor de eventos de Node.js, una herramienta poderosa para manejar eventos en sus aplicaciones backend.
  - - meta
    - name: twitter:title
      content: Emisor de eventos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda sobre el emisor de eventos de Node.js, una herramienta poderosa para manejar eventos en sus aplicaciones backend.
---


# El emisor de eventos de Node.js

Si has trabajado con JavaScript en el navegador, sabes que gran parte de la interacción del usuario se gestiona a través de eventos: clics del ratón, pulsaciones de botones del teclado, reacción a los movimientos del ratón, etc.

En el lado del backend, Node.js nos ofrece la opción de construir un sistema similar utilizando el **[módulo events](/es/nodejs/api/events)**.

Este módulo, en particular, ofrece la clase EventEmitter, que utilizaremos para gestionar nuestros eventos.

Lo inicializas usando

```js
import EventEmitter from 'node:events';
const eventEmitter = new EventEmitter();
```

Este objeto expone, entre muchos otros, los métodos `on` y `emit`.

- `emit` se utiliza para disparar un evento
- `on` se utiliza para añadir una función de callback que se ejecutará cuando se dispare el evento

Por ejemplo, creemos un evento `start`, y a modo de ejemplo, reaccionamos a él simplemente registrando en la consola:

```js
eventEmitter.on('start', () => {
  console.log('started');
});
```

Cuando ejecutamos

```js
eventEmitter.emit('start');
```

se dispara la función de controlador de eventos y obtenemos el registro de la consola.

Puedes pasar argumentos al controlador de eventos pasándolos como argumentos adicionales a `emit()`:

```js
eventEmitter.on('start', number => {
  console.log(`started ${number}`);
});
eventEmitter.emit('start', 23);
```

Múltiples argumentos:

```js
eventEmitter.on('start', (start, end) => {
  console.log(`started from ${start} to ${end}`);
});
eventEmitter.emit('start', 1, 100);
```

El objeto EventEmitter también expone varios otros métodos para interactuar con los eventos, como

- `once()`: añade un listener de una sola vez
- `removeListener()` / `off()`: elimina un listener de eventos de un evento
- `removeAllListeners()`: elimina todos los listeners de un evento

Puedes leer más sobre estos métodos en la [documentación del módulo events](/es/nodejs/api/events).

