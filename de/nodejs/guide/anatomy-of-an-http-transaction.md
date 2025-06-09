---
title: Verständnis für die Handhabung von HTTP-Anfragen in Node.js
description: Ein umfassender Leitfaden für die Handhabung von HTTP-Anfragen in Node.js, der Themen wie die Erstellung eines Servers, die Handhabung von Anfragen und Antworten, die Routing und die Fehlerhandhabung behandelt.
head:
  - - meta
    - name: og:title
      content: Verständnis für die Handhabung von HTTP-Anfragen in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Ein umfassender Leitfaden für die Handhabung von HTTP-Anfragen in Node.js, der Themen wie die Erstellung eines Servers, die Handhabung von Anfragen und Antworten, die Routing und die Fehlerhandhabung behandelt.
  - - meta
    - name: twitter:title
      content: Verständnis für die Handhabung von HTTP-Anfragen in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Ein umfassender Leitfaden für die Handhabung von HTTP-Anfragen in Node.js, der Themen wie die Erstellung eines Servers, die Handhabung von Anfragen und Antworten, die Routing und die Fehlerhandhabung behandelt.
---


# Anatomie einer HTTP-Transaktion

Der Zweck dieses Leitfadens ist es, ein fundiertes Verständnis des Prozesses der Node.js HTTP-Verarbeitung zu vermitteln. Wir gehen davon aus, dass Sie im Allgemeinen wissen, wie HTTP-Anfragen funktionieren, unabhängig von Sprache oder Programmierumgebung. Wir setzen auch eine gewisse Vertrautheit mit Node.js EventEmitters und Streams voraus. Wenn Sie damit nicht ganz vertraut sind, lohnt es sich, die API-Dokumente für jeden von ihnen kurz durchzulesen.

## Erstellen des Servers

Jede Node-Webserver-Anwendung muss irgendwann ein Webserver-Objekt erstellen. Dies geschieht mit `createServer`.

```javascript
const http = require('node:http');
const server = http.createServer((request, response) => {
    // Hier geschieht Magie!
});
```

Die Funktion, die an `createServer` übergeben wird, wird einmal für jede HTTP-Anfrage aufgerufen, die an diesen Server gerichtet ist. Sie wird also als Request-Handler bezeichnet. Tatsächlich ist das von `createServer` zurückgegebene Server-Objekt ein EventEmitter, und was wir hier haben, ist nur eine Kurzform für das Erstellen eines Server-Objekts und das spätere Hinzufügen des Listeners.

```javascript
const server = http.createServer();
server.on('request', (request, response) => {
    // Hier geschieht die gleiche Art von Magie!
});
```

Wenn eine HTTP-Anfrage den Server erreicht, ruft Node die Request-Handler-Funktion mit einigen praktischen Objekten für die Abwicklung der Transaktion, der Anfrage und der Antwort auf. Dazu kommen wir gleich. Um Anfragen tatsächlich zu bearbeiten, muss die Methode `listen` auf dem Server-Objekt aufgerufen werden. In den meisten Fällen müssen Sie an `listen` lediglich die Portnummer übergeben, auf der der Server lauschen soll. Es gibt auch einige andere Optionen, also konsultieren Sie die API-Referenz.

## Methode, URL und Header

Bei der Bearbeitung einer Anfrage möchten Sie wahrscheinlich zuerst die Methode und die URL betrachten, damit geeignete Maßnahmen ergriffen werden können. Node.js macht dies relativ schmerzlos, indem es praktische Eigenschaften in das Anfrageobjekt einfügt.

```javascript
const { method, url } = request;
```

Das Anfrageobjekt ist eine Instanz von `IncomingMessage`. Die Methode ist hier immer eine normale HTTP-Methode/ein normales Verb. Die URL ist die vollständige URL ohne Server, Protokoll oder Port. Für eine typische URL bedeutet dies alles nach und einschließlich des dritten Schrägstrichs.

Header sind auch nicht weit entfernt. Sie befinden sich in einem eigenen Objekt in der Anfrage namens `headers`.

```javascript
const { headers } = request;
const userAgent = headers['user-agent'];
```

