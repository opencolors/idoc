---
title: Saída para a linha de comando com Node.js
description: O Node.js fornece um módulo de console com vários métodos para interagir com a linha de comando, incluindo registro, contagem, temporização, etc.
head:
  - - meta
    - name: og:title
      content: Saída para a linha de comando com Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O Node.js fornece um módulo de console com vários métodos para interagir com a linha de comando, incluindo registro, contagem, temporização, etc.
  - - meta
    - name: twitter:title
      content: Saída para a linha de comando com Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O Node.js fornece um módulo de console com vários métodos para interagir com a linha de comando, incluindo registro, contagem, temporização, etc.
---


# Saída para a linha de comando usando Node.js

Saída básica usando o módulo console
Node.js fornece um módulo console que oferece várias maneiras muito úteis de interagir com a linha de comando. É basicamente o mesmo objeto console que você encontra no navegador.

O método mais básico e mais usado é `console.log()`, que imprime a string que você passa para ele no console. Se você passar um objeto, ele o renderizará como uma string.

Você pode passar várias variáveis ​​para `console.log`, por exemplo:
```javascript
const x = 'x';
const y = 'y';
console.log(x, y);
```

Também podemos formatar frases bonitas passando variáveis ​​e um especificador de formato. Por exemplo:
```javascript
console.log('Meu %s tem %d orelhas', 'gato', 2);
```

- %s formata uma variável como uma string - %d formata uma variável como um número - %i formata uma variável apenas como sua parte inteira - %o formata uma variável como um objeto
Exemplo:
```javascript
console.log('%o', Number);
```
## Limpar o console

`console.clear()` limpa o console (o comportamento pode depender do console usado).

## Contando elementos

`console.count()` é um método útil.
Pegue este código:
```javascript
const x = 1;
const y = 2;
const z = 3;
console.count('O valor de x é '+x+' e foi verificado..quantas vezes?');
console.count('O valor de x é'+x+'e foi verificado..quantas vezes?');
console.count('O valor de y é'+y+'e foi verificado..quantas vezes?');
```

O que acontece é que `console.count()` contará o número de vezes que uma string é impressa e imprimirá a contagem ao lado dela:

Você pode apenas contar maçãs e laranjas:

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
```

## Redefinir a contagem

O método `console.countReset()` redefine o contador usado com `console.count()`.

Usaremos o exemplo de maçãs e laranjas para demonstrar isso.

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
console.countReset('orange');
oranges.forEach(fruit => console.count(fruit));
```


## Imprimir o rastreamento de pilha

Pode haver casos em que seja útil imprimir o rastreamento da pilha de chamadas de uma função, talvez para responder à pergunta de como você chegou a essa parte do código?

Você pode fazer isso usando `console.trace()`:

```javascript
const function2 = () => console.trace();
const function1 = () => function2();
function1();
```

Isso imprimirá o rastreamento da pilha. Isso é o que é impresso se tentarmos isso no REPL do Node.js:

```bash
Trace
at function2 (repl:1:33)
at function1 (rep1:1:25)
at rep1:1:1
at ContextifyScript.Script.xunInThisContext (vm.js:44:33)
at REPLServer.defaultEval(repl.js:239:29)
at bound (domain.js:301:14)
at REPLServer.xunBound [as eval](domain.js:314:12)
at REPLServer.onLine (repl.js:440:10)
at emitone (events.js:120:20)
at REPLServer.emit (events.js:210:7)
```

## Calcular o tempo gasto

Você pode calcular facilmente quanto tempo uma função leva para ser executada, usando `time()` e `timeEnd()`.

```javascript
const doSomething = () => console.log('teste');
const measureDoingSomething = () => {
    console.time('doSomething()');
    // faça algo e meça o tempo que leva
    doSomething();
    console.timeEnd('doSomething()');
};
measureDoingSomething();
```

### stdout e stderr

Como vimos, `console.log` é ótimo para imprimir mensagens no Console. Isso é o que é chamado de saída padrão, ou stdout.

`console.error` imprime no fluxo stderr.

Não aparecerá no console, mas aparecerá no log de erros.

## Colorir a saída

Você pode colorir a saída do seu texto no console usando sequências de escape. Uma sequência de escape é um conjunto de caracteres que identifica uma cor.

Exemplo:

```javascript
console.log('x1b[33ms/x1b[0m', 'oi!');
```

Você pode tentar isso no REPL do Node.js e ele imprimirá oi! em amarelo.

No entanto, esta é a maneira de baixo nível de fazer isso. A maneira mais simples de colorir a saída do console é usando uma biblioteca. Chalk é uma dessas bibliotecas e, além de colorir, também ajuda com outras facilidades de estilo, como deixar o texto em negrito, itálico ou sublinhado.

Você o instala com `npm install chalk` e, em seguida, pode usá-lo:

```javascript
const chalk = require('chalk');
console.log(chalk.yellow('oi!'));
```

Usar `chalk.yellow` é muito mais conveniente do que tentar lembrar os códigos de escape, e o código é muito mais legível.

Verifique o link do projeto postado acima para obter mais exemplos de uso.


## Criar uma barra de progresso

`progress` é um pacote incrível para criar uma barra de progresso no console. Instale-o usando `npm install progress`.

Este trecho cria uma barra de progresso de 10 etapas, e a cada 100ms uma etapa é concluída. Quando a barra é concluída, limpamos o intervalo:

```javascript
const ProgressBar = require('progress');
const bar = new ProgressBar(':bar', { total: 10 });
const timer = setInterval(() => {
    bar.tick();
    if (bar.complete) {
        clearInterval(timer);
    }
}, 100);
```

