---
title: Otimização do desempenho do Node.js
description: Saiba como analisar um processo do Node.js para identificar gargalos de desempenho e otimizar o código para uma melhor eficiência e experiência do usuário.
head:
  - - meta
    - name: og:title
      content: Otimização do desempenho do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como analisar um processo do Node.js para identificar gargalos de desempenho e otimizar o código para uma melhor eficiência e experiência do usuário.
  - - meta
    - name: twitter:title
      content: Otimização do desempenho do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como analisar um processo do Node.js para identificar gargalos de desempenho e otimizar o código para uma melhor eficiência e experiência do usuário.
---


# Desempenho Insatisfatório
Neste documento, você pode aprender sobre como perfilar um processo Node.js.

## Meu aplicativo tem um desempenho insatisfatório

### Sintomas

A latência do meu aplicativo está alta e eu já confirmei que o gargalo não está nas minhas dependências, como bancos de dados e serviços downstream. Então, suspeito que meu aplicativo gaste um tempo significativo para executar o código ou processar informações.

Você está satisfeito com o desempenho geral do seu aplicativo, mas gostaria de entender qual parte do nosso aplicativo pode ser melhorada para ser executada de forma mais rápida ou eficiente. Isso pode ser útil quando queremos melhorar a experiência do usuário ou economizar custos de computação.

### Depuração
Neste caso de uso, estamos interessados em trechos de código que usam mais ciclos de CPU do que os outros. Quando fazemos isso localmente, geralmente tentamos otimizar nosso código. [Usar o V8 Sampling Profiler](/pt/nodejs/guide/profiling-nodejs-applications) pode nos ajudar a fazer isso.

