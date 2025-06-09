---
title: Node.js Dokumentation - Fehler
description: Dieser Abschnitt der Node.js-Dokumentation bietet umfassende Informationen zur Fehlerbehandlung, einschließlich Fehlerklassen, Fehlercodes und wie man Fehler in Node.js-Anwendungen behandelt.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Fehler | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Dieser Abschnitt der Node.js-Dokumentation bietet umfassende Informationen zur Fehlerbehandlung, einschließlich Fehlerklassen, Fehlercodes und wie man Fehler in Node.js-Anwendungen behandelt.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Fehler | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Dieser Abschnitt der Node.js-Dokumentation bietet umfassende Informationen zur Fehlerbehandlung, einschließlich Fehlerklassen, Fehlercodes und wie man Fehler in Node.js-Anwendungen behandelt.
---


# Fehler {#errors}

Anwendungen, die in Node.js ausgeführt werden, erleben im Allgemeinen vier Kategorien von Fehlern:

- Standardmäßige JavaScript-Fehler wie [\<EvalError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError), [\<SyntaxError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError), [\<RangeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError), [\<ReferenceError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError), [\<TypeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) und [\<URIError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError).
- Systemfehler, die durch zugrunde liegende Betriebssystembeschränkungen ausgelöst werden, z. B. der Versuch, eine nicht vorhandene Datei zu öffnen oder Daten über einen geschlossenen Socket zu senden.
- Benutzerdefinierte Fehler, die durch Anwendungscode ausgelöst werden.
- `AssertionError`s sind eine spezielle Fehlerklasse, die ausgelöst werden kann, wenn Node.js eine außergewöhnliche Logikverletzung erkennt, die niemals auftreten sollte. Diese werden typischerweise durch das `node:assert`-Modul ausgelöst.

Alle JavaScript- und Systemfehler, die von Node.js ausgelöst werden, erben von der Standard-JavaScript-Klasse [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) oder sind Instanzen davon und garantieren, *mindestens* die Eigenschaften bereitzustellen, die für diese Klasse verfügbar sind.

## Fehlerweiterleitung und -abfang {#error-propagation-and-interception}

Node.js unterstützt verschiedene Mechanismen zum Weiterleiten und Behandeln von Fehlern, die während der Ausführung einer Anwendung auftreten. Wie diese Fehler gemeldet und behandelt werden, hängt vollständig von der Art des `Error` und dem Stil der aufgerufenen API ab.

Alle JavaScript-Fehler werden als Ausnahmen behandelt, die *sofort* einen Fehler generieren und mit dem Standard-JavaScript-Mechanismus `throw` auslösen. Diese werden mit dem von der JavaScript-Sprache bereitgestellten [`try…catch`-Konstrukt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) behandelt.

```js [ESM]
// Wirft einen ReferenceError, weil z nicht definiert ist.
try {
  const m = 1;
  const n = m + z;
} catch (err) {
  // Behandle den Fehler hier.
}
```
Jede Verwendung des JavaScript-Mechanismus `throw` löst eine Ausnahme aus, die *behandelt* werden *muss*, oder der Node.js-Prozess wird sofort beendet.

