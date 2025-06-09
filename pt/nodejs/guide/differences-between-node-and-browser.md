---
title: Diferenças entre Node.js e o navegador
description: Descubra as principais diferenças entre a criação de aplicativos em Node.js e o navegador, incluindo o ecossistema, o controle do ambiente e os sistemas de módulos.
head:
  - - meta
    - name: og:title
      content: Diferenças entre Node.js e o navegador | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Descubra as principais diferenças entre a criação de aplicativos em Node.js e o navegador, incluindo o ecossistema, o controle do ambiente e os sistemas de módulos.
  - - meta
    - name: twitter:title
      content: Diferenças entre Node.js e o navegador | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Descubra as principais diferenças entre a criação de aplicativos em Node.js e o navegador, incluindo o ecossistema, o controle do ambiente e os sistemas de módulos.
---


# Diferenças entre Node.js e o Navegador

Tanto o navegador quanto o Node.js usam JavaScript como sua linguagem de programação. Construir aplicativos que rodam no navegador é completamente diferente de construir um aplicativo Node.js. Apesar do fato de que é sempre JavaScript, existem algumas diferenças importantes que tornam a experiência radicalmente diferente.

Da perspectiva de um desenvolvedor frontend que usa extensivamente JavaScript, os aplicativos Node.js trazem uma enorme vantagem: o conforto de programar tudo - o frontend e o backend - em uma única linguagem.

Você tem uma grande oportunidade porque sabemos o quão difícil é aprender completa e profundamente uma linguagem de programação, e ao usar a mesma linguagem para realizar todo o seu trabalho na web - tanto no cliente quanto no servidor, você está em uma posição única de vantagem.

::: tip
O que muda é o ecossistema.
:::

No navegador, na maioria das vezes o que você está fazendo é interagir com o DOM, ou outras APIs da Plataforma Web como Cookies. Eles não existem no Node.js, é claro. Você não tem o `document`, `window` e todos os outros objetos que são fornecidos pelo navegador.

E no navegador, não temos todas as APIs agradáveis que o Node.js fornece através de seus módulos, como a funcionalidade de acesso ao sistema de arquivos.

Outra grande diferença é que no Node.js você controla o ambiente. A menos que você esteja construindo um aplicativo de código aberto que qualquer pessoa pode implantar em qualquer lugar, você sabe qual versão do Node.js executará o aplicativo. Comparado com o ambiente do navegador, onde você não tem o luxo de escolher qual navegador seus visitantes usarão, isso é muito conveniente.

Isso significa que você pode escrever todo o JavaScript moderno ES2015+ que sua versão do Node.js suporta. Como o JavaScript se move tão rápido, mas os navegadores podem ser um pouco lentos para atualizar, às vezes na web você fica preso a usar versões mais antigas de JavaScript / ECMAScript. Você pode usar o Babel para transformar seu código para ser compatível com ES5 antes de enviá-lo para o navegador, mas no Node.js, você não precisará disso.

Outra diferença é que o Node.js suporta os sistemas de módulos CommonJS e ES (desde o Node.js v12), enquanto no navegador, estamos começando a ver o padrão ES Modules sendo implementado.

Na prática, isso significa que você pode usar tanto `require()` quanto `import` no Node.js, enquanto você está limitado a `import` no navegador.

