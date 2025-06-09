---
title: Node.js Dokumentation - Internationalisierung
description: Dieser Abschnitt der Node.js-Dokumentation behandelt das Internationalisierungsmodul (Intl), das Zugriff auf verschiedene Internationalisierungs- und Lokalisierungsfunktionen bietet, einschließlich Sortierung, Zahlenformatierung, Datum- und Zeitformatierung und mehr.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Internationalisierung | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Dieser Abschnitt der Node.js-Dokumentation behandelt das Internationalisierungsmodul (Intl), das Zugriff auf verschiedene Internationalisierungs- und Lokalisierungsfunktionen bietet, einschließlich Sortierung, Zahlenformatierung, Datum- und Zeitformatierung und mehr.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Internationalisierung | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Dieser Abschnitt der Node.js-Dokumentation behandelt das Internationalisierungsmodul (Intl), das Zugriff auf verschiedene Internationalisierungs- und Lokalisierungsfunktionen bietet, einschließlich Sortierung, Zahlenformatierung, Datum- und Zeitformatierung und mehr.
---


# Unterstützung für Internationalisierung {#internationalization-support}

Node.js verfügt über viele Funktionen, die das Schreiben internationalisierter Programme erleichtern. Einige davon sind:

- Gebietsschema-sensitive oder Unicode-fähige Funktionen in der [ECMAScript Language Specification](https://tc39.github.io/ecma262/):
    - [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
    - [`String.prototype.toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
    - [`String.prototype.toUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)


- Alle Funktionen, die in der [ECMAScript Internationalization API Specification](https://tc39.github.io/ecma402/) (aka ECMA-402) beschrieben sind:
    - [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) Objekt
    - Gebietsschema-sensitive Methoden wie [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) und [`Date.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)


- Der [WHATWG URL Parser](/de/nodejs/api/url#the-whatwg-url-api) unterstützt [internationalisierte Domainnamen](https://en.wikipedia.org/wiki/Internationalized_domain_name) (IDNs)
- [`require('node:buffer').transcode()`](/de/nodejs/api/buffer#buffertranscodesource-fromenc-toenc)
- Genauere [REPL](/de/nodejs/api/repl#repl) Zeilenbearbeitung
- [`require('node:util').TextDecoder`](/de/nodejs/api/util#class-utiltextdecoder)
- [`RegExp` Unicode Property Escapes](https://github.com/tc39/proposal-regexp-unicode-property-escapes)

Node.js und die zugrunde liegende V8-Engine verwenden [International Components for Unicode (ICU)](http://site.icu-project.org/), um diese Funktionen in nativem C/C++-Code zu implementieren. Der vollständige ICU-Datensatz wird standardmäßig von Node.js bereitgestellt. Aufgrund der Größe der ICU-Datendatei werden jedoch mehrere Optionen zur Anpassung des ICU-Datensatzes entweder beim Erstellen oder Ausführen von Node.js bereitgestellt.


## Optionen zum Erstellen von Node.js {#options-for-building-nodejs}

Um zu steuern, wie ICU in Node.js verwendet wird, stehen während der Kompilierung vier `configure`-Optionen zur Verfügung. Weitere Informationen zum Kompilieren von Node.js sind in [BUILDING.md](https://github.com/nodejs/node/blob/HEAD/BUILDING.md) dokumentiert.

- `--with-intl=none`/`--without-intl`
- `--with-intl=system-icu`
- `--with-intl=small-icu`
- `--with-intl=full-icu` (Standard)

Eine Übersicht über die verfügbaren Node.js- und JavaScript-Funktionen für jede `configure`-Option:

| Funktion | `none` | `system-icu` | `small-icu` | `full-icu` |
| --- | --- | --- | --- | --- |
| [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) | keine (Funktion ist No-Op) | voll | voll | voll |
| `String.prototype.to*Case()` | voll | voll | voll | voll |
| [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) | keine (Objekt existiert nicht) | teilweise/voll (abhängig vom Betriebssystem) | teilweise (nur Englisch) | voll |
| [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) | teilweise (nicht lokalisiert) | voll | voll | voll |
| `String.prototype.toLocale*Case()` | teilweise (nicht lokalisiert) | voll | voll | voll |
| [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString) | teilweise (nicht lokalisiert) | teilweise/voll (abhängig vom Betriebssystem) | teilweise (nur Englisch) | voll |
| `Date.prototype.toLocale*String()` | teilweise (nicht lokalisiert) | teilweise/voll (abhängig vom Betriebssystem) | teilweise (nur Englisch) | voll |
| [Legacy URL Parser](/de/nodejs/api/url#legacy-url-api) | teilweise (keine IDN-Unterstützung) | voll | voll | voll |
| [WHATWG URL Parser](/de/nodejs/api/url#the-whatwg-url-api) | teilweise (keine IDN-Unterstützung) | voll | voll | voll |
| [`require('node:buffer').transcode()`](/de/nodejs/api/buffer#buffertranscodesource-fromenc-toenc) | keine (Funktion existiert nicht) | voll | voll | voll |
| [REPL](/de/nodejs/api/repl#repl) | teilweise (ungenaue Zeilenbearbeitung) | voll | voll | voll |
| [`require('node:util').TextDecoder`](/de/nodejs/api/util#class-utiltextdecoder) | teilweise (grundlegende Kodierungsunterstützung) | teilweise/voll (abhängig vom Betriebssystem) | teilweise (nur Unicode) | voll |
| [`RegExp` Unicode Property Escapes](https://github.com/tc39/proposal-regexp-unicode-property-escapes) | keine (ungültiger   `RegExp`   Fehler) | voll | voll | voll |
Die Bezeichnung "(nicht lokalisiert)" bedeutet, dass die Funktion ihre Operation genauso ausführt wie die Nicht-`Locale`-Version der Funktion, falls eine existiert. Zum Beispiel ist im `none`-Modus die Operation von `Date.prototype.toLocaleString()` identisch mit der von `Date.prototype.toString()`.


### Alle Internationalisierungsfunktionen deaktivieren (`none`) {#disable-all-internationalization-features-none}

Wenn diese Option gewählt wird, ist ICU deaktiviert und die meisten der oben genannten Internationalisierungsfunktionen sind in der resultierenden `node`-Binärdatei **nicht verfügbar**.

### Mit einer vorinstallierten ICU bauen (`system-icu`) {#build-with-a-pre-installed-icu-system-icu}

Node.js kann gegen eine bereits auf dem System installierte ICU-Version linken. Tatsächlich wird ICU bei den meisten Linux-Distributionen bereits mitgeliefert, und diese Option würde es ermöglichen, denselben Datensatz wiederzuverwenden, der von anderen Komponenten im Betriebssystem verwendet wird.

Funktionen, die nur die ICU-Bibliothek selbst benötigen, wie z. B. [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) und der [WHATWG URL-Parser](/de/nodejs/api/url#the-whatwg-url-api), werden unter `system-icu` vollständig unterstützt. Funktionen, die zusätzlich ICU-Gebietsdaten benötigen, wie z. B. [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat), *können* vollständig oder teilweise unterstützt werden, je nachdem, wie vollständig die auf dem System installierten ICU-Daten sind.

### Eine begrenzte Menge an ICU-Daten einbetten (`small-icu`) {#embed-a-limited-set-of-icu-data-small-icu}

Diese Option bewirkt, dass die resultierende Binärdatei statisch gegen die ICU-Bibliothek linkt und eine Teilmenge der ICU-Daten (in der Regel nur das englische Gebietsschema) in die `node`-Executable einbindet.

Funktionen, die nur die ICU-Bibliothek selbst benötigen, wie z. B. [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) und der [WHATWG URL-Parser](/de/nodejs/api/url#the-whatwg-url-api), werden unter `small-icu` vollständig unterstützt. Funktionen, die zusätzlich ICU-Gebietsdaten benötigen, wie z. B. [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat), funktionieren im Allgemeinen nur mit dem englischen Gebietsschema:

```js [ESM]
const january = new Date(9e8);
const english = new Intl.DateTimeFormat('en', { month: 'long' });
const spanish = new Intl.DateTimeFormat('es', { month: 'long' });

console.log(english.format(january));
// Prints "January"
console.log(spanish.format(january));
// Gibt entweder "M01" oder "January" auf small-icu aus, abhängig vom Standardgebietsschema des Benutzers
// Sollte "enero" ausgeben
```
Dieser Modus bietet ein Gleichgewicht zwischen Funktionen und Binärdateigröße.


#### ICU-Daten zur Laufzeit bereitstellen {#providing-icu-data-at-runtime}

Wenn die Option `small-icu` verwendet wird, können dennoch zusätzliche Gebietsschema-Daten zur Laufzeit bereitgestellt werden, sodass die JS-Methoden für alle ICU-Gebietsschemas funktionieren. Angenommen, die Datendatei ist unter `/runtime/directory/with/dat/file` gespeichert, kann sie ICU entweder über:

- Die Konfigurationsoption `--with-icu-default-data-dir` zur Verfügung gestellt werden: Dies bettet nur den Standarddatenverzeichnispfad in die Binärdatei ein. Die eigentliche Datendatei wird zur Laufzeit aus diesem Verzeichnispfad geladen.
- Die Umgebungsvariable [`NODE_ICU_DATA`](/de/nodejs/api/cli#node_icu_datafile):
- Den CLI-Parameter [`--icu-data-dir`](/de/nodejs/api/cli#--icu-data-dirfile):

Wenn mehr als eine davon angegeben ist, hat der CLI-Parameter `--icu-data-dir` die höchste Priorität, dann die Umgebungsvariable `NODE_ICU_DATA` und dann die Konfigurationsoption `--with-icu-default-data-dir`.

ICU kann automatisch eine Vielzahl von Datenformaten finden und laden, aber die Daten müssen für die ICU-Version geeignet und die Datei korrekt benannt sein. Der gebräuchlichste Name für die Datendatei ist `icudtX[bl].dat`, wobei `X` die vorgesehene ICU-Version bezeichnet und `b` oder `l` die Endianness des Systems angibt. Node.js kann nicht geladen werden, wenn die erwartete Datendatei nicht aus dem angegebenen Verzeichnis gelesen werden kann. Der Name der Datendatei, die der aktuellen Node.js-Version entspricht, kann mit folgender Methode berechnet werden:

```js [ESM]
`icudt${process.versions.icu.split('.')[0]}${os.endianness()[0].toLowerCase()}.dat`;
```
Weitere unterstützte Formate und Details zu ICU-Daten im Allgemeinen finden Sie im Artikel ["ICU Data"](http://userguide.icu-project.org/icudata) im ICU-Benutzerhandbuch.

Das [full-icu](https://www.npmjs.com/package/full-icu) npm-Modul kann die ICU-Dateninstallation erheblich vereinfachen, indem es die ICU-Version der laufenden `node`-Executable erkennt und die entsprechende Datendatei herunterlädt. Nach der Installation des Moduls über `npm i full-icu` ist die Datendatei unter `./node_modules/full-icu` verfügbar. Dieser Pfad kann dann entweder an `NODE_ICU_DATA` oder `--icu-data-dir` übergeben werden, wie oben gezeigt, um die vollständige `Intl`-Unterstützung zu aktivieren.


### Die gesamte ICU einbetten (`full-icu`) {#embed-the-entire-icu-full-icu}

Diese Option bewirkt, dass die resultierende Binärdatei statisch mit ICU verknüpft wird und einen vollständigen Satz von ICU-Daten enthält. Eine auf diese Weise erstellte Binärdatei hat keine weiteren externen Abhängigkeiten und unterstützt alle Gebietsschemas, kann aber recht groß sein. Dies ist das Standardverhalten, wenn kein `--with-intl` Flag übergeben wird. Die offiziellen Binärdateien werden ebenfalls in diesem Modus erstellt.

## Erkennen der Internationalisierungsunterstützung {#detecting-internationalization-support}

Um zu überprüfen, ob ICU überhaupt aktiviert ist (`system-icu`, `small-icu` oder `full-icu`), sollte es ausreichen, einfach die Existenz von `Intl` zu überprüfen:

```js [ESM]
const hasICU = typeof Intl === 'object';
```
Alternativ funktioniert auch die Überprüfung auf `process.versions.icu`, eine Eigenschaft, die nur definiert ist, wenn ICU aktiviert ist:

```js [ESM]
const hasICU = typeof process.versions.icu === 'string';
```
Um die Unterstützung für ein nicht-englisches Gebietsschema zu überprüfen (d.h. `full-icu` oder `system-icu`), kann [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) ein gutes Unterscheidungsmerkmal sein:

```js [ESM]
const hasFullICU = (() => {
  try {
    const january = new Date(9e8);
    const spanish = new Intl.DateTimeFormat('es', { month: 'long' });
    return spanish.format(january) === 'enero';
  } catch (err) {
    return false;
  }
})();
```
Für ausführlichere Tests zur `Intl`-Unterstützung können die folgenden Ressourcen hilfreich sein:

- [btest402](https://github.com/srl295/btest402): Wird im Allgemeinen verwendet, um zu überprüfen, ob Node.js mit `Intl`-Unterstützung korrekt erstellt wurde.
- [Test262](https://github.com/tc39/test262/tree/HEAD/test/intl402): Die offizielle Konformitätstestsuite von ECMAScript enthält einen Abschnitt, der ECMA-402 gewidmet ist.

