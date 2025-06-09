---
title: Documentação do REPL do Node.js
description: Explore o REPL do Node.js (Read-Eval-Print Loop) que oferece um ambiente interativo para executar código JavaScript, depurar e testar aplicações Node.js.
head:
  - - meta
    - name: og:title
      content: Documentação do REPL do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explore o REPL do Node.js (Read-Eval-Print Loop) que oferece um ambiente interativo para executar código JavaScript, depurar e testar aplicações Node.js.
  - - meta
    - name: twitter:title
      content: Documentação do REPL do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explore o REPL do Node.js (Read-Eval-Print Loop) que oferece um ambiente interativo para executar código JavaScript, depurar e testar aplicações Node.js.
---


# REPL {#repl}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código-fonte:** [lib/repl.js](https://github.com/nodejs/node/blob/v23.5.0/lib/repl.js)

O módulo `node:repl` fornece uma implementação Read-Eval-Print-Loop (REPL) que está disponível como um programa independente ou incluível em outras aplicações. Ele pode ser acessado usando:

::: code-group
```js [ESM]
import repl from 'node:repl';
```

```js [CJS]
const repl = require('node:repl');
```
:::

## Design e recursos {#design-and-features}

O módulo `node:repl` exporta a classe [`repl.REPLServer`](/pt/nodejs/api/repl#class-replserver). Durante a execução, instâncias de [`repl.REPLServer`](/pt/nodejs/api/repl#class-replserver) aceitarão linhas individuais de entrada do usuário, avaliarão-nas de acordo com uma função de avaliação definida pelo usuário e, em seguida, produzirão o resultado. A entrada e a saída podem ser de `stdin` e `stdout`, respectivamente, ou podem ser conectadas a qualquer [stream](/pt/nodejs/api/stream) do Node.js.

Instâncias de [`repl.REPLServer`](/pt/nodejs/api/repl#class-replserver) suportam preenchimento automático de entradas, visualização de preenchimento, edição de linha simplista no estilo Emacs, entradas de várias linhas, pesquisa reversa semelhante ao [ZSH](https://en.wikipedia.org/wiki/Z_shell), pesquisa de histórico baseada em substring semelhante ao [ZSH](https://en.wikipedia.org/wiki/Z_shell), saída com estilo ANSI, salvamento e restauração do estado atual da sessão REPL, recuperação de erros e funções de avaliação personalizáveis. Terminais que não suportam estilos ANSI e edição de linha no estilo Emacs automaticamente recorrem a um conjunto de recursos limitado.

### Comandos e teclas especiais {#commands-and-special-keys}

Os seguintes comandos especiais são suportados por todas as instâncias REPL:

- `.break`: Quando estiver no processo de inserir uma expressão de várias linhas, insira o comando `.break` (ou pressione +) para abortar a entrada ou o processamento dessa expressão.
- `.clear`: Redefine o `context` do REPL para um objeto vazio e limpa qualquer expressão de várias linhas que esteja sendo inserida.
- `.exit`: Fecha o fluxo de E/S, fazendo com que o REPL saia.
- `.help`: Mostra esta lista de comandos especiais.
- `.save`: Salva a sessão REPL atual em um arquivo: `\> .save ./file/to/save.js`
- `.load`: Carrega um arquivo na sessão REPL atual. `\> .load ./file/to/load.js`
- `.editor`: Entra no modo editor (+ para finalizar, + para cancelar).

```bash [BASH]
> .editor
// Entering editor mode (^D to finish, ^C to cancel)
function welcome(name) {
  return `Hello ${name}!`;
}

welcome('Node.js User');

// ^D
'Hello Node.js User!'
>
```
As seguintes combinações de teclas no REPL têm estes efeitos especiais:

- +: Quando pressionada uma vez, tem o mesmo efeito que o comando `.break`. Quando pressionada duas vezes em uma linha em branco, tem o mesmo efeito que o comando `.exit`.
- +: Tem o mesmo efeito que o comando `.exit`.
- : Quando pressionada em uma linha em branco, exibe variáveis globais e locais (escopo). Quando pressionada durante a inserção de outra entrada, exibe opções de preenchimento automático relevantes.

Para associações de teclas relacionadas à pesquisa reversa, consulte [`reverse-i-search`](/pt/nodejs/api/repl#reverse-i-search). Para todas as outras associações de teclas, consulte [Associações de teclas TTY](/pt/nodejs/api/readline#tty-keybindings).


### Avaliação padrão {#default-evaluation}

Por padrão, todas as instâncias de [`repl.REPLServer`](/pt/nodejs/api/repl#class-replserver) usam uma função de avaliação que avalia expressões JavaScript e fornece acesso aos módulos integrados do Node.js. Este comportamento padrão pode ser substituído passando uma função de avaliação alternativa quando a instância de [`repl.REPLServer`](/pt/nodejs/api/repl#class-replserver) é criada.

#### Expressões JavaScript {#javascript-expressions}

O avaliador padrão oferece suporte à avaliação direta de expressões JavaScript:

```bash [BASH]
> 1 + 1
2
> const m = 2
undefined
> m + 1
3
```
A menos que sejam escopadas dentro de blocos ou funções, as variáveis declaradas implicitamente ou usando as palavras-chave `const`, `let` ou `var` são declaradas no escopo global.

#### Escopo global e local {#global-and-local-scope}

O avaliador padrão fornece acesso a quaisquer variáveis que existam no escopo global. É possível expor uma variável ao REPL explicitamente atribuindo-a ao objeto `context` associado a cada `REPLServer`:

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

repl.start('> ').context.m = msg;
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

repl.start('> ').context.m = msg;
```
:::

As propriedades no objeto `context` aparecem como locais dentro do REPL:

```bash [BASH]
$ node repl_test.js
> m
'message'
```
As propriedades de contexto não são somente leitura por padrão. Para especificar globais somente leitura, as propriedades de contexto devem ser definidas usando `Object.defineProperty()`:

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```
:::

#### Acessando módulos principais do Node.js {#accessing-core-nodejs-modules}

O avaliador padrão carregará automaticamente os módulos principais do Node.js no ambiente REPL quando usado. Por exemplo, a menos que seja declarado de outra forma como uma variável global ou escopada, a entrada `fs` será avaliada sob demanda como `global.fs = require('node:fs')`.

```bash [BASH]
> fs.createReadStream('./some/file');
```

#### Exceções globais não capturadas {#global-uncaught-exceptions}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v12.3.0 | O evento `'uncaughtException'` é acionado a partir de agora se o repl for usado como um programa independente. |
:::

O REPL usa o módulo [`domain`](/pt/nodejs/api/domain) para capturar todas as exceções não capturadas para essa sessão REPL.

Este uso do módulo [`domain`](/pt/nodejs/api/domain) no REPL tem estes efeitos colaterais:

-  Exceções não capturadas apenas emitem o evento [`'uncaughtException'`](/pt/nodejs/api/process#event-uncaughtexception) no REPL independente. Adicionar um listener para este evento em um REPL dentro de outro programa Node.js resulta em [`ERR_INVALID_REPL_INPUT`](/pt/nodejs/api/errors#err_invalid_repl_input).
-  Tentar usar [`process.setUncaughtExceptionCaptureCallback()`](/pt/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) lança um erro [`ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE`](/pt/nodejs/api/errors#err_domain_cannot_set_uncaught_exception_capture).

#### Atribuição da variável `_` (underscore) {#assignment-of-the-_-underscore-variable}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v9.8.0 | Adicionado suporte para `_error`. |
:::

O avaliador padrão, por padrão, atribuirá o resultado da expressão avaliada mais recentemente à variável especial `_` (underscore). Definir explicitamente `_` para um valor desabilitará este comportamento.

```bash [BASH]
> [ 'a', 'b', 'c' ]
[ 'a', 'b', 'c' ]
> _.length
3
> _ += 1
Expression assignment to _ now disabled.
4
> 1 + 1
2
> _
4
```
Da mesma forma, `_error` se referirá ao último erro visto, se houver. Definir explicitamente `_error` para um valor desabilitará este comportamento.

```bash [BASH]
> throw new Error('foo');
Uncaught Error: foo
> _error.message
'foo'
```
#### Palavra-chave `await` {#await-keyword}

O suporte para a palavra-chave `await` é habilitado no nível superior.

```bash [BASH]
> await Promise.resolve(123)
123
> await Promise.reject(new Error('REPL await'))
Uncaught Error: REPL await
    at REPL2:1:54
> const timeout = util.promisify(setTimeout);
undefined
> const old = Date.now(); await timeout(1000); console.log(Date.now() - old);
1002
undefined
```
Uma limitação conhecida do uso da palavra-chave `await` no REPL é que ela invalidará o escopo léxico das palavras-chave `const` e `let`.

Por exemplo:

```bash [BASH]
> const m = await Promise.resolve(123)
undefined
> m
123
> const m = await Promise.resolve(234)
undefined
> m
234
```
[`--no-experimental-repl-await`](/pt/nodejs/api/cli#--no-experimental-repl-await) desabilitará o await de nível superior no REPL.


### Reverse-i-search {#reverse-i-search}

**Adicionado em: v13.6.0, v12.17.0**

O REPL suporta pesquisa inversa bidirecional semelhante ao [ZSH](https://en.wikipedia.org/wiki/Z_shell). É acionado com + para pesquisar para trás e + para pesquisar para frente.

Entradas de histórico duplicadas serão ignoradas.

As entradas são aceitas assim que qualquer tecla que não corresponda à pesquisa inversa é pressionada. O cancelamento é possível pressionando  ou +.

Mudar a direção pesquisa imediatamente pela próxima entrada na direção esperada a partir da posição atual.

### Funções de avaliação personalizadas {#custom-evaluation-functions}

Quando um novo [`repl.REPLServer`](/pt/nodejs/api/repl#class-replserver) é criado, uma função de avaliação personalizada pode ser fornecida. Isso pode ser usado, por exemplo, para implementar aplicativos REPL totalmente personalizados.

O exemplo a seguir ilustra um REPL que eleva um determinado número ao quadrado:

::: code-group
```js [ESM]
import repl from 'node:repl';

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Enter a number: ', eval: myEval });
```

```js [CJS]
const repl = require('node:repl');

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Enter a number: ', eval: myEval });
```
:::

#### Erros recuperáveis {#recoverable-errors}

No prompt REPL, pressionar  envia a linha de entrada atual para a função `eval`. Para dar suporte à entrada de várias linhas, a função `eval` pode retornar uma instância de `repl.Recoverable` para a função de retorno de chamada fornecida:

```js [ESM]
function myEval(cmd, context, filename, callback) {
  let result;
  try {
    result = vm.runInThisContext(cmd);
  } catch (e) {
    if (isRecoverableError(e)) {
      return callback(new repl.Recoverable(e));
    }
  }
  callback(null, result);
}

function isRecoverableError(error) {
  if (error.name === 'SyntaxError') {
    return /^(Unexpected end of input|Unexpected token)/.test(error.message);
  }
  return false;
}
```

### Personalizando a saída do REPL {#customizing-repl-output}

Por padrão, as instâncias de [`repl.REPLServer`](/pt/nodejs/api/repl#class-replserver) formatam a saída usando o método [`util.inspect()`](/pt/nodejs/api/util#utilinspectobject-options) antes de escrever a saída no stream `Writable` fornecido (`process.stdout` por padrão). A opção de inspeção `showProxy` é definida como true por padrão e a opção `colors` é definida como true dependendo da opção `useColors` do REPL.

A opção booleana `useColors` pode ser especificada na construção para instruir o gravador padrão a usar códigos de estilo ANSI para colorir a saída do método `util.inspect()`.

Se o REPL for executado como um programa independente, também é possível alterar os [padrões de inspeção](/pt/nodejs/api/util#utilinspectobject-options) do REPL de dentro do REPL usando a propriedade `inspect.replDefaults` que espelha o `defaultOptions` de [`util.inspect()`](/pt/nodejs/api/util#utilinspectobject-options).

```bash [BASH]
> util.inspect.replDefaults.compact = false;
false
> [1]
[
  1
]
>
```
Para personalizar totalmente a saída de uma instância [`repl.REPLServer`](/pt/nodejs/api/repl#class-replserver), passe uma nova função para a opção `writer` na construção. O exemplo a seguir, por exemplo, simplesmente converte qualquer texto de entrada em maiúsculas:



::: code-group
```js [ESM]
import repl from 'node:repl';

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```

```js [CJS]
const repl = require('node:repl');

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```
:::

## Classe: `REPLServer` {#class-replserver}

**Adicionado em: v0.1.91**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja [`repl.start()`](/pt/nodejs/api/repl#replstartoptions)
- Estende: [\<readline.Interface\>](/pt/nodejs/api/readline#class-readlineinterface)

As instâncias de `repl.REPLServer` são criadas usando o método [`repl.start()`](/pt/nodejs/api/repl#replstartoptions) ou diretamente usando a palavra-chave `new` do JavaScript.



::: code-group
```js [ESM]
import repl from 'node:repl';

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```

```js [CJS]
const repl = require('node:repl');

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```
:::


### Evento: `'exit'` {#event-exit}

**Adicionado em: v0.7.7**

O evento `'exit'` é emitido quando o REPL é encerrado ao receber o comando `.exit` como entrada, quando o usuário pressiona + duas vezes para sinalizar `SIGINT` ou ao pressionar + para sinalizar `'end'` no fluxo de entrada. O callback do listener é invocado sem nenhum argumento.

```js [ESM]
replServer.on('exit', () => {
  console.log('Recebido evento "exit" do repl!');
  process.exit();
});
```
### Evento: `'reset'` {#event-reset}

**Adicionado em: v0.11.0**

O evento `'reset'` é emitido quando o contexto do REPL é redefinido. Isso ocorre sempre que o comando `.clear` é recebido como entrada, *a menos que* o REPL esteja usando o avaliador padrão e a instância `repl.REPLServer` tenha sido criada com a opção `useGlobal` definida como `true`. O callback do listener será chamado com uma referência ao objeto `context` como o único argumento.

Isso pode ser usado principalmente para reinicializar o contexto REPL para algum estado pré-definido:

::: code-group
```js [ESM]
import repl from 'node:repl';

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```

```js [CJS]
const repl = require('node:repl');

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```
:::

Quando este código é executado, a variável global `'m'` pode ser modificada, mas depois redefinida para seu valor inicial usando o comando `.clear`:

```bash [BASH]
$ ./node example.js
> m
'test'
> m = 1
1
> m
1
> .clear
Clearing context...
> m
'test'
>
```
### `replServer.defineCommand(keyword, cmd)` {#replserverdefinecommandkeyword-cmd}

**Adicionado em: v0.3.0**

- `keyword` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A palavra-chave do comando (*sem* um caractere `.` inicial).
- `cmd` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função a ser invocada quando o comando for processado.

O método `replServer.defineCommand()` é usado para adicionar novos comandos com prefixo `.` à instância REPL. Tais comandos são invocados digitando um `.` seguido pela `keyword`. O `cmd` é uma `Function` ou um `Object` com as seguintes propriedades:

- `help` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Texto de ajuda a ser exibido quando `.help` for inserido (Opcional).
- `action` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função a ser executada, opcionalmente aceitando um único argumento string.

O exemplo a seguir mostra dois novos comandos adicionados à instância REPL:

::: code-group
```js [ESM]
import repl from 'node:repl';

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```

```js [CJS]
const repl = require('node:repl');

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```
:::

Os novos comandos podem então ser usados de dentro da instância REPL:

```bash [BASH]
> .sayhello Node.js User
Hello, Node.js User!
> .saybye
Goodbye!
```

### `replServer.displayPrompt([preserveCursor])` {#replserverdisplaypromptpreservecursor}

**Adicionado em: v0.1.91**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

O método `replServer.displayPrompt()` prepara a instância REPL para receber entrada do usuário, imprimindo o `prompt` configurado em uma nova linha na `output` e retomando a `input` para aceitar novas entradas.

Quando a entrada de várias linhas está sendo inserida, uma reticência é impressa em vez do 'prompt'.

Quando `preserveCursor` é `true`, o posicionamento do cursor não será redefinido para `0`.

O método `replServer.displayPrompt` destina-se principalmente a ser chamado de dentro da função de ação para comandos registrados usando o método `replServer.defineCommand()`.

### `replServer.clearBufferedCommand()` {#replserverclearbufferedcommand}

**Adicionado em: v9.0.0**

O método `replServer.clearBufferedCommand()` limpa qualquer comando que foi armazenado em buffer, mas ainda não foi executado. Este método destina-se principalmente a ser chamado de dentro da função de ação para comandos registrados usando o método `replServer.defineCommand()`.

### `replServer.setupHistory(historyPath, callback)` {#replserversetuphistoryhistorypath-callback}

**Adicionado em: v11.10.0**

- `historyPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) o caminho para o arquivo de histórico
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) chamado quando as gravações do histórico estão prontas ou em caso de erro
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `repl` [\<repl.REPLServer\>](/pt/nodejs/api/repl#class-replserver)
  
 

Inicializa um arquivo de log de histórico para a instância REPL. Ao executar o binário do Node.js e usar o REPL da linha de comando, um arquivo de histórico é inicializado por padrão. No entanto, este não é o caso ao criar um REPL programaticamente. Use este método para inicializar um arquivo de log de histórico ao trabalhar com instâncias REPL programaticamente.

## `repl.builtinModules` {#replbuiltinmodules}

**Adicionado em: v14.5.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Uma lista dos nomes de todos os módulos do Node.js, por exemplo, `'http'`.


## `repl.start([options])` {#replstartoptions}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.4.0, v12.17.0 | A opção `preview` agora está disponível. |
| v12.0.0 | A opção `terminal` agora segue a descrição padrão em todos os casos e `useColors` verifica `hasColors()` se disponível. |
| v10.0.0 | O `replMode` `REPL_MAGIC_MODE` foi removido. |
| v6.3.0 | A opção `breakEvalOnSigint` agora é suportada. |
| v5.8.0 | O parâmetro `options` agora é opcional. |
| v0.1.91 | Adicionado em: v0.1.91 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O prompt de entrada a ser exibido. **Padrão:** `'\> '` (com um espaço à direita).
    - `input` [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable) O stream `Readable` do qual a entrada REPL será lida. **Padrão:** `process.stdin`.
    - `output` [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable) O stream `Writable` no qual a saída REPL será gravada. **Padrão:** `process.stdout`.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, especifica que o `output` deve ser tratado como um terminal TTY. **Padrão:** verificar o valor da propriedade `isTTY` no stream `output` após a instanciação.
    - `eval` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função a ser usada ao avaliar cada linha de entrada fornecida. **Padrão:** um wrapper async para a função JavaScript `eval()`. Uma função `eval` pode retornar um erro com `repl.Recoverable` para indicar que a entrada estava incompleta e solicitar linhas adicionais.
    - `useColors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, especifica que a função `writer` padrão deve incluir estilo de cor ANSI na saída REPL. Se uma função `writer` personalizada for fornecida, isso não terá efeito. **Padrão:** verificar o suporte de cores no stream `output` se o valor `terminal` da instância REPL for `true`.
    - `useGlobal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, especifica que a função de avaliação padrão usará o JavaScript `global` como contexto, em vez de criar um novo contexto separado para a instância REPL. O REPL da CLI do Node define esse valor como `true`. **Padrão:** `false`.
    - `ignoreUndefined` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, especifica que o writer padrão não exibirá o valor de retorno de um comando se ele for avaliado como `undefined`. **Padrão:** `false`.
    - `writer` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função a ser invocada para formatar a saída de cada comando antes de gravar em `output`. **Padrão:** [`util.inspect()`](/pt/nodejs/api/util#utilinspectobject-options).
    - `completer` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função opcional usada para a auto-conclusão Tab personalizada. Veja [`readline.InterfaceCompleter`](/pt/nodejs/api/readline#use-of-the-completer-function) para um exemplo.
    - `replMode` [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Um flag que especifica se o avaliador padrão executa todos os comandos JavaScript no modo estrito ou no modo padrão (negligente). Os valores aceitáveis são:
    - `repl.REPL_MODE_SLOPPY` para avaliar expressões no modo negligente.
    - `repl.REPL_MODE_STRICT` para avaliar expressões no modo estrito. Isso é equivalente a prefixar cada instrução repl com `'use strict'`.

    - `breakEvalOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Pare de avaliar o trecho de código atual quando `SIGINT` for recebido, como quando + for pressionado. Isso não pode ser usado junto com uma função `eval` personalizada. **Padrão:** `false`.
    - `preview` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Define se o repl imprime autocompletar e visualizações de saída ou não. **Padrão:** `true` com a função eval padrão e `false` caso uma função eval personalizada seja usada. Se `terminal` for falso, não haverá visualizações e o valor de `preview` não terá efeito.

- Retorna: [\<repl.REPLServer\>](/pt/nodejs/api/repl#class-replserver)

O método `repl.start()` cria e inicia uma instância de [`repl.REPLServer`](/pt/nodejs/api/repl#class-replserver).

Se `options` for uma string, então ela especifica o prompt de entrada:

::: code-group
```js [ESM]
import repl from 'node:repl';

// um prompt no estilo Unix
repl.start('$ ');
```

```js [CJS]
const repl = require('node:repl');

// um prompt no estilo Unix
repl.start('$ ');
```
:::


## O REPL do Node.js {#the-nodejs-repl}

O próprio Node.js usa o módulo `node:repl` para fornecer sua própria interface interativa para executar JavaScript. Isso pode ser usado executando o binário do Node.js sem passar nenhum argumento (ou passando o argumento `-i`):

```bash [BASH]
$ node
> const a = [1, 2, 3];
undefined
> a
[ 1, 2, 3 ]
> a.forEach((v) => {
...   console.log(v);
...   });
1
2
3
```
### Opções de variáveis de ambiente {#environment-variable-options}

Vários comportamentos do REPL do Node.js podem ser personalizados usando as seguintes variáveis de ambiente:

- `NODE_REPL_HISTORY`: Quando um caminho válido é fornecido, o histórico persistente do REPL será salvo no arquivo especificado em vez de `.node_repl_history` no diretório pessoal do usuário. Definir este valor para `''` (uma string vazia) irá desativar o histórico persistente do REPL. Espaços em branco serão removidos do valor. Em plataformas Windows, variáveis de ambiente com valores vazios são inválidas, então defina esta variável para um ou mais espaços para desativar o histórico persistente do REPL.
- `NODE_REPL_HISTORY_SIZE`: Controla quantas linhas de histórico serão persistidas se o histórico estiver disponível. Deve ser um número positivo. **Padrão:** `1000`.
- `NODE_REPL_MODE`: Pode ser `'sloppy'` ou `'strict'`. **Padrão:** `'sloppy'`, que permitirá que o código do modo não estrito seja executado.

### Histórico persistente {#persistent-history}

Por padrão, o REPL do Node.js persistirá o histórico entre as sessões REPL `node` salvando as entradas em um arquivo `.node_repl_history` localizado no diretório pessoal do usuário. Isso pode ser desativado definindo a variável de ambiente `NODE_REPL_HISTORY=''`.

### Usando o REPL do Node.js com editores de linha avançados {#using-the-nodejs-repl-with-advanced-line-editors}

Para editores de linha avançados, inicie o Node.js com a variável de ambiente `NODE_NO_READLINE=1`. Isso iniciará o REPL principal e de depuração nas configurações de terminal canônicas, o que permitirá o uso com `rlwrap`.

Por exemplo, o seguinte pode ser adicionado a um arquivo `.bashrc`:

```bash [BASH]
alias node="env NODE_NO_READLINE=1 rlwrap node"
```
### Iniciando várias instâncias REPL em uma única instância em execução {#starting-multiple-repl-instances-against-a-single-running-instance}

É possível criar e executar várias instâncias REPL em uma única instância em execução do Node.js que compartilham um único objeto `global`, mas têm interfaces de E/S separadas.

O exemplo a seguir, por exemplo, fornece REPLs separados em `stdin`, um socket Unix e um socket TCP:

::: code-group
```js [ESM]
import net from 'node:net';
import repl from 'node:repl';
import process from 'node:process';

let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```

```js [CJS]
const net = require('node:net');
const repl = require('node:repl');
let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```
:::

Executar esta aplicação a partir da linha de comando iniciará um REPL em stdin. Outros clientes REPL podem se conectar através do socket Unix ou socket TCP. `telnet`, por exemplo, é útil para conectar-se a sockets TCP, enquanto `socat` pode ser usado para conectar-se a sockets Unix e TCP.

Ao iniciar um REPL a partir de um servidor baseado em socket Unix em vez de stdin, é possível conectar-se a um processo Node.js de longa duração sem reiniciá-lo.

Para um exemplo de execução de um REPL "completo" (`terminal`) sobre uma instância `net.Server` e `net.Socket`, consulte: [https://gist.github.com/TooTallNate/2209310](https://gist.github.com/TooTallNate/2209310).

Para um exemplo de execução de uma instância REPL sobre [`curl(1)`](https://curl.haxx.se/docs/manpage), consulte: [https://gist.github.com/TooTallNate/2053342](https://gist.github.com/TooTallNate/2053342).

Este exemplo destina-se puramente a fins educacionais para demonstrar como os REPLs do Node.js podem ser iniciados usando diferentes fluxos de E/S. Ele **não** deve ser usado em ambientes de produção ou em qualquer contexto onde a segurança seja uma preocupação sem medidas de proteção adicionais. Se você precisar implementar REPLs em uma aplicação do mundo real, considere abordagens alternativas que mitiguem esses riscos, como o uso de mecanismos de entrada seguros e evitar interfaces de rede abertas.

