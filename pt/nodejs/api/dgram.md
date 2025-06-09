---
title: Documentação do Node.js - dgram
description: O módulo dgram fornece uma implementação de sockets de datagramas UDP, permitindo a criação de aplicações cliente e servidor que podem enviar e receber pacotes de datagramas.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - dgram | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo dgram fornece uma implementação de sockets de datagramas UDP, permitindo a criação de aplicações cliente e servidor que podem enviar e receber pacotes de datagramas.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - dgram | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo dgram fornece uma implementação de sockets de datagramas UDP, permitindo a criação de aplicações cliente e servidor que podem enviar e receber pacotes de datagramas.
---


# Sockets UDP/datagrama {#udp/datagram-sockets}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/dgram.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dgram.js)

O módulo `node:dgram` fornece uma implementação de sockets de datagrama UDP.

::: code-group
```js [ESM]
import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`erro do servidor:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`servidor recebeu: ${msg} de ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`servidor ouvindo ${address.address}:${address.port}`);
});

server.bind(41234);
// Imprime: servidor ouvindo 0.0.0.0:41234
```

```js [CJS]
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`erro do servidor:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`servidor recebeu: ${msg} de ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`servidor ouvindo ${address.address}:${address.port}`);
});

server.bind(41234);
// Imprime: servidor ouvindo 0.0.0.0:41234
```
:::

## Classe: `dgram.Socket` {#class-dgramsocket}

**Adicionado em: v0.1.99**

- Estende: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Encapsula a funcionalidade de datagrama.

