---
title: URL-Modul - Node.js Dokumentation
description: Das URL-Modul in Node.js bietet Werkzeuge zur URL-Auflösung und -Analyse. Es unterstützt den WHATWG URL-Standard und die veraltete urlObject-API, bietet Methoden zur Arbeit mit URLs in beiden Formaten.
head:
  - - meta
    - name: og:title
      content: URL-Modul - Node.js Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das URL-Modul in Node.js bietet Werkzeuge zur URL-Auflösung und -Analyse. Es unterstützt den WHATWG URL-Standard und die veraltete urlObject-API, bietet Methoden zur Arbeit mit URLs in beiden Formaten.
  - - meta
    - name: twitter:title
      content: URL-Modul - Node.js Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das URL-Modul in Node.js bietet Werkzeuge zur URL-Auflösung und -Analyse. Es unterstützt den WHATWG URL-Standard und die veraltete urlObject-API, bietet Methoden zur Arbeit mit URLs in beiden Formaten.
---


# URL {#url}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/url.js](https://github.com/nodejs/node/blob/v23.5.0/lib/url.js)

Das Modul `node:url` stellt Dienstprogramme zur URL-Auflösung und -Analyse bereit. Es kann wie folgt aufgerufen werden:

::: code-group
```js [ESM]
import url from 'node:url';
```

```js [CJS]
const url = require('node:url');
```
:::

## URL-Strings und URL-Objekte {#url-strings-and-url-objects}

Ein URL-String ist ein strukturierter String, der mehrere aussagekräftige Komponenten enthält. Beim Parsen wird ein URL-Objekt zurückgegeben, das Eigenschaften für jede dieser Komponenten enthält.

