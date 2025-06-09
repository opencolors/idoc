---
title: Comprendere la pressione di retroceso nei flussi Node.js
description: Imparare a implementare flussi Readable e Writable personalizzati in Node.js mentre si rispetta la pressione di retrocesso per garantire un flusso di dati efficiente ed evitare trappole comuni.
head:
  - - meta
    - name: og:title
      content: Comprendere la pressione di retroceso nei flussi Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Imparare a implementare flussi Readable e Writable personalizzati in Node.js mentre si rispetta la pressione di retrocesso per garantire un flusso di dati efficiente ed evitare trappole comuni.
  - - meta
    - name: twitter:title
      content: Comprendere la pressione di retroceso nei flussi Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Imparare a implementare flussi Readable e Writable personalizzati in Node.js mentre si rispetta la pressione di retrocesso per garantire un flusso di dati efficiente ed evitare trappole comuni.
---


# Backpressure negli Stream

Si verifica un problema generale durante la gestione dei dati chiamato backpressure e descrive un accumulo di dati dietro un buffer durante il trasferimento dei dati. Quando l'estremità ricevente del trasferimento ha operazioni complesse o è più lenta per qualsiasi motivo, c'è una tendenza all'accumulo di dati dalla sorgente in entrata, come un intasamento.

Per risolvere questo problema, deve essere presente un sistema di delega per garantire un flusso regolare di dati da una sorgente all'altra. Diverse community hanno risolto questo problema in modo univoco per i loro programmi, le pipe Unix e i socket TCP sono buoni esempi di questo e sono spesso indicati come controllo del flusso. In Node.js, gli stream sono stati la soluzione adottata.

Lo scopo di questa guida è di descrivere ulteriormente cos'è il backpressure e come esattamente gli stream lo affrontano nel codice sorgente di Node.js. La seconda parte della guida introdurrà le migliori pratiche suggerite per garantire che il codice della tua applicazione sia sicuro e ottimizzato quando implementi gli stream.

Si presume una certa familiarità con la definizione generale di `backpressure`, `Buffer` e `EventEmitters` in Node.js, nonché una certa esperienza con `Stream`. Se non hai letto quei documenti, non è una cattiva idea dare prima un'occhiata alla [documentazione dell'API](/it/nodejs/api/stream), poiché ti aiuterà ad ampliare la tua comprensione durante la lettura di questa guida.

## Il problema con la gestione dei dati

In un sistema informatico, i dati vengono trasferiti da un processo all'altro tramite pipe, socket e segnali. In Node.js, troviamo un meccanismo simile chiamato `Stream`. Gli stream sono fantastici! Fanno così tanto per Node.js e quasi ogni parte del codebase interno utilizza quel modulo. Come sviluppatore, sei più che incoraggiato a usarli anche tu!

```javascript
const readline = require('node:readline');

const rl = readline.createInterface({
    output: process.stdout,
    input: process.stdin,
});

rl.question('Perché dovresti usare gli stream? ', answer => {
    console.log(`Forse è ${answer}, forse è perché sono fantastici!`);
});

rl.close();
```

Un buon esempio del motivo per cui il meccanismo di backpressure implementato attraverso gli stream è un'ottima ottimizzazione può essere dimostrato confrontando gli strumenti di sistema interni dell'implementazione Stream di Node.js.

In uno scenario, prenderemo un file di grandi dimensioni (circa -9 GB) e lo comprimeremo utilizzando il familiare strumento `zip(1)`.

```bash
zip The.Matrix.1080p.mkv
```

Mentre ci vorranno alcuni minuti per completare, in un'altra shell possiamo eseguire uno script che prende il modulo `zlib` di Node.js, che racchiude un altro strumento di compressione, `gzip(1)`.

```javascript
const gzip = require('node:zlib').createGzip();
const fs = require('node:fs');

const inp = fs.createReadStream('The.Matrix.1080p.mkv');
const out = fs.createWriteStream('The.Matrix.1080p.mkv.gz');

inp.pipe(gzip).pipe(out);
```

Per testare i risultati, prova ad aprire ogni file compresso. Il file compresso dallo strumento `zip(1)` ti avviserà che il file è danneggiato, mentre la compressione terminata da Stream si decomprimerà senza errori.

