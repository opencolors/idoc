---
title: ECMAScript-Module in Node.js
description: Diese Seite bietet detaillierte Dokumentation darüber, wie ECMAScript-Module (ESM) in Node.js verwendet werden, einschließlich Modulauflösung, Import- und Export-Syntax sowie Kompatibilität mit CommonJS.
head:
  - - meta
    - name: og:title
      content: ECMAScript-Module in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Diese Seite bietet detaillierte Dokumentation darüber, wie ECMAScript-Module (ESM) in Node.js verwendet werden, einschließlich Modulauflösung, Import- und Export-Syntax sowie Kompatibilität mit CommonJS.
  - - meta
    - name: twitter:title
      content: ECMAScript-Module in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Diese Seite bietet detaillierte Dokumentation darüber, wie ECMAScript-Module (ESM) in Node.js verwendet werden, einschließlich Modulauflösung, Import- und Export-Syntax sowie Kompatibilität mit CommonJS.
---


# Module: ECMAScript-Module {#modules-ecmascript-modules}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.1.0 | Importattribute sind nicht mehr experimentell. |
| v22.0.0 | Unterstützung für Importzusicherungen entfernt. |
| v21.0.0, v20.10.0, v18.20.0 | Experimentelle Unterstützung für Importattribute hinzugefügt. |
| v20.0.0, v18.19.0 | Module-Customization-Hooks werden außerhalb des Hauptthreads ausgeführt. |
| v18.6.0, v16.17.0 | Unterstützung für die Verkettung von Module-Customization-Hooks hinzugefügt. |
| v17.1.0, v16.14.0 | Experimentelle Unterstützung für Importzusicherungen hinzugefügt. |
| v17.0.0, v16.12.0 | Konsolidierte Customization-Hooks, entfernte `getFormat`, `getSource`, `transformSource` und `getGlobalPreloadCode`-Hooks, hinzugefügt `load`- und `globalPreload`-Hooks, die die Rückgabe von `format` entweder von `resolve`- oder `load`-Hooks erlauben. |
| v14.8.0 | Top-Level-Await als nicht-experimentell gekennzeichnet. |
| v15.3.0, v14.17.0, v12.22.0 | Stabilisierung der Modulimplementierung. |
| v14.13.0, v12.20.0 | Unterstützung für die Erkennung von benannten CommonJS-Exporten. |
| v14.0.0, v13.14.0, v12.20.0 | Experimentelle Modulwarnung entfernt. |
| v13.2.0, v12.17.0 | Das Laden von ECMAScript-Modulen erfordert keine Befehlszeilenoption mehr. |
| v12.0.0 | Unterstützung für ES-Module unter Verwendung der Dateiendung `.js` über das Feld `"type"` in `package.json` hinzugefügt. |
| v8.5.0 | Hinzugefügt in: v8.5.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

## Einführung {#introduction}

