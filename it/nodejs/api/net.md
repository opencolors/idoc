---
title: Documentazione Node.js - Rete
description: Il modulo 'net' in Node.js fornisce un'API di rete asincrona per creare server e client TCP o IPC basati su flussi. Include metodi per creare connessioni, server e gestire operazioni di socket.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Rete | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo 'net' in Node.js fornisce un'API di rete asincrona per creare server e client TCP o IPC basati su flussi. Include metodi per creare connessioni, server e gestire operazioni di socket.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Rete | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo 'net' in Node.js fornisce un'API di rete asincrona per creare server e client TCP o IPC basati su flussi. Include metodi per creare connessioni, server e gestire operazioni di socket.
---


# Net {#net}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/net.js](https://github.com/nodejs/node/blob/v23.5.0/lib/net.js)

Il modulo `node:net` fornisce un'API di rete asincrona per la creazione di server TCP basati su stream o [IPC](/it/nodejs/api/net#ipc-support) ([`net.createServer()`](/it/nodejs/api/net#netcreateserveroptions-connectionlistener)) e client ([`net.createConnection()`](/it/nodejs/api/net#netcreateconnection)).

È possibile accedervi utilizzando:

::: code-group
```js [ESM]
import net from 'node:net';
```

```js [CJS]
const net = require('node:net');
```
:::

## Supporto IPC {#ipc-support}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.8.0 | Supporto per l'associazione a un percorso socket di dominio Unix astratto come `\0abstract`. Possiamo associare '\0' per Node.js `\< v20.4.0`. |
:::

Il modulo `node:net` supporta IPC con named pipe su Windows e socket di dominio Unix su altri sistemi operativi.

### Identificazione dei percorsi per le connessioni IPC {#identifying-paths-for-ipc-connections}

