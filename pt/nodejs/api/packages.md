---
title: Documentação de Pacotes do Node.js
description: Explore a documentação oficial do Node.js sobre pacotes, incluindo como gerenciá-los, criá-los e publicá-los, com detalhes sobre package.json, dependências e ferramentas de gerenciamento de pacotes.
head:
  - - meta
    - name: og:title
      content: Documentação de Pacotes do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explore a documentação oficial do Node.js sobre pacotes, incluindo como gerenciá-los, criá-los e publicá-los, com detalhes sobre package.json, dependências e ferramentas de gerenciamento de pacotes.
  - - meta
    - name: twitter:title
      content: Documentação de Pacotes do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explore a documentação oficial do Node.js sobre pacotes, incluindo como gerenciá-los, criá-los e publicá-los, com detalhes sobre package.json, dependências e ferramentas de gerenciamento de pacotes.
---


# Módulos: Pacotes {#modules-packages}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.13.0, v12.20.0 | Adiciona suporte para padrões `"exports"`. |
| v14.6.0, v12.19.0 | Adiciona o campo `"imports"` do pacote. |
| v13.7.0, v12.17.0 | Remove a flag para exports condicionais. |
| v13.7.0, v12.16.0 | Remove a opção `--experimental-conditional-exports`. Na versão 12.16.0, os exports condicionais ainda estão atrás de `--experimental-modules`. |
| v13.6.0, v12.16.0 | Remove a flag para auto-referência de um pacote usando seu nome. |
| v12.7.0 | Introduz o campo `"exports"` do `package.json` como uma alternativa mais poderosa para o campo `"main"` clássico. |
| v12.0.0 | Adiciona suporte para módulos ES usando a extensão de arquivo `.js` através do campo `"type"` do `package.json`. |
:::

## Introdução {#introduction}

Um pacote é uma árvore de pastas descrita por um arquivo `package.json`. O pacote consiste na pasta que contém o arquivo `package.json` e todas as subpastas até a próxima pasta que contém outro arquivo `package.json`, ou uma pasta nomeada `node_modules`.