Das Modul `node:url` bietet zwei APIs für die Arbeit mit URLs: eine Legacy-API, die Node.js-spezifisch ist, und eine neuere API, die denselben [WHATWG URL-Standard](https://url.spec.whatwg.org/) implementiert, der von Webbrowsern verwendet wird.

Ein Vergleich zwischen der WHATWG- und der Legacy-API ist unten dargestellt. Oberhalb der URL `'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'` werden die Eigenschaften eines Objekts angezeigt, das von der Legacy-Funktion `url.parse()` zurückgegeben wird. Darunter befinden sich die Eigenschaften eines WHATWG `URL`-Objekts.

Die `origin`-Eigenschaft der WHATWG-URL enthält `protocol` und `host`, aber nicht `username` oder `password`.

```text [TEXT]
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
(Alle Leerzeichen in der ""-Zeile sollten ignoriert werden. Sie dienen lediglich der Formatierung.)
```
Parsen der URL-Zeichenfolge mit der WHATWG-API:

```js [ESM]
const myURL =
  new URL('https://user::8080/p/a/t/h?query=string#hash');
```
Parsen der URL-Zeichenfolge mit der Legacy-API:

::: code-group
```js [ESM]
import url from 'node:url';
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```

```js [CJS]
const url = require('node:url');
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```
:::


### Erstellen einer URL aus Komponenten und Abrufen der erstellten Zeichenfolge {#constructing-a-url-from-component-parts-and-getting-the-constructed-string}

Es ist möglich, eine WHATWG-URL aus Komponenten mithilfe der Eigenschafts-Setter oder einer Template-Literal-Zeichenfolge zu erstellen:

```js [ESM]
const myURL = new URL('https://example.org');
myURL.pathname = '/a/b/c';
myURL.search = '?d=e';
myURL.hash = '#fgh';
```
```js [ESM]
const pathname = '/a/b/c';
const search = '?d=e';
const hash = '#fgh';
const myURL = new URL(`https://example.org${pathname}${search}${hash}`);
```
Um die erstellte URL-Zeichenfolge abzurufen, verwenden Sie den Eigenschafts-Accessor `href`:

```js [ESM]
console.log(myURL.href);
```
## Die WHATWG URL API {#the-whatwg-url-api}

### Klasse: `URL` {#class-url}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Die Klasse ist jetzt im globalen Objekt verfügbar. |
| v7.0.0, v6.13.0 | Hinzugefügt in: v7.0.0, v6.13.0 |
:::

Browserkompatible `URL`-Klasse, implementiert gemäß dem WHATWG URL Standard. [Beispiele für geparste URLs](https://url.spec.whatwg.org/#example-url-parsing) finden Sie im Standard selbst. Die `URL`-Klasse ist auch im globalen Objekt verfügbar.

In Übereinstimmung mit Browserkonventionen werden alle Eigenschaften von `URL`-Objekten als Getter und Setter im Klassenprototyp implementiert und nicht als Dateneigenschaften des Objekts selbst. Im Gegensatz zu [Legacy `urlObject`](/de/nodejs/api/url#legacy-urlobject)s hat die Verwendung des Schlüsselworts `delete` für Eigenschaften von `URL`-Objekten (z. B. `delete myURL.protocol`, `delete myURL.pathname` usw.) keine Auswirkung, gibt aber dennoch `true` zurück.

#### `new URL(input[, base])` {#new-urlinput-base}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.0.0, v18.17.0 | Die ICU-Anforderung wurde entfernt. |
:::

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die absolute oder relative Eingabe-URL, die analysiert werden soll. Wenn `input` relativ ist, ist `base` erforderlich. Wenn `input` absolut ist, wird `base` ignoriert. Wenn `input` keine Zeichenfolge ist, wird sie zuerst [in eine Zeichenfolge konvertiert](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Basis-URL, gegen die aufgelöst werden soll, wenn `input` nicht absolut ist. Wenn `base` keine Zeichenfolge ist, wird sie zuerst [in eine Zeichenfolge konvertiert](https://tc39.es/ecma262/#sec-tostring).

Erstellt ein neues `URL`-Objekt, indem die `input` relativ zur `base` analysiert wird. Wenn `base` als Zeichenfolge übergeben wird, wird sie äquivalent zu `new URL(base)` analysiert.

```js [ESM]
const myURL = new URL('/foo', 'https://example.org/');
// https://example.org/foo
```
Der URL-Konstruktor ist als Eigenschaft des globalen Objekts zugänglich. Er kann auch aus dem eingebauten URL-Modul importiert werden:



::: code-group
```js [ESM]
import { URL } from 'node:url';
console.log(URL === globalThis.URL); // Gibt 'true' aus.
```

```js [CJS]
console.log(URL === require('node:url').URL); // Gibt 'true' aus.
```
:::

Ein `TypeError` wird ausgelöst, wenn die `input` oder `base` keine gültigen URLs sind. Beachten Sie, dass versucht wird, die angegebenen Werte in Zeichenfolgen zu konvertieren. Zum Beispiel:

```js [ESM]
const myURL = new URL({ toString: () => 'https://example.org/' });
// https://example.org/
```
Unicode-Zeichen, die im Hostnamen von `input` erscheinen, werden automatisch mit dem [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4)-Algorithmus in ASCII konvertiert.

```js [ESM]
const myURL = new URL('https://測試');
// https://xn--g6w251d/
```
In Fällen, in denen im Voraus nicht bekannt ist, ob `input` eine absolute URL ist und eine `base` angegeben wird, wird empfohlen zu validieren, ob der `origin` des `URL`-Objekts dem entspricht, was erwartet wird.

```js [ESM]
let myURL = new URL('http://Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https://Example.com/', 'https://example.org/');
// https://example.com/

myURL = new URL('foo://Example.com/', 'https://example.org/');
// foo://Example.com/

myURL = new URL('http:Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https:Example.com/', 'https://example.org/');
// https://example.org/Example.com/

myURL = new URL('foo:Example.com/', 'https://example.org/');
// foo:Example.com/
```

#### `url.hash` {#urlhash}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ruft den Fragmentteil der URL ab und legt ihn fest.

```js [ESM]
const myURL = new URL('https://example.org/foo#bar');
console.log(myURL.hash);
// Gibt #bar aus

myURL.hash = 'baz';
console.log(myURL.href);
// Gibt https://example.org/foo#baz aus
```
Ungültige URL-Zeichen, die im Wert enthalten sind, der der Eigenschaft `hash` zugewiesen wird, werden [Prozent-codiert](/de/nodejs/api/url#percent-encoding-in-urls). Die Auswahl der Zeichen, die Prozent-codiert werden sollen, kann geringfügig von dem abweichen, was die Methoden [`url.parse()`](/de/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) und [`url.format()`](/de/nodejs/api/url#urlformaturlobject) erzeugen würden.

#### `url.host` {#urlhost}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ruft den Host-Teil der URL ab und legt ihn fest.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.host);
// Gibt example.org:81 aus

myURL.host = 'example.com:82';
console.log(myURL.href);
// Gibt https://example.com:82/foo aus
```
Ungültige Host-Werte, die der Eigenschaft `host` zugewiesen werden, werden ignoriert.

#### `url.hostname` {#urlhostname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ruft den Hostnamen-Teil der URL ab und legt ihn fest. Der Hauptunterschied zwischen `url.host` und `url.hostname` besteht darin, dass `url.hostname` den Port *nicht* enthält.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.hostname);
// Gibt example.org aus

// Das Setzen des Hostnamens ändert den Port nicht
myURL.hostname = 'example.com';
console.log(myURL.href);
// Gibt https://example.com:81/foo aus

// Verwenden Sie myURL.host, um Hostname und Port zu ändern
myURL.host = 'example.org:82';
console.log(myURL.href);
// Gibt https://example.org:82/foo aus
```
Ungültige Hostnamen-Werte, die der Eigenschaft `hostname` zugewiesen werden, werden ignoriert.

#### `url.href` {#urlhref}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ruft die serialisierte URL ab und legt sie fest.

```js [ESM]
const myURL = new URL('https://example.org/foo');
console.log(myURL.href);
// Gibt https://example.org/foo aus

myURL.href = 'https://example.com/bar';
console.log(myURL.href);
// Gibt https://example.com/bar aus
```
Das Abrufen des Werts der Eigenschaft `href` entspricht dem Aufruf von [`url.toString()`](/de/nodejs/api/url#urltostring).

Das Setzen des Werts dieser Eigenschaft auf einen neuen Wert entspricht dem Erstellen eines neuen `URL`-Objekts mit [`new URL(value)`](/de/nodejs/api/url#new-urlinput-base). Jede der Eigenschaften des `URL`-Objekts wird geändert.

Wenn der der Eigenschaft `href` zugewiesene Wert keine gültige URL ist, wird ein `TypeError` ausgelöst.


#### `url.origin` {#urlorigin}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Das Schema "gopher" ist nicht länger speziell und `url.origin` gibt nun `'null'` dafür zurück. |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ruft die schreibgeschützte Serialisierung des Ursprungs der URL ab.

```js [ESM]
const myURL = new URL('https://example.org/foo/bar?baz');
console.log(myURL.origin);
// Gibt https://example.org aus
```
```js [ESM]
const idnURL = new URL('https://測試');
console.log(idnURL.origin);
// Gibt https://xn--g6w251d aus

console.log(idnURL.hostname);
// Gibt xn--g6w251d aus
```
#### `url.password` {#urlpassword}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ruft den Passwortteil der URL ab und legt ihn fest.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.password);
// Gibt xyz aus

myURL.password = '123';
console.log(myURL.href);
// Gibt https://abc:/ aus
```
Ungültige URL-Zeichen, die in dem Wert enthalten sind, der der Eigenschaft `password` zugewiesen wird, werden [prozentual codiert](/de/nodejs/api/url#percent-encoding-in-urls). Die Auswahl der Zeichen, die prozentual codiert werden sollen, kann sich geringfügig von dem unterscheiden, was die Methoden [`url.parse()`](/de/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) und [`url.format()`](/de/nodejs/api/url#urlformaturlobject) erzeugen würden.

#### `url.pathname` {#urlpathname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ruft den Pfadteil der URL ab und legt ihn fest.

```js [ESM]
const myURL = new URL('https://example.org/abc/xyz?123');
console.log(myURL.pathname);
// Gibt /abc/xyz aus

myURL.pathname = '/abcdef';
console.log(myURL.href);
// Gibt https://example.org/abcdef?123 aus
```
Ungültige URL-Zeichen, die in dem Wert enthalten sind, der der Eigenschaft `pathname` zugewiesen wird, werden [prozentual codiert](/de/nodejs/api/url#percent-encoding-in-urls). Die Auswahl der Zeichen, die prozentual codiert werden sollen, kann sich geringfügig von dem unterscheiden, was die Methoden [`url.parse()`](/de/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) und [`url.format()`](/de/nodejs/api/url#urlformaturlobject) erzeugen würden.


#### `url.port` {#urlport}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Das Schema "gopher" ist nicht mehr speziell. |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ruft den Port-Abschnitt der URL ab und legt ihn fest.

Der Portwert kann eine Zahl oder eine Zeichenkette sein, die eine Zahl im Bereich von `0` bis `65535` (einschließlich) enthält. Das Setzen des Wertes auf den Standardport der gegebenen `URL`-Objekte `protocol` führt dazu, dass der `port`-Wert zur leeren Zeichenkette (`''`) wird.

Der Portwert kann eine leere Zeichenkette sein, in diesem Fall hängt der Port vom Protokoll/Schema ab:

| Protokoll | Port |
| --- | --- |
| "ftp" | 21 |
| "file" ||
| "http" | 80 |
| "https" | 443 |
| "ws" | 80 |
| "wss" | 443 |
Bei der Zuweisung eines Wertes zum Port wird der Wert zuerst mit `.toString()` in eine Zeichenkette umgewandelt.

Wenn diese Zeichenkette ungültig ist, aber mit einer Zahl beginnt, wird die führende Zahl `port` zugewiesen. Liegt die Zahl außerhalb des oben genannten Bereichs, wird sie ignoriert.

```js [ESM]
const myURL = new URL('https://example.org:8888');
console.log(myURL.port);
// Gibt 8888 aus

// Standardports werden automatisch in die leere Zeichenkette umgewandelt
// (Der Standardport des HTTPS-Protokolls ist 443)
myURL.port = '443';
console.log(myURL.port);
// Gibt die leere Zeichenkette aus
console.log(myURL.href);
// Gibt https://example.org/ aus

myURL.port = 1234;
console.log(myURL.port);
// Gibt 1234 aus
console.log(myURL.href);
// Gibt https://example.org:1234/ aus

// Vollständig ungültige Port-Zeichenketten werden ignoriert
myURL.port = 'abcd';
console.log(myURL.port);
// Gibt 1234 aus

// Führende Zahlen werden als Portnummer behandelt
myURL.port = '5678abcd';
console.log(myURL.port);
// Gibt 5678 aus

// Nicht-Ganzzahlen werden abgeschnitten
myURL.port = 1234.5678;
console.log(myURL.port);
// Gibt 1234 aus

// Zahlen außerhalb des Bereichs, die nicht in wissenschaftlicher Notation dargestellt werden,
// werden ignoriert.
myURL.port = 1e10; // 10000000000, wird wie unten beschrieben auf Bereich geprüft
console.log(myURL.port);
// Gibt 1234 aus
```
Zahlen, die einen Dezimalpunkt enthalten, wie z. B. Gleitkommazahlen oder Zahlen in wissenschaftlicher Notation, sind keine Ausnahme von dieser Regel. Führende Zahlen bis zum Dezimalpunkt werden als Port der URL festgelegt, vorausgesetzt, sie sind gültig:

```js [ESM]
myURL.port = 4.567e21;
console.log(myURL.port);
// Gibt 4 aus (weil es die führende Zahl in der Zeichenkette '4.567e21' ist)
```

#### `url.protocol` {#urlprotocol}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ruft den Protokollteil der URL ab und legt ihn fest.

```js [ESM]
const myURL = new URL('https://example.org');
console.log(myURL.protocol);
// Gibt https: aus

myURL.protocol = 'ftp';
console.log(myURL.href);
// Gibt ftp://example.org/ aus
```
Ungültige URL-Protokollwerte, die der `protocol`-Eigenschaft zugewiesen werden, werden ignoriert.

##### Spezielle Schemata {#special-schemes}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Das Schema "gopher" ist nicht mehr speziell. |
:::

Der [WHATWG URL-Standard](https://url.spec.whatwg.org/) betrachtet eine Handvoll URL-Protokollschemata als *speziell* in Bezug auf die Art und Weise, wie sie geparst und serialisiert werden. Wenn eine URL mit einem dieser speziellen Protokolle geparst wird, kann die Eigenschaft `url.protocol` in ein anderes spezielles Protokoll geändert werden, aber sie kann nicht in ein nicht-spezielles Protokoll geändert werden und umgekehrt.

Zum Beispiel funktioniert die Änderung von `http` zu `https`:

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'https';
console.log(u.href);
// https://example.org/
```
Die Änderung von `http` zu einem hypothetischen `fish`-Protokoll funktioniert jedoch nicht, da das neue Protokoll nicht speziell ist.

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'fish';
console.log(u.href);
// http://example.org/
```
Ebenso ist die Änderung von einem nicht-speziellen Protokoll zu einem speziellen Protokoll ebenfalls nicht zulässig:

```js [ESM]
const u = new URL('fish://example.org');
u.protocol = 'http';
console.log(u.href);
// fish://example.org
```
Gemäß dem WHATWG URL-Standard sind spezielle Protokollschemata `ftp`, `file`, `http`, `https`, `ws` und `wss`.

#### `url.search` {#urlsearch}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ruft den serialisierten Abfrageteil der URL ab und legt ihn fest.

```js [ESM]
const myURL = new URL('https://example.org/abc?123');
console.log(myURL.search);
// Gibt ?123 aus

myURL.search = 'abc=xyz';
console.log(myURL.href);
// Gibt https://example.org/abc?abc=xyz aus
```
Alle ungültigen URL-Zeichen, die im Wert der Eigenschaft `search` erscheinen, werden [prozentual codiert](/de/nodejs/api/url#percent-encoding-in-urls). Die Auswahl, welche Zeichen prozentual codiert werden sollen, kann geringfügig von dem abweichen, was die Methoden [`url.parse()`](/de/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) und [`url.format()`](/de/nodejs/api/url#urlformaturlobject) erzeugen würden.


#### `url.searchParams` {#urlsearchparams}

- [\<URLSearchParams\>](/de/nodejs/api/url#class-urlsearchparams)

Ruft das [`URLSearchParams`](/de/nodejs/api/url#class-urlsearchparams)-Objekt ab, das die Abfrageparameter der URL repräsentiert. Diese Eigenschaft ist schreibgeschützt, aber das bereitgestellte `URLSearchParams`-Objekt kann verwendet werden, um die URL-Instanz zu verändern. Um die gesamten Abfrageparameter der URL zu ersetzen, verwenden Sie den [`url.search`](/de/nodejs/api/url#urlsearch)-Setter. Weitere Informationen finden Sie in der Dokumentation zu [`URLSearchParams`](/de/nodejs/api/url#class-urlsearchparams).

Seien Sie vorsichtig bei der Verwendung von `.searchParams` zum Ändern der `URL`, da das `URLSearchParams`-Objekt gemäß der WHATWG-Spezifikation unterschiedliche Regeln verwendet, um zu bestimmen, welche Zeichen prozentual kodiert werden sollen. Beispielsweise wird das ASCII-Tilde-Zeichen (`~`) vom `URL`-Objekt nicht prozentual kodiert, während es von `URLSearchParams` immer kodiert wird:

```js [ESM]
const myURL = new URL('https://example.org/abc?foo=~bar');

console.log(myURL.search);  // gibt ?foo=~bar aus

// Ändern Sie die URL über searchParams...
myURL.searchParams.sort();

console.log(myURL.search);  // gibt ?foo=%7Ebar aus
```
#### `url.username` {#urlusername}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ruft den Benutzernamen-Teil der URL ab und legt ihn fest.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.username);
// Gibt abc aus

myURL.username = '123';
console.log(myURL.href);
// Gibt https://123:/ aus
```
Alle ungültigen URL-Zeichen, die in dem Wert erscheinen, der der `username`-Eigenschaft zugewiesen wird, werden [prozentual kodiert](/de/nodejs/api/url#percent-encoding-in-urls). Die Auswahl der Zeichen, die prozentual kodiert werden sollen, kann von dem abweichen, was die Methoden [`url.parse()`](/de/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) und [`url.format()`](/de/nodejs/api/url#urlformaturlobject) erzeugen würden.

#### `url.toString()` {#urltostring}

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `toString()` des `URL`-Objekts gibt die serialisierte URL zurück. Der zurückgegebene Wert entspricht dem von [`url.href`](/de/nodejs/api/url#urlhref) und [`url.toJSON()`](/de/nodejs/api/url#urltojson).


#### `url.toJSON()` {#urltojson}

**Hinzugefügt in: v7.7.0, v6.13.0**

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `toJSON()` des `URL`-Objekts gibt die serialisierte URL zurück. Der zurückgegebene Wert entspricht dem von [`url.href`](/de/nodejs/api/url#urlhref) und [`url.toString()`](/de/nodejs/api/url#urltostring).

Diese Methode wird automatisch aufgerufen, wenn ein `URL`-Objekt mit [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) serialisiert wird.

```js [ESM]
const myURLs = [
  new URL('https://www.example.com'),
  new URL('https://test.example.org'),
];
console.log(JSON.stringify(myURLs));
// Prints ["https://www.example.com/","https://test.example.org/"]
```
#### `URL.createObjectURL(blob)` {#urlcreateobjecturlblob}

**Hinzugefügt in: v16.7.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `blob` [\<Blob\>](/de/nodejs/api/buffer#class-blob)
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Erstellt eine `'blob:nodedata:...'`-URL-Zeichenfolge, die das angegebene [\<Blob\>](/de/nodejs/api/buffer#class-blob)-Objekt darstellt und verwendet werden kann, um das `Blob` später abzurufen.

```js [ESM]
const {
  Blob,
  resolveObjectURL,
} = require('node:buffer');

const blob = new Blob(['hello']);
const id = URL.createObjectURL(blob);

// later...

const otherBlob = resolveObjectURL(id);
console.log(otherBlob.size);
```
Die von dem registrierten [\<Blob\>](/de/nodejs/api/buffer#class-blob) gespeicherten Daten werden im Speicher behalten, bis `URL.revokeObjectURL()` aufgerufen wird, um sie zu entfernen.

`Blob`-Objekte werden innerhalb des aktuellen Threads registriert. Bei Verwendung von Worker-Threads sind `Blob`-Objekte, die innerhalb eines Workers registriert sind, nicht für andere Worker oder den Haupt-Thread verfügbar.

#### `URL.revokeObjectURL(id)` {#urlrevokeobjecturlid}

**Hinzugefügt in: v16.7.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine `'blob:nodedata:...`-URL-Zeichenfolge, die von einem vorherigen Aufruf von `URL.createObjectURL()` zurückgegeben wurde.

Entfernt das gespeicherte [\<Blob\>](/de/nodejs/api/buffer#class-blob), das durch die angegebene ID identifiziert wird. Der Versuch, eine ID zu widerrufen, die nicht registriert ist, schlägt stillschweigend fehl.


#### `URL.canParse(input[, base])` {#urlcanparseinput-base}

**Hinzugefügt in: v19.9.0, v18.17.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die absolute oder relative Eingabe-URL, die analysiert werden soll. Wenn `input` relativ ist, ist `base` erforderlich. Wenn `input` absolut ist, wird `base` ignoriert. Wenn `input` keine Zeichenkette ist, wird sie zuerst in eine [Zeichenkette konvertiert](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Basis-URL, gegen die aufgelöst werden soll, wenn `input` nicht absolut ist. Wenn `base` keine Zeichenkette ist, wird sie zuerst in eine [Zeichenkette konvertiert](https://tc39.es/ecma262/#sec-tostring).
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Prüft, ob ein `input` relativ zu `base` in eine `URL` geparst werden kann.

```js [ESM]
const isValid = URL.canParse('/foo', 'https://example.org/'); // true

const isNotValid = URL.canParse('/foo'); // false
```
#### `URL.parse(input[, base])` {#urlparseinput-base}

**Hinzugefügt in: v22.1.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die absolute oder relative Eingabe-URL, die analysiert werden soll. Wenn `input` relativ ist, ist `base` erforderlich. Wenn `input` absolut ist, wird `base` ignoriert. Wenn `input` keine Zeichenkette ist, wird sie zuerst in eine [Zeichenkette konvertiert](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Basis-URL, gegen die aufgelöst werden soll, wenn `input` nicht absolut ist. Wenn `base` keine Zeichenkette ist, wird sie zuerst in eine [Zeichenkette konvertiert](https://tc39.es/ecma262/#sec-tostring).
- Gibt zurück: [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Analysiert eine Zeichenkette als URL. Wenn `base` angegeben ist, wird diese als Basis-URL verwendet, um nicht-absolute `input`-URLs aufzulösen. Gibt `null` zurück, wenn `input` ungültig ist.


### Klasse: `URLSearchParams` {#class-urlsearchparams}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Die Klasse ist jetzt im globalen Objekt verfügbar. |
| v7.5.0, v6.13.0 | Hinzugefügt in: v7.5.0, v6.13.0 |
:::

Die `URLSearchParams`-API bietet Lese- und Schreibzugriff auf die Abfrage einer `URL`. Die Klasse `URLSearchParams` kann auch eigenständig mit einem der vier folgenden Konstruktoren verwendet werden. Die Klasse `URLSearchParams` ist auch im globalen Objekt verfügbar.

Die WHATWG `URLSearchParams`-Schnittstelle und das [`querystring`](/de/nodejs/api/querystring)-Modul haben einen ähnlichen Zweck, aber der Zweck des [`querystring`](/de/nodejs/api/querystring)-Moduls ist allgemeiner, da es die Anpassung von Trennzeichen (`&` und `=`) ermöglicht. Andererseits ist diese API ausschließlich für URL-Abfragezeichenfolgen konzipiert.

```js [ESM]
const myURL = new URL('https://example.org/?abc=123');
console.log(myURL.searchParams.get('abc'));
// Gibt 123 aus

myURL.searchParams.append('abc', 'xyz');
console.log(myURL.href);
// Gibt https://example.org/?abc=123&abc=xyz aus

myURL.searchParams.delete('abc');
myURL.searchParams.set('a', 'b');
console.log(myURL.href);
// Gibt https://example.org/?a=b aus

const newSearchParams = new URLSearchParams(myURL.searchParams);
// Das Obige ist äquivalent zu
// const newSearchParams = new URLSearchParams(myURL.search);

newSearchParams.append('a', 'c');
console.log(myURL.href);
// Gibt https://example.org/?a=b aus
console.log(newSearchParams.toString());
// Gibt a=b&a=c aus

// newSearchParams.toString() wird implizit aufgerufen
myURL.search = newSearchParams;
console.log(myURL.href);
// Gibt https://example.org/?a=b&a=c aus
newSearchParams.delete('a');
console.log(myURL.href);
// Gibt https://example.org/?a=b&a=c aus
```
#### `new URLSearchParams()` {#new-urlsearchparams}

Erstellt ein neues, leeres `URLSearchParams`-Objekt.

#### `new URLSearchParams(string)` {#new-urlsearchparamsstring}

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine Abfragezeichenfolge

Analysiert die `string` als Abfragezeichenfolge und verwendet sie, um ein neues `URLSearchParams`-Objekt zu instanziieren. Ein führendes `'?'`, falls vorhanden, wird ignoriert.

```js [ESM]
let params;

params = new URLSearchParams('user=abc&query=xyz');
console.log(params.get('user'));
// Gibt 'abc' aus
console.log(params.toString());
// Gibt 'user=abc&query=xyz' aus

params = new URLSearchParams('?user=abc&query=xyz');
console.log(params.toString());
// Gibt 'user=abc&query=xyz' aus
```

#### `new URLSearchParams(obj)` {#new-urlsearchparamsobj}

**Hinzugefügt in: v7.10.0, v6.13.0**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Objekt, das eine Sammlung von Schlüssel-Wert-Paaren darstellt

Erzeugt ein neues `URLSearchParams`-Objekt mit einer Query-Hash-Map. Der Schlüssel und der Wert jeder Eigenschaft von `obj` werden immer in Strings umgewandelt.

Im Gegensatz zum [`querystring`](/de/nodejs/api/querystring)-Modul sind doppelte Schlüssel in Form von Array-Werten nicht erlaubt. Arrays werden mit [`array.toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString) in Strings umgewandelt, was einfach alle Array-Elemente mit Kommas verbindet.

```js [ESM]
const params = new URLSearchParams({
  user: 'abc',
  query: ['first', 'second'],
});
console.log(params.getAll('query'));
// Gibt [ 'first,second' ] aus
console.log(params.toString());
// Gibt 'user=abc&query=first%2Csecond' aus
```
#### `new URLSearchParams(iterable)` {#new-urlsearchparamsiterable}

**Hinzugefügt in: v7.10.0, v6.13.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Ein iterierbares Objekt, dessen Elemente Schlüssel-Wert-Paare sind

Erzeugt ein neues `URLSearchParams`-Objekt mit einer iterierbaren Map auf eine Weise, die dem Konstruktor von [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) ähnelt. `iterable` kann ein `Array` oder ein beliebiges iterierbares Objekt sein. Das bedeutet, dass `iterable` ein anderes `URLSearchParams` sein kann, in welchem Fall der Konstruktor einfach einen Klon des bereitgestellten `URLSearchParams` erstellt. Elemente von `iterable` sind Schlüssel-Wert-Paare und können selbst ein beliebiges iterierbares Objekt sein.

Doppelte Schlüssel sind erlaubt.

```js [ESM]
let params;

// Verwenden eines Arrays
params = new URLSearchParams([
  ['user', 'abc'],
  ['query', 'first'],
  ['query', 'second'],
]);
console.log(params.toString());
// Gibt 'user=abc&query=first&query=second' aus

// Verwenden eines Map-Objekts
const map = new Map();
map.set('user', 'abc');
map.set('query', 'xyz');
params = new URLSearchParams(map);
console.log(params.toString());
// Gibt 'user=abc&query=xyz' aus

// Verwenden einer Generatorfunktion
function* getQueryPairs() {
  yield ['user', 'abc'];
  yield ['query', 'first'];
  yield ['query', 'second'];
}
params = new URLSearchParams(getQueryPairs());
console.log(params.toString());
// Gibt 'user=abc&query=first&query=second' aus

// Jedes Schlüssel-Wert-Paar muss genau zwei Elemente haben
new URLSearchParams([
  ['user', 'abc', 'error'],
]);
// Wirft TypeError [ERR_INVALID_TUPLE]:
//        Jedes Query-Paar muss ein iterierbares [name, value]-Tupel sein
```

#### `urlSearchParams.append(name, value)` {#urlsearchparamsappendname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Fügt ein neues Name-Wert-Paar zur Abfragezeichenfolge hinzu.

#### `urlSearchParams.delete(name[, value])` {#urlsearchparamsdeletename-value}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.2.0, v18.18.0 | Unterstützung für optionales `value`-Argument hinzugefügt. |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Wenn `value` angegeben ist, werden alle Name-Wert-Paare entfernt, bei denen der Name `name` und der Wert `value` ist.

Wenn `value` nicht angegeben ist, werden alle Name-Wert-Paare entfernt, deren Name `name` ist.

#### `urlSearchParams.entries()` {#urlsearchparamsentries}

- Gibt zurück: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Gibt einen ES6 `Iterator` über jedes der Name-Wert-Paare in der Abfrage zurück. Jedes Element des Iterators ist ein JavaScript `Array`. Das erste Element des `Array` ist der `name`, das zweite Element des `Array` ist der `value`.

Alias für [`urlSearchParams[@@iterator]()`](/de/nodejs/api/url#urlsearchparamssymboliterator).

#### `urlSearchParams.forEach(fn[, thisArg])` {#urlsearchparamsforeachfn-thisarg}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `fn`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird für jedes Name-Wert-Paar in der Abfrage aufgerufen
- `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Soll als `this`-Wert verwendet werden, wenn `fn` aufgerufen wird

Iteriert über jedes Name-Wert-Paar in der Abfrage und ruft die angegebene Funktion auf.

```js [ESM]
const myURL = new URL('https://example.org/?a=b&c=d');
myURL.searchParams.forEach((value, name, searchParams) => {
  console.log(name, value, myURL.searchParams === searchParams);
});
// Prints:
//   a b true
//   c d true
```

#### `urlSearchParams.get(name)` {#urlsearchparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Eine Zeichenkette oder `null`, wenn kein Name-Wert-Paar mit dem gegebenen `name` vorhanden ist.

Gibt den Wert des ersten Name-Wert-Paares zurück, dessen Name `name` ist. Wenn keine solchen Paare vorhanden sind, wird `null` zurückgegeben.

#### `urlSearchParams.getAll(name)` {#urlsearchparamsgetallname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt die Werte aller Name-Wert-Paare zurück, deren Name `name` ist. Wenn keine solchen Paare vorhanden sind, wird ein leeres Array zurückgegeben.

#### `urlSearchParams.has(name[, value])` {#urlsearchparamshasname-value}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.2.0, v18.18.0 | Unterstützung für optionales `value`-Argument hinzugefügt. |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Prüft, ob das `URLSearchParams`-Objekt Schlüssel-Wert-Paare basierend auf `name` und einem optionalen `value`-Argument enthält.

Wenn `value` angegeben ist, wird `true` zurückgegeben, wenn ein Name-Wert-Paar mit demselben `name` und `value` vorhanden ist.

Wenn `value` nicht angegeben ist, wird `true` zurückgegeben, wenn mindestens ein Name-Wert-Paar vorhanden ist, dessen Name `name` ist.

#### `urlSearchParams.keys()` {#urlsearchparamskeys}

- Gibt zurück: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Gibt einen ES6 `Iterator` über die Namen jedes Name-Wert-Paares zurück.

```js [ESM]
const params = new URLSearchParams('foo=bar&foo=baz');
for (const name of params.keys()) {
  console.log(name);
}
// Gibt aus:
//   foo
//   foo
```

#### `urlSearchParams.set(name, value)` {#urlsearchparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Setzt den Wert im `URLSearchParams`-Objekt, der mit `name` assoziiert ist, auf `value`. Wenn es bereits Name-Wert-Paare gibt, deren Namen `name` sind, wird der Wert des ersten solchen Paares auf `value` gesetzt und alle anderen werden entfernt. Andernfalls wird das Name-Wert-Paar an die Abfragezeichenfolge angehängt.

```js [ESM]
const params = new URLSearchParams();
params.append('foo', 'bar');
params.append('foo', 'baz');
params.append('abc', 'def');
console.log(params.toString());
// Prints foo=bar&foo=baz&abc=def

params.set('foo', 'def');
params.set('xyz', 'opq');
console.log(params.toString());
// Prints foo=def&abc=def&xyz=opq
```
#### `urlSearchParams.size` {#urlsearchparamssize}

**Hinzugefügt in: v19.8.0, v18.16.0**

Die Gesamtzahl der Parametereinträge.

#### `urlSearchParams.sort()` {#urlsearchparamssort}

**Hinzugefügt in: v7.7.0, v6.13.0**

Sortiert alle vorhandenen Name-Wert-Paare In-Place nach ihren Namen. Die Sortierung erfolgt mit einem [stabilen Sortieralgorithmus](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability), sodass die relative Reihenfolge zwischen Name-Wert-Paaren mit demselben Namen erhalten bleibt.

Diese Methode kann insbesondere verwendet werden, um Cache-Treffer zu erhöhen.

```js [ESM]
const params = new URLSearchParams('query[]=abc&type=search&query[]=123');
params.sort();
console.log(params.toString());
// Prints query%5B%5D=abc&query%5B%5D=123&type=search
```
#### `urlSearchParams.toString()` {#urlsearchparamstostring}

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt die Suchparameter als Zeichenfolge serialisiert zurück, wobei Zeichen bei Bedarf prozentual kodiert werden.

#### `urlSearchParams.values()` {#urlsearchparamsvalues}

- Gibt zurück: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Gibt einen ES6-`Iterator` über die Werte jedes Name-Wert-Paares zurück.


#### `urlSearchParams[Symbol.iterator]()` {#urlsearchparamssymboliterator}

- Gibt zurück: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Gibt einen ES6 `Iterator` über jedes der Name-Wert-Paare in der Abfragezeichenfolge zurück. Jedes Element des Iterators ist ein JavaScript `Array`. Das erste Element des `Array` ist der `name`, das zweite Element des `Array` ist der `value`.

Alias für [`urlSearchParams.entries()`](/de/nodejs/api/url#urlsearchparamsentries).

```js [ESM]
const params = new URLSearchParams('foo=bar&xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```
### `url.domainToASCII(domain)` {#urldomaintoasciidomain}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.0.0, v18.17.0 | ICU-Anforderung wurde entfernt. |
| v7.4.0, v6.13.0 | Hinzugefügt in: v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt die [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4)-ASCII-Serialisierung der `domain` zurück. Wenn `domain` eine ungültige Domain ist, wird die leere Zeichenfolge zurückgegeben.

Es führt die inverse Operation zu [`url.domainToUnicode()`](/de/nodejs/api/url#urldomaintounicodedomain) aus.



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToASCII('español.com'));
// Prints xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Prints xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Prints an empty string
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToASCII('español.com'));
// Prints xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Prints xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Prints an empty string
```
:::

### `url.domainToUnicode(domain)` {#urldomaintounicodedomain}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.0.0, v18.17.0 | ICU-Anforderung wurde entfernt. |
| v7.4.0, v6.13.0 | Hinzugefügt in: v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt die Unicode-Serialisierung der `domain` zurück. Wenn `domain` eine ungültige Domain ist, wird die leere Zeichenfolge zurückgegeben.

Es führt die inverse Operation zu [`url.domainToASCII()`](/de/nodejs/api/url#urldomaintoasciidomain) aus.



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Prints español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Prints 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Prints an empty string
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Prints español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Prints 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Prints an empty string
```
:::


### `url.fileURLToPath(url[, options])` {#urlfileurltopathurl-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.1.0, v20.13.0 | Das Argument `options` kann jetzt verwendet werden, um zu bestimmen, wie das Argument `path` analysiert werden soll. |
| v10.12.0 | Hinzugefügt in: v10.12.0 |
:::

- `url` [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Datei-URL-Zeichenkette oder das URL-Objekt, das in einen Pfad konvertiert werden soll.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true`, wenn der `path` als Windows-Dateipfad zurückgegeben werden soll, `false` für Posix und `undefined` für die Systemstandardeinstellung. **Standard:** `undefined`.


- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der vollständig aufgelöste, plattformspezifische Node.js-Dateipfad.

Diese Funktion stellt die korrekte Decodierung von prozentual kodierten Zeichen sicher und gewährleistet eine plattformübergreifend gültige absolute Pfadzeichenkette.

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

new URL('file:///C:/path/').pathname;      // Falsch: /C:/path/
fileURLToPath('file:///C:/path/');         // Korrekt:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // Falsch: /foo.txt
fileURLToPath('file://nas/foo.txt');       // Korrekt:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // Falsch: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // Korrekt:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // Falsch: /hello%20world
fileURLToPath('file:///hello world');      // Korrekt:   /hello world (POSIX)
```

```js [CJS]
const { fileURLToPath } = require('node:url');
new URL('file:///C:/path/').pathname;      // Falsch: /C:/path/
fileURLToPath('file:///C:/path/');         // Korrekt:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // Falsch: /foo.txt
fileURLToPath('file://nas/foo.txt');       // Korrekt:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // Falsch: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // Korrekt:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // Falsch: /hello%20world
fileURLToPath('file:///hello world');      // Korrekt:   /hello world (POSIX)
```
:::


### `url.format(URL[, options])` {#urlformaturl-options}

**Hinzugefügt in: v7.6.0**

- `URL` [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Ein [WHATWG URL](/de/nodejs/api/url#the-whatwg-url-api)-Objekt
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `auth` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn die serialisierte URL-Zeichenfolge den Benutzernamen und das Passwort enthalten soll, andernfalls `false`. **Standard:** `true`.
    - `fragment` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn die serialisierte URL-Zeichenfolge das Fragment enthalten soll, andernfalls `false`. **Standard:** `true`.
    - `search` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn die serialisierte URL-Zeichenfolge die Suchabfrage enthalten soll, andernfalls `false`. **Standard:** `true`.
    - `unicode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn Unicode-Zeichen, die in der Host-Komponente der URL-Zeichenfolge vorkommen, direkt codiert werden sollen, anstatt Punycode-codiert zu werden. **Standard:** `false`.

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt eine anpassbare Serialisierung einer URL `String`-Darstellung eines [WHATWG URL](/de/nodejs/api/url#the-whatwg-url-api)-Objekts zurück.

Das URL-Objekt verfügt sowohl über eine `toString()`-Methode als auch über eine `href`-Eigenschaft, die String-Serialisierungen der URL zurückgeben. Diese sind jedoch in keiner Weise anpassbar. Die Methode `url.format(URL[, options])` ermöglicht eine grundlegende Anpassung der Ausgabe.

::: code-group
```js [ESM]
import url from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```

```js [CJS]
const url = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```
:::


### `url.pathToFileURL(path[, options])` {#urlpathtofileurlpath-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.1.0, v20.13.0 | Das `options`-Argument kann nun verwendet werden, um zu bestimmen, wie der `path`-Wert zurückgegeben werden soll. |
| v10.12.0 | Hinzugefügt in: v10.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Pfad, der in eine Datei-URL konvertiert werden soll.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true`, wenn der `path` als Windows-Dateipfad behandelt werden soll, `false` für Posix und `undefined` für die Systemvorgabe. **Standard:** `undefined`.


- Gibt zurück: [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Das Datei-URL-Objekt.

Diese Funktion stellt sicher, dass `path` absolut aufgelöst wird und dass die URL-Steuerzeichen bei der Konvertierung in eine Datei-URL korrekt codiert werden.


::: code-group
```js [ESM]
import { pathToFileURL } from 'node:url';

new URL('/foo#1', 'file:');           // Falsch: file:///foo#1
pathToFileURL('/foo#1');              // Korrekt:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // Falsch: file:///some/path%.c
pathToFileURL('/some/path%.c');       // Korrekt:   file:///some/path%25.c (POSIX)
```

```js [CJS]
const { pathToFileURL } = require('node:url');
new URL(__filename);                  // Falsch: throws (POSIX)
new URL(__filename);                  // Falsch: C:\... (Windows)
pathToFileURL(__filename);            // Korrekt:   file:///... (POSIX)
pathToFileURL(__filename);            // Korrekt:   file:///C:/... (Windows)

new URL('/foo#1', 'file:');           // Falsch: file:///foo#1
pathToFileURL('/foo#1');              // Korrekt:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // Falsch: file:///some/path%.c
pathToFileURL('/some/path%.c');       // Korrekt:   file:///some/path%25.c (POSIX)
```
:::


### `url.urlToHttpOptions(url)` {#urlurltohttpoptionsurl}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.9.0, v18.17.0 | Das zurückgegebene Objekt enthält auch alle eigenen aufzählbaren Eigenschaften des `url`-Arguments. |
| v15.7.0, v14.18.0 | Hinzugefügt in: v15.7.0, v14.18.0 |
:::

- `url` [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Das [WHATWG URL](/de/nodejs/api/url#the-whatwg-url-api)-Objekt, das in ein Options-Objekt konvertiert werden soll.
- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options-Objekt
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Zu verwendendes Protokoll.
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein Domänenname oder eine IP-Adresse des Servers, an den die Anfrage gesendet werden soll.
    - `hash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Fragmentteil der URL.
    - `search` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der serialisierte Abfrageteil der URL.
    - `pathname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Pfadteil der URL.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Anfragepfad. Sollte die Abfragezeichenfolge enthalten, falls vorhanden. Z.B. `'/index.html?page=12'`. Es wird eine Ausnahme ausgelöst, wenn der Anfragepfad ungültige Zeichen enthält. Derzeit werden nur Leerzeichen abgelehnt, dies kann sich aber in Zukunft ändern.
    - `href` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die serialisierte URL.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port des Remote-Servers.
    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Basisauthentifizierung, d.h. `'user:password'`, um einen Authorization-Header zu berechnen.

Diese Hilfsfunktion konvertiert ein URL-Objekt in ein gewöhnliches Options-Objekt, wie es von den APIs [`http.request()`](/de/nodejs/api/http#httprequestoptions-callback) und [`https.request()`](/de/nodejs/api/https#httpsrequestoptions-callback) erwartet wird.

::: code-group
```js [ESM]
import { urlToHttpOptions } from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```

```js [CJS]
const { urlToHttpOptions } = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```
:::


## Legacy URL API {#legacy-url-api}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.13.0, v14.17.0 | Deprecation aufgehoben. Status zu "Legacy" geändert. |
| v11.0.0 | Diese API ist veraltet. |
:::

::: info [Stable: 3 - Legacy]
[Stable: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Verwenden Sie stattdessen die WHATWG URL API.
:::

### Legacy `urlObject` {#legacy-urlobject}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.13.0, v14.17.0 | Deprecation aufgehoben. Status zu "Legacy" geändert. |
| v11.0.0 | Die Legacy URL API ist veraltet. Verwenden Sie die WHATWG URL API. |
:::

::: info [Stable: 3 - Legacy]
[Stable: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Verwenden Sie stattdessen die WHATWG URL API.
:::

Das Legacy `urlObject` (`require('node:url').Url` oder `import { Url } from 'node:url'`) wird von der Funktion `url.parse()` erstellt und zurückgegeben.

#### `urlObject.auth` {#urlobjectauth}

Die `auth`-Eigenschaft ist der Benutzername- und Passwortteil der URL, auch als *userinfo* bezeichnet. Diese String-Teilmenge folgt dem `protocol` und den doppelten Schrägstrichen (falls vorhanden) und geht der `host`-Komponente voraus, die durch `@` begrenzt wird. Die Zeichenkette ist entweder der Benutzername oder der Benutzername und das Passwort, getrennt durch `:`.

Zum Beispiel: `'user:pass'`.

#### `urlObject.hash` {#urlobjecthash}

Die `hash`-Eigenschaft ist der Fragmentbezeichnerteil der URL, einschließlich des führenden `#`-Zeichens.

Zum Beispiel: `'#hash'`.

#### `urlObject.host` {#urlobjecthost}

Die `host`-Eigenschaft ist der vollständige, kleingeschriebene Host-Teil der URL, einschließlich des `port`, falls angegeben.

Zum Beispiel: `'sub.example.com:8080'`.

#### `urlObject.hostname` {#urlobjecthostname}

Die `hostname`-Eigenschaft ist der kleingeschriebene Hostname-Teil der `host`-Komponente *ohne* den enthaltenen `port`.

Zum Beispiel: `'sub.example.com'`.

#### `urlObject.href` {#urlobjecthref}

Die `href`-Eigenschaft ist die vollständige URL-Zeichenkette, die analysiert wurde, wobei sowohl die `protocol`- als auch die `host`-Komponente in Kleinbuchstaben umgewandelt wurden.

Zum Beispiel: `'http://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`.


#### `urlObject.path` {#urlobjectpath}

Die Eigenschaft `path` ist eine Verkettung der Komponenten `pathname` und `search`.

Zum Beispiel: `'/p/a/t/h?query=string'`.

Es wird keine Dekodierung des `path` durchgeführt.

#### `urlObject.pathname` {#urlobjectpathname}

Die Eigenschaft `pathname` besteht aus dem gesamten Pfadabschnitt der URL. Dies ist alles, was auf den `host` (einschließlich des `port`) folgt und vor dem Beginn der `query`- oder `hash`-Komponenten liegt, die entweder durch das ASCII-Fragezeichen (`?`) oder das Hash-Zeichen (`#`) begrenzt werden.

Zum Beispiel: `'/p/a/t/h'`.

Es wird keine Dekodierung der Pfadzeichenkette durchgeführt.

#### `urlObject.port` {#urlobjectport}

Die Eigenschaft `port` ist der numerische Port-Abschnitt der `host`-Komponente.

Zum Beispiel: `'8080'`.

#### `urlObject.protocol` {#urlobjectprotocol}

Die Eigenschaft `protocol` identifiziert das kleingeschriebene Protokollschema der URL.

Zum Beispiel: `'http:'`.

#### `urlObject.query` {#urlobjectquery}

Die Eigenschaft `query` ist entweder die Abfragezeichenkette ohne das führende ASCII-Fragezeichen (`?`) oder ein Objekt, das von der `parse()`-Methode des [`querystring`](/de/nodejs/api/querystring)-Moduls zurückgegeben wird. Ob die Eigenschaft `query` eine Zeichenkette oder ein Objekt ist, wird durch das Argument `parseQueryString` bestimmt, das an `url.parse()` übergeben wird.

Zum Beispiel: `'query=string'` oder `{'query': 'string'}`.

Wenn als Zeichenkette zurückgegeben, wird keine Dekodierung der Abfragezeichenkette durchgeführt. Wenn als Objekt zurückgegeben, werden sowohl Schlüssel als auch Werte dekodiert.

#### `urlObject.search` {#urlobjectsearch}

Die Eigenschaft `search` besteht aus dem gesamten "Query-String"-Abschnitt der URL, einschließlich des führenden ASCII-Fragezeichens (`?`).

Zum Beispiel: `'?query=string'`.

Es wird keine Dekodierung der Abfragezeichenkette durchgeführt.

#### `urlObject.slashes` {#urlobjectslashes}

Die Eigenschaft `slashes` ist ein `boolean`-Wert, der `true` ist, wenn nach dem Doppelpunkt im `protocol` zwei ASCII-Schrägstriche (`/`) erforderlich sind.

### `url.format(urlObject)` {#urlformaturlobject}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.0.0 | Wirft jetzt eine `ERR_INVALID_URL`-Ausnahme, wenn die Punycode-Konvertierung eines Hostnamens Änderungen einführt, die dazu führen könnten, dass die URL unterschiedlich neu geparst wird. |
| v15.13.0, v14.17.0 | Veralterung widerrufen. Status auf "Legacy" geändert. |
| v11.0.0 | Die Legacy-URL-API ist veraltet. Verwenden Sie die WHATWG-URL-API. |
| v7.0.0 | URLs mit einem `file:`-Schema verwenden jetzt immer die richtige Anzahl von Schrägstrichen, unabhängig von der Option `slashes`. Eine falsche `slashes`-Option ohne Protokoll wird jetzt auch jederzeit berücksichtigt. |
| v0.1.25 | Hinzugefügt in: v0.1.25 |
:::

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Verwenden Sie stattdessen die WHATWG-URL-API.
:::

- `urlObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein URL-Objekt (wie von `url.parse()` zurückgegeben oder anderweitig konstruiert). Wenn es sich um eine Zeichenkette handelt, wird es durch Übergabe an `url.parse()` in ein Objekt konvertiert.

Die Methode `url.format()` gibt eine formatierte URL-Zeichenkette zurück, die von `urlObject` abgeleitet ist.

```js [ESM]
const url = require('node:url');
url.format({
  protocol: 'https',
  hostname: 'example.com',
  pathname: '/some/path',
  query: {
    page: 1,
    format: 'json',
  },
});

// => 'https://example.com/some/path?page=1&format=json'
```
Wenn `urlObject` kein Objekt oder eine Zeichenkette ist, wirft `url.format()` einen [`TypeError`](/de/nodejs/api/errors#class-typeerror).

Der Formatierungsprozess funktioniert wie folgt:

- Es wird eine neue leere Zeichenkette `result` erstellt.
- Wenn `urlObject.protocol` eine Zeichenkette ist, wird sie unverändert an `result` angehängt.
- Andernfalls wird, wenn `urlObject.protocol` nicht `undefined` und keine Zeichenkette ist, ein [`Error`](/de/nodejs/api/errors#class-error) ausgelöst.
- Für alle Zeichenkettenwerte von `urlObject.protocol`, die *nicht* mit einem ASCII-Doppelpunkt-Zeichen (`:`) *enden*, wird die Literalzeichenkette `:` an `result` angehängt.
- Wenn eine der folgenden Bedingungen zutrifft, wird die Literalzeichenkette `//` an `result` angehängt:
    - Die Eigenschaft `urlObject.slashes` ist `true`;
    - `urlObject.protocol` beginnt mit `http`, `https`, `ftp`, `gopher` oder `file`;


- Wenn der Wert der Eigenschaft `urlObject.auth` truthy ist und entweder `urlObject.host` oder `urlObject.hostname` nicht `undefined` sind, wird der Wert von `urlObject.auth` in eine Zeichenkette umgewandelt und an `result` angehängt, gefolgt von der Literalzeichenkette `@`.
- Wenn die Eigenschaft `urlObject.host` `undefined` ist, dann:
    - Wenn `urlObject.hostname` eine Zeichenkette ist, wird sie an `result` angehängt.
    - Andernfalls wird, wenn `urlObject.hostname` nicht `undefined` und keine Zeichenkette ist, ein [`Error`](/de/nodejs/api/errors#class-error) ausgelöst.
    - Wenn der Eigenschaftswert `urlObject.port` truthy ist und `urlObject.hostname` nicht `undefined` ist:
    - Wird die Literalzeichenkette `:` an `result` angehängt, und
    - Der Wert von `urlObject.port` wird in eine Zeichenkette umgewandelt und an `result` angehängt.




- Andernfalls wird, wenn der Eigenschaftswert `urlObject.host` truthy ist, der Wert von `urlObject.host` in eine Zeichenkette umgewandelt und an `result` angehängt.
- Wenn die Eigenschaft `urlObject.pathname` eine Zeichenkette ist, die keine leere Zeichenkette ist:
    - Wenn `urlObject.pathname` *nicht* mit einem ASCII-Schrägstrich (`/`) *beginnt*, wird die Literalzeichenkette `'/'` an `result` angehängt.
    - Der Wert von `urlObject.pathname` wird an `result` angehängt.


- Andernfalls wird, wenn `urlObject.pathname` nicht `undefined` und keine Zeichenkette ist, ein [`Error`](/de/nodejs/api/errors#class-error) ausgelöst.
- Wenn die Eigenschaft `urlObject.search` `undefined` ist und wenn die Eigenschaft `urlObject.query` ein `Object` ist, wird die Literalzeichenkette `?` an `result` angehängt, gefolgt von der Ausgabe des Aufrufs der `stringify()`-Methode des [`querystring`](/de/nodejs/api/querystring)-Moduls, die den Wert von `urlObject.query` übergibt.
- Andernfalls, wenn `urlObject.search` eine Zeichenkette ist:
    - Wenn der Wert von `urlObject.search` *nicht* mit dem ASCII-Fragezeichen (`?`) *beginnt*, wird die Literalzeichenkette `?` an `result` angehängt.
    - Der Wert von `urlObject.search` wird an `result` angehängt.


- Andernfalls wird, wenn `urlObject.search` nicht `undefined` und keine Zeichenkette ist, ein [`Error`](/de/nodejs/api/errors#class-error) ausgelöst.
- Wenn die Eigenschaft `urlObject.hash` eine Zeichenkette ist:
    - Wenn der Wert von `urlObject.hash` *nicht* mit dem ASCII-Hash-Zeichen (`#`) *beginnt*, wird die Literalzeichenkette `#` an `result` angehängt.
    - Der Wert von `urlObject.hash` wird an `result` angehängt.


- Andernfalls wird, wenn die Eigenschaft `urlObject.hash` nicht `undefined` und keine Zeichenkette ist, ein [`Error`](/de/nodejs/api/errors#class-error) ausgelöst.
- `result` wird zurückgegeben.


### `url.parse(urlString[, parseQueryString[, slashesDenoteHost]])` {#urlparseurlstring-parsequerystring-slashesdenotehost}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0, v18.13.0 | Nur Dokumentations-Veraltung. |
| v15.13.0, v14.17.0 | Veraltung widerrufen. Status geändert zu "Legacy". |
| v11.14.0 | Die `pathname`-Eigenschaft des zurückgegebenen URL-Objekts ist jetzt `/`, wenn kein Pfad vorhanden ist und das Protokollschema `ws:` oder `wss:` ist. |
| v11.0.0 | Die Legacy-URL-API ist veraltet. Verwenden Sie die WHATWG-URL-API. |
| v9.0.0 | Die `search`-Eigenschaft des zurückgegebenen URL-Objekts ist jetzt `null`, wenn keine Abfragezeichenfolge vorhanden ist. |
| v0.1.25 | Hinzugefügt in: v0.1.25 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen die WHATWG-URL-API.
:::

- `urlString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die zu parsende URL-Zeichenfolge.
- `parseQueryString` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird die `query`-Eigenschaft immer auf ein Objekt gesetzt, das von der `parse()`-Methode des [`querystring`](/de/nodejs/api/querystring)-Moduls zurückgegeben wird. Wenn `false`, ist die `query`-Eigenschaft des zurückgegebenen URL-Objekts eine nicht geparste, nicht dekodierte Zeichenfolge. **Standard:** `false`.
- `slashesDenoteHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird das erste Token nach der Literalzeichenfolge `//` und vor dem nächsten `/` als der `host` interpretiert. Zum Beispiel würde bei `//foo/bar` das Ergebnis `{host: 'foo', pathname: '/bar'}` anstatt `{pathname: '//foo/bar'}` sein. **Standard:** `false`.

Die `url.parse()`-Methode nimmt eine URL-Zeichenfolge entgegen, parst sie und gibt ein URL-Objekt zurück.

Ein `TypeError` wird ausgelöst, wenn `urlString` keine Zeichenfolge ist.

Ein `URIError` wird ausgelöst, wenn die `auth`-Eigenschaft vorhanden ist, aber nicht dekodiert werden kann.

`url.parse()` verwendet einen nachsichtigen, nicht standardmäßigen Algorithmus zum Parsen von URL-Zeichenfolgen. Es ist anfällig für Sicherheitsprobleme wie [Hostnamen-Spoofing](https://hackerone.com/reports/678487) und falsche Behandlung von Benutzernamen und Passwörtern. Verwenden Sie es nicht mit nicht vertrauenswürdigen Eingaben. Für `url.parse()`-Schwachstellen werden keine CVEs ausgestellt. Verwenden Sie stattdessen die [WHATWG-URL](/de/nodejs/api/url#the-whatwg-url-api)-API.


### `url.resolve(from, to)` {#urlresolvefrom-to}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.13.0, v14.17.0 | Veraltung aufgehoben. Status geändert zu "Legacy". |
| v11.0.0 | Die Legacy URL API ist veraltet. Verwenden Sie die WHATWG URL API. |
| v6.6.0 | Die `auth`-Felder bleiben nun intakt, wenn `from` und `to` sich auf denselben Host beziehen. |
| v6.0.0 | Die `auth`-Felder werden nun gelöscht, wenn der Parameter `to` einen Hostnamen enthält. |
| v6.5.0, v4.6.2 | Das `port`-Feld wird nun korrekt kopiert. |
| v0.1.25 | Hinzugefügt in: v0.1.25 |
:::

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Verwenden Sie stattdessen die WHATWG URL API.
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Basis-URL, die verwendet werden soll, wenn `to` eine relative URL ist.
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Ziel-URL, die aufgelöst werden soll.

Die `url.resolve()`-Methode löst eine Ziel-URL relativ zu einer Basis-URL auf, ähnlich wie ein Webbrowser ein Anker-Tag auflöst.

```js [ESM]
const url = require('node:url');
url.resolve('/one/two/three', 'four');         // '/one/two/four'
url.resolve('http://example.com/', '/one');    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
Um das gleiche Ergebnis mit der WHATWG URL API zu erzielen:

```js [ESM]
function resolve(from, to) {
  const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
  if (resolvedUrl.protocol === 'resolve:') {
    // `from` ist eine relative URL.
    const { pathname, search, hash } = resolvedUrl;
    return pathname + search + hash;
  }
  return resolvedUrl.toString();
}

resolve('/one/two/three', 'four');         // '/one/two/four'
resolve('http://example.com/', '/one');    // 'http://example.com/one'
resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
## Prozentkodierung in URLs {#percent-encoding-in-urls}

URLs dürfen nur einen bestimmten Bereich von Zeichen enthalten. Jedes Zeichen, das außerhalb dieses Bereichs liegt, muss kodiert werden. Wie solche Zeichen kodiert werden und welche Zeichen zu kodieren sind, hängt vollständig davon ab, wo sich das Zeichen innerhalb der Struktur der URL befindet.


### Legacy-API {#legacy-api}

Innerhalb der Legacy-API werden Leerzeichen (`' '`) und die folgenden Zeichen automatisch in den Eigenschaften von URL-Objekten maskiert:

```text [TEXT]
< > " ` \r \n \t { } | \ ^ '
```
Beispielsweise wird das ASCII-Leerzeichen (`' '`) als `%20` kodiert. Der ASCII-Schrägstrich (`/`) wird als `%3C` kodiert.

### WHATWG-API {#whatwg-api}

Der [WHATWG URL Standard](https://url.spec.whatwg.org/) verwendet einen selektiveren und feiner abgestuften Ansatz zur Auswahl kodierter Zeichen als die Legacy-API.

Der WHATWG-Algorithmus definiert vier "Prozentkodierungs-Sets", die Bereiche von Zeichen beschreiben, die prozentkodiert werden müssen:

-  Das *C0-Steuerzeichen-Prozentkodierungs-Set* enthält Codepunkte im Bereich U+0000 bis U+001F (einschließlich) und alle Codepunkte größer als U+007E (~).
-  Das *Fragment-Prozentkodierungs-Set* enthält das *C0-Steuerzeichen-Prozentkodierungs-Set* und die Codepunkte U+0020 SPACE, U+0022 ("), U+003C (\<), U+003E (\>) und U+0060 (`).
-  Das *Pfad-Prozentkodierungs-Set* enthält das *C0-Steuerzeichen-Prozentkodierungs-Set* und die Codepunkte U+0020 SPACE, U+0022 ("), U+0023 (#), U+003C (\<), U+003E (\>), U+003F (?), U+0060 (`), U+007B ({) und U+007D (}).
-  Das *Userinfo-Kodierungs-Set* enthält das *Pfad-Prozentkodierungs-Set* und die Codepunkte U+002F (/), U+003A (:), U+003B (;), U+003D (=), U+0040 (@), U+005B ([) bis U+005E(^) und U+007C (|).

Das *Userinfo-Prozentkodierungs-Set* wird ausschließlich für Benutzernamen und Passwörter verwendet, die innerhalb der URL kodiert sind. Das *Pfad-Prozentkodierungs-Set* wird für den Pfad der meisten URLs verwendet. Das *Fragment-Prozentkodierungs-Set* wird für URL-Fragmente verwendet. Das *C0-Steuerzeichen-Prozentkodierungs-Set* wird zusätzlich zu allen anderen Fällen unter bestimmten spezifischen Bedingungen für Host und Pfad verwendet.

Wenn Nicht-ASCII-Zeichen in einem Hostnamen vorkommen, wird der Hostname mit dem [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4)-Algorithmus kodiert. Beachten Sie jedoch, dass ein Hostname *sowohl* Punycode-kodierte *als auch* prozentkodierte Zeichen enthalten *kann*:

```js [ESM]
const myURL = new URL('https://%CF%80.example.com/foo');
console.log(myURL.href);
// Gibt https://xn--1xa.example.com/foo aus
console.log(myURL.origin);
// Gibt https://xn--1xa.example.com aus
```

