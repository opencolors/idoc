---
title: Emissor de Eventos do Node.js
description: Saiba mais sobre o emissor de eventos do Node.js, uma ferramenta poderosa para lidar com eventos em suas aplicações backend.
head:
  - - meta
    - name: og:title
      content: Emissor de Eventos do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba mais sobre o emissor de eventos do Node.js, uma ferramenta poderosa para lidar com eventos em suas aplicações backend.
  - - meta
    - name: twitter:title
      content: Emissor de Eventos do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba mais sobre o emissor de eventos do Node.js, uma ferramenta poderosa para lidar com eventos em suas aplicações backend.
---


# O Emissor de Eventos do Node.js

Se você trabalhou com JavaScript no navegador, sabe o quanto da interação do usuário é tratada por meio de eventos: cliques do mouse, pressionamentos de botões do teclado, reação aos movimentos do mouse e assim por diante.

No lado do backend, o Node.js nos oferece a opção de construir um sistema similar usando o **[módulo events](/pt/nodejs/api/events)**.

Este módulo, em particular, oferece a classe EventEmitter, que usaremos para lidar com nossos eventos.

Você a inicializa usando

```js
import EventEmitter from 'node:events';
const eventEmitter = new EventEmitter();
```

Este objeto expõe, entre muitos outros, os métodos `on` e `emit`.

- `emit` é usado para disparar um evento
- `on` é usado para adicionar uma função de callback que será executada quando o evento for disparado

Por exemplo, vamos criar um evento `start` e, como forma de fornecer um exemplo, reagimos a ele apenas registrando no console:

```js
eventEmitter.on('start', () => {
  console.log('started');
});
```

Quando executamos

```js
eventEmitter.emit('start');
```

a função de tratamento de eventos é disparada e obtemos o log no console.

Você pode passar argumentos para o manipulador de eventos, passando-os como argumentos adicionais para `emit()`:

```js
eventEmitter.on('start', number => {
  console.log(`started ${number}`);
});
eventEmitter.emit('start', 23);
```

Múltiplos argumentos:

```js
eventEmitter.on('start', (start, end) => {
  console.log(`started from ${start} to ${end}`);
});
eventEmitter.emit('start', 1, 100);
```

O objeto EventEmitter também expõe vários outros métodos para interagir com eventos, como

- `once()`: adiciona um listener de tempo único
- `removeListener()` / `off()`: remove um listener de evento de um evento
- `removeAllListeners()`: remove todos os listeners para um evento

Você pode ler mais sobre esses métodos na [documentação do módulo events](/pt/nodejs/api/events).

