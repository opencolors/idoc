---
title: Documentación de Node.js - Punycode
description: Esta página ofrece documentación detallada sobre el módulo Punycode en Node.js, que se utiliza para codificar y decodificar nombres de dominio internacionalizados.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Punycode | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta página ofrece documentación detallada sobre el módulo Punycode en Node.js, que se utiliza para codificar y decodificar nombres de dominio internacionalizados.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Punycode | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta página ofrece documentación detallada sobre el módulo Punycode en Node.js, que se utiliza para codificar y decodificar nombres de dominio internacionalizados.
---


# Punycode {#punycode}

**Obsoleto desde: v7.0.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto
:::

**Código Fuente:** [lib/punycode.js](https://github.com/nodejs/node/blob/v23.5.0/lib/punycode.js)

**La versión del módulo punycode incluido en Node.js está quedando obsoleta.** En una futura versión principal de Node.js, este módulo se eliminará. Los usuarios que actualmente dependen del módulo `punycode` deben cambiar al módulo [Punycode.js](https://github.com/bestiejs/punycode.js) proporcionado por el espacio de usuario. Para la codificación de URL basada en punycode, consulte [`url.domainToASCII`](/es/nodejs/api/url#urldomaintoasciidomain) o, más generalmente, la [API URL de WHATWG](/es/nodejs/api/url#the-whatwg-url-api).

El módulo `punycode` es una versión incluida del módulo [Punycode.js](https://github.com/bestiejs/punycode.js). Se puede acceder a él usando:

```js [ESM]
const punycode = require('node:punycode');
```
[Punycode](https://tools.ietf.org/html/rfc3492) es un esquema de codificación de caracteres definido por RFC 3492 que está destinado principalmente para su uso en nombres de dominio internacionalizados. Debido a que los nombres de host en las URL están limitados solo a caracteres ASCII, los nombres de dominio que contienen caracteres no ASCII deben convertirse a ASCII utilizando el esquema Punycode. Por ejemplo, el carácter japonés que se traduce a la palabra en inglés, `'example'` es `'例'`. El nombre de dominio internacionalizado, `'例.com'` (equivalente a `'example.com'`) está representado por Punycode como la cadena ASCII `'xn--fsq.com'`.

El módulo `punycode` proporciona una implementación simple del estándar Punycode.

El módulo `punycode` es una dependencia de terceros utilizada por Node.js y puesta a disposición de los desarrolladores como una conveniencia. Las correcciones u otras modificaciones al módulo deben dirigirse al proyecto [Punycode.js](https://github.com/bestiejs/punycode.js).

## `punycode.decode(string)` {#punycodedecodestring}

**Agregado en: v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `punycode.decode()` convierte una cadena [Punycode](https://tools.ietf.org/html/rfc3492) de caracteres ASCII solamente a la cadena equivalente de puntos de código Unicode.

```js [ESM]
punycode.decode('maana-pta'); // 'mañana'
punycode.decode('--dqo34k'); // '☃-⌘'
```

## `punycode.encode(string)` {#punycodeencodestring}

**Añadido en: v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `punycode.encode()` convierte una cadena de puntos de código Unicode a una cadena [Punycode](https://tools.ietf.org/html/rfc3492) de caracteres ASCII únicamente.

```js [ESM]
punycode.encode('mañana'); // 'maana-pta'
punycode.encode('☃-⌘'); // '--dqo34k'
```
## `punycode.toASCII(domain)` {#punycodetoasciidomain}

**Añadido en: v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `punycode.toASCII()` convierte una cadena Unicode que representa un Nombre de Dominio Internacionalizado a [Punycode](https://tools.ietf.org/html/rfc3492). Solo se convertirán las partes no ASCII del nombre de dominio. Llamar a `punycode.toASCII()` en una cadena que ya contiene solo caracteres ASCII no tendrá ningún efecto.

```js [ESM]
// encode domain names
punycode.toASCII('mañana.com');  // 'xn--maana-pta.com'
punycode.toASCII('☃-⌘.com');   // 'xn----dqo34k.com'
punycode.toASCII('example.com'); // 'example.com'
```
## `punycode.toUnicode(domain)` {#punycodetounicodedomain}

**Añadido en: v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `punycode.toUnicode()` convierte una cadena que representa un nombre de dominio que contiene caracteres codificados [Punycode](https://tools.ietf.org/html/rfc3492) a Unicode. Solo se convertirán las partes del nombre de dominio codificadas con [Punycode](https://tools.ietf.org/html/rfc3492).

```js [ESM]
// decode domain names
punycode.toUnicode('xn--maana-pta.com'); // 'mañana.com'
punycode.toUnicode('xn----dqo34k.com');  // '☃-⌘.com'
punycode.toUnicode('example.com');       // 'example.com'
```
## `punycode.ucs2` {#punycodeucs2}

**Añadido en: v0.7.0**

### `punycode.ucs2.decode(string)` {#punycodeucs2decodestring}

**Añadido en: v0.7.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `punycode.ucs2.decode()` devuelve un array que contiene los valores numéricos de los puntos de código de cada símbolo Unicode en la cadena.

```js [ESM]
punycode.ucs2.decode('abc'); // [0x61, 0x62, 0x63]
// surrogate pair for U+1D306 tetragram for centre:
punycode.ucs2.decode('\uD834\uDF06'); // [0x1D306]
```

### `punycode.ucs2.encode(codePoints)` {#punycodeucs2encodecodepoints}

**Agregado en: v0.7.0**

- `codePoints` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El método `punycode.ucs2.encode()` devuelve una cadena basada en una matriz de valores de puntos de código numéricos.

```js [ESM]
punycode.ucs2.encode([0x61, 0x62, 0x63]); // 'abc'
punycode.ucs2.encode([0x1D306]); // '\uD834\uDF06'
```
## `punycode.version` {#punycodeversion}

**Agregado en: v0.6.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve una cadena que identifica el número de versión actual de [Punycode.js](https://github.com/bestiejs/punycode.js).

