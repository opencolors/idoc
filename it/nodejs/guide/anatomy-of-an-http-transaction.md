---
title: Capire la gestione delle richieste HTTP in Node.js
description: Una guida completa per gestire le richieste HTTP in Node.js, coprendo argomenti come la creazione di un server, la gestione delle richieste e delle risposte, il routing e la gestione degli errori.
head:
  - - meta
    - name: og:title
      content: Capire la gestione delle richieste HTTP in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Una guida completa per gestire le richieste HTTP in Node.js, coprendo argomenti come la creazione di un server, la gestione delle richieste e delle risposte, il routing e la gestione degli errori.
  - - meta
    - name: twitter:title
      content: Capire la gestione delle richieste HTTP in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Una guida completa per gestire le richieste HTTP in Node.js, coprendo argomenti come la creazione di un server, la gestione delle richieste e delle risposte, il routing e la gestione degli errori.
---


# Anatomia di una Transazione HTTP

Lo scopo di questa guida è fornire una solida comprensione del processo di gestione HTTP di Node.js. Assumeremo che tu sappia, in senso generale, come funzionano le richieste HTTP, indipendentemente dalla lingua o dall'ambiente di programmazione. Presumeremo anche una certa familiarità con gli EventEmitter e gli Stream di Node.js. Se non hai molta familiarità con loro, vale la pena dare una rapida lettura alla documentazione API per ciascuno di essi.

## Creare il Server

Qualsiasi applicazione server web node dovrà ad un certo punto creare un oggetto server web. Questo viene fatto usando `createServer`.

```javascript
const http = require('node:http');
const server = http.createServer((request, response) => {
    // la magia accade qui!
});
```

La funzione passata a `createServer` viene chiamata una volta per ogni richiesta HTTP effettuata a quel server, quindi è chiamata request handler (gestore di richieste). Infatti, l'oggetto Server restituito da `createServer` è un EventEmitter, e quello che abbiamo qui è solo una scorciatoia per creare un oggetto server e poi aggiungere il listener in seguito.

```javascript
const server = http.createServer();
server.on('request', (request, response) => {
    // lo stesso tipo di magia accade qui!
});
```

Quando una richiesta HTTP colpisce il server, node chiama la funzione di gestione della richiesta con alcuni oggetti utili per gestire la transazione, la richiesta e la risposta. Ci arriveremo a breve. Per poter effettivamente servire le richieste, è necessario chiamare il metodo `listen` sull'oggetto server. Nella maggior parte dei casi, tutto ciò che dovrai passare a `listen` è il numero di porta su cui vuoi che il server ascolti. Ci sono anche altre opzioni, quindi consulta il riferimento API.

## Metodo, URL e Header

Quando si gestisce una richiesta, la prima cosa che probabilmente vorrai fare è guardare il metodo e l'URL, in modo da poter intraprendere le azioni appropriate. Node.js rende questo relativamente indolore mettendo proprietà utili sull'oggetto richiesta.

```javascript
const { method, url } = request;
```

L'oggetto richiesta è un'istanza di `IncomingMessage`. Il metodo qui sarà sempre un normale metodo/verbo HTTP. L'url è l'URL completo senza il server, il protocollo o la porta. Per un URL tipico, questo significa tutto ciò che segue e include la terza barra.

Anche gli header non sono lontani. Si trovano nel loro oggetto sulla richiesta chiamato `headers`.

```javascript
const { headers } = request;
const userAgent = headers['user-agent'];
```

È importante notare qui che tutti gli header sono rappresentati solo in minuscolo, indipendentemente da come il client li ha effettivamente inviati. Questo semplifica il compito di analizzare gli header per qualsiasi scopo.

Se alcuni header vengono ripetuti, i loro valori vengono sovrascritti o uniti come stringhe separate da virgole, a seconda dell'header. In alcuni casi, questo può essere problematico, quindi è disponibile anche `rawHeaders`.


## Corpo della Richiesta

Quando si riceve una richiesta POST o PUT, il corpo della richiesta potrebbe essere importante per la tua applicazione. Accedere ai dati del corpo è un po' più complesso rispetto all'accesso alle intestazioni della richiesta. L'oggetto `request` che viene passato a un gestore implementa l'interfaccia `ReadableStream`. Questo stream può essere ascoltato o indirizzato altrove come qualsiasi altro stream. Possiamo estrarre i dati direttamente dallo stream ascoltando gli eventi `'data'` e `'end'` dello stream.

Il chunk emesso in ogni evento `'data'` è un `Buffer`. Se sai che saranno dati di tipo stringa, la cosa migliore da fare è raccogliere i dati in un array, quindi all'evento `'end'`, concatenarli e trasformarli in stringa.

