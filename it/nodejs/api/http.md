---
title: Documentazione del modulo HTTP di Node.js
description: La documentazione ufficiale del modulo HTTP di Node.js, che spiega come creare server e client HTTP, gestire richieste e risposte, e gestire vari metodi e intestazioni HTTP.
head:
  - - meta
    - name: og:title
      content: Documentazione del modulo HTTP di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentazione ufficiale del modulo HTTP di Node.js, che spiega come creare server e client HTTP, gestire richieste e risposte, e gestire vari metodi e intestazioni HTTP.
  - - meta
    - name: twitter:title
      content: Documentazione del modulo HTTP di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentazione ufficiale del modulo HTTP di Node.js, che spiega come creare server e client HTTP, gestire richieste e risposte, e gestire vari metodi e intestazioni HTTP.
---


# HTTP {#http}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/http.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http.js)

Questo modulo, contenente sia un client che un server, può essere importato tramite `require('node:http')` (CommonJS) o `import * as http from 'node:http'` (modulo ES).

Le interfacce HTTP in Node.js sono progettate per supportare molte funzionalità del protocollo che sono state tradizionalmente difficili da usare. In particolare, messaggi di grandi dimensioni, possibilmente codificati in blocchi. L'interfaccia è attenta a non memorizzare mai in buffer intere richieste o risposte, quindi l'utente è in grado di trasmettere dati in streaming.

Le intestazioni dei messaggi HTTP sono rappresentate da un oggetto come questo:

```json [JSON]
{ "content-length": "123",
  "content-type": "text/plain",
  "connection": "keep-alive",
  "host": "example.com",
  "accept": "*/*" }
```
Le chiavi sono in minuscolo. I valori non vengono modificati.

Per supportare l'intero spettro di possibili applicazioni HTTP, l'API HTTP di Node.js è di livello molto basso. Si occupa solo della gestione dei flussi e dell'analisi dei messaggi. Analizza un messaggio in intestazioni e corpo, ma non analizza le intestazioni o il corpo effettivi.

