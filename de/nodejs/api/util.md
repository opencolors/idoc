---
title: Node.js Dokumentation - Dienstprogramme
description: Die Node.js-Dokumentation für das 'util'-Modul, das Hilfsfunktionen für Node.js-Anwendungen bietet, einschließlich Debugging, Objektanalyse und mehr.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Dienstprogramme | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Die Node.js-Dokumentation für das 'util'-Modul, das Hilfsfunktionen für Node.js-Anwendungen bietet, einschließlich Debugging, Objektanalyse und mehr.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Dienstprogramme | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Die Node.js-Dokumentation für das 'util'-Modul, das Hilfsfunktionen für Node.js-Anwendungen bietet, einschließlich Debugging, Objektanalyse und mehr.
---


# Util {#util}

::: tip [Stable: 2 - Stabil]
[Stable: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/util.js](https://github.com/nodejs/node/blob/v23.5.0/lib/util.js)

Das Modul `node:util` unterstützt die Anforderungen der internen Node.js-APIs. Viele der Dienstprogramme sind auch für Anwendungs- und Modulentwickler nützlich. Um darauf zuzugreifen:

```js [ESM]
const util = require('node:util');
```
## `util.callbackify(original)` {#utilcallbackifyoriginal}

**Hinzugefügt in: v8.2.0**

- `original` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine `async`-Funktion
- Gibt zurück: [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) eine Funktion im Callback-Stil

Nimmt eine `async`-Funktion (oder eine Funktion, die eine `Promise` zurückgibt) entgegen und gibt eine Funktion zurück, die dem Error-First-Callback-Stil folgt, d. h. einen `(err, value) => ...`-Callback als letztes Argument akzeptiert. Im Callback ist das erste Argument der Ablehnungsgrund (oder `null`, falls die `Promise` aufgelöst wurde), und das zweite Argument ist der aufgelöste Wert.

```js [ESM]
const util = require('node:util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```
Wird ausgeben:

```text [TEXT]
hello world
```
Der Callback wird asynchron ausgeführt und hat eine begrenzte Stack-Trace. Wenn der Callback eine Ausnahme auslöst, gibt der Prozess ein [`'uncaughtException'`](/de/nodejs/api/process#event-uncaughtexception)-Ereignis aus und wird, falls nicht behandelt, beendet.

Da `null` als erstes Argument für einen Callback eine besondere Bedeutung hat, wird der Wert in einen `Error` verpackt, wobei der ursprüngliche Wert in einem Feld namens `reason` gespeichert wird, wenn eine umschlossene Funktion eine `Promise` mit einem Falsy-Wert als Grund ablehnt.

```js [ESM]
function fn() {
  return Promise.reject(null);
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  // When the Promise was rejected with `null` it is wrapped with an Error and
  // the original value is stored in `reason`.
  err && Object.hasOwn(err, 'reason') && err.reason === null;  // true
});
```

## `util.debuglog(section[, callback])` {#utildebuglogsection-callback}

**Hinzugefügt in: v0.11.3**

- `section` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine Zeichenkette, die den Teil der Anwendung identifiziert, für den die `debuglog`-Funktion erstellt wird.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ein Callback, das beim ersten Aufruf der Logging-Funktion mit einem Funktionsargument aufgerufen wird, das eine optimiertere Logging-Funktion ist.
- Rückgabe: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Logging-Funktion

Die `util.debuglog()`-Methode wird verwendet, um eine Funktion zu erstellen, die bedingt Debug-Nachrichten nach `stderr` schreibt, basierend auf der Existenz der Umgebungsvariable `NODE_DEBUG`. Wenn der Name `section` innerhalb des Wertes dieser Umgebungsvariable erscheint, dann arbeitet die zurückgegebene Funktion ähnlich wie [`console.error()`](/de/nodejs/api/console#consoleerrordata-args). Wenn nicht, dann ist die zurückgegebene Funktion eine No-Op.

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo');

debuglog('hallo von foo [%d]', 123);
```
Wenn dieses Programm mit `NODE_DEBUG=foo` in der Umgebung ausgeführt wird, dann wird es so etwas wie Folgendes ausgeben:

```bash [BASH]
FOO 3245: hallo von foo [123]
```
wobei `3245` die Prozess-ID ist. Wenn es nicht mit dieser Umgebungsvariable ausgeführt wird, dann wird es nichts ausgeben.

Der `section` unterstützt auch Wildcards:

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo-bar');

debuglog('hi there, it\'s foo-bar [%d]', 2333);
```
Wenn es mit `NODE_DEBUG=foo*` in der Umgebung ausgeführt wird, dann wird es so etwas wie Folgendes ausgeben:

```bash [BASH]
FOO-BAR 3257: hi there, it's foo-bar [2333]
```
Mehrere, durch Kommas getrennte `section`-Namen können in der Umgebungsvariable `NODE_DEBUG` angegeben werden: `NODE_DEBUG=fs,net,tls`.

Das optionale `callback`-Argument kann verwendet werden, um die Logging-Funktion durch eine andere Funktion zu ersetzen, die keine Initialisierung oder unnötiges Wrapping hat.

```js [ESM]
const util = require('node:util');
let debuglog = util.debuglog('internals', (debug) => {
  // Ersetzen Sie durch eine Logging-Funktion, die optimiert
  // testet, ob der Abschnitt aktiviert ist
  debuglog = debug;
});
```

### `debuglog().enabled` {#debuglogenabled}

**Hinzugefügt in: v14.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Der Getter `util.debuglog().enabled` wird verwendet, um einen Test zu erstellen, der in Bedingungen basierend auf dem Vorhandensein der Umgebungsvariablen `NODE_DEBUG` verwendet werden kann. Wenn der `section`-Name innerhalb des Wertes dieser Umgebungsvariablen vorkommt, ist der zurückgegebene Wert `true`. Wenn nicht, ist der zurückgegebene Wert `false`.

```js [ESM]
const util = require('node:util');
const enabled = util.debuglog('foo').enabled;
if (enabled) {
  console.log('hallo von foo [%d]', 123);
}
```
Wenn dieses Programm mit `NODE_DEBUG=foo` in der Umgebung ausgeführt wird, wird etwa Folgendes ausgegeben:

```bash [BASH]
hallo von foo [123]
```
## `util.debug(section)` {#utildebugsection}

**Hinzugefügt in: v14.9.0**

Alias für `util.debuglog`. Die Verwendung ermöglicht eine Lesbarkeit, die kein Logging impliziert, wenn nur `util.debuglog().enabled` verwendet wird.

## `util.deprecate(fn, msg[, code])` {#utildeprecatefn-msg-code}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Veraltungswarnungen werden nur einmal für jeden Code ausgegeben. |
| v0.8.0 | Hinzugefügt in: v0.8.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Funktion, die als veraltet markiert wird.
- `msg` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine Warnmeldung, die angezeigt wird, wenn die veraltete Funktion aufgerufen wird.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein Veraltungscode. Siehe die [Liste der veralteten APIs](/de/nodejs/api/deprecations#list-of-deprecated-apis) für eine Liste der Codes.
- Gibt zurück: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die veraltete Funktion, die umschlossen wurde, um eine Warnung auszugeben.

Die Methode `util.deprecate()` umschließt `fn` (was eine Funktion oder Klasse sein kann) so, dass sie als veraltet markiert wird.

```js [ESM]
const util = require('node:util');

exports.obsoleteFunction = util.deprecate(() => {
  // Do something here.
}, 'obsoleteFunction() ist veraltet. Verwenden Sie stattdessen newShinyFunction().');
```
Bei Aufruf gibt `util.deprecate()` eine Funktion zurück, die eine `DeprecationWarning` mit dem Ereignis [`'warning'`](/de/nodejs/api/process#event-warning) ausgibt. Die Warnung wird ausgegeben und beim ersten Aufruf der zurückgegebenen Funktion auf `stderr` gedruckt. Nachdem die Warnung ausgegeben wurde, wird die umschlossene Funktion aufgerufen, ohne eine Warnung auszugeben.

Wenn derselbe optionale `code` in mehreren Aufrufen von `util.deprecate()` angegeben wird, wird die Warnung für diesen `code` nur einmal ausgegeben.

```js [ESM]
const util = require('node:util');

const fn1 = util.deprecate(someFunction, someMessage, 'DEP0001');
const fn2 = util.deprecate(someOtherFunction, someOtherMessage, 'DEP0001');
fn1(); // Gibt eine Veraltungswarnung mit dem Code DEP0001 aus
fn2(); // Gibt keine Veraltungswarnung aus, da sie denselben Code hat
```
Wenn entweder die Befehlszeilenflags `--no-deprecation` oder `--no-warnings` verwendet werden oder wenn die Eigenschaft `process.noDeprecation` *vor* der ersten Veraltungswarnung auf `true` gesetzt ist, macht die Methode `util.deprecate()` nichts.

Wenn die Befehlszeilenflags `--trace-deprecation` oder `--trace-warnings` gesetzt sind oder die Eigenschaft `process.traceDeprecation` auf `true` gesetzt ist, werden eine Warnung und ein Stack-Trace beim ersten Aufruf der veralteten Funktion auf `stderr` ausgegeben.

Wenn das Befehlszeilenflag `--throw-deprecation` gesetzt ist oder die Eigenschaft `process.throwDeprecation` auf `true` gesetzt ist, wird eine Ausnahme ausgelöst, wenn die veraltete Funktion aufgerufen wird.

Das Befehlszeilenflag `--throw-deprecation` und die Eigenschaft `process.throwDeprecation` haben Vorrang vor `--trace-deprecation` und `process.traceDeprecation`.


## `util.format(format[, ...args])` {#utilformatformat-args}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v12.11.0 | Der `%c`-Spezifizierer wird jetzt ignoriert. |
| v12.0.0 | Das `format`-Argument wird jetzt nur noch dann als solches betrachtet, wenn es tatsächlich Formatbezeichner enthält. |
| v12.0.0 | Wenn das `format`-Argument keine Formatzeichenkette ist, hängt die Formatierung der Ausgabekette nicht mehr vom Typ des ersten Arguments ab. Diese Änderung entfernt zuvor vorhandene Anführungszeichen von Zeichenketten, die ausgegeben wurden, wenn das erste Argument keine Zeichenkette war. |
| v11.4.0 | Die Spezifizierer `%d`, `%f` und `%i` unterstützen jetzt Symbole korrekt. |
| v11.4.0 | Die `depth` des `%o`-Spezifizierers hat wieder eine Standardtiefe von 4. |
| v11.0.0 | Die `depth`-Option des `%o`-Spezifizierers greift nun auf die Standardtiefe zurück. |
| v10.12.0 | Die Spezifizierer `%d` und `%i` unterstützen jetzt BigInt. |
| v8.4.0 | Die Spezifizierer `%o` und `%O` werden jetzt unterstützt. |
| v0.5.3 | Hinzugefügt in: v0.5.3 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine `printf`-ähnliche Formatzeichenkette.

Die Methode `util.format()` gibt eine formatierte Zeichenkette zurück, wobei das erste Argument als `printf`-ähnliche Formatzeichenkette verwendet wird, die null oder mehr Formatbezeichner enthalten kann. Jeder Bezeichner wird durch den konvertierten Wert aus dem entsprechenden Argument ersetzt. Folgende Bezeichner werden unterstützt:

- `%s`: `String` wird verwendet, um alle Werte außer `BigInt`, `Object` und `-0` zu konvertieren. `BigInt`-Werte werden mit einem `n` dargestellt und Objekte, die keine benutzerdefinierte `toString`-Funktion haben, werden mit `util.inspect()` mit den Optionen `{ depth: 0, colors: false, compact: 3 }` untersucht.
- `%d`: `Number` wird verwendet, um alle Werte außer `BigInt` und `Symbol` zu konvertieren.
- `%i`: `parseInt(value, 10)` wird für alle Werte außer `BigInt` und `Symbol` verwendet.
- `%f`: `parseFloat(value)` wird für alle Werte außer `Symbol` verwendet.
- `%j`: JSON. Wird durch die Zeichenkette `'[Circular]'` ersetzt, wenn das Argument zirkuläre Referenzen enthält.
- `%o`: `Object`. Eine String-Repräsentation eines Objekts mit generischer JavaScript-Objektformatierung. Ähnlich wie `util.inspect()` mit den Optionen `{ showHidden: true, showProxy: true }`. Dies zeigt das vollständige Objekt, einschließlich nicht aufzählbarer Eigenschaften und Proxys.
- `%O`: `Object`. Eine String-Repräsentation eines Objekts mit generischer JavaScript-Objektformatierung. Ähnlich wie `util.inspect()` ohne Optionen. Dies zeigt das vollständige Objekt ohne nicht aufzählbare Eigenschaften und Proxys.
- `%c`: `CSS`. Dieser Bezeichner wird ignoriert und überspringt alle übergebenen CSS-Angaben.
- `%%`: einzelnes Prozentzeichen (`'%'`). Dies verbraucht kein Argument.
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die formatierte Zeichenkette

Wenn ein Bezeichner kein entsprechendes Argument hat, wird er nicht ersetzt:

```js [ESM]
util.format('%s:%s', 'foo');
// Gibt zurück: 'foo:%s'
```
Werte, die nicht Teil der Formatzeichenkette sind, werden mit `util.inspect()` formatiert, wenn ihr Typ nicht `string` ist.

Wenn der Methode `util.format()` mehr Argumente übergeben werden als die Anzahl der Bezeichner, werden die zusätzlichen Argumente durch Leerzeichen getrennt an die zurückgegebene Zeichenkette angehängt:

```js [ESM]
util.format('%s:%s', 'foo', 'bar', 'baz');
// Gibt zurück: 'foo:bar baz'
```
Wenn das erste Argument keinen gültigen Formatbezeichner enthält, gibt `util.format()` eine Zeichenkette zurück, die die Verkettung aller durch Leerzeichen getrennten Argumente ist:

```js [ESM]
util.format(1, 2, 3);
// Gibt zurück: '1 2 3'
```
Wenn nur ein Argument an `util.format()` übergeben wird, wird es ohne Formatierung zurückgegeben:

```js [ESM]
util.format('%% %s');
// Gibt zurück: '%% %s'
```
`util.format()` ist eine synchrone Methode, die als Debugging-Werkzeug gedacht ist. Einige Eingabewerte können einen erheblichen Performance-Overhead verursachen, der die Event-Loop blockieren kann. Verwenden Sie diese Funktion mit Vorsicht und niemals in einem Hot Code Path.


## `util.formatWithOptions(inspectOptions, format[, ...args])` {#utilformatwithoptionsinspectoptions-format-args}

**Hinzugefügt in: v10.0.0**

- `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Diese Funktion ist identisch mit [`util.format()`](/de/nodejs/api/util#utilformatformat-args), außer dass sie ein `inspectOptions`-Argument entgegennimmt, das Optionen spezifiziert, die an [`util.inspect()`](/de/nodejs/api/util#utilinspectobject-options) weitergegeben werden.

```js [ESM]
util.formatWithOptions({ colors: true }, 'See object %O', { foo: 42 });
// Gibt 'See object { foo: 42 }' zurück, wobei `42` als Zahl farbig dargestellt wird,
// wenn sie in einem Terminal ausgegeben wird.
```
## `util.getCallSites(frameCountOrOptions, [options])` {#utilgetcallsitesframecountoroptions-options}

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.3.0 | Die API wurde von `util.getCallSite` in `util.getCallSites()` umbenannt. |
| v22.9.0 | Hinzugefügt in: v22.9.0 |
:::

- `frameCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Optionale Anzahl der Frames, die als Aufrufsitenobjekte erfasst werden sollen. **Standard:** `10`. Der zulässige Bereich liegt zwischen 1 und 200.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional
    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Rekonstruiert den ursprünglichen Ort im Stacktrace aus der Source-Map. Standardmäßig aktiviert mit dem Flag `--enable-source-maps`.
  
 
- Gibt zurück: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Array von Aufrufsitenobjekten
    - `functionName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt den Namen der Funktion zurück, die dieser Aufrufstelle zugeordnet ist.
    - `scriptName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt den Namen der Ressource zurück, die das Skript für die Funktion für diese Aufrufstelle enthält.
    - `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die Nummer (beginnend mit 1) der Zeile für den zugehörigen Funktionsaufruf zurück.
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt den Spaltenoffset (beginnend mit 1) in der Zeile für den zugehörigen Funktionsaufruf zurück.
  
 

Gibt ein Array von Aufrufsitenobjekten zurück, das den Stack der aufrufenden Funktion enthält.

```js [ESM]
const util = require('node:util');

function exampleFunction() {
  const callSites = util.getCallSites();

  console.log('Call Sites:');
  callSites.forEach((callSite, index) => {
    console.log(`CallSite ${index + 1}:`);
    console.log(`Function Name: ${callSite.functionName}`);
    console.log(`Script Name: ${callSite.scriptName}`);
    console.log(`Line Number: ${callSite.lineNumber}`);
    console.log(`Column Number: ${callSite.column}`);
  });
  // CallSite 1:
  // Function Name: exampleFunction
  // Script Name: /home/example.js
  // Line Number: 5
  // Column Number: 26

  // CallSite 2:
  // Function Name: anotherFunction
  // Script Name: /home/example.js
  // Line Number: 22
  // Column Number: 3

  // ...
}

// Eine Funktion, um eine weitere Stack-Schicht zu simulieren
function anotherFunction() {
  exampleFunction();
}

anotherFunction();
```
Es ist möglich, die ursprünglichen Positionen zu rekonstruieren, indem die Option `sourceMap` auf `true` gesetzt wird. Wenn die Source Map nicht verfügbar ist, ist die ursprüngliche Position dieselbe wie die aktuelle Position. Wenn das Flag `--enable-source-maps` aktiviert ist, z. B. bei Verwendung von `--experimental-transform-types`, ist `sourceMap` standardmäßig true.

```ts [TYPESCRIPT]
import util from 'node:util';

interface Foo {
  foo: string;
}

const callSites = util.getCallSites({ sourceMap: true });

// Mit sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 7
// Column Number: 26

// Ohne sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 2
// Column Number: 26
```

## `util.getSystemErrorName(err)` {#utilgetsystemerrornameerr}

**Hinzugefügt in: v9.7.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Rückgabe: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt den String-Namen für einen numerischen Fehlercode zurück, der von einer Node.js-API stammt. Die Zuordnung zwischen Fehlercodes und Fehlernamen ist plattformabhängig. Siehe [Häufige Systemfehler](/de/nodejs/api/errors#common-system-errors) für die Namen häufiger Fehler.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorName(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMap()` {#utilgetsystemerrormap}

**Hinzugefügt in: v16.0.0, v14.17.0**

- Rückgabe: [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Gibt eine Map aller Systemfehlercodes zurück, die über die Node.js-API verfügbar sind. Die Zuordnung zwischen Fehlercodes und Fehlernamen ist plattformabhängig. Siehe [Häufige Systemfehler](/de/nodejs/api/errors#common-system-errors) für die Namen häufiger Fehler.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const errorMap = util.getSystemErrorMap();
  const name = errorMap.get(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMessage(err)` {#utilgetsystemerrormessageerr}

**Hinzugefügt in: v23.1.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Rückgabe: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt die String-Nachricht für einen numerischen Fehlercode zurück, der von einer Node.js-API stammt. Die Zuordnung zwischen Fehlercodes und String-Nachrichten ist plattformabhängig.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorMessage(err.errno);
  console.error(name);  // No such file or directory
});
```
## `util.inherits(constructor, superConstructor)` {#utilinheritsconstructor-superconstructor}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v5.0.0 | Der `constructor`-Parameter kann sich jetzt auf eine ES6-Klasse beziehen. |
| v0.3.0 | Hinzugefügt in: v0.3.0 |
:::

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Verwenden Sie stattdessen die ES2015-Klassensyntax und das `extends`-Schlüsselwort.
:::

- `constructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `superConstructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Die Verwendung von `util.inherits()` wird nicht empfohlen. Bitte verwenden Sie die ES6 `class`- und `extends`-Schlüsselwörter, um die Vererbung auf Sprachebene zu erhalten. Beachten Sie auch, dass die beiden Stile [semantisch inkompatibel](https://github.com/nodejs/node/issues/4179) sind.

Vererbt die Prototyp-Methoden von einem [Konstruktor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor) in einen anderen. Der Prototyp von `constructor` wird auf ein neues Objekt gesetzt, das aus `superConstructor` erstellt wurde.

Dies fügt hauptsächlich eine Eingabevalidierung zusätzlich zu `Object.setPrototypeOf(constructor.prototype, superConstructor.prototype)` hinzu. Als zusätzliche Bequemlichkeit ist `superConstructor` über die Eigenschaft `constructor.super_` zugänglich.

```js [ESM]
const util = require('node:util');
const EventEmitter = require('node:events');

function MyStream() {
  EventEmitter.call(this);
}

util.inherits(MyStream, EventEmitter);

MyStream.prototype.write = function(data) {
  this.emit('data', data);
};

const stream = new MyStream();

console.log(stream instanceof EventEmitter); // true
console.log(MyStream.super_ === EventEmitter); // true

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('It works!'); // Received data: "It works!"
```
ES6-Beispiel mit `class` und `extends`:

```js [ESM]
const EventEmitter = require('node:events');

class MyStream extends EventEmitter {
  write(data) {
    this.emit('data', data);
  }
}

const stream = new MyStream();

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('With ES6');
```

## `util.inspect(object[, options])` {#utilinspectobject-options}

## `util.inspect(object[, showHidden[, depth[, colors]]])` {#utilinspectobject-showhidden-depth-colors}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.18.0 | Unterstützung für `maxArrayLength` beim Untersuchen von `Set` und `Map` hinzugefügt. |
| v17.3.0, v16.14.0 | Die Option `numericSeparator` wird jetzt unterstützt. |
| v13.0.0 | Zirkuläre Referenzen enthalten jetzt eine Markierung zur Referenz. |
| v14.6.0, v12.19.0 | Wenn `object` aus einem anderen `vm.Context` stammt, erhält eine benutzerdefinierte Inspektionsfunktion darauf keine kontextspezifischen Argumente mehr. |
| v13.13.0, v12.17.0 | Die Option `maxStringLength` wird jetzt unterstützt. |
| v13.5.0, v12.16.0 | Benutzerdefinierte Prototypen-Eigenschaften werden inspiziert, falls `showHidden` `true` ist. |
| v12.0.0 | Der Standardwert für die Option `compact` wurde in `3` und der Standardwert für die Option `breakLength` wurde in `80` geändert. |
| v12.0.0 | Interne Eigenschaften erscheinen nicht mehr im Kontextargument einer benutzerdefinierten Inspektionsfunktion. |
| v11.11.0 | Die Option `compact` akzeptiert Zahlen für einen neuen Ausgabemodus. |
| v11.7.0 | ArrayBuffers zeigen jetzt auch ihren binären Inhalt an. |
| v11.5.0 | Die Option `getters` wird jetzt unterstützt. |
| v11.4.0 | Der Standardwert für `depth` wurde wieder in `2` geändert. |
| v11.0.0 | Der Standardwert für `depth` wurde in `20` geändert. |
| v11.0.0 | Die Inspektionsausgabe ist jetzt auf etwa 128 MiB begrenzt. Daten über dieser Größe werden nicht vollständig inspiziert. |
| v10.12.0 | Die Option `sorted` wird jetzt unterstützt. |
| v10.6.0 | Das Inspizieren von verknüpften Listen und ähnlichen Objekten ist jetzt bis zur maximalen Aufrufstapelgröße möglich. |
| v10.0.0 | Die Einträge von `WeakMap` und `WeakSet` können jetzt ebenfalls inspiziert werden. |
| v9.9.0 | Die Option `compact` wird jetzt unterstützt. |
| v6.6.0 | Benutzerdefinierte Inspektionsfunktionen können jetzt `this` zurückgeben. |
| v6.3.0 | Die Option `breakLength` wird jetzt unterstützt. |
| v6.1.0 | Die Option `maxArrayLength` wird jetzt unterstützt; insbesondere werden lange Arrays standardmäßig abgeschnitten. |
| v6.1.0 | Die Option `showProxy` wird jetzt unterstützt. |
| v0.3.0 | Hinzugefügt in: v0.3.0 |
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Beliebiger JavaScript-Primitiv oder `Object`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, werden die nicht aufzählbaren Symbole und Eigenschaften von `object` in das formatierte Ergebnis aufgenommen. [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)- und [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)-Einträge werden ebenfalls aufgenommen, ebenso wie benutzerdefinierte Prototypen-Eigenschaften (mit Ausnahme von Methodeneigenschaften). **Standard:** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt an, wie oft beim Formatieren von `object` rekursiv vorgegangen werden soll. Dies ist nützlich, um große Objekte zu inspizieren. Um bis zur maximalen Aufrufstapelgröße zu rekursieren, übergeben Sie `Infinity` oder `null`. **Standard:** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird die Ausgabe mit ANSI-Farbcodes formatiert. Farben sind anpassbar. Siehe [Anpassen von `util.inspect`-Farben](/de/nodejs/api/util#customizing-utilinspect-colors). **Standard:** `false`.
    - `customInspect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `false`, werden `[util.inspect.custom](depth, opts, inspect)`-Funktionen nicht aufgerufen. **Standard:** `true`.
    - `showProxy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, enthält die `Proxy`-Inspektion die [`target`- und `handler`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Terminology)-Objekte. **Standard:** `false`.
    - `maxArrayLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die maximale Anzahl von `Array-`, [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)-, [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)-, [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)-, [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)- und [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)-Elementen an, die bei der Formatierung berücksichtigt werden sollen. Setzen Sie den Wert auf `null` oder `Infinity`, um alle Elemente anzuzeigen. Setzen Sie den Wert auf `0` oder negativ, um keine Elemente anzuzeigen. **Standard:** `100`.
    - `maxStringLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die maximale Anzahl von Zeichen an, die bei der Formatierung berücksichtigt werden sollen. Setzen Sie den Wert auf `null` oder `Infinity`, um alle Elemente anzuzeigen. Setzen Sie den Wert auf `0` oder negativ, um keine Zeichen anzuzeigen. **Standard:** `10000`.
    - `breakLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Länge, bei der Eingabewerte auf mehrere Zeilen aufgeteilt werden. Setzen Sie den Wert auf `Infinity`, um die Eingabe als eine einzelne Zeile zu formatieren (in Kombination mit `compact`, gesetzt auf `true` oder eine beliebige Zahl \>= `1`). **Standard:** `80`.
    - `compact` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wenn dies auf `false` gesetzt ist, wird jeder Objektschlüssel in einer neuen Zeile angezeigt. Bei Texten, die länger als `breakLength` sind, wird in neuen Zeilen umbrochen. Wenn eine Zahl festgelegt wird, werden die innersten `n` Elemente in einer einzigen Zeile zusammengefasst, solange alle Eigenschaften in `breakLength` passen. Kurze Array-Elemente werden ebenfalls zusammen gruppiert. Weitere Informationen finden Sie im folgenden Beispiel. **Standard:** `3`.
    - `sorted` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wenn auf `true` oder eine Funktion gesetzt, werden alle Eigenschaften eines Objekts sowie `Set`- und `Map`-Einträge in der resultierenden Zeichenkette sortiert. Wenn auf `true` gesetzt, wird die [Standard-Sortierung](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) verwendet. Wenn auf eine Funktion gesetzt, wird diese als [Vergleichsfunktion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters) verwendet.
    - `getters` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn auf `true` gesetzt, werden Getter inspiziert. Wenn auf `'get'` gesetzt, werden nur Getter ohne entsprechenden Setter inspiziert. Wenn auf `'set'` gesetzt, werden nur Getter mit einem entsprechenden Setter inspiziert. Dies kann je nach Getter-Funktion zu Nebeneffekten führen. **Standard:** `false`.
    - `numericSeparator` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `true` gesetzt, wird ein Unterstrich verwendet, um alle drei Ziffern in allen Bigints und Zahlen zu trennen. **Standard:** `false`.


- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Darstellung von `object`.

Die Methode `util.inspect()` gibt eine String-Darstellung von `object` zurück, die für das Debuggen gedacht ist. Die Ausgabe von `util.inspect` kann sich jederzeit ändern und sollte nicht programmatisch verwendet werden. Zusätzliche `options` können übergeben werden, die das Ergebnis verändern. `util.inspect()` verwendet den Namen des Konstruktors und/oder `@@toStringTag`, um ein identifizierbares Tag für einen inspizierten Wert zu erstellen.

```js [ESM]
class Foo {
  get [Symbol.toStringTag]() {
    return 'bar';
  }
}

class Bar {}

const baz = Object.create(null, { [Symbol.toStringTag]: { value: 'foo' } });

util.inspect(new Foo()); // 'Foo [bar] {}'
util.inspect(new Bar()); // 'Bar {}'
util.inspect(baz);       // '[foo] {}'
```
Zirkuläre Referenzen verweisen über einen Referenzindex auf ihren Anker:

```js [ESM]
const { inspect } = require('node:util');

const obj = {};
obj.a = [obj];
obj.b = {};
obj.b.inner = obj.b;
obj.b.obj = obj;

console.log(inspect(obj));
// <ref *1> {
//   a: [ [Circular *1] ],
//   b: <ref *2> { inner: [Circular *2], obj: [Circular *1] }
// }
```
Das folgende Beispiel inspiziert alle Eigenschaften des `util`-Objekts:

```js [ESM]
const util = require('node:util');

console.log(util.inspect(util, { showHidden: true, depth: null }));
```
Das folgende Beispiel verdeutlicht die Wirkung der Option `compact`:

```js [ESM]
const util = require('node:util');

const o = {
  a: [1, 2, [[
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit, sed do ' +
      'eiusmod \ntempor incididunt ut labore et dolore magna aliqua.',
    'test',
    'foo']], 4],
  b: new Map([['za', 1], ['zb', 'test']]),
};
console.log(util.inspect(o, { compact: true, depth: 5, breakLength: 80 }));

// { a:
//   [ 1,
//     2,
//     [ [ 'Lorem ipsum dolor sit amet,\nconsectetur [...]', // A long line
//           'test',
//           'foo' ] ],
//     4 ],
//   b: Map(2) { 'za' => 1, 'zb' => 'test' } }

// Das Setzen von `compact` auf false oder eine ganze Zahl erzeugt eine besser lesbare Ausgabe.
console.log(util.inspect(o, { compact: false, depth: 5, breakLength: 80 }));

// {
//   a: [
//     1,
//     2,
//     [
//       [
//         'Lorem ipsum dolor sit amet,\n' +
//           'consectetur adipiscing elit, sed do eiusmod \n' +
//           'tempor incididunt ut labore et dolore magna aliqua.',
//         'test',
//         'foo'
//       ]
//     ],
//     4
//   ],
//   b: Map(2) {
//     'za' => 1,
//     'zb' => 'test'
//   }
// }

// Das Setzen von `breakLength` auf z. B. 150 gibt den "Lorem ipsum"-Text in einer
// einzelnen Zeile aus.
```
Die Option `showHidden` ermöglicht die Inspektion von [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)- und [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)-Einträgen. Wenn es mehr Einträge als `maxArrayLength` gibt, gibt es keine Garantie, welche Einträge angezeigt werden. Das bedeutet, dass das zweimalige Abrufen derselben [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)-Einträge zu einer unterschiedlichen Ausgabe führen kann. Darüber hinaus können Einträge ohne verbleibende starke Referenzen jederzeit durch Garbage Collection entfernt werden.

```js [ESM]
const { inspect } = require('node:util');

const obj = { a: 1 };
const obj2 = { b: 2 };
const weakSet = new WeakSet([obj, obj2]);

console.log(inspect(weakSet, { showHidden: true }));
// WeakSet { { a: 1 }, { b: 2 } }
```
Die Option `sorted` stellt sicher, dass die Einfügereihenfolge der Eigenschaften eines Objekts keinen Einfluss auf das Ergebnis von `util.inspect()` hat.

```js [ESM]
const { inspect } = require('node:util');
const assert = require('node:assert');

const o1 = {
  b: [2, 3, 1],
  a: '`a` kommt vor `b`',
  c: new Set([2, 3, 1]),
};
console.log(inspect(o1, { sorted: true }));
// { a: '`a` kommt vor `b`', b: [ 2, 3, 1 ], c: Set(3) { 1, 2, 3 } }
console.log(inspect(o1, { sorted: (a, b) => b.localeCompare(a) }));
// { c: Set(3) { 3, 2, 1 }, b: [ 2, 3, 1 ], a: '`a` kommt vor `b`' }

const o2 = {
  c: new Set([2, 1, 3]),
  a: '`a` kommt vor `b`',
  b: [2, 3, 1],
};
assert.strict.equal(
  inspect(o1, { sorted: true }),
  inspect(o2, { sorted: true }),
);
```
Die Option `numericSeparator` fügt allen Zahlen alle drei Ziffern einen Unterstrich hinzu.

```js [ESM]
const { inspect } = require('node:util');

const thousand = 1_000;
const million = 1_000_000;
const bigNumber = 123_456_789n;
const bigDecimal = 1_234.123_45;

console.log(inspect(thousand, { numericSeparator: true }));
// 1_000
console.log(inspect(million, { numericSeparator: true }));
// 1_000_000
console.log(inspect(bigNumber, { numericSeparator: true }));
// 123_456_789n
console.log(inspect(bigDecimal, { numericSeparator: true }));
// 1_234.123_45
```
`util.inspect()` ist eine synchrone Methode, die zum Debuggen gedacht ist. Ihre maximale Ausgabelänge beträgt ungefähr 128 MiB. Eingaben, die zu einer längeren Ausgabe führen, werden abgeschnitten.


### Anpassen der `util.inspect`-Farben {#customizing-utilinspect-colors}

Die Farbausgabe (falls aktiviert) von `util.inspect` kann global über die Eigenschaften `util.inspect.styles` und `util.inspect.colors` angepasst werden.

`util.inspect.styles` ist eine Map, die einen Stilnamen einer Farbe aus `util.inspect.colors` zuordnet.

Die Standardstile und zugehörigen Farben sind:

- `bigint`: `yellow`
- `boolean`: `yellow`
- `date`: `magenta`
- `module`: `underline`
- `name`: (kein Styling)
- `null`: `bold`
- `number`: `yellow`
- `regexp`: `red`
- `special`: `cyan` (z. B. `Proxies`)
- `string`: `green`
- `symbol`: `green`
- `undefined`: `grey`

Die Farbgestaltung verwendet ANSI-Steuercodes, die möglicherweise nicht von allen Terminals unterstützt werden. Um die Farbunterstützung zu überprüfen, verwenden Sie [`tty.hasColors()`](/de/nodejs/api/tty#writestreamhascolorscount-env).

Vordefinierte Steuercodes sind unten aufgeführt (gruppiert als "Modifikatoren", "Vordergrundfarben" und "Hintergrundfarben").

#### Modifikatoren {#modifiers}

Die Unterstützung von Modifikatoren variiert zwischen verschiedenen Terminals. Sie werden meistens ignoriert, wenn sie nicht unterstützt werden.

- `reset` - Setzt alle (Farb-)Modifikatoren auf ihre Standardwerte zurück
- **bold** - Macht den Text fett
- *italic* - Macht den Text kursiv
- underline - Macht den Text unterstrichen
- ~~strikethrough~~ - Zieht eine horizontale Linie durch die Mitte des Textes (Alias: `strikeThrough`, `crossedout`, `crossedOut`)
- `hidden` - Druckt den Text, macht ihn aber unsichtbar (Alias: conceal)
- dim - Verringerte Farbintensität (Alias: `faint`)
- overlined - Macht den Text überstrichen
- blink - Blendet den Text in einem Intervall ein und aus
- inverse - Vertauscht Vorder- und Hintergrundfarben (Alias: `swapcolors`, `swapColors`)
- doubleunderline - Macht den Text doppelt unterstrichen (Alias: `doubleUnderline`)
- framed - Zeichnet einen Rahmen um den Text

#### Vordergrundfarben {#foreground-colors}

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
- `gray` (alias: `grey`, `blackBright`)
- `redBright`
- `greenBright`
- `yellowBright`
- `blueBright`
- `magentaBright`
- `cyanBright`
- `whiteBright`

#### Hintergrundfarben {#background-colors}

- `bgBlack`
- `bgRed`
- `bgGreen`
- `bgYellow`
- `bgBlue`
- `bgMagenta`
- `bgCyan`
- `bgWhite`
- `bgGray` (alias: `bgGrey`, `bgBlackBright`)
- `bgRedBright`
- `bgGreenBright`
- `bgYellowBright`
- `bgBlueBright`
- `bgMagentaBright`
- `bgCyanBright`
- `bgWhiteBright`


### Benutzerdefinierte Inspektionsfunktionen für Objekte {#custom-inspection-functions-on-objects}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v17.3.0, v16.14.0 | Das Argument inspect wurde für mehr Interoperabilität hinzugefügt. |
| v0.1.97 | Hinzugefügt in: v0.1.97 |
:::

Objekte können auch ihre eigene [`[util.inspect.custom](depth, opts, inspect)`](/de/nodejs/api/util#utilinspectcustom)-Funktion definieren, die `util.inspect()` aufruft und deren Ergebnis bei der Inspektion des Objekts verwendet.

```js [ESM]
const util = require('node:util');

class Box {
  constructor(value) {
    this.value = value;
  }

  [util.inspect.custom](depth, options, inspect) {
    if (depth < 0) {
      return options.stylize('[Box]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1,
    });

    // Fünf Leerzeichen Padding, da dies die Größe von "Box< " ist.
    const padding = ' '.repeat(5);
    const inner = inspect(this.value, newOptions)
                  .replace(/\n/g, `\n${padding}`);
    return `${options.stylize('Box', 'special')}< ${inner} >`;
  }
}

const box = new Box(true);

util.inspect(box);
// Gibt zurück: "Box< true >"
```
Benutzerdefinierte `[util.inspect.custom](depth, opts, inspect)`-Funktionen geben typischerweise einen String zurück, können aber einen Wert beliebigen Typs zurückgeben, der von `util.inspect()` entsprechend formatiert wird.

```js [ESM]
const util = require('node:util');

const obj = { foo: 'this will not show up in the inspect() output' };
obj[util.inspect.custom] = (depth) => {
  return { bar: 'baz' };
};

util.inspect(obj);
// Gibt zurück: "{ bar: 'baz' }"
```
### `util.inspect.custom` {#utilinspectcustom}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.12.0 | Dies ist jetzt als gemeinsames Symbol definiert. |
| v6.6.0 | Hinzugefügt in: v6.6.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) das verwendet werden kann, um benutzerdefinierte Inspektionsfunktionen zu deklarieren.

Zusätzlich zum Zugriff über `util.inspect.custom` ist dieses Symbol [global registriert](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) und kann in jeder Umgebung als `Symbol.for('nodejs.util.inspect.custom')` aufgerufen werden.

Die Verwendung dessen ermöglicht es, Code portabel zu schreiben, sodass die benutzerdefinierte Inspektionsfunktion in einer Node.js-Umgebung verwendet und im Browser ignoriert wird. Die `util.inspect()`-Funktion selbst wird als drittes Argument an die benutzerdefinierte Inspektionsfunktion übergeben, um eine weitere Portabilität zu ermöglichen.

```js [ESM]
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

class Password {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return 'xxxxxxxx';
  }

  [customInspectSymbol](depth, inspectOptions, inspect) {
    return `Password <${this.toString()}>`;
  }
}

const password = new Password('r0sebud');
console.log(password);
// Gibt Password <xxxxxxxx> aus
```
Weitere Details finden Sie unter [Benutzerdefinierte Inspektionsfunktionen für Objekte](/de/nodejs/api/util#custom-inspection-functions-on-objects).


### `util.inspect.defaultOptions` {#utilinspectdefaultoptions}

**Hinzugefügt in: v6.4.0**

Der Wert `defaultOptions` ermöglicht die Anpassung der Standardoptionen, die von `util.inspect` verwendet werden. Dies ist nützlich für Funktionen wie `console.log` oder `util.format`, die implizit `util.inspect` aufrufen. Er sollte auf ein Objekt gesetzt werden, das eine oder mehrere gültige [`util.inspect()`](/de/nodejs/api/util#utilinspectobject-options)-Optionen enthält. Das direkte Setzen von Options-Eigenschaften wird ebenfalls unterstützt.

```js [ESM]
const util = require('node:util');
const arr = Array(101).fill(0);

console.log(arr); // Protokolliert das abgeschnittene Array
util.inspect.defaultOptions.maxArrayLength = null;
console.log(arr); // Protokolliert das vollständige Array
```
## `util.isDeepStrictEqual(val1, val2)` {#utilisdeepstrictequalval1-val2}

**Hinzugefügt in: v9.0.0**

- `val1` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `val2` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn eine tiefe, strikte Gleichheit zwischen `val1` und `val2` besteht. Andernfalls wird `false` zurückgegeben.

Weitere Informationen zur tiefen, strikten Gleichheit finden Sie unter [`assert.deepStrictEqual()`](/de/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

## Klasse: `util.MIMEType` {#class-utilmimetype}

**Hinzugefügt in: v19.1.0, v18.13.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Eine Implementierung der [MIMEType-Klasse](https://bmeck.github.io/node-proposal-mime-api/).

Gemäß den Browserkonventionen werden alle Eigenschaften von `MIMEType`-Objekten als Getter und Setter im Klassenprototyp implementiert, anstatt als Dateneigenschaften im Objekt selbst.

Eine MIME-Zeichenkette ist eine strukturierte Zeichenkette, die mehrere aussagekräftige Komponenten enthält. Beim Parsen wird ein `MIMEType`-Objekt zurückgegeben, das Eigenschaften für jede dieser Komponenten enthält.

### Konstruktor: `new MIMEType(input)` {#constructor-new-mimetypeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die zu parsende Eingabe-MIME

Erstellt ein neues `MIMEType`-Objekt durch Parsen von `input`.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/plain');
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/plain');
```
:::

Ein `TypeError` wird ausgelöst, wenn `input` keine gültige MIME ist. Es wird versucht, die angegebenen Werte in Zeichenketten zu konvertieren. Zum Beispiel:



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```

```js [CJS]
const { MIMEType } = require('node:util');
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```
:::


### `mime.type` {#mimetype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ruft den Typanteil des MIME ab und legt ihn fest.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```
:::

### `mime.subtype` {#mimesubtype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ruft den Subtypanteil des MIME ab und legt ihn fest.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```
:::

### `mime.essence` {#mimeessence}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ruft die Essenz des MIME ab. Diese Eigenschaft ist schreibgeschützt. Verwenden Sie `mime.type` oder `mime.subtype`, um das MIME zu ändern.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```
:::


### `mime.params` {#mimeparams}

- [\<MIMEParams\>](/de/nodejs/api/util#class-utilmimeparams)

Ruft das [`MIMEParams`](/de/nodejs/api/util#class-utilmimeparams)-Objekt ab, das die Parameter des MIME repräsentiert. Diese Eigenschaft ist schreibgeschützt. Weitere Informationen finden Sie in der [`MIMEParams`](/de/nodejs/api/util#class-utilmimeparams)-Dokumentation.

### `mime.toString()` {#mimetostring}

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die `toString()`-Methode des `MIMEType`-Objekts gibt den serialisierten MIME zurück.

Aufgrund der Notwendigkeit der Standardkonformität erlaubt diese Methode Benutzern nicht, den Serialisierungsprozess des MIME anzupassen.

### `mime.toJSON()` {#mimetojson}

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Alias für [`mime.toString()`](/de/nodejs/api/util#mimetostring).

Diese Methode wird automatisch aufgerufen, wenn ein `MIMEType`-Objekt mit [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) serialisiert wird.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```
:::

## Klasse: `util.MIMEParams` {#class-utilmimeparams}

**Hinzugefügt in: v19.1.0, v18.13.0**

Die `MIMEParams`-API bietet Lese- und Schreibzugriff auf die Parameter eines `MIMEType`.

### Konstruktor: `new MIMEParams()` {#constructor-new-mimeparams}

Erstellt ein neues `MIMEParams`-Objekt mit leeren Parametern.

::: code-group
```js [ESM]
import { MIMEParams } from 'node:util';

const myParams = new MIMEParams();
```

```js [CJS]
const { MIMEParams } = require('node:util');

const myParams = new MIMEParams();
```
:::

### `mimeParams.delete(name)` {#mimeparamsdeletename}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Entfernt alle Name-Wert-Paare, deren Name `name` ist.


### `mimeParams.entries()` {#mimeparamsentries}

- Gibt zurück: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Gibt einen Iterator über jedes Name-Wert-Paar in den Parametern zurück. Jedes Element des Iterators ist ein JavaScript `Array`. Das erste Element des Arrays ist der `name`, das zweite Element des Arrays ist der `value`.

### `mimeParams.get(name)` {#mimeparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Ein String oder `null`, falls kein Name-Wert-Paar mit dem angegebenen `name` existiert.

Gibt den Wert des ersten Name-Wert-Paares zurück, dessen Name `name` ist. Wenn es keine solchen Paare gibt, wird `null` zurückgegeben.

### `mimeParams.has(name)` {#mimeparamshasname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn es mindestens ein Name-Wert-Paar gibt, dessen Name `name` ist.

### `mimeParams.keys()` {#mimeparamskeys}

- Gibt zurück: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Gibt einen Iterator über die Namen jedes Name-Wert-Paares zurück.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```
:::

### `mimeParams.set(name, value)` {#mimeparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Setzt den Wert im `MIMEParams`-Objekt, der mit `name` assoziiert ist, auf `value`. Wenn es bereits Name-Wert-Paare gibt, deren Namen `name` sind, setze den Wert des ersten solchen Paares auf `value`.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```
:::


### `mimeParams.values()` {#mimeparamsvalues}

- Gibt zurück: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Gibt einen Iterator über die Werte jedes Name-Wert-Paares zurück.

### `mimeParams[@@iterator]()` {#mimeparams@@iterator}

- Gibt zurück: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Alias für [`mimeParams.entries()`](/de/nodejs/api/util#mimeparamsentries).



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Gibt aus:
//   foo bar
//   xyz baz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Gibt aus:
//   foo bar
//   xyz baz
```
:::

## `util.parseArgs([config])` {#utilparseargsconfig}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.4.0, v20.16.0 | Unterstützung für das Zulassen negativer Optionen in der Eingabe `config` hinzugefügt. |
| v20.0.0 | Die API ist nicht mehr experimentell. |
| v18.11.0, v16.19.0 | Unterstützung für Standardwerte in der Eingabe `config` hinzugefügt. |
| v18.7.0, v16.17.0 | Unterstützung für die Rückgabe detaillierter Parse-Informationen mithilfe von `tokens` in der Eingabe `config` und zurückgegebenen Eigenschaften hinzugefügt. |
| v18.3.0, v16.17.0 | Hinzugefügt in: v18.3.0, v16.17.0 |
:::

-  `config` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Wird verwendet, um Argumente für das Parsen bereitzustellen und den Parser zu konfigurieren. `config` unterstützt die folgenden Eigenschaften:
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Array von Argument-Strings. **Standard:** `process.argv` mit entferntem `execPath` und `filename`.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Wird verwendet, um dem Parser bekannte Argumente zu beschreiben. Schlüssel von `options` sind die langen Namen von Optionen, und Werte sind ein [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), das die folgenden Eigenschaften akzeptiert:
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Typ des Arguments, der entweder `boolean` oder `string` sein muss.
    - `multiple` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob diese Option mehrmals angegeben werden kann. Wenn `true`, werden alle Werte in einem Array gesammelt. Wenn `false`, haben die Werte für die Option Last-Wins-Verhalten. **Standard:** `false`.
    - `short` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein einzelner Zeichen-Alias für die Option.
    - `default` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Der Standardoptionswert, wenn er nicht durch args festgelegt wird. Er muss vom gleichen Typ wie die Eigenschaft `type` sein. Wenn `multiple` `true` ist, muss es sich um ein Array handeln.
  
 
    - `strict` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Soll ein Fehler ausgelöst werden, wenn unbekannte Argumente gefunden werden oder wenn Argumente übergeben werden, die nicht mit dem in `options` konfigurierten `type` übereinstimmen? **Standard:** `true`.
    - `allowPositionals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob dieser Befehl positionelle Argumente akzeptiert. **Standard:** `false`, wenn `strict` `true` ist, andernfalls `true`.
    - `allowNegative` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, erlaubt das explizite Setzen von booleschen Optionen auf `false`, indem dem Optionsnamen `--no-` vorangestellt wird. **Standard:** `false`.
    - `tokens` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt die geparsten Tokens zurück. Dies ist nützlich, um das integrierte Verhalten zu erweitern, von der Hinzufügung zusätzlicher Prüfungen bis zur unterschiedlichen Verarbeitung der Tokens. **Standard:** `false`.
  
 
-  Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Die geparsten Befehlszeilenargumente:
    - `values` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Eine Zuordnung von geparsten Optionsnamen mit ihren [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)- oder [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)-Werten.
    - `positionals` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Positionelle Argumente.
    - `tokens` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Siehe Abschnitt [parseArgs tokens](/de/nodejs/api/util#parseargs-tokens). Wird nur zurückgegeben, wenn `config` `tokens: true` enthält.
  
 

Bietet eine API auf höherer Ebene für das Parsen von Befehlszeilenargumenten als die direkte Interaktion mit `process.argv`. Nimmt eine Spezifikation für die erwarteten Argumente entgegen und gibt ein strukturiertes Objekt mit den geparsten Optionen und Positionsangaben zurück.



::: code-group
```js [ESM]
import { parseArgs } from 'node:util';
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Gibt aus: [Object: null prototype] { foo: true, bar: 'b' } []
```

```js [CJS]
const { parseArgs } = require('node:util');
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Gibt aus: [Object: null prototype] { foo: true, bar: 'b' } []
```
:::

### `parseArgs` `tokens` {#parseargs-tokens}

Detaillierte Parsing-Informationen sind verfügbar, um benutzerdefinierte Verhaltensweisen hinzuzufügen, indem `tokens: true` in der Konfiguration angegeben wird. Die zurückgegebenen Tokens haben Eigenschaften, die Folgendes beschreiben:

- alle Tokens
    - `kind` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eines von 'option', 'positional' oder 'option-terminator'.
    - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Index des Elements in `args`, das das Token enthält. Das Quellargument für ein Token ist also `args[token.index]`.
  
 
- Option-Tokens
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Langer Name der Option.
    - `rawName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wie die Option in args verwendet wird, wie `-f` oder `--foo`.
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Optionswert, der in args angegeben ist. Undefiniert für boolesche Optionen.
    - `inlineValue` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Ob der Optionswert inline angegeben wurde, wie `--foo=bar`.
  
 
- Positionale Tokens
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Wert des positionalen Arguments in args (d.h. `args[index]`).
  
 
- option-terminator Token

Die zurückgegebenen Tokens sind in der Reihenfolge, in der sie in den Eingabe-Args gefunden werden. Optionen, die mehr als einmal in args vorkommen, erzeugen ein Token für jede Verwendung. Kurze Optionsgruppen wie `-xy` werden zu einem Token für jede Option erweitert. Also erzeugt `-xxx` drei Tokens.

Um beispielsweise die Unterstützung für eine negierte Option wie `--no-color` hinzuzufügen (die `allowNegative` unterstützt, wenn die Option vom Typ `boolean` ist), können die zurückgegebenen Tokens erneut verarbeitet werden, um den für die negierte Option gespeicherten Wert zu ändern.



::: code-group
```js [ESM]
import { parseArgs } from 'node:util';

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Die Option-Tokens neu verarbeiten und die zurückgegebenen Werte überschreiben.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Speichere foo:false für --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Wert erneut speichern, damit der letzte gewinnt, wenn sowohl --foo als auch --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```

```js [CJS]
const { parseArgs } = require('node:util');

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Die Option-Tokens neu verarbeiten und die zurückgegebenen Werte überschreiben.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Speichere foo:false für --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Wert erneut speichern, damit der letzte gewinnt, wenn sowohl --foo als auch --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```
:::

Beispielverwendung, die negierte Optionen zeigt und wenn eine Option auf verschiedene Arten verwendet wird, dann gewinnt die letzte.

```bash [BASH]
$ node negate.js
{ logfile: 'default.log', color: undefined }
$ node negate.js --no-logfile --no-color
{ logfile: false, color: false }
$ node negate.js --logfile=test.log --color
{ logfile: 'test.log', color: true }
$ node negate.js --no-logfile --logfile=test.log --color --no-color
{ logfile: 'test.log', color: false }
```

## `util.parseEnv(content)` {#utilparseenvcontent}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

**Hinzugefügt in: v21.7.0, v20.12.0**

- `content` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der rohe Inhalt einer `.env`-Datei.

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gegeben sei eine beispielhafte `.env`-Datei:

::: code-group
```js [CJS]
const { parseEnv } = require('node:util');

parseEnv('HELLO=world\nHELLO=oh my\n');
// Gibt zurück: { HELLO: 'oh my' }
```

```js [ESM]
import { parseEnv } from 'node:util';

parseEnv('HELLO=world\nHELLO=oh my\n');
// Gibt zurück: { HELLO: 'oh my' }
```
:::

## `util.promisify(original)` {#utilpromisifyoriginal}

::: info [History]
| Version | Änderungen |
| --- | --- |
| v20.8.0 | Das Aufrufen von `promisify` für eine Funktion, die ein `Promise` zurückgibt, ist veraltet. |
| v8.0.0 | Hinzugefügt in: v8.0.0 |
:::

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Nimmt eine Funktion, die dem üblichen Error-First-Callback-Stil folgt, d.h. einen `(err, value) =\> ...`-Callback als letztes Argument entgegennimmt, und gibt eine Version zurück, die Promises zurückgibt.

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // Tue etwas mit `stats`
}).catch((error) => {
  // Behandle den Fehler.
});
```
Oder, äquivalent dazu, mit `async function`s:

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);

async function callStat() {
  const stats = await stat('.');
  console.log(`This directory is owned by ${stats.uid}`);
}

callStat();
```
Wenn eine `original[util.promisify.custom]`-Eigenschaft vorhanden ist, gibt `promisify` ihren Wert zurück, siehe [Benutzerdefinierte Promisified-Funktionen](/de/nodejs/api/util#custom-promisified-functions).

`promisify()` geht davon aus, dass `original` in allen Fällen eine Funktion ist, die einen Callback als letztes Argument entgegennimmt. Wenn `original` keine Funktion ist, wirft `promisify()` einen Fehler. Wenn `original` eine Funktion ist, aber ihr letztes Argument kein Error-First-Callback ist, wird ihr trotzdem ein Error-First-Callback als letztes Argument übergeben.

Die Verwendung von `promisify()` für Klassenmethoden oder andere Methoden, die `this` verwenden, funktioniert möglicherweise nicht wie erwartet, es sei denn, sie werden speziell behandelt:

```js [ESM]
const util = require('node:util');

class Foo {
  constructor() {
    this.a = 42;
  }

  bar(callback) {
    callback(null, this.a);
  }
}

const foo = new Foo();

const naiveBar = util.promisify(foo.bar);
// TypeError: Cannot read property 'a' of undefined
// naiveBar().then(a => console.log(a));

naiveBar.call(foo).then((a) => console.log(a)); // '42'

const bindBar = naiveBar.bind(foo);
bindBar().then((a) => console.log(a)); // '42'
```

### Benutzerdefinierte Promisifizierungsfunktionen {#custom-promisified-functions}

Mithilfe des Symbols `util.promisify.custom` kann der Rückgabewert von [`util.promisify()`](/de/nodejs/api/util#utilpromisifyoriginal) überschrieben werden:

```js [ESM]
const util = require('node:util');

function doSomething(foo, callback) {
  // ...
}

doSomething[util.promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

const promisified = util.promisify(doSomething);
console.log(promisified === doSomething[util.promisify.custom]);
// prints 'true'
```
Dies kann in Fällen nützlich sein, in denen die ursprüngliche Funktion nicht dem Standardformat entspricht, einen Error-First-Callback als letztes Argument zu verwenden.

Zum Beispiel mit einer Funktion, die `(foo, onSuccessCallback, onErrorCallback)` entgegennimmt:

```js [ESM]
doSomething[util.promisify.custom] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```
Wenn `promisify.custom` definiert, aber keine Funktion ist, wirft `promisify()` einen Fehler.

### `util.promisify.custom` {#utilpromisifycustom}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.12.0, v12.16.2 | Dies ist jetzt als freigegebenes Symbol definiert. |
| v8.0.0 | Hinzugefügt in: v8.0.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type), das verwendet werden kann, um benutzerdefinierte promisifizierte Varianten von Funktionen zu deklarieren, siehe [Benutzerdefinierte Promisifizierungsfunktionen](/de/nodejs/api/util#custom-promisified-functions).

Zusätzlich zum Zugriff über `util.promisify.custom` ist dieses Symbol [global registriert](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) und kann in jeder Umgebung als `Symbol.for('nodejs.util.promisify.custom')` aufgerufen werden.

Zum Beispiel mit einer Funktion, die `(foo, onSuccessCallback, onErrorCallback)` entgegennimmt:

```js [ESM]
const kCustomPromisifiedSymbol = Symbol.for('nodejs.util.promisify.custom');

doSomething[kCustomPromisifiedSymbol] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```

## `util.stripVTControlCharacters(str)` {#utilstripvtcontrolcharactersstr}

**Hinzugefügt in: v16.11.0**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Rückgabe: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt `str` zurück, wobei alle ANSI-Escape-Sequenzen entfernt wurden.

```js [ESM]
console.log(util.stripVTControlCharacters('\u001B[4mvalue\u001B[0m'));
// Gibt "value" aus
```
## `util.styleText(format, text[, options])` {#utilstyletextformat-text-options}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil.
:::


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.5.0 | styleText ist jetzt stabil. |
| v22.8.0, v20.18.0 | Beachtet isTTY und Umgebungsvariablen wie NO_COLORS, NODE_DISABLE_COLORS und FORCE_COLOR. |
| v21.7.0, v20.12.0 | Hinzugefügt in: v21.7.0, v20.12.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Textformat oder ein Array von Textformaten, die in `util.inspect.colors` definiert sind.
- `text` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der zu formatierende Text.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `validateStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn true, wird `stream` überprüft, um festzustellen, ob er Farben verarbeiten kann. **Standard:** `true`.
    - `stream` [\<Stream\>](/de/nodejs/api/stream#stream) Ein Stream, der validiert wird, wenn er gefärbt werden kann. **Standard:** `process.stdout`.
  
 

Diese Funktion gibt einen formatierten Text zurück, der das übergebene `format` für die Ausgabe in einem Terminal berücksichtigt. Sie kennt die Fähigkeiten des Terminals und verhält sich gemäß der Konfiguration, die über die Umgebungsvariablen `NO_COLORS`, `NODE_DISABLE_COLORS` und `FORCE_COLOR` festgelegt wurde.



::: code-group
```js [ESM]
import { styleText } from 'node:util';
import { stderr } from 'node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Validiert, ob process.stderr TTY hat
  { stream: stderr },
);
console.error(successMessage);
```

```js [CJS]
const { styleText } = require('node:util');
const { stderr } = require('node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Validiert, ob process.stderr TTY hat
  { stream: stderr },
);
console.error(successMessage);
```
:::

`util.inspect.colors` bietet auch Textformate wie `italic` und `underline` und Sie können beide kombinieren:

```js [CJS]
console.log(
  util.styleText(['underline', 'italic'], 'My italic underlined message'),
);
```
Wenn ein Array von Formaten übergeben wird, ist die Reihenfolge der angewendeten Formate von links nach rechts, sodass der folgende Stil den vorherigen überschreiben kann.

```js [CJS]
console.log(
  util.styleText(['red', 'green'], 'text'), // green
);
```
Die vollständige Liste der Formate finden Sie unter [Modifikatoren](/de/nodejs/api/util#modifiers).


## Klasse: `util.TextDecoder` {#class-utiltextdecoder}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v11.0.0 | Die Klasse ist jetzt im globalen Objekt verfügbar. |
| v8.3.0 | Hinzugefügt in: v8.3.0 |
:::

Eine Implementierung der [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) `TextDecoder` API.

```js [ESM]
const decoder = new TextDecoder();
const u8arr = new Uint8Array([72, 101, 108, 108, 111]);
console.log(decoder.decode(u8arr)); // Hello
```
### WHATWG unterstützte Kodierungen {#whatwg-supported-encodings}

Gemäß dem [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) sind die von der `TextDecoder` API unterstützten Kodierungen in den folgenden Tabellen aufgeführt. Für jede Kodierung können ein oder mehrere Aliase verwendet werden.

Verschiedene Node.js Build-Konfigurationen unterstützen unterschiedliche Sätze von Kodierungen. (siehe [Internationalisierung](/de/nodejs/api/intl))

#### Standardmäßig unterstützte Kodierungen (mit vollständigen ICU-Daten) {#encodings-supported-by-default-with-full-icu-data}

| Kodierung | Aliase |
| --- | --- |
| `'ibm866'` | `'866'`  ,   `'cp866'`  ,   `'csibm866'` |
| `'iso-8859-2'` | `'csisolatin2'`  ,   `'iso-ir-101'`  ,   `'iso8859-2'`  ,   `'iso88592'`  ,   `'iso_8859-2'`  ,   `'iso_8859-2:1987'`  ,   `'l2'`  ,   `'latin2'` |
| `'iso-8859-3'` | `'csisolatin3'`  ,   `'iso-ir-109'`  ,   `'iso8859-3'`  ,   `'iso88593'`  ,   `'iso_8859-3'`  ,   `'iso_8859-3:1988'`  ,   `'l3'`  ,   `'latin3'` |
| `'iso-8859-4'` | `'csisolatin4'`  ,   `'iso-ir-110'`  ,   `'iso8859-4'`  ,   `'iso88594'`  ,   `'iso_8859-4'`  ,   `'iso_8859-4:1988'`  ,   `'l4'`  ,   `'latin4'` |
| `'iso-8859-5'` | `'csisolatincyrillic'`  ,   `'cyrillic'`  ,   `'iso-ir-144'`  ,   `'iso8859-5'`  ,   `'iso88595'`  ,   `'iso_8859-5'`  ,   `'iso_8859-5:1988'` |
| `'iso-8859-6'` | `'arabic'`  ,   `'asmo-708'`  ,   `'csiso88596e'`  ,   `'csiso88596i'`  ,   `'csisolatinarabic'`  ,   `'ecma-114'`  ,   `'iso-8859-6-e'`  ,   `'iso-8859-6-i'`  ,   `'iso-ir-127'`  ,   `'iso8859-6'`  ,   `'iso88596'`  ,   `'iso_8859-6'`  ,   `'iso_8859-6:1987'` |
| `'iso-8859-7'` | `'csisolatingreek'`  ,   `'ecma-118'`  ,   `'elot_928'`  ,   `'greek'`  ,   `'greek8'`  ,   `'iso-ir-126'`  ,   `'iso8859-7'`  ,   `'iso88597'`  ,   `'iso_8859-7'`  ,   `'iso_8859-7:1987'`  ,   `'sun_eu_greek'` |
| `'iso-8859-8'` | `'csiso88598e'`  ,   `'csisolatinhebrew'`  ,   `'hebrew'`  ,   `'iso-8859-8-e'`  ,   `'iso-ir-138'`  ,   `'iso8859-8'`  ,   `'iso88598'`  ,   `'iso_8859-8'`  ,   `'iso_8859-8:1988'`  ,   `'visual'` |
| `'iso-8859-8-i'` | `'csiso88598i'`  ,   `'logical'` |
| `'iso-8859-10'` | `'csisolatin6'`  ,   `'iso-ir-157'`  ,   `'iso8859-10'`  ,   `'iso885910'`  ,   `'l6'`  ,   `'latin6'` |
| `'iso-8859-13'` | `'iso8859-13'`  ,   `'iso885913'` |
| `'iso-8859-14'` | `'iso8859-14'`  ,   `'iso885914'` |
| `'iso-8859-15'` | `'csisolatin9'`  ,   `'iso8859-15'`  ,   `'iso885915'`  ,   `'iso_8859-15'`  ,   `'l9'` |
| `'koi8-r'` | `'cskoi8r'`  ,   `'koi'`  ,   `'koi8'`  ,   `'koi8_r'` |
| `'koi8-u'` | `'koi8-ru'` |
| `'macintosh'` | `'csmacintosh'`  ,   `'mac'`  ,   `'x-mac-roman'` |
| `'windows-874'` | `'dos-874'`  ,   `'iso-8859-11'`  ,   `'iso8859-11'`  ,   `'iso885911'`  ,   `'tis-620'` |
| `'windows-1250'` | `'cp1250'`  ,   `'x-cp1250'` |
| `'windows-1251'` | `'cp1251'`  ,   `'x-cp1251'` |
| `'windows-1252'` | `'ansi_x3.4-1968'`  ,   `'ascii'`  ,   `'cp1252'`  ,   `'cp819'`  ,   `'csisolatin1'`  ,   `'ibm819'`  ,   `'iso-8859-1'`  ,   `'iso-ir-100'`  ,   `'iso8859-1'`  ,   `'iso88591'`  ,   `'iso_8859-1'`  ,   `'iso_8859-1:1987'`  ,   `'l1'`  ,   `'latin1'`  ,   `'us-ascii'`  ,   `'x-cp1252'` |
| `'windows-1253'` | `'cp1253'`  ,   `'x-cp1253'` |
| `'windows-1254'` | `'cp1254'`  ,   `'csisolatin5'`  ,   `'iso-8859-9'`  ,   `'iso-ir-148'`  ,   `'iso8859-9'`  ,   `'iso88599'`  ,   `'iso_8859-9'`  ,   `'iso_8859-9:1989'`  ,   `'l5'`  ,   `'latin5'`  ,   `'x-cp1254'` |
| `'windows-1255'` | `'cp1255'`  ,   `'x-cp1255'` |
| `'windows-1256'` | `'cp1256'`  ,   `'x-cp1256'` |
| `'windows-1257'` | `'cp1257'`  ,   `'x-cp1257'` |
| `'windows-1258'` | `'cp1258'`  ,   `'x-cp1258'` |
| `'x-mac-cyrillic'` | `'x-mac-ukrainian'` |
| `'gbk'` | `'chinese'`  ,   `'csgb2312'`  ,   `'csiso58gb231280'`  ,   `'gb2312'`  ,   `'gb_2312'`  ,   `'gb_2312-80'`  ,   `'iso-ir-58'`  ,   `'x-gbk'` |
| `'gb18030'` ||
| `'big5'` | `'big5-hkscs'`  ,   `'cn-big5'`  ,   `'csbig5'`  ,   `'x-x-big5'` |
| `'euc-jp'` | `'cseucpkdfmtjapanese'`  ,   `'x-euc-jp'` |
| `'iso-2022-jp'` | `'csiso2022jp'` |
| `'shift_jis'` | `'csshiftjis'`  ,   `'ms932'`  ,   `'ms_kanji'`  ,   `'shift-jis'`  ,   `'sjis'`  ,   `'windows-31j'`  ,   `'x-sjis'` |
| `'euc-kr'` | `'cseuckr'`  ,   `'csksc56011987'`  ,   `'iso-ir-149'`  ,   `'korean'`  ,   `'ks_c_5601-1987'`  ,   `'ks_c_5601-1989'`  ,   `'ksc5601'`  ,   `'ksc_5601'`  ,   `'windows-949'` |


#### Beim Erstellen von Node.js mit der Option `small-icu` unterstützte Kodierungen {#encodings-supported-when-nodejs-is-built-with-the-small-icu-option}

| Kodierung | Aliase |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
| `'utf-16be'` ||
#### Beim Deaktivieren von ICU unterstützte Kodierungen {#encodings-supported-when-icu-is-disabled}

| Kodierung | Aliase |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
Die im [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) aufgeführte Kodierung `'iso-8859-16'` wird nicht unterstützt.

### `new TextDecoder([encoding[, options]])` {#new-textdecoderencoding-options}

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Kennzeichnet die `encoding`, die diese `TextDecoder`-Instanz unterstützt. **Standard:** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn Decodierungsfehler schwerwiegend sind. Diese Option wird nicht unterstützt, wenn ICU deaktiviert ist (siehe [Internationalisierung](/de/nodejs/api/intl)). **Standard:** `false`.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, enthält der `TextDecoder` die Byte Order Mark im decodierten Ergebnis. Wenn `false`, wird die Byte Order Mark aus der Ausgabe entfernt. Diese Option wird nur verwendet, wenn `encoding` `'utf-8'`, `'utf-16be'` oder `'utf-16le'` ist. **Standard:** `false`.


Erstellt eine neue `TextDecoder`-Instanz. Die `encoding` kann eine der unterstützten Kodierungen oder einen Alias angeben.

Die `TextDecoder`-Klasse ist auch im globalen Objekt verfügbar.

### `textDecoder.decode([input[, options]])` {#textdecoderdecodeinput-options}

- `input` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Eine `ArrayBuffer`-, `DataView`- oder `TypedArray`-Instanz, die die codierten Daten enthält.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn zusätzliche Datenblöcke erwartet werden. **Standard:** `false`.


- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Decodiert die `input` und gibt einen String zurück. Wenn `options.stream` `true` ist, werden alle unvollständigen Byte-Sequenzen, die am Ende der `input` auftreten, intern gepuffert und nach dem nächsten Aufruf von `textDecoder.decode()` ausgegeben.

Wenn `textDecoder.fatal` `true` ist, führen Decodierungsfehler zu einem ausgelösten `TypeError`.


### `textDecoder.encoding` {#textdecoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die von der `TextDecoder`-Instanz unterstützte Kodierung.

### `textDecoder.fatal` {#textdecoderfatal}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Der Wert ist `true`, wenn Dekodierungsfehler dazu führen, dass ein `TypeError` ausgelöst wird.

### `textDecoder.ignoreBOM` {#textdecoderignorebom}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Der Wert ist `true`, wenn das Dekodierungsergebnis die Byte Order Mark enthält.

## Klasse: `util.TextEncoder` {#class-utiltextencoder}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v11.0.0 | Die Klasse ist jetzt im globalen Objekt verfügbar. |
| v8.3.0 | Hinzugefügt in: v8.3.0 |
:::

Eine Implementierung des [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) `TextEncoder` API. Alle Instanzen von `TextEncoder` unterstützen nur die UTF-8-Kodierung.

```js [ESM]
const encoder = new TextEncoder();
const uint8array = encoder.encode('this is some data');
```
Die Klasse `TextEncoder` ist auch im globalen Objekt verfügbar.

### `textEncoder.encode([input])` {#textencoderencodeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der zu kodierende Text. **Standard:** eine leere Zeichenfolge.
- Rückgabe: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

UTF-8 kodiert die `input`-Zeichenfolge und gibt ein `Uint8Array` zurück, das die kodierten Bytes enthält.

### `textEncoder.encodeInto(src, dest)` {#textencoderencodeintosrc-dest}

**Hinzugefügt in: v12.11.0**

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der zu kodierende Text.
- `dest` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Das Array, in dem das Kodierungsergebnis gespeichert werden soll.
- Rückgabe: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `read` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die gelesenen Unicode-Codeeinheiten von src.
    - `written` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die geschriebenen UTF-8-Bytes von dest.
  
 

UTF-8 kodiert die `src`-Zeichenfolge in das `dest`-Uint8Array und gibt ein Objekt zurück, das die gelesenen Unicode-Codeeinheiten und die geschriebenen UTF-8-Bytes enthält.

```js [ESM]
const encoder = new TextEncoder();
const src = 'this is some data';
const dest = new Uint8Array(10);
const { read, written } = encoder.encodeInto(src, dest);
```

### `textEncoder.encoding` {#textencoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die von der `TextEncoder`-Instanz unterstützte Kodierung. Immer auf `'utf-8'` gesetzt.

## `util.toUSVString(string)` {#utiltousvstringstring}

**Hinzugefügt in: v16.8.0, v14.18.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt den `string` zurück, nachdem alle Surrogate-Codepunkte (oder äquivalent dazu, alle ungepaarten Surrogate-Codeeinheiten) durch das Unicode-„Ersetzungszeichen“ U+FFFD ersetzt wurden.

## `util.transferableAbortController()` {#utiltransferableabortcontroller}

**Hinzugefügt in: v18.11.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Erstellt und gibt eine [\<AbortController\>](/de/nodejs/api/globals#class-abortcontroller)-Instanz zurück, deren [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) als übertragbar gekennzeichnet ist und mit `structuredClone()` oder `postMessage()` verwendet werden kann.

## `util.transferableAbortSignal(signal)` {#utiltransferableabortsignalsignal}

**Hinzugefügt in: v18.11.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal)
- Gibt zurück: [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal)

Markiert das angegebene [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) als übertragbar, sodass es mit `structuredClone()` und `postMessage()` verwendet werden kann.

```js [ESM]
const signal = transferableAbortSignal(AbortSignal.timeout(100));
const channel = new MessageChannel();
channel.port2.postMessage(signal, [signal]);
```
## `util.aborted(signal, resource)` {#utilabortedsignal-resource}

**Hinzugefügt in: v19.7.0, v18.16.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal)
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Jedes Objekt, das nicht null ist, das an die abbrechbare Operation gebunden ist und schwach gehalten wird. Wenn `resource` vor dem Abbruch des `signal` per Garbage Collection freigegeben wird, bleibt das Promise ausstehend, sodass Node.js es nicht mehr verfolgt. Dies trägt dazu bei, Speicherlecks bei lang andauernden oder nicht abbrechbaren Operationen zu verhindern.
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Hört auf das Abbrechen-Ereignis des bereitgestellten `signal` und gibt ein Promise zurück, das aufgelöst wird, wenn das `signal` abgebrochen wird. Wenn `resource` bereitgestellt wird, referenziert es schwach das zugehörige Objekt der Operation, sodass das zurückgegebene Promise ausstehend bleibt, wenn `resource` vor dem Abbruch des `signal` per Garbage Collection freigegeben wird. Dies verhindert Speicherlecks bei lang andauernden oder nicht abbrechbaren Operationen.



::: code-group
```js [CJS]
const { aborted } = require('node:util');

// Obtain an object with an abortable signal, like a custom resource or operation.
const dependent = obtainSomethingAbortable();

// Pass `dependent` as the resource, indicating the promise should only resolve
// if `dependent` is still in memory when the signal is aborted.
aborted(dependent.signal, dependent).then(() => {

  // This code runs when `dependent` is aborted.
  console.log('Dependent resource was aborted.');
});

// Simulate an event that triggers the abort.
dependent.on('event', () => {
  dependent.abort(); // This will cause the `aborted` promise to resolve.
});
```

```js [ESM]
import { aborted } from 'node:util';

// Obtain an object with an abortable signal, like a custom resource or operation.
const dependent = obtainSomethingAbortable();

// Pass `dependent` as the resource, indicating the promise should only resolve
// if `dependent` is still in memory when the signal is aborted.
aborted(dependent.signal, dependent).then(() => {

  // This code runs when `dependent` is aborted.
  console.log('Dependent resource was aborted.');
});

// Simulate an event that triggers the abort.
dependent.on('event', () => {
  dependent.abort(); // This will cause the `aborted` promise to resolve.
});
```
:::


## `util.types` {#utiltypes}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.3.0 | Als `require('util/types')` verfügbar gemacht. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

`util.types` bietet Typüberprüfungen für verschiedene Arten von eingebauten Objekten. Im Gegensatz zu `instanceof` oder `Object.prototype.toString.call(value)` überprüfen diese Prüfungen nicht die Eigenschaften des Objekts, auf die von JavaScript aus zugegriffen werden kann (wie z. B. deren Prototyp), und verursachen in der Regel den Overhead eines Aufrufs von C++.

Das Ergebnis gibt im Allgemeinen keine Garantien darüber, welche Arten von Eigenschaften oder Verhalten ein Wert in JavaScript aufweist. Sie sind in erster Linie für Add-on-Entwickler nützlich, die Typüberprüfungen lieber in JavaScript durchführen.

Die API ist über `require('node:util').types` oder `require('node:util/types')` zugänglich.

### `util.types.isAnyArrayBuffer(value)` {#utiltypesisanyarraybuffervalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)- oder [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)-Instanz ist.

Siehe auch [`util.types.isArrayBuffer()`](/de/nodejs/api/util#utiltypesisarraybuffervalue) und [`util.types.isSharedArrayBuffer()`](/de/nodejs/api/util#utiltypesissharedarraybuffervalue).

```js [ESM]
util.types.isAnyArrayBuffer(new ArrayBuffer());  // Gibt true zurück
util.types.isAnyArrayBuffer(new SharedArrayBuffer());  // Gibt true zurück
```
### `util.types.isArrayBufferView(value)` {#utiltypesisarraybufferviewvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine Instanz einer der [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)-Ansichten ist, wie z. B. typisierte Array-Objekte oder [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Entspricht [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

```js [ESM]
util.types.isArrayBufferView(new Int8Array());  // true
util.types.isArrayBufferView(Buffer.from('hello world')); // true
util.types.isArrayBufferView(new DataView(new ArrayBuffer(16)));  // true
util.types.isArrayBufferView(new ArrayBuffer());  // false
```

### `util.types.isArgumentsObject(value)` {#utiltypesisargumentsobjectvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert ein `arguments`-Objekt ist.

```js [ESM]
function foo() {
  util.types.isArgumentsObject(arguments);  // Gibt true zurück
}
```
### `util.types.isArrayBuffer(value)` {#utiltypesisarraybuffervalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)-Instanz ist. Dies beinhaltet *nicht* [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)-Instanzen. Normalerweise ist es wünschenswert, beides zu testen; siehe [`util.types.isAnyArrayBuffer()`](/de/nodejs/api/util#utiltypesisanyarraybuffervalue) dafür.

```js [ESM]
util.types.isArrayBuffer(new ArrayBuffer());  // Gibt true zurück
util.types.isArrayBuffer(new SharedArrayBuffer());  // Gibt false zurück
```
### `util.types.isAsyncFunction(value)` {#utiltypesisasyncfunctionvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine [Async-Funktion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) ist. Dies meldet nur, was die JavaScript-Engine sieht; insbesondere kann der Rückgabewert nicht mit dem ursprünglichen Quellcode übereinstimmen, wenn ein Transpilierungs-Tool verwendet wurde.

```js [ESM]
util.types.isAsyncFunction(function foo() {});  // Gibt false zurück
util.types.isAsyncFunction(async function foo() {});  // Gibt true zurück
```

### `util.types.isBigInt64Array(value)` {#utiltypesisbigint64arrayvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine `BigInt64Array`-Instanz ist.

```js [ESM]
util.types.isBigInt64Array(new BigInt64Array());   // Gibt true zurück
util.types.isBigInt64Array(new BigUint64Array());  // Gibt false zurück
```
### `util.types.isBigIntObject(value)` {#utiltypesisbigintobjectvalue}

**Hinzugefügt in: v10.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert ein BigInt-Objekt ist, z. B. erstellt durch `Object(BigInt(123))`.

```js [ESM]
util.types.isBigIntObject(Object(BigInt(123)));   // Gibt true zurück
util.types.isBigIntObject(BigInt(123));   // Gibt false zurück
util.types.isBigIntObject(123);  // Gibt false zurück
```
### `util.types.isBigUint64Array(value)` {#utiltypesisbiguint64arrayvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine `BigUint64Array`-Instanz ist.

```js [ESM]
util.types.isBigUint64Array(new BigInt64Array());   // Gibt false zurück
util.types.isBigUint64Array(new BigUint64Array());  // Gibt true zurück
```
### `util.types.isBooleanObject(value)` {#utiltypesisbooleanobjectvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert ein boolesches Objekt ist, z. B. erstellt durch `new Boolean()`.

```js [ESM]
util.types.isBooleanObject(false);  // Gibt false zurück
util.types.isBooleanObject(true);   // Gibt false zurück
util.types.isBooleanObject(new Boolean(false)); // Gibt true zurück
util.types.isBooleanObject(new Boolean(true));  // Gibt true zurück
util.types.isBooleanObject(Boolean(false)); // Gibt false zurück
util.types.isBooleanObject(Boolean(true));  // Gibt false zurück
```

### `util.types.isBoxedPrimitive(value)` {#utiltypesisboxedprimitivevalue}

**Hinzugefügt in: v10.11.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert ein beliebiges gekapseltes primitives Objekt ist, z. B. erstellt durch `new Boolean()`, `new String()` oder `Object(Symbol())`.

Zum Beispiel:

```js [ESM]
util.types.isBoxedPrimitive(false); // Gibt false zurück
util.types.isBoxedPrimitive(new Boolean(false)); // Gibt true zurück
util.types.isBoxedPrimitive(Symbol('foo')); // Gibt false zurück
util.types.isBoxedPrimitive(Object(Symbol('foo'))); // Gibt true zurück
util.types.isBoxedPrimitive(Object(BigInt(5))); // Gibt true zurück
```
### `util.types.isCryptoKey(value)` {#utiltypesiscryptokeyvalue}

**Hinzugefügt in: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn `value` ein [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey) ist, andernfalls `false`.

### `util.types.isDataView(value)` {#utiltypesisdataviewvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine integrierte [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)-Instanz ist.

```js [ESM]
const ab = new ArrayBuffer(20);
util.types.isDataView(new DataView(ab));  // Gibt true zurück
util.types.isDataView(new Float64Array());  // Gibt false zurück
```
Siehe auch [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

### `util.types.isDate(value)` {#utiltypesisdatevalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine integrierte [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)-Instanz ist.

```js [ESM]
util.types.isDate(new Date());  // Gibt true zurück
```

### `util.types.isExternal(value)` {#utiltypesisexternalvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert ein nativer `External`-Wert ist.

Ein nativer `External`-Wert ist ein spezieller Objekttyp, der einen rohen C++-Zeiger (`void*`) für den Zugriff aus nativem Code enthält und keine anderen Eigenschaften hat. Solche Objekte werden entweder von Node.js-Interna oder nativen Addons erstellt. In JavaScript sind sie [eingefrorene](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) Objekte mit einem `null`-Prototyp.

```C [C]
#include <js_native_api.h>
#include <stdlib.h>
napi_value result;
static napi_value MyNapi(napi_env env, napi_callback_info info) {
  int* raw = (int*) malloc(1024);
  napi_status status = napi_create_external(env, (void*) raw, NULL, NULL, &result);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "napi_create_external failed");
    return NULL;
  }
  return result;
}
...
DECLARE_NAPI_PROPERTY("myNapi", MyNapi)
...
```
```js [ESM]
const native = require('napi_addon.node');
const data = native.myNapi();
util.types.isExternal(data); // returns true
util.types.isExternal(0); // returns false
util.types.isExternal(new String('foo')); // returns false
```
Weitere Informationen zu `napi_create_external` finden Sie unter [`napi_create_external()`](/de/nodejs/api/n-api#napi_create_external).

### `util.types.isFloat32Array(value)` {#utiltypesisfloat32arrayvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`Float32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array)-Instanz ist.

```js [ESM]
util.types.isFloat32Array(new ArrayBuffer());  // Returns false
util.types.isFloat32Array(new Float32Array());  // Returns true
util.types.isFloat32Array(new Float64Array());  // Returns false
```

### `util.types.isFloat64Array(value)` {#utiltypesisfloat64arrayvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`Float64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array)-Instanz ist.

```js [ESM]
util.types.isFloat64Array(new ArrayBuffer());  // Gibt false zurück
util.types.isFloat64Array(new Uint8Array());  // Gibt false zurück
util.types.isFloat64Array(new Float64Array());  // Gibt true zurück
```
### `util.types.isGeneratorFunction(value)` {#utiltypesisgeneratorfunctionvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine Generatorfunktion ist. Dies gibt nur das zurück, was die JavaScript-Engine sieht; insbesondere kann der Rückgabewert nicht mit dem ursprünglichen Quellcode übereinstimmen, wenn ein Transpilierungs-Tool verwendet wurde.

```js [ESM]
util.types.isGeneratorFunction(function foo() {});  // Gibt false zurück
util.types.isGeneratorFunction(function* foo() {});  // Gibt true zurück
```
### `util.types.isGeneratorObject(value)` {#utiltypesisgeneratorobjectvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert ein Generatorobjekt ist, das von einer eingebauten Generatorfunktion zurückgegeben wird. Dies gibt nur das zurück, was die JavaScript-Engine sieht; insbesondere kann der Rückgabewert nicht mit dem ursprünglichen Quellcode übereinstimmen, wenn ein Transpilierungs-Tool verwendet wurde.

```js [ESM]
function* foo() {}
const generator = foo();
util.types.isGeneratorObject(generator);  // Gibt true zurück
```
### `util.types.isInt8Array(value)` {#utiltypesisint8arrayvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`Int8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array)-Instanz ist.

```js [ESM]
util.types.isInt8Array(new ArrayBuffer());  // Gibt false zurück
util.types.isInt8Array(new Int8Array());  // Gibt true zurück
util.types.isInt8Array(new Float64Array());  // Gibt false zurück
```

### `util.types.isInt16Array(value)` {#utiltypesisint16arrayvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`Int16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array)-Instanz ist.

```js [ESM]
util.types.isInt16Array(new ArrayBuffer());  // Gibt false zurück
util.types.isInt16Array(new Int16Array());  // Gibt true zurück
util.types.isInt16Array(new Float64Array());  // Gibt false zurück
```
### `util.types.isInt32Array(value)` {#utiltypesisint32arrayvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`Int32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array)-Instanz ist.

```js [ESM]
util.types.isInt32Array(new ArrayBuffer());  // Gibt false zurück
util.types.isInt32Array(new Int32Array());  // Gibt true zurück
util.types.isInt32Array(new Float64Array());  // Gibt false zurück
```
### `util.types.isKeyObject(value)` {#utiltypesiskeyobjectvalue}

**Hinzugefügt in: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn `value` ein [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) ist, andernfalls `false`.

### `util.types.isMap(value)` {#utiltypesismapvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)-Instanz ist.

```js [ESM]
util.types.isMap(new Map());  // Gibt true zurück
```

### `util.types.isMapIterator(value)` {#utiltypesismapiteratorvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert ein Iterator ist, der für eine integrierte [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)-Instanz zurückgegeben wird.

```js [ESM]
const map = new Map();
util.types.isMapIterator(map.keys());  // Gibt true zurück
util.types.isMapIterator(map.values());  // Gibt true zurück
util.types.isMapIterator(map.entries());  // Gibt true zurück
util.types.isMapIterator(map[Symbol.iterator]());  // Gibt true zurück
```
### `util.types.isModuleNamespaceObject(value)` {#utiltypesismodulenamespaceobjectvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine Instanz eines [Modul-Namespace-Objekts](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects) ist.

```js [ESM]
import * as ns from './a.js';

util.types.isModuleNamespaceObject(ns);  // Gibt true zurück
```
### `util.types.isNativeError(value)` {#utiltypesisnativeerrorvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert vom Konstruktor eines [eingebauten `Error`-Typs](https://tc39.es/ecma262/#sec-error-objects) zurückgegeben wurde.

```js [ESM]
console.log(util.types.isNativeError(new Error()));  // true
console.log(util.types.isNativeError(new TypeError()));  // true
console.log(util.types.isNativeError(new RangeError()));  // true
```
Subklassen der nativen Fehler-Typen sind ebenfalls native Fehler:

```js [ESM]
class MyError extends Error {}
console.log(util.types.isNativeError(new MyError()));  // true
```
Ein Wert, der `instanceof` einer nativen Fehlerklasse ist, ist nicht äquivalent zu `isNativeError()`, das für diesen Wert `true` zurückgibt. `isNativeError()` gibt `true` für Fehler zurück, die aus einem anderen [Realm](https://tc39.es/ecma262/#realm) stammen, während `instanceof Error` für diese Fehler `false` zurückgibt:

```js [ESM]
const vm = require('node:vm');
const context = vm.createContext({});
const myError = vm.runInContext('new Error()', context);
console.log(util.types.isNativeError(myError)); // true
console.log(myError instanceof Error); // false
```
Umgekehrt gibt `isNativeError()` `false` für alle Objekte zurück, die nicht vom Konstruktor eines nativen Fehlers zurückgegeben wurden. Das schließt Werte ein, die `instanceof` native Fehler sind:

```js [ESM]
const myError = { __proto__: Error.prototype };
console.log(util.types.isNativeError(myError)); // false
console.log(myError instanceof Error); // true
```

### `util.types.isNumberObject(value)` {#utiltypesisnumberobjectvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert ein Zahlenobjekt ist, z. B. erstellt durch `new Number()`.

```js [ESM]
util.types.isNumberObject(0);  // Gibt false zurück
util.types.isNumberObject(new Number(0));   // Gibt true zurück
```
### `util.types.isPromise(value)` {#utiltypesispromisevalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert ein eingebautes [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ist.

```js [ESM]
util.types.isPromise(Promise.resolve(42));  // Gibt true zurück
```
### `util.types.isProxy(value)` {#utiltypesisproxyvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)-Instanz ist.

```js [ESM]
const target = {};
const proxy = new Proxy(target, {});
util.types.isProxy(target);  // Gibt false zurück
util.types.isProxy(proxy);  // Gibt true zurück
```
### `util.types.isRegExp(value)` {#utiltypesisregexpvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert ein reguläres Ausdrucksobjekt ist.

```js [ESM]
util.types.isRegExp(/abc/);  // Gibt true zurück
util.types.isRegExp(new RegExp('abc'));  // Gibt true zurück
```

### `util.types.isSet(value)` {#utiltypesissetvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)-Instanz ist.

```js [ESM]
util.types.isSet(new Set());  // Gibt true zurück
```
### `util.types.isSetIterator(value)` {#utiltypesissetiteratorvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert ein Iterator ist, der für eine eingebaute [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)-Instanz zurückgegeben wird.

```js [ESM]
const set = new Set();
util.types.isSetIterator(set.keys());  // Gibt true zurück
util.types.isSetIterator(set.values());  // Gibt true zurück
util.types.isSetIterator(set.entries());  // Gibt true zurück
util.types.isSetIterator(set[Symbol.iterator]());  // Gibt true zurück
```
### `util.types.isSharedArrayBuffer(value)` {#utiltypesissharedarraybuffervalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)-Instanz ist. Dies schließt *nicht* [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)-Instanzen ein. Normalerweise ist es wünschenswert, beides zu testen; Siehe [`util.types.isAnyArrayBuffer()`](/de/nodejs/api/util#utiltypesisanyarraybuffervalue) dafür.

```js [ESM]
util.types.isSharedArrayBuffer(new ArrayBuffer());  // Gibt false zurück
util.types.isSharedArrayBuffer(new SharedArrayBuffer());  // Gibt true zurück
```

### `util.types.isStringObject(value)` {#utiltypesisstringobjectvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert ein String-Objekt ist, z.B. erstellt durch `new String()`.

```js [ESM]
util.types.isStringObject('foo');  // Gibt false zurück
util.types.isStringObject(new String('foo'));   // Gibt true zurück
```
### `util.types.isSymbolObject(value)` {#utiltypesissymbolobjectvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert ein Symbolobjekt ist, das durch Aufrufen von `Object()` auf einem `Symbol`-Primitiv erstellt wurde.

```js [ESM]
const symbol = Symbol('foo');
util.types.isSymbolObject(symbol);  // Gibt false zurück
util.types.isSymbolObject(Object(symbol));   // Gibt true zurück
```
### `util.types.isTypedArray(value)` {#utiltypesistypedarrayvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine integrierte [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Instanz ist.

```js [ESM]
util.types.isTypedArray(new ArrayBuffer());  // Gibt false zurück
util.types.isTypedArray(new Uint8Array());  // Gibt true zurück
util.types.isTypedArray(new Float64Array());  // Gibt true zurück
```
Siehe auch [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

### `util.types.isUint8Array(value)` {#utiltypesisuint8arrayvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Instanz ist.

```js [ESM]
util.types.isUint8Array(new ArrayBuffer());  // Gibt false zurück
util.types.isUint8Array(new Uint8Array());  // Gibt true zurück
util.types.isUint8Array(new Float64Array());  // Gibt false zurück
```

### `util.types.isUint8ClampedArray(value)` {#utiltypesisuint8clampedarrayvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`Uint8ClampedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray)-Instanz ist.

```js [ESM]
util.types.isUint8ClampedArray(new ArrayBuffer());  // Gibt false zurück
util.types.isUint8ClampedArray(new Uint8ClampedArray());  // Gibt true zurück
util.types.isUint8ClampedArray(new Float64Array());  // Gibt false zurück
```
### `util.types.isUint16Array(value)` {#utiltypesisuint16arrayvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`Uint16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array)-Instanz ist.

```js [ESM]
util.types.isUint16Array(new ArrayBuffer());  // Gibt false zurück
util.types.isUint16Array(new Uint16Array());  // Gibt true zurück
util.types.isUint16Array(new Float64Array());  // Gibt false zurück
```
### `util.types.isUint32Array(value)` {#utiltypesisuint32arrayvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`Uint32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)-Instanz ist.

```js [ESM]
util.types.isUint32Array(new ArrayBuffer());  // Gibt false zurück
util.types.isUint32Array(new Uint32Array());  // Gibt true zurück
util.types.isUint32Array(new Float64Array());  // Gibt false zurück
```
### `util.types.isWeakMap(value)` {#utiltypesisweakmapvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)-Instanz ist.

```js [ESM]
util.types.isWeakMap(new WeakMap());  // Gibt true zurück
```

### `util.types.isWeakSet(value)` {#utiltypesisweaksetvalue}

**Hinzugefügt in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Wert eine eingebaute [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)-Instanz ist.

```js [ESM]
util.types.isWeakSet(new WeakSet());  // Gibt true zurück
```
## Veraltete APIs {#deprecated-apis}

Die folgenden APIs sind veraltet und sollten nicht mehr verwendet werden. Bestehende Anwendungen und Module sollten aktualisiert werden, um alternative Ansätze zu finden.

### `util._extend(target, source)` {#util_extendtarget-source}

**Hinzugefügt in: v0.7.5**

**Veraltet seit: v6.0.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).
:::

- `target` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `source` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Die Methode `util._extend()` war nie dazu gedacht, außerhalb interner Node.js-Module verwendet zu werden. Die Community hat sie trotzdem gefunden und verwendet.

Sie ist veraltet und sollte nicht in neuem Code verwendet werden. JavaScript verfügt über eine sehr ähnliche integrierte Funktionalität durch [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

### `util.isArray(object)` {#utilisarrayobject}

**Hinzugefügt in: v0.6.0**

**Veraltet seit: v4.0.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray).
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Alias für [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray).

Gibt `true` zurück, wenn das gegebene `object` ein `Array` ist. Andernfalls wird `false` zurückgegeben.

```js [ESM]
const util = require('node:util');

util.isArray([]);
// Gibt zurück: true
util.isArray(new Array());
// Gibt zurück: true
util.isArray({});
// Gibt zurück: false
```

