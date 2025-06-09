---
title: Documentazione Node.js - Errori
description: Questa sezione della documentazione di Node.js fornisce dettagli completi sulla gestione degli errori, inclusi le classi di errore, i codici di errore e come gestire gli errori nelle applicazioni Node.js.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Errori | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Questa sezione della documentazione di Node.js fornisce dettagli completi sulla gestione degli errori, inclusi le classi di errore, i codici di errore e come gestire gli errori nelle applicazioni Node.js.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Errori | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Questa sezione della documentazione di Node.js fornisce dettagli completi sulla gestione degli errori, inclusi le classi di errore, i codici di errore e come gestire gli errori nelle applicazioni Node.js.
---


# Errori {#errors}

Le applicazioni in esecuzione su Node.js generalmente riscontrano quattro categorie di errori:

- Errori JavaScript standard come [\<EvalError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError), [\<SyntaxError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError), [\<RangeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError), [\<ReferenceError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError), [\<TypeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) e [\<URIError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError).
- Errori di sistema attivati da vincoli del sistema operativo sottostante, come il tentativo di aprire un file che non esiste o il tentativo di inviare dati su un socket chiuso.
- Errori specificati dall'utente attivati dal codice dell'applicazione.
- Gli `AssertionError` sono una classe speciale di errore che può essere attivata quando Node.js rileva una violazione della logica eccezionale che non dovrebbe mai verificarsi. Questi vengono sollevati in genere dal modulo `node:assert`.

Tutti gli errori JavaScript e di sistema sollevati da Node.js ereditano da, o sono istanze di, la classe JavaScript standard [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) e hanno la garanzia di fornire *almeno* le proprietà disponibili su quella classe.

## Propagazione e intercettazione degli errori {#error-propagation-and-interception}

Node.js supporta diversi meccanismi per la propagazione e la gestione degli errori che si verificano durante l'esecuzione di un'applicazione. Il modo in cui questi errori vengono segnalati e gestiti dipende interamente dal tipo di `Error` e dallo stile dell'API che viene chiamata.

