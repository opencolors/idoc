---
title: Node.js HTTP-Modul Dokumentation
description: Die offizielle Dokumentation des HTTP-Moduls in Node.js, die beschreibt, wie man HTTP-Server und -Clients erstellt, Anfragen und Antworten behandelt und verschiedene HTTP-Methoden und Header verwaltet.
head:
  - - meta
    - name: og:title
      content: Node.js HTTP-Modul Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Die offizielle Dokumentation des HTTP-Moduls in Node.js, die beschreibt, wie man HTTP-Server und -Clients erstellt, Anfragen und Antworten behandelt und verschiedene HTTP-Methoden und Header verwaltet.
  - - meta
    - name: twitter:title
      content: Node.js HTTP-Modul Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Die offizielle Dokumentation des HTTP-Moduls in Node.js, die beschreibt, wie man HTTP-Server und -Clients erstellt, Anfragen und Antworten behandelt und verschiedene HTTP-Methoden und Header verwaltet.
---


# HTTP {#http}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/http.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http.js)

Dieses Modul, das sowohl einen Client als auch einen Server enthält, kann über `require('node:http')` (CommonJS) oder `import * as http from 'node:http'` (ES-Modul) importiert werden.

Die HTTP-Schnittstellen in Node.js sind so konzipiert, dass sie viele Funktionen des Protokolls unterstützen, deren Verwendung traditionell schwierig war. Insbesondere große, möglicherweise chunk-kodierte Nachrichten. Die Schnittstelle achtet darauf, niemals vollständige Anfragen oder Antworten zu puffern, sodass der Benutzer Daten streamen kann.

HTTP-Nachrichtenkopfzeilen werden durch ein Objekt wie dieses dargestellt:

```json [JSON]
{ "content-length": "123",
  "content-type": "text/plain",
  "connection": "keep-alive",
  "host": "example.com",
  "accept": "*/*" }
```
Schlüssel werden in Kleinbuchstaben geschrieben. Werte werden nicht geändert.

Um das gesamte Spektrum möglicher HTTP-Anwendungen zu unterstützen, ist die Node.js HTTP-API sehr Low-Level. Sie befasst sich nur mit Stream-Handling und Nachrichten-Parsing. Sie parst eine Nachricht in Header und Body, aber sie parst nicht die eigentlichen Header oder den Body.