Esta página fornece orientação para autores de pacotes que escrevem arquivos `package.json`, juntamente com uma referência para os campos [`package.json`](/pt/nodejs/api/packages#nodejs-packagejson-field-definitions) definidos pelo Node.js.

## Determinando o sistema de módulos {#determining-module-system}

### Introdução {#introduction_1}

O Node.js tratará o seguinte como [módulos ES](/pt/nodejs/api/esm) quando passados para `node` como a entrada inicial, ou quando referenciados por instruções `import` ou expressões `import()`:

- Arquivos com uma extensão `.mjs`.
- Arquivos com uma extensão `.js` quando o arquivo `package.json` pai mais próximo contém um campo [`"type"`](/pt/nodejs/api/packages#type) de nível superior com um valor de `"module"`.
- Strings passadas como um argumento para `--eval`, ou enviadas para `node` via `STDIN`, com a flag `--input-type=module`.
- Código contendo sintaxe analisada com sucesso apenas como [módulos ES](/pt/nodejs/api/esm), como instruções `import` ou `export` ou `import.meta`, sem um marcador explícito de como deve ser interpretado. Marcadores explícitos são extensões `.mjs` ou `.cjs`, campos `"type"` do `package.json` com valores `"module"` ou `"commonjs"`, ou a flag `--input-type`. Expressões dinâmicas `import()` são suportadas em módulos CommonJS ou ES e não forçariam um arquivo a ser tratado como um módulo ES. Consulte [Detecção de sintaxe](/pt/nodejs/api/packages#syntax-detection).

O Node.js tratará o seguinte como [CommonJS](/pt/nodejs/api/modules) quando passados para `node` como a entrada inicial, ou quando referenciados por instruções `import` ou expressões `import()`:

- Arquivos com uma extensão `.cjs`.
- Arquivos com uma extensão `.js` quando o arquivo `package.json` pai mais próximo contém um campo de nível superior [`"type"`](/pt/nodejs/api/packages#type) com um valor de `"commonjs"`.
- Strings passadas como um argumento para `--eval` ou `--print`, ou enviadas para `node` via `STDIN`, com a flag `--input-type=commonjs`.
- Arquivos com uma extensão `.js` sem um arquivo `package.json` pai ou onde o arquivo `package.json` pai mais próximo não tem um campo `type`, e onde o código pode ser avaliado com sucesso como CommonJS. Em outras palavras, o Node.js tenta executar esses arquivos "ambíguos" como CommonJS primeiro e tentará novamente avaliá-los como módulos ES se a avaliação como CommonJS falhar porque o analisador encontrou a sintaxe do módulo ES.

Escrever sintaxe de módulo ES em arquivos "ambíguos" acarreta um custo de desempenho e, portanto, é recomendável que os autores sejam explícitos sempre que possível. Em particular, os autores do pacote devem sempre incluir o campo [`"type"`](/pt/nodejs/api/packages#type) em seus arquivos `package.json`, mesmo em pacotes onde todas as fontes são CommonJS. Ser explícito sobre o `type` do pacote protegerá o pacote no futuro caso o tipo padrão do Node.js seja alterado e também facilitará para as ferramentas de construção e carregadores determinar como os arquivos no pacote devem ser interpretados.


### Detecção de sintaxe {#syntax-detection}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.7.0 | A detecção de sintaxe está habilitada por padrão. |
| v21.1.0, v20.10.0 | Adicionado em: v21.1.0, v20.10.0 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).2 - Candidato a lançamento
:::

O Node.js inspecionará o código-fonte da entrada ambígua para determinar se ele contém sintaxe de módulo ES; se tal sintaxe for detectada, a entrada será tratada como um módulo ES.

Entrada ambígua é definida como:

- Arquivos com uma extensão `.js` ou nenhuma extensão; e nenhum arquivo `package.json` de controle ou um que não tenha um campo `type`.
- Entrada de string (`--eval` ou `STDIN`) quando `--input-type` não é especificado.

A sintaxe do módulo ES é definida como a sintaxe que seria lançada quando avaliada como CommonJS. Isso inclui o seguinte:

- Declarações `import` (mas *não* expressões `import()`, que são válidas em CommonJS).
- Declarações `export`.
- Referências `import.meta`.
- `await` no nível superior de um módulo.
- Redeclarações lexicais das variáveis ​​de wrapper CommonJS (`require`, `module`, `exports`, `__dirname`, `__filename`).

### Carregadores de módulos {#modules-loaders}

O Node.js possui dois sistemas para resolver um especificador e carregar módulos.

Existe o carregador de módulo CommonJS:

- É totalmente síncrono.
- É responsável por lidar com chamadas `require()`.
- É monkey patchable.
- Ele suporta [pastas como módulos](/pt/nodejs/api/modules#folders-as-modules).
- Ao resolver um especificador, se nenhuma correspondência exata for encontrada, ele tentará adicionar extensões (`.js`, `.json` e, finalmente, `.node`) e, em seguida, tentará resolver [pastas como módulos](/pt/nodejs/api/modules#folders-as-modules).
- Ele trata `.json` como arquivos de texto JSON.
- Arquivos `.node` são interpretados como módulos complementares compilados carregados com `process.dlopen()`.
- Ele trata todos os arquivos que não possuem extensões `.json` ou `.node` como arquivos de texto JavaScript.
- Ele só pode ser usado para [carregar módulos ECMAScript de módulos CommonJS](/pt/nodejs/api/modules#loading-ecmascript-modules-using-require) se o gráfico do módulo for síncrono (que não contenha `await` de nível superior). Quando usado para carregar um arquivo de texto JavaScript que não é um módulo ECMAScript, o arquivo será carregado como um módulo CommonJS.

Existe o carregador de módulo ECMAScript:

- É assíncrono, a menos que esteja sendo usado para carregar módulos para `require()`.
- É responsável por lidar com declarações `import` e expressões `import()`.
- Não é monkey patchable, pode ser personalizado usando [ganchos de carregador](/pt/nodejs/api/esm#loaders).
- Não suporta pastas como módulos, os índices de diretório (por exemplo, `'./startup/index.js'`) devem ser totalmente especificados.
- Não faz busca de extensão. Uma extensão de arquivo deve ser fornecida quando o especificador é uma URL de arquivo relativa ou absoluta.
- Ele pode carregar módulos JSON, mas um atributo de tipo de importação é necessário.
- Aceita apenas extensões `.js`, `.mjs` e `.cjs` para arquivos de texto JavaScript.
- Ele pode ser usado para carregar módulos JavaScript CommonJS. Esses módulos são passados ​​pelo `cjs-module-lexer` para tentar identificar exportações nomeadas, que estão disponíveis se puderem ser determinadas por meio de análise estática. Módulos CommonJS importados têm suas URLs convertidas em caminhos absolutos e são então carregados por meio do carregador de módulos CommonJS.


### `package.json` e extensões de arquivo {#packagejson-and-file-extensions}

Dentro de um pacote, o campo [`"type"`](/pt/nodejs/api/packages#type) do [`package.json`](/pt/nodejs/api/packages#nodejs-packagejson-field-definitions) define como o Node.js deve interpretar arquivos `.js`. Se um arquivo `package.json` não tiver um campo `"type"`, os arquivos `.js` são tratados como [CommonJS](/pt/nodejs/api/modules).

Um valor `"type"` de `"module"` em `package.json` informa ao Node.js para interpretar arquivos `.js` dentro desse pacote como usando a sintaxe de [módulo ES](/pt/nodejs/api/esm).

O campo `"type"` se aplica não apenas aos pontos de entrada iniciais (`node my-app.js`), mas também aos arquivos referenciados por instruções `import` e expressões `import()`.

```js [ESM]
// my-app.js, tratado como um módulo ES porque existe um arquivo package.json
// na mesma pasta com "type": "module".

import './startup/init.js';
// Carregado como módulo ES, pois ./startup não contém arquivo package.json,
// e, portanto, herda o valor "type" de um nível acima.

import 'commonjs-package';
// Carregado como CommonJS, pois ./node_modules/commonjs-package/package.json
// não possui um campo "type" ou contém "type": "commonjs".

import './node_modules/commonjs-package/index.js';
// Carregado como CommonJS, pois ./node_modules/commonjs-package/package.json
// não possui um campo "type" ou contém "type": "commonjs".
```
Arquivos terminados com `.mjs` são sempre carregados como [módulos ES](/pt/nodejs/api/esm), independentemente do `package.json` pai mais próximo.

Arquivos terminados com `.cjs` são sempre carregados como [CommonJS](/pt/nodejs/api/modules), independentemente do `package.json` pai mais próximo.

```js [ESM]
import './legacy-file.cjs';
// Carregado como CommonJS, pois .cjs é sempre carregado como CommonJS.

import 'commonjs-package/src/index.mjs';
// Carregado como módulo ES, pois .mjs é sempre carregado como módulo ES.
```
As extensões `.mjs` e `.cjs` podem ser usadas para misturar tipos dentro do mesmo pacote:

- Dentro de um pacote `"type": "module"`, o Node.js pode ser instruído a interpretar um determinado arquivo como [CommonJS](/pt/nodejs/api/modules) nomeando-o com uma extensão `.cjs` (já que os arquivos `.js` e `.mjs` são tratados como módulos ES dentro de um pacote `"module"`).
- Dentro de um pacote `"type": "commonjs"`, o Node.js pode ser instruído a interpretar um determinado arquivo como um [módulo ES](/pt/nodejs/api/esm) nomeando-o com uma extensão `.mjs` (já que os arquivos `.js` e `.cjs` são tratados como CommonJS dentro de um pacote `"commonjs"`).


### Flag `--input-type` {#--input-type-flag}

**Adicionado em: v12.0.0**

Strings passadas como um argumento para `--eval` (ou `-e`), ou direcionadas para `node` via `STDIN`, são tratadas como [módulos ES](/pt/nodejs/api/esm) quando a flag `--input-type=module` é definida.

```bash [BASH]
node --input-type=module --eval "import { sep } from 'node:path'; console.log(sep);"

echo "import { sep } from 'node:path'; console.log(sep);" | node --input-type=module
```
Por completude, também existe `--input-type=commonjs`, para executar explicitamente a entrada de string como CommonJS. Este é o comportamento padrão se `--input-type` não for especificado.

## Determinando o gerenciador de pacotes {#determining-package-manager}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Embora todos os projetos Node.js devam ser instaláveis por todos os gerenciadores de pacotes após a publicação, suas equipes de desenvolvimento geralmente são obrigadas a usar um gerenciador de pacotes específico. Para facilitar esse processo, o Node.js é fornecido com uma ferramenta chamada [Corepack](/pt/nodejs/api/corepack) que visa tornar todos os gerenciadores de pacotes transparentemente disponíveis em seu ambiente - desde que você tenha o Node.js instalado.

Por padrão, o Corepack não aplicará nenhum gerenciador de pacotes específico e usará as versões genéricas "Last Known Good" associadas a cada versão do Node.js, mas você pode melhorar essa experiência definindo o campo [`"packageManager"`](/pt/nodejs/api/packages#packagemanager) no `package.json` do seu projeto.

## Pontos de entrada do pacote {#package-entry-points}

No arquivo `package.json` de um pacote, dois campos podem definir pontos de entrada para um pacote: [`"main"`](/pt/nodejs/api/packages#main) e [`"exports"`](/pt/nodejs/api/packages#exports). Ambos os campos se aplicam aos pontos de entrada do módulo ES e do módulo CommonJS.

O campo [`"main"`](/pt/nodejs/api/packages#main) é suportado em todas as versões do Node.js, mas suas capacidades são limitadas: ele define apenas o ponto de entrada principal do pacote.

O campo [`"exports"`](/pt/nodejs/api/packages#exports) fornece uma alternativa moderna para [`"main"`](/pt/nodejs/api/packages#main), permitindo que vários pontos de entrada sejam definidos, suporte de resolução de entrada condicional entre ambientes e **impedindo quaisquer outros pontos de entrada além daqueles definidos em <a href="#exports"><code>"exports"</code></a>**. Este encapsulamento permite que os autores do módulo definam claramente a interface pública para seu pacote.

Para novos pacotes destinados às versões atualmente suportadas do Node.js, o campo [`"exports"`](/pt/nodejs/api/packages#exports) é recomendado. Para pacotes que suportam Node.js 10 e versões anteriores, o campo [`"main"`](/pt/nodejs/api/packages#main) é necessário. Se ambos [`"exports"`](/pt/nodejs/api/packages#exports) e [`"main"`](/pt/nodejs/api/packages#main) forem definidos, o campo [`"exports"`](/pt/nodejs/api/packages#exports) terá precedência sobre [`"main"`](/pt/nodejs/api/packages#main) nas versões suportadas do Node.js.

[Exports condicionais](/pt/nodejs/api/packages#conditional-exports) podem ser usados dentro de [`"exports"`](/pt/nodejs/api/packages#exports) para definir diferentes pontos de entrada do pacote por ambiente, incluindo se o pacote é referenciado via `require` ou via `import`. Para obter mais informações sobre como suportar módulos CommonJS e ES em um único pacote, consulte [a seção de pacotes duplos CommonJS/ES](/pt/nodejs/api/packages#dual-commonjses-module-packages).

Pacotes existentes que introduzem o campo [`"exports"`](/pt/nodejs/api/packages#exports) impedirão que os consumidores do pacote usem quaisquer pontos de entrada que não estejam definidos, incluindo o [`package.json`](/pt/nodejs/api/packages#nodejs-packagejson-field-definitions) (por exemplo, `require('your-package/package.json')`). **Isso provavelmente será uma alteração interruptiva.**

Para tornar a introdução de [`"exports"`](/pt/nodejs/api/packages#exports) não interruptiva, certifique-se de que cada ponto de entrada suportado anteriormente seja exportado. É melhor especificar explicitamente os pontos de entrada para que a API pública do pacote seja bem definida. Por exemplo, um projeto que exportava anteriormente `main`, `lib`, `feature` e o `package.json` poderia usar o seguinte `package.exports`:

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/index": "./lib/index.js",
    "./lib/index.js": "./lib/index.js",
    "./feature": "./feature/index.js",
    "./feature/index": "./feature/index.js",
    "./feature/index.js": "./feature/index.js",
    "./package.json": "./package.json"
  }
}
```
Alternativamente, um projeto pode optar por exportar pastas inteiras com e sem subcaminhos estendidos usando padrões de exportação:

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/*": "./lib/*.js",
    "./lib/*.js": "./lib/*.js",
    "./feature": "./feature/index.js",
    "./feature/*": "./feature/*.js",
    "./feature/*.js": "./feature/*.js",
    "./package.json": "./package.json"
  }
}
```
Com o acima fornecendo compatibilidade com versões anteriores para quaisquer versões de pacote menores, uma futura alteração principal para o pacote pode então restringir adequadamente as exports apenas às exports de recursos específicos expostos:

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./feature/*.js": "./feature/*.js",
    "./feature/internal/*": null
  }
}
```

### Exportação do ponto de entrada principal {#main-entry-point-export}

Ao escrever um novo pacote, recomenda-se usar o campo [`"exports"`](/pt/nodejs/api/packages#exports):

```json [JSON]
{
  "exports": "./index.js"
}
```
Quando o campo [`"exports"`](/pt/nodejs/api/packages#exports) é definido, todos os subcaminhos do pacote são encapsulados e deixam de estar disponíveis para os importadores. Por exemplo, `require('pkg/subpath.js')` lança um erro [`ERR_PACKAGE_PATH_NOT_EXPORTED`](/pt/nodejs/api/errors#err_package_path_not_exported).

Este encapsulamento de exportações oferece garantias mais fiáveis sobre as interfaces de pacote para ferramentas e ao lidar com atualizações semver para um pacote. Não é um encapsulamento forte, pois um `require` direto de qualquer subcaminho absoluto do pacote, como `require('/path/to/node_modules/pkg/subpath.js')`, ainda carregará `subpath.js`.

Todas as versões atualmente suportadas do Node.js e as ferramentas de build modernas suportam o campo `"exports"`. Para projetos que usam uma versão mais antiga do Node.js ou uma ferramenta de build relacionada, a compatibilidade pode ser alcançada incluindo o campo `"main"` junto com `"exports"` apontando para o mesmo módulo:

```json [JSON]
{
  "main": "./index.js",
  "exports": "./index.js"
}
```
### Exportações de subcaminho {#subpath-exports}

**Adicionado em: v12.7.0**

Ao usar o campo [`"exports"`](/pt/nodejs/api/packages#exports), subcaminhos personalizados podem ser definidos juntamente com o ponto de entrada principal, tratando o ponto de entrada principal como o subcaminho `"."`:

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./submodule.js": "./src/submodule.js"
  }
}
```
Agora, apenas o subcaminho definido em [`"exports"`](/pt/nodejs/api/packages#exports) pode ser importado por um consumidor:

```js [ESM]
import submodule from 'es-module-package/submodule.js';
// Carrega ./node_modules/es-module-package/src/submodule.js
```
Enquanto outros subcaminhos apresentarão erro:

```js [ESM]
import submodule from 'es-module-package/private-module.js';
// Lança ERR_PACKAGE_PATH_NOT_EXPORTED
```
#### Extensões em subcaminhos {#extensions-in-subpaths}

Os autores do pacote devem fornecer subcaminhos com extensão (`import 'pkg/subpath.js'`) ou sem extensão (`import 'pkg/subpath'`) nas suas exportações. Isso garante que exista apenas um subcaminho para cada módulo exportado, para que todos os dependentes importem o mesmo especificador consistente, mantendo o contrato do pacote claro para os consumidores e simplificando as conclusões do subcaminho do pacote.

Tradicionalmente, os pacotes tendiam a usar o estilo sem extensão, que tem os benefícios de legibilidade e de mascarar o verdadeiro caminho do arquivo dentro do pacote.

Com os [mapas de importação](https://github.com/WICG/import-maps) agora fornecendo um padrão para a resolução de pacotes em navegadores e outros runtimes JavaScript, usar o estilo sem extensão pode resultar em definições de mapa de importação inchadas. Extensões de arquivo explícitas podem evitar esse problema, permitindo que o mapa de importação utilize um [mapeamento de pasta de pacotes](https://github.com/WICG/import-maps#packages-via-trailing-slashes) para mapear vários subcaminhos onde possível, em vez de uma entrada de mapa separada por exportação de subcaminho de pacote. Isso também espelha o requisito de usar [o caminho completo do especificador](/pt/nodejs/api/esm#mandatory-file-extensions) em especificadores de importação relativos e absolutos.


### Açúcar para Exports {#exports-sugar}

**Adicionado em: v12.11.0**

Se o export `"."` é o único export, o campo [`"exports"`](/pt/nodejs/api/packages#exports) fornece um "açúcar sintático" para este caso, sendo o valor direto do campo [`"exports"`](/pt/nodejs/api/packages#exports).

```json [JSON]
{
  "exports": {
    ".": "./index.js"
  }
}
```
pode ser escrito como:

```json [JSON]
{
  "exports": "./index.js"
}
```
### Imports de Subcaminho {#subpath-imports}

**Adicionado em: v14.6.0, v12.19.0**

Além do campo [`"exports"`](/pt/nodejs/api/packages#exports), existe um campo `"imports"` no pacote para criar mapeamentos privados que se aplicam apenas a especificadores de importação de dentro do próprio pacote.

As entradas no campo `"imports"` devem sempre começar com `#` para garantir que sejam diferenciadas dos especificadores de pacote externos.

Por exemplo, o campo imports pode ser usado para obter os benefícios de exports condicionais para módulos internos:

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```
onde `import '#dep'` não obtém a resolução do pacote externo `dep-node-native` (incluindo seus exports, por sua vez) e, em vez disso, obtém o arquivo local `./dep-polyfill.js` relativo ao pacote em outros ambientes.

Ao contrário do campo `"exports"` , o campo `"imports"` permite o mapeamento para pacotes externos.

As regras de resolução para o campo imports são, de outra forma, análogas ao campo exports.

### Padrões de Subcaminho {#subpath-patterns}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v16.10.0, v14.19.0 | Suporte para trailers de padrão no campo "imports". |
| v16.9.0, v14.19.0 | Suporte para trailers de padrão. |
| v14.13.0, v12.20.0 | Adicionado em: v14.13.0, v12.20.0 |
:::

Para pacotes com um pequeno número de exports ou imports, recomendamos listar explicitamente cada entrada de subcaminho de exports. Mas para pacotes que têm um grande número de subcaminhos, isso pode causar inchaço do `package.json` e problemas de manutenção.

Para esses casos de uso, padrões de exportação de subcaminho podem ser usados ​​em vez disso:

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js"
  },
  "imports": {
    "#internal/*.js": "./src/internal/*.js"
  }
}
```
**<code>*</code> os mapeamentos expõem subcaminhos aninhados, pois é apenas uma sintaxe de substituição de string.**

Todas as instâncias de `*` no lado direito serão então substituídas por este valor, incluindo se ele contiver quaisquer separadores `/`.

```js [ESM]
import featureX from 'es-module-package/features/x.js';
// Carrega ./node_modules/es-module-package/src/features/x.js

import featureY from 'es-module-package/features/y/y.js';
// Carrega ./node_modules/es-module-package/src/features/y/y.js

import internalZ from '#internal/z.js';
// Carrega ./node_modules/es-module-package/src/internal/z.js
```
Esta é uma correspondência e substituição estática direta, sem nenhum tratamento especial para extensões de arquivo. Incluir `"*.js"` em ambos os lados do mapeamento restringe os exports do pacote exposto apenas a arquivos JS.

A propriedade dos exports serem estaticamente enumeráveis ​​é mantida com padrões de exports, já que os exports individuais para um pacote podem ser determinados tratando o padrão de destino do lado direito como um glob `**` em relação à lista de arquivos dentro do pacote. Como os caminhos `node_modules` são proibidos nos destinos de exports, essa expansão depende apenas dos arquivos do próprio pacote.

Para excluir subpastas privadas de padrões, destinos `null` podem ser usados:

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js",
    "./features/private-internal/*": null
  }
}
```
```js [ESM]
import featureInternal from 'es-module-package/features/private-internal/m.js';
// Lança: ERR_PACKAGE_PATH_NOT_EXPORTED

import featureX from 'es-module-package/features/x.js';
// Carrega ./node_modules/es-module-package/src/features/x.js
```

### Exportações Condicionais {#conditional-exports}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.7.0, v12.16.0 | Remove a sinalização para exportações condicionais. |
| v13.2.0, v12.16.0 | Adicionado em: v13.2.0, v12.16.0 |
:::

As exportações condicionais fornecem uma maneira de mapear para diferentes caminhos dependendo de certas condições. Elas são suportadas para importações de módulos CommonJS e ES.

Por exemplo, um pacote que deseja fornecer diferentes exportações de módulos ES para `require()` e `import` pode ser escrito:

```json [JSON]
// package.json
{
  "exports": {
    "import": "./index-module.js",
    "require": "./index-require.cjs"
  },
  "type": "module"
}
```
O Node.js implementa as seguintes condições, listadas em ordem da mais específica para a menos específica, conforme as condições devem ser definidas:

- `"node-addons"` - semelhante a `"node"` e corresponde a qualquer ambiente Node.js. Esta condição pode ser usada para fornecer um ponto de entrada que usa addons C++ nativos em oposição a um ponto de entrada que é mais universal e não depende de addons nativos. Esta condição pode ser desativada através da flag [`--no-addons`](/pt/nodejs/api/cli#--no-addons).
- `"node"` - corresponde a qualquer ambiente Node.js. Pode ser um arquivo CommonJS ou módulo ES. *Na maioria dos casos, chamar explicitamente a plataforma Node.js não é necessário.*
- `"import"` - corresponde quando o pacote é carregado via `import` ou `import()`, ou via qualquer operação de importação ou resolução de nível superior pelo carregador de módulos ECMAScript. Aplica-se independentemente do formato do módulo do arquivo de destino. *Sempre mutuamente exclusivo com <code>"require"</code>.*
- `"require"` - corresponde quando o pacote é carregado via `require()`. O arquivo referenciado deve ser carregável com `require()`, embora a condição corresponda independentemente do formato do módulo do arquivo de destino. Os formatos esperados incluem CommonJS, JSON, addons nativos e módulos ES. *Sempre mutuamente exclusivo com <code>"import"</code>.*
- `"module-sync"` - corresponde, não importa se o pacote é carregado via `import`, `import()` ou `require()`. Espera-se que o formato seja de módulos ES que não contenham await de nível superior em seu gráfico de módulos - se contiver, `ERR_REQUIRE_ASYNC_MODULE` será lançado quando o módulo for `require()`-ed.
- `"default"` - o fallback genérico que sempre corresponde. Pode ser um arquivo CommonJS ou módulo ES. *Esta condição deve sempre vir por último.*

Dentro do objeto [`"exports"`](/pt/nodejs/api/packages#exports), a ordem das chaves é significativa. Durante a correspondência de condições, as entradas anteriores têm maior prioridade e precedem as entradas posteriores. *A regra geral é que as condições devem ser da mais específica para a menos específica na ordem do objeto*.

Usar as condições `"import"` e `"require"` pode levar a alguns perigos, que são explicados mais detalhadamente na [seção de pacotes de módulo CommonJS/ES duplos](/pt/nodejs/api/packages#dual-commonjses-module-packages).

A condição `"node-addons"` pode ser usada para fornecer um ponto de entrada que usa addons C++ nativos. No entanto, esta condição pode ser desativada através da flag [`--no-addons`](/pt/nodejs/api/cli#--no-addons). Ao usar `"node-addons"`, recomenda-se tratar `"default"` como um aprimoramento que fornece um ponto de entrada mais universal, por exemplo, usando WebAssembly em vez de um addon nativo.

As exportações condicionais também podem ser estendidas para subcaminhos de exportação, por exemplo:

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./feature.js": {
      "node": "./feature-node.js",
      "default": "./feature.js"
    }
  }
}
```
Define um pacote onde `require('pkg/feature.js')` e `import 'pkg/feature.js'` podem fornecer implementações diferentes entre Node.js e outros ambientes JS.

Ao usar branches de ambiente, sempre inclua uma condição `"default"` sempre que possível. Fornecer uma condição `"default"` garante que quaisquer ambientes JS desconhecidos sejam capazes de usar esta implementação universal, o que ajuda a evitar que esses ambientes JS tenham que fingir ser ambientes existentes para suportar pacotes com exportações condicionais. Por este motivo, usar branches de condição `"node"` e `"default"` é geralmente preferível a usar branches de condição `"node"` e `"browser"`.


### Condições aninhadas {#nested-conditions}

Além dos mapeamentos diretos, o Node.js também suporta objetos de condição aninhados.

Por exemplo, para definir um pacote que tenha apenas pontos de entrada de modo duplo para uso no Node.js, mas não no navegador:

```json [JSON]
{
  "exports": {
    "node": {
      "import": "./feature-node.mjs",
      "require": "./feature-node.cjs"
    },
    "default": "./feature.mjs"
  }
}
```
As condições continuam a ser correspondidas em ordem, como com condições planas. Se uma condição aninhada não tiver nenhum mapeamento, ela continuará verificando as condições restantes da condição pai. Desta forma, as condições aninhadas se comportam analogamente às instruções `if` aninhadas do JavaScript.

### Resolvendo condições do usuário {#resolving-user-conditions}

**Adicionado em: v14.9.0, v12.19.0**

Ao executar o Node.js, condições de usuário personalizadas podem ser adicionadas com a flag `--conditions`:

```bash [BASH]
node --conditions=development index.js
```
o que resolveria a condição `"development"` nas importações e exportações de pacotes, enquanto resolve as condições existentes `"node"`, `"node-addons"`, `"default"`, `"import"` e `"require"` conforme apropriado.

Qualquer número de condições personalizadas pode ser definido com flags repetidas.

Condições típicas devem conter apenas caracteres alfanuméricos, usando ":", "-" ou "=" como separadores, se necessário. Qualquer outra coisa pode gerar problemas de compatibilidade fora do Node.

No Node, as condições têm poucas restrições, mas especificamente estas incluem:

### Definições de Condições da Comunidade {#community-conditions-definitions}

Strings de condição diferentes das condições `"import"`, `"require"`, `"node"`, `"module-sync"`, `"node-addons"` e `"default"` [implementadas no núcleo do Node.js](/pt/nodejs/api/packages#conditional-exports) são ignoradas por padrão.

Outras plataformas podem implementar outras condições e as condições do usuário podem ser habilitadas no Node.js através da flag [`--conditions` / `-C`](/pt/nodejs/api/packages#resolving-user-conditions).

Como as condições de pacote personalizadas exigem definições claras para garantir o uso correto, uma lista de condições de pacote conhecidas comuns e suas definições estritas é fornecida abaixo para auxiliar na coordenação do ecossistema.

- `"types"` - pode ser usado por sistemas de tipagem para resolver o arquivo de tipagem para a exportação fornecida. *Esta condição deve sempre ser incluída primeiro.*
- `"browser"` - qualquer ambiente de navegador web.
- `"development"` - pode ser usado para definir um ponto de entrada de ambiente somente para desenvolvimento, por exemplo, para fornecer contexto de depuração adicional, como melhores mensagens de erro ao executar em um modo de desenvolvimento. *Deve sempre ser mutuamente exclusivo com <code>"production"</code>.*
- `"production"` - pode ser usado para definir um ponto de entrada de ambiente de produção. *Deve sempre ser mutuamente exclusivo com <code>"development"</code>.*

Para outros runtimes, as definições de chaves de condição específicas da plataforma são mantidas pelo [WinterCG](https://wintercg.org/) na especificação da proposta [Chaves de Runtime](https://runtime-keys.proposal.wintercg.org/).

Novas definições de condições podem ser adicionadas a esta lista criando uma solicitação pull para a [documentação do Node.js para esta seção](https://github.com/nodejs/node/blob/HEAD/doc/api/packages.md#conditions-definitions). Os requisitos para listar uma nova definição de condição aqui são:

- A definição deve ser clara e inequívoca para todos os implementadores.
- O caso de uso para o motivo pelo qual a condição é necessária deve ser claramente justificado.
- Deve existir uso de implementação existente suficiente.
- O nome da condição não deve entrar em conflito com outra definição de condição ou condição em uso amplo.
- A listagem da definição da condição deve fornecer um benefício de coordenação ao ecossistema que não seria possível de outra forma. Por exemplo, este não seria necessariamente o caso para condições específicas da empresa ou específicas da aplicação.
- A condição deve ser tal que um usuário do Node.js esperaria que estivesse na documentação principal do Node.js. A condição `"types"` é um bom exemplo: Ela realmente não pertence à proposta [Chaves de Runtime](https://runtime-keys.proposal.wintercg.org/), mas é uma boa opção aqui nos documentos do Node.js.

As definições acima podem ser movidas para um registro de condições dedicado em devido tempo.


### Auto-referenciando um pacote usando seu nome {#self-referencing-a-package-using-its-name}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.6.0, v12.16.0 | Removeu a flag de auto-referenciação de um pacote usando seu nome. |
| v13.1.0, v12.16.0 | Adicionado em: v13.1.0, v12.16.0 |
:::

Dentro de um pacote, os valores definidos no campo [`"exports"`](/pt/nodejs/api/packages#exports) do `package.json` do pacote podem ser referenciados através do nome do pacote. Por exemplo, assumindo que o `package.json` seja:

```json [JSON]
// package.json
{
  "name": "a-package",
  "exports": {
    ".": "./index.mjs",
    "./foo.js": "./foo.js"
  }
}
```
Então, qualquer módulo *nesse pacote* pode referenciar uma exportação no próprio pacote:

```js [ESM]
// ./a-module.mjs
import { something } from 'a-package'; // Importa "something" de ./index.mjs.
```
A auto-referenciação está disponível apenas se o `package.json` tiver [`"exports"`](/pt/nodejs/api/packages#exports), e permitirá importar apenas o que esse [`"exports"`](/pt/nodejs/api/packages#exports) (no `package.json`) permitir. Portanto, o código abaixo, dado o pacote anterior, irá gerar um erro de tempo de execução:

```js [ESM]
// ./another-module.mjs

// Importa "another" de ./m.mjs. Falha porque
// o campo "exports" do "package.json"
// não fornece uma exportação chamada "./m.mjs".
import { another } from 'a-package/m.mjs';
```
A auto-referenciação também está disponível ao usar `require`, tanto em um módulo ES quanto em um CommonJS. Por exemplo, este código também funcionará:

```js [CJS]
// ./a-module.js
const { something } = require('a-package/foo.js'); // Carrega de ./foo.js.
```
Finalmente, a auto-referenciação também funciona com pacotes com escopo. Por exemplo, este código também funcionará:

```json [JSON]
// package.json
{
  "name": "@my/package",
  "exports": "./index.js"
}
```
```js [CJS]
// ./index.js
module.exports = 42;
```
```js [CJS]
// ./other.js
console.log(require('@my/package'));
```
```bash [BASH]
$ node other.js
42
```
## Pacotes duplos CommonJS/ES module {#dual-commonjs/es-module-packages}

Veja [o repositório de exemplos de pacotes](https://github.com/nodejs/package-examples) para mais detalhes.

## Definições de campos `package.json` do Node.js {#nodejs-packagejson-field-definitions}

Esta seção descreve os campos usados pelo runtime do Node.js. Outras ferramentas (como o [npm](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)) usam campos adicionais que são ignorados pelo Node.js e não são documentados aqui.

Os seguintes campos nos arquivos `package.json` são usados no Node.js:

- [`"name"`](/pt/nodejs/api/packages#name) - Relevante ao usar importações nomeadas dentro de um pacote. Também usado por gerenciadores de pacotes como o nome do pacote.
- [`"main"`](/pt/nodejs/api/packages#main) - O módulo padrão ao carregar o pacote, se exports não for especificado, e em versões do Node.js anteriores à introdução de exports.
- [`"packageManager"`](/pt/nodejs/api/packages#packagemanager) - O gerenciador de pacotes recomendado ao contribuir para o pacote. Aproveitado pelos shims do [Corepack](/pt/nodejs/api/corepack).
- [`"type"`](/pt/nodejs/api/packages#type) - O tipo de pacote que determina se os arquivos `.js` devem ser carregados como CommonJS ou módulos ES.
- [`"exports"`](/pt/nodejs/api/packages#exports) - Exportações de pacotes e exportações condicionais. Quando presente, limita quais submodules podem ser carregados de dentro do pacote.
- [`"imports"`](/pt/nodejs/api/packages#imports) - Importações de pacotes, para uso por módulos dentro do próprio pacote.


### `"name"` {#"name"}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.6.0, v12.16.0 | Remove a opção `--experimental-resolve-self`. |
| v13.1.0, v12.16.0 | Adicionado em: v13.1.0, v12.16.0 |
:::

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "name": "nome-do-pacote"
}
```
O campo `"name"` define o nome do seu pacote. A publicação no registro *npm* exige um nome que satisfaça [certos requisitos](https://docs.npmjs.com/files/package.json#name).

O campo `"name"` pode ser usado em adição ao campo [`"exports"`](/pt/nodejs/api/packages#exports) para [auto-referenciar](/pt/nodejs/api/packages#self-referencing-a-package-using-its-name) um pacote usando seu nome.

### `"main"` {#"main"}

**Adicionado em: v0.4.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "main": "./index.js"
}
```
O campo `"main"` define o ponto de entrada de um pacote quando importado por nome através de uma pesquisa `node_modules`. Seu valor é um caminho.

Quando um pacote tem um campo [`"exports"`](/pt/nodejs/api/packages#exports), este terá precedência sobre o campo `"main"` ao importar o pacote por nome.

Ele também define o script que é usado quando o [diretório do pacote é carregado via `require()` ](/pt/nodejs/api/modules#folders-as-modules).

```js [CJS]
// Isso resolve para ./path/to/directory/index.js.
require('./path/to/directory');
```
### `"packageManager"` {#"packagemanager"}

**Adicionado em: v16.9.0, v14.19.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "packageManager": "<nome do gerenciador de pacotes>@<versão>"
}
```
O campo `"packageManager"` define qual gerenciador de pacotes deve ser usado ao trabalhar no projeto atual. Ele pode ser definido para qualquer um dos [gerenciadores de pacotes suportados](/pt/nodejs/api/corepack#supported-package-managers) e garantirá que suas equipes usem exatamente as mesmas versões do gerenciador de pacotes sem ter que instalar nada além do Node.js.

Este campo é atualmente experimental e precisa ser aceito; consulte a página [Corepack](/pt/nodejs/api/corepack) para obter detalhes sobre o procedimento.


### `"type"` {#"type"}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.2.0, v12.17.0 | Remove a flag `--experimental-modules`. |
| v12.0.0 | Adicionado em: v12.0.0 |
:::

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O campo `"type"` define o formato de módulo que o Node.js usa para todos os arquivos `.js` que têm esse arquivo `package.json` como seu pai mais próximo.

Arquivos terminados em `.js` são carregados como módulos ES quando o arquivo `package.json` pai mais próximo contém um campo de nível superior `"type"` com um valor de `"module"`.

O `package.json` pai mais próximo é definido como o primeiro `package.json` encontrado ao pesquisar na pasta atual, na pasta pai dessa pasta e assim por diante até que uma pasta node_modules ou a raiz do volume seja alcançada.

```json [JSON]
// package.json
{
  "type": "module"
}
```
```bash [BASH]
# Na mesma pasta que o package.json anterior {#in-same-folder-as-preceding-packagejson}
node my-app.js # Executa como módulo ES
```
Se o `package.json` pai mais próximo não tiver um campo `"type"`, ou contiver `"type": "commonjs"`, os arquivos `.js` são tratados como [CommonJS](/pt/nodejs/api/modules). Se a raiz do volume for alcançada e nenhum `package.json` for encontrado, os arquivos `.js` serão tratados como [CommonJS](/pt/nodejs/api/modules).

As declarações `import` de arquivos `.js` são tratadas como módulos ES se o `package.json` pai mais próximo contiver `"type": "module"`.

```js [ESM]
// my-app.js, parte do mesmo exemplo acima
import './startup.js'; // Carregado como módulo ES devido ao package.json
```
Independentemente do valor do campo `"type"`, os arquivos `.mjs` são sempre tratados como módulos ES e os arquivos `.cjs` são sempre tratados como CommonJS.

### `"exports"` {#"exports"}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.13.0, v12.20.0 | Adiciona suporte para padrões `"exports"`. |
| v13.7.0, v12.17.0 | Remove a flag de exports condicionais. |
| v13.7.0, v12.16.0 | Implementa a ordenação lógica de exports condicionais. |
| v13.7.0, v12.16.0 | Remove a opção `--experimental-conditional-exports`. Em 12.16.0, os exports condicionais ainda estão atrás de `--experimental-modules`. |
| v13.2.0, v12.16.0 | Implementa exports condicionais. |
| v12.7.0 | Adicionado em: v12.7.0 |
:::

- Tipo: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "exports": "./index.js"
}
```
O campo `"exports"` permite definir os [pontos de entrada](/pt/nodejs/api/packages#package-entry-points) de um pacote quando importado por nome carregado via uma pesquisa `node_modules` ou uma [auto-referência](/pt/nodejs/api/packages#self-referencing-a-package-using-its-name) ao seu próprio nome. Ele é suportado no Node.js 12+ como uma alternativa ao [`"main"`](/pt/nodejs/api/packages#main) que pode suportar a definição de [exports de subcaminho](/pt/nodejs/api/packages#subpath-exports) e [exports condicionais](/pt/nodejs/api/packages#conditional-exports), enquanto encapsula módulos internos não exportados.

[Exports Condicionais](/pt/nodejs/api/packages#conditional-exports) também podem ser usados ​​dentro de `"exports"` para definir diferentes pontos de entrada do pacote por ambiente, incluindo se o pacote é referenciado via `require` ou via `import`.

Todos os caminhos definidos em `"exports"` devem ser URLs de arquivos relativos começando com `./`.


### `"imports"` {#"imports"}

**Adicionado em: v14.6.0, v12.19.0**

- Tipo: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```
As entradas no campo imports devem ser strings que começam com `#`.

As importações de pacotes permitem o mapeamento para pacotes externos.

Este campo define [importações de subcaminho](/pt/nodejs/api/packages#subpath-imports) para o pacote atual.

