---
title: Node.js Dokumentation - dgram
description: Das dgram-Modul bietet eine Implementierung von UDP-Datagrammsockets, die es ermöglicht, sowohl Client- als auch Serveranwendungen zu erstellen, die Datagrammpakete senden und empfangen können.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - dgram | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das dgram-Modul bietet eine Implementierung von UDP-Datagrammsockets, die es ermöglicht, sowohl Client- als auch Serveranwendungen zu erstellen, die Datagrammpakete senden und empfangen können.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - dgram | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das dgram-Modul bietet eine Implementierung von UDP-Datagrammsockets, die es ermöglicht, sowohl Client- als auch Serveranwendungen zu erstellen, die Datagrammpakete senden und empfangen können.
---


# UDP/Datagramm-Sockets {#udp/datagram-sockets}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/dgram.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dgram.js)

Das Modul `node:dgram` bietet eine Implementierung von UDP-Datagramm-Sockets.

::: code-group
```js [ESM]
import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`Serverfehler:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`Server empfing: ${msg} von ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Server hört auf ${address.address}:${address.port}`);
});

server.bind(41234);
// Gibt aus: Server hört auf 0.0.0.0:41234
```

```js [CJS]
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`Serverfehler:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`Server empfing: ${msg} von ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Server hört auf ${address.address}:${address.port}`);
});

server.bind(41234);
// Gibt aus: Server hört auf 0.0.0.0:41234
```
:::

## Klasse: `dgram.Socket` {#class-dgramsocket}

**Hinzugefügt in: v0.1.99**

- Erweitert: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Kapselt die Datagrammfunktionalität.

