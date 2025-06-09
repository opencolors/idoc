---
title: Node.js Console API Dokumentation
description: Die Node.js Console API bietet eine einfache Debug-Konsole, ähnlich dem JavaScript-Konsolenmechanismus, der von Webbrowsern bereitgestellt wird. Diese Dokumentation beschreibt die verfügbaren Methoden zum Protokollieren, Debuggen und Inspektion von JavaScript-Objekten in einer Node.js-Umgebung.
head:
  - - meta
    - name: og:title
      content: Node.js Console API Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Die Node.js Console API bietet eine einfache Debug-Konsole, ähnlich dem JavaScript-Konsolenmechanismus, der von Webbrowsern bereitgestellt wird. Diese Dokumentation beschreibt die verfügbaren Methoden zum Protokollieren, Debuggen und Inspektion von JavaScript-Objekten in einer Node.js-Umgebung.
  - - meta
    - name: twitter:title
      content: Node.js Console API Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Die Node.js Console API bietet eine einfache Debug-Konsole, ähnlich dem JavaScript-Konsolenmechanismus, der von Webbrowsern bereitgestellt wird. Diese Dokumentation beschreibt die verfügbaren Methoden zum Protokollieren, Debuggen und Inspektion von JavaScript-Objekten in einer Node.js-Umgebung.
---


# Konsole {#console}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/console.js](https://github.com/nodejs/node/blob/v23.5.0/lib/console.js)

Das `node:console`-Modul bietet eine einfache Debugging-Konsole, die dem JavaScript-Konsolenmechanismus ähnelt, der von Webbrowsern bereitgestellt wird.

Das Modul exportiert zwei spezifische Komponenten:

