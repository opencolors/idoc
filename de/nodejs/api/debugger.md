---
title: Node.js Debugger-Leitfaden
description: Ein umfassender Leitfaden zur Verwendung des integrierten Debuggers in Node.js, der Befehle, Nutzung und Debugging-Techniken detailliert beschreibt.
head:
  - - meta
    - name: og:title
      content: Node.js Debugger-Leitfaden | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Ein umfassender Leitfaden zur Verwendung des integrierten Debuggers in Node.js, der Befehle, Nutzung und Debugging-Techniken detailliert beschreibt.
  - - meta
    - name: twitter:title
      content: Node.js Debugger-Leitfaden | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Ein umfassender Leitfaden zur Verwendung des integrierten Debuggers in Node.js, der Befehle, Nutzung und Debugging-Techniken detailliert beschreibt.
---


# Debugger {#debugger}

::: tip [Stable: 2 - Stabil]
[Stable: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Node.js enthält ein Kommandozeilen-Debugging-Dienstprogramm. Der Node.js-Debugger-Client ist kein vollwertiger Debugger, aber einfaches Stepping und Inspizieren sind möglich.

Um ihn zu verwenden, starten Sie Node.js mit dem `inspect`-Argument, gefolgt vom Pfad zum zu debuggenden Skript.

```bash [BASH]
$ node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/621111f9-ffcb-4e82-b718-48a145fa5db8
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
 ok
Break on start in myscript.js:2
  1 // myscript.js
> 2 global.x = 5;
  3 setTimeout(() => {
  4   debugger;
debug>
```
Der Debugger hält automatisch in der ersten ausführbaren Zeile an. Um stattdessen bis zum ersten Breakpoint (angegeben durch eine [`debugger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger)-Anweisung) auszuführen, setzen Sie die Umgebungsvariable `NODE_INSPECT_RESUME_ON_START` auf `1`.

```bash [BASH]
$ cat myscript.js
// myscript.js
global.x = 5;
setTimeout(() => {
  debugger;
  console.log('world');
}, 1000);
console.log('hello');
$ NODE_INSPECT_RESUME_ON_START=1 node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/f1ed133e-7876-495b-83ae-c32c6fc319c2
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
< hello
<
break in myscript.js:4
  2 global.x = 5;
  3 setTimeout(() => {
> 4   debugger;
  5   console.log('world');
  6 }, 1000);
debug> next
break in myscript.js:5
  3 setTimeout(() => {
  4   debugger;
> 5   console.log('world');
  6 }, 1000);
  7 console.log('hello');
debug> repl
Press Ctrl+C to leave debug repl
> x
5
> 2 + 2
4
debug> next
< world
<
break in myscript.js:6
  4   debugger;
  5   console.log('world');
> 6 }, 1000);
  7 console.log('hello');
  8
debug> .exit
$
```
Der `repl`-Befehl ermöglicht die Remote-Auswertung von Code. Der Befehl `next` geht zur nächsten Zeile. Geben Sie `help` ein, um zu sehen, welche anderen Befehle verfügbar sind.

Durch Drücken der `Enter`-Taste ohne Eingabe eines Befehls wird der vorherige Debugger-Befehl wiederholt.


## Beobachter (Watchers) {#watchers}

Es ist möglich, Ausdrücke und Variablenwerte während des Debuggens zu beobachten. Bei jedem Haltepunkt wird jeder Ausdruck aus der Beobachterliste im aktuellen Kontext ausgewertet und unmittelbar vor der Quellcode-Auflistung des Haltepunkts angezeigt.

Um mit der Beobachtung eines Ausdrucks zu beginnen, geben Sie `watch('mein_ausdruck')` ein. Der Befehl `watchers` gibt die aktiven Beobachter aus. Um einen Beobachter zu entfernen, geben Sie `unwatch('mein_ausdruck')` ein.

## Befehlsreferenz {#command-reference}

### Stepping {#stepping}

- `cont`, `c`: Ausführung fortsetzen
- `next`, `n`: Nächster Schritt
- `step`, `s`: Hineinsteigen
- `out`, `o`: Heraussteigen
- `pause`: Laufenden Code anhalten (wie die Pause-Taste in den Entwicklertools)

### Haltepunkte (Breakpoints) {#breakpoints}

- `setBreakpoint()`, `sb()`: Haltepunkt in der aktuellen Zeile setzen
- `setBreakpoint(line)`, `sb(line)`: Haltepunkt in einer bestimmten Zeile setzen
- `setBreakpoint('fn()')`, `sb(...)`: Haltepunkt in der ersten Anweisung des Funktionskörpers setzen
- `setBreakpoint('script.js', 1)`, `sb(...)`: Haltepunkt in der ersten Zeile von `script.js` setzen
- `setBreakpoint('script.js', 1, 'num \< 4')`, `sb(...)`: Bedingten Haltepunkt in der ersten Zeile von `script.js` setzen, der nur dann unterbricht, wenn `num \< 4` zu `true` ausgewertet wird.
- `clearBreakpoint('script.js', 1)`, `cb(...)`: Haltepunkt in `script.js` in Zeile 1 löschen

Es ist auch möglich, einen Haltepunkt in einer Datei (Modul) zu setzen, die noch nicht geladen ist:

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/48a5b28a-550c-471b-b5e1-d13dd7165df9
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
Break on start in main.js:1
> 1 const mod = require('./mod.js');
  2 mod.hello();
  3 mod.hello();
debug> setBreakpoint('mod.js', 22)
Warning: script 'mod.js' was not loaded yet.
debug> c
break in mod.js:22
 20 // USE OR OTHER DEALINGS IN THE SOFTWARE.
 21
>22 exports.hello = function() {
 23   return 'hello from module';
 24 };
debug>
```
Es ist auch möglich, einen bedingten Haltepunkt zu setzen, der nur dann unterbricht, wenn ein gegebener Ausdruck zu `true` ausgewertet wird:

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/ce24daa8-3816-44d4-b8ab-8273c8a66d35
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
Break on start in main.js:7
  5 }
  6
