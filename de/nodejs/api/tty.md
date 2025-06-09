---
title: Node.js TTY-Dokumentation
description: Das TTY-Modul von Node.js bietet eine Schnittstelle zur Interaktion mit TTY-Geräten, einschließlich Methoden zur Überprüfung, ob ein Stream ein TTY ist, zur Ermittlung der Fenstergröße und zur Behandlung von Terminalereignissen.
head:
  - - meta
    - name: og:title
      content: Node.js TTY-Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das TTY-Modul von Node.js bietet eine Schnittstelle zur Interaktion mit TTY-Geräten, einschließlich Methoden zur Überprüfung, ob ein Stream ein TTY ist, zur Ermittlung der Fenstergröße und zur Behandlung von Terminalereignissen.
  - - meta
    - name: twitter:title
      content: Node.js TTY-Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das TTY-Modul von Node.js bietet eine Schnittstelle zur Interaktion mit TTY-Geräten, einschließlich Methoden zur Überprüfung, ob ein Stream ein TTY ist, zur Ermittlung der Fenstergröße und zur Behandlung von Terminalereignissen.
---


# TTY {#tty}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/tty.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tty.js)

Das Modul `node:tty` stellt die Klassen `tty.ReadStream` und `tty.WriteStream` bereit. In den meisten Fällen ist es weder notwendig noch möglich, dieses Modul direkt zu verwenden. Es kann jedoch über Folgendes aufgerufen werden:

```js [ESM]
const tty = require('node:tty');
```
Wenn Node.js erkennt, dass es mit einem Textterminal ("TTY") verbunden ist, wird [`process.stdin`](/de/nodejs/api/process#processstdin) standardmäßig als eine Instanz von `tty.ReadStream` initialisiert, und sowohl [`process.stdout`](/de/nodejs/api/process#processstdout) als auch [`process.stderr`](/de/nodejs/api/process#processstderr) werden standardmäßig als Instanzen von `tty.WriteStream` initialisiert. Die bevorzugte Methode, um festzustellen, ob Node.js in einem TTY-Kontext ausgeführt wird, ist die Überprüfung, ob der Wert der Eigenschaft `process.stdout.isTTY` `true` ist:

```bash [BASH]
$ node -p -e "Boolean(process.stdout.isTTY)"
true
$ node -p -e "Boolean(process.stdout.isTTY)" | cat
false
```
In den meisten Fällen sollte es für eine Anwendung kaum oder gar keinen Grund geben, manuell Instanzen der Klassen `tty.ReadStream` und `tty.WriteStream` zu erstellen.

## Klasse: `tty.ReadStream` {#class-ttyreadstream}

**Hinzugefügt in: v0.5.8**

- Erweitert: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)

