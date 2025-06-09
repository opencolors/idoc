---
title: Bloqueio e não bloqueio no Node.js
description: Este artigo explica a diferença entre as chamadas bloqueantes e não bloqueantes no Node.js, incluindo seu impacto no loop de eventos e na concorrência.
head:
  - - meta
    - name: og:title
      content: Bloqueio e não bloqueio no Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Este artigo explica a diferença entre as chamadas bloqueantes e não bloqueantes no Node.js, incluindo seu impacto no loop de eventos e na concorrência.
  - - meta
    - name: twitter:title
      content: Bloqueio e não bloqueio no Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Este artigo explica a diferença entre as chamadas bloqueantes e não bloqueantes no Node.js, incluindo seu impacto no loop de eventos e na concorrência.
---


# Visão geral de bloqueio vs. não bloqueio

Esta visão geral abrange a diferença entre chamadas de bloqueio e não bloqueio no Node.js. Esta visão geral se referirá ao loop de eventos e ao libuv, mas nenhum conhecimento prévio desses tópicos é necessário. Presume-se que os leitores tenham um conhecimento básico da linguagem JavaScript e do [padrão de callback](/pt/nodejs/guide/javascript-asynchronous-programming-and-callbacks) do Node.js.

::: info
"E/S" refere-se principalmente à interação com o disco e a rede do sistema suportados por [libuv](https://libuv.org/).
:::

## Bloqueio

**Bloqueio** é quando a execução de JavaScript adicional no processo do Node.js deve esperar até que uma operação não JavaScript seja concluída. Isso acontece porque o loop de eventos não consegue continuar executando JavaScript enquanto uma operação de **bloqueio** está ocorrendo.

No Node.js, o JavaScript que apresenta baixo desempenho devido a ser intensivo em CPU em vez de esperar por uma operação não JavaScript, como E/S, normalmente não é referido como **bloqueio**. Métodos síncronos na biblioteca padrão do Node.js que usam libuv são as operações de **bloqueio** mais comumente usadas. Módulos nativos também podem ter métodos de **bloqueio**.

Todos os métodos de E/S na biblioteca padrão do Node.js fornecem versões assíncronas, que são **não bloqueantes**, e aceitam funções de callback. Alguns métodos também têm contrapartes de **bloqueio**, que têm nomes que terminam com `Sync`.

## Comparando código

Métodos de **bloqueio** executam **sincronamente** e métodos **não bloqueantes** executam **assincronamente**.

Usando o módulo do sistema de arquivos como exemplo, esta é uma leitura de arquivo **síncrona**:

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // bloqueia aqui até que o arquivo seja lido
```

E aqui está um exemplo **assíncrono** equivalente:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
})
```

O primeiro exemplo parece mais simples que o segundo, mas tem a desvantagem de a segunda linha **bloquear** a execução de qualquer JavaScript adicional até que o arquivo inteiro seja lido. Observe que na versão síncrona, se um erro for lançado, ele precisará ser capturado ou o processo falhará. Na versão assíncrona, cabe ao autor decidir se um erro deve ser lançado como mostrado.

Vamos expandir um pouco nosso exemplo:

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // bloqueia aqui até que o arquivo seja lido
console.log(data)
moreWork() // será executado após console.log
```

E aqui está um exemplo assíncrono semelhante, mas não equivalente:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
moreWork() // será executado antes de console.log
```

No primeiro exemplo acima, `console.log` será chamado antes de `moreWork()`. No segundo exemplo, `fs.readFile()` é **não bloqueante**, então a execução do JavaScript pode continuar e `moreWork()` será chamado primeiro. A capacidade de executar `moreWork()` sem esperar que a leitura do arquivo seja concluída é uma escolha de design fundamental que permite maior taxa de transferência.


## Concorrência e Taxa de Transferência

A execução do JavaScript no Node.js é de thread único, portanto, a concorrência se refere à capacidade do loop de eventos de executar funções de callback JavaScript após concluir outros trabalhos. Qualquer código que deva ser executado de forma concorrente deve permitir que o loop de eventos continue a ser executado enquanto operações não JavaScript, como I/O, estão ocorrendo.

Como exemplo, vamos considerar um caso em que cada solicitação a um servidor web leva 50ms para ser concluída e 45ms desses 50ms são de I/O de banco de dados que pode ser feito de forma assíncrona. A escolha de operações assíncronas não bloqueantes libera esses 45ms por solicitação para lidar com outras solicitações. Esta é uma diferença significativa na capacidade apenas por escolher usar métodos não bloqueantes em vez de métodos bloqueantes.

O loop de eventos é diferente dos modelos em muitas outras linguagens, onde threads adicionais podem ser criadas para lidar com trabalho concorrente.

## Perigos de Misturar Código Bloqueante e Não Bloqueante

Existem alguns padrões que devem ser evitados ao lidar com I/O. Vejamos um exemplo:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
fs.unlinkSync('/file.md')
```

No exemplo acima, é provável que `fs.unlinkSync()` seja executado antes de `fs.readFile()`, o que excluiria `file.md` antes que ele seja realmente lido. Uma maneira melhor de escrever isso, que é completamente não bloqueante e garante a execução na ordem correta é:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (readFileErr, data) => {
  if (readFileErr) throw readFileErr
  console.log(data)
  fs.unlink('/file.md', unlinkErr => {
    if (unlinkErr) throw unlinkErr
  })
})
```

O código acima coloca uma chamada **não bloqueante** para `fs.unlink()` dentro do callback de `fs.readFile()` que garante a ordem correta das operações.

