---
title: Documentação do Módulo HTTP do Node.js
description: A documentação oficial do módulo HTTP do Node.js, detalhando como criar servidores e clientes HTTP, lidar com requisições e respostas, e gerenciar vários métodos e cabeçalhos HTTP.
head:
  - - meta
    - name: og:title
      content: Documentação do Módulo HTTP do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: A documentação oficial do módulo HTTP do Node.js, detalhando como criar servidores e clientes HTTP, lidar com requisições e respostas, e gerenciar vários métodos e cabeçalhos HTTP.
  - - meta
    - name: twitter:title
      content: Documentação do Módulo HTTP do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: A documentação oficial do módulo HTTP do Node.js, detalhando como criar servidores e clientes HTTP, lidar com requisições e respostas, e gerenciar vários métodos e cabeçalhos HTTP.
---


# HTTP {#http}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/http.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http.js)

Este módulo, contendo tanto um cliente quanto um servidor, pode ser importado via `require('node:http')` (CommonJS) ou `import * as http from 'node:http'` (módulo ES).

As interfaces HTTP no Node.js são projetadas para suportar muitos recursos do protocolo que tradicionalmente têm sido difíceis de usar. Em particular, mensagens grandes, possivelmente codificadas em partes. A interface é cuidadosa para nunca armazenar em buffer solicitações ou respostas inteiras, para que o usuário possa transmitir dados.

Os cabeçalhos de mensagens HTTP são representados por um objeto como este:

```json [JSON]
{ "content-length": "123",
  "content-type": "text/plain",
  "connection": "keep-alive",
  "host": "example.com",
  "accept": "*/*" }
```
As chaves são convertidas para minúsculas. Os valores não são modificados.

Para suportar todo o espectro de possíveis aplicações HTTP, a API HTTP do Node.js é de nível muito baixo. Ela lida apenas com o tratamento de fluxos e a análise de mensagens. Ela analisa uma mensagem em cabeçalhos e corpo, mas não analisa os cabeçalhos ou o corpo em si.

