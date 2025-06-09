---
title: Node.js Dokumentation - Netzwerk
description: Das 'net'-Modul in Node.js bietet eine asynchrone Netzwerk-API zum Erstellen von stream-basierten TCP- oder IPC-Servern und -Clients. Es umfasst Methoden zum Erstellen von Verbindungen, Servern und zur Verwaltung von Socket-Operationen.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Netzwerk | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das 'net'-Modul in Node.js bietet eine asynchrone Netzwerk-API zum Erstellen von stream-basierten TCP- oder IPC-Servern und -Clients. Es umfasst Methoden zum Erstellen von Verbindungen, Servern und zur Verwaltung von Socket-Operationen.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Netzwerk | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das 'net'-Modul in Node.js bietet eine asynchrone Netzwerk-API zum Erstellen von stream-basierten TCP- oder IPC-Servern und -Clients. Es umfasst Methoden zum Erstellen von Verbindungen, Servern und zur Verwaltung von Socket-Operationen.
---


# Net {#net}

::: tip [Stable: 2 - Stabil]
[Stable: 2](/de/nodejs/api/documentation#stability-index) [Stability: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Source Code:** [lib/net.js](https://github.com/nodejs/node/blob/v23.5.0/lib/net.js)

Das Modul `node:net` bietet eine asynchrone Netzwerk-API zum Erstellen von stream-basierten TCP- oder [IPC](/de/nodejs/api/net#ipc-support)-Servern ([`net.createServer()`](/de/nodejs/api/net#netcreateserveroptions-connectionlistener)) und Clients ([`net.createConnection()`](/de/nodejs/api/net#netcreateconnection)).

Es kann wie folgt aufgerufen werden:

::: code-group
```js [ESM]
import net from 'node:net';
```

```js [CJS]
const net = require('node:net');
```
:::

## IPC-Unterstützung {#ipc-support}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.8.0 | Unterstützung für die Bindung an einen abstrakten Unix Domain Socket Pfad wie `\0abstract`. Wir können '\0' für Node.js `\< v20.4.0` binden. |
:::

Das Modul `node:net` unterstützt IPC mit Named Pipes unter Windows und Unix Domain Sockets auf anderen Betriebssystemen.

### Identifizieren von Pfaden für IPC-Verbindungen {#identifying-paths-for-ipc-connections}

[`net.connect()`](/de/nodejs/api/net#netconnect), [`net.createConnection()`](/de/nodejs/api/net#netcreateconnection), [`server.listen()`](/de/nodejs/api/net#serverlisten) und [`socket.connect()`](/de/nodejs/api/net#socketconnect) benötigen einen `path`-Parameter, um IPC-Endpunkte zu identifizieren.

Unter Unix wird die lokale Domain auch als Unix-Domain bezeichnet. Der Pfad ist ein Dateisystem-Pfadname. Es wird ein Fehler ausgegeben, wenn die Länge des Pfadnamens größer als die Länge von `sizeof(sockaddr_un.sun_path)` ist. Typische Werte sind 107 Byte unter Linux und 103 Byte unter macOS. Wenn eine Node.js-API-Abstraktion den Unix Domain Socket erstellt, wird auch der Unix Domain Socket entlinkt. Zum Beispiel kann [`net.createServer()`](/de/nodejs/api/net#netcreateserveroptions-connectionlistener) einen Unix Domain Socket erstellen und [`server.close()`](/de/nodejs/api/net#serverclosecallback) wird ihn entlinken. Wenn jedoch ein Benutzer den Unix Domain Socket außerhalb dieser Abstraktionen erstellt, muss der Benutzer ihn entfernen. Das Gleiche gilt, wenn eine Node.js-API einen Unix Domain Socket erstellt, das Programm dann aber abstürzt. Kurz gesagt, ein Unix Domain Socket ist im Dateisystem sichtbar und bleibt so lange bestehen, bis er entlinkt wird. Unter Linux können Sie einen abstrakten Unix-Socket verwenden, indem Sie `\0` am Anfang des Pfads hinzufügen, z. B. `\0abstract`. Der Pfad zum abstrakten Unix-Socket ist im Dateisystem nicht sichtbar und verschwindet automatisch, wenn alle offenen Referenzen zum Socket geschlossen werden.

Unter Windows wird die lokale Domain mit einer Named Pipe implementiert. Der Pfad *muss* auf einen Eintrag in `\\?\pipe\` oder `\\.\pipe\` verweisen. Alle Zeichen sind zulässig, aber letztere können Pipe-Namen verarbeiten, z. B. das Auflösen von `..`-Sequenzen. Trotz des Aussehens ist der Pipe-Namespace flach. Pipes bleiben *nicht* bestehen. Sie werden entfernt, wenn die letzte Referenz auf sie geschlossen wird. Im Gegensatz zu Unix Domain Sockets schließt und entfernt Windows die Pipe, wenn der besitzende Prozess beendet wird.

JavaScript-String-Escaping erfordert, dass Pfade mit zusätzlichen Backslash-Escapings angegeben werden, wie z. B.:

```js [ESM]
net.createServer().listen(
  path.join('\\\\?\\pipe', process.cwd(), 'myctl'));
```

## Klasse: `net.BlockList` {#class-netblocklist}

**Hinzugefügt in: v15.0.0, v14.18.0**

Das `BlockList`-Objekt kann mit einigen Netzwerk-APIs verwendet werden, um Regeln zum Deaktivieren des eingehenden oder ausgehenden Zugriffs auf bestimmte IP-Adressen, IP-Bereiche oder IP-Subnetze festzulegen.

### `blockList.addAddress(address[, type])` {#blocklistaddaddressaddress-type}

**Hinzugefügt in: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/de/nodejs/api/net#class-netsocketaddress) Eine IPv4- oder IPv6-Adresse.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Entweder `'ipv4'` oder `'ipv6'`. **Standard:** `'ipv4'`.

Fügt eine Regel hinzu, um die angegebene IP-Adresse zu blockieren.

### `blockList.addRange(start, end[, type])` {#blocklistaddrangestart-end-type}

**Hinzugefügt in: v15.0.0, v14.18.0**

- `start` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/de/nodejs/api/net#class-netsocketaddress) Die anfängliche IPv4- oder IPv6-Adresse im Bereich.
- `end` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/de/nodejs/api/net#class-netsocketaddress) Die endende IPv4- oder IPv6-Adresse im Bereich.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Entweder `'ipv4'` oder `'ipv6'`. **Standard:** `'ipv4'`.

Fügt eine Regel hinzu, um einen Bereich von IP-Adressen von `start` (einschließlich) bis `end` (einschließlich) zu blockieren.

### `blockList.addSubnet(net, prefix[, type])` {#blocklistaddsubnetnet-prefix-type}

**Hinzugefügt in: v15.0.0, v14.18.0**

- `net` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/de/nodejs/api/net#class-netsocketaddress) Die Netzwerk-IPv4- oder IPv6-Adresse.
- `prefix` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der CIDR-Präfixbits. Für IPv4 muss dies ein Wert zwischen `0` und `32` sein. Für IPv6 muss dies zwischen `0` und `128` liegen.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Entweder `'ipv4'` oder `'ipv6'`. **Standard:** `'ipv4'`.

Fügt eine Regel hinzu, um einen Bereich von IP-Adressen zu blockieren, der als Subnetzmaske angegeben ist.


### `blockList.check(address[, type])` {#blocklistcheckaddress-type}

**Hinzugefügt in: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/de/nodejs/api/net#class-netsocketaddress) Die zu prüfende IP-Adresse
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Entweder `'ipv4'` oder `'ipv6'`. **Standard:** `'ipv4'`.
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn die angegebene IP-Adresse mit einer der zur `BlockList` hinzugefügten Regeln übereinstimmt.

```js [ESM]
const blockList = new net.BlockList();
blockList.addAddress('123.123.123.123');
blockList.addRange('10.0.0.1', '10.0.0.10');
blockList.addSubnet('8592:757c:efae:4e45::', 64, 'ipv6');

console.log(blockList.check('123.123.123.123'));  // Prints: true
console.log(blockList.check('10.0.0.3'));  // Prints: true
console.log(blockList.check('222.111.111.222'));  // Prints: false

// IPv6-Notation für IPv4-Adressen funktioniert:
console.log(blockList.check('::ffff:7b7b:7b7b', 'ipv6')); // Prints: true
console.log(blockList.check('::ffff:123.123.123.123', 'ipv6')); // Prints: true
```
### `blockList.rules` {#blocklistrules}

**Hinzugefügt in: v15.0.0, v14.18.0**

- Typ: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Liste der Regeln, die der Sperrliste hinzugefügt wurden.

### `BlockList.isBlockList(value)` {#blocklistisblocklistvalue}

**Hinzugefügt in: v23.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein beliebiger JS-Wert
- Gibt `true` zurück, wenn der `value` eine `net.BlockList` ist.

## Klasse: `net.SocketAddress` {#class-netsocketaddress}

**Hinzugefügt in: v15.14.0, v14.18.0**

### `new net.SocketAddress([options])` {#new-netsocketaddressoptions}

**Hinzugefügt in: v15.14.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Netzwerkadresse entweder als IPv4- oder IPv6-String. **Standard**: `'127.0.0.1'`, wenn `family` `'ipv4'` ist; `'::'`, wenn `family` `'ipv6'` ist.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Entweder `'ipv4'` oder `'ipv6'`. **Standard**: `'ipv4'`.
    - `flowlabel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein IPv6 Flow-Label, das nur verwendet wird, wenn `family` `'ipv6'` ist.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein IP-Port.


### `socketaddress.address` {#socketaddressaddress}

**Hinzugefügt in: v15.14.0, v14.18.0**

- Typ [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### `socketaddress.family` {#socketaddressfamily}

**Hinzugefügt in: v15.14.0, v14.18.0**

- Typ [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Entweder `'ipv4'` oder `'ipv6'`.

### `socketaddress.flowlabel` {#socketaddressflowlabel}

**Hinzugefügt in: v15.14.0, v14.18.0**

- Typ [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `socketaddress.port` {#socketaddressport}

**Hinzugefügt in: v15.14.0, v14.18.0**

- Typ [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `SocketAddress.parse(input)` {#socketaddressparseinput}

**Hinzugefügt in: v23.4.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine Eingabezeichenfolge, die eine IP-Adresse und einen optionalen Port enthält, z. B. `123.1.2.3:1234` oder `[1::1]:1234`.
- Rückgabe: [\<net.SocketAddress\>](/de/nodejs/api/net#class-netsocketaddress) Gibt ein `SocketAddress` zurück, wenn die Analyse erfolgreich war. Andernfalls wird `undefined` zurückgegeben.

## Klasse: `net.Server` {#class-netserver}

**Hinzugefügt in: v0.1.90**

- Erweitert: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Diese Klasse wird verwendet, um einen TCP- oder [IPC](/de/nodejs/api/net#ipc-support)-Server zu erstellen.

### `new net.Server([options][, connectionListener])` {#new-netserveroptions-connectionlistener}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Siehe [`net.createServer([options][, connectionListener])`](/de/nodejs/api/net#netcreateserveroptions-connectionlistener).
- `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird automatisch als Listener für das [`'connection'`-Ereignis](/de/nodejs/api/net#event-connection) gesetzt.
- Rückgabe: [\<net.Server\>](/de/nodejs/api/net#class-netserver)

`net.Server` ist ein [`EventEmitter`](/de/nodejs/api/events#class-eventemitter) mit den folgenden Ereignissen:

### Ereignis: `'close'` {#event-close}

**Hinzugefügt in: v0.5.0**

Wird ausgelöst, wenn der Server schließt. Wenn Verbindungen bestehen, wird dieses Ereignis erst ausgelöst, wenn alle Verbindungen beendet sind.


### Ereignis: `'connection'` {#event-connection}

**Hinzugefügt in: v0.1.90**

- [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Das Verbindungsobjekt

Wird ausgelöst, wenn eine neue Verbindung hergestellt wird. `socket` ist eine Instanz von `net.Socket`.

### Ereignis: `'error'` {#event-error}

**Hinzugefügt in: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Wird ausgelöst, wenn ein Fehler auftritt. Im Gegensatz zu [`net.Socket`](/de/nodejs/api/net#class-netsocket) wird das [`'close'`](/de/nodejs/api/net#event-close)-Ereignis **nicht** direkt nach diesem Ereignis ausgelöst, es sei denn, [`server.close()`](/de/nodejs/api/net#serverclosecallback) wird manuell aufgerufen. Siehe das Beispiel in der Diskussion von [`server.listen()`](/de/nodejs/api/net#serverlisten).

### Ereignis: `'listening'` {#event-listening}

**Hinzugefügt in: v0.1.90**

Wird ausgelöst, wenn der Server nach dem Aufruf von [`server.listen()`](/de/nodejs/api/net#serverlisten) gebunden wurde.

### Ereignis: `'drop'` {#event-drop}

**Hinzugefügt in: v18.6.0, v16.17.0**

Wenn die Anzahl der Verbindungen den Schwellenwert von `server.maxConnections` erreicht, verwirft der Server neue Verbindungen und löst stattdessen das Ereignis `'drop'` aus. Wenn es sich um einen TCP-Server handelt, ist das Argument wie folgt, andernfalls ist das Argument `undefined`.

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das Argument, das an den Event-Listener übergeben wird.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lokale Adresse.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lokaler Port.
    - `localFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lokale Familie.
    - `remoteAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Remote-Adresse.
    - `remotePort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Remote-Port.
    - `remoteFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Remote-IP-Familie. `'IPv4'` oder `'IPv6'`.


### `server.address()` {#serveraddress}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.4.0 | Die Eigenschaft `family` gibt jetzt einen String anstelle einer Zahl zurück. |
| v18.0.0 | Die Eigenschaft `family` gibt jetzt eine Zahl anstelle eines Strings zurück. |
| v0.1.90 | Hinzugefügt in: v0.1.90 |
:::

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Gibt die gebundene `address`, den `family`-Namen der Adresse und den `port` des Servers zurück, wie vom Betriebssystem gemeldet, wenn auf einem IP-Socket gelauscht wird (nützlich, um herauszufinden, welcher Port zugewiesen wurde, wenn eine vom Betriebssystem zugewiesene Adresse abgerufen wird): `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.

Für einen Server, der auf einer Pipe oder einem Unix-Domain-Socket lauscht, wird der Name als String zurückgegeben.

```js [ESM]
const server = net.createServer((socket) => {
  socket.end('goodbye\n');
}).on('error', (err) => {
  // Fehler hier behandeln.
  throw err;
});

// Einen beliebigen, unbenutzten Port nehmen.
server.listen(() => {
  console.log('opened server on', server.address());
});
```

`server.address()` gibt `null` zurück, bevor das Ereignis `'listening'` ausgegeben wurde oder nach dem Aufruf von `server.close()`.

### `server.close([callback])` {#serverclosecallback}

**Hinzugefügt in: v0.1.90**

- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, wenn der Server geschlossen wird.
- Gibt zurück: [\<net.Server\>](/de/nodejs/api/net#class-netserver)

Hindert den Server daran, neue Verbindungen anzunehmen, und behält bestehende Verbindungen bei. Diese Funktion ist asynchron, der Server wird endgültig geschlossen, wenn alle Verbindungen beendet sind und der Server ein [`'close'`-Ereignis](/de/nodejs/api/net#event-close) ausgibt. Der optionale `callback` wird aufgerufen, sobald das `'close'`-Ereignis eintritt. Im Gegensatz zu diesem Ereignis wird es mit einem `Error` als einzigem Argument aufgerufen, wenn der Server beim Schließen nicht geöffnet war.


### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Hinzugefügt in: v20.5.0, v18.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Ruft [`server.close()`](/de/nodejs/api/net#serverclosecallback) auf und gibt ein Promise zurück, das erfüllt wird, wenn der Server geschlossen wurde.

### `server.getConnections(callback)` {#servergetconnectionscallback}

**Hinzugefügt in: v0.9.7**

- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<net.Server\>](/de/nodejs/api/net#class-netserver)

Asynchron die Anzahl der gleichzeitigen Verbindungen auf dem Server abrufen. Funktioniert, wenn Sockets an Forks gesendet wurden.

Callback sollte zwei Argumente `err` und `count` entgegennehmen.

### `server.listen()` {#serverlisten}

Startet einen Server, der auf Verbindungen wartet. Ein `net.Server` kann ein TCP- oder ein [IPC](/de/nodejs/api/net#ipc-support)-Server sein, je nachdem, worauf er wartet.

Mögliche Signaturen:

- [`server.listen(handle[, backlog][, callback])`](/de/nodejs/api/net#serverlistenhandle-backlog-callback)
- [`server.listen(options[, callback])`](/de/nodejs/api/net#serverlistenoptions-callback)
- [`server.listen(path[, backlog][, callback])`](/de/nodejs/api/net#serverlistenpath-backlog-callback) für [IPC](/de/nodejs/api/net#ipc-support)-Server
- [`server.listen([port[, host[, backlog]]][, callback])`](/de/nodejs/api/net#serverlistenport-host-backlog-callback) für TCP-Server

Diese Funktion ist asynchron. Wenn der Server beginnt, auf Anfragen zu warten, wird das [`'listening'`-Ereignis](/de/nodejs/api/net#event-listening) ausgelöst. Der letzte Parameter `callback` wird als Listener für das [`'listening'`-Ereignis](/de/nodejs/api/net#event-listening) hinzugefügt.

Alle `listen()`-Methoden können einen `backlog`-Parameter entgegennehmen, um die maximale Länge der Warteschlange ausstehender Verbindungen anzugeben. Die tatsächliche Länge wird vom Betriebssystem über Sysctl-Einstellungen wie `tcp_max_syn_backlog` und `somaxconn` unter Linux bestimmt. Der Standardwert dieses Parameters ist 511 (nicht 512).

Alle [`net.Socket`](/de/nodejs/api/net#class-netsocket) werden auf `SO_REUSEADDR` gesetzt (siehe [`socket(7)`](https://man7.org/linux/man-pages/man7/socket.7) für Details).

Die `server.listen()`-Methode kann erneut aufgerufen werden, wenn und nur wenn während des ersten `server.listen()`-Aufrufs ein Fehler aufgetreten ist oder `server.close()` aufgerufen wurde. Andernfalls wird ein `ERR_SERVER_ALREADY_LISTEN`-Fehler ausgelöst.

Einer der häufigsten Fehler, der beim Lauschen auftritt, ist `EADDRINUSE`. Dies geschieht, wenn bereits ein anderer Server auf dem angeforderten `port`/`path`/`handle` wartet. Eine Möglichkeit, dies zu behandeln, besteht darin, es nach einer bestimmten Zeit erneut zu versuchen:

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

**Hinzugefügt in: v0.5.10**

- `handle` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Häufiger Parameter der Funktionen [`server.listen()`](/de/nodejs/api/net#serverlisten)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<net.Server\>](/de/nodejs/api/net#class-netserver)

Startet einen Server, der auf Verbindungen über ein gegebenes `handle` wartet, das bereits an einen Port, einen Unix-Domain-Socket oder eine Windows Named Pipe gebunden wurde.

Das `handle`-Objekt kann entweder ein Server, ein Socket (alles mit einem zugrunde liegenden `_handle`-Element) oder ein Objekt mit einem `fd`-Element sein, das ein gültiger Dateideskriptor ist.

Das Lauschen auf einen Dateideskriptor wird unter Windows nicht unterstützt.

#### `server.listen(options[, callback])` {#serverlistenoptions-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.1.0 | Die Option `reusePort` wird unterstützt. |
| v15.6.0 | AbortSignal-Unterstützung wurde hinzugefügt. |
| v11.4.0 | Die Option `ipv6Only` wird unterstützt. |
| v0.11.14 | Hinzugefügt in: v0.11.14 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Erforderlich. Unterstützt die folgenden Eigenschaften:
    - `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Häufiger Parameter der Funktionen [`server.listen()`](/de/nodejs/api/net#serverlisten).
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `false`
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Für TCP-Server deaktiviert die Einstellung von `ipv6Only` auf `true` die Dual-Stack-Unterstützung, d.h. die Bindung an Host `::` führt nicht dazu, dass `0.0.0.0` gebunden wird. **Standard:** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Für TCP-Server ermöglicht die Einstellung von `reusePort` auf `true`, dass mehrere Sockets auf demselben Host sich an denselben Port binden. Eingehende Verbindungen werden vom Betriebssystem an abhörende Sockets verteilt. Diese Option ist nur auf einigen Plattformen verfügbar, z. B. Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 und AIX 7.2.5+. **Standard:** `false`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wird ignoriert, wenn `port` angegeben ist. Siehe [Pfade für IPC-Verbindungen identifizieren](/de/nodejs/api/net#identifying-paths-for-ipc-connections).
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `readableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Für IPC-Server macht die Pipe für alle Benutzer lesbar. **Standard:** `false`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ein AbortSignal, das verwendet werden kann, um einen lauschenden Server zu schließen.
    - `writableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Für IPC-Server macht die Pipe für alle Benutzer beschreibbar. **Standard:** `false`.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funktionen.
- Gibt zurück: [\<net.Server\>](/de/nodejs/api/net#class-netserver)

Wenn `port` angegeben ist, verhält es sich genauso wie [`server.listen([port[, host[, backlog]]][, callback])`](/de/nodejs/api/net#serverlistenport-host-backlog-callback). Andernfalls, wenn `path` angegeben ist, verhält es sich genauso wie [`server.listen(path[, backlog][, callback])`](/de/nodejs/api/net#serverlistenpath-backlog-callback). Wenn keine von beiden angegeben ist, wird ein Fehler ausgelöst.

Wenn `exclusive` `false` (Standard) ist, verwenden Cluster-Worker dasselbe zugrunde liegende Handle, wodurch die Verbindungsverarbeitungsaufgaben gemeinsam genutzt werden können. Wenn `exclusive` `true` ist, wird das Handle nicht freigegeben, und der Versuch einer Portfreigabe führt zu einem Fehler. Ein Beispiel, das auf einem exklusiven Port lauscht, ist unten dargestellt.

```js [ESM]
server.listen({
  host: 'localhost',
  port: 80,
  exclusive: true,
});
```
Wenn `exclusive` `true` ist und das zugrunde liegende Handle freigegeben ist, ist es möglich, dass mehrere Worker ein Handle mit unterschiedlichen Backlogs abfragen. In diesem Fall wird das erste `backlog` verwendet, das an den Master-Prozess übergeben wird.

Das Starten eines IPC-Servers als Root kann dazu führen, dass der Serverpfad für nicht privilegierte Benutzer unzugänglich ist. Die Verwendung von `readableAll` und `writableAll` macht den Server für alle Benutzer zugänglich.

Wenn die Option `signal` aktiviert ist, ist der Aufruf von `.abort()` auf dem entsprechenden `AbortController` ähnlich dem Aufruf von `.close()` auf dem Server:

```js [ESM]
const controller = new AbortController();
server.listen({
  host: 'localhost',
  port: 80,
  signal: controller.signal,
});
// Später, wenn Sie den Server schließen möchten.
controller.abort();
```

#### `server.listen(path[, backlog][, callback])` {#serverlistenpath-backlog-callback}

**Hinzugefügt in: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Pfad, an dem der Server auf Verbindungen hören soll. Siehe [Identifizieren von Pfaden für IPC-Verbindungen](/de/nodejs/api/net#identifying-paths-for-ipc-connections).
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Häufig verwendeter Parameter von [`server.listen()`](/de/nodejs/api/net#serverlisten)-Funktionen.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- Gibt zurück: [\<net.Server\>](/de/nodejs/api/net#class-netserver)

Startet einen [IPC](/de/nodejs/api/net#ipc-support)-Server, der auf Verbindungen am angegebenen `path` wartet.

#### `server.listen([port[, host[, backlog]]][, callback])` {#serverlistenport-host-backlog-callback}

**Hinzugefügt in: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Häufig verwendeter Parameter von [`server.listen()`](/de/nodejs/api/net#serverlisten)-Funktionen.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- Gibt zurück: [\<net.Server\>](/de/nodejs/api/net#class-netserver)

Startet einen TCP-Server, der auf Verbindungen am angegebenen `port` und `host` wartet.

Wenn `port` ausgelassen wird oder 0 ist, weist das Betriebssystem einen beliebigen ungenutzten Port zu, der mit `server.address().port` abgerufen werden kann, nachdem das [`'listening'`](/de/nodejs/api/net#event-listening)-Ereignis ausgelöst wurde.

Wenn `host` ausgelassen wird, akzeptiert der Server Verbindungen an der [unspezifizierten IPv6-Adresse](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`), wenn IPv6 verfügbar ist, oder an der [unspezifizierten IPv4-Adresse](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`) andernfalls.

In den meisten Betriebssystemen kann das Abhören der [unspezifizierten IPv6-Adresse](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) dazu führen, dass der `net.Server` auch auf die [unspezifizierte IPv4-Adresse](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`) hört.


### `server.listening` {#serverlistening}

**Hinzugefügt in: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob der Server auf Verbindungen wartet oder nicht.

### `server.maxConnections` {#servermaxconnections}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.0.0 | Das Setzen von `maxConnections` auf `0` verwirft alle eingehenden Verbindungen. Zuvor wurde es als `Infinity` interpretiert. |
| v0.2.0 | Hinzugefügt in: v0.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Wenn die Anzahl der Verbindungen den Schwellenwert `server.maxConnections` erreicht:

Es wird nicht empfohlen, diese Option zu verwenden, sobald ein Socket mit [`child_process.fork()`](/de/nodejs/api/child_process#child_processforkmodulepath-args-options) an einen Kindprozess gesendet wurde.

### `server.dropMaxConnection` {#serverdropmaxconnection}

**Hinzugefügt in: v23.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Setzen Sie diese Eigenschaft auf `true`, um mit dem Schließen von Verbindungen zu beginnen, sobald die Anzahl der Verbindungen den Schwellenwert [`server.maxConnections`][] erreicht. Diese Einstellung ist nur im Clustermodus wirksam.

### `server.ref()` {#serverref}

**Hinzugefügt in: v0.9.1**

- Gibt zurück: [\<net.Server\>](/de/nodejs/api/net#class-netserver)

Das Gegenteil von `unref()`. Der Aufruf von `ref()` auf einem zuvor `unref`ed Server verhindert *nicht*, dass das Programm beendet wird, wenn dies der einzige verbleibende Server ist (das Standardverhalten). Wenn der Server `ref`ed ist, hat der erneute Aufruf von `ref()` keine Auswirkung.

### `server.unref()` {#serverunref}

**Hinzugefügt in: v0.9.1**

- Gibt zurück: [\<net.Server\>](/de/nodejs/api/net#class-netserver)

Der Aufruf von `unref()` auf einem Server ermöglicht es dem Programm, zu beenden, wenn dies der einzige aktive Server im Event-System ist. Wenn der Server bereits `unref`ed ist, hat der erneute Aufruf von `unref()` keine Auswirkung.

## Klasse: `net.Socket` {#class-netsocket}

**Hinzugefügt in: v0.3.4**

- Erweitert: [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Diese Klasse ist eine Abstraktion eines TCP-Sockets oder eines Streaming-[IPC](/de/nodejs/api/net#ipc-support)-Endpunkts (verwendet Named Pipes unter Windows und Unix-Domain-Sockets ansonsten). Es ist auch ein [`EventEmitter`](/de/nodejs/api/events#class-eventemitter).

Ein `net.Socket` kann vom Benutzer erstellt und direkt verwendet werden, um mit einem Server zu interagieren. Zum Beispiel wird er von [`net.createConnection()`](/de/nodejs/api/net#netcreateconnection) zurückgegeben, sodass der Benutzer ihn verwenden kann, um mit dem Server zu kommunizieren.

Er kann auch von Node.js erstellt und an den Benutzer übergeben werden, wenn eine Verbindung empfangen wird. Zum Beispiel wird er an die Listener eines [`'connection'`]-Ereignisses](/de/nodejs/api/net#event-connection) übergeben, das auf einem [`net.Server`](/de/nodejs/api/net#class-netserver) ausgelöst wird, sodass der Benutzer ihn verwenden kann, um mit dem Client zu interagieren.


### `new net.Socket([options])` {#new-netsocketoptions}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.14.0 | Unterstützung für AbortSignal wurde hinzugefügt. |
| v12.10.0 | Option `onread` hinzugefügt. |
| v0.3.4 | Hinzugefügt in: v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Verfügbare Optionen sind:
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `false` gesetzt, beendet der Socket automatisch die schreibbare Seite, wenn die lesbare Seite endet. Siehe [`net.createServer()`](/de/nodejs/api/net#netcreateserveroptions-connectionlistener) und das [`'end'`](/de/nodejs/api/net#event-end) Ereignis für Details. **Standard:** `false`.
    - `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Falls angegeben, umschließt ein bestehender Socket mit dem gegebenen Dateideskriptor, andernfalls wird ein neuer Socket erstellt.
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Falls angegeben, werden eingehende Daten in einem einzelnen `buffer` gespeichert und an den bereitgestellten `callback` übergeben, wenn Daten auf dem Socket ankommen. Dies führt dazu, dass die Streaming-Funktionalität keine Daten bereitstellt. Der Socket emittiert Ereignisse wie üblich wie `'error'`, `'end'` und `'close'`. Methoden wie `pause()` und `resume()` verhalten sich ebenfalls wie erwartet.
    - `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Entweder ein wiederverwendbarer Speicherbereich zur Speicherung eingehender Daten oder eine Funktion, die einen solchen zurückgibt.
    - `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Diese Funktion wird für jeden Chunk eingehender Daten aufgerufen. Es werden zwei Argumente an sie übergeben: die Anzahl der in `buffer` geschriebenen Bytes und eine Referenz auf `buffer`. Gib von dieser Funktion `false` zurück, um den Socket implizit zu `pause()` zu veranlassen. Diese Funktion wird im globalen Kontext ausgeführt.


    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Erlaube Lesevorgänge auf dem Socket, wenn ein `fd` übergeben wird, andernfalls ignoriert. **Standard:** `false`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ein Abort-Signal, das verwendet werden kann, um den Socket zu zerstören.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Erlaube Schreibvorgänge auf dem Socket, wenn ein `fd` übergeben wird, andernfalls ignoriert. **Standard:** `false`.


- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)

Erstellt ein neues Socket-Objekt.

Der neu erstellte Socket kann entweder ein TCP-Socket oder ein Streaming-[IPC](/de/nodejs/api/net#ipc-support)-Endpunkt sein, je nachdem, womit er sich [`connect()`](/de/nodejs/api/net#socketconnect) verbindet.


### Ereignis: `'close'` {#event-close_1}

**Hinzugefügt in: v0.1.90**

- `hadError` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn der Socket einen Übertragungsfehler hatte.

Wird ausgelöst, sobald der Socket vollständig geschlossen wurde. Das Argument `hadError` ist ein boolescher Wert, der angibt, ob der Socket aufgrund eines Übertragungsfehlers geschlossen wurde.

### Ereignis: `'connect'` {#event-connect}

**Hinzugefügt in: v0.1.90**

Wird ausgelöst, wenn eine Socketverbindung erfolgreich hergestellt wurde. Siehe [`net.createConnection()`](/de/nodejs/api/net#netcreateconnection).

### Ereignis: `'connectionAttempt'` {#event-connectionattempt}

**Hinzugefügt in: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die IP, zu der der Socket eine Verbindung aufzubauen versucht.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Port, zu dem der Socket eine Verbindung aufzubauen versucht.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Familie der IP. Dies kann `6` für IPv6 oder `4` für IPv4 sein.

Wird ausgelöst, wenn ein neuer Verbindungsversuch gestartet wird. Dies kann mehrmals ausgelöst werden, wenn der Algorithmus zur automatischen Auswahl der Familie in [`socket.connect(options)`](/de/nodejs/api/net#socketconnectoptions-connectlistener) aktiviert ist.

### Ereignis: `'connectionAttemptFailed'` {#event-connectionattemptfailed}

**Hinzugefügt in: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die IP, zu der der Socket eine Verbindung aufzubauen versuchte.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Port, zu dem der Socket eine Verbindung aufzubauen versuchte.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Familie der IP. Dies kann `6` für IPv6 oder `4` für IPv4 sein.
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Der Fehler, der mit dem Fehlschlag verbunden ist.

Wird ausgelöst, wenn ein Verbindungsversuch fehlgeschlagen ist. Dies kann mehrmals ausgelöst werden, wenn der Algorithmus zur automatischen Auswahl der Familie in [`socket.connect(options)`](/de/nodejs/api/net#socketconnectoptions-connectlistener) aktiviert ist.


### Ereignis: `'connectionAttemptTimeout'` {#event-connectionattempttimeout}

**Hinzugefügt in: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die IP, zu der der Socket versucht hat, eine Verbindung herzustellen.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Port, zu dem der Socket versucht hat, eine Verbindung herzustellen.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Familie der IP. Sie kann `6` für IPv6 oder `4` für IPv4 sein.

Wird ausgelöst, wenn ein Verbindungsversuch fehlgeschlagen ist. Dies wird nur (und möglicherweise mehrmals) ausgelöst, wenn der Familien-Autoauswahlalgorithmus in [`socket.connect(options)`](/de/nodejs/api/net#socketconnectoptions-connectlistener) aktiviert ist.

### Ereignis: `'data'` {#event-data}

**Hinzugefügt in: v0.1.90**

- [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Wird ausgelöst, wenn Daten empfangen werden. Das Argument `data` ist ein `Buffer` oder `String`. Die Codierung der Daten wird durch [`socket.setEncoding()`](/de/nodejs/api/net#socketsetencodingencoding) festgelegt.

Die Daten gehen verloren, wenn kein Listener vorhanden ist, wenn ein `Socket` ein `'data'`-Ereignis auslöst.

### Ereignis: `'drain'` {#event-drain}

**Hinzugefügt in: v0.1.90**

Wird ausgelöst, wenn der Schreibpuffer leer wird. Kann verwendet werden, um Uploads zu drosseln.

Siehe auch: die Rückgabewerte von `socket.write()`.

### Ereignis: `'end'` {#event-end}

**Hinzugefügt in: v0.1.90**

Wird ausgelöst, wenn das andere Ende des Sockets das Ende der Übertragung signalisiert und somit die lesbare Seite des Sockets beendet.

Standardmäßig (`allowHalfOpen` ist `false`) sendet der Socket ein Ende-der-Übertragung-Paket zurück und zerstört seinen Dateideskriptor, sobald er seine ausstehende Schreibwarteschlange ausgeschrieben hat. Wenn `allowHalfOpen` jedoch auf `true` gesetzt ist, wird der Socket seine beschreibbare Seite nicht automatisch [`end()`](/de/nodejs/api/net#socketenddata-encoding-callback), sodass der Benutzer beliebige Datenmengen schreiben kann. Der Benutzer muss [`end()`](/de/nodejs/api/net#socketenddata-encoding-callback) explizit aufrufen, um die Verbindung zu schließen (d. h. ein FIN-Paket zurücksenden).


### Ereignis: `'error'` {#event-error_1}

**Hinzugefügt in: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Wird ausgelöst, wenn ein Fehler auftritt. Das `'close'`-Ereignis wird direkt im Anschluss an dieses Ereignis aufgerufen.

### Ereignis: `'lookup'` {#event-lookup}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v5.10.0 | Der `host`-Parameter wird jetzt unterstützt. |
| v0.11.3 | Hinzugefügt in: v0.11.3 |
:::

Wird nach dem Auflösen des Hostnamens, aber vor dem Verbinden, ausgelöst. Nicht anwendbar auf Unix-Sockets.

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Das Fehlerobjekt. Siehe [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback).
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die IP-Adresse.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Der Adresstyp. Siehe [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Hostname.

### Ereignis: `'ready'` {#event-ready}

**Hinzugefügt in: v9.11.0**

Wird ausgelöst, wenn ein Socket bereit zur Verwendung ist.

Wird unmittelbar nach `'connect'` ausgelöst.

### Ereignis: `'timeout'` {#event-timeout}

**Hinzugefügt in: v0.1.90**

Wird ausgelöst, wenn für den Socket aufgrund von Inaktivität ein Timeout eintritt. Dies dient nur zur Benachrichtigung, dass der Socket im Leerlauf war. Der Benutzer muss die Verbindung manuell schließen.

Siehe auch: [`socket.setTimeout()`](/de/nodejs/api/net#socketsettimeouttimeout-callback).

### `socket.address()` {#socketaddress}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.4.0 | Die `family`-Eigenschaft gibt jetzt einen String anstelle einer Zahl zurück. |
| v18.0.0 | Die `family`-Eigenschaft gibt jetzt eine Zahl anstelle eines Strings zurück. |
| v0.1.90 | Hinzugefügt in: v0.1.90 |
:::

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt die gebundene `address`, den `family`-Namen der Adresse und den `port` des Sockets zurück, wie vom Betriebssystem gemeldet: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`


### `socket.autoSelectFamilyAttemptedAddresses` {#socketautoselectfamilyattemptedaddresses}

**Hinzugefügt in: v19.4.0, v18.18.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Diese Eigenschaft ist nur vorhanden, wenn der Familienauswahlalgorithmus in [`socket.connect(options)`](/de/nodejs/api/net#socketconnectoptions-connectlistener) aktiviert ist, und es handelt sich um ein Array der Adressen, die versucht wurden.

Jede Adresse ist ein String im Format `$IP:$PORT`. Wenn die Verbindung erfolgreich war, ist die letzte Adresse die, mit der der Socket derzeit verbunden ist.

### `socket.bufferSize` {#socketbuffersize}

**Hinzugefügt in: v0.3.8**

**Veraltet seit: v14.6.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`writable.writableLength`](/de/nodejs/api/stream#writablewritablelength).
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Diese Eigenschaft zeigt die Anzahl der Zeichen an, die für das Schreiben gepuffert werden. Der Puffer kann Zeichenfolgen enthalten, deren Länge nach der Kodierung noch nicht bekannt ist. Diese Zahl ist also nur eine Annäherung an die Anzahl der Bytes im Puffer.

`net.Socket` hat die Eigenschaft, dass `socket.write()` immer funktioniert. Dies soll Benutzern helfen, schnell loszulegen. Der Computer kann nicht immer mit der Datenmenge mithalten, die an einen Socket geschrieben wird. Die Netzwerkverbindung könnte einfach zu langsam sein. Node.js stellt die an einen Socket geschriebenen Daten intern in eine Warteschlange und sendet sie über die Leitung, wenn dies möglich ist.

Die Folge dieser internen Pufferung ist, dass der Speicher wachsen kann. Benutzer, bei denen eine große oder wachsende `bufferSize` auftritt, sollten versuchen, die Datenflüsse in ihrem Programm mit [`socket.pause()`](/de/nodejs/api/net#socketpause) und [`socket.resume()`](/de/nodejs/api/net#socketresume) zu "drosseln".

### `socket.bytesRead` {#socketbytesread}

**Hinzugefügt in: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Anzahl der empfangenen Bytes.


### `socket.bytesWritten` {#socketbyteswritten}

**Hinzugefügt in: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Anzahl der gesendeten Bytes.

### `socket.connect()` {#socketconnect}

Initiiert eine Verbindung auf einem gegebenen Socket.

Mögliche Signaturen:

- [`socket.connect(options[, connectListener])`](/de/nodejs/api/net#socketconnectoptions-connectlistener)
- [`socket.connect(path[, connectListener])`](/de/nodejs/api/net#socketconnectpath-connectlistener) für [IPC](/de/nodejs/api/net#ipc-support)-Verbindungen.
- [`socket.connect(port[, host][, connectListener])`](/de/nodejs/api/net#socketconnectport-host-connectlistener) für TCP-Verbindungen.
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Den Socket selbst.

Diese Funktion ist asynchron. Wenn die Verbindung hergestellt ist, wird das [`'connect'`](/de/nodejs/api/net#event-connect)-Ereignis ausgelöst. Wenn es ein Problem beim Verbinden gibt, wird anstelle eines [`'connect'`](/de/nodejs/api/net#event-connect)-Ereignisses ein [`'error'`](/de/nodejs/api/net#event-error_1)-Ereignis ausgelöst, wobei der Fehler an den [`'error'`](/de/nodejs/api/net#event-error_1)-Listener übergeben wird. Der letzte Parameter `connectListener` wird, falls angegeben, **einmal** als Listener für das [`'connect'`](/de/nodejs/api/net#event-connect)-Ereignis hinzugefügt.

Diese Funktion sollte nur verwendet werden, um einen Socket nach dem Auslösen von `'close'` wiederzuverbinden, da dies sonst zu undefiniertem Verhalten führen kann.

#### `socket.connect(options[, connectListener])` {#socketconnectoptions-connectlistener}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.4.0 | Der Standardwert für die Option autoSelectFamily kann zur Laufzeit mithilfe von `setDefaultAutoSelectFamily` oder über die Befehlszeilenoption `--enable-network-family-autoselection` geändert werden. |
| v20.0.0, v18.18.0 | Der Standardwert für die Option autoSelectFamily ist jetzt true. Das CLI-Flag `--enable-network-family-autoselection` wurde in `--network-family-autoselection` umbenannt. Der alte Name ist jetzt ein Alias, wird aber nicht empfohlen. |
| v19.3.0, v18.13.0 | Die Option `autoSelectFamily` wurde hinzugefügt. |
| v17.7.0, v16.15.0 | Die Optionen `noDelay`, `keepAlive` und `keepAliveInitialDelay` werden jetzt unterstützt. |
| v6.0.0 | Die Option `hints` hat jetzt in allen Fällen den Standardwert `0`. Zuvor wurde standardmäßig `dns.ADDRCONFIG | dns.V4MAPPED` verwendet, wenn die Option `family` fehlte. |
| v5.11.0 | Die Option `hints` wird jetzt unterstützt. |
| v0.1.90 | Hinzugefügt in: v0.1.90 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Gemeinsamer Parameter der [`socket.connect()`](/de/nodejs/api/net#socketconnect)-Methoden. Wird einmal als Listener für das [`'connect'`](/de/nodejs/api/net#event-connect)-Ereignis hinzugefügt.
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Den Socket selbst.

Initiiert eine Verbindung auf einem gegebenen Socket. Normalerweise ist diese Methode nicht erforderlich, der Socket sollte mit [`net.createConnection()`](/de/nodejs/api/net#netcreateconnection) erstellt und geöffnet werden. Verwenden Sie dies nur, wenn Sie einen benutzerdefinierten Socket implementieren.

Für TCP-Verbindungen sind folgende `options` verfügbar:

- `autoSelectFamily` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): Wenn auf `true` gesetzt, aktiviert dies einen Algorithmus zur automatischen Familienerkennung, der Abschnitt 5 von [RFC 8305](https://www.rfc-editor.org/rfc/rfc8305.txt) lose implementiert. Die an die Suche übergebene Option `all` wird auf `true` gesetzt, und die Sockets versuchen, sich nacheinander mit allen erhaltenen IPv6- und IPv4-Adressen zu verbinden, bis eine Verbindung hergestellt ist. Zuerst wird die erste zurückgegebene AAAA-Adresse, dann die erste zurückgegebene A-Adresse, dann die zweite zurückgegebene AAAA-Adresse usw. ausprobiert. Jedem Verbindungsversuch (aber dem letzten) wird die Zeitspanne eingeräumt, die durch die Option `autoSelectFamilyAttemptTimeout` angegeben wird, bevor ein Timeout auftritt und die nächste Adresse ausprobiert wird. Wird ignoriert, wenn die Option `family` nicht `0` ist oder `localAddress` gesetzt ist. Verbindungsfehler werden nicht ausgegeben, wenn mindestens eine Verbindung erfolgreich ist. Wenn alle Verbindungsversuche fehlschlagen, wird ein einzelnes `AggregateError` mit allen fehlgeschlagenen Versuchen ausgegeben. **Standard:** [`net.getDefaultAutoSelectFamily()`](/de/nodejs/api/net#netgetdefaultautoselectfamily).
- `autoSelectFamilyAttemptTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): Die Zeitspanne in Millisekunden, die gewartet werden soll, bis ein Verbindungsversuch abgeschlossen ist, bevor die nächste Adresse ausprobiert wird, wenn die Option `autoSelectFamily` verwendet wird. Wenn eine positive Ganzzahl kleiner als `10` eingestellt ist, wird stattdessen der Wert `10` verwendet. **Standard:** [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/de/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): Version des IP-Stacks. Muss `4`, `6` oder `0` sein. Der Wert `0` gibt an, dass sowohl IPv4- als auch IPv6-Adressen zulässig sind. **Standard:** `0`.
- `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Optionale [`dns.lookup()` Hinweise](/de/nodejs/api/dns#supported-getaddrinfo-flags).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host, mit dem sich der Socket verbinden soll. **Standard:** `'localhost'`.
- `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `true` gesetzt, aktiviert dies die Keep-Alive-Funktionalität auf dem Socket unmittelbar nach dem Verbindungsaufbau, ähnlich wie bei [`socket.setKeepAlive()`](/de/nodejs/api/net#socketsetkeepaliveenable-initialdelay). **Standard:** `false`.
- `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wenn auf eine positive Zahl gesetzt, wird die anfängliche Verzögerung festgelegt, bevor die erste Keepalive-Sonde auf einem inaktiven Socket gesendet wird. **Standard:** `0`.
- `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lokale Adresse, von der sich der Socket verbinden soll.
- `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lokaler Port, von dem sich der Socket verbinden soll.
- `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Benutzerdefinierte Suchfunktion. **Standard:** [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback).
- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `true` gesetzt, wird die Verwendung des Nagle-Algorithmus unmittelbar nach dem Aufbau des Sockets deaktiviert. **Standard:** `false`.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Erforderlich. Port, mit dem sich der Socket verbinden soll.
- `blockList` [\<net.BlockList\>](/de/nodejs/api/net#class-netblocklist) `blockList` kann verwendet werden, um den ausgehenden Zugriff auf bestimmte IP-Adressen, IP-Bereiche oder IP-Subnetze zu deaktivieren.

Für [IPC](/de/nodejs/api/net#ipc-support)-Verbindungen sind folgende `options` verfügbar:

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Erforderlich. Pfad, mit dem sich der Client verbinden soll. Siehe [Identifizieren von Pfaden für IPC-Verbindungen](/de/nodejs/api/net#identifying-paths-for-ipc-connections). Wenn angegeben, werden die TCP-spezifischen Optionen oben ignoriert.


#### `socket.connect(path[, connectListener])` {#socketconnectpath-connectlistener}

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Pfad, zu dem sich der Client verbinden soll. Siehe [Pfade für IPC-Verbindungen identifizieren](/de/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Häufiger Parameter der [`socket.connect()`](/de/nodejs/api/net#socketconnect) Methoden. Wird einmal als Listener für das [`'connect'`](/de/nodejs/api/net#event-connect) Ereignis hinzugefügt.
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Der Socket selbst.

Initiiert eine [IPC](/de/nodejs/api/net#ipc-support)-Verbindung auf dem angegebenen Socket.

Alias für [`socket.connect(options[, connectListener])`](/de/nodejs/api/net#socketconnectoptions-connectlistener), aufgerufen mit `{ path: path }` als `options`.

#### `socket.connect(port[, host][, connectListener])` {#socketconnectport-host-connectlistener}

**Hinzugefügt in: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port, zu dem sich der Client verbinden soll.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host, zu dem sich der Client verbinden soll.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Häufiger Parameter der [`socket.connect()`](/de/nodejs/api/net#socketconnect) Methoden. Wird einmal als Listener für das [`'connect'`](/de/nodejs/api/net#event-connect) Ereignis hinzugefügt.
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Der Socket selbst.

Initiiert eine TCP-Verbindung auf dem angegebenen Socket.

Alias für [`socket.connect(options[, connectListener])`](/de/nodejs/api/net#socketconnectoptions-connectlistener), aufgerufen mit `{port: port, host: host}` als `options`.

### `socket.connecting` {#socketconnecting}

**Hinzugefügt in: v6.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn `true`, wurde [`socket.connect(options[, connectListener])`](/de/nodejs/api/net#socketconnectoptions-connectlistener) aufgerufen und ist noch nicht abgeschlossen. Es bleibt `true`, bis der Socket verbunden ist, dann wird es auf `false` gesetzt und das `'connect'` Ereignis wird ausgelöst. Beachten Sie, dass der [`socket.connect(options[, connectListener])`](/de/nodejs/api/net#socketconnectoptions-connectlistener) Callback ein Listener für das `'connect'` Ereignis ist.


### `socket.destroy([error])` {#socketdestroyerror}

**Hinzugefügt in: v0.1.90**

- `error` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)

Stellt sicher, dass keine weiteren E/A-Aktivitäten auf diesem Socket stattfinden. Zerstört den Stream und schließt die Verbindung.

Weitere Details finden Sie unter [`writable.destroy()`](/de/nodejs/api/stream#writabledestroyerror).

### `socket.destroyed` {#socketdestroyed}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob die Verbindung zerstört wurde oder nicht. Sobald eine Verbindung zerstört wurde, können keine weiteren Daten über sie übertragen werden.

Weitere Details finden Sie unter [`writable.destroyed`](/de/nodejs/api/stream#writabledestroyed).

### `socket.destroySoon()` {#socketdestroysoon}

**Hinzugefügt in: v0.3.4**

Zerstört den Socket, nachdem alle Daten geschrieben wurden. Wenn das Ereignis `'finish'` bereits ausgelöst wurde, wird der Socket sofort zerstört. Wenn der Socket noch beschreibbar ist, ruft er implizit `socket.end()` auf.

### `socket.end([data[, encoding]][, callback])` {#socketenddata-encoding-callback}

**Hinzugefügt in: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wird nur verwendet, wenn data `string` ist. **Standard:** `'utf8'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Optionaler Callback, wenn der Socket fertig ist.
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Der Socket selbst.

Schließt den Socket halbseitig. D.h. es sendet ein FIN-Paket. Es ist möglich, dass der Server immer noch einige Daten sendet.

Weitere Details finden Sie unter [`writable.end()`](/de/nodejs/api/stream#writableendchunk-encoding-callback).

### `socket.localAddress` {#socketlocaladdress}

**Hinzugefügt in: v0.9.6**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die String-Darstellung der lokalen IP-Adresse, mit der sich der Remote-Client verbindet. Wenn beispielsweise ein Server auf `'0.0.0.0'` lauscht und sich ein Client auf `'192.168.1.1'` verbindet, wäre der Wert von `socket.localAddress` `'192.168.1.1'`.


### `socket.localPort` {#socketlocalport}

**Hinzugefügt in: v0.9.6**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die numerische Darstellung des lokalen Ports. Zum Beispiel `80` oder `21`.

### `socket.localFamily` {#socketlocalfamily}

**Hinzugefügt in: v18.8.0, v16.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die String-Darstellung der lokalen IP-Familie. `'IPv4'` oder `'IPv6'`.

### `socket.pause()` {#socketpause}

- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Der Socket selbst.

Pausiert das Lesen von Daten. Das heißt, [`'data'`](/de/nodejs/api/net#event-data)-Ereignisse werden nicht ausgelöst. Nützlich, um einen Upload zu drosseln.

### `socket.pending` {#socketpending}

**Hinzugefügt in: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Dies ist `true`, wenn der Socket noch nicht verbunden ist, entweder weil `.connect()` noch nicht aufgerufen wurde oder weil er sich noch im Verbindungsprozess befindet (siehe [`socket.connecting`](/de/nodejs/api/net#socketconnecting)).

### `socket.ref()` {#socketref}

**Hinzugefügt in: v0.9.1**

- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Der Socket selbst.

Das Gegenteil von `unref()`. Der Aufruf von `ref()` auf einem zuvor `unref`ed Socket verhindert *nicht*, dass das Programm beendet wird, wenn es der einzige verbleibende Socket ist (das Standardverhalten). Wenn der Socket `ref`ed ist, hat ein erneuter Aufruf von `ref` keine Auswirkung.

### `socket.remoteAddress` {#socketremoteaddress}

**Hinzugefügt in: v0.5.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die String-Darstellung der Remote-IP-Adresse. Zum Beispiel `'74.125.127.100'` oder `'2001:4860:a005::68'`. Der Wert kann `undefined` sein, wenn der Socket zerstört wird (z. B. wenn der Client die Verbindung getrennt hat).

### `socket.remoteFamily` {#socketremotefamily}

**Hinzugefügt in: v0.11.14**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die String-Darstellung der Remote-IP-Familie. `'IPv4'` oder `'IPv6'`. Der Wert kann `undefined` sein, wenn der Socket zerstört wird (z. B. wenn der Client die Verbindung getrennt hat).


### `socket.remotePort` {#socketremoteport}

**Hinzugefügt in: v0.5.10**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die numerische Darstellung des Remote-Ports. Zum Beispiel `80` oder `21`. Der Wert kann `undefined` sein, wenn der Socket zerstört ist (z. B. wenn der Client die Verbindung getrennt hat).

### `socket.resetAndDestroy()` {#socketresetanddestroy}

**Hinzugefügt in: v18.3.0, v16.17.0**

- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)

Schließt die TCP-Verbindung durch Senden eines RST-Pakets und zerstört den Stream. Wenn sich dieser TCP-Socket im Verbindungsstatus befindet, sendet er ein RST-Paket und zerstört diesen TCP-Socket, sobald er verbunden ist. Andernfalls wird `socket.destroy` mit einem `ERR_SOCKET_CLOSED`-Fehler aufgerufen. Wenn es sich nicht um einen TCP-Socket handelt (z. B. eine Pipe), wirft der Aufruf dieser Methode sofort einen `ERR_INVALID_HANDLE_TYPE`-Fehler.

### `socket.resume()` {#socketresume}

- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Der Socket selbst.

Setzt das Lesen nach einem Aufruf von [`socket.pause()`](/de/nodejs/api/net#socketpause) fort.

### `socket.setEncoding([encoding])` {#socketsetencodingencoding}

**Hinzugefügt in: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Der Socket selbst.

Legt die Kodierung für den Socket als [Readable Stream](/de/nodejs/api/stream#class-streamreadable) fest. Weitere Informationen finden Sie unter [`readable.setEncoding()`](/de/nodejs/api/stream#readablesetencodingencoding).

### `socket.setKeepAlive([enable][, initialDelay])` {#socketsetkeepaliveenable-initialdelay}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.12.0, v12.17.0 | Es wurden neue Standardwerte für die Socket-Optionen `TCP_KEEPCNT` und `TCP_KEEPINTVL` hinzugefügt. |
| v0.1.92 | Hinzugefügt in: v0.1.92 |
:::

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `false`
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0`
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Der Socket selbst.

Aktiviert/deaktiviert die Keep-Alive-Funktionalität und legt optional die anfängliche Verzögerung fest, bevor die erste Keep-Alive-Sonde an einem inaktiven Socket gesendet wird.

Setzen Sie `initialDelay` (in Millisekunden), um die Verzögerung zwischen dem letzten empfangenen Datenpaket und der ersten Keep-Alive-Sonde festzulegen. Wenn Sie `0` für `initialDelay` festlegen, bleibt der Wert gegenüber der Standardeinstellung (oder der vorherigen Einstellung) unverändert.

Das Aktivieren der Keep-Alive-Funktionalität setzt die folgenden Socket-Optionen:

- `SO_KEEPALIVE=1`
- `TCP_KEEPIDLE=initialDelay`
- `TCP_KEEPCNT=10`
- `TCP_KEEPINTVL=1`


### `socket.setNoDelay([noDelay])` {#socketsetnodelaynodelay}

**Hinzugefügt in: v0.1.90**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standardwert:** `true`
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Der Socket selbst.

Aktiviert/deaktiviert die Verwendung von Nagle's Algorithmus.

Wenn eine TCP-Verbindung erstellt wird, ist Nagle's Algorithmus standardmäßig aktiviert.

Nagle's Algorithmus verzögert Daten, bevor sie über das Netzwerk gesendet werden. Er versucht, den Durchsatz auf Kosten der Latenz zu optimieren.

Die Übergabe von `true` für `noDelay` oder das Weglassen eines Arguments deaktiviert Nagle's Algorithmus für den Socket. Die Übergabe von `false` für `noDelay` aktiviert Nagle's Algorithmus.

### `socket.setTimeout(timeout[, callback])` {#socketsettimeouttimeout-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das Argument `callback` wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v0.1.90 | Hinzugefügt in: v0.1.90 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Der Socket selbst.

Setzt den Socket so, dass er nach `timeout` Millisekunden Inaktivität auf dem Socket ein Timeout auslöst. Standardmäßig haben `net.Socket` keinen Timeout.

Wenn ein Idle-Timeout ausgelöst wird, empfängt der Socket ein [`'timeout'`](/de/nodejs/api/net#event-timeout)-Ereignis, aber die Verbindung wird nicht unterbrochen. Der Benutzer muss manuell [`socket.end()`](/de/nodejs/api/net#socketenddata-encoding-callback) oder [`socket.destroy()`](/de/nodejs/api/net#socketdestroyerror) aufrufen, um die Verbindung zu beenden.

```js [ESM]
socket.setTimeout(3000);
socket.on('timeout', () => {
  console.log('socket timeout');
  socket.end();
});
```
Wenn `timeout` 0 ist, wird das vorhandene Idle-Timeout deaktiviert.

Der optionale `callback`-Parameter wird als einmaliger Listener für das [`'timeout'`](/de/nodejs/api/net#event-timeout)-Ereignis hinzugefügt.


### `socket.timeout` {#sockettimeout}

**Hinzugefügt in: v10.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Das Socket-Timeout in Millisekunden, wie durch [`socket.setTimeout()`](/de/nodejs/api/net#socketsettimeouttimeout-callback) festgelegt. Es ist `undefined`, wenn kein Timeout festgelegt wurde.

### `socket.unref()` {#socketunref}

**Hinzugefügt in: v0.9.1**

- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Das Socket selbst.

Der Aufruf von `unref()` auf einem Socket ermöglicht es dem Programm, zu beenden, wenn dies das einzige aktive Socket im Ereignissystem ist. Wenn das Socket bereits `unref`ed ist, hat ein erneuter Aufruf von `unref()` keine Auswirkung.

### `socket.write(data[, encoding][, callback])` {#socketwritedata-encoding-callback}

**Hinzugefügt in: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wird nur verwendet, wenn `data` ein `string` ist. **Standard:** `utf8`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sendet Daten über das Socket. Der zweite Parameter gibt die Kodierung im Fall eines Strings an. Standardmäßig wird die UTF8-Kodierung verwendet.

Gibt `true` zurück, wenn die gesamten Daten erfolgreich in den Kernel-Puffer geschrieben wurden. Gibt `false` zurück, wenn die Daten ganz oder teilweise im Benutzerspeicher zwischengespeichert wurden. [`'drain'`](/de/nodejs/api/net#event-drain) wird ausgegeben, wenn der Puffer wieder frei ist.

Der optionale `callback`-Parameter wird ausgeführt, wenn die Daten endgültig ausgeschrieben sind, was möglicherweise nicht sofort geschieht.

Weitere Informationen finden Sie in der `Writable`-Stream-Methode [`write()`](/de/nodejs/api/stream#writablewritechunk-encoding-callback).


### `socket.readyState` {#socketreadystate}

**Hinzugefügt in: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Diese Eigenschaft stellt den Status der Verbindung als Zeichenkette dar.

- Wenn der Stream sich im Verbindungsaufbau befindet, ist `socket.readyState` `opening`.
- Wenn der Stream lesbar und beschreibbar ist, ist er `open`.
- Wenn der Stream lesbar, aber nicht beschreibbar ist, ist er `readOnly`.
- Wenn der Stream nicht lesbar und beschreibbar ist, ist er `writeOnly`.

## `net.connect()` {#netconnect}

Aliase für [`net.createConnection()`](/de/nodejs/api/net#netcreateconnection).

Mögliche Signaturen:

- [`net.connect(options[, connectListener])`](/de/nodejs/api/net#netconnectoptions-connectlistener)
- [`net.connect(path[, connectListener])`](/de/nodejs/api/net#netconnectpath-connectlistener) für [IPC](/de/nodejs/api/net#ipc-support)-Verbindungen.
- [`net.connect(port[, host][, connectListener])`](/de/nodejs/api/net#netconnectport-host-connectlistener) für TCP-Verbindungen.

### `net.connect(options[, connectListener])` {#netconnectoptions-connectlistener}

**Hinzugefügt in: v0.7.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)

Alias für [`net.createConnection(options[, connectListener])`](/de/nodejs/api/net#netcreateconnectionoptions-connectlistener).

### `net.connect(path[, connectListener])` {#netconnectpath-connectlistener}

**Hinzugefügt in: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)

Alias für [`net.createConnection(path[, connectListener])`](/de/nodejs/api/net#netcreateconnectionpath-connectlistener).

### `net.connect(port[, host][, connectListener])` {#netconnectport-host-connectlistener}

**Hinzugefügt in: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)

Alias für [`net.createConnection(port[, host][, connectListener])`](/de/nodejs/api/net#netcreateconnectionport-host-connectlistener).


## `net.createConnection()` {#netcreateconnection}

Eine Factory-Funktion, die ein neues [`net.Socket`](/de/nodejs/api/net#class-netsocket) erstellt, sofort eine Verbindung mit [`socket.connect()`](/de/nodejs/api/net#socketconnect) initiiert und dann das `net.Socket` zurückgibt, das die Verbindung startet.

Wenn die Verbindung hergestellt ist, wird ein [`'connect'`](/de/nodejs/api/net#event-connect)-Ereignis auf dem zurückgegebenen Socket ausgelöst. Der letzte Parameter `connectListener` wird, falls angegeben, **einmal** als Listener für das [`'connect'`](/de/nodejs/api/net#event-connect)-Ereignis hinzugefügt.

Mögliche Signaturen:

- [`net.createConnection(options[, connectListener])`](/de/nodejs/api/net#netcreateconnectionoptions-connectlistener)
- [`net.createConnection(path[, connectListener])`](/de/nodejs/api/net#netcreateconnectionpath-connectlistener) für [IPC](/de/nodejs/api/net#ipc-support)-Verbindungen.
- [`net.createConnection(port[, host][, connectListener])`](/de/nodejs/api/net#netcreateconnectionport-host-connectlistener) für TCP-Verbindungen.

Die Funktion [`net.connect()`](/de/nodejs/api/net#netconnect) ist ein Alias für diese Funktion.

### `net.createConnection(options[, connectListener])` {#netcreateconnectionoptions-connectlistener}

**Hinzugefügt in: v0.1.90**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Erforderlich. Wird sowohl an den [`new net.Socket([options])`](/de/nodejs/api/net#new-netsocketoptions)-Aufruf als auch an die [`socket.connect(options[, connectListener])`](/de/nodejs/api/net#socketconnectoptions-connectlistener)-Methode übergeben.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Gemeinsamer Parameter der [`net.createConnection()`](/de/nodejs/api/net#netcreateconnection)-Funktionen. Falls angegeben, wird er einmal als Listener für das [`'connect'`](/de/nodejs/api/net#event-connect)-Ereignis auf dem zurückgegebenen Socket hinzugefügt.
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Der neu erstellte Socket, der zum Starten der Verbindung verwendet wird.

Verfügbare Optionen finden Sie unter [`new net.Socket([options])`](/de/nodejs/api/net#new-netsocketoptions) und [`socket.connect(options[, connectListener])`](/de/nodejs/api/net#socketconnectoptions-connectlistener).

Zusätzliche Optionen:

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wenn gesetzt, wird [`socket.setTimeout(timeout)`](/de/nodejs/api/net#socketsettimeouttimeout-callback) aufgerufen, nachdem der Socket erstellt wurde, aber bevor er die Verbindung startet.

Im Folgenden finden Sie ein Beispiel für einen Client des Echo-Servers, der im Abschnitt [`net.createServer()`](/de/nodejs/api/net#netcreateserveroptions-connectionlistener) beschrieben ist:

::: code-group
```js [ESM]
import net from 'node:net';
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect'-Listener.
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
  // 'connect'-Listener.
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

Um sich mit dem Socket `/tmp/echo.sock` zu verbinden:

```js [ESM]
const client = net.createConnection({ path: '/tmp/echo.sock' });
```
Im Folgenden finden Sie ein Beispiel für einen Client, der die Option `port` und `onread` verwendet. In diesem Fall wird die Option `onread` nur verwendet, um `new net.Socket([options])` aufzurufen, und die Option `port` wird verwendet, um `socket.connect(options[, connectListener])` aufzurufen.

::: code-group
```js [ESM]
import net from 'node:net';
import { Buffer } from 'node:buffer';
net.createConnection({
  port: 8124,
  onread: {
    // Verwendet einen 4KiB Buffer für jeden Lesevorgang vom Socket wieder.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Empfangene Daten sind in `buf` von 0 bis `nread` verfügbar.
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
    // Verwendet einen 4KiB Buffer für jeden Lesevorgang vom Socket wieder.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Empfangene Daten sind in `buf` von 0 bis `nread` verfügbar.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```
:::


### `net.createConnection(path[, connectListener])` {#netcreateconnectionpath-connectlistener}

**Hinzugefügt in: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Pfad, zu dem sich der Socket verbinden soll. Wird an [`socket.connect(path[, connectListener])`](/de/nodejs/api/net#socketconnectpath-connectlistener) übergeben. Siehe [Pfade für IPC-Verbindungen identifizieren](/de/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Gemeinsamer Parameter der [`net.createConnection()`](/de/nodejs/api/net#netcreateconnection)-Funktionen, ein "once"-Listener für das `'connect'`-Ereignis auf dem initiierenden Socket. Wird an [`socket.connect(path[, connectListener])`](/de/nodejs/api/net#socketconnectpath-connectlistener) übergeben.
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Der neu erstellte Socket, der zum Starten der Verbindung verwendet wird.

Initiiert eine [IPC](/de/nodejs/api/net#ipc-support)-Verbindung.

Diese Funktion erstellt einen neuen [`net.Socket`](/de/nodejs/api/net#class-netsocket) mit allen auf Standardwerte gesetzten Optionen, initiiert sofort eine Verbindung mit [`socket.connect(path[, connectListener])`](/de/nodejs/api/net#socketconnectpath-connectlistener) und gibt dann den `net.Socket` zurück, der die Verbindung startet.

### `net.createConnection(port[, host][, connectListener])` {#netcreateconnectionport-host-connectlistener}

**Hinzugefügt in: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port, zu dem sich der Socket verbinden soll. Wird an [`socket.connect(port[, host][, connectListener])`](/de/nodejs/api/net#socketconnectport-host-connectlistener) übergeben.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host, zu dem sich der Socket verbinden soll. Wird an [`socket.connect(port[, host][, connectListener])`](/de/nodejs/api/net#socketconnectport-host-connectlistener) übergeben. **Standard:** `'localhost'`.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Gemeinsamer Parameter der [`net.createConnection()`](/de/nodejs/api/net#netcreateconnection)-Funktionen, ein "once"-Listener für das `'connect'`-Ereignis auf dem initiierenden Socket. Wird an [`socket.connect(port[, host][, connectListener])`](/de/nodejs/api/net#socketconnectport-host-connectlistener) übergeben.
- Gibt zurück: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) Der neu erstellte Socket, der zum Starten der Verbindung verwendet wird.

Initiiert eine TCP-Verbindung.

Diese Funktion erstellt einen neuen [`net.Socket`](/de/nodejs/api/net#class-netsocket) mit allen auf Standardwerte gesetzten Optionen, initiiert sofort eine Verbindung mit [`socket.connect(port[, host][, connectListener])`](/de/nodejs/api/net#socketconnectport-host-connectlistener) und gibt dann den `net.Socket` zurück, der die Verbindung startet.


## `net.createServer([options][, connectionListener])` {#netcreateserveroptions-connectionlistener}

::: info [Historie]
| Version        | Änderungen                                                      |
| :------------- | :------------------------------------------------------------- |
| v20.1.0, v18.17.0 | Die Option `highWaterMark` wird jetzt unterstützt.             |
| v17.7.0, v16.15.0 | Die Optionen `noDelay`, `keepAlive` und `keepAliveInitialDelay` werden jetzt unterstützt. |
| v0.5.0         | Hinzugefügt in: v0.5.0                                         |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `false` gesetzt, beendet der Socket automatisch die beschreibbare Seite, wenn die lesbare Seite endet. **Standard:** `false`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Überschreibt optional die `readableHighWaterMark` und `writableHighWaterMark` aller [`net.Socket`](/de/nodejs/api/net#class-netsocket)s. **Standard:** Siehe [`stream.getDefaultHighWaterMark()`](/de/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode).
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `true` gesetzt, aktiviert dies die Keep-Alive-Funktionalität auf dem Socket unmittelbar nach dem Empfang einer neuen eingehenden Verbindung, ähnlich wie in [`socket.setKeepAlive()`](/de/nodejs/api/net#socketsetkeepaliveenable-initialdelay) durchgeführt. **Standard:** `false`.
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wenn auf eine positive Zahl gesetzt, legt dies die anfängliche Verzögerung fest, bevor die erste Keepalive-Prüfung auf einem inaktiven Socket gesendet wird. **Standard:** `0`.
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `true` gesetzt, deaktiviert dies die Verwendung des Nagle-Algorithmus unmittelbar nach dem Empfang einer neuen eingehenden Verbindung. **Standard:** `false`.
    - `pauseOnConnect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob der Socket bei eingehenden Verbindungen pausiert werden soll. **Standard:** `false`.
    - `blockList` [\<net.BlockList\>](/de/nodejs/api/net#class-netblocklist) `blockList` kann verwendet werden, um den eingehenden Zugriff auf bestimmte IP-Adressen, IP-Bereiche oder IP-Subnetze zu deaktivieren. Dies funktioniert nicht, wenn sich der Server hinter einem Reverse-Proxy, NAT usw. befindet, da die Adresse, die mit der Blockliste verglichen wird, die Adresse des Proxys oder die von der NAT angegebene ist.

- `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird automatisch als Listener für das [`'connection'`](/de/nodejs/api/net#event-connection)-Ereignis festgelegt.
- Gibt zurück: [\<net.Server\>](/de/nodejs/api/net#class-netserver)

Erstellt einen neuen TCP- oder [IPC](/de/nodejs/api/net#ipc-support)-Server.

Wenn `allowHalfOpen` auf `true` gesetzt ist, sendet der Server das Ende der Übertragung erst dann zurück, wenn [`socket.end()`](/de/nodejs/api/net#socketenddata-encoding-callback) explizit aufgerufen wird, wenn das andere Ende des Sockets das Ende der Übertragung signalisiert. Wenn beispielsweise im Kontext von TCP ein FIN-Paket empfangen wird, wird ein FIN-Paket nur dann zurückgesendet, wenn [`socket.end()`](/de/nodejs/api/net#socketenddata-encoding-callback) explizit aufgerufen wird. Bis dahin ist die Verbindung halb geschlossen (nicht lesbar, aber immer noch beschreibbar). Weitere Informationen finden Sie im [`'end'`](/de/nodejs/api/net#event-end)-Ereignis und in [RFC 1122](https://tools.ietf.org/html/rfc1122) (Abschnitt 4.2.2.13).

Wenn `pauseOnConnect` auf `true` gesetzt ist, wird der Socket, der jeder eingehenden Verbindung zugeordnet ist, pausiert, und es werden keine Daten von seinem Handle gelesen. Dies ermöglicht das Übertragen von Verbindungen zwischen Prozessen, ohne dass Daten vom ursprünglichen Prozess gelesen werden. Um mit dem Lesen von Daten von einem pausierten Socket zu beginnen, rufen Sie [`socket.resume()`](/de/nodejs/api/net#socketresume) auf.

Der Server kann ein TCP-Server oder ein [IPC](/de/nodejs/api/net#ipc-support)-Server sein, je nachdem, worauf er [`listen()`](/de/nodejs/api/net#serverlisten) ist.

Hier ist ein Beispiel für einen TCP-Echo-Server, der auf Verbindungen an Port 8124 wartet:

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

Testen Sie dies mit `telnet`:

```bash [BASH]
telnet localhost 8124
```

Um auf dem Socket `/tmp/echo.sock` zu hören:

```js [ESM]
server.listen('/tmp/echo.sock', () => {
  console.log('server bound');
});
```

Verwenden Sie `nc`, um eine Verbindung zu einem Unix-Domain-Socket-Server herzustellen:

```bash [BASH]
nc -U /tmp/echo.sock
```

## `net.getDefaultAutoSelectFamily()` {#netgetdefaultautoselectfamily}

**Hinzugefügt in: v19.4.0**

Ermittelt den aktuellen Standardwert der Option `autoSelectFamily` von [`socket.connect(options)`](/de/nodejs/api/net#socketconnectoptions-connectlistener). Der anfängliche Standardwert ist `true`, es sei denn, die Kommandozeilenoption `--no-network-family-autoselection` wird angegeben.

- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Der aktuelle Standardwert der Option `autoSelectFamily`.

## `net.setDefaultAutoSelectFamily(value)` {#netsetdefaultautoselectfamilyvalue}

**Hinzugefügt in: v19.4.0**

Legt den Standardwert der Option `autoSelectFamily` von [`socket.connect(options)`](/de/nodejs/api/net#socketconnectoptions-connectlistener) fest.

- `value` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Der neue Standardwert. Der anfängliche Standardwert ist `true`, es sei denn, die Kommandozeilenoption `--no-network-family-autoselection` wird angegeben.

## `net.getDefaultAutoSelectFamilyAttemptTimeout()` {#netgetdefaultautoselectfamilyattempttimeout}

**Hinzugefügt in: v19.8.0, v18.18.0**

Ermittelt den aktuellen Standardwert der Option `autoSelectFamilyAttemptTimeout` von [`socket.connect(options)`](/de/nodejs/api/net#socketconnectoptions-connectlistener). Der anfängliche Standardwert ist `250` oder der Wert, der über die Kommandozeilenoption `--network-family-autoselection-attempt-timeout` angegeben wurde.

- Rückgabe: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der aktuelle Standardwert der Option `autoSelectFamilyAttemptTimeout`.

## `net.setDefaultAutoSelectFamilyAttemptTimeout(value)` {#netsetdefaultautoselectfamilyattempttimeoutvalue}

**Hinzugefügt in: v19.8.0, v18.18.0**

Legt den Standardwert der Option `autoSelectFamilyAttemptTimeout` von [`socket.connect(options)`](/de/nodejs/api/net#socketconnectoptions-connectlistener) fest.

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der neue Standardwert, der eine positive Zahl sein muss. Wenn die Zahl kleiner als `10` ist, wird stattdessen der Wert `10` verwendet. Der anfängliche Standardwert ist `250` oder der Wert, der über die Kommandozeilenoption `--network-family-autoselection-attempt-timeout` angegeben wurde.


## `net.isIP(input)` {#netisipinput}

**Hinzugefügt in: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt `6` zurück, wenn `input` eine IPv6-Adresse ist. Gibt `4` zurück, wenn `input` eine IPv4-Adresse in [punktdezimaler Notation](https://en.wikipedia.org/wiki/Dot-decimal_notation) ohne führende Nullen ist. Andernfalls wird `0` zurückgegeben.

```js [ESM]
net.isIP('::1'); // gibt 6 zurück
net.isIP('127.0.0.1'); // gibt 4 zurück
net.isIP('127.000.000.001'); // gibt 0 zurück
net.isIP('127.0.0.1/24'); // gibt 0 zurück
net.isIP('fhqwhgads'); // gibt 0 zurück
```
## `net.isIPv4(input)` {#netisipv4input}

**Hinzugefügt in: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn `input` eine IPv4-Adresse in [punktdezimaler Notation](https://en.wikipedia.org/wiki/Dot-decimal_notation) ohne führende Nullen ist. Andernfalls wird `false` zurückgegeben.

```js [ESM]
net.isIPv4('127.0.0.1'); // gibt true zurück
net.isIPv4('127.000.000.001'); // gibt false zurück
net.isIPv4('127.0.0.1/24'); // gibt false zurück
net.isIPv4('fhqwhgads'); // gibt false zurück
```
## `net.isIPv6(input)` {#netisipv6input}

**Hinzugefügt in: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn `input` eine IPv6-Adresse ist. Andernfalls wird `false` zurückgegeben.

```js [ESM]
net.isIPv6('::1'); // gibt true zurück
net.isIPv6('fhqwhgads'); // gibt false zurück
```

