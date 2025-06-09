---
title: Applicazioni Esecuzione Singola con Node.js
description: Scopri come creare e gestire applicazioni eseguibili singole con Node.js, inclusa la modalità di bundling dell'applicazione, la gestione delle dipendenze e le considerazioni sulla sicurezza.
head:
  - - meta
    - name: og:title
      content: Applicazioni Esecuzione Singola con Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come creare e gestire applicazioni eseguibili singole con Node.js, inclusa la modalità di bundling dell'applicazione, la gestione delle dipendenze e le considerazioni sulla sicurezza.
  - - meta
    - name: twitter:title
      content: Applicazioni Esecuzione Singola con Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come creare e gestire applicazioni eseguibili singole con Node.js, inclusa la modalità di bundling dell'applicazione, la gestione delle dipendenze e le considerazioni sulla sicurezza.
---


# Applicazioni eseguibili singole {#single-executable-applications}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.6.0 | Aggiunto il supporto per "useSnapshot". |
| v20.6.0 | Aggiunto il supporto per "useCodeCache". |
| v19.7.0, v18.16.0 | Aggiunto in: v19.7.0, v18.16.0 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

**Codice sorgente:** [src/node_sea.cc](https://github.com/nodejs/node/blob/v23.5.0/src/node_sea.cc)

Questa funzionalità consente la distribuzione di un'applicazione Node.js in modo conveniente a un sistema che non ha Node.js installato.

Node.js supporta la creazione di [applicazioni eseguibili singole](https://github.com/nodejs/single-executable) consentendo l'iniezione di un blob preparato da Node.js, che può contenere uno script in bundle, nel binario `node`. Durante l'avvio, il programma verifica se è stato iniettato qualcosa. Se viene trovato il blob, esegue lo script nel blob. Altrimenti Node.js funziona come farebbe normalmente.

La funzionalità di applicazione eseguibile singola attualmente supporta solo l'esecuzione di un singolo script incorporato utilizzando il sistema di moduli [CommonJS](/it/nodejs/api/modules#modules-commonjs-modules).

Gli utenti possono creare un'applicazione eseguibile singola dal loro script in bundle con il binario `node` stesso e qualsiasi strumento in grado di iniettare risorse nel binario.

Ecco i passaggi per creare un'applicazione eseguibile singola utilizzando uno di questi strumenti, [postject](https://github.com/nodejs/postject):

## Generazione di blob di preparazione eseguibili singoli {#generating-single-executable-preparation-blobs}

I blob di preparazione eseguibili singoli che vengono iniettati nell'applicazione possono essere generati utilizzando il flag `--experimental-sea-config` del binario Node.js che verrà utilizzato per compilare l'eseguibile singolo. Richiede un percorso a un file di configurazione in formato JSON. Se il percorso passato non è assoluto, Node.js utilizzerà il percorso relativo alla directory di lavoro corrente.

La configurazione attualmente legge i seguenti campi di livello superiore:

```json [JSON]
{
  "main": "/percorso/allo/script/in/bundle.js",
  "output": "/percorso/per/scrivere/il/blob/generato.blob",
  "disableExperimentalSEAWarning": true, // Predefinito: false
  "useSnapshot": false,  // Predefinito: false
  "useCodeCache": true, // Predefinito: false
  "assets": {  // Opzionale
    "a.dat": "/percorso/a/a.dat",
    "b.txt": "/percorso/a/b.txt"
  }
}
```
Se i percorsi non sono assoluti, Node.js utilizzerà il percorso relativo alla directory di lavoro corrente. La versione del binario Node.js utilizzato per produrre il blob deve essere la stessa di quella a cui verrà iniettato il blob.

Nota: quando si generano SEA multipiattaforma (ad esempio, la generazione di un SEA per `linux-x64` su `darwin-arm64`), `useCodeCache` e `useSnapshot` devono essere impostati su false per evitare la generazione di eseguibili incompatibili. Poiché la cache del codice e gli snapshot possono essere caricati solo sulla stessa piattaforma in cui sono stati compilati, l'eseguibile generato potrebbe bloccarsi all'avvio quando si tenta di caricare la cache del codice o gli snapshot creati su una piattaforma diversa.


### Asset {#assets}

Gli utenti possono includere asset aggiungendo un dizionario chiave-percorso alla configurazione come campo `assets`. In fase di build, Node.js leggerebbe gli asset dai percorsi specificati e li raggrupperebbe nel blob di preparazione. Nell'eseguibile generato, gli utenti possono recuperare gli asset utilizzando le API [`sea.getAsset()`](/it/nodejs/api/single-executable-applications#seagetassetkey-encoding) e [`sea.getAssetAsBlob()`](/it/nodejs/api/single-executable-applications#seagetassetasblobkey-options).

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "assets": {
    "a.jpg": "/path/to/a.jpg",
    "b.txt": "/path/to/b.txt"
  }
}
```
L'applicazione a singolo eseguibile può accedere agli asset come segue:

```js [CJS]
const { getAsset, getAssetAsBlob, getRawAsset } = require('node:sea');
// Restituisce una copia dei dati in un ArrayBuffer.
const image = getAsset('a.jpg');
// Restituisce una stringa decodificata dall'asset come UTF8.
const text = getAsset('b.txt', 'utf8');
// Restituisce un Blob contenente l'asset.
const blob = getAssetAsBlob('a.jpg');
// Restituisce un ArrayBuffer contenente l'asset grezzo senza copiarlo.
const raw = getRawAsset('a.jpg');
```
Vedere la documentazione delle API [`sea.getAsset()`](/it/nodejs/api/single-executable-applications#seagetassetkey-encoding), [`sea.getAssetAsBlob()`](/it/nodejs/api/single-executable-applications#seagetassetasblobkey-options) e [`sea.getRawAsset()`](/it/nodejs/api/single-executable-applications#seagetrawassetkey) per maggiori informazioni.

### Supporto snapshot di avvio {#startup-snapshot-support}

Il campo `useSnapshot` può essere utilizzato per abilitare il supporto snapshot di avvio. In questo caso, lo script `main` non verrebbe eseguito quando viene avviato l'eseguibile finale. Invece, verrebbe eseguito quando viene generato il blob di preparazione dell'applicazione a singolo eseguibile sulla macchina di build. Il blob di preparazione generato includerebbe quindi uno snapshot che cattura gli stati inizializzati dallo script `main`. L'eseguibile finale con il blob di preparazione iniettato deserializzerebbe lo snapshot in fase di esecuzione.

Quando `useSnapshot` è true, lo script principale deve invocare l'API [`v8.startupSnapshot.setDeserializeMainFunction()`](/it/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) per configurare il codice che deve essere eseguito quando l'eseguibile finale viene avviato dagli utenti.

Il modello tipico per un'applicazione per utilizzare lo snapshot in un'applicazione a singolo eseguibile è:

I vincoli generali degli script snapshot di avvio si applicano anche allo script principale quando viene utilizzato per creare snapshot per l'applicazione a singolo eseguibile e lo script principale può utilizzare l'API [`v8.startupSnapshot`](/it/nodejs/api/v8#startup-snapshot-api) per adattarsi a questi vincoli. Vedere [la documentazione sul supporto dello snapshot di avvio in Node.js](/it/nodejs/api/cli#--build-snapshot).


### Supporto per la cache del codice V8 {#v8-code-cache-support}

Quando `useCodeCache` è impostato su `true` nella configurazione, durante la generazione del blob di preparazione dell'eseguibile singolo, Node.js compilerà lo script `main` per generare la cache del codice V8. La cache del codice generata farà parte del blob di preparazione e verrà iniettata nell'eseguibile finale. Quando viene avviata l'applicazione eseguibile singola, invece di compilare da zero lo script `main`, Node.js utilizzerà la cache del codice per accelerare la compilazione, quindi eseguirà lo script, il che migliorerebbe le prestazioni di avvio.

**Nota:** `import()` non funziona quando `useCodeCache` è `true`.

## Nello script principale iniettato {#in-the-injected-main-script}

### API dell'applicazione eseguibile singola {#single-executable-application-api}

Il modulo integrato `node:sea` consente l'interazione con l'applicazione eseguibile singola dallo script principale JavaScript incorporato nell'eseguibile.

#### `sea.isSea()` {#seaissea}

**Aggiunto in: v21.7.0, v20.12.0**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se questo script è in esecuzione all'interno di un'applicazione eseguibile singola.

### `sea.getAsset(key[, encoding])` {#seagetassetkey-encoding}

**Aggiunto in: v21.7.0, v20.12.0**

Questo metodo può essere utilizzato per recuperare le risorse configurate per essere raggruppate nell'applicazione eseguibile singola al momento della compilazione. Viene generato un errore quando non è possibile trovare alcuna risorsa corrispondente.

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) la chiave per la risorsa nel dizionario specificato dal campo `assets` nella configurazione dell'applicazione eseguibile singola.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se specificato, la risorsa verrà decodificata come stringa. Qualsiasi codifica supportata da `TextDecoder` è accettata. Se non specificato, verrà restituito invece un `ArrayBuffer` contenente una copia della risorsa.
- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)


### `sea.getAssetAsBlob(key[, options])` {#seagetassetasblobkey-options}

**Aggiunto in: v21.7.0, v20.12.0**

Simile a [`sea.getAsset()`](/it/nodejs/api/single-executable-applications#seagetassetkey-encoding), ma restituisce il risultato in un [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob). Viene generato un errore quando non è possibile trovare una risorsa corrispondente.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) la chiave per la risorsa nel dizionario specificato dal campo `assets` nella configurazione dell'applicazione eseguibile singola.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un tipo mime opzionale per il blob.
  
 
- Restituisce: [\<Blob\>](/it/nodejs/api/buffer#class-blob)

### `sea.getRawAsset(key)` {#seagetrawassetkey}

**Aggiunto in: v21.7.0, v20.12.0**

Questo metodo può essere utilizzato per recuperare le risorse configurate per essere raggruppate nell'applicazione eseguibile singola in fase di compilazione. Viene generato un errore quando non è possibile trovare una risorsa corrispondente.

A differenza di `sea.getAsset()` o `sea.getAssetAsBlob()`, questo metodo non restituisce una copia. Invece, restituisce la risorsa non elaborata raggruppata all'interno dell'eseguibile.

Per ora, gli utenti dovrebbero evitare di scrivere nel buffer di array restituito. Se la sezione iniettata non è contrassegnata come scrivibile o non è allineata correttamente, la scrittura nel buffer di array restituito potrebbe causare un arresto anomalo.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) la chiave per la risorsa nel dizionario specificato dal campo `assets` nella configurazione dell'applicazione eseguibile singola.
- Restituisce: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

### `require(id)` nello script principale iniettato non è basato su file {#requireid-in-the-injected-main-script-is-not-file-based}

`require()` nello script principale iniettato non è lo stesso di [`require()`](/it/nodejs/api/modules#requireid) disponibile per i moduli che non vengono iniettati. Inoltre, non ha nessuna delle proprietà che [`require()`](/it/nodejs/api/modules#requireid) non iniettato ha eccetto [`require.main`](/it/nodejs/api/modules#accessing-the-main-module). Può essere utilizzato solo per caricare moduli integrati. Tentare di caricare un modulo che può essere trovato solo nel file system genererà un errore.

Invece di fare affidamento su un `require()` basato su file, gli utenti possono raggruppare la propria applicazione in un file JavaScript autonomo da iniettare nell'eseguibile. Ciò garantisce anche un grafico delle dipendenze più deterministico.

Tuttavia, se è ancora necessario un `require()` basato su file, è anche possibile ottenerlo:

```js [ESM]
const { createRequire } = require('node:module');
require = createRequire(__filename);
```

### `__filename` e `module.filename` nello script principale iniettato {#__filename-and-modulefilename-in-the-injected-main-script}

I valori di `__filename` e `module.filename` nello script principale iniettato sono uguali a [`process.execPath`](/it/nodejs/api/process#processexecpath).

### `__dirname` nello script principale iniettato {#__dirname-in-the-injected-main-script}

Il valore di `__dirname` nello script principale iniettato è uguale al nome della directory di [`process.execPath`](/it/nodejs/api/process#processexecpath).

## Note {#notes}

### Processo di creazione di un'applicazione eseguibile singola {#single-executable-application-creation-process}

Uno strumento che mira a creare un'applicazione Node.js eseguibile singola deve iniettare i contenuti del blob preparato con `--experimental-sea-config"` in:

- una risorsa chiamata `NODE_SEA_BLOB` se il binario `node` è un file [PE](https://en.wikipedia.org/wiki/Portable_Executable)
- una sezione chiamata `NODE_SEA_BLOB` nel segmento `NODE_SEA` se il binario `node` è un file [Mach-O](https://en.wikipedia.org/wiki/Mach-O)
- una nota chiamata `NODE_SEA_BLOB` se il binario `node` è un file [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)

Cerca nel binario la stringa [fuse](https://www.electronjs.org/docs/latest/tutorial/fuses) `NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2:0` e cambia l'ultimo carattere in `1` per indicare che una risorsa è stata iniettata.

### Supporto della piattaforma {#platform-support}

Il supporto per un singolo eseguibile viene testato regolarmente su CI solo sulle seguenti piattaforme:

- Windows
- macOS
- Linux (tutte le distribuzioni [supportate da Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) ad eccezione di Alpine e tutte le architetture [supportate da Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) ad eccezione di s390x)

Ciò è dovuto alla mancanza di strumenti migliori per generare singoli eseguibili che possono essere utilizzati per testare questa funzionalità su altre piattaforme.

Suggerimenti per altri strumenti/flussi di lavoro di iniezione di risorse sono benvenuti. Si prega di avviare una discussione su [https://github.com/nodejs/single-executable/discussions](https://github.com/nodejs/single-executable/discussions) per aiutarci a documentarli.

