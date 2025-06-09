---
title: Documentação do Node.js - Erros
description: Esta seção da documentação do Node.js fornece detalhes abrangentes sobre o tratamento de erros, incluindo classes de erros, códigos de erro e como lidar com erros em aplicações Node.js.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Erros | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta seção da documentação do Node.js fornece detalhes abrangentes sobre o tratamento de erros, incluindo classes de erros, códigos de erro e como lidar com erros em aplicações Node.js.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Erros | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta seção da documentação do Node.js fornece detalhes abrangentes sobre o tratamento de erros, incluindo classes de erros, códigos de erro e como lidar com erros em aplicações Node.js.
---


# Erros {#errors}

Aplicações em execução no Node.js geralmente experimentarão quatro categorias de erros:

- Erros padrão do JavaScript, como [\<EvalError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError), [\<SyntaxError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError), [\<RangeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError), [\<ReferenceError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError), [\<TypeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) e [\<URIError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError).
- Erros de sistema acionados por restrições do sistema operacional subjacente, como tentar abrir um arquivo que não existe ou tentar enviar dados por um socket fechado.
- Erros especificados pelo usuário acionados pelo código do aplicativo.
- `AssertionError`s são uma classe especial de erro que pode ser acionada quando o Node.js detecta uma violação lógica excepcional que nunca deveria ocorrer. Estes são levantados tipicamente pelo módulo `node:assert`.

Todos os erros de JavaScript e de sistema levantados pelo Node.js herdam de, ou são instâncias de, a classe padrão do JavaScript [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) e têm a garantia de fornecer *pelo menos* as propriedades disponíveis nessa classe.

## Propagação e interceptação de erros {#error-propagation-and-interception}

O Node.js suporta vários mecanismos para propagar e manipular erros que ocorrem enquanto uma aplicação está em execução. Como esses erros são relatados e tratados depende inteiramente do tipo de `Error` e do estilo da API que é chamada.

