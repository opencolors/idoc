---
title: So verwenden Sie den Node.js-REPL
description: Erfahren Sie, wie Sie den Node.js-REPL verwenden können, um einfachen JavaScript-Code schnell zu testen und seine Funktionen zu erkunden, einschließlich Multiline-Modus, spezielle Variablen und Punktbefehle.
head:
  - - meta
    - name: og:title
      content: So verwenden Sie den Node.js-REPL | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie den Node.js-REPL verwenden können, um einfachen JavaScript-Code schnell zu testen und seine Funktionen zu erkunden, einschließlich Multiline-Modus, spezielle Variablen und Punktbefehle.
  - - meta
    - name: twitter:title
      content: So verwenden Sie den Node.js-REPL | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie den Node.js-REPL verwenden können, um einfachen JavaScript-Code schnell zu testen und seine Funktionen zu erkunden, einschließlich Multiline-Modus, spezielle Variablen und Punktbefehle.
---


# Verwendung des Node.js REPL

Der Befehl `node` wird verwendet, um unsere Node.js-Skripte auszuführen:

```bash
node script.js
```

Wenn wir den Befehl `node` ohne auszuführendes Skript oder ohne Argumente ausführen, starten wir eine REPL-Sitzung:

```bash
node
```

::: tip HINWEIS
REPL steht für Read Evaluate Print Loop (Lesen, Auswerten, Drucken, Schleife) und ist eine Programmiersprachenumgebung (im Grunde ein Konsolenfenster), die einzelne Ausdrücke als Benutzereingabe entgegennimmt und das Ergebnis nach der Ausführung an die Konsole zurückgibt. Die REPL-Sitzung bietet eine bequeme Möglichkeit, schnell einfachen JavaScript-Code zu testen.
:::

Wenn Sie es jetzt in Ihrem Terminal ausprobieren, passiert Folgendes:

```bash
> node
>
```

Der Befehl bleibt im Leerlauf und wartet darauf, dass wir etwas eingeben.

::: tip
Wenn Sie sich nicht sicher sind, wie Sie Ihr Terminal öffnen, suchen Sie bei Google nach "So öffnen Sie das Terminal unter Ihrem Betriebssystem".
:::

Der REPL wartet darauf, dass wir JavaScript-Code eingeben, um genauer zu sein.

Beginnen Sie einfach und geben Sie Folgendes ein:

```bash
> console.log('test')
test
undefined
>
```

Der erste Wert, `test`, ist die Ausgabe, die wir der Konsole zum Ausdrucken gegeben haben, dann erhalten wir `undefined`, was der Rückgabewert der Ausführung von `console.log()` ist. Node hat diese Codezeile gelesen, ausgewertet, das Ergebnis ausgedruckt und ist dann zurückgekehrt, um auf weitere Codezeilen zu warten. Node durchläuft diese drei Schritte für jedes Stück Code, das wir im REPL ausführen, bis wir die Sitzung beenden. Daher hat der REPL seinen Namen.

Node druckt automatisch das Ergebnis jeder JavaScript-Codezeile aus, ohne dass wir es dazu anweisen müssen. Geben Sie beispielsweise die folgende Zeile ein und drücken Sie die Eingabetaste:

```bash
> 5==5
true
>
```

Beachten Sie den Unterschied in den Ausgaben der obigen beiden Zeilen. Der Node-REPL hat nach der Ausführung von `console.log()` `undefined` ausgegeben, während er andererseits nur das Ergebnis von `5== '5'` ausgegeben hat. Sie müssen bedenken, dass das erste nur eine Anweisung in JavaScript ist und das zweite ein Ausdruck ist.

In einigen Fällen benötigt der Code, den Sie testen möchten, möglicherweise mehrere Zeilen. Angenommen, Sie möchten eine Funktion definieren, die eine Zufallszahl generiert. Geben Sie in der REPL-Sitzung die folgende Zeile ein und drücken Sie die Eingabetaste:

