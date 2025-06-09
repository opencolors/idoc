---
title: Depuração de problemas de memória no Node.js
description: Saiba como identificar e depurar problemas de memória relacionados a aplicativos Node.js, incluindo vazamentos de memória e uso ineficiente de memória.
head:
  - - meta
    - name: og:title
      content: Depuração de problemas de memória no Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como identificar e depurar problemas de memória relacionados a aplicativos Node.js, incluindo vazamentos de memória e uso ineficiente de memória.
  - - meta
    - name: twitter:title
      content: Depuração de problemas de memória no Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como identificar e depurar problemas de memória relacionados a aplicativos Node.js, incluindo vazamentos de memória e uso ineficiente de memória.
---


# Memória

Neste documento, você pode aprender sobre como depurar problemas relacionados à memória.

## Meu processo fica sem memória

Node.js (*JavaScript*) é uma linguagem com coleta de lixo, então ter vazamentos de memória é possível através de retentores. Como as aplicações Node.js são geralmente multi-inquilino, de importância crítica para os negócios e de longa duração, fornecer uma maneira acessível e eficiente de encontrar um vazamento de memória é essencial.

### Sintomas

O usuário observa um uso de memória continuamente crescente (*pode ser rápido ou lento, ao longo de dias ou até semanas*), então vê o processo travando e reiniciando pelo gerenciador de processos. O processo pode estar rodando mais lento do que antes e os reinícios fazem com que algumas requisições falhem (*balanceador de carga responde com 502*).

### Efeitos Colaterais

- Reinícios do processo devido ao esgotamento da memória e requisições são descartadas
- A atividade aumentada de GC leva a um maior uso da CPU e tempo de resposta mais lento
    - GC bloqueando o Event Loop causando lentidão
- O aumento da troca de memória diminui a velocidade do processo (atividade de GC)
- Pode não haver memória disponível suficiente para obter um Heap Snapshot

## Meu processo utiliza a memória de forma ineficiente

### Sintomas

A aplicação usa uma quantidade inesperada de memória e/ou observamos uma atividade elevada do coletor de lixo.

### Efeitos Colaterais

- Um número elevado de page faults
- Maior atividade de GC e uso da CPU

