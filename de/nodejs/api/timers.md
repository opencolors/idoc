---
title: Node.js Timer-API-Dokumentation
description: Das Timer-Modul von Node.js bietet Funktionen zum Planen von Funktionsaufrufen zu einem zukünftigen Zeitpunkt. Dazu gehören Methoden wie setTimeout, setInterval, setImmediate und deren Entsprechungen zum Löschen, sowie process.nextTick zur Ausführung von Code in der nächsten Iteration der Ereignisschleife.
head:
  - - meta
    - name: og:title
      content: Node.js Timer-API-Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das Timer-Modul von Node.js bietet Funktionen zum Planen von Funktionsaufrufen zu einem zukünftigen Zeitpunkt. Dazu gehören Methoden wie setTimeout, setInterval, setImmediate und deren Entsprechungen zum Löschen, sowie process.nextTick zur Ausführung von Code in der nächsten Iteration der Ereignisschleife.
  - - meta
    - name: twitter:title
      content: Node.js Timer-API-Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das Timer-Modul von Node.js bietet Funktionen zum Planen von Funktionsaufrufen zu einem zukünftigen Zeitpunkt. Dazu gehören Methoden wie setTimeout, setInterval, setImmediate und deren Entsprechungen zum Löschen, sowie process.nextTick zur Ausführung von Code in der nächsten Iteration der Ereignisschleife.
---


# Timer {#timers}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/timers.js](https://github.com/nodejs/node/blob/v23.5.0/lib/timers.js)

Das `timer`-Modul stellt eine globale API zum Planen von Funktionen bereit, die zu einem späteren Zeitpunkt aufgerufen werden sollen. Da die Timer-Funktionen global sind, ist es nicht erforderlich, `require('node:timers')` aufzurufen, um die API zu verwenden.

Die Timer-Funktionen innerhalb von Node.js implementieren eine ähnliche API wie die von Webbrowsern bereitgestellte Timer-API, verwenden jedoch eine andere interne Implementierung, die auf der Node.js [Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) basiert.

## Klasse: `Immediate` {#class-immediate}

