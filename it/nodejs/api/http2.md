---
title: Documentazione Node.js - HTTP/2
description: Questa pagina fornisce una documentazione completa sul modulo HTTP/2 in Node.js, dettagliando la sua API, l'uso e gli esempi per implementare server e client HTTP/2.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Questa pagina fornisce una documentazione completa sul modulo HTTP/2 in Node.js, dettagliando la sua API, l'uso e gli esempi per implementare server e client HTTP/2.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Questa pagina fornisce una documentazione completa sul modulo HTTP/2 in Node.js, dettagliando la sua API, l'uso e gli esempi per implementare server e client HTTP/2.
---


# HTTP/2 {#http/2}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Le richieste con l'header `host` (con o senza `:authority`) possono ora essere inviate/ricevute. |
| v15.3.0, v14.17.0 | È possibile interrompere una richiesta con un AbortSignal. |
| v10.10.0 | HTTP/2 è ora stabile. In precedenza era sperimentale. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice Sorgente:** [lib/http2.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http2.js)

Il modulo `node:http2` fornisce un'implementazione del protocollo [HTTP/2](https://tools.ietf.org/html/rfc7540). Vi si può accedere usando:

```js [ESM]
const http2 = require('node:http2');
```
## Determinare se il supporto crittografico non è disponibile {#determining-if-crypto-support-is-unavailable}

È possibile che Node.js venga compilato senza includere il supporto per il modulo `node:crypto`. In tali casi, tentare di `import` da `node:http2` o chiamare `require('node:http2')` comporterà la generazione di un errore.

Quando si utilizza CommonJS, l'errore generato può essere intercettato utilizzando try/catch:

```js [CJS]
let http2;
try {
  http2 = require('node:http2');
} catch (err) {
  console.error('il supporto http2 è disabilitato!');
}
```
Quando si utilizza la parola chiave lessicale ESM `import`, l'errore può essere intercettato solo se un gestore per `process.on('uncaughtException')` viene registrato *prima* di qualsiasi tentativo di caricare il modulo (utilizzando, ad esempio, un modulo di precaricamento).

Quando si utilizza ESM, se c'è la possibilità che il codice possa essere eseguito su una build di Node.js in cui il supporto crittografico non è abilitato, prendere in considerazione l'utilizzo della funzione [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) invece della parola chiave lessicale `import`:

```js [ESM]
let http2;
try {
  http2 = await import('node:http2');
} catch (err) {
  console.error('il supporto http2 è disabilitato!');
}
```
## API Core {#core-api}