::: tip Nota
In questo esempio, usiamo `.pipe()` per ottenere la sorgente dati da un'estremità all'altra. Tuttavia, nota che non ci sono gestori di errori appropriati collegati. Se un blocco di dati non viene ricevuto correttamente, la sorgente Readable o lo stream `gzip` non verranno distrutti. `pump` è uno strumento di utilità che distruggerebbe correttamente tutti gli stream in una pipeline se uno di essi fallisce o si chiude, ed è un must in questo caso!
:::

`pump` è necessario solo per Node.js 8.x o versioni precedenti, poiché per Node.js 10.x o versioni successive, `pipeline` è stato introdotto per sostituire `pump`. Questo è un metodo del modulo per connettere stream trasferendo gli errori e pulendo correttamente e fornendo un callback quando la pipeline è completa.

Ecco un esempio di utilizzo della pipeline:

```javascript
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');
// Usa l'API pipeline per connettere facilmente una serie di stream
// insieme e ricevere una notifica quando la pipeline è completamente terminata.
// Una pipeline per comprimere in gzip un file video potenzialmente enorme in modo efficiente:
pipeline(
  fs.createReadStream('The.Matrix.1080p.mkv'),
  zlib.createGzip(),
  fs.createWriteStream('The.Matrix.1080p.mkv.gz'),
  err => {
    if (err) {
      console.error('Pipeline failed', err);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);
```

Puoi anche utilizzare il modulo `stream/promises` per utilizzare la pipeline con `async / await`:

```javascript
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');
async function run() {
  try {
    await pipeline(
      fs.createReadStream('The.Matrix.1080p.mkv'),
      zlib.createGzip(),
      fs.createWriteStream('The.Matrix.1080p.mkv.gz')
    );
    console.log('Pipeline succeeded');
  } catch (err) {
    console.error('Pipeline failed', err);
  }
}
```


## Troppi dati, troppo velocemente

Ci sono casi in cui uno stream `Readable` potrebbe fornire dati allo stream `Writable` troppo velocemente - molto più di quanto il consumer possa gestire!

Quando ciò accade, il consumer inizierà a mettere in coda tutti i chunk di dati per un consumo successivo. La coda di scrittura diventerà sempre più lunga e, a causa di ciò, più dati dovranno essere conservati in memoria fino al completamento dell'intero processo.

Scrivere su un disco è molto più lento che leggere da un disco, quindi, quando cerchiamo di comprimere un file e scriverlo sul nostro hard disk, si verificherà una contropressione perché il disco di scrittura non sarà in grado di tenere il passo con la velocità di lettura.

```javascript
// Segretamente lo stream sta dicendo: "ehi, ehi! aspetta, è troppo!"
// I dati inizieranno ad accumularsi sul lato di lettura del buffer di dati mentre
// write cerca di tenere il passo con il flusso di dati in entrata.
inp.pipe(gzip).pipe(outputFile);
```

Questo è il motivo per cui un meccanismo di contropressione è importante. Se non fosse presente un sistema di contropressione, il processo consumerebbe la memoria del sistema, rallentando efficacemente gli altri processi e monopolizzando gran parte del sistema fino al completamento.

Ciò si traduce in alcune cose:
- Rallentamento di tutti gli altri processi in corso
- Un garbage collector molto sovraccarico di lavoro
- Esaurimento della memoria

Nei seguenti esempi, prenderemo il valore di ritorno della funzione `.write()` e lo cambieremo in `true`, il che disabilita efficacemente il supporto alla contropressione nel core di Node.js. In qualsiasi riferimento al binario `'modified'`, stiamo parlando dell'esecuzione del binario node senza la riga `return ret;`, e invece con la riga sostituita `return true;`.

## Eccessivo trascinamento sulla garbage collection

Diamo un'occhiata a un rapido benchmark. Usando lo stesso esempio di sopra, abbiamo eseguito alcune prove a tempo per ottenere un tempo medio per entrambi i binari.

```bash
   trial (#)  | `node` binary (ms) | modified `node` binary (ms)
=================================================================
      1       |      56924         |           55011
      2       |      52686         |           55869
      3       |      59479         |           54043
      4       |      54473         |           55229
      5       |      52933         |           59723
=================================================================
average time: |      55299         |           55975
```

Entrambi impiegano circa un minuto per essere eseguiti, quindi non c'è molta differenza, ma diamo un'occhiata più da vicino per confermare se i nostri sospetti sono corretti. Usiamo lo strumento Linux `dtrace` per valutare cosa sta succedendo con il garbage collector V8.

Il tempo misurato dalla GC (garbage collector) indica gli intervalli di un ciclo completo di una singola scansione eseguita dal garbage collector:

