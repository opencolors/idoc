---
title: Node.js Dokumentation - Synopsis
description: Eine Übersicht über Node.js, die seine ereignisgesteuerte asynchrone Architektur, Kernmodule und wie man mit der Entwicklung in Node.js beginnt, beschreibt.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Synopsis | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Eine Übersicht über Node.js, die seine ereignisgesteuerte asynchrone Architektur, Kernmodule und wie man mit der Entwicklung in Node.js beginnt, beschreibt.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Synopsis | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Eine Übersicht über Node.js, die seine ereignisgesteuerte asynchrone Architektur, Kernmodule und wie man mit der Entwicklung in Node.js beginnt, beschreibt.
---


# Verwendung und Beispiel {#usage-and-example}

## Verwendung {#usage}

`node [optionen] [V8-Optionen] [script.js | -e "skript" | - ] [argumente]`

Weitere Informationen finden Sie im Dokument [Befehlszeilenoptionen](/de/nodejs/api/cli#options).

## Beispiel {#example}

Ein Beispiel für einen mit Node.js geschriebenen [Webserver](/de/nodejs/api/http), der mit `'Hallo Welt!'` antwortet:

Befehle in diesem Dokument beginnen mit `$` oder `\>`, um zu verdeutlichen, wie sie im Terminal eines Benutzers erscheinen würden. Die Zeichen `$` und `\>` dürfen nicht enthalten sein. Sie dienen lediglich dazu, den Beginn jedes Befehls zu kennzeichnen.

Zeilen, die nicht mit dem Zeichen `$` oder `\>` beginnen, zeigen die Ausgabe des vorherigen Befehls an.

Stellen Sie zunächst sicher, dass Sie Node.js heruntergeladen und installiert haben. Weitere Installationsinformationen finden Sie unter [Node.js über Paketmanager installieren](https://nodejs.org/en/download/package-manager/).

Erstellen Sie nun einen leeren Projektordner namens `projects` und navigieren Sie in diesen.

Linux und Mac:

```bash [BASH]
mkdir ~/projects
cd ~/projects
```
Windows CMD:

```bash [BASH]
mkdir %USERPROFILE%\projects
cd %USERPROFILE%\projects
```
Windows PowerShell:

```bash [BASH]
mkdir $env:USERPROFILE\projects
cd $env:USERPROFILE\projects
```
Erstellen Sie als Nächstes eine neue Quelldatei im Ordner `projects` und nennen Sie sie `hello-world.js`.

Öffnen Sie `hello-world.js` in einem beliebigen Texteditor und fügen Sie den folgenden Inhalt ein:

```js [ESM]
const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
Speichern Sie die Datei. Geben Sie dann im Terminalfenster Folgendes ein, um die Datei `hello-world.js` auszuführen:

```bash [BASH]
node hello-world.js
```
Eine Ausgabe wie diese sollte im Terminal erscheinen:

```bash [BASH]
Server running at http://127.0.0.1:3000/
```
Öffnen Sie nun einen beliebigen Webbrowser und besuchen Sie `http://127.0.0.1:3000`.

Wenn der Browser die Zeichenkette `Hallo Welt!` anzeigt, bedeutet dies, dass der Server funktioniert.