L'API Core fornisce un'interfaccia di basso livello progettata specificamente per il supporto delle funzionalità del protocollo HTTP/2. Non è specificamente progettata per la compatibilità con l'API del modulo [HTTP/1](/it/nodejs/api/http) esistente. Tuttavia, lo è l'[API di compatibilità](/it/nodejs/api/http2#compatibility-api).

L'API Core `http2` è molto più simmetrica tra client e server rispetto all'API `http`. Ad esempio, la maggior parte degli eventi, come `'error'`, `'connect'` e `'stream'`, possono essere emessi dal codice lato client o dal codice lato server.


### Esempio lato server {#server-side-example}

Quanto segue illustra un semplice server HTTP/2 che utilizza l'API Core. Poiché non sono noti browser che supportino [HTTP/2 non crittografato](https://http2.github.io/faq/#does-http2-require-encryption), l'uso di [`http2.createSecureServer()`](/it/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) è necessario quando si comunica con i client browser.



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
  // stream è un Duplex
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
  // stream è un Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::

Per generare il certificato e la chiave per questo esempio, esegui:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```
### Esempio lato client {#client-side-example}

Quanto segue illustra un client HTTP/2:



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


### Classe: `Http2Session` {#class-http2session}

**Aggiunto in: v8.4.0**

- Estende: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Le istanze della classe `http2.Http2Session` rappresentano una sessione di comunicazione attiva tra un client e un server HTTP/2. Non è previsto che le istanze di questa classe vengano costruite direttamente dal codice utente.

Ogni istanza di `Http2Session` mostrerà comportamenti leggermente diversi a seconda che stia operando come server o come client. La proprietà `http2session.type` può essere utilizzata per determinare la modalità in cui opera una `Http2Session`. Sul lato server, raramente il codice utente avrà occasione di lavorare direttamente con l'oggetto `Http2Session`, con la maggior parte delle azioni in genere eseguite tramite interazioni con gli oggetti `Http2Server` o `Http2Stream`.

Il codice utente non creerà direttamente istanze di `Http2Session`. Le istanze di `Http2Session` lato server vengono create dall'istanza di `Http2Server` quando viene ricevuta una nuova connessione HTTP/2. Le istanze di `Http2Session` lato client vengono create utilizzando il metodo `http2.connect()`.

#### `Http2Session` e socket {#http2session-and-sockets}

Ogni istanza di `Http2Session` è associata esattamente a un [`net.Socket`](/it/nodejs/api/net#class-netsocket) o [`tls.TLSSocket`](/it/nodejs/api/tls#class-tlstlssocket) quando viene creata. Quando il `Socket` o la `Http2Session` vengono distrutti, entrambi verranno distrutti.

A causa dei requisiti specifici di serializzazione ed elaborazione imposti dal protocollo HTTP/2, non è raccomandato che il codice utente legga dati da o scriva dati su un'istanza di `Socket` associata a una `Http2Session`. In tal caso, la sessione HTTP/2 potrebbe trovarsi in uno stato indeterminato, rendendo inutilizzabile la sessione e il socket.

Una volta che un `Socket` è stato associato a una `Http2Session`, il codice utente dovrebbe fare affidamento esclusivamente sull'API della `Http2Session`.

#### Evento: `'close'` {#event-close}

**Aggiunto in: v8.4.0**

L'evento `'close'` viene emesso una volta che la `Http2Session` è stata distrutta. Il suo listener non si aspetta argomenti.

#### Evento: `'connect'` {#event-connect}

**Aggiunto in: v8.4.0**

- `session` [\<Http2Session\>](/it/nodejs/api/http2#class-http2session)
- `socket` [\<net.Socket\>](/it/nodejs/api/net#class-netsocket)

L'evento `'connect'` viene emesso una volta che la `Http2Session` è stata connessa correttamente al peer remoto e la comunicazione può iniziare.

In genere, il codice utente non ascolterà direttamente questo evento.


#### Evento: `'error'` {#event-error}

**Aggiunto in: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

L'evento `'error'` viene emesso quando si verifica un errore durante l'elaborazione di una `Http2Session`.

#### Evento: `'frameError'` {#event-frameerror}

**Aggiunto in: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il tipo di frame.
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il codice di errore.
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID del flusso (o `0` se il frame non è associato a un flusso).

L'evento `'frameError'` viene emesso quando si verifica un errore durante il tentativo di inviare un frame sulla sessione. Se il frame che non è stato possibile inviare è associato a uno specifico `Http2Stream`, viene effettuato un tentativo di emettere un evento `'frameError'` sull'`Http2Stream`.

Se l'evento `'frameError'` è associato a un flusso, il flusso verrà chiuso e distrutto immediatamente dopo l'evento `'frameError'`. Se l'evento non è associato a un flusso, l'`Http2Session` verrà arrestata immediatamente dopo l'evento `'frameError'`.

#### Evento: `'goaway'` {#event-goaway}

**Aggiunto in: v8.4.0**

- `errorCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il codice di errore HTTP/2 specificato nel frame `GOAWAY`.
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID dell'ultimo flusso elaborato correttamente dal peer remoto (o `0` se non è specificato alcun ID).
- `opaqueData` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Se nel frame `GOAWAY` sono stati inclusi dati opachi aggiuntivi, verrà passato un'istanza `Buffer` contenente tali dati.

L'evento `'goaway'` viene emesso quando viene ricevuto un frame `GOAWAY`.

L'istanza `Http2Session` verrà arrestata automaticamente quando viene emesso l'evento `'goaway'`.


#### Evento: `'localSettings'` {#event-localsettings}

**Aggiunto in: v8.4.0**

- `settings` [\<Oggetto Impostazioni HTTP/2\>](/it/nodejs/api/http2#settings-object) Una copia del frame `SETTINGS` ricevuto.

L'evento `'localSettings'` viene emesso quando è stato ricevuto un frame `SETTINGS` di riconoscimento.

Quando si utilizza `http2session.settings()` per inviare nuove impostazioni, le impostazioni modificate non hanno effetto finché non viene emesso l'evento `'localSettings'`.

```js [ESM]
session.settings({ enablePush: false });

session.on('localSettings', (settings) => {
  /* Usa le nuove impostazioni */
});
```
#### Evento: `'ping'` {#event-ping}

**Aggiunto in: v10.12.0**

- `payload` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Il payload di 8 byte del frame `PING`

L'evento `'ping'` viene emesso ogni volta che viene ricevuto un frame `PING` dal peer connesso.

#### Evento: `'remoteSettings'` {#event-remotesettings}

**Aggiunto in: v8.4.0**

- `settings` [\<Oggetto Impostazioni HTTP/2\>](/it/nodejs/api/http2#settings-object) Una copia del frame `SETTINGS` ricevuto.

L'evento `'remoteSettings'` viene emesso quando viene ricevuto un nuovo frame `SETTINGS` dal peer connesso.

```js [ESM]
session.on('remoteSettings', (settings) => {
  /* Usa le nuove impostazioni */
});
```
#### Evento: `'stream'` {#event-stream}

**Aggiunto in: v8.4.0**

- `stream` [\<Http2Stream\>](/it/nodejs/api/http2#class-http2stream) Un riferimento allo stream
- `headers` [\<Oggetto Intestazioni HTTP/2\>](/it/nodejs/api/http2#headers-object) Un oggetto che descrive le intestazioni
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) I flag numerici associati
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array contenente i nomi delle intestazioni non elaborate seguiti dai rispettivi valori.

L'evento `'stream'` viene emesso quando viene creato un nuovo `Http2Stream`.

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
Sul lato server, il codice utente in genere non ascolta direttamente questo evento e invece registrerebbe un gestore per l'evento `'stream'` emesso dalle istanze `net.Server` o `tls.Server` restituite rispettivamente da `http2.createServer()` e `http2.createSecureServer()`, come nell'esempio seguente:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// Crea un server HTTP/2 non crittografato
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

// Crea un server HTTP/2 non crittografato
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

Anche se gli stream HTTP/2 e i socket di rete non sono in una corrispondenza 1:1, un errore di rete distruggerà ogni singolo stream e deve essere gestito a livello di stream, come mostrato sopra.


#### Evento: `'timeout'` {#event-timeout}

**Aggiunto in: v8.4.0**

Dopo che il metodo `http2session.setTimeout()` viene utilizzato per impostare il periodo di timeout per questa `Http2Session`, l'evento `'timeout'` viene emesso se non c'è attività sulla `Http2Session` dopo il numero di millisecondi configurato. Il suo listener non si aspetta argomenti.

```js [ESM]
session.setTimeout(2000);
session.on('timeout', () => { /* .. */ });
```
#### `http2session.alpnProtocol` {#http2sessionalpnprotocol}

**Aggiunto in: v9.4.0**

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Il valore sarà `undefined` se la `Http2Session` non è ancora connessa a un socket, `h2c` se la `Http2Session` non è connessa a una `TLSSocket`, oppure restituirà il valore della proprietà `alpnProtocol` della `TLSSocket` connessa.

#### `http2session.close([callback])` {#http2sessionclosecallback}

**Aggiunto in: v9.4.0**

- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Chiude in modo pulito la `Http2Session`, consentendo a qualsiasi stream esistente di completarsi da solo e impedendo la creazione di nuove istanze `Http2Stream`. Una volta chiusa, `http2session.destroy()` *potrebbe* essere chiamata se non ci sono istanze `Http2Stream` aperte.

Se specificato, la funzione `callback` viene registrata come gestore per l'evento `'close'`.

#### `http2session.closed` {#http2sessionclosed}

**Aggiunto in: v9.4.0**

- [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sarà `true` se questa istanza `Http2Session` è stata chiusa, altrimenti `false`.

#### `http2session.connecting` {#http2sessionconnecting}

**Aggiunto in: v10.0.0**

- [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sarà `true` se questa istanza `Http2Session` è ancora in fase di connessione, verrà impostata su `false` prima di emettere l'evento `connect` e/o di chiamare la callback `http2.connect`.

#### `http2session.destroy([error][, code])` {#http2sessiondestroyerror-code}

**Aggiunto in: v8.4.0**

- `error` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un oggetto `Error` se la `Http2Session` viene distrutta a causa di un errore.
- `code` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il codice di errore HTTP/2 da inviare nel frame `GOAWAY` finale. Se non specificato e `error` non è indefinito, il valore predefinito è `INTERNAL_ERROR`, altrimenti il valore predefinito è `NO_ERROR`.

Termina immediatamente la `Http2Session` e la `net.Socket` o `tls.TLSSocket` associata.

Una volta distrutta, la `Http2Session` emetterà l'evento `'close'`. Se `error` non è indefinito, un evento `'error'` verrà emesso immediatamente prima dell'evento `'close'`.

Se ci sono ancora `Http2Stream` aperti associati alla `Http2Session`, anche questi verranno distrutti.


#### `http2session.destroyed` {#http2sessiondestroyed}

**Aggiunto in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sarà `true` se questa istanza di `Http2Session` è stata distrutta e non deve più essere utilizzata, altrimenti `false`.

#### `http2session.encrypted` {#http2sessionencrypted}

**Aggiunto in: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Il valore è `undefined` se il socket di sessione `Http2Session` non è ancora stato connesso, `true` se `Http2Session` è connesso con un `TLSSocket` e `false` se `Http2Session` è connesso a qualsiasi altro tipo di socket o stream.

#### `http2session.goaway([code[, lastStreamID[, opaqueData]]])` {#http2sessiongoawaycode-laststreamid-opaquedata}

**Aggiunto in: v9.4.0**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un codice di errore HTTP/2
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID numerico dell'ultimo `Http2Stream` elaborato
- `opaqueData` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un'istanza di `TypedArray` o `DataView` contenente dati aggiuntivi da trasportare all'interno del frame `GOAWAY`.

Trasmette un frame `GOAWAY` al peer connesso *senza* arrestare `Http2Session`.

#### `http2session.localSettings` {#http2sessionlocalsettings}

**Aggiunto in: v8.4.0**

- [\<Oggetto Impostazioni HTTP/2\>](/it/nodejs/api/http2#settings-object)

Un oggetto senza prototipo che descrive le impostazioni locali correnti di questo `Http2Session`. Le impostazioni locali sono locali a *questa* istanza di `Http2Session`.

#### `http2session.originSet` {#http2sessionoriginset}

**Aggiunto in: v9.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Se `Http2Session` è connesso a un `TLSSocket`, la proprietà `originSet` restituirà un `Array` di origini per le quali `Http2Session` può essere considerato autorevole.

La proprietà `originSet` è disponibile solo quando si utilizza una connessione TLS sicura.


#### `http2session.pendingSettingsAck` {#http2sessionpendingsettingsack}

**Aggiunto in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Indica se l'`Http2Session` è attualmente in attesa di un riconoscimento di un frame `SETTINGS` inviato. Sarà `true` dopo aver chiamato il metodo `http2session.settings()`. Sarà `false` una volta che tutti i frame `SETTINGS` inviati sono stati riconosciuti.

#### `http2session.ping([payload, ]callback)` {#http2sessionpingpayload-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v8.9.3 | Aggiunto in: v8.9.3 |
:::

- `payload` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Payload ping opzionale.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Invia un frame `PING` al peer HTTP/2 connesso. Deve essere fornita una funzione `callback`. Il metodo restituirà `true` se il `PING` è stato inviato, `false` altrimenti.

Il numero massimo di ping in sospeso (non riconosciuti) è determinato dall'opzione di configurazione `maxOutstandingPings`. Il massimo predefinito è 10.

Se fornito, il `payload` deve essere un `Buffer`, `TypedArray` o `DataView` contenente 8 byte di dati che verranno trasmessi con il `PING` e restituiti con il riconoscimento del ping.

La callback verrà richiamata con tre argomenti: un argomento di errore che sarà `null` se il `PING` è stato riconosciuto correttamente, un argomento `duration` che riporta il numero di millisecondi trascorsi dall'invio del ping e dalla ricezione del riconoscimento e un `Buffer` contenente il payload `PING` di 8 byte.

```js [ESM]
session.ping(Buffer.from('abcdefgh'), (err, duration, payload) => {
  if (!err) {
    console.log(`Ping riconosciuto in ${duration} millisecondi`);
    console.log(`Con payload '${payload.toString()}'`);
  }
});
```
Se l'argomento `payload` non è specificato, il payload predefinito sarà il timestamp a 64 bit (little endian) che contrassegna l'inizio della durata del `PING`.


#### `http2session.ref()` {#http2sessionref}

**Aggiunto in: v9.4.0**

Chiama [`ref()`](/it/nodejs/api/net#socketref) sull'istanza [`net.Socket`](/it/nodejs/api/net#class-netsocket) sottostante di questa `Http2Session`.

#### `http2session.remoteSettings` {#http2sessionremotesettings}

**Aggiunto in: v8.4.0**

- [\<Oggetto Impostazioni HTTP/2\>](/it/nodejs/api/http2#settings-object)

Un oggetto senza prototipo che descrive le impostazioni remote correnti di questa `Http2Session`. Le impostazioni remote sono impostate dal peer HTTP/2 *connesso*.

#### `http2session.setLocalWindowSize(windowSize)` {#http2sessionsetlocalwindowsizewindowsize}

**Aggiunto in: v15.3.0, v14.18.0**

- `windowSize` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Imposta la dimensione della finestra dell'endpoint locale. `windowSize` è la dimensione totale della finestra da impostare, non il delta.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Imposta la dimensione della finestra locale a 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Imposta la dimensione della finestra locale a 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```
:::

Per i client http2 l'evento corretto è `'connect'` o `'remoteSettings'`.

#### `http2session.setTimeout(msecs, callback)` {#http2sessionsettimeoutmsecs-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- `msecs` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Utilizzato per impostare una funzione di callback che viene chiamata quando non c'è attività sulla `Http2Session` dopo `msecs` millisecondi. La `callback` fornita viene registrata come listener sull'evento `'timeout'`.


#### `http2session.socket` {#http2sessionsocket}

**Aggiunto in: v8.4.0**

- [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/it/nodejs/api/tls#class-tlstlssocket)

Restituisce un oggetto `Proxy` che funge da `net.Socket` (o `tls.TLSSocket`) ma limita i metodi disponibili a quelli sicuri da utilizzare con HTTP/2.

`destroy`, `emit`, `end`, `pause`, `read`, `resume` e `write` genereranno un errore con codice `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Vedi [`Http2Session` e Socket](/it/nodejs/api/http2#http2session-and-sockets) per maggiori informazioni.

Il metodo `setTimeout` verrà chiamato su questa `Http2Session`.

Tutte le altre interazioni verranno indirizzate direttamente al socket.

#### `http2session.state` {#http2sessionstate}

**Aggiunto in: v8.4.0**

Fornisce informazioni varie sullo stato corrente di `Http2Session`.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `effectiveLocalWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione corrente della finestra di controllo del flusso locale (ricezione) per `Http2Session`.
    - `effectiveRecvDataLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero corrente di byte ricevuti dall'ultimo `WINDOW_UPDATE` di controllo del flusso.
    - `nextStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'identificatore numerico da utilizzare la prossima volta che un nuovo `Http2Stream` viene creato da questa `Http2Session`.
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte che il peer remoto può inviare senza ricevere un `WINDOW_UPDATE`.
    - `lastProcStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID numerico di `Http2Stream` per il quale è stato ricevuto più recentemente un frame `HEADERS` o `DATA`.
    - `remoteWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte che questa `Http2Session` può inviare senza ricevere un `WINDOW_UPDATE`.
    - `outboundQueueSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di frame attualmente all'interno della coda in uscita per questa `Http2Session`.
    - `deflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione corrente in byte della tabella di stato di compressione dell'header in uscita.
    - `inflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione corrente in byte della tabella di stato di compressione dell'header in entrata.

Un oggetto che descrive lo stato corrente di questa `Http2Session`.


#### `http2session.settings([settings][, callback])` {#http2sessionsettingssettings-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- `settings` [\<Oggetto Impostazioni HTTP/2\>](/it/nodejs/api/http2#settings-object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback che viene chiamato una volta che la sessione è connessa o subito se la sessione è già connessa.
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
    - `settings` [\<Oggetto Impostazioni HTTP/2\>](/it/nodejs/api/http2#settings-object) L'oggetto `settings` aggiornato.
    - `duration` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Aggiorna le impostazioni locali correnti per questa `Http2Session` e invia un nuovo frame `SETTINGS` al peer HTTP/2 connesso.

Una volta chiamato, la proprietà `http2session.pendingSettingsAck` sarà `true` mentre la sessione è in attesa che il peer remoto riconosca le nuove impostazioni.

Le nuove impostazioni non diventeranno effettive fino a quando non viene ricevuto il riconoscimento `SETTINGS` e viene emesso l'evento `'localSettings'`. È possibile inviare più frame `SETTINGS` mentre il riconoscimento è ancora in sospeso.

#### `http2session.type` {#http2sessiontype}

**Aggiunto in: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`http2session.type` sarà uguale a `http2.constants.NGHTTP2_SESSION_SERVER` se questa istanza di `Http2Session` è un server, e `http2.constants.NGHTTP2_SESSION_CLIENT` se l'istanza è un client.

#### `http2session.unref()` {#http2sessionunref}

**Aggiunto in: v9.4.0**

Chiama [`unref()`](/it/nodejs/api/net#socketunref) sull'istanza di [`net.Socket`](/it/nodejs/api/net#class-netsocket) sottostante di questa `Http2Session`.


### Classe: `ServerHttp2Session` {#class-serverhttp2session}

**Aggiunto in: v8.4.0**

- Estende: [\<Http2Session\>](/it/nodejs/api/http2#class-http2session)

#### `serverhttp2session.altsvc(alt, originOrStream)` {#serverhttp2sessionaltsvcalt-originorstream}

**Aggiunto in: v9.4.0**

- `alt` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una descrizione della configurazione del servizio alternativo come definito da [RFC 7838](https://tools.ietf.org/html/rfc7838).
- `originOrStream` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Sia una stringa URL che specifica l'origine (o un `Oggetto` con una proprietà `origin`) sia l'identificatore numerico di un `Http2Stream` attivo come dato dalla proprietà `http2stream.id`.

Invia un frame `ALTSVC` (come definito da [RFC 7838](https://tools.ietf.org/html/rfc7838)) al client connesso.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
server.on('session', (session) => {
  // Imposta altsvc per l'origine https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Imposta altsvc per un flusso specifico
  stream.session.altsvc('h2=":8000"', stream.id);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
server.on('session', (session) => {
  // Imposta altsvc per l'origine https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Imposta altsvc per un flusso specifico
  stream.session.altsvc('h2=":8000"', stream.id);
});
```
:::

L'invio di un frame `ALTSVC` con un ID di flusso specifico indica che il servizio alternativo è associato all'origine del dato `Http2Stream`.

La stringa `alt` e l'origine *devono* contenere solo byte ASCII e sono interpretate rigorosamente come una sequenza di byte ASCII. Il valore speciale `'clear'` può essere passato per cancellare qualsiasi servizio alternativo precedentemente impostato per un dato dominio.

Quando una stringa viene passata per l'argomento `originOrStream`, verrà analizzata come URL e l'origine verrà derivata. Ad esempio, l'origine per l'URL HTTP `'https://example.org/foo/bar'` è la stringa ASCII `'https://example.org'`. Verrà generato un errore se la stringa fornita non può essere analizzata come URL o se non è possibile derivare un'origine valida.

Un oggetto `URL`, o qualsiasi oggetto con una proprietà `origin`, può essere passato come `originOrStream`, nel qual caso verrà utilizzato il valore della proprietà `origin`. Il valore della proprietà `origin` *deve* essere un'origine ASCII serializzata correttamente.


#### Specificare servizi alternativi {#specifying-alternative-services}

Il formato del parametro `alt` è strettamente definito dalla [RFC 7838](https://tools.ietf.org/html/rfc7838) come una stringa ASCII contenente un elenco delimitato da virgole di protocolli "alternativi" associati a un host e una porta specifici.

Ad esempio, il valore `'h2="example.org:81"'` indica che il protocollo HTTP/2 è disponibile sull'host `'example.org'` sulla porta TCP/IP 81. L'host e la porta *devono* essere contenuti all'interno dei caratteri di virgolette (`"`).

È possibile specificare più alternative, ad esempio: `'h2="example.org:81", h2=":82"'`.

L'identificatore del protocollo (`'h2'` negli esempi) può essere qualsiasi [ID di protocollo ALPN](https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml#alpn-protocol-ids) valido.

La sintassi di questi valori non è convalidata dall'implementazione di Node.js e viene passata così come fornita dall'utente o ricevuta dal peer.

#### `serverhttp2session.origin(...origins)` {#serverhttp2sessionoriginorigins}

**Aggiunto in: v10.12.0**

- `origins` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Una o più stringhe URL passate come argomenti separati.

Invia un frame `ORIGIN` (come definito da [RFC 8336](https://tools.ietf.org/html/rfc8336)) al client connesso per pubblicizzare l'insieme di origini per le quali il server è in grado di fornire risposte autorevoli.



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

Quando una stringa viene passata come `origin`, verrà analizzata come un URL e l'origine verrà derivata. Ad esempio, l'origine per l'URL HTTP `'https://example.org/foo/bar'` è la stringa ASCII `'https://example.org'`. Verrà generato un errore se la stringa fornita non può essere analizzata come un URL o se non è possibile derivare un'origine valida.

Un oggetto `URL`, o qualsiasi oggetto con una proprietà `origin`, può essere passato come `origin`, nel qual caso verrà utilizzato il valore della proprietà `origin`. Il valore della proprietà `origin` *deve* essere un'origine ASCII serializzata correttamente.

In alternativa, è possibile utilizzare l'opzione `origins` quando si crea un nuovo server HTTP/2 utilizzando il metodo `http2.createSecureServer()`:



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


### Classe: `ClientHttp2Session` {#class-clienthttp2session}

**Aggiunto in: v8.4.0**

- Estende: [\<Http2Session\>](/it/nodejs/api/http2#class-http2session)

#### Evento: `'altsvc'` {#event-altsvc}

**Aggiunto in: v9.4.0**

- `alt` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `origin` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `streamId` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'evento `'altsvc'` viene emesso ogni volta che un frame `ALTSVC` viene ricevuto dal client. L'evento viene emesso con il valore `ALTSVC`, l'origine e l'ID del flusso. Se non viene fornita alcuna `origin` nel frame `ALTSVC`, `origin` sarà una stringa vuota.

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

#### Evento: `'origin'` {#event-origin}

**Aggiunto in: v10.12.0**

- `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'evento `'origin'` viene emesso ogni volta che un frame `ORIGIN` viene ricevuto dal client. L'evento viene emesso con un array di stringhe `origin`. `http2session.originSet` verrà aggiornato per includere le origini ricevute.

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

L'evento `'origin'` viene emesso solo quando si utilizza una connessione TLS sicura.


#### `clienthttp2session.request(headers[, options])` {#clienthttp2sessionrequestheaders-options}

**Aggiunto in: v8.4.0**

-  `headers` [\<HTTP/2 Headers Object\>](/it/nodejs/api/http2#headers-object)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se il lato *scrivibile* dell'`Http2Stream` deve essere chiuso inizialmente, come quando si invia una richiesta `GET` che non dovrebbe prevedere un corpo payload.
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true` e `parent` identifica uno Stream padre, lo stream creato diventa l'unica dipendenza diretta del padre, con tutti gli altri dipendenti esistenti che diventano dipendenti dallo stream appena creato. **Predefinito:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica l'identificatore numerico di uno stream da cui dipende lo stream appena creato.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica la dipendenza relativa di uno stream rispetto ad altri stream con lo stesso `parent`. Il valore è un numero compreso tra `1` e `256` (inclusi).
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, l'`Http2Stream` emetterà l'evento `'wantTrailers'` dopo che è stato inviato l'ultimo frame `DATA`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Un AbortSignal che può essere utilizzato per interrompere una richiesta in corso.


-  Restituisce: [\<ClientHttp2Stream\>](/it/nodejs/api/http2#class-clienthttp2stream)

Solo per le istanze `Http2Session` del Client HTTP/2, `http2session.request()` crea e restituisce un'istanza `Http2Stream` che può essere utilizzata per inviare una richiesta HTTP/2 al server connesso.

Quando viene creata per la prima volta una `ClientHttp2Session`, il socket potrebbe non essere ancora connesso. Se `clienthttp2session.request()` viene chiamato durante questo periodo, la richiesta effettiva verrà posticipata fino a quando il socket non sarà pronto per l'uso. Se la `session` viene chiusa prima che la richiesta effettiva venga eseguita, viene generato un `ERR_HTTP2_GOAWAY_SESSION`.

Questo metodo è disponibile solo se `http2session.type` è uguale a `http2.constants.NGHTTP2_SESSION_CLIENT`.



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

Quando l'opzione `options.waitForTrailers` è impostata, l'evento `'wantTrailers'` viene emesso immediatamente dopo aver accodato l'ultimo blocco di dati payload da inviare. Il metodo `http2stream.sendTrailers()` può quindi essere chiamato per inviare gli header finali al peer.

Quando `options.waitForTrailers` è impostato, l'`Http2Stream` non si chiuderà automaticamente quando viene trasmesso il frame `DATA` finale. Il codice utente deve chiamare `http2stream.sendTrailers()` o `http2stream.close()` per chiudere l'`Http2Stream`.

Quando `options.signal` è impostato con un `AbortSignal` e quindi viene chiamato `abort` sul `AbortController` corrispondente, la richiesta emetterà un evento `'error'` con un errore `AbortError`.

Gli pseudo-header `:method` e `:path` non sono specificati all'interno di `headers`, rispettivamente per impostazione predefinita:

- `:method` = `'GET'`
- `:path` = `/`


### Classe: `Http2Stream` {#class-http2stream}

**Aggiunto in: v8.4.0**

- Estende: [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Ogni istanza della classe `Http2Stream` rappresenta un flusso di comunicazione HTTP/2 bidirezionale su un'istanza `Http2Session`. Ogni singola `Http2Session` può avere fino a 2-1 istanze `Http2Stream` durante la sua vita.

Il codice utente non costruirà direttamente istanze `Http2Stream`. Piuttosto, queste vengono create, gestite e fornite al codice utente tramite l'istanza `Http2Session`. Sul server, le istanze `Http2Stream` vengono create in risposta a una richiesta HTTP in entrata (e consegnate al codice utente tramite l'evento `'stream'`), oppure in risposta a una chiamata al metodo `http2stream.pushStream()`. Sul client, le istanze `Http2Stream` vengono create e restituite quando viene chiamato il metodo `http2session.request()`, oppure in risposta a un evento `'push'` in entrata.

La classe `Http2Stream` è una base per le classi [`ServerHttp2Stream`](/it/nodejs/api/http2#class-serverhttp2stream) e [`ClientHttp2Stream`](/it/nodejs/api/http2#class-clienthttp2stream), ognuna delle quali viene utilizzata specificamente dal lato Server o Client, rispettivamente.

Tutte le istanze `Http2Stream` sono flussi [`Duplex`](/it/nodejs/api/stream#class-streamduplex). Il lato `Writable` del `Duplex` viene utilizzato per inviare dati al peer connesso, mentre il lato `Readable` viene utilizzato per ricevere dati inviati dal peer connesso.

La codifica dei caratteri di testo predefinita per un `Http2Stream` è UTF-8. Quando si utilizza un `Http2Stream` per inviare testo, utilizzare l'intestazione `'content-type'` per impostare la codifica dei caratteri.

```js [ESM]
stream.respond({
  'content-type': 'text/html; charset=utf-8',
  ':status': 200,
});
```
#### Ciclo di vita di `Http2Stream` {#http2stream-lifecycle}

##### Creazione {#creation}

Sul lato server, le istanze di [`ServerHttp2Stream`](/it/nodejs/api/http2#class-serverhttp2stream) vengono create quando:

- Viene ricevuto un nuovo frame `HEADERS` HTTP/2 con un ID flusso precedentemente non utilizzato;
- Viene chiamato il metodo `http2stream.pushStream()`.

Sul lato client, le istanze di [`ClientHttp2Stream`](/it/nodejs/api/http2#class-clienthttp2stream) vengono create quando viene chiamato il metodo `http2session.request()`.

Sul client, l'istanza `Http2Stream` restituita da `http2session.request()` potrebbe non essere immediatamente pronta per l'uso se la `Http2Session` padre non è stata ancora completamente stabilita. In tali casi, le operazioni chiamate su `Http2Stream` verranno memorizzate nel buffer fino all'emissione dell'evento `'ready'`. Il codice utente raramente, se non mai, deve gestire direttamente l'evento `'ready'`. Lo stato di pronto di un `Http2Stream` può essere determinato controllando il valore di `http2stream.id`. Se il valore è `undefined`, il flusso non è ancora pronto per l'uso.


##### Distruzione {#destruction}

Tutte le istanze di [`Http2Stream`](/it/nodejs/api/http2#class-http2stream) vengono distrutte quando:

- Un frame `RST_STREAM` per lo stream viene ricevuto dal peer connesso e (solo per gli stream client) i dati in sospeso sono stati letti.
- Viene chiamato il metodo `http2stream.close()` e (solo per gli stream client) i dati in sospeso sono stati letti.
- Vengono chiamati i metodi `http2stream.destroy()` o `http2session.destroy()`.

Quando un'istanza `Http2Stream` viene distrutta, verrà effettuato un tentativo di inviare un frame `RST_STREAM` al peer connesso.

Quando l'istanza `Http2Stream` viene distrutta, verrà emesso l'evento `'close'`. Poiché `Http2Stream` è un'istanza di `stream.Duplex`, verrà emesso anche l'evento `'end'` se i dati dello stream sono attualmente in flusso. L'evento `'error'` può anche essere emesso se `http2stream.destroy()` è stato chiamato con un `Error` passato come primo argomento.

Dopo che `Http2Stream` è stato distrutto, la proprietà `http2stream.destroyed` sarà `true` e la proprietà `http2stream.rstCode` specificherà il codice di errore `RST_STREAM`. L'istanza `Http2Stream` non è più utilizzabile una volta distrutta.

#### Evento: `'aborted'` {#event-aborted}

**Aggiunto in: v8.4.0**

L'evento `'aborted'` viene emesso ogni volta che un'istanza `Http2Stream` viene interrotta in modo anomalo a metà della comunicazione. Il suo listener non si aspetta alcun argomento.

L'evento `'aborted'` verrà emesso solo se il lato scrivibile di `Http2Stream` non è stato terminato.

#### Evento: `'close'` {#event-close_1}

**Aggiunto in: v8.4.0**

L'evento `'close'` viene emesso quando `Http2Stream` viene distrutto. Una volta emesso questo evento, l'istanza `Http2Stream` non è più utilizzabile.

Il codice di errore HTTP/2 utilizzato quando si chiude lo stream può essere recuperato utilizzando la proprietà `http2stream.rstCode`. Se il codice è un valore diverso da `NGHTTP2_NO_ERROR` (`0`), sarà stato emesso anche un evento `'error'`.

#### Evento: `'error'` {#event-error_1}

**Aggiunto in: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

L'evento `'error'` viene emesso quando si verifica un errore durante l'elaborazione di un `Http2Stream`.


#### Evento: `'frameError'` {#event-frameerror_1}

**Aggiunto in: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il tipo di frame.
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il codice di errore.
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID del flusso (o `0` se il frame non è associato a un flusso).

L'evento `'frameError'` viene emesso quando si verifica un errore durante il tentativo di inviare un frame. Quando viene richiamata, la funzione handler riceverà un argomento intero che identifica il tipo di frame e un argomento intero che identifica il codice di errore. L'istanza `Http2Stream` verrà distrutta immediatamente dopo l'emissione dell'evento `'frameError'`.

#### Evento: `'ready'` {#event-ready}

**Aggiunto in: v8.4.0**

L'evento `'ready'` viene emesso quando `Http2Stream` è stato aperto, gli è stato assegnato un `id` e può essere utilizzato. Il listener non prevede argomenti.

#### Evento: `'timeout'` {#event-timeout_1}

**Aggiunto in: v8.4.0**

L'evento `'timeout'` viene emesso quando non viene ricevuta alcuna attività per questo `Http2Stream` entro il numero di millisecondi impostato utilizzando `http2stream.setTimeout()`. Il suo listener non prevede argomenti.

#### Evento: `'trailers'` {#event-trailers}

**Aggiunto in: v8.4.0**

- `headers` [\<Oggetto Intestazioni HTTP/2\>](/it/nodejs/api/http2#headers-object) Un oggetto che descrive le intestazioni
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) I flag numerici associati

L'evento `'trailers'` viene emesso quando viene ricevuto un blocco di intestazioni associato ai campi dell'intestazione di chiusura. Il callback del listener viene passato l'[Oggetto Intestazioni HTTP/2](/it/nodejs/api/http2#headers-object) e i flag associati alle intestazioni.

Questo evento potrebbe non essere emesso se `http2stream.end()` viene chiamato prima che vengano ricevuti i trailer e i dati in entrata non vengono letti o ascoltati.

```js [ESM]
stream.on('trailers', (headers, flags) => {
  console.log(headers);
});
```


#### Evento: `'wantTrailers'` {#event-wanttrailers}

**Aggiunto in: v10.0.0**

L'evento `'wantTrailers'` viene emesso quando `Http2Stream` ha accodato il frame `DATA` finale da inviare su un frame e `Http2Stream` è pronto per inviare gli header di coda. Quando si avvia una richiesta o una risposta, l'opzione `waitForTrailers` deve essere impostata affinché questo evento venga emesso.

#### `http2stream.aborted` {#http2streamaborted}

**Aggiunto in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Impostato su `true` se l'istanza di `Http2Stream` è stata interrotta in modo anomalo. Quando impostato, l'evento `'aborted'` sarà stato emesso.

#### `http2stream.bufferSize` {#http2streambuffersize}

**Aggiunto in: v11.2.0, v10.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Questa proprietà mostra il numero di caratteri attualmente memorizzati nel buffer per essere scritti. Vedere [`net.Socket.bufferSize`](/it/nodejs/api/net#socketbuffersize) per i dettagli.

#### `http2stream.close(code[, callback])` {#http2streamclosecode-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Intero a 32 bit senza segno che identifica il codice di errore. **Predefinito:** `http2.constants.NGHTTP2_NO_ERROR` (`0x00`).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione opzionale registrata per ascoltare l'evento `'close'`.

Chiude l'istanza `Http2Stream` inviando un frame `RST_STREAM` al peer HTTP/2 connesso.

#### `http2stream.closed` {#http2streamclosed}

**Aggiunto in: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Impostato su `true` se l'istanza `Http2Stream` è stata chiusa.

#### `http2stream.destroyed` {#http2streamdestroyed}

**Aggiunto in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Impostato su `true` se l'istanza `Http2Stream` è stata distrutta e non è più utilizzabile.


#### `http2stream.endAfterHeaders` {#http2streamendafterheaders}

**Aggiunto in: v10.11.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Impostato a `true` se il flag `END_STREAM` è stato impostato nella richiesta o nel frame HEADERS di risposta ricevuto, indicando che nessun dato aggiuntivo dovrebbe essere ricevuto e il lato leggibile di `Http2Stream` sarà chiuso.

#### `http2stream.id` {#http2streamid}

**Aggiunto in: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

L'identificatore numerico dello stream di questa istanza di `Http2Stream`. Impostato su `undefined` se l'identificatore dello stream non è ancora stato assegnato.

#### `http2stream.pending` {#http2streampending}

**Aggiunto in: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Impostato su `true` se all'istanza di `Http2Stream` non è ancora stato assegnato un identificatore numerico di stream.

#### `http2stream.priority(options)` {#http2streampriorityoptions}

**Aggiunto in: v8.4.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true` e `parent` identifica uno Stream padre, questo stream diventa l'unica dipendenza diretta del padre, con tutti gli altri dipendenti esistenti resi dipendenti da questo stream. **Predefinito:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica l'identificatore numerico di uno stream da cui dipende questo stream.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica la dipendenza relativa di uno stream in relazione ad altri stream con lo stesso `parent`. Il valore è un numero compreso tra `1` e `256` (inclusi).
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, modifica la priorità localmente senza inviare un frame `PRIORITY` al peer connesso.

Aggiorna la priorità per questa istanza di `Http2Stream`.


#### `http2stream.rstCode` {#http2streamrstcode}

**Aggiunto in: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Impostato al [codice di errore](/it/nodejs/api/http2#error-codes-for-rst_stream-and-goaway) `RST_STREAM` riportato quando `Http2Stream` viene distrutto dopo aver ricevuto un frame `RST_STREAM` dal peer connesso, aver chiamato `http2stream.close()` o `http2stream.destroy()`. Sarà `undefined` se `Http2Stream` non è stato chiuso.

#### `http2stream.sentHeaders` {#http2streamsentheaders}

**Aggiunto in: v9.5.0**

- [\<Oggetto Intestazioni HTTP/2\>](/it/nodejs/api/http2#headers-object)

Un oggetto contenente le intestazioni in uscita inviate per questo `Http2Stream`.

#### `http2stream.sentInfoHeaders` {#http2streamsentinfoheaders}

**Aggiunto in: v9.5.0**

- [\<Oggetto Intestazioni HTTP/2[]\>](/it/nodejs/api/http2#headers-object)

Un array di oggetti contenenti le intestazioni informative (aggiuntive) in uscita inviate per questo `Http2Stream`.

#### `http2stream.sentTrailers` {#http2streamsenttrailers}

**Aggiunto in: v9.5.0**

- [\<Oggetto Intestazioni HTTP/2\>](/it/nodejs/api/http2#headers-object)

Un oggetto contenente i trailer in uscita inviati per questo `HttpStream`.

#### `http2stream.session` {#http2streamsession}

**Aggiunto in: v8.4.0**

- [\<Http2Session\>](/it/nodejs/api/http2#class-http2session)

Un riferimento all'istanza `Http2Session` che possiede questo `Http2Stream`. Il valore sarà `undefined` dopo che l'istanza `Http2Stream` viene distrutta.

#### `http2stream.setTimeout(msecs, callback)` {#http2streamsettimeoutmsecs-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)



::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const client = connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = constants;
const req = client.request({ ':path': '/' });

// Annulla lo stream se non ci sono attività dopo 5 secondi
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = http2.constants;
const req = client.request({ ':path': '/' });

// Annulla lo stream se non ci sono attività dopo 5 secondi
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```
:::


#### `http2stream.state` {#http2streamstate}

**Aggiunto in: v8.4.0**

Fornisce informazioni varie sullo stato corrente dell'`Http2Stream`.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte che il peer connesso può inviare per questo `Http2Stream` senza ricevere un `WINDOW_UPDATE`.
    - `state` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un flag che indica lo stato corrente di basso livello dell'`Http2Stream` come determinato da `nghttp2`.
    - `localClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` se questo `Http2Stream` è stato chiuso localmente.
    - `remoteClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` se questo `Http2Stream` è stato chiuso da remoto.
    - `sumDependencyWeight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La somma del peso di tutte le istanze `Http2Stream` che dipendono da questo `Http2Stream` come specificato utilizzando i frame `PRIORITY`.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il peso di priorità di questo `Http2Stream`.
  
 

Uno stato corrente di questo `Http2Stream`.

#### `http2stream.sendTrailers(headers)` {#http2streamsendtrailersheaders}

**Aggiunto in: v10.0.0**

- `headers` [\<Oggetto Intestazioni HTTP/2\>](/it/nodejs/api/http2#headers-object)

Invia un frame `HEADERS` finale al peer HTTP/2 connesso. Questo metodo farà sì che l'`Http2Stream` venga immediatamente chiuso e deve essere chiamato solo dopo che l'evento `'wantTrailers'` è stato emesso. Quando si invia una richiesta o si invia una risposta, l'opzione `options.waitForTrailers` deve essere impostata per mantenere l'`Http2Stream` aperto dopo il frame `DATA` finale in modo che i trailer possano essere inviati.



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

La specifica HTTP/1 vieta ai trailer di contenere campi di pseudo-intestazione HTTP/2 (ad esempio, `':method'`, `':path'`, ecc.).


### Classe: `ClientHttp2Stream` {#class-clienthttp2stream}

**Aggiunto in: v8.4.0**

- Estende [\<Http2Stream\>](/it/nodejs/api/http2#class-http2stream)

La classe `ClientHttp2Stream` è un'estensione di `Http2Stream` che viene utilizzata esclusivamente sui Client HTTP/2. Le istanze `Http2Stream` sul client forniscono eventi come `'response'` e `'push'` che sono rilevanti solo sul client.

#### Evento: `'continue'` {#event-continue}

**Aggiunto in: v8.5.0**

Emesso quando il server invia uno stato `100 Continue`, di solito perché la richiesta conteneva `Expect: 100-continue`. Questa è un'istruzione che il client deve inviare il corpo della richiesta.

#### Evento: `'headers'` {#event-headers}

**Aggiunto in: v8.4.0**

- `headers` [\<Oggetto Header HTTP/2\>](/it/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'evento `'headers'` viene emesso quando viene ricevuto un blocco aggiuntivo di header per uno stream, ad esempio quando viene ricevuto un blocco di header informativi `1xx`. Al callback del listener vengono passati l'[Oggetto Header HTTP/2](/it/nodejs/api/http2#headers-object) e i flag associati agli header.

```js [ESM]
stream.on('headers', (headers, flags) => {
  console.log(headers);
});
```
#### Evento: `'push'` {#event-push}

**Aggiunto in: v8.4.0**

- `headers` [\<Oggetto Header HTTP/2\>](/it/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'evento `'push'` viene emesso quando vengono ricevuti gli header di risposta per uno stream Server Push. Al callback del listener vengono passati l'[Oggetto Header HTTP/2](/it/nodejs/api/http2#headers-object) e i flag associati agli header.

```js [ESM]
stream.on('push', (headers, flags) => {
  console.log(headers);
});
```
#### Evento: `'response'` {#event-response}

**Aggiunto in: v8.4.0**

- `headers` [\<Oggetto Header HTTP/2\>](/it/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'evento `'response'` viene emesso quando è stato ricevuto un frame `HEADERS` di risposta per questo stream dal server HTTP/2 connesso. Il listener viene invocato con due argomenti: un `Object` contenente l'[Oggetto Header HTTP/2](/it/nodejs/api/http2#headers-object) ricevuto e i flag associati agli header.



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


### Classe: `ServerHttp2Stream` {#class-serverhttp2stream}

**Aggiunto in: v8.4.0**

- Estende: [\<Http2Stream\>](/it/nodejs/api/http2#class-http2stream)

La classe `ServerHttp2Stream` è un'estensione di [`Http2Stream`](/it/nodejs/api/http2#class-http2stream) che viene utilizzata esclusivamente sui server HTTP/2. Le istanze `Http2Stream` sul server forniscono metodi aggiuntivi come `http2stream.pushStream()` e `http2stream.respond()` che sono rilevanti solo sul server.

#### `http2stream.additionalHeaders(headers)` {#http2streamadditionalheadersheaders}

**Aggiunto in: v8.4.0**

- `headers` [\<Oggetto di intestazioni HTTP/2\>](/it/nodejs/api/http2#headers-object)

Invia un frame `HEADERS` informativo aggiuntivo al peer HTTP/2 connesso.

#### `http2stream.headersSent` {#http2streamheaderssent}

**Aggiunto in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Vero se le intestazioni sono state inviate, falso altrimenti (sola lettura).

#### `http2stream.pushAllowed` {#http2streampushallowed}

**Aggiunto in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Proprietà di sola lettura mappata al flag `SETTINGS_ENABLE_PUSH` del frame `SETTINGS` più recente del client remoto. Sarà `true` se il peer remoto accetta flussi push, `false` altrimenti. Le impostazioni sono le stesse per ogni `Http2Stream` nella stessa `Http2Session`.

#### `http2stream.pushStream(headers[, options], callback)` {#http2streampushstreamheaders-options-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- `headers` [\<Oggetto di intestazioni HTTP/2\>](/it/nodejs/api/http2#headers-object)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true` e `parent` identifica un flusso padre, il flusso creato diventa l'unica dipendenza diretta del padre, con tutte le altre dipendenze esistenti rese dipendenti dal flusso appena creato. **Predefinito:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica l'identificatore numerico di un flusso da cui dipende il flusso appena creato.
  
 
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback che viene chiamato una volta che il flusso push è stato avviato.
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `pushStream` [\<ServerHttp2Stream\>](/it/nodejs/api/http2#class-serverhttp2stream) L'oggetto `pushStream` restituito.
    - `headers` [\<Oggetto di intestazioni HTTP/2\>](/it/nodejs/api/http2#headers-object) Oggetto di intestazioni con cui è stato avviato `pushStream`.
  
 

Avvia un flusso push. Il callback viene invocato con la nuova istanza `Http2Stream` creata per il flusso push passata come secondo argomento, o un `Error` passato come primo argomento.



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

Impostare il peso di un flusso push non è consentito nel frame `HEADERS`. Passare un valore `weight` a `http2stream.priority` con l'opzione `silent` impostata su `true` per abilitare il bilanciamento della larghezza di banda lato server tra flussi simultanei.

Chiamare `http2stream.pushStream()` dall'interno di un flusso push non è consentito e genererà un errore.


#### `http2stream.respond([headers[, options]])` {#http2streamrespondheaders-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.5.0, v12.19.0 | Consente l'impostazione esplicita degli header di data. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- `headers` [\<Oggetto Header HTTP/2\>](/it/nodejs/api/http2#headers-object)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Imposta su `true` per indicare che la risposta non includerà dati payload.
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, l'`Http2Stream` emetterà l'evento `'wantTrailers'` dopo che è stato inviato il frame `DATA` finale.




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

Inizia una risposta. Quando l'opzione `options.waitForTrailers` è impostata, l'evento `'wantTrailers'` verrà emesso immediatamente dopo aver accodato l'ultimo blocco di dati payload da inviare. Il metodo `http2stream.sendTrailers()` può quindi essere utilizzato per inviare i campi header finali al peer.

Quando `options.waitForTrailers` è impostato, l'`Http2Stream` non si chiuderà automaticamente quando viene trasmesso il frame `DATA` finale. Il codice utente deve chiamare `http2stream.sendTrailers()` o `http2stream.close()` per chiudere l'`Http2Stream`.

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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.5.0, v12.19.0 | Consente di impostare esplicitamente le intestazioni della data. |
| v12.12.0 | L'opzione `fd` ora può essere un `FileHandle`. |
| v10.0.0 | È ora supportato qualsiasi descrittore di file leggibile, non necessariamente per un file normale. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) Un descrittore di file leggibile.
- `headers` [\<Oggetto Intestazioni HTTP/2\>](/it/nodejs/api/http2#headers-object)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando è `true`, l'`Http2Stream` emetterà l'evento `'wantTrailers'` dopo che è stato inviato l'ultimo frame `DATA`.
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La posizione di offset da cui iniziare la lettura.
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantità di dati dall'fd da inviare.
  
 

Inizia una risposta i cui dati vengono letti dal descrittore di file specificato. Non viene eseguita alcuna convalida sul descrittore di file specificato. Se si verifica un errore durante il tentativo di leggere i dati utilizzando il descrittore di file, l'`Http2Stream` verrà chiuso utilizzando un frame `RST_STREAM` utilizzando il codice `INTERNAL_ERROR` standard.

Quando utilizzato, l'interfaccia `Duplex` dell'oggetto `Http2Stream` verrà chiusa automaticamente.

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

La funzione opzionale `options.statCheck` può essere specificata per dare al codice utente l'opportunità di impostare ulteriori intestazioni di contenuto in base ai dettagli `fs.Stat` dell'fd specificato. Se viene fornita la funzione `statCheck`, il metodo `http2stream.respondWithFD()` eseguirà una chiamata `fs.fstat()` per raccogliere i dettagli sul descrittore di file fornito.

Le opzioni `offset` e `length` possono essere utilizzate per limitare la risposta a un sottoinsieme di intervallo specifico. Questo può essere utilizzato, ad esempio, per supportare le richieste HTTP Range.

Il descrittore di file o `FileHandle` non viene chiuso quando il flusso viene chiuso, quindi dovrà essere chiuso manualmente una volta che non è più necessario. L'utilizzo dello stesso descrittore di file contemporaneamente per più flussi non è supportato e può comportare la perdita di dati. Il riutilizzo di un descrittore di file dopo che un flusso è terminato è supportato.

Quando l'opzione `options.waitForTrailers` è impostata, l'evento `'wantTrailers'` verrà emesso immediatamente dopo aver accodato l'ultimo blocco di dati payload da inviare. Il metodo `http2stream.sendTrailers()` può quindi essere utilizzato per inviare i campi di intestazione finali al peer.

Quando `options.waitForTrailers` è impostato, l'`Http2Stream` non si chiuderà automaticamente quando viene trasmesso il frame `DATA` finale. Il codice utente *deve* chiamare `http2stream.sendTrailers()` o `http2stream.close()` per chiudere l'`Http2Stream`.

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

::: info [Cronologia]
| Versione | Modifiche                                                               |
| :------- | :---------------------------------------------------------------------- |
| v14.5.0, v12.19.0 | Consente di impostare esplicitamente le intestazioni della data.               |
| v10.0.0  | Qualsiasi file leggibile, non necessariamente un file normale, è ora supportato. |
| v8.4.0   | Aggiunto in: v8.4.0                                                     |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `headers` [\<Oggetto Intestazioni HTTP/2\>](/it/nodejs/api/http2#headers-object)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `onError` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione di callback invocata in caso di errore prima dell'invio.
    - `waitForTrailers` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, l'`Http2Stream` emetterà l'evento `'wantTrailers'` dopo che è stato inviato l'ultimo frame `DATA`.
    - `offset` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La posizione di offset da cui iniziare la lettura.
    - `length` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantità di dati da inviare dal fd.

Invia un file normale come risposta. Il `path` deve specificare un file normale o un evento `'error'` verrà emesso sull'oggetto `Http2Stream`.

Quando utilizzato, l'interfaccia `Duplex` dell'oggetto `Http2Stream` verrà chiusa automaticamente.

La funzione opzionale `options.statCheck` può essere specificata per dare al codice utente l'opportunità di impostare intestazioni di contenuto aggiuntive basate sui dettagli `fs.Stat` del file specificato:

Se si verifica un errore durante il tentativo di leggere i dati del file, l'`Http2Stream` verrà chiuso utilizzando un frame `RST_STREAM` utilizzando il codice `INTERNAL_ERROR` standard. Se la callback `onError` è definita, allora verrà chiamata. Altrimenti, lo stream verrà distrutto.

Esempio di utilizzo di un percorso di file:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() può generare un errore se lo stream è stato distrutto dall'altra parte.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Esegui la gestione effettiva degli errori.
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
    // stream.respond() può generare un errore se lo stream è stato distrutto dall'altra parte.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Esegui la gestione effettiva degli errori.
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

La funzione `options.statCheck` può anche essere utilizzata per annullare l'operazione di invio restituendo `false`. Ad esempio, una richiesta condizionale può controllare i risultati stat per determinare se il file è stato modificato per restituire una risposta `304` appropriata:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // Controlla lo stat qui...
    stream.respond({ ':status': 304 });
    return false; // Annulla l'operazione di invio
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
    // Controlla lo stat qui...
    stream.respond({ ':status': 304 });
    return false; // Annulla l'operazione di invio
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```
:::

Il campo di intestazione `content-length` verrà impostato automaticamente.

Le opzioni `offset` e `length` possono essere utilizzate per limitare la risposta a un sottoinsieme di intervallo specifico. Questo può essere utilizzato, ad esempio, per supportare le richieste di intervallo HTTP.

La funzione `options.onError` può essere utilizzata anche per gestire tutti gli errori che potrebbero verificarsi prima che venga avviata la consegna del file. Il comportamento predefinito è distruggere lo stream.

Quando l'opzione `options.waitForTrailers` è impostata, l'evento `'wantTrailers'` verrà emesso immediatamente dopo aver accodato l'ultimo blocco di dati payload da inviare. Il metodo `http2stream.sendTrailers()` può quindi essere utilizzato per inviare campi di intestazione finali al peer.

Quando `options.waitForTrailers` è impostato, l'`Http2Stream` non si chiuderà automaticamente quando viene trasmesso l'ultimo frame `DATA`. Il codice utente deve chiamare `http2stream.sendTrailers()` o `http2stream.close()` per chiudere l'`Http2Stream`.

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


### Classe: `Http2Server` {#class-http2server}

**Aggiunto in: v8.4.0**

- Estende: [\<net.Server\>](/it/nodejs/api/net#class-netserver)

Le istanze di `Http2Server` vengono create utilizzando la funzione `http2.createServer()`. La classe `Http2Server` non viene esportata direttamente dal modulo `node:http2`.

#### Evento: `'checkContinue'` {#event-checkcontinue}

**Aggiunto in: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/it/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/it/nodejs/api/http2#class-http2http2serverresponse)

Se un listener [`'request'`](/it/nodejs/api/http2#event-request) è registrato o [`http2.createServer()`](/it/nodejs/api/http2#http2createserveroptions-onrequesthandler) riceve una funzione di callback, l'evento `'checkContinue'` viene emesso ogni volta che viene ricevuta una richiesta con un HTTP `Expect: 100-continue`. Se questo evento non viene ascoltato, il server risponderà automaticamente con uno stato `100 Continue` come appropriato.

La gestione di questo evento comporta la chiamata a [`response.writeContinue()`](/it/nodejs/api/http2#responsewritecontinue) se il client deve continuare a inviare il corpo della richiesta, o la generazione di una risposta HTTP appropriata (ad esempio, 400 Bad Request) se il client non deve continuare a inviare il corpo della richiesta.

Quando questo evento viene emesso e gestito, l'evento [`'request'`](/it/nodejs/api/http2#event-request) non verrà emesso.

#### Evento: `'connection'` {#event-connection}

**Aggiunto in: v8.4.0**

- `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Questo evento viene emesso quando viene stabilito un nuovo flusso TCP. `socket` è in genere un oggetto di tipo [`net.Socket`](/it/nodejs/api/net#class-netsocket). Di solito gli utenti non vorranno accedere a questo evento.

Questo evento può anche essere emesso esplicitamente dagli utenti per iniettare connessioni nel server HTTP. In tal caso, è possibile passare qualsiasi flusso [`Duplex`](/it/nodejs/api/stream#class-streamduplex).

#### Evento: `'request'` {#event-request}

**Aggiunto in: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/it/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/it/nodejs/api/http2#class-http2http2serverresponse)

Emesso ogni volta che c'è una richiesta. Potrebbero esserci più richieste per sessione. Vedi la [API di compatibilità](/it/nodejs/api/http2#compatibility-api).


#### Evento: `'session'` {#event-session}

**Aggiunto in: v8.4.0**

- `session` [\<ServerHttp2Session\>](/it/nodejs/api/http2#class-serverhttp2session)

L'evento `'session'` viene emesso quando una nuova `Http2Session` viene creata da `Http2Server`.

#### Evento: `'sessionError'` {#event-sessionerror}

**Aggiunto in: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/it/nodejs/api/http2#class-serverhttp2session)

L'evento `'sessionError'` viene emesso quando un evento `'error'` viene emesso da un oggetto `Http2Session` associato all'`Http2Server`.

#### Evento: `'stream'` {#event-stream_1}

**Aggiunto in: v8.4.0**

- `stream` [\<Http2Stream\>](/it/nodejs/api/http2#class-http2stream) Un riferimento allo stream
- `headers` [\<Oggetto Intestazioni HTTP/2\>](/it/nodejs/api/http2#headers-object) Un oggetto che descrive le intestazioni
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) I flag numerici associati
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array contenente i nomi delle intestazioni non elaborate seguiti dai rispettivi valori.

L'evento `'stream'` viene emesso quando un evento `'stream'` è stato emesso da un `Http2Session` associato al server.

Vedere anche l'evento `'stream'` di [`Http2Session`](/it/nodejs/api/http2#event-stream).

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


#### Evento: `'timeout'` {#event-timeout_2}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.0.0 | Il timeout predefinito è cambiato da 120 secondi a 0 (nessun timeout). |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

L'evento `'timeout'` viene emesso quando non c'è attività sul Server per un determinato numero di millisecondi impostato utilizzando `http2server.setTimeout()`. **Predefinito:** 0 (nessun timeout)

#### `server.close([callback])` {#serverclosecallback}

**Aggiunto in: v8.4.0**

- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Impedisce al server di stabilire nuove sessioni. Questo non impedisce la creazione di nuovi stream di richieste a causa della natura persistente delle sessioni HTTP/2. Per arrestare il server in modo corretto, chiama [`http2session.close()`](/it/nodejs/api/http2#http2sessionclosecallback) su tutte le sessioni attive.

Se viene fornita una `callback`, non viene invocata fino a quando tutte le sessioni attive non sono state chiuse, anche se il server ha già smesso di consentire nuove sessioni. Vedi [`net.Server.close()`](/it/nodejs/api/net#serverclosecallback) per maggiori dettagli.

#### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Aggiunto in: v20.4.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Chiama [`server.close()`](/it/nodejs/api/http2#serverclosecallback) e restituisce una promise che si risolve quando il server è stato chiuso.

#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v13.0.0 | Il timeout predefinito è cambiato da 120 secondi a 0 (nessun timeout). |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- `msecs` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** 0 (nessun timeout)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<Http2Server\>](/it/nodejs/api/http2#class-http2server)

Utilizzato per impostare il valore di timeout per le richieste del server http2 e imposta una funzione di callback che viene chiamata quando non c'è attività sull'`Http2Server` dopo `msecs` millisecondi.

La callback fornita viene registrata come listener sull'evento `'timeout'`.

Nel caso in cui `callback` non sia una funzione, verrà generato un nuovo errore `ERR_INVALID_ARG_TYPE`.


#### `server.timeout` {#servertimeout}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.0.0 | Il timeout predefinito è cambiato da 120s a 0 (nessun timeout). |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Timeout in millisecondi. **Predefinito:** 0 (nessun timeout)

Il numero di millisecondi di inattività prima che un socket venga presunto come scaduto.

Un valore di `0` disabiliterà il comportamento di timeout sulle connessioni in entrata.

La logica di timeout del socket è impostata sulla connessione, quindi la modifica di questo valore influisce solo sulle nuove connessioni al server, non su quelle esistenti.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings}

**Aggiunto in: v15.1.0, v14.17.0**

- `settings` [\<Oggetto Impostazioni HTTP/2\>](/it/nodejs/api/http2#settings-object)

Utilizzato per aggiornare il server con le impostazioni fornite.

Genera `ERR_HTTP2_INVALID_SETTING_VALUE` per valori `settings` non validi.

Genera `ERR_INVALID_ARG_TYPE` per argomenti `settings` non validi.

### Classe: `Http2SecureServer` {#class-http2secureserver}

**Aggiunto in: v8.4.0**

- Estende: [\<tls.Server\>](/it/nodejs/api/tls#class-tlsserver)

Le istanze di `Http2SecureServer` vengono create utilizzando la funzione `http2.createSecureServer()`. La classe `Http2SecureServer` non viene esportata direttamente dal modulo `node:http2`.

#### Evento: `'checkContinue'` {#event-checkcontinue_1}

**Aggiunto in: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/it/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/it/nodejs/api/http2#class-http2http2serverresponse)

Se è registrato un listener [`'request'`](/it/nodejs/api/http2#event-request) o [`http2.createSecureServer()`](/it/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) fornisce una funzione di callback, l'evento `'checkContinue'` viene emesso ogni volta che viene ricevuta una richiesta con un HTTP `Expect: 100-continue`. Se questo evento non viene ascoltato, il server risponderà automaticamente con uno stato `100 Continue` come appropriato.

La gestione di questo evento implica la chiamata a [`response.writeContinue()`](/it/nodejs/api/http2#responsewritecontinue) se il client deve continuare a inviare il corpo della richiesta, o la generazione di una risposta HTTP appropriata (es. 400 Bad Request) se il client non deve continuare a inviare il corpo della richiesta.

Quando questo evento viene emesso e gestito, l'evento [`'request'`](/it/nodejs/api/http2#event-request) non verrà emesso.


#### Evento: `'connection'` {#event-connection_1}

**Aggiunto in: v8.4.0**

- `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Questo evento viene emesso quando viene stabilito un nuovo stream TCP, prima che inizi l'handshake TLS. `socket` è tipicamente un oggetto di tipo [`net.Socket`](/it/nodejs/api/net#class-netsocket). Di solito gli utenti non vorranno accedere a questo evento.

Questo evento può anche essere emesso esplicitamente dagli utenti per iniettare connessioni nel server HTTP. In tal caso, può essere passato qualsiasi stream [`Duplex`](/it/nodejs/api/stream#class-streamduplex).

#### Evento: `'request'` {#event-request_1}

**Aggiunto in: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/it/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/it/nodejs/api/http2#class-http2http2serverresponse)

Emesso ogni volta che c'è una richiesta. Potrebbero esserci più richieste per sessione. Vedi la [API di Compatibilità](/it/nodejs/api/http2#compatibility-api).

#### Evento: `'session'` {#event-session_1}

**Aggiunto in: v8.4.0**

- `session` [\<ServerHttp2Session\>](/it/nodejs/api/http2#class-serverhttp2session)

L'evento `'session'` viene emesso quando una nuova `Http2Session` viene creata dall'`Http2SecureServer`.

#### Evento: `'sessionError'` {#event-sessionerror_1}

**Aggiunto in: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/it/nodejs/api/http2#class-serverhttp2session)

L'evento `'sessionError'` viene emesso quando un evento `'error'` viene emesso da un oggetto `Http2Session` associato all'`Http2SecureServer`.

#### Evento: `'stream'` {#event-stream_2}

**Aggiunto in: v8.4.0**

- `stream` [\<Http2Stream\>](/it/nodejs/api/http2#class-http2stream) Un riferimento allo stream
- `headers` [\<Oggetto Intestazioni HTTP/2\>](/it/nodejs/api/http2#headers-object) Un oggetto che descrive le intestazioni
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) I flag numerici associati
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array contenente i nomi delle intestazioni raw seguiti dai rispettivi valori.

L'evento `'stream'` viene emesso quando un evento `'stream'` è stato emesso da una `Http2Session` associata al server.

Vedi anche l'evento `'stream'` di [`Http2Session`](/it/nodejs/api/http2#event-stream).

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


#### Evento: `'timeout'` {#event-timeout_3}

**Aggiunto in: v8.4.0**

L'evento `'timeout'` viene emesso quando non c'è attività sul Server per un determinato numero di millisecondi impostato usando `http2secureServer.setTimeout()`. **Predefinito:** 2 minuti.

#### Evento: `'unknownProtocol'` {#event-unknownprotocol}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Questo evento verrà emesso solo se il client non ha trasmesso un'estensione ALPN durante l'handshake TLS. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

L'evento `'unknownProtocol'` viene emesso quando un client che si connette non riesce a negoziare un protocollo consentito (ad esempio HTTP/2 o HTTP/1.1). L'handler dell'evento riceve il socket per la gestione. Se non è registrato alcun listener per questo evento, la connessione viene terminata. È possibile specificare un timeout utilizzando l'opzione `'unknownProtocolTimeout'` passata a [`http2.createSecureServer()`](/it/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler).

Nelle versioni precedenti di Node.js, questo evento veniva emesso se `allowHTTP1` è `false` e, durante l'handshake TLS, il client non invia un'estensione ALPN o invia un'estensione ALPN che non include HTTP/2 (`h2`). Le versioni più recenti di Node.js emettono questo evento solo se `allowHTTP1` è `false` e il client non invia un'estensione ALPN. Se il client invia un'estensione ALPN che non include HTTP/2 (o HTTP/1.1 se `allowHTTP1` è `true`), l'handshake TLS fallirà e non verrà stabilita alcuna connessione sicura.

Vedi l'[API di Compatibilità](/it/nodejs/api/http2#compatibility-api).

#### `server.close([callback])` {#serverclosecallback_1}

**Aggiunto in: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Impedisce al server di stabilire nuove sessioni. Ciò non impedisce la creazione di nuovi flussi di richiesta a causa della natura persistente delle sessioni HTTP/2. Per arrestare gradualmente il server, chiamare [`http2session.close()`](/it/nodejs/api/http2#http2sessionclosecallback) su tutte le sessioni attive.

Se viene fornito `callback`, non viene invocato finché tutte le sessioni attive non sono state chiuse, anche se il server ha già smesso di consentire nuove sessioni. Vedere [`tls.Server.close()`](/it/nodejs/api/tls#serverclosecallback) per maggiori dettagli.


#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback_1}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `120000` (2 minuti)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<Http2SecureServer\>](/it/nodejs/api/http2#class-http2secureserver)

Utilizzato per impostare il valore di timeout per le richieste del server sicuro http2 e imposta una funzione di callback che viene chiamata quando non c'è attività su `Http2SecureServer` dopo `msecs` millisecondi.

La callback fornita viene registrata come listener sull'evento `'timeout'`.

Nel caso in cui `callback` non sia una funzione, verrà generato un nuovo errore `ERR_INVALID_ARG_TYPE`.

#### `server.timeout` {#servertimeout_1}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.0.0 | Il timeout predefinito è cambiato da 120s a 0 (nessun timeout). |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Timeout in millisecondi. **Predefinito:** 0 (nessun timeout)

Il numero di millisecondi di inattività prima che si presuma che un socket sia scaduto.

Un valore di `0` disabiliterà il comportamento di timeout sulle connessioni in entrata.

La logica del timeout del socket è impostata sulla connessione, quindi la modifica di questo valore influisce solo sulle nuove connessioni al server, non su quelle esistenti.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings_1}

**Aggiunto in: v15.1.0, v14.17.0**

- `settings` [\<HTTP/2 Settings Object\>](/it/nodejs/api/http2#settings-object)

Utilizzato per aggiornare il server con le impostazioni fornite.

Genera `ERR_HTTP2_INVALID_SETTING_VALUE` per valori `settings` non validi.

Genera `ERR_INVALID_ARG_TYPE` per un argomento `settings` non valido.

### `http2.createServer([options][, onRequestHandler])` {#http2createserveroptions-onrequesthandler}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Aggiunto `streamResetBurst` e `streamResetRate`. |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` è stato reso equivalente a fornire `PADDING_STRATEGY_ALIGNED` e `selectPadding` è stato rimosso. |
| v13.3.0, v12.16.0 | Aggiunta l'opzione `maxSessionRejectedStreams` con un valore predefinito di 100. |
| v13.3.0, v12.16.0 | Aggiunta l'opzione `maxSessionInvalidFrames` con un valore predefinito di 1000. |
| v12.4.0 | Il parametro `options` ora supporta le opzioni `net.createServer()`. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Aggiunta l'opzione `unknownProtocolTimeout` con un valore predefinito di 10000. |
| v14.4.0, v12.18.0, v10.21.0 | Aggiunta l'opzione `maxSettings` con un valore predefinito di 32. |
| v9.6.0 | Aggiunta l'opzione `Http1IncomingMessage` e `Http1ServerResponse`. |
| v8.9.3 | Aggiunta l'opzione `maxOutstandingPings` con un limite predefinito di 10. |
| v8.9.3 | Aggiunta l'opzione `maxHeaderListPairs` con un limite predefinito di 128 coppie di intestazioni. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta la dimensione massima della tabella dinamica per la deflazione dei campi di intestazione. **Predefinito:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di voci di impostazioni per frame `SETTINGS`. Il valore minimo consentito è `1`. **Predefinito:** `32`.
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta la memoria massima che `Http2Session` è autorizzata a utilizzare. Il valore è espresso in termini di numero di megabyte, ad es. `1` equivale a 1 megabyte. Il valore minimo consentito è `1`. Questo è un limite basato sul credito, le istanze `Http2Stream` esistenti potrebbero causare il superamento di questo limite, ma le nuove istanze `Http2Stream` verranno rifiutate mentre questo limite viene superato. Il numero corrente di sessioni `Http2Stream`, l'utilizzo corrente della memoria delle tabelle di compressione delle intestazioni, i dati correnti in coda da inviare e i frame `PING` e `SETTINGS` non riconosciuti vengono tutti conteggiati ai fini del limite corrente. **Predefinito:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di voci di intestazione. Questo è simile a [`server.maxHeadersCount`](/it/nodejs/api/http#servermaxheaderscount) o [`request.maxHeadersCount`](/it/nodejs/api/http#requestmaxheaderscount) nel modulo `node:http`. Il valore minimo è `4`. **Predefinito:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di ping in sospeso, non riconosciuti. **Predefinito:** `10`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta la dimensione massima consentita per un blocco di intestazioni serializzato e compresso. I tentativi di inviare intestazioni che superano questo limite comporteranno l'emissione di un evento `'frameError'` e la chiusura e la distruzione dello stream. Sebbene questo imposti la dimensione massima consentita per l'intero blocco di intestazioni, `nghttp2` (la libreria http2 interna) ha un limite di `65536` per ogni coppia chiave/valore decompressa.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La strategia utilizzata per determinare la quantità di riempimento da utilizzare per i frame `HEADERS` e `DATA`. **Predefinito:** `http2.constants.PADDING_STRATEGY_NONE`. Il valore può essere uno tra:
    - `http2.constants.PADDING_STRATEGY_NONE`: Non viene applicato alcun riempimento.
    - `http2.constants.PADDING_STRATEGY_MAX`: Viene applicata la quantità massima di riempimento, determinata dall'implementazione interna.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: Tenta di applicare un riempimento sufficiente per garantire che la lunghezza totale del frame, inclusa l'intestazione di 9 byte, sia un multiplo di 8. Per ogni frame, esiste un numero massimo consentito di byte di riempimento determinato dallo stato e dalle impostazioni correnti del controllo del flusso. Se questo massimo è inferiore alla quantità calcolata necessaria per garantire l'allineamento, viene utilizzato il massimo e la lunghezza totale del frame non è necessariamente allineata a 8 byte.


    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di stream simultanei per il peer remoto come se fosse stato ricevuto un frame `SETTINGS`. Verrà sovrascritto se il peer remoto imposta il proprio valore per `maxConcurrentStreams`. **Predefinito:** `100`.
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di frame non validi che saranno tollerati prima che la sessione venga chiusa. **Predefinito:** `1000`.
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di stream rifiutati alla creazione che saranno tollerati prima che la sessione venga chiusa. Ogni rifiuto è associato a un errore `NGHTTP2_ENHANCE_YOUR_CALM` che dovrebbe dire al peer di non aprire più stream, continuare ad aprire stream è quindi considerato un segno di un peer che si comporta male. **Predefinito:** `100`.
    - `settings` [\<HTTP/2 Settings Object\>](/it/nodejs/api/http2#settings-object) Le impostazioni iniziali da inviare al peer remoto al momento della connessione.
    - `streamResetBurst` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) e `streamResetRate` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il limite di frequenza per il reset dello stream in entrata (frame RST_STREAM). Entrambe le impostazioni devono essere impostate per avere qualsiasi effetto e il valore predefinito è rispettivamente 1000 e 33.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) L'array di valori interi determina i tipi di impostazioni, che sono inclusi nella proprietà `CustomSettings` delle remoteSettings ricevute. Si prega di consultare la proprietà `CustomSettings` dell'oggetto `Http2Settings` per ulteriori informazioni sui tipi di impostazioni consentiti.
    - `Http1IncomingMessage` [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage) Specifica la classe `IncomingMessage` da utilizzare per il fallback HTTP/1. Utile per estendere l'`http.IncomingMessage` originale. **Predefinito:** `http.IncomingMessage`.
    - `Http1ServerResponse` [\<http.ServerResponse\>](/it/nodejs/api/http#class-httpserverresponse) Specifica la classe `ServerResponse` da utilizzare per il fallback HTTP/1. Utile per estendere l'`http.ServerResponse` originale. **Predefinito:** `http.ServerResponse`.
    - `Http2ServerRequest` [\<http2.Http2ServerRequest\>](/it/nodejs/api/http2#class-http2http2serverrequest) Specifica la classe `Http2ServerRequest` da utilizzare. Utile per estendere l'`Http2ServerRequest` originale. **Predefinito:** `Http2ServerRequest`.
    - `Http2ServerResponse` [\<http2.Http2ServerResponse\>](/it/nodejs/api/http2#class-http2http2serverresponse) Specifica la classe `Http2ServerResponse` da utilizzare. Utile per estendere l'`Http2ServerResponse` originale. **Predefinito:** `Http2ServerResponse`.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica un timeout in millisecondi che un server dovrebbe attendere quando viene emesso un [`'unknownProtocol'`](/it/nodejs/api/http2#event-unknownprotocol). Se il socket non è stato distrutto entro quel tempo, il server lo distruggerà. **Predefinito:** `10000`.
    - ...: È possibile fornire qualsiasi opzione [`net.createServer()`](/it/nodejs/api/net#netcreateserveroptions-connectionlistener).


- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Vedi [API di compatibilità](/it/nodejs/api/http2#compatibility-api)
- Restituisce: [\<Http2Server\>](/it/nodejs/api/http2#class-http2server)

Restituisce un'istanza di `net.Server` che crea e gestisce istanze di `Http2Session`.

Poiché non sono noti browser che supportano [HTTP/2 non crittografato](https://http2.github.io/faq/#does-http2-require-encryption), l'uso di [`http2.createSecureServer()`](/it/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) è necessario quando si comunica con i client browser.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// Crea un server HTTP/2 non crittografato.
// Poiché non sono noti browser che supportano
// HTTP/2 non crittografato, l'uso di `createSecureServer()`
// è necessario quando si comunica con i client browser.
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

// Crea un server HTTP/2 non crittografato.
// Poiché non sono noti browser che supportano
// HTTP/2 non crittografato, l'uso di `http2.createSecureServer()`
// è necessario quando si comunica con i client browser.
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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` è stato reso equivalente a fornire `PADDING_STRATEGY_ALIGNED` e `selectPadding` è stato rimosso. |
| v13.3.0, v12.16.0 | Aggiunta l'opzione `maxSessionRejectedStreams` con un valore predefinito di 100. |
| v13.3.0, v12.16.0 | Aggiunta l'opzione `maxSessionInvalidFrames` con un valore predefinito di 1000. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Aggiunta l'opzione `unknownProtocolTimeout` con un valore predefinito di 10000. |
| v14.4.0, v12.18.0, v10.21.0 | Aggiunta l'opzione `maxSettings` con un valore predefinito di 32. |
| v10.12.0 | Aggiunta l'opzione `origins` per inviare automaticamente un frame `ORIGIN` all'avvio di `Http2Session`. |
| v8.9.3 | Aggiunta l'opzione `maxOutstandingPings` con un limite predefinito di 10. |
| v8.9.3 | Aggiunta l'opzione `maxHeaderListPairs` con un limite predefinito di 128 coppie di header. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHTTP1` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Le connessioni client in entrata che non supportano HTTP/2 verranno declassate a HTTP/1.x quando impostato su `true`. Vedi l'evento [`'unknownProtocol'`](/it/nodejs/api/http2#event-unknownprotocol). Vedi [Negoziazione ALPN](/it/nodejs/api/http2#alpn-negotiation). **Predefinito:** `false`.
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta la dimensione massima della tabella dinamica per la compressione dei campi di intestazione. **Predefinito:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di voci di impostazioni per frame `SETTINGS`. Il valore minimo consentito è `1`. **Predefinito:** `32`.
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta la memoria massima che la `Http2Session` è autorizzata a utilizzare. Il valore è espresso in termini di numero di megabyte, ad esempio `1` uguale a 1 megabyte. Il valore minimo consentito è `1`. Questo è un limite basato sul credito, le `Http2Stream` esistenti potrebbero far superare questo limite, ma le nuove istanze `Http2Stream` verranno rifiutate mentre questo limite viene superato. Il numero corrente di sessioni `Http2Stream`, l'uso corrente della memoria delle tabelle di compressione dell'intestazione, i dati correnti in coda da inviare e i frame `PING` e `SETTINGS` non riconosciuti vengono tutti conteggiati per il limite corrente. **Predefinito:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di voci di intestazione. Questo è simile a [`server.maxHeadersCount`](/it/nodejs/api/http#servermaxheaderscount) o [`request.maxHeadersCount`](/it/nodejs/api/http#requestmaxheaderscount) nel modulo `node:http`. Il valore minimo è `4`. **Predefinito:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di ping in sospeso, non riconosciuti. **Predefinito:** `10`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta la dimensione massima consentita per un blocco di intestazioni serializzato e compresso. I tentativi di inviare intestazioni che superano questo limite comporteranno l'emissione di un evento `'frameError'` e la chiusura e la distruzione del flusso.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Strategia utilizzata per determinare la quantità di padding da utilizzare per i frame `HEADERS` e `DATA`. **Predefinito:** `http2.constants.PADDING_STRATEGY_NONE`. Il valore può essere uno tra:
        - `http2.constants.PADDING_STRATEGY_NONE`: Non viene applicato alcun padding.
        - `http2.constants.PADDING_STRATEGY_MAX`: Viene applicata la quantità massima di padding, determinata dall'implementazione interna.
        - `http2.constants.PADDING_STRATEGY_ALIGNED`: Tenta di applicare un padding sufficiente per garantire che la lunghezza totale del frame, inclusa l'intestazione di 9 byte, sia un multiplo di 8. Per ogni frame, esiste un numero massimo consentito di byte di padding determinato dallo stato e dalle impostazioni correnti del controllo di flusso. Se questo massimo è inferiore alla quantità calcolata necessaria per garantire l'allineamento, viene utilizzato il massimo e la lunghezza totale del frame non è necessariamente allineata a 8 byte.

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di stream simultanei per il peer remoto come se fosse stato ricevuto un frame `SETTINGS`. Verrà sovrascritto se il peer remoto imposta il proprio valore per `maxConcurrentStreams`. **Predefinito:** `100`.
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di frame non validi che saranno tollerati prima che la sessione venga chiusa. **Predefinito:** `1000`.
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di stream rifiutati alla creazione che saranno tollerati prima che la sessione venga chiusa. Ogni rifiuto è associato a un errore `NGHTTP2_ENHANCE_YOUR_CALM` che dovrebbe dire al peer di non aprire più stream, quindi continuare ad aprire stream è considerato un segno di un peer che si comporta male. **Predefinito:** `100`.
    - `settings` [\<Oggetto Impostazioni HTTP/2\>](/it/nodejs/api/http2#settings-object) Le impostazioni iniziali da inviare al peer remoto al momento della connessione.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) L'array di valori interi determina i tipi di impostazioni, che sono inclusi nella proprietà `customSettings` delle remoteSettings ricevute. Fare riferimento alla proprietà `customSettings` dell'oggetto `Http2Settings` per ulteriori informazioni sui tipi di impostazioni consentiti.
    - ...: È possibile fornire qualsiasi opzione [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener). Per i server, le opzioni di identità (`pfx` o `key`/`cert`) sono generalmente richieste.
    - `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un array di stringhe di origine da inviare all'interno di un frame `ORIGIN` immediatamente dopo la creazione di un nuovo server `Http2Session`.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica un timeout in millisecondi che un server deve attendere quando viene emesso un evento [`'unknownProtocol'`](/it/nodejs/api/http2#event-unknownprotocol). Se il socket non è stato distrutto entro tale tempo, il server lo distruggerà. **Predefinito:** `10000`.

- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Vedi [API di Compatibilità](/it/nodejs/api/http2#compatibility-api)
- Restituisce: [\<Http2SecureServer\>](/it/nodejs/api/http2#class-http2secureserver)

Restituisce un'istanza `tls.Server` che crea e gestisce istanze `Http2Session`.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),
};

// Crea un server HTTP/2 sicuro
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

// Crea un server HTTP/2 sicuro
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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` è stato reso equivalente a fornire `PADDING_STRATEGY_ALIGNED` e `selectPadding` è stato rimosso. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Aggiunta l'opzione `unknownProtocolTimeout` con un valore predefinito di 10000. |
| v14.4.0, v12.18.0, v10.21.0 | Aggiunta l'opzione `maxSettings` con un valore predefinito di 32. |
| v8.9.3 | Aggiunta l'opzione `maxOutstandingPings` con un limite predefinito di 10. |
| v8.9.3 | Aggiunta l'opzione `maxHeaderListPairs` con un limite predefinito di 128 coppie di header. |
| v8.4.0 | Aggiunta in: v8.4.0 |
:::

- `authority` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Il server HTTP/2 remoto a cui connettersi. Questo deve essere nella forma di un URL valido minimo con il prefisso `http://` o `https://`, il nome host e la porta IP (se viene utilizzata una porta non predefinita). Userinfo (ID utente e password), path, querystring e dettagli del frammento nell'URL verranno ignorati.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta la dimensione massima della tabella dinamica per la deflazione dei campi dell'intestazione. **Predefinito:** `4Kib`.
    - `maxSettings` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di voci di impostazioni per frame `SETTINGS`. Il valore minimo consentito è `1`. **Predefinito:** `32`.
    - `maxSessionMemory` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta la memoria massima che `Http2Session` può utilizzare. Il valore è espresso in termini di numero di megabyte, ad esempio `1` equivale a 1 megabyte. Il valore minimo consentito è `1`. Questo è un limite basato sul credito, gli `Http2Stream` esistenti possono causare il superamento di questo limite, ma le nuove istanze di `Http2Stream` verranno rifiutate mentre questo limite viene superato. Il numero corrente di sessioni `Http2Stream`, l'utilizzo di memoria corrente delle tabelle di compressione dell'intestazione, i dati correnti in coda da inviare e i frame `PING` e `SETTINGS` non riconosciuti vengono tutti conteggiati verso il limite corrente. **Predefinito:** `10`.
    - `maxHeaderListPairs` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di voci di header. Questo è simile a [`server.maxHeadersCount`](/it/nodejs/api/http#servermaxheaderscount) o [`request.maxHeadersCount`](/it/nodejs/api/http#requestmaxheaderscount) nel modulo `node:http`. Il valore minimo è `1`. **Predefinito:** `128`.
    - `maxOutstandingPings` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di ping in sospeso, non riconosciuti. **Predefinito:** `10`.
    - `maxReservedRemoteStreams` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di stream push riservati che il client accetterà in qualsiasi momento. Una volta che il numero corrente di stream push attualmente riservati supera questo limite, i nuovi stream push inviati dal server verranno automaticamente rifiutati. Il valore minimo consentito è 0. Il valore massimo consentito è 2-1. Un valore negativo imposta questa opzione sul valore massimo consentito. **Predefinito:** `200`.
    - `maxSendHeaderBlockLength` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta la dimensione massima consentita per un blocco di header serializzato e compresso. I tentativi di inviare header che superano questo limite comporteranno l'emissione di un evento `'frameError'` e la chiusura e la distruzione dello stream.
    - `paddingStrategy` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Strategia utilizzata per determinare la quantità di padding da utilizzare per i frame `HEADERS` e `DATA`. **Predefinito:** `http2.constants.PADDING_STRATEGY_NONE`. Il valore può essere uno tra:
    - `http2.constants.PADDING_STRATEGY_NONE`: Non viene applicato alcun padding.
    - `http2.constants.PADDING_STRATEGY_MAX`: Viene applicata la quantità massima di padding, determinata dall'implementazione interna.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: Tenta di applicare un padding sufficiente per garantire che la lunghezza totale del frame, inclusa l'intestazione di 9 byte, sia un multiplo di 8. Per ogni frame, esiste un numero massimo consentito di byte di padding determinato dallo stato e dalle impostazioni correnti del controllo del flusso. Se questo massimo è inferiore alla quantità calcolata necessaria per garantire l'allineamento, viene utilizzato il massimo e la lunghezza totale del frame non è necessariamente allineata a 8 byte.


    - `peerMaxConcurrentStreams` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il numero massimo di stream simultanei per il peer remoto come se fosse stato ricevuto un frame `SETTINGS`. Verrà sovrascritto se il peer remoto imposta il proprio valore per `maxConcurrentStreams`. **Predefinito:** `100`.
    - `protocol` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il protocollo con cui connettersi, se non impostato nell'`authority`. Il valore può essere `'http:'` o `'https:'`. **Predefinito:** `'https:'`
    - `settings` [\<Oggetto Impostazioni HTTP/2\>](/it/nodejs/api/http2#settings-object) Le impostazioni iniziali da inviare al peer remoto al momento della connessione.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) L'array di valori interi determina i tipi di impostazioni, che sono inclusi nella proprietà `CustomSettings` delle remoteSettings ricevute. Per maggiori informazioni sui tipi di impostazioni consentiti, vedere la proprietà `CustomSettings` dell'oggetto `Http2Settings`.
    - `createConnection` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Un callback opzionale che riceve l'istanza `URL` passata a `connect` e l'oggetto `options` e restituisce qualsiasi stream [`Duplex`](/it/nodejs/api/stream#class-streamduplex) che deve essere utilizzato come connessione per questa sessione.
    - ...: È possibile fornire qualsiasi opzione [`net.connect()`](/it/nodejs/api/net#netconnect) o [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback).
    - `unknownProtocolTimeout` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica un timeout in millisecondi che un server deve attendere quando viene emesso un evento [`'unknownProtocol'`](/it/nodejs/api/http2#event-unknownprotocol). Se il socket non è stato distrutto entro tale ora, il server lo distruggerà. **Predefinito:** `10000`.


- `listener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Verrà registrata come listener una tantum dell'evento [`'connect'`](/it/nodejs/api/http2#event-connect).
- Restituisce: [\<ClientHttp2Session\>](/it/nodejs/api/http2#class-clienthttp2session)

Restituisce un'istanza di `ClientHttp2Session`.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost:1234');

/* Usa il client */

client.close();
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost:1234');

/* Usa il client */

client.close();
```
:::


### `http2.constants` {#http2constants}

**Aggiunto in: v8.4.0**

#### Codici di errore per `RST_STREAM` e `GOAWAY` {#error-codes-for-rst_stream-and-goaway}

| Valore | Nome | Costante |
| --- | --- | --- |
| `0x00` | Nessun Errore | `http2.constants.NGHTTP2_NO_ERROR` |
| `0x01` | Errore di Protocollo | `http2.constants.NGHTTP2_PROTOCOL_ERROR` |
| `0x02` | Errore Interno | `http2.constants.NGHTTP2_INTERNAL_ERROR` |
| `0x03` | Errore di Controllo del Flusso | `http2.constants.NGHTTP2_FLOW_CONTROL_ERROR` |
| `0x04` | Timeout delle Impostazioni | `http2.constants.NGHTTP2_SETTINGS_TIMEOUT` |
| `0x05` | Flusso Chiuso | `http2.constants.NGHTTP2_STREAM_CLOSED` |
| `0x06` | Errore Dimensione Frame | `http2.constants.NGHTTP2_FRAME_SIZE_ERROR` |
| `0x07` | Flusso Rifiutato | `http2.constants.NGHTTP2_REFUSED_STREAM` |
| `0x08` | Annulla | `http2.constants.NGHTTP2_CANCEL` |
| `0x09` | Errore di Compressione | `http2.constants.NGHTTP2_COMPRESSION_ERROR` |
| `0x0a` | Errore di Connessione | `http2.constants.NGHTTP2_CONNECT_ERROR` |
| `0x0b` | Calmati | `http2.constants.NGHTTP2_ENHANCE_YOUR_CALM` |
| `0x0c` | Sicurezza Inadeguata | `http2.constants.NGHTTP2_INADEQUATE_SECURITY` |
| `0x0d` | HTTP/1.1 Richiesto | `http2.constants.NGHTTP2_HTTP_1_1_REQUIRED` |
L'evento `'timeout'` viene emesso quando non c'è attività sul Server per un determinato numero di millisecondi impostato usando `http2server.setTimeout()`.

### `http2.getDefaultSettings()` {#http2getdefaultsettings}

**Aggiunto in: v8.4.0**

- Restituisce: [\<Oggetto Impostazioni HTTP/2\>](/it/nodejs/api/http2#settings-object)

Restituisce un oggetto contenente le impostazioni predefinite per un'istanza di `Http2Session`. Questo metodo restituisce una nuova istanza dell'oggetto ogni volta che viene chiamato, quindi le istanze restituite possono essere modificate in modo sicuro per l'uso.

### `http2.getPackedSettings([settings])` {#http2getpackedsettingssettings}

**Aggiunto in: v8.4.0**

- `settings` [\<Oggetto Impostazioni HTTP/2\>](/it/nodejs/api/http2#settings-object)
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Restituisce un'istanza di `Buffer` contenente la rappresentazione serializzata delle impostazioni HTTP/2 fornite come specificato nella specifica [HTTP/2](https://tools.ietf.org/html/rfc7540). Questo è destinato all'uso con il campo di intestazione `HTTP2-Settings`.



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

**Aggiunto in: v8.4.0**

- `buf` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Le impostazioni compattate.
- Restituisce: [\<Oggetto Impostazioni HTTP/2\>](/it/nodejs/api/http2#settings-object)

Restituisce un [Oggetto Impostazioni HTTP/2](/it/nodejs/api/http2#settings-object) contenente le impostazioni deserializzate dal `Buffer` dato, generate da `http2.getPackedSettings()`.

### `http2.performServerHandshake(socket[, options])` {#http2performserverhandshakesocket-options}

**Aggiunto in: v21.7.0, v20.12.0**

- `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - ...: Qualsiasi opzione di [`http2.createServer()`](/it/nodejs/api/http2#http2createserveroptions-onrequesthandler) può essere fornita.
  
 
- Restituisce: [\<ServerHttp2Session\>](/it/nodejs/api/http2#class-serverhttp2session)

Crea una sessione server HTTP/2 da un socket esistente.

### `http2.sensitiveHeaders` {#http2sensitiveheaders}

**Aggiunto in: v15.0.0, v14.18.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

Questo simbolo può essere impostato come proprietà sull'oggetto intestazioni HTTP/2 con un valore di array al fine di fornire un elenco di intestazioni considerate sensibili. Vedere [Intestazioni sensibili](/it/nodejs/api/http2#sensitive-headers) per maggiori dettagli.

### Oggetto Intestazioni {#headers-object}

Le intestazioni sono rappresentate come proprietà proprie sugli oggetti JavaScript. Le chiavi delle proprietà saranno serializzate in minuscolo. I valori delle proprietà dovrebbero essere stringhe (se non lo sono, saranno convertite in stringhe) o un `Array` di stringhe (al fine di inviare più di un valore per campo di intestazione).

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'ABC': ['ha', 'più', 'di', 'un', 'valore'],
};

stream.respond(headers);
```
Gli oggetti intestazione passati alle funzioni di callback avranno un prototipo `null`. Ciò significa che i normali metodi dell'oggetto JavaScript come `Object.prototype.toString()` e `Object.prototype.hasOwnProperty()` non funzioneranno.

Per le intestazioni in entrata:

- L'intestazione `:status` viene convertita in `number`.
- I duplicati di `:status`, `:method`, `:authority`, `:scheme`, `:path`, `:protocol`, `age`, `authorization`, `access-control-allow-credentials`, `access-control-max-age`, `access-control-request-method`, `content-encoding`, `content-language`, `content-length`, `content-location`, `content-md5`, `content-range`, `content-type`, `date`, `dnt`, `etag`, `expires`, `from`, `host`, `if-match`, `if-modified-since`, `if-none-match`, `if-range`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `range`, `referer`,`retry-after`, `tk`, `upgrade-insecure-requests`, `user-agent` o `x-content-type-options` vengono scartati.
- `set-cookie` è sempre un array. I duplicati vengono aggiunti all'array.
- Per le intestazioni `cookie` duplicate, i valori sono uniti insieme con '; '.
- Per tutte le altre intestazioni, i valori sono uniti insieme con ', '.



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


#### Intestazioni sensibili {#sensitive-headers}

Le intestazioni HTTP2 possono essere contrassegnate come sensibili, il che significa che l'algoritmo di compressione dell'intestazione HTTP/2 non le indicizzerà mai. Questo può avere senso per i valori delle intestazioni con bassa entropia e che possono essere considerati preziosi per un attaccante, ad esempio `Cookie` o `Authorization`. Per ottenere questo, aggiungi il nome dell'intestazione alla proprietà `[http2.sensitiveHeaders]` come array:

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
Per alcune intestazioni, come `Authorization` e intestazioni `Cookie` brevi, questo flag viene impostato automaticamente.

Questa proprietà è impostata anche per le intestazioni ricevute. Conterrà i nomi di tutte le intestazioni contrassegnate come sensibili, comprese quelle contrassegnate in questo modo automaticamente.

### Oggetto delle impostazioni {#settings-object}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.12.0 | L'impostazione `maxConcurrentStreams` è più rigorosa. |
| v8.9.3 | L'impostazione `maxHeaderListSize` è ora applicata rigorosamente. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

Le API `http2.getDefaultSettings()`, `http2.getPackedSettings()`, `http2.createServer()`, `http2.createSecureServer()`, `http2session.settings()`, `http2session.localSettings` e `http2session.remoteSettings` restituiscono o ricevono come input un oggetto che definisce le impostazioni di configurazione per un oggetto `Http2Session`. Questi oggetti sono normali oggetti JavaScript contenenti le seguenti proprietà.

- `headerTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica il numero massimo di byte utilizzati per la compressione dell'intestazione. Il valore minimo consentito è 0. Il valore massimo consentito è 2-1. **Predefinito:** `4096`.
- `enablePush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Specifica `true` se i flussi push HTTP/2 devono essere consentiti sulle istanze `Http2Session`. **Predefinito:** `true`.
- `initialWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica la dimensione iniziale della finestra del *mittente* in byte per il controllo del flusso a livello di flusso. Il valore minimo consentito è 0. Il valore massimo consentito è 2-1. **Predefinito:** `65535`.
- `maxFrameSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica la dimensione in byte del payload del frame più grande. Il valore minimo consentito è 16.384. Il valore massimo consentito è 2-1. **Predefinito:** `16384`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica il numero massimo di flussi simultanei consentiti su una `Http2Session`. Non esiste un valore predefinito che implica che, almeno teoricamente, 2-1 flussi possono essere aperti contemporaneamente in una `Http2Session`. Il valore minimo è 0. Il valore massimo consentito è 2-1. **Predefinito:** `4294967295`.
- `maxHeaderListSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica la dimensione massima (ottetti non compressi) dell'elenco di intestazioni che verrà accettato. Il valore minimo consentito è 0. Il valore massimo consentito è 2-1. **Predefinito:** `65535`.
- `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias per `maxHeaderListSize`.
- `enableConnectProtocol`[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Specifica `true` se il "Extended Connect Protocol" definito da [RFC 8441](https://tools.ietf.org/html/rfc8441) deve essere abilitato. Questa impostazione è significativa solo se inviata dal server. Una volta che l'impostazione `enableConnectProtocol` è stata abilitata per una determinata `Http2Session`, non può essere disabilitata. **Predefinito:** `false`.
- `customSettings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Specifica impostazioni aggiuntive, non ancora implementate in node e nelle librerie sottostanti. La chiave dell'oggetto definisce il valore numerico del tipo di impostazioni (come definito nel registro "HTTP/2 SETTINGS" stabilito da [RFC 7540]) e i valori il valore numerico effettivo delle impostazioni. Il tipo di impostazioni deve essere un numero intero nell'intervallo da 1 a 2^16-1. Non deve essere un tipo di impostazioni già gestito da node, ovvero attualmente dovrebbe essere maggiore di 6, anche se non è un errore. I valori devono essere numeri interi senza segno nell'intervallo da 0 a 2^32-1. Attualmente, è supportato un massimo di 10 impostazioni personalizzate. È supportato solo per l'invio di SETTINGS o per la ricezione di valori di impostazioni specificati nelle opzioni `remoteCustomSettings` dell'oggetto server o client. Non mescolare il meccanismo `customSettings` per un ID impostazioni con interfacce per le impostazioni gestite in modo nativo, nel caso in cui un'impostazione diventi supportata in modo nativo in una futura versione di node.

Tutte le proprietà aggiuntive sull'oggetto delle impostazioni vengono ignorate.


### Gestione degli errori {#error-handling}

Esistono diversi tipi di condizioni di errore che possono verificarsi quando si utilizza il modulo `node:http2`:

Gli errori di validazione si verificano quando viene passato un argomento, un'opzione o un valore di impostazione errato. Questi verranno sempre segnalati da un `throw` sincrono.

Gli errori di stato si verificano quando si tenta un'azione in un momento errato (ad esempio, si tenta di inviare dati su uno stream dopo che è stato chiuso). Questi verranno segnalati utilizzando un `throw` sincrono oppure tramite un evento `'error'` sugli oggetti `Http2Stream`, `Http2Session` o Server HTTP/2, a seconda di dove e quando si verifica l'errore.

Gli errori interni si verificano quando una sessione HTTP/2 fallisce inaspettatamente. Questi verranno segnalati tramite un evento `'error'` sugli oggetti `Http2Session` o Server HTTP/2.

Gli errori di protocollo si verificano quando vengono violate varie limitazioni del protocollo HTTP/2. Questi verranno segnalati utilizzando un `throw` sincrono oppure tramite un evento `'error'` sugli oggetti `Http2Stream`, `Http2Session` o Server HTTP/2, a seconda di dove e quando si verifica l'errore.

### Gestione dei caratteri non validi nei nomi e nei valori delle intestazioni {#invalid-character-handling-in-header-names-and-values}

L'implementazione HTTP/2 applica una gestione più rigorosa dei caratteri non validi nei nomi e nei valori delle intestazioni HTTP rispetto all'implementazione HTTP/1.

I nomi dei campi di intestazione *non fanno distinzione tra maiuscole e minuscole* e vengono trasmessi via cavo rigorosamente come stringhe minuscole. L'API fornita da Node.js consente di impostare i nomi delle intestazioni come stringhe con maiuscole e minuscole miste (ad es. `Content-Type`), ma le convertirà in minuscolo (ad es. `content-type`) al momento della trasmissione.

I nomi dei campi di intestazione *devono contenere solo* uno o più dei seguenti caratteri ASCII: `a`-`z`, `A`-`Z`, `0`-`9`, `!`, `#`, `$`, `%`, `&`, `'`, `*`, `+`, `-`, `.`, `^`, `_`, ``` (backtick), `|` e `~`.

L'uso di caratteri non validi all'interno di un nome di campo di intestazione HTTP farà sì che lo stream venga chiuso con la segnalazione di un errore di protocollo.

I valori dei campi di intestazione vengono gestiti con maggiore indulgenza, ma *non devono* contenere caratteri di nuova riga o ritorno a capo e *devono* essere limitati ai caratteri US-ASCII, in conformità con i requisiti della specifica HTTP.


### Push streams sul client {#push-streams-on-the-client}

Per ricevere stream push sul client, imposta un listener per l'evento `'stream'` sulla `ClientHttp2Session`:

::: code-group
```js [ESM]
import { connect } from 'node:http2';

const client = connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // Elabora le intestazioni della risposta
  });
  pushedStream.on('data', (chunk) => { /* gestisci i dati push */ });
});

const req = client.request({ ':path': '/' });
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // Elabora le intestazioni della risposta
  });
  pushedStream.on('data', (chunk) => { /* gestisci i dati push */ });
});

const req = client.request({ ':path': '/' });
```
:::

### Supporto del metodo `CONNECT` {#supporting-the-connect-method}

Il metodo `CONNECT` è utilizzato per consentire l'utilizzo di un server HTTP/2 come proxy per connessioni TCP/IP.

Un semplice server TCP:

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

Un proxy HTTP/2 CONNECT:

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const { NGHTTP2_REFUSED_STREAM, NGHTTP2_CONNECT_ERROR } = constants;
import { connect } from 'node:net';

const proxy = createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // Accetta solo richieste CONNECT
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // È una buona idea verificare che l'hostname e la porta siano
  // elementi a cui questo proxy dovrebbe connettersi.
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
    // Accetta solo richieste CONNECT
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // È una buona idea verificare che l'hostname e la porta siano
  // elementi a cui questo proxy dovrebbe connettersi.
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

Un client HTTP/2 CONNECT:

::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';

const client = connect('http://localhost:8001');

// Non specificare le intestazioni ':path' e ':scheme'
// per le richieste CONNECT altrimenti verrà generato un errore.
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

// Non specificare le intestazioni ':path' e ':scheme'
// per le richieste CONNECT altrimenti verrà generato un errore.
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


### Il protocollo `CONNECT` esteso {#the-extended-connect-protocol}

[RFC 8441](https://tools.ietf.org/html/rfc8441) definisce un'estensione "Extended CONNECT Protocol" per HTTP/2 che può essere utilizzata per avviare l'uso di un `Http2Stream` utilizzando il metodo `CONNECT` come tunnel per altri protocolli di comunicazione (come WebSockets).

L'uso del protocollo Extended CONNECT è abilitato dai server HTTP/2 utilizzando l'impostazione `enableConnectProtocol`:

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

Una volta che il client riceve il frame `SETTINGS` dal server che indica che il CONNECT esteso può essere utilizzato, può inviare richieste `CONNECT` che utilizzano lo pseudo-header HTTP/2 `':protocol'`:

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

## API di compatibilità {#compatibility-api}

L'API di compatibilità ha l'obiettivo di fornire un'esperienza di sviluppo simile a HTTP/1 quando si utilizza HTTP/2, rendendo possibile lo sviluppo di applicazioni che supportano sia [HTTP/1](/it/nodejs/api/http) che HTTP/2. Questa API punta solo alla **API pubblica** di [HTTP/1](/it/nodejs/api/http). Tuttavia, molti moduli utilizzano metodi o stati interni e questi *non sono supportati* poiché si tratta di un'implementazione completamente diversa.

L'esempio seguente crea un server HTTP/2 utilizzando l'API di compatibilità:

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

Per creare un server misto [HTTPS](/it/nodejs/api/https) e HTTP/2, fare riferimento alla sezione [Negoziazione ALPN](/it/nodejs/api/http2#alpn-negotiation). L'aggiornamento da server HTTP/1 non-tls non è supportato.

L'API di compatibilità HTTP/2 è composta da [`Http2ServerRequest`](/it/nodejs/api/http2#class-http2http2serverrequest) e [`Http2ServerResponse`](/it/nodejs/api/http2#class-http2http2serverresponse). Mirano alla compatibilità API con HTTP/1, ma non nascondono le differenze tra i protocolli. Ad esempio, il messaggio di stato per i codici HTTP viene ignorato.


### Negoziazione ALPN {#alpn-negotiation}

La negoziazione ALPN consente di supportare sia [HTTPS](/it/nodejs/api/https) che HTTP/2 sulla stessa socket. Gli oggetti `req` e `res` possono essere HTTP/1 o HTTP/2, e un'applicazione **deve** limitarsi all'API pubblica di [HTTP/1](/it/nodejs/api/http), e rilevare se è possibile utilizzare le funzionalità più avanzate di HTTP/2.

L'esempio seguente crea un server che supporta entrambi i protocolli:

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
  // Rileva se è una richiesta HTTPS o HTTP/2
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
  // Rileva se è una richiesta HTTPS o HTTP/2
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

L'evento `'request'` funziona in modo identico sia su [HTTPS](/it/nodejs/api/https) che su HTTP/2.

### Classe: `http2.Http2ServerRequest` {#class-http2http2serverrequest}

**Aggiunto in: v8.4.0**

- Estende: [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable)

Un oggetto `Http2ServerRequest` viene creato da [`http2.Server`](/it/nodejs/api/http2#class-http2server) o [`http2.SecureServer`](/it/nodejs/api/http2#class-http2secureserver) e passato come primo argomento all'evento [`'request'`](/it/nodejs/api/http2#event-request). Può essere utilizzato per accedere allo stato, alle intestazioni e ai dati di una richiesta.


#### Evento: `'aborted'` {#event-aborted_1}

**Aggiunto in: v8.4.0**

L'evento `'aborted'` viene emesso ogni volta che un'istanza di `Http2ServerRequest` viene interrotta in modo anomalo a metà della comunicazione.

L'evento `'aborted'` verrà emesso solo se il lato scrivibile di `Http2ServerRequest` non è stato terminato.

#### Evento: `'close'` {#event-close_2}

**Aggiunto in: v8.4.0**

Indica che il sottostante [`Http2Stream`](/it/nodejs/api/http2#class-http2stream) è stato chiuso. Proprio come `'end'`, questo evento si verifica solo una volta per risposta.

#### `request.aborted` {#requestaborted}

**Aggiunto in: v10.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La proprietà `request.aborted` sarà `true` se la richiesta è stata interrotta.

#### `request.authority` {#requestauthority}

**Aggiunto in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il campo pseudo header dell'autorità di richiesta. Poiché HTTP/2 consente alle richieste di impostare `:authority` o `host`, questo valore è derivato da `req.headers[':authority']` se presente. Altrimenti, è derivato da `req.headers['host']`.

#### `request.complete` {#requestcomplete}

**Aggiunto in: v12.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La proprietà `request.complete` sarà `true` se la richiesta è stata completata, interrotta o distrutta.

#### `request.connection` {#requestconnection}

**Aggiunto in: v8.4.0**

**Deprecato a partire da: v13.0.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Utilizzare [`request.socket`](/it/nodejs/api/http2#requestsocket).
:::

- [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/it/nodejs/api/tls#class-tlstlssocket)

Vedere [`request.socket`](/it/nodejs/api/http2#requestsocket).

#### `request.destroy([error])` {#requestdestroyerror}

**Aggiunto in: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Chiama `destroy()` sul [`Http2Stream`](/it/nodejs/api/http2#class-http2stream) che ha ricevuto la [`Http2ServerRequest`](/it/nodejs/api/http2#class-http2http2serverrequest). Se viene fornito `error`, viene emesso un evento `'error'` e `error` viene passato come argomento a qualsiasi listener sull'evento.

Non fa nulla se lo stream è già stato distrutto.


#### `request.headers` {#requestheaders}

**Aggiunto in: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L'oggetto delle intestazioni di richiesta/risposta.

Coppie chiave-valore di nomi e valori di intestazione. I nomi delle intestazioni sono in minuscolo.

```js [ESM]
// Stampa qualcosa come:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
Vedere [Oggetto Intestazioni HTTP/2](/it/nodejs/api/http2#headers-object).

In HTTP/2, il percorso della richiesta, il nome host, il protocollo e il metodo sono rappresentati come intestazioni speciali con il prefisso del carattere `:` (ad esempio `':path'`). Queste intestazioni speciali saranno incluse nell'oggetto `request.headers`. Bisogna fare attenzione a non modificare inavvertitamente queste intestazioni speciali, altrimenti potrebbero verificarsi errori. Ad esempio, la rimozione di tutte le intestazioni dalla richiesta causerà errori:

```js [ESM]
removeAllHeaders(request.headers);
assert(request.url);   // Fallisce perché l'intestazione :path è stata rimossa
```
#### `request.httpVersion` {#requesthttpversion}

**Aggiunto in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Nel caso di una richiesta del server, la versione HTTP inviata dal client. Nel caso di una risposta del client, la versione HTTP del server a cui è connesso. Restituisce `'2.0'`.

Inoltre, `message.httpVersionMajor` è il primo intero e `message.httpVersionMinor` è il secondo.

#### `request.method` {#requestmethod}

**Aggiunto in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo di richiesta come stringa. Sola lettura. Esempi: `'GET'`, `'DELETE'`.

#### `request.rawHeaders` {#requestrawheaders}

**Aggiunto in: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'elenco delle intestazioni raw di richiesta/risposta esattamente come sono state ricevute.

Le chiavi e i valori sono nella stessa lista. *Non* è una lista di tuple. Quindi, gli offset pari sono valori chiave e gli offset dispari sono i valori associati.

I nomi delle intestazioni non sono in minuscolo e i duplicati non vengono uniti.

```js [ESM]
// Stampa qualcosa come:
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

**Aggiunto in: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le chiavi e i valori dei trailer grezzi della richiesta/risposta esattamente come sono stati ricevuti. Popolato solo all'evento `'end'`.

#### `request.scheme` {#requestscheme}

**Aggiunto in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Lo pseudo campo dell'intestazione dello schema della richiesta che indica la porzione di schema dell'URL di destinazione.

#### `request.setTimeout(msecs, callback)` {#requestsettimeoutmsecs-callback}

**Aggiunto in: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<http2.Http2ServerRequest\>](/it/nodejs/api/http2#class-http2http2serverrequest)

Imposta il valore di timeout dell'[`Http2Stream`](/it/nodejs/api/http2#class-http2stream) a `msecs`. Se viene fornito un callback, viene aggiunto come listener all'evento `'timeout'` sull'oggetto response.

Se nessun listener `'timeout'` viene aggiunto alla request, alla response o al server, gli [`Http2Stream`](/it/nodejs/api/http2#class-http2stream) vengono distrutti quando scadono. Se un gestore viene assegnato agli eventi `'timeout'` della request, della response o del server, i socket scaduti devono essere gestiti esplicitamente.

#### `request.socket` {#requestsocket}

**Aggiunto in: v8.4.0**

- [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/it/nodejs/api/tls#class-tlstlssocket)

Restituisce un oggetto `Proxy` che agisce come un `net.Socket` (o `tls.TLSSocket`) ma applica getter, setter e metodi basati sulla logica HTTP/2.

Le proprietà `destroyed`, `readable` e `writable` verranno recuperate e impostate su `request.stream`.

I metodi `destroy`, `emit`, `end`, `on` e `once` verranno chiamati su `request.stream`.

Il metodo `setTimeout` verrà chiamato su `request.stream.session`.

`pause`, `read`, `resume` e `write` genereranno un errore con il codice `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Vedi [`Http2Session` e Socket](/it/nodejs/api/http2#http2session-and-sockets) per maggiori informazioni.

Tutte le altre interazioni verranno indirizzate direttamente al socket. Con il supporto TLS, usa [`request.socket.getPeerCertificate()`](/it/nodejs/api/tls#tlssocketgetpeercertificatedetailed) per ottenere i dettagli di autenticazione del client.


#### `request.stream` {#requeststream}

**Aggiunto in: v8.4.0**

- [\<Http2Stream\>](/it/nodejs/api/http2#class-http2stream)

L'oggetto [`Http2Stream`](/it/nodejs/api/http2#class-http2stream) che supporta la richiesta.

#### `request.trailers` {#requesttrailers}

**Aggiunto in: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L'oggetto dei trailer della richiesta/risposta. Popolato solo all'evento `'end'`.

#### `request.url` {#requesturl}

**Aggiunto in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Stringa URL della richiesta. Contiene solo l'URL presente nella richiesta HTTP effettiva. Se la richiesta è:

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
Allora `request.url` sarà:

```js [ESM]
'/status?name=ryan'
```
Per analizzare l'URL nelle sue parti, è possibile utilizzare `new URL()`:

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
### Classe: `http2.Http2ServerResponse` {#class-http2http2serverresponse}

**Aggiunto in: v8.4.0**

- Estende: [\<Stream\>](/it/nodejs/api/stream#stream)

Questo oggetto viene creato internamente da un server HTTP, non dall'utente. Viene passato come secondo parametro all'evento [`'request'`](/it/nodejs/api/http2#event-request).

#### Evento: `'close'` {#event-close_3}

**Aggiunto in: v8.4.0**

Indica che l' [`Http2Stream`](/it/nodejs/api/http2#class-http2stream) sottostante è stato terminato prima che [`response.end()`](/it/nodejs/api/http2#responseenddata-encoding-callback) venisse chiamato o fosse in grado di scaricare.

#### Evento: `'finish'` {#event-finish}

**Aggiunto in: v8.4.0**

Emesso quando la risposta è stata inviata. Più precisamente, questo evento viene emesso quando l'ultimo segmento delle intestazioni e del corpo della risposta è stato consegnato al multiplexing HTTP/2 per la trasmissione sulla rete. Non implica che il client abbia ancora ricevuto nulla.

Dopo questo evento, non verranno emessi altri eventi sull'oggetto della risposta.


#### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**Aggiunto in: v8.4.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Questo metodo aggiunge gli header finali HTTP (un header ma alla fine del messaggio) alla risposta.

Tentare di impostare un nome o un valore di campo dell'header che contenga caratteri non validi comporterà il lancio di un [`TypeError`](/it/nodejs/api/errors#class-typeerror).

#### `response.appendHeader(name, value)` {#responseappendheadername-value}

**Aggiunto in: v21.7.0, v20.12.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Aggiunge un singolo valore di header all'oggetto header.

Se il valore è un array, questo è equivalente a chiamare questo metodo più volte.

Se non ci fossero valori precedenti per l'header, questo è equivalente a chiamare [`response.setHeader()`](/it/nodejs/api/http2#responsesetheadername-value).

Tentare di impostare un nome o un valore di campo dell'header che contenga caratteri non validi comporterà il lancio di un [`TypeError`](/it/nodejs/api/errors#class-typeerror).

```js [ESM]
// Restituisce gli header inclusi "set-cookie: a" e "set-cookie: b"
const server = http2.createServer((req, res) => {
  res.setHeader('set-cookie', 'a');
  res.appendHeader('set-cookie', 'b');
  res.writeHead(200);
  res.end('ok');
});
```
#### `response.connection` {#responseconnection}

**Aggiunto in: v8.4.0**

**Deprecato a partire da: v13.0.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Utilizzare [`response.socket`](/it/nodejs/api/http2#responsesocket).
:::

- [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/it/nodejs/api/tls#class-tlstlssocket)

Vedi [`response.socket`](/it/nodejs/api/http2#responsesocket).

#### `response.createPushResponse(headers, callback)` {#responsecreatepushresponseheaders-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- `headers` [\<Oggetto Header HTTP/2\>](/it/nodejs/api/http2#headers-object) Un oggetto che descrive gli header
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chiamato una volta che `http2stream.pushStream()` è terminato, o quando il tentativo di creare l'`Http2Stream` inviato tramite push è fallito o è stato rifiutato, oppure lo stato di `Http2ServerRequest` è chiuso prima di chiamare il metodo `http2stream.pushStream()` 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `res` [\<http2.Http2ServerResponse\>](/it/nodejs/api/http2#class-http2http2serverresponse) L'oggetto `Http2ServerResponse` appena creato
  
 

Chiama [`http2stream.pushStream()`](/it/nodejs/api/http2#http2streampushstreamheaders-options-callback) con gli header forniti e racchiude l'`Http2Stream`](/it/nodejs/api/http2#class-http2stream) fornito in un `Http2ServerResponse` appena creato come parametro di callback in caso di successo. Quando `Http2ServerRequest` è chiuso, il callback viene chiamato con un errore `ERR_HTTP2_INVALID_STREAM`.


#### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Questo metodo ora restituisce un riferimento a `ServerResponse`. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- `data` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Questo metodo segnala al server che tutte le intestazioni e il corpo della risposta sono stati inviati; che il server dovrebbe considerare questo messaggio completo. Il metodo `response.end()` DEVE essere chiamato su ogni risposta.

Se `data` è specificato, equivale a chiamare [`response.write(data, encoding)`](/it/nodejs/api/http#responsewritechunk-encoding-callback) seguito da `response.end(callback)`.

Se `callback` è specificato, verrà chiamato al termine del flusso di risposta.

#### `response.finished` {#responsefinished}

**Aggiunto in: v8.4.0**

**Deprecato a partire da: v13.4.0, v12.16.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Usa [`response.writableEnded`](/it/nodejs/api/http2#responsewritableended).
:::

- [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Valore booleano che indica se la risposta è stata completata. Inizia come `false`. Dopo l'esecuzione di [`response.end()`](/it/nodejs/api/http2#responseenddata-encoding-callback), il valore sarà `true`.

#### `response.getHeader(name)` {#responsegetheadername}

**Aggiunto in: v8.4.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Legge un'intestazione che è già stata accodata ma non inviata al client. Il nome non fa distinzione tra maiuscole e minuscole.

```js [ESM]
const contentType = response.getHeader('content-type');
```

#### `response.getHeaderNames()` {#responsegetheadernames}

**Aggiunto in: v8.4.0**

- Restituisce: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce un array contenente i nomi univoci delle intestazioni in uscita correnti. Tutti i nomi delle intestazioni sono in minuscolo.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```
#### `response.getHeaders()` {#responsegetheaders}

**Aggiunto in: v8.4.0**

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce una copia superficiale delle intestazioni in uscita correnti. Poiché viene utilizzata una copia superficiale, i valori degli array possono essere modificati senza ulteriori chiamate ai vari metodi del modulo http relativi alle intestazioni. Le chiavi dell'oggetto restituito sono i nomi delle intestazioni e i valori sono i rispettivi valori delle intestazioni. Tutti i nomi delle intestazioni sono in minuscolo.

L'oggetto restituito dal metodo `response.getHeaders()` *non* eredita prototipicamente dall'`Object` JavaScript. Ciò significa che i tipici metodi `Object` come `obj.toString()`, `obj.hasOwnProperty()` e altri non sono definiti e *non funzioneranno*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
#### `response.hasHeader(name)` {#responsehasheadername}

**Aggiunto in: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'intestazione identificata da `name` è attualmente impostata nelle intestazioni in uscita. La corrispondenza del nome dell'intestazione non fa distinzione tra maiuscole e minuscole.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
#### `response.headersSent` {#responseheaderssent}

**Aggiunto in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

True se le intestazioni sono state inviate, false altrimenti (solo lettura).


#### `response.removeHeader(name)` {#responseremoveheadername}

**Aggiunto in: v8.4.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Rimuove un'intestazione che è stata messa in coda per l'invio implicito.

```js [ESM]
response.removeHeader('Content-Encoding');
```
#### `response.req` {#responsereq}

**Aggiunto in: v15.7.0**

- [\<http2.Http2ServerRequest\>](/it/nodejs/api/http2#class-http2http2serverrequest)

Un riferimento all'oggetto `request` HTTP2 originale.

#### `response.sendDate` {#responsesenddate}

**Aggiunto in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Quando è true, l'intestazione Date verrà generata e inviata automaticamente nella risposta se non è già presente nelle intestazioni. Il valore predefinito è true.

Questo dovrebbe essere disabilitato solo per i test; HTTP richiede l'intestazione Date nelle risposte.

#### `response.setHeader(name, value)` {#responsesetheadername-value}

**Aggiunto in: v8.4.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Imposta un singolo valore di intestazione per le intestazioni implicite. Se questa intestazione esiste già nelle intestazioni da inviare, il suo valore verrà sostituito. Usa un array di stringhe qui per inviare più intestazioni con lo stesso nome.

```js [ESM]
response.setHeader('Content-Type', 'text/html; charset=utf-8');
```
o

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
Il tentativo di impostare un nome o un valore di campo di intestazione che contiene caratteri non validi comporterà la generazione di un [`TypeError`](/it/nodejs/api/errors#class-typeerror).

Quando le intestazioni sono state impostate con [`response.setHeader()`](/it/nodejs/api/http2#responsesetheadername-value), verranno unite con qualsiasi intestazione passata a [`response.writeHead()`](/it/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers), con le intestazioni passate a [`response.writeHead()`](/it/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) a cui viene data la precedenza.

```js [ESM]
// Restituisce content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

#### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**Aggiunto in: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<http2.Http2ServerResponse\>](/it/nodejs/api/http2#class-http2http2serverresponse)

Imposta il valore di timeout dell'[`Http2Stream`](/it/nodejs/api/http2#class-http2stream) su `msecs`. Se viene fornito un callback, viene aggiunto come listener all'evento `'timeout'` sull'oggetto response.

Se non viene aggiunto alcun listener `'timeout'` alla request, alla response o al server, gli [`Http2Stream`](/it/nodejs/api/http2#class-http2stream) vengono distrutti quando scadono. Se viene assegnato un handler agli eventi `'timeout'` della request, della response o del server, i socket scaduti devono essere gestiti esplicitamente.

#### `response.socket` {#responsesocket}

**Aggiunto in: v8.4.0**

- [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/it/nodejs/api/tls#class-tlstlssocket)

Restituisce un oggetto `Proxy` che funge da `net.Socket` (o `tls.TLSSocket`), ma applica getter, setter e metodi basati sulla logica HTTP/2.

Le proprietà `destroyed`, `readable` e `writable` verranno recuperate e impostate su `response.stream`.

I metodi `destroy`, `emit`, `end`, `on` e `once` verranno chiamati su `response.stream`.

Il metodo `setTimeout` verrà chiamato su `response.stream.session`.

`pause`, `read`, `resume` e `write` genereranno un errore con codice `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Vedere [`Http2Session` e Socket](/it/nodejs/api/http2#http2session-and-sockets) per maggiori informazioni.

Tutte le altre interazioni verranno instradate direttamente al socket.

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

**Aggiunto in: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Quando si utilizzano header impliciti (senza chiamare esplicitamente [`response.writeHead()`](/it/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers)), questa proprietà controlla il codice di stato che verrà inviato al client quando gli header vengono scaricati.

```js [ESM]
response.statusCode = 404;
```
Dopo che l'header di risposta è stato inviato al client, questa proprietà indica il codice di stato che è stato inviato.

#### `response.statusMessage` {#responsestatusmessage}

**Aggiunto in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il messaggio di stato non è supportato da HTTP/2 (RFC 7540 8.1.2.4). Restituisce una stringa vuota.

#### `response.stream` {#responsestream}

**Aggiunto in: v8.4.0**

- [\<Http2Stream\>](/it/nodejs/api/http2#class-http2stream)

L'oggetto [`Http2Stream`](/it/nodejs/api/http2#class-http2stream) che supporta la risposta.

#### `response.writableEnded` {#responsewritableended}

**Aggiunto in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` dopo che è stato chiamato [`response.end()`](/it/nodejs/api/http2#responseenddata-encoding-callback). Questa proprietà non indica se i dati sono stati scaricati, per questo usa invece [`writable.writableFinished`](/it/nodejs/api/stream#writablewritablefinished).

#### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}

**Aggiunto in: v8.4.0**

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se questo metodo viene chiamato e [`response.writeHead()`](/it/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) non è stato chiamato, passerà alla modalità header implicita e scaricherà gli header impliciti.

Questo invia un chunk del corpo della risposta. Questo metodo può essere chiamato più volte per fornire parti successive del corpo.

Nel modulo `node:http`, il corpo della risposta viene omesso quando la richiesta è una richiesta HEAD. Allo stesso modo, le risposte `204` e `304` *non devono* includere un corpo del messaggio.

`chunk` può essere una stringa o un buffer. Se `chunk` è una stringa, il secondo parametro specifica come codificarla in un flusso di byte. Di default, la `encoding` è `'utf8'`. `callback` verrà chiamata quando questo chunk di dati viene scaricato.

Questo è il corpo HTTP raw e non ha nulla a che fare con le codifiche del corpo multi-parte di livello superiore che possono essere utilizzate.

La prima volta che viene chiamato [`response.write()`](/it/nodejs/api/http2#responsewritechunk-encoding-callback), invierà le informazioni dell'header memorizzate nel buffer e il primo chunk del corpo al client. La seconda volta che viene chiamato [`response.write()`](/it/nodejs/api/http2#responsewritechunk-encoding-callback), Node.js presume che i dati verranno trasmessi in streaming e invia i nuovi dati separatamente. Cioè, la risposta viene memorizzata nel buffer fino al primo chunk del corpo.

Restituisce `true` se tutti i dati sono stati scaricati correttamente nel buffer del kernel. Restituisce `false` se tutti o parte dei dati sono stati accodati nella memoria dell'utente. `'drain'` verrà emesso quando il buffer sarà di nuovo libero.


#### `response.writeContinue()` {#responsewritecontinue}

**Aggiunto in: v8.4.0**

Invia uno stato `100 Continue` al client, indicando che il corpo della richiesta deve essere inviato. Vedere l'evento [`'checkContinue'`](/it/nodejs/api/http2#event-checkcontinue) su `Http2Server` e `Http2SecureServer`.

#### `response.writeEarlyHints(hints)` {#responsewriteearlyhintshints}

**Aggiunto in: v18.11.0**

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Invia uno stato `103 Early Hints` al client con un'intestazione Link, indicando che lo user agent può precaricare/preconnettersi alle risorse collegate. `hints` è un oggetto contenente i valori delle intestazioni da inviare con il messaggio di early hints.

**Esempio**

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


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.10.0, v10.17.0 | Restituisce `this` da `writeHead()` per consentire il concatenamento con `end()`. |
| v8.4.0 | Aggiunto in: v8.4.0 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- Restituisce: [\<http2.Http2ServerResponse\>](/it/nodejs/api/http2#class-http2http2serverresponse)

Invia un'intestazione di risposta alla richiesta. Il codice di stato è un codice di stato HTTP a 3 cifre, come `404`. L'ultimo argomento, `headers`, sono le intestazioni di risposta.

Restituisce un riferimento a `Http2ServerResponse`, in modo che le chiamate possano essere concatenate.

Per compatibilità con [HTTP/1](/it/nodejs/api/http), un `statusMessage` leggibile dall'uomo può essere passato come secondo argomento. Tuttavia, poiché `statusMessage` non ha significato all'interno di HTTP/2, l'argomento non avrà alcun effetto e verrà emesso un avviso di processo.

```js [ESM]
const body = 'hello world';
response.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/plain; charset=utf-8',
});
```
`Content-Length` è dato in byte non in caratteri. L'API `Buffer.byteLength()` può essere utilizzata per determinare il numero di byte in una data codifica. Sui messaggi in uscita, Node.js non controlla se Content-Length e la lunghezza del corpo che viene trasmesso sono uguali o meno. Tuttavia, quando si ricevono messaggi, Node.js rifiuterà automaticamente i messaggi quando il `Content-Length` non corrisponde alla dimensione effettiva del payload.

Questo metodo può essere chiamato al massimo una volta su un messaggio prima che venga chiamato [`response.end()`](/it/nodejs/api/http2#responseenddata-encoding-callback).

Se [`response.write()`](/it/nodejs/api/http2#responsewritechunk-encoding-callback) o [`response.end()`](/it/nodejs/api/http2#responseenddata-encoding-callback) vengono chiamati prima di chiamare questo, le intestazioni implicite/mutabili verranno calcolate e chiameranno questa funzione.

Quando le intestazioni sono state impostate con [`response.setHeader()`](/it/nodejs/api/http2#responsesetheadername-value), verranno unite a qualsiasi intestazione passata a [`response.writeHead()`](/it/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers), con le intestazioni passate a [`response.writeHead()`](/it/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) che avranno la precedenza.

```js [ESM]
// Restituisce content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
Tentare di impostare un nome o un valore di campo di intestazione che contenga caratteri non validi comporterà la generazione di un [`TypeError`](/it/nodejs/api/errors#class-typeerror).


## Raccolta di metriche di performance HTTP/2 {#collecting-http/2-performance-metrics}

L'API [Performance Observer](/it/nodejs/api/perf_hooks) può essere utilizzata per raccogliere metriche di performance di base per ogni istanza di `Http2Session` e `Http2Stream`.

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // stampa 'http2'
  if (entry.name === 'Http2Session') {
    // La entry contiene statistiche sulla Http2Session
  } else if (entry.name === 'Http2Stream') {
    // La entry contiene statistiche sulla Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```

```js [CJS]
const { PerformanceObserver } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // stampa 'http2'
  if (entry.name === 'Http2Session') {
    // La entry contiene statistiche sulla Http2Session
  } else if (entry.name === 'Http2Stream') {
    // La entry contiene statistiche sulla Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```
:::

La proprietà `entryType` della `PerformanceEntry` sarà uguale a `'http2'`.

La proprietà `name` della `PerformanceEntry` sarà uguale a `'Http2Stream'` o `'Http2Session'`.

Se `name` è uguale a `Http2Stream`, la `PerformanceEntry` conterrà le seguenti proprietà aggiuntive:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte del frame `DATA` ricevuti per questo `Http2Stream`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte del frame `DATA` inviati per questo `Http2Stream`.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'identificatore dell'`Http2Stream` associato
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi trascorsi tra il `startTime` della `PerformanceEntry` e la ricezione del primo frame `DATA`.
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi trascorsi tra il `startTime` della `PerformanceEntry` e l'invio del primo frame `DATA`.
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi trascorsi tra il `startTime` della `PerformanceEntry` e la ricezione del primo header.

Se `name` è uguale a `Http2Session`, la `PerformanceEntry` conterrà le seguenti proprietà aggiuntive:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte ricevuti per questa `Http2Session`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte inviati per questa `Http2Session`.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di frame HTTP/2 ricevuti dalla `Http2Session`.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di frame HTTP/2 inviati dalla `Http2Session`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero massimo di stream aperti contemporaneamente durante la durata dell'`Http2Session`.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi trascorsi dall'invio di un frame `PING` e la ricezione della sua acknowledgment. Presente solo se un frame `PING` è stato inviato sull'`Http2Session`.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La durata media (in millisecondi) per tutte le istanze di `Http2Stream`.
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di istanze di `Http2Stream` elaborate dall'`Http2Session`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O `'server'` o `'client'` per identificare il tipo di `Http2Session`.


## Nota su `:authority` e `host` {#note-on-authority-and-host}

HTTP/2 richiede che le richieste abbiano lo pseudo-header `:authority` o l'header `host`. Preferire `:authority` quando si costruisce direttamente una richiesta HTTP/2 e `host` quando si converte da HTTP/1 (in proxy, ad esempio).

L'API di compatibilità ricade su `host` se `:authority` non è presente. Vedere [`request.authority`](/it/nodejs/api/http2#requestauthority) per maggiori informazioni. Tuttavia, se non si utilizza l'API di compatibilità (o si utilizza direttamente `req.headers`), è necessario implementare autonomamente qualsiasi comportamento di fallback.

