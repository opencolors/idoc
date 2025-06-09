---
title: Entendendo process.nextTick() no Node.js
description: Aprenda como funciona process.nextTick() no Node.js e como ele difere de setImmediate() e setTimeout(). Entenda o ciclo de eventos e como usar nextTick() para executar código de forma assíncrona.
head:
  - - meta
    - name: og:title
      content: Entendendo process.nextTick() no Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda como funciona process.nextTick() no Node.js e como ele difere de setImmediate() e setTimeout(). Entenda o ciclo de eventos e como usar nextTick() para executar código de forma assíncrona.
  - - meta
    - name: twitter:title
      content: Entendendo process.nextTick() no Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda como funciona process.nextTick() no Node.js e como ele difere de setImmediate() e setTimeout(). Entenda o ciclo de eventos e como usar nextTick() para executar código de forma assíncrona.
---


# Entendendo `process.nextTick()`

Ao tentar entender o loop de eventos do Node.js, uma parte importante dele é `process.nextTick()`. Cada vez que o loop de eventos faz uma viagem completa, chamamos isso de tick.

Quando passamos uma função para process.nextTick(), instruímos o motor a invocar esta função no final da operação atual, antes que o próximo tick do loop de eventos comece:

```js
process.nextTick(() => {
  // faça algo
})
```

O loop de eventos está ocupado processando o código da função atual. Quando esta operação termina, o motor JS executa todas as funções passadas para chamadas `nextTick` durante essa operação.

É a maneira como podemos dizer ao motor JS para processar uma função assincronamente (após a função atual), mas o mais rápido possível, sem enfileirá-la.

Chamar `setTimeout(() => {}, 0)` executará a função no final do próximo tick, muito mais tarde do que ao usar `nextTick()`, que prioriza a chamada e a executa logo antes do início do próximo tick.

Use `nextTick()` quando você quiser garantir que na próxima iteração do loop de eventos esse código já seja executado.

## Um Exemplo da ordem dos eventos:

```js
console.log('Olá => número 1')
setImmediate(() => {
  console.log('Executando antes do timeout => número 3')
})
setTimeout(() => {
  console.log('O timeout executando por último => número 4')
}, 0)
process.nextTick(() => {
  console.log('Executando no próximo tick => número 2')
})
```

## Exemplo de saída:

```bash
Olá => número 1
Executando no próximo tick => número 2
Executando antes do timeout => número 3
O timeout executando por último => número 4
```

A saída exata pode diferir de execução para execução.