Dieses Objekt wird intern erstellt und von [`setImmediate()`](/de/nodejs/api/timers#setimmediatecallback-args) zurückgegeben. Es kann an [`clearImmediate()`](/de/nodejs/api/timers#clearimmediateimmediate) übergeben werden, um die geplanten Aktionen abzubrechen.

Standardmäßig läuft die Node.js-Ereignisschleife weiter, solange ein Immediate aktiv ist. Das von [`setImmediate()`](/de/nodejs/api/timers#setimmediatecallback-args) zurückgegebene `Immediate`-Objekt exportiert sowohl `immediate.ref()`- als auch `immediate.unref()`-Funktionen, mit denen dieses Standardverhalten gesteuert werden kann.

### `immediate.hasRef()` {#immediatehasref}

**Hinzugefügt in: v11.0.0**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn true, hält das `Immediate`-Objekt die Node.js-Ereignisschleife aktiv.

### `immediate.ref()` {#immediateref}

**Hinzugefügt in: v9.7.0**

- Gibt zurück: [\<Immediate\>](/de/nodejs/api/timers#class-immediate) eine Referenz auf `immediate`

Wenn aufgerufen, wird angefordert, dass die Node.js-Ereignisschleife *nicht* beendet wird, solange das `Immediate` aktiv ist. Das mehrmalige Aufrufen von `immediate.ref()` hat keine Auswirkungen.

Standardmäßig sind alle `Immediate`-Objekte "ref'ed", wodurch es normalerweise unnötig ist, `immediate.ref()` aufzurufen, es sei denn, `immediate.unref()` wurde zuvor aufgerufen.


### `immediate.unref()` {#immediateunref}

**Hinzugefügt in: v9.7.0**

- Gibt zurück: [\<Immediate\>](/de/nodejs/api/timers#class-immediate) eine Referenz auf `immediate`

Wenn diese Funktion aufgerufen wird, benötigt das aktive `Immediate`-Objekt nicht, dass die Node.js-Ereignisschleife aktiv bleibt. Wenn es keine andere Aktivität gibt, die die Ereignisschleife am Laufen hält, kann der Prozess beendet werden, bevor der Callback des `Immediate`-Objekts aufgerufen wird. Das mehrmalige Aufrufen von `immediate.unref()` hat keine Auswirkung.

### `immediate[Symbol.dispose]()` {#immediatesymboldispose}

**Hinzugefügt in: v20.5.0, v18.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Bricht das Immediate ab. Dies ist ähnlich wie der Aufruf von `clearImmediate()`.

## Klasse: `Timeout` {#class-timeout}

Dieses Objekt wird intern erstellt und von [`setTimeout()`](/de/nodejs/api/timers#settimeoutcallback-delay-args) und [`setInterval()`](/de/nodejs/api/timers#setintervalcallback-delay-args) zurückgegeben. Es kann an entweder [`clearTimeout()`](/de/nodejs/api/timers#cleartimeouttimeout) oder [`clearInterval()`](/de/nodejs/api/timers#clearintervaltimeout) übergeben werden, um die geplanten Aktionen abzubrechen.

Standardmäßig wird die Node.js-Ereignisschleife weiterhin ausgeführt, solange der Timer aktiv ist, wenn ein Timer entweder mit [`setTimeout()`](/de/nodejs/api/timers#settimeoutcallback-delay-args) oder [`setInterval()`](/de/nodejs/api/timers#setintervalcallback-delay-args) geplant wird. Jedes der von diesen Funktionen zurückgegebenen `Timeout`-Objekte exportiert sowohl `timeout.ref()` als auch `timeout.unref()`-Funktionen, mit denen dieses Standardverhalten gesteuert werden kann.

### `timeout.close()` {#timeoutclose}

**Hinzugefügt in: v0.9.1**

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Verwenden Sie stattdessen [`clearTimeout()`](/de/nodejs/api/timers#cleartimeouttimeout).
:::

- Gibt zurück: [\<Timeout\>](/de/nodejs/api/timers#class-timeout) eine Referenz auf `timeout`

Bricht den Timeout ab.

### `timeout.hasRef()` {#timeouthasref}

**Hinzugefügt in: v11.0.0**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn true, hält das `Timeout`-Objekt die Node.js-Ereignisschleife aktiv.


### `timeout.ref()` {#timeoutref}

**Hinzugefügt in: v0.9.1**

- Gibt zurück: [\<Timeout\>](/de/nodejs/api/timers#class-timeout) eine Referenz auf `timeout`

Fordert beim Aufruf an, dass die Node.js-Ereignisschleife *nicht* beendet wird, solange das `Timeout` aktiv ist. Das mehrmalige Aufrufen von `timeout.ref()` hat keine Auswirkungen.

Standardmäßig sind alle `Timeout`-Objekte "ref'ed", was es normalerweise unnötig macht, `timeout.ref()` aufzurufen, es sei denn, `timeout.unref()` wurde zuvor aufgerufen.

### `timeout.refresh()` {#timeoutrefresh}

**Hinzugefügt in: v10.2.0**

- Gibt zurück: [\<Timeout\>](/de/nodejs/api/timers#class-timeout) eine Referenz auf `timeout`

Setzt die Startzeit des Timers auf die aktuelle Zeit und plant den Timer neu, um seinen Callback zur zuvor angegebenen Dauer, angepasst an die aktuelle Zeit, aufzurufen. Dies ist nützlich, um einen Timer zu aktualisieren, ohne ein neues JavaScript-Objekt zu erstellen.

Die Verwendung auf einem Timer, der seinen Callback bereits aufgerufen hat, reaktiviert den Timer.

### `timeout.unref()` {#timeoutunref}

**Hinzugefügt in: v0.9.1**

- Gibt zurück: [\<Timeout\>](/de/nodejs/api/timers#class-timeout) eine Referenz auf `timeout`

Beim Aufruf erfordert das aktive `Timeout`-Objekt nicht, dass die Node.js-Ereignisschleife aktiv bleibt. Wenn keine andere Aktivität die Ereignisschleife am Laufen hält, kann der Prozess beendet werden, bevor der Callback des `Timeout`-Objekts aufgerufen wird. Das mehrmalige Aufrufen von `timeout.unref()` hat keine Auswirkungen.

### `timeout[Symbol.toPrimitive]()` {#timeoutsymboltoprimitive}

**Hinzugefügt in: v14.9.0, v12.19.0**

- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) eine Zahl, die verwendet werden kann, um auf dieses `timeout` zu verweisen

Konvertiert ein `Timeout` in einen primitiven Datentyp. Der primitive Datentyp kann verwendet werden, um das `Timeout` zu löschen. Der primitive Datentyp kann nur in demselben Thread verwendet werden, in dem das Timeout erstellt wurde. Um ihn also über [`worker_threads`](/de/nodejs/api/worker_threads) zu verwenden, muss er zuerst an den korrekten Thread übergeben werden. Dies ermöglicht eine verbesserte Kompatibilität mit Browser-Implementierungen von `setTimeout()` und `setInterval()`.

### `timeout[Symbol.dispose]()` {#timeoutsymboldispose}

**Hinzugefügt in: v20.5.0, v18.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Bricht das Timeout ab.


## Timer planen {#scheduling-timers}

Ein Timer in Node.js ist ein internes Konstrukt, das eine bestimmte Funktion nach einer bestimmten Zeitspanne aufruft. Wann die Funktion eines Timers aufgerufen wird, hängt davon ab, mit welcher Methode der Timer erstellt wurde und welche andere Arbeit die Node.js-Ereignisschleife gerade ausführt.

### `setImmediate(callback[, ...args])` {#setimmediatecallback-args}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v0.9.1 | Hinzugefügt in: v0.9.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Funktion, die am Ende dieser Runde der Node.js-[Ereignisschleife](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) aufgerufen werden soll.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optionale Argumente, die beim Aufruf des `callback` übergeben werden sollen.
- Gibt zurück: [\<Immediate\>](/de/nodejs/api/timers#class-immediate) zur Verwendung mit [`clearImmediate()`](/de/nodejs/api/timers#clearimmediateimmediate)

Plant die "sofortige" Ausführung des `callback` nach den Callbacks von I/O-Ereignissen.

Wenn mehrere Aufrufe von `setImmediate()` erfolgen, werden die `callback`-Funktionen in der Reihenfolge ihrer Erstellung zur Ausführung in die Warteschlange gestellt. Die gesamte Callback-Warteschlange wird in jeder Iteration der Ereignisschleife verarbeitet. Wenn ein Immediate-Timer innerhalb eines ausgeführten Callbacks in die Warteschlange gestellt wird, wird dieser Timer erst bei der nächsten Iteration der Ereignisschleife ausgelöst.

Wenn `callback` keine Funktion ist, wird ein [`TypeError`](/de/nodejs/api/errors#class-typeerror) ausgelöst.

Diese Methode hat eine benutzerdefinierte Variante für Promises, die mit [`timersPromises.setImmediate()`](/de/nodejs/api/timers#timerspromisessetimmediatevalue-options) verfügbar ist.

### `setInterval(callback[, delay[, ...args]])` {#setintervalcallback-delay-args}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v0.0.1 | Hinzugefügt in: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Funktion, die aufgerufen werden soll, wenn der Timer abläuft.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die gewartet werden soll, bevor der `callback` aufgerufen wird. **Standard:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optionale Argumente, die beim Aufruf des `callback` übergeben werden sollen.
- Gibt zurück: [\<Timeout\>](/de/nodejs/api/timers#class-timeout) zur Verwendung mit [`clearInterval()`](/de/nodejs/api/timers#clearintervaltimeout)

Plant die wiederholte Ausführung von `callback` alle `delay` Millisekunden.

Wenn `delay` größer als `2147483647` oder kleiner als `1` oder `NaN` ist, wird `delay` auf `1` gesetzt. Nicht-ganzzahlige Verzögerungen werden zu einer Ganzzahl abgeschnitten.

Wenn `callback` keine Funktion ist, wird ein [`TypeError`](/de/nodejs/api/errors#class-typeerror) ausgelöst.

Diese Methode hat eine benutzerdefinierte Variante für Promises, die mit [`timersPromises.setInterval()`](/de/nodejs/api/timers#timerspromisessetintervaldelay-value-options) verfügbar ist.


### `setTimeout(callback[, delay[, ...args]])` {#settimeoutcallback-delay-args}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v0.0.1 | Hinzugefügt in: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Funktion, die aufgerufen wird, wenn der Timer abläuft.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die gewartet werden soll, bevor der `callback` aufgerufen wird. **Standard:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optionale Argumente, die beim Aufruf des `callback` übergeben werden.
- Gibt zurück: [\<Timeout\>](/de/nodejs/api/timers#class-timeout) zur Verwendung mit [`clearTimeout()`](/de/nodejs/api/timers#cleartimeouttimeout)

Plant die Ausführung eines einmaligen `callback` nach `delay` Millisekunden.

Der `callback` wird wahrscheinlich nicht genau nach `delay` Millisekunden aufgerufen. Node.js gibt keine Garantien für das genaue Timing der Auslösung von Callbacks oder deren Reihenfolge. Der Callback wird so nah wie möglich an der angegebenen Zeit aufgerufen.

Wenn `delay` größer als `2147483647` oder kleiner als `1` oder `NaN` ist, wird `delay` auf `1` gesetzt. Nicht-ganzzahlige Verzögerungen werden zu einer Ganzzahl abgeschnitten.

Wenn `callback` keine Funktion ist, wird ein [`TypeError`](/de/nodejs/api/errors#class-typeerror) ausgelöst.

Diese Methode hat eine benutzerdefinierte Variante für Promises, die mit [`timersPromises.setTimeout()`](/de/nodejs/api/timers#timerspromisessettimeoutdelay-value-options) verfügbar ist.

## Timer abbrechen {#cancelling-timers}

Die Methoden [`setImmediate()`](/de/nodejs/api/timers#setimmediatecallback-args), [`setInterval()`](/de/nodejs/api/timers#setintervalcallback-delay-args) und [`setTimeout()`](/de/nodejs/api/timers#settimeoutcallback-delay-args) geben jeweils Objekte zurück, die die geplanten Timer darstellen. Diese können verwendet werden, um den Timer abzubrechen und seine Auslösung zu verhindern.

Für die promisifizierten Varianten von [`setImmediate()`](/de/nodejs/api/timers#setimmediatecallback-args) und [`setTimeout()`](/de/nodejs/api/timers#settimeoutcallback-delay-args) kann ein [`AbortController`](/de/nodejs/api/globals#class-abortcontroller) verwendet werden, um den Timer abzubrechen. Wenn abgebrochen, werden die zurückgegebenen Promises mit einem `'AbortError'` abgelehnt.

Für `setImmediate()`:

::: code-group
```js [ESM]
import { setImmediate as setImmediatePromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// Wir `await` das Promise nicht, sodass `ac.abort()` gleichzeitig aufgerufen wird.
setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The immediate was aborted');
  });

ac.abort();
```

```js [CJS]
const { setImmediate: setImmediatePromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The immediate was aborted');
  });

ac.abort();
```
:::

Für `setTimeout()`:

::: code-group
```js [ESM]
import { setTimeout as setTimeoutPromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// Wir `await` das Promise nicht, sodass `ac.abort()` gleichzeitig aufgerufen wird.
setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The timeout was aborted');
  });

ac.abort();
```

```js [CJS]
const { setTimeout: setTimeoutPromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The timeout was aborted');
  });

ac.abort();
```
:::


### `clearImmediate(immediate)` {#clearimmediateimmediate}

**Hinzugefügt in: v0.9.1**

- `immediate` [\<Immediate\>](/de/nodejs/api/timers#class-immediate) Ein `Immediate`-Objekt, wie von [`setImmediate()`](/de/nodejs/api/timers#setimmediatecallback-args) zurückgegeben.

Bricht ein `Immediate`-Objekt ab, das von [`setImmediate()`](/de/nodejs/api/timers#setimmediatecallback-args) erstellt wurde.

### `clearInterval(timeout)` {#clearintervaltimeout}

**Hinzugefügt in: v0.0.1**

- `timeout` [\<Timeout\>](/de/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein `Timeout`-Objekt, wie von [`setInterval()`](/de/nodejs/api/timers#setintervalcallback-delay-args) zurückgegeben, oder das [primitive](/de/nodejs/api/timers#timeoutsymboltoprimitive) des `Timeout`-Objekts als String oder Zahl.

Bricht ein `Timeout`-Objekt ab, das von [`setInterval()`](/de/nodejs/api/timers#setintervalcallback-delay-args) erstellt wurde.

### `clearTimeout(timeout)` {#cleartimeouttimeout}

**Hinzugefügt in: v0.0.1**

- `timeout` [\<Timeout\>](/de/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein `Timeout`-Objekt, wie von [`setTimeout()`](/de/nodejs/api/timers#settimeoutcallback-delay-args) zurückgegeben, oder das [primitive](/de/nodejs/api/timers#timeoutsymboltoprimitive) des `Timeout`-Objekts als String oder Zahl.

Bricht ein `Timeout`-Objekt ab, das von [`setTimeout()`](/de/nodejs/api/timers#settimeoutcallback-delay-args) erstellt wurde.

## Timers Promises API {#timers-promises-api}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Von experimentell befördert. |
| v15.0.0 | Hinzugefügt in: v15.0.0 |
:::

Die `timers/promises`-API bietet einen alternativen Satz von Timer-Funktionen, die `Promise`-Objekte zurückgeben. Die API ist über `require('node:timers/promises')` zugänglich.

::: code-group
```js [ESM]
import {
  setTimeout,
  setImmediate,
  setInterval,
} from 'node:timers/promises';
```

```js [CJS]
const {
  setTimeout,
  setImmediate,
  setInterval,
} = require('node:timers/promises');
```
:::


### `timersPromises.setTimeout([delay[, value[, options]]])` {#timerspromisessettimeoutdelay-value-options}

**Hinzugefügt in: v15.0.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die gewartet werden soll, bevor das Promise erfüllt wird. **Standard:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein Wert, mit dem das Promise erfüllt wird.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Auf `false` setzen, um anzugeben, dass der geplante `Timeout` nicht erfordert, dass die Node.js-Event-Schleife aktiv bleibt. **Standard:** `true`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ein optionales `AbortSignal`, das verwendet werden kann, um das geplante `Timeout` abzubrechen.





::: code-group
```js [ESM]
import {
  setTimeout,
} from 'node:timers/promises';

const res = await setTimeout(100, 'result');

console.log(res);  // Gibt 'result' aus
```

```js [CJS]
const {
  setTimeout,
} = require('node:timers/promises');

setTimeout(100, 'result').then((res) => {
  console.log(res);  // Gibt 'result' aus
});
```
:::

### `timersPromises.setImmediate([value[, options]])` {#timerspromisessetimmediatevalue-options}

**Hinzugefügt in: v15.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein Wert, mit dem das Promise erfüllt wird.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Auf `false` setzen, um anzugeben, dass der geplante `Immediate` nicht erfordert, dass die Node.js-Event-Schleife aktiv bleibt. **Standard:** `true`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ein optionales `AbortSignal`, das verwendet werden kann, um das geplante `Immediate` abzubrechen.





::: code-group
```js [ESM]
import {
  setImmediate,
} from 'node:timers/promises';

const res = await setImmediate('result');

console.log(res);  // Gibt 'result' aus
```

```js [CJS]
const {
  setImmediate,
} = require('node:timers/promises');

setImmediate('result').then((res) => {
  console.log(res);  // Gibt 'result' aus
});
```
:::


### `timersPromises.setInterval([delay[, value[, options]]])` {#timerspromisessetintervaldelay-value-options}

**Hinzugefügt in: v15.9.0**

Gibt einen Async-Iterator zurück, der Werte in einem Intervall von `delay` ms generiert. Wenn `ref` `true` ist, müssen Sie `next()` des Async-Iterators explizit oder implizit aufrufen, um die Event Loop aktiv zu halten.

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die zwischen den Iterationen gewartet werden soll. **Standard:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein Wert, mit dem der Iterator zurückkehrt.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Auf `false` setzen, um anzugeben, dass das geplante `Timeout` zwischen den Iterationen nicht erfordert, dass die Node.js-Ereignisschleife aktiv bleibt. **Standard:** `true`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ein optionales `AbortSignal`, das verwendet werden kann, um das geplante `Timeout` zwischen Operationen abzubrechen.

::: code-group
```js [ESM]
import {
  setInterval,
} from 'node:timers/promises';

const interval = 100;
for await (const startTime of setInterval(interval, Date.now())) {
  const now = Date.now();
  console.log(now);
  if ((now - startTime) > 1000)
    break;
}
console.log(Date.now());
```

```js [CJS]
const {
  setInterval,
} = require('node:timers/promises');
const interval = 100;

(async function() {
  for await (const startTime of setInterval(interval, Date.now())) {
    const now = Date.now();
    console.log(now);
    if ((now - startTime) > 1000)
      break;
  }
  console.log(Date.now());
})();
```
:::

### `timersPromises.scheduler.wait(delay[, options])` {#timerspromisesschedulerwaitdelay-options}

**Hinzugefügt in: v17.3.0, v16.14.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die gewartet werden soll, bevor die Promise aufgelöst wird.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Auf `false` setzen, um anzugeben, dass das geplante `Timeout` nicht erfordert, dass die Node.js-Ereignisschleife aktiv bleibt. **Standard:** `true`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ein optionales `AbortSignal`, das zum Abbrechen des Wartens verwendet werden kann.

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Eine experimentelle API, die von der Entwurfsspezifikation der [Scheduling APIs](https://github.com/WICG/scheduling-apis) definiert wird, die als Standard-Webplattform-API entwickelt wird.

Der Aufruf von `timersPromises.scheduler.wait(delay, options)` entspricht dem Aufruf von `timersPromises.setTimeout(delay, undefined, options)`.

```js [ESM]
import { scheduler } from 'node:timers/promises';

await scheduler.wait(1000); // Eine Sekunde warten, bevor fortgefahren wird
```

### `timersPromises.scheduler.yield()` {#timerspromisesscheduleryield}

**Hinzugefügt in: v17.3.0, v16.14.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Eine experimentelle API, die durch die Entwurfsspezifikation der [Scheduling APIs](https://github.com/WICG/scheduling-apis) definiert ist, die als Standard-Webplattform-API entwickelt wird.

Der Aufruf von `timersPromises.scheduler.yield()` entspricht dem Aufruf von `timersPromises.setImmediate()` ohne Argumente.

