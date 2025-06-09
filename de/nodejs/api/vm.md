---
title: Node.js VM Modul Dokumentation
description: Das VM (Virtuelle Maschine) Modul in Node.js bietet APIs zum Kompilieren und Ausführen von Code innerhalb von V8 JavaScript Engine Kontexten. Es ermöglicht die Erstellung isolierter JavaScript-Umgebungen, die Sandboxing von Code-Ausführung und das Verwalten von Skriptkontexten.
head:
  - - meta
    - name: og:title
      content: Node.js VM Modul Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das VM (Virtuelle Maschine) Modul in Node.js bietet APIs zum Kompilieren und Ausführen von Code innerhalb von V8 JavaScript Engine Kontexten. Es ermöglicht die Erstellung isolierter JavaScript-Umgebungen, die Sandboxing von Code-Ausführung und das Verwalten von Skriptkontexten.
  - - meta
    - name: twitter:title
      content: Node.js VM Modul Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das VM (Virtuelle Maschine) Modul in Node.js bietet APIs zum Kompilieren und Ausführen von Code innerhalb von V8 JavaScript Engine Kontexten. Es ermöglicht die Erstellung isolierter JavaScript-Umgebungen, die Sandboxing von Code-Ausführung und das Verwalten von Skriptkontexten.
---


# VM (JavaScript ausführen) {#vm-executing-javascript}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/vm.js](https://github.com/nodejs/node/blob/v23.5.0/lib/vm.js)

Das Modul `node:vm` ermöglicht das Kompilieren und Ausführen von Code innerhalb von V8 Virtual Machine-Kontexten.

**Das Modul <code>node:vm</code> ist kein Sicherheitsmechanismus. Verwenden Sie es nicht, um nicht vertrauenswürdigen Code auszuführen.**

JavaScript-Code kann kompiliert und sofort ausgeführt oder kompiliert, gespeichert und später ausgeführt werden.

Ein häufiger Anwendungsfall ist das Ausführen des Codes in einem anderen V8-Kontext. Dies bedeutet, dass der aufgerufene Code ein anderes globales Objekt hat als der aufrufende Code.

