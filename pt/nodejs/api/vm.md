---
title: Documentação do Módulo VM do Node.js
description: O módulo VM (Máquina Virtual) do Node.js fornece APIs para compilar e executar código dentro de contextos do motor JavaScript V8. Ele permite a criação de ambientes JavaScript isolados, a execução de código em sandbox e a gestão de contextos de script.
head:
  - - meta
    - name: og:title
      content: Documentação do Módulo VM do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo VM (Máquina Virtual) do Node.js fornece APIs para compilar e executar código dentro de contextos do motor JavaScript V8. Ele permite a criação de ambientes JavaScript isolados, a execução de código em sandbox e a gestão de contextos de script.
  - - meta
    - name: twitter:title
      content: Documentação do Módulo VM do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo VM (Máquina Virtual) do Node.js fornece APIs para compilar e executar código dentro de contextos do motor JavaScript V8. Ele permite a criação de ambientes JavaScript isolados, a execução de código em sandbox e a gestão de contextos de script.
---


# VM (executando JavaScript) {#vm-executing-javascript}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/vm.js](https://github.com/nodejs/node/blob/v23.5.0/lib/vm.js)

O módulo `node:vm` permite compilar e executar código dentro de contextos da Máquina Virtual V8.

**O módulo <code>node:vm</code> não é um mecanismo de segurança. Não o use para executar código não confiável.**

O código JavaScript pode ser compilado e executado imediatamente ou compilado, salvo e executado posteriormente.

Um caso de uso comum é executar o código em um Contexto V8 diferente. Isso significa que o código invocado tem um objeto global diferente do código invocador.

Pode-se fornecer o contexto [*contextualizando*](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) um objeto. O código invocado trata qualquer propriedade no contexto como uma variável global. Quaisquer alterações nas variáveis globais causadas pelo código invocado são refletidas no objeto de contexto.

```js [ESM]
const vm = require('node:vm');

const x = 1;

const context = { x: 2 };
vm.createContext(context); // Contextualiza o objeto.

const code = 'x += 40; var y = 17;';
// `x` e `y` são variáveis globais no contexto.
// Inicialmente, x tem o valor 2 porque esse é o valor de context.x.
vm.runInContext(code, context);

console.log(context.x); // 42
console.log(context.y); // 17

console.log(x); // 1; y não está definido.
```
## Classe: `vm.Script` {#class-vmscript}

**Adicionado em: v0.3.1**

Instâncias da classe `vm.Script` contêm scripts pré-compilados que podem ser executados em contextos específicos.

### `new vm.Script(code[, options])` {#new-vmscriptcode-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.7.0, v20.12.0 | Adicionado suporte para `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Adicionado suporte para atributos de importação ao parâmetro `importModuleDynamically`. |
| v10.6.0 | O `produceCachedData` está obsoleto em favor de `script.createCachedData()`. |
| v5.7.0 | As opções `cachedData` e `produceCachedData` são suportadas agora. |
| v0.3.1 | Adicionado em: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O código JavaScript a ser compilado.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica o nome do arquivo usado em rastreamentos de pilha produzidos por este script. **Padrão:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o deslocamento do número da linha que é exibido nos rastreamentos de pilha produzidos por este script. **Padrão:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o deslocamento do número da coluna da primeira linha que é exibido nos rastreamentos de pilha produzidos por este script. **Padrão:** `0`.
    - `cachedData` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fornece um `Buffer` ou `TypedArray` opcional, ou `DataView` com os dados do cache de código do V8 para a fonte fornecida. Quando fornecido, o valor `cachedDataRejected` será definido como `true` ou `false`, dependendo da aceitação dos dados pelo V8.
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true` e nenhum `cachedData` estiver presente, o V8 tentará produzir dados de cache de código para `code`. Após o sucesso, um `Buffer` com os dados do cache de código do V8 será produzido e armazenado na propriedade `cachedData` da instância `vm.Script` retornada. O valor `cachedDataProduced` será definido como `true` ou `false`, dependendo se os dados do cache de código foram produzidos com sucesso. Esta opção está **obsoleta** em favor de `script.createCachedData()`. **Padrão:** `false`.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/pt/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Usado para especificar como os módulos devem ser carregados durante a avaliação deste script quando `import()` é chamado. Esta opção faz parte da API de módulos experimental. Não recomendamos usá-la em um ambiente de produção. Para obter informações detalhadas, consulte [Suporte de `import()` dinâmico em APIs de compilação](/pt/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
  
 

Se `options` for uma string, então ela especifica o nome do arquivo.

Criar um novo objeto `vm.Script` compila `code` mas não o executa. O `vm.Script` compilado pode ser executado posteriormente várias vezes. O `code` não está vinculado a nenhum objeto global; em vez disso, ele é vinculado antes de cada execução, apenas para essa execução.


### `script.cachedDataRejected` {#scriptcacheddatarejected}

**Adicionado em: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Quando `cachedData` é fornecido para criar o `vm.Script`, este valor será definido como `true` ou `false` dependendo da aceitação dos dados pelo V8. Caso contrário, o valor é `undefined`.

### `script.createCachedData()` {#scriptcreatecacheddata}

**Adicionado em: v10.6.0**

- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Cria um cache de código que pode ser usado com a opção `cachedData` do construtor `Script`. Retorna um `Buffer`. Este método pode ser chamado a qualquer momento e qualquer número de vezes.

O cache de código do `Script` não contém nenhum estado observável do JavaScript. O cache de código é seguro para ser salvo junto com o código-fonte do script e usado para construir novas instâncias de `Script` várias vezes.

Funções no código-fonte do `Script` podem ser marcadas como compiladas preguiçosamente e não são compiladas na construção do `Script`. Essas funções serão compiladas quando forem invocadas pela primeira vez. O cache de código serializa os metadados que o V8 conhece atualmente sobre o `Script` que ele pode usar para acelerar futuras compilações.

```js [ESM]
const script = new vm.Script(`
function add(a, b) {
  return a + b;
}

const x = add(1, 2);
`);

const cacheWithoutAdd = script.createCachedData();
// Em `cacheWithoutAdd` a função `add()` é marcada para compilação completa
// após a invocação.

script.runInThisContext();

const cacheWithAdd = script.createCachedData();
// `cacheWithAdd` contém a função `add()` totalmente compilada.
```
### `script.runInContext(contextifiedObject[, options])` {#scriptrunincontextcontextifiedobject-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.3.0 | A opção `breakOnSigint` agora é suportada. |
| v0.3.1 | Adicionado em: v0.3.1 |
:::

- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto [contextificado](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) como retornado pelo método `vm.createContext()`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, se um [`Error`](/pt/nodejs/api/errors#class-error) ocorrer durante a compilação do `code`, a linha de código que causa o erro é anexada ao rastreamento de pilha. **Padrão:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o número de milissegundos para executar `code` antes de terminar a execução. Se a execução for terminada, um [`Error`](/pt/nodejs/api/errors#class-error) será lançado. Este valor deve ser um inteiro estritamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, receber `SIGINT` (+) terminará a execução e lançará um [`Error`](/pt/nodejs/api/errors#class-error). Os manipuladores existentes para o evento que foram anexados via `process.on('SIGINT')` são desativados durante a execução do script, mas continuam a funcionar depois disso. **Padrão:** `false`.
  
 
- Retorna: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) o resultado da última declaração executada no script.

Executa o código compilado contido pelo objeto `vm.Script` dentro do `contextifiedObject` fornecido e retorna o resultado. A execução do código não tem acesso ao escopo local.

O exemplo a seguir compila o código que incrementa uma variável global, define o valor de outra variável global e, em seguida, executa o código várias vezes. As globais estão contidas no objeto `context`.

```js [ESM]
const vm = require('node:vm');

const context = {
  animal: 'cat',
  count: 2,
};

const script = new vm.Script('count += 1; name = "kitty";');

vm.createContext(context);
for (let i = 0; i < 10; ++i) {
  script.runInContext(context);
}

