---
title: Guia Completa do npm, o Gerenciador de Pacotes do Node.js
description: Aprenda a usar npm para gerenciar dependências, instalar e atualizar pacotes e executar tarefas em seus projetos Node.js.
head:
  - - meta
    - name: og:title
      content: Guia Completa do npm, o Gerenciador de Pacotes do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a usar npm para gerenciar dependências, instalar e atualizar pacotes e executar tarefas em seus projetos Node.js.
  - - meta
    - name: twitter:title
      content: Guia Completa do npm, o Gerenciador de Pacotes do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a usar npm para gerenciar dependências, instalar e atualizar pacotes e executar tarefas em seus projetos Node.js.
---


# Uma introdução ao gerenciador de pacotes npm

## Introdução ao npm

`npm` é o gerenciador de pacotes padrão para Node.js.

Em setembro de 2022, mais de 2,1 milhões de pacotes foram relatados como listados no registro npm, tornando-o o maior repositório de código de linguagem única na Terra, e você pode ter certeza de que existe um pacote para (quase!) tudo.

Começou como uma forma de baixar e gerenciar dependências de pacotes Node.js, mas desde então se tornou uma ferramenta usada também no JavaScript frontend.

::: tip
`Yarn` e `pnpm` são alternativas ao npm cli. Você também pode verificá-los.
:::

## Pacotes

### Instalando todas as dependências

Você pode instalar todas as dependências listadas no seu arquivo `package.json` executando:

```bash
npm install
```

ele irá instalar tudo o que o projeto precisa, na pasta `node_modules`, criando-a se ainda não existir.

### Instalando um único pacote

Você pode instalar um único pacote executando:

```bash
npm install <nome-do-pacote>
```

Além disso, desde o npm 5, este comando adiciona `<nome-do-pacote>` às dependências do arquivo `package.json`. Antes da versão 5, você precisava adicionar a flag `--save`.

Frequentemente você verá mais flags adicionadas a este comando:

+ `--save-dev` (ou `-D`) que adiciona o pacote à seção `devDependencies` do arquivo `package.json`.
+ `--no-save` que impede que o pacote seja salvo no arquivo `package.json`.
+ `--no-optional` que impede a instalação de dependências opcionais.
+ `--save-optional` que adiciona o pacote à seção `optionalDependencies` do arquivo `package.json`.

Abreviaturas das flags também podem ser usadas:

+ `-S`: `--save`
+ `-D`: `--save-dev`
+ `-O`: `--save-optional`

A diferença entre devDependencies e dependencies é que o primeiro contém ferramentas de desenvolvimento, como uma biblioteca de testes, enquanto o último é agrupado com o aplicativo em produção.

Quanto às optionalDependencies, a diferença é que a falha na construção da dependência não fará com que a instalação falhe. Mas é responsabilidade do seu programa lidar com a falta da dependência. Leia mais sobre [dependências opcionais](https://docs.npmjs.com/cli/v10/using-npm/config#optional).


### Atualizando pacotes
A atualização também é facilitada, executando

```bash
npm update
```

Isso atualizará todas as dependências para suas versões mais recentes.

Você também pode especificar um único pacote para atualizar:

```bash
npm update <nome-do-pacote>
```

### Removendo pacotes

Para remover um pacote, você pode executar:

```bash
npm uninstall <nome-do-pacote>
```

### Versionamento
Além de downloads simples, o `npm` também gerencia o versionamento, para que você possa especificar qualquer versão específica de um pacote ou exigir uma versão superior ou inferior à que você precisa.

Muitas vezes, você descobrirá que uma biblioteca é compatível apenas com uma versão principal de outra biblioteca.

Ou um bug na versão mais recente de uma lib, ainda não corrigido, está causando um problema.

Especificar uma versão explícita de uma biblioteca também ajuda a manter todos na mesma versão exata de um pacote, para que toda a equipe execute a mesma versão até que o arquivo `package.json` seja atualizado.

Em todos esses casos, o versionamento ajuda muito, e o `npm` segue o padrão de [versionamento semântico (semver)](https://semver.org/).

Você pode instalar uma versão específica de um pacote, executando

```bash
npm install <nome-do-pacote>@<versão>
```

Você também pode instalar a versão mais recente de um pacote, executando

```bash
npm install <nome-do-pacote>@latest
```

### Executando Tarefas
O arquivo package.json suporta um formato para especificar tarefas de linha de comando que podem ser executadas usando

```bash
npm run <nome-da-tarefa>
```

Por exemplo, se você tiver um arquivo package.json com o seguinte conteúdo:

```json
{
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  }
}
```

É muito comum usar esse recurso para executar o Webpack:

```json
{
  "scripts": {
    "watch": "webpack --watch --progress --colors --config webpack.conf.js",
    "dev": "webpack --progress --colors --config webpack.conf.js",
    "prod": "NODE_ENV=production webpack -p --config webpack.conf.js"
  }
}
```

Portanto, em vez de digitar esses comandos longos, que são fáceis de esquecer ou digitar errado, você pode executar

```bash
npm run watch
npm run dev
npm run prod
```