```bash
approx. time (ms) | GC (ms) | modified GC (ms)
=================================================
          0       |    0    |      0
          1       |    0    |      0
         40       |    0    |      2
        170       |    3    |      1
        300       |    3    |      1
         *             *           *
         *             *           *
         *             *           *
      39000       |    6    |     26
      42000       |    6    |     21
      47000       |    5    |     32
      50000       |    8    |     28
      54000       |    6    |     35
```

Mentre i due processi iniziano allo stesso modo e sembrano far lavorare la GC alla stessa velocità, diventa evidente che dopo alcuni secondi con un sistema di contropressione funzionante, distribuisce il carico della GC su intervalli coerenti di 4-8 millisecondi fino alla fine del trasferimento dei dati.

Tuttavia, quando un sistema di contropressione non è in atto, la garbage collection V8 inizia a trascinarsi. Il binario normale chiama la GC circa 75 volte in un minuto, mentre il binario modificato la chiama solo 36 volte.

Questo è il debito lento e graduale che si accumula dall'aumento dell'utilizzo della memoria. Man mano che i dati vengono trasferiti, senza un sistema di contropressione in atto, viene utilizzata più memoria per ogni trasferimento di chunk.

Più memoria viene allocata, più la GC deve prendersi cura in una sola scansione. Più grande è la scansione, più la GC deve decidere cosa può essere liberato e la scansione di puntatori scollegati in uno spazio di memoria più ampio consumerà più potenza di calcolo.


## Esaurimento della Memoria

Per determinare il consumo di memoria di ciascun binario, abbiamo monitorato ogni processo con `/usr/bin/time -lp sudo ./node ./backpressure-example/zlib.js` individualmente.

Questo è l'output sul binario normale:

```bash
Rispetto del valore di ritorno di .write()
=============================================
real        58.88
user        56.79
sys          8.79
  87810048  dimensione massima del set residente
         0  dimensione media della memoria condivisa
         0  dimensione media dei dati non condivisi
         0  dimensione media dello stack non condiviso
     19427  recuperi di pagina
      3134  errori di pagina
         0  swap
         5  operazioni di input a blocchi
       194  operazioni di output a blocchi
         0  messaggi inviati
         0  messaggi ricevuti
         1  segnali ricevuti
        12  cambi di contesto volontari
    666037  cambi di contesto involontari
```

La dimensione massima in byte occupata dalla memoria virtuale risulta essere approssimativamente 87.81 mb.

E ora, cambiando il valore di ritorno della funzione `.write()`, otteniamo:

```bash
Senza rispettare il valore di ritorno di .write():
==================================================
real        54.48
user        53.15
sys          7.43
1524965376  dimensione massima del set residente
         0  dimensione media della memoria condivisa
         0  dimensione media dei dati non condivisi
         0  dimensione media dello stack non condiviso
    373617  recuperi di pagina
      3139  errori di pagina
         0  swap
        18  operazioni di input a blocchi
       199  operazioni di output a blocchi
         0  messaggi inviati
         0  messaggi ricevuti
         1  segnali ricevuti
        25  cambi di contesto volontari
    629566  cambi di contesto involontari
```

La dimensione massima in byte occupata dalla memoria virtuale risulta essere approssimativamente 1.52 gb.

Senza stream in atto per delegare la contropressione, c'è un ordine di grandezza maggiore di spazio di memoria allocato - un enorme margine di differenza tra lo stesso processo!

Questo esperimento mostra quanto sia ottimizzato ed economico il meccanismo di contropressione di Node.js per il tuo sistema di calcolo. Ora, analizziamo come funziona!


## In che modo la contropressione risolve questi problemi?

Esistono diverse funzioni per trasferire dati da un processo all'altro. In Node.js, esiste una funzione integrata interna chiamata `.pipe()`. Ci sono anche altri pacchetti che puoi usare! In definitiva, però, al livello base di questo processo, abbiamo due componenti separati: la sorgente dei dati e il consumatore.

Quando `.pipe()` viene chiamato dalla sorgente, segnala al consumatore che ci sono dati da trasferire. La funzione pipe aiuta a impostare le chiusure di contropressione appropriate per gli attivatori di eventi.

In Node.js la sorgente è uno stream `Readable` e il consumatore è uno stream `Writable` (entrambi questi possono essere scambiati con uno stream Duplex o Transform, ma ciò è fuori ambito per questa guida).

