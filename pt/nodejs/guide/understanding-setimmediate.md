---
title: Entendendo setImmediate() no Node.js
description: Saiba como funciona o setImmediate() no Node.js, suas diferenças com setTimeout(), process.nextTick() e Promise.then(), e como interage com o loop de eventos e filas.
head:
  - - meta
    - name: og:title
      content: Entendendo setImmediate() no Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como funciona o setImmediate() no Node.js, suas diferenças com setTimeout(), process.nextTick() e Promise.then(), e como interage com o loop de eventos e filas.
  - - meta
    - name: twitter:title
      content: Entendendo setImmediate() no Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como funciona o setImmediate() no Node.js, suas diferenças com setTimeout(), process.nextTick() e Promise.then(), e como interage com o loop de eventos e filas.
---


# Entendendo `setImmediate()`

Quando você quer executar algum trecho de código assincronamente, mas o mais rápido possível, uma opção é usar a função `setImmediate()` fornecida pelo Node.js:

```js
setImmediate(() => {
    // faça algo
})
```

Qualquer função passada como argumento para `setImmediate()` é um callback que é executado na próxima iteração do loop de eventos.

Qual a diferença entre `setImmediate()` e `setTimeout(() => {}, 0)` (passando um timeout de 0ms), e entre `process.nextTick()` e `Promise.then()`?

Uma função passada para `process.nextTick()` será executada na iteração atual do loop de eventos, após o término da operação atual. Isso significa que sempre será executada antes de `setTimeout` e `setImmediate`.

Um callback de `setTimeout()` com um atraso de 0ms é muito semelhante a `setImmediate()`. A ordem de execução dependerá de vários fatores, mas ambos serão executados na próxima iteração do loop de eventos.

Um callback `process.nextTick` é adicionado à **fila process.nextTick**. Um callback `Promise.then()` é adicionado à **fila de microtarefas promises**. Um callback `setTimeout`, `setImmediate` é adicionado à **fila de macrotarefas**.

O loop de eventos executa as tarefas na **fila process.nextTick** primeiro, e então executa a **fila de microtarefas promises**, e então executa a **fila de macrotarefas** `setTimeout` ou `setImmediate`.

Aqui está um exemplo para mostrar a ordem entre `setImmediate()`, `process.nextTick()` e `Promise.then()`:

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

Este código primeiro chamará `start()`, então chamará `foo()` na **fila process.nextTick**. Depois disso, ele lidará com a **fila de microtarefas promises**, que imprime bar e adiciona `zoo()` na **fila process.nextTick** ao mesmo tempo. Então ele chamará `zoo()` que acabou de ser adicionado. No final, o `baz()` na **fila de macrotarefas** é chamado.

O princípio mencionado acima é verdadeiro em casos CommonJS, mas tenha em mente que em Módulos ES, por exemplo, arquivos `mjs`, a ordem de execução será diferente:

```js
// start bar foo zoo baz
```

Isso ocorre porque o Módulo ES sendo carregado é encapsulado como uma operação assíncrona e, portanto, todo o script já está na **fila de microtarefas promises**. Portanto, quando a promessa é resolvida imediatamente, seu callback é anexado à **fila de microtarefas**. O Node.js tentará limpar a fila até passar para qualquer outra fila e, portanto, você verá que ele produz bar primeiro.

