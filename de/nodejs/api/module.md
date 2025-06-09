---
title: Node.js Dokumentation - Modulsystem
description: Diese Seite bietet detaillierte Dokumentation über das Modulsystem von Node.js, einschließlich CommonJS- und ES-Modulen, wie Module geladen werden, Modul-Caching und die Unterschiede zwischen den beiden Modulsystemen.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Modulsystem | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Diese Seite bietet detaillierte Dokumentation über das Modulsystem von Node.js, einschließlich CommonJS- und ES-Modulen, wie Module geladen werden, Modul-Caching und die Unterschiede zwischen den beiden Modulsystemen.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Modulsystem | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Diese Seite bietet detaillierte Dokumentation über das Modulsystem von Node.js, einschließlich CommonJS- und ES-Modulen, wie Module geladen werden, Modul-Caching und die Unterschiede zwischen den beiden Modulsystemen.
---


# Module: `node:module` API {#modules-nodemodule-api}

**Hinzugefügt in: v0.3.7**

## Das `Module`-Objekt {#the-module-object}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Bietet allgemeine Hilfsmethoden für die Interaktion mit Instanzen von `Module`, der [`module`](/de/nodejs/api/module#the-module-object)-Variable, die häufig in [CommonJS](/de/nodejs/api/modules)-Modulen zu finden ist. Zugriff über `import 'node:module'` oder `require('node:module')`.

### `module.builtinModules` {#modulebuiltinmodules}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.5.0 | Die Liste enthält jetzt auch Module mit Präfix. |
| v9.3.0, v8.10.0, v6.13.0 | Hinzugefügt in: v9.3.0, v8.10.0, v6.13.0 |
:::

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Eine Liste der Namen aller von Node.js bereitgestellten Module. Kann verwendet werden, um zu überprüfen, ob ein Modul von einem Drittanbieter verwaltet wird oder nicht.

