---
title: Node.js Trace Events
description: Dokumentation zur Verwendung der Node.js Trace Events API für Performance-Profiling und Debugging.
head:
  - - meta
    - name: og:title
      content: Node.js Trace Events | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Dokumentation zur Verwendung der Node.js Trace Events API für Performance-Profiling und Debugging.
  - - meta
    - name: twitter:title
      content: Node.js Trace Events | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Dokumentation zur Verwendung der Node.js Trace Events API für Performance-Profiling und Debugging.
---


# Trace-Ereignisse {#trace-events}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

**Quellcode:** [lib/trace_events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/trace_events.js)

Das Modul `node:trace_events` bietet einen Mechanismus zur Zentralisierung von Tracing-Informationen, die von V8, dem Node.js-Kern und Benutzercode generiert werden.

Tracing kann mit dem Kommandozeilenflag `--trace-event-categories` oder mit dem Modul `node:trace_events` aktiviert werden. Das Flag `--trace-event-categories` akzeptiert eine Liste von durch Kommas getrennten Kategorienamen.

Die verfügbaren Kategorien sind:

- `node`: Ein leerer Platzhalter.
- `node.async_hooks`: Aktiviert die Erfassung detaillierter [`async_hooks`](/de/nodejs/api/async_hooks)-Tracing-Daten. Die [`async_hooks`](/de/nodejs/api/async_hooks)-Ereignisse haben eine eindeutige `asyncId` und eine spezielle `triggerId`-Eigenschaft `triggerAsyncId`.
- `node.bootstrap`: Aktiviert die Erfassung von Node.js-Bootstrap-Meilensteinen.
- `node.console`: Aktiviert die Erfassung von `console.time()`- und `console.count()`-Ausgaben.
- `node.threadpoolwork.sync`: Aktiviert die Erfassung von Tracing-Daten für synchrone Threadpool-Operationen, wie z. B. `blob`, `zlib`, `crypto` und `node_api`.
- `node.threadpoolwork.async`: Aktiviert die Erfassung von Tracing-Daten für asynchrone Threadpool-Operationen, wie z. B. `blob`, `zlib`, `crypto` und `node_api`.
- `node.dns.native`: Aktiviert die Erfassung von Tracing-Daten für DNS-Abfragen.
- `node.net.native`: Aktiviert die Erfassung von Tracing-Daten für das Netzwerk.
- `node.environment`: Aktiviert die Erfassung von Node.js-Umgebungs-Meilensteinen.
- `node.fs.sync`: Aktiviert die Erfassung von Tracing-Daten für synchrone Dateisystemmethoden.
- `node.fs_dir.sync`: Aktiviert die Erfassung von Tracing-Daten für synchrone Dateisystem-Verzeichnis-Methoden.
- `node.fs.async`: Aktiviert die Erfassung von Tracing-Daten für asynchrone Dateisystemmethoden.
- `node.fs_dir.async`: Aktiviert die Erfassung von Tracing-Daten für asynchrone Dateisystem-Verzeichnis-Methoden.
- `node.perf`: Aktiviert die Erfassung von [Performance API](/de/nodejs/api/perf_hooks)-Messungen.
    - `node.perf.usertiming`: Aktiviert die Erfassung von ausschließlich Performance API User Timing-Messungen und -Markierungen.
    - `node.perf.timerify`: Aktiviert die Erfassung von ausschließlich Performance API timerify-Messungen.

- `node.promises.rejections`: Aktiviert die Erfassung von Tracing-Daten, die die Anzahl unbehandelter Promise-Ablehnungen und nach der Ablehnung behandelter Ablehnungen verfolgen.
- `node.vm.script`: Aktiviert die Erfassung von Tracing-Daten für die Methoden `runInNewContext()`, `runInContext()` und `runInThisContext()` des Moduls `node:vm`.
- `v8`: Die [V8](/de/nodejs/api/v8)-Ereignisse beziehen sich auf GC, Kompilierung und Ausführung.
- `node.http`: Aktiviert die Erfassung von Tracing-Daten für HTTP-Anfragen / -Antworten.
- `node.module_timer`: Aktiviert die Erfassung von Tracing-Daten für das Laden von CJS-Modulen.

