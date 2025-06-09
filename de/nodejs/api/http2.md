---
title: Node.js Dokumentation - HTTP/2
description: Diese Seite bietet umfassende Dokumentation über das HTTP/2-Modul in Node.js, detailliert seine API, Nutzung und Beispiele zur Implementierung von HTTP/2-Servern und -Clients.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Diese Seite bietet umfassende Dokumentation über das HTTP/2-Modul in Node.js, detailliert seine API, Nutzung und Beispiele zur Implementierung von HTTP/2-Servern und -Clients.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Diese Seite bietet umfassende Dokumentation über das HTTP/2-Modul in Node.js, detailliert seine API, Nutzung und Beispiele zur Implementierung von HTTP/2-Servern und -Clients.
---


# HTTP/2 {#http/2}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Anfragen mit dem `host`-Header (mit oder ohne `:authority`) können jetzt gesendet/empfangen werden. |
| v15.3.0, v14.17.0 | Es ist möglich, eine Anfrage mit einem AbortSignal abzubrechen. |
| v10.10.0 | HTTP/2 ist jetzt stabil. Zuvor war es experimentell. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/http2.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http2.js)

Das `node:http2`-Modul bietet eine Implementierung des [HTTP/2](https://tools.ietf.org/html/rfc7540)-Protokolls. Es kann wie folgt aufgerufen werden:

```js [ESM]
const http2 = require('node:http2');
```
## Feststellen, ob die Crypto-Unterstützung nicht verfügbar ist {#determining-if-crypto-support-is-unavailable}

Es ist möglich, dass Node.js erstellt wird, ohne Unterstützung für das `node:crypto`-Modul zu beinhalten. In solchen Fällen führt der Versuch, von `node:http2` zu `import` oder `require('node:http2')` aufzurufen, zu einem Fehler.

Bei Verwendung von CommonJS kann der ausgelöste Fehler mit try/catch abgefangen werden:

```js [CJS]
let http2;
try {
  http2 = require('node:http2');
} catch (err) {
  console.error('http2 support is disabled!');
}
```
Bei Verwendung des lexikalischen ESM-Schlüsselworts `import` kann der Fehler nur abgefangen werden, wenn ein Handler für `process.on('uncaughtException')` registriert wird, *bevor* ein Versuch unternommen wird, das Modul zu laden (z. B. mit einem Preload-Modul).

Wenn Sie ESM verwenden und die Möglichkeit besteht, dass der Code in einer Build-Version von Node.js ausgeführt wird, in der die Crypto-Unterstützung nicht aktiviert ist, sollten Sie die Funktion [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) anstelle des lexikalischen Schlüsselworts `import` verwenden:

```js [ESM]
let http2;
try {
  http2 = await import('node:http2');
} catch (err) {
  console.error('http2 support is disabled!');
}
```
## Core API {#core-api}

Die Core API bietet eine Low-Level-Schnittstelle, die speziell für die Unterstützung von HTTP/2-Protokollfunktionen entwickelt wurde. Sie ist ausdrücklich *nicht* auf Kompatibilität mit der bestehenden [HTTP/1](/de/nodejs/api/http)-Modul-API ausgelegt. Die [Kompatibilitäts-API](/de/nodejs/api/http2#compatibility-api) hingegen schon.

Die `http2` Core API ist zwischen Client und Server viel symmetrischer als die `http` API. Beispielsweise können die meisten Ereignisse wie `'error'`, `'connect'` und `'stream'` entweder vom Client-Code oder vom Server-Code ausgelöst werden.


### Serverseitiges Beispiel {#server-side-example}

Das Folgende veranschaulicht einen einfachen HTTP/2-Server, der die Core-API verwendet. Da keine Browser bekannt sind, die [unverschlüsseltes HTTP/2](https://http2.github.io/faq/#does-http2-require-encryption) unterstützen, ist die Verwendung von [`http2.createSecureServer()`](/de/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) notwendig, wenn mit Browser-Clients kommuniziert wird.

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

Um das Zertifikat und den Schlüssel für dieses Beispiel zu generieren, führen Sie Folgendes aus:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```
### Clientseitiges Beispiel {#client-side-example}

Das Folgende veranschaulicht einen HTTP/2-Client:

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


### Klasse: `Http2Session` {#class-http2session}

**Hinzugefügt in: v8.4.0**

- Erweitert: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Instanzen der Klasse `http2.Http2Session` repräsentieren eine aktive Kommunikationssitzung zwischen einem HTTP/2-Client und -Server. Instanzen dieser Klasse sind *nicht* dafür vorgesehen, direkt durch Benutzercode konstruiert zu werden.

Jede `Http2Session`-Instanz zeigt ein leicht unterschiedliches Verhalten, je nachdem, ob sie als Server oder als Client arbeitet. Die Eigenschaft `http2session.type` kann verwendet werden, um den Modus zu bestimmen, in dem eine `Http2Session` arbeitet. Auf der Serverseite sollte Benutzercode selten Gelegenheit haben, direkt mit dem `Http2Session`-Objekt zu arbeiten, wobei die meisten Aktionen typischerweise durch Interaktionen mit den Objekten `Http2Server` oder `Http2Stream` erfolgen.

Benutzercode erstellt keine `Http2Session`-Instanzen direkt. Serverseitige `Http2Session`-Instanzen werden von der `Http2Server`-Instanz erstellt, wenn eine neue HTTP/2-Verbindung empfangen wird. Clientseitige `Http2Session`-Instanzen werden mit der Methode `http2.connect()` erstellt.

#### `Http2Session` und Sockets {#http2session-and-sockets}

Jede `Http2Session`-Instanz ist genau einem [`net.Socket`](/de/nodejs/api/net#class-netsocket) oder [`tls.TLSSocket`](/de/nodejs/api/tls#class-tlstlssocket) zugeordnet, wenn sie erstellt wird. Wenn entweder der `Socket` oder die `Http2Session` zerstört werden, werden beide zerstört.

Aufgrund der spezifischen Serialisierungs- und Verarbeitungsanforderungen, die durch das HTTP/2-Protokoll auferlegt werden, wird empfohlen, dass Benutzercode keine Daten von einer `Socket`-Instanz liest oder in eine solche schreibt, die an eine `Http2Session` gebunden ist. Andernfalls kann die HTTP/2-Sitzung in einen unbestimmten Zustand versetzt werden, wodurch die Sitzung und der Socket unbrauchbar werden.

Sobald ein `Socket` an eine `Http2Session` gebunden wurde, sollte sich der Benutzercode ausschließlich auf die API der `Http2Session` verlassen.

#### Event: `'close'` {#event-close}

**Hinzugefügt in: v8.4.0**

Das Ereignis `'close'` wird ausgelöst, sobald die `Http2Session` zerstört wurde. Der Listener erwartet keine Argumente.

#### Event: `'connect'` {#event-connect}

**Hinzugefügt in: v8.4.0**

- `session` [\<Http2Session\>](/de/nodejs/api/http2#class-http2session)
- `socket` [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)

Das Ereignis `'connect'` wird ausgelöst, sobald die `Http2Session` erfolgreich mit dem Remote-Peer verbunden wurde und die Kommunikation beginnen kann.

Benutzercode wird typischerweise nicht direkt auf dieses Ereignis hören.


#### Ereignis: `'error'` {#event-error}

**Hinzugefügt in: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Das `'error'`-Ereignis wird ausgelöst, wenn während der Verarbeitung einer `Http2Session` ein Fehler auftritt.

#### Ereignis: `'frameError'` {#event-frameerror}

**Hinzugefügt in: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Frame-Typ.
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Fehlercode.
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Stream-ID (oder `0`, wenn der Frame keinem Stream zugeordnet ist).

Das `'frameError'`-Ereignis wird ausgelöst, wenn beim Versuch, einen Frame über die Session zu senden, ein Fehler auftritt. Wenn der Frame, der nicht gesendet werden konnte, einem bestimmten `Http2Stream` zugeordnet ist, wird versucht, ein `'frameError'`-Ereignis auf dem `Http2Stream` auszulösen.

Wenn das `'frameError'`-Ereignis einem Stream zugeordnet ist, wird der Stream unmittelbar nach dem `'frameError'`-Ereignis geschlossen und zerstört. Wenn das Ereignis keinem Stream zugeordnet ist, wird die `Http2Session` unmittelbar nach dem `'frameError'`-Ereignis heruntergefahren.

#### Ereignis: `'goaway'` {#event-goaway}

**Hinzugefügt in: v8.4.0**

- `errorCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der im `GOAWAY`-Frame angegebene HTTP/2-Fehlercode.
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die ID des letzten Streams, den der Remote-Peer erfolgreich verarbeitet hat (oder `0`, wenn keine ID angegeben ist).
- `opaqueData` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Wenn zusätzliche opake Daten im `GOAWAY`-Frame enthalten waren, wird eine `Buffer`-Instanz übergeben, die diese Daten enthält.

Das `'goaway'`-Ereignis wird ausgelöst, wenn ein `GOAWAY`-Frame empfangen wird.

Die `Http2Session`-Instanz wird automatisch heruntergefahren, wenn das `'goaway'`-Ereignis ausgelöst wird.


#### Event: `'localSettings'` {#event-localsettings}

**Hinzugefügt in: v8.4.0**

- `settings` [\<HTTP/2 Settings Object\>](/de/nodejs/api/http2#settings-object) Eine Kopie des empfangenen `SETTINGS`-Frames.

Das `'localSettings'`-Ereignis wird ausgelöst, wenn ein Bestätigungs-`SETTINGS`-Frame empfangen wurde.

Wenn `http2session.settings()` verwendet wird, um neue Einstellungen zu übermitteln, werden die geänderten Einstellungen erst wirksam, wenn das `'localSettings'`-Ereignis ausgelöst wird.

```js [ESM]
session.settings({ enablePush: false });

session.on('localSettings', (settings) => {
  /* Verwende die neuen Einstellungen */
});
```
#### Event: `'ping'` {#event-ping}

**Hinzugefügt in: v10.12.0**

- `payload` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Die 8-Byte-Nutzlast des `PING`-Frames

Das `'ping'`-Ereignis wird immer dann ausgelöst, wenn ein `PING`-Frame vom verbundenen Peer empfangen wird.

#### Event: `'remoteSettings'` {#event-remotesettings}

**Hinzugefügt in: v8.4.0**

- `settings` [\<HTTP/2 Settings Object\>](/de/nodejs/api/http2#settings-object) Eine Kopie des empfangenen `SETTINGS`-Frames.

Das `'remoteSettings'`-Ereignis wird ausgelöst, wenn ein neuer `SETTINGS`-Frame vom verbundenen Peer empfangen wird.

```js [ESM]
session.on('remoteSettings', (settings) => {
  /* Verwende die neuen Einstellungen */
});
```
#### Event: `'stream'` {#event-stream}

**Hinzugefügt in: v8.4.0**

- `stream` [\<Http2Stream\>](/de/nodejs/api/http2#class-http2stream) Eine Referenz auf den Stream
- `headers` [\<HTTP/2 Headers Object\>](/de/nodejs/api/http2#headers-object) Ein Objekt, das die Header beschreibt
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die zugehörigen numerischen Flags
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array, das die rohen Header-Namen gefolgt von ihren jeweiligen Werten enthält.

Das `'stream'`-Ereignis wird ausgelöst, wenn ein neuer `Http2Stream` erstellt wird.

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
Auf der Serverseite wird Benutzercode normalerweise nicht direkt auf dieses Ereignis hören, sondern stattdessen einen Handler für das `'stream'`-Ereignis registrieren, das von den `net.Server`- oder `tls.Server`-Instanzen ausgelöst wird, die von `http2.createServer()` bzw. `http2.createSecureServer()` zurückgegeben werden, wie im folgenden Beispiel:



::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// Erstellt einen unverschlüsselten HTTP/2-Server
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

// Erstellt einen unverschlüsselten HTTP/2-Server
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

Auch wenn HTTP/2-Streams und Netzwerk-Sockets nicht in einer 1:1-Korrespondenz stehen, zerstört ein Netzwerkfehler jeden einzelnen Stream und muss auf Stream-Ebene behandelt werden, wie oben gezeigt.


#### Event: `'timeout'` {#event-timeout}

**Hinzugefügt in: v8.4.0**

Nachdem die Methode `http2session.setTimeout()` verwendet wurde, um die Timeout-Periode für diese `Http2Session` festzulegen, wird das `'timeout'`-Ereignis ausgelöst, wenn es nach der konfigurierten Anzahl von Millisekunden keine Aktivität auf der `Http2Session` gibt. Der Listener erwartet keine Argumente.

```js [ESM]
session.setTimeout(2000);
session.on('timeout', () => { /* .. */ });
```
#### `http2session.alpnProtocol` {#http2sessionalpnprotocol}

**Hinzugefügt in: v9.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Der Wert ist `undefined`, wenn die `Http2Session` noch nicht mit einem Socket verbunden ist, `h2c`, wenn die `Http2Session` nicht mit einem `TLSSocket` verbunden ist, oder gibt den Wert der `alpnProtocol`-Eigenschaft des verbundenen `TLSSocket` zurück.

#### `http2session.close([callback])` {#http2sessionclosecallback}

**Hinzugefügt in: v9.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Schließt die `Http2Session` ordnungsgemäß, wodurch alle vorhandenen Streams selbstständig abgeschlossen werden können und die Erstellung neuer `Http2Stream`-Instanzen verhindert wird. Nach dem Schließen wird `http2session.destroy()` *möglicherweise* aufgerufen, wenn keine offenen `Http2Stream`-Instanzen vorhanden sind.

Falls angegeben, wird die `callback`-Funktion als Handler für das `'close'`-Ereignis registriert.

#### `http2session.closed` {#http2sessionclosed}

**Hinzugefügt in: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, wenn diese `Http2Session`-Instanz geschlossen wurde, andernfalls `false`.

#### `http2session.connecting` {#http2sessionconnecting}

**Hinzugefügt in: v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, wenn diese `Http2Session`-Instanz noch verbindet, wird auf `false` gesetzt, bevor das `connect`-Ereignis ausgelöst und/oder der `http2.connect`-Callback aufgerufen wird.

#### `http2session.destroy([error][, code])` {#http2sessiondestroyerror-code}

**Hinzugefügt in: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Ein `Error`-Objekt, wenn die `Http2Session` aufgrund eines Fehlers zerstört wird.
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der HTTP/2-Fehlercode, der im letzten `GOAWAY`-Frame gesendet werden soll. Wenn nicht angegeben und `error` nicht undefiniert ist, ist der Standardwert `INTERNAL_ERROR`, andernfalls wird standardmäßig `NO_ERROR` verwendet.

Beendet die `Http2Session` und den zugehörigen `net.Socket` oder `tls.TLSSocket` sofort.

Nach dem Zerstören löst die `Http2Session` das `'close'`-Ereignis aus. Wenn `error` nicht undefiniert ist, wird ein `'error'`-Ereignis unmittelbar vor dem `'close'`-Ereignis ausgelöst.

Wenn noch offene `Http2Streams` vorhanden sind, die der `Http2Session` zugeordnet sind, werden diese ebenfalls zerstört.


#### `http2session.destroyed` {#http2sessiondestroyed}

**Hinzugefügt in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, wenn diese `Http2Session`-Instanz zerstört wurde und nicht mehr verwendet werden darf, andernfalls `false`.

#### `http2session.encrypted` {#http2sessionencrypted}

**Hinzugefügt in: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Der Wert ist `undefined`, wenn der `Http2Session`-Sitzungssocket noch nicht verbunden wurde, `true`, wenn die `Http2Session` mit einem `TLSSocket` verbunden ist, und `false`, wenn die `Http2Session` mit einer anderen Art von Socket oder Stream verbunden ist.

#### `http2session.goaway([code[, lastStreamID[, opaqueData]]])` {#http2sessiongoawaycode-laststreamid-opaquedata}

**Hinzugefügt in: v9.4.0**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein HTTP/2-Fehlercode
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die numerische ID des zuletzt verarbeiteten `Http2Stream`
- `opaqueData` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Eine `TypedArray`- oder `DataView`-Instanz, die zusätzliche Daten enthält, die innerhalb des `GOAWAY`-Frames übertragen werden sollen.

Überträgt einen `GOAWAY`-Frame an den verbundenen Peer, *ohne* die `Http2Session` herunterzufahren.

#### `http2session.localSettings` {#http2sessionlocalsettings}

**Hinzugefügt in: v8.4.0**

- [\<HTTP/2 Settings Object\>](/de/nodejs/api/http2#settings-object)

Ein prototypfreies Objekt, das die aktuellen lokalen Einstellungen dieser `Http2Session` beschreibt. Die lokalen Einstellungen sind lokal für *diese* `Http2Session`-Instanz.

#### `http2session.originSet` {#http2sessionoriginset}

**Hinzugefügt in: v9.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Wenn die `Http2Session` mit einem `TLSSocket` verbunden ist, gibt die `originSet`-Eigenschaft ein `Array` von Ursprüngen zurück, für die die `Http2Session` als maßgeblich angesehen werden kann.

Die `originSet`-Eigenschaft ist nur verfügbar, wenn eine sichere TLS-Verbindung verwendet wird.


#### `http2session.pendingSettingsAck` {#http2sessionpendingsettingsack}

**Hinzugefügt in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt an, ob die `Http2Session` derzeit auf die Bestätigung eines gesendeten `SETTINGS`-Frames wartet. Ist `true`, nachdem die Methode `http2session.settings()` aufgerufen wurde. Ist `false`, sobald alle gesendeten `SETTINGS`-Frames bestätigt wurden.

#### `http2session.ping([payload, ]callback)` {#http2sessionpingpayload-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v8.9.3 | Hinzugefügt in: v8.9.3 |
:::

- `payload` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Optionaler Ping-Payload.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sendet einen `PING`-Frame an den verbundenen HTTP/2-Peer. Eine `callback`-Funktion muss bereitgestellt werden. Die Methode gibt `true` zurück, wenn der `PING` gesendet wurde, andernfalls `false`.

Die maximale Anzahl ausstehender (unbestätigter) Pings wird durch die Konfigurationsoption `maxOutstandingPings` bestimmt. Der Standardwert beträgt 10.

Wenn angegeben, muss der `payload` ein `Buffer`, `TypedArray` oder `DataView` sein, der 8 Byte Daten enthält, die mit dem `PING` übertragen und mit der Ping-Bestätigung zurückgegeben werden.

Der Callback wird mit drei Argumenten aufgerufen: ein Fehlerargument, das `null` ist, wenn der `PING` erfolgreich bestätigt wurde, ein `duration`-Argument, das die Anzahl der Millisekunden seit dem Senden des Pings und dem Empfang der Bestätigung angibt, und ein `Buffer`, das den 8-Byte-`PING`-Payload enthält.

```js [ESM]
session.ping(Buffer.from('abcdefgh'), (err, duration, payload) => {
  if (!err) {
    console.log(`Ping bestätigt in ${duration} Millisekunden`);
    console.log(`Mit Payload '${payload.toString()}'`);
  }
});
```
Wenn das `payload`-Argument nicht angegeben wird, ist der Standard-Payload der 64-Bit-Zeitstempel (Little-Endian), der den Beginn der `PING`-Dauer markiert.


#### `http2session.ref()` {#http2sessionref}

**Hinzugefügt in: v9.4.0**

Ruft [`ref()`](/de/nodejs/api/net#socketref) auf der zugrunde liegenden [`net.Socket`](/de/nodejs/api/net#class-netsocket) Instanz dieser `Http2Session` auf.

#### `http2session.remoteSettings` {#http2sessionremotesettings}

**Hinzugefügt in: v8.4.0**

- [\<HTTP/2-Einstellungsobjekt\>](/de/nodejs/api/http2#settings-object)

Ein prototypenloses Objekt, das die aktuellen Remote-Einstellungen dieser `Http2Session` beschreibt. Die Remote-Einstellungen werden vom *verbundenen* HTTP/2-Peer gesetzt.

#### `http2session.setLocalWindowSize(windowSize)` {#http2sessionsetlocalwindowsizewindowsize}

**Hinzugefügt in: v15.3.0, v14.18.0**

- `windowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Setzt die Fenstergröße des lokalen Endpunkts. `windowSize` ist die gesamte Fenstergröße, die gesetzt werden soll, nicht die Delta.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Set local window size to be 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Set local window size to be 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```
:::

Für http2-Clients ist das entsprechende Ereignis entweder `'connect'` oder `'remoteSettings'`.

#### `http2session.setTimeout(msecs, callback)` {#http2sessionsettimeoutmsecs-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument löst jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK` aus. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Wird verwendet, um eine Callback-Funktion festzulegen, die aufgerufen wird, wenn nach `msecs` Millisekunden keine Aktivität auf der `Http2Session` stattfindet. Der angegebene `callback` wird als Listener für das `'timeout'`-Ereignis registriert.


#### `http2session.socket` {#http2sessionsocket}

**Hinzugefügt in: v8.4.0**

- [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/de/nodejs/api/tls#class-tlstlssocket)

Gibt ein `Proxy`-Objekt zurück, das als `net.Socket` (oder `tls.TLSSocket`) fungiert, aber die verfügbaren Methoden auf solche beschränkt, die sicher mit HTTP/2 verwendet werden können.

`destroy`, `emit`, `end`, `pause`, `read`, `resume` und `write` werfen einen Fehler mit dem Code `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Weitere Informationen finden Sie unter [`Http2Session` und Sockets](/de/nodejs/api/http2#http2session-and-sockets).

Die Methode `setTimeout` wird für diese `Http2Session` aufgerufen.

Alle anderen Interaktionen werden direkt an den Socket weitergeleitet.

#### `http2session.state` {#http2sessionstate}

**Hinzugefügt in: v8.4.0**

Bietet verschiedene Informationen über den aktuellen Zustand der `Http2Session`.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `effectiveLocalWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die aktuelle lokale (Empfangs-)Flusskontrollfenstergröße für die `Http2Session`.
    - `effectiveRecvDataLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die aktuelle Anzahl von Bytes, die seit dem letzten Flusssteuerungs-`WINDOW_UPDATE` empfangen wurden.
    - `nextStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die numerische Kennung, die das nächste Mal verwendet werden soll, wenn ein neuer `Http2Stream` von dieser `Http2Session` erstellt wird.
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Bytes, die der Remote-Peer senden kann, ohne ein `WINDOW_UPDATE` zu empfangen.
    - `lastProcStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die numerische ID des `Http2Stream`, für den zuletzt ein `HEADERS`- oder `DATA`-Frame empfangen wurde.
    - `remoteWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Bytes, die diese `Http2Session` senden darf, ohne ein `WINDOW_UPDATE` zu empfangen.
    - `outboundQueueSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Frames, die sich derzeit in der ausgehenden Warteschlange für diese `Http2Session` befinden.
    - `deflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die aktuelle Größe in Bytes der ausgehenden Header-Komprimierungszustandstabelle.
    - `inflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die aktuelle Größe in Bytes der eingehenden Header-Komprimierungszustandstabelle.
  
 

Ein Objekt, das den aktuellen Status dieser `Http2Session` beschreibt.


#### `http2session.settings([settings][, callback])` {#http2sessionsettingssettings-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `settings` [\<HTTP/2-Einstellungensobjekt\>](/de/nodejs/api/http2#settings-object)
- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback, der aufgerufen wird, sobald die Sitzung verbunden ist oder sofort, wenn die Sitzung bereits verbunden ist.
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
    - `settings` [\<HTTP/2-Einstellungensobjekt\>](/de/nodejs/api/http2#settings-object) Das aktualisierte `settings`-Objekt.
    - `duration` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Aktualisiert die aktuellen lokalen Einstellungen für diese `Http2Session` und sendet einen neuen `SETTINGS`-Frame an den verbundenen HTTP/2-Peer.

Sobald diese Funktion aufgerufen wurde, ist die Eigenschaft `http2session.pendingSettingsAck` auf `true` gesetzt, während die Sitzung darauf wartet, dass der Remote-Peer die neuen Einstellungen bestätigt.

Die neuen Einstellungen werden erst wirksam, wenn die `SETTINGS`-Bestätigung empfangen wurde und das `'localSettings'`-Ereignis ausgelöst wurde. Es ist möglich, mehrere `SETTINGS`-Frames zu senden, während die Bestätigung noch aussteht.

#### `http2session.type` {#http2sessiontype}

**Hinzugefügt in: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`http2session.type` ist gleich `http2.constants.NGHTTP2_SESSION_SERVER`, wenn diese `Http2Session`-Instanz ein Server ist, und `http2.constants.NGHTTP2_SESSION_CLIENT`, wenn die Instanz ein Client ist.

#### `http2session.unref()` {#http2sessionunref}

**Hinzugefügt in: v9.4.0**

Ruft [`unref()`](/de/nodejs/api/net#socketunref) auf der zugrunde liegenden [`net.Socket`](/de/nodejs/api/net#class-netsocket) dieser `Http2Session`-Instanz auf.


### Klasse: `ServerHttp2Session` {#class-serverhttp2session}

**Hinzugefügt in: v8.4.0**

- Erweitert: [\<Http2Session\>](/de/nodejs/api/http2#class-http2session)

#### `serverhttp2session.altsvc(alt, originOrStream)` {#serverhttp2sessionaltsvcalt-originorstream}

**Hinzugefügt in: v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine Beschreibung der alternativen Servicekonfiguration, wie in [RFC 7838](https://tools.ietf.org/html/rfc7838) definiert.
- `originOrStream` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Entweder eine URL-Zeichenkette, die den Ursprung angibt (oder ein `Object` mit einer `origin`-Eigenschaft) oder der numerische Bezeichner eines aktiven `Http2Stream`, wie er von der `http2stream.id`-Eigenschaft angegeben wird.

Übermittelt einen `ALTSVC`-Frame (wie in [RFC 7838](https://tools.ietf.org/html/rfc7838) definiert) an den verbundenen Client.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
server.on('session', (session) => {
  // Set altsvc for origin https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Set altsvc for a specific stream
  stream.session.altsvc('h2=":8000"', stream.id);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
server.on('session', (session) => {
  // Set altsvc for origin https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Set altsvc for a specific stream
  stream.session.altsvc('h2=":8000"', stream.id);
});
```
:::

Das Senden eines `ALTSVC`-Frames mit einer bestimmten Stream-ID zeigt an, dass der alternative Dienst dem Ursprung des angegebenen `Http2Stream` zugeordnet ist.

Die `alt`- und Ursprungszeichenkette *müssen* nur ASCII-Bytes enthalten und werden strikt als eine Folge von ASCII-Bytes interpretiert. Der spezielle Wert `'clear'` kann übergeben werden, um einen zuvor festgelegten alternativen Dienst für eine bestimmte Domain zu löschen.

Wenn eine Zeichenkette für das `originOrStream`-Argument übergeben wird, wird sie als URL geparst und der Ursprung wird abgeleitet. Zum Beispiel ist der Ursprung für die HTTP-URL `'https://example.org/foo/bar'` die ASCII-Zeichenkette `'https://example.org'`. Es wird ein Fehler geworfen, wenn entweder die angegebene Zeichenkette nicht als URL geparst werden kann oder wenn kein gültiger Ursprung abgeleitet werden kann.

Ein `URL`-Objekt oder ein beliebiges Objekt mit einer `origin`-Eigenschaft kann als `originOrStream` übergeben werden, in diesem Fall wird der Wert der `origin`-Eigenschaft verwendet. Der Wert der `origin`-Eigenschaft *muss* ein korrekt serialisierter ASCII-Ursprung sein.


#### Spezifizieren alternativer Dienste {#specifying-alternative-services}

Das Format des Parameters `alt` ist durch [RFC 7838](https://tools.ietf.org/html/rfc7838) strikt als eine ASCII-Zeichenkette definiert, die eine durch Kommas getrennte Liste von "alternativen" Protokollen enthält, die mit einem bestimmten Host und Port verbunden sind.

Der Wert `'h2="example.org:81"'` gibt beispielsweise an, dass das HTTP/2-Protokoll auf dem Host `'example.org'` auf dem TCP/IP-Port 81 verfügbar ist. Host und Port *müssen* sich innerhalb der Anführungszeichen (`"`) befinden.

Es können mehrere Alternativen angegeben werden, beispielsweise: `'h2="example.org:81", h2=":82"'`.

Die Protokollkennung (`'h2'` in den Beispielen) kann eine beliebige gültige [ALPN-Protokoll-ID](https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml#alpn-protocol-ids) sein.

Die Syntax dieser Werte wird von der Node.js-Implementierung nicht validiert und unverändert vom Benutzer bereitgestellt oder vom Peer empfangen.

#### `serverhttp2session.origin(...origins)` {#serverhttp2sessionoriginorigins}

**Hinzugefügt in: v10.12.0**

- `origins` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein oder mehrere URL-Strings, die als separate Argumente übergeben werden.

Sendet einen `ORIGIN`-Frame (wie in [RFC 8336](https://tools.ietf.org/html/rfc8336) definiert) an den verbundenen Client, um die Menge der Ursprünge anzukündigen, für die der Server autorisierende Antworten geben kann.

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

Wenn ein String als `origin` übergeben wird, wird er als URL geparst und der Ursprung abgeleitet. Der Ursprung für die HTTP-URL `'https://example.org/foo/bar'` ist beispielsweise der ASCII-String `'https://example.org'`. Es wird ein Fehler ausgegeben, wenn entweder der angegebene String nicht als URL geparst werden kann oder wenn kein gültiger Ursprung abgeleitet werden kann.

Ein `URL`-Objekt oder ein beliebiges Objekt mit einer `origin`-Eigenschaft kann als `origin` übergeben werden. In diesem Fall wird der Wert der `origin`-Eigenschaft verwendet. Der Wert der `origin`-Eigenschaft *muss* ein korrekt serialisierter ASCII-Ursprung sein.

Alternativ kann die Option `origins` verwendet werden, wenn ein neuer HTTP/2-Server mit der Methode `http2.createSecureServer()` erstellt wird:

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


### Klasse: `ClientHttp2Session` {#class-clienthttp2session}

**Hinzugefügt in: v8.4.0**

- Erweitert: [\<Http2Session\>](/de/nodejs/api/http2#class-http2session)

#### Ereignis: `'altsvc'` {#event-altsvc}

**Hinzugefügt in: v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `streamId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Das Ereignis `'altsvc'` wird ausgelöst, wenn ein `ALTSVC`-Frame vom Client empfangen wird. Das Ereignis wird mit dem `ALTSVC`-Wert, dem Ursprung und der Stream-ID ausgelöst. Wenn im `ALTSVC`-Frame kein `origin` angegeben ist, ist `origin` eine leere Zeichenkette.

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

#### Ereignis: `'origin'` {#event-origin}

**Hinzugefügt in: v10.12.0**

- `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Das Ereignis `'origin'` wird ausgelöst, wenn ein `ORIGIN`-Frame vom Client empfangen wird. Das Ereignis wird mit einem Array von `origin`-Zeichenketten ausgelöst. Das `http2session.originSet` wird aktualisiert, um die empfangenen Ursprünge zu enthalten.

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

Das Ereignis `'origin'` wird nur bei Verwendung einer sicheren TLS-Verbindung ausgelöst.


#### `clienthttp2session.request(headers[, options])` {#clienthttp2sessionrequestheaders-options}

**Hinzugefügt in: v8.4.0**

-  `headers` [\<HTTP/2 Header-Objekt\>](/de/nodejs/api/http2#headers-object)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn die *beschreibbare* Seite des `Http2Stream` anfänglich geschlossen werden soll, z. B. beim Senden einer `GET`-Anfrage, die keinen Payload-Body erwarten sollte.
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true` und `parent` einen übergeordneten Stream identifiziert, wird der erstellte Stream zur einzigen direkten Abhängigkeit des übergeordneten Streams gemacht, wobei alle anderen vorhandenen abhängigen Streams zu einer Abhängigkeit des neu erstellten Streams gemacht werden. **Standard:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die numerische Kennung eines Streams an, von dem der neu erstellte Stream abhängig ist.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die relative Abhängigkeit eines Streams in Bezug auf andere Streams mit demselben `parent` an. Der Wert ist eine Zahl zwischen `1` und `256` (einschließlich).
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, emittiert der `Http2Stream` das Ereignis `'wantTrailers'` nachdem der letzte `DATA`-Frame gesendet wurde.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ein AbortSignal, das verwendet werden kann, um eine laufende Anfrage abzubrechen.


-  Gibt zurück: [\<ClientHttp2Stream\>](/de/nodejs/api/http2#class-clienthttp2stream)

Nur für HTTP/2-Client `Http2Session`-Instanzen erstellt `http2session.request()` eine `Http2Stream`-Instanz und gibt sie zurück, die verwendet werden kann, um eine HTTP/2-Anfrage an den verbundenen Server zu senden.

Wenn eine `ClientHttp2Session` zum ersten Mal erstellt wird, ist der Socket möglicherweise noch nicht verbunden. Wenn `clienthttp2session.request()` während dieser Zeit aufgerufen wird, wird die eigentliche Anfrage verzögert, bis der Socket betriebsbereit ist. Wenn die `session` geschlossen wird, bevor die eigentliche Anfrage ausgeführt wird, wird ein `ERR_HTTP2_GOAWAY_SESSION` ausgelöst.

Diese Methode ist nur verfügbar, wenn `http2session.type` gleich `http2.constants.NGHTTP2_SESSION_CLIENT` ist.

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

Wenn die Option `options.waitForTrailers` gesetzt ist, wird das Ereignis `'wantTrailers'` unmittelbar nach dem Einreihen des letzten Chunks von Payload-Daten, die gesendet werden sollen, emittiert. Die Methode `http2stream.sendTrailers()` kann dann aufgerufen werden, um abschließende Header an den Peer zu senden.

Wenn `options.waitForTrailers` gesetzt ist, wird der `Http2Stream` nicht automatisch geschlossen, wenn der letzte `DATA`-Frame übertragen wird. Der Benutzercode muss entweder `http2stream.sendTrailers()` oder `http2stream.close()` aufrufen, um den `Http2Stream` zu schließen.

Wenn `options.signal` mit einem `AbortSignal` gesetzt ist und dann `abort` auf dem entsprechenden `AbortController` aufgerufen wird, emittiert die Anfrage ein `'error'`-Ereignis mit einem `AbortError`-Fehler.

Die Pseudo-Header `:method` und `:path` werden nicht innerhalb von `headers` angegeben, sie werden jeweils standardmäßig auf Folgendes gesetzt:

- `:method` = `'GET'`
- `:path` = `/`


### Klasse: `Http2Stream` {#class-http2stream}

**Hinzugefügt in: v8.4.0**

- Erweitert: [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Jede Instanz der Klasse `Http2Stream` repräsentiert einen bidirektionalen HTTP/2-Kommunikationsstream über eine `Http2Session`-Instanz. Jede einzelne `Http2Session` kann während ihrer Lebensdauer bis zu 2-1 `Http2Stream`-Instanzen haben.

Benutzercode konstruiert `Http2Stream`-Instanzen nicht direkt. Stattdessen werden diese durch die `Http2Session`-Instanz erstellt, verwaltet und dem Benutzercode zur Verfügung gestellt. Auf dem Server werden `Http2Stream`-Instanzen entweder als Reaktion auf eine eingehende HTTP-Anfrage erstellt (und über das `'stream'`-Ereignis an den Benutzercode übergeben), oder als Reaktion auf einen Aufruf der Methode `http2stream.pushStream()`. Auf dem Client werden `Http2Stream`-Instanzen erstellt und zurückgegeben, wenn entweder die Methode `http2session.request()` aufgerufen wird oder als Reaktion auf ein eingehendes `'push'`-Ereignis.

Die Klasse `Http2Stream` ist eine Basis für die Klassen [`ServerHttp2Stream`](/de/nodejs/api/http2#class-serverhttp2stream) und [`ClientHttp2Stream`](/de/nodejs/api/http2#class-clienthttp2stream), von denen jede speziell von der Server- bzw. Clientseite verwendet wird.

Alle `Http2Stream`-Instanzen sind [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Streams. Die `Writable`-Seite des `Duplex` wird verwendet, um Daten an den verbundenen Peer zu senden, während die `Readable`-Seite verwendet wird, um Daten zu empfangen, die vom verbundenen Peer gesendet werden.

Die Standardtextzeichenkodierung für einen `Http2Stream` ist UTF-8. Verwenden Sie beim Senden von Text über einen `Http2Stream` den Header `'content-type'`, um die Zeichenkodierung festzulegen.

```js [ESM]
stream.respond({
  'content-type': 'text/html; charset=utf-8',
  ':status': 200,
});
```
#### `Http2Stream` Lebenszyklus {#http2stream-lifecycle}

##### Erstellung {#creation}

Auf der Serverseite werden Instanzen von [`ServerHttp2Stream`](/de/nodejs/api/http2#class-serverhttp2stream) entweder erstellt, wenn:

- Ein neuer HTTP/2 `HEADERS`-Frame mit einer zuvor unbenutzten Stream-ID empfangen wird;
- Die Methode `http2stream.pushStream()` aufgerufen wird.

Auf der Clientseite werden Instanzen von [`ClientHttp2Stream`](/de/nodejs/api/http2#class-clienthttp2stream) erstellt, wenn die Methode `http2session.request()` aufgerufen wird.

Auf dem Client ist die von `http2session.request()` zurückgegebene `Http2Stream`-Instanz möglicherweise nicht sofort einsatzbereit, wenn die übergeordnete `Http2Session` noch nicht vollständig eingerichtet wurde. In solchen Fällen werden Operationen, die auf der `Http2Stream` aufgerufen werden, bis zum Auslösen des Ereignisses `'ready'` gepuffert. Benutzercode sollte das Ereignis `'ready'` nur selten oder gar nicht direkt behandeln müssen. Der Bereitschaftsstatus eines `Http2Stream` kann durch Überprüfen des Werts von `http2stream.id` ermittelt werden. Wenn der Wert `undefined` ist, ist der Stream noch nicht einsatzbereit.


##### Zerstörung {#destruction}

Alle [`Http2Stream`](/de/nodejs/api/http2#class-http2stream)-Instanzen werden zerstört, entweder wenn:

- Ein `RST_STREAM`-Frame für den Stream vom verbundenen Peer empfangen wird und (nur für Client-Streams) ausstehende Daten gelesen wurden.
- Die Methode `http2stream.close()` aufgerufen wird und (nur für Client-Streams) ausstehende Daten gelesen wurden.
- Die Methoden `http2stream.destroy()` oder `http2session.destroy()` aufgerufen werden.

Wenn eine `Http2Stream`-Instanz zerstört wird, wird versucht, einen `RST_STREAM`-Frame an den verbundenen Peer zu senden.

Wenn die `Http2Stream`-Instanz zerstört wird, wird das `'close'`-Ereignis ausgelöst. Da `Http2Stream` eine Instanz von `stream.Duplex` ist, wird auch das `'end'`-Ereignis ausgelöst, wenn die Stream-Daten gerade fließen. Das `'error'`-Ereignis kann auch ausgelöst werden, wenn `http2stream.destroy()` mit einem `Error` als erstem Argument aufgerufen wurde.

Nachdem der `Http2Stream` zerstört wurde, ist die Eigenschaft `http2stream.destroyed` `true` und die Eigenschaft `http2stream.rstCode` gibt den `RST_STREAM`-Fehlercode an. Die `Http2Stream`-Instanz ist nach der Zerstörung nicht mehr verwendbar.

#### Ereignis: `'aborted'` {#event-aborted}

**Hinzugefügt in: v8.4.0**

Das `'aborted'`-Ereignis wird immer dann ausgelöst, wenn eine `Http2Stream`-Instanz während der Kommunikation abnormal abgebrochen wird. Sein Listener erwartet keine Argumente.

Das `'aborted'`-Ereignis wird nur ausgelöst, wenn die beschreibbare Seite des `Http2Stream` nicht beendet wurde.

#### Ereignis: `'close'` {#event-close_1}

**Hinzugefügt in: v8.4.0**

Das `'close'`-Ereignis wird ausgelöst, wenn der `Http2Stream` zerstört wird. Sobald dieses Ereignis ausgelöst wird, ist die `Http2Stream`-Instanz nicht mehr verwendbar.

Der HTTP/2-Fehlercode, der beim Schließen des Streams verwendet wurde, kann mit der Eigenschaft `http2stream.rstCode` abgerufen werden. Wenn der Code ein anderer Wert als `NGHTTP2_NO_ERROR` (`0`) ist, wurde auch ein `'error'`-Ereignis ausgelöst.

#### Ereignis: `'error'` {#event-error_1}

**Hinzugefügt in: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Das `'error'`-Ereignis wird ausgelöst, wenn während der Verarbeitung eines `Http2Stream` ein Fehler auftritt.


#### Ereignis: `'frameError'` {#event-frameerror_1}

**Hinzugefügt in: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Frame-Typ.
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Fehlercode.
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Stream-ID (oder `0`, wenn der Frame keinem Stream zugeordnet ist).

Das `'frameError'`-Ereignis wird ausgelöst, wenn beim Senden eines Frames ein Fehler auftritt. Beim Aufruf empfängt die Handler-Funktion ein Integer-Argument, das den Frame-Typ identifiziert, und ein Integer-Argument, das den Fehlercode identifiziert. Die `Http2Stream`-Instanz wird unmittelbar nach dem Auslösen des `'frameError'`-Ereignisses zerstört.

#### Ereignis: `'ready'` {#event-ready}

**Hinzugefügt in: v8.4.0**

Das `'ready'`-Ereignis wird ausgelöst, wenn der `Http2Stream` geöffnet wurde, eine `id` zugewiesen wurde und er verwendet werden kann. Der Listener erwartet keine Argumente.

#### Ereignis: `'timeout'` {#event-timeout_1}

**Hinzugefügt in: v8.4.0**

Das `'timeout'`-Ereignis wird ausgelöst, nachdem für diesen `Http2Stream` innerhalb der mit `http2stream.setTimeout()` festgelegten Millisekunden keine Aktivität empfangen wurde. Sein Listener erwartet keine Argumente.

#### Ereignis: `'trailers'` {#event-trailers}

**Hinzugefügt in: v8.4.0**

- `headers` [\<HTTP/2-Header-Objekt\>](/de/nodejs/api/http2#headers-object) Ein Objekt, das die Header beschreibt
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die zugehörigen numerischen Flags

Das `'trailers'`-Ereignis wird ausgelöst, wenn ein Block von Headern empfangen wird, der zu nachgestellten Header-Feldern gehört. Der Listener-Callback erhält das [HTTP/2-Header-Objekt](/de/nodejs/api/http2#headers-object) und die mit den Headern verbundenen Flags übergeben.

Dieses Ereignis wird möglicherweise nicht ausgelöst, wenn `http2stream.end()` aufgerufen wird, bevor Trailer empfangen werden und die eingehenden Daten nicht gelesen oder auf sie gewartet wird.

```js [ESM]
stream.on('trailers', (headers, flags) => {
  console.log(headers);
});
```

#### Event: `'wantTrailers'` {#event-wanttrailers}

**Hinzugefügt in: v10.0.0**

Das `'wantTrailers'`-Ereignis wird ausgelöst, wenn der `Http2Stream` den letzten `DATA`-Frame in eine Warteschlange gestellt hat, der in einem Frame gesendet werden soll, und der `Http2Stream` bereit ist, nachfolgende Header zu senden. Beim Initiieren einer Anfrage oder Antwort muss die Option `waitForTrailers` gesetzt sein, damit dieses Ereignis ausgelöst wird.

#### `http2stream.aborted` {#http2streamaborted}

**Hinzugefügt in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wird auf `true` gesetzt, wenn die `Http2Stream`-Instanz abnormal abgebrochen wurde. Wenn gesetzt, wurde das `'aborted'`-Ereignis ausgelöst.

#### `http2stream.bufferSize` {#http2streambuffersize}

**Hinzugefügt in: v11.2.0, v10.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Diese Eigenschaft zeigt die Anzahl der Zeichen, die derzeit zum Schreiben gepuffert werden. Siehe [`net.Socket.bufferSize`](/de/nodejs/api/net#socketbuffersize) für Details.

#### `http2stream.close(code[, callback])` {#http2streamclosecode-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Vorzeichenlose 32-Bit-Ganzzahl, die den Fehlercode identifiziert. **Standard:** `http2.constants.NGHTTP2_NO_ERROR` (`0x00`).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine optionale Funktion, die registriert ist, um auf das `'close'`-Ereignis zu warten.

Schließt die `Http2Stream`-Instanz, indem ein `RST_STREAM`-Frame an den verbundenen HTTP/2-Peer gesendet wird.

#### `http2stream.closed` {#http2streamclosed}

**Hinzugefügt in: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wird auf `true` gesetzt, wenn die `Http2Stream`-Instanz geschlossen wurde.

#### `http2stream.destroyed` {#http2streamdestroyed}

**Hinzugefügt in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wird auf `true` gesetzt, wenn die `Http2Stream`-Instanz zerstört wurde und nicht mehr verwendbar ist.


#### `http2stream.endAfterHeaders` {#http2streamendafterheaders}

**Hinzugefügt in: v10.11.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wird auf `true` gesetzt, wenn das `END_STREAM`-Flag im empfangenen Request- oder Response-HEADERS-Frame gesetzt wurde, was darauf hindeutet, dass keine zusätzlichen Daten empfangen werden sollen und die lesbare Seite des `Http2Stream` geschlossen wird.

#### `http2stream.id` {#http2streamid}

**Hinzugefügt in: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Die numerische Stream-Kennung dieser `Http2Stream`-Instanz. Wird auf `undefined` gesetzt, wenn die Stream-Kennung noch nicht zugewiesen wurde.

#### `http2stream.pending` {#http2streampending}

**Hinzugefügt in: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wird auf `true` gesetzt, wenn der `Http2Stream`-Instanz noch keine numerische Stream-Kennung zugewiesen wurde.

#### `http2stream.priority(options)` {#http2streampriorityoptions}

**Hinzugefügt in: v8.4.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true` und `parent` einen übergeordneten Stream identifiziert, wird dieser Stream zur einzigen direkten Abhängigkeit des übergeordneten Streams gemacht, wobei alle anderen vorhandenen abhängigen Streams zu einer Abhängigkeit dieses Streams gemacht werden. **Standard:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die numerische Kennung eines Streams an, von dem dieser Stream abhängig ist.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die relative Abhängigkeit eines Streams in Bezug auf andere Streams mit demselben `parent` an. Der Wert ist eine Zahl zwischen `1` und `256` (einschließlich).
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, ändert die Priorität lokal, ohne einen `PRIORITY`-Frame an den verbundenen Peer zu senden.
  
 

Aktualisiert die Priorität für diese `Http2Stream`-Instanz.


#### `http2stream.rstCode` {#http2streamrstcode}

**Hinzugefügt in: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Wird auf den `RST_STREAM` [Fehlercode](/de/nodejs/api/http2#error-codes-for-rst_stream-and-goaway) gesetzt, der gemeldet wird, wenn der `Http2Stream` zerstört wird, nachdem entweder ein `RST_STREAM`-Frame vom verbundenen Peer empfangen wurde, `http2stream.close()` oder `http2stream.destroy()` aufgerufen wurde. Ist `undefined`, wenn der `Http2Stream` nicht geschlossen wurde.

#### `http2stream.sentHeaders` {#http2streamsentheaders}

**Hinzugefügt in: v9.5.0**

- [\<HTTP/2 Header-Objekt\>](/de/nodejs/api/http2#headers-object)

Ein Objekt, das die ausgehenden Header enthält, die für diesen `Http2Stream` gesendet wurden.

#### `http2stream.sentInfoHeaders` {#http2streamsentinfoheaders}

**Hinzugefügt in: v9.5.0**

- [\<HTTP/2 Header-Objekt[]\>](/de/nodejs/api/http2#headers-object)

Ein Array von Objekten, das die ausgehenden informativen (zusätzlichen) Header enthält, die für diesen `Http2Stream` gesendet wurden.

#### `http2stream.sentTrailers` {#http2streamsenttrailers}

**Hinzugefügt in: v9.5.0**

- [\<HTTP/2 Header-Objekt\>](/de/nodejs/api/http2#headers-object)

Ein Objekt, das die ausgehenden Trailer enthält, die für diesen `HttpStream` gesendet wurden.

#### `http2stream.session` {#http2streamsession}

**Hinzugefügt in: v8.4.0**

- [\<Http2Session\>](/de/nodejs/api/http2#class-http2session)

Eine Referenz auf die `Http2Session`-Instanz, die diesen `Http2Stream` besitzt. Der Wert ist `undefined`, nachdem die `Http2Stream`-Instanz zerstört wurde.

#### `http2stream.setTimeout(msecs, callback)` {#http2streamsettimeoutmsecs-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)



::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const client = connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = constants;
const req = client.request({ ':path': '/' });

// Bricht den Stream ab, wenn nach 5 Sekunden keine Aktivität erfolgt
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = http2.constants;
const req = client.request({ ':path': '/' });

// Bricht den Stream ab, wenn nach 5 Sekunden keine Aktivität erfolgt
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```
:::


#### `http2stream.state` {#http2streamstate}

**Hinzugefügt in: v8.4.0**

Liefert verschiedene Informationen über den aktuellen Zustand des `Http2Stream`.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Bytes, die der verbundene Peer für diesen `Http2Stream` senden darf, ohne ein `WINDOW_UPDATE` zu empfangen.
    - `state` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein Flag, das den aktuellen Low-Level-Zustand des `Http2Stream` anzeigt, wie er von `nghttp2` bestimmt wird.
    - `localClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1`, wenn dieser `Http2Stream` lokal geschlossen wurde.
    - `remoteClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1`, wenn dieser `Http2Stream` remote geschlossen wurde.
    - `sumDependencyWeight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Summe der Gewichtung aller `Http2Stream`-Instanzen, die von diesem `Http2Stream` abhängen, wie durch `PRIORITY`-Frames spezifiziert.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Prioritätsgewichtung dieses `Http2Stream`.

Ein aktueller Zustand dieses `Http2Stream`.

#### `http2stream.sendTrailers(headers)` {#http2streamsendtrailersheaders}

**Hinzugefügt in: v10.0.0**

- `headers` [\<HTTP/2 Headers Object\>](/de/nodejs/api/http2#headers-object)

Sendet einen abschließenden `HEADERS`-Frame an den verbundenen HTTP/2-Peer. Diese Methode bewirkt, dass der `Http2Stream` sofort geschlossen wird und darf nur aufgerufen werden, nachdem das `'wantTrailers'`-Ereignis ausgelöst wurde. Beim Senden einer Anfrage oder beim Senden einer Antwort muss die Option `options.waitForTrailers` gesetzt sein, um den `Http2Stream` nach dem letzten `DATA`-Frame offen zu halten, damit Trailer gesendet werden können.

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

Die HTTP/1-Spezifikation verbietet, dass Trailer HTTP/2-Pseudo-Header-Felder (z. B. `':method'`, `':path'`, usw.) enthalten.


### Klasse: `ClientHttp2Stream` {#class-clienthttp2stream}

**Hinzugefügt in: v8.4.0**

- Erweitert [\<Http2Stream\>](/de/nodejs/api/http2#class-http2stream)

Die Klasse `ClientHttp2Stream` ist eine Erweiterung von `Http2Stream`, die ausschließlich auf HTTP/2-Clients verwendet wird. `Http2Stream`-Instanzen auf dem Client stellen Ereignisse wie `'response'` und `'push'` bereit, die nur auf dem Client relevant sind.

#### Ereignis: `'continue'` {#event-continue}

**Hinzugefügt in: v8.5.0**

Wird ausgelöst, wenn der Server einen `100 Continue`-Status sendet, normalerweise weil die Anfrage `Expect: 100-continue` enthielt. Dies ist eine Anweisung, dass der Client den Anfragetext senden soll.

#### Ereignis: `'headers'` {#event-headers}

**Hinzugefügt in: v8.4.0**

- `headers` [\<HTTP/2-Header-Objekt\>](/de/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Das `'headers'`-Ereignis wird ausgelöst, wenn ein zusätzlicher Header-Block für einen Stream empfangen wird, z. B. wenn ein Block mit `1xx` informativen Headern empfangen wird. Der Listener-Callback erhält das [HTTP/2-Header-Objekt](/de/nodejs/api/http2#headers-object) und die mit den Headern verbundenen Flags.

```js [ESM]
stream.on('headers', (headers, flags) => {
  console.log(headers);
});
```
#### Ereignis: `'push'` {#event-push}

**Hinzugefügt in: v8.4.0**

- `headers` [\<HTTP/2-Header-Objekt\>](/de/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Das `'push'`-Ereignis wird ausgelöst, wenn Antwortheader für einen Server-Push-Stream empfangen werden. Der Listener-Callback erhält das [HTTP/2-Header-Objekt](/de/nodejs/api/http2#headers-object) und die mit den Headern verbundenen Flags.

```js [ESM]
stream.on('push', (headers, flags) => {
  console.log(headers);
});
```
#### Ereignis: `'response'` {#event-response}

**Hinzugefügt in: v8.4.0**

- `headers` [\<HTTP/2-Header-Objekt\>](/de/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Das `'response'`-Ereignis wird ausgelöst, wenn ein `HEADERS`-Antwort-Frame für diesen Stream vom verbundenen HTTP/2-Server empfangen wurde. Der Listener wird mit zwei Argumenten aufgerufen: einem `Object`, das das empfangene [HTTP/2-Header-Objekt](/de/nodejs/api/http2#headers-object) enthält, und Flags, die mit den Headern verbunden sind.



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


### Klasse: `ServerHttp2Stream` {#class-serverhttp2stream}

**Hinzugefügt in: v8.4.0**

- Erweitert: [\<Http2Stream\>](/de/nodejs/api/http2#class-http2stream)

Die Klasse `ServerHttp2Stream` ist eine Erweiterung von [`Http2Stream`](/de/nodejs/api/http2#class-http2stream), die ausschließlich auf HTTP/2-Servern verwendet wird. `Http2Stream`-Instanzen auf dem Server bieten zusätzliche Methoden wie `http2stream.pushStream()` und `http2stream.respond()`, die nur auf dem Server relevant sind.

#### `http2stream.additionalHeaders(headers)` {#http2streamadditionalheadersheaders}

**Hinzugefügt in: v8.4.0**

- `headers` [\<HTTP/2 Header-Objekt\>](/de/nodejs/api/http2#headers-object)

Sendet einen zusätzlichen informellen `HEADERS`-Frame an den verbundenen HTTP/2-Peer.

#### `http2stream.headersSent` {#http2streamheaderssent}

**Hinzugefügt in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wahr, wenn Header gesendet wurden, andernfalls falsch (nur lesbar).

#### `http2stream.pushAllowed` {#http2streampushallowed}

**Hinzugefügt in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Nur-Lese-Eigenschaft, die dem Flag `SETTINGS_ENABLE_PUSH` des letzten `SETTINGS`-Frames des Remote-Clients zugeordnet ist. Ist `true`, wenn der Remote-Peer Push-Streams akzeptiert, andernfalls `false`. Die Einstellungen sind für jeden `Http2Stream` in derselben `Http2Session` gleich.

#### `http2stream.pushStream(headers[, options], callback)` {#http2streampushstreamheaders-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `headers` [\<HTTP/2 Header-Objekt\>](/de/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true` und `parent` einen übergeordneten Stream identifiziert, wird der erstellte Stream zur einzigen direkten Abhängigkeit des übergeordneten Elements gemacht, wobei alle anderen vorhandenen abhängigen Elemente zu einer Abhängigkeit des neu erstellten Streams gemacht werden. **Standard:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die numerische Kennung eines Streams an, von dem der neu erstellte Stream abhängig ist.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback, der aufgerufen wird, sobald der Push-Stream initiiert wurde.
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `pushStream` [\<ServerHttp2Stream\>](/de/nodejs/api/http2#class-serverhttp2stream) Das zurückgegebene `pushStream`-Objekt.
    - `headers` [\<HTTP/2 Header-Objekt\>](/de/nodejs/api/http2#headers-object) Header-Objekt, mit dem der `pushStream` initiiert wurde.

Initiiert einen Push-Stream. Der Callback wird mit der neuen `Http2Stream`-Instanz aufgerufen, die für den Push-Stream erstellt wurde und als zweites Argument übergeben wird, oder mit einem `Error`, der als erstes Argument übergeben wird.

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

Das Festlegen des Gewichts eines Push-Streams ist im `HEADERS`-Frame nicht zulässig. Übergeben Sie einen `weight`-Wert an `http2stream.priority` mit der Option `silent`, die auf `true` gesetzt ist, um serverseitiges Bandbreiten-Balancing zwischen gleichzeitigen Streams zu ermöglichen.

Das Aufrufen von `http2stream.pushStream()` innerhalb eines Push-Streams ist nicht zulässig und löst einen Fehler aus.


#### `http2stream.respond([headers[, options]])` {#http2streamrespondheaders-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.5.0, v12.19.0 | Erlaubt das explizite Setzen von Datumsheadern. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `headers` [\<HTTP/2 Header Objekt\>](/de/nodejs/api/http2#headers-object)
- `options` [\<Objekt\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Auf `true` setzen, um anzugeben, dass die Antwort keine Nutzdaten enthält.
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, emittiert der `Http2Stream` das `'wantTrailers'`-Ereignis, nachdem der letzte `DATA`-Frame gesendet wurde.




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

Initiiert eine Antwort. Wenn die Option `options.waitForTrailers` gesetzt ist, wird das `'wantTrailers'`-Ereignis unmittelbar nach dem Queuing des letzten Chunks von Nutzdaten, die gesendet werden sollen, emittiert. Die Methode `http2stream.sendTrailers()` kann dann verwendet werden, um nachfolgende Headerfelder an den Peer zu senden.

Wenn `options.waitForTrailers` gesetzt ist, wird der `Http2Stream` nicht automatisch geschlossen, wenn der letzte `DATA`-Frame übertragen wird. Benutzercode muss entweder `http2stream.sendTrailers()` oder `http2stream.close()` aufrufen, um den `Http2Stream` zu schließen.

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

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.5.0, v12.19.0 | Explizites Setzen von Datum-Headern erlaubt. |
| v12.12.0 | Die Option `fd` kann jetzt ein `FileHandle` sein. |
| v10.0.0 | Jeder lesbare File Descriptor, nicht notwendigerweise für eine reguläre Datei, wird jetzt unterstützt. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle) Ein lesbarer File Descriptor.
- `headers` [\<HTTP/2 Header-Objekt\>](/de/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird der `Http2Stream` das `'wantTrailers'`-Event auslösen, nachdem der letzte `DATA`-Frame gesendet wurde.
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Offset-Position, an der mit dem Lesen begonnen werden soll.
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Datenmenge vom fd, die gesendet werden soll.

Initiiert eine Antwort, deren Daten aus dem angegebenen File Descriptor gelesen werden. Es wird keine Validierung des angegebenen File Descriptors durchgeführt. Wenn beim Versuch, Daten mit dem File Descriptor zu lesen, ein Fehler auftritt, wird der `Http2Stream` mit einem `RST_STREAM`-Frame unter Verwendung des Standard-Codes `INTERNAL_ERROR` geschlossen.

Wenn verwendet, wird die `Duplex`-Schnittstelle des `Http2Stream`-Objekts automatisch geschlossen.

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

Die optionale Funktion `options.statCheck` kann angegeben werden, um dem Benutzercode die Möglichkeit zu geben, zusätzliche Content-Header basierend auf den `fs.Stat`-Details des angegebenen fd zu setzen. Wenn die Funktion `statCheck` bereitgestellt wird, führt die Methode `http2stream.respondWithFD()` einen `fs.fstat()`-Aufruf durch, um Details zum bereitgestellten File Descriptor zu sammeln.

Die Optionen `offset` und `length` können verwendet werden, um die Antwort auf eine bestimmte Bereichsteilmenge zu beschränken. Dies kann beispielsweise zur Unterstützung von HTTP-Range-Anforderungen verwendet werden.

Der File Descriptor oder `FileHandle` wird nicht geschlossen, wenn der Stream geschlossen wird, daher muss er manuell geschlossen werden, sobald er nicht mehr benötigt wird. Die gleichzeitige Verwendung desselben File Descriptors für mehrere Streams wird nicht unterstützt und kann zu Datenverlust führen. Die Wiederverwendung eines File Descriptors, nachdem ein Stream abgeschlossen ist, wird unterstützt.

Wenn die Option `options.waitForTrailers` gesetzt ist, wird das Ereignis `'wantTrailers'` unmittelbar nach dem Einreihen des letzten Teils der Nutzlastdaten, die gesendet werden sollen, ausgelöst. Die Methode `http2stream.sendTrailers()` kann dann verwendet werden, um nachlaufende Header-Felder an den Peer zu senden.

Wenn `options.waitForTrailers` gesetzt ist, wird der `Http2Stream` nicht automatisch geschlossen, wenn der letzte `DATA`-Frame übertragen wird. Benutzercode *muss* entweder `http2stream.sendTrailers()` oder `http2stream.close()` aufrufen, um den `Http2Stream` zu schließen.

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

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.5.0, v12.19.0 | Ermöglicht das explizite Setzen von Datums-Headern. |
| v10.0.0 | Jede lesbare Datei, nicht notwendigerweise eine reguläre Datei, wird jetzt unterstützt. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `headers` [\<HTTP/2 Header-Objekt\>](/de/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `onError` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback-Funktion, die im Falle eines Fehlers vor dem Senden aufgerufen wird.
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, emittiert der `Http2Stream` das `'wantTrailers'`-Ereignis, nachdem der letzte `DATA`-Frame gesendet wurde.
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Offset-Position, ab der mit dem Lesen begonnen werden soll.
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Datenmenge von der Dateideskriptor, die gesendet werden soll.

Sendet eine reguläre Datei als Antwort. Der `path` muss eine reguläre Datei angeben, andernfalls wird ein `'error'`-Ereignis auf dem `Http2Stream`-Objekt ausgelöst.

Wenn diese Funktion verwendet wird, wird die `Duplex`-Schnittstelle des `Http2Stream`-Objekts automatisch geschlossen.

Die optionale `options.statCheck`-Funktion kann angegeben werden, um dem Benutzercode die Möglichkeit zu geben, zusätzliche Inhalts-Header basierend auf den `fs.Stat`-Details der gegebenen Datei festzulegen:

Wenn beim Versuch, die Dateidaten zu lesen, ein Fehler auftritt, wird der `Http2Stream` mit einem `RST_STREAM`-Frame unter Verwendung des Standard-Codes `INTERNAL_ERROR` geschlossen. Wenn der `onError`-Callback definiert ist, wird er aufgerufen. Andernfalls wird der Stream zerstört.

Beispiel unter Verwendung eines Dateipfads:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() kann eine Ausnahme auslösen, wenn der Stream von
    // der anderen Seite zerstört wurde.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Perform actual error handling.
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
    // stream.respond() kann eine Ausnahme auslösen, wenn der Stream von
    // der anderen Seite zerstört wurde.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Perform actual error handling.
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

Die `options.statCheck`-Funktion kann auch verwendet werden, um den Sendevorgang abzubrechen, indem `false` zurückgegeben wird. Beispielsweise kann eine bedingte Anfrage die Stat-Ergebnisse überprüfen, um festzustellen, ob die Datei geändert wurde, um eine entsprechende `304`-Antwort zurückzugeben:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // Check the stat here...
    stream.respond({ ':status': 304 });
    return false; // Cancel the send operation
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
    // Check the stat here...
    stream.respond({ ':status': 304 });
    return false; // Cancel the send operation
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```
:::

Das Header-Feld `content-length` wird automatisch gesetzt.

Die Optionen `offset` und `length` können verwendet werden, um die Antwort auf eine bestimmte Bereichsteilmenge zu beschränken. Dies kann beispielsweise zur Unterstützung von HTTP-Range-Anfragen verwendet werden.

Die `options.onError`-Funktion kann auch verwendet werden, um alle Fehler zu behandeln, die auftreten können, bevor die Zustellung der Datei initiiert wird. Das Standardverhalten besteht darin, den Stream zu zerstören.

Wenn die Option `options.waitForTrailers` gesetzt ist, wird das Ereignis `'wantTrailers'` unmittelbar nach dem Einreihen des letzten Chunks von Payload-Daten, die gesendet werden sollen, ausgelöst. Die Methode `http2stream.sendTrailers()` kann dann verwendet werden, um nachfolgende Header-Felder an den Peer zu senden.

Wenn `options.waitForTrailers` gesetzt ist, wird der `Http2Stream` nicht automatisch geschlossen, wenn der letzte `DATA`-Frame übertragen wird. Der Benutzercode muss entweder `http2stream.sendTrailers()` oder `http2stream.close()` aufrufen, um den `Http2Stream` zu schließen.

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


### Klasse: `Http2Server` {#class-http2server}

**Hinzugefügt in: v8.4.0**

- Erweitert: [\<net.Server\>](/de/nodejs/api/net#class-netserver)

Instanzen von `Http2Server` werden mit der Funktion `http2.createServer()` erstellt. Die Klasse `Http2Server` wird nicht direkt vom Modul `node:http2` exportiert.

#### Ereignis: `'checkContinue'` {#event-checkcontinue}

**Hinzugefügt in: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/de/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/de/nodejs/api/http2#class-http2http2serverresponse)

Wenn ein [`'request'`]-Listener](/de/nodejs/api/http2#event-request) registriert ist oder [`http2.createServer()`](/de/nodejs/api/http2#http2createserveroptions-onrequesthandler) eine Callback-Funktion bereitstellt, wird das `'checkContinue'`-Ereignis jedes Mal ausgelöst, wenn eine Anfrage mit einem HTTP-Header `Expect: 100-continue` empfangen wird. Wenn dieses Ereignis nicht überwacht wird, antwortet der Server automatisch mit dem Status `100 Continue`, falls zutreffend.

Die Behandlung dieses Ereignisses beinhaltet den Aufruf von [`response.writeContinue()`](/de/nodejs/api/http2#responsewritecontinue), wenn der Client den Anfragetext weiterhin senden soll, oder das Generieren einer entsprechenden HTTP-Antwort (z. B. 400 Bad Request), wenn der Client den Anfragetext nicht weiterhin senden soll.

Wenn dieses Ereignis ausgelöst und behandelt wird, wird das [`'request'`]-Ereignis](/de/nodejs/api/http2#event-request) nicht ausgelöst.

#### Ereignis: `'connection'` {#event-connection}

**Hinzugefügt in: v8.4.0**

- `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Dieses Ereignis wird ausgelöst, wenn ein neuer TCP-Stream aufgebaut wird. `socket` ist typischerweise ein Objekt vom Typ [`net.Socket`](/de/nodejs/api/net#class-netsocket). Normalerweise möchten Benutzer nicht auf dieses Ereignis zugreifen.

Dieses Ereignis kann auch explizit von Benutzern ausgelöst werden, um Verbindungen in den HTTP-Server einzuschleusen. In diesem Fall kann jeder [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Stream übergeben werden.

#### Ereignis: `'request'` {#event-request}

**Hinzugefügt in: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/de/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/de/nodejs/api/http2#class-http2http2serverresponse)

Wird jedes Mal ausgelöst, wenn eine Anfrage vorliegt. Es kann mehrere Anfragen pro Sitzung geben. Siehe die [Kompatibilitäts-API](/de/nodejs/api/http2#compatibility-api).


#### Ereignis: `'session'` {#event-session}

**Hinzugefügt in: v8.4.0**

- `session` [\<ServerHttp2Session\>](/de/nodejs/api/http2#class-serverhttp2session)

Das `'session'`-Ereignis wird ausgelöst, wenn eine neue `Http2Session` vom `Http2Server` erstellt wird.

#### Ereignis: `'sessionError'` {#event-sessionerror}

**Hinzugefügt in: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/de/nodejs/api/http2#class-serverhttp2session)

Das `'sessionError'`-Ereignis wird ausgelöst, wenn ein `'error'`-Ereignis von einem `Http2Session`-Objekt ausgelöst wird, das dem `Http2Server` zugeordnet ist.

#### Ereignis: `'stream'` {#event-stream_1}

**Hinzugefügt in: v8.4.0**

- `stream` [\<Http2Stream\>](/de/nodejs/api/http2#class-http2stream) Eine Referenz zum Stream
- `headers` [\<HTTP/2 Headers Object\>](/de/nodejs/api/http2#headers-object) Ein Objekt, das die Header beschreibt
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die zugehörigen numerischen Flags
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array, das die rohen Header-Namen gefolgt von ihren jeweiligen Werten enthält.

Das `'stream'`-Ereignis wird ausgelöst, wenn ein `'stream'`-Ereignis von einer `Http2Session` ausgelöst wurde, die dem Server zugeordnet ist.

Siehe auch das `'stream'`-Ereignis von [`Http2Session`](/de/nodejs/api/http2#event-stream).

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


#### Event: `'timeout'` {#event-timeout_2}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.0.0 | Das Standard-Timeout wurde von 120s auf 0 (kein Timeout) geändert. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

Das Ereignis `'timeout'` wird ausgelöst, wenn für eine bestimmte Anzahl von Millisekunden, die mit `http2server.setTimeout()` eingestellt wurde, keine Aktivität auf dem Server stattfindet. **Standard:** 0 (kein Timeout)

#### `server.close([callback])` {#serverclosecallback}

**Hinzugefügt in: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Stoppt den Server daran, neue Sitzungen aufzubauen. Dies verhindert nicht, dass aufgrund der Persistenz von HTTP/2-Sitzungen neue Request-Streams erstellt werden. Um den Server ordnungsgemäß herunterzufahren, rufen Sie [`http2session.close()`](/de/nodejs/api/http2#http2sessionclosecallback) für alle aktiven Sitzungen auf.

Wenn `callback` bereitgestellt wird, wird er erst aufgerufen, nachdem alle aktiven Sitzungen geschlossen wurden, obwohl der Server bereits aufgehört hat, neue Sitzungen zuzulassen. Weitere Details finden Sie unter [`net.Server.close()`](/de/nodejs/api/net#serverclosecallback).

#### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Hinzugefügt in: v20.4.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Ruft [`server.close()`](/de/nodejs/api/http2#serverclosecallback) auf und gibt eine Promise zurück, die erfüllt wird, wenn der Server geschlossen wurde.

#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v13.0.0 | Das Standard-Timeout wurde von 120s auf 0 (kein Timeout) geändert. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** 0 (kein Timeout)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<Http2Server\>](/de/nodejs/api/http2#class-http2server)

Wird verwendet, um den Timeout-Wert für http2-Serveranforderungen festzulegen und eine Callback-Funktion festzulegen, die aufgerufen wird, wenn nach `msecs` Millisekunden keine Aktivität auf dem `Http2Server` stattfindet.

Der angegebene Callback wird als Listener für das Ereignis `'timeout'` registriert.

Falls `callback` keine Funktion ist, wird ein neuer `ERR_INVALID_ARG_TYPE`-Fehler ausgelöst.


#### `server.timeout` {#servertimeout}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.0.0 | Das Standard-Timeout wurde von 120s auf 0 (kein Timeout) geändert. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Timeout in Millisekunden. **Standard:** 0 (kein Timeout)

Die Anzahl der Millisekunden der Inaktivität, nach der angenommen wird, dass für einen Socket ein Timeout aufgetreten ist.

Ein Wert von `0` deaktiviert das Timeout-Verhalten für eingehende Verbindungen.

Die Socket-Timeout-Logik wird bei der Verbindung eingerichtet. Daher wirkt sich das Ändern dieses Werts nur auf neue Verbindungen zum Server aus, nicht auf vorhandene Verbindungen.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings}

**Hinzugefügt in: v15.1.0, v14.17.0**

- `settings` [\<HTTP/2 Einstellungen-Objekt\>](/de/nodejs/api/http2#settings-object)

Wird verwendet, um den Server mit den bereitgestellten Einstellungen zu aktualisieren.

Wirft `ERR_HTTP2_INVALID_SETTING_VALUE` für ungültige `settings`-Werte.

Wirft `ERR_INVALID_ARG_TYPE` für ungültiges `settings`-Argument.

### Klasse: `Http2SecureServer` {#class-http2secureserver}

**Hinzugefügt in: v8.4.0**

- Erweitert: [\<tls.Server\>](/de/nodejs/api/tls#class-tlsserver)

Instanzen von `Http2SecureServer` werden mit der Funktion `http2.createSecureServer()` erstellt. Die Klasse `Http2SecureServer` wird nicht direkt vom Modul `node:http2` exportiert.

#### Ereignis: `'checkContinue'` {#event-checkcontinue_1}

**Hinzugefügt in: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/de/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/de/nodejs/api/http2#class-http2http2serverresponse)

Wenn ein [`'request'`](/de/nodejs/api/http2#event-request)-Listener registriert ist oder [`http2.createSecureServer()`](/de/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) eine Callback-Funktion bereitgestellt wird, wird das Ereignis `'checkContinue'` jedes Mal ausgelöst, wenn eine Anfrage mit einem HTTP `Expect: 100-continue` empfangen wird. Wenn dieses Ereignis nicht überwacht wird, antwortet der Server automatisch mit dem Status `100 Continue`, sofern zutreffend.

Die Behandlung dieses Ereignisses beinhaltet den Aufruf von [`response.writeContinue()`](/de/nodejs/api/http2#responsewritecontinue), wenn der Client den Anfragetext weiterhin senden soll, oder das Generieren einer entsprechenden HTTP-Antwort (z. B. 400 Bad Request), wenn der Client den Anfragetext nicht weiterhin senden soll.

Wenn dieses Ereignis ausgelöst und behandelt wird, wird das Ereignis [`'request'`](/de/nodejs/api/http2#event-request) nicht ausgelöst.


#### Event: `'connection'` {#event-connection_1}

**Hinzugefügt in: v8.4.0**

- `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Dieses Ereignis wird ausgelöst, wenn ein neuer TCP-Stream aufgebaut wird, bevor der TLS-Handshake beginnt. `socket` ist typischerweise ein Objekt vom Typ [`net.Socket`](/de/nodejs/api/net#class-netsocket). Normalerweise sollten Benutzer nicht auf dieses Ereignis zugreifen müssen.

Dieses Ereignis kann auch explizit von Benutzern ausgelöst werden, um Verbindungen in den HTTP-Server einzuspeisen. In diesem Fall kann jeder [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Stream übergeben werden.

#### Event: `'request'` {#event-request_1}

**Hinzugefügt in: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/de/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/de/nodejs/api/http2#class-http2http2serverresponse)

Wird jedes Mal ausgelöst, wenn eine Anfrage eingeht. Es kann mehrere Anfragen pro Sitzung geben. Siehe die [Kompatibilitäts-API](/de/nodejs/api/http2#compatibility-api).

#### Event: `'session'` {#event-session_1}

**Hinzugefügt in: v8.4.0**

- `session` [\<ServerHttp2Session\>](/de/nodejs/api/http2#class-serverhttp2session)

Das `'session'`-Ereignis wird ausgelöst, wenn eine neue `Http2Session` vom `Http2SecureServer` erstellt wird.

#### Event: `'sessionError'` {#event-sessionerror_1}

**Hinzugefügt in: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/de/nodejs/api/http2#class-serverhttp2session)

Das `'sessionError'`-Ereignis wird ausgelöst, wenn ein `'error'`-Ereignis von einem `Http2Session`-Objekt ausgelöst wird, das mit dem `Http2SecureServer` verbunden ist.

#### Event: `'stream'` {#event-stream_2}

**Hinzugefügt in: v8.4.0**

- `stream` [\<Http2Stream\>](/de/nodejs/api/http2#class-http2stream) Eine Referenz zum Stream
- `headers` [\<HTTP/2-Header-Objekt\>](/de/nodejs/api/http2#headers-object) Ein Objekt, das die Header beschreibt
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die zugehörigen numerischen Flags
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array, das die rohen Header-Namen gefolgt von ihren jeweiligen Werten enthält.

Das `'stream'`-Ereignis wird ausgelöst, wenn ein `'stream'`-Ereignis von einer `Http2Session` ausgelöst wurde, die mit dem Server verbunden ist.

Siehe auch [`Http2Session`'s `'stream'` event](/de/nodejs/api/http2#event-stream).



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


#### Ereignis: `'timeout'` {#event-timeout_3}

**Hinzugefügt in: v8.4.0**

Das `'timeout'`-Ereignis wird ausgelöst, wenn auf dem Server für eine bestimmte Anzahl von Millisekunden, die mit `http2secureServer.setTimeout()` festgelegt wurde, keine Aktivität stattfindet. **Standardwert:** 2 Minuten.

#### Ereignis: `'unknownProtocol'` {#event-unknownprotocol}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Dieses Ereignis wird nur ausgelöst, wenn der Client während des TLS-Handshakes keine ALPN-Erweiterung übertragen hat. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Das Ereignis `'unknownProtocol'` wird ausgelöst, wenn ein verbindender Client es versäumt, ein zulässiges Protokoll (d. h. HTTP/2 oder HTTP/1.1) auszuhandeln. Der Ereignishandler empfängt den Socket zur Bearbeitung. Wenn kein Listener für dieses Ereignis registriert ist, wird die Verbindung beendet. Ein Timeout kann mit der Option `'unknownProtocolTimeout'` angegeben werden, die an [`http2.createSecureServer()`](/de/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) übergeben wird.

In früheren Versionen von Node.js wurde dieses Ereignis ausgelöst, wenn `allowHTTP1` `false` ist und der Client während des TLS-Handshakes entweder keine ALPN-Erweiterung sendet oder eine ALPN-Erweiterung sendet, die HTTP/2 (`h2`) nicht enthält. Neuere Versionen von Node.js lösen dieses Ereignis nur aus, wenn `allowHTTP1` `false` ist und der Client keine ALPN-Erweiterung sendet. Wenn der Client eine ALPN-Erweiterung sendet, die HTTP/2 nicht enthält (oder HTTP/1.1, wenn `allowHTTP1` `true` ist), schlägt der TLS-Handshake fehl und es wird keine sichere Verbindung hergestellt.

Siehe die [Kompatibilitäts-API](/de/nodejs/api/http2#compatibility-api).

#### `server.close([callback])` {#serverclosecallback_1}

**Hinzugefügt in: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Verhindert, dass der Server neue Sitzungen aufbaut. Dies verhindert nicht, dass aufgrund der persistenten Natur von HTTP/2-Sitzungen neue Anforderungs-Streams erstellt werden. Um den Server ordnungsgemäß herunterzufahren, rufen Sie [`http2session.close()`](/de/nodejs/api/http2#http2sessionclosecallback) für alle aktiven Sitzungen auf.

Wenn `callback` angegeben wird, wird er erst aufgerufen, wenn alle aktiven Sitzungen geschlossen wurden, obwohl der Server bereits aufgehört hat, neue Sitzungen zuzulassen. Weitere Informationen finden Sie unter [`tls.Server.close()`](/de/nodejs/api/tls#serverclosecallback).


#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback_1}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `120000` (2 Minuten)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<Http2SecureServer\>](/de/nodejs/api/http2#class-http2secureserver)

Wird verwendet, um den Timeout-Wert für sichere Http2-Serveranfragen festzulegen und eine Callback-Funktion festzulegen, die aufgerufen wird, wenn nach `msecs` Millisekunden keine Aktivität auf dem `Http2SecureServer` stattfindet.

Der angegebene Callback wird als Listener für das `'timeout'`-Ereignis registriert.

Falls `callback` keine Funktion ist, wird ein neuer `ERR_INVALID_ARG_TYPE`-Fehler ausgelöst.

#### `server.timeout` {#servertimeout_1}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.0.0 | Das Standard-Timeout wurde von 120s auf 0 (kein Timeout) geändert. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Timeout in Millisekunden. **Standard:** 0 (kein Timeout)

Die Anzahl der Millisekunden Inaktivität, bevor angenommen wird, dass ein Socket ein Timeout erreicht hat.

Ein Wert von `0` deaktiviert das Timeout-Verhalten bei eingehenden Verbindungen.

Die Socket-Timeout-Logik wird bei der Verbindung eingerichtet, daher wirkt sich das Ändern dieses Werts nur auf neue Verbindungen zum Server aus, nicht auf bestehende Verbindungen.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings_1}

**Hinzugefügt in: v15.1.0, v14.17.0**

- `settings` [\<HTTP/2 Settings Object\>](/de/nodejs/api/http2#settings-object)

Wird verwendet, um den Server mit den bereitgestellten Einstellungen zu aktualisieren.

Wirft `ERR_HTTP2_INVALID_SETTING_VALUE` für ungültige `settings`-Werte.

Wirft `ERR_INVALID_ARG_TYPE` für ungültiges `settings`-Argument.

### `http2.createServer([options][, onRequestHandler])` {#http2createserveroptions-onrequesthandler}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | `streamResetBurst` und `streamResetRate` hinzugefügt. |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` entspricht nun der Bereitstellung von `PADDING_STRATEGY_ALIGNED`, und `selectPadding` wurde entfernt. |
| v13.3.0, v12.16.0 | Die Option `maxSessionRejectedStreams` mit dem Standardwert 100 wurde hinzugefügt. |
| v13.3.0, v12.16.0 | Die Option `maxSessionInvalidFrames` mit dem Standardwert 1000 wurde hinzugefügt. |
| v12.4.0 | Der Parameter `options` unterstützt nun `net.createServer()`-Optionen. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Die Option `unknownProtocolTimeout` mit einem Standardwert von 10000 wurde hinzugefügt. |
| v14.4.0, v12.18.0, v10.21.0 | Die Option `maxSettings` mit einem Standardwert von 32 wurde hinzugefügt. |
| v9.6.0 | Die Option `Http1IncomingMessage` und `Http1ServerResponse` wurde hinzugefügt. |
| v8.9.3 | Die Option `maxOutstandingPings` mit einem Standardlimit von 10 wurde hinzugefügt. |
| v8.9.3 | Die Option `maxHeaderListPairs` mit einem Standardlimit von 128 Header-Paaren wurde hinzugefügt. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale dynamische Tabellengröße für das Dekomprimieren von Header-Feldern fest. **Standard:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl von Einstellungseinträgen pro `SETTINGS`-Frame fest. Der minimal zulässige Wert ist `1`. **Standard:** `32`.
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt den maximalen Speicher fest, den die `Http2Session` verwenden darf. Der Wert wird in Megabyte ausgedrückt, z. B. `1` entspricht 1 Megabyte. Der minimal zulässige Wert ist `1`. Dies ist ein kreditbasiertes Limit, bestehende `Http2Stream`s können dazu führen, dass dieses Limit überschritten wird, aber neue `Http2Stream`-Instanzen werden abgelehnt, solange dieses Limit überschritten wird. Die aktuelle Anzahl der `Http2Stream`-Sitzungen, die aktuelle Speichernutzung der Header-Komprimierungstabellen, die aktuell zum Senden in die Warteschlange gestellten Daten und nicht bestätigte `PING`- und `SETTINGS`-Frames werden alle auf das aktuelle Limit angerechnet. **Standard:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl von Header-Einträgen fest. Dies ähnelt [`server.maxHeadersCount`](/de/nodejs/api/http#servermaxheaderscount) oder [`request.maxHeadersCount`](/de/nodejs/api/http#requestmaxheaderscount) im Modul `node:http`. Der Minimalwert ist `4`. **Standard:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl ausstehender, nicht bestätigter Pings fest. **Standard:** `10`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximal zulässige Größe für einen serialisierten, komprimierten Block von Headern fest. Versuche, Header zu senden, die dieses Limit überschreiten, führen dazu, dass ein `'frameError'`-Ereignis ausgelöst wird und der Stream geschlossen und zerstört wird. Während dies die maximal zulässige Größe für den gesamten Header-Block festlegt, hat `nghttp2` (die interne http2-Bibliothek) ein Limit von `65536` für jedes dekomprimierte Schlüssel/Wert-Paar.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Strategie, die verwendet wird, um die Menge an Padding zu bestimmen, die für `HEADERS`- und `DATA`-Frames verwendet werden soll. **Standard:** `http2.constants.PADDING_STRATEGY_NONE`. Der Wert kann einer der folgenden sein:
    - `http2.constants.PADDING_STRATEGY_NONE`: Es wird kein Padding angewendet.
    - `http2.constants.PADDING_STRATEGY_MAX`: Die maximale Menge an Padding, die durch die interne Implementierung bestimmt wird, wird angewendet.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: Versucht, genügend Padding anzuwenden, um sicherzustellen, dass die Gesamtframe-Länge, einschließlich des 9-Byte-Headers, ein Vielfaches von 8 ist. Für jeden Frame gibt es eine maximal zulässige Anzahl von Padding-Bytes, die durch den aktuellen Flow-Control-Status und die Einstellungen bestimmt wird. Wenn dieses Maximum kleiner ist als die berechnete Menge, die erforderlich ist, um die Ausrichtung sicherzustellen, wird das Maximum verwendet und die Gesamtframe-Länge ist nicht unbedingt an 8 Bytes ausgerichtet.

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl gleichzeitiger Streams für den Remote-Peer fest, als ob ein `SETTINGS`-Frame empfangen worden wäre. Wird überschrieben, wenn der Remote-Peer seinen eigenen Wert für `maxConcurrentStreams` festlegt. **Standard:** `100`.
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl ungültiger Frames fest, die toleriert werden, bevor die Sitzung geschlossen wird. **Standard:** `1000`.
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl abgelehnter Streams fest, die bei der Erstellung toleriert werden, bevor die Sitzung geschlossen wird. Jede Ablehnung ist mit einem `NGHTTP2_ENHANCE_YOUR_CALM`-Fehler verbunden, der dem Peer mitteilen sollte, keine weiteren Streams zu öffnen. Das fortgesetzte Öffnen von Streams wird daher als Zeichen für ein Fehlverhalten des Peers angesehen. **Standard:** `100`.
    - `settings` [\<HTTP/2 Settings Object\>](/de/nodejs/api/http2#settings-object) Die anfänglichen Einstellungen, die beim Verbindungsaufbau an den Remote-Peer gesendet werden sollen.
    - `streamResetBurst` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) und `streamResetRate` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die Ratenbegrenzung für das eingehende Stream-Reset (RST_STREAM-Frame) fest. Beide Einstellungen müssen festgelegt werden, um eine Wirkung zu erzielen, und sind standardmäßig 1000 bzw. 33.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Das Array von Integer-Werten bestimmt die Einstellungstypen, die in der `CustomSettings`-Eigenschaft der empfangenen remoteSettings enthalten sind. Weitere Informationen zu den zulässigen Einstellungstypen finden Sie in der `CustomSettings`-Eigenschaft des `Http2Settings`-Objekts.
    - `Http1IncomingMessage` [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage) Gibt die `IncomingMessage`-Klasse an, die für HTTP/1-Fallback verwendet werden soll. Nützlich, um die ursprüngliche `http.IncomingMessage` zu erweitern. **Standard:** `http.IncomingMessage`.
    - `Http1ServerResponse` [\<http.ServerResponse\>](/de/nodejs/api/http#class-httpserverresponse) Gibt die `ServerResponse`-Klasse an, die für HTTP/1-Fallback verwendet werden soll. Nützlich, um die ursprüngliche `http.ServerResponse` zu erweitern. **Standard:** `http.ServerResponse`.
    - `Http2ServerRequest` [\<http2.Http2ServerRequest\>](/de/nodejs/api/http2#class-http2http2serverrequest) Gibt die zu verwendende `Http2ServerRequest`-Klasse an. Nützlich, um die ursprüngliche `Http2ServerRequest` zu erweitern. **Standard:** `Http2ServerRequest`.
    - `Http2ServerResponse` [\<http2.Http2ServerResponse\>](/de/nodejs/api/http2#class-http2http2serverresponse) Gibt die zu verwendende `Http2ServerResponse`-Klasse an. Nützlich, um die ursprüngliche `Http2ServerResponse` zu erweitern. **Standard:** `Http2ServerResponse`.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt ein Timeout in Millisekunden an, das ein Server warten soll, wenn ein [`'unknownProtocol'`](/de/nodejs/api/http2#event-unknownprotocol) ausgelöst wird. Wenn der Socket bis dahin nicht zerstört wurde, zerstört der Server ihn. **Standard:** `10000`.
    - ...: Jede [`net.createServer()`](/de/nodejs/api/net#netcreateserveroptions-connectionlistener)-Option kann bereitgestellt werden.

- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Siehe [Compatibility API](/de/nodejs/api/http2#compatibility-api)
- Gibt zurück: [\<Http2Server\>](/de/nodejs/api/http2#class-http2server)

Gibt eine `net.Server`-Instanz zurück, die `Http2Session`-Instanzen erstellt und verwaltet.

Da keine Browser bekannt sind, die [unverschlüsseltes HTTP/2](https://http2.github.io/faq/#does-http2-require-encryption) unterstützen, ist die Verwendung von [`http2.createSecureServer()`](/de/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) erforderlich, wenn mit Browser-Clients kommuniziert wird.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// Erstellen Sie einen unverschlüsselten HTTP/2-Server.
// Da keine Browser bekannt sind, die dies unterstützen
// unverschlüsseltes HTTP/2, die Verwendung von `createSecureServer()`
// ist erforderlich, wenn mit Browser-Clients kommuniziert wird.
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

// Erstellen Sie einen unverschlüsselten HTTP/2-Server.
// Da keine Browser bekannt sind, die dies unterstützen
// unverschlüsseltes HTTP/2, die Verwendung von `http2.createSecureServer()`
// ist erforderlich, wenn mit Browser-Clients kommuniziert wird.
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

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.0.0 | Die `PADDING_STRATEGY_CALLBACK` wurde so gestaltet, dass sie der Bereitstellung von `PADDING_STRATEGY_ALIGNED` entspricht, und `selectPadding` wurde entfernt. |
| v13.3.0, v12.16.0 | Option `maxSessionRejectedStreams` mit einem Standardwert von 100 hinzugefügt. |
| v13.3.0, v12.16.0 | Option `maxSessionInvalidFrames` mit einem Standardwert von 1000 hinzugefügt. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Option `unknownProtocolTimeout` mit einem Standardwert von 10000 hinzugefügt. |
| v14.4.0, v12.18.0, v10.21.0 | Option `maxSettings` mit einem Standardwert von 32 hinzugefügt. |
| v10.12.0 | Die Option `origins` wurde hinzugefügt, um automatisch einen `ORIGIN`-Frame beim Starten von `Http2Session` zu senden. |
| v8.9.3 | Die Option `maxOutstandingPings` mit einem Standardlimit von 10 wurde hinzugefügt. |
| v8.9.3 | Die Option `maxHeaderListPairs` mit einem Standardlimit von 128 Header-Paaren wurde hinzugefügt. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHTTP1` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Eingehende Clientverbindungen, die HTTP/2 nicht unterstützen, werden auf HTTP/1.x herabgestuft, wenn auf `true` gesetzt. Siehe das [`'unknownProtocol'`-Ereignis](/de/nodejs/api/http2#event-unknownprotocol). Siehe [ALPN-Aushandlung](/de/nodejs/api/http2#alpn-negotiation). **Standard:** `false`.
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale dynamische Tabellengröße zum Dekomprimieren von Header-Feldern fest. **Standard:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl von Einstellungseinträgen pro `SETTINGS`-Frame fest. Der zulässige Mindestwert ist `1`. **Standard:** `32`.
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt den maximalen Speicher fest, den die `Http2Session` verwenden darf. Der Wert wird in Megabyte ausgedrückt, z. B. `1` entspricht 1 Megabyte. Der zulässige Mindestwert ist `1`. Dies ist ein kreditbasiertes Limit, bestehende `Http2Stream`s können dazu führen, dass dieses Limit überschritten wird, aber neue `Http2Stream`-Instanzen werden abgelehnt, solange dieses Limit überschritten wird. Die aktuelle Anzahl von `Http2Stream`-Sitzungen, die aktuelle Speichernutzung der Header-Komprimierungstabellen, die aktuellen Daten, die zum Senden in die Warteschlange gestellt wurden, und nicht bestätigte `PING`- und `SETTINGS`-Frames werden alle auf das aktuelle Limit angerechnet. **Standard:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl von Headereinträgen fest. Dies ähnelt [`server.maxHeadersCount`](/de/nodejs/api/http#servermaxheaderscount) oder [`request.maxHeadersCount`](/de/nodejs/api/http#requestmaxheaderscount) im `node:http`-Modul. Der Mindestwert ist `4`. **Standard:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl ausstehender, nicht bestätigter Pings fest. **Standard:** `10`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximal zulässige Größe für einen serialisierten, komprimierten Header-Block fest. Versuche, Header zu senden, die dieses Limit überschreiten, führen dazu, dass ein `'frameError'`-Ereignis ausgelöst und der Stream geschlossen und zerstört wird.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Strategie, die verwendet wird, um die Menge an Padding zu bestimmen, die für `HEADERS`- und `DATA`-Frames verwendet werden soll. **Standard:** `http2.constants.PADDING_STRATEGY_NONE`. Der Wert kann einer der folgenden sein:
    - `http2.constants.PADDING_STRATEGY_NONE`: Es wird kein Padding angewendet.
    - `http2.constants.PADDING_STRATEGY_MAX`: Die maximale Menge an Padding, die durch die interne Implementierung bestimmt wird, wird angewendet.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: Versucht, genügend Padding anzuwenden, um sicherzustellen, dass die Gesamtlänge des Frames, einschließlich des 9-Byte-Headers, ein Vielfaches von 8 ist. Für jeden Frame gibt es eine maximal zulässige Anzahl von Padding-Bytes, die durch den aktuellen Flusskontrollstatus und die Einstellungen bestimmt wird. Wenn dieses Maximum kleiner ist als die berechnete Menge, die benötigt wird, um die Ausrichtung sicherzustellen, wird das Maximum verwendet und die Gesamtlänge des Frames ist nicht unbedingt an 8 Byte ausgerichtet.
 
    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl gleichzeitiger Streams für den Remote-Peer fest, als ob ein `SETTINGS`-Frame empfangen worden wäre. Wird überschrieben, wenn der Remote-Peer seinen eigenen Wert für `maxConcurrentStreams` festlegt. **Standard:** `100`.
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl ungültiger Frames fest, die toleriert werden, bevor die Sitzung geschlossen wird. **Standard:** `1000`.
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl abgelehnter Streams bei der Erstellung fest, die toleriert werden, bevor die Sitzung geschlossen wird. Jede Ablehnung ist mit einem `NGHTTP2_ENHANCE_YOUR_CALM`-Fehler verbunden, der dem Peer mitteilen sollte, keine weiteren Streams zu öffnen. Das fortgesetzte Öffnen von Streams wird daher als Zeichen eines sich falsch verhaltenden Peers angesehen. **Standard:** `100`.
    - `settings` [\<HTTP/2-Einstellungsobjekt\>](/de/nodejs/api/http2#settings-object) Die anfänglichen Einstellungen, die beim Verbindungsaufbau an den Remote-Peer gesendet werden sollen.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Das Array von ganzzahligen Werten bestimmt die Einstellungstypen, die in der `customSettings`-Eigenschaft der empfangenen RemoteSettings enthalten sind. Weitere Informationen zu den zulässigen Einstellungstypen finden Sie in der `customSettings`-Eigenschaft des `Http2Settings`-Objekts.
    - ...: Alle Optionen von [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) können angegeben werden. Für Server sind die Identitätsoptionen (`pfx` oder `key`/`cert`) normalerweise erforderlich.
    - `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein Array von Ursprungsstrings, die innerhalb eines `ORIGIN`-Frames unmittelbar nach der Erstellung einer neuen Server-`Http2Session` gesendet werden sollen.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt ein Timeout in Millisekunden an, das ein Server warten soll, wenn ein [`'unknownProtocol'`-Ereignis](/de/nodejs/api/http2#event-unknownprotocol) ausgelöst wird. Wenn der Socket bis zu diesem Zeitpunkt nicht zerstört wurde, zerstört der Server ihn. **Standard:** `10000`.
 
- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Siehe [Kompatibilitäts-API](/de/nodejs/api/http2#compatibility-api)
- Gibt zurück: [\<Http2SecureServer\>](/de/nodejs/api/http2#class-http2secureserver)

Gibt eine `tls.Server`-Instanz zurück, die `Http2Session`-Instanzen erstellt und verwaltet.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),
};

// Erstellt einen sicheren HTTP/2-Server
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

// Erstellt einen sicheren HTTP/2-Server
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

::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v13.0.0 | Die `PADDING_STRATEGY_CALLBACK` wurde äquivalent zur Bereitstellung von `PADDING_STRATEGY_ALIGNED` gemacht und `selectPadding` wurde entfernt. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Die Option `unknownProtocolTimeout` mit einem Standardwert von 10000 hinzugefügt. |
| v14.4.0, v12.18.0, v10.21.0 | Die Option `maxSettings` mit einem Standardwert von 32 hinzugefügt. |
| v8.9.3 | Die Option `maxOutstandingPings` mit einem Standardlimit von 10 hinzugefügt. |
| v8.9.3 | Die Option `maxHeaderListPairs` mit einem Standardlimit von 128 Header-Paaren hinzugefügt. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `authority` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Der Remote-HTTP/2-Server, zu dem eine Verbindung hergestellt werden soll. Dies muss in Form einer minimalen, gültigen URL mit dem Präfix `http://` oder `https://`, dem Hostnamen und dem IP-Port (wenn ein Nicht-Standard-Port verwendet wird) erfolgen. Userinfo (Benutzer-ID und Passwort), Pfad, Querystring und Fragmentdetails in der URL werden ignoriert.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale dynamische Tabellengröße für das Dekomprimieren von Header-Feldern fest. **Standard:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl von Einstellungseinträgen pro `SETTINGS`-Frame fest. Der minimal zulässige Wert ist `1`. **Standard:** `32`.
    - `maxSessionMemory` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt den maximalen Speicher fest, den die `Http2Session` verwenden darf. Der Wert wird in Megabyte ausgedrückt, z. B. `1` entspricht 1 Megabyte. Der minimal zulässige Wert ist `1`. Dies ist ein kreditbasiertes Limit. Vorhandene `Http2Stream`s können dazu führen, dass dieses Limit überschritten wird, aber neue `Http2Stream`-Instanzen werden abgelehnt, solange dieses Limit überschritten wird. Die aktuelle Anzahl der `Http2Stream`-Sitzungen, die aktuelle Speichernutzung der Header-Komprimierungstabellen, die aktuell zu sendenden Daten und nicht bestätigte `PING`- und `SETTINGS`-Frames werden alle auf das aktuelle Limit angerechnet. **Standard:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl von Header-Einträgen fest. Dies ähnelt [`server.maxHeadersCount`](/de/nodejs/api/http#servermaxheaderscount) oder [`request.maxHeadersCount`](/de/nodejs/api/http#requestmaxheaderscount) im `node:http`-Modul. Der minimale Wert ist `1`. **Standard:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl ausstehender, nicht bestätigter Pings fest. **Standard:** `10`.
    - `maxReservedRemoteStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl reservierter Push-Streams fest, die der Client zu einem bestimmten Zeitpunkt akzeptiert. Sobald die aktuelle Anzahl der aktuell reservierten Push-Streams dieses Limit erreicht, werden neue, vom Server gesendete Push-Streams automatisch abgelehnt. Der minimal zulässige Wert ist 0. Der maximal zulässige Wert ist 2-1. Ein negativer Wert setzt diese Option auf den maximal zulässigen Wert. **Standard:** `200`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximal zulässige Größe für einen serialisierten, komprimierten Header-Block fest. Versuche, Header zu senden, die dieses Limit überschreiten, führen dazu, dass ein `'frameError'`-Ereignis ausgelöst wird und der Stream geschlossen und zerstört wird.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Strategie zur Bestimmung der Menge an Padding, die für `HEADERS`- und `DATA`-Frames verwendet werden soll. **Standard:** `http2.constants.PADDING_STRATEGY_NONE`. Der Wert kann einer der folgenden sein:
        - `http2.constants.PADDING_STRATEGY_NONE`: Es wird kein Padding angewendet.
        - `http2.constants.PADDING_STRATEGY_MAX`: Die maximale Menge an Padding, die durch die interne Implementierung bestimmt wird, wird angewendet.
        - `http2.constants.PADDING_STRATEGY_ALIGNED`: Versucht, genügend Padding anzuwenden, um sicherzustellen, dass die Gesamtlänge des Frames, einschließlich des 9-Byte-Headers, ein Vielfaches von 8 ist. Für jeden Frame gibt es eine maximal zulässige Anzahl von Padding-Bytes, die durch den aktuellen Flusskontrollstatus und die Einstellungen bestimmt wird. Wenn dieses Maximum geringer ist als der berechnete Betrag, der benötigt wird, um die Ausrichtung sicherzustellen, wird das Maximum verwendet und die Gesamtlänge des Frames ist nicht unbedingt an 8 Byte ausgerichtet.

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die maximale Anzahl gleichzeitiger Streams für den Remote-Peer fest, als ob ein `SETTINGS`-Frame empfangen worden wäre. Wird überschrieben, wenn der Remote-Peer seinen eigenen Wert für `maxConcurrentStreams` festlegt. **Standard:** `100`.
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Das Protokoll, mit dem die Verbindung hergestellt werden soll, falls nicht in der `authority` festgelegt. Der Wert kann entweder `'http:'` oder `'https:'` sein. **Standard:** `'https:'`
    - `settings` [\<HTTP/2-Einstellungsobjekt\>](/de/nodejs/api/http2#settings-object) Die anfänglichen Einstellungen, die beim Verbindungsaufbau an den Remote-Peer gesendet werden sollen.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Das Array von ganzzahligen Werten bestimmt die Einstellungstypen, die in der `CustomSettings`-Eigenschaft der empfangenen remoteSettings enthalten sind. Weitere Informationen zu den zulässigen Einstellungstypen finden Sie in der `CustomSettings`-Eigenschaft des `Http2Settings`-Objekts.
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ein optionaler Callback, der die an `connect` übergebene `URL`-Instanz und das `options`-Objekt empfängt und einen beliebigen [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Stream zurückgibt, der als Verbindung für diese Sitzung verwendet werden soll.
    - ...: Es können beliebige [`net.connect()`](/de/nodejs/api/net#netconnect)- oder [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback)-Optionen bereitgestellt werden.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt ein Timeout in Millisekunden an, das ein Server warten soll, wenn ein [`'unknownProtocol'`](/de/nodejs/api/http2#event-unknownprotocol)-Ereignis ausgelöst wird. Wenn der Socket bis zu diesem Zeitpunkt nicht zerstört wurde, zerstört der Server ihn. **Standard:** `10000`.

- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird als einmaliger Listener des [`'connect'`](/de/nodejs/api/http2#event-connect)-Ereignisses registriert.
- Gibt zurück: [\<ClientHttp2Session\>](/de/nodejs/api/http2#class-clienthttp2session)

Gibt eine `ClientHttp2Session`-Instanz zurück.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost:1234');

/* Use the client */

client.close();
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost:1234');

/* Use the client */

client.close();
```
:::


### `http2.constants` {#http2constants}

**Hinzugefügt in: v8.4.0**

#### Fehlercodes für `RST_STREAM` und `GOAWAY` {#error-codes-for-rst_stream-and-goaway}

| Wert | Name | Konstante |
| --- | --- | --- |
| `0x00` | Kein Fehler | `http2.constants.NGHTTP2_NO_ERROR` |
| `0x01` | Protokollfehler | `http2.constants.NGHTTP2_PROTOCOL_ERROR` |
| `0x02` | Interner Fehler | `http2.constants.NGHTTP2_INTERNAL_ERROR` |
| `0x03` | Flusssteuerungsfehler | `http2.constants.NGHTTP2_FLOW_CONTROL_ERROR` |
| `0x04` | Einstellungs-Timeout | `http2.constants.NGHTTP2_SETTINGS_TIMEOUT` |
| `0x05` | Stream geschlossen | `http2.constants.NGHTTP2_STREAM_CLOSED` |
| `0x06` | Frame-Größenfehler | `http2.constants.NGHTTP2_FRAME_SIZE_ERROR` |
| `0x07` | Stream abgelehnt | `http2.constants.NGHTTP2_REFUSED_STREAM` |
| `0x08` | Abbrechen | `http2.constants.NGHTTP2_CANCEL` |
| `0x09` | Komprimierungsfehler | `http2.constants.NGHTTP2_COMPRESSION_ERROR` |
| `0x0a` | Verbindungsfehler | `http2.constants.NGHTTP2_CONNECT_ERROR` |
| `0x0b` | Beruhige Dich | `http2.constants.NGHTTP2_ENHANCE_YOUR_CALM` |
| `0x0c` | Unzureichende Sicherheit | `http2.constants.NGHTTP2_INADEQUATE_SECURITY` |
| `0x0d` | HTTP/1.1 Erforderlich | `http2.constants.NGHTTP2_HTTP_1_1_REQUIRED` |
Das `'timeout'`-Ereignis wird ausgelöst, wenn es für eine bestimmte Anzahl von Millisekunden, die mit `http2server.setTimeout()` festgelegt wurde, keine Aktivität auf dem Server gibt.

### `http2.getDefaultSettings()` {#http2getdefaultsettings}

**Hinzugefügt in: v8.4.0**

- Gibt zurück: [\<HTTP/2-Einstellungsobjekt\>](/de/nodejs/api/http2#settings-object)

Gibt ein Objekt zurück, das die Standardeinstellungen für eine `Http2Session`-Instanz enthält. Diese Methode gibt bei jedem Aufruf eine neue Objektinstanz zurück, sodass zurückgegebene Instanzen zur Verwendung sicher geändert werden können.

### `http2.getPackedSettings([settings])` {#http2getpackedsettingssettings}

**Hinzugefügt in: v8.4.0**

- `settings` [\<HTTP/2-Einstellungsobjekt\>](/de/nodejs/api/http2#settings-object)
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Gibt eine `Buffer`-Instanz zurück, die die serialisierte Darstellung der angegebenen HTTP/2-Einstellungen gemäß der [HTTP/2](https://tools.ietf.org/html/rfc7540)-Spezifikation enthält. Dies ist für die Verwendung mit dem Header-Feld `HTTP2-Settings` vorgesehen.

::: code-group
```js [ESM]
import { getPackedSettings } from 'node:http2';

const packed = getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```

```js [CJS]
const http2 = require('node:http2');

const packed = http2.getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```
:::


### `http2.getUnpackedSettings(buf)` {#http2getunpackedsettingsbuf}

**Hinzugefügt in: v8.4.0**

- `buf` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Die gepackten Einstellungen.
- Gibt zurück: [\<HTTP/2-Einstellungsobjekt\>](/de/nodejs/api/http2#settings-object)

Gibt ein [HTTP/2-Einstellungsobjekt](/de/nodejs/api/http2#settings-object) zurück, das die deserialisierten Einstellungen aus dem gegebenen `Buffer` enthält, wie von `http2.getPackedSettings()` generiert.

### `http2.performServerHandshake(socket[, options])` {#http2performserverhandshakesocket-options}

**Hinzugefügt in: v21.7.0, v20.12.0**

- `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - ...: Jede [`http2.createServer()`](/de/nodejs/api/http2#http2createserveroptions-onrequesthandler)-Option kann bereitgestellt werden.
  
 
- Gibt zurück: [\<ServerHttp2Session\>](/de/nodejs/api/http2#class-serverhttp2session)

Erstellt eine HTTP/2-Server-Sitzung aus einem vorhandenen Socket.

### `http2.sensitiveHeaders` {#http2sensitiveheaders}

**Hinzugefügt in: v15.0.0, v14.18.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

Dieses Symbol kann als Eigenschaft des HTTP/2-Header-Objekts mit einem Array-Wert gesetzt werden, um eine Liste von Headern bereitzustellen, die als sensibel betrachtet werden. Weitere Details finden Sie unter [Sensitive headers](/de/nodejs/api/http2#sensitive-headers).

### Header-Objekt {#headers-object}

Header werden als eigene Eigenschaften von JavaScript-Objekten dargestellt. Die Eigenschaftsschlüssel werden in Kleinbuchstaben serialisiert. Eigenschaftswerte sollten Zeichenketten sein (wenn sie es nicht sind, werden sie in Zeichenketten umgewandelt) oder ein `Array` von Zeichenketten (um mehr als einen Wert pro Header-Feld zu senden).

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'ABC': ['has', 'more', 'than', 'one', 'value'],
};

stream.respond(headers);
```
Header-Objekte, die an Callback-Funktionen übergeben werden, haben einen `null`-Prototyp. Dies bedeutet, dass normale JavaScript-Objektmethoden wie `Object.prototype.toString()` und `Object.prototype.hasOwnProperty()` nicht funktionieren.

Für eingehende Header:

- Der `:status`-Header wird in `number` konvertiert.
- Duplikate von `:status`, `:method`, `:authority`, `:scheme`, `:path`, `:protocol`, `age`, `authorization`, `access-control-allow-credentials`, `access-control-max-age`, `access-control-request-method`, `content-encoding`, `content-language`, `content-length`, `content-location`, `content-md5`, `content-range`, `content-type`, `date`, `dnt`, `etag`, `expires`, `from`, `host`, `if-match`, `if-modified-since`, `if-none-match`, `if-range`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `range`, `referer`,`retry-after`, `tk`, `upgrade-insecure-requests`, `user-agent` oder `x-content-type-options` werden verworfen.
- `set-cookie` ist immer ein Array. Duplikate werden dem Array hinzugefügt.
- Bei doppelten `cookie`-Headern werden die Werte mit '; ' zusammengefügt.
- Für alle anderen Header werden die Werte mit ', ' zusammengefügt.



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


#### Sensible Header {#sensitive-headers}

HTTP2-Header können als sensibel markiert werden, was bedeutet, dass der HTTP/2-Header-Komprimierungsalgorithmus sie niemals indiziert. Dies kann für Header-Werte mit geringer Entropie sinnvoll sein, die für einen Angreifer wertvoll sein könnten, beispielsweise `Cookie` oder `Authorization`. Um dies zu erreichen, fügen Sie den Header-Namen der Eigenschaft `[http2.sensitiveHeaders]` als Array hinzu:

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
Für einige Header, wie z. B. `Authorization` und kurze `Cookie`-Header, wird dieses Flag automatisch gesetzt.

Diese Eigenschaft wird auch für empfangene Header gesetzt. Sie enthält die Namen aller als sensibel markierten Header, einschließlich der automatisch markierten.

### Einstellungsobjekt {#settings-object}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.12.0 | Die Einstellung `maxConcurrentStreams` ist strenger. |
| v8.9.3 | Die Einstellung `maxHeaderListSize` wird jetzt strikt durchgesetzt. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

Die APIs `http2.getDefaultSettings()`, `http2.getPackedSettings()`, `http2.createServer()`, `http2.createSecureServer()`, `http2session.settings()`, `http2session.localSettings` und `http2session.remoteSettings` geben entweder ein Objekt zurück oder empfangen ein Objekt als Eingabe, das Konfigurationseinstellungen für ein `Http2Session`-Objekt definiert. Diese Objekte sind gewöhnliche JavaScript-Objekte, die die folgenden Eigenschaften enthalten.

- `headerTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die maximale Anzahl von Bytes an, die für die Header-Komprimierung verwendet werden. Der minimal zulässige Wert ist 0. Der maximal zulässige Wert ist 2-1. **Standard:** `4096`.
- `enablePush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob HTTP/2 Push Streams auf den `Http2Session`-Instanzen zulässig sein sollen (`true`). **Standard:** `true`.
- `initialWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die anfängliche Fenstergröße (in Bytes) des *Absenders* für die Flusssteuerung auf Stream-Ebene an. Der minimal zulässige Wert ist 0. Der maximal zulässige Wert ist 2-1. **Standard:** `65535`.
- `maxFrameSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die Größe (in Bytes) der größten Frame-Nutzlast an. Der minimal zulässige Wert ist 16.384. Der maximal zulässige Wert ist 2-1. **Standard:** `16384`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die maximale Anzahl gleichzeitiger Streams an, die auf einer `Http2Session` zulässig sind. Es gibt keinen Standardwert, was impliziert, dass in einer `Http2Session` theoretisch mindestens 2-1 Streams gleichzeitig geöffnet sein können. Der Mindestwert ist 0. Der maximal zulässige Wert ist 2-1. **Standard:** `4294967295`.
- `maxHeaderListSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die maximale Größe (unkomprimierte Oktette) der Header-Liste an, die akzeptiert wird. Der minimal zulässige Wert ist 0. Der maximal zulässige Wert ist 2-1. **Standard:** `65535`.
- `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias für `maxHeaderListSize`.
- `enableConnectProtocol`[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob das von [RFC 8441](https://tools.ietf.org/html/rfc8441) definierte "Extended Connect Protocol" aktiviert werden soll (`true`). Diese Einstellung ist nur sinnvoll, wenn sie vom Server gesendet wird. Sobald die Einstellung `enableConnectProtocol` für eine bestimmte `Http2Session` aktiviert wurde, kann sie nicht mehr deaktiviert werden. **Standard:** `false`.
- `customSettings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Gibt zusätzliche Einstellungen an, die in Node und den zugrunde liegenden Bibliotheken noch nicht implementiert sind. Der Schlüssel des Objekts definiert den numerischen Wert des Einstellungstyps (wie im "HTTP/2 SETTINGS"-Register definiert, das von [RFC 7540] eingerichtet wurde), und die Werte den tatsächlichen numerischen Wert der Einstellungen. Der Einstellungstyp muss eine ganze Zahl im Bereich von 1 bis 2^16-1 sein. Es sollte kein Einstellungstyp sein, der bereits von Node verarbeitet wird, d. h. er sollte derzeit größer als 6 sein, obwohl dies kein Fehler ist. Die Werte müssen vorzeichenlose ganze Zahlen im Bereich von 0 bis 2^32-1 sein. Derzeit werden maximal 10 benutzerdefinierte Einstellungen unterstützt. Es wird nur zum Senden von SETTINGS oder zum Empfangen von Einstellungswerten unterstützt, die in den `remoteCustomSettings`-Optionen des Server- oder Clientobjekts angegeben sind. Vermischen Sie nicht den `customSettings`-Mechanismus für eine Einstellungs-ID mit Schnittstellen für die nativ behandelten Einstellungen, falls eine Einstellung in einer zukünftigen Node-Version nativ unterstützt wird.

Alle zusätzlichen Eigenschaften des Einstellungsobjekts werden ignoriert.


### Fehlerbehandlung {#error-handling}

Bei der Verwendung des Moduls `node:http2` können verschiedene Arten von Fehlerzuständen auftreten:

Validierungsfehler treten auf, wenn ein falsches Argument, eine falsche Option oder ein falscher Einstellungswert übergeben wird. Diese werden immer synchron durch ein `throw` gemeldet.

Zustandsfehler treten auf, wenn eine Aktion zu einem falschen Zeitpunkt versucht wird (z. B. der Versuch, Daten auf einem Stream zu senden, nachdem dieser geschlossen wurde). Diese werden entweder synchron durch ein `throw` oder über ein `'error'`-Ereignis auf den `Http2Stream`-, `Http2Session`- oder HTTP/2-Serverobjekten gemeldet, je nachdem, wo und wann der Fehler auftritt.

Interne Fehler treten auf, wenn eine HTTP/2-Sitzung unerwartet fehlschlägt. Diese werden über ein `'error'`-Ereignis auf den `Http2Session`- oder HTTP/2-Serverobjekten gemeldet.

Protokollfehler treten auf, wenn verschiedene HTTP/2-Protokollbeschränkungen verletzt werden. Diese werden entweder synchron durch ein `throw` oder über ein `'error'`-Ereignis auf den `Http2Stream`-, `Http2Session`- oder HTTP/2-Serverobjekten gemeldet, je nachdem, wo und wann der Fehler auftritt.

### Ungültige Zeichenbehandlung in Headernamen und -werten {#invalid-character-handling-in-header-names-and-values}

Die HTTP/2-Implementierung wendet eine strengere Behandlung ungültiger Zeichen in HTTP-Headernamen und -werten an als die HTTP/1-Implementierung.

Header-Feldnamen sind *nicht case-sensitiv* und werden über die Leitung ausschließlich als kleingeschriebene Zeichenketten übertragen. Die von Node.js bereitgestellte API ermöglicht es, Headernamen als Zeichenketten mit gemischter Groß- und Kleinschreibung zu setzen (z. B. `Content-Type`), konvertiert diese aber bei der Übertragung in Kleinbuchstaben (z. B. `content-type`).

Header-Feldnamen *dürfen nur* eines oder mehrere der folgenden ASCII-Zeichen enthalten: `a`-`z`, `A`-`Z`, `0`-`9`, `!`, `#`, `$`, `%`, `&`, `'`, `*`, `+`, `-`, `.`, `^`, `_`, ``` (Backtick), `|` und `~`.

Die Verwendung ungültiger Zeichen in einem HTTP-Header-Feldnamen führt dazu, dass der Stream mit einem gemeldeten Protokollfehler geschlossen wird.

Header-Feldwerte werden mit mehr Nachsicht behandelt, *sollten* aber keine Zeilenumbruch- oder Wagenrücklaufzeichen enthalten und *sollten* gemäß den Anforderungen der HTTP-Spezifikation auf US-ASCII-Zeichen beschränkt sein.


### Push-Streams auf dem Client {#push-streams-on-the-client}

Um Push-Streams auf dem Client zu empfangen, setzen Sie einen Listener für das `'stream'`-Event auf der `ClientHttp2Session`:

::: code-group
```js [ESM]
import { connect } from 'node:http2';

const client = connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // Response-Header verarbeiten
  });
  pushedStream.on('data', (chunk) => { /* Push-Daten verarbeiten */ });
});

const req = client.request({ ':path': '/' });
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // Response-Header verarbeiten
  });
  pushedStream.on('data', (chunk) => { /* Push-Daten verarbeiten */ });
});

const req = client.request({ ':path': '/' });
```
:::

### Unterstützung der `CONNECT`-Methode {#supporting-the-connect-method}

Die `CONNECT`-Methode wird verwendet, um einen HTTP/2-Server als Proxy für TCP/IP-Verbindungen zu verwenden.

Ein einfacher TCP-Server:

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

Ein HTTP/2-CONNECT-Proxy:

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const { NGHTTP2_REFUSED_STREAM, NGHTTP2_CONNECT_ERROR } = constants;
import { connect } from 'node:net';

const proxy = createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // Nur CONNECT-Anfragen akzeptieren
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // Es ist eine sehr gute Idee zu überprüfen, ob Hostname und Port
  // Dinge sind, mit denen sich dieser Proxy verbinden soll.
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
    // Nur CONNECT-Anfragen akzeptieren
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // Es ist eine sehr gute Idee zu überprüfen, ob Hostname und Port
  // Dinge sind, mit denen sich dieser Proxy verbinden soll.
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

Ein HTTP/2-CONNECT-Client:

::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';

const client = connect('http://localhost:8001');

// Die Header ':path' und ':scheme' dürfen nicht angegeben werden
// für CONNECT-Anfragen, da sonst ein Fehler ausgelöst wird.
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

// Die Header ':path' und ':scheme' dürfen nicht angegeben werden
// für CONNECT-Anfragen, da sonst ein Fehler ausgelöst wird.
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


### Das erweiterte `CONNECT`-Protokoll {#the-extended-connect-protocol}

[RFC 8441](https://tools.ietf.org/html/rfc8441) definiert eine "Extended CONNECT Protocol"-Erweiterung zu HTTP/2, die verwendet werden kann, um die Verwendung eines `Http2Stream` mit der `CONNECT`-Methode als Tunnel für andere Kommunikationsprotokolle (wie z. B. WebSockets) zu initialisieren.

Die Verwendung des Extended CONNECT Protocol wird von HTTP/2-Servern durch die Verwendung der `enableConnectProtocol`-Einstellung aktiviert:

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

Sobald der Client den `SETTINGS`-Frame vom Server empfängt, der anzeigt, dass das erweiterte CONNECT verwendet werden kann, kann er `CONNECT`-Anfragen senden, die den `':protocol'` HTTP/2 Pseudo-Header verwenden:

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

## Kompatibilitäts-API {#compatibility-api}

Die Kompatibilitäts-API hat das Ziel, eine ähnliche Entwicklererfahrung wie bei HTTP/1 zu bieten, wenn HTTP/2 verwendet wird, wodurch es möglich ist, Anwendungen zu entwickeln, die sowohl [HTTP/1](/de/nodejs/api/http) als auch HTTP/2 unterstützen. Diese API zielt nur auf die **öffentliche API** von [HTTP/1](/de/nodejs/api/http) ab. Viele Module verwenden jedoch interne Methoden oder Zustände, und diese *werden nicht unterstützt*, da es sich um eine völlig andere Implementierung handelt.

Das folgende Beispiel erstellt einen HTTP/2-Server mit der Kompatibilitäts-API:

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

Um einen gemischten [HTTPS](/de/nodejs/api/https)- und HTTP/2-Server zu erstellen, lesen Sie den Abschnitt [ALPN-Aushandlung](/de/nodejs/api/http2#alpn-negotiation). Das Upgrade von Nicht-TLS-HTTP/1-Servern wird nicht unterstützt.

Die HTTP/2-Kompatibilitäts-API besteht aus [`Http2ServerRequest`](/de/nodejs/api/http2#class-http2http2serverrequest) und [`Http2ServerResponse`](/de/nodejs/api/http2#class-http2http2serverresponse). Sie zielen auf API-Kompatibilität mit HTTP/1 ab, verbergen jedoch nicht die Unterschiede zwischen den Protokollen. Beispielsweise wird die Statusmeldung für HTTP-Codes ignoriert.


### ALPN-Aushandlung {#alpn-negotiation}

Die ALPN-Aushandlung ermöglicht die Unterstützung von sowohl [HTTPS](/de/nodejs/api/https) als auch HTTP/2 über denselben Socket. Die Objekte `req` und `res` können entweder HTTP/1 oder HTTP/2 sein, und eine Anwendung **muss** sich auf die öffentliche API von [HTTP/1](/de/nodejs/api/http) beschränken und erkennen, ob es möglich ist, die erweiterten Funktionen von HTTP/2 zu verwenden.

Das folgende Beispiel erstellt einen Server, der beide Protokolle unterstützt:

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
  // Erkennen, ob es sich um eine HTTPS-Anfrage oder HTTP/2 handelt
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
  // Erkennen, ob es sich um eine HTTPS-Anfrage oder HTTP/2 handelt
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

Das Ereignis `'request'` funktioniert identisch auf [HTTPS](/de/nodejs/api/https) und HTTP/2.

### Klasse: `http2.Http2ServerRequest` {#class-http2http2serverrequest}

**Hinzugefügt in: v8.4.0**

- Erweitert: [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable)

Ein `Http2ServerRequest`-Objekt wird von [`http2.Server`](/de/nodejs/api/http2#class-http2server) oder [`http2.SecureServer`](/de/nodejs/api/http2#class-http2secureserver) erstellt und als erstes Argument an das Ereignis [`'request'`](/de/nodejs/api/http2#event-request) übergeben. Es kann verwendet werden, um auf einen Anforderungsstatus, Header und Daten zuzugreifen.


#### Ereignis: `'aborted'` {#event-aborted_1}

**Hinzugefügt in: v8.4.0**

Das Ereignis `'aborted'` wird immer dann ausgelöst, wenn eine `Http2ServerRequest`-Instanz mitten in der Kommunikation abnormal abgebrochen wird.

Das Ereignis `'aborted'` wird nur ausgelöst, wenn die beschreibbare Seite von `Http2ServerRequest` nicht beendet wurde.

#### Ereignis: `'close'` {#event-close_2}

**Hinzugefügt in: v8.4.0**

Zeigt an, dass der zugrunde liegende [`Http2Stream`](/de/nodejs/api/http2#class-http2stream) geschlossen wurde. Genau wie `'end'` tritt dieses Ereignis nur einmal pro Antwort auf.

#### `request.aborted` {#requestaborted}

**Hinzugefügt in: v10.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Eigenschaft `request.aborted` ist `true`, wenn die Anfrage abgebrochen wurde.

#### `request.authority` {#requestauthority}

**Hinzugefügt in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Das Pseudo-Header-Feld der Anforderungsautorität. Da HTTP/2 es Anfragen erlaubt, entweder `:authority` oder `host` zu setzen, wird dieser Wert von `req.headers[':authority']` abgeleitet, falls vorhanden. Andernfalls wird er von `req.headers['host']` abgeleitet.

#### `request.complete` {#requestcomplete}

**Hinzugefügt in: v12.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Eigenschaft `request.complete` ist `true`, wenn die Anfrage abgeschlossen, abgebrochen oder zerstört wurde.

#### `request.connection` {#requestconnection}

**Hinzugefügt in: v8.4.0**

**Veraltet seit: v13.0.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Verwenden Sie [`request.socket`](/de/nodejs/api/http2#requestsocket).
:::

- [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/de/nodejs/api/tls#class-tlstlssocket)

Siehe [`request.socket`](/de/nodejs/api/http2#requestsocket).

#### `request.destroy([error])` {#requestdestroyerror}

**Hinzugefügt in: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Ruft `destroy()` auf dem [`Http2Stream`](/de/nodejs/api/http2#class-http2stream) auf, der das [`Http2ServerRequest`](/de/nodejs/api/http2#class-http2http2serverrequest) empfangen hat. Wenn `error` angegeben ist, wird ein Ereignis `'error'` ausgelöst und `error` als Argument an alle Listener für das Ereignis übergeben.

Es bewirkt nichts, wenn der Stream bereits zerstört wurde.


#### `request.headers` {#requestheaders}

**Hinzugefügt in: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Das Request-/Response-Header-Objekt.

Schlüssel-Wert-Paare von Header-Namen und -Werten. Header-Namen werden in Kleinbuchstaben geschrieben.

```js [ESM]
// Gibt etwas wie Folgendes aus:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
Siehe [HTTP/2 Header-Objekt](/de/nodejs/api/http2#headers-object).

In HTTP/2 werden der Request-Pfad, der Hostname, das Protokoll und die Methode als spezielle Header dargestellt, denen das Zeichen `:` vorangestellt ist (z. B. `':path'`). Diese speziellen Header werden in das Objekt `request.headers` aufgenommen. Es ist darauf zu achten, diese speziellen Header nicht versehentlich zu ändern, da sonst Fehler auftreten können. Wenn Sie beispielsweise alle Header aus dem Request entfernen, treten Fehler auf:

```js [ESM]
removeAllHeaders(request.headers);
assert(request.url);   // Schlägt fehl, weil der :path-Header entfernt wurde
```
#### `request.httpVersion` {#requesthttpversion}

**Hinzugefügt in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Im Fall einer Serveranfrage die vom Client gesendete HTTP-Version. Im Fall einer Clientantwort die HTTP-Version des verbundenen Servers. Gibt `'2.0'` zurück.

Auch `message.httpVersionMajor` ist die erste ganze Zahl und `message.httpVersionMinor` ist die zweite.

#### `request.method` {#requestmethod}

**Hinzugefügt in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Request-Methode als Zeichenfolge. Schreibgeschützt. Beispiele: `'GET'`, `'DELETE'`.

#### `request.rawHeaders` {#requestrawheaders}

**Hinzugefügt in: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die rohe Request-/Response-Headerliste, genau wie sie empfangen wurde.

Die Schlüssel und Werte befinden sich in derselben Liste. Es ist *keine* Liste von Tupeln. Die geradzahligen Offsets sind also Schlüsselwerte und die ungeradzahligen Offsets sind die zugehörigen Werte.

Header-Namen werden nicht in Kleinbuchstaben umgewandelt und Duplikate werden nicht zusammengeführt.

```js [ESM]
// Gibt etwas wie Folgendes aus:
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

**Hinzugefügt in: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die rohen Request-/Response-Trailer-Schlüssel und -Werte genau so, wie sie empfangen wurden. Wird nur beim `'end'`-Event befüllt.

#### `request.scheme` {#requestscheme}

**Hinzugefügt in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Das Pseudo-Header-Feld des Request-Schemas, das den Schema-Teil der Ziel-URL angibt.

#### `request.setTimeout(msecs, callback)` {#requestsettimeoutmsecs-callback}

**Hinzugefügt in: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<http2.Http2ServerRequest\>](/de/nodejs/api/http2#class-http2http2serverrequest)

Setzt den Timeout-Wert des [`Http2Stream`](/de/nodejs/api/http2#class-http2stream) auf `msecs`. Wenn ein Callback angegeben wird, wird dieser als Listener für das `'timeout'`-Event des Antwortobjekts hinzugefügt.

Wenn dem Request, der Response oder dem Server kein `'timeout'`-Listener hinzugefügt wird, werden [`Http2Stream`](/de/nodejs/api/http2#class-http2stream)s zerstört, wenn sie ein Timeout erreichen. Wenn ein Handler den `'timeout'`-Events des Requests, der Response oder des Servers zugewiesen wird, müssen Sockets mit Timeout explizit behandelt werden.

#### `request.socket` {#requestsocket}

**Hinzugefügt in: v8.4.0**

- [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/de/nodejs/api/tls#class-tlstlssocket)

Gibt ein `Proxy`-Objekt zurück, das als `net.Socket` (oder `tls.TLSSocket`) fungiert, aber Getter, Setter und Methoden basierend auf der HTTP/2-Logik anwendet.

Die Eigenschaften `destroyed`, `readable` und `writable` werden von `request.stream` abgerufen und darauf gesetzt.

Die Methoden `destroy`, `emit`, `end`, `on` und `once` werden auf `request.stream` aufgerufen.

Die Methode `setTimeout` wird auf `request.stream.session` aufgerufen.

`pause`, `read`, `resume` und `write` werfen einen Fehler mit dem Code `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Siehe [`Http2Session` und Sockets](/de/nodejs/api/http2#http2session-and-sockets) für weitere Informationen.

Alle anderen Interaktionen werden direkt an den Socket weitergeleitet. Verwenden Sie mit TLS-Unterstützung [`request.socket.getPeerCertificate()`](/de/nodejs/api/tls#tlssocketgetpeercertificatedetailed), um die Authentifizierungsdetails des Clients abzurufen.


#### `request.stream` {#requeststream}

**Hinzugefügt in: v8.4.0**

- [\<Http2Stream\>](/de/nodejs/api/http2#class-http2stream)

Das [`Http2Stream`](/de/nodejs/api/http2#class-http2stream)-Objekt, das die Anfrage unterstützt.

#### `request.trailers` {#requesttrailers}

**Hinzugefügt in: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Das Request/Response Trailers-Objekt. Wird erst beim `'end'`-Ereignis gefüllt.

#### `request.url` {#requesturl}

**Hinzugefügt in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Request-URL-String. Dieser enthält nur die URL, die in der eigentlichen HTTP-Anfrage vorhanden ist. Wenn die Anfrage ist:

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
Dann ist `request.url`:

```js [ESM]
'/status?name=ryan'
```
Um die URL in ihre Bestandteile zu zerlegen, kann `new URL()` verwendet werden:

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
### Klasse: `http2.Http2ServerResponse` {#class-http2http2serverresponse}

**Hinzugefügt in: v8.4.0**

- Erweitert: [\<Stream\>](/de/nodejs/api/stream#stream)

Dieses Objekt wird intern von einem HTTP-Server erstellt, nicht vom Benutzer. Es wird als zweiter Parameter an das [`'request'`](/de/nodejs/api/http2#event-request)-Ereignis übergeben.

#### Ereignis: `'close'` {#event-close_3}

**Hinzugefügt in: v8.4.0**

Zeigt an, dass der zugrunde liegende [`Http2Stream`](/de/nodejs/api/http2#class-http2stream) beendet wurde, bevor [`response.end()`](/de/nodejs/api/http2#responseenddata-encoding-callback) aufgerufen wurde oder in der Lage war, zu leeren.

#### Ereignis: `'finish'` {#event-finish}

**Hinzugefügt in: v8.4.0**

Wird ausgelöst, wenn die Antwort gesendet wurde. Genauer gesagt wird dieses Ereignis ausgelöst, wenn das letzte Segment der Antwort-Header und des -Bodys an das HTTP/2-Multiplexing zur Übertragung über das Netzwerk übergeben wurde. Es bedeutet nicht, dass der Client bereits etwas empfangen hat.

Nach diesem Ereignis werden keine weiteren Ereignisse für das Antwortobjekt ausgelöst.


#### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**Hinzugefügt in: v8.4.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Diese Methode fügt HTTP-Trailing-Header (ein Header, aber am Ende der Nachricht) zur Antwort hinzu.

Der Versuch, einen Header-Feldnamen oder -wert zu setzen, der ungültige Zeichen enthält, führt zum Auslösen eines [`TypeError`](/de/nodejs/api/errors#class-typeerror).

#### `response.appendHeader(name, value)` {#responseappendheadername-value}

**Hinzugefügt in: v21.7.0, v20.12.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Fügt dem Header-Objekt einen einzelnen Header-Wert hinzu.

Wenn der Wert ein Array ist, ist dies äquivalent zum mehrmaligen Aufrufen dieser Methode.

Wenn es keine vorherigen Werte für den Header gab, ist dies äquivalent zum Aufrufen von [`response.setHeader()`](/de/nodejs/api/http2#responsesetheadername-value).

Der Versuch, einen Header-Feldnamen oder -wert zu setzen, der ungültige Zeichen enthält, führt zum Auslösen eines [`TypeError`](/de/nodejs/api/errors#class-typeerror).

```js [ESM]
// Gibt Header zurück, einschließlich "set-cookie: a" und "set-cookie: b"
const server = http2.createServer((req, res) => {
  res.setHeader('set-cookie', 'a');
  res.appendHeader('set-cookie', 'b');
  res.writeHead(200);
  res.end('ok');
});
```
#### `response.connection` {#responseconnection}

**Hinzugefügt in: v8.4.0**

**Veraltet seit: v13.0.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Verwenden Sie [`response.socket`](/de/nodejs/api/http2#responsesocket).
:::

- [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/de/nodejs/api/tls#class-tlstlssocket)

Siehe [`response.socket`](/de/nodejs/api/http2#responsesocket).

#### `response.createPushResponse(headers, callback)` {#responsecreatepushresponseheaders-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `headers` [\<HTTP/2 Header-Objekt\>](/de/nodejs/api/http2#headers-object) Ein Objekt, das die Header beschreibt
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, sobald `http2stream.pushStream()` abgeschlossen ist oder entweder wenn der Versuch, den gepushten `Http2Stream` zu erstellen, fehlgeschlagen oder abgelehnt wurde oder der Status von `Http2ServerRequest` vor dem Aufrufen der Methode `http2stream.pushStream()` geschlossen wird
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `res` [\<http2.Http2ServerResponse\>](/de/nodejs/api/http2#class-http2http2serverresponse) Das neu erstellte `Http2ServerResponse`-Objekt
  
 

Ruft [`http2stream.pushStream()`](/de/nodejs/api/http2#http2streampushstreamheaders-options-callback) mit den angegebenen Headern auf und wickelt den angegebenen [`Http2Stream`](/de/nodejs/api/http2#class-http2stream) in einem neu erstellten `Http2ServerResponse` als Callback-Parameter ein, falls erfolgreich. Wenn `Http2ServerRequest` geschlossen wird, wird der Callback mit einem Fehler `ERR_HTTP2_INVALID_STREAM` aufgerufen.


#### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Diese Methode gibt nun eine Referenz zu `ServerResponse` zurück. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Diese Methode signalisiert dem Server, dass alle Antwort-Header und der Body gesendet wurden; der Server sollte diese Nachricht als vollständig betrachten. Die Methode `response.end()` MUSS bei jeder Antwort aufgerufen werden.

Wenn `data` angegeben ist, ist dies äquivalent zum Aufruf von [`response.write(data, encoding)`](/de/nodejs/api/http#responsewritechunk-encoding-callback) gefolgt von `response.end(callback)`.

Wenn `callback` angegeben ist, wird diese aufgerufen, wenn der Antwort-Stream abgeschlossen ist.

#### `response.finished` {#responsefinished}

**Hinzugefügt in: v8.4.0**

**Veraltet seit: v13.4.0, v12.16.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Verwenden Sie [`response.writableEnded`](/de/nodejs/api/http2#responsewritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Boolescher Wert, der angibt, ob die Antwort abgeschlossen wurde. Startet als `false`. Nachdem [`response.end()`](/de/nodejs/api/http2#responseenddata-encoding-callback) ausgeführt wurde, ist der Wert `true`.

#### `response.getHeader(name)` {#responsegetheadername}

**Hinzugefügt in: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Liest einen Header aus, der bereits in die Warteschlange gestellt wurde, aber noch nicht an den Client gesendet wurde. Der Name ist nicht case-sensitiv.

```js [ESM]
const contentType = response.getHeader('content-type');
```

#### `response.getHeaderNames()` {#responsegetheadernames}

**Hinzugefügt in: v8.4.0**

- Gibt zurück: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt ein Array mit den eindeutigen Namen der aktuellen ausgehenden Header zurück. Alle Headernamen sind kleingeschrieben.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```
#### `response.getHeaders()` {#responsegetheaders}

**Hinzugefügt in: v8.4.0**

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt eine flache Kopie der aktuellen ausgehenden Header zurück. Da eine flache Kopie verwendet wird, können Array-Werte ohne zusätzliche Aufrufe verschiedener Header-bezogener http-Modulmethoden verändert werden. Die Schlüssel des zurückgegebenen Objekts sind die Headernamen und die Werte sind die jeweiligen Headerwerte. Alle Headernamen sind kleingeschrieben.

Das von der Methode `response.getHeaders()` zurückgegebene Objekt erbt *nicht* prototypisch von dem JavaScript `Object`. Dies bedeutet, dass typische `Object`-Methoden wie `obj.toString()`, `obj.hasOwnProperty()` und andere nicht definiert sind und *nicht funktionieren*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
#### `response.hasHeader(name)` {#responsehasheadername}

**Hinzugefügt in: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der durch `name` identifizierte Header aktuell in den ausgehenden Headern gesetzt ist. Die Übereinstimmung des Headernamens erfolgt ohne Berücksichtigung der Groß-/Kleinschreibung.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
#### `response.headersSent` {#responseheaderssent}

**Hinzugefügt in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

True, wenn Header gesendet wurden, andernfalls false (nur lesbar).


#### `response.removeHeader(name)` {#responseremoveheadername}

**Hinzugefügt in: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Entfernt einen Header, der für den impliziten Versand in die Warteschlange gestellt wurde.

```js [ESM]
response.removeHeader('Content-Encoding');
```
#### `response.req` {#responsereq}

**Hinzugefügt in: v15.7.0**

- [\<http2.Http2ServerRequest\>](/de/nodejs/api/http2#class-http2http2serverrequest)

Eine Referenz auf das ursprüngliche HTTP2-`request`-Objekt.

#### `response.sendDate` {#responsesenddate}

**Hinzugefügt in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn true, wird der Date-Header automatisch generiert und in der Antwort gesendet, falls er noch nicht in den Headern vorhanden ist. Standardmäßig true.

Dies sollte nur für Tests deaktiviert werden; HTTP erfordert den Date-Header in Antworten.

#### `response.setHeader(name, value)` {#responsesetheadername-value}

**Hinzugefügt in: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Setzt einen einzelnen Header-Wert für implizite Header. Wenn dieser Header bereits in den zu sendenden Headern vorhanden ist, wird sein Wert ersetzt. Verwenden Sie hier ein Array von Strings, um mehrere Header mit demselben Namen zu senden.

```js [ESM]
response.setHeader('Content-Type', 'text/html; charset=utf-8');
```
oder

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
Der Versuch, einen Header-Feldnamen oder -Wert zu setzen, der ungültige Zeichen enthält, führt dazu, dass ein [`TypeError`](/de/nodejs/api/errors#class-typeerror) ausgelöst wird.

Wenn Header mit [`response.setHeader()`](/de/nodejs/api/http2#responsesetheadername-value) gesetzt wurden, werden sie mit allen Headern zusammengeführt, die an [`response.writeHead()`](/de/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) übergeben werden, wobei die Header, die an [`response.writeHead()`](/de/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) übergeben werden, Vorrang haben.

```js [ESM]
// Gibt content-type = text/plain zurück
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

#### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**Hinzugefügt in: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<http2.Http2ServerResponse\>](/de/nodejs/api/http2#class-http2http2serverresponse)

Setzt den Timeout-Wert des [`Http2Stream`](/de/nodejs/api/http2#class-http2stream) auf `msecs`. Wenn ein Callback angegeben wird, wird dieser als Listener für das `'timeout'`-Ereignis des Antwortobjekts hinzugefügt.

Wenn kein `'timeout'`-Listener zur Anfrage, der Antwort oder dem Server hinzugefügt wird, werden [`Http2Stream`](/de/nodejs/api/http2#class-http2stream)s zerstört, wenn ein Timeout auftritt. Wenn ein Handler den `'timeout'`-Ereignissen der Anfrage, der Antwort oder des Servers zugewiesen wird, müssen Sockets mit Timeout explizit behandelt werden.

#### `response.socket` {#responsesocket}

**Hinzugefügt in: v8.4.0**

- [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/de/nodejs/api/tls#class-tlstlssocket)

Gibt ein `Proxy`-Objekt zurück, das als `net.Socket` (oder `tls.TLSSocket`) fungiert, aber Getter, Setter und Methoden basierend auf der HTTP/2-Logik anwendet.

Die Eigenschaften `destroyed`, `readable` und `writable` werden von `response.stream` abgerufen und darauf gesetzt.

Die Methoden `destroy`, `emit`, `end`, `on` und `once` werden für `response.stream` aufgerufen.

Die Methode `setTimeout` wird für `response.stream.session` aufgerufen.

`pause`, `read`, `resume` und `write` werfen einen Fehler mit dem Code `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Weitere Informationen finden Sie unter [`Http2Session` und Sockets](/de/nodejs/api/http2#http2session-and-sockets).

Alle anderen Interaktionen werden direkt an den Socket weitergeleitet.

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

**Hinzugefügt in: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Bei Verwendung impliziter Header (ohne expliziten Aufruf von [`response.writeHead()`](/de/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers)) steuert diese Eigenschaft den Statuscode, der an den Client gesendet wird, wenn die Header geleert werden.

```js [ESM]
response.statusCode = 404;
```
Nachdem der Response-Header an den Client gesendet wurde, gibt diese Eigenschaft den gesendeten Statuscode an.

#### `response.statusMessage` {#responsestatusmessage}

**Hinzugefügt in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Statusmeldungen werden von HTTP/2 nicht unterstützt (RFC 7540 8.1.2.4). Es wird eine leere Zeichenkette zurückgegeben.

#### `response.stream` {#responsestream}

**Hinzugefügt in: v8.4.0**

- [\<Http2Stream\>](/de/nodejs/api/http2#class-http2stream)

Das [`Http2Stream`](/de/nodejs/api/http2#class-http2stream)-Objekt, das die Antwort unterstützt.

#### `response.writableEnded` {#responsewritableended}

**Hinzugefügt in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, nachdem [`response.end()`](/de/nodejs/api/http2#responseenddata-encoding-callback) aufgerufen wurde. Diese Eigenschaft gibt nicht an, ob die Daten geleert wurden, verwenden Sie stattdessen [`writable.writableFinished`](/de/nodejs/api/stream#writablewritablefinished).

#### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}

**Hinzugefügt in: v8.4.0**

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn diese Methode aufgerufen wird und [`response.writeHead()`](/de/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) nicht aufgerufen wurde, wechselt sie in den impliziten Header-Modus und leert die impliziten Header.

Dies sendet einen Chunk des Response-Bodys. Diese Methode kann mehrfach aufgerufen werden, um sukzessive Teile des Bodys bereitzustellen.

Im `node:http`-Modul wird der Response-Body ausgelassen, wenn die Anfrage eine HEAD-Anfrage ist. Ebenso *dürfen* die Antworten `204` und `304` keinen Nachrichtentext enthalten.

`chunk` kann ein String oder ein Buffer sein. Wenn `chunk` ein String ist, gibt der zweite Parameter an, wie er in einen Bytestrom kodiert werden soll. Standardmäßig ist die `encoding` `'utf8'`. `callback` wird aufgerufen, wenn dieser Datenblock geleert wird.

Dies ist der rohe HTTP-Body und hat nichts mit höherwertigen Multi-Part-Body-Kodierungen zu tun, die verwendet werden können.

Wenn [`response.write()`](/de/nodejs/api/http2#responsewritechunk-encoding-callback) zum ersten Mal aufgerufen wird, sendet es die gepufferten Header-Informationen und den ersten Chunk des Bodys an den Client. Wenn [`response.write()`](/de/nodejs/api/http2#responsewritechunk-encoding-callback) zum zweiten Mal aufgerufen wird, geht Node.js davon aus, dass die Daten gestreamt werden, und sendet die neuen Daten separat. Das heißt, die Antwort wird bis zum ersten Chunk des Bodys gepuffert.

Gibt `true` zurück, wenn die gesamten Daten erfolgreich in den Kernel-Puffer geleert wurden. Gibt `false` zurück, wenn die gesamten oder Teile der Daten im Benutzerspeicher in die Warteschlange gestellt wurden. `'drain'` wird ausgelöst, wenn der Puffer wieder frei ist.


#### `response.writeContinue()` {#responsewritecontinue}

**Hinzugefügt in: v8.4.0**

Sendet einen Status `100 Continue` an den Client, um anzuzeigen, dass der Anfragetext gesendet werden soll. Siehe das [`'checkContinue'`](/de/nodejs/api/http2#event-checkcontinue)-Event auf `Http2Server` und `Http2SecureServer`.

#### `response.writeEarlyHints(hints)` {#responsewriteearlyhintshints}

**Hinzugefügt in: v18.11.0**

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Sendet einen Status `103 Early Hints` an den Client mit einem Link-Header, um anzuzeigen, dass der User-Agent die verlinkten Ressourcen vorladen/vorverbinden kann. `hints` ist ein Objekt, das die Werte der Header enthält, die mit der Early-Hints-Nachricht gesendet werden sollen.

**Beispiel**

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


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v11.10.0, v10.17.0 | Gibt `this` von `writeHead()` zurück, um eine Verkettung mit `end()` zu ermöglichen. |
| v8.4.0 | Hinzugefügt in: v8.4.0 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- Gibt zurück: [\<http2.Http2ServerResponse\>](/de/nodejs/api/http2#class-http2http2serverresponse)

Sendet einen Antwort-Header an die Anfrage. Der Statuscode ist ein dreistelliger HTTP-Statuscode, wie z. B. `404`. Das letzte Argument, `headers`, sind die Antwort-Header.

Gibt eine Referenz auf die `Http2ServerResponse` zurück, sodass Aufrufe verkettet werden können.

Zur Kompatibilität mit [HTTP/1](/de/nodejs/api/http) kann eine für Menschen lesbare `statusMessage` als zweites Argument übergeben werden. Da die `statusMessage` jedoch innerhalb von HTTP/2 keine Bedeutung hat, hat das Argument keine Auswirkung und es wird eine Prozesswarnung ausgegeben.

```js [ESM]
const body = 'hello world';
response.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/plain; charset=utf-8',
});
```
`Content-Length` wird in Bytes und nicht in Zeichen angegeben. Die `Buffer.byteLength()`-API kann verwendet werden, um die Anzahl der Bytes in einer bestimmten Kodierung zu bestimmen. Bei ausgehenden Nachrichten prüft Node.js nicht, ob Content-Length und die Länge des übertragenen Texts gleich sind oder nicht. Beim Empfang von Nachrichten lehnt Node.js jedoch automatisch Nachrichten ab, wenn die `Content-Length` nicht mit der tatsächlichen Payload-Größe übereinstimmt.

Diese Methode kann höchstens einmal pro Nachricht aufgerufen werden, bevor [`response.end()`](/de/nodejs/api/http2#responseenddata-encoding-callback) aufgerufen wird.

Wenn [`response.write()`](/de/nodejs/api/http2#responsewritechunk-encoding-callback) oder [`response.end()`](/de/nodejs/api/http2#responseenddata-encoding-callback) aufgerufen werden, bevor diese aufgerufen wird, werden die impliziten/veränderlichen Header berechnet und diese Funktion aufgerufen.

Wenn Header mit [`response.setHeader()`](/de/nodejs/api/http2#responsesetheadername-value) gesetzt wurden, werden sie mit allen Headern zusammengeführt, die an [`response.writeHead()`](/de/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) übergeben werden, wobei die an [`response.writeHead()`](/de/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) übergebenen Header Vorrang haben.

```js [ESM]
// Gibt content-type = text/plain zurück
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
Der Versuch, einen Header-Feldnamen oder -wert festzulegen, der ungültige Zeichen enthält, führt dazu, dass ein [`TypeError`](/de/nodejs/api/errors#class-typeerror) ausgelöst wird.


## HTTP/2-Performance-Metriken sammeln {#collecting-http/2-performance-metrics}

Die [Performance Observer](/de/nodejs/api/perf_hooks)-API kann verwendet werden, um grundlegende Performance-Metriken für jede `Http2Session`- und `Http2Stream`-Instanz zu sammeln.

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // prints 'http2'
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
  console.log(entry.entryType);  // prints 'http2'
  if (entry.name === 'Http2Session') {
    // Entry contains statistics about the Http2Session
  } else if (entry.name === 'Http2Stream') {
    // Entry contains statistics about the Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```
:::

Die `entryType`-Eigenschaft des `PerformanceEntry` ist gleich `'http2'`.

Die `name`-Eigenschaft des `PerformanceEntry` ist entweder `'Http2Stream'` oder `'Http2Session'`.

Wenn `name` gleich `Http2Stream` ist, enthält der `PerformanceEntry` die folgenden zusätzlichen Eigenschaften:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der `DATA`-Frame-Bytes, die für diesen `Http2Stream` empfangen wurden.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der `DATA`-Frame-Bytes, die für diesen `Http2Stream` gesendet wurden.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Bezeichner des zugehörigen `Http2Stream`
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die zwischen der `startTime` des `PerformanceEntry` und dem Empfang des ersten `DATA`-Frames verstrichen sind.
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die zwischen der `startTime` des `PerformanceEntry` und dem Senden des ersten `DATA`-Frames verstrichen sind.
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die zwischen der `startTime` des `PerformanceEntry` und dem Empfang des ersten Headers verstrichen sind.

Wenn `name` gleich `Http2Session` ist, enthält der `PerformanceEntry` die folgenden zusätzlichen Eigenschaften:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der für diese `Http2Session` empfangenen Bytes.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der für diese `Http2Session` gesendeten Bytes.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der HTTP/2-Frames, die von der `Http2Session` empfangen wurden.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der HTTP/2-Frames, die von der `Http2Session` gesendet wurden.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale Anzahl der gleichzeitig offenen Streams während der Lebensdauer der `Http2Session`.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die seit der Übertragung eines `PING`-Frames und dem Empfang seiner Bestätigung verstrichen sind. Nur vorhanden, wenn ein `PING`-Frame auf der `Http2Session` gesendet wurde.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die durchschnittliche Dauer (in Millisekunden) für alle `Http2Stream`-Instanzen.
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der `Http2Stream`-Instanzen, die von der `Http2Session` verarbeitet wurden.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Entweder `'server'` oder `'client'`, um den Typ der `Http2Session` zu identifizieren.


## Hinweis zu `:authority` und `host` {#note-on-authority-and-host}

HTTP/2 erfordert, dass Anfragen entweder den Pseudo-Header `:authority` oder den Header `host` enthalten. Bevorzugen Sie `:authority`, wenn Sie eine HTTP/2-Anfrage direkt erstellen, und `host`, wenn Sie von HTTP/1 konvertieren (z. B. in Proxys).

Die Kompatibilitäts-API greift auf `host` zurück, wenn `:authority` nicht vorhanden ist. Weitere Informationen finden Sie unter [`request.authority`](/de/nodejs/api/http2#requestauthority). Wenn Sie die Kompatibilitäts-API jedoch nicht verwenden (oder `req.headers` direkt verwenden), müssen Sie jedes Fallback-Verhalten selbst implementieren.