Novas instâncias de `dgram.Socket` são criadas usando [`dgram.createSocket()`](/pt/nodejs/api/dgram#dgramcreatesocketoptions-callback). A palavra-chave `new` não deve ser usada para criar instâncias de `dgram.Socket`.

### Evento: `'close'` {#event-close}

**Adicionado em: v0.1.99**

O evento `'close'` é emitido depois que um socket é fechado com [`close()`](/pt/nodejs/api/dgram#socketclosecallback). Uma vez acionado, nenhum novo evento `'message'` será emitido neste socket.

### Evento: `'connect'` {#event-connect}

**Adicionado em: v12.0.0**

O evento `'connect'` é emitido depois que um socket é associado a um endereço remoto como resultado de uma chamada [`connect()`](/pt/nodejs/api/dgram#socketconnectport-address-callback) bem-sucedida.


### Evento: `'error'` {#event-error}

**Adicionado em: v0.1.99**

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

O evento `'error'` é emitido sempre que ocorre um erro. A função de tratamento do evento recebe um único objeto `Error`.

### Evento: `'listening'` {#event-listening}

**Adicionado em: v0.1.99**

O evento `'listening'` é emitido quando o `dgram.Socket` é endereçável e pode receber dados. Isso acontece explicitamente com `socket.bind()` ou implicitamente na primeira vez que os dados são enviados usando `socket.send()`. Até que o `dgram.Socket` esteja ouvindo, os recursos do sistema subjacente não existem e chamadas como `socket.address()` e `socket.setTTL()` falharão.

### Evento: `'message'` {#event-message}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.4.0 | A propriedade `family` agora retorna uma string em vez de um número. |
| v18.0.0 | A propriedade `family` agora retorna um número em vez de uma string. |
| v0.1.99 | Adicionado em: v0.1.99 |
:::

O evento `'message'` é emitido quando um novo datagrama está disponível em um socket. A função de tratamento do evento recebe dois argumentos: `msg` e `rinfo`.

- `msg` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) A mensagem.
- `rinfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Informações de endereço remoto.
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O endereço do remetente.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A família de endereços (`'IPv4'` ou `'IPv6'`).
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A porta do remetente.
    - `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho da mensagem.
  
 

Se o endereço de origem do pacote de entrada for um endereço link-local IPv6, o nome da interface será adicionado ao `address`. Por exemplo, um pacote recebido na interface `en0` pode ter o campo de endereço definido como `'fe80::2618:1234:ab11:3b9c%en0'`, onde `'%en0'` é o nome da interface como um sufixo de ID de zona.


### `socket.addMembership(multicastAddress[, multicastInterface])` {#socketaddmembershipmulticastaddress-multicastinterface}

**Adicionado em: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Informa o kernel para se juntar a um grupo multicast no `multicastAddress` e `multicastInterface` fornecidos, usando a opção de socket `IP_ADD_MEMBERSHIP`. Se o argumento `multicastInterface` não for especificado, o sistema operacional escolherá uma interface e adicionará a participação a ela. Para adicionar participação a todas as interfaces disponíveis, chame `addMembership` várias vezes, uma vez por interface.

Quando chamado em um socket não vinculado, este método se vinculará implicitamente a uma porta aleatória, escutando em todas as interfaces.

Ao compartilhar um socket UDP entre múltiplos workers do `cluster`, a função `socket.addMembership()` deve ser chamada apenas uma vez, caso contrário, ocorrerá um erro `EADDRINUSE`:

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import dgram from 'node:dgram';

if (cluster.isPrimary) {
  cluster.fork(); // Funciona bem.
  cluster.fork(); // Falha com EADDRINUSE.
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```

```js [CJS]
const cluster = require('node:cluster');
const dgram = require('node:dgram');

if (cluster.isPrimary) {
  cluster.fork(); // Funciona bem.
  cluster.fork(); // Falha com EADDRINUSE.
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```
:::

### `socket.addSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketaddsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**Adicionado em: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Informa o kernel para se juntar a um canal multicast específico da fonte no `sourceAddress` e `groupAddress` fornecidos, usando a `multicastInterface` com a opção de socket `IP_ADD_SOURCE_MEMBERSHIP`. Se o argumento `multicastInterface` não for especificado, o sistema operacional escolherá uma interface e adicionará a participação a ela. Para adicionar participação a todas as interfaces disponíveis, chame `socket.addSourceSpecificMembership()` várias vezes, uma vez por interface.

Quando chamado em um socket não vinculado, este método se vinculará implicitamente a uma porta aleatória, escutando em todas as interfaces.


### `socket.address()` {#socketaddress}

**Adicionado em: v0.1.99**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna um objeto contendo as informações de endereço para um socket. Para sockets UDP, este objeto conterá as propriedades `address`, `family` e `port`.

Este método lança `EBADF` se chamado em um socket não vinculado.

### `socket.bind([port][, address][, callback])` {#socketbindport-address-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v0.9.1 | O método foi alterado para um modelo de execução assíncrono. O código legado precisaria ser alterado para passar uma função de callback para a chamada do método. |
| v0.1.99 | Adicionado em: v0.1.99 |
:::

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) sem parâmetros. Chamado quando a vinculação é concluída.

Para sockets UDP, faz com que o `dgram.Socket` escute mensagens de datagrama em uma `port` nomeada e `address` opcional. Se `port` não for especificado ou for `0`, o sistema operacional tentará vincular a uma porta aleatória. Se `address` não for especificado, o sistema operacional tentará escutar em todos os endereços. Uma vez que a vinculação é concluída, um evento `'listening'` é emitido e a função `callback` opcional é chamada.

Especificar um listener de evento `'listening'` e passar um `callback` para o método `socket.bind()` não é prejudicial, mas não é muito útil.

Um socket de datagrama vinculado mantém o processo Node.js em execução para receber mensagens de datagrama.

Se a vinculação falhar, um evento `'error'` é gerado. Em casos raros (por exemplo, tentar vincular com um socket fechado), um [`Error`](/pt/nodejs/api/errors#class-error) pode ser lançado.

Exemplo de um servidor UDP escutando na porta 41234:



::: code-group
```js [ESM]
import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```

```js [CJS]
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```
:::


### `socket.bind(options[, callback])` {#socketbindoptions-callback}

**Adicionado em: v0.11.14**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Obrigatório. Suporta as seguintes propriedades:
    - `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Para sockets UDP, faz com que o `dgram.Socket` espere por mensagens de datagrama em uma `port` nomeada e `address` opcional que são passados como propriedades de um objeto `options` passado como o primeiro argumento. Se `port` não for especificado ou for `0`, o sistema operacional tentará vincular a uma porta aleatória. Se `address` não for especificado, o sistema operacional tentará escutar em todos os endereços. Uma vez que a vinculação esteja completa, um evento `'listening'` é emitido e a função `callback` opcional é chamada.

O objeto `options` pode conter uma propriedade `fd`. Quando um `fd` maior que `0` é definido, ele envolverá um socket existente com o descritor de arquivo fornecido. Neste caso, as propriedades de `port` e `address` serão ignoradas.

Especificar um listener de evento `'listening'` e passar um `callback` para o método `socket.bind()` não é prejudicial, mas não é muito útil.

O objeto `options` pode conter uma propriedade `exclusive` adicional que é usada ao usar objetos `dgram.Socket` com o módulo [`cluster`](/pt/nodejs/api/cluster). Quando `exclusive` é definido como `false` (o padrão), os workers do cluster usarão o mesmo handle de socket subjacente, permitindo que as tarefas de manipulação de conexão sejam compartilhadas. Quando `exclusive` é `true`, no entanto, o handle não é compartilhado e a tentativa de compartilhamento de porta resulta em um erro. Criar um `dgram.Socket` com a opção `reusePort` definida como `true` faz com que `exclusive` seja sempre `true` quando `socket.bind()` é chamado.

Um socket de datagrama vinculado mantém o processo Node.js em execução para receber mensagens de datagrama.

Se a vinculação falhar, um evento `'error'` é gerado. Em casos raros (por exemplo, tentar vincular com um socket fechado), um [`Error`](/pt/nodejs/api/errors#class-error) pode ser lançado.

Um exemplo de socket ouvindo em uma porta exclusiva é mostrado abaixo.

```js [ESM]
socket.bind({
  address: 'localhost',
  port: 8000,
  exclusive: true,
});
```

### `socket.close([callback])` {#socketclosecallback}

**Adicionado em: v0.1.99**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chamado quando o socket foi fechado.

Fecha o socket subjacente e para de escutar por dados nele. Se um callback for fornecido, ele é adicionado como um listener para o evento [`'close'`](/pt/nodejs/api/dgram#event-close).

### `socket[Symbol.asyncDispose]()` {#socketsymbolasyncdispose}

**Adicionado em: v20.5.0, v18.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Chama [`socket.close()`](/pt/nodejs/api/dgram#socketclosecallback) e retorna uma promise que é cumprida quando o socket é fechado.

### `socket.connect(port[, address][, callback])` {#socketconnectport-address-callback}

**Adicionado em: v12.0.0**

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chamado quando a conexão é completada ou em caso de erro.

Associa o `dgram.Socket` a um endereço e porta remotos. Cada mensagem enviada por este handle é automaticamente enviada para esse destino. Além disso, o socket receberá apenas mensagens desse peer remoto. Tentar chamar `connect()` em um socket já conectado resultará em uma exceção [`ERR_SOCKET_DGRAM_IS_CONNECTED`](/pt/nodejs/api/errors#err_socket_dgram_is_connected). Se `address` não for fornecido, `'127.0.0.1'` (para sockets `udp4`) ou `'::1'` (para sockets `udp6`) serão usados por padrão. Assim que a conexão for concluída, um evento `'connect'` é emitido e a função `callback` opcional é chamada. Em caso de falha, o `callback` é chamado ou, falhando isso, um evento `'error'` é emitido.

### `socket.disconnect()` {#socketdisconnect}

**Adicionado em: v12.0.0**

Uma função síncrona que dissocia um `dgram.Socket` conectado de seu endereço remoto. Tentar chamar `disconnect()` em um socket não vinculado ou já desconectado resultará em uma exceção [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/pt/nodejs/api/errors#err_socket_dgram_not_connected).


### `socket.dropMembership(multicastAddress[, multicastInterface])` {#socketdropmembershipmulticastaddress-multicastinterface}

**Adicionado em: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Instrui o kernel a sair de um grupo multicast em `multicastAddress` usando a opção de socket `IP_DROP_MEMBERSHIP`. Este método é chamado automaticamente pelo kernel quando o socket é fechado ou o processo termina, então a maioria dos aplicativos nunca terá motivos para chamar isso.

Se `multicastInterface` não for especificado, o sistema operacional tentará remover a associação em todas as interfaces válidas.

### `socket.dropSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketdropsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**Adicionado em: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Instrui o kernel a sair de um canal multicast específico da fonte em `sourceAddress` e `groupAddress` usando a opção de socket `IP_DROP_SOURCE_MEMBERSHIP`. Este método é chamado automaticamente pelo kernel quando o socket é fechado ou o processo termina, então a maioria dos aplicativos nunca terá motivos para chamar isso.

Se `multicastInterface` não for especificado, o sistema operacional tentará remover a associação em todas as interfaces válidas.

### `socket.getRecvBufferSize()` {#socketgetrecvbuffersize}

**Adicionado em: v8.7.0**

- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) o tamanho do buffer de recebimento do socket `SO_RCVBUF` em bytes.

Este método lança [`ERR_SOCKET_BUFFER_SIZE`](/pt/nodejs/api/errors#err_socket_buffer_size) se chamado em um socket não vinculado.

### `socket.getSendBufferSize()` {#socketgetsendbuffersize}

**Adicionado em: v8.7.0**

- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) o tamanho do buffer de envio do socket `SO_SNDBUF` em bytes.

Este método lança [`ERR_SOCKET_BUFFER_SIZE`](/pt/nodejs/api/errors#err_socket_buffer_size) se chamado em um socket não vinculado.


### `socket.getSendQueueSize()` {#socketgetsendqueuesize}

**Adicionado em: v18.8.0, v16.19.0**

- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes enfileirados para envio.

### `socket.getSendQueueCount()` {#socketgetsendqueuecount}

**Adicionado em: v18.8.0, v16.19.0**

- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de solicitações de envio atualmente na fila aguardando para serem processadas.

### `socket.ref()` {#socketref}

**Adicionado em: v0.9.1**

- Retorna: [\<dgram.Socket\>](/pt/nodejs/api/dgram#class-dgramsocket)

Por padrão, vincular um socket fará com que ele impeça o processo Node.js de sair enquanto o socket estiver aberto. O método `socket.unref()` pode ser usado para excluir o socket da contagem de referência que mantém o processo Node.js ativo. O método `socket.ref()` adiciona o socket de volta à contagem de referência e restaura o comportamento padrão.

Chamar `socket.ref()` várias vezes não terá efeito adicional.

O método `socket.ref()` retorna uma referência ao socket para que as chamadas possam ser encadeadas.

### `socket.remoteAddress()` {#socketremoteaddress}

**Adicionado em: v12.0.0**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna um objeto contendo o `address`, `family` e `port` do endpoint remoto. Este método lança uma exceção [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/pt/nodejs/api/errors#err_socket_dgram_not_connected) se o socket não estiver conectado.

### `socket.send(msg[, offset, length][, port][, address][, callback])` {#socketsendmsg-offset-length-port-address-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.0.0 | O parâmetro `address` agora aceita apenas uma `string`, `null` ou `undefined`. |
| v14.5.0, v12.19.0 | O parâmetro `msg` agora pode ser qualquer `TypedArray` ou `DataView`. |
| v12.0.0 | Adicionado suporte para envio de dados em sockets conectados. |
| v8.0.0 | O parâmetro `msg` agora pode ser um `Uint8Array`. |
| v8.0.0 | O parâmetro `address` agora é sempre opcional. |
| v6.0.0 | Em caso de sucesso, o `callback` agora será chamado com um argumento `error` de `null` em vez de `0`. |
| v5.7.0 | O parâmetro `msg` agora pode ser um array. Além disso, os parâmetros `offset` e `length` agora são opcionais. |
| v0.1.99 | Adicionado em: v0.1.99 |
:::

- `msg` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Mensagem a ser enviada.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Deslocamento no buffer onde a mensagem começa.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes na mensagem.
- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta de destino.
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do host de destino ou endereço IP.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chamado quando a mensagem for enviada.

Transmite um datagrama no socket. Para sockets sem conexão, a `port` e o `address` de destino devem ser especificados. Sockets conectados, por outro lado, usarão seu endpoint remoto associado, então os argumentos `port` e `address` não devem ser definidos.

O argumento `msg` contém a mensagem a ser enviada. Dependendo do seu tipo, diferentes comportamentos podem ser aplicados. Se `msg` for um `Buffer`, qualquer `TypedArray` ou um `DataView`, o `offset` e `length` especificam o deslocamento dentro do `Buffer` onde a mensagem começa e o número de bytes na mensagem, respectivamente. Se `msg` for uma `String`, então ela é automaticamente convertida para um `Buffer` com codificação `'utf8'`. Com mensagens que contêm caracteres multi-byte, `offset` e `length` serão calculados em relação ao [comprimento em bytes](/pt/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) e não à posição do caractere. Se `msg` for um array, `offset` e `length` não devem ser especificados.

O argumento `address` é uma string. Se o valor de `address` for um nome de host, o DNS será usado para resolver o endereço do host. Se `address` não for fornecido ou for nulo, `'127.0.0.1'` (para sockets `udp4`) ou `'::1'` (para sockets `udp6`) serão usados por padrão.

Se o socket não tiver sido previamente vinculado com uma chamada para `bind`, o socket é atribuído a um número de porta aleatório e é vinculado ao endereço "todas as interfaces" (`'0.0.0.0'` para sockets `udp4`, `'::0'` para sockets `udp6`.)

Uma função `callback` opcional pode ser especificada como uma forma de relatar erros de DNS ou para determinar quando é seguro reutilizar o objeto `buf`. As pesquisas de DNS atrasam o tempo para enviar por pelo menos um ciclo do loop de eventos do Node.js.

A única maneira de saber com certeza que o datagrama foi enviado é usando um `callback`. Se ocorrer um erro e um `callback` for fornecido, o erro será passado como o primeiro argumento para o `callback`. Se um `callback` não for fornecido, o erro é emitido como um evento `'error'` no objeto `socket`.

Offset e length são opcionais, mas ambos *devem* ser definidos se algum deles for usado. Eles são suportados apenas quando o primeiro argumento é um `Buffer`, um `TypedArray` ou um `DataView`.

Este método lança [`ERR_SOCKET_BAD_PORT`](/pt/nodejs/api/errors#err_socket_bad_port) se for chamado em um socket não vinculado.

Exemplo de envio de um pacote UDP para uma porta em `localhost`;



::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});
```
:::

Exemplo de envio de um pacote UDP composto por múltiplos buffers para uma porta em `127.0.0.1`;



::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer';

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```
:::

Enviar múltiplos buffers pode ser mais rápido ou mais lento dependendo da aplicação e do sistema operacional. Execute benchmarks para determinar a estratégia ideal caso a caso. Geralmente falando, no entanto, enviar múltiplos buffers é mais rápido.

Exemplo de envio de um pacote UDP usando um socket conectado a uma porta em `localhost`:



::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.connect(41234, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.connect(41234, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});
```
:::

#### Observação sobre o tamanho do datagrama UDP {#note-about-udp-datagram-size}

O tamanho máximo de um datagrama IPv4/v6 depende da `MTU` (Maximum Transmission Unit - Unidade Máxima de Transmissão) e do tamanho do campo `Payload Length` (Comprimento da Carga Útil).

- O campo `Payload Length` tem 16 bits de largura, o que significa que uma carga útil normal não pode exceder 64K octetos, incluindo o cabeçalho da internet e os dados (65.507 bytes = 65.535 - 8 bytes do cabeçalho UDP - 20 bytes do cabeçalho IP); isso geralmente é verdade para interfaces de loopback, mas essas mensagens de datagramas longos são impraticáveis ​​para a maioria dos hosts e redes.
- A `MTU` é o maior tamanho que uma determinada tecnologia de camada de link pode suportar para mensagens de datagrama. Para qualquer link, o IPv4 exige uma `MTU` mínima de 68 octetos, enquanto a `MTU` recomendada para IPv4 é 576 (normalmente recomendada como a `MTU` para aplicativos do tipo dial-up), quer cheguem inteiros ou em fragmentos. Para IPv6, a `MTU` mínima é de 1280 octetos. No entanto, o tamanho mínimo obrigatório do buffer de remontagem de fragmentos é de 1500 octetos. O valor de 68 octetos é muito pequeno, pois a maioria das tecnologias de camada de link atuais, como Ethernet, têm uma `MTU` mínima de 1500.

É impossível saber com antecedência a MTU de cada link pelo qual um pacote pode viajar. Enviar um datagrama maior que a `MTU` do receptor não funcionará porque o pacote será descartado silenciosamente, sem informar à origem que os dados não chegaram ao destinatário pretendido.

### `socket.setBroadcast(flag)` {#socketsetbroadcastflag}

**Adicionado em: v0.6.9**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Define ou limpa a opção de socket `SO_BROADCAST`. Quando definido como `true`, os pacotes UDP podem ser enviados para o endereço de broadcast de uma interface local.

Este método lança `EBADF` se for chamado em um socket não vinculado.

### `socket.setMulticastInterface(multicastInterface)` {#socketsetmulticastinterfacemulticastinterface}

**Adicionado em: v8.6.0**

- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

*Todas as referências ao escopo nesta seção referem-se aos
<a href="https://en.wikipedia.org/wiki/IPv6_address#Scoped_literal_IPv6_addresses">Índices de Zona IPv6</a>, que são definidos por <a href="https://tools.ietf.org/html/rfc4007">RFC 4007</a>. Em formato de string, um IP
com um índice de escopo é escrito como <code>'IP%scope'</code> onde escopo é um nome de interface
ou número de interface.*

Define a interface multicast de saída padrão do socket para uma interface escolhida ou de volta para a seleção de interface do sistema. O `multicastInterface` deve ser uma representação de string válida de um IP da família do socket.

Para sockets IPv4, este deve ser o IP configurado para a interface física desejada. Todos os pacotes enviados para multicast no socket serão enviados na interface determinada pelo uso bem-sucedido mais recente desta chamada.

Para sockets IPv6, `multicastInterface` deve incluir um escopo para indicar a interface, como nos exemplos a seguir. No IPv6, chamadas `send` individuais também podem usar escopo explícito em endereços, portanto, apenas os pacotes enviados para um endereço multicast sem especificar um escopo explícito são afetados pelo uso bem-sucedido mais recente desta chamada.

Este método lança `EBADF` se for chamado em um socket não vinculado.


#### Exemplo: Interface multicast de saída IPv6 {#example-ipv6-outgoing-multicast-interface}

Na maioria dos sistemas, onde o formato de escopo usa o nome da interface:

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%eth1');
});
```
No Windows, onde o formato de escopo usa um número de interface:

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%2');
});
```
#### Exemplo: Interface multicast de saída IPv4 {#example-ipv4-outgoing-multicast-interface}

Todos os sistemas usam um IP do host na interface física desejada:

```js [ESM]
const socket = dgram.createSocket('udp4');

socket.bind(1234, () => {
  socket.setMulticastInterface('10.0.0.2');
});
```
#### Resultados da chamada {#call-results}

Uma chamada em um socket que não está pronto para enviar ou não está mais aberto pode lançar um `Error` *Not running* ([/api/errors#class-error]).

Se `multicastInterface` não puder ser analisado em um IP, um `System Error` *EINVAL* ([/api/errors#class-systemerror]) é lançado.

Em IPv4, se `multicastInterface` for um endereço válido, mas não corresponder a nenhuma interface, ou se o endereço não corresponder à família, um `System Error` ([/api/errors#class-systemerror]) como `EADDRNOTAVAIL` ou `EPROTONOSUP` será lançado.

Em IPv6, a maioria dos erros ao especificar ou omitir o escopo resultará no socket continuando a usar (ou retornando a) a seleção de interface padrão do sistema.

O endereço ANY da família de endereços de um socket (IPv4 `'0.0.0.0'` ou IPv6 `'::'`) pode ser usado para retornar o controle da interface de saída padrão dos sockets ao sistema para futuros pacotes multicast.

### `socket.setMulticastLoopback(flag)` {#socketsetmulticastloopbackflag}

**Adicionado em: v0.3.8**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Define ou limpa a opção de socket `IP_MULTICAST_LOOP`. Quando definido como `true`, os pacotes multicast também serão recebidos na interface local.

Este método lança `EBADF` se chamado em um socket não vinculado.

### `socket.setMulticastTTL(ttl)` {#socketsetmulticastttlttl}

**Adicionado em: v0.3.8**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Define a opção de socket `IP_MULTICAST_TTL`. Embora TTL geralmente signifique "Time to Live" (tempo de vida), neste contexto, ele especifica o número de saltos IP que um pacote tem permissão para percorrer, especificamente para tráfego multicast. Cada roteador ou gateway que encaminha um pacote decrementa o TTL. Se o TTL for decrementado para 0 por um roteador, ele não será encaminhado.

O argumento `ttl` pode estar entre 0 e 255. O padrão na maioria dos sistemas é `1`.

Este método lança `EBADF` se chamado em um socket não vinculado.


### `socket.setRecvBufferSize(size)` {#socketsetrecvbuffersizesize}

**Adicionado em: v8.7.0**

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Define a opção de socket `SO_RCVBUF`. Define o buffer de recebimento máximo do socket em bytes.

Este método lança [`ERR_SOCKET_BUFFER_SIZE`](/pt/nodejs/api/errors#err_socket_buffer_size) se for chamado em um socket não vinculado.

### `socket.setSendBufferSize(size)` {#socketsetsendbuffersizesize}

**Adicionado em: v8.7.0**

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Define a opção de socket `SO_SNDBUF`. Define o buffer de envio máximo do socket em bytes.

Este método lança [`ERR_SOCKET_BUFFER_SIZE`](/pt/nodejs/api/errors#err_socket_buffer_size) se for chamado em um socket não vinculado.

### `socket.setTTL(ttl)` {#socketsetttlttl}

**Adicionado em: v0.1.101**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Define a opção de socket `IP_TTL`. Embora TTL geralmente signifique "Time to Live" (Tempo de Vida), neste contexto, ele especifica o número de saltos IP que um pacote tem permissão para percorrer. Cada roteador ou gateway que encaminha um pacote decrementa o TTL. Se o TTL for decrementado para 0 por um roteador, ele não será encaminhado. A alteração dos valores de TTL é normalmente feita para sondagens de rede ou durante a multicastagem.

O argumento `ttl` pode estar entre 1 e 255. O padrão na maioria dos sistemas é 64.

Este método lança `EBADF` se for chamado em um socket não vinculado.

### `socket.unref()` {#socketunref}

**Adicionado em: v0.9.1**

- Retorna: [\<dgram.Socket\>](/pt/nodejs/api/dgram#class-dgramsocket)

Por padrão, vincular um socket fará com que ele impeça o processo do Node.js de sair enquanto o socket estiver aberto. O método `socket.unref()` pode ser usado para excluir o socket da contagem de referência que mantém o processo do Node.js ativo, permitindo que o processo saia mesmo que o socket ainda esteja escutando.

Chamar `socket.unref()` várias vezes não terá nenhum efeito adicional.

O método `socket.unref()` retorna uma referência ao socket para que as chamadas possam ser encadeadas.


## Funções do módulo `node:dgram` {#nodedgram-module-functions}

### `dgram.createSocket(options[, callback])` {#dgramcreatesocketoptions-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.1.0 | A opção `reusePort` é suportada. |
| v15.8.0 | Suporte para AbortSignal foi adicionado. |
| v11.4.0 | A opção `ipv6Only` é suportada. |
| v8.7.0 | As opções `recvBufferSize` e `sendBufferSize` são suportadas agora. |
| v8.6.0 | A opção `lookup` é suportada. |
| v0.11.13 | Adicionado em: v0.11.13 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) As opções disponíveis são:
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A família do socket. Deve ser `'udp4'` ou `'udp6'`. Obrigatório.
    - `reuseAddr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true` [`socket.bind()`](/pt/nodejs/api/dgram#socketbindport-address-callback) reutilizará o endereço, mesmo que outro processo já tenha vinculado um socket a ele, mas apenas um socket pode receber os dados. **Padrão:** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true` [`socket.bind()`](/pt/nodejs/api/dgram#socketbindport-address-callback) reutilizará a porta, mesmo que outro processo já tenha vinculado um socket a ela. Datagramas de entrada são distribuídos para sockets de escuta. A opção está disponível apenas em algumas plataformas, como Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 e AIX 7.2.5+. Em plataformas não suportadas, esta opção levanta um erro quando o socket é vinculado. **Padrão:** `false`.
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Definir `ipv6Only` para `true` desativará o suporte a pilha dupla, ou seja, vincular ao endereço `::` não fará com que `0.0.0.0` seja vinculado. **Padrão:** `false`.
    - `recvBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o valor do socket `SO_RCVBUF`.
    - `sendBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define o valor do socket `SO_SNDBUF`.
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função de pesquisa personalizada. **Padrão:** [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback).
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Um AbortSignal que pode ser usado para fechar um socket.
    - `receiveBlockList` [\<net.BlockList\>](/pt/nodejs/api/net#class-netblocklist) `receiveBlockList` pode ser usado para descartar datagramas de entrada para endereços IP específicos, intervalos de IP ou sub-redes IP. Isso não funciona se o servidor estiver atrás de um proxy reverso, NAT, etc., porque o endereço verificado em relação à lista de bloqueio é o endereço do proxy ou o especificado pelo NAT.
    - `sendBlockList` [\<net.BlockList\>](/pt/nodejs/api/net#class-netblocklist) `sendBlockList` pode ser usado para desabilitar o acesso de saída a endereços IP específicos, intervalos de IP ou sub-redes IP.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Anexado como um listener para eventos `'message'`. Opcional.
- Retorna: [\<dgram.Socket\>](/pt/nodejs/api/dgram#class-dgramsocket)

Cria um objeto `dgram.Socket`. Uma vez que o socket é criado, chamar [`socket.bind()`](/pt/nodejs/api/dgram#socketbindport-address-callback) instruirá o socket a começar a ouvir mensagens de datagrama. Quando `address` e `port` não são passados para [`socket.bind()`](/pt/nodejs/api/dgram#socketbindport-address-callback), o método vinculará o socket ao endereço "todas as interfaces" em uma porta aleatória (ele faz a coisa certa tanto para sockets `udp4` quanto `udp6`). O endereço e a porta vinculados podem ser recuperados usando [`socket.address().address`](/pt/nodejs/api/dgram#socketaddress) e [`socket.address().port`](/pt/nodejs/api/dgram#socketaddress).

Se a opção `signal` estiver habilitada, chamar `.abort()` no `AbortController` correspondente é semelhante a chamar `.close()` no socket:

```js [ESM]
const controller = new AbortController();
const { signal } = controller;
const server = dgram.createSocket({ type: 'udp4', signal });
server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});
// Later, when you want to close the server.
controller.abort();
```

### `dgram.createSocket(type[, callback])` {#dgramcreatesockettype-callback}

**Adicionado em: v0.1.99**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Tanto `'udp4'` quanto `'udp6'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Anexada como um ouvinte aos eventos `'message'`.
- Retorna: [\<dgram.Socket\>](/pt/nodejs/api/dgram#class-dgramsocket)

Cria um objeto `dgram.Socket` do `type` especificado.

Uma vez que o socket é criado, chamar [`socket.bind()`](/pt/nodejs/api/dgram#socketbindport-address-callback) irá instruir o socket a começar a ouvir mensagens de datagrama. Quando `address` e `port` não são passados para [`socket.bind()`](/pt/nodejs/api/dgram#socketbindport-address-callback), o método irá vincular o socket ao endereço de "todas as interfaces" em uma porta aleatória (ele faz a coisa certa para sockets `udp4` e `udp6`). O endereço e a porta vinculados podem ser recuperados usando [`socket.address().address`](/pt/nodejs/api/dgram#socketaddress) e [`socket.address().port`](/pt/nodejs/api/dgram#socketaddress).

