---
title: Módulos ECMAScript no Node.js
description: Esta página fornece documentação detalhada sobre como usar módulos ECMAScript (ESM) no Node.js, incluindo a resolução de módulos, a sintaxe de importação e exportação, e a compatibilidade com CommonJS.
head:
  - - meta
    - name: og:title
      content: Módulos ECMAScript no Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta página fornece documentação detalhada sobre como usar módulos ECMAScript (ESM) no Node.js, incluindo a resolução de módulos, a sintaxe de importação e exportação, e a compatibilidade com CommonJS.
  - - meta
    - name: twitter:title
      content: Módulos ECMAScript no Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta página fornece documentação detalhada sobre como usar módulos ECMAScript (ESM) no Node.js, incluindo a resolução de módulos, a sintaxe de importação e exportação, e a compatibilidade com CommonJS.
---


# Módulos: Módulos ECMAScript {#modules-ecmascript-modules}

::: info [Histórico]
| Versão | Mudanças |
|---|---|
| v23.1.0 | Os atributos de importação não são mais experimentais. |
| v22.0.0 | Removido o suporte para asserções de importação. |
| v21.0.0, v20.10.0, v18.20.0 | Adicionado suporte experimental para atributos de importação. |
| v20.0.0, v18.19.0 | Os hooks de personalização de módulo são executados fora da thread principal. |
| v18.6.0, v16.17.0 | Adicionado suporte para encadeamento de hooks de personalização de módulo. |
| v17.1.0, v16.14.0 | Adicionado suporte experimental para asserções de importação. |
| v17.0.0, v16.12.0 | Consolidar hooks de personalização, removeu os hooks `getFormat`, `getSource`, `transformSource` e `getGlobalPreloadCode`, adicionou os hooks `load` e `globalPreload`, permitindo retornar `format` de ambos os hooks `resolve` ou `load`. |
| v14.8.0 | Removeu o sinalizador de Await de nível superior. |
| v15.3.0, v14.17.0, v12.22.0 | Estabilizou a implementação de módulos. |
| v14.13.0, v12.20.0 | Suporte para detecção de exportações nomeadas CommonJS. |
| v14.0.0, v13.14.0, v12.20.0 | Removeu o aviso de módulos experimentais. |
| v13.2.0, v12.17.0 | Carregar módulos ECMAScript não requer mais um sinalizador de linha de comando. |
| v12.0.0 | Adicionado suporte para módulos ES usando a extensão de arquivo `.js` por meio do campo `"type"` do `package.json`. |
| v8.5.0 | Adicionado em: v8.5.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

## Introdução {#introduction}

