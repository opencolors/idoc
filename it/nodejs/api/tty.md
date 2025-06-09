---
title: Documentazione TTY di Node.js
description: Il modulo TTY di Node.js fornisce un'interfaccia per interagire con dispositivi TTY, inclusi metodi per verificare se un flusso è un TTY, ottenere la dimensione della finestra e gestire gli eventi del terminale.
head:
  - - meta
    - name: og:title
      content: Documentazione TTY di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo TTY di Node.js fornisce un'interfaccia per interagire con dispositivi TTY, inclusi metodi per verificare se un flusso è un TTY, ottenere la dimensione della finestra e gestire gli eventi del terminale.
  - - meta
    - name: twitter:title
      content: Documentazione TTY di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo TTY di Node.js fornisce un'interfaccia per interagire con dispositivi TTY, inclusi metodi per verificare se un flusso è un TTY, ottenere la dimensione della finestra e gestire gli eventi del terminale.
---


# TTY {#tty}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/tty.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tty.js)

Il modulo `node:tty` fornisce le classi `tty.ReadStream` e `tty.WriteStream`. Nella maggior parte dei casi, non sarà necessario o possibile utilizzare direttamente questo modulo. Tuttavia, è possibile accedervi utilizzando:

```js [ESM]
const tty = require('node:tty');
```
Quando Node.js rileva che è in esecuzione con un terminale di testo ("TTY") collegato, [`process.stdin`](/it/nodejs/api/process#processstdin) verrà, per impostazione predefinita, inizializzato come un'istanza di `tty.ReadStream` e sia [`process.stdout`](/it/nodejs/api/process#processstdout) che [`process.stderr`](/it/nodejs/api/process#processstderr) saranno, per impostazione predefinita, istanze di `tty.WriteStream`. Il metodo preferito per determinare se Node.js è in esecuzione all'interno di un contesto TTY è verificare che il valore della proprietà `process.stdout.isTTY` sia `true`:

```bash [BASH]
$ node -p -e "Boolean(process.stdout.isTTY)"
true
$ node -p -e "Boolean(process.stdout.isTTY)" | cat
false
```
Nella maggior parte dei casi, non ci dovrebbe essere alcun motivo per un'applicazione di creare manualmente istanze delle classi `tty.ReadStream` e `tty.WriteStream`.

## Classe: `tty.ReadStream` {#class-ttyreadstream}

**Aggiunto in: v0.5.8**

- Estende: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket)

