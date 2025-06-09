---
title: Node.js Dokumentation - Readline
description: Das readline-Modul von Node.js bietet eine Schnittstelle zum Lesen von Daten aus einem lesbaren Stream (wie process.stdin) Zeile für Zeile. Es unterstützt die Erstellung von Schnittstellen zum Lesen von Eingaben aus der Konsole, die Verarbeitung von Benutzereingaben und das Management von Zeilenoperationen.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Readline | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das readline-Modul von Node.js bietet eine Schnittstelle zum Lesen von Daten aus einem lesbaren Stream (wie process.stdin) Zeile für Zeile. Es unterstützt die Erstellung von Schnittstellen zum Lesen von Eingaben aus der Konsole, die Verarbeitung von Benutzereingaben und das Management von Zeilenoperationen.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Readline | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das readline-Modul von Node.js bietet eine Schnittstelle zum Lesen von Daten aus einem lesbaren Stream (wie process.stdin) Zeile für Zeile. Es unterstützt die Erstellung von Schnittstellen zum Lesen von Eingaben aus der Konsole, die Verarbeitung von Benutzereingaben und das Management von Zeilenoperationen.
---


# Readline {#readline}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/readline.js](https://github.com/nodejs/node/blob/v23.5.0/lib/readline.js)

Das `node:readline`-Modul bietet eine Schnittstelle zum zeilenweisen Lesen von Daten aus einem [Readable](/de/nodejs/api/stream#readable-streams)-Stream (wie z. B. [`process.stdin`](/de/nodejs/api/process#processstdin)).

Um die Promise-basierten APIs zu verwenden:

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
```

```js [CJS]
const readline = require('node:readline/promises');
```
:::

Um die Callback- und Sync-APIs zu verwenden:

::: code-group
```js [ESM]
import * as readline from 'node:readline';
```

```js [CJS]
const readline = require('node:readline');
```
:::

Das folgende einfache Beispiel veranschaulicht die grundlegende Verwendung des `node:readline`-Moduls.

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const answer = await rl.question('Was halten Sie von Node.js? ');

console.log(`Vielen Dank für Ihr wertvolles Feedback: ${answer}`);

rl.close();
```

```js [CJS]
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('Was halten Sie von Node.js? ', (answer) => {
  // TODO: Die Antwort in einer Datenbank protokollieren
  console.log(`Vielen Dank für Ihr wertvolles Feedback: ${answer}`);

  rl.close();
});
```
:::

Sobald dieser Code aufgerufen wird, wird die Node.js-Anwendung erst beendet, wenn die `readline.Interface` geschlossen wird, da die Schnittstelle darauf wartet, dass Daten im `input`-Stream empfangen werden.

## Klasse: `InterfaceConstructor` {#class-interfaceconstructor}

**Hinzugefügt in: v0.1.104**

- Erweitert: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Instanzen der Klasse `InterfaceConstructor` werden mit der Methode `readlinePromises.createInterface()` oder `readline.createInterface()` erstellt. Jede Instanz ist mit einem einzelnen `input` [Readable](/de/nodejs/api/stream#readable-streams)-Stream und einem einzelnen `output` [Writable](/de/nodejs/api/stream#writable-streams)-Stream verbunden. Der `output`-Stream wird verwendet, um Eingabeaufforderungen für Benutzereingaben auszugeben, die im `input`-Stream eingehen und aus diesem gelesen werden.


### Event: `'close'` {#event-close}

**Hinzugefügt in: v0.1.98**

Das `'close'`-Event wird ausgelöst, wenn eine der folgenden Bedingungen eintritt:

- Die Methode `rl.close()` wird aufgerufen und die `InterfaceConstructor`-Instanz hat die Kontrolle über die `input`- und `output`-Streams abgegeben;
- Der `input`-Stream empfängt sein `'end'`-Event;
- Der `input`-Stream empfängt +, um das Ende der Übertragung (EOT) zu signalisieren;
- Der `input`-Stream empfängt +, um `SIGINT` zu signalisieren, und es ist kein `'SIGINT'`-Event-Listener auf der `InterfaceConstructor`-Instanz registriert.

Die Listener-Funktion wird aufgerufen, ohne Argumente zu übergeben.

Die `InterfaceConstructor`-Instanz ist beendet, sobald das `'close'`-Event ausgelöst wird.

### Event: `'line'` {#event-line}

**Hinzugefügt in: v0.1.98**

Das `'line'`-Event wird immer dann ausgelöst, wenn der `input`-Stream eine Zeilenende-Eingabe empfängt (`\n`, `\r` oder `\r\n`). Dies geschieht normalerweise, wenn der Benutzer  oder  drückt.

Das `'line'`-Event wird auch ausgelöst, wenn neue Daten aus einem Stream gelesen wurden und dieser Stream ohne eine endgültige Zeilenende-Markierung endet.

Die Listener-Funktion wird mit einer Zeichenkette aufgerufen, die die einzelne Zeile der empfangenen Eingabe enthält.

```js [ESM]
rl.on('line', (input) => {
  console.log(`Received: ${input}`);
});
```
### Event: `'history'` {#event-history}

**Hinzugefügt in: v15.8.0, v14.18.0**

Das `'history'`-Event wird immer dann ausgelöst, wenn sich das History-Array geändert hat.

Die Listener-Funktion wird mit einem Array aufgerufen, das das History-Array enthält. Es spiegelt alle Änderungen wider, hinzugefügte Zeilen und entfernte Zeilen aufgrund von `historySize` und `removeHistoryDuplicates`.

Der Hauptzweck ist es, einem Listener zu ermöglichen, die History zu persistieren. Es ist auch möglich, dass der Listener das History-Objekt ändert. Dies könnte nützlich sein, um zu verhindern, dass bestimmte Zeilen wie ein Passwort zur History hinzugefügt werden.

```js [ESM]
rl.on('history', (history) => {
  console.log(`Received: ${history}`);
});
```
### Event: `'pause'` {#event-pause}

**Hinzugefügt in: v0.7.5**

Das `'pause'`-Event wird ausgelöst, wenn eine der folgenden Bedingungen eintritt:

- Der `input`-Stream wird pausiert.
- Der `input`-Stream ist nicht pausiert und empfängt das `'SIGCONT'`-Event. (Siehe Events [`'SIGTSTP'`](/de/nodejs/api/readline#event-sigtstp) und [`'SIGCONT'`](/de/nodejs/api/readline#event-sigcont).)

Die Listener-Funktion wird aufgerufen, ohne Argumente zu übergeben.

```js [ESM]
rl.on('pause', () => {
  console.log('Readline paused.');
});
```

### Ereignis: `'resume'` {#event-resume}

**Hinzugefügt in: v0.7.5**

Das `'resume'`-Ereignis wird ausgelöst, wenn der `input`-Stream fortgesetzt wird.

Die Listener-Funktion wird ohne Übergabe von Argumenten aufgerufen.

```js [ESM]
rl.on('resume', () => {
  console.log('Readline fortgesetzt.');
});
```
### Ereignis: `'SIGCONT'` {#event-sigcont}

**Hinzugefügt in: v0.7.5**

Das `'SIGCONT'`-Ereignis wird ausgelöst, wenn ein Node.js-Prozess, der zuvor mit + (d. h. `SIGTSTP`) in den Hintergrund verschoben wurde, dann mit [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p) wieder in den Vordergrund gebracht wird.

Wenn der `input`-Stream *vor* der `SIGTSTP`-Anfrage pausiert wurde, wird dieses Ereignis nicht ausgelöst.

Die Listener-Funktion wird ohne Übergabe von Argumenten aufgerufen.

```js [ESM]
rl.on('SIGCONT', () => {
  // `prompt` wird den Stream automatisch fortsetzen
  rl.prompt();
});
```
Das `'SIGCONT'`-Ereignis wird unter Windows *nicht* unterstützt.

### Ereignis: `'SIGINT'` {#event-sigint}

**Hinzugefügt in: v0.3.0**

Das `'SIGINT'`-Ereignis wird ausgelöst, wenn der `input`-Stream eine Eingabe empfängt, die typischerweise als `SIGINT` bekannt ist. Wenn keine `'SIGINT'`-Ereignis-Listener registriert sind, wenn der `input`-Stream ein `SIGINT` empfängt, wird das `'pause'`-Ereignis ausgelöst.

Die Listener-Funktion wird ohne Übergabe von Argumenten aufgerufen.

```js [ESM]
rl.on('SIGINT', () => {
  rl.question('Sind Sie sicher, dass Sie beenden möchten? ', (answer) => {
    if (answer.match(/^y(es)?$/i)) rl.pause();
  });
});
```
### Ereignis: `'SIGTSTP'` {#event-sigtstp}

**Hinzugefügt in: v0.7.5**

Das `'SIGTSTP'`-Ereignis wird ausgelöst, wenn der `input`-Stream eine + Eingabe empfängt, die typischerweise als `SIGTSTP` bekannt ist. Wenn keine `'SIGTSTP'`-Ereignis-Listener registriert sind, wenn der `input`-Stream ein `SIGTSTP` empfängt, wird der Node.js-Prozess in den Hintergrund geschickt.

Wenn das Programm mit [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p) fortgesetzt wird, werden die `'pause'`- und `'SIGCONT'`-Ereignisse ausgelöst. Diese können verwendet werden, um den `input`-Stream fortzusetzen.

Die `'pause'`- und `'SIGCONT'`-Ereignisse werden nicht ausgelöst, wenn der `input` pausiert wurde, bevor der Prozess in den Hintergrund geschickt wurde.

Die Listener-Funktion wird ohne Übergabe von Argumenten aufgerufen.

```js [ESM]
rl.on('SIGTSTP', () => {
  // Dies überschreibt SIGTSTP und verhindert, dass das Programm in den
  // Hintergrund geht.
  console.log('SIGTSTP abgefangen.');
});
```
Das `'SIGTSTP'`-Ereignis wird unter Windows *nicht* unterstützt.


### `rl.close()` {#rlclose}

**Hinzugefügt in: v0.1.98**

Die Methode `rl.close()` schließt die `InterfaceConstructor`-Instanz und gibt die Kontrolle über die `input`- und `output`-Streams ab. Beim Aufruf wird das `'close'`-Ereignis ausgelöst.

Der Aufruf von `rl.close()` verhindert nicht sofort, dass andere Ereignisse (einschließlich `'line'`) von der `InterfaceConstructor`-Instanz ausgelöst werden.

### `rl.pause()` {#rlpause}

**Hinzugefügt in: v0.3.4**

Die Methode `rl.pause()` pausiert den `input`-Stream und ermöglicht es, ihn später bei Bedarf fortzusetzen.

Der Aufruf von `rl.pause()` pausiert nicht sofort andere Ereignisse (einschließlich `'line'`), die von der `InterfaceConstructor`-Instanz ausgelöst werden.

### `rl.prompt([preserveCursor])` {#rlpromptpreservecursor}

**Hinzugefügt in: v0.1.98**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, verhindert, dass die Cursorposition auf `0` zurückgesetzt wird.

Die Methode `rl.prompt()` schreibt den konfigurierten `prompt` der `InterfaceConstructor`-Instanzen in eine neue Zeile in `output`, um dem Benutzer eine neue Stelle zur Eingabe zu bieten.

Beim Aufruf setzt `rl.prompt()` den `input`-Stream fort, falls er pausiert wurde.

Wenn der `InterfaceConstructor` mit `output` auf `null` oder `undefined` gesetzt wurde, wird die Eingabeaufforderung nicht geschrieben.

### `rl.resume()` {#rlresume}

**Hinzugefügt in: v0.3.4**

Die Methode `rl.resume()` setzt den `input`-Stream fort, falls er pausiert wurde.

### `rl.setPrompt(prompt)` {#rlsetpromptprompt}

**Hinzugefügt in: v0.1.98**

- `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `rl.setPrompt()` legt die Eingabeaufforderung fest, die bei jedem Aufruf von `rl.prompt()` in `output` geschrieben wird.

### `rl.getPrompt()` {#rlgetprompt}

**Hinzugefügt in: v15.3.0, v14.17.0**

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) die aktuelle Prompt-Zeichenkette

Die Methode `rl.getPrompt()` gibt den aktuellen Prompt zurück, der von `rl.prompt()` verwendet wird.

### `rl.write(data[, key])` {#rlwritedata-key}

**Hinzugefügt in: v0.1.98**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ctrl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, um die -Taste anzugeben.
    - `meta` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, um die -Taste anzugeben.
    - `shift` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, um die -Taste anzugeben.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Name einer Taste.

Die Methode `rl.write()` schreibt entweder `data` oder eine durch `key` identifizierte Tastenfolge in die `output`. Das `key`-Argument wird nur unterstützt, wenn `output` ein [TTY](/de/nodejs/api/tty)-Textterminal ist. Siehe [TTY-Tastenkombinationen](/de/nodejs/api/readline#tty-keybindings) für eine Liste von Tastenkombinationen.

Wenn `key` angegeben ist, wird `data` ignoriert.

Beim Aufruf setzt `rl.write()` den `input`-Stream fort, falls er pausiert wurde.

Wenn der `InterfaceConstructor` mit `output` auf `null` oder `undefined` gesetzt wurde, werden `data` und `key` nicht geschrieben.

```js [ESM]
rl.write('Delete this!');
// Simulate Ctrl+U to delete the line written previously
rl.write(null, { ctrl: true, name: 'u' });
```
Die Methode `rl.write()` schreibt die Daten in den `input` des `readline`-`Interface`, *als ob sie vom Benutzer bereitgestellt würden*.


### `rl[Symbol.asyncIterator]()` {#rlsymbolasynciterator}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v11.14.0, v10.17.0 | Die Unterstützung von Symbol.asyncIterator ist nicht mehr experimentell. |
| v11.4.0, v10.16.0 | Hinzugefügt in: v11.4.0, v10.16.0 |
:::

- Gibt zurück: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)

Erstellt ein `AsyncIterator`-Objekt, das jede Zeile im Eingabestream als Zeichenkette durchläuft. Diese Methode ermöglicht die asynchrone Iteration von `InterfaceConstructor`-Objekten durch `for await...of`-Schleifen.

Fehler im Eingabestream werden nicht weitergeleitet.

Wenn die Schleife mit `break`, `throw` oder `return` beendet wird, wird [`rl.close()`](/de/nodejs/api/readline#rlclose) aufgerufen. Mit anderen Worten, das Iterieren über einen `InterfaceConstructor` verbraucht immer den Eingabestream vollständig.

Die Leistung ist nicht mit der traditionellen `'line'`-Event-API vergleichbar. Verwenden Sie stattdessen `'line'` für leistungssensible Anwendungen.

```js [ESM]
async function processLineByLine() {
  const rl = readline.createInterface({
    // ...
  });

  for await (const line of rl) {
    // Jede Zeile in der Readline-Eingabe wird hier sukzessive als
    // `line` verfügbar sein.
  }
}
```
`readline.createInterface()` beginnt mit dem Verarbeiten des Eingabestreams, sobald es aufgerufen wird. Asynchrone Operationen zwischen der Erstellung der Schnittstelle und der asynchronen Iteration können dazu führen, dass Zeilen verpasst werden.

### `rl.line` {#rlline}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.8.0, v14.18.0 | Der Wert ist immer eine Zeichenkette, niemals undefiniert. |
| v0.1.98 | Hinzugefügt in: v0.1.98 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die aktuellen Eingabedaten, die von Node verarbeitet werden.

Dies kann verwendet werden, wenn die Eingabe von einem TTY-Stream erfasst wird, um den aktuellen Wert abzurufen, der bisher verarbeitet wurde, bevor das `line`-Event ausgelöst wird. Sobald das `line`-Event ausgelöst wurde, ist diese Eigenschaft eine leere Zeichenkette.

Beachten Sie, dass die Änderung des Werts während der Instanzlaufzeit unbeabsichtigte Folgen haben kann, wenn `rl.cursor` nicht ebenfalls gesteuert wird.

**Wenn Sie keinen TTY-Stream für die Eingabe verwenden, nutzen Sie das <a href="#event-line"><code>'line'</code></a>-Event.**

Ein möglicher Anwendungsfall wäre wie folgt:

```js [ESM]
const values = ['lorem ipsum', 'dolor sit amet'];
const rl = readline.createInterface(process.stdin);
const showResults = debounce(() => {
  console.log(
    '\n',
    values.filter((val) => val.startsWith(rl.line)).join(' '),
  );
}, 300);
process.stdin.on('keypress', (c, k) => {
  showResults();
});
```

### `rl.cursor` {#rlcursor}

**Hinzugefügt in: v0.1.98**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Die Cursorposition relativ zu `rl.line`.

Dies verfolgt, wo der aktuelle Cursor in der Eingabezeichenkette landet, wenn die Eingabe von einem TTY-Stream gelesen wird. Die Cursorposition bestimmt den Teil der Eingabezeichenkette, der bei der Verarbeitung der Eingabe geändert wird, sowie die Spalte, in der die Terminalcaret gerendert wird.

### `rl.getCursorPos()` {#rlgetcursorpos}

**Hinzugefügt in: v13.5.0, v12.16.0**

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `rows` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Zeile der Eingabeaufforderung, auf der sich der Cursor gerade befindet.
    - `cols` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Bildschirmspalte, auf der sich der Cursor gerade befindet.
  
 

Gibt die tatsächliche Position des Cursors in Bezug auf die Eingabeaufforderung + Zeichenkette zurück. Lange Eingabezeichenketten (Umbruch) sowie mehrzeilige Eingabeaufforderungen sind in den Berechnungen enthalten.

## Promises API {#promises-api}

**Hinzugefügt in: v17.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

### Klasse: `readlinePromises.Interface` {#class-readlinepromisesinterface}

**Hinzugefügt in: v17.0.0**

- Erweitert: [\<readline.InterfaceConstructor\>](/de/nodejs/api/readline#class-interfaceconstructor)

Instanzen der Klasse `readlinePromises.Interface` werden mit der Methode `readlinePromises.createInterface()` erstellt. Jede Instanz ist einem einzelnen `input` [Readable](/de/nodejs/api/stream#readable-streams)-Stream und einem einzelnen `output` [Writable](/de/nodejs/api/stream#writable-streams)-Stream zugeordnet. Der `output`-Stream wird verwendet, um Eingabeaufforderungen für Benutzereingaben auszugeben, die im `input`-Stream eingehen und von ihm gelesen werden.


#### `rl.question(query[, options])` {#rlquestionquery-options}

**Hinzugefügt in: v17.0.0**

- `query` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine Anweisung oder Abfrage, die in `output` geschrieben und dem Prompt vorangestellt wird.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht optional das Abbrechen von `question()` mithilfe eines `AbortSignal`.


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Ein Promise, das mit der Benutzereingabe als Antwort auf die `query` erfüllt wird.

Die Methode `rl.question()` zeigt die `query` an, indem sie in `output` geschrieben wird, wartet auf die Eingabe des Benutzers in `input` und ruft dann die `callback`-Funktion auf, wobei die bereitgestellte Eingabe als erstes Argument übergeben wird.

Beim Aufruf setzt `rl.question()` den `input`-Stream fort, falls er pausiert wurde.

Wenn `readlinePromises.Interface` mit `output` auf `null` oder `undefined` gesetzt wurde, wird die `query` nicht geschrieben.

Wenn die Frage nach `rl.close()` aufgerufen wird, wird ein abgewiesenes Promise zurückgegeben.

Beispiel für die Verwendung:

```js [ESM]
const answer = await rl.question('Was ist dein Lieblingsessen? ');
console.log(`Ach so, dein Lieblingsessen ist ${answer}`);
```
Verwenden eines `AbortSignal` zum Abbrechen einer Frage.

```js [ESM]
const signal = AbortSignal.timeout(10_000);

signal.addEventListener('abort', () => {
  console.log('Die Essensfrage hat das Zeitlimit überschritten');
}, { once: true });

const answer = await rl.question('Was ist dein Lieblingsessen? ', { signal });
console.log(`Ach so, dein Lieblingsessen ist ${answer}`);
```
### Klasse: `readlinePromises.Readline` {#class-readlinepromisesreadline}

**Hinzugefügt in: v17.0.0**

#### `new readlinePromises.Readline(stream[, options])` {#new-readlinepromisesreadlinestream-options}

**Hinzugefügt in: v17.0.0**

- `stream` [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable) Ein [TTY](/de/nodejs/api/tty)-Stream.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `autoCommit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, muss `rl.commit()` nicht aufgerufen werden.


#### `rl.clearLine(dir)` {#rlclearlinedir}

**Hinzugefügt in: v17.0.0**

- `dir` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: Links vom Cursor
    - `1`: Rechts vom Cursor
    - `0`: Die gesamte Zeile
  
 
- Gibt zurück: this

Die `rl.clearLine()` Methode fügt der internen Liste ausstehender Aktionen eine Aktion hinzu, die die aktuelle Zeile des zugehörigen `stream` in einer durch `dir` angegebenen Richtung löscht. Rufen Sie `rl.commit()` auf, um die Auswirkung dieser Methode zu sehen, es sei denn, `autoCommit: true` wurde an den Konstruktor übergeben.

#### `rl.clearScreenDown()` {#rlclearscreendown}

**Hinzugefügt in: v17.0.0**

- Gibt zurück: this

Die `rl.clearScreenDown()` Methode fügt der internen Liste ausstehender Aktionen eine Aktion hinzu, die den zugehörigen Stream von der aktuellen Cursorposition abwärts löscht. Rufen Sie `rl.commit()` auf, um die Auswirkung dieser Methode zu sehen, es sei denn, `autoCommit: true` wurde an den Konstruktor übergeben.

#### `rl.commit()` {#rlcommit}

**Hinzugefügt in: v17.0.0**

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Die `rl.commit()` Methode sendet alle ausstehenden Aktionen an den zugehörigen `stream` und löscht die interne Liste ausstehender Aktionen.

#### `rl.cursorTo(x[, y])` {#rlcursortox-y}

**Hinzugefügt in: v17.0.0**

- `x` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Gibt zurück: this

Die `rl.cursorTo()` Methode fügt der internen Liste ausstehender Aktionen eine Aktion hinzu, die den Cursor an die angegebene Position im zugehörigen `stream` bewegt. Rufen Sie `rl.commit()` auf, um die Auswirkung dieser Methode zu sehen, es sei denn, `autoCommit: true` wurde an den Konstruktor übergeben.

#### `rl.moveCursor(dx, dy)` {#rlmovecursordx-dy}

**Hinzugefügt in: v17.0.0**

- `dx` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Gibt zurück: this

Die `rl.moveCursor()` Methode fügt der internen Liste ausstehender Aktionen eine Aktion hinzu, die den Cursor *relativ* zu seiner aktuellen Position im zugehörigen `stream` bewegt. Rufen Sie `rl.commit()` auf, um die Auswirkung dieser Methode zu sehen, es sei denn, `autoCommit: true` wurde an den Konstruktor übergeben.


#### `rl.rollback()` {#rlrollback}

**Hinzugefügt in: v17.0.0**

- Gibt zurück: this

Die `rl.rollback`-Methode löscht die interne Liste der ausstehenden Aktionen, ohne sie an den zugehörigen `stream` zu senden.

### `readlinePromises.createInterface(options)` {#readlinepromisescreateinterfaceoptions}

**Hinzugefügt in: v17.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable) Der [Readable](/de/nodejs/api/stream#readable-streams)-Stream, auf den gehört werden soll. Diese Option ist *erforderlich*.
    - `output` [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable) Der [Writable](/de/nodejs/api/stream#writable-streams)-Stream, in den Readline-Daten geschrieben werden sollen.
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine optionale Funktion, die für die automatische Tab-Vervollständigung verwendet wird.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn die `input`- und `output`-Streams wie ein TTY behandelt werden sollen und ANSI/VT100-Escape-Codes in diese geschrieben werden sollen. **Standard:** Überprüfen von `isTTY` auf dem `output`-Stream bei der Instanziierung.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Initialisierungsliste der Verlaufszeilen. Diese Option ist nur sinnvoll, wenn `terminal` vom Benutzer oder durch eine interne `output`-Prüfung auf `true` gesetzt wird, andernfalls wird der History-Caching-Mechanismus überhaupt nicht initialisiert. **Standard:** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Maximale Anzahl der beibehaltenen Verlaufszeilen. Um den Verlauf zu deaktivieren, setzen Sie diesen Wert auf `0`. Diese Option ist nur sinnvoll, wenn `terminal` vom Benutzer oder durch eine interne `output`-Prüfung auf `true` gesetzt wird, andernfalls wird der History-Caching-Mechanismus überhaupt nicht initialisiert. **Standard:** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird die ältere Zeile aus der Liste entfernt, wenn eine neue Eingabezeile, die der Verlaufsliste hinzugefügt wird, eine ältere Zeile dupliziert. **Standard:** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die zu verwendende Prompt-Zeichenkette. **Standard:** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wenn die Verzögerung zwischen `\r` und `\n` `crlfDelay`-Millisekunden überschreitet, werden sowohl `\r` als auch `\n` als separate End-of-Line-Eingaben behandelt. `crlfDelay` wird zu einer Zahl von nicht weniger als `100` konvertiert. Sie kann auf `Infinity` gesetzt werden, in diesem Fall wird `\r`, gefolgt von `\n`, immer als einzelner Zeilenumbruch betrachtet (was für das [Lesen von Dateien](/de/nodejs/api/readline#example-read-file-stream-line-by-line) mit `\r\n`-Zeilentrennzeichen sinnvoll sein kann). **Standard:** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Dauer, die `readlinePromises` auf ein Zeichen wartet (beim Lesen einer mehrdeutigen Schlüsselsequenz in Millisekunden, die sowohl eine vollständige Schlüsselsequenz mit der bisher gelesenen Eingabe bilden als auch zusätzliche Eingaben zur Vervollständigung einer längeren Schlüsselsequenz entgegennehmen kann). **Standard:** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Leerzeichen, die einem Tab entsprechen (Minimum 1). **Standard:** `8`.


- Gibt zurück: [\<readlinePromises.Interface\>](/de/nodejs/api/readline#class-readlinepromisesinterface)

Die `readlinePromises.createInterface()`-Methode erstellt eine neue `readlinePromises.Interface`-Instanz.


::: code-group
```js [ESM]
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline/promises');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

Sobald die `readlinePromises.Interface`-Instanz erstellt wurde, ist es am häufigsten, auf das `'line'`-Ereignis zu hören:

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
Wenn `terminal` für diese Instanz `true` ist, erhält der `output`-Stream die beste Kompatibilität, wenn er eine `output.columns`-Eigenschaft definiert und ein `'resize'`-Ereignis auf dem `output` auslöst, wenn oder wann sich die Spalten jemals ändern ([`process.stdout`](/de/nodejs/api/process#processstdout) tut dies automatisch, wenn es ein TTY ist).


#### Verwendung der Funktion `completer` {#use-of-the-completer-function}

Die Funktion `completer` nimmt die aktuelle, vom Benutzer eingegebene Zeile als Argument und gibt ein `Array` mit 2 Einträgen zurück:

- Ein `Array` mit übereinstimmenden Einträgen für die Vervollständigung.
- Die Teilzeichenfolge, die für die Übereinstimmung verwendet wurde.

Zum Beispiel: `[[substr1, substr2, ...], originalsubstring]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Alle Vervollständigungen anzeigen, wenn keine gefunden wurden
  return [hits.length ? hits : completions, line];
}
```
Die Funktion `completer` kann auch ein [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) zurückgeben oder asynchron sein:

```js [ESM]
async function completer(linePartial) {
  await someAsyncWork();
  return [['123'], linePartial];
}
```
## Callback-API {#callback-api}

**Hinzugefügt in: v0.1.104**

### Klasse: `readline.Interface` {#class-readlineinterface}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.0.0 | Die Klasse `readline.Interface` erbt jetzt von `Interface`. |
| v0.1.104 | Hinzugefügt in: v0.1.104 |
:::

- Erweitert: [\<readline.InterfaceConstructor\>](/de/nodejs/api/readline#class-interfaceconstructor)

Instanzen der Klasse `readline.Interface` werden mit der Methode `readline.createInterface()` erstellt. Jede Instanz ist mit einem einzelnen `input`-[Readable](/de/nodejs/api/stream#readable-streams)-Stream und einem einzelnen `output`-[Writable](/de/nodejs/api/stream#writable-streams)-Stream verbunden. Der `output`-Stream wird verwendet, um Eingabeaufforderungen für Benutzereingaben auszugeben, die auf dem `input`-Stream eingehen und von diesem gelesen werden.

#### `rl.question(query[, options], callback)` {#rlquestionquery-options-callback}

**Hinzugefügt in: v0.3.3**

- `query` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine Anweisung oder Abfrage, die in `output` geschrieben wird und der Eingabeaufforderung vorangestellt wird.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht optional das Abbrechen von `question()` mithilfe eines `AbortController`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Callback-Funktion, die mit der Benutzereingabe als Antwort auf die `query` aufgerufen wird.

Die Methode `rl.question()` zeigt die `query` an, indem sie in die `output` geschrieben wird, wartet auf die Eingabe des Benutzers in `input` und ruft dann die `callback`-Funktion auf, wobei die bereitgestellte Eingabe als erstes Argument übergeben wird.

Wenn `rl.question()` aufgerufen wird, setzt es den `input`-Stream fort, falls er pausiert wurde.

Wenn das `readline.Interface` mit `output` auf `null` oder `undefined` gesetzt wurde, wird die `query` nicht geschrieben.

Die an `rl.question()` übergebene `callback`-Funktion folgt nicht dem typischen Muster, ein `Error`-Objekt oder `null` als erstes Argument zu akzeptieren. Die `callback` wird mit der bereitgestellten Antwort als einzigem Argument aufgerufen.

Es wird ein Fehler ausgelöst, wenn `rl.question()` nach `rl.close()` aufgerufen wird.

Beispielhafte Verwendung:

```js [ESM]
rl.question('Was ist dein Lieblingsessen? ', (answer) => {
  console.log(`Ach so, dein Lieblingsessen ist also ${answer}`);
});
```
Verwenden eines `AbortController` zum Abbrechen einer Frage.

```js [ESM]
const ac = new AbortController();
const signal = ac.signal;

rl.question('Was ist dein Lieblingsessen? ', { signal }, (answer) => {
  console.log(`Ach so, dein Lieblingsessen ist also ${answer}`);
});

signal.addEventListener('abort', () => {
  console.log('Die Essensfrage hat das Zeitlimit überschritten');
}, { once: true });

setTimeout(() => ac.abort(), 10000);
```

### `readline.clearLine(stream, dir[, callback])` {#readlineclearlinestream-dir-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das Argument `callback` wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Der Write()-Rückruf und der Rückgabewert des Streams werden verfügbar gemacht. |
| v0.7.7 | Hinzugefügt in: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable)
- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: links vom Cursor
    - `1`: rechts vom Cursor
    - `0`: die gesamte Zeile

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, sobald der Vorgang abgeschlossen ist.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, wenn `stream` möchte, dass der aufrufende Code wartet, bis das Ereignis `'drain'` ausgelöst wurde, bevor er mit dem Schreiben zusätzlicher Daten fortfährt; andernfalls `true`.

Die Methode `readline.clearLine()` löscht die aktuelle Zeile des gegebenen [TTY](/de/nodejs/api/tty)-Streams in einer bestimmten Richtung, die durch `dir` identifiziert wird.

### `readline.clearScreenDown(stream[, callback])` {#readlineclearscreendownstream-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das Argument `callback` wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Der Write()-Rückruf und der Rückgabewert des Streams werden verfügbar gemacht. |
| v0.7.7 | Hinzugefügt in: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, sobald der Vorgang abgeschlossen ist.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, wenn `stream` möchte, dass der aufrufende Code wartet, bis das Ereignis `'drain'` ausgelöst wurde, bevor er mit dem Schreiben zusätzlicher Daten fortfährt; andernfalls `true`.

Die Methode `readline.clearScreenDown()` löscht den gegebenen [TTY](/de/nodejs/api/tty)-Stream von der aktuellen Position des Cursors nach unten.


### `readline.createInterface(options)` {#readlinecreateinterfaceoptions}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.14.0, v14.18.0 | Die Option `signal` wird jetzt unterstützt. |
| v15.8.0, v14.18.0 | Die Option `history` wird jetzt unterstützt. |
| v13.9.0 | Die Option `tabSize` wird jetzt unterstützt. |
| v8.3.0, v6.11.4 | Die maximale Beschränkung der Option `crlfDelay` wurde entfernt. |
| v6.6.0 | Die Option `crlfDelay` wird jetzt unterstützt. |
| v6.3.0 | Die Option `prompt` wird jetzt unterstützt. |
| v6.0.0 | Die Option `historySize` kann jetzt `0` sein. |
| v0.1.98 | Hinzugefügt in: v0.1.98 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable) Der [Readable](/de/nodejs/api/stream#readable-streams)-Stream, auf den gehört werden soll. Diese Option ist *erforderlich*.
    - `output` [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable) Der [Writable](/de/nodejs/api/stream#writable-streams)-Stream, in den Readline-Daten geschrieben werden sollen.
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine optionale Funktion, die für die automatische Tab-Vervollständigung verwendet wird.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn die `input`- und `output`-Streams wie ein TTY behandelt werden sollen und ANSI/VT100-Escape-Codes in diese geschrieben werden sollen. **Standard:** Überprüfung von `isTTY` auf dem `output`-Stream bei der Instanziierung.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Anfängliche Liste von Verlaufseinträgen. Diese Option ist nur sinnvoll, wenn `terminal` vom Benutzer oder durch eine interne `output`-Prüfung auf `true` gesetzt wird, andernfalls wird der Verlaufscaching-Mechanismus überhaupt nicht initialisiert. **Standard:** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Maximale Anzahl der beibehaltenen Verlaufseinträge. Um den Verlauf zu deaktivieren, setzen Sie diesen Wert auf `0`. Diese Option ist nur sinnvoll, wenn `terminal` vom Benutzer oder durch eine interne `output`-Prüfung auf `true` gesetzt wird, andernfalls wird der Verlaufscaching-Mechanismus überhaupt nicht initialisiert. **Standard:** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, und eine neue Eingabezeile, die der Verlaufsliste hinzugefügt wird, eine ältere Zeile dupliziert, wird diese ältere Zeile aus der Liste entfernt. **Standard:** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die zu verwendende Prompt-Zeichenkette. **Standard:** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wenn die Verzögerung zwischen `\r` und `\n` `crlfDelay` Millisekunden überschreitet, werden sowohl `\r` als auch `\n` als separate End-of-Line-Eingaben behandelt. `crlfDelay` wird zu einer Zahl von mindestens `100` konvertiert. Es kann auf `Infinity` gesetzt werden, in welchem Fall `\r`, gefolgt von `\n`, immer als einzelnes Newline-Zeichen betrachtet wird (was für das [Lesen von Dateien](/de/nodejs/api/readline#example-read-file-stream-line-by-line) mit `\r\n` Zeilentrennzeichen sinnvoll sein kann). **Standard:** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Dauer, die `readline` auf ein Zeichen wartet (beim Lesen einer mehrdeutigen Tastenfolge in Millisekunden, die sowohl eine vollständige Tastenfolge mit der bisher gelesenen Eingabe bilden kann als auch zusätzliche Eingaben entgegennehmen kann, um eine längere Tastenfolge zu vervollständigen). **Standard:** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Leerzeichen, die einem Tab entsprechen (mindestens 1). **Standard:** `8`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Schließen der Schnittstelle mithilfe eines AbortSignals. Das Abbrechen des Signals ruft intern `close` auf der Schnittstelle auf.
 
- Returns: [\<readline.Interface\>](/de/nodejs/api/readline#class-readlineinterface)

Die Methode `readline.createInterface()` erstellt eine neue `readline.Interface`-Instanz.

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

Sobald die `readline.Interface`-Instanz erstellt wurde, ist es üblich, auf das `'line'`-Ereignis zu warten:

```js [ESM]
rl.on('line', (line) => {
  console.log(`Empfangen: ${line}`);
});
```
Wenn `terminal` für diese Instanz `true` ist, erhält der `output`-Stream die beste Kompatibilität, wenn er eine `output.columns`-Eigenschaft definiert und ein `'resize'`-Ereignis auf dem `output` ausgibt, wenn oder wann sich die Spalten jemals ändern ([`process.stdout`](/de/nodejs/api/process#processstdout) tut dies automatisch, wenn es ein TTY ist).

Beim Erstellen einer `readline.Interface` mit `stdin` als Eingabe wird das Programm erst beendet, wenn es ein [EOF-Zeichen](https://en.wikipedia.org/wiki/End-of-file#EOF_character) empfängt. Um zu beenden, ohne auf Benutzereingaben zu warten, rufen Sie `process.stdin.unref()` auf.


#### Verwendung der Funktion `completer` {#use-of-the-completer-function_1}

Die Funktion `completer` nimmt die aktuelle vom Benutzer eingegebene Zeile als Argument entgegen und gibt ein `Array` mit 2 Einträgen zurück:

- Ein `Array` mit übereinstimmenden Einträgen für die Vervollständigung.
- Die Teilzeichenfolge, die für die Übereinstimmung verwendet wurde.

Zum Beispiel: `[[substr1, substr2, ...], originalsubstring]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Alle Vervollständigungen anzeigen, wenn keine gefunden wurden
  return [hits.length ? hits : completions, line];
}
```
Die Funktion `completer` kann asynchron aufgerufen werden, wenn sie zwei Argumente akzeptiert:

```js [ESM]
function completer(linePartial, callback) {
  callback(null, [['123'], linePartial]);
}
```
### `readline.cursorTo(stream, x[, y][, callback])` {#readlinecursortostream-x-y-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Der write()-Rückruf und der Rückgabewert des Streams werden verfügbar gemacht. |
| v0.7.7 | Hinzugefügt in: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable)
- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, sobald der Vorgang abgeschlossen ist.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, wenn `stream` wünscht, dass der aufrufende Code wartet, bis das `'drain'`-Ereignis ausgelöst wird, bevor er mit dem Schreiben zusätzlicher Daten fortfährt; andernfalls `true`.

Die Methode `readline.cursorTo()` bewegt den Cursor an die angegebene Position in einem gegebenen [TTY](/de/nodejs/api/tty)-`stream`.

### `readline.moveCursor(stream, dx, dy[, callback])` {#readlinemovecursorstream-dx-dy-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Der write()-Rückruf und der Rückgabewert des Streams werden verfügbar gemacht. |
| v0.7.7 | Hinzugefügt in: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable)
- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, sobald der Vorgang abgeschlossen ist.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, wenn `stream` wünscht, dass der aufrufende Code wartet, bis das `'drain'`-Ereignis ausgelöst wird, bevor er mit dem Schreiben zusätzlicher Daten fortfährt; andernfalls `true`.

Die Methode `readline.moveCursor()` bewegt den Cursor *relativ* zu seiner aktuellen Position in einem gegebenen [TTY](/de/nodejs/api/tty)-`stream`.


## `readline.emitKeypressEvents(stream[, interface])` {#readlineemitkeypresseventsstream-interface}

**Hinzugefügt in: v0.7.7**

- `stream` [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable)
- `interface` [\<readline.InterfaceConstructor\>](/de/nodejs/api/readline#class-interfaceconstructor)

Die Methode `readline.emitKeypressEvents()` bewirkt, dass der gegebene [Readable](/de/nodejs/api/stream#readable-streams)-Stream beginnt, `'keypress'`-Ereignisse auszugeben, die der empfangenen Eingabe entsprechen.

Optional gibt `interface` eine `readline.Interface`-Instanz an, für die die automatische Vervollständigung deaktiviert wird, wenn Copy-Paste-Eingaben erkannt werden.

Wenn der `stream` ein [TTY](/de/nodejs/api/tty) ist, muss er sich im Raw-Modus befinden.

Dies wird automatisch von jeder Readline-Instanz auf ihrem `input` aufgerufen, wenn der `input` ein Terminal ist. Das Schließen der `readline`-Instanz verhindert nicht, dass der `input` `'keypress'`-Ereignisse ausgibt.

```js [ESM]
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
```
## Beispiel: Winzige CLI {#example-tiny-cli}

Das folgende Beispiel veranschaulicht die Verwendung der Klasse `readline.Interface` zur Implementierung einer kleinen Befehlszeilenschnittstelle:

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { exit, stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  exit(0);
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
```
:::


## Beispiel: Datei-Stream Zeile für Zeile lesen {#example-read-file-stream-line-by-line}

Ein häufiger Anwendungsfall für `readline` ist die zeilenweise Verarbeitung einer Eingabedatei. Der einfachste Weg, dies zu tun, ist die Verwendung der [`fs.ReadStream`](/de/nodejs/api/fs#class-fsreadstream) API sowie einer `for await...of`-Schleife:

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Hinweis: Wir verwenden die Option crlfDelay, um alle Instanzen von CR LF
  // ('\r\n') in input.txt als einzelnen Zeilenumbruch zu erkennen.

  for await (const line of rl) {
    // Jede Zeile in input.txt wird hier nacheinander als `line` verfügbar sein.
    console.log(`Zeile aus Datei: ${line}`);
  }
}

processLineByLine();
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Hinweis: Wir verwenden die Option crlfDelay, um alle Instanzen von CR LF
  // ('\r\n') in input.txt als einzelnen Zeilenumbruch zu erkennen.

  for await (const line of rl) {
    // Jede Zeile in input.txt wird hier nacheinander als `line` verfügbar sein.
    console.log(`Zeile aus Datei: ${line}`);
  }
}

processLineByLine();
```
:::

Alternativ könnte man das [`'line'`](/de/nodejs/api/readline#event-line) Event verwenden:

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Zeile aus Datei: ${line}`);
});
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Zeile aus Datei: ${line}`);
});
```
:::

Aktuell kann die `for await...of`-Schleife etwas langsamer sein. Wenn `async` / `await`-Flow und Geschwindigkeit beide wichtig sind, kann ein gemischter Ansatz angewendet werden:

::: code-group
```js [ESM]
import { once } from 'node:events';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```

```js [CJS]
const { once } = require('node:events');
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```
:::


## TTY-Tastenkombinationen {#tty-keybindings}

| Tastenkombinationen | Beschreibung | Hinweise |
|---|---|---|
|  +  +  | Zeile links löschen | Funktioniert nicht unter Linux, Mac und Windows |
|  +  +  | Zeile rechts löschen | Funktioniert nicht unter Mac |
|  +  | Sendet `SIGINT` oder schließt die Readline-Instanz ||
|  +  | Links löschen ||
|  +  | Rechts löschen oder die Readline-Instanz schließen, falls die aktuelle Zeile leer ist / EOF | Funktioniert nicht unter Windows |
|  +  | Löscht von der aktuellen Position zum Zeilenanfang ||
|  +  | Löscht von der aktuellen Position zum Zeilenende ||
|  +  | Einfügen (Abrufen) des zuvor gelöschten Textes | Funktioniert nur mit Text, der durch + oder + gelöscht wurde |
|  +  | Durchläuft zuvor gelöschte Texte | Nur verfügbar, wenn der letzte Tastendruck + oder + war |
|  +  | Gehe zum Zeilenanfang ||
|  +  | Gehe zum Zeilenende ||
|  +  | Ein Zeichen zurück ||
|  +  | Ein Zeichen vorwärts ||
|  +  | Bildschirm löschen ||
|  +  | Nächster Eintrag in der Historie ||
|  +  | Vorheriger Eintrag in der Historie ||
|  +  | Vorherige Änderung rückgängig machen | Jeder Tastendruck, der den Keycode `0x1F` sendet, führt diese Aktion aus. In vielen Terminals, z. B. `xterm`, ist dies an + gebunden. |
|  +  | Vorherige Änderung wiederherstellen | Viele Terminals haben keinen standardmäßigen Wiederherstellungs-Tastendruck. Wir wählen den Keycode `0x1E`, um die Wiederherstellung durchzuführen. In `xterm` ist es standardmäßig an + gebunden. |
|  +  | Verschiebt den laufenden Prozess in den Hintergrund. Tippen Sie `fg` und drücken Sie , um zurückzukehren. | Funktioniert nicht unter Windows |
|  + oder + | Rückwärts bis zu einer Wortgrenze löschen | + Funktioniert nicht unter Linux, Mac und Windows |
|  +  | Vorwärts bis zu einer Wortgrenze löschen | Funktioniert nicht unter Mac |
|  + oder + | Wort links | + Funktioniert nicht unter Mac |
|  + oder + | Wort rechts | + Funktioniert nicht unter Mac |
|  + oder + | Wort rechts löschen | + Funktioniert nicht unter Windows |
|  +  | Wort links löschen | Funktioniert nicht unter Mac |