Módulos ECMAScript são [o formato padrão oficial](https://tc39.github.io/ecma262/#sec-modules) para empacotar código JavaScript para reutilização. Os módulos são definidos usando uma variedade de instruções [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) e [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).

O exemplo a seguir de um módulo ES exporta uma função:

```js [ESM]
// addTwo.mjs
function addTwo(num) {
  return num + 2;
}

export { addTwo };
```
O exemplo a seguir de um módulo ES importa a função de `addTwo.mjs`:

```js [ESM]
// app.mjs
import { addTwo } from './addTwo.mjs';

// Imprime: 6
console.log(addTwo(4));
```
O Node.js oferece suporte total aos módulos ECMAScript conforme especificado atualmente e fornece interoperabilidade entre eles e seu formato de módulo original, [CommonJS](/pt/nodejs/api/modules).


## Habilitação {#enabling}

Node.js possui dois sistemas de módulos: módulos [CommonJS](/pt/nodejs/api/modules) e módulos ECMAScript.

Autores podem instruir o Node.js a interpretar JavaScript como um módulo ES através da extensão de arquivo `.mjs`, do campo [`"type"`](/pt/nodejs/api/packages#type) em `package.json` com o valor `"module"`, ou da flag [`--input-type`](/pt/nodejs/api/cli#--input-typetype) com o valor `"module"`. Estes são marcadores explícitos de que o código se destina a ser executado como um módulo ES.

Inversamente, autores podem instruir explicitamente o Node.js a interpretar JavaScript como CommonJS através da extensão de arquivo `.cjs`, do campo [`"type"`](/pt/nodejs/api/packages#type) em `package.json` com o valor `"commonjs"`, ou da flag [`--input-type`](/pt/nodejs/api/cli#--input-typetype) com o valor `"commonjs"`.

Quando o código não possui marcadores explícitos para nenhum dos sistemas de módulos, o Node.js inspecionará o código-fonte de um módulo para procurar a sintaxe do módulo ES. Se tal sintaxe for encontrada, o Node.js executará o código como um módulo ES; caso contrário, ele executará o módulo como CommonJS. Consulte [Determinando o sistema de módulos](/pt/nodejs/api/packages#determining-module-system) para obter mais detalhes.

## Pacotes {#packages}

Esta seção foi movida para [Módulos: Pacotes](/pt/nodejs/api/packages).

## Especificadores de `import` {#import-specifiers}

### Terminologia {#terminology}

O *especificador* de uma declaração `import` é a string após a palavra-chave `from`, por exemplo, `'node:path'` em `import { sep } from 'node:path'`. Especificadores também são usados em declarações `export from`, e como o argumento para uma expressão `import()`.

Existem três tipos de especificadores:

-  *Especificadores relativos* como `'./startup.js'` ou `'../config.mjs'`. Eles se referem a um caminho relativo à localização do arquivo de importação. *A extensão do arquivo
é sempre necessária para estes.*
-  *Especificadores bare* como `'some-package'` ou `'some-package/shuffle'`. Eles podem se referir ao ponto de entrada principal de um pacote pelo nome do pacote, ou um módulo de recurso específico dentro de um pacote prefixado pelo nome do pacote, conforme os exemplos, respectivamente. *Incluir a extensão do arquivo só é necessário
para pacotes sem um campo <a href="packages.html#exports"><code>"exports"</code></a>.*
-  *Especificadores absolutos* como `'file:///opt/nodejs/config.js'`. Eles se referem direta e explicitamente a um caminho completo.

As resoluções de especificadores bare são tratadas pelo [algoritmo de resolução e carregamento de módulos do Node.js](/pt/nodejs/api/esm#resolution-algorithm-specification). Todas as outras resoluções de especificadores são sempre resolvidas apenas com a semântica padrão de resolução de [URL](https://url.spec.whatwg.org/) relativa.

Como no CommonJS, arquivos de módulo dentro de pacotes podem ser acessados anexando um caminho ao nome do pacote, a menos que o [`package.json`](/pt/nodejs/api/packages#nodejs-packagejson-field-definitions) do pacote contenha um campo [`"exports"`](/pt/nodejs/api/packages#exports), caso em que arquivos dentro de pacotes só podem ser acessados através dos caminhos definidos em [`"exports"`](/pt/nodejs/api/packages#exports).

Para obter detalhes sobre essas regras de resolução de pacotes que se aplicam a especificadores bare na resolução de módulos do Node.js, consulte a [documentação de pacotes](/pt/nodejs/api/packages).


### Extensões de arquivo obrigatórias {#mandatory-file-extensions}

Uma extensão de arquivo deve ser fornecida ao usar a palavra-chave `import` para resolver especificadores relativos ou absolutos. Índices de diretório (por exemplo, `'./startup/index.js'`) também devem ser totalmente especificados.

Este comportamento corresponde a como o `import` se comporta em ambientes de navegador, assumindo um servidor configurado tipicamente.

### URLs {#urls}

Módulos ES são resolvidos e armazenados em cache como URLs. Isso significa que caracteres especiais devem ser [codificados em porcentagem](/pt/nodejs/api/url#percent-encoding-in-urls), como `#` com `%23` e `?` com `%3F`.

Esquemas de URL `file:`, `node:` e `data:` são suportados. Um especificador como `'https://example.com/app.js'` não é suportado nativamente no Node.js, a menos que usando um [carregador HTTPS personalizado](/pt/nodejs/api/module#import-from-https).

#### URLs `file:` {#file-urls}

Módulos são carregados várias vezes se o especificador `import` usado para resolvê-los tiver uma consulta ou fragmento diferente.

```js [ESM]
import './foo.mjs?query=1'; // carrega ./foo.mjs com consulta de "?query=1"
import './foo.mjs?query=2'; // carrega ./foo.mjs com consulta de "?query=2"
```
A raiz do volume pode ser referenciada via `/`, `//` ou `file:///`. Dadas as diferenças entre [URL](https://url.spec.whatwg.org/) e resolução de caminho (como detalhes de codificação de porcentagem), é recomendado usar [url.pathToFileURL](/pt/nodejs/api/url#urlpathtofileurlpath-options) ao importar um caminho.

#### Imports `data:` {#data-imports}

**Adicionado em: v12.10.0**

[`data: URLs`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) são suportados para importar com os seguintes tipos MIME:

- `text/javascript` para módulos ES
- `application/json` para JSON
- `application/wasm` para Wasm

```js [ESM]
import 'data:text/javascript,console.log("hello!");';
import _ from 'data:application/json,"world!"' with { type: 'json' };
```
URLs `data:` apenas resolvem [especificadores bare](/pt/nodejs/api/esm#terminology) para módulos internos e [especificadores absolutos](/pt/nodejs/api/esm#terminology). Resolver [especificadores relativos](/pt/nodejs/api/esm#terminology) não funciona porque `data:` não é um [esquema especial](https://url.spec.whatwg.org/#special-scheme). Por exemplo, tentar carregar `./foo` de `data:text/javascript,import "./foo";` falha ao resolver porque não há conceito de resolução relativa para URLs `data:`.


#### `node:` imports {#node-imports}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0, v14.18.0 | Adicionado suporte a importação `node:` para `require(...)`. |
| v14.13.1, v12.20.0 | Adicionado em: v14.13.1, v12.20.0 |
:::

URLs `node:` são suportadas como um meio alternativo para carregar módulos integrados do Node.js. Esse esquema de URL permite que os módulos integrados sejam referenciados por strings de URL absolutas válidas.

```js [ESM]
import fs from 'node:fs/promises';
```
## Atributos de importação {#import-attributes}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.0.0, v20.10.0, v18.20.0 | Mudança de Declarações de Importação para Atributos de Importação. |
| v17.1.0, v16.14.0 | Adicionado em: v17.1.0, v16.14.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

[Atributos de importação](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) são uma sintaxe inline para declarações de importação de módulos para transmitir mais informações juntamente com o especificador de módulo.

```js [ESM]
import fooData from './foo.json' with { type: 'json' };

const { default: barData } =
  await import('./bar.json', { with: { type: 'json' } });
```
Node.js suporta apenas o atributo `type`, para o qual suporta os seguintes valores:

| Atributo   `type` | Necessário para |
| --- | --- |
| `'json'` | [Módulos JSON](/pt/nodejs/api/esm#json-modules) |
O atributo `type: 'json'` é obrigatório ao importar módulos JSON.

## Módulos integrados {#built-in-modules}

[Módulos integrados](/pt/nodejs/api/modules#built-in-modules) fornecem exportações nomeadas de sua API pública. Uma exportação padrão também é fornecida, que é o valor das exportações CommonJS. A exportação padrão pode ser usada, entre outras coisas, para modificar as exportações nomeadas. As exportações nomeadas de módulos integrados são atualizadas apenas chamando [`module.syncBuiltinESMExports()`](/pt/nodejs/api/module#modulesyncbuiltinesmexports).

```js [ESM]
import EventEmitter from 'node:events';
const e = new EventEmitter();
```
```js [ESM]
import { readFile } from 'node:fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```
```js [ESM]
import fs, { readFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { Buffer } from 'node:buffer';

fs.readFileSync = () => Buffer.from('Hello, ESM');
syncBuiltinESMExports();

fs.readFileSync === readFileSync;
```

## Expressões `import()` {#import-expressions}

O [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) dinâmico é suportado em módulos CommonJS e ES. Em módulos CommonJS, ele pode ser usado para carregar módulos ES.

## `import.meta` {#importmeta}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

A meta propriedade `import.meta` é um `Object` que contém as seguintes propriedades. Ele é suportado apenas em módulos ES.

### `import.meta.dirname` {#importmetadirname}

**Adicionado em: v21.2.0, v20.11.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).2 - Candidato ao lançamento
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do diretório do módulo atual. Isso é o mesmo que o [`path.dirname()`](/pt/nodejs/api/path#pathdirnamepath) de [`import.meta.filename`](/pt/nodejs/api/esm#importmetafilename).

### `import.meta.filename` {#importmetafilename}

**Adicionado em: v21.2.0, v20.11.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).2 - Candidato ao lançamento
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O caminho absoluto completo e o nome do arquivo do módulo atual, com os links simbólicos resolvidos.
- Isso é o mesmo que o [`url.fileURLToPath()`](/pt/nodejs/api/url#urlfileurltopathurl-options) de [`import.meta.url`](/pt/nodejs/api/esm#importmetaurl).

### `import.meta.url` {#importmetaurl}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O `file:` URL absoluto do módulo.

Isso é definido exatamente da mesma forma que nos navegadores, fornecendo o URL do arquivo do módulo atual.

Isso permite padrões úteis, como o carregamento relativo de arquivos:

```js [ESM]
import { readFileSync } from 'node:fs';
const buffer = readFileSync(new URL('./data.proto', import.meta.url));
```
### `import.meta.resolve(specifier)` {#importmetaresolvespecifier}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.6.0, v18.19.0 | Não está mais atrás da flag de CLI `--experimental-import-meta-resolve`, exceto para o parâmetro `parentURL` não padronizado. |
| v20.6.0, v18.19.0 | Esta API não lança mais um erro ao direcionar URLs `file:` que não mapeiam para um arquivo existente no FS local. |
| v20.0.0, v18.19.0 | Esta API agora retorna uma string de forma síncrona em vez de uma Promise. |
| v16.2.0, v14.18.0 | Adicionado suporte para o objeto WHATWG `URL` ao parâmetro `parentURL`. |
| v13.9.0, v12.16.2 | Adicionado em: v13.9.0, v12.16.2 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).2 - Candidato ao lançamento
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O especificador de módulo para resolver em relação ao módulo atual.
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A string de URL absoluta para a qual o especificador seria resolvido.

[`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) é uma função de resolução relativa ao módulo com escopo para cada módulo, retornando a string de URL.

```js [ESM]
const dependencyAsset = import.meta.resolve('component-lib/asset.css');
// file:///app/node_modules/component-lib/asset.css
import.meta.resolve('./dep.js');
// file:///app/dep.js
```
Todos os recursos da resolução de módulo do Node.js são suportados. As resoluções de dependência estão sujeitas às resoluções de exportações permitidas dentro do pacote.

**Advertências**:

- Isso pode resultar em operações síncronas do sistema de arquivos, o que pode impactar o desempenho de forma semelhante ao `require.resolve`.
- Este recurso não está disponível em carregadores personalizados (criaria um deadlock).

**API não padronizada**:

Ao usar a flag `--experimental-import-meta-resolve`, essa função aceita um segundo argumento:

- `parent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Um URL de módulo pai absoluto opcional para resolver a partir de. **Padrão:** `import.meta.url`


## Interoperabilidade com CommonJS {#interoperability-with-commonjs}

### Declarações `import` {#import-statements}

Uma declaração `import` pode referenciar um módulo ES ou um módulo CommonJS. As declarações `import` são permitidas apenas em módulos ES, mas as expressões dinâmicas [`import()`](/pt/nodejs/api/esm#import-expressions) são suportadas em CommonJS para carregar módulos ES.

Ao importar [módulos CommonJS](/pt/nodejs/api/esm#commonjs-namespaces), o objeto `module.exports` é fornecido como a exportação padrão. As exportações nomeadas podem estar disponíveis, fornecidas por análise estática como uma conveniência para melhor compatibilidade com o ecossistema.

### `require` {#require}

O módulo CommonJS `require` atualmente suporta apenas o carregamento de módulos ES síncronos (ou seja, módulos ES que não usam `await` de nível superior).

Consulte [Carregando módulos ECMAScript usando `require()`](/pt/nodejs/api/modules#loading-ecmascript-modules-using-require) para obter detalhes.

### Namespaces CommonJS {#commonjs-namespaces}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | Adicionado o marcador de exportação `'module.exports'` aos namespaces CJS. |
| v14.13.0 | Adicionado em: v14.13.0 |
:::

Os módulos CommonJS consistem em um objeto `module.exports` que pode ser de qualquer tipo.

Para suportar isso, ao importar CommonJS de um módulo ECMAScript, um wrapper de namespace para o módulo CommonJS é construído, que sempre fornece uma chave de exportação `default` apontando para o valor `module.exports` do CommonJS.

Além disso, uma análise estática heurística é realizada no texto de origem do módulo CommonJS para obter uma lista estática de melhor esforço de exportações para fornecer no namespace a partir de valores em `module.exports`. Isso é necessário, pois esses namespaces devem ser construídos antes da avaliação do módulo CJS.

Esses objetos de namespace CommonJS também fornecem a exportação `default` como uma exportação nomeada `'module.exports'`, a fim de indicar inequivocamente que sua representação em CommonJS usa este valor e não o valor do namespace. Isso espelha a semântica do tratamento do nome de exportação `'module.exports'` no suporte de interop [`require(esm)`](/pt/nodejs/api/modules#loading-ecmascript-modules-using-require).

Ao importar um módulo CommonJS, ele pode ser importado de forma confiável usando a importação padrão do módulo ES ou sua sintaxe abreviada correspondente:

```js [ESM]
import { default as cjs } from 'cjs';
// Idêntico ao acima
import cjsSugar from 'cjs';

console.log(cjs);
console.log(cjs === cjsSugar);
// Imprime:
//   <module.exports>
//   true
```
Este Objeto Exótico de Namespace de Módulo pode ser observado diretamente ao usar `import * as m from 'cjs'` ou uma importação dinâmica:

```js [ESM]
import * as m from 'cjs';
console.log(m);
console.log(m === await import('cjs'));
// Imprime:
//   [Module] { default: <module.exports>, 'module.exports': <module.exports> }
//   true
```
Para melhor compatibilidade com o uso existente no ecossistema JS, o Node.js também tenta determinar as exportações nomeadas do CommonJS de cada módulo CommonJS importado para fornecê-las como exportações separadas do módulo ES usando um processo de análise estática.

Por exemplo, considere um módulo CommonJS escrito:

```js [CJS]
// cjs.cjs
exports.name = 'exported';
```
O módulo precedente suporta importações nomeadas em módulos ES:

```js [ESM]
import { name } from './cjs.cjs';
console.log(name);
// Imprime: 'exported'

import cjs from './cjs.cjs';
console.log(cjs);
// Imprime: { name: 'exported' }

import * as m from './cjs.cjs';
console.log(m);
// Imprime:
//   [Module] {
//     default: { name: 'exported' },
//     'module.exports': { name: 'exported' },
//     name: 'exported'
//   }
```
Como pode ser visto no último exemplo do Objeto Exótico de Namespace de Módulo sendo registrado, a exportação `name` é copiada do objeto `module.exports` e definida diretamente no namespace do módulo ES quando o módulo é importado.

Atualizações de vinculação ativa ou novas exportações adicionadas a `module.exports` não são detectadas para essas exportações nomeadas.

A detecção de exportações nomeadas é baseada em padrões de sintaxe comuns, mas nem sempre detecta corretamente as exportações nomeadas. Nesses casos, usar a forma de importação padrão descrita acima pode ser uma opção melhor.

A detecção de exportações nomeadas cobre muitos padrões de exportação comuns, padrões de reexportação e saídas de ferramentas de construção e transpiladores. Consulte [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer/tree/1.2.2) para obter a semântica exata implementada.


### Diferenças entre módulos ES e CommonJS {#differences-between-es-modules-and-commonjs}

#### Sem `require`, `exports` ou `module.exports` {#no-require-exports-or-moduleexports}

Na maioria dos casos, o `import` do módulo ES pode ser usado para carregar módulos CommonJS.

Se necessário, uma função `require` pode ser construída dentro de um módulo ES usando [`module.createRequire()`](/pt/nodejs/api/module#modulecreaterequirefilename).

#### Sem `__filename` ou `__dirname` {#no-__filename-or-__dirname}

Essas variáveis do CommonJS não estão disponíveis em módulos ES.

Os casos de uso de `__filename` e `__dirname` podem ser replicados através de [`import.meta.filename`](/pt/nodejs/api/esm#importmetafilename) e [`import.meta.dirname`](/pt/nodejs/api/esm#importmetadirname).

#### Sem Carregamento de Addons {#no-addon-loading}

[Addons](/pt/nodejs/api/addons) não são atualmente suportados com importações de módulos ES.

Em vez disso, eles podem ser carregados com [`module.createRequire()`](/pt/nodejs/api/module#modulecreaterequirefilename) ou [`process.dlopen`](/pt/nodejs/api/process#processdlopenmodule-filename-flags).

#### Sem `require.resolve` {#no-requireresolve}

A resolução relativa pode ser tratada através de `new URL('./local', import.meta.url)`.

Para uma substituição completa de `require.resolve`, existe a API [import.meta.resolve](/pt/nodejs/api/esm#importmetaresolvespecifier).

Alternativamente, `module.createRequire()` pode ser usado.

#### Sem `NODE_PATH` {#no-node_path}

`NODE_PATH` não faz parte da resolução de especificadores `import`. Por favor, use links simbólicos se este comportamento for desejado.

#### Sem `require.extensions` {#no-requireextensions}

`require.extensions` não é usado por `import`. Hooks de customização de módulo podem fornecer uma substituição.

#### Sem `require.cache` {#no-requirecache}

`require.cache` não é usado por `import`, pois o carregador de módulos ES tem seu próprio cache separado.

## Módulos JSON {#json-modules}

::: info [Histórico]
| Versão  | Mudanças                                  |
| :------ | :---------------------------------------- |
| v23.1.0 | Módulos JSON não são mais experimentais. |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Arquivos JSON podem ser referenciados por `import`:

```js [ESM]
import packageConfig from './package.json' with { type: 'json' };
```
A sintaxe `with { type: 'json' }` é obrigatória; veja [Atributos de Importação](/pt/nodejs/api/esm#import-attributes).

O JSON importado expõe apenas uma exportação `default`. Não há suporte para exportações nomeadas. Uma entrada de cache é criada no cache CommonJS para evitar duplicação. O mesmo objeto é retornado no CommonJS se o módulo JSON já tiver sido importado do mesmo caminho.


## Módulos Wasm {#wasm-modules}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

A importação de módulos WebAssembly é suportada sob a flag `--experimental-wasm-modules`, permitindo que qualquer arquivo `.wasm` seja importado como módulos normais, ao mesmo tempo em que suporta suas importações de módulos.

Esta integração está alinhada com a [Proposta de Integração de Módulos ES para WebAssembly](https://github.com/webassembly/esm-integration).

Por exemplo, um `index.mjs` contendo:

```js [ESM]
import * as M from './module.wasm';
console.log(M);
```
executado sob:

```bash [BASH]
node --experimental-wasm-modules index.mjs
```
forneceria a interface de exports para a instanciação de `module.wasm`.

## `await` de nível superior {#top-level-await}

**Adicionado em: v14.8.0**

A palavra-chave `await` pode ser usada no corpo de nível superior de um módulo ECMAScript.

Assumindo um `a.mjs` com

```js [ESM]
export const five = await Promise.resolve(5);
```
E um `b.mjs` com

```js [ESM]
import { five } from './a.mjs';

console.log(five); // Registra `5`
```
```bash [BASH]
node b.mjs # funciona
```
Se uma expressão `await` de nível superior nunca for resolvida, o processo `node` será encerrado com um [código de status](/pt/nodejs/api/process#exit-codes) `13`.

```js [ESM]
import { spawn } from 'node:child_process';
import { execPath } from 'node:process';

spawn(execPath, [
  '--input-type=module',
  '--eval',
  // Promise que nunca é resolvida:
  'await new Promise(() => {})',
]).once('exit', (code) => {
  console.log(code); // Registra `13`
});
```
## Loaders {#loaders}

A antiga documentação de Loaders agora está em [Módulos: Hooks de customização](/pt/nodejs/api/module#customization-hooks).

## Algoritmo de resolução e carregamento {#resolution-and-loading-algorithm}

### Características {#features}

O resolvedor padrão tem as seguintes propriedades:

- Resolução baseada em FileURL, como é usado por módulos ES
- Resolução de URL relativa e absoluta
- Sem extensões padrão
- Sem `main` de pastas
- Pesquisa de resolução de pacotes specifier "bare" através de `node_modules`
- Não falha em extensões ou protocolos desconhecidos
- Pode opcionalmente fornecer uma dica do formato para a fase de carregamento

O carregador padrão tem as seguintes propriedades

- Suporte para carregamento de módulo embutido via URLs `node:`
- Suporte para carregamento de módulo "inline" via URLs `data:`
- Suporte para carregamento de módulo `file:`
- Falha em qualquer outro protocolo URL
- Falha em extensões desconhecidas para carregamento `file:` (suporta apenas `.cjs`, `.js` e `.mjs`)


### Algoritmo de resolução {#resolution-algorithm}

O algoritmo para carregar um especificador de módulo ES é fornecido através do método **ESM_RESOLVE** abaixo. Ele retorna a URL resolvida para um especificador de módulo em relação a uma parentURL.

O algoritmo de resolução determina a URL totalmente resolvida para um carregamento de módulo, juntamente com seu formato de módulo sugerido. O algoritmo de resolução não determina se o protocolo de URL resolvida pode ser carregado ou se as extensões de arquivo são permitidas; em vez disso, essas validações são aplicadas pelo Node.js durante a fase de carregamento (por exemplo, se foi solicitado que ele carregasse uma URL que tenha um protocolo que não seja `file:`, `data:` ou `node:`).

O algoritmo também tenta determinar o formato do arquivo com base na extensão (consulte o algoritmo `ESM_FILE_FORMAT` abaixo). Se ele não reconhecer a extensão do arquivo (por exemplo, se não for `.mjs`, `.cjs` ou `.json`), um formato de `undefined` será retornado, o que lançará um erro durante a fase de carregamento.

O algoritmo para determinar o formato do módulo de uma URL resolvida é fornecido por **ESM_FILE_FORMAT**, que retorna o formato de módulo exclusivo para qualquer arquivo. O formato *"module"* é retornado para um Módulo ECMAScript, enquanto o formato *"commonjs"* é usado para indicar o carregamento através do carregador CommonJS legado. Formatos adicionais, como *"addon"*, podem ser estendidos em atualizações futuras.

Nos algoritmos a seguir, todos os erros de sub-rotina são propagados como erros dessas rotinas de nível superior, a menos que indicado de outra forma.

*defaultConditions* é a matriz de nomes de ambiente condicional, `["node", "import"]`.

O resolvedor pode lançar os seguintes erros:

- *Invalid Module Specifier*: O especificador de módulo é uma URL, nome de pacote ou especificador de subcaminho de pacote inválido.
- *Invalid Package Configuration*: A configuração package.json é inválida ou contém uma configuração inválida.
- *Invalid Package Target*: As exportações ou importações de pacotes definem um módulo de destino para o pacote que é um tipo ou destino de string inválido.
- *Package Path Not Exported*: As exportações do pacote não definem ou permitem um subcaminho de destino no pacote para o módulo fornecido.
- *Package Import Not Defined*: As importações do pacote não definem o especificador.
- *Module Not Found*: O pacote ou módulo solicitado não existe.
- *Unsupported Directory Import*: O caminho resolvido corresponde a um diretório, que não é um destino suportado para importações de módulos.


### Especificação do Algoritmo de Resolução {#resolution-algorithm-specification}

**ESM_RESOLVE**(*specifier*, *parentURL*)

**PACKAGE_RESOLVE**(*packageSpecifier*, *parentURL*)

**PACKAGE_SELF_RESOLVE**(*packageName*, *packageSubpath*, *parentURL*)

**PACKAGE_EXPORTS_RESOLVE**(*packageURL*, *subpath*, *exports*, *conditions*)

**PACKAGE_IMPORTS_RESOLVE**(*specifier*, *parentURL*, *conditions*)

**PACKAGE_IMPORTS_EXPORTS_RESOLVE**(*matchKey*, *matchObj*, *packageURL*, *isImports*, *conditions*)

**PATTERN_KEY_COMPARE**(*keyA*, *keyB*)

**PACKAGE_TARGET_RESOLVE**(*packageURL*, *target*, *patternMatch*, *isImports*, *conditions*)

**ESM_FILE_FORMAT**(*url*)

**LOOKUP_PACKAGE_SCOPE**(*url*)

**READ_PACKAGE_JSON**(*packageURL*)

**DETECT_MODULE_SYNTAX**(*source*)

### Personalizando o algoritmo de resolução de especificadores ESM {#customizing-esm-specifier-resolution-algorithm}

Os [Hooks de personalização de módulos](/pt/nodejs/api/module#customization-hooks) fornecem um mecanismo para personalizar o algoritmo de resolução de especificadores ESM. Um exemplo que fornece resolução no estilo CommonJS para especificadores ESM é [commonjs-extension-resolution-loader](https://github.com/nodejs/loaders-test/tree/main/commonjs-extension-resolution-loader).

