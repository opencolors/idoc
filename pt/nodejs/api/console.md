---
title: Documentação da API de Console do Node.js
description: A API de Console do Node.js oferece um console de depuração simples, semelhante ao mecanismo de console JavaScript fornecido pelos navegadores web. Esta documentação detalha os métodos disponíveis para registro, depuração e inspeção de objetos JavaScript em um ambiente Node.js.
head:
  - - meta
    - name: og:title
      content: Documentação da API de Console do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: A API de Console do Node.js oferece um console de depuração simples, semelhante ao mecanismo de console JavaScript fornecido pelos navegadores web. Esta documentação detalha os métodos disponíveis para registro, depuração e inspeção de objetos JavaScript em um ambiente Node.js.
  - - meta
    - name: twitter:title
      content: Documentação da API de Console do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: A API de Console do Node.js oferece um console de depuração simples, semelhante ao mecanismo de console JavaScript fornecido pelos navegadores web. Esta documentação detalha os métodos disponíveis para registro, depuração e inspeção de objetos JavaScript em um ambiente Node.js.
---


# Console {#console}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/console.js](https://github.com/nodejs/node/blob/v23.5.0/lib/console.js)

O módulo `node:console` fornece um console de depuração simples que é semelhante ao mecanismo de console JavaScript fornecido pelos navegadores da web.

O módulo exporta dois componentes específicos:

- Uma classe `Console` com métodos como `console.log()`, `console.error()` e `console.warn()` que podem ser usados para escrever em qualquer stream Node.js.
- Uma instância global `console` configurada para escrever em [`process.stdout`](/pt/nodejs/api/process#processstdout) e [`process.stderr`](/pt/nodejs/api/process#processstderr). O `console` global pode ser usado sem chamar `require('node:console')`.

*<strong>Aviso</strong>*: Os métodos do objeto console global não são consistentemente síncronos como as APIs do navegador que eles se assemelham, nem são consistentemente assíncronos como todos os outros streams Node.js. Programas que desejam depender do comportamento síncrono / assíncrono das funções do console devem primeiro descobrir a natureza do stream de suporte do console. Isso ocorre porque o stream depende da plataforma subjacente e da configuração do stream padrão do processo atual. Consulte a [nota sobre E/S do processo](/pt/nodejs/api/process#a-note-on-process-io) para obter mais informações.

Exemplo usando o `console` global:

```js [ESM]
console.log('olá mundo');
// Imprime: olá mundo, para stdout
console.log('olá %s', 'mundo');
// Imprime: olá mundo, para stdout
console.error(new Error('Ops, algo ruim aconteceu'));
// Imprime mensagem de erro e stack trace para stderr:
//   Error: Ops, algo ruim aconteceu
//     at [eval]:5:15
//     at Script.runInThisContext (node:vm:132:18)
//     at Object.runInThisContext (node:vm:309:38)
//     at node:internal/process/execution:77:19
//     at [eval]-wrapper:6:22
//     at evalScript (node:internal/process/execution:76:60)
//     at node:internal/main/eval_string:23:3

const name = 'Will Robinson';
console.warn(`Perigo ${name}! Perigo!`);
// Imprime: Perigo Will Robinson! Perigo!, para stderr
```
Exemplo usando a classe `Console`:

```js [ESM]
const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);

myConsole.log('olá mundo');
// Imprime: olá mundo, para out
myConsole.log('olá %s', 'mundo');
// Imprime: olá mundo, para out
myConsole.error(new Error('Ops, algo ruim aconteceu'));
// Imprime: [Error: Ops, algo ruim aconteceu], para err

const name = 'Will Robinson';
myConsole.warn(`Perigo ${name}! Perigo!`);
// Imprime: Perigo Will Robinson! Perigo!, para err
```

## Classe: `Console` {#class-console}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | Erros que ocorrem durante a escrita nos fluxos subjacentes agora serão ignorados por padrão. |
:::

A classe `Console` pode ser usada para criar um logger simples com fluxos de saída configuráveis e pode ser acessada usando `require('node:console').Console` ou `console.Console` (ou suas contrapartes desestruturadas):

::: code-group
```js [ESM]
import { Console } from 'node:console';
```

```js [CJS]
const { Console } = require('node:console');
```
:::

```js [ESM]
const { Console } = console;
```
### `new Console(stdout[, stderr][, ignoreErrors])` {#new-consolestdout-stderr-ignoreerrors}

### `new Console(options)` {#new-consoleoptions}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.2.0, v12.17.0 | A opção `groupIndentation` foi introduzida. |
| v11.7.0 | A opção `inspectOptions` foi introduzida. |
| v10.0.0 | O construtor `Console` agora suporta um argumento `options`, e a opção `colorMode` foi introduzida. |
| v8.0.0 | A opção `ignoreErrors` foi introduzida. |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stdout` [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable)
    - `stderr` [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable)
    - `ignoreErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ignora erros ao gravar nos fluxos subjacentes. **Padrão:** `true`.
    - `colorMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Define o suporte de cores para esta instância de `Console`. Definir como `true` ativa a colorização ao inspecionar valores. Definir como `false` desativa a colorização ao inspecionar valores. Definir como `'auto'` faz com que o suporte de cores dependa do valor da propriedade `isTTY` e do valor retornado por `getColorDepth()` no fluxo respectivo. Esta opção não pode ser usada se `inspectOptions.colors` também estiver definido. **Padrão:** `'auto'`.
    - `inspectOptions` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Especifica opções que são passadas para [`util.inspect()`](/pt/nodejs/api/util#utilinspectobject-options).
    - `groupIndentation` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a indentação do grupo. **Padrão:** `2`.

Cria um novo `Console` com uma ou duas instâncias de fluxo gravável. `stdout` é um fluxo gravável para imprimir saída de log ou informação. `stderr` é usado para avisos ou erros. Se `stderr` não for fornecido, `stdout` é usado para `stderr`.

::: code-group
```js [ESM]
import { createWriteStream } from 'node:fs';
import { Console } from 'node:console';
// Alternativamente
// const { Console } = console;

const output = createWriteStream('./stdout.log');
const errorOutput = createWriteStream('./stderr.log');
// Logger simples personalizado
const logger = new Console({ stdout: output, stderr: errorOutput });
// use-o como console
const count = 5;
logger.log('count: %d', count);
// Em stdout.log: count 5
```

```js [CJS]
const fs = require('node:fs');
const { Console } = require('node:console');
// Alternativamente
// const { Console } = console;

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// Logger simples personalizado
const logger = new Console({ stdout: output, stderr: errorOutput });
// use-o como console
const count = 5;
logger.log('count: %d', count);
// Em stdout.log: count 5
```
:::

O `console` global é um `Console` especial cuja saída é enviada para [`process.stdout`](/pt/nodejs/api/process#processstdout) e [`process.stderr`](/pt/nodejs/api/process#processstderr). É equivalente a chamar:

```js [ESM]
new Console({ stdout: process.stdout, stderr: process.stderr });
```

### `console.assert(value[, ...message])` {#consoleassertvalue-message}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | A implementação agora está em conformidade com a especificação e não lança mais erros. |
| v0.1.101 | Adicionado em: v0.1.101 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O valor testado para ser verdadeiro.
- `...message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Todos os argumentos além de `value` são usados como mensagem de erro.

`console.assert()` escreve uma mensagem se `value` for [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) ou omitido. Ele apenas escreve uma mensagem e não afeta a execução de outra forma. A saída sempre começa com `"Assertion failed"`. Se fornecido, `message` é formatado usando [`util.format()`](/pt/nodejs/api/util#utilformatformat-args).

Se `value` for [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), nada acontece.

```js [ESM]
console.assert(true, 'não faz nada');

console.assert(false, 'Ops, %s não funcionou', 'não');
// Assertion failed: Ops, não funcionou

console.assert();
// Assertion failed
```
### `console.clear()` {#consoleclear}

**Adicionado em: v8.3.0**

Quando `stdout` é um TTY, chamar `console.clear()` tentará limpar o TTY. Quando `stdout` não é um TTY, este método não faz nada.

A operação específica de `console.clear()` pode variar entre sistemas operacionais e tipos de terminal. Para a maioria dos sistemas operacionais Linux, `console.clear()` opera de forma semelhante ao comando `clear` do shell. No Windows, `console.clear()` limpará apenas a saída na viewport do terminal atual para o binário Node.js.

### `console.count([label])` {#consolecountlabel}

**Adicionado em: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O rótulo de exibição para o contador. **Padrão:** `'default'`.

Mantém um contador interno específico para `label` e exibe em `stdout` o número de vezes que `console.count()` foi chamado com o `label` fornecido.

```js [ESM]
> console.count()
default: 1
undefined
> console.count('default')
default: 2
undefined
> console.count('abc')
abc: 1
undefined
> console.count('xyz')
xyz: 1
undefined
> console.count('abc')
abc: 2
undefined
> console.count()
default: 3
undefined
>
```

### `console.countReset([label])` {#consolecountresetlabel}

**Adicionado em: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O rótulo de exibição para o contador. **Padrão:** `'default'`.

Redefine o contador interno específico para `label`.

```js [ESM]
> console.count('abc');
abc: 1
undefined
> console.countReset('abc');
undefined
> console.count('abc');
abc: 1
undefined
>
```
### `console.debug(data[, ...args])` {#consoledebugdata-args}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.10.0 | `console.debug` agora é um alias para `console.log`. |
| v8.0.0 | Adicionado em: v8.0.0 |
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

A função `console.debug()` é um alias para [`console.log()`](/pt/nodejs/api/console#consolelogdata-args).

### `console.dir(obj[, options])` {#consoledirobj-options}

**Adicionado em: v0.1.101**

- `obj` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, as propriedades não enumeráveis e de símbolo do objeto também serão exibidas. **Padrão:** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Informa a [`util.inspect()`](/pt/nodejs/api/util#utilinspectobject-options) quantas vezes recursar ao formatar o objeto. Isso é útil para inspecionar objetos grandes e complicados. Para fazer com que ele se repita indefinidamente, passe `null`. **Padrão:** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, a saída será estilizada com códigos de cores ANSI. As cores são personalizáveis; consulte [personalizando as cores `util.inspect()` ](/pt/nodejs/api/util#customizing-utilinspect-colors). **Padrão:** `false`.
  
 

Usa [`util.inspect()`](/pt/nodejs/api/util#utilinspectobject-options) em `obj` e imprime a string resultante em `stdout`. Esta função ignora qualquer função `inspect()` personalizada definida em `obj`.


### `console.dirxml(...data)` {#consoledirxmldata}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.3.0 | `console.dirxml` agora chama `console.log` para seus argumentos. |
| v8.0.0 | Adicionado em: v8.0.0 |
:::

- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Este método chama `console.log()` passando os argumentos recebidos. Este método não produz nenhuma formatação XML.

### `console.error([data][, ...args])` {#consoleerrordata-args}

**Adicionado em: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Imprime para `stderr` com nova linha. Múltiplos argumentos podem ser passados, com o primeiro usado como a mensagem primária e todos os adicionais usados como valores de substituição similar a [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) (os argumentos são todos passados para [`util.format()`](/pt/nodejs/api/util#utilformatformat-args)).

```js [ESM]
const code = 5;
console.error('error #%d', code);
// Imprime: error #5, para stderr
console.error('error', code);
// Imprime: error 5, para stderr
```
Se elementos de formatação (e.g. `%d`) não forem encontrados na primeira string então [`util.inspect()`](/pt/nodejs/api/util#utilinspectobject-options) é chamado em cada argumento e os valores de string resultantes são concatenados. Veja [`util.format()`](/pt/nodejs/api/util#utilformatformat-args) para mais informações.

### `console.group([...label])` {#consolegrouplabel}

**Adicionado em: v8.5.0**

- `...label` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Aumenta a indentação das linhas subsequentes por espaços do comprimento de `groupIndentation`.

Se um ou mais `label`s forem fornecidos, eles são impressos primeiro sem a indentação adicional.

### `console.groupCollapsed()` {#consolegroupcollapsed}

**Adicionado em: v8.5.0**

Um alias para [`console.group()`](/pt/nodejs/api/console#consolegrouplabel).

### `console.groupEnd()` {#consolegroupend}

**Adicionado em: v8.5.0**

Diminui a indentação das linhas subsequentes por espaços do comprimento de `groupIndentation`.


### `console.info([data][, ...args])` {#consoleinfodata-args}

**Adicionado em: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

A função `console.info()` é um alias para [`console.log()`](/pt/nodejs/api/console#consolelogdata-args).

### `console.log([data][, ...args])` {#consolelogdata-args}

**Adicionado em: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Imprime em `stdout` com uma nova linha. Vários argumentos podem ser passados, com o primeiro usado como a mensagem principal e todos os adicionais usados como valores de substituição semelhantes a [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) (os argumentos são todos passados para [`util.format()`](/pt/nodejs/api/util#utilformatformat-args)).

```js [ESM]
const count = 5;
console.log('count: %d', count);
// Imprime: count: 5, para stdout
console.log('count:', count);
// Imprime: count: 5, para stdout
```
Veja [`util.format()`](/pt/nodejs/api/util#utilformatformat-args) para mais informações.

### `console.table(tabularData[, properties])` {#consoletabletabulardata-properties}

**Adicionado em: v10.0.0**

- `tabularData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `properties` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Propriedades alternativas para construir a tabela.

Tente construir uma tabela com as colunas das propriedades de `tabularData` (ou use `properties`) e as linhas de `tabularData` e registre-a. Retorna para apenas registrar o argumento se não puder ser analisado como tabular.

```js [ESM]
// Estes não podem ser analisados como dados tabulares
console.table(Symbol());
// Symbol()

console.table(undefined);
// undefined

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
// ┌─────────┬─────┬─────┐
// │ (index) │ a   │ b   │
// ├─────────┼─────┼─────┤
// │ 0       │ 1   │ 'Y' │
// │ 1       │ 'Z' │ 2   │
// └─────────┴─────┴─────┘

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
// ┌─────────┬─────┐
// │ (index) │ a   │
// ├─────────┼─────┤
// │ 0       │ 1   │
// │ 1       │ 'Z' │
// └─────────┴─────┘
```

### `console.time([label])` {#consoletimelabel}

**Adicionado em: v0.1.104**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'default'`

Inicia um temporizador que pode ser usado para calcular a duração de uma operação. Os temporizadores são identificados por um `label` único. Use o mesmo `label` ao chamar [`console.timeEnd()`](/pt/nodejs/api/console#consoletimeendlabel) para parar o temporizador e exibir o tempo decorrido em unidades de tempo adequadas para `stdout`. Por exemplo, se o tempo decorrido for 3869ms, `console.timeEnd()` exibirá "3.869s".

### `console.timeEnd([label])` {#consoletimeendlabel}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.0.0 | O tempo decorrido é exibido com uma unidade de tempo adequada. |
| v6.0.0 | Este método não suporta mais múltiplas chamadas que não se mapeiam para chamadas `console.time()` individuais; veja abaixo para detalhes. |
| v0.1.104 | Adicionado em: v0.1.104 |
:::

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'default'`

Para um temporizador que foi previamente iniciado ao chamar [`console.time()`](/pt/nodejs/api/console#consoletimelabel), imprime o resultado para `stdout`:

```js [ESM]
console.time('bunch-of-stuff');
// Do a bunch of stuff.
console.timeEnd('bunch-of-stuff');
// Prints: bunch-of-stuff: 225.438ms
```
### `console.timeLog([label][, ...data])` {#consoletimeloglabel-data}

**Adicionado em: v10.7.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'default'`
- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Para um temporizador que foi previamente iniciado ao chamar [`console.time()`](/pt/nodejs/api/console#consoletimelabel), imprime o tempo decorrido e outros argumentos `data` para `stdout`:

```js [ESM]
console.time('process');
const value = expensiveProcess1(); // Returns 42
console.timeLog('process', value);
// Prints "process: 365.227ms 42".
doExpensiveProcess2(value);
console.timeEnd('process');
```
### `console.trace([message][, ...args])` {#consoletracemessage-args}

**Adicionado em: v0.1.104**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Imprime para `stderr` a string `'Trace: '`, seguida pela mensagem formatada [`util.format()`](/pt/nodejs/api/util#utilformatformat-args) e stack trace para a posição atual no código.

```js [ESM]
console.trace('Show me');
// Prints: (stack trace will vary based on where trace is called)
//  Trace: Show me
//    at repl:2:9
//    at REPLServer.defaultEval (repl.js:248:27)
//    at bound (domain.js:287:14)
//    at REPLServer.runBound [as eval] (domain.js:300:12)
//    at REPLServer.<anonymous> (repl.js:412:12)
//    at emitOne (events.js:82:20)
//    at REPLServer.emit (events.js:169:7)
//    at REPLServer.Interface._onLine (readline.js:210:10)
//    at REPLServer.Interface._line (readline.js:549:8)
//    at REPLServer.Interface._ttyWrite (readline.js:826:14)
```

### `console.warn([data][, ...args])` {#consolewarndata-args}

**Adicionado em: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

A função `console.warn()` é um alias para [`console.error()`](/pt/nodejs/api/console#consoleerrordata-args).

## Métodos exclusivos do Inspector {#inspector-only-methods}

Os seguintes métodos são expostos pelo mecanismo V8 na API geral, mas não exibem nada, a menos que sejam usados em conjunto com o [inspector](/pt/nodejs/api/debugger) (flag `--inspect`).

### `console.profile([label])` {#consoleprofilelabel}

**Adicionado em: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Este método não exibe nada a menos que seja usado no inspector. O método `console.profile()` inicia um perfil de CPU JavaScript com um rótulo opcional até que [`console.profileEnd()`](/pt/nodejs/api/console#consoleprofileendlabel) seja chamado. O perfil é então adicionado ao painel **Profile** do inspector.

```js [ESM]
console.profile('MyLabel');
// Some code
console.profileEnd('MyLabel');
// Adds the profile 'MyLabel' to the Profiles panel of the inspector.
```
### `console.profileEnd([label])` {#consoleprofileendlabel}

**Adicionado em: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Este método não exibe nada a menos que seja usado no inspector. Interrompe a sessão de criação de perfil de CPU JavaScript atual, caso uma tenha sido iniciada, e imprime o relatório no painel **Profiles** do inspector. Consulte [`console.profile()`](/pt/nodejs/api/console#consoleprofilelabel) para obter um exemplo.

Se este método for chamado sem um rótulo, o perfil iniciado mais recentemente será interrompido.

### `console.timeStamp([label])` {#consoletimestamplabel}

**Adicionado em: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Este método não exibe nada a menos que seja usado no inspector. O método `console.timeStamp()` adiciona um evento com o rótulo `'label'` ao painel **Timeline** do inspector.