Stellt die lesbare Seite eines TTY dar. Unter normalen Umständen ist [`process.stdin`](/de/nodejs/api/process#processstdin) die einzige `tty.ReadStream`-Instanz in einem Node.js-Prozess, und es sollte keinen Grund geben, zusätzliche Instanzen zu erstellen.

### `readStream.isRaw` {#readstreamisraw}

**Hinzugefügt in: v0.7.7**

Ein `boolean`, der `true` ist, wenn das TTY derzeit so konfiguriert ist, dass es als rohes Gerät arbeitet.

Dieses Flag ist immer `false`, wenn ein Prozess startet, selbst wenn das Terminal im Raw-Modus arbeitet. Sein Wert ändert sich mit nachfolgenden Aufrufen von `setRawMode`.

### `readStream.isTTY` {#readstreamistty}

**Hinzugefügt in: v0.5.8**

Ein `boolean`, der für `tty.ReadStream`-Instanzen immer `true` ist.


### `readStream.setRawMode(mode)` {#readstreamsetrawmodemode}

**Hinzugefügt in: v0.7.7**

- `mode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, konfiguriert die `tty.ReadStream`, um als rohes Gerät zu arbeiten. Wenn `false`, konfiguriert die `tty.ReadStream`, um in ihrem Standardmodus zu arbeiten. Die Eigenschaft `readStream.isRaw` wird auf den resultierenden Modus gesetzt.
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) Die Read-Stream-Instanz.

Ermöglicht die Konfiguration von `tty.ReadStream`, so dass sie als rohes Gerät arbeitet.

Im Raw-Modus sind Eingaben immer zeichenweise verfügbar, ohne Modifikatoren. Zusätzlich ist die gesamte spezielle Verarbeitung von Zeichen durch das Terminal deaktiviert, einschließlich des Echoing von Eingabezeichen. + verursacht in diesem Modus kein `SIGINT` mehr.

## Klasse: `tty.WriteStream` {#class-ttywritestream}

**Hinzugefügt in: v0.5.8**

- Erweitert: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)

Repräsentiert die beschreibbare Seite eines TTY. Unter normalen Umständen sind [`process.stdout`](/de/nodejs/api/process#processstdout) und [`process.stderr`](/de/nodejs/api/process#processstderr) die einzigen `tty.WriteStream`-Instanzen, die für einen Node.js-Prozess erstellt werden, und es sollte keinen Grund geben, zusätzliche Instanzen zu erstellen.

### `new tty.ReadStream(fd[, options])` {#new-ttyreadstreamfd-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v0.9.4 | Das Argument `options` wird unterstützt. |
| v0.5.8 | Hinzugefügt in: v0.5.8 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein Dateideskriptor, der einem TTY zugeordnet ist.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optionen, die an den übergeordneten `net.Socket` übergeben werden, siehe `options` des [`net.Socket`-Konstruktors](/de/nodejs/api/net#new-netsocketoptions).
- Gibt [\<tty.ReadStream\>](/de/nodejs/api/tty#class-ttyreadstream) zurück

Erstellt einen `ReadStream` für `fd`, der einem TTY zugeordnet ist.

### `new tty.WriteStream(fd)` {#new-ttywritestreamfd}

**Hinzugefügt in: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein Dateideskriptor, der einem TTY zugeordnet ist.
- Gibt [\<tty.WriteStream\>](/de/nodejs/api/tty#class-ttywritestream) zurück

Erstellt einen `WriteStream` für `fd`, der einem TTY zugeordnet ist.


### Ereignis: `'resize'` {#event-resize}

**Hinzugefügt in: v0.7.7**

Das `'resize'`-Ereignis wird ausgelöst, wenn sich entweder die `writeStream.columns`- oder die `writeStream.rows`-Eigenschaft geändert hat. Beim Aufruf werden keine Argumente an den Listener-Callback übergeben.

```js [ESM]
process.stdout.on('resize', () => {
  console.log('Die Bildschirmgröße hat sich geändert!');
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});
```
### `writeStream.clearLine(dir[, callback])` {#writestreamclearlinedir-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.7.0 | Der Write()-Callback und der Rückgabewert des Streams werden offengelegt. |
| v0.7.7 | Hinzugefügt in: v0.7.7 |
:::

- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 
    - `-1`: links vom Cursor
    - `1`: rechts vom Cursor
    - `0`: die gesamte Zeile
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, sobald die Operation abgeschlossen ist.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, wenn der Stream möchte, dass der aufrufende Code wartet, bis das `'drain'`-Ereignis ausgelöst wurde, bevor er mit dem Schreiben zusätzlicher Daten fortfährt; andernfalls `true`.

`writeStream.clearLine()` löscht die aktuelle Zeile dieses `WriteStream` in einer durch `dir` angegebenen Richtung.

### `writeStream.clearScreenDown([callback])` {#writestreamclearscreendowncallback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.7.0 | Der Write()-Callback und der Rückgabewert des Streams werden offengelegt. |
| v0.7.7 | Hinzugefügt in: v0.7.7 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, sobald die Operation abgeschlossen ist.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, wenn der Stream möchte, dass der aufrufende Code wartet, bis das `'drain'`-Ereignis ausgelöst wurde, bevor er mit dem Schreiben zusätzlicher Daten fortfährt; andernfalls `true`.

`writeStream.clearScreenDown()` löscht diesen `WriteStream` ab der aktuellen Cursorposition nach unten.


### `writeStream.columns` {#writestreamcolumns}

**Hinzugefügt in: v0.7.7**

Eine `number`, die die Anzahl der Spalten angibt, die das TTY aktuell hat. Diese Eigenschaft wird aktualisiert, wenn das `'resize'`-Ereignis ausgelöst wird.

### `writeStream.cursorTo(x[, y][, callback])` {#writestreamcursortox-y-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.7.0 | Der write()-Callback und der Rückgabewert des Streams werden offengelegt. |
| v0.7.7 | Hinzugefügt in: v0.7.7 |
:::

- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, sobald der Vorgang abgeschlossen ist.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, wenn der Stream möchte, dass der aufrufende Code wartet, bis das `'drain'`-Ereignis ausgelöst wird, bevor er mit dem Schreiben zusätzlicher Daten fortfährt; andernfalls `true`.

`writeStream.cursorTo()` bewegt den Cursor dieses `WriteStream` an die angegebene Position.

### `writeStream.getColorDepth([env])` {#writestreamgetcolordepthenv}

**Hinzugefügt in: v9.9.0**

- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Objekt, das die Umgebungsvariablen enthält, die überprüft werden sollen. Dies ermöglicht die Simulation der Verwendung eines bestimmten Terminals. **Standard:** `process.env`.
- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt zurück:

- `1` für 2,
- `4` für 16,
- `8` für 256,
- `24` für 16.777.216 unterstützte Farben.

Verwenden Sie dies, um festzustellen, welche Farben das Terminal unterstützt. Aufgrund der Natur der Farben in Terminals ist es möglich, entweder falsch positive oder falsch negative Ergebnisse zu erhalten. Dies hängt von den Prozessinformationen und den Umgebungsvariablen ab, die möglicherweise über das verwendete Terminal lügen. Es ist möglich, ein `env`-Objekt zu übergeben, um die Verwendung eines bestimmten Terminals zu simulieren. Dies kann nützlich sein, um zu überprüfen, wie sich bestimmte Umgebungseinstellungen verhalten.

Um eine bestimmte Farbuntersützung zu erzwingen, verwenden Sie eine der folgenden Umgebungseinstellungen.

- 2 Farben: `FORCE_COLOR = 0` (Deaktiviert Farben)
- 16 Farben: `FORCE_COLOR = 1`
- 256 Farben: `FORCE_COLOR = 2`
- 16.777.216 Farben: `FORCE_COLOR = 3`

Das Deaktivieren der Farbuntersützung ist auch über die Umgebungsvariablen `NO_COLOR` und `NODE_DISABLE_COLORS` möglich.


### `writeStream.getWindowSize()` {#writestreamgetwindowsize}

**Hinzugefügt in: v0.7.7**

- Gibt zurück: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`writeStream.getWindowSize()` gibt die Größe des TTY zurück, das diesem `WriteStream` entspricht. Das Array hat den Typ `[numColumns, numRows]`, wobei `numColumns` und `numRows` die Anzahl der Spalten und Zeilen im entsprechenden TTY darstellen.

### `writeStream.hasColors([count][, env])` {#writestreamhascolorscount-env}

**Hinzugefügt in: v11.13.0, v10.16.0**

- `count` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der angeforderten Farben (mindestens 2). **Standard:** 16.
- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Objekt, das die zu prüfenden Umgebungsvariablen enthält. Dies ermöglicht die Simulation der Verwendung eines bestimmten Terminals. **Standard:** `process.env`.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der `writeStream` mindestens so viele Farben unterstützt, wie in `count` angegeben. Die Mindestunterstützung beträgt 2 (schwarz und weiß).

Dies hat die gleichen falsch positiven und negativen Ergebnisse wie in [`writeStream.getColorDepth()`](/de/nodejs/api/tty#writestreamgetcolordepthenv) beschrieben.

```js [ESM]
process.stdout.hasColors();
// Gibt true oder false zurück, je nachdem, ob `stdout` mindestens 16 Farben unterstützt.
process.stdout.hasColors(256);
// Gibt true oder false zurück, je nachdem, ob `stdout` mindestens 256 Farben unterstützt.
process.stdout.hasColors({ TMUX: '1' });
// Gibt true zurück.
process.stdout.hasColors(2 ** 24, { TMUX: '1' });
// Gibt false zurück (die Umgebungseinstellung gibt vor, 2 ** 8 Farben zu unterstützen).
```
### `writeStream.isTTY` {#writestreamistty}

**Hinzugefügt in: v0.5.8**

Ein `boolean`, der immer `true` ist.

### `writeStream.moveCursor(dx, dy[, callback])` {#writestreammovecursordx-dy-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.7.0 | Der write() Callback und der Rückgabewert des Streams werden offengelegt. |
| v0.7.7 | Hinzugefügt in: v0.7.7 |
:::

- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, sobald die Operation abgeschlossen ist.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, wenn der Stream möchte, dass der aufrufende Code wartet, bis das `'drain'`-Ereignis ausgelöst wurde, bevor er mit dem Schreiben zusätzlicher Daten fortfährt; andernfalls `true`.

`writeStream.moveCursor()` bewegt den Cursor dieses `WriteStream` *relativ* zu seiner aktuellen Position.


### `writeStream.rows` {#writestreamrows}

**Hinzugefügt in: v0.7.7**

Eine `number`, die die Anzahl der Zeilen angibt, die das TTY aktuell hat. Diese Eigenschaft wird jedes Mal aktualisiert, wenn das `'resize'`-Ereignis ausgelöst wird.

## `tty.isatty(fd)` {#ttyisattyfd}

**Hinzugefügt in: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein numerischer Dateideskriptor
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Methode `tty.isatty()` gibt `true` zurück, wenn die gegebene `fd` einem TTY zugeordnet ist, und `false`, wenn dies nicht der Fall ist, auch wenn `fd` keine nicht-negative Ganzzahl ist.

