---
title: Documentação do Node.js - Readline
description: O módulo readline do Node.js fornece uma interface para ler dados de um fluxo legível (como process.stdin) uma linha de cada vez. Ele suporta a criação de interfaces para leitura de entrada do console, manipulação de entrada do usuário e gerenciamento de operações linha por linha.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Readline | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo readline do Node.js fornece uma interface para ler dados de um fluxo legível (como process.stdin) uma linha de cada vez. Ele suporta a criação de interfaces para leitura de entrada do console, manipulação de entrada do usuário e gerenciamento de operações linha por linha.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Readline | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo readline do Node.js fornece uma interface para ler dados de um fluxo legível (como process.stdin) uma linha de cada vez. Ele suporta a criação de interfaces para leitura de entrada do console, manipulação de entrada do usuário e gerenciamento de operações linha por linha.
---


# Readline {#readline}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código-fonte:** [lib/readline.js](https://github.com/nodejs/node/blob/v23.5.0/lib/readline.js)

O módulo `node:readline` fornece uma interface para ler dados de um fluxo [Readable](/pt/nodejs/api/stream#readable-streams) (como [`process.stdin`](/pt/nodejs/api/process#processstdin)) uma linha de cada vez.

Para usar as APIs baseadas em promessa:

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
```

```js [CJS]
const readline = require('node:readline/promises');
```
:::

Para usar as APIs de callback e síncronas:

::: code-group
```js [ESM]
import * as readline from 'node:readline';
```

```js [CJS]
const readline = require('node:readline');
```
:::

O exemplo simples a seguir ilustra o uso básico do módulo `node:readline`.

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const answer = await rl.question('O que você acha do Node.js? ');

console.log(`Obrigado pelo seu valioso feedback: ${answer}`);

rl.close();
```

```js [CJS]
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('O que você acha do Node.js? ', (answer) => {
  // TODO: Registre a resposta em um banco de dados
  console.log(`Obrigado pelo seu valioso feedback: ${answer}`);

  rl.close();
});
```
:::

Uma vez que este código é invocado, a aplicação Node.js não terminará até que o `readline.Interface` seja fechado porque a interface espera que os dados sejam recebidos no fluxo `input`.

## Classe: `InterfaceConstructor` {#class-interfaceconstructor}

**Adicionado em: v0.1.104**

- Estende: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Instâncias da classe `InterfaceConstructor` são construídas usando o método `readlinePromises.createInterface()` ou `readline.createInterface()`. Cada instância é associada a um único fluxo `input` [Readable](/pt/nodejs/api/stream#readable-streams) e a um único fluxo `output` [Writable](/pt/nodejs/api/stream#writable-streams). O fluxo `output` é usado para imprimir prompts para entrada do usuário que chega e é lida do fluxo `input`.


### Evento: `'close'` {#event-close}

**Adicionado em: v0.1.98**

O evento `'close'` é emitido quando uma das seguintes situações ocorre:

- O método `rl.close()` é chamado e a instância `InterfaceConstructor` renunciou ao controle sobre os fluxos `input` e `output`;
- O fluxo `input` recebe seu evento `'end'`;
- O fluxo `input` recebe + para sinalizar fim de transmissão (EOT);
- O fluxo `input` recebe + para sinalizar `SIGINT` e não há um ouvinte de evento `'SIGINT'` registrado na instância `InterfaceConstructor`.

A função ouvinte é chamada sem passar nenhum argumento.

A instância `InterfaceConstructor` é finalizada quando o evento `'close'` é emitido.

### Evento: `'line'` {#event-line}

**Adicionado em: v0.1.98**

O evento `'line'` é emitido sempre que o fluxo `input` recebe uma entrada de fim de linha (`\n`, `\r` ou `\r\n`). Isso geralmente ocorre quando o usuário pressiona  ou .

O evento `'line'` também é emitido se novos dados foram lidos de um fluxo e esse fluxo termina sem um marcador final de fim de linha.

A função ouvinte é chamada com uma string contendo a única linha de entrada recebida.

```js [ESM]
rl.on('line', (input) => {
  console.log(`Received: ${input}`);
});
```
### Evento: `'history'` {#event-history}

**Adicionado em: v15.8.0, v14.18.0**

O evento `'history'` é emitido sempre que o array de histórico é alterado.

A função ouvinte é chamada com um array contendo o array de histórico. Ele refletirá todas as alterações, linhas adicionadas e linhas removidas devido a `historySize` e `removeHistoryDuplicates`.

O objetivo principal é permitir que um ouvinte persista o histórico. Também é possível para o ouvinte alterar o objeto de histórico. Isso pode ser útil para evitar que certas linhas sejam adicionadas ao histórico, como uma senha.

```js [ESM]
rl.on('history', (history) => {
  console.log(`Received: ${history}`);
});
```
### Evento: `'pause'` {#event-pause}

**Adicionado em: v0.7.5**

O evento `'pause'` é emitido quando uma das seguintes situações ocorre:

- O fluxo `input` é pausado.
- O fluxo `input` não está pausado e recebe o evento `'SIGCONT'`. (Consulte os eventos [`'SIGTSTP'`](/pt/nodejs/api/readline#event-sigtstp) e [`'SIGCONT'`](/pt/nodejs/api/readline#event-sigcont).)

A função ouvinte é chamada sem passar nenhum argumento.

```js [ESM]
rl.on('pause', () => {
  console.log('Readline paused.');
});
```

### Evento: `'resume'` {#event-resume}

**Adicionado em: v0.7.5**

O evento `'resume'` é emitido sempre que o fluxo `input` é retomado.

A função de listener é chamada sem passar quaisquer argumentos.

```js [ESM]
rl.on('resume', () => {
  console.log('Readline retomado.');
});
```
### Evento: `'SIGCONT'` {#event-sigcont}

**Adicionado em: v0.7.5**

O evento `'SIGCONT'` é emitido quando um processo Node.js previamente movido para o segundo plano usando + (ou seja, `SIGTSTP`) é então trazido de volta para o primeiro plano usando [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p).

Se o fluxo `input` foi pausado *antes* da requisição `SIGTSTP`, este evento não será emitido.

A função de listener é invocada sem passar quaisquer argumentos.

```js [ESM]
rl.on('SIGCONT', () => {
  // `prompt` irá automaticamente retomar o fluxo
  rl.prompt();
});
```
O evento `'SIGCONT'` *não* é suportado no Windows.

### Evento: `'SIGINT'` {#event-sigint}

**Adicionado em: v0.3.0**

O evento `'SIGINT'` é emitido sempre que o fluxo `input` recebe uma entrada , conhecido tipicamente como `SIGINT`. Se não houver listeners de evento `'SIGINT'` registrados quando o fluxo `input` recebe um `SIGINT`, o evento `'pause'` será emitido.

A função de listener é invocada sem passar quaisquer argumentos.

```js [ESM]
rl.on('SIGINT', () => {
  rl.question('Tem certeza que deseja sair? ', (answer) => {
    if (answer.match(/^y(es)?$/i)) rl.pause();
  });
});
```
### Evento: `'SIGTSTP'` {#event-sigtstp}

**Adicionado em: v0.7.5**

O evento `'SIGTSTP'` é emitido quando o fluxo `input` recebe uma entrada +, tipicamente conhecido como `SIGTSTP`. Se não houver listeners de evento `'SIGTSTP'` registrados quando o fluxo `input` recebe um `SIGTSTP`, o processo Node.js será enviado para o segundo plano.

Quando o programa é retomado usando [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p), os eventos `'pause'` e `'SIGCONT'` serão emitidos. Estes podem ser usados para retomar o fluxo `input`.

Os eventos `'pause'` e `'SIGCONT'` não serão emitidos se o `input` foi pausado antes do processo ser enviado para o segundo plano.

A função de listener é invocada sem passar quaisquer argumentos.

```js [ESM]
rl.on('SIGTSTP', () => {
  // Isso irá sobrepor SIGTSTP e evitar que o programa vá para o
  // segundo plano.
  console.log('Capturado SIGTSTP.');
});
```
O evento `'SIGTSTP'` *não* é suportado no Windows.


### `rl.close()` {#rlclose}

**Adicionado em: v0.1.98**

O método `rl.close()` fecha a instância de `InterfaceConstructor` e cede o controle sobre os fluxos de `input` e `output`. Quando chamado, o evento `'close'` será emitido.

Chamar `rl.close()` não interrompe imediatamente outros eventos (incluindo `'line'`) de serem emitidos pela instância de `InterfaceConstructor`.

### `rl.pause()` {#rlpause}

**Adicionado em: v0.3.4**

O método `rl.pause()` pausa o fluxo de `input`, permitindo que seja retomado posteriormente, se necessário.

Chamar `rl.pause()` não pausa imediatamente outros eventos (incluindo `'line'`) de serem emitidos pela instância de `InterfaceConstructor`.

### `rl.prompt([preserveCursor])` {#rlpromptpreservecursor}

**Adicionado em: v0.1.98**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Data_structures#Tipo_Boolean) Se `true`, impede que a posição do cursor seja redefinida para `0`.

O método `rl.prompt()` escreve o `prompt` configurado nas instâncias de `InterfaceConstructor` em uma nova linha em `output` para fornecer ao usuário um novo local para fornecer entrada.

Quando chamado, `rl.prompt()` retomará o fluxo de `input` se ele tiver sido pausado.

Se o `InterfaceConstructor` foi criado com `output` definido como `null` ou `undefined`, o prompt não é escrito.

### `rl.resume()` {#rlresume}

**Adicionado em: v0.3.4**

O método `rl.resume()` retoma o fluxo de `input` se ele tiver sido pausado.

### `rl.setPrompt(prompt)` {#rlsetpromptprompt}

**Adicionado em: v0.1.98**

- `prompt` [\<string\>](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Data_structures#Tipo_String)

O método `rl.setPrompt()` define o prompt que será escrito em `output` sempre que `rl.prompt()` for chamado.

### `rl.getPrompt()` {#rlgetprompt}

**Adicionado em: v15.3.0, v14.17.0**

- Retorna: [\<string\>](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Data_structures#Tipo_String) a string de prompt atual

O método `rl.getPrompt()` retorna o prompt atual usado por `rl.prompt()`.

### `rl.write(data[, key])` {#rlwritedata-key}

**Adicionado em: v0.1.98**

- `data` [\<string\>](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Data_structures#Tipo_String)
- `key` [\<Object\>](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ctrl` [\<boolean\>](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Data_structures#Tipo_Boolean) `true` para indicar a tecla Ctrl.
    - `meta` [\<boolean\>](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Data_structures#Tipo_Boolean) `true` para indicar a tecla Meta.
    - `shift` [\<boolean\>](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Data_structures#Tipo_Boolean) `true` para indicar a tecla Shift.
    - `name` [\<string\>](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Data_structures#Tipo_String) O nome de uma tecla.



O método `rl.write()` escreverá `data` ou uma sequência de teclas identificada por `key` para o `output`. O argumento `key` é suportado apenas se `output` for um terminal de texto [TTY](/pt/nodejs/api/tty). Consulte [Vinculações de teclas TTY](/pt/nodejs/api/readline#tty-keybindings) para obter uma lista de combinações de teclas.

Se `key` for especificado, `data` será ignorado.

Quando chamado, `rl.write()` retomará o fluxo de `input` se ele tiver sido pausado.

Se o `InterfaceConstructor` foi criado com `output` definido como `null` ou `undefined`, os `data` e `key` não são escritos.

```js [ESM]
rl.write('Delete this!');
// Simulate Ctrl+U to delete the line written previously
rl.write(null, { ctrl: true, name: 'u' });
```
O método `rl.write()` escreverá os dados para o `input` da `Interface` do `readline` *como se fosse fornecido pelo usuário*.


### `rl[Symbol.asyncIterator]()` {#rlsymbolasynciterator}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v11.14.0, v10.17.0 | O suporte a Symbol.asyncIterator não é mais experimental. |
| v11.4.0, v10.16.0 | Adicionado em: v11.4.0, v10.16.0 |
:::

- Retorna: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)

Cria um objeto `AsyncIterator` que itera por cada linha no fluxo de entrada como uma string. Este método permite a iteração assíncrona de objetos `InterfaceConstructor` através de loops `for await...of`.

Erros no fluxo de entrada não são encaminhados.

Se o loop for terminado com `break`, `throw` ou `return`, [`rl.close()`](/pt/nodejs/api/readline#rlclose) será chamado. Em outras palavras, iterar sobre um `InterfaceConstructor` sempre consumirá o fluxo de entrada por completo.

O desempenho não está no mesmo nível da API tradicional de evento `'line'`. Use `'line'` em vez disso para aplicações sensíveis ao desempenho.

```js [ESM]
async function processLineByLine() {
  const rl = readline.createInterface({
    // ...
  });

  for await (const line of rl) {
    // Cada linha na entrada do readline estará sucessivamente disponível aqui como
    // `line`.
  }
}
```
`readline.createInterface()` começará a consumir o fluxo de entrada assim que invocado. Ter operações assíncronas entre a criação da interface e a iteração assíncrona pode resultar em linhas perdidas.

### `rl.line` {#rlline}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.8.0, v14.18.0 | O valor sempre será uma string, nunca indefinido. |
| v0.1.98 | Adicionado em: v0.1.98 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Os dados de entrada atuais sendo processados pelo node.

Isso pode ser usado ao coletar entrada de um fluxo TTY para recuperar o valor atual que foi processado até o momento, antes que o evento `line` seja emitido. Uma vez que o evento `line` foi emitido, esta propriedade será uma string vazia.

Esteja ciente de que modificar o valor durante o tempo de execução da instância pode ter consequências não intencionais se `rl.cursor` também não for controlado.

**Se não estiver usando um fluxo TTY para entrada, use o <a href="#event-line">evento <code>'line'</code></a>.**

Um possível caso de uso seria o seguinte:

```js [ESM]
const values = ['lorem ipsum', 'dolor sit amet'];
const rl = readline.createInterface(process.stdin);
const showResults = debounce(() => {
  console.log(
    '\n',
    values.filter((val) => val.startsWith(rl.line)).join(' '),
  );
}, 300);
process.stdin.on('keypress', (c, k) => {
  showResults();
});
```

### `rl.cursor` {#rlcursor}

**Adicionado em: v0.1.98**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

A posição do cursor relativa a `rl.line`.

Isso rastreará onde o cursor atual está na string de entrada, ao ler a entrada de um fluxo TTY. A posição do cursor determina a porção da string de entrada que será modificada conforme a entrada é processada, bem como a coluna onde o cursor do terminal será renderizado.

### `rl.getCursorPos()` {#rlgetcursorpos}

**Adicionado em: v13.5.0, v12.16.0**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `rows` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) a linha do prompt onde o cursor está atualmente
    - `cols` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) a coluna da tela onde o cursor está atualmente
  
 

Retorna a posição real do cursor em relação ao prompt de entrada + string. Strings de entrada longas (quebras) e prompts de várias linhas estão incluídos nos cálculos.

## API de Promises {#promises-api}

**Adicionado em: v17.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

### Classe: `readlinePromises.Interface` {#class-readlinepromisesinterface}

**Adicionado em: v17.0.0**

- Estende: [\<readline.InterfaceConstructor\>](/pt/nodejs/api/readline#class-interfaceconstructor)

As instâncias da classe `readlinePromises.Interface` são construídas usando o método `readlinePromises.createInterface()`. Cada instância está associada a um único fluxo `input` [Readable](/pt/nodejs/api/stream#readable-streams) e um único fluxo `output` [Writable](/pt/nodejs/api/stream#writable-streams). O fluxo `output` é usado para imprimir prompts para entrada do usuário que chega e é lida do fluxo `input`.


#### `rl.question(query[, options])` {#rlquestionquery-options}

**Adicionado em: v17.0.0**

- `query` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma declaração ou consulta para escrever para `output`, prefixada ao prompt.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite opcionalmente que o `question()` seja cancelado usando um `AbortSignal`.


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Uma promise que é cumprida com a entrada do usuário em resposta à `query`.

O método `rl.question()` exibe a `query` escrevendo-a para o `output`, espera que a entrada do usuário seja fornecida em `input`, então invoca a função `callback` passando a entrada fornecida como o primeiro argumento.

Quando chamado, `rl.question()` retomará o fluxo `input` se ele tiver sido pausado.

Se o `readlinePromises.Interface` foi criado com `output` definido como `null` ou `undefined`, a `query` não é escrita.

Se a pergunta for chamada após `rl.close()`, ela retorna uma promise rejeitada.

Exemplo de uso:

```js [ESM]
const answer = await rl.question('Qual é a sua comida favorita? ');
console.log(`Ah, então sua comida favorita é ${answer}`);
```
Usando um `AbortSignal` para cancelar uma pergunta.

```js [ESM]
const signal = AbortSignal.timeout(10_000);

signal.addEventListener('abort', () => {
  console.log('A pergunta sobre comida expirou');
}, { once: true });

const answer = await rl.question('Qual é a sua comida favorita? ', { signal });
console.log(`Ah, então sua comida favorita é ${answer}`);
```
### Classe: `readlinePromises.Readline` {#class-readlinepromisesreadline}

**Adicionado em: v17.0.0**

#### `new readlinePromises.Readline(stream[, options])` {#new-readlinepromisesreadlinestream-options}

**Adicionado em: v17.0.0**

- `stream` [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable) Um fluxo [TTY](/pt/nodejs/api/tty).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `autoCommit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, não é necessário chamar `rl.commit()`.


#### `rl.clearLine(dir)` {#rlclearlinedir}

**Adicionado em: v17.0.0**

- `dir` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: para a esquerda do cursor
    - `1`: para a direita do cursor
    - `0`: a linha inteira
  
 
- Retorna: this

O método `rl.clearLine()` adiciona à lista interna de ação pendente uma ação que limpa a linha atual do `stream` associado em uma direção especificada identificada por `dir`. Chame `rl.commit()` para ver o efeito deste método, a menos que `autoCommit: true` tenha sido passado para o construtor.

#### `rl.clearScreenDown()` {#rlclearscreendown}

**Adicionado em: v17.0.0**

- Retorna: this

O método `rl.clearScreenDown()` adiciona à lista interna de ação pendente uma ação que limpa o stream associado da posição atual do cursor para baixo. Chame `rl.commit()` para ver o efeito deste método, a menos que `autoCommit: true` tenha sido passado para o construtor.

#### `rl.commit()` {#rlcommit}

**Adicionado em: v17.0.0**

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

O método `rl.commit()` envia todas as ações pendentes para o `stream` associado e limpa a lista interna de ações pendentes.

#### `rl.cursorTo(x[, y])` {#rlcursortox-y}

**Adicionado em: v17.0.0**

- `x` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retorna: this

O método `rl.cursorTo()` adiciona à lista interna de ação pendente uma ação que move o cursor para a posição especificada no `stream` associado. Chame `rl.commit()` para ver o efeito deste método, a menos que `autoCommit: true` tenha sido passado para o construtor.

#### `rl.moveCursor(dx, dy)` {#rlmovecursordx-dy}

**Adicionado em: v17.0.0**

- `dx` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retorna: this

O método `rl.moveCursor()` adiciona à lista interna de ação pendente uma ação que move o cursor *relativo* à sua posição atual no `stream` associado. Chame `rl.commit()` para ver o efeito deste método, a menos que `autoCommit: true` tenha sido passado para o construtor.


#### `rl.rollback()` {#rlrollback}

**Adicionado em: v17.0.0**

- Retorna: this

O método `rl.rollback` limpa a lista interna de ações pendentes sem enviá-la para o `stream` associado.

### `readlinePromises.createInterface(options)` {#readlinepromisescreateinterfaceoptions}

**Adicionado em: v17.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable) O stream [Readable](/pt/nodejs/api/stream#readable-streams) para escutar. Esta opção é *obrigatória*.
    - `output` [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable) O stream [Writable](/pt/nodejs/api/stream#writable-streams) para gravar dados de readline.
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função opcional usada para a autocompletação por Tab.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se os streams `input` e `output` devem ser tratados como um TTY e ter códigos de escape ANSI/VT100 gravados nele. **Padrão:** verifica `isTTY` no stream `output` após a instanciação.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista inicial de linhas do histórico. Esta opção faz sentido apenas se `terminal` estiver definido como `true` pelo usuário ou por uma verificação interna de `output`, caso contrário, o mecanismo de cache do histórico não é inicializado. **Padrão:** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número máximo de linhas de histórico retidas. Para desativar o histórico, defina este valor como `0`. Esta opção faz sentido apenas se `terminal` estiver definido como `true` pelo usuário ou por uma verificação interna de `output`, caso contrário, o mecanismo de cache do histórico não é inicializado. **Padrão:** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, quando uma nova linha de entrada adicionada à lista de histórico duplica uma linha mais antiga, isso remove a linha mais antiga da lista. **Padrão:** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A string de prompt a ser usada. **Padrão:** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se o atraso entre `\r` e `\n` exceder `crlfDelay` milissegundos, ambos `\r` e `\n` serão tratados como entrada de fim de linha separada. `crlfDelay` será forçado a um número não inferior a `100`. Ele pode ser definido como `Infinity`, caso em que `\r` seguido por `\n` sempre será considerado uma única nova linha (o que pode ser razoável para [ler arquivos](/pt/nodejs/api/readline#example-read-file-stream-line-by-line) com delimitador de linha `\r\n`). **Padrão:** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A duração que `readlinePromises` aguardará por um caractere (ao ler uma sequência de teclas ambígua em milissegundos, uma que pode formar uma sequência de teclas completa usando a entrada lida até agora e pode receber entrada adicional para completar uma sequência de teclas mais longa). **Padrão:** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de espaços que uma tabulação é igual (mínimo 1). **Padrão:** `8`.


- Retorna: [\<readlinePromises.Interface\>](/pt/nodejs/api/readline#class-readlinepromisesinterface)

O método `readlinePromises.createInterface()` cria uma nova instância de `readlinePromises.Interface`.



::: code-group
```js [ESM]
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline/promises');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

Depois que a instância de `readlinePromises.Interface` é criada, o caso mais comum é escutar o evento `'line'`:

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
Se `terminal` for `true` para esta instância, o stream `output` obterá a melhor compatibilidade se definir uma propriedade `output.columns` e emitir um evento `'resize'` no `output` se ou quando as colunas alguma vez mudarem ([`process.stdout`](/pt/nodejs/api/process#processstdout) faz isso automaticamente quando é um TTY).


#### Uso da função `completer` {#use-of-the-completer-function}

A função `completer` recebe a linha atual inserida pelo usuário como um argumento e retorna um `Array` com 2 entradas:

- Um `Array` com entradas correspondentes para a conclusão.
- A substring que foi usada para a correspondência.

Por exemplo: `[[substr1, substr2, ...], originalsubstring]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : completions, line];
}
```
A função `completer` também pode retornar um [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), ou ser assíncrona:

```js [ESM]
async function completer(linePartial) {
  await someAsyncWork();
  return [['123'], linePartial];
}
```
## API de Callback {#callback-api}

**Adicionado em: v0.1.104**

### Classe: `readline.Interface` {#class-readlineinterface}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.0.0 | A classe `readline.Interface` agora herda de `Interface`. |
| v0.1.104 | Adicionado em: v0.1.104 |
:::

- Estende: [\<readline.InterfaceConstructor\>](/pt/nodejs/api/readline#class-interfaceconstructor)

Instâncias da classe `readline.Interface` são construídas usando o método `readline.createInterface()`. Cada instância é associada a um único fluxo `input` [Readable](/pt/nodejs/api/stream#readable-streams) e um único fluxo `output` [Writable](/pt/nodejs/api/stream#writable-streams). O fluxo `output` é usado para imprimir prompts para a entrada do usuário que chega e é lida do fluxo `input`.

#### `rl.question(query[, options], callback)` {#rlquestionquery-options-callback}

**Adicionado em: v0.3.3**

- `query` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma declaração ou consulta para escrever em `output`, anexada ao prompt.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Opcionalmente, permite que o `question()` seja cancelado usando um `AbortController`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função de callback que é invocada com a entrada do usuário em resposta à `query`.

O método `rl.question()` exibe a `query` escrevendo-a no `output`, espera que a entrada do usuário seja fornecida em `input` e, em seguida, invoca a função `callback` passando a entrada fornecida como o primeiro argumento.

Quando chamado, `rl.question()` retomará o fluxo `input` se ele tiver sido pausado.

Se o `readline.Interface` foi criado com `output` definido como `null` ou `undefined`, a `query` não é escrita.

A função `callback` passada para `rl.question()` não segue o padrão típico de aceitar um objeto `Error` ou `null` como o primeiro argumento. O `callback` é chamado com a resposta fornecida como o único argumento.

Um erro será lançado se `rl.question()` for chamado após `rl.close()`.

Exemplo de uso:

```js [ESM]
rl.question('Qual é a sua comida favorita? ', (answer) => {
  console.log(`Ah, então sua comida favorita é ${answer}`);
});
```
Usando um `AbortController` para cancelar uma pergunta.

```js [ESM]
const ac = new AbortController();
const signal = ac.signal;

rl.question('Qual é a sua comida favorita? ', { signal }, (answer) => {
  console.log(`Ah, então sua comida favorita é ${answer}`);
});

signal.addEventListener('abort', () => {
  console.log('A pergunta sobre comida expirou');
}, { once: true });

setTimeout(() => ac.abort(), 10000);
```

### `readline.clearLine(stream, dir[, callback])` {#readlineclearlinestream-dir-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v12.7.0 | O callback e o valor de retorno de write() do stream são expostos. |
| v0.7.7 | Adicionado em: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable)
- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: à esquerda do cursor
    - `1`: à direita do cursor
    - `0`: a linha inteira


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocado quando a operação for concluída.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se `stream` desejar que o código de chamada espere que o evento `'drain'` seja emitido antes de continuar a gravar dados adicionais; caso contrário, `true`.

O método `readline.clearLine()` limpa a linha atual do stream [TTY](/pt/nodejs/api/tty) fornecido em uma direção especificada identificada por `dir`.

### `readline.clearScreenDown(stream[, callback])` {#readlineclearscreendownstream-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v12.7.0 | O callback e o valor de retorno de write() do stream são expostos. |
| v0.7.7 | Adicionado em: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocado quando a operação for concluída.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se `stream` desejar que o código de chamada espere que o evento `'drain'` seja emitido antes de continuar a gravar dados adicionais; caso contrário, `true`.

O método `readline.clearScreenDown()` limpa o stream [TTY](/pt/nodejs/api/tty) fornecido da posição atual do cursor para baixo.


### `readline.createInterface(options)` {#readlinecreateinterfaceoptions}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v15.14.0, v14.18.0 | A opção `signal` agora é suportada. |
| v15.8.0, v14.18.0 | A opção `history` agora é suportada. |
| v13.9.0 | A opção `tabSize` agora é suportada. |
| v8.3.0, v6.11.4 | Remove o limite máximo da opção `crlfDelay`. |
| v6.6.0 | A opção `crlfDelay` agora é suportada. |
| v6.3.0 | A opção `prompt` agora é suportada. |
| v6.0.0 | A opção `historySize` pode ser `0` agora. |
| v0.1.98 | Adicionado em: v0.1.98 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable) O fluxo [Readable](/pt/nodejs/api/stream#readable-streams) para escutar. Esta opção é *obrigatória*.
    - `output` [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable) O fluxo [Writable](/pt/nodejs/api/stream#writable-streams) para escrever dados do readline.
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função opcional usada para o preenchimento automático com a tecla Tab.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se os fluxos `input` e `output` devem ser tratados como um TTY e ter códigos de escape ANSI/VT100 gravados nele. **Padrão:** verificar `isTTY` no fluxo `output` após a instanciação.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista inicial de linhas do histórico. Esta opção faz sentido apenas se `terminal` estiver definido como `true` pelo usuário ou por uma verificação interna de `output`, caso contrário, o mecanismo de cache do histórico não é inicializado. **Padrão:** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número máximo de linhas de histórico retidas. Para desativar o histórico, defina este valor como `0`. Esta opção faz sentido apenas se `terminal` estiver definido como `true` pelo usuário ou por uma verificação interna de `output`, caso contrário, o mecanismo de cache do histórico não é inicializado. **Padrão:** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, quando uma nova linha de entrada adicionada à lista de histórico duplica uma linha mais antiga, isso remove a linha mais antiga da lista. **Padrão:** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A string de prompt a ser usada. **Padrão:** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se o atraso entre `\r` e `\n` exceder `crlfDelay` milissegundos, tanto `\r` quanto `\n` serão tratados como entrada de fim de linha separada. `crlfDelay` será coercido a um número não inferior a `100`. Ele pode ser definido como `Infinity`, caso em que `\r` seguido por `\n` sempre será considerado uma única nova linha (o que pode ser razoável para [ler arquivos](/pt/nodejs/api/readline#example-read-file-stream-line-by-line) com delimitador de linha `\r\n`). **Padrão:** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A duração que `readline` esperará por um caractere (ao ler uma sequência de teclas ambígua em milissegundos, uma que pode formar uma sequência de teclas completa usando a entrada lida até agora e pode receber entrada adicional para completar uma sequência de teclas mais longa). **Padrão:** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de espaços que uma tabulação é igual (mínimo 1). **Padrão:** `8`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite fechar a interface usando um AbortSignal. Abortar o sinal chamará internamente `close` na interface.


- Retorna: [\<readline.Interface\>](/pt/nodejs/api/readline#class-readlineinterface)

O método `readline.createInterface()` cria uma nova instância de `readline.Interface`.

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

Depois que a instância `readline.Interface` é criada, o caso mais comum é escutar o evento `'line'`:

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
Se `terminal` for `true` para esta instância, então o fluxo `output` obterá a melhor compatibilidade se definir uma propriedade `output.columns` e emitir um evento `'resize'` no `output` se ou quando as colunas mudarem ([`process.stdout`](/pt/nodejs/api/process#processstdout) faz isso automaticamente quando é um TTY).

Ao criar um `readline.Interface` usando `stdin` como entrada, o programa não terminará até receber um [caractere EOF](https://en.wikipedia.org/wiki/End-of-file#EOF_character). Para sair sem esperar pela entrada do usuário, chame `process.stdin.unref()`.


#### Uso da função `completer` {#use-of-the-completer-function_1}

A função `completer` recebe a linha atual inserida pelo usuário como um argumento e retorna um `Array` com 2 entradas:

- Um `Array` com entradas correspondentes para a conclusão.
- A substring que foi usada para a correspondência.

Por exemplo: `[[substr1, substr2, ...], originalsubstring]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : completions, line];
}
```
A função `completer` pode ser chamada de forma assíncrona se aceitar dois argumentos:

```js [ESM]
function completer(linePartial, callback) {
  callback(null, [['123'], linePartial]);
}
```
### `readline.cursorTo(stream, x[, y][, callback])` {#readlinecursortostream-x-y-callback}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v12.7.0 | O callback e o valor de retorno do write() do stream são expostos. |
| v0.7.7 | Adicionado em: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable)
- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocado assim que a operação for concluída.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se `stream` desejar que o código de chamada espere que o evento `'drain'` seja emitido antes de continuar a escrever dados adicionais; caso contrário, `true`.

O método `readline.cursorTo()` move o cursor para a posição especificada em um determinado `stream` [TTY](/pt/nodejs/api/tty).

### `readline.moveCursor(stream, dx, dy[, callback])` {#readlinemovecursorstream-dx-dy-callback}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v12.7.0 | O callback e o valor de retorno do write() do stream são expostos. |
| v0.7.7 | Adicionado em: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable)
- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocado assim que a operação for concluída.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se `stream` desejar que o código de chamada espere que o evento `'drain'` seja emitido antes de continuar a escrever dados adicionais; caso contrário, `true`.

O método `readline.moveCursor()` move o cursor *relativamente* à sua posição atual em um determinado `stream` [TTY](/pt/nodejs/api/tty).


## `readline.emitKeypressEvents(stream[, interface])` {#readlineemitkeypresseventsstream-interface}

**Adicionado em: v0.7.7**

- `stream` [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable)
- `interface` [\<readline.InterfaceConstructor\>](/pt/nodejs/api/readline#class-interfaceconstructor)

O método `readline.emitKeypressEvents()` faz com que o fluxo [Readable](/pt/nodejs/api/stream#readable-streams) fornecido comece a emitir eventos `'keypress'` correspondentes à entrada recebida.

Opcionalmente, `interface` especifica uma instância de `readline.Interface` para a qual o preenchimento automático é desativado quando a entrada copiada e colada é detectada.

Se o `stream` for um [TTY](/pt/nodejs/api/tty), então ele deve estar no modo raw.

Isso é chamado automaticamente por qualquer instância de readline em sua `input` se a `input` for um terminal. Fechar a instância de `readline` não impede que a `input` emita eventos `'keypress'`.

```js [ESM]
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
```
## Exemplo: CLI Minúsculo {#example-tiny-cli}

O exemplo a seguir ilustra o uso da classe `readline.Interface` para implementar uma pequena interface de linha de comando:



::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { exit, stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  exit(0);
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
```
:::


## Exemplo: Ler arquivo de stream linha por linha {#example-read-file-stream-line-by-line}

Um caso de uso comum para `readline` é consumir um arquivo de entrada uma linha por vez. A maneira mais fácil de fazer isso é aproveitando a API [`fs.ReadStream`](/pt/nodejs/api/fs#class-fsreadstream), bem como um loop `for await...of`:

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
  }
}

processLineByLine();
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
  }
}

processLineByLine();
```
:::

Alternativamente, pode-se usar o evento [`'line'`](/pt/nodejs/api/readline#event-line):

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});
```
:::

Atualmente, o loop `for await...of` pode ser um pouco mais lento. Se o fluxo `async` / `await` e a velocidade forem ambos essenciais, uma abordagem mista pode ser aplicada:

::: code-group
```js [ESM]
import { once } from 'node:events';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```

```js [CJS]
const { once } = require('node:events');
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```
:::


## Atalhos de teclado TTY {#tty-keybindings}

| Atalhos de teclado | Descrição | Notas |
|---|---|---|
|  +  +  | Apaga a linha à esquerda | Não funciona no Linux, Mac e Windows |
|  +  +  | Apaga a linha à direita | Não funciona no Mac |
|  +  | Emite `SIGINT` ou fecha a instância readline | |
|  +  | Apaga à esquerda | |
|  +  | Apaga à direita ou fecha a instância readline caso a linha atual esteja vazia/EOF | Não funciona no Windows |
|  +  | Apaga da posição atual até o início da linha | |
|  +  | Apaga da posição atual até o fim da linha | |
|  +  | Yank (Recupera) o texto apagado anteriormente | Funciona apenas com texto apagado por + ou + |
|  +  | Percorre os textos apagados anteriormente | Disponível apenas quando a última tecla pressionada for + ou + |
|  +  | Vai para o início da linha | |
|  +  | Vai para o fim da linha | |
|  +  | Volta um caractere | |
|  +  | Avança um caractere | |
|  +  | Limpa a tela | |
|  +  | Próximo item do histórico | |
|  +  | Item anterior do histórico | |
|  +  | Desfaz a alteração anterior | Qualquer tecla que emita o código de tecla `0x1F` fará esta ação. Em muitos terminais, por exemplo, `xterm`, isso está vinculado a + . |
|  +  | Refaz a alteração anterior | Muitos terminais não têm uma tecla de refazer padrão. Escolhemos o código de tecla `0x1E` para executar refazer. Em `xterm`, está vinculado a + por padrão. |
|  +  | Move o processo em execução para o plano de fundo. Digite `fg` e pressione para retornar. | Não funciona no Windows |
|  + ou + | Apaga para trás até um limite de palavra | + Não funciona no Linux, Mac e Windows |
|  +  | Apaga para frente até um limite de palavra | Não funciona no Mac |
|  + ou + | Palavra à esquerda | + Não funciona no Mac |
|  + ou + | Palavra à direita | + Não funciona no Mac |
|  + ou + | Apaga a palavra à direita | + Não funciona no Windows |
|  +  | Apaga a palavra à esquerda | Não funciona no Mac |

