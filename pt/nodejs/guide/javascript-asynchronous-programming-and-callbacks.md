---
title: Programação assíncrona do JavaScript e callbacks
description: JavaScript é síncrono por padrão, mas pode lidar com operações assíncronas por meio de callbacks, que são funções passadas como argumentos para outras funções e executadas quando um evento específico ocorre.
head:
  - - meta
    - name: og:title
      content: Programação assíncrona do JavaScript e callbacks | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: JavaScript é síncrono por padrão, mas pode lidar com operações assíncronas por meio de callbacks, que são funções passadas como argumentos para outras funções e executadas quando um evento específico ocorre.
  - - meta
    - name: twitter:title
      content: Programação assíncrona do JavaScript e callbacks | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: JavaScript é síncrono por padrão, mas pode lidar com operações assíncronas por meio de callbacks, que são funções passadas como argumentos para outras funções e executadas quando um evento específico ocorre.
---


# Programação Assíncrona e Callbacks em JavaScript

## Assincronia em Linguagens de Programação
Computadores são assíncronos por design.

Assíncrono significa que as coisas podem acontecer independentemente do fluxo principal do programa.

Nos computadores de consumo atuais, cada programa é executado por um período de tempo específico e, em seguida, interrompe sua execução para permitir que outro programa continue sua execução. Isso acontece em um ciclo tão rápido que é impossível notar. Pensamos que nossos computadores executam muitos programas simultaneamente, mas isso é uma ilusão (exceto em máquinas multiprocessadas).

Os programas internamente usam interrupções, um sinal que é emitido para o processador para chamar a atenção do sistema.

Não vamos entrar nos detalhes disso agora, mas apenas tenha em mente que é normal que os programas sejam assíncronos e interrompam sua execução até que precisem de atenção, permitindo que o computador execute outras coisas enquanto isso. Quando um programa está esperando por uma resposta da rede, ele não pode interromper o processador até que a solicitação termine.

Normalmente, as linguagens de programação são síncronas e algumas fornecem uma maneira de gerenciar a assincronia na linguagem ou por meio de bibliotecas. C, Java, C#, PHP, Go, Ruby, Swift e Python são todas síncronas por padrão. Algumas delas lidam com operações assíncronas usando threads, gerando um novo processo.

## JavaScript
JavaScript é **síncrono** por padrão e possui uma única thread. Isso significa que o código não pode criar novas threads e executar em paralelo.

As linhas de código são executadas em série, uma após a outra, por exemplo:

```js
const a = 1;
const b = 2;
const c = a * b;
console.log(c);
doSomething();
```

Mas o JavaScript nasceu dentro do navegador, sua principal função, no início, era responder às ações do usuário, como `onClick`, `onMouseOver`, `onChange`, `onSubmit` e assim por diante. Como poderia fazer isso com um modelo de programação síncrono?

A resposta estava em seu ambiente. O **navegador** oferece uma maneira de fazer isso, fornecendo um conjunto de APIs que podem lidar com esse tipo de funcionalidade.

Mais recentemente, o Node.js introduziu um ambiente de E/S não bloqueante para estender esse conceito ao acesso a arquivos, chamadas de rede e assim por diante.


## Callbacks
Você não pode saber quando um usuário vai clicar em um botão. Então, você define um manipulador de eventos para o evento de clique. Este manipulador de eventos aceita uma função, que será chamada quando o evento for acionado:

```js
document.getElementById('button').addEventListener('click', () => {
  // item clicado
});
```

Isto é o chamado **callback**.

Um callback é uma função simples que é passada como um valor para outra função, e só será executada quando o evento acontecer. Podemos fazer isso porque o JavaScript tem funções de primeira classe, que podem ser atribuídas a variáveis e passadas para outras funções (chamadas **funções de ordem superior**)

É comum envolver todo o seu código do lado do cliente em um ouvinte de evento **load** no objeto **window**, que executa a função de callback somente quando a página está pronta:

```js
window.addEventListener('load', () => {
  // janela carregada
  // faça o que você quiser
});
```

Callbacks são usados em todos os lugares, não apenas em eventos DOM.

Um exemplo comum é usando timers:

```js
setTimeout(() => {
  // executa após 2 segundos
}, 2000);
```

Requisições XHR também aceitam um callback, neste exemplo atribuindo uma função a uma propriedade que será chamada quando um evento particular ocorrer (neste caso, o estado da requisição muda):

```js
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4) {
    xhr.status === 200 ? console.log(xhr.responseText) : console.error('error');
  }
};
xhr.open('GET', 'https://yoursite.com');
xhr.send();
```

## Lidando com erros em callbacks
Como você lida com erros com callbacks? Uma estratégia muito comum é usar o que o Node.js adotou: o primeiro parâmetro em qualquer função de callback é o objeto de erro: callbacks de erro primeiro

Se não houver erro, o objeto é nulo. Se houver um erro, ele contém alguma descrição do erro e outras informações.

```js
const fs = require('node:fs');
fs.readFile('/file.json', (err, data) => {
  if (err) {
    // lida com o erro
    console.log(err);
    return;
  }
  // sem erros, processa os dados
  console.log(data);
});
```


## O problema com callbacks
Callbacks são ótimos para casos simples!

No entanto, cada callback adiciona um nível de aninhamento e, quando você tem muitos callbacks, o código começa a ficar complicado muito rapidamente:

```js
window.addEventListener('load', () => {
  document.getElementById('button').addEventListener('click', () => {
    setTimeout(() => {
      items.forEach(item => {
        // seu código aqui
      });
    }, 2000);
  });
});
```

Este é apenas um código simples de 4 níveis, mas já vi muito mais níveis de aninhamento e não é divertido.

Como resolvemos isso?

## Alternativas para callbacks
Começando com ES6, JavaScript introduziu vários recursos que nos ajudam com código assíncrono que não envolvem o uso de callbacks: `Promises` (ES6) e `Async/Await` (ES2017).

