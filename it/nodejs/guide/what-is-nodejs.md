---
title: Introduzione a Node.js
description: Node.js è un ambiente di esecuzione JavaScript open-source e multiplataforma che consente agli sviluppatori di eseguire JavaScript sul lato server, offrendo elevate prestazioni e scalabilità.
head:
  - - meta
    - name: og:title
      content: Introduzione a Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js è un ambiente di esecuzione JavaScript open-source e multiplataforma che consente agli sviluppatori di eseguire JavaScript sul lato server, offrendo elevate prestazioni e scalabilità.
  - - meta
    - name: twitter:title
      content: Introduzione a Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js è un ambiente di esecuzione JavaScript open-source e multiplataforma che consente agli sviluppatori di eseguire JavaScript sul lato server, offrendo elevate prestazioni e scalabilità.
---


# Introduzione a Node.js

Node.js è un ambiente di runtime JavaScript open source e multipiattaforma. È uno strumento popolare per quasi ogni tipo di progetto!

Node.js esegue il motore JavaScript V8, il cuore di Google Chrome, al di fuori del browser. Questo permette a Node.js di essere molto performante.

Un'applicazione Node.js viene eseguita in un singolo processo, senza creare un nuovo thread per ogni richiesta. Node.js fornisce un insieme di primitive I/O asincrone nella sua libreria standard che impediscono al codice JavaScript di bloccarsi e, in generale, le librerie in Node.js sono scritte utilizzando paradigmi non bloccanti, rendendo il comportamento bloccante l'eccezione piuttosto che la norma.

Quando Node.js esegue un'operazione di I/O, come la lettura dalla rete, l'accesso a un database o al filesystem, invece di bloccare il thread e sprecare cicli di CPU in attesa, Node.js riprenderà le operazioni quando la risposta ritorna.

Questo permette a Node.js di gestire migliaia di connessioni concorrenti con un singolo server senza introdurre l'onere di gestire la concorrenza dei thread, che potrebbe essere una significativa fonte di bug.

Node.js ha un vantaggio unico perché milioni di sviluppatori frontend che scrivono JavaScript per il browser sono ora in grado di scrivere il codice lato server in aggiunta al codice lato client senza la necessità di imparare un linguaggio completamente diverso.

In Node.js i nuovi standard ECMAScript possono essere utilizzati senza problemi, in quanto non devi aspettare che tutti i tuoi utenti aggiornino i loro browser - sei tu a decidere quale versione ECMAScript usare cambiando la versione di Node.js, e puoi anche abilitare specifiche funzionalità sperimentali eseguendo Node.js con dei flag.

## Un Esempio di Applicazione Node.js

L'esempio più comune di Hello World di Node.js è un web server:

```js
import { createServer } from 'node:http'
const hostname = '127.0.0.1'
const port = 3000
const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World')
})
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
```

Per eseguire questo frammento, salvalo come file `server.js` ed esegui `node server.js` nel tuo terminale. Se usi la versione mjs del codice, dovresti salvarlo come file `server.mjs` ed eseguire `node server.mjs` nel tuo terminale.

Questo codice include innanzitutto il [modulo http](/it/nodejs/api/http) di Node.js.

Node.js ha una [libreria standard](/it/nodejs/api/synopsis) fantastica, che include il supporto di prima classe per il networking.

Il metodo `createServer()` di `http` crea un nuovo server HTTP e lo restituisce.

Il server è impostato per ascoltare sulla porta e sull'hostname specificati. Quando il server è pronto, viene chiamata la funzione di callback, in questo caso informandoci che il server è in esecuzione.

Ogni volta che viene ricevuta una nuova richiesta, viene chiamato l'[evento request](/it/nodejs/api/http), fornendo due oggetti: una richiesta (un oggetto `http.IncomingMessage`) e una risposta (un oggetto `http.ServerResponse`).

Questi 2 oggetti sono essenziali per gestire la chiamata HTTP.

Il primo fornisce i dettagli della richiesta. In questo semplice esempio, questo non viene utilizzato, ma potresti accedere agli header della richiesta e ai dati della richiesta.

Il secondo viene utilizzato per restituire i dati al chiamante.

In questo caso con:

```js
res.setHeader('Content-Type', 'text/plain')
```

impostiamo la proprietà statusCode a 200, per indicare una risposta di successo.

Impostiamo l'header Content-Type:

```js
res.setHeader('Content-Type', 'text/plain')
```

e chiudiamo la risposta, aggiungendo il contenuto come argomento a `end()`:

```js
res.end('Hello World')
```

Questo invierà la risposta al client.

