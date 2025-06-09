---
title: Temporizadores JavaScript - setTimeout e setInterval
description: Saiba como usar temporizadores JavaScript para retardar a execução de funções e agendar tarefas com setTimeout e setInterval.
head:
  - - meta
    - name: og:title
      content: Temporizadores JavaScript - setTimeout e setInterval | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como usar temporizadores JavaScript para retardar a execução de funções e agendar tarefas com setTimeout e setInterval.
  - - meta
    - name: twitter:title
      content: Temporizadores JavaScript - setTimeout e setInterval | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como usar temporizadores JavaScript para retardar a execução de funções e agendar tarefas com setTimeout e setInterval.
---


# Descobrindo Timers em JavaScript

### `setTimeout()`

Ao escrever código JavaScript, você pode querer atrasar a execução de uma função.

Este é o trabalho do `setTimeout`. Você especifica uma função de callback para executar mais tarde, e um valor expressando quanto tempo depois você quer que ela rode, em milissegundos:

```js
setTimeout(() => {
  // roda depois de 2 segundos
}, 2000);
setTimeout(() => {
  // roda depois de 50 milissegundos
}, 50);
```

Esta sintaxe define uma nova função. Você pode chamar qualquer outra função que você quiser ali dentro, ou você pode passar um nome de função existente, e um conjunto de parâmetros:

```js
const myFunction = (firstParam, secondParam) => {
  // faça alguma coisa
};
// roda depois de 2 segundos
setTimeout(myFunction, 2000, firstParam, secondParam);
```

`setTimeout` retorna o id do timer. Isso geralmente não é usado, mas você pode armazenar este id, e limpá-lo se você quiser apagar esta execução de função agendada:

```js
const id = setTimeout(() => {
  // deveria rodar depois de 2 segundos
}, 2000);
// Mudei de ideia
clearTimeout(id);
```

## Atraso zero

Se você especificar o atraso do timeout para 0, a função de callback será executada assim que possível, mas depois da execução da função atual:

```js
setTimeout(() => {
  console.log('depois ');
}, 0);
console.log(' antes ');
```

Este código imprimirá

```bash
antes
depois
```

Isto é especialmente útil para evitar bloquear a CPU em tarefas intensivas e deixar outras funções serem executadas enquanto realiza um cálculo pesado, colocando funções na fila do agendador.

::: tip
Alguns navegadores (IE e Edge) implementam um método `setImmediate()` que faz exatamente a mesma funcionalidade, mas não é padrão e [indisponível em outros navegadores](https://caniuse.com/#feat=setimmediate). Mas é uma função padrão no Node.js.
:::

### `setInterval()`

`setInterval` é uma função similar ao `setTimeout`, com uma diferença: ao invés de rodar a função de callback uma vez, ela irá rodar para sempre, no intervalo de tempo específico que você especificar (em milissegundos):

```js
setInterval(() => {
  // roda a cada 2 segundos
}, 2000);
```

A função acima roda a cada 2 segundos a menos que você diga para ela parar, usando `clearInterval`, passando para ela o id do intervalo que `setInterval` retornou:

```js
const id = setInterval(() => {
  // roda a cada 2 segundos
}, 2000);
// Mudei de ideia
clearInterval(id);
```

É comum chamar `clearInterval` dentro da função de callback do `setInterval`, para deixá-la auto-determinar se ela deveria rodar novamente ou parar. Por exemplo, este código roda algo a menos que App.somethingIWait tenha o valor chegado:


## setTimeout Recursivo

`setInterval` inicia uma função a cada n milissegundos, sem considerar quando uma função terminou sua execução.

Se uma função sempre leva a mesma quantidade de tempo, está tudo bem.

Talvez a função leve tempos de execução diferentes, dependendo das condições da rede.

E talvez uma execução longa se sobreponha à próxima.

Para evitar isso, você pode agendar um setTimeout recursivo para ser chamado quando a função de callback terminar:

```js
const myFunction = () => {
  // faça alguma coisa
  setTimeout(myFunction, 1000);
};
setTimeout(myFunction, 1000);
```

`setTimeout` e `setInterval` estão disponíveis no Node.js, através do [módulo Timers](/pt/nodejs/api/timers).

O Node.js também fornece `setImmediate()`, que é equivalente a usar `setTimeout(() => {}, 0)`, usado principalmente para trabalhar com o Event Loop do Node.js.

