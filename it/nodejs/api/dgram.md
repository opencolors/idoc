---
title: Documentazione di Node.js - dgram
description: Il modulo dgram fornisce un'implementazione dei socket di datagrammi UDP, permettendo la creazione di applicazioni client e server in grado di inviare e ricevere pacchetti di datagrammi.
head:
  - - meta
    - name: og:title
      content: Documentazione di Node.js - dgram | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo dgram fornisce un'implementazione dei socket di datagrammi UDP, permettendo la creazione di applicazioni client e server in grado di inviare e ricevere pacchetti di datagrammi.
  - - meta
    - name: twitter:title
      content: Documentazione di Node.js - dgram | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo dgram fornisce un'implementazione dei socket di datagrammi UDP, permettendo la creazione di applicazioni client e server in grado di inviare e ricevere pacchetti di datagrammi.
---


# Socket UDP/datagram {#udp/datagram-sockets}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/dgram.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dgram.js)

Il modulo `node:dgram` fornisce un'implementazione dei socket datagram UDP.

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

## Classe: `dgram.Socket` {#class-dgramsocket}

**Aggiunto in: v0.1.99**

- Estende: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Incapsula la funzionalità del datagram.

Nuove istanze di `dgram.Socket` vengono create usando [`dgram.createSocket()`](/it/nodejs/api/dgram#dgramcreatesocketoptions-callback). La parola chiave `new` non deve essere usata per creare istanze `dgram.Socket`.

### Evento: `'close'` {#event-close}

**Aggiunto in: v0.1.99**

L'evento `'close'` viene emesso dopo che un socket viene chiuso con [`close()`](/it/nodejs/api/dgram#socketclosecallback). Una volta attivato, nessun nuovo evento `'message'` verrà emesso su questo socket.

### Evento: `'connect'` {#event-connect}

**Aggiunto in: v12.0.0**

L'evento `'connect'` viene emesso dopo che un socket è associato a un indirizzo remoto a seguito di una chiamata [`connect()`](/it/nodejs/api/dgram#socketconnectport-address-callback) riuscita.


### Evento: `'error'` {#event-error}

**Aggiunto in: v0.1.99**

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

L'evento `'error'` viene emesso ogni volta che si verifica un errore. Alla funzione di gestione dell'evento viene passato un singolo oggetto `Error`.

### Evento: `'listening'` {#event-listening}

**Aggiunto in: v0.1.99**

L'evento `'listening'` viene emesso una volta che `dgram.Socket` è indirizzabile e può ricevere dati. Ciò accade esplicitamente con `socket.bind()` o implicitamente la prima volta che i dati vengono inviati utilizzando `socket.send()`. Finché `dgram.Socket` non è in ascolto, le risorse di sistema sottostanti non esistono e chiamate come `socket.address()` e `socket.setTTL()` falliranno.

### Evento: `'message'` {#event-message}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.4.0 | La proprietà `family` ora restituisce una stringa anziché un numero. |
| v18.0.0 | La proprietà `family` ora restituisce un numero anziché una stringa. |
| v0.1.99 | Aggiunto in: v0.1.99 |
:::

L'evento `'message'` viene emesso quando un nuovo datagramma è disponibile su un socket. Alla funzione di gestione dell'evento vengono passati due argomenti: `msg` e `rinfo`.

- `msg` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Il messaggio.
- `rinfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Informazioni sull'indirizzo remoto.
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'indirizzo del mittente.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La famiglia di indirizzi (`'IPv4'` o `'IPv6'`).
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La porta del mittente.
    - `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione del messaggio.
  
 

Se l'indirizzo di origine del pacchetto in entrata è un indirizzo locale di collegamento IPv6, il nome dell'interfaccia viene aggiunto all'`address`. Ad esempio, un pacchetto ricevuto sull'interfaccia `en0` potrebbe avere il campo address impostato su `'fe80::2618:1234:ab11:3b9c%en0'`, dove `'%en0'` è il nome dell'interfaccia come suffisso dell'ID di zona.


### `socket.addMembership(multicastAddress[, multicastInterface])` {#socketaddmembershipmulticastaddress-multicastinterface}

**Aggiunto in: v0.6.9**

- `multicastAddress` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Indica al kernel di unirsi a un gruppo multicast all'indirizzo `multicastAddress` e all'interfaccia `multicastInterface` specificati utilizzando l'opzione socket `IP_ADD_MEMBERSHIP`. Se l'argomento `multicastInterface` non viene specificato, il sistema operativo sceglierà un'interfaccia e vi aggiungerà l'appartenenza. Per aggiungere l'appartenenza a ogni interfaccia disponibile, chiama `addMembership` più volte, una volta per interfaccia.

Quando viene chiamato su un socket non associato, questo metodo si collegherà implicitamente a una porta casuale, ascoltando su tutte le interfacce.

Quando si condivide un socket UDP tra più worker `cluster`, la funzione `socket.addMembership()` deve essere chiamata una sola volta, altrimenti si verificherà un errore `EADDRINUSE`:

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import dgram from 'node:dgram';

if (cluster.isPrimary) {
  cluster.fork(); // Funziona correttamente.
  cluster.fork(); // Fallisce con EADDRINUSE.
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
  cluster.fork(); // Funziona correttamente.
  cluster.fork(); // Fallisce con EADDRINUSE.
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```
:::

### `socket.addSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketaddsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**Aggiunto in: v13.1.0, v12.16.0**

- `sourceAddress` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Indica al kernel di unirsi a un canale multicast specifico per l'origine all'indirizzo `sourceAddress` e all'indirizzo `groupAddress` specificati, utilizzando l'interfaccia `multicastInterface` con l'opzione socket `IP_ADD_SOURCE_MEMBERSHIP`. Se l'argomento `multicastInterface` non viene specificato, il sistema operativo sceglierà un'interfaccia e vi aggiungerà l'appartenenza. Per aggiungere l'appartenenza a ogni interfaccia disponibile, chiama `socket.addSourceSpecificMembership()` più volte, una volta per interfaccia.

Quando viene chiamato su un socket non associato, questo metodo si collegherà implicitamente a una porta casuale, ascoltando su tutte le interfacce.


### `socket.address()` {#socketaddress}

**Aggiunto in: v0.1.99**

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce un oggetto contenente le informazioni sull'indirizzo di un socket. Per i socket UDP, questo oggetto conterrà le proprietà `address`, `family` e `port`.

Questo metodo genera `EBADF` se chiamato su un socket non associato.

### `socket.bind([port][, address][, callback])` {#socketbindport-address-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v0.9.1 | Il metodo è stato modificato in un modello di esecuzione asincrono. Il codice legacy dovrà essere modificato per passare una funzione di callback alla chiamata del metodo. |
| v0.1.99 | Aggiunto in: v0.1.99 |
:::

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) senza parametri. Chiamato quando l'associazione è completa.

Per i socket UDP, fa sì che il `dgram.Socket` ascolti i messaggi datagram su una `port` denominata e un `address` facoltativo. Se `port` non è specificato o è `0`, il sistema operativo tenterà di eseguire il binding a una porta casuale. Se `address` non è specificato, il sistema operativo tenterà di ascoltare su tutti gli indirizzi. Una volta completata l'associazione, viene emesso un evento `'listening'` e viene chiamata la funzione `callback` facoltativa.

Specificare sia un listener di eventi `'listening'` sia passare un `callback` al metodo `socket.bind()` non è dannoso ma non molto utile.

Un socket datagram associato mantiene il processo Node.js in esecuzione per ricevere messaggi datagram.

Se l'associazione fallisce, viene generato un evento `'error'`. In rari casi (ad esempio, quando si tenta di eseguire il binding con un socket chiuso), potrebbe essere generato un [`Error`](/it/nodejs/api/errors#class-error).

Esempio di un server UDP in ascolto sulla porta 41234:



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

**Aggiunto in: v0.11.14**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Richiesto. Supporta le seguenti proprietà:
    - `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Per i socket UDP, fa sì che il `dgram.Socket` ascolti i messaggi datagram sul `port` specificato e sull'`address` opzionale che vengono passati come proprietà di un oggetto `options` passato come primo argomento. Se `port` non è specificato o è `0`, il sistema operativo tenterà di eseguire il binding su una porta casuale. Se `address` non è specificato, il sistema operativo tenterà di ascoltare su tutti gli indirizzi. Una volta completato il binding, viene emesso un evento `'listening'` e viene chiamata la funzione `callback` opzionale.

L'oggetto `options` può contenere una proprietà `fd`. Quando viene impostato un `fd` maggiore di `0`, verrà racchiuso attorno a un socket esistente con il descrittore di file specificato. In questo caso, le proprietà di `port` e `address` verranno ignorate.

Specificare sia un listener dell'evento `'listening'` che passare un `callback` al metodo `socket.bind()` non è dannoso ma non molto utile.

L'oggetto `options` può contenere una proprietà `exclusive` aggiuntiva che viene utilizzata quando si utilizzano oggetti `dgram.Socket` con il modulo [`cluster`](/it/nodejs/api/cluster). Quando `exclusive` è impostato su `false` (il valore predefinito), i worker del cluster utilizzeranno lo stesso handle del socket sottostante consentendo di condividere le attività di gestione della connessione. Quando `exclusive` è `true`, tuttavia, l'handle non viene condiviso e il tentativo di condivisione della porta si traduce in un errore. La creazione di un `dgram.Socket` con l'opzione `reusePort` impostata su `true` fa sì che `exclusive` sia sempre `true` quando viene chiamato `socket.bind()`.

Un socket datagram vincolato mantiene in esecuzione il processo Node.js per ricevere messaggi datagram.

Se il binding fallisce, viene generato un evento `'error'`. In rari casi (ad esempio, tentare di eseguire il binding con un socket chiuso), può essere generato un [`Error`](/it/nodejs/api/errors#class-error).

Di seguito è riportato un esempio di socket in ascolto su una porta esclusiva.

```js [ESM]
socket.bind({
  address: 'localhost',
  port: 8000,
  exclusive: true,
});
```

### `socket.close([callback])` {#socketclosecallback}

**Aggiunto in: v0.1.99**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chiamata quando il socket è stato chiuso.

Chiude il socket sottostante e smette di ascoltare i dati su di esso. Se viene fornito un callback, viene aggiunto come listener per l'evento [`'close'`](/it/nodejs/api/dgram#event-close).

### `socket[Symbol.asyncDispose]()` {#socketsymbolasyncdispose}

**Aggiunto in: v20.5.0, v18.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Chiama [`socket.close()`](/it/nodejs/api/dgram#socketclosecallback) e restituisce una promise che si risolve quando il socket è stato chiuso.

### `socket.connect(port[, address][, callback])` {#socketconnectport-address-callback}

**Aggiunto in: v12.0.0**

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chiamata al completamento della connessione o in caso di errore.

Associa il `dgram.Socket` a un indirizzo e una porta remoti. Ogni messaggio inviato da questo handle viene automaticamente inviato a tale destinazione. Inoltre, il socket riceverà solo messaggi da quel peer remoto. Tentare di chiamare `connect()` su un socket già connesso comporterà un'eccezione [`ERR_SOCKET_DGRAM_IS_CONNECTED`](/it/nodejs/api/errors#err_socket_dgram_is_connected). Se `address` non viene fornito, per impostazione predefinita verrà utilizzato `'127.0.0.1'` (per i socket `udp4`) o `'::1'` (per i socket `udp6`). Una volta completata la connessione, viene emesso un evento `'connect'` e viene chiamata la funzione `callback` facoltativa. In caso di errore, viene chiamato il `callback` o, in mancanza di questo, viene emesso un evento `'error'`.

### `socket.disconnect()` {#socketdisconnect}

**Aggiunto in: v12.0.0**

Una funzione sincrona che dissocia un `dgram.Socket` connesso dal suo indirizzo remoto. Tentare di chiamare `disconnect()` su un socket non associato o già disconnesso comporterà un'eccezione [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/it/nodejs/api/errors#err_socket_dgram_not_connected).


### `socket.dropMembership(multicastAddress[, multicastInterface])` {#socketdropmembershipmulticastaddress-multicastinterface}

**Aggiunto in: v0.6.9**

- `multicastAddress` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Indica al kernel di abbandonare un gruppo multicast all'indirizzo `multicastAddress` utilizzando l'opzione socket `IP_DROP_MEMBERSHIP`. Questo metodo viene chiamato automaticamente dal kernel quando il socket viene chiuso o il processo termina, quindi la maggior parte delle app non avrà mai motivo di chiamarlo.

Se `multicastInterface` non è specificata, il sistema operativo tenterà di abbandonare l'appartenenza su tutte le interfacce valide.

### `socket.dropSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketdropsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**Aggiunto in: v13.1.0, v12.16.0**

- `sourceAddress` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Indica al kernel di abbandonare un canale multicast specifico per l'origine all'indirizzo `sourceAddress` e `groupAddress` specificati utilizzando l'opzione socket `IP_DROP_SOURCE_MEMBERSHIP`. Questo metodo viene chiamato automaticamente dal kernel quando il socket viene chiuso o il processo termina, quindi la maggior parte delle app non avrà mai motivo di chiamarlo.

Se `multicastInterface` non è specificata, il sistema operativo tenterà di abbandonare l'appartenenza su tutte le interfacce valide.

### `socket.getRecvBufferSize()` {#socketgetrecvbuffersize}

**Aggiunto in: v8.7.0**

- Restituisce: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la dimensione in byte del buffer di ricezione del socket `SO_RCVBUF`.

Questo metodo genera [`ERR_SOCKET_BUFFER_SIZE`](/it/nodejs/api/errors#err_socket_buffer_size) se chiamato su un socket non associato.

### `socket.getSendBufferSize()` {#socketgetsendbuffersize}

**Aggiunto in: v8.7.0**

- Restituisce: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la dimensione in byte del buffer di invio del socket `SO_SNDBUF`.

Questo metodo genera [`ERR_SOCKET_BUFFER_SIZE`](/it/nodejs/api/errors#err_socket_buffer_size) se chiamato su un socket non associato.


### `socket.getSendQueueSize()` {#socketgetsendqueuesize}

**Aggiunto in: v18.8.0, v16.19.0**

- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte in coda per l'invio.

### `socket.getSendQueueCount()` {#socketgetsendqueuecount}

**Aggiunto in: v18.8.0, v16.19.0**

- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di richieste di invio attualmente nella coda in attesa di essere elaborate.

### `socket.ref()` {#socketref}

**Aggiunto in: v0.9.1**

- Restituisce: [\<dgram.Socket\>](/it/nodejs/api/dgram#class-dgramsocket)

Per impostazione predefinita, l'associazione di un socket impedirà al processo Node.js di terminare fintanto che il socket è aperto. Il metodo `socket.unref()` può essere utilizzato per escludere il socket dal conteggio dei riferimenti che mantiene attivo il processo Node.js. Il metodo `socket.ref()` aggiunge nuovamente il socket al conteggio dei riferimenti e ripristina il comportamento predefinito.

Chiamare `socket.ref()` più volte non avrà alcun effetto aggiuntivo.

Il metodo `socket.ref()` restituisce un riferimento al socket in modo che le chiamate possano essere concatenate.

### `socket.remoteAddress()` {#socketremoteaddress}

**Aggiunto in: v12.0.0**

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce un oggetto contenente `address`, `family` e `port` dell'endpoint remoto. Questo metodo genera un'eccezione [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/it/nodejs/api/errors#err_socket_dgram_not_connected) se il socket non è connesso.

### `socket.send(msg[, offset, length][, port][, address][, callback])` {#socketsendmsg-offset-length-port-address-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.0.0 | Il parametro `address` ora accetta solo una `string`, `null` o `undefined`. |
| v14.5.0, v12.19.0 | Il parametro `msg` ora può essere qualsiasi `TypedArray` o `DataView`. |
| v12.0.0 | Aggiunto il supporto per l'invio di dati su socket connessi. |
| v8.0.0 | Il parametro `msg` ora può essere un `Uint8Array`. |
| v8.0.0 | Il parametro `address` ora è sempre opzionale. |
| v6.0.0 | In caso di successo, `callback` verrà ora richiamato con un argomento `error` di `null` anziché `0`. |
| v5.7.0 | Il parametro `msg` ora può essere un array. Inoltre, i parametri `offset` e `length` ora sono opzionali. |
| v0.1.99 | Aggiunto in: v0.1.99 |
:::

- `msg` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Messaggio da inviare.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Offset nel buffer in cui inizia il messaggio.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte nel messaggio.
- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta di destinazione.
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome host o indirizzo IP di destinazione.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chiamato quando il messaggio è stato inviato.

Trasmette un datagramma sul socket. Per i socket senza connessione, è necessario specificare `port` e `address` di destinazione. I socket connessi, d'altra parte, utilizzeranno il loro endpoint remoto associato, quindi gli argomenti `port` e `address` non devono essere impostati.

L'argomento `msg` contiene il messaggio da inviare. A seconda del suo tipo, possono essere applicati comportamenti diversi. Se `msg` è un `Buffer`, qualsiasi `TypedArray` o un `DataView`, `offset` e `length` specificano l'offset all'interno del `Buffer` in cui inizia il messaggio e il numero di byte nel messaggio, rispettivamente. Se `msg` è una `String`, viene automaticamente convertita in un `Buffer` con codifica `'utf8'`. Con i messaggi che contengono caratteri multi-byte, `offset` e `length` saranno calcolati rispetto alla [lunghezza in byte](/it/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) e non alla posizione del carattere. Se `msg` è un array, `offset` e `length` non devono essere specificati.

L'argomento `address` è una stringa. Se il valore di `address` è un nome host, verrà utilizzato il DNS per risolvere l'indirizzo dell'host. Se `address` non viene fornito o è altrimenti null, verrà utilizzato `'127.0.0.1'` (per i socket `udp4`) o `'::1'` (per i socket `udp6`) per impostazione predefinita.

Se il socket non è stato precedentemente associato con una chiamata a `bind`, al socket viene assegnato un numero di porta casuale e viene associato all'indirizzo "tutte le interfacce" (`'0.0.0.0'` per i socket `udp4`, `'::0'` per i socket `udp6`.)

Una funzione `callback` opzionale può essere specificata come un modo per segnalare errori DNS o per determinare quando è sicuro riutilizzare l'oggetto `buf`. Le ricerche DNS ritardano il tempo di invio per almeno un tick del ciclo di eventi Node.js.

L'unico modo per sapere con certezza che il datagramma è stato inviato è utilizzare una `callback`. Se si verifica un errore e viene fornita una `callback`, l'errore verrà passato come primo argomento alla `callback`. Se non viene fornita una `callback`, l'errore viene emesso come un evento `'error'` sull'oggetto `socket`.

Offset e lunghezza sono opzionali, ma entrambi *devono* essere impostati se ne viene utilizzato uno. Sono supportati solo quando il primo argomento è un `Buffer`, un `TypedArray` o un `DataView`.

Questo metodo genera [`ERR_SOCKET_BAD_PORT`](/it/nodejs/api/errors#err_socket_bad_port) se chiamato su un socket non associato.

Esempio di invio di un pacchetto UDP a una porta su `localhost`;



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
const { Buffer } = require('node:buffer');

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});
```
:::

Esempio di invio di un pacchetto UDP composto da più buffer a una porta su `127.0.0.1`;



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
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```
:::

L'invio di più buffer potrebbe essere più veloce o più lento a seconda dell'applicazione e del sistema operativo. Esegui benchmark per determinare la strategia ottimale caso per caso. In generale, tuttavia, l'invio di più buffer è più veloce.

Esempio di invio di un pacchetto UDP utilizzando un socket connesso a una porta su `localhost`:



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
const { Buffer } = require('node:buffer');

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.connect(41234, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});
```
:::


#### Nota sulla dimensione dei datagrammi UDP {#note-about-udp-datagram-size}

La dimensione massima di un datagramma IPv4/v6 dipende dalla `MTU` (Maximum Transmission Unit) e dalla dimensione del campo `Payload Length`.

- Il campo `Payload Length` è largo 16 bit, il che significa che un payload normale non può superare 64K ottetti inclusi l'intestazione e i dati internet (65.507 byte = 65.535 - 8 byte di intestazione UDP - 20 byte di intestazione IP); questo è generalmente vero per le interfacce di loopback, ma tali messaggi datagrammi lunghi sono impraticabili per la maggior parte degli host e delle reti.
- La `MTU` è la dimensione massima che una data tecnologia di livello di collegamento può supportare per i messaggi datagrammi. Per qualsiasi collegamento, IPv4 impone una `MTU` minima di 68 ottetti, mentre la `MTU` raccomandata per IPv4 è di 576 (tipicamente raccomandata come `MTU` per applicazioni di tipo dial-up), sia che arrivino interi o in frammenti. Per IPv6, la `MTU` minima è di 1280 ottetti. Tuttavia, la dimensione minima obbligatoria del buffer di riassemblaggio dei frammenti è di 1500 ottetti. Il valore di 68 ottetti è molto piccolo, poiché la maggior parte delle tecnologie di livello di collegamento attuali, come Ethernet, hanno una `MTU` minima di 1500.

È impossibile conoscere in anticipo la MTU di ciascun collegamento attraverso il quale un pacchetto potrebbe viaggiare. L'invio di un datagramma superiore alla `MTU` del destinatario non funzionerà perché il pacchetto verrà eliminato silenziosamente senza informare la sorgente che i dati non hanno raggiunto il destinatario previsto.

### `socket.setBroadcast(flag)` {#socketsetbroadcastflag}

**Aggiunto in: v0.6.9**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Imposta o cancella l'opzione socket `SO_BROADCAST`. Quando impostato su `true`, i pacchetti UDP possono essere inviati all'indirizzo di broadcast di un'interfaccia locale.

Questo metodo genera `EBADF` se chiamato su un socket non associato.

### `socket.setMulticastInterface(multicastInterface)` {#socketsetmulticastinterfacemulticastinterface}

**Aggiunto in: v8.6.0**

- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

*Tutti i riferimenti allo scope in questa sezione si riferiscono a
<a href="https://en.wikipedia.org/wiki/IPv6_address#Scoped_literal_IPv6_addresses">Indici di zona IPv6</a>, che sono definiti da <a href="https://tools.ietf.org/html/rfc4007">RFC 4007</a>. In forma di stringa, un IP
con un indice di scope è scritto come <code>'IP%scope'</code> dove scope è un nome di interfaccia
o numero di interfaccia.*

Imposta l'interfaccia multicast in uscita predefinita del socket su un'interfaccia scelta o riporta alla selezione dell'interfaccia di sistema. La `multicastInterface` deve essere una rappresentazione stringa valida di un IP dalla famiglia del socket.

Per i socket IPv4, questo dovrebbe essere l'IP configurato per l'interfaccia fisica desiderata. Tutti i pacchetti inviati al multicast sul socket verranno inviati sull'interfaccia determinata dall'uso più recente e riuscito di questa chiamata.

Per i socket IPv6, `multicastInterface` deve includere uno scope per indicare l'interfaccia come negli esempi che seguono. In IPv6, le singole chiamate `send` possono anche utilizzare scope espliciti negli indirizzi, quindi solo i pacchetti inviati a un indirizzo multicast senza specificare uno scope esplicito sono interessati dall'uso più recente e riuscito di questa chiamata.

Questo metodo genera `EBADF` se chiamato su un socket non associato.


#### Esempio: interfaccia multicast in uscita IPv6 {#example-ipv6-outgoing-multicast-interface}

Sulla maggior parte dei sistemi, dove il formato dello scope utilizza il nome dell'interfaccia:

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%eth1');
});
```
Su Windows, dove il formato dello scope utilizza un numero di interfaccia:

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%2');
});
```
#### Esempio: interfaccia multicast in uscita IPv4 {#example-ipv4-outgoing-multicast-interface}

Tutti i sistemi utilizzano un IP dell'host sull'interfaccia fisica desiderata:

```js [ESM]
const socket = dgram.createSocket('udp4');

socket.bind(1234, () => {
  socket.setMulticastInterface('10.0.0.2');
});
```
#### Risultati della chiamata {#call-results}

Una chiamata su un socket che non è pronto per l'invio o non è più aperto potrebbe generare un [`Error`](/it/nodejs/api/errors#class-error) di tipo *Not running*.

Se `multicastInterface` non può essere analizzato in un IP, viene generato un [`System Error`](/it/nodejs/api/errors#class-systemerror) *EINVAL*.

Su IPv4, se `multicastInterface` è un indirizzo valido ma non corrisponde a nessuna interfaccia, o se l'indirizzo non corrisponde alla famiglia, viene generato un [`System Error`](/it/nodejs/api/errors#class-systemerror) come `EADDRNOTAVAIL` o `EPROTONOSUP`.

Su IPv6, la maggior parte degli errori con la specifica o l'omissione dello scope comporterà che il socket continui a utilizzare (o ritorni a) la selezione dell'interfaccia predefinita del sistema.

L'indirizzo ANY della famiglia di indirizzi di un socket (IPv4 `'0.0.0.0'` o IPv6 `'::'`) può essere utilizzato per restituire il controllo dell'interfaccia in uscita predefinita dei socket al sistema per i futuri pacchetti multicast.

### `socket.setMulticastLoopback(flag)` {#socketsetmulticastloopbackflag}

**Aggiunto in: v0.3.8**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Imposta o cancella l'opzione del socket `IP_MULTICAST_LOOP`. Quando impostato su `true`, i pacchetti multicast verranno ricevuti anche sull'interfaccia locale.

Questo metodo genera `EBADF` se chiamato su un socket non associato.

### `socket.setMulticastTTL(ttl)` {#socketsetmulticastttlttl}

**Aggiunto in: v0.3.8**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Imposta l'opzione del socket `IP_MULTICAST_TTL`. Mentre TTL generalmente sta per "Time to Live" (Tempo di Vita), in questo contesto specifica il numero di hop IP che un pacchetto è autorizzato a percorrere, in particolare per il traffico multicast. Ogni router o gateway che inoltra un pacchetto decrementa il TTL. Se il TTL viene decrementato a 0 da un router, non verrà inoltrato.

L'argomento `ttl` può essere compreso tra 0 e 255. Il valore predefinito sulla maggior parte dei sistemi è `1`.

Questo metodo genera `EBADF` se chiamato su un socket non associato.


### `socket.setRecvBufferSize(size)` {#socketsetrecvbuffersizesize}

**Aggiunto in: v8.7.0**

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Imposta l'opzione socket `SO_RCVBUF`. Imposta la dimensione massima del buffer di ricezione del socket in byte.

Questo metodo genera [`ERR_SOCKET_BUFFER_SIZE`](/it/nodejs/api/errors#err_socket_buffer_size) se chiamato su un socket non associato.

### `socket.setSendBufferSize(size)` {#socketsetsendbuffersizesize}

**Aggiunto in: v8.7.0**

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Imposta l'opzione socket `SO_SNDBUF`. Imposta la dimensione massima del buffer di invio del socket in byte.

Questo metodo genera [`ERR_SOCKET_BUFFER_SIZE`](/it/nodejs/api/errors#err_socket_buffer_size) se chiamato su un socket non associato.

### `socket.setTTL(ttl)` {#socketsetttlttl}

**Aggiunto in: v0.1.101**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Imposta l'opzione socket `IP_TTL`. Mentre TTL generalmente sta per "Time to Live" (Tempo di Vita), in questo contesto specifica il numero di hop IP che un pacchetto è autorizzato ad attraversare. Ogni router o gateway che inoltra un pacchetto decrementa il TTL. Se il TTL viene decrementato a 0 da un router, non verrà inoltrato. La modifica dei valori TTL viene in genere eseguita per i probe di rete o quando si utilizza il multicasting.

L'argomento `ttl` può essere compreso tra 1 e 255. Il valore predefinito sulla maggior parte dei sistemi è 64.

Questo metodo genera `EBADF` se chiamato su un socket non associato.

### `socket.unref()` {#socketunref}

**Aggiunto in: v0.9.1**

- Returns: [\<dgram.Socket\>](/it/nodejs/api/dgram#class-dgramsocket)

Per impostazione predefinita, l'associazione di un socket farà sì che esso impedisca al processo Node.js di uscire finché il socket è aperto. Il metodo `socket.unref()` può essere utilizzato per escludere il socket dal conteggio dei riferimenti che mantiene attivo il processo Node.js, consentendo al processo di uscire anche se il socket è ancora in ascolto.

Chiamare `socket.unref()` più volte non avrà alcun effetto aggiuntivo.

Il metodo `socket.unref()` restituisce un riferimento al socket in modo che le chiamate possano essere concatenate.


## Funzioni del modulo `node:dgram` {#nodedgram-module-functions}

### `dgram.createSocket(options[, callback])` {#dgramcreatesocketoptions-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.1.0 | L'opzione `reusePort` è supportata. |
| v15.8.0 | Aggiunto il supporto per AbortSignal. |
| v11.4.0 | L'opzione `ipv6Only` è supportata. |
| v8.7.0 | Le opzioni `recvBufferSize` e `sendBufferSize` sono ora supportate. |
| v8.6.0 | L'opzione `lookup` è supportata. |
| v0.11.13 | Aggiunto in: v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Le opzioni disponibili sono:
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La famiglia del socket. Deve essere `'udp4'` o `'udp6'`. Richiesto.
    - `reuseAddr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true` [`socket.bind()`](/it/nodejs/api/dgram#socketbindport-address-callback) riutilizzerà l'indirizzo, anche se un altro processo ha già associato un socket ad esso, ma solo un socket può ricevere i dati. **Predefinito:** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true` [`socket.bind()`](/it/nodejs/api/dgram#socketbindport-address-callback) riutilizzerà la porta, anche se un altro processo ha già associato un socket ad essa. I datagrammi in entrata vengono distribuiti ai socket in ascolto. L'opzione è disponibile solo su alcune piattaforme, come Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 e AIX 7.2.5+. Su piattaforme non supportate, questa opzione genera un errore quando il socket è associato. **Predefinito:** `false`.
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Impostare `ipv6Only` su `true` disabiliterà il supporto dual-stack, ovvero l'associazione all'indirizzo `::` non farà sì che `0.0.0.0` venga associato. **Predefinito:** `false`.
    - `recvBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il valore del socket `SO_RCVBUF`.
    - `sendBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il valore del socket `SO_SNDBUF`.
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione di ricerca personalizzata. **Predefinito:** [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback).
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Un AbortSignal che può essere utilizzato per chiudere un socket.
    - `receiveBlockList` [\<net.BlockList\>](/it/nodejs/api/net#class-netblocklist) `receiveBlockList` può essere utilizzato per scartare datagrammi in entrata verso specifici indirizzi IP, intervalli IP o sottoreti IP. Questo non funziona se il server si trova dietro un proxy inverso, NAT, ecc. perché l'indirizzo controllato rispetto alla blocklist è l'indirizzo del proxy, o quello specificato dal NAT.
    - `sendBlockList` [\<net.BlockList\>](/it/nodejs/api/net#class-netblocklist) `sendBlockList` può essere utilizzato per disabilitare l'accesso in uscita a specifici indirizzi IP, intervalli IP o sottoreti IP.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Allegata come listener per eventi `'message'`. Opzionale.
- Restituisce: [\<dgram.Socket\>](/it/nodejs/api/dgram#class-dgramsocket)

Crea un oggetto `dgram.Socket`. Una volta creato il socket, chiamare [`socket.bind()`](/it/nodejs/api/dgram#socketbindport-address-callback) istruirà il socket ad iniziare l'ascolto di messaggi datagram. Quando `address` e `port` non vengono passati a [`socket.bind()`](/it/nodejs/api/dgram#socketbindport-address-callback) il metodo assocerà il socket all'indirizzo "tutte le interfacce" su una porta casuale (fa la cosa giusta sia per i socket `udp4` che `udp6`). L'indirizzo e la porta associati possono essere recuperati utilizzando [`socket.address().address`](/it/nodejs/api/dgram#socketaddress) e [`socket.address().port`](/it/nodejs/api/dgram#socketaddress).

Se l'opzione `signal` è abilitata, chiamare `.abort()` sul corrispondente `AbortController` è simile a chiamare `.close()` sul socket:

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

**Aggiunto in: v0.1.99**

- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O `'udp4'` o `'udp6'`.
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Allegata come listener agli eventi `'message'`.
- Restituisce: [\<dgram.Socket\>](/it/nodejs/api/dgram#class-dgramsocket)

Crea un oggetto `dgram.Socket` del `type` specificato.

Una volta creata la socket, chiamare [`socket.bind()`](/it/nodejs/api/dgram#socketbindport-address-callback) istruirà la socket ad iniziare ad ascoltare i messaggi datagram. Quando `address` e `port` non vengono passati a [`socket.bind()`](/it/nodejs/api/dgram#socketbindport-address-callback), il metodo connetterà la socket all'indirizzo "tutte le interfacce" su una porta casuale (fa la cosa giusta sia per le socket `udp4` che `udp6`). L'indirizzo e la porta connessi possono essere recuperati utilizzando [`socket.address().address`](/it/nodejs/api/dgram#socketaddress) e [`socket.address().port`](/it/nodejs/api/dgram#socketaddress).