Mit wenigen Ausnahmen verwenden *synchrone* APIs (jede blockierende Methode, die kein [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) zurückgibt und keine `callback`-Funktion akzeptiert, wie z. B. [`fs.readFileSync`](/de/nodejs/api/fs#fsreadfilesyncpath-options)) `throw`, um Fehler zu melden.

Fehler, die innerhalb von *asynchronen APIs* auftreten, können auf verschiedene Arten gemeldet werden:

-  Einige asynchrone Methoden geben ein [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) zurück. Sie sollten immer berücksichtigen, dass es abgelehnt werden kann. Siehe Flag [`--unhandled-rejections`](/de/nodejs/api/cli#--unhandled-rejectionsmode), um zu erfahren, wie der Prozess auf eine unbehandelte Promise-Ablehnung reagiert.
-  Die meisten asynchronen Methoden, die eine `callback`-Funktion akzeptieren, akzeptieren ein `Error`-Objekt, das als erstes Argument an diese Funktion übergeben wird. Wenn dieses erste Argument nicht `null` ist und eine Instanz von `Error` ist, ist ein Fehler aufgetreten, der behandelt werden sollte.
-  Wenn eine asynchrone Methode für ein Objekt aufgerufen wird, das ein [`EventEmitter`](/de/nodejs/api/events#class-eventemitter) ist, können Fehler an das `'error'`-Ereignis dieses Objekts weitergeleitet werden.
-  Eine Handvoll typischerweise asynchroner Methoden in der Node.js-API können immer noch den `throw`-Mechanismus verwenden, um Ausnahmen auszulösen, die mit `try…catch` behandelt werden müssen. Es gibt keine umfassende Liste solcher Methoden. Bitte konsultieren Sie die Dokumentation jeder Methode, um den erforderlichen Fehlerbehandlungsmechanismus zu bestimmen.

Die Verwendung des `'error'`-Ereignismechanismus ist am gebräuchlichsten für [stream-basierte](/de/nodejs/api/stream) und [event emitter-basierte](/de/nodejs/api/events#class-eventemitter) APIs, die selbst eine Reihe von asynchronen Operationen im Laufe der Zeit darstellen (im Gegensatz zu einer einzelnen Operation, die erfolgreich sein oder fehlschlagen kann).

Für *alle* [`EventEmitter`](/de/nodejs/api/events#class-eventemitter)-Objekte gilt: Wenn kein `'error'`-Ereignishandler bereitgestellt wird, wird der Fehler ausgelöst, wodurch der Node.js-Prozess eine nicht abgefangene Ausnahme meldet und abstürzt, es sei denn: Es wurde ein Handler für das [`'uncaughtException'`]-Ereignis](/de/nodejs/api/process#event-uncaughtexception) registriert oder das veraltete [`node:domain`](/de/nodejs/api/domain)-Modul wird verwendet.

```js [ESM]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

setImmediate(() => {
  // Dies wird den Prozess zum Absturz bringen, da kein 'error'-Ereignis
  // Handler wurde hinzugefügt.
  ee.emit('error', new Error('This will crash'));
});
```
Auf diese Weise generierte Fehler *können nicht* mit `try…catch` abgefangen werden, da sie *nachdem* der aufrufende Code bereits beendet wurde, ausgelöst werden.

Entwickler müssen sich auf die Dokumentation für jede Methode beziehen, um genau zu bestimmen, wie Fehler, die von diesen Methoden ausgelöst werden, weitergeleitet werden.


## Klasse: `Error` {#class-error}

Ein generisches JavaScript-[\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)-Objekt, das keine spezifischen Umstände angibt, warum der Fehler aufgetreten ist. `Error`-Objekte erfassen einen "Stack-Trace", der den Punkt im Code detailliert beschreibt, an dem das `Error`-Objekt instanziiert wurde, und können eine Textbeschreibung des Fehlers liefern.

Alle von Node.js generierten Fehler, einschließlich aller System- und JavaScript-Fehler, sind entweder Instanzen der Klasse `Error` oder erben von ihr.

### `new Error(message[, options])` {#new-errormessage-options}

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cause` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der Fehler, der den neu erstellten Fehler verursacht hat.

Erstellt ein neues `Error`-Objekt und setzt die Eigenschaft `error.message` auf die bereitgestellte Textnachricht. Wenn ein Objekt als `message` übergeben wird, wird die Textnachricht durch Aufrufen von `String(message)` generiert. Wenn die Option `cause` angegeben wird, wird sie der Eigenschaft `error.cause` zugewiesen. Die Eigenschaft `error.stack` repräsentiert den Punkt im Code, an dem `new Error()` aufgerufen wurde. Stack-Traces sind von der [Stack-Trace-API von V8](https://v8.dev/docs/stack-trace-api) abhängig. Stack-Traces erstrecken sich nur bis entweder (a) zum Beginn der *synchronen Codeausführung* oder (b) bis zur Anzahl der Frames, die durch die Eigenschaft `Error.stackTraceLimit` vorgegeben ist, je nachdem, welcher Wert kleiner ist.

### `Error.captureStackTrace(targetObject[, constructorOpt])` {#errorcapturestacktracetargetobject-constructoropt}

- `targetObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `constructorOpt` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Erstellt eine `.stack`-Eigenschaft für `targetObject`, die bei Zugriff eine Zeichenfolge zurückgibt, die die Position im Code darstellt, an der `Error.captureStackTrace()` aufgerufen wurde.

```js [ESM]
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Ähnlich wie `new Error().stack`
```

Die erste Zeile des Trace wird mit `${myObject.name}: ${myObject.message}` versehen.

Das optionale Argument `constructorOpt` akzeptiert eine Funktion. Wenn es angegeben wird, werden alle Frames oberhalb von `constructorOpt`, einschließlich `constructorOpt`, aus dem generierten Stack-Trace entfernt.

Das Argument `constructorOpt` ist nützlich, um Implementierungsdetails der Fehlererzeugung vor dem Benutzer zu verbergen. Zum Beispiel:

```js [ESM]
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Erstellen Sie einen Fehler ohne Stack-Trace, um die Berechnung des Stack-Traces nicht zweimal durchführen zu müssen.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Erfassen Sie den Stack-Trace oberhalb der Funktion b
  Error.captureStackTrace(error, b); // Weder Funktion c noch b sind im Stack-Trace enthalten
  throw error;
}

a();
```

### `Error.stackTraceLimit` {#errorstacktracelimit}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Eigenschaft `Error.stackTraceLimit` gibt die Anzahl der Stackframes an, die von einem Stacktrace erfasst werden (unabhängig davon, ob er von `new Error().stack` oder `Error.captureStackTrace(obj)` generiert wurde).

Der Standardwert ist `10`, kann aber auf eine beliebige gültige JavaScript-Zahl gesetzt werden. Änderungen wirken sich auf alle Stacktraces aus, die *nachdem* der Wert geändert wurde, erfasst werden.

Wenn sie auf einen Wert gesetzt wird, der keine Zahl ist, oder auf eine negative Zahl gesetzt wird, erfassen Stacktraces keine Frames.

### `error.cause` {#errorcause}

**Hinzugefügt in: v16.9.0**

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Wenn vorhanden, ist die Eigenschaft `error.cause` die zugrunde liegende Ursache des `Error`. Sie wird verwendet, wenn ein Fehler abgefangen und ein neuer mit einer anderen Nachricht oder einem anderen Code ausgelöst wird, um weiterhin Zugriff auf den ursprünglichen Fehler zu haben.

Die Eigenschaft `error.cause` wird typischerweise durch Aufruf von `new Error(message, { cause })` gesetzt. Sie wird vom Konstruktor nicht gesetzt, wenn die Option `cause` nicht angegeben wird.

Diese Eigenschaft ermöglicht es, Fehler zu verketten. Beim Serialisieren von `Error`-Objekten serialisiert [`util.inspect()`](/de/nodejs/api/util#utilinspectobject-options) rekursiv `error.cause`, falls es gesetzt ist.

```js [ESM]
const cause = new Error('Der Remote-HTTP-Server antwortete mit dem Status 500');
const symptom = new Error('Die Nachricht konnte nicht gesendet werden', { cause });

console.log(symptom);
// Prints:
//   Error: Die Nachricht konnte nicht gesendet werden
//       at REPL2:1:17
//       at Script.runInThisContext (node:vm:130:12)
//       ... 7 lines matching cause stack trace ...
//       at [_line] [as _line] (node:internal/readline/interface:886:18) {
//     [cause]: Error: Der Remote-HTTP-Server antwortete mit dem Status 500
//         at REPL1:1:15
//         at Script.runInThisContext (node:vm:130:12)
//         at REPLServer.defaultEval (node:repl:574:29)
//         at bound (node:domain:426:15)
//         at REPLServer.runBound [as eval] (node:domain:437:12)
//         at REPLServer.onLine (node:repl:902:10)
//         at REPLServer.emit (node:events:549:35)
//         at REPLServer.emit (node:domain:482:12)
//         at [_onLine] [as _onLine] (node:internal/readline/interface:425:12)
//         at [_line] [as _line] (node:internal/readline/interface:886:18)
```

### `error.code` {#errorcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Eigenschaft `error.code` ist eine String-Kennzeichnung, die die Art des Fehlers identifiziert. `error.code` ist die stabilste Möglichkeit, einen Fehler zu identifizieren. Sie ändert sich nur zwischen Hauptversionen von Node.js. Im Gegensatz dazu können sich `error.message`-Strings zwischen beliebigen Versionen von Node.js ändern. Siehe [Node.js-Fehlercodes](/de/nodejs/api/errors#nodejs-error-codes) für Details zu bestimmten Codes.

### `error.message` {#errormessage}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Eigenschaft `error.message` ist die String-Beschreibung des Fehlers, wie sie durch Aufrufen von `new Error(message)` festgelegt wurde. Die an den Konstruktor übergebene `message` erscheint auch in der ersten Zeile des Stack-Traces des `Error`. Das Ändern dieser Eigenschaft nach der Erstellung des `Error`-Objekts *ändert möglicherweise nicht* die erste Zeile des Stack-Traces (z. B. wenn `error.stack` gelesen wird, bevor diese Eigenschaft geändert wird).

```js [ESM]
const err = new Error('Die Nachricht');
console.error(err.message);
// Gibt aus: Die Nachricht
```
### `error.stack` {#errorstack}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Eigenschaft `error.stack` ist ein String, der den Punkt im Code beschreibt, an dem der `Error` instanziiert wurde.

```bash [BASH]
Error: Dinge passieren immer wieder!
   at /home/gbusey/file.js:525:2
   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
   at increaseSynergy (/home/gbusey/actors.js:701:6)
```
Die erste Zeile ist als `\<Fehlerklassenname\>: \<Fehlermeldung\>` formatiert und wird von einer Reihe von Stack-Frames gefolgt (jede Zeile beginnt mit "at "). Jeder Frame beschreibt eine Aufrufstelle innerhalb des Codes, die zur Erzeugung des Fehlers geführt hat. V8 versucht, einen Namen für jede Funktion anzuzeigen (nach Variablenname, Funktionsname oder Objektmethodenname), aber gelegentlich kann es keinen geeigneten Namen finden. Wenn V8 keinen Namen für die Funktion bestimmen kann, werden für diesen Frame nur Standortinformationen angezeigt. Andernfalls wird der ermittelte Funktionsname mit Standortinformationen in Klammern angehängt angezeigt.

Frames werden nur für JavaScript-Funktionen generiert. Wenn beispielsweise die Ausführung synchron durch eine C++-Addon-Funktion namens `cheetahify` läuft, die selbst eine JavaScript-Funktion aufruft, ist der Frame, der den `cheetahify`-Aufruf darstellt, nicht in den Stack-Traces vorhanden:

```js [ESM]
const cheetahify = require('./native-binding.node');

function makeFaster() {
  // `cheetahify()` ruft *synchron* speedy auf.
  cheetahify(function speedy() {
    throw new Error('Oh nein!');
  });
}

makeFaster();
// wird auslösen:
//   /home/gbusey/file.js:6
//       throw new Error('Oh nein!');
//           ^
//   Error: Oh nein!
//       at speedy (/home/gbusey/file.js:6:11)
//       at makeFaster (/home/gbusey/file.js:5:3)
//       at Object.<anonymous> (/home/gbusey/file.js:10:1)
//       at Module._compile (module.js:456:26)
//       at Object.Module._extensions..js (module.js:474:10)
//       at Module.load (module.js:356:32)
//       at Function.Module._load (module.js:312:12)
//       at Function.Module.runMain (module.js:497:10)
//       at startup (node.js:119:16)
//       at node.js:906:3
```
Die Standortinformationen sind eine der folgenden:

- `native`, wenn der Frame einen Aufruf innerhalb von V8 darstellt (wie in `[].forEach`).
- `plain-filename.js:line:column`, wenn der Frame einen Aufruf innerhalb von Node.js darstellt.
- `/absolute/path/to/file.js:line:column`, wenn der Frame einen Aufruf in einem Benutzerprogramm (mit CommonJS-Modulsystem) oder dessen Abhängigkeiten darstellt.
- `\<transport-protocol\>:///url/to/module/file.mjs:line:column`, wenn der Frame einen Aufruf in einem Benutzerprogramm (mit ES-Modulsystem) oder dessen Abhängigkeiten darstellt.

Der String, der den Stack-Trace darstellt, wird verzögert generiert, wenn auf die Eigenschaft `error.stack` **zugegriffen** wird.

Die Anzahl der von der Stack-Trace erfassten Frames wird durch den kleineren Wert von `Error.stackTraceLimit` oder der Anzahl der verfügbaren Frames im aktuellen Event-Loop-Tick begrenzt.


## Klasse: `AssertionError` {#class-assertionerror}

- Erweitert: [\<errors.Error\>](/de/nodejs/api/errors#class-error)

Zeigt das Fehlschlagen einer Assertion an. Für Details siehe [`Klasse: assert.AssertionError`](/de/nodejs/api/assert#class-assertassertionerror).

## Klasse: `RangeError` {#class-rangeerror}

- Erweitert: [\<errors.Error\>](/de/nodejs/api/errors#class-error)

Zeigt an, dass ein bereitgestelltes Argument nicht innerhalb der Menge oder des Bereichs akzeptabler Werte für eine Funktion lag; sei es ein numerischer Bereich oder außerhalb der Menge der Optionen für einen bestimmten Funktionsparameter.

```js [ESM]
require('node:net').connect(-1);
// Wirft "RangeError: "port" option should be >= 0 and < 65536: -1"
```
Node.js generiert und wirft `RangeError`-Instanzen *sofort* als eine Form der Argumentvalidierung.

## Klasse: `ReferenceError` {#class-referenceerror}

- Erweitert: [\<errors.Error\>](/de/nodejs/api/errors#class-error)

Zeigt an, dass versucht wird, auf eine Variable zuzugreifen, die nicht definiert ist. Solche Fehler deuten häufig auf Tippfehler im Code oder ein anderweitig fehlerhaftes Programm hin.

Während Client-Code diese Fehler generieren und weiterleiten kann, tut dies in der Praxis nur V8.

```js [ESM]
doesNotExist;
// Wirft ReferenceError, doesNotExist ist keine Variable in diesem Programm.
```
Sofern eine Anwendung nicht dynamisch Code generiert und ausführt, weisen `ReferenceError`-Instanzen auf einen Fehler im Code oder seinen Abhängigkeiten hin.

## Klasse: `SyntaxError` {#class-syntaxerror}

- Erweitert: [\<errors.Error\>](/de/nodejs/api/errors#class-error)

Zeigt an, dass ein Programm kein gültiges JavaScript ist. Diese Fehler können nur als Ergebnis der Codeauswertung generiert und weitergeleitet werden. Die Codeauswertung kann als Ergebnis von `eval`, `Function`, `require` oder [vm](/de/nodejs/api/vm) erfolgen. Diese Fehler sind fast immer ein Zeichen für ein fehlerhaftes Programm.

```js [ESM]
try {
  require('node:vm').runInThisContext('binary ! isNotOk');
} catch (err) {
  // 'err' wird ein SyntaxError sein.
}
```
`SyntaxError`-Instanzen sind in dem Kontext, der sie erzeugt hat, nicht wiederherstellbar – sie können nur von anderen Kontexten abgefangen werden.

## Klasse: `SystemError` {#class-systemerror}

- Erweitert: [\<errors.Error\>](/de/nodejs/api/errors#class-error)

Node.js generiert Systemfehler, wenn Ausnahmen innerhalb seiner Laufzeitumgebung auftreten. Diese treten normalerweise auf, wenn eine Anwendung eine Einschränkung des Betriebssystems verletzt. Beispielsweise tritt ein Systemfehler auf, wenn eine Anwendung versucht, eine Datei zu lesen, die nicht existiert.

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Falls vorhanden, die Adresse, zu der eine Netzwerkverbindung fehlgeschlagen ist
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Zeichenfolgen-Fehlercode
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Falls vorhanden, der Dateipfad des Ziels bei der Meldung eines Dateisystemfehlers
- `errno` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die vom System bereitgestellte Fehlernummer
- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Falls vorhanden, zusätzliche Details zur Fehlerbedingung
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine vom System bereitgestellte, für Menschen lesbare Beschreibung des Fehlers
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Falls vorhanden, der Dateipfad bei der Meldung eines Dateisystemfehlers
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Falls vorhanden, der Netzwerkverbindungsport, der nicht verfügbar ist
- `syscall` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Name des Systemaufrufs, der den Fehler ausgelöst hat


### `error.address` {#erroraddress}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Falls vorhanden, ist `error.address` eine Zeichenkette, die die Adresse beschreibt, zu der eine Netzwerkverbindung fehlgeschlagen ist.

### `error.code` {#errorcode_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Eigenschaft `error.code` ist eine Zeichenkette, die den Fehlercode darstellt.

### `error.dest` {#errordest}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Falls vorhanden, ist `error.dest` der Dateipfad des Ziels, wenn ein Dateisystemfehler gemeldet wird.

### `error.errno` {#errorerrno}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Eigenschaft `error.errno` ist eine negative Zahl, die dem in [`libuv Error handling`](https://docs.libuv.org/en/v1.x/errors) definierten Fehlercode entspricht.

Unter Windows wird die vom System bereitgestellte Fehlernummer von libuv normalisiert.

Um die String-Repräsentation des Fehlercodes zu erhalten, verwende [`util.getSystemErrorName(error.errno)`](/de/nodejs/api/util#utilgetsystemerrornameerr).

### `error.info` {#errorinfo}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Falls vorhanden, ist `error.info` ein Objekt mit Details zum Fehlerzustand.

### `error.message` {#errormessage_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.message` ist eine vom System bereitgestellte, für Menschen lesbare Beschreibung des Fehlers.

### `error.path` {#errorpath}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Falls vorhanden, ist `error.path` eine Zeichenkette, die einen relevanten, ungültigen Pfadnamen enthält.

### `error.port` {#errorport}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Falls vorhanden, ist `error.port` der Netzwerkverbindungsport, der nicht verfügbar ist.

### `error.syscall` {#errorsyscall}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Eigenschaft `error.syscall` ist eine Zeichenkette, die den fehlgeschlagenen [Syscall](https://man7.org/linux/man-pages/man2/syscalls.2) beschreibt.


### Häufige Systemfehler {#common-system-errors}

Dies ist eine Liste von Systemfehlern, die häufig beim Schreiben eines Node.js-Programms auftreten. Eine umfassende Liste finden Sie in der [`errno`(3) Manpage](https://man7.org/linux/man-pages/man3/errno.3).

-  `EACCES` (Zugriff verweigert): Es wurde versucht, auf eine Datei in einer Weise zuzugreifen, die durch ihre Dateizugriffsberechtigungen verboten ist.
-  `EADDRINUSE` (Adresse wird bereits verwendet): Der Versuch, einen Server ([`net`](/de/nodejs/api/net), [`http`](/de/nodejs/api/http) oder [`https`](/de/nodejs/api/https)) an eine lokale Adresse zu binden, ist fehlgeschlagen, da bereits ein anderer Server auf dem lokalen System diese Adresse belegt.
-  `ECONNREFUSED` (Verbindung verweigert): Es konnte keine Verbindung hergestellt werden, weil der Zielrechner sie aktiv verweigert hat. Dies ist normalerweise die Folge des Versuchs, eine Verbindung zu einem Dienst herzustellen, der auf dem fremden Host inaktiv ist.
-  `ECONNRESET` (Verbindung vom Peer zurückgesetzt): Eine Verbindung wurde von einem Peer zwangsweise geschlossen. Dies ist normalerweise die Folge eines Verbindungsverlusts auf dem Remote-Socket aufgrund eines Timeouts oder eines Neustarts. Tritt häufig über die Module [`http`](/de/nodejs/api/http) und [`net`](/de/nodejs/api/net) auf.
-  `EEXIST` (Datei existiert): Eine vorhandene Datei war das Ziel einer Operation, die erforderte, dass das Ziel nicht existiert.
-  `EISDIR` (Ist ein Verzeichnis): Eine Operation erwartete eine Datei, aber der angegebene Pfadname war ein Verzeichnis.
-  `EMFILE` (Zu viele offene Dateien im System): Die maximal zulässige Anzahl von [Dateideskriptoren](https://en.wikipedia.org/wiki/File_descriptor) auf dem System ist erreicht, und Anfragen nach einem weiteren Deskriptor können erst erfüllt werden, wenn mindestens einer geschlossen wurde. Dies tritt auf, wenn viele Dateien gleichzeitig parallel geöffnet werden, insbesondere auf Systemen (insbesondere macOS), auf denen es eine niedrige Dateideskriptorbegrenzung für Prozesse gibt. Um eine niedrige Begrenzung zu beheben, führen Sie `ulimit -n 2048` in derselben Shell aus, in der der Node.js-Prozess ausgeführt wird.
-  `ENOENT` (Datei oder Verzeichnis nicht gefunden): Wird häufig von [`fs`](/de/nodejs/api/fs)-Operationen ausgelöst, um anzuzeigen, dass eine Komponente des angegebenen Pfadnamens nicht vorhanden ist. Es konnte keine Entität (Datei oder Verzeichnis) unter dem angegebenen Pfad gefunden werden.
-  `ENOTDIR` (Kein Verzeichnis): Eine Komponente des angegebenen Pfadnamens existierte, war aber kein Verzeichnis wie erwartet. Wird häufig von [`fs.readdir`](/de/nodejs/api/fs#fsreaddirpath-options-callback) ausgelöst.
-  `ENOTEMPTY` (Verzeichnis ist nicht leer): Ein Verzeichnis mit Einträgen war das Ziel einer Operation, die ein leeres Verzeichnis erfordert, normalerweise [`fs.unlink`](/de/nodejs/api/fs#fsunlinkpath-callback).
-  `ENOTFOUND` (DNS-Lookup fehlgeschlagen): Zeigt einen DNS-Fehler von entweder `EAI_NODATA` oder `EAI_NONAME` an. Dies ist kein Standard-POSIX-Fehler.
-  `EPERM` (Operation nicht erlaubt): Es wurde versucht, eine Operation durchzuführen, die erhöhte Privilegien erfordert.
-  `EPIPE` (Broken Pipe): Ein Schreibvorgang auf eine Pipe, einen Socket oder eine FIFO, für die kein Prozess zum Lesen der Daten vorhanden ist. Tritt häufig in den Schichten [`net`](/de/nodejs/api/net) und [`http`](/de/nodejs/api/http) auf und zeigt an, dass die Remote-Seite des Streams, in den geschrieben wird, geschlossen wurde.
-  `ETIMEDOUT` (Zeitüberschreitung bei der Operation): Eine Verbindungs- oder Sendeanforderung ist fehlgeschlagen, weil die verbundene Partei nach einer bestimmten Zeit nicht ordnungsgemäß geantwortet hat. Tritt normalerweise bei [`http`](/de/nodejs/api/http) oder [`net`](/de/nodejs/api/net) auf. Oft ein Zeichen dafür, dass `socket.end()` nicht ordnungsgemäß aufgerufen wurde.


## Klasse: `TypeError` {#class-typeerror}

- Erweitert [\<errors.Error\>](/de/nodejs/api/errors#class-error)

Zeigt an, dass ein bereitgestelltes Argument kein zulässiger Typ ist. Beispielsweise würde das Übergeben einer Funktion an einen Parameter, der eine Zeichenkette erwartet, ein `TypeError` sein.

```js [ESM]
require('node:url').parse(() => { });
// Wirft TypeError, da eine Zeichenkette erwartet wurde.
```
Node.js generiert und wirft `TypeError`-Instanzen *sofort* als eine Form der Argumentvalidierung.

## Ausnahmen vs. Fehler {#exceptions-vs-errors}

Eine JavaScript-Ausnahme ist ein Wert, der als Ergebnis einer ungültigen Operation oder als Ziel einer `throw`-Anweisung geworfen wird. Obwohl es nicht erforderlich ist, dass diese Werte Instanzen von `Error` oder von Klassen sind, die von `Error` erben, *sind* alle Ausnahmen, die von Node.js oder der JavaScript-Runtime geworfen werden, Instanzen von `Error`.

Einige Ausnahmen sind auf der JavaScript-Ebene *nicht wiederherstellbar*. Solche Ausnahmen führen *immer* zum Absturz des Node.js-Prozesses. Beispiele hierfür sind `assert()`-Prüfungen oder `abort()`-Aufrufe in der C++-Ebene.

## OpenSSL-Fehler {#openssl-errors}

Fehler, die in `crypto` oder `tls` ihren Ursprung haben, sind von der Klasse `Error` und können zusätzlich zu den Standardeigenschaften `.code` und `.message` einige zusätzliche OpenSSL-spezifische Eigenschaften aufweisen.

### `error.opensslErrorStack` {#erroropensslerrorstack}

Ein Array von Fehlern, das Kontext dazu geben kann, wo in der OpenSSL-Bibliothek ein Fehler seinen Ursprung hat.

### `error.function` {#errorfunction}

Die OpenSSL-Funktion, in der der Fehler seinen Ursprung hat.

### `error.library` {#errorlibrary}

Die OpenSSL-Bibliothek, in der der Fehler seinen Ursprung hat.

### `error.reason` {#errorreason}

Eine für Menschen lesbare Zeichenkette, die den Grund für den Fehler beschreibt.

## Node.js Fehlercodes {#nodejs-error-codes}

### `ABORT_ERR` {#abort_err}

**Hinzugefügt in: v15.0.0**

Wird verwendet, wenn ein Vorgang abgebrochen wurde (typischerweise mit einem `AbortController`).

APIs, die *keine* `AbortSignal` verwenden, werfen typischerweise keinen Fehler mit diesem Code.

Dieser Code verwendet nicht die reguläre `ERR_*`-Konvention, die Node.js-Fehler verwenden, um mit dem `AbortError` der Webplattform kompatibel zu sein.

### `ERR_ACCESS_DENIED` {#err_access_denied}

Eine spezielle Art von Fehler, der ausgelöst wird, wenn Node.js versucht, auf eine Ressource zuzugreifen, die durch das [Berechtigungsmodell](/de/nodejs/api/permissions#permission-model) eingeschränkt ist.


### `ERR_AMBIGUOUS_ARGUMENT` {#err_ambiguous_argument}

Ein Funktionsargument wird so verwendet, dass die Funktionssignatur möglicherweise missverstanden wird. Dies wird vom `node:assert`-Modul ausgelöst, wenn der Parameter `message` in `assert.throws(block, message)` mit der von `block` ausgelösten Fehlermeldung übereinstimmt, da diese Verwendung darauf hindeutet, dass der Benutzer glaubt, `message` sei die erwartete Meldung und nicht die Meldung, die `AssertionError` anzeigt, wenn `block` keine Ausnahme auslöst.

### `ERR_ARG_NOT_ITERABLE` {#err_arg_not_iterable}

Ein iterierbares Argument (d. h. ein Wert, der mit `for...of`-Schleifen funktioniert) wurde benötigt, aber nicht an eine Node.js-API übergeben.

### `ERR_ASSERTION` {#err_assertion}

Ein spezieller Fehlertyp, der ausgelöst werden kann, wenn Node.js eine außergewöhnliche Logikverletzung feststellt, die niemals auftreten sollte. Diese werden typischerweise vom `node:assert`-Modul ausgelöst.

### `ERR_ASYNC_CALLBACK` {#err_async_callback}

Es wurde versucht, etwas, das keine Funktion ist, als `AsyncHooks`-Callback zu registrieren.

### `ERR_ASYNC_TYPE` {#err_async_type}

Der Typ einer asynchronen Ressource war ungültig. Benutzer können auch ihre eigenen Typen definieren, wenn sie die öffentliche Embedder-API verwenden.

### `ERR_BROTLI_COMPRESSION_FAILED` {#err_brotli_compression_failed}

Daten, die an einen Brotli-Stream übergeben wurden, wurden nicht erfolgreich komprimiert.

### `ERR_BROTLI_INVALID_PARAM` {#err_brotli_invalid_param}

Während der Konstruktion eines Brotli-Streams wurde ein ungültiger Parameterschlüssel übergeben.

### `ERR_BUFFER_CONTEXT_NOT_AVAILABLE` {#err_buffer_context_not_available}

Es wurde versucht, eine Node.js `Buffer`-Instanz aus Addon- oder Embedder-Code zu erstellen, während sich die JS-Engine in einem Kontext befindet, der nicht mit einer Node.js-Instanz verbunden ist. Die an die `Buffer`-Methode übergebenen Daten sind zum Zeitpunkt der Rückgabe der Methode freigegeben worden.

Wenn dieser Fehler auftritt, ist eine mögliche Alternative zur Erstellung einer `Buffer`-Instanz die Erstellung eines normalen `Uint8Array`, der sich nur im Prototyp des resultierenden Objekts unterscheidet. `Uint8Array`s werden im Allgemeinen in allen Node.js-Kern-APIs akzeptiert, in denen `Buffer`s verwendet werden; sie sind in allen Kontexten verfügbar.

### `ERR_BUFFER_OUT_OF_BOUNDS` {#err_buffer_out_of_bounds}

Es wurde ein Vorgang außerhalb der Grenzen eines `Buffer` versucht.

### `ERR_BUFFER_TOO_LARGE` {#err_buffer_too_large}

Es wurde versucht, einen `Buffer` zu erstellen, der größer als die maximal zulässige Größe ist.


### `ERR_CANNOT_WATCH_SIGINT` {#err_cannot_watch_sigint}

Node.js konnte das `SIGINT`-Signal nicht überwachen.

### `ERR_CHILD_CLOSED_BEFORE_REPLY` {#err_child_closed_before_reply}

Ein Kindprozess wurde geschlossen, bevor das Elternteil eine Antwort erhalten hat.

### `ERR_CHILD_PROCESS_IPC_REQUIRED` {#err_child_process_ipc_required}

Wird verwendet, wenn ein Kindprozess ohne Angabe eines IPC-Kanals geforkt wird.

### `ERR_CHILD_PROCESS_STDIO_MAXBUFFER` {#err_child_process_stdio_maxbuffer}

Wird verwendet, wenn der Hauptprozess versucht, Daten von der STDERR/STDOUT des Kindprozesses zu lesen, und die Länge der Daten größer ist als die Option `maxBuffer`.

### `ERR_CLOSED_MESSAGE_PORT` {#err_closed_message_port}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.2.0, v14.17.1 | Die Fehlermeldung wurde wieder eingeführt. |
| v11.12.0 | Die Fehlermeldung wurde entfernt. |
| v10.5.0 | Hinzugefügt in: v10.5.0 |
:::

Es wurde versucht, eine `MessagePort`-Instanz in einem geschlossenen Zustand zu verwenden, normalerweise nachdem `.close()` aufgerufen wurde.

### `ERR_CONSOLE_WRITABLE_STREAM` {#err_console_writable_stream}

`Console` wurde ohne `stdout`-Stream instanziiert, oder `Console` hat einen nicht-beschreibbaren `stdout`- oder `stderr`-Stream.

### `ERR_CONSTRUCT_CALL_INVALID` {#err_construct_call_invalid}

**Hinzugefügt in: v12.5.0**

Ein Klassenkonstruktor wurde aufgerufen, der nicht aufrufbar ist.

### `ERR_CONSTRUCT_CALL_REQUIRED` {#err_construct_call_required}

Ein Konstruktor für eine Klasse wurde ohne `new` aufgerufen.

### `ERR_CONTEXT_NOT_INITIALIZED` {#err_context_not_initialized}

Der in die API übergebene vm-Kontext ist noch nicht initialisiert. Dies kann passieren, wenn während der Erstellung des Kontexts ein Fehler auftritt (und abgefangen wird), z. B. wenn die Zuweisung fehlschlägt oder die maximale Aufrufstapelgröße erreicht wird, wenn der Kontext erstellt wird.

### `ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED` {#err_crypto_custom_engine_not_supported}

Eine OpenSSL-Engine wurde angefordert (z. B. über die TLS-Optionen `clientCertEngine` oder `privateKeyEngine`), die von der verwendeten OpenSSL-Version nicht unterstützt wird, wahrscheinlich aufgrund des Kompilierzeit-Flags `OPENSSL_NO_ENGINE`.

### `ERR_CRYPTO_ECDH_INVALID_FORMAT` {#err_crypto_ecdh_invalid_format}

Ein ungültiger Wert für das Argument `format` wurde an die Methode `getPublicKey()` der Klasse `crypto.ECDH()` übergeben.

### `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` {#err_crypto_ecdh_invalid_public_key}

Ein ungültiger Wert für das Argument `key` wurde an die Methode `computeSecret()` der Klasse `crypto.ECDH()` übergeben. Dies bedeutet, dass der öffentliche Schlüssel außerhalb der elliptischen Kurve liegt.


### `ERR_CRYPTO_ENGINE_UNKNOWN` {#err_crypto_engine_unknown}

Eine ungültige Krypto-Engine-Kennung wurde an [`require('node:crypto').setEngine()`](/de/nodejs/api/crypto#cryptosetengineengine-flags) übergeben.

### `ERR_CRYPTO_FIPS_FORCED` {#err_crypto_fips_forced}

Das Befehlszeilenargument [`--force-fips`](/de/nodejs/api/cli#--force-fips) wurde verwendet, aber es gab einen Versuch, den FIPS-Modus im `node:crypto`-Modul zu aktivieren oder zu deaktivieren.

### `ERR_CRYPTO_FIPS_UNAVAILABLE` {#err_crypto_fips_unavailable}

Es wurde versucht, den FIPS-Modus zu aktivieren oder zu deaktivieren, aber der FIPS-Modus war nicht verfügbar.

### `ERR_CRYPTO_HASH_FINALIZED` {#err_crypto_hash_finalized}

[`hash.digest()`](/de/nodejs/api/crypto#hashdigestencoding) wurde mehrfach aufgerufen. Die Methode `hash.digest()` darf pro Instanz eines `Hash`-Objekts höchstens einmal aufgerufen werden.

### `ERR_CRYPTO_HASH_UPDATE_FAILED` {#err_crypto_hash_update_failed}

[`hash.update()`](/de/nodejs/api/crypto#hashupdatedata-inputencoding) ist aus irgendeinem Grund fehlgeschlagen. Dies sollte selten bis gar nicht vorkommen.

### `ERR_CRYPTO_INCOMPATIBLE_KEY` {#err_crypto_incompatible_key}

Die angegebenen Krypto-Schlüssel sind mit der versuchten Operation inkompatibel.

### `ERR_CRYPTO_INCOMPATIBLE_KEY_OPTIONS` {#err_crypto_incompatible_key_options}

Die ausgewählte öffentliche oder private Schlüsselcodierung ist mit anderen Optionen inkompatibel.

### `ERR_CRYPTO_INITIALIZATION_FAILED` {#err_crypto_initialization_failed}

**Hinzugefügt in: v15.0.0**

Die Initialisierung des Krypto-Subsystems ist fehlgeschlagen.

### `ERR_CRYPTO_INVALID_AUTH_TAG` {#err_crypto_invalid_auth_tag}

**Hinzugefügt in: v15.0.0**

Ein ungültiges Authentifizierungs-Tag wurde bereitgestellt.

### `ERR_CRYPTO_INVALID_COUNTER` {#err_crypto_invalid_counter}

**Hinzugefügt in: v15.0.0**

Ein ungültiger Zähler wurde für einen Zählermodus-Cipher bereitgestellt.

### `ERR_CRYPTO_INVALID_CURVE` {#err_crypto_invalid_curve}

**Hinzugefügt in: v15.0.0**

Eine ungültige elliptische Kurve wurde bereitgestellt.

### `ERR_CRYPTO_INVALID_DIGEST` {#err_crypto_invalid_digest}

Ein ungültiger [Krypto-Digest-Algorithmus](/de/nodejs/api/crypto#cryptogethashes) wurde angegeben.

### `ERR_CRYPTO_INVALID_IV` {#err_crypto_invalid_iv}

**Hinzugefügt in: v15.0.0**

Ein ungültiger Initialisierungsvektor wurde bereitgestellt.

### `ERR_CRYPTO_INVALID_JWK` {#err_crypto_invalid_jwk}

**Hinzugefügt in: v15.0.0**

Ein ungültiger JSON Web Key wurde bereitgestellt.

### `ERR_CRYPTO_INVALID_KEYLEN` {#err_crypto_invalid_keylen}

**Hinzugefügt in: v15.0.0**

Eine ungültige Schlüssellänge wurde bereitgestellt.

### `ERR_CRYPTO_INVALID_KEYPAIR` {#err_crypto_invalid_keypair}

**Hinzugefügt in: v15.0.0**

Ein ungültiges Schlüsselpaar wurde bereitgestellt.

### `ERR_CRYPTO_INVALID_KEYTYPE` {#err_crypto_invalid_keytype}

**Hinzugefügt in: v15.0.0**

Ein ungültiger Schlüsseltyp wurde bereitgestellt.


### `ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE` {#err_crypto_invalid_key_object_type}

Der Typ des angegebenen Krypto-Schlüsselobjekts ist für die versuchte Operation ungültig.

### `ERR_CRYPTO_INVALID_MESSAGELEN` {#err_crypto_invalid_messagelen}

**Hinzugefügt in: v15.0.0**

Es wurde eine ungültige Nachrichtenlänge angegeben.

### `ERR_CRYPTO_INVALID_SCRYPT_PARAMS` {#err_crypto_invalid_scrypt_params}

**Hinzugefügt in: v15.0.0**

Einer oder mehrere Parameter von [`crypto.scrypt()`](/de/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) oder [`crypto.scryptSync()`](/de/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options) liegen außerhalb ihres zulässigen Bereichs.

### `ERR_CRYPTO_INVALID_STATE` {#err_crypto_invalid_state}

Eine Krypto-Methode wurde auf einem Objekt verwendet, das sich in einem ungültigen Zustand befand. Zum Beispiel der Aufruf von [`cipher.getAuthTag()`](/de/nodejs/api/crypto#ciphergetauthtag), bevor `cipher.final()` aufgerufen wurde.

### `ERR_CRYPTO_INVALID_TAG_LENGTH` {#err_crypto_invalid_tag_length}

**Hinzugefügt in: v15.0.0**

Es wurde eine ungültige Länge des Authentifizierungstags angegeben.

### `ERR_CRYPTO_JOB_INIT_FAILED` {#err_crypto_job_init_failed}

**Hinzugefügt in: v15.0.0**

Die Initialisierung einer asynchronen Krypto-Operation ist fehlgeschlagen.

### `ERR_CRYPTO_JWK_UNSUPPORTED_CURVE` {#err_crypto_jwk_unsupported_curve}

Die elliptische Kurve des Schlüssels ist nicht für die Verwendung in der [JSON Web Key Elliptic Curve Registry](https://www.iana.org/assignments/jose/jose.xhtml#web-key-elliptic-curve) registriert.

### `ERR_CRYPTO_JWK_UNSUPPORTED_KEY_TYPE` {#err_crypto_jwk_unsupported_key_type}

Der asymmetrische Schlüsseltyp des Schlüssels ist nicht für die Verwendung in der [JSON Web Key Types Registry](https://www.iana.org/assignments/jose/jose.xhtml#web-key-types) registriert.

### `ERR_CRYPTO_OPERATION_FAILED` {#err_crypto_operation_failed}

**Hinzugefügt in: v15.0.0**

Eine Krypto-Operation ist aus einem ansonsten nicht spezifizierten Grund fehlgeschlagen.

### `ERR_CRYPTO_PBKDF2_ERROR` {#err_crypto_pbkdf2_error}

Der PBKDF2-Algorithmus ist aus nicht spezifizierten Gründen fehlgeschlagen. OpenSSL liefert keine weiteren Details und daher auch Node.js nicht.

### `ERR_CRYPTO_SCRYPT_NOT_SUPPORTED` {#err_crypto_scrypt_not_supported}

Node.js wurde ohne `scrypt`-Unterstützung kompiliert. Mit den offiziellen Release-Binaries nicht möglich, kann aber bei benutzerdefinierten Builds, einschließlich Distro-Builds, vorkommen.

### `ERR_CRYPTO_SIGN_KEY_REQUIRED` {#err_crypto_sign_key_required}

Es wurde kein Signier-`key` an die Methode [`sign.sign()`](/de/nodejs/api/crypto#signsignprivatekey-outputencoding) übergeben.

### `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` {#err_crypto_timing_safe_equal_length}

[`crypto.timingSafeEqual()`](/de/nodejs/api/crypto#cryptotimingsafeequala-b) wurde mit `Buffer-`, `TypedArray-` oder `DataView`-Argumenten unterschiedlicher Länge aufgerufen.


### `ERR_CRYPTO_UNKNOWN_CIPHER` {#err_crypto_unknown_cipher}

Es wurde eine unbekannte Chiffre angegeben.

### `ERR_CRYPTO_UNKNOWN_DH_GROUP` {#err_crypto_unknown_dh_group}

Es wurde ein unbekannter Diffie-Hellman-Gruppenname angegeben. Siehe [`crypto.getDiffieHellman()`](/de/nodejs/api/crypto#cryptogetdiffiehellmangroupname) für eine Liste gültiger Gruppennamen.

### `ERR_CRYPTO_UNSUPPORTED_OPERATION` {#err_crypto_unsupported_operation}

**Hinzugefügt in: v15.0.0, v14.18.0**

Es wurde versucht, eine nicht unterstützte Krypto-Operation aufzurufen.

### `ERR_DEBUGGER_ERROR` {#err_debugger_error}

**Hinzugefügt in: v16.4.0, v14.17.4**

Es ist ein Fehler mit dem [Debugger](/de/nodejs/api/debugger) aufgetreten.

### `ERR_DEBUGGER_STARTUP_ERROR` {#err_debugger_startup_error}

**Hinzugefügt in: v16.4.0, v14.17.4**

Beim [Debugger](/de/nodejs/api/debugger) ist eine Zeitüberschreitung aufgetreten, während darauf gewartet wurde, dass der erforderliche Host/Port frei wird.

### `ERR_DIR_CLOSED` {#err_dir_closed}

Das [`fs.Dir`](/de/nodejs/api/fs#class-fsdir) wurde zuvor geschlossen.

### `ERR_DIR_CONCURRENT_OPERATION` {#err_dir_concurrent_operation}

**Hinzugefügt in: v14.3.0**

Es wurde versucht, einen synchronen Lese- oder Schließaufruf auf einem [`fs.Dir`](/de/nodejs/api/fs#class-fsdir) durchzuführen, der laufende asynchrone Operationen hat.

### `ERR_DLOPEN_DISABLED` {#err_dlopen_disabled}

**Hinzugefügt in: v16.10.0, v14.19.0**

Das Laden nativer Addons wurde mit [`--no-addons`](/de/nodejs/api/cli#--no-addons) deaktiviert.

### `ERR_DLOPEN_FAILED` {#err_dlopen_failed}

**Hinzugefügt in: v15.0.0**

Ein Aufruf von `process.dlopen()` ist fehlgeschlagen.

### `ERR_DNS_SET_SERVERS_FAILED` {#err_dns_set_servers_failed}

`c-ares` konnte den DNS-Server nicht festlegen.

### `ERR_DOMAIN_CALLBACK_NOT_AVAILABLE` {#err_domain_callback_not_available}

Das Modul `node:domain` war nicht verwendbar, da es die erforderlichen Fehlerbehandlungshooks nicht einrichten konnte, da [`process.setUncaughtExceptionCaptureCallback()`](/de/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) zu einem früheren Zeitpunkt aufgerufen worden war.

### `ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE` {#err_domain_cannot_set_uncaught_exception_capture}

[`process.setUncaughtExceptionCaptureCallback()`](/de/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) konnte nicht aufgerufen werden, da das Modul `node:domain` zu einem früheren Zeitpunkt geladen wurde.

Die Stack-Trace wird erweitert, um den Zeitpunkt einzubeziehen, zu dem das Modul `node:domain` geladen wurde.

### `ERR_DUPLICATE_STARTUP_SNAPSHOT_MAIN_FUNCTION` {#err_duplicate_startup_snapshot_main_function}

[`v8.startupSnapshot.setDeserializeMainFunction()`](/de/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) konnte nicht aufgerufen werden, da es bereits zuvor aufgerufen wurde.


### `ERR_ENCODING_INVALID_ENCODED_DATA` {#err_encoding_invalid_encoded_data}

Die an die `TextDecoder()` API übergebenen Daten waren gemäß der bereitgestellten Kodierung ungültig.

### `ERR_ENCODING_NOT_SUPPORTED` {#err_encoding_not_supported}

Die an die `TextDecoder()` API übergebene Kodierung war keine der [WHATWG Supported Encodings](/de/nodejs/api/util#whatwg-supported-encodings).

### `ERR_EVAL_ESM_CANNOT_PRINT` {#err_eval_esm_cannot_print}

`--print` kann nicht mit ESM-Eingaben verwendet werden.

### `ERR_EVENT_RECURSION` {#err_event_recursion}

Wird ausgelöst, wenn versucht wird, ein Ereignis rekursiv auf `EventTarget` zu verteilen.

### `ERR_EXECUTION_ENVIRONMENT_NOT_AVAILABLE` {#err_execution_environment_not_available}

Der JS-Ausführungskontext ist nicht mit einer Node.js-Umgebung verknüpft. Dies kann vorkommen, wenn Node.js als eingebettete Bibliothek verwendet wird und einige Hooks für die JS-Engine nicht korrekt eingerichtet sind.

### `ERR_FALSY_VALUE_REJECTION` {#err_falsy_value_rejection}

Ein `Promise`, das über `util.callbackify()` callbackifiziert wurde, wurde mit einem Falsy-Wert verworfen.

### `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` {#err_feature_unavailable_on_platform}

**Hinzugefügt in: v14.0.0**

Wird verwendet, wenn eine Funktion verwendet wird, die für die aktuelle Plattform, auf der Node.js ausgeführt wird, nicht verfügbar ist.

### `ERR_FS_CP_DIR_TO_NON_DIR` {#err_fs_cp_dir_to_non_dir}

**Hinzugefügt in: v16.7.0**

Es wurde versucht, ein Verzeichnis in eine Nicht-Verzeichnis (Datei, Symlink usw.) mit [`fs.cp()`](/de/nodejs/api/fs#fscpsrc-dest-options-callback) zu kopieren.

### `ERR_FS_CP_EEXIST` {#err_fs_cp_eexist}

**Hinzugefügt in: v16.7.0**

Es wurde versucht, eine bereits vorhandene Datei mit [`fs.cp()`](/de/nodejs/api/fs#fscpsrc-dest-options-callback) zu überschreiben, wobei `force` und `errorOnExist` auf `true` gesetzt waren.

### `ERR_FS_CP_EINVAL` {#err_fs_cp_einval}

**Hinzugefügt in: v16.7.0**

Bei Verwendung von [`fs.cp()`](/de/nodejs/api/fs#fscpsrc-dest-options-callback) verwies `src` oder `dest` auf einen ungültigen Pfad.

### `ERR_FS_CP_FIFO_PIPE` {#err_fs_cp_fifo_pipe}

**Hinzugefügt in: v16.7.0**

Es wurde versucht, eine Named Pipe mit [`fs.cp()`](/de/nodejs/api/fs#fscpsrc-dest-options-callback) zu kopieren.

### `ERR_FS_CP_NON_DIR_TO_DIR` {#err_fs_cp_non_dir_to_dir}

**Hinzugefügt in: v16.7.0**

Es wurde versucht, eine Nicht-Verzeichnis (Datei, Symlink usw.) in ein Verzeichnis mit [`fs.cp()`](/de/nodejs/api/fs#fscpsrc-dest-options-callback) zu kopieren.

### `ERR_FS_CP_SOCKET` {#err_fs_cp_socket}

**Hinzugefügt in: v16.7.0**

Es wurde versucht, mit [`fs.cp()`](/de/nodejs/api/fs#fscpsrc-dest-options-callback) in einen Socket zu kopieren.


### `ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY` {#err_fs_cp_symlink_to_subdirectory}

**Hinzugefügt in: v16.7.0**

Bei der Verwendung von [`fs.cp()`](/de/nodejs/api/fs#fscpsrc-dest-options-callback) zeigte ein Symlink in `dest` auf ein Unterverzeichnis von `src`.

### `ERR_FS_CP_UNKNOWN` {#err_fs_cp_unknown}

**Hinzugefügt in: v16.7.0**

Es wurde versucht, mit [`fs.cp()`](/de/nodejs/api/fs#fscpsrc-dest-options-callback) in einen unbekannten Dateityp zu kopieren.

### `ERR_FS_EISDIR` {#err_fs_eisdir}

Pfad ist ein Verzeichnis.

### `ERR_FS_FILE_TOO_LARGE` {#err_fs_file_too_large}

Es wurde versucht, eine Datei zu lesen, deren Größe die maximal zulässige Größe für einen `Buffer` überschreitet.

### `ERR_HTTP2_ALTSVC_INVALID_ORIGIN` {#err_http2_altsvc_invalid_origin}

HTTP/2 ALTSVC Frames erfordern einen gültigen Ursprung.

### `ERR_HTTP2_ALTSVC_LENGTH` {#err_http2_altsvc_length}

HTTP/2 ALTSVC Frames sind auf maximal 16.382 Payload-Bytes begrenzt.

### `ERR_HTTP2_CONNECT_AUTHORITY` {#err_http2_connect_authority}

Für HTTP/2-Anfragen, die die `CONNECT`-Methode verwenden, ist der Pseudo-Header `:authority` erforderlich.

### `ERR_HTTP2_CONNECT_PATH` {#err_http2_connect_path}

Für HTTP/2-Anfragen, die die `CONNECT`-Methode verwenden, ist der Pseudo-Header `:path` verboten.

### `ERR_HTTP2_CONNECT_SCHEME` {#err_http2_connect_scheme}

Für HTTP/2-Anfragen, die die `CONNECT`-Methode verwenden, ist der Pseudo-Header `:scheme` verboten.

### `ERR_HTTP2_ERROR` {#err_http2_error}

Es ist ein nicht spezifischer HTTP/2-Fehler aufgetreten.

### `ERR_HTTP2_GOAWAY_SESSION` {#err_http2_goaway_session}

Nachdem die `Http2Session` einen `GOAWAY`-Frame vom verbundenen Peer empfangen hat, dürfen keine neuen HTTP/2-Streams mehr geöffnet werden.

### `ERR_HTTP2_HEADERS_AFTER_RESPOND` {#err_http2_headers_after_respond}

Nachdem eine HTTP/2-Antwort initiiert wurde, wurden zusätzliche Header angegeben.

### `ERR_HTTP2_HEADERS_SENT` {#err_http2_headers_sent}

Es wurde versucht, mehrere Antwort-Header zu senden.

### `ERR_HTTP2_HEADER_SINGLE_VALUE` {#err_http2_header_single_value}

Für ein HTTP/2-Header-Feld, das nur einen einzigen Wert haben sollte, wurden mehrere Werte angegeben.

### `ERR_HTTP2_INFO_STATUS_NOT_ALLOWED` {#err_http2_info_status_not_allowed}

Informationelle HTTP-Statuscodes (`1xx`) dürfen nicht als Antwortstatuscode für HTTP/2-Antworten festgelegt werden.

### `ERR_HTTP2_INVALID_CONNECTION_HEADERS` {#err_http2_invalid_connection_headers}

HTTP/1-Verbindungsspezifische Header dürfen nicht in HTTP/2-Anfragen und -Antworten verwendet werden.

### `ERR_HTTP2_INVALID_HEADER_VALUE` {#err_http2_invalid_header_value}

Es wurde ein ungültiger HTTP/2-Header-Wert angegeben.


### `ERR_HTTP2_INVALID_INFO_STATUS` {#err_http2_invalid_info_status}

Es wurde ein ungültiger HTTP-Informationsstatuscode angegeben. Informationsstatuscodes müssen eine Ganzzahl zwischen `100` und `199` (einschließlich) sein.

### `ERR_HTTP2_INVALID_ORIGIN` {#err_http2_invalid_origin}

HTTP/2 `ORIGIN`-Frames erfordern einen gültigen Ursprung.

### `ERR_HTTP2_INVALID_PACKED_SETTINGS_LENGTH` {#err_http2_invalid_packed_settings_length}

Eingabe `Buffer`- und `Uint8Array`-Instanzen, die an die `http2.getUnpackedSettings()`-API übergeben werden, müssen eine Länge haben, die ein Vielfaches von sechs ist.

### `ERR_HTTP2_INVALID_PSEUDOHEADER` {#err_http2_invalid_pseudoheader}

Es dürfen nur gültige HTTP/2-Pseudo-Header (`:status`, `:path`, `:authority`, `:scheme` und `:method`) verwendet werden.

### `ERR_HTTP2_INVALID_SESSION` {#err_http2_invalid_session}

Es wurde eine Aktion auf einem `Http2Session`-Objekt durchgeführt, das bereits zerstört wurde.

### `ERR_HTTP2_INVALID_SETTING_VALUE` {#err_http2_invalid_setting_value}

Es wurde ein ungültiger Wert für eine HTTP/2-Einstellung angegeben.

### `ERR_HTTP2_INVALID_STREAM` {#err_http2_invalid_stream}

Es wurde eine Operation auf einem Stream ausgeführt, der bereits zerstört wurde.

### `ERR_HTTP2_MAX_PENDING_SETTINGS_ACK` {#err_http2_max_pending_settings_ack}

Wann immer ein HTTP/2 `SETTINGS`-Frame an einen verbundenen Peer gesendet wird, ist der Peer verpflichtet, eine Bestätigung zu senden, dass er die neuen `SETTINGS` empfangen und angewendet hat. Standardmäßig kann eine maximale Anzahl von unbestätigten `SETTINGS`-Frames zu einem bestimmten Zeitpunkt gesendet werden. Dieser Fehlercode wird verwendet, wenn dieses Limit erreicht wurde.

### `ERR_HTTP2_NESTED_PUSH` {#err_http2_nested_push}

Es wurde versucht, einen neuen Push-Stream innerhalb eines Push-Streams zu initiieren. Verschachtelte Push-Streams sind nicht zulässig.

### `ERR_HTTP2_NO_MEM` {#err_http2_no_mem}

Nicht genügend Speicher bei Verwendung der `http2session.setLocalWindowSize(windowSize)` API.

### `ERR_HTTP2_NO_SOCKET_MANIPULATION` {#err_http2_no_socket_manipulation}

Es wurde versucht, einen Socket, der an eine `Http2Session` angehängt ist, direkt zu manipulieren (lesen, schreiben, pausieren, fortsetzen usw.).

### `ERR_HTTP2_ORIGIN_LENGTH` {#err_http2_origin_length}

HTTP/2 `ORIGIN`-Frames sind auf eine Länge von 16382 Byte begrenzt.

### `ERR_HTTP2_OUT_OF_STREAMS` {#err_http2_out_of_streams}

Die Anzahl der Streams, die in einer einzelnen HTTP/2-Sitzung erstellt wurden, hat das maximale Limit erreicht.

### `ERR_HTTP2_PAYLOAD_FORBIDDEN` {#err_http2_payload_forbidden}

Es wurde eine Nachrichten-Payload für einen HTTP-Antwortcode angegeben, für den eine Payload verboten ist.


### `ERR_HTTP2_PING_CANCEL` {#err_http2_ping_cancel}

Ein HTTP/2-Ping wurde abgebrochen.

### `ERR_HTTP2_PING_LENGTH` {#err_http2_ping_length}

HTTP/2-Ping-Nutzlasten müssen genau 8 Byte lang sein.

### `ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED` {#err_http2_pseudoheader_not_allowed}

Ein HTTP/2-Pseudo-Header wurde unangemessen verwendet. Pseudo-Header sind Header-Schlüsselnamen, die mit dem Präfix `:` beginnen.

### `ERR_HTTP2_PUSH_DISABLED` {#err_http2_push_disabled}

Es wurde versucht, einen Push-Stream zu erstellen, der vom Client deaktiviert wurde.

### `ERR_HTTP2_SEND_FILE` {#err_http2_send_file}

Es wurde versucht, die `Http2Stream.prototype.responseWithFile()`-API zu verwenden, um ein Verzeichnis zu senden.

### `ERR_HTTP2_SEND_FILE_NOSEEK` {#err_http2_send_file_noseek}

Es wurde versucht, die `Http2Stream.prototype.responseWithFile()`-API zu verwenden, um etwas anderes als eine reguläre Datei zu senden, aber die Optionen `offset` oder `length` wurden angegeben.

### `ERR_HTTP2_SESSION_ERROR` {#err_http2_session_error}

Die `Http2Session` wurde mit einem Fehlercode ungleich Null geschlossen.

### `ERR_HTTP2_SETTINGS_CANCEL` {#err_http2_settings_cancel}

Die `Http2Session`-Einstellungen wurden abgebrochen.

### `ERR_HTTP2_SOCKET_BOUND` {#err_http2_socket_bound}

Es wurde versucht, ein `Http2Session`-Objekt mit einem `net.Socket` oder `tls.TLSSocket` zu verbinden, der/das bereits an ein anderes `Http2Session`-Objekt gebunden war.

### `ERR_HTTP2_SOCKET_UNBOUND` {#err_http2_socket_unbound}

Es wurde versucht, die `socket`-Eigenschaft einer `Http2Session` zu verwenden, die bereits geschlossen wurde.

### `ERR_HTTP2_STATUS_101` {#err_http2_status_101}

Die Verwendung des Informations-Statuscodes `101` ist in HTTP/2 verboten.

### `ERR_HTTP2_STATUS_INVALID` {#err_http2_status_invalid}

Ein ungültiger HTTP-Statuscode wurde angegeben. Statuscodes müssen eine ganze Zahl zwischen `100` und `599` (einschließlich) sein.

### `ERR_HTTP2_STREAM_CANCEL` {#err_http2_stream_cancel}

Ein `Http2Stream` wurde zerstört, bevor Daten an den verbundenen Peer übertragen wurden.

### `ERR_HTTP2_STREAM_ERROR` {#err_http2_stream_error}

Ein Fehlercode ungleich Null wurde in einem `RST_STREAM`-Frame angegeben.

### `ERR_HTTP2_STREAM_SELF_DEPENDENCY` {#err_http2_stream_self_dependency}

Beim Festlegen der Priorität für einen HTTP/2-Stream kann der Stream als Abhängigkeit für einen übergeordneten Stream markiert werden. Dieser Fehlercode wird verwendet, wenn versucht wird, einen Stream als abhängig von sich selbst zu markieren.

### `ERR_HTTP2_TOO_MANY_CUSTOM_SETTINGS` {#err_http2_too_many_custom_settings}

Die Anzahl der unterstützten benutzerdefinierten Einstellungen (10) wurde überschritten.


### `ERR_HTTP2_TOO_MANY_INVALID_FRAMES` {#err_http2_too_many_invalid_frames}

**Hinzugefügt in: v15.14.0**

Das Limit für akzeptable ungültige HTTP/2-Protokoll-Frames, die vom Peer gesendet wurden, wie durch die Option `maxSessionInvalidFrames` festgelegt, wurde überschritten.

### `ERR_HTTP2_TRAILERS_ALREADY_SENT` {#err_http2_trailers_already_sent}

Trailing Headers wurden bereits im `Http2Stream` gesendet.

### `ERR_HTTP2_TRAILERS_NOT_READY` {#err_http2_trailers_not_ready}

Die Methode `http2stream.sendTrailers()` kann erst aufgerufen werden, nachdem das `'wantTrailers'`-Ereignis für ein `Http2Stream`-Objekt ausgegeben wurde. Das `'wantTrailers'`-Ereignis wird nur ausgegeben, wenn die Option `waitForTrailers` für den `Http2Stream` festgelegt ist.

### `ERR_HTTP2_UNSUPPORTED_PROTOCOL` {#err_http2_unsupported_protocol}

An `http2.connect()` wurde eine URL übergeben, die ein anderes Protokoll als `http:` oder `https:` verwendet.

### `ERR_HTTP_BODY_NOT_ALLOWED` {#err_http_body_not_allowed}

Ein Fehler wird ausgelöst, wenn in eine HTTP-Antwort geschrieben wird, die keine Inhalte zulässt.

### `ERR_HTTP_CONTENT_LENGTH_MISMATCH` {#err_http_content_length_mismatch}

Die Größe des Antworttextes stimmt nicht mit dem angegebenen Content-Length-Header-Wert überein.

### `ERR_HTTP_HEADERS_SENT` {#err_http_headers_sent}

Es wurde versucht, weitere Header hinzuzufügen, nachdem die Header bereits gesendet wurden.

### `ERR_HTTP_INVALID_HEADER_VALUE` {#err_http_invalid_header_value}

Es wurde ein ungültiger HTTP-Header-Wert angegeben.

### `ERR_HTTP_INVALID_STATUS_CODE` {#err_http_invalid_status_code}

Der Statuscode lag außerhalb des regulären Statuscode-Bereichs (100-999).

### `ERR_HTTP_REQUEST_TIMEOUT` {#err_http_request_timeout}

Der Client hat die vollständige Anfrage nicht innerhalb der zulässigen Zeit gesendet.

### `ERR_HTTP_SOCKET_ASSIGNED` {#err_http_socket_assigned}

Dem angegebenen [`ServerResponse`](/de/nodejs/api/http#class-httpserverresponse) wurde bereits ein Socket zugewiesen.

### `ERR_HTTP_SOCKET_ENCODING` {#err_http_socket_encoding}

Das Ändern der Socket-Kodierung ist gemäß [RFC 7230 Abschnitt 3](https://tools.ietf.org/html/rfc7230#section-3) nicht zulässig.

### `ERR_HTTP_TRAILER_INVALID` {#err_http_trailer_invalid}

Der `Trailer`-Header wurde gesetzt, obwohl die Transferkodierung dies nicht unterstützt.

### `ERR_ILLEGAL_CONSTRUCTOR` {#err_illegal_constructor}

Es wurde versucht, ein Objekt mit einem nicht-öffentlichen Konstruktor zu erstellen.

### `ERR_IMPORT_ATTRIBUTE_MISSING` {#err_import_attribute_missing}

**Hinzugefügt in: v21.1.0**

Ein Import-Attribut fehlt, wodurch der Import des angegebenen Moduls verhindert wird.


### `ERR_IMPORT_ATTRIBUTE_TYPE_INCOMPATIBLE` {#err_import_attribute_type_incompatible}

**Hinzugefügt in: v21.1.0**

Ein Import-`type`-Attribut wurde angegeben, aber das angegebene Modul ist von einem anderen Typ.

### `ERR_IMPORT_ATTRIBUTE_UNSUPPORTED` {#err_import_attribute_unsupported}

**Hinzugefügt in: v21.0.0, v20.10.0, v18.19.0**

Ein Import-Attribut wird von dieser Version von Node.js nicht unterstützt.

### `ERR_INCOMPATIBLE_OPTION_PAIR` {#err_incompatible_option_pair}

Ein Optionspaar ist miteinander inkompatibel und kann nicht gleichzeitig verwendet werden.

### `ERR_INPUT_TYPE_NOT_ALLOWED` {#err_input_type_not_allowed}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Das Flag `--input-type` wurde verwendet, um zu versuchen, eine Datei auszuführen. Dieses Flag kann nur mit Eingaben über `--eval`, `--print` oder `STDIN` verwendet werden.

### `ERR_INSPECTOR_ALREADY_ACTIVATED` {#err_inspector_already_activated}

Bei der Verwendung des `node:inspector`-Moduls wurde versucht, den Inspector zu aktivieren, obwohl er bereits begonnen hatte, an einem Port zu lauschen. Verwenden Sie `inspector.close()`, bevor Sie ihn an einer anderen Adresse aktivieren.

### `ERR_INSPECTOR_ALREADY_CONNECTED` {#err_inspector_already_connected}

Bei der Verwendung des `node:inspector`-Moduls wurde versucht, eine Verbindung herzustellen, obwohl der Inspector bereits verbunden war.

### `ERR_INSPECTOR_CLOSED` {#err_inspector_closed}

Bei der Verwendung des `node:inspector`-Moduls wurde versucht, den Inspector zu verwenden, nachdem die Sitzung bereits geschlossen war.

### `ERR_INSPECTOR_COMMAND` {#err_inspector_command}

Beim Ausführen eines Befehls über das `node:inspector`-Modul ist ein Fehler aufgetreten.

### `ERR_INSPECTOR_NOT_ACTIVE` {#err_inspector_not_active}

Der `inspector` ist nicht aktiv, wenn `inspector.waitForDebugger()` aufgerufen wird.

### `ERR_INSPECTOR_NOT_AVAILABLE` {#err_inspector_not_available}

Das `node:inspector`-Modul steht nicht zur Verfügung.

### `ERR_INSPECTOR_NOT_CONNECTED` {#err_inspector_not_connected}

Bei der Verwendung des `node:inspector`-Moduls wurde versucht, den Inspector zu verwenden, bevor er verbunden war.

### `ERR_INSPECTOR_NOT_WORKER` {#err_inspector_not_worker}

Eine API wurde im Hauptthread aufgerufen, die nur vom Worker-Thread aus verwendet werden kann.

### `ERR_INTERNAL_ASSERTION` {#err_internal_assertion}

Es gab einen Fehler in Node.js oder eine falsche Verwendung von Node.js-Interna. Um den Fehler zu beheben, öffnen Sie ein Issue unter [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues).


### `ERR_INVALID_ADDRESS` {#err_invalid_address}

Die bereitgestellte Adresse wird von der Node.js-API nicht verstanden.

### `ERR_INVALID_ADDRESS_FAMILY` {#err_invalid_address_family}

Die bereitgestellte Adressfamilie wird von der Node.js-API nicht verstanden.

### `ERR_INVALID_ARG_TYPE` {#err_invalid_arg_type}

Ein Argument des falschen Typs wurde an eine Node.js-API übergeben.

### `ERR_INVALID_ARG_VALUE` {#err_invalid_arg_value}

Ein ungültiger oder nicht unterstützter Wert wurde für ein bestimmtes Argument übergeben.

### `ERR_INVALID_ASYNC_ID` {#err_invalid_async_id}

Eine ungültige `asyncId` oder `triggerAsyncId` wurde mit `AsyncHooks` übergeben. Eine ID kleiner als -1 sollte niemals vorkommen.

### `ERR_INVALID_BUFFER_SIZE` {#err_invalid_buffer_size}

Ein Swap wurde auf einem `Buffer` durchgeführt, aber seine Größe war nicht mit der Operation kompatibel.

### `ERR_INVALID_CHAR` {#err_invalid_char}

Ungültige Zeichen wurden in Headern erkannt.

### `ERR_INVALID_CURSOR_POS` {#err_invalid_cursor_pos}

Ein Cursor in einem gegebenen Stream kann nicht ohne eine bestimmte Spalte in eine bestimmte Zeile verschoben werden.

### `ERR_INVALID_FD` {#err_invalid_fd}

Ein Dateideskriptor ('fd') war ungültig (z. B. hatte er einen negativen Wert).

### `ERR_INVALID_FD_TYPE` {#err_invalid_fd_type}

Ein Dateideskriptor-Typ ('fd') war ungültig.

### `ERR_INVALID_FILE_URL_HOST` {#err_invalid_file_url_host}

Eine Node.js-API, die `file:`-URLs verarbeitet (wie z. B. bestimmte Funktionen im [`fs`](/de/nodejs/api/fs)-Modul), hat eine Datei-URL mit einem inkompatiblen Host gefunden. Diese Situation kann nur auf Unix-ähnlichen Systemen auftreten, wo nur `localhost` oder ein leerer Host unterstützt werden.

### `ERR_INVALID_FILE_URL_PATH` {#err_invalid_file_url_path}

Eine Node.js-API, die `file:`-URLs verarbeitet (wie z. B. bestimmte Funktionen im [`fs`](/de/nodejs/api/fs)-Modul), hat eine Datei-URL mit einem inkompatiblen Pfad gefunden. Die genaue Semantik zur Bestimmung, ob ein Pfad verwendet werden kann, ist plattformabhängig.

### `ERR_INVALID_HANDLE_TYPE` {#err_invalid_handle_type}

Es wurde versucht, ein nicht unterstütztes "Handle" über einen IPC-Kommunikationskanal an einen Child-Prozess zu senden. Weitere Informationen finden Sie unter [`subprocess.send()`](/de/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) und [`process.send()`](/de/nodejs/api/process#processsendmessage-sendhandle-options-callback).

### `ERR_INVALID_HTTP_TOKEN` {#err_invalid_http_token}

Ein ungültiges HTTP-Token wurde angegeben.

### `ERR_INVALID_IP_ADDRESS` {#err_invalid_ip_address}

Eine IP-Adresse ist ungültig.


### `ERR_INVALID_MIME_SYNTAX` {#err_invalid_mime_syntax}

Die Syntax eines MIME ist ungültig.

### `ERR_INVALID_MODULE` {#err_invalid_module}

**Hinzugefügt in: v15.0.0, v14.18.0**

Es wurde versucht, ein Modul zu laden, das nicht existiert oder auf andere Weise ungültig war.

### `ERR_INVALID_MODULE_SPECIFIER` {#err_invalid_module_specifier}

Die importierte Modulzeichenkette ist eine ungültige URL, ein Paketname oder eine Paket-Subpfad-Spezifikation.

### `ERR_INVALID_OBJECT_DEFINE_PROPERTY` {#err_invalid_object_define_property}

Beim Festlegen eines ungültigen Attributs für die Eigenschaft eines Objekts ist ein Fehler aufgetreten.

### `ERR_INVALID_PACKAGE_CONFIG` {#err_invalid_package_config}

Eine ungültige [`package.json`](/de/nodejs/api/packages#nodejs-packagejson-field-definitions)-Datei konnte nicht geparst werden.

### `ERR_INVALID_PACKAGE_TARGET` {#err_invalid_package_target}

Das Feld [`"exports"`](/de/nodejs/api/packages#exports) von `package.json` enthält einen ungültigen Zielzuordnungswert für die versuchte Modulauflösung.

### `ERR_INVALID_PROTOCOL` {#err_invalid_protocol}

Ein ungültiges `options.protocol` wurde an `http.request()` übergeben.

### `ERR_INVALID_REPL_EVAL_CONFIG` {#err_invalid_repl_eval_config}

Sowohl die Option `breakEvalOnSigint` als auch die Option `eval` wurden in der [`REPL`](/de/nodejs/api/repl)-Konfiguration gesetzt, was nicht unterstützt wird.

### `ERR_INVALID_REPL_INPUT` {#err_invalid_repl_input}

Die Eingabe darf in der [`REPL`](/de/nodejs/api/repl) nicht verwendet werden. Die Bedingungen, unter denen dieser Fehler verwendet wird, sind in der [`REPL`](/de/nodejs/api/repl)-Dokumentation beschrieben.

### `ERR_INVALID_RETURN_PROPERTY` {#err_invalid_return_property}

Wird ausgelöst, wenn eine Funktionsoption keinen gültigen Wert für eine ihrer zurückgegebenen Objekteigenschaften bei der Ausführung liefert.

### `ERR_INVALID_RETURN_PROPERTY_VALUE` {#err_invalid_return_property_value}

Wird ausgelöst, wenn eine Funktionsoption keinen erwarteten Werttyp für eine ihrer zurückgegebenen Objekteigenschaften bei der Ausführung liefert.

### `ERR_INVALID_RETURN_VALUE` {#err_invalid_return_value}

Wird ausgelöst, wenn eine Funktionsoption bei der Ausführung keinen erwarteten Werttyp zurückgibt, z. B. wenn von einer Funktion erwartet wird, dass sie eine Promise zurückgibt.

### `ERR_INVALID_STATE` {#err_invalid_state}

**Hinzugefügt in: v15.0.0**

Gibt an, dass ein Vorgang aufgrund eines ungültigen Zustands nicht abgeschlossen werden kann. Beispielsweise wurde ein Objekt möglicherweise bereits zerstört oder führt einen anderen Vorgang aus.

### `ERR_INVALID_SYNC_FORK_INPUT` {#err_invalid_sync_fork_input}

Ein `Buffer`, `TypedArray`, `DataView` oder `string` wurde als stdio-Eingabe an einen asynchronen Fork übergeben. Weitere Informationen finden Sie in der Dokumentation des Moduls [`child_process`](/de/nodejs/api/child_process).


### `ERR_INVALID_THIS` {#err_invalid_this}

Eine Node.js-API-Funktion wurde mit einem inkompatiblen `this`-Wert aufgerufen.

```js [ESM]
const urlSearchParams = new URLSearchParams('foo=bar&baz=new');

const buf = Buffer.alloc(1);
urlSearchParams.has.call(buf, 'foo');
// Wirft einen TypeError mit dem Code 'ERR_INVALID_THIS'
```
### `ERR_INVALID_TUPLE` {#err_invalid_tuple}

Ein Element in dem `iterable`, das dem [WHATWG](/de/nodejs/api/url#the-whatwg-url-api) [`URLSearchParams`-Konstruktor](/de/nodejs/api/url#new-urlsearchparamsiterable) bereitgestellt wurde, stellte kein `[name, value]`-Tupel dar – das heißt, wenn ein Element nicht iterierbar ist oder nicht aus genau zwei Elementen besteht.

### `ERR_INVALID_TYPESCRIPT_SYNTAX` {#err_invalid_typescript_syntax}

**Hinzugefügt in: v23.0.0**

Die bereitgestellte TypeScript-Syntax ist ungültig oder wird nicht unterstützt. Dies kann vorkommen, wenn TypeScript-Syntax verwendet wird, die eine Transformation mit [Type-Stripping](/de/nodejs/api/typescript#type-stripping) erfordert.

### `ERR_INVALID_URI` {#err_invalid_uri}

Eine ungültige URI wurde übergeben.

### `ERR_INVALID_URL` {#err_invalid_url}

Eine ungültige URL wurde an den [WHATWG](/de/nodejs/api/url#the-whatwg-url-api) [`URL`-Konstruktor](/de/nodejs/api/url#new-urlinput-base) oder das Legacy [`url.parse()`](/de/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) zur Analyse übergeben. Das ausgelöste Fehlerobjekt hat typischerweise eine zusätzliche Eigenschaft `'input'`, die die URL enthält, deren Analyse fehlgeschlagen ist.

### `ERR_INVALID_URL_SCHEME` {#err_invalid_url_scheme}

Es wurde versucht, eine URL mit einem inkompatiblen Schema (Protokoll) für einen bestimmten Zweck zu verwenden. Sie wird nur in der [WHATWG URL API](/de/nodejs/api/url#the-whatwg-url-api)-Unterstützung im [`fs`](/de/nodejs/api/fs)-Modul verwendet (das nur URLs mit dem Schema `'file'` akzeptiert), kann aber in Zukunft auch in anderen Node.js-APIs verwendet werden.

### `ERR_IPC_CHANNEL_CLOSED` {#err_ipc_channel_closed}

Es wurde versucht, einen IPC-Kommunikationskanal zu verwenden, der bereits geschlossen war.

### `ERR_IPC_DISCONNECTED` {#err_ipc_disconnected}

Es wurde versucht, einen IPC-Kommunikationskanal zu trennen, der bereits getrennt war. Weitere Informationen finden Sie in der Dokumentation des [`child_process`](/de/nodejs/api/child_process)-Moduls.

### `ERR_IPC_ONE_PIPE` {#err_ipc_one_pipe}

Es wurde versucht, einen untergeordneten Node.js-Prozess mit mehr als einem IPC-Kommunikationskanal zu erstellen. Weitere Informationen finden Sie in der Dokumentation des [`child_process`](/de/nodejs/api/child_process)-Moduls.


### `ERR_IPC_SYNC_FORK` {#err_ipc_sync_fork}

Es wurde versucht, einen IPC-Kommunikationskanal mit einem synchron geforkten Node.js-Prozess zu öffnen. Weitere Informationen finden Sie in der Dokumentation des Moduls [`child_process`](/de/nodejs/api/child_process).

### `ERR_IP_BLOCKED` {#err_ip_blocked}

IP wird von `net.BlockList` blockiert.

### `ERR_LOADER_CHAIN_INCOMPLETE` {#err_loader_chain_incomplete}

**Hinzugefügt in: v18.6.0, v16.17.0**

Ein ESM-Loader-Hook gab zurück, ohne `next()` aufzurufen und ohne explizit einen Kurzschluss zu signalisieren.

### `ERR_LOAD_SQLITE_EXTENSION` {#err_load_sqlite_extension}

**Hinzugefügt in: v23.5.0**

Beim Laden einer SQLite-Erweiterung ist ein Fehler aufgetreten.

### `ERR_MEMORY_ALLOCATION_FAILED` {#err_memory_allocation_failed}

Es wurde versucht, Speicher zu allozieren (normalerweise in der C++-Schicht), aber dies schlug fehl.

### `ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE` {#err_message_target_context_unavailable}

**Hinzugefügt in: v14.5.0, v12.19.0**

Eine an einen [`MessagePort`](/de/nodejs/api/worker_threads#class-messageport) gesendete Nachricht konnte im Ziel-[vm](/de/nodejs/api/vm)-`Context` nicht deserialisiert werden. Nicht alle Node.js-Objekte können derzeit in jedem Kontext erfolgreich instanziiert werden, und der Versuch, sie mit `postMessage()` zu übertragen, kann in diesem Fall auf der Empfängerseite fehlschlagen.

### `ERR_METHOD_NOT_IMPLEMENTED` {#err_method_not_implemented}

Eine Methode ist erforderlich, aber nicht implementiert.

### `ERR_MISSING_ARGS` {#err_missing_args}

Ein erforderliches Argument einer Node.js-API wurde nicht übergeben. Dies wird nur zur strikten Einhaltung der API-Spezifikation verwendet (die in einigen Fällen `func(undefined)` akzeptieren kann, aber nicht `func()`). In den meisten nativen Node.js-APIs werden `func(undefined)` und `func()` identisch behandelt, und stattdessen kann der Fehlercode [`ERR_INVALID_ARG_TYPE`](/de/nodejs/api/errors#err-invalid-arg-type) verwendet werden.

### `ERR_MISSING_OPTION` {#err_missing_option}

Für APIs, die Options-Objekte akzeptieren, können einige Optionen obligatorisch sein. Dieser Code wird ausgelöst, wenn eine erforderliche Option fehlt.

### `ERR_MISSING_PASSPHRASE` {#err_missing_passphrase}

Es wurde versucht, einen verschlüsselten Schlüssel zu lesen, ohne eine Passphrase anzugeben.

### `ERR_MISSING_PLATFORM_FOR_WORKER` {#err_missing_platform_for_worker}

Die von dieser Node.js-Instanz verwendete V8-Plattform unterstützt das Erstellen von Workern nicht. Dies wird durch fehlende Embedder-Unterstützung für Worker verursacht. Insbesondere tritt dieser Fehler nicht bei Standard-Builds von Node.js auf.


### `ERR_MODULE_NOT_FOUND` {#err_module_not_found}

Eine Moduldatei konnte vom ECMAScript-Modul-Loader nicht aufgelöst werden, während ein `import`-Vorgang versucht wurde oder beim Laden des Programmeinstiegspunkts.

### `ERR_MULTIPLE_CALLBACK` {#err_multiple_callback}

Ein Callback wurde mehr als einmal aufgerufen.

Ein Callback ist fast immer dazu gedacht, nur einmal aufgerufen zu werden, da die Abfrage entweder erfüllt oder abgelehnt werden kann, aber nicht beides gleichzeitig. Letzteres wäre möglich, indem ein Callback mehr als einmal aufgerufen wird.

### `ERR_NAPI_CONS_FUNCTION` {#err_napi_cons_function}

Bei der Verwendung von `Node-API` war ein übergebener Konstruktor keine Funktion.

### `ERR_NAPI_INVALID_DATAVIEW_ARGS` {#err_napi_invalid_dataview_args}

Beim Aufruf von `napi_create_dataview()` lag ein gegebener `offset` außerhalb der Grenzen der Datenansicht oder `offset + length` war größer als die Länge des gegebenen `buffer`.

### `ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT` {#err_napi_invalid_typedarray_alignment}

Beim Aufruf von `napi_create_typedarray()` war der bereitgestellte `offset` kein Vielfaches der Elementgröße.

### `ERR_NAPI_INVALID_TYPEDARRAY_LENGTH` {#err_napi_invalid_typedarray_length}

Beim Aufruf von `napi_create_typedarray()` war `(length * size_of_element) + byte_offset` größer als die Länge des gegebenen `buffer`.

### `ERR_NAPI_TSFN_CALL_JS` {#err_napi_tsfn_call_js}

Beim Aufrufen des JavaScript-Teils der Thread-sicheren Funktion ist ein Fehler aufgetreten.

### `ERR_NAPI_TSFN_GET_UNDEFINED` {#err_napi_tsfn_get_undefined}

Beim Versuch, den JavaScript-Wert `undefined` abzurufen, ist ein Fehler aufgetreten.

### `ERR_NON_CONTEXT_AWARE_DISABLED` {#err_non_context_aware_disabled}

Ein Non-Context-Aware natives Addon wurde in einem Prozess geladen, der diese nicht zulässt.

### `ERR_NOT_BUILDING_SNAPSHOT` {#err_not_building_snapshot}

Es wurde versucht, Operationen zu verwenden, die nur beim Erstellen eines V8-Startup-Snapshots verwendet werden können, obwohl Node.js keinen erstellt.

### `ERR_NOT_IN_SINGLE_EXECUTABLE_APPLICATION` {#err_not_in_single_executable_application}

**Hinzugefügt in: v21.7.0, v20.12.0**

Die Operation kann nicht ausgeführt werden, wenn sie sich nicht in einer Single-Executable-Anwendung befindet.

### `ERR_NOT_SUPPORTED_IN_SNAPSHOT` {#err_not_supported_in_snapshot}

Es wurde versucht, Operationen auszuführen, die beim Erstellen eines Startup-Snapshots nicht unterstützt werden.

### `ERR_NO_CRYPTO` {#err_no_crypto}

Es wurde versucht, Crypto-Funktionen zu verwenden, während Node.js nicht mit OpenSSL-Crypto-Unterstützung kompiliert wurde.


### `ERR_NO_ICU` {#err_no_icu}

Es wurde versucht, Funktionen zu nutzen, die [ICU](/de/nodejs/api/intl#internationalization-support) erfordern, aber Node.js wurde nicht mit ICU-Unterstützung kompiliert.

### `ERR_NO_TYPESCRIPT` {#err_no_typescript}

**Hinzugefügt in: v23.0.0**

Es wurde versucht, Funktionen zu nutzen, die [Native TypeScript Unterstützung](/de/nodejs/api/typescript#type-stripping) erfordern, aber Node.js wurde nicht mit TypeScript-Unterstützung kompiliert.

### `ERR_OPERATION_FAILED` {#err_operation_failed}

**Hinzugefügt in: v15.0.0**

Eine Operation ist fehlgeschlagen. Dies wird typischerweise verwendet, um das allgemeine Scheitern einer asynchronen Operation zu signalisieren.

### `ERR_OUT_OF_RANGE` {#err_out_of_range}

Ein gegebener Wert liegt außerhalb des zulässigen Bereichs.

### `ERR_PACKAGE_IMPORT_NOT_DEFINED` {#err_package_import_not_defined}

Das Feld `package.json` [`"imports"`](/de/nodejs/api/packages#imports) definiert keine Zuordnung für den gegebenen internen Paket-Spezifizierer.

### `ERR_PACKAGE_PATH_NOT_EXPORTED` {#err_package_path_not_exported}

Das Feld `package.json` [`"exports"`](/de/nodejs/api/packages#exports) exportiert nicht den angeforderten Unterpfad. Da Exporte gekapselt sind, können private interne Module, die nicht exportiert werden, nicht über die Paketauflösung importiert werden, es sei denn, es wird eine absolute URL verwendet.

### `ERR_PARSE_ARGS_INVALID_OPTION_VALUE` {#err_parse_args_invalid_option_value}

**Hinzugefügt in: v18.3.0, v16.17.0**

Wenn `strict` auf `true` gesetzt ist, wird dies von [`util.parseArgs()`](/de/nodejs/api/util#utilparseargsconfig) ausgelöst, wenn ein [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)-Wert für eine Option vom Typ [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) angegeben wird, oder wenn ein [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)-Wert für eine Option vom Typ [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) angegeben wird.

### `ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL` {#err_parse_args_unexpected_positional}

**Hinzugefügt in: v18.3.0, v16.17.0**

Wird von [`util.parseArgs()`](/de/nodejs/api/util#utilparseargsconfig) ausgelöst, wenn ein Positionsargument angegeben wird und `allowPositionals` auf `false` gesetzt ist.

### `ERR_PARSE_ARGS_UNKNOWN_OPTION` {#err_parse_args_unknown_option}

**Hinzugefügt in: v18.3.0, v16.17.0**

Wenn `strict` auf `true` gesetzt ist, wird dies von [`util.parseArgs()`](/de/nodejs/api/util#utilparseargsconfig) ausgelöst, wenn ein Argument nicht in `options` konfiguriert ist.


### `ERR_PERFORMANCE_INVALID_TIMESTAMP` {#err_performance_invalid_timestamp}

Ein ungültiger Zeitstempelwert wurde für eine Performance-Markierung oder -Messung angegeben.

### `ERR_PERFORMANCE_MEASURE_INVALID_OPTIONS` {#err_performance_measure_invalid_options}

Ungültige Optionen wurden für eine Performance-Messung angegeben.

### `ERR_PROTO_ACCESS` {#err_proto_access}

Der Zugriff auf `Object.prototype.__proto__` wurde mit [`--disable-proto=throw`](/de/nodejs/api/cli#--disable-protomode) verboten. [`Object.getPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) und [`Object.setPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) sollten verwendet werden, um das Prototyp eines Objekts abzurufen und zu setzen.

### `ERR_QUIC_APPLICATION_ERROR` {#err_quic_application_error}

**Hinzugefügt in: v23.4.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Ein QUIC-Anwendungsfehler ist aufgetreten.

### `ERR_QUIC_CONNECTION_FAILED` {#err_quic_connection_failed}

**Hinzugefügt in: v23.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Das Herstellen einer QUIC-Verbindung ist fehlgeschlagen.

### `ERR_QUIC_ENDPOINT_CLOSED` {#err_quic_endpoint_closed}

**Hinzugefügt in: v23.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Ein QUIC-Endpunkt wurde mit einem Fehler geschlossen.

### `ERR_QUIC_OPEN_STREAM_FAILED` {#err_quic_open_stream_failed}

**Hinzugefügt in: v23.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Das Öffnen eines QUIC-Streams ist fehlgeschlagen.

### `ERR_QUIC_TRANSPORT_ERROR` {#err_quic_transport_error}

**Hinzugefügt in: v23.4.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Ein QUIC-Transportfehler ist aufgetreten.

### `ERR_QUIC_VERSION_NEGOTIATION_ERROR` {#err_quic_version_negotiation_error}

**Hinzugefügt in: v23.4.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Eine QUIC-Sitzung ist fehlgeschlagen, da eine Versionsaushandlung erforderlich ist.


### `ERR_REQUIRE_ASYNC_MODULE` {#err_require_async_module}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Beim Versuch, ein [ES-Modul](/de/nodejs/api/esm) mit `require()` zu laden, stellt sich heraus, dass das Modul asynchron ist. Das heißt, es enthält ein Top-Level-Await.

Um zu sehen, wo sich das Top-Level-Await befindet, verwenden Sie `--experimental-print-required-tla` (dadurch würden die Module ausgeführt, bevor nach den Top-Level-Awaits gesucht wird).

### `ERR_REQUIRE_CYCLE_MODULE` {#err_require_cycle_module}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Beim Versuch, ein [ES-Modul](/de/nodejs/api/esm) mit `require()` zu laden, beteiligt sich eine CommonJS-zu-ESM- oder ESM-zu-CommonJS-Kante an einem unmittelbaren Zyklus. Dies ist nicht zulässig, da ES-Module nicht ausgewertet werden können, während sie bereits ausgewertet werden.

Um den Zyklus zu vermeiden, sollte der am Zyklus beteiligte `require()`-Aufruf nicht auf oberster Ebene eines ES-Moduls (über `createRequire()`) oder eines CommonJS-Moduls erfolgen, sondern lazy in einer inneren Funktion erfolgen.

### `ERR_REQUIRE_ESM` {#err_require_esm}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | require() unterstützt jetzt standardmäßig das Laden synchroner ES-Module. |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet
:::

Es wurde versucht, ein [ES-Modul](/de/nodejs/api/esm) mit `require()` zu laden.

Dieser Fehler ist veraltet, da `require()` jetzt das Laden synchroner ES-Module unterstützt. Wenn `require()` auf ein ES-Modul stößt, das Top-Level `await` enthält, wird stattdessen [`ERR_REQUIRE_ASYNC_MODULE`](/de/nodejs/api/errors#err_require_async_module) ausgelöst.

### `ERR_SCRIPT_EXECUTION_INTERRUPTED` {#err_script_execution_interrupted}

Die Skriptausführung wurde durch `SIGINT` unterbrochen (zum Beispiel wurde + gedrückt).

### `ERR_SCRIPT_EXECUTION_TIMEOUT` {#err_script_execution_timeout}

Die Skriptausführung hat das Zeitlimit überschritten, möglicherweise aufgrund von Fehlern im ausgeführten Skript.

### `ERR_SERVER_ALREADY_LISTEN` {#err_server_already_listen}

Die Methode [`server.listen()`](/de/nodejs/api/net#serverlisten) wurde aufgerufen, während ein `net.Server` bereits auf eingehende Verbindungen wartete. Dies gilt für alle Instanzen von `net.Server`, einschließlich HTTP-, HTTPS- und HTTP/2-`Server`-Instanzen.


### `ERR_SERVER_NOT_RUNNING` {#err_server_not_running}

Die Methode [`server.close()`](/de/nodejs/api/net#serverclosecallback) wurde aufgerufen, als ein `net.Server` nicht lief. Dies gilt für alle Instanzen von `net.Server`, einschließlich HTTP-, HTTPS- und HTTP/2-`Server`-Instanzen.

### `ERR_SINGLE_EXECUTABLE_APPLICATION_ASSET_NOT_FOUND` {#err_single_executable_application_asset_not_found}

**Hinzugefügt in: v21.7.0, v20.12.0**

Ein Schlüssel wurde an Single Executable Application APIs übergeben, um ein Asset zu identifizieren, aber es konnte keine Übereinstimmung gefunden werden.

### `ERR_SOCKET_ALREADY_BOUND` {#err_socket_already_bound}

Es wurde versucht, einen Socket zu binden, der bereits gebunden ist.

### `ERR_SOCKET_BAD_BUFFER_SIZE` {#err_socket_bad_buffer_size}

Für die Optionen `recvBufferSize` oder `sendBufferSize` in [`dgram.createSocket()`](/de/nodejs/api/dgram#dgramcreatesocketoptions-callback) wurde eine ungültige (negative) Größe übergeben.

### `ERR_SOCKET_BAD_PORT` {#err_socket_bad_port}

Eine API-Funktion, die einen Port \>= 0 und \< 65536 erwartet, hat einen ungültigen Wert erhalten.

### `ERR_SOCKET_BAD_TYPE` {#err_socket_bad_type}

Eine API-Funktion, die einen Socket-Typ (`udp4` oder `udp6`) erwartet, hat einen ungültigen Wert erhalten.

### `ERR_SOCKET_BUFFER_SIZE` {#err_socket_buffer_size}

Bei der Verwendung von [`dgram.createSocket()`](/de/nodejs/api/dgram#dgramcreatesocketoptions-callback) konnte die Größe des Empfangs- oder Sende-`Buffer` nicht bestimmt werden.

### `ERR_SOCKET_CLOSED` {#err_socket_closed}

Es wurde versucht, eine Operation auf einem bereits geschlossenen Socket durchzuführen.

### `ERR_SOCKET_CLOSED_BEFORE_CONNECTION` {#err_socket_closed_before_connection}

Beim Aufruf von [`net.Socket.write()`](/de/nodejs/api/net#socketwritedata-encoding-callback) auf einem verbindenden Socket wurde der Socket geschlossen, bevor die Verbindung hergestellt wurde.

### `ERR_SOCKET_CONNECTION_TIMEOUT` {#err_socket_connection_timeout}

Der Socket konnte sich nicht mit einer der Adressen verbinden, die vom DNS innerhalb des zulässigen Timeouts zurückgegeben wurden, als der Familienauswahlalgorithmus verwendet wurde.

### `ERR_SOCKET_DGRAM_IS_CONNECTED` {#err_socket_dgram_is_connected}

Ein [`dgram.connect()`](/de/nodejs/api/dgram#socketconnectport-address-callback)-Aufruf wurde auf einem bereits verbundenen Socket durchgeführt.

### `ERR_SOCKET_DGRAM_NOT_CONNECTED` {#err_socket_dgram_not_connected}

Ein [`dgram.disconnect()`](/de/nodejs/api/dgram#socketdisconnect)- oder [`dgram.remoteAddress()`](/de/nodejs/api/dgram#socketremoteaddress)-Aufruf wurde auf einem nicht verbundenen Socket durchgeführt.

### `ERR_SOCKET_DGRAM_NOT_RUNNING` {#err_socket_dgram_not_running}

Es wurde ein Aufruf getätigt und das UDP-Subsystem lief nicht.


### `ERR_SOURCE_MAP_CORRUPT` {#err_source_map_corrupt}

Die Source Map konnte nicht geparst werden, da sie nicht existiert oder beschädigt ist.

### `ERR_SOURCE_MAP_MISSING_SOURCE` {#err_source_map_missing_source}

Eine aus einer Source Map importierte Datei wurde nicht gefunden.

### `ERR_SQLITE_ERROR` {#err_sqlite_error}

**Hinzugefügt in: v22.5.0**

Ein Fehler wurde von [SQLite](/de/nodejs/api/sqlite) zurückgegeben.

### `ERR_SRI_PARSE` {#err_sri_parse}

Eine Zeichenkette wurde für eine Subresource Integrity-Prüfung bereitgestellt, konnte aber nicht geparst werden. Überprüfen Sie das Format der Integritätsattribute, indem Sie sich die [Subresource Integrity-Spezifikation](https://www.w3.org/TR/SRI/#the-integrity-attribute) ansehen.

### `ERR_STREAM_ALREADY_FINISHED` {#err_stream_already_finished}

Eine Stream-Methode wurde aufgerufen, die nicht abgeschlossen werden kann, da der Stream beendet wurde.

### `ERR_STREAM_CANNOT_PIPE` {#err_stream_cannot_pipe}

Es wurde versucht, [`stream.pipe()`](/de/nodejs/api/stream#readablepipedestination-options) auf einem [`Writable`](/de/nodejs/api/stream#class-streamwritable) Stream aufzurufen.

### `ERR_STREAM_DESTROYED` {#err_stream_destroyed}

Eine Stream-Methode wurde aufgerufen, die nicht abgeschlossen werden kann, da der Stream mit `stream.destroy()` zerstört wurde.

### `ERR_STREAM_NULL_VALUES` {#err_stream_null_values}

Es wurde versucht, [`stream.write()`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) mit einem `null`-Chunk aufzurufen.

### `ERR_STREAM_PREMATURE_CLOSE` {#err_stream_premature_close}

Ein Fehler, der von `stream.finished()` und `stream.pipeline()` zurückgegeben wird, wenn ein Stream oder eine Pipeline nicht ordnungsgemäß ohne expliziten Fehler endet.

### `ERR_STREAM_PUSH_AFTER_EOF` {#err_stream_push_after_eof}

Es wurde versucht, [`stream.push()`](/de/nodejs/api/stream#readablepushchunk-encoding) aufzurufen, nachdem ein `null` (EOF) in den Stream gepusht wurde.

### `ERR_STREAM_UNABLE_TO_PIPE` {#err_stream_unable_to_pipe}

Es wurde versucht, an einen geschlossenen oder zerstörten Stream in einer Pipeline zu pipen.

### `ERR_STREAM_UNSHIFT_AFTER_END_EVENT` {#err_stream_unshift_after_end_event}

Es wurde versucht, [`stream.unshift()`](/de/nodejs/api/stream#readableunshiftchunk-encoding) aufzurufen, nachdem das `'end'`-Ereignis emittiert wurde.

### `ERR_STREAM_WRAP` {#err_stream_wrap}

Verhindert einen Abbruch, wenn ein String-Decoder auf dem Socket gesetzt wurde oder sich der Decoder im `objectMode` befindet.

```js [ESM]
const Socket = require('node:net').Socket;
const instance = new Socket();

instance.setEncoding('utf8');
```

### `ERR_STREAM_WRITE_AFTER_END` {#err_stream_write_after_end}

Es wurde versucht, [`stream.write()`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) aufzurufen, nachdem `stream.end()` aufgerufen wurde.

### `ERR_STRING_TOO_LONG` {#err_string_too_long}

Es wurde versucht, einen String zu erstellen, der länger als die maximal zulässige Länge ist.

### `ERR_SYNTHETIC` {#err_synthetic}

Ein künstliches Fehlerobjekt, das verwendet wird, um den Aufrufstapel für Diagnoseberichte zu erfassen.

### `ERR_SYSTEM_ERROR` {#err_system_error}

Innerhalb des Node.js-Prozesses ist ein unspezifischer oder nicht näher bezeichneter Systemfehler aufgetreten. Das Fehlerobjekt verfügt über eine `err.info`-Objekteigenschaft mit zusätzlichen Details.

### `ERR_TAP_LEXER_ERROR` {#err_tap_lexer_error}

Ein Fehler, der einen fehlerhaften Lexer-Status darstellt.

### `ERR_TAP_PARSER_ERROR` {#err_tap_parser_error}

Ein Fehler, der einen fehlerhaften Parser-Status darstellt. Zusätzliche Informationen über das Token, das den Fehler verursacht, sind über die `cause`-Eigenschaft verfügbar.

### `ERR_TAP_VALIDATION_ERROR` {#err_tap_validation_error}

Dieser Fehler stellt eine fehlgeschlagene TAP-Validierung dar.

### `ERR_TEST_FAILURE` {#err_test_failure}

Dieser Fehler stellt einen fehlgeschlagenen Test dar. Zusätzliche Informationen über den Fehler sind über die `cause`-Eigenschaft verfügbar. Die Eigenschaft `failureType` gibt an, was der Test gemacht hat, als der Fehler aufgetreten ist.

### `ERR_TLS_ALPN_CALLBACK_INVALID_RESULT` {#err_tls_alpn_callback_invalid_result}

Dieser Fehler wird ausgelöst, wenn ein `ALPNCallback` einen Wert zurückgibt, der sich nicht in der Liste der vom Client angebotenen ALPN-Protokolle befindet.

### `ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS` {#err_tls_alpn_callback_with_protocols}

Dieser Fehler wird beim Erstellen eines `TLSServer` ausgelöst, wenn die TLS-Optionen sowohl `ALPNProtocols` als auch `ALPNCallback` enthalten. Diese Optionen schließen sich gegenseitig aus.

### `ERR_TLS_CERT_ALTNAME_FORMAT` {#err_tls_cert_altname_format}

Dieser Fehler wird von `checkServerIdentity` ausgelöst, wenn eine vom Benutzer bereitgestellte `subjectaltname`-Eigenschaft gegen Codierungsregeln verstößt. Zertifikatobjekte, die von Node.js selbst erstellt werden, entsprechen immer den Codierungsregeln und verursachen diesen Fehler niemals.

### `ERR_TLS_CERT_ALTNAME_INVALID` {#err_tls_cert_altname_invalid}

Während der Verwendung von TLS stimmte der Hostname/die IP des Peers nicht mit einem der `subjectAltNames` in seinem Zertifikat überein.

### `ERR_TLS_DH_PARAM_SIZE` {#err_tls_dh_param_size}

Während der Verwendung von TLS ist der für das Diffie-Hellman (`DH`)-Schlüsselaustauschprotokoll angebotene Parameter zu klein. Standardmäßig muss die Schlüssellänge größer oder gleich 1024 Bit sein, um Schwachstellen zu vermeiden, auch wenn dringend empfohlen wird, für eine höhere Sicherheit 2048 Bit oder mehr zu verwenden.


### `ERR_TLS_HANDSHAKE_TIMEOUT` {#err_tls_handshake_timeout}

Ein TLS/SSL-Handshake ist fehlgeschlagen, weil das Zeitlimit überschritten wurde. In diesem Fall muss der Server die Verbindung ebenfalls abbrechen.

### `ERR_TLS_INVALID_CONTEXT` {#err_tls_invalid_context}

**Hinzugefügt in: v13.3.0**

Der Kontext muss ein `SecureContext` sein.

### `ERR_TLS_INVALID_PROTOCOL_METHOD` {#err_tls_invalid_protocol_method}

Die angegebene `secureProtocol`-Methode ist ungültig. Sie ist entweder unbekannt oder deaktiviert, weil sie unsicher ist.

### `ERR_TLS_INVALID_PROTOCOL_VERSION` {#err_tls_invalid_protocol_version}

Gültige TLS-Protokollversionen sind `'TLSv1'`, `'TLSv1.1'` oder `'TLSv1.2'`.

### `ERR_TLS_INVALID_STATE` {#err_tls_invalid_state}

**Hinzugefügt in: v13.10.0, v12.17.0**

Der TLS-Socket muss verbunden und sicher hergestellt sein. Stellen Sie sicher, dass das 'secure'-Ereignis ausgelöst wird, bevor Sie fortfahren.

### `ERR_TLS_PROTOCOL_VERSION_CONFLICT` {#err_tls_protocol_version_conflict}

Der Versuch, eine TLS-Protokoll-`minVersion` oder `maxVersion` festzulegen, steht im Konflikt mit dem Versuch, das `secureProtocol` explizit festzulegen. Verwenden Sie entweder den einen oder den anderen Mechanismus.

### `ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED` {#err_tls_psk_set_identity_hint_failed}

Das Festlegen des PSK-Identitätshinweises ist fehlgeschlagen. Der Hinweis ist möglicherweise zu lang.

### `ERR_TLS_RENEGOTIATION_DISABLED` {#err_tls_renegotiation_disabled}

Es wurde versucht, TLS auf einer Socket-Instanz neu auszuhandeln, bei der die Neuverhandlung deaktiviert ist.

### `ERR_TLS_REQUIRED_SERVER_NAME` {#err_tls_required_server_name}

Bei der Verwendung von TLS wurde die Methode `server.addContext()` aufgerufen, ohne einen Hostnamen im ersten Parameter anzugeben.

### `ERR_TLS_SESSION_ATTACK` {#err_tls_session_attack}

Es wird eine übermäßige Anzahl von TLS-Neuverhandlungen festgestellt, was ein potenzieller Vektor für Denial-of-Service-Angriffe ist.

### `ERR_TLS_SNI_FROM_SERVER` {#err_tls_sni_from_server}

Es wurde versucht, eine Server Name Indication von einem TLS-serverseitigen Socket auszugeben, was nur von einem Client aus gültig ist.

### `ERR_TRACE_EVENTS_CATEGORY_REQUIRED` {#err_trace_events_category_required}

Die Methode `trace_events.createTracing()` erfordert mindestens eine Trace-Event-Kategorie.

### `ERR_TRACE_EVENTS_UNAVAILABLE` {#err_trace_events_unavailable}

Das Modul `node:trace_events` konnte nicht geladen werden, da Node.js mit dem Flag `--without-v8-platform` kompiliert wurde.

### `ERR_TRANSFORM_ALREADY_TRANSFORMING` {#err_transform_already_transforming}

Ein `Transform`-Stream wurde beendet, während er noch transformiert wurde.

### `ERR_TRANSFORM_WITH_LENGTH_0` {#err_transform_with_length_0}

Ein `Transform`-Stream wurde mit noch im Schreibpuffer befindlichen Daten beendet.


### `ERR_TTY_INIT_FAILED` {#err_tty_init_failed}

Die Initialisierung eines TTY ist aufgrund eines Systemfehlers fehlgeschlagen.

### `ERR_UNAVAILABLE_DURING_EXIT` {#err_unavailable_during_exit}

Die Funktion wurde innerhalb eines [`process.on('exit')`](/de/nodejs/api/process#event-exit)-Handlers aufgerufen, der nicht innerhalb von [`process.on('exit')`](/de/nodejs/api/process#event-exit)-Handlern aufgerufen werden sollte.

### `ERR_UNCAUGHT_EXCEPTION_CAPTURE_ALREADY_SET` {#err_uncaught_exception_capture_already_set}

[`process.setUncaughtExceptionCaptureCallback()`](/de/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) wurde zweimal aufgerufen, ohne zuerst den Rückruf auf `null` zurückzusetzen.

Dieser Fehler soll verhindern, dass ein Rückruf, der von einem anderen Modul registriert wurde, versehentlich überschrieben wird.

### `ERR_UNESCAPED_CHARACTERS` {#err_unescaped_characters}

Eine Zeichenkette, die nicht maskierte Zeichen enthielt, wurde empfangen.

### `ERR_UNHANDLED_ERROR` {#err_unhandled_error}

Ein unbehandelter Fehler ist aufgetreten (z. B. wenn ein `'error'`-Ereignis von einem [`EventEmitter`](/de/nodejs/api/events#class-eventemitter) ausgelöst wird, aber kein `'error'`-Handler registriert ist).

### `ERR_UNKNOWN_BUILTIN_MODULE` {#err_unknown_builtin_module}

Wird verwendet, um eine bestimmte Art von internem Node.js-Fehler zu identifizieren, der normalerweise nicht durch Benutzercode ausgelöst werden sollte. Instanzen dieses Fehlers deuten auf einen internen Fehler innerhalb der Node.js-Binärdatei selbst hin.

### `ERR_UNKNOWN_CREDENTIAL` {#err_unknown_credential}

Eine Unix-Gruppen- oder Benutzerkennung, die nicht existiert, wurde übergeben.

### `ERR_UNKNOWN_ENCODING` {#err_unknown_encoding}

Eine ungültige oder unbekannte Codierungsoption wurde an eine API übergeben.

### `ERR_UNKNOWN_FILE_EXTENSION` {#err_unknown_file_extension}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Es wurde versucht, ein Modul mit einer unbekannten oder nicht unterstützten Dateiendung zu laden.

### `ERR_UNKNOWN_MODULE_FORMAT` {#err_unknown_module_format}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Es wurde versucht, ein Modul mit einem unbekannten oder nicht unterstützten Format zu laden.

### `ERR_UNKNOWN_SIGNAL` {#err_unknown_signal}

Ein ungültiges oder unbekanntes Prozesssignal wurde an eine API übergeben, die ein gültiges Signal erwartet (z. B. [`subprocess.kill()`](/de/nodejs/api/child_process#subprocesskillsignal)).


### `ERR_UNSUPPORTED_DIR_IMPORT` {#err_unsupported_dir_import}

Der `import` einer Verzeichnis-URL wird nicht unterstützt. Verwenden Sie stattdessen [einen Selbstbezug zu einem Paket über seinen Namen](/de/nodejs/api/packages#self-referencing-a-package-using-its-name) und [definieren Sie einen benutzerdefinierten Unterpfad](/de/nodejs/api/packages#subpath-exports) im Feld [`"exports"`](/de/nodejs/api/packages#exports) der Datei [`package.json`](/de/nodejs/api/packages#nodejs-packagejson-field-definitions).

```js [ESM]
import './'; // nicht unterstützt
import './index.js'; // unterstützt
import 'package-name'; // unterstützt
```
### `ERR_UNSUPPORTED_ESM_URL_SCHEME` {#err_unsupported_esm_url_scheme}

`import` mit anderen URL-Schemas als `file` und `data` wird nicht unterstützt.

### `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` {#err_unsupported_node_modules_type_stripping}

**Hinzugefügt in: v22.6.0**

Das Entfernen von Typen wird für Dateien, die von einem `node_modules`-Verzeichnis abstammen, nicht unterstützt.

### `ERR_UNSUPPORTED_RESOLVE_REQUEST` {#err_unsupported_resolve_request}

Es wurde versucht, einen ungültigen Modul-Referrer aufzulösen. Dies kann passieren, wenn beim Importieren oder Aufrufen von `import.meta.resolve()` entweder:

- ein Bare-Specifier, der kein eingebautes Modul ist, von einem Modul, dessen URL-Schema nicht `file` ist.
- eine [relative URL](https://url.spec.whatwg.org/#relative-url-string) von einem Modul, dessen URL-Schema kein [spezielles Schema](https://url.spec.whatwg.org/#special-scheme) ist.

```js [ESM]
try {
  // Versuch, das Paket 'bare-specifier' von einem `data:`-URL-Modul zu importieren:
  await import('data:text/javascript,import "bare-specifier"');
} catch (e) {
  console.log(e.code); // ERR_UNSUPPORTED_RESOLVE_REQUEST
}
```
### `ERR_USE_AFTER_CLOSE` {#err_use_after_close}

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Es wurde versucht, etwas zu verwenden, das bereits geschlossen war.

### `ERR_VALID_PERFORMANCE_ENTRY_TYPE` {#err_valid_performance_entry_type}

Bei Verwendung der Performance Timing API (`perf_hooks`) wurden keine gültigen Performance Entry Types gefunden.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` {#err_vm_dynamic_import_callback_missing}

Ein Dynamic-Import-Callback wurde nicht angegeben.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` {#err_vm_dynamic_import_callback_missing_flag}

Ein Dynamic-Import-Callback wurde ohne `--experimental-vm-modules` aufgerufen.


### `ERR_VM_MODULE_ALREADY_LINKED` {#err_vm_module_already_linked}

Das Modul, das verlinkt werden sollte, ist nicht für die Verlinkung geeignet, da einer der folgenden Gründe vorliegt:

- Es wurde bereits verlinkt (`linkingStatus` ist `'linked'`)
- Es wird gerade verlinkt (`linkingStatus` ist `'linking'`)
- Die Verlinkung für dieses Modul ist fehlgeschlagen (`linkingStatus` ist `'errored'`)

### `ERR_VM_MODULE_CACHED_DATA_REJECTED` {#err_vm_module_cached_data_rejected}

Die an einen Modulkonstruktor übergebene Option `cachedData` ist ungültig.

### `ERR_VM_MODULE_CANNOT_CREATE_CACHED_DATA` {#err_vm_module_cannot_create_cached_data}

Zwischengespeicherte Daten können nicht für Module erstellt werden, die bereits ausgewertet wurden.

### `ERR_VM_MODULE_DIFFERENT_CONTEXT` {#err_vm_module_different_context}

Das Modul, das von der Linker-Funktion zurückgegeben wird, stammt aus einem anderen Kontext als das übergeordnete Modul. Verlinkte Module müssen denselben Kontext haben.

### `ERR_VM_MODULE_LINK_FAILURE` {#err_vm_module_link_failure}

Das Modul konnte aufgrund eines Fehlers nicht verlinkt werden.

### `ERR_VM_MODULE_NOT_MODULE` {#err_vm_module_not_module}

Der erfüllte Wert eines Linking-Promise ist kein `vm.Module`-Objekt.

### `ERR_VM_MODULE_STATUS` {#err_vm_module_status}

Der aktuelle Status des Moduls erlaubt diese Operation nicht. Die spezifische Bedeutung des Fehlers hängt von der jeweiligen Funktion ab.

### `ERR_WASI_ALREADY_STARTED` {#err_wasi_already_started}

Die WASI-Instanz wurde bereits gestartet.

### `ERR_WASI_NOT_STARTED` {#err_wasi_not_started}

Die WASI-Instanz wurde noch nicht gestartet.

### `ERR_WEBASSEMBLY_RESPONSE` {#err_webassembly_response}

**Hinzugefügt in: v18.1.0**

Die `Response`, die an `WebAssembly.compileStreaming` oder `WebAssembly.instantiateStreaming` übergeben wurde, ist keine gültige WebAssembly-Antwort.

### `ERR_WORKER_INIT_FAILED` {#err_worker_init_failed}

Die Initialisierung des `Worker` ist fehlgeschlagen.

### `ERR_WORKER_INVALID_EXEC_ARGV` {#err_worker_invalid_exec_argv}

Die an den `Worker`-Konstruktor übergebene Option `execArgv` enthält ungültige Flags.

### `ERR_WORKER_MESSAGING_ERRORED` {#err_worker_messaging_errored}

**Hinzugefügt in: v22.5.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Der Ziel-Thread hat beim Verarbeiten einer Nachricht, die über [`postMessageToThread()`](/de/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) gesendet wurde, einen Fehler ausgelöst.


### `ERR_WORKER_MESSAGING_FAILED` {#err_worker_messaging_failed}

**Hinzugefügt in: v22.5.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Der in [`postMessageToThread()`](/de/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) angeforderte Thread ist ungültig oder hat keinen `workerMessage`-Listener.

### `ERR_WORKER_MESSAGING_SAME_THREAD` {#err_worker_messaging_same_thread}

**Hinzugefügt in: v22.5.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Die in [`postMessageToThread()`](/de/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) angeforderte Thread-ID ist die aktuelle Thread-ID.

### `ERR_WORKER_MESSAGING_TIMEOUT` {#err_worker_messaging_timeout}

**Hinzugefügt in: v22.5.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Das Senden einer Nachricht über [`postMessageToThread()`](/de/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) hat das Zeitlimit überschritten.

### `ERR_WORKER_NOT_RUNNING` {#err_worker_not_running}

Ein Vorgang ist fehlgeschlagen, da die `Worker`-Instanz derzeit nicht ausgeführt wird.

### `ERR_WORKER_OUT_OF_MEMORY` {#err_worker_out_of_memory}

Die `Worker`-Instanz wurde beendet, da sie ihr Speicherlimit erreicht hat.

### `ERR_WORKER_PATH` {#err_worker_path}

Der Pfad für das Hauptskript eines Workers ist weder ein absoluter Pfad noch ein relativer Pfad, der mit `./` oder `../` beginnt.

### `ERR_WORKER_UNSERIALIZABLE_ERROR` {#err_worker_unserializable_error}

Alle Versuche, eine nicht abgefangene Ausnahme von einem Worker-Thread zu serialisieren, sind fehlgeschlagen.

### `ERR_WORKER_UNSUPPORTED_OPERATION` {#err_worker_unsupported_operation}

Die angeforderte Funktionalität wird in Worker-Threads nicht unterstützt.

### `ERR_ZLIB_INITIALIZATION_FAILED` {#err_zlib_initialization_failed}

Die Erstellung eines [`zlib`](/de/nodejs/api/zlib)-Objekts ist aufgrund einer falschen Konfiguration fehlgeschlagen.

### `HPE_CHUNK_EXTENSIONS_OVERFLOW` {#hpe_chunk_extensions_overflow}

**Hinzugefügt in: v21.6.2, v20.11.1, v18.19.1**

Es wurden zu viele Daten für eine Chunk-Erweiterung empfangen. Um sich vor böswilligen oder falsch konfigurierten Clients zu schützen, wird ein `Error` mit diesem Code ausgegeben, wenn mehr als 16 KiB an Daten empfangen werden.


### `HPE_HEADER_OVERFLOW` {#hpe_header_overflow}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v11.4.0, v10.15.0 | Die maximale Header-Größe in `http_parser` wurde auf 8 KiB gesetzt. |
:::

Es wurden zu viele HTTP-Header-Daten empfangen. Um vor bösartigen oder falsch konfigurierten Clients zu schützen, wird die HTTP-Analyse abgebrochen, wenn mehr als `maxHeaderSize` an HTTP-Header-Daten empfangen werden, ohne dass ein Anforderungs- oder Antwortobjekt erstellt wird, und es wird ein `Error` mit diesem Code ausgegeben.

### `HPE_UNEXPECTED_CONTENT_LENGTH` {#hpe_unexpected_content_length}

Der Server sendet sowohl einen `Content-Length`-Header als auch `Transfer-Encoding: chunked`.

`Transfer-Encoding: chunked` ermöglicht es dem Server, eine persistente HTTP-Verbindung für dynamisch generierte Inhalte aufrechtzuerhalten. In diesem Fall kann der HTTP-Header `Content-Length` nicht verwendet werden.

Verwenden Sie `Content-Length` oder `Transfer-Encoding: chunked`.

### `MODULE_NOT_FOUND` {#module_not_found}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | Eigenschaft `requireStack` hinzugefügt. |
:::

Eine Moduldatei konnte vom CommonJS-Modul-Loader nicht aufgelöst werden, während ein [`require()`](/de/nodejs/api/modules#requireid)-Vorgang versucht wurde oder beim Laden des Programmeinstiegspunkts.

## Legacy Node.js Fehlercodes {#legacy-nodejs-error-codes}

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Diese Fehlercodes sind entweder inkonsistent oder wurden entfernt.
:::

### `ERR_CANNOT_TRANSFER_OBJECT` {#err_cannot_transfer_object}

**Hinzugefügt in: v10.5.0**

**Entfernt in: v12.5.0**

Der an `postMessage()` übergebene Wert enthielt ein Objekt, das für die Übertragung nicht unterstützt wird.

### `ERR_CPU_USAGE` {#err_cpu_usage}

**Entfernt in: v15.0.0**

Der native Aufruf von `process.cpuUsage` konnte nicht verarbeitet werden.

### `ERR_CRYPTO_HASH_DIGEST_NO_UTF16` {#err_crypto_hash_digest_no_utf16}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v12.12.0**

Die UTF-16-Kodierung wurde mit [`hash.digest()`](/de/nodejs/api/crypto#hashdigestencoding) verwendet. Obwohl die Methode `hash.digest()` die Übergabe eines `encoding`-Arguments erlaubt, wodurch die Methode eine Zeichenkette anstelle eines `Buffer` zurückgibt, wird die UTF-16-Kodierung (z. B. `ucs` oder `utf16le`) nicht unterstützt.


### `ERR_CRYPTO_SCRYPT_INVALID_PARAMETER` {#err_crypto_scrypt_invalid_parameter}

**Entfernt in: v23.0.0**

Eine inkompatible Optionskombination wurde an [`crypto.scrypt()`](/de/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) oder [`crypto.scryptSync()`](/de/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options) übergeben. Neuere Versionen von Node.js verwenden stattdessen den Fehlercode [`ERR_INCOMPATIBLE_OPTION_PAIR`](/de/nodejs/api/errors#err_incompatible_option_pair), der mit anderen APIs konsistent ist.

### `ERR_FS_INVALID_SYMLINK_TYPE` {#err_fs_invalid_symlink_type}

**Entfernt in: v23.0.0**

Ein ungültiger Symlink-Typ wurde an die Methoden [`fs.symlink()`](/de/nodejs/api/fs#fssymlinktarget-path-type-callback) oder [`fs.symlinkSync()`](/de/nodejs/api/fs#fssymlinksynctarget-path-type) übergeben.

### `ERR_HTTP2_FRAME_ERROR` {#err_http2_frame_error}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v10.0.0**

Wird verwendet, wenn beim Senden eines einzelnen Frames in der HTTP/2-Sitzung ein Fehler auftritt.

### `ERR_HTTP2_HEADERS_OBJECT` {#err_http2_headers_object}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v10.0.0**

Wird verwendet, wenn ein HTTP/2-Header-Objekt erwartet wird.

### `ERR_HTTP2_HEADER_REQUIRED` {#err_http2_header_required}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v10.0.0**

Wird verwendet, wenn ein erforderlicher Header in einer HTTP/2-Nachricht fehlt.

### `ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND` {#err_http2_info_headers_after_respond}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v10.0.0**

HTTP/2-Informationsheader dürfen nur *vor* dem Aufruf der Methode `Http2Stream.prototype.respond()` gesendet werden.

### `ERR_HTTP2_STREAM_CLOSED` {#err_http2_stream_closed}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v10.0.0**

Wird verwendet, wenn eine Aktion auf einem HTTP/2-Stream ausgeführt wurde, der bereits geschlossen wurde.

### `ERR_HTTP_INVALID_CHAR` {#err_http_invalid_char}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v10.0.0**

Wird verwendet, wenn ein ungültiges Zeichen in einer HTTP-Antwortstatusmeldung (Begründungsphrase) gefunden wird.

### `ERR_IMPORT_ASSERTION_TYPE_FAILED` {#err_import_assertion_type_failed}

**Hinzugefügt in: v17.1.0, v16.14.0**

**Entfernt in: v21.1.0**

Eine Import Assertion ist fehlgeschlagen, wodurch verhindert wird, dass das angegebene Modul importiert wird.

### `ERR_IMPORT_ASSERTION_TYPE_MISSING` {#err_import_assertion_type_missing}

**Hinzugefügt in: v17.1.0, v16.14.0**

**Entfernt in: v21.1.0**

Eine Import Assertion fehlt, wodurch verhindert wird, dass das angegebene Modul importiert wird.


### `ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED` {#err_import_assertion_type_unsupported}

**Hinzugefügt in: v17.1.0, v16.14.0**

**Entfernt in: v21.1.0**

Ein Importattribut wird von dieser Version von Node.js nicht unterstützt.

### `ERR_INDEX_OUT_OF_RANGE` {#err_index_out_of_range}

**Hinzugefügt in: v10.0.0**

**Entfernt in: v11.0.0**

Ein gegebener Index lag außerhalb des akzeptierten Bereichs (z. B. negative Offsets).

### `ERR_INVALID_OPT_VALUE` {#err_invalid_opt_value}

**Hinzugefügt in: v8.0.0**

**Entfernt in: v15.0.0**

Ein ungültiger oder unerwarteter Wert wurde in einem Options-Objekt übergeben.

### `ERR_INVALID_OPT_VALUE_ENCODING` {#err_invalid_opt_value_encoding}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v15.0.0**

Eine ungültige oder unbekannte Dateicodierung wurde übergeben.

### `ERR_INVALID_PERFORMANCE_MARK` {#err_invalid_performance_mark}

**Hinzugefügt in: v8.5.0**

**Entfernt in: v16.7.0**

Bei Verwendung der Performance Timing API (`perf_hooks`) ist eine Performance-Markierung ungültig.

### `ERR_INVALID_TRANSFER_OBJECT` {#err_invalid_transfer_object}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v21.0.0 | Stattdessen wird eine `DOMException` ausgelöst. |
| v21.0.0 | Entfernt in: v21.0.0 |
:::

Ein ungültiges Transferobjekt wurde an `postMessage()` übergeben.

### `ERR_MANIFEST_ASSERT_INTEGRITY` {#err_manifest_assert_integrity}

**Entfernt in: v22.2.0**

Es wurde versucht, eine Ressource zu laden, aber die Ressource stimmte nicht mit der durch das Richtlinienmanifest definierten Integrität überein. Weitere Informationen finden Sie in der Dokumentation zu Richtlinienmanifesten.

### `ERR_MANIFEST_DEPENDENCY_MISSING` {#err_manifest_dependency_missing}

**Entfernt in: v22.2.0**

Es wurde versucht, eine Ressource zu laden, aber die Ressource wurde nicht als Abhängigkeit von dem Ort aufgeführt, der versucht hat, sie zu laden. Weitere Informationen finden Sie in der Dokumentation zu Richtlinienmanifesten.

### `ERR_MANIFEST_INTEGRITY_MISMATCH` {#err_manifest_integrity_mismatch}

**Entfernt in: v22.2.0**

Es wurde versucht, ein Richtlinienmanifest zu laden, aber das Manifest enthielt mehrere Einträge für eine Ressource, die nicht übereinstimmten. Aktualisieren Sie die Manifesteinträge, damit sie übereinstimmen, um diesen Fehler zu beheben. Weitere Informationen finden Sie in der Dokumentation zu Richtlinienmanifesten.

### `ERR_MANIFEST_INVALID_RESOURCE_FIELD` {#err_manifest_invalid_resource_field}

**Entfernt in: v22.2.0**

Eine Richtlinienmanifestressource hatte einen ungültigen Wert für eines ihrer Felder. Aktualisieren Sie den Manifesteintrag, damit er übereinstimmt, um diesen Fehler zu beheben. Weitere Informationen finden Sie in der Dokumentation zu Richtlinienmanifesten.


### `ERR_MANIFEST_INVALID_SPECIFIER` {#err_manifest_invalid_specifier}

**Entfernt in: v22.2.0**

Eine Policy-Manifest-Ressource hatte einen ungültigen Wert für eine ihrer Abhängigkeitszuordnungen. Aktualisieren Sie den Manifesteintrag, um diesen Fehler zu beheben. Weitere Informationen finden Sie in der Dokumentation zu Policy-Manifesten.

### `ERR_MANIFEST_PARSE_POLICY` {#err_manifest_parse_policy}

**Entfernt in: v22.2.0**

Es wurde versucht, ein Policy-Manifest zu laden, aber das Manifest konnte nicht geparst werden. Weitere Informationen finden Sie in der Dokumentation zu Policy-Manifesten.

### `ERR_MANIFEST_TDZ` {#err_manifest_tdz}

**Entfernt in: v22.2.0**

Es wurde versucht, aus einem Policy-Manifest zu lesen, aber die Manifestinitialisierung hat noch nicht stattgefunden. Dies ist wahrscheinlich ein Fehler in Node.js.

### `ERR_MANIFEST_UNKNOWN_ONERROR` {#err_manifest_unknown_onerror}

**Entfernt in: v22.2.0**

Ein Policy-Manifest wurde geladen, hatte aber einen unbekannten Wert für sein "onerror"-Verhalten. Weitere Informationen finden Sie in der Dokumentation zu Policy-Manifesten.

### `ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST` {#err_missing_message_port_in_transfer_list}

**Entfernt in: v15.0.0**

Dieser Fehlercode wurde in Node.js v15.0.0 durch [`ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST`](/de/nodejs/api/errors#err_missing_transferable_in_transfer_list) ersetzt, da er nicht mehr korrekt ist, da es jetzt auch andere Arten von übertragbaren Objekten gibt.

### `ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST` {#err_missing_transferable_in_transfer_list}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.0.0 | Stattdessen wird eine `DOMException` ausgelöst. |
| v21.0.0 | Entfernt in: v21.0.0 |
| v15.0.0 | Hinzugefügt in: v15.0.0 |
:::

Ein Objekt, das explizit im `transferList`-Argument aufgeführt werden muss, befindet sich im Objekt, das an einen [`postMessage()`](/de/nodejs/api/worker_threads#portpostmessagevalue-transferlist)-Aufruf übergeben wird, wird aber nicht in der `transferList` für diesen Aufruf bereitgestellt. Normalerweise ist dies ein `MessagePort`.

In Node.js-Versionen vor v15.0.0 war der hier verwendete Fehlercode [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/de/nodejs/api/errors#err_missing_message_port_in_transfer_list). Die Menge der übertragbaren Objekttypen wurde jedoch erweitert, um mehr Typen als `MessagePort` abzudecken.

### `ERR_NAPI_CONS_PROTOTYPE_OBJECT` {#err_napi_cons_prototype_object}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v10.0.0**

Wird von der `Node-API` verwendet, wenn `Constructor.prototype` kein Objekt ist.


### `ERR_NAPI_TSFN_START_IDLE_LOOP` {#err_napi_tsfn_start_idle_loop}

**Hinzugefügt in: v10.6.0, v8.16.0**

**Entfernt in: v14.2.0, v12.17.0**

Auf dem Hauptthread werden Werte aus der Queue, die mit der Thread-sicheren Funktion assoziiert ist, in einer Idle-Schleife entfernt. Dieser Fehler deutet darauf hin, dass ein Fehler beim Versuch aufgetreten ist, die Schleife zu starten.

### `ERR_NAPI_TSFN_STOP_IDLE_LOOP` {#err_napi_tsfn_stop_idle_loop}

**Hinzugefügt in: v10.6.0, v8.16.0**

**Entfernt in: v14.2.0, v12.17.0**

Sobald keine Elemente mehr in der Queue übrig sind, muss die Idle-Schleife angehalten werden. Dieser Fehler deutet darauf hin, dass das Anhalten der Idle-Schleife fehlgeschlagen ist.

### `ERR_NO_LONGER_SUPPORTED` {#err_no_longer_supported}

Eine Node.js-API wurde auf eine nicht unterstützte Weise aufgerufen, z. B. `Buffer.write(string, encoding, offset[, length])`.

### `ERR_OUTOFMEMORY` {#err_outofmemory}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v10.0.0**

Wird generisch verwendet, um anzuzeigen, dass eine Operation einen Zustand mit unzureichendem Speicher verursacht hat.

### `ERR_PARSE_HISTORY_DATA` {#err_parse_history_data}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v10.0.0**

Das Modul `node:repl` konnte Daten aus der REPL-Verlaufsdatei nicht parsen.

### `ERR_SOCKET_CANNOT_SEND` {#err_socket_cannot_send}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v14.0.0**

Daten konnten nicht über einen Socket gesendet werden.

### `ERR_STDERR_CLOSE` {#err_stderr_close}

::: info [Verlauf]
| Version    | Änderungen                                                                                                                                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v10.12.0   | Anstatt einen Fehler auszugeben, schließt `process.stderr.end()` jetzt nur noch die Stream-Seite, aber nicht die zugrunde liegende Ressource, wodurch dieser Fehler überflüssig wird.                              |
| v10.12.0   | Entfernt in: v10.12.0                                                                                                                                                                                          |
:::

Es wurde versucht, den `process.stderr`-Stream zu schließen. Node.js erlaubt es per Design nicht, dass `stdout`- oder `stderr`-Streams durch Benutzercode geschlossen werden.

### `ERR_STDOUT_CLOSE` {#err_stdout_close}

::: info [Verlauf]
| Version    | Änderungen                                                                                                                                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v10.12.0   | Anstatt einen Fehler auszugeben, schließt `process.stderr.end()` jetzt nur noch die Stream-Seite, aber nicht die zugrunde liegende Ressource, wodurch dieser Fehler überflüssig wird.                              |
| v10.12.0   | Entfernt in: v10.12.0                                                                                                                                                                                          |
:::

Es wurde versucht, den `process.stdout`-Stream zu schließen. Node.js erlaubt es per Design nicht, dass `stdout`- oder `stderr`-Streams durch Benutzercode geschlossen werden.

### `ERR_STREAM_READ_NOT_IMPLEMENTED` {#err_stream_read_not_implemented}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v10.0.0**

Wird verwendet, wenn versucht wird, einen lesbaren Stream zu verwenden, der [`readable._read()`](/de/nodejs/api/stream#readable_readsize) nicht implementiert hat.


### `ERR_TLS_RENEGOTIATION_FAILED` {#err_tls_renegotiation_failed}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v10.0.0**

Wird verwendet, wenn eine TLS-Neuverhandlungsanforderung auf unspezifische Weise fehlgeschlagen ist.

### `ERR_TRANSFERRING_EXTERNALIZED_SHAREDARRAYBUFFER` {#err_transferring_externalized_sharedarraybuffer}

**Hinzugefügt in: v10.5.0**

**Entfernt in: v14.0.0**

Während der Serialisierung wurde ein `SharedArrayBuffer` festgestellt, dessen Speicher nicht von der JavaScript-Engine oder von Node.js verwaltet wird. Ein solcher `SharedArrayBuffer` kann nicht serialisiert werden.

Dies kann nur vorkommen, wenn native Add-ons `SharedArrayBuffer` im "externalisierten" Modus erstellen oder vorhandene `SharedArrayBuffer` in den externalisierten Modus versetzen.

### `ERR_UNKNOWN_STDIN_TYPE` {#err_unknown_stdin_type}

**Hinzugefügt in: v8.0.0**

**Entfernt in: v11.7.0**

Es wurde versucht, einen Node.js-Prozess mit einem unbekannten `stdin`-Dateityp zu starten. Dieser Fehler ist in der Regel ein Hinweis auf einen Fehler innerhalb von Node.js selbst, obwohl es für Benutzercode möglich ist, ihn auszulösen.

### `ERR_UNKNOWN_STREAM_TYPE` {#err_unknown_stream_type}

**Hinzugefügt in: v8.0.0**

**Entfernt in: v11.7.0**

Es wurde versucht, einen Node.js-Prozess mit einem unbekannten `stdout`- oder `stderr`-Dateityp zu starten. Dieser Fehler ist in der Regel ein Hinweis auf einen Fehler innerhalb von Node.js selbst, obwohl es für Benutzercode möglich ist, ihn auszulösen.

### `ERR_V8BREAKITERATOR` {#err_v8breakiterator}

Die V8 `BreakIterator`-API wurde verwendet, aber der vollständige ICU-Datensatz ist nicht installiert.

### `ERR_VALUE_OUT_OF_RANGE` {#err_value_out_of_range}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v10.0.0**

Wird verwendet, wenn ein gegebener Wert außerhalb des akzeptierten Bereichs liegt.

### `ERR_VM_MODULE_LINKING_ERRORED` {#err_vm_module_linking_errored}

**Hinzugefügt in: v10.0.0**

**Entfernt in: v18.1.0, v16.17.0**

Die Linker-Funktion hat ein Modul zurückgegeben, für das die Verknüpfung fehlgeschlagen ist.

### `ERR_VM_MODULE_NOT_LINKED` {#err_vm_module_not_linked}

Das Modul muss vor der Instanziierung erfolgreich verknüpft werden.

### `ERR_WORKER_UNSUPPORTED_EXTENSION` {#err_worker_unsupported_extension}

**Hinzugefügt in: v11.0.0**

**Entfernt in: v16.9.0**

Der für das Hauptskript eines Workers verwendete Pfadname hat eine unbekannte Dateierweiterung.

### `ERR_ZLIB_BINDING_CLOSED` {#err_zlib_binding_closed}

**Hinzugefügt in: v9.0.0**

**Entfernt in: v10.0.0**

Wird verwendet, wenn versucht wird, ein `zlib`-Objekt zu verwenden, nachdem es bereits geschlossen wurde.


## OpenSSL-Fehlercodes {#openssl-error-codes}

### Zeitgültigkeitsfehler {#time-validity-errors}

#### `CERT_NOT_YET_VALID` {#cert_not_yet_valid}

Das Zertifikat ist noch nicht gültig: Das notBefore-Datum liegt nach der aktuellen Zeit.

#### `CERT_HAS_EXPIRED` {#cert_has_expired}

Das Zertifikat ist abgelaufen: Das notAfter-Datum liegt vor der aktuellen Zeit.

#### `CRL_NOT_YET_VALID` {#crl_not_yet_valid}

Die Certificate Revocation List (CRL) hat ein zukünftiges Ausstellungsdatum.

#### `CRL_HAS_EXPIRED` {#crl_has_expired}

Die Certificate Revocation List (CRL) ist abgelaufen.

#### `CERT_REVOKED` {#cert_revoked}

Das Zertifikat wurde widerrufen; es befindet sich auf einer Certificate Revocation List (CRL).

### Fehler im Zusammenhang mit Vertrauen oder Kette {#trust-or-chain-related-errors}

#### `UNABLE_TO_GET_ISSUER_CERT` {#unable_to_get_issuer_cert}

Das Ausstellerzertifikat eines nachgeschlagenen Zertifikats konnte nicht gefunden werden. Dies bedeutet normalerweise, dass die Liste der vertrauenswürdigen Zertifikate nicht vollständig ist.

#### `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` {#unable_to_get_issuer_cert_locally}

Der Aussteller des Zertifikats ist unbekannt. Dies ist der Fall, wenn der Aussteller nicht in der Liste der vertrauenswürdigen Zertifikate enthalten ist.

#### `DEPTH_ZERO_SELF_SIGNED_CERT` {#depth_zero_self_signed_cert}

Das übergebene Zertifikat ist selbstsigniert und dasselbe Zertifikat kann nicht in der Liste der vertrauenswürdigen Zertifikate gefunden werden.

#### `SELF_SIGNED_CERT_IN_CHAIN` {#self_signed_cert_in_chain}

Der Aussteller des Zertifikats ist unbekannt. Dies ist der Fall, wenn der Aussteller nicht in der Liste der vertrauenswürdigen Zertifikate enthalten ist.

#### `CERT_CHAIN_TOO_LONG` {#cert_chain_too_long}

Die Länge der Zertifikatskette ist größer als die maximale Tiefe.

#### `UNABLE_TO_GET_CRL` {#unable_to_get_crl}

Die vom Zertifikat referenzierte CRL konnte nicht gefunden werden.

#### `UNABLE_TO_VERIFY_LEAF_SIGNATURE` {#unable_to_verify_leaf_signature}

Es konnten keine Signaturen verifiziert werden, da die Kette nur ein Zertifikat enthält und dieses nicht selbstsigniert ist.

#### `CERT_UNTRUSTED` {#cert_untrusted}

Die Root Certificate Authority (CA) ist nicht als vertrauenswürdig für den angegebenen Zweck markiert.

### Grundlegende Erweiterungsfehler {#basic-extension-errors}

#### `INVALID_CA` {#invalid_ca}

Ein CA-Zertifikat ist ungültig. Entweder ist es keine CA oder seine Erweiterungen stimmen nicht mit dem angegebenen Zweck überein.

#### `PATH_LENGTH_EXCEEDED` {#path_length_exceeded}

Der basicConstraints-Parameter pathlength wurde überschritten.

### Namensbezogene Fehler {#name-related-errors}

#### `HOSTNAME_MISMATCH` {#hostname_mismatch}

Das Zertifikat stimmt nicht mit dem angegebenen Namen überein.

### Nutzungs- und Richtlinienfehler {#usage-and-policy-errors}


#### `INVALID_PURPOSE` {#invalid_purpose}

Das bereitgestellte Zertifikat kann nicht für den angegebenen Zweck verwendet werden.

#### `CERT_REJECTED` {#cert_rejected}

Die Root-CA ist so gekennzeichnet, dass sie den angegebenen Zweck ablehnt.

### Formatierungsfehler {#formatting-errors}

#### `CERT_SIGNATURE_FAILURE` {#cert_signature_failure}

Die Signatur des Zertifikats ist ungültig.

#### `CRL_SIGNATURE_FAILURE` {#crl_signature_failure}

Die Signatur der Zertifikatssperrliste (CRL) ist ungültig.

#### `ERROR_IN_CERT_NOT_BEFORE_FIELD` {#error_in_cert_not_before_field}

Das notBefore-Feld des Zertifikats enthält eine ungültige Zeit.

#### `ERROR_IN_CERT_NOT_AFTER_FIELD` {#error_in_cert_not_after_field}

Das notAfter-Feld des Zertifikats enthält eine ungültige Zeit.

#### `ERROR_IN_CRL_LAST_UPDATE_FIELD` {#error_in_crl_last_update_field}

Das lastUpdate-Feld der CRL enthält eine ungültige Zeit.

#### `ERROR_IN_CRL_NEXT_UPDATE_FIELD` {#error_in_crl_next_update_field}

Das nextUpdate-Feld der CRL enthält eine ungültige Zeit.

#### `UNABLE_TO_DECRYPT_CERT_SIGNATURE` {#unable_to_decrypt_cert_signature}

Die Zertifikatssignatur konnte nicht entschlüsselt werden. Dies bedeutet, dass der tatsächliche Signaturwert nicht bestimmt werden konnte, anstatt dass er nicht mit dem erwarteten Wert übereinstimmt. Dies ist nur für RSA-Schlüssel von Bedeutung.

#### `UNABLE_TO_DECRYPT_CRL_SIGNATURE` {#unable_to_decrypt_crl_signature}

Die Signatur der Zertifikatssperrliste (CRL) konnte nicht entschlüsselt werden: Dies bedeutet, dass der tatsächliche Signaturwert nicht bestimmt werden konnte, anstatt dass er nicht mit dem erwarteten Wert übereinstimmt.

#### `UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY` {#unable_to_decode_issuer_public_key}

Der öffentliche Schlüssel in der SubjectPublicKeyInfo des Zertifikats konnte nicht gelesen werden.

### Andere OpenSSL-Fehler {#other-openssl-errors}

#### `OUT_OF_MEM` {#out_of_mem}

Beim Versuch, Speicher zu reservieren, ist ein Fehler aufgetreten. Dies sollte niemals vorkommen.

