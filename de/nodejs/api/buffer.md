---
title: Node.js Buffer Dokumentation
description: Die Node.js Buffer Dokumentation bietet detaillierte Informationen darüber, wie man mit binären Daten in Node.js arbeitet, einschließlich Erstellung, Manipulation und Konvertierung von Buffern.
head:
  - - meta
    - name: og:title
      content: Node.js Buffer Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Die Node.js Buffer Dokumentation bietet detaillierte Informationen darüber, wie man mit binären Daten in Node.js arbeitet, einschließlich Erstellung, Manipulation und Konvertierung von Buffern.
  - - meta
    - name: twitter:title
      content: Node.js Buffer Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Die Node.js Buffer Dokumentation bietet detaillierte Informationen darüber, wie man mit binären Daten in Node.js arbeitet, einschließlich Erstellung, Manipulation und Konvertierung von Buffern.
---


# Buffer {#buffer}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/buffer.js](https://github.com/nodejs/node/blob/v23.5.0/lib/buffer.js)

`Buffer`-Objekte werden verwendet, um eine Sequenz von Bytes fester Länge darzustellen. Viele Node.js-APIs unterstützen `Buffer`s.

Die `Buffer`-Klasse ist eine Unterklasse der JavaScript [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)-Klasse und erweitert diese um Methoden, die zusätzliche Anwendungsfälle abdecken. Node.js-APIs akzeptieren einfache [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)s, wo immer auch `Buffer`s unterstützt werden.

Obwohl die `Buffer`-Klasse im globalen Gültigkeitsbereich verfügbar ist, wird dennoch empfohlen, explizit über eine Import- oder Require-Anweisung darauf zu verweisen.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Erstellt einen mit Nullen gefüllten Puffer der Länge 10.
const buf1 = Buffer.alloc(10);

// Erstellt einen Puffer der Länge 10,
// gefüllt mit Bytes, die alle den Wert `1` haben.
const buf2 = Buffer.alloc(10, 1);

// Erstellt einen nicht initialisierten Puffer der Länge 10.
// Dies ist schneller als der Aufruf von Buffer.alloc(), aber die zurückgegebene
// Buffer-Instanz könnte alte Daten enthalten, die mit
// fill(), write() oder anderen Funktionen überschrieben werden müssen, die den Inhalt des Buffers füllen.
const buf3 = Buffer.allocUnsafe(10);

// Erstellt einen Puffer, der die Bytes [1, 2, 3] enthält.
const buf4 = Buffer.from([1, 2, 3]);

// Erstellt einen Puffer, der die Bytes [1, 1, 1, 1] enthält – die Einträge
// werden alle mit `(value & 255)` abgeschnitten, um in den Bereich 0–255 zu passen.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Erstellt einen Puffer, der die UTF-8-kodierten Bytes für die Zeichenkette 'tést' enthält:
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (in hexadezimaler Notation)
// [116, 195, 169, 115, 116] (in dezimaler Notation)
const buf6 = Buffer.from('tést');

// Erstellt einen Puffer, der die Latin-1-Bytes [0x74, 0xe9, 0x73, 0x74] enthält.
const buf7 = Buffer.from('tést', 'latin1');
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Erstellt einen mit Nullen gefüllten Puffer der Länge 10.
const buf1 = Buffer.alloc(10);

// Erstellt einen Puffer der Länge 10,
// gefüllt mit Bytes, die alle den Wert `1` haben.
const buf2 = Buffer.alloc(10, 1);

// Erstellt einen nicht initialisierten Puffer der Länge 10.
// Dies ist schneller als der Aufruf von Buffer.alloc(), aber die zurückgegebene
// Buffer-Instanz könnte alte Daten enthalten, die mit
// fill(), write() oder anderen Funktionen überschrieben werden müssen, die den Inhalt des Buffers füllen.
const buf3 = Buffer.allocUnsafe(10);

// Erstellt einen Puffer, der die Bytes [1, 2, 3] enthält.
const buf4 = Buffer.from([1, 2, 3]);

// Erstellt einen Puffer, der die Bytes [1, 1, 1, 1] enthält – die Einträge
// werden alle mit `(value & 255)` abgeschnitten, um in den Bereich 0–255 zu passen.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Erstellt einen Puffer, der die UTF-8-kodierten Bytes für die Zeichenkette 'tést' enthält:
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (in hexadezimaler Notation)
// [116, 195, 169, 115, 116] (in dezimaler Notation)
const buf6 = Buffer.from('tést');

// Erstellt einen Puffer, der die Latin-1-Bytes [0x74, 0xe9, 0x73, 0x74] enthält.
const buf7 = Buffer.from('tést', 'latin1');
```
:::


## Puffer und Zeichenkodierungen {#buffers-and-character-encodings}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.7.0, v14.18.0 | `base64url`-Kodierung eingeführt. |
| v6.4.0 | `latin1` als Alias für `binary` eingeführt. |
| v5.0.0 | Die veralteten Kodierungen `raw` und `raws` entfernt. |
:::

Beim Konvertieren zwischen `Buffer`s und Strings kann eine Zeichenkodierung angegeben werden. Wenn keine Zeichenkodierung angegeben wird, wird standardmäßig UTF-8 verwendet.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Gibt aus: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Gibt aus: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Gibt aus: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Gibt aus: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Gibt aus: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Gibt aus: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Gibt aus: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Gibt aus: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```
:::

Node.js-Puffer akzeptieren alle Fallvarianten von Kodierungs-Strings, die sie empfangen. Beispielsweise kann UTF-8 als `'utf8'`, `'UTF8'` oder `'uTf8'` angegeben werden.

Die von Node.js derzeit unterstützten Zeichenkodierungen sind die folgenden:

- `'utf8'` (Alias: `'utf-8'`): Multibyte-kodierte Unicode-Zeichen. Viele Webseiten und andere Dokumentformate verwenden [UTF-8](https://de.wikipedia.org/wiki/UTF-8). Dies ist die Standardzeichenkodierung. Beim Dekodieren eines `Buffer` in einen String, der nicht ausschließlich gültige UTF-8-Daten enthält, wird das Unicode-Ersatzzeichen `U+FFFD` � verwendet, um diese Fehler darzustellen.
- `'utf16le'` (Alias: `'utf-16le'`): Multibyte-kodierte Unicode-Zeichen. Im Gegensatz zu `'utf8'` wird jedes Zeichen in der Zeichenkette entweder mit 2 oder 4 Byte kodiert. Node.js unterstützt nur die [Little-Endian](https://de.wikipedia.org/wiki/Endianness)-Variante von [UTF-16](https://de.wikipedia.org/wiki/UTF-16).
- `'latin1'`: Latin-1 steht für [ISO-8859-1](https://de.wikipedia.org/wiki/ISO-8859-1). Diese Zeichenkodierung unterstützt nur die Unicode-Zeichen von `U+0000` bis `U+00FF`. Jedes Zeichen wird mit einem einzigen Byte kodiert. Zeichen, die nicht in diesen Bereich passen, werden abgeschnitten und Zeichen in diesem Bereich zugeordnet.

Das Konvertieren eines `Buffer` in einen String mit einer der oben genannten Methoden wird als Dekodieren bezeichnet, und das Konvertieren eines Strings in einen `Buffer` wird als Kodieren bezeichnet.

Node.js unterstützt auch die folgenden Binär-zu-Text-Kodierungen. Bei Binär-zu-Text-Kodierungen ist die Namenskonvention umgekehrt: Das Konvertieren eines `Buffer` in einen String wird typischerweise als Kodieren bezeichnet, und das Konvertieren eines Strings in einen `Buffer` als Dekodieren.

- `'base64'`: [Base64](https://de.wikipedia.org/wiki/Base64)-Kodierung. Beim Erstellen eines `Buffer` aus einem String akzeptiert diese Kodierung auch korrekt das "URL- und Dateinamen-sichere Alphabet", wie in [RFC 4648, Abschnitt 5](https://tools.ietf.org/html/rfc4648#section-5) spezifiziert. Leerzeichen wie Leerzeichen, Tabulatoren und Zeilenumbrüche innerhalb des Base64-kodierten Strings werden ignoriert.
- `'base64url'`: [base64url](https://tools.ietf.org/html/rfc4648#section-5)-Kodierung, wie in [RFC 4648, Abschnitt 5](https://tools.ietf.org/html/rfc4648#section-5) spezifiziert. Beim Erstellen eines `Buffer` aus einem String akzeptiert diese Kodierung auch korrekt reguläre Base64-kodierte Strings. Beim Kodieren eines `Buffer` in einen String lässt diese Kodierung die Auffüllung aus.
- `'hex'`: Kodiert jedes Byte als zwei hexadezimale Zeichen. Datentrunkierung kann auftreten, wenn Strings dekodiert werden, die nicht ausschließlich aus einer geraden Anzahl hexadezimaler Zeichen bestehen. Siehe unten für ein Beispiel.

Die folgenden Legacy-Zeichenkodierungen werden ebenfalls unterstützt:

- `'ascii'`: Nur für 7-Bit-[ASCII](https://de.wikipedia.org/wiki/ASCII)-Daten. Beim Kodieren eines Strings in einen `Buffer` entspricht dies der Verwendung von `'latin1'`. Beim Dekodieren eines `Buffer` in einen String setzt die Verwendung dieser Kodierung zusätzlich das höchste Bit jedes Bytes zurück, bevor es als `'latin1'` dekodiert wird. Im Allgemeinen sollte es keinen Grund geben, diese Kodierung zu verwenden, da `'utf8'` (oder, wenn bekannt ist, dass die Daten immer nur ASCII sind, `'latin1'`) eine bessere Wahl beim Kodieren oder Dekodieren von reinem ASCII-Text ist. Es wird nur aus Gründen der Legacy-Kompatibilität bereitgestellt.
- `'binary'`: Alias für `'latin1'`. Der Name dieser Kodierung kann sehr irreführend sein, da alle hier aufgeführten Kodierungen zwischen Strings und Binärdaten konvertieren. Für die Konvertierung zwischen Strings und `Buffer`s ist typischerweise `'utf8'` die richtige Wahl.
- `'ucs2'`, `'ucs-2'`: Aliase von `'utf16le'`. UCS-2 bezog sich früher auf eine Variante von UTF-16, die keine Zeichen mit Codepunkten größer als U+FFFF unterstützte. In Node.js werden diese Codepunkte immer unterstützt.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.from('1ag123', 'hex');
// Gibt <Buffer 1a> aus, Daten werden abgeschnitten, wenn der erste nicht-hexadezimale Wert
// ('g') angetroffen wird.

Buffer.from('1a7', 'hex');
// Gibt <Buffer 1a> aus, Daten werden abgeschnitten, wenn die Daten mit einer einzelnen Ziffer ('7') enden.

Buffer.from('1634', 'hex');
// Gibt <Buffer 16 34> aus, alle Daten werden dargestellt.
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.from('1ag123', 'hex');
// Gibt <Buffer 1a> aus, Daten werden abgeschnitten, wenn der erste nicht-hexadezimale Wert
// ('g') angetroffen wird.

Buffer.from('1a7', 'hex');
// Gibt <Buffer 1a> aus, Daten werden abgeschnitten, wenn die Daten mit einer einzelnen Ziffer ('7') enden.

Buffer.from('1634', 'hex');
// Gibt <Buffer 16 34> aus, alle Daten werden dargestellt.
```
:::

Moderne Webbrowser folgen dem [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/), der sowohl `'latin1'` als auch `'ISO-8859-1'` in `'win-1252'` umbenennt. Dies bedeutet, dass bei Aktionen wie `http.get()`, wenn der zurückgegebene Zeichensatz einer der in der WHATWG-Spezifikation aufgeführten ist, es möglich ist, dass der Server tatsächlich `'win-1252'`-kodierte Daten zurückgegeben hat, und die Verwendung der `'latin1'`-Kodierung die Zeichen möglicherweise falsch dekodiert.


## Buffers und TypedArrays {#buffers-and-typedarrays}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v3.0.0 | Die Klasse `Buffer` erbt jetzt von `Uint8Array`. |
:::

`Buffer`-Instanzen sind auch JavaScript [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)- und [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)-Instanzen. Alle [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)-Methoden sind auf `Buffer`s verfügbar. Es gibt jedoch subtile Inkompatibilitäten zwischen der `Buffer`-API und der [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)-API.

Insbesondere:

- Während [`TypedArray.prototype.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice) eine Kopie eines Teils des `TypedArray` erstellt, erstellt [`Buffer.prototype.slice()`](/de/nodejs/api/buffer#bufslicestart-end) eine Ansicht über den vorhandenen `Buffer` ohne zu kopieren. Dieses Verhalten kann überraschend sein und existiert nur aus Gründen der Legacy-Kompatibilität. [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray) kann verwendet werden, um das Verhalten von [`Buffer.prototype.slice()`](/de/nodejs/api/buffer#bufslicestart-end) sowohl auf `Buffer`s als auch auf anderen `TypedArray`s zu erreichen, und sollte bevorzugt werden.
- [`buf.toString()`](/de/nodejs/api/buffer#buftostringencoding-start-end) ist inkompatibel mit seinem `TypedArray`-Äquivalent.
- Eine Reihe von Methoden, z. B. [`buf.indexOf()`](/de/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding), unterstützen zusätzliche Argumente.

Es gibt zwei Möglichkeiten, neue [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)-Instanzen aus einem `Buffer` zu erstellen:

- Das Übergeben eines `Buffer` an einen [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)-Konstruktor kopiert den Inhalt des `Buffer`s, interpretiert als ein Array von ganzen Zahlen und nicht als eine Byte-Sequenz des Zieltyps.



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

- Das Übergeben des zugrunde liegenden [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) des `Buffer`s erstellt ein [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), das sich seinen Speicher mit dem `Buffer` teilt.



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

Es ist möglich, einen neuen `Buffer` zu erstellen, der denselben zugewiesenen Speicher wie eine [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)-Instanz verwendet, indem die `.buffer`-Eigenschaft des `TypedArray`-Objekts auf die gleiche Weise verwendet wird. [`Buffer.from()`](/de/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) verhält sich in diesem Zusammenhang wie `new Uint8Array()`.



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

Beim Erstellen eines `Buffer` mithilfe des `.buffer` eines [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ist es möglich, nur einen Teil des zugrunde liegenden [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) zu verwenden, indem die Parameter `byteOffset` und `length` übergeben werden.



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

`Buffer.from()` und [`TypedArray.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from) haben unterschiedliche Signaturen und Implementierungen. Insbesondere akzeptieren die [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)-Varianten ein zweites Argument, das eine Mapping-Funktion ist, die für jedes Element des typisierten Arrays aufgerufen wird:

- `TypedArray.from(source[, mapFn[, thisArg]])`

Die `Buffer.from()`-Methode unterstützt jedoch nicht die Verwendung einer Mapping-Funktion:

- [`Buffer.from(array)`](/de/nodejs/api/buffer#static-method-bufferfromarray)
- [`Buffer.from(buffer)`](/de/nodejs/api/buffer#static-method-bufferfrombuffer)
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/de/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)
- [`Buffer.from(string[, encoding])`](/de/nodejs/api/buffer#static-method-bufferfromstring-encoding)


## Puffer und Iteration {#buffers-and-iteration}

`Buffer`-Instanzen können mit der `for..of`-Syntax iteriert werden:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Gibt aus:
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
// Gibt aus:
//   1
//   2
//   3
```
:::

Zusätzlich können die Methoden [`buf.values()`](/de/nodejs/api/buffer#bufvalues), [`buf.keys()`](/de/nodejs/api/buffer#bufkeys) und [`buf.entries()`](/de/nodejs/api/buffer#bufentries) verwendet werden, um Iteratoren zu erstellen.

## Klasse: `Blob` {#class-blob}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0, v16.17.0 | Nicht mehr experimentell. |
| v15.7.0, v14.18.0 | Hinzugefügt in: v15.7.0, v14.18.0 |
:::

Ein [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) kapselt unveränderliche, rohe Daten, die sicher über mehrere Worker-Threads hinweg geteilt werden können.

### `new buffer.Blob([sources[, options]])` {#new-bufferblobsources-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v16.7.0 | Die Standardoption `endings` wurde hinzugefügt, um Zeilenumbrüche zu ersetzen, und die nicht standardmäßige Option `encoding` wurde entfernt. |
| v15.7.0, v14.18.0 | Hinzugefügt in: v15.7.0, v14.18.0 |
:::

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/de/nodejs/api/buffer#class-blob) Ein Array von Zeichenketten, [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)-, [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)-, [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)- oder [\<Blob\>](/de/nodejs/api/buffer#class-blob)-Objekten oder eine beliebige Mischung solcher Objekte, die innerhalb des `Blob` gespeichert werden.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Entweder `'transparent'` oder `'native'`. Wenn auf `'native'` gesetzt, werden Zeilenenden in String-Quellteilen in das plattformspezifische Zeilenende konvertiert, wie es von `require('node:os').EOL` angegeben wird.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Blob-Content-Type. Die Absicht ist, dass `type` den MIME-Medientyp der Daten vermittelt, es wird jedoch keine Validierung des Typformats durchgeführt.

Erstellt ein neues `Blob`-Objekt, das eine Verkettung der angegebenen Quellen enthält.

[\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)-, [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)-, [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)- und [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)-Quellen werden in den 'Blob' kopiert und können daher nach der Erstellung des 'Blob' sicher geändert werden.

String-Quellen werden als UTF-8-Byte-Sequenzen kodiert und in den Blob kopiert. Nicht übereinstimmende Surrogate-Paare innerhalb jedes String-Teils werden durch Unicode-U+FFFD-Ersetzungszeichen ersetzt.


### `blob.arrayBuffer()` {#blobarraybuffer}

**Hinzugefügt in: v15.7.0, v14.18.0**

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Gibt ein Promise zurück, das mit einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) erfüllt wird, das eine Kopie der `Blob`-Daten enthält.

#### `blob.bytes()` {#blobbytes}

**Hinzugefügt in: v22.3.0, v20.16.0**

Die `blob.bytes()`-Methode gibt das Byte des `Blob`-Objekts als `Promise<Uint8Array>` zurück.

```js [ESM]
const blob = new Blob(['hello']);
blob.bytes().then((bytes) => {
  console.log(bytes); // Gibt aus: Uint8Array(5) [ 104, 101, 108, 108, 111 ]
});
```
### `blob.size` {#blobsize}

**Hinzugefügt in: v15.7.0, v14.18.0**

Die Gesamtgröße des `Blob` in Bytes.

### `blob.slice([start[, end[, type]]])` {#blobslicestart-end-type}

**Hinzugefügt in: v15.7.0, v14.18.0**

- `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Startindex.
- `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Endindex.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Content-Type für das neue `Blob`

Erstellt und gibt ein neues `Blob` zurück, das eine Teilmenge der Daten dieses `Blob`-Objekts enthält. Das ursprüngliche `Blob` wird nicht verändert.

### `blob.stream()` {#blobstream}

**Hinzugefügt in: v16.7.0**

- Gibt zurück: [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)

Gibt ein neues `ReadableStream` zurück, das es ermöglicht, den Inhalt des `Blob` zu lesen.

### `blob.text()` {#blobtext}

**Hinzugefügt in: v15.7.0, v14.18.0**

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Gibt ein Promise zurück, das mit dem Inhalt des `Blob` erfüllt wird, der als UTF-8-String dekodiert wurde.

### `blob.type` {#blobtype}

**Hinzugefügt in: v15.7.0, v14.18.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der Content-Type des `Blob`.


### `Blob`-Objekte und `MessageChannel` {#blob-objects-and-messagechannel}

Sobald ein [\<Blob\>](/de/nodejs/api/buffer#class-blob)-Objekt erstellt wurde, kann es über `MessagePort` an mehrere Ziele gesendet werden, ohne die Daten zu übertragen oder sofort zu kopieren. Die im `Blob` enthaltenen Daten werden nur kopiert, wenn die Methoden `arrayBuffer()` oder `text()` aufgerufen werden.

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

## Klasse: `Buffer` {#class-buffer}

Die Klasse `Buffer` ist ein globaler Typ für den direkten Umgang mit binären Daten. Sie kann auf verschiedene Arten konstruiert werden.

### Statische Methode: `Buffer.alloc(size[, fill[, encoding]])` {#static-method-bufferallocsize-fill-encoding}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Wirft ERR_INVALID_ARG_TYPE oder ERR_OUT_OF_RANGE anstelle von ERR_INVALID_ARG_VALUE für ungültige Eingabeargumente. |
| v15.0.0 | Wirft ERR_INVALID_ARG_VALUE anstelle von ERR_INVALID_OPT_VALUE für ungültige Eingabeargumente. |
| v10.0.0 | Der Versuch, einen Puffer mit ungleich Null Länge mit einem Puffer der Länge Null zu füllen, löst eine Ausnahme aus. |
| v10.0.0 | Das Angeben einer ungültigen Zeichenfolge für `fill` löst eine Ausnahme aus. |
| v8.9.3 | Das Angeben einer ungültigen Zeichenfolge für `fill` führt jetzt zu einem mit Nullen gefüllten Puffer. |
| v5.10.0 | Hinzugefügt in: v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die gewünschte Länge des neuen `Buffer`.
- `fill` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein Wert, mit dem der neue `Buffer` vorgefüllt werden soll. **Standard:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn `fill` eine Zeichenfolge ist, ist dies ihre Kodierung. **Standard:** `'utf8'`.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Allokiert einen neuen `Buffer` von `size` Bytes. Wenn `fill` `undefined` ist, wird der `Buffer` mit Nullen gefüllt.

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

Wenn `size` größer als [`buffer.constants.MAX_LENGTH`](/de/nodejs/api/buffer#bufferconstantsmax_length) oder kleiner als 0 ist, wird [`ERR_OUT_OF_RANGE`](/de/nodejs/api/errors#err_out_of_range) geworfen.

Wenn `fill` angegeben ist, wird der zugewiesene `Buffer` initialisiert, indem [`buf.fill(fill)`](/de/nodejs/api/buffer#buffillvalue-offset-end-encoding) aufgerufen wird.

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

Wenn sowohl `fill` als auch `encoding` angegeben sind, wird der zugewiesene `Buffer` initialisiert, indem [`buf.fill(fill, encoding)`](/de/nodejs/api/buffer#buffillvalue-offset-end-encoding) aufgerufen wird.

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

Das Aufrufen von [`Buffer.alloc()`](/de/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) kann messbar langsamer sein als die Alternative [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize), stellt aber sicher, dass der Inhalt der neu erstellten `Buffer`-Instanz niemals sensible Daten aus vorherigen Zuweisungen enthält, einschließlich Daten, die möglicherweise nicht für `Buffer` zugewiesen wurden.

Ein `TypeError` wird ausgelöst, wenn `size` keine Zahl ist.


### Statische Methode: `Buffer.allocUnsafe(size)` {#static-method-bufferallocunsafesize}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Wirft ERR_INVALID_ARG_TYPE oder ERR_OUT_OF_RANGE anstelle von ERR_INVALID_ARG_VALUE für ungültige Eingabeargumente. |
| v15.0.0 | Wirft ERR_INVALID_ARG_VALUE anstelle von ERR_INVALID_OPT_VALUE für ungültige Eingabeargumente. |
| v7.0.0 | Das Übergeben einer negativen `size` löst jetzt einen Fehler aus. |
| v5.10.0 | Hinzugefügt in: v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die gewünschte Länge des neuen `Buffer`.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Alloziert einen neuen `Buffer` von `size` Bytes. Wenn `size` größer als [`buffer.constants.MAX_LENGTH`](/de/nodejs/api/buffer#bufferconstantsmax_length) oder kleiner als 0 ist, wird [`ERR_OUT_OF_RANGE`](/de/nodejs/api/errors#err_out_of_range) geworfen.

Der zugrunde liegende Speicher für `Buffer`-Instanzen, die auf diese Weise erstellt werden, wird *nicht initialisiert*. Der Inhalt des neu erstellten `Buffer` ist unbekannt und *kann sensible Daten enthalten*. Verwenden Sie stattdessen [`Buffer.alloc()`](/de/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding), um `Buffer`-Instanzen mit Nullen zu initialisieren.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Gibt aus (Inhalt kann variieren): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Gibt aus: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Gibt aus (Inhalt kann variieren): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Gibt aus: <Buffer 00 00 00 00 00 00 00 00 00 00>
```
:::

Ein `TypeError` wird geworfen, wenn `size` keine Zahl ist.

Das `Buffer`-Modul präalloziert eine interne `Buffer`-Instanz der Größe [`Buffer.poolSize`](/de/nodejs/api/buffer#class-property-bufferpoolsize), die als Pool für die schnelle Allokation neuer `Buffer`-Instanzen verwendet wird, die mit [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.from(array)`](/de/nodejs/api/buffer#static-method-bufferfromarray), [`Buffer.from(string)`](/de/nodejs/api/buffer#static-method-bufferfromstring-encoding) und [`Buffer.concat()`](/de/nodejs/api/buffer#static-method-bufferconcatlist-totallength) nur erstellt werden, wenn `size` kleiner als `Buffer.poolSize \>\>\> 1` (Abrunden von [`Buffer.poolSize`](/de/nodejs/api/buffer#class-property-bufferpoolsize) geteilt durch zwei).

Die Verwendung dieses präallozierten internen Speicherpools ist ein wesentlicher Unterschied zwischen dem Aufruf von `Buffer.alloc(size, fill)` und `Buffer.allocUnsafe(size).fill(fill)`. Insbesondere wird `Buffer.alloc(size, fill)` *niemals* den internen `Buffer`-Pool verwenden, während `Buffer.allocUnsafe(size).fill(fill)` den internen `Buffer`-Pool verwendet, wenn `size` kleiner oder gleich der Hälfte von [`Buffer.poolSize`](/de/nodejs/api/buffer#class-property-bufferpoolsize) ist. Der Unterschied ist subtil, kann aber wichtig sein, wenn eine Anwendung die zusätzliche Leistung benötigt, die [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize) bietet.


### Statische Methode: `Buffer.allocUnsafeSlow(size)` {#static-method-bufferallocunsafeslowsize}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Wirf ERR_INVALID_ARG_TYPE oder ERR_OUT_OF_RANGE anstelle von ERR_INVALID_ARG_VALUE für ungültige Eingabeargumente. |
| v15.0.0 | Wirf ERR_INVALID_ARG_VALUE anstelle von ERR_INVALID_OPT_VALUE für ungültige Eingabeargumente. |
| v5.12.0 | Hinzugefügt in: v5.12.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die gewünschte Länge des neuen `Buffer`.
- Rückgabewert: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Alloziert einen neuen `Buffer` von `size` Bytes. Wenn `size` größer ist als [`buffer.constants.MAX_LENGTH`](/de/nodejs/api/buffer#bufferconstantsmax_length) oder kleiner als 0, wird [`ERR_OUT_OF_RANGE`](/de/nodejs/api/errors#err_out_of_range) geworfen. Ein `Buffer` mit der Länge Null wird erstellt, wenn `size` 0 ist.

Der zugrunde liegende Speicher für `Buffer`-Instanzen, die auf diese Weise erstellt wurden, wird *nicht initialisiert*. Der Inhalt des neu erstellten `Buffer` ist unbekannt und *kann sensible Daten enthalten*. Verwenden Sie [`buf.fill(0)`](/de/nodejs/api/buffer#buffillvalue-offset-end-encoding), um solche `Buffer`-Instanzen mit Nullen zu initialisieren.

Wenn [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize) zum Allokieren neuer `Buffer`-Instanzen verwendet wird, werden Allokationen kleiner als `Buffer.poolSize \>\>\> 1` (4KiB, wenn die Standard-poolSize verwendet wird) von einem einzelnen, vorab allokierten `Buffer` geschnitten. Dies ermöglicht es Anwendungen, den Garbage-Collection-Overhead der Erstellung vieler einzeln allokierter `Buffer`-Instanzen zu vermeiden. Dieser Ansatz verbessert sowohl die Leistung als auch die Speichernutzung, indem die Notwendigkeit entfällt, so viele einzelne `ArrayBuffer`-Objekte zu verfolgen und zu bereinigen.

Wenn ein Entwickler jedoch möglicherweise einen kleinen Speicherblock aus einem Pool für eine unbestimmte Zeit aufbewahren muss, kann es ratsam sein, eine ungepoolte `Buffer`-Instanz mit `Buffer.allocUnsafeSlow()` zu erstellen und dann die relevanten Bits herauszukopieren.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Es müssen ein paar kleine Speicherblöcke aufbewahrt werden.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Allokiere für aufbewahrte Daten.
    const sb = Buffer.allocUnsafeSlow(10);

    // Kopiere die Daten in die neue Allokation.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Es müssen ein paar kleine Speicherblöcke aufbewahrt werden.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Allokiere für aufbewahrte Daten.
    const sb = Buffer.allocUnsafeSlow(10);

    // Kopiere die Daten in die neue Allokation.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```
:::

Ein `TypeError` wird geworfen, wenn `size` keine Zahl ist.


### Statische Methode: `Buffer.byteLength(string[, encoding])` {#static-method-bufferbytelengthstring-encoding}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v7.0.0 | Die Übergabe ungültiger Eingaben wirft nun einen Fehler. |
| v5.10.0 | Der Parameter `string` kann nun ein beliebiger `TypedArray`, `DataView` oder `ArrayBuffer` sein. |
| v0.1.90 | Hinzugefügt in: v0.1.90 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Ein Wert, dessen Länge berechnet werden soll.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn `string` ein String ist, ist dies seine Kodierung. **Standard:** `'utf8'`.
- Rückgabe: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Bytes, die in `string` enthalten sind.

Gibt die Byte-Länge eines Strings zurück, wenn er mit `encoding` kodiert wird. Dies ist nicht dasselbe wie [`String.prototype.length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length), das die Kodierung, die zur Konvertierung des Strings in Bytes verwendet wird, nicht berücksichtigt.

Für `'base64'`, `'base64url'` und `'hex'` geht diese Funktion von einer gültigen Eingabe aus. Für Strings, die nicht-Base64/Hex-kodierte Daten enthalten (z. B. Leerzeichen), kann der Rückgabewert größer sein als die Länge eines aus dem String erstellten `Buffer`s.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} Zeichen, ` +
            `${Buffer.byteLength(str, 'utf8')} Bytes`);
// Prints: ½ + ¼ = ¾: 9 Zeichen, 12 Bytes
```

```js [CJS]
const { Buffer } = require('node:buffer');

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} Zeichen, ` +
            `${Buffer.byteLength(str, 'utf8')} Bytes`);
// Prints: ½ + ¼ = ¾: 9 Zeichen, 12 Bytes
```
:::

Wenn `string` ein `Buffer`/[`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)/[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)/[`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)/[`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) ist, wird die von `.byteLength` gemeldete Byte-Länge zurückgegeben.


### Statische Methode: `Buffer.compare(buf1, buf2)` {#static-method-buffercomparebuf1-buf2}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Die Argumente können jetzt `Uint8Array`s sein. |
| v0.11.13 | Hinzugefügt in: v0.11.13 |
:::

- `buf1` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `buf2` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Entweder `-1`, `0` oder `1`, abhängig vom Ergebnis des Vergleichs. Siehe [`buf.compare()`](/de/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend) für Details.

Vergleicht `buf1` mit `buf2`, typischerweise zum Sortieren von Arrays von `Buffer`-Instanzen. Dies ist äquivalent zum Aufruf von [`buf1.compare(buf2)`](/de/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Prints: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (Dieses Ergebnis ist gleich: [buf2, buf1].)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Prints: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (Dieses Ergebnis ist gleich: [buf2, buf1].)
```
:::

### Statische Methode: `Buffer.concat(list[, totalLength])` {#static-method-bufferconcatlist-totallength}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Die Elemente von `list` können jetzt `Uint8Array`s sein. |
| v0.7.11 | Hinzugefügt in: v0.7.11 |
:::

- `list` [\<Buffer[]\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Liste von `Buffer`- oder [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)-Instanzen, die verkettet werden sollen.
- `totalLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gesamtlänge der `Buffer`-Instanzen in `list` bei Verkettung.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Gibt einen neuen `Buffer` zurück, der das Ergebnis der Verkettung aller `Buffer`-Instanzen in der `list` ist.

Wenn die Liste keine Elemente enthält oder wenn `totalLength` 0 ist, wird ein neuer `Buffer` mit der Länge Null zurückgegeben.

Wenn `totalLength` nicht angegeben ist, wird sie aus den `Buffer`-Instanzen in `list` berechnet, indem ihre Längen addiert werden.

Wenn `totalLength` angegeben ist, wird sie in eine vorzeichenlose Ganzzahl umgewandelt. Wenn die kombinierte Länge der `Buffer`s in `list` `totalLength` überschreitet, wird das Ergebnis auf `totalLength` abgeschnitten. Wenn die kombinierte Länge der `Buffer`s in `list` kleiner als `totalLength` ist, wird der verbleibende Platz mit Nullen gefüllt.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Erstellt einen einzelnen `Buffer` aus einer Liste von drei `Buffer`-Instanzen.

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

// Erstellt einen einzelnen `Buffer` aus einer Liste von drei `Buffer`-Instanzen.

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

`Buffer.concat()` kann auch den internen `Buffer`-Pool wie [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize) verwenden.


### Statische Methode: `Buffer.copyBytesFrom(view[, offset[, length]])` {#static-method-buffercopybytesfromview-offset-length}

**Hinzugefügt in: v19.8.0, v18.16.0**

- `view` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Das [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), das kopiert werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Startoffset innerhalb von `view`. **Standardwert**: `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Elemente aus `view`, die kopiert werden sollen. **Standardwert**: `view.length - offset`.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Kopiert den zugrunde liegenden Speicher von `view` in einen neuen `Buffer`.

```js [ESM]
const u16 = new Uint16Array([0, 0xffff]);
const buf = Buffer.copyBytesFrom(u16, 1, 1);
u16[1] = 0;
console.log(buf.length); // 2
console.log(buf[0]); // 255
console.log(buf[1]); // 255
```
### Statische Methode: `Buffer.from(array)` {#static-method-bufferfromarray}

**Hinzugefügt in: v5.10.0**

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Allokiert einen neuen `Buffer` mit einem `array` von Bytes im Bereich `0` – `255`. Array-Einträge außerhalb dieses Bereichs werden abgeschnitten, um in diesen zu passen.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Erstellt einen neuen Buffer, der die UTF-8-Bytes der Zeichenkette 'buffer' enthält.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Erstellt einen neuen Buffer, der die UTF-8-Bytes der Zeichenkette 'buffer' enthält.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```
:::

Wenn `array` ein `Array`-ähnliches Objekt ist (d. h. eines mit einer `length`-Eigenschaft vom Typ `number`), wird es so behandelt, als wäre es ein Array, es sei denn, es ist ein `Buffer` oder ein `Uint8Array`. Dies bedeutet, dass alle anderen `TypedArray`-Varianten als ein `Array` behandelt werden. Um einen `Buffer` aus den Bytes zu erstellen, die ein `TypedArray` unterstützen, verwenden Sie [`Buffer.copyBytesFrom()`](/de/nodejs/api/buffer#static-method-buffercopybytesfromview-offset-length).

Ein `TypeError` wird ausgelöst, wenn `array` kein `Array` oder ein anderer Typ ist, der für `Buffer.from()`-Varianten geeignet ist.

`Buffer.from(array)` und [`Buffer.from(string)`](/de/nodejs/api/buffer#static-method-bufferfromstring-encoding) können auch den internen `Buffer`-Pool wie [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize) verwenden.


### Statische Methode: `Buffer.from(arrayBuffer[, byteOffset[, length]])` {#static-method-bufferfromarraybuffer-byteoffset-length}

**Hinzugefügt in: v5.10.0**

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Ein [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), beispielsweise die `.buffer`-Eigenschaft eines [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Index des ersten Bytes, das freigelegt werden soll. **Standard:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die freigelegt werden sollen. **Standard:** `arrayBuffer.byteLength - byteOffset`.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Dadurch wird eine Ansicht des [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) erstellt, ohne den zugrunde liegenden Speicher zu kopieren. Wenn beispielsweise ein Verweis auf die `.buffer`-Eigenschaft einer [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)-Instanz übergeben wird, verwendet der neu erstellte `Buffer` denselben zugewiesenen Speicher wie der zugrunde liegende `ArrayBuffer` des [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Teilt sich den Speicher mit `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Gibt aus: <Buffer 88 13 a0 0f>

// Das Ändern des ursprünglichen Uint16Array ändert auch den Puffer.
arr[1] = 6000;

console.log(buf);
// Gibt aus: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Teilt sich den Speicher mit `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Gibt aus: <Buffer 88 13 a0 0f>

// Das Ändern des ursprünglichen Uint16Array ändert auch den Puffer.
arr[1] = 6000;

console.log(buf);
// Gibt aus: <Buffer 88 13 70 17>
```
:::

Die optionalen Argumente `byteOffset` und `length` geben einen Speicherbereich innerhalb des `arrayBuffer` an, der von dem `Buffer` gemeinsam genutzt wird.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Gibt aus: 2
```

```js [CJS]
const { Buffer } = require('node:buffer');

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Gibt aus: 2
```
:::

Ein `TypeError` wird ausgelöst, wenn `arrayBuffer` kein [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) oder ein [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) oder ein anderer Typ ist, der für `Buffer.from()`-Varianten geeignet ist.

Es ist wichtig zu beachten, dass ein zugrunde liegendes `ArrayBuffer` einen Speicherbereich abdecken kann, der sich über die Grenzen einer `TypedArray`-Ansicht hinaus erstreckt. Ein neuer `Buffer`, der mit der `buffer`-Eigenschaft eines `TypedArray` erstellt wurde, kann sich über den Bereich des `TypedArray` hinaus erstrecken:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 Elemente
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 Elemente
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Gibt aus: <Buffer 63 64 65 66>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 Elemente
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 Elemente
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Gibt aus: <Buffer 63 64 65 66>
```
:::


### Statische Methode: `Buffer.from(buffer)` {#static-method-bufferfrombuffer}

**Hinzugefügt in: v5.10.0**

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Ein existierender `Buffer` oder [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), von dem Daten kopiert werden sollen.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Kopiert die übergebenen `buffer`-Daten in eine neue `Buffer`-Instanz.

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

Ein `TypeError` wird ausgelöst, wenn `buffer` kein `Buffer` oder ein anderer für `Buffer.from()`-Varianten geeigneter Typ ist.

### Statische Methode: `Buffer.from(object[, offsetOrEncoding[, length]])` {#static-method-bufferfromobject-offsetorencoding-length}

**Hinzugefügt in: v8.2.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Objekt, das `Symbol.toPrimitive` oder `valueOf()` unterstützt.
- `offsetOrEncoding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein Byte-Offset oder eine Kodierung.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine Länge.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Für Objekte, deren `valueOf()`-Funktion einen Wert zurückgibt, der nicht strikt gleich `object` ist, wird `Buffer.from(object.valueOf(), offsetOrEncoding, length)` zurückgegeben.

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

Für Objekte, die `Symbol.toPrimitive` unterstützen, wird `Buffer.from(object[Symbol.toPrimitive]('string'), offsetOrEncoding)` zurückgegeben.

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

Ein `TypeError` wird ausgelöst, wenn `object` nicht über die genannten Methoden verfügt oder kein anderer für `Buffer.from()`-Varianten geeigneter Typ ist.


### Statische Methode: `Buffer.from(string[, encoding])` {#static-method-bufferfromstring-encoding}

**Hinzugefügt in: v5.10.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine zu kodierende Zeichenkette.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Kodierung von `string`. **Standard:** `'utf8'`.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Erstellt einen neuen `Buffer` mit `string`. Der Parameter `encoding` identifiziert die Zeichenkodierung, die bei der Konvertierung von `string` in Bytes verwendet werden soll.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Prints: this is a tést
console.log(buf2.toString());
// Prints: this is a tést
console.log(buf1.toString('latin1'));
// Prints: this is a tÃ©st
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Prints: this is a tést
console.log(buf2.toString());
// Prints: this is a tést
console.log(buf1.toString('latin1'));
// Prints: this is a tÃ©st
```
:::

Ein `TypeError` wird ausgelöst, wenn `string` keine Zeichenkette oder ein anderer für `Buffer.from()`-Varianten geeigneter Typ ist.

[`Buffer.from(string)`](/de/nodejs/api/buffer#static-method-bufferfromstring-encoding) kann auch den internen `Buffer`-Pool wie [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize) verwenden.

### Statische Methode: `Buffer.isBuffer(obj)` {#static-method-bufferisbufferobj}

**Hinzugefügt in: v0.1.101**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn `obj` ein `Buffer` ist, andernfalls `false`.

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


### Statische Methode: `Buffer.isEncoding(encoding)` {#static-method-bufferisencodingencoding}

**Hinzugefügt in: v0.9.1**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein Name einer Zeichenkodierung, die überprüft werden soll.
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn `encoding` der Name einer unterstützten Zeichenkodierung ist, andernfalls `false`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

console.log(Buffer.isEncoding('utf8'));
// Gibt aus: true

console.log(Buffer.isEncoding('hex'));
// Gibt aus: true

console.log(Buffer.isEncoding('utf/8'));
// Gibt aus: false

console.log(Buffer.isEncoding(''));
// Gibt aus: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

console.log(Buffer.isEncoding('utf8'));
// Gibt aus: true

console.log(Buffer.isEncoding('hex'));
// Gibt aus: true

console.log(Buffer.isEncoding('utf/8'));
// Gibt aus: false

console.log(Buffer.isEncoding(''));
// Gibt aus: false
```
:::

### Klasseneigenschaft: `Buffer.poolSize` {#class-property-bufferpoolsize}

**Hinzugefügt in: v0.11.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `8192`

Dies ist die Größe (in Bytes) der vorab zugewiesenen internen `Buffer`-Instanzen, die für das Pooling verwendet werden. Dieser Wert kann geändert werden.

### `buf[index]` {#bufindex}

- `index` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der Indexoperator `[index]` kann verwendet werden, um das Oktett an der Position `index` in `buf` abzurufen und festzulegen. Die Werte beziehen sich auf einzelne Bytes, daher liegt der zulässige Wertebereich zwischen `0x00` und `0xFF` (hexadezimal) oder `0` und `255` (dezimal).

Dieser Operator wird von `Uint8Array` geerbt, daher ist sein Verhalten bei Zugriff außerhalb der Grenzen das gleiche wie bei `Uint8Array`. Mit anderen Worten, `buf[index]` gibt `undefined` zurück, wenn `index` negativ oder größer oder gleich `buf.length` ist, und `buf[index] = value` ändert den Puffer nicht, wenn `index` negativ oder `\>= buf.length` ist.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Kopiere eine ASCII-Zeichenkette byteweise in einen `Buffer`.
// (Dies funktioniert nur für reine ASCII-Zeichenketten. Im Allgemeinen sollte man
// `Buffer.from()` verwenden, um diese Konvertierung durchzuführen.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Gibt aus: Node.js
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Kopiere eine ASCII-Zeichenkette byteweise in einen `Buffer`.
// (Dies funktioniert nur für reine ASCII-Zeichenketten. Im Allgemeinen sollte man
// `Buffer.from()` verwenden, um diese Konvertierung durchzuführen.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Gibt aus: Node.js
```
:::


### `buf.buffer` {#bufbuffer}

- [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) Das zugrunde liegende `ArrayBuffer`-Objekt, auf dessen Basis dieses `Buffer`-Objekt erstellt wurde.

Es wird nicht garantiert, dass dieses `ArrayBuffer` exakt mit dem ursprünglichen `Buffer` übereinstimmt. Weitere Informationen finden Sie in den Hinweisen zu `buf.byteOffset`.

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

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der `byteOffset` des zugrunde liegenden `ArrayBuffer`-Objekts des `Buffer`s.

Wenn `byteOffset` in `Buffer.from(ArrayBuffer, byteOffset, length)` gesetzt wird, oder manchmal, wenn ein `Buffer` kleiner als `Buffer.poolSize` zugewiesen wird, beginnt der Puffer nicht mit einem Null-Offset im zugrunde liegenden `ArrayBuffer`.

Dies kann zu Problemen führen, wenn direkt über `buf.buffer` auf das zugrunde liegende `ArrayBuffer` zugegriffen wird, da andere Teile des `ArrayBuffer` möglicherweise nicht mit dem `Buffer`-Objekt selbst in Beziehung stehen.

Ein häufiges Problem bei der Erstellung eines `TypedArray`-Objekts, das sich seinen Speicher mit einem `Buffer` teilt, ist, dass in diesem Fall der `byteOffset` korrekt angegeben werden muss:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Erstellen Sie einen Puffer, der kleiner als `Buffer.poolSize` ist.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// Wenn der Node.js-Buffer in ein Int8Array umgewandelt wird, verwenden Sie den Byte-Offset,
// um sich nur auf den Teil von `nodeBuffer.buffer` zu beziehen, der den Speicher
// für `nodeBuffer` enthält.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Erstellen Sie einen Puffer, der kleiner als `Buffer.poolSize` ist.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// Wenn der Node.js-Buffer in ein Int8Array umgewandelt wird, verwenden Sie den Byte-Offset,
// um sich nur auf den Teil von `nodeBuffer.buffer` zu beziehen, der den Speicher
// für `nodeBuffer` enthält.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```
:::


### `buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])` {#bufcomparetarget-targetstart-targetend-sourcestart-sourceend}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Der Parameter `target` kann jetzt ein `Uint8Array` sein. |
| v5.11.0 | Zusätzliche Parameter zur Angabe von Offsets werden jetzt unterstützt. |
| v0.11.13 | Hinzugefügt in: v0.11.13 |
:::

- `target` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Ein `Buffer` oder [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), mit dem `buf` verglichen werden soll.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Offset innerhalb von `target`, an dem der Vergleich beginnen soll. **Standard:** `0`.
- `targetEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Offset innerhalb von `target`, an dem der Vergleich enden soll (nicht inklusive). **Standard:** `target.length`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Offset innerhalb von `buf`, an dem der Vergleich beginnen soll. **Standard:** `0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Offset innerhalb von `buf`, an dem der Vergleich enden soll (nicht inklusive). **Standard:** [`buf.length`](/de/nodejs/api/buffer#buflength).
- Rückgabe: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Vergleicht `buf` mit `target` und gibt eine Zahl zurück, die angibt, ob `buf` in der Sortierreihenfolge vor, nach oder gleich `target` steht. Der Vergleich basiert auf der tatsächlichen Bytefolge in jedem `Buffer`.

- `0` wird zurückgegeben, wenn `target` mit `buf` identisch ist
- `1` wird zurückgegeben, wenn `target` beim Sortieren *vor* `buf` stehen soll.
- `-1` wird zurückgegeben, wenn `target` beim Sortieren *nach* `buf` stehen soll.

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
// (Dieses Ergebnis entspricht: [buf1, buf3, buf2].)
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
// (Dieses Ergebnis entspricht: [buf1, buf3, buf2].)
```
:::

Die optionalen Argumente `targetStart`, `targetEnd`, `sourceStart` und `sourceEnd` können verwendet werden, um den Vergleich auf bestimmte Bereiche innerhalb von `target` bzw. `buf` zu beschränken.

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

[`ERR_OUT_OF_RANGE`](/de/nodejs/api/errors#err_out_of_range) wird ausgelöst, wenn `targetStart \< 0`, `sourceStart \< 0`, `targetEnd \> target.byteLength` oder `sourceEnd \> source.byteLength` ist.


### `buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])` {#bufcopytarget-targetstart-sourcestart-sourceend}

**Hinzugefügt in: v0.1.90**

- `target` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Ein `Buffer` oder [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) zum hineinkopieren.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Offset innerhalb von `target`, an dem mit dem Schreiben begonnen werden soll. **Standard:** `0`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Offset innerhalb von `buf`, ab dem mit dem Kopieren begonnen werden soll. **Standard:** `0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Offset innerhalb von `buf`, an dem das Kopieren beendet werden soll (nicht einschließlich). **Standard:** [`buf.length`](/de/nodejs/api/buffer#buflength).
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der kopierten Bytes.

Kopiert Daten aus einem Bereich von `buf` in einen Bereich in `target`, selbst wenn sich der `target`-Speicherbereich mit `buf` überschneidet.

[`TypedArray.prototype.set()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set) führt dieselbe Operation aus und ist für alle TypedArrays verfügbar, einschließlich Node.js `Buffer`s, obwohl es unterschiedliche Funktionsargumente verwendet.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Create two `Buffer` instances.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

// Copy `buf1` bytes 16 through 19 into `buf2` starting at byte 8 of `buf2`.
buf1.copy(buf2, 8, 16, 20);
// This is equivalent to:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Create two `Buffer` instances.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

// Copy `buf1` bytes 16 through 19 into `buf2` starting at byte 8 of `buf2`.
buf1.copy(buf2, 8, 16, 20);
// This is equivalent to:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
```
:::

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Create a `Buffer` and copy data from one region to an overlapping region
// within the same `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Prints: efghijghijklmnopqrstuvwxyz
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Create a `Buffer` and copy data from one region to an overlapping region
// within the same `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Prints: efghijghijklmnopqrstuvwxyz
```
:::


### `buf.entries()` {#bufentries}

**Hinzugefügt in: v1.1.0**

- Gibt zurück: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Erstellt und gibt einen [Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) von `[index, byte]`-Paaren aus dem Inhalt von `buf` zurück.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Protokolliert den gesamten Inhalt eines `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Prints:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Protokolliert den gesamten Inhalt eines `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Prints:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```
:::

### `buf.equals(otherBuffer)` {#bufequalsotherbuffer}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Die Argumente können jetzt `Uint8Array`s sein. |
| v0.11.13 | Hinzugefügt in: v0.11.13 |
:::

- `otherBuffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Ein `Buffer` oder [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), mit dem `buf` verglichen werden soll.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn sowohl `buf` als auch `otherBuffer` genau die gleichen Bytes haben, andernfalls `false`. Entspricht [`buf.compare(otherBuffer) === 0`](/de/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Prints: true
console.log(buf1.equals(buf3));
// Prints: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Prints: true
console.log(buf1.equals(buf3));
// Prints: false
```
:::


### `buf.fill(value[, offset[, end]][, encoding])` {#buffillvalue-offset-end-encoding}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v11.0.0 | Wirft `ERR_OUT_OF_RANGE` anstelle von `ERR_INDEX_OUT_OF_RANGE`. |
| v10.0.0 | Negative `end`-Werte werfen einen `ERR_INDEX_OUT_OF_RANGE`-Fehler. |
| v10.0.0 | Der Versuch, einen Puffer ungleich Null Länge mit einem Puffer der Länge Null zu füllen, löst eine Ausnahme aus. |
| v10.0.0 | Die Angabe einer ungültigen Zeichenkette für `value` löst eine Ausnahme aus. |
| v5.7.0 | Der Parameter `encoding` wird jetzt unterstützt. |
| v0.5.0 | Hinzugefügt in: v0.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Wert, mit dem `buf` gefüllt werden soll. Ein leerer Wert (String, Uint8Array, Buffer) wird zu `0` konvertiert.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Füllen von `buf` übersprungen werden sollen. **Standard:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wo das Füllen von `buf` beendet werden soll (nicht inklusive). **Standard:** [`buf.length`](/de/nodejs/api/buffer#buflength).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Kodierung für `value`, wenn `value` eine Zeichenkette ist. **Standard:** `'utf8'`.
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Eine Referenz auf `buf`.

Füllt `buf` mit dem angegebenen `value`. Wenn `offset` und `end` nicht angegeben werden, wird der gesamte `buf` gefüllt:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Füllen Sie einen `Buffer` mit dem ASCII-Zeichen 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Gibt aus: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Füllen Sie einen Puffer mit einer leeren Zeichenkette
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Gibt aus: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Füllen Sie einen `Buffer` mit dem ASCII-Zeichen 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Gibt aus: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Füllen Sie einen Puffer mit einer leeren Zeichenkette
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Gibt aus: <Buffer 00 00 00 00 00>
```
:::

`value` wird in einen `uint32`-Wert konvertiert, wenn es sich nicht um einen String, `Buffer` oder Integer handelt. Wenn der resultierende Integer größer als `255` (dezimal) ist, wird `buf` mit `value & 255` gefüllt.

Wenn der endgültige Schreibvorgang einer `fill()`-Operation auf ein Mehrbytezeichen fällt, werden nur die Bytes dieses Zeichens geschrieben, die in `buf` passen:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Füllen Sie einen `Buffer` mit einem Zeichen, das in UTF-8 zwei Bytes belegt.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Gibt aus: <Buffer c8 a2 c8 a2 c8>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Füllen Sie einen `Buffer` mit einem Zeichen, das in UTF-8 zwei Bytes belegt.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Gibt aus: <Buffer c8 a2 c8 a2 c8>
```
:::

Wenn `value` ungültige Zeichen enthält, wird es abgeschnitten; wenn keine gültigen Fülldaten mehr vorhanden sind, wird eine Ausnahme ausgelöst:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Gibt aus: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Gibt aus: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Wirft eine Ausnahme.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Gibt aus: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Gibt aus: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Wirft eine Ausnahme.
```
:::


### `buf.includes(value[, byteOffset][, encoding])` {#bufincludesvalue-byteoffset-encoding}

**Hinzugefügt in: v5.3.0**

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wonach gesucht werden soll.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wo die Suche in `buf` beginnen soll. Wenn negativ, wird der Offset vom Ende von `buf` berechnet. **Standardwert:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn `value` ein String ist, ist dies seine Kodierung. **Standardwert:** `'utf8'`.
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn `value` in `buf` gefunden wurde, andernfalls `false`.

Entspricht [`buf.indexOf() !== -1`](/de/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding).

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

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Der `value` kann nun ein `Uint8Array` sein. |
| v5.7.0, v4.4.0 | Wenn `encoding` übergeben wird, ist der Parameter `byteOffset` nicht mehr erforderlich. |
| v1.5.0 | Hinzugefügt in: v1.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wonach gesucht werden soll.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wo in `buf` mit der Suche begonnen werden soll. Wenn negativ, wird der Offset vom Ende von `buf` berechnet. **Standard:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn `value` ein String ist, ist dies die Kodierung, die verwendet wird, um die binäre Darstellung des Strings zu bestimmen, nach dem in `buf` gesucht wird. **Standard:** `'utf8'`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Index des ersten Vorkommens von `value` in `buf` oder `-1`, wenn `buf` nicht `value` enthält.

Wenn `value` ist:

- ein String, wird `value` gemäß der Zeichenkodierung in `encoding` interpretiert.
- ein `Buffer` oder [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), wird `value` vollständig verwendet. Um einen teilweisen `Buffer` zu vergleichen, verwenden Sie [`buf.subarray`](/de/nodejs/api/buffer#bufsubarraystart-end).
- eine Zahl, wird `value` als vorzeichenloser 8-Bit-Integer-Wert zwischen `0` und `255` interpretiert.

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

Wenn `value` kein String, keine Zahl oder kein `Buffer` ist, löst diese Methode einen `TypeError` aus. Wenn `value` eine Zahl ist, wird sie zu einem gültigen Byte-Wert, einer Ganzzahl zwischen 0 und 255, umgewandelt.

Wenn `byteOffset` keine Zahl ist, wird sie in eine Zahl umgewandelt. Wenn das Ergebnis der Umwandlung `NaN` oder `0` ist, wird der gesamte Puffer durchsucht. Dieses Verhalten stimmt mit [`String.prototype.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf) überein.

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

Wenn `value` ein leerer String oder ein leerer `Buffer` ist und `byteOffset` kleiner als `buf.length` ist, wird `byteOffset` zurückgegeben. Wenn `value` leer ist und `byteOffset` mindestens `buf.length` ist, wird `buf.length` zurückgegeben.


### `buf.keys()` {#bufkeys}

**Hinzugefügt in: v1.1.0**

- Gibt zurück: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Erstellt und gibt einen [Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) von `buf`-Schlüsseln (Indizes) zurück.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Gibt aus:
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
// Gibt aus:
//   0
//   1
//   2
//   3
//   4
//   5
```
:::

### `buf.lastIndexOf(value[, byteOffset][, encoding])` {#buflastindexofvalue-byteoffset-encoding}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Der `value` kann jetzt ein `Uint8Array` sein. |
| v6.0.0 | Hinzugefügt in: v6.0.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wonach gesucht werden soll.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wo die Suche in `buf` beginnen soll. Wenn negativ, wird der Offset vom Ende von `buf` berechnet. **Standard:** `buf.length - 1`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn `value` eine Zeichenkette ist, ist dies die Kodierung, die verwendet wird, um die binäre Darstellung der Zeichenkette zu bestimmen, die in `buf` gesucht wird. **Standard:** `'utf8'`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Index des letzten Vorkommens von `value` in `buf` oder `-1`, wenn `buf` nicht `value` enthält.

Identisch mit [`buf.indexOf()`](/de/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding), außer dass das letzte Vorkommens von `value` anstelle des ersten Vorkommens gefunden wird.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Gibt aus: 0
console.log(buf.lastIndexOf('buffer'));
// Gibt aus: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Gibt aus: 17
console.log(buf.lastIndexOf(97));
// Gibt aus: 15 (97 ist der dezimale ASCII-Wert für 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Gibt aus: -1
console.log(buf.lastIndexOf('buffer', 5));
// Gibt aus: 5
console.log(buf.lastIndexOf('buffer', 4));
// Gibt aus: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Gibt aus: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Gibt aus: 4
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Gibt aus: 0
console.log(buf.lastIndexOf('buffer'));
// Gibt aus: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Gibt aus: 17
console.log(buf.lastIndexOf(97));
// Gibt aus: 15 (97 ist der dezimale ASCII-Wert für 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Gibt aus: -1
console.log(buf.lastIndexOf('buffer', 5));
// Gibt aus: 5
console.log(buf.lastIndexOf('buffer', 4));
// Gibt aus: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Gibt aus: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Gibt aus: 4
```
:::

Wenn `value` keine Zeichenkette, Zahl oder `Buffer` ist, wirft diese Methode einen `TypeError`. Wenn `value` eine Zahl ist, wird sie in einen gültigen Bytewert, eine Ganzzahl zwischen 0 und 255, umgewandelt.

Wenn `byteOffset` keine Zahl ist, wird sie in eine Zahl umgewandelt. Alle Argumente, die zu `NaN` konvertiert werden, wie `{}` oder `undefined`, durchsuchen den gesamten Puffer. Dieses Verhalten stimmt mit [`String.prototype.lastIndexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf) überein.

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

Wenn `value` eine leere Zeichenkette oder ein leerer `Buffer` ist, wird `byteOffset` zurückgegeben.


### `buf.length` {#buflength}

**Hinzugefügt in: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt die Anzahl der Bytes in `buf` zurück.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Erstellt einen `Buffer` und schreibt einen kürzeren String mit UTF-8 hinein.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Gibt aus: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Gibt aus: 1234
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Erstellt einen `Buffer` und schreibt einen kürzeren String mit UTF-8 hinein.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Gibt aus: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Gibt aus: 1234
```
:::

### `buf.parent` {#bufparent}

**Veraltet seit: v8.0.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`buf.buffer`](/de/nodejs/api/buffer#bufbuffer).
:::

Die Eigenschaft `buf.parent` ist ein veralteter Alias für `buf.buffer`.

### `buf.readBigInt64BE([offset])` {#bufreadbigint64beoffset}

**Hinzugefügt in: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Lesebeginn übersprungen werden sollen. Muss Folgendes erfüllen: `0 \<= offset \<= buf.length - 8`. **Standard:** `0`.
- Gibt zurück: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Liest eine signierte, Big-Endian 64-Bit-Ganzzahl aus `buf` am angegebenen `offset`.

Ganzzahlen, die aus einem `Buffer` gelesen werden, werden als Zweierkomplement-Signaturwerte interpretiert.

### `buf.readBigInt64LE([offset])` {#bufreadbigint64leoffset}

**Hinzugefügt in: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Lesebeginn übersprungen werden sollen. Muss Folgendes erfüllen: `0 \<= offset \<= buf.length - 8`. **Standard:** `0`.
- Gibt zurück: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Liest eine signierte, Little-Endian 64-Bit-Ganzzahl aus `buf` am angegebenen `offset`.

Ganzzahlen, die aus einem `Buffer` gelesen werden, werden als Zweierkomplement-Signaturwerte interpretiert.


### `buf.readBigUInt64BE([offset])` {#bufreadbiguint64beoffset}

::: info [Historie]
| Version | Änderungen |
|---|---|
| v14.10.0, v12.19.0 | Diese Funktion ist auch als `buf.readBigUint64BE()` verfügbar. |
| v12.0.0, v10.20.0 | Hinzugefügt in: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Lesen übersprungen werden sollen. Muss Folgendes erfüllen: `0 \<= offset \<= buf.length - 8`. **Standard:** `0`.
- Gibt zurück: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Liest eine vorzeichenlose, Big-Endian 64-Bit-Ganzzahl von `buf` am angegebenen `offset`.

Diese Funktion ist auch unter dem Alias `readBigUint64BE` verfügbar.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Prints: 4294967295n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Prints: 4294967295n
```
:::

### `buf.readBigUInt64LE([offset])` {#bufreadbiguint64leoffset}

::: info [Historie]
| Version | Änderungen |
|---|---|
| v14.10.0, v12.19.0 | Diese Funktion ist auch als `buf.readBigUint64LE()` verfügbar. |
| v12.0.0, v10.20.0 | Hinzugefügt in: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Lesen übersprungen werden sollen. Muss Folgendes erfüllen: `0 \<= offset \<= buf.length - 8`. **Standard:** `0`.
- Gibt zurück: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Liest eine vorzeichenlose, Little-Endian 64-Bit-Ganzzahl von `buf` am angegebenen `offset`.

Diese Funktion ist auch unter dem Alias `readBigUint64LE` verfügbar.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Prints: 18446744069414584320n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Prints: 18446744069414584320n
```
:::


### `buf.readDoubleBE([offset])` {#bufreaddoublebeoffset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` wurde entfernt und keine implizite Konvertierung des Offsets in `uint32` mehr. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Lesebeginn übersprungen werden sollen. Muss `0 <= offset <= buf.length - 8` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest eine 64-Bit-Big-Endian-Double-Zahl aus `buf` am angegebenen `offset`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Gibt aus: 8.20788039913184e-304
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Gibt aus: 8.20788039913184e-304
```
:::

### `buf.readDoubleLE([offset])` {#bufreaddoubleleoffset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` wurde entfernt und keine implizite Konvertierung des Offsets in `uint32` mehr. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Lesebeginn übersprungen werden sollen. Muss `0 <= offset <= buf.length - 8` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest eine 64-Bit-Little-Endian-Double-Zahl aus `buf` am angegebenen `offset`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Gibt aus: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Wirft ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Gibt aus: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Wirft ERR_OUT_OF_RANGE.
```
:::


### `buf.readFloatBE([offset])` {#bufreadfloatbeoffset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` entfernt und keine implizite Umwandlung des Offsets in `uint32` mehr. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Lesen übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 4` erfüllen. **Standard:** `0`.
- Rückgabe: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest einen 32-Bit-Big-Endian-Float von `buf` am angegebenen `offset`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Gibt aus: 2.387939260590663e-38
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Gibt aus: 2.387939260590663e-38
```
:::

### `buf.readFloatLE([offset])` {#bufreadfloatleoffset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` entfernt und keine implizite Umwandlung des Offsets in `uint32` mehr. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Lesen übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 4` erfüllen. **Standard:** `0`.
- Rückgabe: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest einen 32-Bit-Little-Endian-Float von `buf` am angegebenen `offset`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Gibt aus: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Wirft ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Gibt aus: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Wirft ERR_OUT_OF_RANGE.
```
:::


### `buf.readInt8([offset])` {#bufreadint8offset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` entfernt und keine implizite Umwandlung des Offsets in `uint32` mehr. |
| v0.5.0 | Hinzugefügt in: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Lesen übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 1` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest eine vorzeichenbehaftete 8-Bit-Ganzzahl aus `buf` am angegebenen `offset`.

Ganzzahlen, die aus einem `Buffer` gelesen werden, werden als vorzeichenbehaftete Zweierkomplementwerte interpretiert.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Gibt aus: -1
console.log(buf.readInt8(1));
// Gibt aus: 5
console.log(buf.readInt8(2));
// Wirft ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Gibt aus: -1
console.log(buf.readInt8(1));
// Gibt aus: 5
console.log(buf.readInt8(2));
// Wirft ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt16BE([offset])` {#bufreadint16beoffset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` entfernt und keine implizite Umwandlung des Offsets in `uint32` mehr. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Lesen übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 2` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest eine vorzeichenbehaftete 16-Bit-Ganzzahl im Big-Endian-Format aus `buf` am angegebenen `offset`.

Ganzzahlen, die aus einem `Buffer` gelesen werden, werden als vorzeichenbehaftete Zweierkomplementwerte interpretiert.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Gibt aus: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Gibt aus: 5
```
:::


### `buf.readInt16LE([offset])` {#bufreadint16leoffset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` entfernt und keine implizite Umwandlung des Offsets in `uint32` mehr. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Lesebeginn übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 2` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest eine vorzeichenbehaftete 16-Bit-Ganzzahl im Little-Endian-Format aus `buf` am angegebenen `offset`.

Ganzzahlen, die aus einem `Buffer` gelesen werden, werden als vorzeichenbehaftete Zweierkomplementwerte interpretiert.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Gibt aus: 1280
console.log(buf.readInt16LE(1));
// Wirft ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Gibt aus: 1280
console.log(buf.readInt16LE(1));
// Wirft ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt32BE([offset])` {#bufreadint32beoffset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` entfernt und keine implizite Umwandlung des Offsets in `uint32` mehr. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Lesebeginn übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 4` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest eine vorzeichenbehaftete 32-Bit-Ganzzahl im Big-Endian-Format aus `buf` am angegebenen `offset`.

Ganzzahlen, die aus einem `Buffer` gelesen werden, werden als vorzeichenbehaftete Zweierkomplementwerte interpretiert.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Gibt aus: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Gibt aus: 5
```
:::


### `buf.readInt32LE([offset])` {#bufreadint32leoffset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` wurde entfernt und keine implizite Konvertierung des Offsets in `uint32` mehr. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Start des Lesens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 4` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest eine signierte 32-Bit-Integer-Zahl in Little-Endian-Byte-Reihenfolge von `buf` am angegebenen `offset`.

Integer-Werte, die aus einem `Buffer` gelesen werden, werden als Zweierkomplement-Werte mit Vorzeichen interpretiert.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Gibt aus: 83886080
console.log(buf.readInt32LE(1));
// Wirft ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Gibt aus: 83886080
console.log(buf.readInt32LE(1));
// Wirft ERR_OUT_OF_RANGE.
```
:::

### `buf.readIntBE(offset, byteLength)` {#bufreadintbeoffset-bytelength}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` wurde entfernt und keine implizite Konvertierung des Offsets und `byteLength` in `uint32` mehr. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Start des Lesens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - byteLength` erfüllen.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der zu lesenden Bytes. Muss `0 \< byteLength \<= 6` erfüllen.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest `byteLength` Anzahl von Bytes von `buf` am angegebenen `offset` und interpretiert das Ergebnis als Big-Endian-Zweierkomplementwert mit Vorzeichen, der bis zu 48 Bit Genauigkeit unterstützt.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Gibt aus: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// Wirft ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// Wirft ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Gibt aus: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// Wirft ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// Wirft ERR_OUT_OF_RANGE.
```
:::


### `buf.readIntLE(offset, byteLength)` {#bufreadintleoffset-bytelength}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` entfernt und keine implizite Typumwandlung von Offset und `byteLength` in `uint32` mehr. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Lesebeginn übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - byteLength` erfüllen.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der zu lesenden Bytes. Muss `0 \< byteLength \<= 6` erfüllen.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest `byteLength` Anzahl von Bytes von `buf` am angegebenen `offset` und interpretiert das Ergebnis als Little-Endian-, Zweierkomplement-Wert mit Vorzeichen, der bis zu 48 Bit Genauigkeit unterstützt.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Gibt aus: -546f87a9cbee
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Gibt aus: -546f87a9cbee
```
:::

### `buf.readUInt8([offset])` {#bufreaduint8offset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.9.0, v12.19.0 | Diese Funktion ist auch als `buf.readUint8()` verfügbar. |
| v10.0.0 | `noAssert` entfernt und keine implizite Typumwandlung des Offsets in `uint32` mehr. |
| v0.5.0 | Hinzugefügt in: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Lesebeginn übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 1` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest eine vorzeichenlose 8-Bit-Ganzzahl von `buf` am angegebenen `offset`.

Diese Funktion ist auch unter dem Alias `readUint8` verfügbar.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Gibt aus: 1
console.log(buf.readUInt8(1));
// Gibt aus: 254
console.log(buf.readUInt8(2));
// Wirft ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Gibt aus: 1
console.log(buf.readUInt8(1));
// Gibt aus: 254
console.log(buf.readUInt8(2));
// Wirft ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt16BE([offset])` {#bufreaduint16beoffset}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.9.0, v12.19.0 | Diese Funktion ist auch als `buf.readUint16BE()` verfügbar. |
| v10.0.0 | `noAssert` entfernt und keine implizite Konvertierung des Offsets in `uint32` mehr. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Beginn des Lesens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 2` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest eine vorzeichenlose, Big-Endian 16-Bit-Ganzzahl von `buf` am angegebenen `offset`.

Diese Funktion ist auch unter dem Alias `readUint16BE` verfügbar.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Prints: 1234
console.log(buf.readUInt16BE(1).toString(16));
// Prints: 3456
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Prints: 1234
console.log(buf.readUInt16BE(1).toString(16));
// Prints: 3456
```
:::

### `buf.readUInt16LE([offset])` {#bufreaduint16leoffset}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.9.0, v12.19.0 | Diese Funktion ist auch als `buf.readUint16LE()` verfügbar. |
| v10.0.0 | `noAssert` entfernt und keine implizite Konvertierung des Offsets in `uint32` mehr. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Beginn des Lesens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 2` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest eine vorzeichenlose, Little-Endian 16-Bit-Ganzzahl von `buf` am angegebenen `offset`.

Diese Funktion ist auch unter dem Alias `readUint16LE` verfügbar.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Prints: 3412
console.log(buf.readUInt16LE(1).toString(16));
// Prints: 5634
console.log(buf.readUInt16LE(2).toString(16));
// Throws ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Prints: 3412
console.log(buf.readUInt16LE(1).toString(16));
// Prints: 5634
console.log(buf.readUInt16LE(2).toString(16));
// Throws ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt32BE([offset])` {#bufreaduint32beoffset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.9.0, v12.19.0 | Diese Funktion ist auch als `buf.readUint32BE()` verfügbar. |
| v10.0.0 | `noAssert` und keine implizite Typumwandlung des Offsets in `uint32` mehr entfernt. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Beginn des Lesens übersprungen werden sollen. Muss `0 <= offset <= buf.length - 4` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest eine vorzeichenlose, Big-Endian-32-Bit-Ganzzahl aus `buf` am angegebenen `offset`.

Diese Funktion ist auch unter dem Alias `readUint32BE` verfügbar.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Gibt aus: 12345678
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Gibt aus: 12345678
```
:::

### `buf.readUInt32LE([offset])` {#bufreaduint32leoffset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.9.0, v12.19.0 | Diese Funktion ist auch als `buf.readUint32LE()` verfügbar. |
| v10.0.0 | `noAssert` und keine implizite Typumwandlung des Offsets in `uint32` mehr entfernt. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Beginn des Lesens übersprungen werden sollen. Muss `0 <= offset <= buf.length - 4` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest eine vorzeichenlose, Little-Endian-32-Bit-Ganzzahl aus `buf` am angegebenen `offset`.

Diese Funktion ist auch unter dem Alias `readUint32LE` verfügbar.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Gibt aus: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Wirft ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Gibt aus: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Wirft ERR_OUT_OF_RANGE.
```
:::


### `buf.readUIntBE(offset, byteLength)` {#bufreaduintbeoffset-bytelength}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.9.0, v12.19.0 | Diese Funktion ist auch als `buf.readUintBE()` verfügbar. |
| v10.0.0 | `noAssert` entfernt und keine implizite Umwandlung von Offset und `byteLength` mehr in `uint32`. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Beginn des Lesens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - byteLength` erfüllen.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der zu lesenden Bytes. Muss `0 \< byteLength \<= 6` erfüllen.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest `byteLength` Anzahl von Bytes aus `buf` am angegebenen `offset` und interpretiert das Ergebnis als eine vorzeichenlose Big-Endian-Ganzzahl, die bis zu 48 Bit Genauigkeit unterstützt.

Diese Funktion ist auch unter dem Alias `readUintBE` verfügbar.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Wirft ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Wirft ERR_OUT_OF_RANGE.
```
:::

### `buf.readUIntLE(offset, byteLength)` {#bufreaduintleoffset-bytelength}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.9.0, v12.19.0 | Diese Funktion ist auch als `buf.readUintLE()` verfügbar. |
| v10.0.0 | `noAssert` entfernt und keine implizite Umwandlung von Offset und `byteLength` mehr in `uint32`. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Beginn des Lesens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - byteLength` erfüllen.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der zu lesenden Bytes. Muss `0 \< byteLength \<= 6` erfüllen.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Liest `byteLength` Anzahl von Bytes aus `buf` am angegebenen `offset` und interpretiert das Ergebnis als eine vorzeichenlose Little-Endian-Ganzzahl, die bis zu 48 Bit Genauigkeit unterstützt.

Diese Funktion ist auch unter dem Alias `readUintLE` verfügbar.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Prints: ab9078563412
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Prints: ab9078563412
```
:::


### `buf.subarray([start[, end]])` {#bufsubarraystart-end}

**Hinzugefügt in: v3.0.0**

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wo der neue `Buffer` beginnen soll. **Standardwert:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wo der neue `Buffer` enden soll (nicht inklusive). **Standardwert:** [`buf.length`](/de/nodejs/api/buffer#buflength).
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Gibt einen neuen `Buffer` zurück, der auf denselben Speicher wie das Original verweist, jedoch durch die `start`- und `end`-Indizes versetzt und beschnitten ist.

Wenn `end` größer als [`buf.length`](/de/nodejs/api/buffer#buflength) angegeben wird, wird dasselbe Ergebnis zurückgegeben wie bei `end` gleich [`buf.length`](/de/nodejs/api/buffer#buflength).

Diese Methode wird von [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray) geerbt.

Das Modifizieren des neuen `Buffer`-Slice modifiziert den Speicher im ursprünglichen `Buffer`, da sich der zugewiesene Speicher der beiden Objekte überschneidet.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Erstelle einen `Buffer` mit dem ASCII-Alphabet, nimm einen Slice und modifiziere ein Byte
// aus dem ursprünglichen `Buffer`.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 ist der dezimale ASCII-Wert für 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Gibt aus: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Gibt aus: !bc
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Erstelle einen `Buffer` mit dem ASCII-Alphabet, nimm einen Slice und modifiziere ein Byte
// aus dem ursprünglichen `Buffer`.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 ist der dezimale ASCII-Wert für 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Gibt aus: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Gibt aus: !bc
```
:::

Die Angabe negativer Indizes bewirkt, dass der Slice relativ zum Ende von `buf` und nicht zum Anfang erzeugt wird.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Gibt aus: buffe
// (Entspricht buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Gibt aus: buff
// (Entspricht buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Gibt aus: uff
// (Entspricht buf.subarray(1, 4).)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Gibt aus: buffe
// (Entspricht buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Gibt aus: buff
// (Entspricht buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Gibt aus: uff
// (Entspricht buf.subarray(1, 4).)
```
:::


### `buf.slice([start[, end]])` {#bufslicestart-end}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v17.5.0, v16.15.0 | Die buf.slice()-Methode ist veraltet. |
| v7.0.0 | Alle Offsets werden nun in Ganzzahlen umgewandelt, bevor Berechnungen mit ihnen durchgeführt werden. |
| v7.1.0, v6.9.2 | Das Umwandeln der Offsets in Ganzzahlen behandelt nun Werte außerhalb des 32-Bit-Ganzzahlbereichs korrekt. |
| v0.3.0 | Hinzugefügt in: v0.3.0 |
:::

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wo der neue `Buffer` beginnen wird. **Standard:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wo der neue `Buffer` enden wird (nicht inklusive). **Standard:** [`buf.length`](/de/nodejs/api/buffer#buflength).
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`buf.subarray`](/de/nodejs/api/buffer#bufsubarraystart-end).
:::

Gibt einen neuen `Buffer` zurück, der auf denselben Speicher wie das Original verweist, jedoch durch die `start`- und `end`-Indizes versetzt und zugeschnitten ist.

Diese Methode ist nicht kompatibel mit `Uint8Array.prototype.slice()`, was eine Superklasse von `Buffer` ist. Um das Slice zu kopieren, verwenden Sie `Uint8Array.prototype.slice()`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Gibt aus: cuffer

console.log(buf.toString());
// Gibt aus: buffer

// Mit buf.slice() wird der ursprüngliche Puffer geändert.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Gibt aus: cuffer
console.log(buf.toString());
// Gibt auch aus: cuffer (!)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Gibt aus: cuffer

console.log(buf.toString());
// Gibt aus: buffer

// Mit buf.slice() wird der ursprüngliche Puffer geändert.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Gibt aus: cuffer
console.log(buf.toString());
// Gibt auch aus: cuffer (!)
```
:::


### `buf.swap16()` {#bufswap16}

**Hinzugefügt in: v5.10.0**

- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Eine Referenz auf `buf`.

Interpretiert `buf` als ein Array von vorzeichenlosen 16-Bit-Ganzzahlen und tauscht die Byte-Reihenfolge *direkt*. Wirft [`ERR_INVALID_BUFFER_SIZE`](/de/nodejs/api/errors#err_invalid_buffer_size), wenn [`buf.length`](/de/nodejs/api/buffer#buflength) kein Vielfaches von 2 ist.

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

Eine praktische Verwendung von `buf.swap16()` ist die Durchführung einer schnellen In-Place-Konvertierung zwischen UTF-16 Little-Endian und UTF-16 Big-Endian:

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

**Hinzugefügt in: v5.10.0**

- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Eine Referenz auf `buf`.

Interpretiert `buf` als ein Array von vorzeichenlosen 32-Bit-Ganzzahlen und tauscht die Byte-Reihenfolge *direkt*. Wirft [`ERR_INVALID_BUFFER_SIZE`](/de/nodejs/api/errors#err_invalid_buffer_size), wenn [`buf.length`](/de/nodejs/api/buffer#buflength) kein Vielfaches von 4 ist.

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

**Hinzugefügt in: v6.3.0**

- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Eine Referenz zu `buf`.

Interpretiert `buf` als ein Array von 64-Bit-Zahlen und vertauscht die Byte-Reihenfolge *direkt*. Wirft [`ERR_INVALID_BUFFER_SIZE`](/de/nodejs/api/errors#err_invalid_buffer_size), falls [`buf.length`](/de/nodejs/api/buffer#buflength) kein Vielfaches von 8 ist.

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

**Hinzugefügt in: v0.9.2**

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt eine JSON-Darstellung von `buf` zurück. [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) ruft diese Funktion implizit auf, wenn eine `Buffer`-Instanz in einen String umgewandelt wird.

`Buffer.from()` akzeptiert Objekte in dem von dieser Methode zurückgegebenen Format. Insbesondere funktioniert `Buffer.from(buf.toJSON())` wie `Buffer.from(buf)`.

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

**Hinzugefügt in: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die zu verwendende Zeichenkodierung. **Standard:** `'utf8'`.
- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Byte-Offset, an dem die Dekodierung beginnen soll. **Standard:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Byte-Offset, an dem die Dekodierung beendet werden soll (nicht einschließlich). **Standard:** [`buf.length`](/de/nodejs/api/buffer#buflength).
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Dekodiert `buf` in einen String gemäß der angegebenen Zeichenkodierung in `encoding`. `start` und `end` können übergeben werden, um nur eine Teilmenge von `buf` zu dekodieren.

Wenn `encoding` `'utf8'` ist und eine Byte-Sequenz in der Eingabe kein gültiges UTF-8 ist, wird jedes ungültige Byte durch das Ersetzungszeichen `U+FFFD` ersetzt.

Die maximale Länge einer String-Instanz (in UTF-16-Codeeinheiten) ist als [`buffer.constants.MAX_STRING_LENGTH`](/de/nodejs/api/buffer#bufferconstantsmax_string_length) verfügbar.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 ist der dezimale ASCII-Wert für 'a'.
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
  // 97 ist der dezimale ASCII-Wert für 'a'.
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

**Hinzugefügt in: v1.1.0**

- Gibt zurück: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Erstellt und gibt einen [Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) für `buf`-Werte (Bytes) zurück. Diese Funktion wird automatisch aufgerufen, wenn ein `Buffer` in einer `for..of`-Anweisung verwendet wird.

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

**Hinzugefügt in: v0.1.90**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Zeichenkette, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Schreiben von `string` übersprungen werden sollen. **Standard:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Maximale Anzahl von zu schreibenden Bytes (geschriebene Bytes überschreiten nicht `buf.length - offset`). **Standard:** `buf.length - offset`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Zeichenkodierung von `string`. **Standard:** `'utf8'`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der geschriebenen Bytes.

Schreibt `string` in `buf` bei `offset` gemäß der Zeichenkodierung in `encoding`. Der Parameter `length` ist die Anzahl der zu schreibenden Bytes. Wenn `buf` nicht genügend Platz für die gesamte Zeichenkette enthält, wird nur ein Teil von `string` geschrieben. Teilweise kodierte Zeichen werden jedoch nicht geschrieben.

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

**Hinzugefügt in: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Schreiben übersprungen werden sollen. Muss Folgendes erfüllen: `0 \<= offset \<= buf.length - 8`. **Standardwert:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus der Anzahl der geschriebenen Bytes.

Schreibt `value` an der angegebenen `offset`-Position in `buf` als Big-Endian.

`value` wird als Zweierkomplement-Integer mit Vorzeichen interpretiert und geschrieben.

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

**Hinzugefügt in: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Schreiben übersprungen werden sollen. Muss Folgendes erfüllen: `0 \<= offset \<= buf.length - 8`. **Standardwert:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus der Anzahl der geschriebenen Bytes.

Schreibt `value` an der angegebenen `offset`-Position in `buf` als Little-Endian.

`value` wird als Zweierkomplement-Integer mit Vorzeichen interpretiert und geschrieben.

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

::: info [History]
| Version | Changes |
| --- | --- |
| v14.10.0, v12.19.0 | Diese Funktion ist auch als `buf.writeBigUint64BE()` verfügbar. |
| v12.0.0, v10.20.0 | Hinzugefügt in: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor Beginn des Schreibens übersprungen werden sollen. Muss Folgendes erfüllen: `0 \<= offset \<= buf.length - 8`. **Standard:** `0`.
- Rückgabe: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `value` als Big-Endian mit dem angegebenen `offset` in `buf`.

Diese Funktion ist auch unter dem Alias `writeBigUint64BE` verfügbar.

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

::: info [History]
| Version | Changes |
| --- | --- |
| v14.10.0, v12.19.0 | Diese Funktion ist auch als `buf.writeBigUint64LE()` verfügbar. |
| v12.0.0, v10.20.0 | Hinzugefügt in: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor Beginn des Schreibens übersprungen werden sollen. Muss Folgendes erfüllen: `0 \<= offset \<= buf.length - 8`. **Standard:** `0`.
- Rückgabe: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `value` als Little-Endian mit dem angegebenen `offset` in `buf`.

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

Diese Funktion ist auch unter dem Alias `writeBigUint64LE` verfügbar.


### `buf.writeDoubleBE(value[, offset])` {#bufwritedoublebevalue-offset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` wurde entfernt und keine implizite Typumwandlung des Offsets zu `uint32` mehr. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Beginn des Schreibens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 8` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `value` als Big-Endian an der angegebenen `offset` in `buf`. Der `value` muss eine JavaScript-Zahl sein. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine JavaScript-Zahl ist.

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

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` wurde entfernt und keine implizite Typumwandlung des Offsets zu `uint32` mehr. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Beginn des Schreibens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 8` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `value` als Little-Endian an der angegebenen `offset` in `buf`. Der `value` muss eine JavaScript-Zahl sein. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine JavaScript-Zahl ist.

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

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` wurde entfernt und keine implizite Konvertierung des Offsets mehr in `uint32`. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Schreiben übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 4` erfüllen. **Standard:** `0`.
- Rückgabe: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `value` an der angegebenen `offset` Position in `buf` als Big-Endian. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine JavaScript-Zahl ist.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```
:::

### `buf.writeFloatLE(value[, offset])` {#bufwritefloatlevalue-offset}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` wurde entfernt und keine implizite Konvertierung des Offsets mehr in `uint32`. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Schreiben übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 4` erfüllen. **Standard:** `0`.
- Rückgabe: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `value` an der angegebenen `offset` Position in `buf` als Little-Endian. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine JavaScript-Zahl ist.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```
:::


### `buf.writeInt8(value[, offset])` {#bufwriteint8value-offset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` entfernt und keine implizite Typumwandlung des Offsets mehr zu `uint32`. |
| v0.5.0 | Hinzugefügt in: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Schreibbeginn übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 1` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `value` in `buf` am angegebenen `offset`. `value` muss eine gültige vorzeichenbehaftete 8-Bit-Ganzzahl sein. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine vorzeichenbehaftete 8-Bit-Ganzzahl ist.

`value` wird als vorzeichenbehaftete Zweierkomplement-Ganzzahl interpretiert und geschrieben.

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

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` entfernt und keine implizite Typumwandlung des Offsets mehr zu `uint32`. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Schreibbeginn übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 2` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `value` als Big-Endian an der angegebenen `offset` in `buf`. Der `value` muss eine gültige vorzeichenbehaftete 16-Bit-Ganzzahl sein. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine vorzeichenbehaftete 16-Bit-Ganzzahl ist.

Der `value` wird als vorzeichenbehaftete Zweierkomplement-Ganzzahl interpretiert und geschrieben.

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


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` entfernt und keine implizite Typumwandlung des Offsets zu `uint32` mehr. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Schreiben übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 2` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `value` als Little-Endian an der angegebenen `offset` Position in `buf`. Der `value` muss eine gültige vorzeichenbehaftete 16-Bit-Ganzzahl sein. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine vorzeichenbehaftete 16-Bit-Ganzzahl ist.

Der `value` wird als eine vorzeichenbehaftete Zweierkomplement-Ganzzahl interpretiert und geschrieben.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```

```js [CJS]
const { Buffer } = require('node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```
:::

### `buf.writeInt32BE(value[, offset])` {#bufwriteint32bevalue-offset}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` entfernt und keine implizite Typumwandlung des Offsets zu `uint32` mehr. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Schreiben übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 4` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `value` als Big-Endian an der angegebenen `offset` Position in `buf`. Der `value` muss eine gültige vorzeichenbehaftete 32-Bit-Ganzzahl sein. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine vorzeichenbehaftete 32-Bit-Ganzzahl ist.

Der `value` wird als eine vorzeichenbehaftete Zweierkomplement-Ganzzahl interpretiert und geschrieben.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```

```js [CJS]
const { Buffer } = require('node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```
:::


### `buf.writeInt32LE(value[, offset])` {#bufwriteint32levalue-offset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` wurde entfernt, und es erfolgt keine implizite Konvertierung des Offsets in `uint32` mehr. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor Beginn des Schreibens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 4` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus der Anzahl der geschriebenen Bytes.

Schreibt `value` als Little-Endian an der angegebenen `offset`-Position in `buf`. Der `value` muss eine gültige vorzeichenbehaftete 32-Bit-Ganzzahl sein. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine vorzeichenbehaftete 32-Bit-Ganzzahl ist.

Der `value` wird als vorzeichenbehaftete Zweierkomplement-Ganzzahl interpretiert und geschrieben.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05>
```
:::

### `buf.writeIntBE(value, offset, byteLength)` {#bufwriteintbevalue-offset-bytelength}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` wurde entfernt, und es erfolgt keine implizite Konvertierung des Offsets und der `byteLength` in `uint32` mehr. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor Beginn des Schreibens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - byteLength` erfüllen.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der zu schreibenden Bytes. Muss `0 \< byteLength \<= 6` erfüllen.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus der Anzahl der geschriebenen Bytes.

Schreibt `byteLength` Bytes von `value` als Big-Endian an der angegebenen `offset`-Position in `buf`. Unterstützt bis zu 48 Bit Genauigkeit. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine vorzeichenbehaftete Ganzzahl ist.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```
:::


### `buf.writeIntLE(value, offset, byteLength)` {#bufwriteintlevalue-offset-bytelength}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | `noAssert` entfernt und keine implizite Umwandlung von Offset und `byteLength` in `uint32` mehr. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor Beginn des Schreibens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - byteLength` erfüllen.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der zu schreibenden Bytes. Muss `0 \< byteLength \<= 6` erfüllen.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `byteLength` Bytes von `value` an der angegebenen `offset` in `buf` als Little-Endian. Unterstützt bis zu 48 Bit Genauigkeit. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine vorzeichenbehaftete Ganzzahl ist.

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

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.9.0, v12.19.0 | Diese Funktion ist auch als `buf.writeUint8()` verfügbar. |
| v10.0.0 | `noAssert` entfernt und keine implizite Umwandlung des Offsets in `uint32` mehr. |
| v0.5.0 | Hinzugefügt in: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor Beginn des Schreibens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 1` erfüllen. **Standardwert:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `value` an der angegebenen `offset` in `buf`. `value` muss eine gültige vorzeichenlose 8-Bit-Ganzzahl sein. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine vorzeichenlose 8-Bit-Ganzzahl ist.

Diese Funktion ist auch unter dem Alias `writeUint8` verfügbar.

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

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.9.0, v12.19.0 | Diese Funktion ist auch als `buf.writeUint16BE()` verfügbar. |
| v10.0.0 | `noAssert` entfernt und keine implizite Umwandlung des Offsets in `uint32` mehr. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Schreibbeginn übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 2` erfüllen. **Standard:** `0`.
- Rückgabe: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `value` als Big-Endian mit dem angegebenen `offset` in `buf`. Der `value` muss eine gültige, vorzeichenlose 16-Bit-Ganzzahl sein. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine vorzeichenlose 16-Bit-Ganzzahl ist.

Diese Funktion ist auch unter dem Alias `writeUint16BE` verfügbar.

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
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```
:::

### `buf.writeUInt16LE(value[, offset])` {#bufwriteuint16levalue-offset}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.9.0, v12.19.0 | Diese Funktion ist auch als `buf.writeUint16LE()` verfügbar. |
| v10.0.0 | `noAssert` entfernt und keine implizite Umwandlung des Offsets in `uint32` mehr. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Schreibbeginn übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 2` erfüllen. **Standard:** `0`.
- Rückgabe: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `value` als Little-Endian mit dem angegebenen `offset` in `buf`. Der `value` muss eine gültige, vorzeichenlose 16-Bit-Ganzzahl sein. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine vorzeichenlose 16-Bit-Ganzzahl ist.

Diese Funktion ist auch unter dem Alias `writeUint16LE` verfügbar.

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
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```
:::


### `buf.writeUInt32BE(value[, offset])` {#bufwriteuint32bevalue-offset}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.9.0, v12.19.0 | Diese Funktion ist auch als `buf.writeUint32BE()` verfügbar. |
| v10.0.0 | `noAssert` und keine implizite Umwandlung des Offsets in `uint32` mehr entfernt. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Beginn des Schreibens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 4` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `value` in `buf` an der angegebenen `offset` als Big-Endian. Der `value` muss eine gültige vorzeichenlose 32-Bit-Ganzzahl sein. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine vorzeichenlose 32-Bit-Ganzzahl ist.

Diese Funktion ist auch unter dem Alias `writeUint32BE` verfügbar.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer fe ed fa ce>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer fe ed fa ce>
```
:::

### `buf.writeUInt32LE(value[, offset])` {#bufwriteuint32levalue-offset}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.9.0, v12.19.0 | Diese Funktion ist auch als `buf.writeUint32LE()` verfügbar. |
| v10.0.0 | `noAssert` und keine implizite Umwandlung des Offsets in `uint32` mehr entfernt. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Beginn des Schreibens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - 4` erfüllen. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `value` in `buf` an der angegebenen `offset` als Little-Endian. Der `value` muss eine gültige vorzeichenlose 32-Bit-Ganzzahl sein. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine vorzeichenlose 32-Bit-Ganzzahl ist.

Diese Funktion ist auch unter dem Alias `writeUint32LE` verfügbar.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer ce fa ed fe>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer ce fa ed fe>
```
:::


### `buf.writeUIntBE(value, offset, byteLength)` {#bufwriteuintbevalue-offset-bytelength}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.9.0, v12.19.0 | Diese Funktion ist auch als `buf.writeUintBE()` verfügbar. |
| v10.0.0 | `noAssert` und keine implizite Typumwandlung von Offset und `byteLength` zu `uint32` mehr entfernt. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Beginn des Schreibens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - byteLength` erfüllen.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der zu schreibenden Bytes. Muss `0 \< byteLength \<= 6` erfüllen.
- Rückgabe: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `byteLength` Bytes von `value` als Big-Endian in `buf` am angegebenen `offset`. Unterstützt bis zu 48 Bit Genauigkeit. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine vorzeichenlose Ganzzahl ist.

Diese Funktion ist auch unter dem Alias `writeUintBE` verfügbar.

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

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.9.0, v12.19.0 | Diese Funktion ist auch als `buf.writeUintLE()` verfügbar. |
| v10.0.0 | `noAssert` und keine implizite Typumwandlung von Offset und `byteLength` zu `uint32` mehr entfernt. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zahl, die in `buf` geschrieben werden soll.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die vor dem Beginn des Schreibens übersprungen werden sollen. Muss `0 \<= offset \<= buf.length - byteLength` erfüllen.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der zu schreibenden Bytes. Muss `0 \< byteLength \<= 6` erfüllen.
- Rückgabe: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus die Anzahl der geschriebenen Bytes.

Schreibt `byteLength` Bytes von `value` als Little-Endian in `buf` am angegebenen `offset`. Unterstützt bis zu 48 Bit Genauigkeit. Das Verhalten ist undefiniert, wenn `value` etwas anderes als eine vorzeichenlose Ganzzahl ist.

Diese Funktion ist auch unter dem Alias `writeUintLE` verfügbar.

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

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Der Aufruf dieses Konstruktors gibt eine Veraltungswarnung aus, wenn er von Code außerhalb des Verzeichnisses `node_modules` ausgeführt wird. |
| v7.2.1 | Der Aufruf dieses Konstruktors gibt keine Veraltungswarnung mehr aus. |
| v7.0.0 | Der Aufruf dieses Konstruktors gibt jetzt eine Veraltungswarnung aus. |
| v6.0.0 | Veraltet seit: v6.0.0 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`Buffer.from(array)`](/de/nodejs/api/buffer#static-method-bufferfromarray).
:::

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein Array von Bytes, aus dem kopiert werden soll.

Siehe [`Buffer.from(array)`](/de/nodejs/api/buffer#static-method-bufferfromarray).

### `new Buffer(arrayBuffer[, byteOffset[, length]])` {#new-bufferarraybuffer-byteoffset-length}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Der Aufruf dieses Konstruktors gibt eine Veraltungswarnung aus, wenn er von Code außerhalb des Verzeichnisses `node_modules` ausgeführt wird. |
| v7.2.1 | Der Aufruf dieses Konstruktors gibt keine Veraltungswarnung mehr aus. |
| v7.0.0 | Der Aufruf dieses Konstruktors gibt jetzt eine Veraltungswarnung aus. |
| v6.0.0 | Die Parameter `byteOffset` und `length` werden jetzt unterstützt. |
| v6.0.0 | Veraltet seit: v6.0.0 |
| v3.0.0 | Hinzugefügt in: v3.0.0 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/de/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length).
:::

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Ein [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) oder die Eigenschaft `.buffer` eines [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Index des ersten freizugebenden Bytes. **Standard:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der freizugebenden Bytes. **Standard:** `arrayBuffer.byteLength - byteOffset`.

Siehe [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/de/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length).


### `new Buffer(buffer)` {#new-bufferbuffer}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Der Aufruf dieses Konstruktors gibt eine Veraltungswarnung aus, wenn er von Code außerhalb des Verzeichnisses `node_modules` ausgeführt wird. |
| v7.2.1 | Der Aufruf dieses Konstruktors gibt keine Veraltungswarnung mehr aus. |
| v7.0.0 | Der Aufruf dieses Konstruktors gibt jetzt eine Veraltungswarnung aus. |
| v6.0.0 | Veraltet seit: v6.0.0 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`Buffer.from(buffer)`](/de/nodejs/api/buffer#static-method-bufferfrombuffer).
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Ein vorhandener `Buffer` oder [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), aus dem Daten kopiert werden sollen.

Siehe [`Buffer.from(buffer)`](/de/nodejs/api/buffer#static-method-bufferfrombuffer).

### `new Buffer(size)` {#new-buffersize}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Der Aufruf dieses Konstruktors gibt eine Veraltungswarnung aus, wenn er von Code außerhalb des Verzeichnisses `node_modules` ausgeführt wird. |
| v8.0.0 | `new Buffer(size)` gibt standardmäßig mit Nullen gefüllten Speicher zurück. |
| v7.2.1 | Der Aufruf dieses Konstruktors gibt keine Veraltungswarnung mehr aus. |
| v7.0.0 | Der Aufruf dieses Konstruktors gibt jetzt eine Veraltungswarnung aus. |
| v6.0.0 | Veraltet seit: v6.0.0 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`Buffer.alloc()`](/de/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) (siehe auch [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize)).
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die gewünschte Länge des neuen `Buffer`.

Siehe [`Buffer.alloc()`](/de/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) und [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize). Diese Variante des Konstruktors ist äquivalent zu [`Buffer.alloc()`](/de/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding).


### `new Buffer(string[, encoding])` {#new-bufferstring-encoding}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Das Aufrufen dieses Konstruktors gibt eine Veraltungswarnung aus, wenn er von Code außerhalb des Verzeichnisses `node_modules` ausgeführt wird. |
| v7.2.1 | Das Aufrufen dieses Konstruktors gibt keine Veraltungswarnung mehr aus. |
| v7.0.0 | Das Aufrufen dieses Konstruktors gibt jetzt eine Veraltungswarnung aus. |
| v6.0.0 | Veraltet seit: v6.0.0 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`Buffer.from(string[, encoding])`](/de/nodejs/api/buffer#static-method-bufferfromstring-encoding).
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Zu kodierender String.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Kodierung von `string`. **Standard:** `'utf8'`.

Siehe [`Buffer.from(string[, encoding])`](/de/nodejs/api/buffer#static-method-bufferfromstring-encoding).

## Klasse: `File` {#class-file}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Macht File-Instanzen klonbar. |
| v20.0.0 | Nicht mehr experimentell. |
| v19.2.0, v18.13.0 | Hinzugefügt in: v19.2.0, v18.13.0 |
:::

- Erweitert: [\<Blob\>](/de/nodejs/api/buffer#class-blob)

Ein [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) liefert Informationen über Dateien.

### `new buffer.File(sources, fileName[, options])` {#new-bufferfilesources-filename-options}

**Hinzugefügt in: v19.2.0, v18.13.0**

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/de/nodejs/api/buffer#class-blob) | [\<File[]\>](/de/nodejs/api/buffer#class-file) Ein Array von String-, [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)-, [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)-, [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)-, [\<File\>](/de/nodejs/api/buffer#class-file)- oder [\<Blob\>](/de/nodejs/api/buffer#class-blob)-Objekten oder eine beliebige Mischung solcher Objekte, die in der `File` gespeichert werden.
- `fileName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Name der Datei.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eines von entweder `'transparent'` oder `'native'`. Wenn auf `'native'` gesetzt, werden Zeilenenden in String-Quellteilen in das plattformspezifische Zeilenende konvertiert, wie es von `require('node:os').EOL` angegeben wird.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der File-Content-Type.
    - `lastModified` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Das letzte Änderungsdatum der Datei. **Standard:** `Date.now()`.


### `file.name` {#filename}

**Hinzugefügt in: v19.2.0, v18.13.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der Name der `File`.

### `file.lastModified` {#filelastmodified}

**Hinzugefügt in: v19.2.0, v18.13.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Das Datum der letzten Änderung der `File`.

## `node:buffer`-Modul-APIs {#nodebuffer-module-apis}

Obwohl das `Buffer`-Objekt als global verfügbar ist, gibt es zusätzliche `Buffer`-bezogene APIs, die nur über das `node:buffer`-Modul verfügbar sind, auf das über `require('node:buffer')` zugegriffen wird.

### `buffer.atob(data)` {#bufferatobdata}

**Hinzugefügt in: v15.13.0, v14.17.0**

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy. Verwenden Sie stattdessen `Buffer.from(data, 'base64')`.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Die Base64-kodierte Eingabezeichenkette.

Dekodiert eine Zeichenkette mit Base64-kodierten Daten in Bytes und kodiert diese Bytes mit Latin-1 (ISO-8859-1) in eine Zeichenkette.

Die `data` kann ein beliebiger JavaScript-Wert sein, der in eine Zeichenkette umgewandelt werden kann.

**Diese Funktion wird nur zur Kompatibilität mit älteren Webplattform-APIs bereitgestellt
und sollte niemals in neuem Code verwendet werden, da sie Zeichenketten zur Darstellung
binärer Daten verwenden und der Einführung von typisierten Arrays in JavaScript vorausgehen.
Für Code, der mit Node.js-APIs ausgeführt wird, sollte die Konvertierung zwischen base64-kodierten Zeichenketten
und binären Daten mit <code>Buffer.from(str, 'base64')</code> und
<code>buf.toString('base64')</code> durchgeführt werden.**

### `buffer.btoa(data)` {#bufferbtoadata}

**Hinzugefügt in: v15.13.0, v14.17.0**

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy. Verwenden Sie stattdessen `buf.toString('base64')`.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Eine ASCII-Zeichenkette (Latin1).

Dekodiert eine Zeichenkette mit Latin-1 (ISO-8859) in Bytes und kodiert diese Bytes mit Base64 in eine Zeichenkette.

Die `data` kann ein beliebiger JavaScript-Wert sein, der in eine Zeichenkette umgewandelt werden kann.

**Diese Funktion wird nur zur Kompatibilität mit älteren Webplattform-APIs bereitgestellt
und sollte niemals in neuem Code verwendet werden, da sie Zeichenketten zur Darstellung
binärer Daten verwenden und der Einführung von typisierten Arrays in JavaScript vorausgehen.
Für Code, der mit Node.js-APIs ausgeführt wird, sollte die Konvertierung zwischen base64-kodierten Zeichenketten
und binären Daten mit <code>Buffer.from(str, 'base64')</code> und
<code>buf.toString('base64')</code> durchgeführt werden.**


### `buffer.isAscii(input)` {#bufferisasciiinput}

**Hinzugefügt in: v19.6.0, v18.15.0**

- input [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Die Eingabe, die validiert werden soll.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Diese Funktion gibt `true` zurück, wenn `input` nur gültige ASCII-kodierte Daten enthält, einschließlich des Falls, in dem `input` leer ist.

Löst einen Fehler aus, wenn die `input` ein abgetrennter Array-Puffer ist.

### `buffer.isUtf8(input)` {#bufferisutf8input}

**Hinzugefügt in: v19.4.0, v18.14.0**

- input [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Die Eingabe, die validiert werden soll.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Diese Funktion gibt `true` zurück, wenn `input` nur gültige UTF-8-kodierte Daten enthält, einschließlich des Falls, in dem `input` leer ist.

Löst einen Fehler aus, wenn die `input` ein abgetrennter Array-Puffer ist.

### `buffer.INSPECT_MAX_BYTES` {#bufferinspect_max_bytes}

**Hinzugefügt in: v0.5.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `50`

Gibt die maximale Anzahl von Bytes zurück, die zurückgegeben werden, wenn `buf.inspect()` aufgerufen wird. Dies kann von Benutzermodulen überschrieben werden. Siehe [`util.inspect()`](/de/nodejs/api/util#utilinspectobject-options) für weitere Details zum Verhalten von `buf.inspect()`.

### `buffer.kMaxLength` {#bufferkmaxlength}

**Hinzugefügt in: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die größte zulässige Größe für eine einzelne `Buffer`-Instanz.

Ein Alias für [`buffer.constants.MAX_LENGTH`](/de/nodejs/api/buffer#bufferconstantsmax_length).

### `buffer.kStringMaxLength` {#bufferkstringmaxlength}

**Hinzugefügt in: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die größte zulässige Länge für eine einzelne `string`-Instanz.

Ein Alias für [`buffer.constants.MAX_STRING_LENGTH`](/de/nodejs/api/buffer#bufferconstantsmax_string_length).


### `buffer.resolveObjectURL(id)` {#bufferresolveobjecturlid}

**Hinzugefügt in: v16.7.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine `'blob:nodedata:...'`-URL-Zeichenkette, die von einem vorherigen Aufruf von `URL.createObjectURL()` zurückgegeben wurde.
- Gibt zurück: [\<Blob\>](/de/nodejs/api/buffer#class-blob)

Löst ein `'blob:nodedata:...'` zugehöriges [\<Blob\>](/de/nodejs/api/buffer#class-blob)-Objekt auf, das mit einem vorherigen Aufruf von `URL.createObjectURL()` registriert wurde.

### `buffer.transcode(source, fromEnc, toEnc)` {#buffertranscodesource-fromenc-toenc}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Der Parameter `source` kann nun ein `Uint8Array` sein. |
| v7.1.0 | Hinzugefügt in: v7.1.0 |
:::

- `source` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Eine `Buffer`- oder `Uint8Array`-Instanz.
- `fromEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die aktuelle Kodierung.
- `toEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Zielkodierung.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Rekodiert die gegebene `Buffer`- oder `Uint8Array`-Instanz von einer Zeichenkodierung in eine andere. Gibt eine neue `Buffer`-Instanz zurück.

Wirft einen Fehler, wenn `fromEnc` oder `toEnc` ungültige Zeichenkodierungen angeben oder wenn die Konvertierung von `fromEnc` nach `toEnc` nicht zulässig ist.

Von `buffer.transcode()` unterstützte Kodierungen sind: `'ascii'`, `'utf8'`, `'utf16le'`, `'ucs2'`, `'latin1'` und `'binary'`.

Der Transkodierungsprozess verwendet Ersatzzeichen, wenn eine gegebene Byte-Sequenz in der Zielkodierung nicht adäquat dargestellt werden kann. Zum Beispiel:

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

Da das Eurozeichen (`€`) in US-ASCII nicht darstellbar ist, wird es im transkodierten `Buffer` durch `?` ersetzt.


### Klasse: `SlowBuffer` {#class-slowbuffer}

**Veraltet seit: v6.0.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`Buffer.allocUnsafeSlow()`](/de/nodejs/api/buffer#static-method-bufferallocunsafeslowsize).
:::

Siehe [`Buffer.allocUnsafeSlow()`](/de/nodejs/api/buffer#static-method-bufferallocunsafeslowsize). Dies war nie eine Klasse in dem Sinne, dass der Konstruktor immer eine `Buffer`-Instanz zurückgegeben hat, anstatt einer `SlowBuffer`-Instanz.

#### `new SlowBuffer(size)` {#new-slowbuffersize}

**Veraltet seit: v6.0.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`Buffer.allocUnsafeSlow()`](/de/nodejs/api/buffer#static-method-bufferallocunsafeslowsize).
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die gewünschte Länge des neuen `SlowBuffer`.

Siehe [`Buffer.allocUnsafeSlow()`](/de/nodejs/api/buffer#static-method-bufferallocunsafeslowsize).

### Buffer-Konstanten {#buffer-constants}

**Hinzugefügt in: v8.2.0**

#### `buffer.constants.MAX_LENGTH` {#bufferconstantsmax_length}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.0.0 | Der Wert wurde auf 2 - 1 auf 64-Bit-Architekturen geändert. |
| v15.0.0 | Der Wert wurde auf 2 auf 64-Bit-Architekturen geändert. |
| v14.0.0 | Der Wert wurde von 2 - 1 auf 2 - 1 auf 64-Bit-Architekturen geändert. |
| v8.2.0 | Hinzugefügt in: v8.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die größte zulässige Größe für eine einzelne `Buffer`-Instanz.

Auf 32-Bit-Architekturen beträgt dieser Wert derzeit 2 - 1 (ungefähr 1 GiB).

Auf 64-Bit-Architekturen beträgt dieser Wert derzeit 2 - 1 (ungefähr 8 PiB).

Er spiegelt [`v8::TypedArray::kMaxLength`](https://v8.github.io/api/head/classv8_1_1TypedArray#a54a48f4373da0850663c4393d843b9b0) im Hintergrund wider.

Dieser Wert ist auch als [`buffer.kMaxLength`](/de/nodejs/api/buffer#bufferkmaxlength) verfügbar.

#### `buffer.constants.MAX_STRING_LENGTH` {#bufferconstantsmax_string_length}

**Hinzugefügt in: v8.2.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die größte zulässige Länge für eine einzelne `string`-Instanz.

Repräsentiert die größte `length`, die ein `string`-Primitiv haben kann, gezählt in UTF-16-Codeeinheiten.

Dieser Wert kann von der verwendeten JS-Engine abhängen.


## `Buffer.from()`, `Buffer.alloc()` und `Buffer.allocUnsafe()` {#bufferfrom-bufferalloc-and-bufferallocunsafe}

In Node.js-Versionen vor 6.0.0 wurden `Buffer`-Instanzen mit der `Buffer`-Konstruktorfunktion erstellt, die den zurückgegebenen `Buffer` je nach den bereitgestellten Argumenten unterschiedlich zuweist:

- Die Übergabe einer Zahl als erstes Argument an `Buffer()` (z. B. `new Buffer(10)`) weist ein neues `Buffer`-Objekt der angegebenen Größe zu. Vor Node.js 8.0.0 wurde der für solche `Buffer`-Instanzen zugewiesene Speicher *nicht* initialisiert und *kann sensible Daten enthalten*. Solche `Buffer`-Instanzen *müssen* anschließend entweder mit [`buf.fill(0)`](/de/nodejs/api/buffer#buffillvalue-offset-end-encoding) oder durch Schreiben in den gesamten `Buffer` initialisiert werden, bevor Daten aus dem `Buffer` gelesen werden. Obwohl dieses Verhalten *beabsichtigt* ist, um die Leistung zu verbessern, hat die Entwicklungserfahrung gezeigt, dass eine explizitere Unterscheidung zwischen der Erstellung eines schnellen, aber nicht initialisierten `Buffer` und der Erstellung eines langsameren, aber sichereren `Buffer` erforderlich ist. Seit Node.js 8.0.0 geben `Buffer(num)` und `new Buffer(num)` einen `Buffer` mit initialisiertem Speicher zurück.
- Die Übergabe einer Zeichenkette, eines Arrays oder eines `Buffer` als erstes Argument kopiert die Daten des übergebenen Objekts in den `Buffer`.
- Die Übergabe eines [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) oder eines [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) gibt einen `Buffer` zurück, der den zugewiesenen Speicher mit dem angegebenen Array-Buffer teilt.

Da sich das Verhalten von `new Buffer()` je nach Typ des ersten Arguments unterscheidet, können unbeabsichtigt Sicherheits- und Zuverlässigkeitsprobleme in Anwendungen eingeführt werden, wenn keine Argumentvalidierung oder `Buffer`-Initialisierung durchgeführt wird.

Wenn beispielsweise ein Angreifer eine Anwendung dazu bringen kann, eine Zahl zu empfangen, wo eine Zeichenkette erwartet wird, kann die Anwendung `new Buffer(100)` anstelle von `new Buffer("100")` aufrufen, was dazu führt, dass sie einen 100-Byte-Buffer zuweist, anstatt einen 3-Byte-Buffer mit dem Inhalt `"100"` zuzuweisen. Dies ist häufig mit JSON-API-Aufrufen möglich. Da JSON zwischen numerischen und Zeichenkettentypen unterscheidet, ermöglicht es die Injektion von Zahlen, wo eine naiv geschriebene Anwendung, die ihre Eingaben nicht ausreichend validiert, möglicherweise erwartet, immer eine Zeichenkette zu erhalten. Vor Node.js 8.0.0 konnte der 100-Byte-Buffer beliebige, bereits vorhandene Daten im Speicher enthalten, so dass er verwendet werden konnte, um im Speicher befindliche Geheimnisse an einen Remote-Angreifer preiszugeben. Seit Node.js 8.0.0 kann keine Preisgabe von Speicher erfolgen, da die Daten mit Nullen gefüllt sind. Es sind jedoch noch andere Angriffe möglich, z. B. das Verursachen der Zuweisung sehr großer Puffer durch den Server, was zu Leistungseinbußen oder zum Absturz aufgrund von Speichererschöpfung führt.

Um die Erstellung von `Buffer`-Instanzen zuverlässiger und weniger fehleranfällig zu gestalten, wurden die verschiedenen Formen des `new Buffer()`-Konstruktors als **veraltet** gekennzeichnet und durch separate `Buffer.from()`, [`Buffer.alloc()`](/de/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) und [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize)-Methoden ersetzt.

*Entwickler sollten alle vorhandenen Verwendungen der <code>new Buffer()</code>-Konstruktoren
auf eine dieser neuen APIs migrieren.*

- [`Buffer.from(array)`](/de/nodejs/api/buffer#static-method-bufferfromarray) gibt einen neuen `Buffer` zurück, der eine *Kopie* der bereitgestellten Oktette *enthält*.
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/de/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) gibt einen neuen `Buffer` zurück, der *denselben zugewiesenen Speicher* wie der angegebene [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) *teilt*.
- [`Buffer.from(buffer)`](/de/nodejs/api/buffer#static-method-bufferfrombuffer) gibt einen neuen `Buffer` zurück, der eine *Kopie* des Inhalts des angegebenen `Buffer` *enthält*.
- [`Buffer.from(string[, encoding])`](/de/nodejs/api/buffer#static-method-bufferfromstring-encoding) gibt einen neuen `Buffer` zurück, der eine *Kopie* der bereitgestellten Zeichenkette *enthält*.
- [`Buffer.alloc(size[, fill[, encoding]])`](/de/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) gibt einen neuen initialisierten `Buffer` der angegebenen Größe zurück. Diese Methode ist langsamer als [`Buffer.allocUnsafe(size)`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize), garantiert aber, dass neu erstellte `Buffer`-Instanzen niemals alte Daten enthalten, die potenziell sensibel sind. Ein `TypeError` wird ausgelöst, wenn `size` keine Zahl ist.
- [`Buffer.allocUnsafe(size)`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize) und [`Buffer.allocUnsafeSlow(size)`](/de/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) geben jeweils einen neuen, nicht initialisierten `Buffer` der angegebenen `Größe` zurück. Da der `Buffer` nicht initialisiert ist, kann das zugewiesene Speichersegment alte Daten enthalten, die potenziell sensibel sind.

`Buffer`-Instanzen, die von [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.from(string)`](/de/nodejs/api/buffer#static-method-bufferfromstring-encoding), [`Buffer.concat()`](/de/nodejs/api/buffer#static-method-bufferconcatlist-totallength) und [`Buffer.from(array)`](/de/nodejs/api/buffer#static-method-bufferfromarray) zurückgegeben werden, *können* aus einem gemeinsam genutzten internen Speicherpool zugewiesen werden, wenn `Größe` kleiner oder gleich der Hälfte von [`Buffer.poolSize`](/de/nodejs/api/buffer#class-property-bufferpoolsize) ist. Instanzen, die von [`Buffer.allocUnsafeSlow()`](/de/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) zurückgegeben werden, verwenden *niemals* den gemeinsam genutzten internen Speicherpool.


### Die Befehlszeilenoption `--zero-fill-buffers` {#the---zero-fill-buffers-command-line-option}

**Hinzugefügt in: v5.10.0**

Node.js kann mit der Befehlszeilenoption `--zero-fill-buffers` gestartet werden, um zu bewirken, dass alle neu zugewiesenen `Buffer`-Instanzen bei der Erstellung standardmäßig mit Nullen gefüllt werden. Ohne die Option werden Puffer, die mit [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.allocUnsafeSlow()`](/de/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) und `new SlowBuffer(size)` erstellt wurden, nicht mit Nullen gefüllt. Die Verwendung dieses Flags kann sich messbar negativ auf die Leistung auswirken. Verwenden Sie die Option `--zero-fill-buffers` nur, wenn es notwendig ist, zu erzwingen, dass neu zugewiesene `Buffer`-Instanzen keine alten Daten enthalten dürfen, die potenziell sensibel sind.

```bash [BASH]
$ node --zero-fill-buffers
> Buffer.allocUnsafe(5);
<Buffer 00 00 00 00 00>
```
### Was macht `Buffer.allocUnsafe()` und `Buffer.allocUnsafeSlow()` "unsicher"? {#what-makes-bufferallocunsafe-and-bufferallocunsafeslow-"unsafe"?}

Beim Aufruf von [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize) und [`Buffer.allocUnsafeSlow()`](/de/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) ist das Segment des zugewiesenen Speichers *nicht initialisiert* (es wird nicht mit Nullen gefüllt). Obwohl dieses Design die Speicherzuweisung sehr schnell macht, kann das zugewiesene Speichersegment alte Daten enthalten, die potenziell sensibel sind. Die Verwendung eines `Buffer`, der mit [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize) erstellt wurde, ohne den Speicher *vollständig* zu überschreiben, kann dazu führen, dass diese alten Daten preisgegeben werden, wenn der `Buffer`-Speicher gelesen wird.

Obwohl die Verwendung von [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize) klare Leistungsvorteile bietet, ist besondere Sorgfalt geboten, um zu vermeiden, dass Sicherheitslücken in eine Anwendung eingeführt werden.

