---
title: Documentazione Node.js - HTTPS
description: Il modulo HTTPS in Node.js fornisce un'implementazione del protocollo TLS/SSL per consentire connessioni HTTP sicure. Include metodi per creare server e client sicuri, gestire certificati e gestire connessioni sicure.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo HTTPS in Node.js fornisce un'implementazione del protocollo TLS/SSL per consentire connessioni HTTP sicure. Include metodi per creare server e client sicuri, gestire certificati e gestire connessioni sicure.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo HTTPS in Node.js fornisce un'implementazione del protocollo TLS/SSL per consentire connessioni HTTP sicure. Include metodi per creare server e client sicuri, gestire certificati e gestire connessioni sicure.
---


# HTTPS {#https}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/https.js](https://github.com/nodejs/node/blob/v23.5.0/lib/https.js)

HTTPS è il protocollo HTTP su TLS/SSL. In Node.js questo è implementato come un modulo separato.

## Determinare se il supporto crypto non è disponibile {#determining-if-crypto-support-is-unavailable}

È possibile che Node.js sia compilato senza includere il supporto per il modulo `node:crypto`. In tali casi, tentare di `import` da `https` o chiamare `require('node:https')` comporterà la generazione di un errore.

Quando si utilizza CommonJS, l'errore generato può essere intercettato utilizzando try/catch:

```js [CJS]
let https;
try {
  https = require('node:https');
} catch (err) {
  console.error('il supporto https è disabilitato!');
}
```
Quando si utilizza la parola chiave lessicale ESM `import`, l'errore può essere intercettato solo se un gestore per `process.on('uncaughtException')` viene registrato *prima* che venga effettuato qualsiasi tentativo di caricare il modulo (utilizzando, ad esempio, un modulo di precaricamento).

Quando si utilizza ESM, se esiste la possibilità che il codice possa essere eseguito su una build di Node.js in cui il supporto crypto non è abilitato, considera l'utilizzo della funzione [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) invece della parola chiave lessicale `import`:

```js [ESM]
let https;
try {
  https = await import('node:https');
} catch (err) {
  console.error('il supporto https è disabilitato!');
}
```
## Classe: `https.Agent` {#class-httpsagent}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v5.3.0 | supporta `0` `maxCachedSessions` per disabilitare la memorizzazione nella cache della sessione TLS. |
| v2.5.0 | parametro `maxCachedSessions` aggiunto a `options` per il riutilizzo delle sessioni TLS. |
| v0.4.5 | Aggiunto in: v0.4.5 |
:::

