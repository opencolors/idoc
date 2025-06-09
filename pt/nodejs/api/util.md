---
title: Documentação do Node.js - Utilitários
description: A documentação do Node.js para o módulo 'util', que fornece funções utilitárias para aplicações Node.js, incluindo depuração, inspeção de objetos, e mais.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Utilitários | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: A documentação do Node.js para o módulo 'util', que fornece funções utilitárias para aplicações Node.js, incluindo depuração, inspeção de objetos, e mais.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Utilitários | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: A documentação do Node.js para o módulo 'util', que fornece funções utilitárias para aplicações Node.js, incluindo depuração, inspeção de objetos, e mais.
---


# Util {#util}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/util.js](https://github.com/nodejs/node/blob/v23.5.0/lib/util.js)

O módulo `node:util` suporta as necessidades das APIs internas do Node.js. Muitas das utilidades também são úteis para desenvolvedores de aplicativos e módulos. Para acessá-lo:

```js [ESM]
const util = require('node:util');
```
## `util.callbackify(original)` {#utilcallbackifyoriginal}

**Adicionado em: v8.2.0**

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função `async`
- Retorna: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) uma função de estilo callback

Recebe uma função `async` (ou uma função que retorna uma `Promise`) e retorna uma função seguindo o estilo de callback de error-first, ou seja, recebendo um callback `(err, value) => ...` como o último argumento. No callback, o primeiro argumento será o motivo da rejeição (ou `null` se a `Promise` for resolvida), e o segundo argumento será o valor resolvido.

```js [ESM]
const util = require('node:util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```
Irá imprimir:

