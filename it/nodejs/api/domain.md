---
title: Documentazione Node.js - Modulo Domain
description: Il modulo Domain in Node.js fornisce un modo per gestire errori ed eccezioni nel codice asincrono, permettendo una gestione degli errori e operazioni di pulizia più robuste.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Modulo Domain | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo Domain in Node.js fornisce un modo per gestire errori ed eccezioni nel codice asincrono, permettendo una gestione degli errori e operazioni di pulizia più robuste.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Modulo Domain | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo Domain in Node.js fornisce un modo per gestire errori ed eccezioni nel codice asincrono, permettendo una gestione degli errori e operazioni di pulizia più robuste.
---


# Dominio {#domain}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.8.0 | Nessuna `Promise` creata nei contesti VM ha più una proprietà `.domain`. I loro gestori vengono comunque eseguiti nel dominio appropriato, tuttavia, e le `Promise` create nel contesto principale possiedono ancora una proprietà `.domain`. |
| v8.0.0 | I gestori per le `Promise` vengono ora richiamati nel dominio in cui è stata creata la prima promise di una catena. |
| v1.4.2 | Obsoleto da: v1.4.2 |
:::

::: danger [Stabile: 0 - Obsoleto]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Obsoleto
:::

**Codice sorgente:** [lib/domain.js](https://github.com/nodejs/node/blob/v23.5.0/lib/domain.js)

**Questo modulo è in attesa di essere deprecato.** Una volta finalizzata un'API di sostituzione, questo modulo sarà completamente deprecato. La maggior parte degli sviluppatori **non** dovrebbe avere motivo di utilizzare questo modulo. Gli utenti che devono assolutamente avere la funzionalità fornita dai domini possono fare affidamento su di essa per il momento, ma dovrebbero aspettarsi di dover migrare a una soluzione diversa in futuro.

I domini forniscono un modo per gestire più operazioni di I/O diverse come un singolo gruppo. Se uno qualsiasi degli emettitori di eventi o dei callback registrati a un dominio emette un evento `'error'` o genera un errore, l'oggetto dominio verrà notificato, piuttosto che perdere il contesto dell'errore nel gestore `process.on('uncaughtException')` o causare l'uscita immediata del programma con un codice di errore.

## Avviso: non ignorare gli errori! {#warning-dont-ignore-errors!}

I gestori di errori del dominio non sostituiscono la chiusura di un processo quando si verifica un errore.

Per la natura stessa di come funziona [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) in JavaScript, non c'è quasi mai modo di "riprendere da dove si era interrotto" in modo sicuro, senza perdite di riferimenti o creazione di qualche altro tipo di stato fragile indefinito.

Il modo più sicuro per rispondere a un errore generato è quello di chiudere il processo. Ovviamente, in un normale server web, potrebbero esserci molte connessioni aperte e non è ragionevole chiuderle bruscamente perché un errore è stato attivato da qualcun altro.

L'approccio migliore è quello di inviare una risposta di errore alla richiesta che ha attivato l'errore, lasciando che gli altri terminino nel loro tempo normale e smettere di ascoltare nuove richieste in quel worker.

In questo modo, l'utilizzo del `domain` va di pari passo con il modulo cluster, poiché il processo primario può generare un nuovo worker quando un worker incontra un errore. Per i programmi Node.js che si scalano su più macchine, il proxy di terminazione o il registro dei servizi possono prendere nota del fallimento e reagire di conseguenza.

Ad esempio, questa non è una buona idea:

```js [ESM]
// XXX ATTENZIONE! CATTIVA IDEA!

const d = require('node:domain').create();
d.on('error', (er) => {
  // L'errore non farà crashare il processo, ma quello che fa è peggiore!
  // Anche se abbiamo impedito il riavvio brusco del processo, stiamo perdendo
  // un sacco di risorse se questo dovesse mai accadere.
  // Questo non è meglio di process.on('uncaughtException')!
  console.log(`errore, ma oh beh ${er.message}`);
});
d.run(() => {
  require('node:http').createServer((req, res) => {
    handleRequest(req, res);
  }).listen(PORT);
});
```
Utilizzando il contesto di un dominio e la resilienza della separazione del nostro programma in più processi worker, possiamo reagire in modo più appropriato e gestire gli errori con molta maggiore sicurezza.

```js [ESM]
// Molto meglio!

const cluster = require('node:cluster');
const PORT = +process.env.PORT || 1337;

if (cluster.isPrimary) {
  // Uno scenario più realistico avrebbe più di 2 worker,
  // e forse non mettere il primary e il worker nello stesso file.
  //
  // È anche possibile ottenere un po' più di fantasia sulla registrazione, e
  // implementare qualsiasi logica personalizzata sia necessaria per prevenire DoS
  // attacchi e altri comportamenti scorretti.
  //
  // Vedi le opzioni nella documentazione del cluster.
  //
  // La cosa importante è che il primary fa molto poco,
  // aumentando la nostra resilienza a errori inaspettati.

  cluster.fork();
  cluster.fork();

  cluster.on('disconnect', (worker) => {
    console.error('disconnect!');
    cluster.fork();
  });

} else {
  // il worker
  //
  // Qui è dove mettiamo i nostri bug!

  const domain = require('node:domain');

  // Vedi la documentazione del cluster per maggiori dettagli sull'utilizzo
  // processi worker per servire le richieste. Come funziona, avvertenze, ecc.

  const server = require('node:http').createServer((req, res) => {
    const d = domain.create();
    d.on('error', (er) => {
      console.error(`errore ${er.stack}`);

      // Siamo in un territorio pericoloso!
      // Per definizione, è successo qualcosa di inaspettato,
      // che probabilmente non volevamo.
      // Tutto può succedere ora! Fai molta attenzione!

      try {
        // Assicurati di chiudere entro 30 secondi
        const killtimer = setTimeout(() => {
          process.exit(1);
        }, 30000);
        // Ma non tenere aperto il processo solo per questo!
        killtimer.unref();

        // Smetti di prendere nuove richieste.
        server.close();

        // Fai sapere al primary che siamo morti. Questo attiverà un
        // 'disconnect' nel cluster primary, e poi farà il fork
        // un nuovo worker.
        cluster.worker.disconnect();

        // Cerca di inviare un errore alla richiesta che ha attivato il problema
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('Oops, c\'è stato un problema!\n');
      } catch (er2) {
        // Oh beh, non c'è molto che possiamo fare a questo punto.
        console.error(`Errore durante l'invio del 500! ${er2.stack}`);
      }
    });

    // Poiché req e res sono stati creati prima che questo dominio esistesse,
    // dobbiamo aggiungerli esplicitamente.
    // Vedi la spiegazione del binding implicito vs esplicito qui sotto.
    d.add(req);
    d.add(res);

    // Ora esegui la funzione gestore nel dominio.
    d.run(() => {
      handleRequest(req, res);
    });
  });
  server.listen(PORT);
}

