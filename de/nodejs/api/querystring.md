---
title: Node.js Dokumentation - Abfragezeichenkette
description: Dieser Abschnitt der Node.js-Dokumentation beschreibt das querystring-Modul, das Werkzeuge zum Parsen und Formatieren von URL-Abfragezeichenketten bietet. Es umfasst Methoden zum Maskieren und Demaskieren spezieller Zeichen, zum Umgang mit verschachtelten Objekten und zur Verwaltung der Serialisierung von Abfragezeichenketten.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Abfragezeichenkette | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Dieser Abschnitt der Node.js-Dokumentation beschreibt das querystring-Modul, das Werkzeuge zum Parsen und Formatieren von URL-Abfragezeichenketten bietet. Es umfasst Methoden zum Maskieren und Demaskieren spezieller Zeichen, zum Umgang mit verschachtelten Objekten und zur Verwaltung der Serialisierung von Abfragezeichenketten.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Abfragezeichenkette | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Dieser Abschnitt der Node.js-Dokumentation beschreibt das querystring-Modul, das Werkzeuge zum Parsen und Formatieren von URL-Abfragezeichenketten bietet. Es umfasst Methoden zum Maskieren und Demaskieren spezieller Zeichen, zum Umgang mit verschachtelten Objekten und zur Verwaltung der Serialisierung von Abfragezeichenketten.
---


# Query-String {#query-string}

::: tip [Stable: 2 - Stabil]
[Stable: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/querystring.js](https://github.com/nodejs/node/blob/v23.5.0/lib/querystring.js)

Das Modul `node:querystring` bietet Hilfsfunktionen zum Parsen und Formatieren von URL-Query-Strings. Es kann über Folgendes aufgerufen werden:

```js [ESM]
const querystring = require('node:querystring');
```
`querystring` ist leistungsfähiger als [\<URLSearchParams\>](/de/nodejs/api/url#class-urlsearchparams), aber keine standardisierte API. Verwenden Sie [\<URLSearchParams\>](/de/nodejs/api/url#class-urlsearchparams), wenn die Leistung nicht kritisch ist oder wenn die Kompatibilität mit Browsercode erwünscht ist.

## `querystring.decode()` {#querystringdecode}

**Hinzugefügt in: v0.1.99**

Die Funktion `querystring.decode()` ist ein Alias für `querystring.parse()`.

## `querystring.encode()` {#querystringencode}

**Hinzugefügt in: v0.1.99**

Die Funktion `querystring.encode()` ist ein Alias für `querystring.stringify()`.

## `querystring.escape(str)` {#querystringescapestr}

**Hinzugefügt in: v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `querystring.escape()` führt eine URL-Prozentcodierung für die gegebene `str` in einer Weise durch, die für die spezifischen Anforderungen von URL-Query-Strings optimiert ist.

Die Methode `querystring.escape()` wird von `querystring.stringify()` verwendet und wird im Allgemeinen nicht direkt verwendet. Sie wird hauptsächlich exportiert, um Anwendungscode zu ermöglichen, eine alternative Prozentcodierungs-Implementierung bereitzustellen, falls erforderlich, indem `querystring.escape` einer alternativen Funktion zugewiesen wird.

## `querystring.parse(str[, sep[, eq[, options]]])` {#querystringparsestr-sep-eq-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Mehrere leere Einträge werden jetzt korrekt geparst (z. B. `&=&=`). |
| v6.0.0 | Das zurückgegebene Objekt erbt nicht mehr von `Object.prototype`. |
| v6.0.0, v4.2.4 | Der Parameter `eq` kann jetzt eine Länge von mehr als `1` haben. |
| v0.1.25 | Hinzugefügt in: v0.1.25 |
:::

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der zu parsende URL-Query-String
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Subzeichenfolge, die zum Abgrenzen von Schlüssel- und Wertpaaren im Query-String verwendet wird. **Standard:** `'&'`.
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). Die Subzeichenfolge, die zum Abgrenzen von Schlüsseln und Werten im Query-String verwendet wird. **Standard:** `'='`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `decodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Funktion, die beim Decodieren von Prozent-codierten Zeichen im Query-String verwendet werden soll. **Standard:** `querystring.unescape()`.
    - `maxKeys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die maximale Anzahl von zu parsenden Schlüsseln an. Geben Sie `0` an, um die Beschränkungen der Schlüsselzählung zu entfernen. **Standard:** `1000`.
  
 

Die Methode `querystring.parse()` parst einen URL-Query-String (`str`) in eine Sammlung von Schlüssel- und Wertpaaren.

Zum Beispiel wird der Query-String `'foo=bar&abc=xyz&abc=123'` geparst in:

```json [JSON]
{
  "foo": "bar",
  "abc": ["xyz", "123"]
}
```
Das von der Methode `querystring.parse()` zurückgegebene Objekt erbt *nicht* prototypisch von dem JavaScript-`Object`. Dies bedeutet, dass typische `Object`-Methoden wie `obj.toString()`, `obj.hasOwnProperty()` und andere nicht definiert sind und *nicht funktionieren*.

Standardmäßig wird davon ausgegangen, dass Prozent-codierte Zeichen innerhalb des Query-Strings die UTF-8-Codierung verwenden. Wenn eine alternative Zeichencodierung verwendet wird, muss eine alternative Option `decodeURIComponent` angegeben werden:

```js [ESM]
// Angenommen, die gbkDecodeURIComponent-Funktion existiert bereits...

querystring.parse('w=%D6%D0%CE%C4&foo=bar', null, null,
                  { decodeURIComponent: gbkDecodeURIComponent });
```

## `querystring.stringify(obj[, sep[, eq[, options]]])` {#querystringstringifyobj-sep-eq-options}

**Hinzugefügt in: v0.1.25**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das Objekt, das in eine URL-Query-String serialisiert werden soll
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Substring, die verwendet wird, um Schlüssel- und Wertepaare im Query-String zu trennen. **Standard:** `'&'`.
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). Die Substring, die verwendet wird, um Schlüssel und Werte im Query-String zu trennen. **Standard:** `'='`.
- `options`
    - `encodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Funktion, die verwendet wird, um URL-unsichere Zeichen in der Query-String in Prozentkodierung umzuwandeln. **Standard:** `querystring.escape()`.

Die Methode `querystring.stringify()` erzeugt einen URL-Query-String aus einem gegebenen `obj`, indem sie die "eigenen Eigenschaften" des Objekts durchläuft.

Sie serialisiert die folgenden Werttypen, die in `obj` übergeben werden: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Die numerischen Werte müssen endlich sein. Alle anderen Eingabewerte werden in leere Strings umgewandelt.

```js [ESM]
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// Gibt 'foo=bar&baz=qux&baz=quux&corge=' zurück

