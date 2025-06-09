---
title: Documentazione Node.js - Decodificatore di Stringhe
description: Il modulo Decodificatore di Stringhe fornisce un'API per decodificare gli oggetti Buffer in stringhe, ottimizzata per la codifica interna dei caratteri delle stringhe.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Decodificatore di Stringhe | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo Decodificatore di Stringhe fornisce un'API per decodificare gli oggetti Buffer in stringhe, ottimizzata per la codifica interna dei caratteri delle stringhe.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Decodificatore di Stringhe | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo Decodificatore di Stringhe fornisce un'API per decodificare gli oggetti Buffer in stringhe, ottimizzata per la codifica interna dei caratteri delle stringhe.
---


# Decodificatore di stringhe {#string-decoder}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice Sorgente:** [lib/string_decoder.js](https://github.com/nodejs/node/blob/v23.5.0/lib/string_decoder.js)

Il modulo `node:string_decoder` fornisce un'API per decodificare oggetti `Buffer` in stringhe in modo da preservare i caratteri UTF-8 e UTF-16 multi-byte codificati. È possibile accedervi utilizzando:



::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
```
:::

L'esempio seguente mostra l'uso di base della classe `StringDecoder`.



::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Stampa: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Stampa: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Stampa: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Stampa: €
```
:::

Quando un'istanza `Buffer` viene scritta nell'istanza `StringDecoder`, viene utilizzato un buffer interno per garantire che la stringa decodificata non contenga caratteri multibyte incompleti. Questi vengono conservati nel buffer fino alla successiva chiamata a `stringDecoder.write()` o fino a quando non viene chiamato `stringDecoder.end()`.

Nell'esempio seguente, i tre byte con codifica UTF-8 del simbolo dell'Euro europeo (`€`) vengono scritti su tre operazioni separate:



::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Stampa: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Stampa: €
```
:::


## Classe: `StringDecoder` {#class-stringdecoder}

### `new StringDecoder([encoding])` {#new-stringdecoderencoding}

**Aggiunto in: v0.1.99**

- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) dei caratteri che `StringDecoder` utilizzerà. **Predefinito:** `'utf8'`.

Crea una nuova istanza di `StringDecoder`.

### `stringDecoder.end([buffer])` {#stringdecoderendbuffer}

**Aggiunto in: v0.9.3**

- `buffer` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) I byte da decodificare.
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce qualsiasi input rimanente memorizzato nel buffer interno come stringa. I byte che rappresentano caratteri UTF-8 e UTF-16 incompleti verranno sostituiti con caratteri di sostituzione appropriati per la codifica dei caratteri.

Se viene fornito l'argomento `buffer`, viene eseguita una chiamata finale a `stringDecoder.write()` prima di restituire l'input rimanente. Dopo che `end()` è stato chiamato, l'oggetto `stringDecoder` può essere riutilizzato per un nuovo input.

### `stringDecoder.write(buffer)` {#stringdecoderwritebuffer}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Ogni carattere non valido viene ora sostituito da un singolo carattere di sostituzione anziché uno per ogni singolo byte. |
| v0.1.99 | Aggiunto in: v0.1.99 |
:::

- `buffer` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) I byte da decodificare.
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce una stringa decodificata, assicurandosi che eventuali caratteri multibyte incompleti alla fine del `Buffer`, o `TypedArray`, o `DataView` vengano omessi dalla stringa restituita e memorizzati in un buffer interno per la successiva chiamata a `stringDecoder.write()` o `stringDecoder.end()`.

