---
title: Node.js Documentation - String Decoder
description: The String Decoder module provides an API for decoding Buffer objects into strings in a way that is optimized for the internal character encoding of strings.
head:
  - - meta
    - name: og:title
      content: Node.js Documentation - String Decoder | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: The String Decoder module provides an API for decoding Buffer objects into strings in a way that is optimized for the internal character encoding of strings.
  - - meta
    - name: twitter:title
      content: Node.js Documentation - String Decoder | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: The String Decoder module provides an API for decoding Buffer objects into strings in a way that is optimized for the internal character encoding of strings.
---

# String decoder {#string-decoder}

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

**Source Code:** [lib/string_decoder.js](https://github.com/nodejs/node/blob/v23.8.0/lib/string_decoder.js)

The `node:string_decoder` module provides an API for decoding `Buffer` objects into strings in a manner that preserves encoded multi-byte UTF-8 and UTF-16 characters. It can be accessed using:



::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
```
:::

The following example shows the basic use of the `StringDecoder` class.



::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Prints: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Prints: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Prints: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Prints: €
```
:::

When a `Buffer` instance is written to the `StringDecoder` instance, an internal buffer is used to ensure that the decoded string does not contain any incomplete multibyte characters. These are held in the buffer until the next call to `stringDecoder.write()` or until `stringDecoder.end()` is called.

In the following example, the three UTF-8 encoded bytes of the European Euro symbol (`€`) are written over three separate operations:



::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Prints: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Prints: €
```
:::

## Class: `StringDecoder` {#class-stringdecoder}

### `new StringDecoder([encoding])` {#new-stringdecoderencoding}

**Added in: v0.1.99**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The character [encoding](/nodejs/api/buffer#buffers-and-character-encodings) the `StringDecoder` will use. **Default:** `'utf8'`.

Creates a new `StringDecoder` instance.

### `stringDecoder.end([buffer])` {#stringdecoderendbuffer}

**Added in: v0.9.3**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) The bytes to decode.
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Returns any remaining input stored in the internal buffer as a string. Bytes representing incomplete UTF-8 and UTF-16 characters will be replaced with substitution characters appropriate for the character encoding.

If the `buffer` argument is provided, one final call to `stringDecoder.write()` is performed before returning the remaining input. After `end()` is called, the `stringDecoder` object can be reused for new input.

### `stringDecoder.write(buffer)` {#stringdecoderwritebuffer}


::: info [History]
| Version | Changes |
| --- | --- |
| v8.0.0 | Each invalid character is now replaced by a single replacement character instead of one for each individual byte. |
| v0.1.99 | Added in: v0.1.99 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) The bytes to decode.
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Returns a decoded string, ensuring that any incomplete multibyte characters at the end of the `Buffer`, or `TypedArray`, or `DataView` are omitted from the returned string and stored in an internal buffer for the next call to `stringDecoder.write()` or `stringDecoder.end()`.

