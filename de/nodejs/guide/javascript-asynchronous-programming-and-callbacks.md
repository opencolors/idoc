---
title: Asynchrone JavaScript-Programmierung und Callbacks
description: JavaScript ist standardmäßig synchron, aber es kann asynchrone Operationen über Callbacks verarbeiten, die Funktionen sind, die als Argumente an andere Funktionen übergeben und bei einem bestimmten Ereignis ausgeführt werden.
head:
  - - meta
    - name: og:title
      content: Asynchrone JavaScript-Programmierung und Callbacks | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: JavaScript ist standardmäßig synchron, aber es kann asynchrone Operationen über Callbacks verarbeiten, die Funktionen sind, die als Argumente an andere Funktionen übergeben und bei einem bestimmten Ereignis ausgeführt werden.
  - - meta
    - name: twitter:title
      content: Asynchrone JavaScript-Programmierung und Callbacks | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: JavaScript ist standardmäßig synchron, aber es kann asynchrone Operationen über Callbacks verarbeiten, die Funktionen sind, die als Argumente an andere Funktionen übergeben und bei einem bestimmten Ereignis ausgeführt werden.
---


# JavaScript Asynchrone Programmierung und Callbacks

## Asynchronität in Programmiersprachen
Computer sind von Natur aus asynchron.

Asynchron bedeutet, dass Dinge unabhängig vom Hauptprogrammablauf geschehen können.

In den aktuellen Consumer-Computern läuft jedes Programm für einen bestimmten Zeitraum und stoppt dann seine Ausführung, um einem anderen Programm die Fortsetzung seiner Ausführung zu ermöglichen. Dies geschieht in einem Zyklus so schnell, dass es unmöglich ist, es zu bemerken. Wir denken, unsere Computer führen viele Programme gleichzeitig aus, aber das ist eine Illusion (außer auf Multiprozessor-Maschinen).

Programme verwenden intern Interrupts, ein Signal, das an den Prozessor gesendet wird, um die Aufmerksamkeit des Systems zu erlangen.

Lassen Sie uns jetzt nicht auf die Interna eingehen, sondern nur bedenken, dass es für Programme normal ist, asynchron zu sein und ihre Ausführung anzuhalten, bis sie Aufmerksamkeit benötigen, sodass der Computer in der Zwischenzeit andere Dinge ausführen kann. Wenn ein Programm auf eine Antwort aus dem Netzwerk wartet, kann es den Prozessor nicht anhalten, bis die Anfrage abgeschlossen ist.

Normalerweise sind Programmiersprachen synchron, und einige bieten eine Möglichkeit, Asynchronität in der Sprache oder über Bibliotheken zu verwalten. C, Java, C#, PHP, Go, Ruby, Swift und Python sind standardmäßig alle synchron. Einige von ihnen verarbeiten asynchrone Operationen mithilfe von Threads, indem sie einen neuen Prozess erzeugen.

## JavaScript
JavaScript ist standardmäßig **synchron** und Single-Threaded. Dies bedeutet, dass Code keine neuen Threads erstellen und parallel ausgeführt werden kann.

Codezeilen werden nacheinander in Serie ausgeführt, zum Beispiel:

```js
const a = 1;
const b = 2;
const c = a * b;
console.log(c);
doSomething();
```

Aber JavaScript wurde im Browser geboren, und seine Hauptaufgabe war es anfangs, auf Benutzeraktionen wie `onClick`, `onMouseOver`, `onChange`, `onSubmit` usw. zu reagieren. Wie konnte dies mit einem synchronen Programmiermodell geschehen?

Die Antwort lag in seiner Umgebung. Der **Browser** bietet eine Möglichkeit, dies zu tun, indem er eine Reihe von APIs bereitstellt, die diese Art von Funktionalität verarbeiten können.

In jüngerer Zeit hat Node.js eine nicht-blockierende I/O-Umgebung eingeführt, um dieses Konzept auf Dateizugriff, Netzwerkaufrufe usw. auszudehnen.


## Callbacks
Du kannst nicht wissen, wann ein Benutzer auf eine Schaltfläche klickt. Daher definierst du einen Event Handler für das Click-Ereignis. Dieser Event Handler akzeptiert eine Funktion, die aufgerufen wird, wenn das Ereignis ausgelöst wird:

```js
document.getElementById('button').addEventListener('click', () => {
  // Element angeklickt
});
```

Dies ist der sogenannte **Callback**.

Ein Callback ist eine einfache Funktion, die als Wert an eine andere Funktion übergeben wird und nur ausgeführt wird, wenn das Ereignis eintritt. Wir können dies tun, weil JavaScript First-Class Functions hat, die Variablen zugewiesen und an andere Funktionen übergeben werden können (sogenannte **Higher-Order Functions**)

Es ist üblich, deinen gesamten Client-Code in einen **load**-Event-Listener auf dem **window**-Objekt einzuschließen, der die Callback-Funktion nur ausführt, wenn die Seite bereit ist:

```js
window.addEventListener('load', () => {
  // Fenster geladen
  // tue was du willst
});
```

Callbacks werden überall verwendet, nicht nur in DOM-Events.

Ein häufiges Beispiel ist die Verwendung von Timern:

```js
setTimeout(() => {
  // läuft nach 2 Sekunden
}, 2000);
```

XHR-Anfragen akzeptieren auch einen Callback, in diesem Beispiel, indem einer Eigenschaft eine Funktion zugewiesen wird, die aufgerufen wird, wenn ein bestimmtes Ereignis eintritt (in diesem Fall ändert sich der Status der Anfrage):

```js
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4) {
    xhr.status === 200 ? console.log(xhr.responseText) : console.error('error');
  }
};
xhr.open('GET', 'https://yoursite.com');
xhr.send();
```

## Fehlerbehandlung in Callbacks
Wie behandelst du Fehler mit Callbacks? Eine sehr gängige Strategie ist die Verwendung dessen, was Node.js eingeführt hat: Der erste Parameter in jeder Callback-Funktion ist das Fehlerobjekt: Error-First Callbacks

Wenn kein Fehler vorliegt, ist das Objekt null. Wenn ein Fehler vorliegt, enthält es eine Beschreibung des Fehlers und andere Informationen.

```js
const fs = require('node:fs');
fs.readFile('/file.json', (err, data) => {
  if (err) {
    // Fehler behandeln
    console.log(err);
    return;
  }
  // keine Fehler, Daten verarbeiten
  console.log(data);
});
```


## Das Problem mit Callbacks
Callbacks sind großartig für einfache Fälle!

Allerdings fügt jeder Callback eine Ebene der Verschachtelung hinzu, und wenn man viele Callbacks hat, wird der Code sehr schnell kompliziert:

```js
window.addEventListener('load', () => {
  document.getElementById('button').addEventListener('click', () => {
    setTimeout(() => {
      items.forEach(item => {
        // Ihr Code hier
      });
    }, 2000);
  });
});
```

Dies ist nur ein einfacher 4-Ebenen-Code, aber ich habe schon viel mehr Verschachtelungsebenen gesehen, und das macht keinen Spaß.

Wie lösen wir das?

## Alternativen zu Callbacks
Beginnend mit ES6 hat JavaScript verschiedene Funktionen eingeführt, die uns bei asynchronem Code helfen, ohne Callbacks zu verwenden: `Promises` (ES6) und `Async/Await` (ES2017).

