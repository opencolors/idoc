---
title: Node.js-Dateipfade
description: Erfahren Sie mehr über Dateipfade in Node.js, einschließlich Systemdateipfade, dem `path`-Modul und wie Sie Informationen aus Pfaden extrahieren.
head:
  - - meta
    - name: og:title
      content: Node.js-Dateipfade | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie mehr über Dateipfade in Node.js, einschließlich Systemdateipfade, dem `path`-Modul und wie Sie Informationen aus Pfaden extrahieren.
  - - meta
    - name: twitter:title
      content: Node.js-Dateipfade | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie mehr über Dateipfade in Node.js, einschließlich Systemdateipfade, dem `path`-Modul und wie Sie Informationen aus Pfaden extrahieren.
---


# Node.js Dateipfade

## Systemdateipfade

Jede Datei im System hat einen Pfad. Unter Linux und macOS könnte ein Pfad wie folgt aussehen: `/users/joe/file.txt`

Während Windows-Computer eine andere Struktur haben, wie z. B.: `C:\users\joe\file.txt`

Sie müssen aufmerksam sein, wenn Sie Pfade in Ihren Anwendungen verwenden, da dieser Unterschied berücksichtigt werden muss.

## Verwenden des `path`-Moduls

Sie binden dieses Modul in Ihre Dateien ein, indem Sie Folgendes verwenden:

```javascript
const path = require('node:path')
```

und Sie können beginnen, seine Methoden zu verwenden.

## Informationen aus einem Pfad extrahieren

Ausgehend von einem Pfad können Sie mit diesen Methoden Informationen daraus extrahieren:

- `dirname`: Ermittelt den übergeordneten Ordner einer Datei
- `basename`: Ermittelt den Dateinamensteil
- `extname`: Ermittelt die Dateiendung

### Beispiel

::: code-group

```javascript [CJS]
const path = require('node:path')
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

```javascript [MJS]
import path from 'node:path'
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

:::

Sie können den Dateinamen ohne die Erweiterung erhalten, indem Sie ein zweites Argument für `basename` angeben:

```javascript
path.basename(notes, path.extname(notes)) // notes
```

## Arbeiten mit Pfaden

Sie können zwei oder mehr Teile eines Pfads mit `path.join()` zusammenfügen:

```javascript
path.join('/users', 'joe', 'file.txt') // /users/joe/file.txt
```

Sie können die absolute Pfadberechnung eines relativen Pfads mit `path.resolve()` abrufen:

```javascript
path.resolve('joe.txt') // /Users/joe/joe.txt, wenn es von meinem Home-Ordner aus ausgeführt wird
path.resolve('tmp', 'joe.txt') // /Users/joe/tmp/joe.txt, wenn es von meinem Home-Ordner aus ausgeführt wird
```

In diesem Fall hängt Node.js einfach `/joe.txt` an das aktuelle Arbeitsverzeichnis an. Wenn Sie einen zweiten Parameter als Ordner angeben, verwendet `resolve` den ersten als Basis für den zweiten.

Wenn der erste Parameter mit einem Schrägstrich beginnt, bedeutet dies, dass es sich um einen absoluten Pfad handelt:

```javascript
path.resolve('/etc', 'joe.txt') // /etc/joe.txt
```

`path.normalize()` ist eine weitere nützliche Funktion, die versucht, den tatsächlichen Pfad zu berechnen, wenn er relative Spezifizierer wie `.` oder `..` oder doppelte Schrägstriche enthält:

```javascript
path.normalize('/users/joe/../test.txt') // /users/test.txt
```

Weder `resolve` noch `normalize` prüfen, ob der Pfad vorhanden ist. Sie berechnen lediglich einen Pfad basierend auf den erhaltenen Informationen.

