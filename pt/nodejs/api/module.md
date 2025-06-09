---
title: Documentação do Node.js - Sistema de Módulos
description: Esta página fornece documentação detalhada sobre o sistema de módulos do Node.js, incluindo módulos CommonJS e ES, como carregar módulos, cache de módulos e as diferenças entre os dois sistemas de módulos.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Sistema de Módulos | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta página fornece documentação detalhada sobre o sistema de módulos do Node.js, incluindo módulos CommonJS e ES, como carregar módulos, cache de módulos e as diferenças entre os dois sistemas de módulos.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Sistema de Módulos | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta página fornece documentação detalhada sobre o sistema de módulos do Node.js, incluindo módulos CommonJS e ES, como carregar módulos, cache de módulos e as diferenças entre os dois sistemas de módulos.
---


# Módulos: API `node:module` {#modules-nodemodule-api}

**Adicionado em: v0.3.7**

## O objeto `Module` {#the-module-object}

- [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Fornece métodos de utilidade geral ao interagir com instâncias de `Module`, a variável [`module`](/pt/nodejs/api/module#the-module-object) frequentemente vista em módulos [CommonJS](/pt/nodejs/api/modules). Acessado via `import 'node:module'` ou `require('node:module')`.

### `module.builtinModules` {#modulebuiltinmodules}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.5.0 | A lista agora também contém módulos somente com prefixo. |
| v9.3.0, v8.10.0, v6.13.0 | Adicionado em: v9.3.0, v8.10.0, v6.13.0 |
:::

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Uma lista dos nomes de todos os módulos fornecidos pelo Node.js. Pode ser usada para verificar se um módulo é mantido por terceiros ou não.

`module` neste contexto não é o mesmo objeto fornecido pelo [wrapper de módulo](/pt/nodejs/api/modules#the-module-wrapper). Para acessá-lo, require o módulo `Module`:

::: code-group
```js [ESM]
// module.mjs
// Em um módulo ECMAScript
import { builtinModules as builtin } from 'node:module';
```

```js [CJS]
// module.cjs
// Em um módulo CommonJS
const builtin = require('node:module').builtinModules;
```
:::

### `module.createRequire(filename)` {#modulecreaterequirefilename}

**Adicionado em: v12.2.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Nome do arquivo a ser usado para construir a função require. Deve ser um objeto URL de arquivo, string URL de arquivo ou string de caminho absoluto.
- Retorna: [\<require\>](/pt/nodejs/api/modules#requireid) Função Require

```js [ESM]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js é um módulo CommonJS.
const siblingModule = require('./sibling-module');
```

### `module.findPackageJSON(specifier[, base])` {#modulefindpackagejsonspecifier-base}

**Adicionado em: v23.2.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento Ativo
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) O especificador para o módulo cujo `package.json` deve ser recuperado. Ao passar um *especificador bare*, o `package.json` na raiz do pacote é retornado. Ao passar um *especificador relativo* ou um *especificador absoluto*, o `package.json` pai mais próximo é retornado.
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) O local absoluto (string URL `file:` ou caminho FS) do módulo contido. Para CJS, use `__filename` (não `__dirname`!); para ESM, use `import.meta.url`. Você não precisa passá-lo se `specifier` for um `especificador absoluto`.
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Um caminho se o `package.json` for encontrado. Quando `startLocation` é um pacote, o `package.json` raiz do pacote; quando relativo ou não resolvido, o `package.json` mais próximo do `startLocation`.

```text [TEXT]
/path/to/project
  ├ packages/
    ├ bar/
      ├ bar.js
      └ package.json // name = '@foo/bar'
    └ qux/
      ├ node_modules/
        └ some-package/
          └ package.json // name = 'some-package'
      ├ qux.js
      └ package.json // name = '@foo/qux'
  ├ main.js
  └ package.json // name = '@foo'
```

::: code-group
```js [ESM]
// /path/to/project/packages/bar/bar.js
import { findPackageJSON } from 'node:module';

findPackageJSON('..', import.meta.url);
// '/path/to/project/package.json'
// Mesmo resultado ao passar um especificador absoluto em vez disso:
findPackageJSON(new URL('../', import.meta.url));
findPackageJSON(import.meta.resolve('../'));

findPackageJSON('some-package', import.meta.url);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// Ao passar um especificador absoluto, você pode obter um resultado diferente se o
// módulo resolvido estiver dentro de uma subpasta que tenha `package.json` aninhados.
findPackageJSON(import.meta.resolve('some-package'));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', import.meta.url);
// '/path/to/project/packages/qux/package.json'
```

```js [CJS]
// /path/to/project/packages/bar/bar.js
const { findPackageJSON } = require('node:module');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

findPackageJSON('..', __filename);
// '/path/to/project/package.json'
// Mesmo resultado ao passar um especificador absoluto em vez disso:
findPackageJSON(pathToFileURL(path.join(__dirname, '..')));

findPackageJSON('some-package', __filename);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// Ao passar um especificador absoluto, você pode obter um resultado diferente se o
// módulo resolvido estiver dentro de uma subpasta que tenha `package.json` aninhados.
findPackageJSON(pathToFileURL(require.resolve('some-package')));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', __filename);
// '/path/to/project/packages/qux/package.json'
```
:::

### `module.isBuiltin(moduleName)` {#moduleisbuiltinmodulename}

**Adicionado em: v18.6.0, v16.17.0**

- `moduleName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) nome do módulo
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) retorna true se o módulo for builtin, caso contrário, retorna false

```js [ESM]
import { isBuiltin } from 'node:module';
isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
isBuiltin('wss'); // false
```
### `module.register(specifier[, parentURL][, options])` {#moduleregisterspecifier-parenturl-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.8.0, v18.19.0 | Adiciona suporte para instâncias WHATWG URL. |
| v20.6.0, v18.19.0 | Adicionado em: v20.6.0, v18.19.0 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).2 - Candidato a lançamento
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Hooks de customização a serem registrados; esta deve ser a mesma string que seria passada para `import()`, exceto que, se for relativa, é resolvida em relação a `parentURL`.
- `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Se você deseja resolver `specifier` em relação a uma URL base, como `import.meta.url`, você pode passar essa URL aqui. **Padrão:** `'data:'`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Se você deseja resolver `specifier` em relação a uma URL base, como `import.meta.url`, você pode passar essa URL aqui. Esta propriedade é ignorada se o `parentURL` for fornecido como o segundo argumento. **Padrão:** `'data:'`
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualquer valor JavaScript arbitrário e clonável para passar para o hook [`initialize`](/pt/nodejs/api/module#initialize).
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [objetos transferíveis](/pt/nodejs/api/worker_threads#portpostmessagevalue-transferlist) a serem passados para o hook `initialize`.
  
 

Registre um módulo que exporta [hooks](/pt/nodejs/api/module#customization-hooks) que personalizam o comportamento de resolução e carregamento de módulos do Node.js. Consulte [Hooks de customização](/pt/nodejs/api/module#customization-hooks).


### `module.registerHooks(options)` {#moduleregisterhooksoptions}

**Adicionado em: v23.5.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `load` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Veja [gancho de carregamento](/pt/nodejs/api/module#loadurl-context-nextload). **Padrão:** `undefined`.
    - `resolve` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Veja [gancho de resolução](/pt/nodejs/api/module#resolvespecifier-context-nextresolve). **Padrão:** `undefined`.

Registre [ganchos](/pt/nodejs/api/module#customization-hooks) que personalizam a resolução de módulo do Node.js e o comportamento de carregamento. Veja [Ganchos de personalização](/pt/nodejs/api/module#customization-hooks).

### `module.stripTypeScriptTypes(code[, options])` {#modulestriptypescripttypescode-options}

**Adicionado em: v23.2.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O código do qual remover as anotações de tipo.
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'strip'`. Valores possíveis são:
    - `'strip'` Remove apenas as anotações de tipo sem realizar a transformação dos recursos do TypeScript.
    - `'transform'` Remove as anotações de tipo e transforma os recursos do TypeScript em JavaScript.

    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`. Apenas quando `mode` for `'transform'`, se `true`, um mapa de origem será gerado para o código transformado.
    - `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica a URL de origem usada no mapa de origem.

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O código com as anotações de tipo removidas. `module.stripTypeScriptTypes()` remove as anotações de tipo do código TypeScript. Ele pode ser usado para remover anotações de tipo do código TypeScript antes de executá-lo com `vm.runInContext()` ou `vm.compileFunction()`. Por padrão, ele lançará um erro se o código contiver recursos do TypeScript que exigem transformação, como `Enums`, veja [type-stripping](/pt/nodejs/api/typescript#type-stripping) para obter mais informações. Quando o modo é `'transform'`, ele também transforma os recursos do TypeScript em JavaScript, veja [transform TypeScript features](/pt/nodejs/api/typescript#typescript-features) para obter mais informações. Quando o modo é `'strip'`, os mapas de origem não são gerados, porque os locais são preservados. Se `sourceMap` for fornecido, quando o modo for `'strip'`, um erro será lançado.

*AVISO*: A saída desta função não deve ser considerada estável entre as versões do Node.js, devido a alterações no analisador TypeScript.

::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Imprime: const a         = 1;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Imprime: const a         = 1;
```
:::

Se `sourceUrl` for fornecido, ele será usado anexado como um comentário no final da saída:

::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Imprime: const a         = 1\n\n//# sourceURL=source.ts;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Imprime: const a         = 1\n\n//# sourceURL=source.ts;
```
:::

Quando `mode` é `'transform'`, o código é transformado em JavaScript:

::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Imprime:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Imprime:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```
:::


### `module.syncBuiltinESMExports()` {#modulesyncbuiltinesmexports}

**Adicionado em: v12.12.0**

O método `module.syncBuiltinESMExports()` atualiza todas as ligações ativas para [Módulos ES](/pt/nodejs/api/esm) integrados para corresponder às propriedades das exportações do [CommonJS](/pt/nodejs/api/modules). Ele não adiciona nem remove nomes exportados dos [Módulos ES](/pt/nodejs/api/esm).

```js [ESM]
const fs = require('node:fs');
const assert = require('node:assert');
const { syncBuiltinESMExports } = require('node:module');

fs.readFile = newAPI;

delete fs.readFileSync;

function newAPI() {
  // ...
}

fs.newAPI = newAPI;

syncBuiltinESMExports();

import('node:fs').then((esmFS) => {
  // Ele sincroniza a propriedade readFile existente com o novo valor
  assert.strictEqual(esmFS.readFile, newAPI);
  // readFileSync foi removido do fs requerido
  assert.strictEqual('readFileSync' in fs, false);
  // syncBuiltinESMExports() não remove readFileSync de esmFS
  assert.strictEqual('readFileSync' in esmFS, true);
  // syncBuiltinESMExports() não adiciona nomes
  assert.strictEqual(esmFS.newAPI, undefined);
});
```
## Cache de compilação do módulo {#module-compile-cache}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.8.0 | adiciona APIs JavaScript iniciais para acesso em tempo de execução. |
| v22.1.0 | Adicionado em: v22.1.0 |
:::

O cache de compilação do módulo pode ser ativado usando o método [`module.enableCompileCache()`](/pt/nodejs/api/module#moduleenablecompilecachecachedir) ou a variável de ambiente [`NODE_COMPILE_CACHE=dir`](/pt/nodejs/api/cli#node_compile_cachedir). Depois de ativado, sempre que o Node.js compilar um CommonJS ou um Módulo ECMAScript, ele usará o [cache de código V8](https://v8.dev/blog/code-caching-for-devs) em disco persistido no diretório especificado para acelerar a compilação. Isso pode retardar o primeiro carregamento de um gráfico de módulo, mas os carregamentos subsequentes do mesmo gráfico de módulo podem obter uma aceleração significativa se o conteúdo dos módulos não mudar.

Para limpar o cache de compilação gerado no disco, basta remover o diretório de cache. O diretório de cache será recriado na próxima vez que o mesmo diretório for usado para o armazenamento de cache de compilação. Para evitar encher o disco com cache obsoleto, é recomendável usar um diretório em [`os.tmpdir()`](/pt/nodejs/api/os#ostmpdir). Se o cache de compilação for ativado por uma chamada para [`module.enableCompileCache()`](/pt/nodejs/api/module#moduleenablecompilecachecachedir) sem especificar o diretório, o Node.js usará a variável de ambiente [`NODE_COMPILE_CACHE=dir`](/pt/nodejs/api/cli#node_compile_cachedir) se ela estiver definida ou o padrão para `path.join(os.tmpdir(), 'node-compile-cache')` caso contrário. Para localizar o diretório de cache de compilação usado por uma instância Node.js em execução, use [`module.getCompileCacheDir()`](/pt/nodejs/api/module#modulegetcompilecachedir).

Atualmente, ao usar o cache de compilação com a [cobertura de código JavaScript V8](https://v8project.blogspot.com/2017/12/javascript-code-coverage), a cobertura coletada pelo V8 pode ser menos precisa em funções que são desserializadas do cache de código. Recomenda-se desativar isso ao executar testes para gerar cobertura precisa.

O cache de compilação do módulo ativado pode ser desativado pela variável de ambiente [`NODE_DISABLE_COMPILE_CACHE=1`](/pt/nodejs/api/cli#node_disable_compile_cache1). Isso pode ser útil quando o cache de compilação leva a comportamentos inesperados ou indesejados (por exemplo, cobertura de teste menos precisa).

O cache de compilação gerado por uma versão do Node.js não pode ser reutilizado por uma versão diferente do Node.js. O cache gerado por diferentes versões do Node.js será armazenado separadamente se o mesmo diretório base for usado para persistir o cache, para que possam coexistir.

No momento, quando o cache de compilação está ativado e um módulo é carregado novamente, o cache de código é gerado a partir do código compilado imediatamente, mas só será gravado no disco quando a instância do Node.js estiver prestes a sair. Isso está sujeito a alterações. O método [`module.flushCompileCache()`](/pt/nodejs/api/module#moduleflushcompilecache) pode ser usado para garantir que o cache de código acumulado seja descarregado no disco caso a aplicação queira gerar outras instâncias do Node.js e permitir que elas compartilhem o cache muito antes da saída do pai.


### `module.constants.compileCacheStatus` {#moduleconstantscompilecachestatus}

**Adicionado em: v22.8.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento Ativo
:::

As seguintes constantes são retornadas como o campo `status` no objeto retornado por [`module.enableCompileCache()`](/pt/nodejs/api/module#moduleenablecompilecachecachedir) para indicar o resultado da tentativa de ativar o [cache de compilação de módulos](/pt/nodejs/api/module#module-compile-cache).

| Constante | Descrição |
| --- | --- |
| `ENABLED` |        Node.js ativou o cache de compilação com sucesso. O diretório usado para armazenar o       cache de compilação será retornado no campo   `directory`   no objeto       retornado.      |
| `ALREADY_ENABLED` |        O cache de compilação já foi ativado antes, seja por uma chamada anterior a         `module.enableCompileCache()`  , ou pela variável de ambiente   `NODE_COMPILE_CACHE=dir`         . O diretório usado para armazenar o cache de compilação será retornado no campo   `directory`   no objeto       retornado.      |
| `FAILED` |        Node.js falha ao ativar o cache de compilação. Isso pode ser causado pela falta de       permissão para usar o diretório especificado ou por vários tipos de erros do sistema de arquivos.       O detalhe da falha será retornado no campo   `message`   no objeto       retornado.      |
| `DISABLED` |        Node.js não pode ativar o cache de compilação porque a variável de ambiente         `NODE_DISABLE_COMPILE_CACHE=1`   foi definida.      |
### `module.enableCompileCache([cacheDir])` {#moduleenablecompilecachecachedir}

**Adicionado em: v22.8.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento Ativo
:::

- `cacheDir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Caminho opcional para especificar o diretório onde o cache de compilação será armazenado/recuperado.
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `status` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um dos [`module.constants.compileCacheStatus`](/pt/nodejs/api/module#moduleconstantscompilecachestatus)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Se Node.js não puder ativar o cache de compilação, isso conterá a mensagem de erro. Definido apenas se `status` for `module.constants.compileCacheStatus.FAILED`.
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Se o cache de compilação estiver ativado, isso conterá o diretório onde o cache de compilação está armazenado. Definido apenas se `status` for `module.constants.compileCacheStatus.ENABLED` ou `module.constants.compileCacheStatus.ALREADY_ENABLED`.
  
 

Ativa o [cache de compilação de módulos](/pt/nodejs/api/module#module-compile-cache) na instância Node.js atual.

Se `cacheDir` não for especificado, Node.js usará o diretório especificado pela variável de ambiente [`NODE_COMPILE_CACHE=dir`](/pt/nodejs/api/cli#node_compile_cachedir) se estiver definida, ou usará `path.join(os.tmpdir(), 'node-compile-cache')` caso contrário. Para casos de uso geral, é recomendado chamar `module.enableCompileCache()` sem especificar o `cacheDir`, para que o diretório possa ser substituído pela variável de ambiente `NODE_COMPILE_CACHE` quando necessário.

Como o cache de compilação deve ser uma otimização silenciosa que não é necessária para que o aplicativo seja funcional, este método foi projetado para não lançar nenhuma exceção quando o cache de compilação não puder ser ativado. Em vez disso, ele retornará um objeto contendo uma mensagem de erro no campo `message` para ajudar na depuração. Se o cache de compilação for ativado com sucesso, o campo `directory` no objeto retornado conterá o caminho para o diretório onde o cache de compilação está armazenado. O campo `status` no objeto retornado será um dos valores `module.constants.compileCacheStatus` para indicar o resultado da tentativa de ativar o [cache de compilação de módulos](/pt/nodejs/api/module#module-compile-cache).

Este método afeta apenas a instância Node.js atual. Para ativá-lo em threads de worker filho, chame este método também nos threads de worker filho ou defina o valor `process.env.NODE_COMPILE_CACHE` para o diretório de cache de compilação para que o comportamento possa ser herdado para os workers filho. O diretório pode ser obtido a partir do campo `directory` retornado por este método ou com [`module.getCompileCacheDir()`](/pt/nodejs/api/module#modulegetcompilecachedir).


### `module.flushCompileCache()` {#moduleflushcompilecache}

**Adicionado em: v23.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento Ativo
:::

Limpa o [cache de compilação do módulo](/pt/nodejs/api/module#module-compile-cache) acumulado de módulos já carregados na instância Node.js atual para o disco. Isso retorna depois que todas as operações do sistema de arquivos de limpeza chegam ao fim, independentemente de terem sucesso ou não. Se houver algum erro, isso falhará silenciosamente, pois as falhas no cache de compilação não devem interferir na operação real do aplicativo.

### `module.getCompileCacheDir()` {#modulegetcompilecachedir}

**Adicionado em: v22.8.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento Ativo
:::

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Caminho para o diretório do [cache de compilação do módulo](/pt/nodejs/api/module#module-compile-cache) se estiver habilitado ou `undefined` caso contrário.

## Hooks de Customização {#customization-hooks}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.5.0 | Adiciona suporte para hooks síncronos e in-thread. |
| v20.6.0, v18.19.0 | Adicionado o hook `initialize` para substituir `globalPreload`. |
| v18.6.0, v16.17.0 | Adiciona suporte para encadeamento de loaders. |
| v16.12.0 | Removido `getFormat`, `getSource`, `transformSource` e `globalPreload`; adicionado o hook `load` e o hook `getGlobalPreload`. |
| v8.8.0 | Adicionado em: v8.8.0 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).2 - Candidato ao lançamento (versão assíncrona) Estabilidade: 1.1 - Desenvolvimento ativo (versão síncrona)
:::

Existem dois tipos de hooks de customização de módulo atualmente suportados:

### Habilitando {#enabling}

A resolução e o carregamento de módulos podem ser customizados por:

Os hooks podem ser registrados antes que o código do aplicativo seja executado usando a flag [`--import`](/pt/nodejs/api/cli#--importmodule) ou [`--require`](/pt/nodejs/api/cli#-r---require-module):

```bash [BASH]
node --import ./register-hooks.js ./my-app.js
node --require ./register-hooks.js ./my-app.js
```

::: code-group
```js [ESM]
// register-hooks.js
// Este arquivo só pode ser require()-ed se não contiver await de nível superior.
// Use module.register() para registrar hooks assíncronos em um thread dedicado.
import { register } from 'node:module';
register('./hooks.mjs', import.meta.url);
```

```js [CJS]
// register-hooks.js
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
// Use module.register() para registrar hooks assíncronos em um thread dedicado.
register('./hooks.mjs', pathToFileURL(__filename));
```
:::

::: code-group
```js [ESM]
// Use module.registerHooks() para registrar hooks síncronos no thread principal.
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) { /* implementation */ },
  load(url, context, nextLoad) { /* implementation */ },
});
```

```js [CJS]
// Use module.registerHooks() para registrar hooks síncronos no thread principal.
const { registerHooks } = require('node:module');
registerHooks({
  resolve(specifier, context, nextResolve) { /* implementation */ },
  load(url, context, nextLoad) { /* implementation */ },
});
```
:::

O arquivo passado para `--import` ou `--require` também pode ser uma exportação de uma dependência:

```bash [BASH]
node --import some-package/register ./my-app.js
node --require some-package/register ./my-app.js
```
Onde `some-package` tem um campo [`"exports"`](/pt/nodejs/api/packages#exports) definindo a exportação `/register` para mapear para um arquivo que chama `register()`, como o exemplo `register-hooks.js` a seguir.

Usar `--import` ou `--require` garante que os hooks sejam registrados antes que qualquer arquivo de aplicativo seja importado, incluindo o ponto de entrada do aplicativo e para qualquer thread de worker por padrão também.

Alternativamente, `register()` e `registerHooks()` podem ser chamados a partir do ponto de entrada, embora `import()` dinâmico deva ser usado para qualquer código ESM que deva ser executado após o registro dos hooks.

::: code-group
```js [ESM]
import { register } from 'node:module';

register('http-to-https', import.meta.url);

// Como este é um `import()` dinâmico, os hooks `http-to-https` serão executados
// para lidar com `./my-app.js` e quaisquer outros arquivos que ele importa ou requer.
await import('./my-app.js');
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

register('http-to-https', pathToFileURL(__filename));

// Como este é um `import()` dinâmico, os hooks `http-to-https` serão executados
// para lidar com `./my-app.js` e quaisquer outros arquivos que ele importa ou requer.
import('./my-app.js');
```
:::

Os hooks de customização serão executados para quaisquer módulos carregados posteriormente ao registro e os módulos aos quais eles fazem referência por meio de `import` e do `require` integrado. A função `require` criada por usuários usando `module.createRequire()` só pode ser customizada pelos hooks síncronos.

Neste exemplo, estamos registrando os hooks `http-to-https`, mas eles estarão disponíveis apenas para módulos importados subsequentemente — neste caso, `my-app.js` e qualquer coisa que ele referencie por meio de `import` ou `require` integrado em dependências CommonJS.

Se o `import('./my-app.js')` tivesse sido um `import './my-app.js'` estático, o aplicativo já teria sido carregado **antes** que os hooks `http-to-https` fossem registrados. Isso ocorre devido à especificação dos módulos ES, onde as importações estáticas são avaliadas a partir das folhas da árvore primeiro e, em seguida, de volta ao tronco. Pode haver importações estáticas *dentro* de `my-app.js`, que não serão avaliadas até que `my-app.js` seja importado dinamicamente.

Se hooks síncronos forem usados, tanto `import`, `require` quanto `require` do usuário criado usando `createRequire()` são suportados.

::: code-group
```js [ESM]
import { registerHooks, createRequire } from 'node:module';

registerHooks({ /* implementation of synchronous hooks */ });

const require = createRequire(import.meta.url);

// Os hooks síncronos afetam import, require() e a função require() do usuário
// criada por meio de createRequire().
await import('./my-app.js');
require('./my-app-2.js');
```

```js [CJS]
const { register, registerHooks } = require('node:module');
const { pathToFileURL } = require('node:url');

registerHooks({ /* implementation of synchronous hooks */ });

const userRequire = createRequire(__filename);

// Os hooks síncronos afetam import, require() e a função require() do usuário
// criada por meio de createRequire().
import('./my-app.js');
require('./my-app-2.js');
userRequire('./my-app-3.js');
```
:::

Finalmente, se tudo o que você deseja fazer é registrar hooks antes que seu aplicativo seja executado e você não deseja criar um arquivo separado para essa finalidade, você pode passar uma URL `data:` para `--import`:

```bash [BASH]
node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("http-to-https", pathToFileURL("./"));' ./my-app.js
```

### Encadeamento {#chaining}

É possível chamar `register` mais de uma vez:

::: code-group
```js [ESM]
// entrypoint.mjs
import { register } from 'node:module';

register('./foo.mjs', import.meta.url);
register('./bar.mjs', import.meta.url);
await import('./my-app.mjs');
```

```js [CJS]
// entrypoint.cjs
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

const parentURL = pathToFileURL(__filename);
register('./foo.mjs', parentURL);
register('./bar.mjs', parentURL);
import('./my-app.mjs');
```
:::

Neste exemplo, os hooks registrados formarão cadeias. Essas cadeias são executadas em ordem de último a entrar, primeiro a sair (LIFO). Se tanto `foo.mjs` quanto `bar.mjs` definirem um hook `resolve`, eles serão chamados da seguinte forma (observe da direita para a esquerda): o padrão do node ← `./foo.mjs` ← `./bar.mjs` (começando com `./bar.mjs`, depois `./foo.mjs`, depois o padrão do Node.js). O mesmo se aplica a todos os outros hooks.

Os hooks registrados também afetam o próprio `register`. Neste exemplo, `bar.mjs` será resolvido e carregado por meio dos hooks registrados por `foo.mjs` (porque os hooks de `foo` já terão sido adicionados à cadeia). Isso permite coisas como escrever hooks em linguagens que não são JavaScript, desde que os hooks registrados anteriormente sejam transpilados para JavaScript.

O método `register` não pode ser chamado de dentro do módulo que define os hooks.

O encadeamento de `registerHooks` funciona de forma semelhante. Se os hooks síncronos e assíncronos forem misturados, os hooks síncronos serão sempre executados primeiro antes que os hooks assíncronos comecem a ser executados, ou seja, no último hook síncrono a ser executado, seu próximo hook inclui a invocação dos hooks assíncronos.

::: code-group
```js [ESM]
// entrypoint.mjs
import { registerHooks } from 'node:module';

const hook1 = { /* implementation of hooks */ };
const hook2 = { /* implementation of hooks */ };
// hook2 run before hook1.
registerHooks(hook1);
registerHooks(hook2);
```

```js [CJS]
// entrypoint.cjs
const { registerHooks } = require('node:module');

const hook1 = { /* implementation of hooks */ };
const hook2 = { /* implementation of hooks */ };
// hook2 run before hook1.
registerHooks(hook1);
registerHooks(hook2);
```
:::


### Comunicação com hooks de personalização de módulos {#communication-with-module-customization-hooks}

Hooks assíncronos são executados em uma thread dedicada, separada da thread principal que executa o código do aplicativo. Isso significa que a mutação de variáveis globais não afetará as outras threads, e canais de mensagens devem ser usados para comunicar entre as threads.

O método `register` pode ser usado para passar dados para um hook [`initialize`](/pt/nodejs/api/module#initialize). Os dados passados para o hook podem incluir objetos transferíveis como portas.

::: code-group
```js [ESM]
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// Este exemplo demonstra como um canal de mensagens pode ser usado para
// comunicar com os hooks, enviando `port2` para os hooks.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// Este exemplo mostra como um canal de mensagens pode ser usado para
// comunicar com os hooks, enviando `port2` para os hooks.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::

Hooks de módulo síncronos são executados na mesma thread onde o código do aplicativo é executado. Eles podem modificar diretamente os globais do contexto acessado pela thread principal.

### Hooks {#hooks}

#### Hooks assíncronos aceitos por `module.register()` {#asynchronous-hooks-accepted-by-moduleregister}

O método [`register`](/pt/nodejs/api/module#moduleregisterspecifier-parenturl-options) pode ser usado para registrar um módulo que exporta um conjunto de hooks. Os hooks são funções que são chamadas pelo Node.js para personalizar a resolução do módulo e o processo de carregamento. As funções exportadas devem ter nomes e assinaturas específicos e devem ser exportadas como exportações nomeadas.

```js [ESM]
export async function initialize({ number, port }) {
  // Recebe dados de `register`.
}

export async function resolve(specifier, context, nextResolve) {
  // Pega um especificador `import` ou `require` e o resolve para uma URL.
}

export async function load(url, context, nextLoad) {
  // Pega uma URL resolvida e retorna o código-fonte a ser avaliado.
}
```
Hooks assíncronos são executados em uma thread separada, isolada da thread principal onde o código do aplicativo é executado. Isso significa que é um [realm](https://tc39.es/ecma262/#realm) diferente. A thread dos hooks pode ser encerrada pela thread principal a qualquer momento, portanto, não dependa de operações assíncronas (como `console.log`) para serem concluídas. Eles são herdados em workers filhos por padrão.


#### Hooks síncronos aceitos por `module.registerHooks()` {#synchronous-hooks-accepted-by-moduleregisterhooks}

**Adicionado em: v23.5.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

O método `module.registerHooks()` aceita funções de hook síncronas. `initialize()` não é suportado nem necessário, pois o implementador do hook pode simplesmente executar o código de inicialização diretamente antes da chamada para `module.registerHooks()`.

```js [ESM]
function resolve(specifier, context, nextResolve) {
  // Recebe um especificador `import` ou `require` e o resolve para um URL.
}

function load(url, context, nextLoad) {
  // Recebe um URL resolvido e retorna o código-fonte a ser avaliado.
}
```
Os hooks síncronos são executados na mesma thread e no mesmo [realm](https://tc39.es/ecma262/#realm) onde os módulos são carregados. Ao contrário dos hooks assíncronos, eles não são herdados para threads worker filhas por padrão, embora se os hooks forem registrados usando um arquivo pré-carregado por [`--import`](/pt/nodejs/api/cli#--importmodule) ou [`--require`](/pt/nodejs/api/cli#-r---require-module), as threads worker filhas podem herdar os scripts pré-carregados via herança de `process.execArgv`. Consulte [a documentação de `Worker`](/pt/nodejs/api/worker_threads#new-workerfilename-options) para obter detalhes.

Em hooks síncronos, os usuários podem esperar que `console.log()` seja concluído da mesma forma que esperam que `console.log()` no código do módulo seja concluído.

#### Convenções de hooks {#conventions-of-hooks}

Os hooks fazem parte de uma [cadeia](/pt/nodejs/api/module#chaining), mesmo que essa cadeia consista em apenas um hook personalizado (fornecido pelo usuário) e o hook padrão, que está sempre presente. As funções de hook são aninhadas: cada uma deve sempre retornar um objeto simples, e o encadeamento acontece como resultado de cada função chamar `next\<hookName\>()`, que é uma referência ao hook do carregador subsequente (na ordem LIFO).

Um hook que retorna um valor sem uma propriedade necessária aciona uma exceção. Um hook que retorna sem chamar `next\<hookName\>()` *e* sem retornar `shortCircuit: true` também aciona uma exceção. Esses erros servem para ajudar a prevenir quebras não intencionais na cadeia. Retorne `shortCircuit: true` de um hook para sinalizar que a cadeia está terminando intencionalmente no seu hook.


#### `initialize()` {#initialize}

**Adicionado em: v20.6.0, v18.19.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).2 - Candidato a lançamento
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Os dados de `register(loader, import.meta.url, { data })`.

O hook `initialize` é aceito apenas por [`register`](/pt/nodejs/api/module#moduleregisterspecifier-parenturl-options). `registerHooks()` não o suporta nem precisa dele, pois a inicialização feita para hooks síncronos pode ser executada diretamente antes da chamada para `registerHooks()`.

O hook `initialize` oferece uma maneira de definir uma função personalizada que é executada na thread de hooks quando o módulo de hooks é inicializado. A inicialização acontece quando o módulo de hooks é registrado via [`register`](/pt/nodejs/api/module#moduleregisterspecifier-parenturl-options).

Este hook pode receber dados de uma invocação de [`register`](/pt/nodejs/api/module#moduleregisterspecifier-parenturl-options), incluindo portas e outros objetos transferíveis. O valor de retorno de `initialize` pode ser um [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), caso em que ele será aguardado antes que a execução da thread principal do aplicativo seja retomada.

Código de customização do módulo:

```js [ESM]
// path-to-my-hooks.js

export async function initialize({ number, port }) {
  port.postMessage(`increment: ${number + 1}`);
}
```
Código do chamador:



::: code-group
```js [ESM]
import assert from 'node:assert';
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// Este exemplo mostra como um canal de mensagens pode ser usado para comunicar
// entre a thread principal (do aplicativo) e os hooks em execução na thread de hooks,
// enviando `port2` para o hook `initialize`.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const assert = require('node:assert');
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// Este exemplo mostra como um canal de mensagens pode ser usado para comunicar
// entre a thread principal (do aplicativo) e os hooks em execução na thread de hooks,
// enviando `port2` para o hook `initialize`.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::


#### `resolve(specifier, context, nextResolve)` {#resolvespecifier-context-nextresolve}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.5.0 | Adiciona suporte para hooks síncronos e in-thread. |
| v21.0.0, v20.10.0, v18.19.0 | A propriedade `context.importAssertions` é substituída por `context.importAttributes`. Usar o nome antigo ainda é suportado e emitirá um aviso experimental. |
| v18.6.0, v16.17.0 | Adiciona suporte para encadeamento de hooks de resolve. Cada hook deve chamar `nextResolve()` ou incluir uma propriedade `shortCircuit` definida como `true` em seu retorno. |
| v17.1.0, v16.14.0 | Adiciona suporte para asserções de importação. |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).2 - Candidato a lançamento (versão assíncrona) Estabilidade: 1.1 - Desenvolvimento ativo (versão síncrona)
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Condições de exportação do `package.json` relevante
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto cujos pares de chave-valor representam os atributos para o módulo a ser importado
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O módulo que importa este, ou indefinido se este for o ponto de entrada do Node.js


- `nextResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O hook `resolve` subsequente na cadeia, ou o hook `resolve` padrão do Node.js após o último hook `resolve` fornecido pelo usuário
    - `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)


- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) A versão assíncrona aceita um objeto contendo as seguintes propriedades ou uma `Promise` que será resolvida para tal objeto. A versão síncrona aceita apenas um objeto retornado sincronamente.
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Uma dica para o hook de load (pode ser ignorada) `'builtin' | 'commonjs' | 'json' | 'module' | 'wasm'`
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Os atributos de importação a serem usados ao armazenar em cache o módulo (opcional; se excluído, a entrada será usada)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Um sinal de que este hook pretende terminar a cadeia de hooks `resolve`. **Padrão:** `false`
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A URL absoluta para a qual esta entrada é resolvida


A cadeia de hooks `resolve` é responsável por dizer ao Node.js onde encontrar e como armazenar em cache uma determinada instrução ou expressão `import` ou chamada `require`. Ele pode, opcionalmente, retornar um formato (como `'module'`) como uma dica para o hook `load`. Se um formato for especificado, o hook `load` é o responsável final por fornecer o valor final de `format` (e ele é livre para ignorar a dica fornecida por `resolve`); se `resolve` fornecer um `format`, um hook `load` personalizado é necessário, mesmo que apenas para passar o valor para o hook `load` padrão do Node.js.

Os atributos de tipo de importação fazem parte da chave de cache para salvar os módulos carregados no cache de módulo interno. O hook `resolve` é responsável por retornar um objeto `importAttributes` se o módulo deve ser armazenado em cache com atributos diferentes dos que estavam presentes no código-fonte.

A propriedade `conditions` em `context` é um array de condições que serão usadas para corresponder às [condições de exportação de pacote](/pt/nodejs/api/packages#conditional-exports) para esta solicitação de resolução. Elas podem ser usadas para procurar mapeamentos condicionais em outro lugar ou para modificar a lista ao chamar a lógica de resolução padrão.

As atuais [condições de exportação de pacote](/pt/nodejs/api/packages#conditional-exports) estão sempre no array `context.conditions` passado para o hook. Para garantir o *comportamento padrão de resolução de especificador de módulo Node.js* ao chamar `defaultResolve`, o array `context.conditions` passado para ele *deve* incluir *todos* os elementos do array `context.conditions` originalmente passado para o hook `resolve`.

```js [ESM]
// Versão assíncrona aceita por module.register().
export async function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  if (Math.random() > 0.5) { // Alguma condição.
    // Para alguns ou todos os especificadores, faça alguma lógica personalizada para resolver.
    // Sempre retorne um objeto da forma {url: <string>}.
    return {
      shortCircuit: true,
      url: parentURL ?
        new URL(specifier, parentURL).href :
        new URL(specifier).href,
    };
  }

  if (Math.random() < 0.5) { // Outra condição.
    // Ao chamar `defaultResolve`, os argumentos podem ser modificados. Neste
    // caso, está adicionando outro valor para corresponder às exportações condicionais.
    return nextResolve(specifier, {
      ...context,
      conditions: [...context.conditions, 'another-condition'],
    });
  }

  // Adie para o próximo hook na cadeia, que seria o
  // resolve padrão do Node.js se este for o último carregador especificado pelo usuário.
  return nextResolve(specifier);
}
```
```js [ESM]
// Versão síncrona aceita por module.registerHooks().
function resolve(specifier, context, nextResolve) {
  // Semelhante ao resolve() assíncrono acima, já que este não tem
  // nenhuma lógica assíncrona.
}
```

#### `load(url, context, nextLoad)` {#loadurl-context-nextload}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.5.0 | Adiciona suporte para versão síncrona e in-thread. |
| v20.6.0 | Adiciona suporte para `source` com formato `commonjs`. |
| v18.6.0, v16.17.0 | Adiciona suporte para encadeamento de hooks de load. Cada hook deve chamar `nextLoad()` ou incluir uma propriedade `shortCircuit` definida como `true` em seu retorno. |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).2 - Candidato a lançamento (versão assíncrona) Estabilidade: 1.1 - Desenvolvimento ativo (versão síncrona)
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A URL retornada pela cadeia `resolve`
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Condições de exportação do `package.json` relevante
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O formato opcionalmente fornecido pela cadeia de hooks `resolve`
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- `nextLoad` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O hook `load` subsequente na cadeia, ou o hook `load` padrão do Node.js após o último hook `load` fornecido pelo usuário
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) A versão assíncrona recebe um objeto contendo as seguintes propriedades ou uma `Promise` que será resolvida para tal objeto. A versão síncrona aceita apenas um objeto retornado síncronamente.
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Um sinal de que este hook pretende encerrar a cadeia de hooks `load`. **Padrão:** `false`
    - `source` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) O código-fonte para o Node.js avaliar
  
 

O hook `load` fornece uma maneira de definir um método personalizado para determinar como uma URL deve ser interpretada, recuperada e analisada. Também é responsável por validar os atributos de importação.

O valor final de `format` deve ser um dos seguintes:

| `format` | Descrição | Tipos aceitáveis para `source` retornado por `load` |
| --- | --- | --- |
| `'builtin'` | Carrega um módulo builtin do Node.js | Não aplicável |
| `'commonjs'` | Carrega um módulo CommonJS do Node.js | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) , `null` , `undefined` } |
| `'json'` | Carrega um arquivo JSON | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'module'` | Carrega um módulo ES | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'wasm'` | Carrega um módulo WebAssembly | { [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
O valor de `source` é ignorado para o tipo `'builtin'` porque atualmente não é possível substituir o valor de um módulo builtin (core) do Node.js.


##### Advertência no hook `load` assíncrono {#caveat-in-the-asynchronous-load-hook}

Ao usar o hook `load` assíncrono, omitir vs. fornecer um `source` para `'commonjs'` tem efeitos muito diferentes:

- Quando um `source` é fornecido, todas as chamadas `require` deste módulo serão processadas pelo carregador ESM com hooks `resolve` e `load` registrados; todas as chamadas `require.resolve` deste módulo serão processadas pelo carregador ESM com hooks `resolve` registrados; apenas um subconjunto da API CommonJS estará disponível (por exemplo, sem `require.extensions`, sem `require.cache`, sem `require.resolve.paths`) e o monkey-patching no carregador de módulos CommonJS não será aplicado.
- Se `source` for indefinido ou `null`, ele será tratado pelo carregador de módulos CommonJS e as chamadas `require`/`require.resolve` não passarão pelos hooks registrados. Este comportamento para `source` nulo é temporário — no futuro, `source` nulo não será suportado.

Essas advertências não se aplicam ao hook `load` síncrono, caso em que o conjunto completo de APIs CommonJS disponíveis para os módulos CommonJS personalizados, e `require`/`require.resolve` sempre passam pelos hooks registrados.

A implementação interna assíncrona `load` do Node.js, que é o valor de `next` para o último hook na cadeia `load`, retorna `null` para `source` quando `format` é `'commonjs'` para compatibilidade com versões anteriores. Aqui está um exemplo de hook que optaria por usar o comportamento não padrão:

```js [ESM]
import { readFile } from 'node:fs/promises';

// Versão assíncrona aceita por module.register(). Esta correção não é necessária
// para a versão síncrona aceita por module.registerSync().
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format === 'commonjs') {
    result.source ??= await readFile(new URL(result.responseURL ?? url));
  }
  return result;
}
```
Isso também não se aplica ao hook `load` síncrono, caso em que o `source` retornado contém o código-fonte carregado pelo próximo hook, independentemente do formato do módulo.

- O objeto [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) específico é um [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer).
- O objeto [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) específico é um [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

Se o valor `source` de um formato baseado em texto (ou seja, `'json'`, `'module'`) não for uma string, ele será convertido em uma string usando [`util.TextDecoder`](/pt/nodejs/api/util#class-utiltextdecoder).

O hook `load` fornece uma maneira de definir um método personalizado para recuperar o código-fonte de um URL resolvido. Isso permitiria que um carregador potencialmente evitasse a leitura de arquivos do disco. Ele também pode ser usado para mapear um formato não reconhecido para um suportado, por exemplo, `yaml` para `module`.

```js [ESM]
// Versão assíncrona aceita por module.register().
export async function load(url, context, nextLoad) {
  const { format } = context;

  if (Math.random() > 0.5) { // Alguma condição
    /*
      Para alguns ou todos os URLs, faça alguma lógica personalizada para recuperar o código-fonte.
      Sempre retorne um objeto da forma {
        format: <string>,
        source: <string|buffer>,
      }.
    */
    return {
      format,
      shortCircuit: true,
      source: '...',
    };
  }

  // Deferir para o próximo hook na cadeia.
  return nextLoad(url);
}
```
```js [ESM]
// Versão síncrona aceita por module.registerHooks().
function load(url, context, nextLoad) {
  // Semelhante ao load() assíncrono acima, já que este não tem
  // nenhuma lógica assíncrona.
}
```
Em um cenário mais avançado, isso também pode ser usado para transformar uma fonte não suportada em uma suportada (ver [Exemplos](/pt/nodejs/api/module#examples) abaixo).


### Exemplos {#examples}

Os vários hooks de customização de módulos podem ser usados em conjunto para realizar customizações abrangentes dos comportamentos de carregamento e avaliação de código do Node.js.

#### Importar de HTTPS {#import-from-https}

O hook abaixo registra hooks para habilitar o suporte rudimentar para tais especificadores. Embora isso possa parecer uma melhoria significativa na funcionalidade central do Node.js, há desvantagens substanciais em realmente usar esses hooks: o desempenho é muito mais lento do que carregar arquivos do disco, não há cache e não há segurança.

```js [ESM]
// https-hooks.mjs
import { get } from 'node:https';

export function load(url, context, nextLoad) {
  // Para que o JavaScript seja carregado pela rede, precisamos buscá-lo e
  // retorná-lo.
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => {
      get(url, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({
          // Este exemplo assume que todo o JavaScript fornecido pela rede é código
          // do módulo ES.
          format: 'module',
          shortCircuit: true,
          source: data,
        }));
      }).on('error', (err) => reject(err));
    });
  }

  // Deixe o Node.js lidar com todas as outras URLs.
  return nextLoad(url);
}
```
```js [ESM]
// main.mjs
import { VERSION } from 'https://coffeescript.org/browser-compiler-modern/coffeescript.js';

console.log(VERSION);
```
Com o módulo de hooks anterior, executar `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./https-hooks.mjs"));' ./main.mjs` imprime a versão atual do CoffeeScript por módulo no URL em `main.mjs`.

#### Transpilação {#transpilation}

Fontes que estão em formatos que o Node.js não entende podem ser convertidas em JavaScript usando o [`load hook`](/pt/nodejs/api/module#loadurl-context-nextload).

Isso é menos performático do que transpilar arquivos de origem antes de executar o Node.js; hooks de transpilador só devem ser usados para fins de desenvolvimento e teste.


##### Versão Assíncrona {#asynchronous-version}

```js [ESM]
// coffeescript-hooks.mjs
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

export async function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    // Arquivos CoffeeScript podem ser CommonJS ou módulos ES, então queremos que
    // qualquer arquivo CoffeeScript seja tratado pelo Node.js da mesma forma que um arquivo .js
    // no mesmo local. Para determinar como o Node.js interpretaria um .js arbitrário
    // arquivo, procure no sistema de arquivos o arquivo package.json pai mais próximo
    // e leia seu campo "type".
    const format = await getPackageType(url);

    const { source: rawSource } = await nextLoad(url, { ...context, format });
    // Este hook converte o código-fonte CoffeeScript em código-fonte JavaScript
    // para todos os arquivos CoffeeScript importados.
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  // Deixe o Node.js lidar com todos os outros URLs.
  return nextLoad(url);
}

async function getPackageType(url) {
  // `url` é apenas um caminho de arquivo durante a primeira iteração quando passado o
  // URL resolvido do hook load()
  // um caminho de arquivo real de load() conterá uma extensão de arquivo, pois é
  // exigido pela especificação
  // esta simples verificação truthy para saber se `url` contém uma extensão de arquivo irá
  // funcionar para a maioria dos projetos, mas não cobre alguns casos extremos (como
  // arquivos sem extensão ou um URL terminando em um espaço à direita)
  const isFilePath = !!extname(url);
  // Se for um caminho de arquivo, obtenha o diretório em que está
  const dir = isFilePath ?
    dirname(fileURLToPath(url)) :
    url;
  // Componha um caminho de arquivo para um package.json no mesmo diretório,
  // que pode ou não existir
  const packagePath = resolvePath(dir, 'package.json');
  // Tente ler o package.json possivelmente inexistente
  const type = await readFile(packagePath, { encoding: 'utf8' })
    .then((filestring) => JSON.parse(filestring).type)
    .catch((err) => {
      if (err?.code !== 'ENOENT') console.error(err);
    });
  // Se package.json existisse e contivesse um campo `type` com um valor, voilà
  if (type) return type;
  // Caso contrário, (se não estiver na raiz) continue verificando o próximo diretório acima
  // Se estiver na raiz, pare e retorne false
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}
```

##### Versão síncrona {#synchronous-version}

```js [ESM]
// coffeescript-sync-hooks.mjs
import { readFileSync } from 'node:fs/promises';
import { registerHooks } from 'node:module';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    const format = getPackageType(url);

    const { source: rawSource } = nextLoad(url, { ...context, format });
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  return nextLoad(url);
}

function getPackageType(url) {
  const isFilePath = !!extname(url);
  const dir = isFilePath ? dirname(fileURLToPath(url)) : url;
  const packagePath = resolvePath(dir, 'package.json');

  let type;
  try {
    const filestring = readFileSync(packagePath, { encoding: 'utf8' });
    type = JSON.parse(filestring).type;
  } catch (err) {
    if (err?.code !== 'ENOENT') console.error(err);
  }
  if (type) return type;
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}

registerHooks({ load });
```
#### Executando hooks {#running-hooks}

```coffee [COFFEECRIPT]
# main.coffee {#maincoffee}
import { scream } from './scream.coffee'
console.log scream 'hello, world'

import { version } from 'node:process'
console.log "Brought to you by Node.js version #{version}"
```
```coffee [COFFEECRIPT]
# scream.coffee {#screamcoffee}
export scream = (str) -> str.toUpperCase()
```
Com os módulos de hooks precedentes, executar `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./coffeescript-hooks.mjs"));' ./main.coffee` ou `node --import ./coffeescript-sync-hooks.mjs ./main.coffee` faz com que `main.coffee` seja transformado em JavaScript depois que seu código-fonte é carregado do disco, mas antes que o Node.js o execute; e assim por diante para quaisquer arquivos `.coffee`, `.litcoffee` ou `.coffee.md` referenciados por meio de instruções `import` de qualquer arquivo carregado.


#### Mapas de importação {#import-maps}

Os dois exemplos anteriores definiram hooks `load`. Este é um exemplo de um hook `resolve`. Este módulo de hooks lê um arquivo `import-map.json` que define quais especificadores substituir por outras URLs (esta é uma implementação muito simplista de um pequeno subconjunto da especificação de "mapas de importação").

##### Versão assíncrona {#asynchronous-version_1}

```js [ESM]
// import-map-hooks.js
import fs from 'node:fs/promises';

const { imports } = JSON.parse(await fs.readFile('import-map.json'));

export async function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}
```
##### Versão síncrona {#synchronous-version_1}

```js [ESM]
// import-map-sync-hooks.js
import fs from 'node:fs/promises';
import module from 'node:module';

const { imports } = JSON.parse(fs.readFileSync('import-map.json', 'utf-8'));

function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}

module.registerHooks({ resolve });
```
##### Usando os hooks {#using-the-hooks}

Com estes arquivos:

```js [ESM]
// main.js
import 'a-module';
```
```json [JSON]
// import-map.json
{
  "imports": {
    "a-module": "./some-module.js"
  }
}
```
```js [ESM]
// some-module.js
console.log('some module!');
```
Executando `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./import-map-hooks.js"));' main.js` ou `node --import ./import-map-sync-hooks.js main.js` deve imprimir `some module!`.

## Suporte a Source map v3 {#source-map-v3-support}

**Adicionado em: v13.7.0, v12.17.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Auxiliares para interagir com o cache de mapa de origem. Este cache é preenchido quando a análise do mapa de origem está habilitada e as [diretivas de inclusão do mapa de origem](https://sourcemaps.info/spec#h.lmz475t4mvbx) são encontradas no rodapé de um módulo.

Para habilitar a análise do mapa de origem, o Node.js deve ser executado com o sinalizador [`--enable-source-maps`](/pt/nodejs/api/cli#--enable-source-maps), ou com a cobertura de código habilitada definindo [`NODE_V8_COVERAGE=dir`](/pt/nodejs/api/cli#node_v8_coveragedir).



::: code-group
```js [ESM]
// module.mjs
// Em um módulo ECMAScript
import { findSourceMap, SourceMap } from 'node:module';
```

```js [CJS]
// module.cjs
// Em um módulo CommonJS
const { findSourceMap, SourceMap } = require('node:module');
```
:::


### `module.findSourceMap(path)` {#modulefindsourcemappath}

**Adicionado em: v13.7.0, v12.17.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<module.SourceMap\>](/pt/nodejs/api/module#class-modulesourcemap) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Retorna `module.SourceMap` se um mapa de origem for encontrado, `undefined` caso contrário.

`path` é o caminho resolvido para o arquivo para o qual um mapa de origem correspondente deve ser buscado.

### Classe: `module.SourceMap` {#class-modulesourcemap}

**Adicionado em: v13.7.0, v12.17.0**

#### `new SourceMap(payload[, { lineLengths }])` {#new-sourcemappayload-{-linelengths-}}

- `payload` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `lineLengths` [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cria uma nova instância de `sourceMap`.

`payload` é um objeto com chaves correspondentes ao [formato Source map v3](https://sourcemaps.info/spec#h.mofvlxcwqzej):

- `file`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `version`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `sources`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourcesContent`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `names`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `mappings`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourceRoot`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`lineLengths` é um array opcional do comprimento de cada linha no código gerado.

#### `sourceMap.payload` {#sourcemappayload}

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Getter para o payload usado para construir a instância [`SourceMap`](/pt/nodejs/api/module#class-modulesourcemap).


#### `sourceMap.findEntry(lineOffset, columnOffset)` {#sourcemapfindentrylineoffset-columnoffset}

- `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento do número da linha indexado em zero na fonte gerada
- `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento do número da coluna indexado em zero na fonte gerada
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Dado um deslocamento de linha e um deslocamento de coluna no arquivo de origem gerado, retorna um objeto representando o intervalo SourceMap no arquivo original, se encontrado, ou um objeto vazio, caso contrário.

O objeto retornado contém as seguintes chaves:

- generatedLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento de linha do início do intervalo na fonte gerada
- generatedColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento de coluna do início do intervalo na fonte gerada
- originalSource: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do arquivo da fonte original, conforme relatado no SourceMap
- originalLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento de linha do início do intervalo na fonte original
- originalColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O deslocamento de coluna do início do intervalo na fonte original
- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O valor retornado representa o intervalo bruto como aparece no SourceMap, com base em deslocamentos indexados em zero, *não* números de linha e coluna indexados em 1, como aparecem em mensagens de erro e objetos CallSite.

Para obter os números de linha e coluna indexados em 1 correspondentes de um lineNumber e columnNumber, conforme relatados por pilhas de erro e objetos CallSite, use `sourceMap.findOrigin(lineNumber, columnNumber)`


#### `sourceMap.findOrigin(lineNumber, columnNumber)` {#sourcemapfindoriginlinenumber-columnnumber}

- `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número da linha (indexado em 1) do local de chamada na fonte gerada
- `columnNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número da coluna (indexado em 1) do local de chamada na fonte gerada
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Dado um `lineNumber` e `columnNumber` indexados em 1 de um local de chamada na fonte gerada, encontre o local de chamada correspondente na fonte original.

Se o `lineNumber` e `columnNumber` fornecidos não forem encontrados em nenhum mapa de origem, um objeto vazio será retornado. Caso contrário, o objeto retornado contém as seguintes chaves:

- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O nome do intervalo no mapa de origem, se um foi fornecido
- fileName: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do arquivo da fonte original, conforme relatado no SourceMap
- lineNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O lineNumber (indexado em 1) do local de chamada correspondente na fonte original
- columnNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O columnNumber (indexado em 1) do local de chamada correspondente na fonte original