Rappresenta il lato leggibile di un TTY. In circostanze normali [`process.stdin`](/it/nodejs/api/process#processstdin) sarà l'unica istanza `tty.ReadStream` in un processo Node.js e non ci dovrebbe essere motivo di creare istanze aggiuntive.

### `readStream.isRaw` {#readstreamisraw}

**Aggiunto in: v0.7.7**

Un `boolean` che è `true` se il TTY è attualmente configurato per operare come un dispositivo raw.

Questo flag è sempre `false` quando un processo inizia, anche se il terminale sta operando in modalità raw. Il suo valore cambierà con le successive chiamate a `setRawMode`.

### `readStream.isTTY` {#readstreamistty}

**Aggiunto in: v0.5.8**

Un `boolean` che è sempre `true` per le istanze `tty.ReadStream`.


### `readStream.setRawMode(mode)` {#readstreamsetrawmodemode}

**Aggiunto in: v0.7.7**

- `mode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, configura il `tty.ReadStream` per operare come un dispositivo raw. Se `false`, configura il `tty.ReadStream` per operare nella sua modalità predefinita. La proprietà `readStream.isRaw` sarà impostata alla modalità risultante.
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) L'istanza dello stream di lettura.

Consente la configurazione di `tty.ReadStream` in modo che operi come un dispositivo raw.

Quando si è in modalità raw, l'input è sempre disponibile carattere per carattere, senza includere modificatori. Inoltre, tutta l'elaborazione speciale dei caratteri da parte del terminale è disabilitata, inclusa l'eco dei caratteri di input. + non causerà più un `SIGINT` quando si è in questa modalità.

## Classe: `tty.WriteStream` {#class-ttywritestream}

**Aggiunto in: v0.5.8**

- Estende: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket)

Rappresenta il lato scrivibile di un TTY. In circostanze normali, [`process.stdout`](/it/nodejs/api/process#processstdout) e [`process.stderr`](/it/nodejs/api/process#processstderr) saranno le uniche istanze `tty.WriteStream` create per un processo Node.js e non ci dovrebbe essere motivo per creare istanze aggiuntive.

### `new tty.ReadStream(fd[, options])` {#new-ttyreadstreamfd-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v0.9.4 | L'argomento `options` è supportato. |
| v0.5.8 | Aggiunto in: v0.5.8 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un descrittore di file associato a un TTY.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni passate al `net.Socket` padre, vedere `options` del [`net.Socket` constructor](/it/nodejs/api/net#new-netsocketoptions).
- Restituisce [\<tty.ReadStream\>](/it/nodejs/api/tty#class-ttyreadstream)

Crea un `ReadStream` per `fd` associato a un TTY.

### `new tty.WriteStream(fd)` {#new-ttywritestreamfd}

**Aggiunto in: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un descrittore di file associato a un TTY.
- Restituisce [\<tty.WriteStream\>](/it/nodejs/api/tty#class-ttywritestream)

Crea un `WriteStream` per `fd` associato a un TTY.


### Evento: `'resize'` {#event-resize}

**Aggiunto in: v0.7.7**

L'evento `'resize'` viene emesso ogni volta che le proprietà `writeStream.columns` o `writeStream.rows` sono state modificate. Nessun argomento viene passato alla funzione di callback del listener quando viene chiamata.

```js [ESM]
process.stdout.on('resize', () => {
  console.log('le dimensioni dello schermo sono cambiate!');
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});
```
### `writeStream.clearLine(dir[, callback])` {#writestreamclearlinedir-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.7.0 | La funzione di callback e il valore di ritorno di write() dello stream sono esposti. |
| v0.7.7 | Aggiunto in: v0.7.7 |
:::

- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: a sinistra dal cursore
    - `1`: a destra dal cursore
    - `0`: l'intera riga
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocata al termine dell'operazione.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se lo stream desidera che il codice chiamante attenda che l'evento `'drain'` venga emesso prima di continuare a scrivere dati aggiuntivi; altrimenti `true`.

`writeStream.clearLine()` cancella la riga corrente di questo `WriteStream` in una direzione identificata da `dir`.

### `writeStream.clearScreenDown([callback])` {#writestreamclearscreendowncallback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.7.0 | La funzione di callback e il valore di ritorno di write() dello stream sono esposti. |
| v0.7.7 | Aggiunto in: v0.7.7 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocata al termine dell'operazione.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se lo stream desidera che il codice chiamante attenda che l'evento `'drain'` venga emesso prima di continuare a scrivere dati aggiuntivi; altrimenti `true`.

`writeStream.clearScreenDown()` cancella questo `WriteStream` dal cursore corrente in giù.


### `writeStream.columns` {#writestreamcolumns}

**Aggiunto in: v0.7.7**

Un `number` che specifica il numero di colonne che il TTY ha attualmente. Questa proprietà viene aggiornata ogni volta che viene emesso l'evento `'resize'`.

### `writeStream.cursorTo(x[, y][, callback])` {#writestreamcursortox-y-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.7.0 | Vengono esposti il callback e il valore di ritorno di write() dello stream. |
| v0.7.7 | Aggiunto in: v0.7.7 |
:::

- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocata una volta completata l'operazione.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se lo stream desidera che il codice chiamante attenda l'emissione dell'evento `'drain'` prima di continuare a scrivere dati aggiuntivi; altrimenti `true`.

`writeStream.cursorTo()` sposta il cursore di questo `WriteStream` nella posizione specificata.

### `writeStream.getColorDepth([env])` {#writestreamgetcolordepthenv}

**Aggiunto in: v9.9.0**

- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto contenente le variabili d'ambiente da controllare. Questo consente di simulare l'utilizzo di un terminale specifico. **Predefinito:** `process.env`.
- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce:

- `1` per 2,
- `4` per 16,
- `8` per 256,
- `24` per 16.777.216 colori supportati.

Usalo per determinare quali colori supporta il terminale. A causa della natura dei colori nei terminali, è possibile avere falsi positivi o falsi negativi. Dipende dalle informazioni sul processo e dalle variabili d'ambiente che potrebbero mentire sul terminale utilizzato. È possibile passare un oggetto `env` per simulare l'utilizzo di un terminale specifico. Questo può essere utile per verificare come si comportano impostazioni ambientali specifiche.

Per forzare un supporto specifico del colore, usa una delle seguenti impostazioni ambientali.

- 2 colori: `FORCE_COLOR = 0` (Disabilita i colori)
- 16 colori: `FORCE_COLOR = 1`
- 256 colori: `FORCE_COLOR = 2`
- 16.777.216 colori: `FORCE_COLOR = 3`

È anche possibile disabilitare il supporto del colore utilizzando le variabili d'ambiente `NO_COLOR` e `NODE_DISABLE_COLORS`.


### `writeStream.getWindowSize()` {#writestreamgetwindowsize}

**Aggiunto in: v0.7.7**

- Restituisce: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`writeStream.getWindowSize()` restituisce la dimensione del TTY corrispondente a questo `WriteStream`. L'array è del tipo `[numColumns, numRows]` dove `numColumns` e `numRows` rappresentano il numero di colonne e righe nel TTY corrispondente.

### `writeStream.hasColors([count][, env])` {#writestreamhascolorscount-env}

**Aggiunto in: v11.13.0, v10.16.0**

- `count` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di colori richiesti (minimo 2). **Predefinito:** 16.
- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto contenente le variabili d'ambiente da controllare. Ciò consente di simulare l'utilizzo di un terminale specifico. **Predefinito:** `process.env`.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se `writeStream` supporta almeno tanti colori quanti sono forniti in `count`. Il supporto minimo è 2 (bianco e nero).

Questo ha gli stessi falsi positivi e negativi descritti in [`writeStream.getColorDepth()`](/it/nodejs/api/tty#writestreamgetcolordepthenv).

```js [ESM]
process.stdout.hasColors();
// Restituisce true o false a seconda che `stdout` supporti almeno 16 colori.
process.stdout.hasColors(256);
// Restituisce true o false a seconda che `stdout` supporti almeno 256 colori.
process.stdout.hasColors({ TMUX: '1' });
// Restituisce true.
process.stdout.hasColors(2 ** 24, { TMUX: '1' });
// Restituisce false (l'impostazione dell'ambiente finge di supportare 2 ** 8 colori).
```
### `writeStream.isTTY` {#writestreamistty}

**Aggiunto in: v0.5.8**

Un `boolean` che è sempre `true`.

### `writeStream.moveCursor(dx, dy[, callback])` {#writestreammovecursordx-dy-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.7.0 | Sono esposti il callback e il valore di ritorno di write() dello stream. |
| v0.7.7 | Aggiunto in: v0.7.7 |
:::

- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Richiamato una volta completata l'operazione.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se lo stream desidera che il codice chiamante attenda l'emissione dell'evento `'drain'` prima di continuare a scrivere dati aggiuntivi; altrimenti `true`.

`writeStream.moveCursor()` sposta il cursore di questo `WriteStream` *relativamente* alla sua posizione corrente.


### `writeStream.rows` {#writestreamrows}

**Aggiunto in: v0.7.7**

Un `number` che specifica il numero di righe che il TTY ha attualmente. Questa proprietà viene aggiornata ogni volta che viene emesso l'evento `'resize'`.

## `tty.isatty(fd)` {#ttyisattyfd}

**Aggiunto in: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un descrittore di file numerico
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Il metodo `tty.isatty()` restituisce `true` se il dato `fd` è associato a un TTY e `false` se non lo è, incluso quando `fd` non è un intero non negativo.

