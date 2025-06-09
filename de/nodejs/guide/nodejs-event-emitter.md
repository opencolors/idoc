---
title: Node.js-Ereignisemitter
description: Erfahren Sie mehr über den Node.js-Ereignisemitter, ein leistungsfähiges Werkzeug zur Verwaltung von Ereignissen in Ihren Backend-Anwendungen.
head:
  - - meta
    - name: og:title
      content: Node.js-Ereignisemitter | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie mehr über den Node.js-Ereignisemitter, ein leistungsfähiges Werkzeug zur Verwaltung von Ereignissen in Ihren Backend-Anwendungen.
  - - meta
    - name: twitter:title
      content: Node.js-Ereignisemitter | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie mehr über den Node.js-Ereignisemitter, ein leistungsfähiges Werkzeug zur Verwaltung von Ereignissen in Ihren Backend-Anwendungen.
---


# Der Node.js Event Emitter

Wenn Sie mit JavaScript im Browser gearbeitet haben, wissen Sie, wie viel der Benutzerinteraktion über Ereignisse abgewickelt wird: Mausklicks, Tastendrucke, Reaktionen auf Mausbewegungen usw.

Auf der Backend-Seite bietet uns Node.js die Möglichkeit, ein ähnliches System mit dem **[events Modul](/de/nodejs/api/events)** aufzubauen.

Dieses Modul bietet insbesondere die EventEmitter-Klasse, die wir zur Behandlung unserer Ereignisse verwenden werden.

Sie initialisieren diese mit

```js
import EventEmitter from 'node:events';
const eventEmitter = new EventEmitter();
```

Dieses Objekt stellt unter anderem die Methoden `on` und `emit` bereit.

- `emit` wird verwendet, um ein Ereignis auszulösen
- `on` wird verwendet, um eine Callback-Funktion hinzuzufügen, die ausgeführt wird, wenn das Ereignis ausgelöst wird

Erstellen wir beispielsweise ein `start`-Ereignis und reagieren wir darauf, indem wir es einfach in der Konsole protokollieren:

```js
eventEmitter.on('start', () => {
  console.log('gestartet');
});
```

Wenn wir Folgendes ausführen:

```js
eventEmitter.emit('start');
```

wird die Ereignisbehandlungsfunktion ausgelöst und wir erhalten den Konsolenlog.

Sie können Argumente an den Ereignishandler übergeben, indem Sie sie als zusätzliche Argumente an `emit()` übergeben:

```js
eventEmitter.on('start', number => {
  console.log(`gestartet ${number}`);
});
eventEmitter.emit('start', 23);
```

Mehrere Argumente:

```js
eventEmitter.on('start', (start, end) => {
  console.log(`gestartet von ${start} bis ${end}`);
});
eventEmitter.emit('start', 1, 100);
```

Das EventEmitter-Objekt stellt auch verschiedene andere Methoden zur Interaktion mit Ereignissen bereit, wie z. B.:

- `once()`: Einen einmaligen Listener hinzufügen
- `removeListener()` / `off()`: Einen Event Listener von einem Event entfernen
- `removeAllListeners()`: Alle Listener für ein Ereignis entfernen

Weitere Informationen zu diesen Methoden finden Sie in der [Dokumentation des Ereignismoduls](/de/nodejs/api/events).