Es ist wichtig zu beachten, dass alle Header nur in Kleinbuchstaben dargestellt werden, unabhängig davon, wie der Client sie tatsächlich gesendet hat. Dies vereinfacht das Parsen von Headern für jeden Zweck.

Wenn einige Header wiederholt werden, werden ihre Werte überschrieben oder als durch Kommas getrennte Zeichenketten zusammengefügt, abhängig vom Header. In einigen Fällen kann dies problematisch sein, daher ist auch `rawHeaders` verfügbar.


## Request Body

Beim Empfang einer POST- oder PUT-Anfrage kann der Anfragetext für Ihre Anwendung wichtig sein. Der Zugriff auf die Textdaten ist etwas aufwendiger als der Zugriff auf Anfrageheader. Das Anfrageobjekt, das an einen Handler übergeben wird, implementiert die `ReadableStream`-Schnittstelle. Dieser Stream kann wie jeder andere Stream überwacht oder woandershin geleitet werden. Wir können die Daten direkt aus dem Stream abrufen, indem wir die `'data'`- und `'end'`-Ereignisse des Streams überwachen.

Der in jedem `'data'`-Ereignis ausgegebene Chunk ist ein `Buffer`. Wenn Sie wissen, dass es sich um String-Daten handelt, ist es am besten, die Daten in einem Array zu sammeln und sie dann beim `'end'`-Ereignis zu verketten und in einen String umzuwandeln.

```javascript
let body = [];
request.on('data', chunk => {
    body.push(chunk);
});
request.on('end', () => {
    body = Buffer.concat(body).toString();
    // An diesem Punkt enthält 'body' den gesamten Anfragetext als String gespeichert
});
```
::: tip NOTE
Dies mag etwas mühsam erscheinen, und in vielen Fällen ist es das auch. Glücklicherweise gibt es Module wie `concat-stream` und `body` auf npm, die helfen können, einen Teil dieser Logik zu verbergen. Es ist wichtig, ein gutes Verständnis dafür zu haben, was vor sich geht, bevor man diesen Weg einschlägt, und deshalb sind Sie hier!
:::

## Eine kurze Anmerkung zu Fehlern

Da das Anfrageobjekt ein `ReadableStream` ist, ist es auch ein `EventEmitter` und verhält sich wie einer, wenn ein Fehler auftritt.

Ein Fehler im Anfragestream äußert sich durch das Auslösen eines `'error'`-Ereignisses auf dem Stream. Wenn Sie keinen Listener für dieses Ereignis haben, wird der Fehler ausgelöst, was Ihr Node.js-Programm zum Absturz bringen könnte. Sie sollten daher einen `'error'`-Listener zu Ihren Anfragestreams hinzufügen, auch wenn Sie ihn nur protokollieren und Ihren Weg fortsetzen. (Es ist jedoch wahrscheinlich am besten, eine Art HTTP-Fehlerantwort zu senden. Mehr dazu später.)

```javascript
request.on('error', err => {
    // Dies gibt die Fehlermeldung und den Stack-Trace auf stderr aus.
    console.error(err.stack);
});
```

Es gibt andere Möglichkeiten, mit [diesen Fehlern umzugehen](/de/nodejs/api/errors), z. B. andere Abstraktionen und Tools, aber seien Sie sich immer bewusst, dass Fehler auftreten können und auftreten, und Sie müssen sich damit auseinandersetzen.


## Was wir bisher haben

An diesem Punkt haben wir die Erstellung eines Servers und das Abrufen der Methode, URL, Header und des Bodys aus Anfragen behandelt. Wenn wir das alles zusammenfügen, könnte es ungefähr so aussehen:

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', err => console.error(err));
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        // An diesem Punkt haben wir die Header, Methode, URL und den Body und können nun
        // tun, was wir tun müssen, um auf diese Anfrage zu antworten.
    });
});