Vedi [`message.headers`](/it/nodejs/api/http#messageheaders) per i dettagli su come vengono gestite le intestazioni duplicate.

Le intestazioni raw così come sono state ricevute vengono conservate nella proprietà `rawHeaders`, che è un array di `[chiave, valore, chiave2, valore2, ...]`. Ad esempio, l'oggetto di intestazione del messaggio precedente potrebbe avere un elenco `rawHeaders` simile al seguente:

```js [ESM]
[ 'ConTent-Length', '123456',
  'content-LENGTH', '123',
  'content-type', 'text/plain',
  'CONNECTION', 'keep-alive',
  'Host', 'example.com',
  'accepT', '*/*' ]
```
## Classe: `http.Agent` {#class-httpagent}

**Aggiunto in: v0.3.4**

Un `Agent` è responsabile della gestione della persistenza e del riutilizzo della connessione per i client HTTP. Mantiene una coda di richieste in sospeso per un determinato host e porta, riutilizzando una singola connessione socket per ciascuna fino a quando la coda non è vuota, momento in cui il socket viene distrutto o inserito in un pool in cui viene conservato per essere riutilizzato per le richieste allo stesso host e porta. La sua distruzione o il suo raggruppamento dipende dall'[opzione](/it/nodejs/api/http#new-agentoptions) `keepAlive`.

Le connessioni in pool hanno TCP Keep-Alive abilitato, ma i server possono comunque chiudere le connessioni inattive, nel qual caso verranno rimosse dal pool e verrà creata una nuova connessione quando viene effettuata una nuova richiesta HTTP per tale host e porta. I server possono anche rifiutare di consentire più richieste sulla stessa connessione, nel qual caso la connessione dovrà essere rifatta per ogni richiesta e non potrà essere raggruppata. L'`Agent` effettuerà comunque le richieste a quel server, ma ognuna avverrà su una nuova connessione.

Quando una connessione viene chiusa dal client o dal server, viene rimossa dal pool. Qualsiasi socket inutilizzato nel pool verrà dereferenziato in modo da non mantenere in esecuzione il processo Node.js quando non ci sono richieste in sospeso. (vedere [`socket.unref()`](/it/nodejs/api/net#socketunref)).

È buona norma [`destroy()`](/it/nodejs/api/http#agentdestroy) un'istanza di `Agent` quando non è più in uso, perché i socket inutilizzati consumano risorse del sistema operativo.

I socket vengono rimossi da un agente quando il socket emette un evento `'close'` o un evento `'agentRemove'`. Quando si intende mantenere aperta una richiesta HTTP per un lungo periodo senza mantenerla nell'agente, si può fare qualcosa del genere:

```js [ESM]
http.get(options, (res) => {
  // Fai qualcosa
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});
```
Un agente può essere utilizzato anche per una singola richiesta. Fornendo `{agent: false}` come opzione alle funzioni `http.get()` o `http.request()`, verrà utilizzato un `Agent` usa e getta con le opzioni predefinite per la connessione client.

`agent:false`:

```js [ESM]
http.get({
  hostname: 'localhost',
  port: 80,
  path: '/',
  agent: false,  // Crea un nuovo agente solo per questa richiesta
}, (res) => {
  // Fai qualcosa con la risposta
});
```

### `new Agent([options])` {#new-agentoptions}

::: info [Cronologia]
| Versione  | Modifiche                                                                |
| :-------- | :----------------------------------------------------------------------- |
| v15.6.0, v14.17.0 | Cambia la pianificazione predefinita da 'fifo' a 'lifo'.               |
| v14.5.0, v12.20.0 | Aggiunta l'opzione `scheduling` per specificare la strategia di pianificazione dei socket liberi. |
| v14.5.0, v12.19.0 | Aggiunta l'opzione `maxTotalSockets` al costruttore dell'agente.       |
| v0.3.4    | Aggiunta in: v0.3.4                                                      |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Insieme di opzioni configurabili da impostare sull'agente. Può avere i seguenti campi:
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Mantiene i socket attivi anche quando non ci sono richieste in sospeso, in modo che possano essere utilizzati per richieste future senza dover ristabilire una connessione TCP. Da non confondere con il valore `keep-alive` dell'header `Connection`. L'header `Connection: keep-alive` viene sempre inviato quando si utilizza un agente, tranne quando l'header `Connection` è specificato esplicitamente o quando le opzioni `keepAlive` e `maxSockets` sono rispettivamente impostate su `false` e `Infinity`, nel qual caso verrà utilizzato `Connection: close`. **Predefinito:** `false`.
    - `keepAliveMsecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Quando si utilizza l'opzione `keepAlive`, specifica il [ritardo iniziale](/it/nodejs/api/net#socketsetkeepaliveenable-initialdelay) per i pacchetti TCP Keep-Alive. Ignorato quando l'opzione `keepAlive` è `false` o `undefined`. **Predefinito:** `1000`.
    - `maxSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero massimo di socket da consentire per host. Se lo stesso host apre più connessioni simultanee, ogni richiesta utilizzerà un nuovo socket fino a quando non viene raggiunto il valore `maxSockets`. Se l'host tenta di aprire più connessioni di `maxSockets`, le richieste aggiuntive entreranno in una coda di richieste in sospeso e entreranno nello stato di connessione attiva quando una connessione esistente termina. Questo assicura che ci siano al massimo `maxSockets` connessioni attive in qualsiasi momento, da un determinato host. **Predefinito:** `Infinity`.
    - `maxTotalSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero massimo di socket consentiti per tutti gli host in totale. Ogni richiesta utilizzerà un nuovo socket fino a quando non viene raggiunto il massimo. **Predefinito:** `Infinity`.
    - `maxFreeSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero massimo di socket per host da lasciare aperti in uno stato libero. Rilevante solo se `keepAlive` è impostato su `true`. **Predefinito:** `256`.
    - `scheduling` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Strategia di pianificazione da applicare quando si sceglie il socket libero successivo da utilizzare. Può essere `'fifo'` o `'lifo'`. La principale differenza tra le due strategie di pianificazione è che `'lifo'` seleziona il socket utilizzato più recentemente, mentre `'fifo'` seleziona il socket utilizzato meno recentemente. In caso di una bassa frequenza di richieste al secondo, la pianificazione `'lifo'` ridurrà il rischio di scegliere un socket che potrebbe essere stato chiuso dal server a causa dell'inattività. In caso di un'alta frequenza di richieste al secondo, la pianificazione `'fifo'` massimizzerà il numero di socket aperti, mentre la pianificazione `'lifo'` lo manterrà il più basso possibile. **Predefinito:** `'lifo'`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Timeout del socket in millisecondi. Questo imposterà il timeout quando il socket viene creato.
  
 

Sono supportate anche le `options` in [`socket.connect()`](/it/nodejs/api/net#socketconnectoptions-connectlistener).

Per configurarne una qualsiasi, è necessario creare un'istanza personalizzata di [`http.Agent`](/it/nodejs/api/http#class-httpagent).



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

**Aggiunto in: v0.11.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni contenenti i dettagli della connessione. Controllare [`net.createConnection()`](/it/nodejs/api/net#netcreateconnectionoptions-connectlistener) per il formato delle opzioni
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione di callback che riceve il socket creato
- Restituisce: [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Produce un socket/stream da utilizzare per le richieste HTTP.

Per impostazione predefinita, questa funzione è la stessa di [`net.createConnection()`](/it/nodejs/api/net#netcreateconnectionoptions-connectlistener). Tuttavia, gli agent personalizzati possono sovrascrivere questo metodo nel caso in cui si desideri una maggiore flessibilità.

Un socket/stream può essere fornito in uno dei due modi: restituendo il socket/stream da questa funzione o passando il socket/stream a `callback`.

È garantito che questo metodo restituisca un'istanza della classe [\<net.Socket\>](/it/nodejs/api/net#class-netsocket), una sottoclasse di [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex), a meno che l'utente non specifichi un tipo di socket diverso da [\<net.Socket\>](/it/nodejs/api/net#class-netsocket).

`callback` ha una firma di `(err, stream)`.

### `agent.keepSocketAlive(socket)` {#agentkeepsocketalivesocket}

**Aggiunto in: v8.1.0**

- `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Chiamato quando `socket` viene scollegato da una richiesta e potrebbe essere mantenuto attivo dall'`Agent`. Il comportamento predefinito è:

```js [ESM]
socket.setKeepAlive(true, this.keepAliveMsecs);
socket.unref();
return true;
```
Questo metodo può essere sovrascritto da una particolare sottoclasse di `Agent`. Se questo metodo restituisce un valore falsy, il socket verrà distrutto invece di essere mantenuto per l'uso con la richiesta successiva.

L'argomento `socket` può essere un'istanza di [\<net.Socket\>](/it/nodejs/api/net#class-netsocket), una sottoclasse di [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex).

### `agent.reuseSocket(socket, request)` {#agentreusesocketsocket-request}

**Aggiunto in: v8.1.0**

- `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)
- `request` [\<http.ClientRequest\>](/it/nodejs/api/http#class-httpclientrequest)

Chiamato quando `socket` è collegato a `request` dopo essere stato mantenuto attivo a causa delle opzioni di keep-alive. Il comportamento predefinito è:

```js [ESM]
socket.ref();
```
Questo metodo può essere sovrascritto da una particolare sottoclasse di `Agent`.

L'argomento `socket` può essere un'istanza di [\<net.Socket\>](/it/nodejs/api/net#class-netsocket), una sottoclasse di [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex).


### `agent.destroy()` {#agentdestroy}

**Aggiunto in: v0.11.4**

Distrugge tutti i socket attualmente in uso dall'agente.

Di solito non è necessario farlo. Tuttavia, se si utilizza un agente con `keepAlive` abilitato, è meglio spegnere esplicitamente l'agente quando non è più necessario. Altrimenti, i socket potrebbero rimanere aperti per un periodo di tempo piuttosto lungo prima che il server li termini.

### `agent.freeSockets` {#agentfreesockets}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | La proprietà ora ha un prototipo `null`. |
| v0.11.4 | Aggiunto in: v0.11.4 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un oggetto che contiene array di socket attualmente in attesa di essere utilizzati dall'agente quando `keepAlive` è abilitato. Non modificare.

I socket nella lista `freeSockets` verranno automaticamente distrutti e rimossi dall'array in caso di `'timeout'`.

### `agent.getName([options])` {#agentgetnameoptions}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.7.0, v16.15.0 | Il parametro `options` è ora opzionale. |
| v0.11.4 | Aggiunto in: v0.11.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un set di opzioni che forniscono informazioni per la generazione del nome
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nome di dominio o un indirizzo IP del server a cui inviare la richiesta
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta del server remoto
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Interfaccia locale a cui collegarsi per le connessioni di rete quando si invia la richiesta
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Deve essere 4 o 6 se questo non è uguale a `undefined`.
  
 
- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottiene un nome univoco per un set di opzioni di richiesta, per determinare se una connessione può essere riutilizzata. Per un agente HTTP, questo restituisce `host:port:localAddress` o `host:port:localAddress:family`. Per un agente HTTPS, il nome include CA, cert, ciphers e altre opzioni specifiche di HTTPS/TLS che determinano la riutilizzabilità del socket.


### `agent.maxFreeSockets` {#agentmaxfreesockets}

**Aggiunto in: v0.11.7**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Impostato di default a 256. Per gli agenti con `keepAlive` abilitato, questo imposta il numero massimo di socket che verranno lasciati aperti nello stato libero.

### `agent.maxSockets` {#agentmaxsockets}

**Aggiunto in: v0.3.6**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Impostato di default a `Infinity`. Determina quanti socket concorrenti l'agente può avere aperti per origine. L'origine è il valore restituito da [`agent.getName()`](/it/nodejs/api/http#agentgetnameoptions).

### `agent.maxTotalSockets` {#agentmaxtotalsockets}

**Aggiunto in: v14.5.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Impostato di default a `Infinity`. Determina quanti socket concorrenti l'agente può avere aperti. A differenza di `maxSockets`, questo parametro si applica a tutte le origini.

### `agent.requests` {#agentrequests}


::: info [Cronologia]
| Versione | Modifiche |
|---|---|
| v16.0.0 | La proprietà ora ha un prototipo `null`. |
| v0.5.9 | Aggiunto in: v0.5.9 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un oggetto che contiene code di richieste che non sono ancora state assegnate ai socket. Non modificare.

### `agent.sockets` {#agentsockets}


::: info [Cronologia]
| Versione | Modifiche |
|---|---|
| v16.0.0 | La proprietà ora ha un prototipo `null`. |
| v0.3.6 | Aggiunto in: v0.3.6 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un oggetto che contiene array di socket attualmente in uso dall'agente. Non modificare.

## Classe: `http.ClientRequest` {#class-httpclientrequest}

**Aggiunto in: v0.1.17**

- Estende: [\<http.OutgoingMessage\>](/it/nodejs/api/http#class-httpoutgoingmessage)

Questo oggetto viene creato internamente e restituito da [`http.request()`](/it/nodejs/api/http#httprequestoptions-callback). Rappresenta una richiesta *in corso* la cui intestazione è già stata accodata. L'intestazione è ancora mutabile usando le API [`setHeader(name, value)`](/it/nodejs/api/http#requestsetheadername-value), [`getHeader(name)`](/it/nodejs/api/http#requestgetheadername), [`removeHeader(name)`](/it/nodejs/api/http#requestremoveheadername). L'intestazione effettiva verrà inviata insieme al primo blocco di dati o quando si chiama [`request.end()`](/it/nodejs/api/http#requestenddata-encoding-callback).

Per ottenere la risposta, aggiungi un listener per [`'response'`](/it/nodejs/api/http#event-response) all'oggetto request. [`'response'`](/it/nodejs/api/http#event-response) verrà emesso dall'oggetto request quando le intestazioni di risposta sono state ricevute. L'evento [`'response'`](/it/nodejs/api/http#event-response) viene eseguito con un argomento che è un'istanza di [`http.IncomingMessage`](/it/nodejs/api/http#class-httpincomingmessage).

Durante l'evento [`'response'`](/it/nodejs/api/http#event-response), è possibile aggiungere listener all'oggetto response; in particolare per ascoltare l'evento `'data'`.

Se non viene aggiunto alcun gestore [`'response'`](/it/nodejs/api/http#event-response), la risposta verrà scartata interamente. Tuttavia, se viene aggiunto un gestore eventi [`'response'`](/it/nodejs/api/http#event-response), i dati dall'oggetto response **devono** essere consumati, chiamando `response.read()` ogni volta che c'è un evento `'readable'`, o aggiungendo un gestore `'data'`, o chiamando il metodo `.resume()`. Finché i dati non vengono consumati, l'evento `'end'` non verrà attivato. Inoltre, finché i dati non vengono letti, consumerà memoria che può alla fine portare a un errore di "processo senza memoria".

Per compatibilità con le versioni precedenti, `res` emetterà `'error'` solo se è registrato un listener `'error'`.

Imposta l'intestazione `Content-Length` per limitare la dimensione del corpo della risposta. Se [`response.strictContentLength`](/it/nodejs/api/http#responsestrictcontentlength) è impostato su `true`, la mancata corrispondenza del valore dell'intestazione `Content-Length` comporterà la generazione di un `Error`, identificato da `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/it/nodejs/api/errors#err_http_content_length_mismatch).

Il valore di `Content-Length` deve essere in byte, non in caratteri. Utilizzare [`Buffer.byteLength()`](/it/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) per determinare la lunghezza del corpo in byte.


### Event: `'abort'` {#event-abort}

**Aggiunto in: v1.4.1**

**Deprecato a partire da: v17.0.0, v16.12.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Ascoltare invece l'evento `'close'`.
:::

Emesso quando la richiesta è stata interrotta dal client. Questo evento viene emesso solo alla prima chiamata a `abort()`.

### Event: `'close'` {#event-close}

**Aggiunto in: v0.5.4**

Indica che la richiesta è stata completata o che la sua connessione sottostante è stata interrotta prematuramente (prima del completamento della risposta).

### Event: `'connect'` {#event-connect}

**Aggiunto in: v0.7.0**

- `response` [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Emesso ogni volta che un server risponde a una richiesta con un metodo `CONNECT`. Se questo evento non viene ascoltato, le connessioni dei client che ricevono un metodo `CONNECT` verranno chiuse.

È garantito che a questo evento venga passata un'istanza della classe [\<net.Socket\>](/it/nodejs/api/net#class-netsocket), una sottoclasse di [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex), a meno che l'utente non specifichi un tipo di socket diverso da [\<net.Socket\>](/it/nodejs/api/net#class-netsocket).

Una coppia client e server che dimostra come ascoltare l'evento `'connect'`:

::: code-group
```js [ESM]
import { createServer, request } from 'node:http';
import { connect } from 'node:net';
import { URL } from 'node:url';

// Crea un proxy di tunneling HTTP
const proxy = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Connettiti a un server di origine
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

// Ora che il proxy è in esecuzione
proxy.listen(1337, '127.0.0.1', () => {

  // Effettua una richiesta a un proxy di tunneling
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

    // Effettua una richiesta tramite un tunnel HTTP
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

// Crea un proxy di tunneling HTTP
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Connettiti a un server di origine
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

// Ora che il proxy è in esecuzione
proxy.listen(1337, '127.0.0.1', () => {

  // Effettua una richiesta a un proxy di tunneling
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

    // Effettua una richiesta tramite un tunnel HTTP
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

### Evento: `'continue'` {#event-continue}

**Aggiunto in: v0.3.2**

Emesso quando il server invia una risposta HTTP '100 Continue', di solito perché la richiesta conteneva 'Expect: 100-continue'. Questa è un'istruzione che indica al client di inviare il corpo della richiesta.

### Evento: `'finish'` {#event-finish}

**Aggiunto in: v0.3.6**

Emesso quando la richiesta è stata inviata. Più precisamente, questo evento viene emesso quando l'ultimo segmento delle intestazioni e del corpo della risposta sono stati passati al sistema operativo per la trasmissione sulla rete. Non implica che il server abbia ancora ricevuto qualcosa.

### Evento: `'information'` {#event-information}

**Aggiunto in: v10.0.0**

- `info` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `httpVersion` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `httpVersionMajor` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `httpVersionMinor` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusCode` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusMessage` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `headers` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rawHeaders` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Emesso quando il server invia una risposta intermedia 1xx (escluso l'aggiornamento 101). I listener di questo evento riceveranno un oggetto contenente la versione HTTP, il codice di stato, il messaggio di stato, l'oggetto intestazioni chiave-valore e l'array con i nomi delle intestazioni non elaborate seguiti dai rispettivi valori.



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

Gli stati di aggiornamento 101 non attivano questo evento a causa della loro interruzione dalla tradizionale catena di richiesta/risposta HTTP, come i socket web, gli aggiornamenti TLS in loco o HTTP 2.0. Per essere avvisati delle notifiche di aggiornamento 101, ascoltare invece l'evento [`'upgrade'`](/it/nodejs/api/http#event-upgrade).


### Evento: `'response'` {#event-response}

**Aggiunto in: v0.1.0**

- `response` [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage)

Emesso quando viene ricevuta una risposta a questa richiesta. Questo evento viene emesso solo una volta.

### Evento: `'socket'` {#event-socket}

**Aggiunto in: v0.5.3**

- `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

È garantito che a questo evento venga passato un'istanza della classe [\<net.Socket\>](/it/nodejs/api/net#class-netsocket), una sottoclasse di [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex), a meno che l'utente non specifichi un tipo di socket diverso da [\<net.Socket\>](/it/nodejs/api/net#class-netsocket).

### Evento: `'timeout'` {#event-timeout}

**Aggiunto in: v0.7.8**

Emesso quando il socket sottostante va in timeout a causa di inattività. Questo notifica solo che il socket è stato inattivo. La richiesta deve essere distrutta manualmente.

Vedi anche: [`request.setTimeout()`](/it/nodejs/api/http#requestsettimeouttimeout-callback).

### Evento: `'upgrade'` {#event-upgrade}

**Aggiunto in: v0.1.94**

- `response` [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Emesso ogni volta che un server risponde a una richiesta con un upgrade. Se questo evento non viene ascoltato e il codice di stato della risposta è 101 Switching Protocols, le connessioni dei client che ricevono un header di upgrade verranno chiuse.

È garantito che a questo evento venga passato un'istanza della classe [\<net.Socket\>](/it/nodejs/api/net#class-netsocket), una sottoclasse di [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex), a meno che l'utente non specifichi un tipo di socket diverso da [\<net.Socket\>](/it/nodejs/api/net#class-netsocket).

Una coppia client-server che dimostra come ascoltare l'evento `'upgrade'`.



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

**Aggiunto in: v0.3.8**

**Deprecato da: v14.1.0, v13.14.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Utilizzare invece [`request.destroy()`](/it/nodejs/api/http#requestdestroyerror).
:::

Marca la richiesta come interrotta. La chiamata a questo metodo farà sì che i dati rimanenti nella risposta vengano scartati e il socket venga distrutto.

### `request.aborted` {#requestaborted}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.0.0, v16.12.0 | Deprecato da: v17.0.0, v16.12.0 |
| v11.0.0 | La proprietà `aborted` non è più un numero di timestamp. |
| v0.11.14 | Aggiunto in: v0.11.14 |
:::

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Controllare invece [`request.destroyed`](/it/nodejs/api/http#requestdestroyed).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La proprietà `request.aborted` sarà `true` se la richiesta è stata interrotta.

### `request.connection` {#requestconnection}

**Aggiunto in: v0.3.0**

**Deprecato da: v13.0.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Utilizzare [`request.socket`](/it/nodejs/api/http#requestsocket).
:::

- [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Vedere [`request.socket`](/it/nodejs/api/http#requestsocket).

### `request.cork()` {#requestcork}

**Aggiunto in: v13.2.0, v12.16.0**

Vedere [`writable.cork()`](/it/nodejs/api/stream#writablecork).

### `request.end([data[, encoding]][, callback])` {#requestenddata-encoding-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Il parametro `data` può ora essere un `Uint8Array`. |
| v10.0.0 | Questo metodo ora restituisce un riferimento a `ClientRequest`. |
| v0.1.90 | Aggiunto in: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Termina l'invio della richiesta. Se delle parti del corpo non sono state inviate, le invierà al flusso. Se la richiesta è chunked, questo invierà il terminatore `'0\r\n\r\n'`.

Se `data` è specificato, è equivalente a chiamare [`request.write(data, encoding)`](/it/nodejs/api/http#requestwritechunk-encoding-callback) seguito da `request.end(callback)`.

Se `callback` è specificato, verrà chiamato quando il flusso di richiesta è terminato.


### `request.destroy([error])` {#requestdestroyerror}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.5.0 | La funzione restituisce `this` per coerenza con altri stream Readable. |
| v0.3.0 | Aggiunto in: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Opzionale, un errore da emettere con l'evento `'error'`.
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Distrugge la richiesta. Facoltativamente, emette un evento `'error'` ed emette un evento `'close'`. La chiamata a questo metodo farà sì che i dati rimanenti nella risposta vengano eliminati e che il socket venga distrutto.

Vedi [`writable.destroy()`](/it/nodejs/api/stream#writabledestroyerror) per ulteriori dettagli.

#### `request.destroyed` {#requestdestroyed}

**Aggiunto in: v14.1.0, v13.14.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` dopo che [`request.destroy()`](/it/nodejs/api/http#requestdestroyerror) è stato chiamato.

Vedi [`writable.destroyed`](/it/nodejs/api/stream#writabledestroyed) per ulteriori dettagli.

### `request.finished` {#requestfinished}

**Aggiunto in: v0.0.1**

**Deprecato dal: v13.4.0, v12.16.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Utilizzare [`request.writableEnded`](/it/nodejs/api/http#requestwritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La proprietà `request.finished` sarà `true` se [`request.end()`](/it/nodejs/api/http#requestenddata-encoding-callback) è stato chiamato. `request.end()` verrà chiamato automaticamente se la richiesta è stata avviata tramite [`http.get()`](/it/nodejs/api/http#httpgetoptions-callback).

### `request.flushHeaders()` {#requestflushheaders}

**Aggiunto in: v1.6.0**

Scarica gli header della richiesta.

Per motivi di efficienza, Node.js normalmente memorizza nel buffer gli header della richiesta finché non viene chiamato `request.end()` o non viene scritto il primo blocco di dati della richiesta. Quindi tenta di impacchettare gli header della richiesta e i dati in un singolo pacchetto TCP.

Questo è in genere desiderato (risparmia un round-trip TCP), ma non quando i primi dati non vengono inviati fino a molto tempo dopo. `request.flushHeaders()` aggira l'ottimizzazione e avvia la richiesta.


### `request.getHeader(name)` {#requestgetheadername}

**Aggiunto in: v1.6.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<qualsiasi\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Legge un header sulla richiesta. Il nome non fa distinzione tra maiuscole e minuscole. Il tipo del valore di ritorno dipende dagli argomenti forniti a [`request.setHeader()`](/it/nodejs/api/http#requestsetheadername-value).

```js [ESM]
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType' è 'text/html'
const contentLength = request.getHeader('Content-Length');
// 'contentLength' è di tipo number
const cookie = request.getHeader('Cookie');
// 'cookie' è di tipo string[]
```
### `request.getHeaderNames()` {#requestgetheadernames}

**Aggiunto in: v7.7.0**

- Restituisce: [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce un array contenente i nomi univoci degli header in uscita correnti. Tutti i nomi degli header sono in minuscolo.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getHeaderNames();
// headerNames === ['foo', 'cookie']
```
### `request.getHeaders()` {#requestgetheaders}

**Aggiunto in: v7.7.0**

- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce una copia superficiale degli header in uscita correnti. Poiché viene utilizzata una copia superficiale, i valori dell'array possono essere modificati senza ulteriori chiamate a vari metodi del modulo http relativi agli header. Le chiavi dell'oggetto restituito sono i nomi degli header e i valori sono i rispettivi valori degli header. Tutti i nomi degli header sono in minuscolo.

L'oggetto restituito dal metodo `request.getHeaders()` *non* eredita prototipicamente dall'`Oggetto` JavaScript. Ciò significa che i tipici metodi `Oggetto` come `obj.toString()`, `obj.hasOwnProperty()` e altri non sono definiti e *non funzioneranno*.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headers = request.getHeaders();
// headers === { foo: 'bar', 'cookie': ['foo=bar', 'bar=baz'] }
```

### `request.getRawHeaderNames()` {#requestgetrawheadernames}

**Aggiunto in: v15.13.0, v14.17.0**

- Restituisce: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce un array contenente i nomi univoci degli header raw in uscita correnti. I nomi degli header vengono restituiti con il loro casing esatto impostato.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getRawHeaderNames();
// headerNames === ['Foo', 'Set-Cookie']
```
### `request.hasHeader(name)` {#requesthasheadername}

**Aggiunto in: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'header identificato da `name` è attualmente impostato negli header in uscita. La corrispondenza del nome dell'header non fa distinzione tra maiuscole e minuscole.

```js [ESM]
const hasContentType = request.hasHeader('content-type');
```
### `request.maxHeadersCount` {#requestmaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `2000`

Limita il numero massimo di header di risposta. Se impostato su 0, non verrà applicato alcun limite.

### `request.path` {#requestpath}

**Aggiunto in: v0.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il percorso della richiesta.

### `request.method` {#requestmethod}

**Aggiunto in: v0.1.97**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il metodo della richiesta.

### `request.host` {#requesthost}

**Aggiunto in: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'host della richiesta.

### `request.protocol` {#requestprotocol}

**Aggiunto in: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il protocollo della richiesta.

### `request.removeHeader(name)` {#requestremoveheadername}

**Aggiunto in: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Rimuove un header già definito nell'oggetto headers.

```js [ESM]
request.removeHeader('Content-Type');
```

### `request.reusedSocket` {#requestreusedsocket}

**Aggiunto in: v13.0.0, v12.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se la richiesta viene inviata tramite un socket riutilizzato.

Quando si invia una richiesta tramite un agent con keep-alive abilitato, il socket sottostante potrebbe essere riutilizzato. Tuttavia, se il server chiude la connessione in un momento sfortunato, il client potrebbe incorrere in un errore 'ECONNRESET'.

::: code-group
```js [ESM]
import http from 'node:http';

// Il server ha un timeout di keep-alive di 5 secondi per impostazione predefinita
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Adattamento di un agent keep-alive
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // Non fare nulla
    });
  });
}, 5000); // Invio della richiesta a intervalli di 5 secondi, quindi è facile raggiungere il timeout di inattività
```

```js [CJS]
const http = require('node:http');

// Il server ha un timeout di keep-alive di 5 secondi per impostazione predefinita
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Adattamento di un agent keep-alive
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // Non fare nulla
    });
  });
}, 5000); // Invio della richiesta a intervalli di 5 secondi, quindi è facile raggiungere il timeout di inattività
```
:::

Contrassegnando una richiesta che ha riutilizzato o meno il socket, possiamo eseguire un nuovo tentativo automatico in base ad esso.

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
      // Controlla se è necessario un nuovo tentativo
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
      // Controlla se è necessario un nuovo tentativo
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```
:::


### `request.setHeader(name, value)` {#requestsetheadername-value}

**Aggiunto in: v1.6.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<qualsiasi\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Imposta un singolo valore di intestazione per l'oggetto headers. Se questa intestazione esiste già nelle intestazioni da inviare, il suo valore verrà sostituito. Utilizzare un array di stringhe qui per inviare più intestazioni con lo stesso nome. I valori non stringa verranno memorizzati senza modifiche. Pertanto, [`request.getHeader()`](/it/nodejs/api/http#requestgetheadername) può restituire valori non stringa. Tuttavia, i valori non stringa verranno convertiti in stringhe per la trasmissione di rete.

```js [ESM]
request.setHeader('Content-Type', 'application/json');
```
oppure

```js [ESM]
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
```
Quando il valore è una stringa, verrà generata un'eccezione se contiene caratteri al di fuori della codifica `latin1`.

Se devi passare caratteri UTF-8 nel valore, codifica il valore utilizzando lo standard [RFC 8187](https://www.rfc-editor.org/rfc/rfc8187.txt).

```js [ESM]
const filename = 'Rock 🎵.txt';
request.setHeader('Content-Disposition', `attachment; filename*=utf-8''${encodeURIComponent(filename)}`);
```
### `request.setNoDelay([noDelay])` {#requestsetnodelaynodelay}

**Aggiunto in: v0.5.9**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Una volta che un socket è assegnato a questa richiesta ed è connesso, verrà chiamato [`socket.setNoDelay()`](/it/nodejs/api/net#socketsetnodelaynodelay).

### `request.setSocketKeepAlive([enable][, initialDelay])` {#requestsetsocketkeepaliveenable-initialdelay}

**Aggiunto in: v0.5.9**

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Una volta che un socket è assegnato a questa richiesta ed è connesso, verrà chiamato [`socket.setKeepAlive()`](/it/nodejs/api/net#socketsetkeepaliveenable-initialdelay).


### `request.setTimeout(timeout[, callback])` {#requestsettimeouttimeout-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.0.0 | Imposta in modo coerente il timeout del socket solo quando il socket si connette. |
| v0.5.9 | Aggiunto in: v0.5.9 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Millisecondi prima che una richiesta vada in timeout.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione opzionale da chiamare quando si verifica un timeout. Come il binding all'evento `'timeout'`.
- Restituisce: [\<http.ClientRequest\>](/it/nodejs/api/http#class-httpclientrequest)

Una volta che un socket viene assegnato a questa richiesta ed è connesso, verrà chiamato [`socket.setTimeout()`](/it/nodejs/api/net#socketsettimeouttimeout-callback).

### `request.socket` {#requestsocket}

**Aggiunto in: v0.3.0**

- [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Riferimento al socket sottostante. Di solito gli utenti non vorranno accedere a questa proprietà. In particolare, il socket non emetterà eventi `'readable'` a causa del modo in cui il parser del protocollo si collega al socket.

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
  console.log(`Il tuo indirizzo IP è ${ip} e la tua porta di origine è ${port}.`);
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
  console.log(`Il tuo indirizzo IP è ${ip} e la tua porta di origine è ${port}.`);
  // Consume response object
});
```
:::

Questa proprietà è garantita essere un'istanza della classe [\<net.Socket\>](/it/nodejs/api/net#class-netsocket), una sottoclasse di [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex), a meno che l'utente non abbia specificato un tipo di socket diverso da [\<net.Socket\>](/it/nodejs/api/net#class-netsocket).


### `request.uncork()` {#requestuncork}

**Aggiunto in: v13.2.0, v12.16.0**

Vedi [`writable.uncork()`](/it/nodejs/api/stream#writableuncork).

### `request.writableEnded` {#requestwritableended}

**Aggiunto in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` dopo che è stato chiamato [`request.end()`](/it/nodejs/api/http#requestenddata-encoding-callback). Questa proprietà non indica se i dati sono stati scaricati, per questo usa invece [`request.writableFinished`](/it/nodejs/api/http#requestwritablefinished).

### `request.writableFinished` {#requestwritablefinished}

**Aggiunto in: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` se tutti i dati sono stati scaricati nel sistema sottostante, immediatamente prima che venga emesso l'evento [`'finish'`](/it/nodejs/api/http#event-finish).

### `request.write(chunk[, encoding][, callback])` {#requestwritechunk-encoding-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Il parametro `chunk` ora può essere un `Uint8Array`. |
| v0.1.29 | Aggiunto in: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Invia un chunk del body. Questo metodo può essere chiamato più volte. Se non è impostato `Content-Length`, i dati verranno automaticamente codificati nella codifica di trasferimento HTTP Chunked, in modo che il server sappia quando i dati terminano. L'intestazione `Transfer-Encoding: chunked` viene aggiunta. Chiamare [`request.end()`](/it/nodejs/api/http#requestenddata-encoding-callback) è necessario per terminare l'invio della richiesta.

L'argomento `encoding` è opzionale e si applica solo quando `chunk` è una stringa. Il valore predefinito è `'utf8'`.

L'argomento `callback` è opzionale e verrà chiamato quando questo chunk di dati viene scaricato, ma solo se il chunk non è vuoto.

Restituisce `true` se tutti i dati sono stati scaricati con successo nel buffer del kernel. Restituisce `false` se tutti o parte dei dati sono stati accodati nella memoria utente. `'drain'` verrà emesso quando il buffer sarà di nuovo libero.

Quando la funzione `write` viene chiamata con una stringa o un buffer vuoto, non fa nulla e attende ulteriori input.


## Classe: `http.Server` {#class-httpserver}

**Aggiunto in: v0.1.17**

- Estende: [\<net.Server\>](/it/nodejs/api/net#class-netserver)

### Evento: `'checkContinue'` {#event-checkcontinue}

**Aggiunto in: v0.3.0**

- `request` [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/it/nodejs/api/http#class-httpserverresponse)

Emesso ogni volta che viene ricevuta una richiesta con un `Expect: 100-continue` HTTP. Se questo evento non viene ascoltato, il server risponderà automaticamente con un `100 Continue` come appropriato.

La gestione di questo evento comporta la chiamata a [`response.writeContinue()`](/it/nodejs/api/http#responsewritecontinue) se il client deve continuare a inviare il corpo della richiesta, oppure la generazione di una risposta HTTP appropriata (ad es. 400 Bad Request) se il client non deve continuare a inviare il corpo della richiesta.

Quando questo evento viene emesso e gestito, l'evento [`'request'`](/it/nodejs/api/http#event-request) non verrà emesso.

### Evento: `'checkExpectation'` {#event-checkexpectation}

**Aggiunto in: v5.5.0**

- `request` [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/it/nodejs/api/http#class-httpserverresponse)

Emesso ogni volta che viene ricevuta una richiesta con un header `Expect` HTTP, dove il valore non è `100-continue`. Se questo evento non viene ascoltato, il server risponderà automaticamente con un `417 Expectation Failed` come appropriato.

Quando questo evento viene emesso e gestito, l'evento [`'request'`](/it/nodejs/api/http#event-request) non verrà emesso.

### Evento: `'clientError'` {#event-clienterror}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Il comportamento predefinito restituirà un 431 Request Header Fields Too Large se si verifica un errore HPE_HEADER_OVERFLOW. |
| v9.4.0 | `rawPacket` è il buffer corrente appena analizzato. L'aggiunta di questo buffer all'oggetto errore dell'evento `'clientError'` consente agli sviluppatori di registrare il pacchetto danneggiato. |
| v6.0.0 | L'azione predefinita di chiamare `.destroy()` sul `socket` non avrà più luogo se ci sono listener collegati per `'clientError'`. |
| v0.1.94 | Aggiunto in: v0.1.94 |
:::

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Se una connessione client emette un evento `'error'`, verrà inoltrato qui. Il listener di questo evento è responsabile della chiusura/distruzione del socket sottostante. Ad esempio, si potrebbe desiderare di chiudere più elegantemente il socket con una risposta HTTP personalizzata invece di interrompere bruscamente la connessione. Il socket **deve essere chiuso o distrutto** prima che il listener termini.

È garantito che questo evento venga passato a un'istanza della classe [\<net.Socket\>](/it/nodejs/api/net#class-netsocket), una sottoclasse di [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex), a meno che l'utente non specifichi un tipo di socket diverso da [\<net.Socket\>](/it/nodejs/api/net#class-netsocket).

Il comportamento predefinito consiste nel provare a chiudere il socket con un HTTP '400 Bad Request' o un HTTP '431 Request Header Fields Too Large' nel caso di un errore [`HPE_HEADER_OVERFLOW`](/it/nodejs/api/errors#hpe_header_overflow). Se il socket non è scrivibile o le intestazioni dell'attuale [`http.ServerResponse`](/it/nodejs/api/http#class-httpserverresponse) allegato sono state inviate, viene immediatamente distrutto.

`socket` è l'oggetto [`net.Socket`](/it/nodejs/api/net#class-netsocket) da cui ha avuto origine l'errore.



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

Quando si verifica l'evento `'clientError'`, non ci sono oggetti `request` o `response`, quindi qualsiasi risposta HTTP inviata, incluse le intestazioni di risposta e il payload, *deve* essere scritta direttamente sull'oggetto `socket`. Bisogna fare attenzione per assicurarsi che la risposta sia un messaggio di risposta HTTP formattato correttamente.

`err` è un'istanza di `Error` con due colonne extra:

- `bytesParsed`: il conteggio dei byte del pacchetto di richiesta che Node.js potrebbe aver analizzato correttamente;
- `rawPacket`: il pacchetto raw della richiesta corrente.

In alcuni casi, il client ha già ricevuto la risposta e/o il socket è già stato distrutto, come nel caso degli errori `ECONNRESET`. Prima di provare a inviare dati al socket, è meglio verificare che sia ancora scrivibile.

```js [ESM]
server.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
```

### Evento: `'close'` {#event-close_1}

**Aggiunto in: v0.1.4**

Emesso quando il server si chiude.

### Evento: `'connect'` {#event-connect_1}

**Aggiunto in: v0.7.0**

- `request` [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage) Argomenti per la richiesta HTTP, come nell'evento [`'request'`](/it/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex) Socket di rete tra il server e il client
- `head` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Il primo pacchetto del flusso di tunneling (può essere vuoto)

Emesso ogni volta che un client richiede un metodo HTTP `CONNECT`. Se questo evento non viene ascoltato, le connessioni dei client che richiedono un metodo `CONNECT` verranno chiuse.

È garantito che a questo evento venga passato un'istanza della classe [\<net.Socket\>](/it/nodejs/api/net#class-netsocket), una sottoclasse di [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex), a meno che l'utente non specifichi un tipo di socket diverso da [\<net.Socket\>](/it/nodejs/api/net#class-netsocket).

Dopo che questo evento è stato emesso, il socket della richiesta non avrà un listener di eventi `'data'`, il che significa che dovrà essere associato per gestire i dati inviati al server su quel socket.

### Evento: `'connection'` {#event-connection}

**Aggiunto in: v0.1.0**

- `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Questo evento viene emesso quando viene stabilito un nuovo flusso TCP. `socket` è in genere un oggetto di tipo [`net.Socket`](/it/nodejs/api/net#class-netsocket). Di solito gli utenti non vorranno accedere a questo evento. In particolare, il socket non emetterà eventi `'readable'` a causa del modo in cui il parser del protocollo si collega al socket. È possibile accedere al `socket` anche in `request.socket`.

Questo evento può anche essere emesso esplicitamente dagli utenti per iniettare connessioni nel server HTTP. In tal caso, può essere passato qualsiasi flusso [`Duplex`](/it/nodejs/api/stream#class-streamduplex).

Se qui viene chiamato `socket.setTimeout()`, il timeout verrà sostituito con `server.keepAliveTimeout` quando il socket ha servito una richiesta (se `server.keepAliveTimeout` è diverso da zero).

È garantito che a questo evento venga passato un'istanza della classe [\<net.Socket\>](/it/nodejs/api/net#class-netsocket), una sottoclasse di [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex), a meno che l'utente non specifichi un tipo di socket diverso da [\<net.Socket\>](/it/nodejs/api/net#class-netsocket).


### Evento: `'dropRequest'` {#event-droprequest}

**Aggiunto in: v18.7.0, v16.17.0**

- `request` [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage) Argomenti per la richiesta HTTP, come nell'evento [`'request'`](/it/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex) Socket di rete tra il server e il client

Quando il numero di richieste su un socket raggiunge la soglia di `server.maxRequestsPerSocket`, il server abbandonerà le nuove richieste ed emetterà invece l'evento `'dropRequest'`, quindi invierà `503` al client.

### Evento: `'request'` {#event-request}

**Aggiunto in: v0.1.0**

- `request` [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/it/nodejs/api/http#class-httpserverresponse)

Emesso ogni volta che c'è una richiesta. Ci possono essere più richieste per connessione (nel caso di connessioni HTTP Keep-Alive).

### Evento: `'upgrade'` {#event-upgrade_1}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Non ascoltare questo evento non causa più la distruzione del socket se un client invia un header Upgrade. |
| v0.1.94 | Aggiunto in: v0.1.94 |
:::

- `request` [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage) Argomenti per la richiesta HTTP, come nell'evento [`'request'`](/it/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex) Socket di rete tra il server e il client
- `head` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Il primo pacchetto dello stream aggiornato (può essere vuoto)

Emesso ogni volta che un client richiede un upgrade HTTP. L'ascolto di questo evento è opzionale e i client non possono insistere su un cambio di protocollo.

Dopo che questo evento è stato emesso, il socket della richiesta non avrà un listener di eventi `'data'`, il che significa che dovrà essere collegato per gestire i dati inviati al server su quel socket.

È garantito che a questo evento venga passata un'istanza della classe [\<net.Socket\>](/it/nodejs/api/net#class-netsocket), una sottoclasse di [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex), a meno che l'utente non specifichi un tipo di socket diverso da [\<net.Socket\>](/it/nodejs/api/net#class-netsocket).


### `server.close([callback])` {#serverclosecallback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Il metodo chiude le connessioni inattive prima di restituire. |
| v0.1.90 | Aggiunto in: v0.1.90 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Impedisce al server di accettare nuove connessioni e chiude tutte le connessioni connesse a questo server che non stanno inviando una richiesta o aspettando una risposta. Vedere [`net.Server.close()`](/it/nodejs/api/net#serverclosecallback).

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Chiudi il server dopo 10 secondi
setTimeout(() => {
  server.close(() => {
    console.log('server sulla porta 8000 chiuso correttamente');
  });
}, 10000);
```
### `server.closeAllConnections()` {#servercloseallconnections}

**Aggiunto in: v18.2.0**

Chiude tutte le connessioni HTTP(S) stabilite connesse a questo server, incluse le connessioni attive connesse a questo server che stanno inviando una richiesta o aspettando una risposta. Questo *non* distrugge i socket aggiornati a un protocollo diverso, come WebSocket o HTTP/2.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Chiudi il server dopo 10 secondi
setTimeout(() => {
  server.close(() => {
    console.log('server sulla porta 8000 chiuso correttamente');
  });
  // Chiude tutte le connessioni, assicurandosi che il server si chiuda correttamente
  server.closeAllConnections();
}, 10000);
```
### `server.closeIdleConnections()` {#servercloseidleconnections}

**Aggiunto in: v18.2.0**

Chiude tutte le connessioni connesse a questo server che non stanno inviando una richiesta o aspettando una risposta.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Chiudi il server dopo 10 secondi
setTimeout(() => {
  server.close(() => {
    console.log('server sulla porta 8000 chiuso correttamente');
  });
  // Chiude le connessioni inattive, come le connessioni keep-alive. Il server si chiuderà
  // una volta terminate le connessioni attive rimanenti
  server.closeIdleConnections();
}, 10000);
```

### `server.headersTimeout` {#serverheaderstimeout}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.4.0, v18.14.0 | Il valore predefinito è ora impostato sul minimo tra 60000 (60 secondi) o `requestTimeout`. |
| v11.3.0, v10.14.0 | Aggiunto in: v11.3.0, v10.14.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** Il minimo tra [`server.requestTimeout`](/it/nodejs/api/http#serverrequesttimeout) o `60000`.

Limita la quantità di tempo che il parser attenderà per ricevere le intestazioni HTTP complete.

Se il timeout scade, il server risponde con lo stato 408 senza inoltrare la richiesta al listener delle richieste e quindi chiude la connessione.

Deve essere impostato su un valore diverso da zero (ad esempio 120 secondi) per proteggere da potenziali attacchi Denial-of-Service nel caso in cui il server venga distribuito senza un reverse proxy davanti.

### `server.listen()` {#serverlisten}

Avvia il server HTTP in ascolto di connessioni. Questo metodo è identico a [`server.listen()`](/it/nodejs/api/net#serverlisten) da [`net.Server`](/it/nodejs/api/net#class-netserver).

### `server.listening` {#serverlistening}

**Aggiunto in: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se il server è in ascolto di connessioni.

### `server.maxHeadersCount` {#servermaxheaderscount}

**Aggiunto in: v0.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `2000`

Limita il numero massimo di intestazioni in entrata. Se impostato su 0, non verrà applicato alcun limite.

### `server.requestTimeout` {#serverrequesttimeout}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Il timeout di richiesta predefinito è cambiato da nessun timeout a 300s (5 minuti). |
| v14.11.0 | Aggiunto in: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `300000`

Imposta il valore di timeout in millisecondi per la ricezione dell'intera richiesta dal client.

Se il timeout scade, il server risponde con lo stato 408 senza inoltrare la richiesta al listener delle richieste e quindi chiude la connessione.

Deve essere impostato su un valore diverso da zero (ad esempio 120 secondi) per proteggere da potenziali attacchi Denial-of-Service nel caso in cui il server venga distribuito senza un reverse proxy davanti.


### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.0.0 | Il timeout predefinito è cambiato da 120s a 0 (nessun timeout). |
| v0.9.12 | Aggiunto in: v0.9.12 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** 0 (nessun timeout)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<http.Server\>](/it/nodejs/api/http#class-httpserver)

Imposta il valore di timeout per i socket ed emette un evento `'timeout'` sull'oggetto Server, passando il socket come argomento, se si verifica un timeout.

Se è presente un listener di eventi `'timeout'` sull'oggetto Server, verrà chiamato con il socket scaduto come argomento.

Per impostazione predefinita, il Server non imposta il timeout dei socket. Tuttavia, se viene assegnata una callback all'evento `'timeout'` del Server, i timeout devono essere gestiti esplicitamente.

### `server.maxRequestsPerSocket` {#servermaxrequestspersocket}

**Aggiunto in: v16.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Richieste per socket. **Predefinito:** 0 (nessun limite)

Il numero massimo di richieste che un socket può gestire prima di chiudere la connessione keep-alive.

Un valore di `0` disabiliterà il limite.

Quando viene raggiunto il limite, imposterà il valore dell'intestazione `Connection` su `close`, ma in realtà non chiuderà la connessione, le richieste successive inviate dopo il raggiungimento del limite riceveranno `503 Servizio non disponibile` come risposta.

### `server.timeout` {#servertimeout}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.0.0 | Il timeout predefinito è cambiato da 120s a 0 (nessun timeout). |
| v0.9.12 | Aggiunto in: v0.9.12 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Timeout in millisecondi. **Predefinito:** 0 (nessun timeout)

Il numero di millisecondi di inattività prima che si presuma che un socket sia scaduto.

Un valore di `0` disabiliterà il comportamento di timeout sulle connessioni in entrata.

La logica del timeout del socket viene impostata sulla connessione, quindi la modifica di questo valore influisce solo sulle nuove connessioni al server, non su quelle esistenti.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**Aggiunto in: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Timeout in millisecondi. **Predefinito:** `5000` (5 secondi).

Il numero di millisecondi di inattività che un server deve attendere per ulteriori dati in entrata, dopo aver terminato di scrivere l'ultima risposta, prima che un socket venga distrutto. Se il server riceve nuovi dati prima che il timeout keep-alive sia scaduto, reimposterà il timeout di inattività regolare, ovvero [`server.timeout`](/it/nodejs/api/http#servertimeout).

Un valore di `0` disabiliterà il comportamento del timeout keep-alive sulle connessioni in entrata. Un valore di `0` fa sì che il server http si comporti in modo simile alle versioni di Node.js precedenti alla 8.0.0, che non avevano un timeout keep-alive.

La logica del timeout del socket è impostata sulla connessione, quindi la modifica di questo valore influisce solo sulle nuove connessioni al server, non su quelle esistenti.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Aggiunto in: v20.4.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Chiama [`server.close()`](/it/nodejs/api/http#serverclosecallback) e restituisce una promise che si realizza quando il server è stato chiuso.

## Classe: `http.ServerResponse` {#class-httpserverresponse}

**Aggiunto in: v0.1.17**

- Estende: [\<http.OutgoingMessage\>](/it/nodejs/api/http#class-httpoutgoingmessage)

Questo oggetto viene creato internamente da un server HTTP, non dall'utente. Viene passato come secondo parametro all'evento [`'request'`](/it/nodejs/api/http#event-request).

### Evento: `'close'` {#event-close_2}

**Aggiunto in: v0.6.7**

Indica che la risposta è completata o che la sua connessione sottostante è stata terminata prematuramente (prima del completamento della risposta).

### Evento: `'finish'` {#event-finish_1}

**Aggiunto in: v0.3.6**

Emesso quando la risposta è stata inviata. Più precisamente, questo evento viene emesso quando l'ultimo segmento delle intestazioni e del corpo della risposta è stato consegnato al sistema operativo per la trasmissione sulla rete. Ciò non implica che il client abbia già ricevuto qualcosa.


### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**Aggiunta in: v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Questo metodo aggiunge header finali HTTP (un header ma alla fine del messaggio) alla risposta.

I trailer saranno emessi **solo** se la codifica a blocchi è utilizzata per la risposta; se non lo è (ad es. se la richiesta era HTTP/1.0), saranno scartati silenziosamente.

HTTP richiede che l'header `Trailer` sia inviato per emettere i trailer, con una lista dei campi header nel suo valore. Es.,

```js [ESM]
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
```
Tentare di impostare un nome di campo header o un valore che contiene caratteri non validi risulterà in un [`TypeError`](/it/nodejs/api/errors#class-typeerror) che viene lanciato.

### `response.connection` {#responseconnection}

**Aggiunta in: v0.3.0**

**Deprecata dal: v13.0.0**

::: danger [Stabile: 0 - Deprecata]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecata. Usa [`response.socket`](/it/nodejs/api/http#responsesocket).
:::

- [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Vedi [`response.socket`](/it/nodejs/api/http#responsesocket).

### `response.cork()` {#responsecork}

**Aggiunta in: v13.2.0, v12.16.0**

Vedi [`writable.cork()`](/it/nodejs/api/stream#writablecork).

### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Il parametro `data` ora può essere un `Uint8Array`. |
| v10.0.0 | Questo metodo ora restituisce un riferimento a `ServerResponse`. |
| v0.1.90 | Aggiunta in: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Questo metodo segnala al server che tutti gli header e il corpo della risposta sono stati inviati; quel server dovrebbe considerare questo messaggio completo. Il metodo, `response.end()`, DEVE essere chiamato su ogni risposta.

Se `data` è specificato, ha un effetto simile a chiamare [`response.write(data, encoding)`](/it/nodejs/api/http#responsewritechunk-encoding-callback) seguito da `response.end(callback)`.

Se `callback` è specificato, sarà chiamato quando lo stream di risposta è terminato.


### `response.finished` {#responsefinished}

**Aggiunto in: v0.0.2**

**Deprecato a partire da: v13.4.0, v12.16.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Usa [`response.writableEnded`](/it/nodejs/api/http#responsewritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La proprietà `response.finished` sarà `true` se è stato chiamato [`response.end()`](/it/nodejs/api/http#responseenddata-encoding-callback).

### `response.flushHeaders()` {#responseflushheaders}

**Aggiunto in: v1.6.0**

Scarica gli header della risposta. Vedi anche: [`request.flushHeaders()`](/it/nodejs/api/http#requestflushheaders).

### `response.getHeader(name)` {#responsegetheadername}

**Aggiunto in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Legge un header che è già stato accodato ma non inviato al client. Il nome non fa distinzione tra maiuscole e minuscole. Il tipo del valore restituito dipende dagli argomenti forniti a [`response.setHeader()`](/it/nodejs/api/http#responsesetheadername-value).

```js [ESM]
response.setHeader('Content-Type', 'text/html');
response.setHeader('Content-Length', Buffer.byteLength(body));
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
const contentType = response.getHeader('content-type');
// contentType è 'text/html'
const contentLength = response.getHeader('Content-Length');
// contentLength è di tipo number
const setCookie = response.getHeader('set-cookie');
// setCookie è di tipo string[]
```
### `response.getHeaderNames()` {#responsegetheadernames}

**Aggiunto in: v7.7.0**

- Restituisce: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce un array contenente i nomi univoci degli header in uscita correnti. Tutti i nomi degli header sono in minuscolo.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```

### `response.getHeaders()` {#responsegetheaders}

**Aggiunto in: v7.7.0**

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce una copia superficiale delle intestazioni in uscita correnti. Poiché viene utilizzata una copia superficiale, i valori degli array possono essere modificati senza ulteriori chiamate a vari metodi del modulo http relativi all'intestazione. Le chiavi dell'oggetto restituito sono i nomi delle intestazioni e i valori sono i rispettivi valori delle intestazioni. Tutti i nomi delle intestazioni sono in minuscolo.

L'oggetto restituito dal metodo `response.getHeaders()` *non* eredita prototipicamente dall'oggetto JavaScript `Object`. Ciò significa che i tipici metodi `Object` come `obj.toString()`, `obj.hasOwnProperty()` e altri non sono definiti e *non funzioneranno*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `response.hasHeader(name)` {#responsehasheadername}

**Aggiunto in: v7.7.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'intestazione identificata da `name` è attualmente impostata nelle intestazioni in uscita. La corrispondenza del nome dell'intestazione non fa distinzione tra maiuscole e minuscole.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
### `response.headersSent` {#responseheaderssent}

**Aggiunto in: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Booleano (sola lettura). True se le intestazioni sono state inviate, false altrimenti.

### `response.removeHeader(name)` {#responseremoveheadername}

**Aggiunto in: v0.4.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Rimuove un'intestazione che è in coda per l'invio implicito.

```js [ESM]
response.removeHeader('Content-Encoding');
```
### `response.req` {#responsereq}

**Aggiunto in: v15.7.0**

- [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage)

Un riferimento all'oggetto `request` HTTP originale.


### `response.sendDate` {#responsesenddate}

**Aggiunto in: v0.7.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Quando è true, l'intestazione Date verrà generata e inviata automaticamente nella risposta se non è già presente nelle intestazioni. Il valore predefinito è true.

Questo dovrebbe essere disabilitato solo per i test; HTTP richiede l'intestazione Date nelle risposte.

### `response.setHeader(name, value)` {#responsesetheadername-value}

**Aggiunto in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<http.ServerResponse\>](/it/nodejs/api/http#class-httpserverresponse)

Restituisce l'oggetto risposta.

Imposta un singolo valore di intestazione per le intestazioni implicite. Se questa intestazione esiste già nelle intestazioni da inviare, il suo valore verrà sostituito. Usa un array di stringhe qui per inviare più intestazioni con lo stesso nome. I valori non stringa verranno archiviati senza modifiche. Pertanto, [`response.getHeader()`](/it/nodejs/api/http#responsegetheadername) potrebbe restituire valori non stringa. Tuttavia, i valori non stringa verranno convertiti in stringhe per la trasmissione di rete. Lo stesso oggetto risposta viene restituito al chiamante, per consentire l'incatenamento delle chiamate.

```js [ESM]
response.setHeader('Content-Type', 'text/html');
```
oppure

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
Tentare di impostare un nome di campo di intestazione o un valore che contenga caratteri non validi comporterà il lancio di un [`TypeError`](/it/nodejs/api/errors#class-typeerror).

Quando le intestazioni sono state impostate con [`response.setHeader()`](/it/nodejs/api/http#responsesetheadername-value), verranno unite a tutte le intestazioni passate a [`response.writeHead()`](/it/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), con le intestazioni passate a [`response.writeHead()`](/it/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) che hanno la precedenza.

```js [ESM]
// Restituisce content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
Se il metodo [`response.writeHead()`](/it/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) viene chiamato e questo metodo non è stato chiamato, scriverà direttamente i valori dell'intestazione forniti sul canale di rete senza memorizzare nella cache internamente e il [`response.getHeader()`](/it/nodejs/api/http#responsegetheadername) sull'intestazione non produrrà il risultato previsto. Se si desidera il popolamento progressivo delle intestazioni con potenziale recupero e modifica futuri, utilizzare [`response.setHeader()`](/it/nodejs/api/http#responsesetheadername-value) invece di [`response.writeHead()`](/it/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers).


### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**Aggiunto in: v0.9.12**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<http.ServerResponse\>](/it/nodejs/api/http#class-httpserverresponse)

Imposta il valore di timeout del Socket a `msecs`. Se viene fornito un callback, viene aggiunto come listener all'evento `'timeout'` sull'oggetto response.

Se nessun listener `'timeout'` viene aggiunto alla request, alla response o al server, i socket vengono distrutti quando scadono. Se un gestore viene assegnato agli eventi `'timeout'` della request, della response o del server, i socket scaduti devono essere gestiti esplicitamente.

### `response.socket` {#responsesocket}

**Aggiunto in: v0.3.0**

- [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Riferimento al socket sottostante. Di solito gli utenti non vorranno accedere a questa proprietà. In particolare, il socket non emetterà eventi `'readable'` a causa del modo in cui il parser del protocollo si collega al socket. Dopo `response.end()`, la proprietà viene impostata su null.

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

È garantito che questa proprietà sia un'istanza della classe [\<net.Socket\>](/it/nodejs/api/net#class-netsocket), una sottoclasse di [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex), a meno che l'utente non abbia specificato un tipo di socket diverso da [\<net.Socket\>](/it/nodejs/api/net#class-netsocket).

### `response.statusCode` {#responsestatuscode}

**Aggiunto in: v0.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `200`

Quando si utilizzano intestazioni implicite (senza chiamare esplicitamente [`response.writeHead()`](/it/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)), questa proprietà controlla il codice di stato che verrà inviato al client quando le intestazioni vengono scaricate.

```js [ESM]
response.statusCode = 404;
```
Dopo che l'intestazione della risposta è stata inviata al client, questa proprietà indica il codice di stato che è stato inviato.


### `response.statusMessage` {#responsestatusmessage}

**Aggiunto in: v0.11.8**

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Quando si utilizzano intestazioni implicite (senza chiamare esplicitamente [`response.writeHead()`](/it/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)), questa proprietà controlla il messaggio di stato che verrà inviato al client quando le intestazioni vengono scaricate. Se questo viene lasciato come `undefined`, verrà utilizzato il messaggio standard per il codice di stato.

```js [ESM]
response.statusMessage = 'Non trovato';
```
Dopo che l'intestazione della risposta è stata inviata al client, questa proprietà indica il messaggio di stato che è stato inviato.

### `response.strictContentLength` {#responsestrictcontentlength}

**Aggiunto in: v18.10.0, v16.18.0**

- [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`

Se impostato su `true`, Node.js controllerà se il valore dell'intestazione `Content-Length` e la dimensione del corpo, in byte, sono uguali. La mancata corrispondenza del valore dell'intestazione `Content-Length` comporterà la generazione di un `Error`, identificato da `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/it/nodejs/api/errors#err_http_content_length_mismatch).

### `response.uncork()` {#responseuncork}

**Aggiunto in: v13.2.0, v12.16.0**

Vedi [`writable.uncork()`](/it/nodejs/api/stream#writableuncork).

### `response.writableEnded` {#responsewritableended}

**Aggiunto in: v12.9.0**

- [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` dopo che è stato chiamato [`response.end()`](/it/nodejs/api/http#responseenddata-encoding-callback). Questa proprietà non indica se i dati sono stati scaricati, per questo usa invece [`response.writableFinished`](/it/nodejs/api/http#responsewritablefinished).

### `response.writableFinished` {#responsewritablefinished}

**Aggiunto in: v12.7.0**

- [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` se tutti i dati sono stati scaricati nel sistema sottostante, immediatamente prima che venga emesso l'evento [`'finish'`](/it/nodejs/api/http#event-finish).

### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Il parametro `chunk` ora può essere un `Uint8Array`. |
| v0.1.29 | Aggiunto in: v0.1.29 |
:::

- `chunk` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se questo metodo viene chiamato e [`response.writeHead()`](/it/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) non è stato chiamato, passerà alla modalità di intestazione implicita e scaricherà le intestazioni implicite.

Questo invia un blocco del corpo della risposta. Questo metodo può essere chiamato più volte per fornire parti successive del corpo.

Se `rejectNonStandardBodyWrites` è impostato su true in `createServer`, la scrittura nel corpo non è consentita quando il metodo di richiesta o lo stato della risposta non supportano il contenuto. Se si tenta di scrivere nel corpo per una richiesta HEAD o come parte di una risposta `204` o `304`, viene generato un `Error` sincrono con il codice `ERR_HTTP_BODY_NOT_ALLOWED`.

`chunk` può essere una stringa o un buffer. Se `chunk` è una stringa, il secondo parametro specifica come codificarla in un flusso di byte. `callback` verrà chiamato quando questo blocco di dati viene scaricato.

Questo è il corpo HTTP non elaborato e non ha nulla a che fare con le codifiche del corpo multi-parte di livello superiore che possono essere utilizzate.

La prima volta che viene chiamato [`response.write()`](/it/nodejs/api/http#responsewritechunk-encoding-callback), invierà le informazioni sull'intestazione memorizzate nel buffer e il primo blocco del corpo al client. La seconda volta che viene chiamato [`response.write()`](/it/nodejs/api/http#responsewritechunk-encoding-callback), Node.js presume che i dati verranno trasmessi in streaming e invia i nuovi dati separatamente. Cioè, la risposta viene memorizzata nel buffer fino al primo blocco del corpo.

Restituisce `true` se tutti i dati sono stati scaricati correttamente nel buffer del kernel. Restituisce `false` se tutti o parte dei dati sono stati accodati nella memoria utente. `'drain'` verrà emesso quando il buffer è di nuovo libero.


### `response.writeContinue()` {#responsewritecontinue}

**Aggiunto in: v0.3.0**

Invia un messaggio HTTP/1.1 100 Continue al client, indicando che il corpo della richiesta dovrebbe essere inviato. Vedi l'evento [`'checkContinue'`](/it/nodejs/api/http#event-checkcontinue) su `Server`.

### `response.writeEarlyHints(hints[, callback])` {#responsewriteearlyhintshints-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.11.0 | Consente di passare gli hints come oggetto. |
| v18.11.0 | Aggiunto in: v18.11.0 |
:::

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Invia un messaggio HTTP/1.1 103 Early Hints al client con un header Link, indicando che lo user agent può precaricare/preconnettere le risorse collegate. Gli `hints` sono un oggetto contenente i valori degli header da inviare con il messaggio early hints. L'argomento opzionale `callback` verrà chiamato quando il messaggio di risposta è stato scritto.

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
  'x-trace-id': 'id for diagnostics',
});

const earlyHintsCallback = () => console.log('early hints message sent');
response.writeEarlyHints({
  'link': earlyHintsLinks,
}, earlyHintsCallback);
```
### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.14.0 | Consente di passare gli header come array. |
| v11.10.0, v10.17.0 | Restituisce `this` da `writeHead()` per consentire l'incatenamento con `end()`. |
| v5.11.0, v4.4.5 | Viene generato un `RangeError` se `statusCode` non è un numero nell'intervallo `[100, 999]`. |
| v0.1.30 | Aggiunto in: v0.1.30 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- Restituisce: [\<http.ServerResponse\>](/it/nodejs/api/http#class-httpserverresponse)

Invia un header di risposta alla richiesta. Il codice di stato è un codice di stato HTTP a 3 cifre, come `404`. L'ultimo argomento, `headers`, sono gli header di risposta. Facoltativamente, si può fornire un `statusMessage` leggibile come secondo argomento.

`headers` può essere un `Array` dove le chiavi e i valori sono nella stessa lista. *Non* è una lista di tuple. Quindi, gli offset pari sono i valori delle chiavi, e gli offset dispari sono i valori associati. L'array è nello stesso formato di `request.rawHeaders`.

Restituisce un riferimento a `ServerResponse`, in modo che le chiamate possano essere concatenate.

```js [ESM]
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body);
```
Questo metodo deve essere chiamato solo una volta su un messaggio e deve essere chiamato prima che venga chiamato [`response.end()`](/it/nodejs/api/http#responseenddata-encoding-callback).

Se [`response.write()`](/it/nodejs/api/http#responsewritechunk-encoding-callback) o [`response.end()`](/it/nodejs/api/http#responseenddata-encoding-callback) vengono chiamati prima di chiamare questo, gli header impliciti/modificabili verranno calcolati e chiameranno questa funzione.

Quando gli header sono stati impostati con [`response.setHeader()`](/it/nodejs/api/http#responsesetheadername-value), verranno uniti con qualsiasi header passato a [`response.writeHead()`](/it/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), con gli header passati a [`response.writeHead()`](/it/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) che hanno la precedenza.

Se questo metodo viene chiamato e [`response.setHeader()`](/it/nodejs/api/http#responsesetheadername-value) non è stato chiamato, scriverà direttamente i valori degli header forniti sul canale di rete senza memorizzare nella cache internamente, e [`response.getHeader()`](/it/nodejs/api/http#responsegetheadername) sull'header non darà il risultato atteso. Se si desidera una popolazione progressiva degli header con potenziale recupero e modifica futura, utilizzare invece [`response.setHeader()`](/it/nodejs/api/http#responsesetheadername-value).

```js [ESM]
// Restituisce content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
`Content-Length` viene letto in byte, non in caratteri. Utilizzare [`Buffer.byteLength()`](/it/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) per determinare la lunghezza del corpo in byte. Node.js verificherà se `Content-Length` e la lunghezza del corpo che è stato trasmesso sono uguali o meno.

Il tentativo di impostare un nome o un valore di campo di header che contenga caratteri non validi comporterà la generazione di un [`Error`][].


### `response.writeProcessing()` {#responsewriteprocessing}

**Aggiunto in: v10.0.0**

Invia un messaggio HTTP/1.1 102 Processing al client, indicando che il corpo della richiesta deve essere inviato.

## Classe: `http.IncomingMessage` {#class-httpincomingmessage}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.5.0 | Il valore `destroyed` restituisce `true` dopo che i dati in entrata sono stati consumati. |
| v13.1.0, v12.16.0 | Il valore `readableHighWaterMark` rispecchia quello del socket. |
| v0.1.17 | Aggiunto in: v0.1.17 |
:::

- Estende: [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable)

Un oggetto `IncomingMessage` viene creato da [`http.Server`](/it/nodejs/api/http#class-httpserver) o [`http.ClientRequest`](/it/nodejs/api/http#class-httpclientrequest) e passato come primo argomento agli eventi [`'request'`](/it/nodejs/api/http#event-request) e [`'response'`](/it/nodejs/api/http#event-response) rispettivamente. Può essere utilizzato per accedere allo stato della risposta, alle intestazioni e ai dati.

A differenza del suo valore `socket` che è una sottoclasse di [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex), `IncomingMessage` stesso estende [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable) e viene creato separatamente per analizzare ed emettere le intestazioni e il payload HTTP in entrata, poiché il socket sottostante può essere riutilizzato più volte in caso di keep-alive.

### Evento: `'aborted'` {#event-aborted}

**Aggiunto in: v0.3.8**

**Deprecato a partire da: v17.0.0, v16.12.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Ascolta invece l'evento `'close'`.
:::

Emesso quando la richiesta è stata interrotta.

### Evento: `'close'` {#event-close_3}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | L'evento close viene ora emesso quando la richiesta è stata completata e non quando il socket sottostante è chiuso. |
| v0.4.2 | Aggiunto in: v0.4.2 |
:::

Emesso quando la richiesta è stata completata.

### `message.aborted` {#messageaborted}

**Aggiunto in: v10.1.0**

**Deprecato a partire da: v17.0.0, v16.12.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Controlla `message.destroyed` da [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La proprietà `message.aborted` sarà `true` se la richiesta è stata interrotta.


### `message.complete` {#messagecomplete}

**Aggiunto in: v0.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La proprietà `message.complete` sarà `true` se un messaggio HTTP completo è stato ricevuto e analizzato con successo.

Questa proprietà è particolarmente utile come mezzo per determinare se un client o un server ha trasmesso completamente un messaggio prima che una connessione venisse terminata:

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
        'La connessione è stata terminata mentre il messaggio era ancora in fase di invio');
  });
});
```
### `message.connection` {#messageconnection}

**Aggiunto in: v0.1.90**

**Deprecato da: v16.0.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato. Utilizzare [`message.socket`](/it/nodejs/api/http#messagesocket).
:::

Alias per [`message.socket`](/it/nodejs/api/http#messagesocket).

### `message.destroy([error])` {#messagedestroyerror}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.5.0, v12.19.0 | La funzione restituisce `this` per coerenza con altri stream Readable. |
| v0.3.0 | Aggiunto in: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Chiama `destroy()` sul socket che ha ricevuto l'`IncomingMessage`. Se viene fornito `error`, viene emesso un evento `'error'` sul socket e `error` viene passato come argomento a qualsiasi listener sull'evento.

### `message.headers` {#messageheaders}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.5.0, v18.14.0 | L'opzione `joinDuplicateHeaders` nelle funzioni `http.request()` e `http.createServer()` garantisce che le intestazioni duplicate non vengano scartate, ma piuttosto combinate utilizzando un separatore di virgole, in conformità con RFC 9110 Sezione 5.3. |
| v15.1.0 | `message.headers` ora viene calcolato pigramente utilizzando una proprietà di accesso sul prototipo e non è più enumerabile. |
| v0.1.5 | Aggiunto in: v0.1.5 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L'oggetto delle intestazioni di richiesta/risposta.

Coppie chiave-valore dei nomi e dei valori delle intestazioni. I nomi delle intestazioni sono in minuscolo.

```js [ESM]
// Stampa qualcosa come:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
I duplicati nelle intestazioni non elaborate vengono gestiti nei seguenti modi, a seconda del nome dell'intestazione:

- I duplicati di `age`, `authorization`, `content-length`, `content-type`, `etag`, `expires`, `from`, `host`, `if-modified-since`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `referer`, `retry-after`, `server` o `user-agent` vengono scartati. Per consentire l'unione di valori duplicati delle intestazioni sopra elencate, utilizzare l'opzione `joinDuplicateHeaders` in [`http.request()`](/it/nodejs/api/http#httprequestoptions-callback) e [`http.createServer()`](/it/nodejs/api/http#httpcreateserveroptions-requestlistener). Vedere RFC 9110 Sezione 5.3 per ulteriori informazioni.
- `set-cookie` è sempre un array. I duplicati vengono aggiunti all'array.
- Per le intestazioni `cookie` duplicate, i valori vengono uniti con `; `.
- Per tutte le altre intestazioni, i valori vengono uniti con `, `.


### `message.headersDistinct` {#messageheadersdistinct}

**Aggiunto in: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Simile a [`message.headers`](/it/nodejs/api/http#messageheaders), ma non c'è logica di unione e i valori sono sempre array di stringhe, anche per le intestazioni ricevute una sola volta.

```js [ESM]
// Stampa qualcosa del tipo:
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*/*'] }
console.log(request.headersDistinct);
```
### `message.httpVersion` {#messagehttpversion}

**Aggiunto in: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Nel caso di richiesta del server, la versione HTTP inviata dal client. Nel caso di risposta del client, la versione HTTP del server a cui è connesso. Probabilmente sia `'1.1'` che `'1.0'`.

Inoltre `message.httpVersionMajor` è il primo numero intero e `message.httpVersionMinor` è il secondo.

### `message.method` {#messagemethod}

**Aggiunto in: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Valido solo per la richiesta ottenuta da <a href="#class-httpserver"><code>http.Server</code></a>.**

Il metodo di richiesta come una stringa. Sola lettura. Esempi: `'GET'`, `'DELETE'`.

### `message.rawHeaders` {#messagerawheaders}

**Aggiunto in: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'elenco delle intestazioni raw di richiesta/risposta esattamente come sono state ricevute.

Le chiavi e i valori sono nella stessa lista. Non è *una* lista di tuple. Quindi, gli offset con numero pari sono valori chiave e gli offset con numero dispari sono i valori associati.

I nomi delle intestazioni non sono in minuscolo e i duplicati non vengono uniti.

```js [ESM]
// Stampa qualcosa del tipo:
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

**Aggiunto in: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le chiavi e i valori del trailer raw di richiesta/risposta esattamente come sono state ricevute. Popolato solo all'evento `'end'`.


### `message.setTimeout(msecs[, callback])` {#messagesettimeoutmsecs-callback}

**Aggiunto in: v0.5.9**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage)

Chiama `message.socket.setTimeout(msecs, callback)`.

### `message.socket` {#messagesocket}

**Aggiunto in: v0.3.0**

- [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

L'oggetto [`net.Socket`](/it/nodejs/api/net#class-netsocket) associato alla connessione.

Con il supporto HTTPS, utilizzare [`request.socket.getPeerCertificate()`](/it/nodejs/api/tls#tlssocketgetpeercertificatedetailed) per ottenere i dettagli di autenticazione del client.

È garantito che questa proprietà sia un'istanza della classe [\<net.Socket\>](/it/nodejs/api/net#class-netsocket), una sottoclasse di [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex), a meno che l'utente non abbia specificato un tipo di socket diverso da [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) o internamente impostato su null.

### `message.statusCode` {#messagestatuscode}

**Aggiunto in: v0.1.1**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

**Valido solo per la risposta ottenuta da <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a>.**

Il codice di stato della risposta HTTP a 3 cifre. ES. `404`.

### `message.statusMessage` {#messagestatusmessage}

**Aggiunto in: v0.11.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Valido solo per la risposta ottenuta da <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a>.**

Il messaggio di stato della risposta HTTP (frase motivazionale). ES. `OK` o `Internal Server Error`.

### `message.trailers` {#messagetrailers}

**Aggiunto in: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L'oggetto dei trailer di richiesta/risposta. Popolato solo all'evento `'end'`.

### `message.trailersDistinct` {#messagetrailersdistinct}

**Aggiunto in: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Simile a [`message.trailers`](/it/nodejs/api/http#messagetrailers), ma non c'è logica di join e i valori sono sempre array di stringhe, anche per le intestazioni ricevute una sola volta. Popolato solo all'evento `'end'`.


### `message.url` {#messageurl}

**Aggiunto in: v0.1.90**

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Valido solo per le richieste ottenute da <a href="#class-httpserver"><code>http.Server</code></a>.**

Stringa URL della richiesta. Contiene solo l'URL presente nella richiesta HTTP effettiva. Considera la seguente richiesta:

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
Per analizzare l'URL nelle sue parti:

```js [ESM]
new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
```
Quando `request.url` è `'/status?name=ryan'` e `process.env.HOST` non è definito:

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
Assicurati di impostare `process.env.HOST` sul nome host del server oppure valuta la possibilità di sostituire completamente questa parte. Se utilizzi `req.headers.host`, assicurati che venga utilizzata una convalida appropriata, poiché i client potrebbero specificare un header `Host` personalizzato.

## Classe: `http.OutgoingMessage` {#class-httpoutgoingmessage}

**Aggiunto in: v0.1.17**

- Estende: [\<Stream\>](/it/nodejs/api/stream#stream)

Questa classe funge da classe padre di [`http.ClientRequest`](/it/nodejs/api/http#class-httpclientrequest) e [`http.ServerResponse`](/it/nodejs/api/http#class-httpserverresponse). È un messaggio astratto in uscita dal punto di vista dei partecipanti a una transazione HTTP.

### Evento: `'drain'` {#event-drain}

**Aggiunto in: v0.3.6**

Emesso quando il buffer del messaggio è di nuovo libero.

### Evento: `'finish'` {#event-finish_2}

**Aggiunto in: v0.1.17**

Emesso quando la trasmissione è terminata correttamente.

### Evento: `'prefinish'` {#event-prefinish}

**Aggiunto in: v0.11.6**

Emesso dopo che è stato chiamato `outgoingMessage.end()`. Quando viene emesso l'evento, tutti i dati sono stati elaborati ma non necessariamente completamente scaricati.


### `outgoingMessage.addTrailers(headers)` {#outgoingmessageaddtrailersheaders}

**Aggiunto in: v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Aggiunge i trailer HTTP (intestazioni, ma alla fine del messaggio) al messaggio.

I trailer saranno emessi **solo** se il messaggio è codificato a blocchi. In caso contrario, i trailer verranno scartati silenziosamente.

HTTP richiede che l'intestazione `Trailer` venga inviata per emettere i trailer, con un elenco di nomi di campi di intestazione nel suo valore, ad esempio:

```js [ESM]
message.writeHead(200, { 'Content-Type': 'text/plain',
                         'Trailer': 'Content-MD5' });
message.write(fileData);
message.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
message.end();
```
Il tentativo di impostare un nome o un valore di campo di intestazione che contenga caratteri non validi comporterà la generazione di un `TypeError`.

### `outgoingMessage.appendHeader(name, value)` {#outgoingmessageappendheadername-value}

**Aggiunto in: v18.3.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome dell'intestazione
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Valore dell'intestazione
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Aggiunge un singolo valore di intestazione all'oggetto intestazione.

Se il valore è un array, questo equivale a chiamare questo metodo più volte.

Se non ci fossero valori precedenti per l'intestazione, questo equivale a chiamare [`outgoingMessage.setHeader(name, value)`](/it/nodejs/api/http#outgoingmessagesetheadername-value).

A seconda del valore di `options.uniqueHeaders` quando la richiesta del client o il server sono stati creati, ciò si tradurrà nell'intestazione inviata più volte o una sola volta con i valori uniti usando `; `.

### `outgoingMessage.connection` {#outgoingmessageconnection}

**Aggiunto in: v0.3.0**

**Deprecato a partire da: v15.12.0, v14.17.1**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Utilizzare invece [`outgoingMessage.socket`](/it/nodejs/api/http#outgoingmessagesocket).
:::

Alias di [`outgoingMessage.socket`](/it/nodejs/api/http#outgoingmessagesocket).


### `outgoingMessage.cork()` {#outgoingmessagecork}

**Aggiunto in: v13.2.0, v12.16.0**

Vedi [`writable.cork()`](/it/nodejs/api/stream#writablecork).

### `outgoingMessage.destroy([error])` {#outgoingmessagedestroyerror}

**Aggiunto in: v0.3.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Opzionale, un errore da emettere con l'evento `error`
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Distrugge il messaggio. Una volta che un socket è associato al messaggio ed è connesso, anche quel socket verrà distrutto.

### `outgoingMessage.end(chunk[, encoding][, callback])` {#outgoingmessageendchunk-encoding-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Il parametro `chunk` ora può essere un `Uint8Array`. |
| v0.11.6 | aggiungi l'argomento `callback`. |
| v0.1.90 | Aggiunto in: v0.1.90 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Opzionale, **Predefinito**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Opzionale
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Termina il messaggio in uscita. Se delle parti del body non sono state inviate, le invierà al sistema sottostante. Se il messaggio è suddiviso in chunk, invierà il chunk di terminazione `0\r\n\r\n` e invierà i trailer (se presenti).

Se `chunk` è specificato, è equivalente a chiamare `outgoingMessage.write(chunk, encoding)`, seguito da `outgoingMessage.end(callback)`.

Se viene fornito `callback`, verrà chiamato al termine del messaggio (equivalente a un listener dell'evento `'finish'`).

### `outgoingMessage.flushHeaders()` {#outgoingmessageflushheaders}

**Aggiunto in: v1.6.0**

Invia gli header del messaggio.

Per motivi di efficienza, Node.js normalmente memorizza nel buffer gli header del messaggio finché non viene chiamato `outgoingMessage.end()` o viene scritto il primo chunk di dati del messaggio. Quindi cerca di inserire gli header e i dati in un singolo pacchetto TCP.

Di solito è auspicabile (risparmia un round-trip TCP), ma non quando i primi dati non vengono inviati fino a molto tempo dopo. `outgoingMessage.flushHeaders()` bypassa l'ottimizzazione e avvia il messaggio.


### `outgoingMessage.getHeader(name)` {#outgoingmessagegetheadername}

**Aggiunto in: v0.4.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome dell'intestazione
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Ottiene il valore dell'intestazione HTTP con il nome fornito. Se tale intestazione non è impostata, il valore restituito sarà `undefined`.

### `outgoingMessage.getHeaderNames()` {#outgoingmessagegetheadernames}

**Aggiunto in: v7.7.0**

- Restituisce: [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce un array contenente i nomi univoci delle intestazioni in uscita correnti. Tutti i nomi sono in minuscolo.

### `outgoingMessage.getHeaders()` {#outgoingmessagegetheaders}

**Aggiunto in: v7.7.0**

- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce una copia superficiale delle intestazioni in uscita correnti. Poiché viene utilizzata una copia superficiale, i valori dell'array possono essere modificati senza ulteriori chiamate ai vari metodi del modulo HTTP relativi all'intestazione. Le chiavi dell'oggetto restituito sono i nomi delle intestazioni e i valori sono i rispettivi valori delle intestazioni. Tutti i nomi delle intestazioni sono in minuscolo.

L'oggetto restituito dal metodo `outgoingMessage.getHeaders()` non eredita prototipicamente dall'`Oggetto` JavaScript. Ciò significa che i metodi `Oggetto` tipici come `obj.toString()`, `obj.hasOwnProperty()` e altri non sono definiti e non funzioneranno.

```js [ESM]
outgoingMessage.setHeader('Foo', 'bar');
outgoingMessage.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = outgoingMessage.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `outgoingMessage.hasHeader(name)` {#outgoingmessagehasheadername}

**Aggiunto in: v7.7.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'intestazione identificata da `name` è attualmente impostata nelle intestazioni in uscita. Il nome dell'intestazione non fa distinzione tra maiuscole e minuscole.

```js [ESM]
const hasContentType = outgoingMessage.hasHeader('content-type');
```

### `outgoingMessage.headersSent` {#outgoingmessageheaderssent}

**Aggiunto in: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sola lettura. `true` se le intestazioni sono state inviate, altrimenti `false`.

### `outgoingMessage.pipe()` {#outgoingmessagepipe}

**Aggiunto in: v9.0.0**

Sovrascrive il metodo `stream.pipe()` ereditato dalla classe `Stream` legacy che è la classe padre di `http.OutgoingMessage`.

Chiamare questo metodo genererà un `Error` perché `outgoingMessage` è uno stream di sola scrittura.

### `outgoingMessage.removeHeader(name)` {#outgoingmessageremoveheadername}

**Aggiunto in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome dell'intestazione

Rimuove un'intestazione che è in coda per l'invio implicito.

```js [ESM]
outgoingMessage.removeHeader('Content-Encoding');
```
### `outgoingMessage.setHeader(name, value)` {#outgoingmessagesetheadername-value}

**Aggiunto in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome dell'intestazione
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Valore dell'intestazione
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Imposta un singolo valore di intestazione. Se l'intestazione esiste già nelle intestazioni da inviare, il suo valore verrà sostituito. Utilizza un array di stringhe per inviare più intestazioni con lo stesso nome.

### `outgoingMessage.setHeaders(headers)` {#outgoingmessagesetheadersheaders}

**Aggiunto in: v19.6.0, v18.15.0**

- `headers` [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers) | [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Imposta più valori di intestazione per le intestazioni implicite. `headers` deve essere un'istanza di [`Headers`](/it/nodejs/api/globals#class-headers) o `Map`, se un'intestazione esiste già nelle intestazioni da inviare, il suo valore verrà sostituito.

```js [ESM]
const headers = new Headers({ foo: 'bar' });
outgoingMessage.setHeaders(headers);
```
oppure

```js [ESM]
const headers = new Map([['foo', 'bar']]);
outgoingMessage.setHeaders(headers);
```
Quando le intestazioni sono state impostate con [`outgoingMessage.setHeaders()`](/it/nodejs/api/http#outgoingmessagesetheadersheaders), verranno unite con qualsiasi intestazione passata a [`response.writeHead()`](/it/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), con le intestazioni passate a [`response.writeHead()`](/it/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) che hanno la precedenza.

```js [ESM]
// Restituisce content-type = text/plain
const server = http.createServer((req, res) => {
  const headers = new Headers({ 'Content-Type': 'text/html' });
  res.setHeaders(headers);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

### `outgoingMessage.setTimeout(msesc[, callback])` {#outgoingmessagesettimeoutmsesc-callback}

**Aggiunto in: v0.9.12**

- `msesc` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione opzionale da chiamare quando si verifica un timeout. Come l'associazione all'evento `timeout`.
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Una volta che un socket è associato al messaggio ed è connesso, [`socket.setTimeout()`](/it/nodejs/api/net#socketsettimeouttimeout-callback) verrà chiamato con `msecs` come primo parametro.

### `outgoingMessage.socket` {#outgoingmessagesocket}

**Aggiunto in: v0.3.0**

- [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Riferimento al socket sottostante. Di solito, gli utenti non vorranno accedere a questa proprietà.

Dopo aver chiamato `outgoingMessage.end()`, questa proprietà sarà impostata su null.

### `outgoingMessage.uncork()` {#outgoingmessageuncork}

**Aggiunto in: v13.2.0, v12.16.0**

Vedi [`writable.uncork()`](/it/nodejs/api/stream#writableuncork)

### `outgoingMessage.writableCorked` {#outgoingmessagewritablecorked}

**Aggiunto in: v13.2.0, v12.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il numero di volte in cui è stato chiamato `outgoingMessage.cork()`.

### `outgoingMessage.writableEnded` {#outgoingmessagewritableended}

**Aggiunto in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` se è stato chiamato `outgoingMessage.end()`. Questa proprietà non indica se i dati sono stati scaricati. A tale scopo, utilizzare invece `message.writableFinished`.

### `outgoingMessage.writableFinished` {#outgoingmessagewritablefinished}

**Aggiunto in: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` se tutti i dati sono stati scaricati nel sistema sottostante.

### `outgoingMessage.writableHighWaterMark` {#outgoingmessagewritablehighwatermark}

**Aggiunto in: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il `highWaterMark` del socket sottostante se assegnato. Altrimenti, il livello di buffer predefinito quando [`writable.write()`](/it/nodejs/api/stream#writablewritechunk-encoding-callback) inizia a restituire false (`16384`).


### `outgoingMessage.writableLength` {#outgoingmessagewritablelength}

**Aggiunto in: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il numero di byte in buffer.

### `outgoingMessage.writableObjectMode` {#outgoingmessagewritableobjectmode}

**Aggiunto in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sempre `false`.

### `outgoingMessage.write(chunk[, encoding][, callback])` {#outgoingmessagewritechunk-encoding-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Il parametro `chunk` ora può essere un `Uint8Array`. |
| v0.11.6 | L'argomento `callback` è stato aggiunto. |
| v0.1.29 | Aggiunto in: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Invia un chunk del body. Questo metodo può essere chiamato più volte.

L'argomento `encoding` è rilevante solo quando `chunk` è una stringa. Il valore predefinito è `'utf8'`.

L'argomento `callback` è opzionale e verrà chiamato quando questo chunk di dati viene scaricato.

Restituisce `true` se tutti i dati sono stati scaricati correttamente nel buffer del kernel. Restituisce `false` se tutti o parte dei dati sono stati accodati nella memoria utente. L'evento `'drain'` verrà emesso quando il buffer sarà di nuovo libero.

## `http.METHODS` {#httpmethods}

**Aggiunto in: v0.11.8**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Un elenco dei metodi HTTP supportati dal parser.

## `http.STATUS_CODES` {#httpstatus_codes}

**Aggiunto in: v0.1.22**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Una raccolta di tutti i codici di stato di risposta HTTP standard e la breve descrizione di ciascuno. Ad esempio, `http.STATUS_CODES[404] === 'Not Found'`.


## `http.createServer([options][, requestListener])` {#httpcreateserveroptions-requestlistener}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.1.0, v18.17.0 | L'opzione `highWaterMark` è ora supportata. |
| v18.0.0 | Le opzioni `requestTimeout`, `headersTimeout`, `keepAliveTimeout` e `connectionsCheckingInterval` sono ora supportate. |
| v18.0.0 | L'opzione `noDelay` ora ha come valore predefinito `true`. |
| v17.7.0, v16.15.0 | Le opzioni `noDelay`, `keepAlive` e `keepAliveInitialDelay` sono ora supportate. |
| v13.3.0 | L'opzione `maxHeaderSize` è ora supportata. |
| v13.8.0, v12.15.0, v10.19.0 | L'opzione `insecureHTTPParser` è ora supportata. |
| v9.6.0, v8.12.0 | L'argomento `options` è ora supportato. |
| v0.1.13 | Aggiunto in: v0.1.13 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `connectionsCheckingInterval`: Imposta il valore dell'intervallo in millisecondi per verificare il timeout di richieste e intestazioni nelle richieste incomplete. **Predefinito:** `30000`.
    - `headersTimeout`: Imposta il valore del timeout in millisecondi per la ricezione delle intestazioni HTTP complete dal client. Vedi [`server.headersTimeout`](/it/nodejs/api/http#serverheaderstimeout) per maggiori informazioni. **Predefinito:** `60000`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Sovrascrive facoltativamente tutti i valori `readableHighWaterMark` e `writableHighWaterMark` dei `socket`. Ciò influisce sulla proprietà `highWaterMark` sia di `IncomingMessage` che di `ServerResponse`. **Predefinito:** Vedi [`stream.getDefaultHighWaterMark()`](/it/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode).
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `true`, utilizzerà un parser HTTP con i flag di tolleranza abilitati. L'utilizzo del parser non sicuro dovrebbe essere evitato. Vedi [`--insecure-http-parser`](/it/nodejs/api/cli#--insecure-http-parser) per maggiori informazioni. **Predefinito:** `false`.
    - `IncomingMessage` [\<http.IncomingMessage\>](/it/nodejs/api/http#class-httpincomingmessage) Specifica la classe `IncomingMessage` da utilizzare. Utile per estendere l'`IncomingMessage` originale. **Predefinito:** `IncomingMessage`.
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `true`, questa opzione consente di unire i valori delle righe di campo di più intestazioni in una richiesta con una virgola (`, `) invece di scartare i duplicati. Per maggiori informazioni, fai riferimento a [`message.headers`](/it/nodejs/api/http#messageheaders). **Predefinito:** `false`.
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `true`, abilita la funzionalità keep-alive sul socket immediatamente dopo aver ricevuto una nuova connessione in entrata, in modo simile a quanto fatto in [`socket.setKeepAlive([enable][, initialDelay])`][`socket.setKeepAlive(enable, initialDelay)`]. **Predefinito:** `false`.
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se impostato su un numero positivo, imposta il ritardo iniziale prima che la prima sonda keepalive venga inviata su un socket inattivo. **Predefinito:** `0`.
    - `keepAliveTimeout`: Il numero di millisecondi di inattività che un server deve attendere per ulteriori dati in entrata, dopo aver terminato di scrivere l'ultima risposta, prima che un socket venga distrutto. Vedi [`server.keepAliveTimeout`](/it/nodejs/api/http#serverkeepalivetimeout) per maggiori informazioni. **Predefinito:** `5000`.
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Sovrascrive facoltativamente il valore di [`--max-http-header-size`](/it/nodejs/api/cli#--max-http-header-sizesize) per le richieste ricevute da questo server, ovvero la lunghezza massima delle intestazioni delle richieste in byte. **Predefinito:** 16384 (16 KiB).
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `true`, disabilita l'uso dell'algoritmo di Nagle immediatamente dopo aver ricevuto una nuova connessione in entrata. **Predefinito:** `true`.
    - `requestTimeout`: Imposta il valore del timeout in millisecondi per la ricezione dell'intera richiesta dal client. Vedi [`server.requestTimeout`](/it/nodejs/api/http#serverrequesttimeout) per maggiori informazioni. **Predefinito:** `300000`.
    - `requireHostHeader` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `true`, forza il server a rispondere con un codice di stato 400 (Richiesta errata) a qualsiasi messaggio di richiesta HTTP/1.1 che non ha un'intestazione Host (come richiesto dalla specifica). **Predefinito:** `true`.
    - `ServerResponse` [\<http.ServerResponse\>](/it/nodejs/api/http#class-httpserverresponse) Specifica la classe `ServerResponse` da utilizzare. Utile per estendere la `ServerResponse` originale. **Predefinito:** `ServerResponse`.
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un elenco di intestazioni di risposta che dovrebbero essere inviate una sola volta. Se il valore dell'intestazione è un array, gli elementi verranno uniti usando `; `.
    - `rejectNonStandardBodyWrites` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `true`, viene generato un errore quando si scrive in una risposta HTTP che non ha un corpo. **Predefinito:** `false`.
  
 
-  `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
-  Restituisce: [\<http.Server\>](/it/nodejs/api/http#class-httpserver) 

Restituisce una nuova istanza di [`http.Server`](/it/nodejs/api/http#class-httpserver).

Il `requestListener` è una funzione che viene automaticamente aggiunta all'evento [`'request'`](/it/nodejs/api/http#event-request).



::: code-group
```js [ESM]
import http from 'node:http';

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::



::: code-group
```js [ESM]
import http from 'node:http';

// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::


## `http.get(options[, callback])` {#httpgetoptions-callback}

## `http.get(url[, options][, callback])` {#httpgeturl-options-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.9.0 | Il parametro `url` ora può essere passato insieme a un oggetto `options` separato. |
| v7.5.0 | Il parametro `options` può essere un oggetto `URL` WHATWG. |
| v0.3.6 | Aggiunto in: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Accetta le stesse `options` di [`http.request()`](/it/nodejs/api/http#httprequestoptions-callback), con il metodo impostato su GET per impostazione predefinita.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<http.ClientRequest\>](/it/nodejs/api/http#class-httpclientrequest)

Poiché la maggior parte delle richieste sono richieste GET senza corpi, Node.js fornisce questo metodo di convenienza. L'unica differenza tra questo metodo e [`http.request()`](/it/nodejs/api/http#httprequestoptions-callback) è che imposta il metodo su GET per impostazione predefinita e chiama `req.end()` automaticamente. La callback deve preoccuparsi di consumare i dati di risposta per i motivi indicati nella sezione [`http.ClientRequest`](/it/nodejs/api/http#class-httpclientrequest).

La `callback` viene richiamata con un singolo argomento che è un'istanza di [`http.IncomingMessage`](/it/nodejs/api/http#class-httpincomingmessage).

Esempio di recupero JSON:

```js [ESM]
http.get('http://localhost:8000/', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  // Qualsiasi codice di stato 2xx segnala una risposta corretta ma
  // qui stiamo controllando solo il 200.
  if (statusCode !== 200) {
    error = new Error('Richiesta fallita.\n' +
                      `Codice di stato: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Tipo di contenuto non valido.\n' +
                      `Previsto application/json ma ricevuto ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // Consuma i dati di risposta per liberare memoria
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
  console.error(`Errore: ${e.message}`);
});

// Crea un server locale per ricevere dati da
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Ciao Mondo!',
  }));
});

server.listen(8000);
```

## `http.globalAgent` {#httpglobalagent}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | L'agent ora utilizza HTTP Keep-Alive e un timeout di 5 secondi per impostazione predefinita. |
| v0.5.9 | Aggiunto in: v0.5.9 |
:::

- [\<http.Agent\>](/it/nodejs/api/http#class-httpagent)

Istanza globale di `Agent` che viene utilizzata come predefinita per tutte le richieste client HTTP. Diverge da una configurazione `Agent` predefinita avendo `keepAlive` abilitato e un `timeout` di 5 secondi.

## `http.maxHeaderSize` {#httpmaxheadersize}

**Aggiunto in: v11.6.0, v10.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Proprietà di sola lettura che specifica la dimensione massima consentita degli header HTTP in byte. Il valore predefinito è 16 KiB. Configurable utilizzando l'opzione CLI [`--max-http-header-size`](/it/nodejs/api/cli#--max-http-header-sizesize).

Questo può essere sovrascritto per server e richieste client passando l'opzione `maxHeaderSize`.

## `http.request(options[, callback])` {#httprequestoptions-callback}

## `http.request(url[, options][, callback])` {#httprequesturl-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.7.0, v14.18.0 | Quando si utilizza un oggetto `URL` analizzato, username e password verranno ora decodificati correttamente come URI. |
| v15.3.0, v14.17.0 | È possibile interrompere una richiesta con un AbortSignal. |
| v13.3.0 | L'opzione `maxHeaderSize` è ora supportata. |
| v13.8.0, v12.15.0, v10.19.0 | L'opzione `insecureHTTPParser` è ora supportata. |
| v10.9.0 | Il parametro `url` può ora essere passato insieme a un oggetto `options` separato. |
| v7.5.0 | Il parametro `options` può essere un oggetto WHATWG `URL`. |
| v0.3.6 | Aggiunto in: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `agent` [\<http.Agent\>](/it/nodejs/api/http#class-httpagent) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Controlla il comportamento di [`Agent`](/it/nodejs/api/http#class-httpagent). Valori possibili:
    - `undefined` (predefinito): utilizza [`http.globalAgent`](/it/nodejs/api/http#httpglobalagent) per questo host e porta.
    - oggetto `Agent`: utilizza esplicitamente l'`Agent` passato.
    - `false`: fa sì che venga utilizzato un nuovo `Agent` con valori predefiniti.

    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Autenticazione di base (`'user:password'`) per calcolare un header Authorization.
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione che produce un socket/stream da utilizzare per la richiesta quando l'opzione `agent` non viene utilizzata. Questo può essere utilizzato per evitare di creare una classe `Agent` personalizzata solo per sovrascrivere la funzione `createConnection` predefinita. Vedi [`agent.createConnection()`](/it/nodejs/api/http#agentcreateconnectionoptions-callback) per maggiori dettagli. Qualsiasi stream [`Duplex`](/it/nodejs/api/stream#class-streamduplex) è un valore di ritorno valido.
    - `defaultPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta predefinita per il protocollo. **Predefinito:** `agent.defaultPort` se viene utilizzato un `Agent`, altrimenti `undefined`.
    - `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Famiglia di indirizzi IP da utilizzare quando si risolve `host` o `hostname`. I valori validi sono `4` o `6`. Quando non specificato, verranno utilizzati sia IP v4 che v6.
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto contenente header di richiesta.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`dns.lookup()` hint](/it/nodejs/api/dns#supported-getaddrinfo-flags) opzionali.
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nome di dominio o un indirizzo IP del server a cui inviare la richiesta. **Predefinito:** `'localhost'`.
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Alias per `host`. Per supportare [`url.parse()`](/it/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost), `hostname` verrà utilizzato se sono specificati sia `host` che `hostname`.
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `true`, utilizzerà un parser HTTP con i flag di tolleranza abilitati. L'utilizzo del parser insicuro dovrebbe essere evitato. Vedi [`--insecure-http-parser`](/it/nodejs/api/cli#--insecure-http-parser) per maggiori informazioni. **Predefinito:** `false`
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Unisce i valori della riga di campo di più header in una richiesta con `, ` invece di scartare i duplicati. Vedi [`message.headers`](/it/nodejs/api/http#messageheaders) per maggiori informazioni. **Predefinito:** `false`.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Interfaccia locale a cui collegarsi per le connessioni di rete.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta locale da cui connettersi.
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione di lookup personalizzata. **Predefinito:** [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback).
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Sovrascrive facoltativamente il valore di [`--max-http-header-size`](/it/nodejs/api/cli#--max-http-header-sizesize) (la lunghezza massima degli header di risposta in byte) per le risposte ricevute dal server. **Predefinito:** 16384 (16 KiB).
    - `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una stringa che specifica il metodo di richiesta HTTP. **Predefinito:** `'GET'`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Percorso della richiesta. Dovrebbe includere la stringa di query, se presente. ES. `'/index.html?page=12'`. Viene generata un'eccezione quando il percorso della richiesta contiene caratteri non validi. Attualmente, vengono rifiutati solo gli spazi, ma ciò potrebbe cambiare in futuro. **Predefinito:** `'/'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta del server remoto. **Predefinito:** `defaultPort` se impostato, altrimenti `80`.
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Protocollo da utilizzare. **Predefinito:** `'http:'`.
    - `setDefaultHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): Specifica se aggiungere o meno automaticamente header predefiniti come `Connection`, `Content-Length`, `Transfer-Encoding` e `Host`. Se impostato su `false`, tutti gli header necessari devono essere aggiunti manualmente. Il valore predefinito è `true`.
    - `setHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): Specifica se aggiungere o meno automaticamente l'header `Host`. Se fornito, questo sovrascrive `setDefaultHeaders`. Il valore predefinito è `true`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal): Un AbortSignal che può essere utilizzato per interrompere una richiesta in corso.
    - `socketPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Socket di dominio Unix. Non può essere utilizzato se sono specificati `host` o `port`, poiché questi specificano un Socket TCP.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): Un numero che specifica il timeout del socket in millisecondi. Questo imposterà il timeout prima che il socket sia connesso.
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un elenco di header di richiesta che devono essere inviati solo una volta. Se il valore dell'header è un array, gli elementi verranno uniti usando `; `.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<http.ClientRequest\>](/it/nodejs/api/http#class-httpclientrequest)

Anche le `options` in [`socket.connect()`](/it/nodejs/api/net#socketconnectoptions-connectlistener) sono supportate.

Node.js mantiene diverse connessioni per server per effettuare richieste HTTP. Questa funzione consente di effettuare richieste in modo trasparente.

`url` può essere una stringa o un oggetto [`URL`](/it/nodejs/api/url#the-whatwg-url-api). Se `url` è una stringa, viene automaticamente analizzata con [`new URL()`](/it/nodejs/api/url#new-urlinput-base). Se è un oggetto [`URL`](/it/nodejs/api/url#the-whatwg-url-api), verrà automaticamente convertito in un normale oggetto `options`.

Se sono specificati sia `url` che `options`, gli oggetti vengono uniti, con le proprietà `options` che hanno la precedenza.

Il parametro `callback` opzionale verrà aggiunto come listener una tantum per l'evento [`'response'`](/it/nodejs/api/http#event-response).

`http.request()` restituisce un'istanza della classe [`http.ClientRequest`](/it/nodejs/api/http#class-httpclientrequest). L'istanza `ClientRequest` è uno stream scrivibile. Se è necessario caricare un file con una richiesta POST, scrivi sull'oggetto `ClientRequest`.

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

Nell'esempio è stato chiamato `req.end()`. Con `http.request()` si deve sempre chiamare `req.end()` per indicare la fine della richiesta, anche se non ci sono dati scritti nel corpo della richiesta.

Se si verifica un errore durante la richiesta (che si tratti di risoluzione DNS, errori a livello TCP o errori di analisi HTTP effettivi), viene emesso un evento `'error'` sull'oggetto richiesta restituito. Come per tutti gli eventi `'error'`, se non sono registrati listener, l'errore verrà generato.

Ci sono alcuni header speciali che dovrebbero essere notati.

- L'invio di 'Connection: keep-alive' notificherà a Node.js che la connessione al server deve essere mantenuta fino alla prossima richiesta.
- L'invio di un header 'Content-Length' disabiliterà la codifica a blocchi predefinita.
- L'invio di un header 'Expect' invierà immediatamente gli header della richiesta. Solitamente, quando si invia 'Expect: 100-continue', dovrebbero essere impostati sia un timeout che un listener per l'evento `'continue'`. Vedi RFC 2616 Section 8.2.3 per maggiori informazioni.
- L'invio di un header Authorization sovrascriverà l'utilizzo dell'opzione `auth` per calcolare l'autenticazione di base.

Esempio di utilizzo di un [`URL`](/it/nodejs/api/url#the-whatwg-url-api) come `options`:

```js [ESM]
const options = new URL('http://abc:');

const req = http.request(options, (res) => {
  // ...
});
```

In una richiesta di successo, i seguenti eventi verranno emessi nel seguente ordine:

- `'socket'`
- `'response'`
    - `'data'` un numero qualsiasi di volte, sull'oggetto `res` (`'data'` non verrà emesso affatto se il corpo della risposta è vuoto, ad esempio, nella maggior parte dei reindirizzamenti)
    - `'end'` sull'oggetto `res`

- `'close'`

In caso di errore di connessione, verranno emessi i seguenti eventi:

- `'socket'`
- `'error'`
- `'close'`

In caso di chiusura prematura della connessione prima che venga ricevuta la risposta, verranno emessi i seguenti eventi nel seguente ordine:

- `'socket'`
- `'error'` con un errore con messaggio `'Error: socket hang up'` e codice `'ECONNRESET'`
- `'close'`

In caso di chiusura prematura della connessione dopo che la risposta è stata ricevuta, verranno emessi i seguenti eventi nel seguente ordine:

- `'socket'`
- `'response'`
    - `'data'` un numero qualsiasi di volte, sull'oggetto `res`

- (connessione chiusa qui)
- `'aborted'` sull'oggetto `res`
- `'close'`
- `'error'` sull'oggetto `res` con un errore con messaggio `'Error: aborted'` e codice `'ECONNRESET'`
- `'close'` sull'oggetto `res`

Se `req.destroy()` viene chiamato prima che venga assegnato un socket, verranno emessi i seguenti eventi nel seguente ordine:

- (`req.destroy()` chiamato qui)
- `'error'` con un errore con messaggio `'Error: socket hang up'` e codice `'ECONNRESET'`, o l'errore con cui è stato chiamato `req.destroy()`
- `'close'`

Se `req.destroy()` viene chiamato prima che la connessione abbia successo, verranno emessi i seguenti eventi nel seguente ordine:

- `'socket'`
- (`req.destroy()` chiamato qui)
- `'error'` con un errore con messaggio `'Error: socket hang up'` e codice `'ECONNRESET'`, o l'errore con cui è stato chiamato `req.destroy()`
- `'close'`

Se `req.destroy()` viene chiamato dopo che è stata ricevuta la risposta, verranno emessi i seguenti eventi nel seguente ordine:

- `'socket'`
- `'response'`
    - `'data'` un numero qualsiasi di volte, sull'oggetto `res`

- (`req.destroy()` chiamato qui)
- `'aborted'` sull'oggetto `res`
- `'close'`
- `'error'` sull'oggetto `res` con un errore con messaggio `'Error: aborted'` e codice `'ECONNRESET'`, o l'errore con cui è stato chiamato `req.destroy()`
- `'close'` sull'oggetto `res`

Se `req.abort()` viene chiamato prima che venga assegnato un socket, verranno emessi i seguenti eventi nel seguente ordine:

- (`req.abort()` chiamato qui)
- `'abort'`
- `'close'`

Se `req.abort()` viene chiamato prima che la connessione abbia successo, verranno emessi i seguenti eventi nel seguente ordine:

- `'socket'`
- (`req.abort()` chiamato qui)
- `'abort'`
- `'error'` con un errore con messaggio `'Error: socket hang up'` e codice `'ECONNRESET'`
- `'close'`

Se `req.abort()` viene chiamato dopo che è stata ricevuta la risposta, verranno emessi i seguenti eventi nel seguente ordine:

- `'socket'`
- `'response'`
    - `'data'` un numero qualsiasi di volte, sull'oggetto `res`

- (`req.abort()` chiamato qui)
- `'abort'`
- `'aborted'` sull'oggetto `res`
- `'error'` sull'oggetto `res` con un errore con messaggio `'Error: aborted'` e codice `'ECONNRESET'`.
- `'close'`
- `'close'` sull'oggetto `res`

L'impostazione dell'opzione `timeout` o l'utilizzo della funzione `setTimeout()` non interromperà la richiesta né farà altro che aggiungere un evento `'timeout'`.

Passare un `AbortSignal` e quindi chiamare `abort()` sul `AbortController` corrispondente si comporterà allo stesso modo della chiamata `.destroy()` sulla richiesta. Nello specifico, l'evento `'error'` verrà emesso con un errore con il messaggio `'AbortError: The operation was aborted'`, il codice `'ABORT_ERR'` e la `cause`, se ne è stata fornita una.


## `http.validateHeaderName(name[, label])` {#httpvalidateheadernamename-label}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.5.0, v18.14.0 | Aggiunto il parametro `label`. |
| v14.3.0 | Aggiunto in: v14.3.0 |
:::

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `label` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Etichetta per il messaggio di errore. **Predefinito:** `'Nome dell'intestazione'`.

Esegue le validazioni di basso livello sul `name` fornito che vengono eseguite quando viene chiamato `res.setHeader(name, value)`.

Passare un valore illegale come `name` comporterà la generazione di un [`TypeError`](/it/nodejs/api/errors#class-typeerror), identificato da `code: 'ERR_INVALID_HTTP_TOKEN'`.

Non è necessario utilizzare questo metodo prima di passare le intestazioni a una richiesta o risposta HTTP. Il modulo HTTP convaliderà automaticamente tali intestazioni.

Esempio:



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

**Aggiunto in: v14.3.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<qualsiasi\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Esegue le validazioni di basso livello sul `value` fornito che vengono eseguite quando viene chiamato `res.setHeader(name, value)`.

Passare un valore illegale come `value` comporterà la generazione di un [`TypeError`](/it/nodejs/api/errors#class-typeerror).

- L'errore di valore non definito è identificato da `code: 'ERR_HTTP_INVALID_HEADER_VALUE'`.
- L'errore di carattere di valore non valido è identificato da `code: 'ERR_INVALID_CHAR'`.

Non è necessario utilizzare questo metodo prima di passare le intestazioni a una richiesta o risposta HTTP. Il modulo HTTP convaliderà automaticamente tali intestazioni.

Esempi:



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

**Aggiunto in: v18.8.0, v16.18.0**

- `max` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `1000`.

Imposta il numero massimo di parser HTTP inattivi.

## `WebSocket` {#websocket}

**Aggiunto in: v22.5.0**

Un'implementazione compatibile con il browser di [`WebSocket`](/it/nodejs/api/http#websocket).

