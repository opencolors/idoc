---
title: TypeScript-Unterstützung in Node.js
description: Erfahren Sie, wie Sie TypeScript mit Node.js verwenden, einschließlich Installation, Konfiguration und Best Practices zur Integration von TypeScript in Ihre Node.js-Projekte.
head:
  - - meta
    - name: og:title
      content: TypeScript-Unterstützung in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie TypeScript mit Node.js verwenden, einschließlich Installation, Konfiguration und Best Practices zur Integration von TypeScript in Ihre Node.js-Projekte.
  - - meta
    - name: twitter:title
      content: TypeScript-Unterstützung in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie TypeScript mit Node.js verwenden, einschließlich Installation, Konfiguration und Best Practices zur Integration von TypeScript in Ihre Node.js-Projekte.
---


# Module: TypeScript {#modules-typescript}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.7.0 | Flag `--experimental-transform-types` hinzugefügt. |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

## Aktivieren {#enabling}

Es gibt zwei Möglichkeiten, die TypeScript-Runtime-Unterstützung in Node.js zu aktivieren:

## Volle TypeScript-Unterstützung {#full-typescript-support}

Um TypeScript mit voller Unterstützung für alle TypeScript-Funktionen, einschließlich `tsconfig.json`, zu verwenden, können Sie ein Paket von Drittanbietern verwenden. Diese Anweisungen verwenden [`tsx`](https://tsx.is/) als Beispiel, aber es gibt viele andere ähnliche Bibliotheken.

## Typ-Stripping {#type-stripping}

**Hinzugefügt in: v22.6.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Das Flag [`--experimental-strip-types`](/de/nodejs/api/cli#--experimental-strip-types) ermöglicht Node.js die Ausführung von TypeScript-Dateien. Standardmäßig führt Node.js nur Dateien aus, die keine TypeScript-Funktionen enthalten, die eine Transformation erfordern, wie z. B. Enums oder Namespaces. Node.js ersetzt Inline-Typannotationen durch Leerzeichen, und es wird keine Typüberprüfung durchgeführt. Um die Transformation solcher Funktionen zu aktivieren, verwenden Sie das Flag [`--experimental-transform-types`](/de/nodejs/api/cli#--experimental-transform-types). TypeScript-Funktionen, die von Einstellungen innerhalb von `tsconfig.json` abhängen, wie z. B. Pfade oder die Konvertierung neuerer JavaScript-Syntax in ältere Standards, werden absichtlich nicht unterstützt. Um vollständige TypeScript-Unterstützung zu erhalten, siehe [Volle TypeScript-Unterstützung](/de/nodejs/api/typescript#full-typescript-support).

Die Typ-Stripping-Funktion ist als schlank konzipiert. Indem absichtlich keine Syntaxen unterstützt werden, die JavaScript-Code-Generierung erfordern, und indem Inline-Typen durch Leerzeichen ersetzt werden, kann Node.js TypeScript-Code ausführen, ohne dass Quellzuordnungen erforderlich sind.

Typ-Stripping funktioniert mit den meisten Versionen von TypeScript, wir empfehlen jedoch Version 5.7 oder neuer mit den folgenden `tsconfig.json`-Einstellungen:

```json [JSON]
{
  "compilerOptions": {
     "target": "esnext",
     "module": "nodenext",
     "allowImportingTsExtensions": true,
     "rewriteRelativeImportExtensions": true,
     "verbatimModuleSyntax": true
  }
}
```

### Modulsystem bestimmen {#determining-module-system}

Node.js unterstützt sowohl [CommonJS](/de/nodejs/api/modules) als auch [ES Modules](/de/nodejs/api/esm) Syntax in TypeScript-Dateien. Node.js konvertiert nicht von einem Modulsystem in ein anderes; wenn Ihr Code als ES-Modul ausgeführt werden soll, müssen Sie die `import`- und `export`-Syntax verwenden, und wenn Ihr Code als CommonJS ausgeführt werden soll, müssen Sie `require` und `module.exports` verwenden.

- `.ts`-Dateien haben ihr Modulsystem [auf die gleiche Weise bestimmt wie `.js`-Dateien.](/de/nodejs/api/packages#determining-module-system) Um die `import`- und `export`-Syntax zu verwenden, fügen Sie `„type": "module"` zum nächstgelegenen übergeordneten `package.json` hinzu.
- `.mts`-Dateien werden immer als ES-Module ausgeführt, ähnlich wie `.mjs`-Dateien.
- `.cts`-Dateien werden immer als CommonJS-Module ausgeführt, ähnlich wie `.cjs`-Dateien.
- `.tsx`-Dateien werden nicht unterstützt.

Wie in JavaScript-Dateien sind [Dateierweiterungen in `import`-Anweisungen und `import()`-Ausdrücken obligatorisch](/de/nodejs/api/esm#mandatory-file-extensions): `import './file.ts'`, nicht `import './file'`. Aus Gründen der Abwärtskompatibilität sind Dateierweiterungen auch in `require()`-Aufrufen obligatorisch: `require('./file.ts')`, nicht `require('./file')`, ähnlich wie die `.cjs`-Erweiterung in `require`-Aufrufen in CommonJS-Dateien obligatorisch ist.

Die `tsconfig.json`-Option `allowImportingTsExtensions` ermöglicht es dem TypeScript-Compiler `tsc`, Dateien mit `import`-Spezifizierern zu typisieren, die die `.ts`-Erweiterung enthalten.

### TypeScript-Funktionen {#typescript-features}

Da Node.js nur Inline-Typen entfernt, führen alle TypeScript-Funktionen, bei denen die TypeScript-Syntax *durch neue JavaScript-Syntax ersetzt* wird, zu einem Fehler, es sei denn, das Flag [`--experimental-transform-types`](/de/nodejs/api/cli#--experimental-transform-types) wird übergeben.

Die wichtigsten Funktionen, die eine Transformation erfordern, sind:

- `Enum`
- `namespaces`
- `legacy module`
- Parameter Properties

Da Decorators derzeit ein [TC39 Stage 3 Proposal](https://github.com/tc39/proposal-decorators) sind und bald von der JavaScript-Engine unterstützt werden, werden sie nicht transformiert und führen zu einem Parserfehler. Dies ist eine vorübergehende Einschränkung und wird in Zukunft behoben.

Darüber hinaus liest Node.js keine `tsconfig.json`-Dateien und unterstützt keine Funktionen, die von Einstellungen innerhalb von `tsconfig.json` abhängen, wie z. B. Pfade oder das Konvertieren neuerer JavaScript-Syntax in ältere Standards.


### Importieren von Typen ohne das Schlüsselwort `type` {#importing-types-without-type-keyword}

Aufgrund der Natur des Typ-Strippings ist das Schlüsselwort `type` notwendig, um Typ-Importe korrekt zu entfernen. Ohne das Schlüsselwort `type` behandelt Node.js den Import als Wert-Import, was zu einem Laufzeitfehler führt. Die tsconfig-Option [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) kann verwendet werden, um dieses Verhalten anzupassen.

Dieses Beispiel funktioniert korrekt:

```ts [TYPESCRIPT]
import type { Type1, Type2 } from './module.ts';
import { fn, type FnParams } from './fn.ts';
```
Dies führt zu einem Laufzeitfehler:

```ts [TYPESCRIPT]
import { Type1, Type2 } from './module.ts';
import { fn, FnParams } from './fn.ts';
```
### Nicht-Datei-Formen der Eingabe {#non-file-forms-of-input}

Type-Stripping kann für `--eval` aktiviert werden. Das Modulsystem wird durch `--input-type` bestimmt, wie es auch für JavaScript der Fall ist.

TypeScript-Syntax wird in REPL, STDIN-Eingabe, `--print`, `--check` und `inspect` nicht unterstützt.

### Source Maps {#source-maps}

Da Inline-Typen durch Leerzeichen ersetzt werden, sind Source Maps für korrekte Zeilennummern in Stacktraces unnötig; und Node.js generiert sie nicht. Wenn [`--experimental-transform-types`](/de/nodejs/api/cli#--experimental-transform-types) aktiviert ist, sind Source-Maps standardmäßig aktiviert.

### Type-Stripping in Abhängigkeiten {#type-stripping-in-dependencies}

Um Paketautoren davon abzuhalten, in TypeScript geschriebene Pakete zu veröffentlichen, weigert sich Node.js standardmäßig, TypeScript-Dateien in Ordnern unter einem `node_modules`-Pfad zu verarbeiten.

### Pfad-Aliase {#paths-aliases}

[`tsconfig` "paths"](https://www.typescriptlang.org/tsconfig/#paths) werden nicht transformiert und erzeugen daher einen Fehler. Das nächstgelegene verfügbare Feature sind [Subpath-Importe](/de/nodejs/api/packages#subpath-imports) mit der Einschränkung, dass sie mit `#` beginnen müssen.