.listen(8080); // Aktiviert diesen Server und lauscht auf Port 8080.
```

Wenn wir dieses Beispiel ausführen, können wir Anfragen empfangen, aber nicht darauf antworten. Wenn Sie dieses Beispiel in einem Webbrowser aufrufen, würde Ihre Anfrage tatsächlich eine Zeitüberschreitung verursachen, da nichts an den Client zurückgesendet wird.

Bisher haben wir das Antwortobjekt überhaupt nicht berührt, das eine Instanz von `ServerResponse` ist, das ein `WritableStream` ist. Es enthält viele nützliche Methoden, um Daten an den Client zurückzusenden. Das werden wir als nächstes behandeln.

## HTTP-Statuscode

Wenn Sie sich nicht die Mühe machen, ihn festzulegen, ist der HTTP-Statuscode einer Antwort immer 200. Natürlich rechtfertigt nicht jede HTTP-Antwort dies, und irgendwann werden Sie definitiv einen anderen Statuscode senden wollen. Dazu können Sie die Eigenschaft `statusCode` festlegen.

```javascript
response.statusCode = 404; // Sagen Sie dem Client, dass die Ressource nicht gefunden wurde.
```

Es gibt einige andere Abkürzungen dafür, wie wir bald sehen werden.

## Setzen von Antwortheadern

Header werden über eine bequeme Methode namens `setHeader` gesetzt.

```javascript
response.setHeader('Content-Type', 'application/json');
response.setHeader('X-Powered-By', 'bacon');
```

Beim Setzen der Header einer Antwort wird bei ihren Namen die Groß-/Kleinschreibung nicht beachtet. Wenn Sie einen Header wiederholt setzen, ist der letzte Wert, den Sie setzen, der Wert, der gesendet wird.


## Explizites Senden von Header-Daten

Die Methoden zum Setzen der Header und des Statuscodes, die wir bereits besprochen haben, setzen voraus, dass Sie "implizite Header" verwenden. Dies bedeutet, dass Sie sich darauf verlassen, dass Node die Header zum richtigen Zeitpunkt sendet, bevor Sie mit dem Senden von Body-Daten beginnen.

Wenn Sie möchten, können Sie die Header explizit in den Antwortstream schreiben. Dazu gibt es eine Methode namens `writeHead`, die den Statuscode und die Header in den Stream schreibt.

## Explizites Senden von Header-Daten

```javascript
response.writeHead(200, {
    'Content-Type': 'application/json',
    'X-Powered-By': 'bacon',
});
```

Sobald Sie die Header gesetzt haben (entweder implizit oder explizit), können Sie mit dem Senden von Antwortdaten beginnen.

## Senden des Antwort-Bodys

Da das Antwortobjekt ein `WritableStream` ist, ist das Schreiben eines Antwort-Bodys an den Client nur eine Frage der Verwendung der üblichen Stream-Methoden.

```javascript
response.write('<html>');
response.write('<body>');
response.write('<h1>Hallo Welt!</h1>');
response.write('</body>');
response.write('</html>');
response.end();
```

Die `end`-Funktion auf Streams kann auch optionale Daten als letzten Datenbestandteil im Stream aufnehmen, sodass wir das obige Beispiel wie folgt vereinfachen können.

```javascript
response.end('<html><body><h1>Hallo Welt!</h1></body></html>');
```

::: tip NOTE
Es ist wichtig, den Status und die Header festzulegen, bevor Sie mit dem Schreiben von Datenblöcken in den Body beginnen. Dies ist sinnvoll, da Header in HTTP-Antworten vor dem Body stehen.
:::

## Eine weitere kurze Sache über Fehler

Der Antwortstream kann auch 'error'-Ereignisse auslösen, und irgendwann müssen Sie sich auch damit befassen. Alle Ratschläge zu Fehler bei Anforderungsstreams gelten auch hier.

## Alles zusammenfügen

Nachdem wir nun gelernt haben, wie man HTTP-Antworten erstellt, wollen wir alles zusammenfügen. Aufbauend auf dem vorherigen Beispiel erstellen wir einen Server, der alle Daten zurücksendet, die uns vom Benutzer gesendet wurden. Wir werden diese Daten mit `JSON.stringify` als JSON formatieren.

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request
      .on('error', err => {
        console.error(err);
      })
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        // ANFANG DES NEUEN STUFFS
        response.on('error', err => {
          console.error(err);
        });
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        // Hinweis: Die obigen 2 Zeilen könnten durch die folgende ersetzt werden:
        // response.writeHead(200, {'Content-Type': 'application/json'})
        const responseBody = { headers, method, url, body };
        response.write(JSON.stringify(responseBody));
        response.end();
        // Hinweis: Die obigen 2 Zeilen könnten durch die folgende ersetzt werden:
        // response.end(JSON.stringify(responseBody))
        // ENDE DES NEUEN STUFFS
      });
  })
  .listen(8080);
```