Un oggetto [`Agent`](/it/nodejs/api/https#class-httpsagent) per HTTPS simile a [`http.Agent`](/it/nodejs/api/http#class-httpagent). Vedere [`https.request()`](/it/nodejs/api/https#httpsrequestoptions-callback) per maggiori informazioni.

### `new Agent([options])` {#new-agentoptions}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.5.0 | non impostare automaticamente il nome del server se l'host di destinazione è stato specificato utilizzando un indirizzo IP. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Insieme di opzioni configurabili da impostare sull'agente. Può avere gli stessi campi di [`http.Agent(options)`](/it/nodejs/api/http#new-agentoptions), e
    - `maxCachedSessions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) numero massimo di sessioni TLS memorizzate nella cache. Utilizzare `0` per disabilitare la memorizzazione nella cache delle sessioni TLS. **Predefinito:** `100`.
    - `servername` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) il valore dell'[estensione Server Name Indication](https://en.wikipedia.org/wiki/Server_Name_Indication) da inviare al server. Utilizzare una stringa vuota `''` per disabilitare l'invio dell'estensione. **Predefinito:** nome host del server di destinazione, a meno che il server di destinazione non sia specificato utilizzando un indirizzo IP, nel qual caso il valore predefinito è `''` (nessuna estensione). Vedere [`Ripresa della sessione`](/it/nodejs/api/tls#session-resumption) per informazioni sul riutilizzo della sessione TLS.


#### Evento: `'keylog'` {#event-keylog}

**Aggiunto in: v13.2.0, v12.16.0**

- `line` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Riga di testo ASCII, in formato NSS `SSLKEYLOGFILE`.
- `tlsSocket` [\<tls.TLSSocket\>](/it/nodejs/api/tls#class-tlstlssocket) L'istanza `tls.TLSSocket` su cui è stata generata.

L'evento `keylog` viene emesso quando il materiale chiave viene generato o ricevuto da una connessione gestita da questo agente (in genere prima che l'handshake sia completo, ma non necessariamente). Questo materiale chiave può essere memorizzato per il debug, poiché consente di decrittografare il traffico TLS catturato. Può essere emesso più volte per ciascun socket.

Un caso d'uso tipico è quello di aggiungere le righe ricevute a un file di testo comune, che viene successivamente utilizzato da un software (come Wireshark) per decrittografare il traffico:

```js [ESM]
// ...
https.globalAgent.on('keylog', (line, tlsSocket) => {
  fs.appendFileSync('/tmp/ssl-keys.log', line, { mode: 0o600 });
});
```
## Classe: `https.Server` {#class-httpsserver}

**Aggiunto in: v0.3.4**

- Estende: [\<tls.Server\>](/it/nodejs/api/tls#class-tlsserver)

Vedere [`http.Server`](/it/nodejs/api/http#class-httpserver) per ulteriori informazioni.

### `server.close([callback])` {#serverclosecallback}

**Aggiunto in: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<https.Server\>](/it/nodejs/api/https#class-httpsserver)

Vedere [`server.close()`](/it/nodejs/api/http#serverclosecallback) nel modulo `node:http`.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Aggiunto in: v20.4.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Chiama [`server.close()`](/it/nodejs/api/https#serverclosecallback) e restituisce una promise che si adempie quando il server è stato chiuso.

### `server.closeAllConnections()` {#servercloseallconnections}

**Aggiunto in: v18.2.0**

Vedere [`server.closeAllConnections()`](/it/nodejs/api/http#servercloseallconnections) nel modulo `node:http`.

### `server.closeIdleConnections()` {#servercloseidleconnections}

**Aggiunto in: v18.2.0**

Vedere [`server.closeIdleConnections()`](/it/nodejs/api/http#servercloseidleconnections) nel modulo `node:http`.


### `server.headersTimeout` {#serverheaderstimeout}

**Aggiunto in: v11.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `60000`

Vedere [`server.headersTimeout`](/it/nodejs/api/http#serverheaderstimeout) nel modulo `node:http`.

### `server.listen()` {#serverlisten}

Avvia il server HTTPS in ascolto di connessioni crittografate. Questo metodo è identico a [`server.listen()`](/it/nodejs/api/net#serverlisten) da [`net.Server`](/it/nodejs/api/net#class-netserver).

### `server.maxHeadersCount` {#servermaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `2000`

Vedere [`server.maxHeadersCount`](/it/nodejs/api/http#servermaxheaderscount) nel modulo `node:http`.

### `server.requestTimeout` {#serverrequesttimeout}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Il timeout predefinito della richiesta è cambiato da nessun timeout a 300s (5 minuti). |
| v14.11.0 | Aggiunto in: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `300000`

Vedere [`server.requestTimeout`](/it/nodejs/api/http#serverrequesttimeout) nel modulo `node:http`.

### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

**Aggiunto in: v0.11.2**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `120000` (2 minuti)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<https.Server\>](/it/nodejs/api/https#class-httpsserver)

Vedere [`server.setTimeout()`](/it/nodejs/api/http#serversettimeoutmsecs-callback) nel modulo `node:http`.

### `server.timeout` {#servertimeout}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.0.0 | Il timeout predefinito è cambiato da 120s a 0 (nessun timeout). |
| v0.11.2 | Aggiunto in: v0.11.2 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** 0 (nessun timeout)

Vedere [`server.timeout`](/it/nodejs/api/http#servertimeout) nel modulo `node:http`.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**Aggiunto in: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `5000` (5 secondi)

Vedi [`server.keepAliveTimeout`](/it/nodejs/api/http#serverkeepalivetimeout) nel modulo `node:http`.

## `https.createServer([options][, requestListener])` {#httpscreateserveroptions-requestlistener}

**Aggiunto in: v0.3.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Accetta `options` da [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions) e [`http.createServer()`](/it/nodejs/api/http#httpcreateserveroptions-requestlistener).
- `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Un listener da aggiungere all'evento `'request'`.
- Restituisce: [\<https.Server\>](/it/nodejs/api/https#class-httpsserver)



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

Oppure



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

Per generare il certificato e la chiave per questo esempio, esegui:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem
```
Quindi, per generare il certificato `pfx` per questo esempio, esegui:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out test_cert.pfx \
  -inkey private-key.pem -in certificate.pem -passout pass:sample
```

## `https.get(options[, callback])` {#httpsgetoptions-callback}

## `https.get(url[, options][, callback])` {#httpsgeturl-options-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.9.0 | Il parametro `url` può ora essere passato insieme a un oggetto `options` separato. |
| v7.5.0 | Il parametro `options` può essere un oggetto WHATWG `URL`. |
| v0.3.6 | Aggiunto in: v0.3.6 |
:::

- `url` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Accetta le stesse `options` di [`https.request()`](/it/nodejs/api/https#httpsrequestoptions-callback), con il metodo impostato su GET per impostazione predefinita.
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Come [`http.get()`](/it/nodejs/api/http#httpgetoptions-callback) ma per HTTPS.

`options` può essere un oggetto, una stringa o un oggetto [`URL`](/it/nodejs/api/url#the-whatwg-url-api). Se `options` è una stringa, viene automaticamente analizzata con [`new URL()`](/it/nodejs/api/url#new-urlinput-base). Se è un oggetto [`URL`](/it/nodejs/api/url#the-whatwg-url-api), verrà automaticamente convertito in un normale oggetto `options`.



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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | L'agente ora utilizza HTTP Keep-Alive e un timeout di 5 secondi per impostazione predefinita. |
| v0.5.9 | Aggiunto in: v0.5.9 |
:::

Istanza globale di [`https.Agent`](/it/nodejs/api/https#class-httpsagent) per tutte le richieste client HTTPS. Differisce da una configurazione predefinita di [`https.Agent`](/it/nodejs/api/https#class-httpsagent) avendo `keepAlive` abilitato e un `timeout` di 5 secondi.

## `https.request(options[, callback])` {#httpsrequestoptions-callback}

## `https.request(url[, options][, callback])` {#httpsrequesturl-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.4.0, v20.16.0 | L'opzione `clientCertEngine` dipende dal supporto del motore personalizzato in OpenSSL che è deprecato in OpenSSL 3. |
| v16.7.0, v14.18.0 | Quando si utilizza un oggetto `URL` analizzato, username e password verranno ora decodificati correttamente tramite URI. |
| v14.1.0, v13.14.0 | L'opzione `highWaterMark` è ora accettata. |
| v10.9.0 | Il parametro `url` può ora essere passato insieme a un oggetto `options` separato. |
| v9.3.0 | Il parametro `options` può ora includere `clientCertEngine`. |
| v7.5.0 | Il parametro `options` può essere un oggetto WHATWG `URL`. |
| v0.3.6 | Aggiunto in: v0.3.6 |
:::

- `url` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Accetta tutte le `options` da [`http.request()`](/it/nodejs/api/http#httprequestoptions-callback), con alcune differenze nei valori predefiniti:
    - `protocol` **Predefinito:** `'https:'`
    - `port` **Predefinito:** `443`
    - `agent` **Predefinito:** `https.globalAgent`


- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<http.ClientRequest\>](/it/nodejs/api/http#class-httpclientrequest)

Effettua una richiesta a un server web sicuro.

Sono accettate anche le seguenti `options` aggiuntive da [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback): `ca`, `cert`, `ciphers`, `clientCertEngine` (deprecato), `crl`, `dhparam`, `ecdhCurve`, `honorCipherOrder`, `key`, `passphrase`, `pfx`, `rejectUnauthorized`, `secureOptions`, `secureProtocol`, `servername`, `sessionIdContext`, `highWaterMark`.

`options` può essere un oggetto, una stringa o un oggetto [`URL`](/it/nodejs/api/url#the-whatwg-url-api). Se `options` è una stringa, viene automaticamente analizzata con [`new URL()`](/it/nodejs/api/url#new-urlinput-base). Se è un oggetto [`URL`](/it/nodejs/api/url#the-whatwg-url-api), verrà automaticamente convertito in un oggetto `options` ordinario.

`https.request()` restituisce un'istanza della classe [`http.ClientRequest`](/it/nodejs/api/http#class-httpclientrequest). L'istanza `ClientRequest` è uno stream scrivibile. Se è necessario caricare un file con una richiesta POST, allora scrivi sull'oggetto `ClientRequest`.

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

Esempio che utilizza le opzioni da [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback):

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
In alternativa, rinuncia al pool di connessioni non utilizzando un [`Agent`](/it/nodejs/api/https#class-httpsagent).

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
Esempio che utilizza una [`URL`](/it/nodejs/api/url#the-whatwg-url-api) come `options`:

```js [ESM]
const options = new URL('https://abc:');

const req = https.request(options, (res) => {
  // ...
});
```
Esempio di pinning sull'impronta digitale del certificato o sulla chiave pubblica (simile a `pin-sha256`):

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

Output ad esempio:

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
