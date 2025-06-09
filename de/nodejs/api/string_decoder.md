---
title: Node.js Dokumentation - String Decoder
description: Das String Decoder Modul bietet eine API zum Dekodieren von Buffer-Objekten in Strings, die für die interne Zeichencodierung der Strings optimiert ist.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - String Decoder | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das String Decoder Modul bietet eine API zum Dekodieren von Buffer-Objekten in Strings, die für die interne Zeichencodierung der Strings optimiert ist.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - String Decoder | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das String Decoder Modul bietet eine API zum Dekodieren von Buffer-Objekten in Strings, die für die interne Zeichencodierung der Strings optimiert ist.
---


# String-Decoder {#string-decoder}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/string_decoder.js](https://github.com/nodejs/node/blob/v23.5.0/lib/string_decoder.js)

Das Modul `node:string_decoder` stellt eine API zum Dekodieren von `Buffer`-Objekten in Zeichenketten auf eine Art und Weise bereit, die kodierte Multibyte-UTF-8- und UTF-16-Zeichen beibehält. Es kann wie folgt aufgerufen werden:

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
```
:::

Das folgende Beispiel zeigt die grundlegende Verwendung der Klasse `StringDecoder`.

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Gibt aus: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Gibt aus: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Gibt aus: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Gibt aus: €
```
:::

Wenn eine `Buffer`-Instanz in die `StringDecoder`-Instanz geschrieben wird, wird ein interner Puffer verwendet, um sicherzustellen, dass die dekodierte Zeichenkette keine unvollständigen Multibyte-Zeichen enthält. Diese werden im Puffer gehalten, bis der nächste Aufruf von `stringDecoder.write()` erfolgt oder bis `stringDecoder.end()` aufgerufen wird.

Im folgenden Beispiel werden die drei UTF-8-kodierten Bytes des europäischen Euro-Symbols (`€`) über drei separate Operationen geschrieben:

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Gibt aus: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Gibt aus: €
```
:::


## Klasse: `StringDecoder` {#class-stringdecoder}

### `new StringDecoder([encoding])` {#new-stringdecoderencoding}

**Hinzugefügt in: v0.1.99**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Zeichen-[Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings), die der `StringDecoder` verwenden wird. **Standard:** `'utf8'`.

Erstellt eine neue `StringDecoder`-Instanz.

### `stringDecoder.end([buffer])` {#stringdecoderendbuffer}

**Hinzugefügt in: v0.9.3**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Die zu dekodierenden Bytes.
- Rückgabe: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt alle verbleibenden Eingaben, die im internen Puffer gespeichert sind, als Zeichenkette zurück. Bytes, die unvollständige UTF-8- und UTF-16-Zeichen darstellen, werden durch für die Zeichenkodierung geeignete Ersatzzeichen ersetzt.

Wenn das `buffer`-Argument angegeben wird, wird ein letzter Aufruf von `stringDecoder.write()` durchgeführt, bevor die verbleibende Eingabe zurückgegeben wird. Nachdem `end()` aufgerufen wurde, kann das `stringDecoder`-Objekt für neue Eingaben wiederverwendet werden.

### `stringDecoder.write(buffer)` {#stringdecoderwritebuffer}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Jedes ungültige Zeichen wird jetzt durch ein einzelnes Ersatzzeichen ersetzt, anstatt für jedes einzelne Byte eines. |
| v0.1.99 | Hinzugefügt in: v0.1.99 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Die zu dekodierenden Bytes.
- Rückgabe: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt eine dekodierte Zeichenkette zurück, wobei sichergestellt wird, dass alle unvollständigen Multibyte-Zeichen am Ende des `Buffer`, `TypedArray` oder `DataView` aus der zurückgegebenen Zeichenkette weggelassen und in einem internen Puffer für den nächsten Aufruf von `stringDecoder.write()` oder `stringDecoder.end()` gespeichert werden.

