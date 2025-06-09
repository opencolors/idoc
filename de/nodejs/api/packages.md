---
title: Node.js Paketdokumentation
description: Erkunden Sie die offizielle Node.js-Dokumentation zu Paketen, einschließlich der Verwaltung, Erstellung und Veröffentlichung von Paketen, sowie Details zu package.json, Abhängigkeiten und Paketverwaltungstools.
head:
  - - meta
    - name: og:title
      content: Node.js Paketdokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erkunden Sie die offizielle Node.js-Dokumentation zu Paketen, einschließlich der Verwaltung, Erstellung und Veröffentlichung von Paketen, sowie Details zu package.json, Abhängigkeiten und Paketverwaltungstools.
  - - meta
    - name: twitter:title
      content: Node.js Paketdokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erkunden Sie die offizielle Node.js-Dokumentation zu Paketen, einschließlich der Verwaltung, Erstellung und Veröffentlichung von Paketen, sowie Details zu package.json, Abhängigkeiten und Paketverwaltungstools.
---


# Module: Pakete {#modules-packages}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.13.0, v12.20.0 | Unterstützung für `"exports"`-Muster hinzugefügt. |
| v14.6.0, v12.19.0 | Paketfeld `"imports"` hinzugefügt. |
| v13.7.0, v12.17.0 | Bedingte Exporte freigegeben. |
| v13.7.0, v12.16.0 | Option `--experimental-conditional-exports` entfernt. In 12.16.0 befinden sich bedingte Exporte noch hinter `--experimental-modules`. |
| v13.6.0, v12.16.0 | Selbstbezugnahme eines Pakets über seinen Namen freigegeben. |
| v12.7.0 | `"exports"` `package.json`-Feld als leistungsfähigere Alternative zum klassischen `"main"`-Feld eingeführt. |
| v12.0.0 | Unterstützung für ES-Module mit der Dateiendung `.js` über das `package.json`-Feld `"type"` hinzugefügt. |
:::

## Einführung {#introduction}

Ein Paket ist eine Ordnerstruktur, die durch eine `package.json`-Datei beschrieben wird. Das Paket besteht aus dem Ordner, der die `package.json`-Datei enthält, und allen Unterordnern bis zum nächsten Ordner, der eine andere `package.json`-Datei enthält, oder einem Ordner namens `node_modules`.