console.log(context);
// Imprime: { animal: 'cat', count: 12, name: 'kitty' }
```
Usar as opções `timeout` ou `breakOnSigint` resultará no início de novos loops de eventos e threads correspondentes, que têm uma sobrecarga de desempenho não nula.


### `script.runInNewContext([contextObject[, options]])` {#scriptruninnewcontextcontextobject-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.8.0, v20.18.0 | O argumento `contextObject` agora aceita `vm.constants.DONT_CONTEXTIFY`. |
| v14.6.0 | A opção `microtaskMode` agora é suportada. |
| v10.0.0 | A opção `contextCodeGeneration` agora é suportada. |
| v6.3.0 | A opção `breakOnSigint` agora é suportada. |
| v0.3.1 | Adicionado em: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/pt/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Ou [`vm.constants.DONT_CONTEXTIFY`](/pt/nodejs/api/vm#vmconstantsdont_contextify) ou um objeto que será [contextificado](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Se `undefined`, um objeto contextificado vazio será criado para compatibilidade com versões anteriores.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, se um [`Error`](/pt/nodejs/api/errors#class-error) ocorrer durante a compilação do `code`, a linha de código que causa o erro é anexada ao stack trace. **Padrão:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o número de milissegundos para executar o `code` antes de terminar a execução. Se a execução for terminada, um [`Error`](/pt/nodejs/api/errors#class-error) será lançado. Este valor deve ser um inteiro estritamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, receber `SIGINT` (+) terminará a execução e lançará um [`Error`](/pt/nodejs/api/errors#class-error). Os manipuladores existentes para o evento que foram anexados via `process.on('SIGINT')` são desativados durante a execução do script, mas continuam a funcionar depois disso. **Padrão:** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome legível do contexto recém-criado. **Padrão:** `'VM Context i'`, onde `i` é um índice numérico ascendente do contexto criado.
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Origem](https://developer.mozilla.org/en-US/docs/Glossary/Origin) correspondente ao contexto recém-criado para fins de exibição. A origem deve ser formatada como um URL, mas apenas com o esquema, host e porta (se necessário), como o valor da propriedade [`url.origin`](/pt/nodejs/api/url#urlorigin) de um objeto [`URL`](/pt/nodejs/api/url#class-url). Notavelmente, esta string deve omitir a barra final, pois isso denota um caminho. **Padrão:** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como false, qualquer chamada para `eval` ou construtores de função (`Function`, `GeneratorFunction`, etc.) lançará um `EvalError`. **Padrão:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como false, qualquer tentativa de compilar um módulo WebAssembly lançará um `WebAssembly.CompileError`. **Padrão:** `true`.
  
 
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se definido como `afterEvaluate`, microtasks (tarefas agendadas através de `Promise`s e `async function`s) serão executadas imediatamente após a execução do script. Eles são incluídos nos escopos `timeout` e `breakOnSigint` nesse caso.
  
 
- Retorna: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) o resultado da última instrução executada no script.

Este método é um atalho para `script.runInContext(vm.createContext(options), options)`. Ele faz várias coisas ao mesmo tempo:

O exemplo a seguir compila o código que define uma variável global e, em seguida, executa o código várias vezes em contextos diferentes. Os globais são definidos e contidos em cada `context` individual.

```js [ESM]
const vm = require('node:vm');

const script = new vm.Script('globalVar = "set"');

const contexts = [{}, {}, {}];
contexts.forEach((context) => {
  script.runInNewContext(context);
});

console.log(contexts);
// Imprime: [{ globalVar: 'set' }, { globalVar: 'set' }, { globalVar: 'set' }]

// Isso lançaria um erro se o contexto fosse criado a partir de um objeto contextificado.
// vm.constants.DONT_CONTEXTIFY permite criar contextos com objetos globais comuns
// que podem ser congelados.
const freezeScript = new vm.Script('Object.freeze(globalThis); globalThis;');
const frozenContext = freezeScript.runInNewContext(vm.constants.DONT_CONTEXTIFY);
```

### `script.runInThisContext([options])` {#scriptruninthiscontextoptions}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.3.0 | A opção `breakOnSigint` agora é suportada. |
| v0.3.1 | Adicionado em: v0.3.1 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, se um [`Error`](/pt/nodejs/api/errors#class-error) ocorrer durante a compilação do `code`, a linha de código que causou o erro será anexada ao stack trace. **Padrão:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o número de milissegundos para executar o `code` antes de terminar a execução. Se a execução for terminada, um [`Error`](/pt/nodejs/api/errors#class-error) será lançado. Este valor deve ser um inteiro estritamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, receber `SIGINT` (+) terminará a execução e lançará um [`Error`](/pt/nodejs/api/errors#class-error). Os manipuladores existentes para o evento que foram anexados via `process.on('SIGINT')` são desativados durante a execução do script, mas continuam a funcionar depois disso. **Padrão:** `false`.

- Retorna: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) o resultado da última instrução executada no script.

Executa o código compilado contido pelo `vm.Script` dentro do contexto do objeto `global` atual. A execução do código não tem acesso ao escopo local, mas *tem* acesso ao objeto `global` atual.

O exemplo a seguir compila o código que incrementa uma variável `global` e, em seguida, executa esse código várias vezes:

```js [ESM]
const vm = require('node:vm');

global.globalVar = 0;

const script = new vm.Script('globalVar += 1', { filename: 'myfile.vm' });

for (let i = 0; i < 1000; ++i) {
  script.runInThisContext();
}

console.log(globalVar);

// 1000
```

### `script.sourceMapURL` {#scriptsourcemapurl}

**Adicionado em: v19.1.0, v18.13.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Quando o script é compilado a partir de uma fonte que contém um comentário mágico do mapa de origem, esta propriedade será definida com o URL do mapa de origem.



::: code-group
```js [ESM]
import vm from 'node:vm';

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```

```js [CJS]
const vm = require('node:vm');

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```
:::

## Classe: `vm.Module` {#class-vmmodule}

**Adicionado em: v13.0.0, v12.16.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Este recurso está disponível apenas com o sinalizador de comando `--experimental-vm-modules` ativado.

A classe `vm.Module` fornece uma interface de baixo nível para usar módulos ECMAScript em contextos de VM. É a contraparte da classe `vm.Script` que espelha de perto [Registros de Módulo](https://262.ecma-international.org/14.0/#sec-abstract-module-records) conforme definido na especificação ECMAScript.

Ao contrário de `vm.Script`, no entanto, cada objeto `vm.Module` está vinculado a um contexto desde sua criação. As operações em objetos `vm.Module` são intrinsecamente assíncronas, em contraste com a natureza síncrona dos objetos `vm.Script`. O uso de funções 'async' pode ajudar na manipulação de objetos `vm.Module`.

Usar um objeto `vm.Module` requer três etapas distintas: criação/análise, vinculação e avaliação. Essas três etapas são ilustradas no exemplo a seguir.

Esta implementação está em um nível inferior ao [carregador de Módulo ECMAScript](/pt/nodejs/api/esm#modules-ecmascript-modules). Também não há como interagir com o Carregador ainda, embora o suporte seja planejado.



::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

// Step 1
//
// Crie um Módulo construindo um novo objeto `vm.SourceTextModule`. Isso
// analisa o texto de origem fornecido, lançando um `SyntaxError` se algo der
// errado. Por padrão, um Módulo é criado no contexto superior. Mas aqui,
// especificamos `contextifiedObject` como o contexto ao qual este Módulo pertence.
//
// Aqui, tentamos obter a exportação padrão do módulo "foo" e
// colocá-la na ligação local "secret".

const bar = new vm.SourceTextModule(`
  import s from 'foo';
  s;
  print(s);
`, { context: contextifiedObject });

// Step 2
//
// "Vincule" as dependências importadas deste Módulo a ele.
//
// O retorno de chamada de vinculação fornecido (o "linker") aceita dois argumentos: o
// módulo pai (neste caso, `bar`) e a string que é o especificador do
// módulo importado. Espera-se que o retorno de chamada retorne um Módulo que
// corresponde ao especificador fornecido, com certos requisitos documentados
// em `module.link()`.
//
// Se a vinculação não tiver sido iniciada para o Módulo retornado, o mesmo vinculador
// retorno de chamada será chamado no Módulo retornado.
//
// Mesmo os Módulos de nível superior sem dependências devem ser explicitamente vinculados. O
// retorno de chamada fornecido nunca seria chamado, no entanto.
//
// O método link() retorna uma Promessa que será resolvida quando todas as
// Promessas retornadas pelo vinculador forem resolvidas.
//
// Nota: Este é um exemplo artificial, pois a função vinculadora cria um novo
// módulo "foo" toda vez que é chamado. Em um sistema de módulos completo, um
// cache provavelmente seria usado para evitar módulos duplicados.

async function linker(specifier, referencingModule) {
  if (specifier === 'foo') {
    return new vm.SourceTextModule(`
      // A variável "secret" refere-se à variável global que adicionamos ao
      // "contextifiedObject" ao criar o contexto.
      export default secret;
    `, { context: referencingModule.context });

    // Usar `contextifiedObject` em vez de `referencingModule.context`
    // aqui também funcionaria.
  }
  throw new Error(`Unable to resolve dependency: ${specifier}`);
}
await bar.link(linker);

// Step 3
//
// Avalie o Módulo. O método evaluate() retorna uma promessa que
// será resolvida depois que o módulo terminar de avaliar.

// Imprime 42.
await bar.evaluate();
```

