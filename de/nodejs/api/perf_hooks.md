---
title: Node.js Dokumentation - Performance-Hooks
description: Erkunden Sie die Performance-Hooks-API in Node.js, die Zugriff auf Leistungsmetriken und Werkzeuge zum Messen der Leistung von Node.js-Anwendungen bietet.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Performance-Hooks | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erkunden Sie die Performance-Hooks-API in Node.js, die Zugriff auf Leistungsmetriken und Werkzeuge zum Messen der Leistung von Node.js-Anwendungen bietet.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Performance-Hooks | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erkunden Sie die Performance-Hooks-API in Node.js, die Zugriff auf Leistungsmetriken und Werkzeuge zum Messen der Leistung von Node.js-Anwendungen bietet.
---


# Performance-Messungs-APIs {#performance-measurement-apis}

::: tip [Stable: 2 - Stable]
[Stable: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/perf_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/perf_hooks.js)

Dieses Modul bietet eine Implementierung einer Teilmenge der W3C [Web Performance APIs](https://w3c.github.io/perf-timing-primer/) sowie zusätzliche APIs für Node.js-spezifische Performance-Messungen.

Node.js unterstützt die folgenden [Web Performance APIs](https://w3c.github.io/perf-timing-primer/):

- [High Resolution Time](https://www.w3.org/TR/hr-time-2)
- [Performance Timeline](https://w3c.github.io/performance-timeline/)
- [User Timing](https://www.w3.org/TR/user-timing/)
- [Resource Timing](https://w3c.github.io/resource-timing-2/)



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
doSomeLongRunningProcess(() => {
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
});
```

```js [CJS]
const { PerformanceObserver, performance } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
(async function doSomeLongRunningProcess() {
  await new Promise((r) => setTimeout(r, 5000));
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
})();
```
:::

## `perf_hooks.performance` {#perf_hooksperformance}

**Hinzugefügt in: v8.5.0**

Ein Objekt, das verwendet werden kann, um Performance-Metriken von der aktuellen Node.js-Instanz zu erfassen. Es ähnelt [`window.performance`](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance) in Browsern.


### `performance.clearMarks([name])` {#performanceclearmarksname}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Diese Methode muss mit dem `performance`-Objekt als Empfänger aufgerufen werden. |
| v8.5.0 | Hinzugefügt in: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Wenn `name` nicht angegeben ist, werden alle `PerformanceMark`-Objekte aus der Performance-Timeline entfernt. Wenn `name` angegeben ist, wird nur die benannte Markierung entfernt.

### `performance.clearMeasures([name])` {#performanceclearmeasuresname}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Diese Methode muss mit dem `performance`-Objekt als Empfänger aufgerufen werden. |
| v16.7.0 | Hinzugefügt in: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Wenn `name` nicht angegeben ist, werden alle `PerformanceMeasure`-Objekte aus der Performance-Timeline entfernt. Wenn `name` angegeben ist, wird nur die benannte Messung entfernt.

### `performance.clearResourceTimings([name])` {#performanceclearresourcetimingsname}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Diese Methode muss mit dem `performance`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Wenn `name` nicht angegeben ist, werden alle `PerformanceResourceTiming`-Objekte aus der Ressourcen-Timeline entfernt. Wenn `name` angegeben ist, wird nur die benannte Ressource entfernt.

### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**Hinzugefügt in: v14.10.0, v12.19.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das Ergebnis eines vorherigen Aufrufs von `eventLoopUtilization()`.
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das Ergebnis eines vorherigen Aufrufs von `eventLoopUtilization()` vor `utilization1`.
- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Methode `eventLoopUtilization()` gibt ein Objekt zurück, das die kumulative Zeitdauer enthält, in der sich die Ereignisschleife sowohl im Leerlauf als auch aktiv befand, als hochauflösender Millisekunden-Timer. Der Wert `utilization` ist die berechnete Event Loop Utilization (ELU).

Wenn das Bootstrapping im Haupt-Thread noch nicht abgeschlossen ist, haben die Eigenschaften den Wert `0`. Die ELU ist auf [Worker-Threads](/de/nodejs/api/worker_threads#worker-threads) sofort verfügbar, da das Bootstrapping innerhalb der Ereignisschleife stattfindet.

Sowohl `utilization1` als auch `utilization2` sind optionale Parameter.

Wenn `utilization1` übergeben wird, wird die Delta zwischen den `active`- und `idle`-Zeiten des aktuellen Aufrufs sowie der entsprechende `utilization`-Wert berechnet und zurückgegeben (ähnlich wie [`process.hrtime()`](/de/nodejs/api/process#processhrtimetime)).

Wenn sowohl `utilization1` als auch `utilization2` übergeben werden, wird die Delta zwischen den beiden Argumenten berechnet. Dies ist eine Komfortoption, da die Berechnung der ELU im Gegensatz zu [`process.hrtime()`](/de/nodejs/api/process#processhrtimetime) komplexer ist als eine einfache Subtraktion.

ELU ähnelt der CPU-Auslastung, misst jedoch nur die Statistik der Ereignisschleife und nicht die CPU-Auslastung. Sie stellt den Prozentsatz der Zeit dar, die die Ereignisschleife außerhalb des Ereignisanbieters der Ereignisschleife (z. B. `epoll_wait`) verbracht hat. Andere CPU-Leerlaufzeiten werden nicht berücksichtigt. Das folgende Beispiel zeigt, wie ein größtenteils inaktiver Prozess eine hohe ELU aufweist.

::: code-group
```js [ESM]
import { eventLoopUtilization } from 'node:perf_hooks';
import { spawnSync } from 'node:child_process';

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```

```js [CJS]
'use strict';
const { eventLoopUtilization } = require('node:perf_hooks').performance;
const { spawnSync } = require('node:child_process');

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```
:::

Obwohl die CPU während der Ausführung dieses Skripts größtenteils im Leerlauf ist, ist der Wert von `utilization` `1`. Dies liegt daran, dass der Aufruf von [`child_process.spawnSync()`](/de/nodejs/api/child_process#child_processspawnsynccommand-args-options) die Ereignisschleife am Fortfahren hindert.

Das Übergeben eines benutzerdefinierten Objekts anstelle des Ergebnisses eines vorherigen Aufrufs von `eventLoopUtilization()` führt zu undefiniertem Verhalten. Die Rückgabewerte garantieren nicht, dass sie einen korrekten Zustand der Ereignisschleife widerspiegeln.


### `performance.getEntries()` {#performancegetentries}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Diese Methode muss mit dem `performance`-Objekt als Empfänger aufgerufen werden. |
| v16.7.0 | Hinzugefügt in: v16.7.0 |
:::

- Gibt zurück: [\<PerformanceEntry[]\>](/de/nodejs/api/perf_hooks#class-performanceentry)

Gibt eine Liste von `PerformanceEntry`-Objekten in chronologischer Reihenfolge in Bezug auf `performanceEntry.startTime` zurück. Wenn Sie nur an Performance-Einträgen bestimmter Typen oder mit bestimmten Namen interessiert sind, lesen Sie `performance.getEntriesByType()` und `performance.getEntriesByName()`.

### `performance.getEntriesByName(name[, type])` {#performancegetentriesbynamename-type}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Diese Methode muss mit dem `performance`-Objekt als Empfänger aufgerufen werden. |
| v16.7.0 | Hinzugefügt in: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<PerformanceEntry[]\>](/de/nodejs/api/perf_hooks#class-performanceentry)

Gibt eine Liste von `PerformanceEntry`-Objekten in chronologischer Reihenfolge in Bezug auf `performanceEntry.startTime` zurück, deren `performanceEntry.name` gleich `name` ist, und optional, deren `performanceEntry.entryType` gleich `type` ist.

### `performance.getEntriesByType(type)` {#performancegetentriesbytypetype}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Diese Methode muss mit dem `performance`-Objekt als Empfänger aufgerufen werden. |
| v16.7.0 | Hinzugefügt in: v16.7.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<PerformanceEntry[]\>](/de/nodejs/api/perf_hooks#class-performanceentry)

Gibt eine Liste von `PerformanceEntry`-Objekten in chronologischer Reihenfolge in Bezug auf `performanceEntry.startTime` zurück, deren `performanceEntry.entryType` gleich `type` ist.

### `performance.mark(name[, options])` {#performancemarkname-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Diese Methode muss mit dem `performance`-Objekt als Empfänger aufgerufen werden. Das Argument name ist nicht mehr optional. |
| v16.0.0 | Aktualisiert, um der User Timing Level 3 Spezifikation zu entsprechen. |
| v8.5.0 | Hinzugefügt in: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Zusätzliche optionale Details, die in die Markierung aufgenommen werden sollen.
    - `startTime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein optionaler Zeitstempel, der als Markierungszeit verwendet werden soll. **Standard**: `performance.now()`.

Erstellt einen neuen `PerformanceMark`-Eintrag in der Performance-Timeline. Ein `PerformanceMark` ist eine Unterklasse von `PerformanceEntry`, deren `performanceEntry.entryType` immer `'mark'` ist und deren `performanceEntry.duration` immer `0` ist. Performance-Markierungen werden verwendet, um bestimmte wichtige Momente in der Performance-Timeline zu markieren.

Der erstellte `PerformanceMark`-Eintrag wird in die globale Performance-Timeline eingefügt und kann mit `performance.getEntries`, `performance.getEntriesByName` und `performance.getEntriesByType` abgefragt werden. Wenn die Beobachtung durchgeführt wird, sollten die Einträge manuell mit `performance.clearMarks` aus der globalen Performance-Timeline gelöscht werden.


### `performance.markResourceTiming(timingInfo, requestedUrl, initiatorType, global, cacheMode, bodyInfo, responseStatus[, deliveryType])` {#performancemarkresourcetimingtiminginfo-requestedurl-initiatortype-global-cachemode-bodyinfo-responsestatus-deliverytype}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.2.0 | Argumente bodyInfo, responseStatus und deliveryType hinzugefügt. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- `timingInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Fetch Timing Info](https://fetch.spec.whatwg.org/#fetch-timing-info)
- `requestedUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Ressourcen-URL
- `initiatorType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Initiatorname, z. B.: 'fetch'
- `global` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `cacheMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Cache-Modus muss eine leere Zeichenkette ('') oder 'local' sein
- `bodyInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Fetch Response Body Info](https://fetch.spec.whatwg.org/#response-body-info)
- `responseStatus` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Statuscode der Antwort
- `deliveryType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Liefertyp. **Standard:** `''`.

*Diese Eigenschaft ist eine Erweiterung von Node.js. Sie ist in Webbrowsern nicht verfügbar.*

Erstellt einen neuen `PerformanceResourceTiming`-Eintrag in der Ressourcen-Zeitleiste. Ein `PerformanceResourceTiming` ist eine Unterklasse von `PerformanceEntry`, deren `performanceEntry.entryType` immer `'resource'` ist. Performance-Ressourcen werden verwendet, um Momente in der Ressourcen-Zeitleiste zu markieren.

Der erstellte `PerformanceMark`-Eintrag wird in die globale Ressourcen-Zeitleiste eingefügt und kann mit `performance.getEntries`, `performance.getEntriesByName` und `performance.getEntriesByType` abgefragt werden. Wenn die Beobachtung durchgeführt wird, sollten die Einträge manuell mit `performance.clearResourceTimings` aus der globalen Performance-Zeitleiste gelöscht werden.


### `performance.measure(name[, startMarkOrOptions[, endMark]])` {#performancemeasurename-startmarkoroptions-endmark}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Diese Methode muss mit dem `performance`-Objekt als Empfänger aufgerufen werden. |
| v16.0.0 | Aktualisiert, um der User Timing Level 3 Spezifikation zu entsprechen. |
| v13.13.0, v12.16.3 | Parameter `startMark` und `endMark` optional gemacht. |
| v8.5.0 | Hinzugefügt in: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `startMarkOrOptions` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional.
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Zusätzliche optionale Details, die in die Messung aufgenommen werden sollen.
    - `duration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dauer zwischen Start- und Endzeit.
    - `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Zeitstempel, der als Endzeit verwendet werden soll, oder eine Zeichenfolge, die eine zuvor aufgezeichnete Markierung identifiziert.
    - `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Zeitstempel, der als Startzeit verwendet werden soll, oder eine Zeichenfolge, die eine zuvor aufgezeichnete Markierung identifiziert.
  
 
- `endMark` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Optional. Muss weggelassen werden, wenn `startMarkOrOptions` ein [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) ist.

Erstellt einen neuen `PerformanceMeasure`-Eintrag in der Performance-Zeitleiste. Ein `PerformanceMeasure` ist eine Unterklasse von `PerformanceEntry`, deren `performanceEntry.entryType` immer `'measure'` ist und deren `performanceEntry.duration` die Anzahl der Millisekunden misst, die seit `startMark` und `endMark` vergangen sind.

Das Argument `startMark` kann jeden *vorhandenen* `PerformanceMark` in der Performance-Zeitleiste identifizieren oder *kann* eine der Zeitstempeleigenschaften identifizieren, die von der Klasse `PerformanceNodeTiming` bereitgestellt werden. Wenn das benannte `startMark` nicht vorhanden ist, wird ein Fehler ausgelöst.

Das optionale Argument `endMark` muss jeden *vorhandenen* `PerformanceMark` in der Performance-Zeitleiste oder eine der Zeitstempeleigenschaften identifizieren, die von der Klasse `PerformanceNodeTiming` bereitgestellt werden. `endMark` ist `performance.now()`, wenn kein Parameter übergeben wird, andernfalls wird ein Fehler ausgelöst, wenn das benannte `endMark` nicht vorhanden ist.

Der erstellte `PerformanceMeasure`-Eintrag wird in die globale Performance-Zeitleiste eingefügt und kann mit `performance.getEntries`, `performance.getEntriesByName` und `performance.getEntriesByType` abgefragt werden. Wenn die Beobachtung durchgeführt wird, sollten die Einträge manuell mit `performance.clearMeasures` aus der globalen Performance-Zeitleiste gelöscht werden.


### `performance.nodeTiming` {#performancenodetiming}

**Hinzugefügt in: v8.5.0**

- [\<PerformanceNodeTiming\>](/de/nodejs/api/perf_hooks#class-performancenodetiming)

*Diese Eigenschaft ist eine Erweiterung von Node.js. Sie ist nicht in Webbrowsern verfügbar.*

Eine Instanz der Klasse `PerformanceNodeTiming`, die Leistungskennzahlen für bestimmte operative Meilensteine von Node.js bereitstellt.

### `performance.now()` {#performancenow}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Diese Methode muss mit dem Objekt `performance` als Empfänger aufgerufen werden. |
| v8.5.0 | Hinzugefügt in: v8.5.0 |
:::

- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt den aktuellen hochauflösenden Millisekunden-Zeitstempel zurück, wobei 0 den Start des aktuellen `node`-Prozesses darstellt.

### `performance.setResourceTimingBufferSize(maxSize)` {#performancesetresourcetimingbuffersizemaxsize}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Diese Methode muss mit dem Objekt `performance` als Empfänger aufgerufen werden. |
| v18.8.0 | Hinzugefügt in: v18.8.0 |
:::

Legt die globale Puffergröße für die Leistungsressourcenzeitmessung auf die angegebene Anzahl von Leistungseintragsobjekten vom Typ "resource" fest.

Standardmäßig ist die maximale Puffergröße auf 250 eingestellt.

### `performance.timeOrigin` {#performancetimeorigin}

**Hinzugefügt in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der [`timeOrigin`](https://w3c.github.io/hr-time/#dom-performance-timeorigin) gibt den hochauflösenden Millisekunden-Zeitstempel an, zu dem der aktuelle `node`-Prozess begann, gemessen in Unix-Zeit.

### `performance.timerify(fn[, options])` {#performancetimerifyfn-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Die Histogramm-Option wurde hinzugefügt. |
| v16.0.0 | Neu implementiert, um reines JavaScript und die Möglichkeit zur Zeitmessung asynchroner Funktionen zu verwenden. |
| v8.5.0 | Hinzugefügt in: v8.5.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `histogram` [\<RecordableHistogram\>](/de/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram) Ein Histogrammobjekt, das mit `perf_hooks.createHistogram()` erstellt wurde und Laufzeitdauern in Nanosekunden aufzeichnet.
  
 

*Diese Eigenschaft ist eine Erweiterung von Node.js. Sie ist nicht in Webbrowsern verfügbar.*

Umschließt eine Funktion mit einer neuen Funktion, die die Laufzeit der umschlossenen Funktion misst. Ein `PerformanceObserver` muss für den Ereignistyp `'function'` abonniert sein, damit auf die Timing-Details zugegriffen werden kann.



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
wrapped();
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
wrapped();
```
:::

Wenn die umschlossene Funktion ein Promise zurückgibt, wird ein finally-Handler an das Promise angehängt, und die Dauer wird gemeldet, sobald der finally-Handler aufgerufen wird.


### `performance.toJSON()` {#performancetojson}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Diese Methode muss mit dem `performance`-Objekt als Empfänger aufgerufen werden. |
| v16.1.0 | Hinzugefügt in: v16.1.0 |
:::

Ein Objekt, das die JSON-Repräsentation des `performance`-Objekts ist. Es ähnelt [`window.performance.toJSON`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/toJSON) in Browsern.

#### Ereignis: `'resourcetimingbufferfull'` {#event-resourcetimingbufferfull}

**Hinzugefügt in: v18.8.0**

Das Ereignis `'resourcetimingbufferfull'` wird ausgelöst, wenn der globale Performance-Resource-Timing-Puffer voll ist. Passen Sie die Größe des Resource-Timing-Puffers mit `performance.setResourceTimingBufferSize()` an oder leeren Sie den Puffer mit `performance.clearResourceTimings()` im Event Listener, um weitere Einträge zum Performance-Timeline-Puffer hinzuzufügen.

## Klasse: `PerformanceEntry` {#class-performanceentry}

**Hinzugefügt in: v8.5.0**

Der Konstruktor dieser Klasse ist für Benutzer nicht direkt zugänglich.

### `performanceEntry.duration` {#performanceentryduration}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Dieser Property Getter muss mit dem `PerformanceEntry`-Objekt als Empfänger aufgerufen werden. |
| v8.5.0 | Hinzugefügt in: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Gesamtanzahl der Millisekunden, die für diesen Eintrag verstrichen sind. Dieser Wert ist nicht für alle Performance Entry-Typen sinnvoll.

### `performanceEntry.entryType` {#performanceentryentrytype}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Dieser Property Getter muss mit dem `PerformanceEntry`-Objekt als Empfänger aufgerufen werden. |
| v8.5.0 | Hinzugefügt in: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der Typ des Performance-Eintrags. Er kann einer der folgenden sein:

- `'dns'` (nur Node.js)
- `'function'` (nur Node.js)
- `'gc'` (nur Node.js)
- `'http2'` (nur Node.js)
- `'http'` (nur Node.js)
- `'mark'` (im Web verfügbar)
- `'measure'` (im Web verfügbar)
- `'net'` (nur Node.js)
- `'node'` (nur Node.js)
- `'resource'` (im Web verfügbar)


### `performanceEntry.name` {#performanceentryname}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Der Getter dieser Eigenschaft muss mit dem `PerformanceEntry`-Objekt als Empfänger aufgerufen werden. |
| v8.5.0 | Hinzugefügt in: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String-type)

Der Name des Performance-Eintrags.

### `performanceEntry.startTime` {#performanceentrystarttime}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Der Getter dieser Eigenschaft muss mit dem `PerformanceEntry`-Objekt als Empfänger aufgerufen werden. |
| v8.5.0 | Hinzugefügt in: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number-type)

Der hochauflösende Millisekunden-Zeitstempel, der die Startzeit des Performance-Eintrags markiert.

## Klasse: `PerformanceMark` {#class-performancemark}

**Hinzugefügt in: v18.2.0, v16.17.0**

- Erweitert: [\<PerformanceEntry\>](/de/nodejs/api/perf_hooks#class-performanceentry)

Stellt über die Methode `Performance.mark()` erstellte Markierungen bereit.

### `performanceMark.detail` {#performancemarkdetail}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Der Getter dieser Eigenschaft muss mit dem `PerformanceMark`-Objekt als Empfänger aufgerufen werden. |
| v16.0.0 | Hinzugefügt in: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data-types)

Zusätzliche Details, die bei der Erstellung mit der Methode `Performance.mark()` angegeben wurden.

## Klasse: `PerformanceMeasure` {#class-performancemeasure}

**Hinzugefügt in: v18.2.0, v16.17.0**

- Erweitert: [\<PerformanceEntry\>](/de/nodejs/api/perf_hooks#class-performanceentry)

Stellt über die Methode `Performance.measure()` erstellte Messungen bereit.

Der Konstruktor dieser Klasse wird Benutzern nicht direkt zur Verfügung gestellt.

### `performanceMeasure.detail` {#performancemeasuredetail}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Der Getter dieser Eigenschaft muss mit dem `PerformanceMeasure`-Objekt als Empfänger aufgerufen werden. |
| v16.0.0 | Hinzugefügt in: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data-types)

Zusätzliche Details, die bei der Erstellung mit der Methode `Performance.measure()` angegeben wurden.


## Klasse: `PerformanceNodeEntry` {#class-performancenodeentry}

**Hinzugefügt in: v19.0.0**

- Erweitert: [\<PerformanceEntry\>](/de/nodejs/api/perf_hooks#class-performanceentry)

*Diese Klasse ist eine Erweiterung von Node.js. Sie ist in Webbrowsern nicht verfügbar.*

Bietet detaillierte Node.js-Timing-Daten.

Der Konstruktor dieser Klasse ist für Benutzer nicht direkt zugänglich.

### `performanceNodeEntry.detail` {#performancenodeentrydetail}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Dieser Property-Getter muss mit dem `PerformanceNodeEntry`-Objekt als Empfänger aufgerufen werden. |
| v16.0.0 | Hinzugefügt in: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Zusätzliche Details, die spezifisch für den `entryType` sind.

### `performanceNodeEntry.flags` {#performancenodeentryflags}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Laufzeit veraltet. Jetzt in die Detail-Property verschoben, wenn entryType 'gc' ist. |
| v13.9.0, v12.17.0 | Hinzugefügt in: v13.9.0, v12.17.0 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen `performanceNodeEntry.detail`.
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Wenn `performanceEntry.entryType` gleich `'gc'` ist, enthält die `performance.flags`-Property zusätzliche Informationen über den Garbage-Collection-Vorgang. Der Wert kann einer der folgenden sein:

- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`

### `performanceNodeEntry.kind` {#performancenodeentrykind}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Laufzeit veraltet. Jetzt in die Detail-Property verschoben, wenn entryType 'gc' ist. |
| v8.5.0 | Hinzugefügt in: v8.5.0 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen `performanceNodeEntry.detail`.
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Wenn `performanceEntry.entryType` gleich `'gc'` ist, identifiziert die `performance.kind`-Property den Typ des aufgetretenen Garbage-Collection-Vorgangs. Der Wert kann einer der folgenden sein:

- `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`


### Details zur Speicherbereinigung ('gc') {#garbage-collection-gc-details}

Wenn `performanceEntry.type` gleich `'gc'` ist, ist die `performanceNodeEntry.detail`-Eigenschaft ein [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) mit zwei Eigenschaften:

- `kind` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Einer von:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`
  
 
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Einer von:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`
  
 

### Details zu HTTP ('http') {#http-http-details}

Wenn `performanceEntry.type` gleich `'http'` ist, ist die `performanceNodeEntry.detail`-Eigenschaft ein [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), das zusätzliche Informationen enthält.

Wenn `performanceEntry.name` gleich `HttpClient` ist, enthält `detail` die folgenden Eigenschaften: `req`, `res`. Und die `req`-Eigenschaft ist ein [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), das `method`, `url`, `headers` enthält, die `res`-Eigenschaft ist ein [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), das `statusCode`, `statusMessage`, `headers` enthält.

Wenn `performanceEntry.name` gleich `HttpRequest` ist, enthält `detail` die folgenden Eigenschaften: `req`, `res`. Und die `req`-Eigenschaft ist ein [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), das `method`, `url`, `headers` enthält, die `res`-Eigenschaft ist ein [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), das `statusCode`, `statusMessage`, `headers` enthält.

Dies kann zusätzlichen Speicherbedarf verursachen und sollte standardmäßig nur für Diagnosezwecke verwendet und nicht in der Produktion aktiviert gelassen werden.


### HTTP/2 ('http2') Details {#http/2-http2-details}

Wenn `performanceEntry.type` gleich `'http2'` ist, ist die Eigenschaft `performanceNodeEntry.detail` ein [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), das zusätzliche Leistungsinformationen enthält.

Wenn `performanceEntry.name` gleich `Http2Stream` ist, enthält `detail` die folgenden Eigenschaften:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der für diesen `Http2Stream` empfangenen `DATA`-Frame-Bytes.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der für diesen `Http2Stream` gesendeten `DATA`-Frame-Bytes.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Bezeichner des zugehörigen `Http2Stream`
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die zwischen der `startTime` von `PerformanceEntry` und dem Empfang des ersten `DATA`-Frames vergangen sind.
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die zwischen der `startTime` von `PerformanceEntry` und dem Senden des ersten `DATA`-Frames vergangen sind.
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die zwischen der `startTime` von `PerformanceEntry` und dem Empfang des ersten Headers vergangen sind.

Wenn `performanceEntry.name` gleich `Http2Session` ist, enthält `detail` die folgenden Eigenschaften:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der für diese `Http2Session` empfangenen Bytes.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der für diese `Http2Session` gesendeten Bytes.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der von der `Http2Session` empfangenen HTTP/2-Frames.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der von der `Http2Session` gesendeten HTTP/2-Frames.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale Anzahl von Streams, die während der Lebensdauer der `Http2Session` gleichzeitig geöffnet sind.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die seit der Übertragung eines `PING`-Frames und dem Empfang seiner Bestätigung vergangen sind. Nur vorhanden, wenn ein `PING`-Frame über die `Http2Session` gesendet wurde.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die durchschnittliche Dauer (in Millisekunden) für alle `Http2Stream`-Instanzen.
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der von der `Http2Session` verarbeiteten `Http2Stream`-Instanzen.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Entweder `'server'` oder `'client'`, um den Typ der `Http2Session` zu identifizieren.


### Timerify ('function') Details {#timerify-function-details}

Wenn `performanceEntry.type` gleich `'function'` ist, ist die `performanceNodeEntry.detail`-Eigenschaft ein [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), das die Eingabeargumente der zeitgesteuerten Funktion auflistet.

### Net ('net') Details {#net-net-details}

Wenn `performanceEntry.type` gleich `'net'` ist, ist die `performanceNodeEntry.detail`-Eigenschaft ein [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), das zusätzliche Informationen enthält.

Wenn `performanceEntry.name` gleich `connect` ist, enthält `detail` die folgenden Eigenschaften: `host`, `port`.

### DNS ('dns') Details {#dns-dns-details}

Wenn `performanceEntry.type` gleich `'dns'` ist, ist die `performanceNodeEntry.detail`-Eigenschaft ein [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), das zusätzliche Informationen enthält.

Wenn `performanceEntry.name` gleich `lookup` ist, enthält `detail` die folgenden Eigenschaften: `hostname`, `family`, `hints`, `verbatim`, `addresses`.

Wenn `performanceEntry.name` gleich `lookupService` ist, enthält `detail` die folgenden Eigenschaften: `host`, `port`, `hostname`, `service`.

Wenn `performanceEntry.name` gleich `queryxxx` oder `getHostByAddr` ist, enthält `detail` die folgenden Eigenschaften: `host`, `ttl`, `result`. Der Wert von `result` ist derselbe wie das Ergebnis von `queryxxx` oder `getHostByAddr`.

## Klasse: `PerformanceNodeTiming` {#class-performancenodetiming}

**Hinzugefügt in: v8.5.0**

- Erweitert: [\<PerformanceEntry\>](/de/nodejs/api/perf_hooks#class-performanceentry)

*Diese Eigenschaft ist eine Erweiterung von Node.js. Sie ist in Webbrowsern nicht verfügbar.*

Bietet Timing-Details für Node.js selbst. Der Konstruktor dieser Klasse ist für Benutzer nicht zugänglich.

### `performanceNodeTiming.bootstrapComplete` {#performancenodetimingbootstrapcomplete}

**Hinzugefügt in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel, zu dem der Node.js-Prozess das Bootstrapping abgeschlossen hat. Wenn das Bootstrapping noch nicht abgeschlossen ist, hat die Eigenschaft den Wert -1.


### `performanceNodeTiming.environment` {#performancenodetimingenvironment}

**Hinzugefügt in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel, zu dem die Node.js-Umgebung initialisiert wurde.

### `performanceNodeTiming.idleTime` {#performancenodetimingidletime}

**Hinzugefügt in: v14.10.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel der Zeitdauer, in der sich die Ereignisschleife innerhalb des Ereignisanbieters der Ereignisschleife im Leerlauf befand (z. B. `epoll_wait`). Die CPU-Auslastung wird dabei nicht berücksichtigt. Wenn die Ereignisschleife noch nicht gestartet wurde (z. B. im ersten Tick des Hauptskripts), hat die Eigenschaft den Wert 0.

### `performanceNodeTiming.loopExit` {#performancenodetimingloopexit}

**Hinzugefügt in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel, zu dem die Node.js-Ereignisschleife beendet wurde. Wenn die Ereignisschleife noch nicht beendet wurde, hat die Eigenschaft den Wert -1. Sie kann nur in einem Handler des [`'exit'`](/de/nodejs/api/process#event-exit)-Ereignisses einen Wert ungleich -1 haben.

### `performanceNodeTiming.loopStart` {#performancenodetimingloopstart}

**Hinzugefügt in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel, zu dem die Node.js-Ereignisschleife gestartet wurde. Wenn die Ereignisschleife noch nicht gestartet wurde (z. B. im ersten Tick des Hauptskripts), hat die Eigenschaft den Wert -1.

### `performanceNodeTiming.nodeStart` {#performancenodetimingnodestart}

**Hinzugefügt in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel, zu dem der Node.js-Prozess initialisiert wurde.

### `performanceNodeTiming.uvMetricsInfo` {#performancenodetiminguvmetricsinfo}

**Hinzugefügt in: v22.8.0, v20.18.0**

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `loopCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Ereignisschleifeniterationen.
    - `events` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Ereignisse, die vom Ereignis-Handler verarbeitet wurden.
    - `eventsWaiting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Ereignisse, die darauf warteten, verarbeitet zu werden, als der Ereignisanbieter aufgerufen wurde.

Dies ist ein Wrapper für die Funktion `uv_metrics_info`. Sie gibt den aktuellen Satz von Ereignisschleifenmetriken zurück.

Es wird empfohlen, diese Eigenschaft innerhalb einer Funktion zu verwenden, deren Ausführung mit `setImmediate` geplant wurde, um zu vermeiden, dass Metriken erfasst werden, bevor alle während der aktuellen Schleifeniteration geplanten Operationen abgeschlossen sind.

::: code-group
```js [CJS]
const { performance } = require('node:perf_hooks');

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```

```js [ESM]
import { performance } from 'node:perf_hooks';

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```
:::


### `performanceNodeTiming.v8Start` {#performancenodetimingv8start}

**Hinzugefügt in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel, zu dem die V8-Plattform initialisiert wurde.

## Klasse: `PerformanceResourceTiming` {#class-performanceresourcetiming}

**Hinzugefügt in: v18.2.0, v16.17.0**

- Erweitert: [\<PerformanceEntry\>](/de/nodejs/api/perf_hooks#class-performanceentry)

Bietet detaillierte Netzwerk-Timing-Daten bezüglich des Ladens der Ressourcen einer Anwendung.

Der Konstruktor dieser Klasse ist Benutzern nicht direkt zugänglich.

### `performanceResourceTiming.workerStart` {#performanceresourcetimingworkerstart}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Dieser Property-Getter muss mit dem `PerformanceResourceTiming`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel unmittelbar vor dem Senden der `fetch`-Anfrage. Wenn die Ressource nicht von einem Worker abgefangen wird, gibt die Eigenschaft immer 0 zurück.

### `performanceResourceTiming.redirectStart` {#performanceresourcetimingredirectstart}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Dieser Property-Getter muss mit dem `PerformanceResourceTiming`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel, der die Startzeit des Fetch repräsentiert, das die Weiterleitung initiiert.

### `performanceResourceTiming.redirectEnd` {#performanceresourcetimingredirectend}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Dieser Property-Getter muss mit dem `PerformanceResourceTiming`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel, der unmittelbar nach dem Empfang des letzten Bytes der Antwort der letzten Weiterleitung erstellt wird.


### `performanceResourceTiming.fetchStart` {#performanceresourcetimingfetchstart}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Dieser Property-Getter muss mit dem `PerformanceResourceTiming`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel unmittelbar bevor Node.js beginnt, die Ressource abzurufen.

### `performanceResourceTiming.domainLookupStart` {#performanceresourcetimingdomainlookupstart}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Dieser Property-Getter muss mit dem `PerformanceResourceTiming`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel unmittelbar bevor Node.js mit der Domainnamensuche für die Ressource beginnt.

### `performanceResourceTiming.domainLookupEnd` {#performanceresourcetimingdomainlookupend}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Dieser Property-Getter muss mit dem `PerformanceResourceTiming`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel, der den Zeitpunkt unmittelbar nach dem Abschluss der Domainnamensuche für die Ressource durch Node.js darstellt.

### `performanceResourceTiming.connectStart` {#performanceresourcetimingconnectstart}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Dieser Property-Getter muss mit dem `PerformanceResourceTiming`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel, der den Zeitpunkt unmittelbar vor dem Beginn der Verbindungsherstellung von Node.js zum Server darstellt, um die Ressource abzurufen.


### `performanceResourceTiming.connectEnd` {#performanceresourcetimingconnectend}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Dieser Property Getter muss mit dem `PerformanceResourceTiming`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel, der den Zeitpunkt unmittelbar nach dem Abschluss der Verbindungsherstellung von Node.js zum Server zum Abrufen der Ressource darstellt.

### `performanceResourceTiming.secureConnectionStart` {#performanceresourcetimingsecureconnectionstart}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Dieser Property Getter muss mit dem `PerformanceResourceTiming`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel, der den Zeitpunkt unmittelbar vor dem Beginn des Handshake-Prozesses durch Node.js zur Sicherung der aktuellen Verbindung darstellt.

### `performanceResourceTiming.requestStart` {#performanceresourcetimingrequeststart}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Dieser Property Getter muss mit dem `PerformanceResourceTiming`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel, der den Zeitpunkt unmittelbar vor dem Empfang des ersten Byte der Antwort vom Server durch Node.js darstellt.

### `performanceResourceTiming.responseEnd` {#performanceresourcetimingresponseend}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Dieser Property Getter muss mit dem `PerformanceResourceTiming`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der hochauflösende Millisekunden-Zeitstempel, der den Zeitpunkt unmittelbar nach dem Empfang des letzten Byte der Ressource durch Node.js oder unmittelbar vor dem Schließen der Transportverbindung darstellt, je nachdem, was zuerst eintritt.


### `performanceResourceTiming.transferSize` {#performanceresourcetimingtransfersize}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Der Getter dieser Eigenschaft muss mit dem `PerformanceResourceTiming`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Eine Zahl, die die Größe (in Oktetten) der abgerufenen Ressource darstellt. Die Größe umfasst die Antwort-Header-Felder plus den Antwort-Payload-Body.

### `performanceResourceTiming.encodedBodySize` {#performanceresourcetimingencodedbodysize}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Der Getter dieser Eigenschaft muss mit dem `PerformanceResourceTiming`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Eine Zahl, die die Größe (in Oktetten) des vom Fetch (HTTP oder Cache) empfangenen Payload-Bodys darstellt, bevor jegliche angewendete Content-Codierungen entfernt werden.

### `performanceResourceTiming.decodedBodySize` {#performanceresourcetimingdecodedbodysize}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Der Getter dieser Eigenschaft muss mit dem `PerformanceResourceTiming`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Eine Zahl, die die Größe (in Oktetten) des vom Fetch (HTTP oder Cache) empfangenen Nachrichtenkörpers darstellt, nachdem jegliche angewendete Content-Codierungen entfernt wurden.

### `performanceResourceTiming.toJSON()` {#performanceresourcetimingtojson}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Diese Methode muss mit dem `PerformanceResourceTiming`-Objekt als Empfänger aufgerufen werden. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

Gibt ein `object` zurück, das die JSON-Darstellung des `PerformanceResourceTiming`-Objekts ist.

## Klasse: `PerformanceObserver` {#class-performanceobserver}

**Hinzugefügt in: v8.5.0**

### `PerformanceObserver.supportedEntryTypes` {#performanceobserversupportedentrytypes}

**Hinzugefügt in: v16.0.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Unterstützte Typen abrufen.


### `new PerformanceObserver(callback)` {#new-performanceobservercallback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft nun `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v8.5.0 | Hinzugefügt in: v8.5.0 |
:::

- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `list` [\<PerformanceObserverEntryList\>](/de/nodejs/api/perf_hooks#class-performanceobserverentrylist)
    - `observer` [\<PerformanceObserver\>](/de/nodejs/api/perf_hooks#class-performanceobserver)
  
 

`PerformanceObserver`-Objekte bieten Benachrichtigungen, wenn neue `PerformanceEntry`-Instanzen zur Performance Timeline hinzugefügt wurden.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```
:::

Da `PerformanceObserver`-Instanzen ihren eigenen zusätzlichen Performance-Overhead verursachen, sollten Instanzen nicht dauerhaft für Benachrichtigungen abonniert bleiben. Benutzer sollten Observer trennen, sobald sie nicht mehr benötigt werden.

Der `callback` wird aufgerufen, wenn ein `PerformanceObserver` über neue `PerformanceEntry`-Instanzen benachrichtigt wird. Der Callback empfängt eine `PerformanceObserverEntryList`-Instanz und eine Referenz auf den `PerformanceObserver`.

### `performanceObserver.disconnect()` {#performanceobserverdisconnect}

**Hinzugefügt in: v8.5.0**

Trennt die `PerformanceObserver`-Instanz von allen Benachrichtigungen.


### `performanceObserver.observe(options)` {#performanceobserverobserveoptions}

::: info [History]
| Version | Changes |
| --- | --- |
| v16.7.0 | Aktualisiert, um Performance Timeline Level 2 zu entsprechen. Die Option buffered wurde wieder hinzugefügt. |
| v16.0.0 | Aktualisiert, um User Timing Level 3 zu entsprechen. Die Option buffered wurde entfernt. |
| v8.5.0 | Hinzugefügt in: v8.5.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein einzelner [\<PerformanceEntry\>](/de/nodejs/api/perf_hooks#class-performanceentry)-Typ. Darf nicht angegeben werden, wenn `entryTypes` bereits angegeben ist.
    - `entryTypes` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein Array von Strings, die die Typen von [\<PerformanceEntry\>](/de/nodejs/api/perf_hooks#class-performanceentry)-Instanzen identifizieren, an denen der Observer interessiert ist. Wenn nicht angegeben, wird ein Fehler ausgelöst.
    - `buffered` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn true, wird der Observer-Callback mit einer Liste globaler `PerformanceEntry`-Einträge aufgerufen, die zwischengespeichert sind. Wenn false, werden nur `PerformanceEntry`s, die nach dem Zeitpunkt erstellt wurden, an den Observer-Callback gesendet. **Standard:** `false`.

Abonniert die [\<PerformanceObserver\>](/de/nodejs/api/perf_hooks#class-performanceobserver)-Instanz für Benachrichtigungen über neue [\<PerformanceEntry\>](/de/nodejs/api/perf_hooks#class-performanceentry)-Instanzen, die entweder durch `options.entryTypes` oder `options.type` identifiziert werden:

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  // Wird einmal asynchron aufgerufen. `list` enthält drei Elemente.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  // Wird einmal asynchron aufgerufen. `list` enthält drei Elemente.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```
:::


### `performanceObserver.takeRecords()` {#performanceobservertakerecords}

**Hinzugefügt in: v16.0.0**

- Gibt zurück: [\<PerformanceEntry[]\>](/de/nodejs/api/perf_hooks#class-performanceentry) Aktuelle Liste der im Performance Observer gespeicherten Einträge, die dabei geleert wird.

## Klasse: `PerformanceObserverEntryList` {#class-performanceobserverentrylist}

**Hinzugefügt in: v8.5.0**

Die Klasse `PerformanceObserverEntryList` wird verwendet, um Zugriff auf die `PerformanceEntry`-Instanzen zu gewähren, die an einen `PerformanceObserver` übergeben werden. Der Konstruktor dieser Klasse wird Benutzern nicht zur Verfügung gestellt.

### `performanceObserverEntryList.getEntries()` {#performanceobserverentrylistgetentries}

**Hinzugefügt in: v8.5.0**

- Gibt zurück: [\<PerformanceEntry[]\>](/de/nodejs/api/perf_hooks#class-performanceentry)

Gibt eine Liste von `PerformanceEntry`-Objekten in chronologischer Reihenfolge in Bezug auf `performanceEntry.startTime` zurück.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByName(name[, type])` {#performanceobserverentrylistgetentriesbynamename-type}

**Hinzugefügt in: v8.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<PerformanceEntry[]\>](/de/nodejs/api/perf_hooks#class-performanceentry)

Gibt eine Liste von `PerformanceEntry`-Objekten in chronologischer Reihenfolge in Bezug auf `performanceEntry.startTime` zurück, deren `performanceEntry.name` gleich `name` ist und optional deren `performanceEntry.entryType` gleich `type` ist.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByType(type)` {#performanceobserverentrylistgetentriesbytypetype}

**Hinzugefügt in: v8.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<PerformanceEntry[]\>](/de/nodejs/api/perf_hooks#class-performanceentry)

Gibt eine Liste von `PerformanceEntry`-Objekten in chronologischer Reihenfolge in Bezug auf `performanceEntry.startTime` zurück, deren `performanceEntry.entryType` gleich `type` ist.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::

## `perf_hooks.createHistogram([options])` {#perf_hookscreatehistogramoptions}

**Hinzugefügt in: v15.9.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `lowest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Der niedrigste unterscheidbare Wert. Muss ein ganzzahliger Wert größer als 0 sein. **Standard:** `1`.
    - `highest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Der höchste aufzeichnungsfähige Wert. Muss ein ganzzahliger Wert sein, der gleich oder größer als das Zweifache von `lowest` ist. **Standard:** `Number.MAX_SAFE_INTEGER`.
    - `figures` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Genauigkeitsstellen. Muss eine Zahl zwischen `1` und `5` sein. **Standard:** `3`.


- Gibt zurück: [\<RecordableHistogram\>](/de/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

Gibt ein [\<RecordableHistogram\>](/de/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram) zurück.


## `perf_hooks.monitorEventLoopDelay([options])` {#perf_hooksmonitoreventloopdelayoptions}

**Hinzugefügt in: v11.10.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `resolution` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Abtastrate in Millisekunden. Muss größer als Null sein. **Standard:** `10`.
  
 
- Gibt zurück: [\<IntervalHistogram\>](/de/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram)

*Diese Eigenschaft ist eine Erweiterung von Node.js. Sie ist in Webbrowsern nicht verfügbar.*

Erstellt ein `IntervalHistogram`-Objekt, das die Event-Loop-Verzögerung im Laufe der Zeit abtastet und meldet. Die Verzögerungen werden in Nanosekunden gemeldet.

Die Verwendung eines Timers zur Erkennung der ungefähren Event-Loop-Verzögerung funktioniert, da die Ausführung von Timern speziell an den Lebenszyklus der libuv-Event-Loop gebunden ist. Das heißt, eine Verzögerung in der Schleife verursacht eine Verzögerung in der Ausführung des Timers, und diese Verzögerungen sollen mit dieser API speziell erkannt werden.

::: code-group
```js [ESM]
import { monitorEventLoopDelay } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Do something.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```

```js [CJS]
const { monitorEventLoopDelay } = require('node:perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Do something.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```
:::

## Klasse: `Histogram` {#class-histogram}

**Hinzugefügt in: v11.10.0**

### `histogram.count` {#histogramcount}

**Hinzugefügt in: v17.4.0, v16.14.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Anzahl der vom Histogramm aufgezeichneten Stichproben.

### `histogram.countBigInt` {#histogramcountbigint}

**Hinzugefügt in: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Die Anzahl der vom Histogramm aufgezeichneten Stichproben.


### `histogram.exceeds` {#histogramexceeds}

**Hinzugefügt in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Anzahl, wie oft die Event-Loop-Verzögerung den maximalen Schwellenwert von 1 Stunde überschritten hat.

### `histogram.exceedsBigInt` {#histogramexceedsbigint}

**Hinzugefügt in: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Die Anzahl, wie oft die Event-Loop-Verzögerung den maximalen Schwellenwert von 1 Stunde überschritten hat.

### `histogram.max` {#histogrammax}

**Hinzugefügt in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die maximal aufgezeichnete Event-Loop-Verzögerung.

### `histogram.maxBigInt` {#histogrammaxbigint}

**Hinzugefügt in: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Die maximal aufgezeichnete Event-Loop-Verzögerung.

### `histogram.mean` {#histogrammean}

**Hinzugefügt in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der Mittelwert der aufgezeichneten Event-Loop-Verzögerungen.

### `histogram.min` {#histogrammin}

**Hinzugefügt in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die minimal aufgezeichnete Event-Loop-Verzögerung.

### `histogram.minBigInt` {#histogramminbigint}

**Hinzugefügt in: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Die minimal aufgezeichnete Event-Loop-Verzögerung.

### `histogram.percentile(percentile)` {#histogrampercentilepercentile}

**Hinzugefügt in: v11.10.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein Perzentilwert im Bereich (0, 100].
- Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt den Wert am angegebenen Perzentil zurück.

### `histogram.percentileBigInt(percentile)` {#histogrampercentilebigintpercentile}

**Hinzugefügt in: v17.4.0, v16.14.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein Perzentilwert im Bereich (0, 100].
- Returns: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Gibt den Wert am angegebenen Perzentil zurück.


### `histogram.percentiles` {#histogrampercentiles}

**Hinzugefügt in: v11.10.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Gibt ein `Map`-Objekt zurück, das die akkumulierte Perzentilverteilung detailliert darstellt.

### `histogram.percentilesBigInt` {#histogrampercentilesbigint}

**Hinzugefügt in: v17.4.0, v16.14.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Gibt ein `Map`-Objekt zurück, das die akkumulierte Perzentilverteilung detailliert darstellt.

### `histogram.reset()` {#histogramreset}

**Hinzugefügt in: v11.10.0**

Setzt die gesammelten Histogrammdaten zurück.

### `histogram.stddev` {#histogramstddev}

**Hinzugefügt in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Standardabweichung der aufgezeichneten Event-Loop-Verzögerungen.

## Klasse: `IntervalHistogram extends Histogram` {#class-intervalhistogram-extends-histogram}

Ein `Histogram`, das periodisch in einem bestimmten Intervall aktualisiert wird.

### `histogram.disable()` {#histogramdisable}

**Hinzugefügt in: v11.10.0**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Deaktiviert den Aktualisierungsintervall-Timer. Gibt `true` zurück, wenn der Timer gestoppt wurde, `false`, wenn er bereits gestoppt war.

### `histogram.enable()` {#histogramenable}

**Hinzugefügt in: v11.10.0**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Aktiviert den Aktualisierungsintervall-Timer. Gibt `true` zurück, wenn der Timer gestartet wurde, `false`, wenn er bereits gestartet war.

### Klonen eines `IntervalHistogram` {#cloning-an-intervalhistogram}

[\<IntervalHistogram\>](/de/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram) Instanzen können über [\<MessagePort\>](/de/nodejs/api/worker_threads#class-messageport) geklont werden. Auf der Empfängerseite wird das Histogramm als einfaches [\<Histogram\>](/de/nodejs/api/perf_hooks#class-histogram) Objekt geklont, das die Methoden `enable()` und `disable()` nicht implementiert.

## Klasse: `RecordableHistogram extends Histogram` {#class-recordablehistogram-extends-histogram}

**Hinzugefügt in: v15.9.0, v14.18.0**

### `histogram.add(other)` {#histogramaddother}

**Hinzugefügt in: v17.4.0, v16.14.0**

- `other` [\<RecordableHistogram\>](/de/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

Fügt die Werte von `other` zu diesem Histogramm hinzu.


### `histogram.record(val)` {#histogramrecordval}

**Hinzugefügt in: v15.9.0, v14.18.0**

- `val` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Der Wert, der im Histogramm erfasst werden soll.

### `histogram.recordDelta()` {#histogramrecorddelta}

**Hinzugefügt in: v15.9.0, v14.18.0**

Berechnet die Zeitdauer (in Nanosekunden), die seit dem letzten Aufruf von `recordDelta()` vergangen ist, und erfasst diese Dauer im Histogramm.

## Beispiele {#examples}

### Messen der Dauer asynchroner Operationen {#measuring-the-duration-of-async-operations}

Das folgende Beispiel verwendet die [Async Hooks](/de/nodejs/api/async_hooks) und Performance APIs, um die tatsächliche Dauer einer Timeout-Operation zu messen (einschließlich der Zeit, die für die Ausführung des Callbacks benötigt wurde).

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';
import { performance, PerformanceObserver } from 'node:perf_hooks';

const set = new Set();
const hook = createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```

```js [CJS]
'use strict';
const async_hooks = require('node:async_hooks');
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const set = new Set();
const hook = async_hooks.createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```
:::


### Messen der Dauer zum Laden von Abhängigkeiten {#measuring-how-long-it-takes-to-load-dependencies}

Das folgende Beispiel misst die Dauer von `require()`-Operationen zum Laden von Abhängigkeiten:

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

// Observer aktivieren
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`import('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

const timedImport = performance.timerify(async (module) => {
  return await import(module);
});

await timedImport('some-module');
```

```js [CJS]
'use strict';
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');
const mod = require('node:module');

// Monkey-Patch der Require-Funktion
mod.Module.prototype.require =
  performance.timerify(mod.Module.prototype.require);
require = performance.timerify(require);

// Observer aktivieren
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`require('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

require('some-module');
```
:::

### Messen der Dauer eines HTTP-Roundtrips {#measuring-how-long-one-http-round-trip-takes}

Das folgende Beispiel wird verwendet, um die Zeit zu verfolgen, die der HTTP-Client (`OutgoingMessage`) und die HTTP-Anfrage (`IncomingMessage`) benötigen. Für den HTTP-Client bedeutet dies das Zeitintervall zwischen dem Start der Anfrage und dem Empfang der Antwort, und für die HTTP-Anfrage bedeutet dies das Zeitintervall zwischen dem Empfang der Anfrage und dem Senden der Antwort:

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { createServer, get } from 'node:http';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  get(`http://127.0.0.1:${PORT}`);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const http = require('node:http');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

http.createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  http.get(`http://127.0.0.1:${PORT}`);
});
```
:::


### Messen, wie lange `net.connect` (nur für TCP) dauert, wenn die Verbindung erfolgreich ist {#measuring-how-long-the-netconnect-only-for-tcp-takes-when-the-connection-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { connect, createServer } from 'node:net';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  connect(PORT);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const net = require('node:net');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
net.createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  net.connect(PORT);
});
```
:::

### Messen, wie lange DNS dauert, wenn die Anfrage erfolgreich ist {#measuring-how-long-the-dns-takes-when-the-request-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { lookup, promises } from 'node:dns';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
lookup('localhost', () => {});
promises.resolve('localhost');
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const dns = require('node:dns');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
dns.lookup('localhost', () => {});
dns.promises.resolve('localhost');
```
:::

