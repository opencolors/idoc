---
title: Понимание setImmediate() в Node.js
description: Узнайте, как работает setImmediate() в Node.js, его отличия от setTimeout(), process.nextTick() и Promise.then(), а также как он взаимодействует с циклом событий и очередями.
head:
  - - meta
    - name: og:title
      content: Понимание setImmediate() в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как работает setImmediate() в Node.js, его отличия от setTimeout(), process.nextTick() и Promise.then(), а также как он взаимодействует с циклом событий и очередями.
  - - meta
    - name: twitter:title
      content: Понимание setImmediate() в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как работает setImmediate() в Node.js, его отличия от setTimeout(), process.nextTick() и Promise.then(), а также как он взаимодействует с циклом событий и очередями.
---


# Понимание `setImmediate()`

Когда вы хотите выполнить фрагмент кода асинхронно, но как можно скорее, один из вариантов - использовать функцию `setImmediate()`, предоставляемую Node.js:

```js
setImmediate(() => {
    // сделать что-то
})
```

Любая функция, переданная в качестве аргумента `setImmediate()`, является обратным вызовом, который выполняется в следующей итерации цикла событий.

Чем `setImmediate()` отличается от `setTimeout(() => {}, 0)` (с передачей тайм-аута в 0 мс) и от `process.nextTick()` и `Promise.then()`?

Функция, переданная в `process.nextTick()`, будет выполнена в текущей итерации цикла событий, после завершения текущей операции. Это означает, что она всегда будет выполняться до `setTimeout` и `setImmediate`.

Обратный вызов `setTimeout()` с задержкой 0 мс очень похож на `setImmediate()`. Порядок выполнения будет зависеть от различных факторов, но оба они будут запущены в следующей итерации цикла событий.

Обратный вызов `process.nextTick` добавляется в **очередь process.nextTick**. Обратный вызов `Promise.then()` добавляется в **очередь микрозадач promises**. Обратный вызов `setTimeout`, `setImmediate` добавляется в **очередь макрозадач**.

Цикл событий сначала выполняет задачи в **очереди process.nextTick**, затем выполняет **очередь микрозадач promises**, а затем выполняет `setTimeout` или `setImmediate` **очередь макрозадач**.

Вот пример, показывающий порядок между `setImmediate()`, `process.nextTick()` и `Promise.then()`:

```js
const baz = () => console.log('baz');
const foo = () => console.log('foo');
const zoo = () => console.log('zoo');
const start = () => {
  console.log('start');
  setImmediate(baz);
  new Promise((resolve, reject) => {
    resolve('bar');
  }).then(resolve => {
    console.log(resolve);
    process.nextTick(zoo);
  });
  process.nextTick(foo);
};
start();
// start foo bar zoo baz
```

Этот код сначала вызывает `start()`, затем вызывает `foo()` в **очереди process.nextTick**. После этого он обработает **очередь микрозадач promises**, которая выводит bar и добавляет `zoo()` в **очередь process.nextTick** одновременно. Затем он вызовет `zoo()`, который только что был добавлен. В конце вызывается `baz()` в **очереди макрозадач**.

Вышеупомянутый принцип справедлив в случаях CommonJS, но имейте в виду, что в ES Modules, например, в файлах `.mjs`, порядок выполнения будет другим:

```js
// start bar foo zoo baz
```

Это связано с тем, что загружаемый ES Module обернут как асинхронная операция, и, таким образом, весь скрипт фактически уже находится в **очереди микрозадач promises**. Поэтому, когда промис немедленно разрешается, его обратный вызов добавляется в **очередь микрозадач**. Node.js попытается очистить очередь, прежде чем переходить к любой другой очереди, и поэтому вы увидите, что сначала выводится bar.

