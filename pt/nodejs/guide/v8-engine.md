---
title: O Motor JavaScript V8
description: V8 é o motor JavaScript que impulsiona o Google Chrome, executando o código JavaScript e fornecendo um ambiente de execução. Ele é independente do navegador e permitiu o surgimento do Node.js, impulsionando o código do lado do servidor e os aplicativos de desktop.
head:
  - - meta
    - name: og:title
      content: O Motor JavaScript V8 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: V8 é o motor JavaScript que impulsiona o Google Chrome, executando o código JavaScript e fornecendo um ambiente de execução. Ele é independente do navegador e permitiu o surgimento do Node.js, impulsionando o código do lado do servidor e os aplicativos de desktop.
  - - meta
    - name: twitter:title
      content: O Motor JavaScript V8 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: V8 é o motor JavaScript que impulsiona o Google Chrome, executando o código JavaScript e fornecendo um ambiente de execução. Ele é independente do navegador e permitiu o surgimento do Node.js, impulsionando o código do lado do servidor e os aplicativos de desktop.
---


# O Motor JavaScript V8

V8 é o nome do motor JavaScript que alimenta o Google Chrome. É a coisa que pega nosso JavaScript e o executa enquanto navegamos com o Chrome.

V8 é o motor JavaScript, ou seja, ele analisa e executa o código JavaScript. O DOM e as outras APIs da plataforma Web (todas elas compõem o ambiente de tempo de execução) são fornecidos pelo navegador.

O interessante é que o motor JavaScript é independente do navegador no qual está hospedado. Essa característica fundamental permitiu a ascensão do Node.js. O V8 foi escolhido para ser o motor que alimentava o Node.js em 2009 e, com a explosão da popularidade do Node.js, o V8 se tornou o motor que agora alimenta uma quantidade incrível de código do lado do servidor escrito em JavaScript.

O ecossistema Node.js é enorme e, graças ao V8, também alimenta aplicativos de desktop, com projetos como o Electron.

## Outros motores JS

Outros navegadores têm seus próprios motores JavaScript:

+ `SpiderMonkey` (Firefox)
+ `JavaScriptCore` (também chamado de `Nitro`) (Safari)
+ O Edge era originalmente baseado no `Chakra`, mas foi reconstruído recentemente usando o Chromium e o motor V8.

e muitos outros também existem.

Todos esses motores implementam o [padrão ECMA ES-262](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/), também chamado de ECMAScript, o padrão usado pelo JavaScript.

## A busca por desempenho

O V8 é escrito em C++ e é continuamente aprimorado. É portátil e roda em Mac, Windows, Linux e vários outros sistemas.

Nesta introdução ao V8, ignoraremos os detalhes de implementação do V8: eles podem ser encontrados em sites mais confiáveis (por exemplo, o [site oficial do V8](https://v8.dev/)) e mudam com o tempo, muitas vezes radicalmente.

O V8 está sempre evoluindo, assim como os outros motores JavaScript, para acelerar a Web e o ecossistema Node.js.

Na web, existe uma corrida por desempenho que acontece há anos, e nós (como usuários e desenvolvedores) nos beneficiamos muito dessa competição porque obtemos máquinas mais rápidas e otimizadas ano após ano.


## Compilação

JavaScript é geralmente considerado uma linguagem interpretada, mas os mecanismos JavaScript modernos não apenas interpretam JavaScript, eles o compilam.

Isso tem acontecido desde 2009, quando o compilador SpiderMonkey JavaScript foi adicionado ao Firefox 3.5, e todos seguiram essa ideia.

JavaScript é compilado internamente pelo V8 com compilação just-in-time (JIT) para acelerar a execução.

Isso pode parecer contraintuitivo, mas desde a introdução do Google Maps em 2004, JavaScript evoluiu de uma linguagem que geralmente executava algumas dezenas de linhas de código para aplicativos completos com milhares a centenas de milhares de linhas em execução no navegador.

Nossos aplicativos agora podem ser executados por horas dentro de um navegador, em vez de serem apenas algumas regras de validação de formulário ou scripts simples.

Neste novo mundo, compilar JavaScript faz todo o sentido porque, embora possa demorar um pouco mais para ter o JavaScript pronto, uma vez feito, será muito mais eficiente do que o código puramente interpretado.