> 7 addOne(10);
  8 addOne(-1);
  9
debug> setBreakpoint('main.js', 4, 'num < 0')
  1 'use strict';
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
  7 addOne(10);
  8 addOne(-1);
  9
debug> cont
break in main.js:4
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
debug> exec('num')
-1
debug>
```

### Information {#information}

- `backtrace`, `bt`: Gibt den Backtrace des aktuellen Ausführungs-Frames aus
- `list(5)`: Listet den Quellcode des Skripts mit 5 Zeilen Kontext auf (5 Zeilen vor und nachher)
- `watch(expr)`: Fügt einen Ausdruck zur Beobachtungsliste hinzu
- `unwatch(expr)`: Entfernt einen Ausdruck aus der Beobachtungsliste
- `unwatch(index)`: Entfernt einen Ausdruck an einem bestimmten Index aus der Beobachtungsliste
- `watchers`: Listet alle Beobachter und ihre Werte auf (automatisch bei jedem Breakpoint aufgelistet)
- `repl`: Öffnet die REPL des Debuggers zur Auswertung im Kontext des Debugging-Skripts
- `exec expr`, `p expr`: Führt einen Ausdruck im Kontext des Debugging-Skripts aus und gibt seinen Wert aus
- `profile`: Startet eine CPU-Profiling-Sitzung
- `profileEnd`: Beendet die aktuelle CPU-Profiling-Sitzung
- `profiles`: Listet alle abgeschlossenen CPU-Profiling-Sitzungen auf
- `profiles[n].save(filepath = 'node.cpuprofile')`: Speichert die CPU-Profiling-Sitzung als JSON auf der Festplatte
- `takeHeapSnapshot(filepath = 'node.heapsnapshot')`: Erstellt einen Heap-Snapshot und speichert ihn als JSON auf der Festplatte

### Ausführungssteuerung {#execution-control}

- `run`: Führt das Skript aus (wird automatisch beim Start des Debuggers ausgeführt)
- `restart`: Startet das Skript neu
- `kill`: Beendet das Skript

### Verschiedenes {#various}

- `scripts`: Listet alle geladenen Skripte auf
- `version`: Zeigt die V8-Version an

## Erweiterte Nutzung {#advanced-usage}

### V8 Inspector Integration für Node.js {#v8-inspector-integration-for-nodejs}

Die V8 Inspector Integration ermöglicht das Anhängen von Chrome DevTools an Node.js-Instanzen zur Fehlersuche und Profilierung. Sie verwendet das [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

V8 Inspector kann durch Übergabe des `--inspect` Flags beim Starten einer Node.js-Anwendung aktiviert werden. Es ist auch möglich, mit diesem Flag einen benutzerdefinierten Port anzugeben, z. B. akzeptiert `--inspect=9222` DevTools-Verbindungen auf Port 9222.

Die Verwendung des `--inspect` Flags führt den Code unmittelbar aus, bevor der Debugger verbunden wird. Dies bedeutet, dass der Code ausgeführt wird, bevor Sie mit dem Debuggen beginnen können, was möglicherweise nicht ideal ist, wenn Sie von Anfang an debuggen möchten.

In solchen Fällen haben Sie zwei Alternativen:

Wenn Sie sich also zwischen `--inspect`, `--inspect-wait` und `--inspect-brk` entscheiden, überlegen Sie, ob der Code sofort ausgeführt werden soll, ob vor der Ausführung auf das Anhängen des Debuggers gewartet werden soll oder ob am Anfang der ersten Zeile für schrittweises Debuggen ein Breakpoint gesetzt werden soll.

```bash [BASH]
$ node --inspect index.js
Debugger listening on ws://127.0.0.1:9229/dc9010dd-f8b8-4ac5-a510-c1a114ec7d29
For help, see: https://nodejs.org/en/docs/inspector
```
(Im obigen Beispiel wird die UUID dc9010dd-f8b8-4ac5-a510-c1a114ec7d29 am Ende der URL dynamisch generiert und variiert in verschiedenen Debugging-Sitzungen.)

Wenn der Chrome-Browser älter als 66.0.3345.0 ist, verwenden Sie `inspector.html` anstelle von `js_app.html` in der obigen URL.

Chrome DevTools unterstützt das Debuggen von [Worker-Threads](/de/nodejs/api/worker_threads) noch nicht. [ndb](https://github.com/GoogleChromeLabs/ndb/) kann verwendet werden, um sie zu debuggen.