```javascript
let body = [];
request.on('data', chunk => {
    body.push(chunk);
});
request.on('end', () => {
    body = Buffer.concat(body).toString();
    // a questo punto, 'body' ha l'intero corpo della richiesta memorizzato al suo interno come stringa
});
```
::: tip NOTA
Questo può sembrare un po' noioso e, in molti casi, lo è. Fortunatamente, ci sono moduli come `concat-stream` e `body` su npm che possono aiutare a nascondere parte di questa logica. È importante avere una buona comprensione di ciò che sta succedendo prima di intraprendere questa strada, ed è per questo che sei qui!
:::

## Una Breve Nota sugli Errori

Poiché l'oggetto `request` è un `ReadableStream`, è anche un `EventEmitter` e si comporta come tale quando si verifica un errore.

Un errore nello stream della richiesta si presenta emettendo un evento `'error'` sullo stream. Se non hai un listener per questo evento, l'errore verrà lanciato, il che potrebbe mandare in crash il tuo programma Node.js. Dovresti quindi aggiungere un listener `'error'` sui tuoi stream di richiesta, anche se ti limiti a registrarlo e proseguire per la tua strada. (Anche se probabilmente è meglio inviare una sorta di risposta di errore HTTP. Maggiori informazioni su questo più avanti.)

```javascript
request.on('error', err => {
    // Questo stampa il messaggio di errore e la stack trace su stderr.
    console.error(err.stack);
});
```

Ci sono altri modi per [gestire questi errori](/it/nodejs/api/errors) come altre astrazioni e strumenti, ma sii sempre consapevole che gli errori possono verificarsi e si verificano, e dovrai affrontarli.


## Cosa abbiamo finora

A questo punto, abbiamo trattato la creazione di un server e l'estrazione del metodo, dell'URL, degli header e del corpo dalle richieste. Mettendo tutto insieme, potrebbe assomigliare a questo:

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', err => console.error(err));
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        // A questo punto, abbiamo gli header, il metodo, l'url e il corpo e ora possiamo
        // fare tutto ciò che dobbiamo fare per rispondere a questa richiesta.
    });
});

.listen(8080); // Attiva questo server, in ascolto sulla porta 8080.
```

Se eseguiamo questo esempio, saremo in grado di ricevere richieste, ma non di rispondere. Infatti, se raggiungi questo esempio in un browser web, la tua richiesta andrà in timeout, poiché nulla viene rispedito al client.

Finora non abbiamo toccato affatto l'oggetto `response`, che è un'istanza di `ServerResponse`, che è uno `WritableStream`. Contiene molti metodi utili per inviare dati al client. Lo tratteremo in seguito.

## Codice di stato HTTP

Se non ti prendi la briga di impostarlo, il codice di stato HTTP in una risposta sarà sempre 200. Ovviamente, non tutte le risposte HTTP lo giustificano e, a un certo punto, vorrai sicuramente inviare un codice di stato diverso. Per farlo, puoi impostare la proprietà `statusCode`.

```javascript
response.statusCode = 404; // Comunica al client che la risorsa non è stata trovata.
```

Ci sono alcune altre scorciatoie per questo, come vedremo presto.

## Impostazione degli header di risposta

Gli header vengono impostati tramite un comodo metodo chiamato `setHeader`.

```javascript
response.setHeader('Content-Type', 'application/json');
response.setHeader('X-Powered-By', 'bacon');
```

Quando si impostano gli header in una risposta, la distinzione tra maiuscole e minuscole non è importante nei loro nomi. Se imposti un header ripetutamente, l'ultimo valore impostato è il valore che viene inviato.


## Invio Esplicito dei Dati dell'Header

I metodi per impostare gli header e il codice di stato che abbiamo già discusso presuppongono che tu stia usando "header impliciti". Ciò significa che stai contando sul fatto che Node invii gli header per te al momento corretto prima di iniziare a inviare i dati del corpo.

Se vuoi, puoi scrivere esplicitamente gli header nel flusso di risposta. Per fare ciò, esiste un metodo chiamato `writeHead`, che scrive il codice di stato e gli header nel flusso.

## Invio Esplicito dei Dati dell'Header

```javascript
response.writeHead(200, {
    'Content-Type': 'application/json',
    'X-Powered-By': 'bacon',
});
```

Una volta impostati gli header (in modo implicito o esplicito), sei pronto per iniziare a inviare i dati di risposta.

## Invio del Corpo della Risposta

Poiché l'oggetto response è un `WritableStream`, scrivere un corpo di risposta al client è solo una questione di usare i soliti metodi di stream.

```javascript
response.write('<html>');
response.write('<body>');
response.write('<h1>Hello, World!</h1>');
response.write('</body>');
response.write('</html>');
response.end();
```

La funzione `end` sugli stream può anche accettare alcuni dati opzionali da inviare come ultimo bit di dati sullo stream, quindi possiamo semplificare l'esempio sopra come segue.

```javascript
response.end('<html><body><h1>hello,world!</h1></body></html>');
```

::: tip NOTE
È importante impostare lo stato e gli header prima di iniziare a scrivere blocchi di dati nel corpo. Questo ha senso, poiché gli header vengono prima del corpo nelle risposte HTTP.
:::

## Un'Altra Cosa Veloce sugli Errori

Il flusso di risposta può anche emettere eventi 'error' e, a un certo punto, dovrai occuparti anche di questo. Tutti i consigli per gli errori del flusso di richiesta si applicano anche qui.

## Metti Tutto Insieme

Ora che abbiamo imparato a creare risposte HTTP, mettiamo tutto insieme. Basandoci sull'esempio precedente, creeremo un server che restituisce tutti i dati che ci sono stati inviati dall'utente. Formatteremo questi dati come JSON usando `JSON.stringify`.

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request
      .on('error', err => {
        console.error(err);
      })
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        // BEGINNING OF NEW STUFF
        response.on('error', err => {
          console.error(err);
        });
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        // Note: the 2 lines above could be replaced with this next one:
        // response.writeHead(200, {'Content-Type': 'application/json'})
        const responseBody = { headers, method, url, body };
        response.write(JSON.stringify(responseBody));
        response.end();
        // Note: the 2 lines above could be replaced with this next one:
        // response.end(JSON.stringify(responseBody))
        // END OF NEW STUFF
      });
  })
  .listen(8080);
```

