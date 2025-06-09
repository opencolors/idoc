---
title: Documentação do Node.js - HTTP/2
description: Esta página fornece documentação completa sobre o módulo HTTP/2 no Node.js, detalhando sua API, uso e exemplos para implementar servidores e clientes HTTP/2.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta página fornece documentação completa sobre o módulo HTTP/2 no Node.js, detalhando sua API, uso e exemplos para implementar servidores e clientes HTTP/2.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta página fornece documentação completa sobre o módulo HTTP/2 no Node.js, detalhando sua API, uso e exemplos para implementar servidores e clientes HTTP/2.
---


# HTTP/2 {#http/2}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | Requisições com o cabeçalho `host` (com ou sem `:authority`) agora podem ser enviadas/recebidas. |
| v15.3.0, v14.17.0 | É possível abortar uma requisição com um AbortSignal. |
| v10.10.0 | HTTP/2 agora é Estável. Anteriormente, era Experimental. |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/http2.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http2.js)

O módulo `node:http2` fornece uma implementação do protocolo [HTTP/2](https://tools.ietf.org/html/rfc7540). Ele pode ser acessado usando:

```js [ESM]
const http2 = require('node:http2');
```
## Determinando se o suporte ao crypto está indisponível {#determining-if-crypto-support-is-unavailable}

É possível que o Node.js seja construído sem incluir suporte para o módulo `node:crypto`. Nesses casos, tentar `import` de `node:http2` ou chamar `require('node:http2')` resultará em um erro sendo lançado.

Ao usar CommonJS, o erro lançado pode ser capturado usando try/catch:

```js [CJS]
let http2;
try {
  http2 = require('node:http2');
} catch (err) {
  console.error('o suporte ao http2 está desativado!');
}
```
Ao usar a palavra-chave léxica ESM `import`, o erro só pode ser capturado se um manipulador para `process.on('uncaughtException')` for registrado *antes* de qualquer tentativa de carregar o módulo ser feita (usando, por exemplo, um módulo de pré-carregamento).

Ao usar ESM, se houver uma chance de que o código possa ser executado em uma versão do Node.js onde o suporte ao crypto não está habilitado, considere usar a função [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) em vez da palavra-chave léxica `import`:

```js [ESM]
let http2;
try {
  http2 = await import('node:http2');
} catch (err) {
  console.error('o suporte ao http2 está desativado!');
}
```
## API Core {#core-api}

A API Core fornece uma interface de baixo nível projetada especificamente para suporte a recursos do protocolo HTTP/2. Ela é especificamente *não* projetada para compatibilidade com a API do módulo [HTTP/1](/pt/nodejs/api/http) existente. No entanto, a [API de Compatibilidade](/pt/nodejs/api/http2#compatibility-api) é.

A API Core `http2` é muito mais simétrica entre cliente e servidor do que a API `http`. Por exemplo, a maioria dos eventos, como `'error'`, `'connect'` e `'stream'`, podem ser emitidos pelo código do lado do cliente ou pelo código do lado do servidor.


### Exemplo do lado do servidor {#server-side-example}

O seguinte ilustra um servidor HTTP/2 simples usando a API Core. Como não se conhece nenhum navegador que suporte [HTTP/2 não criptografado](https://http2.github.io/faq/#does-http2-require-encryption), o uso de [`http2.createSecureServer()`](/pt/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) é necessário ao comunicar com clientes de navegador.



::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const server = createSecureServer({
  key: readFileSync('localhost-privkey.pem'),
  cert: readFileSync('localhost-cert.pem'),
});

server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::

Para gerar o certificado e a chave para este exemplo, execute:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```
### Exemplo do lado do cliente {#client-side-example}

O seguinte ilustra um cliente HTTP/2:



::: code-group
```js [ESM]
import { connect } from 'node:http2';
import { readFileSync } from 'node:fs';

const client = connect('https://localhost:8443', {
  ca: readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```
:::


### Classe: `Http2Session` {#class-http2session}

**Adicionado em: v8.4.0**

- Estende: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Instâncias da classe `http2.Http2Session` representam uma sessão de comunicação ativa entre um cliente e um servidor HTTP/2. Instâncias desta classe *não* devem ser construídas diretamente pelo código do usuário.

Cada instância de `Http2Session` exibirá comportamentos ligeiramente diferentes, dependendo se está operando como um servidor ou um cliente. A propriedade `http2session.type` pode ser usada para determinar o modo em que uma `Http2Session` está operando. No lado do servidor, o código do usuário raramente terá a oportunidade de trabalhar diretamente com o objeto `Http2Session`, com a maioria das ações normalmente sendo tomadas por meio de interações com os objetos `Http2Server` ou `Http2Stream`.

O código do usuário não criará instâncias de `Http2Session` diretamente. Instâncias de `Http2Session` do lado do servidor são criadas pela instância de `Http2Server` quando uma nova conexão HTTP/2 é recebida. Instâncias de `Http2Session` do lado do cliente são criadas usando o método `http2.connect()`.

#### `Http2Session` e sockets {#http2session-and-sockets}

Cada instância de `Http2Session` está associada a exatamente um [`net.Socket`](/pt/nodejs/api/net#class-netsocket) ou [`tls.TLSSocket`](/pt/nodejs/api/tls#class-tlstlssocket) quando é criada. Quando o `Socket` ou o `Http2Session` são destruídos, ambos serão destruídos.

Devido aos requisitos específicos de serialização e processamento impostos pelo protocolo HTTP/2, não é recomendado que o código do usuário leia dados ou grave dados em uma instância de `Socket` vinculada a uma `Http2Session`. Fazer isso pode colocar a sessão HTTP/2 em um estado indeterminado, fazendo com que a sessão e o socket se tornem inutilizáveis.

Depois que um `Socket` for vinculado a uma `Http2Session`, o código do usuário deve confiar exclusivamente na API da `Http2Session`.

#### Evento: `'close'` {#event-close}

**Adicionado em: v8.4.0**

O evento `'close'` é emitido quando o `Http2Session` é destruído. Seu listener não espera nenhum argumento.

#### Evento: `'connect'` {#event-connect}

**Adicionado em: v8.4.0**

- `session` [\<Http2Session\>](/pt/nodejs/api/http2#class-http2session)
- `socket` [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket)

O evento `'connect'` é emitido quando o `Http2Session` é conectado com sucesso ao peer remoto e a comunicação pode começar.

O código do usuário normalmente não escutará este evento diretamente.


#### Evento: `'error'` {#event-error}

**Adicionado em: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

O evento `'error'` é emitido quando ocorre um erro durante o processamento de uma `Http2Session`.

#### Evento: `'frameError'` {#event-frameerror}

**Adicionado em: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tipo de frame.
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O código de erro.
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID do stream (ou `0` se o frame não estiver associado a um stream).

O evento `'frameError'` é emitido quando ocorre um erro ao tentar enviar um frame na sessão. Se o frame que não pôde ser enviado estiver associado a um `Http2Stream` específico, uma tentativa de emitir um evento `'frameError'` no `Http2Stream` é feita.

Se o evento `'frameError'` estiver associado a um stream, o stream será fechado e destruído imediatamente após o evento `'frameError'`. Se o evento não estiver associado a um stream, o `Http2Session` será desligado imediatamente após o evento `'frameError'`.

#### Evento: `'goaway'` {#event-goaway}

**Adicionado em: v8.4.0**

- `errorCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O código de erro HTTP/2 especificado no frame `GOAWAY`.
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID do último stream que o peer remoto processou com sucesso (ou `0` se nenhum ID for especificado).
- `opaqueData` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Se dados opacos adicionais foram incluídos no frame `GOAWAY`, uma instância de `Buffer` será passada contendo esses dados.

O evento `'goaway'` é emitido quando um frame `GOAWAY` é recebido.

A instância `Http2Session` será desligada automaticamente quando o evento `'goaway'` for emitido.


#### Evento: `'localSettings'` {#event-localsettings}

**Adicionado em: v8.4.0**

- `settings` [\<Objeto de Configurações HTTP/2\>](/pt/nodejs/api/http2#settings-object) Uma cópia do quadro `SETTINGS` recebido.

O evento `'localSettings'` é emitido quando um quadro `SETTINGS` de reconhecimento foi recebido.

Ao usar `http2session.settings()` para enviar novas configurações, as configurações modificadas não entram em vigor até que o evento `'localSettings'` seja emitido.

```js [ESM]
session.settings({ enablePush: false });

session.on('localSettings', (settings) => {
  /* Use as novas configurações */
});
```
#### Evento: `'ping'` {#event-ping}

**Adicionado em: v10.12.0**

- `payload` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) O payload de 8 bytes do quadro `PING`

O evento `'ping'` é emitido sempre que um quadro `PING` é recebido do peer conectado.

#### Evento: `'remoteSettings'` {#event-remotesettings}

**Adicionado em: v8.4.0**

- `settings` [\<Objeto de Configurações HTTP/2\>](/pt/nodejs/api/http2#settings-object) Uma cópia do quadro `SETTINGS` recebido.

O evento `'remoteSettings'` é emitido quando um novo quadro `SETTINGS` é recebido do peer conectado.

```js [ESM]
session.on('remoteSettings', (settings) => {
  /* Use as novas configurações */
});
```
#### Evento: `'stream'` {#event-stream}

**Adicionado em: v8.4.0**

- `stream` [\<Http2Stream\>](/pt/nodejs/api/http2#class-http2stream) Uma referência ao stream
- `headers` [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object) Um objeto descrevendo os cabeçalhos
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) As flags numéricas associadas
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array contendo os nomes dos cabeçalhos brutos seguidos por seus respectivos valores.

O evento `'stream'` é emitido quando um novo `Http2Stream` é criado.

```js [ESM]
session.on('stream', (stream, headers, flags) => {
  const method = headers[':method'];
  const path = headers[':path'];
  // ...
  stream.respond({
    ':status': 200,
    'content-type': 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
No lado do servidor, o código do usuário normalmente não ouvirá este evento diretamente e, em vez disso, registrará um manipulador para o evento `'stream'` emitido pelas instâncias `net.Server` ou `tls.Server` retornadas por `http2.createServer()` e `http2.createSecureServer()`, respectivamente, como no exemplo abaixo:



::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// Crie um servidor HTTP/2 não criptografado
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// Crie um servidor HTTP/2 não criptografado
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::

Mesmo que os streams HTTP/2 e os sockets de rede não estejam em uma correspondência 1:1, um erro de rede destruirá cada stream individual e deve ser tratado no nível do stream, como mostrado acima.


#### Evento: `'timeout'` {#event-timeout}

**Adicionado em: v8.4.0**

Depois que o método `http2session.setTimeout()` é usado para definir o período de timeout para esta `Http2Session`, o evento `'timeout'` é emitido se não houver atividade na `Http2Session` após o número configurado de milissegundos. Seu listener não espera nenhum argumento.

```js [ESM]
session.setTimeout(2000);
session.on('timeout', () => { /* .. */ });
```
#### `http2session.alpnProtocol` {#http2sessionalpnprotocol}

**Adicionado em: v9.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

O valor será `undefined` se a `Http2Session` ainda não estiver conectada a um socket, `h2c` se a `Http2Session` não estiver conectada a um `TLSSocket`, ou retornará o valor da propriedade `alpnProtocol` do próprio `TLSSocket` conectado.

#### `http2session.close([callback])` {#http2sessionclosecallback}

**Adicionado em: v9.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Fecha graciosamente a `Http2Session`, permitindo que quaisquer streams existentes sejam concluídos por conta própria e impedindo que novas instâncias de `Http2Stream` sejam criadas. Uma vez fechada, `http2session.destroy()` *pode* ser chamada se não houver instâncias de `Http2Stream` abertas.

Se especificado, a função `callback` é registrada como um manipulador para o evento `'close'`.

#### `http2session.closed` {#http2sessionclosed}

**Adicionado em: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Será `true` se esta instância de `Http2Session` foi fechada, caso contrário, `false`.

#### `http2session.connecting` {#http2sessionconnecting}

**Adicionado em: v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Será `true` se esta instância de `Http2Session` ainda estiver conectando, será definido como `false` antes de emitir o evento `connect` e/ou chamar o callback `http2.connect`.

#### `http2session.destroy([error][, code])` {#http2sessiondestroyerror-code}

**Adicionado em: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Um objeto `Error` se a `Http2Session` estiver sendo destruída devido a um erro.
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O código de erro HTTP/2 a ser enviado no frame `GOAWAY` final. Se não especificado, e `error` não for indefinido, o padrão é `INTERNAL_ERROR`, caso contrário, o padrão é `NO_ERROR`.

Encerra imediatamente a `Http2Session` e o `net.Socket` ou `tls.TLSSocket` associado.

Uma vez destruída, a `Http2Session` emitirá o evento `'close'`. Se `error` não for indefinido, um evento `'error'` será emitido imediatamente antes do evento `'close'`.

Se houver algum `Http2Streams` aberto restante associado à `Http2Session`, esses também serão destruídos.


#### `http2session.destroyed` {#http2sessiondestroyed}

**Adicionado em: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Será `true` se esta instância de `Http2Session` tiver sido destruída e não deve mais ser usada, caso contrário, `false`.

#### `http2session.encrypted` {#http2sessionencrypted}

**Adicionado em: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

O valor é `undefined` se o socket de sessão `Http2Session` ainda não tiver sido conectado, `true` se o `Http2Session` estiver conectado com um `TLSSocket` e `false` se o `Http2Session` estiver conectado a qualquer outro tipo de socket ou stream.

#### `http2session.goaway([code[, lastStreamID[, opaqueData]]])` {#http2sessiongoawaycode-laststreamid-opaquedata}

**Adicionado em: v9.4.0**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um código de erro HTTP/2
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID numérico do último `Http2Stream` processado
- `opaqueData` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Uma instância de `TypedArray` ou `DataView` contendo dados adicionais a serem transportados dentro do frame `GOAWAY`.

Transmite um frame `GOAWAY` para o peer conectado *sem* desligar o `Http2Session`.

#### `http2session.localSettings` {#http2sessionlocalsettings}

**Adicionado em: v8.4.0**

- [\<Objeto de Configurações HTTP/2\>](/pt/nodejs/api/http2#settings-object)

Um objeto sem protótipo que descreve as configurações locais atuais deste `Http2Session`. As configurações locais são locais para *esta* instância de `Http2Session`.

#### `http2session.originSet` {#http2sessionoriginset}

**Adicionado em: v9.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Se o `Http2Session` estiver conectado a um `TLSSocket`, a propriedade `originSet` retornará um `Array` de origens para as quais o `Http2Session` pode ser considerado autorizado.

A propriedade `originSet` só está disponível ao usar uma conexão TLS segura.


#### `http2session.pendingSettingsAck` {#http2sessionpendingsettingsack}

**Adicionado em: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Indica se o `Http2Session` está atualmente aguardando o reconhecimento de um frame `SETTINGS` enviado. Será `true` após chamar o método `http2session.settings()`. Será `false` uma vez que todos os frames `SETTINGS` enviados tenham sido reconhecidos.

#### `http2session.ping([payload, ]callback)` {#http2sessionpingpayload-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v8.9.3 | Adicionado em: v8.9.3 |
:::

- `payload` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Payload ping opcional.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Envia um frame `PING` para o peer HTTP/2 conectado. Uma função `callback` deve ser fornecida. O método retornará `true` se o `PING` foi enviado, `false` caso contrário.

O número máximo de pings pendentes (não reconhecidos) é determinado pela opção de configuração `maxOutstandingPings`. O máximo padrão é 10.

Se fornecido, o `payload` deve ser um `Buffer`, `TypedArray` ou `DataView` contendo 8 bytes de dados que serão transmitidos com o `PING` e retornados com o reconhecimento do ping.

O callback será invocado com três argumentos: um argumento de erro que será `null` se o `PING` foi reconhecido com sucesso, um argumento `duration` que relata o número de milissegundos decorridos desde que o ping foi enviado e o reconhecimento foi recebido, e um `Buffer` contendo o `PING` payload de 8 bytes.

```js [ESM]
session.ping(Buffer.from('abcdefgh'), (err, duration, payload) => {
  if (!err) {
    console.log(`Ping reconhecido em ${duration} milissegundos`);
    console.log(`Com payload '${payload.toString()}'`);
  }
});
```
Se o argumento `payload` não for especificado, o payload padrão será o timestamp de 64 bits (little endian) marcando o início da duração do `PING`.


#### `http2session.ref()` {#http2sessionref}

**Adicionado em: v9.4.0**

Chama [`ref()`](/pt/nodejs/api/net#socketref) na [`net.Socket`](/pt/nodejs/api/net#class-netsocket) subjacente desta instância de `Http2Session`.

#### `http2session.remoteSettings` {#http2sessionremotesettings}

**Adicionado em: v8.4.0**

- [\<Objeto de Configurações HTTP/2\>](/pt/nodejs/api/http2#settings-object)

Um objeto sem protótipo que descreve as configurações remotas atuais desta `Http2Session`. As configurações remotas são definidas pelo par HTTP/2 *conectado*.

#### `http2session.setLocalWindowSize(windowSize)` {#http2sessionsetlocalwindowsizewindowsize}

**Adicionado em: v15.3.0, v14.18.0**

- `windowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Define o tamanho da janela do endpoint local. O `windowSize` é o tamanho total da janela a ser definido, não o delta.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Define o tamanho da janela local para ser 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Define o tamanho da janela local para ser 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```
:::

Para clientes http2, o evento apropriado é `'connect'` ou `'remoteSettings'`.

#### `http2session.setTimeout(msecs, callback)` {#http2sessionsettimeoutmsecs-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Usado para definir uma função de callback que é chamada quando não há atividade na `Http2Session` após `msecs` milissegundos. O `callback` fornecido é registrado como um listener no evento `'timeout'`.


#### `http2session.socket` {#http2sessionsocket}

**Adicionado em: v8.4.0**

- [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/pt/nodejs/api/tls#class-tlstlssocket)

Retorna um objeto `Proxy` que atua como um `net.Socket` (ou `tls.TLSSocket`), mas limita os métodos disponíveis aos que são seguros para uso com HTTP/2.

`destroy`, `emit`, `end`, `pause`, `read`, `resume` e `write` lançarão um erro com o código `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Consulte [`Http2Session` e Sockets](/pt/nodejs/api/http2#http2session-and-sockets) para obter mais informações.

O método `setTimeout` será chamado nesta `Http2Session`.

Todas as outras interações serão roteadas diretamente para o socket.

#### `http2session.state` {#http2sessionstate}

**Adicionado em: v8.4.0**

Fornece informações diversas sobre o estado atual da `Http2Session`.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `effectiveLocalWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho atual da janela de controle de fluxo local (recebimento) para a `Http2Session`.
    - `effectiveRecvDataLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número atual de bytes que foram recebidos desde o último `WINDOW_UPDATE` de controle de fluxo.
    - `nextStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O identificador numérico a ser usado na próxima vez que um novo `Http2Stream` for criado por esta `Http2Session`.
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes que o peer remoto pode enviar sem receber um `WINDOW_UPDATE`.
    - `lastProcStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O id numérico do `Http2Stream` para o qual um frame `HEADERS` ou `DATA` foi recebido mais recentemente.
    - `remoteWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes que esta `Http2Session` pode enviar sem receber um `WINDOW_UPDATE`.
    - `outboundQueueSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de frames atualmente na fila de saída para esta `Http2Session`.
    - `deflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho atual em bytes da tabela de estado de compressão de cabeçalho de saída.
    - `inflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho atual em bytes da tabela de estado de compressão de cabeçalho de entrada.

Um objeto que descreve o status atual desta `Http2Session`.


#### `http2session.settings([settings][, callback])` {#http2sessionsettingssettings-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- `settings` [\<Objeto de Configurações HTTP/2\>](/pt/nodejs/api/http2#settings-object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback que é chamado assim que a sessão é conectada ou imediatamente se a sessão já estiver conectada.
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
    - `settings` [\<Objeto de Configurações HTTP/2\>](/pt/nodejs/api/http2#settings-object) O objeto `settings` atualizado.
    - `duration` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Atualiza as configurações locais atuais para esta `Http2Session` e envia um novo frame `SETTINGS` para o peer HTTP/2 conectado.

Uma vez chamado, a propriedade `http2session.pendingSettingsAck` será `true` enquanto a sessão estiver aguardando o peer remoto reconhecer as novas configurações.

As novas configurações não entrarão em vigor até que o reconhecimento `SETTINGS` seja recebido e o evento `'localSettings'` seja emitido. É possível enviar vários frames `SETTINGS` enquanto o reconhecimento ainda estiver pendente.

#### `http2session.type` {#http2sessiontype}

**Adicionado em: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O `http2session.type` será igual a `http2.constants.NGHTTP2_SESSION_SERVER` se esta instância de `Http2Session` for um servidor, e `http2.constants.NGHTTP2_SESSION_CLIENT` se a instância for um cliente.

#### `http2session.unref()` {#http2sessionunref}

**Adicionado em: v9.4.0**

Chama [`unref()`](/pt/nodejs/api/net#socketunref) no [`net.Socket`](/pt/nodejs/api/net#class-netsocket) subjacente desta instância `Http2Session`.


### Classe: `ServerHttp2Session` {#class-serverhttp2session}

**Adicionado em: v8.4.0**

- Estende: [\<Http2Session\>](/pt/nodejs/api/http2#class-http2session)

#### `serverhttp2session.altsvc(alt, originOrStream)` {#serverhttp2sessionaltsvcalt-originorstream}

**Adicionado em: v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma descrição da configuração de serviço alternativo conforme definido por [RFC 7838](https://tools.ietf.org/html/rfc7838).
- `originOrStream` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Uma string de URL especificando a origem (ou um `Object` com uma propriedade `origin`) ou o identificador numérico de um `Http2Stream` ativo conforme fornecido pela propriedade `http2stream.id`.

Envia um quadro `ALTSVC` (conforme definido por [RFC 7838](https://tools.ietf.org/html/rfc7838)) para o cliente conectado.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
server.on('session', (session) => {
  // Define altsvc para a origem https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Define altsvc para um stream específico
  stream.session.altsvc('h2=":8000"', stream.id);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
server.on('session', (session) => {
  // Define altsvc para a origem https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Define altsvc para um stream específico
  stream.session.altsvc('h2=":8000"', stream.id);
});
```
:::

O envio de um quadro `ALTSVC` com um ID de stream específico indica que o serviço alternativo está associado à origem do `Http2Stream` fornecido.

A string `alt` e a string de origem *devem* conter apenas bytes ASCII e são estritamente interpretadas como uma sequência de bytes ASCII. O valor especial `'clear'` pode ser passado para limpar qualquer serviço alternativo definido anteriormente para um determinado domínio.

Quando uma string é passada para o argumento `originOrStream`, ela será analisada como uma URL e a origem será derivada. Por exemplo, a origem para a URL HTTP `'https://example.org/foo/bar'` é a string ASCII `'https://example.org'`. Um erro será lançado se a string fornecida não puder ser analisada como uma URL ou se uma origem válida não puder ser derivada.

Um objeto `URL`, ou qualquer objeto com uma propriedade `origin`, pode ser passado como `originOrStream`, caso em que o valor da propriedade `origin` será usado. O valor da propriedade `origin` *deve* ser uma origem ASCII serializada corretamente.


#### Especificando serviços alternativos {#specifying-alternative-services}

O formato do parâmetro `alt` é estritamente definido por [RFC 7838](https://tools.ietf.org/html/rfc7838) como uma string ASCII contendo uma lista delimitada por vírgulas de protocolos "alternativos" associados a um host e porta específicos.

Por exemplo, o valor `'h2="example.org:81"'` indica que o protocolo HTTP/2 está disponível no host `'example.org'` na porta TCP/IP 81. O host e a porta *devem* estar contidos entre os caracteres de aspas (`"`).

Várias alternativas podem ser especificadas, por exemplo: `'h2="example.org:81", h2=":82"'`.

O identificador do protocolo (`'h2'` nos exemplos) pode ser qualquer [ID de Protocolo ALPN](https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml#alpn-protocol-ids) válido.

A sintaxe desses valores não é validada pela implementação do Node.js e são transmitidas como fornecidas pelo usuário ou recebidas do peer.

#### `serverhttp2session.origin(...origins)` {#serverhttp2sessionoriginorigins}

**Adicionado em: v10.12.0**

- `origins` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Uma ou mais Strings de URL passadas como argumentos separados.

Envia um quadro `ORIGIN` (conforme definido por [RFC 8336](https://tools.ietf.org/html/rfc8336)) para o cliente conectado para anunciar o conjunto de origens para as quais o servidor é capaz de fornecer respostas autoritativas.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```
:::

Quando uma string é passada como uma `origin`, ela será analisada como uma URL e a origin será derivada. Por exemplo, a origin para a URL HTTP `'https://example.org/foo/bar'` é a string ASCII `'https://example.org'`. Um erro será lançado se a string fornecida não puder ser analisada como uma URL ou se uma origin válida não puder ser derivada.

Um objeto `URL` ou qualquer objeto com uma propriedade `origin` pode ser passado como uma `origin`, caso em que o valor da propriedade `origin` será usado. O valor da propriedade `origin` *deve* ser uma origin ASCII devidamente serializada.

Alternativamente, a opção `origins` pode ser usada ao criar um novo servidor HTTP/2 usando o método `http2.createSecureServer()`:

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```
:::


### Classe: `ClientHttp2Session` {#class-clienthttp2session}

**Adicionado em: v8.4.0**

- Estende: [\<Http2Session\>](/pt/nodejs/api/http2#class-http2session)

#### Evento: `'altsvc'` {#event-altsvc}

**Adicionado em: v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `streamId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O evento `'altsvc'` é emitido sempre que um quadro `ALTSVC` é recebido pelo cliente. O evento é emitido com o valor `ALTSVC`, origem e ID do fluxo. Se nenhuma `origin` for fornecida no quadro `ALTSVC`, `origin` será uma string vazia.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```
:::

#### Evento: `'origin'` {#event-origin}

**Adicionado em: v10.12.0**

- `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O evento `'origin'` é emitido sempre que um quadro `ORIGIN` é recebido pelo cliente. O evento é emitido com um array de strings `origin`. O `http2session.originSet` será atualizado para incluir as origens recebidas.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```
:::

O evento `'origin'` só é emitido quando se usa uma conexão TLS segura.


#### `clienthttp2session.request(headers[, options])` {#clienthttp2sessionrequestheaders-options}

**Adicionado em: v8.4.0**

-  `headers` [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object)
-  `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se o lado *gravável* do `Http2Stream` deve ser fechado inicialmente, como ao enviar uma requisição `GET` que não deve esperar um corpo de payload.
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true` e `parent` identifica um Stream pai, o stream criado se torna a única dependência direta do pai, com todas as outras dependências existentes tornando-se dependentes do stream recém-criado. **Padrão:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o identificador numérico de um stream do qual o stream recém-criado depende.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica a dependência relativa de um stream em relação a outros streams com o mesmo `parent`. O valor é um número entre `1` e `256` (inclusive).
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, o `Http2Stream` emitirá o evento `'wantTrailers'` após o envio do último frame `DATA`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Um AbortSignal que pode ser usado para abortar uma requisição em andamento.
  
 
-  Retorna: [\<ClientHttp2Stream\>](/pt/nodejs/api/http2#class-clienthttp2stream)

Apenas para instâncias `Http2Session` do Cliente HTTP/2, o `http2session.request()` cria e retorna uma instância `Http2Stream` que pode ser usada para enviar uma requisição HTTP/2 para o servidor conectado.

Quando um `ClientHttp2Session` é criado pela primeira vez, o socket pode ainda não estar conectado. Se `clienthttp2session.request()` for chamado durante este tempo, a requisição real será adiada até que o socket esteja pronto para funcionar. Se a `session` for fechada antes que a requisição real seja executada, um `ERR_HTTP2_GOAWAY_SESSION` é lançado.

Este método está disponível apenas se `http2session.type` for igual a `http2.constants.NGHTTP2_SESSION_CLIENT`.



::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const clientSession = connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```

```js [CJS]
const http2 = require('node:http2');
const clientSession = http2.connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = http2.constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```
:::

Quando a opção `options.waitForTrailers` é definida, o evento `'wantTrailers'` é emitido imediatamente após enfileirar o último pedaço de dados de payload a ser enviado. O método `http2stream.sendTrailers()` pode então ser chamado para enviar cabeçalhos de trailer para o peer.

Quando `options.waitForTrailers` é definido, o `Http2Stream` não se fechará automaticamente quando o frame `DATA` final for transmitido. O código do usuário deve chamar `http2stream.sendTrailers()` ou `http2stream.close()` para fechar o `Http2Stream`.

Quando `options.signal` é definido com um `AbortSignal` e então `abort` no `AbortController` correspondente é chamado, a requisição emitirá um evento `'error'` com um erro `AbortError`.

Os pseudo-cabeçalhos `:method` e `:path` não são especificados dentro de `headers`, eles, respectivamente, assumem o padrão:

- `:method` = `'GET'`
- `:path` = `/`


### Classe: `Http2Stream` {#class-http2stream}

**Adicionado em: v8.4.0**

- Estende: [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Cada instância da classe `Http2Stream` representa um fluxo de comunicação HTTP/2 bidirecional sobre uma instância `Http2Session`. Qualquer `Http2Session` pode ter até 2-1 instâncias `Http2Stream` ao longo de sua vida útil.

O código do usuário não construirá instâncias `Http2Stream` diretamente. Em vez disso, elas são criadas, gerenciadas e fornecidas ao código do usuário através da instância `Http2Session`. No servidor, as instâncias `Http2Stream` são criadas em resposta a uma requisição HTTP de entrada (e entregues ao código do usuário através do evento `'stream'`) ou em resposta a uma chamada para o método `http2stream.pushStream()`. No cliente, as instâncias `Http2Stream` são criadas e retornadas quando o método `http2session.request()` é chamado ou em resposta a um evento `'push'` de entrada.

A classe `Http2Stream` é uma base para as classes [`ServerHttp2Stream`](/pt/nodejs/api/http2#class-serverhttp2stream) e [`ClientHttp2Stream`](/pt/nodejs/api/http2#class-clienthttp2stream), cada uma das quais é usada especificamente pelo lado do Servidor ou do Cliente, respectivamente.

Todas as instâncias `Http2Stream` são fluxos [`Duplex`](/pt/nodejs/api/stream#class-streamduplex). O lado `Writable` do `Duplex` é usado para enviar dados para o peer conectado, enquanto o lado `Readable` é usado para receber dados enviados pelo peer conectado.

A codificação de caracteres de texto padrão para um `Http2Stream` é UTF-8. Ao usar um `Http2Stream` para enviar texto, use o cabeçalho `'content-type'` para definir a codificação de caracteres.

```js [ESM]
stream.respond({
  'content-type': 'text/html; charset=utf-8',
  ':status': 200,
});
```
#### Ciclo de Vida do `Http2Stream` {#http2stream-lifecycle}

##### Criação {#creation}

No lado do servidor, as instâncias de [`ServerHttp2Stream`](/pt/nodejs/api/http2#class-serverhttp2stream) são criadas quando:

- Um novo frame `HEADERS` HTTP/2 com um ID de fluxo não utilizado anteriormente é recebido;
- O método `http2stream.pushStream()` é chamado.

No lado do cliente, as instâncias de [`ClientHttp2Stream`](/pt/nodejs/api/http2#class-clienthttp2stream) são criadas quando o método `http2session.request()` é chamado.

No cliente, a instância `Http2Stream` retornada por `http2session.request()` pode não estar imediatamente pronta para uso se o `Http2Session` pai ainda não tiver sido totalmente estabelecido. Nesses casos, as operações chamadas no `Http2Stream` serão armazenadas em buffer até que o evento `'ready'` seja emitido. O código do usuário raramente, ou nunca, precisará lidar diretamente com o evento `'ready'`. O status de pronto de um `Http2Stream` pode ser determinado verificando o valor de `http2stream.id`. Se o valor for `undefined`, o fluxo ainda não está pronto para uso.


##### Destruição {#destruction}

Todas as instâncias de [`Http2Stream`](/pt/nodejs/api/http2#class-http2stream) são destruídas quando:

- Um frame `RST_STREAM` para o stream é recebido pelo peer conectado e (apenas para streams do cliente) os dados pendentes foram lidos.
- O método `http2stream.close()` é chamado e (apenas para streams do cliente) os dados pendentes foram lidos.
- Os métodos `http2stream.destroy()` ou `http2session.destroy()` são chamados.

Quando uma instância de `Http2Stream` é destruída, uma tentativa será feita para enviar um frame `RST_STREAM` para o peer conectado.

Quando a instância de `Http2Stream` é destruída, o evento `'close'` será emitido. Como `Http2Stream` é uma instância de `stream.Duplex`, o evento `'end'` também será emitido se os dados do stream estiverem fluindo atualmente. O evento `'error'` também pode ser emitido se `http2stream.destroy()` foi chamado com um `Error` passado como o primeiro argumento.

Depois que o `Http2Stream` foi destruído, a propriedade `http2stream.destroyed` será `true` e a propriedade `http2stream.rstCode` especificará o código de erro `RST_STREAM`. A instância de `Http2Stream` não é mais utilizável após ser destruída.

#### Evento: `'aborted'` {#event-aborted}

**Adicionado em: v8.4.0**

O evento `'aborted'` é emitido sempre que uma instância de `Http2Stream` é abortada anormalmente no meio da comunicação. Seu listener não espera nenhum argumento.

O evento `'aborted'` só será emitido se o lado gravável do `Http2Stream` não tiver sido finalizado.

#### Evento: `'close'` {#event-close_1}

**Adicionado em: v8.4.0**

O evento `'close'` é emitido quando o `Http2Stream` é destruído. Uma vez que este evento é emitido, a instância de `Http2Stream` não é mais utilizável.

O código de erro HTTP/2 usado ao fechar o stream pode ser recuperado usando a propriedade `http2stream.rstCode`. Se o código for qualquer valor diferente de `NGHTTP2_NO_ERROR` (`0`), um evento `'error'` também terá sido emitido.

#### Evento: `'error'` {#event-error_1}

**Adicionado em: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

O evento `'error'` é emitido quando ocorre um erro durante o processamento de um `Http2Stream`.


#### Evento: `'frameError'` {#event-frameerror_1}

**Adicionado em: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tipo de frame.
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O código de erro.
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID do stream (ou `0` se o frame não estiver associado a um stream).

O evento `'frameError'` é emitido quando ocorre um erro ao tentar enviar um frame. Quando invocado, a função de manipulador receberá um argumento inteiro identificando o tipo de frame e um argumento inteiro identificando o código de erro. A instância `Http2Stream` será destruída imediatamente após a emissão do evento `'frameError'`.

#### Evento: `'ready'` {#event-ready}

**Adicionado em: v8.4.0**

O evento `'ready'` é emitido quando o `Http2Stream` foi aberto, recebeu um `id` e pode ser usado. O listener não espera nenhum argumento.

#### Evento: `'timeout'` {#event-timeout_1}

**Adicionado em: v8.4.0**

O evento `'timeout'` é emitido quando nenhuma atividade é recebida para este `Http2Stream` dentro do número de milissegundos definidos usando `http2stream.setTimeout()`. Seu listener não espera nenhum argumento.

#### Evento: `'trailers'` {#event-trailers}

**Adicionado em: v8.4.0**

- `headers` [\<Objeto de Headers HTTP/2\>](/pt/nodejs/api/http2#headers-object) Um objeto descrevendo os headers
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) As flags numéricas associadas

O evento `'trailers'` é emitido quando um bloco de headers associado a campos de header de trailing é recebido. O callback do listener recebe o [Objeto de Headers HTTP/2](/pt/nodejs/api/http2#headers-object) e as flags associadas aos headers.

Este evento pode não ser emitido se `http2stream.end()` for chamado antes que os trailers sejam recebidos e os dados de entrada não estiverem sendo lidos ou ouvidos.

```js [ESM]
stream.on('trailers', (headers, flags) => {
  console.log(headers);
});
```

#### Evento: `'wantTrailers'` {#event-wanttrailers}

**Adicionado em: v10.0.0**

O evento `'wantTrailers'` é emitido quando o `Http2Stream` enfileirou o quadro `DATA` final a ser enviado em um quadro e o `Http2Stream` está pronto para enviar cabeçalhos de rastreamento. Ao iniciar uma solicitação ou resposta, a opção `waitForTrailers` deve ser definida para que este evento seja emitido.

#### `http2stream.aborted` {#http2streamaborted}

**Adicionado em: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Definido como `true` se a instância `Http2Stream` foi abortada anormalmente. Quando definido, o evento `'aborted'` terá sido emitido.

#### `http2stream.bufferSize` {#http2streambuffersize}

**Adicionado em: v11.2.0, v10.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Esta propriedade mostra o número de caracteres atualmente armazenados em buffer para serem gravados. Consulte [`net.Socket.bufferSize`](/pt/nodejs/api/net#socketbuffersize) para obter detalhes.

#### `http2stream.close(code[, callback])` {#http2streamclosecode-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Inteiro não assinado de 32 bits que identifica o código de erro. **Padrão:** `http2.constants.NGHTTP2_NO_ERROR` (`0x00`).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função opcional registrada para ouvir o evento `'close'`.

Fecha a instância `Http2Stream` enviando um quadro `RST_STREAM` ao peer HTTP/2 conectado.

#### `http2stream.closed` {#http2streamclosed}

**Adicionado em: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Definido como `true` se a instância `Http2Stream` foi fechada.

#### `http2stream.destroyed` {#http2streamdestroyed}

**Adicionado em: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Definido como `true` se a instância `Http2Stream` foi destruída e não é mais utilizável.


#### `http2stream.endAfterHeaders` {#http2streamendafterheaders}

**Adicionado em: v10.11.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Definido como `true` se o sinalizador `END_STREAM` foi definido no frame HEADERS de solicitação ou resposta recebido, indicando que nenhum dado adicional deve ser recebido e o lado legível do `Http2Stream` será fechado.

#### `http2stream.id` {#http2streamid}

**Adicionado em: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

O identificador de fluxo numérico desta instância `Http2Stream`. Definido como `undefined` se o identificador de fluxo ainda não foi atribuído.

#### `http2stream.pending` {#http2streampending}

**Adicionado em: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Definido como `true` se a instância `Http2Stream` ainda não foi atribuída a um identificador de fluxo numérico.

#### `http2stream.priority(options)` {#http2streampriorityoptions}

**Adicionado em: v8.4.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true` e `parent` identifica um Stream pai, este fluxo se torna a única dependência direta do pai, com todos os outros dependentes existentes se tornando dependentes deste fluxo. **Padrão:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o identificador numérico de um fluxo do qual este fluxo é dependente.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica a dependência relativa de um fluxo em relação a outros fluxos com o mesmo `parent`. O valor é um número entre `1` e `256` (inclusive).
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, altera a prioridade localmente sem enviar um frame `PRIORITY` para o par conectado.

Atualiza a prioridade para esta instância `Http2Stream`.


#### `http2stream.rstCode` {#http2streamrstcode}

**Adicionado em: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Definido para o [código de erro](/pt/nodejs/api/http2#error-codes-for-rst_stream-and-goaway) `RST_STREAM` relatado quando o `Http2Stream` é destruído após receber um quadro `RST_STREAM` do par conectado, chamar `http2stream.close()` ou `http2stream.destroy()`. Será `undefined` se o `Http2Stream` não tiver sido fechado.

#### `http2stream.sentHeaders` {#http2streamsentheaders}

**Adicionado em: v9.5.0**

- [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object)

Um objeto contendo os cabeçalhos de saída enviados para este `Http2Stream`.

#### `http2stream.sentInfoHeaders` {#http2streamsentinfoheaders}

**Adicionado em: v9.5.0**

- [\<Objeto de Cabeçalhos HTTP/2[]\>](/pt/nodejs/api/http2#headers-object)

Um array de objetos contendo os cabeçalhos informativos (adicionais) de saída enviados para este `Http2Stream`.

#### `http2stream.sentTrailers` {#http2streamsenttrailers}

**Adicionado em: v9.5.0**

- [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object)

Um objeto contendo os trailers de saída enviados para este `HttpStream`.

#### `http2stream.session` {#http2streamsession}

**Adicionado em: v8.4.0**

- [\<Http2Session\>](/pt/nodejs/api/http2#class-http2session)

Uma referência à instância `Http2Session` que possui este `Http2Stream`. O valor será `undefined` após a instância `Http2Stream` ser destruída.

#### `http2stream.setTimeout(msecs, callback)` {#http2streamsettimeoutmsecs-callback}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)



::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const client = connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = constants;
const req = client.request({ ':path': '/' });

// Cancela o fluxo se não houver atividade após 5 segundos
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = http2.constants;
const req = client.request({ ':path': '/' });

// Cancela o fluxo se não houver atividade após 5 segundos
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```
:::


#### `http2stream.state` {#http2streamstate}

**Adicionado em: v8.4.0**

Fornece informações diversas sobre o estado atual do `Http2Stream`.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes que o peer conectado pode enviar para este `Http2Stream` sem receber um `WINDOW_UPDATE`.
    - `state` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um sinalizador indicando o estado atual de baixo nível do `Http2Stream` conforme determinado por `nghttp2`.
    - `localClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` se este `Http2Stream` foi fechado localmente.
    - `remoteClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` se este `Http2Stream` foi fechado remotamente.
    - `sumDependencyWeight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O peso total de todas as instâncias `Http2Stream` que dependem deste `Http2Stream`, conforme especificado usando quadros `PRIORITY`.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O peso de prioridade deste `Http2Stream`.

Um estado atual deste `Http2Stream`.

#### `http2stream.sendTrailers(headers)` {#http2streamsendtrailersheaders}

**Adicionado em: v10.0.0**

- `headers` [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object)

Envia um quadro `HEADERS` à extremidade do HTTP/2 conectado. Esse método fará com que o `Http2Stream` seja fechado imediatamente e só deve ser chamado depois que o evento `'wantTrailers'` for emitido. Ao enviar uma solicitação ou enviar uma resposta, a opção `options.waitForTrailers` deve ser definida para manter o `Http2Stream` aberto após o quadro `DATA` final para que os trailers possam ser enviados.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```
:::

A especificação HTTP/1 proíbe que os trailers contenham campos de pseudo-cabeçalho HTTP/2 (por exemplo, `':method'`, `':path'`, etc.).


### Classe: `ClientHttp2Stream` {#class-clienthttp2stream}

**Adicionado em: v8.4.0**

- Extende [\<Http2Stream\>](/pt/nodejs/api/http2#class-http2stream)

A classe `ClientHttp2Stream` é uma extensão de `Http2Stream` que é usada exclusivamente em Clientes HTTP/2. As instâncias de `Http2Stream` no cliente fornecem eventos como `'response'` e `'push'` que são relevantes apenas no cliente.

#### Evento: `'continue'` {#event-continue}

**Adicionado em: v8.5.0**

Emitido quando o servidor envia um status `100 Continue`, geralmente porque a requisição continha `Expect: 100-continue`. Esta é uma instrução de que o cliente deve enviar o corpo da requisição.

#### Evento: `'headers'` {#event-headers}

**Adicionado em: v8.4.0**

- `headers` [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O evento `'headers'` é emitido quando um bloco adicional de cabeçalhos é recebido para um fluxo, como quando um bloco de cabeçalhos informativos `1xx` é recebido. O callback do listener recebe o [Objeto de Cabeçalhos HTTP/2](/pt/nodejs/api/http2#headers-object) e flags associadas aos cabeçalhos.

```js [ESM]
stream.on('headers', (headers, flags) => {
  console.log(headers);
});
```
#### Evento: `'push'` {#event-push}

**Adicionado em: v8.4.0**

- `headers` [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O evento `'push'` é emitido quando os cabeçalhos de resposta para um fluxo Server Push são recebidos. O callback do listener recebe o [Objeto de Cabeçalhos HTTP/2](/pt/nodejs/api/http2#headers-object) e flags associadas aos cabeçalhos.

```js [ESM]
stream.on('push', (headers, flags) => {
  console.log(headers);
});
```
#### Evento: `'response'` {#event-response}

**Adicionado em: v8.4.0**

- `headers` [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O evento `'response'` é emitido quando um frame `HEADERS` de resposta foi recebido para este fluxo do servidor HTTP/2 conectado. O listener é invocado com dois argumentos: um `Object` contendo o [Objeto de Cabeçalhos HTTP/2](/pt/nodejs/api/http2#headers-object) recebido e flags associadas aos cabeçalhos.



::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```
:::


### Classe: `ServerHttp2Stream` {#class-serverhttp2stream}

**Adicionado em: v8.4.0**

- Estende: [\<Http2Stream\>](/pt/nodejs/api/http2#class-http2stream)

A classe `ServerHttp2Stream` é uma extensão de [`Http2Stream`](/pt/nodejs/api/http2#class-http2stream) que é usada exclusivamente em Servidores HTTP/2. As instâncias de `Http2Stream` no servidor fornecem métodos adicionais como `http2stream.pushStream()` e `http2stream.respond()` que são relevantes apenas no servidor.

#### `http2stream.additionalHeaders(headers)` {#http2streamadditionalheadersheaders}

**Adicionado em: v8.4.0**

- `headers` [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object)

Envia um frame `HEADERS` informativo adicional para o peer HTTP/2 conectado.

#### `http2stream.headersSent` {#http2streamheaderssent}

**Adicionado em: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verdadeiro se os cabeçalhos foram enviados, falso caso contrário (somente leitura).

#### `http2stream.pushAllowed` {#http2streampushallowed}

**Adicionado em: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Propriedade somente leitura mapeada para o sinalizador `SETTINGS_ENABLE_PUSH` do frame `SETTINGS` mais recente do cliente remoto. Será `true` se o peer remoto aceitar streams push, `false` caso contrário. As configurações são as mesmas para cada `Http2Stream` na mesma `Http2Session`.

#### `http2stream.pushStream(headers[, options], callback)` {#http2streampushstreamheaders-options-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- `headers` [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object)
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true` e `parent` identifica um Stream pai, o stream criado se torna a única dependência direta do pai, com todas as outras dependências existentes tornando-se dependentes do stream recém-criado. **Padrão:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o identificador numérico de um stream do qual o stream recém-criado depende.

- `callback` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback que é chamado assim que o stream push é iniciado.
    - `err` [\<Erro\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `pushStream` [\<ServerHttp2Stream\>](/pt/nodejs/api/http2#class-serverhttp2stream) O objeto `pushStream` retornado.
    - `headers` [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object) Objeto de cabeçalhos com o qual o `pushStream` foi iniciado.

Inicia um stream push. O callback é invocado com a nova instância `Http2Stream` criada para o stream push passado como o segundo argumento, ou um `Error` passado como o primeiro argumento.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```
:::

Definir o peso de um stream push não é permitido no frame `HEADERS`. Passe um valor de `weight` para `http2stream.priority` com a opção `silent` definida como `true` para habilitar o balanceamento de largura de banda do lado do servidor entre streams simultâneos.

Chamar `http2stream.pushStream()` de dentro de um stream push não é permitido e lançará um erro.


#### `http2stream.respond([headers[, options]])` {#http2streamrespondheaders-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.5.0, v12.19.0 | Permite definir explicitamente os cabeçalhos de data. |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- `headers` [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object)
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Defina como `true` para indicar que a resposta não incluirá dados de carga.
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, o `Http2Stream` emitirá o evento `'wantTrailers'` após o envio do quadro `DATA` final.
  
 



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```
:::

Inicia uma resposta. Quando a opção `options.waitForTrailers` é definida, o evento `'wantTrailers'` será emitido imediatamente após enfileirar o último bloco de dados de carga a ser enviado. O método `http2stream.sendTrailers()` pode então ser usado para enviar campos de cabeçalho de trailing para o peer.

Quando `options.waitForTrailers` é definido, o `Http2Stream` não fechará automaticamente quando o quadro `DATA` final for transmitido. O código do usuário deve chamar `http2stream.sendTrailers()` ou `http2stream.close()` para fechar o `Http2Stream`.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```
:::

#### `http2stream.respondWithFD(fd[, headers[, options]])` {#http2streamrespondwithfdfd-headers-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.5.0, v12.19.0 | Permite definir explicitamente os cabeçalhos de data. |
| v12.12.0 | A opção `fd` agora pode ser um `FileHandle`. |
| v10.0.0 | Qualquer descritor de arquivo legível, não necessariamente para um arquivo regular, é suportado agora. |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle) Um descritor de arquivo legível.
- `headers` [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object)
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, o `Http2Stream` emitirá o evento `'wantTrailers'` após o envio do último quadro `DATA`.
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A posição de deslocamento para começar a leitura.
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A quantidade de dados do fd para enviar.

Inicia uma resposta cujos dados são lidos do descritor de arquivo fornecido. Nenhuma validação é realizada no descritor de arquivo fornecido. Se ocorrer um erro ao tentar ler dados usando o descritor de arquivo, o `Http2Stream` será fechado usando um quadro `RST_STREAM` usando o código `INTERNAL_ERROR` padrão.

Quando usado, a interface `Duplex` do objeto `Http2Stream` será fechada automaticamente.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => fs.closeSync(fd));
});
```
:::

A função opcional `options.statCheck` pode ser especificada para dar ao código do usuário a oportunidade de definir cabeçalhos de conteúdo adicionais com base nos detalhes `fs.Stat` do fd fornecido. Se a função `statCheck` for fornecida, o método `http2stream.respondWithFD()` executará uma chamada `fs.fstat()` para coletar detalhes sobre o descritor de arquivo fornecido.

As opções `offset` e `length` podem ser usadas para limitar a resposta a um subconjunto de intervalo específico. Isso pode ser usado, por exemplo, para suportar solicitações HTTP Range.

O descritor de arquivo ou `FileHandle` não é fechado quando o stream é fechado, portanto, ele precisará ser fechado manualmente quando não for mais necessário. Usar o mesmo descritor de arquivo simultaneamente para vários streams não é suportado e pode resultar em perda de dados. Reutilizar um descritor de arquivo após a conclusão de um stream é suportado.

Quando a opção `options.waitForTrailers` está definida, o evento `'wantTrailers'` será emitido imediatamente após enfileirar o último bloco de dados de carga útil a ser enviado. O método `http2stream.sendTrailers()` pode então ser usado para enviar campos de cabeçalho à reboque para o peer.

Quando `options.waitForTrailers` está definido, o `Http2Stream` não será fechado automaticamente quando o quadro `DATA` final for transmitido. O código do usuário *deve* chamar `http2stream.sendTrailers()` ou `http2stream.close()` para fechar o `Http2Stream`.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => fs.closeSync(fd));
});
```
:::


#### `http2stream.respondWithFile(path[, headers[, options]])` {#http2streamrespondwithfilepath-headers-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.5.0, v12.19.0 | Permite definir explicitamente os cabeçalhos de data. |
| v10.0.0 | Qualquer arquivo legível, não necessariamente um arquivo regular, é suportado agora. |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `headers` [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `onError` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função de callback invocada em caso de erro antes do envio.
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, o `Http2Stream` emitirá o evento `'wantTrailers'` após o envio do último frame `DATA`.
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A posição de deslocamento (offset) em que a leitura deve começar.
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A quantidade de dados do fd a serem enviados.

Envia um arquivo regular como resposta. O `path` deve especificar um arquivo regular ou um evento `'error'` será emitido no objeto `Http2Stream`.

Quando usado, a interface `Duplex` do objeto `Http2Stream` será fechada automaticamente.

A função opcional `options.statCheck` pode ser especificada para dar ao código do usuário a oportunidade de definir cabeçalhos de conteúdo adicionais com base nos detalhes `fs.Stat` do arquivo fornecido:

Se ocorrer um erro ao tentar ler os dados do arquivo, o `Http2Stream` será fechado usando um frame `RST_STREAM` com o código `INTERNAL_ERROR` padrão. Se o callback `onError` for definido, ele será chamado. Caso contrário, o stream será destruído.

Exemplo usando um caminho de arquivo:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() pode lançar um erro se o stream tiver sido destruído pelo
    // outro lado.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Realize o tratamento de erro real.
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() pode lançar um erro se o stream tiver sido destruído pelo
    // outro lado.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Realize o tratamento de erro real.
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```
:::

A função `options.statCheck` também pode ser usada para cancelar a operação de envio retornando `false`. Por exemplo, uma solicitação condicional pode verificar os resultados do stat para determinar se o arquivo foi modificado para retornar uma resposta `304` apropriada:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // Verifique o stat aqui...
    stream.respond({ ':status': 304 });
    return false; // Cancela a operação de envio
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // Verifique o stat aqui...
    stream.respond({ ':status': 304 });
    return false; // Cancela a operação de envio
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```
:::

O campo de cabeçalho `content-length` será definido automaticamente.

As opções `offset` e `length` podem ser usadas para limitar a resposta a um subconjunto de intervalo específico. Isso pode ser usado, por exemplo, para suportar solicitações de intervalo HTTP.

A função `options.onError` também pode ser usada para lidar com todos os erros que podem ocorrer antes do início da entrega do arquivo. O comportamento padrão é destruir o stream.

Quando a opção `options.waitForTrailers` é definida, o evento `'wantTrailers'` será emitido imediatamente após enfileirar o último chunk de dados de payload a ser enviado. O método `http2stream.sendTrailers()` pode então ser usado para enviar campos de cabeçalho à reboque (trailing header fields) ao par.

Quando `options.waitForTrailers` é definido, o `Http2Stream` não se fechará automaticamente quando o frame `DATA` final for transmitido. O código do usuário deve chamar `http2stream.sendTrailers()` ou `http2stream.close()` para fechar o `Http2Stream`.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```
:::


### Classe: `Http2Server` {#class-http2server}

**Adicionado em: v8.4.0**

- Estende: [\<net.Server\>](/pt/nodejs/api/net#class-netserver)

Instâncias de `Http2Server` são criadas usando a função `http2.createServer()`. A classe `Http2Server` não é exportada diretamente pelo módulo `node:http2`.

#### Evento: `'checkContinue'` {#event-checkcontinue}

**Adicionado em: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/pt/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/pt/nodejs/api/http2#class-http2http2serverresponse)

Se um ouvinte [`'request'`](/pt/nodejs/api/http2#event-request) for registrado ou [`http2.createServer()`](/pt/nodejs/api/http2#http2createserveroptions-onrequesthandler) receber uma função de callback, o evento `'checkContinue'` será emitido cada vez que uma requisição com um HTTP `Expect: 100-continue` for recebida. Se este evento não for escutado, o servidor responderá automaticamente com o status `100 Continue` conforme apropriado.

Lidar com este evento envolve chamar [`response.writeContinue()`](/pt/nodejs/api/http2#responsewritecontinue) se o cliente deve continuar a enviar o corpo da requisição, ou gerar uma resposta HTTP apropriada (ex: 400 Bad Request) se o cliente não deve continuar a enviar o corpo da requisição.

Quando este evento é emitido e tratado, o evento [`'request'`](/pt/nodejs/api/http2#event-request) não será emitido.

#### Evento: `'connection'` {#event-connection}

**Adicionado em: v8.4.0**

- `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Este evento é emitido quando um novo stream TCP é estabelecido. `socket` é tipicamente um objeto do tipo [`net.Socket`](/pt/nodejs/api/net#class-netsocket). Geralmente, os usuários não desejarão acessar este evento.

Este evento também pode ser emitido explicitamente pelos usuários para injetar conexões no servidor HTTP. Nesse caso, qualquer stream [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) pode ser passado.

#### Evento: `'request'` {#event-request}

**Adicionado em: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/pt/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/pt/nodejs/api/http2#class-http2http2serverresponse)

Emitido cada vez que há uma requisição. Pode haver múltiplas requisições por sessão. Veja a [API de Compatibilidade](/pt/nodejs/api/http2#compatibility-api).


#### Evento: `'session'` {#event-session}

**Adicionado em: v8.4.0**

- `session` [\<ServerHttp2Session\>](/pt/nodejs/api/http2#class-serverhttp2session)

O evento `'session'` é emitido quando uma nova `Http2Session` é criada pelo `Http2Server`.

#### Evento: `'sessionError'` {#event-sessionerror}

**Adicionado em: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/pt/nodejs/api/http2#class-serverhttp2session)

O evento `'sessionError'` é emitido quando um evento `'error'` é emitido por um objeto `Http2Session` associado ao `Http2Server`.

#### Evento: `'stream'` {#event-stream_1}

**Adicionado em: v8.4.0**

- `stream` [\<Http2Stream\>](/pt/nodejs/api/http2#class-http2stream) Uma referência ao stream
- `headers` [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object) Um objeto descrevendo os cabeçalhos
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) As flags numéricas associadas
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array contendo os nomes de cabeçalho brutos seguidos por seus respectivos valores.

O evento `'stream'` é emitido quando um evento `'stream'` foi emitido por uma `Http2Session` associada ao servidor.

Veja também o evento `'stream'` da [`Http2Session`](/pt/nodejs/api/http2#event-stream).

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const server = createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const server = http2.createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### Evento: `'timeout'` {#event-timeout_2}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.0.0 | O timeout padrão foi alterado de 120s para 0 (sem timeout). |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

O evento `'timeout'` é emitido quando não há atividade no Servidor por um determinado número de milissegundos definido usando `http2server.setTimeout()`. **Padrão:** 0 (sem timeout)

#### `server.close([callback])` {#serverclosecallback}

**Adicionado em: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Impede que o servidor estabeleça novas sessões. Isso não impede que novos fluxos de solicitação sejam criados devido à natureza persistente das sessões HTTP/2. Para desligar o servidor normalmente, chame [`http2session.close()`](/pt/nodejs/api/http2#http2sessionclosecallback) em todas as sessões ativas.

Se `callback` for fornecido, ele não será invocado até que todas as sessões ativas tenham sido fechadas, embora o servidor já tenha parado de permitir novas sessões. Consulte [`net.Server.close()`](/pt/nodejs/api/net#serverclosecallback) para obter mais detalhes.

#### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Adicionado em: v20.4.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Chama [`server.close()`](/pt/nodejs/api/http2#serverclosecallback) e retorna uma promise que é cumprida quando o servidor é fechado.

#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v13.0.0 | O timeout padrão foi alterado de 120s para 0 (sem timeout). |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** 0 (sem timeout)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<Http2Server\>](/pt/nodejs/api/http2#class-http2server)

Usado para definir o valor de timeout para solicitações do servidor http2 e define uma função de callback que é chamada quando não há atividade no `Http2Server` após `msecs` milissegundos.

O callback fornecido é registrado como um listener no evento `'timeout'`.

Caso `callback` não seja uma função, um novo erro `ERR_INVALID_ARG_TYPE` será lançado.


#### `server.timeout` {#servertimeout}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.0.0 | O tempo limite padrão mudou de 120s para 0 (sem tempo limite). |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tempo limite em milissegundos. **Padrão:** 0 (sem tempo limite)

O número de milissegundos de inatividade antes que um soquete seja presumido como tendo expirado.

Um valor de `0` desativará o comportamento de tempo limite nas conexões de entrada.

A lógica de tempo limite do soquete é configurada na conexão, portanto, alterar esse valor afeta apenas as novas conexões com o servidor, não as conexões existentes.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings}

**Adicionado em: v15.1.0, v14.17.0**

- `settings` [\<Objeto de Configurações HTTP/2\>](/pt/nodejs/api/http2#settings-object)

Usado para atualizar o servidor com as configurações fornecidas.

Lança `ERR_HTTP2_INVALID_SETTING_VALUE` para valores de `settings` inválidos.

Lança `ERR_INVALID_ARG_TYPE` para argumento `settings` inválido.

### Classe: `Http2SecureServer` {#class-http2secureserver}

**Adicionado em: v8.4.0**

- Estende: [\<tls.Server\>](/pt/nodejs/api/tls#class-tlsserver)

As instâncias de `Http2SecureServer` são criadas usando a função `http2.createSecureServer()`. A classe `Http2SecureServer` não é exportada diretamente pelo módulo `node:http2`.

#### Evento: `'checkContinue'` {#event-checkcontinue_1}

**Adicionado em: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/pt/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/pt/nodejs/api/http2#class-http2http2serverresponse)

Se um ouvinte [`'request'`](/pt/nodejs/api/http2#event-request) for registrado ou [`http2.createSecureServer()`](/pt/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) for fornecido com uma função de retorno de chamada, o evento `'checkContinue'` é emitido cada vez que uma solicitação com um HTTP `Expect: 100-continue` é recebida. Se este evento não for escutado, o servidor responderá automaticamente com um status `100 Continue` conforme apropriado.

Lidar com este evento envolve chamar [`response.writeContinue()`](/pt/nodejs/api/http2#responsewritecontinue) se o cliente deve continuar a enviar o corpo da solicitação ou gerar uma resposta HTTP apropriada (por exemplo, 400 Bad Request) se o cliente não deve continuar a enviar o corpo da solicitação.

Quando este evento é emitido e tratado, o evento [`'request'`](/pt/nodejs/api/http2#event-request) não será emitido.


#### Evento: `'connection'` {#event-connection_1}

**Adicionado em: v8.4.0**

- `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Este evento é emitido quando um novo fluxo TCP é estabelecido, antes que o handshake TLS comece. `socket` é tipicamente um objeto do tipo [`net.Socket`](/pt/nodejs/api/net#class-netsocket). Normalmente, os usuários não desejarão acessar este evento.

Este evento também pode ser explicitamente emitido por usuários para injetar conexões no servidor HTTP. Nesse caso, qualquer fluxo [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) pode ser passado.

#### Evento: `'request'` {#event-request_1}

**Adicionado em: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/pt/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/pt/nodejs/api/http2#class-http2http2serverresponse)

Emitido cada vez que há uma requisição. Pode haver múltiplas requisições por sessão. Veja a [API de Compatibilidade](/pt/nodejs/api/http2#compatibility-api).

#### Evento: `'session'` {#event-session_1}

**Adicionado em: v8.4.0**

- `session` [\<ServerHttp2Session\>](/pt/nodejs/api/http2#class-serverhttp2session)

O evento `'session'` é emitido quando uma nova `Http2Session` é criada pelo `Http2SecureServer`.

#### Evento: `'sessionError'` {#event-sessionerror_1}

**Adicionado em: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/pt/nodejs/api/http2#class-serverhttp2session)

O evento `'sessionError'` é emitido quando um evento `'error'` é emitido por um objeto `Http2Session` associado ao `Http2SecureServer`.

#### Evento: `'stream'` {#event-stream_2}

**Adicionado em: v8.4.0**

- `stream` [\<Http2Stream\>](/pt/nodejs/api/http2#class-http2stream) Uma referência ao stream
- `headers` [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object) Um objeto descrevendo os cabeçalhos
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Os sinalizadores numéricos associados
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array contendo os nomes dos cabeçalhos brutos seguidos por seus respectivos valores.

O evento `'stream'` é emitido quando um evento `'stream'` foi emitido por uma `Http2Session` associada ao servidor.

Veja também o evento `'stream'` da [`Http2Session`](/pt/nodejs/api/http2#event-stream).

::: code-group
```js [ESM]
import { createSecureServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const options = getOptionsSomehow();

const server = createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const options = getOptionsSomehow();

const server = http2.createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### Evento: `'timeout'` {#event-timeout_3}

**Adicionado em: v8.4.0**

O evento `'timeout'` é emitido quando não há atividade no Servidor por um determinado número de milissegundos definido usando `http2secureServer.setTimeout()`. **Padrão:** 2 minutos.

#### Evento: `'unknownProtocol'` {#event-unknownprotocol}

::: info [Histórico]
| Versão  | Mudanças                                                                                                                                                                                                                                                                                                                           |
| :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v19.0.0 | Este evento só será emitido se o cliente não transmitir uma extensão ALPN durante o handshake TLS.                                                                                                                                                                                                                                   |
| v8.4.0  | Adicionado em: v8.4.0                                                                                                                                                                                                                                                                                                              |
:::

- `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

O evento `'unknownProtocol'` é emitido quando um cliente que se conecta não consegue negociar um protocolo permitido (ou seja, HTTP/2 ou HTTP/1.1). O manipulador de eventos recebe o socket para tratamento. Se nenhum ouvinte for registrado para este evento, a conexão será encerrada. Um timeout pode ser especificado usando a opção `'unknownProtocolTimeout'` passada para [`http2.createSecureServer()`](/pt/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler).

Em versões anteriores do Node.js, este evento seria emitido se `allowHTTP1` fosse `false` e, durante o handshake TLS, o cliente não enviasse uma extensão ALPN ou enviasse uma extensão ALPN que não incluísse HTTP/2 (`h2`). Versões mais recentes do Node.js só emitem este evento se `allowHTTP1` for `false` e o cliente não enviar uma extensão ALPN. Se o cliente enviar uma extensão ALPN que não inclua HTTP/2 (ou HTTP/1.1 se `allowHTTP1` for `true`), o handshake TLS falhará e nenhuma conexão segura será estabelecida.

Consulte a [API de Compatibilidade](/pt/nodejs/api/http2#compatibility-api).

#### `server.close([callback])` {#serverclosecallback_1}

**Adicionado em: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Impede que o servidor estabeleça novas sessões. Isso não impede que novos fluxos de requisição sejam criados devido à natureza persistente das sessões HTTP/2. Para desligar o servidor normalmente, chame [`http2session.close()`](/pt/nodejs/api/http2#http2sessionclosecallback) em todas as sessões ativas.

Se `callback` for fornecido, ele não será invocado até que todas as sessões ativas tenham sido fechadas, embora o servidor já tenha parado de permitir novas sessões. Consulte [`tls.Server.close()`](/pt/nodejs/api/tls#serverclosecallback) para obter mais detalhes.


#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback_1}

::: info [Histórico]
| Versão | Alterações |
|---|---|
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `120000` (2 minutos)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<Http2SecureServer\>](/pt/nodejs/api/http2#class-http2secureserver)

Usado para definir o valor de timeout para solicitações de servidor seguro http2 e define uma função de callback que é chamada quando não há atividade no `Http2SecureServer` após `msecs` milissegundos.

O callback fornecido é registrado como um listener no evento `'timeout'`.

Caso `callback` não seja uma função, um novo erro `ERR_INVALID_ARG_TYPE` será lançado.

#### `server.timeout` {#servertimeout_1}

::: info [Histórico]
| Versão | Alterações |
|---|---|
| v13.0.0 | O timeout padrão mudou de 120s para 0 (sem timeout). |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Timeout em milissegundos. **Padrão:** 0 (sem timeout)

O número de milissegundos de inatividade antes que um socket seja presumido como tendo expirado.

Um valor de `0` desativará o comportamento de timeout em conexões de entrada.

A lógica de timeout do socket é configurada na conexão, portanto, alterar este valor afeta apenas novas conexões com o servidor, não as conexões existentes.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings_1}

**Adicionado em: v15.1.0, v14.17.0**

- `settings` [\<Objeto de Configurações HTTP/2\>](/pt/nodejs/api/http2#settings-object)

Usado para atualizar o servidor com as configurações fornecidas.

Lança `ERR_HTTP2_INVALID_SETTING_VALUE` para valores `settings` inválidos.

Lança `ERR_INVALID_ARG_TYPE` para argumento `settings` inválido.

### `http2.createServer([options][, onRequestHandler])` {#http2createserveroptions-onrequesthandler}

::: info [Histórico]
| Versão | Alterações |
|---|---|
| v23.0.0 | Adicionado `streamResetBurst` e `streamResetRate`. |
| v13.0.0 | O `PADDING_STRATEGY_CALLBACK` foi tornado equivalente ao fornecimento de `PADDING_STRATEGY_ALIGNED` e `selectPadding` foi removido. |
| v13.3.0, v12.16.0 | Adicionada a opção `maxSessionRejectedStreams` com um padrão de 100. |
| v13.3.0, v12.16.0 | Adicionada a opção `maxSessionInvalidFrames` com um padrão de 1000. |
| v12.4.0 | O parâmetro `options` agora suporta as opções `net.createServer()`. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Adicionada a opção `unknownProtocolTimeout` com um padrão de 10000. |
| v14.4.0, v12.18.0, v10.21.0 | Adicionada a opção `maxSettings` com um padrão de 32. |
| v9.6.0 | Adicionada a opção `Http1IncomingMessage` e `Http1ServerResponse`. |
| v8.9.3 | Adicionada a opção `maxOutstandingPings` com um limite padrão de 10. |
| v8.9.3 | Adicionada a opção `maxHeaderListPairs` com um limite padrão de 128 pares de cabeçalho. |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o tamanho máximo da tabela dinâmica para deflação de campos de cabeçalho. **Padrão:** `4Kib`.
  - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de entradas de configurações por quadro `SETTINGS`. O valor mínimo permitido é `1`. **Padrão:** `32`.
  - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a memória máxima que o `Http2Session` tem permissão para usar. O valor é expresso em número de megabytes, por exemplo, `1` igual a 1 megabyte. O valor mínimo permitido é `1`. Este é um limite baseado em crédito, os `Http2Stream`s existentes podem fazer com que este limite seja excedido, mas novas instâncias de `Http2Stream` serão rejeitadas enquanto este limite for excedido. O número atual de sessões `Http2Stream`, o uso atual de memória das tabelas de compressão de cabeçalho, os dados atuais enfileirados para serem enviados e os quadros `PING` e `SETTINGS` não reconhecidos são todos contados para o limite atual. **Padrão:** `10`.
  - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de entradas de cabeçalho. Isso é semelhante a [`server.maxHeadersCount`](/pt/nodejs/api/http#servermaxheaderscount) ou [`request.maxHeadersCount`](/pt/nodejs/api/http#requestmaxheaderscount) no módulo `node:http`. O valor mínimo é `4`. **Padrão:** `128`.
  - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de pings pendentes e não reconhecidos. **Padrão:** `10`.
  - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o tamanho máximo permitido para um bloco de cabeçalhos serializado e compactado. As tentativas de enviar cabeçalhos que excedam este limite resultarão em um evento `'frameError'` sendo emitido e o stream sendo fechado e destruído. Embora isso defina o tamanho máximo permitido para todo o bloco de cabeçalhos, `nghttp2` (a biblioteca http2 interna) tem um limite de `65536` para cada par chave/valor descompactado.
  - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A estratégia usada para determinar a quantidade de padding a ser usada para quadros `HEADERS` e `DATA`. **Padrão:** `http2.constants.PADDING_STRATEGY_NONE`. O valor pode ser um de:
    - `http2.constants.PADDING_STRATEGY_NONE`: Nenhum padding é aplicado.
    - `http2.constants.PADDING_STRATEGY_MAX`: A quantidade máxima de padding, determinada pela implementação interna, é aplicada.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: Tenta aplicar padding suficiente para garantir que o comprimento total do quadro, incluindo o cabeçalho de 9 bytes, seja um múltiplo de 8. Para cada quadro, há um número máximo permitido de bytes de padding que é determinado pelo estado e configurações atuais do controle de fluxo. Se este máximo for menor do que a quantidade calculada necessária para garantir o alinhamento, o máximo é usado e o comprimento total do quadro não é necessariamente alinhado em 8 bytes.

  - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de streams simultâneos para o peer remoto como se um quadro `SETTINGS` tivesse sido recebido. Será substituído se o peer remoto definir seu próprio valor para `maxConcurrentStreams`. **Padrão:** `100`.
  - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de quadros inválidos que serão tolerados antes que a sessão seja fechada. **Padrão:** `1000`.
  - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de streams rejeitados na criação que serão tolerados antes que a sessão seja fechada. Cada rejeição está associada a um erro `NGHTTP2_ENHANCE_YOUR_CALM` que deve dizer ao peer para não abrir mais streams, continuar a abrir streams é, portanto, considerado um sinal de um peer com mau comportamento. **Padrão:** `100`.
  - `settings` [\<Objeto de Configurações HTTP/2\>](/pt/nodejs/api/http2#settings-object) As configurações iniciais a serem enviadas para o peer remoto na conexão.
  - `streamResetBurst` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) e `streamResetRate` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o limite de taxa para o reset de stream de entrada (quadro RST_STREAM). Ambas as configurações devem ser definidas para ter algum efeito e o padrão é 1000 e 33, respectivamente.
  - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) O array de valores inteiros determina os tipos de configurações, que são incluídos na propriedade `CustomSettings` do remoteSettings recebido. Consulte a propriedade `CustomSettings` do objeto `Http2Settings` para obter mais informações sobre os tipos de configurações permitidos.
  - `Http1IncomingMessage` [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage) Especifica a classe `IncomingMessage` a ser usada para fallback HTTP/1. Útil para estender o `http.IncomingMessage` original. **Padrão:** `http.IncomingMessage`.
  - `Http1ServerResponse` [\<http.ServerResponse\>](/pt/nodejs/api/http#class-httpserverresponse) Especifica a classe `ServerResponse` a ser usada para fallback HTTP/1. Útil para estender o `http.ServerResponse` original. **Padrão:** `http.ServerResponse`.
  - `Http2ServerRequest` [\<http2.Http2ServerRequest\>](/pt/nodejs/api/http2#class-http2http2serverrequest) Especifica a classe `Http2ServerRequest` a ser usada. Útil para estender o `Http2ServerRequest` original. **Padrão:** `Http2ServerRequest`.
  - `Http2ServerResponse` [\<http2.Http2ServerResponse\>](/pt/nodejs/api/http2#class-http2http2serverresponse) Especifica a classe `Http2ServerResponse` a ser usada. Útil para estender o `Http2ServerResponse` original. **Padrão:** `Http2ServerResponse`.
  - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica um timeout em milissegundos que um servidor deve esperar quando um [`'unknownProtocol'`](/pt/nodejs/api/http2#event-unknownprotocol) é emitido. Se o socket não tiver sido destruído até esse momento, o servidor o destruirá. **Padrão:** `10000`.
  - ...: Qualquer opção [`net.createServer()`](/pt/nodejs/api/net#netcreateserveroptions-connectionlistener) pode ser fornecida.

- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Consulte [API de Compatibilidade](/pt/nodejs/api/http2#compatibility-api)
- Retorna: [\<Http2Server\>](/pt/nodejs/api/http2#class-http2server)

Retorna uma instância `net.Server` que cria e gerencia instâncias `Http2Session`.

Como não há navegadores conhecidos que suportem [HTTP/2 não criptografado](https://http2.github.io/faq/#does-http2-require-encryption), o uso de [`http2.createSecureServer()`](/pt/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) é necessário ao se comunicar com clientes de navegador.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// Cria um servidor HTTP/2 não criptografado.
// Como não há navegadores conhecidos que suportem
// HTTP/2 não criptografado, o uso de `createSecureServer()`
// é necessário ao se comunicar com clientes de navegador.
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// Cria um servidor HTTP/2 não criptografado.
// Como não há navegadores conhecidos que suportem
// HTTP/2 não criptografado, o uso de `http2.createSecureServer()`
// é necessário ao se comunicar com clientes de navegador.
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::


### `http2.createSecureServer(options[, onRequestHandler])` {#http2createsecureserveroptions-onrequesthandler}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.0.0 | O `PADDING_STRATEGY_CALLBACK` foi tornado equivalente a fornecer `PADDING_STRATEGY_ALIGNED` e `selectPadding` foi removido. |
| v13.3.0, v12.16.0 | Adicionada a opção `maxSessionRejectedStreams` com um padrão de 100. |
| v13.3.0, v12.16.0 | Adicionada a opção `maxSessionInvalidFrames` com um padrão de 1000. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Adicionada a opção `unknownProtocolTimeout` com um padrão de 10000. |
| v14.4.0, v12.18.0, v10.21.0 | Adicionada a opção `maxSettings` com um padrão de 32. |
| v10.12.0 | Adicionada a opção `origins` para enviar automaticamente um frame `ORIGIN` na inicialização do `Http2Session`. |
| v8.9.3 | Adicionada a opção `maxOutstandingPings` com um limite padrão de 10. |
| v8.9.3 | Adicionada a opção `maxHeaderListPairs` com um limite padrão de 128 pares de cabeçalho. |
| v8.4.0 | Adicionada em: v8.4.0 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHTTP1` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) As conexões de cliente de entrada que não suportam HTTP/2 serão rebaixadas para HTTP/1.x quando definido como `true`. Consulte o evento [`'unknownProtocol'`](/pt/nodejs/api/http2#event-unknownprotocol). Consulte [Negociação ALPN](/pt/nodejs/api/http2#alpn-negotiation). **Padrão:** `false`.
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o tamanho máximo da tabela dinâmica para deflacionar campos de cabeçalho. **Padrão:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de entradas de configurações por frame `SETTINGS`. O valor mínimo permitido é `1`. **Padrão:** `32`.
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a memória máxima que o `Http2Session` tem permissão para usar. O valor é expresso em termos de número de megabytes, por exemplo, `1` igual a 1 megabyte. O valor mínimo permitido é `1`. Este é um limite baseado em crédito, `Http2Stream`s existentes podem fazer com que este limite seja excedido, mas novas instâncias de `Http2Stream` serão rejeitadas enquanto este limite for excedido. O número atual de sessões `Http2Stream`, o uso atual de memória das tabelas de compressão de cabeçalho, os dados atuais enfileirados para serem enviados e os frames `PING` e `SETTINGS` não reconhecidos são todos contados para o limite atual. **Padrão:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de entradas de cabeçalho. Isso é semelhante a [`server.maxHeadersCount`](/pt/nodejs/api/http#servermaxheaderscount) ou [`request.maxHeadersCount`](/pt/nodejs/api/http#requestmaxheaderscount) no módulo `node:http`. O valor mínimo é `4`. **Padrão:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de pings pendentes e não reconhecidos. **Padrão:** `10`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o tamanho máximo permitido para um bloco de cabeçalhos serializado e compactado. Tentativas de enviar cabeçalhos que excedam este limite resultarão na emissão de um evento `'frameError'` e no fechamento e destruição do stream.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Estratégia usada para determinar a quantidade de padding a ser usada para frames `HEADERS` e `DATA`. **Padrão:** `http2.constants.PADDING_STRATEGY_NONE`. O valor pode ser um de:
    - `http2.constants.PADDING_STRATEGY_NONE`: Nenhum padding é aplicado.
    - `http2.constants.PADDING_STRATEGY_MAX`: A quantidade máxima de padding, determinada pela implementação interna, é aplicada.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: Tenta aplicar padding suficiente para garantir que o comprimento total do frame, incluindo o cabeçalho de 9 bytes, seja um múltiplo de 8. Para cada frame, há um número máximo permitido de bytes de padding que é determinado pelo estado e configurações atuais do controle de fluxo. Se este máximo for menor que a quantidade calculada necessária para garantir o alinhamento, o máximo é usado e o comprimento total do frame não é necessariamente alinhado em 8 bytes.

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de streams simultâneos para o peer remoto como se um frame `SETTINGS` tivesse sido recebido. Será substituído se o peer remoto definir seu próprio valor para `maxConcurrentStreams`. **Padrão:** `100`.
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de frames inválidos que serão tolerados antes que a sessão seja fechada. **Padrão:** `1000`.
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de streams rejeitados após a criação que serão tolerados antes que a sessão seja fechada. Cada rejeição está associada a um erro `NGHTTP2_ENHANCE_YOUR_CALM` que deve dizer ao peer para não abrir mais streams, continuar a abrir streams é, portanto, considerado um sinal de um peer com mau comportamento. **Padrão:** `100`.
    - `settings` [\<Objeto de Configurações HTTP/2\>](/pt/nodejs/api/http2#settings-object) As configurações iniciais a serem enviadas ao peer remoto na conexão.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) O array de valores inteiros determina os tipos de configurações, que são incluídos na propriedade `customSettings` do remoteSettings recebido. Consulte a propriedade `customSettings` do objeto `Http2Settings` para obter mais informações sobre os tipos de configuração permitidos.
    - ...: Qualquer opção de [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) pode ser fornecida. Para servidores, as opções de identidade (`pfx` ou `key`/`cert`) são geralmente necessárias.
    - `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um array de strings de origem para enviar dentro de um frame `ORIGIN` imediatamente após a criação de um novo `Http2Session` do servidor.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica um tempo limite em milissegundos que um servidor deve esperar quando um evento [`'unknownProtocol'`](/pt/nodejs/api/http2#event-unknownprotocol) é emitido. Se o socket não foi destruído até esse momento, o servidor o destruirá. **Padrão:** `10000`.

- `onRequestHandler` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Consulte [API de Compatibilidade](/pt/nodejs/api/http2#compatibility-api)
- Retorna: [\<Http2SecureServer\>](/pt/nodejs/api/http2#class-http2secureserver)

Retorna uma instância de `tls.Server` que cria e gerencia instâncias de `Http2Session`.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),
};

// Create a secure HTTP/2 server
const server = createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
};

// Create a secure HTTP/2 server
const server = http2.createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::


### `http2.connect(authority[, options][, listener])` {#http2connectauthority-options-listener}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.0.0 | O `PADDING_STRATEGY_CALLBACK` foi tornado equivalente a fornecer `PADDING_STRATEGY_ALIGNED` e `selectPadding` foi removido. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Adicionada a opção `unknownProtocolTimeout` com um padrão de 10000. |
| v14.4.0, v12.18.0, v10.21.0 | Adicionada a opção `maxSettings` com um padrão de 32. |
| v8.9.3 | Adicionada a opção `maxOutstandingPings` com um limite padrão de 10. |
| v8.9.3 | Adicionada a opção `maxHeaderListPairs` com um limite padrão de 128 pares de cabeçalho. |
| v8.4.0 | Adicionada em: v8.4.0 |
:::

- `authority` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) O servidor HTTP/2 remoto ao qual se conectar. Deve estar no formato de um URL mínimo e válido com o prefixo `http://` ou `https://`, nome do host e porta IP (se uma porta não padrão for usada). Userinfo (ID de usuário e senha), caminho, string de consulta e detalhes de fragmento no URL serão ignorados.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o tamanho máximo da tabela dinâmica para desinflar os campos de cabeçalho. **Padrão:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de entradas de configurações por quadro `SETTINGS`. O valor mínimo permitido é `1`. **Padrão:** `32`.
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a memória máxima que a `Http2Session` tem permissão para usar. O valor é expresso em termos de número de megabytes, por exemplo, `1` é igual a 1 megabyte. O valor mínimo permitido é `1`. Este é um limite baseado em crédito, os `Http2Stream`s existentes podem fazer com que este limite seja excedido, mas novas instâncias de `Http2Stream` serão rejeitadas enquanto este limite for excedido. O número atual de sessões `Http2Stream`, o uso atual de memória das tabelas de compressão de cabeçalho, os dados atuais enfileirados para serem enviados e os quadros `PING` e `SETTINGS` não reconhecidos são todos contados para o limite atual. **Padrão:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de entradas de cabeçalho. Isso é semelhante a [`server.maxHeadersCount`](/pt/nodejs/api/http#servermaxheaderscount) ou [`request.maxHeadersCount`](/pt/nodejs/api/http#requestmaxheaderscount) no módulo `node:http`. O valor mínimo é `1`. **Padrão:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de pings pendentes não reconhecidos. **Padrão:** `10`.
    - `maxReservedRemoteStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de fluxos de push reservados que o cliente aceitará a qualquer momento. Depois que o número atual de fluxos de push atualmente reservados exceder esse limite, novos fluxos de push enviados pelo servidor serão automaticamente rejeitados. O valor mínimo permitido é 0. O valor máximo permitido é 2-1. Um valor negativo define esta opção para o valor máximo permitido. **Padrão:** `200`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o tamanho máximo permitido para um bloco de cabeçalhos serializado e compactado. As tentativas de enviar cabeçalhos que excedam este limite resultarão na emissão de um evento `'frameError'` e no fechamento e destruição do fluxo.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Estratégia usada para determinar a quantidade de preenchimento a ser usada para quadros `HEADERS` e `DATA`. **Padrão:** `http2.constants.PADDING_STRATEGY_NONE`. O valor pode ser um de:
    - `http2.constants.PADDING_STRATEGY_NONE`: Nenhum preenchimento é aplicado.
    - `http2.constants.PADDING_STRATEGY_MAX`: A quantidade máxima de preenchimento, determinada pela implementação interna, é aplicada.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: Tenta aplicar preenchimento suficiente para garantir que o comprimento total do quadro, incluindo o cabeçalho de 9 bytes, seja um múltiplo de 8. Para cada quadro, há um número máximo permitido de bytes de preenchimento que é determinado pelo estado e configurações atuais do controle de fluxo. Se este máximo for menor do que a quantidade calculada necessária para garantir o alinhamento, o máximo é usado e o comprimento total do quadro não é necessariamente alinhado em 8 bytes.


    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o número máximo de fluxos simultâneos para o peer remoto como se um quadro `SETTINGS` tivesse sido recebido. Será substituído se o peer remoto definir seu próprio valor para `maxConcurrentStreams`. **Padrão:** `100`.
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O protocolo para conectar, se não estiver definido na `authority`. O valor pode ser `'http:'` ou `'https:'`. **Padrão:** `'https:'`
    - `settings` [\<Objeto de Configurações HTTP/2\>](/pt/nodejs/api/http2#settings-object) As configurações iniciais a serem enviadas ao peer remoto após a conexão.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) O array de valores inteiros determina os tipos de configurações, que são incluídos na propriedade `CustomSettings` das remoteSettings recebidas. Consulte a propriedade `CustomSettings` do objeto `Http2Settings` para obter mais informações sobre os tipos de configuração permitidos.
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Um callback opcional que recebe a instância `URL` passada para `connect` e o objeto `options`, e retorna qualquer stream [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) que deve ser usado como a conexão para esta sessão.
    - ...: Quaisquer opções [`net.connect()`](/pt/nodejs/api/net#netconnect) ou [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback) podem ser fornecidas.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica um timeout em milissegundos que um servidor deve esperar quando um evento [`'unknownProtocol'`](/pt/nodejs/api/http2#event-unknownprotocol) é emitido. Se o socket não tiver sido destruído até esse momento, o servidor o destruirá. **Padrão:** `10000`.


- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Será registrado como um listener único do evento [`'connect'`](/pt/nodejs/api/http2#event-connect).
- Retorna: [\<ClientHttp2Session\>](/pt/nodejs/api/http2#class-clienthttp2session)

Retorna uma instância de `ClientHttp2Session`.


::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost:1234');

/* Use o cliente */

client.close();
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost:1234');

/* Use o cliente */

client.close();
```
:::


### `http2.constants` {#http2constants}

**Adicionado em: v8.4.0**

#### Códigos de erro para `RST_STREAM` e `GOAWAY` {#error-codes-for-rst_stream-and-goaway}

| Valor | Nome | Constante |
| --- | --- | --- |
| `0x00` | Sem Erro | `http2.constants.NGHTTP2_NO_ERROR` |
| `0x01` | Erro de Protocolo | `http2.constants.NGHTTP2_PROTOCOL_ERROR` |
| `0x02` | Erro Interno | `http2.constants.NGHTTP2_INTERNAL_ERROR` |
| `0x03` | Erro de Controle de Fluxo | `http2.constants.NGHTTP2_FLOW_CONTROL_ERROR` |
| `0x04` | Tempo Limite de Configurações | `http2.constants.NGHTTP2_SETTINGS_TIMEOUT` |
| `0x05` | Stream Fechado | `http2.constants.NGHTTP2_STREAM_CLOSED` |
| `0x06` | Erro de Tamanho de Frame | `http2.constants.NGHTTP2_FRAME_SIZE_ERROR` |
| `0x07` | Stream Recusado | `http2.constants.NGHTTP2_REFUSED_STREAM` |
| `0x08` | Cancelar | `http2.constants.NGHTTP2_CANCEL` |
| `0x09` | Erro de Compressão | `http2.constants.NGHTTP2_COMPRESSION_ERROR` |
| `0x0a` | Erro de Conexão | `http2.constants.NGHTTP2_CONNECT_ERROR` |
| `0x0b` | Acalme-se | `http2.constants.NGHTTP2_ENHANCE_YOUR_CALM` |
| `0x0c` | Segurança Inadequada | `http2.constants.NGHTTP2_INADEQUATE_SECURITY` |
| `0x0d` | HTTP/1.1 Requerido | `http2.constants.NGHTTP2_HTTP_1_1_REQUIRED` |
O evento `'timeout'` é emitido quando não há atividade no Servidor por um determinado número de milissegundos definido usando `http2server.setTimeout()`.

### `http2.getDefaultSettings()` {#http2getdefaultsettings}

**Adicionado em: v8.4.0**

- Retorna: [\<Objeto de Configurações HTTP/2\>](/pt/nodejs/api/http2#settings-object)

Retorna um objeto contendo as configurações padrão para uma instância de `Http2Session`. Este método retorna uma nova instância de objeto cada vez que é chamado, portanto, as instâncias retornadas podem ser modificadas com segurança para uso.

### `http2.getPackedSettings([settings])` {#http2getpackedsettingssettings}

**Adicionado em: v8.4.0**

- `settings` [\<Objeto de Configurações HTTP/2\>](/pt/nodejs/api/http2#settings-object)
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Retorna uma instância de `Buffer` contendo a representação serializada das configurações HTTP/2 fornecidas, conforme especificado na especificação [HTTP/2](https://tools.ietf.org/html/rfc7540). Isso se destina ao uso com o campo de cabeçalho `HTTP2-Settings`.



::: code-group
```js [ESM]
import { getPackedSettings } from 'node:http2';

const packed = getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Imprime: AAIAAAAA
```

```js [CJS]
const http2 = require('node:http2');

const packed = http2.getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Imprime: AAIAAAAA
```
:::


### `http2.getUnpackedSettings(buf)` {#http2getunpackedsettingsbuf}

**Adicionado em: v8.4.0**

- `buf` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) As configurações compactadas.
- Retorna: [\<Objeto de Configurações HTTP/2\>](/pt/nodejs/api/http2#settings-object)

Retorna um [Objeto de Configurações HTTP/2](/pt/nodejs/api/http2#settings-object) contendo as configurações desserializadas do `Buffer` fornecido, conforme gerado por `http2.getPackedSettings()`.

### `http2.performServerHandshake(socket[, options])` {#http2performserverhandshakesocket-options}

**Adicionado em: v21.7.0, v20.12.0**

- `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - ...: Qualquer opção [`http2.createServer()`](/pt/nodejs/api/http2#http2createserveroptions-onrequesthandler) pode ser fornecida.


- Retorna: [\<ServerHttp2Session\>](/pt/nodejs/api/http2#class-serverhttp2session)

Cria uma sessão de servidor HTTP/2 a partir de um socket existente.

### `http2.sensitiveHeaders` {#http2sensitiveheaders}

**Adicionado em: v15.0.0, v14.18.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

Este símbolo pode ser definido como uma propriedade no objeto de cabeçalhos HTTP/2 com um valor de array para fornecer uma lista de cabeçalhos considerados sensíveis. Veja [Cabeçalhos sensíveis](/pt/nodejs/api/http2#sensitive-headers) para mais detalhes.

### Objeto de cabeçalhos {#headers-object}

Os cabeçalhos são representados como propriedades próprias em objetos JavaScript. As chaves de propriedade serão serializadas em minúsculas. Os valores de propriedade devem ser strings (se não forem, serão convertidos em strings) ou um `Array` de strings (para enviar mais de um valor por campo de cabeçalho).

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'ABC': ['has', 'more', 'than', 'one', 'value'],
};

stream.respond(headers);
```
Objetos de cabeçalho passados para funções de callback terão um protótipo `null`. Isso significa que métodos normais de objetos JavaScript, como `Object.prototype.toString()` e `Object.prototype.hasOwnProperty()` não funcionarão.

Para cabeçalhos de entrada:

- O cabeçalho `:status` é convertido para `number`.
- Duplicatas de `:status`, `:method`, `:authority`, `:scheme`, `:path`, `:protocol`, `age`, `authorization`, `access-control-allow-credentials`, `access-control-max-age`, `access-control-request-method`, `content-encoding`, `content-language`, `content-length`, `content-location`, `content-md5`, `content-range`, `content-type`, `date`, `dnt`, `etag`, `expires`, `from`, `host`, `if-match`, `if-modified-since`, `if-none-match`, `if-range`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `range`, `referer`,`retry-after`, `tk`, `upgrade-insecure-requests`, `user-agent` ou `x-content-type-options` são descartadas.
- `set-cookie` é sempre um array. Duplicatas são adicionadas ao array.
- Para cabeçalhos `cookie` duplicados, os valores são unidos com '; '.
- Para todos os outros cabeçalhos, os valores são unidos com ', '.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```
:::


#### Cabeçalhos Sensíveis {#sensitive-headers}

Os cabeçalhos HTTP2 podem ser marcados como sensíveis, o que significa que o algoritmo de compressão de cabeçalhos HTTP/2 nunca os indexará. Isso pode fazer sentido para valores de cabeçalho com baixa entropia e que podem ser considerados valiosos para um invasor, por exemplo, `Cookie` ou `Authorization`. Para conseguir isso, adicione o nome do cabeçalho à propriedade `[http2.sensitiveHeaders]` como um array:

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'cookie': 'some-cookie',
  'other-sensitive-header': 'very secret data',
  [http2.sensitiveHeaders]: ['cookie', 'other-sensitive-header'],
};

stream.respond(headers);
```
Para alguns cabeçalhos, como `Authorization` e cabeçalhos `Cookie` curtos, esta flag é definida automaticamente.

Esta propriedade também é definida para cabeçalhos recebidos. Ela conterá os nomes de todos os cabeçalhos marcados como sensíveis, incluindo aqueles marcados dessa forma automaticamente.

### Objeto de Configurações {#settings-object}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v12.12.0 | A configuração `maxConcurrentStreams` é mais rigorosa. |
| v8.9.3 | A configuração `maxHeaderListSize` agora é estritamente aplicada. |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

As APIs `http2.getDefaultSettings()`, `http2.getPackedSettings()`, `http2.createServer()`, `http2.createSecureServer()`, `http2session.settings()`, `http2session.localSettings` e `http2session.remoteSettings` retornam ou recebem como entrada um objeto que define as configurações de configuração para um objeto `Http2Session`. Esses objetos são objetos JavaScript comuns que contêm as seguintes propriedades.

- `headerTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o número máximo de bytes usados para compressão de cabeçalho. O valor mínimo permitido é 0. O valor máximo permitido é 2-1. **Padrão:** `4096`.
- `enablePush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Especifica `true` se os Fluxos de Push HTTP/2 devem ser permitidos nas instâncias `Http2Session`. **Padrão:** `true`.
- `initialWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o tamanho da janela inicial do *remetente* em bytes para controle de fluxo em nível de fluxo. O valor mínimo permitido é 0. O valor máximo permitido é 2-1. **Padrão:** `65535`.
- `maxFrameSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o tamanho em bytes do maior payload de frame. O valor mínimo permitido é 16.384. O valor máximo permitido é 2-1. **Padrão:** `16384`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o número máximo de fluxos simultâneos permitidos em uma `Http2Session`. Não há valor padrão, o que implica que, pelo menos teoricamente, 2-1 fluxos podem estar abertos simultaneamente a qualquer momento em uma `Http2Session`. O valor mínimo é 0. O valor máximo permitido é 2-1. **Padrão:** `4294967295`.
- `maxHeaderListSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o tamanho máximo (octetos não comprimidos) da lista de cabeçalhos que será aceita. O valor mínimo permitido é 0. O valor máximo permitido é 2-1. **Padrão:** `65535`.
- `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias para `maxHeaderListSize`.
- `enableConnectProtocol`[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Especifica `true` se o "Protocolo de Conexão Estendido" definido por [RFC 8441](https://tools.ietf.org/html/rfc8441) deve ser habilitado. Esta configuração só é significativa se enviada pelo servidor. Uma vez que a configuração `enableConnectProtocol` tenha sido habilitada para uma determinada `Http2Session`, ela não pode ser desabilitada. **Padrão:** `false`.
- `customSettings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Especifica configurações adicionais, ainda não implementadas no node e nas bibliotecas subjacentes. A chave do objeto define o valor numérico do tipo de configurações (conforme definido no registro "HTTP/2 SETTINGS" estabelecido por [RFC 7540]) e os valores o valor numérico real das configurações. O tipo de configurações deve ser um inteiro no intervalo de 1 a 2^16-1. Não deve ser um tipo de configurações já tratado pelo node, ou seja, atualmente deve ser maior que 6, embora não seja um erro. Os valores precisam ser inteiros não assinados no intervalo de 0 a 2^32-1. Atualmente, um máximo de até 10 configurações personalizadas é suportado. Ele é suportado apenas para o envio de SETTINGS ou para o recebimento de valores de configurações especificados nas opções `remoteCustomSettings` do objeto do servidor ou cliente. Não misture o mecanismo `customSettings` para um ID de configurações com interfaces para as configurações tratadas nativamente, caso uma configuração se torne suportada nativamente em uma versão futura do node.

Todas as propriedades adicionais no objeto de configurações são ignoradas.


### Tratamento de erros {#error-handling}

Existem vários tipos de condições de erro que podem surgir ao usar o módulo `node:http2`:

Erros de validação ocorrem quando um argumento, opção ou valor de configuração incorreto é passado. Estes sempre serão relatados por um `throw` síncrono.

Erros de estado ocorrem quando uma ação é tentada em um momento incorreto (por exemplo, tentar enviar dados em um fluxo depois que ele foi fechado). Estes serão relatados usando um `throw` síncrono ou por meio de um evento `'error'` nos objetos `Http2Stream`, `Http2Session` ou Servidor HTTP/2, dependendo de onde e quando o erro ocorre.

Erros internos ocorrem quando uma sessão HTTP/2 falha inesperadamente. Estes serão relatados por meio de um evento `'error'` nos objetos `Http2Session` ou Servidor HTTP/2.

Erros de protocolo ocorrem quando várias restrições de protocolo HTTP/2 são violadas. Estes serão relatados usando um `throw` síncrono ou por meio de um evento `'error'` nos objetos `Http2Stream`, `Http2Session` ou Servidor HTTP/2, dependendo de onde e quando o erro ocorre.

### Tratamento de caracteres inválidos em nomes e valores de cabeçalho {#invalid-character-handling-in-header-names-and-values}

A implementação HTTP/2 aplica um tratamento mais rigoroso de caracteres inválidos em nomes e valores de cabeçalho HTTP do que a implementação HTTP/1.

Os nomes dos campos de cabeçalho *não diferenciam maiúsculas de minúsculas* e são transmitidos pela rede estritamente como strings em letras minúsculas. A API fornecida pelo Node.js permite que os nomes de cabeçalho sejam definidos como strings em letras mistas (por exemplo, `Content-Type`), mas os converterá para letras minúsculas (por exemplo, `content-type`) na transmissão.

Os nomes de campo de cabeçalho *devem conter apenas* um ou mais dos seguintes caracteres ASCII: `a`-`z`, `A`-`Z`, `0`-`9`, `!`, `#`, `$`, `%`, `&`, `'`, `*`, `+`, `-`, `.`, `^`, `_`, ``` (crase), `|` e `~`.

O uso de caracteres inválidos em um nome de campo de cabeçalho HTTP fará com que o fluxo seja fechado com um erro de protocolo sendo relatado.

Os valores dos campos de cabeçalho são tratados com mais leniência, mas *não devem* conter caracteres de nova linha ou retorno de carro e *devem* ser limitados a caracteres US-ASCII, de acordo com os requisitos da especificação HTTP.


### Push streams no cliente {#push-streams-on-the-client}

Para receber fluxos push no cliente, defina um listener para o evento `'stream'` no `ClientHttp2Session`:

::: code-group
```js [ESM]
import { connect } from 'node:http2';

const client = connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // Processar headers de resposta
  });
  pushedStream.on('data', (chunk) => { /* manipular dados push */ });
});

const req = client.request({ ':path': '/' });
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // Processar headers de resposta
  });
  pushedStream.on('data', (chunk) => { /* manipular dados push */ });
});

const req = client.request({ ':path': '/' });
```
:::

### Suportando o método `CONNECT` {#supporting-the-connect-method}

O método `CONNECT` é usado para permitir que um servidor HTTP/2 seja usado como um proxy para conexões TCP/IP.

Um Servidor TCP simples:

::: code-group
```js [ESM]
import { createServer } from 'node:net';

const server = createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```

```js [CJS]
const net = require('node:net');

const server = net.createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```
:::

Um proxy HTTP/2 CONNECT:

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const { NGHTTP2_REFUSED_STREAM, NGHTTP2_CONNECT_ERROR } = constants;
import { connect } from 'node:net';

const proxy = createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // Aceitar somente requisições CONNECT
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // É uma boa ideia verificar se o hostname e a porta são coisas
  // que este proxy deve se conectar.
  const socket = connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```

```js [CJS]
const http2 = require('node:http2');
const { NGHTTP2_REFUSED_STREAM } = http2.constants;
const net = require('node:net');

const proxy = http2.createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // Aceitar somente requisições CONNECT
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // É uma boa ideia verificar se o hostname e a porta são coisas
  // que este proxy deve se conectar.
  const socket = net.connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(http2.constants.NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```
:::

Um cliente HTTP/2 CONNECT:

::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';

const client = connect('http://localhost:8001');

// Não deve especificar os headers ':path' e ':scheme'
// para requisições CONNECT ou um erro será lançado.
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost:8001');

// Não deve especificar os headers ':path' e ':scheme'
// para requisições CONNECT ou um erro será lançado.
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[http2.constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```
:::

### O protocolo `CONNECT` estendido {#the-extended-connect-protocol}

[RFC 8441](https://tools.ietf.org/html/rfc8441) define uma extensão de "Protocolo CONNECT Estendido" para HTTP/2 que pode ser usada para iniciar o uso de um `Http2Stream` usando o método `CONNECT` como um túnel para outros protocolos de comunicação (como WebSockets).

O uso do Protocolo CONNECT Estendido é habilitado por servidores HTTP/2 usando a configuração `enableConnectProtocol`:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const settings = { enableConnectProtocol: true };
const server = createServer({ settings });
```

```js [CJS]
const http2 = require('node:http2');
const settings = { enableConnectProtocol: true };
const server = http2.createServer({ settings });
```
:::

Uma vez que o cliente recebe o frame `SETTINGS` do servidor indicando que o CONNECT estendido pode ser usado, ele pode enviar requisições `CONNECT` que usam o pseudo-header `':protocol'` HTTP/2:

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```
:::

## API de Compatibilidade {#compatibility-api}

A API de Compatibilidade tem o objetivo de fornecer uma experiência de desenvolvedor semelhante à do HTTP/1 ao usar HTTP/2, tornando possível desenvolver aplicativos que suportem [HTTP/1](/pt/nodejs/api/http) e HTTP/2. Esta API tem como alvo apenas a **API pública** do [HTTP/1](/pt/nodejs/api/http). No entanto, muitos módulos usam métodos ou estados internos, e esses *não são suportados*, pois é uma implementação completamente diferente.

O exemplo a seguir cria um servidor HTTP/2 usando a API de compatibilidade:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
:::

Para criar um servidor misto [HTTPS](/pt/nodejs/api/https) e HTTP/2, consulte a seção [negociação ALPN](/pt/nodejs/api/http2#alpn-negotiation). A atualização de servidores HTTP/1 não-tls não é suportada.

A API de compatibilidade HTTP/2 é composta por [`Http2ServerRequest`](/pt/nodejs/api/http2#class-http2http2serverrequest) e [`Http2ServerResponse`](/pt/nodejs/api/http2#class-http2http2serverresponse). Elas visam a compatibilidade da API com HTTP/1, mas não ocultam as diferenças entre os protocolos. Como exemplo, a mensagem de status para códigos HTTP é ignorada.


### Negociação ALPN {#alpn-negotiation}

A negociação ALPN permite suportar tanto [HTTPS](/pt/nodejs/api/https) quanto HTTP/2 no mesmo socket. Os objetos `req` e `res` podem ser HTTP/1 ou HTTP/2, e uma aplicação **deve** se restringir à API pública de [HTTP/1](/pt/nodejs/api/http) e detectar se é possível usar os recursos mais avançados do HTTP/2.

O exemplo a seguir cria um servidor que suporta ambos os protocolos:

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(8000);

function onRequest(req, res) {
  // Detecta se é uma requisição HTTPS ou HTTP/2
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```

```js [CJS]
const { createSecureServer } = require('node:http2');
const { readFileSync } = require('node:fs');

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(4443);

function onRequest(req, res) {
  // Detecta se é uma requisição HTTPS ou HTTP/2
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```
:::

O evento `'request'` funciona de forma idêntica tanto em [HTTPS](/pt/nodejs/api/https) quanto em HTTP/2.

### Classe: `http2.Http2ServerRequest` {#class-http2http2serverrequest}

**Adicionado em: v8.4.0**

- Estende: [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable)

Um objeto `Http2ServerRequest` é criado por [`http2.Server`](/pt/nodejs/api/http2#class-http2server) ou [`http2.SecureServer`](/pt/nodejs/api/http2#class-http2secureserver) e passado como o primeiro argumento para o evento [`'request'`](/pt/nodejs/api/http2#event-request). Ele pode ser usado para acessar o status da requisição, cabeçalhos e dados.


#### Evento: `'aborted'` {#event-aborted_1}

**Adicionado em: v8.4.0**

O evento `'aborted'` é emitido sempre que uma instância de `Http2ServerRequest` é abortada de forma anormal durante a comunicação.

O evento `'aborted'` só será emitido se o lado gravável de `Http2ServerRequest` não tiver sido finalizado.

#### Evento: `'close'` {#event-close_2}

**Adicionado em: v8.4.0**

Indica que o [`Http2Stream`](/pt/nodejs/api/http2#class-http2stream) subjacente foi fechado. Assim como `'end'`, este evento ocorre apenas uma vez por resposta.

#### `request.aborted` {#requestaborted}

**Adicionado em: v10.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

A propriedade `request.aborted` será `true` se a requisição tiver sido abortada.

#### `request.authority` {#requestauthority}

**Adicionado em: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O campo de pseudo cabeçalho de autoridade da requisição. Como o HTTP/2 permite que as requisições definam `:authority` ou `host`, este valor é derivado de `req.headers[':authority']` se presente. Caso contrário, é derivado de `req.headers['host']`.

#### `request.complete` {#requestcomplete}

**Adicionado em: v12.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

A propriedade `request.complete` será `true` se a requisição tiver sido concluída, abortada ou destruída.

#### `request.connection` {#requestconnection}

**Adicionado em: v8.4.0**

**Obsoleto desde: v13.0.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Use [`request.socket`](/pt/nodejs/api/http2#requestsocket).
:::

- [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/pt/nodejs/api/tls#class-tlstlssocket)

Veja [`request.socket`](/pt/nodejs/api/http2#requestsocket).

#### `request.destroy([error])` {#requestdestroyerror}

**Adicionado em: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Chama `destroy()` no [`Http2Stream`](/pt/nodejs/api/http2#class-http2stream) que recebeu o [`Http2ServerRequest`](/pt/nodejs/api/http2#class-http2http2serverrequest). Se `error` for fornecido, um evento `'error'` é emitido e `error` é passado como um argumento para quaisquer listeners no evento.

Não faz nada se o stream já foi destruído.


#### `request.headers` {#requestheaders}

**Adicionado em: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

O objeto de cabeçalhos de requisição/resposta.

Pares de chave-valor de nomes e valores de cabeçalho. Os nomes dos cabeçalhos são convertidos para letras minúsculas.

```js [ESM]
// Imprime algo como:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
Veja [Objeto de Cabeçalhos HTTP/2](/pt/nodejs/api/http2#headers-object).

Em HTTP/2, o caminho da requisição, nome do host, protocolo e método são representados como cabeçalhos especiais prefixados com o caractere `:` (por exemplo, `':path'`). Esses cabeçalhos especiais serão incluídos no objeto `request.headers`. Deve-se ter cuidado para não modificar inadvertidamente esses cabeçalhos especiais, caso contrário, podem ocorrer erros. Por exemplo, remover todos os cabeçalhos da requisição causará erros:

```js [ESM]
removeAllHeaders(request.headers);
assert(request.url);   // Falha porque o cabeçalho :path foi removido
```
#### `request.httpVersion` {#requesthttpversion}

**Adicionado em: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

No caso de uma requisição do servidor, a versão HTTP enviada pelo cliente. No caso de uma resposta do cliente, a versão HTTP do servidor conectado. Retorna `'2.0'`.

Além disso, `message.httpVersionMajor` é o primeiro inteiro e `message.httpVersionMinor` é o segundo.

#### `request.method` {#requestmethod}

**Adicionado em: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método de requisição como uma string. Somente leitura. Exemplos: `'GET'`, `'DELETE'`.

#### `request.rawHeaders` {#requestrawheaders}

**Adicionado em: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A lista bruta de cabeçalhos de requisição/resposta exatamente como foram recebidos.

As chaves e os valores estão na mesma lista. *Não* é uma lista de tuplas. Portanto, os deslocamentos de número par são valores-chave e os deslocamentos de número ímpar são os valores associados.

Os nomes dos cabeçalhos não são convertidos para letras minúsculas e os duplicados não são mesclados.

```js [ESM]
// Imprime algo como:
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*/*' ]
console.log(request.rawHeaders);
```

#### `request.rawTrailers` {#requestrawtrailers}

**Adicionado em: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

As chaves e valores do trailer de solicitação/resposta brutos exatamente como foram recebidos. Preenchido apenas no evento `'end'`.

#### `request.scheme` {#requestscheme}

**Adicionado em: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O campo de pseudo cabeçalho do esquema de solicitação, indicando a parte do esquema do URL de destino.

#### `request.setTimeout(msecs, callback)` {#requestsettimeoutmsecs-callback}

**Adicionado em: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<http2.Http2ServerRequest\>](/pt/nodejs/api/http2#class-http2http2serverrequest)

Define o valor de timeout do [`Http2Stream`](/pt/nodejs/api/http2#class-http2stream) para `msecs`. Se um callback for fornecido, ele será adicionado como um listener no evento `'timeout'` no objeto de resposta.

Se nenhum listener `'timeout'` for adicionado à solicitação, à resposta ou ao servidor, os [`Http2Stream`](/pt/nodejs/api/http2#class-http2stream) serão destruídos quando expirarem. Se um manipulador for atribuído aos eventos `'timeout'` da solicitação, da resposta ou do servidor, os sockets com tempo limite excedido devem ser tratados explicitamente.

#### `request.socket` {#requestsocket}

**Adicionado em: v8.4.0**

- [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/pt/nodejs/api/tls#class-tlstlssocket)

Retorna um objeto `Proxy` que atua como um `net.Socket` (ou `tls.TLSSocket`), mas aplica getters, setters e métodos baseados na lógica HTTP/2.

As propriedades `destroyed`, `readable` e `writable` serão recuperadas e definidas em `request.stream`.

Os métodos `destroy`, `emit`, `end`, `on` e `once` serão chamados em `request.stream`.

O método `setTimeout` será chamado em `request.stream.session`.

`pause`, `read`, `resume` e `write` lançarão um erro com o código `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Consulte [`Http2Session` e Sockets](/pt/nodejs/api/http2#http2session-and-sockets) para obter mais informações.

Todas as outras interações serão encaminhadas diretamente para o socket. Com suporte TLS, use [`request.socket.getPeerCertificate()`](/pt/nodejs/api/tls#tlssocketgetpeercertificatedetailed) para obter os detalhes de autenticação do cliente.


#### `request.stream` {#requeststream}

**Adicionado em: v8.4.0**

- [\<Http2Stream\>](/pt/nodejs/api/http2#class-http2stream)

O objeto [`Http2Stream`](/pt/nodejs/api/http2#class-http2stream) que dá suporte à requisição.

#### `request.trailers` {#requesttrailers}

**Adicionado em: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

O objeto de trailers de requisição/resposta. Preenchido apenas no evento `'end'`.

#### `request.url` {#requesturl}

**Adicionado em: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

String da URL da requisição. Contém apenas a URL presente na requisição HTTP real. Se a requisição for:

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
Então `request.url` será:

```js [ESM]
'/status?name=ryan'
```
Para analisar a URL em suas partes, `new URL()` pode ser usado:

```bash [BASH]
$ node
> new URL('/status?name=ryan', 'http://example.com')
URL {
  href: 'http://example.com/status?name=ryan',
  origin: 'http://example.com',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'example.com',
  hostname: 'example.com',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
### Classe: `http2.Http2ServerResponse` {#class-http2http2serverresponse}

**Adicionado em: v8.4.0**

- Estende: [\<Stream\>](/pt/nodejs/api/stream#stream)

Este objeto é criado internamente por um servidor HTTP, não pelo usuário. Ele é passado como o segundo parâmetro para o evento [`'request'`](/pt/nodejs/api/http2#event-request).

#### Evento: `'close'` {#event-close_3}

**Adicionado em: v8.4.0**

Indica que o [`Http2Stream`](/pt/nodejs/api/http2#class-http2stream) subjacente foi terminado antes que [`response.end()`](/pt/nodejs/api/http2#responseenddata-encoding-callback) fosse chamado ou capaz de descarregar.

#### Evento: `'finish'` {#event-finish}

**Adicionado em: v8.4.0**

Emitido quando a resposta foi enviada. Mais especificamente, este evento é emitido quando o último segmento dos cabeçalhos e do corpo da resposta foi entregue ao multiplexador HTTP/2 para transmissão pela rede. Não implica que o cliente tenha recebido alguma coisa ainda.

Após este evento, nenhum outro evento será emitido no objeto de resposta.


#### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**Adicionado em: v8.4.0**

- `headers` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Este método adiciona cabeçalhos de trailer HTTP (um cabeçalho, mas no final da mensagem) à resposta.

A tentativa de definir um nome ou valor de campo de cabeçalho que contenha caracteres inválidos resultará no lançamento de um [`TypeError`](/pt/nodejs/api/errors#class-typeerror).

#### `response.appendHeader(name, value)` {#responseappendheadername-value}

**Adicionado em: v21.7.0, v20.12.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Anexa um único valor de cabeçalho ao objeto de cabeçalho.

Se o valor for uma matriz, isso é equivalente a chamar este método várias vezes.

Se não houver valores anteriores para o cabeçalho, isso é equivalente a chamar [`response.setHeader()`](/pt/nodejs/api/http2#responsesetheadername-value).

A tentativa de definir um nome ou valor de campo de cabeçalho que contenha caracteres inválidos resultará no lançamento de um [`TypeError`](/pt/nodejs/api/errors#class-typeerror).

```js [ESM]
// Retorna cabeçalhos incluindo "set-cookie: a" e "set-cookie: b"
const server = http2.createServer((req, res) => {
  res.setHeader('set-cookie', 'a');
  res.appendHeader('set-cookie', 'b');
  res.writeHead(200);
  res.end('ok');
});
```
#### `response.connection` {#responseconnection}

**Adicionado em: v8.4.0**

**Obsoleto desde: v13.0.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Use [`response.socket`](/pt/nodejs/api/http2#responsesocket).
:::

- [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/pt/nodejs/api/tls#class-tlstlssocket)

Veja [`response.socket`](/pt/nodejs/api/http2#responsesocket).

#### `response.createPushResponse(headers, callback)` {#responsecreatepushresponseheaders-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- `headers` [\<Objeto de Cabeçalhos HTTP/2\>](/pt/nodejs/api/http2#headers-object) Um objeto que descreve os cabeçalhos
- `callback` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chamado quando `http2stream.pushStream()` é finalizado, ou quando a tentativa de criar o `Http2Stream` push falhou ou foi rejeitada, ou o estado de `Http2ServerRequest` é fechado antes de chamar o método `http2stream.pushStream()`
    - `err` [\<Erro\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `res` [\<http2.Http2ServerResponse\>](/pt/nodejs/api/http2#class-http2http2serverresponse) O objeto `Http2ServerResponse` recém-criado
  
 

Chame [`http2stream.pushStream()`](/pt/nodejs/api/http2#http2streampushstreamheaders-options-callback) com os cabeçalhos fornecidos e envolva o [`Http2Stream`](/pt/nodejs/api/http2#class-http2stream) fornecido em um `Http2ServerResponse` recém-criado como o parâmetro de callback se bem-sucedido. Quando `Http2ServerRequest` é fechado, o callback é chamado com um erro `ERR_HTTP2_INVALID_STREAM`.


#### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Este método agora retorna uma referência para `ServerResponse`. |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Este método sinaliza ao servidor que todos os cabeçalhos e o corpo da resposta foram enviados; que o servidor deve considerar esta mensagem completa. O método `response.end()` DEVE ser chamado em cada resposta.

Se `data` for especificado, é equivalente a chamar [`response.write(data, encoding)`](/pt/nodejs/api/http#responsewritechunk-encoding-callback) seguido por `response.end(callback)`.

Se `callback` for especificado, ele será chamado quando o fluxo de resposta for finalizado.

#### `response.finished` {#responsefinished}

**Adicionado em: v8.4.0**

**Obsoleto desde: v13.4.0, v12.16.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Use [`response.writableEnded`](/pt/nodejs/api/http2#responsewritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Valor booleano que indica se a resposta foi concluída. Começa como `false`. Após a execução de [`response.end()`](/pt/nodejs/api/http2#responseenddata-encoding-callback), o valor será `true`.

#### `response.getHeader(name)` {#responsegetheadername}

**Adicionado em: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Lê um cabeçalho que já foi enfileirado, mas não enviado ao cliente. O nome não diferencia maiúsculas de minúsculas.

```js [ESM]
const contentType = response.getHeader('content-type');
```

#### `response.getHeaderNames()` {#responsegetheadernames}

**Adicionado em: v8.4.0**

- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna um array contendo os nomes únicos dos cabeçalhos de saída atuais. Todos os nomes dos cabeçalhos são em minúsculas.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```
#### `response.getHeaders()` {#responsegetheaders}

**Adicionado em: v8.4.0**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna uma cópia superficial dos cabeçalhos de saída atuais. Como uma cópia superficial é usada, os valores do array podem ser mutados sem chamadas adicionais a vários métodos do módulo http relacionados ao cabeçalho. As chaves do objeto retornado são os nomes dos cabeçalhos e os valores são os respectivos valores dos cabeçalhos. Todos os nomes dos cabeçalhos são em minúsculas.

O objeto retornado pelo método `response.getHeaders()` *não* herda prototipicamente do `Object` do JavaScript. Isso significa que os métodos típicos do `Object`, como `obj.toString()`, `obj.hasOwnProperty()` e outros, não são definidos e *não funcionarão*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
#### `response.hasHeader(name)` {#responsehasheadername}

**Adicionado em: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o cabeçalho identificado por `name` estiver atualmente definido nos cabeçalhos de saída. A correspondência do nome do cabeçalho não diferencia maiúsculas de minúsculas.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
#### `response.headersSent` {#responseheaderssent}

**Adicionado em: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verdadeiro se os cabeçalhos foram enviados, falso caso contrário (somente leitura).


#### `response.removeHeader(name)` {#responseremoveheadername}

**Adicionado em: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Remove um cabeçalho que foi enfileirado para envio implícito.

```js [ESM]
response.removeHeader('Content-Encoding');
```
#### `response.req` {#responsereq}

**Adicionado em: v15.7.0**

- [\<http2.Http2ServerRequest\>](/pt/nodejs/api/http2#class-http2http2serverrequest)

Uma referência ao objeto `request` HTTP2 original.

#### `response.sendDate` {#responsesenddate}

**Adicionado em: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Quando verdadeiro, o cabeçalho Date será gerado e enviado automaticamente na resposta se já não estiver presente nos cabeçalhos. O padrão é verdadeiro.

Isto só deve ser desativado para testes; o HTTP requer o cabeçalho Date nas respostas.

#### `response.setHeader(name, value)` {#responsesetheadername-value}

**Adicionado em: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Define um único valor de cabeçalho para cabeçalhos implícitos. Se este cabeçalho já existir nos cabeçalhos a serem enviados, seu valor será substituído. Use um array de strings aqui para enviar vários cabeçalhos com o mesmo nome.

```js [ESM]
response.setHeader('Content-Type', 'text/html; charset=utf-8');
```
ou

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
A tentativa de definir um nome ou valor de campo de cabeçalho que contenha caracteres inválidos resultará no lançamento de um [`TypeError`](/pt/nodejs/api/errors#class-typeerror).

Quando os cabeçalhos forem definidos com [`response.setHeader()`](/pt/nodejs/api/http2#responsesetheadername-value), eles serão mesclados com quaisquer cabeçalhos passados para [`response.writeHead()`](/pt/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers), com os cabeçalhos passados para [`response.writeHead()`](/pt/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) tendo precedência.

```js [ESM]
// Retorna content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

#### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**Adicionado em: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<http2.Http2ServerResponse\>](/pt/nodejs/api/http2#class-http2http2serverresponse)

Define o valor de timeout do [`Http2Stream`](/pt/nodejs/api/http2#class-http2stream) para `msecs`. Se um callback for fornecido, ele será adicionado como um listener no evento `'timeout'` no objeto de resposta.

Se nenhum listener `'timeout'` for adicionado à requisição, à resposta ou ao servidor, os [`Http2Stream`](/pt/nodejs/api/http2#class-http2stream) serão destruídos quando atingirem o timeout. Se um handler for atribuído aos eventos `'timeout'` da requisição, da resposta ou do servidor, os sockets que atingiram o timeout devem ser tratados explicitamente.

#### `response.socket` {#responsesocket}

**Adicionado em: v8.4.0**

- [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/pt/nodejs/api/tls#class-tlstlssocket)

Retorna um objeto `Proxy` que atua como um `net.Socket` (ou `tls.TLSSocket`), mas aplica getters, setters e métodos baseados na lógica HTTP/2.

As propriedades `destroyed`, `readable` e `writable` serão recuperadas e definidas em `response.stream`.

Os métodos `destroy`, `emit`, `end`, `on` e `once` serão chamados em `response.stream`.

O método `setTimeout` será chamado em `response.stream.session`.

`pause`, `read`, `resume` e `write` lançarão um erro com o código `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Veja [`Http2Session` e Sockets](/pt/nodejs/api/http2#http2session-and-sockets) para mais informações.

Todas as outras interações serão roteadas diretamente para o socket.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::


#### `response.statusCode` {#responsestatuscode}

**Adicionado em: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Ao usar cabeçalhos implícitos (não chamando [`response.writeHead()`](/pt/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) explicitamente), esta propriedade controla o código de status que será enviado ao cliente quando os cabeçalhos forem liberados.

```js [ESM]
response.statusCode = 404;
```
Depois que o cabeçalho de resposta for enviado ao cliente, esta propriedade indica o código de status que foi enviado.

#### `response.statusMessage` {#responsestatusmessage}

**Adicionado em: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A mensagem de status não é suportada por HTTP/2 (RFC 7540 8.1.2.4). Retorna uma string vazia.

#### `response.stream` {#responsestream}

**Adicionado em: v8.4.0**

- [\<Http2Stream\>](/pt/nodejs/api/http2#class-http2stream)

O objeto [`Http2Stream`](/pt/nodejs/api/http2#class-http2stream) que suporta a resposta.

#### `response.writableEnded` {#responsewritableended}

**Adicionado em: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` depois que [`response.end()`](/pt/nodejs/api/http2#responseenddata-encoding-callback) foi chamado. Esta propriedade não indica se os dados foram liberados, para isso use [`writable.writableFinished`](/pt/nodejs/api/stream#writablewritablefinished) em vez disso.

#### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}

**Adicionado em: v8.4.0**

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se este método for chamado e [`response.writeHead()`](/pt/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) não tiver sido chamado, ele mudará para o modo de cabeçalho implícito e liberará os cabeçalhos implícitos.

Isso envia um pedaço do corpo da resposta. Este método pode ser chamado várias vezes para fornecer partes sucessivas do corpo.

No módulo `node:http`, o corpo da resposta é omitido quando a solicitação é uma solicitação HEAD. Da mesma forma, as respostas `204` e `304` *não devem* incluir um corpo de mensagem.

`chunk` pode ser uma string ou um buffer. Se `chunk` for uma string, o segundo parâmetro especifica como codificá-la em um fluxo de bytes. Por padrão, a `encoding` é `'utf8'`. `callback` será chamado quando este pedaço de dados for liberado.

Este é o corpo HTTP bruto e não tem nada a ver com codificações de corpo multi-parte de nível superior que podem ser usadas.

A primeira vez que [`response.write()`](/pt/nodejs/api/http2#responsewritechunk-encoding-callback) é chamado, ele enviará as informações de cabeçalho em buffer e o primeiro pedaço do corpo para o cliente. A segunda vez que [`response.write()`](/pt/nodejs/api/http2#responsewritechunk-encoding-callback) é chamado, o Node.js assume que os dados serão transmitidos e envia os novos dados separadamente. Ou seja, a resposta é armazenada em buffer até o primeiro pedaço do corpo.

Retorna `true` se todos os dados foram liberados com sucesso para o buffer do kernel. Retorna `false` se toda ou parte dos dados foi enfileirada na memória do usuário. `'drain'` será emitido quando o buffer estiver livre novamente.


#### `response.writeContinue()` {#responsewritecontinue}

**Adicionado em: v8.4.0**

Envia um status `100 Continue` ao cliente, indicando que o corpo da solicitação deve ser enviado. Veja o evento [`'checkContinue'`](/pt/nodejs/api/http2#event-checkcontinue) em `Http2Server` e `Http2SecureServer`.

#### `response.writeEarlyHints(hints)` {#responsewriteearlyhintshints}

**Adicionado em: v18.11.0**

- `hints` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Envia um status `103 Early Hints` ao cliente com um cabeçalho Link, indicando que o agente do usuário pode pré-carregar/pré-conectar os recursos vinculados. O `hints` é um objeto contendo os valores dos cabeçalhos a serem enviados com a mensagem de dicas antecipadas.

**Exemplo**

```js [ESM]
const earlyHintsLink = '</styles.css>; rel=preload; as=style';
response.writeEarlyHints({
  'link': earlyHintsLink,
});

const earlyHintsLinks = [
  '</styles.css>; rel=preload; as=style',
  '</scripts.js>; rel=preload; as=script',
];
response.writeEarlyHints({
  'link': earlyHintsLinks,
});
```
#### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v11.10.0, v10.17.0 | Retorna `this` de `writeHead()` para permitir o encadeamento com `end()`. |
| v8.4.0 | Adicionado em: v8.4.0 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- Retorna: [\<http2.Http2ServerResponse\>](/pt/nodejs/api/http2#class-http2http2serverresponse)

Envia um cabeçalho de resposta à solicitação. O código de status é um código de status HTTP de 3 dígitos, como `404`. O último argumento, `headers`, são os cabeçalhos de resposta.

Retorna uma referência a `Http2ServerResponse`, para que as chamadas possam ser encadeadas.

Para compatibilidade com [HTTP/1](/pt/nodejs/api/http), uma `statusMessage` legível por humanos pode ser passada como o segundo argumento. No entanto, como o `statusMessage` não tem significado dentro do HTTP/2, o argumento não terá efeito e um aviso de processo será emitido.

```js [ESM]
const body = 'hello world';
response.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/plain; charset=utf-8',
});
```
`Content-Length` é fornecido em bytes, não em caracteres. A API `Buffer.byteLength()` pode ser usada para determinar o número de bytes em uma determinada codificação. Em mensagens de saída, o Node.js não verifica se Content-Length e o comprimento do corpo que está sendo transmitido são iguais ou não. No entanto, ao receber mensagens, o Node.js rejeitará automaticamente as mensagens quando o `Content-Length` não corresponder ao tamanho real da carga.

Este método pode ser chamado no máximo uma vez em uma mensagem antes de [`response.end()`](/pt/nodejs/api/http2#responseenddata-encoding-callback) ser chamado.

Se [`response.write()`](/pt/nodejs/api/http2#responsewritechunk-encoding-callback) ou [`response.end()`](/pt/nodejs/api/http2#responseenddata-encoding-callback) forem chamados antes de chamar isso, os cabeçalhos implícitos/mutáveis ​​serão calculados e chamarão esta função.

Quando os cabeçalhos forem definidos com [`response.setHeader()`](/pt/nodejs/api/http2#responsesetheadername-value), eles serão mesclados com quaisquer cabeçalhos passados ​​para [`response.writeHead()`](/pt/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers), com os cabeçalhos passados ​​para [`response.writeHead()`](/pt/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) tendo precedência.

```js [ESM]
// Retorna content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
Tentar definir um nome ou valor de campo de cabeçalho que contenha caracteres inválidos resultará no lançamento de um [`TypeError`](/pt/nodejs/api/errors#class-typeerror).


## Coletando métricas de desempenho HTTP/2 {#collecting-http/2-performance-metrics}

A API [Performance Observer](/pt/nodejs/api/perf_hooks) pode ser usada para coletar métricas básicas de desempenho para cada instância de `Http2Session` e `Http2Stream`.

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // imprime 'http2'
  if (entry.name === 'Http2Session') {
    // Entry contains statistics about the Http2Session
  } else if (entry.name === 'Http2Stream') {
    // Entry contains statistics about the Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```

```js [CJS]
const { PerformanceObserver } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // imprime 'http2'
  if (entry.name === 'Http2Session') {
    // Entry contains statistics about the Http2Session
  } else if (entry.name === 'Http2Stream') {
    // Entry contains statistics about the Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```
:::

A propriedade `entryType` do `PerformanceEntry` será igual a `'http2'`.

A propriedade `name` do `PerformanceEntry` será igual a `'Http2Stream'` ou `'Http2Session'`.

Se `name` for igual a `Http2Stream`, o `PerformanceEntry` conterá as seguintes propriedades adicionais:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes de frame `DATA` recebidos para este `Http2Stream`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes de frame `DATA` enviados para este `Http2Stream`.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O identificador do `Http2Stream` associado.
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos decorridos entre o `startTime` do `PerformanceEntry` e a recepção do primeiro frame `DATA`.
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos decorridos entre o `startTime` do `PerformanceEntry` e o envio do primeiro frame `DATA`.
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos decorridos entre o `startTime` do `PerformanceEntry` e a recepção do primeiro cabeçalho.

Se `name` for igual a `Http2Session`, o `PerformanceEntry` conterá as seguintes propriedades adicionais:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes recebidos para este `Http2Session`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes enviados para este `Http2Session`.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de frames HTTP/2 recebidos pelo `Http2Session`.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de frames HTTP/2 enviados pelo `Http2Session`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número máximo de streams abertos simultaneamente durante o tempo de vida do `Http2Session`.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos decorridos desde a transmissão de um frame `PING` e a recepção de seu reconhecimento. Presente apenas se um frame `PING` foi enviado no `Http2Session`.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A duração média (em milissegundos) para todas as instâncias de `Http2Stream`.
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de instâncias de `Http2Stream` processadas pelo `Http2Session`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'server'` ou `'client'` para identificar o tipo de `Http2Session`.


## Nota sobre `:authority` e `host` {#note-on-authority-and-host}

HTTP/2 exige que as requisições tenham o pseudo-header `:authority` ou o header `host`. Prefira `:authority` ao construir uma requisição HTTP/2 diretamente, e `host` ao converter de HTTP/1 (em proxies, por exemplo).

A API de compatibilidade recorre a `host` se `:authority` não estiver presente. Veja [`request.authority`](/pt/nodejs/api/http2#requestauthority) para mais informações. No entanto, se você não usar a API de compatibilidade (ou usar `req.headers` diretamente), você precisa implementar qualquer comportamento de fallback você mesmo.