```text [TEXT]
hello world
```
O callback é executado de forma assíncrona e terá um stack trace limitado. Se o callback lançar um erro, o processo emitirá um evento [`'uncaughtException'`](/pt/nodejs/api/process#event-uncaughtexception) e, se não for tratado, será encerrado.

Como `null` tem um significado especial como o primeiro argumento para um callback, se uma função encapsulada rejeitar uma `Promise` com um valor falsy como motivo, o valor é encapsulado em um `Error` com o valor original armazenado em um campo chamado `reason`.

```js [ESM]
function fn() {
  return Promise.reject(null);
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  // Quando a Promise foi rejeitada com `null`, ela é encapsulada com um Error e
  // o valor original é armazenado em `reason`.
  err && Object.hasOwn(err, 'reason') && err.reason === null;  // true
});
```

## `util.debuglog(section[, callback])` {#utildebuglogsection-callback}

**Adicionado em: v0.11.3**

- `section` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma string que identifica a parte do aplicativo para a qual a função `debuglog` está sendo criada.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Um callback invocado na primeira vez que a função de registro é chamada com um argumento de função que é uma função de registro mais otimizada.
- Retorna: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função de registro

O método `util.debuglog()` é usado para criar uma função que grava condicionalmente mensagens de depuração em `stderr` com base na existência da variável de ambiente `NODE_DEBUG`. Se o nome da `section` aparecer dentro do valor dessa variável de ambiente, a função retornada opera de forma semelhante a [`console.error()`](/pt/nodejs/api/console#consoleerrordata-args). Caso contrário, a função retornada é uma operação nula.

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo');

debuglog('olá de foo [%d]', 123);
```
Se este programa for executado com `NODE_DEBUG=foo` no ambiente, ele produzirá algo como:

```bash [BASH]
FOO 3245: olá de foo [123]
```
onde `3245` é o ID do processo. Se não for executado com essa variável de ambiente definida, não imprimirá nada.

A `section` também suporta curinga:

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo-bar');

debuglog('oi, aqui é foo-bar [%d]', 2333);
```
se for executado com `NODE_DEBUG=foo*` no ambiente, ele produzirá algo como:

```bash [BASH]
FOO-BAR 3257: oi, aqui é foo-bar [2333]
```
Vários nomes de `section` separados por vírgula podem ser especificados na variável de ambiente `NODE_DEBUG`: `NODE_DEBUG=fs,net,tls`.

O argumento opcional `callback` pode ser usado para substituir a função de registro por uma função diferente que não tenha nenhuma inicialização ou encapsulamento desnecessário.

```js [ESM]
const util = require('node:util');
let debuglog = util.debuglog('internals', (debug) => {
  // Substituir por uma função de registro que otimiza
  // o teste se a section está habilitada
  debuglog = debug;
});
```

### `debuglog().enabled` {#debuglogenabled}

**Adicionado em: v14.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

O getter `util.debuglog().enabled` é usado para criar um teste que pode ser usado em condicionais com base na existência da variável de ambiente `NODE_DEBUG`. Se o nome da `section` aparecer dentro do valor dessa variável de ambiente, o valor retornado será `true`. Caso contrário, o valor retornado será `false`.

```js [ESM]
const util = require('node:util');
const enabled = util.debuglog('foo').enabled;
if (enabled) {
  console.log('hello from foo [%d]', 123);
}
```
Se este programa for executado com `NODE_DEBUG=foo` no ambiente, ele produzirá algo como:

```bash [BASH]
hello from foo [123]
```
## `util.debug(section)` {#utildebugsection}

**Adicionado em: v14.9.0**

Alias para `util.debuglog`. O uso permite a legibilidade de algo que não implica o registro quando se usa apenas `util.debuglog().enabled`.

## `util.deprecate(fn, msg[, code])` {#utildeprecatefn-msg-code}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Avisos de obsolescência são emitidos apenas uma vez para cada código. |
| v0.8.0 | Adicionado em: v0.8.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função que está sendo depreciada.
- `msg` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma mensagem de aviso a ser exibida quando a função depreciada é invocada.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um código de depreciação. Veja a [lista de APIs depreciadas](/pt/nodejs/api/deprecations#list-of-deprecated-apis) para uma lista de códigos.
- Retorna: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função depreciada encapsulada para emitir um aviso.

O método `util.deprecate()` envolve `fn` (que pode ser uma função ou classe) de forma que seja marcado como obsoleto.

```js [ESM]
const util = require('node:util');

exports.obsoleteFunction = util.deprecate(() => {
  // Faça algo aqui.
}, 'obsoleteFunction() está obsoleta. Use newShinyFunction() em vez disso.');
```
Quando chamado, `util.deprecate()` retornará uma função que emitirá um `DeprecationWarning` usando o evento [`'warning'`](/pt/nodejs/api/process#event-warning). O aviso será emitido e impresso em `stderr` na primeira vez que a função retornada for chamada. Depois que o aviso for emitido, a função encapsulada é chamada sem emitir um aviso.

Se o mesmo `code` opcional for fornecido em várias chamadas para `util.deprecate()`, o aviso será emitido apenas uma vez para esse `code`.

```js [ESM]
const util = require('node:util');

const fn1 = util.deprecate(someFunction, someMessage, 'DEP0001');
const fn2 = util.deprecate(someOtherFunction, someOtherMessage, 'DEP0001');
fn1(); // Emite um aviso de obsolescência com o código DEP0001
fn2(); // Não emite um aviso de obsolescência porque tem o mesmo código
```
Se os flags de linha de comando `--no-deprecation` ou `--no-warnings` forem usados, ou se a propriedade `process.noDeprecation` for definida como `true` *antes* do primeiro aviso de obsolescência, o método `util.deprecate()` não fará nada.

Se os flags de linha de comando `--trace-deprecation` ou `--trace-warnings` forem definidos, ou a propriedade `process.traceDeprecation` for definida como `true`, um aviso e um rastreamento de pilha serão impressos em `stderr` na primeira vez que a função depreciada for chamada.

Se o flag de linha de comando `--throw-deprecation` for definido, ou a propriedade `process.throwDeprecation` for definida como `true`, uma exceção será lançada quando a função depreciada for chamada.

O flag de linha de comando `--throw-deprecation` e a propriedade `process.throwDeprecation` têm precedência sobre `--trace-deprecation` e `process.traceDeprecation`.


## `util.format(format[, ...args])` {#utilformatformat-args}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.11.0 | O especificador `%c` é ignorado agora. |
| v12.0.0 | O argumento `format` agora é considerado como tal apenas se realmente contiver especificadores de formato. |
| v12.0.0 | Se o argumento `format` não for uma string de formato, a formatação da string de saída não dependerá mais do tipo do primeiro argumento. Essa alteração remove as aspas presentes anteriormente de strings que estavam sendo exibidas quando o primeiro argumento não era uma string. |
| v11.4.0 | Os especificadores `%d`, `%f` e `%i` agora suportam Symbols corretamente. |
| v11.4.0 | A `depth` do especificador `%o` tem profundidade padrão de 4 novamente. |
| v11.0.0 | A opção `depth` do especificador `%o` agora voltará para a profundidade padrão. |
| v10.12.0 | Os especificadores `%d` e `%i` agora suportam BigInt. |
| v8.4.0 | Os especificadores `%o` e `%O` agora são suportados. |
| v0.5.3 | Adicionado em: v0.5.3 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma string de formato semelhante a `printf`.

O método `util.format()` retorna uma string formatada usando o primeiro argumento como uma string de formato semelhante a `printf` que pode conter zero ou mais especificadores de formato. Cada especificador é substituído pelo valor convertido do argumento correspondente. Os especificadores suportados são:

- `%s`: `String` será usado para converter todos os valores, exceto `BigInt`, `Object` e `-0`. Os valores `BigInt` serão representados com um `n` e os Objetos que não possuem uma função `toString` definida pelo usuário são inspecionados usando `util.inspect()` com as opções `{ depth: 0, colors: false, compact: 3 }`.
- `%d`: `Number` será usado para converter todos os valores, exceto `BigInt` e `Symbol`.
- `%i`: `parseInt(value, 10)` é usado para todos os valores, exceto `BigInt` e `Symbol`.
- `%f`: `parseFloat(value)` é usado para todos os valores, exceto `Symbol`.
- `%j`: JSON. Substituído pela string `'[Circular]'` se o argumento contiver referências circulares.
- `%o`: `Object`. Uma representação de string de um objeto com formatação de objeto JavaScript genérica. Semelhante a `util.inspect()` com as opções `{ showHidden: true, showProxy: true }`. Isso mostrará o objeto completo, incluindo propriedades não enumeráveis e proxies.
- `%O`: `Object`. Uma representação de string de um objeto com formatação de objeto JavaScript genérica. Semelhante a `util.inspect()` sem opções. Isso mostrará o objeto completo, não incluindo propriedades não enumeráveis e proxies.
- `%c`: `CSS`. Este especificador é ignorado e ignorará qualquer CSS passado.
- `%%`: sinal de porcentagem único (`'%'`). Isso não consome um argumento.
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A string formatada

Se um especificador não tiver um argumento correspondente, ele não será substituído:

```js [ESM]
util.format('%s:%s', 'foo');
// Retorna: 'foo:%s'
```
Valores que não fazem parte da string de formato são formatados usando `util.inspect()` se seu tipo não for `string`.

Se houver mais argumentos passados para o método `util.format()` do que o número de especificadores, os argumentos extras serão concatenados à string retornada, separados por espaços:

```js [ESM]
util.format('%s:%s', 'foo', 'bar', 'baz');
// Retorna: 'foo:bar baz'
```
Se o primeiro argumento não contiver um especificador de formato válido, `util.format()` retorna uma string que é a concatenação de todos os argumentos separados por espaços:

```js [ESM]
util.format(1, 2, 3);
// Retorna: '1 2 3'
```
Se apenas um argumento for passado para `util.format()`, ele será retornado como está, sem nenhuma formatação:

```js [ESM]
util.format('%% %s');
// Retorna: '%% %s'
```
`util.format()` é um método síncrono que se destina a ser uma ferramenta de depuração. Alguns valores de entrada podem ter uma sobrecarga de desempenho significativa que pode bloquear o loop de eventos. Use esta função com cuidado e nunca em um caminho de código crítico.


## `util.formatWithOptions(inspectOptions, format[, ...args])` {#utilformatwithoptionsinspectoptions-format-args}

**Adicionado em: v10.0.0**

- `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Esta função é idêntica a [`util.format()`](/pt/nodejs/api/util#utilformatformat-args), exceto que recebe um argumento `inspectOptions` que especifica opções que são passadas para [`util.inspect()`](/pt/nodejs/api/util#utilinspectobject-options).

```js [ESM]
util.formatWithOptions({ colors: true }, 'Ver objeto %O', { foo: 42 });
// Retorna 'Ver objeto { foo: 42 }', onde `42` é colorido como um número
// quando impresso em um terminal.
```
## `util.getCallSites(frameCountOrOptions, [options])` {#utilgetcallsitesframecountoroptions-options}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.3.0 | A API é renomeada de `util.getCallSite` para `util.getCallSites()`. |
| v22.9.0 | Adicionado em: v22.9.0 |
:::

- `frameCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número opcional de frames para capturar como objetos de call site. **Padrão:** `10`. O intervalo permitido é entre 1 e 200.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opcional
    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Reconstrói a localização original no rastreamento de pilha a partir do source-map. Ativado por padrão com a flag `--enable-source-maps`.
  
 
- Retorna: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um array de objetos de call site
    - `functionName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Retorna o nome da função associada a este call site.
    - `scriptName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Retorna o nome do recurso que contém o script para a função para este call site.
    - `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Retorna o número, baseado em 1, da linha para a chamada de função associada.
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Retorna o deslocamento da coluna baseado em 1 na linha para a chamada de função associada.
  
 

Retorna um array de objetos de call site contendo a pilha da função que chamou.

```js [ESM]
const util = require('node:util');

function exampleFunction() {
  const callSites = util.getCallSites();

  console.log('Call Sites:');
  callSites.forEach((callSite, index) => {
    console.log(`CallSite ${index + 1}:`);
    console.log(`Function Name: ${callSite.functionName}`);
    console.log(`Script Name: ${callSite.scriptName}`);
    console.log(`Line Number: ${callSite.lineNumber}`);
    console.log(`Column Number: ${callSite.column}`);
  });
  // CallSite 1:
  // Function Name: exampleFunction
  // Script Name: /home/example.js
  // Line Number: 5
  // Column Number: 26

  // CallSite 2:
  // Function Name: anotherFunction
  // Script Name: /home/example.js
  // Line Number: 22
  // Column Number: 3

  // ...
}

// Uma função para simular outra camada de pilha
function anotherFunction() {
  exampleFunction();
}

anotherFunction();
```
É possível reconstruir as localizações originais definindo a opção `sourceMap` como `true`. Se o source map não estiver disponível, a localização original será a mesma da localização atual. Quando a flag `--enable-source-maps` está habilitada, por exemplo, ao usar `--experimental-transform-types`, `sourceMap` será true por padrão.

```ts [TYPESCRIPT]
import util from 'node:util';

interface Foo {
  foo: string;
}

const callSites = util.getCallSites({ sourceMap: true });

// Com sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 7
// Column Number: 26

// Sem sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 2
// Column Number: 26
```

## `util.getSystemErrorName(err)` {#utilgetsystemerrornameerr}

**Adicionado em: v9.7.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna o nome em string para um código de erro numérico que vem de uma API do Node.js. O mapeamento entre códigos de erro e nomes de erro é dependente da plataforma. Consulte [Erros Comuns de Sistema](/pt/nodejs/api/errors#common-system-errors) para obter os nomes dos erros comuns.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorName(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMap()` {#utilgetsystemerrormap}

**Adicionado em: v16.0.0, v14.17.0**

- Retorna: [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Retorna um Map de todos os códigos de erro do sistema disponíveis na API do Node.js. O mapeamento entre códigos de erro e nomes de erro é dependente da plataforma. Consulte [Erros Comuns de Sistema](/pt/nodejs/api/errors#common-system-errors) para obter os nomes dos erros comuns.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const errorMap = util.getSystemErrorMap();
  const name = errorMap.get(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMessage(err)` {#utilgetsystemerrormessageerr}

**Adicionado em: v23.1.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna a mensagem string para um código de erro numérico que vem de uma API do Node.js. O mapeamento entre códigos de erro e mensagens string é dependente da plataforma.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorMessage(err.errno);
  console.error(name);  // No such file or directory
});
```
## `util.inherits(constructor, superConstructor)` {#utilinheritsconstructor-superconstructor}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v5.0.0 | O parâmetro `constructor` agora pode se referir a uma classe ES6. |
| v0.3.0 | Adicionado em: v0.3.0 |
:::

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: Use a sintaxe de classe ES2015 e a palavra-chave `extends` em vez disso.
:::

- `constructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `superConstructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

O uso de `util.inherits()` é desencorajado. Use as palavras-chave `class` e `extends` do ES6 para obter suporte à herança em nível de linguagem. Observe também que os dois estilos são [semanticamente incompatíveis](https://github.com/nodejs/node/issues/4179).

Herda os métodos prototype de um [construtor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor) em outro. O prototype de `constructor` será definido como um novo objeto criado a partir de `superConstructor`.

Isto adiciona principalmente alguma validação de entrada em cima de `Object.setPrototypeOf(constructor.prototype, superConstructor.prototype)`. Como uma conveniência adicional, `superConstructor` estará acessível através da propriedade `constructor.super_`.

```js [ESM]
const util = require('node:util');
const EventEmitter = require('node:events');

function MyStream() {
  EventEmitter.call(this);
}

util.inherits(MyStream, EventEmitter);

MyStream.prototype.write = function(data) {
  this.emit('data', data);
};

const stream = new MyStream();

console.log(stream instanceof EventEmitter); // true
console.log(MyStream.super_ === EventEmitter); // true

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('It works!'); // Received data: "It works!"
```
Exemplo ES6 usando `class` e `extends`:

```js [ESM]
const EventEmitter = require('node:events');

class MyStream extends EventEmitter {
  write(data) {
    this.emit('data', data);
  }
}

const stream = new MyStream();

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('With ES6');
```

## `util.inspect(object[, options])` {#utilinspectobject-options}

## `util.inspect(object[, showHidden[, depth[, colors]]])` {#utilinspectobject-showhidden-depth-colors}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.18.0 | Adiciona suporte para `maxArrayLength` ao inspecionar `Set` e `Map`. |
| v17.3.0, v16.14.0 | A opção `numericSeparator` agora é suportada. |
| v13.0.0 | Referências circulares agora incluem um marcador para a referência. |
| v14.6.0, v12.19.0 | Se `object` for de um `vm.Context` diferente agora, uma função de inspeção personalizada nele não receberá mais argumentos específicos do contexto. |
| v13.13.0, v12.17.0 | A opção `maxStringLength` agora é suportada. |
| v13.5.0, v12.16.0 | As propriedades do protótipo definidas pelo usuário são inspecionadas caso `showHidden` seja `true`. |
| v12.0.0 | O padrão das opções `compact` é alterado para `3` e o padrão das opções `breakLength` é alterado para `80`. |
| v12.0.0 | As propriedades internas não aparecem mais no argumento de contexto de uma função de inspeção personalizada. |
| v11.11.0 | A opção `compact` aceita números para um novo modo de saída. |
| v11.7.0 | ArrayBuffers agora também mostram seus conteúdos binários. |
| v11.5.0 | A opção `getters` agora é suportada. |
| v11.4.0 | O padrão de `depth` mudou de volta para `2`. |
| v11.0.0 | O padrão de `depth` mudou para `20`. |
| v11.0.0 | A saída de inspeção agora é limitada a cerca de 128 MiB. Dados acima desse tamanho não serão totalmente inspecionados. |
| v10.12.0 | A opção `sorted` agora é suportada. |
| v10.6.0 | Inspecionar listas vinculadas e objetos semelhantes agora é possível até o tamanho máximo da pilha de chamadas. |
| v10.0.0 | As entradas `WeakMap` e `WeakSet` agora também podem ser inspecionadas. |
| v9.9.0 | A opção `compact` agora é suportada. |
| v6.6.0 | Funções de inspeção personalizadas agora podem retornar `this`. |
| v6.3.0 | A opção `breakLength` agora é suportada. |
| v6.1.0 | A opção `maxArrayLength` agora é suportada; em particular, arrays longos são truncados por padrão. |
| v6.1.0 | A opção `showProxy` agora é suportada. |
| v0.3.0 | Adicionado em: v0.3.0 |
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualquer primitivo JavaScript ou `Object`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, os símbolos e propriedades não enumeráveis de `object` são incluídos no resultado formatado. As entradas [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) e [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) também são incluídas, assim como as propriedades do protótipo definidas pelo usuário (excluindo propriedades de método). **Padrão:** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o número de vezes a recursão ao formatar `object`. Isso é útil para inspecionar objetos grandes. Para recursão até o tamanho máximo da pilha de chamadas, passe `Infinity` ou `null`. **Padrão:** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, a saída é estilizada com códigos de cores ANSI. As cores são personalizáveis. Veja [Personalizando cores `util.inspect`](/pt/nodejs/api/util#customizing-utilinspect-colors). **Padrão:** `false`.
    - `customInspect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `false`, as funções `[util.inspect.custom](depth, opts, inspect)` não são invocadas. **Padrão:** `true`.
    - `showProxy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, a inspeção `Proxy` inclui os objetos [`target` e `handler`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Terminology). **Padrão:** `false`.
    - `maxArrayLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o número máximo de elementos `Array`, [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set), [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) e [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) a serem incluídos ao formatar. Defina como `null` ou `Infinity` para mostrar todos os elementos. Defina como `0` ou negativo para não mostrar nenhum elemento. **Padrão:** `100`.
    - `maxStringLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o número máximo de caracteres a serem incluídos ao formatar. Defina como `null` ou `Infinity` para mostrar todos os elementos. Defina como `0` ou negativo para não mostrar nenhum caractere. **Padrão:** `10000`.
    - `breakLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O comprimento no qual os valores de entrada são divididos em várias linhas. Defina como `Infinity` para formatar a entrada como uma única linha (em combinação com `compact` definido como `true` ou qualquer número \>= `1`). **Padrão:** `80`.
    - `compact` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Definir isso como `false` faz com que cada chave de objeto seja exibida em uma nova linha. Ele será interrompido em novas linhas em texto com mais de `breakLength`. Se definido como um número, os `n` elementos internos serão unidos em uma única linha, desde que todas as propriedades caibam em `breakLength`. Elementos de array curtos também são agrupados. Para obter mais informações, consulte o exemplo abaixo. **Padrão:** `3`.
    - `sorted` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se definido como `true` ou uma função, todas as propriedades de um objeto e as entradas `Set` e `Map` são classificadas na string resultante. Se definido como `true`, a [ordem de classificação padrão](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) é usada. Se definido como uma função, ela é usada como uma [função de comparação](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters).
    - `getters` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se definido como `true`, os getters são inspecionados. Se definido como `'get'`, apenas os getters sem um setter correspondente são inspecionados. Se definido como `'set'`, apenas os getters com um setter correspondente são inspecionados. Isso pode causar efeitos colaterais dependendo da função getter. **Padrão:** `false`.
    - `numericSeparator` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `true`, um sublinhado é usado para separar cada três dígitos em todos os bigints e números. **Padrão:** `false`.
  
 
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A representação de `object`.

O método `util.inspect()` retorna uma representação de string de `object` que se destina à depuração. A saída de `util.inspect` pode mudar a qualquer momento e não deve ser dependente programaticamente. `options` adicionais podem ser passadas que alteram o resultado. `util.inspect()` usará o nome do construtor e/ou `@@toStringTag` para criar uma tag identificável para um valor inspecionado.

```js [ESM]
class Foo {
  get [Symbol.toStringTag]() {
    return 'bar';
  }
}

class Bar {}

const baz = Object.create(null, { [Symbol.toStringTag]: { value: 'foo' } });

util.inspect(new Foo()); // 'Foo [bar] {}'
util.inspect(new Bar()); // 'Bar {}'
util.inspect(baz);       // '[foo] {}'
```
Referências circulares apontam para sua âncora usando um índice de referência:

```js [ESM]
const { inspect } = require('node:util');

const obj = {};
obj.a = [obj];
obj.b = {};
obj.b.inner = obj.b;
obj.b.obj = obj;

console.log(inspect(obj));
// <ref *1> {
//   a: [ [Circular *1] ],
//   b: <ref *2> { inner: [Circular *2], obj: [Circular *1] }
// }
```
O exemplo a seguir inspeciona todas as propriedades do objeto `util`:

```js [ESM]
const util = require('node:util');

console.log(util.inspect(util, { showHidden: true, depth: null }));
```
O exemplo a seguir destaca o efeito da opção `compact`:

```js [ESM]
const util = require('node:util');

const o = {
  a: [1, 2, [[
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit, sed do ' +
      'eiusmod \ntempor incididunt ut labore et dolore magna aliqua.',
    'test',
    'foo']], 4],
  b: new Map([['za', 1], ['zb', 'test']]),
};
console.log(util.inspect(o, { compact: true, depth: 5, breakLength: 80 }));

// { a:
//   [ 1,
//     2,
//     [ [ 'Lorem ipsum dolor sit amet,\nconsectetur [...]', // A long line
//           'test',
//           'foo' ] ],
//     4 ],
//   b: Map(2) { 'za' => 1, 'zb' => 'test' } }

// Setting `compact` to false or an integer creates more reader friendly output.
console.log(util.inspect(o, { compact: false, depth: 5, breakLength: 80 }));

// {
//   a: [
//     1,
//     2,
//     [
//       [
//         'Lorem ipsum dolor sit amet,\n' +
//           'consectetur adipiscing elit, sed do eiusmod \n' +
//           'tempor incididunt ut labore et dolore magna aliqua.',
//         'test',
//         'foo'
//       ]
//     ],
//     4
//   ],
//   b: Map(2) {
//     'za' => 1,
//     'zb' => 'test'
//   }
// }

// Setting `breakLength` to e.g. 150 will print the "Lorem ipsum" text in a
// single line.
```
A opção `showHidden` permite que as entradas [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) e [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) sejam inspecionadas. Se houver mais entradas do que `maxArrayLength`, não há garantia de quais entradas serão exibidas. Isso significa que recuperar as mesmas entradas [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) duas vezes pode resultar em uma saída diferente. Além disso, entradas sem referências fortes restantes podem ser coletadas como lixo a qualquer momento.

```js [ESM]
const { inspect } = require('node:util');

const obj = { a: 1 };
const obj2 = { b: 2 };
const weakSet = new WeakSet([obj, obj2]);

console.log(inspect(weakSet, { showHidden: true }));
// WeakSet { { a: 1 }, { b: 2 } }
```
A opção `sorted` garante que a ordem de inserção da propriedade de um objeto não impacte o resultado de `util.inspect()`.

```js [ESM]
const { inspect } = require('node:util');
const assert = require('node:assert');

const o1 = {
  b: [2, 3, 1],
  a: '`a` comes before `b`',
  c: new Set([2, 3, 1]),
};
console.log(inspect(o1, { sorted: true }));
// { a: '`a` comes before `b`', b: [ 2, 3, 1 ], c: Set(3) { 1, 2, 3 } }
console.log(inspect(o1, { sorted: (a, b) => b.localeCompare(a) }));
// { c: Set(3) { 3, 2, 1 }, b: [ 2, 3, 1 ], a: '`a` comes before `b`' }

const o2 = {
  c: new Set([2, 1, 3]),
  a: '`a` comes before `b`',
  b: [2, 3, 1],
};
assert.strict.equal(
  inspect(o1, { sorted: true }),
  inspect(o2, { sorted: true }),
);
```
A opção `numericSeparator` adiciona um sublinhado a cada três dígitos a todos os números.

```js [ESM]
const { inspect } = require('node:util');

const thousand = 1_000;
const million = 1_000_000;
const bigNumber = 123_456_789n;
const bigDecimal = 1_234.123_45;

console.log(inspect(thousand, { numericSeparator: true }));
// 1_000
console.log(inspect(million, { numericSeparator: true }));
// 1_000_000
console.log(inspect(bigNumber, { numericSeparator: true }));
// 123_456_789n
console.log(inspect(bigDecimal, { numericSeparator: true }));
// 1_234.123_45
```
`util.inspect()` é um método síncrono destinado à depuração. Seu comprimento máximo de saída é de aproximadamente 128 MiB. As entradas que resultam em uma saída mais longa serão truncadas.


### Personalizando as cores de `util.inspect` {#customizing-utilinspect-colors}

A saída de cores (se habilitada) de `util.inspect` é personalizável globalmente através das propriedades `util.inspect.styles` e `util.inspect.colors`.

`util.inspect.styles` é um mapa que associa um nome de estilo a uma cor de `util.inspect.colors`.

Os estilos padrão e as cores associadas são:

- `bigint`: `yellow`
- `boolean`: `yellow`
- `date`: `magenta`
- `module`: `underline`
- `name`: (sem estilo)
- `null`: `bold`
- `number`: `yellow`
- `regexp`: `red`
- `special`: `cyan` (e.g., `Proxies`)
- `string`: `green`
- `symbol`: `green`
- `undefined`: `grey`

O estilo de cor usa códigos de controle ANSI que podem não ser suportados em todos os terminais. Para verificar o suporte a cores, use [`tty.hasColors()`](/pt/nodejs/api/tty#writestreamhascolorscount-env).

Os códigos de controle predefinidos estão listados abaixo (agrupados como "Modificadores", "Cores de primeiro plano" e "Cores de fundo").

#### Modificadores {#modifiers}

O suporte a modificadores varia em diferentes terminais. Eles serão ignorados na maioria das vezes, se não forem suportados.

- `reset` - Redefine todos os modificadores (de cor) para os seus padrões
- **bold** - Deixa o texto em negrito
- *italic* - Deixa o texto em itálico
- underline - Deixa o texto sublinhado
- ~~strikethrough~~ - Coloca uma linha horizontal no centro do texto (Alias: `strikeThrough`, `crossedout`, `crossedOut`)
- `hidden` - Imprime o texto, mas o torna invisível (Alias: conceal)
- dim - Intensidade de cor diminuída (Alias: `faint`)
- overlined - Deixa o texto sobrelinhado
- blink - Oculta e mostra o texto em um intervalo
- inverse - Troca as cores de primeiro plano e fundo (Alias: `swapcolors`, `swapColors`)
- doubleunderline - Deixa o texto duplamente sublinhado (Alias: `doubleUnderline`)
- framed - Desenha uma moldura ao redor do texto

#### Cores de primeiro plano {#foreground-colors}

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
- `gray` (alias: `grey`, `blackBright`)
- `redBright`
- `greenBright`
- `yellowBright`
- `blueBright`
- `magentaBright`
- `cyanBright`
- `whiteBright`

#### Cores de fundo {#background-colors}

- `bgBlack`
- `bgRed`
- `bgGreen`
- `bgYellow`
- `bgBlue`
- `bgMagenta`
- `bgCyan`
- `bgWhite`
- `bgGray` (alias: `bgGrey`, `bgBlackBright`)
- `bgRedBright`
- `bgGreenBright`
- `bgYellowBright`
- `bgBlueBright`
- `bgMagentaBright`
- `bgCyanBright`
- `bgWhiteBright`


### Funções de inspeção personalizadas em objetos {#custom-inspection-functions-on-objects}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v17.3.0, v16.14.0 | O argumento inspect é adicionado para mais interoperabilidade. |
| v0.1.97 | Adicionado em: v0.1.97 |
:::

Os objetos também podem definir sua própria função [`[util.inspect.custom](depth, opts, inspect)`](/pt/nodejs/api/util#utilinspectcustom), que `util.inspect()` invocará e usará o resultado ao inspecionar o objeto.

```js [ESM]
const util = require('node:util');

class Box {
  constructor(value) {
    this.value = value;
  }

  [util.inspect.custom](depth, options, inspect) {
    if (depth < 0) {
      return options.stylize('[Box]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1,
    });

    // Preenchimento de cinco espaços porque esse é o tamanho de "Box< ".
    const padding = ' '.repeat(5);
    const inner = inspect(this.value, newOptions)
                  .replace(/\n/g, `\n${padding}`);
    return `${options.stylize('Box', 'special')}< ${inner} >`;
  }
}

const box = new Box(true);

util.inspect(box);
// Retorna: "Box< true >"
```
As funções `[util.inspect.custom](depth, opts, inspect)` personalizadas normalmente retornam uma string, mas podem retornar um valor de qualquer tipo que será formatado adequadamente por `util.inspect()`.

```js [ESM]
const util = require('node:util');

const obj = { foo: 'this will not show up in the inspect() output' };
obj[util.inspect.custom] = (depth) => {
  return { bar: 'baz' };
};

util.inspect(obj);
// Retorna: "{ bar: 'baz' }"
```
### `util.inspect.custom` {#utilinspectcustom}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.12.0 | Agora isso é definido como um símbolo compartilhado. |
| v6.6.0 | Adicionado em: v6.6.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) que pode ser usado para declarar funções de inspeção personalizadas.

Além de ser acessível por meio de `util.inspect.custom`, este símbolo é [registrado globalmente](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) e pode ser acessado em qualquer ambiente como `Symbol.for('nodejs.util.inspect.custom')`.

O uso disso permite que o código seja escrito de forma portátil, de forma que a função de inspeção personalizada seja usada em um ambiente Node.js e ignorada no navegador. A função `util.inspect()` em si é passada como terceiro argumento para a função de inspeção personalizada para permitir maior portabilidade.

```js [ESM]
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

class Password {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return 'xxxxxxxx';
  }

  [customInspectSymbol](depth, inspectOptions, inspect) {
    return `Password <${this.toString()}>`;
  }
}

const password = new Password('r0sebud');
console.log(password);
// Imprime Password <xxxxxxxx>
```
Veja [Funções de inspeção personalizadas em objetos](/pt/nodejs/api/util#custom-inspection-functions-on-objects) para mais detalhes.


### `util.inspect.defaultOptions` {#utilinspectdefaultoptions}

**Adicionado em: v6.4.0**

O valor `defaultOptions` permite a personalização das opções padrão usadas por `util.inspect`. Isso é útil para funções como `console.log` ou `util.format` que chamam implicitamente `util.inspect`. Deve ser definido como um objeto contendo uma ou mais opções válidas de [`util.inspect()`](/pt/nodejs/api/util#utilinspectobject-options). A configuração direta das propriedades das opções também é suportada.

```js [ESM]
const util = require('node:util');
const arr = Array(101).fill(0);

console.log(arr); // Registra o array truncado
util.inspect.defaultOptions.maxArrayLength = null;
console.log(arr); // registra o array completo
```
## `util.isDeepStrictEqual(val1, val2)` {#utilisdeepstrictequalval1-val2}

**Adicionado em: v9.0.0**

- `val1` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `val2` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se houver igualdade estrita profunda entre `val1` e `val2`. Caso contrário, retorna `false`.

Consulte [`assert.deepStrictEqual()`](/pt/nodejs/api/assert#assertdeepstrictequalactual-expected-message) para obter mais informações sobre igualdade estrita profunda.

## Classe: `util.MIMEType` {#class-utilmimetype}

**Adicionado em: v19.1.0, v18.13.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Uma implementação da [classe MIMEType](https://bmeck.github.io/node-proposal-mime-api/).

De acordo com as convenções do navegador, todas as propriedades dos objetos `MIMEType` são implementadas como getters e setters no protótipo da classe, em vez de como propriedades de dados no próprio objeto.

Uma string MIME é uma string estruturada contendo vários componentes significativos. Quando analisado, um objeto `MIMEType` é retornado contendo propriedades para cada um desses componentes.

### Constructor: `new MIMEType(input)` {#constructor-new-mimetypeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O MIME de entrada para analisar

Cria um novo objeto `MIMEType` analisando o `input`.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/plain');
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/plain');
```
:::

Um `TypeError` será lançado se o `input` não for um MIME válido. Observe que um esforço será feito para forçar os valores fornecidos em strings. Por exemplo:



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```

```js [CJS]
const { MIMEType } = require('node:util');
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```
:::


### `mime.type` {#mimetype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtém e define a parte do tipo do MIME.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```
:::

### `mime.subtype` {#mimesubtype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtém e define a parte do subtipo do MIME.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```
:::

### `mime.essence` {#mimeessence}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtém a essência do MIME. Esta propriedade é somente leitura. Use `mime.type` ou `mime.subtype` para alterar o MIME.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```
:::


### `mime.params` {#mimeparams}

- [\<MIMEParams\>](/pt/nodejs/api/util#class-utilmimeparams)

Obtém o objeto [`MIMEParams`](/pt/nodejs/api/util#class-utilmimeparams) representando os parâmetros do MIME. Essa propriedade é somente leitura. Consulte a documentação [`MIMEParams`](/pt/nodejs/api/util#class-utilmimeparams) para obter detalhes.

### `mime.toString()` {#mimetostring}

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `toString()` no objeto `MIMEType` retorna o MIME serializado.

Devido à necessidade de conformidade com os padrões, este método não permite que os usuários personalizem o processo de serialização do MIME.

### `mime.toJSON()` {#mimetojson}

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Alias para [`mime.toString()`](/pt/nodejs/api/util#mimetostring).

Este método é chamado automaticamente quando um objeto `MIMEType` é serializado com [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```
:::

## Classe: `util.MIMEParams` {#class-utilmimeparams}

**Adicionado em: v19.1.0, v18.13.0**

A API `MIMEParams` fornece acesso de leitura e gravação aos parâmetros de um `MIMEType`.

### Construtor: `new MIMEParams()` {#constructor-new-mimeparams}

Cria um novo objeto `MIMEParams` com parâmetros vazios



::: code-group
```js [ESM]
import { MIMEParams } from 'node:util';

const myParams = new MIMEParams();
```

```js [CJS]
const { MIMEParams } = require('node:util');

const myParams = new MIMEParams();
```
:::

### `mimeParams.delete(name)` {#mimeparamsdeletename}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Remove todos os pares nome-valor cujo nome seja `name`.


### `mimeParams.entries()` {#mimeparamsentries}

- Retorna: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Retorna um iterador sobre cada um dos pares nome-valor nos parâmetros. Cada item do iterador é um `Array` JavaScript. O primeiro item do array é o `name`, o segundo item do array é o `value`.

### `mimeParams.get(name)` {#mimeparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Uma string ou `null` se não houver nenhum par nome-valor com o `name` fornecido.

Retorna o valor do primeiro par nome-valor cujo nome é `name`. Se não houver tais pares, `null` é retornado.

### `mimeParams.has(name)` {#mimeparamshasname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se houver pelo menos um par nome-valor cujo nome é `name`.

### `mimeParams.keys()` {#mimeparamskeys}

- Retorna: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Retorna um iterador sobre os nomes de cada par nome-valor.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```
:::

### `mimeParams.set(name, value)` {#mimeparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Define o valor no objeto `MIMEParams` associado a `name` para `value`. Se houver algum par nome-valor pré-existente cujos nomes sejam `name`, defina o valor do primeiro par para `value`.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```
:::


### `mimeParams.values()` {#mimeparamsvalues}

- Retorna: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Retorna um iterador sobre os valores de cada par nome-valor.

### `mimeParams[@@iterator]()` {#mimeparams@@iterator}

- Retorna: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Alias para [`mimeParams.entries()`](/pt/nodejs/api/util#mimeparamsentries).

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```
:::

## `util.parseArgs([config])` {#utilparseargsconfig}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.4.0, v20.16.0 | Adiciona suporte para permitir opções negativas na `config` de entrada. |
| v20.0.0 | A API não é mais experimental. |
| v18.11.0, v16.19.0 | Adiciona suporte para valores padrão na `config` de entrada. |
| v18.7.0, v16.17.0 | Adiciona suporte para retornar informações de análise detalhadas usando `tokens` na `config` de entrada e nas propriedades retornadas. |
| v18.3.0, v16.17.0 | Adicionado em: v18.3.0, v16.17.0 |
:::

- `config` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Usado para fornecer argumentos para análise e para configurar o analisador. `config` suporta as seguintes propriedades:
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) array de strings de argumentos. **Padrão:** `process.argv` com `execPath` e `filename` removidos.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Usado para descrever argumentos conhecidos pelo analisador. As chaves de `options` são os nomes longos das opções e os valores são um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) aceitando as seguintes propriedades:
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Tipo de argumento, que deve ser `boolean` ou `string`.
    - `multiple` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se esta opção pode ser fornecida várias vezes. Se `true`, todos os valores serão coletados em um array. Se `false`, os valores para a opção são o último a vencer. **Padrão:** `false`.
    - `short` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um alias de um único caractere para a opção.
    - `default` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) O valor padrão da opção quando não é definido por args. Deve ser do mesmo tipo que a propriedade `type`. Quando `multiple` é `true`, deve ser um array.
  
    - `strict` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se um erro deve ser lançado quando argumentos desconhecidos são encontrados, ou quando argumentos são passados que não correspondem ao `type` configurado em `options`. **Padrão:** `true`.
    - `allowPositionals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se este comando aceita argumentos posicionais. **Padrão:** `false` se `strict` é `true`, caso contrário `true`.
    - `allowNegative` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, permite definir explicitamente opções booleanas para `false` prefixando o nome da opção com `--no-`. **Padrão:** `false`.
    - `tokens` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Retorna os tokens analisados. Isso é útil para estender o comportamento integrado, desde adicionar verificações adicionais até reprocessar os tokens de maneiras diferentes. **Padrão:** `false`.
  
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Os argumentos de linha de comando analisados:
    - `values` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um mapeamento de nomes de opções analisados com seus valores [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ou [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).
    - `positionals` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Argumentos posicionais.
    - `tokens` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Veja a seção [parseArgs tokens](/pt/nodejs/api/util#parseargs-tokens). Retornado apenas se `config` inclui `tokens: true`.

Fornece uma API de nível superior para análise de argumentos de linha de comando do que interagir diretamente com `process.argv`. Recebe uma especificação para os argumentos esperados e retorna um objeto estruturado com as opções e posicionais analisados.

::: code-group
```js [ESM]
import { parseArgs } from 'node:util';
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```

```js [CJS]
const { parseArgs } = require('node:util');
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```
:::


### `parseArgs` `tokens` {#parseargs-tokens}

Informações de análise detalhadas estão disponíveis para adicionar comportamentos personalizados especificando `tokens: true` na configuração. Os tokens retornados têm propriedades que descrevem:

- todos os tokens
    - `kind` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um de 'option', 'positional' ou 'option-terminator'.
    - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Índice do elemento em `args` contendo o token. Portanto, o argumento de origem para um token é `args[token.index]`.


- tokens de opção
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome longo da opção.
    - `rawName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Como a opção é usada em args, como `-f` ou `--foo`.
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Valor da opção especificado em args. Indefinido para opções booleanas.
    - `inlineValue` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Se o valor da opção é especificado inline, como `--foo=bar`.


- tokens posicionais
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O valor do argumento posicional em args (ou seja, `args[index]`).


- token de option-terminator

Os tokens retornados estão na ordem em que são encontrados nos args de entrada. As opções que aparecem mais de uma vez em args produzem um token para cada uso. Grupos de opções curtas como `-xy` expandem para um token para cada opção. Portanto, `-xxx` produz três tokens.

Por exemplo, para adicionar suporte para uma opção negada como `--no-color` (que `allowNegative` suporta quando a opção é do tipo `boolean`), os tokens retornados podem ser reprocessados para alterar o valor armazenado para a opção negada.

::: code-group
```js [ESM]
import { parseArgs } from 'node:util';

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Reprocessa os tokens de opção e sobrescreve os valores retornados.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Armazena foo:false para --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Salva novamente o valor para que o último vença se ambos --foo e --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```

```js [CJS]
const { parseArgs } = require('node:util');

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Reprocessa os tokens de opção e sobrescreve os valores retornados.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Armazena foo:false para --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Salva novamente o valor para que o último vença se ambos --foo e --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```
:::

Exemplo de uso mostrando opções negadas, e quando uma opção é usada de várias maneiras, a última vence.

```bash [BASH]
$ node negate.js
{ logfile: 'default.log', color: undefined }
$ node negate.js --no-logfile --no-color
{ logfile: false, color: false }
$ node negate.js --logfile=test.log --color
{ logfile: 'test.log', color: true }
$ node negate.js --no-logfile --logfile=test.log --color --no-color
{ logfile: 'test.log', color: false }
```

## `util.parseEnv(content)` {#utilparseenvcontent}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

**Adicionado em: v21.7.0, v20.12.0**

- `content` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O conteúdo bruto de um arquivo `.env`.

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Dado um exemplo de arquivo `.env`:



::: code-group
```js [CJS]
const { parseEnv } = require('node:util');

parseEnv('HELLO=world\nHELLO=oh my\n');
// Retorna: { HELLO: 'oh my' }
```

```js [ESM]
import { parseEnv } from 'node:util';

parseEnv('HELLO=world\nHELLO=oh my\n');
// Retorna: { HELLO: 'oh my' }
```
:::

## `util.promisify(original)` {#utilpromisifyoriginal}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.8.0 | Chamar `promisify` em uma função que retorna uma `Promise` está obsoleto. |
| v8.0.0 | Adicionado em: v8.0.0 |
:::

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Pega uma função seguindo o estilo de callback comum de erro-primeiro, ou seja, recebendo um callback `(err, value) => ...` como o último argumento, e retorna uma versão que retorna promises.

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // Faça algo com `stats`
}).catch((error) => {
  // Lide com o erro.
});
```
Ou, equivalentemente usando `async function`s:

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);

async function callStat() {
  const stats = await stat('.');
  console.log(`Este diretório é de propriedade de ${stats.uid}`);
}

callStat();
```
Se houver uma propriedade `original[util.promisify.custom]` presente, `promisify` retornará seu valor, veja [Funções customizadas promisificadas](/pt/nodejs/api/util#custom-promisified-functions).

`promisify()` assume que `original` é uma função que recebe um callback como seu argumento final em todos os casos. Se `original` não for uma função, `promisify()` lançará um erro. Se `original` for uma função, mas seu último argumento não for um callback de erro-primeiro, ele ainda receberá um callback de erro-primeiro como seu último argumento.

Usar `promisify()` em métodos de classe ou outros métodos que usam `this` pode não funcionar como esperado, a menos que seja tratado especialmente:

```js [ESM]
const util = require('node:util');

class Foo {
  constructor() {
    this.a = 42;
  }

  bar(callback) {
    callback(null, this.a);
  }
}

const foo = new Foo();

const naiveBar = util.promisify(foo.bar);
// TypeError: Cannot read property 'a' of undefined
// naiveBar().then(a => console.log(a));

naiveBar.call(foo).then((a) => console.log(a)); // '42'

const bindBar = naiveBar.bind(foo);
bindBar().then((a) => console.log(a)); // '42'
```

### Funções Promisificadas Personalizadas {#custom-promisified-functions}

Usando o símbolo `util.promisify.custom`, pode-se substituir o valor de retorno de [`util.promisify()`](/pt/nodejs/api/util#utilpromisifyoriginal):

```js [ESM]
const util = require('node:util');

function doSomething(foo, callback) {
  // ...
}

doSomething[util.promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

const promisified = util.promisify(doSomething);
console.log(promisified === doSomething[util.promisify.custom]);
// prints 'true'
```
Isso pode ser útil para casos em que a função original não segue o formato padrão de receber um callback com o erro como primeiro argumento e os dados como segundo.

Por exemplo, com uma função que recebe `(foo, onSuccessCallback, onErrorCallback)`:

```js [ESM]
doSomething[util.promisify.custom] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```
Se `promisify.custom` for definido, mas não for uma função, `promisify()` lançará um erro.

### `util.promisify.custom` {#utilpromisifycustom}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.12.0, v12.16.2 | Agora isso é definido como um símbolo compartilhado. |
| v8.0.0 | Adicionado em: v8.0.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) que pode ser usado para declarar variantes promisificadas personalizadas de funções, veja [Funções Promisificadas Personalizadas](/pt/nodejs/api/util#custom-promisified-functions).

Além de ser acessível através de `util.promisify.custom`, este símbolo é [registrado globalmente](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) e pode ser acessado em qualquer ambiente como `Symbol.for('nodejs.util.promisify.custom')`.

Por exemplo, com uma função que recebe `(foo, onSuccessCallback, onErrorCallback)`:

```js [ESM]
const kCustomPromisifiedSymbol = Symbol.for('nodejs.util.promisify.custom');

doSomething[kCustomPromisifiedSymbol] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```

## `util.stripVTControlCharacters(str)` {#utilstripvtcontrolcharactersstr}

**Adicionado em: v16.11.0**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna `str` com todos os códigos de escape ANSI removidos.

```js [ESM]
console.log(util.stripVTControlCharacters('\u001B[4mvalue\u001B[0m'));
// Imprime "value"
```
## `util.styleText(format, text[, options])` {#utilstyletextformat-text-options}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável.
:::


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.5.0 | styleText agora é estável. |
| v22.8.0, v20.18.0 | Respeita isTTY e variáveis de ambiente como NO_COLORS, NODE_DISABLE_COLORS e FORCE_COLOR. |
| v21.7.0, v20.12.0 | Adicionado em: v21.7.0, v20.12.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um formato de texto ou um Array de formatos de texto definidos em `util.inspect.colors`.
- `text` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O texto a ser formatado.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `validateStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando verdadeiro, `stream` é verificado para ver se ele pode lidar com cores. **Padrão:** `true`.
    - `stream` [\<Stream\>](/pt/nodejs/api/stream#stream) Um stream que será validado se puder ser colorido. **Padrão:** `process.stdout`.
  
 

Esta função retorna um texto formatado considerando o `format` passado para impressão em um terminal. Ela está ciente das capacidades do terminal e age de acordo com a configuração definida por meio das variáveis de ambiente `NO_COLORS`, `NODE_DISABLE_COLORS` e `FORCE_COLOR`.



::: code-group
```js [ESM]
import { styleText } from 'node:util';
import { stderr } from 'node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Valida se process.stderr tem TTY
  { stream: stderr },
);
console.error(successMessage);
```

```js [CJS]
const { styleText } = require('node:util');
const { stderr } = require('node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Valida se process.stderr tem TTY
  { stream: stderr },
);
console.error(successMessage);
```
:::

`util.inspect.colors` também fornece formatos de texto como `italic` e `underline` e você pode combinar ambos:

```js [CJS]
console.log(
  util.styleText(['underline', 'italic'], 'My italic underlined message'),
);
```
Ao passar um array de formatos, a ordem do formato aplicado é da esquerda para a direita, então o seguinte estilo pode sobrescrever o anterior.

```js [CJS]
console.log(
  util.styleText(['red', 'green'], 'text'), // green
);
```
A lista completa de formatos pode ser encontrada em [modificadores](/pt/nodejs/api/util#modifiers).


## Classe: `util.TextDecoder` {#class-utiltextdecoder}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v11.0.0 | A classe agora está disponível no objeto global. |
| v8.3.0 | Adicionado em: v8.3.0 |
:::

Uma implementação da API `TextDecoder` do [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/).

```js [ESM]
const decoder = new TextDecoder();
const u8arr = new Uint8Array([72, 101, 108, 108, 111]);
console.log(decoder.decode(u8arr)); // Hello
```
### Codificações suportadas pelo WHATWG {#whatwg-supported-encodings}

De acordo com o [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/), as codificações suportadas pela API `TextDecoder` estão descritas nas tabelas abaixo. Para cada codificação, um ou mais aliases podem ser usados.

Diferentes configurações de compilação do Node.js suportam diferentes conjuntos de codificações. (veja [Internacionalização](/pt/nodejs/api/intl))

#### Codificações suportadas por padrão (com dados ICU completos) {#encodings-supported-by-default-with-full-icu-data}

| Codificação | Aliases |
| --- | --- |
| `'ibm866'` | `'866'`  ,   `'cp866'`  ,   `'csibm866'` |
| `'iso-8859-2'` | `'csisolatin2'`  ,   `'iso-ir-101'`  ,   `'iso8859-2'`  ,   `'iso88592'`  ,   `'iso_8859-2'`  ,   `'iso_8859-2:1987'`  ,   `'l2'`  ,   `'latin2'` |
| `'iso-8859-3'` | `'csisolatin3'`  ,   `'iso-ir-109'`  ,   `'iso8859-3'`  ,   `'iso88593'`  ,   `'iso_8859-3'`  ,   `'iso_8859-3:1988'`  ,   `'l3'`  ,   `'latin3'` |
| `'iso-8859-4'` | `'csisolatin4'`  ,   `'iso-ir-110'`  ,   `'iso8859-4'`  ,   `'iso88594'`  ,   `'iso_8859-4'`  ,   `'iso_8859-4:1988'`  ,   `'l4'`  ,   `'latin4'` |
| `'iso-8859-5'` | `'csisolatincyrillic'`  ,   `'cyrillic'`  ,   `'iso-ir-144'`  ,   `'iso8859-5'`  ,   `'iso88595'`  ,   `'iso_8859-5'`  ,   `'iso_8859-5:1988'` |
| `'iso-8859-6'` | `'arabic'`  ,   `'asmo-708'`  ,   `'csiso88596e'`  ,   `'csiso88596i'`  ,   `'csisolatinarabic'`  ,   `'ecma-114'`  ,   `'iso-8859-6-e'`  ,   `'iso-8859-6-i'`  ,   `'iso-ir-127'`  ,   `'iso8859-6'`  ,   `'iso88596'`  ,   `'iso_8859-6'`  ,   `'iso_8859-6:1987'` |
| `'iso-8859-7'` | `'csisolatingreek'`  ,   `'ecma-118'`  ,   `'elot_928'`  ,   `'greek'`  ,   `'greek8'`  ,   `'iso-ir-126'`  ,   `'iso8859-7'`  ,   `'iso88597'`  ,   `'iso_8859-7'`  ,   `'iso_8859-7:1987'`  ,   `'sun_eu_greek'` |
| `'iso-8859-8'` | `'csiso88598e'`  ,   `'csisolatinhebrew'`  ,   `'hebrew'`  ,   `'iso-8859-8-e'`  ,   `'iso-ir-138'`  ,   `'iso8859-8'`  ,   `'iso88598'`  ,   `'iso_8859-8'`  ,   `'iso_8859-8:1988'`  ,   `'visual'` |
| `'iso-8859-8-i'` | `'csiso88598i'`  ,   `'logical'` |
| `'iso-8859-10'` | `'csisolatin6'`  ,   `'iso-ir-157'`  ,   `'iso8859-10'`  ,   `'iso885910'`  ,   `'l6'`  ,   `'latin6'` |
| `'iso-8859-13'` | `'iso8859-13'`  ,   `'iso885913'` |
| `'iso-8859-14'` | `'iso8859-14'`  ,   `'iso885914'` |
| `'iso-8859-15'` | `'csisolatin9'`  ,   `'iso8859-15'`  ,   `'iso885915'`  ,   `'iso_8859-15'`  ,   `'l9'` |
| `'koi8-r'` | `'cskoi8r'`  ,   `'koi'`  ,   `'koi8'`  ,   `'koi8_r'` |
| `'koi8-u'` | `'koi8-ru'` |
| `'macintosh'` | `'csmacintosh'`  ,   `'mac'`  ,   `'x-mac-roman'` |
| `'windows-874'` | `'dos-874'`  ,   `'iso-8859-11'`  ,   `'iso8859-11'`  ,   `'iso885911'`  ,   `'tis-620'` |
| `'windows-1250'` | `'cp1250'`  ,   `'x-cp1250'` |
| `'windows-1251'` | `'cp1251'`  ,   `'x-cp1251'` |
| `'windows-1252'` | `'ansi_x3.4-1968'`  ,   `'ascii'`  ,   `'cp1252'`  ,   `'cp819'`  ,   `'csisolatin1'`  ,   `'ibm819'`  ,   `'iso-8859-1'`  ,   `'iso-ir-100'`  ,   `'iso8859-1'`  ,   `'iso88591'`  ,   `'iso_8859-1'`  ,   `'iso_8859-1:1987'`  ,   `'l1'`  ,   `'latin1'`  ,   `'us-ascii'`  ,   `'x-cp1252'` |
| `'windows-1253'` | `'cp1253'`  ,   `'x-cp1253'` |
| `'windows-1254'` | `'cp1254'`  ,   `'csisolatin5'`  ,   `'iso-8859-9'`  ,   `'iso-ir-148'`  ,   `'iso8859-9'`  ,   `'iso88599'`  ,   `'iso_8859-9'`  ,   `'iso_8859-9:1989'`  ,   `'l5'`  ,   `'latin5'`  ,   `'x-cp1254'` |
| `'windows-1255'` | `'cp1255'`  ,   `'x-cp1255'` |
| `'windows-1256'` | `'cp1256'`  ,   `'x-cp1256'` |
| `'windows-1257'` | `'cp1257'`  ,   `'x-cp1257'` |
| `'windows-1258'` | `'cp1258'`  ,   `'x-cp1258'` |
| `'x-mac-cyrillic'` | `'x-mac-ukrainian'` |
| `'gbk'` | `'chinese'`  ,   `'csgb2312'`  ,   `'csiso58gb231280'`  ,   `'gb2312'`  ,   `'gb_2312'`  ,   `'gb_2312-80'`  ,   `'iso-ir-58'`  ,   `'x-gbk'` |
| `'gb18030'` ||
| `'big5'` | `'big5-hkscs'`  ,   `'cn-big5'`  ,   `'csbig5'`  ,   `'x-x-big5'` |
| `'euc-jp'` | `'cseucpkdfmtjapanese'`  ,   `'x-euc-jp'` |
| `'iso-2022-jp'` | `'csiso2022jp'` |
| `'shift_jis'` | `'csshiftjis'`  ,   `'ms932'`  ,   `'ms_kanji'`  ,   `'shift-jis'`  ,   `'sjis'`  ,   `'windows-31j'`  ,   `'x-sjis'` |
| `'euc-kr'` | `'cseuckr'`  ,   `'csksc56011987'`  ,   `'iso-ir-149'`  ,   `'korean'`  ,   `'ks_c_5601-1987'`  ,   `'ks_c_5601-1989'`  ,   `'ksc5601'`  ,   `'ksc_5601'`  ,   `'windows-949'` |


#### Codificações suportadas quando o Node.js é construído com a opção `small-icu` {#encodings-supported-when-nodejs-is-built-with-the-small-icu-option}

| Codificação | Aliases |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
| `'utf-16be'` ||
#### Codificações suportadas quando o ICU está desativado {#encodings-supported-when-icu-is-disabled}

| Codificação | Aliases |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
A codificação `'iso-8859-16'` listada no [Padrão de Codificação WHATWG](https://encoding.spec.whatwg.org/) não é suportada.

### `new TextDecoder([encoding[, options]])` {#new-textdecoderencoding-options}

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identifica a `encoding` que esta instância de `TextDecoder` suporta. **Padrão:** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se falhas de decodificação são fatais. Esta opção não é suportada quando o ICU está desativado (veja [Internacionalização](/pt/nodejs/api/intl)). **Padrão:** `false`.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, o `TextDecoder` incluirá a marca de ordem de byte no resultado decodificado. Quando `false`, a marca de ordem de byte será removida da saída. Esta opção é usada apenas quando `encoding` é `'utf-8'`, `'utf-16be'` ou `'utf-16le'`. **Padrão:** `false`.
  
 

Cria uma nova instância de `TextDecoder`. O `encoding` pode especificar uma das codificações suportadas ou um alias.

A classe `TextDecoder` também está disponível no objeto global.

### `textDecoder.decode([input[, options]])` {#textdecoderdecodeinput-options}

- `input` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Uma instância de `ArrayBuffer`, `DataView` ou `TypedArray` contendo os dados codificados.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `stream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se blocos adicionais de dados são esperados. **Padrão:** `false`.
  
 
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Decodifica o `input` e retorna uma string. Se `options.stream` for `true`, quaisquer sequências de bytes incompletas que ocorram no final do `input` são armazenadas em buffer internamente e emitidas após a próxima chamada para `textDecoder.decode()`.

Se `textDecoder.fatal` for `true`, erros de decodificação que ocorram resultarão no lançamento de um `TypeError`.


### `textDecoder.encoding` {#textdecoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A codificação suportada pela instância de `TextDecoder`.

### `textDecoder.fatal` {#textdecoderfatal}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

O valor será `true` se os erros de decodificação resultarem no lançamento de um `TypeError`.

### `textDecoder.ignoreBOM` {#textdecoderignorebom}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

O valor será `true` se o resultado da decodificação incluir a marca de ordem de byte.

## Class: `util.TextEncoder` {#class-utiltextencoder}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v11.0.0 | A classe agora está disponível no objeto global. |
| v8.3.0 | Adicionado em: v8.3.0 |
:::

Uma implementação da [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) API `TextEncoder`. Todas as instâncias de `TextEncoder` suportam apenas codificação UTF-8.

```js [ESM]
const encoder = new TextEncoder();
const uint8array = encoder.encode('this is some data');
```
A classe `TextEncoder` também está disponível no objeto global.

### `textEncoder.encode([input])` {#textencoderencodeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O texto para codificar. **Padrão:** uma string vazia.
- Retorna: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Codifica em UTF-8 a string `input` e retorna um `Uint8Array` contendo os bytes codificados.

### `textEncoder.encodeInto(src, dest)` {#textencoderencodeintosrc-dest}

**Adicionado em: v12.11.0**

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O texto para codificar.
- `dest` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) O array para armazenar o resultado da codificação.
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `read` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) As unidades de código Unicode lidas de src.
    - `written` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Os bytes UTF-8 gravados de dest.
  
 

Codifica em UTF-8 a string `src` para o `dest` Uint8Array e retorna um objeto contendo as unidades de código Unicode lidas e os bytes UTF-8 gravados.

```js [ESM]
const encoder = new TextEncoder();
const src = 'this is some data';
const dest = new Uint8Array(10);
const { read, written } = encoder.encodeInto(src, dest);
```

### `textEncoder.encoding` {#textencoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A codificação suportada pela instância de `TextEncoder`. Sempre definida como `'utf-8'`.

## `util.toUSVString(string)` {#utiltousvstringstring}

**Adicionado em: v16.8.0, v14.18.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna a `string` após substituir quaisquer pontos de código substitutos (ou, equivalentemente, quaisquer unidades de código substitutas não pareadas) pelo "caractere de substituição" Unicode U+FFFD.

## `util.transferableAbortController()` {#utiltransferableabortcontroller}

**Adicionado em: v18.11.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Cria e retorna uma instância de [\<AbortController\>](/pt/nodejs/api/globals#class-abortcontroller) cujo [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) é marcado como transferível e pode ser usado com `structuredClone()` ou `postMessage()`.

## `util.transferableAbortSignal(signal)` {#utiltransferableabortsignalsignal}

**Adicionado em: v18.11.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal)
- Retorna: [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal)

Marca o [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) fornecido como transferível para que possa ser usado com `structuredClone()` e `postMessage()`.

```js [ESM]
const signal = transferableAbortSignal(AbortSignal.timeout(100));
const channel = new MessageChannel();
channel.port2.postMessage(signal, [signal]);
```
## `util.aborted(signal, resource)` {#utilabortedsignal-resource}

**Adicionado em: v19.7.0, v18.16.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal)
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Qualquer objeto não nulo vinculado à operação anulável e mantido fracamente. Se o `resource` for coletado como lixo antes que o `signal` seja anulado, a promessa permanecerá pendente, permitindo que o Node.js pare de rastreá-lo. Isso ajuda a evitar vazamentos de memória em operações de longa duração ou não canceláveis.
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Ouve o evento de aborto no `signal` fornecido e retorna uma promessa que é resolvida quando o `signal` é abortado. Se o `resource` for fornecido, ele referencia fracamente o objeto associado da operação, portanto, se o `resource` for coletado como lixo antes que o `signal` seja abortado, a promessa retornada permanecerá pendente. Isso evita vazamentos de memória em operações de longa duração ou não canceláveis.

::: code-group
```js [CJS]
const { aborted } = require('node:util');

// Obtenha um objeto com um sinal anulável, como um recurso ou operação personalizada.
const dependent = obtainSomethingAbortable();

// Passe `dependent` como o recurso, indicando que a promessa só deve ser resolvida
// se `dependent` ainda estiver na memória quando o sinal for abortado.
aborted(dependent.signal, dependent).then(() => {

  // Este código é executado quando `dependent` é abortado.
  console.log('Dependent resource was aborted.');
});

// Simule um evento que aciona o aborto.
dependent.on('event', () => {
  dependent.abort(); // Isso fará com que a promessa `aborted` seja resolvida.
});
```

```js [ESM]
import { aborted } from 'node:util';

// Obtenha um objeto com um sinal anulável, como um recurso ou operação personalizada.
const dependent = obtainSomethingAbortable();

// Passe `dependent` como o recurso, indicando que a promessa só deve ser resolvida
// se `dependent` ainda estiver na memória quando o sinal for abortado.
aborted(dependent.signal, dependent).then(() => {

  // Este código é executado quando `dependent` é abortado.
  console.log('Dependent resource was aborted.');
});

// Simule um evento que aciona o aborto.
dependent.on('event', () => {
  dependent.abort(); // Isso fará com que a promessa `aborted` seja resolvida.
});
```
:::


## `util.types` {#utiltypes}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.3.0 | Exposto como `require('util/types')`. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

`util.types` fornece verificações de tipo para diferentes tipos de objetos embutidos. Ao contrário de `instanceof` ou `Object.prototype.toString.call(value)`, essas verificações não inspecionam propriedades do objeto que são acessíveis a partir do JavaScript (como seu protótipo) e geralmente têm a sobrecarga de chamar o C++.

O resultado geralmente não garante que tipos de propriedades ou comportamento um valor expõe em JavaScript. Eles são principalmente úteis para desenvolvedores de addon que preferem fazer a verificação de tipo em JavaScript.

A API é acessível via `require('node:util').types` ou `require('node:util/types')`.

### `util.types.isAnyArrayBuffer(value)` {#utiltypesisanyarraybuffervalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância embutida de [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) ou [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer).

Veja também [`util.types.isArrayBuffer()`](/pt/nodejs/api/util#utiltypesisarraybuffervalue) e [`util.types.isSharedArrayBuffer()`](/pt/nodejs/api/util#utiltypesissharedarraybuffervalue).

```js [ESM]
util.types.isAnyArrayBuffer(new ArrayBuffer());  // Retorna true
util.types.isAnyArrayBuffer(new SharedArrayBuffer());  // Retorna true
```
### `util.types.isArrayBufferView(value)` {#utiltypesisarraybufferviewvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância de uma das visualizações [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), como objetos de array tipado ou [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Equivalente a [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

```js [ESM]
util.types.isArrayBufferView(new Int8Array());  // true
util.types.isArrayBufferView(Buffer.from('hello world')); // true
util.types.isArrayBufferView(new DataView(new ArrayBuffer(16)));  // true
util.types.isArrayBufferView(new ArrayBuffer());  // false
```

### `util.types.isArgumentsObject(value)` {#utiltypesisargumentsobjectvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for um objeto `arguments`.

```js [ESM]
function foo() {
  util.types.isArgumentsObject(arguments);  // Retorna true
}
```
### `util.types.isArrayBuffer(value)` {#utiltypesisarraybuffervalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) embutida. Isso *não* inclui instâncias de [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer). Normalmente, é desejável testar ambos; Veja [`util.types.isAnyArrayBuffer()`](/pt/nodejs/api/util#utiltypesisanyarraybuffervalue) para isso.

```js [ESM]
util.types.isArrayBuffer(new ArrayBuffer());  // Retorna true
util.types.isArrayBuffer(new SharedArrayBuffer());  // Retorna false
```
### `util.types.isAsyncFunction(value)` {#utiltypesisasyncfunctionvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma [função assíncrona](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function). Isso apenas relata o que o mecanismo JavaScript está vendo; em particular, o valor de retorno pode não corresponder ao código-fonte original se uma ferramenta de transpilação foi usada.

```js [ESM]
util.types.isAsyncFunction(function foo() {});  // Retorna false
util.types.isAsyncFunction(async function foo() {});  // Retorna true
```

### `util.types.isBigInt64Array(value)` {#utiltypesisbigint64arrayvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância de `BigInt64Array`.

```js [ESM]
util.types.isBigInt64Array(new BigInt64Array());   // Retorna true
util.types.isBigInt64Array(new BigUint64Array());  // Retorna false
```
### `util.types.isBigIntObject(value)` {#utiltypesisbigintobjectvalue}

**Adicionado em: v10.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for um objeto BigInt, por exemplo, criado por `Object(BigInt(123))`.

```js [ESM]
util.types.isBigIntObject(Object(BigInt(123)));   // Retorna true
util.types.isBigIntObject(BigInt(123));   // Retorna false
util.types.isBigIntObject(123);  // Retorna false
```
### `util.types.isBigUint64Array(value)` {#utiltypesisbiguint64arrayvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância de `BigUint64Array`.

```js [ESM]
util.types.isBigUint64Array(new BigInt64Array());   // Retorna false
util.types.isBigUint64Array(new BigUint64Array());  // Retorna true
```
### `util.types.isBooleanObject(value)` {#utiltypesisbooleanobjectvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for um objeto booleano, por exemplo, criado por `new Boolean()`.

```js [ESM]
util.types.isBooleanObject(false);  // Retorna false
util.types.isBooleanObject(true);   // Retorna false
util.types.isBooleanObject(new Boolean(false)); // Retorna true
util.types.isBooleanObject(new Boolean(true));  // Retorna true
util.types.isBooleanObject(Boolean(false)); // Retorna false
util.types.isBooleanObject(Boolean(true));  // Retorna false
```

### `util.types.isBoxedPrimitive(value)` {#utiltypesisboxedprimitivevalue}

**Adicionado em: v10.11.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for qualquer objeto primitivo em caixa, por exemplo, criado por `new Boolean()`, `new String()` ou `Object(Symbol())`.

Por exemplo:

```js [ESM]
util.types.isBoxedPrimitive(false); // Retorna falso
util.types.isBoxedPrimitive(new Boolean(false)); // Retorna verdadeiro
util.types.isBoxedPrimitive(Symbol('foo')); // Retorna falso
util.types.isBoxedPrimitive(Object(Symbol('foo'))); // Retorna verdadeiro
util.types.isBoxedPrimitive(Object(BigInt(5))); // Retorna verdadeiro
```
### `util.types.isCryptoKey(value)` {#utiltypesiscryptokeyvalue}

**Adicionado em: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se `value` for um [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey), `false` caso contrário.

### `util.types.isDataView(value)` {#utiltypesisdataviewvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) incorporada.

```js [ESM]
const ab = new ArrayBuffer(20);
util.types.isDataView(new DataView(ab));  // Retorna verdadeiro
util.types.isDataView(new Float64Array());  // Retorna falso
```
Veja também [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

### `util.types.isDate(value)` {#utiltypesisdatevalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) incorporada.

```js [ESM]
util.types.isDate(new Date());  // Retorna verdadeiro
```

### `util.types.isExternal(value)` {#utiltypesisexternalvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for um valor `External` nativo.

Um valor `External` nativo é um tipo especial de objeto que contém um ponteiro C++ bruto (`void*`) para acesso a partir de código nativo e não tem outras propriedades. Esses objetos são criados pelos internos do Node.js ou por complementos nativos. Em JavaScript, eles são objetos [congelados](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) com um protótipo `null`.

```C [C]
#include <js_native_api.h>
#include <stdlib.h>
napi_value result;
static napi_value MyNapi(napi_env env, napi_callback_info info) {
  int* raw = (int*) malloc(1024);
  napi_status status = napi_create_external(env, (void*) raw, NULL, NULL, &result);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "napi_create_external failed");
    return NULL;
  }
  return result;
}
...
DECLARE_NAPI_PROPERTY("myNapi", MyNapi)
...
```
```js [ESM]
const native = require('napi_addon.node');
const data = native.myNapi();
util.types.isExternal(data); // returns true
util.types.isExternal(0); // returns false
util.types.isExternal(new String('foo')); // returns false
```
Para obter mais informações sobre `napi_create_external`, consulte [`napi_create_external()`](/pt/nodejs/api/n-api#napi_create_external).

### `util.types.isFloat32Array(value)` {#utiltypesisfloat32arrayvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`Float32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array) incorporada.

```js [ESM]
util.types.isFloat32Array(new ArrayBuffer());  // Returns false
util.types.isFloat32Array(new Float32Array());  // Returns true
util.types.isFloat32Array(new Float64Array());  // Returns false
```

### `util.types.isFloat64Array(value)` {#utiltypesisfloat64arrayvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`Float64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array) embutida.

```js [ESM]
util.types.isFloat64Array(new ArrayBuffer());  // Retorna false
util.types.isFloat64Array(new Uint8Array());  // Retorna false
util.types.isFloat64Array(new Float64Array());  // Retorna true
```
### `util.types.isGeneratorFunction(value)` {#utiltypesisgeneratorfunctionvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma função geradora. Isso apenas reporta o que o mecanismo JavaScript está vendo; em particular, o valor de retorno pode não corresponder ao código-fonte original se uma ferramenta de transcompilação foi usada.

```js [ESM]
util.types.isGeneratorFunction(function foo() {});  // Retorna false
util.types.isGeneratorFunction(function* foo() {});  // Retorna true
```
### `util.types.isGeneratorObject(value)` {#utiltypesisgeneratorobjectvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for um objeto gerador retornado de uma função geradora embutida. Isso apenas reporta o que o mecanismo JavaScript está vendo; em particular, o valor de retorno pode não corresponder ao código-fonte original se uma ferramenta de transcompilação foi usada.

```js [ESM]
function* foo() {}
const generator = foo();
util.types.isGeneratorObject(generator);  // Retorna true
```
### `util.types.isInt8Array(value)` {#utiltypesisint8arrayvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`Int8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array) embutida.

```js [ESM]
util.types.isInt8Array(new ArrayBuffer());  // Retorna false
util.types.isInt8Array(new Int8Array());  // Retorna true
util.types.isInt8Array(new Float64Array());  // Retorna false
```

### `util.types.isInt16Array(value)` {#utiltypesisint16arrayvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`Int16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array) embutida.

```js [ESM]
util.types.isInt16Array(new ArrayBuffer());  // Retorna false
util.types.isInt16Array(new Int16Array());  // Retorna true
util.types.isInt16Array(new Float64Array());  // Retorna false
```
### `util.types.isInt32Array(value)` {#utiltypesisint32arrayvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`Int32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array) embutida.

```js [ESM]
util.types.isInt32Array(new ArrayBuffer());  // Retorna false
util.types.isInt32Array(new Int32Array());  // Retorna true
util.types.isInt32Array(new Float64Array());  // Retorna false
```
### `util.types.isKeyObject(value)` {#utiltypesiskeyobjectvalue}

**Adicionado em: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se `value` for um [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject), `false` caso contrário.

### `util.types.isMap(value)` {#utiltypesismapvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) embutida.

```js [ESM]
util.types.isMap(new Map());  // Retorna true
```

### `util.types.isMapIterator(value)` {#utiltypesismapiteratorvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for um iterador retornado para uma instância [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) embutida.

```js [ESM]
const map = new Map();
util.types.isMapIterator(map.keys());  // Retorna true
util.types.isMapIterator(map.values());  // Retorna true
util.types.isMapIterator(map.entries());  // Retorna true
util.types.isMapIterator(map[Symbol.iterator]());  // Retorna true
```
### `util.types.isModuleNamespaceObject(value)` {#utiltypesismodulenamespaceobjectvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância de um [Objeto Namespace de Módulo](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects).

```js [ESM]
import * as ns from './a.js';

util.types.isModuleNamespaceObject(ns);  // Retorna true
```
### `util.types.isNativeError(value)` {#utiltypesisnativeerrorvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor foi retornado pelo construtor de um [tipo `Error` embutido](https://tc39.es/ecma262/#sec-error-objects).

```js [ESM]
console.log(util.types.isNativeError(new Error()));  // true
console.log(util.types.isNativeError(new TypeError()));  // true
console.log(util.types.isNativeError(new RangeError()));  // true
```
Subclasses dos tipos de erro nativos também são erros nativos:

```js [ESM]
class MyError extends Error {}
console.log(util.types.isNativeError(new MyError()));  // true
```
Um valor sendo `instanceof` uma classe de erro nativa não é equivalente a `isNativeError()` retornar `true` para esse valor. `isNativeError()` retorna `true` para erros que vêm de um [realm](https://tc39.es/ecma262/#realm) diferente, enquanto `instanceof Error` retorna `false` para esses erros:

```js [ESM]
const vm = require('node:vm');
const context = vm.createContext({});
const myError = vm.runInContext('new Error()', context);
console.log(util.types.isNativeError(myError)); // true
console.log(myError instanceof Error); // false
```
Por outro lado, `isNativeError()` retorna `false` para todos os objetos que não foram retornados pelo construtor de um erro nativo. Isso inclui valores que são `instanceof` erros nativos:

```js [ESM]
const myError = { __proto__: Error.prototype };
console.log(util.types.isNativeError(myError)); // false
console.log(myError instanceof Error); // true
```

### `util.types.isNumberObject(value)` {#utiltypesisnumberobjectvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for um objeto de número, por exemplo, criado por `new Number()`.

```js [ESM]
util.types.isNumberObject(0);  // Retorna falso
util.types.isNumberObject(new Number(0));   // Retorna verdadeiro
```
### `util.types.isPromise(value)` {#utiltypesispromisevalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for um [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) embutido.

```js [ESM]
util.types.isPromise(Promise.resolve(42));  // Retorna verdadeiro
```
### `util.types.isProxy(value)` {#utiltypesisproxyvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância de [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

```js [ESM]
const target = {};
const proxy = new Proxy(target, {});
util.types.isProxy(target);  // Retorna falso
util.types.isProxy(proxy);  // Retorna verdadeiro
```
### `util.types.isRegExp(value)` {#utiltypesisregexpvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for um objeto de expressão regular.

```js [ESM]
util.types.isRegExp(/abc/);  // Retorna verdadeiro
util.types.isRegExp(new RegExp('abc'));  // Retorna verdadeiro
```

### `util.types.isSet(value)` {#utiltypesissetvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) integrada.

```js [ESM]
util.types.isSet(new Set());  // Retorna true
```
### `util.types.isSetIterator(value)` {#utiltypesissetiteratorvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for um iterador retornado para uma instância [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) integrada.

```js [ESM]
const set = new Set();
util.types.isSetIterator(set.keys());  // Retorna true
util.types.isSetIterator(set.values());  // Retorna true
util.types.isSetIterator(set.entries());  // Retorna true
util.types.isSetIterator(set[Symbol.iterator]());  // Retorna true
```
### `util.types.isSharedArrayBuffer(value)` {#utiltypesissharedarraybuffervalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) integrada. Isto *não* inclui instâncias [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Geralmente, é desejável testar para ambos; Veja [`util.types.isAnyArrayBuffer()`](/pt/nodejs/api/util#utiltypesisanyarraybuffervalue) para isso.

```js [ESM]
util.types.isSharedArrayBuffer(new ArrayBuffer());  // Retorna false
util.types.isSharedArrayBuffer(new SharedArrayBuffer());  // Retorna true
```

### `util.types.isStringObject(value)` {#utiltypesisstringobjectvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for um objeto string, por exemplo, criado por `new String()`.

```js [ESM]
util.types.isStringObject('foo');  // Retorna false
util.types.isStringObject(new String('foo'));   // Retorna true
```
### `util.types.isSymbolObject(value)` {#utiltypesissymbolobjectvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for um objeto symbol, criado chamando `Object()` em um primitivo `Symbol`.

```js [ESM]
const symbol = Symbol('foo');
util.types.isSymbolObject(symbol);  // Retorna false
util.types.isSymbolObject(Object(symbol));   // Retorna true
```
### `util.types.isTypedArray(value)` {#utiltypesistypedarrayvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) embutida.

```js [ESM]
util.types.isTypedArray(new ArrayBuffer());  // Retorna false
util.types.isTypedArray(new Uint8Array());  // Retorna true
util.types.isTypedArray(new Float64Array());  // Retorna true
```
Veja também [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

### `util.types.isUint8Array(value)` {#utiltypesisuint8arrayvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) embutida.

```js [ESM]
util.types.isUint8Array(new ArrayBuffer());  // Retorna false
util.types.isUint8Array(new Uint8Array());  // Retorna true
util.types.isUint8Array(new Float64Array());  // Retorna false
```

### `util.types.isUint8ClampedArray(value)` {#utiltypesisuint8clampedarrayvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`Uint8ClampedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray) embutida.

```js [ESM]
util.types.isUint8ClampedArray(new ArrayBuffer());  // Retorna false
util.types.isUint8ClampedArray(new Uint8ClampedArray());  // Retorna true
util.types.isUint8ClampedArray(new Float64Array());  // Retorna false
```
### `util.types.isUint16Array(value)` {#utiltypesisuint16arrayvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`Uint16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array) embutida.

```js [ESM]
util.types.isUint16Array(new ArrayBuffer());  // Retorna false
util.types.isUint16Array(new Uint16Array());  // Retorna true
util.types.isUint16Array(new Float64Array());  // Retorna false
```
### `util.types.isUint32Array(value)` {#utiltypesisuint32arrayvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`Uint32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array) embutida.

```js [ESM]
util.types.isUint32Array(new ArrayBuffer());  // Retorna false
util.types.isUint32Array(new Uint32Array());  // Retorna true
util.types.isUint32Array(new Float64Array());  // Retorna false
```
### `util.types.isWeakMap(value)` {#utiltypesisweakmapvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor for uma instância [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) embutida.

```js [ESM]
util.types.isWeakMap(new WeakMap());  // Retorna true
```

### `util.types.isWeakSet(value)` {#utiltypesisweaksetvalue}

**Adicionado em: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o valor é uma instância [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) embutida.

```js [ESM]
util.types.isWeakSet(new WeakSet());  // Retorna true
```
## APIs Descontinuadas {#deprecated-apis}

As seguintes APIs estão descontinuadas e não devem mais ser usadas. Aplicações e módulos existentes devem ser atualizados para encontrar abordagens alternativas.

### `util._extend(target, source)` {#util_extendtarget-source}

**Adicionado em: v0.7.5**

**Descontinuado desde: v6.0.0**

::: danger [Estável: 0 - Descontinuado]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Descontinuado: Use [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) em vez disso.
:::

- `target` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `source` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

O método `util._extend()` nunca foi pretendido para ser usado fora dos módulos internos do Node.js. A comunidade encontrou e usou mesmo assim.

Está descontinuado e não deve ser usado em código novo. JavaScript vem com funcionalidade embutida muito similar através de [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

### `util.isArray(object)` {#utilisarrayobject}

**Adicionado em: v0.6.0**

**Descontinuado desde: v4.0.0**

::: danger [Estável: 0 - Descontinuado]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Descontinuado: Use [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) em vez disso.
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Alias para [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray).

Retorna `true` se o `object` fornecido é um `Array`. Caso contrário, retorna `false`.

```js [ESM]
const util = require('node:util');

util.isArray([]);
// Retorna: true
util.isArray(new Array());
// Retorna: true
util.isArray({});
// Retorna: false
```