Todos os erros de JavaScript são tratados como exceções que *imediatamente* geram e lançam um erro usando o mecanismo padrão `throw` do JavaScript. Estes são tratados usando a construção [`try…catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) fornecida pela linguagem JavaScript.

```js [ESM]
// Lança com um ReferenceError porque z não está definido.
try {
  const m = 1;
  const n = m + z;
} catch (err) {
  // Manipula o erro aqui.
}
```
Qualquer uso do mecanismo `throw` do JavaScript levantará uma exceção que *deve* ser tratada ou o processo do Node.js sairá imediatamente.

Com poucas exceções, APIs *Síncronas* (qualquer método de bloqueio que não retorna um [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) nem aceita uma função `callback`, como [`fs.readFileSync`](/pt/nodejs/api/fs#fsreadfilesyncpath-options)), usarão `throw` para relatar erros.

Erros que ocorrem dentro de *APIs Assíncronas* podem ser relatados de várias maneiras:

- Alguns métodos assíncronos retornam um [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), você deve sempre levar em conta que ele pode ser rejeitado. Veja o flag [`--unhandled-rejections`](/pt/nodejs/api/cli#--unhandled-rejectionsmode) para saber como o processo reagirá a uma rejeição de promise não tratada.
- A maioria dos métodos assíncronos que aceitam uma função `callback` aceitarão um objeto `Error` passado como o primeiro argumento para essa função. Se esse primeiro argumento não for `null` e for uma instância de `Error`, então ocorreu um erro que deve ser tratado.
- Quando um método assíncrono é chamado em um objeto que é um [`EventEmitter`](/pt/nodejs/api/events#class-eventemitter), os erros podem ser encaminhados para o evento `'error'` desse objeto.
- Um punhado de métodos tipicamente assíncronos na API do Node.js ainda pode usar o mecanismo `throw` para levantar exceções que devem ser tratadas usando `try…catch`. Não há uma lista abrangente de tais métodos; por favor, consulte a documentação de cada método para determinar o mecanismo de tratamento de erros apropriado necessário.

O uso do mecanismo de evento `'error'` é mais comum para APIs baseadas em [stream](/pt/nodejs/api/stream) e [baseadas em emissor de eventos](/pt/nodejs/api/events#class-eventemitter), que em si representam uma série de operações assíncronas ao longo do tempo (em vez de uma única operação que pode passar ou falhar).

Para *todos* os objetos [`EventEmitter`](/pt/nodejs/api/events#class-eventemitter), se um manipulador de evento `'error'` não for fornecido, o erro será lançado, fazendo com que o processo do Node.js relate uma exceção não capturada e falhe, a menos que: um manipulador tenha sido registrado para o evento [`'uncaughtException'`](/pt/nodejs/api/process#event-uncaughtexception), ou o módulo obsoleto [`node:domain`](/pt/nodejs/api/domain) seja usado.

```js [ESM]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

setImmediate(() => {
  // Isso irá travar o processo porque nenhum manipulador de evento 'error'
  // foi adicionado.
  ee.emit('error', new Error('This will crash'));
});
```
Erros gerados desta forma *não podem* ser interceptados usando `try…catch`, pois são lançados *depois* que o código de chamada já saiu.

Os desenvolvedores devem consultar a documentação de cada método para determinar exatamente como os erros levantados por esses métodos são propagados.


## Classe: `Error` {#class-error}

Um objeto JavaScript [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) genérico que não denota nenhuma circunstância específica do porquê do erro ter ocorrido. Os objetos `Error` capturam um "rastreamento de pilha" detalhando o ponto no código em que o `Error` foi instanciado e podem fornecer uma descrição textual do erro.

Todos os erros gerados pelo Node.js, incluindo todos os erros de sistema e JavaScript, serão instâncias de ou herdarão da classe `Error`.

### `new Error(message[, options])` {#new-errormessage-options}

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cause` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O erro que causou o erro recém-criado.

Cria um novo objeto `Error` e define a propriedade `error.message` para a mensagem de texto fornecida. Se um objeto for passado como `message`, a mensagem de texto será gerada chamando `String(message)`. Se a opção `cause` for fornecida, ela será atribuída à propriedade `error.cause`. A propriedade `error.stack` representará o ponto no código em que `new Error()` foi chamado. Os rastreamentos de pilha dependem da [API de rastreamento de pilha do V8](https://v8.dev/docs/stack-trace-api). Os rastreamentos de pilha se estendem apenas até (a) o início da *execução síncrona do código* ou (b) o número de quadros fornecido pela propriedade `Error.stackTraceLimit`, o que for menor.

### `Error.captureStackTrace(targetObject[, constructorOpt])` {#errorcapturestacktracetargetobject-constructoropt}

- `targetObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `constructorOpt` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Cria uma propriedade `.stack` em `targetObject`, que, quando acessada, retorna uma string representando o local no código em que `Error.captureStackTrace()` foi chamado.

```js [ESM]
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Semelhante a `new Error().stack`
```
A primeira linha do rastreamento será prefixada com `${myObject.name}: ${myObject.message}`.

O argumento opcional `constructorOpt` aceita uma função. Se fornecido, todos os quadros acima de `constructorOpt`, incluindo `constructorOpt`, serão omitidos do rastreamento de pilha gerado.

O argumento `constructorOpt` é útil para ocultar os detalhes de implementação da geração de erros do usuário. Por exemplo:

```js [ESM]
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Crie um erro sem rastreamento de pilha para evitar calcular o rastreamento de pilha duas vezes.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture o rastreamento de pilha acima da função b
  Error.captureStackTrace(error, b); // Nem a função c nem b estão incluídas no rastreamento de pilha
  throw error;
}

a();
```

### `Error.stackTraceLimit` {#errorstacktracelimit}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A propriedade `Error.stackTraceLimit` especifica o número de quadros de pilha coletados por um rastreamento de pilha (seja gerado por `new Error().stack` ou `Error.captureStackTrace(obj)`).

O valor padrão é `10`, mas pode ser definido para qualquer número JavaScript válido. As alterações afetarão qualquer rastreamento de pilha capturado *após* a alteração do valor.

Se definido como um valor não numérico ou definido como um número negativo, os rastreamentos de pilha não capturarão nenhum quadro.

### `error.cause` {#errorcause}

**Adicionado em: v16.9.0**

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Se presente, a propriedade `error.cause` é a causa subjacente do `Error`. É usado ao capturar um erro e lançar um novo com uma mensagem ou código diferente para ainda ter acesso ao erro original.

A propriedade `error.cause` é normalmente definida chamando `new Error(message, { cause })`. Não é definido pelo construtor se a opção `cause` não for fornecida.

Esta propriedade permite que os erros sejam encadeados. Ao serializar objetos `Error`, [`util.inspect()`](/pt/nodejs/api/util#utilinspectobject-options) serializa recursivamente `error.cause` se estiver definido.

```js [ESM]
const cause = new Error('O servidor HTTP remoto respondeu com um status 500');
const symptom = new Error('A mensagem não foi enviada', { cause });

console.log(symptom);
// Prints:
//   Error: A mensagem não foi enviada
//       at REPL2:1:17
//       at Script.runInThisContext (node:vm:130:12)
//       ... 7 lines matching cause stack trace ...
//       at [_line] [as _line] (node:internal/readline/interface:886:18) {
//     [cause]: Error: O servidor HTTP remoto respondeu com um status 500
//         at REPL1:1:15
//         at Script.runInThisContext (node:vm:130:12)
//         at REPLServer.defaultEval (node:repl:574:29)
//         at bound (node:domain:426:15)
//         at REPLServer.runBound [as eval] (node:domain:437:12)
//         at REPLServer.onLine (node:repl:902:10)
//         at REPLServer.emit (node:events:549:35)
//         at REPLServer.emit (node:domain:482:12)
//         at [_onLine] [as _onLine] (node:internal/readline/interface:425:12)
//         at [_line] [as _line] (node:internal/readline/interface:886:18)
```

### `error.code` {#errorcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade `error.code` é um rótulo de string que identifica o tipo de erro. `error.code` é a maneira mais estável de identificar um erro. Ele só mudará entre as versões principais do Node.js. Em contraste, as strings `error.message` podem mudar entre quaisquer versões do Node.js. Veja [códigos de erro do Node.js](/pt/nodejs/api/errors#nodejs-error-codes) para detalhes sobre códigos específicos.

### `error.message` {#errormessage}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade `error.message` é a descrição em string do erro conforme definido chamando `new Error(message)`. A `message` passada para o construtor também aparecerá na primeira linha do rastreamento de pilha do `Error`, no entanto, alterar esta propriedade após a criação do objeto `Error` *pode não* alterar a primeira linha do rastreamento de pilha (por exemplo, quando `error.stack` é lido antes que esta propriedade seja alterada).

```js [ESM]
const err = new Error('The message');
console.error(err.message);
// Prints: The message
```
### `error.stack` {#errorstack}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade `error.stack` é uma string que descreve o ponto no código em que o `Error` foi instanciado.

```bash [BASH]
Error: Things keep happening!
   at /home/gbusey/file.js:525:2
   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
   at increaseSynergy (/home/gbusey/actors.js:701:6)
```
A primeira linha é formatada como `\<nome da classe de erro\>: \<mensagem de erro\>`, e é seguida por uma série de quadros de pilha (cada linha começando com "at "). Cada quadro descreve um local de chamada dentro do código que levou à geração do erro. O V8 tenta exibir um nome para cada função (por nome de variável, nome de função ou nome de método de objeto), mas ocasionalmente não consegue encontrar um nome adequado. Se o V8 não conseguir determinar um nome para a função, apenas informações de localização serão exibidas para esse quadro. Caso contrário, o nome da função determinado será exibido com informações de localização anexadas entre parênteses.

Os quadros são gerados apenas para funções JavaScript. Se, por exemplo, a execução passar de forma síncrona por meio de uma função de complemento C++ chamada `cheetahify` que ela própria chama uma função JavaScript, o quadro que representa a chamada `cheetahify` não estará presente nos rastreamentos de pilha:

```js [ESM]
const cheetahify = require('./native-binding.node');

function makeFaster() {
  // `cheetahify()` chama *sincronamente* speedy.
  cheetahify(function speedy() {
    throw new Error('oh no!');
  });
}

makeFaster();
// will throw:
//   /home/gbusey/file.js:6
//       throw new Error('oh no!');
//           ^
//   Error: oh no!
//       at speedy (/home/gbusey/file.js:6:11)
//       at makeFaster (/home/gbusey/file.js:5:3)
//       at Object.<anonymous> (/home/gbusey/file.js:10:1)
//       at Module._compile (module.js:456:26)
//       at Object.Module._extensions..js (module.js:474:10)
//       at Module.load (module.js:356:32)
//       at Function.Module._load (module.js:312:12)
//       at Function.Module.runMain (module.js:497:10)
//       at startup (node.js:119:16)
//       at node.js:906:3
```
As informações de localização serão uma das seguintes:

- `native`, se o quadro representar uma chamada interna ao V8 (como em `[].forEach`).
- `plain-filename.js:line:column`, se o quadro representar uma chamada interna ao Node.js.
- `/absolute/path/to/file.js:line:column`, se o quadro representar uma chamada em um programa de usuário (usando o sistema de módulos CommonJS) ou suas dependências.
- `\<transport-protocol\>:///url/to/module/file.mjs:line:column`, se o quadro representar uma chamada em um programa de usuário (usando o sistema de módulos ES) ou suas dependências.

A string que representa o rastreamento de pilha é gerada preguiçosamente quando a propriedade `error.stack` é **acessada**.

O número de quadros capturados pelo rastreamento de pilha é limitado pelo menor entre `Error.stackTraceLimit` ou o número de quadros disponíveis no tick atual do loop de eventos.


## Classe: `AssertionError` {#class-assertionerror}

- Estende: [\<errors.Error\>](/pt/nodejs/api/errors#class-error)

Indica a falha de uma asserção. Para detalhes, veja [`Classe: assert.AssertionError`](/pt/nodejs/api/assert#class-assertassertionerror).

## Classe: `RangeError` {#class-rangeerror}

- Estende: [\<errors.Error\>](/pt/nodejs/api/errors#class-error)

Indica que um argumento fornecido não estava dentro do conjunto ou intervalo de valores aceitáveis para uma função; seja um intervalo numérico ou fora do conjunto de opções para um determinado parâmetro de função.

```js [ESM]
require('node:net').connect(-1);
// Lança "RangeError: "port" option should be >= 0 and < 65536: -1"
```
Node.js irá gerar e lançar instâncias de `RangeError` *imediatamente* como uma forma de validação de argumentos.

## Classe: `ReferenceError` {#class-referenceerror}

- Estende: [\<errors.Error\>](/pt/nodejs/api/errors#class-error)

Indica que está sendo feita uma tentativa de acessar uma variável que não está definida. Esses erros geralmente indicam erros de digitação no código ou um programa quebrado.

Embora o código do cliente possa gerar e propagar esses erros, na prática, apenas o V8 o fará.

```js [ESM]
doesNotExist;
// Lança ReferenceError, doesNotExist não é uma variável neste programa.
```
A menos que um aplicativo esteja gerando e executando código dinamicamente, as instâncias de `ReferenceError` indicam um bug no código ou em suas dependências.

## Classe: `SyntaxError` {#class-syntaxerror}

- Estende: [\<errors.Error\>](/pt/nodejs/api/errors#class-error)

Indica que um programa não é JavaScript válido. Esses erros só podem ser gerados e propagados como resultado da avaliação do código. A avaliação do código pode acontecer como resultado de `eval`, `Function`, `require` ou [vm](/pt/nodejs/api/vm). Esses erros são quase sempre indicativos de um programa quebrado.

```js [ESM]
try {
  require('node:vm').runInThisContext('binary ! isNotOk');
} catch (err) {
  // 'err' será um SyntaxError.
}
```
As instâncias de `SyntaxError` são irrecuperáveis no contexto que as criou – elas só podem ser capturadas por outros contextos.

## Classe: `SystemError` {#class-systemerror}

- Estende: [\<errors.Error\>](/pt/nodejs/api/errors#class-error)

Node.js gera erros de sistema quando ocorrem exceções em seu ambiente de tempo de execução. Isso geralmente ocorre quando um aplicativo viola uma restrição do sistema operacional. Por exemplo, um erro de sistema ocorrerá se um aplicativo tentar ler um arquivo que não existe.

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se presente, o endereço para o qual uma conexão de rede falhou
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O código de erro string
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se presente, o caminho do arquivo de destino ao relatar um erro do sistema de arquivos
- `errno` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de erro fornecido pelo sistema
- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se presente, detalhes extras sobre a condição de erro
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma descrição legível por humanos do erro fornecida pelo sistema
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se presente, o caminho do arquivo ao relatar um erro do sistema de arquivos
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se presente, a porta de conexão de rede que não está disponível
- `syscall` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome da chamada de sistema que acionou o erro


### `error.address` {#erroraddress}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Se presente, `error.address` é uma string que descreve o endereço para o qual uma conexão de rede falhou.

### `error.code` {#errorcode_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade `error.code` é uma string que representa o código de erro.

### `error.dest` {#errordest}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Se presente, `error.dest` é o caminho do arquivo de destino ao relatar um erro do sistema de arquivos.

### `error.errno` {#errorerrno}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A propriedade `error.errno` é um número negativo que corresponde ao código de erro definido em [`libuv Error handling`](https://docs.libuv.org/en/v1.x/errors).

No Windows, o número de erro fornecido pelo sistema será normalizado pelo libuv.

Para obter a representação de string do código de erro, use [`util.getSystemErrorName(error.errno)`](/pt/nodejs/api/util#utilgetsystemerrornameerr).

### `error.info` {#errorinfo}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se presente, `error.info` é um objeto com detalhes sobre a condição de erro.

### `error.message` {#errormessage_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.message` é uma descrição legível por humanos do erro fornecida pelo sistema.

### `error.path` {#errorpath}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Se presente, `error.path` é uma string contendo um nome de caminho inválido relevante.

### `error.port` {#errorport}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Se presente, `error.port` é a porta de conexão de rede que não está disponível.

### `error.syscall` {#errorsyscall}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade `error.syscall` é uma string que descreve a [syscall](https://man7.org/linux/man-pages/man2/syscalls.2) que falhou.


### Erros comuns do sistema {#common-system-errors}

Esta é uma lista de erros de sistema comumente encontrados ao escrever um programa Node.js. Para uma lista abrangente, consulte a [`página man errno(3)`](https://man7.org/linux/man-pages/man3/errno.3).

-  `EACCES` (Permissão negada): Foi feita uma tentativa de acessar um arquivo de uma forma proibida por suas permissões de acesso ao arquivo.
-  `EADDRINUSE` (Endereço já em uso): Uma tentativa de vincular um servidor ([`net`](/pt/nodejs/api/net), [`http`](/pt/nodejs/api/http) ou [`https`](/pt/nodejs/api/https)) a um endereço local falhou devido a outro servidor no sistema local já estar ocupando esse endereço.
-  `ECONNREFUSED` (Conexão recusada): Nenhuma conexão pôde ser feita porque a máquina de destino a recusou ativamente. Isso geralmente resulta da tentativa de conectar a um serviço que está inativo no host estrangeiro.
-  `ECONNRESET` (Conexão redefinida pelo par): Uma conexão foi fechada à força por um par. Isso normalmente resulta de uma perda de conexão no socket remoto devido a um tempo limite ou reinicialização. Comumente encontrado através dos módulos [`http`](/pt/nodejs/api/http) e [`net`](/pt/nodejs/api/net).
-  `EEXIST` (Arquivo existe): Um arquivo existente era o alvo de uma operação que exigia que o alvo não existisse.
-  `EISDIR` (É um diretório): Uma operação esperava um arquivo, mas o nome do caminho fornecido era um diretório.
-  `EMFILE` (Muitos arquivos abertos no sistema): O número máximo de [descritores de arquivo](https://en.wikipedia.org/wiki/File_descriptor) permitido no sistema foi atingido e as solicitações para outro descritor não podem ser atendidas até que pelo menos um tenha sido fechado. Isso é encontrado ao abrir muitos arquivos ao mesmo tempo em paralelo, especialmente em sistemas (em particular, macOS) onde há um limite baixo de descritores de arquivo para processos. Para remediar um limite baixo, execute `ulimit -n 2048` no mesmo shell que executará o processo Node.js.
-  `ENOENT` (Nenhum arquivo ou diretório): Comumente levantado por operações [`fs`](/pt/nodejs/api/fs) para indicar que um componente do nome do caminho especificado não existe. Nenhuma entidade (arquivo ou diretório) pôde ser encontrada pelo caminho fornecido.
-  `ENOTDIR` (Não é um diretório): Um componente do nome do caminho fornecido existia, mas não era um diretório como esperado. Comumente levantado por [`fs.readdir`](/pt/nodejs/api/fs#fsreaddirpath-options-callback).
-  `ENOTEMPTY` (Diretório não vazio): Um diretório com entradas era o alvo de uma operação que exige um diretório vazio, geralmente [`fs.unlink`](/pt/nodejs/api/fs#fsunlinkpath-callback).
-  `ENOTFOUND` (Falha na pesquisa de DNS): Indica uma falha de DNS de `EAI_NODATA` ou `EAI_NONAME`. Este não é um erro POSIX padrão.
-  `EPERM` (Operação não permitida): Foi feita uma tentativa de realizar uma operação que exige privilégios elevados.
-  `EPIPE` (Broken pipe): Uma escrita em um pipe, socket ou FIFO para o qual não há processo para ler os dados. Comumente encontrado nas camadas [`net`](/pt/nodejs/api/net) e [`http`](/pt/nodejs/api/http), indicativo de que o lado remoto do stream que está sendo gravado foi fechado.
-  `ETIMEDOUT` (Tempo limite da operação): Uma solicitação de conexão ou envio falhou porque a parte conectada não respondeu adequadamente após um período de tempo. Geralmente encontrado por [`http`](/pt/nodejs/api/http) ou [`net`](/pt/nodejs/api/net). Frequentemente, um sinal de que um `socket.end()` não foi chamado corretamente.


## Classe: `TypeError` {#class-typeerror}

- Estende [\<errors.Error\>](/pt/nodejs/api/errors#class-error)

Indica que um argumento fornecido não é um tipo permitido. Por exemplo, passar uma função para um parâmetro que espera uma string geraria um `TypeError`.

```js [ESM]
require('node:url').parse(() => { });
// Lança TypeError, pois esperava uma string.
```
O Node.js irá gerar e lançar instâncias de `TypeError` *imediatamente* como uma forma de validação de argumento.

## Exceções vs. erros {#exceptions-vs-errors}

Uma exceção JavaScript é um valor que é lançado como resultado de uma operação inválida ou como o alvo de uma declaração `throw`. Embora não seja obrigatório que esses valores sejam instâncias de `Error` ou classes que herdam de `Error`, todas as exceções lançadas pelo Node.js ou pelo tempo de execução do JavaScript *serão* instâncias de `Error`.

Algumas exceções são *irrecuperáveis* na camada JavaScript. Tais exceções *sempre* farão com que o processo Node.js falhe. Exemplos incluem verificações `assert()` ou chamadas `abort()` na camada C++.

## Erros OpenSSL {#openssl-errors}

Erros originários em `crypto` ou `tls` são da classe `Error` e, além das propriedades padrão `.code` e `.message`, podem ter algumas propriedades adicionais específicas do OpenSSL.

### `error.opensslErrorStack` {#erroropensslerrorstack}

Um array de erros que pode fornecer contexto sobre onde na biblioteca OpenSSL um erro se origina.

### `error.function` {#errorfunction}

A função OpenSSL em que o erro se origina.

### `error.library` {#errorlibrary}

A biblioteca OpenSSL em que o erro se origina.

### `error.reason` {#errorreason}

Uma string legível descrevendo o motivo do erro.

## Códigos de erro do Node.js {#nodejs-error-codes}

### `ABORT_ERR` {#abort_err}

**Adicionado em: v15.0.0**

Usado quando uma operação foi abortada (normalmente usando um `AbortController`).

APIs que *não* usam `AbortSignal`s normalmente não levantam um erro com este código.

Este código não usa a convenção regular `ERR_*` que os erros do Node.js usam para ser compatível com o `AbortError` da plataforma web.

### `ERR_ACCESS_DENIED` {#err_access_denied}

Um tipo especial de erro que é acionado sempre que o Node.js tenta obter acesso a um recurso restrito pelo [Modelo de Permissões](/pt/nodejs/api/permissions#permission-model).


### `ERR_AMBIGUOUS_ARGUMENT` {#err_ambiguous_argument}

Um argumento de função está sendo usado de uma forma que sugere que a assinatura da função pode ser mal compreendida. Isso é lançado pelo módulo `node:assert` quando o parâmetro `message` em `assert.throws(block, message)` corresponde à mensagem de erro lançada por `block` porque esse uso sugere que o usuário acredita que `message` é a mensagem esperada em vez da mensagem que `AssertionError` exibirá se `block` não lançar.

### `ERR_ARG_NOT_ITERABLE` {#err_arg_not_iterable}

Um argumento iterável (ou seja, um valor que funciona com loops `for...of`) foi exigido, mas não fornecido a uma API do Node.js.

### `ERR_ASSERTION` {#err_assertion}

Um tipo especial de erro que pode ser acionado sempre que o Node.js detecta uma violação de lógica excepcional que nunca deve ocorrer. Estes são levantados normalmente pelo módulo `node:assert`.

### `ERR_ASYNC_CALLBACK` {#err_async_callback}

Foi feita uma tentativa de registrar algo que não é uma função como um callback de `AsyncHooks`.

### `ERR_ASYNC_TYPE` {#err_async_type}

O tipo de um recurso assíncrono era inválido. Os usuários também podem definir seus próprios tipos se estiverem usando a API pública do incorporador.

### `ERR_BROTLI_COMPRESSION_FAILED` {#err_brotli_compression_failed}

Os dados passados para um stream Brotli não foram compactados com sucesso.

### `ERR_BROTLI_INVALID_PARAM` {#err_brotli_invalid_param}

Uma chave de parâmetro inválida foi passada durante a construção de um stream Brotli.

### `ERR_BUFFER_CONTEXT_NOT_AVAILABLE` {#err_buffer_context_not_available}

Foi feita uma tentativa de criar uma instância de `Buffer` do Node.js a partir de código de addon ou incorporador, enquanto em um Contexto de engine JS que não está associado a uma instância do Node.js. Os dados passados para o método `Buffer` terão sido liberados no momento em que o método retornar.

Ao encontrar este erro, uma possível alternativa para criar uma instância de `Buffer` é criar um `Uint8Array` normal, que difere apenas no protótipo do objeto resultante. `Uint8Array`s são geralmente aceitos em todas as APIs principais do Node.js onde `Buffer`s são; eles estão disponíveis em todos os Contextos.

### `ERR_BUFFER_OUT_OF_BOUNDS` {#err_buffer_out_of_bounds}

Uma operação fora dos limites de um `Buffer` foi tentada.

### `ERR_BUFFER_TOO_LARGE` {#err_buffer_too_large}

Uma tentativa foi feita para criar um `Buffer` maior que o tamanho máximo permitido.


### `ERR_CANNOT_WATCH_SIGINT` {#err_cannot_watch_sigint}

O Node.js não conseguiu monitorar o sinal `SIGINT`.

### `ERR_CHILD_CLOSED_BEFORE_REPLY` {#err_child_closed_before_reply}

Um processo filho foi fechado antes que o pai recebesse uma resposta.

### `ERR_CHILD_PROCESS_IPC_REQUIRED` {#err_child_process_ipc_required}

Usado quando um processo filho está sendo bifurcado sem especificar um canal IPC.

### `ERR_CHILD_PROCESS_STDIO_MAXBUFFER` {#err_child_process_stdio_maxbuffer}

Usado quando o processo principal está tentando ler dados do STDERR/STDOUT do processo filho, e o comprimento dos dados é maior que a opção `maxBuffer`.

### `ERR_CLOSED_MESSAGE_PORT` {#err_closed_message_port}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.2.0, v14.17.1 | A mensagem de erro foi reintroduzida. |
| v11.12.0 | A mensagem de erro foi removida. |
| v10.5.0 | Adicionado em: v10.5.0 |
:::

Houve uma tentativa de usar uma instância de `MessagePort` em um estado fechado, geralmente após `.close()` ter sido chamado.

### `ERR_CONSOLE_WRITABLE_STREAM` {#err_console_writable_stream}

`Console` foi instanciado sem stream `stdout`, ou `Console` tem um stream `stdout` ou `stderr` não gravável.

### `ERR_CONSTRUCT_CALL_INVALID` {#err_construct_call_invalid}

**Adicionado em: v12.5.0**

Um construtor de classe foi chamado que não é chamável.

### `ERR_CONSTRUCT_CALL_REQUIRED` {#err_construct_call_required}

Um construtor para uma classe foi chamado sem `new`.

### `ERR_CONTEXT_NOT_INITIALIZED` {#err_context_not_initialized}

O contexto vm passado para a API ainda não foi inicializado. Isso pode acontecer quando ocorre um erro (e é capturado) durante a criação do contexto, por exemplo, quando a alocação falha ou o tamanho máximo da pilha de chamadas é atingido quando o contexto é criado.

### `ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED` {#err_crypto_custom_engine_not_supported}

Um mecanismo OpenSSL foi solicitado (por exemplo, através das opções TLS `clientCertEngine` ou `privateKeyEngine`) que não é suportado pela versão do OpenSSL que está sendo usada, provavelmente devido ao sinalizador de tempo de compilação `OPENSSL_NO_ENGINE`.

### `ERR_CRYPTO_ECDH_INVALID_FORMAT` {#err_crypto_ecdh_invalid_format}

Um valor inválido para o argumento `format` foi passado para o método `getPublicKey()` da classe `crypto.ECDH()`.

### `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` {#err_crypto_ecdh_invalid_public_key}

Um valor inválido para o argumento `key` foi passado para o método `computeSecret()` da classe `crypto.ECDH()`. Isso significa que a chave pública está fora da curva elíptica.


### `ERR_CRYPTO_ENGINE_UNKNOWN` {#err_crypto_engine_unknown}

Um identificador de mecanismo criptográfico inválido foi passado para [`require('node:crypto').setEngine()`](/pt/nodejs/api/crypto#cryptosetengineengine-flags).

### `ERR_CRYPTO_FIPS_FORCED` {#err_crypto_fips_forced}

O argumento de linha de comando [`--force-fips`](/pt/nodejs/api/cli#--force-fips) foi usado, mas houve uma tentativa de habilitar ou desabilitar o modo FIPS no módulo `node:crypto`.

### `ERR_CRYPTO_FIPS_UNAVAILABLE` {#err_crypto_fips_unavailable}

Foi feita uma tentativa de habilitar ou desabilitar o modo FIPS, mas o modo FIPS não estava disponível.

### `ERR_CRYPTO_HASH_FINALIZED` {#err_crypto_hash_finalized}

[`hash.digest()`](/pt/nodejs/api/crypto#hashdigestencoding) foi chamado várias vezes. O método `hash.digest()` deve ser chamado no máximo uma vez por instância de um objeto `Hash`.

### `ERR_CRYPTO_HASH_UPDATE_FAILED` {#err_crypto_hash_update_failed}

[`hash.update()`](/pt/nodejs/api/crypto#hashupdatedata-inputencoding) falhou por algum motivo. Isso raramente, ou nunca, deve acontecer.

### `ERR_CRYPTO_INCOMPATIBLE_KEY` {#err_crypto_incompatible_key}

As chaves criptográficas fornecidas são incompatíveis com a operação tentada.

### `ERR_CRYPTO_INCOMPATIBLE_KEY_OPTIONS` {#err_crypto_incompatible_key_options}

A codificação de chave pública ou privada selecionada é incompatível com outras opções.

### `ERR_CRYPTO_INITIALIZATION_FAILED` {#err_crypto_initialization_failed}

**Adicionado em: v15.0.0**

A inicialização do subsistema criptográfico falhou.

### `ERR_CRYPTO_INVALID_AUTH_TAG` {#err_crypto_invalid_auth_tag}

**Adicionado em: v15.0.0**

Uma tag de autenticação inválida foi fornecida.

### `ERR_CRYPTO_INVALID_COUNTER` {#err_crypto_invalid_counter}

**Adicionado em: v15.0.0**

Um contador inválido foi fornecido para uma cifra de modo contador.

### `ERR_CRYPTO_INVALID_CURVE` {#err_crypto_invalid_curve}

**Adicionado em: v15.0.0**

Uma curva elíptica inválida foi fornecida.

### `ERR_CRYPTO_INVALID_DIGEST` {#err_crypto_invalid_digest}

Um [algoritmo de digest criptográfico](/pt/nodejs/api/crypto#cryptogethashes) inválido foi especificado.

### `ERR_CRYPTO_INVALID_IV` {#err_crypto_invalid_iv}

**Adicionado em: v15.0.0**

Um vetor de inicialização inválido foi fornecido.

### `ERR_CRYPTO_INVALID_JWK` {#err_crypto_invalid_jwk}

**Adicionado em: v15.0.0**

Uma JSON Web Key inválida foi fornecida.

### `ERR_CRYPTO_INVALID_KEYLEN` {#err_crypto_invalid_keylen}

**Adicionado em: v15.0.0**

Um comprimento de chave inválido foi fornecido.

### `ERR_CRYPTO_INVALID_KEYPAIR` {#err_crypto_invalid_keypair}

**Adicionado em: v15.0.0**

Um par de chaves inválido foi fornecido.

### `ERR_CRYPTO_INVALID_KEYTYPE` {#err_crypto_invalid_keytype}

**Adicionado em: v15.0.0**

Um tipo de chave inválido foi fornecido.


### `ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE` {#err_crypto_invalid_key_object_type}

O tipo do objeto de chave criptográfica fornecido é inválido para a operação tentada.

### `ERR_CRYPTO_INVALID_MESSAGELEN` {#err_crypto_invalid_messagelen}

**Adicionado em: v15.0.0**

Um comprimento de mensagem inválido foi fornecido.

### `ERR_CRYPTO_INVALID_SCRYPT_PARAMS` {#err_crypto_invalid_scrypt_params}

**Adicionado em: v15.0.0**

Um ou mais parâmetros de [`crypto.scrypt()`](/pt/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) ou [`crypto.scryptSync()`](/pt/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options) estão fora de sua faixa legal.

### `ERR_CRYPTO_INVALID_STATE` {#err_crypto_invalid_state}

Um método criptográfico foi usado em um objeto que estava em um estado inválido. Por exemplo, chamar [`cipher.getAuthTag()`](/pt/nodejs/api/crypto#ciphergetauthtag) antes de chamar `cipher.final()`.

### `ERR_CRYPTO_INVALID_TAG_LENGTH` {#err_crypto_invalid_tag_length}

**Adicionado em: v15.0.0**

Um comprimento de tag de autenticação inválido foi fornecido.

### `ERR_CRYPTO_JOB_INIT_FAILED` {#err_crypto_job_init_failed}

**Adicionado em: v15.0.0**

A inicialização de uma operação criptográfica assíncrona falhou.

### `ERR_CRYPTO_JWK_UNSUPPORTED_CURVE` {#err_crypto_jwk_unsupported_curve}

A Curva Elíptica da chave não está registrada para uso no [Registro de Curva Elíptica de Chave Web JSON](https://www.iana.org/assignments/jose/jose.xhtml#web-key-elliptic-curve).

### `ERR_CRYPTO_JWK_UNSUPPORTED_KEY_TYPE` {#err_crypto_jwk_unsupported_key_type}

O Tipo de Chave Assimétrica da chave não está registrado para uso no [Registro de Tipos de Chave Web JSON](https://www.iana.org/assignments/jose/jose.xhtml#web-key-types).

### `ERR_CRYPTO_OPERATION_FAILED` {#err_crypto_operation_failed}

**Adicionado em: v15.0.0**

Uma operação criptográfica falhou por um motivo não especificado.

### `ERR_CRYPTO_PBKDF2_ERROR` {#err_crypto_pbkdf2_error}

O algoritmo PBKDF2 falhou por razões não especificadas. O OpenSSL não fornece mais detalhes e, portanto, o Node.js também não.

### `ERR_CRYPTO_SCRYPT_NOT_SUPPORTED` {#err_crypto_scrypt_not_supported}

O Node.js foi compilado sem suporte a `scrypt`. Não é possível com os binários de lançamento oficiais, mas pode acontecer com builds personalizados, incluindo builds de distribuição.

### `ERR_CRYPTO_SIGN_KEY_REQUIRED` {#err_crypto_sign_key_required}

Uma `chave` de assinatura não foi fornecida ao método [`sign.sign()`](/pt/nodejs/api/crypto#signsignprivatekey-outputencoding).

### `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` {#err_crypto_timing_safe_equal_length}

[`crypto.timingSafeEqual()`](/pt/nodejs/api/crypto#cryptotimingsafeequala-b) foi chamado com argumentos `Buffer`, `TypedArray` ou `DataView` de comprimentos diferentes.


### `ERR_CRYPTO_UNKNOWN_CIPHER` {#err_crypto_unknown_cipher}

Um cifre desconhecido foi especificado.

### `ERR_CRYPTO_UNKNOWN_DH_GROUP` {#err_crypto_unknown_dh_group}

Um nome de grupo Diffie-Hellman desconhecido foi fornecido. Consulte [`crypto.getDiffieHellman()`](/pt/nodejs/api/crypto#cryptogetdiffiehellmangroupname) para obter uma lista de nomes de grupo válidos.

### `ERR_CRYPTO_UNSUPPORTED_OPERATION` {#err_crypto_unsupported_operation}

**Adicionado em: v15.0.0, v14.18.0**

Foi feita uma tentativa de invocar uma operação cripto não suportada.

### `ERR_DEBUGGER_ERROR` {#err_debugger_error}

**Adicionado em: v16.4.0, v14.17.4**

Ocorreu um erro com o [depurador](/pt/nodejs/api/debugger).

### `ERR_DEBUGGER_STARTUP_ERROR` {#err_debugger_startup_error}

**Adicionado em: v16.4.0, v14.17.4**

O [depurador](/pt/nodejs/api/debugger) atingiu o tempo limite aguardando que o host/porta necessários estivessem livres.

### `ERR_DIR_CLOSED` {#err_dir_closed}

O [`fs.Dir`](/pt/nodejs/api/fs#class-fsdir) foi fechado anteriormente.

### `ERR_DIR_CONCURRENT_OPERATION` {#err_dir_concurrent_operation}

**Adicionado em: v14.3.0**

Uma chamada de leitura ou fechamento síncrona foi tentada em um [`fs.Dir`](/pt/nodejs/api/fs#class-fsdir) que possui operações assíncronas em andamento.

### `ERR_DLOPEN_DISABLED` {#err_dlopen_disabled}

**Adicionado em: v16.10.0, v14.19.0**

O carregamento de complementos nativos foi desativado usando [`--no-addons`](/pt/nodejs/api/cli#--no-addons).

### `ERR_DLOPEN_FAILED` {#err_dlopen_failed}

**Adicionado em: v15.0.0**

Uma chamada para `process.dlopen()` falhou.

### `ERR_DNS_SET_SERVERS_FAILED` {#err_dns_set_servers_failed}

`c-ares` falhou ao definir o servidor DNS.

### `ERR_DOMAIN_CALLBACK_NOT_AVAILABLE` {#err_domain_callback_not_available}

O módulo `node:domain` não era utilizável, pois não conseguiu estabelecer os hooks de tratamento de erros necessários, porque [`process.setUncaughtExceptionCaptureCallback()`](/pt/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) havia sido chamado em um ponto anterior no tempo.

### `ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE` {#err_domain_cannot_set_uncaught_exception_capture}

[`process.setUncaughtExceptionCaptureCallback()`](/pt/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) não pôde ser chamado porque o módulo `node:domain` foi carregado em um ponto anterior no tempo.

O rastreamento de pilha é estendido para incluir o ponto no tempo em que o módulo `node:domain` foi carregado.

### `ERR_DUPLICATE_STARTUP_SNAPSHOT_MAIN_FUNCTION` {#err_duplicate_startup_snapshot_main_function}

[`v8.startupSnapshot.setDeserializeMainFunction()`](/pt/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) não pôde ser chamado porque já havia sido chamado antes.


### `ERR_ENCODING_INVALID_ENCODED_DATA` {#err_encoding_invalid_encoded_data}

Os dados fornecidos à API `TextDecoder()` eram inválidos de acordo com a codificação fornecida.

### `ERR_ENCODING_NOT_SUPPORTED` {#err_encoding_not_supported}

A codificação fornecida à API `TextDecoder()` não era uma das [Codificações Suportadas pelo WHATWG](/pt/nodejs/api/util#whatwg-supported-encodings).

### `ERR_EVAL_ESM_CANNOT_PRINT` {#err_eval_esm_cannot_print}

`--print` não pode ser usado com entrada ESM.

### `ERR_EVENT_RECURSION` {#err_event_recursion}

Lançado quando uma tentativa é feita para despachar recursivamente um evento em `EventTarget`.

### `ERR_EXECUTION_ENVIRONMENT_NOT_AVAILABLE` {#err_execution_environment_not_available}

O contexto de execução JS não está associado a um ambiente Node.js. Isso pode ocorrer quando o Node.js é usado como uma biblioteca incorporada e alguns hooks para o mecanismo JS não estão configurados corretamente.

### `ERR_FALSY_VALUE_REJECTION` {#err_falsy_value_rejection}

Uma `Promise` que foi callbackificada via `util.callbackify()` foi rejeitada com um valor falsy.

### `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` {#err_feature_unavailable_on_platform}

**Adicionado em: v14.0.0**

Usado quando um recurso que não está disponível para a plataforma atual que está executando o Node.js é usado.

### `ERR_FS_CP_DIR_TO_NON_DIR` {#err_fs_cp_dir_to_non_dir}

**Adicionado em: v16.7.0**

Uma tentativa foi feita para copiar um diretório para um não diretório (arquivo, link simbólico, etc.) usando [`fs.cp()`](/pt/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_EEXIST` {#err_fs_cp_eexist}

**Adicionado em: v16.7.0**

Uma tentativa foi feita para copiar sobre um arquivo que já existia com [`fs.cp()`](/pt/nodejs/api/fs#fscpsrc-dest-options-callback), com `force` e `errorOnExist` definidos como `true`.

### `ERR_FS_CP_EINVAL` {#err_fs_cp_einval}

**Adicionado em: v16.7.0**

Ao usar [`fs.cp()`](/pt/nodejs/api/fs#fscpsrc-dest-options-callback), `src` ou `dest` apontava para um caminho inválido.

### `ERR_FS_CP_FIFO_PIPE` {#err_fs_cp_fifo_pipe}

**Adicionado em: v16.7.0**

Uma tentativa foi feita para copiar um pipe nomeado com [`fs.cp()`](/pt/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_NON_DIR_TO_DIR` {#err_fs_cp_non_dir_to_dir}

**Adicionado em: v16.7.0**

Uma tentativa foi feita para copiar um não diretório (arquivo, link simbólico, etc.) para um diretório usando [`fs.cp()`](/pt/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_SOCKET` {#err_fs_cp_socket}

**Adicionado em: v16.7.0**

Uma tentativa foi feita para copiar para um socket com [`fs.cp()`](/pt/nodejs/api/fs#fscpsrc-dest-options-callback).


### `ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY` {#err_fs_cp_symlink_to_subdirectory}

**Adicionado em: v16.7.0**

Ao usar [`fs.cp()`](/pt/nodejs/api/fs#fscpsrc-dest-options-callback), um link simbólico em `dest` apontava para um subdiretório de `src`.

### `ERR_FS_CP_UNKNOWN` {#err_fs_cp_unknown}

**Adicionado em: v16.7.0**

Foi feita uma tentativa de copiar para um tipo de arquivo desconhecido com [`fs.cp()`](/pt/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_EISDIR` {#err_fs_eisdir}

O caminho é um diretório.

### `ERR_FS_FILE_TOO_LARGE` {#err_fs_file_too_large}

Foi feita uma tentativa de ler um arquivo cujo tamanho é maior que o tamanho máximo permitido para um `Buffer`.

### `ERR_HTTP2_ALTSVC_INVALID_ORIGIN` {#err_http2_altsvc_invalid_origin}

Os quadros HTTP/2 ALTSVC requerem uma origem válida.

### `ERR_HTTP2_ALTSVC_LENGTH` {#err_http2_altsvc_length}

Os quadros HTTP/2 ALTSVC são limitados a um máximo de 16.382 bytes de carga útil.

### `ERR_HTTP2_CONNECT_AUTHORITY` {#err_http2_connect_authority}

Para solicitações HTTP/2 usando o método `CONNECT`, o pseudo-cabeçalho `:authority` é obrigatório.

### `ERR_HTTP2_CONNECT_PATH` {#err_http2_connect_path}

Para solicitações HTTP/2 usando o método `CONNECT`, o pseudo-cabeçalho `:path` é proibido.

### `ERR_HTTP2_CONNECT_SCHEME` {#err_http2_connect_scheme}

Para solicitações HTTP/2 usando o método `CONNECT`, o pseudo-cabeçalho `:scheme` é proibido.

### `ERR_HTTP2_ERROR` {#err_http2_error}

Ocorreu um erro HTTP/2 não específico.

### `ERR_HTTP2_GOAWAY_SESSION` {#err_http2_goaway_session}

Novos Streams HTTP/2 não podem ser abertos depois que o `Http2Session` recebeu um quadro `GOAWAY` do peer conectado.

### `ERR_HTTP2_HEADERS_AFTER_RESPOND` {#err_http2_headers_after_respond}

Um cabeçalho adicional foi especificado depois que uma resposta HTTP/2 foi iniciada.

### `ERR_HTTP2_HEADERS_SENT` {#err_http2_headers_sent}

Foi feita uma tentativa de enviar vários cabeçalhos de resposta.

### `ERR_HTTP2_HEADER_SINGLE_VALUE` {#err_http2_header_single_value}

Vários valores foram fornecidos para um campo de cabeçalho HTTP/2 que era necessário para ter apenas um único valor.

### `ERR_HTTP2_INFO_STATUS_NOT_ALLOWED` {#err_http2_info_status_not_allowed}

Códigos de status HTTP informativos (`1xx`) não podem ser definidos como o código de status de resposta em respostas HTTP/2.

### `ERR_HTTP2_INVALID_CONNECTION_HEADERS` {#err_http2_invalid_connection_headers}

Os cabeçalhos específicos da conexão HTTP/1 são proibidos de serem usados em solicitações e respostas HTTP/2.

### `ERR_HTTP2_INVALID_HEADER_VALUE` {#err_http2_invalid_header_value}

Um valor de cabeçalho HTTP/2 inválido foi especificado.


### `ERR_HTTP2_INVALID_INFO_STATUS` {#err_http2_invalid_info_status}

Um código de status informacional HTTP inválido foi especificado. Códigos de status informacionais devem ser um inteiro entre `100` e `199` (inclusive).

### `ERR_HTTP2_INVALID_ORIGIN` {#err_http2_invalid_origin}

Quadros `ORIGIN` HTTP/2 requerem uma origem válida.

### `ERR_HTTP2_INVALID_PACKED_SETTINGS_LENGTH` {#err_http2_invalid_packed_settings_length}

Instâncias de `Buffer` e `Uint8Array` passadas para a API `http2.getUnpackedSettings()` devem ter um comprimento que seja um múltiplo de seis.

### `ERR_HTTP2_INVALID_PSEUDOHEADER` {#err_http2_invalid_pseudoheader}

Apenas pseudo-cabeçalhos HTTP/2 válidos (`:status`, `:path`, `:authority`, `:scheme` e `:method`) podem ser usados.

### `ERR_HTTP2_INVALID_SESSION` {#err_http2_invalid_session}

Uma ação foi executada em um objeto `Http2Session` que já havia sido destruído.

### `ERR_HTTP2_INVALID_SETTING_VALUE` {#err_http2_invalid_setting_value}

Um valor inválido foi especificado para uma configuração HTTP/2.

### `ERR_HTTP2_INVALID_STREAM` {#err_http2_invalid_stream}

Uma operação foi executada em um fluxo que já havia sido destruído.

### `ERR_HTTP2_MAX_PENDING_SETTINGS_ACK` {#err_http2_max_pending_settings_ack}

Sempre que um quadro `SETTINGS` HTTP/2 é enviado a um peer conectado, o peer é obrigado a enviar um reconhecimento de que recebeu e aplicou as novas `SETTINGS`. Por padrão, um número máximo de quadros `SETTINGS` não reconhecidos pode ser enviado a qualquer momento. Este código de erro é usado quando esse limite foi atingido.

### `ERR_HTTP2_NESTED_PUSH` {#err_http2_nested_push}

Uma tentativa foi feita para iniciar um novo fluxo de push de dentro de um fluxo de push. Fluxos de push aninhados não são permitidos.

### `ERR_HTTP2_NO_MEM` {#err_http2_no_mem}

Sem memória ao usar a API `http2session.setLocalWindowSize(windowSize)`.

### `ERR_HTTP2_NO_SOCKET_MANIPULATION` {#err_http2_no_socket_manipulation}

Uma tentativa foi feita para manipular diretamente (ler, escrever, pausar, retomar, etc.) um socket anexado a um `Http2Session`.

### `ERR_HTTP2_ORIGIN_LENGTH` {#err_http2_origin_length}

Quadros `ORIGIN` HTTP/2 são limitados a um comprimento de 16382 bytes.

### `ERR_HTTP2_OUT_OF_STREAMS` {#err_http2_out_of_streams}

O número de fluxos criados em uma única sessão HTTP/2 atingiu o limite máximo.

### `ERR_HTTP2_PAYLOAD_FORBIDDEN` {#err_http2_payload_forbidden}

Um payload de mensagem foi especificado para um código de resposta HTTP para o qual um payload é proibido.


### `ERR_HTTP2_PING_CANCEL` {#err_http2_ping_cancel}

Um ping HTTP/2 foi cancelado.

### `ERR_HTTP2_PING_LENGTH` {#err_http2_ping_length}

Os payloads de ping HTTP/2 devem ter exatamente 8 bytes de comprimento.

### `ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED` {#err_http2_pseudoheader_not_allowed}

Um pseudo-cabeçalho HTTP/2 foi usado de forma inadequada. Pseudo-cabeçalhos são nomes de chaves de cabeçalho que começam com o prefixo `:`.

### `ERR_HTTP2_PUSH_DISABLED` {#err_http2_push_disabled}

Foi feita uma tentativa de criar um fluxo de push, que foi desativado pelo cliente.

### `ERR_HTTP2_SEND_FILE` {#err_http2_send_file}

Foi feita uma tentativa de usar a API `Http2Stream.prototype.responseWithFile()` para enviar um diretório.

### `ERR_HTTP2_SEND_FILE_NOSEEK` {#err_http2_send_file_noseek}

Foi feita uma tentativa de usar a API `Http2Stream.prototype.responseWithFile()` para enviar algo que não seja um arquivo regular, mas as opções `offset` ou `length` foram fornecidas.

### `ERR_HTTP2_SESSION_ERROR` {#err_http2_session_error}

O `Http2Session` fechou com um código de erro diferente de zero.

### `ERR_HTTP2_SETTINGS_CANCEL` {#err_http2_settings_cancel}

As configurações do `Http2Session` foram canceladas.

### `ERR_HTTP2_SOCKET_BOUND` {#err_http2_socket_bound}

Foi feita uma tentativa de conectar um objeto `Http2Session` a um `net.Socket` ou `tls.TLSSocket` que já havia sido vinculado a outro objeto `Http2Session`.

### `ERR_HTTP2_SOCKET_UNBOUND` {#err_http2_socket_unbound}

Foi feita uma tentativa de usar a propriedade `socket` de um `Http2Session` que já foi fechado.

### `ERR_HTTP2_STATUS_101` {#err_http2_status_101}

O uso do código de status Informacional `101` é proibido em HTTP/2.

### `ERR_HTTP2_STATUS_INVALID` {#err_http2_status_invalid}

Um código de status HTTP inválido foi especificado. Os códigos de status devem ser um número inteiro entre `100` e `599` (inclusive).

### `ERR_HTTP2_STREAM_CANCEL` {#err_http2_stream_cancel}

Um `Http2Stream` foi destruído antes que qualquer dado fosse transmitido ao peer conectado.

### `ERR_HTTP2_STREAM_ERROR` {#err_http2_stream_error}

Um código de erro diferente de zero foi especificado em um frame `RST_STREAM`.

### `ERR_HTTP2_STREAM_SELF_DEPENDENCY` {#err_http2_stream_self_dependency}

Ao definir a prioridade para um fluxo HTTP/2, o fluxo pode ser marcado como uma dependência para um fluxo pai. Este código de erro é usado quando uma tentativa é feita para marcar um fluxo como dependente de si mesmo.

### `ERR_HTTP2_TOO_MANY_CUSTOM_SETTINGS` {#err_http2_too_many_custom_settings}

O número de configurações personalizadas suportadas (10) foi excedido.


### `ERR_HTTP2_TOO_MANY_INVALID_FRAMES` {#err_http2_too_many_invalid_frames}

**Adicionado em: v15.14.0**

O limite de frames de protocolo HTTP/2 inválidos aceitáveis enviados pelo par, conforme especificado através da opção `maxSessionInvalidFrames`, foi excedido.

### `ERR_HTTP2_TRAILERS_ALREADY_SENT` {#err_http2_trailers_already_sent}

Os cabeçalhos de trailer já foram enviados no `Http2Stream`.

### `ERR_HTTP2_TRAILERS_NOT_READY` {#err_http2_trailers_not_ready}

O método `http2stream.sendTrailers()` não pode ser chamado até que o evento `'wantTrailers'` seja emitido em um objeto `Http2Stream`. O evento `'wantTrailers'` só será emitido se a opção `waitForTrailers` estiver definida para o `Http2Stream`.

### `ERR_HTTP2_UNSUPPORTED_PROTOCOL` {#err_http2_unsupported_protocol}

`http2.connect()` recebeu uma URL que usa qualquer protocolo que não seja `http:` ou `https:`.

### `ERR_HTTP_BODY_NOT_ALLOWED` {#err_http_body_not_allowed}

Um erro é lançado ao escrever em uma resposta HTTP que não permite conteúdo.

### `ERR_HTTP_CONTENT_LENGTH_MISMATCH` {#err_http_content_length_mismatch}

O tamanho do corpo da resposta não corresponde ao valor do cabeçalho content-length especificado.

### `ERR_HTTP_HEADERS_SENT` {#err_http_headers_sent}

Uma tentativa foi feita para adicionar mais cabeçalhos depois que os cabeçalhos já haviam sido enviados.

### `ERR_HTTP_INVALID_HEADER_VALUE` {#err_http_invalid_header_value}

Um valor de cabeçalho HTTP inválido foi especificado.

### `ERR_HTTP_INVALID_STATUS_CODE` {#err_http_invalid_status_code}

O código de status estava fora do intervalo de código de status regular (100-999).

### `ERR_HTTP_REQUEST_TIMEOUT` {#err_http_request_timeout}

O cliente não enviou a solicitação inteira dentro do tempo permitido.

### `ERR_HTTP_SOCKET_ASSIGNED` {#err_http_socket_assigned}

O [`ServerResponse`](/pt/nodejs/api/http#class-httpserverresponse) fornecido já foi atribuído a um socket.

### `ERR_HTTP_SOCKET_ENCODING` {#err_http_socket_encoding}

Alterar a codificação do socket não é permitido de acordo com a [RFC 7230 Seção 3](https://tools.ietf.org/html/rfc7230#section-3).

### `ERR_HTTP_TRAILER_INVALID` {#err_http_trailer_invalid}

O cabeçalho `Trailer` foi definido mesmo que a codificação de transferência não suporte isso.

### `ERR_ILLEGAL_CONSTRUCTOR` {#err_illegal_constructor}

Uma tentativa foi feita para construir um objeto usando um construtor não público.

### `ERR_IMPORT_ATTRIBUTE_MISSING` {#err_import_attribute_missing}

**Adicionado em: v21.1.0**

Um atributo de importação está faltando, impedindo que o módulo especificado seja importado.


### `ERR_IMPORT_ATTRIBUTE_TYPE_INCOMPATIBLE` {#err_import_attribute_type_incompatible}

**Adicionado em: v21.1.0**

Um atributo `type` de importação foi fornecido, mas o módulo especificado é de um tipo diferente.

### `ERR_IMPORT_ATTRIBUTE_UNSUPPORTED` {#err_import_attribute_unsupported}

**Adicionado em: v21.0.0, v20.10.0, v18.19.0**

Um atributo de importação não é suportado por esta versão do Node.js.

### `ERR_INCOMPATIBLE_OPTION_PAIR` {#err_incompatible_option_pair}

Um par de opções é incompatível entre si e não pode ser usado ao mesmo tempo.

### `ERR_INPUT_TYPE_NOT_ALLOWED` {#err_input_type_not_allowed}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

A flag `--input-type` foi usada para tentar executar um arquivo. Esta flag só pode ser usada com entrada via `--eval`, `--print` ou `STDIN`.

### `ERR_INSPECTOR_ALREADY_ACTIVATED` {#err_inspector_already_activated}

Ao usar o módulo `node:inspector`, foi feita uma tentativa de ativar o inspetor quando ele já havia começado a escutar em uma porta. Use `inspector.close()` antes de ativá-lo em um endereço diferente.

### `ERR_INSPECTOR_ALREADY_CONNECTED` {#err_inspector_already_connected}

Ao usar o módulo `node:inspector`, foi feita uma tentativa de conectar quando o inspetor já estava conectado.

### `ERR_INSPECTOR_CLOSED` {#err_inspector_closed}

Ao usar o módulo `node:inspector`, foi feita uma tentativa de usar o inspetor depois que a sessão já havia sido fechada.

### `ERR_INSPECTOR_COMMAND` {#err_inspector_command}

Ocorreu um erro ao emitir um comando através do módulo `node:inspector`.

### `ERR_INSPECTOR_NOT_ACTIVE` {#err_inspector_not_active}

O `inspector` não está ativo quando `inspector.waitForDebugger()` é chamado.

### `ERR_INSPECTOR_NOT_AVAILABLE` {#err_inspector_not_available}

O módulo `node:inspector` não está disponível para uso.

### `ERR_INSPECTOR_NOT_CONNECTED` {#err_inspector_not_connected}

Ao usar o módulo `node:inspector`, foi feita uma tentativa de usar o inspetor antes que ele estivesse conectado.

### `ERR_INSPECTOR_NOT_WORKER` {#err_inspector_not_worker}

Uma API foi chamada na thread principal que só pode ser usada a partir da thread de trabalho.

### `ERR_INTERNAL_ASSERTION` {#err_internal_assertion}

Houve um bug no Node.js ou uso incorreto de internos do Node.js. Para corrigir o erro, abra um problema em [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues).


### `ERR_INVALID_ADDRESS` {#err_invalid_address}

O endereço fornecido não é compreendido pela API do Node.js.

### `ERR_INVALID_ADDRESS_FAMILY` {#err_invalid_address_family}

A família de endereços fornecida não é compreendida pela API do Node.js.

### `ERR_INVALID_ARG_TYPE` {#err_invalid_arg_type}

Um argumento de tipo incorreto foi passado para uma API do Node.js.

### `ERR_INVALID_ARG_VALUE` {#err_invalid_arg_value}

Um valor inválido ou não suportado foi passado para um determinado argumento.

### `ERR_INVALID_ASYNC_ID` {#err_invalid_async_id}

Um `asyncId` ou `triggerAsyncId` inválido foi passado usando `AsyncHooks`. Um ID menor que -1 nunca deve acontecer.

### `ERR_INVALID_BUFFER_SIZE` {#err_invalid_buffer_size}

Uma troca foi executada em um `Buffer`, mas seu tamanho não era compatível com a operação.

### `ERR_INVALID_CHAR` {#err_invalid_char}

Caracteres inválidos foram detectados nos cabeçalhos.

### `ERR_INVALID_CURSOR_POS` {#err_invalid_cursor_pos}

Um cursor em um determinado fluxo não pode ser movido para uma linha especificada sem uma coluna especificada.

### `ERR_INVALID_FD` {#err_invalid_fd}

Um descritor de arquivo ('fd') não era válido (por exemplo, era um valor negativo).

### `ERR_INVALID_FD_TYPE` {#err_invalid_fd_type}

Um tipo de descritor de arquivo ('fd') não era válido.

### `ERR_INVALID_FILE_URL_HOST` {#err_invalid_file_url_host}

Uma API do Node.js que consome URLs `file:` (como certas funções no módulo [`fs`](/pt/nodejs/api/fs)) encontrou uma URL de arquivo com um host incompatível. Esta situação só pode ocorrer em sistemas do tipo Unix, onde apenas `localhost` ou um host vazio é suportado.

### `ERR_INVALID_FILE_URL_PATH` {#err_invalid_file_url_path}

Uma API do Node.js que consome URLs `file:` (como certas funções no módulo [`fs`](/pt/nodejs/api/fs)) encontrou uma URL de arquivo com um caminho incompatível. A semântica exata para determinar se um caminho pode ser usado depende da plataforma.

### `ERR_INVALID_HANDLE_TYPE` {#err_invalid_handle_type}

Foi feita uma tentativa de enviar um "handle" não suportado por um canal de comunicação IPC para um processo filho. Consulte [`subprocess.send()`](/pt/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) e [`process.send()`](/pt/nodejs/api/process#processsendmessage-sendhandle-options-callback) para obter mais informações.

### `ERR_INVALID_HTTP_TOKEN` {#err_invalid_http_token}

Um token HTTP inválido foi fornecido.

### `ERR_INVALID_IP_ADDRESS` {#err_invalid_ip_address}

Um endereço IP não é válido.


### `ERR_INVALID_MIME_SYNTAX` {#err_invalid_mime_syntax}

A sintaxe de um MIME não é válida.

### `ERR_INVALID_MODULE` {#err_invalid_module}

**Adicionado em: v15.0.0, v14.18.0**

Foi feita uma tentativa de carregar um módulo que não existe ou que não era válido de outra forma.

### `ERR_INVALID_MODULE_SPECIFIER` {#err_invalid_module_specifier}

A string do módulo importado é um URL inválido, nome de pacote ou especificador de subcaminho de pacote.

### `ERR_INVALID_OBJECT_DEFINE_PROPERTY` {#err_invalid_object_define_property}

Ocorreu um erro ao definir um atributo inválido na propriedade de um objeto.

### `ERR_INVALID_PACKAGE_CONFIG` {#err_invalid_package_config}

Um arquivo [`package.json`](/pt/nodejs/api/packages#nodejs-packagejson-field-definitions) inválido falhou ao analisar.

### `ERR_INVALID_PACKAGE_TARGET` {#err_invalid_package_target}

O campo [`"exports"`](/pt/nodejs/api/packages#exports) do `package.json` contém um valor de mapeamento de destino inválido para a resolução de módulo tentada.

### `ERR_INVALID_PROTOCOL` {#err_invalid_protocol}

Um `options.protocol` inválido foi passado para `http.request()`.

### `ERR_INVALID_REPL_EVAL_CONFIG` {#err_invalid_repl_eval_config}

As opções `breakEvalOnSigint` e `eval` foram definidas na configuração [`REPL`](/pt/nodejs/api/repl), o que não é suportado.

### `ERR_INVALID_REPL_INPUT` {#err_invalid_repl_input}

A entrada não pode ser usada no [`REPL`](/pt/nodejs/api/repl). As condições sob as quais este erro é usado são descritas na documentação do [`REPL`](/pt/nodejs/api/repl).

### `ERR_INVALID_RETURN_PROPERTY` {#err_invalid_return_property}

Lançado caso uma opção de função não forneça um valor válido para uma de suas propriedades de objeto retornadas na execução.

### `ERR_INVALID_RETURN_PROPERTY_VALUE` {#err_invalid_return_property_value}

Lançado caso uma opção de função não forneça um tipo de valor esperado para uma de suas propriedades de objeto retornadas na execução.

### `ERR_INVALID_RETURN_VALUE` {#err_invalid_return_value}

Lançado caso uma opção de função não retorne um tipo de valor esperado na execução, como quando se espera que uma função retorne uma promise.

### `ERR_INVALID_STATE` {#err_invalid_state}

**Adicionado em: v15.0.0**

Indica que uma operação não pode ser concluída devido a um estado inválido. Por exemplo, um objeto já pode ter sido destruído ou pode estar realizando outra operação.

### `ERR_INVALID_SYNC_FORK_INPUT` {#err_invalid_sync_fork_input}

Um `Buffer`, `TypedArray`, `DataView` ou `string` foi fornecido como entrada stdio para um fork assíncrono. Consulte a documentação do módulo [`child_process`](/pt/nodejs/api/child_process) para obter mais informações.


### `ERR_INVALID_THIS` {#err_invalid_this}

Uma função da API do Node.js foi chamada com um valor `this` incompatível.

```js [ESM]
const urlSearchParams = new URLSearchParams('foo=bar&baz=new');

const buf = Buffer.alloc(1);
urlSearchParams.has.call(buf, 'foo');
// Lança um TypeError com o código 'ERR_INVALID_THIS'
```
### `ERR_INVALID_TUPLE` {#err_invalid_tuple}

Um elemento no `iterável` fornecido ao [`construtor URLSearchParams`](/pt/nodejs/api/url#new-urlsearchparamsiterable) [WHATWG](/pt/nodejs/api/url#the-whatwg-url-api) não representou uma tupla `[nome, valor]` – isto é, se um elemento não é iterável, ou não consiste em exatamente dois elementos.

### `ERR_INVALID_TYPESCRIPT_SYNTAX` {#err_invalid_typescript_syntax}

**Adicionado em: v23.0.0**

A sintaxe TypeScript fornecida não é válida ou não é suportada. Isso pode acontecer ao usar a sintaxe TypeScript que requer transformação com [remoção de tipo](/pt/nodejs/api/typescript#type-stripping).

### `ERR_INVALID_URI` {#err_invalid_uri}

Um URI inválido foi passado.

### `ERR_INVALID_URL` {#err_invalid_url}

Uma URL inválida foi passada para o [`construtor URL`](/pt/nodejs/api/url#new-urlinput-base) [WHATWG](/pt/nodejs/api/url#the-whatwg-url-api) ou para o legado [`url.parse()`](/pt/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) para ser analisado. O objeto de erro lançado normalmente tem uma propriedade adicional `'input'` que contém a URL que falhou ao analisar.

### `ERR_INVALID_URL_SCHEME` {#err_invalid_url_scheme}

Uma tentativa foi feita para usar uma URL de um esquema (protocolo) incompatível para um propósito específico. É usado apenas no suporte da [API URL WHATWG](/pt/nodejs/api/url#the-whatwg-url-api) no módulo [`fs`](/pt/nodejs/api/fs) (que aceita apenas URLs com esquema `'file'`), mas pode ser usado em outras APIs do Node.js também no futuro.

### `ERR_IPC_CHANNEL_CLOSED` {#err_ipc_channel_closed}

Uma tentativa foi feita para usar um canal de comunicação IPC que já estava fechado.

### `ERR_IPC_DISCONNECTED` {#err_ipc_disconnected}

Uma tentativa foi feita para desconectar um canal de comunicação IPC que já estava desconectado. Veja a documentação para o módulo [`child_process`](/pt/nodejs/api/child_process) para mais informações.

### `ERR_IPC_ONE_PIPE` {#err_ipc_one_pipe}

Uma tentativa foi feita para criar um processo Node.js filho usando mais de um canal de comunicação IPC. Veja a documentação para o módulo [`child_process`](/pt/nodejs/api/child_process) para mais informações.


### `ERR_IPC_SYNC_FORK` {#err_ipc_sync_fork}

Foi feita uma tentativa de abrir um canal de comunicação IPC com um processo Node.js bifurcado sincronicamente. Consulte a documentação do módulo [`child_process`](/pt/nodejs/api/child_process) para obter mais informações.

### `ERR_IP_BLOCKED` {#err_ip_blocked}

O IP está bloqueado por `net.BlockList`.

### `ERR_LOADER_CHAIN_INCOMPLETE` {#err_loader_chain_incomplete}

**Adicionado em: v18.6.0, v16.17.0**

Um gancho do carregador ESM retornou sem chamar `next()` e sem sinalizar explicitamente um curto-circuito.

### `ERR_LOAD_SQLITE_EXTENSION` {#err_load_sqlite_extension}

**Adicionado em: v23.5.0**

Ocorreu um erro ao carregar uma extensão SQLite.

### `ERR_MEMORY_ALLOCATION_FAILED` {#err_memory_allocation_failed}

Foi feita uma tentativa de alocar memória (geralmente na camada C++), mas falhou.

### `ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE` {#err_message_target_context_unavailable}

**Adicionado em: v14.5.0, v12.19.0**

Uma mensagem enviada para uma [`MessagePort`](/pt/nodejs/api/worker_threads#class-messageport) não pôde ser desserializada no `Context` [vm](/pt/nodejs/api/vm) de destino. Nem todos os objetos Node.js podem ser instanciados com sucesso em qualquer contexto neste momento, e tentar transferi-los usando `postMessage()` pode falhar no lado receptor nesse caso.

### `ERR_METHOD_NOT_IMPLEMENTED` {#err_method_not_implemented}

Um método é necessário, mas não implementado.

### `ERR_MISSING_ARGS` {#err_missing_args}

Um argumento necessário de uma API Node.js não foi passado. Isso é usado apenas para estrita conformidade com a especificação da API (que em alguns casos pode aceitar `func(undefined)` mas não `func()`). Na maioria das APIs nativas do Node.js, `func(undefined)` e `func()` são tratados de forma idêntica, e o código de erro [`ERR_INVALID_ARG_TYPE`](/pt/nodejs/api/errors#err-invalid-arg-type) pode ser usado em vez disso.

### `ERR_MISSING_OPTION` {#err_missing_option}

Para APIs que aceitam objetos de opções, algumas opções podem ser obrigatórias. Este código é lançado se uma opção necessária estiver faltando.

### `ERR_MISSING_PASSPHRASE` {#err_missing_passphrase}

Foi feita uma tentativa de ler uma chave criptografada sem especificar uma senha.

### `ERR_MISSING_PLATFORM_FOR_WORKER` {#err_missing_platform_for_worker}

A plataforma V8 usada por esta instância do Node.js não oferece suporte à criação de Workers. Isso é causado pela falta de suporte do incorporador para Workers. Em particular, este erro não ocorrerá com builds padrão do Node.js.


### `ERR_MODULE_NOT_FOUND` {#err_module_not_found}

Um arquivo de módulo não pôde ser resolvido pelo carregador de módulos ECMAScript ao tentar uma operação `import` ou ao carregar o ponto de entrada do programa.

### `ERR_MULTIPLE_CALLBACK` {#err_multiple_callback}

Um callback foi chamado mais de uma vez.

Um callback quase sempre deve ser chamado apenas uma vez, pois a consulta pode ser atendida ou rejeitada, mas não ambas ao mesmo tempo. O último seria possível chamando um callback mais de uma vez.

### `ERR_NAPI_CONS_FUNCTION` {#err_napi_cons_function}

Ao usar `Node-API`, um construtor passado não era uma função.

### `ERR_NAPI_INVALID_DATAVIEW_ARGS` {#err_napi_invalid_dataview_args}

Ao chamar `napi_create_dataview()`, um `offset` fornecido estava fora dos limites do dataview ou `offset + length` era maior que um comprimento de `buffer` fornecido.

### `ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT` {#err_napi_invalid_typedarray_alignment}

Ao chamar `napi_create_typedarray()`, o `offset` fornecido não era um múltiplo do tamanho do elemento.

### `ERR_NAPI_INVALID_TYPEDARRAY_LENGTH` {#err_napi_invalid_typedarray_length}

Ao chamar `napi_create_typedarray()`, `(length * size_of_element) + byte_offset` era maior que o comprimento do `buffer` fornecido.

### `ERR_NAPI_TSFN_CALL_JS` {#err_napi_tsfn_call_js}

Ocorreu um erro ao invocar a parte JavaScript da função thread-safe.

### `ERR_NAPI_TSFN_GET_UNDEFINED` {#err_napi_tsfn_get_undefined}

Ocorreu um erro ao tentar recuperar o valor JavaScript `undefined`.

### `ERR_NON_CONTEXT_AWARE_DISABLED` {#err_non_context_aware_disabled}

Um addon nativo não context-aware foi carregado em um processo que os proíbe.

### `ERR_NOT_BUILDING_SNAPSHOT` {#err_not_building_snapshot}

Foi feita uma tentativa de usar operações que só podem ser usadas ao construir um snapshot de inicialização do V8, mesmo que o Node.js não esteja construindo um.

### `ERR_NOT_IN_SINGLE_EXECUTABLE_APPLICATION` {#err_not_in_single_executable_application}

**Adicionado em: v21.7.0, v20.12.0**

A operação não pode ser realizada quando não está em um aplicativo de executável único.

### `ERR_NOT_SUPPORTED_IN_SNAPSHOT` {#err_not_supported_in_snapshot}

Foi feita uma tentativa de realizar operações que não são suportadas ao construir um snapshot de inicialização.

### `ERR_NO_CRYPTO` {#err_no_crypto}

Foi feita uma tentativa de usar recursos criptográficos enquanto o Node.js não foi compilado com suporte criptográfico OpenSSL.


### `ERR_NO_ICU` {#err_no_icu}

Foi feita uma tentativa de usar recursos que exigem [ICU](/pt/nodejs/api/intl#internationalization-support), mas o Node.js não foi compilado com suporte ao ICU.

### `ERR_NO_TYPESCRIPT` {#err_no_typescript}

**Adicionado em: v23.0.0**

Foi feita uma tentativa de usar recursos que exigem [suporte nativo ao TypeScript](/pt/nodejs/api/typescript#type-stripping), mas o Node.js não foi compilado com suporte ao TypeScript.

### `ERR_OPERATION_FAILED` {#err_operation_failed}

**Adicionado em: v15.0.0**

Uma operação falhou. Isso é normalmente usado para sinalizar a falha geral de uma operação assíncrona.

### `ERR_OUT_OF_RANGE` {#err_out_of_range}

Um valor fornecido está fora do intervalo aceito.

### `ERR_PACKAGE_IMPORT_NOT_DEFINED` {#err_package_import_not_defined}

O campo [`"imports"`](/pt/nodejs/api/packages#imports) do `package.json` não define o mapeamento de especificador de pacote interno fornecido.

### `ERR_PACKAGE_PATH_NOT_EXPORTED` {#err_package_path_not_exported}

O campo [`"exports"`](/pt/nodejs/api/packages#exports) do `package.json` não exporta o subcaminho solicitado. Como as exportações são encapsuladas, módulos internos privados que não são exportados não podem ser importados através da resolução de pacotes, a menos que se use um URL absoluto.

### `ERR_PARSE_ARGS_INVALID_OPTION_VALUE` {#err_parse_args_invalid_option_value}

**Adicionado em: v18.3.0, v16.17.0**

Quando `strict` está definido como `true`, lançado por [`util.parseArgs()`](/pt/nodejs/api/util#utilparseargsconfig) se um valor [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) for fornecido para uma opção do tipo [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), ou se um valor [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) for fornecido para uma opção do tipo [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).

### `ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL` {#err_parse_args_unexpected_positional}

**Adicionado em: v18.3.0, v16.17.0**

Lançado por [`util.parseArgs()`](/pt/nodejs/api/util#utilparseargsconfig), quando um argumento posicional é fornecido e `allowPositionals` está definido como `false`.

### `ERR_PARSE_ARGS_UNKNOWN_OPTION` {#err_parse_args_unknown_option}

**Adicionado em: v18.3.0, v16.17.0**

Quando `strict` está definido como `true`, lançado por [`util.parseArgs()`](/pt/nodejs/api/util#utilparseargsconfig) se um argumento não estiver configurado em `options`.


### `ERR_PERFORMANCE_INVALID_TIMESTAMP` {#err_performance_invalid_timestamp}

Um valor de timestamp inválido foi fornecido para uma marca ou medida de desempenho.

### `ERR_PERFORMANCE_MEASURE_INVALID_OPTIONS` {#err_performance_measure_invalid_options}

Opções inválidas foram fornecidas para uma medida de desempenho.

### `ERR_PROTO_ACCESS` {#err_proto_access}

O acesso a `Object.prototype.__proto__` foi proibido usando [`--disable-proto=throw`](/pt/nodejs/api/cli#--disable-protomode). [`Object.getPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) e [`Object.setPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) devem ser usados para obter e definir o protótipo de um objeto.

### `ERR_QUIC_APPLICATION_ERROR` {#err_quic_application_error}

**Adicionado em: v23.4.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Ocorreu um erro de aplicação QUIC.

### `ERR_QUIC_CONNECTION_FAILED` {#err_quic_connection_failed}

**Adicionado em: v23.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Falha ao estabelecer uma conexão QUIC.

### `ERR_QUIC_ENDPOINT_CLOSED` {#err_quic_endpoint_closed}

**Adicionado em: v23.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Um Endpoint QUIC fechou com um erro.

### `ERR_QUIC_OPEN_STREAM_FAILED` {#err_quic_open_stream_failed}

**Adicionado em: v23.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Falha ao abrir um fluxo QUIC.

### `ERR_QUIC_TRANSPORT_ERROR` {#err_quic_transport_error}

**Adicionado em: v23.4.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Ocorreu um erro de transporte QUIC.

### `ERR_QUIC_VERSION_NEGOTIATION_ERROR` {#err_quic_version_negotiation_error}

**Adicionado em: v23.4.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Uma sessão QUIC falhou porque a negociação de versão é necessária.


### `ERR_REQUIRE_ASYNC_MODULE` {#err_require_async_module}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Ao tentar `require()` um [Módulo ES](/pt/nodejs/api/esm), o módulo acaba sendo assíncrono. Ou seja, ele contém `await` de nível superior.

Para ver onde está o `await` de nível superior, use `--experimental-print-required-tla` (isso executaria os módulos antes de procurar os `awaits` de nível superior).

### `ERR_REQUIRE_CYCLE_MODULE` {#err_require_cycle_module}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Ao tentar `require()` um [Módulo ES](/pt/nodejs/api/esm), uma borda CommonJS para ESM ou ESM para CommonJS participa de um ciclo imediato. Isso não é permitido porque os Módulos ES não podem ser avaliados enquanto já estão sendo avaliados.

Para evitar o ciclo, a chamada `require()` envolvida em um ciclo não deve ocorrer no nível superior de um Módulo ES (via `createRequire()`) ou um módulo CommonJS, e deve ser feita preguiçosamente em uma função interna.

### `ERR_REQUIRE_ESM` {#err_require_esm}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | require() agora suporta o carregamento de módulos ES síncronos por padrão. |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto
:::

Foi feita uma tentativa de `require()` um [Módulo ES](/pt/nodejs/api/esm).

Este erro foi descontinuado, pois `require()` agora suporta o carregamento de módulos ES síncronos. Quando `require()` encontra um módulo ES que contém `await` de nível superior, ele lançará [`ERR_REQUIRE_ASYNC_MODULE`](/pt/nodejs/api/errors#err_require_async_module) em vez disso.

### `ERR_SCRIPT_EXECUTION_INTERRUPTED` {#err_script_execution_interrupted}

A execução do script foi interrompida por `SIGINT` (Por exemplo, + foi pressionado.)

### `ERR_SCRIPT_EXECUTION_TIMEOUT` {#err_script_execution_timeout}

O tempo limite da execução do script expirou, possivelmente devido a bugs no script que está sendo executado.

### `ERR_SERVER_ALREADY_LISTEN` {#err_server_already_listen}

O método [`server.listen()`](/pt/nodejs/api/net#serverlisten) foi chamado enquanto um `net.Server` já estava ouvindo. Isso se aplica a todas as instâncias de `net.Server`, incluindo instâncias `Server` HTTP, HTTPS e HTTP/2.


### `ERR_SERVER_NOT_RUNNING` {#err_server_not_running}

O método [`server.close()`](/pt/nodejs/api/net#serverclosecallback) foi chamado quando um `net.Server` não estava em execução. Isso se aplica a todas as instâncias de `net.Server`, incluindo instâncias HTTP, HTTPS e HTTP/2 `Server`.

### `ERR_SINGLE_EXECUTABLE_APPLICATION_ASSET_NOT_FOUND` {#err_single_executable_application_asset_not_found}

**Adicionado em: v21.7.0, v20.12.0**

Uma chave foi passada para as APIs de aplicação executável única para identificar um recurso, mas nenhuma correspondência pôde ser encontrada.

### `ERR_SOCKET_ALREADY_BOUND` {#err_socket_already_bound}

Foi feita uma tentativa de vincular um socket que já foi vinculado.

### `ERR_SOCKET_BAD_BUFFER_SIZE` {#err_socket_bad_buffer_size}

Um tamanho inválido (negativo) foi passado para as opções `recvBufferSize` ou `sendBufferSize` em [`dgram.createSocket()`](/pt/nodejs/api/dgram#dgramcreatesocketoptions-callback).

### `ERR_SOCKET_BAD_PORT` {#err_socket_bad_port}

Uma função da API esperando uma porta \>= 0 e \< 65536 recebeu um valor inválido.

### `ERR_SOCKET_BAD_TYPE` {#err_socket_bad_type}

Uma função da API esperando um tipo de socket (`udp4` ou `udp6`) recebeu um valor inválido.

### `ERR_SOCKET_BUFFER_SIZE` {#err_socket_buffer_size}

Ao usar [`dgram.createSocket()`](/pt/nodejs/api/dgram#dgramcreatesocketoptions-callback), o tamanho do `Buffer` de recebimento ou envio não pôde ser determinado.

### `ERR_SOCKET_CLOSED` {#err_socket_closed}

Foi feita uma tentativa de operar em um socket já fechado.

### `ERR_SOCKET_CLOSED_BEFORE_CONNECTION` {#err_socket_closed_before_connection}

Ao chamar [`net.Socket.write()`](/pt/nodejs/api/net#socketwritedata-encoding-callback) em um socket de conexão e o socket foi fechado antes que a conexão fosse estabelecida.

### `ERR_SOCKET_CONNECTION_TIMEOUT` {#err_socket_connection_timeout}

O socket não conseguiu se conectar a nenhum endereço retornado pelo DNS dentro do tempo limite permitido ao usar o algoritmo de autoseleção de família.

### `ERR_SOCKET_DGRAM_IS_CONNECTED` {#err_socket_dgram_is_connected}

Uma chamada [`dgram.connect()`](/pt/nodejs/api/dgram#socketconnectport-address-callback) foi feita em um socket já conectado.

### `ERR_SOCKET_DGRAM_NOT_CONNECTED` {#err_socket_dgram_not_connected}

Uma chamada [`dgram.disconnect()`](/pt/nodejs/api/dgram#socketdisconnect) ou [`dgram.remoteAddress()`](/pt/nodejs/api/dgram#socketremoteaddress) foi feita em um socket desconectado.

### `ERR_SOCKET_DGRAM_NOT_RUNNING` {#err_socket_dgram_not_running}

Uma chamada foi feita e o subsistema UDP não estava em execução.


### `ERR_SOURCE_MAP_CORRUPT` {#err_source_map_corrupt}

O mapa de origem não pôde ser analisado porque não existe ou está corrompido.

### `ERR_SOURCE_MAP_MISSING_SOURCE` {#err_source_map_missing_source}

Um arquivo importado de um mapa de origem não foi encontrado.

### `ERR_SQLITE_ERROR` {#err_sqlite_error}

**Adicionado em: v22.5.0**

Um erro foi retornado de [SQLite](/pt/nodejs/api/sqlite).

### `ERR_SRI_PARSE` {#err_sri_parse}

Uma string foi fornecida para uma verificação de Integridade de Sub-recurso, mas não pôde ser analisada. Verifique o formato dos atributos de integridade consultando a [especificação de Integridade de Sub-recurso](https://www.w3.org/TR/SRI/#the-integrity-attribute).

### `ERR_STREAM_ALREADY_FINISHED` {#err_stream_already_finished}

Um método de stream foi chamado que não pode ser concluído porque o stream foi finalizado.

### `ERR_STREAM_CANNOT_PIPE` {#err_stream_cannot_pipe}

Foi feita uma tentativa de chamar [`stream.pipe()`](/pt/nodejs/api/stream#readablepipedestination-options) em um stream [`Writable`](/pt/nodejs/api/stream#class-streamwritable).

### `ERR_STREAM_DESTROYED` {#err_stream_destroyed}

Um método de stream foi chamado que não pode ser concluído porque o stream foi destruído usando `stream.destroy()`.

### `ERR_STREAM_NULL_VALUES` {#err_stream_null_values}

Foi feita uma tentativa de chamar [`stream.write()`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback) com um chunk `null`.

### `ERR_STREAM_PREMATURE_CLOSE` {#err_stream_premature_close}

Um erro retornado por `stream.finished()` e `stream.pipeline()`, quando um stream ou um pipeline termina de forma não elegante sem nenhum erro explícito.

### `ERR_STREAM_PUSH_AFTER_EOF` {#err_stream_push_after_eof}

Foi feita uma tentativa de chamar [`stream.push()`](/pt/nodejs/api/stream#readablepushchunk-encoding) após um `null` (EOF) ter sido enviado para o stream.

### `ERR_STREAM_UNABLE_TO_PIPE` {#err_stream_unable_to_pipe}

Foi feita uma tentativa de canalizar para um stream fechado ou destruído em um pipeline.

### `ERR_STREAM_UNSHIFT_AFTER_END_EVENT` {#err_stream_unshift_after_end_event}

Foi feita uma tentativa de chamar [`stream.unshift()`](/pt/nodejs/api/stream#readableunshiftchunk-encoding) após o evento `'end'` ter sido emitido.

### `ERR_STREAM_WRAP` {#err_stream_wrap}

Impede uma interrupção se um decodificador de string foi definido no Socket ou se o decodificador está em `objectMode`.

```js [ESM]
const Socket = require('node:net').Socket;
const instance = new Socket();

instance.setEncoding('utf8');
```

### `ERR_STREAM_WRITE_AFTER_END` {#err_stream_write_after_end}

Foi feita uma tentativa de chamar [`stream.write()`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback) após `stream.end()` ter sido chamado.

### `ERR_STRING_TOO_LONG` {#err_string_too_long}

Foi feita uma tentativa de criar uma string maior do que o comprimento máximo permitido.

### `ERR_SYNTHETIC` {#err_synthetic}

Um objeto de erro artificial usado para capturar a pilha de chamadas para relatórios de diagnóstico.

### `ERR_SYSTEM_ERROR` {#err_system_error}

Ocorreu um erro de sistema não especificado ou não específico dentro do processo Node.js. O objeto de erro terá uma propriedade de objeto `err.info` com detalhes adicionais.

### `ERR_TAP_LEXER_ERROR` {#err_tap_lexer_error}

Um erro representando um estado de analisador léxico falhando.

### `ERR_TAP_PARSER_ERROR` {#err_tap_parser_error}

Um erro representando um estado de analisador sintático falhando. Informações adicionais sobre o token que causou o erro estão disponíveis através da propriedade `cause`.

### `ERR_TAP_VALIDATION_ERROR` {#err_tap_validation_error}

Este erro representa uma validação TAP falhada.

### `ERR_TEST_FAILURE` {#err_test_failure}

Este erro representa um teste falhado. Informações adicionais sobre a falha estão disponíveis através da propriedade `cause`. A propriedade `failureType` especifica o que o teste estava fazendo quando a falha ocorreu.

### `ERR_TLS_ALPN_CALLBACK_INVALID_RESULT` {#err_tls_alpn_callback_invalid_result}

Este erro é lançado quando um `ALPNCallback` retorna um valor que não está na lista de protocolos ALPN oferecidos pelo cliente.

### `ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS` {#err_tls_alpn_callback_with_protocols}

Este erro é lançado ao criar um `TLSServer` se as opções TLS incluem tanto `ALPNProtocols` quanto `ALPNCallback`. Estas opções são mutuamente exclusivas.

### `ERR_TLS_CERT_ALTNAME_FORMAT` {#err_tls_cert_altname_format}

Este erro é lançado por `checkServerIdentity` se uma propriedade `subjectaltname` fornecida pelo usuário violar as regras de codificação. Objetos de certificado produzidos pelo próprio Node.js sempre cumprem as regras de codificação e nunca causarão este erro.

### `ERR_TLS_CERT_ALTNAME_INVALID` {#err_tls_cert_altname_invalid}

Ao usar TLS, o nome de host/IP do par não correspondeu a nenhum dos `subjectAltNames` em seu certificado.

### `ERR_TLS_DH_PARAM_SIZE` {#err_tls_dh_param_size}

Ao usar TLS, o parâmetro oferecido para o protocolo de acordo de chave Diffie-Hellman (`DH`) é muito pequeno. Por padrão, o comprimento da chave deve ser maior ou igual a 1024 bits para evitar vulnerabilidades, embora seja fortemente recomendado usar 2048 bits ou mais para uma segurança mais forte.


### `ERR_TLS_HANDSHAKE_TIMEOUT` {#err_tls_handshake_timeout}

Um handshake TLS/SSL expirou. Nesse caso, o servidor também deve abortar a conexão.

### `ERR_TLS_INVALID_CONTEXT` {#err_tls_invalid_context}

**Adicionado em: v13.3.0**

O contexto deve ser um `SecureContext`.

### `ERR_TLS_INVALID_PROTOCOL_METHOD` {#err_tls_invalid_protocol_method}

O método `secureProtocol` especificado é inválido. É desconhecido ou desativado por ser inseguro.

### `ERR_TLS_INVALID_PROTOCOL_VERSION` {#err_tls_invalid_protocol_version}

As versões válidas do protocolo TLS são `'TLSv1'`, `'TLSv1.1'` ou `'TLSv1.2'`.

### `ERR_TLS_INVALID_STATE` {#err_tls_invalid_state}

**Adicionado em: v13.10.0, v12.17.0**

O socket TLS deve estar conectado e estabelecido com segurança. Certifique-se de que o evento 'secure' seja emitido antes de continuar.

### `ERR_TLS_PROTOCOL_VERSION_CONFLICT` {#err_tls_protocol_version_conflict}

A tentativa de definir um protocolo TLS `minVersion` ou `maxVersion` entra em conflito com uma tentativa de definir o `secureProtocol` explicitamente. Use um mecanismo ou outro.

### `ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED` {#err_tls_psk_set_identity_hint_failed}

Falha ao definir a dica de identidade PSK. A dica pode ser muito longa.

### `ERR_TLS_RENEGOTIATION_DISABLED` {#err_tls_renegotiation_disabled}

Uma tentativa foi feita para renegociar o TLS em uma instância de socket com a renegociação desativada.

### `ERR_TLS_REQUIRED_SERVER_NAME` {#err_tls_required_server_name}

Ao usar TLS, o método `server.addContext()` foi chamado sem fornecer um nome de host no primeiro parâmetro.

### `ERR_TLS_SESSION_ATTACK` {#err_tls_session_attack}

Uma quantidade excessiva de renegociações de TLS é detectada, o que é um vetor potencial para ataques de negação de serviço.

### `ERR_TLS_SNI_FROM_SERVER` {#err_tls_sni_from_server}

Uma tentativa foi feita para emitir a Indicação de Nome do Servidor de um socket TLS do lado do servidor, que é válido apenas de um cliente.

### `ERR_TRACE_EVENTS_CATEGORY_REQUIRED` {#err_trace_events_category_required}

O método `trace_events.createTracing()` requer pelo menos uma categoria de evento de rastreamento.

### `ERR_TRACE_EVENTS_UNAVAILABLE` {#err_trace_events_unavailable}

O módulo `node:trace_events` não pôde ser carregado porque o Node.js foi compilado com a flag `--without-v8-platform`.

### `ERR_TRANSFORM_ALREADY_TRANSFORMING` {#err_transform_already_transforming}

Um fluxo `Transform` terminou enquanto ainda estava transformando.

### `ERR_TRANSFORM_WITH_LENGTH_0` {#err_transform_with_length_0}

Um fluxo `Transform` terminou com dados ainda no buffer de escrita.


### `ERR_TTY_INIT_FAILED` {#err_tty_init_failed}

A inicialização de um TTY falhou devido a um erro de sistema.

### `ERR_UNAVAILABLE_DURING_EXIT` {#err_unavailable_during_exit}

A função foi chamada dentro de um manipulador [`process.on('exit')`](/pt/nodejs/api/process#event-exit) que não deveria ser chamado dentro do manipulador [`process.on('exit')`](/pt/nodejs/api/process#event-exit).

### `ERR_UNCAUGHT_EXCEPTION_CAPTURE_ALREADY_SET` {#err_uncaught_exception_capture_already_set}

[`process.setUncaughtExceptionCaptureCallback()`](/pt/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) foi chamado duas vezes, sem primeiro redefinir o callback para `null`.

Este erro foi projetado para evitar a sobrescrita acidental de um callback registrado de outro módulo.

### `ERR_UNESCAPED_CHARACTERS` {#err_unescaped_characters}

Uma string que continha caracteres não escapados foi recebida.

### `ERR_UNHANDLED_ERROR` {#err_unhandled_error}

Ocorreu um erro não tratado (por exemplo, quando um evento `'error'` é emitido por um [`EventEmitter`](/pt/nodejs/api/events#class-eventemitter) mas um manipulador `'error'` não está registrado).

### `ERR_UNKNOWN_BUILTIN_MODULE` {#err_unknown_builtin_module}

Usado para identificar um tipo específico de erro interno do Node.js que normalmente não deve ser acionado pelo código do usuário. Instâncias desse erro apontam para um bug interno dentro do próprio binário do Node.js.

### `ERR_UNKNOWN_CREDENTIAL` {#err_unknown_credential}

Um grupo Unix ou identificador de usuário que não existe foi passado.

### `ERR_UNKNOWN_ENCODING` {#err_unknown_encoding}

Uma opção de codificação inválida ou desconhecida foi passada para uma API.

### `ERR_UNKNOWN_FILE_EXTENSION` {#err_unknown_file_extension}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Uma tentativa foi feita para carregar um módulo com uma extensão de arquivo desconhecida ou não suportada.

### `ERR_UNKNOWN_MODULE_FORMAT` {#err_unknown_module_format}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Uma tentativa foi feita para carregar um módulo com um formato desconhecido ou não suportado.

### `ERR_UNKNOWN_SIGNAL` {#err_unknown_signal}

Um sinal de processo inválido ou desconhecido foi passado para uma API que espera um sinal válido (como [`subprocess.kill()`](/pt/nodejs/api/child_process#subprocesskillsignal)).


### `ERR_UNSUPPORTED_DIR_IMPORT` {#err_unsupported_dir_import}

`import` de uma URL de diretório não é suportado. Em vez disso, [faça auto-referência a um pacote usando seu nome](/pt/nodejs/api/packages#self-referencing-a-package-using-its-name) e [defina um subcaminho personalizado](/pt/nodejs/api/packages#subpath-exports) no campo [`"exports"`](/pt/nodejs/api/packages#exports) do arquivo [`package.json`](/pt/nodejs/api/packages#nodejs-packagejson-field-definitions).

```js [ESM]
import './'; // não suportado
import './index.js'; // suportado
import 'nome-do-pacote'; // suportado
```
### `ERR_UNSUPPORTED_ESM_URL_SCHEME` {#err_unsupported_esm_url_scheme}

`import` com esquemas de URL diferentes de `file` e `data` não é suportado.

### `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` {#err_unsupported_node_modules_type_stripping}

**Adicionado em: v22.6.0**

A remoção de tipos não é suportada para arquivos descendentes de um diretório `node_modules`.

### `ERR_UNSUPPORTED_RESOLVE_REQUEST` {#err_unsupported_resolve_request}

Foi feita uma tentativa de resolver um referenciador de módulo inválido. Isso pode acontecer ao importar ou chamar `import.meta.resolve()` com:

- um especificador nu que não é um módulo embutido de um módulo cujo esquema de URL não é `file`.
- uma [URL relativa](https://url.spec.whatwg.org/#relative-url-string) de um módulo cujo esquema de URL não é um [esquema especial](https://url.spec.whatwg.org/#special-scheme).

```js [ESM]
try {
  // Tentando importar o pacote 'bare-specifier' de um módulo URL `data:`:
  await import('data:text/javascript,import "bare-specifier"');
} catch (e) {
  console.log(e.code); // ERR_UNSUPPORTED_RESOLVE_REQUEST
}
```
### `ERR_USE_AFTER_CLOSE` {#err_use_after_close}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Foi feita uma tentativa de usar algo que já estava fechado.

### `ERR_VALID_PERFORMANCE_ENTRY_TYPE` {#err_valid_performance_entry_type}

Ao usar a API de Tempo de Desempenho (`perf_hooks`), nenhum tipo de entrada de desempenho válido é encontrado.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` {#err_vm_dynamic_import_callback_missing}

Um callback de importação dinâmica não foi especificado.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` {#err_vm_dynamic_import_callback_missing_flag}

Um callback de importação dinâmica foi invocado sem `--experimental-vm-modules`.


### `ERR_VM_MODULE_ALREADY_LINKED` {#err_vm_module_already_linked}

O módulo que tentou ser vinculado não é elegível para vinculação, por um dos seguintes motivos:

- Já foi vinculado (`linkingStatus` é `'linked'`)
- Está sendo vinculado (`linkingStatus` é `'linking'`)
- A vinculação falhou para este módulo (`linkingStatus` é `'errored'`)

### `ERR_VM_MODULE_CACHED_DATA_REJECTED` {#err_vm_module_cached_data_rejected}

A opção `cachedData` passada para um construtor de módulo é inválida.

### `ERR_VM_MODULE_CANNOT_CREATE_CACHED_DATA` {#err_vm_module_cannot_create_cached_data}

Dados em cache não podem ser criados para módulos que já foram avaliados.

### `ERR_VM_MODULE_DIFFERENT_CONTEXT` {#err_vm_module_different_context}

O módulo que está sendo retornado da função linker é de um contexto diferente do módulo pai. Módulos vinculados devem compartilhar o mesmo contexto.

### `ERR_VM_MODULE_LINK_FAILURE` {#err_vm_module_link_failure}

O módulo não pôde ser vinculado devido a uma falha.

### `ERR_VM_MODULE_NOT_MODULE` {#err_vm_module_not_module}

O valor cumprido de uma promessa de vinculação não é um objeto `vm.Module`.

### `ERR_VM_MODULE_STATUS` {#err_vm_module_status}

O status atual do módulo não permite esta operação. O significado específico do erro depende da função específica.

### `ERR_WASI_ALREADY_STARTED` {#err_wasi_already_started}

A instância WASI já foi iniciada.

### `ERR_WASI_NOT_STARTED` {#err_wasi_not_started}

A instância WASI não foi iniciada.

### `ERR_WEBASSEMBLY_RESPONSE` {#err_webassembly_response}

**Adicionado em: v18.1.0**

A `Response` que foi passada para `WebAssembly.compileStreaming` ou para `WebAssembly.instantiateStreaming` não é uma resposta WebAssembly válida.

### `ERR_WORKER_INIT_FAILED` {#err_worker_init_failed}

A inicialização do `Worker` falhou.

### `ERR_WORKER_INVALID_EXEC_ARGV` {#err_worker_invalid_exec_argv}

A opção `execArgv` passada para o construtor `Worker` contém flags inválidas.

### `ERR_WORKER_MESSAGING_ERRORED` {#err_worker_messaging_errored}

**Adicionado em: v22.5.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

A thread de destino lançou um erro ao processar uma mensagem enviada via [`postMessageToThread()`](/pt/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).


### `ERR_WORKER_MESSAGING_FAILED` {#err_worker_messaging_failed}

**Adicionado em: v22.5.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

A thread solicitada em [`postMessageToThread()`](/pt/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) é inválida ou não possui um ouvinte `workerMessage`.

### `ERR_WORKER_MESSAGING_SAME_THREAD` {#err_worker_messaging_same_thread}

**Adicionado em: v22.5.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

O ID da thread solicitado em [`postMessageToThread()`](/pt/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) é o ID da thread atual.

### `ERR_WORKER_MESSAGING_TIMEOUT` {#err_worker_messaging_timeout}

**Adicionado em: v22.5.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

O envio de uma mensagem via [`postMessageToThread()`](/pt/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) expirou.

### `ERR_WORKER_NOT_RUNNING` {#err_worker_not_running}

Uma operação falhou porque a instância `Worker` não está em execução atualmente.

### `ERR_WORKER_OUT_OF_MEMORY` {#err_worker_out_of_memory}

A instância `Worker` terminou porque atingiu seu limite de memória.

### `ERR_WORKER_PATH` {#err_worker_path}

O caminho para o script principal de um worker não é um caminho absoluto nem um caminho relativo que começa com `./` ou `../`.

### `ERR_WORKER_UNSERIALIZABLE_ERROR` {#err_worker_unserializable_error}

Todas as tentativas de serializar uma exceção não capturada de uma thread worker falharam.

### `ERR_WORKER_UNSUPPORTED_OPERATION` {#err_worker_unsupported_operation}

A funcionalidade solicitada não é suportada em threads worker.

### `ERR_ZLIB_INITIALIZATION_FAILED` {#err_zlib_initialization_failed}

A criação de um objeto [`zlib`](/pt/nodejs/api/zlib) falhou devido à configuração incorreta.

### `HPE_CHUNK_EXTENSIONS_OVERFLOW` {#hpe_chunk_extensions_overflow}

**Adicionado em: v21.6.2, v20.11.1, v18.19.1**

Muitos dados foram recebidos para uma extensão de chunk. Para proteger contra clientes maliciosos ou mal configurados, se mais de 16 KiB de dados forem recebidos, um `Error` com este código será emitido.


### `HPE_HEADER_OVERFLOW` {#hpe_header_overflow}

::: info [Histórico]
| Versão | Alterações |
|---|---|
| v11.4.0, v10.15.0 | O tamanho máximo do cabeçalho em `http_parser` foi definido para 8 KiB. |
:::

Muitos dados de cabeçalho HTTP foram recebidos. Para proteger contra clientes maliciosos ou mal configurados, se mais do que `maxHeaderSize` de dados de cabeçalho HTTP forem recebidos, o parsing HTTP será abortado sem que um objeto de requisição ou resposta seja criado, e um `Error` com este código será emitido.

### `HPE_UNEXPECTED_CONTENT_LENGTH` {#hpe_unexpected_content_length}

O servidor está enviando um cabeçalho `Content-Length` e `Transfer-Encoding: chunked`.

`Transfer-Encoding: chunked` permite que o servidor mantenha uma conexão HTTP persistente para conteúdo gerado dinamicamente. Neste caso, o cabeçalho HTTP `Content-Length` não pode ser usado.

Use `Content-Length` ou `Transfer-Encoding: chunked`.

### `MODULE_NOT_FOUND` {#module_not_found}

::: info [Histórico]
| Versão | Alterações |
|---|---|
| v12.0.0 | Adicionada a propriedade `requireStack`. |
:::

Um arquivo de módulo não pôde ser resolvido pelo carregador de módulos CommonJS ao tentar uma operação [`require()`](/pt/nodejs/api/modules#requireid) ou ao carregar o ponto de entrada do programa.

## Códigos de erro legados do Node.js {#legacy-nodejs-error-codes}

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Esses códigos de erro são inconsistentes ou foram removidos.
:::

### `ERR_CANNOT_TRANSFER_OBJECT` {#err_cannot_transfer_object}

**Adicionado em: v10.5.0**

**Removido em: v12.5.0**

O valor passado para `postMessage()` continha um objeto que não é suportado para transferência.

### `ERR_CPU_USAGE` {#err_cpu_usage}

**Removido em: v15.0.0**

A chamada nativa de `process.cpuUsage` não pôde ser processada.

### `ERR_CRYPTO_HASH_DIGEST_NO_UTF16` {#err_crypto_hash_digest_no_utf16}

**Adicionado em: v9.0.0**

**Removido em: v12.12.0**

A codificação UTF-16 foi usada com [`hash.digest()`](/pt/nodejs/api/crypto#hashdigestencoding). Embora o método `hash.digest()` permita que um argumento `encoding` seja passado, fazendo com que o método retorne uma string em vez de um `Buffer`, a codificação UTF-16 (por exemplo, `ucs` ou `utf16le`) não é suportada.


### `ERR_CRYPTO_SCRYPT_INVALID_PARAMETER` {#err_crypto_scrypt_invalid_parameter}

**Removido em: v23.0.0**

Uma combinação incompatível de opções foi passada para [`crypto.scrypt()`](/pt/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) ou [`crypto.scryptSync()`](/pt/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options). Novas versões do Node.js usam o código de erro [`ERR_INCOMPATIBLE_OPTION_PAIR`](/pt/nodejs/api/errors#err_incompatible_option_pair) em vez disso, o que é consistente com outras APIs.

### `ERR_FS_INVALID_SYMLINK_TYPE` {#err_fs_invalid_symlink_type}

**Removido em: v23.0.0**

Um tipo de link simbólico inválido foi passado para os métodos [`fs.symlink()`](/pt/nodejs/api/fs#fssymlinktarget-path-type-callback) ou [`fs.symlinkSync()`](/pt/nodejs/api/fs#fssymlinksynctarget-path-type).

### `ERR_HTTP2_FRAME_ERROR` {#err_http2_frame_error}

**Adicionado em: v9.0.0**

**Removido em: v10.0.0**

Usado quando ocorre uma falha ao enviar um quadro individual na sessão HTTP/2.

### `ERR_HTTP2_HEADERS_OBJECT` {#err_http2_headers_object}

**Adicionado em: v9.0.0**

**Removido em: v10.0.0**

Usado quando um Objeto de Cabeçalhos HTTP/2 é esperado.

### `ERR_HTTP2_HEADER_REQUIRED` {#err_http2_header_required}

**Adicionado em: v9.0.0**

**Removido em: v10.0.0**

Usado quando um cabeçalho necessário está ausente em uma mensagem HTTP/2.

### `ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND` {#err_http2_info_headers_after_respond}

**Adicionado em: v9.0.0**

**Removido em: v10.0.0**

Os cabeçalhos informativos HTTP/2 devem ser enviados somente *antes* de chamar o método `Http2Stream.prototype.respond()`.

### `ERR_HTTP2_STREAM_CLOSED` {#err_http2_stream_closed}

**Adicionado em: v9.0.0**

**Removido em: v10.0.0**

Usado quando uma ação foi realizada em um Fluxo HTTP/2 que já foi fechado.

### `ERR_HTTP_INVALID_CHAR` {#err_http_invalid_char}

**Adicionado em: v9.0.0**

**Removido em: v10.0.0**

Usado quando um caractere inválido é encontrado em uma mensagem de status de resposta HTTP (frase de motivo).

### `ERR_IMPORT_ASSERTION_TYPE_FAILED` {#err_import_assertion_type_failed}

**Adicionado em: v17.1.0, v16.14.0**

**Removido em: v21.1.0**

Uma asserção de importação falhou, impedindo que o módulo especificado seja importado.

### `ERR_IMPORT_ASSERTION_TYPE_MISSING` {#err_import_assertion_type_missing}

**Adicionado em: v17.1.0, v16.14.0**

**Removido em: v21.1.0**

Uma asserção de importação está faltando, impedindo que o módulo especificado seja importado.


### `ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED` {#err_import_assertion_type_unsupported}

**Adicionado em: v17.1.0, v16.14.0**

**Removido em: v21.1.0**

Um atributo de importação não é suportado por esta versão do Node.js.

### `ERR_INDEX_OUT_OF_RANGE` {#err_index_out_of_range}

**Adicionado em: v10.0.0**

**Removido em: v11.0.0**

Um determinado índice estava fora do intervalo aceito (por exemplo, deslocamentos negativos).

### `ERR_INVALID_OPT_VALUE` {#err_invalid_opt_value}

**Adicionado em: v8.0.0**

**Removido em: v15.0.0**

Um valor inválido ou inesperado foi passado em um objeto de opções.

### `ERR_INVALID_OPT_VALUE_ENCODING` {#err_invalid_opt_value_encoding}

**Adicionado em: v9.0.0**

**Removido em: v15.0.0**

Uma codificação de arquivo inválida ou desconhecida foi passada.

### `ERR_INVALID_PERFORMANCE_MARK` {#err_invalid_performance_mark}

**Adicionado em: v8.5.0**

**Removido em: v16.7.0**

Ao usar a API Performance Timing (`perf_hooks`), uma marca de desempenho é inválida.

### `ERR_INVALID_TRANSFER_OBJECT` {#err_invalid_transfer_object}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.0.0 | Uma `DOMException` é lançada em vez disso. |
| v21.0.0 | Removido em: v21.0.0 |
:::

Um objeto de transferência inválido foi passado para `postMessage()`.

### `ERR_MANIFEST_ASSERT_INTEGRITY` {#err_manifest_assert_integrity}

**Removido em: v22.2.0**

Uma tentativa foi feita para carregar um recurso, mas o recurso não correspondia à integridade definida pelo manifesto de política. Consulte a documentação para manifestos de política para obter mais informações.

### `ERR_MANIFEST_DEPENDENCY_MISSING` {#err_manifest_dependency_missing}

**Removido em: v22.2.0**

Uma tentativa foi feita para carregar um recurso, mas o recurso não foi listado como uma dependência do local que tentou carregá-lo. Consulte a documentação para manifestos de política para obter mais informações.

### `ERR_MANIFEST_INTEGRITY_MISMATCH` {#err_manifest_integrity_mismatch}

**Removido em: v22.2.0**

Uma tentativa foi feita para carregar um manifesto de política, mas o manifesto tinha várias entradas para um recurso que não correspondiam umas às outras. Atualize as entradas do manifesto para corresponder a fim de resolver este erro. Consulte a documentação para manifestos de política para obter mais informações.

### `ERR_MANIFEST_INVALID_RESOURCE_FIELD` {#err_manifest_invalid_resource_field}

**Removido em: v22.2.0**

Um recurso de manifesto de política tinha um valor inválido para um de seus campos. Atualize a entrada do manifesto para corresponder a fim de resolver este erro. Consulte a documentação para manifestos de política para obter mais informações.


### `ERR_MANIFEST_INVALID_SPECIFIER` {#err_manifest_invalid_specifier}

**Removido em: v22.2.0**

Um recurso de manifesto de política tinha um valor inválido para um de seus mapeamentos de dependência. Atualize a entrada do manifesto para corresponder para resolver este erro. Consulte a documentação dos manifestos de política para obter mais informações.

### `ERR_MANIFEST_PARSE_POLICY` {#err_manifest_parse_policy}

**Removido em: v22.2.0**

Foi feita uma tentativa de carregar um manifesto de política, mas o manifesto não pôde ser analisado. Consulte a documentação dos manifestos de política para obter mais informações.

### `ERR_MANIFEST_TDZ` {#err_manifest_tdz}

**Removido em: v22.2.0**

Foi feita uma tentativa de ler de um manifesto de política, mas a inicialização do manifesto ainda não ocorreu. Isso provavelmente é um bug no Node.js.

### `ERR_MANIFEST_UNKNOWN_ONERROR` {#err_manifest_unknown_onerror}

**Removido em: v22.2.0**

Um manifesto de política foi carregado, mas tinha um valor desconhecido para seu comportamento "onerror". Consulte a documentação dos manifestos de política para obter mais informações.

### `ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST` {#err_missing_message_port_in_transfer_list}

**Removido em: v15.0.0**

Este código de erro foi substituído por [`ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST`](/pt/nodejs/api/errors#err_missing_transferable_in_transfer_list) no Node.js v15.0.0, porque não é mais preciso, pois outros tipos de objetos transferíveis também existem agora.

### `ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST` {#err_missing_transferable_in_transfer_list}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.0.0 | Uma `DOMException` é lançada em vez disso. |
| v21.0.0 | Removido em: v21.0.0 |
| v15.0.0 | Adicionado em: v15.0.0 |
:::

Um objeto que precisa ser explicitamente listado no argumento `transferList` está no objeto passado para uma chamada [`postMessage()`](/pt/nodejs/api/worker_threads#portpostmessagevalue-transferlist), mas não é fornecido no `transferList` para essa chamada. Normalmente, este é um `MessagePort`.

Nas versões do Node.js anteriores à v15.0.0, o código de erro usado aqui era [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/pt/nodejs/api/errors#err_missing_message_port_in_transfer_list). No entanto, o conjunto de tipos de objetos transferíveis foi expandido para cobrir mais tipos do que `MessagePort`.

### `ERR_NAPI_CONS_PROTOTYPE_OBJECT` {#err_napi_cons_prototype_object}

**Adicionado em: v9.0.0**

**Removido em: v10.0.0**

Usado pela `Node-API` quando `Constructor.prototype` não é um objeto.


### `ERR_NAPI_TSFN_START_IDLE_LOOP` {#err_napi_tsfn_start_idle_loop}

**Adicionado em: v10.6.0, v8.16.0**

**Removido em: v14.2.0, v12.17.0**

Na thread principal, os valores são removidos da fila associada à função thread-safe em um loop ocioso. Este erro indica que ocorreu um erro ao tentar iniciar o loop.

### `ERR_NAPI_TSFN_STOP_IDLE_LOOP` {#err_napi_tsfn_stop_idle_loop}

**Adicionado em: v10.6.0, v8.16.0**

**Removido em: v14.2.0, v12.17.0**

Assim que não houver mais itens na fila, o loop ocioso deve ser suspenso. Este erro indica que o loop ocioso não conseguiu parar.

### `ERR_NO_LONGER_SUPPORTED` {#err_no_longer_supported}

Uma API do Node.js foi chamada de forma não suportada, como `Buffer.write(string, encoding, offset[, length])`.

### `ERR_OUTOFMEMORY` {#err_outofmemory}

**Adicionado em: v9.0.0**

**Removido em: v10.0.0**

Usado genericamente para identificar que uma operação causou uma condição de falta de memória.

### `ERR_PARSE_HISTORY_DATA` {#err_parse_history_data}

**Adicionado em: v9.0.0**

**Removido em: v10.0.0**

O módulo `node:repl` não conseguiu analisar dados do arquivo de histórico do REPL.

### `ERR_SOCKET_CANNOT_SEND` {#err_socket_cannot_send}

**Adicionado em: v9.0.0**

**Removido em: v14.0.0**

Os dados não puderam ser enviados em um socket.

### `ERR_STDERR_CLOSE` {#err_stderr_close}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.12.0 | Em vez de emitir um erro, `process.stderr.end()` agora apenas fecha o lado do fluxo, mas não o recurso subjacente, tornando este erro obsoleto. |
| v10.12.0 | Removido em: v10.12.0 |
:::

Foi feita uma tentativa de fechar o fluxo `process.stderr`. Por design, o Node.js não permite que os fluxos `stdout` ou `stderr` sejam fechados pelo código do usuário.

### `ERR_STDOUT_CLOSE` {#err_stdout_close}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.12.0 | Em vez de emitir um erro, `process.stderr.end()` agora apenas fecha o lado do fluxo, mas não o recurso subjacente, tornando este erro obsoleto. |
| v10.12.0 | Removido em: v10.12.0 |
:::

Foi feita uma tentativa de fechar o fluxo `process.stdout`. Por design, o Node.js não permite que os fluxos `stdout` ou `stderr` sejam fechados pelo código do usuário.

### `ERR_STREAM_READ_NOT_IMPLEMENTED` {#err_stream_read_not_implemented}

**Adicionado em: v9.0.0**

**Removido em: v10.0.0**

Usado quando uma tentativa é feita para usar um fluxo legível que não implementou [`readable._read()`](/pt/nodejs/api/stream#readable_readsize).


### `ERR_TLS_RENEGOTIATION_FAILED` {#err_tls_renegotiation_failed}

**Adicionado em: v9.0.0**

**Removido em: v10.0.0**

Usado quando uma solicitação de renegociação TLS falhou de uma forma não específica.

### `ERR_TRANSFERRING_EXTERNALIZED_SHAREDARRAYBUFFER` {#err_transferring_externalized_sharedarraybuffer}

**Adicionado em: v10.5.0**

**Removido em: v14.0.0**

Um `SharedArrayBuffer` cuja memória não é gerenciada pelo mecanismo JavaScript ou pelo Node.js foi encontrado durante a serialização. Tal `SharedArrayBuffer` não pode ser serializado.

Isso só pode acontecer quando complementos nativos criam `SharedArrayBuffer`s no modo "externalizado" ou colocam `SharedArrayBuffer`s existentes no modo externalizado.

### `ERR_UNKNOWN_STDIN_TYPE` {#err_unknown_stdin_type}

**Adicionado em: v8.0.0**

**Removido em: v11.7.0**

Uma tentativa foi feita para iniciar um processo Node.js com um tipo de arquivo `stdin` desconhecido. Este erro geralmente é uma indicação de um bug dentro do próprio Node.js, embora seja possível que o código do usuário o acione.

### `ERR_UNKNOWN_STREAM_TYPE` {#err_unknown_stream_type}

**Adicionado em: v8.0.0**

**Removido em: v11.7.0**

Uma tentativa foi feita para iniciar um processo Node.js com um tipo de arquivo `stdout` ou `stderr` desconhecido. Este erro geralmente é uma indicação de um bug dentro do próprio Node.js, embora seja possível que o código do usuário o acione.

### `ERR_V8BREAKITERATOR` {#err_v8breakiterator}

A API V8 `BreakIterator` foi usada, mas o conjunto de dados ICU completo não está instalado.

### `ERR_VALUE_OUT_OF_RANGE` {#err_value_out_of_range}

**Adicionado em: v9.0.0**

**Removido em: v10.0.0**

Usado quando um determinado valor está fora do intervalo aceito.

### `ERR_VM_MODULE_LINKING_ERRORED` {#err_vm_module_linking_errored}

**Adicionado em: v10.0.0**

**Removido em: v18.1.0, v16.17.0**

A função de linker retornou um módulo para o qual a vinculação falhou.

### `ERR_VM_MODULE_NOT_LINKED` {#err_vm_module_not_linked}

O módulo deve ser vinculado com sucesso antes da instanciação.

### `ERR_WORKER_UNSUPPORTED_EXTENSION` {#err_worker_unsupported_extension}

**Adicionado em: v11.0.0**

**Removido em: v16.9.0**

O nome do caminho usado para o script principal de um worker tem uma extensão de arquivo desconhecida.

### `ERR_ZLIB_BINDING_CLOSED` {#err_zlib_binding_closed}

**Adicionado em: v9.0.0**

**Removido em: v10.0.0**

Usado quando uma tentativa é feita para usar um objeto `zlib` depois que ele já foi fechado.


## Códigos de Erro OpenSSL {#openssl-error-codes}

### Erros de Validade de Tempo {#time-validity-errors}

#### `CERT_NOT_YET_VALID` {#cert_not_yet_valid}

O certificado ainda não é válido: a data notBefore é posterior à hora atual.

#### `CERT_HAS_EXPIRED` {#cert_has_expired}

O certificado expirou: a data notAfter é anterior à hora atual.

#### `CRL_NOT_YET_VALID` {#crl_not_yet_valid}

A lista de revogação de certificados (CRL) tem uma data de emissão futura.

#### `CRL_HAS_EXPIRED` {#crl_has_expired}

A lista de revogação de certificados (CRL) expirou.

#### `CERT_REVOKED` {#cert_revoked}

O certificado foi revogado; ele está em uma lista de revogação de certificados (CRL).

### Erros Relacionados à Confiança ou Cadeia {#trust-or-chain-related-errors}

#### `UNABLE_TO_GET_ISSUER_CERT` {#unable_to_get_issuer_cert}

O certificado emissor de um certificado procurado não pôde ser encontrado. Isso normalmente significa que a lista de certificados confiáveis não está completa.

#### `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` {#unable_to_get_issuer_cert_locally}

O emissor do certificado não é conhecido. Este é o caso se o emissor não estiver incluído na lista de certificados confiáveis.

#### `DEPTH_ZERO_SELF_SIGNED_CERT` {#depth_zero_self_signed_cert}

O certificado passado é autoassinado e o mesmo certificado não pode ser encontrado na lista de certificados confiáveis.

#### `SELF_SIGNED_CERT_IN_CHAIN` {#self_signed_cert_in_chain}

O emissor do certificado não é conhecido. Este é o caso se o emissor não estiver incluído na lista de certificados confiáveis.

#### `CERT_CHAIN_TOO_LONG` {#cert_chain_too_long}

O comprimento da cadeia de certificados é maior que a profundidade máxima.

#### `UNABLE_TO_GET_CRL` {#unable_to_get_crl}

A CRL referenciada pelo certificado não pôde ser encontrada.

#### `UNABLE_TO_VERIFY_LEAF_SIGNATURE` {#unable_to_verify_leaf_signature}

Nenhuma assinatura pôde ser verificada porque a cadeia contém apenas um certificado e não é autoassinado.

#### `CERT_UNTRUSTED` {#cert_untrusted}

A autoridade de certificação (CA) raiz não está marcada como confiável para o propósito especificado.

### Erros de Extensão Básica {#basic-extension-errors}

#### `INVALID_CA` {#invalid_ca}

Um certificado CA é inválido. Ou não é uma CA ou suas extensões não são consistentes com o propósito fornecido.

#### `PATH_LENGTH_EXCEEDED` {#path_length_exceeded}

O parâmetro pathlength basicConstraints foi excedido.

### Erros Relacionados ao Nome {#name-related-errors}

#### `HOSTNAME_MISMATCH` {#hostname_mismatch}

O certificado não corresponde ao nome fornecido.

### Erros de Uso e Política {#usage-and-policy-errors}


#### `INVALID_PURPOSE` {#invalid_purpose}

O certificado fornecido não pode ser usado para o propósito especificado.

#### `CERT_REJECTED` {#cert_rejected}

A CA raiz está marcada para rejeitar o propósito especificado.

### Erros de Formatação {#formatting-errors}

#### `CERT_SIGNATURE_FAILURE` {#cert_signature_failure}

A assinatura do certificado é inválida.

#### `CRL_SIGNATURE_FAILURE` {#crl_signature_failure}

A assinatura da lista de revogação de certificados (CRL) é inválida.

#### `ERROR_IN_CERT_NOT_BEFORE_FIELD` {#error_in_cert_not_before_field}

O campo notBefore do certificado contém um tempo inválido.

#### `ERROR_IN_CERT_NOT_AFTER_FIELD` {#error_in_cert_not_after_field}

O campo notAfter do certificado contém um tempo inválido.

#### `ERROR_IN_CRL_LAST_UPDATE_FIELD` {#error_in_crl_last_update_field}

O campo lastUpdate da CRL contém um tempo inválido.

#### `ERROR_IN_CRL_NEXT_UPDATE_FIELD` {#error_in_crl_next_update_field}

O campo nextUpdate da CRL contém um tempo inválido.

#### `UNABLE_TO_DECRYPT_CERT_SIGNATURE` {#unable_to_decrypt_cert_signature}

A assinatura do certificado não pôde ser descriptografada. Isso significa que o valor real da assinatura não pôde ser determinado, em vez de não corresponder ao valor esperado; isso só é significativo para chaves RSA.

#### `UNABLE_TO_DECRYPT_CRL_SIGNATURE` {#unable_to_decrypt_crl_signature}

A assinatura da lista de revogação de certificados (CRL) não pôde ser descriptografada: isso significa que o valor real da assinatura não pôde ser determinado, em vez de não corresponder ao valor esperado.

#### `UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY` {#unable_to_decode_issuer_public_key}

A chave pública no SubjectPublicKeyInfo do certificado não pôde ser lida.

### Outros Erros do OpenSSL {#other-openssl-errors}

#### `OUT_OF_MEM` {#out_of_mem}

Ocorreu um erro ao tentar alocar memória. Isso nunca deveria acontecer.