Il momento in cui la contropressione viene attivata può essere ristretto esattamente al valore di ritorno di una funzione `.write()` di `Writable`. Questo valore di ritorno è determinato da alcune condizioni, ovviamente.

In qualsiasi scenario in cui il buffer di dati ha superato il `highwaterMark` o la coda di scrittura è attualmente occupata, `.write()` `restituirà false`.

Quando viene restituito un valore `false`, si attiva il sistema di contropressione. Metterà in pausa lo stream `Readable` in entrata dall'invio di dati e attenderà fino a quando il consumatore non sarà di nuovo pronto. Una volta svuotato il buffer di dati, verrà emesso un evento `'drain'` e riprenderà il flusso di dati in entrata.

Una volta terminata la coda, la contropressione consentirà di inviare nuovamente i dati. Lo spazio in memoria che veniva utilizzato si libererà e si preparerà per il prossimo batch di dati.

Ciò consente effettivamente di utilizzare una quantità fissa di memoria in un dato momento per una funzione `.pipe()`. Non ci saranno perdite di memoria, né buffering infinito e il garbage collector dovrà occuparsi solo di un'area di memoria!

Quindi, se la contropressione è così importante, perché (probabilmente) non ne hai mai sentito parlare? Bene, la risposta è semplice: Node.js fa tutto questo automaticamente per te.

È fantastico! Ma anche non così eccezionale quando cerchiamo di capire come implementare i nostri stream personalizzati.

::: info NOTA
Nella maggior parte delle macchine, esiste una dimensione in byte che determina quando un buffer è pieno (che varierà a seconda delle diverse macchine). Node.js ti consente di impostare il tuo `highWaterMark` personalizzato, ma comunemente, il valore predefinito è impostato su 16 kb (16384 o 16 per gli stream objectMode). Nei casi in cui potresti voler aumentare tale valore, fallo pure, ma con cautela!
:::


## Ciclo di vita di `.pipe()`

Per ottenere una migliore comprensione della contropressione, ecco un diagramma di flusso sul ciclo di vita di uno stream `Readable` che viene [indirizzato](/it/nodejs/api/stream) in uno stream `Writable`:

```bash
                                                     +===================+
                         x-->  Funzioni di piping +-->   src.pipe(dest)  |
                         x     vengono impostate      |===================|
                         x     durante il metodo     |  Callback degli eventi |
  +===============+      x     .pipe.                |-------------------|
  |   I tuoi dati  |      x                           | .on('close', cb)  |
  +=======+=======+      x     Esistono al di fuori | .on('data', cb)   |
          |              x     del flusso di dati,  | .on('drain', cb)  |
          |              x     ma è importante      | .on('unpipe', cb) |
+---------v---------+    x     allegare eventi e    | .on('error', cb)  |
|  Stream Readable  +----+     le loro rispettive   | .on('finish', cb) |
+-^-------^-------^-+    |     callback.            | .on('end', cb)    |
  ^       |       ^      |                           +-------------------+
  |       |       |      |
  |       ^       |      |
  ^       ^       ^      |    +-------------------+         +=================+
  ^       |       ^      +---->  Stream Writable  +--------->  .write(chunk)  |
  |       |       |           +-------------------+         +=======+=========+
  |       ^       |                                                 |
  |       ^       |                              +------------------v---------+
  ^       |       +-> if (!chunk)                |   Questo chunk è troppo  |
  ^       |       |     emit .end();             |   grande? La coda è      |
  |       |       +-> else                       |   occupata?             |
  |       ^       |     emit .write();                   +-------+----------------+---+
  |       ^       ^                                   +--v---+        +---v---+
  |       |                                           <  No  |        |  Sì   |
  ^       |                                           +------+        +---v---+
  ^       |                                                               |
  |       ^               emit .pause();          +=================+     |
  |       ^---------------^-----------------------+  return false;  <-----+---+
  |                                               +=================+         |
  |                                                                           |
  ^            quando la coda è vuota +============+                         |
  ^------------^-----------------------<  Buffering |                         |
               |                       |============|                         |
               +> emit .drain();       |  ^Buffer^  |                         |
               +> emit .resume();      +------------+                         |
                                       |  ^Buffer^  |                         |
                                       +------------+   aggiungi chunk alla coda  |
                                       +============+   <---^---------------------<
```

::: tip NOTA
Se stai impostando una pipeline per concatenare alcuni stream per manipolare i tuoi dati, molto probabilmente implementerai lo stream Transform.
:::

