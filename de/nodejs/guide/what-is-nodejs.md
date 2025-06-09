---
title: Einführung in Node.js
description: Node.js ist eine Open-Source- und plattformübergreifende JavaScript-Laufzeitumgebung, die Entwicklern ermöglicht, JavaScript auf dem Server zu auszuführen, mit hoher Leistung und Skalierbarkeit.
head:
  - - meta
    - name: og:title
      content: Einführung in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js ist eine Open-Source- und plattformübergreifende JavaScript-Laufzeitumgebung, die Entwicklern ermöglicht, JavaScript auf dem Server zu auszuführen, mit hoher Leistung und Skalierbarkeit.
  - - meta
    - name: twitter:title
      content: Einführung in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js ist eine Open-Source- und plattformübergreifende JavaScript-Laufzeitumgebung, die Entwicklern ermöglicht, JavaScript auf dem Server zu auszuführen, mit hoher Leistung und Skalierbarkeit.
---


# Einführung in Node.js

Node.js ist eine Open-Source- und plattformübergreifende JavaScript-Laufzeitumgebung. Es ist ein beliebtes Werkzeug für fast jede Art von Projekt!

Node.js führt die V8 JavaScript-Engine aus, den Kern von Google Chrome, außerhalb des Browsers. Dies ermöglicht es Node.js, sehr leistungsfähig zu sein.

Eine Node.js-App läuft in einem einzigen Prozess, ohne für jede Anfrage einen neuen Thread zu erstellen. Node.js bietet eine Reihe von asynchronen I/O-Primitiven in seiner Standardbibliothek, die verhindern, dass JavaScript-Code blockiert, und im Allgemeinen werden Bibliotheken in Node.js mit nicht-blockierenden Paradigmen geschrieben, wodurch blockierendes Verhalten eher die Ausnahme als die Regel ist.

Wenn Node.js eine I/O-Operation durchführt, wie z. B. das Lesen aus dem Netzwerk, den Zugriff auf eine Datenbank oder das Dateisystem, nimmt Node.js die Operationen wieder auf, sobald die Antwort zurückkommt, anstatt den Thread zu blockieren und CPU-Zyklen mit dem Warten zu verschwenden.

Dies ermöglicht es Node.js, Tausende von gleichzeitigen Verbindungen mit einem einzigen Server zu verarbeiten, ohne die Last der Verwaltung von Thread-Concurrency einzuführen, die eine bedeutende Fehlerquelle darstellen könnte.

Node.js hat einen einzigartigen Vorteil, da Millionen von Frontend-Entwicklern, die JavaScript für den Browser schreiben, nun in der Lage sind, zusätzlich zum Client-seitigen Code auch den serverseitigen Code zu schreiben, ohne eine völlig andere Sprache lernen zu müssen.

In Node.js können die neuen ECMAScript-Standards problemlos verwendet werden, da Sie nicht darauf warten müssen, dass alle Ihre Benutzer ihre Browser aktualisieren - Sie entscheiden, welche ECMAScript-Version verwendet werden soll, indem Sie die Node.js-Version ändern, und Sie können auch bestimmte experimentelle Funktionen aktivieren, indem Sie Node.js mit Flags ausführen.

## Eine Beispiel-Node.js-Anwendung

Das häufigste Beispiel für Hello World in Node.js ist ein Webserver:

```js
import { createServer } from 'node:http'
const hostname = '127.0.0.1'
const port = 3000
const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World')
})
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
```

Um diesen Code-Schnipsel auszuführen, speichern Sie ihn als `server.js`-Datei und führen Sie `node server.js` in Ihrem Terminal aus. Wenn Sie die mjs-Version des Codes verwenden, sollten Sie sie als `server.mjs`-Datei speichern und `node server.mjs` in Ihrem Terminal ausführen.

Dieser Code enthält zunächst das Node.js [http-Modul](/de/nodejs/api/http).

Node.js verfügt über eine fantastische [Standardbibliothek](/de/nodejs/api/synopsis), einschließlich erstklassiger Unterstützung für die Vernetzung.

Die `createServer()`-Methode von `http` erstellt einen neuen HTTP-Server und gibt ihn zurück.

Der Server wird so eingestellt, dass er auf dem angegebenen Port und Hostnamen lauscht. Wenn der Server bereit ist, wird die Callback-Funktion aufgerufen, die uns in diesem Fall darüber informiert, dass der Server läuft.

Wann immer eine neue Anfrage empfangen wird, wird das [request-Event](/de/nodejs/api/http) aufgerufen, das zwei Objekte bereitstellt: eine Anfrage (ein `http.IncomingMessage`-Objekt) und eine Antwort (ein `http.ServerResponse`-Objekt).

Diese 2 Objekte sind essentiell, um den HTTP-Aufruf zu verarbeiten.

Das erste Objekt liefert die Details der Anfrage. In diesem einfachen Beispiel wird dies nicht verwendet, aber Sie könnten auf die Anfrage-Header und die Anfrage-Daten zugreifen.

Das zweite Objekt wird verwendet, um Daten an den Aufrufer zurückzugeben.

In diesem Fall mit:

```js
res.setHeader('Content-Type', 'text/plain')
```

setzen wir die `statusCode`-Eigenschaft auf 200, um eine erfolgreiche Antwort anzuzeigen.

Wir setzen den `Content-Type`-Header:

```js
res.setHeader('Content-Type', 'text/plain')
```

und wir schließen die Antwort ab, indem wir den Inhalt als Argument an `end()` übergeben:

```js
res.end('Hello World')
```

Dadurch wird die Antwort an den Client gesendet.

