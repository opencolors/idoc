---
title: Node.js Dokumentation - Module
description: Erkunden Sie die Node.js Dokumentation zu Modulen, einschließlich CommonJS, ES-Module und wie man Abhängigkeiten und Modulauflösung verwaltet.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Module | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erkunden Sie die Node.js Dokumentation zu Modulen, einschließlich CommonJS, ES-Module und wie man Abhängigkeiten und Modulauflösung verwaltet.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Module | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erkunden Sie die Node.js Dokumentation zu Modulen, einschließlich CommonJS, ES-Module und wie man Abhängigkeiten und Modulauflösung verwaltet.
---


# Module: CommonJS-Module {#modules-commonjs-modules}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

CommonJS-Module sind die ursprüngliche Methode zur Paketierung von JavaScript-Code für Node.js. Node.js unterstützt auch den [ECMAScript-Module](/de/nodejs/api/esm)-Standard, der von Browsern und anderen JavaScript-Laufzeitumgebungen verwendet wird.

In Node.js wird jede Datei als separates Modul behandelt. Betrachten Sie beispielsweise eine Datei namens `foo.js`:

```js [ESM]
const circle = require('./circle.js');
console.log(`Die Fläche eines Kreises mit Radius 4 beträgt ${circle.area(4)}`);
```
In der ersten Zeile lädt `foo.js` das Modul `circle.js`, das sich im selben Verzeichnis wie `foo.js` befindet.

Hier ist der Inhalt von `circle.js`:

```js [ESM]
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```
Das Modul `circle.js` hat die Funktionen `area()` und `circumference()` exportiert. Funktionen und Objekte werden dem Stamm eines Moduls hinzugefügt, indem zusätzliche Eigenschaften für das spezielle `exports`-Objekt angegeben werden.

