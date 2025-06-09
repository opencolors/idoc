---
title: Documentación de Node.js - Decodificador de Cadenas
description: El módulo Decodificador de Cadenas proporciona una API para decodificar objetos Buffer en cadenas, optimizada para la codificación interna de caracteres de las cadenas.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Decodificador de Cadenas | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo Decodificador de Cadenas proporciona una API para decodificar objetos Buffer en cadenas, optimizada para la codificación interna de caracteres de las cadenas.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Decodificador de Cadenas | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo Decodificador de Cadenas proporciona una API para decodificar objetos Buffer en cadenas, optimizada para la codificación interna de caracteres de las cadenas.
---


# Decodificador de cadenas {#string-decoder}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/string_decoder.js](https://github.com/nodejs/node/blob/v23.5.0/lib/string_decoder.js)

El módulo `node:string_decoder` proporciona una API para decodificar objetos `Buffer` en cadenas de una manera que preserva los caracteres UTF-8 y UTF-16 multibyte codificados. Se puede acceder usando:

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
```
:::

El siguiente ejemplo muestra el uso básico de la clase `StringDecoder`.

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Imprime: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Imprime: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Imprime: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Imprime: €
```
:::

Cuando una instancia de `Buffer` se escribe en la instancia de `StringDecoder`, se usa un búfer interno para garantizar que la cadena decodificada no contenga ningún carácter multibyte incompleto. Estos se mantienen en el búfer hasta la siguiente llamada a `stringDecoder.write()` o hasta que se llama a `stringDecoder.end()`.

En el siguiente ejemplo, los tres bytes codificados en UTF-8 del símbolo del Euro europeo (`€`) se escriben en tres operaciones separadas:

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Imprime: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Imprime: €
```
:::


## Clase: `StringDecoder` {#class-stringdecoder}

### `new StringDecoder([encoding])` {#new-stringdecoderencoding}

**Agregado en: v0.1.99**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de caracteres que utilizará `StringDecoder`. **Predeterminado:** `'utf8'`.

Crea una nueva instancia de `StringDecoder`.

### `stringDecoder.end([buffer])` {#stringdecoderendbuffer}

**Agregado en: v0.9.3**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Los bytes a decodificar.
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve cualquier entrada restante almacenada en el búfer interno como una string. Los bytes que representan caracteres UTF-8 y UTF-16 incompletos se reemplazarán con caracteres de sustitución apropiados para la codificación de caracteres.

Si se proporciona el argumento `buffer`, se realiza una llamada final a `stringDecoder.write()` antes de devolver la entrada restante. Después de llamar a `end()`, el objeto `stringDecoder` se puede reutilizar para nueva entrada.

### `stringDecoder.write(buffer)` {#stringdecoderwritebuffer}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | Ahora cada carácter inválido se reemplaza por un solo carácter de reemplazo en lugar de uno por cada byte individual. |
| v0.1.99 | Agregado en: v0.1.99 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Los bytes a decodificar.
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve una string decodificada, asegurando que cualquier carácter multibyte incompleto al final del `Buffer`, o `TypedArray`, o `DataView` se omita de la string devuelta y se almacene en un búfer interno para la siguiente llamada a `stringDecoder.write()` o `stringDecoder.end()`.

