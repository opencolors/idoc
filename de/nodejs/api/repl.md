---
title: Node.js REPL Dokumentation
description: Erkunden Sie die Node.js REPL (Read-Eval-Print Loop), die eine interaktive Umgebung zum Ausführen von JavaScript-Code, Debuggen und Testen von Node.js-Anwendungen bietet.
head:
  - - meta
    - name: og:title
      content: Node.js REPL Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erkunden Sie die Node.js REPL (Read-Eval-Print Loop), die eine interaktive Umgebung zum Ausführen von JavaScript-Code, Debuggen und Testen von Node.js-Anwendungen bietet.
  - - meta
    - name: twitter:title
      content: Node.js REPL Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erkunden Sie die Node.js REPL (Read-Eval-Print Loop), die eine interaktive Umgebung zum Ausführen von JavaScript-Code, Debuggen und Testen von Node.js-Anwendungen bietet.
---


# REPL {#repl}

::: tip [Stable: 2 - Stable]
[Stable: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/repl.js](https://github.com/nodejs/node/blob/v23.5.0/lib/repl.js)

Das `node:repl`-Modul stellt eine Read-Eval-Print-Loop (REPL)-Implementierung bereit, die sowohl als eigenständiges Programm verfügbar als auch in andere Anwendungen eingebunden werden kann. Der Zugriff erfolgt über:

::: code-group
```js [ESM]
import repl from 'node:repl';
```

```js [CJS]
const repl = require('node:repl');
```
:::

## Design und Funktionen {#design-and-features}

Das `node:repl`-Modul exportiert die Klasse [`repl.REPLServer`](/de/nodejs/api/repl#class-replserver). Während der Ausführung akzeptieren Instanzen von [`repl.REPLServer`](/de/nodejs/api/repl#class-replserver) einzelne Zeilen von Benutzereingaben, werten diese anhand einer benutzerdefinierten Auswertungsfunktion aus und geben dann das Ergebnis aus. Die Ein- und Ausgabe kann über `stdin` bzw. `stdout` erfolgen oder mit einem beliebigen Node.js-[Stream](/de/nodejs/api/stream) verbunden sein.

Instanzen von [`repl.REPLServer`](/de/nodejs/api/repl#class-replserver) unterstützen automatische Vervollständigung von Eingaben, Vervollständigungsvorschau, einfache Emacs-ähnliche Zeilenbearbeitung, mehrzeilige Eingaben, [ZSH](https://en.wikipedia.org/wiki/Z_shell)-ähnliche Reverse-I-Search, [ZSH](https://en.wikipedia.org/wiki/Z_shell)-ähnliche Substring-basierte Verlaufssuche, ANSI-formatierte Ausgabe, Speichern und Wiederherstellen des aktuellen REPL-Sitzungszustands, Fehlerbehebung und anpassbare Auswertungsfunktionen. Terminals, die keine ANSI-Stile und Emacs-ähnliche Zeilenbearbeitung unterstützen, greifen automatisch auf einen eingeschränkten Funktionsumfang zurück.

### Befehle und Sondertasten {#commands-and-special-keys}

Die folgenden Sonderbefehle werden von allen REPL-Instanzen unterstützt:

- `.break`: Wenn Sie sich in der Eingabe eines mehrzeiligen Ausdrucks befinden, geben Sie den Befehl `.break` ein (oder drücken Sie +), um die weitere Eingabe oder Verarbeitung dieses Ausdrucks abzubrechen.
- `.clear`: Setzt den REPL-`Kontext` auf ein leeres Objekt zurück und löscht alle eingegebenen mehrzeiligen Ausdrücke.
- `.exit`: Schließt den I/O-Stream und bewirkt, dass die REPL beendet wird.
- `.help`: Zeigt diese Liste mit Sonderbefehlen an.
- `.save`: Speichert die aktuelle REPL-Sitzung in einer Datei: `\> .save ./file/to/save.js`
- `.load`: Lädt eine Datei in die aktuelle REPL-Sitzung. `\> .load ./file/to/load.js`
- `.editor`: Wechselt in den Editor-Modus (+ zum Beenden, + zum Abbrechen).

```bash [BASH]
> .editor
// Entering editor mode (^D to finish, ^C to cancel)
function welcome(name) {
  return `Hello ${name}!`;
}

welcome('Node.js User');

// ^D
'Hello Node.js User!'
>
```
Die folgenden Tastenkombinationen in der REPL haben diese speziellen Effekte:

- +: Einmaliges Drücken hat die gleiche Wirkung wie der Befehl `.break`. Zweimaliges Drücken in einer leeren Zeile hat die gleiche Wirkung wie der Befehl `.exit`.
- +: Hat die gleiche Wirkung wie der Befehl `.exit`.
- : Wenn in einer leeren Zeile gedrückt wird, werden globale und lokale (Scope-)Variablen angezeigt. Wenn während der Eingabe anderer Eingaben gedrückt wird, werden relevante Autovervollständigungsoptionen angezeigt.

Informationen zu Tastenbelegungen im Zusammenhang mit der Reverse-I-Search finden Sie unter [`reverse-i-search`](/de/nodejs/api/repl#reverse-i-search). Alle anderen Tastenbelegungen finden Sie unter [TTY-Tastenbelegungen](/de/nodejs/api/readline#tty-keybindings).


### Standardauswertung {#default-evaluation}

Standardmäßig verwenden alle Instanzen von [`repl.REPLServer`](/de/nodejs/api/repl#class-replserver) eine Auswertungsfunktion, die JavaScript-Ausdrücke auswertet und Zugriff auf die integrierten Node.js-Module bietet. Dieses Standardverhalten kann überschrieben werden, indem eine alternative Auswertungsfunktion übergeben wird, wenn die [`repl.REPLServer`](/de/nodejs/api/repl#class-replserver)-Instanz erstellt wird.

#### JavaScript-Ausdrücke {#javascript-expressions}

Der Standardauswerter unterstützt die direkte Auswertung von JavaScript-Ausdrücken:

```bash [BASH]
> 1 + 1
2
> const m = 2
undefined
> m + 1
3
```
Sofern nicht anders innerhalb von Blöcken oder Funktionen abgegrenzt, werden Variablen, die entweder implizit oder mit den Schlüsselwörtern `const`, `let` oder `var` deklariert werden, im globalen Gültigkeitsbereich deklariert.

#### Globaler und lokaler Gültigkeitsbereich {#global-and-local-scope}

Der Standardauswerter bietet Zugriff auf alle Variablen, die im globalen Gültigkeitsbereich vorhanden sind. Es ist möglich, eine Variable explizit dem REPL zugänglich zu machen, indem sie dem `context`-Objekt zugewiesen wird, das jedem `REPLServer` zugeordnet ist:

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

repl.start('> ').context.m = msg;
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

repl.start('> ').context.m = msg;
```
:::

Eigenschaften im `context`-Objekt erscheinen im REPL als lokal:

```bash [BASH]
$ node repl_test.js
> m
'message'
```
Kontexteigenschaften sind standardmäßig nicht schreibgeschützt. Um schreibgeschützte globale Variablen anzugeben, müssen Kontexteigenschaften mit `Object.defineProperty()` definiert werden:

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```
:::

#### Zugriff auf Core-Node.js-Module {#accessing-core-nodejs-modules}

Der Standardauswerter lädt automatisch Core-Node.js-Module in die REPL-Umgebung, wenn diese verwendet wird. So wird beispielsweise die Eingabe `fs` bei Bedarf als `global.fs = require('node:fs')` ausgewertet, sofern sie nicht anders als globale oder bereichsbezogene Variable deklariert wurde.

```bash [BASH]
> fs.createReadStream('./some/file');
```

#### Globale unbehandelte Ausnahmen {#global-uncaught-exceptions}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v12.3.0 | Das `'uncaughtException'`-Ereignis wird von nun an ausgelöst, wenn die REPL als eigenständiges Programm verwendet wird. |
:::

Die REPL verwendet das [`domain`](/de/nodejs/api/domain)-Modul, um alle unbehandelten Ausnahmen für diese REPL-Sitzung abzufangen.

Diese Verwendung des [`domain`](/de/nodejs/api/domain)-Moduls in der REPL hat folgende Nebenwirkungen:

-  Unbehandelte Ausnahmen emittieren das [`'uncaughtException'`](/de/nodejs/api/process#event-uncaughtexception)-Ereignis nur in der eigenständigen REPL. Das Hinzufügen eines Listeners für dieses Ereignis in einer REPL innerhalb eines anderen Node.js-Programms führt zu [`ERR_INVALID_REPL_INPUT`](/de/nodejs/api/errors#err_invalid_repl_input).
-  Der Versuch, [`process.setUncaughtExceptionCaptureCallback()`](/de/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) zu verwenden, löst einen [`ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE`](/de/nodejs/api/errors#err_domain_cannot_set_uncaught_exception_capture)-Fehler aus.

#### Zuweisung der Variable `_` (Unterstrich) {#assignment-of-the-_-underscore-variable}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v9.8.0 | `_error`-Unterstützung hinzugefügt. |
:::

Der Standard-Evaluator weist standardmäßig das Ergebnis des zuletzt ausgewerteten Ausdrucks der speziellen Variable `_` (Unterstrich) zu. Das explizite Setzen von `_` auf einen Wert deaktiviert dieses Verhalten.

```bash [BASH]
> [ 'a', 'b', 'c' ]
[ 'a', 'b', 'c' ]
> _.length
3
> _ += 1
Die Ausdruckszuweisung zu _ ist jetzt deaktiviert.
4
> 1 + 1
2
> _
4
```
In ähnlicher Weise verweist `_error` auf den zuletzt aufgetretenen Fehler, falls vorhanden. Das explizite Setzen von `_error` auf einen Wert deaktiviert dieses Verhalten.

```bash [BASH]
> throw new Error('foo');
Uncaught Error: foo
> _error.message
'foo'
```
#### `await`-Schlüsselwort {#await-keyword}

Die Unterstützung für das `await`-Schlüsselwort ist auf der obersten Ebene aktiviert.

```bash [BASH]
> await Promise.resolve(123)
123
> await Promise.reject(new Error('REPL await'))
Uncaught Error: REPL await
    at REPL2:1:54
> const timeout = util.promisify(setTimeout);
undefined
> const old = Date.now(); await timeout(1000); console.log(Date.now() - old);
1002
undefined
```
Eine bekannte Einschränkung bei der Verwendung des `await`-Schlüsselworts in der REPL besteht darin, dass es den lexikalischen Gültigkeitsbereich der `const`- und `let`-Schlüsselwörter ungültig macht.

Zum Beispiel:

```bash [BASH]
> const m = await Promise.resolve(123)
undefined
> m
123
> const m = await Promise.resolve(234)
undefined
> m
234
```
[`--no-experimental-repl-await`](/de/nodejs/api/cli#--no-experimental-repl-await) deaktiviert Top-Level Await in der REPL.


### Reverse-i-search {#reverse-i-search}

**Hinzugefügt in: v13.6.0, v12.17.0**

Der REPL unterstützt die bidirektionale Reverse-i-Search ähnlich wie [ZSH](https://en.wikipedia.org/wiki/Z_shell). Sie wird mit + ausgelöst, um rückwärts zu suchen, und mit +, um vorwärts zu suchen.

Doppelte Einträge im Verlauf werden übersprungen.

Einträge werden akzeptiert, sobald eine Taste gedrückt wird, die nicht der Reverse-Suche entspricht. Das Abbrechen ist durch Drücken von  oder + möglich.

Das Ändern der Richtung sucht sofort nach dem nächsten Eintrag in der erwarteten Richtung von der aktuellen Position aus.

### Benutzerdefinierte Auswertungsfunktionen {#custom-evaluation-functions}

Wenn ein neuer [`repl.REPLServer`](/de/nodejs/api/repl#class-replserver) erstellt wird, kann eine benutzerdefinierte Auswertungsfunktion bereitgestellt werden. Dies kann beispielsweise verwendet werden, um vollständig angepasste REPL-Anwendungen zu implementieren.

Das Folgende veranschaulicht ein Beispiel für einen REPL, der eine gegebene Zahl quadriert:

::: code-group
```js [ESM]
import repl from 'node:repl';

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Geben Sie eine Zahl ein: ', eval: myEval });
```

```js [CJS]
const repl = require('node:repl');

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Geben Sie eine Zahl ein: ', eval: myEval });
```
:::

#### Wiederherstellbare Fehler {#recoverable-errors}

An der REPL-Eingabeaufforderung sendet das Drücken von  die aktuelle Eingabezeile an die `eval`-Funktion. Um die mehrzeilige Eingabe zu unterstützen, kann die `eval`-Funktion eine Instanz von `repl.Recoverable` an die bereitgestellte Callback-Funktion zurückgeben:

```js [ESM]
function myEval(cmd, context, filename, callback) {
  let result;
  try {
    result = vm.runInThisContext(cmd);
  } catch (e) {
    if (isRecoverableError(e)) {
      return callback(new repl.Recoverable(e));
    }
  }
  callback(null, result);
}

function isRecoverableError(error) {
  if (error.name === 'SyntaxError') {
    return /^(Unexpected end of input|Unexpected token)/.test(error.message);
  }
  return false;
}
```

### Anpassen der REPL-Ausgabe {#customizing-repl-output}

Standardmäßig formatieren [`repl.REPLServer`](/de/nodejs/api/repl#class-replserver)-Instanzen die Ausgabe mit der [`util.inspect()`](/de/nodejs/api/util#utilinspectobject-options)-Methode, bevor sie die Ausgabe in den bereitgestellten `Writable`-Stream schreiben (standardmäßig `process.stdout`). Die Inspektionsoption `showProxy` ist standardmäßig auf true gesetzt und die Option `colors` ist abhängig von der REPL-Option `useColors` auf true gesetzt.

Die boolesche Option `useColors` kann bei der Erstellung angegeben werden, um den Standard-Writer anzuweisen, ANSI-Style-Codes zu verwenden, um die Ausgabe der `util.inspect()`-Methode zu kolorieren.

Wenn die REPL als eigenständiges Programm ausgeführt wird, ist es auch möglich, die [Inspektionsstandardwerte](/de/nodejs/api/util#utilinspectobject-options) der REPL innerhalb der REPL zu ändern, indem die Eigenschaft `inspect.replDefaults` verwendet wird, die die `defaultOptions` von [`util.inspect()`](/de/nodejs/api/util#utilinspectobject-options) widerspiegelt.

```bash [BASH]
> util.inspect.replDefaults.compact = false;
false
> [1]
[
  1
]
>
```
Um die Ausgabe einer [`repl.REPLServer`](/de/nodejs/api/repl#class-replserver)-Instanz vollständig anzupassen, übergeben Sie eine neue Funktion für die `writer`-Option bei der Erstellung. Das folgende Beispiel konvertiert beispielsweise einfach jeden eingegebenen Text in Großbuchstaben:

::: code-group
```js [ESM]
import repl from 'node:repl';

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```

```js [CJS]
const repl = require('node:repl');

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```
:::

## Klasse: `REPLServer` {#class-replserver}

**Hinzugefügt in: v0.1.91**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [`repl.start()`](/de/nodejs/api/repl#replstartoptions)
- Erweitert: [\<readline.Interface\>](/de/nodejs/api/readline#class-readlineinterface)

Instanzen von `repl.REPLServer` werden mit der [`repl.start()`](/de/nodejs/api/repl#replstartoptions)-Methode oder direkt mit dem JavaScript-Schlüsselwort `new` erstellt.

::: code-group
```js [ESM]
import repl from 'node:repl';

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```

```js [CJS]
const repl = require('node:repl');

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```
:::


### Event: `'exit'` {#event-exit}

**Hinzugefügt in: v0.7.7**

Das `'exit'`-Ereignis wird ausgelöst, wenn die REPL beendet wird, entweder durch Empfangen des Befehls `.exit` als Eingabe, durch Drücken von + zweimal, um `SIGINT` zu signalisieren, oder durch Drücken von +, um `'end'` im Eingabestream zu signalisieren. Der Listener-Callback wird ohne Argumente aufgerufen.

```js [ESM]
replServer.on('exit', () => {
  console.log('Empfing "exit"-Ereignis von repl!');
  process.exit();
});
```
### Event: `'reset'` {#event-reset}

**Hinzugefügt in: v0.11.0**

Das `'reset'`-Ereignis wird ausgelöst, wenn der Kontext der REPL zurückgesetzt wird. Dies tritt immer dann auf, wenn der Befehl `.clear` als Eingabe empfangen wird, *es sei denn*, die REPL verwendet den Standard-Evaluator und die `repl.REPLServer`-Instanz wurde mit der auf `true` gesetzten Option `useGlobal` erstellt. Der Listener-Callback wird mit einer Referenz auf das `context`-Objekt als einzigem Argument aufgerufen.

Dies kann in erster Linie verwendet werden, um den REPL-Kontext auf einen vordefinierten Zustand zurückzusetzen:

::: code-group
```js [ESM]
import repl from 'node:repl';

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```

```js [CJS]
const repl = require('node:repl');

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```
:::

Wenn dieser Code ausgeführt wird, kann die globale Variable `'m'` geändert, aber dann mit dem Befehl `.clear` auf ihren Anfangswert zurückgesetzt werden:

```bash [BASH]
$ ./node example.js
> m
'test'
> m = 1
1
> m
1
> .clear
Clearing context...
> m
'test'
>
```
### `replServer.defineCommand(keyword, cmd)` {#replserverdefinecommandkeyword-cmd}

**Hinzugefügt in: v0.3.0**

- `keyword` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Das Befehlsschlüsselwort (*ohne* ein vorangestelltes `.`-Zeichen).
- `cmd` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Funktion, die aufgerufen wird, wenn der Befehl verarbeitet wird.

Die Methode `replServer.defineCommand()` wird verwendet, um der REPL-Instanz neue `.`-präfixierte Befehle hinzuzufügen. Solche Befehle werden aufgerufen, indem ein `.` gefolgt vom `keyword` eingegeben wird. Das `cmd` ist entweder eine `Function` oder ein `Object` mit den folgenden Eigenschaften:

- `help` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Hilfetext, der angezeigt werden soll, wenn `.help` eingegeben wird (Optional).
- `action` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die auszuführende Funktion, die optional ein einzelnes String-Argument akzeptiert.

Das folgende Beispiel zeigt zwei neue Befehle, die der REPL-Instanz hinzugefügt wurden:

::: code-group
```js [ESM]
import repl from 'node:repl';

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```

```js [CJS]
const repl = require('node:repl');

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```
:::

Die neuen Befehle können dann innerhalb der REPL-Instanz verwendet werden:

```bash [BASH]
> .sayhello Node.js User
Hello, Node.js User!
> .saybye
Goodbye!
```

### `replServer.displayPrompt([preserveCursor])` {#replserverdisplaypromptpreservecursor}

**Hinzugefügt in: v0.1.91**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Methode `replServer.displayPrompt()` bereitet die REPL-Instanz für die Eingabe des Benutzers vor, indem sie die konfigurierte `prompt` in einer neuen Zeile in die `output` druckt und die `input` fortsetzt, um neue Eingaben zu akzeptieren.

Wenn mehrzeilige Eingaben eingegeben werden, wird anstelle des 'prompt' eine Ellipse gedruckt.

Wenn `preserveCursor` `true` ist, wird die Cursorposition nicht auf `0` zurückgesetzt.

Die Methode `replServer.displayPrompt` ist primär dafür gedacht, innerhalb der Aktionsfunktion für Befehle aufgerufen zu werden, die mit der Methode `replServer.defineCommand()` registriert wurden.

### `replServer.clearBufferedCommand()` {#replserverclearbufferedcommand}

**Hinzugefügt in: v9.0.0**

Die Methode `replServer.clearBufferedCommand()` löscht alle Befehle, die gepuffert, aber noch nicht ausgeführt wurden. Diese Methode ist primär dafür gedacht, innerhalb der Aktionsfunktion für Befehle aufgerufen zu werden, die mit der Methode `replServer.defineCommand()` registriert wurden.

### `replServer.setupHistory(historyPath, callback)` {#replserversetuphistoryhistorypath-callback}

**Hinzugefügt in: v11.10.0**

- `historyPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Pfad zur Verlaufsdatei
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) wird aufgerufen, wenn Verlaufs-Schreibvorgänge bereit sind oder bei einem Fehler.
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `repl` [\<repl.REPLServer\>](/de/nodejs/api/repl#class-replserver)
  
 

Initialisiert eine Protokolldatei für den Verlauf für die REPL-Instanz. Bei der Ausführung des Node.js-Binärprogramms und der Verwendung der Befehlszeilen-REPL wird standardmäßig eine Verlaufsdatei initialisiert. Dies ist jedoch nicht der Fall, wenn eine REPL programmatisch erstellt wird. Verwenden Sie diese Methode, um eine Protokolldatei für den Verlauf zu initialisieren, wenn Sie programmatisch mit REPL-Instanzen arbeiten.

## `repl.builtinModules` {#replbuiltinmodules}

**Hinzugefügt in: v14.5.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Eine Liste der Namen aller Node.js-Module, z. B. `'http'`.


## `repl.start([options])` {#replstartoptions}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.4.0, v12.17.0 | Die Option `preview` ist jetzt verfügbar. |
| v12.0.0 | Die Option `terminal` folgt jetzt in allen Fällen der Standardbeschreibung und `useColors` überprüft `hasColors()`, falls verfügbar. |
| v10.0.0 | Der `REPL_MAGIC_MODE` `replMode` wurde entfernt. |
| v6.3.0 | Die Option `breakEvalOnSigint` wird jetzt unterstützt. |
| v5.8.0 | Der Parameter `options` ist jetzt optional. |
| v0.1.91 | Hinzugefügt in: v0.1.91 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Eingabeaufforderung, die angezeigt werden soll. **Standard:** `'\> '` (mit einem nachgestellten Leerzeichen).
    - `input` [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable) Der `Readable`-Stream, aus dem die REPL-Eingabe gelesen wird. **Standard:** `process.stdin`.
    - `output` [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable) Der `Writable`-Stream, in den die REPL-Ausgabe geschrieben wird. **Standard:** `process.stdout`.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, gibt an, dass die `output` als TTY-Terminal behandelt werden soll. **Standard:** Überprüfen des Werts der Eigenschaft `isTTY` auf dem `output`-Stream bei der Instanziierung.
    - `eval` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Funktion, die verwendet werden soll, wenn jede gegebene Eingabezeile ausgewertet wird. **Standard:** ein asynchroner Wrapper für die JavaScript `eval()`-Funktion. Eine `eval`-Funktion kann mit `repl.Recoverable` einen Fehler ausgeben, um anzuzeigen, dass die Eingabe unvollständig war und zusätzliche Zeilen angefordert werden müssen.
    - `useColors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, gibt an, dass die Standardfunktion `writer` ANSI-Farbformatierungen in die REPL-Ausgabe aufnehmen soll. Wenn eine benutzerdefinierte Funktion `writer` bereitgestellt wird, hat dies keine Auswirkung. **Standard:** Überprüfen der Farbuntersützung auf dem `output`-Stream, wenn der `terminal`-Wert der REPL-Instanz `true` ist.
    - `useGlobal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, gibt an, dass die Standardauswertungsfunktion das JavaScript `global` als Kontext verwendet, anstatt einen neuen separaten Kontext für die REPL-Instanz zu erstellen. Die Node-CLI-REPL setzt diesen Wert auf `true`. **Standard:** `false`.
    - `ignoreUndefined` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, gibt an, dass der Standard-Writer den Rückgabewert eines Befehls nicht ausgibt, wenn er zu `undefined` ausgewertet wird. **Standard:** `false`.
    - `writer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Funktion, die aufgerufen wird, um die Ausgabe jedes Befehls zu formatieren, bevor sie in `output` geschrieben wird. **Standard:** [`util.inspect()`](/de/nodejs/api/util#utilinspectobject-options).
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine optionale Funktion, die für die benutzerdefinierte automatische Tab-Vervollständigung verwendet wird. Siehe [`readline.InterfaceCompleter`](/de/nodejs/api/readline#use-of-the-completer-function) für ein Beispiel.
    - `replMode` [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Ein Flag, das angibt, ob der Standardauswerter alle JavaScript-Befehle im strikten Modus oder im Standardmodus (sloppy) ausführt. Akzeptable Werte sind:
        - `repl.REPL_MODE_SLOPPY`, um Ausdrücke im Sloppy-Modus auszuwerten.
        - `repl.REPL_MODE_STRICT`, um Ausdrücke im Strict-Modus auszuwerten. Dies entspricht dem Voranstellen jeder REPL-Anweisung mit `'use strict'`.

    - `breakEvalOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Stoppt die Auswertung des aktuellen Codeabschnitts, wenn `SIGINT` empfangen wird, z. B. wenn + gedrückt wird. Dies kann nicht zusammen mit einer benutzerdefinierten `eval`-Funktion verwendet werden. **Standard:** `false`.
    - `preview` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Definiert, ob die REPL Autovervollständigungen und Ausgabevorschauen ausgibt oder nicht. **Standard:** `true` mit der Standard-Eval-Funktion und `false`, falls eine benutzerdefinierte Eval-Funktion verwendet wird. Wenn `terminal` falsch ist, gibt es keine Vorschauen und der Wert von `preview` hat keine Auswirkung.

- Gibt zurück: [\<repl.REPLServer\>](/de/nodejs/api/repl#class-replserver)

Die Methode `repl.start()` erstellt und startet eine [`repl.REPLServer`](/de/nodejs/api/repl#class-replserver)-Instanz.

Wenn `options` eine Zeichenkette ist, gibt sie die Eingabeaufforderung an:

::: code-group
```js [ESM]
import repl from 'node:repl';

// eine Unix-artige Eingabeaufforderung
repl.start('$ ');
```

```js [CJS]
const repl = require('node:repl');

// eine Unix-artige Eingabeaufforderung
repl.start('$ ');
```
:::


## Die Node.js REPL {#the-nodejs-repl}

Node.js selbst verwendet das Modul `node:repl`, um seine eigene interaktive Schnittstelle zur Ausführung von JavaScript bereitzustellen. Dies kann durch Ausführen der Node.js-Binärdatei ohne Übergabe von Argumenten (oder durch Übergabe des Arguments `-i`) verwendet werden:

```bash [BASH]
$ node
> const a = [1, 2, 3];
undefined
> a
[ 1, 2, 3 ]
> a.forEach((v) => {
...   console.log(v);
...   });
1
2
3
```
### Umgebungsvariablen-Optionen {#environment-variable-options}

Verschiedene Verhaltensweisen der Node.js REPL können mithilfe der folgenden Umgebungsvariablen angepasst werden:

- `NODE_REPL_HISTORY`: Wenn ein gültiger Pfad angegeben wird, wird der persistente REPL-Verlauf in der angegebenen Datei und nicht in `.node_repl_history` im Home-Verzeichnis des Benutzers gespeichert. Wenn dieser Wert auf `''` (eine leere Zeichenfolge) gesetzt wird, wird der persistente REPL-Verlauf deaktiviert. Leerzeichen werden aus dem Wert entfernt. Unter Windows-Plattformen sind Umgebungsvariablen mit leeren Werten ungültig. Setzen Sie diese Variable daher auf ein oder mehrere Leerzeichen, um den persistenten REPL-Verlauf zu deaktivieren.
- `NODE_REPL_HISTORY_SIZE`: Steuert, wie viele Zeilen des Verlaufs gespeichert werden, wenn ein Verlauf verfügbar ist. Muss eine positive Zahl sein. **Standard:** `1000`.
- `NODE_REPL_MODE`: Kann entweder `'sloppy'` oder `'strict'` sein. **Standard:** `'sloppy'`, wodurch die Ausführung von Code im Nicht-Strict-Modus ermöglicht wird.

### Persistenter Verlauf {#persistent-history}

Standardmäßig speichert die Node.js REPL den Verlauf zwischen `node`-REPL-Sitzungen, indem sie Eingaben in einer `.node_repl_history`-Datei im Home-Verzeichnis des Benutzers speichert. Dies kann deaktiviert werden, indem die Umgebungsvariable `NODE_REPL_HISTORY=''` gesetzt wird.

### Verwenden der Node.js REPL mit erweiterten Zeilen-Editoren {#using-the-nodejs-repl-with-advanced-line-editors}

Für erweiterte Zeilen-Editoren starten Sie Node.js mit der Umgebungsvariable `NODE_NO_READLINE=1`. Dadurch werden die Haupt- und Debugger-REPL in kanonischen Terminaleinstellungen gestartet, was die Verwendung mit `rlwrap` ermöglicht.

Zum Beispiel kann Folgendes zu einer `.bashrc`-Datei hinzugefügt werden:

```bash [BASH]
alias node="env NODE_NO_READLINE=1 rlwrap node"
```
### Starten mehrerer REPL-Instanzen gegen eine einzelne laufende Instanz {#starting-multiple-repl-instances-against-a-single-running-instance}

Es ist möglich, mehrere REPL-Instanzen gegen eine einzelne laufende Instanz von Node.js zu erstellen und auszuführen, die ein einzelnes `global`-Objekt gemeinsam nutzen, aber separate I/O-Schnittstellen haben.

Das folgende Beispiel stellt beispielsweise separate REPLs über `stdin`, einen Unix-Socket und einen TCP-Socket bereit:

::: code-group
```js [ESM]
import net from 'node:net';
import repl from 'node:repl';
import process from 'node:process';

let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```

```js [CJS]
const net = require('node:net');
const repl = require('node:repl');
let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```
:::

Das Ausführen dieser Anwendung über die Befehlszeile startet eine REPL über stdin. Andere REPL-Clients können sich über den Unix-Socket oder den TCP-Socket verbinden. `telnet` ist beispielsweise nützlich, um sich mit TCP-Sockets zu verbinden, während `socat` verwendet werden kann, um sich sowohl mit Unix- als auch mit TCP-Sockets zu verbinden.

Durch das Starten einer REPL von einem Unix-Socket-basierten Server anstelle von stdin ist es möglich, sich mit einem lang laufenden Node.js-Prozess zu verbinden, ohne ihn neu zu starten.

Ein Beispiel für das Ausführen einer "vollwertigen" (`terminal`) REPL über eine `net.Server`- und `net.Socket`-Instanz finden Sie unter: [https://gist.github.com/TooTallNate/2209310](https://gist.github.com/TooTallNate/2209310).

Ein Beispiel für das Ausführen einer REPL-Instanz über [`curl(1)`](https://curl.haxx.se/docs/manpage) finden Sie unter: [https://gist.github.com/TooTallNate/2053342](https://gist.github.com/TooTallNate/2053342).

Dieses Beispiel dient ausschließlich zu Bildungszwecken, um zu demonstrieren, wie Node.js-REPLs mit verschiedenen I/O-Streams gestartet werden können. Es sollte **nicht** in Produktionsumgebungen oder in einem Kontext verwendet werden, in dem Sicherheit ein Problem ist, ohne zusätzliche Schutzmaßnahmen. Wenn Sie REPLs in einer realen Anwendung implementieren müssen, sollten Sie alternative Ansätze in Betracht ziehen, die diese Risiken mindern, z. B. die Verwendung sicherer Eingabemechanismen und die Vermeidung offener Netzwerkschnittstellen.

