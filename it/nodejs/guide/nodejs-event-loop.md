---
title: Comprendere il ciclo degli eventi di Node.js
description: Il ciclo degli eventi è il nucleo di Node.js, che consente di eseguire operazioni I/O non bloccanti. È un ciclo a thread singolo che scarica le operazioni nel kernel del sistema quando possibile.
head:
  - - meta
    - name: og:title
      content: Comprendere il ciclo degli eventi di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il ciclo degli eventi è il nucleo di Node.js, che consente di eseguire operazioni I/O non bloccanti. È un ciclo a thread singolo che scarica le operazioni nel kernel del sistema quando possibile.
  - - meta
    - name: twitter:title
      content: Comprendere il ciclo degli eventi di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il ciclo degli eventi è il nucleo di Node.js, che consente di eseguire operazioni I/O non bloccanti. È un ciclo a thread singolo che scarica le operazioni nel kernel del sistema quando possibile.
---


# Il ciclo di eventi di Node.js

## Cos'è il ciclo di eventi?

Il ciclo di eventi è ciò che permette a Node.js di eseguire operazioni I/O non bloccanti — nonostante il fatto che un singolo thread JavaScript sia usato di default — scaricando le operazioni al kernel del sistema quando possibile.

Poiché la maggior parte dei kernel moderni sono multi-thread, possono gestire l'esecuzione di molteplici operazioni in background. Quando una di queste operazioni è completata, il kernel lo comunica a Node.js in modo che la callback appropriata possa essere aggiunta alla coda di sondaggio per essere eventualmente eseguita. Spiegheremo questo in maggiore dettaglio più avanti in questo argomento.

## Il ciclo di eventi spiegato

Quando Node.js si avvia, inizializza il ciclo di eventi, elabora lo script di input fornito (o entra nella REPL, che non è trattata in questo documento) che può effettuare chiamate API asincrone, pianificare timer o chiamare process.nextTick(), quindi inizia l'elaborazione del ciclo di eventi.

Il seguente diagramma mostra una panoramica semplificata dell'ordine delle operazioni del ciclo di eventi.

