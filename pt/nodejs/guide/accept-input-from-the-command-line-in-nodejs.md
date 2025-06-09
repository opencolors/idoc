---
title: Obter entrada do usuário em Node.js
description: Aprenda a criar programas CLI interativos do Node.js usando o módulo readline e o pacote Inquirer.js.
head:
  - - meta
    - name: og:title
      content: Obter entrada do usuário em Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a criar programas CLI interativos do Node.js usando o módulo readline e o pacote Inquirer.js.
  - - meta
    - name: twitter:title
      content: Obter entrada do usuário em Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a criar programas CLI interativos do Node.js usando o módulo readline e o pacote Inquirer.js.
---


# Aceitar entrada da linha de comando no Node.js

Como tornar um programa CLI Node.js interativo?

O Node.js desde a versão 7 fornece o módulo readline para executar exatamente isso: obter entrada de um fluxo legível, como o fluxo `process.stdin`, que durante a execução de um programa Node.js é a entrada do terminal, uma linha por vez.

```javascript
const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Qual é o seu nome?", name => {
    console.log('Olá ' + name + '!');
    rl.close();
});
```

Este trecho de código pergunta o nome do usuário e, assim que o texto é inserido e o usuário pressiona enter, enviamos uma saudação.

O método `question()` mostra o primeiro parâmetro (uma pergunta) e espera pela entrada do usuário. Ele chama a função de callback assim que enter é pressionado.

Nesta função de callback, fechamos a interface readline.

`readline` oferece vários outros métodos, por favor, verifique-os na documentação do pacote vinculada acima.

Se você precisar solicitar uma senha, é melhor não ecoá-la, mas sim mostrar um símbolo *.

A maneira mais simples é usar o pacote readline-sync, que é muito semelhante em termos de API e lida com isso imediatamente. Uma solução mais completa e abstrata é fornecida pelo pacote Inquirer.js.

Você pode instalá-lo usando `npm install inquirer` e, em seguida, pode replicar o código acima assim:

```javascript
const inquirer = require('inquirer');
const questions = [
    {
        type: 'input',
        name: 'name',
        message: "Qual é o seu nome?"
    }
];
inquirer.prompt(questions).then(answers => {
    console.log('Olá ' + answers.name + '!');
});
```

`Inquirer.js` permite que você faça muitas coisas, como fazer várias escolhas, ter botões de rádio, confirmações e muito mais.

Vale a pena conhecer todas as alternativas, especialmente as internas fornecidas pelo Node.js, mas se você planeja levar a entrada CLI para o próximo nível, `Inquirer.js` é uma escolha ideal.