- Eine `Console`-Klasse mit Methoden wie `console.log()`, `console.error()` und `console.warn()`, die verwendet werden können, um in einen beliebigen Node.js-Stream zu schreiben.
- Eine globale `console`-Instanz, die so konfiguriert ist, dass sie in [`process.stdout`](/de/nodejs/api/process#processstdout) und [`process.stderr`](/de/nodejs/api/process#processstderr) schreibt. Die globale `console` kann verwendet werden, ohne `require('node:console')` aufzurufen.

*<strong>Warnung</strong>*: Die Methoden des globalen Konsolenobjekts sind weder konsistent synchron wie die Browser-APIs, denen sie ähneln, noch sind sie konsistent asynchron wie alle anderen Node.js-Streams. Programme, die von dem synchronen/asynchronen Verhalten der Konsolenfunktionen abhängen möchten, sollten zuerst die Art des zugrunde liegenden Streams der Konsole herausfinden. Dies liegt daran, dass der Stream von der zugrunde liegenden Plattform und der Standard-Stream-Konfiguration des aktuellen Prozesses abhängt. Weitere Informationen finden Sie im [Hinweis zu Prozess-I/O](/de/nodejs/api/process#a-note-on-process-io).

Beispiel mit der globalen `console`:

```js [ESM]
console.log('hello world');
// Gibt aus: hello world, nach stdout
console.log('hello %s', 'world');
// Gibt aus: hello world, nach stdout
console.error(new Error('Hoppla, da ist etwas Schlimmes passiert'));
// Gibt Fehlermeldung und Stack-Trace nach stderr aus:
//   Error: Hoppla, da ist etwas Schlimmes passiert
//     at [eval]:5:15
//     at Script.runInThisContext (node:vm:132:18)
//     at Object.runInThisContext (node:vm:309:38)
//     at node:internal/process/execution:77:19
//     at [eval]-wrapper:6:22
//     at evalScript (node:internal/process/execution:76:60)
//     at node:internal/main/eval_string:23:3

const name = 'Will Robinson';
console.warn(`Gefahr ${name}! Gefahr!`);
// Gibt aus: Gefahr Will Robinson! Gefahr!, nach stderr
```
Beispiel mit der `Console`-Klasse:

```js [ESM]
const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);

myConsole.log('hello world');
// Gibt aus: hello world, nach out
myConsole.log('hello %s', 'world');
// Gibt aus: hello world, nach out
myConsole.error(new Error('Hoppla, da ist etwas Schlimmes passiert'));
// Gibt aus: [Error: Hoppla, da ist etwas Schlimmes passiert], nach err

const name = 'Will Robinson';
myConsole.warn(`Gefahr ${name}! Gefahr!`);
// Gibt aus: Gefahr Will Robinson! Gefahr!, nach err
```

## Klasse: `Console` {#class-console}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Fehler, die beim Schreiben in die zugrunde liegenden Streams auftreten, werden jetzt standardmäßig ignoriert. |
:::

Die Klasse `Console` kann verwendet werden, um einen einfachen Logger mit konfigurierbaren Ausgabestreams zu erstellen und kann entweder über `require('node:console').Console` oder `console.Console` (oder deren destrukturierte Gegenstücke) aufgerufen werden:

::: code-group
```js [ESM]
import { Console } from 'node:console';
```

```js [CJS]
const { Console } = require('node:console');
```
:::

```js [ESM]
const { Console } = console;
```
### `new Console(stdout[, stderr][, ignoreErrors])` {#new-consolestdout-stderr-ignoreerrors}

### `new Console(options)` {#new-consoleoptions}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.2.0, v12.17.0 | Die Option `groupIndentation` wurde eingeführt. |
| v11.7.0 | Die Option `inspectOptions` wurde eingeführt. |
| v10.0.0 | Der `Console`-Konstruktor unterstützt jetzt ein `options`-Argument, und die Option `colorMode` wurde eingeführt. |
| v8.0.0 | Die Option `ignoreErrors` wurde eingeführt. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stdout` [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable)
    - `stderr` [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable)
    - `ignoreErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ignoriert Fehler beim Schreiben in die zugrunde liegenden Streams. **Standard:** `true`.
    - `colorMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Legt die Farbunterstützung für diese `Console`-Instanz fest. Wenn die Option auf `true` gesetzt ist, wird die Farbgebung bei der Inspektion von Werten aktiviert. Wenn die Option auf `false` gesetzt ist, wird die Farbgebung bei der Inspektion von Werten deaktiviert. Wenn die Option auf `'auto'` gesetzt ist, hängt die Farbunterstützung vom Wert der Eigenschaft `isTTY` und dem von `getColorDepth()` zurückgegebenen Wert des jeweiligen Streams ab. Diese Option kann nicht verwendet werden, wenn `inspectOptions.colors` ebenfalls gesetzt ist. **Standard:** `'auto'`.
    - `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Gibt Optionen an, die an [`util.inspect()`](/de/nodejs/api/util#utilinspectobject-options) weitergegeben werden.
    - `groupIndentation` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die Gruppeneinrückung fest. **Standard:** `2`.

Erstellt eine neue `Console` mit einer oder zwei beschreibbaren Stream-Instanzen. `stdout` ist ein beschreibbarer Stream zum Ausgeben von Protokoll- oder Info-Ausgaben. `stderr` wird für Warn- oder Fehlerausgaben verwendet. Wenn `stderr` nicht angegeben wird, wird `stdout` für `stderr` verwendet.

::: code-group
```js [ESM]
import { createWriteStream } from 'node:fs';
import { Console } from 'node:console';
// Alternatively
// const { Console } = console;

const output = createWriteStream('./stdout.log');
const errorOutput = createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```

```js [CJS]
const fs = require('node:fs');
const { Console } = require('node:console');
// Alternatively
// const { Console } = console;

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```
:::

Die globale `console` ist eine spezielle `Console`, deren Ausgabe an [`process.stdout`](/de/nodejs/api/process#processstdout) und [`process.stderr`](/de/nodejs/api/process#processstderr) gesendet wird. Sie entspricht dem Aufruf von:

```js [ESM]
new Console({ stdout: process.stdout, stderr: process.stderr });
```

### `console.assert(value[, ...message])` {#consoleassertvalue-message}

::: info [History]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Die Implementierung ist jetzt spezifikationskonform und löst keine Fehler mehr aus. |
| v0.1.101 | Hinzugefügt in: v0.1.101 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der Wert, der auf Wahrheit geprüft wird.
- `...message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Alle Argumente außer `value` werden als Fehlermeldung verwendet.

`console.assert()` schreibt eine Nachricht, wenn `value` [falsch](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) ist oder fehlt. Es schreibt nur eine Nachricht und beeinflusst die Ausführung ansonsten nicht. Die Ausgabe beginnt immer mit `"Assertion failed"`. Falls angegeben, wird `message` mit [`util.format()`](/de/nodejs/api/util#utilformatformat-args) formatiert.

Wenn `value` [wahr](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) ist, passiert nichts.

```js [ESM]
console.assert(true, 'does nothing');

console.assert(false, 'Whoops %s work', 'didn\'t');
// Assertion failed: Whoops didn't work

console.assert();
// Assertion failed
```
### `console.clear()` {#consoleclear}

**Hinzugefügt in: v8.3.0**

Wenn `stdout` ein TTY ist, versucht der Aufruf von `console.clear()`, das TTY zu löschen. Wenn `stdout` kein TTY ist, tut diese Methode nichts.

Die spezifische Funktionsweise von `console.clear()` kann je nach Betriebssystem und Terminaltyp variieren. Bei den meisten Linux-Betriebssystemen funktioniert `console.clear()` ähnlich wie der Shell-Befehl `clear`. Unter Windows löscht `console.clear()` nur die Ausgabe im aktuellen Terminal-Viewport für die Node.js-Binärdatei.

### `console.count([label])` {#consolecountlabel}

**Hinzugefügt in: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Anzeigebeschriftung für den Zähler. **Standard:** `'default'`.

Verwaltet einen internen Zähler spezifisch für `label` und gibt die Anzahl der Aufrufe von `console.count()` mit dem gegebenen `label` an `stdout` aus.

```js [ESM]
> console.count()
default: 1
undefined
> console.count('default')
default: 2
undefined
> console.count('abc')
abc: 1
undefined
> console.count('xyz')
xyz: 1
undefined
> console.count('abc')
abc: 2
undefined
> console.count()
default: 3
undefined
>
```

### `console.countReset([label])` {#consolecountresetlabel}

**Hinzugefügt in: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Anzeigebezeichnung für den Zähler. **Standard:** `'default'`.

Setzt den internen Zähler zurück, der spezifisch für `label` ist.

```js [ESM]
> console.count('abc');
abc: 1
undefined
> console.countReset('abc');
undefined
> console.count('abc');
abc: 1
undefined
>
```
### `console.debug(data[, ...args])` {#consoledebugdata-args}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.10.0 | `console.debug` ist jetzt ein Alias für `console.log`. |
| v8.0.0 | Hinzugefügt in: v8.0.0 |
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Die Funktion `console.debug()` ist ein Alias für [`console.log()`](/de/nodejs/api/console#consolelogdata-args).

### `console.dir(obj[, options])` {#consoledirobj-options}

**Hinzugefügt in: v0.1.101**

- `obj` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, werden auch die nicht aufzählbaren und Symbol-Eigenschaften des Objekts angezeigt. **Standard:** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Sagt [`util.inspect()`](/de/nodejs/api/util#utilinspectobject-options), wie oft beim Formatieren des Objekts rekursiert werden soll. Dies ist nützlich, um große, komplizierte Objekte zu inspizieren. Um es unendlich oft zu rekursieren, übergeben Sie `null`. **Standard:** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird die Ausgabe mit ANSI-Farbcodes formatiert. Farben sind anpassbar; siehe [Anpassen der Farben von `util.inspect()` ](/de/nodejs/api/util#customizing-utilinspect-colors). **Standard:** `false`.
  
 

Verwendet [`util.inspect()`](/de/nodejs/api/util#utilinspectobject-options) auf `obj` und gibt die resultierende Zeichenkette in `stdout` aus. Diese Funktion umgeht jede benutzerdefinierte `inspect()`-Funktion, die auf `obj` definiert ist.


### `console.dirxml(...data)` {#consoledirxmldata}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.3.0 | `console.dirxml` ruft jetzt `console.log` für seine Argumente auf. |
| v8.0.0 | Hinzugefügt in: v8.0.0 |
:::

- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Diese Methode ruft `console.log()` auf und übergibt ihr die empfangenen Argumente. Diese Methode erzeugt keine XML-Formatierung.

### `console.error([data][, ...args])` {#consoleerrordata-args}

**Hinzugefügt in: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Gibt mit Zeilenumbruch nach `stderr` aus. Es können mehrere Argumente übergeben werden, wobei das erste als primäre Nachricht und alle zusätzlichen als Substitutionswerte ähnlich [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) verwendet werden (die Argumente werden alle an [`util.format()`](/de/nodejs/api/util#utilformatformat-args) übergeben).

```js [ESM]
const code = 5;
console.error('error #%d', code);
// Gibt aus: error #5, nach stderr
console.error('error', code);
// Gibt aus: error 5, nach stderr
```
Wenn Formatierungselemente (z. B. `%d`) nicht in der ersten Zeichenkette gefunden werden, wird [`util.inspect()`](/de/nodejs/api/util#utilinspectobject-options) für jedes Argument aufgerufen und die resultierenden Zeichenkettenwerte werden verkettet. Weitere Informationen finden Sie unter [`util.format()`](/de/nodejs/api/util#utilformatformat-args).

### `console.group([...label])` {#consolegrouplabel}

**Hinzugefügt in: v8.5.0**

- `...label` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Erhöht den Einzug nachfolgender Zeilen um Leerzeichen für die Länge von `groupIndentation`.

Wenn ein oder mehrere `label` bereitgestellt werden, werden diese zuerst ohne den zusätzlichen Einzug ausgegeben.

### `console.groupCollapsed()` {#consolegroupcollapsed}

**Hinzugefügt in: v8.5.0**

Ein Alias für [`console.group()`](/de/nodejs/api/console#consolegrouplabel).

### `console.groupEnd()` {#consolegroupend}

**Hinzugefügt in: v8.5.0**

Verringert den Einzug nachfolgender Zeilen um Leerzeichen für die Länge von `groupIndentation`.


### `console.info([data][, ...args])` {#consoleinfodata-args}

**Hinzugefügt in: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Die Funktion `console.info()` ist ein Alias für [`console.log()`](/de/nodejs/api/console#consolelogdata-args).

### `console.log([data][, ...args])` {#consolelogdata-args}

**Hinzugefügt in: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Gibt mit einem Zeilenumbruch auf `stdout` aus. Es können mehrere Argumente übergeben werden, wobei das erste als primäre Nachricht und alle zusätzlichen als Substitutionswerte ähnlich wie bei [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) verwendet werden (die Argumente werden alle an [`util.format()`](/de/nodejs/api/util#utilformatformat-args) übergeben).

```js [ESM]
const count = 5;
console.log('count: %d', count);
// Gibt aus: count: 5, an stdout
console.log('count:', count);
// Gibt aus: count: 5, an stdout
```
Weitere Informationen finden Sie unter [`util.format()`](/de/nodejs/api/util#utilformatformat-args).

### `console.table(tabularData[, properties])` {#consoletabletabulardata-properties}

**Hinzugefügt in: v10.0.0**

- `tabularData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `properties` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Alternative Eigenschaften zum Erstellen der Tabelle.

Versuchen Sie, eine Tabelle mit den Spalten der Eigenschaften von `tabularData` (oder verwenden Sie `properties`) und Zeilen von `tabularData` zu erstellen und protokollieren Sie sie. Fällt auf die einfache Protokollierung des Arguments zurück, wenn es nicht als tabellarisch geparst werden kann.

```js [ESM]
// Diese können nicht als tabellarische Daten geparst werden
console.table(Symbol());
// Symbol()

console.table(undefined);
// undefined

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
// ┌─────────┬─────┬─────┐
// │ (index) │ a   │ b   │
// ├─────────┼─────┼─────┤
// │ 0       │ 1   │ 'Y' │
// │ 1       │ 'Z' │ 2   │
// └─────────┴─────┴─────┘

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
// ┌─────────┬─────┐
// │ (index) │ a   │
// ├─────────┼─────┤
// │ 0       │ 1   │
// │ 1       │ 'Z' │
// └─────────┴─────┘
```

### `console.time([label])` {#consoletimelabel}

**Hinzugefügt in: v0.1.104**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'default'`

Startet einen Timer, der verwendet werden kann, um die Dauer einer Operation zu berechnen. Timer werden durch ein eindeutiges `label` identifiziert. Verwenden Sie dasselbe `label` beim Aufrufen von [`console.timeEnd()`](/de/nodejs/api/console#consoletimeendlabel), um den Timer zu stoppen und die verstrichene Zeit in geeigneten Zeiteinheiten an `stdout` auszugeben. Wenn beispielsweise die verstrichene Zeit 3869 ms beträgt, zeigt `console.timeEnd()` "3.869s" an.

### `console.timeEnd([label])` {#consoletimeendlabel}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.0.0 | Die verstrichene Zeit wird mit einer geeigneten Zeiteinheit angezeigt. |
| v6.0.0 | Diese Methode unterstützt nicht mehr mehrere Aufrufe, die nicht einzelnen `console.time()`-Aufrufen zugeordnet sind; Details siehe unten. |
| v0.1.104 | Hinzugefügt in: v0.1.104 |
:::

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'default'`

Stoppt einen Timer, der zuvor durch Aufrufen von [`console.time()`](/de/nodejs/api/console#consoletimelabel) gestartet wurde, und gibt das Ergebnis an `stdout` aus:

```js [ESM]
console.time('bunch-of-stuff');
// Do a bunch of stuff.
console.timeEnd('bunch-of-stuff');
// Gibt aus: bunch-of-stuff: 225.438ms
```
### `console.timeLog([label][, ...data])` {#consoletimeloglabel-data}

**Hinzugefügt in: v10.7.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'default'`
- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Für einen Timer, der zuvor durch Aufrufen von [`console.time()`](/de/nodejs/api/console#consoletimelabel) gestartet wurde, gibt die verstrichene Zeit und andere `data`-Argumente an `stdout` aus:

```js [ESM]
console.time('process');
const value = expensiveProcess1(); // Gibt 42 zurück
console.timeLog('process', value);
// Gibt aus: "process: 365.227ms 42".
doExpensiveProcess2(value);
console.timeEnd('process');
```
### `console.trace([message][, ...args])` {#consoletracemessage-args}

**Hinzugefügt in: v0.1.104**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Gibt an `stderr` den String `'Trace: '` aus, gefolgt von der mit [`util.format()`](/de/nodejs/api/util#utilformatformat-args) formatierten Nachricht und dem Stack Trace zur aktuellen Position im Code.

```js [ESM]
console.trace('Show me');
// Gibt aus: (Stack Trace variiert je nachdem, wo trace aufgerufen wird)
//  Trace: Show me
//    at repl:2:9
//    at REPLServer.defaultEval (repl.js:248:27)
//    at bound (domain.js:287:14)
//    at REPLServer.runBound [as eval] (domain.js:300:12)
//    at REPLServer.<anonymous> (repl.js:412:12)
//    at emitOne (events.js:82:20)
//    at REPLServer.emit (events.js:169:7)
//    at REPLServer.Interface._onLine (readline.js:210:10)
//    at REPLServer.Interface._line (readline.js:549:8)
//    at REPLServer.Interface._ttyWrite (readline.js:826:14)
```

### `console.warn([data][, ...args])` {#consolewarndata-args}

**Hinzugefügt in: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Die Funktion `console.warn()` ist ein Alias für [`console.error()`](/de/nodejs/api/console#consoleerrordata-args).

## Nur Inspektormethoden {#inspector-only-methods}

Die folgenden Methoden werden von der V8-Engine in der allgemeinen API bereitgestellt, zeigen aber nichts an, es sei denn, sie werden in Verbindung mit dem [Inspektor](/de/nodejs/api/debugger) (`--inspect`-Flag) verwendet.

### `console.profile([label])` {#consoleprofilelabel}

**Hinzugefügt in: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Diese Methode zeigt nichts an, es sei denn, sie wird im Inspektor verwendet. Die Methode `console.profile()` startet ein JavaScript-CPU-Profil mit einer optionalen Bezeichnung, bis [`console.profileEnd()`](/de/nodejs/api/console#consoleprofileendlabel) aufgerufen wird. Das Profil wird dann dem **Profile**-Panel des Inspektors hinzugefügt.

```js [ESM]
console.profile('MyLabel');
// Some code
console.profileEnd('MyLabel');
// Fügt das Profil 'MyLabel' dem Profile-Panel des Inspektors hinzu.
```
### `console.profileEnd([label])` {#consoleprofileendlabel}

**Hinzugefügt in: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Diese Methode zeigt nichts an, es sei denn, sie wird im Inspektor verwendet. Beendet die aktuelle JavaScript-CPU-Profiling-Sitzung, falls eine gestartet wurde, und gibt den Bericht im **Profile**-Panel des Inspektors aus. Siehe [`console.profile()`](/de/nodejs/api/console#consoleprofilelabel) für ein Beispiel.

Wenn diese Methode ohne Bezeichnung aufgerufen wird, wird das zuletzt gestartete Profil gestoppt.

### `console.timeStamp([label])` {#consoletimestamplabel}

**Hinzugefügt in: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Diese Methode zeigt nichts an, es sei denn, sie wird im Inspektor verwendet. Die Methode `console.timeStamp()` fügt ein Ereignis mit der Bezeichnung `'label'` dem **Timeline**-Panel des Inspektors hinzu.