In questo caso, l'output dallo stream `Readable` entrerà nel `Transform` e verrà indirizzato al `Writable`.

```javascript
Readable.pipe(Transformable).pipe(Writable);
```

La contropressione verrà applicata automaticamente, ma tieni presente che sia l'`highwaterMark` in entrata che in uscita dello stream `Transform` possono essere manipolati e influenzeranno il sistema di contropressione.


## Linee Guida sulla Contropressione

Dalla versione v0.10 di Node.js, la classe Stream offre la possibilità di modificare il comportamento di `.read()` o `.write()` utilizzando la versione con underscore di queste rispettive funzioni (`._read()` e `._write()`).

Sono documentate le linee guida per l'implementazione di stream Readable e per l'implementazione di stream Writable. Supporremo che tu le abbia lette, e la prossima sezione entrerà un po' più nel dettaglio.

## Regole da Rispettare Quando si Implementano Stream Personalizzati

La regola d'oro degli stream è rispettare sempre la contropressione. Ciò che costituisce la migliore pratica è una pratica non contraddittoria. Finché sei attento a evitare comportamenti che confliggono con il supporto interno della contropressione, puoi essere sicuro di seguire una buona pratica.

In generale,

1. Non usare mai `.push()` se non ti viene chiesto.
2. Non chiamare mai `.write()` dopo che restituisce false ma aspetta invece 'drain'.
3. Gli stream cambiano tra diverse versioni di Node.js e la libreria che usi. Fai attenzione e testa le cose.

::: tip NOTE
Per quanto riguarda il punto 3, un pacchetto incredibilmente utile per la creazione di stream per browser è `readable-stream`. Rodd Vagg ha scritto un [ottimo post sul blog](https://r.va.gg/2014/06/why-i-dont-use-nodes-core-stream-module.html) che descrive l'utilità di questa libreria. In breve, fornisce un tipo di degradazione graduale automatizzata per gli stream Readable e supporta le versioni precedenti di browser e Node.js.
:::

## Regole specifiche per gli Stream Readable

Finora, abbiamo dato un'occhiata a come `.write()` influisce sulla contropressione e ci siamo concentrati molto sullo stream Writable. A causa della funzionalità di Node.js, i dati tecnicamente fluiscono a valle da Readable a Writable. Tuttavia, come possiamo osservare in qualsiasi trasmissione di dati, materia o energia, la sorgente è altrettanto importante della destinazione e lo stream Readable è vitale per come viene gestita la contropressione.

Entrambi questi processi si basano l'uno sull'altro per comunicare efficacemente, se il Readable ignora quando lo stream Writable gli chiede di smettere di inviare dati, può essere problematico tanto quanto quando il valore di ritorno di `.write()` è errato.

Quindi, oltre a rispettare il ritorno di `.write()`, dobbiamo anche rispettare il valore di ritorno di `.push()` usato nel metodo `._read()`. Se `.push()` restituisce un valore false, lo stream smetterà di leggere dalla sorgente. Altrimenti, continuerà senza pausa.

Ecco un esempio di cattiva pratica usando `.push()`:
```javascript
// Questo è problematico in quanto ignora completamente il valore di ritorno dal push
// che potrebbe essere un segnale di contropressione dallo stream di destinazione!
class MyReadable extends Readable {
  _read(size) {
    let chunk;
    while (null == (chunk = getNextChunk())) {
      this.push(chunk);
    }
  }
}
```

Inoltre, dall'esterno dello stream personalizzato, ci sono insidie nell'ignorare la contropressione. In questo controesempio di buona pratica, il codice dell'applicazione forza i dati attraverso ogni volta che sono disponibili (segnalato dall'evento `'data'`):

```javascript
// Questo ignora i meccanismi di contropressione che Node.js ha messo in atto,
// e spinge incondizionatamente i dati, indipendentemente dal fatto che lo
// stream di destinazione sia pronto o meno.
readable.on('data', data => writable.write(data));
```

Ecco un esempio di utilizzo di `.push()` con uno stream Readable.

```javascript
const { Readable } = require('node:stream');

// Crea uno stream Readable personalizzato
const myReadableStream = new Readable({
  objectMode: true,
  read(size) {
    // Inserisci alcuni dati nello stream
    this.push({ message: 'Hello, world!' });
    this.push(null); // Contrassegna la fine dello stream
  },
});

// Consuma lo stream
myReadableStream.on('data', chunk => {
  console.log(chunk);
});

// Output:
// { message: 'Hello, world!' }
```


