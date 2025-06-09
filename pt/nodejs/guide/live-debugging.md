---
title: Depuração ao vivo em Node.js
description: Aprenda a depurar ao vivo um processo do Node.js para identificar e resolver problemas com a lógica e a correção da aplicação.
head:
  - - meta
    - name: og:title
      content: Depuração ao vivo em Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a depurar ao vivo um processo do Node.js para identificar e resolver problemas com a lógica e a correção da aplicação.
  - - meta
    - name: twitter:title
      content: Depuração ao vivo em Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a depurar ao vivo um processo do Node.js para identificar e resolver problemas com a lógica e a correção da aplicação.
---


# Depuração ao Vivo

Neste documento, você pode aprender sobre como depurar ao vivo um processo Node.js.

## Minha aplicação não se comporta como esperado

### Sintomas

O usuário pode observar que a aplicação não fornece a saída esperada para certas entradas, por exemplo, um servidor HTTP retorna uma resposta JSON onde certos campos estão vazios. Várias coisas podem dar errado no processo, mas neste caso de uso, estamos focados principalmente na lógica da aplicação e sua correção.

### Depuração

Neste caso de uso, o usuário gostaria de entender o caminho do código que nossa aplicação executa para um determinado gatilho, como uma requisição HTTP de entrada. Eles também podem querer percorrer o código e controlar a execução, bem como inspecionar quais valores as variáveis ​​mantêm na memória. Para este propósito, podemos usar a flag `--inspect` ao iniciar a aplicação. Documentação sobre depuração pode ser encontrada [aqui](/pt/nodejs/guide/debugging-nodejs).

