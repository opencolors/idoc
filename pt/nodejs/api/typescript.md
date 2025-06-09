---
title: Suporte ao TypeScript no Node.js
description: Saiba como usar TypeScript com Node.js, incluindo instalação, configuração e melhores práticas para integrar TypeScript em seus projetos Node.js.
head:
  - - meta
    - name: og:title
      content: Suporte ao TypeScript no Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como usar TypeScript com Node.js, incluindo instalação, configuração e melhores práticas para integrar TypeScript em seus projetos Node.js.
  - - meta
    - name: twitter:title
      content: Suporte ao TypeScript no Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como usar TypeScript com Node.js, incluindo instalação, configuração e melhores práticas para integrar TypeScript em seus projetos Node.js.
---


# Módulos: TypeScript {#modules-typescript}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.7.0 | Adicionada a flag `--experimental-transform-types`. |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

## Habilitando {#enabling}

Existem duas maneiras de habilitar o suporte em tempo de execução para TypeScript no Node.js:

## Suporte completo ao TypeScript {#full-typescript-support}

Para usar o TypeScript com suporte completo a todos os recursos do TypeScript, incluindo `tsconfig.json`, você pode usar um pacote de terceiros. Estas instruções usam [`tsx`](https://tsx.is/) como um exemplo, mas existem muitas outras bibliotecas similares disponíveis.

## Remoção de tipos {#type-stripping}

**Adicionado em: v22.6.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

A flag [`--experimental-strip-types`](/pt/nodejs/api/cli#--experimental-strip-types) permite que o Node.js execute arquivos TypeScript. Por padrão, o Node.js executará apenas arquivos que não contenham recursos do TypeScript que exijam transformação, como enums ou namespaces. O Node.js substituirá anotações de tipo inline por espaços em branco, e nenhuma verificação de tipo é realizada. Para habilitar a transformação de tais recursos, use a flag [`--experimental-transform-types`](/pt/nodejs/api/cli#--experimental-transform-types). Recursos do TypeScript que dependem de configurações dentro de `tsconfig.json`, como paths ou converter sintaxe JavaScript mais recente para padrões mais antigos, não são intencionalmente suportados. Para obter suporte completo ao TypeScript, veja [Suporte completo ao TypeScript](/pt/nodejs/api/typescript#full-typescript-support).

O recurso de remoção de tipo foi projetado para ser leve. Ao intencionalmente não suportar sintaxes que exigem geração de código JavaScript e ao substituir tipos inline por espaços em branco, o Node.js pode executar código TypeScript sem a necessidade de source maps.

A remoção de tipo funciona com a maioria das versões do TypeScript, mas recomendamos a versão 5.7 ou mais recente com as seguintes configurações de `tsconfig.json`:

```json [JSON]
{
  "compilerOptions": {
     "target": "esnext",
     "module": "nodenext",
     "allowImportingTsExtensions": true,
     "rewriteRelativeImportExtensions": true,
     "verbatimModuleSyntax": true
  }
}
```

### Determinando o sistema de módulos {#determining-module-system}

O Node.js suporta tanto a sintaxe [CommonJS](/pt/nodejs/api/modules) quanto [ES Modules](/pt/nodejs/api/esm) em arquivos TypeScript. O Node.js não converterá de um sistema de módulos para outro; se você quiser que seu código seja executado como um ES module, você deve usar a sintaxe `import` e `export`, e se você quiser que seu código seja executado como CommonJS, você deve usar `require` e `module.exports`.

- Arquivos `.ts` terão seu sistema de módulos determinado [da mesma forma que arquivos `.js`.](/pt/nodejs/api/packages#determining-module-system) Para usar a sintaxe `import` e `export`, adicione `"type": "module"` ao `package.json` pai mais próximo.
- Arquivos `.mts` sempre serão executados como ES modules, similar a arquivos `.mjs`.
- Arquivos `.cts` sempre serão executados como CommonJS modules, similar a arquivos `.cjs`.
- Arquivos `.tsx` não são suportados.

Assim como em arquivos JavaScript, [extensões de arquivo são obrigatórias](/pt/nodejs/api/esm#mandatory-file-extensions) em declarações `import` e expressões `import()`: `import './file.ts'`, não `import './file'`. Por causa da compatibilidade retroativa, extensões de arquivo também são obrigatórias em chamadas `require()`: `require('./file.ts')`, não `require('./file')`, similar a como a extensão `.cjs` é obrigatória em chamadas `require` em arquivos CommonJS.

A opção `tsconfig.json` `allowImportingTsExtensions` permitirá ao compilador TypeScript `tsc` verificar os tipos de arquivos com especificadores `import` que incluem a extensão `.ts`.

### Recursos do TypeScript {#typescript-features}

Como o Node.js está apenas removendo os tipos inline, quaisquer recursos do TypeScript que envolvam *substituir* a sintaxe do TypeScript por uma nova sintaxe JavaScript resultarão em erro, a menos que a flag [`--experimental-transform-types`](/pt/nodejs/api/cli#--experimental-transform-types) seja passada.

Os recursos mais proeminentes que exigem transformação são:

- `Enum`
- `namespaces`
- `legacy module`
- parameter properties

Como os Decorators são atualmente uma [proposta TC39 Stage 3](https://github.com/tc39/proposal-decorators) e em breve serão suportados pelo engine JavaScript, eles não são transformados e resultarão em um erro de parser. Esta é uma limitação temporária e será resolvida no futuro.

Além disso, o Node.js não lê arquivos `tsconfig.json` e não suporta recursos que dependem de configurações dentro de `tsconfig.json`, como paths ou converter sintaxe JavaScript mais recente em padrões mais antigos.


### Importando tipos sem a palavra-chave `type` {#importing-types-without-type-keyword}

Devido à natureza da remoção de tipos, a palavra-chave `type` é necessária para remover corretamente as importações de tipos. Sem a palavra-chave `type`, o Node.js tratará a importação como uma importação de valor, o que resultará em um erro de tempo de execução. A opção `tsconfig` [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) pode ser usada para corresponder a esse comportamento.

Este exemplo funcionará corretamente:

```ts [TYPESCRIPT]
import type { Type1, Type2 } from './module.ts';
import { fn, type FnParams } from './fn.ts';
```
Isso resultará em um erro de tempo de execução:

```ts [TYPESCRIPT]
import { Type1, Type2 } from './module.ts';
import { fn, FnParams } from './fn.ts';
```
### Formas de entrada que não são arquivos {#non-file-forms-of-input}

A remoção de tipos pode ser ativada para `--eval`. O sistema de módulos será determinado por `--input-type`, como acontece com o JavaScript.

A sintaxe TypeScript não é suportada no REPL, na entrada STDIN, em `--print`, `--check` e `inspect`.

### Mapas de origem {#source-maps}

Como os tipos inline são substituídos por espaços em branco, os mapas de origem são desnecessários para números de linha corretos em rastreamentos de pilha; e o Node.js não os gera. Quando [`--experimental-transform-types`](/pt/nodejs/api/cli#--experimental-transform-types) está habilitado, os mapas de origem são habilitados por padrão.

### Remoção de tipos em dependências {#type-stripping-in-dependencies}

Para desencorajar os autores de pacotes de publicar pacotes escritos em TypeScript, o Node.js, por padrão, se recusará a lidar com arquivos TypeScript dentro de pastas sob um caminho `node_modules`.

### Aliases de caminhos {#paths-aliases}

[`tsconfig` "paths"](https://www.typescriptlang.org/tsconfig/#paths) não serão transformados e, portanto, produzirão um erro. O recurso mais próximo disponível são as [importações de subpath](/pt/nodejs/api/packages#subpath-imports) com a limitação de que elas precisam começar com `#`.