ECMAScript-Module sind [das offizielle Standardformat](https://tc39.github.io/ecma262/#sec-modules) zum Verpacken von JavaScript-Code zur Wiederverwendung. Module werden mithilfe verschiedener [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)- und [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)-Anweisungen definiert.

Das folgende Beispiel eines ES-Moduls exportiert eine Funktion:

```js [ESM]
// addTwo.mjs
function addTwo(num) {
  return num + 2;
}

export { addTwo };
```
Das folgende Beispiel eines ES-Moduls importiert die Funktion aus `addTwo.mjs`:

```js [ESM]
// app.mjs
import { addTwo } from './addTwo.mjs';

// Gibt aus: 6
console.log(addTwo(4));
```
Node.js unterstützt ECMAScript-Module vollständig, so wie sie aktuell spezifiziert sind, und bietet Interoperabilität zwischen diesen und seinem ursprünglichen Modulformat, [CommonJS](/de/nodejs/api/modules).


## Aktivierung {#enabling}

Node.js verfügt über zwei Modulsysteme: [CommonJS](/de/nodejs/api/modules)-Module und ECMAScript-Module.

Autoren können Node.js anweisen, JavaScript als ES-Modul zu interpretieren, indem sie die Dateiendung `.mjs`, das Feld `package.json` [`"type"`](/de/nodejs/api/packages#type) mit dem Wert `"module"` oder das Flag [`--input-type`](/de/nodejs/api/cli#--input-typetype) mit dem Wert `"module"` verwenden. Dies sind explizite Kennzeichen dafür, dass Code als ES-Modul ausgeführt werden soll.

Umgekehrt können Autoren Node.js explizit anweisen, JavaScript als CommonJS zu interpretieren, indem sie die Dateiendung `.cjs`, das Feld `package.json` [`"type"`](/de/nodejs/api/packages#type) mit dem Wert `"commonjs"` oder das Flag [`--input-type`](/de/nodejs/api/cli#--input-typetype) mit dem Wert `"commonjs"` verwenden.

Wenn Code explizite Kennzeichen für eines der Modulsysteme fehlen, untersucht Node.js den Quellcode eines Moduls, um nach ES-Modul-Syntax zu suchen. Wenn eine solche Syntax gefunden wird, führt Node.js den Code als ES-Modul aus; andernfalls führt er das Modul als CommonJS aus. Weitere Informationen finden Sie unter [Bestimmung des Modulsystems](/de/nodejs/api/packages#determining-module-system).

## Pakete {#packages}

Dieser Abschnitt wurde nach [Module: Pakete](/de/nodejs/api/packages) verschoben.

## `import`-Spezifizierer {#import-specifiers}

### Terminologie {#terminology}

Der *Spezifizierer* einer `import`-Anweisung ist die Zeichenkette nach dem Schlüsselwort `from`, z. B. `'node:path'` in `import { sep } from 'node:path'`. Spezifizierer werden auch in `export from`-Anweisungen und als Argument für einen `import()`-Ausdruck verwendet.

Es gibt drei Arten von Spezifizierern:

-  *Relative Spezifizierer* wie `'./startup.js'` oder `'../config.mjs'`. Sie verweisen auf einen Pfad relativ zum Speicherort der importierenden Datei. *Die Dateiendung
ist hier immer notwendig.*
-  *Bare Spezifizierer* wie `'some-package'` oder `'some-package/shuffle'`. Sie können auf den Haupteinstiegspunkt eines Pakets über den Paketnamen oder auf ein bestimmtes Funktionsmodul innerhalb eines Pakets mit dem Paketnamen als Präfix gemäß den Beispielen verweisen. *Das Einfügen der Dateiendung ist nur notwendig
für Pakete ohne ein <a href="packages.html#exports"><code>"exports"</code></a>-Feld.*
-  *Absolute Spezifizierer* wie `'file:///opt/nodejs/config.js'`. Sie verweisen direkt und explizit auf einen vollständigen Pfad.

Bare-Spezifizierer-Auflösungen werden durch den [Node.js-Modulauflösungs- und -ladealgorithmus](/de/nodejs/api/esm#resolution-algorithm-specification) behandelt. Alle anderen Spezifizierer-Auflösungen werden immer nur mit der standardmäßigen relativen [URL](https://url.spec.whatwg.org/)-Auflösungssemantik aufgelöst.

Wie in CommonJS kann auf Moduldateien innerhalb von Paketen zugegriffen werden, indem ein Pfad an den Paketnamen angehängt wird, es sei denn, die [`package.json`](/de/nodejs/api/packages#nodejs-packagejson-field-definitions) des Pakets enthält ein [`"exports"`](/de/nodejs/api/packages#exports)-Feld. In diesem Fall kann auf Dateien innerhalb von Paketen nur über die in [`"exports"`](/de/nodejs/api/packages#exports) definierten Pfade zugegriffen werden.

Einzelheiten zu diesen Paketauflösungsregeln, die für Bare-Spezifizierer in der Node.js-Modulauflösung gelten, finden Sie in der [Paketdokumentation](/de/nodejs/api/packages).


### Obligatorische Dateiendungen {#mandatory-file-extensions}

Eine Dateiendung muss angegeben werden, wenn das Schlüsselwort `import` verwendet wird, um relative oder absolute Spezifizierer aufzulösen. Verzeichnisindizes (z. B. `'./startup/index.js'`) müssen ebenfalls vollständig angegeben werden.

Dieses Verhalten entspricht dem Verhalten von `import` in Browserumgebungen, wenn von einem typisch konfigurierten Server ausgegangen wird.

### URLs {#urls}

ES-Module werden als URLs aufgelöst und zwischengespeichert. Dies bedeutet, dass Sonderzeichen [prozentcodiert](/de/nodejs/api/url#percent-encoding-in-urls) werden müssen, z. B. `#` mit `%23` und `?` mit `%3F`.

Die URL-Schemas `file:`, `node:` und `data:` werden unterstützt. Ein Spezifizierer wie `'https://example.com/app.js'` wird in Node.js nicht nativ unterstützt, es sei denn, es wird ein [benutzerdefinierter HTTPS-Loader](/de/nodejs/api/module#import-from-https) verwendet.

#### `file:`-URLs {#file-urls}

Module werden mehrmals geladen, wenn der `import`-Spezifizierer, der zur Auflösung verwendet wird, eine andere Query oder ein anderes Fragment hat.

```js [ESM]
import './foo.mjs?query=1'; // lädt ./foo.mjs mit Query "?query=1"
import './foo.mjs?query=2'; // lädt ./foo.mjs mit Query "?query=2"
```
Das Volume-Root kann über `/`, `//` oder `file:///` referenziert werden. Angesichts der Unterschiede zwischen der [URL](https://url.spec.whatwg.org/) und der Pfadauflösung (z. B. Details zur Prozentcodierung) wird empfohlen, [url.pathToFileURL](/de/nodejs/api/url#urlpathtofileurlpath-options) zu verwenden, wenn ein Pfad importiert wird.

#### `data:`-Imports {#data-imports}

**Hinzugefügt in: v12.10.0**

[`data:`-URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) werden für den Import mit den folgenden MIME-Typen unterstützt:

- `text/javascript` für ES-Module
- `application/json` für JSON
- `application/wasm` für Wasm

```js [ESM]
import 'data:text/javascript,console.log("hello!");';
import _ from 'data:application/json,"world!"' with { type: 'json' };
```
`data:`-URLs lösen nur [Bare Specifiers](/de/nodejs/api/esm#terminology) für Builtin-Module und [Absolute Specifiers](/de/nodejs/api/esm#terminology) auf. Das Auflösen von [Relative Specifiers](/de/nodejs/api/esm#terminology) funktioniert nicht, da `data:` kein [spezielles Schema](https://url.spec.whatwg.org/#special-scheme) ist. Beispielsweise schlägt der Versuch, `./foo` von `data:text/javascript,import "./foo";` zu laden, fehl, da es kein Konzept der relativen Auflösung für `data:`-URLs gibt.


#### `node:`-Importe {#node-imports}

::: info [Historie]
| Version | Änderungen |
|---|---|
| v16.0.0, v14.18.0 | `node:`-Importunterstützung zu `require(...)` hinzugefügt. |
| v14.13.1, v12.20.0 | Hinzugefügt in: v14.13.1, v12.20.0 |
:::

`node:`-URLs werden als alternative Methode zum Laden von Node.js-integrierten Modulen unterstützt. Dieses URL-Schema ermöglicht es, integrierte Module über gültige absolute URL-Strings zu referenzieren.

```js [ESM]
import fs from 'node:fs/promises';
```
## Importattribute {#import-attributes}

::: info [Historie]
| Version | Änderungen |
|---|---|
| v21.0.0, v20.10.0, v18.20.0 | Umstellung von Import Assertions auf Import Attributes. |
| v17.1.0, v16.14.0 | Hinzugefügt in: v17.1.0, v16.14.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

[Importattribute](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) sind eine Inline-Syntax für Modulimportanweisungen, um neben dem Modulbezeichner weitere Informationen zu übermitteln.

```js [ESM]
import fooData from './foo.json' with { type: 'json' };

const { default: barData } =
  await import('./bar.json', { with: { type: 'json' } });
```
Node.js unterstützt nur das Attribut `type`, für das es die folgenden Werte unterstützt:

| Attribut `type` | Benötigt für |
|---|---|
| `'json'` | [JSON-Module](/de/nodejs/api/esm#json-modules) |
Das Attribut `type: 'json'` ist beim Importieren von JSON-Modulen obligatorisch.

## Integrierte Module {#built-in-modules}

[Integrierte Module](/de/nodejs/api/modules#built-in-modules) stellen benannte Exporte ihrer öffentlichen API bereit. Ein Standardexport wird ebenfalls bereitgestellt, der dem Wert der CommonJS-Exporte entspricht. Der Standardexport kann unter anderem verwendet werden, um die benannten Exporte zu ändern. Benannte Exporte von integrierten Modulen werden nur durch Aufrufen von [`module.syncBuiltinESMExports()`](/de/nodejs/api/module#modulesyncbuiltinesmexports) aktualisiert.

```js [ESM]
import EventEmitter from 'node:events';
const e = new EventEmitter();
```
```js [ESM]
import { readFile } from 'node:fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```
```js [ESM]
import fs, { readFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { Buffer } from 'node:buffer';

fs.readFileSync = () => Buffer.from('Hallo, ESM');
syncBuiltinESMExports();

fs.readFileSync === readFileSync;
```

## `import()`-Ausdrücke {#import-expressions}

[Dynamisches `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) wird sowohl in CommonJS- als auch in ES-Modulen unterstützt. In CommonJS-Modulen kann es verwendet werden, um ES-Module zu laden.

## `import.meta` {#importmeta}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Die Meta-Eigenschaft `import.meta` ist ein `Object`, das die folgenden Eigenschaften enthält. Sie wird nur in ES-Modulen unterstützt.

### `import.meta.dirname` {#importmetadirname}

**Hinzugefügt in: v21.2.0, v20.11.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).2 - Release Candidate
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Verzeichnisname des aktuellen Moduls. Dies ist dasselbe wie [`path.dirname()`](/de/nodejs/api/path#pathdirnamepath) von [`import.meta.filename`](/de/nodejs/api/esm#importmetafilename).

### `import.meta.filename` {#importmetafilename}

**Hinzugefügt in: v21.2.0, v20.11.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).2 - Release Candidate
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der vollständige absolute Pfad und Dateiname des aktuellen Moduls, wobei Symlinks aufgelöst werden.
- Dies ist dasselbe wie [`url.fileURLToPath()`](/de/nodejs/api/url#urlfileurltopathurl-options) von [`import.meta.url`](/de/nodejs/api/esm#importmetaurl).

### `import.meta.url` {#importmetaurl}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die absolute `file:`-URL des Moduls.

Dies ist genau so definiert wie in Browsern, die die URL der aktuellen Moduldatei bereitstellen.

Dies ermöglicht nützliche Muster wie das relative Laden von Dateien:

```js [ESM]
import { readFileSync } from 'node:fs';
const buffer = readFileSync(new URL('./data.proto', import.meta.url));
```
### `import.meta.resolve(specifier)` {#importmetaresolvespecifier}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.6.0, v18.19.0 | Nicht mehr hinter dem `--experimental-import-meta-resolve` CLI-Flag, mit Ausnahme des nicht standardmäßigen `parentURL`-Parameters. |
| v20.6.0, v18.19.0 | Diese API wirft keine Ausnahme mehr, wenn `file:`-URLs als Ziel verwendet werden, die keiner existierenden Datei im lokalen Dateisystem entsprechen. |
| v20.0.0, v18.19.0 | Diese API gibt jetzt synchron einen String anstelle eines Promise zurück. |
| v16.2.0, v14.18.0 | Unterstützung für WHATWG `URL`-Objekt zum `parentURL`-Parameter hinzugefügt. |
| v13.9.0, v12.16.2 | Hinzugefügt in: v13.9.0, v12.16.2 |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).2 - Release Candidate
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Modul-Spezifizierer, der relativ zum aktuellen Modul aufgelöst werden soll.
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die absolute URL-Zeichenkette, zu der der Spezifizierer aufgelöst würde.

[`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) ist eine modulrelative Auflösungsfunktion, die auf jedes Modul beschränkt ist und die URL-Zeichenkette zurückgibt.

```js [ESM]
const dependencyAsset = import.meta.resolve('component-lib/asset.css');
// file:///app/node_modules/component-lib/asset.css
import.meta.resolve('./dep.js');
// file:///app/dep.js
```
Alle Funktionen der Node.js-Modulauflösung werden unterstützt. Abhängigkeitsauflösungen unterliegen den zulässigen Exportauflösungen innerhalb des Pakets.

**Vorbehalte**:

- Dies kann zu synchronen Dateisystemoperationen führen, die sich ähnlich wie `require.resolve` auf die Leistung auswirken können.
- Diese Funktion ist in benutzerdefinierten Ladeprogrammen nicht verfügbar (sie würde zu einem Deadlock führen).

**Nicht-standardmäßige API**:

Bei Verwendung des `--experimental-import-meta-resolve`-Flags akzeptiert diese Funktion ein zweites Argument:

- `parent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Eine optionale absolute übergeordnete Modul-URL, von der aus aufgelöst werden soll. **Standard:** `import.meta.url`


## Interoperabilität mit CommonJS {#interoperability-with-commonjs}

### `import`-Anweisungen {#import-statements}

Eine `import`-Anweisung kann auf ein ES-Modul oder ein CommonJS-Modul verweisen. `import`-Anweisungen sind nur in ES-Modulen zulässig, aber dynamische [`import()`]-Ausdrücke (/de/nodejs/api/esm#import-expressions) werden in CommonJS zum Laden von ES-Modulen unterstützt.

Beim Importieren von [CommonJS-Modulen](/de/nodejs/api/esm#commonjs-namespaces) wird das `module.exports`-Objekt als Standardexport bereitgestellt. Benannte Exporte können verfügbar sein, die durch statische Analyse als Komfortfunktion für eine bessere Ökosystemkompatibilität bereitgestellt werden.

### `require` {#require}

Das CommonJS-Modul `require` unterstützt derzeit nur das Laden von synchronen ES-Modulen (d. h. ES-Modulen, die kein Top-Level-`await` verwenden).

Weitere Informationen finden Sie unter [Laden von ECMAScript-Modulen mit `require()`](/de/nodejs/api/modules#loading-ecmascript-modules-using-require).

### CommonJS-Namensräume {#commonjs-namespaces}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Export-Marker `'module.exports'` zu CJS-Namensräumen hinzugefügt. |
| v14.13.0 | Hinzugefügt in: v14.13.0 |
:::

CommonJS-Module bestehen aus einem `module.exports`-Objekt, das einen beliebigen Typ haben kann.

Um dies zu unterstützen, wird beim Importieren von CommonJS aus einem ECMAScript-Modul ein Namespace-Wrapper für das CommonJS-Modul erstellt, der immer einen `default`-Export-Schlüssel bereitstellt, der auf den CommonJS-`module.exports`-Wert verweist.

Darüber hinaus wird eine heuristische statische Analyse des Quelltextes des CommonJS-Moduls durchgeführt, um eine bestmögliche statische Liste von Exporten zu erhalten, die im Namespace von Werten in `module.exports` bereitgestellt werden sollen. Dies ist notwendig, da diese Namespaces vor der Auswertung des CJS-Moduls erstellt werden müssen.

Diese CommonJS-Namespace-Objekte stellen auch den `default`-Export als benannten Export `'module.exports'` bereit, um eindeutig anzugeben, dass ihre Darstellung in CommonJS diesen Wert und nicht den Namespace-Wert verwendet. Dies spiegelt die Semantik der Behandlung des Exportnamens `'module.exports'` in der Interop-Unterstützung von [`require(esm)`](/de/nodejs/api/modules#loading-ecmascript-modules-using-require) wider.

Beim Importieren eines CommonJS-Moduls kann es zuverlässig mit dem ES-Modul-Standardimport oder seiner entsprechenden Syntax-Vereinfachung importiert werden:

```js [ESM]
import { default as cjs } from 'cjs';
// Identisch mit dem obigen
import cjsSugar from 'cjs';

console.log(cjs);
console.log(cjs === cjsSugar);
// Gibt aus:
//   <module.exports>
//   true
```
Dieses exotische Modul-Namespace-Objekt kann direkt beobachtet werden, entweder bei Verwendung von `import * as m from 'cjs'` oder einem dynamischen Import:

```js [ESM]
import * as m from 'cjs';
console.log(m);
console.log(m === await import('cjs'));
// Gibt aus:
//   [Module] { default: <module.exports>, 'module.exports': <module.exports> }
//   true
```
Für eine bessere Kompatibilität mit der bestehenden Verwendung im JS-Ökosystem versucht Node.js zusätzlich, die benannten CommonJS-Exporte jedes importierten CommonJS-Moduls zu ermitteln, um sie als separate ES-Modulexporte mithilfe eines statischen Analyseprozesses bereitzustellen.

Betrachten Sie beispielsweise ein CommonJS-Modul, das wie folgt geschrieben ist:

```js [CJS]
// cjs.cjs
exports.name = 'exported';
```
Das vorhergehende Modul unterstützt benannte Importe in ES-Modulen:

```js [ESM]
import { name } from './cjs.cjs';
console.log(name);
// Gibt aus: 'exported'

import cjs from './cjs.cjs';
console.log(cjs);
// Gibt aus: { name: 'exported' }

import * as m from './cjs.cjs';
console.log(m);
// Gibt aus:
//   [Module] {
//     default: { name: 'exported' },
//     'module.exports': { name: 'exported' },
//     name: 'exported'
//   }
```
Wie aus dem letzten Beispiel des protokollierten exotischen Modul-Namespace-Objekts ersichtlich ist, wird der `name`-Export aus dem `module.exports`-Objekt kopiert und direkt im ES-Modul-Namespace festgelegt, wenn das Modul importiert wird.

Live-Binding-Aktualisierungen oder neue Exporte, die zu `module.exports` hinzugefügt werden, werden für diese benannten Exporte nicht erkannt.

Die Erkennung benannter Exporte basiert auf allgemeinen Syntaxmustern, erkennt aber nicht immer benannte Exporte korrekt. In diesen Fällen kann die Verwendung der oben beschriebenen Standardimportform eine bessere Option sein.

Die Erkennung benannter Exporte deckt viele gängige Exportmuster, Reexportmuster sowie Build-Tool- und Transpiler-Ausgaben ab. Die genaue implementierte Semantik finden Sie unter [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer/tree/1.2.2).


### Unterschiede zwischen ES-Modulen und CommonJS {#differences-between-es-modules-and-commonjs}

#### Kein `require`, `exports` oder `module.exports` {#no-require-exports-or-moduleexports}

In den meisten Fällen kann das ES-Modul `import` verwendet werden, um CommonJS-Module zu laden.

Bei Bedarf kann eine `require`-Funktion innerhalb eines ES-Moduls mit [`module.createRequire()`](/de/nodejs/api/module#modulecreaterequirefilename) erstellt werden.

#### Kein `__filename` oder `__dirname` {#no-__filename-or-__dirname}

Diese CommonJS-Variablen sind in ES-Modulen nicht verfügbar.

`__filename`- und `__dirname`-Anwendungsfälle können über [`import.meta.filename`](/de/nodejs/api/esm#importmetafilename) und [`import.meta.dirname`](/de/nodejs/api/esm#importmetadirname) repliziert werden.

#### Kein Addon-Laden {#no-addon-loading}

[Addons](/de/nodejs/api/addons) werden derzeit nicht mit ES-Modulimporten unterstützt.

Sie können stattdessen mit [`module.createRequire()`](/de/nodejs/api/module#modulecreaterequirefilename) oder [`process.dlopen`](/de/nodejs/api/process#processdlopenmodule-filename-flags) geladen werden.

#### Kein `require.resolve` {#no-requireresolve}

Relative Auflösung kann über `new URL('./local', import.meta.url)` behandelt werden.

Für einen vollständigen `require.resolve`-Ersatz gibt es die [import.meta.resolve](/de/nodejs/api/esm#importmetaresolvespecifier)-API.

Alternativ kann `module.createRequire()` verwendet werden.

#### Kein `NODE_PATH` {#no-node_path}

`NODE_PATH` ist nicht Teil der Auflösung von `import`-Spezifizierern. Bitte verwenden Sie Symlinks, wenn dieses Verhalten gewünscht ist.

#### Kein `require.extensions` {#no-requireextensions}

`require.extensions` wird von `import` nicht verwendet. Module-Customization-Hooks können einen Ersatz bieten.

#### Kein `require.cache` {#no-requirecache}

`require.cache` wird von `import` nicht verwendet, da der ES-Modul-Loader einen eigenen separaten Cache hat.

## JSON-Module {#json-modules}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.1.0 | JSON-Module sind nicht mehr experimentell. |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Auf JSON-Dateien kann mit `import` verwiesen werden:

```js [ESM]
import packageConfig from './package.json' with { type: 'json' };
```
Die `with { type: 'json' }`-Syntax ist obligatorisch; siehe [Import-Attribute](/de/nodejs/api/esm#import-attributes).

Das importierte JSON stellt nur einen `default`-Export bereit. Es gibt keine Unterstützung für benannte Exporte. Es wird ein Cache-Eintrag im CommonJS-Cache erstellt, um Duplikate zu vermeiden. Das gleiche Objekt wird in CommonJS zurückgegeben, wenn das JSON-Modul bereits über denselben Pfad importiert wurde.


## Wasm-Module {#wasm-modules}

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Das Importieren von WebAssembly-Modulen wird unter dem Flag `--experimental-wasm-modules` unterstützt, wodurch alle `.wasm`-Dateien als normale Module importiert werden können und gleichzeitig ihre Modulimporte unterstützt werden.

Diese Integration entspricht dem [ES Module Integration Proposal for WebAssembly](https://github.com/webassembly/esm-integration).

Zum Beispiel ein `index.mjs` mit:

```js [ESM]
import * as M from './module.wasm';
console.log(M);
```
ausgeführt unter:

```bash [BASH]
node --experimental-wasm-modules index.mjs
```
würde die Exportschnittstelle für die Instanziierung von `module.wasm` bereitstellen.

## Top-Level `await` {#top-level-await}

**Hinzugefügt in: v14.8.0**

Das Schlüsselwort `await` kann im Top-Level-Body eines ECMAScript-Moduls verwendet werden.

Annahme einer `a.mjs` mit

```js [ESM]
export const five = await Promise.resolve(5);
```
Und einer `b.mjs` mit

```js [ESM]
import { five } from './a.mjs';

console.log(five); // Loggt `5`
```
```bash [BASH]
node b.mjs # funktioniert
```
Wenn ein Top-Level-`await`-Ausdruck niemals aufgelöst wird, beendet sich der `node`-Prozess mit dem [Statuscode](/de/nodejs/api/process#exit-codes) `13`.

```js [ESM]
import { spawn } from 'node:child_process';
import { execPath } from 'node:process';

spawn(execPath, [
  '--input-type=module',
  '--eval',
  // Niemals auflösendes Promise:
  'await new Promise(() => {})',
]).once('exit', (code) => {
  console.log(code); // Loggt `13`
});
```
## Loader {#loaders}

Die ehemalige Loader-Dokumentation befindet sich jetzt unter [Module: Anpassungshooks](/de/nodejs/api/module#customization-hooks).

## Auflösungs- und Ladealgorithmus {#resolution-and-loading-algorithm}

### Merkmale {#features}

Der Standard-Resolver hat die folgenden Eigenschaften:

- Dateibasierte URL-Auflösung, wie sie von ES-Modulen verwendet wird
- Relative und absolute URL-Auflösung
- Keine Standarderweiterungen
- Keine Ordner-Hauptdateien
- Bare-Specifier-Paketauflösungssuche über node_modules
- Schlägt nicht bei unbekannten Erweiterungen oder Protokollen fehl
- Kann optional einen Hinweis auf das Format für die Ladephase geben

Der Standard-Loader hat die folgenden Eigenschaften:

- Unterstützung für das Laden von integrierten Modulen über `node:`-URLs
- Unterstützung für das Laden von "Inline"-Modulen über `data:`-URLs
- Unterstützung für das Laden von `file:`-Modulen
- Schlägt bei jedem anderen URL-Protokoll fehl
- Schlägt bei unbekannten Erweiterungen für das Laden von `file:` fehl (unterstützt nur `.cjs`, `.js` und `.mjs`)


### Auflösungsalgorithmus {#resolution-algorithm}

Der Algorithmus zum Laden eines ES-Modulspezifizierers wird durch die unten stehende **ESM_RESOLVE**-Methode gegeben. Sie gibt die aufgelöste URL für einen Modulspezifizierer relativ zu einer parentURL zurück.

Der Auflösungsalgorithmus bestimmt die vollständig aufgelöste URL für einen Modul-Load zusammen mit seinem vorgeschlagenen Modulformat. Der Auflösungsalgorithmus bestimmt nicht, ob das Protokoll der aufgelösten URL geladen werden kann oder ob die Dateiendungen zulässig sind. Stattdessen werden diese Validierungen von Node.js während der Ladephase angewendet (z. B. wenn es aufgefordert wurde, eine URL zu laden, die ein Protokoll hat, das nicht `file:`, `data:` oder `node:` ist).

Der Algorithmus versucht auch, das Format der Datei basierend auf der Erweiterung zu bestimmen (siehe **ESM_FILE_FORMAT**-Algorithmus unten). Wenn er die Dateiendung nicht erkennt (z. B. wenn sie nicht `.mjs`, `.cjs` oder `.json` ist), wird das Format `undefined` zurückgegeben, was während der Ladephase einen Fehler auslöst.

Der Algorithmus zur Bestimmung des Modulformats einer aufgelösten URL wird durch **ESM_FILE_FORMAT** bereitgestellt, das das eindeutige Modulformat für jede Datei zurückgibt. Das Format *"module"* wird für ein ECMAScript-Modul zurückgegeben, während das Format *"commonjs"* verwendet wird, um das Laden über den Legacy-CommonJS-Loader anzuzeigen. Zusätzliche Formate wie *"addon"* können in zukünftigen Updates erweitert werden.

In den folgenden Algorithmen werden alle Subroutinenfehler als Fehler dieser Top-Level-Routinen weitergegeben, sofern nicht anders angegeben.

*defaultConditions* ist das bedingte Umgebungsnamen-Array `["node", "import"]`.

Der Resolver kann die folgenden Fehler auslösen:

- *Ungültiger Modulspezifizierer*: Der Modulspezifizierer ist eine ungültige URL, ein Paketname oder ein Paketunterpfad-Spezifizierer.
- *Ungültige Paketkonfiguration*: Die package.json-Konfiguration ist ungültig oder enthält eine ungültige Konfiguration.
- *Ungültiges Paketziel*: Paket-Exporte oder -Importe definieren ein Zielmodul für das Paket, das ein ungültiger Typ oder ein ungültiges String-Ziel ist.
- *Paketpfad nicht exportiert*: Paket-Exporte definieren oder erlauben keinen Zielunterpfad im Paket für das angegebene Modul.
- *Paketimport nicht definiert*: Paketimporte definieren den Spezifizierer nicht.
- *Modul nicht gefunden*: Das angeforderte Paket oder Modul existiert nicht.
- *Nicht unterstützter Verzeichnisimport*: Der aufgelöste Pfad entspricht einem Verzeichnis, das kein unterstütztes Ziel für Modulimporte ist.


### Spezifikation des Auflösungsalgorithmus {#resolution-algorithm-specification}

**ESM_RESOLVE**(*specifier*, *parentURL*)

**PACKAGE_RESOLVE**(*packageSpecifier*, *parentURL*)

**PACKAGE_SELF_RESOLVE**(*packageName*, *packageSubpath*, *parentURL*)

**PACKAGE_EXPORTS_RESOLVE**(*packageURL*, *subpath*, *exports*, *conditions*)

**PACKAGE_IMPORTS_RESOLVE**(*specifier*, *parentURL*, *conditions*)

**PACKAGE_IMPORTS_EXPORTS_RESOLVE**(*matchKey*, *matchObj*, *packageURL*, *isImports*, *conditions*)

**PATTERN_KEY_COMPARE**(*keyA*, *keyB*)

**PACKAGE_TARGET_RESOLVE**(*packageURL*, *target*, *patternMatch*, *isImports*, *conditions*)

**ESM_FILE_FORMAT**(*url*)

**LOOKUP_PACKAGE_SCOPE**(*url*)

**READ_PACKAGE_JSON**(*packageURL*)

**DETECT_MODULE_SYNTAX**(*source*)

### Anpassung des ESM-Spezifizierer-Auflösungsalgorithmus {#customizing-esm-specifier-resolution-algorithm}

[Modul-Anpassungshooks](/de/nodejs/api/module#customization-hooks) bieten einen Mechanismus zur Anpassung des ESM-Spezifizierer-Auflösungsalgorithmus. Ein Beispiel, das die Auflösung im CommonJS-Stil für ESM-Spezifizierer bietet, ist [commonjs-extension-resolution-loader](https://github.com/nodejs/loaders-test/tree/main/commonjs-extension-resolution-loader).