Weitere Informationen zur Behandlung doppelter Header finden Sie unter [`message.headers`](/de/nodejs/api/http#messageheaders).

Die empfangenen Rohheader werden in der Eigenschaft `rawHeaders` gespeichert, die ein Array von `[key, value, key2, value2, ...]` ist. Beispielsweise könnte das vorherige Nachrichtenkopfzeilenobjekt eine `rawHeaders`-Liste wie die folgende haben:

```js [ESM]
[ 'ConTent-Length', '123456',
  'content-LENGTH', '123',
  'content-type', 'text/plain',
  'CONNECTION', 'keep-alive',
  'Host', 'example.com',
  'accepT', '*/*' ]
```
## Klasse: `http.Agent` {#class-httpagent}

**Hinzugefügt in: v0.3.4**

Ein `Agent` ist für die Verwaltung der Verbindungspersistenz und -wiederverwendung für HTTP-Clients verantwortlich. Er verwaltet eine Warteschlange mit ausstehenden Anfragen für einen bestimmten Host und Port und verwendet für jede Anfrage eine einzelne Socket-Verbindung wieder, bis die Warteschlange leer ist. Zu diesem Zeitpunkt wird der Socket entweder zerstört oder in einen Pool gelegt, wo er aufbewahrt wird, um für Anfragen an denselben Host und Port wieder verwendet zu werden. Ob er zerstört oder gepoolt wird, hängt von der `keepAlive` [Option](/de/nodejs/api/http#new-agentoptions) ab.

Gepoolte Verbindungen haben TCP Keep-Alive aktiviert, aber Server können dennoch Leerlaufverbindungen schließen. In diesem Fall werden sie aus dem Pool entfernt und eine neue Verbindung wird hergestellt, wenn eine neue HTTP-Anfrage für diesen Host und Port gestellt wird. Server können auch die Mehrfachverwendung der gleichen Verbindung ablehnen. In diesem Fall muss die Verbindung für jede Anfrage neu hergestellt werden und kann nicht gepoolt werden. Der `Agent` stellt weiterhin die Anfragen an diesen Server, aber jede Anfrage erfolgt über eine neue Verbindung.

Wenn eine Verbindung vom Client oder Server geschlossen wird, wird sie aus dem Pool entfernt. Alle nicht verwendeten Sockets im Pool werden unrefed, um zu verhindern, dass der Node.js-Prozess weiterläuft, wenn keine ausstehenden Anfragen vorhanden sind (siehe [`socket.unref()`](/de/nodejs/api/net#socketunref)).

Es ist eine gute Praxis, eine `Agent`-Instanz zu [`destroy()`](/de/nodejs/api/http#agentdestroy), wenn sie nicht mehr verwendet wird, da nicht verwendete Sockets OS-Ressourcen verbrauchen.

Sockets werden aus einem Agent entfernt, wenn der Socket entweder ein `'close'`- oder ein `'agentRemove'`-Ereignis ausgibt. Wenn beabsichtigt ist, eine HTTP-Anfrage für lange Zeit offen zu halten, ohne sie im Agent zu behalten, kann Folgendes durchgeführt werden:

```js [ESM]
http.get(options, (res) => {
  // Do stuff
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});
```
Ein Agent kann auch für eine einzelne Anfrage verwendet werden. Indem `{agent: false}` als Option für die Funktionen `http.get()` oder `http.request()` angegeben wird, wird ein einmal verwendbarer `Agent` mit Standardoptionen für die Client-Verbindung verwendet.

`agent:false`:

```js [ESM]
http.get({
  hostname: 'localhost',
  port: 80,
  path: '/',
  agent: false,  // Einen neuen Agent nur für diese eine Anfrage erstellen
}, (res) => {
  // Mit der Antwort etwas tun
});
```

### `new Agent([options])` {#new-agentoptions}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.6.0, v14.17.0 | Ändern der Standardplanung von 'fifo' zu 'lifo'. |
| v14.5.0, v12.20.0 | Hinzufügen der Option `scheduling`, um die Strategie für die Planung freier Sockets anzugeben. |
| v14.5.0, v12.19.0 | Hinzufügen der Option `maxTotalSockets` zum Agent-Konstruktor. |
| v0.3.4 | Hinzugefügt in: v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Eine Reihe von konfigurierbaren Optionen, die für den Agenten festgelegt werden können. Kann die folgenden Felder haben:
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Behält Sockets auch dann bei, wenn keine ausstehenden Anfragen vorhanden sind, sodass sie für zukünftige Anfragen verwendet werden können, ohne eine TCP-Verbindung wiederherstellen zu müssen. Nicht zu verwechseln mit dem `keep-alive`-Wert des `Connection`-Headers. Der `Connection: keep-alive`-Header wird immer gesendet, wenn ein Agent verwendet wird, es sei denn, der `Connection`-Header wird explizit angegeben oder die Optionen `keepAlive` und `maxSockets` werden auf `false` bzw. `Infinity` gesetzt. In diesem Fall wird `Connection: close` verwendet. **Standard:** `false`.
    - `keepAliveMsecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Bei Verwendung der Option `keepAlive` wird die [initiale Verzögerung](/de/nodejs/api/net#socketsetkeepaliveenable-initialdelay) für TCP Keep-Alive-Pakete angegeben. Wird ignoriert, wenn die Option `keepAlive` `false` oder `undefined` ist. **Standard:** `1000`.
    - `maxSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Maximale Anzahl von Sockets, die pro Host zulässig sind. Wenn derselbe Host mehrere gleichzeitige Verbindungen öffnet, verwendet jede Anfrage einen neuen Socket, bis der Wert `maxSockets` erreicht ist. Wenn der Host versucht, mehr Verbindungen als `maxSockets` zu öffnen, werden die zusätzlichen Anfragen in eine Warteschlange für ausstehende Anfragen eingereiht und gehen in den aktiven Verbindungsstatus über, wenn eine bestehende Verbindung beendet wird. Dies stellt sicher, dass zu jedem Zeitpunkt höchstens `maxSockets` aktive Verbindungen von einem bestimmten Host bestehen. **Standard:** `Infinity`.
    - `maxTotalSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Maximale Anzahl von Sockets, die insgesamt für alle Hosts zulässig sind. Jede Anfrage verwendet einen neuen Socket, bis das Maximum erreicht ist. **Standard:** `Infinity`.
    - `maxFreeSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Maximale Anzahl von Sockets pro Host, die in einem freien Zustand offen bleiben sollen. Nur relevant, wenn `keepAlive` auf `true` gesetzt ist. **Standard:** `256`.
    - `scheduling` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Planungsstrategie, die bei der Auswahl des nächsten zu verwendenden freien Sockets angewendet werden soll. Sie kann `'fifo'` oder `'lifo'` sein. Der Hauptunterschied zwischen den beiden Planungsstrategien besteht darin, dass `'lifo'` den zuletzt verwendeten Socket auswählt, während `'fifo'` den am wenigsten verwendeten Socket auswählt. Bei einer niedrigen Anfragerate pro Sekunde verringert die `'lifo'`-Planung das Risiko, einen Socket auszuwählen, der vom Server aufgrund von Inaktivität geschlossen wurde. Bei einer hohen Anfragerate pro Sekunde maximiert die `'fifo'`-Planung die Anzahl der geöffneten Sockets, während die `'lifo'`-Planung sie so niedrig wie möglich hält. **Standard:** `'lifo'`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Socket-Timeout in Millisekunden. Dadurch wird das Timeout beim Erstellen des Sockets festgelegt.
  
 

`options` in [`socket.connect()`](/de/nodejs/api/net#socketconnectoptions-connectlistener) werden ebenfalls unterstützt.

Um diese zu konfigurieren, muss eine benutzerdefinierte [`http.Agent`](/de/nodejs/api/http#class-httpagent)-Instanz erstellt werden.



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

**Hinzugefügt in: v0.11.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optionen, die Verbindungsdetails enthalten. Siehe [`net.createConnection()`](/de/nodejs/api/net#netcreateconnectionoptions-connectlistener) für das Format der Optionen.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback-Funktion, die den erstellten Socket empfängt
- Gibt zurück: [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Erstellt einen Socket/Stream zur Verwendung für HTTP-Anfragen.

Standardmäßig ist diese Funktion identisch mit [`net.createConnection()`](/de/nodejs/api/net#netcreateconnectionoptions-connectlistener). Benutzerdefinierte Agents können diese Methode jedoch überschreiben, falls eine größere Flexibilität gewünscht ist.

Ein Socket/Stream kann auf zwei Arten bereitgestellt werden: durch Rückgabe des Sockets/Streams von dieser Funktion oder durch Übergabe des Sockets/Streams an `callback`.

Diese Methode gibt garantiert eine Instanz der Klasse [\<net.Socket\>](/de/nodejs/api/net#class-netsocket), einer Unterklasse von [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex), zurück, es sei denn, der Benutzer gibt einen anderen Socket-Typ als [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) an.

`callback` hat die Signatur `(err, stream)`.

### `agent.keepSocketAlive(socket)` {#agentkeepsocketalivesocket}

**Hinzugefügt in: v8.1.0**

- `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Wird aufgerufen, wenn `socket` von einer Anfrage getrennt wird und vom `Agent` beibehalten werden könnte. Das Standardverhalten ist:

```js [ESM]
socket.setKeepAlive(true, this.keepAliveMsecs);
socket.unref();
return true;
```
Diese Methode kann von einer bestimmten `Agent`-Unterklasse überschrieben werden. Wenn diese Methode einen falschen Wert zurückgibt, wird der Socket zerstört, anstatt ihn für die Verwendung mit der nächsten Anfrage beizubehalten.

Das `socket`-Argument kann eine Instanz von [\<net.Socket\>](/de/nodejs/api/net#class-netsocket), einer Unterklasse von [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex), sein.

### `agent.reuseSocket(socket, request)` {#agentreusesocketsocket-request}

**Hinzugefügt in: v8.1.0**

- `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)
- `request` [\<http.ClientRequest\>](/de/nodejs/api/http#class-httpclientrequest)

Wird aufgerufen, wenn `socket` an `request` angehängt wird, nachdem er aufgrund der Keep-Alive-Optionen beibehalten wurde. Das Standardverhalten ist:

```js [ESM]
socket.ref();
```
Diese Methode kann von einer bestimmten `Agent`-Unterklasse überschrieben werden.

Das `socket`-Argument kann eine Instanz von [\<net.Socket\>](/de/nodejs/api/net#class-netsocket), einer Unterklasse von [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex), sein.


### `agent.destroy()` {#agentdestroy}

**Hinzugefügt in: v0.11.4**

Zerstört alle Sockets, die derzeit vom Agenten verwendet werden.

Es ist normalerweise nicht notwendig, dies zu tun. Wenn jedoch ein Agent mit aktivierter `keepAlive`-Option verwendet wird, ist es am besten, den Agenten explizit herunterzufahren, wenn er nicht mehr benötigt wird. Andernfalls können Sockets für eine beträchtliche Zeit offen bleiben, bevor der Server sie beendet.

### `agent.freeSockets` {#agentfreesockets}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Die Eigenschaft hat jetzt einen `null`-Prototyp. |
| v0.11.4 | Hinzugefügt in: v0.11.4 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Ein Objekt, das Arrays von Sockets enthält, die derzeit vom Agenten verwendet werden, wenn `keepAlive` aktiviert ist. Nicht verändern.

Sockets in der `freeSockets`-Liste werden automatisch zerstört und aus dem Array entfernt, wenn ein `'timeout'` auftritt.

### `agent.getName([options])` {#agentgetnameoptions}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v17.7.0, v16.15.0 | Der Parameter `options` ist jetzt optional. |
| v0.11.4 | Hinzugefügt in: v0.11.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Eine Reihe von Optionen, die Informationen für die Namensgenerierung bereitstellen
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein Domainname oder eine IP-Adresse des Servers, an den die Anfrage gesendet werden soll
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port des Remote-Servers
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lokale Schnittstelle, die für Netzwerkverbindungen beim Senden der Anfrage gebunden werden soll
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Muss 4 oder 6 sein, wenn dies nicht `undefined` entspricht.
  
 
- Rückgabe: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ermittelt einen eindeutigen Namen für eine Reihe von Anfrageoptionen, um festzustellen, ob eine Verbindung wiederverwendet werden kann. Für einen HTTP-Agenten gibt dies `host:port:localAddress` oder `host:port:localAddress:family` zurück. Für einen HTTPS-Agenten umfasst der Name die CA, das Zertifikat, die Chiffren und andere HTTPS/TLS-spezifische Optionen, die die Wiederverwendbarkeit des Sockets bestimmen.


### `agent.maxFreeSockets` {#agentmaxfreesockets}

**Hinzugefügt in: v0.11.7**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Standardmäßig auf 256 gesetzt. Für Agents mit aktiviertem `keepAlive` legt dies die maximale Anzahl von Sockets fest, die im freien Zustand offen gelassen werden.

### `agent.maxSockets` {#agentmaxsockets}

**Hinzugefügt in: v0.3.6**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Standardmäßig auf `Infinity` gesetzt. Bestimmt, wie viele gleichzeitige Sockets der Agent pro Ursprung öffnen kann. Der Ursprung ist der Rückgabewert von [`agent.getName()`](/de/nodejs/api/http#agentgetnameoptions).

### `agent.maxTotalSockets` {#agentmaxtotalsockets}

**Hinzugefügt in: v14.5.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Standardmäßig auf `Infinity` gesetzt. Bestimmt, wie viele gleichzeitige Sockets der Agent öffnen kann. Im Gegensatz zu `maxSockets` gilt dieser Parameter für alle Ursprünge.

### `agent.requests` {#agentrequests}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Die Eigenschaft hat jetzt einen `null`-Prototyp. |
| v0.5.9 | Hinzugefügt in: v0.5.9 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Ein Objekt, das Warteschlangen von Anforderungen enthält, die noch keinen Sockets zugewiesen wurden. Nicht ändern.

### `agent.sockets` {#agentsockets}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Die Eigenschaft hat jetzt einen `null`-Prototyp. |
| v0.3.6 | Hinzugefügt in: v0.3.6 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Ein Objekt, das Arrays von Sockets enthält, die derzeit vom Agent verwendet werden. Nicht ändern.

## Klasse: `http.ClientRequest` {#class-httpclientrequest}

**Hinzugefügt in: v0.1.17**

- Erweitert: [\<http.OutgoingMessage\>](/de/nodejs/api/http#class-httpoutgoingmessage)

Dieses Objekt wird intern erstellt und von [`http.request()`](/de/nodejs/api/http#httprequestoptions-callback) zurückgegeben. Es repräsentiert eine *laufende* Anfrage, deren Header bereits in die Warteschlange gestellt wurde. Der Header ist weiterhin mit der API [`setHeader(name, value)`](/de/nodejs/api/http#requestsetheadername-value), [`getHeader(name)`](/de/nodejs/api/http#requestgetheadername), [`removeHeader(name)`](/de/nodejs/api/http#requestremoveheadername) änderbar. Der eigentliche Header wird zusammen mit dem ersten Datenchunk oder beim Aufrufen von [`request.end()`](/de/nodejs/api/http#requestenddata-encoding-callback) gesendet.

Um die Antwort zu erhalten, fügen Sie einen Listener für [`'response'`](/de/nodejs/api/http#event-response) zum Anfrageobjekt hinzu. [`'response'`](/de/nodejs/api/http#event-response) wird vom Anfrageobjekt ausgegeben, wenn die Antwort-Header empfangen wurden. Das [`'response'`](/de/nodejs/api/http#event-response)-Ereignis wird mit einem Argument ausgeführt, das eine Instanz von [`http.IncomingMessage`](/de/nodejs/api/http#class-httpincomingmessage) ist.

Während des [`'response'`](/de/nodejs/api/http#event-response)-Ereignisses können Listener zum Antwortobjekt hinzugefügt werden; insbesondere um auf das `'data'`-Ereignis zu hören.

Wenn kein [`'response'`](/de/nodejs/api/http#event-response)-Handler hinzugefügt wird, wird die Antwort vollständig verworfen. Wenn jedoch ein [`'response'`](/de/nodejs/api/http#event-response)-Ereignis-Handler hinzugefügt wird, **müssen** die Daten aus dem Antwortobjekt verbraucht werden, entweder durch Aufrufen von `response.read()`, wenn ein `'readable'`-Ereignis vorhanden ist, oder durch Hinzufügen eines `'data'`-Handlers oder durch Aufrufen der Methode `.resume()`. Bis die Daten verbraucht sind, wird das `'end'`-Ereignis nicht ausgelöst. Bis die Daten gelesen sind, verbrauchen sie außerdem Speicher, was schließlich zu einem Fehler "Prozess hat nicht genügend Speicher" führen kann.

Aus Gründen der Abwärtskompatibilität gibt `res` nur dann `'error'` aus, wenn ein `'error'`-Listener registriert ist.

Setzen Sie den `Content-Length`-Header, um die Größe des Antworttextes zu begrenzen. Wenn [`response.strictContentLength`](/de/nodejs/api/http#responsestrictcontentlength) auf `true` gesetzt ist, führt eine Nichtübereinstimmung des `Content-Length`-Headerwerts dazu, dass ein `Error` ausgelöst wird, der durch `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/de/nodejs/api/errors#err_http_content_length_mismatch) identifiziert wird.

Der Wert von `Content-Length` sollte in Bytes und nicht in Zeichen angegeben werden. Verwenden Sie [`Buffer.byteLength()`](/de/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding), um die Länge des Texts in Bytes zu bestimmen.


### Ereignis: `'abort'` {#event-abort}

**Hinzugefügt in: v1.4.1**

**Veraltet seit: v17.0.0, v16.12.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Hören Sie stattdessen auf das `'close'`-Ereignis.
:::

Wird ausgelöst, wenn die Anfrage vom Client abgebrochen wurde. Dieses Ereignis wird nur beim ersten Aufruf von `abort()` ausgelöst.

### Ereignis: `'close'` {#event-close}

**Hinzugefügt in: v0.5.4**

Zeigt an, dass die Anfrage abgeschlossen ist oder die zugrunde liegende Verbindung vorzeitig beendet wurde (vor Abschluss der Antwort).

### Ereignis: `'connect'` {#event-connect}

**Hinzugefügt in: v0.7.0**

- `response` [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Wird jedes Mal ausgelöst, wenn ein Server auf eine Anfrage mit einer `CONNECT`-Methode antwortet. Wenn dieses Ereignis nicht abgehört wird, werden Clients, die eine `CONNECT`-Methode empfangen, ihre Verbindungen geschlossen.

Es wird garantiert, dass diesem Ereignis eine Instanz der Klasse [\<net.Socket\>](/de/nodejs/api/net#class-netsocket), einer Subklasse von [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex) übergeben wird, es sei denn, der Benutzer gibt einen anderen Socket-Typ als [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) an.

Ein Client- und Serverpaar, das demonstriert, wie man das `'connect'`-Ereignis abhört:

::: code-group
```js [ESM]
import { createServer, request } from 'node:http';
import { connect } from 'node:net';
import { URL } from 'node:url';

// Erstellen Sie einen HTTP-Tunneling-Proxy
const proxy = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Verbinden Sie sich mit einem Ursprungsserver
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

// Jetzt, da der Proxy läuft
proxy.listen(1337, '127.0.0.1', () => {

  // Stellen Sie eine Anfrage an einen Tunneling-Proxy
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

    // Stellen Sie eine Anfrage über einen HTTP-Tunnel
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

// Erstellen Sie einen HTTP-Tunneling-Proxy
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Verbinden Sie sich mit einem Ursprungsserver
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

// Jetzt, da der Proxy läuft
proxy.listen(1337, '127.0.0.1', () => {

  // Stellen Sie eine Anfrage an einen Tunneling-Proxy
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

    // Stellen Sie eine Anfrage über einen HTTP-Tunnel
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


### Ereignis: `'continue'` {#event-continue}

**Hinzugefügt in: v0.3.2**

Wird ausgelöst, wenn der Server eine HTTP-Antwort '100 Continue' sendet, normalerweise weil die Anfrage 'Expect: 100-continue' enthielt. Dies ist eine Anweisung, dass der Client den Anfragekörper senden soll.

### Ereignis: `'finish'` {#event-finish}

**Hinzugefügt in: v0.3.6**

Wird ausgelöst, wenn die Anfrage gesendet wurde. Genauer gesagt wird dieses Ereignis ausgelöst, wenn das letzte Segment der Antwort-Header und des Antwortkörpers an das Betriebssystem zur Übertragung über das Netzwerk übergeben wurde. Dies impliziert nicht, dass der Server bereits etwas empfangen hat.

### Ereignis: `'information'` {#event-information}

**Hinzugefügt in: v10.0.0**

- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `httpVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `httpVersionMajor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `httpVersionMinor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rawHeaders` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Wird ausgelöst, wenn der Server eine 1xx-Zwischenantwort sendet (mit Ausnahme von 101 Upgrade). Die Listener dieses Ereignisses erhalten ein Objekt, das die HTTP-Version, den Statuscode, die Statusmeldung, das Key-Value-Header-Objekt und ein Array mit den Roh-Header-Namen, gefolgt von ihren jeweiligen Werten, enthält.

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

101 Upgrade-Status lösen dieses Ereignis nicht aus, da sie von der traditionellen HTTP-Anfrage/Antwort-Kette abweichen, wie z. B. WebSockets, In-Place-TLS-Upgrades oder HTTP 2.0. Um über 101 Upgrade-Hinweise benachrichtigt zu werden, sollten Sie stattdessen auf das [`'upgrade'`]-Ereignis](/de/nodejs/api/http#event-upgrade) hören.


### Event: `'response'` {#event-response}

**Hinzugefügt in: v0.1.0**

- `response` [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage)

Wird ausgegeben, wenn eine Antwort auf diese Anfrage empfangen wurde. Dieses Ereignis wird nur einmal ausgegeben.

### Event: `'socket'` {#event-socket}

**Hinzugefügt in: v0.5.3**

- `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Es wird garantiert eine Instanz der Klasse [\<net.Socket\>](/de/nodejs/api/net#class-netsocket), einer Unterklasse von [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex), an dieses Ereignis übergeben, es sei denn, der Benutzer gibt einen anderen Socket-Typ als [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) an.

### Event: `'timeout'` {#event-timeout}

**Hinzugefügt in: v0.7.8**

Wird ausgegeben, wenn das zugrunde liegende Socket aufgrund von Inaktivität ein Timeout erfährt. Dies benachrichtigt lediglich darüber, dass das Socket inaktiv war. Die Anfrage muss manuell zerstört werden.

Siehe auch: [`request.setTimeout()`](/de/nodejs/api/http#requestsettimeouttimeout-callback).

### Event: `'upgrade'` {#event-upgrade}

**Hinzugefügt in: v0.1.94**

- `response` [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Wird jedes Mal ausgegeben, wenn ein Server mit einem Upgrade auf eine Anfrage antwortet. Wenn dieses Ereignis nicht überwacht wird und der Antwortstatuscode 101 Switching Protocols lautet, werden Clients, die einen Upgrade-Header empfangen, ihre Verbindungen geschlossen.

Es wird garantiert eine Instanz der Klasse [\<net.Socket\>](/de/nodejs/api/net#class-netsocket), einer Unterklasse von [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex), an dieses Ereignis übergeben, es sei denn, der Benutzer gibt einen anderen Socket-Typ als [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) an.

Ein Client-Server-Paar, das demonstriert, wie das Ereignis `'upgrade'` überwacht wird.

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

**Hinzugefügt in: v0.3.8**

**Veraltet seit: v14.1.0, v13.14.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`request.destroy()`](/de/nodejs/api/http#requestdestroyerror).
:::

Markiert die Anfrage als abgebrochen. Wenn Sie dies aufrufen, werden verbleibende Daten in der Antwort verworfen und der Socket zerstört.

### `request.aborted` {#requestaborted}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.0.0, v16.12.0 | Veraltet seit: v17.0.0, v16.12.0 |
| v11.0.0 | Die Eigenschaft `aborted` ist keine Zeitstempelnummer mehr. |
| v0.11.14 | Hinzugefügt in: v0.11.14 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Überprüfen Sie stattdessen [`request.destroyed`](/de/nodejs/api/http#requestdestroyed).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Eigenschaft `request.aborted` ist `true`, wenn die Anfrage abgebrochen wurde.

### `request.connection` {#requestconnection}

**Hinzugefügt in: v0.3.0**

**Veraltet seit: v13.0.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Verwenden Sie [`request.socket`](/de/nodejs/api/http#requestsocket).
:::

- [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Siehe [`request.socket`](/de/nodejs/api/http#requestsocket).

### `request.cork()` {#requestcork}

**Hinzugefügt in: v13.2.0, v12.16.0**

Siehe [`writable.cork()`](/de/nodejs/api/stream#writablecork).

### `request.end([data[, encoding]][, callback])` {#requestenddata-encoding-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Der Parameter `data` kann jetzt ein `Uint8Array` sein. |
| v10.0.0 | Diese Methode gibt jetzt eine Referenz auf `ClientRequest` zurück. |
| v0.1.90 | Hinzugefügt in: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Beendet das Senden der Anfrage. Wenn noch Teile des Bodys ungesendet sind, werden diese in den Stream geschrieben. Wenn die Anfrage chunked ist, sendet dies das abschließende `'0\r\n\r\n'`.

Wenn `data` angegeben ist, entspricht dies dem Aufruf von [`request.write(data, encoding)`](/de/nodejs/api/http#requestwritechunk-encoding-callback), gefolgt von `request.end(callback)`.

Wenn `callback` angegeben ist, wird diese aufgerufen, wenn der Anfrage-Stream abgeschlossen ist.


### `request.destroy([error])` {#requestdestroyerror}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.5.0 | Die Funktion gibt `this` zurück, um Konsistenz mit anderen lesbaren Streams zu gewährleisten. |
| v0.3.0 | Hinzugefügt in: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Optional, ein Fehler, der mit dem `'error'`-Ereignis ausgegeben wird.
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Zerstört die Anfrage. Gibt optional ein `'error'`-Ereignis und ein `'close'`-Ereignis aus. Der Aufruf bewirkt, dass verbleibende Daten in der Antwort verworfen und der Socket zerstört wird.

Weitere Details finden Sie unter [`writable.destroy()`](/de/nodejs/api/stream#writabledestroyerror).

#### `request.destroyed` {#requestdestroyed}

**Hinzugefügt in: v14.1.0, v13.14.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, nachdem [`request.destroy()`](/de/nodejs/api/http#requestdestroyerror) aufgerufen wurde.

Weitere Details finden Sie unter [`writable.destroyed`](/de/nodejs/api/stream#writabledestroyed).

### `request.finished` {#requestfinished}

**Hinzugefügt in: v0.0.1**

**Veraltet seit: v13.4.0, v12.16.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Verwenden Sie [`request.writableEnded`](/de/nodejs/api/http#requestwritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Eigenschaft `request.finished` ist `true`, wenn [`request.end()`](/de/nodejs/api/http#requestenddata-encoding-callback) aufgerufen wurde. `request.end()` wird automatisch aufgerufen, wenn die Anfrage über [`http.get()`](/de/nodejs/api/http#httpgetoptions-callback) initiiert wurde.

### `request.flushHeaders()` {#requestflushheaders}

**Hinzugefügt in: v1.6.0**

Leert die Anfrage-Header.

Aus Effizienzgründen puffert Node.js normalerweise die Anfrage-Header, bis `request.end()` aufgerufen wird oder der erste Chunk von Anfragedaten geschrieben wird. Anschließend versucht es, die Anfrage-Header und -Daten in ein einzelnes TCP-Paket zu packen.

Dies ist normalerweise erwünscht (es spart einen TCP-Roundtrip), aber nicht, wenn die ersten Daten möglicherweise erst viel später gesendet werden. `request.flushHeaders()` umgeht die Optimierung und startet die Anfrage.


### `request.getHeader(name)` {#requestgetheadername}

**Hinzugefügt in: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Liest einen Header in der Anfrage aus. Der Name ist case-insensitiv. Der Typ des Rückgabewerts hängt von den Argumenten ab, die an [`request.setHeader()`](/de/nodejs/api/http#requestsetheadername-value) übergeben werden.

```js [ESM]
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType' ist 'text/html'
const contentLength = request.getHeader('Content-Length');
// 'contentLength' ist vom Typ Zahl
const cookie = request.getHeader('Cookie');
// 'cookie' ist vom Typ string[]
```
### `request.getHeaderNames()` {#requestgetheadernames}

**Hinzugefügt in: v7.7.0**

- Gibt zurück: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt ein Array zurück, das die eindeutigen Namen der aktuellen ausgehenden Header enthält. Alle Headernamen sind kleingeschrieben.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getHeaderNames();
// headerNames === ['foo', 'cookie']
```
### `request.getHeaders()` {#requestgetheaders}

**Hinzugefügt in: v7.7.0**

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt eine flache Kopie der aktuellen ausgehenden Header zurück. Da eine flache Kopie verwendet wird, können Array-Werte ohne zusätzliche Aufrufe verschiedener headerbezogener http-Modulmethoden verändert werden. Die Schlüssel des zurückgegebenen Objekts sind die Headernamen und die Werte sind die jeweiligen Headerwerte. Alle Headernamen sind kleingeschrieben.

Das von der Methode `request.getHeaders()` zurückgegebene Objekt erbt *nicht* prototypisch von dem JavaScript `Object`. Das bedeutet, dass typische `Object`-Methoden wie `obj.toString()`, `obj.hasOwnProperty()` und andere nicht definiert sind und *nicht funktionieren*.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headers = request.getHeaders();
// headers === { foo: 'bar', 'cookie': ['foo=bar', 'bar=baz'] }
```

### `request.getRawHeaderNames()` {#requestgetrawheadernames}

**Hinzugefügt in: v15.13.0, v14.17.0**

- Gibt zurück: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt ein Array mit den eindeutigen Namen der aktuellen ausgehenden Raw-Header zurück. Header-Namen werden mit ihrer exakten Groß- und Kleinschreibung zurückgegeben.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getRawHeaderNames();
// headerNames === ['Foo', 'Set-Cookie']
```
### `request.hasHeader(name)` {#requesthasheadername}

**Hinzugefügt in: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Header, der durch `name` identifiziert wird, derzeit in den ausgehenden Headern gesetzt ist. Beim Abgleich des Header-Namens wird die Groß- und Kleinschreibung nicht beachtet.

```js [ESM]
const hasContentType = request.hasHeader('content-type');
```
### `request.maxHeadersCount` {#requestmaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `2000`

Begrenzt die maximale Anzahl von Antwort-Headern. Wenn auf 0 gesetzt, wird keine Begrenzung angewendet.

### `request.path` {#requestpath}

**Hinzugefügt in: v0.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Anfragepfad.

### `request.method` {#requestmethod}

**Hinzugefügt in: v0.1.97**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Anfragemethode.

### `request.host` {#requesthost}

**Hinzugefügt in: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Anfragehost.

### `request.protocol` {#requestprotocol}

**Hinzugefügt in: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Das Anfrageprotokoll.

### `request.removeHeader(name)` {#requestremoveheadername}

**Hinzugefügt in: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Entfernt einen Header, der bereits im Header-Objekt definiert ist.

```js [ESM]
request.removeHeader('Content-Type');
```

### `request.reusedSocket` {#requestreusedsocket}

**Hinzugefügt in: v13.0.0, v12.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob die Anfrage über einen wiederverwendeten Socket gesendet wird.

Wenn eine Anfrage über einen Agenten mit aktivierter Keep-Alive-Funktion gesendet wird, kann der zugrunde liegende Socket wiederverwendet werden. Wenn der Server die Verbindung jedoch zu einem ungünstigen Zeitpunkt schließt, kann beim Client ein "ECONNRESET"-Fehler auftreten.

::: code-group
```js [ESM]
import http from 'node:http';

// Der Server hat standardmäßig ein 5-Sekunden-Keep-Alive-Timeout
http
  .createServer((req, res) => {
    res.write('hallo\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Einen Keep-Alive-Agenten anpassen
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // Nichts tun
    });
  });
}, 5000); // Anfrage in einem Intervall von 5 Sekunden senden, damit das Idle-Timeout leicht erreicht wird
```

```js [CJS]
const http = require('node:http');

// Der Server hat standardmäßig ein 5-Sekunden-Keep-Alive-Timeout
http
  .createServer((req, res) => {
    res.write('hallo\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Einen Keep-Alive-Agenten anpassen
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // Nichts tun
    });
  });
}, 5000); // Anfrage in einem Intervall von 5 Sekunden senden, damit das Idle-Timeout leicht erreicht wird
```
:::

Indem wir eine Anfrage markieren, ob sie einen Socket wiederverwendet hat oder nicht, können wir eine automatische Fehlerwiederholung darauf basieren.

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
      // Prüfen, ob ein erneuter Versuch erforderlich ist
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
      // Prüfen, ob ein erneuter Versuch erforderlich ist
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```
:::


### `request.setHeader(name, value)` {#requestsetheadername-value}

**Hinzugefügt in: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Setzt einen einzelnen Header-Wert für das Header-Objekt. Wenn dieser Header bereits in den zu sendenden Headern vorhanden ist, wird sein Wert ersetzt. Verwenden Sie hier ein Array von Strings, um mehrere Header mit demselben Namen zu senden. Nicht-String-Werte werden unverändert gespeichert. Daher kann [`request.getHeader()`](/de/nodejs/api/http#requestgetheadername) Nicht-String-Werte zurückgeben. Die Nicht-String-Werte werden jedoch für die Netzwerkübertragung in Strings konvertiert.

```js [ESM]
request.setHeader('Content-Type', 'application/json');
```
oder

```js [ESM]
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
```
Wenn der Wert ein String ist, wird eine Ausnahme ausgelöst, wenn er Zeichen außerhalb der `latin1`-Kodierung enthält.

Wenn Sie UTF-8-Zeichen im Wert übergeben müssen, kodieren Sie den Wert bitte gemäß dem Standard [RFC 8187](https://www.rfc-editor.org/rfc/rfc8187.txt).

```js [ESM]
const filename = 'Rock 🎵.txt';
request.setHeader('Content-Disposition', `attachment; filename*=utf-8''${encodeURIComponent(filename)}`);
```
### `request.setNoDelay([noDelay])` {#requestsetnodelaynodelay}

**Hinzugefügt in: v0.5.9**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sobald diesem Request ein Socket zugewiesen und verbunden ist, wird [`socket.setNoDelay()`](/de/nodejs/api/net#socketsetnodelaynodelay) aufgerufen.

### `request.setSocketKeepAlive([enable][, initialDelay])` {#requestsetsocketkeepaliveenable-initialdelay}

**Hinzugefügt in: v0.5.9**

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Sobald diesem Request ein Socket zugewiesen und verbunden ist, wird [`socket.setKeepAlive()`](/de/nodejs/api/net#socketsetkeepaliveenable-initialdelay) aufgerufen.


### `request.setTimeout(timeout[, callback])` {#requestsettimeouttimeout-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.0.0 | Setzt das Socket-Timeout konsistent nur dann, wenn sich das Socket verbindet. |
| v0.5.9 | Hinzugefügt in: v0.5.9 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Millisekunden, bevor eine Anfrage eine Zeitüberschreitung verursacht.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Optionale Funktion, die aufgerufen wird, wenn eine Zeitüberschreitung auftritt. Ist das Gleiche wie die Bindung an das `'timeout'`-Ereignis.
- Gibt zurück: [\<http.ClientRequest\>](/de/nodejs/api/http#class-httpclientrequest)

Sobald dieser Anfrage ein Socket zugewiesen und verbunden ist, wird [`socket.setTimeout()`](/de/nodejs/api/net#socketsettimeouttimeout-callback) aufgerufen.

### `request.socket` {#requestsocket}

**Hinzugefügt in: v0.3.0**

- [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Referenz zum zugrunde liegenden Socket. Normalerweise möchten Benutzer nicht auf diese Eigenschaft zugreifen. Insbesondere gibt das Socket keine `'readable'`-Ereignisse aus, da der Protokollparser am Socket angehängt ist.

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

Diese Eigenschaft ist garantiert eine Instanz der [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)-Klasse, einer Unterklasse von [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex), es sei denn, der Benutzer hat einen anderen Socket-Typ als [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) angegeben.


### `request.uncork()` {#requestuncork}

**Hinzugefügt in: v13.2.0, v12.16.0**

Siehe [`writable.uncork()`](/de/nodejs/api/stream#writableuncork).

### `request.writableEnded` {#requestwritableended}

**Hinzugefügt in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, nachdem [`request.end()`](/de/nodejs/api/http#requestenddata-encoding-callback) aufgerufen wurde. Diese Eigenschaft gibt nicht an, ob die Daten geleert wurden. Verwenden Sie stattdessen [`request.writableFinished`](/de/nodejs/api/http#requestwritablefinished).

### `request.writableFinished` {#requestwritablefinished}

**Hinzugefügt in: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, wenn alle Daten in das zugrunde liegende System geleert wurden, unmittelbar bevor das Ereignis [`'finish'`](/de/nodejs/api/http#event-finish) ausgegeben wird.

### `request.write(chunk[, encoding][, callback])` {#requestwritechunk-encoding-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Der Parameter `chunk` kann jetzt ein `Uint8Array` sein. |
| v0.1.29 | Hinzugefügt in: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sendet einen Teil des Körpers. Diese Methode kann mehrfach aufgerufen werden. Wenn keine `Content-Length` festgelegt ist, werden die Daten automatisch in der HTTP Chunked Transfer Encoding codiert, sodass der Server weiß, wann die Daten enden. Der Header `Transfer-Encoding: chunked` wird hinzugefügt. Der Aufruf von [`request.end()`](/de/nodejs/api/http#requestenddata-encoding-callback) ist erforderlich, um das Senden der Anfrage abzuschließen.

Das Argument `encoding` ist optional und gilt nur, wenn `chunk` eine Zeichenkette ist. Standardmäßig ist es `'utf8'`.

Das Argument `callback` ist optional und wird aufgerufen, wenn dieser Datenblock geleert wird, jedoch nur, wenn der Block nicht leer ist.

Gibt `true` zurück, wenn die gesamten Daten erfolgreich in den Kernel-Puffer geleert wurden. Gibt `false` zurück, wenn alle oder ein Teil der Daten im Benutzerspeicher zwischengespeichert wurden. `'drain'` wird ausgegeben, wenn der Puffer wieder frei ist.

Wenn die Funktion `write` mit einer leeren Zeichenkette oder einem leeren Puffer aufgerufen wird, tut sie nichts und wartet auf weitere Eingaben.


## Klasse: `http.Server` {#class-httpserver}

**Hinzugefügt in: v0.1.17**

- Erweitert: [\<net.Server\>](/de/nodejs/api/net#class-netserver)

### Ereignis: `'checkContinue'` {#event-checkcontinue}

**Hinzugefügt in: v0.3.0**

- `request` [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/de/nodejs/api/http#class-httpserverresponse)

Wird jedes Mal ausgelöst, wenn eine Anfrage mit einem HTTP `Expect: 100-continue` empfangen wird. Wenn dieses Ereignis nicht abgehört wird, antwortet der Server automatisch mit einem `100 Continue`, falls erforderlich.

Die Behandlung dieses Ereignisses beinhaltet den Aufruf von [`response.writeContinue()`](/de/nodejs/api/http#responsewritecontinue), wenn der Client den Anfrage-Body weiterhin senden soll, oder die Generierung einer entsprechenden HTTP-Antwort (z. B. 400 Bad Request), wenn der Client den Anfrage-Body nicht weiterhin senden soll.

Wenn dieses Ereignis ausgelöst und behandelt wird, wird das Ereignis [`'request'`](/de/nodejs/api/http#event-request) nicht ausgelöst.

### Ereignis: `'checkExpectation'` {#event-checkexpectation}

**Hinzugefügt in: v5.5.0**

- `request` [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/de/nodejs/api/http#class-httpserverresponse)

Wird jedes Mal ausgelöst, wenn eine Anfrage mit einem HTTP `Expect`-Header empfangen wird, wobei der Wert nicht `100-continue` ist. Wenn dieses Ereignis nicht abgehört wird, antwortet der Server automatisch mit einem `417 Expectation Failed`, falls erforderlich.

Wenn dieses Ereignis ausgelöst und behandelt wird, wird das Ereignis [`'request'`](/de/nodejs/api/http#event-request) nicht ausgelöst.

### Ereignis: `'clientError'` {#event-clienterror}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | Das Standardverhalten gibt einen 431 Request Header Fields Too Large zurück, wenn ein HPE_HEADER_OVERFLOW-Fehler auftritt. |
| v9.4.0 | Das `rawPacket` ist der aktuelle Puffer, der gerade geparst wurde. Das Hinzufügen dieses Puffers zum Fehlerobjekt des Ereignisses `'clientError'` ermöglicht es Entwicklern, das fehlerhafte Paket zu protokollieren. |
| v6.0.0 | Die Standardaktion des Aufrufs von `.destroy()` auf dem `socket` findet nicht mehr statt, wenn Listener für `'clientError'` angehängt sind. |
| v0.1.94 | Hinzugefügt in: v0.1.94 |
:::

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Wenn eine Clientverbindung ein `'error'`-Ereignis auslöst, wird dieses hierhin weitergeleitet. Der Listener dieses Ereignisses ist für das Schließen/Zerstören des zugrunde liegenden Sockets verantwortlich. Beispielsweise kann es wünschenswert sein, den Socket eleganter mit einer benutzerdefinierten HTTP-Antwort zu schließen, anstatt die Verbindung abrupt zu trennen. Der Socket **muss geschlossen oder zerstört werden**, bevor der Listener endet.

Es wird garantiert, dass diesem Ereignis eine Instanz der Klasse [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) übergeben wird, eine Unterklasse von [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex), es sei denn, der Benutzer gibt einen anderen Socket-Typ als [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) an.

Das Standardverhalten besteht darin, zu versuchen, den Socket mit einem HTTP '400 Bad Request' oder einem HTTP '431 Request Header Fields Too Large' im Falle eines [`HPE_HEADER_OVERFLOW`](/de/nodejs/api/errors#hpe_header_overflow)-Fehlers zu schließen. Wenn der Socket nicht beschreibbar ist oder Header der aktuellen angehängten [`http.ServerResponse`](/de/nodejs/api/http#class-httpserverresponse) gesendet wurden, wird er sofort zerstört.

`socket` ist das [`net.Socket`](/de/nodejs/api/net#class-netsocket)-Objekt, von dem der Fehler stammt.

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

Wenn das Ereignis `'clientError'` auftritt, gibt es kein `request`- oder `response`-Objekt, daher *muss* jede gesendete HTTP-Antwort, einschließlich Antwort-Header und Payload, direkt in das `socket`-Objekt geschrieben werden. Es muss darauf geachtet werden, dass die Antwort eine korrekt formatierte HTTP-Antwortnachricht ist.

`err` ist eine Instanz von `Error` mit zwei zusätzlichen Spalten:

- `bytesParsed`: die Byte-Anzahl des Anfragepakets, die Node.js möglicherweise korrekt geparst hat;
- `rawPacket`: das Rohpaket der aktuellen Anfrage.

In einigen Fällen hat der Client die Antwort bereits erhalten und/oder der Socket wurde bereits zerstört, wie im Falle von `ECONNRESET`-Fehlern. Bevor versucht wird, Daten an den Socket zu senden, ist es besser zu prüfen, ob er noch beschreibbar ist.

```js [ESM]
server.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
```

### Ereignis: `'close'` {#event-close_1}

**Hinzugefügt in: v0.1.4**

Wird ausgelöst, wenn der Server schließt.

### Ereignis: `'connect'` {#event-connect_1}

**Hinzugefügt in: v0.7.0**

- `request` [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage) Argumente für die HTTP-Anfrage, wie im [`'request'`]-Ereignis (/de/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex) Netzwerk-Socket zwischen Server und Client
- `head` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Das erste Paket des Tunneling-Streams (kann leer sein)

Wird jedes Mal ausgelöst, wenn ein Client eine HTTP-`CONNECT`-Methode anfordert. Wenn dieses Ereignis nicht abgehört wird, werden die Verbindungen von Clients, die eine `CONNECT`-Methode anfordern, geschlossen.

Es wird garantiert, dass diesem Ereignis eine Instanz der [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)-Klasse übergeben wird, einer Unterklasse von [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex), es sei denn, der Benutzer gibt einen anderen Socket-Typ als [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) an.

Nachdem dieses Ereignis ausgelöst wurde, hat der Socket der Anfrage keinen `'data'`-Ereignis-Listener, was bedeutet, dass er gebunden werden muss, um Daten zu verarbeiten, die an den Server auf diesem Socket gesendet werden.

### Ereignis: `'connection'` {#event-connection}

**Hinzugefügt in: v0.1.0**

- `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Dieses Ereignis wird ausgelöst, wenn ein neuer TCP-Stream hergestellt wird. `socket` ist typischerweise ein Objekt vom Typ [`net.Socket`](/de/nodejs/api/net#class-netsocket). Normalerweise möchten Benutzer nicht auf dieses Ereignis zugreifen. Insbesondere löst der Socket keine `'readable'`-Ereignisse aus, da der Protokoll-Parser an den Socket angehängt wird. Auf den `socket` kann auch über `request.socket` zugegriffen werden.

Dieses Ereignis kann auch explizit von Benutzern ausgelöst werden, um Verbindungen in den HTTP-Server einzuspeisen. In diesem Fall kann jeder [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Stream übergeben werden.

Wenn hier `socket.setTimeout()` aufgerufen wird, wird das Timeout durch `server.keepAliveTimeout` ersetzt, sobald der Socket eine Anfrage bearbeitet hat (wenn `server.keepAliveTimeout` ungleich Null ist).

Es wird garantiert, dass diesem Ereignis eine Instanz der [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)-Klasse übergeben wird, einer Unterklasse von [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex), es sei denn, der Benutzer gibt einen anderen Socket-Typ als [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) an.


### Ereignis: `'dropRequest'` {#event-droprequest}

**Hinzugefügt in: v18.7.0, v16.17.0**

- `request` [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage) Argumente für die HTTP-Anfrage, wie sie im Ereignis [`'request'`](/de/nodejs/api/http#event-request) enthalten sind.
- `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex) Netzwerk-Socket zwischen dem Server und dem Client

Wenn die Anzahl der Anfragen auf einem Socket den Schwellenwert von `server.maxRequestsPerSocket` erreicht, verwirft der Server neue Anfragen und löst stattdessen das `'dropRequest'`-Ereignis aus und sendet dann `503` an den Client.

### Ereignis: `'request'` {#event-request}

**Hinzugefügt in: v0.1.0**

- `request` [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/de/nodejs/api/http#class-httpserverresponse)

Wird jedes Mal ausgelöst, wenn eine Anfrage eingeht. Es kann mehrere Anfragen pro Verbindung geben (im Fall von HTTP Keep-Alive-Verbindungen).

### Ereignis: `'upgrade'` {#event-upgrade_1}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Das Nicht-Abhören dieses Ereignisses führt nicht mehr dazu, dass der Socket zerstört wird, wenn ein Client einen Upgrade-Header sendet. |
| v0.1.94 | Hinzugefügt in: v0.1.94 |
:::

- `request` [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage) Argumente für die HTTP-Anfrage, wie sie im Ereignis [`'request'`](/de/nodejs/api/http#event-request) enthalten sind.
- `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex) Netzwerk-Socket zwischen dem Server und dem Client
- `head` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Das erste Paket des aktualisierten Streams (kann leer sein)

Wird jedes Mal ausgelöst, wenn ein Client ein HTTP-Upgrade anfordert. Das Abhören dieses Ereignisses ist optional, und Clients können nicht auf einer Protokolländerung bestehen.

Nachdem dieses Ereignis ausgelöst wurde, hat der Socket der Anfrage keinen `'data'`-Ereignis-Listener, was bedeutet, dass er gebunden werden muss, um Daten zu verarbeiten, die an den Server über diesen Socket gesendet werden.

Es ist garantiert, dass diesem Ereignis eine Instanz der Klasse [\<net.Socket\>](/de/nodejs/api/net#class-netsocket), einer Unterklasse von [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex), übergeben wird, es sei denn, der Benutzer gibt einen anderen Socket-Typ als [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) an.


### `server.close([callback])` {#serverclosecallback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Die Methode schließt inaktive Verbindungen vor der Rückgabe. |
| v0.1.90 | Hinzugefügt in: v0.1.90 |
:::

- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Verhindert, dass der Server neue Verbindungen akzeptiert und schließt alle Verbindungen, die mit diesem Server verbunden sind und keine Anfrage senden oder auf eine Antwort warten. Siehe [`net.Server.close()`](/de/nodejs/api/net#serverclosecallback).

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Schließe den Server nach 10 Sekunden
setTimeout(() => {
  server.close(() => {
    console.log('Server auf Port 8000 erfolgreich geschlossen');
  });
}, 10000);
```
### `server.closeAllConnections()` {#servercloseallconnections}

**Hinzugefügt in: v18.2.0**

Schließt alle aufgebauten HTTP(S)-Verbindungen, die mit diesem Server verbunden sind, einschließlich aktiver Verbindungen, die mit diesem Server verbunden sind und eine Anfrage senden oder auf eine Antwort warten. Dies zerstört *keine* Sockets, die auf ein anderes Protokoll aktualisiert wurden, z. B. WebSocket oder HTTP/2.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Schließe den Server nach 10 Sekunden
setTimeout(() => {
  server.close(() => {
    console.log('Server auf Port 8000 erfolgreich geschlossen');
  });
  // Schließt alle Verbindungen und stellt sicher, dass der Server erfolgreich geschlossen wird
  server.closeAllConnections();
}, 10000);
```
### `server.closeIdleConnections()` {#servercloseidleconnections}

**Hinzugefügt in: v18.2.0**

Schließt alle Verbindungen, die mit diesem Server verbunden sind und keine Anfrage senden oder auf eine Antwort warten.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Schließe den Server nach 10 Sekunden
setTimeout(() => {
  server.close(() => {
    console.log('Server auf Port 8000 erfolgreich geschlossen');
  });
  // Schließt inaktive Verbindungen, wie z. B. Keep-Alive-Verbindungen. Der Server wird geschlossen,
  // sobald die verbleibenden aktiven Verbindungen beendet sind
  server.closeIdleConnections();
}, 10000);
```

### `server.headersTimeout` {#serverheaderstimeout}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.4.0, v18.14.0 | Der Standardwert ist jetzt auf das Minimum zwischen 60000 (60 Sekunden) oder `requestTimeout` gesetzt. |
| v11.3.0, v10.14.0 | Hinzugefügt in: v11.3.0, v10.14.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** Das Minimum zwischen [`server.requestTimeout`](/de/nodejs/api/http#serverrequesttimeout) oder `60000`.

Begrenzt die Zeit, die der Parser wartet, um die vollständigen HTTP-Header zu empfangen.

Wenn das Zeitlimit abläuft, antwortet der Server mit dem Status 408, ohne die Anfrage an den Anfrage-Listener weiterzuleiten, und schließt dann die Verbindung.

Es muss auf einen Wert ungleich Null (z. B. 120 Sekunden) gesetzt werden, um vor potenziellen Denial-of-Service-Angriffen zu schützen, falls der Server ohne Reverse-Proxy davor bereitgestellt wird.

### `server.listen()` {#serverlisten}

Startet den HTTP-Server, um auf Verbindungen zu hören. Diese Methode ist identisch mit [`server.listen()`](/de/nodejs/api/net#serverlisten) von [`net.Server`](/de/nodejs/api/net#class-netserver).

### `server.listening` {#serverlistening}

**Hinzugefügt in: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob der Server auf Verbindungen wartet oder nicht.

### `server.maxHeadersCount` {#servermaxheaderscount}

**Hinzugefügt in: v0.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `2000`

Begrenzt die maximale Anzahl eingehender Header. Wenn auf 0 gesetzt, wird keine Begrenzung angewendet.

### `server.requestTimeout` {#serverrequesttimeout}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Standard-Request-Timeout wurde von keinem Timeout auf 300 Sekunden (5 Minuten) geändert. |
| v14.11.0 | Hinzugefügt in: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `300000`

Legt den Timeout-Wert in Millisekunden für den Empfang der gesamten Anfrage vom Client fest.

Wenn das Zeitlimit abläuft, antwortet der Server mit dem Status 408, ohne die Anfrage an den Anfrage-Listener weiterzuleiten, und schließt dann die Verbindung.

Es muss auf einen Wert ungleich Null (z. B. 120 Sekunden) gesetzt werden, um vor potenziellen Denial-of-Service-Angriffen zu schützen, falls der Server ohne Reverse-Proxy davor bereitgestellt wird.


### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.0.0 | Das Standard-Timeout wurde von 120s auf 0 (kein Timeout) geändert. |
| v0.9.12 | Hinzugefügt in: v0.9.12 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** 0 (kein Timeout)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<http.Server\>](/de/nodejs/api/http#class-httpserver)

Setzt den Timeout-Wert für Sockets und emittiert ein `'timeout'`-Ereignis auf dem Server-Objekt, wobei der Socket als Argument übergeben wird, falls ein Timeout auftritt.

Wenn es einen `'timeout'`-Ereignis-Listener auf dem Server-Objekt gibt, wird dieser mit dem Socket, bei dem ein Timeout aufgetreten ist, als Argument aufgerufen.

Standardmäßig verwendet der Server keine Timeout-Sockets. Wenn jedoch ein Callback dem `'timeout'`-Ereignis des Servers zugewiesen wird, müssen Timeouts explizit behandelt werden.

### `server.maxRequestsPerSocket` {#servermaxrequestspersocket}

**Hinzugefügt in: v16.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anfragen pro Socket. **Standard:** 0 (keine Begrenzung)

Die maximale Anzahl von Anfragen, die ein Socket verarbeiten kann, bevor die Keep-Alive-Verbindung geschlossen wird.

Ein Wert von `0` deaktiviert die Begrenzung.

Wenn das Limit erreicht ist, wird der Wert des `Connection`-Headers auf `close` gesetzt, aber die Verbindung wird nicht tatsächlich geschlossen. Nachfolgende Anfragen, die nach Erreichen des Limits gesendet werden, erhalten `503 Service Unavailable` als Antwort.

### `server.timeout` {#servertimeout}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.0.0 | Das Standard-Timeout wurde von 120s auf 0 (kein Timeout) geändert. |
| v0.9.12 | Hinzugefügt in: v0.9.12 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Timeout in Millisekunden. **Standard:** 0 (kein Timeout)

Die Anzahl der Millisekunden der Inaktivität, nach denen angenommen wird, dass bei einem Socket ein Timeout aufgetreten ist.

Ein Wert von `0` deaktiviert das Timeout-Verhalten bei eingehenden Verbindungen.

Die Socket-Timeout-Logik wird beim Verbindungsaufbau eingerichtet, sodass das Ändern dieses Werts nur neue Verbindungen zum Server betrifft, nicht aber bestehende Verbindungen.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**Hinzugefügt in: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Timeout in Millisekunden. **Standard:** `5000` (5 Sekunden).

Die Anzahl der Millisekunden der Inaktivität, die ein Server warten muss, um zusätzliche eingehende Daten zu empfangen, nachdem er das Schreiben der letzten Antwort beendet hat, bevor ein Socket zerstört wird. Wenn der Server neue Daten empfängt, bevor das Keep-Alive-Timeout ausgelöst wurde, setzt er das reguläre Inaktivitäts-Timeout zurück, d.h. [`server.timeout`](/de/nodejs/api/http#servertimeout).

Ein Wert von `0` deaktiviert das Keep-Alive-Timeout-Verhalten bei eingehenden Verbindungen. Ein Wert von `0` bewirkt, dass sich der HTTP-Server ähnlich wie in Node.js-Versionen vor 8.0.0 verhält, die kein Keep-Alive-Timeout hatten.

Die Socket-Timeout-Logik wird bei der Verbindung eingerichtet, so dass eine Änderung dieses Wertes nur neue Verbindungen zum Server betrifft, nicht aber bestehende Verbindungen.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Hinzugefügt in: v20.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Ruft [`server.close()`](/de/nodejs/api/http#serverclosecallback) auf und gibt eine Promise zurück, die erfüllt wird, wenn der Server geschlossen wurde.

## Klasse: `http.ServerResponse` {#class-httpserverresponse}

**Hinzugefügt in: v0.1.17**

- Erweitert: [\<http.OutgoingMessage\>](/de/nodejs/api/http#class-httpoutgoingmessage)

Dieses Objekt wird intern von einem HTTP-Server erstellt, nicht vom Benutzer. Es wird als zweiter Parameter an das [`'request'` ](/de/nodejs/api/http#event-request)-Ereignis übergeben.

### Ereignis: `'close'` {#event-close_2}

**Hinzugefügt in: v0.6.7**

Gibt an, dass die Antwort abgeschlossen ist oder die zugrunde liegende Verbindung vorzeitig (vor Abschluss der Antwort) beendet wurde.

### Ereignis: `'finish'` {#event-finish_1}

**Hinzugefügt in: v0.3.6**

Wird ausgelöst, wenn die Antwort gesendet wurde. Genauer gesagt wird dieses Ereignis ausgelöst, wenn das letzte Segment der Antwortheader und des -körpers an das Betriebssystem zur Übertragung über das Netzwerk übergeben wurde. Dies bedeutet nicht, dass der Client bereits etwas empfangen hat.


### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**Hinzugefügt in: v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Diese Methode fügt der Antwort HTTP-Trailing-Header hinzu (ein Header, aber am Ende der Nachricht).

Trailer werden **nur** ausgegeben, wenn Chunked Encoding für die Antwort verwendet wird; wenn dies nicht der Fall ist (z. B. wenn die Anfrage HTTP/1.0 war), werden sie stillschweigend verworfen.

HTTP erfordert, dass der `Trailer`-Header gesendet wird, um Trailer auszugeben, mit einer Liste der Header-Felder in seinem Wert. Z.B.,

```js [ESM]
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
```
Der Versuch, einen Header-Feldnamen oder -wert festzulegen, der ungültige Zeichen enthält, führt zum Auslösen eines [`TypeError`](/de/nodejs/api/errors#class-typeerror).

### `response.connection` {#responseconnection}

**Hinzugefügt in: v0.3.0**

**Veraltet seit: v13.0.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Verwenden Sie [`response.socket`](/de/nodejs/api/http#responsesocket).
:::

- [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Siehe [`response.socket`](/de/nodejs/api/http#responsesocket).

### `response.cork()` {#responsecork}

**Hinzugefügt in: v13.2.0, v12.16.0**

Siehe [`writable.cork()`](/de/nodejs/api/stream#writablecork).

### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Der Parameter `data` kann jetzt ein `Uint8Array` sein. |
| v10.0.0 | Diese Methode gibt jetzt einen Verweis auf `ServerResponse` zurück. |
| v0.1.90 | Hinzugefügt in: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Diese Methode signalisiert dem Server, dass alle Antwort-Header und der Body gesendet wurden; dass der Server diese Nachricht als vollständig betrachten sollte. Die Methode `response.end()` MUSS für jede Antwort aufgerufen werden.

Wenn `data` angegeben ist, hat dies eine ähnliche Wirkung wie der Aufruf von [`response.write(data, encoding)`](/de/nodejs/api/http#responsewritechunk-encoding-callback), gefolgt von `response.end(callback)`.

Wenn `callback` angegeben ist, wird er aufgerufen, wenn der Antwort-Stream beendet ist.


### `response.finished` {#responsefinished}

**Hinzugefügt in: v0.0.2**

**Veraltet seit: v13.4.0, v12.16.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Verwenden Sie [`response.writableEnded`](/de/nodejs/api/http#responsewritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Eigenschaft `response.finished` ist `true`, wenn [`response.end()`](/de/nodejs/api/http#responseenddata-encoding-callback) aufgerufen wurde.

### `response.flushHeaders()` {#responseflushheaders}

**Hinzugefügt in: v1.6.0**

Leert die Antwort-Header. Siehe auch: [`request.flushHeaders()`](/de/nodejs/api/http#requestflushheaders).

### `response.getHeader(name)` {#responsegetheadername}

**Hinzugefügt in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Liest einen Header aus, der bereits in die Warteschlange gestellt, aber noch nicht an den Client gesendet wurde. Der Name ist nicht case-sensitiv. Der Typ des Rückgabewerts hängt von den Argumenten ab, die an [`response.setHeader()`](/de/nodejs/api/http#responsesetheadername-value) übergeben werden.

```js [ESM]
response.setHeader('Content-Type', 'text/html');
response.setHeader('Content-Length', Buffer.byteLength(body));
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
const contentType = response.getHeader('content-type');
// contentType ist 'text/html'
const contentLength = response.getHeader('Content-Length');
// contentLength hat den Typ number
const setCookie = response.getHeader('set-cookie');
// setCookie hat den Typ string[]
```
### `response.getHeaderNames()` {#responsegetheadernames}

**Hinzugefügt in: v7.7.0**

- Gibt zurück: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt ein Array zurück, das die eindeutigen Namen der aktuellen ausgehenden Header enthält. Alle Header-Namen sind kleingeschrieben.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```

### `response.getHeaders()` {#responsegetheaders}

**Hinzugefügt in: v7.7.0**

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt eine flache Kopie der aktuellen ausgehenden Header zurück. Da eine flache Kopie verwendet wird, können Array-Werte ohne zusätzliche Aufrufe verschiedener Header-bezogener HTTP-Modulmethoden verändert werden. Die Schlüssel des zurückgegebenen Objekts sind die Headernamen und die Werte sind die jeweiligen Headerwerte. Alle Headernamen sind kleingeschrieben.

Das von der `response.getHeaders()`-Methode zurückgegebene Objekt erbt *nicht* prototypisch von dem JavaScript-`Object`. Dies bedeutet, dass typische `Object`-Methoden wie `obj.toString()`, `obj.hasOwnProperty()` und andere nicht definiert sind und *nicht funktionieren*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `response.hasHeader(name)` {#responsehasheadername}

**Hinzugefügt in: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der durch `name` identifizierte Header derzeit in den ausgehenden Headern gesetzt ist. Beim Header-Namen-Matching wird die Groß-/Kleinschreibung nicht beachtet.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
### `response.headersSent` {#responseheaderssent}

**Hinzugefügt in: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Boolean (schreibgeschützt). True, wenn Header gesendet wurden, andernfalls false.

### `response.removeHeader(name)` {#responseremoveheadername}

**Hinzugefügt in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Entfernt einen Header, der für implizites Senden in die Warteschlange gestellt wurde.

```js [ESM]
response.removeHeader('Content-Encoding');
```
### `response.req` {#responsereq}

**Hinzugefügt in: v15.7.0**

- [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage)

Eine Referenz auf das ursprüngliche HTTP-`request`-Objekt.


### `response.sendDate` {#responsesenddate}

**Hinzugefügt in: v0.7.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn true, wird der Date-Header automatisch generiert und in der Antwort gesendet, falls er nicht bereits in den Headern vorhanden ist. Standardmäßig true.

Dies sollte nur zu Testzwecken deaktiviert werden; HTTP erfordert den Date-Header in Antworten.

### `response.setHeader(name, value)` {#responsesetheadername-value}

**Hinzugefügt in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<http.ServerResponse\>](/de/nodejs/api/http#class-httpserverresponse)

Gibt das Antwortobjekt zurück.

Setzt einen einzelnen Headerwert für implizite Header. Wenn dieser Header bereits in den zu sendenden Headern existiert, wird sein Wert ersetzt. Verwenden Sie hier ein Array von Strings, um mehrere Header mit demselben Namen zu senden. Nicht-String-Werte werden ohne Änderung gespeichert. Daher kann [`response.getHeader()`](/de/nodejs/api/http#responsegetheadername) Nicht-String-Werte zurückgeben. Die Nicht-String-Werte werden jedoch zur Netzwerkübertragung in Strings konvertiert. Das gleiche Antwortobjekt wird an den Aufrufer zurückgegeben, um Call Chaining zu ermöglichen.

```js [ESM]
response.setHeader('Content-Type', 'text/html');
```
oder

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
Der Versuch, einen Header-Feldnamen oder -wert zu setzen, der ungültige Zeichen enthält, führt zu einem [`TypeError`](/de/nodejs/api/errors#class-typeerror).

Wenn Header mit [`response.setHeader()`](/de/nodejs/api/http#responsesetheadername-value) gesetzt wurden, werden sie mit allen Headern zusammengeführt, die an [`response.writeHead()`](/de/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) übergeben wurden, wobei die an [`response.writeHead()`](/de/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) übergebenen Header Vorrang haben.

```js [ESM]
// Gibt content-type = text/plain zurück
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
Wenn die Methode [`response.writeHead()`](/de/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) aufgerufen wird und diese Methode noch nicht aufgerufen wurde, werden die angegebenen Headerwerte direkt auf den Netzwerkkanal geschrieben, ohne intern zwischengespeichert zu werden, und [`response.getHeader()`](/de/nodejs/api/http#responsegetheadername) für den Header liefert nicht das erwartete Ergebnis. Wenn eine progressive Bestückung von Headern mit potenziell zukünftigem Abruf und Änderung gewünscht ist, verwenden Sie [`response.setHeader()`](/de/nodejs/api/http#responsesetheadername-value) anstelle von [`response.writeHead()`](/de/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers).


### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**Hinzugefügt in: v0.9.12**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Rückgabe: [\<http.ServerResponse\>](/de/nodejs/api/http#class-httpserverresponse)

Setzt den Timeout-Wert des Sockets auf `msecs`. Wenn ein Callback bereitgestellt wird, wird dieser als Listener für das `'timeout'`-Ereignis des Antwortobjekts hinzugefügt.

Wenn dem Request, der Response oder dem Server kein `'timeout'`-Listener hinzugefügt wird, werden Sockets zerstört, wenn ein Timeout auftritt. Wenn ein Handler den `'timeout'`-Ereignissen des Requests, der Response oder des Servers zugewiesen wird, müssen Timed-Out-Sockets explizit behandelt werden.

### `response.socket` {#responsesocket}

**Hinzugefügt in: v0.3.0**

- [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Referenz zum zugrunde liegenden Socket. Normalerweise möchten Benutzer nicht auf diese Eigenschaft zugreifen. Insbesondere sendet der Socket keine `'readable'`-Ereignisse aus, da der Protokollparser an den Socket angehängt wird. Nach `response.end()` wird die Eigenschaft auf Null gesetzt.

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

Diese Eigenschaft ist garantiert eine Instanz der Klasse [\<net.Socket\>](/de/nodejs/api/net#class-netsocket), einer Unterklasse von [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex), es sei denn, der Benutzer hat einen anderen Socket-Typ als [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) angegeben.

### `response.statusCode` {#responsestatuscode}

**Hinzugefügt in: v0.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `200`

Bei Verwendung von impliziten Headern (kein expliziter Aufruf von [`response.writeHead()`](/de/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)) steuert diese Eigenschaft den Statuscode, der an den Client gesendet wird, wenn die Header geleert werden.

```js [ESM]
response.statusCode = 404;
```
Nachdem der Antwort-Header an den Client gesendet wurde, zeigt diese Eigenschaft den gesendeten Statuscode an.


### `response.statusMessage` {#responsestatusmessage}

**Hinzugefügt in: v0.11.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Bei Verwendung von impliziten Headern (ohne expliziten Aufruf von [`response.writeHead()`](/de/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)) steuert diese Eigenschaft die Statusmeldung, die an den Client gesendet wird, wenn die Header geleert werden. Wenn dies auf `undefined` belassen wird, wird die Standardmeldung für den Statuscode verwendet.

```js [ESM]
response.statusMessage = 'Nicht gefunden';
```
Nachdem der Antwort-Header an den Client gesendet wurde, gibt diese Eigenschaft die Statusmeldung an, die gesendet wurde.

### `response.strictContentLength` {#responsestrictcontentlength}

**Hinzugefügt in: v18.10.0, v16.18.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `false`

Wenn auf `true` gesetzt, prüft Node.js, ob der Wert des `Content-Length`-Headers und die Größe des Körpers in Byte übereinstimmen. Eine Abweichung des `Content-Length`-Headerwerts führt zu einem `Error`, der durch `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/de/nodejs/api/errors#err_http_content_length_mismatch) gekennzeichnet ist.

### `response.uncork()` {#responseuncork}

**Hinzugefügt in: v13.2.0, v12.16.0**

Siehe [`writable.uncork()`](/de/nodejs/api/stream#writableuncork).

### `response.writableEnded` {#responsewritableended}

**Hinzugefügt in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, nachdem [`response.end()`](/de/nodejs/api/http#responseenddata-encoding-callback) aufgerufen wurde. Diese Eigenschaft gibt nicht an, ob die Daten geleert wurden. Verwenden Sie stattdessen [`response.writableFinished`](/de/nodejs/api/http#responsewritablefinished).

### `response.writableFinished` {#responsewritablefinished}

**Hinzugefügt in: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, wenn alle Daten in das zugrunde liegende System geleert wurden, unmittelbar bevor das Ereignis [`'finish'`](/de/nodejs/api/http#event-finish) ausgelöst wird.

### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Der Parameter `chunk` kann jetzt ein `Uint8Array` sein. |
| v0.1.29 | Hinzugefügt in: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn diese Methode aufgerufen wird und [`response.writeHead()`](/de/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) nicht aufgerufen wurde, wechselt sie in den impliziten Header-Modus und leert die impliziten Header.

Dies sendet einen Teil des Antworttextes. Diese Methode kann mehrmals aufgerufen werden, um aufeinanderfolgende Teile des Textes bereitzustellen.

Wenn `rejectNonStandardBodyWrites` in `createServer` auf true gesetzt ist, ist das Schreiben in den Body nicht zulässig, wenn die Anforderungsmethode oder der Antwortstatus keinen Inhalt unterstützen. Wenn versucht wird, für eine HEAD-Anfrage oder als Teil einer `204`- oder `304`-Antwort in den Body zu schreiben, wird synchron ein `Error` mit dem Code `ERR_HTTP_BODY_NOT_ALLOWED` ausgelöst.

`chunk` kann ein String oder ein Buffer sein. Wenn `chunk` ein String ist, gibt der zweite Parameter an, wie er in einen Bytestrom codiert werden soll. `callback` wird aufgerufen, wenn dieser Datenblock geleert wird.

Dies ist der reine HTTP-Body und hat nichts mit Multi-Part-Body-Codierungen höherer Ebene zu tun, die verwendet werden können.

Beim ersten Aufruf von [`response.write()`](/de/nodejs/api/http#responsewritechunk-encoding-callback) werden die gepufferten Header-Informationen und der erste Teil des Bodys an den Client gesendet. Beim zweiten Aufruf von [`response.write()`](/de/nodejs/api/http#responsewritechunk-encoding-callback) geht Node.js davon aus, dass Daten gestreamt werden, und sendet die neuen Daten separat. Das heißt, die Antwort wird bis zum ersten Teil des Bodys gepuffert.

Gibt `true` zurück, wenn die gesamten Daten erfolgreich in den Kernel-Puffer geleert wurden. Gibt `false` zurück, wenn alle oder ein Teil der Daten im Benutzerspeicher zwischengespeichert wurden. `'drain'` wird ausgelöst, wenn der Puffer wieder frei ist.


### `response.writeContinue()` {#responsewritecontinue}

**Hinzugefügt in: v0.3.0**

Sendet eine HTTP/1.1 100 Continue-Nachricht an den Client, die angibt, dass der Anforderungskörper gesendet werden soll. Siehe das [`'checkContinue'`]-Ereignis (/de/nodejs/api/http#event-checkcontinue) auf `Server`.

### `response.writeEarlyHints(hints[, callback])` {#responsewriteearlyhintshints-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.11.0 | Erlaubt die Übergabe von Hinweisen als Objekt. |
| v18.11.0 | Hinzugefügt in: v18.11.0 |
:::

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Sendet eine HTTP/1.1 103 Early Hints-Nachricht an den Client mit einem Link-Header, der angibt, dass der User Agent die verknüpften Ressourcen vorladen/vorverbinden kann. Die `hints` sind ein Objekt, das die Werte von Headern enthält, die mit der Early Hints-Nachricht gesendet werden sollen. Das optionale `callback`-Argument wird aufgerufen, wenn die Antwortnachricht geschrieben wurde.

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
  'x-trace-id': 'id for diagnostics',
});

const earlyHintsCallback = () => console.log('early hints message sent');
response.writeEarlyHints({
  'link': earlyHintsLinks,
}, earlyHintsCallback);
```
### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.14.0 | Erlaubt die Übergabe von Headern als Array. |
| v11.10.0, v10.17.0 | Gibt `this` von `writeHead()` zurück, um die Verkettung mit `end()` zu ermöglichen. |
| v5.11.0, v4.4.5 | Ein `RangeError` wird ausgelöst, wenn `statusCode` keine Zahl im Bereich `[100, 999]` ist. |
| v0.1.30 | Hinzugefügt in: v0.1.30 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- Gibt zurück: [\<http.ServerResponse\>](/de/nodejs/api/http#class-httpserverresponse)

Sendet einen Antwortheader an die Anfrage. Der Statuscode ist ein 3-stelliger HTTP-Statuscode, wie z. B. `404`. Das letzte Argument, `headers`, sind die Antwortheader. Optional kann man eine lesbare `statusMessage` als zweites Argument angeben.

`headers` kann ein `Array` sein, in dem sich die Schlüssel und Werte in derselben Liste befinden. Es ist *keine* Liste von Tupeln. Die geradzahligen Offsets sind also Schlüsselwerte und die ungeradzahligen Offsets sind die zugehörigen Werte. Das Array hat das gleiche Format wie `request.rawHeaders`.

Gibt eine Referenz auf die `ServerResponse` zurück, so dass Aufrufe verkettet werden können.

```js [ESM]
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body);
```
Diese Methode darf nur einmal in einer Nachricht aufgerufen werden und muss vor dem Aufruf von [`response.end()`](/de/nodejs/api/http#responseenddata-encoding-callback) aufgerufen werden.

Wenn [`response.write()`](/de/nodejs/api/http#responsewritechunk-encoding-callback) oder [`response.end()`](/de/nodejs/api/http#responseenddata-encoding-callback) vor dem Aufruf dieser Methode aufgerufen werden, werden die impliziten/veränderlichen Header berechnet und diese Funktion aufgerufen.

Wenn Header mit [`response.setHeader()`](/de/nodejs/api/http#responsesetheadername-value) gesetzt wurden, werden sie mit allen an [`response.writeHead()`](/de/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) übergebenen Headern zusammengeführt, wobei die an [`response.writeHead()`](/de/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) übergebenen Header Vorrang haben.

Wenn diese Methode aufgerufen wird und [`response.setHeader()`](/de/nodejs/api/http#responsesetheadername-value) nicht aufgerufen wurde, werden die angegebenen Headerwerte direkt auf den Netzwerkkanal geschrieben, ohne intern zwischengespeichert zu werden, und [`response.getHeader()`](/de/nodejs/api/http#responsegetheadername) für den Header liefert nicht das erwartete Ergebnis. Wenn eine progressive Bestückung von Headern mit potenzieller zukünftiger Abfrage und Modifikation gewünscht ist, verwenden Sie stattdessen [`response.setHeader()`](/de/nodejs/api/http#responsesetheadername-value).

```js [ESM]
// Gibt content-type = text/plain zurück
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
`Content-Length` wird in Byte und nicht in Zeichen gelesen. Verwenden Sie [`Buffer.byteLength()`](/de/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding), um die Länge des Körpers in Byte zu bestimmen. Node.js prüft, ob `Content-Length` und die Länge des übertragenen Körpers übereinstimmen.

Der Versuch, einen Headerfeldnamen oder -wert festzulegen, der ungültige Zeichen enthält, führt dazu, dass ein [`Error`][] ausgelöst wird.


### `response.writeProcessing()` {#responsewriteprocessing}

**Hinzugefügt in: v10.0.0**

Sendet eine HTTP/1.1 102 Processing-Nachricht an den Client, um anzuzeigen, dass der Anfragekörper gesendet werden soll.

## Klasse: `http.IncomingMessage` {#class-httpincomingmessage}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.5.0 | Der Wert `destroyed` gibt `true` zurück, nachdem die eingehenden Daten verbraucht wurden. |
| v13.1.0, v12.16.0 | Der Wert `readableHighWaterMark` spiegelt den des Sockets wider. |
| v0.1.17 | Hinzugefügt in: v0.1.17 |
:::

- Erweitert: [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable)

Ein `IncomingMessage`-Objekt wird von [`http.Server`](/de/nodejs/api/http#class-httpserver) oder [`http.ClientRequest`](/de/nodejs/api/http#class-httpclientrequest) erstellt und als erstes Argument an die Ereignisse [`'request'`](/de/nodejs/api/http#event-request) bzw. [`'response'`](/de/nodejs/api/http#event-response) übergeben. Es kann verwendet werden, um auf Antwortstatus, Header und Daten zuzugreifen.

Anders als sein `socket`-Wert, der eine Unterklasse von [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex) ist, erweitert `IncomingMessage` selbst [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable) und wird separat erstellt, um die eingehenden HTTP-Header und die Nutzlast zu analysieren und auszugeben, da der zugrunde liegende Socket im Fall von Keep-Alive mehrfach wiederverwendet werden kann.

### Ereignis: `'aborted'` {#event-aborted}

**Hinzugefügt in: v0.3.8**

**Veraltet seit: v17.0.0, v16.12.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Lauschen Sie stattdessen auf das Ereignis `'close'`.
:::

Wird ausgelöst, wenn die Anfrage abgebrochen wurde.

### Ereignis: `'close'` {#event-close_3}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Das close-Ereignis wird jetzt ausgelöst, wenn die Anfrage abgeschlossen wurde und nicht, wenn der zugrunde liegende Socket geschlossen wird. |
| v0.4.2 | Hinzugefügt in: v0.4.2 |
:::

Wird ausgelöst, wenn die Anfrage abgeschlossen wurde.

### `message.aborted` {#messageaborted}

**Hinzugefügt in: v10.1.0**

**Veraltet seit: v17.0.0, v16.12.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Überprüfen Sie `message.destroyed` aus [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Eigenschaft `message.aborted` ist `true`, wenn die Anfrage abgebrochen wurde.


### `message.complete` {#messagecomplete}

**Hinzugefügt in: v0.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Eigenschaft `message.complete` ist `true`, wenn eine vollständige HTTP-Nachricht empfangen und erfolgreich analysiert wurde.

Diese Eigenschaft ist besonders nützlich, um festzustellen, ob ein Client oder Server eine Nachricht vollständig übertragen hat, bevor eine Verbindung beendet wurde:

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
        'Die Verbindung wurde beendet, während die Nachricht noch gesendet wurde');
  });
});
```
### `message.connection` {#messageconnection}

**Hinzugefügt in: v0.1.90**

**Veraltet seit: v16.0.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Verwenden Sie [`message.socket`](/de/nodejs/api/http#messagesocket).
:::

Alias für [`message.socket`](/de/nodejs/api/http#messagesocket).

### `message.destroy([error])` {#messagedestroyerror}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.5.0, v12.19.0 | Die Funktion gibt `this` zurück, um die Konsistenz mit anderen Readable Streams zu gewährleisten. |
| v0.3.0 | Hinzugefügt in: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Ruft `destroy()` für den Socket auf, der die `IncomingMessage` empfangen hat. Wenn `error` angegeben ist, wird ein `'error'`-Ereignis auf dem Socket ausgelöst und `error` als Argument an alle Listener für das Ereignis übergeben.

### `message.headers` {#messageheaders}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.5.0, v18.14.0 | Die Option `joinDuplicateHeaders` in den Funktionen `http.request()` und `http.createServer()` stellt sicher, dass doppelte Header nicht verworfen, sondern gemäß RFC 9110 Abschnitt 5.3 durch ein Komma getrennt zusammengeführt werden. |
| v15.1.0 | `message.headers` wird jetzt mithilfe einer Accessor-Eigenschaft im Prototyp lazy berechnet und ist nicht mehr aufzählbar. |
| v0.1.5 | Hinzugefügt in: v0.1.5 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Das Request-/Response-Header-Objekt.

Schlüssel-Wert-Paare von Header-Namen und -Werten. Header-Namen werden in Kleinbuchstaben geschrieben.

```js [ESM]
// Gibt so etwas aus wie:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
Duplikate in Raw-Headern werden je nach Header-Name auf folgende Weise behandelt:

- Duplikate von `age`, `authorization`, `content-length`, `content-type`, `etag`, `expires`, `from`, `host`, `if-modified-since`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `referer`, `retry-after`, `server` oder `user-agent` werden verworfen. Um doppelte Werte der oben aufgeführten Header zuzulassen, die zusammengeführt werden, verwenden Sie die Option `joinDuplicateHeaders` in [`http.request()`](/de/nodejs/api/http#httprequestoptions-callback) und [`http.createServer()`](/de/nodejs/api/http#httpcreateserveroptions-requestlistener). Weitere Informationen finden Sie in RFC 9110 Abschnitt 5.3.
- `set-cookie` ist immer ein Array. Duplikate werden dem Array hinzugefügt.
- Für doppelte `cookie`-Header werden die Werte mit `; ` zusammengeführt.
- Für alle anderen Header werden die Werte mit `, ` zusammengeführt.


### `message.headersDistinct` {#messageheadersdistinct}

**Hinzugefügt in: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Ähnlich wie [`message.headers`](/de/nodejs/api/http#messageheaders), aber ohne Join-Logik und die Werte sind immer Arrays von Strings, auch für Header, die nur einmal empfangen wurden.

```js [ESM]
// Gibt etwas aus wie:
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*/*'] }
console.log(request.headersDistinct);
```
### `message.httpVersion` {#messagehttpversion}

**Hinzugefügt in: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Im Falle einer Serveranfrage die vom Client gesendete HTTP-Version. Im Falle einer Client-Antwort die HTTP-Version des verbundenen Servers. Wahrscheinlich entweder `'1.1'` oder `'1.0'`.

Auch `message.httpVersionMajor` ist die erste ganze Zahl und `message.httpVersionMinor` ist die zweite.

### `message.method` {#messagemethod}

**Hinzugefügt in: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Nur gültig für Anfragen, die von <a href="#class-httpserver"><code>http.Server</code></a> stammen.**

Die Anfrage-Methode als String. Nur lesbar. Beispiele: `'GET'`, `'DELETE'`.

### `message.rawHeaders` {#messagerawheaders}

**Hinzugefügt in: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die rohe Liste der Anfrage-/Antwort-Header, genau so, wie sie empfangen wurden.

Die Schlüssel und Werte befinden sich in derselben Liste. Es ist *keine* Liste von Tupeln. Die geradzahligen Offsets sind also Schlüsselwerte und die ungeradzahligen Offsets sind die zugehörigen Werte.

Header-Namen werden nicht in Kleinbuchstaben umgewandelt und Duplikate werden nicht zusammengeführt.

```js [ESM]
// Gibt etwas aus wie:
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

**Hinzugefügt in: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die rohen Schlüssel und Werte der Anfrage-/Antwort-Trailer, genau so, wie sie empfangen wurden. Wird nur beim `'end'`-Ereignis gefüllt.


### `message.setTimeout(msecs[, callback])` {#messagesettimeoutmsecs-callback}

**Hinzugefügt in: v0.5.9**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage)

Ruft `message.socket.setTimeout(msecs, callback)` auf.

### `message.socket` {#messagesocket}

**Hinzugefügt in: v0.3.0**

- [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Das [`net.Socket`](/de/nodejs/api/net#class-netsocket)-Objekt, das mit der Verbindung verbunden ist.

Verwenden Sie mit HTTPS-Unterstützung [`request.socket.getPeerCertificate()`](/de/nodejs/api/tls#tlssocketgetpeercertificatedetailed), um die Authentifizierungsdetails des Clients abzurufen.

Diese Eigenschaft ist garantiert eine Instanz der [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)-Klasse, einer Unterklasse von [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex), es sei denn, der Benutzer hat einen anderen Socket-Typ als [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) angegeben oder intern auf Null gesetzt.

### `message.statusCode` {#messagestatuscode}

**Hinzugefügt in: v0.1.1**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

**Nur gültig für Antworten, die von <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a> erhalten wurden.**

Der 3-stellige HTTP-Antwortstatuscode. Z. B. `404`.

### `message.statusMessage` {#messagestatusmessage}

**Hinzugefügt in: v0.11.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Nur gültig für Antworten, die von <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a> erhalten wurden.**

Die HTTP-Antwortstatusmeldung (Begründungsphrase). Z.B. `OK` oder `Internal Server Error`.

### `message.trailers` {#messagetrailers}

**Hinzugefügt in: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Das Request/Response-Trailer-Objekt. Wird erst beim `'end'`-Ereignis gefüllt.

### `message.trailersDistinct` {#messagetrailersdistinct}

**Hinzugefügt in: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Ähnlich wie [`message.trailers`](/de/nodejs/api/http#messagetrailers), aber es gibt keine Join-Logik und die Werte sind immer Arrays von Strings, auch für Header, die nur einmal empfangen wurden. Wird erst beim `'end'`-Ereignis gefüllt.


### `message.url` {#messageurl}

**Hinzugefügt in: v0.1.90**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Nur gültig für Anfragen, die von <a href="#class-httpserver"><code>http.Server</code></a> stammen.**

Anfrage-URL-String. Dieser enthält nur die URL, die in der eigentlichen HTTP-Anfrage vorhanden ist. Betrachten Sie die folgende Anfrage:

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
Um die URL in ihre Bestandteile zu zerlegen:

```js [ESM]
new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
```
Wenn `request.url` gleich `'/status?name=ryan'` und `process.env.HOST` undefiniert ist:

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
Stellen Sie sicher, dass Sie `process.env.HOST` auf den Hostnamen des Servers setzen oder erwägen Sie, diesen Teil vollständig zu ersetzen. Wenn Sie `req.headers.host` verwenden, stellen Sie sicher, dass eine ordnungsgemäße Validierung verwendet wird, da Clients möglicherweise einen benutzerdefinierten `Host`-Header angeben.

## Klasse: `http.OutgoingMessage` {#class-httpoutgoingmessage}

**Hinzugefügt in: v0.1.17**

- Erweitert: [\<Stream\>](/de/nodejs/api/stream#stream)

Diese Klasse dient als übergeordnete Klasse von [`http.ClientRequest`](/de/nodejs/api/http#class-httpclientrequest) und [`http.ServerResponse`](/de/nodejs/api/http#class-httpserverresponse). Sie ist eine abstrakte ausgehende Nachricht aus der Perspektive der Teilnehmer einer HTTP-Transaktion.

### Ereignis: `'drain'` {#event-drain}

**Hinzugefügt in: v0.3.6**

Wird ausgelöst, wenn der Puffer der Nachricht wieder frei ist.

### Ereignis: `'finish'` {#event-finish_2}

**Hinzugefügt in: v0.1.17**

Wird ausgelöst, wenn die Übertragung erfolgreich abgeschlossen wurde.

### Ereignis: `'prefinish'` {#event-prefinish}

**Hinzugefügt in: v0.11.6**

Wird ausgelöst, nachdem `outgoingMessage.end()` aufgerufen wurde. Wenn das Ereignis ausgelöst wird, wurden alle Daten verarbeitet, aber nicht unbedingt vollständig geleert.


### `outgoingMessage.addTrailers(headers)` {#outgoingmessageaddtrailersheaders}

**Hinzugefügt in: v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Fügt HTTP-Trailern (Headern, aber am Ende der Nachricht) zur Nachricht hinzu.

Trailer werden **nur** ausgegeben, wenn die Nachricht chunked-kodiert ist. Andernfalls werden die Trailer stillschweigend verworfen.

HTTP erfordert, dass der `Trailer`-Header gesendet wird, um Trailer auszugeben, mit einer Liste von Header-Feldnamen in seinem Wert, z. B.

```js [ESM]
message.writeHead(200, { 'Content-Type': 'text/plain',
                         'Trailer': 'Content-MD5' });
message.write(fileData);
message.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
message.end();
```
Der Versuch, einen Header-Feldnamen oder -Wert festzulegen, der ungültige Zeichen enthält, führt zu einem `TypeError`.

### `outgoingMessage.appendHeader(name, value)` {#outgoingmessageappendheadername-value}

**Hinzugefügt in: v18.3.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Header-Name
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Header-Wert
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Fügt dem Header-Objekt einen einzelnen Header-Wert hinzu.

Wenn der Wert ein Array ist, entspricht dies dem mehrmaligen Aufrufen dieser Methode.

Wenn es keine vorherigen Werte für den Header gab, entspricht dies dem Aufrufen von [`outgoingMessage.setHeader(name, value)`](/de/nodejs/api/http#outgoingmessagesetheadername-value).

Abhängig vom Wert von `options.uniqueHeaders` beim Erstellen der Clientanfrage oder des Servers führt dies dazu, dass der Header entweder mehrmals oder einmal mit Werten, die mit `; ` verbunden sind, gesendet wird.

### `outgoingMessage.connection` {#outgoingmessageconnection}

**Hinzugefügt in: v0.3.0**

**Veraltet seit: v15.12.0, v14.17.1**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`outgoingMessage.socket`](/de/nodejs/api/http#outgoingmessagesocket).
:::

Alias von [`outgoingMessage.socket`](/de/nodejs/api/http#outgoingmessagesocket).


### `outgoingMessage.cork()` {#outgoingmessagecork}

**Hinzugefügt in: v13.2.0, v12.16.0**

Siehe [`writable.cork()`](/de/nodejs/api/stream#writablecork).

### `outgoingMessage.destroy([error])` {#outgoingmessagedestroyerror}

**Hinzugefügt in: v0.3.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Optional, ein Fehler, der mit dem `error`-Event ausgegeben wird
- Rückgabe: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Zerstört die Nachricht. Sobald ein Socket mit der Nachricht verknüpft und verbunden ist, wird auch dieser Socket zerstört.

### `outgoingMessage.end(chunk[, encoding][, callback])` {#outgoingmessageendchunk-encoding-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Der `chunk`-Parameter kann jetzt ein `Uint8Array` sein. |
| v0.11.6 | `callback`-Argument hinzugefügt. |
| v0.1.90 | Hinzugefügt in: v0.1.90 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Optional, **Standard**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Optional
- Rückgabe: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Beendet die ausgehende Nachricht. Wenn Teile des Inhalts noch nicht gesendet wurden, werden sie an das zugrunde liegende System weitergeleitet. Wenn die Nachricht in Chunks aufgeteilt ist, wird der abschließende Chunk `0\r\n\r\n` gesendet und die Trailer (falls vorhanden) werden gesendet.

Wenn `chunk` angegeben ist, entspricht dies dem Aufruf von `outgoingMessage.write(chunk, encoding)`, gefolgt von `outgoingMessage.end(callback)`.

Wenn `callback` angegeben ist, wird sie aufgerufen, wenn die Nachricht abgeschlossen ist (entspricht einem Listener des Ereignisses `'finish'`).

### `outgoingMessage.flushHeaders()` {#outgoingmessageflushheaders}

**Hinzugefügt in: v1.6.0**

Leert die Nachrichtenkopfzeilen.

Aus Effizienzgründen puffert Node.js normalerweise die Nachrichtenkopfzeilen, bis `outgoingMessage.end()` aufgerufen wird oder der erste Chunk der Nachrichtendaten geschrieben wird. Dann versucht es, die Kopfzeilen und Daten in ein einzelnes TCP-Paket zu packen.

Dies ist normalerweise erwünscht (es spart einen TCP-Roundtrip), aber nicht, wenn die ersten Daten erst möglicherweise viel später gesendet werden. `outgoingMessage.flushHeaders()` umgeht die Optimierung und startet die Nachricht.


### `outgoingMessage.getHeader(name)` {#outgoingmessagegetheadername}

**Hinzugefügt in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name des Headers
- Rückgabe: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Gibt den Wert des HTTP-Headers mit dem angegebenen Namen zurück. Wenn dieser Header nicht gesetzt ist, ist der Rückgabewert `undefined`.

### `outgoingMessage.getHeaderNames()` {#outgoingmessagegetheadernames}

**Hinzugefügt in: v7.7.0**

- Rückgabe: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt ein Array zurück, das die eindeutigen Namen der aktuellen ausgehenden Header enthält. Alle Namen sind kleingeschrieben.

### `outgoingMessage.getHeaders()` {#outgoingmessagegetheaders}

**Hinzugefügt in: v7.7.0**

- Rückgabe: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt eine flache Kopie der aktuellen ausgehenden Header zurück. Da eine flache Kopie verwendet wird, können Array-Werte ohne zusätzliche Aufrufe verschiedener headerbezogener HTTP-Modulmethoden geändert werden. Die Schlüssel des zurückgegebenen Objekts sind die Headernamen und die Werte sind die jeweiligen Headerwerte. Alle Headernamen sind kleingeschrieben.

Das von der Methode `outgoingMessage.getHeaders()` zurückgegebene Objekt erbt nicht prototypisch von dem JavaScript `Object`. Das bedeutet, dass typische `Object`-Methoden wie `obj.toString()`, `obj.hasOwnProperty()` und andere nicht definiert sind und nicht funktionieren.

```js [ESM]
outgoingMessage.setHeader('Foo', 'bar');
outgoingMessage.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = outgoingMessage.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `outgoingMessage.hasHeader(name)` {#outgoingmessagehasheadername}

**Hinzugefügt in: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der durch `name` identifizierte Header derzeit in den ausgehenden Headern gesetzt ist. Der Headername ist nicht case-sensitiv.

```js [ESM]
const hasContentType = outgoingMessage.hasHeader('content-type');
```

### `outgoingMessage.headersSent` {#outgoingmessageheaderssent}

**Hinzugefügt in: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Nur lesbar. `true`, wenn die Header gesendet wurden, andernfalls `false`.

### `outgoingMessage.pipe()` {#outgoingmessagepipe}

**Hinzugefügt in: v9.0.0**

Überschreibt die Methode `stream.pipe()`, die von der alten `Stream`-Klasse geerbt wurde, welche die Elternklasse von `http.OutgoingMessage` ist.

Der Aufruf dieser Methode wirft einen `Error`, da `outgoingMessage` ein schreibgeschützter Stream ist.

### `outgoingMessage.removeHeader(name)` {#outgoingmessageremoveheadername}

**Hinzugefügt in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Header-Name

Entfernt einen Header, der für den impliziten Versand in die Warteschlange gestellt wurde.

```js [ESM]
outgoingMessage.removeHeader('Content-Encoding');
```
### `outgoingMessage.setHeader(name, value)` {#outgoingmessagesetheadername-value}

**Hinzugefügt in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Header-Name
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Header-Wert
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Setzt einen einzelnen Header-Wert. Wenn der Header bereits in den zu sendenden Headern vorhanden ist, wird sein Wert ersetzt. Verwenden Sie ein Array von Strings, um mehrere Header mit demselben Namen zu senden.

### `outgoingMessage.setHeaders(headers)` {#outgoingmessagesetheadersheaders}

**Hinzugefügt in: v19.6.0, v18.15.0**

- `headers` [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers) | [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Setzt mehrere Header-Werte für implizite Header. `headers` muss eine Instanz von [`Headers`](/de/nodejs/api/globals#class-headers) oder `Map` sein. Wenn ein Header bereits in den zu sendenden Headern vorhanden ist, wird sein Wert ersetzt.

```js [ESM]
const headers = new Headers({ foo: 'bar' });
outgoingMessage.setHeaders(headers);
```
oder

```js [ESM]
const headers = new Map([['foo', 'bar']]);
outgoingMessage.setHeaders(headers);
```
Wenn Header mit [`outgoingMessage.setHeaders()`](/de/nodejs/api/http#outgoingmessagesetheadersheaders) gesetzt wurden, werden sie mit allen Headern zusammengeführt, die an [`response.writeHead()`](/de/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) übergeben werden, wobei die an [`response.writeHead()`](/de/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) übergebenen Header Vorrang haben.

```js [ESM]
// Gibt content-type = text/plain zurück
const server = http.createServer((req, res) => {
  const headers = new Headers({ 'Content-Type': 'text/html' });
  res.setHeaders(headers);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

### `outgoingMessage.setTimeout(msesc[, callback])` {#outgoingmessagesettimeoutmsesc-callback}

**Hinzugefügt in: v0.9.12**

- `msesc` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Optionale Funktion, die aufgerufen wird, wenn ein Timeout auftritt. Ist das gleiche wie das Binden an das `timeout`-Ereignis.
- Rückgabe: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Sobald ein Socket mit der Nachricht verbunden und verbunden ist, wird [`socket.setTimeout()`](/de/nodejs/api/net#socketsettimeouttimeout-callback) mit `msecs` als erstem Parameter aufgerufen.

### `outgoingMessage.socket` {#outgoingmessagesocket}

**Hinzugefügt in: v0.3.0**

- [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Referenz zum zugrunde liegenden Socket. Normalerweise möchten Benutzer nicht auf diese Eigenschaft zugreifen.

Nach dem Aufruf von `outgoingMessage.end()` wird diese Eigenschaft auf Null gesetzt.

### `outgoingMessage.uncork()` {#outgoingmessageuncork}

**Hinzugefügt in: v13.2.0, v12.16.0**

Siehe [`writable.uncork()`](/de/nodejs/api/stream#writableuncork)

### `outgoingMessage.writableCorked` {#outgoingmessagewritablecorked}

**Hinzugefügt in: v13.2.0, v12.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Anzahl, wie oft `outgoingMessage.cork()` aufgerufen wurde.

### `outgoingMessage.writableEnded` {#outgoingmessagewritableended}

**Hinzugefügt in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, wenn `outgoingMessage.end()` aufgerufen wurde. Diese Eigenschaft gibt nicht an, ob die Daten geleert wurden. Verwenden Sie stattdessen `message.writableFinished` für diesen Zweck.

### `outgoingMessage.writableFinished` {#outgoingmessagewritablefinished}

**Hinzugefügt in: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, wenn alle Daten in das zugrunde liegende System geleert wurden.

### `outgoingMessage.writableHighWaterMark` {#outgoingmessagewritablehighwatermark}

**Hinzugefügt in: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Das `highWaterMark` des zugrunde liegenden Sockets, falls zugewiesen. Andernfalls der Standard-Pufferpegel, wenn [`writable.write()`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) beginnt, false zurückzugeben (`16384`).


### `outgoingMessage.writableLength` {#outgoingmessagewritablelength}

**Hinzugefügt in: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Anzahl der gepufferten Bytes.

### `outgoingMessage.writableObjectMode` {#outgoingmessagewritableobjectmode}

**Hinzugefügt in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Immer `false`.

### `outgoingMessage.write(chunk[, encoding][, callback])` {#outgoingmessagewritechunk-encoding-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Der `chunk`-Parameter kann jetzt ein `Uint8Array` sein. |
| v0.11.6 | Das `callback`-Argument wurde hinzugefügt. |
| v0.1.29 | Hinzugefügt in: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sendet einen Chunk des Body. Diese Methode kann mehrfach aufgerufen werden.

Das `encoding`-Argument ist nur relevant, wenn `chunk` ein String ist. Standardwert ist `'utf8'`.

Das `callback`-Argument ist optional und wird aufgerufen, wenn dieser Daten-Chunk geleert wurde.

Gibt `true` zurück, wenn die gesamten Daten erfolgreich in den Kernel-Puffer geleert wurden. Gibt `false` zurück, wenn alle oder ein Teil der Daten im Benutzerspeicher zwischengespeichert wurden. Das `'drain'`-Ereignis wird ausgelöst, wenn der Puffer wieder frei ist.

## `http.METHODS` {#httpmethods}

**Hinzugefügt in: v0.11.8**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Eine Liste der HTTP-Methoden, die vom Parser unterstützt werden.

## `http.STATUS_CODES` {#httpstatus_codes}

**Hinzugefügt in: v0.1.22**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Eine Sammlung aller Standard-HTTP-Antwortstatuscodes und der Kurzbeschreibung jedes einzelnen Codes. Zum Beispiel `http.STATUS_CODES[404] === 'Not Found'`.


## `http.createServer([options][, requestListener])` {#httpcreateserveroptions-requestlistener}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.1.0, v18.17.0 | Die `highWaterMark`-Option wird jetzt unterstützt. |
| v18.0.0 | Die Optionen `requestTimeout`, `headersTimeout`, `keepAliveTimeout` und `connectionsCheckingInterval` werden jetzt unterstützt. |
| v18.0.0 | Die Option `noDelay` ist jetzt standardmäßig `true`. |
| v17.7.0, v16.15.0 | Die Optionen `noDelay`, `keepAlive` und `keepAliveInitialDelay` werden jetzt unterstützt. |
| v13.3.0 | Die Option `maxHeaderSize` wird jetzt unterstützt. |
| v13.8.0, v12.15.0, v10.19.0 | Die Option `insecureHTTPParser` wird jetzt unterstützt. |
| v9.6.0, v8.12.0 | Das Argument `options` wird jetzt unterstützt. |
| v0.1.13 | Hinzugefügt in: v0.1.13 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `connectionsCheckingInterval`: Legt den Intervallwert in Millisekunden fest, um auf Anfrage- und Header-Timeouts bei unvollständigen Anfragen zu prüfen. **Standard:** `30000`.
    - `headersTimeout`: Legt den Timeout-Wert in Millisekunden für den Empfang der vollständigen HTTP-Header vom Client fest. Siehe [`server.headersTimeout`](/de/nodejs/api/http#serverheaderstimeout) für weitere Informationen. **Standard:** `60000`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Überschreibt optional alle `socket`s' `readableHighWaterMark` und `writableHighWaterMark`. Dies beeinflusst die `highWaterMark`-Eigenschaft von sowohl `IncomingMessage` als auch `ServerResponse`. **Standard:** Siehe [`stream.getDefaultHighWaterMark()`](/de/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode).
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `true` gesetzt, wird ein HTTP-Parser mit aktivierten Toleranz-Flags verwendet. Die Verwendung des unsicheren Parsers sollte vermieden werden. Siehe [`--insecure-http-parser`](/de/nodejs/api/cli#--insecure-http-parser) für weitere Informationen. **Standard:** `false`.
    - `IncomingMessage` [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage) Gibt die zu verwendende `IncomingMessage`-Klasse an. Nützlich, um das ursprüngliche `IncomingMessage` zu erweitern. **Standard:** `IncomingMessage`.
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `true` gesetzt, erlaubt diese Option das Verketten der Feldzeilenwerte mehrerer Header in einer Anfrage mit einem Komma (`, `), anstatt die Duplikate zu verwerfen. Weitere Informationen finden Sie unter [`message.headers`](/de/nodejs/api/http#messageheaders). **Standard:** `false`.
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `true` gesetzt, aktiviert dies die Keep-Alive-Funktionalität auf dem Socket unmittelbar nach dem Empfang einer neuen eingehenden Verbindung, ähnlich wie bei [`socket.setKeepAlive([enable][, initialDelay])`][`socket.setKeepAlive(enable, initialDelay)`]. **Standard:** `false`.
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wenn auf eine positive Zahl gesetzt, legt dies die anfängliche Verzögerung fest, bevor die erste Keepalive-Sonde auf einem inaktiven Socket gesendet wird. **Standard:** `0`.
    - `keepAliveTimeout`: Die Anzahl der Millisekunden der Inaktivität, die ein Server auf zusätzliche eingehende Daten warten muss, nachdem er das Schreiben der letzten Antwort beendet hat, bevor ein Socket zerstört wird. Siehe [`server.keepAliveTimeout`](/de/nodejs/api/http#serverkeepalivetimeout) für weitere Informationen. **Standard:** `5000`.
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Überschreibt optional den Wert von [`--max-http-header-size`](/de/nodejs/api/cli#--max-http-header-sizesize) für Anfragen, die von diesem Server empfangen werden, d.h. die maximale Länge von Anfrageheadern in Bytes. **Standard:** 16384 (16 KiB).
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `true` gesetzt, deaktiviert dies die Verwendung des Nagle-Algorithmus unmittelbar nach dem Empfang einer neuen eingehenden Verbindung. **Standard:** `true`.
    - `requestTimeout`: Legt den Timeout-Wert in Millisekunden für den Empfang der gesamten Anfrage vom Client fest. Siehe [`server.requestTimeout`](/de/nodejs/api/http#serverrequesttimeout) für weitere Informationen. **Standard:** `300000`.
    - `requireHostHeader` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `true` gesetzt, zwingt dies den Server, mit einem 400-Statuscode (Bad Request) auf jede HTTP/1.1-Anfragenachricht zu antworten, der ein Host-Header fehlt (wie in der Spezifikation vorgeschrieben). **Standard:** `true`.
    - `ServerResponse` [\<http.ServerResponse\>](/de/nodejs/api/http#class-httpserverresponse) Gibt die zu verwendende `ServerResponse`-Klasse an. Nützlich, um das ursprüngliche `ServerResponse` zu erweitern. **Standard:** `ServerResponse`.
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Eine Liste von Antwortheadern, die nur einmal gesendet werden sollen. Wenn der Wert des Headers ein Array ist, werden die Elemente mit `; ` verbunden.
    - `rejectNonStandardBodyWrites` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `true` gesetzt, wird ein Fehler ausgelöst, wenn in eine HTTP-Antwort geschrieben wird, die keinen Body hat. **Standard:** `false`.


-  `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
-  Gibt zurück: [\<http.Server\>](/de/nodejs/api/http#class-httpserver)

Gibt eine neue Instanz von [`http.Server`](/de/nodejs/api/http#class-httpserver) zurück.

Der `requestListener` ist eine Funktion, die automatisch zum [`'request'`]-Ereignis](/de/nodejs/api/http#event-request) hinzugefügt wird.

::: code-group
```js [ESM]
import http from 'node:http';

// Erstelle einen lokalen Server, um Daten zu empfangen
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hallo Welt!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// Erstelle einen lokalen Server, um Daten zu empfangen
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hallo Welt!',
  }));
});

server.listen(8000);
```
:::

::: code-group
```js [ESM]
import http from 'node:http';

// Erstelle einen lokalen Server, um Daten zu empfangen
const server = http.createServer();

// Höre auf das Anfrage-Ereignis
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hallo Welt!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// Erstelle einen lokalen Server, um Daten zu empfangen
const server = http.createServer();

// Höre auf das Anfrage-Ereignis
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hallo Welt!',
  }));
});

server.listen(8000);
```
:::


## `http.get(options[, callback])` {#httpgetoptions-callback}

## `http.get(url[, options][, callback])` {#httpgeturl-options-callback}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.9.0 | Der Parameter `url` kann jetzt zusammen mit einem separaten `options`-Objekt übergeben werden. |
| v7.5.0 | Der Parameter `options` kann ein WHATWG `URL`-Objekt sein. |
| v0.3.6 | Hinzugefügt in: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Akzeptiert die gleichen `options` wie [`http.request()`](/de/nodejs/api/http#httprequestoptions-callback), wobei die Methode standardmäßig auf GET gesetzt ist.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<http.ClientRequest\>](/de/nodejs/api/http#class-httpclientrequest)

Da die meisten Anfragen GET-Anfragen ohne Body sind, bietet Node.js diese komfortable Methode an. Der einzige Unterschied zwischen dieser Methode und [`http.request()`](/de/nodejs/api/http#httprequestoptions-callback) ist, dass sie die Methode standardmäßig auf GET setzt und automatisch `req.end()` aufruft. Der Callback muss sich um den Verbrauch der Antwortdaten aus Gründen kümmern, die im Abschnitt [`http.ClientRequest`](/de/nodejs/api/http#class-httpclientrequest) genannt werden.

Der `callback` wird mit einem einzigen Argument aufgerufen, das eine Instanz von [`http.IncomingMessage`](/de/nodejs/api/http#class-httpincomingmessage) ist.

Beispiel für das Abrufen von JSON:

```js [ESM]
http.get('http://localhost:8000/', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  // Jeder 2xx-Statuscode signalisiert eine erfolgreiche Antwort, aber
  // hier prüfen wir nur auf 200.
  if (statusCode !== 200) {
    error = new Error('Anfrage fehlgeschlagen.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Ungültiger Content-Type.\n' +
                      `Erwartet application/json, aber empfangen ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // Antwortdaten verbrauchen, um Speicher freizugeben
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
  console.error(`Fehler erhalten: ${e.message}`);
});

// Erstellen eines lokalen Servers zum Empfangen von Daten
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hallo Welt!',
  }));
});

server.listen(8000);
```

## `http.globalAgent` {#httpglobalagent}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Der Agent verwendet jetzt standardmäßig HTTP Keep-Alive und ein 5-Sekunden-Timeout. |
| v0.5.9 | Hinzugefügt in: v0.5.9 |
:::

- [\<http.Agent\>](/de/nodejs/api/http#class-httpagent)

Globale Instanz von `Agent`, die standardmäßig für alle HTTP-Clientanforderungen verwendet wird. Weicht von einer Standard-`Agent`-Konfiguration dadurch ab, dass `keepAlive` aktiviert ist und ein `timeout` von 5 Sekunden eingestellt ist.

## `http.maxHeaderSize` {#httpmaxheadersize}

**Hinzugefügt in: v11.6.0, v10.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Schreibgeschützte Eigenschaft, die die maximal zulässige Größe von HTTP-Headern in Byte angibt. Der Standardwert ist 16 KiB. Konfigurierbar mit der CLI-Option [`--max-http-header-size`](/de/nodejs/api/cli#--max-http-header-sizesize).

Dies kann für Server- und Clientanforderungen durch Übergabe der Option `maxHeaderSize` überschrieben werden.

## `http.request(options[, callback])` {#httprequestoptions-callback}

## `http.request(url[, options][, callback])` {#httprequesturl-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.7.0, v14.18.0 | Bei Verwendung eines `URL`-Objekts werden geparste Benutzername und Passwort jetzt korrekt URI-decodiert. |
| v15.3.0, v14.17.0 | Es ist möglich, eine Anfrage mit einem AbortSignal abzubrechen. |
| v13.3.0 | Die Option `maxHeaderSize` wird jetzt unterstützt. |
| v13.8.0, v12.15.0, v10.19.0 | Die Option `insecureHTTPParser` wird jetzt unterstützt. |
| v10.9.0 | Der Parameter `url` kann jetzt zusammen mit einem separaten `options`-Objekt übergeben werden. |
| v7.5.0 | Der Parameter `options` kann ein WHATWG `URL`-Objekt sein. |
| v0.3.6 | Hinzugefügt in: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `agent` [\<http.Agent\>](/de/nodejs/api/http#class-httpagent) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Steuert das [`Agent`](/de/nodejs/api/http#class-httpagent)-Verhalten. Mögliche Werte:
    - `undefined` (Standard): verwendet [`http.globalAgent`](/de/nodejs/api/http#httpglobalagent) für diesen Host und Port.
    - `Agent`-Objekt: verwendet explizit den übergebenen `Agent`.
    - `false`: bewirkt, dass ein neuer `Agent` mit Standardwerten verwendet wird.
    
    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Basisauthentifizierung (`'user:password'`), um einen Authorization-Header zu berechnen.
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Funktion, die einen Socket/Stream erzeugt, der für die Anfrage verwendet werden soll, wenn die Option `agent` nicht verwendet wird. Dies kann verwendet werden, um zu vermeiden, eine benutzerdefinierte `Agent`-Klasse zu erstellen, nur um die Standardfunktion `createConnection` zu überschreiben. Weitere Informationen finden Sie unter [`agent.createConnection()`](/de/nodejs/api/http#agentcreateconnectionoptions-callback). Jeder [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Stream ist ein gültiger Rückgabewert.
    - `defaultPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Standardport für das Protokoll. **Standard:** `agent.defaultPort`, wenn ein `Agent` verwendet wird, andernfalls `undefined`.
    - `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) IP-Adressfamilie, die beim Auflösen von `host` oder `hostname` verwendet werden soll. Gültige Werte sind `4` oder `6`. Wenn nicht angegeben, werden sowohl IP v4 als auch v6 verwendet.
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Objekt, das Anfrage-Header enthält.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Optionale [`dns.lookup()`-Hinweise](/de/nodejs/api/dns#supported-getaddrinfo-flags).
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein Domänenname oder eine IP-Adresse des Servers, an den die Anfrage gesendet werden soll. **Standard:** `'localhost'`.
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Alias für `host`. Um [`url.parse()`](/de/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) zu unterstützen, wird `hostname` verwendet, wenn sowohl `host` als auch `hostname` angegeben sind.
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `true` gesetzt, wird ein HTTP-Parser mit aktivierten Toleranz-Flags verwendet. Die Verwendung des unsicheren Parsers sollte vermieden werden. Siehe [`--insecure-http-parser`](/de/nodejs/api/cli#--insecure-http-parser) für weitere Informationen. **Standard:** `false`
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Es verbindet die Feldzeilenwerte mehrerer Header in einer Anfrage mit `, ` anstatt die Duplikate zu verwerfen. Siehe [`message.headers`](/de/nodejs/api/http#messageheaders) für weitere Informationen. **Standard:** `false`.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lokale Schnittstelle, die für Netzwerkverbindungen gebunden werden soll.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lokaler Port, von dem aus die Verbindung hergestellt werden soll.
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Benutzerdefinierte Lookup-Funktion. **Standard:** [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback).
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Überschreibt optional den Wert von [`--max-http-header-size`](/de/nodejs/api/cli#--max-http-header-sizesize) (die maximale Länge der Antwort-Header in Byte) für vom Server empfangene Antworten. **Standard:** 16384 (16 KiB).
    - `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine Zeichenkette, die die HTTP-Anfragemethode angibt. **Standard:** `'GET'`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Anfragepfad. Sollte die Abfragezeichenfolge enthalten, falls vorhanden. Z.B. `'/index.html?page=12'`. Eine Ausnahme wird ausgelöst, wenn der Anfragepfad ungültige Zeichen enthält. Derzeit werden nur Leerzeichen abgelehnt, dies kann sich jedoch in Zukunft ändern. **Standard:** `'/'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port des Remote-Servers. **Standard:** `defaultPort`, falls gesetzt, andernfalls `80`.
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Zu verwendendes Protokoll. **Standard:** `'http:'`.
    - `setDefaultHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): Gibt an, ob Standard-Header wie `Connection`, `Content-Length`, `Transfer-Encoding` und `Host` automatisch hinzugefügt werden sollen oder nicht. Wenn auf `false` gesetzt, müssen alle erforderlichen Header manuell hinzugefügt werden. Standardmäßig `true`.
    - `setHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): Gibt an, ob der `Host`-Header automatisch hinzugefügt werden soll oder nicht. Falls angegeben, überschreibt dies `setDefaultHeaders`. Standardmäßig `true`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal): Ein AbortSignal, das verwendet werden kann, um eine laufende Anfrage abzubrechen.
    - `socketPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Unix-Domain-Socket. Kann nicht verwendet werden, wenn entweder `host` oder `port` angegeben ist, da diese einen TCP-Socket angeben.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): Eine Zahl, die das Socket-Timeout in Millisekunden angibt. Dies setzt das Timeout, bevor der Socket verbunden ist.
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Eine Liste von Request-Headern, die nur einmal gesendet werden sollen. Wenn der Wert des Headers ein Array ist, werden die Elemente mit `; ` verbunden.
    
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<http.ClientRequest\>](/de/nodejs/api/http#class-httpclientrequest)

`options` in [`socket.connect()`](/de/nodejs/api/net#socketconnectoptions-connectlistener) werden ebenfalls unterstützt.

Node.js verwaltet mehrere Verbindungen pro Server, um HTTP-Anfragen zu stellen. Diese Funktion ermöglicht es, Anfragen transparent zu stellen.

`url` kann eine Zeichenkette oder ein [`URL`](/de/nodejs/api/url#the-whatwg-url-api)-Objekt sein. Wenn `url` eine Zeichenkette ist, wird sie automatisch mit [`new URL()`](/de/nodejs/api/url#new-urlinput-base) geparst. Wenn es sich um ein [`URL`](/de/nodejs/api/url#the-whatwg-url-api)-Objekt handelt, wird es automatisch in ein gewöhnliches `options`-Objekt konvertiert.

Wenn sowohl `url` als auch `options` angegeben sind, werden die Objekte zusammengeführt, wobei die `options`-Eigenschaften Vorrang haben.

Der optionale `callback`-Parameter wird als einmaliger Listener für das [`'response'`-Ereignis](/de/nodejs/api/http#event-response) hinzugefügt.

`http.request()` gibt eine Instanz der Klasse [`http.ClientRequest`](/de/nodejs/api/http#class-httpclientrequest) zurück. Die `ClientRequest`-Instanz ist ein beschreibbarer Stream. Wenn man eine Datei mit einer POST-Anfrage hochladen muss, dann schreibe man in das `ClientRequest`-Objekt.

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

In dem Beispiel wurde `req.end()` aufgerufen. Bei `http.request()` muss immer `req.end()` aufgerufen werden, um das Ende der Anfrage zu signalisieren - auch wenn keine Daten in den Anfragetext geschrieben werden.

Wenn während der Anfrage ein Fehler auftritt (sei es bei der DNS-Auflösung, bei Fehlern auf TCP-Ebene oder bei tatsächlichen HTTP-Parsefehlern), wird ein `'error'`-Ereignis auf dem zurückgegebenen Anfrageobjekt ausgelöst. Wie bei allen `'error'`-Ereignissen wird der Fehler ausgelöst, wenn keine Listener registriert sind.

Es gibt ein paar spezielle Header, die beachtet werden sollten.

- Das Senden von 'Connection: keep-alive' benachrichtigt Node.js, dass die Verbindung zum Server bis zur nächsten Anfrage aufrechterhalten werden soll.
- Das Senden eines 'Content-Length'-Headers deaktiviert die standardmäßige Chunked-Encoding.
- Das Senden eines 'Expect'-Headers sendet sofort die Anfrage-Header. Normalerweise sollte beim Senden von 'Expect: 100-continue' sowohl ein Timeout als auch ein Listener für das `'continue'`-Ereignis gesetzt werden. Siehe RFC 2616 Abschnitt 8.2.3 für weitere Informationen.
- Das Senden eines Authorization-Headers überschreibt die Verwendung der Option `auth` zur Berechnung der Basisauthentifizierung.

Beispiel mit einer [`URL`](/de/nodejs/api/url#the-whatwg-url-api) als `options`:

```js [ESM]
const options = new URL('http://abc:');

const req = http.request(options, (res) => {
  // ...
});
```
Bei einer erfolgreichen Anfrage werden die folgenden Ereignisse in der folgenden Reihenfolge ausgelöst:

- `'socket'`
- `'response'`
    - `'data'` beliebig oft auf dem `res`-Objekt (`'data'` wird überhaupt nicht ausgelöst, wenn der Antworttext leer ist, beispielsweise bei den meisten Weiterleitungen)
    - `'end'` auf dem `res`-Objekt

- `'close'`

Im Falle eines Verbindungsfehlers werden die folgenden Ereignisse ausgelöst:

- `'socket'`
- `'error'`
- `'close'`

Im Falle eines vorzeitigen Verbindungsschlusses, bevor die Antwort empfangen wird, werden die folgenden Ereignisse in der folgenden Reihenfolge ausgelöst:

- `'socket'`
- `'error'` mit einem Fehler mit der Meldung `'Error: socket hang up'` und dem Code `'ECONNRESET'`
- `'close'`

Im Falle eines vorzeitigen Verbindungsschlusses, nachdem die Antwort empfangen wurde, werden die folgenden Ereignisse in der folgenden Reihenfolge ausgelöst:

- `'socket'`
- `'response'`
    - `'data'` beliebig oft auf dem `res`-Objekt

- (Verbindung hier geschlossen)
- `'aborted'` auf dem `res`-Objekt
- `'close'`
- `'error'` auf dem `res`-Objekt mit einem Fehler mit der Meldung `'Error: aborted'` und dem Code `'ECONNRESET'`
- `'close'` auf dem `res`-Objekt

Wenn `req.destroy()` aufgerufen wird, bevor ein Socket zugewiesen wird, werden die folgenden Ereignisse in der folgenden Reihenfolge ausgelöst:

- (`req.destroy()` hier aufgerufen)
- `'error'` mit einem Fehler mit der Meldung `'Error: socket hang up'` und dem Code `'ECONNRESET'`, oder dem Fehler, mit dem `req.destroy()` aufgerufen wurde
- `'close'`

Wenn `req.destroy()` aufgerufen wird, bevor die Verbindung erfolgreich hergestellt wird, werden die folgenden Ereignisse in der folgenden Reihenfolge ausgelöst:

- `'socket'`
- (`req.destroy()` hier aufgerufen)
- `'error'` mit einem Fehler mit der Meldung `'Error: socket hang up'` und dem Code `'ECONNRESET'`, oder dem Fehler, mit dem `req.destroy()` aufgerufen wurde
- `'close'`

Wenn `req.destroy()` aufgerufen wird, nachdem die Antwort empfangen wurde, werden die folgenden Ereignisse in der folgenden Reihenfolge ausgelöst:

- `'socket'`
- `'response'`
    - `'data'` beliebig oft auf dem `res`-Objekt

- (`req.destroy()` hier aufgerufen)
- `'aborted'` auf dem `res`-Objekt
- `'close'`
- `'error'` auf dem `res`-Objekt mit einem Fehler mit der Meldung `'Error: aborted'` und dem Code `'ECONNRESET'`, oder dem Fehler, mit dem `req.destroy()` aufgerufen wurde
- `'close'` auf dem `res`-Objekt

Wenn `req.abort()` aufgerufen wird, bevor ein Socket zugewiesen wird, werden die folgenden Ereignisse in der folgenden Reihenfolge ausgelöst:

- (`req.abort()` hier aufgerufen)
- `'abort'`
- `'close'`

Wenn `req.abort()` aufgerufen wird, bevor die Verbindung erfolgreich hergestellt wird, werden die folgenden Ereignisse in der folgenden Reihenfolge ausgelöst:

- `'socket'`
- (`req.abort()` hier aufgerufen)
- `'abort'`
- `'error'` mit einem Fehler mit der Meldung `'Error: socket hang up'` und dem Code `'ECONNRESET'`
- `'close'`

Wenn `req.abort()` aufgerufen wird, nachdem die Antwort empfangen wurde, werden die folgenden Ereignisse in der folgenden Reihenfolge ausgelöst:

- `'socket'`
- `'response'`
    - `'data'` beliebig oft auf dem `res`-Objekt

- (`req.abort()` hier aufgerufen)
- `'abort'`
- `'aborted'` auf dem `res`-Objekt
- `'error'` auf dem `res`-Objekt mit einem Fehler mit der Meldung `'Error: aborted'` und dem Code `'ECONNRESET'`.
- `'close'`
- `'close'` auf dem `res`-Objekt

Das Setzen der Option `timeout` oder die Verwendung der Funktion `setTimeout()` bricht die Anfrage nicht ab oder tut etwas anderes als das Hinzufügen eines `'timeout'`-Ereignisses.

Das Übergeben eines `AbortSignal` und anschließendes Aufrufen von `abort()` auf dem entsprechenden `AbortController` verhält sich genauso wie das Aufrufen von `.destroy()` auf der Anfrage. Insbesondere wird das `'error'`-Ereignis mit einem Fehler mit der Meldung `'AbortError: The operation was aborted'`, dem Code `'ABORT_ERR'` und der `cause` ausgelöst, falls eine bereitgestellt wurde.


## `http.validateHeaderName(name[, label])` {#httpvalidateheadernamename-label}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.5.0, v18.14.0 | Der Parameter `label` wurde hinzugefügt. |
| v14.3.0 | Hinzugefügt in: v14.3.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Beschriftung für Fehlermeldung. **Standard:** `'Header name'`.

Führt die Low-Level-Validierungen für den bereitgestellten `name` aus, die ausgeführt werden, wenn `res.setHeader(name, value)` aufgerufen wird.

Die Übergabe eines ungültigen Werts als `name` führt zum Auslösen eines [`TypeError`](/de/nodejs/api/errors#class-typeerror), der durch `code: 'ERR_INVALID_HTTP_TOKEN'` identifiziert wird.

Es ist nicht erforderlich, diese Methode zu verwenden, bevor Header an eine HTTP-Anfrage oder -Antwort übergeben werden. Das HTTP-Modul validiert diese Header automatisch.

Beispiel:

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

**Hinzugefügt in: v14.3.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Führt die Low-Level-Validierungen für den bereitgestellten `value` aus, die ausgeführt werden, wenn `res.setHeader(name, value)` aufgerufen wird.

Die Übergabe eines ungültigen Werts als `value` führt zum Auslösen eines [`TypeError`](/de/nodejs/api/errors#class-typeerror).

- Ein Fehler aufgrund eines undefinierten Werts wird durch `code: 'ERR_HTTP_INVALID_HEADER_VALUE'` identifiziert.
- Ein Fehler aufgrund eines ungültigen Zeichens wird durch `code: 'ERR_INVALID_CHAR'` identifiziert.

Es ist nicht erforderlich, diese Methode zu verwenden, bevor Header an eine HTTP-Anfrage oder -Antwort übergeben werden. Das HTTP-Modul validiert diese Header automatisch.

Beispiele:

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

**Hinzugefügt in: v18.8.0, v16.18.0**

- `max` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `1000`.

Setzt die maximale Anzahl inaktiver HTTP-Parser.

## `WebSocket` {#websocket}

**Hinzugefügt in: v22.5.0**

Eine browserkompatible Implementierung von [`WebSocket`](/de/nodejs/api/http#websocket).