Consulte [`message.headers`](/pt/nodejs/api/http#messageheaders) para obter detalhes sobre como os cabeçalhos duplicados são tratados.

Os cabeçalhos brutos, conforme foram recebidos, são mantidos na propriedade `rawHeaders`, que é um array de `[chave, valor, chave2, valor2, ...]`. Por exemplo, o objeto de cabeçalho de mensagem anterior pode ter uma lista `rawHeaders` como a seguinte:

```js [ESM]
[ 'ConTent-Length', '123456',
  'content-LENGTH', '123',
  'content-type', 'text/plain',
  'CONNECTION', 'keep-alive',
  'Host', 'example.com',
  'accepT', '*/*' ]
```
## Classe: `http.Agent` {#class-httpagent}

**Adicionado em: v0.3.4**

Um `Agent` é responsável por gerenciar a persistência e a reutilização da conexão para clientes HTTP. Ele mantém uma fila de solicitações pendentes para um determinado host e porta, reutilizando uma única conexão de socket para cada uma até que a fila esteja vazia, momento em que o socket é destruído ou colocado em um pool onde é mantido para ser usado novamente para solicitações para o mesmo host e porta. Se ele é destruído ou agrupado depende da [opção](/pt/nodejs/api/http#new-agentoptions) `keepAlive`.

As conexões agrupadas têm o TCP Keep-Alive habilitado para elas, mas os servidores ainda podem fechar conexões ociosas, caso em que elas serão removidas do pool e uma nova conexão será feita quando uma nova solicitação HTTP for feita para esse host e porta. Os servidores também podem se recusar a permitir várias solicitações na mesma conexão, caso em que a conexão terá que ser refeita para cada solicitação e não poderá ser agrupada. O `Agent` ainda fará as solicitações para esse servidor, mas cada uma ocorrerá por meio de uma nova conexão.

Quando uma conexão é fechada pelo cliente ou pelo servidor, ela é removida do pool. Quaisquer sockets não utilizados no pool serão unrefed para não manter o processo Node.js em execução quando não houver solicitações pendentes. (consulte [`socket.unref()`](/pt/nodejs/api/net#socketunref)).

É uma boa prática [`destroy()`](/pt/nodejs/api/http#agentdestroy) uma instância `Agent` quando ela não estiver mais em uso, porque os sockets não utilizados consomem recursos do sistema operacional.

Os sockets são removidos de um agente quando o socket emite um evento `'close'` ou um evento `'agentRemove'`. Quando se pretende manter uma solicitação HTTP aberta por um longo tempo sem mantê-la no agente, algo como o seguinte pode ser feito:

```js [ESM]
http.get(options, (res) => {
  // Faça algo
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});
```
Um agente também pode ser usado para uma solicitação individual. Ao fornecer `{agent: false}` como uma opção para as funções `http.get()` ou `http.request()`, um `Agent` de uso único com opções padrão será usado para a conexão do cliente.

`agent:false`:

```js [ESM]
http.get({
  hostname: 'localhost',
  port: 80,
  path: '/',
  agent: false,  // Crie um novo agente apenas para esta solicitação
}, (res) => {
  // Faça algo com a resposta
});
```

### `new Agent([options])` {#new-agentoptions}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.6.0, v14.17.0 | Altere o agendamento padrão de 'fifo' para 'lifo'. |
| v14.5.0, v12.20.0 | Adicione a opção `scheduling` para especificar a estratégia de agendamento de socket livre. |
| v14.5.0, v12.19.0 | Adicione a opção `maxTotalSockets` ao construtor do agente. |
| v0.3.4 | Adicionado em: v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Conjunto de opções configuráveis para definir no agente. Pode ter os seguintes campos:
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Mantenha os sockets por perto, mesmo quando não houver solicitações pendentes, para que possam ser usados para solicitações futuras sem ter que restabelecer uma conexão TCP. Não deve ser confundido com o valor `keep-alive` do cabeçalho `Connection`. O cabeçalho `Connection: keep-alive` é sempre enviado ao usar um agente, exceto quando o cabeçalho `Connection` é explicitamente especificado ou quando as opções `keepAlive` e `maxSockets` são definidas como `false` e `Infinity`, respectivamente, caso em que `Connection: close` será usado. **Padrão:** `false`.
    - `keepAliveMsecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ao usar a opção `keepAlive`, especifica o [atraso inicial](/pt/nodejs/api/net#socketsetkeepaliveenable-initialdelay) para pacotes TCP Keep-Alive. Ignorado quando a opção `keepAlive` é `false` ou `undefined`. **Padrão:** `1000`.
    - `maxSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número máximo de sockets permitidos por host. Se o mesmo host abrir várias conexões simultâneas, cada solicitação usará um novo socket até que o valor `maxSockets` seja atingido. Se o host tentar abrir mais conexões do que `maxSockets`, as solicitações adicionais entrarão em uma fila de solicitações pendentes e entrarão no estado de conexão ativa quando uma conexão existente for encerrada. Isso garante que haja no máximo `maxSockets` conexões ativas em qualquer ponto no tempo, de um determinado host. **Padrão:** `Infinity`.
    - `maxTotalSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número máximo de sockets permitidos para todos os hosts no total. Cada solicitação usará um novo socket até que o máximo seja atingido. **Padrão:** `Infinity`.
    - `maxFreeSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número máximo de sockets por host para deixar aberto em um estado livre. Relevante apenas se `keepAlive` estiver definido como `true`. **Padrão:** `256`.
    - `scheduling` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Estratégia de agendamento a ser aplicada ao escolher o próximo socket livre a ser usado. Pode ser `'fifo'` ou `'lifo'`. A principal diferença entre as duas estratégias de agendamento é que `'lifo'` seleciona o socket usado mais recentemente, enquanto `'fifo'` seleciona o socket usado menos recentemente. No caso de uma baixa taxa de solicitação por segundo, o agendamento `'lifo'` diminuirá o risco de escolher um socket que pode ter sido fechado pelo servidor devido à inatividade. No caso de uma alta taxa de solicitação por segundo, o agendamento `'fifo'` maximizará o número de sockets abertos, enquanto o agendamento `'lifo'` o manterá o mais baixo possível. **Padrão:** `'lifo'`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tempo limite do socket em milissegundos. Isso definirá o tempo limite quando o socket for criado.

`options` em [`socket.connect()`](/pt/nodejs/api/net#socketconnectoptions-connectlistener) também são suportados.

Para configurar qualquer um deles, uma instância [`http.Agent`](/pt/nodejs/api/http#class-httpagent) personalizada deve ser criada.

::: code-group
```js [ESM]
import { Agent, request } from 'node:http';
const keepAliveAgent = new Agent({ keepAlive: true });
options.agent = keepAliveAgent;
request(options, onResponseCallback);
```

```js [CJS]
const http = require('node:http');
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);
```
:::


### `agent.createConnection(options[, callback])` {#agentcreateconnectionoptions-callback}

**Adicionado em: v0.11.4**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções contendo detalhes da conexão. Verifique [`net.createConnection()`](/pt/nodejs/api/net#netcreateconnectionoptions-connectlistener) para o formato das opções
- `callback` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função de retorno que recebe o socket criado
- Retorna: [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Produz um socket/stream para ser usado para requisições HTTP.

Por padrão, esta função é a mesma que [`net.createConnection()`](/pt/nodejs/api/net#netcreateconnectionoptions-connectlistener). No entanto, agentes personalizados podem substituir este método caso seja desejada maior flexibilidade.

Um socket/stream pode ser fornecido de uma das duas maneiras: retornando o socket/stream desta função ou passando o socket/stream para `callback`.

Este método garante retornar uma instância da classe [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket), uma subclasse de [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex), a menos que o usuário especifique um tipo de socket diferente de [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket).

`callback` tem a assinatura `(err, stream)`.

### `agent.keepSocketAlive(socket)` {#agentkeepsocketalivesocket}

**Adicionado em: v8.1.0**

- `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Chamado quando `socket` é desconectado de uma requisição e pode ser persistido pelo `Agent`. O comportamento padrão é:

```js [ESM]
socket.setKeepAlive(true, this.keepAliveMsecs);
socket.unref();
return true;
```
Este método pode ser substituído por uma subclasse `Agent` específica. Se este método retornar um valor falso, o socket será destruído em vez de persistir para uso com a próxima requisição.

O argumento `socket` pode ser uma instância de [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket), uma subclasse de [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex).

### `agent.reuseSocket(socket, request)` {#agentreusesocketsocket-request}

**Adicionado em: v8.1.0**

- `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)
- `request` [\<http.ClientRequest\>](/pt/nodejs/api/http#class-httpclientrequest)

Chamado quando `socket` é anexado a `request` após ser persistido devido às opções de keep-alive. O comportamento padrão é:

```js [ESM]
socket.ref();
```
Este método pode ser substituído por uma subclasse `Agent` específica.

O argumento `socket` pode ser uma instância de [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket), uma subclasse de [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex).


### `agent.destroy()` {#agentdestroy}

**Adicionado em: v0.11.4**

Destrói todos os sockets que estão atualmente em uso pelo agente.

Geralmente não é necessário fazer isso. No entanto, se estiver usando um agente com `keepAlive` habilitado, é melhor desligar explicitamente o agente quando ele não for mais necessário. Caso contrário, os sockets podem permanecer abertos por um longo tempo antes que o servidor os termine.

### `agent.freeSockets` {#agentfreesockets}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v16.0.0 | A propriedade agora tem um protótipo `null`. |
| v0.11.4 | Adicionado em: v0.11.4 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Um objeto que contém arrays de sockets atualmente aguardando uso pelo agente quando `keepAlive` está habilitado. Não modifique.

Sockets na lista `freeSockets` serão automaticamente destruídos e removidos do array em `'timeout'`.

### `agent.getName([options])` {#agentgetnameoptions}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v17.7.0, v16.15.0 | O parâmetro `options` agora é opcional. |
| v0.11.4 | Adicionado em: v0.11.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um conjunto de opções que fornecem informações para a geração de nomes
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um nome de domínio ou endereço IP do servidor para emitir a solicitação
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta do servidor remoto
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Interface local para vincular para conexões de rede ao emitir a solicitação
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Deve ser 4 ou 6 se isso não for igual a `undefined`.
  
 
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtenha um nome exclusivo para um conjunto de opções de solicitação, para determinar se uma conexão pode ser reutilizada. Para um agente HTTP, isso retorna `host:port:localAddress` ou `host:port:localAddress:family`. Para um agente HTTPS, o nome inclui o CA, cert, ciphers e outras opções específicas de HTTPS/TLS que determinam a reutilização do socket.


### `agent.maxFreeSockets` {#agentmaxfreesockets}

**Adicionado em: v0.11.7**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Por padrão, definido como 256. Para agentes com `keepAlive` habilitado, isso define o número máximo de sockets que permanecerão abertos no estado livre.

### `agent.maxSockets` {#agentmaxsockets}

**Adicionado em: v0.3.6**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Por padrão, definido como `Infinity`. Determina quantos sockets simultâneos o agente pode ter abertos por origem. Origem é o valor retornado de [`agent.getName()`](/pt/nodejs/api/http#agentgetnameoptions).

### `agent.maxTotalSockets` {#agentmaxtotalsockets}

**Adicionado em: v14.5.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Por padrão, definido como `Infinity`. Determina quantos sockets simultâneos o agente pode ter abertos. Ao contrário de `maxSockets`, este parâmetro se aplica a todas as origens.

### `agent.requests` {#agentrequests}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0 | A propriedade agora tem um protótipo `null`. |
| v0.5.9 | Adicionado em: v0.5.9 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Um objeto que contém filas de solicitações que ainda não foram atribuídas a sockets. Não modifique.

### `agent.sockets` {#agentsockets}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0 | A propriedade agora tem um protótipo `null`. |
| v0.3.6 | Adicionado em: v0.3.6 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Um objeto que contém arrays de sockets atualmente em uso pelo agente. Não modifique.

## Classe: `http.ClientRequest` {#class-httpclientrequest}

**Adicionado em: v0.1.17**

- Estende: [\<http.OutgoingMessage\>](/pt/nodejs/api/http#class-httpoutgoingmessage)

Este objeto é criado internamente e retornado de [`http.request()`](/pt/nodejs/api/http#httprequestoptions-callback). Ele representa uma solicitação *em andamento* cujo cabeçalho já foi enfileirado. O cabeçalho ainda é mutável usando a API [`setHeader(name, value)`](/pt/nodejs/api/http#requestsetheadername-value), [`getHeader(name)`](/pt/nodejs/api/http#requestgetheadername), [`removeHeader(name)`](/pt/nodejs/api/http#requestremoveheadername). O cabeçalho real será enviado junto com o primeiro bloco de dados ou ao chamar [`request.end()`](/pt/nodejs/api/http#requestenddata-encoding-callback).

Para obter a resposta, adicione um listener para [`'response'`](/pt/nodejs/api/http#event-response) ao objeto de solicitação. [`'response'`](/pt/nodejs/api/http#event-response) será emitido do objeto de solicitação quando os cabeçalhos de resposta forem recebidos. O evento [`'response'`](/pt/nodejs/api/http#event-response) é executado com um argumento que é uma instância de [`http.IncomingMessage`](/pt/nodejs/api/http#class-httpincomingmessage).

Durante o evento [`'response'`](/pt/nodejs/api/http#event-response), pode-se adicionar listeners ao objeto de resposta; particularmente para ouvir o evento `'data'`.

Se nenhum manipulador [`'response'`](/pt/nodejs/api/http#event-response) for adicionado, a resposta será totalmente descartada. No entanto, se um manipulador de evento [`'response'`](/pt/nodejs/api/http#event-response) for adicionado, os dados do objeto de resposta **devem** ser consumidos, seja chamando `response.read()` sempre que houver um evento `'readable'`, ou adicionando um manipulador `'data'`, ou chamando o método `.resume()`. Até que os dados sejam consumidos, o evento `'end'` não será disparado. Além disso, até que os dados sejam lidos, eles consumirão memória que pode eventualmente levar a um erro de 'processo sem memória'.

Para compatibilidade com versões anteriores, `res` só emitirá `'error'` se houver um listener `'error'` registrado.

Defina o cabeçalho `Content-Length` para limitar o tamanho do corpo da resposta. Se [`response.strictContentLength`](/pt/nodejs/api/http#responsestrictcontentlength) estiver definido como `true`, a incompatibilidade com o valor do cabeçalho `Content-Length` resultará em um `Error` sendo lançado, identificado por `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/pt/nodejs/api/errors#err_http_content_length_mismatch).

O valor de `Content-Length` deve estar em bytes, não em caracteres. Use [`Buffer.byteLength()`](/pt/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) para determinar o comprimento do corpo em bytes.


### Evento: `'abort'` {#event-abort}

**Adicionado em: v1.4.1**

**Obsoleto desde: v17.0.0, v16.12.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Ouça o evento `'close'` em vez disso.
:::

Emitido quando a solicitação foi abortada pelo cliente. Este evento é emitido apenas na primeira chamada para `abort()`.

### Evento: `'close'` {#event-close}

**Adicionado em: v0.5.4**

Indica que a solicitação foi concluída ou que sua conexão subjacente foi encerrada prematuramente (antes da conclusão da resposta).

### Evento: `'connect'` {#event-connect}

**Adicionado em: v0.7.0**

- `response` [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Emitido cada vez que um servidor responde a uma solicitação com um método `CONNECT`. Se este evento não estiver sendo ouvido, os clientes que receberem um método `CONNECT` terão suas conexões fechadas.

Este evento tem a garantia de receber uma instância da classe [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket), uma subclasse de [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex), a menos que o usuário especifique um tipo de socket diferente de [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket).

Um par cliente e servidor demonstrando como ouvir o evento `'connect'`:

::: code-group
```js [ESM]
import { createServer, request } from 'node:http';
import { connect } from 'node:net';
import { URL } from 'node:url';

// Create an HTTP tunneling proxy
const proxy = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// Now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {

  // Make a request to a tunneling proxy
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // Make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```

```js [CJS]
const http = require('node:http');
const net = require('node:net');
const { URL } = require('node:url');

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// Now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {

  // Make a request to a tunneling proxy
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // Make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```
:::


### Evento: `'continue'` {#event-continue}

**Adicionado em: v0.3.2**

Emitido quando o servidor envia uma resposta HTTP '100 Continue', geralmente porque a solicitação continha 'Expect: 100-continue'. Esta é uma instrução para que o cliente envie o corpo da solicitação.

### Evento: `'finish'` {#event-finish}

**Adicionado em: v0.3.6**

Emitido quando a solicitação foi enviada. Mais especificamente, este evento é emitido quando o último segmento dos cabeçalhos e do corpo da resposta foram entregues ao sistema operacional para transmissão pela rede. Não implica que o servidor tenha recebido algo ainda.

### Evento: `'information'` {#event-information}

**Adicionado em: v10.0.0**

- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `httpVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `httpVersionMajor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `httpVersionMinor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rawHeaders` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Emitido quando o servidor envia uma resposta intermediária 1xx (excluindo 101 Upgrade). Os listeners deste evento receberão um objeto contendo a versão HTTP, o código de status, a mensagem de status, o objeto de cabeçalhos chave-valor e um array com os nomes dos cabeçalhos brutos seguidos por seus respectivos valores.



::: code-group
```js [ESM]
import { request } from 'node:http';

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```

```js [CJS]
const http = require('node:http');

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = http.request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```
:::

Status 101 Upgrade não acionam este evento devido à sua quebra da cadeia tradicional de solicitação/resposta HTTP, como web sockets, upgrades TLS in-place ou HTTP 2.0. Para ser notificado sobre avisos 101 Upgrade, ouça o evento [`'upgrade'`](/pt/nodejs/api/http#event-upgrade) em vez disso.


### Evento: `'response'` {#event-response}

**Adicionado em: v0.1.0**

- `response` [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage)

Emitido quando uma resposta é recebida para esta requisição. Este evento é emitido apenas uma vez.

### Evento: `'socket'` {#event-socket}

**Adicionado em: v0.5.3**

- `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

É garantido que este evento receberá uma instância da classe [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket), uma subclasse de [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex), a menos que o usuário especifique um tipo de socket diferente de [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket).

### Evento: `'timeout'` {#event-timeout}

**Adicionado em: v0.7.8**

Emitido quando o socket subjacente atinge o tempo limite devido à inatividade. Isso apenas notifica que o socket está ocioso. A requisição deve ser destruída manualmente.

Veja também: [`request.setTimeout()`](/pt/nodejs/api/http#requestsettimeouttimeout-callback).

### Evento: `'upgrade'` {#event-upgrade}

**Adicionado em: v0.1.94**

- `response` [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Emitido cada vez que um servidor responde a uma requisição com um upgrade. Se este evento não estiver sendo escutado e o código de status da resposta for 101 Switching Protocols, os clientes que receberem um cabeçalho de upgrade terão suas conexões fechadas.

É garantido que este evento receberá uma instância da classe [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket), uma subclasse de [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex), a menos que o usuário especifique um tipo de socket diferente de [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket).

Um par cliente-servidor demonstrando como escutar o evento `'upgrade'`.



::: code-group
```js [ESM]
import http from 'node:http';
import process from 'node:process';

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// Now that server is running
server.listen(1337, '127.0.0.1', () => {

  // make a request
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```

```js [CJS]
const http = require('node:http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// Now that server is running
server.listen(1337, '127.0.0.1', () => {

  // make a request
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```
:::


### `request.abort()` {#requestabort}

**Adicionado em: v0.3.8**

**Obsoleto desde: v14.1.0, v13.14.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`request.destroy()`](/pt/nodejs/api/http#requestdestroyerror) em vez disso.
:::

Marca a solicitação como sendo abortada. Chamar isso fará com que os dados restantes na resposta sejam descartados e o socket seja destruído.

### `request.aborted` {#requestaborted}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.0.0, v16.12.0 | Obsoleto desde: v17.0.0, v16.12.0 |
| v11.0.0 | A propriedade `aborted` não é mais um número de timestamp. |
| v0.11.14 | Adicionado em: v0.11.14 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Verifique [`request.destroyed`](/pt/nodejs/api/http#requestdestroyed) em vez disso.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

A propriedade `request.aborted` será `true` se a solicitação tiver sido abortada.

### `request.connection` {#requestconnection}

**Adicionado em: v0.3.0**

**Obsoleto desde: v13.0.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Use [`request.socket`](/pt/nodejs/api/http#requestsocket).
:::

- [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Veja [`request.socket`](/pt/nodejs/api/http#requestsocket).

### `request.cork()` {#requestcork}

**Adicionado em: v13.2.0, v12.16.0**

Veja [`writable.cork()`](/pt/nodejs/api/stream#writablecork).

### `request.end([data[, encoding]][, callback])` {#requestenddata-encoding-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | O parâmetro `data` agora pode ser um `Uint8Array`. |
| v10.0.0 | Este método agora retorna uma referência a `ClientRequest`. |
| v0.1.90 | Adicionado em: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Termina de enviar a solicitação. Se alguma parte do corpo não for enviada, ela será enviada para o fluxo. Se a solicitação for dividida em partes, isso enviará o `'0\r\n\r\n'` de terminação.

Se `data` for especificado, é equivalente a chamar [`request.write(data, encoding)`](/pt/nodejs/api/http#requestwritechunk-encoding-callback) seguido por `request.end(callback)`.

Se `callback` for especificado, ele será chamado quando o fluxo de solicitação for concluído.


### `request.destroy([error])` {#requestdestroyerror}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v14.5.0 | A função retorna `this` para consistência com outros streams Readable. |
| v0.3.0 | Adicionado em: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Opcional, um erro para emitir com o evento `'error'`.
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Destrói a requisição. Opcionalmente, emite um evento `'error'` e emite um evento `'close'`. Chamar isso fará com que os dados restantes na resposta sejam descartados e o socket seja destruído.

Veja [`writable.destroy()`](/pt/nodejs/api/stream#writabledestroyerror) para mais detalhes.

#### `request.destroyed` {#requestdestroyed}

**Adicionado em: v14.1.0, v13.14.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` após [`request.destroy()`](/pt/nodejs/api/http#requestdestroyerror) ter sido chamado.

Veja [`writable.destroyed`](/pt/nodejs/api/stream#writabledestroyed) para mais detalhes.

### `request.finished` {#requestfinished}

**Adicionado em: v0.0.1**

**Obsoleto desde: v13.4.0, v12.16.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Use [`request.writableEnded`](/pt/nodejs/api/http#requestwritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

A propriedade `request.finished` será `true` se [`request.end()`](/pt/nodejs/api/http#requestenddata-encoding-callback) tiver sido chamado. `request.end()` será chamado automaticamente se a requisição foi iniciada via [`http.get()`](/pt/nodejs/api/http#httpgetoptions-callback).

### `request.flushHeaders()` {#requestflushheaders}

**Adicionado em: v1.6.0**

Descarrega os cabeçalhos da requisição.

Por razões de eficiência, o Node.js normalmente armazena em buffer os cabeçalhos da requisição até que `request.end()` seja chamado ou o primeiro bloco de dados da requisição seja escrito. Em seguida, ele tenta compactar os cabeçalhos e dados da requisição em um único pacote TCP.

Isso geralmente é desejado (economiza um round-trip TCP), mas não quando os primeiros dados não são enviados até possivelmente muito mais tarde. `request.flushHeaders()` ignora a otimização e inicia a requisição.


### `request.getHeader(name)` {#requestgetheadername}

**Adicionado em: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Lê um cabeçalho na requisição. O nome não diferencia maiúsculas de minúsculas. O tipo do valor de retorno depende dos argumentos fornecidos para [`request.setHeader()`](/pt/nodejs/api/http#requestsetheadername-value).

```js [ESM]
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType' é 'text/html'
const contentLength = request.getHeader('Content-Length');
// 'contentLength' é do tipo number
const cookie = request.getHeader('Cookie');
// 'cookie' é do tipo string[]
```
### `request.getHeaderNames()` {#requestgetheadernames}

**Adicionado em: v7.7.0**

- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna um array contendo os nomes únicos dos cabeçalhos de saída atuais. Todos os nomes de cabeçalho estão em minúsculas.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getHeaderNames();
// headerNames === ['foo', 'cookie']
```
### `request.getHeaders()` {#requestgetheaders}

**Adicionado em: v7.7.0**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna uma cópia superficial dos cabeçalhos de saída atuais. Como uma cópia superficial é usada, os valores do array podem ser mutados sem chamadas adicionais para vários métodos do módulo http relacionados ao cabeçalho. As chaves do objeto retornado são os nomes dos cabeçalhos e os valores são os respectivos valores dos cabeçalhos. Todos os nomes de cabeçalho estão em minúsculas.

O objeto retornado pelo método `request.getHeaders()` *não* herda prototipicamente do `Object` JavaScript. Isso significa que métodos típicos do `Object`, como `obj.toString()`, `obj.hasOwnProperty()` e outros, não são definidos e *não funcionarão*.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headers = request.getHeaders();
// headers === { foo: 'bar', 'cookie': ['foo=bar', 'bar=baz'] }
```

### `request.getRawHeaderNames()` {#requestgetrawheadernames}

**Adicionado em: v15.13.0, v14.17.0**

- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna um array contendo os nomes únicos dos headers brutos de saída atuais. Os nomes dos headers são retornados com o seu casing exato definido.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getRawHeaderNames();
// headerNames === ['Foo', 'Set-Cookie']
```
### `request.hasHeader(name)` {#requesthasheadername}

**Adicionado em: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o header identificado por `name` está atualmente definido nos headers de saída. A correspondência do nome do header não diferencia maiúsculas de minúsculas.

```js [ESM]
const hasContentType = request.hasHeader('content-type');
```
### `request.maxHeadersCount` {#requestmaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `2000`

Limita a contagem máxima de headers de resposta. Se definido como 0, nenhum limite será aplicado.

### `request.path` {#requestpath}

**Adicionado em: v0.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O caminho da requisição.

### `request.method` {#requestmethod}

**Adicionado em: v0.1.97**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O método da requisição.

### `request.host` {#requesthost}

**Adicionado em: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O host da requisição.

### `request.protocol` {#requestprotocol}

**Adicionado em: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O protocolo da requisição.

### `request.removeHeader(name)` {#requestremoveheadername}

**Adicionado em: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Remove um header que já está definido no objeto de headers.

```js [ESM]
request.removeHeader('Content-Type');
```

### `request.reusedSocket` {#requestreusedsocket}

**Adicionado em: v13.0.0, v12.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se a requisição é enviada através de um socket reutilizado.

Ao enviar uma requisição através de um agente com keep-alive habilitado, o socket subjacente pode ser reutilizado. Mas se o servidor fechar a conexão em um momento infeliz, o cliente pode encontrar um erro 'ECONNRESET'.

::: code-group
```js [ESM]
import http from 'node:http';

// O servidor tem um timeout de keep-alive de 5 segundos por padrão
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Adaptando um agente keep-alive
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // Não faça nada
    });
  });
}, 5000); // Enviando a requisição em um intervalo de 5s para que seja fácil atingir o timeout de inatividade
```

```js [CJS]
const http = require('node:http');

// O servidor tem um timeout de keep-alive de 5 segundos por padrão
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Adaptando um agente keep-alive
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // Não faça nada
    });
  });
}, 5000); // Enviando a requisição em um intervalo de 5s para que seja fácil atingir o timeout de inatividade
```
:::

Ao marcar uma requisição se ela reutilizou o socket ou não, podemos fazer uma nova tentativa automática de erro com base nisso.

::: code-group
```js [ESM]
import http from 'node:http';
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // Verifique se é necessário tentar novamente
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```

```js [CJS]
const http = require('node:http');
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // Verifique se é necessário tentar novamente
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```
:::


### `request.setHeader(name, value)` {#requestsetheadername-value}

**Adicionado em: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Define um único valor de cabeçalho para o objeto de cabeçalhos. Se este cabeçalho já existir nos cabeçalhos a serem enviados, seu valor será substituído. Use um array de strings aqui para enviar múltiplos cabeçalhos com o mesmo nome. Valores não string serão armazenados sem modificação. Portanto, [`request.getHeader()`](/pt/nodejs/api/http#requestgetheadername) pode retornar valores não string. No entanto, os valores não string serão convertidos em strings para transmissão na rede.

```js [ESM]
request.setHeader('Content-Type', 'application/json');
```
ou

```js [ESM]
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
```
Quando o valor for uma string, uma exceção será lançada se contiver caracteres fora da codificação `latin1`.

Se você precisar passar caracteres UTF-8 no valor, codifique o valor usando o padrão [RFC 8187](https://www.rfc-editor.org/rfc/rfc8187.txt).

```js [ESM]
const filename = 'Rock 🎵.txt';
request.setHeader('Content-Disposition', `attachment; filename*=utf-8''${encodeURIComponent(filename)}`);
```
### `request.setNoDelay([noDelay])` {#requestsetnodelaynodelay}

**Adicionado em: v0.5.9**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Uma vez que um socket é atribuído a esta requisição e está conectado, [`socket.setNoDelay()`](/pt/nodejs/api/net#socketsetnodelaynodelay) será chamado.

### `request.setSocketKeepAlive([enable][, initialDelay])` {#requestsetsocketkeepaliveenable-initialdelay}

**Adicionado em: v0.5.9**

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Uma vez que um socket é atribuído a esta requisição e está conectado, [`socket.setKeepAlive()`](/pt/nodejs/api/net#socketsetkeepaliveenable-initialdelay) será chamado.


### `request.setTimeout(timeout[, callback])` {#requestsettimeouttimeout-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v9.0.0 | Define consistentemente o timeout do socket apenas quando o socket se conecta. |
| v0.5.9 | Adicionado em: v0.5.9 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Milissegundos antes que uma requisição atinja o timeout.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função opcional a ser chamada quando um timeout ocorrer. O mesmo que vincular ao evento `'timeout'`.
- Retorna: [\<http.ClientRequest\>](/pt/nodejs/api/http#class-httpclientrequest)

Uma vez que um socket é atribuído a esta requisição e está conectado, [`socket.setTimeout()`](/pt/nodejs/api/net#socketsettimeouttimeout-callback) será chamado.

### `request.socket` {#requestsocket}

**Adicionado em: v0.3.0**

- [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Referência ao socket subjacente. Normalmente, os usuários não desejarão acessar essa propriedade. Em particular, o socket não emitirá eventos `'readable'` por causa de como o analisador de protocolo se conecta ao socket.

::: code-group
```js [ESM]
import http from 'node:http';
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // Consume response object
});
```

```js [CJS]
const http = require('node:http');
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // Consume response object
});
```
:::

Esta propriedade tem a garantia de ser uma instância da classe [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket), uma subclasse de [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex), a menos que o usuário especifique um tipo de socket diferente de [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket).


### `request.uncork()` {#requestuncork}

**Adicionado em: v13.2.0, v12.16.0**

Veja [`writable.uncork()`](/pt/nodejs/api/stream#writableuncork).

### `request.writableEnded` {#requestwritableended}

**Adicionado em: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` depois que [`request.end()`](/pt/nodejs/api/http#requestenddata-encoding-callback) foi chamado. Esta propriedade não indica se os dados foram descarregados, para isso use [`request.writableFinished`](/pt/nodejs/api/http#requestwritablefinished) em vez disso.

### `request.writableFinished` {#requestwritablefinished}

**Adicionado em: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` se todos os dados foram descarregados para o sistema subjacente, imediatamente antes do evento [`'finish'`](/pt/nodejs/api/http#event-finish) ser emitido.

### `request.write(chunk[, encoding][, callback])` {#requestwritechunk-encoding-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | O parâmetro `chunk` agora pode ser um `Uint8Array`. |
| v0.1.29 | Adicionado em: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Envia um pedaço do corpo. Este método pode ser chamado várias vezes. Se nenhum `Content-Length` for definido, os dados serão automaticamente codificados na codificação de transferência HTTP Chunked, para que o servidor saiba quando os dados terminam. O cabeçalho `Transfer-Encoding: chunked` é adicionado. Chamar [`request.end()`](/pt/nodejs/api/http#requestenddata-encoding-callback) é necessário para terminar de enviar a solicitação.

O argumento `encoding` é opcional e se aplica apenas quando `chunk` é uma string. O padrão é `'utf8'`.

O argumento `callback` é opcional e será chamado quando este pedaço de dados for descarregado, mas apenas se o pedaço não estiver vazio.

Retorna `true` se todos os dados foram descarregados com sucesso para o buffer do kernel. Retorna `false` se toda ou parte dos dados foi enfileirada na memória do usuário. `'drain'` será emitido quando o buffer estiver livre novamente.

Quando a função `write` é chamada com uma string ou buffer vazio, ela não faz nada e espera por mais entrada.


## Classe: `http.Server` {#class-httpserver}

**Adicionado em: v0.1.17**

- Estende: [\<net.Server\>](/pt/nodejs/api/net#class-netserver)

### Evento: `'checkContinue'` {#event-checkcontinue}

**Adicionado em: v0.3.0**

- `request` [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/pt/nodejs/api/http#class-httpserverresponse)

Emitido cada vez que um pedido com um HTTP `Expect: 100-continue` é recebido. Se este evento não for escutado, o servidor responderá automaticamente com um `100 Continue` conforme apropriado.

Lidar com este evento envolve chamar [`response.writeContinue()`](/pt/nodejs/api/http#responsewritecontinue) se o cliente deve continuar a enviar o corpo do pedido, ou gerar uma resposta HTTP apropriada (e.g. 400 Bad Request) se o cliente não deve continuar a enviar o corpo do pedido.

Quando este evento é emitido e tratado, o evento [`'request'`](/pt/nodejs/api/http#event-request) não será emitido.

### Evento: `'checkExpectation'` {#event-checkexpectation}

**Adicionado em: v5.5.0**

- `request` [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/pt/nodejs/api/http#class-httpserverresponse)

Emitido cada vez que um pedido com um cabeçalho HTTP `Expect` é recebido, onde o valor não é `100-continue`. Se este evento não for escutado, o servidor responderá automaticamente com um `417 Expectation Failed` conforme apropriado.

Quando este evento é emitido e tratado, o evento [`'request'`](/pt/nodejs/api/http#event-request) não será emitido.

### Evento: `'clientError'` {#event-clienterror}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.0.0 | O comportamento padrão retornará um 431 Request Header Fields Too Large se ocorrer um erro HPE_HEADER_OVERFLOW. |
| v9.4.0 | O `rawPacket` é o buffer atual que acabou de ser analisado. Adicionar este buffer ao objeto de erro do evento `'clientError'` serve para que os desenvolvedores possam registrar o pacote corrompido. |
| v6.0.0 | A ação padrão de chamar `.destroy()` no `socket` não ocorrerá mais se houver listeners anexados para `'clientError'`. |
| v0.1.94 | Adicionado em: v0.1.94 |
:::

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Se uma conexão de cliente emitir um evento `'error'`, ele será encaminhado aqui. O listener deste evento é responsável por fechar/destruir o socket subjacente. Por exemplo, pode-se desejar fechar o socket de forma mais elegante com uma resposta HTTP personalizada em vez de interromper abruptamente a conexão. O socket **deve ser fechado ou destruído** antes que o listener termine.

Este evento tem a garantia de receber uma instância da classe [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket), uma subclasse de [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex), a menos que o usuário especifique um tipo de socket diferente de [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket).

O comportamento padrão é tentar fechar o socket com um HTTP '400 Bad Request', ou um HTTP '431 Request Header Fields Too Large' no caso de um erro [`HPE_HEADER_OVERFLOW`](/pt/nodejs/api/errors#hpe_header_overflow). Se o socket não for gravável ou os cabeçalhos do [`http.ServerResponse`](/pt/nodejs/api/http#class-httpserverresponse) anexado atualmente tiverem sido enviados, ele será imediatamente destruído.

`socket` é o objeto [`net.Socket`](/pt/nodejs/api/net#class-netsocket) de onde o erro se originou.

::: code-group
```js [ESM]
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```

```js [CJS]
const http = require('node:http');

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```
:::

Quando o evento `'clientError'` ocorre, não há objeto `request` ou `response`, então qualquer resposta HTTP enviada, incluindo cabeçalhos de resposta e payload, *deve* ser escrita diretamente no objeto `socket`. Deve-se tomar cuidado para garantir que a resposta seja uma mensagem de resposta HTTP formatada corretamente.

`err` é uma instância de `Error` com duas colunas extras:

- `bytesParsed`: a contagem de bytes do pacote de requisição que o Node.js pode ter analisado corretamente;
- `rawPacket`: o pacote bruto da requisição atual.

Em alguns casos, o cliente já recebeu a resposta e/ou o socket já foi destruído, como no caso de erros `ECONNRESET`. Antes de tentar enviar dados para o socket, é melhor verificar se ele ainda é gravável.

```js [ESM]
server.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
```

### Evento: `'close'` {#event-close_1}

**Adicionado em: v0.1.4**

Emitido quando o servidor fecha.

### Evento: `'connect'` {#event-connect_1}

**Adicionado em: v0.7.0**

- `request` [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage) Argumentos para a solicitação HTTP, como está no evento [`'request'`](/pt/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex) Socket de rede entre o servidor e o cliente
- `head` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) O primeiro pacote do fluxo de tunelamento (pode estar vazio)

Emitido cada vez que um cliente solicita um método HTTP `CONNECT`. Se este evento não for escutado, os clientes que solicitarem um método `CONNECT` terão suas conexões fechadas.

Este evento tem a garantia de receber uma instância da classe [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket), uma subclasse de [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex), a menos que o usuário especifique um tipo de socket diferente de [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket).

Após a emissão deste evento, o socket da solicitação não terá um listener de evento `'data'`, o que significa que ele precisará ser vinculado para lidar com os dados enviados ao servidor naquele socket.

### Evento: `'connection'` {#event-connection}

**Adicionado em: v0.1.0**

- `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Este evento é emitido quando um novo fluxo TCP é estabelecido. `socket` é tipicamente um objeto do tipo [`net.Socket`](/pt/nodejs/api/net#class-netsocket). Normalmente, os usuários não desejam acessar este evento. Em particular, o socket não emitirá eventos `'readable'` devido à forma como o analisador de protocolo se conecta ao socket. O `socket` também pode ser acessado em `request.socket`.

Este evento também pode ser emitido explicitamente pelos usuários para injetar conexões no servidor HTTP. Nesse caso, qualquer fluxo [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) pode ser passado.

Se `socket.setTimeout()` for chamado aqui, o tempo limite será substituído por `server.keepAliveTimeout` quando o socket tiver servido uma solicitação (se `server.keepAliveTimeout` for diferente de zero).

Este evento tem a garantia de receber uma instância da classe [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket), uma subclasse de [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex), a menos que o usuário especifique um tipo de socket diferente de [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket).


### Evento: `'dropRequest'` {#event-droprequest}

**Adicionado em: v18.7.0, v16.17.0**

- `request` [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage) Argumentos para a requisição HTTP, como no evento [`'request'`](/pt/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex) Socket de rede entre o servidor e o cliente

Quando o número de requisições em um socket atinge o limite de `server.maxRequestsPerSocket`, o servidor descartará novas requisições e emitirá o evento `'dropRequest'` em vez disso, e então enviará `503` para o cliente.

### Evento: `'request'` {#event-request}

**Adicionado em: v0.1.0**

- `request` [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/pt/nodejs/api/http#class-httpserverresponse)

Emitido cada vez que há uma requisição. Pode haver múltiplas requisições por conexão (no caso de conexões HTTP Keep-Alive).

### Evento: `'upgrade'` {#event-upgrade_1}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Não escutar este evento não causa mais a destruição do socket se um cliente enviar um cabeçalho Upgrade. |
| v0.1.94 | Adicionado em: v0.1.94 |
:::

- `request` [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage) Argumentos para a requisição HTTP, como no evento [`'request'`](/pt/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex) Socket de rede entre o servidor e o cliente
- `head` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) O primeiro pacote do stream atualizado (pode estar vazio)

Emitido cada vez que um cliente solicita um upgrade HTTP. Escutar este evento é opcional e os clientes não podem insistir em uma mudança de protocolo.

Após a emissão deste evento, o socket da requisição não terá um listener de evento `'data'`, o que significa que ele precisará ser vinculado para lidar com os dados enviados ao servidor naquele socket.

Este evento tem a garantia de receber uma instância da classe [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket), uma subclasse de [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex), a menos que o usuário especifique um tipo de socket diferente de [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket).


### `server.close([callback])` {#serverclosecallback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.0.0 | O método fecha conexões ociosas antes de retornar. |
| v0.1.90 | Adicionado em: v0.1.90 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Impede que o servidor aceite novas conexões e fecha todas as conexões conectadas a este servidor que não estão enviando uma solicitação ou esperando por uma resposta. Consulte [`net.Server.close()`](/pt/nodejs/api/net#serverclosecallback).

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Fecha o servidor após 10 segundos
setTimeout(() => {
  server.close(() => {
    console.log('servidor na porta 8000 fechado com sucesso');
  });
}, 10000);
```
### `server.closeAllConnections()` {#servercloseallconnections}

**Adicionado em: v18.2.0**

Fecha todas as conexões HTTP(S) estabelecidas conectadas a este servidor, incluindo conexões ativas conectadas a este servidor que estão enviando uma solicitação ou esperando por uma resposta. Isso *não* destrói sockets atualizados para um protocolo diferente, como WebSocket ou HTTP/2.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Fecha o servidor após 10 segundos
setTimeout(() => {
  server.close(() => {
    console.log('servidor na porta 8000 fechado com sucesso');
  });
  // Fecha todas as conexões, garantindo que o servidor seja fechado com sucesso
  server.closeAllConnections();
}, 10000);
```
### `server.closeIdleConnections()` {#servercloseidleconnections}

**Adicionado em: v18.2.0**

Fecha todas as conexões conectadas a este servidor que não estão enviando uma solicitação ou esperando por uma resposta.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Fecha o servidor após 10 segundos
setTimeout(() => {
  server.close(() => {
    console.log('servidor na porta 8000 fechado com sucesso');
  });
  // Fecha conexões ociosas, como conexões keep-alive. O servidor será fechado
  // assim que as conexões ativas restantes forem encerradas
  server.closeIdleConnections();
}, 10000);
```

### `server.headersTimeout` {#serverheaderstimeout}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.4.0, v18.14.0 | O padrão agora é definido como o mínimo entre 60000 (60 segundos) ou `requestTimeout`. |
| v11.3.0, v10.14.0 | Adicionado em: v11.3.0, v10.14.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** O mínimo entre [`server.requestTimeout`](/pt/nodejs/api/http#serverrequesttimeout) ou `60000`.

Limita a quantidade de tempo que o analisador esperará para receber os cabeçalhos HTTP completos.

Se o tempo limite expirar, o servidor responde com o status 408 sem encaminhar a solicitação para o listener de solicitação e, em seguida, fecha a conexão.

Deve ser definido como um valor diferente de zero (por exemplo, 120 segundos) para proteger contra possíveis ataques de negação de serviço caso o servidor seja implementado sem um proxy reverso na frente.

### `server.listen()` {#serverlisten}

Inicia o servidor HTTP ouvindo as conexões. Este método é idêntico a [`server.listen()`](/pt/nodejs/api/net#serverlisten) de [`net.Server`](/pt/nodejs/api/net#class-netserver).

### `server.listening` {#serverlistening}

**Adicionado em: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se o servidor está ou não ouvindo as conexões.

### `server.maxHeadersCount` {#servermaxheaderscount}

**Adicionado em: v0.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `2000`

Limita a contagem máxima de cabeçalhos de entrada. Se definido como 0, nenhum limite será aplicado.

### `server.requestTimeout` {#serverrequesttimeout}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | O tempo limite de solicitação padrão mudou de nenhum tempo limite para 300s (5 minutos). |
| v14.11.0 | Adicionado em: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `300000`

Define o valor de tempo limite em milissegundos para receber a solicitação inteira do cliente.

Se o tempo limite expirar, o servidor responde com o status 408 sem encaminhar a solicitação para o listener de solicitação e, em seguida, fecha a conexão.

Deve ser definido como um valor diferente de zero (por exemplo, 120 segundos) para proteger contra possíveis ataques de negação de serviço caso o servidor seja implementado sem um proxy reverso na frente.


### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.0.0 | O tempo limite padrão mudou de 120s para 0 (sem tempo limite). |
| v0.9.12 | Adicionado em: v0.9.12 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** 0 (sem tempo limite)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<http.Server\>](/pt/nodejs/api/http#class-httpserver)

Define o valor de tempo limite para sockets e emite um evento `'timeout'` no objeto Server, passando o socket como um argumento, se ocorrer um tempo limite.

Se houver um ouvinte de evento `'timeout'` no objeto Server, ele será chamado com o socket com tempo limite como um argumento.

Por padrão, o Server não define tempo limite para sockets. No entanto, se um retorno de chamada for atribuído ao evento `'timeout'` do Server, os tempos limite devem ser tratados explicitamente.

### `server.maxRequestsPerSocket` {#servermaxrequestspersocket}

**Adicionado em: v16.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Solicitações por socket. **Padrão:** 0 (sem limite)

O número máximo de solicitações que um socket pode lidar antes de fechar a conexão keep-alive.

Um valor de `0` desativará o limite.

Quando o limite é atingido, ele definirá o valor do cabeçalho `Connection` como `close`, mas não fechará a conexão, as solicitações subsequentes enviadas após o limite ser atingido receberão `503 Service Unavailable` como resposta.

### `server.timeout` {#servertimeout}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.0.0 | O tempo limite padrão mudou de 120s para 0 (sem tempo limite). |
| v0.9.12 | Adicionado em: v0.9.12 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tempo limite em milissegundos. **Padrão:** 0 (sem tempo limite)

O número de milissegundos de inatividade antes que um socket seja considerado como tendo excedido o tempo limite.

Um valor de `0` desativará o comportamento de tempo limite nas conexões de entrada.

A lógica de tempo limite do socket é configurada na conexão, portanto, alterar esse valor afeta apenas as novas conexões com o servidor, não as conexões existentes.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**Adicionado em: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Timeout em milissegundos. **Padrão:** `5000` (5 segundos).

O número de milissegundos que um servidor precisa esperar por dados de entrada adicionais, após terminar de escrever a última resposta, antes que um socket seja destruído. Se o servidor receber novos dados antes que o timeout de keep-alive seja disparado, ele irá resetar o timeout de inatividade regular, ou seja, [`server.timeout`](/pt/nodejs/api/http#servertimeout).

Um valor de `0` irá desabilitar o comportamento de timeout de keep-alive em conexões de entrada. Um valor de `0` faz com que o servidor http se comporte de forma similar às versões do Node.js anteriores à 8.0.0, que não tinham um timeout de keep-alive.

A lógica de timeout do socket é configurada na conexão, então alterar este valor apenas afeta novas conexões ao servidor, não quaisquer conexões existentes.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Adicionado em: v20.4.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Chama [`server.close()`](/pt/nodejs/api/http#serverclosecallback) e retorna uma promise que é cumprida quando o servidor foi fechado.

## Classe: `http.ServerResponse` {#class-httpserverresponse}

**Adicionado em: v0.1.17**

- Estende: [\<http.OutgoingMessage\>](/pt/nodejs/api/http#class-httpoutgoingmessage)

Este objeto é criado internamente por um servidor HTTP, não pelo usuário. Ele é passado como o segundo parâmetro para o evento [`'request'`](/pt/nodejs/api/http#event-request).

### Evento: `'close'` {#event-close_2}

**Adicionado em: v0.6.7**

Indica que a resposta foi concluída, ou que sua conexão subjacente foi terminada prematuramente (antes da conclusão da resposta).

### Evento: `'finish'` {#event-finish_1}

**Adicionado em: v0.3.6**

Emitido quando a resposta foi enviada. Mais especificamente, este evento é emitido quando o último segmento dos cabeçalhos e corpo da resposta foram entregues ao sistema operacional para transmissão pela rede. Não implica que o cliente tenha recebido algo ainda.


### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**Adicionado em: v0.3.0**

- `headers` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Este método adiciona cabeçalhos HTTP de trailer (um cabeçalho, mas no final da mensagem) à resposta.

Os trailers **só** serão emitidos se a codificação em partes for usada para a resposta; se não for (por exemplo, se a solicitação foi HTTP/1.0), eles serão descartados silenciosamente.

O HTTP requer que o cabeçalho `Trailer` seja enviado para emitir trailers, com uma lista dos campos de cabeçalho em seu valor. Exemplo:

```js [ESM]
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
```
A tentativa de definir um nome de campo de cabeçalho ou valor que contenha caracteres inválidos resultará no lançamento de um [`TypeError`](/pt/nodejs/api/errors#class-typeerror).

### `response.connection` {#responseconnection}

**Adicionado em: v0.3.0**

**Obsoleto desde: v13.0.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Use [`response.socket`](/pt/nodejs/api/http#responsesocket).
:::

- [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Veja [`response.socket`](/pt/nodejs/api/http#responsesocket).

### `response.cork()` {#responsecork}

**Adicionado em: v13.2.0, v12.16.0**

Veja [`writable.cork()`](/pt/nodejs/api/stream#writablecork).

### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | O parâmetro `data` agora pode ser um `Uint8Array`. |
| v10.0.0 | Este método agora retorna uma referência para `ServerResponse`. |
| v0.1.90 | Adicionado em: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Este método sinaliza ao servidor que todos os cabeçalhos e o corpo da resposta foram enviados; que o servidor deve considerar esta mensagem completa. O método, `response.end()`, DEVE ser chamado em cada resposta.

Se `data` for especificado, terá um efeito semelhante a chamar [`response.write(data, encoding)`](/pt/nodejs/api/http#responsewritechunk-encoding-callback) seguido por `response.end(callback)`.

Se `callback` for especificado, ele será chamado quando o fluxo de resposta for concluído.


### `response.finished` {#responsefinished}

**Adicionado em: v0.0.2**

**Obsoleto desde: v13.4.0, v12.16.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Use [`response.writableEnded`](/pt/nodejs/api/http#responsewritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

A propriedade `response.finished` será `true` se [`response.end()`](/pt/nodejs/api/http#responseenddata-encoding-callback) foi chamado.

### `response.flushHeaders()` {#responseflushheaders}

**Adicionado em: v1.6.0**

Descarrega os cabeçalhos da resposta. Veja também: [`request.flushHeaders()`](/pt/nodejs/api/http#requestflushheaders).

### `response.getHeader(name)` {#responsegetheadername}

**Adicionado em: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Lê um cabeçalho que já foi enfileirado, mas não enviado para o cliente. O nome não diferencia maiúsculas de minúsculas. O tipo do valor de retorno depende dos argumentos fornecidos para [`response.setHeader()`](/pt/nodejs/api/http#responsesetheadername-value).

```js [ESM]
response.setHeader('Content-Type', 'text/html');
response.setHeader('Content-Length', Buffer.byteLength(body));
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
const contentType = response.getHeader('content-type');
// contentType é 'text/html'
const contentLength = response.getHeader('Content-Length');
// contentLength é do tipo número
const setCookie = response.getHeader('set-cookie');
// setCookie é do tipo string[]
```
### `response.getHeaderNames()` {#responsegetheadernames}

**Adicionado em: v7.7.0**

- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna um array contendo os nomes únicos dos cabeçalhos de saída atuais. Todos os nomes de cabeçalho estão em letras minúsculas.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```

### `response.getHeaders()` {#responsegetheaders}

**Adicionado em: v7.7.0**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna uma cópia superficial dos cabeçalhos de saída atuais. Como uma cópia superficial é usada, os valores de array podem ser mutados sem chamadas adicionais para vários métodos de módulo http relacionados ao cabeçalho. As chaves do objeto retornado são os nomes dos cabeçalhos e os valores são os respectivos valores dos cabeçalhos. Todos os nomes dos cabeçalhos estão em minúsculas.

O objeto retornado pelo método `response.getHeaders()` *não* herda prototipicamente do JavaScript `Object`. Isso significa que os métodos típicos `Object`, como `obj.toString()`, `obj.hasOwnProperty()` e outros, não são definidos e *não funcionarão*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `response.hasHeader(name)` {#responsehasheadername}

**Adicionado em: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o cabeçalho identificado por `name` estiver definido atualmente nos cabeçalhos de saída. A correspondência do nome do cabeçalho não diferencia maiúsculas de minúsculas.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
### `response.headersSent` {#responseheaderssent}

**Adicionado em: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Booleano (somente leitura). Verdadeiro se os cabeçalhos foram enviados, falso caso contrário.

### `response.removeHeader(name)` {#responseremoveheadername}

**Adicionado em: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Remove um cabeçalho que está na fila para envio implícito.

```js [ESM]
response.removeHeader('Content-Encoding');
```
### `response.req` {#responsereq}

**Adicionado em: v15.7.0**

- [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage)

Uma referência ao objeto HTTP `request` original.


### `response.sendDate` {#responsesenddate}

**Adicionado em: v0.7.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Quando verdadeiro, o cabeçalho Date será gerado e enviado automaticamente na resposta se já não estiver presente nos cabeçalhos. O padrão é verdadeiro.

Isto só deve ser desativado para testes; o HTTP requer o cabeçalho Date nas respostas.

### `response.setHeader(name, value)` {#responsesetheadername-value}

**Adicionado em: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<http.ServerResponse\>](/pt/nodejs/api/http#class-httpserverresponse)

Retorna o objeto de resposta.

Define um único valor de cabeçalho para cabeçalhos implícitos. Se este cabeçalho já existir nos cabeçalhos a serem enviados, seu valor será substituído. Use um array de strings aqui para enviar múltiplos cabeçalhos com o mesmo nome. Valores não-string serão armazenados sem modificação. Portanto, [`response.getHeader()`](/pt/nodejs/api/http#responsegetheadername) pode retornar valores não-string. No entanto, os valores não-string serão convertidos para strings para transmissão em rede. O mesmo objeto de resposta é retornado ao chamador, para permitir o encadeamento de chamadas.

```js [ESM]
response.setHeader('Content-Type', 'text/html');
```
ou

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
Tentar definir um nome de campo de cabeçalho ou valor que contenha caracteres inválidos resultará no lançamento de um [`TypeError`](/pt/nodejs/api/errors#class-typeerror).

Quando os cabeçalhos foram definidos com [`response.setHeader()`](/pt/nodejs/api/http#responsesetheadername-value), eles serão mesclados com quaisquer cabeçalhos passados para [`response.writeHead()`](/pt/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), com os cabeçalhos passados para [`response.writeHead()`](/pt/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) tendo precedência.

```js [ESM]
// Retorna content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
Se o método [`response.writeHead()`](/pt/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) for chamado e este método não tiver sido chamado, ele escreverá diretamente os valores de cabeçalho fornecidos no canal de rede sem armazenar em cache internamente, e o [`response.getHeader()`](/pt/nodejs/api/http#responsegetheadername) no cabeçalho não produzirá o resultado esperado. Se a população progressiva de cabeçalhos for desejada com potencial recuperação e modificação futura, use [`response.setHeader()`](/pt/nodejs/api/http#responsesetheadername-value) em vez de [`response.writeHead()`](/pt/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers).


### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**Adicionado em: v0.9.12**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<http.ServerResponse\>](/pt/nodejs/api/http#class-httpserverresponse)

Define o valor de timeout do Socket para `msecs`. Se um callback for fornecido, ele será adicionado como um listener no evento `'timeout'` no objeto de resposta.

Se nenhum listener `'timeout'` for adicionado à requisição, à resposta ou ao servidor, os sockets serão destruídos quando atingirem o timeout. Se um manipulador for atribuído aos eventos `'timeout'` da requisição, da resposta ou do servidor, os sockets que atingirem o timeout devem ser tratados explicitamente.

### `response.socket` {#responsesocket}

**Adicionado em: v0.3.0**

- [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Referência ao socket subjacente. Normalmente, os usuários não desejarão acessar esta propriedade. Em particular, o socket não emitirá eventos `'readable'` devido à forma como o analisador de protocolo se conecta ao socket. Após `response.end()`, a propriedade é anulada.

::: code-group
```js [ESM]
import http from 'node:http';
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http = require('node:http');
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::

É garantido que esta propriedade seja uma instância da classe [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket), uma subclasse de [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex), a menos que o usuário tenha especificado um tipo de socket diferente de [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket).

### `response.statusCode` {#responsestatuscode}

**Adicionado em: v0.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `200`

Ao usar cabeçalhos implícitos (não chamar [`response.writeHead()`](/pt/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) explicitamente), esta propriedade controla o código de status que será enviado ao cliente quando os cabeçalhos forem descarregados.

```js [ESM]
response.statusCode = 404;
```
Depois que o cabeçalho de resposta foi enviado ao cliente, esta propriedade indica o código de status que foi enviado.


### `response.statusMessage` {#responsestatusmessage}

**Adicionado em: v0.11.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ao usar cabeçalhos implícitos (não chamando [`response.writeHead()`](/pt/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) explicitamente), esta propriedade controla a mensagem de status que será enviada ao cliente quando os cabeçalhos forem descarregados. Se isso for deixado como `undefined`, a mensagem padrão para o código de status será usada.

```js [ESM]
response.statusMessage = 'Não encontrado';
```
Depois que o cabeçalho de resposta for enviado ao cliente, esta propriedade indica a mensagem de status que foi enviada.

### `response.strictContentLength` {#responsestrictcontentlength}

**Adicionado em: v18.10.0, v16.18.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`

Se definido como `true`, o Node.js verificará se o valor do cabeçalho `Content-Length` e o tamanho do corpo, em bytes, são iguais. A incompatibilidade do valor do cabeçalho `Content-Length` resultará em um `Error` sendo lançado, identificado por `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/pt/nodejs/api/errors#err_http_content_length_mismatch).

### `response.uncork()` {#responseuncork}

**Adicionado em: v13.2.0, v12.16.0**

Veja [`writable.uncork()`](/pt/nodejs/api/stream#writableuncork).

### `response.writableEnded` {#responsewritableended}

**Adicionado em: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` depois que [`response.end()`](/pt/nodejs/api/http#responseenddata-encoding-callback) foi chamado. Esta propriedade não indica se os dados foram descarregados, para isso use [`response.writableFinished`](/pt/nodejs/api/http#responsewritablefinished) em vez disso.

### `response.writableFinished` {#responsewritablefinished}

**Adicionado em: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` se todos os dados foram descarregados para o sistema subjacente, imediatamente antes do evento [`'finish'`](/pt/nodejs/api/http#event-finish) ser emitido.

### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | O parâmetro `chunk` agora pode ser um `Uint8Array`. |
| v0.1.29 | Adicionado em: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se este método for chamado e [`response.writeHead()`](/pt/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) não tiver sido chamado, ele mudará para o modo de cabeçalho implícito e descarregará os cabeçalhos implícitos.

Isso envia um trecho do corpo da resposta. Este método pode ser chamado várias vezes para fornecer partes sucessivas do corpo.

Se `rejectNonStandardBodyWrites` estiver definido como true em `createServer`, a escrita no corpo não será permitida quando o método de requisição ou o status da resposta não suportarem conteúdo. Se uma tentativa for feita para escrever no corpo para uma requisição HEAD ou como parte de uma resposta `204` ou `304`, um `Error` síncrono com o código `ERR_HTTP_BODY_NOT_ALLOWED` será lançado.

`chunk` pode ser uma string ou um buffer. Se `chunk` for uma string, o segundo parâmetro especifica como codificá-lo em um fluxo de bytes. `callback` será chamado quando este trecho de dados for descarregado.

Este é o corpo HTTP bruto e não tem nada a ver com codificações de corpo multi-parte de nível superior que podem ser usadas.

A primeira vez que [`response.write()`](/pt/nodejs/api/http#responsewritechunk-encoding-callback) é chamado, ele enviará as informações do cabeçalho em buffer e o primeiro trecho do corpo para o cliente. A segunda vez que [`response.write()`](/pt/nodejs/api/http#responsewritechunk-encoding-callback) é chamado, o Node.js assume que os dados serão transmitidos e envia os novos dados separadamente. Ou seja, a resposta é armazenada em buffer até o primeiro trecho do corpo.

Retorna `true` se todos os dados foram descarregados com sucesso para o buffer do kernel. Retorna `false` se toda ou parte dos dados foram enfileirados na memória do usuário. `'drain'` será emitido quando o buffer estiver livre novamente.


### `response.writeContinue()` {#responsewritecontinue}

**Adicionado em: v0.3.0**

Envia uma mensagem HTTP/1.1 100 Continue para o cliente, indicando que o corpo da requisição deve ser enviado. Veja o evento [`'checkContinue'`](/pt/nodejs/api/http#event-checkcontinue) em `Server`.

### `response.writeEarlyHints(hints[, callback])` {#responsewriteearlyhintshints-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.11.0 | Permite passar hints como um objeto. |
| v18.11.0 | Adicionado em: v18.11.0 |
:::

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Envia uma mensagem HTTP/1.1 103 Early Hints para o cliente com um cabeçalho Link, indicando que o agente do usuário pode pré-carregar/pré-conectar os recursos vinculados. O `hints` é um objeto contendo os valores dos cabeçalhos a serem enviados com a mensagem early hints. O argumento opcional `callback` será chamado quando a mensagem de resposta for escrita.

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
  'x-trace-id': 'id for diagnostics',
});

const earlyHintsCallback = () => console.log('early hints message sent');
response.writeEarlyHints({
  'link': earlyHintsLinks,
}, earlyHintsCallback);
```
### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.14.0 | Permite passar cabeçalhos como um array. |
| v11.10.0, v10.17.0 | Retorna `this` de `writeHead()` para permitir encadeamento com `end()`. |
| v5.11.0, v4.4.5 | Um `RangeError` é lançado se `statusCode` não for um número no intervalo `[100, 999]`. |
| v0.1.30 | Adicionado em: v0.1.30 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- Retorna: [\<http.ServerResponse\>](/pt/nodejs/api/http#class-httpserverresponse)

Envia um cabeçalho de resposta para a requisição. O código de status é um código de status HTTP de 3 dígitos, como `404`. O último argumento, `headers`, são os cabeçalhos de resposta. Opcionalmente, pode-se fornecer uma `statusMessage` legível por humanos como o segundo argumento.

`headers` pode ser um `Array` onde as chaves e os valores estão na mesma lista. Não é uma lista de tuplas. Portanto, os deslocamentos de número par são valores de chave e os deslocamentos de número ímpar são os valores associados. O array está no mesmo formato que `request.rawHeaders`.

Retorna uma referência ao `ServerResponse`, para que as chamadas possam ser encadeadas.

```js [ESM]
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body);
```
Este método deve ser chamado apenas uma vez em uma mensagem e deve ser chamado antes que [`response.end()`](/pt/nodejs/api/http#responseenddata-encoding-callback) seja chamado.

Se [`response.write()`](/pt/nodejs/api/http#responsewritechunk-encoding-callback) ou [`response.end()`](/pt/nodejs/api/http#responseenddata-encoding-callback) forem chamados antes de chamar este, os cabeçalhos implícitos/mutáveis ​​serão calculados e chamarão esta função.

Quando os cabeçalhos foram definidos com [`response.setHeader()`](/pt/nodejs/api/http#responsesetheadername-value), eles serão mesclados com quaisquer cabeçalhos passados ​​para [`response.writeHead()`](/pt/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), com os cabeçalhos passados ​​para [`response.writeHead()`](/pt/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) recebendo precedência.

Se este método for chamado e [`response.setHeader()`](/pt/nodejs/api/http#responsesetheadername-value) não tiver sido chamado, ele gravará diretamente os valores do cabeçalho fornecidos no canal de rede sem armazenar em cache internamente, e o [`response.getHeader()`](/pt/nodejs/api/http#responsegetheadername) no cabeçalho não produzirá o resultado esperado. Se a população progressiva de cabeçalhos for desejada com potencial recuperação e modificação futuras, use [`response.setHeader()`](/pt/nodejs/api/http#responsesetheadername-value) em vez disso.

```js [ESM]
// Retorna content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
`Content-Length` é lido em bytes, não em caracteres. Use [`Buffer.byteLength()`](/pt/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) para determinar o comprimento do corpo em bytes. O Node.js verificará se `Content-Length` e o comprimento do corpo que foi transmitido são iguais ou não.

Tentar definir um nome ou valor de campo de cabeçalho que contenha caracteres inválidos resultará no lançamento de um [`Error`][].


### `response.writeProcessing()` {#responsewriteprocessing}

**Adicionado em: v10.0.0**

Envia uma mensagem HTTP/1.1 102 Processing para o cliente, indicando que o corpo da requisição deve ser enviado.

## Classe: `http.IncomingMessage` {#class-httpincomingmessage}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.5.0 | O valor `destroyed` retorna `true` após o consumo dos dados de entrada. |
| v13.1.0, v12.16.0 | O valor `readableHighWaterMark` espelha o do socket. |
| v0.1.17 | Adicionado em: v0.1.17 |
:::

- Estende: [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable)

Um objeto `IncomingMessage` é criado por [`http.Server`](/pt/nodejs/api/http#class-httpserver) ou [`http.ClientRequest`](/pt/nodejs/api/http#class-httpclientrequest) e passado como o primeiro argumento para os eventos [`'request'`](/pt/nodejs/api/http#event-request) e [`'response'`](/pt/nodejs/api/http#event-response) respectivamente. Pode ser usado para acessar o status da resposta, cabeçalhos e dados.

Diferente de seu valor `socket` que é uma subclasse de [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex), o `IncomingMessage` em si estende [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable) e é criado separadamente para analisar e emitir os cabeçalhos e o payload HTTP de entrada, pois o socket subjacente pode ser reutilizado várias vezes no caso de keep-alive.

### Evento: `'aborted'` {#event-aborted}

**Adicionado em: v0.3.8**

**Obsoleto desde: v17.0.0, v16.12.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Escute pelo evento `'close'` em vez disso.
:::

Emitido quando a requisição foi abortada.

### Evento: `'close'` {#event-close_3}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0 | O evento close agora é emitido quando a requisição foi concluída e não quando o socket subjacente é fechado. |
| v0.4.2 | Adicionado em: v0.4.2 |
:::

Emitido quando a requisição foi concluída.

### `message.aborted` {#messageaborted}

**Adicionado em: v10.1.0**

**Obsoleto desde: v17.0.0, v16.12.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Verifique `message.destroyed` de [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

A propriedade `message.aborted` será `true` se a requisição foi abortada.


### `message.complete` {#messagecomplete}

**Adicionado em: v0.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

A propriedade `message.complete` será `true` se uma mensagem HTTP completa foi recebida e analisada com sucesso.

Essa propriedade é particularmente útil como um meio de determinar se um cliente ou servidor transmitiu totalmente uma mensagem antes que uma conexão fosse encerrada:

```js [ESM]
const req = http.request({
  host: '127.0.0.1',
  port: 8080,
  method: 'POST',
}, (res) => {
  res.resume();
  res.on('end', () => {
    if (!res.complete)
      console.error(
        'The connection was terminated while the message was still being sent');
  });
});
```
### `message.connection` {#messageconnection}

**Adicionado em: v0.1.90**

**Obsoleto desde: v16.0.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Use [`message.socket`](/pt/nodejs/api/http#messagesocket).
:::

Alias para [`message.socket`](/pt/nodejs/api/http#messagesocket).

### `message.destroy([error])` {#messagedestroyerror}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.5.0, v12.19.0 | A função retorna `this` para consistência com outros streams Readable. |
| v0.3.0 | Adicionado em: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Chama `destroy()` no socket que recebeu o `IncomingMessage`. Se `error` for fornecido, um evento `'error'` é emitido no socket e `error` é passado como um argumento para quaisquer listeners no evento.

### `message.headers` {#messageheaders}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.5.0, v18.14.0 | A opção `joinDuplicateHeaders` nas funções `http.request()` e `http.createServer()` garante que cabeçalhos duplicados não sejam descartados, mas sim combinados usando um separador de vírgula, de acordo com a Seção 5.3 da RFC 9110. |
| v15.1.0 | `message.headers` agora é computado preguiçosamente usando uma propriedade acessora no protótipo e não é mais enumerável. |
| v0.1.5 | Adicionado em: v0.1.5 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

O objeto de cabeçalhos de requisição/resposta.

Pares de chave-valor de nomes e valores de cabeçalho. Os nomes dos cabeçalhos são em letras minúsculas.

```js [ESM]
// Imprime algo como:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
Duplicatas em cabeçalhos brutos são tratadas das seguintes maneiras, dependendo do nome do cabeçalho:

- Duplicatas de `age`, `authorization`, `content-length`, `content-type`, `etag`, `expires`, `from`, `host`, `if-modified-since`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `referer`, `retry-after`, `server` ou `user-agent` são descartadas. Para permitir que valores duplicados dos cabeçalhos listados acima sejam unidos, use a opção `joinDuplicateHeaders` em [`http.request()`](/pt/nodejs/api/http#httprequestoptions-callback) e [`http.createServer()`](/pt/nodejs/api/http#httpcreateserveroptions-requestlistener). Veja a Seção 5.3 da RFC 9110 para mais informações.
- `set-cookie` é sempre um array. Duplicatas são adicionadas ao array.
- Para cabeçalhos `cookie` duplicados, os valores são unidos com `; `.
- Para todos os outros cabeçalhos, os valores são unidos com `, `.


### `message.headersDistinct` {#messageheadersdistinct}

**Adicionado em: v18.3.0, v16.17.0**

- [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Semelhante a [`message.headers`](/pt/nodejs/api/http#messageheaders), mas não há lógica de junção e os valores são sempre matrizes de strings, mesmo para cabeçalhos recebidos apenas uma vez.

```js [ESM]
// Imprime algo como:
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*/*'] }
console.log(request.headersDistinct);
```
### `message.httpVersion` {#messagehttpversion}

**Adicionado em: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

No caso de solicitação do servidor, a versão HTTP enviada pelo cliente. No caso de resposta do cliente, a versão HTTP do servidor conectado. Provavelmente `'1.1'` ou `'1.0'`.

Além disso, `message.httpVersionMajor` é o primeiro inteiro e `message.httpVersionMinor` é o segundo.

### `message.method` {#messagemethod}

**Adicionado em: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Válido apenas para solicitação obtida de <a href="#class-httpserver"><code>http.Server</code></a>.**

O método de solicitação como uma string. Somente leitura. Exemplos: `'GET'`, `'DELETE'`.

### `message.rawHeaders` {#messagerawheaders}

**Adicionado em: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A lista de cabeçalhos brutos de solicitação/resposta exatamente como foram recebidos.

As chaves e os valores estão na mesma lista. Não é uma lista de tuplas. Portanto, os deslocamentos pares são valores-chave e os deslocamentos ímpares são os valores associados.

Os nomes dos cabeçalhos não são convertidos em minúsculas e os duplicados não são mesclados.

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
### `message.rawTrailers` {#messagerawtrailers}

**Adicionado em: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

As chaves e os valores brutos do trailer de solicitação/resposta exatamente como foram recebidos. Preenchido apenas no evento `'end'`.


### `message.setTimeout(msecs[, callback])` {#messagesettimeoutmsecs-callback}

**Adicionado em: v0.5.9**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage)

Chama `message.socket.setTimeout(msecs, callback)`.

### `message.socket` {#messagesocket}

**Adicionado em: v0.3.0**

- [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

O objeto [`net.Socket`](/pt/nodejs/api/net#class-netsocket) associado à conexão.

Com suporte HTTPS, use [`request.socket.getPeerCertificate()`](/pt/nodejs/api/tls#tlssocketgetpeercertificatedetailed) para obter os detalhes de autenticação do cliente.

Esta propriedade tem a garantia de ser uma instância da classe [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket), uma subclasse de [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex), a menos que o usuário tenha especificado um tipo de socket diferente de [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) ou anulado internamente.

### `message.statusCode` {#messagestatuscode}

**Adicionado em: v0.1.1**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

**Válido apenas para resposta obtida de <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a>.**

O código de status de resposta HTTP de 3 dígitos. Ex: `404`.

### `message.statusMessage` {#messagestatusmessage}

**Adicionado em: v0.11.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Válido apenas para resposta obtida de <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a>.**

A mensagem de status de resposta HTTP (frase de motivo). Ex: `OK` ou `Internal Server Error`.

### `message.trailers` {#messagetrailers}

**Adicionado em: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

O objeto de trailers de solicitação/resposta. Preenchido apenas no evento `'end'`.

### `message.trailersDistinct` {#messagetrailersdistinct}

**Adicionado em: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Semelhante a [`message.trailers`](/pt/nodejs/api/http#messagetrailers), mas não há lógica de junção e os valores são sempre arrays de strings, mesmo para cabeçalhos recebidos apenas uma vez. Preenchido apenas no evento `'end'`.


### `message.url` {#messageurl}

**Adicionado em: v0.1.90**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Válido apenas para solicitações obtidas de <a href="#class-httpserver"><code>http.Server</code></a>.**

String da URL da requisição. Contém apenas a URL presente na requisição HTTP real. Considere a seguinte requisição:

```
GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
Para analisar a URL em suas partes:

```js [ESM]
new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
```
Quando `request.url` é `'/status?name=ryan'` e `process.env.HOST` não está definido:

```bash [BASH]
$ node
> new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
URL {
  href: 'http://localhost/status?name=ryan',
  origin: 'http://localhost',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
Certifique-se de definir `process.env.HOST` para o nome do host do servidor ou considere substituir esta parte completamente. Se estiver usando `req.headers.host`, certifique-se de que a validação adequada seja usada, pois os clientes podem especificar um cabeçalho `Host` personalizado.

## Classe: `http.OutgoingMessage` {#class-httpoutgoingmessage}

**Adicionado em: v0.1.17**

- Estende: [\<Stream\>](/pt/nodejs/api/stream#stream)

Esta classe serve como a classe pai de [`http.ClientRequest`](/pt/nodejs/api/http#class-httpclientrequest) e [`http.ServerResponse`](/pt/nodejs/api/http#class-httpserverresponse). É uma mensagem de saída abstrata da perspectiva dos participantes de uma transação HTTP.

### Evento: `'drain'` {#event-drain}

**Adicionado em: v0.3.6**

Emitido quando o buffer da mensagem está livre novamente.

### Evento: `'finish'` {#event-finish_2}

**Adicionado em: v0.1.17**

Emitido quando a transmissão é concluída com sucesso.

### Evento: `'prefinish'` {#event-prefinish}

**Adicionado em: v0.11.6**

Emitido após a chamada de `outgoingMessage.end()`. Quando o evento é emitido, todos os dados foram processados, mas não necessariamente completamente liberados.


### `outgoingMessage.addTrailers(headers)` {#outgoingmessageaddtrailersheaders}

**Adicionado em: v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Adiciona trailers HTTP (cabeçalhos, mas no final da mensagem) à mensagem.

Trailers **somente** serão emitidos se a mensagem estiver codificada em partes. Caso contrário, os trailers serão descartados silenciosamente.

O HTTP exige que o cabeçalho `Trailer` seja enviado para emitir trailers, com uma lista de nomes de campos de cabeçalho em seu valor, por exemplo:

```js [ESM]
message.writeHead(200, { 'Content-Type': 'text/plain',
                         'Trailer': 'Content-MD5' });
message.write(fileData);
message.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
message.end();
```
A tentativa de definir um nome de campo de cabeçalho ou valor que contenha caracteres inválidos resultará em um `TypeError` sendo lançado.

### `outgoingMessage.appendHeader(name, value)` {#outgoingmessageappendheadername-value}

**Adicionado em: v18.3.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do cabeçalho
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Valor do cabeçalho
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Anexa um único valor de cabeçalho ao objeto de cabeçalho.

Se o valor for um array, isso é equivalente a chamar este método várias vezes.

Se não houver valores anteriores para o cabeçalho, isso é equivalente a chamar [`outgoingMessage.setHeader(name, value)`](/pt/nodejs/api/http#outgoingmessagesetheadername-value).

Dependendo do valor de `options.uniqueHeaders` quando a requisição do cliente ou o servidor foram criados, isso terminará no cabeçalho sendo enviado várias vezes ou uma única vez com valores unidos usando `; `.

### `outgoingMessage.connection` {#outgoingmessageconnection}

**Adicionado em: v0.3.0**

**Obsoleto desde: v15.12.0, v14.17.1**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`outgoingMessage.socket`](/pt/nodejs/api/http#outgoingmessagesocket) em vez disso.
:::

Alias de [`outgoingMessage.socket`](/pt/nodejs/api/http#outgoingmessagesocket).


### `outgoingMessage.cork()` {#outgoingmessagecork}

**Adicionado em: v13.2.0, v12.16.0**

Veja [`writable.cork()`](/pt/nodejs/api/stream#writablecork).

### `outgoingMessage.destroy([error])` {#outgoingmessagedestroyerror}

**Adicionado em: v0.3.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Opcional, um erro para emitir com o evento `error`
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Destrói a mensagem. Assim que um socket é associado à mensagem e está conectado, esse socket também será destruído.

### `outgoingMessage.end(chunk[, encoding][, callback])` {#outgoingmessageendchunk-encoding-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | O parâmetro `chunk` agora pode ser um `Uint8Array`. |
| v0.11.6 | Adicionado argumento `callback`. |
| v0.1.90 | Adicionado em: v0.1.90 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Opcional, **Padrão**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Opcional
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Finaliza a mensagem de saída. Se alguma parte do corpo não for enviada, ela será liberada para o sistema subjacente. Se a mensagem for fragmentada, ela enviará o fragmento de terminação `0\r\n\r\n` e enviará os trailers (se houver).

Se `chunk` for especificado, é equivalente a chamar `outgoingMessage.write(chunk, encoding)`, seguido por `outgoingMessage.end(callback)`.

Se `callback` for fornecido, ele será chamado quando a mensagem for finalizada (equivalente a um listener do evento `'finish'`).

### `outgoingMessage.flushHeaders()` {#outgoingmessageflushheaders}

**Adicionado em: v1.6.0**

Libera os cabeçalhos da mensagem.

Por razões de eficiência, o Node.js normalmente armazena em buffer os cabeçalhos da mensagem até que `outgoingMessage.end()` seja chamado ou o primeiro fragmento de dados da mensagem seja gravado. Em seguida, ele tenta empacotar os cabeçalhos e os dados em um único pacote TCP.

Geralmente é desejado (economiza um ciclo TCP), mas não quando os primeiros dados não são enviados até possivelmente muito mais tarde. `outgoingMessage.flushHeaders()` ignora a otimização e inicia a mensagem.


### `outgoingMessage.getHeader(name)` {#outgoingmessagegetheadername}

**Adicionado em: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do cabeçalho
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Obtém o valor do cabeçalho HTTP com o nome fornecido. Se esse cabeçalho não estiver definido, o valor retornado será `undefined`.

### `outgoingMessage.getHeaderNames()` {#outgoingmessagegetheadernames}

**Adicionado em: v7.7.0**

- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna um array contendo os nomes únicos dos cabeçalhos de saída atuais. Todos os nomes estão em letras minúsculas.

### `outgoingMessage.getHeaders()` {#outgoingmessagegetheaders}

**Adicionado em: v7.7.0**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna uma cópia superficial dos cabeçalhos de saída atuais. Como uma cópia superficial é usada, os valores do array podem ser alterados sem chamadas adicionais para vários métodos de módulo HTTP relacionados a cabeçalhos. As chaves do objeto retornado são os nomes dos cabeçalhos e os valores são os respectivos valores dos cabeçalhos. Todos os nomes dos cabeçalhos estão em letras minúsculas.

O objeto retornado pelo método `outgoingMessage.getHeaders()` não herda prototipicamente do JavaScript `Object`. Isso significa que os métodos típicos do `Object`, como `obj.toString()`, `obj.hasOwnProperty()` e outros, não estão definidos e não funcionarão.

```js [ESM]
outgoingMessage.setHeader('Foo', 'bar');
outgoingMessage.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = outgoingMessage.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `outgoingMessage.hasHeader(name)` {#outgoingmessagehasheadername}

**Adicionado em: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o cabeçalho identificado por `name` estiver definido atualmente nos cabeçalhos de saída. O nome do cabeçalho não diferencia maiúsculas de minúsculas.

```js [ESM]
const hasContentType = outgoingMessage.hasHeader('content-type');
```

### `outgoingMessage.headersSent` {#outgoingmessageheaderssent}

**Adicionado em: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Somente leitura. `true` se os cabeçalhos foram enviados, caso contrário, `false`.

### `outgoingMessage.pipe()` {#outgoingmessagepipe}

**Adicionado em: v9.0.0**

Substitui o método `stream.pipe()` herdado da classe `Stream` legada, que é a classe pai de `http.OutgoingMessage`.

Chamar este método lançará um `Error` porque `outgoingMessage` é um fluxo somente para gravação.

### `outgoingMessage.removeHeader(name)` {#outgoingmessageremoveheadername}

**Adicionado em: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do cabeçalho

Remove um cabeçalho que está na fila para envio implícito.

```js [ESM]
outgoingMessage.removeHeader('Content-Encoding');
```
### `outgoingMessage.setHeader(name, value)` {#outgoingmessagesetheadername-value}

**Adicionado em: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do cabeçalho
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Valor do cabeçalho
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Define um único valor de cabeçalho. Se o cabeçalho já existir nos cabeçalhos a serem enviados, seu valor será substituído. Use um array de strings para enviar vários cabeçalhos com o mesmo nome.

### `outgoingMessage.setHeaders(headers)` {#outgoingmessagesetheadersheaders}

**Adicionado em: v19.6.0, v18.15.0**

- `headers` [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers) | [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Define vários valores de cabeçalho para cabeçalhos implícitos. `headers` deve ser uma instância de [`Headers`](/pt/nodejs/api/globals#class-headers) ou `Map`, se um cabeçalho já existir nos cabeçalhos a serem enviados, seu valor será substituído.

```js [ESM]
const headers = new Headers({ foo: 'bar' });
outgoingMessage.setHeaders(headers);
```
ou

```js [ESM]
const headers = new Map([['foo', 'bar']]);
outgoingMessage.setHeaders(headers);
```
Quando os cabeçalhos foram definidos com [`outgoingMessage.setHeaders()`](/pt/nodejs/api/http#outgoingmessagesetheadersheaders), eles serão mesclados com quaisquer cabeçalhos passados para [`response.writeHead()`](/pt/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), com os cabeçalhos passados para [`response.writeHead()`](/pt/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) tendo precedência.

```js [ESM]
// Retorna content-type = text/plain
const server = http.createServer((req, res) => {
  const headers = new Headers({ 'Content-Type': 'text/html' });
  res.setHeaders(headers);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

### `outgoingMessage.setTimeout(msesc[, callback])` {#outgoingmessagesettimeoutmsesc-callback}

**Adicionado em: v0.9.12**

- `msesc` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função opcional a ser chamada quando ocorre um timeout. O mesmo que vincular ao evento `timeout`.
- Retorna: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Uma vez que um socket está associado à mensagem e está conectado, [`socket.setTimeout()`](/pt/nodejs/api/net#socketsettimeouttimeout-callback) será chamado com `msecs` como o primeiro parâmetro.

### `outgoingMessage.socket` {#outgoingmessagesocket}

**Adicionado em: v0.3.0**

- [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Referência ao socket subjacente. Normalmente, os usuários não desejarão acessar esta propriedade.

Após chamar `outgoingMessage.end()`, esta propriedade será anulada.

### `outgoingMessage.uncork()` {#outgoingmessageuncork}

**Adicionado em: v13.2.0, v12.16.0**

Veja [`writable.uncork()`](/pt/nodejs/api/stream#writableuncork)

### `outgoingMessage.writableCorked` {#outgoingmessagewritablecorked}

**Adicionado em: v13.2.0, v12.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O número de vezes que `outgoingMessage.cork()` foi chamado.

### `outgoingMessage.writableEnded` {#outgoingmessagewritableended}

**Adicionado em: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` se `outgoingMessage.end()` foi chamado. Esta propriedade não indica se os dados foram descarregados. Para esse propósito, use `message.writableFinished` em vez disso.

### `outgoingMessage.writableFinished` {#outgoingmessagewritablefinished}

**Adicionado em: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` se todos os dados foram descarregados para o sistema subjacente.

### `outgoingMessage.writableHighWaterMark` {#outgoingmessagewritablehighwatermark}

**Adicionado em: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O `highWaterMark` do socket subjacente, se atribuído. Caso contrário, o nível de buffer padrão quando [`writable.write()`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback) começa a retornar falso (`16384`).


### `outgoingMessage.writableLength` {#outgoingmessagewritablelength}

**Adicionado em: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O número de bytes em buffer.

### `outgoingMessage.writableObjectMode` {#outgoingmessagewritableobjectmode}

**Adicionado em: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sempre `false`.

### `outgoingMessage.write(chunk[, encoding][, callback])` {#outgoingmessagewritechunk-encoding-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | O parâmetro `chunk` agora pode ser um `Uint8Array`. |
| v0.11.6 | O argumento `callback` foi adicionado. |
| v0.1.29 | Adicionado em: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Envia um pedaço do corpo. Este método pode ser chamado várias vezes.

O argumento `encoding` só é relevante quando `chunk` é uma string. O padrão é `'utf8'`.

O argumento `callback` é opcional e será chamado quando este pedaço de dados for liberado.

Retorna `true` se todos os dados foram liberados com sucesso para o buffer do kernel. Retorna `false` se todos ou parte dos dados foram enfileirados na memória do usuário. O evento `'drain'` será emitido quando o buffer estiver livre novamente.

## `http.METHODS` {#httpmethods}

**Adicionado em: v0.11.8**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Uma lista dos métodos HTTP suportados pelo analisador.

## `http.STATUS_CODES` {#httpstatus_codes}

**Adicionado em: v0.1.22**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Uma coleção de todos os códigos de status de resposta HTTP padrão e a descrição resumida de cada um. Por exemplo, `http.STATUS_CODES[404] === 'Not Found'`.


## `http.createServer([options][, requestListener])` {#httpcreateserveroptions-requestlistener}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v20.1.0, v18.17.0 | A opção `highWaterMark` é agora suportada. |
| v18.0.0 | As opções `requestTimeout`, `headersTimeout`, `keepAliveTimeout` e `connectionsCheckingInterval` são agora suportadas. |
| v18.0.0 | A opção `noDelay` agora assume o valor padrão `true`. |
| v17.7.0, v16.15.0 | As opções `noDelay`, `keepAlive` e `keepAliveInitialDelay` são agora suportadas. |
| v13.3.0 | A opção `maxHeaderSize` é agora suportada. |
| v13.8.0, v12.15.0, v10.19.0 | A opção `insecureHTTPParser` é agora suportada. |
| v9.6.0, v8.12.0 | O argumento `options` é agora suportado. |
| v0.1.13 | Adicionado em: v0.1.13 |
:::

-  `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `connectionsCheckingInterval`: Define o valor do intervalo em milissegundos para verificar o tempo limite da solicitação e dos cabeçalhos em solicitações incompletas. **Padrão:** `30000`.
    - `headersTimeout`: Define o valor do tempo limite em milissegundos para receber os cabeçalhos HTTP completos do cliente. Consulte [`server.headersTimeout`](/pt/nodejs/api/http#serverheaderstimeout) para obter mais informações. **Padrão:** `60000`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Opcionalmente, substitui todos os `readableHighWaterMark` e `writableHighWaterMark` dos `socket`s. Isso afeta a propriedade `highWaterMark` tanto de `IncomingMessage` quanto de `ServerResponse`. **Padrão:** Consulte [`stream.getDefaultHighWaterMark()`](/pt/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode).
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `true`, ele usará um analisador HTTP com sinalizadores de tolerância habilitados. O uso do analisador inseguro deve ser evitado. Consulte [`--insecure-http-parser`](/pt/nodejs/api/cli#--insecure-http-parser) para obter mais informações. **Padrão:** `false`.
    - `IncomingMessage` [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage) Especifica a classe `IncomingMessage` a ser usada. Útil para estender o `IncomingMessage` original. **Padrão:** `IncomingMessage`.
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `true`, esta opção permite juntar os valores da linha de campo de vários cabeçalhos em uma solicitação com uma vírgula (`, `) em vez de descartar os duplicados. Para obter mais informações, consulte [`message.headers`](/pt/nodejs/api/http#messageheaders). **Padrão:** `false`.
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `true`, ele habilita a funcionalidade keep-alive no socket imediatamente após o recebimento de uma nova conexão de entrada, semelhante ao que é feito em [`socket.setKeepAlive([enable][, initialDelay])`][`socket.setKeepAlive(enable, initialDelay)`]. **Padrão:** `false`.
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se definido como um número positivo, ele define o atraso inicial antes que a primeira probe keepalive seja enviada em um socket ocioso. **Padrão:** `0`.
    - `keepAliveTimeout`: O número de milissegundos de inatividade que um servidor precisa esperar por dados de entrada adicionais, depois de terminar de escrever a última resposta, antes que um socket seja destruído. Consulte [`server.keepAliveTimeout`](/pt/nodejs/api/http#serverkeepalivetimeout) para obter mais informações. **Padrão:** `5000`.
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Opcionalmente, substitui o valor de [`--max-http-header-size`](/pt/nodejs/api/cli#--max-http-header-sizesize) para solicitações recebidas por este servidor, ou seja, o comprimento máximo dos cabeçalhos de solicitação em bytes. **Padrão:** 16384 (16 KiB).
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `true`, ele desativa o uso do algoritmo de Nagle imediatamente após o recebimento de uma nova conexão de entrada. **Padrão:** `true`.
    - `requestTimeout`: Define o valor do tempo limite em milissegundos para receber a solicitação inteira do cliente. Consulte [`server.requestTimeout`](/pt/nodejs/api/http#serverrequesttimeout) para obter mais informações. **Padrão:** `300000`.
    - `requireHostHeader` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `true`, ele força o servidor a responder com um código de status 400 (Bad Request) a qualquer mensagem de solicitação HTTP/1.1 que não possua um cabeçalho Host (conforme exigido pela especificação). **Padrão:** `true`.
    - `ServerResponse` [\<http.ServerResponse\>](/pt/nodejs/api/http#class-httpserverresponse) Especifica a classe `ServerResponse` a ser usada. Útil para estender o `ServerResponse` original. **Padrão:** `ServerResponse`.
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Uma lista de cabeçalhos de resposta que devem ser enviados apenas uma vez. Se o valor do cabeçalho for um array, os itens serão unidos usando `; `.
    - `rejectNonStandardBodyWrites` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `true`, um erro será lançado ao gravar em uma resposta HTTP que não possui um corpo. **Padrão:** `false`.
  
 
-  `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
-  Retorna: [\<http.Server\>](/pt/nodejs/api/http#class-httpserver) 

Retorna uma nova instância de [`http.Server`](/pt/nodejs/api/http#class-httpserver).

O `requestListener` é uma função que é automaticamente adicionada ao evento [`'request'`](/pt/nodejs/api/http#event-request).



::: code-group
```js [ESM]
import http from 'node:http';

// Cria um servidor local para receber dados de
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// Cria um servidor local para receber dados de
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::



::: code-group
```js [ESM]
import http from 'node:http';

// Cria um servidor local para receber dados de
const server = http.createServer();

// Escuta o evento de solicitação
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// Cria um servidor local para receber dados de
const server = http.createServer();

// Escuta o evento de solicitação
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::


## `http.get(options[, callback])` {#httpgetoptions-callback}

## `http.get(url[, options][, callback])` {#httpgeturl-options-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.9.0 | O parâmetro `url` agora pode ser passado junto com um objeto `options` separado. |
| v7.5.0 | O parâmetro `options` pode ser um objeto `URL` WHATWG. |
| v0.3.6 | Adicionado em: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Aceita as mesmas `options` que [`http.request()`](/pt/nodejs/api/http#httprequestoptions-callback), com o método definido como GET por padrão.
- `callback` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<http.ClientRequest\>](/pt/nodejs/api/http#class-httpclientrequest)

Como a maioria das requisições são requisições GET sem corpos, o Node.js fornece este método de conveniência. A única diferença entre este método e [`http.request()`](/pt/nodejs/api/http#httprequestoptions-callback) é que ele define o método como GET por padrão e chama `req.end()` automaticamente. O callback deve ter o cuidado de consumir os dados de resposta pelas razões declaradas na seção [`http.ClientRequest`](/pt/nodejs/api/http#class-httpclientrequest).

O `callback` é invocado com um único argumento que é uma instância de [`http.IncomingMessage`](/pt/nodejs/api/http#class-httpincomingmessage).

Exemplo de busca JSON:

```js [ESM]
http.get('http://localhost:8000/', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  // Qualquer código de status 2xx sinaliza uma resposta bem-sucedida, mas
  // aqui estamos verificando apenas o 200.
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // Consumir dados de resposta para liberar memória
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

// Criar um servidor local para receber dados de
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

## `http.globalAgent` {#httpglobalagent}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.0.0 | O agente agora usa HTTP Keep-Alive e um tempo limite de 5 segundos por padrão. |
| v0.5.9 | Adicionado em: v0.5.9 |
:::

- [\<http.Agent\>](/pt/nodejs/api/http#class-httpagent)

Instância global de `Agent` que é usada como padrão para todas as requisições de cliente HTTP. Difere de uma configuração `Agent` padrão por ter `keepAlive` habilitado e um `timeout` de 5 segundos.

## `http.maxHeaderSize` {#httpmaxheadersize}

**Adicionado em: v11.6.0, v10.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Propriedade somente leitura que especifica o tamanho máximo permitido dos cabeçalhos HTTP em bytes. O padrão é 16 KiB. Configurável usando a opção de CLI [`--max-http-header-size`](/pt/nodejs/api/cli#--max-http-header-sizesize).

Isto pode ser sobrescrito para servidores e requisições de cliente passando a opção `maxHeaderSize`.

## `http.request(options[, callback])` {#httprequestoptions-callback}

## `http.request(url[, options][, callback])` {#httprequesturl-options-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v16.7.0, v14.18.0 | Ao usar um objeto `URL` o nome de usuário e senha analisados agora serão devidamente decodificados por URI. |
| v15.3.0, v14.17.0 | É possível abortar uma requisição com um AbortSignal. |
| v13.3.0 | A opção `maxHeaderSize` agora é suportada. |
| v13.8.0, v12.15.0, v10.19.0 | A opção `insecureHTTPParser` agora é suportada. |
| v10.9.0 | O parâmetro `url` agora pode ser passado juntamente com um objeto `options` separado. |
| v7.5.0 | O parâmetro `options` pode ser um objeto `URL` WHATWG. |
| v0.3.6 | Adicionado em: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `agent` [\<http.Agent\>](/pt/nodejs/api/http#class-httpagent) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Controla o comportamento do [`Agent`](/pt/nodejs/api/http#class-httpagent). Valores possíveis:
    - `undefined` (padrão): use [`http.globalAgent`](/pt/nodejs/api/http#httpglobalagent) para este host e porta.
    - objeto `Agent`: use explicitamente o `Agent` passado.
    - `false`: faz com que um novo `Agent` com valores padrão seja usado.
 
    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Autenticação básica (`'user:password'`) para calcular um cabeçalho de Autorização.
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função que produz um socket/stream para usar na requisição quando a opção `agent` não é usada. Isso pode ser usado para evitar criar uma classe `Agent` personalizada apenas para sobrescrever a função `createConnection` padrão. Veja [`agent.createConnection()`](/pt/nodejs/api/http#agentcreateconnectionoptions-callback) para mais detalhes. Qualquer stream [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) é um valor de retorno válido.
    - `defaultPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta padrão para o protocolo. **Padrão:** `agent.defaultPort` se um `Agent` for usado, caso contrário, `undefined`.
    - `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Família de endereço IP para usar ao resolver `host` ou `hostname`. Os valores válidos são `4` ou `6`. Quando não especificado, tanto IP v4 quanto v6 serão usados.
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto contendo os cabeçalhos da requisição.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`dns.lookup()` dicas](/pt/nodejs/api/dns#supported-getaddrinfo-flags) opcionais.
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um nome de domínio ou endereço IP do servidor para o qual emitir a requisição. **Padrão:** `'localhost'`.
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Alias para `host`. Para suportar [`url.parse()`](/pt/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost), `hostname` será usado se tanto `host` quanto `hostname` forem especificados.
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `true`, ele usará um parser HTTP com flags de tolerância habilitadas. Usar o parser inseguro deve ser evitado. Veja [`--insecure-http-parser`](/pt/nodejs/api/cli#--insecure-http-parser) para mais informações. **Padrão:** `false`
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ele junta os valores da linha de campo de múltiplos cabeçalhos em uma requisição com `, ` em vez de descartar os duplicados. Veja [`message.headers`](/pt/nodejs/api/http#messageheaders) para mais informações. **Padrão:** `false`.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Interface local para vincular para conexões de rede.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta local para conectar a partir de.
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função de lookup personalizada. **Padrão:** [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback).
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Opcionalmente sobrescreve o valor de [`--max-http-header-size`](/pt/nodejs/api/cli#--max-http-header-sizesize) (o comprimento máximo de cabeçalhos de resposta em bytes) para respostas recebidas do servidor. **Padrão:** 16384 (16 KiB).
    - `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma string especificando o método de requisição HTTP. **Padrão:** `'GET'`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Caminho da requisição. Deve incluir a string de consulta, se houver. Ex.: `'/index.html?page=12'`. Uma exceção é lançada quando o caminho da requisição contém caracteres ilegais. Atualmente, apenas espaços são rejeitados, mas isso pode mudar no futuro. **Padrão:** `'/'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta do servidor remoto. **Padrão:** `defaultPort` se definido, caso contrário, `80`.
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Protocolo para usar. **Padrão:** `'http:'`.
    - `setDefaultHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): Especifica se deve ou não adicionar automaticamente cabeçalhos padrão como `Connection`, `Content-Length`, `Transfer-Encoding` e `Host`. Se definido como `false`, todos os cabeçalhos necessários devem ser adicionados manualmente. O padrão é `true`.
    - `setHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): Especifica se deve ou não adicionar automaticamente o cabeçalho `Host`. Se fornecido, isso substitui `setDefaultHeaders`. O padrão é `true`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal): Um AbortSignal que pode ser usado para abortar uma requisição em andamento.
    - `socketPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Socket de domínio Unix. Não pode ser usado se um de `host` ou `port` for especificado, pois estes especificam um Socket TCP.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): Um número especificando o tempo limite do socket em milissegundos. Isso definirá o tempo limite antes que o socket seja conectado.
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Uma lista de cabeçalhos de requisição que devem ser enviados apenas uma vez. Se o valor do cabeçalho for um array, os itens serão unidos usando `; `.
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<http.ClientRequest\>](/pt/nodejs/api/http#class-httpclientrequest)

`options` em [`socket.connect()`](/pt/nodejs/api/net#socketconnectoptions-connectlistener) também são suportados.

Node.js mantém várias conexões por servidor para fazer requisições HTTP. Esta função permite que se emitam requisições de forma transparente.

`url` pode ser uma string ou um objeto [`URL`](/pt/nodejs/api/url#the-whatwg-url-api). Se `url` for uma string, ela é analisada automaticamente com [`new URL()`](/pt/nodejs/api/url#new-urlinput-base). Se for um objeto [`URL`](/pt/nodejs/api/url#the-whatwg-url-api), ele será automaticamente convertido em um objeto `options` ordinário.

Se tanto `url` quanto `options` forem especificados, os objetos são mesclados, com as propriedades de `options` tendo precedência.

O parâmetro opcional `callback` será adicionado como um listener único para o evento [`'response'`](/pt/nodejs/api/http#event-response).

`http.request()` retorna uma instância da classe [`http.ClientRequest`](/pt/nodejs/api/http#class-httpclientrequest). A instância `ClientRequest` é um stream gravável. Se for necessário fazer o upload de um arquivo com uma requisição POST, então escreva no objeto `ClientRequest`.

::: code-group
```js [ESM]
import http from 'node:http';
import { Buffer } from 'node:buffer';

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```

```js [CJS]
const http = require('node:http');

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```
:::

No exemplo, `req.end()` foi chamado. Com `http.request()`, deve-se sempre chamar `req.end()` para sinalizar o final da requisição - mesmo que não haja dados sendo escritos no corpo da requisição.

Se algum erro for encontrado durante a requisição (seja com a resolução de DNS, erros de nível TCP ou erros de análise HTTP reais), um evento `'error'` é emitido no objeto de requisição retornado. Como com todos os eventos `'error'`, se nenhum listener for registrado, o erro será lançado.

Existem alguns cabeçalhos especiais que devem ser notados.

- Enviar um 'Connection: keep-alive' irá notificar o Node.js de que a conexão com o servidor deve ser mantida até a próxima requisição.
- Enviar um cabeçalho 'Content-Length' irá desabilitar a codificação em partes padrão.
- Enviar um cabeçalho 'Expect' enviará imediatamente os cabeçalhos da requisição. Geralmente, ao enviar 'Expect: 100-continue', tanto um tempo limite quanto um listener para o evento `'continue'` devem ser definidos. Veja RFC 2616 Seção 8.2.3 para mais informações.
- Enviar um cabeçalho de Autorização irá sobrescrever o uso da opção `auth` para calcular a autenticação básica.

Exemplo usando uma [`URL`](/pt/nodejs/api/url#the-whatwg-url-api) como `options`:

```js [ESM]
const options = new URL('http://abc:');

const req = http.request(options, (res) => {
  // ...
});
```
Em uma requisição bem-sucedida, os seguintes eventos serão emitidos na seguinte ordem:

- `'socket'`
- `'response'`
    - `'data'` qualquer número de vezes, no objeto `res` (`'data'` não será emitido se o corpo da resposta estiver vazio, por exemplo, na maioria dos redirecionamentos)
    - `'end'` no objeto `res`
 
- `'close'`

No caso de um erro de conexão, os seguintes eventos serão emitidos:

- `'socket'`
- `'error'`
- `'close'`

No caso de um fechamento de conexão prematuro antes que a resposta seja recebida, os seguintes eventos serão emitidos na seguinte ordem:

- `'socket'`
- `'error'` com um erro com a mensagem `'Error: socket hang up'` e o código `'ECONNRESET'`
- `'close'`

No caso de um fechamento de conexão prematuro após a resposta ser recebida, os seguintes eventos serão emitidos na seguinte ordem:

- `'socket'`
- `'response'`
    - `'data'` qualquer número de vezes, no objeto `res`
 
- (conexão fechada aqui)
- `'aborted'` no objeto `res`
- `'close'`
- `'error'` no objeto `res` com um erro com a mensagem `'Error: aborted'` e o código `'ECONNRESET'`
- `'close'` no objeto `res`

Se `req.destroy()` for chamado antes que um socket seja atribuído, os seguintes eventos serão emitidos na seguinte ordem:

- (`req.destroy()` chamado aqui)
- `'error'` com um erro com a mensagem `'Error: socket hang up'` e o código `'ECONNRESET'`, ou o erro com o qual `req.destroy()` foi chamado
- `'close'`

Se `req.destroy()` for chamado antes que a conexão seja bem-sucedida, os seguintes eventos serão emitidos na seguinte ordem:

- `'socket'`
- (`req.destroy()` chamado aqui)
- `'error'` com um erro com a mensagem `'Error: socket hang up'` e o código `'ECONNRESET'`, ou o erro com o qual `req.destroy()` foi chamado
- `'close'`

Se `req.destroy()` for chamado após a resposta ser recebida, os seguintes eventos serão emitidos na seguinte ordem:

- `'socket'`
- `'response'`
    - `'data'` qualquer número de vezes, no objeto `res`
 
- (`req.destroy()` chamado aqui)
- `'aborted'` no objeto `res`
- `'close'`
- `'error'` no objeto `res` com um erro com a mensagem `'Error: aborted'` e o código `'ECONNRESET'`, ou o erro com o qual `req.destroy()` foi chamado
- `'close'` no objeto `res`

Se `req.abort()` for chamado antes que um socket seja atribuído, os seguintes eventos serão emitidos na seguinte ordem:

- (`req.abort()` chamado aqui)
- `'abort'`
- `'close'`

Se `req.abort()` for chamado antes que a conexão seja bem-sucedida, os seguintes eventos serão emitidos na seguinte ordem:

- `'socket'`
- (`req.abort()` chamado aqui)
- `'abort'`
- `'error'` com um erro com a mensagem `'Error: socket hang up'` e o código `'ECONNRESET'`
- `'close'`

Se `req.abort()` for chamado após a resposta ser recebida, os seguintes eventos serão emitidos na seguinte ordem:

- `'socket'`
- `'response'`
    - `'data'` qualquer número de vezes, no objeto `res`
 
- (`req.abort()` chamado aqui)
- `'abort'`
- `'aborted'` no objeto `res`
- `'error'` no objeto `res` com um erro com a mensagem `'Error: aborted'` e o código `'ECONNRESET'`.
- `'close'`
- `'close'` no objeto `res`

Definir a opção `timeout` ou usar a função `setTimeout()` não abortará a requisição ou fará nada além de adicionar um evento `'timeout'`.

Passar um `AbortSignal` e então chamar `abort()` no `AbortController` correspondente se comportará da mesma forma que chamar `.destroy()` na requisição. Especificamente, o evento `'error'` será emitido com um erro com a mensagem `'AbortError: The operation was aborted'`, o código `'ABORT_ERR'` e a `cause`, se uma foi fornecida.


## `http.validateHeaderName(name[, label])` {#httpvalidateheadernamename-label}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.5.0, v18.14.0 | O parâmetro `label` foi adicionado. |
| v14.3.0 | Adicionado em: v14.3.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Rótulo para a mensagem de erro. **Padrão:** `'Nome do cabeçalho'`.

Executa as validações de baixo nível no `name` fornecido, que são feitas quando `res.setHeader(name, value)` é chamado.

Passar um valor ilegal como `name` resultará em um [`TypeError`](/pt/nodejs/api/errors#class-typeerror) sendo lançado, identificado por `code: 'ERR_INVALID_HTTP_TOKEN'`.

Não é necessário usar este método antes de passar cabeçalhos para uma solicitação ou resposta HTTP. O módulo HTTP validará automaticamente tais cabeçalhos.

Exemplo:

::: code-group
```js [ESM]
import { validateHeaderName } from 'node:http';

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```

```js [CJS]
const { validateHeaderName } = require('node:http');

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```
:::

## `http.validateHeaderValue(name, value)` {#httpvalidateheadervaluename-value}

**Adicionado em: v14.3.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Executa as validações de baixo nível no `value` fornecido que são feitas quando `res.setHeader(name, value)` é chamado.

Passar um valor ilegal como `value` resultará em um [`TypeError`](/pt/nodejs/api/errors#class-typeerror) sendo lançado.

- O erro de valor indefinido é identificado por `code: 'ERR_HTTP_INVALID_HEADER_VALUE'`.
- O erro de caractere de valor inválido é identificado por `code: 'ERR_INVALID_CHAR'`.

Não é necessário usar este método antes de passar cabeçalhos para uma solicitação ou resposta HTTP. O módulo HTTP validará automaticamente tais cabeçalhos.

Exemplos:

::: code-group
```js [ESM]
import { validateHeaderValue } from 'node:http';

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```

```js [CJS]
const { validateHeaderValue } = require('node:http');

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```
:::

## `http.setMaxIdleHTTPParsers(max)` {#httpsetmaxidlehttpparsersmax}

**Adicionado em: v18.8.0, v16.18.0**

- `max` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `1000`.

Define o número máximo de analisadores HTTP ociosos.

## `WebSocket` {#websocket}

**Adicionado em: v22.5.0**

Uma implementação compatível com navegador de [`WebSocket`](/pt/nodejs/api/http#websocket).

