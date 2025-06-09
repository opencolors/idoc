---
title: Documentazione Buffer di Node.js
description: La documentazione Buffer di Node.js fornisce informazioni dettagliate su come lavorare con i dati binari in Node.js, inclusa la creazione, manipolazione e conversione dei buffer.
head:
  - - meta
    - name: og:title
      content: Documentazione Buffer di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentazione Buffer di Node.js fornisce informazioni dettagliate su come lavorare con i dati binari in Node.js, inclusa la creazione, manipolazione e conversione dei buffer.
  - - meta
    - name: twitter:title
      content: Documentazione Buffer di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentazione Buffer di Node.js fornisce informazioni dettagliate su come lavorare con i dati binari in Node.js, inclusa la creazione, manipolazione e conversione dei buffer.
---


# Buffer {#buffer}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/buffer.js](https://github.com/nodejs/node/blob/v23.5.0/lib/buffer.js)

Gli oggetti `Buffer` sono utilizzati per rappresentare una sequenza di byte di lunghezza fissa. Molte API di Node.js supportano i `Buffer`.

La classe `Buffer` è una sottoclasse della classe [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) di JavaScript e la estende con metodi che coprono ulteriori casi d'uso. Le API di Node.js accettano anche semplici [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) ovunque siano supportati i `Buffer`.

Sebbene la classe `Buffer` sia disponibile all'interno dell'ambito globale, è comunque consigliabile farvi riferimento esplicitamente tramite un'istruzione import o require.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crea un Buffer riempito di zeri di lunghezza 10.
const buf1 = Buffer.alloc(10);

// Crea un Buffer di lunghezza 10,
// riempito con byte che hanno tutti il valore `1`.
const buf2 = Buffer.alloc(10, 1);

// Crea un buffer non inizializzato di lunghezza 10.
// Questo è più veloce della chiamata a Buffer.alloc() ma l'istanza Buffer restituita
// potrebbe contenere dati obsoleti che devono essere
// sovrascritti utilizzando fill(), write() o altre funzioni che riempiono il contenuto del Buffer.
const buf3 = Buffer.allocUnsafe(10);

// Crea un Buffer contenente i byte [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// Crea un Buffer contenente i byte [1, 1, 1, 1] – le voci
// vengono tutte troncate usando `(value & 255)` per rientrare nell'intervallo 0–255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Crea un Buffer contenente i byte con codifica UTF-8 per la stringa 'tést':
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (in notazione esadecimale)
// [116, 195, 169, 115, 116] (in notazione decimale)
const buf6 = Buffer.from('tést');

// Crea un Buffer contenente i byte Latin-1 [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crea un Buffer riempito di zeri di lunghezza 10.
const buf1 = Buffer.alloc(10);

// Crea un Buffer di lunghezza 10,
// riempito con byte che hanno tutti il valore `1`.
const buf2 = Buffer.alloc(10, 1);

// Crea un buffer non inizializzato di lunghezza 10.
// Questo è più veloce della chiamata a Buffer.alloc() ma l'istanza Buffer restituita
// potrebbe contenere dati obsoleti che devono essere
// sovrascritti utilizzando fill(), write() o altre funzioni che riempiono il contenuto del Buffer.
const buf3 = Buffer.allocUnsafe(10);

// Crea un Buffer contenente i byte [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// Crea un Buffer contenente i byte [1, 1, 1, 1] – le voci
// vengono tutte troncate usando `(value & 255)` per rientrare nell'intervallo 0–255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Crea un Buffer contenente i byte con codifica UTF-8 per la stringa 'tést':
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (in notazione esadecimale)
// [116, 195, 169, 115, 116] (in notazione decimale)
const buf6 = Buffer.from('tést');

// Crea un Buffer contenente i byte Latin-1 [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');
```
:::


## Buffer e codifiche dei caratteri {#buffers-and-character-encodings}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.7.0, v14.18.0 | Introdotta la codifica `base64url`. |
| v6.4.0 | Introdotto `latin1` come alias per `binary`. |
| v5.0.0 | Rimosse le codifiche deprecate `raw` e `raws`. |
:::

Quando si convertono `Buffer` e stringhe, è possibile specificare una codifica dei caratteri. Se non viene specificata alcuna codifica dei caratteri, verrà utilizzato UTF-8 come predefinito.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Stampa: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Stampa: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Stampa: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Stampa: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Stampa: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Stampa: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Stampa: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Stampa: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```
:::

I buffer di Node.js accettano tutte le varianti di maiuscole e minuscole delle stringhe di codifica che ricevono. Ad esempio, UTF-8 può essere specificato come `'utf8'`, `'UTF8'` o `'uTf8'`.

Le codifiche dei caratteri attualmente supportate da Node.js sono le seguenti:

