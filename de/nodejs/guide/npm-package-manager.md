---
title: Umfangreiche Anleitung zu npm, dem Paketmanager von Node.js
description: Erfahren Sie, wie Sie npm verwenden können, um Abhängigkeiten zu verwalten, Pakete zu installieren und zu aktualisieren sowie Aufgaben in Ihren Node.js-Projekten auszuführen.
head:
  - - meta
    - name: og:title
      content: Umfangreiche Anleitung zu npm, dem Paketmanager von Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie npm verwenden können, um Abhängigkeiten zu verwalten, Pakete zu installieren und zu aktualisieren sowie Aufgaben in Ihren Node.js-Projekten auszuführen.
  - - meta
    - name: twitter:title
      content: Umfangreiche Anleitung zu npm, dem Paketmanager von Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie npm verwenden können, um Abhängigkeiten zu verwalten, Pakete zu installieren und zu aktualisieren sowie Aufgaben in Ihren Node.js-Projekten auszuführen.
---


# Eine Einführung in den npm-Paketmanager

## Einführung in npm

`npm` ist der Standard-Paketmanager für Node.js.

Im September 2022 wurden über 2,1 Millionen Pakete im npm-Register gelistet, was es zum größten Code-Repository für eine einzelne Sprache auf der Erde macht, und Sie können sicher sein, dass es für (fast!) alles ein Paket gibt.

Es begann als eine Möglichkeit, Abhängigkeiten von Node.js-Paketen herunterzuladen und zu verwalten, hat sich aber seitdem zu einem Werkzeug entwickelt, das auch im Frontend-JavaScript verwendet wird.

::: tip
`Yarn` und `pnpm` sind Alternativen zur npm-Befehlszeilenschnittstelle. Sie können sich diese ebenfalls ansehen.
:::

## Pakete

### Alle Abhängigkeiten installieren

Sie können alle im `package.json`-Datei aufgeführten Abhängigkeiten installieren, indem Sie Folgendes ausführen:

```bash
npm install
```

Dadurch wird alles installiert, was das Projekt benötigt, im Ordner `node_modules`, wobei dieser erstellt wird, falls er noch nicht vorhanden ist.

### Ein einzelnes Paket installieren

Sie können ein einzelnes Paket installieren, indem Sie Folgendes ausführen:

```bash
npm install <package-name>
```

Darüber hinaus fügt dieser Befehl seit npm 5 `<package-name>` den Abhängigkeiten der `package.json`-Datei hinzu. Vor Version 5 mussten Sie das Flag `--save` hinzufügen.

Oft werden diesem Befehl weitere Flags hinzugefügt:

+ `--save-dev` (oder `-D`), das das Paket dem Abschnitt `devDependencies` der `package.json`-Datei hinzufügt.
+ `--no-save`, das das Speichern des Pakets in der `package.json`-Datei verhindert.
+ `--no-optional`, das die Installation optionaler Abhängigkeiten verhindert.
+ `--save-optional`, das das Paket dem Abschnitt `optionalDependencies` der `package.json`-Datei hinzufügt.

Es können auch Kurzformen der Flags verwendet werden:

+ `-S`: `--save`
+ `-D`: `--save-dev`
+ `-O`: `--save-optional`

Der Unterschied zwischen devDependencies und dependencies besteht darin, dass erstere Entwicklungswerkzeuge wie eine Testbibliothek enthalten, während letztere in der Produktion mit der App gebündelt werden.

Der Unterschied bei den optionalDependencies besteht darin, dass ein Build-Fehler der Abhängigkeit nicht dazu führt, dass die Installation fehlschlägt. Es liegt jedoch in der Verantwortung Ihres Programms, mit dem Fehlen der Abhängigkeit umzugehen. Lesen Sie mehr über [optionale Abhängigkeiten](https://docs.npmjs.com/cli/v10/using-npm/config#optional).


### Aktualisieren von Paketen
Das Aktualisieren ist ebenfalls einfach, indem man Folgendes ausführt:

```bash
npm update
```

Dies aktualisiert alle Abhängigkeiten auf ihre neueste Version.

Sie können auch ein einzelnes Paket zur Aktualisierung angeben:

```bash
npm update <package-name>
```

### Entfernen von Paketen

Um ein Paket zu entfernen, können Sie Folgendes ausführen:

```bash
npm uninstall <package-name>
```

### Versionierung
Zusätzlich zu einfachen Downloads verwaltet `npm` auch die Versionierung, sodass Sie eine bestimmte Version eines Pakets angeben oder eine Version benötigen können, die höher oder niedriger als Ihre Anforderungen ist.

Oft werden Sie feststellen, dass eine Bibliothek nur mit einem Major-Release einer anderen Bibliothek kompatibel ist.

Oder ein Fehler in der neuesten Version einer Bibliothek, der noch nicht behoben ist, verursacht ein Problem.

Die Angabe einer expliziten Version einer Bibliothek trägt auch dazu bei, dass alle genau die gleiche Version eines Pakets verwenden, sodass das gesamte Team die gleiche Version ausführt, bis die Datei `package.json` aktualisiert wird.

In all diesen Fällen hilft die Versionierung sehr, und `npm` folgt dem Standard der [semantischen Versionierung (semver)](https://semver.org/).

Sie können eine bestimmte Version eines Pakets installieren, indem Sie Folgendes ausführen:

```bash
npm install <package-name>@<version>
```

Sie können auch die neueste Version eines Pakets installieren, indem Sie Folgendes ausführen:

```bash
npm install <package-name>@latest
```

### Ausführen von Tasks
Die Datei package.json unterstützt ein Format zur Angabe von Befehlszeilen-Tasks, die mit folgendem Befehl ausgeführt werden können:

```bash
npm run <task-name>
```

Wenn Sie beispielsweise eine package.json-Datei mit folgendem Inhalt haben:

```json
{
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  }
}
```

Es ist sehr üblich, diese Funktion zum Ausführen von Webpack zu verwenden:

```json
{
  "scripts": {
    "watch": "webpack --watch --progress --colors --config webpack.conf.js",
    "dev": "webpack --progress --colors --config webpack.conf.js",
    "prod": "NODE_ENV=production webpack -p --config webpack.conf.js"
  }
}
```

Anstatt diese langen Befehle einzutippen, die man leicht vergisst oder falsch tippt, können Sie Folgendes ausführen:


```bash
npm run watch
npm run dev
npm run prod
```