Variablen, die lokal zum Modul sind, sind privat, da das Modul von Node.js in eine Funktion eingeschlossen wird (siehe [Modulumhüllung](/de/nodejs/api/modules#the-module-wrapper)). In diesem Beispiel ist die Variable `PI` für `circle.js` privat.

Der Eigenschaft `module.exports` kann ein neuer Wert zugewiesen werden (z. B. eine Funktion oder ein Objekt).

Im folgenden Code verwendet `bar.js` das `square`-Modul, das eine Square-Klasse exportiert:

```js [ESM]
const Square = require('./square.js');
const mySquare = new Square(2);
console.log(`Die Fläche von mySquare beträgt ${mySquare.area()}`);
```
Das `square`-Modul ist in `square.js` definiert:

```js [ESM]
// Die Zuweisung zu exports ändert das Modul nicht, es muss module.exports verwendet werden
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
```
Das CommonJS-Modulsystem ist im [`module`-Kernmodul](/de/nodejs/api/module) implementiert.

## Aktivierung {#enabling}

Node.js verfügt über zwei Modulsysteme: CommonJS-Module und [ECMAScript-Module](/de/nodejs/api/esm).

Standardmäßig behandelt Node.js Folgendes als CommonJS-Module:

- Dateien mit der Erweiterung `.cjs`;
- Dateien mit der Erweiterung `.js`, wenn die nächstgelegene übergeordnete `package.json`-Datei ein Feld der obersten Ebene [`"type"`](/de/nodejs/api/packages#type) mit dem Wert `"commonjs"` enthält.
- Dateien mit einer `.js`-Erweiterung oder ohne Erweiterung, wenn die nächstgelegene übergeordnete `package.json`-Datei kein Feld der obersten Ebene [`"type"`](/de/nodejs/api/packages#type) enthält oder keine `package.json` in einem übergeordneten Ordner vorhanden ist; es sei denn, die Datei enthält eine Syntax, die einen Fehler verursacht, wenn sie nicht als ES-Modul ausgewertet wird. Paketautoren sollten das Feld [`"type"`](/de/nodejs/api/packages#type) auch in Paketen einfügen, in denen alle Quellen CommonJS sind. Die explizite Angabe des `type` des Pakets erleichtert Build-Tools und Ladeprogrammen die Bestimmung, wie die Dateien im Paket interpretiert werden sollen.
- Dateien mit einer Erweiterung, die nicht `.mjs`, `.cjs`, `.json`, `.node` oder `.js` ist (wenn die nächstgelegene übergeordnete `package.json`-Datei ein Feld der obersten Ebene [`"type"`](/de/nodejs/api/packages#type) mit dem Wert `"module"` enthält, werden diese Dateien nur dann als CommonJS-Module erkannt, wenn sie über `require()` eingebunden werden, nicht, wenn sie als Befehlszeileneinstiegspunkt des Programms verwendet werden).

Weitere Informationen finden Sie unter [Bestimmung des Modulsystems](/de/nodejs/api/packages#determining-module-system).

Der Aufruf von `require()` verwendet immer den CommonJS-Modul-Loader. Der Aufruf von `import()` verwendet immer den ECMAScript-Modul-Loader.


## Zugriff auf das Hauptmodul {#accessing-the-main-module}

Wenn eine Datei direkt von Node.js aus ausgeführt wird, wird `require.main` auf ihr `module` gesetzt. Das bedeutet, dass es möglich ist zu bestimmen, ob eine Datei direkt ausgeführt wurde, indem man `require.main === module` testet.

Für eine Datei `foo.js` ist dies `true`, wenn sie über `node foo.js` ausgeführt wird, aber `false`, wenn sie von `require('./foo')` ausgeführt wird.

Wenn der Einstiegspunkt kein CommonJS-Modul ist, ist `require.main` `undefined`, und das Hauptmodul ist nicht erreichbar.

## Tipps für Paketmanager {#package-manager-tips}

Die Semantik der Node.js-Funktion `require()` wurde so allgemein konzipiert, dass sie vernünftige Verzeichnisstrukturen unterstützt. Paketmanager-Programme wie `dpkg`, `rpm` und `npm` werden hoffentlich in der Lage sein, native Pakete aus Node.js-Modulen ohne Änderungen zu erstellen.

Im Folgenden geben wir eine vorgeschlagene Verzeichnisstruktur, die funktionieren könnte:

Nehmen wir an, wir möchten den Ordner unter `/usr/lib/node/\<some-package\>/\<some-version\>` den Inhalt einer bestimmten Version eines Pakets enthalten lassen.

Pakete können voneinander abhängen. Um das Paket `foo` zu installieren, kann es erforderlich sein, eine bestimmte Version des Pakets `bar` zu installieren. Das `bar`-Paket kann selbst Abhängigkeiten haben, und in einigen Fällen können diese sogar kollidieren oder zyklische Abhängigkeiten bilden.

Da Node.js den `realpath` aller Module, die es lädt, nachschlägt (d. h. es löst Symlinks auf) und dann [nach ihren Abhängigkeiten in `node_modules`-Ordnern sucht](/de/nodejs/api/modules#loading-from-node_modules-folders), kann diese Situation mit der folgenden Architektur gelöst werden:

- `/usr/lib/node/foo/1.2.3/`: Inhalt des Pakets `foo`, Version 1.2.3.
- `/usr/lib/node/bar/4.3.2/`: Inhalt des Pakets `bar`, von dem `foo` abhängt.
- `/usr/lib/node/foo/1.2.3/node_modules/bar`: Symbolischer Link zu `/usr/lib/node/bar/4.3.2/`.
- `/usr/lib/node/bar/4.3.2/node_modules/*`: Symbolische Links zu den Paketen, von denen `bar` abhängt.

Selbst wenn also ein Zyklus auftritt oder es zu Abhängigkeitskonflikten kommt, kann jedes Modul eine Version seiner Abhängigkeit erhalten, die es verwenden kann.

Wenn der Code im Paket `foo` `require('bar')` ausführt, erhält er die Version, die in `/usr/lib/node/foo/1.2.3/node_modules/bar` verlinkt ist. Wenn dann der Code im Paket `bar` `require('quux')` aufruft, erhält er die Version, die in `/usr/lib/node/bar/4.3.2/node_modules/quux` verlinkt ist.

Um den Modulsuchprozess noch optimaler zu gestalten, könnten wir die Pakete nicht direkt in `/usr/lib/node` ablegen, sondern in `/usr/lib/node_modules/\<name\>/\<version\>`. Dann wird Node.js nicht versuchen, fehlende Abhängigkeiten in `/usr/node_modules` oder `/node_modules` zu finden.

Um Module für die Node.js REPL verfügbar zu machen, könnte es nützlich sein, den Ordner `/usr/lib/node_modules` auch der Umgebungsvariable `$NODE_PATH` hinzuzufügen. Da die Modulsuchen mit `node_modules`-Ordnern alle relativ sind und auf dem realen Pfad der Dateien basieren, die die Aufrufe von `require()` tätigen, können sich die Pakete selbst überall befinden.


## ECMAScript-Module mit `require()` laden {#loading-ecmascript-modules-using-require}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.5.0 | Diese Funktion gibt standardmäßig keine experimentelle Warnung mehr aus, obwohl die Warnung weiterhin durch --trace-require-module ausgegeben werden kann. |
| v23.0.0 | Diese Funktion befindet sich nicht mehr hinter dem CLI-Flag `--experimental-require-module`. |
| v23.0.0 | Unterstützung für den Interop-Export `'module.exports'` in `require(esm)`. |
| v22.0.0, v20.17.0 | Hinzugefügt in: v22.0.0, v20.17.0 |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).2 - Release Candidate
:::

Die `.mjs`-Erweiterung ist für [ECMAScript-Module](/de/nodejs/api/esm) reserviert. Weitere Informationen darüber, welche Dateien als ECMAScript-Module geparst werden, finden Sie im Abschnitt [Bestimmen des Modulsystems](/de/nodejs/api/packages#determining-module-system).

`require()` unterstützt nur das Laden von ECMAScript-Modulen, die die folgenden Anforderungen erfüllen:

- Das Modul ist vollständig synchron (enthält kein `await` auf oberster Ebene); und
- Eine dieser Bedingungen ist erfüllt:

Wenn das geladene ES-Modul die Anforderungen erfüllt, kann `require()` es laden und das Modul-Namespace-Objekt zurückgeben. In diesem Fall ähnelt es dem dynamischen `import()`, wird aber synchron ausgeführt und gibt das Namespace-Objekt direkt zurück.

Mit den folgenden ES-Modulen:

```js [ESM]
// distance.mjs
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
```
```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}
```
Ein CommonJS-Modul kann sie mit `require()` laden:

```js [CJS]
const distance = require('./distance.mjs');
console.log(distance);
// [Module: null prototype] {
//   distance: [Function: distance]
// }

const point = require('./point.mjs');
console.log(point);
// [Module: null prototype] {
//   default: [class Point],
//   __esModule: true,
// }
```
Zur Interoperabilität mit vorhandenen Tools, die ES-Module in CommonJS konvertieren, das dann echte ES-Module über `require()` laden könnte, würde der zurückgegebene Namespace eine `__esModule: true`-Eigenschaft enthalten, wenn er einen `default`-Export hat, sodass verbrauchender Code, der von Tools generiert wurde, die Standardexporte in echten ES-Modulen erkennen kann. Wenn der Namespace bereits `__esModule` definiert, wird dies nicht hinzugefügt. Diese Eigenschaft ist experimentell und kann sich in Zukunft ändern. Sie sollte nur von Tools verwendet werden, die ES-Module in CommonJS-Module konvertieren und dabei die bestehenden Ökosystemkonventionen befolgen. Code, der direkt in CommonJS geschrieben wurde, sollte es vermeiden, davon abhängig zu sein.

Wenn ein ES-Modul sowohl benannte Exporte als auch einen Standardexport enthält, ist das von `require()` zurückgegebene Ergebnis das Modul-Namespace-Objekt, das den Standardexport in der Eigenschaft `.default` platziert, ähnlich den von `import()` zurückgegebenen Ergebnissen. Um anzupassen, was direkt von `require(esm)` zurückgegeben werden soll, kann das ES-Modul den gewünschten Wert mit dem String-Namen `"module.exports"` exportieren.

```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}

// `distance` geht für CommonJS-Konsumenten dieses Moduls verloren, es sei denn, es wird
// als statische Eigenschaft zu `Point` hinzugefügt.
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

// Benannte Exporte gehen verloren, wenn 'module.exports' verwendet wird
const { distance } = require('./point.mjs');
console.log(distance); // undefined
```
Beachten Sie im obigen Beispiel, dass bei Verwendung des Exportnamens `module.exports` benannte Exporte für CommonJS-Konsumenten verloren gehen. Damit CommonJS-Konsumenten weiterhin auf benannte Exporte zugreifen können, kann das Modul sicherstellen, dass der Standardexport ein Objekt ist, an das die benannten Exporte als Eigenschaften angehängt sind. Im obigen Beispiel kann beispielsweise `distance` an den Standardexport, die `Point`-Klasse, als statische Methode angehängt werden.

```js [ESM]
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }

export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  static distance = distance;
}

export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

const { distance } = require('./point.mjs');
console.log(distance); // [Function: distance]
```
Wenn das Modul, das mit `require()` geladen wird, `await` auf oberster Ebene enthält oder der Modulgraf, den es `import`iert, `await` auf oberster Ebene enthält, wird [`ERR_REQUIRE_ASYNC_MODULE`](/de/nodejs/api/errors#err_require_async_module) ausgelöst. In diesem Fall sollten Benutzer das asynchrone Modul mit [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) laden.

Wenn `--experimental-print-required-tla` aktiviert ist, wertet Node.js das Modul aus, anstatt vor der Auswertung `ERR_REQUIRE_ASYNC_MODULE` auszulösen, versucht, die Awaits der obersten Ebene zu finden, und gibt deren Speicherort aus, um Benutzern bei der Behebung zu helfen.

Die Unterstützung für das Laden von ES-Modulen mit `require()` ist derzeit experimentell und kann mit `--no-experimental-require-module` deaktiviert werden. Um auszugeben, wo diese Funktion verwendet wird, verwenden Sie [`--trace-require-module`](/de/nodejs/api/cli#--trace-require-modulemode).

Diese Funktion kann erkannt werden, indem geprüft wird, ob [`process.features.require_module`](/de/nodejs/api/process#processfeaturesrequire_module) `true` ist.


## Alles zusammen {#all-together}

Um den exakten Dateinamen zu erhalten, der geladen wird, wenn `require()` aufgerufen wird, verwende die Funktion `require.resolve()`.

Fasst man alles oben Genannte zusammen, so ergibt sich der folgende High-Level-Algorithmus in Pseudocode, was `require()` tut:

```text [TEXT]
require(X) von Modul am Pfad Y
1. Wenn X ein Kernmodul ist,
   a. gib das Kernmodul zurück
   b. STOP
2. Wenn X mit '/' beginnt
   a. setze Y auf das Dateisystem-Root
3. Wenn X mit './' oder '/' oder '../' beginnt
   a. LADE_ALS_DATEI(Y + X)
   b. LADE_ALS_VERZEICHNIS(Y + X)
   c. WERFE "nicht gefunden"
4. Wenn X mit '#' beginnt
   a. LADE_PACKAGE_IMPORTS(X, dirname(Y))
5. LADE_PACKAGE_SELF(X, dirname(Y))
6. LADE_NODE_MODULES(X, dirname(Y))
7. WERFE "nicht gefunden"

VIELLEICHT_ERKENNEN_UND_LADEN(X)
1. Wenn X als CommonJS-Modul interpretiert werden kann, lade X als CommonJS-Modul. STOP.
2. Andernfalls, wenn der Quellcode von X als ECMAScript-Modul mit
  <a href="esm.md#resolver-algorithm-specification">DETECT_MODULE_SYNTAX wie in der
  ESM-Resolver-Spezifikation definiert</a> interpretiert werden kann,
  a. Lade X als ECMAScript-Modul. STOP.
3. WERFE den SyntaxError vom Versuch, X als CommonJS in 1 zu interpretieren. STOP.

LADE_ALS_DATEI(X)
1. Wenn X eine Datei ist, lade X als sein Dateierweiterungsformat. STOP
2. Wenn X.js eine Datei ist,
    a. Finde den nächstgelegenen Package-Scope SCOPE zu X.
    b. Wenn kein Scope gefunden wurde
      1. VIELLEICHT_ERKENNEN_UND_LADEN(X.js)
    c. Wenn der SCOPE/package.json das Feld "type" enthält,
      1. Wenn das Feld "type" "module" ist, lade X.js als ein ECMAScript-Modul. STOP.
      2. Wenn das Feld "type" "commonjs" ist, lade X.js als ein CommonJS-Modul. STOP.
    d. VIELLEICHT_ERKENNEN_UND_LADEN(X.js)
3. Wenn X.json eine Datei ist, lade X.json in ein JavaScript-Objekt. STOP
4. Wenn X.node eine Datei ist, lade X.node als binäres Addon. STOP

LADE_INDEX(X)
1. Wenn X/index.js eine Datei ist
    a. Finde den nächstgelegenen Package-Scope SCOPE zu X.
    b. Wenn kein Scope gefunden wurde, lade X/index.js als ein CommonJS-Modul. STOP.
    c. Wenn der SCOPE/package.json das Feld "type" enthält,
      1. Wenn das Feld "type" "module" ist, lade X/index.js als ein ECMAScript-Modul. STOP.
      2. Andernfalls, lade X/index.js als ein CommonJS-Modul. STOP.
2. Wenn X/index.json eine Datei ist, parse X/index.json in ein JavaScript-Objekt. STOP
3. Wenn X/index.node eine Datei ist, lade X/index.node als binäres Addon. STOP

LADE_ALS_VERZEICHNIS(X)
1. Wenn X/package.json eine Datei ist,
   a. Parse X/package.json, und suche nach dem Feld "main".
   b. Wenn "main" ein falsy-Wert ist, gehe zu 2.
   c. sei M = X + (json main Feld)
   d. LADE_ALS_DATEI(M)
   e. LADE_INDEX(M)
   f. LADE_INDEX(X) VERALTET
   g. WERFE "nicht gefunden"
2. LADE_INDEX(X)

LADE_NODE_MODULES(X, START)
1. sei DIRS = NODE_MODULES_PATHS(START)
2. für jedes DIR in DIRS:
   a. LADE_PACKAGE_EXPORTS(X, DIR)
   b. LADE_ALS_DATEI(DIR/X)
   c. LADE_ALS_VERZEICHNIS(DIR/X)

NODE_MODULES_PATHS(START)
1. sei PARTS = path split(START)
2. sei I = Anzahl der PARTS - 1
3. sei DIRS = []
4. solange I >= 0,
   a. wenn PARTS[I] = "node_modules", gehe zu d.
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIR + DIRS
   d. sei I = I - 1
5. gib DIRS + GLOBAL_FOLDERS zurück

LADE_PACKAGE_IMPORTS(X, DIR)
1. Finde den nächstgelegenen Package-Scope SCOPE zu DIR.
2. Wenn kein Scope gefunden wurde, gib zurück.
3. Wenn der SCOPE/package.json "imports" null oder undefiniert ist, gib zurück.
4. Wenn `--experimental-require-module` aktiviert ist
  a. sei CONDITIONS = ["node", "require", "module-sync"]
  b. Andernfalls, sei CONDITIONS = ["node", "require"]
5. sei MATCH = PACKAGE_IMPORTS_RESOLVE(X, pathToFileURL(SCOPE),
  CONDITIONS) <a href="esm.md#resolver-algorithm-specification">wie in der ESM-Resolver-Spezifikation definiert</a>.
6. RESOLVE_ESM_MATCH(MATCH).

LADE_PACKAGE_EXPORTS(X, DIR)
1. Versuche, X als eine Kombination aus NAME und SUBPATH zu interpretieren, wobei der Name
   ein @scope/-Präfix haben kann und der Subpfad mit einem Schrägstrich (`/`) beginnt.
2. Wenn X nicht mit diesem Muster übereinstimmt oder DIR/NAME/package.json keine Datei ist,
   gib zurück.
3. Parse DIR/NAME/package.json, und suche nach dem Feld "exports".
4. Wenn "exports" null oder undefiniert ist, gib zurück.
5. Wenn `--experimental-require-module` aktiviert ist
  a. sei CONDITIONS = ["node", "require", "module-sync"]
  b. Andernfalls, sei CONDITIONS = ["node", "require"]
6. sei MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(DIR/NAME), "." + SUBPATH,
   `package.json` "exports", CONDITIONS) <a href="esm.md#resolver-algorithm-specification">wie in der ESM-Resolver-Spezifikation definiert</a>.
7. RESOLVE_ESM_MATCH(MATCH)

LADE_PACKAGE_SELF(X, DIR)
1. Finde den nächstgelegenen Package-Scope SCOPE zu DIR.
2. Wenn kein Scope gefunden wurde, gib zurück.
3. Wenn der SCOPE/package.json "exports" null oder undefiniert ist, gib zurück.
4. Wenn der SCOPE/package.json "name" nicht das erste Segment von X ist, gib zurück.
5. sei MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(SCOPE),
   "." + X.slice("name".length), `package.json` "exports", ["node", "require"])
   <a href="esm.md#resolver-algorithm-specification">wie in der ESM-Resolver-Spezifikation definiert</a>.
6. RESOLVE_ESM_MATCH(MATCH)

RESOLVE_ESM_MATCH(MATCH)
1. sei RESOLVED_PATH = fileURLToPath(MATCH)
2. Wenn die Datei unter RESOLVED_PATH existiert, lade RESOLVED_PATH als sein Erweiterungsformat. STOP
3. WERFE "nicht gefunden"
```

## Caching {#caching}

Module werden nach dem ersten Laden zwischengespeichert. Dies bedeutet (unter anderem), dass jeder Aufruf von `require('foo')` genau dasselbe Objekt zurückgibt, wenn er in dieselbe Datei aufgelöst würde.

Sofern `require.cache` nicht geändert wird, führen mehrere Aufrufe von `require('foo')` nicht dazu, dass der Modulcode mehrmals ausgeführt wird. Dies ist eine wichtige Funktion. Damit können "teilweise fertige" Objekte zurückgegeben werden, wodurch transitive Abhängigkeiten geladen werden können, selbst wenn sie Zyklen verursachen würden.

Um ein Modul mehrmals Code ausführen zu lassen, exportieren Sie eine Funktion und rufen Sie diese Funktion auf.

### Einschränkungen beim Zwischenspeichern von Modulen {#module-caching-caveats}

Module werden basierend auf ihrem aufgelösten Dateinamen zwischengespeichert. Da Module je nach Speicherort des aufrufenden Moduls (Laden aus `node_modules`-Ordnern) in einen anderen Dateinamen aufgelöst werden können, ist es keine *Garantie*, dass `require('foo')` immer genau dasselbe Objekt zurückgibt, wenn es in verschiedene Dateien aufgelöst würde.

Darüber hinaus können auf Dateisystemen oder Betriebssystemen, die keine Groß-/Kleinschreibung unterscheiden, verschiedene aufgelöste Dateinamen auf dieselbe Datei verweisen, aber der Cache behandelt sie dennoch als unterschiedliche Module und lädt die Datei mehrmals neu. Beispielsweise geben `require('./foo')` und `require('./FOO')` zwei verschiedene Objekte zurück, unabhängig davon, ob `./foo` und `./FOO` dieselbe Datei sind oder nicht.

## Integrierte Module {#built-in-modules}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v16.0.0, v14.18.0 | `node:`-Importunterstützung zu `require(...)` hinzugefügt. |
:::

Node.js verfügt über mehrere Module, die in die Binärdatei kompiliert sind. Diese Module werden an anderer Stelle in dieser Dokumentation ausführlicher beschrieben.

Die integrierten Module sind innerhalb des Node.js-Quellcodes definiert und befinden sich im Ordner `lib/`.

Integrierte Module können anhand des Präfixes `node:` identifiziert werden, wodurch der `require`-Cache umgangen wird. Beispielsweise gibt `require('node:http')` immer das integrierte HTTP-Modul zurück, selbst wenn ein Eintrag `require.cache` mit diesem Namen vorhanden ist.

Einige integrierte Module werden immer bevorzugt geladen, wenn ihre Kennung an `require()` übergeben wird. Beispielsweise gibt `require('http')` immer das integrierte HTTP-Modul zurück, selbst wenn eine Datei mit diesem Namen vorhanden ist. Die Liste der integrierten Module, die ohne das Präfix `node:` geladen werden können, wird in [`module.builtinModules`](/de/nodejs/api/module#modulebuiltinmodules) ohne das Präfix aufgeführt.


### Integrierte Module mit obligatorischem Präfix `node:` {#built-in-modules-with-mandatory-node-prefix}

Beim Laden durch `require()` müssen einige integrierte Module mit dem Präfix `node:` angefordert werden. Diese Anforderung besteht, um zu verhindern, dass neu eingeführte integrierte Module in Konflikt mit User-Land-Paketen geraten, die den Namen bereits übernommen haben. Derzeit benötigen die folgenden integrierten Module das Präfix `node:`:

- [`node:sea`](/de/nodejs/api/single-executable-applications#single-executable-application-api)
- [`node:sqlite`](/de/nodejs/api/sqlite)
- [`node:test`](/de/nodejs/api/test)
- [`node:test/reporters`](/de/nodejs/api/test#test-reporters)

Die Liste dieser Module wird in [`module.builtinModules`](/de/nodejs/api/module#modulebuiltinmodules) offengelegt, einschließlich des Präfixes.

## Zyklen {#cycles}

Wenn zirkuläre `require()`-Aufrufe vorhanden sind, ist ein Modul möglicherweise noch nicht vollständig ausgeführt, wenn es zurückgegeben wird.

Betrachten Sie diese Situation:

`a.js`:

```js [ESM]
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```
`b.js`:

```js [ESM]
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
```
`main.js`:

```js [ESM]
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
```
Wenn `main.js` `a.js` lädt, lädt `a.js` wiederum `b.js`. An diesem Punkt versucht `b.js`, `a.js` zu laden. Um eine Endlosschleife zu verhindern, wird eine **unvollendete Kopie** des `a.js`-Exportobjekts an das `b.js`-Modul zurückgegeben. `b.js` lädt dann vollständig, und sein `exports`-Objekt wird dem `a.js`-Modul bereitgestellt.

Wenn `main.js` beide Module geladen hat, sind beide fertig. Die Ausgabe dieses Programms wäre also:

```bash [BASH]
$ node main.js
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```
Sorgfältige Planung ist erforderlich, um sicherzustellen, dass zyklische Modulabhängigkeiten innerhalb einer Anwendung korrekt funktionieren.


## Dateimodule {#file-modules}

Wenn der exakte Dateiname nicht gefunden wird, versucht Node.js, den angeforderten Dateinamen mit den hinzugefügten Erweiterungen `.js`, `.json` und schließlich `.node` zu laden. Wenn eine Datei mit einer anderen Erweiterung (z. B. `.cjs`) geladen wird, muss ihr vollständiger Name an `require()` übergeben werden, einschließlich der Dateierweiterung (z. B. `require('./file.cjs')`).

`.json`-Dateien werden als JSON-Textdateien geparst, `.node`-Dateien werden als kompilierte Addon-Module interpretiert, die mit `process.dlopen()` geladen werden. Dateien, die eine andere Erweiterung verwenden (oder gar keine Erweiterung), werden als JavaScript-Textdateien geparst. Im Abschnitt [Modulsystem bestimmen](/de/nodejs/api/packages#determining-module-system) wird erläutert, welches Parse-Ziel verwendet wird.

Ein angefordertes Modul mit dem Präfix `'/'` ist ein absoluter Pfad zur Datei. Beispielsweise lädt `require('/home/marco/foo.js')` die Datei unter `/home/marco/foo.js`.

Ein angefordertes Modul mit dem Präfix `'./'` ist relativ zu der Datei, die `require()` aufruft. Das heißt, `circle.js` muss sich im selben Verzeichnis wie `foo.js` befinden, damit `require('./circle')` es finden kann.

Ohne ein führendes `'/'`, `'./'` oder `'../'` zur Angabe einer Datei muss das Modul entweder ein Kernmodul sein oder aus einem `node_modules`-Ordner geladen werden.

Wenn der angegebene Pfad nicht existiert, wirft `require()` einen [`MODULE_NOT_FOUND`](/de/nodejs/api/errors#module_not_found)-Fehler.

## Ordner als Module {#folders-as-modules}

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Verwenden Sie stattdessen [Subpath-Exporte](/de/nodejs/api/packages#subpath-exports) oder [Subpath-Importe](/de/nodejs/api/packages#subpath-imports).
:::

Es gibt drei Möglichkeiten, wie ein Ordner als Argument an `require()` übergeben werden kann.

Die erste besteht darin, eine [`package.json`](/de/nodejs/api/packages#nodejs-packagejson-field-definitions)-Datei im Stammverzeichnis des Ordners zu erstellen, die ein `main`-Modul angibt. Eine Beispiel-[`package.json`](/de/nodejs/api/packages#nodejs-packagejson-field-definitions)-Datei könnte wie folgt aussehen:

```json [JSON]
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }
```
Wenn sich diese Datei in einem Ordner unter `./some-library` befände, würde `require('./some-library')` versuchen, `./some-library/lib/some-library.js` zu laden.

Wenn keine [`package.json`](/de/nodejs/api/packages#nodejs-packagejson-field-definitions)-Datei im Verzeichnis vorhanden ist oder wenn der [`"main"`](/de/nodejs/api/packages#main)-Eintrag fehlt oder nicht aufgelöst werden kann, versucht Node.js, eine `index.js`- oder `index.node`-Datei aus diesem Verzeichnis zu laden. Wenn es im vorherigen Beispiel keine [`package.json`](/de/nodejs/api/packages#nodejs-packagejson-field-definitions)-Datei gäbe, würde `require('./some-library')` beispielsweise versuchen, Folgendes zu laden:

- `./some-library/index.js`
- `./some-library/index.node`

Wenn diese Versuche fehlschlagen, meldet Node.js das gesamte Modul als fehlend mit der Standardfehlermeldung:

```bash [BASH]
Error: Cannot find module 'some-library'
```
In allen drei oben genannten Fällen würde ein `import('./some-library')`-Aufruf zu einem [`ERR_UNSUPPORTED_DIR_IMPORT`](/de/nodejs/api/errors#err_unsupported_dir_import)-Fehler führen. Die Verwendung von Package-[Subpath-Exporten](/de/nodejs/api/packages#subpath-exports) oder [Subpath-Importen](/de/nodejs/api/packages#subpath-imports) kann die gleichen Vorteile der Containment-Organisation wie Ordner als Module bieten und sowohl für `require` als auch für `import` funktionieren.


## Laden aus `node_modules`-Ordnern {#loading-from-node_modules-folders}

Wenn der an `require()` übergebene Modulbezeichner kein [eingebautes](/de/nodejs/api/modules#built-in-modules) Modul ist und nicht mit `'/'`, `'../'` oder `'./'` beginnt, beginnt Node.js im Verzeichnis des aktuellen Moduls, fügt `/node_modules` hinzu und versucht, das Modul von diesem Speicherort zu laden. Node.js hängt `node_modules` nicht an einen Pfad an, der bereits mit `node_modules` endet.

Wenn es dort nicht gefunden wird, wechselt es zum übergeordneten Verzeichnis usw., bis die Wurzel des Dateisystems erreicht ist.

Wenn beispielsweise die Datei unter `'/home/ry/projects/foo.js'` `require('bar.js')` aufruft, würde Node.js an den folgenden Orten in dieser Reihenfolge suchen:

- `/home/ry/projects/node_modules/bar.js`
- `/home/ry/node_modules/bar.js`
- `/home/node_modules/bar.js`
- `/node_modules/bar.js`

Dies ermöglicht es Programmen, ihre Abhängigkeiten zu lokalisieren, so dass sie sich nicht überschneiden.

Es ist möglich, bestimmte Dateien oder Untermodule, die mit einem Modul verteilt werden, anzufordern, indem man nach dem Modulnamen ein Pfadsuffix angibt. Beispielsweise würde `require('example-module/path/to/file')` `path/to/file` relativ zu dem Ort auflösen, an dem sich `example-module` befindet. Der angehängte Pfad folgt der gleichen Modulauflösungssemantik.

## Laden aus den globalen Ordnern {#loading-from-the-global-folders}

Wenn die Umgebungsvariable `NODE_PATH` auf eine durch Doppelpunkte getrennte Liste absoluter Pfade gesetzt ist, sucht Node.js in diesen Pfaden nach Modulen, wenn sie nicht anderswo gefunden werden.

Unter Windows wird `NODE_PATH` durch Semikolons (`;`) anstelle von Doppelpunkten getrennt.

`NODE_PATH` wurde ursprünglich erstellt, um das Laden von Modulen aus verschiedenen Pfaden zu unterstützen, bevor der aktuelle [Modulauflösungs-](/de/nodejs/api/modules#all-together)algorithmus definiert wurde.

`NODE_PATH` wird immer noch unterstützt, ist aber weniger notwendig, seitdem sich das Node.js-Ökosystem auf eine Konvention für die Suche nach abhängigen Modulen geeinigt hat. Manchmal zeigen Bereitstellungen, die sich auf `NODE_PATH` verlassen, überraschendes Verhalten, wenn die Leute sich nicht bewusst sind, dass `NODE_PATH` gesetzt werden muss. Manchmal ändern sich die Abhängigkeiten eines Moduls, was dazu führt, dass eine andere Version (oder sogar ein anderes Modul) geladen wird, wenn die `NODE_PATH` durchsucht wird.

Zusätzlich sucht Node.js in der folgenden Liste von GLOBAL_FOLDERS:

- 1: `$HOME/.node_modules`
- 2: `$HOME/.node_libraries`
- 3: `$PREFIX/lib/node`

Dabei ist `$HOME` das Home-Verzeichnis des Benutzers und `$PREFIX` das für Node.js konfigurierte `node_prefix`.

Diese sind hauptsächlich aus historischen Gründen vorhanden.

Es wird dringend empfohlen, Abhängigkeiten im lokalen `node_modules`-Ordner zu platzieren. Diese werden schneller und zuverlässiger geladen.


## Der Modul-Wrapper {#the-module-wrapper}

Bevor der Code eines Moduls ausgeführt wird, umschließt Node.js ihn mit einem Funktions-Wrapper, der wie folgt aussieht:

```js [ESM]
(function(exports, require, module, __filename, __dirname) {
// Modulcode befindet sich tatsächlich hier
});
```
Dadurch erreicht Node.js ein paar Dinge:

- Es sorgt dafür, dass Variablen auf oberster Ebene (definiert mit `var`, `const` oder `let`) auf das Modul und nicht auf das globale Objekt beschränkt sind.
- Es hilft, einige global aussehende Variablen bereitzustellen, die tatsächlich spezifisch für das Modul sind, wie zum Beispiel:
    - Die Objekte `module` und `exports`, mit denen der Implementierer Werte aus dem Modul exportieren kann.
    - Die Komfortvariablen `__filename` und `__dirname`, die den absoluten Dateinamen und den Verzeichnispfad des Moduls enthalten.

 

## Der Modulbereich {#the-module-scope}

### `__dirname` {#__dirname}

**Hinzugefügt in: v0.1.27**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der Verzeichnisname des aktuellen Moduls. Dies ist dasselbe wie [`path.dirname()`](/de/nodejs/api/path#pathdirnamepath) von [`__filename`](/de/nodejs/api/modules#__filename).

Beispiel: Ausführen von `node example.js` von `/Users/mjr`

```js [ESM]
console.log(__dirname);
// Gibt aus: /Users/mjr
console.log(path.dirname(__filename));
// Gibt aus: /Users/mjr
```
### `__filename` {#__filename}

**Hinzugefügt in: v0.0.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der Dateiname des aktuellen Moduls. Dies ist der absolute Pfad der aktuellen Moduldatei mit aufgelösten Symlinks.

Für ein Hauptprogramm ist dies nicht unbedingt dasselbe wie der in der Befehlszeile verwendete Dateiname.

Siehe [`__dirname`](/de/nodejs/api/modules#__dirname) für den Verzeichnisnamen des aktuellen Moduls.

Beispiele:

Ausführen von `node example.js` von `/Users/mjr`

```js [ESM]
console.log(__filename);
// Gibt aus: /Users/mjr/example.js
console.log(__dirname);
// Gibt aus: /Users/mjr
```
Angenommen, es gibt zwei Module: `a` und `b`, wobei `b` eine Abhängigkeit von `a` ist und es eine Verzeichnisstruktur gibt von:

- `/Users/mjr/app/a.js`
- `/Users/mjr/app/node_modules/b/b.js`

Verweise auf `__filename` innerhalb von `b.js` geben `/Users/mjr/app/node_modules/b/b.js` zurück, während Verweise auf `__filename` innerhalb von `a.js` `/Users/mjr/app/a.js` zurückgeben.


### `exports` {#exports}

**Hinzugefügt in: v0.1.12**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Eine Referenz zu `module.exports`, die kürzer zu tippen ist. Weitere Informationen zur Verwendung von `exports` und `module.exports` finden Sie im Abschnitt über die [exports-Abkürzung](/de/nodejs/api/modules#exports-shortcut).

### `module` {#module}

**Hinzugefügt in: v0.1.16**

- [\<module\>](/de/nodejs/api/modules#the-module-object)

Eine Referenz zum aktuellen Modul, siehe den Abschnitt über das [`module`-Objekt](/de/nodejs/api/modules#the-module-object). Insbesondere wird `module.exports` verwendet, um zu definieren, was ein Modul exportiert und über `require()` verfügbar macht.

### `require(id)` {#requireid}

**Hinzugefügt in: v0.1.13**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Modulname oder Pfad
- Gibt zurück: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) exportierter Modulinhalt

Wird verwendet, um Module, `JSON` und lokale Dateien zu importieren. Module können aus `node_modules` importiert werden. Lokale Module und JSON-Dateien können über einen relativen Pfad importiert werden (z. B. `./`, `./foo`, `./bar/baz`, `../foo`), der relativ zu dem durch [`__dirname`](/de/nodejs/api/modules#__dirname) (falls definiert) oder dem aktuellen Arbeitsverzeichnis angegebenen Verzeichnis aufgelöst wird. Die relativen Pfade im POSIX-Stil werden betriebssystemunabhängig aufgelöst, d. h. die obigen Beispiele funktionieren unter Windows genauso wie unter Unix-Systemen.

```js [ESM]
// Importieren eines lokalen Moduls mit einem Pfad relativ zu `__dirname` oder dem aktuellen
// Arbeitsverzeichnis. (Unter Windows würde dies zu .\path\myLocalModule aufgelöst.)
const myLocalModule = require('./path/myLocalModule');

// Importieren einer JSON-Datei:
const jsonData = require('./path/filename.json');

// Importieren eines Moduls aus node_modules oder einem integrierten Node.js-Modul:
const crypto = require('node:crypto');
```
#### `require.cache` {#requirecache}

**Hinzugefügt in: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Module werden in diesem Objekt zwischengespeichert, wenn sie benötigt werden. Durch Löschen eines Schlüsselwerts aus diesem Objekt wird das Modul beim nächsten `require` neu geladen. Dies gilt nicht für [native Addons](/de/nodejs/api/addons), bei denen das Neuladen zu einem Fehler führt.

Das Hinzufügen oder Ersetzen von Einträgen ist ebenfalls möglich. Dieser Cache wird vor integrierten Modulen geprüft, und wenn ein Name, der mit einem integrierten Modul übereinstimmt, dem Cache hinzugefügt wird, erhalten nur `node:`-präfixierte Require-Aufrufe das integrierte Modul. Mit Vorsicht verwenden!

```js [ESM]
const assert = require('node:assert');
const realFs = require('node:fs');

const fakeFs = {};
require.cache.fs = { exports: fakeFs };

assert.strictEqual(require('fs'), fakeFs);
assert.strictEqual(require('node:fs'), realFs);
```

#### `require.extensions` {#requireextensions}

**Hinzugefügt in: v0.3.0**

**Veraltet seit: v0.10.6**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Weisen Sie `require` an, wie bestimmte Dateiendungen behandelt werden sollen.

Verarbeiten Sie Dateien mit der Erweiterung `.sjs` als `.js`:

```js [ESM]
require.extensions['.sjs'] = require.extensions['.js'];
```
**Veraltet.** In der Vergangenheit wurde diese Liste verwendet, um Nicht-JavaScript-Module in Node.js zu laden, indem sie bei Bedarf kompiliert wurden. In der Praxis gibt es jedoch viel bessere Möglichkeiten, dies zu tun, z. B. das Laden von Modulen über ein anderes Node.js-Programm oder das Kompilieren zu JavaScript im Voraus.

Vermeiden Sie die Verwendung von `require.extensions`. Die Verwendung kann zu subtilen Fehlern führen und das Auflösen der Erweiterungen wird mit jeder registrierten Erweiterung langsamer.

#### `require.main` {#requiremain}

**Hinzugefügt in: v0.1.17**

- [\<module\>](/de/nodejs/api/modules#the-module-object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Das `Module`-Objekt, das das Einstiegsskript darstellt, das beim Starten des Node.js-Prozesses geladen wurde, oder `undefined`, wenn der Einstiegspunkt des Programms kein CommonJS-Modul ist. Siehe ["Zugriff auf das Hauptmodul"](/de/nodejs/api/modules#accessing-the-main-module).

Im `entry.js`-Skript:

```js [ESM]
console.log(require.main);
```
```bash [BASH]
node entry.js
```
```js [ESM]
Module {
  id: '.',
  path: '/absolute/path/to',
  exports: {},
  filename: '/absolute/path/to/entry.js',
  loaded: false,
  children: [],
  paths:
   [ '/absolute/path/to/node_modules',
     '/absolute/path/node_modules',
     '/absolute/node_modules',
     '/node_modules' ] }
```
#### `require.resolve(request[, options])` {#requireresolverequest-options}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v8.9.0 | Die Option `paths` wird jetzt unterstützt. |
| v0.3.0 | Hinzugefügt in: v0.3.0 |
:::

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der aufzulösende Modulpfad.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `paths` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Pfade, von denen aus der Modulstandort aufgelöst werden soll. Falls vorhanden, werden diese Pfade anstelle der Standardauflösungspfade verwendet, mit Ausnahme von [GLOBAL_FOLDERS](/de/nodejs/api/modules#loading-from-the-global-folders) wie `$HOME/.node_modules`, die immer enthalten sind. Jeder dieser Pfade wird als Ausgangspunkt für den Modulauflösungsalgorithmus verwendet, was bedeutet, dass die `node_modules`-Hierarchie von diesem Speicherort aus überprüft wird.
  
 
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Verwenden Sie die interne `require()`-Maschinerie, um den Speicherort eines Moduls zu suchen, aber anstatt das Modul zu laden, geben Sie einfach den aufgelösten Dateinamen zurück.

Wenn das Modul nicht gefunden werden kann, wird ein `MODULE_NOT_FOUND`-Fehler ausgelöst.


##### `require.resolve.paths(request)` {#requireresolvepathsrequest}

**Hinzugefügt in: v8.9.0**

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Modulpfad, dessen Suchpfade abgerufen werden.
- Rückgabe: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Gibt ein Array mit den Pfaden zurück, die während der Auflösung von `request` durchsucht wurden, oder `null`, wenn die Zeichenfolge `request` auf ein Kernmodul verweist, z. B. `http` oder `fs`.

## Das `module`-Objekt {#the-module-object}

**Hinzugefügt in: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

In jedem Modul ist die freie Variable `module` eine Referenz auf das Objekt, das das aktuelle Modul darstellt. Der Einfachheit halber ist `module.exports` auch über die modulglobale Variable `exports` zugänglich. `module` ist eigentlich keine globale Variable, sondern lokal für jedes Modul.

### `module.children` {#modulechildren}

**Hinzugefügt in: v0.1.16**

- [\<module[]\>](/de/nodejs/api/modules#the-module-object)

Die Modulobjekte, die von diesem Modul zum ersten Mal benötigt werden.

### `module.exports` {#moduleexports}

**Hinzugefügt in: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Das `module.exports`-Objekt wird vom `Module`-System erstellt. Manchmal ist dies nicht akzeptabel; viele möchten, dass ihr Modul eine Instanz einer bestimmten Klasse ist. Um dies zu tun, weisen Sie das gewünschte Exportobjekt `module.exports` zu. Das Zuweisen des gewünschten Objekts zu `exports` bindet lediglich die lokale `exports`-Variable neu, was wahrscheinlich nicht erwünscht ist.

Nehmen wir zum Beispiel an, wir erstellen ein Modul namens `a.js`:

```js [ESM]
const EventEmitter = require('node:events');

module.exports = new EventEmitter();

// Erledige etwas Arbeit und sende nach einiger Zeit
// das 'ready'-Ereignis vom Modul selbst.
setTimeout(() => {
  module.exports.emit('ready');
}, 1000);
```
Dann könnten wir in einer anderen Datei Folgendes tun:

```js [ESM]
const a = require('./a');
a.on('ready', () => {
  console.log('module "a" is ready');
});
```
Die Zuweisung zu `module.exports` muss sofort erfolgen. Sie kann nicht in irgendwelchen Callbacks erfolgen. Das funktioniert nicht:

`x.js`:

```js [ESM]
setTimeout(() => {
  module.exports = { a: 'hello' };
}, 0);
```
`y.js`:

```js [ESM]
const x = require('./x');
console.log(x.a);
```

#### `exports`-Kurzbefehl {#exports-shortcut}

**Hinzugefügt in: v0.1.16**

Die Variable `exports` ist innerhalb des Dateibereichs eines Moduls verfügbar und erhält vor der Auswertung des Moduls den Wert von `module.exports` zugewiesen.

Sie ermöglicht eine Abkürzung, sodass `module.exports.f = ...` prägnanter als `exports.f = ...` geschrieben werden kann. Beachten Sie jedoch, dass wie bei jeder Variablen, wenn `exports` ein neuer Wert zugewiesen wird, es nicht mehr an `module.exports` gebunden ist:

```js [ESM]
module.exports.hello = true; // Exportiert von require des Moduls
exports = { hello: false };  // Nicht exportiert, nur im Modul verfügbar
```
Wenn die `module.exports`-Eigenschaft vollständig durch ein neues Objekt ersetzt wird, ist es üblich, auch `exports` neu zuzuweisen:

```js [ESM]
module.exports = exports = function Constructor() {
  // ... usw.
};
```
Um das Verhalten zu veranschaulichen, stellen Sie sich diese hypothetische Implementierung von `require()` vor, die der tatsächlichen Implementierung von `require()` sehr ähnlich ist:

```js [ESM]
function require(/* ... */) {
  const module = { exports: {} };
  ((module, exports) => {
    // Modulcode hier. In diesem Beispiel wird eine Funktion definiert.
    function someFunc() {}
    exports = someFunc;
    // An diesem Punkt ist exports keine Abkürzung mehr für module.exports, und
    // dieses Modul exportiert weiterhin ein leeres Standardobjekt.
    module.exports = someFunc;
    // An diesem Punkt exportiert das Modul jetzt someFunc anstelle des
    // Standardobjekts.
  })(module, module.exports);
  return module.exports;
}
```
### `module.filename` {#modulefilename}

**Hinzugefügt in: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der vollständig aufgelöste Dateiname des Moduls.

### `module.id` {#moduleid}

**Hinzugefügt in: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Kennung für das Modul. Typischerweise ist dies der vollständig aufgelöste Dateiname.

### `module.isPreloading` {#moduleispreloading}

**Hinzugefügt in: v15.4.0, v14.17.0**

- Typ: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn das Modul während der Node.js-Vorladephase ausgeführt wird.


### `module.loaded` {#moduleloaded}

**Hinzugefügt in: v0.1.16**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt an, ob das Modul bereits geladen wurde oder gerade geladen wird.

### `module.parent` {#moduleparent}

**Hinzugefügt in: v0.1.16**

**Veraltet seit: v14.6.0, v12.19.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Bitte verwenden Sie stattdessen [`require.main`](/de/nodejs/api/modules#requiremain) und [`module.children`](/de/nodejs/api/modules#modulechildren).
:::

- [\<module\>](/de/nodejs/api/modules#the-module-object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Das Modul, das dieses zuerst angefordert hat, oder `null`, wenn das aktuelle Modul der Einstiegspunkt des aktuellen Prozesses ist, oder `undefined`, wenn das Modul von etwas geladen wurde, das kein CommonJS-Modul ist (z. B.: REPL oder `import`).

### `module.path` {#modulepath}

**Hinzugefügt in: v11.14.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der Verzeichnisname des Moduls. Dies ist in der Regel das gleiche wie das [`path.dirname()`](/de/nodejs/api/path#pathdirnamepath) der [`module.id`](/de/nodejs/api/modules#moduleid).

### `module.paths` {#modulepaths}

**Hinzugefügt in: v0.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Suchpfade für das Modul.

### `module.require(id)` {#modulerequireid}

**Hinzugefügt in: v0.5.1**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) exportierter Modulinhalt

Die Methode `module.require()` bietet eine Möglichkeit, ein Modul so zu laden, als ob `require()` vom ursprünglichen Modul aufgerufen worden wäre.

Um dies zu tun, ist es notwendig, eine Referenz auf das `module`-Objekt zu erhalten. Da `require()` die `module.exports` zurückgibt und das `module` in der Regel *nur* innerhalb des Codes eines bestimmten Moduls verfügbar ist, muss es explizit exportiert werden, um verwendet werden zu können.


## Das `Module`-Objekt {#the-module-object_1}

Dieser Abschnitt wurde nach [Module: `module` Kernmodul](/de/nodejs/api/module#the-module-object) verschoben.

- [`module.builtinModules`](/de/nodejs/api/module#modulebuiltinmodules)
- [`module.createRequire(filename)`](/de/nodejs/api/module#modulecreaterequirefilename)
- [`module.syncBuiltinESMExports()`](/de/nodejs/api/module#modulesyncbuiltinesmexports)

## Source Map v3 Unterstützung {#source-map-v3-support}

Dieser Abschnitt wurde nach [Module: `module` Kernmodul](/de/nodejs/api/module#source-map-v3-support) verschoben.

- [`module.findSourceMap(path)`](/de/nodejs/api/module#modulefindsourcemappath)
- [Klasse: `module.SourceMap`](/de/nodejs/api/module#class-modulesourcemap)
    - [`new SourceMap(payload)`](/de/nodejs/api/module#new-sourcemappayload)
    - [`sourceMap.payload`](/de/nodejs/api/module#sourcemappayload)
    - [`sourceMap.findEntry(lineNumber, columnNumber)`](/de/nodejs/api/module#sourcemapfindentrylinenumber-columnnumber)

