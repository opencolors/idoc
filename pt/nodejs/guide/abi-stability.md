---
title: Estabilidade de ABI no Node.js e N-API
description: O Node.js fornece uma ABI estável para complementos nativos por meio do N-API, garantindo a compatibilidade entre várias versões principais e reduzindo as cargas de manutenção dos sistemas de produção.
head:
  - - meta
    - name: og:title
      content: Estabilidade de ABI no Node.js e N-API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O Node.js fornece uma ABI estável para complementos nativos por meio do N-API, garantindo a compatibilidade entre várias versões principais e reduzindo as cargas de manutenção dos sistemas de produção.
  - - meta
    - name: twitter:title
      content: Estabilidade de ABI no Node.js e N-API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O Node.js fornece uma ABI estável para complementos nativos por meio do N-API, garantindo a compatibilidade entre várias versões principais e reduzindo as cargas de manutenção dos sistemas de produção.
---


# Estabilidade ABI

## Introdução

Uma Interface Binária de Aplicação (ABI) é uma forma de os programas chamarem funções e usarem estruturas de dados de outros programas compilados. É a versão compilada de uma Interface de Programação de Aplicações (API). Em outras palavras, os arquivos de cabeçalho que descrevem as classes, funções, estruturas de dados, enumerações e constantes que permitem que um aplicativo execute uma tarefa desejada correspondem, por meio da compilação, a um conjunto de endereços e valores de parâmetros esperados e tamanhos e layouts de estrutura de memória com os quais o provedor da ABI foi compilado.

O aplicativo que usa a ABI deve ser compilado de forma que os endereços disponíveis, os valores de parâmetros esperados e os tamanhos e layouts da estrutura de memória concordem com aqueles com os quais o provedor da ABI foi compilado. Isso geralmente é feito compilando em relação aos cabeçalhos fornecidos pelo provedor da ABI.

Como o provedor da ABI e o usuário da ABI podem ser compilados em momentos diferentes com versões diferentes do compilador, uma parte da responsabilidade de garantir a compatibilidade da ABI recai sobre o compilador. Diferentes versões do compilador, talvez fornecidas por diferentes fornecedores, devem produzir a mesma ABI a partir de um arquivo de cabeçalho com um determinado conteúdo e devem produzir código para o aplicativo que usa a ABI que acessa a API descrita em um determinado cabeçalho de acordo com as convenções da ABI resultante da descrição no cabeçalho. Os compiladores modernos têm um histórico razoavelmente bom de não quebrar a compatibilidade ABI dos aplicativos que compilam.

A responsabilidade restante de garantir a compatibilidade da ABI recai sobre a equipe que mantém os arquivos de cabeçalho que fornecem a API que resulta, após a compilação, na ABI que deve permanecer estável. As alterações nos arquivos de cabeçalho podem ser feitas, mas a natureza das alterações deve ser rastreada de perto para garantir que, após a compilação, a ABI não seja alterada de uma forma que torne os usuários existentes da ABI incompatíveis com a nova versão.


## Estabilidade ABI em Node.js

