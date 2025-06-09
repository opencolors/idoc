---
title: Ausführen von Node.js-Skripten aus der Kommandozeile
description: Erfahren Sie, wie Sie Node.js-Programme aus der Kommandozeile ausführen, einschließlich der Verwendung des node-Befehls, Shebang-Zeilen, Ausführungsberechtigungen, Übergeben von Zeichenketten als Argumente und automatisches Neustarten der Anwendung.
head:
  - - meta
    - name: og:title
      content: Ausführen von Node.js-Skripten aus der Kommandozeile | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie Node.js-Programme aus der Kommandozeile ausführen, einschließlich der Verwendung des node-Befehls, Shebang-Zeilen, Ausführungsberechtigungen, Übergeben von Zeichenketten als Argumente und automatisches Neustarten der Anwendung.
  - - meta
    - name: twitter:title
      content: Ausführen von Node.js-Skripten aus der Kommandozeile | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie Node.js-Programme aus der Kommandozeile ausführen, einschließlich der Verwendung des node-Befehls, Shebang-Zeilen, Ausführungsberechtigungen, Übergeben von Zeichenketten als Argumente und automatisches Neustarten der Anwendung.
---


# Node.js-Skripte über die Befehlszeile ausführen

Die übliche Methode, ein Node.js-Programm auszuführen, besteht darin, den global verfügbaren Befehl `node` (sobald Sie Node.js installiert haben) auszuführen und den Namen der auszuführenden Datei zu übergeben.

Wenn Ihre Hauptanwendungsdatei von Node.js `app.js` ist, können Sie sie aufrufen, indem Sie Folgendes eingeben:

```bash
node app.js
```

Oben weisen Sie die Shell explizit an, Ihr Skript mit `node` auszuführen. Sie können diese Information auch mit einer "Shebang"-Zeile in Ihre JavaScript-Datei einbetten. Der "Shebang" ist die erste Zeile in der Datei und teilt dem Betriebssystem mit, welcher Interpreter zum Ausführen des Skripts verwendet werden soll. Unten ist die erste Zeile von JavaScript:

```javascript
#!/usr/bin/node
```

Oben geben wir explizit den absoluten Pfad des Interpreters an. Nicht alle Betriebssysteme haben `node` im Ordner `bin`, aber alle sollten `env` haben. Sie können das Betriebssystem anweisen, `env` mit `node` als Parameter auszuführen:

```javascript
#!/usr/bin/env node
// Ihr JavaScript-Code
```

## Um einen Shebang zu verwenden, muss Ihre Datei über eine Ausführungsberechtigung verfügen.

Sie können `app.js` die Ausführungsberechtigung erteilen, indem Sie Folgendes ausführen:

```bash
chmod u+x app.js
```

Stellen Sie beim Ausführen des Befehls sicher, dass Sie sich im selben Verzeichnis befinden, das die Datei `app.js` enthält.

## Zeichenkette anstelle des Dateipfads als Argument an Node übergeben

Um eine Zeichenkette als Argument auszuführen, können Sie `-e`, `--eval "script"` verwenden. Das folgende Argument wird als JavaScript ausgewertet. Die Module, die im REPL vordefiniert sind, können auch im Skript verwendet werden. Unter Windows funktioniert die Verwendung von `cmd.exe` mit einem einfachen Anführungszeichen nicht korrekt, da es nur doppelte `"` zum Zitieren erkennt. In Powershell oder Git Bash sind sowohl `"` als auch `'` verwendbar.

```bash
node -e "console.log(123)"
```

## Anwendung automatisch neu starten

Ab Nodejs V 16 gibt es eine integrierte Option, die Anwendung automatisch neu zu starten, wenn sich eine Datei ändert. Dies ist nützlich für Entwicklungszwecke. Um diese Funktion zu nutzen, müssen Sie das `watch`-Flag an Nodejs übergeben.

```bash
node --watch app.js
```

Wenn Sie also die Datei ändern, wird die Anwendung automatisch neu gestartet. Lesen Sie die --watch [Flag-Dokumentation](/de/nodejs/api/cli#watch).