## EchoServer Beispiel

Vereinfachen wir das vorherige Beispiel, um einen einfachen Echo-Server zu erstellen, der einfach alle im Request empfangenen Daten direkt in der Response zurücksendet. Wir müssen lediglich die Daten aus dem Request-Stream abrufen und diese Daten in den Response-Stream schreiben, ähnlich wie wir es zuvor getan haben.

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        response.end(body);
    });
});

.listen(8080);
```

Passen wir dies nun an. Wir möchten nur dann ein Echo senden, wenn die folgenden Bedingungen erfüllt sind:
- Die Request-Methode ist POST.
- Die URL ist /echo.

In allen anderen Fällen möchten wir einfach mit einem 404 antworten.

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
      let body = [];
      request
        .on('data', chunk => {
          body.push(chunk);
        })
        .on('end', () => {
          body = Buffer.concat(body).toString();
          response.end(body);
        });
    } else {
      response.statusCode = 404;
      response.end();
    }
  })
  .listen(8080);
```

::: tip HINWEIS
Indem wir die URL auf diese Weise überprüfen, führen wir eine Form von "Routing" durch. Andere Formen von Routing können so einfach wie `switch`-Anweisungen oder so komplex wie ganze Frameworks wie `express` sein. Wenn Sie etwas suchen, das Routing und nichts anderes tut, versuchen Sie es mit `router`.
:::

Großartig! Versuchen wir nun, dies zu vereinfachen. Denken Sie daran, dass das Request-Objekt ein `ReadableStream` und das Response-Objekt ein `WritableStream` ist. Das bedeutet, dass wir `pipe` verwenden können, um Daten von einem zum anderen zu leiten. Das ist genau das, was wir für einen Echo-Server wollen!

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

Juhu Streams!

Wir sind aber noch nicht ganz fertig. Wie in diesem Leitfaden mehrfach erwähnt, können Fehler auftreten und treten auch auf, und wir müssen uns mit ihnen auseinandersetzen.

Um Fehler im Request-Stream zu behandeln, protokollieren wir den Fehler in `stderr` und senden einen 400-Statuscode, um eine `Bad Request` anzuzeigen. In einer realen Anwendung sollten wir jedoch den Fehler untersuchen, um herauszufinden, welcher Statuscode und welche Nachricht korrekt wären. Wie üblich bei Fehlern sollten Sie die [Fehlerdokumentation](/de/nodejs/api/errors) konsultieren.

In der Response protokollieren wir den Fehler einfach in `stderr`.

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    request.on('error', err => {
        console.error(err);
        response.statusCode = 400;
        response.end();
    });
    response.on('error', err => {
        console.error(err);
    });
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

Wir haben nun die meisten Grundlagen der Bearbeitung von HTTP-Requests behandelt. An diesem Punkt sollten Sie in der Lage sein:
- Einen HTTP-Server mit einer `request`-Handler-Funktion zu instanziieren und ihn an einem Port lauschen zu lassen.
- Header-, URL-, Methoden- und Body-Daten aus `request`-Objekten abzurufen.
- Routing-Entscheidungen basierend auf URL und/oder anderen Daten in `request`-Objekten zu treffen.
- Header, HTTP-Statuscodes und Body-Daten über `response`-Objekte zu senden.
- Daten von `request`-Objekten zu pipen und an `response`-Objekte weiterzuleiten.
- Stream-Fehler sowohl im `request`- als auch im `response`-Stream zu behandeln.

Aus diesen Grundlagen können Node.js-HTTP-Server für viele typische Anwendungsfälle erstellt werden. Es gibt viele andere Dinge, die diese APIs bieten, lesen Sie also unbedingt die API-Dokumente für [`EventEmitters`](/de/nodejs/api/events), [`Streams`](/de/nodejs/api/stream) und [`HTTP`](/de/nodejs/api/http).