O Node.js fornece arquivos de cabeçalho mantidos por várias equipes independentes. Por exemplo, arquivos de cabeçalho como `node.h` e `node_buffer.h` são mantidos pela equipe do Node.js. `v8.h` é mantido pela equipe do V8, que, embora em estreita cooperação com a equipe do Node.js, é independente e com seu próprio cronograma e prioridades. Assim, a equipe do Node.js tem apenas controle parcial sobre as alterações introduzidas nos cabeçalhos que o projeto fornece. Como resultado, o projeto Node.js adotou [versionamento semântico](https://semver.org). Isso garante que as APIs fornecidas pelo projeto resultarão em uma ABI estável para todas as versões secundárias e de patch do Node.js lançadas dentro de uma versão principal. Na prática, isso significa que o projeto Node.js se comprometeu a garantir que um addon nativo do Node.js compilado em uma determinada versão principal do Node.js seja carregado com sucesso quando carregado por qualquer versão secundária ou de patch do Node.js dentro da versão principal contra a qual foi compilado.

## N-API

Surgiu a demanda por equipar o Node.js com uma API que resulte em uma ABI que permaneça estável em várias versões principais do Node.js. A motivação para criar tal API é a seguinte:

- A linguagem JavaScript permaneceu compatível consigo mesma desde seus primeiros dias, enquanto a ABI do mecanismo que executa o código JavaScript muda a cada versão principal do Node.js. Isso significa que aplicativos consistindo em pacotes Node.js escritos inteiramente em JavaScript não precisam ser recompilados, reinstalados ou reimplantados quando uma nova versão principal do Node.js é lançada no ambiente de produção em que esses aplicativos são executados. Em contraste, se um aplicativo depende de um pacote que contém um addon nativo, o aplicativo deve ser recompilado, reinstalado e reimplantado sempre que uma nova versão principal do Node.js é introduzida no ambiente de produção. Essa disparidade entre os pacotes Node.js contendo addons nativos e aqueles escritos inteiramente em JavaScript aumentou o fardo de manutenção de sistemas de produção que dependem de addons nativos.

- Outros projetos começaram a produzir interfaces JavaScript que são essencialmente implementações alternativas do Node.js. Como esses projetos são geralmente construídos em um mecanismo JavaScript diferente do V8, seus addons nativos necessariamente assumem uma estrutura diferente e usam uma API diferente. No entanto, usar uma única API para um addon nativo em diferentes implementações da API JavaScript do Node.js permitiria que esses projetos aproveitassem o ecossistema de pacotes JavaScript que se acumulou em torno do Node.js.

- O Node.js pode conter um mecanismo JavaScript diferente no futuro. Isso significa que, externamente, todas as interfaces do Node.js permaneceriam as mesmas, mas o arquivo de cabeçalho V8 estaria ausente. Tal etapa causaria a interrupção do ecossistema Node.js em geral, e a dos addons nativos em particular, se uma API agnóstica ao mecanismo JavaScript não for primeiro fornecida pelo Node.js e adotada por addons nativos.

Para esses fins, o Node.js introduziu o N-API na versão 8.6.0 e o marcou como um componente estável do projeto a partir do Node.js 8.12.0. A API é definida nos cabeçalhos `node_api.h` e `node_api_types.h`, e fornece uma garantia de compatibilidade direta que cruza o limite da versão principal do Node.js. A garantia pode ser expressa da seguinte forma:

**Uma determinada versão n de N-API estará disponível na versão principal do Node.js na qual foi publicada e em todas as versões subsequentes do Node.js, incluindo versões principais subsequentes.**

Um autor de addon nativo pode aproveitar a garantia de compatibilidade direta do N-API, garantindo que o addon use apenas APIs definidas em `node_api.h` e estruturas de dados e constantes definidas em `node_api_types.h`. Ao fazer isso, o autor facilita a adoção de seu addon, indicando aos usuários de produção que o fardo de manutenção de seu aplicativo não aumentará mais com a adição do addon nativo ao seu projeto do que aumentaria com a adição de um pacote escrito puramente em JavaScript.

O N-API é versionado porque novas APIs são adicionadas de tempos em tempos. Ao contrário do versionamento semântico, o versionamento N-API é cumulativo. Ou seja, cada versão do N-API transmite o mesmo significado que uma versão secundária no sistema semver, o que significa que todas as alterações feitas no N-API serão compatíveis com versões anteriores. Além disso, novos N-APIs são adicionados sob um sinalizador experimental para dar à comunidade a oportunidade de examiná-los em um ambiente de produção. O status experimental significa que, embora tenha sido tomado cuidado para garantir que a nova API não precise ser modificada de forma incompatível com a ABI no futuro, ela ainda não foi suficientemente comprovada em produção para ser correta e útil como projetada e, como tal, pode sofrer alterações incompatíveis com a ABI antes de ser finalmente incorporada a uma versão futura do N-API. Ou seja, um N-API experimental ainda não está coberto pela garantia de compatibilidade direta.