```js [CJS]
const vm = require('node:vm');

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

(async () => {
  // Step 1
  //
  // Crie um Módulo construindo um novo objeto `vm.SourceTextModule`. Isso
  // analisa o texto de origem fornecido, lançando um `SyntaxError` se algo der
  // errado. Por padrão, um Módulo é criado no contexto superior. Mas aqui,
  // especificamos `contextifiedObject` como o contexto ao qual este Módulo pertence.
  //
  // Aqui, tentamos obter a exportação padrão do módulo "foo" e
  // colocá-la na ligação local "secret".

  const bar = new vm.SourceTextModule(`
    import s from 'foo';
    s;
    print(s);
  `, { context: contextifiedObject });

  // Step 2
  //
  // "Vincule" as dependências importadas deste Módulo a ele.
  //
  // O retorno de chamada de vinculação fornecido (o "linker") aceita dois argumentos: o
  // módulo pai (neste caso, `bar`) e a string que é o especificador do
  // módulo importado. Espera-se que o retorno de chamada retorne um Módulo que
  // corresponde ao especificador fornecido, com certos requisitos documentados
  // em `module.link()`.
  //
  // Se a vinculação não tiver sido iniciada para o Módulo retornado, o mesmo vinculador
  // retorno de chamada será chamado no Módulo retornado.
  //
  // Mesmo os Módulos de nível superior sem dependências devem ser explicitamente vinculados. O
  // retorno de chamada fornecido nunca seria chamado, no entanto.
  //
  // O método link() retorna uma Promessa que será resolvida quando todas as
  // Promessas retornadas pelo vinculador forem resolvidas.
  //
  // Nota: Este é um exemplo artificial, pois a função vinculadora cria um novo
  // módulo "foo" toda vez que é chamado. Em um sistema de módulos completo, um
  // cache provavelmente seria usado para evitar módulos duplicados.

  async function linker(specifier, referencingModule) {
    if (specifier === 'foo') {
      return new vm.SourceTextModule(`
        // A variável "secret" refere-se à variável global que adicionamos ao
        // "contextifiedObject" ao criar o contexto.
        export default secret;
      `, { context: referencingModule.context });

      // Usar `contextifiedObject` em vez de `referencingModule.context`
      // aqui também funcionaria.
    }
    throw new Error(`Unable to resolve dependency: ${specifier}`);
  }
  await bar.link(linker);

  // Step 3
  //
  // Avalie o Módulo. O método evaluate() retorna uma promessa que
  // será resolvida depois que o módulo terminar de avaliar.

  // Imprime 42.
  await bar.evaluate();
})();
```
:::

### `module.dependencySpecifiers` {#moduledependencyspecifiers}

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Os especificadores de todas as dependências deste módulo. O array retornado é congelado para impedir quaisquer alterações nele.

Corresponde ao campo `[[RequestedModules]]` de [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records)s na especificação ECMAScript.

### `module.error` {#moduleerror}

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Se o `module.status` for `'errored'`, esta propriedade contém a exceção lançada pelo módulo durante a avaliação. Se o status for qualquer outro, acessar esta propriedade resultará em uma exceção lançada.

O valor `undefined` não pode ser usado para casos em que não há uma exceção lançada devido à possível ambiguidade com `throw undefined;`.

Corresponde ao campo `[[EvaluationError]]` de [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records)s na especificação ECMAScript.

### `module.evaluate([options])` {#moduleevaluateoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o número de milissegundos para avaliar antes de terminar a execução. Se a execução for interrompida, um [`Error`](/pt/nodejs/api/errors#class-error) será lançado. Este valor deve ser um inteiro estritamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, receber `SIGINT` (+) terminará a execução e lançará um [`Error`](/pt/nodejs/api/errors#class-error). Os manipuladores existentes para o evento que foram anexados via `process.on('SIGINT')` são desativados durante a execução do script, mas continuam a funcionar depois disso. **Padrão:** `false`.
  
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com `undefined` após o sucesso.

Avalia o módulo.

Isso deve ser chamado após o módulo ter sido vinculado; caso contrário, ele será rejeitado. Ele pode ser chamado também quando o módulo já foi avaliado, caso em que não fará nada se a avaliação inicial terminar com sucesso (`module.status` é `'evaluated'`) ou relançará a exceção que a avaliação inicial resultou (`module.status` é `'errored'`).

Este método não pode ser chamado enquanto o módulo está sendo avaliado (`module.status` é `'evaluating'`).