## Esempio EchoServer

Semplifichiamo l'esempio precedente per creare un semplice echo server, che si limita a rispedire i dati ricevuti nella richiesta direttamente nella risposta. Tutto quello che dobbiamo fare è recuperare i dati dallo stream della richiesta e scrivere tali dati nello stream della risposta, in modo simile a quanto fatto in precedenza.

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        response.end(body);
    });
});

.listen(8080);
```

Ora modifichiamo questo. Vogliamo inviare un echo solo alle seguenti condizioni:
- Il metodo della richiesta è POST.
- L'URL è /echo.

In ogni altro caso, vogliamo semplicemente rispondere con un 404.

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
      let body = [];
      request
        .on('data', chunk => {
          body.push(chunk);
        })
        .on('end', () => {
          body = Buffer.concat(body).toString();
          response.end(body);
        });
    } else {
      response.statusCode = 404;
      response.end();
    }
  })
  .listen(8080);
```

::: tip NOTE
Controllando l'URL in questo modo, stiamo eseguendo una forma di "routing". Altre forme di routing possono essere semplici come istruzioni `switch` o complesse come interi framework come `express`. Se stai cercando qualcosa che faccia il routing e nient'altro, prova `router`.
:::

Ottimo! Ora proviamo a semplificarlo. Ricorda, l'oggetto request è un `ReadableStream` e l'oggetto response è un `WritableStream`. Ciò significa che possiamo usare `pipe` per indirizzare i dati da uno all'altro. Questo è esattamente quello che vogliamo per un echo server!

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

Evviva gli stream!

Non abbiamo ancora finito però. Come accennato più volte in questa guida, gli errori possono verificarsi e si verificano, e dobbiamo gestirli.

Per gestire gli errori sullo stream della richiesta, registreremo l'errore su `stderr` e invieremo un codice di stato 400 per indicare una `Richiesta Errata`. In un'applicazione reale, però, vorremmo ispezionare l'errore per capire quale sarebbe il codice di stato e il messaggio corretti. Come al solito con gli errori, dovresti consultare la [documentazione degli Errori](/it/nodejs/api/errors).

Sulla risposta, registreremo semplicemente l'errore su `stderr`.

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    request.on('error', err => {
        console.error(err);
        response.statusCode = 400;
        response.end();
    });
    response.on('error', err => {
        console.error(err);
    });
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

Ora abbiamo trattato la maggior parte delle basi della gestione delle richieste HTTP. A questo punto, dovresti essere in grado di:
- Istanziare un server HTTP con una funzione di gestione delle `request` e farlo ascoltare su una porta.
- Ottenere header, URL, metodo e dati del body dagli oggetti `request`.
- Prendere decisioni di routing basate su URL e/o altri dati negli oggetti `request`.
- Inviare header, codici di stato HTTP e dati del body tramite oggetti `response`.
- Inviare dati tramite pipe dagli oggetti `request` e agli oggetti response.
- Gestire gli errori dello stream sia nello stream `request` che nello stream `response`.

Da queste basi, è possibile costruire server HTTP Node.js per molti casi d'uso tipici. Ci sono molte altre cose che queste API forniscono, quindi assicurati di leggere la documentazione API per [`EventEmitters`](/it/nodejs/api/events), [`Streams`](/it/nodejs/api/stream) e [`HTTP`](/it/nodejs/api/http).

