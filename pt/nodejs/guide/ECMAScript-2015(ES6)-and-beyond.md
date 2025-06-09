---
title: ECMAScript 2015 (ES6) e além em Node.js
description: O Node.js suporta recursos ECMAScript modernos através do motor V8, com novos recursos e melhorias incorporados de forma oportuna.
head:
  - - meta
    - name: og:title
      content: ECMAScript 2015 (ES6) e além em Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O Node.js suporta recursos ECMAScript modernos através do motor V8, com novos recursos e melhorias incorporados de forma oportuna.
  - - meta
    - name: twitter:title
      content: ECMAScript 2015 (ES6) e além em Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O Node.js suporta recursos ECMAScript modernos através do motor V8, com novos recursos e melhorias incorporados de forma oportuna.
---


# ECMAScript 2015 (ES6) e posteriores

O Node.js é construído com base em versões modernas do [V8](https://v8.dev/). Ao nos mantermos atualizados com os últimos lançamentos deste mecanismo, garantimos que novos recursos da [especificação JavaScript ECMA-262](https://tc39.es/ecma262/) sejam trazidos aos desenvolvedores do Node.js em tempo hábil, bem como melhorias contínuas de desempenho e estabilidade.

Todos os recursos do ECMAScript 2015 (ES6) são divididos em três grupos: recursos de `envio`, `em fase de preparação` e `em andamento`:

+ Todos os recursos de `envio`, que o V8 considera estáveis, são ativados `por padrão no Node.js` e `NÃO` exigem qualquer tipo de sinalizador de tempo de execução.
+ Os recursos `em fase de preparação`, que são recursos quase completos que não são considerados estáveis pela equipe do V8, exigem um sinalizador de tempo de execução: `--harmony`.
+ Os recursos `em andamento` podem ser ativados individualmente por seu respectivo sinalizador de harmonia, embora isso seja altamente desencorajado, a menos que para fins de teste. Observação: esses sinalizadores são expostos pelo V8 e podem mudar potencialmente sem aviso prévio de obsolescência.

## Quais recursos são enviados com qual versão do Node.js por padrão?

O site [node.green](https://node.green) fornece uma excelente visão geral dos recursos ECMAScript compatíveis em várias versões do Node.js, com base na tabela de compatibilidade de kangax.

## Quais recursos estão em andamento?

Novos recursos estão sendo constantemente adicionados ao mecanismo V8. De modo geral, espere que eles cheguem em uma versão futura do Node.js, embora o tempo seja desconhecido.

Você pode listar todos os recursos em andamento disponíveis em cada versão do Node.js pesquisando no argumento `--v8-options`. Observe que esses são recursos incompletos e possivelmente quebrados do V8, portanto, use-os por sua conta e risco:

```sh
node --v8-options | grep "in progress"
```

## Minha infraestrutura está configurada para aproveitar o sinalizador --harmony. Devo removê-lo?

O comportamento atual do sinalizador `--harmony` no Node.js é ativar apenas os recursos `em fase de preparação`. Afinal, agora é um sinônimo de `--es_staging`. Conforme mencionado acima, esses são recursos completos que ainda não foram considerados estáveis. Se você quiser jogar pelo seguro, especialmente em ambientes de produção, considere remover este sinalizador de tempo de execução até que ele seja enviado por padrão no V8 e, consequentemente, no Node.js. Se você mantiver isso ativado, deverá estar preparado para que atualizações futuras do Node.js quebrem seu código se o V8 alterar sua semântica para seguir mais de perto o padrão.


## Como posso encontrar qual versão do V8 é enviada com uma versão específica do Node.js?

O Node.js fornece uma maneira simples de listar todas as dependências e respectivas versões que são enviadas com um binário específico através do objeto global `process`. No caso do motor V8, digite o seguinte no seu terminal para recuperar sua versão:

```sh
node -p process.versions.v8
```

