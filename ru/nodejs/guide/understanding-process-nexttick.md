---
title: Понимание process.nextTick() в Node.js
description: Узнайте, как работает process.nextTick() в Node.js и как он отличается от setImmediate() и setTimeout(). Понимайте цикл событий и как использовать nextTick() для асинхронного выполнения кода.
head:
  - - meta
    - name: og:title
      content: Понимание process.nextTick() в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как работает process.nextTick() в Node.js и как он отличается от setImmediate() и setTimeout(). Понимайте цикл событий и как использовать nextTick() для асинхронного выполнения кода.
  - - meta
    - name: twitter:title
      content: Понимание process.nextTick() в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как работает process.nextTick() в Node.js и как он отличается от setImmediate() и setTimeout(). Понимайте цикл событий и как использовать nextTick() для асинхронного выполнения кода.
---


# Понимание `process.nextTick()`

Когда вы пытаетесь понять цикл событий Node.js, важной его частью является `process.nextTick()`. Каждый раз, когда цикл событий совершает полный оборот, мы называем это тиком.

Когда мы передаем функцию в process.nextTick(), мы даем движку команду вызвать эту функцию в конце текущей операции, до начала следующего тика цикла событий:

```js
process.nextTick(() => {
  // сделать что-то
})
```

Цикл событий занят обработкой текущего кода функции. Когда эта операция заканчивается, JS-движок выполняет все функции, переданные в вызовы `nextTick` во время этой операции.

Это способ сообщить JS-движку, чтобы он обработал функцию асинхронно (после текущей функции), но как можно скорее, не ставя ее в очередь.

Вызов `setTimeout(() => {}, 0)` выполнит функцию в конце следующего тика, намного позже, чем при использовании `nextTick()`, который отдает приоритет вызову и выполняет его непосредственно перед началом следующего тика.

Используйте `nextTick()`, когда хотите убедиться, что в следующей итерации цикла событий код уже выполнен.

## Пример порядка событий:

```js
console.log('Hello => number 1')
setImmediate(() => {
  console.log('Running before the timeout => number 3')
})
setTimeout(() => {
  console.log('The timeout running last => number 4')
}, 0)
process.nextTick(() => {
  console.log('Running at next tick => number 2')
})
```

## Пример вывода:

```bash
Hello => number 1
Running at next tick => number 2
Running before the timeout => number 3
The timeout running last => number 4
```

Точный вывод может отличаться от запуска к запуску.

