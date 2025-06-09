---
title: Node.js Diagnosekanal
description: Das Diagnosekanal-Modul in Node.js bietet eine API zum Erstellen, Veröffentlichen und Abonnieren benannter Kanäle diagnostischer Informationen, was eine bessere Überwachung und Fehlersuche von Anwendungen ermöglicht.
head:
  - - meta
    - name: og:title
      content: Node.js Diagnosekanal | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das Diagnosekanal-Modul in Node.js bietet eine API zum Erstellen, Veröffentlichen und Abonnieren benannter Kanäle diagnostischer Informationen, was eine bessere Überwachung und Fehlersuche von Anwendungen ermöglicht.
  - - meta
    - name: twitter:title
      content: Node.js Diagnosekanal | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das Diagnosekanal-Modul in Node.js bietet eine API zum Erstellen, Veröffentlichen und Abonnieren benannter Kanäle diagnostischer Informationen, was eine bessere Überwachung und Fehlersuche von Anwendungen ermöglicht.
---


# Diagnosekanal {#diagnostics-channel}


::: info [Historie]
| Version | Änderungen |
|---|---|
| v19.2.0, v18.13.0 | diagnostics_channel ist jetzt stabil. |
| v15.1.0, v14.17.0 | Hinzugefügt in: v15.1.0, v14.17.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/diagnostics_channel.js](https://github.com/nodejs/node/blob/v23.5.0/lib/diagnostics_channel.js)

Das `node:diagnostics_channel`-Modul stellt eine API zum Erstellen benannter Kanäle bereit, um beliebige Nachrichtendaten für Diagnosezwecke zu melden.

Es kann verwendet werden mit:



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
```
:::

Es ist beabsichtigt, dass ein Modulautor, der Diagnosemeldungen melden möchte, einen oder mehrere Kanäle auf oberster Ebene erstellt, um Meldungen darüber zu melden. Kanäle können auch zur Laufzeit erworben werden, dies wird jedoch aufgrund des zusätzlichen Aufwands nicht empfohlen. Kanäle können der Einfachheit halber exportiert werden, aber solange der Name bekannt ist, kann er überall abgerufen werden.

Wenn Sie beabsichtigen, dass Ihr Modul Diagnosedaten zur Nutzung durch andere erzeugt, wird empfohlen, dass Sie eine Dokumentation der verwendeten benannten Kanäle zusammen mit der Form der Nachrichtendaten beifügen. Kanalnamen sollten im Allgemeinen den Modulnamen enthalten, um Kollisionen mit Daten aus anderen Modulen zu vermeiden.

## Öffentliche API {#public-api}

### Übersicht {#overview}

Im Folgenden finden Sie eine einfache Übersicht über die öffentliche API.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

// Abrufen eines wiederverwendbaren Kanalobjekts
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Empfangene Daten
}

// Kanal abonnieren
diagnostics_channel.subscribe('my-channel', onMessage);

// Überprüfen, ob der Kanal einen aktiven Abonnenten hat
if (channel.hasSubscribers) {
  // Daten im Kanal veröffentlichen
  channel.publish({
    some: 'data',
  });
}

// Kanal abbestellen
diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

// Abrufen eines wiederverwendbaren Kanalobjekts
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Empfangene Daten
}

// Kanal abonnieren
diagnostics_channel.subscribe('my-channel', onMessage);

// Überprüfen, ob der Kanal einen aktiven Abonnenten hat
if (channel.hasSubscribers) {
  // Daten im Kanal veröffentlichen
  channel.publish({
    some: 'data',
  });
}

// Kanal abbestellen
diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::


#### `diagnostics_channel.hasSubscribers(name)` {#diagnostics_channelhassubscribersname}

**Hinzugefügt in: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Kanalname
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob es aktive Abonnenten gibt

Prüft, ob es aktive Abonnenten für den benannten Kanal gibt. Dies ist hilfreich, wenn die Nachricht, die Sie senden möchten, möglicherweise teuer in der Vorbereitung ist.

Diese API ist optional, aber hilfreich, wenn versucht wird, Nachrichten aus sehr leistungssensiblem Code zu veröffentlichen.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // Es gibt Abonnenten, Nachricht vorbereiten und veröffentlichen
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // Es gibt Abonnenten, Nachricht vorbereiten und veröffentlichen
}
```
:::

#### `diagnostics_channel.channel(name)` {#diagnostics_channelchannelname}

**Hinzugefügt in: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Kanalname
- Gibt zurück: [\<Channel\>](/de/nodejs/api/diagnostics_channel#class-channel) Das benannte Kanalobjekt

Dies ist der primäre Einstiegspunkt für alle, die in einem benannten Kanal veröffentlichen möchten. Es erzeugt ein Kanalobjekt, das optimiert ist, um den Overhead zur Veröffentlichungszeit so gering wie möglich zu halten.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');
```
:::

#### `diagnostics_channel.subscribe(name, onMessage)` {#diagnostics_channelsubscribename-onmessage}

**Hinzugefügt in: v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Kanalname
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der Handler, der Kanalnachrichten empfängt
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Die Nachrichtendaten
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Name des Kanals
  
 

Registriert einen Nachricht-Handler, um diesen Kanal zu abonnieren. Dieser Nachricht-Handler wird synchron ausgeführt, wenn eine Nachricht an den Kanal veröffentlicht wird. Alle Fehler, die im Nachricht-Handler auftreten, lösen ein [`'uncaughtException'`](/de/nodejs/api/process#event-uncaughtexception) aus.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Daten empfangen
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Daten empfangen
});
```
:::


#### `diagnostics_channel.unsubscribe(name, onMessage)` {#diagnostics_channelunsubscribename-onmessage}

**Hinzugefügt in: v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Kanalname
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der zuvor abonnierte Handler, der entfernt werden soll
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn der Handler gefunden wurde, andernfalls `false`.

Entfernt einen Nachrichtenhandler, der zuvor bei diesem Kanal mit [`diagnostics_channel.subscribe(name, onMessage)`](/de/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage) registriert wurde.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

function onMessage(message, name) {
  // Empfangene Daten
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

function onMessage(message, name) {
  // Empfangene Daten
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::

#### `diagnostics_channel.tracingChannel(nameOrChannels)` {#diagnostics_channeltracingchannelnameorchannels}

**Hinzugefügt in: v19.9.0, v18.19.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `nameOrChannels` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TracingChannel\>](/de/nodejs/api/diagnostics_channel#class-tracingchannel) Kanalname oder Objekt, das alle [TracingChannel-Kanäle](/de/nodejs/api/diagnostics_channel#tracingchannel-channels) enthält
- Gibt zurück: [\<TracingChannel\>](/de/nodejs/api/diagnostics_channel#class-tracingchannel) Sammlung von Kanälen, mit denen verfolgt werden soll

Erstellt einen [`TracingChannel`](/de/nodejs/api/diagnostics_channel#class-tracingchannel)-Wrapper für die angegebenen [TracingChannel-Kanäle](/de/nodejs/api/diagnostics_channel#tracingchannel-channels). Wenn ein Name angegeben wird, werden die entsprechenden Tracing-Kanäle in der Form `tracing:${name}:${eventType}` erstellt, wobei `eventType` den Typen der [TracingChannel-Kanäle](/de/nodejs/api/diagnostics_channel#tracingchannel-channels) entspricht.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// oder...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// oder...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```
:::


### Klasse: `Channel` {#class-channel}

**Hinzugefügt in: v15.1.0, v14.17.0**

Die Klasse `Channel` repräsentiert einen einzelnen benannten Kanal innerhalb der Datenpipeline. Sie wird verwendet, um Abonnenten zu verfolgen und Nachrichten zu veröffentlichen, wenn Abonnenten vorhanden sind. Sie existiert als separates Objekt, um Kanalsuchen zur Veröffentlichungszeit zu vermeiden, wodurch sehr schnelle Veröffentlichungsgeschwindigkeiten ermöglicht und eine intensive Nutzung bei minimalen Kosten ermöglicht wird. Kanäle werden mit [`diagnostics_channel.channel(name)`](/de/nodejs/api/diagnostics_channel#diagnostics_channelchannelname) erstellt. Das direkte Erstellen eines Kanals mit `new Channel(name)` wird nicht unterstützt.

#### `channel.hasSubscribers` {#channelhassubscribers}

**Hinzugefügt in: v15.1.0, v14.17.0**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob aktive Abonnenten vorhanden sind

Prüfen Sie, ob es aktive Abonnenten für diesen Kanal gibt. Dies ist hilfreich, wenn die Nachricht, die Sie senden möchten, möglicherweise teuer in der Vorbereitung ist.

Diese API ist optional, aber hilfreich, wenn versucht wird, Nachrichten aus sehr leistungssensitivem Code zu veröffentlichen.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // Es gibt Abonnenten, Nachricht vorbereiten und veröffentlichen
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // Es gibt Abonnenten, Nachricht vorbereiten und veröffentlichen
}
```
:::

#### `channel.publish(message)` {#channelpublishmessage}

**Hinzugefügt in: v15.1.0, v14.17.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Die Nachricht, die an die Kanalabonnenten gesendet werden soll

Veröffentlicht eine Nachricht an alle Abonnenten des Kanals. Dies löst Nachrichtenhandler synchron aus, sodass sie im selben Kontext ausgeführt werden.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```
:::


#### `channel.subscribe(onMessage)` {#channelsubscribeonmessage}

**Hinzugefügt in: v15.1.0, v14.17.0**

**Veraltet seit: v18.7.0, v16.17.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie [`diagnostics_channel.subscribe(name, onMessage)`](/de/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der Handler zum Empfangen von Kanalnachrichten
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Die Nachrichtendaten
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Name des Kanals
  
 

Registriert einen Nachrichten-Handler, um diesen Kanal zu abonnieren. Dieser Nachrichten-Handler wird synchron ausgeführt, wenn eine Nachricht an den Kanal veröffentlicht wird. Alle Fehler, die im Nachrichten-Handler auftreten, lösen ein [`'uncaughtException'`](/de/nodejs/api/process#event-uncaughtexception) aus.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Empfangene Daten
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Empfangene Daten
});
```
:::

#### `channel.unsubscribe(onMessage)` {#channelunsubscribeonmessage}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.7.0, v16.17.0 | Veraltet seit: v18.7.0, v16.17.0 |
| v17.1.0, v16.14.0, v14.19.0 | Rückgabewert hinzugefügt. Zu Kanälen ohne Abonnenten hinzugefügt. |
| v15.1.0, v14.17.0 | Hinzugefügt in: v15.1.0, v14.17.0 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie [`diagnostics_channel.unsubscribe(name, onMessage)`](/de/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der zuvor abonnierte Handler, der entfernt werden soll
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn der Handler gefunden wurde, `false` andernfalls.

Entfernt einen Nachrichten-Handler, der zuvor mit [`channel.subscribe(onMessage)`](/de/nodejs/api/diagnostics_channel#channelsubscribeonmessage) für diesen Kanal registriert wurde.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Empfangene Daten
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Empfangene Daten
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```
:::


#### `channel.bindStore(store[, transform])` {#channelbindstorestore-transform}

**Hinzugefügt in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stability: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `store` [\<AsyncLocalStorage\>](/de/nodejs/api/async_context#class-asynclocalstorage) Der Store, an den die Kontextdaten gebunden werden sollen.
- `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Transformiert Kontextdaten, bevor der Store-Kontext festgelegt wird.

Wenn [`channel.runStores(context, ...)`](/de/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) aufgerufen wird, werden die angegebenen Kontextdaten auf jeden an den Kanal gebundenen Store angewendet. Wenn der Store bereits gebunden wurde, wird die vorherige `transform`-Funktion durch die neue ersetzt. Die `transform`-Funktion kann weggelassen werden, um die angegebenen Kontextdaten direkt als Kontext festzulegen.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```
:::

#### `channel.unbindStore(store)` {#channelunbindstorestore}

**Hinzugefügt in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stability: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `store` [\<AsyncLocalStorage\>](/de/nodejs/api/async_context#class-asynclocalstorage) Der Store, der vom Kanal entbunden werden soll.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn der Store gefunden wurde, andernfalls `false`.

Entfernt einen Nachrichtenhandler, der zuvor mit [`channel.bindStore(store)`](/de/nodejs/api/diagnostics_channel#channelbindstorestore-transform) für diesen Kanal registriert wurde.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```
:::


#### `channel.runStores(context, fn[, thisArg[, ...args]])` {#channelrunstorescontext-fn-thisarg-args}

**Hinzugefügt in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimental
:::

- `context` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Nachricht, die an Abonnenten gesendet und an Stores gebunden werden soll
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Handler, der innerhalb des eingegebenen Speicherkontexts ausgeführt wird
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der Empfänger, der für den Funktionsaufruf verwendet werden soll.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optionale Argumente, die an die Funktion übergeben werden sollen.

Wendet die angegebenen Daten für die Dauer der angegebenen Funktion auf alle an den Kanal gebundenen AsyncLocalStorage-Instanzen an und veröffentlicht sie dann innerhalb des Gültigkeitsbereichs dieser Daten auf dem Kanal, der auf die Stores angewendet wird.

Wenn eine Transformationsfunktion an [`channel.bindStore(store)`](/de/nodejs/api/diagnostics_channel#channelbindstorestore-transform) übergeben wurde, wird sie angewendet, um die Nachrichtendaten zu transformieren, bevor sie zum Kontextwert für den Store werden. Der vorherige Speicherkontext ist innerhalb der Transformationsfunktion zugänglich, wenn eine Kontextverknüpfung erforderlich ist.

Der auf den Store angewendete Kontext sollte in jedem asynchronen Code zugänglich sein, der aus der Ausführung fortgesetzt wird, die während der angegebenen Funktion begonnen hat. Es gibt jedoch einige Situationen, in denen [Kontextverlust](/de/nodejs/api/async_context#troubleshooting-context-loss) auftreten kann.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```
:::


### Klasse: `TracingChannel` {#class-tracingchannel}

**Hinzugefügt in: v19.9.0, v18.19.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Die Klasse `TracingChannel` ist eine Sammlung von [TracingChannel-Kanälen](/de/nodejs/api/diagnostics_channel#tracingchannel-channels), die zusammen eine einzelne nachverfolgbare Aktion ausdrücken. Sie wird verwendet, um den Prozess der Erzeugung von Ereignissen zur Verfolgung des Anwendungsflusses zu formalisieren und zu vereinfachen. [`diagnostics_channel.tracingChannel()`](/de/nodejs/api/diagnostics_channel#diagnostics_channeltracingchannelnameorchannels) wird verwendet, um einen `TracingChannel` zu konstruieren. Wie bei `Channel` wird empfohlen, einen einzelnen `TracingChannel` auf oberster Ebene der Datei zu erstellen und wiederzuverwenden, anstatt sie dynamisch zu erstellen.

#### `tracingChannel.subscribe(subscribers)` {#tracingchannelsubscribesubscribers}

**Hinzugefügt in: v19.9.0, v18.19.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Satz von [TracingChannel-Kanälen](/de/nodejs/api/diagnostics_channel#tracingchannel-channels)-Abonnenten
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der Abonnent des [`start`-Ereignisses](/de/nodejs/api/diagnostics_channel#startevent)
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der Abonnent des [`end`-Ereignisses](/de/nodejs/api/diagnostics_channel#endevent)
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der Abonnent des [`asyncStart`-Ereignisses](/de/nodejs/api/diagnostics_channel#asyncstartevent)
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der Abonnent des [`asyncEnd`-Ereignisses](/de/nodejs/api/diagnostics_channel#asyncendevent)
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der Abonnent des [`error`-Ereignisses](/de/nodejs/api/diagnostics_channel#errorevent)
  
 

Helfer zum Abonnieren einer Sammlung von Funktionen für die entsprechenden Kanäle. Dies ist das gleiche wie der Aufruf von [`channel.subscribe(onMessage)`](/de/nodejs/api/diagnostics_channel#channelsubscribeonmessage) für jeden Kanal einzeln.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::


#### `tracingChannel.unsubscribe(subscribers)` {#tracingchannelunsubscribesubscribers}

**Hinzugefügt in: v19.9.0, v18.19.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Satz von [TracingChannel Kanäle](/de/nodejs/api/diagnostics_channel#tracingchannel-channels) Abonnenten
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der [`start` Event](/de/nodejs/api/diagnostics_channel#startevent) Abonnent
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der [`end` Event](/de/nodejs/api/diagnostics_channel#endevent) Abonnent
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der [`asyncStart` Event](/de/nodejs/api/diagnostics_channel#asyncstartevent) Abonnent
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der [`asyncEnd` Event](/de/nodejs/api/diagnostics_channel#asyncendevent) Abonnent
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der [`error` Event](/de/nodejs/api/diagnostics_channel#errorevent) Abonnent
  
 
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` wenn alle Handler erfolgreich abgemeldet wurden und `false` andernfalls.

Helferfunktion, um eine Sammlung von Funktionen von den entsprechenden Kanälen abzumelden. Dies ist das gleiche wie der Aufruf von [`channel.unsubscribe(onMessage)`](/de/nodejs/api/diagnostics_channel#channelunsubscribeonmessage) für jeden Kanal einzeln.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::


#### `tracingChannel.traceSync(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracesyncfn-context-thisarg-args}

**Hinzugefügt in: v19.9.0, v18.19.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `fn` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funktion, um die eine Ablaufverfolgung gewickelt wird
- `context` [\<Objekt\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Gemeinsames Objekt, um Ereignisse zu korrelieren
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der Empfänger, der für den Funktionsaufruf verwendet werden soll
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optionale Argumente, die an die Funktion übergeben werden sollen
- Rückgabe: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der Rückgabewert der gegebenen Funktion

Verfolgen Sie einen synchronen Funktionsaufruf. Dies erzeugt immer ein [`start`-Ereignis](/de/nodejs/api/diagnostics_channel#startevent) und ein [`end`-Ereignis](/de/nodejs/api/diagnostics_channel#endevent) um die Ausführung herum und kann ein [`error`-Ereignis](/de/nodejs/api/diagnostics_channel#errorevent) erzeugen, wenn die gegebene Funktion einen Fehler auslöst. Dies führt die gegebene Funktion mit [`channel.runStores(context, ...)`](/de/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) auf dem `start`-Kanal aus, was sicherstellt, dass alle Ereignisse alle gebundenen Speicher haben, die auf diesen Ablaufverfolgungskontext gesetzt sind.

Um sicherzustellen, dass nur korrekte Ablaufverfolgungsgraphen gebildet werden, werden Ereignisse nur dann veröffentlicht, wenn vor dem Start der Ablaufverfolgung Abonnenten vorhanden sind. Abonnements, die nach dem Start der Ablaufverfolgung hinzugefügt werden, erhalten keine zukünftigen Ereignisse von dieser Ablaufverfolgung, nur zukünftige Ablaufverfolgungen werden angezeigt.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.tracePromise(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracepromisefn-context-thisarg-args}

**Hinzugefügt in: v19.9.0, v18.19.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Promise-zurückgebende Funktion, um einen Trace herumzulegen
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Gemeinsames Objekt zur Korrelation von Trace-Ereignissen
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der Empfänger, der für den Funktionsaufruf verwendet werden soll
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optionale Argumente, die an die Funktion übergeben werden sollen
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Verkettet von der von der gegebenen Funktion zurückgegebenen Promise

Verfolgen Sie einen Promise-zurückgebenden Funktionsaufruf. Dies erzeugt immer ein [`start`-Ereignis](/de/nodejs/api/diagnostics_channel#startevent) und ein [`end`-Ereignis](/de/nodejs/api/diagnostics_channel#endevent) um den synchronen Teil der Funktionsausführung herum und erzeugt ein [`asyncStart`-Ereignis](/de/nodejs/api/diagnostics_channel#asyncstartevent) und ein [`asyncEnd`-Ereignis](/de/nodejs/api/diagnostics_channel#asyncendevent), wenn eine Promise-Fortsetzung erreicht wird. Es kann auch ein [`error`-Ereignis](/de/nodejs/api/diagnostics_channel#errorevent) erzeugen, wenn die gegebene Funktion einen Fehler wirft oder die zurückgegebene Promise abgelehnt wird. Dies führt die gegebene Funktion mit [`channel.runStores(context, ...)`](/de/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) auf dem `start`-Kanal aus, wodurch sichergestellt wird, dass alle Ereignisse alle gebundenen Stores so gesetzt haben, dass sie mit diesem Trace-Kontext übereinstimmen.

Um sicherzustellen, dass nur korrekte Trace-Graphen gebildet werden, werden Ereignisse nur dann veröffentlicht, wenn vor Beginn des Traces Abonnenten vorhanden sind. Abonnements, die nach Beginn des Traces hinzugefügt werden, erhalten keine zukünftigen Ereignisse von diesem Trace, sondern nur zukünftige Traces.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.traceCallback(fn[, position[, context[, thisArg[, ...args]]]])` {#tracingchanneltracecallbackfn-position-context-thisarg-args}

**Hinzugefügt in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback-Funktion zur Umhüllung eines Trace
- `position` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nullbasierte Argumentposition des erwarteten Callbacks (standardmäßig das letzte Argument, wenn `undefined` übergeben wird)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Gemeinsames Objekt zur Korrelation von Trace-Ereignissen (standardmäßig `{}` wenn `undefined` übergeben wird)
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der Empfänger, der für den Funktionsaufruf verwendet werden soll
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumente, die an die Funktion übergeben werden sollen (muss den Callback enthalten)
- Gibt zurück: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der Rückgabewert der gegebenen Funktion

Verfolge einen Callback-empfangenden Funktionsaufruf. Es wird erwartet, dass der Callback der üblichen Konvention folgt, den Fehler als erstes Argument zu übergeben. Dies erzeugt immer ein [`start` Ereignis](/de/nodejs/api/diagnostics_channel#startevent) und ein [`end` Ereignis](/de/nodejs/api/diagnostics_channel#endevent) um den synchronen Teil der Funktionsausführung herum und erzeugt ein [`asyncStart` Ereignis](/de/nodejs/api/diagnostics_channel#asyncstartevent) und ein [`asyncEnd` Ereignis](/de/nodejs/api/diagnostics_channel#asyncendevent) um die Callback-Ausführung herum. Es kann auch ein [`error` Ereignis](/de/nodejs/api/diagnostics_channel#errorevent) erzeugen, wenn die gegebene Funktion einen Fehler auslöst oder das erste an den Callback übergebene Argument gesetzt ist. Dies führt die gegebene Funktion mit [`channel.runStores(context, ...)`](/de/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) auf dem `start` Kanal aus, was sicherstellt, dass alle Ereignisse alle gebundenen Stores so gesetzt haben sollten, dass sie mit diesem Trace-Kontext übereinstimmen.

Um sicherzustellen, dass nur korrekte Trace-Graphen gebildet werden, werden Ereignisse nur dann veröffentlicht, wenn vor dem Starten des Trace Abonnenten vorhanden sind. Abonnements, die nach dem Start des Trace hinzugefügt werden, erhalten keine zukünftigen Ereignisse von diesem Trace, sondern sehen nur zukünftige Traces.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```
:::

Der Callback wird auch mit [`channel.runStores(context, ...)`](/de/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) ausgeführt, was in einigen Fällen die Wiederherstellung von Kontextverlusten ermöglicht.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```
:::


#### `tracingChannel.hasSubscribers` {#tracingchannelhassubscribers}

**Hinzugefügt in: v22.0.0, v20.13.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn einer der einzelnen Kanäle einen Subscriber hat, `false`, wenn nicht.

Dies ist eine Hilfsmethode, die auf einer [`TracingChannel`](/de/nodejs/api/diagnostics_channel#class-tracingchannel)-Instanz verfügbar ist, um zu prüfen, ob einer der [TracingChannel-Kanäle](/de/nodejs/api/diagnostics_channel#tracingchannel-channels) Subscriber hat. Es wird `true` zurückgegeben, wenn mindestens einer von ihnen mindestens einen Subscriber hat, andernfalls wird `false` zurückgegeben.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```
:::

### TracingChannel-Kanäle {#tracingchannel-channels}

Ein TracingChannel ist eine Sammlung mehrerer diagnostics_channels, die bestimmte Punkte im Ausführungslebenszyklus einer einzelnen nachverfolgbaren Aktion darstellen. Das Verhalten ist in fünf diagnostics_channels unterteilt, die aus `start`, `end`, `asyncStart`, `asyncEnd` und `error` bestehen. Eine einzelne nachverfolgbare Aktion teilt sich dasselbe Event-Objekt zwischen allen Ereignissen. Dies kann hilfreich sein, um die Korrelation über eine WeakMap zu verwalten.

Diese Event-Objekte werden mit `result`- oder `error`-Werten erweitert, wenn die Aufgabe "abgeschlossen" ist. Im Falle einer synchronen Aufgabe ist das `result` der Rückgabewert und der `error` alles, was von der Funktion geworfen wird. Bei Callback-basierten asynchronen Funktionen ist das `result` das zweite Argument des Callbacks, während der `error` entweder ein geworfener Fehler ist, der im `end`-Ereignis sichtbar ist, oder das erste Callback-Argument in einem der `asyncStart`- oder `asyncEnd`-Ereignisse.

Um sicherzustellen, dass nur korrekte Trace-Graphen gebildet werden, sollten Ereignisse nur dann veröffentlicht werden, wenn vor dem Start des Traces Subscriber vorhanden sind. Subscriptions, die nach Beginn des Traces hinzugefügt werden, sollten keine zukünftigen Ereignisse von diesem Trace empfangen, sondern nur zukünftige Traces sehen.

Tracing-Kanäle sollten einem Namensmuster folgen:

- `tracing:module.class.method:start` oder `tracing:module.function:start`
- `tracing:module.class.method:end` oder `tracing:module.function:end`
- `tracing:module.class.method:asyncStart` oder `tracing:module.function:asyncStart`
- `tracing:module.class.method:asyncEnd` oder `tracing:module.function:asyncEnd`
- `tracing:module.class.method:error` oder `tracing:module.function:error`


#### `start(event)` {#startevent}

- Name: `tracing:${name}:start`

Das `start`-Ereignis repräsentiert den Zeitpunkt, an dem eine Funktion aufgerufen wird. Zu diesem Zeitpunkt können die Ereignisdaten Funktionsargumente oder alles andere enthalten, was zu Beginn der Ausführung der Funktion verfügbar ist.

#### `end(event)` {#endevent}

- Name: `tracing:${name}:end`

Das `end`-Ereignis repräsentiert den Zeitpunkt, an dem ein Funktionsaufruf einen Wert zurückgibt. Im Falle einer asynchronen Funktion ist dies der Zeitpunkt, an dem das zurückgegebene Promise aufgelöst wird, nicht der Zeitpunkt, an dem die Funktion selbst intern eine Return-Anweisung ausführt. Zu diesem Zeitpunkt wird das Feld `result` auf den Rückgabewert der Funktion gesetzt, wenn die getrackte Funktion synchron war. Alternativ kann das Feld `error` vorhanden sein, um alle ausgelösten Fehler darzustellen.

Es wird empfohlen, speziell auf das `error`-Ereignis zu hören, um Fehler zu verfolgen, da es möglich ist, dass eine nachverfolgbare Aktion mehrere Fehler erzeugt. Beispielsweise kann eine fehlgeschlagene asynchrone Aufgabe intern gestartet werden, bevor der synchrone Teil der Aufgabe einen Fehler auslöst.

#### `asyncStart(event)` {#asyncstartevent}

- Name: `tracing:${name}:asyncStart`

Das `asyncStart`-Ereignis repräsentiert das Erreichen des Callbacks oder der Fortsetzung einer nachverfolgbaren Funktion. An diesem Punkt können Dinge wie Callback-Argumente oder alles andere verfügbar sein, was das "Ergebnis" der Aktion ausdrückt.

Bei Callback-basierten Funktionen wird das erste Argument des Callbacks dem Feld `error` zugewiesen, falls es nicht `undefined` oder `null` ist, und das zweite Argument wird dem Feld `result` zugewiesen.

Bei Promises wird das Argument zum `resolve`-Pfad `result` zugewiesen oder das Argument zum `reject`-Pfad `error` zugewiesen.

Es wird empfohlen, speziell auf das `error`-Ereignis zu hören, um Fehler zu verfolgen, da es möglich ist, dass eine nachverfolgbare Aktion mehrere Fehler erzeugt. Beispielsweise kann eine fehlgeschlagene asynchrone Aufgabe intern gestartet werden, bevor der synchrone Teil der Aufgabe einen Fehler auslöst.

#### `asyncEnd(event)` {#asyncendevent}

- Name: `tracing:${name}:asyncEnd`

Das `asyncEnd`-Ereignis repräsentiert die Rückgabe des Callbacks einer asynchronen Funktion. Es ist unwahrscheinlich, dass sich die Ereignisdaten nach dem `asyncStart`-Ereignis ändern, es kann jedoch nützlich sein, den Zeitpunkt zu sehen, an dem der Callback abgeschlossen ist.


#### `error(event)` {#errorevent}

- Name: `tracing:${name}:error`

Das `error`-Ereignis repräsentiert jeden Fehler, der von der nachverfolgbaren Funktion entweder synchron oder asynchron erzeugt wird. Wenn ein Fehler im synchronen Teil der verfolgten Funktion ausgelöst wird, wird der Fehler dem Feld `error` des Ereignisses zugewiesen und das `error`-Ereignis ausgelöst. Wenn ein Fehler asynchron über einen Callback oder eine Promise-Ablehnung empfangen wird, wird er ebenfalls dem Feld `error` des Ereignisses zugewiesen und das `error`-Ereignis ausgelöst.

Es ist möglich, dass ein einzelner Aufruf einer nachverfolgbaren Funktion mehrmals Fehler erzeugt. Dies sollte bei der Nutzung dieses Ereignisses berücksichtigt werden. Wenn beispielsweise eine andere intern ausgelöste asynchrone Aufgabe fehlschlägt und der synchrone Teil der Funktion dann einen Fehler auslöst, werden zwei `error`-Ereignisse ausgelöst, eines für den synchronen Fehler und eines für den asynchronen Fehler.

### Integrierte Kanäle {#built-in-channels}

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Obwohl die diagnostics_channel-API jetzt als stabil gilt, sind die derzeit verfügbaren integrierten Kanäle dies nicht. Jeder Kanal muss unabhängig als stabil deklariert werden.

#### HTTP {#http}

`http.client.request.created`

- `request` [\<http.ClientRequest\>](/de/nodejs/api/http#class-httpclientrequest)

Wird ausgelöst, wenn ein Client ein Anforderungsobjekt erstellt. Im Gegensatz zu `http.client.request.start` wird dieses Ereignis ausgelöst, bevor die Anforderung gesendet wurde.

`http.client.request.start`

- `request` [\<http.ClientRequest\>](/de/nodejs/api/http#class-httpclientrequest)

Wird ausgelöst, wenn ein Client eine Anforderung startet.

`http.client.request.error`

- `request` [\<http.ClientRequest\>](/de/nodejs/api/http#class-httpclientrequest)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Wird ausgelöst, wenn während einer Clientanforderung ein Fehler auftritt.

`http.client.response.finish`

- `request` [\<http.ClientRequest\>](/de/nodejs/api/http#class-httpclientrequest)
- `response` [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage)

Wird ausgelöst, wenn ein Client eine Antwort empfängt.

`http.server.request.start`

- `request` [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/de/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/de/nodejs/api/http#class-httpserver)

Wird ausgelöst, wenn ein Server eine Anforderung empfängt.

`http.server.response.created`

- `request` [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/de/nodejs/api/http#class-httpserverresponse)

Wird ausgelöst, wenn ein Server eine Antwort erstellt. Das Ereignis wird ausgelöst, bevor die Antwort gesendet wird.

`http.server.response.finish`

- `request` [\<http.IncomingMessage\>](/de/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/de/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/de/nodejs/api/http#class-httpserver)

Wird ausgelöst, wenn ein Server eine Antwort sendet.


#### Module {#modules}

`module.require.start`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) mit den folgenden Eigenschaften
    - `id` - Argument, das an `require()` übergeben wurde. Modulname.
    - `parentFilename` - Name des Moduls, das versucht hat, require(id) aufzurufen.
  
 

Wird ausgegeben, wenn `require()` ausgeführt wird. Siehe [`start` Event](/de/nodejs/api/diagnostics_channel#startevent).

`module.require.end`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) mit den folgenden Eigenschaften
    - `id` - Argument, das an `require()` übergeben wurde. Modulname.
    - `parentFilename` - Name des Moduls, das versucht hat, require(id) aufzurufen.
  
 

Wird ausgegeben, wenn ein `require()`-Aufruf zurückkehrt. Siehe [`end` Event](/de/nodejs/api/diagnostics_channel#endevent).

`module.require.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) mit den folgenden Eigenschaften
    - `id` - Argument, das an `require()` übergeben wurde. Modulname.
    - `parentFilename` - Name des Moduls, das versucht hat, require(id) aufzurufen.
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Wird ausgegeben, wenn ein `require()` einen Fehler auslöst. Siehe [`error` Event](/de/nodejs/api/diagnostics_channel#errorevent).

`module.import.asyncStart`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) mit den folgenden Eigenschaften
    - `id` - Argument, das an `import()` übergeben wurde. Modulname.
    - `parentURL` - URL-Objekt des Moduls, das versucht hat, import(id) aufzurufen.
  
 

Wird ausgegeben, wenn `import()` aufgerufen wird. Siehe [`asyncStart` Event](/de/nodejs/api/diagnostics_channel#asyncstartevent).

`module.import.asyncEnd`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) mit den folgenden Eigenschaften
    - `id` - Argument, das an `import()` übergeben wurde. Modulname.
    - `parentURL` - URL-Objekt des Moduls, das versucht hat, import(id) aufzurufen.
  
 

Wird ausgegeben, wenn `import()` abgeschlossen ist. Siehe [`asyncEnd` Event](/de/nodejs/api/diagnostics_channel#asyncendevent).

`module.import.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) mit den folgenden Eigenschaften
    - `id` - Argument, das an `import()` übergeben wurde. Modulname.
    - `parentURL` - URL-Objekt des Moduls, das versucht hat, import(id) aufzurufen.
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Wird ausgegeben, wenn ein `import()` einen Fehler auslöst. Siehe [`error` Event](/de/nodejs/api/diagnostics_channel#errorevent).


#### NET {#net}

`net.client.socket`

- `socket` [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)

Wird ausgegeben, wenn ein neuer TCP- oder Pipe-Client-Socket erstellt wird.

`net.server.socket`

- `socket` [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)

Wird ausgegeben, wenn eine neue TCP- oder Pipe-Verbindung empfangen wird.

`tracing:net.server.listen:asyncStart`

- `server` [\<net.Server\>](/de/nodejs/api/net#class-netserver)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Wird ausgegeben, wenn [`net.Server.listen()`](/de/nodejs/api/net#serverlisten) aufgerufen wird, bevor der Port oder die Pipe tatsächlich eingerichtet ist.

`tracing:net.server.listen:asyncEnd`

- `server` [\<net.Server\>](/de/nodejs/api/net#class-netserver)

Wird ausgegeben, wenn [`net.Server.listen()`](/de/nodejs/api/net#serverlisten) abgeschlossen ist und der Server somit bereit ist, Verbindungen anzunehmen.

`tracing:net.server.listen:error`

- `server` [\<net.Server\>](/de/nodejs/api/net#class-netserver)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Wird ausgegeben, wenn [`net.Server.listen()`](/de/nodejs/api/net#serverlisten) einen Fehler zurückgibt.

#### UDP {#udp}

`udp.socket`

- `socket` [\<dgram.Socket\>](/de/nodejs/api/dgram#class-dgramsocket)

Wird ausgegeben, wenn ein neuer UDP-Socket erstellt wird.

#### Process {#process}

**Hinzugefügt in: v16.18.0**

`child_process`

- `process` [\<ChildProcess\>](/de/nodejs/api/child_process#class-childprocess)

Wird ausgegeben, wenn ein neuer Prozess erstellt wird.

#### Worker Thread {#worker-thread}

**Hinzugefügt in: v16.18.0**

`worker_threads`

- `worker` [`Worker`](/de/nodejs/api/worker_threads#class-worker)

Wird ausgegeben, wenn ein neuer Thread erstellt wird.

