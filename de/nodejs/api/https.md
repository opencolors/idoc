---
title: Node.js Dokumentation - HTTPS
description: Das HTTPS-Modul in Node.js bietet eine Implementierung des TLS/SSL-Protokolls, um sichere HTTP-Verbindungen zu ermöglichen. Es umfasst Methoden zum Erstellen sicherer Server und Clients, zum Umgang mit Zertifikaten und zur Verwaltung sicherer Verbindungen.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das HTTPS-Modul in Node.js bietet eine Implementierung des TLS/SSL-Protokolls, um sichere HTTP-Verbindungen zu ermöglichen. Es umfasst Methoden zum Erstellen sicherer Server und Clients, zum Umgang mit Zertifikaten und zur Verwaltung sicherer Verbindungen.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das HTTPS-Modul in Node.js bietet eine Implementierung des TLS/SSL-Protokolls, um sichere HTTP-Verbindungen zu ermöglichen. Es umfasst Methoden zum Erstellen sicherer Server und Clients, zum Umgang mit Zertifikaten und zur Verwaltung sicherer Verbindungen.
---


# HTTPS {#https}

::: tip [Stable: 2 - Stabil]
[Stable: 2](/de/nodejs/api/documentation#stability-index) [Stability: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/https.js](https://github.com/nodejs/node/blob/v23.5.0/lib/https.js)

HTTPS ist das HTTP-Protokoll über TLS/SSL. In Node.js ist dies als separates Modul implementiert.

## Feststellen, ob die Krypto-Unterstützung nicht verfügbar ist {#determining-if-crypto-support-is-unavailable}

Es ist möglich, dass Node.js erstellt wird, ohne Unterstützung für das Modul `node:crypto` einzubeziehen. In solchen Fällen führt der Versuch, von `https` zu `importieren` oder `require('node:https')` aufzurufen, zu einem Fehler.

Bei Verwendung von CommonJS kann der ausgelöste Fehler mithilfe von try/catch abgefangen werden:

```js [CJS]
let https;
try {
  https = require('node:https');
} catch (err) {
  console.error('https-Unterstützung ist deaktiviert!');
}
```
Bei Verwendung des lexikalischen ESM-Schlüsselworts `import` kann der Fehler nur abgefangen werden, wenn ein Handler für `process.on('uncaughtException')` registriert wird, *bevor* ein Versuch unternommen wird, das Modul zu laden (z. B. mithilfe eines Preload-Moduls).

Wenn Sie ESM verwenden und die Möglichkeit besteht, dass der Code auf einem Build von Node.js ausgeführt wird, bei dem die Krypto-Unterstützung nicht aktiviert ist, sollten Sie die Funktion [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) anstelle des lexikalischen Schlüsselworts `import` verwenden:

```js [ESM]
let https;
try {
  https = await import('node:https');
} catch (err) {
  console.error('https-Unterstützung ist deaktiviert!');
}
```
## Klasse: `https.Agent` {#class-httpsagent}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v5.3.0 | Unterstützung für `0` `maxCachedSessions` zum Deaktivieren des TLS-Sitzungs-Cachings. |
| v2.5.0 | Parameter `maxCachedSessions` zu `options` für die Wiederverwendung von TLS-Sitzungen hinzugefügt. |
| v0.4.5 | Hinzugefügt in: v0.4.5 |
:::

Ein [`Agent`](/de/nodejs/api/https#class-httpsagent)-Objekt für HTTPS, ähnlich wie [`http.Agent`](/de/nodejs/api/http#class-httpagent). Weitere Informationen finden Sie unter [`https.request()`](/de/nodejs/api/https#httpsrequestoptions-callback).

### `new Agent([options])` {#new-agentoptions}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.5.0 | servername nicht automatisch setzen, wenn der Zielhost über eine IP-Adresse angegeben wurde. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Satz von konfigurierbaren Optionen, die für den Agenten festgelegt werden sollen. Kann die gleichen Felder wie für [`http.Agent(options)`](/de/nodejs/api/http#new-agentoptions) haben, und
    -  `maxCachedSessions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) maximale Anzahl von zwischengespeicherten TLS-Sitzungen. Verwenden Sie `0`, um das TLS-Sitzungs-Caching zu deaktivieren. **Standard:** `100`.
    -  `servername` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) der Wert der [Server Name Indication extension](https://en.wikipedia.org/wiki/Server_Name_Indication), die an den Server gesendet werden soll. Verwenden Sie die leere Zeichenfolge `''`, um das Senden der Erweiterung zu deaktivieren. **Standard:** Hostname des Zielservers, es sei denn, der Zielserver wird über eine IP-Adresse angegeben. In diesem Fall ist der Standardwert `''` (keine Erweiterung). Informationen zur Wiederverwendung von TLS-Sitzungen finden Sie unter [`Session Resumption`](/de/nodejs/api/tls#session-resumption).


#### Ereignis: `'keylog'` {#event-keylog}

**Hinzugefügt in: v13.2.0, v12.16.0**

- `line` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Zeile mit ASCII-Text, im NSS `SSLKEYLOGFILE`-Format.
- `tlsSocket` [\<tls.TLSSocket\>](/de/nodejs/api/tls#class-tlstlssocket) Die `tls.TLSSocket`-Instanz, auf der sie generiert wurde.

Das `keylog`-Ereignis wird ausgelöst, wenn Schlüsselmaterial von einer Verbindung generiert oder empfangen wird, die von diesem Agenten verwaltet wird (typischerweise bevor der Handshake abgeschlossen ist, aber nicht unbedingt). Dieses Schlüsselmaterial kann zur Fehlersuche gespeichert werden, da es ermöglicht, den erfassten TLS-Traffic zu entschlüsseln. Es kann für jeden Socket mehrmals ausgelöst werden.

Ein typischer Anwendungsfall ist das Anhängen empfangener Zeilen an eine gemeinsame Textdatei, die später von Software (wie Wireshark) verwendet wird, um den Traffic zu entschlüsseln:

```js [ESM]
// ...
https.globalAgent.on('keylog', (line, tlsSocket) => {
  fs.appendFileSync('/tmp/ssl-keys.log', line, { mode: 0o600 });
});
```
## Klasse: `https.Server` {#class-httpsserver}

**Hinzugefügt in: v0.3.4**

- Erweitert: [\<tls.Server\>](/de/nodejs/api/tls#class-tlsserver)

Siehe [`http.Server`](/de/nodejs/api/http#class-httpserver) für weitere Informationen.

### `server.close([callback])` {#serverclosecallback}

**Hinzugefügt in: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<https.Server\>](/de/nodejs/api/https#class-httpsserver)

Siehe [`server.close()`](/de/nodejs/api/http#serverclosecallback) im `node:http`-Modul.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Hinzugefügt in: v20.4.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Ruft [`server.close()`](/de/nodejs/api/https#serverclosecallback) auf und gibt ein Promise zurück, das erfüllt wird, wenn der Server geschlossen wurde.

### `server.closeAllConnections()` {#servercloseallconnections}

**Hinzugefügt in: v18.2.0**

Siehe [`server.closeAllConnections()`](/de/nodejs/api/http#servercloseallconnections) im `node:http`-Modul.

### `server.closeIdleConnections()` {#servercloseidleconnections}

**Hinzugefügt in: v18.2.0**

Siehe [`server.closeIdleConnections()`](/de/nodejs/api/http#servercloseidleconnections) im `node:http`-Modul.


### `server.headersTimeout` {#serverheaderstimeout}

**Hinzugefügt in: v11.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `60000`

Siehe [`server.headersTimeout`](/de/nodejs/api/http#serverheaderstimeout) im `node:http`-Modul.

### `server.listen()` {#serverlisten}

Startet den HTTPS-Server, um auf verschlüsselte Verbindungen zu warten. Diese Methode ist identisch mit [`server.listen()`](/de/nodejs/api/net#serverlisten) von [`net.Server`](/de/nodejs/api/net#class-netserver).

### `server.maxHeadersCount` {#servermaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `2000`

Siehe [`server.maxHeadersCount`](/de/nodejs/api/http#servermaxheaderscount) im `node:http`-Modul.

### `server.requestTimeout` {#serverrequesttimeout}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Standard-Request-Timeout wurde von keinem Timeout auf 300 Sekunden (5 Minuten) geändert. |
| v14.11.0 | Hinzugefügt in: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `300000`

Siehe [`server.requestTimeout`](/de/nodejs/api/http#serverrequesttimeout) im `node:http`-Modul.

### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

**Hinzugefügt in: v0.11.2**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `120000` (2 Minuten)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Rückgabe: [\<https.Server\>](/de/nodejs/api/https#class-httpsserver)

Siehe [`server.setTimeout()`](/de/nodejs/api/http#serversettimeoutmsecs-callback) im `node:http`-Modul.

### `server.timeout` {#servertimeout}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.0.0 | Das Standard-Timeout wurde von 120 Sekunden auf 0 (kein Timeout) geändert. |
| v0.11.2 | Hinzugefügt in: v0.11.2 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** 0 (kein Timeout)

Siehe [`server.timeout`](/de/nodejs/api/http#servertimeout) im `node:http`-Modul.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**Hinzugefügt in: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `5000` (5 Sekunden)

Siehe [`server.keepAliveTimeout`](/de/nodejs/api/http#serverkeepalivetimeout) im Modul `node:http`.

## `https.createServer([options][, requestListener])` {#httpscreateserveroptions-requestlistener}

**Hinzugefügt in: v0.3.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Akzeptiert `options` von [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions) und [`http.createServer()`](/de/nodejs/api/http#httpcreateserveroptions-requestlistener).
- `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ein Listener, der dem `'request'`-Ereignis hinzugefügt werden soll.
- Gibt zurück: [\<https.Server\>](/de/nodejs/api/https#class-httpsserver)

::: code-group
```js [ESM]
// curl -k https://localhost:8000/
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('private-key.pem'),
  cert: readFileSync('certificate.pem'),
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```js [CJS]
// curl -k https://localhost:8000/
const https = require('node:https');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```
:::

Oder

::: code-group
```js [ESM]
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  pfx: readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```js [CJS]
const https = require('node:https');
const fs = require('node:fs');

const options = {
  pfx: fs.readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```
:::

Um das Zertifikat und den Schlüssel für dieses Beispiel zu generieren, führen Sie Folgendes aus:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem
```
Um das `pfx`-Zertifikat für dieses Beispiel zu generieren, führen Sie Folgendes aus:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out test_cert.pfx \
  -inkey private-key.pem -in certificate.pem -passout pass:sample
```

## `https.get(options[, callback])` {#httpsgetoptions-callback}

## `https.get(url[, options][, callback])` {#httpsgeturl-options-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.9.0 | Der Parameter `url` kann jetzt zusammen mit einem separaten `options`-Objekt übergeben werden. |
| v7.5.0 | Der Parameter `options` kann ein WHATWG `URL`-Objekt sein. |
| v0.3.6 | Hinzugefügt in: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Akzeptiert die gleichen `options` wie [`https.request()`](/de/nodejs/api/https#httpsrequestoptions-callback), wobei die Methode standardmäßig auf GET gesetzt ist.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Wie [`http.get()`](/de/nodejs/api/http#httpgetoptions-callback), aber für HTTPS.

`options` kann ein Objekt, eine Zeichenkette oder ein [`URL`](/de/nodejs/api/url#the-whatwg-url-api)-Objekt sein. Wenn `options` eine Zeichenkette ist, wird sie automatisch mit [`new URL()`](/de/nodejs/api/url#new-urlinput-base) geparst. Wenn es sich um ein [`URL`](/de/nodejs/api/url#the-whatwg-url-api)-Objekt handelt, wird es automatisch in ein gewöhnliches `options`-Objekt konvertiert.



::: code-group
```js [ESM]
import { get } from 'node:https';
import process from 'node:process';

get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```

```js [CJS]
const https = require('node:https');

https.get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```
:::


## `https.globalAgent` {#httpsglobalagent}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Der Agent verwendet jetzt standardmäßig HTTP Keep-Alive und ein Timeout von 5 Sekunden. |
| v0.5.9 | Hinzugefügt in: v0.5.9 |
:::

Globale Instanz von [`https.Agent`](/de/nodejs/api/https#class-httpsagent) für alle HTTPS-Clientanfragen. Weicht von einer Standardkonfiguration [`https.Agent`](/de/nodejs/api/https#class-httpsagent) ab, indem `keepAlive` aktiviert ist und ein `Timeout` von 5 Sekunden festgelegt ist.

## `https.request(options[, callback])` {#httpsrequestoptions-callback}

## `https.request(url[, options][, callback])` {#httpsrequesturl-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.4.0, v20.16.0 | Die Option `clientCertEngine` hängt von der benutzerdefinierten Engine-Unterstützung in OpenSSL ab, die in OpenSSL 3 als veraltet gilt. |
| v16.7.0, v14.18.0 | Bei Verwendung eines `URL`-Objekts werden geparste Benutzername und Passwort jetzt korrekt URI-dekodiert. |
| v14.1.0, v13.14.0 | Die Option `highWaterMark` wird jetzt akzeptiert. |
| v10.9.0 | Der Parameter `url` kann jetzt zusammen mit einem separaten `options`-Objekt übergeben werden. |
| v9.3.0 | Der Parameter `options` kann jetzt `clientCertEngine` enthalten. |
| v7.5.0 | Der Parameter `options` kann ein WHATWG `URL`-Objekt sein. |
| v0.3.6 | Hinzugefügt in: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Akzeptiert alle `options` von [`http.request()`](/de/nodejs/api/http#httprequestoptions-callback), mit einigen Unterschieden in den Standardwerten:
    - `protocol` **Standard:** `'https:'`
    - `port` **Standard:** `443`
    - `agent` **Standard:** `https.globalAgent`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Rückgabe: [\<http.ClientRequest\>](/de/nodejs/api/http#class-httpclientrequest)

Sendet eine Anfrage an einen sicheren Webserver.

Die folgenden zusätzlichen `options` von [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback) werden ebenfalls akzeptiert: `ca`, `cert`, `ciphers`, `clientCertEngine` (deprecated), `crl`, `dhparam`, `ecdhCurve`, `honorCipherOrder`, `key`, `passphrase`, `pfx`, `rejectUnauthorized`, `secureOptions`, `secureProtocol`, `servername`, `sessionIdContext`, `highWaterMark`.

`options` kann ein Objekt, ein String oder ein [`URL`](/de/nodejs/api/url#the-whatwg-url-api)-Objekt sein. Wenn `options` ein String ist, wird er automatisch mit [`new URL()`](/de/nodejs/api/url#new-urlinput-base) geparst. Wenn es sich um ein [`URL`](/de/nodejs/api/url#the-whatwg-url-api)-Objekt handelt, wird es automatisch in ein normales `options`-Objekt konvertiert.

`https.request()` gibt eine Instanz der Klasse [`http.ClientRequest`](/de/nodejs/api/http#class-httpclientrequest) zurück. Die `ClientRequest`-Instanz ist ein beschreibbarer Stream. Wenn eine Datei mit einer POST-Anfrage hochgeladen werden muss, schreiben Sie in das `ClientRequest`-Objekt.

::: code-group
```js [ESM]
import { request } from 'node:https';
import process from 'node:process';

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```

```js [CJS]
const https = require('node:https');

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```
:::

Beispiel für die Verwendung von Optionen aus [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback):

```js [ESM]
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};
options.agent = new https.Agent(options);

const req = https.request(options, (res) => {
  // ...
});
```
Alternativ können Sie Connection Pooling deaktivieren, indem Sie keinen [`Agent`](/de/nodejs/api/https#class-httpsagent) verwenden.

```js [ESM]
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  agent: false,
};

const req = https.request(options, (res) => {
  // ...
});
```
Beispiel für die Verwendung einer [`URL`](/de/nodejs/api/url#the-whatwg-url-api) als `options`:

```js [ESM]
const options = new URL('https://abc:');

const req = https.request(options, (res) => {
  // ...
});
```
Beispiel für das Pinnen am Zertifikats-Fingerabdruck oder am öffentlichen Schlüssel (ähnlich wie `pin-sha256`):

::: code-group
```js [ESM]
import { checkServerIdentity } from 'node:tls';
import { Agent, request } from 'node:https';
import { createHash } from 'node:crypto';

function sha256(s) {
  return createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // Make sure the certificate is issued to the host we are connected to
    const err = checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // Pin the public key, similar to HPKP pin-sha256 pinning
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // Pin the exact certificate, rather than the pub key
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // This loop is informational only.
    // Print the certificate and public key fingerprints of all certs in the
    // chain. Its common to pin the public key of the issuer on the public
    // internet, while pinning the public key of the service in sensitive
    // environments.
    let lastprint256;
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      const hash = createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new Agent(options);
const req = request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```

```js [CJS]
const tls = require('node:tls');
const https = require('node:https');
const crypto = require('node:crypto');

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // Make sure the certificate is issued to the host we are connected to
    const err = tls.checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // Pin the public key, similar to HPKP pin-sha256 pinning
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // Pin the exact certificate, rather than the pub key
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // This loop is informational only.
    // Print the certificate and public key fingerprints of all certs in the
    // chain. Its common to pin the public key of the issuer on the public
    // internet, while pinning the public key of the service in sensitive
    // environments.
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      hash = crypto.createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new https.Agent(options);
const req = https.request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```
:::

Beispiele für Ausgaben:

```text [TEXT]
Subject Common Name: github.com
  Certificate SHA256 fingerprint: FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65
  Public key ping-sha256: SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=
Subject Common Name: Sectigo ECC Domain Validation Secure Server CA
  Certificate SHA256 fingerprint: 61:E9:73:75:E9:F6:DA:98:2F:F5:C1:9E:2F:94:E6:6C:4E:35:B6:83:7C:E3:B9:14:D2:24:5C:7F:5F:65:82:5F
  Public key ping-sha256: Eep0p/AsSa9lFUH6KT2UY+9s1Z8v7voAPkQ4fGknZ2g=
Subject Common Name: USERTrust ECC Certification Authority
  Certificate SHA256 fingerprint: A6:CF:64:DB:B4:C8:D5:FD:19:CE:48:89:60:68:DB:03:B5:33:A8:D1:33:6C:62:56:A8:7D:00:CB:B3:DE:F3:EA
  Public key ping-sha256: UJM2FOhG9aTNY0Pg4hgqjNzZ/lQBiMGRxPD5Y2/e0bw=
Subject Common Name: AAA Certificate Services
  Certificate SHA256 fingerprint: D7:A7:A0:FB:5D:7E:27:31:D7:71:E9:48:4E:BC:DE:F7:1D:5F:0C:3E:0A:29:48:78:2B:C8:3E:E0:EA:69:9E:F4
  Public key ping-sha256: vRU+17BDT2iGsXvOi76E7TQMcTLXAqj0+jGPdW7L1vM=
All OK. Server matched our pinned cert or public key
statusCode: 200
```