`module` ist in diesem Kontext nicht dasselbe Objekt, das vom [Modul-Wrapper](/de/nodejs/api/modules#the-module-wrapper) bereitgestellt wird. Um darauf zuzugreifen, fordere das `Module`-Modul an:

::: code-group
```js [ESM]
// module.mjs
// In einem ECMAScript-Modul
import { builtinModules as builtin } from 'node:module';
```

```js [CJS]
// module.cjs
// In einem CommonJS-Modul
const builtin = require('node:module').builtinModules;
```
:::

### `module.createRequire(filename)` {#modulecreaterequirefilename}

**Hinzugefügt in: v12.2.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Dateiname, der zum Erstellen der Require-Funktion verwendet werden soll. Muss ein Datei-URL-Objekt, eine Datei-URL-Zeichenkette oder eine absolute Pfadzeichenkette sein.
- Gibt zurück: [\<require\>](/de/nodejs/api/modules#requireid) Require-Funktion

```js [ESM]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js ist ein CommonJS-Modul.
const siblingModule = require('./sibling-module');
```
### `module.findPackageJSON(specifier[, base])` {#modulefindpackagejsonspecifier-base}

**Hinzugefügt in: v23.2.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Der Bezeichner für das Modul, dessen `package.json` abgerufen werden soll. Beim Übergeben eines *Bare-Specifiers* wird die `package.json` im Stammverzeichnis des Pakets zurückgegeben. Beim Übergeben eines *relativen Specifiers* oder eines *absoluten Specifiers* wird die nächstgelegene übergeordnete `package.json` zurückgegeben.
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Der absolute Speicherort (Datei-URL-Zeichenkette oder FS-Pfad) des enthaltenden Moduls. Verwenden Sie für CJS `__filename` (nicht `__dirname`!); für ESM verwenden Sie `import.meta.url`. Sie müssen es nicht übergeben, wenn `specifier` ein `absolute specifier` ist.
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Ein Pfad, wenn die `package.json` gefunden wird. Wenn `startLocation` ein Paket ist, die Stammverzeichnis-`package.json` des Pakets; wenn relativ oder unaufgelöst, die `package.json`, die sich am nächsten zu `startLocation` befindet.

```text [TEXT]
/path/to/project
  ├ packages/
    ├ bar/
      ├ bar.js
      └ package.json // name = '@foo/bar'
    └ qux/
      ├ node_modules/
        └ some-package/
          └ package.json // name = 'some-package'
      ├ qux.js
      └ package.json // name = '@foo/qux'
  ├ main.js
  └ package.json // name = '@foo'
```


::: code-group
```js [ESM]
// /path/to/project/packages/bar/bar.js
import { findPackageJSON } from 'node:module';

findPackageJSON('..', import.meta.url);
// '/path/to/project/package.json'
// Gleiches Ergebnis bei Übergabe eines absoluten Specifiers:
findPackageJSON(new URL('../', import.meta.url));
findPackageJSON(import.meta.resolve('../'));

findPackageJSON('some-package', import.meta.url);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// Bei Übergabe eines absoluten Specifiers erhalten Sie möglicherweise ein anderes Ergebnis, wenn sich das
// aufgelöste Modul in einem Unterordner mit verschachtelter `package.json` befindet.
findPackageJSON(import.meta.resolve('some-package'));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', import.meta.url);
// '/path/to/project/packages/qux/package.json'
```

```js [CJS]
// /path/to/project/packages/bar/bar.js
const { findPackageJSON } = require('node:module');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

findPackageJSON('..', __filename);
// '/path/to/project/package.json'
// Gleiches Ergebnis bei Übergabe eines absoluten Specifiers:
findPackageJSON(pathToFileURL(path.join(__dirname, '..')));

findPackageJSON('some-package', __filename);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// Bei Übergabe eines absoluten Specifiers erhalten Sie möglicherweise ein anderes Ergebnis, wenn sich das
// aufgelöste Modul in einem Unterordner mit verschachtelter `package.json` befindet.
findPackageJSON(pathToFileURL(require.resolve('some-package')));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', __filename);
// '/path/to/project/packages/qux/package.json'
```
:::


### `module.isBuiltin(moduleName)` {#moduleisbuiltinmodulename}

**Hinzugefügt in: v18.6.0, v16.17.0**

- `moduleName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name des Moduls
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) gibt true zurück, wenn das Modul eingebaut ist, andernfalls false

```js [ESM]
import { isBuiltin } from 'node:module';
isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
isBuiltin('wss'); // false
```
### `module.register(specifier[, parentURL][, options])` {#moduleregisterspecifier-parenturl-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.8.0, v18.19.0 | Unterstützung für WHATWG-URL-Instanzen hinzugefügt. |
| v20.6.0, v18.19.0 | Hinzugefügt in: v20.6.0, v18.19.0 |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).2 - Release-Kandidat
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Anpassungshooks, die registriert werden sollen; dies sollte dieselbe Zeichenkette sein, die an `import()` übergeben würde, außer dass sie, wenn sie relativ ist, relativ zu `parentURL` aufgelöst wird.
- `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Wenn Sie `specifier` relativ zu einer Basis-URL auflösen möchten, z. B. `import.meta.url`, können Sie diese URL hier übergeben. **Standard:** `'data:'`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Wenn Sie `specifier` relativ zu einer Basis-URL auflösen möchten, z. B. `import.meta.url`, können Sie diese URL hier übergeben. Diese Eigenschaft wird ignoriert, wenn die `parentURL` als zweites Argument angegeben wird. **Standard:** `'data:'`
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein beliebiger, klonbarer JavaScript-Wert, der an den [`initialize`](/de/nodejs/api/module#initialize)-Hook übergeben werden soll.
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [übertragbare Objekte](/de/nodejs/api/worker_threads#portpostmessagevalue-transferlist), die an den `initialize`-Hook übergeben werden sollen.
  
 

Registriert ein Modul, das [Hooks](/de/nodejs/api/module#customization-hooks) exportiert, die die Modulauflösung und das Ladeverhalten von Node.js anpassen. Siehe [Anpassungshooks](/de/nodejs/api/module#customization-hooks).


### `module.registerHooks(options)` {#moduleregisterhooksoptions}

**Hinzugefügt in: v23.5.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `load` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Siehe [Load-Hook](/de/nodejs/api/module#loadurl-context-nextload). **Standard:** `undefined`.
    - `resolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Siehe [Resolve-Hook](/de/nodejs/api/module#resolvespecifier-context-nextresolve). **Standard:** `undefined`.

Registriert [Hooks](/de/nodejs/api/module#customization-hooks), die die Modulauflösung und das Ladeverhalten von Node.js anpassen. Siehe [Anpassungs-Hooks](/de/nodejs/api/module#customization-hooks).

### `module.stripTypeScriptTypes(code[, options])` {#modulestriptypescripttypescode-options}

**Hinzugefügt in: v23.2.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Code, aus dem Typannotationen entfernt werden sollen.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'strip'`. Mögliche Werte sind:
    - `'strip'` Entfernt nur Typannotationen, ohne die Transformation von TypeScript-Funktionen durchzuführen.
    - `'transform'` Entfernt Typannotationen und transformiert TypeScript-Funktionen in JavaScript.

    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `false`. Nur wenn `mode` `'transform'` ist, wird bei `true` eine Source Map für den transformierten Code generiert.
    - `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt die in der Source Map verwendete Quell-URL an.

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Code, aus dem Typannotationen entfernt wurden. `module.stripTypeScriptTypes()` entfernt Typannotationen aus TypeScript-Code. Es kann verwendet werden, um Typannotationen aus TypeScript-Code zu entfernen, bevor er mit `vm.runInContext()` oder `vm.compileFunction()` ausgeführt wird. Standardmäßig wird ein Fehler ausgegeben, wenn der Code TypeScript-Funktionen enthält, die eine Transformation erfordern, z. B. `Enums`. Weitere Informationen finden Sie unter [Type-Stripping](/de/nodejs/api/typescript#type-stripping). Wenn der Modus `'transform'` ist, werden auch TypeScript-Funktionen in JavaScript transformiert. Weitere Informationen finden Sie unter [TypeScript-Funktionen transformieren](/de/nodejs/api/typescript#typescript-features). Wenn der Modus `'strip'` ist, werden keine Source Maps generiert, da die Speicherorte beibehalten werden. Wenn `sourceMap` angegeben ist und der Modus `'strip'` ist, wird ein Fehler ausgegeben.

*WARNUNG*: Die Ausgabe dieser Funktion sollte aufgrund von Änderungen im TypeScript-Parser nicht über Node.js-Versionen hinweg als stabil betrachtet werden.

::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```
:::

Wenn `sourceUrl` angegeben ist, wird sie als Kommentar am Ende der Ausgabe angehängt:

::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```
:::

Wenn `mode` `'transform'` ist, wird der Code in JavaScript transformiert:

::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Prints:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Prints:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```
:::


### `module.syncBuiltinESMExports()` {#modulesyncbuiltinesmexports}

**Hinzugefügt in: v12.12.0**

Die Methode `module.syncBuiltinESMExports()` aktualisiert alle Live-Bindungen für integrierte [ES-Module](/de/nodejs/api/esm), sodass sie mit den Eigenschaften der [CommonJS](/de/nodejs/api/modules)-Exporte übereinstimmen. Sie fügt keine exportierten Namen zu den [ES-Modulen](/de/nodejs/api/esm) hinzu oder entfernt sie.

```js [ESM]
const fs = require('node:fs');
const assert = require('node:assert');
const { syncBuiltinESMExports } = require('node:module');

fs.readFile = newAPI;

delete fs.readFileSync;

function newAPI() {
  // ...
}

fs.newAPI = newAPI;

syncBuiltinESMExports();

import('node:fs').then((esmFS) => {
  // Es synchronisiert die bestehende readFile-Eigenschaft mit dem neuen Wert
  assert.strictEqual(esmFS.readFile, newAPI);
  // readFileSync wurde aus dem benötigten fs gelöscht
  assert.strictEqual('readFileSync' in fs, false);
  // syncBuiltinESMExports() entfernt readFileSync nicht aus esmFS
  assert.strictEqual('readFileSync' in esmFS, true);
  // syncBuiltinESMExports() fügt keine Namen hinzu
  assert.strictEqual(esmFS.newAPI, undefined);
});
```
## Modul-Kompilierungs-Cache {#module-compile-cache}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.8.0 | Füge erste JavaScript-APIs für den Laufzeitzugriff hinzu. |
| v22.1.0 | Hinzugefügt in: v22.1.0 |
:::

Der Modul-Kompilierungs-Cache kann entweder über die Methode [`module.enableCompileCache()`](/de/nodejs/api/module#moduleenablecompilecachecachedir) oder die Umgebungsvariable [`NODE_COMPILE_CACHE=dir`](/de/nodejs/api/cli#node_compile_cachedir) aktiviert werden. Nachdem er aktiviert wurde, verwendet Node.js bei der Kompilierung eines CommonJS- oder ECMAScript-Moduls den auf der Festplatte gespeicherten [V8-Code-Cache](https://v8.dev/blog/code-caching-for-devs), der im angegebenen Verzeichnis gespeichert ist, um die Kompilierung zu beschleunigen. Dies kann das erste Laden eines Modulgraphen verlangsamen, aber nachfolgende Ladevorgänge desselben Modulgraphen können eine deutliche Beschleunigung erfahren, wenn sich der Inhalt der Module nicht ändert.

Um den generierten Kompilierungs-Cache auf der Festplatte zu bereinigen, entfernen Sie einfach das Cache-Verzeichnis. Das Cache-Verzeichnis wird beim nächsten Mal neu erstellt, wenn dasselbe Verzeichnis für die Speicherung des Kompilierungs-Caches verwendet wird. Um zu vermeiden, dass die Festplatte mit veraltetem Cache voll wird, wird empfohlen, ein Verzeichnis unter [`os.tmpdir()`](/de/nodejs/api/os#ostmpdir) zu verwenden. Wenn der Kompilierungs-Cache durch einen Aufruf von [`module.enableCompileCache()`](/de/nodejs/api/module#moduleenablecompilecachecachedir) aktiviert wird, ohne das Verzeichnis anzugeben, verwendet Node.js die Umgebungsvariable [`NODE_COMPILE_CACHE=dir`](/de/nodejs/api/cli#node_compile_cachedir), falls diese gesetzt ist, oder standardmäßig `path.join(os.tmpdir(), 'node-compile-cache')`. Um das Kompilierungs-Cache-Verzeichnis zu finden, das von einer laufenden Node.js-Instanz verwendet wird, verwenden Sie [`module.getCompileCacheDir()`](/de/nodejs/api/module#modulegetcompilecachedir).

Wenn der Kompilierungs-Cache mit [V8 JavaScript-Codeabdeckung](https://v8project.blogspot.com/2017/12/javascript-code-coverage) verwendet wird, kann die von V8 erfasste Abdeckung in Funktionen, die aus dem Code-Cache deserialisiert werden, weniger genau sein. Es wird empfohlen, dies beim Ausführen von Tests zur Generierung einer genauen Abdeckung zu deaktivieren.

Der aktivierte Modul-Kompilierungs-Cache kann durch die Umgebungsvariable [`NODE_DISABLE_COMPILE_CACHE=1`](/de/nodejs/api/cli#node_disable_compile_cache1) deaktiviert werden. Dies kann nützlich sein, wenn der Kompilierungs-Cache zu unerwarteten oder unerwünschten Verhaltensweisen führt (z. B. weniger genaue Testabdeckung).

Ein von einer Version von Node.js generierter Kompilierungs-Cache kann nicht von einer anderen Version von Node.js wiederverwendet werden. Von verschiedenen Versionen von Node.js generierte Caches werden separat gespeichert, wenn dasselbe Basisverzeichnis zum Speichern des Caches verwendet wird, sodass sie nebeneinander existieren können.

Im Moment wird, wenn der Kompilierungs-Cache aktiviert ist und ein Modul neu geladen wird, der Code-Cache sofort aus dem kompilierten Code generiert, aber erst auf die Festplatte geschrieben, wenn die Node.js-Instanz kurz vor dem Beenden steht. Dies kann sich ändern. Die Methode [`module.flushCompileCache()`](/de/nodejs/api/module#moduleflushcompilecache) kann verwendet werden, um sicherzustellen, dass der angesammelte Code-Cache auf die Festplatte geschrieben wird, falls die Anwendung andere Node.js-Instanzen starten und diese den Cache lange vor dem Beenden des übergeordneten Elements gemeinsam nutzen sollen.


### `module.constants.compileCacheStatus` {#moduleconstantscompilecachestatus}

**Hinzugefügt in: v22.8.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Die folgenden Konstanten werden als Feld `status` im Objekt zurückgegeben, das von [`module.enableCompileCache()`](/de/nodejs/api/module#moduleenablecompilecachecachedir) zurückgegeben wird, um das Ergebnis des Versuchs, den [Modulkompilierungs-Cache](/de/nodejs/api/module#module-compile-cache) zu aktivieren, anzuzeigen.

| Konstante | Beschreibung |
| --- | --- |
| `ENABLED` |        Node.js hat den Kompilierungs-Cache erfolgreich aktiviert. Das Verzeichnis, das zum Speichern des       Kompilierungs-Cache verwendet wird, wird im Feld   `directory`   im       zurückgegebenen Objekt zurückgegeben.      |
| `ALREADY_ENABLED` |        Der Kompilierungs-Cache wurde bereits zuvor aktiviert, entweder durch einen vorherigen Aufruf von         `module.enableCompileCache()`  oder durch die Umgebungsvariable   `NODE_COMPILE_CACHE=dir`.       Das Verzeichnis, das zum Speichern des       Kompilierungs-Cache verwendet wird, wird im Feld   `directory`   im       zurückgegebenen Objekt zurückgegeben.      |
| `FAILED` |        Node.js kann den Kompilierungs-Cache nicht aktivieren. Dies kann durch fehlende       Berechtigungen zur Nutzung des angegebenen Verzeichnisses oder durch verschiedene Arten von Dateisystemfehlern verursacht werden.       Die Details des Fehlers werden im Feld   `message`   im       zurückgegebenen Objekt zurückgegeben.      |
| `DISABLED` |        Node.js kann den Kompilierungs-Cache nicht aktivieren, da die Umgebungsvariable         `NODE_DISABLE_COMPILE_CACHE=1`   gesetzt wurde.      |
### `module.enableCompileCache([cacheDir])` {#moduleenablecompilecachecachedir}

**Hinzugefügt in: v22.8.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

- `cacheDir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Optionaler Pfad zur Angabe des Verzeichnisses, in dem der Kompilierungs-Cache gespeichert/abgerufen wird.
- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `status` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Einer der [`module.constants.compileCacheStatus`](/de/nodejs/api/module#moduleconstantscompilecachestatus)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Wenn Node.js den Kompilierungs-Cache nicht aktivieren kann, enthält dies die Fehlermeldung. Wird nur gesetzt, wenn `status` `module.constants.compileCacheStatus.FAILED` ist.
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Wenn der Kompilierungs-Cache aktiviert ist, enthält dies das Verzeichnis, in dem der Kompilierungs-Cache gespeichert ist. Wird nur gesetzt, wenn `status` `module.constants.compileCacheStatus.ENABLED` oder `module.constants.compileCacheStatus.ALREADY_ENABLED` ist.
  
 

Aktivieren Sie den [Modulkompilierungs-Cache](/de/nodejs/api/module#module-compile-cache) in der aktuellen Node.js-Instanz.

Wenn `cacheDir` nicht angegeben ist, verwendet Node.js entweder das durch die Umgebungsvariable [`NODE_COMPILE_CACHE=dir`](/de/nodejs/api/cli#node_compile_cachedir) angegebene Verzeichnis, falls diese gesetzt ist, oder verwendet andernfalls `path.join(os.tmpdir(), 'node-compile-cache')`. Für allgemeine Anwendungsfälle wird empfohlen, `module.enableCompileCache()` aufzurufen, ohne `cacheDir` anzugeben, sodass das Verzeichnis bei Bedarf durch die Umgebungsvariable `NODE_COMPILE_CACHE` überschrieben werden kann.

Da der Kompilierungs-Cache eine stille Optimierung sein soll, die für die Funktionalität der Anwendung nicht erforderlich ist, ist diese Methode so konzipiert, dass sie keine Ausnahme auslöst, wenn der Kompilierungs-Cache nicht aktiviert werden kann. Stattdessen wird ein Objekt zurückgegeben, das eine Fehlermeldung im Feld `message` enthält, um die Fehlersuche zu erleichtern. Wenn der Kompilierungs-Cache erfolgreich aktiviert wurde, enthält das Feld `directory` im zurückgegebenen Objekt den Pfad zu dem Verzeichnis, in dem der Kompilierungs-Cache gespeichert ist. Das Feld `status` im zurückgegebenen Objekt ist einer der Werte von `module.constants.compileCacheStatus`, um das Ergebnis des Versuchs, den [Modulkompilierungs-Cache](/de/nodejs/api/module#module-compile-cache) zu aktivieren, anzuzeigen.

Diese Methode wirkt sich nur auf die aktuelle Node.js-Instanz aus. Um sie in untergeordneten Worker-Threads zu aktivieren, rufen Sie entweder diese Methode auch in untergeordneten Worker-Threads auf, oder setzen Sie den Wert `process.env.NODE_COMPILE_CACHE` auf das Kompilierungs-Cache-Verzeichnis, damit das Verhalten an die untergeordneten Worker vererbt werden kann. Das Verzeichnis kann entweder über das von dieser Methode zurückgegebene Feld `directory` oder mit [`module.getCompileCacheDir()`](/de/nodejs/api/module#modulegetcompilecachedir) abgerufen werden.


### `module.flushCompileCache()` {#moduleflushcompilecache}

**Hinzugefügt in: v23.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Leert den [Modul-Kompilierungs-Cache](/de/nodejs/api/module#module-compile-cache), der von bereits in der aktuellen Node.js-Instanz geladenen Modulen angesammelt wurde, auf die Festplatte. Dies gibt zurück, nachdem alle Dateisystemoperationen zum Leeren beendet sind, unabhängig davon, ob sie erfolgreich sind oder nicht. Wenn Fehler auftreten, schlägt dies im Stillen fehl, da sich fehlende Kompilierungs-Caches nicht auf den tatsächlichen Betrieb der Anwendung auswirken sollten.

### `module.getCompileCacheDir()` {#modulegetcompilecachedir}

**Hinzugefügt in: v22.8.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Pfad zum [Modul-Kompilierungs-Cache](/de/nodejs/api/module#module-compile-cache)-Verzeichnis, falls es aktiviert ist, oder `undefined` andernfalls.

## Anpassungs-Hooks {#customization-hooks}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.5.0 | Unterstützung für synchrone und In-Thread-Hooks hinzugefügt. |
| v20.6.0, v18.19.0 | `initialize`-Hook hinzugefügt, um `globalPreload` zu ersetzen. |
| v18.6.0, v16.17.0 | Unterstützung für die Verkettung von Loadern hinzugefügt. |
| v16.12.0 | `getFormat`, `getSource`, `transformSource` und `globalPreload` entfernt; `load`-Hook und `getGlobalPreload`-Hook hinzugefügt. |
| v8.8.0 | Hinzugefügt in: v8.8.0 |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).2 - Release Candidate (asynchrone Version) Stabilität: 1.1 - Aktive Entwicklung (synchrone Version)
:::

Es werden derzeit zwei Arten von Modul-Anpassungs-Hooks unterstützt:

### Aktivierung {#enabling}

Die Modulauflösung und -ladung kann angepasst werden durch:

Die Hooks können registriert werden, bevor der Anwendungscode ausgeführt wird, indem die Flags [`--import`](/de/nodejs/api/cli#--importmodule) oder [`--require`](/de/nodejs/api/cli#-r---require-module) verwendet werden:

```bash [BASH]
node --import ./register-hooks.js ./my-app.js
node --require ./register-hooks.js ./my-app.js
```

::: code-group
```js [ESM]
// register-hooks.js
// Diese Datei kann nur mit require() geladen werden, wenn sie kein Top-Level-Await enthält.
// Verwenden Sie module.register(), um asynchrone Hooks in einem dedizierten Thread zu registrieren.
import { register } from 'node:module';
register('./hooks.mjs', import.meta.url);
```

```js [CJS]
// register-hooks.js
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
// Verwenden Sie module.register(), um asynchrone Hooks in einem dedizierten Thread zu registrieren.
register('./hooks.mjs', pathToFileURL(__filename));
```
:::

::: code-group
```js [ESM]
// Verwenden Sie module.registerHooks(), um synchrone Hooks im Hauptthread zu registrieren.
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) { /* Implementierung */ },
  load(url, context, nextLoad) { /* Implementierung */ },
});
```

```js [CJS]
// Verwenden Sie module.registerHooks(), um synchrone Hooks im Hauptthread zu registrieren.
const { registerHooks } = require('node:module');
registerHooks({
  resolve(specifier, context, nextResolve) { /* Implementierung */ },
  load(url, context, nextLoad) { /* Implementierung */ },
});
```
:::

Die an `--import` oder `--require` übergebene Datei kann auch ein Export aus einer Abhängigkeit sein:

```bash [BASH]
node --import some-package/register ./my-app.js
node --require some-package/register ./my-app.js
```
Wobei `some-package` ein [`"exports"`](/de/nodejs/api/packages#exports)-Feld hat, das den `/register`-Export definiert, um ihn einer Datei zuzuordnen, die `register()` aufruft, wie das folgende `register-hooks.js`-Beispiel.

Die Verwendung von `--import` oder `--require` stellt sicher, dass die Hooks registriert werden, bevor Anwendungsdateien importiert werden, einschließlich des Einstiegspunkts der Anwendung und standardmäßig auch für alle Worker-Threads.

Alternativ können `register()` und `registerHooks()` vom Einstiegspunkt aufgerufen werden, obwohl dynamisches `import()` für jeden ESM-Code verwendet werden muss, der nach der Registrierung der Hooks ausgeführt werden soll.

::: code-group
```js [ESM]
import { register } from 'node:module';

register('http-to-https', import.meta.url);

// Da dies ein dynamischer `import()`-Aufruf ist, werden die `http-to-https`-Hooks ausgeführt,
// um `./my-app.js` und alle anderen Dateien, die es importiert oder benötigt, zu verarbeiten.
await import('./my-app.js');
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

register('http-to-https', pathToFileURL(__filename));

// Da dies ein dynamischer `import()`-Aufruf ist, werden die `http-to-https`-Hooks ausgeführt,
// um `./my-app.js` und alle anderen Dateien, die es importiert oder benötigt, zu verarbeiten.
import('./my-app.js');
```
:::

Anpassungs-Hooks werden für alle Module ausgeführt, die später als die Registrierung geladen werden, und die Module, auf die sie über `import` und das integrierte `require` verweisen. Die von Benutzern mit `module.createRequire()` erstellte `require`-Funktion kann nur durch die synchronen Hooks angepasst werden.

In diesem Beispiel registrieren wir die `http-to-https`-Hooks, aber sie sind nur für nachfolgend importierte Module verfügbar - in diesem Fall `my-app.js` und alles, worauf es über `import` oder integriertes `require` in CommonJS-Abhängigkeiten verweist.

Wenn der `import('./my-app.js')`-Aufruf stattdessen ein statischer `import './my-app.js'` gewesen wäre, wäre die App *bereits* **vor** der Registrierung der `http-to-https`-Hooks geladen worden. Dies liegt an der ES-Modul-Spezifikation, bei der statische Importe zuerst von den Blättern des Baums und dann zurück zum Stamm ausgewertet werden. Es kann statische Importe *innerhalb* von `my-app.js` geben, die erst ausgewertet werden, wenn `my-app.js` dynamisch importiert wird.

Wenn synchrone Hooks verwendet werden, werden sowohl `import`, `require` als auch benutzerdefinierte `require`, die mit `createRequire()` erstellt wurden, unterstützt.

::: code-group
```js [ESM]
import { registerHooks, createRequire } from 'node:module';

registerHooks({ /* Implementierung von synchronen Hooks */ });

const require = createRequire(import.meta.url);

// Die synchronen Hooks wirken sich auf import, require() und benutzerdefinierte require()-Funktionen aus,
// die über createRequire() erstellt wurden.
await import('./my-app.js');
require('./my-app-2.js');
```

```js [CJS]
const { register, registerHooks } = require('node:module');
const { pathToFileURL } = require('node:url');

registerHooks({ /* Implementierung von synchronen Hooks */ });

const userRequire = createRequire(__filename);

// Die synchronen Hooks wirken sich auf import, require() und benutzerdefinierte require()-Funktionen aus,
// die über createRequire() erstellt wurden.
import('./my-app.js');
require('./my-app-2.js');
userRequire('./my-app-3.js');
```
:::

Schließlich, wenn Sie lediglich Hooks registrieren möchten, bevor Ihre App ausgeführt wird, und Sie keine separate Datei für diesen Zweck erstellen möchten, können Sie eine `data:`-URL an `--import` übergeben:

```bash [BASH]
node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("http-to-https", pathToFileURL("./"));' ./my-app.js
```

### Verkettung {#chaining}

Es ist möglich, `register` mehr als einmal aufzurufen:

::: code-group
```js [ESM]
// entrypoint.mjs
import { register } from 'node:module';

register('./foo.mjs', import.meta.url);
register('./bar.mjs', import.meta.url);
await import('./my-app.mjs');
```

```js [CJS]
// entrypoint.cjs
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

const parentURL = pathToFileURL(__filename);
register('./foo.mjs', parentURL);
register('./bar.mjs', parentURL);
import('./my-app.mjs');
```
:::

In diesem Beispiel bilden die registrierten Hooks Ketten. Diese Ketten werden nach dem LIFO-Prinzip (Last-In, First-Out) ausgeführt. Wenn sowohl `foo.mjs` als auch `bar.mjs` einen `resolve`-Hook definieren, werden sie wie folgt aufgerufen (beachten Sie die Reihenfolge von rechts nach links): Node's Standard ← `./foo.mjs` ← `./bar.mjs` (beginnend mit `./bar.mjs`, dann `./foo.mjs`, dann der Node.js-Standard). Das gleiche gilt für alle anderen Hooks.

Die registrierten Hooks beeinflussen auch `register` selbst. In diesem Beispiel wird `bar.mjs` über die von `foo.mjs` registrierten Hooks aufgelöst und geladen (da die Hooks von `foo` bereits zur Kette hinzugefügt wurden). Dies ermöglicht Dinge wie das Schreiben von Hooks in Nicht-JavaScript-Sprachen, solange zuvor registrierte Hooks in JavaScript transpiliert werden.

Die `register`-Methode kann nicht innerhalb des Moduls aufgerufen werden, das die Hooks definiert.

Die Verkettung von `registerHooks` funktioniert ähnlich. Wenn synchrone und asynchrone Hooks gemischt werden, werden die synchronen Hooks immer zuerst ausgeführt, bevor die asynchronen Hooks ausgeführt werden. Das bedeutet, dass im letzten ausgeführten synchronen Hook sein nächster Hook den Aufruf der asynchronen Hooks beinhaltet.

::: code-group
```js [ESM]
// entrypoint.mjs
import { registerHooks } from 'node:module';

const hook1 = { /* Implementierung von Hooks */ };
const hook2 = { /* Implementierung von Hooks */ };
// hook2 wird vor hook1 ausgeführt.
registerHooks(hook1);
registerHooks(hook2);
```

```js [CJS]
// entrypoint.cjs
const { registerHooks } = require('node:module');

const hook1 = { /* Implementierung von Hooks */ };
const hook2 = { /* Implementierung von Hooks */ };
// hook2 wird vor hook1 ausgeführt.
registerHooks(hook1);
registerHooks(hook2);
```
:::


### Kommunikation mit Modulanpassungshooks {#communication-with-module-customization-hooks}

Asynchrone Hooks laufen in einem dedizierten Thread, getrennt vom Hauptthread, der den Anwendungscode ausführt. Das bedeutet, dass das Verändern globaler Variablen den/die andere(n) Thread(s) nicht beeinflusst und Nachrichtenkanäle für die Kommunikation zwischen den Threads verwendet werden müssen.

Die `register`-Methode kann verwendet werden, um Daten an einen [`initialize`](/de/nodejs/api/module#initialize)-Hook zu übergeben. Die an den Hook übergebenen Daten können übertragbare Objekte wie Ports enthalten.

::: code-group
```js [ESM]
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// Dieses Beispiel zeigt, wie ein Nachrichtenkanal verwendet werden kann,
// um mit den Hooks zu kommunizieren, indem `port2` an die Hooks gesendet wird.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// Dieses Beispiel zeigt, wie ein Nachrichtenkanal verwendet werden kann,
// um mit den Hooks zu kommunizieren, indem `port2` an die Hooks gesendet wird.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::

Synchrone Modul-Hooks werden im selben Thread ausgeführt, in dem der Anwendungscode ausgeführt wird. Sie können die globalen Variablen des Kontexts, auf den der Hauptthread zugreift, direkt verändern.

### Hooks {#hooks}

#### Asynchrone Hooks, die von `module.register()` akzeptiert werden {#asynchronous-hooks-accepted-by-moduleregister}

Die [`register`](/de/nodejs/api/module#moduleregisterspecifier-parenturl-options)-Methode kann verwendet werden, um ein Modul zu registrieren, das eine Reihe von Hooks exportiert. Die Hooks sind Funktionen, die von Node.js aufgerufen werden, um die Modulauflösung und den Ladeprozess anzupassen. Die exportierten Funktionen müssen bestimmte Namen und Signaturen haben und als benannte Exporte exportiert werden.

```js [ESM]
export async function initialize({ number, port }) {
  // Empfängt Daten von `register`.
}

export async function resolve(specifier, context, nextResolve) {
  // Nimmt einen `import`- oder `require`-Spezifizierer und löst ihn in eine URL auf.
}

export async function load(url, context, nextLoad) {
  // Nimmt eine aufgelöste URL und gibt den zu bewertenden Quellcode zurück.
}
```
Asynchrone Hooks werden in einem separaten Thread ausgeführt, isoliert vom Hauptthread, in dem der Anwendungscode ausgeführt wird. Das bedeutet, dass es sich um einen anderen [Realm](https://tc39.es/ecma262/#realm) handelt. Der Hooks-Thread kann jederzeit vom Hauptthread beendet werden, verlassen Sie sich also nicht darauf, dass asynchrone Operationen (wie `console.log`) abgeschlossen werden. Sie werden standardmäßig in untergeordnete Worker übernommen.


#### Synchrone Hooks, die von `module.registerHooks()` akzeptiert werden {#synchronous-hooks-accepted-by-moduleregisterhooks}

**Hinzugefügt in: v23.5.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Die `module.registerHooks()` Methode akzeptiert synchrone Hook-Funktionen. `initialize()` wird nicht unterstützt und ist auch nicht notwendig, da der Hook-Implementierer den Initialisierungscode einfach direkt vor dem Aufruf von `module.registerHooks()` ausführen kann.

```js [ESM]
function resolve(specifier, context, nextResolve) {
  // Nimmt einen `import`- oder `require`-Spezifizierer entgegen und löst ihn in eine URL auf.
}

function load(url, context, nextLoad) {
  // Nimmt eine aufgelöste URL entgegen und gibt den auszuwertenden Quellcode zurück.
}
```
Synchrone Hooks werden im selben Thread und im selben [Realm](https://tc39.es/ecma262/#realm) ausgeführt, in dem die Module geladen werden. Im Gegensatz zu den asynchronen Hooks werden sie standardmäßig nicht in Kind-Worker-Threads vererbt, obwohl Kind-Worker-Threads die vorgeladenen Skripte über die `process.execArgv`-Vererbung erben können, wenn die Hooks mit einer Datei registriert werden, die durch [`--import`](/de/nodejs/api/cli#--importmodule) oder [`--require`](/de/nodejs/api/cli#-r---require-module) vorgeladen wurde. Siehe [die Dokumentation von `Worker`](/de/nodejs/api/worker_threads#new-workerfilename-options) für Details.

In synchronen Hooks können Benutzer erwarten, dass `console.log()` auf die gleiche Weise abgeschlossen wird, wie sie erwarten, dass `console.log()` im Modulcode abgeschlossen wird.

#### Konventionen von Hooks {#conventions-of-hooks}

Hooks sind Teil einer [Kette](/de/nodejs/api/module#chaining), auch wenn diese Kette nur aus einem benutzerdefinierten (vom Benutzer bereitgestellten) Hook und dem Standard-Hook besteht, der immer vorhanden ist. Hook-Funktionen sind verschachtelt: Jede muss immer ein einfaches Objekt zurückgeben, und die Verkettung erfolgt, weil jede Funktion `next\<hookName\>()` aufruft, was eine Referenz auf den Hook des nachfolgenden Loaders (in LIFO-Reihenfolge) ist.

Ein Hook, der einen Wert ohne eine erforderliche Eigenschaft zurückgibt, löst eine Ausnahme aus. Ein Hook, der zurückkehrt, ohne `next\<hookName\>()` aufzurufen *und* ohne `shortCircuit: true` zurückzugeben, löst ebenfalls eine Ausnahme aus. Diese Fehler sollen unbeabsichtigte Unterbrechungen in der Kette verhindern. Geben Sie `shortCircuit: true` von einem Hook zurück, um zu signalisieren, dass die Kette absichtlich an Ihrem Hook endet.


#### `initialize()` {#initialize}

**Hinzugefügt in: v20.6.0, v18.19.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).2 - Release Candidate
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Die Daten von `register(loader, import.meta.url, { data })`.

Der `initialize`-Hook wird nur von [`register`](/de/nodejs/api/module#moduleregisterspecifier-parenturl-options) akzeptiert. `registerHooks()` unterstützt ihn nicht und benötigt ihn auch nicht, da die Initialisierung, die für synchrone Hooks durchgeführt wird, direkt vor dem Aufruf von `registerHooks()` ausgeführt werden kann.

Der `initialize`-Hook bietet eine Möglichkeit, eine benutzerdefinierte Funktion zu definieren, die im Hook-Thread ausgeführt wird, wenn das Hook-Modul initialisiert wird. Die Initialisierung erfolgt, wenn das Hook-Modul über [`register`](/de/nodejs/api/module#moduleregisterspecifier-parenturl-options) registriert wird.

Dieser Hook kann Daten von einem [`register`](/de/nodejs/api/module#moduleregisterspecifier-parenturl-options)-Aufruf empfangen, einschließlich Ports und anderer übertragbarer Objekte. Der Rückgabewert von `initialize` kann ein [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) sein, in diesem Fall wird er erwartet, bevor die Ausführung des Hauptanwendungs-Threads fortgesetzt wird.

Modul-Anpassungscode:

```js [ESM]
// path-to-my-hooks.js

export async function initialize({ number, port }) {
  port.postMessage(`increment: ${number + 1}`);
}
```
Aufrufender Code:



::: code-group
```js [ESM]
import assert from 'node:assert';
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// Dieses Beispiel zeigt, wie ein Message-Channel verwendet werden kann, um zu kommunizieren
// zwischen dem Haupt- (Anwendungs-) Thread und den Hooks, die im Hooks-Thread laufen,
// indem `port2` an den `initialize`-Hook gesendet wird.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const assert = require('node:assert');
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// Dieses Beispiel zeigt, wie ein Message-Channel verwendet werden kann, um zu kommunizieren
// zwischen dem Haupt- (Anwendungs-) Thread und den Hooks, die im Hooks-Thread laufen,
// indem `port2` an den `initialize`-Hook gesendet wird.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::


#### `resolve(specifier, context, nextResolve)` {#resolvespecifier-context-nextresolve}

::: info [History]
| Version | Changes |
| --- | --- |
| v23.5.0 | Add support for synchronous and in-thread hooks. |
| v21.0.0, v20.10.0, v18.19.0 | The property `context.importAssertions` is replaced with `context.importAttributes`. Using the old name is still supported and will emit an experimental warning. |
| v18.6.0, v16.17.0 | Add support for chaining resolve hooks. Each hook must either call `nextResolve()` or include a `shortCircuit` property set to `true` in its return. |
| v17.1.0, v16.14.0 | Add support for import assertions. |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).2 - Release Candidate (asynchrone Version) Stabilität: 1.1 - Aktive Entwicklung (synchrone Version)
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Export-Bedingungen der relevanten `package.json`
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Objekt, dessen Schlüssel-Wert-Paare die Attribute für das zu importierende Modul darstellen
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Das Modul, das dieses importiert, oder undefiniert, wenn dies der Node.js-Einstiegspunkt ist
  
 
- `nextResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der nachfolgende `resolve`-Hook in der Kette oder der Node.js-Standard-`resolve`-Hook nach dem letzten benutzerdefinierten `resolve`-Hook
    - `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Die asynchrone Version akzeptiert entweder ein Objekt, das die folgenden Eigenschaften enthält, oder ein `Promise`, das zu einem solchen Objekt aufgelöst wird. Die synchrone Version akzeptiert nur ein synchron zurückgegebenes Objekt.
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Ein Hinweis für den Lade-Hook (er kann ignoriert werden) `'builtin' | 'commonjs' | 'json' | 'module' | 'wasm'`
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Importattribute, die beim Zwischenspeichern des Moduls verwendet werden sollen (optional; wenn ausgeschlossen, wird die Eingabe verwendet)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ein Signal, dass dieser Hook die Kette der `resolve`-Hooks beenden soll. **Standard:** `false`
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die absolute URL, zu der diese Eingabe aufgelöst wird
  
 

Die `resolve`-Hook-Kette ist dafür verantwortlich, Node.js mitzuteilen, wo eine bestimmte `import`-Anweisung oder ein Ausdruck oder ein `require`-Aufruf zu finden und wie sie zwischengespeichert werden sollen. Optional kann ein Format (z. B. `'module'`) als Hinweis für den `load`-Hook zurückgegeben werden. Wenn ein Format angegeben wird, ist der `load`-Hook letztendlich für die Bereitstellung des endgültigen `format`-Werts verantwortlich (und es steht ihm frei, den von `resolve` bereitgestellten Hinweis zu ignorieren); wenn `resolve` ein `format` bereitstellt, ist ein benutzerdefinierter `load`-Hook erforderlich, selbst wenn der Wert nur an den Node.js-Standard-`load`-Hook übergeben werden soll.

Importtypattribute sind Teil des Cache-Schlüssels zum Speichern geladener Module im internen Modulcache. Der `resolve`-Hook ist dafür verantwortlich, ein `importAttributes`-Objekt zurückzugeben, wenn das Modul mit anderen Attributen zwischengespeichert werden soll als im Quellcode vorhanden waren.

Die Eigenschaft `conditions` in `context` ist ein Array von Bedingungen, die verwendet werden, um [Paketexportbedingungen](/de/nodejs/api/packages#conditional-exports) für diese Auflösungsanforderung abzugleichen. Sie können verwendet werden, um bedingte Zuordnungen an anderer Stelle zu suchen oder um die Liste zu ändern, wenn die Standardauflösungslogik aufgerufen wird.

Die aktuellen [Paketexportbedingungen](/de/nodejs/api/packages#conditional-exports) befinden sich immer im Array `context.conditions`, das an den Hook übergeben wird. Um *das Standardverhalten der Modulspezifikationsauflösung von Node.js* beim Aufrufen von `defaultResolve` zu gewährleisten, *muss* das Array `context.conditions`, das an ihn übergeben wird, *alle* Elemente des Arrays `context.conditions` enthalten, das ursprünglich an den `resolve`-Hook übergeben wurde.

```js [ESM]
// Asynchrone Version, die von module.register() akzeptiert wird.
export async function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  if (Math.random() > 0.5) { // Einige Bedingung.
    // Führen Sie für einige oder alle Spezifizierer eine benutzerdefinierte Logik zum Auflösen durch.
    // Geben Sie immer ein Objekt der Form {url: <string>} zurück.
    return {
      shortCircuit: true,
      url: parentURL ?
        new URL(specifier, parentURL).href :
        new URL(specifier).href,
    };
  }

  if (Math.random() < 0.5) { // Eine andere Bedingung.
    // Beim Aufrufen von `defaultResolve` können die Argumente geändert werden. In diesem
    // Fall wird ein weiterer Wert zum Abgleichen bedingter Exporte hinzugefügt.
    return nextResolve(specifier, {
      ...context,
      conditions: [...context.conditions, 'another-condition'],
    });
  }

  // Überlassen Sie die Entscheidung dem nächsten Hook in der Kette, der die
  // Node.js-Standardauflösung wäre, wenn dies der letzte vom Benutzer angegebene Loader ist.
  return nextResolve(specifier);
}
```
```js [ESM]
// Synchrone Version, die von module.registerHooks() akzeptiert wird.
function resolve(specifier, context, nextResolve) {
  // Ähnlich wie bei der obigen asynchronen resolve(), da diese keine
  // asynchrone Logik enthält.
}
```

#### `load(url, context, nextLoad)` {#loadurl-context-nextload}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.5.0 | Unterstützung für synchrone und In-Thread-Version hinzugefügt. |
| v20.6.0 | Unterstützung für `source` mit dem Format `commonjs` hinzugefügt. |
| v18.6.0, v16.17.0 | Unterstützung für die Verkettung von Load-Hooks hinzugefügt. Jeder Hook muss entweder `nextLoad()` aufrufen oder eine `shortCircuit`-Eigenschaft mit dem Wert `true` in seiner Rückgabe enthalten. |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).2 - Release Candidate (asynchrone Version) Stabilität: 1.1 - Aktive Entwicklung (synchrone Version)
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die von der `resolve`-Kette zurückgegebene URL
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Exportbedingungen der relevanten `package.json`
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Das Format, das optional von der `resolve`-Hook-Kette bereitgestellt wird
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)


- `nextLoad` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der nachfolgende `load`-Hook in der Kette oder der Node.js-Standard-`load`-Hook nach dem letzten benutzerdefinierten `load`-Hook
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)


- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Die asynchrone Version akzeptiert entweder ein Objekt, das die folgenden Eigenschaften enthält, oder ein `Promise`, das zu einem solchen Objekt aufgelöst wird. Die synchrone Version akzeptiert nur ein Objekt, das synchron zurückgegeben wird.
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ein Signal, dass dieser Hook die Kette von `load`-Hooks beenden soll. **Standard:** `false`
    - `source` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Die Quelle für Node.js zur Auswertung


Der `load`-Hook bietet eine Möglichkeit, eine benutzerdefinierte Methode zur Bestimmung der Interpretation, des Abrufs und der Analyse einer URL zu definieren. Er ist auch für die Validierung der Importattribute verantwortlich.

Der endgültige Wert von `format` muss einer der folgenden sein:

| `format` | Beschreibung | Akzeptable Typen für `source`, die von `load` zurückgegeben werden |
| --- | --- | --- |
| `'builtin'` | Lädt ein Node.js-Builtin-Modul | Nicht anwendbar |
| `'commonjs'` | Lädt ein Node.js CommonJS-Modul | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) , `null` , `undefined` } |
| `'json'` | Lädt eine JSON-Datei | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'module'` | Lädt ein ES-Modul | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'wasm'` | Lädt ein WebAssembly-Modul | { [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
Der Wert von `source` wird für den Typ `'builtin'` ignoriert, da es derzeit nicht möglich ist, den Wert eines Node.js-Builtin-(Core-)Moduls zu ersetzen.


##### Caveat im asynchronen `load`-Hook {#caveat-in-the-asynchronous-load-hook}

Bei der Verwendung des asynchronen `load`-Hooks hat das Weglassen im Vergleich zur Bereitstellung einer `source` für `'commonjs'` sehr unterschiedliche Auswirkungen:

- Wenn eine `source` bereitgestellt wird, werden alle `require`-Aufrufe aus diesem Modul vom ESM-Loader mit registrierten `resolve`- und `load`-Hooks verarbeitet; alle `require.resolve`-Aufrufe aus diesem Modul werden vom ESM-Loader mit registrierten `resolve`-Hooks verarbeitet; nur eine Teilmenge der CommonJS-API wird verfügbar sein (z. B. kein `require.extensions`, kein `require.cache`, keine `require.resolve.paths`) und Monkey-Patching auf den CommonJS-Modul-Loader wird nicht angewendet.
- Wenn `source` undefiniert oder `null` ist, wird es vom CommonJS-Modul-Loader behandelt, und `require`/`require.resolve`-Aufrufe durchlaufen nicht die registrierten Hooks. Dieses Verhalten für Nullwerte von `source` ist vorübergehend – in Zukunft wird `source` als Nullwert nicht unterstützt.

Diese Einschränkungen gelten nicht für den synchronen `load`-Hook, in diesem Fall ist die vollständige Gruppe von CommonJS-APIs für die angepassten CommonJS-Module verfügbar, und `require`/`require.resolve` durchlaufen immer die registrierten Hooks.

Die interne asynchrone `load`-Implementierung von Node.js, die der Wert von `next` für den letzten Hook in der `load`-Kette ist, gibt `null` für `source` zurück, wenn `format` für die Abwärtskompatibilität `'commonjs'` ist. Hier ist ein Beispiel für einen Hook, der sich für die Verwendung des Nicht-Standardverhaltens entscheiden würde:

```js [ESM]
import { readFile } from 'node:fs/promises';

// Asynchrone Version, die von module.register() akzeptiert wird. Diese Korrektur ist nicht erforderlich
// für die synchrone Version, die von module.registerSync() akzeptiert wird.
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format === 'commonjs') {
    result.source ??= await readFile(new URL(result.responseURL ?? url));
  }
  return result;
}
```
Dies gilt auch nicht für den synchronen `load`-Hook. In diesem Fall enthält die zurückgegebene `source` den vom nächsten Hook geladenen Quellcode, unabhängig vom Modulformat.

- Das spezifische [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)-Objekt ist ein [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer).
- Das spezifische [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)-Objekt ist ein [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

Wenn der Quellwert eines textbasierten Formats (d. h. `'json'`, `'module'`) keine Zeichenfolge ist, wird er mithilfe von [`util.TextDecoder`](/de/nodejs/api/util#class-utiltextdecoder) in eine Zeichenfolge konvertiert.

Der `load`-Hook bietet eine Möglichkeit, eine benutzerdefinierte Methode zum Abrufen des Quellcodes einer aufgelösten URL zu definieren. Dies würde es einem Loader ermöglichen, möglicherweise das Lesen von Dateien von der Festplatte zu vermeiden. Er könnte auch verwendet werden, um ein nicht erkanntes Format einem unterstützten Format zuzuordnen, z. B. `yaml` zu `module`.

```js [ESM]
// Asynchrone Version, die von module.register() akzeptiert wird.
export async function load(url, context, nextLoad) {
  const { format } = context;

  if (Math.random() > 0.5) { // Eine Bedingung
    /*
      Führen Sie für einige oder alle URLs eine benutzerdefinierte Logik zum Abrufen der Quelle durch.
      Geben Sie immer ein Objekt der Form {
        format: <string>,
        source: <string|buffer>,
      } zurück.
    */
    return {
      format,
      shortCircuit: true,
      source: '...',
    };
  }

  // Übertragen Sie an den nächsten Hook in der Kette.
  return nextLoad(url);
}
```
```js [ESM]
// Synchrone Version, die von module.registerHooks() akzeptiert wird.
function load(url, context, nextLoad) {
  // Ähnlich wie der obige asynchrone load(), da dieser keine
  // asynchrone Logik enthält.
}
```
In einem fortgeschritteneren Szenario kann dies auch verwendet werden, um eine nicht unterstützte Quelle in eine unterstützte zu transformieren (siehe [Beispiele](/de/nodejs/api/module#examples) unten).


### Beispiele {#examples}

Die verschiedenen Modul-Anpassungshooks können zusammen verwendet werden, um weitreichende Anpassungen des Node.js-Code-Lade- und Auswertungsverhaltens zu erreichen.

#### Import von HTTPS {#import-from-https}

Der folgende Hook registriert Hooks, um eine rudimentäre Unterstützung für solche Spezifizierer zu ermöglichen. Obwohl dies wie eine deutliche Verbesserung der Node.js-Kernfunktionalität erscheinen mag, gibt es erhebliche Nachteile bei der tatsächlichen Verwendung dieser Hooks: Die Leistung ist viel langsamer als das Laden von Dateien von der Festplatte, es gibt keine Zwischenspeicherung und es gibt keine Sicherheit.

```js [ESM]
// https-hooks.mjs
import { get } from 'node:https';

export function load(url, context, nextLoad) {
  // Damit JavaScript über das Netzwerk geladen werden kann, müssen wir es abrufen und
  // zurückgeben.
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => {
      get(url, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({
          // Dieses Beispiel geht davon aus, dass jeder über das Netzwerk bereitgestellte JavaScript
          // ES-Modulcode ist.
          format: 'module',
          shortCircuit: true,
          source: data,
        }));
      }).on('error', (err) => reject(err));
    });
  }

  // Node.js soll alle anderen URLs verarbeiten.
  return nextLoad(url);
}
```
```js [ESM]
// main.mjs
import { VERSION } from 'https://coffeescript.org/browser-compiler-modern/coffeescript.js';

console.log(VERSION);
```
Mit dem vorhergehenden Hooks-Modul gibt die Ausführung von `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./https-hooks.mjs"));' ./main.mjs` die aktuelle Version von CoffeeScript gemäß dem Modul unter der URL in `main.mjs` aus.

#### Transpilierung {#transpilation}

Quellen, die in Formaten vorliegen, die Node.js nicht versteht, können mit dem [`load`-Hook](/de/nodejs/api/module#loadurl-context-nextload) in JavaScript konvertiert werden.

Dies ist weniger performant als die Transpilierung von Quelldateien vor der Ausführung von Node.js. Transpilierer-Hooks sollten nur für Entwicklungs- und Testzwecke verwendet werden.


##### Asynchrone Version {#asynchronous-version}

```js [ESM]
// coffeescript-hooks.mjs
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

export async function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    // CoffeeScript-Dateien können entweder CommonJS- oder ES-Module sein, daher möchten wir,
    // dass jede CoffeeScript-Datei von Node.js genauso behandelt wird wie eine .js-Datei am
    // selben Ort. Um zu bestimmen, wie Node.js eine beliebige .js-Datei interpretieren würde, suchen
    // Sie im Dateisystem nach der nächstgelegenen übergeordneten package.json-Datei und lesen
    // Sie deren Feld "type".
    const format = await getPackageType(url);

    const { source: rawSource } = await nextLoad(url, { ...context, format });
    // Dieser Hook konvertiert CoffeeScript-Quellcode in JavaScript-Quellcode
    // für alle importierten CoffeeScript-Dateien.
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  // Node.js soll alle anderen URLs verarbeiten.
  return nextLoad(url);
}

async function getPackageType(url) {
  // `url` ist nur ein Dateipfad während der ersten Iteration, wenn die
  // aufgelöste URL vom load()-Hook übergeben wird
  // ein tatsächlicher Dateipfad von load() enthält eine Dateierweiterung, da diese
  // von der Spezifikation gefordert wird
  // diese einfache Überprüfung, ob `url` eine Dateierweiterung enthält, wird
  // für die meisten Projekte funktionieren, deckt aber einige Sonderfälle nicht ab (z. B.
  // Dateien ohne Erweiterung oder eine URL, die mit einem nachgestellten Leerzeichen endet)
  const isFilePath = !!extname(url);
  // Wenn es sich um einen Dateipfad handelt, holen Sie sich das Verzeichnis, in dem er sich befindet
  const dir = isFilePath ?
    dirname(fileURLToPath(url)) :
    url;
  // Erstellen Sie einen Dateipfad zu einer package.json im selben Verzeichnis,
  // die möglicherweise nicht existiert
  const packagePath = resolvePath(dir, 'package.json');
  // Versuchen Sie, die möglicherweise nicht vorhandene package.json zu lesen
  const type = await readFile(packagePath, { encoding: 'utf8' })
    .then((filestring) => JSON.parse(filestring).type)
    .catch((err) => {
      if (err?.code !== 'ENOENT') console.error(err);
    });
  // Wenn package.json existierte und ein Feld `type` mit einem Wert enthielt, voilà
  if (type) return type;
  // Andernfalls (wenn nicht im Stammverzeichnis) überprüfen Sie weiterhin das nächste Verzeichnis darüber
  // Wenn im Stammverzeichnis, stoppen Sie und geben Sie false zurück
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}
```

##### Synchrone Version {#synchronous-version}

```js [ESM]
// coffeescript-sync-hooks.mjs
import { readFileSync } from 'node:fs/promises';
import { registerHooks } from 'node:module';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    const format = getPackageType(url);

    const { source: rawSource } = nextLoad(url, { ...context, format });
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  return nextLoad(url);
}

function getPackageType(url) {
  const isFilePath = !!extname(url);
  const dir = isFilePath ? dirname(fileURLToPath(url)) : url;
  const packagePath = resolvePath(dir, 'package.json');

  let type;
  try {
    const filestring = readFileSync(packagePath, { encoding: 'utf8' });
    type = JSON.parse(filestring).type;
  } catch (err) {
    if (err?.code !== 'ENOENT') console.error(err);
  }
  if (type) return type;
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}

registerHooks({ load });
```
#### Hooks ausführen {#running-hooks}

```coffee [COFFEECRIPT]
# main.coffee {#maincoffee}
import { scream } from './scream.coffee'
console.log scream 'hello, world'

import { version } from 'node:process'
console.log "Brought to you by Node.js version #{version}"
```
```coffee [COFFEECRIPT]
# scream.coffee {#screamcoffee}
export scream = (str) -> str.toUpperCase()
```
Wenn die vorhergehenden Hooks-Module verwendet werden, führt das Ausführen von `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./coffeescript-hooks.mjs"));' ./main.coffee` oder `node --import ./coffeescript-sync-hooks.mjs ./main.coffee` dazu, dass `main.coffee` in JavaScript umgewandelt wird, nachdem der Quellcode von der Festplatte geladen wurde, aber bevor Node.js ihn ausführt; und so weiter für alle `.coffee`-, `.litcoffee`- oder `.coffee.md`-Dateien, auf die über `import`-Anweisungen einer geladenen Datei verwiesen wird.


#### Import Maps {#import-maps}

Die vorherigen zwei Beispiele definierten `load`-Hooks. Dies ist ein Beispiel für einen `resolve`-Hook. Dieses Hook-Modul liest eine `import-map.json`-Datei, die definiert, welche Spezifizierer auf andere URLs umgeleitet werden sollen (dies ist eine sehr vereinfachte Implementierung einer kleinen Teilmenge der "Import Maps"-Spezifikation).

##### Asynchrone Version {#asynchronous-version_1}

```js [ESM]
// import-map-hooks.js
import fs from 'node:fs/promises';

const { imports } = JSON.parse(await fs.readFile('import-map.json'));

export async function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}
```
##### Synchrone Version {#synchronous-version_1}

```js [ESM]
// import-map-sync-hooks.js
import fs from 'node:fs/promises';
import module from 'node:module';

const { imports } = JSON.parse(fs.readFileSync('import-map.json', 'utf-8'));

function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}

module.registerHooks({ resolve });
```
##### Verwenden der Hooks {#using-the-hooks}

Mit diesen Dateien:

```js [ESM]
// main.js
import 'a-module';
```
```json [JSON]
// import-map.json
{
  "imports": {
    "a-module": "./some-module.js"
  }
}
```
```js [ESM]
// some-module.js
console.log('some module!');
```
Das Ausführen von `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./import-map-hooks.js"));' main.js` oder `node --import ./import-map-sync-hooks.js main.js` sollte `some module!` ausgeben.

## Source Map v3 Unterstützung {#source-map-v3-support}

**Hinzugefügt in: v13.7.0, v12.17.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Helfer für die Interaktion mit dem Source-Map-Cache. Dieser Cache wird gefüllt, wenn das Source-Map-Parsing aktiviert ist und [Source-Map-Include-Direktiven](https://sourcemaps.info/spec#h.lmz475t4mvbx) in der Fußzeile eines Moduls gefunden werden.

Um das Source-Map-Parsing zu aktivieren, muss Node.js mit dem Flag [`--enable-source-maps`](/de/nodejs/api/cli#--enable-source-maps) oder mit aktivierter Codeabdeckung durch Setzen von [`NODE_V8_COVERAGE=dir`](/de/nodejs/api/cli#node_v8_coveragedir) ausgeführt werden.

::: code-group
```js [ESM]
// module.mjs
// In einem ECMAScript-Modul
import { findSourceMap, SourceMap } from 'node:module';
```

```js [CJS]
// module.cjs
// In einem CommonJS-Modul
const { findSourceMap, SourceMap } = require('node:module');
```
:::


### `module.findSourceMap(path)` {#modulefindsourcemappath}

**Hinzugefügt in: v13.7.0, v12.17.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<module.SourceMap\>](/de/nodejs/api/module#class-modulesourcemap) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Gibt `module.SourceMap` zurück, wenn eine Source Map gefunden wird, andernfalls `undefined`.

`path` ist der aufgelöste Pfad für die Datei, für die eine entsprechende Source Map abgerufen werden soll.

### Klasse: `module.SourceMap` {#class-modulesourcemap}

**Hinzugefügt in: v13.7.0, v12.17.0**

#### `new SourceMap(payload[, { lineLengths }])` {#new-sourcemappayload-{-linelengths-}}

- `payload` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `lineLengths` [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Erstellt eine neue `sourceMap`-Instanz.

`payload` ist ein Objekt mit Schlüsseln, die dem [Source-Map-v3-Format](https://sourcemaps.info/spec#h.mofvlxcwqzej) entsprechen:

- `file`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `version`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `sources`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourcesContent`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `names`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `mappings`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourceRoot`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`lineLengths` ist ein optionales Array mit der Länge jeder Zeile im generierten Code.

#### `sourceMap.payload` {#sourcemappayload}

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Getter für die Payload, die zum Erstellen der [`SourceMap`](/de/nodejs/api/module#class-modulesourcemap)-Instanz verwendet wird.


#### `sourceMap.findEntry(lineOffset, columnOffset)` {#sourcemapfindentrylineoffset-columnoffset}

- `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der nullbasierte Zeilennummer-Offset in der generierten Quelle
- `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der nullbasierte Spaltennummer-Offset in der generierten Quelle
- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt ein Objekt zurück, das den SourceMap-Bereich in der ursprünglichen Datei darstellt, wenn ein Zeilen-Offset und ein Spalten-Offset in der generierten Quelldatei angegeben sind. Wenn keine gefunden wird, wird ein leeres Objekt zurückgegeben.

Das zurückgegebene Objekt enthält die folgenden Schlüssel:

- generatedLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Zeilen-Offset des Anfangs des Bereichs in der generierten Quelle
- generatedColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Spalten-Offset des Anfangs des Bereichs in der generierten Quelle
- originalSource: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Dateiname der ursprünglichen Quelle, wie in der SourceMap angegeben
- originalLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Zeilen-Offset des Anfangs des Bereichs in der ursprünglichen Quelle
- originalColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Spalten-Offset des Anfangs des Bereichs in der ursprünglichen Quelle
- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der zurückgegebene Wert stellt den Rohbereich so dar, wie er in der SourceMap erscheint, basierend auf nullbasierten Offsets, *nicht* 1-basierten Zeilen- und Spaltennummern, wie sie in Fehlermeldungen und CallSite-Objekten erscheinen.

Um die entsprechenden 1-basierten Zeilen- und Spaltennummern aus einer lineNumber und columnNumber zu erhalten, wie sie von Error-Stapeln und CallSite-Objekten gemeldet werden, verwenden Sie `sourceMap.findOrigin(lineNumber, columnNumber)`


#### `sourceMap.findOrigin(lineNumber, columnNumber)` {#sourcemapfindoriginlinenumber-columnnumber}

- `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die 1-basierte Zeilennummer der Aufrufstelle in der generierten Quelle
- `columnNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die 1-basierte Spaltennummer der Aufrufstelle in der generierten Quelle
- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Ermittelt anhand einer 1-basierten `lineNumber` und `columnNumber` von einer Aufrufstelle in der generierten Quelle die entsprechende Position der Aufrufstelle in der ursprünglichen Quelle.

Wenn die bereitgestellte `lineNumber` und `columnNumber` in keiner Source Map gefunden werden, wird ein leeres Objekt zurückgegeben. Andernfalls enthält das zurückgegebene Objekt die folgenden Schlüssel:

- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Der Name des Bereichs in der Source Map, falls angegeben
- fileName: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Dateiname der ursprünglichen Quelle, wie in der SourceMap angegeben
- lineNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die 1-basierte lineNumber der entsprechenden Aufrufstelle in der ursprünglichen Quelle
- columnNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die 1-basierte columnNumber der entsprechenden Aufrufstelle in der ursprünglichen Quelle