Neue Instanzen von `dgram.Socket` werden mit [`dgram.createSocket()`](/de/nodejs/api/dgram#dgramcreatesocketoptions-callback) erstellt. Das Schlüsselwort `new` darf nicht verwendet werden, um `dgram.Socket`-Instanzen zu erstellen.

### Ereignis: `'close'` {#event-close}

**Hinzugefügt in: v0.1.99**

Das `'close'`-Ereignis wird ausgelöst, nachdem ein Socket mit [`close()`](/de/nodejs/api/dgram#socketclosecallback) geschlossen wurde. Nach dem Auslösen werden keine neuen `'message'`-Ereignisse mehr auf diesem Socket ausgelöst.

### Ereignis: `'connect'` {#event-connect}

**Hinzugefügt in: v12.0.0**

Das `'connect'`-Ereignis wird ausgelöst, nachdem ein Socket als Ergebnis eines erfolgreichen [`connect()`](/de/nodejs/api/dgram#socketconnectport-address-callback)-Aufrufs mit einer Remote-Adresse verknüpft wurde.


### Ereignis: `'error'` {#event-error}

**Hinzugefügt in: v0.1.99**

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Das `'error'`-Ereignis wird immer dann ausgelöst, wenn ein Fehler auftritt. Die Ereignishandlerfunktion erhält ein einzelnes `Error`-Objekt.

### Ereignis: `'listening'` {#event-listening}

**Hinzugefügt in: v0.1.99**

Das `'listening'`-Ereignis wird ausgelöst, sobald die `dgram.Socket` adressierbar ist und Daten empfangen kann. Dies geschieht entweder explizit mit `socket.bind()` oder implizit beim ersten Senden von Daten mit `socket.send()`. Bis die `dgram.Socket` auf eingehende Verbindungen wartet (listening), existieren die zugrunde liegenden Systemressourcen nicht und Aufrufe wie `socket.address()` und `socket.setTTL()` schlagen fehl.

### Ereignis: `'message'` {#event-message}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.4.0 | Die Eigenschaft `family` gibt nun einen String anstelle einer Zahl zurück. |
| v18.0.0 | Die Eigenschaft `family` gibt nun eine Zahl anstelle eines Strings zurück. |
| v0.1.99 | Hinzugefügt in: v0.1.99 |
:::

Das `'message'`-Ereignis wird ausgelöst, wenn ein neues Datagramm auf einem Socket verfügbar ist. Die Ereignishandlerfunktion erhält zwei Argumente: `msg` und `rinfo`.

- `msg` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Die Nachricht.
- `rinfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Remote-Adressinformationen.
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Absenderadresse.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Adressfamilie (`'IPv4'` oder `'IPv6'`).
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Absenderport.
    - `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Nachrichtengröße.
  
 

Wenn die Quelladresse des eingehenden Pakets eine IPv6 Link-Local-Adresse ist, wird der Schnittstellenname zur `address` hinzugefügt. Beispielsweise kann ein Paket, das auf der Schnittstelle `en0` empfangen wird, das Adressfeld auf `'fe80::2618:1234:ab11:3b9c%en0'` gesetzt haben, wobei `'%en0'` der Schnittstellenname als Zonen-ID-Suffix ist.


### `socket.addMembership(multicastAddress[, multicastInterface])` {#socketaddmembershipmulticastaddress-multicastinterface}

**Hinzugefügt in: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Weist den Kernel an, einer Multicast-Gruppe an der angegebenen `multicastAddress` und `multicastInterface` beizutreten, wobei die Socket-Option `IP_ADD_MEMBERSHIP` verwendet wird. Wenn das Argument `multicastInterface` nicht angegeben wird, wählt das Betriebssystem eine Schnittstelle aus und fügt dieser die Mitgliedschaft hinzu. Um die Mitgliedschaft zu jeder verfügbaren Schnittstelle hinzuzufügen, rufen Sie `addMembership` mehrmals auf, einmal pro Schnittstelle.

Wenn diese Methode auf einem ungebundenen Socket aufgerufen wird, wird implizit eine Bindung an einen zufälligen Port vorgenommen, der an allen Schnittstellen lauscht.

Wenn ein UDP-Socket über mehrere `cluster`-Worker gemeinsam genutzt wird, muss die Funktion `socket.addMembership()` nur einmal aufgerufen werden, da sonst ein `EADDRINUSE`-Fehler auftritt:

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import dgram from 'node:dgram';

if (cluster.isPrimary) {
  cluster.fork(); // Funktioniert einwandfrei.
  cluster.fork(); // Schlägt mit EADDRINUSE fehl.
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
  cluster.fork(); // Funktioniert einwandfrei.
  cluster.fork(); // Schlägt mit EADDRINUSE fehl.
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```
:::

### `socket.addSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketaddsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**Hinzugefügt in: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Weist den Kernel an, einem Quellenspezifischen Multicast-Kanal an der angegebenen `sourceAddress` und `groupAddress` beizutreten, wobei die `multicastInterface` mit der Socket-Option `IP_ADD_SOURCE_MEMBERSHIP` verwendet wird. Wenn das Argument `multicastInterface` nicht angegeben wird, wählt das Betriebssystem eine Schnittstelle aus und fügt dieser die Mitgliedschaft hinzu. Um die Mitgliedschaft zu jeder verfügbaren Schnittstelle hinzuzufügen, rufen Sie `socket.addSourceSpecificMembership()` mehrmals auf, einmal pro Schnittstelle.

Wenn diese Methode auf einem ungebundenen Socket aufgerufen wird, wird implizit eine Bindung an einen zufälligen Port vorgenommen, der an allen Schnittstellen lauscht.


### `socket.address()` {#socketaddress}

**Hinzugefügt in: v0.1.99**

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt ein Objekt zurück, das die Adressinformationen für einen Socket enthält. Für UDP-Sockets enthält dieses Objekt die Eigenschaften `address`, `family` und `port`.

Diese Methode wirft `EBADF`, wenn sie auf einem ungebundenen Socket aufgerufen wird.

### `socket.bind([port][, address][, callback])` {#socketbindport-address-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v0.9.1 | Die Methode wurde in ein asynchrones Ausführungsmodell geändert. Legacy-Code muss geändert werden, um eine Callback-Funktion an den Methodenaufruf zu übergeben. |
| v0.1.99 | Hinzugefügt in: v0.1.99 |
:::

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) ohne Parameter. Wird aufgerufen, wenn die Bindung abgeschlossen ist.

Für UDP-Sockets bewirkt dies, dass der `dgram.Socket` auf Datagramm-Nachrichten an einem benannten `port` und einer optionalen `address` hört. Wenn `port` nicht angegeben oder `0` ist, versucht das Betriebssystem, sich an einen zufälligen Port zu binden. Wenn `address` nicht angegeben ist, versucht das Betriebssystem, an allen Adressen zu lauschen. Sobald die Bindung abgeschlossen ist, wird ein `'listening'`-Ereignis ausgelöst und die optionale `callback`-Funktion aufgerufen.

Die Angabe sowohl eines `'listening'`-Ereignis-Listeners als auch die Übergabe eines `callback` an die `socket.bind()`-Methode ist nicht schädlich, aber nicht sehr nützlich.

Ein gebundener Datagramm-Socket hält den Node.js-Prozess am Laufen, um Datagramm-Nachrichten zu empfangen.

Wenn die Bindung fehlschlägt, wird ein `'error'`-Ereignis generiert. In seltenen Fällen (z. B. beim Versuch, sich mit einem geschlossenen Socket zu binden) kann ein [`Error`](/de/nodejs/api/errors#class-error) ausgelöst werden.

Beispiel für einen UDP-Server, der an Port 41234 lauscht:

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

**Hinzugefügt in: v0.11.14**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Erforderlich. Unterstützt die folgenden Eigenschaften:
    - `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Für UDP-Sockets bewirkt dies, dass der `dgram.Socket` auf Datagramm-Nachrichten auf einem benannten `port` und einer optionalen `address` horcht, die als Eigenschaften eines `options`-Objekts übergeben werden, das als erstes Argument übergeben wird. Wenn `port` nicht angegeben oder `0` ist, versucht das Betriebssystem, sich an einen zufälligen Port zu binden. Wenn `address` nicht angegeben ist, versucht das Betriebssystem, auf allen Adressen zu lauschen. Sobald die Bindung abgeschlossen ist, wird ein `'listening'`-Ereignis ausgelöst und die optionale `callback`-Funktion aufgerufen.

Das `options`-Objekt kann eine `fd`-Eigenschaft enthalten. Wenn ein `fd` größer als `0` gesetzt ist, umschließt es einen vorhandenen Socket mit dem angegebenen Dateideskriptor. In diesem Fall werden die Eigenschaften von `port` und `address` ignoriert.

Die Angabe eines `'listening'`-Ereignislisteners und das Übergeben eines `callback` an die `socket.bind()`-Methode ist nicht schädlich, aber auch nicht sehr nützlich.

Das `options`-Objekt kann eine zusätzliche `exclusive`-Eigenschaft enthalten, die verwendet wird, wenn `dgram.Socket`-Objekte mit dem [`cluster`](/de/nodejs/api/cluster)-Modul verwendet werden. Wenn `exclusive` auf `false` (Standard) gesetzt ist, verwenden Cluster-Worker dasselbe zugrunde liegende Socket-Handle, wodurch die Verbindungsbehandlungsaufgaben gemeinsam genutzt werden können. Wenn `exclusive` jedoch `true` ist, wird das Handle nicht freigegeben, und der Versuch einer Portfreigabe führt zu einem Fehler. Das Erstellen eines `dgram.Socket` mit der Option `reusePort` auf `true` gesetzt bewirkt, dass `exclusive` immer `true` ist, wenn `socket.bind()` aufgerufen wird.

Ein gebundener Datagramm-Socket hält den Node.js-Prozess am Laufen, um Datagramm-Nachrichten zu empfangen.

Wenn die Bindung fehlschlägt, wird ein `'error'`-Ereignis generiert. In seltenen Fällen (z. B. beim Versuch, eine Bindung mit einem geschlossenen Socket herzustellen) kann ein [`Error`](/de/nodejs/api/errors#class-error) ausgelöst werden.

Ein Beispiel für einen Socket, der an einem exklusiven Port lauscht, ist unten dargestellt.

```js [ESM]
socket.bind({
  address: 'localhost',
  port: 8000,
  exclusive: true,
});
```

### `socket.close([callback])` {#socketclosecallback}

**Hinzugefügt in: v0.1.99**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, wenn der Socket geschlossen wurde.

Schließt den zugrunde liegenden Socket und beendet das Abhören von Daten darauf. Wenn ein Callback bereitgestellt wird, wird er als Listener für das [`'close'`-Ereignis](/de/nodejs/api/dgram#event-close) hinzugefügt.

### `socket[Symbol.asyncDispose]()` {#socketsymbolasyncdispose}

**Hinzugefügt in: v20.5.0, v18.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Ruft [`socket.close()`](/de/nodejs/api/dgram#socketclosecallback) auf und gibt ein Promise zurück, das erfüllt wird, wenn der Socket geschlossen wurde.

### `socket.connect(port[, address][, callback])` {#socketconnectport-address-callback}

**Hinzugefügt in: v12.0.0**

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, wenn die Verbindung hergestellt wurde oder ein Fehler aufgetreten ist.

Verknüpft den `dgram.Socket` mit einer Remote-Adresse und einem Port. Jede Nachricht, die von diesem Handle gesendet wird, wird automatisch an dieses Ziel gesendet. Außerdem empfängt der Socket nur Nachrichten von diesem Remote-Peer. Der Versuch, `connect()` auf einem bereits verbundenen Socket aufzurufen, führt zu einer [`ERR_SOCKET_DGRAM_IS_CONNECTED`](/de/nodejs/api/errors#err_socket_dgram_is_connected)-Ausnahme. Wenn `address` nicht angegeben ist, wird standardmäßig `'127.0.0.1'` (für `udp4`-Sockets) oder `'::1'` (für `udp6`-Sockets) verwendet. Sobald die Verbindung hergestellt ist, wird ein `'connect'`-Ereignis ausgelöst und die optionale `callback`-Funktion aufgerufen. Im Fehlerfall wird der `callback` aufgerufen oder, falls dies fehlschlägt, ein `'error'`-Ereignis ausgelöst.

### `socket.disconnect()` {#socketdisconnect}

**Hinzugefügt in: v12.0.0**

Eine synchrone Funktion, die einen verbundenen `dgram.Socket` von seiner Remote-Adresse trennt. Der Versuch, `disconnect()` auf einem ungebundenen oder bereits getrennten Socket aufzurufen, führt zu einer [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/de/nodejs/api/errors#err_socket_dgram_not_connected)-Ausnahme.


### `socket.dropMembership(multicastAddress[, multicastInterface])` {#socketdropmembershipmulticastaddress-multicastinterface}

**Hinzugefügt in: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Weist den Kernel an, eine Multicastgruppe unter `multicastAddress` mithilfe der Socket-Option `IP_DROP_MEMBERSHIP` zu verlassen. Diese Methode wird automatisch vom Kernel aufgerufen, wenn der Socket geschlossen oder der Prozess beendet wird, sodass die meisten Anwendungen keinen Grund haben, diese aufzurufen.

Wenn `multicastInterface` nicht angegeben ist, versucht das Betriebssystem, die Mitgliedschaft auf allen gültigen Schnittstellen aufzugeben.

### `socket.dropSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketdropsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**Hinzugefügt in: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Weist den Kernel an, einen quellspezifischen Multicast-Kanal unter der angegebenen `sourceAddress` und `groupAddress` mithilfe der Socket-Option `IP_DROP_SOURCE_MEMBERSHIP` zu verlassen. Diese Methode wird automatisch vom Kernel aufgerufen, wenn der Socket geschlossen oder der Prozess beendet wird, sodass die meisten Anwendungen keinen Grund haben, diese aufzurufen.

Wenn `multicastInterface` nicht angegeben ist, versucht das Betriebssystem, die Mitgliedschaft auf allen gültigen Schnittstellen aufzugeben.

### `socket.getRecvBufferSize()` {#socketgetrecvbuffersize}

**Hinzugefügt in: v8.7.0**

- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) die Größe des `SO_RCVBUF` Socket-Empfangspuffers in Bytes.

Diese Methode wirft [`ERR_SOCKET_BUFFER_SIZE`](/de/nodejs/api/errors#err_socket_buffer_size), wenn sie auf einem ungebundenen Socket aufgerufen wird.

### `socket.getSendBufferSize()` {#socketgetsendbuffersize}

**Hinzugefügt in: v8.7.0**

- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) die Größe des `SO_SNDBUF` Socket-Sendepuffers in Bytes.

Diese Methode wirft [`ERR_SOCKET_BUFFER_SIZE`](/de/nodejs/api/errors#err_socket_buffer_size), wenn sie auf einem ungebundenen Socket aufgerufen wird.


### `socket.getSendQueueSize()` {#socketgetsendqueuesize}

**Hinzugefügt in: v18.8.0, v16.19.0**

- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die zum Senden in die Warteschlange gestellt wurden.

### `socket.getSendQueueCount()` {#socketgetsendqueuecount}

**Hinzugefügt in: v18.8.0, v16.19.0**

- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Sendeanforderungen, die sich derzeit in der Warteschlange befinden und auf die Verarbeitung warten.

### `socket.ref()` {#socketref}

**Hinzugefügt in: v0.9.1**

- Gibt zurück: [\<dgram.Socket\>](/de/nodejs/api/dgram#class-dgramsocket)

Standardmäßig verhindert das Binden eines Sockets, dass der Node.js-Prozess beendet wird, solange der Socket geöffnet ist. Die Methode `socket.unref()` kann verwendet werden, um den Socket von der Referenzzählung auszuschließen, die den Node.js-Prozess aktiv hält. Die Methode `socket.ref()` fügt den Socket wieder zur Referenzzählung hinzu und stellt das Standardverhalten wieder her.

Das mehrmalige Aufrufen von `socket.ref()` hat keine zusätzlichen Auswirkungen.

Die Methode `socket.ref()` gibt eine Referenz auf den Socket zurück, sodass Aufrufe verkettet werden können.

### `socket.remoteAddress()` {#socketremoteaddress}

**Hinzugefügt in: v12.0.0**

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt ein Objekt zurück, das die `address`, `family` und den `port` des Remote-Endpunkts enthält. Diese Methode löst eine [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/de/nodejs/api/errors#err_socket_dgram_not_connected)-Ausnahme aus, wenn der Socket nicht verbunden ist.

### `socket.send(msg[, offset, length][, port][, address][, callback])` {#socketsendmsg-offset-length-port-address-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.0.0 | Der Parameter `address` akzeptiert jetzt nur noch `string`, `null` oder `undefined`. |
| v14.5.0, v12.19.0 | Der Parameter `msg` kann jetzt ein beliebiges `TypedArray` oder `DataView` sein. |
| v12.0.0 | Unterstützung für das Senden von Daten über verbundene Sockets hinzugefügt. |
| v8.0.0 | Der Parameter `msg` kann jetzt ein `Uint8Array` sein. |
| v8.0.0 | Der Parameter `address` ist jetzt immer optional. |
| v6.0.0 | Bei Erfolg wird `callback` jetzt mit einem `error`-Argument von `null` anstelle von `0` aufgerufen. |
| v5.7.0 | Der Parameter `msg` kann jetzt ein Array sein. Außerdem sind die Parameter `offset` und `length` jetzt optional. |
| v0.1.99 | Hinzugefügt in: v0.1.99 |
:::

- `msg` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Zu sendende Nachricht.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Offset im Puffer, an dem die Nachricht beginnt.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes in der Nachricht.
- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zielport.
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Zielhostname oder IP-Adresse.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, wenn die Nachricht gesendet wurde.

Sendet ein Datagramm über den Socket. Für verbindungslosen Sockets müssen der Ziel-`port` und die `address` angegeben werden. Verbundene Sockets verwenden hingegen ihren zugehörigen Remote-Endpunkt, sodass die Argumente `port` und `address` nicht gesetzt werden dürfen.

Das Argument `msg` enthält die zu sendende Nachricht. Abhängig von seinem Typ kann unterschiedliches Verhalten gelten. Wenn `msg` ein `Buffer`, ein `TypedArray` oder ein `DataView` ist, geben `offset` und `length` den Offset innerhalb des `Buffer` an, an dem die Nachricht beginnt, bzw. die Anzahl der Bytes in der Nachricht. Wenn `msg` ein `String` ist, wird er automatisch in einen `Buffer` mit `'utf8'`-Codierung konvertiert. Bei Nachrichten, die Multibyte-Zeichen enthalten, werden `offset` und `length` in Bezug auf die [Baitlänge](/de/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) und nicht auf die Zeichenposition berechnet. Wenn `msg` ein Array ist, dürfen `offset` und `length` nicht angegeben werden.

Das Argument `address` ist ein String. Wenn der Wert von `address` ein Hostname ist, wird DNS verwendet, um die Adresse des Hosts aufzulösen. Wenn `address` nicht angegeben oder anderweitig nullartig ist, wird standardmäßig `'127.0.0.1'` (für `udp4`-Sockets) oder `'::1'` (für `udp6`-Sockets) verwendet.

Wenn der Socket zuvor nicht mit einem Aufruf von `bind` gebunden wurde, wird dem Socket eine zufällige Portnummer zugewiesen und er wird an die Adresse "alle Schnittstellen" gebunden (`'0.0.0.0'` für `udp4`-Sockets, `'::0'` für `udp6`-Sockets).

Eine optionale `callback`-Funktion kann angegeben werden, um DNS-Fehler zu melden oder um festzustellen, wann es sicher ist, das `buf`-Objekt wiederzuverwenden. DNS-Lookups verzögern die Sendezeit um mindestens einen Tick der Node.js-Ereignisschleife.

Die einzige Möglichkeit, sicher zu wissen, dass das Datagramm gesendet wurde, ist die Verwendung eines `callback`. Wenn ein Fehler auftritt und ein `callback` angegeben wird, wird der Fehler als erstes Argument an den `callback` übergeben. Wenn kein `callback` angegeben wird, wird der Fehler als `'error'`-Ereignis auf dem `socket`-Objekt ausgegeben.

Offset und Länge sind optional, aber beide *müssen* gesetzt werden, wenn eines von beiden verwendet wird. Sie werden nur unterstützt, wenn das erste Argument ein `Buffer`, ein `TypedArray` oder ein `DataView` ist.

Diese Methode löst [`ERR_SOCKET_BAD_PORT`](/de/nodejs/api/errors#err_socket_bad_port) aus, wenn sie auf einem ungebundenen Socket aufgerufen wird.

Beispiel für das Senden eines UDP-Pakets an einen Port auf `localhost`;



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

Beispiel für das Senden eines UDP-Pakets, das aus mehreren Puffern besteht, an einen Port auf `127.0.0.1`;



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

Das Senden mehrerer Puffer kann je nach Anwendung und Betriebssystem schneller oder langsamer sein. Führen Sie Benchmarks durch, um die optimale Strategie für jeden einzelnen Fall zu ermitteln. Im Allgemeinen ist das Senden mehrerer Puffer jedoch schneller.

Beispiel für das Senden eines UDP-Pakets über einen Socket, der mit einem Port auf `localhost` verbunden ist:



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


#### Hinweis zur UDP-Datagrammgröße {#note-about-udp-datagram-size}

Die maximale Größe eines IPv4/v6-Datagramms hängt von der `MTU` (Maximum Transmission Unit) und der Feldgröße der `Payload Length` ab.

- Das Feld `Payload Length` ist 16 Bit breit, was bedeutet, dass eine normale Nutzlast 64K Oktette einschließlich des Internet-Headers und der Daten nicht überschreiten darf (65.507 Bytes = 65.535 - 8 Bytes UDP-Header - 20 Bytes IP-Header); dies gilt im Allgemeinen für Loopback-Schnittstellen, aber solche langen Datagramm-Nachrichten sind für die meisten Hosts und Netzwerke unpraktisch.
- Die `MTU` ist die größte Größe, die eine bestimmte Link-Layer-Technologie für Datagramm-Nachrichten unterstützen kann. Für jeden Link schreibt IPv4 eine minimale `MTU` von 68 Oktetten vor, während die empfohlene `MTU` für IPv4 576 beträgt (typischerweise als `MTU` für Wählverbindungen empfohlen), unabhängig davon, ob sie vollständig oder in Fragmenten ankommen. Für IPv6 beträgt die minimale `MTU` 1280 Oktette. Die obligatorische Mindestgröße des Fragment-Reassemblierungspuffers beträgt jedoch 1500 Oktette. Der Wert von 68 Oktetten ist sehr klein, da die meisten aktuellen Link-Layer-Technologien, wie Ethernet, eine minimale `MTU` von 1500 haben.

Es ist unmöglich, die MTU jedes Links, über den ein Paket möglicherweise übertragen wird, im Voraus zu kennen. Das Senden eines Datagramms, das größer als die `MTU` des Empfängers ist, funktioniert nicht, da das Paket stillschweigend verworfen wird, ohne die Quelle darüber zu informieren, dass die Daten ihren beabsichtigten Empfänger nicht erreicht haben.

### `socket.setBroadcast(flag)` {#socketsetbroadcastflag}

**Hinzugefügt in: v0.6.9**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Setzt oder löscht die Socket-Option `SO_BROADCAST`. Wenn auf `true` gesetzt, können UDP-Pakete an die Broadcast-Adresse einer lokalen Schnittstelle gesendet werden.

Diese Methode wirft `EBADF`, wenn sie auf einem ungebundenen Socket aufgerufen wird.

### `socket.setMulticastInterface(multicastInterface)` {#socketsetmulticastinterfacemulticastinterface}

**Hinzugefügt in: v8.6.0**

- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

*Alle Bezugnahmen auf Scope in diesem Abschnitt beziehen sich auf
<a href="https://en.wikipedia.org/wiki/IPv6_address#Scoped_literal_IPv6_addresses">IPv6 Zone Indexes</a>, die durch <a href="https://tools.ietf.org/html/rfc4007">RFC 4007</a> definiert werden. In String-Form wird eine IP
mit einem Scope-Index als <code>'IP%scope'</code> geschrieben, wobei Scope ein Schnittstellenname
oder eine Schnittstellennummer ist.*

Setzt die standardmäßige ausgehende Multicast-Schnittstelle des Sockets auf eine ausgewählte Schnittstelle oder zurück auf die System-Schnittstellenauswahl. Die `multicastInterface` muss eine gültige String-Repräsentation einer IP aus der Familie des Sockets sein.

Für IPv4-Sockets sollte dies die IP sein, die für die gewünschte physische Schnittstelle konfiguriert ist. Alle an Multicast auf dem Socket gesendeten Pakete werden über die Schnittstelle gesendet, die durch die letzte erfolgreiche Verwendung dieses Aufrufs bestimmt wurde.

Für IPv6-Sockets sollte `multicastInterface` einen Scope enthalten, um die Schnittstelle wie in den folgenden Beispielen anzugeben. In IPv6 können einzelne `send`-Aufrufe auch expliziten Scope in Adressen verwenden, so dass nur Pakete, die an eine Multicast-Adresse gesendet werden, ohne einen expliziten Scope anzugeben, von der letzten erfolgreichen Verwendung dieses Aufrufs betroffen sind.

Diese Methode wirft `EBADF`, wenn sie auf einem ungebundenen Socket aufgerufen wird.


#### Beispiel: IPv6 ausgehende Multicast-Schnittstelle {#example-ipv6-outgoing-multicast-interface}

Auf den meisten Systemen, wo das Scope-Format den Schnittstellennamen verwendet:

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%eth1');
});
```
Unter Windows, wo das Scope-Format eine Schnittstellennummer verwendet:

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%2');
});
```
#### Beispiel: IPv4 ausgehende Multicast-Schnittstelle {#example-ipv4-outgoing-multicast-interface}

Alle Systeme verwenden eine IP des Hosts auf der gewünschten physischen Schnittstelle:

```js [ESM]
const socket = dgram.createSocket('udp4');

socket.bind(1234, () => {
  socket.setMulticastInterface('10.0.0.2');
});
```
#### Aufrufergebnisse {#call-results}

Ein Aufruf auf einem Socket, der nicht bereit zum Senden oder nicht mehr offen ist, kann einen *Not running* [`Error`](/de/nodejs/api/errors#class-error) auslösen.

Wenn `multicastInterface` nicht in eine IP geparst werden kann, wird ein *EINVAL* [`System Error`](/de/nodejs/api/errors#class-systemerror) ausgelöst.

Unter IPv4 wird, wenn `multicastInterface` eine gültige Adresse ist, aber keiner Schnittstelle entspricht, oder wenn die Adresse nicht der Familie entspricht, ein [`System Error`](/de/nodejs/api/errors#class-systemerror) wie `EADDRNOTAVAIL` oder `EPROTONOSUP` ausgelöst.

Unter IPv6 führen die meisten Fehler bei der Angabe oder dem Weglassen des Scope dazu, dass der Socket weiterhin die Standard-Schnittstellenauswahl des Systems verwendet (oder zu dieser zurückkehrt).

Die ANY-Adresse der Adressfamilie eines Sockets (IPv4 `'0.0.0.0'` oder IPv6 `'::'`) kann verwendet werden, um die Kontrolle über die Standard-Ausgangsschnittstelle des Sockets für zukünftige Multicast-Pakete an das System zurückzugeben.

### `socket.setMulticastLoopback(flag)` {#socketsetmulticastloopbackflag}

**Hinzugefügt in: v0.3.8**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Setzt oder löscht die Socket-Option `IP_MULTICAST_LOOP`. Wenn auf `true` gesetzt, werden Multicast-Pakete auch auf der lokalen Schnittstelle empfangen.

Diese Methode wirft `EBADF`, wenn sie auf einem ungebundenen Socket aufgerufen wird.

### `socket.setMulticastTTL(ttl)` {#socketsetmulticastttlttl}

**Hinzugefügt in: v0.3.8**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Setzt die Socket-Option `IP_MULTICAST_TTL`. Während TTL im Allgemeinen für "Time to Live" steht, gibt sie in diesem Kontext die Anzahl der IP-Hops an, die ein Paket passieren darf, insbesondere für Multicast-Traffic. Jeder Router oder Gateway, der ein Paket weiterleitet, verringert die TTL. Wenn die TTL von einem Router auf 0 verringert wird, wird sie nicht weitergeleitet.

Das `ttl`-Argument kann zwischen 0 und 255 liegen. Der Standardwert auf den meisten Systemen ist `1`.

Diese Methode wirft `EBADF`, wenn sie auf einem ungebundenen Socket aufgerufen wird.


### `socket.setRecvBufferSize(size)` {#socketsetrecvbuffersizesize}

**Hinzugefügt in: v8.7.0**

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Setzt die Socket-Option `SO_RCVBUF`. Setzt den maximalen Socket-Empfangspuffer in Bytes.

Diese Methode wirft [`ERR_SOCKET_BUFFER_SIZE`](/de/nodejs/api/errors#err_socket_buffer_size), wenn sie auf einem ungebundenen Socket aufgerufen wird.

### `socket.setSendBufferSize(size)` {#socketsetsendbuffersizesize}

**Hinzugefügt in: v8.7.0**

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Setzt die Socket-Option `SO_SNDBUF`. Setzt den maximalen Socket-Sendepuffer in Bytes.

Diese Methode wirft [`ERR_SOCKET_BUFFER_SIZE`](/de/nodejs/api/errors#err_socket_buffer_size), wenn sie auf einem ungebundenen Socket aufgerufen wird.

### `socket.setTTL(ttl)` {#socketsetttlttl}

**Hinzugefügt in: v0.1.101**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Setzt die Socket-Option `IP_TTL`. Während TTL im Allgemeinen für "Time to Live" steht, gibt es in diesem Kontext die Anzahl der IP-Hops an, die ein Paket durchlaufen darf. Jeder Router oder Gateway, der ein Paket weiterleitet, dekrementiert die TTL. Wenn die TTL von einem Router auf 0 dekrementiert wird, wird sie nicht weitergeleitet. Das Ändern von TTL-Werten wird typischerweise für Netzwerk-Probes oder beim Multicasting verwendet.

Das `ttl`-Argument kann zwischen 1 und 255 liegen. Der Standardwert auf den meisten Systemen ist 64.

Diese Methode wirft `EBADF`, wenn sie auf einem ungebundenen Socket aufgerufen wird.

### `socket.unref()` {#socketunref}

**Hinzugefügt in: v0.9.1**

- Gibt zurück: [\<dgram.Socket\>](/de/nodejs/api/dgram#class-dgramsocket)

Standardmäßig führt das Binden eines Sockets dazu, dass der Node.js-Prozess am Beenden gehindert wird, solange der Socket geöffnet ist. Die Methode `socket.unref()` kann verwendet werden, um den Socket von der Referenzzählung auszuschließen, die den Node.js-Prozess aktiv hält, sodass der Prozess auch dann beendet werden kann, wenn der Socket noch abhört.

Das mehrmalige Aufrufen von `socket.unref()` hat keine zusätzlichen Auswirkungen.

Die Methode `socket.unref()` gibt eine Referenz auf den Socket zurück, sodass Aufrufe verkettet werden können.


## `node:dgram`-Modulfunktionen {#nodedgram-module-functions}

### `dgram.createSocket(options[, callback])` {#dgramcreatesocketoptions-callback}


::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v23.1.0 | Die Option `reusePort` wird unterstützt. |
| v15.8.0 | Unterstützung für AbortSignal wurde hinzugefügt. |
| v11.4.0 | Die Option `ipv6Only` wird unterstützt. |
| v8.7.0 | Die Optionen `recvBufferSize` und `sendBufferSize` werden jetzt unterstützt. |
| v8.6.0 | Die Option `lookup` wird unterstützt. |
| v0.11.13 | Hinzugefügt in: v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Verfügbare Optionen sind:
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Familie des Sockets. Muss entweder `'udp4'` oder `'udp6'` sein. Erforderlich.
    - `reuseAddr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird [`socket.bind()`](/de/nodejs/api/dgram#socketbindport-address-callback) die Adresse wiederverwenden, selbst wenn ein anderer Prozess bereits einen Socket daran gebunden hat, aber nur ein Socket kann die Daten empfangen. **Standard:** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird [`socket.bind()`](/de/nodejs/api/dgram#socketbindport-address-callback) den Port wiederverwenden, selbst wenn ein anderer Prozess bereits einen Socket daran gebunden hat. Eingehende Datagramme werden an abhörende Sockets verteilt. Die Option ist nur auf einigen Plattformen verfügbar, wie z. B. Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 und AIX 7.2.5+. Auf nicht unterstützten Plattformen wirft diese Option einen Fehler, wenn der Socket gebunden wird. **Standard:** `false`.
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Das Setzen von `ipv6Only` auf `true` deaktiviert die Dual-Stack-Unterstützung, d. h. das Binden an die Adresse `::` bewirkt nicht, dass `0.0.0.0` gebunden wird. **Standard:** `false`.
    - `recvBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt den `SO_RCVBUF`-Socketwert.
    - `sendBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt den `SO_SNDBUF`-Socketwert.
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Benutzerdefinierte Lookup-Funktion. **Standard:** [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback).
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ein AbortSignal, das zum Schließen eines Sockets verwendet werden kann.
    - `receiveBlockList` [\<net.BlockList\>](/de/nodejs/api/net#class-netblocklist) `receiveBlockList` kann verwendet werden, um eingehende Datagramme an bestimmte IP-Adressen, IP-Bereiche oder IP-Subnetze zu verwerfen. Dies funktioniert nicht, wenn sich der Server hinter einem Reverse-Proxy, NAT usw. befindet, da die Adresse, die mit der Sperrliste verglichen wird, die Adresse des Proxys ist oder die von der NAT angegebene.
    - `sendBlockList` [\<net.BlockList\>](/de/nodejs/api/net#class-netblocklist) `sendBlockList` kann verwendet werden, um den ausgehenden Zugriff auf bestimmte IP-Adressen, IP-Bereiche oder IP-Subnetze zu deaktivieren.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Als Listener für `'message'`-Ereignisse angehängt. Optional.
- Returns: [\<dgram.Socket\>](/de/nodejs/api/dgram#class-dgramsocket)

Erstellt ein `dgram.Socket`-Objekt. Sobald der Socket erstellt wurde, weist der Aufruf von [`socket.bind()`](/de/nodejs/api/dgram#socketbindport-address-callback) den Socket an, mit dem Abhören von Datagrammnachrichten zu beginnen. Wenn `address` und `port` nicht an [`socket.bind()`](/de/nodejs/api/dgram#socketbindport-address-callback) übergeben werden, bindet die Methode den Socket an die "Alle Schnittstellen"-Adresse an einem zufälligen Port (sie macht das Richtige sowohl für `udp4`- als auch für `udp6`-Sockets). Die gebundene Adresse und der Port können mit [`socket.address().address`](/de/nodejs/api/dgram#socketaddress) und [`socket.address().port`](/de/nodejs/api/dgram#socketaddress) abgerufen werden.

Wenn die Option `signal` aktiviert ist, ist das Aufrufen von `.abort()` für den entsprechenden `AbortController` ähnlich dem Aufrufen von `.close()` für den Socket:

```js [ESM]
const controller = new AbortController();
const { signal } = controller;
const server = dgram.createSocket({ type: 'udp4', signal });
server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});
// Später, wenn Sie den Server schließen möchten.
controller.abort();
```

### `dgram.createSocket(type[, callback])` {#dgramcreatesockettype-callback}

**Hinzugefügt in: v0.1.99**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Entweder `'udp4'` oder `'udp6'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird als Listener an `'message'`-Ereignisse angehängt.
- Rückgabe: [\<dgram.Socket\>](/de/nodejs/api/dgram#class-dgramsocket)

Erstellt ein `dgram.Socket`-Objekt des angegebenen `type`.

Sobald der Socket erstellt wurde, weist der Aufruf von [`socket.bind()`](/de/nodejs/api/dgram#socketbindport-address-callback) den Socket an, mit dem Lauschen auf Datagramm-Nachrichten zu beginnen. Wenn `address` und `port` nicht an [`socket.bind()`](/de/nodejs/api/dgram#socketbindport-address-callback) übergeben werden, bindet die Methode den Socket an die "Alle Schnittstellen"-Adresse an einem zufälligen Port (es macht das Richtige für sowohl `udp4`- als auch `udp6`-Sockets). Die gebundene Adresse und der Port können mithilfe von [`socket.address().address`](/de/nodejs/api/dgram#socketaddress) und [`socket.address().port`](/de/nodejs/api/dgram#socketaddress) abgerufen werden.