// Questa parte non è importante. Solo un esempio di routing.
// Metti qui una logica applicativa complessa.
function handleRequest(req, res) {
  switch (req.url) {
    case '/error':
      // Facciamo un po' di cose asincrone, e poi...
      setTimeout(() => {
        // Ops!
        flerb.bark();
      }, timeout);
      break;
    default:
      res.end('ok');
  }
}
```

## Aggiunte agli oggetti `Error` {#additions-to-error-objects}

Ogni volta che un oggetto `Error` viene instradato attraverso un dominio, vengono aggiunti alcuni campi extra.

- `error.domain` Il dominio che ha gestito per primo l'errore.
- `error.domainEmitter` L'emettitore di eventi che ha emesso un evento `'error'` con l'oggetto errore.
- `error.domainBound` La funzione di callback che è stata associata al dominio e ha passato un errore come primo argomento.
- `error.domainThrown` Un booleano che indica se l'errore è stato lanciato, emesso o passato a una funzione di callback associata.

## Binding implicito {#implicit-binding}

Se i domini sono in uso, tutti i **nuovi** oggetti `EventEmitter` (inclusi gli oggetti Stream, le richieste, le risposte, ecc.) verranno implicitamente associati al dominio attivo al momento della loro creazione.

Inoltre, i callback passati alle richieste di ciclo di eventi di basso livello (come a `fs.open()`, o altri metodi che accettano callback) verranno automaticamente associati al dominio attivo. Se lanciano, il dominio intercetterà l'errore.

Per evitare un utilizzo eccessivo della memoria, gli oggetti `Domain` stessi non vengono implicitamente aggiunti come figli del dominio attivo. Se lo fossero, sarebbe troppo facile impedire che gli oggetti di richiesta e risposta vengano raccolti correttamente come garbage.

Per annidare gli oggetti `Domain` come figli di un `Domain` padre, devono essere aggiunti esplicitamente.

Il binding implicito instrada gli errori lanciati e gli eventi `'error'` all'evento `'error'` del `Domain`, ma non registra l'`EventEmitter` sul `Domain`. Il binding implicito si occupa solo degli errori lanciati e degli eventi `'error'`.

## Binding esplicito {#explicit-binding}

A volte, il dominio in uso non è quello che dovrebbe essere utilizzato per un emettitore di eventi specifico. Oppure, l'emettitore di eventi potrebbe essere stato creato nel contesto di un dominio, ma dovrebbe invece essere associato a un altro dominio.

Ad esempio, potrebbe esserci un dominio in uso per un server HTTP, ma forse vorremmo avere un dominio separato da utilizzare per ogni richiesta.

Ciò è possibile tramite il binding esplicito.

```js [ESM]
// Crea un dominio di livello superiore per il server
const domain = require('node:domain');
const http = require('node:http');
const serverDomain = domain.create();