## Regole specifiche per i flussi scrivibili

Ricorda che `.write()` può restituire true o false a seconda di alcune condizioni. Fortunatamente per noi, quando creiamo il nostro flusso scrivibile, la macchina a stati del flusso gestirà i nostri callback e determinerà quando gestire la contropressione e ottimizzare il flusso di dati per noi. Tuttavia, quando vogliamo usare direttamente un Writable, dobbiamo rispettare il valore di ritorno di `.write()` e prestare molta attenzione a queste condizioni:
- Se la coda di scrittura è occupata, `.write()` restituirà false.
- Se il chunk di dati è troppo grande, `.write()` restituirà false (il limite è indicato dalla variabile highWaterMark).

In questo esempio, creiamo un flusso Readable personalizzato che inserisce un singolo oggetto nel flusso usando `.push()`. Il metodo `._read()` viene chiamato quando il flusso è pronto a consumare dati e, in questo caso, inseriamo immediatamente alcuni dati nel flusso e contrassegniamo la fine del flusso inserendo `null`.
```javascript
const stream = require('stream');

class MyReadable extends stream.Readable {
  constructor() {
    super();
  }

  _read() {
    const data = { message: 'Ciao, mondo!' };
    this.push(data);
    this.push(null);
  }
}

const readableStream = new MyReadable();

readableStream.pipe(process.stdout);
```
Quindi consumiamo il flusso ascoltando l'evento 'data' e registrando ogni chunk di dati che viene inserito nel flusso. In questo caso, inseriamo solo un singolo chunk di dati nel flusso, quindi vediamo solo un messaggio di log.

## Regole specifiche per i flussi scrivibili

Ricorda che `.write()` può restituire true o false a seconda di alcune condizioni. Fortunatamente per noi, quando creiamo il nostro flusso scrivibile, la macchina a stati del flusso gestirà i nostri callback e determinerà quando gestire la contropressione e ottimizzare il flusso di dati per noi.

Tuttavia, quando vogliamo usare direttamente un Writable, dobbiamo rispettare il valore di ritorno di `.write()` e prestare molta attenzione a queste condizioni:
- Se la coda di scrittura è occupata, `.write()` restituirà false.
- Se il chunk di dati è troppo grande, `.write()` restituirà false (il limite è indicato dalla variabile highWaterMark).

```javascript
class MyWritable extends Writable {
  // Questo Writable non è valido a causa della natura asincrona dei callback JavaScript.
  // Senza un'istruzione return per ogni callback prima dell'ultimo,
  // c'è un'alta probabilità che vengano chiamati più callback.
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) callback();
    else if (chunk.toString().indexOf('b') >= 0) callback();
    callback();
  }
}
```

Ci sono anche alcune cose a cui prestare attenzione quando si implementa `._writev()`. La funzione è accoppiata con `.cork()`, ma c'è un errore comune durante la scrittura:

```javascript
// Usare .uncork() due volte qui fa due chiamate al livello C++, rendendo la
// tecnica cork/uncork inutile.
ws.cork();
ws.write('ciao ');
ws.write('mondo ');
ws.uncork();

ws.cork();
ws.write('da ');
ws.write('Matteo');
ws.uncork();

// Il modo corretto per scrivere questo è utilizzare process.nextTick(), che si attiva
// al prossimo ciclo di eventi.
ws.cork();
ws.write('ciao ');
ws.write('mondo ');
process.nextTick(doUncork, ws);

ws.cork();
ws.write('da ');
ws.write('Matteo');
process.nextTick(doUncork, ws);

// Come funzione globale.
function doUncork(stream) {
  stream.uncork();
}
```

`.cork()` può essere chiamato tutte le volte che vogliamo, dobbiamo solo fare attenzione a chiamare `.uncork()` lo stesso numero di volte per farlo fluire di nuovo.


## Conclusione

Gli stream sono un modulo utilizzato frequentemente in Node.js. Sono importanti per la struttura interna e, per gli sviluppatori, per espandersi e connettersi attraverso l'ecosistema dei moduli Node.js.

Speriamo che ora tu sia in grado di risolvere i problemi e programmare in modo sicuro i tuoi stream `Writable` e `Readable` tenendo presente la contropressione, e di condividere le tue conoscenze con colleghi e amici.

Assicurati di leggere di più su `Stream` per altre funzioni API che ti aiuteranno a migliorare e liberare le tue capacità di streaming quando crei un'applicazione con Node.js.

