---
title: Documentação do Node.js - Rede
description: O módulo 'net' no Node.js fornece uma API de rede assíncrona para criar servidores e clientes TCP ou IPC baseados em fluxo. Inclui métodos para criar conexões, servidores e gerenciar operações de socket.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Rede | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo 'net' no Node.js fornece uma API de rede assíncrona para criar servidores e clientes TCP ou IPC baseados em fluxo. Inclui métodos para criar conexões, servidores e gerenciar operações de socket.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Rede | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo 'net' no Node.js fornece uma API de rede assíncrona para criar servidores e clientes TCP ou IPC baseados em fluxo. Inclui métodos para criar conexões, servidores e gerenciar operações de socket.
---


# Net {#net}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/net.js](https://github.com/nodejs/node/blob/v23.5.0/lib/net.js)

O módulo `node:net` fornece uma API de rede assíncrona para criar servidores TCP ou [IPC](/pt/nodejs/api/net#ipc-support) baseados em fluxo ([`net.createServer()`](/pt/nodejs/api/net#netcreateserveroptions-connectionlistener)) e clientes ([`net.createConnection()`](/pt/nodejs/api/net#netcreateconnection)).

Ele pode ser acessado usando:

::: code-group
```js [ESM]
import net from 'node:net';
```

```js [CJS]
const net = require('node:net');
```
:::

## Suporte a IPC {#ipc-support}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.8.0 | Suporte para vincular ao caminho do socket de domínio Unix abstrato como `\0abstract`. Podemos vincular '\0' para Node.js `\< v20.4.0`. |
:::

O módulo `node:net` oferece suporte a IPC com pipes nomeados no Windows e sockets de domínio Unix em outros sistemas operacionais.

### Identificando caminhos para conexões IPC {#identifying-paths-for-ipc-connections}

[`net.connect()`](/pt/nodejs/api/net#netconnect), [`net.createConnection()`](/pt/nodejs/api/net#netcreateconnection), [`server.listen()`](/pt/nodejs/api/net#serverlisten) e [`socket.connect()`](/pt/nodejs/api/net#socketconnect) usam um parâmetro `path` para identificar endpoints IPC.

No Unix, o domínio local também é conhecido como domínio Unix. O caminho é um nome de caminho do sistema de arquivos. Ele lançará um erro quando o comprimento do nome do caminho for maior que o comprimento de `sizeof(sockaddr_un.sun_path)`. Os valores típicos são 107 bytes no Linux e 103 bytes no macOS. Se uma abstração de API Node.js criar o socket de domínio Unix, ela também desvinculará o socket de domínio Unix. Por exemplo, [`net.createServer()`](/pt/nodejs/api/net#netcreateserveroptions-connectionlistener) pode criar um socket de domínio Unix e [`server.close()`](/pt/nodejs/api/net#serverclosecallback) o desvinculará. Mas se um usuário criar o socket de domínio Unix fora dessas abstrações, o usuário precisará removê-lo. O mesmo se aplica quando uma API Node.js cria um socket de domínio Unix, mas o programa trava. Resumindo, um socket de domínio Unix estará visível no sistema de arquivos e persistirá até ser desvinculado. No Linux, você pode usar o socket abstrato Unix adicionando `\0` ao início do caminho, como `\0abstract`. O caminho para o socket abstrato Unix não está visível no sistema de arquivos e desaparecerá automaticamente quando todas as referências abertas ao socket forem fechadas.

No Windows, o domínio local é implementado usando um pipe nomeado. O caminho *deve* se referir a uma entrada em `\\?\pipe\` ou `\\.\pipe\`. Quaisquer caracteres são permitidos, mas o último pode fazer algum processamento de nomes de pipe, como resolver sequências `..`. Apesar de como possa parecer, o namespace do pipe é plano. Os pipes *não persistirão*. Eles são removidos quando a última referência a eles é fechada. Ao contrário dos sockets de domínio Unix, o Windows fechará e removerá o pipe quando o processo proprietário for encerrado.

O escape de string JavaScript requer que os caminhos sejam especificados com escape de barra invertida extra, como:

```js [ESM]
net.createServer().listen(
  path.join('\\\\?\\pipe', process.cwd(), 'myctl'));
```

## Classe: `net.BlockList` {#class-netblocklist}

**Adicionado em: v15.0.0, v14.18.0**

O objeto `BlockList` pode ser usado com algumas APIs de rede para especificar regras para desabilitar o acesso de entrada ou saída a endereços IP, intervalos de IP ou sub-redes IP específicos.

### `blockList.addAddress(address[, type])` {#blocklistaddaddressaddress-type}

**Adicionado em: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/pt/nodejs/api/net#class-netsocketaddress) Um endereço IPv4 ou IPv6.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` ou `'ipv6'`. **Padrão:** `'ipv4'`.

Adiciona uma regra para bloquear o endereço IP fornecido.

### `blockList.addRange(start, end[, type])` {#blocklistaddrangestart-end-type}

**Adicionado em: v15.0.0, v14.18.0**

- `start` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/pt/nodejs/api/net#class-netsocketaddress) O endereço IPv4 ou IPv6 inicial no intervalo.
- `end` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/pt/nodejs/api/net#class-netsocketaddress) O endereço IPv4 ou IPv6 final no intervalo.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` ou `'ipv6'`. **Padrão:** `'ipv4'`.

Adiciona uma regra para bloquear um intervalo de endereços IP de `start` (inclusivo) a `end` (inclusivo).

### `blockList.addSubnet(net, prefix[, type])` {#blocklistaddsubnetnet-prefix-type}

**Adicionado em: v15.0.0, v14.18.0**

- `net` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/pt/nodejs/api/net#class-netsocketaddress) O endereço de rede IPv4 ou IPv6.
- `prefix` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bits de prefixo CIDR. Para IPv4, este deve ser um valor entre `0` e `32`. Para IPv6, este deve estar entre `0` e `128`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'ipv4'` ou `'ipv6'`. **Padrão:** `'ipv4'`.

Adiciona uma regra para bloquear um intervalo de endereços IP especificado como uma máscara de sub-rede.


### `blockList.check(address[, type])` {#blocklistcheckaddress-type}

**Adicionado em: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/pt/nodejs/api/net#class-netsocketaddress) O endereço IP a ser verificado
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ou `'ipv4'` ou `'ipv6'`. **Padrão:** `'ipv4'`.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se o endereço IP fornecido corresponder a qualquer uma das regras adicionadas à `BlockList`.

```js [ESM]
const blockList = new net.BlockList();
blockList.addAddress('123.123.123.123');
blockList.addRange('10.0.0.1', '10.0.0.10');
blockList.addSubnet('8592:757c:efae:4e45::', 64, 'ipv6');

console.log(blockList.check('123.123.123.123'));  // Imprime: true
console.log(blockList.check('10.0.0.3'));  // Imprime: true
console.log(blockList.check('222.111.111.222'));  // Imprime: false

// A notação IPv6 para endereços IPv4 funciona:
console.log(blockList.check('::ffff:7b7b:7b7b', 'ipv6')); // Imprime: true
console.log(blockList.check('::ffff:123.123.123.123', 'ipv6')); // Imprime: true
```
### `blockList.rules` {#blocklistrules}

**Adicionado em: v15.0.0, v14.18.0**

- Tipo: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A lista de regras adicionadas à blocklist.

### `BlockList.isBlockList(value)` {#blocklistisblocklistvalue}

**Adicionado em: v23.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualquer valor JS
- Retorna `true` se o `value` for um `net.BlockList`.

## Classe: `net.SocketAddress` {#class-netsocketaddress}

**Adicionado em: v15.14.0, v14.18.0**

### `new net.SocketAddress([options])` {#new-netsocketaddressoptions}

**Adicionado em: v15.14.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O endereço de rede como uma string IPv4 ou IPv6. **Padrão**: `'127.0.0.1'` se `family` for `'ipv4'`; `'::'` se `family` for `'ipv6'`.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um de `'ipv4'` ou `'ipv6'`. **Padrão**: `'ipv4'`.
    - `flowlabel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um flow-label IPv6 usado apenas se `family` for `'ipv6'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Uma porta IP.
  


### `socketaddress.address` {#socketaddressaddress}

**Adicionado em: v15.14.0, v14.18.0**

- Tipo [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### `socketaddress.family` {#socketaddressfamily}

**Adicionado em: v15.14.0, v14.18.0**

- Tipo [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ou `'ipv4'` ou `'ipv6'`.

### `socketaddress.flowlabel` {#socketaddressflowlabel}

**Adicionado em: v15.14.0, v14.18.0**

- Tipo [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `socketaddress.port` {#socketaddressport}

**Adicionado em: v15.14.0, v14.18.0**

- Tipo [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `SocketAddress.parse(input)` {#socketaddressparseinput}

**Adicionado em: v23.4.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma string de entrada contendo um endereço IP e uma porta opcional, por exemplo, `123.1.2.3:1234` ou `[1::1]:1234`.
- Retorna: [\<net.SocketAddress\>](/pt/nodejs/api/net#class-netsocketaddress) Retorna um `SocketAddress` se a análise for bem-sucedida. Caso contrário, retorna `undefined`.

## Classe: `net.Server` {#class-netserver}

**Adicionado em: v0.1.90**

- Estende: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Essa classe é usada para criar um servidor TCP ou [IPC](/pt/nodejs/api/net#ipc-support).

### `new net.Server([options][, connectionListener])` {#new-netserveroptions-connectionlistener}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Veja [`net.createServer([options][, connectionListener])`](/pt/nodejs/api/net#netcreateserveroptions-connectionlistener).
- `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Definido automaticamente como um listener para o evento [`'connection'`](/pt/nodejs/api/net#event-connection).
- Retorna: [\<net.Server\>](/pt/nodejs/api/net#class-netserver)

`net.Server` é um [`EventEmitter`](/pt/nodejs/api/events#class-eventemitter) com os seguintes eventos:

### Evento: `'close'` {#event-close}

**Adicionado em: v0.5.0**

Emitido quando o servidor fecha. Se existirem conexões, esse evento não é emitido até que todas as conexões sejam encerradas.


### Evento: `'connection'` {#event-connection}

**Adicionado em: v0.1.90**

- [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O objeto de conexão

Emitido quando uma nova conexão é feita. `socket` é uma instância de `net.Socket`.

### Evento: `'error'` {#event-error}

**Adicionado em: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitido quando ocorre um erro. Ao contrário de [`net.Socket`](/pt/nodejs/api/net#class-netsocket), o evento [`'close'`](/pt/nodejs/api/net#event-close) **não** será emitido diretamente após este evento, a menos que [`server.close()`](/pt/nodejs/api/net#serverclosecallback) seja chamado manualmente. Veja o exemplo na discussão de [`server.listen()`](/pt/nodejs/api/net#serverlisten).

### Evento: `'listening'` {#event-listening}

**Adicionado em: v0.1.90**

Emitido quando o servidor foi vinculado após chamar [`server.listen()`](/pt/nodejs/api/net#serverlisten).

### Evento: `'drop'` {#event-drop}

**Adicionado em: v18.6.0, v16.17.0**

Quando o número de conexões atinge o limite de `server.maxConnections`, o servidor descartará novas conexões e emitirá o evento `'drop'` em vez disso. Se for um servidor TCP, o argumento é o seguinte, caso contrário, o argumento é `undefined`.

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O argumento passado para o listener do evento.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Endereço local.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta local.
    - `localFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Família local.
    - `remoteAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Endereço remoto.
    - `remotePort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta remota.
    - `remoteFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Família IP remota. `'IPv4'` ou `'IPv6'`.


### `server.address()` {#serveraddress}

::: info [Histórico]
| Versão  | Mudanças                                                              |
| :------ | :--------------------------------------------------------------------- |
| v18.4.0 | A propriedade `family` agora retorna uma string em vez de um número.   |
| v18.0.0 | A propriedade `family` agora retorna um número em vez de uma string.   |
| v0.1.90 | Adicionado em: v0.1.90                                                |
:::

- Retorna: [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Retorna o `address` vinculado, o nome da `family` do endereço e a `port` do servidor, conforme relatado pelo sistema operacional, se estiver ouvindo em um socket IP (útil para descobrir qual porta foi atribuída ao obter um endereço atribuído pelo SO): `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.

Para um servidor que está ouvindo em um pipe ou socket de domínio Unix, o nome é retornado como uma string.

```js [ESM]
const server = net.createServer((socket) => {
  socket.end('adeus\n');
}).on('error', (err) => {
  // Lidar com erros aqui.
  throw err;
});

// Obtenha uma porta não utilizada arbitrária.
server.listen(() => {
  console.log('servidor aberto em', server.address());
});
```

`server.address()` retorna `null` antes que o evento `'listening'` seja emitido ou após chamar `server.close()`.

### `server.close([callback])` {#serverclosecallback}

**Adicionado em: v0.1.90**

- `callback` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chamado quando o servidor é fechado.
- Retorna: [\<net.Server\>](/pt/nodejs/api/net#class-netserver)

Impede que o servidor aceite novas conexões e mantém as conexões existentes. Esta função é assíncrona, o servidor é finalmente fechado quando todas as conexões são encerradas e o servidor emite um evento [`'close'`](/pt/nodejs/api/net#event-close). O `callback` opcional será chamado quando o evento `'close'` ocorrer. Ao contrário desse evento, ele será chamado com um `Error` como seu único argumento se o servidor não estiver aberto quando for fechado.


### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Adicionado em: v20.5.0, v18.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Chama [`server.close()`](/pt/nodejs/api/net#serverclosecallback) e retorna uma promise que é cumprida quando o servidor é fechado.

### `server.getConnections(callback)` {#servergetconnectionscallback}

**Adicionado em: v0.9.7**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<net.Server\>](/pt/nodejs/api/net#class-netserver)

Obtém assincronamente o número de conexões simultâneas no servidor. Funciona quando os sockets foram enviados para forks.

O callback deve receber dois argumentos `err` e `count`.

### `server.listen()` {#serverlisten}

Inicia um servidor ouvindo conexões. Um `net.Server` pode ser um servidor TCP ou [IPC](/pt/nodejs/api/net#ipc-support), dependendo do que ele ouve.

Assinaturas possíveis:

- [`server.listen(handle[, backlog][, callback])`](/pt/nodejs/api/net#serverlistenhandle-backlog-callback)
- [`server.listen(options[, callback])`](/pt/nodejs/api/net#serverlistenoptions-callback)
- [`server.listen(path[, backlog][, callback])`](/pt/nodejs/api/net#serverlistenpath-backlog-callback) para servidores [IPC](/pt/nodejs/api/net#ipc-support)
- [`server.listen([port[, host[, backlog]]][, callback])`](/pt/nodejs/api/net#serverlistenport-host-backlog-callback) para servidores TCP

Esta função é assíncrona. Quando o servidor começa a ouvir, o evento [`'listening'`](/pt/nodejs/api/net#event-listening) será emitido. O último parâmetro `callback` será adicionado como um listener para o evento [`'listening'`](/pt/nodejs/api/net#event-listening).

Todos os métodos `listen()` podem receber um parâmetro `backlog` para especificar o comprimento máximo da fila de conexões pendentes. O comprimento real será determinado pelo SO através de configurações sysctl, como `tcp_max_syn_backlog` e `somaxconn` no Linux. O valor padrão deste parâmetro é 511 (não 512).

Todos os [`net.Socket`](/pt/nodejs/api/net#class-netsocket) são definidos como `SO_REUSEADDR` (ver [`socket(7)`](https://man7.org/linux/man-pages/man7/socket.7) para detalhes).

O método `server.listen()` pode ser chamado novamente se e somente se houve um erro durante a primeira chamada `server.listen()` ou `server.close()` foi chamado. Caso contrário, um erro `ERR_SERVER_ALREADY_LISTEN` será lançado.

Um dos erros mais comuns levantados ao ouvir é `EADDRINUSE`. Isso acontece quando outro servidor já está ouvindo na `port`/`path`/`handle` solicitada. Uma maneira de lidar com isso seria tentar novamente após um certo período de tempo:

```js [ESM]
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});
```

#### `server.listen(handle[, backlog][, callback])` {#serverlistenhandle-backlog-callback}

**Adicionado em: v0.5.10**

- `handle` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parâmetro comum das funções [`server.listen()`](/pt/nodejs/api/net#serverlisten)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<net.Server\>](/pt/nodejs/api/net#class-netserver)

Inicia um servidor à espera de conexões em um determinado `handle` que já foi vinculado a uma porta, um socket de domínio Unix ou um pipe nomeado do Windows.

O objeto `handle` pode ser um servidor, um socket (qualquer coisa com um membro `_handle` subjacente) ou um objeto com um membro `fd` que seja um descritor de arquivo válido.

A escuta em um descritor de arquivo não é suportada no Windows.

#### `server.listen(options[, callback])` {#serverlistenoptions-callback}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.1.0 | A opção `reusePort` é suportada. |
| v15.6.0 | O suporte ao AbortSignal foi adicionado. |
| v11.4.0 | A opção `ipv6Only` é suportada. |
| v0.11.14 | Adicionado em: v0.11.14 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Requerido. Suporta as seguintes propriedades:
    - `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parâmetro comum das funções [`server.listen()`](/pt/nodejs/api/net#serverlisten).
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Para servidores TCP, definir `ipv6Only` como `true` desativará o suporte a pilha dupla, ou seja, vincular ao host `::` não fará com que `0.0.0.0` seja vinculado. **Padrão:** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Para servidores TCP, definir `reusePort` como `true` permite que vários sockets no mesmo host se liguem à mesma porta. As conexões de entrada são distribuídas pelo sistema operacional aos sockets de escuta. Esta opção está disponível apenas em algumas plataformas, como Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 e AIX 7.2.5+. **Padrão:** `false`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Será ignorado se `port` for especificado. Consulte [Identificando caminhos para conexões IPC](/pt/nodejs/api/net#identifying-paths-for-ipc-connections).
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `readableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Para servidores IPC, torna o pipe legível para todos os usuários. **Padrão:** `false`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Um AbortSignal que pode ser usado para fechar um servidor de escuta.
    - `writableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Para servidores IPC, torna o pipe gravável para todos os usuários. **Padrão:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) functions.
- Retorna: [\<net.Server\>](/pt/nodejs/api/net#class-netserver)

Se `port` for especificado, ele se comporta da mesma forma que [`server.listen([port[, host[, backlog]]][, callback])`](/pt/nodejs/api/net#serverlistenport-host-backlog-callback). Caso contrário, se `path` for especificado, ele se comporta da mesma forma que [`server.listen(path[, backlog][, callback])`](/pt/nodejs/api/net#serverlistenpath-backlog-callback). Se nenhum deles for especificado, um erro será lançado.

Se `exclusive` for `false` (padrão), os workers do cluster usarão o mesmo handle subjacente, permitindo que as tarefas de tratamento de conexão sejam compartilhadas. Quando `exclusive` é `true`, o handle não é compartilhado e a tentativa de compartilhamento de porta resulta em um erro. Um exemplo de escuta em uma porta exclusiva é mostrado abaixo.

```js [ESM]
server.listen({
  host: 'localhost',
  port: 80,
  exclusive: true,
});
```
Quando `exclusive` é `true` e o handle subjacente é compartilhado, é possível que vários workers consultem um handle com diferentes backlogs. Nesse caso, o primeiro `backlog` passado para o processo mestre será usado.

Iniciar um servidor IPC como root pode fazer com que o caminho do servidor fique inacessível para usuários não privilegiados. Usar `readableAll` e `writableAll` tornará o servidor acessível para todos os usuários.

Se a opção `signal` estiver habilitada, chamar `.abort()` no `AbortController` correspondente é semelhante a chamar `.close()` no servidor:

```js [ESM]
const controller = new AbortController();
server.listen({
  host: 'localhost',
  port: 80,
  signal: controller.signal,
});
// Mais tarde, quando você quiser fechar o servidor.
controller.abort();
```

#### `server.listen(path[, backlog][, callback])` {#serverlistenpath-backlog-callback}

**Adicionado em: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Caminho que o servidor deve escutar. Veja [Identificação de caminhos para conexões IPC](/pt/nodejs/api/net#identifying-paths-for-ipc-connections).
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parâmetro comum das funções [`server.listen()`](/pt/nodejs/api/net#serverlisten).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- Retorna: [\<net.Server\>](/pt/nodejs/api/net#class-netserver)

Inicia um servidor [IPC](/pt/nodejs/api/net#ipc-support) que escuta por conexões no `path` fornecido.

#### `server.listen([port[, host[, backlog]]][, callback])` {#serverlistenport-host-backlog-callback}

**Adicionado em: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parâmetro comum das funções [`server.listen()`](/pt/nodejs/api/net#serverlisten).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- Retorna: [\<net.Server\>](/pt/nodejs/api/net#class-netserver)

Inicia um servidor TCP que escuta por conexões na `port` e `host` fornecidos.

Se `port` for omitido ou for 0, o sistema operacional atribuirá uma porta não utilizada arbitrária, que pode ser recuperada usando `server.address().port` após o evento [`'listening'`](/pt/nodejs/api/net#event-listening) ter sido emitido.

Se `host` for omitido, o servidor aceitará conexões no [endereço IPv6 não especificado](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) quando o IPv6 estiver disponível, ou no [endereço IPv4 não especificado](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`) caso contrário.

Na maioria dos sistemas operacionais, escutar o [endereço IPv6 não especificado](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) pode fazer com que o `net.Server` também escute no [endereço IPv4 não especificado](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`).


### `server.listening` {#serverlistening}

**Adicionado em: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se o servidor está ou não à escuta de conexões.

### `server.maxConnections` {#servermaxconnections}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v21.0.0 | Definir `maxConnections` para `0` derruba todas as conexões de entrada. Anteriormente, era interpretado como `Infinity`. |
| v0.2.0 | Adicionado em: v0.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Quando o número de conexões atinge o limite de `server.maxConnections`:

Não é recomendado usar esta opção quando um socket é enviado para um filho com [`child_process.fork()`](/pt/nodejs/api/child_process#child_processforkmodulepath-args-options).

### `server.dropMaxConnection` {#serverdropmaxconnection}

**Adicionado em: v23.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Defina esta propriedade para `true` para começar a fechar as conexões quando o número de conexões atingir o limite [`server.maxConnections`][]. Esta configuração só é eficaz no modo de cluster.

### `server.ref()` {#serverref}

**Adicionado em: v0.9.1**

- Retorna: [\<net.Server\>](/pt/nodejs/api/net#class-netserver)

O oposto de `unref()`, chamar `ref()` num servidor previamente `unref` não permitirá que o programa termine se for o único servidor restante (o comportamento padrão). Se o servidor for `ref` chamar `ref()` novamente não terá efeito.

### `server.unref()` {#serverunref}

**Adicionado em: v0.9.1**

- Retorna: [\<net.Server\>](/pt/nodejs/api/net#class-netserver)

Chamar `unref()` num servidor permitirá que o programa termine se este for o único servidor ativo no sistema de eventos. Se o servidor já estiver `unref` chamar `unref()` novamente não terá efeito.

## Classe: `net.Socket` {#class-netsocket}

**Adicionado em: v0.3.4**

- Estende: [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Esta classe é uma abstração de um socket TCP ou um endpoint [IPC](/pt/nodejs/api/net#ipc-support) de streaming (usa named pipes no Windows e sockets de domínio Unix em outros casos). Também é um [`EventEmitter`](/pt/nodejs/api/events#class-eventemitter).

Um `net.Socket` pode ser criado pelo utilizador e usado diretamente para interagir com um servidor. Por exemplo, é retornado por [`net.createConnection()`](/pt/nodejs/api/net#netcreateconnection), para que o utilizador possa usá-lo para comunicar com o servidor.

Também pode ser criado pelo Node.js e passado para o utilizador quando uma conexão é recebida. Por exemplo, é passado para os listeners de um evento [`'connection'`](/pt/nodejs/api/net#event-connection) emitido num [`net.Server`](/pt/nodejs/api/net#class-netserver), para que o utilizador possa usá-lo para interagir com o cliente.


### `new net.Socket([options])` {#new-netsocketoptions}

::: info [Histórico]
| Versão  | Mudanças                                                                                                                                                                                                    |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| v15.14.0  | Suporte para AbortSignal foi adicionado.                                                                                                                                                                    |
| v12.10.0  | Adicionada a opção `onread`.                                                                                                                                                                                 |
| v0.3.4   | Adicionado em: v0.3.4                                                                                                                                                                                          |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) As opções disponíveis são:
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `false`, o socket encerrará automaticamente o lado gravável quando o lado legível terminar. Veja [`net.createServer()`](/pt/nodejs/api/net#netcreateserveroptions-connectionlistener) e o evento [`'end'`](/pt/nodejs/api/net#event-end) para detalhes. **Padrão:** `false`.
    - `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se especificado, envolve um socket existente com o descritor de arquivo fornecido, caso contrário, um novo socket será criado.
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se especificado, os dados de entrada são armazenados em um único `buffer` e passados para o `callback` fornecido quando os dados chegam ao socket. Isso fará com que a funcionalidade de streaming não forneça nenhum dado. O socket emitirá eventos como `'error'`, `'end'` e `'close'` como de costume. Métodos como `pause()` e `resume()` também se comportarão como esperado.
    - `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ou um pedaço de memória reutilizável para usar para armazenar dados de entrada ou uma função que retorna tal.
    - `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Esta função é chamada para cada pedaço de dados de entrada. Dois argumentos são passados para ela: o número de bytes gravados no `buffer` e uma referência ao `buffer`. Retorne `false` desta função para `pause()` implicitamente o socket. Esta função será executada no contexto global.

    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Permite leituras no socket quando um `fd` é passado, caso contrário, é ignorado. **Padrão:** `false`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Um sinal de Abort que pode ser usado para destruir o socket.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Permite gravações no socket quando um `fd` é passado, caso contrário, é ignorado. **Padrão:** `false`.

- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket)

Cria um novo objeto socket.

O socket recém-criado pode ser um socket TCP ou um ponto de extremidade [IPC](/pt/nodejs/api/net#ipc-support) de streaming, dependendo do que ele [`connect()`](/pt/nodejs/api/net#socketconnect) para.


### Evento: `'close'` {#event-close_1}

**Adicionado em: v0.1.90**

- `hadError` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se o socket teve um erro de transmissão.

Emitido quando o socket é totalmente fechado. O argumento `hadError` é um booleano que indica se o socket foi fechado devido a um erro de transmissão.

### Evento: `'connect'` {#event-connect}

**Adicionado em: v0.1.90**

Emitido quando uma conexão de socket é estabelecida com sucesso. Veja [`net.createConnection()`](/pt/nodejs/api/net#netcreateconnection).

### Evento: `'connectionAttempt'` {#event-connectionattempt}

**Adicionado em: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O IP ao qual o socket está tentando se conectar.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A porta à qual o socket está tentando se conectar.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A família do IP. Pode ser `6` para IPv6 ou `4` para IPv4.

Emitido quando uma nova tentativa de conexão é iniciada. Isso pode ser emitido várias vezes se o algoritmo de seleção automática de família estiver ativado em [`socket.connect(options)`](/pt/nodejs/api/net#socketconnectoptions-connectlistener).

### Evento: `'connectionAttemptFailed'` {#event-connectionattemptfailed}

**Adicionado em: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O IP ao qual o socket tentou se conectar.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A porta à qual o socket tentou se conectar.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A família do IP. Pode ser `6` para IPv6 ou `4` para IPv4.
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) O erro associado à falha.

Emitido quando uma tentativa de conexão falhou. Isso pode ser emitido várias vezes se o algoritmo de seleção automática de família estiver ativado em [`socket.connect(options)`](/pt/nodejs/api/net#socketconnectoptions-connectlistener).


### Evento: `'connectionAttemptTimeout'` {#event-connectionattempttimeout}

**Adicionado em: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O IP ao qual o socket tentou se conectar.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A porta à qual o socket tentou se conectar.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A família do IP. Pode ser `6` para IPv6 ou `4` para IPv4.

Emitido quando uma tentativa de conexão atinge o tempo limite. Isso só é emitido (e pode ser emitido várias vezes) se o algoritmo de seleção automática de família estiver habilitado em [`socket.connect(options)`](/pt/nodejs/api/net#socketconnectoptions-connectlistener).

### Evento: `'data'` {#event-data}

**Adicionado em: v0.1.90**

- [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Emitido quando os dados são recebidos. O argumento `data` será um `Buffer` ou `String`. A codificação dos dados é definida por [`socket.setEncoding()`](/pt/nodejs/api/net#socketsetencodingencoding).

Os dados serão perdidos se não houver um listener quando um `Socket` emitir um evento `'data'`.

### Evento: `'drain'` {#event-drain}

**Adicionado em: v0.1.90**

Emitido quando o buffer de escrita se torna vazio. Pode ser usado para limitar os uploads.

Veja também: os valores de retorno de `socket.write()`.

### Evento: `'end'` {#event-end}

**Adicionado em: v0.1.90**

Emitido quando a outra extremidade do socket sinaliza o fim da transmissão, terminando assim o lado legível do socket.

Por padrão (`allowHalfOpen` é `false`), o socket enviará um pacote de fim de transmissão de volta e destruirá seu descritor de arquivo assim que tiver gravado sua fila de escrita pendente. No entanto, se `allowHalfOpen` estiver definido como `true`, o socket não irá automaticamente [`end()`](/pt/nodejs/api/net#socketenddata-encoding-callback) seu lado gravável, permitindo que o usuário escreva quantidades arbitrárias de dados. O usuário deve chamar [`end()`](/pt/nodejs/api/net#socketenddata-encoding-callback) explicitamente para fechar a conexão (ou seja, enviando um pacote FIN de volta).


### Evento: `'error'` {#event-error_1}

**Adicionado em: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitido quando ocorre um erro. O evento `'close'` será chamado diretamente após este evento.

### Evento: `'lookup'` {#event-lookup}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v5.10.0 | O parâmetro `host` agora é suportado. |
| v0.11.3 | Adicionado em: v0.11.3 |
:::

Emitido após resolver o nome do host, mas antes de conectar. Não aplicável a sockets Unix.

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) O objeto de erro. Veja [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback).
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O endereço IP.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) O tipo de endereço. Veja [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do host.

### Evento: `'ready'` {#event-ready}

**Adicionado em: v9.11.0**

Emitido quando um socket está pronto para ser usado.

Acionado imediatamente após `'connect'`.

### Evento: `'timeout'` {#event-timeout}

**Adicionado em: v0.1.90**

Emitido se o socket atinge o tempo limite por inatividade. Isso serve apenas para notificar que o socket está ocioso. O usuário deve fechar manualmente a conexão.

Veja também: [`socket.setTimeout()`](/pt/nodejs/api/net#socketsettimeouttimeout-callback).

### `socket.address()` {#socketaddress}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.4.0 | A propriedade `family` agora retorna uma string em vez de um número. |
| v18.0.0 | A propriedade `family` agora retorna um número em vez de uma string. |
| v0.1.90 | Adicionado em: v0.1.90 |
:::

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna o `address` vinculado, o nome da `family` do endereço e a `port` do socket conforme relatado pelo sistema operacional: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`


### `socket.autoSelectFamilyAttemptedAddresses` {#socketautoselectfamilyattemptedaddresses}

**Adicionado em: v19.4.0, v18.18.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Esta propriedade está presente apenas se o algoritmo de autoseleção de família estiver habilitado em [`socket.connect(options)`](/pt/nodejs/api/net#socketconnectoptions-connectlistener) e é um array dos endereços que foram tentados.

Cada endereço é uma string no formato `$IP:$PORT`. Se a conexão foi bem-sucedida, o último endereço é aquele ao qual o socket está atualmente conectado.

### `socket.bufferSize` {#socketbuffersize}

**Adicionado em: v0.3.8**

**Obsoleto desde: v14.6.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`writable.writableLength`](/pt/nodejs/api/stream#writablewritablelength) em vez disso.
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Esta propriedade mostra o número de caracteres em buffer para escrita. O buffer pode conter strings cujo comprimento após a codificação ainda não é conhecido. Portanto, este número é apenas uma aproximação do número de bytes no buffer.

`net.Socket` tem a propriedade de que `socket.write()` sempre funciona. Isso é para ajudar os usuários a começar a usar rapidamente. O computador nem sempre consegue acompanhar a quantidade de dados gravados em um socket. A conexão de rede pode simplesmente ser muito lenta. O Node.js irá internamente enfileirar os dados gravados em um socket e enviá-los pela rede quando for possível.

A consequência desse buffering interno é que a memória pode crescer. Os usuários que experimentam `bufferSize` grande ou crescente devem tentar "restringir" os fluxos de dados em seu programa com [`socket.pause()`](/pt/nodejs/api/net#socketpause) e [`socket.resume()`](/pt/nodejs/api/net#socketresume).

### `socket.bytesRead` {#socketbytesread}

**Adicionado em: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A quantidade de bytes recebidos.


### `socket.bytesWritten` {#socketbyteswritten}

**Adicionado em: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A quantidade de bytes enviados.

### `socket.connect()` {#socketconnect}

Inicia uma conexão em um determinado socket.

Possíveis assinaturas:

- [`socket.connect(options[, connectListener])`](/pt/nodejs/api/net#socketconnectoptions-connectlistener)
- [`socket.connect(path[, connectListener])`](/pt/nodejs/api/net#socketconnectpath-connectlistener) para conexões [IPC](/pt/nodejs/api/net#ipc-support).
- [`socket.connect(port[, host][, connectListener])`](/pt/nodejs/api/net#socketconnectport-host-connectlistener) para conexões TCP.
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O próprio socket.

Esta função é assíncrona. Quando a conexão é estabelecida, o evento [`'connect'`](/pt/nodejs/api/net#event-connect) será emitido. Se houver um problema ao conectar, em vez de um evento [`'connect'`](/pt/nodejs/api/net#event-connect), um evento [`'error'`](/pt/nodejs/api/net#event-error_1) será emitido com o erro passado para o listener [`'error'`](/pt/nodejs/api/net#event-error_1). O último parâmetro `connectListener`, se fornecido, será adicionado como um listener para o evento [`'connect'`](/pt/nodejs/api/net#event-connect) **uma vez**.

Esta função deve ser usada apenas para reconectar um socket após `'close'` ter sido emitido ou, caso contrário, pode levar a um comportamento indefinido.

#### `socket.connect(options[, connectListener])` {#socketconnectoptions-connectlistener}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.4.0 | O valor padrão para a opção autoSelectFamily pode ser alterado em tempo de execução usando `setDefaultAutoSelectFamily` ou através da opção de linha de comando `--enable-network-family-autoselection`. |
| v20.0.0, v18.18.0 | O valor padrão para a opção autoSelectFamily agora é true. O sinalizador CLI `--enable-network-family-autoselection` foi renomeado para `--network-family-autoselection`. O nome antigo agora é um alias, mas é desencorajado. |
| v19.3.0, v18.13.0 | Adicionada a opção `autoSelectFamily`. |
| v17.7.0, v16.15.0 | As opções `noDelay`, `keepAlive` e `keepAliveInitialDelay` são suportadas agora. |
| v6.0.0 | A opção `hints` agora assume o valor padrão de `0` em todos os casos. Anteriormente, na ausência da opção `family`, ela assumiria o valor padrão de `dns.ADDRCONFIG | dns.V4MAPPED`. |
| v5.11.0 | A opção `hints` é suportada agora. |
| v0.1.90 | Adicionado em: v0.1.90 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parâmetro comum dos métodos [`socket.connect()`](/pt/nodejs/api/net#socketconnect). Será adicionado como um listener para o evento [`'connect'`](/pt/nodejs/api/net#event-connect) uma vez.
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O próprio socket.

Inicia uma conexão em um determinado socket. Normalmente, este método não é necessário, o socket deve ser criado e aberto com [`net.createConnection()`](/pt/nodejs/api/net#netcreateconnection). Use isso apenas ao implementar um Socket personalizado.

Para conexões TCP, as `options` disponíveis são:

- `autoSelectFamily` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): Se definido como `true`, ele ativa um algoritmo de detecção automática de família que implementa superficialmente a seção 5 do [RFC 8305](https://www.rfc-editor.org/rfc/rfc8305.txt). A opção `all` passada para lookup é definida como `true` e o socket tenta se conectar a todos os endereços IPv6 e IPv4 obtidos, em sequência, até que uma conexão seja estabelecida. O primeiro endereço AAAA retornado é tentado primeiro, depois o primeiro endereço A retornado, depois o segundo endereço AAAA retornado e assim por diante. Cada tentativa de conexão (exceto a última) recebe a quantidade de tempo especificada pela opção `autoSelectFamilyAttemptTimeout` antes de expirar o tempo limite e tentar o próximo endereço. Ignorado se a opção `family` não for `0` ou se `localAddress` estiver definido. Erros de conexão não são emitidos se pelo menos uma conexão for bem-sucedida. Se todas as tentativas de conexão falharem, um único `AggregateError` com todas as tentativas com falha é emitido. **Padrão:** [`net.getDefaultAutoSelectFamily()`](/pt/nodejs/api/net#netgetdefaultautoselectfamily).
- `autoSelectFamilyAttemptTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): A quantidade de tempo em milissegundos para esperar que uma tentativa de conexão termine antes de tentar o próximo endereço ao usar a opção `autoSelectFamily`. Se definido como um número inteiro positivo menor que `10`, o valor `10` será usado em vez disso. **Padrão:** [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/pt/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): Versão da pilha IP. Deve ser `4`, `6` ou `0`. O valor `0` indica que os endereços IPv4 e IPv6 são permitidos. **Padrão:** `0`.
- `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`dns.lookup()` dicas](/pt/nodejs/api/dns#supported-getaddrinfo-flags) opcionais.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host ao qual o socket deve se conectar. **Padrão:** `'localhost'`.
- `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `true`, ele ativa a funcionalidade keep-alive no socket imediatamente após a conexão ser estabelecida, semelhante ao que é feito em [`socket.setKeepAlive()`](/pt/nodejs/api/net#socketsetkeepaliveenable-initialdelay). **Padrão:** `false`.
- `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se definido como um número positivo, ele define o atraso inicial antes que a primeira sonda keepalive seja enviada em um socket ocioso. **Padrão:** `0`.
- `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Endereço local do qual o socket deve se conectar.
- `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta local da qual o socket deve se conectar.
- `lookup` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função de pesquisa personalizada. **Padrão:** [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback).
- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `true`, ele desativa o uso do algoritmo de Nagle imediatamente após o socket ser estabelecido. **Padrão:** `false`.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Obrigatório. Porta à qual o socket deve se conectar.
- `blockList` [\<net.BlockList\>](/pt/nodejs/api/net#class-netblocklist) `blockList` pode ser usado para desativar o acesso de saída a endereços IP, intervalos de IP ou sub-redes IP específicos.

Para conexões [IPC](/pt/nodejs/api/net#ipc-support), as `options` disponíveis são:

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Obrigatório. Caminho ao qual o cliente deve se conectar. Veja [Identificando caminhos para conexões IPC](/pt/nodejs/api/net#identifying-paths-for-ipc-connections). Se fornecido, as opções específicas do TCP acima são ignoradas.


#### `socket.connect(path[, connectListener])` {#socketconnectpath-connectlistener}

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Caminho ao qual o cliente deve se conectar. Consulte [Identificando caminhos para conexões IPC](/pt/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parâmetro comum dos métodos [`socket.connect()`](/pt/nodejs/api/net#socketconnect). Será adicionado como um listener para o evento [`'connect'`](/pt/nodejs/api/net#event-connect) uma vez.
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O próprio socket.

Inicia uma conexão [IPC](/pt/nodejs/api/net#ipc-support) no socket fornecido.

Alias para [`socket.connect(options[, connectListener])`](/pt/nodejs/api/net#socketconnectoptions-connectlistener) chamado com `{ path: path }` como `options`.

#### `socket.connect(port[, host][, connectListener])` {#socketconnectport-host-connectlistener}

**Adicionado em: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta à qual o cliente deve se conectar.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host ao qual o cliente deve se conectar.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parâmetro comum dos métodos [`socket.connect()`](/pt/nodejs/api/net#socketconnect). Será adicionado como um listener para o evento [`'connect'`](/pt/nodejs/api/net#event-connect) uma vez.
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O próprio socket.

Inicia uma conexão TCP no socket fornecido.

Alias para [`socket.connect(options[, connectListener])`](/pt/nodejs/api/net#socketconnectoptions-connectlistener) chamado com `{port: port, host: host}` como `options`.

### `socket.connecting` {#socketconnecting}

**Adicionado em: v6.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se `true`, [`socket.connect(options[, connectListener])`](/pt/nodejs/api/net#socketconnectoptions-connectlistener) foi chamado e ainda não terminou. Ele permanecerá `true` até que o socket seja conectado, então é definido como `false` e o evento `'connect'` é emitido. Observe que o callback [`socket.connect(options[, connectListener])`](/pt/nodejs/api/net#socketconnectoptions-connectlistener) é um listener para o evento `'connect'`.


### `socket.destroy([error])` {#socketdestroyerror}

**Adicionado em: v0.1.90**

- `error` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket)

Garante que não ocorra mais atividade de I/O neste socket. Destrói o fluxo e fecha a conexão.

Veja [`writable.destroy()`](/pt/nodejs/api/stream#writabledestroyerror) para mais detalhes.

### `socket.destroyed` {#socketdestroyed}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se a conexão está destruída ou não. Uma vez que uma conexão é destruída, nenhum dado adicional pode ser transferido usando-a.

Veja [`writable.destroyed`](/pt/nodejs/api/stream#writabledestroyed) para mais detalhes.

### `socket.destroySoon()` {#socketdestroysoon}

**Adicionado em: v0.3.4**

Destrói o socket após todos os dados serem escritos. Se o evento `'finish'` já foi emitido, o socket é destruído imediatamente. Se o socket ainda é gravável, ele implicitamente chama `socket.end()`.

### `socket.end([data[, encoding]][, callback])` {#socketenddata-encoding-callback}

**Adicionado em: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Usado apenas quando os dados são `string`. **Padrão:** `'utf8'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback opcional para quando o socket é finalizado.
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O próprio socket.

Fecha o socket pela metade. Ou seja, ele envia um pacote FIN. É possível que o servidor ainda envie alguns dados.

Veja [`writable.end()`](/pt/nodejs/api/stream#writableendchunk-encoding-callback) para mais detalhes.

### `socket.localAddress` {#socketlocaladdress}

**Adicionado em: v0.9.6**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A representação em string do endereço IP local no qual o cliente remoto está se conectando. Por exemplo, em um servidor que está ouvindo em `'0.0.0.0'`, se um cliente se conectar em `'192.168.1.1'`, o valor de `socket.localAddress` seria `'192.168.1.1'`.


### `socket.localPort` {#socketlocalport}

**Adicionado em: v0.9.6**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A representação numérica da porta local. Por exemplo, `80` ou `21`.

### `socket.localFamily` {#socketlocalfamily}

**Adicionado em: v18.8.0, v16.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A representação em string da família de IP local. `'IPv4'` ou `'IPv6'`.

### `socket.pause()` {#socketpause}

- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O próprio socket.

Pausa a leitura de dados. Ou seja, eventos [`'data'`](/pt/nodejs/api/net#event-data) não serão emitidos. Útil para diminuir a velocidade de um upload.

### `socket.pending` {#socketpending}

**Adicionado em: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Isto é `true` se o socket ainda não estiver conectado, seja porque `.connect()` ainda não foi chamado ou porque ainda está em processo de conexão (veja [`socket.connecting`](/pt/nodejs/api/net#socketconnecting)).

### `socket.ref()` {#socketref}

**Adicionado em: v0.9.1**

- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O próprio socket.

O oposto de `unref()`, chamar `ref()` em um socket previamente `unref` não permitirá que o programa saia se for o único socket restante (o comportamento padrão). Se o socket for `ref`, chamar `ref` novamente não terá efeito.

### `socket.remoteAddress` {#socketremoteaddress}

**Adicionado em: v0.5.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A representação em string do endereço IP remoto. Por exemplo, `'74.125.127.100'` ou `'2001:4860:a005::68'`. O valor pode ser `undefined` se o socket for destruído (por exemplo, se o cliente se desconectar).

### `socket.remoteFamily` {#socketremotefamily}

**Adicionado em: v0.11.14**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A representação em string da família de IP remota. `'IPv4'` ou `'IPv6'`. O valor pode ser `undefined` se o socket for destruído (por exemplo, se o cliente se desconectar).


### `socket.remotePort` {#socketremoteport}

**Adicionado em: v0.5.10**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A representação numérica da porta remota. Por exemplo, `80` ou `21`. O valor pode ser `undefined` se o socket for destruído (por exemplo, se o cliente desconectar).

### `socket.resetAndDestroy()` {#socketresetanddestroy}

**Adicionado em: v18.3.0, v16.17.0**

- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket)

Fecha a conexão TCP enviando um pacote RST e destrói o stream. Se este socket TCP estiver em status de conexão, ele enviará um pacote RST e destruirá este socket TCP assim que estiver conectado. Caso contrário, ele chamará `socket.destroy` com um erro `ERR_SOCKET_CLOSED`. Se este não for um socket TCP (por exemplo, um pipe), chamar este método lançará imediatamente um erro `ERR_INVALID_HANDLE_TYPE`.

### `socket.resume()` {#socketresume}

- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O próprio socket.

Retoma a leitura após uma chamada para [`socket.pause()`](/pt/nodejs/api/net#socketpause).

### `socket.setEncoding([encoding])` {#socketsetencodingencoding}

**Adicionado em: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O próprio socket.

Define a codificação para o socket como um [Readable Stream](/pt/nodejs/api/stream#class-streamreadable). Veja [`readable.setEncoding()`](/pt/nodejs/api/stream#readablesetencodingencoding) para mais informações.

### `socket.setKeepAlive([enable][, initialDelay])` {#socketsetkeepaliveenable-initialdelay}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.12.0, v12.17.0 | Novos padrões para as opções de socket `TCP_KEEPCNT` e `TCP_KEEPINTVL` foram adicionados. |
| v0.1.92 | Adicionado em: v0.1.92 |
:::

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O próprio socket.

Habilita/desabilita a funcionalidade keep-alive e, opcionalmente, define o atraso inicial antes que a primeira sonda keepalive seja enviada em um socket ocioso.

Defina `initialDelay` (em milissegundos) para definir o atraso entre o último pacote de dados recebido e a primeira sonda keepalive. Definir `0` para `initialDelay` deixará o valor inalterado em relação à configuração padrão (ou anterior).

Habilitar a funcionalidade keep-alive definirá as seguintes opções de socket:

- `SO_KEEPALIVE=1`
- `TCP_KEEPIDLE=initialDelay`
- `TCP_KEEPCNT=10`
- `TCP_KEEPINTVL=1`


### `socket.setNoDelay([noDelay])` {#socketsetnodelaynodelay}

**Adicionado em: v0.1.90**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O próprio socket.

Habilita/desabilita o uso do algoritmo de Nagle.

Quando uma conexão TCP é criada, ela terá o algoritmo de Nagle habilitado.

O algoritmo de Nagle atrasa os dados antes de serem enviados pela rede. Ele tenta otimizar a taxa de transferência em detrimento da latência.

Passar `true` para `noDelay` ou não passar um argumento desabilitará o algoritmo de Nagle para o socket. Passar `false` para `noDelay` habilitará o algoritmo de Nagle.

### `socket.setTimeout(timeout[, callback])` {#socketsettimeouttimeout-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v0.1.90 | Adicionado em: v0.1.90 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O próprio socket.

Define o socket para timeout após `timeout` milissegundos de inatividade no socket. Por padrão, `net.Socket` não tem um timeout.

Quando um timeout ocioso é acionado, o socket receberá um evento [`'timeout'`](/pt/nodejs/api/net#event-timeout), mas a conexão não será interrompida. O usuário deve chamar manualmente [`socket.end()`](/pt/nodejs/api/net#socketenddata-encoding-callback) ou [`socket.destroy()`](/pt/nodejs/api/net#socketdestroyerror) para finalizar a conexão.

```js [ESM]
socket.setTimeout(3000);
socket.on('timeout', () => {
  console.log('timeout do socket');
  socket.end();
});
```
Se `timeout` for 0, então o timeout ocioso existente é desabilitado.

O parâmetro opcional `callback` será adicionado como um listener único para o evento [`'timeout'`](/pt/nodejs/api/net#event-timeout).


### `socket.timeout` {#sockettimeout}

**Adicionado em: v10.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

O tempo limite do socket em milissegundos, conforme definido por [`socket.setTimeout()`](/pt/nodejs/api/net#socketsettimeouttimeout-callback). É `undefined` se um tempo limite não foi definido.

### `socket.unref()` {#socketunref}

**Adicionado em: v0.9.1**

- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O próprio socket.

Chamar `unref()` em um socket permitirá que o programa seja encerrado se este for o único socket ativo no sistema de eventos. Se o socket já estiver `unref`ed, chamar `unref()` novamente não terá efeito.

### `socket.write(data[, encoding][, callback])` {#socketwritedata-encoding-callback}

**Adicionado em: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Usado apenas quando os dados são `string`. **Padrão:** `utf8`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Envia dados no socket. O segundo parâmetro especifica a codificação no caso de uma string. O padrão é a codificação UTF8.

Retorna `true` se todos os dados foram descarregados com sucesso para o buffer do kernel. Retorna `false` se todos ou parte dos dados foram enfileirados na memória do usuário. [`'drain'`](/pt/nodejs/api/net#event-drain) será emitido quando o buffer estiver livre novamente.

O parâmetro opcional `callback` será executado quando os dados forem finalmente gravados, o que pode não ser imediatamente.

Veja o método [`write()`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback) do stream `Writable` para mais informações.


### `socket.readyState` {#socketreadystate}

**Adicionado em: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Esta propriedade representa o estado da conexão como uma string.

- Se o stream estiver se conectando, `socket.readyState` é `opening`.
- Se o stream for legível e gravável, é `open`.
- Se o stream for legível e não gravável, é `readOnly`.
- Se o stream não for legível e gravável, é `writeOnly`.

## `net.connect()` {#netconnect}

Aliases para [`net.createConnection()`](/pt/nodejs/api/net#netcreateconnection).

Possíveis assinaturas:

- [`net.connect(options[, connectListener])`](/pt/nodejs/api/net#netconnectoptions-connectlistener)
- [`net.connect(path[, connectListener])`](/pt/nodejs/api/net#netconnectpath-connectlistener) para conexões [IPC](/pt/nodejs/api/net#ipc-support).
- [`net.connect(port[, host][, connectListener])`](/pt/nodejs/api/net#netconnectport-host-connectlistener) para conexões TCP.

### `net.connect(options[, connectListener])` {#netconnectoptions-connectlistener}

**Adicionado em: v0.7.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket)

Alias para [`net.createConnection(options[, connectListener])`](/pt/nodejs/api/net#netcreateconnectionoptions-connectlistener).

### `net.connect(path[, connectListener])` {#netconnectpath-connectlistener}

**Adicionado em: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket)

Alias para [`net.createConnection(path[, connectListener])`](/pt/nodejs/api/net#netcreateconnectionpath-connectlistener).

### `net.connect(port[, host][, connectListener])` {#netconnectport-host-connectlistener}

**Adicionado em: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket)

Alias para [`net.createConnection(port[, host][, connectListener])`](/pt/nodejs/api/net#netcreateconnectionport-host-connectlistener).


## `net.createConnection()` {#netcreateconnection}

Uma função de fábrica, que cria um novo [`net.Socket`](/pt/nodejs/api/net#class-netsocket), inicia imediatamente a conexão com [`socket.connect()`](/pt/nodejs/api/net#socketconnect) e, em seguida, retorna o `net.Socket` que inicia a conexão.

Quando a conexão é estabelecida, um evento [`'connect'`](/pt/nodejs/api/net#event-connect) será emitido no socket retornado. O último parâmetro `connectListener`, se fornecido, será adicionado como um listener para o evento [`'connect'`](/pt/nodejs/api/net#event-connect) **uma vez**.

Assinaturas possíveis:

- [`net.createConnection(options[, connectListener])`](/pt/nodejs/api/net#netcreateconnectionoptions-connectlistener)
- [`net.createConnection(path[, connectListener])`](/pt/nodejs/api/net#netcreateconnectionpath-connectlistener) para conexões [IPC](/pt/nodejs/api/net#ipc-support).
- [`net.createConnection(port[, host][, connectListener])`](/pt/nodejs/api/net#netcreateconnectionport-host-connectlistener) para conexões TCP.

A função [`net.connect()`](/pt/nodejs/api/net#netconnect) é um alias para esta função.

### `net.createConnection(options[, connectListener])` {#netcreateconnectionoptions-connectlistener}

**Adicionado em: v0.1.90**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Obrigatório. Será passado para a chamada [`new net.Socket([options])`](/pt/nodejs/api/net#new-netsocketoptions) e para o método [`socket.connect(options[, connectListener])`](/pt/nodejs/api/net#socketconnectoptions-connectlistener).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parâmetro comum das funções [`net.createConnection()`](/pt/nodejs/api/net#netcreateconnection). Se fornecido, será adicionado como um listener para o evento [`'connect'`](/pt/nodejs/api/net#event-connect) no socket retornado uma vez.
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O socket recém-criado usado para iniciar a conexão.

Para opções disponíveis, consulte [`new net.Socket([options])`](/pt/nodejs/api/net#new-netsocketoptions) e [`socket.connect(options[, connectListener])`](/pt/nodejs/api/net#socketconnectoptions-connectlistener).

Opções adicionais:

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se definido, será usado para chamar [`socket.setTimeout(timeout)`](/pt/nodejs/api/net#socketsettimeouttimeout-callback) após a criação do socket, mas antes de iniciar a conexão.

A seguir, um exemplo de um cliente do servidor de eco descrito na seção [`net.createServer()`](/pt/nodejs/api/net#netcreateserveroptions-connectionlistener):

::: code-group
```js [ESM]
import net from 'node:net';
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```

```js [CJS]
const net = require('node:net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```
:::

Para conectar no socket `/tmp/echo.sock`:

```js [ESM]
const client = net.createConnection({ path: '/tmp/echo.sock' });
```
A seguir, um exemplo de um cliente usando a opção `port` e `onread`. Neste caso, a opção `onread` será usada apenas para chamar `new net.Socket([options])` e a opção `port` será usada para chamar `socket.connect(options[, connectListener])`.

::: code-group
```js [ESM]
import net from 'node:net';
import { Buffer } from 'node:buffer';
net.createConnection({
  port: 8124,
  onread: {
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```

```js [CJS]
const net = require('node:net');
net.createConnection({
  port: 8124,
  onread: {
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```
:::


### `net.createConnection(path[, connectListener])` {#netcreateconnectionpath-connectlistener}

**Adicionado em: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Caminho ao qual o socket deve se conectar. Será passado para [`socket.connect(path[, connectListener])`](/pt/nodejs/api/net#socketconnectpath-connectlistener). Veja [Identificação de caminhos para conexões IPC](/pt/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parâmetro comum das funções [`net.createConnection()`](/pt/nodejs/api/net#netcreateconnection), um listener "once" para o evento `'connect'` no socket iniciador. Será passado para [`socket.connect(path[, connectListener])`](/pt/nodejs/api/net#socketconnectpath-connectlistener).
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O socket recém-criado usado para iniciar a conexão.

Inicia uma conexão [IPC](/pt/nodejs/api/net#ipc-support).

Esta função cria um novo [`net.Socket`](/pt/nodejs/api/net#class-netsocket) com todas as opções definidas como padrão, inicia imediatamente a conexão com [`socket.connect(path[, connectListener])`](/pt/nodejs/api/net#socketconnectpath-connectlistener), então retorna o `net.Socket` que inicia a conexão.

### `net.createConnection(port[, host][, connectListener])` {#netcreateconnectionport-host-connectlistener}

**Adicionado em: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta à qual o socket deve se conectar. Será passado para [`socket.connect(port[, host][, connectListener])`](/pt/nodejs/api/net#socketconnectport-host-connectlistener).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host ao qual o socket deve se conectar. Será passado para [`socket.connect(port[, host][, connectListener])`](/pt/nodejs/api/net#socketconnectport-host-connectlistener). **Padrão:** `'localhost'`.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parâmetro comum das funções [`net.createConnection()`](/pt/nodejs/api/net#netcreateconnection), um listener "once" para o evento `'connect'` no socket iniciador. Será passado para [`socket.connect(port[, host][, connectListener])`](/pt/nodejs/api/net#socketconnectport-host-connectlistener).
- Retorna: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) O socket recém-criado usado para iniciar a conexão.

Inicia uma conexão TCP.

Esta função cria um novo [`net.Socket`](/pt/nodejs/api/net#class-netsocket) com todas as opções definidas como padrão, inicia imediatamente a conexão com [`socket.connect(port[, host][, connectListener])`](/pt/nodejs/api/net#socketconnectport-host-connectlistener), então retorna o `net.Socket` que inicia a conexão.


## `net.createServer([options][, connectionListener])` {#netcreateserveroptions-connectionlistener}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.1.0, v18.17.0 | A opção `highWaterMark` agora é suportada. |
| v17.7.0, v16.15.0 | As opções `noDelay`, `keepAlive` e `keepAliveInitialDelay` agora são suportadas. |
| v0.5.0 | Adicionado em: v0.5.0 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `false`, o socket finalizará automaticamente o lado gravável quando o lado legível terminar. **Padrão:** `false`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Opcionalmente, substitui `readableHighWaterMark` e `writableHighWaterMark` de todos os [`net.Socket`](/pt/nodejs/api/net#class-netsocket)s. **Padrão:** Veja [`stream.getDefaultHighWaterMark()`](/pt/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode).
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `true`, habilita a funcionalidade keep-alive no socket imediatamente após o recebimento de uma nova conexão de entrada, de forma semelhante ao que é feito em [`socket.setKeepAlive()`](/pt/nodejs/api/net#socketsetkeepaliveenable-initialdelay). **Padrão:** `false`.
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se definido como um número positivo, define o atraso inicial antes que a primeira sonda keepalive seja enviada em um socket ocioso. **Padrão:** `0`.
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `true`, desativa o uso do algoritmo de Nagle imediatamente após o recebimento de uma nova conexão de entrada. **Padrão:** `false`.
    - `pauseOnConnect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se o socket deve ser pausado em conexões de entrada. **Padrão:** `false`.
    - `blockList` [\<net.BlockList\>](/pt/nodejs/api/net#class-netblocklist) `blockList` pode ser usado para desabilitar o acesso de entrada a endereços IP, intervalos de IP ou sub-redes IP específicos. Isso não funciona se o servidor estiver atrás de um proxy reverso, NAT, etc., porque o endereço verificado em relação à lista de bloqueio é o endereço do proxy ou aquele especificado pelo NAT.


- `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Definido automaticamente como um listener para o evento [`'connection'`](/pt/nodejs/api/net#event-connection).
- Retorna: [\<net.Server\>](/pt/nodejs/api/net#class-netserver)

Cria um novo servidor TCP ou [IPC](/pt/nodejs/api/net#ipc-support).

Se `allowHalfOpen` for definido como `true`, quando a outra extremidade do socket sinalizar o fim da transmissão, o servidor só enviará de volta o fim da transmissão quando [`socket.end()`](/pt/nodejs/api/net#socketenddata-encoding-callback) for explicitamente chamado. Por exemplo, no contexto do TCP, quando um pacote FIN é recebido, um pacote FIN é enviado de volta somente quando [`socket.end()`](/pt/nodejs/api/net#socketenddata-encoding-callback) é explicitamente chamado. Até então, a conexão está meio fechada (não legível, mas ainda gravável). Veja o evento [`'end'`](/pt/nodejs/api/net#event-end) e [RFC 1122](https://tools.ietf.org/html/rfc1122) (seção 4.2.2.13) para obter mais informações.

Se `pauseOnConnect` for definido como `true`, o socket associado a cada conexão de entrada será pausado e nenhum dado será lido de seu manipulador. Isso permite que as conexões sejam passadas entre os processos sem que nenhum dado seja lido pelo processo original. Para começar a ler dados de um socket pausado, chame [`socket.resume()`](/pt/nodejs/api/net#socketresume).

O servidor pode ser um servidor TCP ou um servidor [IPC](/pt/nodejs/api/net#ipc-support), dependendo de a que ele [`listen()`](/pt/nodejs/api/net#serverlisten).

Aqui está um exemplo de um servidor de eco TCP que escuta conexões na porta 8124:



::: code-group
```js [ESM]
import net from 'node:net';
const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
```

```js [CJS]
const net = require('node:net');
const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
```
:::

Teste isso usando `telnet`:

```bash [BASH]
telnet localhost 8124
```
Para escutar no socket `/tmp/echo.sock`:

```js [ESM]
server.listen('/tmp/echo.sock', () => {
  console.log('server bound');
});
```
Use `nc` para se conectar a um servidor de socket de domínio Unix:

```bash [BASH]
nc -U /tmp/echo.sock
```

## `net.getDefaultAutoSelectFamily()` {#netgetdefaultautoselectfamily}

**Adicionado em: v19.4.0**

Obtém o valor padrão atual da opção `autoSelectFamily` de [`socket.connect(options)`](/pt/nodejs/api/net#socketconnectoptions-connectlistener). O valor padrão inicial é `true`, a menos que a opção de linha de comando `--no-network-family-autoselection` seja fornecida.

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) O valor padrão atual da opção `autoSelectFamily`.

## `net.setDefaultAutoSelectFamily(value)` {#netsetdefaultautoselectfamilyvalue}

**Adicionado em: v19.4.0**

Define o valor padrão da opção `autoSelectFamily` de [`socket.connect(options)`](/pt/nodejs/api/net#socketconnectoptions-connectlistener).

- `value` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) O novo valor padrão. O valor padrão inicial é `true`, a menos que a opção de linha de comando `--no-network-family-autoselection` seja fornecida.

## `net.getDefaultAutoSelectFamilyAttemptTimeout()` {#netgetdefaultautoselectfamilyattempttimeout}

**Adicionado em: v19.8.0, v18.18.0**

Obtém o valor padrão atual da opção `autoSelectFamilyAttemptTimeout` de [`socket.connect(options)`](/pt/nodejs/api/net#socketconnectoptions-connectlistener). O valor padrão inicial é `250` ou o valor especificado por meio da opção de linha de comando `--network-family-autoselection-attempt-timeout`.

- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O valor padrão atual da opção `autoSelectFamilyAttemptTimeout`.

## `net.setDefaultAutoSelectFamilyAttemptTimeout(value)` {#netsetdefaultautoselectfamilyattempttimeoutvalue}

**Adicionado em: v19.8.0, v18.18.0**

Define o valor padrão da opção `autoSelectFamilyAttemptTimeout` de [`socket.connect(options)`](/pt/nodejs/api/net#socketconnectoptions-connectlistener).

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O novo valor padrão, que deve ser um número positivo. Se o número for menor que `10`, o valor `10` será usado em vez disso. O valor padrão inicial é `250` ou o valor especificado por meio da opção de linha de comando `--network-family-autoselection-attempt-timeout`.


## `net.isIP(input)` {#netisipinput}

**Adicionado em: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna `6` se `input` for um endereço IPv6. Retorna `4` se `input` for um endereço IPv4 em [notação decimal pontilhada](https://en.wikipedia.org/wiki/Dot-decimal_notation) sem zeros à esquerda. Caso contrário, retorna `0`.

```js [ESM]
net.isIP('::1'); // retorna 6
net.isIP('127.0.0.1'); // retorna 4
net.isIP('127.000.000.001'); // retorna 0
net.isIP('127.0.0.1/24'); // retorna 0
net.isIP('fhqwhgads'); // retorna 0
```
## `net.isIPv4(input)` {#netisipv4input}

**Adicionado em: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se `input` for um endereço IPv4 em [notação decimal pontilhada](https://en.wikipedia.org/wiki/Dot-decimal_notation) sem zeros à esquerda. Caso contrário, retorna `false`.

```js [ESM]
net.isIPv4('127.0.0.1'); // retorna true
net.isIPv4('127.000.000.001'); // retorna false
net.isIPv4('127.0.0.1/24'); // retorna false
net.isIPv4('fhqwhgads'); // retorna false
```
## `net.isIPv6(input)` {#netisipv6input}

**Adicionado em: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` se `input` for um endereço IPv6. Caso contrário, retorna `false`.

```js [ESM]
net.isIPv6('::1'); // retorna true
net.isIPv6('fhqwhgads'); // retorna false
```

