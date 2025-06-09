---
title: Aplicações Executáveis Únicas com Node.js
description: Saiba como criar e gerenciar aplicações executáveis únicas com Node.js, incluindo como empacotar sua aplicação, gerenciar dependências e lidar com considerações de segurança.
head:
  - - meta
    - name: og:title
      content: Aplicações Executáveis Únicas com Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como criar e gerenciar aplicações executáveis únicas com Node.js, incluindo como empacotar sua aplicação, gerenciar dependências e lidar com considerações de segurança.
  - - meta
    - name: twitter:title
      content: Aplicações Executáveis Únicas com Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como criar e gerenciar aplicações executáveis únicas com Node.js, incluindo como empacotar sua aplicação, gerenciar dependências e lidar com considerações de segurança.
---


# Aplicações executáveis únicas {#single-executable-applications}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.6.0 | Adicionado suporte para "useSnapshot". |
| v20.6.0 | Adicionado suporte para "useCodeCache". |
| v19.7.0, v18.16.0 | Adicionado em: v19.7.0, v18.16.0 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

**Código Fonte:** [src/node_sea.cc](https://github.com/nodejs/node/blob/v23.5.0/src/node_sea.cc)

Este recurso permite a distribuição de uma aplicação Node.js convenientemente para um sistema que não tem o Node.js instalado.

Node.js suporta a criação de [aplicações executáveis únicas](https://github.com/nodejs/single-executable) permitindo a injeção de um blob preparado pelo Node.js, que pode conter um script empacotado, no binário `node`. Durante a inicialização, o programa verifica se algo foi injetado. Se o blob for encontrado, ele executa o script no blob. Caso contrário, o Node.js opera como normalmente.

O recurso de aplicação executável única atualmente suporta apenas a execução de um único script embutido usando o sistema de módulos [CommonJS](/pt/nodejs/api/modules#modules-commonjs-modules).

Os usuários podem criar uma aplicação executável única a partir de seu script empacotado com o próprio binário `node` e qualquer ferramenta que possa injetar recursos no binário.

Aqui estão os passos para criar uma aplicação executável única usando uma dessas ferramentas, [postject](https://github.com/nodejs/postject):

## Gerando blobs de preparação para executáveis únicos {#generating-single-executable-preparation-blobs}

Blobs de preparação para executáveis únicos que são injetados na aplicação podem ser gerados usando a flag `--experimental-sea-config` do binário Node.js que será usado para construir o executável único. Ele recebe um caminho para um arquivo de configuração no formato JSON. Se o caminho passado não for absoluto, o Node.js usará o caminho relativo ao diretório de trabalho atual.

A configuração atualmente lê os seguintes campos de nível superior:

```json [JSON]
{
  "main": "/caminho/para/script/empacotado.js",
  "output": "/caminho/para/escrever/o/blob/gerado.blob",
  "disableExperimentalSEAWarning": true, // Padrão: false
  "useSnapshot": false,  // Padrão: false
  "useCodeCache": true, // Padrão: false
  "assets": {  // Opcional
    "a.dat": "/caminho/para/a.dat",
    "b.txt": "/caminho/para/b.txt"
  }
}
```
Se os caminhos não forem absolutos, o Node.js usará o caminho relativo ao diretório de trabalho atual. A versão do binário Node.js usado para produzir o blob deve ser a mesma daquele no qual o blob será injetado.

Nota: Ao gerar SEAs multiplataforma (por exemplo, gerar uma SEA para `linux-x64` em `darwin-arm64`), `useCodeCache` e `useSnapshot` devem ser definidos como false para evitar gerar executáveis incompatíveis. Como o cache de código e os snapshots só podem ser carregados na mesma plataforma onde são compilados, o executável gerado pode falhar na inicialização ao tentar carregar o cache de código ou os snapshots construídos em uma plataforma diferente.


### Recursos {#assets}

Os usuários podem incluir recursos adicionando um dicionário de chave-caminho à configuração como o campo `assets`. No momento da construção, o Node.js leria os recursos dos caminhos especificados e os agruparia no blob de preparação. No executável gerado, os usuários podem recuperar os recursos usando as APIs [`sea.getAsset()`](/pt/nodejs/api/single-executable-applications#seagetassetkey-encoding) e [`sea.getAssetAsBlob()`](/pt/nodejs/api/single-executable-applications#seagetassetasblobkey-options).

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "assets": {
    "a.jpg": "/path/to/a.jpg",
    "b.txt": "/path/to/b.txt"
  }
}
```
O aplicativo executável único pode acessar os recursos da seguinte forma:

```js [CJS]
const { getAsset, getAssetAsBlob, getRawAsset } = require('node:sea');
// Retorna uma cópia dos dados em um ArrayBuffer.
const image = getAsset('a.jpg');
// Retorna uma string decodificada do recurso como UTF8.
const text = getAsset('b.txt', 'utf8');
// Retorna um Blob contendo o recurso.
const blob = getAssetAsBlob('a.jpg');
// Retorna um ArrayBuffer contendo o recurso bruto sem copiar.
const raw = getRawAsset('a.jpg');
```
Consulte a documentação das APIs [`sea.getAsset()`](/pt/nodejs/api/single-executable-applications#seagetassetkey-encoding), [`sea.getAssetAsBlob()`](/pt/nodejs/api/single-executable-applications#seagetassetasblobkey-options) e [`sea.getRawAsset()`](/pt/nodejs/api/single-executable-applications#seagetrawassetkey) para obter mais informações.

### Suporte a snapshot de inicialização {#startup-snapshot-support}

O campo `useSnapshot` pode ser usado para habilitar o suporte a snapshot de inicialização. Nesse caso, o script `main` não seria executado quando o executável final fosse lançado. Em vez disso, ele seria executado quando o blob de preparação do aplicativo executável único fosse gerado na máquina de construção. O blob de preparação gerado incluiria então um snapshot capturando os estados inicializados pelo script `main`. O executável final com o blob de preparação injetado deserializaria o snapshot em tempo de execução.

Quando `useSnapshot` é verdadeiro, o script principal deve invocar a API [`v8.startupSnapshot.setDeserializeMainFunction()`](/pt/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) para configurar o código que precisa ser executado quando o executável final for lançado pelos usuários.

O padrão típico para um aplicativo usar snapshot em um aplicativo executável único é:

As restrições gerais dos scripts de snapshot de inicialização também se aplicam ao script principal quando ele é usado para construir o snapshot para o aplicativo executável único, e o script principal pode usar a API [`v8.startupSnapshot` API](/pt/nodejs/api/v8#startup-snapshot-api) para se adaptar a essas restrições. Consulte a [documentação sobre suporte a snapshot de inicialização no Node.js](/pt/nodejs/api/cli#--build-snapshot).


### Suporte ao cache de código V8 {#v8-code-cache-support}

Quando `useCodeCache` é definido como `true` na configuração, durante a geração do blob de preparação executável único, o Node.js compilará o script `main` para gerar o cache de código V8. O cache de código gerado fará parte do blob de preparação e será injetado no executável final. Quando o aplicativo executável único for iniciado, em vez de compilar o script `main` do zero, o Node.js usará o cache de código para acelerar a compilação e, em seguida, executará o script, o que melhoraria o desempenho de inicialização.

**Nota:** `import()` não funciona quando `useCodeCache` é `true`.

## No script principal injetado {#in-the-injected-main-script}

### API de aplicação executável única {#single-executable-application-api}

O builtin `node:sea` permite a interação com a aplicação executável única a partir do script principal JavaScript incorporado no executável.

#### `sea.isSea()` {#seaissea}

**Adicionado em: v21.7.0, v20.12.0**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se este script está sendo executado dentro de uma aplicação executável única.

### `sea.getAsset(key[, encoding])` {#seagetassetkey-encoding}

**Adicionado em: v21.7.0, v20.12.0**

Este método pode ser usado para recuperar os ativos configurados para serem agrupados na aplicação executável única no momento da construção. Um erro é lançado quando nenhum ativo correspondente pode ser encontrado.

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) a chave para o ativo no dicionário especificado pelo campo `assets` na configuração da aplicação executável única.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se especificado, o ativo será decodificado como uma string. Qualquer codificação suportada pelo `TextDecoder` é aceita. Se não especificado, um `ArrayBuffer` contendo uma cópia do ativo seria retornado em vez disso.
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)


### `sea.getAssetAsBlob(key[, options])` {#seagetassetasblobkey-options}

**Adicionado em: v21.7.0, v20.12.0**

Similar a [`sea.getAsset()`](/pt/nodejs/api/single-executable-applications#seagetassetkey-encoding), mas retorna o resultado em um [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob). Um erro é lançado quando nenhum recurso correspondente pode ser encontrado.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) a chave para o recurso no dicionário especificado pelo campo `assets` na configuração do aplicativo executável único.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um tipo mime opcional para o blob.


- Retorna: [\<Blob\>](/pt/nodejs/api/buffer#class-blob)

### `sea.getRawAsset(key)` {#seagetrawassetkey}

**Adicionado em: v21.7.0, v20.12.0**

Este método pode ser usado para recuperar os recursos configurados para serem agrupados no aplicativo executável único no momento da construção. Um erro é lançado quando nenhum recurso correspondente pode ser encontrado.

Ao contrário de `sea.getAsset()` ou `sea.getAssetAsBlob()`, este método não retorna uma cópia. Em vez disso, ele retorna o recurso bruto agrupado dentro do executável.

Por enquanto, os usuários devem evitar escrever no buffer de array retornado. Se a seção injetada não estiver marcada como gravável ou não estiver alinhada corretamente, as gravações no buffer de array retornado provavelmente resultarão em uma falha.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) a chave para o recurso no dicionário especificado pelo campo `assets` na configuração do aplicativo executável único.
- Retorna: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

### `require(id)` no script principal injetado não é baseado em arquivo {#requireid-in-the-injected-main-script-is-not-file-based}

`require()` no script principal injetado não é o mesmo que o [`require()`](/pt/nodejs/api/modules#requireid) disponível para módulos que não são injetados. Ele também não possui nenhuma das propriedades que o [`require()`](/pt/nodejs/api/modules#requireid) não injetado possui, exceto [`require.main`](/pt/nodejs/api/modules#accessing-the-main-module). Ele só pode ser usado para carregar módulos integrados. A tentativa de carregar um módulo que só pode ser encontrado no sistema de arquivos lançará um erro.

Em vez de confiar em um `require()` baseado em arquivo, os usuários podem agrupar seu aplicativo em um arquivo JavaScript independente para injetar no executável. Isso também garante um gráfico de dependência mais determinístico.

No entanto, se um `require()` baseado em arquivo ainda for necessário, isso também pode ser alcançado:

```js [ESM]
const { createRequire } = require('node:module');
require = createRequire(__filename);
```

### `__filename` e `module.filename` no script principal injetado {#__filename-and-modulefilename-in-the-injected-main-script}

Os valores de `__filename` e `module.filename` no script principal injetado são iguais a [`process.execPath`](/pt/nodejs/api/process#processexecpath).

### `__dirname` no script principal injetado {#__dirname-in-the-injected-main-script}

O valor de `__dirname` no script principal injetado é igual ao nome do diretório de [`process.execPath`](/pt/nodejs/api/process#processexecpath).

## Notas {#notes}

### Processo de criação de aplicativo executável único {#single-executable-application-creation-process}

Uma ferramenta com o objetivo de criar um aplicativo Node.js executável único deve injetar o conteúdo do blob preparado com `--experimental-sea-config"` em:

- um recurso chamado `NODE_SEA_BLOB` se o binário `node` for um arquivo [PE](https://en.wikipedia.org/wiki/Portable_Executable)
- uma seção chamada `NODE_SEA_BLOB` no segmento `NODE_SEA` se o binário `node` for um arquivo [Mach-O](https://en.wikipedia.org/wiki/Mach-O)
- uma nota chamada `NODE_SEA_BLOB` se o binário `node` for um arquivo [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)

Procure no binário pela string [fuse](https://www.electronjs.org/docs/latest/tutorial/fuses) `NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2:0` e inverta o último caractere para `1` para indicar que um recurso foi injetado.

### Suporte de plataforma {#platform-support}

O suporte a executável único é testado regularmente no CI apenas nas seguintes plataformas:

- Windows
- macOS
- Linux (todas as distribuições [suportadas pelo Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) exceto Alpine e todas as arquiteturas [suportadas pelo Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) exceto s390x)

Isso se deve à falta de melhores ferramentas para gerar executáveis ​​únicos que possam ser usados ​​para testar esse recurso em outras plataformas.

Sugestões para outras ferramentas/fluxos de trabalho de injeção de recursos são bem-vindas. Por favor, inicie uma discussão em [https://github.com/nodejs/single-executable/discussions](https://github.com/nodejs/single-executable/discussions) para nos ajudar a documentá-las.