Standardmäßig sind die Kategorien `node`, `node.async_hooks` und `v8` aktiviert.

```bash [BASH]
node --trace-event-categories v8,node,node.async_hooks server.js
```
Frühere Versionen von Node.js erforderten die Verwendung des Flags `--trace-events-enabled`, um Trace-Ereignisse zu aktivieren. Diese Anforderung wurde entfernt. Das Flag `--trace-events-enabled` *kann* jedoch weiterhin verwendet werden und aktiviert standardmäßig die Trace-Ereigniskategorien `node`, `node.async_hooks` und `v8`.

```bash [BASH]
node --trace-events-enabled

# ist äquivalent zu {#is-equivalent-to}

node --trace-event-categories v8,node,node.async_hooks
```
Alternativ können Trace-Ereignisse mit dem Modul `node:trace_events` aktiviert werden:

```js [ESM]
const trace_events = require('node:trace_events');
const tracing = trace_events.createTracing({ categories: ['node.perf'] });
tracing.enable();  // Aktiviert die Erfassung von Trace-Ereignissen für die Kategorie 'node.perf'

// Arbeit verrichten

tracing.disable();  // Deaktiviert die Erfassung von Trace-Ereignissen für die Kategorie 'node.perf'
```
Wenn Node.js mit aktiviertem Tracing ausgeführt wird, werden Protokolldateien erzeugt, die in der Registerkarte [`chrome://tracing`](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) von Chrome geöffnet werden können.

Die Protokolldatei heißt standardmäßig `node_trace.${rotation}.log`, wobei `${rotation}` eine inkrementelle Log-Rotation-ID ist. Das Dateipfadmuster kann mit `--trace-event-file-pattern` angegeben werden, das eine Template-Zeichenkette akzeptiert, die `${rotation}` und `${pid}` unterstützt:

```bash [BASH]
node --trace-event-categories v8 --trace-event-file-pattern '${pid}-${rotation}.log' server.js
```
Um sicherzustellen, dass die Protokolldatei nach Signalereignissen wie `SIGINT`, `SIGTERM` oder `SIGBREAK` ordnungsgemäß generiert wird, stellen Sie sicher, dass Sie die entsprechenden Handler in Ihrem Code haben, z. B.:

```js [ESM]
process.on('SIGINT', function onSigint() {
  console.info('Received SIGINT.');
  process.exit(130);  // Oder anwendbarer Exit-Code je nach Betriebssystem und Signal
});
```
Das Tracing-System verwendet die gleiche Zeitquelle wie die von `process.hrtime()`. Die Zeitstempel der Trace-Ereignisse werden jedoch in Mikrosekunden ausgedrückt, im Gegensatz zu `process.hrtime()`, das Nanosekunden zurückgibt.