```javascript
function generateRandom()
...
```

Der Node-REPL ist intelligent genug, um festzustellen, dass Sie mit dem Schreiben Ihres Codes noch nicht fertig sind, und wechselt in einen mehrzeiligen Modus, in dem Sie mehr Code eingeben können. Beenden Sie nun Ihre Funktionsdefinition und drücken Sie die Eingabetaste:

```javascript
function generateRandom()
...return Math.random()
```


### Die spezielle Variable:

Wenn Sie nach etwas Code `_` eingeben, wird das Ergebnis der letzten Operation ausgegeben.

### Der Pfeil nach oben:

Wenn Sie die Pfeiltaste nach oben drücken, erhalten Sie Zugriff auf die Historie der vorherigen Codezeilen, die in der aktuellen und sogar in früheren REPL-Sitzungen ausgeführt wurden.

## Dot-Befehle

Die REPL hat einige spezielle Befehle, die alle mit einem Punkt `.` beginnen. Sie sind:
- `.help`: zeigt die Hilfe zu den Punktbefehlen an.
- `.editor`: aktiviert den Editormodus, um mühelos mehrzeiligen JavaScript-Code zu schreiben. Wenn Sie sich in diesem Modus befinden, geben Sie `Strg-D` ein, um den von Ihnen geschriebenen Code auszuführen.
- `.break`: Wenn Sie einen mehrzeiligen Ausdruck eingeben, bricht der Befehl `.break` die weitere Eingabe ab. Das Gleiche wie das Drücken von `Strg-C`.
- `.clear`: setzt den REPL-Kontext auf ein leeres Objekt zurück und löscht alle mehrzeiligen Ausdrücke, die gerade eingegeben werden.
- `.1oad`: lädt eine JavaScript-Datei relativ zum aktuellen Arbeitsverzeichnis.
- `.save`: speichert alles, was Sie in der REPL-Sitzung eingegeben haben, in einer Datei (geben Sie den Dateinamen an).
- `.exit`: beendet die REPL (das gleiche wie zweimaliges Drücken von `Strg-C`).

Die REPL erkennt, wann Sie eine mehrzeilige Anweisung eingeben, ohne dass Sie `.editor` aufrufen müssen. Wenn Sie beispielsweise mit der Eingabe einer Iteration wie dieser beginnen:
```javascript
[1, 2,3].foxEach(num=>{
```
und Sie die Eingabetaste drücken, geht die REPL in eine neue Zeile, die mit 3 Punkten beginnt, was anzeigt, dass Sie jetzt an diesem Block weiterarbeiten können.
```javascript
1... console.log (num)
2...}
```

Wenn Sie `.break` am Ende einer Zeile eingeben, wird der Mehrzeilenmodus beendet und die Anweisung wird nicht ausgeführt.

## REPL aus JavaScript-Datei ausführen

Wir können die REPL in eine JavaScript-Datei mit `repl` importieren.
```javascript
const repl = require('node:repl');
```

Mit der Variable `repl` können wir verschiedene Operationen durchführen. Um die REPL-Eingabeaufforderung zu starten, geben Sie die folgende Zeile ein:
```javascript
repl.start();
```

Führen Sie die Datei in der Befehlszeile aus.
```bash
node repl.js
```

Sie können eine Zeichenkette übergeben, die beim Start der REPL angezeigt wird. Der Standardwert ist '>' (mit einem nachfolgenden Leerzeichen), aber wir können eine benutzerdefinierte Eingabeaufforderung definieren.
```javascript
// eine Unix-ähnliche Eingabeaufforderung
const local = repl.start('$ ');
```

Sie können eine Meldung anzeigen, wenn die REPL beendet wird.

```javascript
local.on('exit', () => {
  console.log('exiting repl');
  process.exit();
});
```

Weitere Informationen über das REPL-Modul finden Sie in der [REPL-Dokumentation](/de/nodejs/api/repl).