[`net.connect()`](/it/nodejs/api/net#netconnect), [`net.createConnection()`](/it/nodejs/api/net#netcreateconnection), [`server.listen()`](/it/nodejs/api/net#serverlisten) e [`socket.connect()`](/it/nodejs/api/net#socketconnect) accettano un parametro `path` per identificare gli endpoint IPC.

Su Unix, il dominio locale è anche conosciuto come dominio Unix. Il percorso è un percorso del file system. Genererà un errore quando la lunghezza del percorso è maggiore della lunghezza di `sizeof(sockaddr_un.sun_path)`. I valori tipici sono 107 byte su Linux e 103 byte su macOS. Se un'astrazione API di Node.js crea il socket di dominio Unix, scolleggerà anche il socket di dominio Unix. Ad esempio, [`net.createServer()`](/it/nodejs/api/net#netcreateserveroptions-connectionlistener) può creare un socket di dominio Unix e [`server.close()`](/it/nodejs/api/net#serverclosecallback) lo scolleggerà. Ma se un utente crea il socket di dominio Unix al di fuori di queste astrazioni, l'utente dovrà rimuoverlo. Lo stesso vale quando un'API di Node.js crea un socket di dominio Unix ma il programma si arresta in modo anomalo. In breve, un socket di dominio Unix sarà visibile nel file system e persisterà fino a quando non verrà scollegato. Su Linux, puoi utilizzare il socket astratto Unix aggiungendo `\0` all'inizio del percorso, ad esempio `\0abstract`. Il percorso al socket astratto Unix non è visibile nel file system e scomparirà automaticamente quando tutti i riferimenti aperti al socket vengono chiusi.

Su Windows, il dominio locale è implementato utilizzando una named pipe. Il percorso *deve* fare riferimento a una voce in `\\?\pipe\` o `\\.\pipe\`. Sono consentiti tutti i caratteri, ma quest'ultimo potrebbe elaborare alcuni nomi di pipe, come la risoluzione delle sequenze `..`. Nonostante l'aspetto, lo spazio dei nomi della pipe è piatto. Le pipe *non persisteranno*. Vengono rimosse quando l'ultimo riferimento a esse viene chiuso. A differenza dei socket di dominio Unix, Windows chiuderà e rimuoverà la pipe quando il processo proprietario esce.

La sequenza di escape delle stringhe JavaScript richiede che i percorsi vengano specificati con un'ulteriore escape con backslash come:

```js [ESM]
net.createServer().listen(
  path.join('\\\\?\\pipe', process.cwd(), 'myctl'));
```

## Classe: `net.BlockList` {#class-netblocklist}

**Aggiunto in: v15.0.0, v14.18.0**

L'oggetto `BlockList` può essere utilizzato con alcune API di rete per specificare regole per disabilitare l'accesso in entrata o in uscita a specifici indirizzi IP, intervalli IP o sottoreti IP.

### `blockList.addAddress(address[, type])` {#blocklistaddaddressaddress-type}

**Aggiunto in: v15.0.0, v14.18.0**

- `address` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/it/nodejs/api/net#class-netsocketaddress) Un indirizzo IPv4 o IPv6.
- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Sia `'ipv4'` che `'ipv6'`. **Predefinito:** `'ipv4'`.

Aggiunge una regola per bloccare l'indirizzo IP specificato.

### `blockList.addRange(start, end[, type])` {#blocklistaddrangestart-end-type}

**Aggiunto in: v15.0.0, v14.18.0**

- `start` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/it/nodejs/api/net#class-netsocketaddress) L'indirizzo IPv4 o IPv6 iniziale nell'intervallo.
- `end` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/it/nodejs/api/net#class-netsocketaddress) L'indirizzo IPv4 o IPv6 finale nell'intervallo.
- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Sia `'ipv4'` che `'ipv6'`. **Predefinito:** `'ipv4'`.

Aggiunge una regola per bloccare un intervallo di indirizzi IP da `start` (incluso) a `end` (incluso).

### `blockList.addSubnet(net, prefix[, type])` {#blocklistaddsubnetnet-prefix-type}

**Aggiunto in: v15.0.0, v14.18.0**

- `net` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/it/nodejs/api/net#class-netsocketaddress) L'indirizzo di rete IPv4 o IPv6.
- `prefix` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di bit del prefisso CIDR. Per IPv4, deve essere un valore compreso tra `0` e `32`. Per IPv6, deve essere compreso tra `0` e `128`.
- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Sia `'ipv4'` che `'ipv6'`. **Predefinito:** `'ipv4'`.

Aggiunge una regola per bloccare un intervallo di indirizzi IP specificato come maschera di sottorete.


### `blockList.check(address[, type])` {#blocklistcheckaddress-type}

**Aggiunto in: v15.0.0, v14.18.0**

- `address` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/it/nodejs/api/net#class-netsocketaddress) L'indirizzo IP da controllare
- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Sia `'ipv4'` che `'ipv6'`. **Predefinito:** `'ipv4'`.
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'indirizzo IP specificato corrisponde a una qualsiasi delle regole aggiunte al `BlockList`.

```js [ESM]
const blockList = new net.BlockList();
blockList.addAddress('123.123.123.123');
blockList.addRange('10.0.0.1', '10.0.0.10');
blockList.addSubnet('8592:757c:efae:4e45::', 64, 'ipv6');

console.log(blockList.check('123.123.123.123'));  // Stampa: true
console.log(blockList.check('10.0.0.3'));  // Stampa: true
console.log(blockList.check('222.111.111.222'));  // Stampa: false

// La notazione IPv6 per gli indirizzi IPv4 funziona:
console.log(blockList.check('::ffff:7b7b:7b7b', 'ipv6')); // Stampa: true
console.log(blockList.check('::ffff:123.123.123.123', 'ipv6')); // Stampa: true
```
### `blockList.rules` {#blocklistrules}

**Aggiunto in: v15.0.0, v14.18.0**

- Tipo: [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'elenco delle regole aggiunte alla blocklist.

### `BlockList.isBlockList(value)` {#blocklistisblocklistvalue}

**Aggiunto in: v23.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualsiasi valore JS
- Restituisce `true` se il `value` è un `net.BlockList`.

## Classe: `net.SocketAddress` {#class-netsocketaddress}

**Aggiunto in: v15.14.0, v14.18.0**

### `new net.SocketAddress([options])` {#new-netsocketaddressoptions}

**Aggiunto in: v15.14.0, v14.18.0**

- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `address` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'indirizzo di rete come stringa IPv4 o IPv6. **Predefinito**: `'127.0.0.1'` se `family` è `'ipv4'`; `'::'` se `family` è `'ipv6'`.
    - `family` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uno tra `'ipv4'` o `'ipv6'`. **Predefinito**: `'ipv4'`.
    - `flowlabel` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un flow-label IPv6 utilizzato solo se `family` è `'ipv6'`.
    - `port` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Una porta IP.


### `socketaddress.address` {#socketaddressaddress}

**Aggiunto in: v15.14.0, v14.18.0**

- Tipo [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### `socketaddress.family` {#socketaddressfamily}

**Aggiunto in: v15.14.0, v14.18.0**

- Tipo [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Sia `'ipv4'` che `'ipv6'`.

### `socketaddress.flowlabel` {#socketaddressflowlabel}

**Aggiunto in: v15.14.0, v14.18.0**

- Tipo [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `socketaddress.port` {#socketaddressport}

**Aggiunto in: v15.14.0, v14.18.0**

- Tipo [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `SocketAddress.parse(input)` {#socketaddressparseinput}

**Aggiunto in: v23.4.0**

- `input` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una stringa di input contenente un indirizzo IP e una porta opzionale, es. `123.1.2.3:1234` o `[1::1]:1234`.
- Restituisce: [\<net.SocketAddress\>](/it/nodejs/api/net#class-netsocketaddress) Restituisce un `SocketAddress` se l'analisi è andata a buon fine. Altrimenti restituisce `undefined`.

## Classe: `net.Server` {#class-netserver}

**Aggiunto in: v0.1.90**

- Estende: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Questa classe viene utilizzata per creare un server TCP o [IPC](/it/nodejs/api/net#ipc-support).

### `new net.Server([options][, connectionListener])` {#new-netserveroptions-connectionlistener}

- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Vedi [`net.createServer([options][, connectionListener])`](/it/nodejs/api/net#netcreateserveroptions-connectionlistener).
- `connectionListener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Impostato automaticamente come listener per l'evento [`'connection'`](/it/nodejs/api/net#event-connection).
- Restituisce: [\<net.Server\>](/it/nodejs/api/net#class-netserver)

`net.Server` è un [`EventEmitter`](/it/nodejs/api/events#class-eventemitter) con i seguenti eventi:

### Evento: `'close'` {#event-close}

**Aggiunto in: v0.5.0**

Emesso quando il server si chiude. Se esistono connessioni, questo evento non viene emesso finché tutte le connessioni non sono terminate.


### Evento: `'connection'` {#event-connection}

**Aggiunto in: v0.1.90**

- [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) L'oggetto di connessione

Emesso quando viene effettuata una nuova connessione. `socket` è un'istanza di `net.Socket`.

### Evento: `'error'` {#event-error}

**Aggiunto in: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emesso quando si verifica un errore. A differenza di [`net.Socket`](/it/nodejs/api/net#class-netsocket), l'evento [`'close'`](/it/nodejs/api/net#event-close) **non** verrà emesso direttamente dopo questo evento a meno che non venga chiamato manualmente [`server.close()`](/it/nodejs/api/net#serverclosecallback). Vedi l'esempio nella discussione di [`server.listen()`](/it/nodejs/api/net#serverlisten).

### Evento: `'listening'` {#event-listening}

**Aggiunto in: v0.1.90**

Emesso quando il server è stato associato dopo aver chiamato [`server.listen()`](/it/nodejs/api/net#serverlisten).

### Evento: `'drop'` {#event-drop}

**Aggiunto in: v18.6.0, v16.17.0**

Quando il numero di connessioni raggiunge la soglia di `server.maxConnections`, il server rilascerà nuove connessioni ed emetterà invece l'evento `'drop'`. Se si tratta di un server TCP, l'argomento è il seguente, altrimenti l'argomento è `undefined`.

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'argomento passato al listener di eventi.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Indirizzo locale.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta locale.
    - `localFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Famiglia locale.
    - `remoteAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Indirizzo remoto.
    - `remotePort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta remota.
    - `remoteFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Famiglia IP remota. `'IPv4'` o `'IPv6'`.


### `server.address()` {#serveraddress}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.4.0 | La proprietà `family` ora restituisce una stringa invece di un numero. |
| v18.0.0 | La proprietà `family` ora restituisce un numero invece di una stringa. |
| v0.1.90 | Aggiunto in: v0.1.90 |
:::

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Restituisce l'`address` vincolato, il nome della `family` dell'indirizzo e la `port` del server come riportato dal sistema operativo se in ascolto su un socket IP (utile per trovare quale porta è stata assegnata quando si ottiene un indirizzo assegnato dal sistema operativo): `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.

Per un server in ascolto su una pipe o un socket di dominio Unix, il nome viene restituito come una stringa.

```js [ESM]
const server = net.createServer((socket) => {
  socket.end('arrivederci\n');
}).on('error', (err) => {
  // Gestisci gli errori qui.
  throw err;
});

// Prendi una porta inutilizzata arbitraria.
server.listen(() => {
  console.log('server aperto su', server.address());
});
```
`server.address()` restituisce `null` prima che l'evento `'listening'` sia stato emesso o dopo aver chiamato `server.close()`.

### `server.close([callback])` {#serverclosecallback}

**Aggiunto in: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chiamato quando il server è chiuso.
- Restituisce: [\<net.Server\>](/it/nodejs/api/net#class-netserver)

Impedisce al server di accettare nuove connessioni e mantiene le connessioni esistenti. Questa funzione è asincrona, il server viene finalmente chiuso quando tutte le connessioni sono terminate e il server emette un evento [`'close'`](/it/nodejs/api/net#event-close). La `callback` opzionale verrà chiamata una volta che si verifica l'evento `'close'`. A differenza di quell'evento, verrà chiamato con un `Error` come suo unico argomento se il server non era aperto quando è stato chiuso.


### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Aggiunto in: v20.5.0, v18.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Chiama [`server.close()`](/it/nodejs/api/net#serverclosecallback) e restituisce una promise che si risolve quando il server è stato chiuso.

### `server.getConnections(callback)` {#servergetconnectionscallback}

**Aggiunto in: v0.9.7**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<net.Server\>](/it/nodejs/api/net#class-netserver)

Ottiene in modo asincrono il numero di connessioni simultanee sul server. Funziona quando i socket sono stati inviati ai fork.

La callback dovrebbe accettare due argomenti `err` e `count`.

### `server.listen()` {#serverlisten}

Avvia un server in ascolto di connessioni. Un `net.Server` può essere un server TCP o un server [IPC](/it/nodejs/api/net#ipc-support) a seconda di ciò che ascolta.

Firme possibili:

- [`server.listen(handle[, backlog][, callback])`](/it/nodejs/api/net#serverlistenhandle-backlog-callback)
- [`server.listen(options[, callback])`](/it/nodejs/api/net#serverlistenoptions-callback)
- [`server.listen(path[, backlog][, callback])`](/it/nodejs/api/net#serverlistenpath-backlog-callback) per server [IPC](/it/nodejs/api/net#ipc-support)
- [`server.listen([port[, host[, backlog]]][, callback])`](/it/nodejs/api/net#serverlistenport-host-backlog-callback) per server TCP

Questa funzione è asincrona. Quando il server inizia ad ascoltare, verrà emesso l'evento [`'listening'`](/it/nodejs/api/net#event-listening). L'ultimo parametro `callback` verrà aggiunto come listener per l'evento [`'listening'`](/it/nodejs/api/net#event-listening).

Tutti i metodi `listen()` possono accettare un parametro `backlog` per specificare la lunghezza massima della coda di connessioni in sospeso. La lunghezza effettiva sarà determinata dal sistema operativo tramite impostazioni sysctl come `tcp_max_syn_backlog` e `somaxconn` su Linux. Il valore predefinito di questo parametro è 511 (non 512).

Tutti i [`net.Socket`](/it/nodejs/api/net#class-netsocket) sono impostati su `SO_REUSEADDR` (vedi [`socket(7)`](https://man7.org/linux/man-pages/man7/socket.7) per dettagli).

Il metodo `server.listen()` può essere chiamato di nuovo se e solo se si è verificato un errore durante la prima chiamata a `server.listen()` o è stato chiamato `server.close()`. In caso contrario, verrà generato un errore `ERR_SERVER_ALREADY_LISTEN`.

Uno degli errori più comuni sollevati durante l'ascolto è `EADDRINUSE`. Questo accade quando un altro server è già in ascolto sulla `porta`/`percorso`/`handle` richiesti. Un modo per gestire questo sarebbe riprovare dopo un certo periodo di tempo:

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

**Aggiunto in: v0.5.10**

- `handle` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parametro comune delle funzioni [`server.listen()`](/it/nodejs/api/net#serverlisten)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<net.Server\>](/it/nodejs/api/net#class-netserver)

Avvia un server in ascolto di connessioni su un dato `handle` che è già stato associato a una porta, un socket di dominio Unix o una pipe denominata Windows.

L'oggetto `handle` può essere un server, un socket (qualsiasi cosa con un membro `_handle` sottostante) o un oggetto con un membro `fd` che è un descrittore di file valido.

L'ascolto su un descrittore di file non è supportato su Windows.

#### `server.listen(options[, callback])` {#serverlistenoptions-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.1.0 | L'opzione `reusePort` è supportata. |
| v15.6.0 | Aggiunto il supporto per AbortSignal. |
| v11.4.0 | L'opzione `ipv6Only` è supportata. |
| v0.11.14 | Aggiunto in: v0.11.14 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Richiesto. Supporta le seguenti proprietà:
    - `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parametro comune delle funzioni [`server.listen()`](/it/nodejs/api/net#serverlisten).
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Per i server TCP, impostare `ipv6Only` su `true` disabiliterà il supporto dual-stack, ovvero, l'associazione all'host `::` non farà sì che `0.0.0.0` sia associato. **Predefinito:** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Per i server TCP, impostare `reusePort` su `true` consente a più socket sullo stesso host di associarsi alla stessa porta. Le connessioni in entrata vengono distribuite dal sistema operativo ai socket in ascolto. Questa opzione è disponibile solo su alcune piattaforme, come Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 e AIX 7.2.5+. **Predefinito:** `false`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Verrà ignorato se viene specificata `port`. Vedi [Identificazione dei percorsi per le connessioni IPC](/it/nodejs/api/net#identifying-paths-for-ipc-connections).
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `readableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Per i server IPC rende la pipe leggibile per tutti gli utenti. **Predefinito:** `false`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Un AbortSignal che può essere utilizzato per chiudere un server in ascolto.
    - `writableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Per i server IPC rende la pipe scrivibile per tutti gli utenti. **Predefinito:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) funzioni.
- Restituisce: [\<net.Server\>](/it/nodejs/api/net#class-netserver)

Se viene specificata `port`, si comporta come [`server.listen([port[, host[, backlog]]][, callback])`](/it/nodejs/api/net#serverlistenport-host-backlog-callback). Altrimenti, se viene specificata `path`, si comporta come [`server.listen(path[, backlog][, callback])`](/it/nodejs/api/net#serverlistenpath-backlog-callback). Se nessuno dei due è specificato, verrà generato un errore.

Se `exclusive` è `false` (predefinito), i worker del cluster utilizzeranno lo stesso handle sottostante, consentendo la condivisione delle attività di gestione della connessione. Quando `exclusive` è `true`, l'handle non viene condiviso e il tentativo di condivisione della porta provoca un errore. Un esempio che ascolta su una porta esclusiva è mostrato di seguito.

```js [ESM]
server.listen({
  host: 'localhost',
  port: 80,
  exclusive: true,
});
```
Quando `exclusive` è `true` e l'handle sottostante è condiviso, è possibile che diversi worker interroghino un handle con diversi backlog. In questo caso, verrà utilizzato il primo `backlog` passato al processo master.

L'avvio di un server IPC come root potrebbe rendere il percorso del server inaccessibile agli utenti non privilegiati. L'utilizzo di `readableAll` e `writableAll` renderà il server accessibile a tutti gli utenti.

Se l'opzione `signal` è abilitata, la chiamata a `.abort()` sul corrispondente `AbortController` è simile alla chiamata a `.close()` sul server:

```js [ESM]
const controller = new AbortController();
server.listen({
  host: 'localhost',
  port: 80,
  signal: controller.signal,
});
// Successivamente, quando si desidera chiudere il server.
controller.abort();
```

#### `server.listen(path[, backlog][, callback])` {#serverlistenpath-backlog-callback}

**Aggiunto in: v0.1.90**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Percorso su cui il server deve rimanere in ascolto. Vedi [Identificazione dei percorsi per connessioni IPC](/it/nodejs/api/net#identifying-paths-for-ipc-connections).
- `backlog` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parametro comune delle funzioni [`server.listen()`](/it/nodejs/api/net#serverlisten).
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- Restituisce: [\<net.Server\>](/it/nodejs/api/net#class-netserver)

Avvia un server [IPC](/it/nodejs/api/net#ipc-support) in ascolto di connessioni sul `path` specificato.

#### `server.listen([port[, host[, backlog]]][, callback])` {#serverlistenport-host-backlog-callback}

**Aggiunto in: v0.1.90**

- `port` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `backlog` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parametro comune delle funzioni [`server.listen()`](/it/nodejs/api/net#serverlisten).
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- Restituisce: [\<net.Server\>](/it/nodejs/api/net#class-netserver)

Avvia un server TCP in ascolto di connessioni sulla `porta` e sull'`host` specificati.

Se `port` viene omesso o è 0, il sistema operativo assegnerà una porta inutilizzata arbitraria, che può essere recuperata usando `server.address().port` dopo che l'evento [`'listening'`](/it/nodejs/api/net#event-listening) è stato emesso.

Se `host` viene omesso, il server accetterà connessioni sull'[indirizzo IPv6 non specificato](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) quando IPv6 è disponibile, o sull'[indirizzo IPv4 non specificato](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`) altrimenti.

Nella maggior parte dei sistemi operativi, l'ascolto dell'[indirizzo IPv6 non specificato](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) può far sì che `net.Server` ascolti anche sull'[indirizzo IPv4 non specificato](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`).


### `server.listening` {#serverlistening}

**Aggiunto in: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se il server è in ascolto per le connessioni.

### `server.maxConnections` {#servermaxconnections}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0 | Impostare `maxConnections` a `0` rilascia tutte le connessioni in entrata. In precedenza, veniva interpretato come `Infinity`. |
| v0.2.0 | Aggiunto in: v0.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Quando il numero di connessioni raggiunge la soglia `server.maxConnections`:

Non è consigliabile utilizzare questa opzione una volta che un socket è stato inviato a un child con [`child_process.fork()`](/it/nodejs/api/child_process#child_processforkmodulepath-args-options).

### `server.dropMaxConnection` {#serverdropmaxconnection}

**Aggiunto in: v23.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Imposta questa proprietà su `true` per iniziare a chiudere le connessioni una volta che il numero di connessioni raggiunge la soglia [`server.maxConnections`][]. Questa impostazione è efficace solo in modalità cluster.

### `server.ref()` {#serverref}

**Aggiunto in: v0.9.1**

- Restituisce: [\<net.Server\>](/it/nodejs/api/net#class-netserver)

Opposto di `unref()`, chiamare `ref()` su un server precedentemente `unref` *non* consentirà al programma di uscire se è l'unico server rimasto (il comportamento predefinito). Se il server è `ref`ed chiamare `ref()` di nuovo non avrà alcun effetto.

### `server.unref()` {#serverunref}

**Aggiunto in: v0.9.1**

- Restituisce: [\<net.Server\>](/it/nodejs/api/net#class-netserver)

Chiamare `unref()` su un server consentirà al programma di uscire se questo è l'unico server attivo nel sistema di eventi. Se il server è già `unref`ed chiamare `unref()` di nuovo non avrà alcun effetto.

## Classe: `net.Socket` {#class-netsocket}

**Aggiunto in: v0.3.4**

- Estende: [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Questa classe è un'astrazione di un socket TCP o un endpoint di streaming [IPC](/it/nodejs/api/net#ipc-support) (utilizza named pipes su Windows e Unix domain sockets altrimenti). È anche un [`EventEmitter`](/it/nodejs/api/events#class-eventemitter).

Un `net.Socket` può essere creato dall'utente e utilizzato direttamente per interagire con un server. Ad esempio, viene restituito da [`net.createConnection()`](/it/nodejs/api/net#netcreateconnection), quindi l'utente può usarlo per parlare con il server.

Può anche essere creato da Node.js e passato all'utente quando viene ricevuta una connessione. Ad esempio, viene passato agli listener di un evento [`'connection'`](/it/nodejs/api/net#event-connection) emesso su un [`net.Server`](/it/nodejs/api/net#class-netserver), quindi l'utente può usarlo per interagire con il client.


### `new net.Socket([options])` {#new-netsocketoptions}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.14.0 | È stato aggiunto il supporto per AbortSignal. |
| v12.10.0 | Aggiunta l'opzione `onread`. |
| v0.3.4 | Aggiunto in: v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Le opzioni disponibili sono:
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `false`, il socket terminerà automaticamente il lato scrivibile quando termina il lato leggibile. Vedi [`net.createServer()`](/it/nodejs/api/net#netcreateserveroptions-connectionlistener) e l'evento [`'end'`](/it/nodejs/api/net#event-end) per i dettagli. **Predefinito:** `false`.
    - `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se specificato, racchiude un socket esistente con il descrittore di file indicato, altrimenti verrà creato un nuovo socket.
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se specificato, i dati in entrata vengono archiviati in un singolo `buffer` e passati al `callback` fornito quando i dati arrivano sul socket. Ciò farà sì che la funzionalità di streaming non fornisca alcun dato. Il socket emetterà eventi come `'error'`, `'end'` e `'close'` come al solito. Anche i metodi come `pause()` e `resume()` si comporteranno come previsto.
    - `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O un blocco di memoria riutilizzabile da utilizzare per archiviare i dati in entrata o una funzione che ne restituisce uno.
    - `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Questa funzione viene chiamata per ogni blocco di dati in entrata. Vengono passati due argomenti: il numero di byte scritti nel `buffer` e un riferimento al `buffer`. Restituisci `false` da questa funzione per `pause()` implicitamente il socket. Questa funzione verrà eseguita nel contesto globale.


    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Consenti le letture sul socket quando viene passato un `fd`, altrimenti ignorato. **Predefinito:** `false`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Un segnale di interruzione che può essere utilizzato per distruggere il socket.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Consenti le scritture sul socket quando viene passato un `fd`, altrimenti ignorato. **Predefinito:** `false`.


- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket)

Crea un nuovo oggetto socket.

Il socket appena creato può essere un socket TCP o un endpoint [IPC](/it/nodejs/api/net#ipc-support) di streaming, a seconda di cosa si [`connect()`](/it/nodejs/api/net#socketconnect) a.


### Evento: `'close'` {#event-close_1}

**Aggiunto in: v0.1.90**

- `hadError` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se il socket ha avuto un errore di trasmissione.

Emesso una volta che il socket è completamente chiuso. L'argomento `hadError` è un booleano che indica se il socket è stato chiuso a causa di un errore di trasmissione.

### Evento: `'connect'` {#event-connect}

**Aggiunto in: v0.1.90**

Emesso quando una connessione socket viene stabilita con successo. Vedere [`net.createConnection()`](/it/nodejs/api/net#netcreateconnection).

### Evento: `'connectionAttempt'` {#event-connectionattempt}

**Aggiunto in: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'IP a cui il socket sta tentando di connettersi.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La porta a cui il socket sta tentando di connettersi.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La famiglia dell'IP. Può essere `6` per IPv6 o `4` per IPv4.

Emesso quando viene avviato un nuovo tentativo di connessione. Questo può essere emesso più volte se l'algoritmo di selezione automatica della famiglia è abilitato in [`socket.connect(options)`](/it/nodejs/api/net#socketconnectoptions-connectlistener).

### Evento: `'connectionAttemptFailed'` {#event-connectionattemptfailed}

**Aggiunto in: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'IP a cui il socket ha tentato di connettersi.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La porta a cui il socket ha tentato di connettersi.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La famiglia dell'IP. Può essere `6` per IPv6 o `4` per IPv4.
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'errore associato al fallimento.

Emesso quando un tentativo di connessione è fallito. Questo può essere emesso più volte se l'algoritmo di selezione automatica della famiglia è abilitato in [`socket.connect(options)`](/it/nodejs/api/net#socketconnectoptions-connectlistener).


### Evento: `'connectionAttemptTimeout'` {#event-connectionattempttimeout}

**Aggiunto in: v21.6.0, v20.12.0**

- `ip` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'IP a cui il socket ha tentato di connettersi.
- `port` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La porta a cui il socket ha tentato di connettersi.
- `family` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La famiglia dell'IP. Può essere `6` per IPv6 o `4` per IPv4.

Emesso quando un tentativo di connessione è scaduto. Questo viene emesso solo (e può essere emesso più volte) se l'algoritmo di selezione automatica della famiglia è abilitato in [`socket.connect(options)`](/it/nodejs/api/net#socketconnectoptions-connectlistener).

### Evento: `'data'` {#event-data}

**Aggiunto in: v0.1.90**

- [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Emesso quando i dati vengono ricevuti. L'argomento `data` sarà un `Buffer` o una `String`. La codifica dei dati è impostata da [`socket.setEncoding()`](/it/nodejs/api/net#socketsetencodingencoding).

I dati andranno persi se non c'è un listener quando un `Socket` emette un evento `'data'`.

### Evento: `'drain'` {#event-drain}

**Aggiunto in: v0.1.90**

Emesso quando il buffer di scrittura diventa vuoto. Può essere utilizzato per limitare i caricamenti.

Vedere anche: i valori di ritorno di `socket.write()`.

### Evento: `'end'` {#event-end}

**Aggiunto in: v0.1.90**

Emesso quando l'altra estremità del socket segnala la fine della trasmissione, terminando così il lato leggibile del socket.

Per impostazione predefinita (`allowHalfOpen` è `false`) il socket invierà un pacchetto di fine trasmissione e distruggerà il suo descrittore di file una volta che ha scritto la sua coda di scrittura in sospeso. Tuttavia, se `allowHalfOpen` è impostato su `true`, il socket non [`end()`](/it/nodejs/api/net#socketenddata-encoding-callback) automaticamente il suo lato scrivibile, consentendo all'utente di scrivere quantità arbitrarie di dati. L'utente deve chiamare [`end()`](/it/nodejs/api/net#socketenddata-encoding-callback) esplicitamente per chiudere la connessione (ovvero, inviando un pacchetto FIN indietro).


### Evento: `'error'` {#event-error_1}

**Aggiunto in: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emesso quando si verifica un errore. L'evento `'close'` verrà chiamato immediatamente dopo questo evento.

### Evento: `'lookup'` {#event-lookup}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v5.10.0 | Il parametro `host` è ora supportato. |
| v0.11.3 | Aggiunto in: v0.11.3 |
:::

Emesso dopo la risoluzione del nome host ma prima della connessione. Non applicabile ai socket Unix.

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) L'oggetto errore. Vedi [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback).
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'indirizzo IP.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Il tipo di indirizzo. Vedi [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome host.

### Evento: `'ready'` {#event-ready}

**Aggiunto in: v9.11.0**

Emesso quando un socket è pronto per essere utilizzato.

Attivato immediatamente dopo `'connect'`.

### Evento: `'timeout'` {#event-timeout}

**Aggiunto in: v0.1.90**

Emesso se il socket scade a causa di inattività. Questo serve solo a notificare che il socket è stato inattivo. L'utente deve chiudere manualmente la connessione.

Vedi anche: [`socket.setTimeout()`](/it/nodejs/api/net#socketsettimeouttimeout-callback).

### `socket.address()` {#socketaddress}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.4.0 | La proprietà `family` ora restituisce una stringa anziché un numero. |
| v18.0.0 | La proprietà `family` ora restituisce un numero anziché una stringa. |
| v0.1.90 | Aggiunto in: v0.1.90 |
:::

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce l'`address` associato, il nome `family` dell'indirizzo e la `port` del socket come riportato dal sistema operativo: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`


### `socket.autoSelectFamilyAttemptedAddresses` {#socketautoselectfamilyattemptedaddresses}

**Aggiunto in: v19.4.0, v18.18.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Questa proprietà è presente solo se l'algoritmo di selezione automatica della famiglia è abilitato in [`socket.connect(options)`](/it/nodejs/api/net#socketconnectoptions-connectlistener) ed è un array degli indirizzi che sono stati tentati.

Ogni indirizzo è una stringa nella forma `$IP:$PORT`. Se la connessione ha avuto successo, allora l'ultimo indirizzo è quello a cui il socket è attualmente connesso.

### `socket.bufferSize` {#socketbuffersize}

**Aggiunto in: v0.3.8**

**Deprecato da: v14.6.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Usa [`writable.writableLength`](/it/nodejs/api/stream#writablewritablelength) invece.
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Questa proprietà mostra il numero di caratteri memorizzati nel buffer per la scrittura. Il buffer può contenere stringhe la cui lunghezza dopo la codifica non è ancora nota. Quindi questo numero è solo un'approssimazione del numero di byte nel buffer.

`net.Socket` ha la proprietà che `socket.write()` funziona sempre. Questo per aiutare gli utenti a iniziare rapidamente. Il computer non può sempre tenere il passo con la quantità di dati che vengono scritti su un socket. La connessione di rete potrebbe semplicemente essere troppo lenta. Node.js metterà internamente in coda i dati scritti su un socket e li invierà via cavo quando possibile.

La conseguenza di questo buffering interno è che la memoria può crescere. Gli utenti che riscontrano `bufferSize` grandi o in crescita dovrebbero tentare di "limitare" i flussi di dati nel loro programma con [`socket.pause()`](/it/nodejs/api/net#socketpause) e [`socket.resume()`](/it/nodejs/api/net#socketresume).

### `socket.bytesRead` {#socketbytesread}

**Aggiunto in: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La quantità di byte ricevuti.


### `socket.bytesWritten` {#socketbyteswritten}

**Aggiunto in: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La quantità di byte inviati.

### `socket.connect()` {#socketconnect}

Inizia una connessione su un dato socket.

Possibili firme:

- [`socket.connect(options[, connectListener])`](/it/nodejs/api/net#socketconnectoptions-connectlistener)
- [`socket.connect(path[, connectListener])`](/it/nodejs/api/net#socketconnectpath-connectlistener) per connessioni [IPC](/it/nodejs/api/net#ipc-support).
- [`socket.connect(port[, host][, connectListener])`](/it/nodejs/api/net#socketconnectport-host-connectlistener) per connessioni TCP.
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket stesso.

Questa funzione è asincrona. Quando la connessione viene stabilita, verrà emesso l'evento [`'connect'`](/it/nodejs/api/net#event-connect). Se c'è un problema di connessione, invece di un evento [`'connect'`](/it/nodejs/api/net#event-connect), verrà emesso un evento [`'error'`](/it/nodejs/api/net#event-error_1) con l'errore passato al listener [`'error'`](/it/nodejs/api/net#event-error_1). L'ultimo parametro `connectListener`, se fornito, verrà aggiunto come listener per l'evento [`'connect'`](/it/nodejs/api/net#event-connect) **una sola volta**.

Questa funzione dovrebbe essere usata solo per riconnettere un socket dopo che è stato emesso `'close'` o altrimenti potrebbe portare a un comportamento indefinito.

#### `socket.connect(options[, connectListener])` {#socketconnectoptions-connectlistener}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.4.0 | Il valore predefinito per l'opzione autoSelectFamily può essere modificato in fase di esecuzione usando `setDefaultAutoSelectFamily` o tramite l'opzione da riga di comando `--enable-network-family-autoselection`. |
| v20.0.0, v18.18.0 | Il valore predefinito per l'opzione autoSelectFamily è ora true. Il flag CLI `--enable-network-family-autoselection` è stato rinominato in `--network-family-autoselection`. Il vecchio nome è ora un alias ma è sconsigliato. |
| v19.3.0, v18.13.0 | Aggiunta l'opzione `autoSelectFamily`. |
| v17.7.0, v16.15.0 | Le opzioni `noDelay`, `keepAlive` e `keepAliveInitialDelay` sono ora supportate. |
| v6.0.0 | L'opzione `hints` ora ha come valore predefinito `0` in tutti i casi. In precedenza, in assenza dell'opzione `family`, avrebbe avuto come valore predefinito `dns.ADDRCONFIG | dns.V4MAPPED`. |
| v5.11.0 | L'opzione `hints` è ora supportata. |
| v0.1.90 | Aggiunto in: v0.1.90 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parametro comune dei metodi [`socket.connect()`](/it/nodejs/api/net#socketconnect). Verrà aggiunto come listener per l'evento [`'connect'`](/it/nodejs/api/net#event-connect) una sola volta.
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket stesso.

Inizia una connessione su un dato socket. Normalmente questo metodo non è necessario, il socket dovrebbe essere creato e aperto con [`net.createConnection()`](/it/nodejs/api/net#netcreateconnection). Usare questo solo quando si implementa un Socket personalizzato.

Per le connessioni TCP, le `options` disponibili sono:

- `autoSelectFamily` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): Se impostato su `true`, abilita un algoritmo di rilevamento automatico della famiglia che implementa in modo blando la sezione 5 di [RFC 8305](https://www.rfc-editor.org/rfc/rfc8305.txt). L'opzione `all` passata a lookup è impostata su `true` e i socket tentano di connettersi a tutti gli indirizzi IPv6 e IPv4 ottenuti, in sequenza, finché non viene stabilita una connessione. Il primo indirizzo AAAA restituito viene provato per primo, quindi il primo indirizzo A restituito, quindi il secondo indirizzo AAAA restituito e così via. A ogni tentativo di connessione (ma all'ultimo) viene concesso il tempo specificato dall'opzione `autoSelectFamilyAttemptTimeout` prima che scada il timeout e venga provato l'indirizzo successivo. Ignorato se l'opzione `family` non è `0` o se è impostato `localAddress`. Gli errori di connessione non vengono emessi se almeno una connessione ha successo. Se tutti i tentativi di connessione falliscono, viene emesso un singolo `AggregateError` con tutti i tentativi falliti. **Predefinito:** [`net.getDefaultAutoSelectFamily()`](/it/nodejs/api/net#netgetdefaultautoselectfamily).
- `autoSelectFamilyAttemptTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): La quantità di tempo in millisecondi da attendere che un tentativo di connessione termini prima di provare l'indirizzo successivo quando si utilizza l'opzione `autoSelectFamily`. Se impostato su un numero intero positivo inferiore a `10`, verrà utilizzato invece il valore `10`. **Predefinito:** [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/it/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): Versione dello stack IP. Deve essere `4`, `6` o `0`. Il valore `0` indica che sono consentiti sia gli indirizzi IPv4 che IPv6. **Predefinito:** `0`.
- `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`dns.lookup()` hints](/it/nodejs/api/dns#supported-getaddrinfo-flags) opzionali.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host a cui il socket deve connettersi. **Predefinito:** `'localhost'`.
- `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `true`, abilita la funzionalità keep-alive sul socket immediatamente dopo che la connessione è stata stabilita, in modo simile a quanto fatto in [`socket.setKeepAlive()`](/it/nodejs/api/net#socketsetkeepaliveenable-initialdelay). **Predefinito:** `false`.
- `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se impostato su un numero positivo, imposta il ritardo iniziale prima che venga inviato il primo probe keepalive su un socket inattivo. **Predefinito:** `0`.
- `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Indirizzo locale da cui il socket deve connettersi.
- `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta locale da cui il socket deve connettersi.
- `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione di lookup personalizzata. **Predefinito:** [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback).
- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `true`, disabilita l'uso dell'algoritmo di Nagle immediatamente dopo che il socket è stato stabilito. **Predefinito:** `false`.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Obbligatorio. Porta a cui il socket deve connettersi.
- `blockList` [\<net.BlockList\>](/it/nodejs/api/net#class-netblocklist) `blockList` può essere utilizzato per disabilitare l'accesso in uscita a specifici indirizzi IP, intervalli IP o sottoreti IP.

Per le connessioni [IPC](/it/nodejs/api/net#ipc-support), le `options` disponibili sono:

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Obbligatorio. Percorso a cui il client deve connettersi. Vedere [Identificazione dei percorsi per le connessioni IPC](/it/nodejs/api/net#identifying-paths-for-ipc-connections). Se fornito, le opzioni specifiche per TCP sopra sono ignorate.


#### `socket.connect(path[, connectListener])` {#socketconnectpath-connectlistener}

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Percorso a cui il client deve connettersi. Vedi [Identificazione dei percorsi per connessioni IPC](/it/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parametro comune dei metodi [`socket.connect()`](/it/nodejs/api/net#socketconnect). Verrà aggiunto come listener per l'evento [`'connect'`](/it/nodejs/api/net#event-connect) una volta.
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket stesso.

Avvia una connessione [IPC](/it/nodejs/api/net#ipc-support) sul socket specificato.

Alias di [`socket.connect(options[, connectListener])`](/it/nodejs/api/net#socketconnectoptions-connectlistener) chiamato con `{ path: path }` come `options`.

#### `socket.connect(port[, host][, connectListener])` {#socketconnectport-host-connectlistener}

**Aggiunto in: v0.1.90**

- `port` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta a cui il client deve connettersi.
- `host` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host a cui il client deve connettersi.
- `connectListener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parametro comune dei metodi [`socket.connect()`](/it/nodejs/api/net#socketconnect). Verrà aggiunto come listener per l'evento [`'connect'`](/it/nodejs/api/net#event-connect) una volta.
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket stesso.

Avvia una connessione TCP sul socket specificato.

Alias di [`socket.connect(options[, connectListener])`](/it/nodejs/api/net#socketconnectoptions-connectlistener) chiamato con `{port: port, host: host}` come `options`.

### `socket.connecting` {#socketconnecting}

**Aggiunto in: v6.1.0**

- [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se `true`, è stato chiamato [`socket.connect(options[, connectListener])`](/it/nodejs/api/net#socketconnectoptions-connectlistener) e non è ancora terminato. Rimarrà `true` fino a quando il socket non sarà connesso, quindi verrà impostato su `false` e verrà emesso l'evento `'connect'`. Si noti che il callback [`socket.connect(options[, connectListener])`](/it/nodejs/api/net#socketconnectoptions-connectlistener) è un listener per l'evento `'connect'`.


### `socket.destroy([error])` {#socketdestroyerror}

**Aggiunto in: v0.1.90**

- `error` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket)

Assicura che non avvenga più alcuna attività di I/O su questo socket. Distrugge lo stream e chiude la connessione.

Vedi [`writable.destroy()`](/it/nodejs/api/stream#writabledestroyerror) per ulteriori dettagli.

### `socket.destroyed` {#socketdestroyed}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se la connessione è distrutta o meno. Una volta che una connessione è distrutta, non è possibile trasferire ulteriori dati tramite essa.

Vedi [`writable.destroyed`](/it/nodejs/api/stream#writabledestroyed) per ulteriori dettagli.

### `socket.destroySoon()` {#socketdestroysoon}

**Aggiunto in: v0.3.4**

Distrugge il socket dopo che tutti i dati sono stati scritti. Se l'evento `'finish'` è già stato emesso, il socket viene distrutto immediatamente. Se il socket è ancora scrivibile, chiama implicitamente `socket.end()`.

### `socket.end([data[, encoding]][, callback])` {#socketenddata-encoding-callback}

**Aggiunto in: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Usato solo quando i dati sono `string`. **Predefinito:** `'utf8'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback opzionale per quando il socket è terminato.
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket stesso.

Chiude a metà il socket. Cioè, invia un pacchetto FIN. È possibile che il server invii ancora alcuni dati.

Vedi [`writable.end()`](/it/nodejs/api/stream#writableendchunk-encoding-callback) per ulteriori dettagli.

### `socket.localAddress` {#socketlocaladdress}

**Aggiunto in: v0.9.6**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La rappresentazione stringa dell'indirizzo IP locale a cui si sta connettendo il client remoto. Ad esempio, in un server in ascolto su `'0.0.0.0'`, se un client si connette su `'192.168.1.1'`, il valore di `socket.localAddress` sarebbe `'192.168.1.1'`.


### `socket.localPort` {#socketlocalport}

**Aggiunto in: v0.9.6**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La rappresentazione numerica della porta locale. Per esempio, `80` o `21`.

### `socket.localFamily` {#socketlocalfamily}

**Aggiunto in: v18.8.0, v16.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La rappresentazione stringa della famiglia IP locale. `'IPv4'` o `'IPv6'`.

### `socket.pause()` {#socketpause}

- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket stesso.

Sospende la lettura dei dati. Ovvero, gli eventi [`'data'`](/it/nodejs/api/net#event-data) non saranno emessi. Utile per rallentare un caricamento.

### `socket.pending` {#socketpending}

**Aggiunto in: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Questo è `true` se il socket non è ancora connesso, sia perché `.connect()` non è ancora stato chiamato sia perché è ancora in fase di connessione (vedere [`socket.connecting`](/it/nodejs/api/net#socketconnecting)).

### `socket.ref()` {#socketref}

**Aggiunto in: v0.9.1**

- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket stesso.

Opposto di `unref()`, chiamare `ref()` su un socket precedentemente `unref`ed *non* consentirà al programma di terminare se è l'unico socket rimasto (il comportamento predefinito). Se il socket è `ref`ed, chiamare nuovamente `ref` non avrà alcun effetto.

### `socket.remoteAddress` {#socketremoteaddress}

**Aggiunto in: v0.5.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La rappresentazione stringa dell'indirizzo IP remoto. Per esempio, `'74.125.127.100'` o `'2001:4860:a005::68'`. Il valore può essere `undefined` se il socket è distrutto (per esempio, se il client si è disconnesso).

### `socket.remoteFamily` {#socketremotefamily}

**Aggiunto in: v0.11.14**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La rappresentazione stringa della famiglia IP remota. `'IPv4'` o `'IPv6'`. Il valore può essere `undefined` se il socket è distrutto (per esempio, se il client si è disconnesso).


### `socket.remotePort` {#socketremoteport}

**Aggiunto in: v0.5.10**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La rappresentazione numerica della porta remota. Per esempio, `80` o `21`. Il valore può essere `undefined` se il socket è distrutto (per esempio, se il client si è disconnesso).

### `socket.resetAndDestroy()` {#socketresetanddestroy}

**Aggiunto in: v18.3.0, v16.17.0**

- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket)

Chiude la connessione TCP inviando un pacchetto RST e distrugge lo stream. Se questo socket TCP è in stato di connessione, invierà un pacchetto RST e distruggerà questo socket TCP una volta connesso. Altrimenti, chiamerà `socket.destroy` con un errore `ERR_SOCKET_CLOSED`. Se questo non è un socket TCP (per esempio, una pipe), chiamare questo metodo genererà immediatamente un errore `ERR_INVALID_HANDLE_TYPE`.

### `socket.resume()` {#socketresume}

- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket stesso.

Riprende la lettura dopo una chiamata a [`socket.pause()`](/it/nodejs/api/net#socketpause).

### `socket.setEncoding([encoding])` {#socketsetencodingencoding}

**Aggiunto in: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket stesso.

Imposta la codifica per il socket come [Readable Stream](/it/nodejs/api/stream#class-streamreadable). Vedi [`readable.setEncoding()`](/it/nodejs/api/stream#readablesetencodingencoding) per maggiori informazioni.

### `socket.setKeepAlive([enable][, initialDelay])` {#socketsetkeepaliveenable-initialdelay}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.12.0, v12.17.0 | Sono stati aggiunti nuovi valori predefiniti per le opzioni socket `TCP_KEEPCNT` e `TCP_KEEPINTVL`. |
| v0.1.92 | Aggiunto in: v0.1.92 |
:::

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket stesso.

Abilita/disabilita la funzionalità keep-alive e, opzionalmente, imposta il ritardo iniziale prima che la prima sonda keepalive venga inviata su un socket inattivo.

Imposta `initialDelay` (in millisecondi) per impostare il ritardo tra l'ultimo pacchetto di dati ricevuto e la prima sonda keepalive. Impostare `0` per `initialDelay` lascerà il valore invariato rispetto all'impostazione predefinita (o precedente).

L'abilitazione della funzionalità keep-alive imposterà le seguenti opzioni socket:

- `SO_KEEPALIVE=1`
- `TCP_KEEPIDLE=initialDelay`
- `TCP_KEEPCNT=10`
- `TCP_KEEPINTVL=1`


### `socket.setNoDelay([noDelay])` {#socketsetnodelaynodelay}

**Aggiunto in: v0.1.90**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket stesso.

Abilita/disabilita l'uso dell'algoritmo di Nagle.

Quando viene creata una connessione TCP, l'algoritmo di Nagle sarà abilitato.

L'algoritmo di Nagle ritarda i dati prima che vengano inviati tramite la rete. Tenta di ottimizzare il throughput a scapito della latenza.

Passare `true` per `noDelay` o non passare un argomento disabiliterà l'algoritmo di Nagle per il socket. Passare `false` per `noDelay` abiliterà l'algoritmo di Nagle.

### `socket.setTimeout(timeout[, callback])` {#socketsettimeouttimeout-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v0.1.90 | Aggiunto in: v0.1.90 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket stesso.

Imposta il socket in modo che scada dopo `timeout` millisecondi di inattività sul socket. Per impostazione predefinita, `net.Socket` non ha un timeout.

Quando viene attivato un timeout di inattività, il socket riceverà un evento [`'timeout'`](/it/nodejs/api/net#event-timeout) ma la connessione non verrà interrotta. L'utente deve chiamare manualmente [`socket.end()`](/it/nodejs/api/net#socketenddata-encoding-callback) o [`socket.destroy()`](/it/nodejs/api/net#socketdestroyerror) per terminare la connessione.

```js [ESM]
socket.setTimeout(3000);
socket.on('timeout', () => {
  console.log('timeout del socket');
  socket.end();
});
```
Se `timeout` è 0, il timeout di inattività esistente viene disabilitato.

Il parametro opzionale `callback` verrà aggiunto come listener una tantum per l'evento [`'timeout'`](/it/nodejs/api/net#event-timeout).


### `socket.timeout` {#sockettimeout}

**Aggiunto in: v10.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Il timeout del socket in millisecondi come impostato da [`socket.setTimeout()`](/it/nodejs/api/net#socketsettimeouttimeout-callback). È `undefined` se non è stato impostato un timeout.

### `socket.unref()` {#socketunref}

**Aggiunto in: v0.9.1**

- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket stesso.

Chiamare `unref()` su un socket permetterà al programma di uscire se questo è l'unico socket attivo nel sistema di eventi. Se il socket è già `unref`ed, chiamare nuovamente `unref()` non avrà alcun effetto.

### `socket.write(data[, encoding][, callback])` {#socketwritedata-encoding-callback}

**Aggiunto in: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Usato solo quando i dati sono `string`. **Predefinito:** `utf8`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Invia dati sul socket. Il secondo parametro specifica la codifica nel caso di una stringa. Il valore predefinito è la codifica UTF8.

Restituisce `true` se tutti i dati sono stati scaricati correttamente nel buffer del kernel. Restituisce `false` se tutti o parte dei dati sono stati accodati nella memoria dell'utente. [`'drain'`](/it/nodejs/api/net#event-drain) verrà emesso quando il buffer sarà di nuovo libero.

Il parametro `callback` opzionale verrà eseguito quando i dati vengono finalmente scritti, il che potrebbe non essere immediatamente.

Vedi il metodo `write()` dello stream `Writable` [`write()`](/it/nodejs/api/stream#writablewritechunk-encoding-callback) per maggiori informazioni.


### `socket.readyState` {#socketreadystate}

**Aggiunto in: v0.5.0**

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Questa proprietà rappresenta lo stato della connessione come una stringa.

- Se lo stream è in fase di connessione, `socket.readyState` è `opening`.
- Se lo stream è leggibile e scrivibile, è `open`.
- Se lo stream è leggibile e non scrivibile, è `readOnly`.
- Se lo stream non è leggibile e scrivibile, è `writeOnly`.

## `net.connect()` {#netconnect}

Alias di [`net.createConnection()`](/it/nodejs/api/net#netcreateconnection).

Firme possibili:

- [`net.connect(options[, connectListener])`](/it/nodejs/api/net#netconnectoptions-connectlistener)
- [`net.connect(path[, connectListener])`](/it/nodejs/api/net#netconnectpath-connectlistener) per connessioni [IPC](/it/nodejs/api/net#ipc-support).
- [`net.connect(port[, host][, connectListener])`](/it/nodejs/api/net#netconnectport-host-connectlistener) per connessioni TCP.

### `net.connect(options[, connectListener])` {#netconnectoptions-connectlistener}

**Aggiunto in: v0.7.0**

- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket)

Alias di [`net.createConnection(options[, connectListener])`](/it/nodejs/api/net#netcreateconnectionoptions-connectlistener).

### `net.connect(path[, connectListener])` {#netconnectpath-connectlistener}

**Aggiunto in: v0.1.90**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket)

Alias di [`net.createConnection(path[, connectListener])`](/it/nodejs/api/net#netcreateconnectionpath-connectlistener).

### `net.connect(port[, host][, connectListener])` {#netconnectport-host-connectlistener}

**Aggiunto in: v0.1.90**

- `port` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket)

Alias di [`net.createConnection(port[, host][, connectListener])`](/it/nodejs/api/net#netcreateconnectionport-host-connectlistener).


## `net.createConnection()` {#netcreateconnection}

Una funzione factory, che crea un nuovo [`net.Socket`](/it/nodejs/api/net#class-netsocket), avvia immediatamente la connessione con [`socket.connect()`](/it/nodejs/api/net#socketconnect), quindi restituisce il `net.Socket` che avvia la connessione.

Quando la connessione è stabilita, un evento [`'connect'`](/it/nodejs/api/net#event-connect) verrà emesso sul socket restituito. L'ultimo parametro `connectListener`, se fornito, verrà aggiunto come listener per l'evento [`'connect'`](/it/nodejs/api/net#event-connect) **una volta**.

Possibili firme:

- [`net.createConnection(options[, connectListener])`](/it/nodejs/api/net#netcreateconnectionoptions-connectlistener)
- [`net.createConnection(path[, connectListener])`](/it/nodejs/api/net#netcreateconnectionpath-connectlistener) per connessioni [IPC](/it/nodejs/api/net#ipc-support).
- [`net.createConnection(port[, host][, connectListener])`](/it/nodejs/api/net#netcreateconnectionport-host-connectlistener) per connessioni TCP.

La funzione [`net.connect()`](/it/nodejs/api/net#netconnect) è un alias per questa funzione.

### `net.createConnection(options[, connectListener])` {#netcreateconnectionoptions-connectlistener}

**Aggiunto in: v0.1.90**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Richiesto. Verrà passato sia alla chiamata [`new net.Socket([options])`](/it/nodejs/api/net#new-netsocketoptions) che al metodo [`socket.connect(options[, connectListener])`](/it/nodejs/api/net#socketconnectoptions-connectlistener).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parametro comune delle funzioni [`net.createConnection()`](/it/nodejs/api/net#netcreateconnection). Se fornito, verrà aggiunto come listener per l'evento [`'connect'`](/it/nodejs/api/net#event-connect) sul socket restituito una volta.
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket appena creato utilizzato per avviare la connessione.

Per le opzioni disponibili, vedere [`new net.Socket([options])`](/it/nodejs/api/net#new-netsocketoptions) e [`socket.connect(options[, connectListener])`](/it/nodejs/api/net#socketconnectoptions-connectlistener).

Opzioni aggiuntive:

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se impostato, verrà utilizzato per chiamare [`socket.setTimeout(timeout)`](/it/nodejs/api/net#socketsettimeouttimeout-callback) dopo che il socket è stato creato, ma prima che inizi la connessione.

Di seguito è riportato un esempio di un client del server echo descritto nella sezione [`net.createServer()`](/it/nodejs/api/net#netcreateserveroptions-connectionlistener):



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

Per connettersi al socket `/tmp/echo.sock`:

```js [ESM]
const client = net.createConnection({ path: '/tmp/echo.sock' });
```
Di seguito è riportato un esempio di un client che utilizza l'opzione `port` e `onread`. In questo caso, l'opzione `onread` verrà utilizzata solo per chiamare `new net.Socket([options])` e l'opzione `port` verrà utilizzata per chiamare `socket.connect(options[, connectListener])`.



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

**Aggiunto in: v0.1.90**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Percorso a cui il socket deve connettersi. Sarà passato a [`socket.connect(path[, connectListener])`](/it/nodejs/api/net#socketconnectpath-connectlistener). Vedere [Identificazione dei percorsi per le connessioni IPC](/it/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parametro comune delle funzioni [`net.createConnection()`](/it/nodejs/api/net#netcreateconnection), un listener "once" per l'evento `'connect'` sul socket di avvio. Sarà passato a [`socket.connect(path[, connectListener])`](/it/nodejs/api/net#socketconnectpath-connectlistener).
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket appena creato utilizzato per avviare la connessione.

Avvia una connessione [IPC](/it/nodejs/api/net#ipc-support).

Questa funzione crea un nuovo [`net.Socket`](/it/nodejs/api/net#class-netsocket) con tutte le opzioni impostate sui valori predefiniti, avvia immediatamente la connessione con [`socket.connect(path[, connectListener])`](/it/nodejs/api/net#socketconnectpath-connectlistener), quindi restituisce il `net.Socket` che avvia la connessione.

### `net.createConnection(port[, host][, connectListener])` {#netcreateconnectionport-host-connectlistener}

**Aggiunto in: v0.1.90**

- `port` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta a cui il socket deve connettersi. Sarà passato a [`socket.connect(port[, host][, connectListener])`](/it/nodejs/api/net#socketconnectport-host-connectlistener).
- `host` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host a cui il socket deve connettersi. Sarà passato a [`socket.connect(port[, host][, connectListener])`](/it/nodejs/api/net#socketconnectport-host-connectlistener). **Predefinito:** `'localhost'`.
- `connectListener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parametro comune delle funzioni [`net.createConnection()`](/it/nodejs/api/net#netcreateconnection), un listener "once" per l'evento `'connect'` sul socket di avvio. Sarà passato a [`socket.connect(port[, host][, connectListener])`](/it/nodejs/api/net#socketconnectport-host-connectlistener).
- Restituisce: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) Il socket appena creato utilizzato per avviare la connessione.

Avvia una connessione TCP.

Questa funzione crea un nuovo [`net.Socket`](/it/nodejs/api/net#class-netsocket) con tutte le opzioni impostate sui valori predefiniti, avvia immediatamente la connessione con [`socket.connect(port[, host][, connectListener])`](/it/nodejs/api/net#socketconnectport-host-connectlistener), quindi restituisce il `net.Socket` che avvia la connessione.


## `net.createServer([options][, connectionListener])` {#netcreateserveroptions-connectionlistener}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.1.0, v18.17.0 | L'opzione `highWaterMark` è ora supportata. |
| v17.7.0, v16.15.0 | Le opzioni `noDelay`, `keepAlive` e `keepAliveInitialDelay` sono ora supportate. |
| v0.5.0 | Aggiunto in: v0.5.0 |
:::

-  `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `false`, il socket terminerà automaticamente il lato scrivibile quando termina il lato leggibile. **Predefinito:** `false`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Sovrascrive opzionalmente `readableHighWaterMark` e `writableHighWaterMark` di tutti i [`net.Socket`](/it/nodejs/api/net#class-netsocket). **Predefinito:** vedi [`stream.getDefaultHighWaterMark()`](/it/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode).
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `true`, abilita la funzionalità keep-alive sul socket immediatamente dopo la ricezione di una nuova connessione in entrata, in modo simile a quanto fatto in [`socket.setKeepAlive()`](/it/nodejs/api/net#socketsetkeepaliveenable-initialdelay). **Predefinito:** `false`.
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se impostato su un numero positivo, imposta il ritardo iniziale prima che venga inviato il primo probe keepalive su un socket inattivo. **Predefinito:** `0`.
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `true`, disabilita l'uso dell'algoritmo di Nagle immediatamente dopo la ricezione di una nuova connessione in entrata. **Predefinito:** `false`.
    - `pauseOnConnect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se il socket deve essere messo in pausa sulle connessioni in entrata. **Predefinito:** `false`.
    - `blockList` [\<net.BlockList\>](/it/nodejs/api/net#class-netblocklist) `blockList` può essere utilizzato per disabilitare l'accesso in entrata a specifici indirizzi IP, intervalli IP o sottoreti IP. Questo non funziona se il server è dietro un proxy inverso, NAT, ecc. perché l'indirizzo controllato rispetto alla block list è l'indirizzo del proxy o quello specificato dal NAT.


-  `connectionListener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Impostato automaticamente come listener per l'evento [`'connection'`](/it/nodejs/api/net#event-connection).
-  Restituisce: [\<net.Server\>](/it/nodejs/api/net#class-netserver)

Crea un nuovo server TCP o [IPC](/it/nodejs/api/net#ipc-support).

Se `allowHalfOpen` è impostato su `true`, quando l'altra estremità del socket segnala la fine della trasmissione, il server invierà indietro la fine della trasmissione solo quando [`socket.end()`](/it/nodejs/api/net#socketenddata-encoding-callback) viene chiamato esplicitamente. Ad esempio, nel contesto di TCP, quando viene ricevuto un pacchetto FIN, un pacchetto FIN viene rispedito solo quando [`socket.end()`](/it/nodejs/api/net#socketenddata-encoding-callback) viene chiamato esplicitamente. Fino ad allora la connessione è semi-chiusa (non leggibile ma ancora scrivibile). Vedi l'evento [`'end'`](/it/nodejs/api/net#event-end) e [RFC 1122](https://tools.ietf.org/html/rfc1122) (sezione 4.2.2.13) per maggiori informazioni.

Se `pauseOnConnect` è impostato su `true`, il socket associato a ciascuna connessione in entrata verrà messo in pausa e nessun dato verrà letto dal suo handle. Ciò consente di passare le connessioni tra i processi senza che i dati vengano letti dal processo originale. Per iniziare a leggere i dati da un socket in pausa, chiama [`socket.resume()`](/it/nodejs/api/net#socketresume).

Il server può essere un server TCP o un server [IPC](/it/nodejs/api/net#ipc-support), a seconda di cosa [`listen()`](/it/nodejs/api/net#serverlisten) ascolta.

Ecco un esempio di un server echo TCP che ascolta le connessioni sulla porta 8124:



::: code-group
```js [ESM]
import net from 'node:net';
const server = net.createServer((c) => {
  // Listener 'connection'.
  console.log('client connesso');
  c.on('end', () => {
    console.log('client disconnesso');
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
  // Listener 'connection'.
  console.log('client connesso');
  c.on('end', () => {
    console.log('client disconnesso');
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

Testalo usando `telnet`:

```bash [BASH]
telnet localhost 8124
```
Per ascoltare sul socket `/tmp/echo.sock`:

```js [ESM]
server.listen('/tmp/echo.sock', () => {
  console.log('server bound');
});
```
Usa `nc` per connetterti a un server socket di dominio Unix:

```bash [BASH]
nc -U /tmp/echo.sock
```

## `net.getDefaultAutoSelectFamily()` {#netgetdefaultautoselectfamily}

**Aggiunto in: v19.4.0**

Ottiene il valore predefinito corrente dell'opzione `autoSelectFamily` di [`socket.connect(options)`](/it/nodejs/api/net#socketconnectoptions-connectlistener). Il valore predefinito iniziale è `true`, a meno che non venga fornita l'opzione della riga di comando `--no-network-family-autoselection`.

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Il valore predefinito corrente dell'opzione `autoSelectFamily`.

## `net.setDefaultAutoSelectFamily(value)` {#netsetdefaultautoselectfamilyvalue}

**Aggiunto in: v19.4.0**

Imposta il valore predefinito dell'opzione `autoSelectFamily` di [`socket.connect(options)`](/it/nodejs/api/net#socketconnectoptions-connectlistener).

- `value` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Il nuovo valore predefinito. Il valore predefinito iniziale è `true`, a meno che non venga fornita l'opzione della riga di comando `--no-network-family-autoselection`.

## `net.getDefaultAutoSelectFamilyAttemptTimeout()` {#netgetdefaultautoselectfamilyattempttimeout}

**Aggiunto in: v19.8.0, v18.18.0**

Ottiene il valore predefinito corrente dell'opzione `autoSelectFamilyAttemptTimeout` di [`socket.connect(options)`](/it/nodejs/api/net#socketconnectoptions-connectlistener). Il valore predefinito iniziale è `250` o il valore specificato tramite l'opzione della riga di comando `--network-family-autoselection-attempt-timeout`.

- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il valore predefinito corrente dell'opzione `autoSelectFamilyAttemptTimeout`.

## `net.setDefaultAutoSelectFamilyAttemptTimeout(value)` {#netsetdefaultautoselectfamilyattempttimeoutvalue}

**Aggiunto in: v19.8.0, v18.18.0**

Imposta il valore predefinito dell'opzione `autoSelectFamilyAttemptTimeout` di [`socket.connect(options)`](/it/nodejs/api/net#socketconnectoptions-connectlistener).

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il nuovo valore predefinito, che deve essere un numero positivo. Se il numero è inferiore a `10`, viene utilizzato invece il valore `10`. Il valore predefinito iniziale è `250` o il valore specificato tramite l'opzione della riga di comando `--network-family-autoselection-attempt-timeout`.


## `net.isIP(input)` {#netisipinput}

**Aggiunto in: v0.3.0**

- `input` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce `6` se `input` è un indirizzo IPv6. Restituisce `4` se `input` è un indirizzo IPv4 in [notazione decimale puntata](https://en.wikipedia.org/wiki/Dot-decimal_notation) senza zeri iniziali. Altrimenti, restituisce `0`.

```js [ESM]
net.isIP('::1'); // restituisce 6
net.isIP('127.0.0.1'); // restituisce 4
net.isIP('127.000.000.001'); // restituisce 0
net.isIP('127.0.0.1/24'); // restituisce 0
net.isIP('fhqwhgads'); // restituisce 0
```
## `net.isIPv4(input)` {#netisipv4input}

**Aggiunto in: v0.3.0**

- `input` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se `input` è un indirizzo IPv4 in [notazione decimale puntata](https://en.wikipedia.org/wiki/Dot-decimal_notation) senza zeri iniziali. Altrimenti, restituisce `false`.

```js [ESM]
net.isIPv4('127.0.0.1'); // restituisce true
net.isIPv4('127.000.000.001'); // restituisce false
net.isIPv4('127.0.0.1/24'); // restituisce false
net.isIPv4('fhqwhgads'); // restituisce false
```
## `net.isIPv6(input)` {#netisipv6input}

**Aggiunto in: v0.3.0**

- `input` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se `input` è un indirizzo IPv6. Altrimenti, restituisce `false`.

```js [ESM]
net.isIPv6('::1'); // restituisce true
net.isIPv6('fhqwhgads'); // restituisce false
```

