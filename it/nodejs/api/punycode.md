---
title: Documentazione Node.js - Punycode
description: Questa pagina fornisce una documentazione dettagliata sul modulo Punycode in Node.js, utilizzato per la codifica e decodifica dei nomi di dominio internazionalizzati.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Punycode | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Questa pagina fornisce una documentazione dettagliata sul modulo Punycode in Node.js, utilizzato per la codifica e decodifica dei nomi di dominio internazionalizzati.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Punycode | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Questa pagina fornisce una documentazione dettagliata sul modulo Punycode in Node.js, utilizzato per la codifica e decodifica dei nomi di dominio internazionalizzati.
---


# Punycode {#punycode}

**Deprecato a partire da: v7.0.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato
:::

**Codice sorgente:** [lib/punycode.js](https://github.com/nodejs/node/blob/v23.5.0/lib/punycode.js)

**La versione del modulo punycode inclusa in Node.js è in fase di deprecazione.** In una futura versione principale di Node.js questo modulo verrà rimosso. Gli utenti che attualmente dipendono dal modulo `punycode` dovrebbero passare all'utilizzo del modulo [Punycode.js](https://github.com/bestiejs/punycode.js) fornito dall'utente. Per la codifica URL basata su punycode, vedi [`url.domainToASCII`](/it/nodejs/api/url#urldomaintoasciidomain) o, più in generale, la [WHATWG URL API](/it/nodejs/api/url#the-whatwg-url-api).

Il modulo `punycode` è una versione in bundle del modulo [Punycode.js](https://github.com/bestiejs/punycode.js). È possibile accedervi utilizzando:

```js [ESM]
const punycode = require('node:punycode');
```
[Punycode](https://tools.ietf.org/html/rfc3492) è uno schema di codifica dei caratteri definito da RFC 3492 che è principalmente destinato all'uso nei nomi di dominio internazionalizzati. Poiché i nomi host negli URL sono limitati ai soli caratteri ASCII, i nomi di dominio che contengono caratteri non ASCII devono essere convertiti in ASCII utilizzando lo schema Punycode. Ad esempio, il carattere giapponese che si traduce nella parola inglese `'example'` è `'例'`. Il nome di dominio internazionalizzato, `'例.com'` (equivalente a `'example.com'`) è rappresentato da Punycode come la stringa ASCII `'xn--fsq.com'`.

Il modulo `punycode` fornisce una semplice implementazione dello standard Punycode.

Il modulo `punycode` è una dipendenza di terze parti utilizzata da Node.js e messa a disposizione degli sviluppatori per comodità. Correzioni o altre modifiche al modulo devono essere indirizzate al progetto [Punycode.js](https://github.com/bestiejs/punycode.js).

## `punycode.decode(string)` {#punycodedecodestring}

**Aggiunto in: v0.5.1**

- `string` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `punycode.decode()` converte una stringa [Punycode](https://tools.ietf.org/html/rfc3492) di caratteri solo ASCII nella stringa equivalente di codepoint Unicode.

```js [ESM]
punycode.decode('maana-pta'); // 'mañana'
punycode.decode('--dqo34k'); // '☃-⌘'
```

## `punycode.encode(string)` {#punycodeencodestring}

**Aggiunto in: v0.5.1**

- `string` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `punycode.encode()` converte una stringa di punti di codice Unicode in una stringa [Punycode](https://tools.ietf.org/html/rfc3492) di soli caratteri ASCII.

```js [ESM]
punycode.encode('mañana'); // 'maana-pta'
punycode.encode('☃-⌘'); // '--dqo34k'
```
## `punycode.toASCII(domain)` {#punycodetoasciidomain}

**Aggiunto in: v0.6.1**

- `domain` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `punycode.toASCII()` converte una stringa Unicode che rappresenta un nome di dominio internazionalizzato in [Punycode](https://tools.ietf.org/html/rfc3492). Saranno convertite solo le parti non ASCII del nome di dominio. Chiamare `punycode.toASCII()` su una stringa che contiene già solo caratteri ASCII non avrà alcun effetto.

```js [ESM]
// codifica i nomi di dominio
punycode.toASCII('mañana.com');  // 'xn--maana-pta.com'
punycode.toASCII('☃-⌘.com');   // 'xn----dqo34k.com'
punycode.toASCII('example.com'); // 'example.com'
```
## `punycode.toUnicode(domain)` {#punycodetounicodedomain}

**Aggiunto in: v0.6.1**

- `domain` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `punycode.toUnicode()` converte una stringa che rappresenta un nome di dominio contenente caratteri codificati [Punycode](https://tools.ietf.org/html/rfc3492) in Unicode. Verranno convertite solo le parti del nome di dominio codificate [Punycode](https://tools.ietf.org/html/rfc3492).

```js [ESM]
// decodifica i nomi di dominio
punycode.toUnicode('xn--maana-pta.com'); // 'mañana.com'
punycode.toUnicode('xn----dqo34k.com');  // '☃-⌘.com'
punycode.toUnicode('example.com');       // 'example.com'
```
## `punycode.ucs2` {#punycodeucs2}

**Aggiunto in: v0.7.0**

### `punycode.ucs2.decode(string)` {#punycodeucs2decodestring}

**Aggiunto in: v0.7.0**

- `string` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `punycode.ucs2.decode()` restituisce un array contenente i valori numerici del punto di codice di ciascun simbolo Unicode nella stringa.

```js [ESM]
punycode.ucs2.decode('abc'); // [0x61, 0x62, 0x63]
// coppia surrogata per l'U+1D306 tetragramma per il centro:
punycode.ucs2.decode('\uD834\uDF06'); // [0x1D306]
```

### `punycode.ucs2.encode(codePoints)` {#punycodeucs2encodecodepoints}

**Aggiunto in: v0.7.0**

- `codePoints` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il metodo `punycode.ucs2.encode()` restituisce una stringa basata su un array di valori numerici del punto di codice.

```js [ESM]
punycode.ucs2.encode([0x61, 0x62, 0x63]); // 'abc'
punycode.ucs2.encode([0x1D306]); // '\uD834\uDF06'
```
## `punycode.version` {#punycodeversion}

**Aggiunto in: v0.6.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce una stringa che identifica il numero di versione corrente di [Punycode.js](https://github.com/bestiejs/punycode.js).