Corresponde ao campo [Evaluate() concrete method](https://tc39.es/ecma262/#sec-moduleevaluation) de [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records)s na especificação ECMAScript.


### `module.identifier` {#moduleidentifier}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O identificador do módulo atual, conforme definido no construtor.

### `module.link(linker)` {#modulelinklinker}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.1.0, v20.10.0, v18.19.0 | A opção `extra.assert` foi renomeada para `extra.attributes`. O nome anterior ainda é fornecido para fins de compatibilidade retroativa. |
:::

- `linker` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    -  `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O especificador do módulo solicitado:  
    -  `referencingModule` [\<vm.Module\>](/pt/nodejs/api/vm#class-vmmodule) O objeto `Module` em que `link()` é chamado. 
    -  `extra` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `attributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Os dados do atributo:  De acordo com ECMA-262, espera-se que os hosts acionem um erro se um atributo não suportado estiver presente.
    - `assert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Alias para `extra.attributes`.
  
 
    -  Retorna: [\<vm.Module\>](/pt/nodejs/api/vm#class-vmmodule) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 
  
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Vincula as dependências do módulo. Este método deve ser chamado antes da avaliação e só pode ser chamado uma vez por módulo.

Espera-se que a função retorne um objeto `Module` ou uma `Promise` que eventualmente seja resolvida para um objeto `Module`. O `Module` retornado deve satisfazer os dois seguintes invariantes:

- Ele deve pertencer ao mesmo contexto que o `Module` pai.
- Seu `status` não deve ser `'errored'`.

Se o `status` do `Module` retornado for `'unlinked'`, este método será chamado recursivamente no `Module` retornado com a mesma função `linker` fornecida.

`link()` retorna uma `Promise` que será resolvida quando todas as instâncias de vinculação forem resolvidas para um `Module` válido ou rejeitada se a função vinculadora lançar uma exceção ou retornar um `Module` inválido.

A função vinculadora corresponde aproximadamente à operação abstrata [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) definida pela implementação na especificação ECMAScript, com algumas diferenças importantes:

- A função vinculadora pode ser assíncrona, enquanto [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) é síncrona.

A implementação real de [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) usada durante a vinculação do módulo é aquela que retorna os módulos vinculados durante a vinculação. Como nesse ponto todos os módulos já teriam sido totalmente vinculados, a implementação de [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) é totalmente síncrona por especificação.

Corresponde ao campo [Link() concrete method](https://tc39.es/ecma262/#sec-moduledeclarationlinking) de [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records)s na especificação ECMAScript.


### `module.namespace` {#modulenamespace}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

O objeto namespace do módulo. Isto só está disponível após a conclusão da vinculação (`module.link()`).

Corresponde à operação abstrata [GetModuleNamespace](https://tc39.es/ecma262/#sec-getmodulenamespace) na especificação ECMAScript.

### `module.status` {#modulestatus}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O status atual do módulo. Será um dos seguintes:

-  `'unlinked'`: `module.link()` ainda não foi chamado.
-  `'linking'`: `module.link()` foi chamado, mas nem todas as Promises retornadas pela função do vinculador foram resolvidas ainda.
-  `'linked'`: O módulo foi vinculado com sucesso e todas as suas dependências estão vinculadas, mas `module.evaluate()` ainda não foi chamado.
-  `'evaluating'`: O módulo está sendo avaliado através de um `module.evaluate()` nele mesmo ou em um módulo pai.
-  `'evaluated'`: O módulo foi avaliado com sucesso.
-  `'errored'`: O módulo foi avaliado, mas uma exceção foi lançada.

Além de `'errored'`, esta string de status corresponde ao campo `[[Status]]` do [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) da especificação. `'errored'` corresponde a `'evaluated'` na especificação, mas com `[[EvaluationError]]` definido para um valor que não é `undefined`.

## Classe: `vm.SourceTextModule` {#class-vmsourcetextmodule}

**Adicionado em: v9.6.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Este recurso só está disponível com o sinalizador de comando `--experimental-vm-modules` ativado.

- Estende: [\<vm.Module\>](/pt/nodejs/api/vm#class-vmmodule)

A classe `vm.SourceTextModule` fornece o [Source Text Module Record](https://tc39.es/ecma262/#sec-source-text-module-records) conforme definido na especificação ECMAScript.

### `new vm.SourceTextModule(code[, options])` {#new-vmsourcetextmodulecode-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.0.0, v16.12.0 | Adicionado suporte para atributos de importação ao parâmetro `importModuleDynamically`. |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Código do Módulo JavaScript para analisar
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) String usada em rastreamentos de pilha. **Padrão:** `'vm:module(i)'` onde `i` é um índice crescente específico do contexto.
    - `cachedData` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fornece um `Buffer` ou `TypedArray` opcional, ou `DataView` com os dados do cache de código do V8 para a origem fornecida. O `code` deve ser o mesmo do módulo do qual este `cachedData` foi criado.
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O objeto [contextificado](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) conforme retornado pelo método `vm.createContext()`, para compilar e avaliar este `Module` em. Se nenhum contexto for especificado, o módulo será avaliado no contexto de execução atual.
    - `lineOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o deslocamento do número da linha que é exibido em rastreamentos de pilha produzidos por este `Module`. **Padrão:** `0`.
    - `columnOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o deslocamento do número da coluna da primeira linha que é exibido em rastreamentos de pilha produzidos por este `Module`. **Padrão:** `0`.
    - `initializeImportMeta` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chamado durante a avaliação deste `Module` para inicializar o `import.meta`.
    - `meta` [\<import.meta\>](/pt/nodejs/api/esm#importmeta)
    - `module` [\<vm.SourceTextModule\>](/pt/nodejs/api/vm#class-vmsourcetextmodule)

    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Usado para especificar como os módulos devem ser carregados durante a avaliação deste módulo quando `import()` é chamado. Esta opção faz parte da API de módulos experimentais. Não recomendamos usá-lo em um ambiente de produção. Para obter informações detalhadas, consulte [Suporte de `import()` dinâmico em APIs de compilação](/pt/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

Cria uma nova instância de `SourceTextModule`.

As propriedades atribuídas ao objeto `import.meta` que são objetos podem permitir que o módulo acesse informações fora do `context` especificado. Use `vm.runInContext()` para criar objetos em um contexto específico.

::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({ secret: 42 });

const module = new vm.SourceTextModule(
  'Object.getPrototypeOf(import.meta.prop).secret = secret;',
  {
    initializeImportMeta(meta) {
      // Note: this object is created in the top context. As such,
      // Object.getPrototypeOf(import.meta.prop) points to the
      // Object.prototype in the top context rather than that in
      // the contextified object.
      meta.prop = {};
    },
  });
// Since module has no dependencies, the linker function will never be called.
await module.link(() => {});
await module.evaluate();

// Now, Object.prototype.secret will be equal to 42.
//
// To fix this problem, replace
//     meta.prop = {};
// above with
//     meta.prop = vm.runInContext('{}', contextifiedObject);
```

```js [CJS]
const vm = require('node:vm');
const contextifiedObject = vm.createContext({ secret: 42 });
(async () => {
  const module = new vm.SourceTextModule(
    'Object.getPrototypeOf(import.meta.prop).secret = secret;',
    {
      initializeImportMeta(meta) {
        // Note: this object is created in the top context. As such,
        // Object.getPrototypeOf(import.meta.prop) points to the
        // Object.prototype in the top context rather than that in
        // the contextified object.
        meta.prop = {};
      },
    });
  // Since module has no dependencies, the linker function will never be called.
  await module.link(() => {});
  await module.evaluate();
  // Now, Object.prototype.secret will be equal to 42.
  //
  // To fix this problem, replace
  //     meta.prop = {};
  // above with
  //     meta.prop = vm.runInContext('{}', contextifiedObject);
})();
```
:::


### `sourceTextModule.createCachedData()` {#sourcetextmodulecreatecacheddata}

**Adicionado em: v13.7.0, v12.17.0**

- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Cria um cache de código que pode ser usado com a opção `cachedData` do construtor `SourceTextModule`. Retorna um `Buffer`. Este método pode ser chamado várias vezes antes que o módulo seja avaliado.

O cache de código do `SourceTextModule` não contém nenhum estado observável do JavaScript. O cache de código é seguro para ser salvo junto com o código-fonte do script e usado para construir novas instâncias `SourceTextModule` várias vezes.

As funções na fonte `SourceTextModule` podem ser marcadas como compiladas preguiçosamente e não são compiladas na construção do `SourceTextModule`. Essas funções serão compiladas quando forem invocadas pela primeira vez. O cache de código serializa os metadados que o V8 conhece atualmente sobre o `SourceTextModule` que ele pode usar para acelerar compilações futuras.

```js [ESM]
// Cria um módulo inicial
const module = new vm.SourceTextModule('const a = 1;');

// Cria dados em cache a partir deste módulo
const cachedData = module.createCachedData();

// Cria um novo módulo usando os dados em cache. O código deve ser o mesmo.
const module2 = new vm.SourceTextModule('const a = 1;', { cachedData });
```
## Classe: `vm.SyntheticModule` {#class-vmsyntheticmodule}

**Adicionado em: v13.0.0, v12.16.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Este recurso está disponível apenas com a flag de comando `--experimental-vm-modules` habilitada.

- Estende: [\<vm.Module\>](/pt/nodejs/api/vm#class-vmmodule)

A classe `vm.SyntheticModule` fornece o [Synthetic Module Record](https://heycam.github.io/webidl/#synthetic-module-records) conforme definido na especificação WebIDL. O objetivo dos módulos sintéticos é fornecer uma interface genérica para expor fontes não-JavaScript a gráficos de módulos ECMAScript.

```js [ESM]
const vm = require('node:vm');

const source = '{ "a": 1 }';
const module = new vm.SyntheticModule(['default'], function() {
  const obj = JSON.parse(source);
  this.setExport('default', obj);
});

// Usa `module` no linking...
```

### `new vm.SyntheticModule(exportNames, evaluateCallback[, options])` {#new-vmsyntheticmoduleexportnames-evaluatecallback-options}

**Adicionado em: v13.0.0, v12.16.0**

- `exportNames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Array de nomes que serão exportados do módulo.
- `evaluateCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chamado quando o módulo é avaliado.
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) String usada em rastreamentos de pilha. **Padrão:** `'vm:module(i)'` onde `i` é um índice crescente específico do contexto.
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O objeto [contextificado](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) retornado pelo método `vm.createContext()`, para compilar e avaliar este `Module` em.

Cria uma nova instância `SyntheticModule`.

Objetos atribuídos às exportações desta instância podem permitir que importadores do módulo acessem informações fora do `context` especificado. Use `vm.runInContext()` para criar objetos em um contexto específico.

### `syntheticModule.setExport(name, value)` {#syntheticmodulesetexportname-value}

**Adicionado em: v13.0.0, v12.16.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome da exportação a ser definida.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O valor para o qual a exportação deve ser definida.

Este método é usado depois que o módulo é vinculado para definir os valores das exportações. Se for chamado antes que o módulo seja vinculado, um erro [`ERR_VM_MODULE_STATUS`](/pt/nodejs/api/errors#err_vm_module_status) será lançado.

::: code-group
```js [ESM]
import vm from 'node:vm';

const m = new vm.SyntheticModule(['x'], () => {
  m.setExport('x', 1);
});

await m.link(() => {});
await m.evaluate();

assert.strictEqual(m.namespace.x, 1);
```

```js [CJS]
const vm = require('node:vm');
(async () => {
  const m = new vm.SyntheticModule(['x'], () => {
    m.setExport('x', 1);
  });
  await m.link(() => {});
  await m.evaluate();
  assert.strictEqual(m.namespace.x, 1);
})();
```
:::


## `vm.compileFunction(code[, params[, options]])` {#vmcompilefunctioncode-params-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.7.0, v20.12.0 | Adicionado suporte para `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v19.6.0, v18.15.0 | O valor de retorno agora inclui `cachedDataRejected` com a mesma semântica da versão `vm.Script` se a opção `cachedData` foi passada. |
| v17.0.0, v16.12.0 | Adicionado suporte para atributos de importação ao parâmetro `importModuleDynamically`. |
| v15.9.0 | Adicionada a opção `importModuleDynamically` novamente. |
| v14.3.0 | Remoção de `importModuleDynamically` devido a problemas de compatibilidade. |
| v14.1.0, v13.14.0 | A opção `importModuleDynamically` agora é suportada. |
| v10.10.0 | Adicionado em: v10.10.0 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O corpo da função a ser compilada.
- `params` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um array de strings contendo todos os parâmetros para a função.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica o nome do arquivo usado nos rastreamentos de pilha produzidos por este script. **Padrão:** `''`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o deslocamento do número da linha que é exibido nos rastreamentos de pilha produzidos por este script. **Padrão:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o deslocamento do número da coluna da primeira linha que é exibido nos rastreamentos de pilha produzidos por este script. **Padrão:** `0`.
    - `cachedData` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fornece um `Buffer` ou `TypedArray` opcional, ou `DataView` com os dados do cache de código do V8 para a fonte fornecida. Isso deve ser produzido por uma chamada anterior para [`vm.compileFunction()`](/pt/nodejs/api/vm#vmcompilefunctioncode-params-options) com o mesmo `code` e `params`.
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Especifica se deve produzir novos dados de cache. **Padrão:** `false`.
    - `parsingContext` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O objeto [contextificado](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) no qual a referida função deve ser compilada.
    - `contextExtensions` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um array contendo uma coleção de extensões de contexto (objetos que envolvem o escopo atual) a serem aplicadas durante a compilação. **Padrão:** `[]`.

- `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/pt/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Usado para especificar como os módulos devem ser carregados durante a avaliação desta função quando `import()` é chamado. Esta opção faz parte da API de módulos experimental. Não recomendamos usá-lo em um ambiente de produção. Para obter informações detalhadas, consulte [Suporte de `import()` dinâmico em APIs de compilação](/pt/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
- Retorna: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Compila o código fornecido no contexto fornecido (se nenhum contexto for fornecido, o contexto atual será usado) e o retorna encapsulado dentro de uma função com os `params` fornecidos.


## `vm.constants` {#vmconstants}

**Adicionado em: v21.7.0, v20.12.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna um objeto contendo constantes comumente usadas para operações de VM.

### `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#vmconstantsuse_main_context_default_loader}

**Adicionado em: v21.7.0, v20.12.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

Uma constante que pode ser usada como a opção `importModuleDynamically` para `vm.Script` e `vm.compileFunction()` para que o Node.js use o carregador ESM padrão do contexto principal para carregar o módulo solicitado.

Para informações detalhadas, consulte [Suporte de `import()` dinâmico em APIs de compilação](/pt/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

## `vm.createContext([contextObject[, options]])` {#vmcreatecontextcontextobject-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.8.0, v20.18.0 | O argumento `contextObject` agora aceita `vm.constants.DONT_CONTEXTIFY`. |
| v21.7.0, v20.12.0 | Adicionado suporte para `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v21.2.0, v20.11.0 | A opção `importModuleDynamically` agora é suportada. |
| v14.6.0 | A opção `microtaskMode` agora é suportada. |
| v10.0.0 | O primeiro argumento não pode mais ser uma função. |
| v10.0.0 | A opção `codeGeneration` agora é suportada. |
| v0.3.1 | Adicionado em: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/pt/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Ou [`vm.constants.DONT_CONTEXTIFY`](/pt/nodejs/api/vm#vmconstantsdont_contextify) ou um objeto que será [contextualizado](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Se `undefined`, um objeto contextualizado vazio será criado para compatibilidade com versões anteriores.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome legível do novo contexto criado. **Padrão:** `'VM Context i'`, onde `i` é um índice numérico crescente do contexto criado.
    - `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Origem](https://developer.mozilla.org/en-US/docs/Glossary/Origin) correspondente ao novo contexto criado para fins de exibição. A origem deve ser formatada como um URL, mas com apenas o esquema, host e porta (se necessário), como o valor da propriedade [`url.origin`](/pt/nodejs/api/url#urlorigin) de um objeto [`URL`](/pt/nodejs/api/url#class-url). Notavelmente, esta string deve omitir a barra final, pois isso denota um caminho. **Padrão:** `''`.
    - `codeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como falso, quaisquer chamadas para `eval` ou construtores de função (`Function`, `GeneratorFunction`, etc.) lançarão um `EvalError`. **Padrão:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como falso, qualquer tentativa de compilar um módulo WebAssembly lançará um `WebAssembly.CompileError`. **Padrão:** `true`.
  
 
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se definido como `afterEvaluate`, microtarefas (tarefas agendadas por meio de `Promise`s e `async function`s) serão executadas imediatamente após a execução de um script por meio de [`script.runInContext()`](/pt/nodejs/api/vm#scriptrunincontextcontextifiedobject-options). Eles estão incluídos nos escopos `timeout` e `breakOnSigint` nesse caso.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/pt/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Usado para especificar como os módulos devem ser carregados quando `import()` é chamado neste contexto sem um script ou módulo referenciador. Esta opção faz parte da API de módulos experimental. Não recomendamos usá-lo em um ambiente de produção. Para informações detalhadas, consulte [Suporte de `import()` dinâmico em APIs de compilação](/pt/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
  
 
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) objeto contextualizado.

Se o `contextObject` fornecido for um objeto, o método `vm.createContext()` [preparará esse objeto](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) e retornará uma referência a ele para que possa ser usado em chamadas para [`vm.runInContext()`](/pt/nodejs/api/vm#vmrunincontextcode-contextifiedobject-options) ou [`script.runInContext()`](/pt/nodejs/api/vm#scriptrunincontextcontextifiedobject-options). Dentro de tais scripts, o objeto global será envolvido pelo `contextObject`, retendo todas as suas propriedades existentes, mas também tendo os objetos e funções integrados que qualquer [objeto global](https://es5.github.io/#x15.1) padrão possui. Fora dos scripts executados pelo módulo vm, as variáveis globais permanecerão inalteradas.

```js [ESM]
const vm = require('node:vm');

global.globalVar = 3;

const context = { globalVar: 1 };
vm.createContext(context);

vm.runInContext('globalVar *= 2;', context);

console.log(context);
// Imprime: { globalVar: 2 }

console.log(global.globalVar);
// Imprime: 3
```
Se `contextObject` for omitido (ou passado explicitamente como `undefined`), um novo objeto [contextualizado](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) vazio será retornado.

Quando o objeto global no novo contexto criado é [contextualizado](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object), ele tem algumas peculiaridades em comparação com objetos globais comuns. Por exemplo, ele não pode ser congelado. Para criar um contexto sem as peculiaridades de contextualização, passe [`vm.constants.DONT_CONTEXTIFY`](/pt/nodejs/api/vm#vmconstantsdont_contextify) como o argumento `contextObject`. Consulte a documentação de [`vm.constants.DONT_CONTEXTIFY`](/pt/nodejs/api/vm#vmconstantsdont_contextify) para obter detalhes.

O método `vm.createContext()` é principalmente útil para criar um único contexto que pode ser usado para executar vários scripts. Por exemplo, se estiver emulando um navegador da web, o método pode ser usado para criar um único contexto representando o objeto global de uma janela e, em seguida, executar todas as tags `\<script\>` juntas dentro desse contexto.

O `name` e o `origin` fornecidos do contexto são tornados visíveis através da API Inspector.


## `vm.isContext(object)` {#vmiscontextobject}

**Adicionado em: v0.11.7**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o objeto `object` fornecido foi [contextificado](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) usando [`vm.createContext()`](/pt/nodejs/api/vm#vmcreatecontextcontextobject-options), ou se é o objeto global de um contexto criado usando [`vm.constants.DONT_CONTEXTIFY`](/pt/nodejs/api/vm#vmconstantsdont_contextify).

## `vm.measureMemory([options])` {#vmmeasurememoryoptions}

**Adicionado em: v13.10.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Mede a memória conhecida pelo V8 e usada por todos os contextos conhecidos pelo isolado V8 atual, ou o contexto principal.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opcional.
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Pode ser `'summary'` ou `'detailed'`. No modo de resumo, apenas a memória medida para o contexto principal será retornada. No modo detalhado, a memória medida para todos os contextos conhecidos pelo isolado V8 atual será retornada. **Padrão:** `'summary'`
    - `execution` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Pode ser `'default'` ou `'eager'`. Com a execução padrão, a promise não será resolvida até que a próxima coleta de lixo agendada seja iniciada, o que pode demorar um pouco (ou nunca, se o programa for encerrado antes do próximo GC). Com a execução ansiosa, o GC será iniciado imediatamente para medir a memória. **Padrão:** `'default'`


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se a memória for medida com sucesso, a promise será resolvida com um objeto contendo informações sobre o uso da memória. Caso contrário, será rejeitada com um erro `ERR_CONTEXT_NOT_INITIALIZED`.

O formato do objeto com o qual a Promise retornada pode ser resolvida é específico do mecanismo V8 e pode mudar de uma versão do V8 para a outra.

O resultado retornado é diferente das estatísticas retornadas por `v8.getHeapSpaceStatistics()` em que `vm.measureMemory()` mede a memória acessível por cada contexto específico do V8 na instância atual do mecanismo V8, enquanto o resultado de `v8.getHeapSpaceStatistics()` mede a memória ocupada por cada espaço de heap na instância V8 atual.

```js [ESM]
const vm = require('node:vm');
// Measure the memory used by the main context.
vm.measureMemory({ mode: 'summary' })
  // This is the same as vm.measureMemory()
  .then((result) => {
    // The current format is:
    // {
    //   total: {
    //      jsMemoryEstimate: 2418479, jsMemoryRange: [ 2418479, 2745799 ]
    //    }
    // }
    console.log(result);
  });

const context = vm.createContext({ a: 1 });
vm.measureMemory({ mode: 'detailed', execution: 'eager' })
  .then((result) => {
    // Reference the context here so that it won't be GC'ed
    // until the measurement is complete.
    console.log(context.a);
    // {
    //   total: {
    //     jsMemoryEstimate: 2574732,
    //     jsMemoryRange: [ 2574732, 2904372 ]
    //   },
    //   current: {
    //     jsMemoryEstimate: 2438996,
    //     jsMemoryRange: [ 2438996, 2768636 ]
    //   },
    //   other: [
    //     {
    //       jsMemoryEstimate: 135736,
    //       jsMemoryRange: [ 135736, 465376 ]
    //     }
    //   ]
    // }
    console.log(result);
  });
```

## `vm.runInContext(code, contextifiedObject[, options])` {#vmrunincontextcode-contextifiedobject-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.7.0, v20.12.0 | Adicionado suporte para `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Adicionado suporte para atributos de importação ao parâmetro `importModuleDynamically`. |
| v6.3.0 | A opção `breakOnSigint` agora é suportada. |
| v0.3.1 | Adicionado em: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O código JavaScript para compilar e executar.
- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O objeto [contextificado](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) que será usado como o `global` quando o `code` for compilado e executado.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica o nome do arquivo usado nos rastreamentos de pilha produzidos por este script. **Padrão:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o deslocamento do número da linha que é exibido nos rastreamentos de pilha produzidos por este script. **Padrão:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o deslocamento do número da coluna da primeira linha que é exibido nos rastreamentos de pilha produzidos por este script. **Padrão:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, se um [`Error`](/pt/nodejs/api/errors#class-error) ocorrer ao compilar o `code`, a linha de código que causa o erro é anexada ao rastreamento de pilha. **Padrão:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o número de milissegundos para executar o `code` antes de encerrar a execução. Se a execução for encerrada, um [`Error`](/pt/nodejs/api/errors#class-error) será lançado. Este valor deve ser um inteiro estritamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, receber `SIGINT` (+) encerrará a execução e lançará um [`Error`](/pt/nodejs/api/errors#class-error). Os manipuladores existentes para o evento que foram anexados via `process.on('SIGINT')` são desativados durante a execução do script, mas continuam a funcionar depois disso. **Padrão:** `false`.
    - `cachedData` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fornece um `Buffer` ou `TypedArray`, ou `DataView` opcional com os dados de cache de código do V8 para a fonte fornecida.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/pt/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Usado para especificar como os módulos devem ser carregados durante a avaliação deste script quando `import()` é chamado. Esta opção faz parte da API de módulos experimentais. Não recomendamos usá-lo em um ambiente de produção. Para obter informações detalhadas, consulte [Suporte de `import()` dinâmico em APIs de compilação](/pt/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
  
 

O método `vm.runInContext()` compila `code`, executa-o dentro do contexto do `contextifiedObject` e, em seguida, retorna o resultado. A execução do código não tem acesso ao escopo local. O objeto `contextifiedObject` *deve* ter sido previamente [contextificado](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) usando o método [`vm.createContext()`](/pt/nodejs/api/vm#vmcreatecontextcontextobject-options).

Se `options` for uma string, então ela especifica o nome do arquivo.

O exemplo a seguir compila e executa diferentes scripts usando um único objeto [contextificado](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object):

```js [ESM]
const vm = require('node:vm');

const contextObject = { globalVar: 1 };
vm.createContext(contextObject);

for (let i = 0; i < 10; ++i) {
  vm.runInContext('globalVar *= 2;', contextObject);
}
console.log(contextObject);
// Prints: { globalVar: 1024 }
```

## `vm.runInNewContext(code[, contextObject[, options]])` {#vmruninnewcontextcode-contextobject-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.8.0, v20.18.0 | O argumento `contextObject` agora aceita `vm.constants.DONT_CONTEXTIFY`. |
| v21.7.0, v20.12.0 | Adicionado suporte para `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Adicionado suporte para atributos de importação ao parâmetro `importModuleDynamically`. |
| v14.6.0 | A opção `microtaskMode` agora é suportada. |
| v10.0.0 | A opção `contextCodeGeneration` agora é suportada. |
| v6.3.0 | A opção `breakOnSigint` agora é suportada. |
| v0.3.1 | Adicionado em: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O código JavaScript para compilar e executar.
- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/pt/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Ou [`vm.constants.DONT_CONTEXTIFY`](/pt/nodejs/api/vm#vmconstantsdont_contextify) ou um objeto que será [contextificado](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Se `undefined`, um objeto contextificado vazio será criado para compatibilidade com versões anteriores.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica o nome do arquivo usado nos rastreamentos de pilha produzidos por este script. **Padrão:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o deslocamento do número da linha que é exibido nos rastreamentos de pilha produzidos por este script. **Padrão:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o deslocamento do número da coluna da primeira linha que é exibido nos rastreamentos de pilha produzidos por este script. **Padrão:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, se um [`Error`](/pt/nodejs/api/errors#class-error) ocorrer durante a compilação do `code`, a linha de código que causou o erro é anexada ao rastreamento de pilha. **Padrão:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o número de milissegundos para executar `code` antes de terminar a execução. Se a execução for terminada, um [`Error`](/pt/nodejs/api/errors#class-error) será lançado. Este valor deve ser um inteiro estritamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, receber `SIGINT` (+) terminará a execução e lançará um [`Error`](/pt/nodejs/api/errors#class-error). Os manipuladores existentes para o evento que foram anexados via `process.on('SIGINT')` são desativados durante a execução do script, mas continuam a funcionar depois disso. **Padrão:** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome legível do contexto recém-criado. **Padrão:** `'VM Context i'`, onde `i` é um índice numérico crescente do contexto criado.
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Origem](https://developer.mozilla.org/en-US/docs/Glossary/Origin) correspondente ao contexto recém-criado para fins de exibição. A origem deve ser formatada como um URL, mas apenas com o esquema, host e porta (se necessário), como o valor da propriedade [`url.origin`](/pt/nodejs/api/url#urlorigin) de um objeto [`URL`](/pt/nodejs/api/url#class-url). Notavelmente, esta string deve omitir a barra final, pois isso denota um caminho. **Padrão:** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como falso, qualquer chamada para `eval` ou construtores de função (`Function`, `GeneratorFunction`, etc.) lançará um `EvalError`. **Padrão:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como falso, qualquer tentativa de compilar um módulo WebAssembly lançará um `WebAssembly.CompileError`. **Padrão:** `true`.
  
 
    - `cachedData` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fornece um `Buffer` ou `TypedArray` ou `DataView` opcional com os dados do cache de código do V8 para a fonte fornecida.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/pt/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Usado para especificar como os módulos devem ser carregados durante a avaliação deste script quando `import()` é chamado. Esta opção faz parte da API de módulos experimentais. Não recomendamos usá-la em um ambiente de produção. Para obter informações detalhadas, consulte [Suporte de `import()` dinâmico em APIs de compilação](/pt/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se definido como `afterEvaluate`, microtarefas (tarefas agendadas através de `Promise`s e `async function`s) serão executadas imediatamente após a execução do script. Elas são incluídas nos escopos `timeout` e `breakOnSigint` nesse caso.
  
 
- Retorna: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) o resultado da última declaração executada no script.

Este método é um atalho para `(new vm.Script(code, options)).runInContext(vm.createContext(options), options)`. Se `options` for uma string, então especifica o nome do arquivo.

Ele faz várias coisas de uma vez:

O exemplo a seguir compila e executa o código que incrementa uma variável global e define uma nova. Esses globais estão contidos no `contextObject`.

```js [ESM]
const vm = require('node:vm');

const contextObject = {
  animal: 'cat',
  count: 2,
};

vm.runInNewContext('count += 1; name = "kitty"', contextObject);
console.log(contextObject);
// Imprime: { animal: 'cat', count: 3, name: 'kitty' }

// Isso lançaria um erro se o contexto fosse criado a partir de um objeto contextificado.
// vm.constants.DONT_CONTEXTIFY permite criar contextos com objetos globais comuns que
// podem ser congelados.
const frozenContext = vm.runInNewContext('Object.freeze(globalThis); globalThis;', vm.constants.DONT_CONTEXTIFY);
```

## `vm.runInThisContext(code[, options])` {#vmruninthiscontextcode-options}

::: info [Histórico]
| Versão | Mudanças |
|---|---|
| v21.7.0, v20.12.0 | Adicionado suporte para `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Adicionado suporte para atributos de importação ao parâmetro `importModuleDynamically`. |
| v6.3.0 | A opção `breakOnSigint` agora é suportada. |
| v0.3.1 | Adicionado em: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O código JavaScript a ser compilado e executado.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica o nome do arquivo usado nos rastreamentos de pilha produzidos por este script. **Padrão:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o deslocamento do número da linha que é exibido nos rastreamentos de pilha produzidos por este script. **Padrão:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o deslocamento do número da coluna da primeira linha que é exibido nos rastreamentos de pilha produzidos por este script. **Padrão:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, se um [`Error`](/pt/nodejs/api/errors#class-error) ocorrer ao compilar o `code`, a linha de código que causa o erro é anexada ao rastreamento de pilha. **Padrão:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o número de milissegundos para executar o `code` antes de terminar a execução. Se a execução for terminada, um [`Error`](/pt/nodejs/api/errors#class-error) será lançado. Este valor deve ser um inteiro estritamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, receber `SIGINT` (+) terminará a execução e lançará um [`Error`](/pt/nodejs/api/errors#class-error). Os manipuladores existentes para o evento que foram anexados via `process.on('SIGINT')` são desativados durante a execução do script, mas continuam a funcionar depois disso. **Padrão:** `false`.
    - `cachedData` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fornece um `Buffer` ou `TypedArray` opcional, ou `DataView` com os dados do cache de código do V8 para a fonte fornecida.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/pt/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Usado para especificar como os módulos devem ser carregados durante a avaliação deste script quando `import()` é chamado. Esta opção faz parte da API de módulos experimentais. Não recomendamos usá-la em um ambiente de produção. Para informações detalhadas, consulte [Suporte de `import()` dinâmico em APIs de compilação](/pt/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).


- Retorna: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) o resultado da última instrução executada no script.

`vm.runInThisContext()` compila `code`, executa-o dentro do contexto do `global` atual e retorna o resultado. A execução do código não tem acesso ao escopo local, mas tem acesso ao objeto `global` atual.

Se `options` for uma string, então especifica o nome do arquivo.

O exemplo a seguir ilustra o uso de `vm.runInThisContext()` e da função JavaScript [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) para executar o mesmo código:

```js [ESM]
const vm = require('node:vm');
let localVar = 'initial value';

const vmResult = vm.runInThisContext('localVar = "vm";');
console.log(`vmResult: '${vmResult}', localVar: '${localVar}'`);
// Prints: vmResult: 'vm', localVar: 'initial value'

const evalResult = eval('localVar = "eval";');
console.log(`evalResult: '${evalResult}', localVar: '${localVar}'`);
// Prints: evalResult: 'eval', localVar: 'eval'
```
Como `vm.runInThisContext()` não tem acesso ao escopo local, `localVar` permanece inalterado. Em contraste, [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) *tem* acesso ao escopo local, então o valor `localVar` é alterado. Desta forma, `vm.runInThisContext()` é muito parecido com uma [chamada `eval()` indireta](https://es5.github.io/#x10.4.2), por exemplo, `(0,eval)('code')`.


## Exemplo: Executando um servidor HTTP dentro de uma VM {#example-running-an-http-server-within-a-vm}

Ao usar [`script.runInThisContext()`](/pt/nodejs/api/vm#scriptruninthiscontextoptions) ou [`vm.runInThisContext()`](/pt/nodejs/api/vm#vmruninthiscontextcode-options), o código é executado dentro do contexto global V8 atual. O código passado para este contexto VM terá seu próprio escopo isolado.

Para executar um servidor web simples usando o módulo `node:http`, o código passado para o contexto deve chamar `require('node:http')` por conta própria, ou ter uma referência ao módulo `node:http` passada para ele. Por exemplo:

```js [ESM]
'use strict';
const vm = require('node:vm');

const code = `
((require) => {
  const http = require('node:http');

  http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Olá Mundo\\n');
  }).listen(8124);

  console.log('Servidor rodando em http://127.0.0.1:8124/');
})`;

vm.runInThisContext(code)(require);
```
O `require()` no caso acima compartilha o estado com o contexto do qual é passado. Isso pode introduzir riscos quando um código não confiável é executado, por exemplo, alterando objetos no contexto de maneiras indesejadas.

## O que significa "contextualizar" um objeto? {#what-does-it-mean-to-"contextify"-an-object?}

Todo JavaScript executado dentro do Node.js é executado dentro do escopo de um "contexto". De acordo com o [Guia do Incorporador V8](https://v8.dev/docs/embed#contexts):

Quando o método `vm.createContext()` é chamado com um objeto, o argumento `contextObject` será usado para envolver o objeto global de uma nova instância de um Contexto V8 (se `contextObject` for `undefined`, um novo objeto será criado a partir do contexto atual antes de ser contextualizado). Este Contexto V8 fornece ao `code` executado usando os métodos do módulo `node:vm` um ambiente global isolado dentro do qual ele pode operar. O processo de criação do Contexto V8 e associação com o `contextObject` no contexto externo é o que este documento se refere como "contextualizar" o objeto.

A contextualização introduziria algumas peculiaridades ao valor `globalThis` no contexto. Por exemplo, ele não pode ser congelado e não é referência igual ao `contextObject` no contexto externo.

```js [ESM]
const vm = require('node:vm');

// Uma opção `contextObject` indefinida faz com que o objeto global seja contextualizado.
const context = vm.createContext();
console.log(vm.runInContext('globalThis', context) === context);  // false
// Um objeto global contextualizado não pode ser congelado.
try {
  vm.runInContext('Object.freeze(globalThis);', context);
} catch (e) {
  console.log(e); // TypeError: Cannot freeze
}
console.log(vm.runInContext('globalThis.foo = 1; foo;', context));  // 1
```
Para criar um contexto com um objeto global comum e obter acesso a um proxy global no contexto externo com menos peculiaridades, especifique `vm.constants.DONT_CONTEXTIFY` como o argumento `contextObject`.


### `vm.constants.DONT_CONTEXTIFY` {#vmconstantsdont_contextify}

Quando usada como o argumento `contextObject` nas APIs de vm, essa constante instrui o Node.js a criar um contexto sem encapsular seu objeto global com outro objeto de uma maneira específica do Node.js. Como resultado, o valor `globalThis` dentro do novo contexto se comportaria de forma mais semelhante a um objeto comum.

```js [ESM]
const vm = require('node:vm');

// Use vm.constants.DONT_CONTEXTIFY para congelar o objeto global.
const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);
vm.runInContext('Object.freeze(globalThis);', context);
try {
  vm.runInContext('bar = 1; bar;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: bar is not defined
}
```
Quando `vm.constants.DONT_CONTEXTIFY` é usado como o argumento `contextObject` para [`vm.createContext()`](/pt/nodejs/api/vm#vmcreatecontextcontextobject-options), o objeto retornado é um objeto semelhante a um proxy para o objeto global no contexto recém-criado com menos peculiaridades específicas do Node.js. É igual em referência ao valor `globalThis` no novo contexto, pode ser modificado de fora do contexto e pode ser usado para acessar built-ins diretamente no novo contexto.

```js [ESM]
const vm = require('node:vm');

const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);

// O objeto retornado é igual em referência ao globalThis no novo contexto.
console.log(vm.runInContext('globalThis', context) === context);  // true

// Pode ser usado para acessar globais diretamente no novo contexto.
console.log(context.Array);  // [Function: Array]
vm.runInContext('foo = 1;', context);
console.log(context.foo);  // 1
context.bar = 1;
console.log(vm.runInContext('bar;', context));  // 1

// Pode ser congelado e afeta o contexto interno.
Object.freeze(context);
try {
  vm.runInContext('baz = 1; baz;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: baz is not defined
}
```
## Interações de tempo limite com tarefas assíncronas e Promises {#timeout-interactions-with-asynchronous-tasks-and-promises}

`Promise`s e `async function`s podem agendar tarefas executadas pelo mecanismo JavaScript de forma assíncrona. Por padrão, essas tarefas são executadas depois que todas as funções JavaScript na pilha atual terminarem de ser executadas. Isso permite escapar da funcionalidade das opções `timeout` e `breakOnSigint`.

Por exemplo, o seguinte código executado por `vm.runInNewContext()` com um tempo limite de 5 milissegundos agenda um loop infinito para ser executado após a resolução de uma promise. O loop agendado nunca é interrompido pelo tempo limite:

```js [ESM]
const vm = require('node:vm');

function loop() {
  console.log('entering loop');
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5 },
);
// Isso é impresso *antes* de 'entering loop' (!)
console.log('done executing');
```
Isso pode ser resolvido passando `microtaskMode: 'afterEvaluate'` para o código que cria o `Context`:

```js [ESM]
const vm = require('node:vm');

function loop() {
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5, microtaskMode: 'afterEvaluate' },
);
```
Nesse caso, a microtarefa agendada por meio de `promise.then()` será executada antes de retornar de `vm.runInNewContext()` e será interrompida pela funcionalidade de `timeout`. Isso se aplica apenas ao código em execução em um `vm.Context`, portanto, por exemplo, [`vm.runInThisContext()`](/pt/nodejs/api/vm#vmruninthiscontextcode-options) não aceita esta opção.

Os retornos de chamada de Promise são inseridos na fila de microtarefas do contexto em que foram criados. Por exemplo, se `() =\> loop()` for substituído apenas por `loop` no exemplo acima, `loop` será inserido na fila global de microtarefas, porque é uma função do contexto externo (principal) e, portanto, também poderá escapar do tempo limite.

Se funções de agendamento assíncronas como `process.nextTick()`, `queueMicrotask()`, `setTimeout()`, `setImmediate()`, etc. estiverem disponíveis dentro de um `vm.Context`, as funções passadas para elas serão adicionadas às filas globais, que são compartilhadas por todos os contextos. Portanto, os retornos de chamada passados para essas funções também não são controláveis pelo tempo limite.


## Suporte do `import()` dinâmico em APIs de compilação {#support-of-dynamic-import-in-compilation-apis}

As seguintes APIs suportam uma opção `importModuleDynamically` para habilitar o `import()` dinâmico no código compilado pelo módulo vm.

- `new vm.Script`
- `vm.compileFunction()`
- `new vm.SourceTextModule`
- `vm.runInThisContext()`
- `vm.runInContext()`
- `vm.runInNewContext()`
- `vm.createContext()`

Esta opção ainda faz parte da API de módulos experimental. Não recomendamos usá-la em um ambiente de produção.

### Quando a opção `importModuleDynamically` não é especificada ou é indefinida {#when-the-importmoduledynamically-option-is-not-specified-or-undefined}

Se esta opção não for especificada, ou se for `undefined`, o código que contém `import()` ainda pode ser compilado pelas APIs vm, mas quando o código compilado é executado e realmente chama `import()`, o resultado será rejeitado com [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`](/pt/nodejs/api/errors#err_vm_dynamic_import_callback_missing).

### Quando `importModuleDynamically` é `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#when-importmoduledynamically-is-vmconstantsuse_main_context_default_loader}

Esta opção não é atualmente suportada para `vm.SourceTextModule`.

Com esta opção, quando um `import()` é iniciado no código compilado, o Node.js usaria o carregador ESM padrão do contexto principal para carregar o módulo solicitado e retorná-lo ao código que está sendo executado.

Isso dá acesso a módulos integrados do Node.js, como `fs` ou `http`, ao código que está sendo compilado. Se o código for executado em um contexto diferente, esteja ciente de que os objetos criados por módulos carregados do contexto principal ainda são do contexto principal e não `instanceof` classes integradas no novo contexto.

::: code-group
```js [CJS]
const { Script, constants } = require('node:vm');
const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: URL carregado do contexto principal não é uma instância da classe Function
// no novo contexto.
script.runInNewContext().then(console.log);
```

```js [ESM]
import { Script, constants } from 'node:vm';

const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: URL carregado do contexto principal não é uma instância da classe Function
// no novo contexto.
script.runInNewContext().then(console.log);
```
:::

Esta opção também permite que o script ou função carregue módulos de usuário:

::: code-group
```js [ESM]
import { Script, constants } from 'node:vm';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

// Escreve test.js e test.txt no diretório onde o script atual
// que está sendo executado está localizado.
writeFileSync(resolve(import.meta.dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(import.meta.dirname, 'test.json'),
              '{"hello": "world"}');

// Compila um script que carrega test.mjs e então test.json
// como se o script estivesse localizado no mesmo diretório.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(import.meta.dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```

```js [CJS]
const { Script, constants } = require('node:vm');
const { resolve } = require('node:path');
const { writeFileSync } = require('node:fs');

// Escreve test.js e test.txt no diretório onde o script atual
// que está sendo executado está localizado.
writeFileSync(resolve(__dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(__dirname, 'test.json'),
              '{"hello": "world"}');

// Compila um script que carrega test.mjs e então test.json
// como se o script estivesse localizado no mesmo diretório.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(__dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```
:::

Existem algumas ressalvas ao carregar módulos de usuário usando o carregador padrão do contexto principal:


### Quando `importModuleDynamically` é uma função {#when-importmoduledynamically-is-a-function}

Quando `importModuleDynamically` é uma função, ela será invocada quando `import()` for chamado no código compilado para que os usuários personalizem como o módulo solicitado deve ser compilado e avaliado. Atualmente, a instância do Node.js deve ser iniciada com a flag `--experimental-vm-modules` para que esta opção funcione. Se a flag não for definida, este callback será ignorado. Se o código avaliado realmente chamar `import()`, o resultado será rejeitado com [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`](/pt/nodejs/api/errors#err_vm_dynamic_import_callback_missing_flag).

O callback `importModuleDynamically(specifier, referrer, importAttributes)` tem a seguinte assinatura:

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) especificador passado para `import()`
- `referrer` [\<vm.Script\>](/pt/nodejs/api/vm#class-vmscript) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.SourceTextModule\>](/pt/nodejs/api/vm#class-vmsourcetextmodule) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O referrer é o `vm.Script` compilado para `new vm.Script`, `vm.runInThisContext`, `vm.runInContext` e `vm.runInNewContext`. É a `Function` compilada para `vm.compileFunction`, o `vm.SourceTextModule` compilado para `new vm.SourceTextModule` e o `Object` de contexto para `vm.createContext()`.
- `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O valor `"with"` passado para o parâmetro opcional [`optionsExpression`](https://tc39.es/proposal-import-attributes/#sec-evaluate-import-call), ou um objeto vazio se nenhum valor foi fornecido.
- Retorna: [\<Module Namespace Object\>](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects) | [\<vm.Module\>](/pt/nodejs/api/vm#class-vmmodule) Retornar um `vm.Module` é recomendado para aproveitar o rastreamento de erros e evitar problemas com namespaces que contenham exportações de função `then`.

::: code-group
```js [ESM]
// Este script deve ser executado com --experimental-vm-modules.
import { Script, SyntheticModule } from 'node:vm';

const script = new Script('import("foo.json", { with: { type: "json" } })', {
  async importModuleDynamically(specifier, referrer, importAttributes) {
    console.log(specifier);  // 'foo.json'
    console.log(referrer);   // O script compilado
    console.log(importAttributes);  // { type: 'json' }
    const m = new SyntheticModule(['bar'], () => { });
    await m.link(() => { });
    m.setExport('bar', { hello: 'world' });
    return m;
  },
});
const result = await script.runInThisContext();
console.log(result);  //  { bar: { hello: 'world' } }
```

```js [CJS]
// Este script deve ser executado com --experimental-vm-modules.
const { Script, SyntheticModule } = require('node:vm');

(async function main() {
  const script = new Script('import("foo.json", { with: { type: "json" } })', {
    async importModuleDynamically(specifier, referrer, importAttributes) {
      console.log(specifier);  // 'foo.json'
      console.log(referrer);   // O script compilado
      console.log(importAttributes);  // { type: 'json' }
      const m = new SyntheticModule(['bar'], () => { });
      await m.link(() => { });
      m.setExport('bar', { hello: 'world' });
      return m;
    },
  });
  const result = await script.runInThisContext();
  console.log(result);  //  { bar: { hello: 'world' } }
})();
```
:::

