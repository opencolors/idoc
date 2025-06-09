---
title: Node.js Dokumentation - Punycode
description: Diese Seite bietet detaillierte Dokumentation über das Punycode-Modul in Node.js, das zur Kodierung und Dekodierung von internationalisierten Domainnamen verwendet wird.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Punycode | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Diese Seite bietet detaillierte Dokumentation über das Punycode-Modul in Node.js, das zur Kodierung und Dekodierung von internationalisierten Domainnamen verwendet wird.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Punycode | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Diese Seite bietet detaillierte Dokumentation über das Punycode-Modul in Node.js, das zur Kodierung und Dekodierung von internationalisierten Domainnamen verwendet wird.
---


# Punycode {#punycode}

**Veraltet seit: v7.0.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet
:::

**Quellcode:** [lib/punycode.js](https://github.com/nodejs/node/blob/v23.5.0/lib/punycode.js)

**Die im Node.js-Paket enthaltene Version des Moduls `punycode` wird als veraltet markiert.** In einer zukünftigen Hauptversion von Node.js wird dieses Modul entfernt. Benutzer, die derzeit vom Modul `punycode` abhängig sind, sollten stattdessen zum von Benutzern bereitgestellten Modul [Punycode.js](https://github.com/bestiejs/punycode.js) wechseln. Für die Punycode-basierte URL-Kodierung siehe [`url.domainToASCII`](/de/nodejs/api/url#urldomaintoasciidomain) oder allgemeiner die [WHATWG URL API](/de/nodejs/api/url#the-whatwg-url-api).

Das Modul `punycode` ist eine gebündelte Version des Moduls [Punycode.js](https://github.com/bestiejs/punycode.js). Der Zugriff erfolgt über:

```js [ESM]
const punycode = require('node:punycode');
```
[Punycode](https://tools.ietf.org/html/rfc3492) ist ein Zeichenkodierungsschema, das durch RFC 3492 definiert ist und hauptsächlich für die Verwendung in internationalisierten Domainnamen vorgesehen ist. Da Hostnamen in URLs auf ASCII-Zeichen beschränkt sind, müssen Domainnamen, die Nicht-ASCII-Zeichen enthalten, mit dem Punycode-Schema in ASCII konvertiert werden. Beispielsweise ist das japanische Zeichen, das sich ins Englische mit dem Wort `'example'` übersetzt, `'例'`. Der internationalisierte Domainname `'例.com'` (entspricht `'example.com'`) wird durch Punycode als ASCII-Zeichenkette `'xn--fsq.com'` dargestellt.

Das Modul `punycode` bietet eine einfache Implementierung des Punycode-Standards.

Das Modul `punycode` ist eine Drittanbieter-Abhängigkeit, die von Node.js verwendet und Entwicklern als Komfortfunktion zur Verfügung gestellt wird. Fehlerbehebungen oder andere Änderungen am Modul müssen an das Projekt [Punycode.js](https://github.com/bestiejs/punycode.js) gerichtet werden.

## `punycode.decode(string)` {#punycodedecodestring}

**Hinzugefügt in: v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `punycode.decode()` konvertiert eine [Punycode](https://tools.ietf.org/html/rfc3492)-Zeichenkette, die nur ASCII-Zeichen enthält, in die äquivalente Zeichenkette von Unicode-Codepunkten.

```js [ESM]
punycode.decode('maana-pta'); // 'mañana'
punycode.decode('--dqo34k'); // '☃-⌘'
```

## `punycode.encode(string)` {#punycodeencodestring}

**Hinzugefügt in: v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `punycode.encode()` konvertiert einen String von Unicode-Codepunkten in einen [Punycode](https://tools.ietf.org/html/rfc3492)-String mit Nur-ASCII-Zeichen.

```js [ESM]
punycode.encode('mañana'); // 'maana-pta'
punycode.encode('☃-⌘'); // '--dqo34k'
```
## `punycode.toASCII(domain)` {#punycodetoasciidomain}

**Hinzugefügt in: v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `punycode.toASCII()` konvertiert einen Unicode-String, der einen Internationalisierten Domainnamen darstellt, in [Punycode](https://tools.ietf.org/html/rfc3492). Nur die Nicht-ASCII-Teile des Domainnamens werden konvertiert. Der Aufruf von `punycode.toASCII()` auf einem String, der bereits nur ASCII-Zeichen enthält, hat keine Auswirkung.

```js [ESM]
// Domainnamen kodieren
punycode.toASCII('mañana.com');  // 'xn--maana-pta.com'
punycode.toASCII('☃-⌘.com');   // 'xn----dqo34k.com'
punycode.toASCII('example.com'); // 'example.com'
```
## `punycode.toUnicode(domain)` {#punycodetounicodedomain}

**Hinzugefügt in: v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `punycode.toUnicode()` konvertiert einen String, der einen Domainnamen mit [Punycode](https://tools.ietf.org/html/rfc3492)-kodierten Zeichen enthält, in Unicode. Nur die [Punycode](https://tools.ietf.org/html/rfc3492)-kodierten Teile des Domainnamens werden konvertiert.

```js [ESM]
// Domainnamen dekodieren
punycode.toUnicode('xn--maana-pta.com'); // 'mañana.com'
punycode.toUnicode('xn----dqo34k.com');  // '☃-⌘.com'
punycode.toUnicode('example.com');       // 'example.com'
```
## `punycode.ucs2` {#punycodeucs2}

**Hinzugefügt in: v0.7.0**

### `punycode.ucs2.decode(string)` {#punycodeucs2decodestring}

**Hinzugefügt in: v0.7.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `punycode.ucs2.decode()` gibt ein Array zurück, das die numerischen Codepunktwerte jedes Unicode-Symbols im String enthält.

```js [ESM]
punycode.ucs2.decode('abc'); // [0x61, 0x62, 0x63]
// Surrogatpaar für U+1D306 Tetragramm für Zentrum:
punycode.ucs2.decode('\uD834\uDF06'); // [0x1D306]
```

### `punycode.ucs2.encode(codePoints)` {#punycodeucs2encodecodepoints}

**Hinzugefügt in: v0.7.0**

- `codePoints` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Methode `punycode.ucs2.encode()` gibt einen String basierend auf einem Array numerischer Codepunktwerte zurück.

```js [ESM]
punycode.ucs2.encode([0x61, 0x62, 0x63]); // 'abc'
punycode.ucs2.encode([0x1D306]); // '\uD834\uDF06'
```
## `punycode.version` {#punycodeversion}

**Hinzugefügt in: v0.6.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt eine Zeichenkette zurück, die die aktuelle Versionsnummer von [Punycode.js](https://github.com/bestiejs/punycode.js) identifiziert.

