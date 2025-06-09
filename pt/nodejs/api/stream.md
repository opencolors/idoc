---
title: Documentação da API de Stream do Node.js
description: Documentação detalhada sobre a API de Stream do Node.js, cobrindo streams legíveis, graváveis, duplex e de transformação, juntamente com seus métodos, eventos e exemplos de uso.
head:
  - - meta
    - name: og:title
      content: Documentação da API de Stream do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentação detalhada sobre a API de Stream do Node.js, cobrindo streams legíveis, graváveis, duplex e de transformação, juntamente com seus métodos, eventos e exemplos de uso.
  - - meta
    - name: twitter:title
      content: Documentação da API de Stream do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentação detalhada sobre a API de Stream do Node.js, cobrindo streams legíveis, graváveis, duplex e de transformação, juntamente com seus métodos, eventos e exemplos de uso.
---


# Stream {#stream}

::: tip [Stable: 2 - Estável]
[Stable: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código-fonte:** [lib/stream.js](https://github.com/nodejs/node/blob/v23.5.0/lib/stream.js)

Um stream é uma interface abstrata para trabalhar com dados de streaming no Node.js. O módulo `node:stream` fornece uma API para implementar a interface de stream.

Existem muitos objetos de stream fornecidos pelo Node.js. Por exemplo, uma [requisição para um servidor HTTP](/pt/nodejs/api/http#class-httpincomingmessage) e [`process.stdout`](/pt/nodejs/api/process#processstdout) são ambos instâncias de stream.

Streams podem ser legíveis, graváveis ou ambos. Todos os streams são instâncias de [`EventEmitter`](/pt/nodejs/api/events#class-eventemitter).

Para acessar o módulo `node:stream`:

```js [ESM]
const stream = require('node:stream');
```
O módulo `node:stream` é útil para criar novos tipos de instâncias de stream. Geralmente não é necessário usar o módulo `node:stream` para consumir streams.

## Organização deste documento {#organization-of-this-document}

Este documento contém duas seções principais e uma terceira seção para notas. A primeira seção explica como usar streams existentes em um aplicativo. A segunda seção explica como criar novos tipos de streams.

## Tipos de streams {#types-of-streams}

Existem quatro tipos de streams fundamentais no Node.js:

- [`Writable`](/pt/nodejs/api/stream#class-streamwritable): streams para os quais os dados podem ser escritos (por exemplo, [`fs.createWriteStream()`](/pt/nodejs/api/fs#fscreatewritestreampath-options)).
- [`Readable`](/pt/nodejs/api/stream#class-streamreadable): streams dos quais os dados podem ser lidos (por exemplo, [`fs.createReadStream()`](/pt/nodejs/api/fs#fscreatereadstreampath-options)).
- [`Duplex`](/pt/nodejs/api/stream#class-streamduplex): streams que são `Readable` e `Writable` (por exemplo, [`net.Socket`](/pt/nodejs/api/net#class-netsocket)).
- [`Transform`](/pt/nodejs/api/stream#class-streamtransform): streams `Duplex` que podem modificar ou transformar os dados à medida que são gravados e lidos (por exemplo, [`zlib.createDeflate()`](/pt/nodejs/api/zlib#zlibcreatedeflateoptions)).

Além disso, este módulo inclui as funções utilitárias [`stream.duplexPair()`](/pt/nodejs/api/stream#streamduplexpairoptions), [`stream.pipeline()`](/pt/nodejs/api/stream#streampipelinesource-transforms-destination-callback), [`stream.finished()`](/pt/nodejs/api/stream#streamfinishedstream-options-callback) [`stream.Readable.from()`](/pt/nodejs/api/stream#streamreadablefromiterable-options) e [`stream.addAbortSignal()`](/pt/nodejs/api/stream#streamaddabortsignalsignal-stream).


### API de Streams Promises {#streams-promises-api}

**Adicionado em: v15.0.0**

A API `stream/promises` fornece um conjunto alternativo de funções de utilitário assíncronas para streams que retornam objetos `Promise` em vez de usar callbacks. A API é acessível via `require('node:stream/promises')` ou `require('node:stream').promises`.

### `stream.pipeline(source[, ...transforms], destination[, options])` {#streampipelinesource-transforms-destination-options}

### `stream.pipeline(streams[, options])` {#streampipelinestreams-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0, v17.2.0, v16.14.0 | Adicionada a opção `end`, que pode ser definida como `false` para impedir o fechamento automático do stream de destino quando a fonte termina. |
| v15.0.0 | Adicionado em: v15.0.0 |
:::

- `streams` [\<Stream[]\>](/pt/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `source` [\<Stream\>](/pt/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `...transforms` [\<Stream\>](/pt/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `destination` [\<Stream\>](/pt/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções do Pipeline 
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal)
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Finaliza o stream de destino quando o stream de origem termina. Streams de transformação são sempre finalizados, mesmo se este valor for `false`. **Padrão:** `true`.
  
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre quando o pipeline está completo.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('archive.tar'),
  createGzip(),
  createWriteStream('archive.tar.gz'),
);
console.log('Pipeline succeeded.');
```
:::

Para usar um `AbortSignal`, passe-o dentro de um objeto de opções, como o último argumento. Quando o sinal é abortado, `destroy` será chamado no pipeline subjacente, com um `AbortError`.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  const ac = new AbortController();
  const signal = ac.signal;

  setImmediate(() => ac.abort());
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
    { signal },
  );
}

run().catch(console.error); // AbortError
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

const ac = new AbortController();
const { signal } = ac;
setImmediate(() => ac.abort());
try {
  await pipeline(
    createReadStream('archive.tar'),
    createGzip(),
    createWriteStream('archive.tar.gz'),
    { signal },
  );
} catch (err) {
  console.error(err); // AbortError
}
```
:::

A API `pipeline` também suporta geradores assíncronos:



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    fs.createReadStream('lowercase.txt'),
    async function* (source, { signal }) {
      source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
      for await (const chunk of source) {
        yield await processChunk(chunk, { signal });
      }
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

await pipeline(
  createReadStream('lowercase.txt'),
  async function* (source, { signal }) {
    source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
    for await (const chunk of source) {
      yield await processChunk(chunk, { signal });
    }
  },
  createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```
:::

Lembre-se de lidar com o argumento `signal` passado para o gerador assíncrono. Especialmente no caso em que o gerador assíncrono é a fonte para o pipeline (ou seja, primeiro argumento) ou o pipeline nunca será concluído.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    async function* ({ signal }) {
      await someLongRunningfn({ signal });
      yield 'asd';
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
await pipeline(
  async function* ({ signal }) {
    await someLongRunningfn({ signal });
    yield 'asd';
  },
  fs.createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```
:::

A API `pipeline` fornece [versão de callback](/pt/nodejs/api/stream#streampipelinesource-transforms-destination-callback):


### `stream.finished(stream[, options])` {#streamfinishedstream-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.5.0, v18.14.0 | Adicionado suporte para `ReadableStream` e `WritableStream`. |
| v19.1.0, v18.13.0 | A opção `cleanup` foi adicionada. |
| v15.0.0 | Adicionado em: v15.0.0 |
:::

- `stream` [\<Stream\>](/pt/nodejs/api/stream#stream) | [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream) Um stream/webstream legível e/ou gravável.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `cleanup` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Se `true`, remove os listeners registrados por esta função antes que a promise seja cumprida. **Padrão:** `false`.


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) É cumprida quando o stream não é mais legível ou gravável.



::: code-group
```js [CJS]
const { finished } = require('node:stream/promises');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Stream is done reading.');
}

run().catch(console.error);
rs.resume(); // Drene o stream.
```

```js [ESM]
import { finished } from 'node:stream/promises';
import { createReadStream } from 'node:fs';

const rs = createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Stream is done reading.');
}

run().catch(console.error);
rs.resume(); // Drene o stream.
```
:::

A API `finished` também fornece uma [versão de callback](/pt/nodejs/api/stream#streamfinishedstream-options-callback).

`stream.finished()` deixa event listeners pendentes (em particular `'error'`, `'end'`, `'finish'` e `'close'`) após a promise retornada ser resolvida ou rejeitada. A razão para isso é para que eventos `'error'` inesperados (devido a implementações incorretas de stream) não causem falhas inesperadas. Se este for um comportamento indesejado, então `options.cleanup` deve ser definido como `true`:

```js [ESM]
await finished(rs, { cleanup: true });
```

### Modo de Objeto {#object-mode}

Todos os fluxos criados pelas APIs do Node.js operam exclusivamente em strings, objetos [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) e [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView):

- `Strings` e `Buffers` são os tipos mais comuns usados com fluxos.
- `TypedArray` e `DataView` permitem que você manipule dados binários com tipos como `Int32Array` ou `Uint8Array`. Quando você escreve um TypedArray ou DataView em um fluxo, o Node.js processa os bytes brutos.

É possível, no entanto, que as implementações de fluxo funcionem com outros tipos de valores JavaScript (com exceção de `null`, que tem um propósito especial dentro dos fluxos). Tais fluxos são considerados como operando em "modo de objeto".

As instâncias de fluxo são alternadas para o modo de objeto usando a opção `objectMode` quando o fluxo é criado. Tentar alternar um fluxo existente para o modo de objeto não é seguro.

### Buffering {#buffering}

Tanto os fluxos [`Writable`](/pt/nodejs/api/stream#class-streamwritable) quanto os [`Readable`](/pt/nodejs/api/stream#class-streamreadable) armazenarão dados em um buffer interno.

A quantidade de dados potencialmente armazenados em buffer depende da opção `highWaterMark` passada para o construtor do fluxo. Para fluxos normais, a opção `highWaterMark` especifica um [número total de bytes](/pt/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding). Para fluxos operando em modo de objeto, o `highWaterMark` especifica um número total de objetos. Para fluxos operando em (mas não decodificando) strings, o `highWaterMark` especifica um número total de unidades de código UTF-16.

Os dados são armazenados em buffer em fluxos `Readable` quando a implementação chama [`stream.push(chunk)`](/pt/nodejs/api/stream#readablepushchunk-encoding). Se o consumidor do Stream não chamar [`stream.read()`](/pt/nodejs/api/stream#readablereadsize), os dados permanecerão na fila interna até serem consumidos.

Uma vez que o tamanho total do buffer de leitura interno atinge o limite especificado por `highWaterMark`, o fluxo irá parar temporariamente de ler dados do recurso subjacente até que os dados atualmente em buffer possam ser consumidos (isto é, o fluxo irá parar de chamar o método interno [`readable._read()`](/pt/nodejs/api/stream#readable_readsize) que é usado para preencher o buffer de leitura).

Os dados são armazenados em buffer em fluxos `Writable` quando o método [`writable.write(chunk)`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback) é chamado repetidamente. Enquanto o tamanho total do buffer de escrita interno estiver abaixo do limite definido por `highWaterMark`, as chamadas para `writable.write()` retornarão `true`. Uma vez que o tamanho do buffer interno atinge ou excede o `highWaterMark`, `false` será retornado.

Um objetivo fundamental da API `stream`, particularmente o método [`stream.pipe()`](/pt/nodejs/api/stream#readablepipedestination-options), é limitar o buffering de dados a níveis aceitáveis, de modo que fontes e destinos de diferentes velocidades não sobrecarreguem a memória disponível.

A opção `highWaterMark` é um limite, não uma restrição: ela dita a quantidade de dados que um fluxo armazena em buffer antes de parar de pedir mais dados. Ela não impõe uma limitação de memória estrita em geral. Implementações de fluxo específicas podem optar por impor limites mais rigorosos, mas fazê-lo é opcional.

Como os fluxos [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) e [`Transform`](/pt/nodejs/api/stream#class-streamtransform) são `Readable` e `Writable`, cada um mantém *dois* buffers internos separados usados para leitura e escrita, permitindo que cada lado opere independentemente do outro, mantendo um fluxo de dados apropriado e eficiente. Por exemplo, instâncias [`net.Socket`](/pt/nodejs/api/net#class-netsocket) são fluxos [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) cujo lado `Readable` permite o consumo de dados recebidos *do* socket e cujo lado `Writable` permite escrever dados *para* o socket. Como os dados podem ser escritos no socket em uma taxa mais rápida ou mais lenta do que os dados são recebidos, cada lado deve operar (e armazenar em buffer) independentemente do outro.

A mecânica do buffering interno é um detalhe de implementação interna e pode ser alterada a qualquer momento. No entanto, para certas implementações avançadas, os buffers internos podem ser recuperados usando `writable.writableBuffer` ou `readable.readableBuffer`. O uso dessas propriedades não documentadas é desencorajado.


## API para consumidores de streams {#api-for-stream-consumers}

Quase todas as aplicações Node.js, por mais simples que sejam, usam streams de alguma forma. O exemplo a seguir mostra o uso de streams em uma aplicação Node.js que implementa um servidor HTTP:

```js [ESM]
const http = require('node:http');

const server = http.createServer((req, res) => {
  // `req` é um http.IncomingMessage, que é um stream legível.
  // `res` é um http.ServerResponse, que é um stream gravável.

  let body = '';
  // Obtém os dados como strings utf8.
  // Se uma codificação não for definida, objetos Buffer serão recebidos.
  req.setEncoding('utf8');

  // Streams legíveis emitem eventos 'data' assim que um listener é adicionado.
  req.on('data', (chunk) => {
    body += chunk;
  });

  // O evento 'end' indica que o corpo inteiro foi recebido.
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // Escreve algo interessante de volta para o usuário:
      res.write(typeof data);
      res.end();
    } catch (er) {
      // uh oh! json inválido!
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });
});

server.listen(1337);

// $ curl localhost:1337 -d "{}"
// object
// $ curl localhost:1337 -d "\"foo\""
// string
// $ curl localhost:1337 -d "not json"
// error: Unexpected token 'o', "not json" is not valid JSON
```
Streams [`Writable`](/pt/nodejs/api/stream#class-streamwritable) (como `res` no exemplo) expõem métodos como `write()` e `end()` que são usados para gravar dados no stream.

Streams [`Readable`](/pt/nodejs/api/stream#class-streamreadable) usam a API [`EventEmitter`](/pt/nodejs/api/events#class-eventemitter) para notificar o código da aplicação quando os dados estão disponíveis para serem lidos do stream. Esses dados disponíveis podem ser lidos do stream de várias maneiras.

Tanto os streams [`Writable`](/pt/nodejs/api/stream#class-streamwritable) quanto os [`Readable`](/pt/nodejs/api/stream#class-streamreadable) usam a API [`EventEmitter`](/pt/nodejs/api/events#class-eventemitter) de várias maneiras para comunicar o estado atual do stream.

Streams [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) e [`Transform`](/pt/nodejs/api/stream#class-streamtransform) são ambos [`Writable`](/pt/nodejs/api/stream#class-streamwritable) e [`Readable`](/pt/nodejs/api/stream#class-streamreadable).

As aplicações que estão gravando dados ou consumindo dados de um stream não são obrigadas a implementar as interfaces de stream diretamente e geralmente não terão motivos para chamar `require('node:stream')`.

Os desenvolvedores que desejam implementar novos tipos de streams devem consultar a seção [API para implementadores de streams](/pt/nodejs/api/stream#api-for-stream-implementers).


### Streams Graváveis {#writable-streams}

Streams graváveis são uma abstração para um *destino* para o qual os dados são gravados.

Exemplos de streams [`Writable`](/pt/nodejs/api/stream#class-streamwritable) incluem:

- [Requisições HTTP, no cliente](/pt/nodejs/api/http#class-httpclientrequest)
- [Respostas HTTP, no servidor](/pt/nodejs/api/http#class-httpserverresponse)
- [Streams de escrita fs](/pt/nodejs/api/fs#class-fswritestream)
- [Streams zlib](/pt/nodejs/api/zlib)
- [Streams cripto](/pt/nodejs/api/crypto)
- [Sockets TCP](/pt/nodejs/api/net#class-netsocket)
- [stdin de processo filho](/pt/nodejs/api/child_process#subprocessstdin)
- [`process.stdout`](/pt/nodejs/api/process#processstdout), [`process.stderr`](/pt/nodejs/api/process#processstderr)

Alguns desses exemplos são, na verdade, streams [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) que implementam a interface [`Writable`](/pt/nodejs/api/stream#class-streamwritable).

Todos os streams [`Writable`](/pt/nodejs/api/stream#class-streamwritable) implementam a interface definida pela classe `stream.Writable`.

Embora instâncias específicas de streams [`Writable`](/pt/nodejs/api/stream#class-streamwritable) possam diferir de várias maneiras, todos os streams `Writable` seguem o mesmo padrão de uso fundamental, conforme ilustrado no exemplo abaixo:

```js [ESM]
const myStream = getWritableStreamSomehow();
myStream.write('some data');
myStream.write('some more data');
myStream.end('done writing data');
```
#### Classe: `stream.Writable` {#class-streamwritable}

**Adicionado em: v0.9.4**

##### Evento: `'close'` {#event-close}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Adicionada opção `emitClose` para especificar se `'close'` é emitido na destruição. |
| v0.9.4 | Adicionado em: v0.9.4 |
:::

O evento `'close'` é emitido quando o stream e quaisquer de seus recursos subjacentes (um descritor de arquivo, por exemplo) foram fechados. O evento indica que nenhum evento adicional será emitido e nenhum cálculo adicional ocorrerá.

Um stream [`Writable`](/pt/nodejs/api/stream#class-streamwritable) sempre emitirá o evento `'close'` se for criado com a opção `emitClose`.

##### Evento: `'drain'` {#event-drain}

**Adicionado em: v0.9.4**

Se uma chamada para [`stream.write(chunk)`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback) retornar `false`, o evento `'drain'` será emitido quando for apropriado para retomar a escrita de dados no stream.

```js [ESM]
// Escreva os dados para o stream gravável fornecido um milhão de vezes.
// Esteja atento à contrapressão.
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // Última vez!
        writer.write(data, encoding, callback);
      } else {
        // Veja se devemos continuar ou esperar.
        // Não passe o callback, porque ainda não terminamos.
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // Teve que parar cedo!
      // Escreva mais assim que drenar.
      writer.once('drain', write);
    }
  }
}
```

##### Evento: `'error'` {#event-error}

**Adicionado em: v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

O evento `'error'` é emitido se ocorrer um erro ao gravar ou canalizar dados. O callback do listener recebe um único argumento `Error` quando chamado.

O stream é fechado quando o evento `'error'` é emitido, a menos que a opção [`autoDestroy`](/pt/nodejs/api/stream#new-streamwritableoptions) tenha sido definida como `false` ao criar o stream.

Após `'error'`, nenhum outro evento além de `'close'` *deve* ser emitido (incluindo eventos `'error'`).

##### Evento: `'finish'` {#event-finish}

**Adicionado em: v0.9.4**

O evento `'finish'` é emitido depois que o método [`stream.end()`](/pt/nodejs/api/stream#writableendchunk-encoding-callback) é chamado e todos os dados são descarregados para o sistema subjacente.

```js [ESM]
const writer = getWritableStreamSomehow();
for (let i = 0; i < 100; i++) {
  writer.write(`hello, #${i}!\n`);
}
writer.on('finish', () => {
  console.log('Todas as gravações estão agora completas.');
});
writer.end('Este é o fim\n');
```
##### Evento: `'pipe'` {#event-pipe}

**Adicionado em: v0.9.4**

- `src` [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable) stream de origem que está canalizando para este gravável

O evento `'pipe'` é emitido quando o método [`stream.pipe()`](/pt/nodejs/api/stream#readablepipedestination-options) é chamado em um stream legível, adicionando este gravável ao seu conjunto de destinos.

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('pipe', (src) => {
  console.log('Algo está canalizando para o escritor.');
  assert.equal(src, reader);
});
reader.pipe(writer);
```
##### Evento: `'unpipe'` {#event-unpipe}

**Adicionado em: v0.9.4**

- `src` [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable) O stream de origem que [descanalizou](/pt/nodejs/api/stream#readableunpipedestination) este gravável

O evento `'unpipe'` é emitido quando o método [`stream.unpipe()`](/pt/nodejs/api/stream#readableunpipedestination) é chamado em um stream [`Readable`](/pt/nodejs/api/stream#class-streamreadable), removendo este [`Writable`](/pt/nodejs/api/stream#class-streamwritable) de seu conjunto de destinos.

Isto também é emitido caso este stream [`Writable`](/pt/nodejs/api/stream#class-streamwritable) emita um erro quando um stream [`Readable`](/pt/nodejs/api/stream#class-streamreadable) canaliza para ele.

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('unpipe', (src) => {
  console.log('Algo parou de canalizar para o escritor.');
  assert.equal(src, reader);
});
reader.pipe(writer);
reader.unpipe(writer);
```

##### `writable.cork()` {#writablecork}

**Adicionado em: v0.11.2**

O método `writable.cork()` força todos os dados escritos a serem armazenados em buffer na memória. Os dados armazenados em buffer serão liberados quando os métodos [`stream.uncork()`](/pt/nodejs/api/stream#writableuncork) ou [`stream.end()`](/pt/nodejs/api/stream#writableendchunk-encoding-callback) forem chamados.

A intenção principal de `writable.cork()` é acomodar uma situação em que vários pequenos pedaços são escritos no stream em rápida sucessão. Em vez de encaminhá-los imediatamente para o destino subjacente, `writable.cork()` armazena em buffer todos os pedaços até que `writable.uncork()` seja chamado, o que os passará para `writable._writev()`, se presente. Isso evita uma situação de bloqueio de head-of-line onde os dados estão sendo armazenados em buffer enquanto esperam que o primeiro pequeno pedaço seja processado. No entanto, o uso de `writable.cork()` sem implementar `writable._writev()` pode ter um efeito adverso no rendimento.

Veja também: [`writable.uncork()`](/pt/nodejs/api/stream#writableuncork), [`writable._writev()`](/pt/nodejs/api/stream#writable_writevchunks-callback).

##### `writable.destroy([error])` {#writabledestroyerror}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | Funciona como uma no-op em um stream que já foi destruído. |
| v8.0.0 | Adicionado em: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Opcional, um erro para emitir com o evento `'error'`.
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Destrói o stream. Opcionalmente, emite um evento `'error'` e emite um evento `'close'` (a menos que `emitClose` seja definido como `false`). Após esta chamada, o stream gravável terminou e as chamadas subsequentes para `write()` ou `end()` resultarão em um erro `ERR_STREAM_DESTROYED`. Esta é uma maneira destrutiva e imediata de destruir um stream. As chamadas anteriores para `write()` podem não ter sido drenadas e podem acionar um erro `ERR_STREAM_DESTROYED`. Use `end()` em vez de destroy se os dados devem ser liberados antes do fechamento, ou espere pelo evento `'drain'` antes de destruir o stream.

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

const fooErr = new Error('foo error');
myStream.destroy(fooErr);
myStream.on('error', (fooErr) => console.error(fooErr.message)); // foo error
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

myStream.destroy();
myStream.on('error', function wontHappen() {});
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();
myStream.destroy();

myStream.write('foo', (error) => console.error(error.code));
// ERR_STREAM_DESTROYED
```
Depois que `destroy()` foi chamado, quaisquer chamadas adicionais serão uma no-op e nenhum outro erro, exceto de `_destroy()`, pode ser emitido como `'error'`.

Os implementadores não devem substituir este método, mas sim implementar [`writable._destroy()`](/pt/nodejs/api/stream#writable_destroyerr-callback).


##### `writable.closed` {#writableclosed}

**Adicionado em: v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` após o evento `'close'` ter sido emitido.

##### `writable.destroyed` {#writabledestroyed}

**Adicionado em: v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` após [`writable.destroy()`](/pt/nodejs/api/stream#writabledestroyerror) ter sido chamado.

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

console.log(myStream.destroyed); // false
myStream.destroy();
console.log(myStream.destroyed); // true
```
##### `writable.end([chunk[, encoding]][, callback])` {#writableendchunk-encoding-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.0.0, v20.13.0 | O argumento `chunk` agora pode ser uma instância de `TypedArray` ou `DataView`. |
| v15.0.0 | O `callback` é invocado antes de 'finish' ou em caso de erro. |
| v14.0.0 | O `callback` é invocado se 'finish' ou 'error' for emitido. |
| v10.0.0 | Este método agora retorna uma referência para `writable`. |
| v8.0.0 | O argumento `chunk` agora pode ser uma instância de `Uint8Array`. |
| v0.9.4 | Adicionado em: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Dados opcionais a serem escritos. Para streams que não operam em modo de objeto, `chunk` deve ser um [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ou [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Para streams em modo de objeto, `chunk` pode ser qualquer valor JavaScript diferente de `null`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação se `chunk` for uma string.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback para quando o stream terminar.
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Chamar o método `writable.end()` sinaliza que não haverá mais dados sendo escritos para o [`Writable`](/pt/nodejs/api/stream#class-streamwritable). Os argumentos opcionais `chunk` e `encoding` permitem que um chunk final adicional de dados seja escrito imediatamente antes de fechar o stream.

Chamar o método [`stream.write()`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback) após chamar [`stream.end()`](/pt/nodejs/api/stream#writableendchunk-encoding-callback) levantará um erro.

```js [ESM]
// Escreva 'hello, ' e então finalize com 'world!'.
const fs = require('node:fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
// Escrever mais agora não é permitido!
```

##### `writable.setDefaultEncoding(encoding)` {#writablesetdefaultencodingencoding}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.1.0 | Este método agora retorna uma referência para `writable`. |
| v0.11.15 | Adicionado em: v0.11.15 |
:::

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A nova codificação padrão
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

O método `writable.setDefaultEncoding()` define a `encoding` padrão para um stream [`Writable`](/pt/nodejs/api/stream#class-streamwritable).

##### `writable.uncork()` {#writableuncork}

**Adicionado em: v0.11.2**

O método `writable.uncork()` descarrega todos os dados armazenados em buffer desde que [`stream.cork()`](/pt/nodejs/api/stream#writablecork) foi chamado.

Ao usar [`writable.cork()`](/pt/nodejs/api/stream#writablecork) e `writable.uncork()` para gerenciar o buffer de gravações em um stream, adie as chamadas para `writable.uncork()` usando `process.nextTick()`. Fazer isso permite o agrupamento de todas as chamadas `writable.write()` que ocorrem dentro de uma determinada fase do loop de eventos do Node.js.

```js [ESM]
stream.cork();
stream.write('some ');
stream.write('data ');
process.nextTick(() => stream.uncork());
```
Se o método [`writable.cork()`](/pt/nodejs/api/stream#writablecork) for chamado várias vezes em um stream, o mesmo número de chamadas para `writable.uncork()` deve ser chamado para descarregar os dados em buffer.

```js [ESM]
stream.cork();
stream.write('some ');
stream.cork();
stream.write('data ');
process.nextTick(() => {
  stream.uncork();
  // Os dados não serão descarregados até que uncork() seja chamado uma segunda vez.
  stream.uncork();
});
```
Veja também: [`writable.cork()`](/pt/nodejs/api/stream#writablecork).

##### `writable.writable` {#writablewritable}

**Adicionado em: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` se for seguro chamar [`writable.write()`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback), o que significa que o stream não foi destruído, apresentou erros ou terminou.

##### `writable.writableAborted` {#writablewritableaborted}

**Adicionado em: v18.0.0, v16.17.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna se o stream foi destruído ou apresentou erros antes de emitir `'finish'`.


##### `writable.writableEnded` {#writablewritableended}

**Adicionado em: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` depois que [`writable.end()`](/pt/nodejs/api/stream#writableendchunk-encoding-callback) foi chamado. Essa propriedade não indica se os dados foram descarregados, para isso use [`writable.writableFinished`](/pt/nodejs/api/stream#writablewritablefinished) em vez disso.

##### `writable.writableCorked` {#writablewritablecorked}

**Adicionado em: v13.2.0, v12.16.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Número de vezes que [`writable.uncork()`](/pt/nodejs/api/stream#writableuncork) precisa ser chamado para desobstruir totalmente o stream.

##### `writable.errored` {#writableerrored}

**Adicionado em: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Retorna erro se o stream foi destruído com um erro.

##### `writable.writableFinished` {#writablewritablefinished}

**Adicionado em: v12.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É definido como `true` imediatamente antes do evento [`'finish'`](/pt/nodejs/api/stream#event-finish) ser emitido.

##### `writable.writableHighWaterMark` {#writablewritablehighwatermark}

**Adicionado em: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna o valor de `highWaterMark` passado ao criar este `Writable`.

##### `writable.writableLength` {#writablewritablelength}

**Adicionado em: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Esta propriedade contém o número de bytes (ou objetos) na fila prontos para serem gravados. O valor fornece dados de introspecção sobre o status de `highWaterMark`.

##### `writable.writableNeedDrain` {#writablewritableneeddrain}

**Adicionado em: v15.2.0, v14.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` se o buffer do stream estiver cheio e o stream emitirá `'drain'`.


##### `writable.writableObjectMode` {#writablewritableobjectmode}

**Adicionado em: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Getter para a propriedade `objectMode` de um determinado fluxo `Writable`.

##### `writable[Symbol.asyncDispose]()` {#writablesymbolasyncdispose}

**Adicionado em: v22.4.0, v20.16.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Chama [`writable.destroy()`](/pt/nodejs/api/stream#writabledestroyerror) com um `AbortError` e retorna uma promessa que é cumprida quando o fluxo é finalizado.

##### `writable.write(chunk[, encoding][, callback])` {#writablewritechunk-encoding-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.0.0, v20.13.0 | O argumento `chunk` agora pode ser uma instância de `TypedArray` ou `DataView`. |
| v8.0.0 | O argumento `chunk` agora pode ser uma instância de `Uint8Array`. |
| v6.0.0 | Passar `null` como o parâmetro `chunk` sempre será considerado inválido agora, mesmo no modo objeto. |
| v0.9.4 | Adicionado em: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Dados opcionais para escrever. Para fluxos que não operam no modo objeto, `chunk` deve ser um [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ou [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Para fluxos no modo objeto, `chunk` pode ser qualquer valor JavaScript diferente de `null`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) A codificação, se `chunk` for uma string. **Padrão:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback para quando este bloco de dados for liberado.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se o fluxo desejar que o código de chamada espere que o evento `'drain'` seja emitido antes de continuar a gravar dados adicionais; caso contrário, `true`.

O método `writable.write()` grava alguns dados no fluxo e chama o `callback` fornecido assim que os dados forem totalmente tratados. Se ocorrer um erro, o `callback` será chamado com o erro como seu primeiro argumento. O `callback` é chamado assincronamente e antes de `'error'` ser emitido.

O valor de retorno é `true` se o buffer interno for menor que o `highWaterMark` configurado quando o fluxo foi criado após admitir `chunk`. Se `false` for retornado, outras tentativas de gravar dados no fluxo devem parar até que o evento [`'drain'`](/pt/nodejs/api/stream#event-drain) seja emitido.

Enquanto um fluxo não está esgotando, as chamadas para `write()` irão armazenar em buffer o `chunk` e retornar false. Assim que todos os chunks atualmente armazenados em buffer forem esgotados (aceitos para entrega pelo sistema operacional), o evento `'drain'` será emitido. Assim que `write()` retornar false, não grave mais chunks até que o evento `'drain'` seja emitido. Embora chamar `write()` em um fluxo que não está esgotando seja permitido, o Node.js armazenará em buffer todos os chunks gravados até que o uso máximo de memória ocorra, momento em que ele será abortado incondicionalmente. Mesmo antes de abortar, o alto uso de memória causará baixo desempenho do coletor de lixo e alto RSS (que normalmente não é liberado de volta para o sistema, mesmo depois que a memória não for mais necessária). Como os sockets TCP podem nunca esgotar se o peer remoto não ler os dados, gravar em um socket que não está esgotando pode levar a uma vulnerabilidade explorável remotamente.

Gravar dados enquanto o fluxo não está esgotando é particularmente problemático para um [`Transform`](/pt/nodejs/api/stream#class-streamtransform), porque os fluxos `Transform` são pausados por padrão até que sejam encadeados ou um manipulador de eventos `'data'` ou `'readable'` seja adicionado.

Se os dados a serem gravados puderem ser gerados ou buscados sob demanda, é recomendável encapsular a lógica em um [`Readable`](/pt/nodejs/api/stream#class-streamreadable) e usar [`stream.pipe()`](/pt/nodejs/api/stream#readablepipedestination-options). No entanto, se chamar `write()` for preferível, é possível respeitar a contrapressão e evitar problemas de memória usando o evento [`'drain'`](/pt/nodejs/api/stream#event-drain):

```js [ESM]
function write(data, cb) {
  if (!stream.write(data)) {
    stream.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

// Espere que cb seja chamado antes de fazer qualquer outra gravação.
write('hello', () => {
  console.log('Gravação concluída, faça mais gravações agora.');
});
```
Um fluxo `Writable` no modo objeto sempre ignorará o argumento `encoding`.


### Streams de leitura {#readable-streams}

Streams de leitura são uma abstração para uma *fonte* da qual os dados são consumidos.

Exemplos de streams `Readable` incluem:

- [Respostas HTTP, no cliente](/pt/nodejs/api/http#class-httpincomingmessage)
- [Requisições HTTP, no servidor](/pt/nodejs/api/http#class-httpincomingmessage)
- [Streams de leitura fs](/pt/nodejs/api/fs#class-fsreadstream)
- [Streams zlib](/pt/nodejs/api/zlib)
- [Streams crypto](/pt/nodejs/api/crypto)
- [Sockets TCP](/pt/nodejs/api/net#class-netsocket)
- [Stdout e stderr do processo filho](/pt/nodejs/api/child_process#subprocessstdout)
- [`process.stdin`](/pt/nodejs/api/process#processstdin)

Todos os streams [`Readable`](/pt/nodejs/api/stream#class-streamreadable) implementam a interface definida pela classe `stream.Readable`.

#### Dois modos de leitura {#two-reading-modes}

Os streams `Readable` operam efetivamente em um de dois modos: fluindo e pausado. Esses modos são separados do [modo de objeto](/pt/nodejs/api/stream#object-mode). Um stream [`Readable`](/pt/nodejs/api/stream#class-streamreadable) pode estar no modo de objeto ou não, independentemente de estar no modo fluindo ou no modo pausado.

- No modo fluindo, os dados são lidos do sistema subjacente automaticamente e fornecidos a um aplicativo o mais rápido possível usando eventos através da interface [`EventEmitter`](/pt/nodejs/api/events#class-eventemitter).
- No modo pausado, o método [`stream.read()`](/pt/nodejs/api/stream#readablereadsize) deve ser chamado explicitamente para ler pedaços de dados do stream.

Todos os streams [`Readable`](/pt/nodejs/api/stream#class-streamreadable) começam no modo pausado, mas podem ser trocados para o modo fluindo de uma das seguintes maneiras:

- Adicionando um manipulador de eventos [`'data'`](/pt/nodejs/api/stream#event-data).
- Chamando o método [`stream.resume()`](/pt/nodejs/api/stream#readableresume).
- Chamando o método [`stream.pipe()`](/pt/nodejs/api/stream#readablepipedestination-options) para enviar os dados para um [`Writable`](/pt/nodejs/api/stream#class-streamwritable).

O `Readable` pode voltar para o modo pausado usando um dos seguintes:

- Se não houver destinos de pipe, chamando o método [`stream.pause()`](/pt/nodejs/api/stream#readablepause).
- Se houver destinos de pipe, removendo todos os destinos de pipe. Vários destinos de pipe podem ser removidos chamando o método [`stream.unpipe()`](/pt/nodejs/api/stream#readableunpipedestination).

O conceito importante a lembrar é que um `Readable` não gerará dados até que um mecanismo para consumir ou ignorar esses dados seja fornecido. Se o mecanismo de consumo for desativado ou removido, o `Readable` *tentará* parar de gerar os dados.

Por razões de compatibilidade com versões anteriores, a remoção de manipuladores de eventos [`'data'`](/pt/nodejs/api/stream#event-data) **não** pausará automaticamente o stream. Além disso, se houver destinos de pipe, chamar [`stream.pause()`](/pt/nodejs/api/stream#readablepause) não garantirá que o stream *permanecerá* pausado depois que esses destinos drenarem e pedirem mais dados.

Se um [`Readable`](/pt/nodejs/api/stream#class-streamreadable) for alternado para o modo fluindo e não houver consumidores disponíveis para lidar com os dados, esses dados serão perdidos. Isso pode ocorrer, por exemplo, quando o método `readable.resume()` é chamado sem um listener anexado ao evento `'data'`, ou quando um manipulador de eventos `'data'` é removido do stream.

Adicionar um manipulador de eventos [`'readable'`](/pt/nodejs/api/stream#event-readable) faz com que o stream pare de fluir automaticamente e os dados devem ser consumidos através de [`readable.read()`](/pt/nodejs/api/stream#readablereadsize). Se o manipulador de eventos [`'readable'`](/pt/nodejs/api/stream#event-readable) for removido, o stream começará a fluir novamente se houver um manipulador de eventos [`'data'`](/pt/nodejs/api/stream#event-data).


#### Três estados {#three-states}

Os "dois modos" de operação para um stream `Readable` são uma abstração simplificada para o gerenciamento de estado interno mais complicado que está ocorrendo dentro da implementação do stream `Readable`.

Especificamente, em qualquer ponto no tempo, todo `Readable` está em um de três estados possíveis:

- `readable.readableFlowing === null`
- `readable.readableFlowing === false`
- `readable.readableFlowing === true`

Quando `readable.readableFlowing` é `null`, nenhum mecanismo para consumir os dados do stream é fornecido. Portanto, o stream não gerará dados. Enquanto estiver neste estado, anexar um listener para o evento `'data'`, chamar o método `readable.pipe()` ou chamar o método `readable.resume()` mudará `readable.readableFlowing` para `true`, fazendo com que o `Readable` comece a emitir ativamente eventos à medida que os dados são gerados.

Chamar `readable.pause()`, `readable.unpipe()` ou receber contrapressão fará com que `readable.readableFlowing` seja definido como `false`, interrompendo temporariamente o fluxo de eventos, mas *não* interrompendo a geração de dados. Enquanto estiver neste estado, anexar um listener para o evento `'data'` não mudará `readable.readableFlowing` para `true`.

```js [ESM]
const { PassThrough, Writable } = require('node:stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing agora é falso.

pass.on('data', (chunk) => { console.log(chunk.toString()); });
// readableFlowing ainda é falso.
pass.write('ok');  // Não emitirá 'data'.
pass.resume();     // Deve ser chamado para fazer o stream emitir 'data'.
// readableFlowing agora é verdadeiro.
```
Enquanto `readable.readableFlowing` é `false`, os dados podem estar se acumulando dentro do buffer interno do stream.

#### Escolha um estilo de API {#choose-one-api-style}

A API de stream `Readable` evoluiu em várias versões do Node.js e fornece vários métodos de consumo de dados do stream. Em geral, os desenvolvedores devem escolher *um* dos métodos de consumo de dados e *nunca devem* usar vários métodos para consumir dados de um único stream. Especificamente, usar uma combinação de `on('data')`, `on('readable')`, `pipe()` ou iteradores assíncronos pode levar a um comportamento não intuitivo.


#### Classe: `stream.Readable` {#class-streamreadable}

**Adicionado em: v0.9.4**

##### Evento: `'close'` {#event-close_1}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Adicionado a opção `emitClose` para especificar se `'close'` é emitido na destruição. |
| v0.9.4 | Adicionado em: v0.9.4 |
:::

O evento `'close'` é emitido quando o stream e qualquer um de seus recursos subjacentes (um descritor de arquivo, por exemplo) foram fechados. O evento indica que nenhum evento adicional será emitido e nenhum cálculo adicional ocorrerá.

Um stream [`Readable`](/pt/nodejs/api/stream#class-streamreadable) sempre emitirá o evento `'close'` se for criado com a opção `emitClose`.

##### Evento: `'data'` {#event-data}

**Adicionado em: v0.9.4**

- `chunk` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O pedaço de dados. Para streams que não estão operando no modo de objeto, o pedaço será uma string ou `Buffer`. Para streams que estão no modo de objeto, o pedaço pode ser qualquer valor JavaScript diferente de `null`.

O evento `'data'` é emitido sempre que o stream está renunciando à propriedade de um pedaço de dados para um consumidor. Isso pode ocorrer sempre que o stream é alternado no modo de fluxo chamando `readable.pipe()`, `readable.resume()` ou anexando um retorno de chamada de ouvinte ao evento `'data'`. O evento `'data'` também será emitido sempre que o método `readable.read()` for chamado e um pedaço de dados estiver disponível para ser retornado.

Anexar um ouvinte de evento `'data'` a um stream que não foi explicitamente pausado mudará o stream para o modo de fluxo. Os dados serão então passados assim que estiverem disponíveis.

O retorno de chamada do ouvinte receberá o pedaço de dados como uma string se uma codificação padrão tiver sido especificada para o stream usando o método `readable.setEncoding()`; caso contrário, os dados serão passados como um `Buffer`.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Recebidos ${chunk.length} bytes de dados.`);
});
```

##### Evento: `'end'` {#event-end}

**Adicionado em: v0.9.4**

O evento `'end'` é emitido quando não há mais dados para serem consumidos do stream.

O evento `'end'` **não será emitido** a menos que os dados sejam completamente consumidos. Isso pode ser alcançado mudando o stream para o modo de fluxo ou chamando [`stream.read()`](/pt/nodejs/api/stream#readablereadsize) repetidamente até que todos os dados tenham sido consumidos.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
readable.on('end', () => {
  console.log('There will be no more data.');
});
```
##### Evento: `'error'` {#event-error_1}

**Adicionado em: v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

O evento `'error'` pode ser emitido por uma implementação `Readable` a qualquer momento. Normalmente, isso pode ocorrer se o stream subjacente for incapaz de gerar dados devido a uma falha interna subjacente ou quando uma implementação de stream tenta enviar um chunk de dados inválido.

O callback do listener receberá um único objeto `Error`.

##### Evento: `'pause'` {#event-pause}

**Adicionado em: v0.9.4**

O evento `'pause'` é emitido quando [`stream.pause()`](/pt/nodejs/api/stream#readablepause) é chamado e `readableFlowing` não é `false`.

##### Evento: `'readable'` {#event-readable}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | O `'readable'` é sempre emitido no próximo tick após `.push()` ser chamado. |
| v10.0.0 | Usar `'readable'` requer chamar `.read()`. |
| v0.9.4 | Adicionado em: v0.9.4 |
:::

O evento `'readable'` é emitido quando há dados disponíveis para serem lidos do stream, até a marca d'água alta configurada (`state.highWaterMark`). Efetivamente, ele indica que o stream tem novas informações dentro do buffer. Se os dados estiverem disponíveis dentro deste buffer, [`stream.read()`](/pt/nodejs/api/stream#readablereadsize) pode ser chamado para recuperar esses dados. Além disso, o evento `'readable'` também pode ser emitido quando o final do stream for alcançado.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('readable', function() {
  // There is some data to read now.
  let data;

  while ((data = this.read()) !== null) {
    console.log(data);
  }
});
```
Se o final do stream foi alcançado, chamar [`stream.read()`](/pt/nodejs/api/stream#readablereadsize) retornará `null` e acionará o evento `'end'`. Isso também é verdade se nunca houve dados para serem lidos. Por exemplo, no exemplo a seguir, `foo.txt` é um arquivo vazio:

```js [ESM]
const fs = require('node:fs');
const rr = fs.createReadStream('foo.txt');
rr.on('readable', () => {
  console.log(`readable: ${rr.read()}`);
});
rr.on('end', () => {
  console.log('end');
});
```
A saída da execução deste script é:

```bash [BASH]
$ node test.js
readable: null
end
```
Em alguns casos, anexar um listener para o evento `'readable'` fará com que alguma quantidade de dados seja lida em um buffer interno.

Em geral, os mecanismos `readable.pipe()` e evento `'data'` são mais fáceis de entender do que o evento `'readable'`. No entanto, o tratamento de `'readable'` pode resultar em maior taxa de transferência.

Se ambos `'readable'` e [`'data'`](/pt/nodejs/api/stream#event-data) forem usados ao mesmo tempo, `'readable'` terá precedência no controle do fluxo, ou seja, `'data'` será emitido apenas quando [`stream.read()`](/pt/nodejs/api/stream#readablereadsize) for chamado. A propriedade `readableFlowing` se tornaria `false`. Se houver listeners `'data'` quando `'readable'` for removido, o stream começará a fluir, ou seja, eventos `'data'` serão emitidos sem chamar `.resume()`.


##### Evento: `'resume'` {#event-resume}

**Adicionado em: v0.9.4**

O evento `'resume'` é emitido quando [`stream.resume()`](/pt/nodejs/api/stream#readableresume) é chamado e `readableFlowing` não é `true`.

##### `readable.destroy([error])` {#readabledestroyerror}


::: info [Histórico]
| Versão  | Mudanças |
| :-------- | :------- |
| v14.0.0   | Funciona como uma no-op em um stream que já foi destruído. |
| v8.0.0    | Adicionado em: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Erro que será passado como payload no evento `'error'`
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Destrói o stream. Opcionalmente, emite um evento `'error'` e emite um evento `'close'` (a menos que `emitClose` esteja definido como `false`). Após esta chamada, o stream legível liberará quaisquer recursos internos e chamadas subsequentes para `push()` serão ignoradas.

Depois que `destroy()` for chamado, quaisquer outras chamadas serão uma no-op e nenhum outro erro, exceto de `_destroy()`, poderá ser emitido como `'error'`.

Os implementadores não devem substituir este método, mas sim implementar [`readable._destroy()`](/pt/nodejs/api/stream#readable_destroyerr-callback).

##### `readable.closed` {#readableclosed}

**Adicionado em: v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` após `'close'` ter sido emitido.

##### `readable.destroyed` {#readabledestroyed}

**Adicionado em: v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` após [`readable.destroy()`](/pt/nodejs/api/stream#readabledestroyerror) ter sido chamado.

##### `readable.isPaused()` {#readableispaused}

**Adicionado em: v0.11.14**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

O método `readable.isPaused()` retorna o estado operacional atual do `Readable`. Isso é usado principalmente pelo mecanismo que está por trás do método `readable.pipe()`. Na maioria dos casos típicos, não haverá razão para usar este método diretamente.

```js [ESM]
const readable = new stream.Readable();

readable.isPaused(); // === false
readable.pause();
readable.isPaused(); // === true
readable.resume();
readable.isPaused(); // === false
```

##### `readable.pause()` {#readablepause}

**Adicionado em: v0.9.4**

- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

O método `readable.pause()` fará com que um stream no modo de fluxo pare de emitir eventos [`'data'`](/pt/nodejs/api/stream#event-data), saindo do modo de fluxo. Quaisquer dados que se tornem disponíveis permanecerão no buffer interno.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
  readable.pause();
  console.log('There will be no additional data for 1 second.');
  setTimeout(() => {
    console.log('Now data will start flowing again.');
    readable.resume();
  }, 1000);
});
```
O método `readable.pause()` não tem efeito se houver um listener de evento `'readable'`.

##### `readable.pipe(destination[, options])` {#readablepipedestination-options}

**Adicionado em: v0.9.4**

- `destination` [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable) O destino para escrever dados
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de pipe
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Finaliza o writer quando o reader finaliza. **Padrão:** `true`.
  
 
- Retorna: [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable) O *destino*, permitindo uma cadeia de pipes se for um stream [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) ou [`Transform`](/pt/nodejs/api/stream#class-streamtransform)

O método `readable.pipe()` anexa um stream [`Writable`](/pt/nodejs/api/stream#class-streamwritable) ao `readable`, fazendo com que ele mude automaticamente para o modo de fluxo e envie todos os seus dados para o [`Writable`](/pt/nodejs/api/stream#class-streamwritable) anexado. O fluxo de dados será gerenciado automaticamente para que o stream `Writable` de destino não seja sobrecarregado por um stream `Readable` mais rápido.

O exemplo a seguir envia todos os dados do `readable` para um arquivo chamado `file.txt`:

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// All the data from readable goes into 'file.txt'.
readable.pipe(writable);
```
É possível anexar múltiplos streams `Writable` a um único stream `Readable`.

O método `readable.pipe()` retorna uma referência ao stream de *destino*, possibilitando a configuração de cadeias de streams encadeados:

```js [ESM]
const fs = require('node:fs');
const zlib = require('node:zlib');
const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
```
Por padrão, [`stream.end()`](/pt/nodejs/api/stream#writableendchunk-encoding-callback) é chamado no stream `Writable` de destino quando o stream `Readable` de origem emite [`'end'`](/pt/nodejs/api/stream#event-end), para que o destino não seja mais gravável. Para desativar este comportamento padrão, a opção `end` pode ser passada como `false`, fazendo com que o stream de destino permaneça aberto:

```js [ESM]
reader.pipe(writer, { end: false });
reader.on('end', () => {
  writer.end('Goodbye\n');
});
```
Uma ressalva importante é que, se o stream `Readable` emitir um erro durante o processamento, o destino `Writable` *não será fechado* automaticamente. Se ocorrer um erro, será necessário fechar *manualmente* cada stream para evitar vazamentos de memória.

Os streams `Writable` [`process.stderr`](/pt/nodejs/api/process#processstderr) e [`process.stdout`](/pt/nodejs/api/process#processstdout) nunca são fechados até que o processo Node.js seja encerrado, independentemente das opções especificadas.


##### `readable.read([size])` {#readablereadsize}

**Adicionado em: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Argumento opcional para especificar a quantidade de dados a serem lidos.
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

O método `readable.read()` lê dados do buffer interno e os retorna. Se nenhum dado estiver disponível para leitura, `null` é retornado. Por padrão, os dados são retornados como um objeto `Buffer`, a menos que uma codificação tenha sido especificada usando o método `readable.setEncoding()` ou o stream esteja operando no modo de objeto.

O argumento opcional `size` especifica um número específico de bytes para ler. Se bytes de `size` não estiverem disponíveis para leitura, `null` será retornado *a menos que* o stream tenha terminado, caso em que todos os dados restantes no buffer interno serão retornados.

Se o argumento `size` não for especificado, todos os dados contidos no buffer interno serão retornados.

O argumento `size` deve ser menor ou igual a 1 GiB.

O método `readable.read()` deve ser chamado apenas em streams `Readable` operando em modo pausado. No modo de fluxo, `readable.read()` é chamado automaticamente até que o buffer interno seja totalmente esvaziado.

```js [ESM]
const readable = getReadableStreamSomehow();

// 'readable' pode ser acionado várias vezes à medida que os dados são armazenados em buffer
readable.on('readable', () => {
  let chunk;
  console.log('Stream is readable (new data received in buffer)');
  // Use um loop para garantir que lemos todos os dados atualmente disponíveis
  while (null !== (chunk = readable.read())) {
    console.log(`Read ${chunk.length} bytes of data...`);
  }
});

// 'end' será acionado uma vez quando não houver mais dados disponíveis
readable.on('end', () => {
  console.log('Reached end of stream.');
});
```
Cada chamada para `readable.read()` retorna um pedaço de dados ou `null`, significando que não há mais dados para ler naquele momento. Esses pedaços não são automaticamente concatenados. Como uma única chamada `read()` não retorna todos os dados, usar um loop while pode ser necessário para ler continuamente os pedaços até que todos os dados sejam recuperados. Ao ler um arquivo grande, `.read()` pode retornar `null` temporariamente, indicando que consumiu todo o conteúdo armazenado em buffer, mas pode haver mais dados a serem armazenados em buffer. Nesses casos, um novo evento `'readable'` é emitido assim que houver mais dados no buffer, e o evento `'end'` significa o fim da transmissão de dados.

Portanto, para ler todo o conteúdo de um arquivo de um `readable`, é necessário coletar pedaços em vários eventos `'readable'`:

```js [ESM]
const chunks = [];

readable.on('readable', () => {
  let chunk;
  while (null !== (chunk = readable.read())) {
    chunks.push(chunk);
  }
});

readable.on('end', () => {
  const content = chunks.join('');
});
```
Um stream `Readable` no modo de objeto sempre retornará um único item de uma chamada para [`readable.read(size)`](/pt/nodejs/api/stream#readablereadsize), independentemente do valor do argumento `size`.

Se o método `readable.read()` retornar um pedaço de dados, um evento `'data'` também será emitido.

Chamar [`stream.read([size])`](/pt/nodejs/api/stream#readablereadsize) após o evento [`'end'`](/pt/nodejs/api/stream#event-end) ter sido emitido retornará `null`. Nenhum erro de tempo de execução será gerado.


##### `readable.readable` {#readablereadable}

**Adicionado em: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` se for seguro chamar [`readable.read()`](/pt/nodejs/api/stream#readablereadsize), o que significa que o stream não foi destruído ou emitiu `'error'` ou `'end'`.

##### `readable.readableAborted` {#readablereadableaborted}

**Adicionado em: v16.8.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna se o stream foi destruído ou apresentou erro antes de emitir `'end'`.

##### `readable.readableDidRead` {#readablereadabledidread}

**Adicionado em: v16.7.0, v14.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna se `'data'` foi emitido.

##### `readable.readableEncoding` {#readablereadableencoding}

**Adicionado em: v12.7.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Getter para a propriedade `encoding` de um determinado stream `Readable`. A propriedade `encoding` pode ser definida usando o método [`readable.setEncoding()`](/pt/nodejs/api/stream#readablesetencodingencoding).

##### `readable.readableEnded` {#readablereadableended}

**Adicionado em: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Torna-se `true` quando o evento [`'end'`](/pt/nodejs/api/stream#event-end) é emitido.

##### `readable.errored` {#readableerrored}

**Adicionado em: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Retorna o erro se o stream foi destruído com um erro.

##### `readable.readableFlowing` {#readablereadableflowing}

**Adicionado em: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta propriedade reflete o estado atual de um stream `Readable` conforme descrito na seção [Três estados](/pt/nodejs/api/stream#three-states).


##### `readable.readableHighWaterMark` {#readablereadablehighwatermark}

**Adicionado em: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna o valor de `highWaterMark` passado ao criar este `Readable`.

##### `readable.readableLength` {#readablereadablelength}

**Adicionado em: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Esta propriedade contém o número de bytes (ou objetos) na fila prontos para serem lidos. O valor fornece dados de introspecção sobre o status do `highWaterMark`.

##### `readable.readableObjectMode` {#readablereadableobjectmode}

**Adicionado em: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Getter para a propriedade `objectMode` de um stream `Readable` fornecido.

##### `readable.resume()` {#readableresume}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | O `resume()` não tem efeito se houver um ouvinte de evento `'readable'`. |
| v0.9.4 | Adicionado em: v0.9.4 |
:::

- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

O método `readable.resume()` faz com que um stream `Readable` explicitamente pausado retome a emissão de eventos [`'data'`](/pt/nodejs/api/stream#event-data), mudando o stream para o modo de fluxo.

O método `readable.resume()` pode ser usado para consumir totalmente os dados de um stream sem realmente processar nenhum desses dados:

```js [ESM]
getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('Chegou ao fim, mas não leu nada.');
  });
```
O método `readable.resume()` não tem efeito se houver um listener de evento `'readable'`.

##### `readable.setEncoding(encoding)` {#readablesetencodingencoding}

**Adicionado em: v0.9.4**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação a ser usada.
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

O método `readable.setEncoding()` define a codificação de caracteres para dados lidos do stream `Readable`.

Por padrão, nenhuma codificação é atribuída e os dados do stream serão retornados como objetos `Buffer`. Definir uma codificação faz com que os dados do stream sejam retornados como strings da codificação especificada, em vez de como objetos `Buffer`. Por exemplo, chamar `readable.setEncoding('utf8')` fará com que os dados de saída sejam interpretados como dados UTF-8 e passados como strings. Chamar `readable.setEncoding('hex')` fará com que os dados sejam codificados no formato de string hexadecimal.

O stream `Readable` lidará corretamente com caracteres multi-byte entregues através do stream que, de outra forma, seriam decodificados incorretamente se simplesmente extraídos do stream como objetos `Buffer`.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log('Obteve %d caracteres de dados de string:', chunk.length);
});
```

##### `readable.unpipe([destination])` {#readableunpipedestination}

**Adicionado em: v0.9.4**

- `destination` [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable) Stream específico opcional para desvincular (unpipe)
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

O método `readable.unpipe()` desanexa um stream `Writable` previamente anexado usando o método [`stream.pipe()`](/pt/nodejs/api/stream#readablepipedestination-options).

Se o `destination` não for especificado, então *todos* os pipes serão desanexados.

Se o `destination` for especificado, mas nenhum pipe estiver configurado para ele, então o método não fará nada.

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// Todos os dados de readable vão para 'file.txt',
// mas apenas durante o primeiro segundo.
readable.pipe(writable);
setTimeout(() => {
  console.log('Pare de escrever em file.txt.');
  readable.unpipe(writable);
  console.log('Feche manualmente o stream do arquivo.');
  writable.end();
}, 1000);
```
##### `readable.unshift(chunk[, encoding])` {#readableunshiftchunk-encoding}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.0.0, v20.13.0 | O argumento `chunk` agora pode ser uma instância de `TypedArray` ou `DataView`. |
| v8.0.0 | O argumento `chunk` agora pode ser uma instância de `Uint8Array`. |
| v0.9.11 | Adicionado em: v0.9.11 |
:::

- `chunk` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Chunk de dados para descolocar na fila de leitura. Para streams que não operam no modo de objeto, `chunk` deve ser um [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) ou `null`. Para streams no modo de objeto, `chunk` pode ser qualquer valor JavaScript.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codificação de chunks de string. Deve ser uma codificação `Buffer` válida, como `'utf8'` ou `'ascii'`.

Passar `chunk` como `null` sinaliza o fim do stream (EOF) e se comporta da mesma forma que `readable.push(null)`, após o qual nenhum dado pode ser escrito. O sinal EOF é colocado no final do buffer e quaisquer dados armazenados em buffer ainda serão descarregados.

O método `readable.unshift()` empurra um chunk de dados de volta para o buffer interno. Isso é útil em certas situações onde um stream está sendo consumido por código que precisa "des-consumir" alguma quantidade de dados que ele retirou otimisticamente da fonte, para que os dados possam ser passados para outra parte.

O método `stream.unshift(chunk)` não pode ser chamado após o evento [`'end'`](/pt/nodejs/api/stream#event-end) ter sido emitido ou um erro de tempo de execução será lançado.

Desenvolvedores que usam `stream.unshift()` geralmente devem considerar mudar para o uso de um stream [`Transform`](/pt/nodejs/api/stream#class-streamtransform). Consulte a seção [API para implementadores de stream](/pt/nodejs/api/stream#api-for-stream-implementers) para obter mais informações.

```js [ESM]
// Retire um cabeçalho delimitado por \n\n.
// Use unshift() se recebermos demais.
// Chame o callback com (error, header, stream).
const { StringDecoder } = require('node:string_decoder');
function parseHeader(stream, callback) {
  stream.on('error', callback);
  stream.on('readable', onReadable);
  const decoder = new StringDecoder('utf8');
  let header = '';
  function onReadable() {
    let chunk;
    while (null !== (chunk = stream.read())) {
      const str = decoder.write(chunk);
      if (str.includes('\n\n')) {
        // Encontrou o limite do cabeçalho.
        const split = str.split(/\n\n/);
        header += split.shift();
        const remaining = split.join('\n\n');
        const buf = Buffer.from(remaining, 'utf8');
        stream.removeListener('error', callback);
        // Remova o listener 'readable' antes de descolocar.
        stream.removeListener('readable', onReadable);
        if (buf.length)
          stream.unshift(buf);
        // Agora o corpo da mensagem pode ser lido do stream.
        callback(null, header, stream);
        return;
      }
      // Ainda lendo o cabeçalho.
      header += str;
    }
  }
}
```
Ao contrário de [`stream.push(chunk)`](/pt/nodejs/api/stream#readablepushchunk-encoding), `stream.unshift(chunk)` não encerrará o processo de leitura redefinindo o estado interno de leitura do stream. Isso pode causar resultados inesperados se `readable.unshift()` for chamado durante uma leitura (ou seja, de dentro de uma implementação [`stream._read()`](/pt/nodejs/api/stream#readable_readsize) em um stream personalizado). Seguir a chamada para `readable.unshift()` com um [`stream.push('')`](/pt/nodejs/api/stream#readablepushchunk-encoding) imediato redefinirá o estado de leitura adequadamente, no entanto, é melhor simplesmente evitar chamar `readable.unshift()` enquanto estiver no processo de realizar uma leitura.


##### `readable.wrap(stream)` {#readablewrapstream}

**Adicionado em: v0.9.4**

- `stream` [\<Stream\>](/pt/nodejs/api/stream#stream) Um fluxo legível de "estilo antigo"
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Antes do Node.js 0.10, os fluxos não implementavam toda a API do módulo `node:stream` como está definida atualmente. (Veja [Compatibilidade](/pt/nodejs/api/stream#compatibility-with-older-nodejs-versions) para mais informações.)

Ao usar uma biblioteca Node.js mais antiga que emite eventos [`'data'`](/pt/nodejs/api/stream#event-data) e possui um método [`stream.pause()`](/pt/nodejs/api/stream#readablepause) que é apenas consultivo, o método `readable.wrap()` pode ser usado para criar um fluxo [`Readable`](/pt/nodejs/api/stream#class-streamreadable) que usa o fluxo antigo como sua fonte de dados.

Raramente será necessário usar `readable.wrap()`, mas o método foi fornecido como uma conveniência para interagir com aplicativos e bibliotecas Node.js mais antigos.

```js [ESM]
const { OldReader } = require('./old-api-module.js');
const { Readable } = require('node:stream');
const oreader = new OldReader();
const myReader = new Readable().wrap(oreader);

myReader.on('readable', () => {
  myReader.read(); // etc.
});
```
##### `readable[Symbol.asyncIterator]()` {#readablesymbolasynciterator}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v11.14.0 | O suporte a Symbol.asyncIterator não é mais experimental. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- Retorna: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) para consumir totalmente o fluxo.

```js [ESM]
const fs = require('node:fs');

async function print(readable) {
  readable.setEncoding('utf8');
  let data = '';
  for await (const chunk of readable) {
    data += chunk;
  }
  console.log(data);
}

print(fs.createReadStream('file')).catch(console.error);
```
Se o loop terminar com um `break`, `return` ou um `throw`, o fluxo será destruído. Em outras palavras, iterar sobre um fluxo consumirá o fluxo totalmente. O fluxo será lido em blocos de tamanho igual à opção `highWaterMark`. No exemplo de código acima, os dados estarão em um único bloco se o arquivo tiver menos de 64 KiB de dados porque nenhuma opção `highWaterMark` é fornecida para [`fs.createReadStream()`](/pt/nodejs/api/fs#fscreatereadstreampath-options).


##### `readable[Symbol.asyncDispose]()` {#readablesymbolasyncdispose}

**Adicionado em: v20.4.0, v18.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Chama [`readable.destroy()`](/pt/nodejs/api/stream#readabledestroyerror) com um `AbortError` e retorna uma promise que é cumprida quando o stream é finalizado.

##### `readable.compose(stream[, options])` {#readablecomposestream-options}

**Adicionado em: v19.1.0, v18.13.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `stream` [\<Stream\>](/pt/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite destruir o stream se o sinal for abortado.


- Retorna: [\<Duplex\>](/pt/nodejs/api/stream#class-streamduplex) um stream composto com o stream `stream`.

```js [ESM]
import { Readable } from 'node:stream';

async function* splitToWords(source) {
  for await (const chunk of source) {
    const words = String(chunk).split(' ');

    for (const word of words) {
      yield word;
    }
  }
}

const wordsStream = Readable.from(['this is', 'compose as operator']).compose(splitToWords);
const words = await wordsStream.toArray();

console.log(words); // imprime ['this', 'is', 'compose', 'as', 'operator']
```
Consulte [`stream.compose`](/pt/nodejs/api/stream#streamcomposestreams) para obter mais informações.

##### `readable.iterator([options])` {#readableiteratoroptions}

**Adicionado em: v16.3.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `destroyOnReturn` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando definido como `false`, chamar `return` no iterador assíncrono ou sair de uma iteração `for await...of` usando um `break`, `return` ou `throw` não destruirá o stream. **Padrão:** `true`.


- Retorna: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) para consumir o stream.

O iterador criado por este método dá aos usuários a opção de cancelar a destruição do stream se o loop `for await...of` for encerrado por `return`, `break` ou `throw`, ou se o iterador deve destruir o stream se o stream emitiu um erro durante a iteração.

```js [ESM]
const { Readable } = require('node:stream');

async function printIterator(readable) {
  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // false

  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // Imprimirá 2 e depois 3
  }

  console.log(readable.destroyed); // True, stream foi totalmente consumido
}

async function printSymbolAsyncIterator(readable) {
  for await (const chunk of readable) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // true
}

async function showBoth() {
  await printIterator(Readable.from([1, 2, 3]));
  await printSymbolAsyncIterator(Readable.from([1, 2, 3]));
}

showBoth();
```

##### `readable.map(fn[, options])` {#readablemapfn-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.7.0, v18.19.0 | adicionado `highWaterMark` nas opções. |
| v17.4.0, v16.14.0 | Adicionado em: v17.4.0, v16.14.0 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) uma função para mapear cada chunk no stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) um chunk de dados do stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) abortado se o stream for destruído, permitindo abortar a chamada `fn` antecipadamente.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) o número máximo de invocações concorrentes de `fn` para chamar no stream de uma vez. **Padrão:** `1`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) quantos itens armazenar em buffer enquanto espera o consumo do usuário dos itens mapeados. **Padrão:** `concurrency * 2 - 1`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite destruir o stream se o sinal for abortado.


- Retorna: [\<Readable\>](/pt/nodejs/api/stream#class-streamreadable) um stream mapeado com a função `fn`.

Este método permite mapear sobre o stream. A função `fn` será chamada para cada chunk no stream. Se a função `fn` retornar uma promise - essa promise será `await` antes de ser passada para o stream de resultado.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// Com um mapper síncrono.
for await (const chunk of Readable.from([1, 2, 3, 4]).map((x) => x * 2)) {
  console.log(chunk); // 2, 4, 6, 8
}
// Com um mapper assíncrono, fazendo no máximo 2 consultas por vez.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map((domain) => resolver.resolve4(domain), { concurrency: 2 });
for await (const result of dnsResults) {
  console.log(result); // Registra o resultado DNS de resolver.resolve4.
}
```

##### `readable.filter(fn[, options])` {#readablefilterfn-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v20.7.0, v18.19.0 | adicionado `highWaterMark` nas opções. |
| v17.4.0, v16.14.0 | Adicionado em: v17.4.0, v16.14.0 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) uma função para filtrar chunks do stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) um chunk de dados do stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) abortado se o stream for destruído permitindo abortar a chamada `fn` antecipadamente.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) a invocação concorrente máxima de `fn` para chamar no stream de uma só vez. **Padrão:** `1`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) quantos itens armazenar em buffer enquanto aguarda o consumo do usuário dos itens filtrados. **Padrão:** `concurrency * 2 - 1`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite destruir o stream se o sinal for abortado.


- Retorna: [\<Readable\>](/pt/nodejs/api/stream#class-streamreadable) um stream filtrado com o predicado `fn`.

Este método permite filtrar o stream. Para cada chunk no stream, a função `fn` será chamada e, se retornar um valor truthy, o chunk será passado para o stream de resultado. Se a função `fn` retornar uma promise - essa promise será `await`ed.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// Com um predicado síncrono.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// Com um predicado assíncrono, fazendo no máximo 2 queries por vez.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).filter(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address.ttl > 60;
}, { concurrency: 2 });
for await (const result of dnsResults) {
  // Registra domínios com mais de 60 segundos no registro dns resolvido.
  console.log(result);
}
```

##### `readable.forEach(fn[, options])` {#readableforeachfn-options}

**Adicionado em: v17.5.0, v16.15.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) uma função para chamar em cada bloco do fluxo.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) um bloco de dados do fluxo.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) abortado se o fluxo for destruído, permitindo abortar a chamada `fn` antecipadamente.



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) a invocação simultânea máxima de `fn` para chamar no fluxo de uma vez. **Padrão:** `1`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite destruir o fluxo se o sinal for abortado.


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) uma promessa para quando o fluxo terminar.

Este método permite iterar um fluxo. Para cada bloco no fluxo, a função `fn` será chamada. Se a função `fn` retornar uma promessa - essa promessa será `await`ed.

Este método é diferente dos loops `for await...of` porque pode opcionalmente processar blocos simultaneamente. Além disso, uma iteração `forEach` só pode ser interrompida passando uma opção `signal` e abortando o `AbortController` relacionado, enquanto `for await...of` pode ser interrompido com `break` ou `return`. Em ambos os casos, o fluxo será destruído.

Este método é diferente de ouvir o evento [`'data'`](/pt/nodejs/api/stream#event-data) porque usa o evento [`readable`](/pt/nodejs/api/stream#class-streamreadable) na máquina subjacente e pode limitar o número de chamadas `fn` simultâneas.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// Com um predicado síncrono.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// Com um predicado assíncrono, fazendo no máximo 2 consultas por vez.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 });
await dnsResults.forEach((result) => {
  // Registra o resultado, semelhante a `for await (const result of dnsResults)`
  console.log(result);
});
console.log('done'); // O fluxo terminou
```

##### `readable.toArray([options])` {#readabletoarrayoptions}

**Adicionado em: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite cancelar a operação toArray se o sinal for abortado.


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) uma promessa contendo um array com o conteúdo do stream.

Este método permite obter facilmente o conteúdo de um stream.

Como este método lê o stream inteiro para a memória, ele nega os benefícios dos streams. Ele é destinado para interoperabilidade e conveniência, não como a forma primária de consumir streams.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

await Readable.from([1, 2, 3, 4]).toArray(); // [1, 2, 3, 4]

// Faça consultas DNS concorrentemente usando .map e colete
// os resultados em um array usando toArray
const dnsResults = await Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 }).toArray();
```
##### `readable.some(fn[, options])` {#readablesomefn-options}

**Adicionado em: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) uma função para chamar em cada chunk do stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) um chunk de dados do stream.
    - `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) abortado se o stream for destruído, permitindo abortar a chamada `fn` mais cedo.



- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) a invocação concorrente máxima de `fn` para chamar no stream de uma vez. **Padrão:** `1`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite destruir o stream se o sinal for abortado.


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) uma promessa avaliando para `true` se `fn` retornou um valor truthy para pelo menos um dos chunks.

Este método é similar ao `Array.prototype.some` e chama `fn` em cada chunk no stream até que o valor de retorno aguardado seja `true` (ou qualquer valor truthy). Assim que uma chamada `fn` em um valor de retorno aguardado de chunk é truthy, o stream é destruído e a promessa é cumprida com `true`. Se nenhuma das chamadas `fn` nos chunks retornar um valor truthy, a promessa é cumprida com `false`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// Com um predicado síncrono.
await Readable.from([1, 2, 3, 4]).some((x) => x > 2); // true
await Readable.from([1, 2, 3, 4]).some((x) => x < 0); // false

// Com um predicado assíncrono, fazendo no máximo 2 verificações de arquivo por vez.
const anyBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).some(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(anyBigFile); // `true` se algum arquivo na lista for maior que 1MB
console.log('done'); // Stream terminou
```

##### `readable.find(fn[, options])` {#readablefindfn-options}

**Adicionado em: v17.5.0, v16.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) uma função a ser chamada em cada bloco do fluxo.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) um bloco de dados do fluxo.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) abortado se o fluxo for destruído, permitindo abortar a chamada `fn` antecipadamente.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) a invocação concorrente máxima de `fn` a ser chamada no fluxo de uma só vez. **Padrão:** `1`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite destruir o fluxo se o sinal for abortado.


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) uma promessa que avalia o primeiro bloco para o qual `fn` avaliou com um valor verdadeiro ou `undefined` se nenhum elemento foi encontrado.

Este método é semelhante a `Array.prototype.find` e chama `fn` em cada bloco no fluxo para encontrar um bloco com um valor verdadeiro para `fn`. Depois que o valor de retorno aguardado de uma chamada `fn` for verdadeiro, o fluxo será destruído e a promessa será cumprida com o valor para o qual `fn` retornou um valor verdadeiro. Se todas as chamadas `fn` nos blocos retornarem um valor falso, a promessa será cumprida com `undefined`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// Com um predicado síncrono.
await Readable.from([1, 2, 3, 4]).find((x) => x > 2); // 3
await Readable.from([1, 2, 3, 4]).find((x) => x > 0); // 1
await Readable.from([1, 2, 3, 4]).find((x) => x > 10); // undefined

// Com um predicado assíncrono, fazendo no máximo 2 verificações de arquivo por vez.
const foundBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).find(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(foundBigFile); // Nome do arquivo grande, se algum arquivo na lista for maior que 1 MB
console.log('done'); // O fluxo terminou
```

##### `readable.every(fn[, options])` {#readableeveryfn-options}

**Adicionado em: v17.5.0, v16.15.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) uma função a ser chamada em cada pedaço do stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) um pedaço de dados do stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) abortado se o stream for destruído, permitindo abortar a chamada `fn` antecipadamente.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) a invocação concorrente máxima de `fn` a ser chamada no stream de uma vez. **Padrão:** `1`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite destruir o stream se o sinal for abortado.


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) uma promise que avalia para `true` se `fn` retornou um valor truthy para todos os pedaços.

Este método é semelhante a `Array.prototype.every` e chama `fn` em cada pedaço no stream para verificar se todos os valores de retorno aguardados são um valor truthy para `fn`. Uma vez que uma chamada `fn` em um pedaço aguardado retorna um valor falsy, o stream é destruído e a promise é cumprida com `false`. Se todas as chamadas `fn` nos pedaços retornarem um valor truthy, a promise é cumprida com `true`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// Com um predicado síncrono.
await Readable.from([1, 2, 3, 4]).every((x) => x > 2); // false
await Readable.from([1, 2, 3, 4]).every((x) => x > 0); // true

// Com um predicado assíncrono, fazendo no máximo 2 verificações de arquivo por vez.
const allBigFiles = await Readable.from([
  'file1',
  'file2',
  'file3',
]).every(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
// `true` se todos os arquivos na lista forem maiores que 1MiB
console.log(allBigFiles);
console.log('done'); // Stream terminou
```

##### `readable.flatMap(fn[, options])` {#readableflatmapfn-options}

**Adicionado em: v17.5.0, v16.15.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) uma função para mapear cada chunk no stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) um chunk de dados do stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) abortado se o stream for destruído, permitindo abortar a chamada `fn` antecipadamente.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) a invocação concorrente máxima de `fn` para chamar no stream de uma só vez. **Padrão:** `1`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite destruir o stream se o sinal for abortado.


- Retorna: [\<Readable\>](/pt/nodejs/api/stream#class-streamreadable) um stream flat-mapeado com a função `fn`.

Este método retorna um novo stream aplicando o callback fornecido a cada chunk do stream e, em seguida, achatando o resultado.

É possível retornar um stream ou outro iterável ou iterável assíncrono de `fn` e os streams de resultado serão mesclados (achatados) no stream retornado.

```js [ESM]
import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';

// Com um mapper síncrono.
for await (const chunk of Readable.from([1, 2, 3, 4]).flatMap((x) => [x, x])) {
  console.log(chunk); // 1, 1, 2, 2, 3, 3, 4, 4
}
// Com um mapper assíncrono, combine o conteúdo de 4 arquivos
const concatResult = Readable.from([
  './1.mjs',
  './2.mjs',
  './3.mjs',
  './4.mjs',
]).flatMap((fileName) => createReadStream(fileName));
for await (const result of concatResult) {
  // Isso conterá o conteúdo (todos os chunks) de todos os 4 arquivos
  console.log(result);
}
```

##### `readable.drop(limit[, options])` {#readabledroplimit-options}

**Adicionado em: v17.5.0, v16.15.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) o número de partes a serem descartadas do legível.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite destruir o stream se o sinal for abortado.


- Retorna: [\<Readable\>](/pt/nodejs/api/stream#class-streamreadable) um stream com `limit` partes descartadas.

Este método retorna um novo stream com as primeiras `limit` partes descartadas.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).drop(2).toArray(); // [3, 4]
```
##### `readable.take(limit[, options])` {#readabletakelimit-options}

**Adicionado em: v17.5.0, v16.15.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) o número de partes a serem retiradas do legível.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite destruir o stream se o sinal for abortado.


- Retorna: [\<Readable\>](/pt/nodejs/api/stream#class-streamreadable) um stream com `limit` partes retiradas.

Este método retorna um novo stream com as primeiras `limit` partes.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).take(2).toArray(); // [1, 2]
```
##### `readable.reduce(fn[, initial[, options]])` {#readablereducefn-initial-options}

**Adicionado em: v17.5.0, v16.15.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) uma função redutora para chamar sobre cada parte no stream.
    - `previous` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) o valor obtido da última chamada para `fn` ou o valor `initial` se especificado ou a primeira parte do stream caso contrário.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) uma parte de dados do stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) abortado se o stream for destruído permitindo abortar a chamada `fn` precocemente.



- `initial` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) o valor inicial para usar na redução.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite destruir o stream se o sinal for abortado.


- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) uma promessa para o valor final da redução.

Este método chama `fn` em cada parte do stream em ordem, passando o resultado do cálculo no elemento anterior. Ele retorna uma promessa para o valor final da redução.

Se nenhum valor `initial` for fornecido, a primeira parte do stream é usada como o valor inicial. Se o stream estiver vazio, a promessa é rejeitada com um `TypeError` com a propriedade de código `ERR_INVALID_ARGS`.

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .reduce(async (totalSize, file) => {
    const { size } = await stat(join(directoryPath, file));
    return totalSize + size;
  }, 0);

console.log(folderSize);
```
A função redutora itera o stream elemento por elemento, o que significa que não há parâmetro de `concurrency` ou paralelismo. Para executar um `reduce` concorrentemente, você pode extrair a função async para o método [`readable.map`](/pt/nodejs/api/stream#readablemapfn-options).

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .map((file) => stat(join(directoryPath, file)), { concurrency: 2 })
  .reduce((totalSize, { size }) => totalSize + size, 0);

console.log(folderSize);
```

### Streams Duplex e de Transformação {#duplex-and-transform-streams}

#### Classe: `stream.Duplex` {#class-streamduplex}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v6.8.0 | Instâncias de `Duplex` agora retornam `true` ao verificar `instanceof stream.Writable`. |
| v0.9.4 | Adicionado em: v0.9.4 |
:::

Streams Duplex são streams que implementam as interfaces [`Readable`](/pt/nodejs/api/stream#class-streamreadable) e [`Writable`](/pt/nodejs/api/stream#class-streamwritable).

Exemplos de streams `Duplex` incluem:

- [Sockets TCP](/pt/nodejs/api/net#class-netsocket)
- [Streams zlib](/pt/nodejs/api/zlib)
- [Streams de criptografia](/pt/nodejs/api/crypto)

##### `duplex.allowHalfOpen` {#duplexallowhalfopen}

**Adicionado em: v0.9.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se `false`, o stream encerrará automaticamente o lado gravável quando o lado legível terminar. Definido inicialmente pela opção do construtor `allowHalfOpen`, que assume o valor padrão `true`.

Isso pode ser alterado manualmente para alterar o comportamento meio-aberto de uma instância `Duplex` stream existente, mas deve ser alterado antes que o evento `'end'` seja emitido.

#### Classe: `stream.Transform` {#class-streamtransform}

**Adicionado em: v0.9.4**

Streams de transformação são streams [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) onde a saída está de alguma forma relacionada à entrada. Como todos os streams [`Duplex`](/pt/nodejs/api/stream#class-streamduplex), os streams `Transform` implementam as interfaces [`Readable`](/pt/nodejs/api/stream#class-streamreadable) e [`Writable`](/pt/nodejs/api/stream#class-streamwritable).

Exemplos de streams `Transform` incluem:

- [Streams zlib](/pt/nodejs/api/zlib)
- [Streams de criptografia](/pt/nodejs/api/crypto)

##### `transform.destroy([error])` {#transformdestroyerror}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v14.0.0 | Funciona como uma operação no-op em um stream que já foi destruído. |
| v8.0.0 | Adicionado em: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Destrói o stream e, opcionalmente, emite um evento `'error'`. Após esta chamada, o stream de transformação liberará quaisquer recursos internos. Os implementadores não devem substituir este método, mas sim implementar [`readable._destroy()`](/pt/nodejs/api/stream#readable_destroyerr-callback). A implementação padrão de `_destroy()` para `Transform` também emite `'close'` a menos que `emitClose` seja definido como falso.

Depois que `destroy()` for chamado, quaisquer chamadas adicionais serão uma operação no-op e nenhum erro adicional, exceto de `_destroy()`, poderá ser emitido como `'error'`.


#### `stream.duplexPair([options])` {#streamduplexpairoptions}

**Adicionado em: v22.6.0, v20.17.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um valor a ser passado para ambos os construtores [`Duplex`](/pt/nodejs/api/stream#class-streamduplex), para definir opções como buffering.
- Retorna: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) de duas instâncias [`Duplex`](/pt/nodejs/api/stream#class-streamduplex).

A função utilitária `duplexPair` retorna um Array com dois itens, cada um sendo um stream `Duplex` conectado ao outro lado:

```js [ESM]
const [ sideA, sideB ] = duplexPair();
```
O que for escrito em um stream se torna legível no outro. Ele fornece um comportamento análogo a uma conexão de rede, onde os dados escritos pelo cliente se tornam legíveis pelo servidor e vice-versa.

Os streams Duplex são simétricos; um ou outro pode ser usado sem qualquer diferença no comportamento.

### `stream.finished(stream[, options], callback)` {#streamfinishedstream-options-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.5.0 | Adicionado suporte para `ReadableStream` e `WritableStream`. |
| v15.11.0 | A opção `signal` foi adicionada. |
| v14.0.0 | `finished(stream, cb)` aguardará o evento `'close'` antes de invocar o callback. A implementação tenta detectar streams legados e aplicar esse comportamento apenas a streams que devem emitir `'close'`. |
| v14.0.0 | Emitir `'close'` antes de `'end'` em um stream `Readable` causará um erro `ERR_STREAM_PREMATURE_CLOSE`. |
| v14.0.0 | O callback será invocado em streams que já terminaram antes da chamada para `finished(stream, cb)`. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `stream` [\<Stream\>](/pt/nodejs/api/stream#stream) | [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream) Um stream/webstream legível e/ou gravável.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `false`, então uma chamada para `emit('error', err)` não é tratada como finalizada. **Padrão:** `true`.
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando definido como `false`, o callback será chamado quando o stream terminar, mesmo que o stream ainda possa ser legível. **Padrão:** `true`.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando definido como `false`, o callback será chamado quando o stream terminar, mesmo que o stream ainda possa ser gravável. **Padrão:** `true`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite abortar a espera pelo término do stream. O stream subjacente *não* será abortado se o sinal for abortado. O callback será chamado com um `AbortError`. Todos os listeners registrados adicionados por esta função também serão removidos.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função de callback que recebe um argumento de erro opcional.
- Retorna: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função de limpeza que remove todos os listeners registrados.

Uma função para ser notificado quando um stream não for mais legível, gravável ou tiver experimentado um erro ou um evento de fechamento prematuro.

```js [ESM]
const { finished } = require('node:stream');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

finished(rs, (err) => {
  if (err) {
    console.error('Stream failed.', err);
  } else {
    console.log('Stream is done reading.');
  }
});

rs.resume(); // Drena o stream.
```
Especialmente útil em cenários de tratamento de erros onde um stream é destruído prematuramente (como uma requisição HTTP abortada) e não emitirá `'end'` ou `'finish'`.

A API `finished` fornece uma [versão promise](/pt/nodejs/api/stream#streamfinishedstream-options).

`stream.finished()` deixa listeners de eventos pendentes (em particular `'error'`, `'end'`, `'finish'` e `'close'`) após a invocação do `callback`. O motivo para isso é que eventos `'error'` inesperados (devido a implementações de stream incorretas) não causem falhas inesperadas. Se este for um comportamento indesejado, a função de limpeza retornada precisa ser invocada no callback:

```js [ESM]
const cleanup = finished(rs, (err) => {
  cleanup();
  // ...
});
```

### `stream.pipeline(source[, ...transforms], destination, callback)` {#streampipelinesource-transforms-destination-callback}

### `stream.pipeline(streams, callback)` {#streampipelinestreams-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.7.0, v18.16.0 | Adicionado suporte para webstreams. |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v14.0.0 | O `pipeline(..., cb)` aguardará o evento `'close'` antes de invocar o callback. A implementação tenta detectar streams legados e aplicar este comportamento apenas a streams que devem emitir `'close'`. |
| v13.10.0 | Adiciona suporte para geradores async. |
| v10.0.0 | Adicionado em: v10.0.0 |
:::

- `streams` [\<Stream[]\>](/pt/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/pt/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/pt/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/pt/nodejs/api/webstreams#class-transformstream)
- `source` [\<Stream\>](/pt/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) 
    - Retorna: [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `...transforms` [\<Stream\>](/pt/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<TransformStream\>](/pt/nodejs/api/webstreams#class-transformstream) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Retorna: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `destination` [\<Stream\>](/pt/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Retorna: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chamado quando o pipeline estiver totalmente concluído. 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `val` Valor resolvido de `Promise` retornado por `destination`.
  
 
- Retorna: [\<Stream\>](/pt/nodejs/api/stream#stream)

Um método de módulo para canalizar entre streams e geradores encaminhando erros e limpando adequadamente e fornecer um callback quando o pipeline for concluído.

```js [ESM]
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');

// Use a API pipeline para canalizar facilmente uma série de streams
// juntos e ser notificado quando o pipeline estiver totalmente concluído.

// Um pipeline para compactar um arquivo tar potencialmente enorme de forma eficiente:

pipeline(
  fs.createReadStream('archive.tar'),
  zlib.createGzip(),
  fs.createWriteStream('archive.tar.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline falhou.', err);
    } else {
      console.log('Pipeline teve sucesso.');
    }
  },
);
```
A API `pipeline` fornece uma [versão promise](/pt/nodejs/api/stream#streampipelinesource-transforms-destination-options).

`stream.pipeline()` chamará `stream.destroy(err)` em todos os streams, exceto:

- Streams `Readable` que emitiram `'end'` ou `'close'`.
- Streams `Writable` que emitiram `'finish'` ou `'close'`.

`stream.pipeline()` deixa listeners de eventos pendentes nos streams após o `callback` ter sido invocado. No caso de reutilização de streams após falha, isso pode causar vazamentos de listeners de eventos e erros suprimidos. Se o último stream for legível, os listeners de eventos pendentes serão removidos para que o último stream possa ser consumido posteriormente.

`stream.pipeline()` fecha todos os streams quando um erro é levantado. O uso de `IncomingRequest` com `pipeline` pode levar a um comportamento inesperado, pois destruiria o socket sem enviar a resposta esperada. Veja o exemplo abaixo:

```js [ESM]
const fs = require('node:fs');
const http = require('node:http');
const { pipeline } = require('node:stream');

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('./fileNotExist.txt');
  pipeline(fileStream, res, (err) => {
    if (err) {
      console.log(err); // No such file
      // esta mensagem não pode ser enviada, pois `pipeline` já destruiu o socket
      return res.end('error!!!');
    }
  });
});
```

### `stream.compose(...streams)` {#streamcomposestreams}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.1.0, v20.10.0 | Adicionado suporte para a classe stream. |
| v19.8.0, v18.16.0 | Adicionado suporte para webstreams. |
| v16.9.0 | Adicionado em: v16.9.0 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - `stream.compose` é experimental.
:::

- `streams` [\<Stream[]\>](/pt/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/pt/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/pt/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/pt/nodejs/api/webstreams#class-transformstream) | [\<Duplex[]\>](/pt/nodejs/api/stream#class-streamduplex) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Combina dois ou mais streams em um stream `Duplex` que escreve no primeiro stream e lê do último. Cada stream fornecido é conectado ao próximo, usando `stream.pipeline`. Se algum dos streams apresentar erro, todos serão destruídos, incluindo o stream `Duplex` externo.

Como `stream.compose` retorna um novo stream que, por sua vez, pode (e deve) ser conectado a outros streams, ele permite a composição. Em contraste, ao passar streams para `stream.pipeline`, normalmente o primeiro stream é um stream legível e o último um stream gravável, formando um circuito fechado.

Se passado uma `Function`, ela deve ser um método de fábrica que recebe um `Iterable` de `source`.

```js [ESM]
import { compose, Transform } from 'node:stream';

const removeSpaces = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, String(chunk).replace(' ', ''));
  },
});

async function* toUpper(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
}

let res = '';
for await (const buf of compose(removeSpaces, toUpper).end('hello world')) {
  res += buf;
}

console.log(res); // Imprime 'HELLOWORLD'
```
`stream.compose` pode ser usado para converter iteráveis assíncronos, geradores e funções em streams.

- `AsyncIterable` converte em um `Duplex` legível. Não pode produzir `null`.
- `AsyncGeneratorFunction` converte em um `Duplex` de transformação legível/gravável. Deve receber um `AsyncIterable` de origem como primeiro parâmetro. Não pode produzir `null`.
- `AsyncFunction` converte em um `Duplex` gravável. Deve retornar `null` ou `undefined`.

```js [ESM]
import { compose } from 'node:stream';
import { finished } from 'node:stream/promises';

// Converte AsyncIterable em Duplex legível.
const s1 = compose(async function*() {
  yield 'Hello';
  yield 'World';
}());

// Converte AsyncGenerator em Duplex de transformação.
const s2 = compose(async function*(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
});

let res = '';

// Converte AsyncFunction em Duplex gravável.
const s3 = compose(async function(source) {
  for await (const chunk of source) {
    res += chunk;
  }
});

await finished(compose(s1, s2, s3));

console.log(res); // Imprime 'HELLOWORLD'
```
Veja [`readable.compose(stream)`](/pt/nodejs/api/stream#readablecomposestream-options) para `stream.compose` como operador.


### `stream.Readable.from(iterable[, options])` {#streamreadablefromiterable-options}

**Adicionado em: v12.3.0, v10.17.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Objeto implementando o protocolo iterável `Symbol.asyncIterator` ou `Symbol.iterator`. Emite um evento 'error' se um valor nulo for passado.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções fornecidas para `new stream.Readable([options])`. Por padrão, `Readable.from()` definirá `options.objectMode` como `true`, a menos que isso seja explicitamente desativado definindo `options.objectMode` como `false`.
- Retorna: [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable)

Um método utilitário para criar streams legíveis a partir de iteradores.

```js [ESM]
const { Readable } = require('node:stream');

async function * generate() {
  yield 'hello';
  yield 'streams';
}

const readable = Readable.from(generate());

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
Chamar `Readable.from(string)` ou `Readable.from(buffer)` não fará com que as strings ou buffers sejam iterados para corresponder à semântica de outros streams por motivos de desempenho.

Se um objeto `Iterable` contendo promises for passado como um argumento, isso pode resultar em rejeição não tratada.

```js [ESM]
const { Readable } = require('node:stream');

Readable.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Rejeição não tratada
]);
```
### `stream.Readable.fromWeb(readableStream[, options])` {#streamreadablefromwebreadablestream-options}

**Adicionado em: v17.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `readableStream` [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal)
  
 
- Retorna: [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable)


### `stream.Readable.isDisturbed(stream)` {#streamreadableisdisturbedstream}

**Adicionado em: v16.8.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `stream` [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable) | [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)
- Retorna: `boolean`

Retorna se o stream foi lido ou cancelado.

### `stream.isErrored(stream)` {#streamiserroredstream}

**Adicionado em: v17.3.0, v16.14.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `stream` [\<Readable\>](/pt/nodejs/api/stream#class-streamreadable) | [\<Writable\>](/pt/nodejs/api/stream#class-streamwritable) | [\<Duplex\>](/pt/nodejs/api/stream#class-streamduplex) | [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream) | [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna se o stream encontrou um erro.

### `stream.isReadable(stream)` {#streamisreadablestream}

**Adicionado em: v17.4.0, v16.14.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `stream` [\<Readable\>](/pt/nodejs/api/stream#class-streamreadable) | [\<Duplex\>](/pt/nodejs/api/stream#class-streamduplex) | [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna se o stream é legível.

### `stream.Readable.toWeb(streamReadable[, options])` {#streamreadabletowebstreamreadable-options}

**Adicionado em: v17.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `streamReadable` [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho máximo da fila interna (do `ReadableStream` criado) antes que a contrapressão seja aplicada na leitura do `stream.Readable` fornecido. Se nenhum valor for fornecido, ele será retirado do `stream.Readable` fornecido.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função que define o tamanho do chunk de dados fornecido. Se nenhum valor for fornecido, o tamanho será `1` para todos os chunks.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)





- Retorna: [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)


### `stream.Writable.fromWeb(writableStream[, options])` {#streamwritablefromwebwritablestream-options}

**Adicionado em: v17.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `writableStream` [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal)
  
 
- Retorna: [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable)

### `stream.Writable.toWeb(streamWritable)` {#streamwritabletowebstreamwritable}

**Adicionado em: v17.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `streamWritable` [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable)
- Retorna: [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream)

### `stream.Duplex.from(src)` {#streamduplexfromsrc}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.5.0, v18.17.0 | O argumento `src` agora pode ser um `ReadableStream` ou `WritableStream`. |
| v16.8.0 | Adicionado em: v16.8.0 |
:::

- `src` [\<Stream\>](/pt/nodejs/api/stream#stream) | [\<Blob\>](/pt/nodejs/api/buffer#class-blob) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream)

Um método utilitário para criar streams duplex.

- `Stream` converte stream gravável em `Duplex` gravável e stream legível em `Duplex`.
- `Blob` converte em `Duplex` legível.
- `string` converte em `Duplex` legível.
- `ArrayBuffer` converte em `Duplex` legível.
- `AsyncIterable` converte em um `Duplex` legível. Não pode produzir `null`.
- `AsyncGeneratorFunction` converte em um `Duplex` de transformação legível/gravável. Deve receber um `AsyncIterable` de origem como primeiro parâmetro. Não pode produzir `null`.
- `AsyncFunction` converte em um `Duplex` gravável. Deve retornar `null` ou `undefined`.
- `Object ({ writable, readable })` converte `readable` e `writable` em `Stream` e, em seguida, os combina em `Duplex` onde o `Duplex` escreverá em `writable` e lerá de `readable`.
- `Promise` converte em `Duplex` legível. O valor `null` é ignorado.
- `ReadableStream` converte em `Duplex` legível.
- `WritableStream` converte em `Duplex` gravável.
- Retorna: [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Se um objeto `Iterable` contendo promises for passado como um argumento, pode resultar em uma rejeição não tratada.

```js [ESM]
const { Duplex } = require('node:stream');

Duplex.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Rejeição não tratada
]);
```

### `stream.Duplex.fromWeb(pair[, options])` {#streamduplexfromwebpair-options}

**Adicionado em: v17.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `pair` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream)


- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal)


- Retorna: [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)



::: code-group
```js [ESM]
import { Duplex } from 'node:stream';
import {
  ReadableStream,
  WritableStream,
} from 'node:stream/web';

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');

for await (const chunk of duplex) {
  console.log('readable', chunk);
}
```

```js [CJS]
const { Duplex } = require('node:stream');
const {
  ReadableStream,
  WritableStream,
} = require('node:stream/web');

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');
duplex.once('readable', () => console.log('readable', duplex.read()));
```
:::


### `stream.Duplex.toWeb(streamDuplex)` {#streamduplextowebstreamduplex}

**Adicionado em: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `streamDuplex` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream)
  
 



::: code-group
```js [ESM]
import { Duplex } from 'node:stream';

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

const { value } = await readable.getReader().read();
console.log('readable', value);
```

```js [CJS]
const { Duplex } = require('node:stream');

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

readable.getReader().read().then((result) => {
  console.log('readable', result.value);
});
```
:::

### `stream.addAbortSignal(signal, stream)` {#streamaddabortsignalsignal-stream}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.7.0, v18.16.0 | Adicionado suporte para `ReadableStream` e `WritableStream`. |
| v15.4.0 | Adicionado em: v15.4.0 |
:::

- `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Um sinal representando possível cancelamento
- `stream` [\<Stream\>](/pt/nodejs/api/stream#stream) | [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream) Um stream para anexar um sinal.

Anexa um AbortSignal a um stream legível ou gravável. Isso permite que o código controle a destruição do stream usando um `AbortController`.

Chamar `abort` no `AbortController` correspondente ao `AbortSignal` passado se comportará da mesma forma que chamar `.destroy(new AbortError())` no stream e `controller.error(new AbortError())` para webstreams.

```js [ESM]
const fs = require('node:fs');

const controller = new AbortController();
const read = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
// Mais tarde, aborte a operação fechando o stream
controller.abort();
```
Ou usando um `AbortSignal` com um stream legível como um iterável assíncrono:

```js [ESM]
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000); // define um tempo limite
const stream = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
(async () => {
  try {
    for await (const chunk of stream) {
      await process(chunk);
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      // A operação foi cancelada
    } else {
      throw e;
    }
  }
})();
```
Ou usando um `AbortSignal` com um ReadableStream:

```js [ESM]
const controller = new AbortController();
const rs = new ReadableStream({
  start(controller) {
    controller.enqueue('hello');
    controller.enqueue('world');
    controller.close();
  },
});

addAbortSignal(controller.signal, rs);

finished(rs, (err) => {
  if (err) {
    if (err.name === 'AbortError') {
      // A operação foi cancelada
    }
  }
});

const reader = rs.getReader();

reader.read().then(({ value, done }) => {
  console.log(value); // hello
  console.log(done); // false
  controller.abort();
});
```

### `stream.getDefaultHighWaterMark(objectMode)` {#streamgetdefaulthighwatermarkobjectmode}

**Adicionado em: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna o highWaterMark padrão usado pelos streams. O padrão é `65536` (64 KiB) ou `16` para `objectMode`.

### `stream.setDefaultHighWaterMark(objectMode, value)` {#streamsetdefaulthighwatermarkobjectmode-value}

**Adicionado em: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) valor highWaterMark

Define o highWaterMark padrão usado pelos streams.

## API para implementadores de stream {#api-for-stream-implementers}

A API do módulo `node:stream` foi projetada para tornar possível implementar streams facilmente usando o modelo de herança prototípica do JavaScript.

Primeiro, um desenvolvedor de stream declararia uma nova classe JavaScript que estende uma das quatro classes de stream básicas (`stream.Writable`, `stream.Readable`, `stream.Duplex` ou `stream.Transform`), certificando-se de chamar o construtor da classe pai apropriada:

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor({ highWaterMark, ...options }) {
    super({ highWaterMark });
    // ...
  }
}
```
Ao estender streams, tenha em mente quais opções o usuário pode e deve fornecer antes de encaminhá-las para o construtor base. Por exemplo, se a implementação fizer suposições em relação às opções `autoDestroy` e `emitClose`, não permita que o usuário as substitua. Seja explícito sobre quais opções são encaminhadas em vez de encaminhar implicitamente todas as opções.

A nova classe de stream deve então implementar um ou mais métodos específicos, dependendo do tipo de stream que está sendo criado, conforme detalhado no gráfico abaixo:

| Caso de uso | Classe | Método(s) a implementar |
| --- | --- | --- |
| Somente leitura | [`Readable`](/pt/nodejs/api/stream#class-streamreadable) | [`_read()`](/pt/nodejs/api/stream#readable_readsize) |
| Somente gravação | [`Writable`](/pt/nodejs/api/stream#class-streamwritable) | [`_write()`](/pt/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/pt/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/pt/nodejs/api/stream#writable_finalcallback) |
| Leitura e gravação | [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) | [`_read()`](/pt/nodejs/api/stream#readable_readsize)  ,   [`_write()`](/pt/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/pt/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/pt/nodejs/api/stream#writable_finalcallback) |
| Operar em dados gravados e, em seguida, ler o resultado | [`Transform`](/pt/nodejs/api/stream#class-streamtransform) | [`_transform()`](/pt/nodejs/api/stream#transform_transformchunk-encoding-callback)  ,   [`_flush()`](/pt/nodejs/api/stream#transform_flushcallback)  ,   [`_final()`](/pt/nodejs/api/stream#writable_finalcallback) |
O código de implementação para um stream *nunca* deve chamar os métodos "públicos" de um stream que se destinam ao uso por consumidores (conforme descrito na seção [API para consumidores de stream](/pt/nodejs/api/stream#api-for-stream-consumers)). Fazer isso pode levar a efeitos colaterais adversos no código do aplicativo que consome o stream.

Evite substituir métodos públicos como `write()`, `end()`, `cork()`, `uncork()`, `read()` e `destroy()` ou emitir eventos internos como `'error'`, `'data'`, `'end'`, `'finish'` e `'close'` por meio de `.emit()`. Fazer isso pode quebrar invariantes de stream atuais e futuras, levando a problemas de comportamento e/ou compatibilidade com outros streams, utilitários de stream e expectativas do usuário.


### Construção Simplificada {#simplified-construction}

**Adicionado em: v1.2.0**

Para muitos casos simples, é possível criar um stream sem depender de herança. Isso pode ser feito criando diretamente instâncias dos objetos `stream.Writable`, `stream.Readable`, `stream.Duplex` ou `stream.Transform` e passando os métodos apropriados como opções do construtor.

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  construct(callback) {
    // Inicializa o estado e carrega recursos...
  },
  write(chunk, encoding, callback) {
    // ...
  },
  destroy() {
    // Libera recursos...
  },
});
```
### Implementando um stream gravável {#implementing-a-writable-stream}

A classe `stream.Writable` é estendida para implementar um stream [`Writable`](/pt/nodejs/api/stream#class-streamwritable).

Streams `Writable` personalizados *devem* chamar o construtor `new stream.Writable([options])` e implementar o método `writable._write()` e/ou `writable._writev()`.

#### `new stream.Writable([options])` {#new-streamwritableoptions}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.0.0 | Aumenta o highWaterMark padrão. |
| v15.5.0 | Suporta a passagem de um AbortSignal. |
| v14.0.0 | Altera a opção `autoDestroy` para `true` por padrão. |
| v11.2.0, v10.16.0 | Adiciona a opção `autoDestroy` para automaticamente `destroy()` o stream quando ele emite `'finish'` ou erros. |
| v10.0.0 | Adiciona a opção `emitClose` para especificar se `'close'` é emitido no destroy. |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nível do buffer quando [`stream.write()`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback) começa a retornar `false`. **Padrão:** `65536` (64 KiB), ou `16` para streams `objectMode`.
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se as `string`s passadas para [`stream.write()`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback) devem ser codificadas em `Buffer`s (com a codificação especificada na chamada de [`stream.write()`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback)) antes de passá-las para [`stream._write()`](/pt/nodejs/api/stream#writable_writechunk-encoding-callback). Outros tipos de dados não são convertidos (ou seja, `Buffer`s não são decodificados em `string`s). Definir como false impedirá que as `string`s sejam convertidas. **Padrão:** `true`.
    - `defaultEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação padrão que é usada quando nenhuma codificação é especificada como um argumento para [`stream.write()`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback). **Padrão:** `'utf8'`.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se [`stream.write(anyObj)`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback) é ou não uma operação válida. Quando definido, torna-se possível gravar valores JavaScript diferentes de string, [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ou [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) se suportado pela implementação do stream. **Padrão:** `false`.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se o stream deve ou não emitir `'close'` depois de ter sido destruído. **Padrão:** `true`.
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementação para o método [`stream._write()`](/pt/nodejs/api/stream#writable_writechunk-encoding-callback).
    - `writev` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementação para o método [`stream._writev()`](/pt/nodejs/api/stream#writable_writevchunks-callback).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementação para o método [`stream._destroy()`](/pt/nodejs/api/stream#writable_destroyerr-callback).
    - `final` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementação para o método [`stream._final()`](/pt/nodejs/api/stream#writable_finalcallback).
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementação para o método [`stream._construct()`](/pt/nodejs/api/stream#writable_constructcallback).
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se este stream deve automaticamente chamar `.destroy()` em si mesmo após terminar. **Padrão:** `true`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Um sinal representando um possível cancelamento.

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor(options) {
    // Chama o construtor stream.Writable().
    super(options);
    // ...
  }
}
```
Ou, ao usar construtores de estilo pre-ES6:

```js [ESM]
const { Writable } = require('node:stream');
const util = require('node:util');

function MyWritable(options) {
  if (!(this instanceof MyWritable))
    return new MyWritable(options);
  Writable.call(this, options);
}
util.inherits(MyWritable, Writable);
```
Ou, usando a abordagem de construtor simplificado:

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
});
```
Chamar `abort` no `AbortController` correspondente ao `AbortSignal` passado se comportará da mesma forma que chamar `.destroy(new AbortError())` no stream gravável.

```js [ESM]
const { Writable } = require('node:stream');

const controller = new AbortController();
const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
  signal: controller.signal,
});
// Mais tarde, aborta a operação fechando o stream
controller.abort();
```

#### `writable._construct(callback)` {#writable_constructcallback}

**Adicionado em: v15.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chame esta função (opcionalmente com um argumento de erro) quando o stream terminar de inicializar.

O método `_construct()` NÃO DEVE ser chamado diretamente. Ele pode ser implementado por classes filhas e, se for, será chamado apenas pelos métodos internos da classe `Writable`.

Esta função opcional será chamada em um tick após o retorno do construtor do stream, atrasando quaisquer chamadas `_write()`, `_final()` e `_destroy()` até que `callback` seja chamado. Isso é útil para inicializar o estado ou inicializar recursos de forma assíncrona antes que o stream possa ser usado.

```js [ESM]
const { Writable } = require('node:stream');
const fs = require('node:fs');

class WriteStream extends Writable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, 'w', (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _write(chunk, encoding, callback) {
    fs.write(this.fd, chunk, callback);
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `writable._write(chunk, encoding, callback)` {#writable_writechunk-encoding-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.11.0 | _write() é opcional ao fornecer _writev(). |
:::

- `chunk` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O `Buffer` a ser escrito, convertido da `string` passada para [`stream.write()`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback). Se a opção `decodeStrings` do stream for `false` ou o stream estiver operando no modo de objeto, o chunk não será convertido e será o que foi passado para [`stream.write()`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se o chunk for uma string, então `encoding` é a codificação de caractere dessa string. Se chunk for um `Buffer`, ou se o stream estiver operando no modo de objeto, `encoding` pode ser ignorado.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chame esta função (opcionalmente com um argumento de erro) quando o processamento estiver concluído para o chunk fornecido.

Todas as implementações de stream `Writable` devem fornecer um método [`writable._write()`](/pt/nodejs/api/stream#writable_writechunk-encoding-callback) e/ou [`writable._writev()`](/pt/nodejs/api/stream#writable_writevchunks-callback) para enviar dados para o recurso subjacente.

Streams [`Transform`](/pt/nodejs/api/stream#class-streamtransform) fornecem sua própria implementação de [`writable._write()`](/pt/nodejs/api/stream#writable_writechunk-encoding-callback).

Esta função NÃO DEVE ser chamada diretamente pelo código do aplicativo. Ele deve ser implementado por classes filhas e chamado apenas pelos métodos internos da classe `Writable`.

A função `callback` deve ser chamada de forma síncrona dentro de `writable._write()` ou assincronamente (ou seja, tick diferente) para sinalizar se a gravação foi concluída com sucesso ou falhou com um erro. O primeiro argumento passado para o `callback` deve ser o objeto `Error` se a chamada falhou ou `null` se a gravação foi bem-sucedida.

Todas as chamadas para `writable.write()` que ocorrem entre o momento em que `writable._write()` é chamado e o `callback` é chamado farão com que os dados gravados sejam armazenados em buffer. Quando o `callback` é invocado, o stream pode emitir um evento [`'drain'`](/pt/nodejs/api/stream#event-drain). Se uma implementação de stream for capaz de processar vários chunks de dados ao mesmo tempo, o método `writable._writev()` deve ser implementado.

Se a propriedade `decodeStrings` for explicitamente definida como `false` nas opções do construtor, então `chunk` permanecerá o mesmo objeto que é passado para `.write()`, e pode ser uma string em vez de um `Buffer`. Isso é para suportar implementações que possuem um tratamento otimizado para certas codificações de dados de string. Nesse caso, o argumento `encoding` indicará a codificação de caractere da string. Caso contrário, o argumento `encoding` pode ser ignorado com segurança.

O método `writable._write()` é prefixado com um sublinhado porque é interno à classe que o define e nunca deve ser chamado diretamente por programas de usuário.


#### `writable._writev(chunks, callback)` {#writable_writevchunks-callback}

- `chunks` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Os dados a serem gravados. O valor é um array de [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que representam cada um um fragmento discreto de dados a ser gravado. As propriedades desses objetos são:
    - `chunk` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma instância de buffer ou string contendo os dados a serem gravados. O `chunk` será uma string se o `Writable` foi criado com a opção `decodeStrings` definida como `false` e uma string foi passada para `write()`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação de caracteres do `chunk`. Se `chunk` for um `Buffer`, a `encoding` será `'buffer'`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função de callback (opcionalmente com um argumento de erro) a ser invocada quando o processamento estiver concluído para os fragmentos fornecidos.

Esta função NÃO DEVE ser chamada diretamente pelo código do aplicativo. Ela deve ser implementada por classes filhas e chamada apenas pelos métodos internos da classe `Writable`.

O método `writable._writev()` pode ser implementado em adição ou alternativamente ao `writable._write()` em implementações de stream que são capazes de processar vários fragmentos de dados ao mesmo tempo. Se implementado e se houver dados armazenados em buffer de gravações anteriores, `_writev()` será chamado em vez de `_write()`.

O método `writable._writev()` é prefixado com um sublinhado porque é interno à classe que o define e nunca deve ser chamado diretamente por programas de usuário.

#### `writable._destroy(err, callback)` {#writable_destroyerr-callback}

**Adicionado em: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Um possível erro.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função de callback que recebe um argumento de erro opcional.

O método `_destroy()` é chamado por [`writable.destroy()`](/pt/nodejs/api/stream#writabledestroyerror). Ele pode ser substituído por classes filhas, mas **não deve** ser chamado diretamente.


#### `writable._final(callback)` {#writable_finalcallback}

**Adicionado em: v8.0.0**

- `callback` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chame esta função (opcionalmente com um argumento de erro) ao terminar de escrever quaisquer dados restantes.

O método `_final()` **não deve** ser chamado diretamente. Ele pode ser implementado por classes filhas e, se for, será chamado apenas pelos métodos internos da classe `Writable`.

Essa função opcional será chamada antes do fechamento do stream, atrasando o evento `'finish'` até que `callback` seja chamado. Isso é útil para fechar recursos ou gravar dados em buffer antes que um stream termine.

#### Erros durante a escrita {#errors-while-writing}

Os erros que ocorrerem durante o processamento dos métodos [`writable._write()`](/pt/nodejs/api/stream#writable_writechunk-encoding-callback), [`writable._writev()`](/pt/nodejs/api/stream#writable_writevchunks-callback) e [`writable._final()`](/pt/nodejs/api/stream#writable_finalcallback) devem ser propagados invocando o callback e passando o erro como o primeiro argumento. Lançar um `Error` de dentro desses métodos ou emitir manualmente um evento `'error'` resulta em comportamento indefinido.

Se um stream `Readable` canaliza para um stream `Writable` quando `Writable` emite um erro, o stream `Readable` será descanalizado.

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  },
});
```
#### Um exemplo de stream gravável {#an-example-writable-stream}

O exemplo a seguir ilustra uma implementação de stream `Writable` personalizada bastante simplista (e um tanto inútil). Embora esta instância específica de stream `Writable` não seja de nenhuma utilidade particular real, o exemplo ilustra cada um dos elementos necessários de uma instância de stream [`Writable`](/pt/nodejs/api/stream#class-streamwritable) personalizada:

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  }
}
```

#### Decodificando buffers em um stream gravável {#decoding-buffers-in-a-writable-stream}

Decodificar buffers é uma tarefa comum, por exemplo, ao usar transformadores cuja entrada é uma string. Este não é um processo trivial ao usar codificação de caracteres multi-byte, como UTF-8. O exemplo a seguir mostra como decodificar strings multi-byte usando `StringDecoder` e [`Writable`](/pt/nodejs/api/stream#class-streamwritable).

```js [ESM]
const { Writable } = require('node:stream');
const { StringDecoder } = require('node:string_decoder');

class StringWritable extends Writable {
  constructor(options) {
    super(options);
    this._decoder = new StringDecoder(options?.defaultEncoding);
    this.data = '';
  }
  _write(chunk, encoding, callback) {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }
    this.data += chunk;
    callback();
  }
  _final(callback) {
    this.data += this._decoder.end();
    callback();
  }
}

const euro = [[0xE2, 0x82], [0xAC]].map(Buffer.from);
const w = new StringWritable();

w.write('currency: ');
w.write(euro[0]);
w.end(euro[1]);

console.log(w.data); // currency: €
```
### Implementando um stream legível {#implementing-a-readable-stream}

A classe `stream.Readable` é estendida para implementar um stream [`Readable`](/pt/nodejs/api/stream#class-streamreadable).

Streams `Readable` personalizados *devem* chamar o construtor `new stream.Readable([options])` e implementar o método [`readable._read()`](/pt/nodejs/api/stream#readable_readsize).

#### `new stream.Readable([options])` {#new-streamreadableoptions}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.0.0 | aumenta o highWaterMark padrão. |
| v15.5.0 | suporta passar um AbortSignal. |
| v14.0.0 | Altera o padrão da opção `autoDestroy` para `true`. |
| v11.2.0, v10.16.0 | Adiciona a opção `autoDestroy` para automaticamente `destroy()` o stream quando ele emite `'end'` ou erros. |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O [número de bytes](/pt/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding) máximo a ser armazenado no buffer interno antes de parar de ler do recurso subjacente. **Padrão:** `65536` (64 KiB), ou `16` para streams `objectMode`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se especificado, os buffers serão decodificados para strings usando a codificação especificada. **Padrão:** `null`.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se este stream deve se comportar como um stream de objetos. Significa que [`stream.read(n)`](/pt/nodejs/api/stream#readablereadsize) retorna um único valor em vez de um `Buffer` de tamanho `n`. **Padrão:** `false`.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se o stream deve ou não emitir `'close'` depois que for destruído. **Padrão:** `true`.
    - `read` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementação para o método [`stream._read()`](/pt/nodejs/api/stream#readable_readsize).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementação para o método [`stream._destroy()`](/pt/nodejs/api/stream#readable_destroyerr-callback).
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementação para o método [`stream._construct()`](/pt/nodejs/api/stream#readable_constructcallback).
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se este stream deve chamar automaticamente `.destroy()` em si mesmo após terminar. **Padrão:** `true`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Um sinal representando possível cancelamento.
  
 

```js [ESM]
const { Readable } = require('node:stream');

class MyReadable extends Readable {
  constructor(options) {
    // Chama o construtor stream.Readable(options).
    super(options);
    // ...
  }
}
```
Ou, ao usar construtores de estilo pré-ES6:

```js [ESM]
const { Readable } = require('node:stream');
const util = require('node:util');

function MyReadable(options) {
  if (!(this instanceof MyReadable))
    return new MyReadable(options);
  Readable.call(this, options);
}
util.inherits(MyReadable, Readable);
```
Ou, usando a abordagem de construtor simplificada:

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    // ...
  },
});
```
Chamar `abort` no `AbortController` correspondente ao `AbortSignal` passado se comportará da mesma forma que chamar `.destroy(new AbortError())` no legível criado.

```js [ESM]
const { Readable } = require('node:stream');
const controller = new AbortController();
const read = new Readable({
  read(size) {
    // ...
  },
  signal: controller.signal,
});
// Mais tarde, abortar a operação fechando o stream
controller.abort();
```

#### `readable._construct(callback)` {#readable_constructcallback}

**Adicionado em: v15.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chama esta função (opcionalmente com um argumento de erro) quando o stream terminar de inicializar.

O método `_construct()` NÃO DEVE ser chamado diretamente. Ele pode ser implementado por classes filhas e, se for, será chamado apenas pelos métodos internos da classe `Readable`.

Esta função opcional será agendada no próximo tick pelo construtor do stream, atrasando quaisquer chamadas `_read()` e `_destroy()` até que `callback` seja chamado. Isso é útil para inicializar o estado ou inicializar recursos de forma assíncrona antes que o stream possa ser usado.

```js [ESM]
const { Readable } = require('node:stream');
const fs = require('node:fs');

class ReadStream extends Readable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _read(n) {
    const buf = Buffer.alloc(n);
    fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `readable._read(size)` {#readable_readsize}

**Adicionado em: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a serem lidos de forma assíncrona

Esta função NÃO DEVE ser chamada diretamente pelo código do aplicativo. Deve ser implementada por classes filhas e chamada apenas pelos métodos internos da classe `Readable`.

Todas as implementações de stream `Readable` devem fornecer uma implementação do método [`readable._read()`](/pt/nodejs/api/stream#readable_readsize) para buscar dados do recurso subjacente.

Quando [`readable._read()`](/pt/nodejs/api/stream#readable_readsize) é chamado, se os dados estiverem disponíveis no recurso, a implementação deve começar a enviar esses dados para a fila de leitura usando o método [`this.push(dataChunk)`](/pt/nodejs/api/stream#readablepushchunk-encoding). `_read()` será chamado novamente após cada chamada para [`this.push(dataChunk)`](/pt/nodejs/api/stream#readablepushchunk-encoding) assim que o stream estiver pronto para aceitar mais dados. `_read()` pode continuar lendo do recurso e enviando dados até que `readable.push()` retorne `false`. Somente quando `_read()` é chamado novamente depois de parar, ele deve retomar o envio de dados adicionais para a fila.

Depois que o método [`readable._read()`](/pt/nodejs/api/stream#readable_readsize) for chamado, ele não será chamado novamente até que mais dados sejam enviados através do método [`readable.push()`](/pt/nodejs/api/stream#readablepushchunk-encoding). Dados vazios, como buffers e strings vazias, não farão com que [`readable._read()`](/pt/nodejs/api/stream#readable_readsize) seja chamado.

O argumento `size` é consultivo. Para implementações em que uma "leitura" é uma única operação que retorna dados, pode usar o argumento `size` para determinar quantos dados buscar. Outras implementações podem ignorar este argumento e simplesmente fornecer dados sempre que estiverem disponíveis. Não há necessidade de "esperar" até que `size` bytes estejam disponíveis antes de chamar [`stream.push(chunk)`](/pt/nodejs/api/stream#readablepushchunk-encoding).

O método [`readable._read()`](/pt/nodejs/api/stream#readable_readsize) é prefixado com um sublinhado porque é interno à classe que o define e nunca deve ser chamado diretamente por programas de usuário.


#### `readable._destroy(err, callback)` {#readable_destroyerr-callback}

**Adicionado em: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Um possível erro.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função de callback que recebe um argumento de erro opcional.

O método `_destroy()` é chamado por [`readable.destroy()`](/pt/nodejs/api/stream#readabledestroyerror). Ele pode ser substituído por classes filhas, mas **não deve** ser chamado diretamente.

#### `readable.push(chunk[, encoding])` {#readablepushchunk-encoding}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.0.0, v20.13.0 | O argumento `chunk` agora pode ser uma instância de `TypedArray` ou `DataView`. |
| v8.0.0 | O argumento `chunk` agora pode ser uma instância de `Uint8Array`. |
:::

- `chunk` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Chunk de dados para enviar para a fila de leitura. Para streams que não operam no modo de objeto, `chunk` deve ser [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ou [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Para streams no modo de objeto, `chunk` pode ser qualquer valor JavaScript.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codificação de chunks de string. Deve ser uma codificação `Buffer` válida, como `'utf8'` ou `'ascii'`.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se chunks de dados adicionais podem continuar a ser enviados; `false` caso contrário.

Quando `chunk` é um [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) ou [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), o `chunk` de dados será adicionado à fila interna para os usuários do stream consumirem. Passar `chunk` como `null` sinaliza o fim do stream (EOF), após o qual nenhum dado adicional pode ser escrito.

Quando o `Readable` está operando no modo pausado, os dados adicionados com `readable.push()` podem ser lidos chamando o método [`readable.read()`](/pt/nodejs/api/stream#readablereadsize) quando o evento [`'readable'`](/pt/nodejs/api/stream#event-readable) é emitido.

Quando o `Readable` está operando no modo de fluxo, os dados adicionados com `readable.push()` serão entregues emitindo um evento `'data'`.

O método `readable.push()` foi projetado para ser o mais flexível possível. Por exemplo, ao encapsular uma fonte de nível inferior que fornece alguma forma de mecanismo de pausa/retomada e um callback de dados, a fonte de baixo nível pode ser encapsulada pela instância `Readable` personalizada:

```js [ESM]
// `_source` é um objeto com métodos readStop() e readStart(),
// e um membro `ondata` que é chamado quando tem dados, e
// um membro `onend` que é chamado quando os dados acabam.

class SourceWrapper extends Readable {
  constructor(options) {
    super(options);

    this._source = getLowLevelSourceObject();

    // Toda vez que houver dados, envie-os para o buffer interno.
    this._source.ondata = (chunk) => {
      // Se push() retornar false, pare de ler da fonte.
      if (!this.push(chunk))
        this._source.readStop();
    };

    // Quando a fonte termina, envie o chunk `null` que sinaliza EOF.
    this._source.onend = () => {
      this.push(null);
    };
  }
  // _read() será chamado quando o stream quiser puxar mais dados.
  // O argumento de tamanho consultivo é ignorado neste caso.
  _read(size) {
    this._source.readStart();
  }
}
```
O método `readable.push()` é usado para enviar o conteúdo para o buffer interno. Ele pode ser acionado pelo método [`readable._read()`](/pt/nodejs/api/stream#readable_readsize).

Para streams que não operam no modo de objeto, se o parâmetro `chunk` de `readable.push()` for `undefined`, ele será tratado como string ou buffer vazio. Veja [`readable.push('')`](/pt/nodejs/api/stream#readablepush) para mais informações.


#### Erros durante a leitura {#errors-while-reading}

Erros que ocorrem durante o processamento de [`readable._read()`](/pt/nodejs/api/stream#readable_readsize) devem ser propagados através do método [`readable.destroy(err)`](/pt/nodejs/api/stream#readable_destroyerr-callback). Lançar um `Error` de dentro de [`readable._read()`](/pt/nodejs/api/stream#readable_readsize) ou emitir manualmente um evento `'error'` resulta em comportamento indefinido.

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    const err = checkSomeErrorCondition();
    if (err) {
      this.destroy(err);
    } else {
      // Do some work.
    }
  },
});
```
#### Um exemplo de stream de contagem {#an-example-counting-stream}

O seguinte é um exemplo básico de um stream `Readable` que emite os numerais de 1 a 1.000.000 em ordem crescente e, em seguida, termina.

```js [ESM]
const { Readable } = require('node:stream');

class Counter extends Readable {
  constructor(opt) {
    super(opt);
    this._max = 1000000;
    this._index = 1;
  }

  _read() {
    const i = this._index++;
    if (i > this._max)
      this.push(null);
    else {
      const str = String(i);
      const buf = Buffer.from(str, 'ascii');
      this.push(buf);
    }
  }
}
```
### Implementando um stream duplex {#implementing-a-duplex-stream}

Um stream [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) é aquele que implementa tanto [`Readable`](/pt/nodejs/api/stream#class-streamreadable) quanto [`Writable`](/pt/nodejs/api/stream#class-streamwritable), como uma conexão de socket TCP.

Como o JavaScript não tem suporte para herança múltipla, a classe `stream.Duplex` é estendida para implementar um stream [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) (em vez de estender as classes `stream.Readable` *e* `stream.Writable`).

A classe `stream.Duplex` herda prototipicamente de `stream.Readable` e parasiticamente de `stream.Writable`, mas `instanceof` funcionará corretamente para ambas as classes base devido à substituição de [`Symbol.hasInstance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance) em `stream.Writable`.

Streams `Duplex` personalizados *devem* chamar o construtor `new stream.Duplex([options])` e implementar *tanto* os métodos [`readable._read()`](/pt/nodejs/api/stream#readable_readsize) quanto `writable._write()`.


#### `new stream.Duplex(options)` {#new-streamduplexoptions}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.4.0 | As opções `readableHighWaterMark` e `writableHighWaterMark` agora são suportadas. |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Passado para os construtores `Writable` e `Readable`. Também possui os seguintes campos:
    - `allowHalfOpen` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `false`, o stream encerrará automaticamente o lado gravável quando o lado legível terminar. **Padrão:** `true`.
    - `readable` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Define se o `Duplex` deve ser legível. **Padrão:** `true`.
    - `writable` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Define se o `Duplex` deve ser gravável. **Padrão:** `true`.
    - `readableObjectMode` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Define `objectMode` para o lado legível do stream. Não tem efeito se `objectMode` for `true`. **Padrão:** `false`.
    - `writableObjectMode` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Define `objectMode` para o lado gravável do stream. Não tem efeito se `objectMode` for `true`. **Padrão:** `false`.
    - `readableHighWaterMark` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define `highWaterMark` para o lado legível do stream. Não tem efeito se `highWaterMark` for fornecido.
    - `writableHighWaterMark` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define `highWaterMark` para o lado gravável do stream. Não tem efeito se `highWaterMark` for fornecido.



```js [ESM]
const { Duplex } = require('node:stream');

class MyDuplex extends Duplex {
  constructor(options) {
    super(options);
    // ...
  }
}
```
Ou, ao usar construtores de estilo pré-ES6:

```js [ESM]
const { Duplex } = require('node:stream');
const util = require('node:util');

function MyDuplex(options) {
  if (!(this instanceof MyDuplex))
    return new MyDuplex(options);
  Duplex.call(this, options);
}
util.inherits(MyDuplex, Duplex);
```
Ou, usando a abordagem de construtor simplificada:

```js [ESM]
const { Duplex } = require('node:stream');

const myDuplex = new Duplex({
  read(size) {
    // ...
  },
  write(chunk, encoding, callback) {
    // ...
  },
});
```
Ao usar pipeline:

```js [ESM]
const { Transform, pipeline } = require('node:stream');
const fs = require('node:fs');

pipeline(
  fs.createReadStream('object.json')
    .setEncoding('utf8'),
  new Transform({
    decodeStrings: false, // Accept string input rather than Buffers
    construct(callback) {
      this.data = '';
      callback();
    },
    transform(chunk, encoding, callback) {
      this.data += chunk;
      callback();
    },
    flush(callback) {
      try {
        // Make sure is valid json.
        JSON.parse(this.data);
        this.push(this.data);
        callback();
      } catch (err) {
        callback(err);
      }
    },
  }),
  fs.createWriteStream('valid-object.json'),
  (err) => {
    if (err) {
      console.error('failed', err);
    } else {
      console.log('completed');
    }
  },
);
```

#### Um exemplo de stream duplex {#an-example-duplex-stream}

O seguinte ilustra um exemplo simples de um stream `Duplex` que envolve um objeto de origem de nível inferior hipotético para o qual os dados podem ser escritos e do qual os dados podem ser lidos, embora usando uma API que não é compatível com os streams do Node.js. O seguinte ilustra um exemplo simples de um stream `Duplex` que armazena em buffer os dados gravados recebidos através da interface [`Writable`](/pt/nodejs/api/stream#class-streamwritable) que é lida de volta através da interface [`Readable`](/pt/nodejs/api/stream#class-streamreadable).

```js [ESM]
const { Duplex } = require('node:stream');
const kSource = Symbol('source');

class MyDuplex extends Duplex {
  constructor(source, options) {
    super(options);
    this[kSource] = source;
  }

  _write(chunk, encoding, callback) {
    // A fonte subjacente lida apenas com strings.
    if (Buffer.isBuffer(chunk))
      chunk = chunk.toString();
    this[kSource].writeSomeData(chunk);
    callback();
  }

  _read(size) {
    this[kSource].fetchSomeData(size, (data, encoding) => {
      this.push(Buffer.from(data, encoding));
    });
  }
}
```
O aspeto mais importante de um stream `Duplex` é que os lados `Readable` e `Writable` operam independentemente um do outro, apesar de coexistirem dentro de uma única instância de objeto.

#### Streams duplex no modo de objeto {#object-mode-duplex-streams}

Para streams `Duplex`, `objectMode` pode ser definido exclusivamente para o lado `Readable` ou `Writable` usando as opções `readableObjectMode` e `writableObjectMode`, respetivamente.

No exemplo a seguir, por exemplo, um novo stream `Transform` (que é um tipo de stream [`Duplex`](/pt/nodejs/api/stream#class-streamduplex)) é criado que tem um lado `Writable` no modo de objeto que aceita números JavaScript que são convertidos em strings hexadecimais no lado `Readable`.

```js [ESM]
const { Transform } = require('node:stream');

// Todos os streams Transform também são Streams Duplex.
const myTransform = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    // Coage o chunk para um número, se necessário.
    chunk |= 0;

    // Transforma o chunk em algo mais.
    const data = chunk.toString(16);

    // Empurra os dados para a fila legível.
    callback(null, '0'.repeat(data.length % 2) + data);
  },
});

myTransform.setEncoding('ascii');
myTransform.on('data', (chunk) => console.log(chunk));

myTransform.write(1);
// Imprime: 01
myTransform.write(10);
// Imprime: 0a
myTransform.write(100);
// Imprime: 64
```

### Implementando um fluxo de transformação {#implementing-a-transform-stream}

Um fluxo [`Transform`](/pt/nodejs/api/stream#class-streamtransform) é um fluxo [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) onde a saída é computada de alguma forma a partir da entrada. Exemplos incluem fluxos [zlib](/pt/nodejs/api/zlib) ou fluxos [crypto](/pt/nodejs/api/crypto) que comprimem, criptografam ou descriptografam dados.

Não há exigência de que a saída tenha o mesmo tamanho da entrada, o mesmo número de partes ou chegue ao mesmo tempo. Por exemplo, um fluxo `Hash` terá apenas uma única parte de saída que é fornecida quando a entrada é finalizada. Um fluxo `zlib` produzirá uma saída que é muito menor ou muito maior que sua entrada.

A classe `stream.Transform` é estendida para implementar um fluxo [`Transform`](/pt/nodejs/api/stream#class-streamtransform).

A classe `stream.Transform` herda prototipicamente de `stream.Duplex` e implementa suas próprias versões dos métodos `writable._write()` e [`readable._read()`](/pt/nodejs/api/stream#readable_readsize). Implementações `Transform` personalizadas *devem* implementar o método [`transform._transform()`](/pt/nodejs/api/stream#transform_transformchunk-encoding-callback) e *podem* também implementar o método [`transform._flush()`](/pt/nodejs/api/stream#transform_flushcallback).

Deve-se ter cuidado ao usar fluxos `Transform`, pois os dados gravados no fluxo podem fazer com que o lado `Writable` do fluxo seja pausado se a saída no lado `Readable` não for consumida.

#### `new stream.Transform([options])` {#new-streamtransformoptions}

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Passado para os construtores `Writable` e `Readable`. Também possui os seguintes campos:
    - `transform` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementação para o método [`stream._transform()`](/pt/nodejs/api/stream#transform_transformchunk-encoding-callback).
    - `flush` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementação para o método [`stream._flush()`](/pt/nodejs/api/stream#transform_flushcallback).
  
 

```js [ESM]
const { Transform } = require('node:stream');

class MyTransform extends Transform {
  constructor(options) {
    super(options);
    // ...
  }
}
```
Ou, ao usar construtores de estilo pré-ES6:

```js [ESM]
const { Transform } = require('node:stream');
const util = require('node:util');

function MyTransform(options) {
  if (!(this instanceof MyTransform))
    return new MyTransform(options);
  Transform.call(this, options);
}
util.inherits(MyTransform, Transform);
```
Ou, usando a abordagem de construtor simplificada:

```js [ESM]
const { Transform } = require('node:stream');

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // ...
  },
});
```

#### Evento: `'end'` {#event-end_1}

O evento [`'end'`](/pt/nodejs/api/stream#event-end) é da classe `stream.Readable`. O evento `'end'` é emitido depois que todos os dados foram enviados, o que ocorre após o retorno de chamada em [`transform._flush()`](/pt/nodejs/api/stream#transform_flushcallback) ter sido chamado. Em caso de erro, `'end'` não deve ser emitido.

#### Evento: `'finish'` {#event-finish_1}

O evento [`'finish'`](/pt/nodejs/api/stream#event-finish) é da classe `stream.Writable`. O evento `'finish'` é emitido depois que [`stream.end()`](/pt/nodejs/api/stream#writableendchunk-encoding-callback) é chamado e todos os chunks foram processados por [`stream._transform()`](/pt/nodejs/api/stream#transform_transformchunk-encoding-callback). Em caso de erro, `'finish'` não deve ser emitido.

#### `transform._flush(callback)` {#transform_flushcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função de retorno de chamada (opcionalmente com um argumento de erro e dados) a ser chamada quando os dados restantes forem descarregados.

Esta função NÃO DEVE ser chamada diretamente pelo código do aplicativo. Ela deve ser implementada por classes filhas e chamada apenas pelos métodos internos da classe `Readable`.

Em alguns casos, uma operação de transformação pode precisar emitir um bit adicional de dados no final do fluxo. Por exemplo, um fluxo de compressão `zlib` armazenará uma quantidade de estado interno usado para comprimir otimamente a saída. Quando o fluxo termina, no entanto, esses dados adicionais precisam ser descarregados para que os dados comprimidos fiquem completos.

Implementações personalizadas de [`Transform`](/pt/nodejs/api/stream#class-streamtransform) *podem* implementar o método `transform._flush()`. Isso será chamado quando não houver mais dados gravados para serem consumidos, mas antes que o evento [`'end'`](/pt/nodejs/api/stream#event-end) seja emitido sinalizando o fim do fluxo [`Readable`](/pt/nodejs/api/stream#class-streamreadable).

Dentro da implementação `transform._flush()`, o método `transform.push()` pode ser chamado zero ou mais vezes, conforme apropriado. A função `callback` deve ser chamada quando a operação de descarga estiver concluída.

O método `transform._flush()` é prefixado com um sublinhado porque é interno à classe que o define e nunca deve ser chamado diretamente por programas de usuário.


#### `transform._transform(chunk, encoding, callback)` {#transform_transformchunk-encoding-callback}

- `chunk` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O `Buffer` a ser transformado, convertido da `string` passada para [`stream.write()`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback). Se a opção `decodeStrings` do stream for `false` ou o stream estiver operando no modo de objeto, o chunk não será convertido e será o que foi passado para [`stream.write()`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se o chunk for uma string, então este é o tipo de codificação. Se o chunk for um buffer, então este é o valor especial `'buffer'`. Ignore-o nesse caso.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função de callback (opcionalmente com um argumento de erro e dados) a ser chamada após o `chunk` fornecido ter sido processado.

Esta função NÃO DEVE ser chamada diretamente pelo código do aplicativo. Deve ser implementada por classes filhas e chamada apenas pelos métodos internos da classe `Readable`.

Todas as implementações de stream `Transform` devem fornecer um método `_transform()` para aceitar entrada e produzir saída. A implementação `transform._transform()` lida com os bytes que estão sendo gravados, calcula uma saída e, em seguida, passa essa saída para a parte legível usando o método `transform.push()`.

O método `transform.push()` pode ser chamado zero ou mais vezes para gerar saída de um único chunk de entrada, dependendo de quanto deve ser emitido como resultado do chunk.

É possível que nenhuma saída seja gerada de qualquer chunk de dados de entrada.

A função `callback` deve ser chamada apenas quando o chunk atual for completamente consumido. O primeiro argumento passado para o `callback` deve ser um objeto `Error` se ocorrer um erro durante o processamento da entrada ou `null` caso contrário. Se um segundo argumento for passado para o `callback`, ele será encaminhado para o método `transform.push()`, mas apenas se o primeiro argumento for falso. Em outras palavras, o seguinte é equivalente:

```js [ESM]
transform.prototype._transform = function(data, encoding, callback) {
  this.push(data);
  callback();
};

transform.prototype._transform = function(data, encoding, callback) {
  callback(null, data);
};
```
O método `transform._transform()` é prefixado com um sublinhado porque é interno à classe que o define e nunca deve ser chamado diretamente por programas de usuário.

`transform._transform()` nunca é chamado em paralelo; os streams implementam um mecanismo de fila e, para receber o próximo chunk, o `callback` deve ser chamado, de forma síncrona ou assíncrona.


#### Classe: `stream.PassThrough` {#class-streampassthrough}

A classe `stream.PassThrough` é uma implementação trivial de um fluxo [`Transform`](/pt/nodejs/api/stream#class-streamtransform) que simplesmente passa os bytes de entrada para a saída. Seu propósito é principalmente para exemplos e testes, mas existem alguns casos de uso onde `stream.PassThrough` é útil como um bloco de construção para novos tipos de fluxos.

## Notas adicionais {#additional-notes}

### Compatibilidade de fluxos com geradores assíncronos e iteradores assíncronos {#streams-compatibility-with-async-generators-and-async-iterators}

Com o suporte de geradores assíncronos e iteradores em JavaScript, os geradores assíncronos são efetivamente uma construção de fluxo de nível de linguagem de primeira classe neste ponto.

Alguns casos comuns de interoperação de uso de fluxos Node.js com geradores assíncronos e iteradores assíncronos são fornecidos abaixo.

#### Consumindo fluxos legíveis com iteradores assíncronos {#consuming-readable-streams-with-async-iterators}

```js [ESM]
(async function() {
  for await (const chunk of readable) {
    console.log(chunk);
  }
})();
```
Iteradores assíncronos registram um manipulador de erros permanente no fluxo para evitar quaisquer erros não tratados após a destruição.

#### Criando fluxos legíveis com geradores assíncronos {#creating-readable-streams-with-async-generators}

Um fluxo legível do Node.js pode ser criado a partir de um gerador assíncrono usando o método utilitário `Readable.from()`:

```js [ESM]
const { Readable } = require('node:stream');

const ac = new AbortController();
const signal = ac.signal;

async function * generate() {
  yield 'a';
  await someLongRunningFn({ signal });
  yield 'b';
  yield 'c';
}

const readable = Readable.from(generate());
readable.on('close', () => {
  ac.abort();
});

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
#### Canalizando para fluxos graváveis a partir de iteradores assíncronos {#piping-to-writable-streams-from-async-iterators}

Ao gravar em um fluxo gravável a partir de um iterador assíncrono, garanta o tratamento correto da contrapressão e dos erros. [`stream.pipeline()`](/pt/nodejs/api/stream#streampipelinesource-transforms-destination-callback) abstrai o tratamento da contrapressão e dos erros relacionados à contrapressão:

```js [ESM]
const fs = require('node:fs');
const { pipeline } = require('node:stream');
const { pipeline: pipelinePromise } = require('node:stream/promises');

const writable = fs.createWriteStream('./file');

const ac = new AbortController();
const signal = ac.signal;

const iterator = createIterator({ signal });

// Padrão de Callback
pipeline(iterator, writable, (err, value) => {
  if (err) {
    console.error(err);
  } else {
    console.log(value, 'value returned');
  }
}).on('close', () => {
  ac.abort();
});

// Padrão de Promise
pipelinePromise(iterator, writable)
  .then((value) => {
    console.log(value, 'value returned');
  })
  .catch((err) => {
    console.error(err);
    ac.abort();
  });
```

### Compatibilidade com versões mais antigas do Node.js {#compatibility-with-older-nodejs-versions}

Antes do Node.js 0.10, a interface de stream `Readable` era mais simples, mas também menos poderosa e menos útil.

- Em vez de esperar por chamadas ao método [`stream.read()`](/pt/nodejs/api/stream#readablereadsize), os eventos [`'data'`](/pt/nodejs/api/stream#event-data) começariam a ser emitidos imediatamente. Aplicações que precisassem realizar alguma quantidade de trabalho para decidir como lidar com os dados eram obrigadas a armazenar os dados lidos em buffers para que os dados não fossem perdidos.
- O método [`stream.pause()`](/pt/nodejs/api/stream#readablepause) era consultivo, em vez de garantido. Isso significava que ainda era necessário estar preparado para receber eventos [`'data'`](/pt/nodejs/api/stream#event-data) *mesmo quando o stream estava em um estado pausado*.

No Node.js 0.10, a classe [`Readable`](/pt/nodejs/api/stream#class-streamreadable) foi adicionada. Para compatibilidade retroativa com programas Node.js mais antigos, os streams `Readable` mudam para o "modo de fluxo" quando um manipulador de eventos [`'data'`](/pt/nodejs/api/stream#event-data) é adicionado ou quando o método [`stream.resume()`](/pt/nodejs/api/stream#readableresume) é chamado. O efeito é que, mesmo quando não se usa o novo método [`stream.read()`](/pt/nodejs/api/stream#readablereadsize) e o evento [`'readable'`](/pt/nodejs/api/stream#event-readable), não é mais necessário se preocupar em perder chunks de [`'data'`](/pt/nodejs/api/stream#event-data).

Embora a maioria das aplicações continue a funcionar normalmente, isto introduz um caso limite nas seguintes condições:

- Nenhum listener de evento [`'data'`](/pt/nodejs/api/stream#event-data) é adicionado.
- O método [`stream.resume()`](/pt/nodejs/api/stream#readableresume) nunca é chamado.
- O stream não é direcionado para nenhum destino gravável.

Por exemplo, considere o seguinte código:

```js [ESM]
// ATENÇÃO! QUEBRADO!
net.createServer((socket) => {

  // Adicionamos um listener 'end', mas nunca consumimos os dados.
  socket.on('end', () => {
    // Nunca chegará aqui.
    socket.end('A mensagem foi recebida, mas não foi processada.\n');
  });

}).listen(1337);
```
Antes do Node.js 0.10, os dados da mensagem de entrada seriam simplesmente descartados. No entanto, no Node.js 0.10 e posterior, o socket permanece pausado para sempre.

A solução alternativa nesta situação é chamar o método [`stream.resume()`](/pt/nodejs/api/stream#readableresume) para iniciar o fluxo de dados:

```js [ESM]
// Solução alternativa.
net.createServer((socket) => {
  socket.on('end', () => {
    socket.end('A mensagem foi recebida, mas não foi processada.\n');
  });

  // Inicia o fluxo de dados, descartando-o.
  socket.resume();
}).listen(1337);
```
Além de novos streams `Readable` mudarem para o modo de fluxo, streams de estilo pré-0.10 podem ser encapsulados em uma classe `Readable` usando o método [`readable.wrap()`](/pt/nodejs/api/stream#readablewrapstream).


### `readable.read(0)` {#readableread0}

Existem alguns casos em que é necessário disparar uma atualização dos mecanismos de fluxo legível subjacentes, sem realmente consumir nenhum dado. Nesses casos, é possível chamar `readable.read(0)`, que sempre retornará `null`.

Se o buffer de leitura interno estiver abaixo de `highWaterMark` e o fluxo não estiver lendo no momento, chamar `stream.read(0)` disparará uma chamada de baixo nível para [`stream._read()`](/pt/nodejs/api/stream#readable_readsize).

Embora a maioria das aplicações quase nunca precise fazer isso, existem situações dentro do Node.js onde isso é feito, particularmente nos internos da classe de fluxo `Readable`.

### `readable.push('')` {#readablepush}

O uso de `readable.push('')` não é recomendado.

Enviar um [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ou [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) de zero bytes para um fluxo que não está no modo de objeto tem um efeito colateral interessante. Como *é* uma chamada para [`readable.push()`](/pt/nodejs/api/stream#readablepushchunk-encoding), a chamada encerrará o processo de leitura. No entanto, como o argumento é uma string vazia, nenhum dado é adicionado ao buffer legível, portanto, não há nada para um usuário consumir.

### Discrepância `highWaterMark` após chamar `readable.setEncoding()` {#highwatermark-discrepancy-after-calling-readablesetencoding}

O uso de `readable.setEncoding()` alterará o comportamento de como o `highWaterMark` opera no modo não objeto.

Normalmente, o tamanho do buffer atual é medido em relação ao `highWaterMark` em *bytes*. No entanto, depois que `setEncoding()` é chamado, a função de comparação começará a medir o tamanho do buffer em *caracteres*.

Este não é um problema em casos comuns com `latin1` ou `ascii`. Mas é aconselhável estar atento a este comportamento ao trabalhar com strings que podem conter caracteres multi-byte.