querystring.stringify({ foo: 'bar', baz: 'qux' }, ';', ':');
// Gibt 'foo:bar;baz:qux' zurück
```
Standardmäßig werden Zeichen, die innerhalb des Query-Strings eine Prozentkodierung erfordern, als UTF-8 kodiert. Wenn eine alternative Kodierung erforderlich ist, muss eine alternative Option `encodeURIComponent` angegeben werden:

```js [ESM]
// Angenommen, die Funktion gbkEncodeURIComponent existiert bereits,

querystring.stringify({ w: '中文', foo: 'bar' }, null, null,
                      { encodeURIComponent: gbkEncodeURIComponent });
```

## `querystring.unescape(str)` {#querystringunescapestr}

**Hinzugefügt in: v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `querystring.unescape()` führt die Dekodierung von URL-Prozent-kodierten Zeichen in der gegebenen `str` durch.

Die Methode `querystring.unescape()` wird von `querystring.parse()` verwendet und wird im Allgemeinen nicht direkt verwendet. Sie wird hauptsächlich exportiert, um Anwendungscode zu ermöglichen, bei Bedarf eine alternative Dekodierungsimplementierung bereitzustellen, indem `querystring.unescape` einer alternativen Funktion zugewiesen wird.

Standardmäßig versucht die Methode `querystring.unescape()`, die in JavaScript integrierte Methode `decodeURIComponent()` zum Dekodieren zu verwenden. Wenn dies fehlschlägt, wird ein sichereres Äquivalent verwendet, das bei fehlerhaften URLs keine Ausnahme auslöst.