Die Funktionen dieses Moduls sind in [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads nicht verfügbar.


## Das `node:trace_events`-Modul {#the-nodetrace_events-module}

**Hinzugefügt in: v10.0.0**

### `Tracing`-Objekt {#tracing-object}

**Hinzugefügt in: v10.0.0**

Das `Tracing`-Objekt wird verwendet, um die Ablaufverfolgung für Sätze von Kategorien zu aktivieren oder zu deaktivieren. Instanzen werden mit der Methode `trace_events.createTracing()` erstellt.

Beim Erstellen ist das `Tracing`-Objekt deaktiviert. Durch Aufrufen der Methode `tracing.enable()` werden die Kategorien der Menge der aktivierten Ablaufverfolgungskategorien hinzugefügt. Durch Aufrufen von `tracing.disable()` werden die Kategorien aus der Menge der aktivierten Ablaufverfolgungskategorien entfernt.

#### `tracing.categories` {#tracingcategories}

**Hinzugefügt in: v10.0.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Eine kommagetrennte Liste der Ablaufverfolgungskategorien, die von diesem `Tracing`-Objekt abgedeckt werden.

#### `tracing.disable()` {#tracingdisable}

**Hinzugefügt in: v10.0.0**

Deaktiviert dieses `Tracing`-Objekt.

Es werden nur Ablaufverfolgungskategorien deaktiviert, die *nicht* von anderen aktivierten `Tracing`-Objekten abgedeckt und *nicht* durch das Flag `--trace-event-categories` angegeben werden.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node', 'v8'] });
const t2 = trace_events.createTracing({ categories: ['node.perf', 'node'] });
t1.enable();
t2.enable();

// Gibt 'node,node.perf,v8' aus
console.log(trace_events.getEnabledCategories());

t2.disable(); // Deaktiviert nur die Ausgabe der Kategorie 'node.perf'

// Gibt 'node,v8' aus
console.log(trace_events.getEnabledCategories());
```
#### `tracing.enable()` {#tracingenable}

**Hinzugefügt in: v10.0.0**

Aktiviert dieses `Tracing`-Objekt für die Menge der Kategorien, die von dem `Tracing`-Objekt abgedeckt werden.

#### `tracing.enabled` {#tracingenabled}

**Hinzugefügt in: v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` nur, wenn das `Tracing`-Objekt aktiviert wurde.

### `trace_events.createTracing(options)` {#trace_eventscreatetracingoptions}

**Hinzugefügt in: v10.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `categories` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein Array von Ablaufverfolgungskategorienamen. Werte, die im Array enthalten sind, werden nach Möglichkeit in einen String umgewandelt. Es wird ein Fehler ausgelöst, wenn der Wert nicht umgewandelt werden kann.


- Gibt zurück: [\<Tracing\>](/de/nodejs/api/tracing#tracing-object).

Erstellt ein `Tracing`-Objekt für die angegebene Menge von `Kategorien` und gibt es zurück.

```js [ESM]
const trace_events = require('node:trace_events');
const categories = ['node.perf', 'node.async_hooks'];
const tracing = trace_events.createTracing({ categories });
tracing.enable();
// do stuff
tracing.disable();
```

### `trace_events.getEnabledCategories()` {#trace_eventsgetenabledcategories}

**Hinzugefügt in: v10.0.0**

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt eine kommagetrennte Liste aller aktuell aktivierten Trace-Event-Kategorien zurück. Die aktuelle Menge aktivierter Trace-Event-Kategorien wird durch die *Vereinigung* aller aktuell aktivierten `Tracing`-Objekte und aller Kategorien bestimmt, die mit dem Flag `--trace-event-categories` aktiviert wurden.

Angenommen, die Datei `test.js` unten, der Befehl `node --trace-event-categories node.perf test.js` gibt `'node.async_hooks,node.perf'` auf der Konsole aus.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node.async_hooks'] });
const t2 = trace_events.createTracing({ categories: ['node.perf'] });
const t3 = trace_events.createTracing({ categories: ['v8'] });

t1.enable();
t2.enable();

console.log(trace_events.getEnabledCategories());
```
## Beispiele {#examples}

### Sammeln von Trace-Event-Daten durch den Inspector {#collect-trace-events-data-by-inspector}

```js [ESM]
'use strict';

const { Session } = require('node:inspector');
const session = new Session();
session.connect();

function post(message, data) {
  return new Promise((resolve, reject) => {
    session.post(message, data, (err, result) => {
      if (err)
        reject(new Error(JSON.stringify(err)));
      else
        resolve(result);
    });
  });
}

async function collect() {
  const data = [];
  session.on('NodeTracing.dataCollected', (chunk) => data.push(chunk));
  session.on('NodeTracing.tracingComplete', () => {
    // fertig
  });
  const traceConfig = { includedCategories: ['v8'] };
  await post('NodeTracing.start', { traceConfig });
  // etwas tun
  setTimeout(() => {
    post('NodeTracing.stop').then(() => {
      session.disconnect();
      console.log(data);
    });
  }, 1000);
}

collect();
```
