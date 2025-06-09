---
title: Como usar o REPL do Node.js
description: Aprenda a usar o REPL do Node.js para testar rapidamente código JavaScript simples e explorar suas funcionalidades, incluindo modo multilinhas, variáveis especiais e comandos de ponto.
head:
  - - meta
    - name: og:title
      content: Como usar o REPL do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a usar o REPL do Node.js para testar rapidamente código JavaScript simples e explorar suas funcionalidades, incluindo modo multilinhas, variáveis especiais e comandos de ponto.
  - - meta
    - name: twitter:title
      content: Como usar o REPL do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a usar o REPL do Node.js para testar rapidamente código JavaScript simples e explorar suas funcionalidades, incluindo modo multilinhas, variáveis especiais e comandos de ponto.
---


# Como usar o REPL do Node.js

O comando `node` é o que usamos para executar nossos scripts Node.js:

```bash
node script.js
```

Se executarmos o comando `node` sem nenhum script para executar ou sem nenhum argumento, iniciamos uma sessão REPL:

```bash
node
```

::: tip NOTA
REPL significa Read Evaluate Print Loop (Ler Avaliar Imprimir Loop), e é um ambiente de linguagem de programação (basicamente uma janela de console) que recebe uma única expressão como entrada do usuário e retorna o resultado para o console após a execução. A sessão REPL oferece uma maneira conveniente de testar rapidamente código JavaScript simples.
:::

Se você tentar agora no seu terminal, é isso que acontece:

```bash
> node
>
```

O comando permanece em modo ocioso e espera que entremos com algo.

::: tip
se você não tiver certeza de como abrir seu terminal, pesquise no Google "Como abrir o terminal no seu sistema operacional".
:::

O REPL está esperando que entremos com algum código JavaScript, para ser mais preciso.

Comece simples e digite:

```bash
> console.log('test')
test
undefined
>
```

O primeiro valor, `test`, é a saída que dissemos ao console para imprimir, então obtemos `undefined` que é o valor de retorno da execução de `console.log()`. O Node leu esta linha de código, avaliou-a, imprimiu o resultado e, em seguida, voltou a esperar por mais linhas de código. O Node fará um loop por estas três etapas para cada trecho de código que executarmos no REPL até sairmos da sessão. É daí que o REPL tirou o seu nome.

O Node imprime automaticamente o resultado de qualquer linha de código JavaScript sem a necessidade de instruí-lo a fazê-lo. Por exemplo, digite a seguinte linha e pressione enter:

```bash
> 5==5
false
>
```

Observe a diferença nas saídas das duas linhas acima. O Node REPL imprimiu `undefined` após executar `console.log()`, enquanto, por outro lado, apenas imprimiu o resultado de `5== '5'`. Você precisa ter em mente que o primeiro é apenas uma declaração em JavaScript, e o último é uma expressão.

Em alguns casos, o código que você deseja testar pode precisar de várias linhas. Por exemplo, digamos que você deseja definir uma função que gera um número aleatório, na sessão REPL digite a seguinte linha e pressione enter:

```javascript
function generateRandom()
...
```

O Node REPL é inteligente o suficiente para determinar que você ainda não terminou de escrever seu código e entrará em um modo multi-linha para você digitar mais código. Agora termine a definição da sua função e pressione enter:

```javascript
function generateRandom()
...return Math.random()
```


### A variável especial:

Se após algum código você digitar `_`, isso irá imprimir o resultado da última operação.

### A tecla de seta para cima:

Se você pressionar a tecla de seta para cima, você terá acesso ao histórico das linhas de código anteriores executadas na sessão REPL atual, e até mesmo nas sessões anteriores.

## Comandos Dot

O REPL possui alguns comandos especiais, todos começando com um ponto `.`. Eles são:
- `.help`: mostra a ajuda dos comandos dot.
- `.editor`: habilita o modo editor, para escrever código JavaScript multilinhas com facilidade. Uma vez que você está neste modo, digite `ctrl-D` para executar o código que você escreveu.
- `.break`: ao inserir uma expressão de múltiplas linhas, inserir o comando `.break` irá abortar a entrada adicional. O mesmo que pressionar `ctrl-C`.
- `.clear`: redefine o contexto REPL para um objeto vazio e limpa qualquer expressão multilinhas atualmente sendo inserida.
- `.1oad`: carrega um arquivo JavaScript, relativo ao diretório de trabalho atual.
- `.save`: salva tudo o que você inseriu na sessão REPL em um arquivo (especifique o nome do arquivo).
- `.exit`: sai do repl (o mesmo que pressionar `ctrl-C` duas vezes).

O REPL sabe quando você está digitando uma declaração de múltiplas linhas sem a necessidade de invocar `.editor`. Por exemplo, se você começar a digitar uma iteração como esta:
```javascript
[1, 2,3].foxEach(num=>{
```
e você pressionar enter, o REPL irá para uma nova linha que começa com 3 pontos, indicando que você agora pode continuar a trabalhar naquele bloco.
```javascript
1... console.log (num)
2...}
```

Se você digitar `.break` no final de uma linha, o modo multilinhas irá parar e a declaração não será executada.

## Executar REPL a partir de arquivo JavaScript

Podemos importar o REPL em um arquivo JavaScript usando `repl`.
```javascript
const repl = require('node:repl');
```

Usando a variável `repl` podemos realizar várias operações. Para iniciar o prompt de comando REPL, digite a seguinte linha:
```javascript
repl.start();
```

Execute o arquivo na linha de comando.
```bash
node repl.js
```

Você pode passar uma string que mostra quando o REPL começa. O padrão é '>' (com um espaço à frente), mas podemos definir um prompt personalizado.
```javascript
// um prompt estilo Unix
const local = repl.start('$ ');
```

Você pode exibir uma mensagem ao sair do REPL

```javascript
local.on('exit', () => {
  console.log('saindo do repl');
  process.exit();
});
```

Você pode ler mais sobre o módulo REPL na [documentação do repl](/pt/nodejs/api/repl).

