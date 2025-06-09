---
title: Ausgabe auf die Kommandozeile mit Node.js
description: Node.js bietet ein Konsolenmodul mit verschiedenen Methoden zur Interaktion mit der Kommandozeile, darunter Protokollierung, Zählung, Zeitmessung usw.
head:
  - - meta
    - name: og:title
      content: Ausgabe auf die Kommandozeile mit Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js bietet ein Konsolenmodul mit verschiedenen Methoden zur Interaktion mit der Kommandozeile, darunter Protokollierung, Zählung, Zeitmessung usw.
  - - meta
    - name: twitter:title
      content: Ausgabe auf die Kommandozeile mit Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js bietet ein Konsolenmodul mit verschiedenen Methoden zur Interaktion mit der Kommandozeile, darunter Protokollierung, Zählung, Zeitmessung usw.
---


# Ausgabe in der Befehlszeile mit Node.js

Grundlegende Ausgabe mit dem Konsolenmodul
Node.js bietet ein Konsolenmodul, das viele sehr nützliche Möglichkeiten zur Interaktion mit der Befehlszeile bietet. Es ist im Wesentlichen dasselbe wie das Konsolenobjekt, das Sie im Browser finden.

Die einfachste und am häufigsten verwendete Methode ist `console.log()`, die die übergebene Zeichenkette in der Konsole ausgibt. Wenn Sie ein Objekt übergeben, wird es als Zeichenkette gerendert.

Sie können mehrere Variablen an `console.log` übergeben, zum Beispiel:
```javascript
const x = 'x';
const y = 'y';
console.log(x, y);
```

Wir können auch hübsche Phrasen formatieren, indem wir Variablen und einen Formatbezeichner übergeben. Zum Beispiel:
```javascript
console.log('Meine %s hat %d Ohren', 'Katze', 2);
```

- %s formatiert eine Variable als Zeichenkette
- %d formatiert eine Variable als Zahl
- %i formatiert eine Variable nur als ihren ganzzahligen Teil
- %o formatiert eine Variable als Objekt
Beispiel:
```javascript
console.log('%o', Number);
```
## Konsole leeren

`console.clear()` leert die Konsole (das Verhalten kann von der verwendeten Konsole abhängen).

## Elemente zählen

`console.count()` ist eine praktische Methode.
Nehmen Sie diesen Code:
```javascript
const x = 1;
const y = 2;
const z = 3;
console.count('Der Wert von x ist '+x+' und wurde überprüft...wie oft?');
console.count('Der Wert von x ist'+x+'und wurde überprüft...wie oft?');
console.count('Der Wert von y ist'+y+'und wurde überprüft...wie oft?');
```

Was passiert, ist, dass `console.count()` die Anzahl der Ausgaben einer Zeichenkette zählt und die Anzahl daneben ausgibt:

Sie können einfach Äpfel und Orangen zählen:

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
```

## Zählung zurücksetzen

Die Methode `console.countReset()` setzt den mit `console.count()` verwendeten Zähler zurück.

Wir werden das Beispiel mit Äpfeln und Orangen verwenden, um dies zu demonstrieren.

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
console.countReset('orange');
oranges.forEach(fruit => console.count(fruit));
```


## Den Stack Trace ausgeben

Es kann Fälle geben, in denen es nützlich ist, den Call Stack Trace einer Funktion auszugeben, vielleicht um die Frage zu beantworten, wie Sie diesen Teil des Codes erreicht haben?

Sie können dies mit `console.trace()` tun:

```javascript
const function2 = () => console.trace();
const function1 = () => function2();
function1();
```

Dies gibt den Stack Trace aus. Folgendes wird ausgegeben, wenn wir dies in der Node.js REPL ausprobieren:

```bash
Trace
at function2 (repl:1:33)
at function1 (rep1:1:25)
at rep1:1:1
at ContextifyScript.Script.xunInThisContext (vm.js:44:33)
at REPLServer.defaultEval(repl.js:239:29)
at bound (domain.js:301:14)
at REPLServer.xunBound [as eval](domain.js:314:12)
at REPLServer.onLine (repl.js:440:10)
at emitone (events.js:120:20)
at REPLServer.emit (events.js:210:7)
```

## Die verbrachte Zeit berechnen

Sie können leicht berechnen, wie viel Zeit eine Funktion zum Ausführen benötigt, indem Sie `time()` und `timeEnd()` verwenden.

```javascript
const doSomething = () => console.log('test');
const measureDoingSomething = () => {
    console.time('doSomething()');
    // do something, and measure the time it takes
    doSomething();
    console.timeEnd('doSomething()');
};
measureDoingSomething();
```

### stdout und stderr

Wie wir gesehen haben, eignet sich `console.log` hervorragend zum Ausgeben von Meldungen in der Konsole. Dies wird als Standardausgabe oder stdout bezeichnet.

`console.error` gibt in den stderr-Stream aus.

Es wird nicht in der Konsole angezeigt, erscheint aber im Fehlerprotokoll.

## Die Ausgabe farbig gestalten

Sie können die Ausgabe Ihres Textes in der Konsole mithilfe von Escape-Sequenzen farbig gestalten. Eine Escape-Sequenz ist eine Reihe von Zeichen, die eine Farbe identifiziert.

Beispiel:

```javascript
console.log('x1b[33ms/x1b[0m', 'hi!');
```

Sie können dies in der Node.js REPL ausprobieren, und es wird hi! in Gelb ausgegeben.

Dies ist jedoch die Low-Level-Methode, um dies zu tun. Der einfachste Weg, die Konsolenausgabe zu färben, ist die Verwendung einer Bibliothek. Chalk ist eine solche Bibliothek, und neben der Farbgebung hilft sie auch bei anderen Styling-Möglichkeiten, wie z. B. dem Fettdruck, Kursivdruck oder Unterstreichen von Text.

Sie installieren es mit `npm install chalk`, dann können Sie es verwenden:

```javascript
const chalk = require('chalk');
console.log(chalk.yellow('hi!'));
```

Die Verwendung von `chalk.yellow` ist viel bequemer als der Versuch, sich die Escape-Codes zu merken, und der Code ist viel lesbarer.

Weitere Anwendungsbeispiele finden Sie im oben genannten Projektlink.


## Eine Fortschrittsanzeige erstellen

`progress` ist ein großartiges Paket, um eine Fortschrittsanzeige in der Konsole zu erstellen. Installieren Sie es mit `npm install progress`.

Dieser Code-Schnipsel erstellt eine 10-stufige Fortschrittsanzeige, und alle 100ms wird ein Schritt abgeschlossen. Wenn die Anzeige abgeschlossen ist, löschen wir das Intervall:

```javascript
const ProgressBar = require('progress');
const bar = new ProgressBar(':bar', { total: 10 });
const timer = setInterval(() => {
    bar.tick();
    if (bar.complete) {
        clearInterval(timer);
    }
}, 100);
```
