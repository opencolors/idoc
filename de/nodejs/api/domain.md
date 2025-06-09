---
title: Node.js Dokumentation - Domain-Modul
description: Das Domain-Modul in Node.js bietet eine Möglichkeit, Fehler und Ausnahmen in asynchronem Code zu handhaben, was eine robustere Fehlerverwaltung und Bereinigung ermöglicht.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Domain-Modul | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das Domain-Modul in Node.js bietet eine Möglichkeit, Fehler und Ausnahmen in asynchronem Code zu handhaben, was eine robustere Fehlerverwaltung und Bereinigung ermöglicht.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Domain-Modul | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das Domain-Modul in Node.js bietet eine Möglichkeit, Fehler und Ausnahmen in asynchronem Code zu handhaben, was eine robustere Fehlerverwaltung und Bereinigung ermöglicht.
---


# Domain {#domain}

::: info [Historie]
| Version | Änderungen |
|---|---|
| v8.8.0 | Alle in VM-Kontexten erstellten `Promise`s haben keine `.domain`-Eigenschaft mehr. Ihre Handler werden jedoch weiterhin im richtigen Domain ausgeführt, und `Promise`s, die im Hauptkontext erstellt wurden, besitzen weiterhin eine `.domain`-Eigenschaft. |
| v8.0.0 | Handler für `Promise`s werden jetzt in dem Domain aufgerufen, in dem die erste Promise einer Kette erstellt wurde. |
| v1.4.2 | Veraltet seit: v1.4.2 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet
:::