Man kann den Kontext bereitstellen, indem man ein Objekt [*kontextualisiert*](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Der aufgerufene Code behandelt jede Eigenschaft im Kontext wie eine globale Variable. Jegliche Änderungen an globalen Variablen, die durch den aufgerufenen Code verursacht werden, spiegeln sich im Kontextobjekt wider.

```js [ESM]
const vm = require('node:vm');

const x = 1;

const context = { x: 2 };
vm.createContext(context); // Kontextualisiere das Objekt.

const code = 'x += 40; var y = 17;';
// `x` und `y` sind globale Variablen im Kontext.
// Ursprünglich hat x den Wert 2, da dies der Wert von context.x ist.
vm.runInContext(code, context);

console.log(context.x); // 42
console.log(context.y); // 17

console.log(x); // 1; y ist nicht definiert.
```
## Klasse: `vm.Script` {#class-vmscript}

**Hinzugefügt in: v0.3.1**

Instanzen der Klasse `vm.Script` enthalten vorkompilierte Skripte, die in bestimmten Kontexten ausgeführt werden können.

### `new vm.Script(code[, options])` {#new-vmscriptcode-options}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v21.7.0, v20.12.0 | Unterstützung für `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` hinzugefügt. |
| v17.0.0, v16.12.0 | Unterstützung für Importattribute für den Parameter `importModuleDynamically` hinzugefügt. |
| v10.6.0 | `produceCachedData` ist zugunsten von `script.createCachedData()` veraltet. |
| v5.7.0 | Die Optionen `cachedData` und `produceCachedData` werden jetzt unterstützt. |
| v0.3.1 | Hinzugefügt in: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der zu kompilierende JavaScript-Code.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt den Dateinamen an, der in Stacktraces verwendet wird, die von diesem Skript erzeugt werden. **Standard:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt den Zeilennummernoffset an, der in Stacktraces angezeigt wird, die von diesem Skript erzeugt werden. **Standard:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt den Spaltennummernoffset der ersten Zeile an, der in Stacktraces angezeigt wird, die von diesem Skript erzeugt werden. **Standard:** `0`.
    - `cachedData` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Stellt einen optionalen `Buffer` oder `TypedArray` oder `DataView` mit den Code-Cache-Daten von V8 für die bereitgestellte Quelle bereit. Wenn angegeben, wird der Wert `cachedDataRejected` entweder auf `true` oder `false` gesetzt, je nachdem, ob die Daten von V8 akzeptiert werden.
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true` und keine `cachedData` vorhanden sind, versucht V8, Code-Cache-Daten für `code` zu erzeugen. Bei Erfolg wird ein `Buffer` mit den Code-Cache-Daten von V8 erzeugt und in der Eigenschaft `cachedData` der zurückgegebenen `vm.Script`-Instanz gespeichert. Der Wert `cachedDataProduced` wird entweder auf `true` oder `false` gesetzt, je nachdem, ob die Code-Cache-Daten erfolgreich erzeugt wurden. Diese Option ist zugunsten von `script.createCachedData()` **veraltet**. **Standard:** `false`.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/de/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Wird verwendet, um anzugeben, wie die Module während der Auswertung dieses Skripts geladen werden sollen, wenn `import()` aufgerufen wird. Diese Option ist Teil der experimentellen Module-API. Wir empfehlen nicht, sie in einer Produktionsumgebung zu verwenden. Ausführliche Informationen finden Sie unter [Unterstützung von dynamischem `import()` in Kompilierungs-APIs](/de/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
  
 

Wenn `options` ein String ist, dann gibt er den Dateinamen an.

Das Erstellen eines neuen `vm.Script`-Objekts kompiliert `code`, führt ihn aber nicht aus. Das kompilierte `vm.Script` kann später mehrmals ausgeführt werden. Der `code` ist nicht an ein globales Objekt gebunden; stattdessen wird er vor jeder Ausführung nur für diese Ausführung gebunden.


### `script.cachedDataRejected` {#scriptcacheddatarejected}

**Hinzugefügt in: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Wenn `cachedData` bereitgestellt wird, um das `vm.Script` zu erstellen, wird dieser Wert entweder auf `true` oder `false` gesetzt, je nachdem, ob die Daten von V8 akzeptiert werden. Andernfalls ist der Wert `undefined`.

### `script.createCachedData()` {#scriptcreatecacheddata}

**Hinzugefügt in: v10.6.0**

- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Erstellt einen Code-Cache, der mit der `cachedData`-Option des `Script`-Konstruktors verwendet werden kann. Gibt einen `Buffer` zurück. Diese Methode kann jederzeit und beliebig oft aufgerufen werden.

Der Code-Cache des `Script` enthält keine JavaScript-beobachtbaren Zustände. Der Code-Cache kann sicher zusammen mit dem Skript-Sourcecode gespeichert und verwendet werden, um mehrmals neue `Script`-Instanzen zu erstellen.

Funktionen im `Script`-Sourcecode können als verzögert kompilierte Funktionen markiert werden, die nicht bei der Erstellung des `Script` kompiliert werden. Diese Funktionen werden kompiliert, wenn sie das erste Mal aufgerufen werden. Der Code-Cache serialisiert die Metadaten, die V8 aktuell über das `Script` hat, und kann diese verwenden, um zukünftige Kompilierungen zu beschleunigen.

```js [ESM]
const script = new vm.Script(`
function add(a, b) {
  return a + b;
}

const x = add(1, 2);
`);

const cacheWithoutAdd = script.createCachedData();
// In `cacheWithoutAdd` wird die Funktion `add()` für die vollständige Kompilierung
// beim Aufruf markiert.

script.runInThisContext();

const cacheWithAdd = script.createCachedData();
// `cacheWithAdd` enthält die vollständig kompilierte Funktion `add()`.
```
### `script.runInContext(contextifiedObject[, options])` {#scriptrunincontextcontextifiedobject-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v6.3.0 | Die Option `breakOnSigint` wird jetzt unterstützt. |
| v0.3.1 | Hinzugefügt in: v0.3.1 |
:::

- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein [kontextualisiertes](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) Objekt, wie von der Methode `vm.createContext()` zurückgegeben.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird bei einem [`Error`](/de/nodejs/api/errors#class-error) während der Kompilierung des `code` die Codezeile, die den Fehler verursacht, an den Stack Trace angehängt. **Standard:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die Anzahl der Millisekunden an, die `code` ausgeführt werden soll, bevor die Ausführung beendet wird. Wenn die Ausführung beendet wird, wird ein [`Error`](/de/nodejs/api/errors#class-error) ausgelöst. Dieser Wert muss eine strikt positive ganze Zahl sein.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true` beendet der Empfang von `SIGINT` (+) die Ausführung und löst einen [`Error`](/de/nodejs/api/errors#class-error) aus. Vorhandene Handler für das Ereignis, die über `process.on('SIGINT')` angehängt wurden, werden während der Skriptausführung deaktiviert, funktionieren danach aber wieder. **Standard:** `false`.


- Gibt zurück: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Das Ergebnis der allerletzten im Skript ausgeführten Anweisung.

Führt den von dem `vm.Script`-Objekt enthaltenen kompilierten Code innerhalb des gegebenen `contextifiedObject` aus und gibt das Ergebnis zurück. Der laufende Code hat keinen Zugriff auf den lokalen Gültigkeitsbereich.

Das folgende Beispiel kompiliert Code, der eine globale Variable inkrementiert, den Wert einer anderen globalen Variable setzt und dann den Code mehrmals ausführt. Die globalen Variablen sind im `context`-Objekt enthalten.

```js [ESM]
const vm = require('node:vm');

const context = {
  animal: 'cat',
  count: 2,
};

const script = new vm.Script('count += 1; name = "kitty";');

vm.createContext(context);
for (let i = 0; i < 10; ++i) {
  script.runInContext(context);
}

console.log(context);
// Gibt aus: { animal: 'cat', count: 12, name: 'kitty' }
```
Die Verwendung der Optionen `timeout` oder `breakOnSigint` führt zum Starten neuer Event Loops und entsprechender Threads, was einen nicht zu vernachlässigenden Performance-Overhead verursacht.


### `script.runInNewContext([contextObject[, options]])` {#scriptruninnewcontextcontextobject-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.8.0, v20.18.0 | Das Argument `contextObject` akzeptiert nun `vm.constants.DONT_CONTEXTIFY`. |
| v14.6.0 | Die Option `microtaskMode` wird jetzt unterstützt. |
| v10.0.0 | Die Option `contextCodeGeneration` wird jetzt unterstützt. |
| v6.3.0 | Die Option `breakOnSigint` wird jetzt unterstützt. |
| v0.3.1 | Hinzugefügt in: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/de/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Entweder [`vm.constants.DONT_CONTEXTIFY`](/de/nodejs/api/vm#vmconstantsdont_contextify) oder ein Objekt, das [kontextualisiert](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) wird. Wenn `undefined`, wird ein leeres, kontextualisiertes Objekt zur Abwärtskompatibilität erstellt.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird bei Auftreten eines [`Error`](/de/nodejs/api/errors#class-error) beim Kompilieren des `code` die Codezeile, die den Fehler verursacht, an den Stack-Trace angehängt. **Standard:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die Anzahl der Millisekunden an, die `code` vor dem Beenden der Ausführung ausgeführt werden soll. Wenn die Ausführung beendet wird, wird ein [`Error`](/de/nodejs/api/errors#class-error) ausgelöst. Dieser Wert muss eine strikt positive ganze Zahl sein.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, beendet der Empfang von `SIGINT` (+) die Ausführung und löst einen [`Error`](/de/nodejs/api/errors#class-error) aus. Vorhandene Handler für das Ereignis, die über `process.on('SIGINT')` angehängt wurden, werden während der Skriptausführung deaktiviert, funktionieren aber danach weiterhin. **Standard:** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Für Menschen lesbarer Name des neu erstellten Kontexts. **Standard:** `'VM Context i'`, wobei `i` ein aufsteigender numerischer Index des erstellten Kontexts ist.
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Ursprung](https://developer.mozilla.org/en-US/docs/Glossary/Origin) entsprechend dem neu erstellten Kontext zu Anzeigezwecken. Der Ursprung sollte wie eine URL formatiert sein, aber nur mit dem Schema, dem Host und dem Port (falls erforderlich), wie der Wert der Eigenschaft [`url.origin`](/de/nodejs/api/url#urlorigin) eines [`URL`](/de/nodejs/api/url#class-url)-Objekts. Insbesondere sollte diese Zeichenfolge den nachgestellten Schrägstrich weglassen, da dieser einen Pfad kennzeichnet. **Standard:** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf false gesetzt, lösen alle Aufrufe von `eval` oder Funktionskonstruktoren (`Function`, `GeneratorFunction` usw.) einen `EvalError` aus. **Standard:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf false gesetzt, löst jeder Versuch, ein WebAssembly-Modul zu kompilieren, einen `WebAssembly.CompileError` aus. **Standard:** `true`.


    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn auf `afterEvaluate` gesetzt, werden Mikrotasks (Tasks, die durch `Promise`s und `async function`s geplant wurden) unmittelbar nach der Ausführung des Skripts ausgeführt. Sie sind in diesem Fall in den `timeout`- und `breakOnSigint`-Bereichen enthalten.


- Gibt zurück: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) das Ergebnis der allerletzten im Skript ausgeführten Anweisung.

Diese Methode ist eine Abkürzung für `script.runInContext(vm.createContext(options), options)`. Sie erledigt mehrere Dinge gleichzeitig:

Das folgende Beispiel kompiliert Code, der eine globale Variable setzt, und führt den Code dann mehrmals in verschiedenen Kontexten aus. Die globalen Variablen werden in jedem einzelnen `context` gesetzt und darin enthalten.

```js [ESM]
const vm = require('node:vm');

const script = new vm.Script('globalVar = "set"');

const contexts = [{}, {}, {}];
contexts.forEach((context) => {
  script.runInNewContext(context);
});

console.log(contexts);
// Gibt aus: [{ globalVar: 'set' }, { globalVar: 'set' }, { globalVar: 'set' }]

// Dies würde einen Fehler auslösen, wenn der Kontext aus einem kontextualisierten Objekt erstellt würde.
// vm.constants.DONT_CONTEXTIFY ermöglicht das Erstellen von Kontexten mit normalen
// globalen Objekten, die eingefroren werden können.
const freezeScript = new vm.Script('Object.freeze(globalThis); globalThis;');
const frozenContext = freezeScript.runInNewContext(vm.constants.DONT_CONTEXTIFY);
```

### `script.runInThisContext([options])` {#scriptruninthiscontextoptions}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.3.0 | Die Option `breakOnSigint` wird jetzt unterstützt. |
| v0.3.1 | Hinzugefügt in: v0.3.1 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird, falls ein [`Error`](/de/nodejs/api/errors#class-error) während der Kompilierung des `code` auftritt, die Codezeile, die den Fehler verursacht, an den Stack-Trace angehängt. **Standard:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die Anzahl der Millisekunden an, die `code` ausgeführt werden soll, bevor die Ausführung beendet wird. Wenn die Ausführung beendet wird, wird ein [`Error`](/de/nodejs/api/errors#class-error) ausgelöst. Dieser Wert muss eine strikt positive ganze Zahl sein.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, beendet der Empfang von `SIGINT` (+) die Ausführung und wirft einen [`Error`](/de/nodejs/api/errors#class-error). Bestehende Handler für das Ereignis, die über `process.on('SIGINT')` angehängt wurden, werden während der Skriptausführung deaktiviert, funktionieren aber danach weiterhin. **Standard:** `false`.

- Gibt zurück: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) das Ergebnis der allerletzten Anweisung, die im Skript ausgeführt wurde.

Führt den kompilierten Code, der von `vm.Script` enthalten ist, im Kontext des aktuellen `global`-Objekts aus. Der ausgeführte Code hat keinen Zugriff auf den lokalen Scope, hat aber *Zugriff* auf das aktuelle `global`-Objekt.

Das folgende Beispiel kompiliert Code, der eine `global`-Variable inkrementiert, und führt diesen Code dann mehrmals aus:

```js [ESM]
const vm = require('node:vm');

global.globalVar = 0;

const script = new vm.Script('globalVar += 1', { filename: 'myfile.vm' });

for (let i = 0; i < 1000; ++i) {
  script.runInThisContext();
}

console.log(globalVar);

// 1000
```

### `script.sourceMapURL` {#scriptsourcemapurl}

**Hinzugefügt in: v19.1.0, v18.13.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Wenn das Skript aus einer Quelle kompiliert wird, die einen Source-Map-Magic-Kommentar enthält, wird diese Eigenschaft auf die URL der Source Map gesetzt.

::: code-group
```js [ESM]
import vm from 'node:vm';

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```

```js [CJS]
const vm = require('node:vm');

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```
:::

## Klasse: `vm.Module` {#class-vmmodule}

**Hinzugefügt in: v13.0.0, v12.16.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Diese Funktion ist nur mit dem aktivierten Befehlsflag `--experimental-vm-modules` verfügbar.

Die Klasse `vm.Module` bietet eine Low-Level-Schnittstelle zur Verwendung von ECMAScript-Modulen in VM-Kontexten. Sie ist das Gegenstück zur Klasse `vm.Script` und spiegelt [Moduldatensätze](https://262.ecma-international.org/14.0/#sec-abstract-module-records) wider, wie sie in der ECMAScript-Spezifikation definiert sind.

Im Gegensatz zu `vm.Script` ist jedoch jedes `vm.Module`-Objekt von seiner Erstellung an an einen Kontext gebunden. Operationen an `vm.Module`-Objekten sind von Natur aus asynchron, im Gegensatz zur synchronen Natur von `vm.Script`-Objekten. Die Verwendung von "async"-Funktionen kann bei der Bearbeitung von `vm.Module`-Objekten hilfreich sein.

Die Verwendung eines `vm.Module`-Objekts erfordert drei verschiedene Schritte: Erstellung/Parsen, Verknüpfung und Auswertung. Diese drei Schritte werden im folgenden Beispiel veranschaulicht.

Diese Implementierung liegt auf einer niedrigeren Ebene als der [ECMAScript-Modul-Loader](/de/nodejs/api/esm#modules-ecmascript-modules). Es gibt auch noch keine Möglichkeit, mit dem Loader zu interagieren, obwohl Unterstützung geplant ist.

::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

// Step 1
//
// Create a Module by constructing a new `vm.SourceTextModule` object. This
// parses the provided source text, throwing a `SyntaxError` if anything goes
// wrong. By default, a Module is created in the top context. But here, we
// specify `contextifiedObject` as the context this Module belongs to.
//
// Here, we attempt to obtain the default export from the module "foo", and
// put it into local binding "secret".

const bar = new vm.SourceTextModule(`
  import s from 'foo';
  s;
  print(s);
`, { context: contextifiedObject });

// Step 2
//
// "Link" the imported dependencies of this Module to it.
//
// The provided linking callback (the "linker") accepts two arguments: the
// parent module (`bar` in this case) and the string that is the specifier of
// the imported module. The callback is expected to return a Module that
// corresponds to the provided specifier, with certain requirements documented
// in `module.link()`.
//
// If linking has not started for the returned Module, the same linker
// callback will be called on the returned Module.
//
// Even top-level Modules without dependencies must be explicitly linked. The
// callback provided would never be called, however.
//
// The link() method returns a Promise that will be resolved when all the
// Promises returned by the linker resolve.
//
// Note: This is a contrived example in that the linker function creates a new
// "foo" module every time it is called. In a full-fledged module system, a
// cache would probably be used to avoid duplicated modules.

async function linker(specifier, referencingModule) {
  if (specifier === 'foo') {
    return new vm.SourceTextModule(`
      // The "secret" variable refers to the global variable we added to
      // "contextifiedObject" when creating the context.
      export default secret;
    `, { context: referencingModule.context });

    // Using `contextifiedObject` instead of `referencingModule.context`
    // here would work as well.
  }
  throw new Error(`Unable to resolve dependency: ${specifier}`);
}
await bar.link(linker);

// Step 3
//
// Evaluate the Module. The evaluate() method returns a promise which will
// resolve after the module has finished evaluating.

// Prints 42.
await bar.evaluate();
```

```js [CJS]
const vm = require('node:vm');

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

(async () => {
  // Step 1
  //
  // Create a Module by constructing a new `vm.SourceTextModule` object. This
  // parses the provided source text, throwing a `SyntaxError` if anything goes
  // wrong. By default, a Module is created in the top context. But here, we
  // specify `contextifiedObject` as the context this Module belongs to.
  //
  // Here, we attempt to obtain the default export from the module "foo", and
  // put it into local binding "secret".

  const bar = new vm.SourceTextModule(`
    import s from 'foo';
    s;
    print(s);
  `, { context: contextifiedObject });

  // Step 2
  //
  // "Link" the imported dependencies of this Module to it.
  //
  // The provided linking callback (the "linker") accepts two arguments: the
  // parent module (`bar` in this case) and the string that is the specifier of
  // the imported module. The callback is expected to return a Module that
  // corresponds to the provided specifier, with certain requirements documented
  // in `module.link()`.
  //
  // If linking has not started for the returned Module, the same linker
  // callback will be called on the returned Module.
  //
  // Even top-level Modules without dependencies must be explicitly linked. The
  // callback provided would never be called, however.
  //
  // The link() method returns a Promise that will be resolved when all the
  // Promises returned by the linker resolve.
  //
  // Note: This is a contrived example in that the linker function creates a new
  // "foo" module every time it is called. In a full-fledged module system, a
  // cache would probably be used to avoid duplicated modules.

  async function linker(specifier, referencingModule) {
    if (specifier === 'foo') {
      return new vm.SourceTextModule(`
        // The "secret" variable refers to the global variable we added to
        // "contextifiedObject" when creating the context.
        export default secret;
      `, { context: referencingModule.context });

      // Using `contextifiedObject` instead of `referencingModule.context`
      // here would work as well.
    }
    throw new Error(`Unable to resolve dependency: ${specifier}`);
  }
  await bar.link(linker);

  // Step 3
  //
  // Evaluate the Module. The evaluate() method returns a promise which will
  // resolve after the module has finished evaluating.

  // Prints 42.
  await bar.evaluate();
})();
```
:::

### `module.dependencySpecifiers` {#moduledependencyspecifiers}

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Spezifizierer aller Abhängigkeiten dieses Moduls. Das zurückgegebene Array ist eingefroren, um Änderungen daran zu verhindern.

Entspricht dem Feld `[[RequestedModules]]` von [Cyclic Module Records](https://tc39.es/ecma262/#sec-cyclic-module-records) in der ECMAScript-Spezifikation.

### `module.error` {#moduleerror}

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Wenn der `module.status` `'errored'` ist, enthält diese Eigenschaft die Ausnahme, die während der Auswertung vom Modul ausgelöst wurde. Wenn der Status etwas anderes ist, führt der Zugriff auf diese Eigenschaft zu einer ausgelösten Ausnahme.

Der Wert `undefined` kann nicht für Fälle verwendet werden, in denen es keine ausgelöste Ausnahme gibt, da dies zu einer möglichen Mehrdeutigkeit mit `throw undefined;` führen könnte.

Entspricht dem Feld `[[EvaluationError]]` von [Cyclic Module Records](https://tc39.es/ecma262/#sec-cyclic-module-records) in der ECMAScript-Spezifikation.

### `module.evaluate([options])` {#moduleevaluateoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die Anzahl der Millisekunden an, die vor dem Beenden der Ausführung ausgewertet werden sollen. Wenn die Ausführung unterbrochen wird, wird ein [`Error`](/de/nodejs/api/errors#class-error) ausgelöst. Dieser Wert muss eine strikt positive ganze Zahl sein.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, beendet der Empfang von `SIGINT` (+) die Ausführung und löst einen [`Error`](/de/nodejs/api/errors#class-error) aus. Vorhandene Handler für das Ereignis, die über `process.on('SIGINT')` angehängt wurden, werden während der Skriptausführung deaktiviert, funktionieren aber danach weiter. **Standard:** `false`.


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` erfüllt.

Werten Sie das Modul aus.

Dies muss aufgerufen werden, nachdem das Modul verknüpft wurde; andernfalls wird es abgelehnt. Es könnte auch aufgerufen werden, wenn das Modul bereits ausgewertet wurde. In diesem Fall wird entweder nichts unternommen, wenn die anfängliche Auswertung erfolgreich war (`module.status` ist `'evaluated'`), oder die Ausnahme wird erneut ausgelöst, die die anfängliche Auswertung verursacht hat (`module.status` ist `'errored'`).

Diese Methode kann nicht aufgerufen werden, während das Modul ausgewertet wird (`module.status` ist `'evaluating'`).

Entspricht dem [Evaluate() concrete method](https://tc39.es/ecma262/#sec-moduleevaluation) Feld von [Cyclic Module Records](https://tc39.es/ecma262/#sec-cyclic-module-records) in der ECMAScript-Spezifikation.


### `module.identifier` {#moduleidentifier}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der Bezeichner des aktuellen Moduls, wie im Konstruktor festgelegt.

### `module.link(linker)` {#modulelinklinker}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v21.1.0, v20.10.0, v18.19.0 | Die Option `extra.assert` wurde in `extra.attributes` umbenannt. Der frühere Name wird weiterhin zur Abwärtskompatibilität bereitgestellt. |
:::

- `linker` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Spezifizierer des angeforderten Moduls:
    - `referencingModule` [\<vm.Module\>](/de/nodejs/api/vm#class-vmmodule) Das `Module`-Objekt, für das `link()` aufgerufen wird.
    - `extra` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `attributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Die Daten aus dem Attribut: Gemäß ECMA-262 wird von Hosts erwartet, dass sie einen Fehler auslösen, wenn ein nicht unterstütztes Attribut vorhanden ist.
    - `assert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Alias für `extra.attributes`.


    - Returns: [\<vm.Module\>](/de/nodejs/api/vm#class-vmmodule) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)


- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Verknüpft Modulabhängigkeiten. Diese Methode muss vor der Auswertung aufgerufen werden und kann nur einmal pro Modul aufgerufen werden.

Es wird erwartet, dass die Funktion ein `Module`-Objekt oder ein `Promise` zurückgibt, das letztendlich zu einem `Module`-Objekt aufgelöst wird. Das zurückgegebene `Module` muss die folgenden zwei Invarianten erfüllen:

- Es muss zum gleichen Kontext wie das übergeordnete `Module` gehören.
- Sein `status` darf nicht `'errored'` sein.

Wenn der `status` des zurückgegebenen `Module` `'unlinked'` ist, wird diese Methode rekursiv auf dem zurückgegebenen `Module` mit derselben bereitgestellten `linker`-Funktion aufgerufen.

`link()` gibt ein `Promise` zurück, das entweder aufgelöst wird, wenn alle Verknüpfungsinstanzen zu einem gültigen `Module` aufgelöst werden, oder abgelehnt wird, wenn die Linker-Funktion entweder eine Ausnahme auslöst oder ein ungültiges `Module` zurückgibt.

Die Linker-Funktion entspricht ungefähr der implementierungsdefinierten abstrakten Operation [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) in der ECMAScript-Spezifikation, mit einigen wesentlichen Unterschieden:

- Die Linker-Funktion darf asynchron sein, während [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) synchron ist.

Die tatsächliche [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule)-Implementierung, die während der Modulverknüpfung verwendet wird, gibt die während der Verknüpfung verknüpften Module zurück. Da zu diesem Zeitpunkt bereits alle Module vollständig verknüpft wären, ist die [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule)-Implementierung gemäß Spezifikation vollständig synchron.

Entspricht dem Feld [Link() concrete method](https://tc39.es/ecma262/#sec-moduledeclarationlinking) von [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records)s in der ECMAScript-Spezifikation.


### `module.namespace` {#modulenamespace}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Das Namespace-Objekt des Moduls. Dies ist erst verfügbar, nachdem das Verknüpfen (`module.link()`) abgeschlossen ist.

Entspricht der abstrakten Operation [GetModuleNamespace](https://tc39.es/ecma262/#sec-getmodulenamespace) in der ECMAScript-Spezifikation.

### `module.status` {#modulestatus}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der aktuelle Status des Moduls. Kann einer der folgenden Werte sein:

- `'unlinked'`: `module.link()` wurde noch nicht aufgerufen.
- `'linking'`: `module.link()` wurde aufgerufen, aber noch nicht alle von der Linker-Funktion zurückgegebenen Promises wurden aufgelöst.
- `'linked'`: Das Modul wurde erfolgreich verknüpft, und alle seine Abhängigkeiten sind verknüpft, aber `module.evaluate()` wurde noch nicht aufgerufen.
- `'evaluating'`: Das Modul wird durch ein `module.evaluate()` auf sich selbst oder ein übergeordnetes Modul ausgewertet.
- `'evaluated'`: Das Modul wurde erfolgreich ausgewertet.
- `'errored'`: Das Modul wurde ausgewertet, aber eine Ausnahme wurde ausgelöst.

Abgesehen von `'errored'` entspricht diese Statuszeichenfolge dem Feld `[[Status]]` des [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) der Spezifikation. `'errored'` entspricht `'evaluated'` in der Spezifikation, jedoch mit `[[EvaluationError]]` auf einen Wert ungleich `undefined` gesetzt.

## Klasse: `vm.SourceTextModule` {#class-vmsourcetextmodule}

**Hinzugefügt in: v9.6.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Dieses Feature ist nur mit dem aktivierten Befehlsflag `--experimental-vm-modules` verfügbar.

- Erweitert: [\<vm.Module\>](/de/nodejs/api/vm#class-vmmodule)

Die Klasse `vm.SourceTextModule` stellt den [Source Text Module Record](https://tc39.es/ecma262/#sec-source-text-module-records) bereit, wie er in der ECMAScript-Spezifikation definiert ist.

### `new vm.SourceTextModule(code[, options])` {#new-vmsourcetextmodulecode-options}

::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v17.0.0, v16.12.0 | Unterstützung für Importattribute zum Parameter `importModuleDynamically` hinzugefügt. |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) JavaScript-Modulcode zum Parsen
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Zeichenkette, die in Stacktraces verwendet wird. **Standard:** `'vm:module(i)'`, wobei `i` ein kontextspezifischer aufsteigender Index ist.
    - `cachedData` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Stellt optional einen `Buffer` oder `TypedArray` oder `DataView` mit den Code-Cache-Daten von V8 für die bereitgestellte Quelle bereit. Der `code` muss derselbe sein wie das Modul, aus dem diese `cachedData` erstellt wurde.
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das [kontextgebundene](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) Objekt, das von der Methode `vm.createContext()` zurückgegeben wird, um dieses `Module` zu kompilieren und auszuwerten. Wenn kein Kontext angegeben ist, wird das Modul im aktuellen Ausführungskontext ausgewertet.
    - `lineOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt den Zeilennummernoffset an, der in Stacktraces angezeigt wird, die von diesem `Module` erzeugt werden. **Standard:** `0`.
    - `columnOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt den Spaltennummernoffset der ersten Zeile an, der in Stacktraces angezeigt wird, die von diesem `Module` erzeugt werden. **Standard:** `0`.
    - `initializeImportMeta` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird während der Auswertung dieses `Module` aufgerufen, um das `import.meta` zu initialisieren.
    - `meta` [\<import.meta\>](/de/nodejs/api/esm#importmeta)
    - `module` [\<vm.SourceTextModule\>](/de/nodejs/api/vm#class-vmsourcetextmodule)

    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird verwendet, um anzugeben, wie die Module während der Auswertung dieses Moduls geladen werden sollen, wenn `import()` aufgerufen wird. Diese Option ist Teil der experimentellen Module-API. Wir empfehlen nicht, sie in einer Produktionsumgebung zu verwenden. Detaillierte Informationen finden Sie unter [Unterstützung von dynamischem `import()` in Kompilierungs-APIs](/de/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

Erstellt eine neue `SourceTextModule`-Instanz.

Eigenschaften, die dem Objekt `import.meta` zugewiesen werden und Objekte sind, können dem Modul den Zugriff auf Informationen außerhalb des angegebenen `context` ermöglichen. Verwenden Sie `vm.runInContext()`, um Objekte in einem bestimmten Kontext zu erstellen.

::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({ secret: 42 });

const module = new vm.SourceTextModule(
  'Object.getPrototypeOf(import.meta.prop).secret = secret;',
  {
    initializeImportMeta(meta) {
      // Note: this object is created in the top context. As such,
      // Object.getPrototypeOf(import.meta.prop) points to the
      // Object.prototype in the top context rather than that in
      // the contextified object.
      meta.prop = {};
    },
  });
// Since module has no dependencies, the linker function will never be called.
await module.link(() => {});
await module.evaluate();

// Now, Object.prototype.secret will be equal to 42.
//
// To fix this problem, replace
//     meta.prop = {};
// above with
//     meta.prop = vm.runInContext('{}', contextifiedObject);
```

```js [CJS]
const vm = require('node:vm');
const contextifiedObject = vm.createContext({ secret: 42 });
(async () => {
  const module = new vm.SourceTextModule(
    'Object.getPrototypeOf(import.meta.prop).secret = secret;',
    {
      initializeImportMeta(meta) {
        // Note: this object is created in the top context. As such,
        // Object.getPrototypeOf(import.meta.prop) points to the
        // Object.prototype in the top context rather than that in
        // the contextified object.
        meta.prop = {};
      },
    });
  // Since module has no dependencies, the linker function will never be called.
  await module.link(() => {});
  await module.evaluate();
  // Now, Object.prototype.secret will be equal to 42.
  //
  // To fix this problem, replace
  //     meta.prop = {};
  // above with
  //     meta.prop = vm.runInContext('{}', contextifiedObject);
})();
```
:::


### `sourceTextModule.createCachedData()` {#sourcetextmodulecreatecacheddata}

**Hinzugefügt in: v13.7.0, v12.17.0**

- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Erstellt einen Code-Cache, der mit der Option `cachedData` des Konstruktors `SourceTextModule` verwendet werden kann. Gibt einen `Buffer` zurück. Diese Methode kann beliebig oft aufgerufen werden, bevor das Modul ausgewertet wurde.

Der Code-Cache des `SourceTextModule` enthält keine JavaScript-beobachtbaren Zustände. Der Code-Cache kann sicher zusammen mit dem Skript-Sourcecode gespeichert und verwendet werden, um mehrmals neue `SourceTextModule`-Instanzen zu erstellen.

Funktionen in der `SourceTextModule`-Quelle können als verzögert kompiliert markiert werden und werden nicht bei der Erstellung des `SourceTextModule` kompiliert. Diese Funktionen werden kompiliert, wenn sie zum ersten Mal aufgerufen werden. Der Code-Cache serialisiert die Metadaten, die V8 derzeit über das `SourceTextModule` kennt und die zur Beschleunigung zukünftiger Kompilierungen verwendet werden können.

```js [ESM]
// Erstellen Sie ein anfängliches Modul
const module = new vm.SourceTextModule('const a = 1;');

// Erstellen Sie einen gecachten Datensatz aus diesem Modul
const cachedData = module.createCachedData();

// Erstellen Sie ein neues Modul mit den gecachten Daten. Der Code muss derselbe sein.
const module2 = new vm.SourceTextModule('const a = 1;', { cachedData });
```
## Klasse: `vm.SyntheticModule` {#class-vmsyntheticmodule}

**Hinzugefügt in: v13.0.0, v12.16.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Diese Funktion ist nur mit dem Befehlszeilenparameter `--experimental-vm-modules` aktiviert.

- Erweitert: [\<vm.Module\>](/de/nodejs/api/vm#class-vmmodule)

Die Klasse `vm.SyntheticModule` stellt den [Synthetic Module Record](https://heycam.github.io/webidl/#synthetic-module-records) bereit, wie er in der WebIDL-Spezifikation definiert ist. Der Zweck synthetischer Module ist die Bereitstellung einer generischen Schnittstelle zum Bereitstellen von Nicht-JavaScript-Quellen für ECMAScript-Modulgraphen.

```js [ESM]
const vm = require('node:vm');

const source = '{ "a": 1 }';
const module = new vm.SyntheticModule(['default'], function() {
  const obj = JSON.parse(source);
  this.setExport('default', obj);
});

// Verwenden Sie `module` in der Verknüpfung...
```

### `new vm.SyntheticModule(exportNames, evaluateCallback[, options])` {#new-vmsyntheticmoduleexportnames-evaluatecallback-options}

**Hinzugefügt in: v13.0.0, v12.16.0**

- `exportNames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Array von Namen, die aus dem Modul exportiert werden.
- `evaluateCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, wenn das Modul ausgewertet wird.
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Zeichenkette, die in Stacktraces verwendet wird. **Standard:** `'vm:module(i)'`, wobei `i` ein kontextspezifischer aufsteigender Index ist.
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das [kontextualisierte](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) Objekt, wie es von der Methode `vm.createContext()` zurückgegeben wird, um dieses `Module` zu kompilieren und auszuwerten.

Erstellt eine neue `SyntheticModule`-Instanz.

Objekte, die den Exporten dieser Instanz zugewiesen werden, können es Importeuren des Moduls ermöglichen, auf Informationen außerhalb des angegebenen `context` zuzugreifen. Verwenden Sie `vm.runInContext()`, um Objekte in einem bestimmten Kontext zu erstellen.

### `syntheticModule.setExport(name, value)` {#syntheticmodulesetexportname-value}

**Hinzugefügt in: v13.0.0, v12.16.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name des Exports, der gesetzt werden soll.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der Wert, auf den der Export gesetzt werden soll.

Diese Methode wird verwendet, nachdem das Modul verknüpft wurde, um die Werte der Exporte festzulegen. Wenn sie aufgerufen wird, bevor das Modul verknüpft ist, wird ein [`ERR_VM_MODULE_STATUS`](/de/nodejs/api/errors#err_vm_module_status)-Fehler geworfen.

::: code-group
```js [ESM]
import vm from 'node:vm';

const m = new vm.SyntheticModule(['x'], () => {
  m.setExport('x', 1);
});

await m.link(() => {});
await m.evaluate();

assert.strictEqual(m.namespace.x, 1);
```

```js [CJS]
const vm = require('node:vm');
(async () => {
  const m = new vm.SyntheticModule(['x'], () => {
    m.setExport('x', 1);
  });
  await m.link(() => {});
  await m.evaluate();
  assert.strictEqual(m.namespace.x, 1);
})();
```
:::


## `vm.compileFunction(code[, params[, options]])` {#vmcompilefunctioncode-params-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.7.0, v20.12.0 | Unterstützung für `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` hinzugefügt. |
| v19.6.0, v18.15.0 | Der Rückgabewert enthält jetzt `cachedDataRejected` mit der gleichen Semantik wie die `vm.Script`-Version, wenn die Option `cachedData` übergeben wurde. |
| v17.0.0, v16.12.0 | Unterstützung für Importattribute zum Parameter `importModuleDynamically` hinzugefügt. |
| v15.9.0 | Option `importModuleDynamically` wieder hinzugefügt. |
| v14.3.0 | Entfernung von `importModuleDynamically` aufgrund von Kompatibilitätsproblemen. |
| v14.1.0, v13.14.0 | Die Option `importModuleDynamically` wird jetzt unterstützt. |
| v10.10.0 | Hinzugefügt in: v10.10.0 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Hauptteil der zu kompilierenden Funktion.
- `params` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein Array von Strings, das alle Parameter für die Funktion enthält.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt den Dateinamen an, der in Stacktraces verwendet wird, die von diesem Skript erzeugt werden. **Standard:** `''`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt den Zeilennummer-Offset an, der in Stacktraces angezeigt wird, die von diesem Skript erzeugt werden. **Standard:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt den Spaltennummer-Offset der ersten Zeile an, der in Stacktraces angezeigt wird, die von diesem Skript erzeugt werden. **Standard:** `0`.
    - `cachedData` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Stellt einen optionalen `Buffer` oder `TypedArray` oder `DataView` mit V8's Code-Cache-Daten für die bereitgestellte Quelle bereit. Dies muss durch einen vorherigen Aufruf von [`vm.compileFunction()`](/de/nodejs/api/vm#vmcompilefunctioncode-params-options) mit demselben `code` und `params` erzeugt werden.
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob neue Cache-Daten erzeugt werden sollen. **Standard:** `false`.
    - `parsingContext` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das [contextified](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) Objekt, in dem die besagte Funktion kompiliert werden soll.
    - `contextExtensions` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Array, das eine Sammlung von Kontext-Erweiterungen (Objekte, die den aktuellen Scope umschließen) enthält, die während der Kompilierung angewendet werden sollen. **Standard:** `[]`.


- `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/de/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Wird verwendet, um anzugeben, wie die Module während der Auswertung dieser Funktion geladen werden sollen, wenn `import()` aufgerufen wird. Diese Option ist Teil der experimentellen Module-API. Wir empfehlen nicht, sie in einer Produktionsumgebung zu verwenden. Detaillierte Informationen finden Sie unter [Unterstützung von dynamischem `import()` in Kompilierungs-APIs](/de/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
- Gibt zurück: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Kompiliert den gegebenen Code in den bereitgestellten Kontext (wenn kein Kontext bereitgestellt wird, wird der aktuelle Kontext verwendet) und gibt ihn verpackt in einer Funktion mit den gegebenen `params` zurück.


## `vm.constants` {#vmconstants}

**Hinzugefügt in: v21.7.0, v20.12.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt ein Objekt zurück, das häufig verwendete Konstanten für VM-Operationen enthält.

### `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#vmconstantsuse_main_context_default_loader}

**Hinzugefügt in: v21.7.0, v20.12.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Eine Konstante, die als `importModuleDynamically`-Option für `vm.Script` und `vm.compileFunction()` verwendet werden kann, sodass Node.js den Standard-ESM-Loader aus dem Hauptkontext verwendet, um das angeforderte Modul zu laden.

Für detaillierte Informationen siehe [Unterstützung von dynamischem `import()` in Kompilierungs-APIs](/de/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

## `vm.createContext([contextObject[, options]])` {#vmcreatecontextcontextobject-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.8.0, v20.18.0 | Das `contextObject`-Argument akzeptiert jetzt `vm.constants.DONT_CONTEXTIFY`. |
| v21.7.0, v20.12.0 | Unterstützung für `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` hinzugefügt. |
| v21.2.0, v20.11.0 | Die `importModuleDynamically`-Option wird jetzt unterstützt. |
| v14.6.0 | Die `microtaskMode`-Option wird jetzt unterstützt. |
| v10.0.0 | Das erste Argument kann nicht mehr eine Funktion sein. |
| v10.0.0 | Die `codeGeneration`-Option wird jetzt unterstützt. |
| v0.3.1 | Hinzugefügt in: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/de/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Entweder [`vm.constants.DONT_CONTEXTIFY`](/de/nodejs/api/vm#vmconstantsdont_contextify) oder ein Objekt, das [kontextualisiert](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) wird. Wenn `undefined`, wird ein leeres, kontextualisiertes Objekt zur Rückwärtskompatibilität erstellt.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Für Menschen lesbarer Name des neu erstellten Kontexts. **Standard:** `'VM Context i'`, wobei `i` ein aufsteigender numerischer Index des erstellten Kontexts ist.
    - `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Ursprung](https://developer.mozilla.org/en-US/docs/Glossary/Origin) entsprechend dem neu erstellten Kontext für Anzeigezwecke. Der Ursprung sollte wie eine URL formatiert sein, aber nur das Schema, den Host und den Port (falls erforderlich) enthalten, wie der Wert der Eigenschaft [`url.origin`](/de/nodejs/api/url#urlorigin) eines [`URL`](/de/nodejs/api/url#class-url)-Objekts. Insbesondere sollte diese Zeichenfolge den abschließenden Schrägstrich weglassen, da dieser einen Pfad bezeichnet. **Standard:** `''`.
    - `codeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf false gesetzt, werfen alle Aufrufe von `eval` oder Funktionskonstruktoren (`Function`, `GeneratorFunction` usw.) einen `EvalError`. **Standard:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf false gesetzt, wirft jeder Versuch, ein WebAssembly-Modul zu kompilieren, einen `WebAssembly.CompileError`. **Standard:** `true`.


    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn auf `afterEvaluate` gesetzt, werden Mikrotasks (Tasks, die über `Promise`s und `async function`s geplant werden) unmittelbar nachdem ein Skript über [`script.runInContext()`](/de/nodejs/api/vm#scriptrunincontextcontextifiedobject-options) ausgeführt wurde, ausgeführt. Sie sind in diesem Fall in den `timeout`- und `breakOnSigint`-Bereichen enthalten.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/de/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Wird verwendet, um anzugeben, wie die Module geladen werden sollen, wenn `import()` in diesem Kontext ohne ein Referrer-Skript oder -Modul aufgerufen wird. Diese Option ist Teil der experimentellen Module-API. Wir empfehlen, sie nicht in einer Produktionsumgebung zu verwenden. Für detaillierte Informationen siehe [Unterstützung von dynamischem `import()` in Kompilierungs-APIs](/de/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).


- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) kontextualisiertes Objekt.

Wenn das angegebene `contextObject` ein Objekt ist, [bereitet](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) die Methode `vm.createContext()` dieses Objekt vor und gibt einen Verweis darauf zurück, sodass es in Aufrufen von [`vm.runInContext()`](/de/nodejs/api/vm#vmrunincontextcode-contextifiedobject-options) oder [`script.runInContext()`](/de/nodejs/api/vm#scriptrunincontextcontextifiedobject-options) verwendet werden kann. Innerhalb solcher Skripte wird das globale Objekt vom `contextObject` umschlossen, wobei alle seine vorhandenen Eigenschaften beibehalten werden, aber auch die eingebauten Objekte und Funktionen enthalten sind, die jedes Standard-[globale Objekt](https://es5.github.io/#x15.1) hat. Außerhalb von Skripten, die vom vm-Modul ausgeführt werden, bleiben globale Variablen unverändert.

```js [ESM]
const vm = require('node:vm');

global.globalVar = 3;

const context = { globalVar: 1 };
vm.createContext(context);

vm.runInContext('globalVar *= 2;', context);

console.log(context);
// Prints: { globalVar: 2 }

console.log(global.globalVar);
// Prints: 3
```
Wenn `contextObject` weggelassen wird (oder explizit als `undefined` übergeben wird), wird ein neues, leeres [kontextualisiertes](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) Objekt zurückgegeben.

Wenn das globale Objekt im neu erstellten Kontext [kontextualisiert](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) wird, weist es einige Besonderheiten im Vergleich zu gewöhnlichen globalen Objekten auf. Zum Beispiel kann es nicht eingefroren werden. Um einen Kontext ohne die Besonderheiten der Kontextualisierung zu erstellen, übergeben Sie [`vm.constants.DONT_CONTEXTIFY`](/de/nodejs/api/vm#vmconstantsdont_contextify) als das `contextObject`-Argument. Siehe die Dokumentation von [`vm.constants.DONT_CONTEXTIFY`](/de/nodejs/api/vm#vmconstantsdont_contextify) für Details.

Die Methode `vm.createContext()` ist in erster Linie nützlich, um einen einzelnen Kontext zu erstellen, der zum Ausführen mehrerer Skripte verwendet werden kann. Wenn beispielsweise ein Webbrowser emuliert wird, kann die Methode verwendet werden, um einen einzelnen Kontext zu erstellen, der das globale Objekt eines Fensters darstellt, und dann alle `\<script\>`-Tags zusammen in diesem Kontext auszuführen.

Der bereitgestellte `name` und `origin` des Kontexts werden über die Inspector-API sichtbar gemacht.


## `vm.isContext(object)` {#vmiscontextobject}

**Hinzugefügt in: v0.11.7**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn das gegebene `object` Objekt mit [`vm.createContext()`](/de/nodejs/api/vm#vmcreatecontextcontextobject-options) [kontextualisiert](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) wurde oder wenn es sich um das globale Objekt eines Kontexts handelt, der mit [`vm.constants.DONT_CONTEXTIFY`](/de/nodejs/api/vm#vmconstantsdont_contextify) erstellt wurde.

## `vm.measureMemory([options])` {#vmmeasurememoryoptions}

**Hinzugefügt in: v13.10.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Misst den Speicher, der V8 bekannt ist und von allen Kontexten verwendet wird, die der aktuellen V8-Isolierung oder dem Hauptkontext bekannt sind.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional.
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Entweder `'summary'` oder `'detailed'`. Im Zusammenfassungsmodus wird nur der für den Hauptkontext gemessene Speicher zurückgegeben. Im detaillierten Modus wird der für alle Kontexte gemessene Speicher zurückgegeben, die der aktuellen V8-Isolierung bekannt sind. **Standard:** `'summary'`
    - `execution` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Entweder `'default'` oder `'eager'`. Bei der Standardausführung wird das Promise erst dann aufgelöst, nachdem die nächste geplante Garbage Collection gestartet wurde, was eine Weile dauern kann (oder nie, wenn das Programm vor der nächsten GC beendet wird). Bei der sofortigen Ausführung wird die GC sofort gestartet, um den Speicher zu messen. **Standard:** `'default'`


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wenn der Speicher erfolgreich gemessen wurde, wird das Promise mit einem Objekt aufgelöst, das Informationen zur Speichernutzung enthält. Andernfalls wird es mit einem `ERR_CONTEXT_NOT_INITIALIZED`-Fehler abgelehnt.

Das Format des Objekts, mit dem das zurückgegebene Promise möglicherweise aufgelöst wird, ist spezifisch für die V8-Engine und kann sich von einer Version von V8 zur nächsten ändern.

Das zurückgegebene Ergebnis unterscheidet sich von den Statistiken, die von `v8.getHeapSpaceStatistics()` zurückgegeben werden, darin, dass `vm.measureMemory()` den Speicher misst, der von jedem V8-spezifischen Kontext in der aktuellen Instanz der V8-Engine erreichbar ist, während das Ergebnis von `v8.getHeapSpaceStatistics()` den Speicher misst, der von jedem Heap-Bereich in der aktuellen V8-Instanz belegt wird.

```js [ESM]
const vm = require('node:vm');
// Misst den vom Hauptkontext verwendeten Speicher.
vm.measureMemory({ mode: 'summary' })
  // Dies ist das Gleiche wie vm.measureMemory()
  .then((result) => {
    // Das aktuelle Format ist:
    // {
    //   total: {
    //      jsMemoryEstimate: 2418479, jsMemoryRange: [ 2418479, 2745799 ]
    //    }
    // }
    console.log(result);
  });

const context = vm.createContext({ a: 1 });
vm.measureMemory({ mode: 'detailed', execution: 'eager' })
  .then((result) => {
    // Referenzieren Sie den Kontext hier, damit er nicht GC'ed wird
    // bis die Messung abgeschlossen ist.
    console.log(context.a);
    // {
    //   total: {
    //     jsMemoryEstimate: 2574732,
    //     jsMemoryRange: [ 2574732, 2904372 ]
    //   },
    //   current: {
    //     jsMemoryEstimate: 2438996,
    //     jsMemoryRange: [ 2438996, 2768636 ]
    //   },
    //   other: [
    //     {
    //       jsMemoryEstimate: 135736,
    //       jsMemoryRange: [ 135736, 465376 ]
    //     }
    //   ]
    // }
    console.log(result);
  });
```

## `vm.runInContext(code, contextifiedObject[, options])` {#vmrunincontextcode-contextifiedobject-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.7.0, v20.12.0 | Unterstützung für `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` hinzugefügt. |
| v17.0.0, v16.12.0 | Unterstützung für Importattribute zum Parameter `importModuleDynamically` hinzugefügt. |
| v6.3.0 | Die Option `breakOnSigint` wird jetzt unterstützt. |
| v0.3.1 | Hinzugefügt in: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der JavaScript-Code, der kompiliert und ausgeführt werden soll.
- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das [kontextualisierte](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) Objekt, das als `global` verwendet wird, wenn der `code` kompiliert und ausgeführt wird.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt den Dateinamen an, der in Stacktraces verwendet wird, die von diesem Skript erzeugt werden. **Standard:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt den Zeilennummer-Offset an, der in Stacktraces angezeigt wird, die von diesem Skript erzeugt werden. **Standard:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt den Spaltennummer-Offset der ersten Zeile an, der in Stacktraces angezeigt wird, die von diesem Skript erzeugt werden. **Standard:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird die Codezeile, die den Fehler verursacht, an den Stacktrace angehängt, falls ein [`Error`](/de/nodejs/api/errors#class-error) während der Kompilierung des `code` auftritt. **Standard:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die Anzahl der Millisekunden an, die `code` ausgeführt werden soll, bevor die Ausführung beendet wird. Wenn die Ausführung beendet wird, wird ein [`Error`](/de/nodejs/api/errors#class-error) ausgelöst. Dieser Wert muss eine strikt positive ganze Zahl sein.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, beendet der Empfang von `SIGINT` (+) die Ausführung und löst einen [`Error`](/de/nodejs/api/errors#class-error) aus. Vorhandene Handler für das Ereignis, die über `process.on('SIGINT')` angehängt wurden, werden während der Skriptausführung deaktiviert, funktionieren aber danach weiterhin. **Standard:** `false`.
    - `cachedData` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Stellt optional einen `Buffer` oder `TypedArray` oder `DataView` mit V8's Code-Cache-Daten für die bereitgestellte Quelle bereit.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/de/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Wird verwendet, um anzugeben, wie die Module während der Auswertung dieses Skripts geladen werden sollen, wenn `import()` aufgerufen wird. Diese Option ist Teil der experimentellen Module-API. Wir empfehlen, sie nicht in einer Produktionsumgebung zu verwenden. Detaillierte Informationen finden Sie unter [Unterstützung von dynamischem `import()` in Kompilierungs-APIs](/de/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

Die Methode `vm.runInContext()` kompiliert `code`, führt es im Kontext des `contextifiedObject` aus und gibt dann das Ergebnis zurück. Der ausgeführte Code hat keinen Zugriff auf den lokalen Gültigkeitsbereich. Das `contextifiedObject`-Objekt *muss* zuvor mit der Methode [`vm.createContext()`](/de/nodejs/api/vm#vmcreatecontextcontextobject-options) [kontextualisiert](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) worden sein.

Wenn `options` ein String ist, gibt er den Dateinamen an.

Das folgende Beispiel kompiliert und führt verschiedene Skripte mit einem einzigen [kontextualisierten](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) Objekt aus:

```js [ESM]
const vm = require('node:vm');

const contextObject = { globalVar: 1 };
vm.createContext(contextObject);

for (let i = 0; i < 10; ++i) {
  vm.runInContext('globalVar *= 2;', contextObject);
}
console.log(contextObject);
// Prints: { globalVar: 1024 }
```

## `vm.runInNewContext(code[, contextObject[, options]])` {#vmruninnewcontextcode-contextobject-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.8.0, v20.18.0 | Das Argument `contextObject` akzeptiert jetzt `vm.constants.DONT_CONTEXTIFY`. |
| v21.7.0, v20.12.0 | Unterstützung für `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` hinzugefügt. |
| v17.0.0, v16.12.0 | Unterstützung für Importattribute für den Parameter `importModuleDynamically` hinzugefügt. |
| v14.6.0 | Die Option `microtaskMode` wird jetzt unterstützt. |
| v10.0.0 | Die Option `contextCodeGeneration` wird jetzt unterstützt. |
| v6.3.0 | Die Option `breakOnSigint` wird jetzt unterstützt. |
| v0.3.1 | Hinzugefügt in: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der zu kompilierende und auszuführende JavaScript-Code.
- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/de/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Entweder [`vm.constants.DONT_CONTEXTIFY`](/de/nodejs/api/vm#vmconstantsdont_contextify) oder ein Objekt, das [kontextifiziert](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) wird. Wenn `undefined`, wird ein leeres kontextifiziertes Objekt zur Abwärtskompatibilität erstellt.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt den Dateinamen an, der in Stacktraces verwendet wird, die von diesem Skript erzeugt werden. **Standard:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt den Zeilennummer-Offset an, der in Stacktraces angezeigt wird, die von diesem Skript erzeugt werden. **Standard:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt den Spaltennummer-Offset der ersten Zeile an, der in Stacktraces angezeigt wird, die von diesem Skript erzeugt werden. **Standard:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird bei einem [`Error`](/de/nodejs/api/errors#class-error) beim Kompilieren des `code` die Codezeile, die den Fehler verursacht, an den Stacktrace angehängt. **Standard:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die Anzahl der Millisekunden an, die `code` ausgeführt wird, bevor die Ausführung beendet wird. Wenn die Ausführung beendet wird, wird ein [`Error`](/de/nodejs/api/errors#class-error) ausgelöst. Dieser Wert muss eine strikt positive ganze Zahl sein.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, beendet der Empfang von `SIGINT` (+) die Ausführung und löst ein [`Error`](/de/nodejs/api/errors#class-error) aus. Vorhandene Handler für das Ereignis, die über `process.on('SIGINT')` angehängt wurden, werden während der Skriptausführung deaktiviert, funktionieren aber danach weiter. **Standard:** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Für Menschen lesbarer Name des neu erstellten Kontexts. **Standard:** `'VM Kontext i'`, wobei `i` ein aufsteigender numerischer Index des erstellten Kontexts ist.
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Ursprung](https://developer.mozilla.org/en-US/docs/Glossary/Origin), der dem neu erstellten Kontext zu Anzeigezwecken entspricht. Der Ursprung sollte wie eine URL formatiert sein, aber nur mit dem Schema, dem Host und dem Port (falls erforderlich), wie der Wert der Eigenschaft [`url.origin`](/de/nodejs/api/url#urlorigin) eines [`URL`](/de/nodejs/api/url#class-url)-Objekts. Insbesondere sollte diese Zeichenkette den nachgestellten Schrägstrich weglassen, da dies einen Pfad bezeichnet. **Standard:** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf false gesetzt, lösen alle Aufrufe von `eval` oder Funktionskonstruktoren (`Function`, `GeneratorFunction`, etc.) einen `EvalError` aus. **Standard:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf false gesetzt, löst jeder Versuch, ein WebAssembly-Modul zu kompilieren, einen `WebAssembly.CompileError` aus. **Standard:** `true`.
 
    - `cachedData` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Bietet einen optionalen `Buffer` oder `TypedArray` oder `DataView` mit den Code-Cache-Daten von V8 für die bereitgestellte Quelle.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/de/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Wird verwendet, um anzugeben, wie die Module während der Auswertung dieses Skripts geladen werden sollen, wenn `import()` aufgerufen wird. Diese Option ist Teil der experimentellen Module-API. Wir empfehlen, sie nicht in einer Produktionsumgebung zu verwenden. Detaillierte Informationen finden Sie unter [Unterstützung von dynamischem `import()` in Kompilierungs-APIs](/de/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn auf `afterEvaluate` gesetzt, werden Microtasks (Tasks, die über `Promise`s und `async function`s geplant werden) unmittelbar nach der Ausführung des Skripts ausgeführt. Sie sind in diesem Fall in den Geltungsbereichen `timeout` und `breakOnSigint` enthalten.
 
 
- Gibt zurück: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) das Ergebnis der allerletzten Anweisung, die im Skript ausgeführt wurde.

Diese Methode ist eine Abkürzung für `(new vm.Script(code, options)).runInContext(vm.createContext(options), options)`. Wenn `options` ein String ist, gibt er den Dateinamen an.

Sie macht mehrere Dinge gleichzeitig:

Das folgende Beispiel kompiliert und führt Code aus, der eine globale Variable inkrementiert und eine neue setzt. Diese globalen Variablen sind im `contextObject` enthalten.

```js [ESM]
const vm = require('node:vm');

const contextObject = {
  animal: 'cat',
  count: 2,
};

vm.runInNewContext('count += 1; name = "kitty"', contextObject);
console.log(contextObject);
// Prints: { animal: 'cat', count: 3, name: 'kitty' }

// Dies würde einen Fehler auslösen, wenn der Kontext aus einem kontextifizierten Objekt erstellt wird.
// vm.constants.DONT_CONTEXTIFY ermöglicht das Erstellen von Kontexten mit gewöhnlichen globalen Objekten, die
// eingefroren werden können.
const frozenContext = vm.runInNewContext('Object.freeze(globalThis); globalThis;', vm.constants.DONT_CONTEXTIFY);
```

## `vm.runInThisContext(code[, options])` {#vmruninthiscontextcode-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.7.0, v20.12.0 | Unterstützung für `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` hinzugefügt. |
| v17.0.0, v16.12.0 | Unterstützung für Importattribute für den Parameter `importModuleDynamically` hinzugefügt. |
| v6.3.0 | Die Option `breakOnSigint` wird jetzt unterstützt. |
| v0.3.1 | Hinzugefügt in: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der zu kompilierende und auszuführende JavaScript-Code.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt den Dateinamen an, der in Stacktraces verwendet wird, die von diesem Skript erzeugt werden. **Standard:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt den Zeilennummer-Offset an, der in Stacktraces angezeigt wird, die von diesem Skript erzeugt werden. **Standard:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt den Spaltennummer-Offset der ersten Zeile an, der in Stacktraces angezeigt wird, die von diesem Skript erzeugt werden. **Standard:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird die Codezeile, die den Fehler verursacht, an den Stacktrace angehängt, wenn beim Kompilieren des `code` ein [`Error`](/de/nodejs/api/errors#class-error) auftritt. **Standard:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die Anzahl der Millisekunden an, die `code` ausgeführt werden soll, bevor die Ausführung beendet wird. Wenn die Ausführung beendet wird, wird ein [`Error`](/de/nodejs/api/errors#class-error) ausgelöst. Dieser Wert muss eine strikt positive ganze Zahl sein.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, beendet der Empfang von `SIGINT` (+) die Ausführung und löst einen [`Error`](/de/nodejs/api/errors#class-error) aus. Vorhandene Handler für das Ereignis, die über `process.on('SIGINT')` angehängt wurden, werden während der Skriptausführung deaktiviert, funktionieren aber danach weiter. **Standard:** `false`.
    - `cachedData` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Bietet einen optionalen `Buffer` oder `TypedArray` oder `DataView` mit den Code-Cache-Daten von V8 für die bereitgestellte Quelle.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/de/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Wird verwendet, um anzugeben, wie die Module während der Auswertung dieses Skripts geladen werden sollen, wenn `import()` aufgerufen wird. Diese Option ist Teil der experimentellen Modul-API. Wir empfehlen, sie nicht in einer Produktionsumgebung zu verwenden. Detaillierte Informationen finden Sie unter [Unterstützung von dynamischem `import()` in Kompilierungs-APIs](/de/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

- Returns: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Das Ergebnis der allerletzten Anweisung, die im Skript ausgeführt wurde.

`vm.runInThisContext()` kompiliert `code`, führt es im Kontext des aktuellen `global` aus und gibt das Ergebnis zurück. Der ausgeführte Code hat keinen Zugriff auf den lokalen Scope, hat aber Zugriff auf das aktuelle `global`-Objekt.

Wenn `options` ein String ist, dann gibt er den Dateinamen an.

Das folgende Beispiel veranschaulicht die Verwendung von `vm.runInThisContext()` und der JavaScript-Funktion [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval), um denselben Code auszuführen:

```js [ESM]
const vm = require('node:vm');
let localVar = 'initial value';

const vmResult = vm.runInThisContext('localVar = "vm";');
console.log(`vmResult: '${vmResult}', localVar: '${localVar}'`);
// Prints: vmResult: 'vm', localVar: 'initial value'

const evalResult = eval('localVar = "eval";');
console.log(`evalResult: '${evalResult}', localVar: '${localVar}'`);
// Prints: evalResult: 'eval', localVar: 'eval'
```
Da `vm.runInThisContext()` keinen Zugriff auf den lokalen Scope hat, bleibt `localVar` unverändert. Im Gegensatz dazu hat [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) *tatsächlich* Zugriff auf den lokalen Scope, sodass der Wert `localVar` geändert wird. Auf diese Weise ähnelt `vm.runInThisContext()` einem [indirekten `eval()`-Aufruf](https://es5.github.io/#x10.4.2), z.B. `(0,eval)('code')`.


## Beispiel: Ausführen eines HTTP-Servers innerhalb einer VM {#example-running-an-http-server-within-a-vm}

Bei Verwendung von [`script.runInThisContext()`](/de/nodejs/api/vm#scriptruninthiscontextoptions) oder [`vm.runInThisContext()`](/de/nodejs/api/vm#vmruninthiscontextcode-options) wird der Code im aktuellen globalen V8-Kontext ausgeführt. Der an diesen VM-Kontext übergebene Code hat seinen eigenen isolierten Gültigkeitsbereich.

Um einen einfachen Webserver mit dem Modul `node:http` auszuführen, muss der an den Kontext übergebene Code entweder `require('node:http')` selbst aufrufen oder einen Verweis auf das Modul `node:http` übergeben bekommen. Zum Beispiel:

```js [ESM]
'use strict';
const vm = require('node:vm');

const code = `
((require) => {
  const http = require('node:http');

  http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\\n');
  }).listen(8124);

  console.log('Server running at http://127.0.0.1:8124/');
})`;

vm.runInThisContext(code)(require);
```
Der `require()` im obigen Fall teilt sich den Zustand mit dem Kontext, aus dem er übergeben wird. Dies kann Risiken bergen, wenn nicht vertrauenswürdiger Code ausgeführt wird, z. B. wenn Objekte im Kontext auf unerwünschte Weise verändert werden.

## Was bedeutet es, ein Objekt zu "kontextualisieren"? {#what-does-it-mean-to-"contextify"-an-object?}

Jegliches JavaScript, das innerhalb von Node.js ausgeführt wird, läuft im Gültigkeitsbereich eines "Kontexts". Laut [V8 Embedder's Guide](https://v8.dev/docs/embed#contexts):

Wenn die Methode `vm.createContext()` mit einem Objekt aufgerufen wird, wird das Argument `contextObject` verwendet, um das globale Objekt einer neuen Instanz eines V8-Kontexts einzuschließen (wenn `contextObject` `undefined` ist, wird ein neues Objekt aus dem aktuellen Kontext erstellt, bevor es kontextualisiert wird). Dieser V8-Kontext stellt den `code`, der mit den Methoden des Moduls `node:vm` ausgeführt wird, mit einer isolierten globalen Umgebung bereit, in der er arbeiten kann. Der Prozess der Erstellung des V8-Kontexts und dessen Verknüpfung mit dem `contextObject` im äußeren Kontext wird in diesem Dokument als "Kontextualisierung" des Objekts bezeichnet.

Die Kontextualisierung würde einige Eigenheiten in den `globalThis`-Wert im Kontext einführen. Zum Beispiel kann er nicht eingefroren werden und er ist nicht referenziell gleich dem `contextObject` im äußeren Kontext.

```js [ESM]
const vm = require('node:vm');

// Eine undefinierte `contextObject`-Option sorgt dafür, dass das globale Objekt kontextualisiert wird.
const context = vm.createContext();
console.log(vm.runInContext('globalThis', context) === context);  // false
// Ein kontextualisiertes globales Objekt kann nicht eingefroren werden.
try {
  vm.runInContext('Object.freeze(globalThis);', context);
} catch (e) {
  console.log(e); // TypeError: Cannot freeze
}
console.log(vm.runInContext('globalThis.foo = 1; foo;', context));  // 1
```
Um einen Kontext mit einem gewöhnlichen globalen Objekt zu erstellen und im äußeren Kontext auf einen globalen Proxy mit weniger Eigenheiten zuzugreifen, geben Sie `vm.constants.DONT_CONTEXTIFY` als Argument `contextObject` an.


### `vm.constants.DONT_CONTEXTIFY` {#vmconstantsdont_contextify}

Wenn diese Konstante als `contextObject`-Argument in VM-APIs verwendet wird, weist sie Node.js an, einen Kontext zu erstellen, ohne sein globales Objekt auf Node.js-spezifische Weise mit einem anderen Objekt zu umschließen. Infolgedessen würde sich der Wert `globalThis` innerhalb des neuen Kontexts eher wie ein gewöhnlicher verhalten.

```js [ESM]
const vm = require('node:vm');

// Verwenden Sie vm.constants.DONT_CONTEXTIFY, um das globale Objekt einzufrieren.
const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);
vm.runInContext('Object.freeze(globalThis);', context);
try {
  vm.runInContext('bar = 1; bar;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: bar is not defined
}
```
Wenn `vm.constants.DONT_CONTEXTIFY` als `contextObject`-Argument für [`vm.createContext()`](/de/nodejs/api/vm#vmcreatecontextcontextobject-options) verwendet wird, ist das zurückgegebene Objekt ein Proxy-ähnliches Objekt für das globale Objekt im neu erstellten Kontext mit weniger Node.js-spezifischen Eigenheiten. Es ist referenzgleich zum Wert `globalThis` im neuen Kontext, kann von außerhalb des Kontexts geändert werden und kann verwendet werden, um direkt auf Built-Ins im neuen Kontext zuzugreifen.

```js [ESM]
const vm = require('node:vm');

const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);

// Das zurückgegebene Objekt ist referenzgleich zu globalThis im neuen Kontext.
console.log(vm.runInContext('globalThis', context) === context);  // true

// Kann verwendet werden, um direkt auf Globale im neuen Kontext zuzugreifen.
console.log(context.Array);  // [Function: Array]
vm.runInContext('foo = 1;', context);
console.log(context.foo);  // 1
context.bar = 1;
console.log(vm.runInContext('bar;', context));  // 1

// Kann eingefroren werden und beeinflusst den inneren Kontext.
Object.freeze(context);
try {
  vm.runInContext('baz = 1; baz;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: baz is not defined
}
```
## Timeout-Interaktionen mit asynchronen Aufgaben und Promises {#timeout-interactions-with-asynchronous-tasks-and-promises}

`Promise`s und `async function`s können Aufgaben planen, die von der JavaScript-Engine asynchron ausgeführt werden. Standardmäßig werden diese Aufgaben ausgeführt, nachdem alle JavaScript-Funktionen im aktuellen Stack ausgeführt wurden. Dies ermöglicht das Umgehen der Funktionalität der Optionen `timeout` und `breakOnSigint`.

Der folgende Code, der von `vm.runInNewContext()` mit einem Timeout von 5 Millisekunden ausgeführt wird, plant beispielsweise eine Endlosschleife, die nach der Auflösung eines Promises ausgeführt wird. Die geplante Schleife wird nie durch das Timeout unterbrochen:

```js [ESM]
const vm = require('node:vm');

function loop() {
  console.log('entering loop');
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5 },
);
// Dies wird *vor* 'entering loop' ausgegeben (!)
console.log('done executing');
```
Dies kann behoben werden, indem `microtaskMode: 'afterEvaluate'` an den Code übergeben wird, der den `Context` erstellt:

```js [ESM]
const vm = require('node:vm');

function loop() {
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5, microtaskMode: 'afterEvaluate' },
);
```
In diesem Fall wird die über `promise.then()` geplante Microtask ausgeführt, bevor von `vm.runInNewContext()` zurückgekehrt wird, und wird durch die `timeout`-Funktionalität unterbrochen. Dies gilt nur für Code, der in einem `vm.Context` ausgeführt wird, sodass z. B. [`vm.runInThisContext()`](/de/nodejs/api/vm#vmruninthiscontextcode-options) diese Option nicht akzeptiert.

Promise-Callbacks werden in die Microtask-Warteschlange des Kontexts eingetragen, in dem sie erstellt wurden. Wenn beispielsweise `() =\> loop()` im obigen Beispiel durch nur `loop` ersetzt wird, wird `loop` in die globale Microtask-Warteschlange verschoben, da es sich um eine Funktion aus dem äußeren (Haupt-)Kontext handelt und somit auch das Timeout umgehen kann.

Wenn asynchrone Planungsfunktionen wie `process.nextTick()`, `queueMicrotask()`, `setTimeout()`, `setImmediate()` usw. innerhalb eines `vm.Context` verfügbar gemacht werden, werden Funktionen, die an sie übergeben werden, globalen Warteschlangen hinzugefügt, die von allen Kontexten gemeinsam genutzt werden. Daher sind Callbacks, die an diese Funktionen übergeben werden, auch nicht durch das Timeout steuerbar.


## Unterstützung von dynamischem `import()` in Kompilierungs-APIs {#support-of-dynamic-import-in-compilation-apis}

Die folgenden APIs unterstützen eine `importModuleDynamically`-Option, um dynamisches `import()` im Code zu aktivieren, der vom VM-Modul kompiliert wird.

- `new vm.Script`
- `vm.compileFunction()`
- `new vm.SourceTextModule`
- `vm.runInThisContext()`
- `vm.runInContext()`
- `vm.runInNewContext()`
- `vm.createContext()`

Diese Option ist weiterhin Teil der experimentellen Module-API. Wir empfehlen, sie nicht in einer Produktionsumgebung zu verwenden.

### Wenn die Option `importModuleDynamically` nicht angegeben oder undefiniert ist {#when-the-importmoduledynamically-option-is-not-specified-or-undefined}

Wenn diese Option nicht angegeben ist oder wenn sie `undefined` ist, kann Code, der `import()` enthält, weiterhin von den VM-APIs kompiliert werden. Wenn der kompilierte Code jedoch ausgeführt wird und tatsächlich `import()` aufruft, wird das Ergebnis mit [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`](/de/nodejs/api/errors#err_vm_dynamic_import_callback_missing) abgelehnt.

### Wenn `importModuleDynamically` `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` ist {#when-importmoduledynamically-is-vmconstantsuse_main_context_default_loader}

Diese Option wird derzeit für `vm.SourceTextModule` nicht unterstützt.

Mit dieser Option verwendet Node.js beim Initiieren eines `import()` im kompilierten Code den Standard-ESM-Loader aus dem Hauptkontext, um das angeforderte Modul zu laden und an den Code zurückzugeben, der ausgeführt wird.

Dies ermöglicht dem zu kompilierenden Code den Zugriff auf in Node.js integrierte Module wie `fs` oder `http`. Wenn der Code in einem anderen Kontext ausgeführt wird, beachten Sie, dass die von Modulen erstellten Objekte, die aus dem Hauptkontext geladen werden, weiterhin aus dem Hauptkontext stammen und nicht `instanceof` in den integrierten Klassen im neuen Kontext sind.

::: code-group
```js [CJS]
const { Script, constants } = require('node:vm');
const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: Die aus dem Hauptkontext geladene URL ist keine Instanz der Function-Klasse
// im neuen Kontext.
script.runInNewContext().then(console.log);
```

```js [ESM]
import { Script, constants } from 'node:vm';

const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: Die aus dem Hauptkontext geladene URL ist keine Instanz der Function-Klasse
// im neuen Kontext.
script.runInNewContext().then(console.log);
```
:::

Diese Option ermöglicht es dem Skript oder der Funktion auch, Benutzermodule zu laden:

::: code-group
```js [ESM]
import { Script, constants } from 'node:vm';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

// Schreibe test.js und test.txt in das Verzeichnis, in dem sich das aktuelle Skript
// befindet, das gerade ausgeführt wird.
writeFileSync(resolve(import.meta.dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(import.meta.dirname, 'test.json'),
              '{"hello": "world"}');

// Kompiliere ein Skript, das test.mjs und dann test.json lädt
// so, als ob sich das Skript im selben Verzeichnis befindet.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(import.meta.dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```

```js [CJS]
const { Script, constants } = require('node:vm');
const { resolve } = require('node:path');
const { writeFileSync } = require('node:fs');

// Schreibe test.js und test.txt in das Verzeichnis, in dem sich das aktuelle Skript
// befindet, das gerade ausgeführt wird.
writeFileSync(resolve(__dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(__dirname, 'test.json'),
              '{"hello": "world"}');

// Kompiliere ein Skript, das test.mjs und dann test.json lädt
// so, als ob sich das Skript im selben Verzeichnis befindet.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(__dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```
:::

Es gibt ein paar Einschränkungen beim Laden von Benutzermodulen mithilfe des Standardladers aus dem Hauptkontext:


### Wenn `importModuleDynamically` eine Funktion ist {#when-importmoduledynamically-is-a-function}

Wenn `importModuleDynamically` eine Funktion ist, wird sie aufgerufen, wenn `import()` im kompilierten Code aufgerufen wird, damit Benutzer anpassen können, wie das angeforderte Modul kompiliert und ausgewertet werden soll. Derzeit muss die Node.js-Instanz mit dem Flag `--experimental-vm-modules` gestartet werden, damit diese Option funktioniert. Wenn das Flag nicht gesetzt ist, wird dieser Callback ignoriert. Wenn der ausgewertete Code tatsächlich `import()` aufruft, wird das Ergebnis mit [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`](/de/nodejs/api/errors#err_vm_dynamic_import_callback_missing_flag) abgelehnt.

Der Callback `importModuleDynamically(specifier, referrer, importAttributes)` hat die folgende Signatur:

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) An `import()` übergebener Bezeichner
- `referrer` [\<vm.Script\>](/de/nodejs/api/vm#class-vmscript) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.SourceTextModule\>](/de/nodejs/api/vm#class-vmsourcetextmodule) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Der Referrer ist das kompilierte `vm.Script` für `new vm.Script`, `vm.runInThisContext`, `vm.runInContext` und `vm.runInNewContext`. Es ist die kompilierte `Function` für `vm.compileFunction`, das kompilierte `vm.SourceTextModule` für `new vm.SourceTextModule` und das Kontext `Object` für `vm.createContext()`.
- `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Der `"with"`-Wert, der an den optionalen Parameter [`optionsExpression`](https://tc39.es/proposal-import-attributes/#sec-evaluate-import-call) übergeben wurde, oder ein leeres Objekt, wenn kein Wert angegeben wurde.
- Gibt zurück: [\<Modul-Namensraum-Objekt\>](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects) | [\<vm.Module\>](/de/nodejs/api/vm#class-vmmodule) Die Rückgabe eines `vm.Module` wird empfohlen, um die Fehlernachverfolgung zu nutzen und Probleme mit Namensräumen zu vermeiden, die `then`-Funktionsexporte enthalten.



::: code-group
```js [ESM]
// Dieses Skript muss mit --experimental-vm-modules ausgeführt werden.
import { Script, SyntheticModule } from 'node:vm';

const script = new Script('import("foo.json", { with: { type: "json" } })', {
  async importModuleDynamically(specifier, referrer, importAttributes) {
    console.log(specifier);  // 'foo.json'
    console.log(referrer);   // Das kompilierte Skript
    console.log(importAttributes);  // { type: 'json' }
    const m = new SyntheticModule(['bar'], () => { });
    await m.link(() => { });
    m.setExport('bar', { hello: 'world' });
    return m;
  },
});
const result = await script.runInThisContext();
console.log(result);  //  { bar: { hello: 'world' } }
```

```js [CJS]
// Dieses Skript muss mit --experimental-vm-modules ausgeführt werden.
const { Script, SyntheticModule } = require('node:vm');

(async function main() {
  const script = new Script('import("foo.json", { with: { type: "json" } })', {
    async importModuleDynamically(specifier, referrer, importAttributes) {
      console.log(specifier);  // 'foo.json'
      console.log(referrer);   // Das kompilierte Skript
      console.log(importAttributes);  // { type: 'json' }
      const m = new SyntheticModule(['bar'], () => { });
      await m.link(() => { });
      m.setExport('bar', { hello: 'world' });
      return m;
    },
  });
  const result = await script.runInThisContext();
  console.log(result);  //  { bar: { hello: 'world' } }
})();
```
:::