Diese Seite bietet Anleitungen für Paketautoren, die `package.json`-Dateien schreiben, zusammen mit einer Referenz für die von Node.js definierten [`package.json`](/de/nodejs/api/packages#nodejs-packagejson-field-definitions)-Felder.

## Bestimmung des Modulsystems {#determining-module-system}

### Einführung {#introduction_1}

Node.js behandelt die folgenden als [ES-Module](/de/nodejs/api/esm), wenn sie an `node` als anfängliche Eingabe übergeben oder von `import`-Anweisungen oder `import()`-Ausdrücken referenziert werden:

-  Dateien mit der Erweiterung `.mjs`.
-  Dateien mit der Erweiterung `.js`, wenn die nächstgelegene übergeordnete `package.json`-Datei ein Feld [`"type"`](/de/nodejs/api/packages#type) auf oberster Ebene mit dem Wert `"module"` enthält.
-  Zeichenketten, die als Argument an `--eval` übergeben oder über `STDIN` an `node` weitergeleitet werden, mit dem Flag `--input-type=module`.
-  Code, der Syntax enthält, die nur erfolgreich als [ES-Module](/de/nodejs/api/esm) geparst wird, wie z. B. `import`- oder `export`-Anweisungen oder `import.meta`, ohne explizite Markierung, wie er interpretiert werden soll. Explizite Markierungen sind `.mjs`- oder `.cjs`-Erweiterungen, `package.json`-Felder `"type"` mit den Werten `"module"` oder `"commonjs"` oder das Flag `--input-type`. Dynamische `import()`-Ausdrücke werden entweder in CommonJS- oder ES-Modulen unterstützt und würden nicht erzwingen, dass eine Datei als ES-Modul behandelt wird. Siehe [Syntaxerkennung](/de/nodejs/api/packages#syntax-detection).

Node.js behandelt die folgenden als [CommonJS](/de/nodejs/api/modules), wenn sie an `node` als anfängliche Eingabe übergeben oder von `import`-Anweisungen oder `import()`-Ausdrücken referenziert werden:

-  Dateien mit der Erweiterung `.cjs`.
-  Dateien mit der Erweiterung `.js`, wenn die nächstgelegene übergeordnete `package.json`-Datei ein Feld [`"type"`](/de/nodejs/api/packages#type) auf oberster Ebene mit dem Wert `"commonjs"` enthält.
-  Zeichenketten, die als Argument an `--eval` oder `--print` übergeben oder über `STDIN` an `node` weitergeleitet werden, mit dem Flag `--input-type=commonjs`.
-  Dateien mit der Erweiterung `.js` ohne übergeordnete `package.json`-Datei oder wo der nächstgelegenen übergeordneten `package.json`-Datei ein `type`-Feld fehlt und wo der Code erfolgreich als CommonJS ausgewertet werden kann. Mit anderen Worten, Node.js versucht, solche "mehrdeutigen" Dateien zuerst als CommonJS auszuführen, und wird versuchen, sie als ES-Module auszuwerten, wenn die Auswertung als CommonJS fehlschlägt, weil der Parser ES-Modul-Syntax gefunden hat.

Das Schreiben von ES-Modul-Syntax in "mehrdeutigen" Dateien verursacht Leistungseinbußen, und daher wird empfohlen, dass Autoren so explizit wie möglich sind. Insbesondere sollten Paketautoren immer das Feld [`"type"`](/de/nodejs/api/packages#type) in ihren `package.json`-Dateien angeben, auch in Paketen, in denen alle Quellen CommonJS sind. Explizit über den `type` des Pakets zu sein, macht das Paket zukunftssicher, falls sich der Standardtyp von Node.js jemals ändert, und es erleichtert auch Build-Tools und Ladeprogrammen die Bestimmung, wie die Dateien im Paket interpretiert werden sollen.


### Syntaxerkennung {#syntax-detection}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.7.0 | Syntaxerkennung ist standardmäßig aktiviert. |
| v21.1.0, v20.10.0 | Hinzugefügt in: v21.1.0, v20.10.0 |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).2 - Releasekandidat
:::

Node.js untersucht den Quellcode von uneindeutigen Eingaben, um festzustellen, ob er ES-Modul-Syntax enthält. Wenn eine solche Syntax erkannt wird, wird die Eingabe als ES-Modul behandelt.

Uneindeutige Eingaben sind definiert als:

- Dateien mit der Erweiterung `.js` oder ohne Erweiterung; und entweder ohne steuernde `package.json`-Datei oder eine, die kein `type`-Feld enthält.
- String-Eingabe (`--eval` oder `STDIN`), wenn `--input-type` nicht angegeben ist.

ES-Modul-Syntax ist definiert als Syntax, die einen Fehler auslösen würde, wenn sie als CommonJS ausgewertet würde. Dies umfasst Folgendes:

- `import`-Anweisungen (aber *nicht* `import()`-Ausdrücke, die in CommonJS gültig sind).
- `export`-Anweisungen.
- `import.meta`-Referenzen.
- `await` auf der obersten Ebene eines Moduls.
- Lexikalische Neudeklarationen der CommonJS-Wrapper-Variablen (`require`, `module`, `exports`, `__dirname`, `__filename`).

### Module-Loader {#modules-loaders}

Node.js verfügt über zwei Systeme zum Auflösen eines Bezeichners und zum Laden von Modulen.

Es gibt den CommonJS-Modul-Loader:

- Er ist vollständig synchron.
- Er ist für die Verarbeitung von `require()`-Aufrufen verantwortlich.
- Er ist monkey-patchbar.
- Er unterstützt [Ordner als Module](/de/nodejs/api/modules#folders-as-modules).
- Wenn beim Auflösen eines Bezeichners keine genaue Übereinstimmung gefunden wird, versucht er, Erweiterungen (`.js`, `.json` und schließlich `.node`) hinzuzufügen und dann zu versuchen, [Ordner als Module](/de/nodejs/api/modules#folders-as-modules) aufzulösen.
- Er behandelt `.json` als JSON-Textdateien.
- `.node`-Dateien werden als kompilierte Addon-Module interpretiert, die mit `process.dlopen()` geladen werden.
- Er behandelt alle Dateien ohne die Erweiterungen `.json` oder `.node` als JavaScript-Textdateien.
- Er kann nur verwendet werden, um [ECMAScript-Module aus CommonJS-Modulen zu laden](/de/nodejs/api/modules#loading-ecmascript-modules-using-require), wenn der Modulgraf synchron ist (der kein `await` auf oberster Ebene enthält). Wenn er zum Laden einer JavaScript-Textdatei verwendet wird, die kein ECMAScript-Modul ist, wird die Datei als CommonJS-Modul geladen.

Es gibt den ECMAScript-Modul-Loader:

- Er ist asynchron, es sei denn, er wird zum Laden von Modulen für `require()` verwendet.
- Er ist für die Verarbeitung von `import`-Anweisungen und `import()`-Ausdrücken verantwortlich.
- Er ist nicht monkey-patchbar, kann aber mit [Loader-Hooks](/de/nodejs/api/esm#loaders) angepasst werden.
- Er unterstützt keine Ordner als Module, Verzeichnisindizes (z. B. `'./startup/index.js'`) müssen vollständig angegeben werden.
- Er führt keine Erweiterungssuche durch. Eine Dateierweiterung muss angegeben werden, wenn der Bezeichner eine relative oder absolute Datei-URL ist.
- Er kann JSON-Module laden, aber ein Importtypattribut ist erforderlich.
- Er akzeptiert nur die Erweiterungen `.js`, `.mjs` und `.cjs` für JavaScript-Textdateien.
- Er kann verwendet werden, um JavaScript-CommonJS-Module zu laden. Solche Module werden durch den `cjs-module-lexer` geleitet, um zu versuchen, benannte Exporte zu identifizieren, die verfügbar sind, wenn sie durch statische Analyse bestimmt werden können. Importierte CommonJS-Module haben ihre URLs in absolute Pfade konvertiert und werden dann über den CommonJS-Modul-Loader geladen.


### `package.json` und Dateiendungen {#packagejson-and-file-extensions}

Innerhalb eines Pakets definiert das Feld [`"type"`](/de/nodejs/api/packages#type) in der [`package.json`](/de/nodejs/api/packages#nodejs-packagejson-field-definitions), wie Node.js `.js`-Dateien interpretieren soll. Wenn eine `package.json`-Datei kein `"type"`-Feld hat, werden `.js`-Dateien als [CommonJS](/de/nodejs/api/modules) behandelt.

Ein `"type"`-Wert von `"module"` in einer `package.json` weist Node.js an, `.js`-Dateien innerhalb dieses Pakets als mit [ES-Modul](/de/nodejs/api/esm)-Syntax zu interpretieren.

Das Feld `"type"` gilt nicht nur für initiale Einstiegspunkte (`node my-app.js`), sondern auch für Dateien, auf die von `import`-Anweisungen und `import()`-Ausdrücken verwiesen wird.

```js [ESM]
// my-app.js, wird als ES-Modul behandelt, da sich im selben Ordner eine package.json
// Datei mit "type": "module" befindet.

import './startup/init.js';
// Wird als ES-Modul geladen, da ./startup keine package.json-Datei enthält
// und daher den "type"-Wert von einer Ebene höher erbt.

import 'commonjs-package';
// Wird als CommonJS geladen, da ./node_modules/commonjs-package/package.json
// entweder kein "type"-Feld enthält oder "type": "commonjs" enthält.

import './node_modules/commonjs-package/index.js';
// Wird als CommonJS geladen, da ./node_modules/commonjs-package/package.json
// entweder kein "type"-Feld enthält oder "type": "commonjs" enthält.
```
Dateien, die mit `.mjs` enden, werden immer als [ES-Module](/de/nodejs/api/esm) geladen, unabhängig von der nächstgelegenen übergeordneten `package.json`.

Dateien, die mit `.cjs` enden, werden immer als [CommonJS](/de/nodejs/api/modules) geladen, unabhängig von der nächstgelegenen übergeordneten `package.json`.

```js [ESM]
import './legacy-file.cjs';
// Wird als CommonJS geladen, da .cjs immer als CommonJS geladen wird.

import 'commonjs-package/src/index.mjs';
// Wird als ES-Modul geladen, da .mjs immer als ES-Modul geladen wird.
```
Die Erweiterungen `.mjs` und `.cjs` können verwendet werden, um Typen innerhalb desselben Pakets zu mischen:

- Innerhalb eines `"type": "module"`-Pakets kann Node.js angewiesen werden, eine bestimmte Datei als [CommonJS](/de/nodejs/api/modules) zu interpretieren, indem sie mit der Erweiterung `.cjs` benannt wird (da sowohl `.js`- als auch `.mjs`-Dateien innerhalb eines `"module"`-Pakets als ES-Module behandelt werden).
- Innerhalb eines `"type": "commonjs"`-Pakets kann Node.js angewiesen werden, eine bestimmte Datei als [ES-Modul](/de/nodejs/api/esm) zu interpretieren, indem sie mit der Erweiterung `.mjs` benannt wird (da sowohl `.js`- als auch `.cjs`-Dateien innerhalb eines `"commonjs"`-Pakets als CommonJS behandelt werden).


### `--input-type`-Flag {#--input-type-flag}

**Hinzugefügt in: v12.0.0**

Zeichenketten, die als Argument an `--eval` (oder `-e`) übergeben oder über `STDIN` an `node` weitergeleitet werden, werden als [ES-Module](/de/nodejs/api/esm) behandelt, wenn das Flag `--input-type=module` gesetzt ist.

```bash [BASH]
node --input-type=module --eval "import { sep } from 'node:path'; console.log(sep);"

echo "import { sep } from 'node:path'; console.log(sep);" | node --input-type=module
```
Der Vollständigkeit halber gibt es auch `--input-type=commonjs`, um Zeichenketteneingaben explizit als CommonJS auszuführen. Dies ist das Standardverhalten, wenn `--input-type` nicht angegeben ist.

## Bestimmung des Paketmanagers {#determining-package-manager}

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Obwohl erwartet wird, dass alle Node.js-Projekte nach der Veröffentlichung von allen Paketmanagern installiert werden können, müssen ihre Entwicklungsteams häufig einen bestimmten Paketmanager verwenden. Um diesen Prozess zu vereinfachen, wird Node.js mit einem Tool namens [Corepack](/de/nodejs/api/corepack) ausgeliefert, das darauf abzielt, alle Paketmanager in Ihrer Umgebung transparent verfügbar zu machen - vorausgesetzt, Sie haben Node.js installiert.

Standardmäßig erzwingt Corepack keinen bestimmten Paketmanager und verwendet die generischen "Last Known Good"-Versionen, die mit jeder Node.js-Version verbunden sind, aber Sie können diese Erfahrung verbessern, indem Sie das Feld [`"packageManager"`](/de/nodejs/api/packages#packagemanager) in der `package.json` Ihres Projekts festlegen.

## Paket-Einstiegspunkte {#package-entry-points}

In der `package.json`-Datei eines Pakets können zwei Felder Einstiegspunkte für ein Paket definieren: [`"main"`](/de/nodejs/api/packages#main) und [`"exports"`](/de/nodejs/api/packages#exports). Beide Felder gelten sowohl für ES-Module als auch für CommonJS-Module-Einstiegspunkte.

Das Feld [`"main"`](/de/nodejs/api/packages#main) wird in allen Versionen von Node.js unterstützt, aber seine Möglichkeiten sind begrenzt: Es definiert nur den Haupteinstiegspunkt des Pakets.

Das Feld [`"exports"`](/de/nodejs/api/packages#exports) bietet eine moderne Alternative zu [`"main"`](/de/nodejs/api/packages#main) und ermöglicht die Definition mehrerer Einstiegspunkte, die Unterstützung für die bedingte Auflösung von Einträgen zwischen Umgebungen und **verhindert alle anderen Einstiegspunkte außer denen, die in <a href="#exports"><code>"exports"</code></a> definiert sind**. Diese Kapselung ermöglicht es Modulautoren, die öffentliche Schnittstelle für ihr Paket klar zu definieren.

Für neue Pakete, die auf die aktuell unterstützten Versionen von Node.js abzielen, wird das Feld [`"exports"`](/de/nodejs/api/packages#exports) empfohlen. Für Pakete, die Node.js 10 und darunter unterstützen, ist das Feld [`"main"`](/de/nodejs/api/packages#main) erforderlich. Wenn sowohl [`"exports"`](/de/nodejs/api/packages#exports) als auch [`"main"`](/de/nodejs/api/packages#main) definiert sind, hat das Feld [`"exports"`](/de/nodejs/api/packages#exports) in unterstützten Versionen von Node.js Vorrang vor [`"main"`](/de/nodejs/api/packages#main).

[Bedingte Exporte](/de/nodejs/api/packages#conditional-exports) können innerhalb von [`"exports"`](/de/nodejs/api/packages#exports) verwendet werden, um unterschiedliche Paketeinstiegspunkte pro Umgebung zu definieren, einschließlich der Frage, ob auf das Paket über `require` oder über `import` verwiesen wird. Weitere Informationen zur Unterstützung von CommonJS- und ES-Modulen in einem einzigen Paket finden Sie im Abschnitt [Dual CommonJS/ES module packages](/de/nodejs/api/packages#dual-commonjses-module-packages).

Vorhandene Pakete, die das Feld [`"exports"`](/de/nodejs/api/packages#exports) einführen, verhindern, dass Konsumenten des Pakets Einstiegspunkte verwenden, die nicht definiert sind, einschließlich der [`package.json`](/de/nodejs/api/packages#nodejs-packagejson-field-definitions) (z. B. `require('your-package/package.json')`). **Dies wird wahrscheinlich eine Breaking Change sein.**

Um die Einführung von [`"exports"`](/de/nodejs/api/packages#exports) nicht zu einem Breaking Change zu machen, stellen Sie sicher, dass jeder zuvor unterstützte Einstiegspunkt exportiert wird. Es ist am besten, Einstiegspunkte explizit anzugeben, damit die öffentliche API des Pakets gut definiert ist. Beispielsweise könnte ein Projekt, das zuvor `main`, `lib`, `feature` und die `package.json` exportiert hat, die folgende `package.exports` verwenden:

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/index": "./lib/index.js",
    "./lib/index.js": "./lib/index.js",
    "./feature": "./feature/index.js",
    "./feature/index": "./feature/index.js",
    "./feature/index.js": "./feature/index.js",
    "./package.json": "./package.json"
  }
}
```
Alternativ könnte ein Projekt ganze Ordner sowohl mit als auch ohne Subpfade mit Erweiterungen mithilfe von Exportmustern exportieren:

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/*": "./lib/*.js",
    "./lib/*.js": "./lib/*.js",
    "./feature": "./feature/index.js",
    "./feature/*": "./feature/*.js",
    "./feature/*.js": "./feature/*.js",
    "./package.json": "./package.json"
  }
}
```
Wobei das Obige die Abwärtskompatibilität für alle kleineren Paketversionen bietet, kann eine zukünftige Hauptänderung für das Paket die Exporte dann ordnungsgemäß auf nur die spezifischen Feature-Exporte beschränken:

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./feature/*.js": "./feature/*.js",
    "./feature/internal/*": null
  }
}
```

### Export des Haupteinstiegspunkts {#main-entry-point-export}

Beim Schreiben eines neuen Pakets wird empfohlen, das Feld [`"exports"`](/de/nodejs/api/packages#exports) zu verwenden:

```json [JSON]
{
  "exports": "./index.js"
}
```
Wenn das Feld [`"exports"`](/de/nodejs/api/packages#exports) definiert ist, werden alle Subpfade des Pakets gekapselt und stehen Importeuren nicht mehr zur Verfügung. Beispielsweise wirft `require('pkg/subpath.js')` einen [`ERR_PACKAGE_PATH_NOT_EXPORTED`](/de/nodejs/api/errors#err_package_path_not_exported)-Fehler.

Diese Kapselung von Exports bietet zuverlässigere Garantien über Paketschnittstellen für Tools und bei der Handhabung von Semver-Upgrades für ein Paket. Es ist keine starke Kapselung, da ein direktes Require eines absoluten Subpfads des Pakets, wie z. B. `require('/path/to/node_modules/pkg/subpath.js')`, weiterhin `subpath.js` laden wird.

Alle derzeit unterstützten Versionen von Node.js und moderne Build-Tools unterstützen das Feld `"exports"`. Für Projekte, die eine ältere Version von Node.js oder ein zugehöriges Build-Tool verwenden, kann die Kompatibilität erreicht werden, indem das Feld `"main"` zusammen mit `"exports"` auf dasselbe Modul verweist:

```json [JSON]
{
  "main": "./index.js",
  "exports": "./index.js"
}
```
### Subpath-Exporte {#subpath-exports}

**Hinzugefügt in: v12.7.0**

Bei Verwendung des Felds [`"exports"`](/de/nodejs/api/packages#exports) können benutzerdefinierte Subpfade zusammen mit dem Haupteinstiegspunkt definiert werden, indem der Haupteinstiegspunkt als der `"."`-Subpfad behandelt wird:

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./submodule.js": "./src/submodule.js"
  }
}
```
Jetzt kann nur der definierte Subpfad in [`"exports"`](/de/nodejs/api/packages#exports) von einem Consumer importiert werden:

```js [ESM]
import submodule from 'es-module-package/submodule.js';
// Lädt ./node_modules/es-module-package/src/submodule.js
```
Während andere Subpfade einen Fehler verursachen:

```js [ESM]
import submodule from 'es-module-package/private-module.js';
// Wirft ERR_PACKAGE_PATH_NOT_EXPORTED
```
#### Erweiterungen in Subpfaden {#extensions-in-subpaths}

Paketautoren sollten entweder Subpfade mit Erweiterung (`import 'pkg/subpath.js'`) oder ohne Erweiterung (`import 'pkg/subpath'`) in ihren Exports bereitstellen. Dies stellt sicher, dass es nur einen Subpfad für jedes exportierte Modul gibt, sodass alle Abhängigen denselben konsistenten Bezeichner importieren, wodurch der Paketvertrag für Verbraucher klar bleibt und die Paket-Subpfad-Vervollständigungen vereinfacht werden.

Traditionell neigten Pakete dazu, den Stil ohne Erweiterung zu verwenden, der die Vorteile der Lesbarkeit und der Maskierung des tatsächlichen Pfads der Datei innerhalb des Pakets hat.

Da [Import Maps](https://github.com/WICG/import-maps) jetzt einen Standard für die Paketauflösung in Browsern und anderen JavaScript-Laufzeitumgebungen bereitstellen, kann die Verwendung des Stils ohne Erweiterung zu aufgeblähten Import Map-Definitionen führen. Explizite Dateierweiterungen können dieses Problem vermeiden, indem sie es der Import Map ermöglichen, eine [Paketordnerzuordnung](https://github.com/WICG/import-maps#packages-via-trailing-slashes) zu verwenden, um mehrere Subpfade nach Möglichkeit zuzuordnen, anstatt einen separaten Map-Eintrag pro Paket-Subpfad-Export. Dies spiegelt auch die Anforderung wider, [den vollständigen Bezeichnerpfad](/de/nodejs/api/esm#mandatory-file-extensions) in relativen und absoluten Importbezeichnern zu verwenden.


### Exports Zucker {#exports-sugar}

**Hinzugefügt in: v12.11.0**

Wenn der `"."` Export der einzige Export ist, bietet das Feld [`"exports"`](/de/nodejs/api/packages#exports) Zucker für diesen Fall, da es der direkte Wert des Feldes [`"exports"`](/de/nodejs/api/packages#exports) ist.

```json [JSON]
{
  "exports": {
    ".": "./index.js"
  }
}
```
kann geschrieben werden als:

```json [JSON]
{
  "exports": "./index.js"
}
```
### Subpfad-Importe {#subpath-imports}

**Hinzugefügt in: v14.6.0, v12.19.0**

Zusätzlich zum Feld [`"exports"`](/de/nodejs/api/packages#exports) gibt es ein Paketfeld `"imports"`, um private Zuordnungen zu erstellen, die nur für Importspezifizierer innerhalb des Pakets selbst gelten.

Einträge im Feld `"imports"` müssen immer mit `#` beginnen, um sicherzustellen, dass sie von externen Paketspezifizierern unterschieden werden.

Zum Beispiel kann das Imports-Feld verwendet werden, um die Vorteile bedingter Exporte für interne Module zu nutzen:

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```
wobei `import '#dep'` nicht die Auflösung des externen Pakets `dep-node-native` erhält (einschließlich seiner Exporte wiederum), sondern die lokale Datei `./dep-polyfill.js` relativ zum Paket in anderen Umgebungen erhält.

Im Gegensatz zum Feld `"exports"` erlaubt das Feld `"imports"` die Zuordnung zu externen Paketen.

Die Auflösungsregeln für das Imports-Feld sind ansonsten analog zum Exports-Feld.

### Subpfad-Muster {#subpath-patterns}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.10.0, v14.19.0 | Unterstützung für Musteranhänge im "imports"-Feld. |
| v16.9.0, v14.19.0 | Unterstützung für Musteranhänge. |
| v14.13.0, v12.20.0 | Hinzugefügt in: v14.13.0, v12.20.0 |
:::

Für Pakete mit einer geringen Anzahl von Exporten oder Importen empfehlen wir, jeden Subpfadeintrag explizit aufzulisten. Für Pakete mit einer großen Anzahl von Subpfaden kann dies jedoch zu `package.json` -Aufblähung und Wartungsproblemen führen.

Für diese Anwendungsfälle können stattdessen Subpfad-Exportmuster verwendet werden:

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js"
  },
  "imports": {
    "#internal/*.js": "./src/internal/*.js"
  }
}
```
**<code>*</code>-Zuordnungen legen verschachtelte Subpfade offen, da es sich nur um eine String-Ersetzungssyntax handelt.**

Alle Instanzen von `*` auf der rechten Seite werden dann durch diesen Wert ersetzt, auch wenn er `/`-Trennzeichen enthält.

```js [ESM]
import featureX from 'es-module-package/features/x.js';
// Lädt ./node_modules/es-module-package/src/features/x.js

import featureY from 'es-module-package/features/y/y.js';
// Lädt ./node_modules/es-module-package/src/features/y/y.js

import internalZ from '#internal/z.js';
// Lädt ./node_modules/es-module-package/src/internal/z.js
```
Dies ist eine direkte statische Übereinstimmung und Ersetzung ohne spezielle Behandlung für Dateierweiterungen. Die Einbeziehung von `"*.js"` auf beiden Seiten der Zuordnung beschränkt die offengelegten Paketexporte auf JS-Dateien.

Die Eigenschaft, dass Exporte statisch aufzählbar sind, wird mit Exportmustern beibehalten, da die einzelnen Exporte für ein Paket bestimmt werden können, indem das Zielmuster auf der rechten Seite als `**` Glob gegen die Liste der Dateien innerhalb des Pakets behandelt wird. Da `node_modules`-Pfade in Exportzielen verboten sind, hängt diese Erweiterung nur von den Dateien des Pakets selbst ab.

Um private Unterordner von Mustern auszuschließen, können `null`-Ziele verwendet werden:

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js",
    "./features/private-internal/*": null
  }
}
```
```js [ESM]
import featureInternal from 'es-module-package/features/private-internal/m.js';
// Wirft: ERR_PACKAGE_PATH_NOT_EXPORTED

import featureX from 'es-module-package/features/x.js';
// Lädt ./node_modules/es-module-package/src/features/x.js
```

### Bedingte Exporte {#conditional-exports}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.7.0, v12.16.0 | Bedingte Exporte als nicht-experimentell markiert. |
| v13.2.0, v12.16.0 | Hinzugefügt in: v13.2.0, v12.16.0 |
:::

Bedingte Exporte bieten eine Möglichkeit, verschiedenen Pfaden in Abhängigkeit von bestimmten Bedingungen zuzuordnen. Sie werden sowohl für CommonJS- als auch für ES-Modulimporte unterstützt.

Zum Beispiel kann ein Paket, das unterschiedliche ES-Modulexporte für `require()` und `import` bereitstellen möchte, wie folgt geschrieben werden:

```json [JSON]
// package.json
{
  "exports": {
    "import": "./index-module.js",
    "require": "./index-require.cjs"
  },
  "type": "module"
}
```
Node.js implementiert die folgenden Bedingungen, aufgelistet von der spezifischsten zur allgemeinsten, da Bedingungen definiert werden sollten:

- `"node-addons"` - ähnlich wie `"node"` und passt für jede Node.js-Umgebung. Diese Bedingung kann verwendet werden, um einen Einstiegspunkt bereitzustellen, der native C++-Addons verwendet, im Gegensatz zu einem Einstiegspunkt, der universeller ist und nicht auf native Addons angewiesen ist. Diese Bedingung kann über das [`--no-addons` Flag](/de/nodejs/api/cli#--no-addons) deaktiviert werden.
- `"node"` - passt für jede Node.js-Umgebung. Kann eine CommonJS- oder ES-Moduldatei sein. *In den meisten Fällen ist es nicht erforderlich, die Node.js-Plattform explizit zu nennen.*
- `"import"` - passt, wenn das Paket über `import` oder `import()` geladen wird, oder über eine Import- oder Auflösungsoperation der obersten Ebene durch den ECMAScript-Modul-Loader. Gilt unabhängig vom Modulformat der Zieldatei. *Immer gegenseitig ausschließend mit <code>"require"</code>.*
- `"require"` - passt, wenn das Paket über `require()` geladen wird. Die referenzierte Datei sollte mit `require()` ladbar sein, obwohl die Bedingung unabhängig vom Modulformat der Zieldatei übereinstimmt. Erwartete Formate sind CommonJS, JSON, native Addons und ES-Module. *Immer gegenseitig
ausschließend mit <code>"import"</code>.*
- `"module-sync"` - passt, unabhängig davon, ob das Paket über `import`, `import()` oder `require()` geladen wird. Das Format wird als ES-Module erwartet, das keine Top-Level-Await in seinem Modulgraphen enthält - wenn dies der Fall ist, wird `ERR_REQUIRE_ASYNC_MODULE` ausgelöst, wenn das Modul `require()`-ed wird.
- `"default"` - der generische Fallback, der immer passt. Kann eine CommonJS- oder ES-Moduldatei sein. *Diese Bedingung sollte immer zuletzt stehen.*

Innerhalb des [`"exports"`](/de/nodejs/api/packages#exports)-Objekts ist die Reihenfolge der Schlüssel von Bedeutung. Während des Bedingungsabgleichs haben frühere Einträge eine höhere Priorität und Vorrang vor späteren Einträgen. *Die allgemeine Regel ist, dass Bedingungen von der spezifischsten zur
allgemeinsten in der Objektanordnung erfolgen sollten*.

Die Verwendung der Bedingungen `"import"` und `"require"` kann zu einigen Gefahren führen, die im Abschnitt [Duale CommonJS/ES-Modul-Pakete](/de/nodejs/api/packages#dual-commonjses-module-packages) näher erläutert werden.

Die Bedingung `"node-addons"` kann verwendet werden, um einen Einstiegspunkt bereitzustellen, der native C++-Addons verwendet. Diese Bedingung kann jedoch über das [`--no-addons` Flag](/de/nodejs/api/cli#--no-addons) deaktiviert werden. Bei Verwendung von `"node-addons"` wird empfohlen, `"default"` als eine Verbesserung zu betrachten, die einen universelleren Einstiegspunkt bietet, z. B. die Verwendung von WebAssembly anstelle eines nativen Addons.

Bedingte Exporte können auch auf Export-Subpfade erweitert werden, zum Beispiel:

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./feature.js": {
      "node": "./feature-node.js",
      "default": "./feature.js"
    }
  }
}
```
Definiert ein Paket, bei dem `require('pkg/feature.js')` und `import 'pkg/feature.js'` unterschiedliche Implementierungen zwischen Node.js und anderen JS-Umgebungen bereitstellen könnten.

Wenn Sie Umgebungszweige verwenden, fügen Sie nach Möglichkeit immer eine `"default"`-Bedingung ein. Die Bereitstellung einer `"default"`-Bedingung stellt sicher, dass alle unbekannten JS-Umgebungen diese universelle Implementierung verwenden können, wodurch vermieden wird, dass diese JS-Umgebungen vorgeben müssen, bestehende Umgebungen zu sein, um Pakete mit bedingten Exporten zu unterstützen. Aus diesem Grund ist die Verwendung von `"node"`- und `"default"`-Bedingungszweigen in der Regel vorzuziehen gegenüber der Verwendung von `"node"`- und `"browser"`-Bedingungszweigen.


### Verschachtelte Bedingungen {#nested-conditions}

Zusätzlich zu direkten Zuordnungen unterstützt Node.js auch verschachtelte Bedingungsobjekte.

Um beispielsweise ein Paket zu definieren, das nur Dual-Mode-Einstiegspunkte für die Verwendung in Node.js, aber nicht im Browser hat:

```json [JSON]
{
  "exports": {
    "node": {
      "import": "./feature-node.mjs",
      "require": "./feature-node.cjs"
    },
    "default": "./feature.mjs"
  }
}
```
Bedingungen werden weiterhin wie bei flachen Bedingungen der Reihe nach abgeglichen. Wenn eine verschachtelte Bedingung keine Zuordnung hat, werden die verbleibenden Bedingungen der übergeordneten Bedingung weiterhin geprüft. Auf diese Weise verhalten sich verschachtelte Bedingungen analog zu verschachtelten JavaScript-`if`-Anweisungen.

### Auflösen von Benutzerbedingungen {#resolving-user-conditions}

**Hinzugefügt in: v14.9.0, v12.19.0**

Beim Ausführen von Node.js können benutzerdefinierte Benutzerbedingungen mit dem Flag `--conditions` hinzugefügt werden:

```bash [BASH]
node --conditions=development index.js
```
was dann die Bedingung `"development"` in Paketimporten und -exporten auflösen würde, während die bestehenden Bedingungen `"node"`, `"node-addons"`, `"default"`, `"import"` und `"require"` entsprechend aufgelöst werden.

Beliebig viele benutzerdefinierte Bedingungen können mit wiederholten Flags gesetzt werden.

Typische Bedingungen sollten nur alphanumerische Zeichen enthalten und bei Bedarf ":", "-" oder "=" als Trennzeichen verwenden. Alles andere kann zu Kompatibilitätsproblemen außerhalb von Node führen.

In Node gibt es nur sehr wenige Einschränkungen für Bedingungen, aber insbesondere diese hier:

### Definitionen von Community-Bedingungen {#community-conditions-definitions}

Andere Bedingungszeichenketten als die in [Node.js Core implementierten Bedingungen](/de/nodejs/api/packages#conditional-exports) `"import"`, `"require"`, `"node"`, `"module-sync"`, `"node-addons"` und `"default"` werden standardmäßig ignoriert.

Andere Plattformen können andere Bedingungen implementieren, und Benutzerbedingungen können in Node.js über das Flag [`--conditions` / `-C`](/de/nodejs/api/packages#resolving-user-conditions) aktiviert werden.

Da benutzerdefinierte Paketbedingungen klare Definitionen erfordern, um eine korrekte Verwendung zu gewährleisten, wird im Folgenden eine Liste allgemeiner bekannter Paketbedingungen und ihrer strikten Definitionen bereitgestellt, um die Ökosystemkoordination zu unterstützen.

- `"types"` - kann von Typsystemen verwendet werden, um die Typisierungsdatei für den angegebenen Export aufzulösen. *Diese Bedingung sollte immer zuerst enthalten sein.*
- `"browser"` - jede Webbrowserumgebung.
- `"development"` - kann verwendet werden, um einen Entwicklungsumgebungs-Einstiegspunkt zu definieren, z. B. um zusätzlichen Debugging-Kontext bereitzustellen, z. B. bessere Fehlermeldungen, wenn in einem Entwicklungsmodus ausgeführt wird. *Muss immer
sich gegenseitig ausschließen mit <code>"production"</code>.*
- `"production"` - kann verwendet werden, um einen Produktionsumgebungs-Einstiegspunkt zu definieren. *Muss immer sich gegenseitig ausschließen mit <code>"development"</code>.*

Für andere Runtimes werden plattformspezifische Bedingungsschlüsseldefinitionen von der [WinterCG](https://wintercg.org/) in der [Runtime Keys](https://runtime-keys.proposal.wintercg.org/) Proposal-Spezifikation verwaltet.

Neue Bedingungsdefinitionen können dieser Liste hinzugefügt werden, indem ein Pull-Request an die [Node.js-Dokumentation für diesen Abschnitt](https://github.com/nodejs/node/blob/HEAD/doc/api/packages.md#conditions-definitions) erstellt wird. Die Anforderungen für die Auflistung einer neuen Bedingungsdefinition sind hierbei:

- Die Definition sollte für alle Implementierer klar und eindeutig sein.
- Der Anwendungsfall, warum die Bedingung erforderlich ist, sollte klar begründet sein.
- Es sollte eine ausreichende vorhandene Implementierungsnutzung geben.
- Der Bedingungsname sollte nicht mit einer anderen Bedingungsdefinition oder Bedingung in breiter Verwendung in Konflikt stehen.
- Die Auflistung der Bedingungsdefinition sollte einen Koordinationsvorteil für das Ökosystem bieten, der sonst nicht möglich wäre. Dies wäre beispielsweise nicht unbedingt der Fall für unternehmens- oder anwendungsspezifische Bedingungen.
- Die Bedingung sollte so sein, dass ein Node.js-Benutzer erwarten würde, dass sie sich in der Node.js-Core-Dokumentation befindet. Die `"types"`-Bedingung ist ein gutes Beispiel: Sie gehört nicht wirklich in das [Runtime Keys](https://runtime-keys.proposal.wintercg.org/) Proposal, passt aber gut hier in die Node.js-Dokumente.

Die obigen Definitionen können im Laufe der Zeit in ein dediziertes Bedingungsregister verschoben werden.


### Selbstbezug eines Pakets mithilfe seines Namens {#self-referencing-a-package-using-its-name}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.6.0, v12.16.0 | Selbstbezug eines Pakets mithilfe seines Namens nicht länger markiert. |
| v13.1.0, v12.16.0 | Hinzugefügt in: v13.1.0, v12.16.0 |
:::

Innerhalb eines Pakets können die im Feld `package.json` [`"exports"`](/de/nodejs/api/packages#exports) des Pakets definierten Werte über den Namen des Pakets referenziert werden. Zum Beispiel, unter der Annahme, dass die `package.json` Folgendes ist:

```json [JSON]
// package.json
{
  "name": "a-package",
  "exports": {
    ".": "./index.mjs",
    "./foo.js": "./foo.js"
  }
}
```
Dann kann jedes Modul *in diesem Paket* einen Export im Paket selbst referenzieren:

```js [ESM]
// ./a-module.mjs
import { something } from 'a-package'; // Importiert "something" aus ./index.mjs.
```
Selbstbezug ist nur verfügbar, wenn `package.json` [`"exports"`](/de/nodejs/api/packages#exports) hat, und erlaubt nur den Import dessen, was dieses [`"exports"`](/de/nodejs/api/packages#exports) (in der `package.json`) erlaubt. Der folgende Code erzeugt also, gegeben das vorherige Paket, einen Laufzeitfehler:

```js [ESM]
// ./another-module.mjs

// Importiert "another" aus ./m.mjs. Schlägt fehl, weil
// das Feld "exports" in der "package.json"
// keinen Export namens "./m.mjs" bereitstellt.
import { another } from 'a-package/m.mjs';
```
Selbstbezug ist auch verfügbar, wenn `require` verwendet wird, sowohl in einem ES-Modul als auch in einem CommonJS-Modul. Zum Beispiel funktioniert dieser Code auch:

```js [CJS]
// ./a-module.js
const { something } = require('a-package/foo.js'); // Lädt aus ./foo.js.
```
Schließlich funktioniert der Selbstbezug auch mit Scoped Packages. Zum Beispiel funktioniert dieser Code auch:

```json [JSON]
// package.json
{
  "name": "@my/package",
  "exports": "./index.js"
}
```
```js [CJS]
// ./index.js
module.exports = 42;
```
```js [CJS]
// ./other.js
console.log(require('@my/package'));
```
```bash [BASH]
$ node other.js
42
```
## Duale CommonJS/ES-Modul-Pakete {#dual-commonjs/es-module-packages}

Weitere Informationen finden Sie im [Package Examples Repository](https://github.com/nodejs/package-examples).

## Node.js `package.json`-Felddefinitionen {#nodejs-packagejson-field-definitions}

Dieser Abschnitt beschreibt die von der Node.js-Laufzeit verwendeten Felder. Andere Tools (wie z. B. [npm](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)) verwenden zusätzliche Felder, die von Node.js ignoriert und hier nicht dokumentiert werden.

Die folgenden Felder in `package.json`-Dateien werden in Node.js verwendet:

- [`"name"`](/de/nodejs/api/packages#name) - Relevant bei der Verwendung von benannten Importen innerhalb eines Pakets. Wird auch von Paketmanagern als Name des Pakets verwendet.
- [`"main"`](/de/nodejs/api/packages#main) - Das Standardmodul beim Laden des Pakets, wenn exports nicht angegeben ist, und in Node.js-Versionen vor der Einführung von Exports.
- [`"packageManager"`](/de/nodejs/api/packages#packagemanager) - Der empfohlene Paketmanager beim Beitragen zum Paket. Wird von den [Corepack](/de/nodejs/api/corepack)-Shims genutzt.
- [`"type"`](/de/nodejs/api/packages#type) - Der Pakettyp, der bestimmt, ob `.js`-Dateien als CommonJS- oder ES-Module geladen werden.
- [`"exports"`](/de/nodejs/api/packages#exports) - Paketexporte und bedingte Exporte. Wenn vorhanden, begrenzt dies, welche Submodule aus dem Paket geladen werden können.
- [`"imports"`](/de/nodejs/api/packages#imports) - Paketimporte zur Verwendung durch Module innerhalb des Pakets selbst.


### `"name"` {#"name"}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.6.0, v12.16.0 | Entferne die Option `--experimental-resolve-self`. |
| v13.1.0, v12.16.0 | Hinzugefügt in: v13.1.0, v12.16.0 |
:::

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "name": "package-name"
}
```
Das Feld `"name"` definiert den Namen Ihres Pakets. Die Veröffentlichung in der *npm*-Registry erfordert einen Namen, der [bestimmte Anforderungen](https://docs.npmjs.com/files/package.json#name) erfüllt.

Das Feld `"name"` kann zusätzlich zum Feld [`"exports"`](/de/nodejs/api/packages#exports) verwendet werden, um [sich selbst auf ein Paket zu beziehen](/de/nodejs/api/packages#self-referencing-a-package-using-its-name), indem der Name des Pakets verwendet wird.

### `"main"` {#"main"}

**Hinzugefügt in: v0.4.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "main": "./index.js"
}
```
Das Feld `"main"` definiert den Einstiegspunkt eines Pakets, wenn es über eine `node_modules`-Suche über den Namen importiert wird. Sein Wert ist ein Pfad.

Wenn ein Paket ein [`"exports"`](/de/nodejs/api/packages#exports)-Feld hat, hat dieses Vorrang vor dem `"main"`-Feld, wenn das Paket über den Namen importiert wird.

Es definiert auch das Skript, das verwendet wird, wenn das [Paketverzeichnis über `require()` geladen wird](/de/nodejs/api/modules#folders-as-modules).

```js [CJS]
// Dies wird zu ./path/to/directory/index.js aufgelöst.
require('./path/to/directory');
```
### `"packageManager"` {#"packagemanager"}

**Hinzugefügt in: v16.9.0, v14.19.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "packageManager": "<package manager name>@<version>"
}
```
Das Feld `"packageManager"` definiert, welcher Paketmanager bei der Arbeit an dem aktuellen Projekt verwendet werden soll. Es kann auf einen der [unterstützten Paketmanager](/de/nodejs/api/corepack#supported-package-managers) gesetzt werden und stellt sicher, dass Ihre Teams genau die gleichen Paketmanager-Versionen verwenden, ohne etwas anderes als Node.js installieren zu müssen.

Dieses Feld ist derzeit experimentell und muss aktiviert werden; Details zum Verfahren finden Sie auf der [Corepack](/de/nodejs/api/corepack)-Seite.


### `"type"` {#"type"}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.2.0, v12.17.0 | Flag `--experimental-modules` entfernt. |
| v12.0.0 | Hinzugefügt in: v12.0.0 |
:::

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Das Feld `"type"` definiert das Modulformat, das Node.js für alle `.js`-Dateien verwendet, die diese `package.json`-Datei als nächsten Elternteil haben.

Dateien, die mit `.js` enden, werden als ES-Module geladen, wenn die nächste übergeordnete `package.json`-Datei ein Feld der obersten Ebene namens `"type"` mit dem Wert `"module"` enthält.

Die nächste übergeordnete `package.json` wird als die erste `package.json` definiert, die gefunden wird, wenn im aktuellen Ordner, dem übergeordneten Ordner usw. gesucht wird, bis ein node_modules-Ordner oder das Stammverzeichnis des Volumes erreicht ist.

```json [JSON]
// package.json
{
  "type": "module"
}
```
```bash [BASH]
# Im selben Ordner wie die vorhergehende package.json {#in-same-folder-as-preceding-packagejson}
node my-app.js # Läuft als ES-Modul
```
Wenn der nächsten übergeordneten `package.json` ein Feld `"type"` fehlt oder `"type": "commonjs"` enthält, werden `.js`-Dateien als [CommonJS](/de/nodejs/api/modules) behandelt. Wenn das Stammverzeichnis des Volumes erreicht wird und keine `package.json` gefunden wird, werden `.js`-Dateien als [CommonJS](/de/nodejs/api/modules) behandelt.

`import`-Anweisungen von `.js`-Dateien werden als ES-Module behandelt, wenn die nächste übergeordnete `package.json` `"type": "module"` enthält.

```js [ESM]
// my-app.js, Teil des gleichen Beispiels wie oben
import './startup.js'; // Wird aufgrund von package.json als ES-Modul geladen
```
Unabhängig vom Wert des Feldes `"type"` werden `.mjs`-Dateien immer als ES-Module und `.cjs`-Dateien immer als CommonJS behandelt.

### `"exports"` {#"exports"}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.13.0, v12.20.0 | Unterstützung für `"exports"`-Muster hinzugefügt. |
| v13.7.0, v12.17.0 | Bedingte Exporte entflaggen. |
| v13.7.0, v12.16.0 | Logische bedingte Exportreihenfolge implementieren. |
| v13.7.0, v12.16.0 | Option `--experimental-conditional-exports` entfernt. In 12.16.0 befinden sich bedingte Exporte noch hinter `--experimental-modules`. |
| v13.2.0, v12.16.0 | Bedingte Exporte implementieren. |
| v12.7.0 | Hinzugefügt in: v12.7.0 |
:::

- Typ: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "exports": "./index.js"
}
```
Das Feld `"exports"` ermöglicht die Definition der [Einstiegspunkte](/de/nodejs/api/packages#package-entry-points) eines Pakets, wenn es namentlich geladen wird, entweder über eine `node_modules`-Suche oder einen [Selbstverweis](/de/nodejs/api/packages#self-referencing-a-package-using-its-name) auf seinen eigenen Namen. Es wird in Node.js 12+ als Alternative zu [`"main"`](/de/nodejs/api/packages#main) unterstützt, das die Definition von [Unterpfadexporten](/de/nodejs/api/packages#subpath-exports) und [bedingten Exporten](/de/nodejs/api/packages#conditional-exports) unterstützen kann, während interne, nicht exportierte Module gekapselt werden.

[Bedingte Exporte](/de/nodejs/api/packages#conditional-exports) können auch innerhalb von `"exports"` verwendet werden, um verschiedene Paket-Einstiegspunkte pro Umgebung zu definieren, einschließlich der Frage, ob auf das Paket über `require` oder über `import` verwiesen wird.

Alle im Feld `"exports"` definierten Pfade müssen relative Datei-URLs sein, die mit `./` beginnen.


### `"imports"` {#"imports"}

**Hinzugefügt in: v14.6.0, v12.19.0**

- Typ: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```
Einträge im Imports-Feld müssen Strings sein, die mit `#` beginnen.

Paket-Importe ermöglichen die Zuordnung zu externen Paketen.

Dieses Feld definiert [Subpfad-Importe](/de/nodejs/api/packages#subpath-imports) für das aktuelle Paket.