```bash
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

::: tip
Ogni riquadro sarà indicato come una "fase" del ciclo di eventi.
:::

Ogni fase ha una coda FIFO di callback da eseguire. Mentre ogni fase è speciale a modo suo, generalmente, quando il ciclo di eventi entra in una data fase, eseguirà qualsiasi operazione specifica di quella fase, quindi eseguirà le callback nella coda di quella fase fino a quando la coda non è stata esaurita o il numero massimo di callback è stato eseguito. Quando la coda è stata esaurita o viene raggiunto il limite di callback, il ciclo di eventi passerà alla fase successiva e così via.

Poiché una qualsiasi di queste operazioni può pianificare più operazioni e i nuovi eventi elaborati nella fase di **sondaggio** vengono accodati dal kernel, gli eventi di sondaggio possono essere accodati mentre gli eventi di sondaggio vengono elaborati. Di conseguenza, le callback a lunga esecuzione possono consentire alla fase di sondaggio di durare molto più a lungo della soglia di un timer. Vedere le sezioni dei timer e del sondaggio per maggiori dettagli.

::: tip
C'è una leggera discrepanza tra l'implementazione di Windows e quella di Unix/Linux, ma non è importante per questa dimostrazione. Le parti più importanti sono qui. Ci sono in realtà sette o otto passaggi, ma quelli che ci interessano — quelli che Node.js usa effettivamente — sono quelli sopra.
:::


## Panoramica delle fasi
- **timers**: questa fase esegue i callback pianificati da `setTimeout()` e `setInterval()`.
- **pending callbacks**: esegue i callback di I/O rinviati alla successiva iterazione del ciclo.
- **idle, prepare**: utilizzati solo internamente.
- **poll**: recupera nuovi eventi di I/O; esegue callback relativi all'I/O (quasi tutti ad eccezione dei close callback, quelli pianificati dai timer e `setImmediate()`); node si bloccherà qui quando appropriato.
- **check**: i callback di `setImmediate()` vengono invocati qui.
- **close callbacks**: alcuni close callback, ad es. `socket.on('close', ...)`.

Tra ogni esecuzione del ciclo di eventi, Node.js verifica se è in attesa di I/O asincrono o timer e si spegne in modo pulito se non ce ne sono.

## Fasi in dettaglio

### timers

Un timer specifica la **soglia** dopo la quale un callback fornito può essere eseguito piuttosto che il tempo **esatto** in cui una persona *vuole che venga eseguito*. I callback dei timer verranno eseguiti non appena possono essere pianificati dopo che è trascorso l'intervallo di tempo specificato; tuttavia, la pianificazione del sistema operativo o l'esecuzione di altri callback potrebbe ritardarli.

::: tip
Tecnicamente, la fase di [poll](/it/nodejs/guide/nodejs-event-loop#poll) controlla quando vengono eseguiti i timer.
:::

Ad esempio, supponiamo di pianificare un timeout da eseguire dopo una soglia di 100 ms, quindi il tuo script inizia a leggere in modo asincrono un file che richiede 95 ms:

```js
const fs = require('node:fs');
function someAsyncOperation(callback) {
  // Si presume che ci vogliano 95 ms per completare
  fs.readFile('/path/to/file', callback);
}
const timeoutScheduled = Date.now();
setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;
  console.log(`${delay}ms sono trascorsi da quando sono stato pianificato`);
}, 100);
// esegui someAsyncOperation che richiede 95 ms per completare
someAsyncOperation(() => {
  const startCallback = Date.now();
  // fai qualcosa che richiederà 10ms...
  while (Date.now() - startCallback < 10) {
    // non fare nulla
  }
});
```

Quando il ciclo di eventi entra nella fase di **poll**, ha una coda vuota (`fs.readFile()` non è stato completato), quindi attenderà il numero di ms rimanenti fino a quando non viene raggiunta la soglia del timer più vicino. Mentre aspetta, passano 95 ms, `fs.readFile()` termina la lettura del file e il suo callback, che richiede 10 ms per essere completato, viene aggiunto alla coda di polling ed eseguito. Al termine del callback, non ci sono più callback nella coda, quindi il ciclo di eventi vedrà che la soglia del timer più vicino è stata raggiunta, quindi tornerà alla fase dei timer per eseguire il callback del timer. In questo esempio, vedrai che il ritardo totale tra la pianificazione del timer e l'esecuzione del suo callback sarà di 105 ms.

::: tip
Per impedire alla fase di poll di affamare il ciclo di eventi, [libuv](https://libuv.org/) (la libreria C che implementa il ciclo di eventi di Node.js e tutti i comportamenti asincroni della piattaforma) ha anche un massimo rigido (dipendente dal sistema) prima di interrompere il polling per ulteriori eventi.
:::


## Callback pendenti
Questa fase esegue callback per alcune operazioni di sistema come i tipi di errori TCP. Ad esempio, se un socket TCP riceve `ECONNREFUSED` quando tenta di connettersi, alcuni sistemi *nix vogliono aspettare per segnalare l'errore. Questo verrà messo in coda per essere eseguito nella fase di **callback pendenti**.

### poll

La fase di **poll** ha due funzioni principali:

1. Calcolare per quanto tempo dovrebbe bloccarsi ed eseguire il polling per I/O, quindi
2. Elaborare gli eventi nella coda di **poll**.

Quando il ciclo di eventi entra nella fase di **poll** e non sono pianificati timer, succederà una di queste due cose:

- Se la coda di ***poll*** ***non è vuota***, il ciclo di eventi itererà attraverso la sua coda di callback eseguendoli in modo sincrono fino a quando la coda non sarà esaurita o verrà raggiunto il limite massimo dipendente dal sistema.

- Se la coda di ***poll*** ***è vuota***, succederà una di queste altre due cose:

    - Se gli script sono stati pianificati da `setImmediate()`, il ciclo di eventi terminerà la fase di **poll** e continuerà alla fase di check per eseguire quegli script pianificati.

    - Se gli script **non sono stati** pianificati da `setImmediate()`, il ciclo di eventi attenderà che i callback vengano aggiunti alla coda, quindi li eseguirà immediatamente.

Una volta che la coda di **poll** è vuota, il ciclo di eventi verificherà la presenza di timer *le cui soglie di tempo* sono state raggiunte. Se uno o più timer sono pronti, il ciclo di eventi tornerà alla fase **timer** per eseguire i callback di tali timer.

### check

Questa fase consente a una persona di eseguire callback immediatamente dopo che la fase di **poll** è stata completata. Se la fase di **poll** diventa inattiva e gli script sono stati messi in coda con `setImmediate()`, il ciclo di eventi può continuare alla fase di check anziché attendere.

`setImmediate()` è in realtà un timer speciale che viene eseguito in una fase separata del ciclo di eventi. Utilizza un'API libuv che pianifica l'esecuzione dei callback dopo che la fase di **poll** è stata completata.

Generalmente, man mano che il codice viene eseguito, il ciclo di eventi alla fine raggiungerà la fase di **poll** in cui attenderà una connessione in entrata, una richiesta, ecc. Tuttavia, se un callback è stato pianificato con `setImmediate()` e la fase di **poll** diventa inattiva, terminerà e continuerà alla fase di **check** anziché attendere gli eventi di **poll**.


### Callback di chiusura

Se un socket o un handle viene chiuso bruscamente (ad es. `socket.destroy()`), l'evento `'close'` verrà emesso in questa fase. Altrimenti verrà emesso tramite `process.nextTick()`.

## `setImmediate()` vs `setTimeout()`

`setImmediate()` e `setTimeout()` sono simili, ma si comportano in modi diversi a seconda di quando vengono chiamati.

- `setImmediate()` è progettato per eseguire uno script una volta completata la fase di **poll** corrente.
- `setTimeout()` pianifica l'esecuzione di uno script dopo che è trascorso un intervallo minimo di tempo in ms.

L'ordine in cui vengono eseguiti i timer varia a seconda del contesto in cui vengono chiamati. Se entrambi vengono chiamati all'interno del modulo principale, la tempistica sarà vincolata dalle prestazioni del processo (che possono essere influenzate da altre applicazioni in esecuzione sulla macchina).

Ad esempio, se eseguiamo il seguente script che non si trova all'interno di un ciclo I/O (cioè il modulo principale), l'ordine in cui vengono eseguiti i due timer è non deterministico, poiché è vincolato dalle prestazioni del processo:

::: code-group

```js [JS]
// timeout_vs_immediate.js
setTimeout(() => {
  console.log('timeout');
}, 0);
setImmediate(() => {
  console.log('immediate');
});
```

```bash [BASH]
$ node timeout_vs_immediate.js
timeout
immediate
$ node timeout_vs_immediate.js
immediate
timeout
```

:::

Tuttavia, se sposti le due chiamate all'interno di un ciclo I/O, la callback immediata viene sempre eseguita per prima:

::: code-group

```js [JS]
// timeout_vs_immediate.js
const fs = require('node:fs');
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```

```bash [BASH]
$ node timeout_vs_immediate.js
immediate
timeout
$ node timeout_vs_immediate.js
immediate
timeout
```

:::

Il vantaggio principale dell'utilizzo di `setImmediate()` rispetto a `setTimeout()` è che `setImmediate()` verrà sempre eseguito prima di qualsiasi timer se pianificato all'interno di un ciclo I/O, indipendentemente dal numero di timer presenti.


## `process.nextTick()`

### Comprendere `process.nextTick()`

Potresti aver notato che `process.nextTick()` non è stato mostrato nel diagramma, anche se fa parte dell'API asincrona. Questo perché `process.nextTick()` non è tecnicamente parte del ciclo di eventi. Invece, la `nextTickQueue` verrà elaborata al termine dell'operazione corrente, indipendentemente dalla fase corrente del ciclo di eventi. Qui, un'operazione è definita come una transizione dal gestore C/C++ sottostante e dalla gestione del JavaScript che deve essere eseguito.

Tornando al nostro diagramma, ogni volta che chiami `process.nextTick()` in una determinata fase, tutti i callback passati a `process.nextTick()` verranno risolti prima che il ciclo di eventi continui. Questo può creare alcune brutte situazioni perché **ti permette di "affamare" il tuo I/O effettuando chiamate ricorsive** a `process.nextTick()`, il che impedisce al ciclo di eventi di raggiungere la fase di **poll**.

### Perché dovrebbe essere permesso?

Perché qualcosa del genere dovrebbe essere incluso in Node.js? In parte è una filosofia di progettazione in cui un'API dovrebbe essere sempre asincrona anche quando non è necessario che lo sia. Prendi questo frammento di codice come esempio:

```js
function apiCall(arg, callback) {
  if (typeof arg !== 'string')
    return process.nextTick(
      callback,
      new TypeError('argument should be string')
    );
}
```

Il frammento esegue un controllo degli argomenti e, se non è corretto, passerà l'errore al callback. L'API è stata aggiornata abbastanza di recente per consentire il passaggio di argomenti a `process.nextTick()` consentendogli di prendere qualsiasi argomento passato dopo il callback per essere propagato come argomenti al callback in modo da non dover annidare le funzioni.

Quello che stiamo facendo è restituire un errore all'utente, ma solo dopo aver consentito al resto del codice dell'utente di essere eseguito. Utilizzando `process.nextTick()` garantiamo che `apiCall()` esegua sempre il suo callback dopo il resto del codice dell'utente e prima che il ciclo di eventi possa procedere. Per ottenere ciò, lo stack di chiamate JS può svolgersi e quindi eseguire immediatamente il callback fornito, il che consente a una persona di effettuare chiamate ricorsive a `process.nextTick()` senza raggiungere un `RangeError: Maximum call stack size exceeded from v8`.

Questa filosofia può portare ad alcune situazioni potenzialmente problematiche. Prendi questo frammento di codice come esempio:

```js
let bar;
// questo ha una firma asincrona, ma chiama il callback in modo sincrono
function someAsyncApiCall(callback) {
  callback();
}
// il callback viene chiamato prima che `someAsyncApiCall` sia completato.
someAsyncApiCall(() => {
  // poiché someAsyncApiCall non è stato completato, a bar non è stato assegnato alcun valore
  console.log('bar', bar); // undefined
});
bar = 1;
```

L'utente definisce `someAsyncApiCall()` per avere una firma asincrona, ma in realtà opera in modo sincrono. Quando viene chiamato, il callback fornito a `someAsyncApiCall()` viene chiamato nella stessa fase del ciclo di eventi perché `someAsyncApiCall()` in realtà non fa nulla in modo asincrono. Di conseguenza, il callback cerca di fare riferimento a bar anche se potrebbe non avere ancora quella variabile nell'ambito, perché lo script non è stato in grado di essere eseguito fino al completamento.

Inserendo il callback in un `process.nextTick()`, lo script ha ancora la possibilità di essere eseguito fino al completamento, consentendo a tutte le variabili, funzioni, ecc., di essere inizializzate prima che venga chiamato il callback. Ha anche il vantaggio di non consentire al ciclo di eventi di continuare. Potrebbe essere utile per l'utente essere avvisato di un errore prima che il ciclo di eventi possa continuare. Ecco l'esempio precedente che utilizza `process.nextTick()`:

```js
let bar;
function someAsyncApiCall(callback) {
  process.nextTick(callback);
}
someAsyncApiCall(() => {
  console.log('bar', bar); // 1
});
bar = 1;
```

Ecco un altro esempio del mondo reale:

```js
const server = net.createServer(() => {}).listen(8080);
server.on('listening', () => {});
```

Quando viene passata solo una porta, la porta viene vincolata immediatamente. Quindi, il callback `'listening'` potrebbe essere chiamato immediatamente. Il problema è che il callback `.on('listening')` non sarà stato impostato a quel punto.

Per aggirare questo problema, l'evento `'listening'` viene accodato in un `nextTick()` per consentire allo script di essere eseguito fino al completamento. Ciò consente all'utente di impostare qualsiasi gestore di eventi desideri.


## `process.nextTick()` vs `setImmediate()`

Abbiamo due chiamate che sono simili per quanto riguarda gli utenti, ma i loro nomi sono fonte di confusione.

- `process.nextTick()` si attiva immediatamente nella stessa fase
- `setImmediate()` si attiva alla successiva iterazione o `'tick'` del ciclo di eventi

In sostanza, i nomi dovrebbero essere scambiati. `process.nextTick()` si attiva più immediatamente di `setImmediate()`, ma questo è un artefatto del passato che difficilmente cambierà. Effettuare questo scambio romperebbe una grande percentuale dei pacchetti su npm. Ogni giorno vengono aggiunti nuovi moduli, il che significa che ogni giorno che aspettiamo, si verificano più potenziali rotture. Anche se sono confusi, i nomi stessi non cambieranno.

::: tip
Raccomandiamo agli sviluppatori di utilizzare `setImmediate()` in tutti i casi perché è più facile da capire.
:::

## Perché usare `process.nextTick()`?

Ci sono due ragioni principali:

1. Consentire agli utenti di gestire gli errori, pulire le risorse non necessarie o magari riprovare la richiesta prima che il ciclo di eventi continui.

2. A volte è necessario consentire l'esecuzione di un callback dopo che lo stack di chiamate è stato svolto ma prima che il ciclo di eventi continui.

Un esempio è quello di soddisfare le aspettative dell'utente. Semplice esempio:

```js
const server = net.createServer();
server.on('connection', conn => {});
server.listen(8080);
server.on('listening', () => {});
```

Supponiamo che `listen()` venga eseguito all'inizio del ciclo di eventi, ma il callback di ascolto venga inserito in un `setImmediate()`. A meno che non venga passato un nome host, il binding alla porta avverrà immediatamente. Affinché il ciclo di eventi proceda, deve raggiungere la fase di polling, il che significa che c'è una probabilità non nulla che una connessione possa essere stata ricevuta consentendo l'attivazione dell'evento di connessione prima dell'evento di ascolto.

Un altro esempio è l'estensione di un `EventEmitter` e l'emissione di un evento dall'interno del costruttore:

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    this.emit('event');
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```

Non è possibile emettere immediatamente un evento dal costruttore perché lo script non avrà elaborato fino al punto in cui l'utente assegna un callback a tale evento. Quindi, all'interno del costruttore stesso, è possibile utilizzare `process.nextTick()` per impostare un callback per emettere l'evento dopo che il costruttore ha terminato, il che fornisce i risultati previsti:

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    // use nextTick to emit the event once a handler is assigned
    process.nextTick(() => {
      this.emit('event');
    });
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```