Tutti gli errori JavaScript vengono gestiti come eccezioni che *immediatamente* generano e lanciano un errore utilizzando il meccanismo standard `throw` di JavaScript. Questi vengono gestiti utilizzando il costrutto [`try…catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) fornito dal linguaggio JavaScript.

```js [ESM]
// Lancia un ReferenceError perché z non è definito.
try {
  const m = 1;
  const n = m + z;
} catch (err) {
  // Gestisci l'errore qui.
}
```
Qualsiasi utilizzo del meccanismo `throw` di JavaScript solleverà un'eccezione che *deve* essere gestita, altrimenti il processo Node.js si chiuderà immediatamente.

Con poche eccezioni, le API *sincrone* (qualsiasi metodo di blocco che non restituisce un [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) né accetta una funzione `callback`, come [`fs.readFileSync`](/it/nodejs/api/fs#fsreadfilesyncpath-options)), useranno `throw` per segnalare gli errori.

Gli errori che si verificano all'interno delle *API asincrone* possono essere segnalati in diversi modi:

- Alcuni metodi asincroni restituiscono un [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), dovresti sempre tenere conto del fatto che potrebbe essere rifiutato. Vedi il flag [`--unhandled-rejections`](/it/nodejs/api/cli#--unhandled-rejectionsmode) per come il processo reagirà a un rifiuto di promise non gestito.
- La maggior parte dei metodi asincroni che accettano una funzione `callback` accetteranno un oggetto `Error` passato come primo argomento a quella funzione. Se quel primo argomento non è `null` ed è un'istanza di `Error`, allora si è verificato un errore che dovrebbe essere gestito.
- Quando un metodo asincrono viene chiamato su un oggetto che è un [`EventEmitter`](/it/nodejs/api/events#class-eventemitter), gli errori possono essere indirizzati all'evento `'error'` di quell'oggetto.
- Una manciata di metodi tipicamente asincroni nell'API Node.js possono ancora usare il meccanismo `throw` per sollevare eccezioni che devono essere gestite usando `try…catch`. Non esiste un elenco completo di tali metodi; fare riferimento alla documentazione di ciascun metodo per determinare il meccanismo di gestione degli errori appropriato richiesto.

L'uso del meccanismo dell'evento `'error'` è più comune per le API [basate su stream](/it/nodejs/api/stream) e [basate su emettitori di eventi](/it/nodejs/api/events#class-eventemitter), che a loro volta rappresentano una serie di operazioni asincrone nel tempo (invece di una singola operazione che può avere successo o fallire).

Per *tutti* gli oggetti [`EventEmitter`](/it/nodejs/api/events#class-eventemitter), se non viene fornito un gestore di eventi `'error'`, l'errore verrà lanciato, facendo sì che il processo Node.js segnali un'eccezione non catturata e si blocchi a meno che: non sia stato registrato un gestore per l'evento [`'uncaughtException'`](/it/nodejs/api/process#event-uncaughtexception), oppure venga utilizzato il modulo deprecato [`node:domain`](/it/nodejs/api/domain).

```js [ESM]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

setImmediate(() => {
  // Questo bloccherà il processo perché non è stato aggiunto alcun gestore
  // di eventi 'error'.
  ee.emit('error', new Error('This will crash'));
});
```
Gli errori generati in questo modo *non possono* essere intercettati usando `try…catch` poiché vengono lanciati *dopo* che il codice chiamante è già uscito.

Gli sviluppatori devono fare riferimento alla documentazione per ogni metodo per determinare esattamente come vengono propagati gli errori sollevati da tali metodi.


## Classe: `Error` {#class-error}

Un oggetto JavaScript generico [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) che non denota alcuna circostanza specifica del motivo per cui si è verificato l'errore. Gli oggetti `Error` catturano una "stack trace" che descrive in dettaglio il punto del codice in cui è stato istanziato `Error` e possono fornire una descrizione testuale dell'errore.

Tutti gli errori generati da Node.js, inclusi tutti gli errori di sistema e JavaScript, saranno istanze di o erediteranno dalla classe `Error`.

### `new Error(message[, options])` {#new-errormessage-options}

- `message` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cause` [\<qualsiasi\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) L'errore che ha causato l'errore appena creato.

Crea un nuovo oggetto `Error` e imposta la proprietà `error.message` sul messaggio di testo fornito. Se un oggetto viene passato come `message`, il messaggio di testo viene generato chiamando `String(message)`. Se viene fornita l'opzione `cause`, viene assegnata alla proprietà `error.cause`. La proprietà `error.stack` rappresenterà il punto nel codice in cui è stato chiamato `new Error()`. Le stack trace dipendono dalla [stack trace API di V8](https://v8.dev/docs/stack-trace-api). Le stack trace si estendono solo fino a (a) l'inizio dell'*esecuzione del codice sincrono* oppure (b) il numero di frame fornito dalla proprietà `Error.stackTraceLimit`, a seconda di quale sia minore.

### `Error.captureStackTrace(targetObject[, constructorOpt])` {#errorcapturestacktracetargetobject-constructoropt}

- `targetObject` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `constructorOpt` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Crea una proprietà `.stack` su `targetObject`, che quando viene acceduta restituisce una stringa che rappresenta la posizione nel codice in cui è stato chiamato `Error.captureStackTrace()`.

```js [ESM]
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Simile a `new Error().stack`
```
La prima riga della traccia sarà preceduta da `${myObject.name}: ${myObject.message}`.

L'argomento opzionale `constructorOpt` accetta una funzione. Se fornito, tutti i frame sopra `constructorOpt`, incluso `constructorOpt`, verranno omessi dalla stack trace generata.

L'argomento `constructorOpt` è utile per nascondere i dettagli di implementazione della generazione degli errori all'utente. Per esempio:

```js [ESM]
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Crea un errore senza stack trace per evitare di calcolare la stack trace due volte.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Cattura la stack trace sopra la funzione b
  Error.captureStackTrace(error, b); // Né la funzione c, né b sono incluse nella stack trace
  throw error;
}

a();
```

### `Error.stackTraceLimit` {#errorstacktracelimit}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La proprietà `Error.stackTraceLimit` specifica il numero di frame dello stack raccolti da una traccia dello stack (sia che sia generata da `new Error().stack` o `Error.captureStackTrace(obj)`).

Il valore predefinito è `10`, ma può essere impostato su qualsiasi numero JavaScript valido. Le modifiche influenzeranno qualsiasi traccia dello stack acquisita *dopo* che il valore è stato modificato.

Se impostato su un valore non numerico o su un numero negativo, le tracce dello stack non acquisiranno alcun frame.

### `error.cause` {#errorcause}

**Aggiunto in: v16.9.0**

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Se presente, la proprietà `error.cause` è la causa sottostante dell'`Error`. Viene utilizzata quando si intercetta un errore e se ne lancia uno nuovo con un messaggio o un codice diverso al fine di avere ancora accesso all'errore originale.

La proprietà `error.cause` è in genere impostata chiamando `new Error(message, { cause })`. Non viene impostata dal costruttore se l'opzione `cause` non viene fornita.

Questa proprietà consente di concatenare gli errori. Quando si serializzano oggetti `Error`, [`util.inspect()`](/it/nodejs/api/util#utilinspectobject-options) serializza ricorsivamente `error.cause` se è impostato.

```js [ESM]
const cause = new Error('The remote HTTP server responded with a 500 status');
const symptom = new Error('The message failed to send', { cause });

console.log(symptom);
// Prints:
//   Error: The message failed to send
//       at REPL2:1:17
//       at Script.runInThisContext (node:vm:130:12)
//       ... 7 lines matching cause stack trace ...
//       at [_line] [as _line] (node:internal/readline/interface:886:18) {
//     [cause]: Error: The remote HTTP server responded with a 500 status
//         at REPL1:1:15
//         at Script.runInThisContext (node:vm:130:12)
//         at REPLServer.defaultEval (node:repl:574:29)
//         at bound (node:domain:426:15)
//         at REPLServer.runBound [as eval] (node:domain:437:12)
//         at REPLServer.onLine (node:repl:902:10)
//         at REPLServer.emit (node:events:549:35)
//         at REPLServer.emit (node:domain:482:12)
//         at [_onLine] [as _onLine] (node:internal/readline/interface:425:12)
//         at [_line] [as _line] (node:internal/readline/interface:886:18)
```

### `error.code` {#errorcode}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà `error.code` è un'etichetta stringa che identifica il tipo di errore. `error.code` è il modo più stabile per identificare un errore. Cambierà solo tra le versioni principali di Node.js. Al contrario, le stringhe `error.message` possono cambiare tra qualsiasi versione di Node.js. Vedi [Codici di errore di Node.js](/it/nodejs/api/errors#nodejs-error-codes) per i dettagli sui codici specifici.

### `error.message` {#errormessage}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà `error.message` è la descrizione stringa dell'errore come impostato chiamando `new Error(message)`. Il `message` passato al costruttore apparirà anche nella prima riga dello stack trace dell'`Error`, tuttavia cambiare questa proprietà dopo che l'oggetto `Error` è stato creato *potrebbe non* cambiare la prima riga dello stack trace (ad esempio, quando `error.stack` viene letto prima che questa proprietà venga cambiata).

```js [ESM]
const err = new Error('Il messaggio');
console.error(err.message);
// Stampa: Il messaggio
```
### `error.stack` {#errorstack}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà `error.stack` è una stringa che descrive il punto del codice in cui è stato istanziato l'`Error`.

```bash [BASH]
Error: Le cose continuano ad accadere!
   at /home/gbusey/file.js:525:2
   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
   at increaseSynergy (/home/gbusey/actors.js:701:6)
```
La prima riga è formattata come `\<nome della classe di errore\>: \<messaggio di errore\>`, ed è seguita da una serie di frame dello stack (ogni riga inizia con "at "). Ogni frame descrive un punto di chiamata all'interno del codice che ha portato alla generazione dell'errore. V8 tenta di visualizzare un nome per ogni funzione (per nome di variabile, nome di funzione o nome di metodo di oggetto), ma occasionalmente non sarà in grado di trovare un nome adatto. Se V8 non riesce a determinare un nome per la funzione, verranno visualizzate solo le informazioni sulla posizione per quel frame. Altrimenti, il nome della funzione determinato verrà visualizzato con le informazioni sulla posizione aggiunte tra parentesi.

I frame vengono generati solo per le funzioni JavaScript. Se, ad esempio, l'esecuzione passa in modo sincrono attraverso una funzione addon C++ chiamata `cheetahify` che a sua volta chiama una funzione JavaScript, il frame che rappresenta la chiamata `cheetahify` non sarà presente negli stack trace:

```js [ESM]
const cheetahify = require('./native-binding.node');

function makeFaster() {
  // `cheetahify()` chiama *sincronamente* speedy.
  cheetahify(function speedy() {
    throw new Error('oh no!');
  });
}

makeFaster();
// lancerà:
//   /home/gbusey/file.js:6
//       throw new Error('oh no!');
//           ^
//   Error: oh no!
//       at speedy (/home/gbusey/file.js:6:11)
//       at makeFaster (/home/gbusey/file.js:5:3)
//       at Object.<anonymous> (/home/gbusey/file.js:10:1)
//       at Module._compile (module.js:456:26)
//       at Object.Module._extensions..js (module.js:474:10)
//       at Module.load (module.js:356:32)
//       at Function.Module._load (module.js:312:12)
//       at Function.Module.runMain (module.js:497:10)
//       at startup (node.js:119:16)
//       at node.js:906:3
```
Le informazioni sulla posizione saranno una delle seguenti:

- `native`, se il frame rappresenta una chiamata interna a V8 (come in `[].forEach`).
- `nomefile-semplice.js:riga:colonna`, se il frame rappresenta una chiamata interna a Node.js.
- `/percorso/assoluto/al/file.js:riga:colonna`, se il frame rappresenta una chiamata in un programma utente (utilizzando il sistema di moduli CommonJS) o nelle sue dipendenze.
- `\<protocollo-di-trasporto\>:///url/al/modulo/file.mjs:riga:colonna`, se il frame rappresenta una chiamata in un programma utente (utilizzando il sistema di moduli ES) o nelle sue dipendenze.

La stringa che rappresenta lo stack trace viene generata pigramente quando si **accede** alla proprietà `error.stack`.

Il numero di frame acquisiti dallo stack trace è limitato al minore tra `Error.stackTraceLimit` o il numero di frame disponibili sull'attuale tick del ciclo di eventi.


## Classe: `AssertionError` {#class-assertionerror}

- Estende: [\<errors.Error\>](/it/nodejs/api/errors#class-error)

Indica il fallimento di un'asserzione. Per i dettagli, vedi [`Classe: assert.AssertionError`](/it/nodejs/api/assert#class-assertassertionerror).

## Classe: `RangeError` {#class-rangeerror}

- Estende: [\<errors.Error\>](/it/nodejs/api/errors#class-error)

Indica che un argomento fornito non rientrava nell'insieme o nell'intervallo di valori accettabili per una funzione; sia che si tratti di un intervallo numerico, sia che sia al di fuori dell'insieme di opzioni per un determinato parametro di funzione.

```js [ESM]
require('node:net').connect(-1);
// Lancia "RangeError: "port" option should be >= 0 and < 65536: -1"
```
Node.js genererà e lancerà istanze di `RangeError` *immediatamente* come forma di convalida degli argomenti.

## Classe: `ReferenceError` {#class-referenceerror}

- Estende: [\<errors.Error\>](/it/nodejs/api/errors#class-error)

Indica che si sta tentando di accedere a una variabile che non è definita. Tali errori indicano comunemente errori di battitura nel codice o un programma altrimenti corrotto.

Sebbene il codice client possa generare e propagare questi errori, in pratica, solo V8 lo farà.

```js [ESM]
doesNotExist;
// Lancia ReferenceError, doesNotExist non è una variabile in questo programma.
```
A meno che un'applicazione non stia generando ed eseguendo dinamicamente codice, le istanze di `ReferenceError` indicano un bug nel codice o nelle sue dipendenze.

## Classe: `SyntaxError` {#class-syntaxerror}

- Estende: [\<errors.Error\>](/it/nodejs/api/errors#class-error)

Indica che un programma non è JavaScript valido. Questi errori possono essere generati e propagati solo a seguito della valutazione del codice. La valutazione del codice può avvenire a seguito di `eval`, `Function`, `require` o [vm](/it/nodejs/api/vm). Questi errori sono quasi sempre indicativi di un programma corrotto.

```js [ESM]
try {
  require('node:vm').runInThisContext('binary ! isNotOk');
} catch (err) {
  // 'err' sarà un SyntaxError.
}
```
Le istanze di `SyntaxError` sono irrecuperabili nel contesto che le ha create: possono essere intercettate solo da altri contesti.

## Classe: `SystemError` {#class-systemerror}

- Estende: [\<errors.Error\>](/it/nodejs/api/errors#class-error)

Node.js genera errori di sistema quando si verificano eccezioni all'interno del suo ambiente di runtime. Questi si verificano di solito quando un'applicazione viola un vincolo del sistema operativo. Ad esempio, si verificherà un errore di sistema se un'applicazione tenta di leggere un file che non esiste.

- `address` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se presente, l'indirizzo a cui una connessione di rete non è riuscita
- `code` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il codice di errore stringa
- `dest` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se presente, il percorso del file di destinazione quando si segnala un errore del file system
- `errno` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di errore fornito dal sistema
- `info` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se presente, dettagli extra sulla condizione di errore
- `message` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una descrizione leggibile dall'uomo fornita dal sistema dell'errore
- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se presente, il percorso del file quando si segnala un errore del file system
- `port` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se presente, la porta di connessione di rete che non è disponibile
- `syscall` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome della chiamata di sistema che ha attivato l'errore


### `error.address` {#erroraddress}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Se presente, `error.address` è una stringa che descrive l'indirizzo a cui una connessione di rete non è riuscita.

### `error.code` {#errorcode_1}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà `error.code` è una stringa che rappresenta il codice di errore.

### `error.dest` {#errordest}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Se presente, `error.dest` è il percorso del file di destinazione quando si segnala un errore del file system.

### `error.errno` {#errorerrno}

- [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La proprietà `error.errno` è un numero negativo che corrisponde al codice di errore definito in [`Gestione degli errori di libuv`](https://docs.libuv.org/en/v1.x/errors).

Su Windows, il numero di errore fornito dal sistema verrà normalizzato da libuv.

Per ottenere la rappresentazione in stringa del codice di errore, usa [`util.getSystemErrorName(error.errno)`](/it/nodejs/api/util#utilgetsystemerrornameerr).

### `error.info` {#errorinfo}

- [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se presente, `error.info` è un oggetto con dettagli sulla condizione di errore.

### `error.message` {#errormessage_1}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.message` è una descrizione leggibile dall'uomo fornita dal sistema dell'errore.

### `error.path` {#errorpath}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Se presente, `error.path` è una stringa contenente un percorso non valido pertinente.

### `error.port` {#errorport}

- [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Se presente, `error.port` è la porta di connessione di rete che non è disponibile.

### `error.syscall` {#errorsyscall}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà `error.syscall` è una stringa che descrive la [syscall](https://man7.org/linux/man-pages/man2/syscalls.2) che non è riuscita.


### Errori di sistema comuni {#common-system-errors}

Questo è un elenco di errori di sistema che si incontrano comunemente quando si scrive un programma Node.js. Per un elenco completo, consultare la [`pagina man errno(3)`](https://man7.org/linux/man-pages/man3/errno.3).

-  `EACCES` (Permesso negato): È stato fatto un tentativo di accedere a un file in un modo proibito dalle sue autorizzazioni di accesso al file.
-  `EADDRINUSE` (Indirizzo già in uso): Un tentativo di associare un server ([`net`](/it/nodejs/api/net), [`http`](/it/nodejs/api/http) o [`https`](/it/nodejs/api/https)) a un indirizzo locale non è riuscito a causa di un altro server sul sistema locale che già occupa tale indirizzo.
-  `ECONNREFUSED` (Connessione rifiutata): Non è stato possibile stabilire una connessione perché la macchina di destinazione l'ha rifiutata attivamente. Ciò di solito deriva dal tentativo di connettersi a un servizio inattivo sull'host straniero.
-  `ECONNRESET` (Connessione ripristinata dal peer): Una connessione è stata chiusa forzatamente da un peer. Ciò normalmente deriva da una perdita di connessione sul socket remoto a causa di un timeout o di un riavvio. Comunemente incontrato tramite i moduli [`http`](/it/nodejs/api/http) e [`net`](/it/nodejs/api/net).
-  `EEXIST` (File esistente): Un file esistente era l'obiettivo di un'operazione che richiedeva che l'obiettivo non esistesse.
-  `EISDIR` (È una directory): Un'operazione si aspettava un file, ma il percorso specificato era una directory.
-  `EMFILE` (Troppi file aperti nel sistema): È stato raggiunto il numero massimo di [descrittori di file](https://en.wikipedia.org/wiki/File_descriptor) consentiti sul sistema e le richieste per un altro descrittore non possono essere soddisfatte fino a quando almeno uno non è stato chiuso. Ciò si verifica quando si aprono molti file contemporaneamente in parallelo, in particolare sui sistemi (in particolare macOS) in cui esiste un limite basso di descrittori di file per i processi. Per rimediare a un limite basso, eseguire `ulimit -n 2048` nella stessa shell che eseguirà il processo Node.js.
-  `ENOENT` (Nessun file o directory): Comunemente sollevato dalle operazioni [`fs`](/it/nodejs/api/fs) per indicare che un componente del percorso specificato non esiste. Nessuna entità (file o directory) è stata trovata dal percorso specificato.
-  `ENOTDIR` (Non è una directory): Un componente del percorso specificato esisteva, ma non era una directory come previsto. Comunemente sollevato da [`fs.readdir`](/it/nodejs/api/fs#fsreaddirpath-options-callback).
-  `ENOTEMPTY` (Directory non vuota): Una directory con voci era l'obiettivo di un'operazione che richiede una directory vuota, di solito [`fs.unlink`](/it/nodejs/api/fs#fsunlinkpath-callback).
-  `ENOTFOUND` (Ricerca DNS non riuscita): Indica un errore DNS di `EAI_NODATA` o `EAI_NONAME`. Questo non è un errore POSIX standard.
-  `EPERM` (Operazione non consentita): È stato fatto un tentativo di eseguire un'operazione che richiede privilegi elevati.
-  `EPIPE` (Pipe interrotta): Una scrittura su una pipe, socket o FIFO per cui non esiste un processo per leggere i dati. Comunemente incontrato nei livelli [`net`](/it/nodejs/api/net) e [`http`](/it/nodejs/api/http), indicativo del fatto che il lato remoto del flusso su cui si sta scrivendo è stato chiuso.
-  `ETIMEDOUT` (Operazione scaduta): Una richiesta di connessione o di invio non è riuscita perché la parte connessa non ha risposto correttamente dopo un certo periodo di tempo. Solitamente incontrato da [`http`](/it/nodejs/api/http) o [`net`](/it/nodejs/api/net). Spesso un segno che `socket.end()` non è stato chiamato correttamente.


## Classe: `TypeError` {#class-typeerror}

- Estende [\<errors.Error\>](/it/nodejs/api/errors#class-error)

Indica che un argomento fornito non è di un tipo consentito. Ad esempio, passare una funzione a un parametro che si aspetta una stringa risulterebbe in un `TypeError`.

```js [ESM]
require('node:url').parse(() => { });
// Lancia TypeError, dato che si aspettava una stringa.
```
Node.js genererà e lancerà istanze di `TypeError` *immediatamente* come forma di validazione degli argomenti.

## Eccezioni vs. errori {#exceptions-vs-errors}

Un'eccezione JavaScript è un valore che viene lanciato come risultato di un'operazione non valida o come obiettivo di un'istruzione `throw`. Sebbene non sia richiesto che questi valori siano istanze di `Error` o classi che ereditano da `Error`, tutte le eccezioni lanciate da Node.js o dal runtime JavaScript *saranno* istanze di `Error`.

Alcune eccezioni sono *irrecuperabili* a livello JavaScript. Tali eccezioni causeranno *sempre* l'arresto anomalo del processo Node.js. Esempi includono i controlli `assert()` o le chiamate `abort()` nel livello C++.

## Errori OpenSSL {#openssl-errors}

Gli errori che hanno origine in `crypto` o `tls` sono di classe `Error` e, oltre alle proprietà standard `.code` e `.message`, possono avere alcune proprietà aggiuntive specifiche di OpenSSL.

### `error.opensslErrorStack` {#erroropensslerrorstack}

Un array di errori che possono fornire un contesto sull'origine di un errore all'interno della libreria OpenSSL.

### `error.function` {#errorfunction}

La funzione OpenSSL in cui ha origine l'errore.

### `error.library` {#errorlibrary}

La libreria OpenSSL in cui ha origine l'errore.

### `error.reason` {#errorreason}

Una stringa leggibile che descrive il motivo dell'errore.

## Codici di errore Node.js {#nodejs-error-codes}

### `ABORT_ERR` {#abort_err}

**Aggiunto in: v15.0.0**

Usato quando un'operazione è stata interrotta (in genere usando un `AbortController`).

Le API che *non* utilizzano `AbortSignal` in genere non sollevano un errore con questo codice.

Questo codice non utilizza la convenzione regolare `ERR_*` che gli errori di Node.js usano per essere compatibile con `AbortError` della piattaforma web.

### `ERR_ACCESS_DENIED` {#err_access_denied}

Un tipo speciale di errore che viene attivato ogni volta che Node.js tenta di ottenere l'accesso a una risorsa limitata dal [Modello di autorizzazioni](/it/nodejs/api/permissions#permission-model).


### `ERR_AMBIGUOUS_ARGUMENT` {#err_ambiguous_argument}

Un argomento di una funzione viene utilizzato in un modo che suggerisce che la firma della funzione potrebbe essere fraintesa. Viene generato dal modulo `node:assert` quando il parametro `message` in `assert.throws(block, message)` corrisponde al messaggio di errore generato da `block` perché tale utilizzo suggerisce che l'utente crede che `message` sia il messaggio previsto piuttosto che il messaggio che `AssertionError` visualizzerà se `block` non genera.

### `ERR_ARG_NOT_ITERABLE` {#err_arg_not_iterable}

È stato richiesto un argomento iterabile (ovvero un valore che funziona con i loop `for...of`), ma non è stato fornito a un'API di Node.js.

### `ERR_ASSERTION` {#err_assertion}

Un tipo speciale di errore che può essere attivato ogni volta che Node.js rileva una violazione della logica eccezionale che non dovrebbe mai verificarsi. Questi vengono sollevati tipicamente dal modulo `node:assert`.

### `ERR_ASYNC_CALLBACK` {#err_async_callback}

È stato fatto un tentativo di registrare qualcosa che non è una funzione come callback `AsyncHooks`.

### `ERR_ASYNC_TYPE` {#err_async_type}

Il tipo di una risorsa asincrona non era valido. Gli utenti sono anche in grado di definire i propri tipi se utilizzano l'API embedder pubblica.

### `ERR_BROTLI_COMPRESSION_FAILED` {#err_brotli_compression_failed}

I dati passati a uno stream Brotli non sono stati compressi correttamente.

### `ERR_BROTLI_INVALID_PARAM` {#err_brotli_invalid_param}

È stata passata una chiave di parametro non valida durante la costruzione di uno stream Brotli.

### `ERR_BUFFER_CONTEXT_NOT_AVAILABLE` {#err_buffer_context_not_available}

È stato fatto un tentativo di creare un'istanza di `Buffer` di Node.js da un addon o codice embedder, mentre in un contesto del motore JS che non è associato a un'istanza di Node.js. I dati passati al metodo `Buffer` saranno stati rilasciati al momento della restituzione del metodo.

Quando si verifica questo errore, una possibile alternativa alla creazione di un'istanza `Buffer` è creare un normale `Uint8Array`, che differisce solo nel prototipo dell'oggetto risultante. Gli `Uint8Array` sono generalmente accettati in tutte le API principali di Node.js dove sono presenti i `Buffer`; sono disponibili in tutti i contesti.

### `ERR_BUFFER_OUT_OF_BOUNDS` {#err_buffer_out_of_bounds}

È stato tentato un'operazione al di fuori dei limiti di un `Buffer`.

### `ERR_BUFFER_TOO_LARGE` {#err_buffer_too_large}

È stato fatto un tentativo di creare un `Buffer` più grande della dimensione massima consentita.


### `ERR_CANNOT_WATCH_SIGINT` {#err_cannot_watch_sigint}

Node.js non è stato in grado di monitorare il segnale `SIGINT`.

### `ERR_CHILD_CLOSED_BEFORE_REPLY` {#err_child_closed_before_reply}

Un processo figlio è stato chiuso prima che il processo padre ricevesse una risposta.

### `ERR_CHILD_PROCESS_IPC_REQUIRED` {#err_child_process_ipc_required}

Utilizzato quando un processo figlio viene creato senza specificare un canale IPC.

### `ERR_CHILD_PROCESS_STDIO_MAXBUFFER` {#err_child_process_stdio_maxbuffer}

Utilizzato quando il processo principale sta cercando di leggere dati da STDERR/STDOUT del processo figlio e la lunghezza dei dati è maggiore dell'opzione `maxBuffer`.

### `ERR_CLOSED_MESSAGE_PORT` {#err_closed_message_port}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.2.0, v14.17.1 | Il messaggio di errore è stato reintrodotto. |
| v11.12.0 | Il messaggio di errore è stato rimosso. |
| v10.5.0 | Aggiunto in: v10.5.0 |
:::

C'è stato un tentativo di utilizzare un'istanza `MessagePort` in uno stato chiuso, di solito dopo che è stato chiamato `.close()`.

### `ERR_CONSOLE_WRITABLE_STREAM` {#err_console_writable_stream}

`Console` è stato istanziato senza flusso `stdout`, oppure `Console` ha un flusso `stdout` o `stderr` non scrivibile.

### `ERR_CONSTRUCT_CALL_INVALID` {#err_construct_call_invalid}

**Aggiunto in: v12.5.0**

È stato chiamato un costruttore di classe che non è invocabile.

### `ERR_CONSTRUCT_CALL_REQUIRED` {#err_construct_call_required}

Un costruttore per una classe è stato chiamato senza `new`.

### `ERR_CONTEXT_NOT_INITIALIZED` {#err_context_not_initialized}

Il contesto vm passato all'API non è ancora inizializzato. Ciò può accadere quando si verifica (e viene intercettato) un errore durante la creazione del contesto, ad esempio, quando l'allocazione fallisce o viene raggiunta la dimensione massima dello stack di chiamate quando viene creato il contesto.

### `ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED` {#err_crypto_custom_engine_not_supported}

È stato richiesto un motore OpenSSL (ad esempio, tramite le opzioni TLS `clientCertEngine` o `privateKeyEngine`) che non è supportato dalla versione di OpenSSL in uso, probabilmente a causa del flag in fase di compilazione `OPENSSL_NO_ENGINE`.

### `ERR_CRYPTO_ECDH_INVALID_FORMAT` {#err_crypto_ecdh_invalid_format}

È stato passato un valore non valido per l'argomento `format` al metodo `getPublicKey()` della classe `crypto.ECDH()`.

### `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` {#err_crypto_ecdh_invalid_public_key}

È stato passato un valore non valido per l'argomento `key` al metodo `computeSecret()` della classe `crypto.ECDH()`. Significa che la chiave pubblica si trova al di fuori della curva ellittica.


### `ERR_CRYPTO_ENGINE_UNKNOWN` {#err_crypto_engine_unknown}

Un identificatore del motore di crittografia non valido è stato passato a [`require('node:crypto').setEngine()`](/it/nodejs/api/crypto#cryptosetengineengine-flags).

### `ERR_CRYPTO_FIPS_FORCED` {#err_crypto_fips_forced}

L'argomento della riga di comando [`--force-fips`](/it/nodejs/api/cli#--force-fips) è stato utilizzato ma c'è stato un tentativo di abilitare o disabilitare la modalità FIPS nel modulo `node:crypto`.

### `ERR_CRYPTO_FIPS_UNAVAILABLE` {#err_crypto_fips_unavailable}

È stato fatto un tentativo di abilitare o disabilitare la modalità FIPS, ma la modalità FIPS non era disponibile.

### `ERR_CRYPTO_HASH_FINALIZED` {#err_crypto_hash_finalized}

[`hash.digest()`](/it/nodejs/api/crypto#hashdigestencoding) è stato chiamato più volte. Il metodo `hash.digest()` deve essere chiamato non più di una volta per istanza di un oggetto `Hash`.

### `ERR_CRYPTO_HASH_UPDATE_FAILED` {#err_crypto_hash_update_failed}

[`hash.update()`](/it/nodejs/api/crypto#hashupdatedata-inputencoding) non è riuscito per qualsiasi motivo. Questo dovrebbe accadere raramente, se non mai.

### `ERR_CRYPTO_INCOMPATIBLE_KEY` {#err_crypto_incompatible_key}

Le chiavi crittografiche fornite sono incompatibili con l'operazione tentata.

### `ERR_CRYPTO_INCOMPATIBLE_KEY_OPTIONS` {#err_crypto_incompatible_key_options}

La codifica della chiave pubblica o privata selezionata è incompatibile con altre opzioni.

### `ERR_CRYPTO_INITIALIZATION_FAILED` {#err_crypto_initialization_failed}

**Aggiunto in: v15.0.0**

L'inizializzazione del sottosistema di crittografia non è riuscita.

### `ERR_CRYPTO_INVALID_AUTH_TAG` {#err_crypto_invalid_auth_tag}

**Aggiunto in: v15.0.0**

È stato fornito un tag di autenticazione non valido.

### `ERR_CRYPTO_INVALID_COUNTER` {#err_crypto_invalid_counter}

**Aggiunto in: v15.0.0**

È stato fornito un contatore non valido per una cifra in modalità contatore.

### `ERR_CRYPTO_INVALID_CURVE` {#err_crypto_invalid_curve}

**Aggiunto in: v15.0.0**

È stata fornita una curva ellittica non valida.

### `ERR_CRYPTO_INVALID_DIGEST` {#err_crypto_invalid_digest}

È stato specificato un [algoritmo di digest crittografico](/it/nodejs/api/crypto#cryptogethashes) non valido.

### `ERR_CRYPTO_INVALID_IV` {#err_crypto_invalid_iv}

**Aggiunto in: v15.0.0**

È stato fornito un vettore di inizializzazione non valido.

### `ERR_CRYPTO_INVALID_JWK` {#err_crypto_invalid_jwk}

**Aggiunto in: v15.0.0**

È stata fornita una JSON Web Key non valida.

### `ERR_CRYPTO_INVALID_KEYLEN` {#err_crypto_invalid_keylen}

**Aggiunto in: v15.0.0**

È stata fornita una lunghezza della chiave non valida.

### `ERR_CRYPTO_INVALID_KEYPAIR` {#err_crypto_invalid_keypair}

**Aggiunto in: v15.0.0**

È stata fornita una coppia di chiavi non valida.

### `ERR_CRYPTO_INVALID_KEYTYPE` {#err_crypto_invalid_keytype}

**Aggiunto in: v15.0.0**

È stato fornito un tipo di chiave non valido.


### `ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE` {#err_crypto_invalid_key_object_type}

Il tipo dell'oggetto chiave crittografica fornito non è valido per l'operazione tentata.

### `ERR_CRYPTO_INVALID_MESSAGELEN` {#err_crypto_invalid_messagelen}

**Aggiunto in: v15.0.0**

È stata fornita una lunghezza del messaggio non valida.

### `ERR_CRYPTO_INVALID_SCRYPT_PARAMS` {#err_crypto_invalid_scrypt_params}

**Aggiunto in: v15.0.0**

Uno o più parametri di [`crypto.scrypt()`](/it/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) o [`crypto.scryptSync()`](/it/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options) sono al di fuori del loro intervallo legale.

### `ERR_CRYPTO_INVALID_STATE` {#err_crypto_invalid_state}

Un metodo crittografico è stato utilizzato su un oggetto che si trovava in uno stato non valido. Ad esempio, chiamare [`cipher.getAuthTag()`](/it/nodejs/api/crypto#ciphergetauthtag) prima di chiamare `cipher.final()`.

### `ERR_CRYPTO_INVALID_TAG_LENGTH` {#err_crypto_invalid_tag_length}

**Aggiunto in: v15.0.0**

È stata fornita una lunghezza del tag di autenticazione non valida.

### `ERR_CRYPTO_JOB_INIT_FAILED` {#err_crypto_job_init_failed}

**Aggiunto in: v15.0.0**

L'inizializzazione di un'operazione crittografica asincrona non è riuscita.

### `ERR_CRYPTO_JWK_UNSUPPORTED_CURVE` {#err_crypto_jwk_unsupported_curve}

La curva ellittica della chiave non è registrata per l'uso nel [JSON Web Key Elliptic Curve Registry](https://www.iana.org/assignments/jose/jose.xhtml#web-key-elliptic-curve).

### `ERR_CRYPTO_JWK_UNSUPPORTED_KEY_TYPE` {#err_crypto_jwk_unsupported_key_type}

Il tipo di chiave asimmetrica della chiave non è registrato per l'uso nel [JSON Web Key Types Registry](https://www.iana.org/assignments/jose/jose.xhtml#web-key-types).

### `ERR_CRYPTO_OPERATION_FAILED` {#err_crypto_operation_failed}

**Aggiunto in: v15.0.0**

Un'operazione crittografica non è riuscita per un motivo altrimenti non specificato.

### `ERR_CRYPTO_PBKDF2_ERROR` {#err_crypto_pbkdf2_error}

L'algoritmo PBKDF2 non è riuscito per motivi non specificati. OpenSSL non fornisce maggiori dettagli e quindi nemmeno Node.js.

### `ERR_CRYPTO_SCRYPT_NOT_SUPPORTED` {#err_crypto_scrypt_not_supported}

Node.js è stato compilato senza il supporto `scrypt`. Non è possibile con i binari di rilascio ufficiali, ma può accadere con build personalizzate, incluse le build di distribuzione.

### `ERR_CRYPTO_SIGN_KEY_REQUIRED` {#err_crypto_sign_key_required}

Una `key` di firma non è stata fornita al metodo [`sign.sign()`](/it/nodejs/api/crypto#signsignprivatekey-outputencoding).

### `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` {#err_crypto_timing_safe_equal_length}

[`crypto.timingSafeEqual()`](/it/nodejs/api/crypto#cryptotimingsafeequala-b) è stato chiamato con argomenti `Buffer`, `TypedArray` o `DataView` di lunghezze diverse.


### `ERR_CRYPTO_UNKNOWN_CIPHER` {#err_crypto_unknown_cipher}

È stata specificata una cifratura sconosciuta.

### `ERR_CRYPTO_UNKNOWN_DH_GROUP` {#err_crypto_unknown_dh_group}

È stato fornito un nome di gruppo Diffie-Hellman sconosciuto. Vedere [`crypto.getDiffieHellman()`](/it/nodejs/api/crypto#cryptogetdiffiehellmangroupname) per un elenco di nomi di gruppo validi.

### `ERR_CRYPTO_UNSUPPORTED_OPERATION` {#err_crypto_unsupported_operation}

**Aggiunto in: v15.0.0, v14.18.0**

È stato effettuato un tentativo di invocare un'operazione crittografica non supportata.

### `ERR_DEBUGGER_ERROR` {#err_debugger_error}

**Aggiunto in: v16.4.0, v14.17.4**

Si è verificato un errore con il [debugger](/it/nodejs/api/debugger).

### `ERR_DEBUGGER_STARTUP_ERROR` {#err_debugger_startup_error}

**Aggiunto in: v16.4.0, v14.17.4**

Il [debugger](/it/nodejs/api/debugger) è andato in timeout in attesa che l'host/porta richiesto fosse libero.

### `ERR_DIR_CLOSED` {#err_dir_closed}

Il [`fs.Dir`](/it/nodejs/api/fs#class-fsdir) è stato precedentemente chiuso.

### `ERR_DIR_CONCURRENT_OPERATION` {#err_dir_concurrent_operation}

**Aggiunto in: v14.3.0**

È stato tentato una chiamata sincrona di lettura o chiusura su un [`fs.Dir`](/it/nodejs/api/fs#class-fsdir) che ha operazioni asincrone in corso.

### `ERR_DLOPEN_DISABLED` {#err_dlopen_disabled}

**Aggiunto in: v16.10.0, v14.19.0**

Il caricamento degli addon nativi è stato disabilitato utilizzando [`--no-addons`](/it/nodejs/api/cli#--no-addons).

### `ERR_DLOPEN_FAILED` {#err_dlopen_failed}

**Aggiunto in: v15.0.0**

Una chiamata a `process.dlopen()` è fallita.

### `ERR_DNS_SET_SERVERS_FAILED` {#err_dns_set_servers_failed}

`c-ares` non è riuscito a impostare il server DNS.

### `ERR_DOMAIN_CALLBACK_NOT_AVAILABLE` {#err_domain_callback_not_available}

Il modulo `node:domain` non era utilizzabile poiché non è stato in grado di stabilire gli hook di gestione degli errori richiesti, perché [`process.setUncaughtExceptionCaptureCallback()`](/it/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) era stato chiamato in un momento precedente.

### `ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE` {#err_domain_cannot_set_uncaught_exception_capture}

[`process.setUncaughtExceptionCaptureCallback()`](/it/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) non è stato possibile chiamarlo perché il modulo `node:domain` è stato caricato in un momento precedente.

La traccia dello stack è estesa per includere il momento in cui il modulo `node:domain` era stato caricato.

### `ERR_DUPLICATE_STARTUP_SNAPSHOT_MAIN_FUNCTION` {#err_duplicate_startup_snapshot_main_function}

[`v8.startupSnapshot.setDeserializeMainFunction()`](/it/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) non è stato possibile chiamarlo perché era già stato chiamato in precedenza.


### `ERR_ENCODING_INVALID_ENCODED_DATA` {#err_encoding_invalid_encoded_data}

I dati forniti all'API `TextDecoder()` non erano validi secondo la codifica fornita.

### `ERR_ENCODING_NOT_SUPPORTED` {#err_encoding_not_supported}

La codifica fornita all'API `TextDecoder()` non era una delle [Codifiche supportate da WHATWG](/it/nodejs/api/util#whatwg-supported-encodings).

### `ERR_EVAL_ESM_CANNOT_PRINT` {#err_eval_esm_cannot_print}

`--print` non può essere utilizzato con input ESM.

### `ERR_EVENT_RECURSION` {#err_event_recursion}

Generato quando si tenta di inviare ricorsivamente un evento su `EventTarget`.

### `ERR_EXECUTION_ENVIRONMENT_NOT_AVAILABLE` {#err_execution_environment_not_available}

Il contesto di esecuzione JS non è associato a un ambiente Node.js. Ciò può verificarsi quando Node.js viene utilizzato come libreria incorporata e alcuni hook per il motore JS non sono configurati correttamente.

### `ERR_FALSY_VALUE_REJECTION` {#err_falsy_value_rejection}

Una `Promise` che è stata callbackizzata tramite `util.callbackify()` è stata rifiutata con un valore falsy.

### `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` {#err_feature_unavailable_on_platform}

**Aggiunto in: v14.0.0**

Usato quando viene utilizzata una funzionalità non disponibile per la piattaforma corrente che esegue Node.js.

### `ERR_FS_CP_DIR_TO_NON_DIR` {#err_fs_cp_dir_to_non_dir}

**Aggiunto in: v16.7.0**

È stato fatto un tentativo di copiare una directory in un non-directory (file, collegamento simbolico, ecc.) usando [`fs.cp()`](/it/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_EEXIST` {#err_fs_cp_eexist}

**Aggiunto in: v16.7.0**

È stato fatto un tentativo di sovrascrivere un file che già esisteva con [`fs.cp()`](/it/nodejs/api/fs#fscpsrc-dest-options-callback), con `force` e `errorOnExist` impostati su `true`.

### `ERR_FS_CP_EINVAL` {#err_fs_cp_einval}

**Aggiunto in: v16.7.0**

Quando si utilizza [`fs.cp()`](/it/nodejs/api/fs#fscpsrc-dest-options-callback), `src` o `dest` puntavano a un percorso non valido.

### `ERR_FS_CP_FIFO_PIPE` {#err_fs_cp_fifo_pipe}

**Aggiunto in: v16.7.0**

È stato fatto un tentativo di copiare una pipe nominata con [`fs.cp()`](/it/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_NON_DIR_TO_DIR` {#err_fs_cp_non_dir_to_dir}

**Aggiunto in: v16.7.0**

È stato fatto un tentativo di copiare un non-directory (file, collegamento simbolico, ecc.) in una directory usando [`fs.cp()`](/it/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_SOCKET` {#err_fs_cp_socket}

**Aggiunto in: v16.7.0**

È stato fatto un tentativo di copiare in un socket con [`fs.cp()`](/it/nodejs/api/fs#fscpsrc-dest-options-callback).


### `ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY` {#err_fs_cp_symlink_to_subdirectory}

**Aggiunto in: v16.7.0**

Quando si utilizza [`fs.cp()`](/it/nodejs/api/fs#fscpsrc-dest-options-callback), un link simbolico in `dest` puntava a una sottodirectory di `src`.

### `ERR_FS_CP_UNKNOWN` {#err_fs_cp_unknown}

**Aggiunto in: v16.7.0**

È stato effettuato un tentativo di copiare in un tipo di file sconosciuto con [`fs.cp()`](/it/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_EISDIR` {#err_fs_eisdir}

Il percorso è una directory.

### `ERR_FS_FILE_TOO_LARGE` {#err_fs_file_too_large}

È stato effettuato un tentativo di leggere un file la cui dimensione è maggiore della dimensione massima consentita per un `Buffer`.

### `ERR_HTTP2_ALTSVC_INVALID_ORIGIN` {#err_http2_altsvc_invalid_origin}

I frame HTTP/2 ALTSVC richiedono un'origine valida.

### `ERR_HTTP2_ALTSVC_LENGTH` {#err_http2_altsvc_length}

I frame HTTP/2 ALTSVC sono limitati a un massimo di 16.382 byte di payload.

### `ERR_HTTP2_CONNECT_AUTHORITY` {#err_http2_connect_authority}

Per le richieste HTTP/2 che utilizzano il metodo `CONNECT`, è richiesto lo pseudo-header `:authority`.

### `ERR_HTTP2_CONNECT_PATH` {#err_http2_connect_path}

Per le richieste HTTP/2 che utilizzano il metodo `CONNECT`, lo pseudo-header `:path` è proibito.

### `ERR_HTTP2_CONNECT_SCHEME` {#err_http2_connect_scheme}

Per le richieste HTTP/2 che utilizzano il metodo `CONNECT`, lo pseudo-header `:scheme` è proibito.

### `ERR_HTTP2_ERROR` {#err_http2_error}

Si è verificato un errore HTTP/2 non specifico.

### `ERR_HTTP2_GOAWAY_SESSION` {#err_http2_goaway_session}

Nuovi Stream HTTP/2 non possono essere aperti dopo che la `Http2Session` ha ricevuto un frame `GOAWAY` dal peer connesso.

### `ERR_HTTP2_HEADERS_AFTER_RESPOND` {#err_http2_headers_after_respond}

Sono stati specificati header aggiuntivi dopo che è stata avviata una risposta HTTP/2.

### `ERR_HTTP2_HEADERS_SENT` {#err_http2_headers_sent}

È stato effettuato un tentativo di inviare più header di risposta.

### `ERR_HTTP2_HEADER_SINGLE_VALUE` {#err_http2_header_single_value}

Sono stati forniti più valori per un campo header HTTP/2 che doveva avere un solo valore.

### `ERR_HTTP2_INFO_STATUS_NOT_ALLOWED` {#err_http2_info_status_not_allowed}

I codici di stato HTTP informativi (`1xx`) non possono essere impostati come codice di stato di risposta sulle risposte HTTP/2.

### `ERR_HTTP2_INVALID_CONNECTION_HEADERS` {#err_http2_invalid_connection_headers}

Gli header specifici della connessione HTTP/1 sono vietati per l'uso in richieste e risposte HTTP/2.

### `ERR_HTTP2_INVALID_HEADER_VALUE` {#err_http2_invalid_header_value}

È stato specificato un valore di header HTTP/2 non valido.


### `ERR_HTTP2_INVALID_INFO_STATUS` {#err_http2_invalid_info_status}

È stato specificato un codice di stato informativo HTTP non valido. I codici di stato informativi devono essere un numero intero compreso tra `100` e `199` (inclusi).

### `ERR_HTTP2_INVALID_ORIGIN` {#err_http2_invalid_origin}

I frame HTTP/2 `ORIGIN` richiedono un'origine valida.

### `ERR_HTTP2_INVALID_PACKED_SETTINGS_LENGTH` {#err_http2_invalid_packed_settings_length}

Le istanze `Buffer` e `Uint8Array` passate all'API `http2.getUnpackedSettings()` devono avere una lunghezza multipla di sei.

### `ERR_HTTP2_INVALID_PSEUDOHEADER` {#err_http2_invalid_pseudoheader}

Possono essere utilizzati solo pseudoheader HTTP/2 validi (`:status`, `:path`, `:authority`, `:scheme` e `:method`).

### `ERR_HTTP2_INVALID_SESSION` {#err_http2_invalid_session}

È stata eseguita un'azione su un oggetto `Http2Session` che era già stato distrutto.

### `ERR_HTTP2_INVALID_SETTING_VALUE` {#err_http2_invalid_setting_value}

È stato specificato un valore non valido per un'impostazione HTTP/2.

### `ERR_HTTP2_INVALID_STREAM` {#err_http2_invalid_stream}

È stata eseguita un'operazione su un flusso che era già stato distrutto.

### `ERR_HTTP2_MAX_PENDING_SETTINGS_ACK` {#err_http2_max_pending_settings_ack}

Ogni volta che viene inviato un frame `SETTINGS` HTTP/2 a un peer connesso, il peer è tenuto a inviare un riconoscimento di aver ricevuto e applicato le nuove `SETTINGS`. Per impostazione predefinita, è possibile inviare un numero massimo di frame `SETTINGS` non riconosciuti in un dato momento. Questo codice di errore viene utilizzato quando tale limite è stato raggiunto.

### `ERR_HTTP2_NESTED_PUSH` {#err_http2_nested_push}

È stato effettuato un tentativo di avviare un nuovo stream push dall'interno di uno stream push. Gli stream push nidificati non sono consentiti.

### `ERR_HTTP2_NO_MEM` {#err_http2_no_mem}

Memoria insufficiente durante l'utilizzo dell'API `http2session.setLocalWindowSize(windowSize)`.

### `ERR_HTTP2_NO_SOCKET_MANIPULATION` {#err_http2_no_socket_manipulation}

È stato effettuato un tentativo di manipolare direttamente (leggere, scrivere, mettere in pausa, riprendere, ecc.) un socket collegato a una `Http2Session`.

### `ERR_HTTP2_ORIGIN_LENGTH` {#err_http2_origin_length}

I frame HTTP/2 `ORIGIN` sono limitati a una lunghezza di 16382 byte.

### `ERR_HTTP2_OUT_OF_STREAMS` {#err_http2_out_of_streams}

Il numero di stream creati su una singola sessione HTTP/2 ha raggiunto il limite massimo.

### `ERR_HTTP2_PAYLOAD_FORBIDDEN` {#err_http2_payload_forbidden}

È stato specificato un payload del messaggio per un codice di risposta HTTP per il quale un payload è vietato.


### `ERR_HTTP2_PING_CANCEL` {#err_http2_ping_cancel}

Un ping HTTP/2 è stato annullato.

### `ERR_HTTP2_PING_LENGTH` {#err_http2_ping_length}

I payload dei ping HTTP/2 devono essere esattamente di 8 byte.

### `ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED` {#err_http2_pseudoheader_not_allowed}

È stato utilizzato impropriamente un pseudo-header HTTP/2. Gli pseudo-header sono nomi di chiavi di header che iniziano con il prefisso `:`.

### `ERR_HTTP2_PUSH_DISABLED` {#err_http2_push_disabled}

È stato effettuato un tentativo di creare uno stream push, che era stato disabilitato dal client.

### `ERR_HTTP2_SEND_FILE` {#err_http2_send_file}

È stato effettuato un tentativo di utilizzare l'API `Http2Stream.prototype.responseWithFile()` per inviare una directory.

### `ERR_HTTP2_SEND_FILE_NOSEEK` {#err_http2_send_file_noseek}

È stato effettuato un tentativo di utilizzare l'API `Http2Stream.prototype.responseWithFile()` per inviare qualcosa di diverso da un file regolare, ma sono state fornite le opzioni `offset` o `length`.

### `ERR_HTTP2_SESSION_ERROR` {#err_http2_session_error}

La `Http2Session` è stata chiusa con un codice di errore diverso da zero.

### `ERR_HTTP2_SETTINGS_CANCEL` {#err_http2_settings_cancel}

Le impostazioni `Http2Session` sono state annullate.

### `ERR_HTTP2_SOCKET_BOUND` {#err_http2_socket_bound}

È stato effettuato un tentativo di connettere un oggetto `Http2Session` a un `net.Socket` o `tls.TLSSocket` che era già stato associato a un altro oggetto `Http2Session`.

### `ERR_HTTP2_SOCKET_UNBOUND` {#err_http2_socket_unbound}

È stato effettuato un tentativo di utilizzare la proprietà `socket` di una `Http2Session` che è già stata chiusa.

### `ERR_HTTP2_STATUS_101` {#err_http2_status_101}

L'uso del codice di stato informativo `101` è vietato in HTTP/2.

### `ERR_HTTP2_STATUS_INVALID` {#err_http2_status_invalid}

È stato specificato un codice di stato HTTP non valido. I codici di stato devono essere un intero compreso tra `100` e `599` (inclusi).

### `ERR_HTTP2_STREAM_CANCEL` {#err_http2_stream_cancel}

Un `Http2Stream` è stato distrutto prima che qualsiasi dato fosse trasmesso al peer connesso.

### `ERR_HTTP2_STREAM_ERROR` {#err_http2_stream_error}

È stato specificato un codice di errore diverso da zero in un frame `RST_STREAM`.

### `ERR_HTTP2_STREAM_SELF_DEPENDENCY` {#err_http2_stream_self_dependency}

Quando si imposta la priorità per un flusso HTTP/2, il flusso può essere contrassegnato come dipendenza per un flusso padre. Questo codice di errore viene utilizzato quando si tenta di contrassegnare un flusso e dipendente da se stesso.

### `ERR_HTTP2_TOO_MANY_CUSTOM_SETTINGS` {#err_http2_too_many_custom_settings}

È stato superato il numero di impostazioni personalizzate supportate (10).


### `ERR_HTTP2_TOO_MANY_INVALID_FRAMES` {#err_http2_too_many_invalid_frames}

**Aggiunta in: v15.14.0**

È stato superato il limite di frame di protocollo HTTP/2 non validi accettabili inviati dal peer, come specificato tramite l'opzione `maxSessionInvalidFrames`.

### `ERR_HTTP2_TRAILERS_ALREADY_SENT` {#err_http2_trailers_already_sent}

I trailer di intestazione sono già stati inviati sull'`Http2Stream`.

### `ERR_HTTP2_TRAILERS_NOT_READY` {#err_http2_trailers_not_ready}

Il metodo `http2stream.sendTrailers()` non può essere chiamato finché non viene emesso l'evento `'wantTrailers'` su un oggetto `Http2Stream`. L'evento `'wantTrailers'` verrà emesso solo se l'opzione `waitForTrailers` è impostata per l'`Http2Stream`.

### `ERR_HTTP2_UNSUPPORTED_PROTOCOL` {#err_http2_unsupported_protocol}

A `http2.connect()` è stato passato un URL che utilizza qualsiasi protocollo diverso da `http:` o `https:`.

### `ERR_HTTP_BODY_NOT_ALLOWED` {#err_http_body_not_allowed}

Viene generato un errore quando si scrive su una risposta HTTP che non consente contenuti.

### `ERR_HTTP_CONTENT_LENGTH_MISMATCH` {#err_http_content_length_mismatch}

La dimensione del body della risposta non corrisponde al valore dell'header content-length specificato.

### `ERR_HTTP_HEADERS_SENT` {#err_http_headers_sent}

È stato effettuato un tentativo di aggiungere più header dopo che gli header erano già stati inviati.

### `ERR_HTTP_INVALID_HEADER_VALUE` {#err_http_invalid_header_value}

È stato specificato un valore di header HTTP non valido.

### `ERR_HTTP_INVALID_STATUS_CODE` {#err_http_invalid_status_code}

Il codice di stato era al di fuori dell'intervallo di codici di stato regolari (100-999).

### `ERR_HTTP_REQUEST_TIMEOUT` {#err_http_request_timeout}

Il client non ha inviato l'intera richiesta entro il tempo consentito.

### `ERR_HTTP_SOCKET_ASSIGNED` {#err_http_socket_assigned}

Alla [`ServerResponse`](/it/nodejs/api/http#class-httpserverresponse) fornita era già stato assegnato un socket.

### `ERR_HTTP_SOCKET_ENCODING` {#err_http_socket_encoding}

La modifica della codifica del socket non è consentita secondo la [RFC 7230 Sezione 3](https://tools.ietf.org/html/rfc7230#section-3).

### `ERR_HTTP_TRAILER_INVALID` {#err_http_trailer_invalid}

L'header `Trailer` è stato impostato anche se la codifica di trasferimento non lo supporta.

### `ERR_ILLEGAL_CONSTRUCTOR` {#err_illegal_constructor}

È stato effettuato un tentativo di costruire un oggetto utilizzando un costruttore non pubblico.

### `ERR_IMPORT_ATTRIBUTE_MISSING` {#err_import_attribute_missing}

**Aggiunta in: v21.1.0**

Manca un attributo di importazione, impedendo l'importazione del modulo specificato.


### `ERR_IMPORT_ATTRIBUTE_TYPE_INCOMPATIBLE` {#err_import_attribute_type_incompatible}

**Aggiunto in: v21.1.0**

È stato fornito un attributo `type` di importazione, ma il modulo specificato è di un tipo diverso.

### `ERR_IMPORT_ATTRIBUTE_UNSUPPORTED` {#err_import_attribute_unsupported}

**Aggiunto in: v21.0.0, v20.10.0, v18.19.0**

Un attributo di importazione non è supportato da questa versione di Node.js.

### `ERR_INCOMPATIBLE_OPTION_PAIR` {#err_incompatible_option_pair}

Una coppia di opzioni è incompatibile tra loro e non può essere utilizzata contemporaneamente.

### `ERR_INPUT_TYPE_NOT_ALLOWED` {#err_input_type_not_allowed}

::: warning [Stable: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Il flag `--input-type` è stato utilizzato per tentare di eseguire un file. Questo flag può essere utilizzato solo con input tramite `--eval`, `--print` o `STDIN`.

### `ERR_INSPECTOR_ALREADY_ACTIVATED` {#err_inspector_already_activated}

Durante l'utilizzo del modulo `node:inspector`, è stato fatto un tentativo di attivare l'inspector quando aveva già iniziato ad ascoltare su una porta. Usa `inspector.close()` prima di attivarlo su un indirizzo diverso.

### `ERR_INSPECTOR_ALREADY_CONNECTED` {#err_inspector_already_connected}

Durante l'utilizzo del modulo `node:inspector`, è stato fatto un tentativo di connettersi quando l'inspector era già connesso.

### `ERR_INSPECTOR_CLOSED` {#err_inspector_closed}

Durante l'utilizzo del modulo `node:inspector`, è stato fatto un tentativo di utilizzare l'inspector dopo che la sessione era già stata chiusa.

### `ERR_INSPECTOR_COMMAND` {#err_inspector_command}

Si è verificato un errore durante l'esecuzione di un comando tramite il modulo `node:inspector`.

### `ERR_INSPECTOR_NOT_ACTIVE` {#err_inspector_not_active}

L'`inspector` non è attivo quando viene chiamato `inspector.waitForDebugger()`.

### `ERR_INSPECTOR_NOT_AVAILABLE` {#err_inspector_not_available}

Il modulo `node:inspector` non è disponibile per l'uso.

### `ERR_INSPECTOR_NOT_CONNECTED` {#err_inspector_not_connected}

Durante l'utilizzo del modulo `node:inspector`, è stato fatto un tentativo di utilizzare l'inspector prima che fosse connesso.

### `ERR_INSPECTOR_NOT_WORKER` {#err_inspector_not_worker}

È stata chiamata un'API nel thread principale che può essere utilizzata solo dal thread worker.

### `ERR_INTERNAL_ASSERTION` {#err_internal_assertion}

C'è stato un bug in Node.js o un uso errato dei componenti interni di Node.js. Per correggere l'errore, apri un problema all'indirizzo [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues).


### `ERR_INVALID_ADDRESS` {#err_invalid_address}

L'indirizzo fornito non è riconosciuto dall'API di Node.js.

### `ERR_INVALID_ADDRESS_FAMILY` {#err_invalid_address_family}

La famiglia di indirizzi fornita non è riconosciuta dall'API di Node.js.

### `ERR_INVALID_ARG_TYPE` {#err_invalid_arg_type}

Un argomento del tipo sbagliato è stato passato a un'API di Node.js.

### `ERR_INVALID_ARG_VALUE` {#err_invalid_arg_value}

Un valore non valido o non supportato è stato passato per un determinato argomento.

### `ERR_INVALID_ASYNC_ID` {#err_invalid_async_id}

Un `asyncId` o `triggerAsyncId` non valido è stato passato usando `AsyncHooks`. Un id inferiore a -1 non dovrebbe mai accadere.

### `ERR_INVALID_BUFFER_SIZE` {#err_invalid_buffer_size}

È stato eseguito uno swap su un `Buffer`, ma la sua dimensione non era compatibile con l'operazione.

### `ERR_INVALID_CHAR` {#err_invalid_char}

Sono stati rilevati caratteri non validi negli header.

### `ERR_INVALID_CURSOR_POS` {#err_invalid_cursor_pos}

Un cursore su un determinato stream non può essere spostato in una riga specificata senza una colonna specificata.

### `ERR_INVALID_FD` {#err_invalid_fd}

Un descrittore di file ('fd') non era valido (ad esempio, era un valore negativo).

### `ERR_INVALID_FD_TYPE` {#err_invalid_fd_type}

Un tipo di descrittore di file ('fd') non era valido.

### `ERR_INVALID_FILE_URL_HOST` {#err_invalid_file_url_host}

Un'API di Node.js che consuma URL `file:` (come alcune funzioni nel modulo [`fs`](/it/nodejs/api/fs)) ha incontrato un URL file con un host incompatibile. Questa situazione può verificarsi solo su sistemi di tipo Unix in cui sono supportati solo `localhost` o un host vuoto.

### `ERR_INVALID_FILE_URL_PATH` {#err_invalid_file_url_path}

Un'API di Node.js che consuma URL `file:` (come alcune funzioni nel modulo [`fs`](/it/nodejs/api/fs)) ha incontrato un URL file con un percorso incompatibile. La semantica esatta per determinare se un percorso può essere utilizzato dipende dalla piattaforma.

### `ERR_INVALID_HANDLE_TYPE` {#err_invalid_handle_type}

È stato effettuato un tentativo di inviare un "handle" non supportato su un canale di comunicazione IPC a un processo figlio. Vedere [`subprocess.send()`](/it/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) e [`process.send()`](/it/nodejs/api/process#processsendmessage-sendhandle-options-callback) per maggiori informazioni.

### `ERR_INVALID_HTTP_TOKEN` {#err_invalid_http_token}

È stato fornito un token HTTP non valido.

### `ERR_INVALID_IP_ADDRESS` {#err_invalid_ip_address}

Un indirizzo IP non è valido.


### `ERR_INVALID_MIME_SYNTAX` {#err_invalid_mime_syntax}

La sintassi di un MIME non è valida.

### `ERR_INVALID_MODULE` {#err_invalid_module}

**Aggiunto in: v15.0.0, v14.18.0**

È stato fatto un tentativo di caricare un modulo inesistente o non valido.

### `ERR_INVALID_MODULE_SPECIFIER` {#err_invalid_module_specifier}

La stringa del modulo importato è un URL, un nome di pacchetto o uno specificatore di sottopercorso del pacchetto non valido.

### `ERR_INVALID_OBJECT_DEFINE_PROPERTY` {#err_invalid_object_define_property}

Si è verificato un errore durante l'impostazione di un attributo non valido sulla proprietà di un oggetto.

### `ERR_INVALID_PACKAGE_CONFIG` {#err_invalid_package_config}

Un file [`package.json`](/it/nodejs/api/packages#nodejs-packagejson-field-definitions) non valido non è stato analizzato correttamente.

### `ERR_INVALID_PACKAGE_TARGET` {#err_invalid_package_target}

Il campo [`"exports"`](/it/nodejs/api/packages#exports) di `package.json` contiene un valore di mappatura di destinazione non valido per la risoluzione del modulo tentata.

### `ERR_INVALID_PROTOCOL` {#err_invalid_protocol}

Un `options.protocol` non valido è stato passato a `http.request()`.

### `ERR_INVALID_REPL_EVAL_CONFIG` {#err_invalid_repl_eval_config}

Sono state impostate sia l'opzione `breakEvalOnSigint` che l'opzione `eval` nella configurazione [`REPL`](/it/nodejs/api/repl), cosa non supportata.

### `ERR_INVALID_REPL_INPUT` {#err_invalid_repl_input}

L'input non può essere utilizzato in [`REPL`](/it/nodejs/api/repl). Le condizioni in cui viene utilizzato questo errore sono descritte nella documentazione [`REPL`](/it/nodejs/api/repl).

### `ERR_INVALID_RETURN_PROPERTY` {#err_invalid_return_property}

Generato nel caso in cui un'opzione di funzione non fornisca un valore valido per una delle proprietà dell'oggetto restituito durante l'esecuzione.

### `ERR_INVALID_RETURN_PROPERTY_VALUE` {#err_invalid_return_property_value}

Generato nel caso in cui un'opzione di funzione non fornisca un tipo di valore previsto per una delle proprietà dell'oggetto restituito durante l'esecuzione.

### `ERR_INVALID_RETURN_VALUE` {#err_invalid_return_value}

Generato nel caso in cui un'opzione di funzione non restituisca un tipo di valore previsto durante l'esecuzione, ad esempio quando una funzione dovrebbe restituire una promise.

### `ERR_INVALID_STATE` {#err_invalid_state}

**Aggiunto in: v15.0.0**

Indica che un'operazione non può essere completata a causa di uno stato non valido. Ad esempio, un oggetto potrebbe essere già stato distrutto o potrebbe essere in corso un'altra operazione.

### `ERR_INVALID_SYNC_FORK_INPUT` {#err_invalid_sync_fork_input}

Un `Buffer`, `TypedArray`, `DataView` o `string` è stato fornito come input stdio a un fork asincrono. Vedere la documentazione del modulo [`child_process`](/it/nodejs/api/child_process) per maggiori informazioni.


### `ERR_INVALID_THIS` {#err_invalid_this}

Una funzione API di Node.js è stata chiamata con un valore `this` incompatibile.

```js [ESM]
const urlSearchParams = new URLSearchParams('foo=bar&baz=new');

const buf = Buffer.alloc(1);
urlSearchParams.has.call(buf, 'foo');
// Lancia un TypeError con codice 'ERR_INVALID_THIS'
```
### `ERR_INVALID_TUPLE` {#err_invalid_tuple}

Un elemento nell'`iterable` fornito al [`URLSearchParams` constructor](/it/nodejs/api/url#new-urlsearchparamsiterable) [WHATWG](/it/nodejs/api/url#the-whatwg-url-api) non rappresentava una tupla `[name, value]` – ovvero, se un elemento non è iterabile, o non consiste esattamente di due elementi.

### `ERR_INVALID_TYPESCRIPT_SYNTAX` {#err_invalid_typescript_syntax}

**Aggiunto in: v23.0.0**

La sintassi TypeScript fornita non è valida o non è supportata. Questo potrebbe accadere quando si utilizza una sintassi TypeScript che richiede la trasformazione con lo [stripping del tipo](/it/nodejs/api/typescript#type-stripping).

### `ERR_INVALID_URI` {#err_invalid_uri}

È stato passato un URI non valido.

### `ERR_INVALID_URL` {#err_invalid_url}

Un URL non valido è stato passato al [`URL` constructor](/it/nodejs/api/url#new-urlinput-base) [WHATWG](/it/nodejs/api/url#the-whatwg-url-api) o al legacy [`url.parse()`](/it/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) per essere analizzato. L'oggetto errore generato ha in genere una proprietà aggiuntiva `'input'` che contiene l'URL che non è stato analizzato.

### `ERR_INVALID_URL_SCHEME` {#err_invalid_url_scheme}

È stato fatto un tentativo di utilizzare un URL con uno schema (protocollo) incompatibile per uno scopo specifico. Viene utilizzato solo nel supporto [WHATWG URL API](/it/nodejs/api/url#the-whatwg-url-api) nel modulo [`fs`](/it/nodejs/api/fs) (che accetta solo URL con schema `'file'`), ma potrebbe essere utilizzato anche in altre API di Node.js in futuro.

### `ERR_IPC_CHANNEL_CLOSED` {#err_ipc_channel_closed}

È stato fatto un tentativo di utilizzare un canale di comunicazione IPC che era già chiuso.

### `ERR_IPC_DISCONNECTED` {#err_ipc_disconnected}

È stato fatto un tentativo di disconnettere un canale di comunicazione IPC che era già disconnesso. Vedere la documentazione per il modulo [`child_process`](/it/nodejs/api/child_process) per maggiori informazioni.

### `ERR_IPC_ONE_PIPE` {#err_ipc_one_pipe}

È stato fatto un tentativo di creare un processo figlio Node.js utilizzando più di un canale di comunicazione IPC. Vedere la documentazione per il modulo [`child_process`](/it/nodejs/api/child_process) per maggiori informazioni.


### `ERR_IPC_SYNC_FORK` {#err_ipc_sync_fork}

È stato effettuato un tentativo di aprire un canale di comunicazione IPC con un processo Node.js forchettato sincronicamente. Per maggiori informazioni, consulta la documentazione del modulo [`child_process`](/it/nodejs/api/child_process).

### `ERR_IP_BLOCKED` {#err_ip_blocked}

L'IP è bloccato da `net.BlockList`.

### `ERR_LOADER_CHAIN_INCOMPLETE` {#err_loader_chain_incomplete}

**Aggiunto in: v18.6.0, v16.17.0**

Un hook del caricatore ESM è tornato senza chiamare `next()` e senza segnalare esplicitamente un cortocircuito.

### `ERR_LOAD_SQLITE_EXTENSION` {#err_load_sqlite_extension}

**Aggiunto in: v23.5.0**

Si è verificato un errore durante il caricamento di un'estensione SQLite.

### `ERR_MEMORY_ALLOCATION_FAILED` {#err_memory_allocation_failed}

È stato effettuato un tentativo di allocare memoria (solitamente nel livello C++) ma non è riuscito.

### `ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE` {#err_message_target_context_unavailable}

**Aggiunto in: v14.5.0, v12.19.0**

Un messaggio inviato a una [`MessagePort`](/it/nodejs/api/worker_threads#class-messageport) non è stato deserializzato nel [vm](/it/nodejs/api/vm) `Context` di destinazione. Non tutti gli oggetti Node.js possono essere istanziati con successo in qualsiasi contesto al momento, e tentare di trasferirli usando `postMessage()` può fallire sul lato ricevente in quel caso.

### `ERR_METHOD_NOT_IMPLEMENTED` {#err_method_not_implemented}

Un metodo è richiesto ma non implementato.

### `ERR_MISSING_ARGS` {#err_missing_args}

Un argomento richiesto di un'API Node.js non è stato passato. Questo viene utilizzato solo per la stretta conformità con le specifiche dell'API (che in alcuni casi possono accettare `func(undefined)` ma non `func()`). Nella maggior parte delle API native di Node.js, `func(undefined)` e `func()` sono trattate in modo identico e al loro posto può essere utilizzato il codice di errore [`ERR_INVALID_ARG_TYPE`](/it/nodejs/api/errors#err-invalid-arg-type).

### `ERR_MISSING_OPTION` {#err_missing_option}

Per le API che accettano oggetti di opzioni, alcune opzioni potrebbero essere obbligatorie. Questo codice viene generato se manca un'opzione obbligatoria.

### `ERR_MISSING_PASSPHRASE` {#err_missing_passphrase}

È stato effettuato un tentativo di leggere una chiave crittografata senza specificare una passphrase.

### `ERR_MISSING_PLATFORM_FOR_WORKER` {#err_missing_platform_for_worker}

La piattaforma V8 utilizzata da questa istanza di Node.js non supporta la creazione di Worker. Ciò è causato dalla mancanza di supporto dell'embedder per i Worker. In particolare, questo errore non si verificherà con le build standard di Node.js.


### `ERR_MODULE_NOT_FOUND` {#err_module_not_found}

Un file di modulo non è stato risolto dal caricatore di moduli ECMAScript durante un'operazione di `import` o durante il caricamento del punto di ingresso del programma.

### `ERR_MULTIPLE_CALLBACK` {#err_multiple_callback}

Una callback è stata chiamata più di una volta.

Una callback è quasi sempre intesa per essere chiamata una sola volta poiché la query può essere soddisfatta o rifiutata, ma non entrambe contemporaneamente. Quest'ultimo sarebbe possibile chiamando una callback più di una volta.

### `ERR_NAPI_CONS_FUNCTION` {#err_napi_cons_function}

Durante l'utilizzo di `Node-API`, un costruttore passato non era una funzione.

### `ERR_NAPI_INVALID_DATAVIEW_ARGS` {#err_napi_invalid_dataview_args}

Durante la chiamata a `napi_create_dataview()`, un determinato `offset` era al di fuori dei limiti della dataview o `offset + length` era maggiore della lunghezza del `buffer` fornito.

### `ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT` {#err_napi_invalid_typedarray_alignment}

Durante la chiamata a `napi_create_typedarray()`, l'`offset` fornito non era un multiplo della dimensione dell'elemento.

### `ERR_NAPI_INVALID_TYPEDARRAY_LENGTH` {#err_napi_invalid_typedarray_length}

Durante la chiamata a `napi_create_typedarray()`, `(length * size_of_element) + byte_offset` era maggiore della lunghezza del `buffer` fornito.

### `ERR_NAPI_TSFN_CALL_JS` {#err_napi_tsfn_call_js}

Si è verificato un errore durante l'invocazione della porzione JavaScript della funzione thread-safe.

### `ERR_NAPI_TSFN_GET_UNDEFINED` {#err_napi_tsfn_get_undefined}

Si è verificato un errore durante il tentativo di recuperare il valore JavaScript `undefined`.

### `ERR_NON_CONTEXT_AWARE_DISABLED` {#err_non_context_aware_disabled}

Un addon nativo non context-aware è stato caricato in un processo che li vieta.

### `ERR_NOT_BUILDING_SNAPSHOT` {#err_not_building_snapshot}

È stato fatto un tentativo di utilizzare operazioni che possono essere utilizzate solo quando si sta costruendo uno snapshot di avvio V8, anche se Node.js non ne sta costruendo uno.

### `ERR_NOT_IN_SINGLE_EXECUTABLE_APPLICATION` {#err_not_in_single_executable_application}

**Aggiunto in: v21.7.0, v20.12.0**

L'operazione non può essere eseguita quando non si trova in un'applicazione eseguibile singola.

### `ERR_NOT_SUPPORTED_IN_SNAPSHOT` {#err_not_supported_in_snapshot}

È stato fatto un tentativo di eseguire operazioni non supportate durante la creazione di uno snapshot di avvio.

### `ERR_NO_CRYPTO` {#err_no_crypto}

È stato fatto un tentativo di utilizzare le funzionalità di crittografia mentre Node.js non è stato compilato con il supporto della crittografia OpenSSL.


### `ERR_NO_ICU` {#err_no_icu}

È stato effettuato un tentativo di utilizzare funzionalità che richiedono [ICU](/it/nodejs/api/intl#internationalization-support), ma Node.js non è stato compilato con il supporto ICU.

### `ERR_NO_TYPESCRIPT` {#err_no_typescript}

**Aggiunto in: v23.0.0**

È stato effettuato un tentativo di utilizzare funzionalità che richiedono il [supporto nativo di TypeScript](/it/nodejs/api/typescript#type-stripping), ma Node.js non è stato compilato con il supporto TypeScript.

### `ERR_OPERATION_FAILED` {#err_operation_failed}

**Aggiunto in: v15.0.0**

Un'operazione non è riuscita. Questo viene tipicamente usato per segnalare il fallimento generale di un'operazione asincrona.

### `ERR_OUT_OF_RANGE` {#err_out_of_range}

Un valore dato è fuori dall'intervallo accettato.

### `ERR_PACKAGE_IMPORT_NOT_DEFINED` {#err_package_import_not_defined}

Il campo [`"imports"`](/it/nodejs/api/packages#imports) del `package.json` non definisce la mappatura dello specificatore di pacchetto interno dato.

### `ERR_PACKAGE_PATH_NOT_EXPORTED` {#err_package_path_not_exported}

Il campo [`"exports"`](/it/nodejs/api/packages#exports) del `package.json` non esporta il sottopercorso richiesto. Poiché le esportazioni sono incapsulate, i moduli interni privati che non vengono esportati non possono essere importati tramite la risoluzione del pacchetto, a meno che non si utilizzi un URL assoluto.

### `ERR_PARSE_ARGS_INVALID_OPTION_VALUE` {#err_parse_args_invalid_option_value}

**Aggiunto in: v18.3.0, v16.17.0**

Quando `strict` è impostato su `true`, lanciato da [`util.parseArgs()`](/it/nodejs/api/util#utilparseargsconfig) se viene fornito un valore [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) per un'opzione di tipo [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), o se viene fornito un valore [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) per un'opzione di tipo [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).

### `ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL` {#err_parse_args_unexpected_positional}

**Aggiunto in: v18.3.0, v16.17.0**

Lanciato da [`util.parseArgs()`](/it/nodejs/api/util#utilparseargsconfig), quando viene fornito un argomento posizionale e `allowPositionals` è impostato su `false`.

### `ERR_PARSE_ARGS_UNKNOWN_OPTION` {#err_parse_args_unknown_option}

**Aggiunto in: v18.3.0, v16.17.0**

Quando `strict` è impostato su `true`, lanciato da [`util.parseArgs()`](/it/nodejs/api/util#utilparseargsconfig) se un argomento non è configurato in `options`.


### `ERR_PERFORMANCE_INVALID_TIMESTAMP` {#err_performance_invalid_timestamp}

È stato fornito un valore di timestamp non valido per un contrassegno o una misurazione delle prestazioni.

### `ERR_PERFORMANCE_MEASURE_INVALID_OPTIONS` {#err_performance_measure_invalid_options}

Sono state fornite opzioni non valide per una misurazione delle prestazioni.

### `ERR_PROTO_ACCESS` {#err_proto_access}

L'accesso a `Object.prototype.__proto__` è stato proibito usando [`--disable-proto=throw`](/it/nodejs/api/cli#--disable-protomode). [`Object.getPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) e [`Object.setPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) dovrebbero essere usati per ottenere e impostare il prototipo di un oggetto.

### `ERR_QUIC_APPLICATION_ERROR` {#err_quic_application_error}

**Aggiunto in: v23.4.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Si è verificato un errore dell'applicazione QUIC.

### `ERR_QUIC_CONNECTION_FAILED` {#err_quic_connection_failed}

**Aggiunto in: v23.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

La creazione di una connessione QUIC non è riuscita.

### `ERR_QUIC_ENDPOINT_CLOSED` {#err_quic_endpoint_closed}

**Aggiunto in: v23.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Un endpoint QUIC è stato chiuso con un errore.

### `ERR_QUIC_OPEN_STREAM_FAILED` {#err_quic_open_stream_failed}

**Aggiunto in: v23.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

L'apertura di uno stream QUIC non è riuscita.

### `ERR_QUIC_TRANSPORT_ERROR` {#err_quic_transport_error}

**Aggiunto in: v23.4.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Si è verificato un errore di trasporto QUIC.

### `ERR_QUIC_VERSION_NEGOTIATION_ERROR` {#err_quic_version_negotiation_error}

**Aggiunto in: v23.4.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Una sessione QUIC non è riuscita perché è necessaria la negoziazione della versione.


### `ERR_REQUIRE_ASYNC_MODULE` {#err_require_async_module}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Quando si tenta di `require()` un [Modulo ES](/it/nodejs/api/esm), il modulo risulta essere asincrono. Ovvero, contiene un await di livello superiore.

Per vedere dove si trova l'await di livello superiore, usa `--experimental-print-required-tla` (questo eseguirebbe i moduli prima di cercare gli await di livello superiore).

### `ERR_REQUIRE_CYCLE_MODULE` {#err_require_cycle_module}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Quando si tenta di `require()` un [Modulo ES](/it/nodejs/api/esm), un collegamento CommonJS a ESM o ESM a CommonJS partecipa a un ciclo immediato. Questo non è consentito perché i Moduli ES non possono essere valutati mentre sono già in fase di valutazione.

Per evitare il ciclo, la chiamata `require()` coinvolta in un ciclo non dovrebbe avvenire al livello superiore di un Modulo ES (tramite `createRequire()`) o di un modulo CommonJS, e dovrebbe essere eseguita in modo lazy in una funzione interna.

### `ERR_REQUIRE_ESM` {#err_require_esm}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | require() ora supporta il caricamento di moduli ES sincroni per impostazione predefinita. |
:::

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato
:::

È stato fatto un tentativo di `require()` un [Modulo ES](/it/nodejs/api/esm).

Questo errore è stato deprecato poiché `require()` ora supporta il caricamento di moduli ES sincroni. Quando `require()` incontra un modulo ES che contiene `await` di livello superiore, genererà invece [`ERR_REQUIRE_ASYNC_MODULE`](/it/nodejs/api/errors#err_require_async_module).

### `ERR_SCRIPT_EXECUTION_INTERRUPTED` {#err_script_execution_interrupted}

L'esecuzione dello script è stata interrotta da `SIGINT` (ad esempio, è stato premuto +).

### `ERR_SCRIPT_EXECUTION_TIMEOUT` {#err_script_execution_timeout}

L'esecuzione dello script è scaduta, probabilmente a causa di bug nello script in esecuzione.

### `ERR_SERVER_ALREADY_LISTEN` {#err_server_already_listen}

Il metodo [`server.listen()`](/it/nodejs/api/net#serverlisten) è stato chiamato mentre un `net.Server` era già in ascolto. Questo vale per tutte le istanze di `net.Server`, incluse le istanze `Server` HTTP, HTTPS e HTTP/2.


### `ERR_SERVER_NOT_RUNNING` {#err_server_not_running}

Il metodo [`server.close()`](/it/nodejs/api/net#serverclosecallback) è stato chiamato quando un `net.Server` non era in esecuzione. Questo si applica a tutte le istanze di `net.Server`, incluse le istanze `Server` HTTP, HTTPS e HTTP/2.

### `ERR_SINGLE_EXECUTABLE_APPLICATION_ASSET_NOT_FOUND` {#err_single_executable_application_asset_not_found}

**Aggiunto in: v21.7.0, v20.12.0**

È stata passata una chiave alle API dell'applicazione eseguibile singola per identificare una risorsa, ma non è stata trovata alcuna corrispondenza.

### `ERR_SOCKET_ALREADY_BOUND` {#err_socket_already_bound}

È stato fatto un tentativo di associare un socket che è già stato associato.

### `ERR_SOCKET_BAD_BUFFER_SIZE` {#err_socket_bad_buffer_size}

È stata passata una dimensione non valida (negativa) per le opzioni `recvBufferSize` o `sendBufferSize` in [`dgram.createSocket()`](/it/nodejs/api/dgram#dgramcreatesocketoptions-callback).

### `ERR_SOCKET_BAD_PORT` {#err_socket_bad_port}

Una funzione API che prevede una porta \>= 0 e \< 65536 ha ricevuto un valore non valido.

### `ERR_SOCKET_BAD_TYPE` {#err_socket_bad_type}

Una funzione API che prevede un tipo di socket (`udp4` o `udp6`) ha ricevuto un valore non valido.

### `ERR_SOCKET_BUFFER_SIZE` {#err_socket_buffer_size}

Durante l'utilizzo di [`dgram.createSocket()`](/it/nodejs/api/dgram#dgramcreatesocketoptions-callback), non è stato possibile determinare la dimensione del `Buffer` di ricezione o di invio.

### `ERR_SOCKET_CLOSED` {#err_socket_closed}

È stato fatto un tentativo di operare su un socket già chiuso.

### `ERR_SOCKET_CLOSED_BEFORE_CONNECTION` {#err_socket_closed_before_connection}

Quando si chiama [`net.Socket.write()`](/it/nodejs/api/net#socketwritedata-encoding-callback) su un socket in fase di connessione e il socket è stato chiuso prima che la connessione fosse stabilita.

### `ERR_SOCKET_CONNECTION_TIMEOUT` {#err_socket_connection_timeout}

Il socket non è stato in grado di connettersi a nessun indirizzo restituito dal DNS entro il timeout consentito quando si utilizza l'algoritmo di autoselezione della famiglia.

### `ERR_SOCKET_DGRAM_IS_CONNECTED` {#err_socket_dgram_is_connected}

È stata effettuata una chiamata a [`dgram.connect()`](/it/nodejs/api/dgram#socketconnectport-address-callback) su un socket già connesso.

### `ERR_SOCKET_DGRAM_NOT_CONNECTED` {#err_socket_dgram_not_connected}

È stata effettuata una chiamata a [`dgram.disconnect()`](/it/nodejs/api/dgram#socketdisconnect) o [`dgram.remoteAddress()`](/it/nodejs/api/dgram#socketremoteaddress) su un socket disconnesso.

### `ERR_SOCKET_DGRAM_NOT_RUNNING` {#err_socket_dgram_not_running}

È stata effettuata una chiamata e il sottosistema UDP non era in esecuzione.


### `ERR_SOURCE_MAP_CORRUPT` {#err_source_map_corrupt}

La source map non è stata analizzata perché non esiste o è corrotta.

### `ERR_SOURCE_MAP_MISSING_SOURCE` {#err_source_map_missing_source}

Un file importato da una source map non è stato trovato.

### `ERR_SQLITE_ERROR` {#err_sqlite_error}

**Aggiunto in: v22.5.0**

È stato restituito un errore da [SQLite](/it/nodejs/api/sqlite).

### `ERR_SRI_PARSE` {#err_sri_parse}

È stata fornita una stringa per un controllo di Subresource Integrity, ma non è stato possibile analizzarla. Controllare il formato degli attributi di integrità consultando la [specifica Subresource Integrity](https://www.w3.org/TR/SRI/#the-integrity-attribute).

### `ERR_STREAM_ALREADY_FINISHED` {#err_stream_already_finished}

È stato chiamato un metodo di stream che non può essere completato perché lo stream è stato terminato.

### `ERR_STREAM_CANNOT_PIPE` {#err_stream_cannot_pipe}

È stato fatto un tentativo di chiamare [`stream.pipe()`](/it/nodejs/api/stream#readablepipedestination-options) su uno stream [`Writable`](/it/nodejs/api/stream#class-streamwritable).

### `ERR_STREAM_DESTROYED` {#err_stream_destroyed}

È stato chiamato un metodo di stream che non può essere completato perché lo stream è stato distrutto utilizzando `stream.destroy()`.

### `ERR_STREAM_NULL_VALUES` {#err_stream_null_values}

È stato fatto un tentativo di chiamare [`stream.write()`](/it/nodejs/api/stream#writablewritechunk-encoding-callback) con un chunk `null`.

### `ERR_STREAM_PREMATURE_CLOSE` {#err_stream_premature_close}

Un errore restituito da `stream.finished()` e `stream.pipeline()`, quando uno stream o una pipeline termina in modo non corretto senza un errore esplicito.

### `ERR_STREAM_PUSH_AFTER_EOF` {#err_stream_push_after_eof}

È stato fatto un tentativo di chiamare [`stream.push()`](/it/nodejs/api/stream#readablepushchunk-encoding) dopo che un `null` (EOF) era stato inviato allo stream.

### `ERR_STREAM_UNABLE_TO_PIPE` {#err_stream_unable_to_pipe}

È stato fatto un tentativo di inviare tramite pipe a uno stream chiuso o distrutto in una pipeline.

### `ERR_STREAM_UNSHIFT_AFTER_END_EVENT` {#err_stream_unshift_after_end_event}

È stato fatto un tentativo di chiamare [`stream.unshift()`](/it/nodejs/api/stream#readableunshiftchunk-encoding) dopo che è stato emesso l'evento `'end'`.

### `ERR_STREAM_WRAP` {#err_stream_wrap}

Impedisce un'interruzione se un decodificatore di stringhe è stato impostato sul Socket o se il decodificatore è in `objectMode`.

```js [ESM]
const Socket = require('node:net').Socket;
const instance = new Socket();

instance.setEncoding('utf8');
```

### `ERR_STREAM_WRITE_AFTER_END` {#err_stream_write_after_end}

È stato fatto un tentativo di chiamare [`stream.write()`](/it/nodejs/api/stream#writablewritechunk-encoding-callback) dopo che è stato chiamato `stream.end()`.

### `ERR_STRING_TOO_LONG` {#err_string_too_long}

È stato fatto un tentativo di creare una stringa più lunga della lunghezza massima consentita.

### `ERR_SYNTHETIC` {#err_synthetic}

Un oggetto errore artificiale utilizzato per acquisire lo stack di chiamate per i report diagnostici.

### `ERR_SYSTEM_ERROR` {#err_system_error}

Si è verificato un errore di sistema non specificato o non specifico all'interno del processo Node.js. L'oggetto errore avrà una proprietà dell'oggetto `err.info` con dettagli aggiuntivi.

### `ERR_TAP_LEXER_ERROR` {#err_tap_lexer_error}

Un errore che rappresenta uno stato di lexer fallito.

### `ERR_TAP_PARSER_ERROR` {#err_tap_parser_error}

Un errore che rappresenta uno stato di parser fallito. Ulteriori informazioni sul token che ha causato l'errore sono disponibili tramite la proprietà `cause`.

### `ERR_TAP_VALIDATION_ERROR` {#err_tap_validation_error}

Questo errore rappresenta una convalida TAP fallita.

### `ERR_TEST_FAILURE` {#err_test_failure}

Questo errore rappresenta un test fallito. Ulteriori informazioni sul fallimento sono disponibili tramite la proprietà `cause`. La proprietà `failureType` specifica cosa stava facendo il test quando si è verificato il fallimento.

### `ERR_TLS_ALPN_CALLBACK_INVALID_RESULT` {#err_tls_alpn_callback_invalid_result}

Questo errore viene generato quando un `ALPNCallback` restituisce un valore che non è nell'elenco dei protocolli ALPN offerti dal client.

### `ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS` {#err_tls_alpn_callback_with_protocols}

Questo errore viene generato quando si crea un `TLSServer` se le opzioni TLS includono sia `ALPNProtocols` che `ALPNCallback`. Queste opzioni si escludono a vicenda.

### `ERR_TLS_CERT_ALTNAME_FORMAT` {#err_tls_cert_altname_format}

Questo errore viene generato da `checkServerIdentity` se una proprietà `subjectaltname` fornita dall'utente viola le regole di codifica. Gli oggetti certificato prodotti da Node.js stesso sono sempre conformi alle regole di codifica e non causano mai questo errore.

### `ERR_TLS_CERT_ALTNAME_INVALID` {#err_tls_cert_altname_invalid}

Durante l'utilizzo di TLS, il nome host/IP del peer non corrisponde a nessuno dei `subjectAltNames` nel suo certificato.

### `ERR_TLS_DH_PARAM_SIZE` {#err_tls_dh_param_size}

Durante l'utilizzo di TLS, il parametro offerto per il protocollo di key-agreement Diffie-Hellman (`DH`) è troppo piccolo. Per impostazione predefinita, la lunghezza della chiave deve essere maggiore o uguale a 1024 bit per evitare vulnerabilità, anche se è fortemente consigliato utilizzare 2048 bit o più per una maggiore sicurezza.


### `ERR_TLS_HANDSHAKE_TIMEOUT` {#err_tls_handshake_timeout}

Un handshake TLS/SSL è scaduto. In questo caso, anche il server deve interrompere la connessione.

### `ERR_TLS_INVALID_CONTEXT` {#err_tls_invalid_context}

**Aggiunto in: v13.3.0**

Il contesto deve essere un `SecureContext`.

### `ERR_TLS_INVALID_PROTOCOL_METHOD` {#err_tls_invalid_protocol_method}

Il metodo `secureProtocol` specificato non è valido. O è sconosciuto o è disabilitato perché non è sicuro.

### `ERR_TLS_INVALID_PROTOCOL_VERSION` {#err_tls_invalid_protocol_version}

Le versioni del protocollo TLS valide sono `'TLSv1'`, `'TLSv1.1'` o `'TLSv1.2'`.

### `ERR_TLS_INVALID_STATE` {#err_tls_invalid_state}

**Aggiunto in: v13.10.0, v12.17.0**

Il socket TLS deve essere connesso e stabilito in modo sicuro. Assicurati che l'evento 'secure' venga emesso prima di continuare.

### `ERR_TLS_PROTOCOL_VERSION_CONFLICT` {#err_tls_protocol_version_conflict}

Il tentativo di impostare una versione TLS `minVersion` o `maxVersion` è in conflitto con un tentativo di impostare esplicitamente `secureProtocol`. Utilizzare un meccanismo o l'altro.

### `ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED` {#err_tls_psk_set_identity_hint_failed}

Impossibile impostare il suggerimento per l'identità PSK. Il suggerimento potrebbe essere troppo lungo.

### `ERR_TLS_RENEGOTIATION_DISABLED` {#err_tls_renegotiation_disabled}

È stato effettuato un tentativo di rinegoziare TLS su un'istanza socket con la rinegoziazione disabilitata.

### `ERR_TLS_REQUIRED_SERVER_NAME` {#err_tls_required_server_name}

Durante l'utilizzo di TLS, il metodo `server.addContext()` è stato chiamato senza fornire un nome host nel primo parametro.

### `ERR_TLS_SESSION_ATTACK` {#err_tls_session_attack}

Viene rilevata una quantità eccessiva di rinegoziazioni TLS, che è un potenziale vettore per attacchi denial-of-service.

### `ERR_TLS_SNI_FROM_SERVER` {#err_tls_sni_from_server}

È stato effettuato un tentativo di emettere Server Name Indication da un socket TLS lato server, il che è valido solo da un client.

### `ERR_TRACE_EVENTS_CATEGORY_REQUIRED` {#err_trace_events_category_required}

Il metodo `trace_events.createTracing()` richiede almeno una categoria di eventi di traccia.

### `ERR_TRACE_EVENTS_UNAVAILABLE` {#err_trace_events_unavailable}

Il modulo `node:trace_events` non è stato caricato perché Node.js è stato compilato con il flag `--without-v8-platform`.

### `ERR_TRANSFORM_ALREADY_TRANSFORMING` {#err_transform_already_transforming}

Uno stream `Transform` è terminato mentre era ancora in trasformazione.

### `ERR_TRANSFORM_WITH_LENGTH_0` {#err_transform_with_length_0}

Uno stream `Transform` è terminato con dati ancora nel buffer di scrittura.


### `ERR_TTY_INIT_FAILED` {#err_tty_init_failed}

L'inizializzazione di un TTY è fallita a causa di un errore di sistema.

### `ERR_UNAVAILABLE_DURING_EXIT` {#err_unavailable_during_exit}

La funzione è stata chiamata all'interno di un gestore [`process.on('exit')`](/it/nodejs/api/process#event-exit) che non dovrebbe essere chiamato all'interno del gestore [`process.on('exit')`](/it/nodejs/api/process#event-exit).

### `ERR_UNCAUGHT_EXCEPTION_CAPTURE_ALREADY_SET` {#err_uncaught_exception_capture_already_set}

[`process.setUncaughtExceptionCaptureCallback()`](/it/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) è stato chiamato due volte, senza prima reimpostare il callback a `null`.

Questo errore è progettato per impedire la sovrascrittura accidentale di un callback registrato da un altro modulo.

### `ERR_UNESCAPED_CHARACTERS` {#err_unescaped_characters}

È stata ricevuta una stringa contenente caratteri non sottoposti a escape.

### `ERR_UNHANDLED_ERROR` {#err_unhandled_error}

Si è verificato un errore non gestito (ad esempio, quando un evento `'error'` viene emesso da un [`EventEmitter`](/it/nodejs/api/events#class-eventemitter) ma un gestore `'error'` non è registrato).

### `ERR_UNKNOWN_BUILTIN_MODULE` {#err_unknown_builtin_module}

Utilizzato per identificare un tipo specifico di errore interno di Node.js che non dovrebbe essere normalmente attivato dal codice utente. Le istanze di questo errore puntano a un bug interno all'interno dello stesso binario di Node.js.

### `ERR_UNKNOWN_CREDENTIAL` {#err_unknown_credential}

È stato passato un identificatore di gruppo o utente Unix inesistente.

### `ERR_UNKNOWN_ENCODING` {#err_unknown_encoding}

Un'opzione di codifica non valida o sconosciuta è stata passata a un'API.

### `ERR_UNKNOWN_FILE_EXTENSION` {#err_unknown_file_extension}

::: warning [Stable: 1 - Sperimentale]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

È stato fatto un tentativo di caricare un modulo con un'estensione di file sconosciuta o non supportata.

### `ERR_UNKNOWN_MODULE_FORMAT` {#err_unknown_module_format}

::: warning [Stable: 1 - Sperimentale]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

È stato fatto un tentativo di caricare un modulo con un formato sconosciuto o non supportato.

### `ERR_UNKNOWN_SIGNAL` {#err_unknown_signal}

Un segnale di processo non valido o sconosciuto è stato passato a un'API che si aspetta un segnale valido (come [`subprocess.kill()`](/it/nodejs/api/child_process#subprocesskillsignal)).


### `ERR_UNSUPPORTED_DIR_IMPORT` {#err_unsupported_dir_import}

L'istruzione `import` di un URL di directory non è supportata. Invece, [fai riferimento a un pacchetto utilizzando il suo nome](/it/nodejs/api/packages#self-referencing-a-package-using-its-name) e [definisci un subpath personalizzato](/it/nodejs/api/packages#subpath-exports) nel campo [`"exports"`](/it/nodejs/api/packages#exports) del file [`package.json`](/it/nodejs/api/packages#nodejs-packagejson-field-definitions).

```js [ESM]
import './'; // non supportato
import './index.js'; // supportato
import 'package-name'; // supportato
```
### `ERR_UNSUPPORTED_ESM_URL_SCHEME` {#err_unsupported_esm_url_scheme}

L'istruzione `import` con schemi URL diversi da `file` e `data` non è supportata.

### `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` {#err_unsupported_node_modules_type_stripping}

**Aggiunto in: v22.6.0**

La rimozione del tipo non è supportata per i file discendenti da una directory `node_modules`.

### `ERR_UNSUPPORTED_RESOLVE_REQUEST` {#err_unsupported_resolve_request}

È stato fatto un tentativo di risolvere un riferimento a un modulo non valido. Ciò può accadere quando si importa o si chiama `import.meta.resolve()` con:

- uno specificatore nudo che non è un modulo integrato da un modulo il cui schema URL non è `file`.
- un [URL relativo](https://url.spec.whatwg.org/#relative-url-string) da un modulo il cui schema URL non è uno [schema speciale](https://url.spec.whatwg.org/#special-scheme).

```js [ESM]
try {
  // Tentativo di importare il pacchetto 'bare-specifier' da un modulo URL `data:`:
  await import('data:text/javascript,import "bare-specifier"');
} catch (e) {
  console.log(e.code); // ERR_UNSUPPORTED_RESOLVE_REQUEST
}
```
### `ERR_USE_AFTER_CLOSE` {#err_use_after_close}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

È stato fatto un tentativo di utilizzare qualcosa che era già stato chiuso.

### `ERR_VALID_PERFORMANCE_ENTRY_TYPE` {#err_valid_performance_entry_type}

Durante l'utilizzo dell'API Performance Timing (`perf_hooks`), non vengono trovati tipi di voci di performance validi.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` {#err_vm_dynamic_import_callback_missing}

Non è stata specificata una callback di importazione dinamica.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` {#err_vm_dynamic_import_callback_missing_flag}

È stata invocata una callback di importazione dinamica senza `--experimental-vm-modules`.


### `ERR_VM_MODULE_ALREADY_LINKED` {#err_vm_module_already_linked}

Il modulo che si è tentato di collegare non è idoneo al collegamento, per uno dei seguenti motivi:

- È già stato collegato (`linkingStatus` è `'linked'`)
- È in fase di collegamento (`linkingStatus` è `'linking'`)
- Il collegamento non è riuscito per questo modulo (`linkingStatus` è `'errored'`)

### `ERR_VM_MODULE_CACHED_DATA_REJECTED` {#err_vm_module_cached_data_rejected}

L'opzione `cachedData` passata a un costruttore di modulo non è valida.

### `ERR_VM_MODULE_CANNOT_CREATE_CACHED_DATA` {#err_vm_module_cannot_create_cached_data}

Non è possibile creare dati memorizzati nella cache per i moduli che sono già stati valutati.

### `ERR_VM_MODULE_DIFFERENT_CONTEXT` {#err_vm_module_different_context}

Il modulo restituito dalla funzione di collegamento proviene da un contesto diverso rispetto al modulo padre. I moduli collegati devono condividere lo stesso contesto.

### `ERR_VM_MODULE_LINK_FAILURE` {#err_vm_module_link_failure}

Il modulo non è stato collegato a causa di un errore.

### `ERR_VM_MODULE_NOT_MODULE` {#err_vm_module_not_module}

Il valore soddisfatto di una promessa di collegamento non è un oggetto `vm.Module`.

### `ERR_VM_MODULE_STATUS` {#err_vm_module_status}

Lo stato attuale del modulo non consente questa operazione. Il significato specifico dell'errore dipende dalla funzione specifica.

### `ERR_WASI_ALREADY_STARTED` {#err_wasi_already_started}

L'istanza WASI è già stata avviata.

### `ERR_WASI_NOT_STARTED` {#err_wasi_not_started}

L'istanza WASI non è stata avviata.

### `ERR_WEBASSEMBLY_RESPONSE` {#err_webassembly_response}

**Aggiunto in: v18.1.0**

La `Response` che è stata passata a `WebAssembly.compileStreaming` o a `WebAssembly.instantiateStreaming` non è una risposta WebAssembly valida.

### `ERR_WORKER_INIT_FAILED` {#err_worker_init_failed}

L'inizializzazione di `Worker` non è riuscita.

### `ERR_WORKER_INVALID_EXEC_ARGV` {#err_worker_invalid_exec_argv}

L'opzione `execArgv` passata al costruttore `Worker` contiene flag non validi.

### `ERR_WORKER_MESSAGING_ERRORED` {#err_worker_messaging_errored}

**Aggiunto in: v22.5.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

Il thread di destinazione ha generato un errore durante l'elaborazione di un messaggio inviato tramite [`postMessageToThread()`](/it/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).


### `ERR_WORKER_MESSAGING_FAILED` {#err_worker_messaging_failed}

**Aggiunto in: v22.5.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

Il thread richiesto in [`postMessageToThread()`](/it/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) non è valido o non ha un listener `workerMessage`.

### `ERR_WORKER_MESSAGING_SAME_THREAD` {#err_worker_messaging_same_thread}

**Aggiunto in: v22.5.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

L'ID del thread richiesto in [`postMessageToThread()`](/it/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) è l'ID del thread corrente.

### `ERR_WORKER_MESSAGING_TIMEOUT` {#err_worker_messaging_timeout}

**Aggiunto in: v22.5.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

L'invio di un messaggio tramite [`postMessageToThread()`](/it/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) è scaduto.

### `ERR_WORKER_NOT_RUNNING` {#err_worker_not_running}

Un'operazione non è riuscita perché l'istanza `Worker` non è attualmente in esecuzione.

### `ERR_WORKER_OUT_OF_MEMORY` {#err_worker_out_of_memory}

L'istanza `Worker` è terminata perché ha raggiunto il suo limite di memoria.

### `ERR_WORKER_PATH` {#err_worker_path}

Il percorso per lo script principale di un worker non è né un percorso assoluto né un percorso relativo che inizia con `./` o `../`.

### `ERR_WORKER_UNSERIALIZABLE_ERROR` {#err_worker_unserializable_error}

Tutti i tentativi di serializzare un'eccezione non catturata da un thread worker sono falliti.

### `ERR_WORKER_UNSUPPORTED_OPERATION` {#err_worker_unsupported_operation}

La funzionalità richiesta non è supportata nei thread worker.

### `ERR_ZLIB_INITIALIZATION_FAILED` {#err_zlib_initialization_failed}

La creazione di un oggetto [`zlib`](/it/nodejs/api/zlib) non è riuscita a causa di una configurazione errata.

### `HPE_CHUNK_EXTENSIONS_OVERFLOW` {#hpe_chunk_extensions_overflow}

**Aggiunto in: v21.6.2, v20.11.1, v18.19.1**

Sono stati ricevuti troppi dati per un'estensione di chunk. Al fine di proteggere da client dannosi o mal configurati, se vengono ricevuti più di 16 KiB di dati, verrà emesso un `Error` con questo codice.


### `HPE_HEADER_OVERFLOW` {#hpe_header_overflow}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.4.0, v10.15.0 | La dimensione massima dell'header in `http_parser` è stata impostata a 8 KiB. |
:::

Sono stati ricevuti troppi dati nell'header HTTP. Per proteggersi da client malevoli o mal configurati, se viene ricevuta una quantità di dati nell'header HTTP superiore a `maxHeaderSize`, l'analisi HTTP verrà interrotta senza che venga creato un oggetto di richiesta o risposta, e verrà emesso un `Error` con questo codice.

### `HPE_UNEXPECTED_CONTENT_LENGTH` {#hpe_unexpected_content_length}

Il server sta inviando sia un header `Content-Length` che `Transfer-Encoding: chunked`.

`Transfer-Encoding: chunked` consente al server di mantenere una connessione HTTP persistente per contenuti generati dinamicamente. In questo caso, l'header HTTP `Content-Length` non può essere utilizzato.

Utilizzare `Content-Length` o `Transfer-Encoding: chunked`.

### `MODULE_NOT_FOUND` {#module_not_found}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Aggiunta la proprietà `requireStack`. |
:::

Un file modulo non è stato risolto dal loader dei moduli CommonJS durante un'operazione [`require()`](/it/nodejs/api/modules#requireid) o durante il caricamento del punto di ingresso del programma.

## Codici di errore legacy di Node.js {#legacy-nodejs-error-codes}

::: danger [Stabile: 0 - Obsoleto]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Obsoleto. Questi codici di errore sono incoerenti o sono stati rimossi.
:::

### `ERR_CANNOT_TRANSFER_OBJECT` {#err_cannot_transfer_object}

**Aggiunto in: v10.5.0**

**Rimosso in: v12.5.0**

Il valore passato a `postMessage()` conteneva un oggetto che non è supportato per il trasferimento.

### `ERR_CPU_USAGE` {#err_cpu_usage}

**Rimosso in: v15.0.0**

La chiamata nativa da `process.cpuUsage` non poteva essere elaborata.

### `ERR_CRYPTO_HASH_DIGEST_NO_UTF16` {#err_crypto_hash_digest_no_utf16}

**Aggiunto in: v9.0.0**

**Rimosso in: v12.12.0**

La codifica UTF-16 è stata utilizzata con [`hash.digest()`](/it/nodejs/api/crypto#hashdigestencoding). Mentre il metodo `hash.digest()` consente di passare un argomento `encoding`, facendo sì che il metodo restituisca una stringa anziché un `Buffer`, la codifica UTF-16 (ad esempio `ucs` o `utf16le`) non è supportata.


### `ERR_CRYPTO_SCRYPT_INVALID_PARAMETER` {#err_crypto_scrypt_invalid_parameter}

**Rimossa in: v23.0.0**

Una combinazione incompatibile di opzioni è stata passata a [`crypto.scrypt()`](/it/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) o [`crypto.scryptSync()`](/it/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options). Le nuove versioni di Node.js utilizzano invece il codice di errore [`ERR_INCOMPATIBLE_OPTION_PAIR`](/it/nodejs/api/errors#err_incompatible_option_pair), che è coerente con altre API.

### `ERR_FS_INVALID_SYMLINK_TYPE` {#err_fs_invalid_symlink_type}

**Rimossa in: v23.0.0**

Un tipo di symlink non valido è stato passato ai metodi [`fs.symlink()`](/it/nodejs/api/fs#fssymlinktarget-path-type-callback) o [`fs.symlinkSync()`](/it/nodejs/api/fs#fssymlinksynctarget-path-type).

### `ERR_HTTP2_FRAME_ERROR` {#err_http2_frame_error}

**Aggiunta in: v9.0.0**

**Rimossa in: v10.0.0**

Utilizzata quando si verifica un errore durante l'invio di un singolo frame sulla sessione HTTP/2.

### `ERR_HTTP2_HEADERS_OBJECT` {#err_http2_headers_object}

**Aggiunta in: v9.0.0**

**Rimossa in: v10.0.0**

Utilizzata quando è previsto un Oggetto Header HTTP/2.

### `ERR_HTTP2_HEADER_REQUIRED` {#err_http2_header_required}

**Aggiunta in: v9.0.0**

**Rimossa in: v10.0.0**

Utilizzata quando manca un header richiesto in un messaggio HTTP/2.

### `ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND` {#err_http2_info_headers_after_respond}

**Aggiunta in: v9.0.0**

**Rimossa in: v10.0.0**

Gli header informativi HTTP/2 devono essere inviati *prima* di chiamare il metodo `Http2Stream.prototype.respond()`.

### `ERR_HTTP2_STREAM_CLOSED` {#err_http2_stream_closed}

**Aggiunta in: v9.0.0**

**Rimossa in: v10.0.0**

Utilizzata quando un'azione è stata eseguita su un flusso HTTP/2 che è già stato chiuso.

### `ERR_HTTP_INVALID_CHAR` {#err_http_invalid_char}

**Aggiunta in: v9.0.0**

**Rimossa in: v10.0.0**

Utilizzata quando viene trovato un carattere non valido in un messaggio di stato di risposta HTTP (reason phrase).

### `ERR_IMPORT_ASSERTION_TYPE_FAILED` {#err_import_assertion_type_failed}

**Aggiunta in: v17.1.0, v16.14.0**

**Rimossa in: v21.1.0**

Un'asserzione di importazione non è riuscita, impedendo l'importazione del modulo specificato.

### `ERR_IMPORT_ASSERTION_TYPE_MISSING` {#err_import_assertion_type_missing}

**Aggiunta in: v17.1.0, v16.14.0**

**Rimossa in: v21.1.0**

Manca un'asserzione di importazione, impedendo l'importazione del modulo specificato.


### `ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED` {#err_import_assertion_type_unsupported}

**Aggiunto in: v17.1.0, v16.14.0**

**Rimosso in: v21.1.0**

Un attributo di importazione non è supportato da questa versione di Node.js.

### `ERR_INDEX_OUT_OF_RANGE` {#err_index_out_of_range}

**Aggiunto in: v10.0.0**

**Rimosso in: v11.0.0**

Un indice dato era al di fuori dell'intervallo accettato (ad esempio, offset negativi).

### `ERR_INVALID_OPT_VALUE` {#err_invalid_opt_value}

**Aggiunto in: v8.0.0**

**Rimosso in: v15.0.0**

Un valore non valido o inatteso è stato passato in un oggetto di opzioni.

### `ERR_INVALID_OPT_VALUE_ENCODING` {#err_invalid_opt_value_encoding}

**Aggiunto in: v9.0.0**

**Rimosso in: v15.0.0**

È stata passata una codifica di file non valida o sconosciuta.

### `ERR_INVALID_PERFORMANCE_MARK` {#err_invalid_performance_mark}

**Aggiunto in: v8.5.0**

**Rimosso in: v16.7.0**

Durante l'utilizzo dell'API Performance Timing (`perf_hooks`), un contrassegno di performance non è valido.

### `ERR_INVALID_TRANSFER_OBJECT` {#err_invalid_transfer_object}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0 | Viene generata una `DOMException`. |
| v21.0.0 | Rimosso in: v21.0.0 |
:::

Un oggetto di trasferimento non valido è stato passato a `postMessage()`.

### `ERR_MANIFEST_ASSERT_INTEGRITY` {#err_manifest_assert_integrity}

**Rimosso in: v22.2.0**

È stato effettuato un tentativo di caricare una risorsa, ma la risorsa non corrispondeva all'integrità definita dal manifest della politica. Consultare la documentazione per i manifest della politica per ulteriori informazioni.

### `ERR_MANIFEST_DEPENDENCY_MISSING` {#err_manifest_dependency_missing}

**Rimosso in: v22.2.0**

È stato effettuato un tentativo di caricare una risorsa, ma la risorsa non era elencata come dipendenza dalla posizione che ha tentato di caricarla. Consultare la documentazione per i manifest della politica per ulteriori informazioni.

### `ERR_MANIFEST_INTEGRITY_MISMATCH` {#err_manifest_integrity_mismatch}

**Rimosso in: v22.2.0**

È stato effettuato un tentativo di caricare un manifest della politica, ma il manifest aveva più voci per una risorsa che non corrispondevano tra loro. Aggiornare le voci del manifest in modo che corrispondano per risolvere questo errore. Consultare la documentazione per i manifest della politica per ulteriori informazioni.

### `ERR_MANIFEST_INVALID_RESOURCE_FIELD` {#err_manifest_invalid_resource_field}

**Rimosso in: v22.2.0**

Una risorsa di un manifest della politica aveva un valore non valido per uno dei suoi campi. Aggiornare la voce del manifest in modo che corrisponda per risolvere questo errore. Consultare la documentazione per i manifest della politica per ulteriori informazioni.


### `ERR_MANIFEST_INVALID_SPECIFIER` {#err_manifest_invalid_specifier}

**Rimossa in: v22.2.0**

Una risorsa del manifest dei criteri aveva un valore non valido per una delle sue mappature di dipendenza. Aggiorna la voce del manifest per risolvere questo errore. Consulta la documentazione per i manifest dei criteri per maggiori informazioni.

### `ERR_MANIFEST_PARSE_POLICY` {#err_manifest_parse_policy}

**Rimossa in: v22.2.0**

È stato fatto un tentativo di caricare un manifest dei criteri, ma il manifest non è stato in grado di essere analizzato. Consulta la documentazione per i manifest dei criteri per maggiori informazioni.

### `ERR_MANIFEST_TDZ` {#err_manifest_tdz}

**Rimossa in: v22.2.0**

È stato fatto un tentativo di leggere da un manifest dei criteri, ma l'inizializzazione del manifest non è ancora avvenuta. Questo è probabilmente un bug in Node.js.

### `ERR_MANIFEST_UNKNOWN_ONERROR` {#err_manifest_unknown_onerror}

**Rimossa in: v22.2.0**

È stato caricato un manifest dei criteri, ma aveva un valore sconosciuto per il suo comportamento "onerror". Consulta la documentazione per i manifest dei criteri per maggiori informazioni.

### `ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST` {#err_missing_message_port_in_transfer_list}

**Rimossa in: v15.0.0**

Questo codice di errore è stato sostituito da [`ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST`](/it/nodejs/api/errors#err_missing_transferable_in_transfer_list) in Node.js v15.0.0, perché non è più accurato dato che ora esistono anche altri tipi di oggetti trasferibili.

### `ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST` {#err_missing_transferable_in_transfer_list}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0 | Viene lanciata una `DOMException`. |
| v21.0.0 | Rimossa in: v21.0.0 |
| v15.0.0 | Aggiunta in: v15.0.0 |
:::

Un oggetto che deve essere esplicitamente elencato nell'argomento `transferList` si trova nell'oggetto passato a una chiamata [`postMessage()`](/it/nodejs/api/worker_threads#portpostmessagevalue-transferlist), ma non è fornito nel `transferList` per quella chiamata. Di solito, questo è un `MessagePort`.

Nelle versioni di Node.js precedenti alla v15.0.0, il codice di errore utilizzato qui era [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/it/nodejs/api/errors#err_missing_message_port_in_transfer_list). Tuttavia, l'insieme dei tipi di oggetti trasferibili è stato ampliato per coprire più tipi di `MessagePort`.

### `ERR_NAPI_CONS_PROTOTYPE_OBJECT` {#err_napi_cons_prototype_object}

**Aggiunta in: v9.0.0**

**Rimossa in: v10.0.0**

Utilizzato da `Node-API` quando `Constructor.prototype` non è un oggetto.


### `ERR_NAPI_TSFN_START_IDLE_LOOP` {#err_napi_tsfn_start_idle_loop}

**Aggiunto in: v10.6.0, v8.16.0**

**Rimosso in: v14.2.0, v12.17.0**

Sul thread principale, i valori vengono rimossi dalla coda associata alla funzione thread-safe in un ciclo inattivo. Questo errore indica che si è verificato un errore durante il tentativo di avviare il ciclo.

### `ERR_NAPI_TSFN_STOP_IDLE_LOOP` {#err_napi_tsfn_stop_idle_loop}

**Aggiunto in: v10.6.0, v8.16.0**

**Rimosso in: v14.2.0, v12.17.0**

Una volta che non ci sono più elementi nella coda, il ciclo inattivo deve essere sospeso. Questo errore indica che il ciclo inattivo non è riuscito a fermarsi.

### `ERR_NO_LONGER_SUPPORTED` {#err_no_longer_supported}

Un'API Node.js è stata chiamata in modo non supportato, come `Buffer.write(string, encoding, offset[, length])`.

### `ERR_OUTOFMEMORY` {#err_outofmemory}

**Aggiunto in: v9.0.0**

**Rimosso in: v10.0.0**

Utilizzato genericamente per identificare che un'operazione ha causato una condizione di memoria insufficiente.

### `ERR_PARSE_HISTORY_DATA` {#err_parse_history_data}

**Aggiunto in: v9.0.0**

**Rimosso in: v10.0.0**

Il modulo `node:repl` non è stato in grado di analizzare i dati dal file di cronologia REPL.

### `ERR_SOCKET_CANNOT_SEND` {#err_socket_cannot_send}

**Aggiunto in: v9.0.0**

**Rimosso in: v14.0.0**

I dati non possono essere inviati su un socket.

### `ERR_STDERR_CLOSE` {#err_stderr_close}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.12.0 | Invece di emettere un errore, `process.stderr.end()` ora chiude solo il lato del flusso ma non la risorsa sottostante, rendendo obsoleto questo errore. |
| v10.12.0 | Rimosso in: v10.12.0 |
:::

È stato fatto un tentativo di chiudere il flusso `process.stderr`. Per progettazione, Node.js non consente la chiusura dei flussi `stdout` o `stderr` da parte del codice utente.

### `ERR_STDOUT_CLOSE` {#err_stdout_close}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.12.0 | Invece di emettere un errore, `process.stderr.end()` ora chiude solo il lato del flusso ma non la risorsa sottostante, rendendo obsoleto questo errore. |
| v10.12.0 | Rimosso in: v10.12.0 |
:::

È stato fatto un tentativo di chiudere il flusso `process.stdout`. Per progettazione, Node.js non consente la chiusura dei flussi `stdout` o `stderr` da parte del codice utente.

### `ERR_STREAM_READ_NOT_IMPLEMENTED` {#err_stream_read_not_implemented}

**Aggiunto in: v9.0.0**

**Rimosso in: v10.0.0**

Utilizzato quando si tenta di utilizzare un flusso leggibile che non ha implementato [`readable._read()`](/it/nodejs/api/stream#readable_readsize).


### `ERR_TLS_RENEGOTIATION_FAILED` {#err_tls_renegotiation_failed}

**Aggiunto in: v9.0.0**

**Rimosso in: v10.0.0**

Usato quando una richiesta di rinegoziazione TLS è fallita in modo non specifico.

### `ERR_TRANSFERRING_EXTERNALIZED_SHAREDARRAYBUFFER` {#err_transferring_externalized_sharedarraybuffer}

**Aggiunto in: v10.5.0**

**Rimosso in: v14.0.0**

Un `SharedArrayBuffer` la cui memoria non è gestita dal motore JavaScript o da Node.js è stato incontrato durante la serializzazione. Un tale `SharedArrayBuffer` non può essere serializzato.

Questo può accadere solo quando gli addon nativi creano `SharedArrayBuffer` in modalità "esterna", o mettono `SharedArrayBuffer` esistenti in modalità esterna.

### `ERR_UNKNOWN_STDIN_TYPE` {#err_unknown_stdin_type}

**Aggiunto in: v8.0.0**

**Rimosso in: v11.7.0**

È stato fatto un tentativo di avviare un processo Node.js con un tipo di file `stdin` sconosciuto. Questo errore è solitamente un'indicazione di un bug all'interno di Node.js stesso, sebbene sia possibile che il codice utente lo attivi.

### `ERR_UNKNOWN_STREAM_TYPE` {#err_unknown_stream_type}

**Aggiunto in: v8.0.0**

**Rimosso in: v11.7.0**

È stato fatto un tentativo di avviare un processo Node.js con un tipo di file `stdout` o `stderr` sconosciuto. Questo errore è solitamente un'indicazione di un bug all'interno di Node.js stesso, sebbene sia possibile che il codice utente lo attivi.

### `ERR_V8BREAKITERATOR` {#err_v8breakiterator}

L'API V8 `BreakIterator` è stata utilizzata ma il set di dati ICU completo non è installato.

### `ERR_VALUE_OUT_OF_RANGE` {#err_value_out_of_range}

**Aggiunto in: v9.0.0**

**Rimosso in: v10.0.0**

Usato quando un determinato valore è al di fuori dell'intervallo accettato.

### `ERR_VM_MODULE_LINKING_ERRORED` {#err_vm_module_linking_errored}

**Aggiunto in: v10.0.0**

**Rimosso in: v18.1.0, v16.17.0**

La funzione linker ha restituito un modulo per il quale il collegamento è fallito.

### `ERR_VM_MODULE_NOT_LINKED` {#err_vm_module_not_linked}

Il modulo deve essere collegato correttamente prima dell'istanza.

### `ERR_WORKER_UNSUPPORTED_EXTENSION` {#err_worker_unsupported_extension}

**Aggiunto in: v11.0.0**

**Rimosso in: v16.9.0**

Il percorso utilizzato per lo script principale di un worker ha un'estensione di file sconosciuta.

### `ERR_ZLIB_BINDING_CLOSED` {#err_zlib_binding_closed}

**Aggiunto in: v9.0.0**

**Rimosso in: v10.0.0**

Usato quando si tenta di utilizzare un oggetto `zlib` dopo che è già stato chiuso.


## Codici di Errore OpenSSL {#openssl-error-codes}

### Errori di Validità Temporale {#time-validity-errors}

#### `CERT_NOT_YET_VALID` {#cert_not_yet_valid}

Il certificato non è ancora valido: la data notBefore è successiva all'ora corrente.

#### `CERT_HAS_EXPIRED` {#cert_has_expired}

Il certificato è scaduto: la data notAfter è precedente all'ora corrente.

#### `CRL_NOT_YET_VALID` {#crl_not_yet_valid}

La lista di revoca dei certificati (CRL) ha una data di emissione futura.

#### `CRL_HAS_EXPIRED` {#crl_has_expired}

La lista di revoca dei certificati (CRL) è scaduta.

#### `CERT_REVOKED` {#cert_revoked}

Il certificato è stato revocato; si trova in una lista di revoca dei certificati (CRL).

### Errori Relativi alla Fiducia o alla Catena {#trust-or-chain-related-errors}

#### `UNABLE_TO_GET_ISSUER_CERT` {#unable_to_get_issuer_cert}

Non è stato possibile trovare il certificato dell'emittente di un certificato ricercato. Normalmente questo significa che l'elenco dei certificati attendibili non è completo.

#### `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` {#unable_to_get_issuer_cert_locally}

L'emittente del certificato non è noto. Questo è il caso se l'emittente non è incluso nell'elenco dei certificati attendibili.

#### `DEPTH_ZERO_SELF_SIGNED_CERT` {#depth_zero_self_signed_cert}

Il certificato passato è autofirmato e lo stesso certificato non può essere trovato nell'elenco dei certificati attendibili.

#### `SELF_SIGNED_CERT_IN_CHAIN` {#self_signed_cert_in_chain}

L'emittente del certificato non è noto. Questo è il caso se l'emittente non è incluso nell'elenco dei certificati attendibili.

#### `CERT_CHAIN_TOO_LONG` {#cert_chain_too_long}

La lunghezza della catena di certificati è maggiore della profondità massima.

#### `UNABLE_TO_GET_CRL` {#unable_to_get_crl}

Non è stato possibile trovare il riferimento CRL fornito dal certificato.

#### `UNABLE_TO_VERIFY_LEAF_SIGNATURE` {#unable_to_verify_leaf_signature}

Nessuna firma può essere verificata perché la catena contiene un solo certificato e non è autofirmato.

#### `CERT_UNTRUSTED` {#cert_untrusted}

L'autorità di certificazione (CA) radice non è contrassegnata come attendibile per lo scopo specificato.

### Errori di Estensione di Base {#basic-extension-errors}

#### `INVALID_CA` {#invalid_ca}

Un certificato CA non è valido. O non è una CA oppure le sue estensioni non sono coerenti con lo scopo fornito.

#### `PATH_LENGTH_EXCEEDED` {#path_length_exceeded}

Il parametro pathlength basicConstraints è stato superato.

### Errori Relativi al Nome {#name-related-errors}

#### `HOSTNAME_MISMATCH` {#hostname_mismatch}

Il certificato non corrisponde al nome fornito.

### Errori Relativi all'Utilizzo e alle Politiche {#usage-and-policy-errors}


#### `INVALID_PURPOSE` {#invalid_purpose}

Il certificato fornito non può essere utilizzato per lo scopo specificato.

#### `CERT_REJECTED` {#cert_rejected}

La CA radice è contrassegnata per rifiutare lo scopo specificato.

### Errori di Formattazione {#formatting-errors}

#### `CERT_SIGNATURE_FAILURE` {#cert_signature_failure}

La firma del certificato non è valida.

#### `CRL_SIGNATURE_FAILURE` {#crl_signature_failure}

La firma della lista di revoca dei certificati (CRL) non è valida.

#### `ERROR_IN_CERT_NOT_BEFORE_FIELD` {#error_in_cert_not_before_field}

Il campo notBefore del certificato contiene un orario non valido.

#### `ERROR_IN_CERT_NOT_AFTER_FIELD` {#error_in_cert_not_after_field}

Il campo notAfter del certificato contiene un orario non valido.

#### `ERROR_IN_CRL_LAST_UPDATE_FIELD` {#error_in_crl_last_update_field}

Il campo lastUpdate della CRL contiene un orario non valido.

#### `ERROR_IN_CRL_NEXT_UPDATE_FIELD` {#error_in_crl_next_update_field}

Il campo nextUpdate della CRL contiene un orario non valido.

#### `UNABLE_TO_DECRYPT_CERT_SIGNATURE` {#unable_to_decrypt_cert_signature}

La firma del certificato non può essere decrittografata. Ciò significa che il valore effettivo della firma non può essere determinato piuttosto che non corrisponda al valore previsto, questo è significativo solo per le chiavi RSA.

#### `UNABLE_TO_DECRYPT_CRL_SIGNATURE` {#unable_to_decrypt_crl_signature}

La firma della lista di revoca dei certificati (CRL) non può essere decrittografata: ciò significa che il valore effettivo della firma non può essere determinato piuttosto che non corrisponda al valore previsto.

#### `UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY` {#unable_to_decode_issuer_public_key}

La chiave pubblica in SubjectPublicKeyInfo del certificato non può essere letta.

### Altri Errori OpenSSL {#other-openssl-errors}

#### `OUT_OF_MEM` {#out_of_mem}

Si è verificato un errore durante il tentativo di allocare memoria. Questo non dovrebbe mai accadere.