- `'utf8'` (alias: `'utf-8'`): caratteri Unicode codificati multi-byte. Molte pagine web e altri formati di documenti utilizzano [UTF-8](https://en.wikipedia.org/wiki/UTF-8). Questa è la codifica dei caratteri predefinita. Quando si decodifica un `Buffer` in una stringa che non contiene esclusivamente dati UTF-8 validi, il carattere di sostituzione Unicode `U+FFFD` � verrà utilizzato per rappresentare tali errori.
- `'utf16le'` (alias: `'utf-16le'`): caratteri Unicode codificati multi-byte. A differenza di `'utf8'`, ogni carattere nella stringa verrà codificato utilizzando 2 o 4 byte. Node.js supporta solo la variante [little-endian](https://en.wikipedia.org/wiki/Endianness) di [UTF-16](https://en.wikipedia.org/wiki/UTF-16).
- `'latin1'`: Latin-1 sta per [ISO-8859-1](https://en.wikipedia.org/wiki/ISO-8859-1). Questa codifica dei caratteri supporta solo i caratteri Unicode da `U+0000` a `U+00FF`. Ogni carattere viene codificato utilizzando un singolo byte. I caratteri che non rientrano in questo intervallo vengono troncati e mappati ai caratteri in tale intervallo.

La conversione di un `Buffer` in una stringa utilizzando uno dei precedenti è indicata come decodifica e la conversione di una stringa in un `Buffer` è indicata come codifica.

Node.js supporta anche le seguenti codifiche da binario a testo. Per le codifiche da binario a testo, la convenzione di denominazione è invertita: la conversione di un `Buffer` in una stringa è in genere indicata come codifica e la conversione di una stringa in un `Buffer` come decodifica.

- `'base64'`: codifica [Base64](https://en.wikipedia.org/wiki/Base64). Quando si crea un `Buffer` da una stringa, questa codifica accetterà correttamente anche "Alfabeto sicuro per URL e nomi file" come specificato in [RFC 4648, Sezione 5](https://tools.ietf.org/html/rfc4648#section-5). I caratteri whitespace come spazi, tabulazioni e nuove righe contenuti all'interno della stringa con codifica base64 vengono ignorati.
- `'base64url'`: codifica [base64url](https://tools.ietf.org/html/rfc4648#section-5) come specificato in [RFC 4648, Sezione 5](https://tools.ietf.org/html/rfc4648#section-5). Quando si crea un `Buffer` da una stringa, questa codifica accetterà correttamente anche stringhe con codifica base64 regolari. Quando si codifica un `Buffer` in una stringa, questa codifica ometterà il padding.
- `'hex'`: codifica ogni byte come due caratteri esadecimali. Il troncamento dei dati può verificarsi durante la decodifica di stringhe che non sono costituite esclusivamente da un numero pari di caratteri esadecimali. Vedi sotto per un esempio.

Sono supportate anche le seguenti codifiche di caratteri legacy:

- `'ascii'`: solo per dati [ASCII](https://en.wikipedia.org/wiki/ASCII) a 7 bit. Quando si codifica una stringa in un `Buffer`, questo equivale all'utilizzo di `'latin1'`. Quando si decodifica un `Buffer` in una stringa, l'utilizzo di questa codifica disattiverà inoltre il bit più alto di ogni byte prima della decodifica come `'latin1'`. In generale, non ci dovrebbe essere motivo di utilizzare questa codifica, poiché `'utf8'` (o, se si sa che i dati sono sempre solo ASCII, `'latin1'`) sarà una scelta migliore quando si codifica o si decodifica testo solo ASCII. Viene fornito solo per compatibilità legacy.
- `'binary'`: alias per `'latin1'`. Il nome di questa codifica può essere molto fuorviante, poiché tutte le codifiche elencate qui convertono tra stringhe e dati binari. Per la conversione tra stringhe e `Buffer`, in genere `'utf8'` è la scelta giusta.
- `'ucs2'`, `'ucs-2'`: alias di `'utf16le'`. UCS-2 si riferiva a una variante di UTF-16 che non supportava caratteri con punti di codice superiori a U+FFFF. In Node.js, questi punti di codice sono sempre supportati.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.from('1ag123', 'hex');
// Stampa <Buffer 1a>, dati troncati quando viene rilevato il primo valore non esadecimale
// ('g').

Buffer.from('1a7', 'hex');
// Stampa <Buffer 1a>, dati troncati quando i dati terminano con una singola cifra ('7').

Buffer.from('1634', 'hex');
// Stampa <Buffer 16 34>, tutti i dati rappresentati.
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.from('1ag123', 'hex');
// Stampa <Buffer 1a>, dati troncati quando viene rilevato il primo valore non esadecimale
// ('g').

Buffer.from('1a7', 'hex');
// Stampa <Buffer 1a>, dati troncati quando i dati terminano con una singola cifra ('7').

Buffer.from('1634', 'hex');
// Stampa <Buffer 16 34>, tutti i dati rappresentati.
```
:::

I moderni browser Web seguono lo [Standard di codifica WHATWG](https://encoding.spec.whatwg.org/) che aliasa sia `'latin1'` che `'ISO-8859-1'` a `'win-1252'`. Ciò significa che durante l'esecuzione di qualcosa come `http.get()`, se il charset restituito è uno di quelli elencati nella specifica WHATWG, è possibile che il server abbia effettivamente restituito dati con codifica `'win-1252'` e l'utilizzo della codifica `'latin1'` potrebbe decodificare in modo errato i caratteri.


## Buffer e TypedArray {#buffers-and-typedarrays}

::: info [Cronologia]
| Versione | Modifiche |
|---|---|
| v3.0.0 | La classe `Buffer` ora eredita da `Uint8Array`. |
:::

Le istanze `Buffer` sono anche istanze JavaScript di [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) e [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray). Tutti i metodi di [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) sono disponibili sui `Buffer`. Ci sono, tuttavia, sottili incompatibilità tra l'API `Buffer` e l'API [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).

In particolare:

- Mentre [`TypedArray.prototype.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice) crea una copia di una parte di `TypedArray`, [`Buffer.prototype.slice()`](/it/nodejs/api/buffer#bufslicestart-end) crea una vista sul `Buffer` esistente senza copiare. Questo comportamento può essere sorprendente ed esiste solo per la compatibilità legacy. [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray) può essere utilizzato per ottenere il comportamento di [`Buffer.prototype.slice()`](/it/nodejs/api/buffer#bufslicestart-end) sia su `Buffer` che su altri `TypedArray` e dovrebbe essere preferito.
- [`buf.toString()`](/it/nodejs/api/buffer#buftostringencoding-start-end) è incompatibile con il suo equivalente `TypedArray`.
- Un certo numero di metodi, ad es. [`buf.indexOf()`](/it/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding), supportano argomenti aggiuntivi.

Ci sono due modi per creare nuove istanze [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) da un `Buffer`:

- Passare un `Buffer` a un costruttore [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) copierà il contenuto del `Buffer`, interpretato come un array di interi, e non come una sequenza di byte del tipo di destinazione.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```
:::

- Passare l'oggetto [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) sottostante del `Buffer` creerà un [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) che condivide la sua memoria con il `Buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```
:::

È possibile creare un nuovo `Buffer` che condivida la stessa memoria allocata di un'istanza [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) utilizzando la proprietà `.buffer` dell'oggetto `TypedArray` nello stesso modo. [`Buffer.from()`](/it/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) si comporta come `new Uint8Array()` in questo contesto.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```
:::

Quando si crea un `Buffer` utilizzando la proprietà `.buffer` di un [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), è possibile utilizzare solo una porzione dell'oggetto [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) sottostante passando i parametri `byteOffset` e `length`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```
:::

`Buffer.from()` e [`TypedArray.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from) hanno firme e implementazioni diverse. In particolare, le varianti [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) accettano un secondo argomento che è una funzione di mappatura che viene richiamata su ogni elemento dell'array tipizzato:

- `TypedArray.from(source[, mapFn[, thisArg]])`

Il metodo `Buffer.from()`, tuttavia, non supporta l'uso di una funzione di mappatura:

- [`Buffer.from(array)`](/it/nodejs/api/buffer#static-method-bufferfromarray)
- [`Buffer.from(buffer)`](/it/nodejs/api/buffer#static-method-bufferfrombuffer)
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/it/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)
- [`Buffer.from(string[, encoding])`](/it/nodejs/api/buffer#static-method-bufferfromstring-encoding)


## Buffer e iterazione {#buffers-and-iteration}

Le istanze di `Buffer` possono essere iterate usando la sintassi `for..of`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Prints:
//   1
//   2
//   3
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Prints:
//   1
//   2
//   3
```
:::

Inoltre, i metodi [`buf.values()`](/it/nodejs/api/buffer#bufvalues), [`buf.keys()`](/it/nodejs/api/buffer#bufkeys) e [`buf.entries()`](/it/nodejs/api/buffer#bufentries) possono essere usati per creare iteratori.

## Classe: `Blob` {#class-blob}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0, v16.17.0 | Non più sperimentale. |
| v15.7.0, v14.18.0 | Aggiunto in: v15.7.0, v14.18.0 |
:::

Un [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) incapsula dati non elaborati e immutabili che possono essere condivisi in modo sicuro tra più thread di worker.

### `new buffer.Blob([sources[, options]])` {#new-bufferblobsources-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.7.0 | Aggiunta l'opzione standard `endings` per sostituire le terminazioni di riga e rimossa l'opzione non standard `encoding`. |
| v15.7.0, v14.18.0 | Aggiunto in: v15.7.0, v14.18.0 |
:::

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/it/nodejs/api/buffer#class-blob) Un array di oggetti stringa, [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), o [\<Blob\>](/it/nodejs/api/buffer#class-blob), o qualsiasi combinazione di tali oggetti, che verranno memorizzati all'interno del `Blob`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uno tra `'transparent'` o `'native'`. Quando impostato su `'native'`, le terminazioni di riga nelle parti di origine stringa verranno convertite nella terminazione di riga nativa della piattaforma come specificato da `require('node:os').EOL`.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il content-type del Blob. L'intento è che `type` trasmetta il tipo di media MIME dei dati, tuttavia non viene eseguita alcuna convalida del formato del tipo.

Crea un nuovo oggetto `Blob` contenente una concatenazione delle origini fornite.

Le origini [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) e [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) vengono copiate nel 'Blob' e possono quindi essere modificate in modo sicuro dopo la creazione del 'Blob'.

Le origini stringa sono codificate come sequenze di byte UTF-8 e copiate nel Blob. Le coppie di surrogati non corrispondenti all'interno di ciascuna parte della stringa verranno sostituite con i caratteri di sostituzione Unicode U+FFFD.


### `blob.arrayBuffer()` {#blobarraybuffer}

**Aggiunto in: v15.7.0, v14.18.0**

- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Restituisce una promise che si risolve con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenente una copia dei dati `Blob`.

#### `blob.bytes()` {#blobbytes}

**Aggiunto in: v22.3.0, v20.16.0**

Il metodo `blob.bytes()` restituisce il byte dell'oggetto `Blob` come `Promise\<Uint8Array\>`.

```js [ESM]
const blob = new Blob(['hello']);
blob.bytes().then((bytes) => {
  console.log(bytes); // Outputs: Uint8Array(5) [ 104, 101, 108, 108, 111 ]
});
```
### `blob.size` {#blobsize}

**Aggiunto in: v15.7.0, v14.18.0**

La dimensione totale del `Blob` in byte.

### `blob.slice([start[, end[, type]]])` {#blobslicestart-end-type}

**Aggiunto in: v15.7.0, v14.18.0**

- `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'indice iniziale.
- `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'indice finale.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il content-type per il nuovo `Blob`

Crea e restituisce un nuovo `Blob` contenente un sottoinsieme dei dati di questo oggetto `Blob`. Il `Blob` originale non viene alterato.

### `blob.stream()` {#blobstream}

**Aggiunto in: v16.7.0**

- Restituisce: [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream)

Restituisce un nuovo `ReadableStream` che consente di leggere il contenuto del `Blob`.

### `blob.text()` {#blobtext}

**Aggiunto in: v15.7.0, v14.18.0**

- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Restituisce una promise che si risolve con il contenuto del `Blob` decodificato come una stringa UTF-8.

### `blob.type` {#blobtype}

**Aggiunto in: v15.7.0, v14.18.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il content-type del `Blob`.


### Oggetti `Blob` e `MessageChannel` {#blob-objects-and-messagechannel}

Una volta creato un oggetto [\<Blob\>](/it/nodejs/api/buffer#class-blob), può essere inviato tramite `MessagePort` a più destinazioni senza trasferire o copiare immediatamente i dati. I dati contenuti dal `Blob` vengono copiati solo quando vengono chiamati i metodi `arrayBuffer()` o `text()`.

::: code-group
```js [ESM]
import { Blob } from 'node:buffer';
import { setTimeout as delay } from 'node:timers/promises';

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// The Blob is still usable after posting.
blob.text().then(console.log);
```

```js [CJS]
const { Blob } = require('node:buffer');
const { setTimeout: delay } = require('node:timers/promises');

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// The Blob is still usable after posting.
blob.text().then(console.log);
```
:::

## Classe: `Buffer` {#class-buffer}

La classe `Buffer` è un tipo globale per gestire direttamente i dati binari. Può essere costruito in vari modi.

### Metodo statico: `Buffer.alloc(size[, fill[, encoding]])` {#static-method-bufferallocsize-fill-encoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | Lancia ERR_INVALID_ARG_TYPE o ERR_OUT_OF_RANGE invece di ERR_INVALID_ARG_VALUE per argomenti di input non validi. |
| v15.0.0 | Lancia ERR_INVALID_ARG_VALUE invece di ERR_INVALID_OPT_VALUE per argomenti di input non validi. |
| v10.0.0 | Tentare di riempire un buffer di lunghezza diversa da zero con un buffer di lunghezza zero attiva un'eccezione lanciata. |
| v10.0.0 | Specificare una stringa non valida per `fill` attiva un'eccezione lanciata. |
| v8.9.3 | Specificare una stringa non valida per `fill` ora si traduce in un buffer riempito di zeri. |
| v5.10.0 | Aggiunto in: v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La lunghezza desiderata del nuovo `Buffer`.
- `fill` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un valore con cui pre-riempire il nuovo `Buffer`. **Predefinito:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `fill` è una stringa, questa è la sua codifica. **Predefinito:** `'utf8'`.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Alloca un nuovo `Buffer` di `size` byte. Se `fill` è `undefined`, il `Buffer` verrà riempito di zeri.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```
:::

Se `size` è maggiore di [`buffer.constants.MAX_LENGTH`](/it/nodejs/api/buffer#bufferconstantsmax_length) o minore di 0, viene lanciato [`ERR_OUT_OF_RANGE`](/it/nodejs/api/errors#err_out_of_range).

Se `fill` è specificato, il `Buffer` allocato verrà inizializzato chiamando [`buf.fill(fill)`](/it/nodejs/api/buffer#buffillvalue-offset-end-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```
:::

Se sia `fill` che `encoding` sono specificati, il `Buffer` allocato verrà inizializzato chiamando [`buf.fill(fill, encoding)`](/it/nodejs/api/buffer#buffillvalue-offset-end-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```
:::

Chiamare [`Buffer.alloc()`](/it/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) può essere misurabilmente più lento dell'alternativa [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize) ma assicura che il contenuto dell'istanza `Buffer` appena creata non conterrà mai dati sensibili provenienti da allocazioni precedenti, inclusi dati che potrebbero non essere stati allocati per i `Buffer`.

Verrà lanciato un `TypeError` se `size` non è un numero.


### Metodo statico: `Buffer.allocUnsafe(size)` {#static-method-bufferallocunsafesize}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | Genera ERR_INVALID_ARG_TYPE o ERR_OUT_OF_RANGE invece di ERR_INVALID_ARG_VALUE per argomenti di input non validi. |
| v15.0.0 | Genera ERR_INVALID_ARG_VALUE invece di ERR_INVALID_OPT_VALUE per argomenti di input non validi. |
| v7.0.0 | Passare una `size` negativa ora genererà un errore. |
| v5.10.0 | Aggiunto in: v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La lunghezza desiderata del nuovo `Buffer`.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Alloca un nuovo `Buffer` di `size` byte. Se `size` è maggiore di [`buffer.constants.MAX_LENGTH`](/it/nodejs/api/buffer#bufferconstantsmax_length) o inferiore a 0, viene generato [`ERR_OUT_OF_RANGE`](/it/nodejs/api/errors#err_out_of_range).

La memoria sottostante per le istanze `Buffer` create in questo modo *non è inizializzata*. Il contenuto del `Buffer` appena creato è sconosciuto e *può contenere dati sensibili*. Utilizzare invece [`Buffer.alloc()`](/it/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) per inizializzare le istanze `Buffer` con zeri.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Stampa (il contenuto può variare): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Stampa: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Stampa (il contenuto può variare): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Stampa: <Buffer 00 00 00 00 00 00 00 00 00 00>
```
:::

Un `TypeError` verrà generato se `size` non è un numero.

Il modulo `Buffer` pre-alloca un'istanza `Buffer` interna di dimensione [`Buffer.poolSize`](/it/nodejs/api/buffer#class-property-bufferpoolsize) che viene utilizzata come pool per l'allocazione rapida di nuove istanze `Buffer` create utilizzando [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.from(array)`](/it/nodejs/api/buffer#static-method-bufferfromarray), [`Buffer.from(string)`](/it/nodejs/api/buffer#static-method-bufferfromstring-encoding) e [`Buffer.concat()`](/it/nodejs/api/buffer#static-method-bufferconcatlist-totallength) solo quando `size` è inferiore a `Buffer.poolSize \>\>\> 1` (parte intera di [`Buffer.poolSize`](/it/nodejs/api/buffer#class-property-bufferpoolsize) diviso per due).

L'uso di questo pool di memoria interno pre-allocato è una differenza fondamentale tra la chiamata a `Buffer.alloc(size, fill)` e `Buffer.allocUnsafe(size).fill(fill)`. In particolare, `Buffer.alloc(size, fill)` *non* utilizzerà *mai* il pool `Buffer` interno, mentre `Buffer.allocUnsafe(size).fill(fill)` *utilizzerà* il pool `Buffer` interno se `size` è inferiore o uguale alla metà di [`Buffer.poolSize`](/it/nodejs/api/buffer#class-property-bufferpoolsize). La differenza è sottile ma può essere importante quando un'applicazione richiede le prestazioni aggiuntive che [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize) fornisce.


### Metodo statico: `Buffer.allocUnsafeSlow(size)` {#static-method-bufferallocunsafeslowsize}

::: info [Cronologia]
| Versione | Modifiche                                                                                                                                 |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| v20.0.0  | Lancia ERR_INVALID_ARG_TYPE o ERR_OUT_OF_RANGE invece di ERR_INVALID_ARG_VALUE per argomenti di input non validi.                           |
| v15.0.0  | Lancia ERR_INVALID_ARG_VALUE invece di ERR_INVALID_OPT_VALUE per argomenti di input non validi.                                           |
| v5.12.0  | Aggiunto in: v5.12.0                                                                                                                      |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La lunghezza desiderata del nuovo `Buffer`.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Alloca un nuovo `Buffer` di `size` byte. Se `size` è maggiore di [`buffer.constants.MAX_LENGTH`](/it/nodejs/api/buffer#bufferconstantsmax_length) o minore di 0, viene generato [`ERR_OUT_OF_RANGE`](/it/nodejs/api/errors#err_out_of_range). Viene creato un `Buffer` di lunghezza zero se `size` è 0.

La memoria sottostante per le istanze `Buffer` create in questo modo *non è inizializzata*. Il contenuto del `Buffer` appena creato è sconosciuto e *potrebbe contenere dati sensibili*. Utilizzare [`buf.fill(0)`](/it/nodejs/api/buffer#buffillvalue-offset-end-encoding) per inizializzare tali istanze `Buffer` con zeri.

Quando si utilizza [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize) per allocare nuove istanze `Buffer`, le allocazioni inferiori a `Buffer.poolSize \>\>\> 1` (4KiB quando viene utilizzata la poolSize predefinita) vengono estratte da un singolo `Buffer` pre-allocato. Ciò consente alle applicazioni di evitare il sovraccarico della garbage collection derivante dalla creazione di molte istanze `Buffer` allocate individualmente. Questo approccio migliora sia le prestazioni che l'utilizzo della memoria eliminando la necessità di tracciare e ripulire tanti singoli oggetti `ArrayBuffer`.

Tuttavia, nel caso in cui uno sviluppatore possa aver bisogno di conservare una piccola porzione di memoria da un pool per un periodo di tempo indeterminato, potrebbe essere appropriato creare un'istanza `Buffer` non in pool utilizzando `Buffer.allocUnsafeSlow()` e quindi copiare i bit rilevanti.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Need to keep around a few small chunks of memory.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Allocate for retained data.
    const sb = Buffer.allocUnsafeSlow(10);

    // Copy the data into the new allocation.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Need to keep around a few small chunks of memory.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Allocate for retained data.
    const sb = Buffer.allocUnsafeSlow(10);

    // Copy the data into the new allocation.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```
:::

Verrà generato un `TypeError` se `size` non è un numero.


### Metodo statico: `Buffer.byteLength(string[, encoding])` {#static-method-bufferbytelengthstring-encoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v7.0.0 | Passare un input non valido ora genererà un errore. |
| v5.10.0 | Il parametro `string` può ora essere qualsiasi `TypedArray`, `DataView` o `ArrayBuffer`. |
| v0.1.90 | Aggiunto in: v0.1.90 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Un valore di cui calcolare la lunghezza.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `string` è una stringa, questa è la sua codifica. **Predefinito:** `'utf8'`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte contenuti all'interno di `string`.

Restituisce la lunghezza in byte di una stringa quando codificata usando `encoding`. Questo non è lo stesso di [`String.prototype.length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length), che non tiene conto della codifica che viene utilizzata per convertire la stringa in byte.

Per `'base64'`, `'base64url'` e `'hex'`, questa funzione presuppone un input valido. Per le stringhe che contengono dati non codificati in base64/esadecimale (ad es. spazi bianchi), il valore restituito potrebbe essere maggiore della lunghezza di un `Buffer` creato dalla stringa.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Prints: ½ + ¼ = ¾: 9 characters, 12 bytes
```

```js [CJS]
const { Buffer } = require('node:buffer');

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Prints: ½ + ¼ = ¾: 9 characters, 12 bytes
```
:::

Quando `string` è un `Buffer`/[`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)/[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)/[`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)/ [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), viene restituita la lunghezza in byte come riportato da `.byteLength`.


### Metodo statico: `Buffer.compare(buf1, buf2)` {#static-method-buffercomparebuf1-buf2}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Gli argomenti ora possono essere `Uint8Array`. |
| v0.11.13 | Aggiunto in: v0.11.13 |
:::

- `buf1` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `buf2` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Sia `-1`, `0` o `1`, a seconda del risultato del confronto. Vedere [`buf.compare()`](/it/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend) per i dettagli.

Confronta `buf1` con `buf2`, in genere allo scopo di ordinare array di istanze di `Buffer`. Questo è equivalente a chiamare [`buf1.compare(buf2)`](/it/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend).



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Prints: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (Questo risultato è uguale a: [buf2, buf1].)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Prints: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (Questo risultato è uguale a: [buf2, buf1].)
```
:::

### Metodo statico: `Buffer.concat(list[, totalLength])` {#static-method-bufferconcatlist-totallength}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Gli elementi di `list` ora possono essere `Uint8Array`. |
| v0.7.11 | Aggiunto in: v0.7.11 |
:::

- `list` [\<Buffer[]\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Elenco di istanze `Buffer` o [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) da concatenare.
- `totalLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lunghezza totale delle istanze `Buffer` in `list` quando concatenate.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Restituisce un nuovo `Buffer` che è il risultato della concatenazione di tutte le istanze `Buffer` in `list`.

Se l'elenco non ha elementi o se `totalLength` è 0, viene restituito un nuovo `Buffer` di lunghezza zero.

Se `totalLength` non viene fornito, viene calcolato dalle istanze `Buffer` in `list` sommando le loro lunghezze.

Se `totalLength` viene fornito, viene forzato a un intero senza segno. Se la lunghezza combinata dei `Buffer` in `list` supera `totalLength`, il risultato viene troncato a `totalLength`. Se la lunghezza combinata dei `Buffer` in `list` è inferiore a `totalLength`, lo spazio rimanente viene riempito con zeri.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crea un singolo `Buffer` da un elenco di tre istanze `Buffer`.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Prints: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Prints: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Prints: 42
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crea un singolo `Buffer` da un elenco di tre istanze `Buffer`.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Prints: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Prints: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Prints: 42
```
:::

`Buffer.concat()` può anche utilizzare il pool interno `Buffer` come fa [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize).


### Metodo statico: `Buffer.copyBytesFrom(view[, offset[, length]])` {#static-method-buffercopybytesfromview-offset-length}

**Aggiunto in: v19.8.0, v18.16.0**

- `view` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) La [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) da copiare.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset iniziale all'interno di `view`. **Predefinito:**: `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di elementi da `view` da copiare. **Predefinito:** `view.length - offset`.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Copia la memoria sottostante di `view` in un nuovo `Buffer`.

```js [ESM]
const u16 = new Uint16Array([0, 0xffff]);
const buf = Buffer.copyBytesFrom(u16, 1, 1);
u16[1] = 0;
console.log(buf.length); // 2
console.log(buf[0]); // 255
console.log(buf[1]); // 255
```
### Metodo statico: `Buffer.from(array)` {#static-method-bufferfromarray}

**Aggiunto in: v5.10.0**

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Alloca un nuovo `Buffer` utilizzando un `array` di byte nell'intervallo `0` – `255`. Le voci dell'array al di fuori di tale intervallo verranno troncate per adattarsi.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crea un nuovo Buffer contenente i byte UTF-8 della stringa 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crea un nuovo Buffer contenente i byte UTF-8 della stringa 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```
:::

Se `array` è un oggetto simile ad `Array` (ovvero, uno con una proprietà `length` di tipo `number`), viene trattato come se fosse un array, a meno che non sia un `Buffer` o un `Uint8Array`. Ciò significa che tutte le altre varianti di `TypedArray` vengono trattate come un `Array`. Per creare un `Buffer` dai byte che supportano un `TypedArray`, utilizzare [`Buffer.copyBytesFrom()`](/it/nodejs/api/buffer#static-method-buffercopybytesfromview-offset-length).

Verrà generato un `TypeError` se `array` non è un `Array` o un altro tipo appropriato per le varianti di `Buffer.from()`.

`Buffer.from(array)` e [`Buffer.from(string)`](/it/nodejs/api/buffer#static-method-bufferfromstring-encoding) possono anche utilizzare il pool `Buffer` interno come fa [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize).


### Metodo statico: `Buffer.from(arrayBuffer[, byteOffset[, length]])` {#static-method-bufferfromarraybuffer-byteoffset-length}

**Aggiunto in: v5.10.0**

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Un [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), ad esempio la proprietà `.buffer` di un [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Indice del primo byte da esporre. **Predefinito:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da esporre. **Predefinito:** `arrayBuffer.byteLength - byteOffset`.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Questo crea una visualizzazione di [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) senza copiare la memoria sottostante. Ad esempio, quando viene passato un riferimento alla proprietà `.buffer` di un'istanza [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), il `Buffer` appena creato condividerà la stessa memoria allocata dell'[`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) sottostante di [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Condivide la memoria con `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Stampa: <Buffer 88 13 a0 0f>

// La modifica dell'Uint16Array originale modifica anche il Buffer.
arr[1] = 6000;

console.log(buf);
// Stampa: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Condivide la memoria con `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Stampa: <Buffer 88 13 a0 0f>

// La modifica dell'Uint16Array originale modifica anche il Buffer.
arr[1] = 6000;

console.log(buf);
// Stampa: <Buffer 88 13 70 17>
```
:::

Gli argomenti opzionali `byteOffset` e `length` specificano un intervallo di memoria all'interno di `arrayBuffer` che sarà condiviso da `Buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Stampa: 2
```

```js [CJS]
const { Buffer } = require('node:buffer');

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Stampa: 2
```
:::

Verrà generato un `TypeError` se `arrayBuffer` non è un [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) o un [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) o un altro tipo appropriato per le varianti `Buffer.from()`.

È importante ricordare che un `ArrayBuffer` di supporto può coprire un intervallo di memoria che si estende oltre i limiti di una visualizzazione `TypedArray`. Un nuovo `Buffer` creato utilizzando la proprietà `buffer` di un `TypedArray` può estendersi oltre l'intervallo del `TypedArray`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 elementi
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 elementi
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Stampa: <Buffer 63 64 65 66>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 elementi
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 elementi
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Stampa: <Buffer 63 64 65 66>
```
:::


### Metodo statico: `Buffer.from(buffer)` {#static-method-bufferfrombuffer}

**Aggiunto in: v5.10.0**

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un `Buffer` esistente o [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) da cui copiare i dati.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Copia i dati `buffer` passati in una nuova istanza `Buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer
```
:::

Verrà generato un `TypeError` se `buffer` non è un `Buffer` o un altro tipo appropriato per le varianti di `Buffer.from()`.

### Metodo statico: `Buffer.from(object[, offsetOrEncoding[, length]])` {#static-method-bufferfromobject-offsetorencoding-length}

**Aggiunto in: v8.2.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto che supporta `Symbol.toPrimitive` o `valueOf()`.
- `offsetOrEncoding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un offset di byte o una codifica.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Una lunghezza.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Per gli oggetti la cui funzione `valueOf()` restituisce un valore non strettamente uguale a `object`, restituisce `Buffer.from(object.valueOf(), offsetOrEncoding, length)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from(new String('this is a test'));
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from(new String('this is a test'));
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```
:::

Per gli oggetti che supportano `Symbol.toPrimitive`, restituisce `Buffer.from(object[Symbol.toPrimitive]('string'), offsetOrEncoding)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```js [CJS]
const { Buffer } = require('node:buffer');

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```
:::

Verrà generato un `TypeError` se `object` non ha i metodi menzionati o non è di un altro tipo appropriato per le varianti di `Buffer.from()`.


### Metodo statico: `Buffer.from(string[, encoding])` {#static-method-bufferfromstring-encoding}

**Aggiunto in: v5.10.0**

- `string` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una stringa da codificare.
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica di `string`. **Predefinito:** `'utf8'`.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Crea un nuovo `Buffer` contenente `string`. Il parametro `encoding` identifica la codifica dei caratteri da utilizzare durante la conversione di `string` in byte.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Stampa: this is a tést
console.log(buf2.toString());
// Stampa: this is a tést
console.log(buf1.toString('latin1'));
// Stampa: this is a tÃ©st
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Stampa: this is a tést
console.log(buf2.toString());
// Stampa: this is a tést
console.log(buf1.toString('latin1'));
// Stampa: this is a tÃ©st
```
:::

Un `TypeError` verrà generato se `string` non è una stringa o un altro tipo appropriato per le varianti di `Buffer.from()`.

[`Buffer.from(string)`](/it/nodejs/api/buffer#static-method-bufferfromstring-encoding) può anche utilizzare il pool `Buffer` interno come fa [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize).

### Metodo statico: `Buffer.isBuffer(obj)` {#static-method-bufferisbufferobj}

**Aggiunto in: v0.1.101**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se `obj` è un `Buffer`, `false` altrimenti.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```
:::


### Metodo statico: `Buffer.isEncoding(encoding)` {#static-method-bufferisencodingencoding}

**Aggiunto in: v0.9.1**

- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nome di codifica dei caratteri da controllare.
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se `encoding` è il nome di una codifica dei caratteri supportata, o `false` altrimenti.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

console.log(Buffer.isEncoding('utf8'));
// Prints: true

console.log(Buffer.isEncoding('hex'));
// Prints: true

console.log(Buffer.isEncoding('utf/8'));
// Prints: false

console.log(Buffer.isEncoding(''));
// Prints: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

console.log(Buffer.isEncoding('utf8'));
// Prints: true

console.log(Buffer.isEncoding('hex'));
// Prints: true

console.log(Buffer.isEncoding('utf/8'));
// Prints: false

console.log(Buffer.isEncoding(''));
// Prints: false
```
:::

### Proprietà della classe: `Buffer.poolSize` {#class-property-bufferpoolsize}

**Aggiunto in: v0.11.3**

- [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `8192`

Questa è la dimensione (in byte) delle istanze interne di `Buffer` preallocate utilizzate per il pooling. Questo valore può essere modificato.

### `buf[index]` {#bufindex}

- `index` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'operatore di indice `[index]` può essere utilizzato per ottenere e impostare l'ottetto nella posizione `index` in `buf`. I valori si riferiscono ai singoli byte, quindi l'intervallo di valori legale è compreso tra `0x00` e `0xFF` (esadecimale) o `0` e `255` (decimale).

Questo operatore viene ereditato da `Uint8Array`, quindi il suo comportamento sull'accesso fuori dai limiti è lo stesso di `Uint8Array`. In altre parole, `buf[index]` restituisce `undefined` quando `index` è negativo o maggiore o uguale a `buf.length`, e `buf[index] = value` non modifica il buffer se `index` è negativo o `\>= buf.length`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Copia una stringa ASCII in un `Buffer` un byte alla volta.
// (Questo funziona solo per stringhe ASCII. In generale, si dovrebbe usare
// `Buffer.from()` per eseguire questa conversione.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Prints: Node.js
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Copia una stringa ASCII in un `Buffer` un byte alla volta.
// (Questo funziona solo per stringhe ASCII. In generale, si dovrebbe usare
// `Buffer.from()` per eseguire questa conversione.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Prints: Node.js
```
:::


### `buf.buffer` {#bufbuffer}

- [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) L'`ArrayBuffer` sottostante basato sul quale viene creato questo oggetto `Buffer`.

Non è garantito che questo `ArrayBuffer` corrisponda esattamente al `Buffer` originale. Consulta le note su `buf.byteOffset` per i dettagli.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```
:::

### `buf.byteOffset` {#bufbyteoffset}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'`byteOffset` dell'oggetto `ArrayBuffer` sottostante del `Buffer`.

Quando si imposta `byteOffset` in `Buffer.from(ArrayBuffer, byteOffset, length)`, o talvolta quando si alloca un `Buffer` più piccolo di `Buffer.poolSize`, il buffer non inizia da un offset zero sull'`ArrayBuffer` sottostante.

Questo può causare problemi quando si accede direttamente all'`ArrayBuffer` sottostante utilizzando `buf.buffer`, poiché altre parti dell'`ArrayBuffer` potrebbero non essere correlate all'oggetto `Buffer` stesso.

Un problema comune quando si crea un oggetto `TypedArray` che condivide la sua memoria con un `Buffer` è che in questo caso è necessario specificare correttamente il `byteOffset`:



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```
:::


### `buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])` {#bufcomparetarget-targetstart-targetend-sourcestart-sourceend}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Il parametro `target` ora può essere un `Uint8Array`. |
| v5.11.0 | Sono ora supportati parametri aggiuntivi per specificare gli offset. |
| v0.11.13 | Aggiunto in: v0.11.13 |
:::

- `target` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un `Buffer` o [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) con cui confrontare `buf`.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset all'interno di `target` da cui iniziare il confronto. **Predefinito:** `0`.
- `targetEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset all'interno di `target` in cui terminare il confronto (non incluso). **Predefinito:** `target.length`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset all'interno di `buf` da cui iniziare il confronto. **Predefinito:** `0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset all'interno di `buf` in cui terminare il confronto (non incluso). **Predefinito:** [`buf.length`](/it/nodejs/api/buffer#buflength).
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Confronta `buf` con `target` e restituisce un numero che indica se `buf` viene prima, dopo o è uguale a `target` nell'ordinamento. Il confronto si basa sulla sequenza effettiva di byte in ciascun `Buffer`.

- Viene restituito `0` se `target` è uguale a `buf`
- Viene restituito `1` se `target` deve venire *prima* di `buf` quando ordinato.
- Viene restituito `-1` se `target` deve venire *dopo* `buf` quando ordinato.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```
:::

Gli argomenti opzionali `targetStart`, `targetEnd`, `sourceStart` e `sourceEnd` possono essere utilizzati per limitare il confronto a intervalli specifici rispettivamente all'interno di `target` e `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
```
:::

Viene generato [`ERR_OUT_OF_RANGE`](/it/nodejs/api/errors#err_out_of_range) se `targetStart \< 0`, `sourceStart \< 0`, `targetEnd \> target.byteLength` o `sourceEnd \> source.byteLength`.


### `buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])` {#bufcopytarget-targetstart-sourcestart-sourceend}

**Aggiunto in: v0.1.90**

- `target` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un `Buffer` o [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) in cui copiare.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset all'interno di `target` in cui iniziare a scrivere. **Predefinito:** `0`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset all'interno di `buf` da cui iniziare a copiare. **Predefinito:** `0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset all'interno di `buf` in cui interrompere la copia (non incluso). **Predefinito:** [`buf.length`](/it/nodejs/api/buffer#buflength).
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte copiati.

Copia i dati da una regione di `buf` a una regione in `target`, anche se la regione di memoria `target` si sovrappone a `buf`.

[`TypedArray.prototype.set()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set) esegue la stessa operazione ed è disponibile per tutti i TypedArray, inclusi i `Buffer` di Node.js, sebbene accetti argomenti di funzione diversi.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crea due istanze di `Buffer`.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 è il valore ASCII decimale per 'a'.
  buf1[i] = i + 97;
}

// Copia i byte da 16 a 19 di `buf1` in `buf2` a partire dal byte 8 di `buf2`.
buf1.copy(buf2, 8, 16, 20);
// Questo è equivalente a:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crea due istanze di `Buffer`.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 è il valore ASCII decimale per 'a'.
  buf1[i] = i + 97;
}

// Copia i byte da 16 a 19 di `buf1` in `buf2` a partire dal byte 8 di `buf2`.
buf1.copy(buf2, 8, 16, 20);
// Questo è equivalente a:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
```
:::

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crea un `Buffer` e copia i dati da una regione a una regione sovrapposta
// all'interno dello stesso `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 è il valore ASCII decimale per 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Prints: efghijghijklmnopqrstuvwxyz
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crea un `Buffer` e copia i dati da una regione a una regione sovrapposta
// all'interno dello stesso `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 è il valore ASCII decimale per 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Prints: efghijghijklmnopqrstuvwxyz
```
:::


### `buf.entries()` {#bufentries}

**Aggiunto in: v1.1.0**

- Restituisce: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Crea e restituisce un [iteratore](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) di coppie `[indice, byte]` dal contenuto di `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Registra l'intero contenuto di un `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Stampa:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Registra l'intero contenuto di un `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Stampa:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```
:::

### `buf.equals(otherBuffer)` {#bufequalsotherbuffer}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Gli argomenti possono ora essere `Uint8Array`. |
| v0.11.13 | Aggiunto in: v0.11.13 |
:::

- `otherBuffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un `Buffer` o [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) con cui confrontare `buf`.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se sia `buf` che `otherBuffer` hanno esattamente gli stessi byte, `false` altrimenti. Equivalente a [`buf.compare(otherBuffer) === 0`](/it/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Stampa: true
console.log(buf1.equals(buf3));
// Stampa: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Stampa: true
console.log(buf1.equals(buf3));
// Stampa: false
```
:::


### `buf.fill(value[, offset[, end]][, encoding])` {#buffillvalue-offset-end-encoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.0.0 | Genera `ERR_OUT_OF_RANGE` invece di `ERR_INDEX_OUT_OF_RANGE`. |
| v10.0.0 | I valori `end` negativi generano un errore `ERR_INDEX_OUT_OF_RANGE`. |
| v10.0.0 | Il tentativo di riempire un buffer di lunghezza diversa da zero con un buffer di lunghezza zero innesca un'eccezione generata. |
| v10.0.0 | Specificare una stringa non valida per `value` innesca un'eccezione generata. |
| v5.7.0 | Il parametro `encoding` è ora supportato. |
| v0.5.0 | Aggiunto in: v0.5.0 |
:::

- `value` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il valore con cui riempire `buf`. Il valore vuoto (stringa, Uint8Array, Buffer) viene forzato a `0`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a riempire `buf`. **Predefinito:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dove interrompere il riempimento di `buf` (non incluso). **Predefinito:** [`buf.length`](/it/nodejs/api/buffer#buflength).
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica per `value` se `value` è una stringa. **Predefinito:** `'utf8'`.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Un riferimento a `buf`.

Riempie `buf` con il `value` specificato. Se `offset` e `end` non sono forniti, verrà riempito l'intero `buf`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Riempi un `Buffer` con il carattere ASCII 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Stampa: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Riempi un buffer con una stringa vuota
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Stampa: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Riempi un `Buffer` con il carattere ASCII 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Stampa: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Riempi un buffer con una stringa vuota
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Stampa: <Buffer 00 00 00 00 00>
```
:::

`value` viene forzato a un valore `uint32` se non è una stringa, `Buffer` o un numero intero. Se l'intero risultante è maggiore di `255` (decimale), `buf` verrà riempito con `value & 255`.

Se la scrittura finale di un'operazione `fill()` ricade su un carattere multi-byte, vengono scritti solo i byte di quel carattere che rientrano in `buf`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Riempi un `Buffer` con un carattere che occupa due byte in UTF-8.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Stampa: <Buffer c8 a2 c8 a2 c8>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Riempi un `Buffer` con un carattere che occupa due byte in UTF-8.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Stampa: <Buffer c8 a2 c8 a2 c8>
```
:::

Se `value` contiene caratteri non validi, viene troncato; se non rimangono dati di riempimento validi, viene generata un'eccezione:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Stampa: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Stampa: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Genera un'eccezione.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Stampa: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Stampa: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Genera un'eccezione.
```
:::


### `buf.includes(value[, byteOffset][, encoding])` {#bufincludesvalue-byteoffset-encoding}

**Aggiunto in: v5.3.0**

- `value` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Cosa cercare.
- `byteOffset` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dove iniziare la ricerca in `buf`. Se negativo, l'offset viene calcolato dalla fine di `buf`. **Predefinito:** `0`.
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `value` è una stringa, questa è la sua codifica. **Predefinito:** `'utf8'`.
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se `value` è stato trovato in `buf`, `false` altrimenti.

Equivalente a [`buf.indexOf() !== -1`](/it/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 is the decimal ASCII value for 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 is the decimal ASCII value for 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```
:::


### `buf.indexOf(value[, byteOffset][, encoding])` {#bufindexofvalue-byteoffset-encoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Il `value` ora può essere un `Uint8Array`. |
| v5.7.0, v4.4.0 | Quando viene passato `encoding`, il parametro `byteOffset` non è più richiesto. |
| v1.5.0 | Aggiunto in: v1.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Cosa cercare.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dove iniziare la ricerca in `buf`. Se negativo, l'offset viene calcolato dalla fine di `buf`. **Predefinito:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `value` è una stringa, questa è la codifica utilizzata per determinare la rappresentazione binaria della stringa che verrà cercata in `buf`. **Predefinito:** `'utf8'`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'indice della prima occorrenza di `value` in `buf`, o `-1` se `buf` non contiene `value`.

Se `value` è:

- una stringa, `value` viene interpretato secondo la codifica dei caratteri in `encoding`.
- un `Buffer` o [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), `value` verrà utilizzato nella sua interezza. Per confrontare un `Buffer` parziale, usa [`buf.subarray`](/it/nodejs/api/buffer#bufsubarraystart-end).
- un numero, `value` verrà interpretato come un valore intero a 8 bit senza segno compreso tra `0` e `255`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```
:::

Se `value` non è una stringa, un numero o un `Buffer`, questo metodo genererà un `TypeError`. Se `value` è un numero, verrà forzato a un valore di byte valido, un intero compreso tra 0 e 255.

Se `byteOffset` non è un numero, verrà forzato a un numero. Se il risultato della coercizione è `NaN` o `0`, verrà cercato l'intero buffer. Questo comportamento corrisponde a [`String.prototype.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```

```js [CJS]
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```
:::

Se `value` è una stringa vuota o un `Buffer` vuoto e `byteOffset` è inferiore a `buf.length`, verrà restituito `byteOffset`. Se `value` è vuoto e `byteOffset` è almeno `buf.length`, verrà restituito `buf.length`.


### `buf.keys()` {#bufkeys}

**Aggiunto in: v1.1.0**

- Restituisce: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Crea e restituisce un [iteratore](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) delle chiavi (indici) di `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
```
:::

### `buf.lastIndexOf(value[, byteOffset][, encoding])` {#buflastindexofvalue-byteoffset-encoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Il `value` ora può essere un `Uint8Array`. |
| v6.0.0 | Aggiunto in: v6.0.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Cosa cercare.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dove iniziare la ricerca in `buf`. Se negativo, l'offset viene calcolato dalla fine di `buf`. **Predefinito:** `buf.length - 1`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `value` è una stringa, questa è la codifica utilizzata per determinare la rappresentazione binaria della stringa che verrà cercata in `buf`. **Predefinito:** `'utf8'`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'indice dell'ultima occorrenza di `value` in `buf` o `-1` se `buf` non contiene `value`.

Identico a [`buf.indexOf()`](/it/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding), tranne per il fatto che viene trovata l'ultima occorrenza di `value` anziché la prima occorrenza.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Prints: 0
console.log(buf.lastIndexOf('buffer'));
// Prints: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Prints: 17
console.log(buf.lastIndexOf(97));
// Prints: 15 (97 is the decimal ASCII value for 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Prints: -1
console.log(buf.lastIndexOf('buffer', 5));
// Prints: 5
console.log(buf.lastIndexOf('buffer', 4));
// Prints: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Prints: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Prints: 4
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Prints: 0
console.log(buf.lastIndexOf('buffer'));
// Prints: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Prints: 17
console.log(buf.lastIndexOf(97));
// Prints: 15 (97 is the decimal ASCII value for 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Prints: -1
console.log(buf.lastIndexOf('buffer', 5));
// Prints: 5
console.log(buf.lastIndexOf('buffer', 4));
// Prints: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Prints: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Prints: 4
```
:::

Se `value` non è una stringa, un numero o un `Buffer`, questo metodo genererà un `TypeError`. Se `value` è un numero, verrà forzato a un valore di byte valido, un numero intero compreso tra 0 e 255.

Se `byteOffset` non è un numero, verrà forzato a un numero. Qualsiasi argomento che si converte in `NaN`, come `{}` o `undefined`, cercherà nell'intero buffer. Questo comportamento corrisponde a [`String.prototype.lastIndexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```

```js [CJS]
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```
:::

Se `value` è una stringa vuota o un `Buffer` vuoto, verrà restituito `byteOffset`.


### `buf.length` {#buflength}

**Aggiunto in: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce il numero di byte in `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crea un `Buffer` e ci scrive una stringa più corta usando UTF-8.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Stampa: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Stampa: 1234
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crea un `Buffer` e ci scrive una stringa più corta usando UTF-8.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Stampa: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Stampa: 1234
```
:::

### `buf.parent` {#bufparent}

**Deprecato a partire da: v8.0.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Utilizzare invece [`buf.buffer`](/it/nodejs/api/buffer#bufbuffer).
:::

La proprietà `buf.parent` è un alias deprecato per `buf.buffer`.

### `buf.readBigInt64BE([offset])` {#bufreadbigint64beoffset}

**Aggiunto in: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare: `0 \<= offset \<= buf.length - 8`. **Predefinito:** `0`.
- Restituisce: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Legge un intero a 64 bit con segno, big-endian da `buf` all'`offset` specificato.

Gli interi letti da un `Buffer` vengono interpretati come valori con segno in complemento a due.

### `buf.readBigInt64LE([offset])` {#bufreadbigint64leoffset}

**Aggiunto in: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare: `0 \<= offset \<= buf.length - 8`. **Predefinito:** `0`.
- Restituisce: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Legge un intero a 64 bit con segno, little-endian da `buf` all'`offset` specificato.

Gli interi letti da un `Buffer` vengono interpretati come valori con segno in complemento a due.


### `buf.readBigUInt64BE([offset])` {#bufreadbiguint64beoffset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.10.0, v12.19.0 | Questa funzione è disponibile anche come `buf.readBigUint64BE()`. |
| v12.0.0, v10.20.0 | Aggiunto in: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a leggere. Deve soddisfare: `0 \<= offset \<= buf.length - 8`. **Predefinito:** `0`.
- Restituisce: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Legge un intero a 64 bit senza segno, big-endian da `buf` all'`offset` specificato.

Questa funzione è disponibile anche con l'alias `readBigUint64BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Stampa: 4294967295n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Stampa: 4294967295n
```
:::

### `buf.readBigUInt64LE([offset])` {#bufreadbiguint64leoffset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.10.0, v12.19.0 | Questa funzione è disponibile anche come `buf.readBigUint64LE()`. |
| v12.0.0, v10.20.0 | Aggiunto in: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a leggere. Deve soddisfare: `0 \<= offset \<= buf.length - 8`. **Predefinito:** `0`.
- Restituisce: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Legge un intero a 64 bit senza segno, little-endian da `buf` all'`offset` specificato.

Questa funzione è disponibile anche con l'alias `readBigUint64LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Stampa: 18446744069414584320n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Stampa: 18446744069414584320n
```
:::


### `buf.readDoubleBE([offset])` {#bufreaddoublebeoffset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare `0 \<= offset \<= buf.length - 8`. **Predefinito:** `0`.
- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge un double a 64 bit, big-endian da `buf` all'`offset` specificato.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Stampa: 8.20788039913184e-304
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Stampa: 8.20788039913184e-304
```
:::

### `buf.readDoubleLE([offset])` {#bufreaddoubleleoffset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare `0 \<= offset \<= buf.length - 8`. **Predefinito:** `0`.
- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge un double a 64 bit, little-endian da `buf` all'`offset` specificato.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Stampa: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Genera ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Stampa: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Genera ERR_OUT_OF_RANGE.
```
:::


### `buf.readFloatBE([offset])` {#bufreadfloatbeoffset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare `0 \<= offset \<= buf.length - 4`. **Predefinito:** `0`.
- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge un float a 32 bit, big-endian da `buf` all'`offset` specificato.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Stampa: 2.387939260590663e-38
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Stampa: 2.387939260590663e-38
```
:::

### `buf.readFloatLE([offset])` {#bufreadfloatleoffset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare `0 \<= offset \<= buf.length - 4`. **Predefinito:** `0`.
- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge un float a 32 bit, little-endian da `buf` all'`offset` specificato.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Stampa: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Genera ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Stampa: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Genera ERR_OUT_OF_RANGE.
```
:::


### `buf.readInt8([offset])` {#bufreadint8offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.5.0 | Aggiunto in: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare `0 \<= offset \<= buf.length - 1`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge un intero a 8 bit con segno da `buf` all'`offset` specificato.

Gli interi letti da un `Buffer` vengono interpretati come valori con segno in complemento a due.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Stampa: -1
console.log(buf.readInt8(1));
// Stampa: 5
console.log(buf.readInt8(2));
// Genera ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Stampa: -1
console.log(buf.readInt8(1));
// Stampa: 5
console.log(buf.readInt8(2));
// Genera ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt16BE([offset])` {#bufreadint16beoffset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.5.5 | Aggiunto in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare `0 \<= offset \<= buf.length - 2`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge un intero a 16 bit con segno, big-endian da `buf` all'`offset` specificato.

Gli interi letti da un `Buffer` vengono interpretati come valori con segno in complemento a due.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Stampa: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Stampa: 5
```
:::


### `buf.readInt16LE([offset])` {#bufreadint16leoffset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32` più. |
| v0.5.5 | Aggiunto in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare `0 \<= offset \<= buf.length - 2`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge un intero a 16 bit con segno, in formato little-endian da `buf` all'`offset` specificato.

Gli interi letti da un `Buffer` vengono interpretati come valori con segno in complemento a due.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Stampa: 1280
console.log(buf.readInt16LE(1));
// Lancia ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Stampa: 1280
console.log(buf.readInt16LE(1));
// Lancia ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt32BE([offset])` {#bufreadint32beoffset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32` più. |
| v0.5.5 | Aggiunto in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare `0 \<= offset \<= buf.length - 4`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge un intero a 32 bit con segno, in formato big-endian da `buf` all'`offset` specificato.

Gli interi letti da un `Buffer` vengono interpretati come valori con segno in complemento a due.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Stampa: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Stampa: 5
```
:::


### `buf.readInt32LE([offset])` {#bufreadint32leoffset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.5.5 | Aggiunto in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a leggere. Deve soddisfare `0 \<= offset \<= buf.length - 4`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge un intero a 32 bit con segno, little-endian da `buf` all'`offset` specificato.

Gli interi letti da un `Buffer` vengono interpretati come valori con segno in complemento a due.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Stampa: 83886080
console.log(buf.readInt32LE(1));
// Genera ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Stampa: 83886080
console.log(buf.readInt32LE(1));
// Genera ERR_OUT_OF_RANGE.
```
:::

### `buf.readIntBE(offset, byteLength)` {#bufreadintbeoffset-bytelength}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset e `byteLength` a `uint32`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a leggere. Deve soddisfare `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da leggere. Deve soddisfare `0 \< byteLength \<= 6`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge `byteLength` numero di byte da `buf` all'`offset` specificato e interpreta il risultato come un valore con segno, in complemento a due, big-endian, supportando fino a 48 bit di precisione.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Stampa: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// Genera ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// Genera ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Stampa: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// Genera ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// Genera ERR_OUT_OF_RANGE.
```
:::


### `buf.readIntLE(offset, byteLength)` {#bufreadintleoffset-bytelength}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset e `byteLength` a `uint32`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a leggere. Deve soddisfare `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da leggere. Deve soddisfare `0 \< byteLength \<= 6`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge `byteLength` numero di byte da `buf` all'`offset` specificato e interpreta il risultato come un valore con segno in complemento a due little-endian, supportando fino a 48 bit di precisione.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Stampa: -546f87a9cbee
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Stampa: -546f87a9cbee
```
:::

### `buf.readUInt8([offset])` {#bufreaduint8offset}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.9.0, v12.19.0 | Questa funzione è disponibile anche come `buf.readUint8()`. |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.5.0 | Aggiunto in: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a leggere. Deve soddisfare `0 \<= offset \<= buf.length - 1`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge un numero intero senza segno a 8 bit da `buf` all'`offset` specificato.

Questa funzione è disponibile anche con l'alias `readUint8`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Stampa: 1
console.log(buf.readUInt8(1));
// Stampa: 254
console.log(buf.readUInt8(2));
// Lancia ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Stampa: 1
console.log(buf.readUInt8(1));
// Stampa: 254
console.log(buf.readUInt8(2));
// Lancia ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt16BE([offset])` {#bufreaduint16beoffset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.9.0, v12.19.0 | Questa funzione è disponibile anche come `buf.readUint16BE()`. |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.5.5 | Aggiunto in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare `0 \<= offset \<= buf.length - 2`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge un intero a 16 bit senza segno, big-endian da `buf` all'`offset` specificato.

Questa funzione è disponibile anche con l'alias `readUint16BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Stampa: 1234
console.log(buf.readUInt16BE(1).toString(16));
// Stampa: 3456
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Stampa: 1234
console.log(buf.readUInt16BE(1).toString(16));
// Stampa: 3456
```
:::

### `buf.readUInt16LE([offset])` {#bufreaduint16leoffset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.9.0, v12.19.0 | Questa funzione è disponibile anche come `buf.readUint16LE()`. |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.5.5 | Aggiunto in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare `0 \<= offset \<= buf.length - 2`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge un intero a 16 bit senza segno, little-endian da `buf` all'`offset` specificato.

Questa funzione è disponibile anche con l'alias `readUint16LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Stampa: 3412
console.log(buf.readUInt16LE(1).toString(16));
// Stampa: 5634
console.log(buf.readUInt16LE(2).toString(16));
// Genera ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Stampa: 3412
console.log(buf.readUInt16LE(1).toString(16));
// Stampa: 5634
console.log(buf.readUInt16LE(2).toString(16));
// Genera ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt32BE([offset])` {#bufreaduint32beoffset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.9.0, v12.19.0 | Questa funzione è disponibile anche come `buf.readUint32BE()`. |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.5.5 | Aggiunto in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare `0 \<= offset \<= buf.length - 4`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge un intero a 32 bit senza segno, big-endian da `buf` all'`offset` specificato.

Questa funzione è disponibile anche con l'alias `readUint32BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Stampa: 12345678
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Stampa: 12345678
```
:::

### `buf.readUInt32LE([offset])` {#bufreaduint32leoffset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.9.0, v12.19.0 | Questa funzione è disponibile anche come `buf.readUint32LE()`. |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.5.5 | Aggiunto in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare `0 \<= offset \<= buf.length - 4`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge un intero a 32 bit senza segno, little-endian da `buf` all'`offset` specificato.

Questa funzione è disponibile anche con l'alias `readUint32LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Stampa: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Genera ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Stampa: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Genera ERR_OUT_OF_RANGE.
```
:::


### `buf.readUIntBE(offset, byteLength)` {#bufreaduintbeoffset-bytelength}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.9.0, v12.19.0 | Questa funzione è disponibile anche come `buf.readUintBE()`. |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset e `byteLength` a `uint32`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da leggere. Deve soddisfare `0 \< byteLength \<= 6`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge `byteLength` numero di byte da `buf` all'`offset` specificato e interpreta il risultato come un intero senza segno big-endian che supporta fino a 48 bit di precisione.

Questa funzione è disponibile anche con l'alias `readUintBE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Stampa: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Lancia ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Stampa: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Lancia ERR_OUT_OF_RANGE.
```
:::

### `buf.readUIntLE(offset, byteLength)` {#bufreaduintleoffset-bytelength}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.9.0, v12.19.0 | Questa funzione è disponibile anche come `buf.readUintLE()`. |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset e `byteLength` a `uint32`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare la lettura. Deve soddisfare `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da leggere. Deve soddisfare `0 \< byteLength \<= 6`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Legge `byteLength` numero di byte da `buf` all'`offset` specificato e interpreta il risultato come un intero senza segno, little-endian che supporta fino a 48 bit di precisione.

Questa funzione è disponibile anche con l'alias `readUintLE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Stampa: ab9078563412
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Stampa: ab9078563412
```
:::


### `buf.subarray([start[, end]])` {#bufsubarraystart-end}

**Aggiunto in: v3.0.0**

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dove inizierà il nuovo `Buffer`. **Predefinito:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dove terminerà il nuovo `Buffer` (non incluso). **Predefinito:** [`buf.length`](/it/nodejs/api/buffer#buflength).
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Restituisce un nuovo `Buffer` che fa riferimento alla stessa memoria dell'originale, ma con offset e ritagliato dagli indici `start` e `end`.

Specificare `end` maggiore di [`buf.length`](/it/nodejs/api/buffer#buflength) restituirà lo stesso risultato di `end` uguale a [`buf.length`](/it/nodejs/api/buffer#buflength).

Questo metodo è ereditato da [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray).

La modifica della nuova slice `Buffer` modificherà la memoria nel `Buffer` originale perché la memoria allocata dei due oggetti si sovrappone.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crea un `Buffer` con l'alfabeto ASCII, prendi una slice e modifica un byte
// dal `Buffer` originale.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 è il valore ASCII decimale per 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: !bc
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crea un `Buffer` con l'alfabeto ASCII, prendi una slice e modifica un byte
// dal `Buffer` originale.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 è il valore ASCII decimale per 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: !bc
```
:::

Specificare indici negativi fa sì che la slice venga generata rispetto alla fine di `buf` anziché all'inizio.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Prints: buffe
// (Equivalent to buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Prints: buff
// (Equivalent to buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Prints: uff
// (Equivalent to buf.subarray(1, 4).)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Prints: buffe
// (Equivalent to buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Prints: buff
// (Equivalent to buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Prints: uff
// (Equivalent to buf.subarray(1, 4).)
```
:::


### `buf.slice([start[, end]])` {#bufslicestart-end}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.5.0, v16.15.0 | Il metodo buf.slice() è stato deprecato. |
| v7.0.0 | Tutti gli offset vengono ora forzati a numeri interi prima di eseguire qualsiasi calcolo con essi. |
| v7.1.0, v6.9.2 | La forzatura degli offset a numeri interi ora gestisce correttamente i valori al di fuori dell'intervallo di interi a 32 bit. |
| v0.3.0 | Aggiunto in: v0.3.0 |
:::

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dove inizierà il nuovo `Buffer`. **Predefinito:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dove terminerà il nuovo `Buffer` (non incluso). **Predefinito:** [`buf.length`](/it/nodejs/api/buffer#buflength).
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Utilizzare invece [`buf.subarray`](/it/nodejs/api/buffer#bufsubarraystart-end).
:::

Restituisce un nuovo `Buffer` che fa riferimento alla stessa memoria dell'originale, ma con offset e ritagliata dagli indici `start` e `end`.

Questo metodo non è compatibile con `Uint8Array.prototype.slice()`, che è una superclasse di `Buffer`. Per copiare la slice, usa `Uint8Array.prototype.slice()`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Stampa: cuffer

console.log(buf.toString());
// Stampa: buffer

// Con buf.slice(), il buffer originale viene modificato.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Stampa: cuffer
console.log(buf.toString());
// Stampa anche: cuffer (!)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Stampa: cuffer

console.log(buf.toString());
// Stampa: buffer

// Con buf.slice(), il buffer originale viene modificato.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Stampa: cuffer
console.log(buf.toString());
// Stampa anche: cuffer (!)
```
:::


### `buf.swap16()` {#bufswap16}

**Aggiunto in: v5.10.0**

- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Un riferimento a `buf`.

Interpreta `buf` come un array di interi a 16 bit senza segno e inverte l'ordine dei byte *in-place*. Lancia [`ERR_INVALID_BUFFER_SIZE`](/it/nodejs/api/errors#err_invalid_buffer_size) se [`buf.length`](/it/nodejs/api/buffer#buflength) non è un multiplo di 2.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::

Un uso conveniente di `buf.swap16()` è quello di eseguire una conversione in-place veloce tra UTF-16 little-endian e UTF-16 big-endian:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```
:::

### `buf.swap32()` {#bufswap32}

**Aggiunto in: v5.10.0**

- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Un riferimento a `buf`.

Interpreta `buf` come un array di interi a 32 bit senza segno e inverte l'ordine dei byte *in-place*. Lancia [`ERR_INVALID_BUFFER_SIZE`](/it/nodejs/api/errors#err_invalid_buffer_size) se [`buf.length`](/it/nodejs/api/buffer#buflength) non è un multiplo di 4.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::

### `buf.swap64()` {#bufswap64}

**Aggiunto in: v6.3.0**

- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Un riferimento a `buf`.

Interpreta `buf` come un array di numeri a 64 bit e scambia l'ordine dei byte *sul posto*. Genera [`ERR_INVALID_BUFFER_SIZE`](/it/nodejs/api/errors#err_invalid_buffer_size) se [`buf.length`](/it/nodejs/api/buffer#buflength) non è un multiplo di 8.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Prints: <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Prints: <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::

### `buf.toJSON()` {#buftojson}

**Aggiunto in: v0.9.2**

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce una rappresentazione JSON di `buf`. [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) chiama implicitamente questa funzione quando si esegue la serializzazione di un'istanza `Buffer`.

`Buffer.from()` accetta oggetti nel formato restituito da questo metodo. In particolare, `Buffer.from(buf.toJSON())` funziona come `Buffer.from(buf)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
```
:::


### `buf.toString([encoding[, start[, end]]])` {#buftostringencoding-start-end}

**Aggiunto in: v0.1.90**

- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica dei caratteri da utilizzare. **Predefinito:** `'utf8'`.
- `start` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset di byte da cui iniziare la decodifica. **Predefinito:** `0`.
- `end` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset di byte in cui interrompere la decodifica (non incluso). **Predefinito:** [`buf.length`](/it/nodejs/api/buffer#buflength).
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Decodifica `buf` in una stringa in base alla codifica dei caratteri specificata in `encoding`. `start` e `end` possono essere passati per decodificare solo un sottoinsieme di `buf`.

Se `encoding` è `'utf8'` e una sequenza di byte nell'input non è UTF-8 valida, ogni byte non valido viene sostituito con il carattere di sostituzione `U+FFFD`.

La lunghezza massima di un'istanza di stringa (in unità di codice UTF-16) è disponibile come [`buffer.constants.MAX_STRING_LENGTH`](/it/nodejs/api/buffer#bufferconstantsmax_string_length).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 è il valore ASCII decimale per 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Prints: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Prints: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Prints: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Prints: té
console.log(buf2.toString(undefined, 0, 3));
// Prints: té
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 è il valore ASCII decimale per 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Prints: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Prints: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Prints: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Prints: té
console.log(buf2.toString(undefined, 0, 3));
// Prints: té
```
:::


### `buf.values()` {#bufvalues}

**Aggiunto in: v1.1.0**

- Restituisce: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Crea e restituisce un [iteratore](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) per i valori (byte) di `buf`. Questa funzione viene chiamata automaticamente quando un `Buffer` viene utilizzato in un'istruzione `for..of`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
```
:::

### `buf.write(string[, offset[, length]][, encoding])` {#bufwritestring-offset-length-encoding}

**Aggiunto in: v0.1.90**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Stringa da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere `string`. **Predefinito:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero massimo di byte da scrivere (i byte scritti non supereranno `buf.length - offset`). **Predefinito:** `buf.length - offset`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica dei caratteri di `string`. **Predefinito:** `'utf8'`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte scritti.

Scrive `string` in `buf` in corrispondenza di `offset` in base alla codifica dei caratteri in `encoding`. Il parametro `length` è il numero di byte da scrivere. Se `buf` non contiene spazio sufficiente per contenere l'intera stringa, verrà scritta solo una parte di `string`. Tuttavia, i caratteri parzialmente codificati non verranno scritti.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Prints: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Prints: 2 bytes : ab
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Prints: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Prints: 2 bytes : ab
```
:::


### `buf.writeBigInt64BE(value[, offset])` {#bufwritebigint64bevalue-offset}

**Aggiunto in: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare: `0 \<= offset \<= buf.length - 8`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all' `offset` specificato come big-endian.

`value` viene interpretato e scritto come un intero con segno in complemento a due.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04 05 06 07 08>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04 05 06 07 08>
```
:::

### `buf.writeBigInt64LE(value[, offset])` {#bufwritebigint64levalue-offset}

**Aggiunto in: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare: `0 \<= offset \<= buf.length - 8`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all' `offset` specificato come little-endian.

`value` viene interpretato e scritto come un intero con segno in complemento a due.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05 04 03 02 01>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05 04 03 02 01>
```
:::


### `buf.writeBigUInt64BE(value[, offset])` {#bufwritebiguint64bevalue-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.10.0, v12.19.0 | Questa funzione è disponibile anche come `buf.writeBigUint64BE()`. |
| v12.0.0, v10.20.0 | Aggiunto in: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare: `0 \<= offset \<= buf.length - 8`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all'`offset` specificato come big-endian.

Questa funzione è disponibile anche con l'alias `writeBigUint64BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de ca fa fe ca ce fa de>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de ca fa fe ca ce fa de>
```
:::

### `buf.writeBigUInt64LE(value[, offset])` {#bufwritebiguint64levalue-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.10.0, v12.19.0 | Questa funzione è disponibile anche come `buf.writeBigUint64LE()`. |
| v12.0.0, v10.20.0 | Aggiunto in: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare: `0 \<= offset \<= buf.length - 8`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all'`offset` specificato come little-endian

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de fa ce ca fe fa ca de>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de fa ce ca fe fa ca de>
```
:::

Questa funzione è disponibile anche con l'alias `writeBigUint64LE`.


### `buf.writeDoubleBE(value[, offset])` {#bufwritedoublebevalue-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - 8`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all' `offset` specificato come big-endian. Il `value` deve essere un numero JavaScript. Il comportamento non è definito quando `value` è qualcosa di diverso da un numero JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```
:::

### `buf.writeDoubleLE(value[, offset])` {#bufwritedoublelevalue-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - 8`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all' `offset` specificato come little-endian. Il `value` deve essere un numero JavaScript. Il comportamento non è definito quando `value` è qualcosa di diverso da un numero JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```
:::


### `buf.writeFloatBE(value[, offset])` {#bufwritefloatbevalue-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - 4`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all'`offset` specificato come big-endian. Il comportamento non è definito quando `value` è diverso da un numero JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Stampa: <Buffer 4f 4a fe bb>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Stampa: <Buffer 4f 4a fe bb>
```
:::

### `buf.writeFloatLE(value[, offset])` {#bufwritefloatlevalue-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - 4`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all'`offset` specificato come little-endian. Il comportamento non è definito quando `value` è diverso da un numero JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Stampa: <Buffer bb fe 4a 4f>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Stampa: <Buffer bb fe 4a 4f>
```
:::


### `buf.writeInt8(value[, offset])` {#bufwriteint8value-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32` ora. |
| v0.5.0 | Aggiunto in: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - 1`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all'`offset` specificato. `value` deve essere un numero intero con segno a 8 bit valido. Il comportamento non è definito quando `value` è diverso da un numero intero con segno a 8 bit.

`value` viene interpretato e scritto come un numero intero con segno in complemento a due.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Prints: <Buffer 02 fe>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Prints: <Buffer 02 fe>
```
:::

### `buf.writeInt16BE(value[, offset])` {#bufwriteint16bevalue-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32` ora. |
| v0.5.5 | Aggiunto in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - 2`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all'`offset` specificato come big-endian. Il `value` deve essere un numero intero con segno a 16 bit valido. Il comportamento non è definito quando `value` è diverso da un numero intero con segno a 16 bit.

Il `value` viene interpretato e scritto come un numero intero con segno in complemento a due.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Prints: <Buffer 01 02>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Prints: <Buffer 01 02>
```
:::


### `buf.writeInt16LE(value[, offset])` {#bufwriteint16levalue-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32` ora. |
| v0.5.5 | Aggiunto in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - 2`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all' `offset` specificato come little-endian. Il `value` deve essere un intero con segno a 16 bit valido. Il comportamento non è definito quando `value` è qualcosa di diverso da un intero con segno a 16 bit.

Il `value` viene interpretato e scritto come un intero con segno in complemento a due.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```
:::

### `buf.writeInt32BE(value[, offset])` {#bufwriteint32bevalue-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32` ora. |
| v0.5.5 | Aggiunto in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - 4`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all' `offset` specificato come big-endian. Il `value` deve essere un intero con segno a 32 bit valido. Il comportamento non è definito quando `value` è qualcosa di diverso da un intero con segno a 32 bit.

Il `value` viene interpretato e scritto come un intero con segno in complemento a due.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```
:::


### `buf.writeInt32LE(value[, offset])` {#bufwriteint32levalue-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.5.5 | Aggiunto in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - 4`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all'`offset` specificato come little-endian. Il `value` deve essere un intero a 32 bit con segno valido. Il comportamento non è definito quando `value` è qualcosa di diverso da un intero a 32 bit con segno.

Il `value` viene interpretato e scritto come un intero con segno in complemento a due.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Stampa: <Buffer 08 07 06 05>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Stampa: <Buffer 08 07 06 05>
```
:::

### `buf.writeIntBE(value, offset, byteLength)` {#bufwriteintbevalue-offset-bytelength}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset e di `byteLength` a `uint32`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da scrivere. Deve soddisfare `0 \< byteLength \<= 6`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `byteLength` byte di `value` in `buf` all'`offset` specificato come big-endian. Supporta fino a 48 bit di precisione. Il comportamento non è definito quando `value` è qualcosa di diverso da un intero con segno.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Stampa: <Buffer 12 34 56 78 90 ab>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Stampa: <Buffer 12 34 56 78 90 ab>
```
:::


### `buf.writeIntLE(value, offset, byteLength)` {#bufwriteintlevalue-offset-bytelength}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset e di `byteLength` a `uint32`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da scrivere. Deve soddisfare `0 \< byteLength \<= 6`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `byteLength` byte di `value` in `buf` all' `offset` specificato come little-endian. Supporta fino a 48 bit di precisione. Il comportamento non è definito quando `value` è diverso da un intero con segno.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```
:::

### `buf.writeUInt8(value[, offset])` {#bufwriteuint8value-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.9.0, v12.19.0 | Questa funzione è disponibile anche come `buf.writeUint8()`. |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.5.0 | Aggiunto in: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - 1`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all' `offset` specificato. `value` deve essere un valido intero a 8 bit senza segno. Il comportamento non è definito quando `value` è diverso da un intero a 8 bit senza segno.

Questa funzione è disponibile anche con l'alias `writeUint8`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// Prints: <Buffer 03 04 23 42>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// Prints: <Buffer 03 04 23 42>
```
:::


### `buf.writeUInt16BE(value[, offset])` {#bufwriteuint16bevalue-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.9.0, v12.19.0 | Questa funzione è disponibile anche come `buf.writeUint16BE()`. |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.5.5 | Aggiunta in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - 2`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all'`offset` specificato come big-endian. Il `value` deve essere un intero senza segno a 16 bit valido. Il comportamento non è definito quando `value` è qualcosa di diverso da un intero senza segno a 16 bit.

Questa funzione è disponibile anche con l'alias `writeUint16BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```

```js [CJS]
const { Buffer } = require('node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```
:::

### `buf.writeUInt16LE(value[, offset])` {#bufwriteuint16levalue-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.9.0, v12.19.0 | Questa funzione è disponibile anche come `buf.writeUint16LE()`. |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.5.5 | Aggiunta in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - 2`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all'`offset` specificato come little-endian. Il `value` deve essere un intero senza segno a 16 bit valido. Il comportamento non è definito quando `value` è qualcosa di diverso da un intero senza segno a 16 bit.

Questa funzione è disponibile anche con l'alias `writeUint16LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```

```js [CJS]
const { Buffer } = require('node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```
:::


### `buf.writeUInt32BE(value[, offset])` {#bufwriteuint32bevalue-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.9.0, v12.19.0 | Questa funzione è disponibile anche come `buf.writeUint32BE()`. |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.5.5 | Aggiunto in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - 4`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all'`offset` specificato come big-endian. Il `value` deve essere un numero intero a 32 bit senza segno valido. Il comportamento non è definito quando `value` è qualcosa di diverso da un numero intero a 32 bit senza segno.

Questa funzione è disponibile anche con l'alias `writeUint32BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Stampa: <Buffer fe ed fa ce>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Stampa: <Buffer fe ed fa ce>
```
:::

### `buf.writeUInt32LE(value[, offset])` {#bufwriteuint32levalue-offset}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.9.0, v12.19.0 | Questa funzione è disponibile anche come `buf.writeUint32LE()`. |
| v10.0.0 | Rimosso `noAssert` e nessuna coercizione implicita dell'offset a `uint32`. |
| v0.5.5 | Aggiunto in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - 4`. **Predefinito:** `0`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `value` in `buf` all'`offset` specificato come little-endian. Il `value` deve essere un numero intero a 32 bit senza segno valido. Il comportamento non è definito quando `value` è qualcosa di diverso da un numero intero a 32 bit senza segno.

Questa funzione è disponibile anche con l'alias `writeUint32LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Stampa: <Buffer ce fa ed fe>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Stampa: <Buffer ce fa ed fe>
```
:::


### `buf.writeUIntBE(value, offset, byteLength)` {#bufwriteuintbevalue-offset-bytelength}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.9.0, v12.19.0 | Questa funzione è disponibile anche come `buf.writeUintBE()`. |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset e `byteLength` a `uint32`. |
| v0.5.5 | Aggiunta in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da scrivere. Deve soddisfare `0 \< byteLength \<= 6`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `byteLength` byte di `value` in `buf` all'`offset` specificato come big-endian. Supporta fino a 48 bit di precisione. Il comportamento non è definito quando `value` è diverso da un numero intero senza segno.

Questa funzione è disponibile anche con l'alias `writeUintBE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```
:::

### `buf.writeUIntLE(value, offset, byteLength)` {#bufwriteuintlevalue-offset-bytelength}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.9.0, v12.19.0 | Questa funzione è disponibile anche come `buf.writeUintLE()`. |
| v10.0.0 | Rimossi `noAssert` e nessuna coercizione implicita dell'offset e `byteLength` a `uint32`. |
| v0.5.5 | Aggiunta in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero da scrivere in `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da saltare prima di iniziare a scrivere. Deve soddisfare `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da scrivere. Deve soddisfare `0 \< byteLength \<= 6`.
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` più il numero di byte scritti.

Scrive `byteLength` byte di `value` in `buf` all'`offset` specificato come little-endian. Supporta fino a 48 bit di precisione. Il comportamento non è definito quando `value` è diverso da un numero intero senza segno.

Questa funzione è disponibile anche con l'alias `writeUintLE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```
:::


### `new Buffer(array)` {#new-bufferarray}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | La chiamata a questo costruttore emette un avviso di deprecazione quando viene eseguita da codice al di fuori della directory `node_modules`. |
| v7.2.1 | La chiamata a questo costruttore non emette più un avviso di deprecazione. |
| v7.0.0 | La chiamata a questo costruttore ora emette un avviso di deprecazione. |
| v6.0.0 | Deprecato a partire da: v6.0.0 |
:::

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Usa invece [`Buffer.from(array)`](/it/nodejs/api/buffer#static-method-bufferfromarray).
:::

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un array di byte da cui copiare.

Vedi [`Buffer.from(array)`](/it/nodejs/api/buffer#static-method-bufferfromarray).

### `new Buffer(arrayBuffer[, byteOffset[, length]])` {#new-bufferarraybuffer-byteoffset-length}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | La chiamata a questo costruttore emette un avviso di deprecazione quando viene eseguita da codice al di fuori della directory `node_modules`. |
| v7.2.1 | La chiamata a questo costruttore non emette più un avviso di deprecazione. |
| v7.0.0 | La chiamata a questo costruttore ora emette un avviso di deprecazione. |
| v6.0.0 | I parametri `byteOffset` e `length` ora sono supportati. |
| v6.0.0 | Deprecato a partire da: v6.0.0 |
| v3.0.0 | Aggiunto in: v3.0.0 |
:::

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Usa invece [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/it/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length).
:::

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Un [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) o la proprietà `.buffer` di un [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Indice del primo byte da esporre. **Predefinito:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da esporre. **Predefinito:** `arrayBuffer.byteLength - byteOffset`.

Vedi [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/it/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length).


### `new Buffer(buffer)` {#new-bufferbuffer}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | La chiamata a questo costruttore emette un avviso di deprecazione quando eseguito da codice al di fuori della directory `node_modules`. |
| v7.2.1 | La chiamata a questo costruttore non emette più un avviso di deprecazione. |
| v7.0.0 | La chiamata a questo costruttore ora emette un avviso di deprecazione. |
| v6.0.0 | Deprecato da: v6.0.0 |
:::

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Usa invece [`Buffer.from(buffer)`](/it/nodejs/api/buffer#static-method-bufferfrombuffer).
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un `Buffer` esistente o [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) da cui copiare i dati.

Vedere [`Buffer.from(buffer)`](/it/nodejs/api/buffer#static-method-bufferfrombuffer).

### `new Buffer(size)` {#new-buffersize}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | La chiamata a questo costruttore emette un avviso di deprecazione quando eseguito da codice al di fuori della directory `node_modules`. |
| v8.0.0 | `new Buffer(size)` restituirà per impostazione predefinita memoria riempita con zeri. |
| v7.2.1 | La chiamata a questo costruttore non emette più un avviso di deprecazione. |
| v7.0.0 | La chiamata a questo costruttore ora emette un avviso di deprecazione. |
| v6.0.0 | Deprecato da: v6.0.0 |
:::

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Usa invece [`Buffer.alloc()`](/it/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) (vedi anche [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize)).
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La lunghezza desiderata del nuovo `Buffer`.

Vedere [`Buffer.alloc()`](/it/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) e [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize). Questa variante del costruttore è equivalente a [`Buffer.alloc()`](/it/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding).


### `new Buffer(string[, encoding])` {#new-bufferstring-encoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Chiamare questo costruttore emette un avviso di deprecazione quando eseguito da codice al di fuori della directory `node_modules`. |
| v7.2.1 | Chiamare questo costruttore non emette più un avviso di deprecazione. |
| v7.0.0 | Chiamare questo costruttore ora emette un avviso di deprecazione. |
| v6.0.0 | Deprecato dal: v6.0.0 |
:::

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Usa invece [`Buffer.from(string[, encoding])`](/it/nodejs/api/buffer#static-method-bufferfromstring-encoding).
:::

- `string` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Stringa da codificare.
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica di `string`. **Predefinito:** `'utf8'`.

Vedi [`Buffer.from(string[, encoding])`](/it/nodejs/api/buffer#static-method-bufferfromstring-encoding).

## Classe: `File` {#class-file}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Rende le istanze di File clonabili. |
| v20.0.0 | Non più sperimentale. |
| v19.2.0, v18.13.0 | Aggiunto in: v19.2.0, v18.13.0 |
:::

- Estende: [\<Blob\>](/it/nodejs/api/buffer#class-blob)

Un [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) fornisce informazioni sui file.

### `new buffer.File(sources, fileName[, options])` {#new-bufferfilesources-filename-options}

**Aggiunto in: v19.2.0, v18.13.0**

- `sources` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/it/nodejs/api/buffer#class-blob) | [\<File[]\>](/it/nodejs/api/buffer#class-file) Un array di stringhe, oggetti [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), [\<File\>](/it/nodejs/api/buffer#class-file) o [\<Blob\>](/it/nodejs/api/buffer#class-blob), o qualsiasi combinazione di tali oggetti, che verranno memorizzati all'interno del `File`.
- `fileName` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome del file.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uno tra `'transparent'` o `'native'`. Quando impostato su `'native'`, i fine riga nelle parti di origine stringa verranno convertiti nel fine riga nativo della piattaforma come specificato da `require('node:os').EOL`.
    - `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il content-type del file.
    - `lastModified` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La data dell'ultima modifica del file. **Predefinito:** `Date.now()`.


### `file.name` {#filename}

**Aggiunto in: v19.2.0, v18.13.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il nome del `File`.

### `file.lastModified` {#filelastmodified}

**Aggiunto in: v19.2.0, v18.13.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La data dell'ultima modifica del `File`.

## API del modulo `node:buffer` {#nodebuffer-module-apis}

Mentre l'oggetto `Buffer` è disponibile come globale, ci sono API aggiuntive relative a `Buffer` che sono disponibili solo tramite il modulo `node:buffer` a cui si accede tramite `require('node:buffer')`.

### `buffer.atob(data)` {#bufferatobdata}

**Aggiunto in: v15.13.0, v14.17.0**

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy. Usa `Buffer.from(data, 'base64')` invece.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) La stringa di input con codifica Base64.

Decodifica una stringa di dati con codifica Base64 in byte e codifica tali byte in una stringa usando Latin-1 (ISO-8859-1).

I `data` possono essere qualsiasi valore JavaScript che può essere forzato in una stringa.

**Questa funzione è fornita solo per compatibilità con le API della piattaforma web legacy
e non dovrebbe mai essere utilizzata nel nuovo codice, perché utilizzano stringhe per rappresentare
dati binari e precedenti all'introduzione di array tipizzati in JavaScript.
Per il codice in esecuzione utilizzando le API di Node.js, la conversione tra stringhe con codifica base64
e i dati binari devono essere eseguiti usando <code>Buffer.from(str, 'base64')</code> e
<code>buf.toString('base64')</code>.**

### `buffer.btoa(data)` {#bufferbtoadata}

**Aggiunto in: v15.13.0, v14.17.0**

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy. Usa `buf.toString('base64')` invece.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Una stringa ASCII (Latin1).

Decodifica una stringa in byte usando Latin-1 (ISO-8859) e codifica tali byte in una stringa usando Base64.

I `data` possono essere qualsiasi valore JavaScript che può essere forzato in una stringa.

**Questa funzione è fornita solo per compatibilità con le API della piattaforma web legacy
e non dovrebbe mai essere utilizzata nel nuovo codice, perché utilizzano stringhe per rappresentare
dati binari e precedenti all'introduzione di array tipizzati in JavaScript.
Per il codice in esecuzione utilizzando le API di Node.js, la conversione tra stringhe con codifica base64
e i dati binari devono essere eseguiti usando <code>Buffer.from(str, 'base64')</code> e
<code>buf.toString('base64')</code>.**


### `buffer.isAscii(input)` {#bufferisasciiinput}

**Aggiunto in: v19.6.0, v18.15.0**

- input [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) L'input da validare.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Questa funzione restituisce `true` se `input` contiene solo dati validi con codifica ASCII, incluso il caso in cui `input` è vuoto.

Genera un'eccezione se `input` è un array buffer scollegato.

### `buffer.isUtf8(input)` {#bufferisutf8input}

**Aggiunto in: v19.4.0, v18.14.0**

- input [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) L'input da validare.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Questa funzione restituisce `true` se `input` contiene solo dati validi con codifica UTF-8, incluso il caso in cui `input` è vuoto.

Genera un'eccezione se `input` è un array buffer scollegato.

### `buffer.INSPECT_MAX_BYTES` {#bufferinspect_max_bytes}

**Aggiunto in: v0.5.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `50`

Restituisce il numero massimo di byte che verranno restituiti quando viene chiamato `buf.inspect()`. Questo può essere sovrascritto dai moduli utente. Consultare [`util.inspect()`](/it/nodejs/api/util#utilinspectobject-options) per maggiori dettagli sul comportamento di `buf.inspect()`.

### `buffer.kMaxLength` {#bufferkmaxlength}

**Aggiunto in: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione massima consentita per una singola istanza di `Buffer`.

Un alias per [`buffer.constants.MAX_LENGTH`](/it/nodejs/api/buffer#bufferconstantsmax_length).

### `buffer.kStringMaxLength` {#bufferkstringmaxlength}

**Aggiunto in: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La lunghezza massima consentita per una singola istanza di `string`.

Un alias per [`buffer.constants.MAX_STRING_LENGTH`](/it/nodejs/api/buffer#bufferconstantsmax_string_length).


### `buffer.resolveObjectURL(id)` {#bufferresolveobjecturlid}

**Aggiunto in: v16.7.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una stringa URL `'blob:nodedata:...` restituita da una precedente chiamata a `URL.createObjectURL()`.
- Restituisce: [\<Blob\>](/it/nodejs/api/buffer#class-blob)

Risolve una `'blob:nodedata:...'` ad un oggetto [\<Blob\>](/it/nodejs/api/buffer#class-blob) associato registrato utilizzando una precedente chiamata a `URL.createObjectURL()`.

### `buffer.transcode(source, fromEnc, toEnc)` {#buffertranscodesource-fromenc-toenc}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Il parametro `source` ora può essere un `Uint8Array`. |
| v7.1.0 | Aggiunto in: v7.1.0 |
:::

- `source` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un'istanza di `Buffer` o `Uint8Array`.
- `fromEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica corrente.
- `toEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica di destinazione.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Ricodifica l'istanza di `Buffer` o `Uint8Array` data da una codifica di caratteri a un'altra. Restituisce una nuova istanza di `Buffer`.

Genera un'eccezione se `fromEnc` o `toEnc` specificano codifiche di caratteri non valide o se la conversione da `fromEnc` a `toEnc` non è consentita.

Le codifiche supportate da `buffer.transcode()` sono: `'ascii'`, `'utf8'`, `'utf16le'`, `'ucs2'`, `'latin1'` e `'binary'`.

Il processo di transcodifica utilizzerà caratteri di sostituzione se una data sequenza di byte non può essere adeguatamente rappresentata nella codifica di destinazione. Per esempio:



::: code-group
```js [ESM]
import { Buffer, transcode } from 'node:buffer';

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```

```js [CJS]
const { Buffer, transcode } = require('node:buffer');

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```
:::

Poiché il segno dell'Euro (`€`) non è rappresentabile in US-ASCII, viene sostituito con `?` nel `Buffer` transcodificato.


### Classe: `SlowBuffer` {#class-slowbuffer}

**Deprecata a partire da: v6.0.0**

::: danger [Stabile: 0 - Deprecata]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecata: Utilizzare invece [`Buffer.allocUnsafeSlow()`](/it/nodejs/api/buffer#static-method-bufferallocunsafeslowsize).
:::

Vedere [`Buffer.allocUnsafeSlow()`](/it/nodejs/api/buffer#static-method-bufferallocunsafeslowsize). Questa non è mai stata una classe nel senso che il costruttore ha sempre restituito un'istanza `Buffer`, piuttosto che un'istanza `SlowBuffer`.

#### `new SlowBuffer(size)` {#new-slowbuffersize}

**Deprecata a partire da: v6.0.0**

::: danger [Stabile: 0 - Deprecata]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecata: Utilizzare invece [`Buffer.allocUnsafeSlow()`](/it/nodejs/api/buffer#static-method-bufferallocunsafeslowsize).
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La lunghezza desiderata del nuovo `SlowBuffer`.

Vedere [`Buffer.allocUnsafeSlow()`](/it/nodejs/api/buffer#static-method-bufferallocunsafeslowsize).

### Costanti del Buffer {#buffer-constants}

**Aggiunto in: v8.2.0**

#### `buffer.constants.MAX_LENGTH` {#bufferconstantsmax_length}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0 | Il valore è stato cambiato a 2<sup>31</sup> - 1 su architetture a 64 bit. |
| v15.0.0 | Il valore è stato cambiato a 2<sup>50</sup> su architetture a 64 bit. |
| v14.0.0 | Il valore è stato cambiato da 2<sup>31</sup> - 1 a 2<sup>50</sup> - 1 su architetture a 64 bit. |
| v8.2.0 | Aggiunto in: v8.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione massima consentita per una singola istanza di `Buffer`.

Su architetture a 32 bit, questo valore è attualmente 2<sup>31</sup> - 1 (circa 1 GiB).

Su architetture a 64 bit, questo valore è attualmente 2<sup>50</sup> - 1 (circa 8 PiB).

Riflette [`v8::TypedArray::kMaxLength`](https://v8.github.io/api/head/classv8_1_1TypedArray#a54a48f4373da0850663c4393d843b9b0) internamente.

Questo valore è disponibile anche come [`buffer.kMaxLength`](/it/nodejs/api/buffer#bufferkmaxlength).

#### `buffer.constants.MAX_STRING_LENGTH` {#bufferconstantsmax_string_length}

**Aggiunto in: v8.2.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La lunghezza massima consentita per una singola istanza di `string`.

Rappresenta la `length` massima che una primitiva `string` può avere, conteggiata in unità di codice UTF-16.

Questo valore può dipendere dal motore JS che viene utilizzato.


## `Buffer.from()`, `Buffer.alloc()` e `Buffer.allocUnsafe()` {#bufferfrom-bufferalloc-and-bufferallocunsafe}

Nelle versioni di Node.js precedenti alla 6.0.0, le istanze `Buffer` venivano create usando la funzione costruttore `Buffer`, che alloca l'istanza `Buffer` restituita in modo diverso a seconda degli argomenti forniti:

- Passare un numero come primo argomento a `Buffer()` (ad es. `new Buffer(10)`) alloca un nuovo oggetto `Buffer` della dimensione specificata. Prima di Node.js 8.0.0, la memoria allocata per tali istanze `Buffer` *non* è inizializzata e *può contenere dati sensibili*. Tali istanze `Buffer` *devono* essere successivamente inizializzate usando [`buf.fill(0)`](/it/nodejs/api/buffer#buffillvalue-offset-end-encoding) o scrivendo nell'intero `Buffer` prima di leggere i dati dal `Buffer`. Sebbene questo comportamento sia *intenzionale* per migliorare le prestazioni, l'esperienza di sviluppo ha dimostrato che è necessaria una distinzione più esplicita tra la creazione di un `Buffer` veloce ma non inizializzato e la creazione di un `Buffer` più lento ma più sicuro. Da Node.js 8.0.0, `Buffer(num)` e `new Buffer(num)` restituiscono un `Buffer` con memoria inizializzata.
- Passare una stringa, un array o un `Buffer` come primo argomento copia i dati dell'oggetto passato nel `Buffer`.
- Passare un [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) o un [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) restituisce un `Buffer` che condivide la memoria allocata con il buffer dell'array specificato.

Poiché il comportamento di `new Buffer()` è diverso a seconda del tipo del primo argomento, problemi di sicurezza e affidabilità possono essere inavvertitamente introdotti nelle applicazioni quando non viene eseguita la convalida degli argomenti o l'inizializzazione di `Buffer`.

Ad esempio, se un aggressore può far sì che un'applicazione riceva un numero dove è prevista una stringa, l'applicazione potrebbe chiamare `new Buffer(100)` invece di `new Buffer("100")`, portandola ad allocare un buffer di 100 byte invece di allocare un buffer di 3 byte con il contenuto `"100"`. Ciò è comunemente possibile usando le chiamate API JSON. Poiché JSON distingue tra tipi numerici e stringa, consente l'iniezione di numeri dove un'applicazione scritta ingenuamente che non convalida sufficientemente il suo input potrebbe aspettarsi di ricevere sempre una stringa. Prima di Node.js 8.0.0, il buffer di 100 byte potrebbe contenere dati in memoria preesistenti arbitrari, quindi potrebbe essere usato per esporre segreti in memoria a un aggressore remoto. Da Node.js 8.0.0, l'esposizione della memoria non può verificarsi perché i dati sono riempiti di zeri. Tuttavia, sono ancora possibili altri attacchi, come causare l'allocazione di buffer molto grandi da parte del server, portando a un degrado delle prestazioni o all'arresto anomalo per esaurimento della memoria.

Per rendere la creazione di istanze `Buffer` più affidabile e meno soggetta a errori, le varie forme del costruttore `new Buffer()` sono state **deprecate** e sostituite dai metodi separati `Buffer.from()`, [`Buffer.alloc()`](/it/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) e [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize).

*Gli sviluppatori dovrebbero migrare tutti gli usi esistenti dei costruttori <code>new Buffer()</code>
a una di queste nuove API.*

- [`Buffer.from(array)`](/it/nodejs/api/buffer#static-method-bufferfromarray) restituisce un nuovo `Buffer` che *contiene una copia* degli ottetti forniti.
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/it/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) restituisce un nuovo `Buffer` che *condivide la stessa memoria allocata* come il dato [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).
- [`Buffer.from(buffer)`](/it/nodejs/api/buffer#static-method-bufferfrombuffer) restituisce un nuovo `Buffer` che *contiene una copia* del contenuto del `Buffer` fornito.
- [`Buffer.from(string[, encoding])`](/it/nodejs/api/buffer#static-method-bufferfromstring-encoding) restituisce un nuovo `Buffer` che *contiene una copia* della stringa fornita.
- [`Buffer.alloc(size[, fill[, encoding]])`](/it/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) restituisce un nuovo `Buffer` inizializzato della dimensione specificata. Questo metodo è più lento di [`Buffer.allocUnsafe(size)`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize) ma garantisce che le istanze `Buffer` appena create non contengano mai vecchi dati potenzialmente sensibili. Verrà generato un `TypeError` se `size` non è un numero.
- [`Buffer.allocUnsafe(size)`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize) e [`Buffer.allocUnsafeSlow(size)`](/it/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) restituiscono ciascuno un nuovo `Buffer` non inizializzato della `size` specificata. Poiché il `Buffer` non è inizializzato, il segmento di memoria allocato potrebbe contenere vecchi dati potenzialmente sensibili.

Le istanze `Buffer` restituite da [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.from(string)`](/it/nodejs/api/buffer#static-method-bufferfromstring-encoding), [`Buffer.concat()`](/it/nodejs/api/buffer#static-method-bufferconcatlist-totallength) e [`Buffer.from(array)`](/it/nodejs/api/buffer#static-method-bufferfromarray) *possono* essere allocate da un pool di memoria interno condiviso se `size` è inferiore o uguale alla metà di [`Buffer.poolSize`](/it/nodejs/api/buffer#class-property-bufferpoolsize). Le istanze restituite da [`Buffer.allocUnsafeSlow()`](/it/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) *non* utilizzano mai il pool di memoria interno condiviso.


### L'opzione da riga di comando `--zero-fill-buffers` {#the---zero-fill-buffers-command-line-option}

**Aggiunta in: v5.10.0**

Node.js può essere avviato utilizzando l'opzione da riga di comando `--zero-fill-buffers` per fare in modo che tutte le istanze `Buffer` appena allocate vengano riempite di zeri al momento della creazione per impostazione predefinita. Senza l'opzione, i buffer creati con [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.allocUnsafeSlow()`](/it/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) e `new SlowBuffer(size)` non vengono riempiti di zeri. L'uso di questo flag può avere un impatto negativo misurabile sulle prestazioni. Usa l'opzione `--zero-fill-buffers` solo quando necessario per garantire che le istanze `Buffer` appena allocate non possano contenere dati obsoleti potenzialmente sensibili.

```bash [BASH]
$ node --zero-fill-buffers
> Buffer.allocUnsafe(5);
<Buffer 00 00 00 00 00>
```
### Cosa rende `Buffer.allocUnsafe()` e `Buffer.allocUnsafeSlow()` "non sicuri"? {#what-makes-bufferallocunsafe-and-bufferallocunsafeslow-"unsafe"?}

Quando si chiamano [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize) e [`Buffer.allocUnsafeSlow()`](/it/nodejs/api/buffer#static-method-bufferallocunsafeslowsize), il segmento di memoria allocata è *non inizializzato* (non viene riempito di zeri). Sebbene questa progettazione renda l'allocazione della memoria abbastanza veloce, il segmento di memoria allocata potrebbe contenere dati obsoleti potenzialmente sensibili. L'utilizzo di un `Buffer` creato da [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize) senza sovrascrivere *completamente* la memoria può consentire la fuoriuscita di questi dati obsoleti quando viene letta la memoria `Buffer`.

Sebbene ci siano chiari vantaggi in termini di prestazioni nell'utilizzo di [`Buffer.allocUnsafe()`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize), è *necessario* prestare maggiore attenzione al fine di evitare l'introduzione di vulnerabilità di sicurezza in un'applicazione.