**Quellcode:** [lib/domain.js](https://github.com/nodejs/node/blob/v23.5.0/lib/domain.js)

**Dieses Modul ist in Kürze veraltet.** Sobald eine Ersatz-API fertiggestellt wurde, wird dieses Modul vollständig veraltet sein. Die meisten Entwickler sollten **keinen** Grund haben, dieses Modul zu verwenden. Benutzer, die unbedingt die Funktionalität benötigen, die Domains bieten, können sich vorerst darauf verlassen, sollten aber erwarten, in Zukunft zu einer anderen Lösung migrieren zu müssen.

Domains bieten eine Möglichkeit, mehrere verschiedene IO-Operationen als eine einzige Gruppe zu behandeln. Wenn einer der Event Emitter oder Callbacks, die bei einem Domain registriert sind, ein `'error'`-Event ausgibt oder einen Fehler wirft, wird das Domain-Objekt benachrichtigt, anstatt den Kontext des Fehlers im `process.on('uncaughtException')`-Handler zu verlieren oder zu verursachen, dass das Programm sofort mit einem Fehlercode beendet wird.

## Warnung: Ignoriere keine Fehler! {#warning-dont-ignore-errors!}

Domain-Fehlerhandler sind kein Ersatz für das Schließen eines Prozesses, wenn ein Fehler auftritt.

Aufgrund der Natur, wie [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) in JavaScript funktioniert, gibt es fast nie eine Möglichkeit, sicher "dort weiterzumachen, wo es aufgehört hat", ohne Referenzen zu verlieren oder eine andere Art von undefiniertem, brüchigem Zustand zu erzeugen.

Der sicherste Weg, auf einen geworfenen Fehler zu reagieren, ist, den Prozess zu beenden. Natürlich kann es in einem normalen Webserver viele offene Verbindungen geben, und es ist nicht sinnvoll, diese abrupt zu schließen, weil ein Fehler von jemand anderem ausgelöst wurde.

Der bessere Ansatz ist, eine Fehlerantwort auf die Anfrage zu senden, die den Fehler ausgelöst hat, während die anderen in ihrer normalen Zeit beendet werden können, und das Abhören neuer Anfragen in diesem Worker zu stoppen.

Auf diese Weise geht die `domain`-Verwendung Hand in Hand mit dem Cluster-Modul, da der primäre Prozess einen neuen Worker forken kann, wenn ein Worker auf einen Fehler stößt. Für Node.js-Programme, die auf mehrere Maschinen skaliert werden, kann der terminierende Proxy oder die Service-Registry das Scheitern erkennen und entsprechend reagieren.

Zum Beispiel ist dies keine gute Idee:

```js [ESM]
// XXX WARNUNG! SCHLECHTE IDEE!

const d = require('node:domain').create();
d.on('error', (er) => {
  // Der Fehler bringt den Prozess nicht zum Absturz, aber was er tut, ist schlimmer!
  // Obwohl wir einen abrupten Neustart des Prozesses verhindert haben, verlieren wir
  // eine Menge Ressourcen, wenn dies jemals passiert.
  // Das ist nicht besser als process.on('uncaughtException')!
  console.log(`error, but oh well ${er.message}`);
});
d.run(() => {
  require('node:http').createServer((req, res) => {
    handleRequest(req, res);
  }).listen(PORT);
});
```
Indem wir den Kontext eines Domains und die Ausfallsicherheit der Trennung unseres Programms in mehrere Worker-Prozesse nutzen, können wir angemessener reagieren und Fehler mit viel größerer Sicherheit behandeln.

```js [ESM]
// Viel besser!

const cluster = require('node:cluster');
const PORT = +process.env.PORT || 1337;

if (cluster.isPrimary) {
  // Ein realistischeres Szenario hätte mehr als 2 Worker,
  // und würde vielleicht nicht den primären und den Worker in dieselbe Datei legen.
  //
  // Es ist auch möglich, etwas ausgefeilter beim Logging vorzugehen und
  // jede benutzerdefinierte Logik zu implementieren, die benötigt wird, um DoS-
  // Angriffe und anderes schlechtes Verhalten zu verhindern.
  //
  // Siehe die Optionen in der Cluster-Dokumentation.
  //
  // Das Wichtigste ist, dass der Primärprozess sehr wenig tut,
  // was unsere Widerstandsfähigkeit gegen unerwartete Fehler erhöht.

  cluster.fork();
  cluster.fork();

  cluster.on('disconnect', (worker) => {
    console.error('disconnect!');
    cluster.fork();
  });

} else {
  // der Worker
  //
  // Hier platzieren wir unsere Bugs!

  const domain = require('node:domain');

  // Siehe die Cluster-Dokumentation für weitere Details zur Verwendung von
  // Worker-Prozessen zur Bearbeitung von Anfragen. Wie es funktioniert, Einschränkungen usw.

  const server = require('node:http').createServer((req, res) => {
    const d = domain.create();
    d.on('error', (er) => {
      console.error(`error ${er.stack}`);

      // Wir befinden uns in gefährlichem Gebiet!
      // Per Definition ist etwas Unerwartetes passiert,
      // was wir wahrscheinlich nicht wollten.
      // Jetzt kann alles passieren! Seien Sie sehr vorsichtig!

      try {
        // Stellen Sie sicher, dass wir innerhalb von 30 Sekunden schließen
        const killtimer = setTimeout(() => {
          process.exit(1);
        }, 30000);
        // Aber halten Sie den Prozess nicht nur dafür offen!
        killtimer.unref();

        // Keine neuen Anfragen mehr annehmen.
        server.close();

        // Lassen Sie den Primärprozess wissen, dass wir tot sind. Dies löst ein
        // 'disconnect' im Cluster-Primärprozess aus, und dann wird er einen
        // neuen Worker forken.
        cluster.worker.disconnect();

        // Versuchen Sie, eine Fehlermeldung an die Anfrage zu senden, die das Problem ausgelöst hat
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('Oops, there was a problem!\n');
      } catch (er2) {
        // Na ja, viel können wir an diesem Punkt nicht mehr tun.
        console.error(`Error sending 500! ${er2.stack}`);
      }
    });

    // Da req und res erstellt wurden, bevor dieser Domain existierte,
    // müssen wir sie explizit hinzufügen.
    // Siehe die Erklärung von impliziter vs. expliziter Bindung weiter unten.
    d.add(req);
    d.add(res);

    // Führen Sie nun die Handler-Funktion im Domain aus.
    d.run(() => {
      handleRequest(req, res);
    });
  });
  server.listen(PORT);
}

// Dieser Teil ist nicht wichtig. Nur ein Beispiel für Routing.
// Platzieren Sie hier ausgefallene Anwendungslogik.
function handleRequest(req, res) {
  switch (req.url) {
    case '/error':
      // Wir machen einige asynchrone Dinge, und dann...
      setTimeout(() => {
        // Hoppla!
        flerb.bark();
      }, timeout);
      break;
    default:
      res.end('ok');
  }
}
```

## Ergänzungen zu `Error`-Objekten {#additions-to-error-objects}

Jedes Mal, wenn ein `Error`-Objekt durch eine Domain geleitet wird, werden ihm einige zusätzliche Felder hinzugefügt.

- `error.domain` Die Domain, die den Fehler zuerst behandelt hat.
- `error.domainEmitter` Der Event-Emitter, der ein `'error'`-Event mit dem Error-Objekt ausgelöst hat.
- `error.domainBound` Die Callback-Funktion, die an die Domain gebunden und der ein Fehler als erstes Argument übergeben wurde.
- `error.domainThrown` Ein boolescher Wert, der angibt, ob der Fehler geworfen, emittiert oder an eine gebundene Callback-Funktion übergeben wurde.

## Implizite Bindung {#implicit-binding}

Wenn Domains verwendet werden, werden alle **neuen** `EventEmitter`-Objekte (einschließlich Stream-Objekte, Anfragen, Antworten usw.) implizit an die zum Zeitpunkt ihrer Erstellung aktive Domain gebunden.

Zusätzlich werden Callbacks, die an Low-Level-Event-Loop-Anfragen übergeben werden (z. B. an `fs.open()` oder andere Callback-Methoden), automatisch an die aktive Domain gebunden. Wenn sie eine Ausnahme auslösen, fängt die Domain den Fehler ab.

Um übermäßigen Speicherverbrauch zu verhindern, werden `Domain`-Objekte selbst nicht implizit als Kinder der aktiven Domain hinzugefügt. Wären sie das, wäre es zu einfach, zu verhindern, dass Request- und Response-Objekte ordnungsgemäß per Garbage Collection entfernt werden.

Um `Domain`-Objekte als Kinder einer übergeordneten `Domain` zu verschachteln, müssen sie explizit hinzugefügt werden.

Die implizite Bindung leitet geworfene Fehler und `'error'`-Events an das `'error'`-Event der `Domain` weiter, registriert aber den `EventEmitter` nicht auf der `Domain`. Die implizite Bindung kümmert sich nur um geworfene Fehler und `'error'`-Events.

## Explizite Bindung {#explicit-binding}

Manchmal ist die verwendete Domain nicht diejenige, die für einen bestimmten Event-Emitter verwendet werden sollte. Oder der Event-Emitter wurde möglicherweise im Kontext einer Domain erstellt, sollte aber stattdessen an eine andere Domain gebunden werden.

Beispielsweise könnte eine Domain für einen HTTP-Server verwendet werden, aber vielleicht möchten wir eine separate Domain für jede Anfrage verwenden.

Dies ist über die explizite Bindung möglich.

```js [ESM]
// Erstellen Sie eine Top-Level-Domain für den Server
const domain = require('node:domain');
const http = require('node:http');
const serverDomain = domain.create();

serverDomain.run(() => {
  // Der Server wird im Geltungsbereich von serverDomain erstellt
  http.createServer((req, res) => {
    // Req und res werden ebenfalls im Geltungsbereich von serverDomain erstellt
    // wir würden jedoch lieber eine separate Domain für jede Anfrage haben.
    // Erstellen Sie sie zuerst und fügen Sie req und res hinzu.
    const reqd = domain.create();
    reqd.add(req);
    reqd.add(res);
    reqd.on('error', (er) => {
      console.error('Error', er, req.url);
      try {
        res.writeHead(500);
        res.end('Error occurred, sorry.');
      } catch (er2) {
        console.error('Error sending 500', er2, req.url);
      }
    });
  }).listen(1337);
});
```

## `domain.create()` {#domaincreate}

- Gibt zurück: [\<Domain\>](/de/nodejs/api/domain#class-domain)

## Klasse: `Domain` {#class-domain}

- Erweitert: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Die Klasse `Domain` kapselt die Funktionalität, Fehler und unbehandelte Ausnahmen an das aktive `Domain`-Objekt weiterzuleiten.

Um die abgefangenen Fehler zu behandeln, hören Sie auf das Ereignis `'error'`.

### `domain.members` {#domainmembers}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Ein Array von Timern und Event-Emittern, die explizit zur Domain hinzugefügt wurden.

### `domain.add(emitter)` {#domainaddemitter}

- `emitter` [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter) | [\<Timer\>](/de/nodejs/api/timers#timers) Emitter oder Timer, der zur Domain hinzugefügt werden soll

Fügt der Domain explizit einen Emitter hinzu. Wenn ein von dem Emitter aufgerufener Event-Handler einen Fehler auslöst oder der Emitter ein `'error'`-Ereignis ausgibt, wird dieser wie bei der impliziten Bindung an das `'error'`-Ereignis der Domain weitergeleitet.

Dies funktioniert auch mit Timern, die von [`setInterval()`](/de/nodejs/api/timers#setintervalcallback-delay-args) und [`setTimeout()`](/de/nodejs/api/timers#settimeoutcallback-delay-args) zurückgegeben werden. Wenn ihre Callback-Funktion einen Fehler auslöst, wird dieser vom `'error'`-Handler der Domain abgefangen.

Wenn der Timer oder `EventEmitter` bereits an eine Domain gebunden war, wird er von dieser entfernt und stattdessen an diese gebunden.

### `domain.bind(callback)` {#domainbindcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Callback-Funktion
- Gibt zurück: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die gebundene Funktion

Die zurückgegebene Funktion ist ein Wrapper um die bereitgestellte Callback-Funktion. Wenn die zurückgegebene Funktion aufgerufen wird, werden alle ausgelösten Fehler an das `'error'`-Ereignis der Domain weitergeleitet.

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.bind((er, data) => {
    // Wenn dies einen Fehler auslöst, wird dieser ebenfalls an die Domain übergeben.
    return cb(er, data ? JSON.parse(data) : null);
  }));
}

d.on('error', (er) => {
  // Irgendwo ist ein Fehler aufgetreten. Wenn wir ihn jetzt auslösen, stürzt das Programm ab
  // mit der normalen Zeilennummer und Stack-Meldung.
});
```

### `domain.enter()` {#domainenter}

Die Methode `enter()` wird intern von den Methoden `run()`, `bind()` und `intercept()` verwendet, um die aktive Domain zu setzen. Sie setzt `domain.active` und `process.domain` auf die Domain und legt die Domain implizit auf den vom Domain-Modul verwalteten Domain-Stack (siehe [`domain.exit()`](/de/nodejs/api/domain#domainexit) für Details zum Domain-Stack). Der Aufruf von `enter()` markiert den Beginn einer Kette von asynchronen Aufrufen und I/O-Operationen, die an eine Domain gebunden sind.

Der Aufruf von `enter()` ändert nur die aktive Domain und ändert die Domain selbst nicht. `enter()` und `exit()` können beliebig oft auf einer einzelnen Domain aufgerufen werden.

### `domain.exit()` {#domainexit}

Die Methode `exit()` verlässt die aktuelle Domain und entfernt sie vom Domain-Stack. Immer wenn die Ausführung in den Kontext einer anderen Kette von asynchronen Aufrufen wechselt, ist es wichtig sicherzustellen, dass die aktuelle Domain verlassen wird. Der Aufruf von `exit()` markiert entweder das Ende oder eine Unterbrechung der Kette von asynchronen Aufrufen und I/O-Operationen, die an eine Domain gebunden sind.

Wenn mehrere, verschachtelte Domains an den aktuellen Ausführungskontext gebunden sind, verlässt `exit()` alle innerhalb dieser Domain verschachtelten Domains.

Der Aufruf von `exit()` ändert nur die aktive Domain und ändert die Domain selbst nicht. `enter()` und `exit()` können beliebig oft auf einer einzelnen Domain aufgerufen werden.

### `domain.intercept(callback)` {#domaininterceptcallback}

- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Callback-Funktion
- Gibt zurück: [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die abgefangene Funktion

Diese Methode ist fast identisch mit [`domain.bind(callback)`](/de/nodejs/api/domain#domainbindcallback). Zusätzlich zum Abfangen von geworfenen Fehlern fängt sie jedoch auch [`Error`](/de/nodejs/api/errors#class-error)-Objekte ab, die als erstes Argument an die Funktion gesendet werden.

Auf diese Weise kann das übliche Muster `if (err) return callback(err);` durch einen einzigen Fehlerhandler an einer einzigen Stelle ersetzt werden.

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.intercept((data) => {
    // Beachten Sie, dass das erste Argument niemals an den
    // Callback übergeben wird, da es als das 'Error'-Argument
    // angenommen und somit von der Domain abgefangen wird.

    // Wenn dies einen Fehler wirft, wird er ebenfalls an die Domain
    // übergeben, sodass die Fehlerbehandlungslogik in das 'error'-
    // Ereignis auf der Domain verschoben werden kann, anstatt im gesamten
    // Programm wiederholt zu werden.
    return cb(null, JSON.parse(data));
  }));
}

d.on('error', (er) => {
  // Irgendwo ist ein Fehler aufgetreten. Wenn wir ihn jetzt werfen, wird das Programm
  // mit der normalen Zeilennummer und Stack-Nachricht abstürzen.
});
```

### `domain.remove(emitter)` {#domainremoveemitter}

- `emitter` [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter) | [\<Timer\>](/de/nodejs/api/timers#timers) Emitter oder Timer, der aus der Domain entfernt werden soll

Das Gegenteil von [`domain.add(emitter)`](/de/nodejs/api/domain#domainaddemitter). Entfernt die Domain-Verarbeitung vom angegebenen Emitter.

### `domain.run(fn[, ...args])` {#domainrunfn-args}

- `fn` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Führt die bereitgestellte Funktion im Kontext der Domain aus und bindet implizit alle Event-Emitter, Timer und Low-Level-Anfragen, die in diesem Kontext erstellt werden. Optional können Argumente an die Funktion übergeben werden.

Dies ist die einfachste Möglichkeit, eine Domain zu verwenden.

```js [ESM]
const domain = require('node:domain');
const fs = require('node:fs');
const d = domain.create();
d.on('error', (er) => {
  console.error('Fehler abgefangen!', er);
});
d.run(() => {
  process.nextTick(() => {
    setTimeout(() => { // Simulieren verschiedener asynchroner Dinge
      fs.open('nicht-existierende Datei', 'r', (er, fd) => {
        if (er) throw er;
        // fortfahren...
      });
    }, 100);
  });
});
```
In diesem Beispiel wird der Handler `d.on('error')` ausgelöst, anstatt das Programm zum Absturz zu bringen.

## Domains und Promises {#domains-and-promises}

Ab Node.js 8.0.0 werden die Handler von Promises innerhalb der Domain ausgeführt, in der der Aufruf von `.then()` oder `.catch()` selbst erfolgte:

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then((v) => {
    // läuft in d2
  });
});
```
Ein Callback kann mit [`domain.bind(callback)`](/de/nodejs/api/domain#domainbindcallback) an eine bestimmte Domain gebunden werden:

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then(p.domain.bind((v) => {
    // läuft in d1
  }));
});
```
Domains beeinträchtigen nicht die Fehlerbehandlungsmechanismen für Promises. Mit anderen Worten, es wird kein `'error'`-Ereignis für unbehandelte `Promise`-Ablehnungen ausgelöst.