serverDomain.run(() => {
  // Il server viene creato nell'ambito di serverDomain
  http.createServer((req, res) => {
    // Anche Req e res vengono creati nell'ambito di serverDomain
    // tuttavia, preferiremmo avere un dominio separato per ogni richiesta.
    // crealo subito e aggiungi req e res.
    const reqd = domain.create();
    reqd.add(req);
    reqd.add(res);
    reqd.on('error', (er) => {
      console.error('Error', er, req.url);
      try {
        res.writeHead(500);
        res.end('Si è verificato un errore, scusate.');
      } catch (er2) {
        console.error('Errore durante l'invio del 500', er2, req.url);
      }
    });
  }).listen(1337);
});
```

## `domain.create()` {#domaincreate}

- Restituisce: [\<Domain\>](/it/nodejs/api/domain#class-domain)

## Classe: `Domain` {#class-domain}

- Estende: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

La classe `Domain` incapsula la funzionalità di indirizzamento degli errori e delle eccezioni non gestite all'oggetto `Domain` attivo.

Per gestire gli errori che intercetta, ascolta il suo evento `'error'`.

### `domain.members` {#domainmembers}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Un array di timer ed emettitori di eventi che sono stati esplicitamente aggiunti al dominio.

### `domain.add(emitter)` {#domainaddemitter}

- `emitter` [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter) | [\<Timer\>](/it/nodejs/api/timers#timers) emettitore o timer da aggiungere al dominio

Aggiunge esplicitamente un emettitore al dominio. Se qualsiasi gestore di eventi chiamato dall'emettitore genera un errore, o se l'emettitore emette un evento `'error'`, verrà indirizzato all'evento `'error'` del dominio, proprio come con il binding implicito.

Questo funziona anche con i timer restituiti da [`setInterval()`](/it/nodejs/api/timers#setintervalcallback-delay-args) e [`setTimeout()`](/it/nodejs/api/timers#settimeoutcallback-delay-args). Se la loro funzione di callback genera un'eccezione, verrà catturata dal gestore `'error'` del dominio.

Se il Timer o `EventEmitter` era già associato a un dominio, viene rimosso da quello e invece associato a questo.

### `domain.bind(callback)` {#domainbindcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione di callback
- Restituisce: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione associata

La funzione restituita sarà un wrapper attorno alla funzione di callback fornita. Quando viene chiamata la funzione restituita, qualsiasi errore generato verrà indirizzato all'evento `'error'` del dominio.

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.bind((er, data) => {
    // Se questo genera un'eccezione, verrà passato anche al dominio.
    return cb(er, data ? JSON.parse(data) : null);
  }));
}

d.on('error', (er) => {
  // Si è verificato un errore da qualche parte. Se lo generiamo ora, l'applicazione si arresterà
  // con il normale numero di riga e messaggio dello stack.
});
```

### `domain.enter()` {#domainenter}

Il metodo `enter()` è un meccanismo utilizzato dai metodi `run()`, `bind()` e `intercept()` per impostare il dominio attivo. Imposta `domain.active` e `process.domain` al dominio, e implicitamente aggiunge il dominio allo stack dei domini gestito dal modulo dominio (vedi [`domain.exit()`](/it/nodejs/api/domain#domainexit) per i dettagli sullo stack dei domini). La chiamata a `enter()` delimita l'inizio di una catena di chiamate asincrone e operazioni I/O associate a un dominio.

Chiamare `enter()` modifica solo il dominio attivo e non altera il dominio stesso. `enter()` e `exit()` possono essere chiamati un numero arbitrario di volte su un singolo dominio.

### `domain.exit()` {#domainexit}

Il metodo `exit()` esce dal dominio corrente, rimuovendolo dallo stack dei domini. Ogni volta che l'esecuzione sta per passare al contesto di una diversa catena di chiamate asincrone, è importante assicurarsi che si esca dal dominio corrente. La chiamata a `exit()` delimita la fine o un'interruzione della catena di chiamate asincrone e operazioni I/O associate a un dominio.

Se ci sono domini multipli e nidificati associati al contesto di esecuzione corrente, `exit()` uscirà da qualsiasi dominio nidificato all'interno di questo dominio.

Chiamare `exit()` modifica solo il dominio attivo e non altera il dominio stesso. `enter()` e `exit()` possono essere chiamati un numero arbitrario di volte su un singolo dominio.

### `domain.intercept(callback)` {#domaininterceptcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione di callback
- Restituisce: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione intercettata

Questo metodo è quasi identico a [`domain.bind(callback)`](/it/nodejs/api/domain#domainbindcallback). Tuttavia, oltre a intercettare gli errori lanciati, intercetterà anche gli oggetti [`Error`](/it/nodejs/api/errors#class-error) inviati come primo argomento alla funzione.

In questo modo, il modello comune `if (err) return callback(err);` può essere sostituito con un singolo gestore di errori in un unico posto.

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.intercept((data) => {
    // Nota, il primo argomento non viene mai passato alla
    // callback poiché si presume che sia l'argomento 'Error'
    // e quindi intercettato dal dominio.

    // Se questo genera un errore, verrà anche passato al dominio
    // in modo che la logica di gestione degli errori possa essere spostata sull'evento
    // 'error' sul dominio invece di essere ripetuta in tutto
    // il programma.
    return cb(null, JSON.parse(data));
  }));
}

d.on('error', (er) => {
  // Si è verificato un errore da qualche parte. Se lo lanciamo ora, si arresterà il programma
  // con il normale numero di riga e il messaggio dello stack.
});
```

### `domain.remove(emitter)` {#domainremoveemitter}

- `emitter` [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter) | [\<Timer\>](/it/nodejs/api/timers#timers) emitter o timer da rimuovere dal dominio.

L'opposto di [`domain.add(emitter)`](/it/nodejs/api/domain#domainaddemitter). Rimuove la gestione del dominio dall'emitter specificato.

### `domain.run(fn[, ...args])` {#domainrunfn-args}

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Esegue la funzione fornita nel contesto del dominio, associando implicitamente tutti gli emettitori di eventi, i timer e le richieste di basso livello che vengono creati in quel contesto. Facoltativamente, è possibile passare argomenti alla funzione.

Questo è il modo più semplice per usare un dominio.

```js [ESM]
const domain = require('node:domain');
const fs = require('node:fs');
const d = domain.create();
d.on('error', (er) => {
  console.error('Errore rilevato!', er);
});
d.run(() => {
  process.nextTick(() => {
    setTimeout(() => { // Simulazione di varie operazioni asincrone
      fs.open('file-inesistente', 'r', (er, fd) => {
        if (er) throw er;
        // procedi...
      });
    }, 100);
  });
});
```
In questo esempio, l'handler `d.on('error')` verrà attivato, invece di arrestare il programma in modo anomalo.

## Domini e promise {#domains-and-promises}

A partire da Node.js 8.0.0, gli handler delle promise vengono eseguiti all'interno del dominio in cui è stata effettuata la chiamata a `.then()` o `.catch()` stessa:

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then((v) => {
    // in esecuzione in d2
  });
});
```
Un callback può essere associato a un dominio specifico usando [`domain.bind(callback)`](/it/nodejs/api/domain#domainbindcallback):

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then(p.domain.bind((v) => {
    // in esecuzione in d1
  }));
});
```
I domini non interferiranno con i meccanismi di gestione degli errori per le promise. In altre parole, non verrà emesso alcun evento `'error'` per i rejection `Promise` non gestiti.

