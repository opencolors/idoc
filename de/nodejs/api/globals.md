---
title: Globale Objekte in Node.js
description: Diese Seite dokumentiert die globalen Objekte, die in Node.js verfügbar sind, einschließlich globaler Variablen, Funktionen und Klassen, die ohne expliziten Import aus jedem Modul zugänglich sind.
head:
  - - meta
    - name: og:title
      content: Globale Objekte in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Diese Seite dokumentiert die globalen Objekte, die in Node.js verfügbar sind, einschließlich globaler Variablen, Funktionen und Klassen, die ohne expliziten Import aus jedem Modul zugänglich sind.
  - - meta
    - name: twitter:title
      content: Globale Objekte in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Diese Seite dokumentiert die globalen Objekte, die in Node.js verfügbar sind, einschließlich globaler Variablen, Funktionen und Klassen, die ohne expliziten Import aus jedem Modul zugänglich sind.
---


# Globale Objekte {#global-objects}

Diese Objekte sind in allen Modulen verfügbar.

Die folgenden Variablen scheinen möglicherweise global zu sein, sind es aber nicht. Sie existieren nur im Gültigkeitsbereich von [CommonJS-Modulen](/de/nodejs/api/modules):

- [`__dirname`](/de/nodejs/api/modules#__dirname)
- [`__filename`](/de/nodejs/api/modules#__filename)
- [`exports`](/de/nodejs/api/modules#exports)
- [`module`](/de/nodejs/api/modules#module)
- [`require()`](/de/nodejs/api/modules#requireid)

Die hier aufgeführten Objekte sind spezifisch für Node.js. Es gibt [eingebaute Objekte](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects), die Teil der JavaScript-Sprache selbst sind und ebenfalls global zugänglich sind.

## Klasse: `AbortController` {#class-abortcontroller}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.4.0 | Nicht mehr experimentell. |
| v15.0.0, v14.17.0 | Hinzugefügt in: v15.0.0, v14.17.0 |
:::

Eine Utility-Klasse, die verwendet wird, um die Abbrechung in ausgewählten `Promise`-basierten APIs zu signalisieren. Die API basiert auf der Web-API [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

```js [ESM]
const ac = new AbortController();

ac.signal.addEventListener('abort', () => console.log('Aborted!'),
                           { once: true });

ac.abort();

console.log(ac.signal.aborted);  // Gibt true aus
```
### `abortController.abort([reason])` {#abortcontrollerabortreason}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.2.0, v16.14.0 | Das neue optionale `reason`-Argument wurde hinzugefügt. |
| v15.0.0, v14.17.0 | Hinzugefügt in: v15.0.0, v14.17.0 |
:::

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein optionaler Grund, der über die `reason`-Eigenschaft des `AbortSignal` abrufbar ist.

Löst das Abbruchsignal aus und bewirkt, dass das `abortController.signal` das `'abort'`-Ereignis ausgibt.

### `abortController.signal` {#abortcontrollersignal}

**Hinzugefügt in: v15.0.0, v14.17.0**

- Typ: [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal)

### Klasse: `AbortSignal` {#class-abortsignal}

**Hinzugefügt in: v15.0.0, v14.17.0**

- Erweitert: [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget)

Das `AbortSignal` wird verwendet, um Beobachter zu benachrichtigen, wenn die Methode `abortController.abort()` aufgerufen wird.


#### Statische Methode: `AbortSignal.abort([reason])` {#static-method-abortsignalabortreason}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.2.0, v16.14.0 | Das neue optionale Argument reason wurde hinzugefügt. |
| v15.12.0, v14.17.0 | Hinzugefügt in: v15.12.0, v14.17.0 |
:::

- `reason`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal)

Gibt ein neues, bereits abgebrochenes `AbortSignal` zurück.

#### Statische Methode: `AbortSignal.timeout(delay)` {#static-method-abortsignaltimeoutdelay}

**Hinzugefügt in: v17.3.0, v16.14.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die gewartet werden soll, bevor das AbortSignal ausgelöst wird.

Gibt ein neues `AbortSignal` zurück, das in `delay` Millisekunden abgebrochen wird.

#### Statische Methode: `AbortSignal.any(signals)` {#static-method-abortsignalanysignals}

**Hinzugefügt in: v20.3.0, v18.17.0**

- `signals` [\<AbortSignal[]\>](/de/nodejs/api/globals#class-abortsignal) Die `AbortSignal`s, aus denen ein neues `AbortSignal` zusammengesetzt werden soll.

Gibt ein neues `AbortSignal` zurück, das abgebrochen wird, wenn eines der bereitgestellten Signale abgebrochen wird. Sein [`abortSignal.reason`](/de/nodejs/api/globals#abortsignalreason) wird auf dasjenige der `signals` gesetzt, das den Abbruch verursacht hat.

#### Ereignis: `'abort'` {#event-abort}

**Hinzugefügt in: v15.0.0, v14.17.0**

Das Ereignis `'abort'` wird ausgelöst, wenn die Methode `abortController.abort()` aufgerufen wird. Der Callback wird mit einem einzelnen Objektargument aufgerufen, das eine einzelne Eigenschaft `type` hat, die auf `'abort'` gesetzt ist:

```js [ESM]
const ac = new AbortController();

// Verwenden Sie entweder die onabort-Eigenschaft...
ac.signal.onabort = () => console.log('abgebrochen!');

// Oder die EventTarget-API...
ac.signal.addEventListener('abort', (event) => {
  console.log(event.type);  // Gibt 'abort' aus
}, { once: true });

ac.abort();
```
Der `AbortController`, dem das `AbortSignal` zugeordnet ist, löst das Ereignis `'abort'` nur einmal aus. Wir empfehlen, dass der Code überprüft, ob das Attribut `abortSignal.aborted` `false` ist, bevor ein `'abort'`-Ereignis-Listener hinzugefügt wird.

Alle Ereignis-Listener, die an das `AbortSignal` angehängt sind, sollten die Option `{ once: true }` verwenden (oder, wenn die `EventEmitter`-APIs zum Anhängen eines Listeners verwendet werden, die Methode `once()`), um sicherzustellen, dass der Ereignis-Listener entfernt wird, sobald das Ereignis `'abort'` behandelt wurde. Andernfalls kann es zu Speicherlecks kommen.


#### `abortSignal.aborted` {#abortsignalaborted}

**Hinzugefügt in: v15.0.0, v14.17.0**

- Typ: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) True, nachdem der `AbortController` abgebrochen wurde.

#### `abortSignal.onabort` {#abortsignalonabort}

**Hinzugefügt in: v15.0.0, v14.17.0**

- Typ: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Eine optionale Callback-Funktion, die vom Benutzercode festgelegt werden kann, um benachrichtigt zu werden, wenn die Funktion `abortController.abort()` aufgerufen wurde.

#### `abortSignal.reason` {#abortsignalreason}

**Hinzugefügt in: v17.2.0, v16.14.0**

- Typ: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Ein optionaler Grund, der beim Auslösen des `AbortSignal` angegeben wurde.

```js [ESM]
const ac = new AbortController();
ac.abort(new Error('boom!'));
console.log(ac.signal.reason);  // Error: boom!
```
#### `abortSignal.throwIfAborted()` {#abortsignalthrowifaborted}

**Hinzugefügt in: v17.3.0, v16.17.0**

Wenn `abortSignal.aborted` `true` ist, wird `abortSignal.reason` ausgelöst.

## Klasse: `Blob` {#class-blob}

**Hinzugefügt in: v18.0.0**

Siehe [\<Blob\>](/de/nodejs/api/buffer#class-blob).

## Klasse: `Buffer` {#class-buffer}

**Hinzugefügt in: v0.1.103**

- [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Wird verwendet, um binäre Daten zu verarbeiten. Siehe den [Buffer-Abschnitt](/de/nodejs/api/buffer).

## Klasse: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`ByteLengthQueuingStrategy`](/de/nodejs/api/webstreams#class-bytelengthqueuingstrategy).

## `__dirname` {#__dirname}

Diese Variable scheint global zu sein, ist es aber nicht. Siehe [`__dirname`](/de/nodejs/api/modules#__dirname).

## `__filename` {#__filename}

Diese Variable scheint global zu sein, ist es aber nicht. Siehe [`__filename`](/de/nodejs/api/modules#__filename).

## `atob(data)` {#atobdata}

**Hinzugefügt in: v16.0.0**

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy. Verwenden Sie stattdessen `Buffer.from(data, 'base64')`.
:::

Globaler Alias für [`buffer.atob()`](/de/nodejs/api/buffer#bufferatobdata).


## `BroadcastChannel` {#broadcastchannel}

**Hinzugefügt in: v18.0.0**

Siehe [\<BroadcastChannel\>](/de/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget).

## `btoa(data)` {#btoadata}

**Hinzugefügt in: v16.0.0**

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy. Verwenden Sie stattdessen `buf.toString('base64')`.
:::

Globaler Alias für [`buffer.btoa()`](/de/nodejs/api/buffer#bufferbtoadata).

## `clearImmediate(immediateObject)` {#clearimmediateimmediateobject}

**Hinzugefügt in: v0.9.1**

[`clearImmediate`](/de/nodejs/api/timers#clearimmediateimmediate) wird im Abschnitt [timers](/de/nodejs/api/timers) beschrieben.

## `clearInterval(intervalObject)` {#clearintervalintervalobject}

**Hinzugefügt in: v0.0.1**

[`clearInterval`](/de/nodejs/api/timers#clearintervaltimeout) wird im Abschnitt [timers](/de/nodejs/api/timers) beschrieben.

## `clearTimeout(timeoutObject)` {#cleartimeouttimeoutobject}

**Hinzugefügt in: v0.0.1**

[`clearTimeout`](/de/nodejs/api/timers#cleartimeouttimeout) wird im Abschnitt [timers](/de/nodejs/api/timers) beschrieben.

## `CloseEvent` {#closeevent}

**Hinzugefügt in: v23.0.0**

Die `CloseEvent`-Klasse. Weitere Informationen finden Sie unter [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent).

Eine browserkompatible Implementierung von [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent). Deaktivieren Sie diese API mit dem CLI-Flag [`--no-experimental-websocket`](/de/nodejs/api/cli#--no-experimental-websocket).

## Klasse: `CompressionStream` {#class-compressionstream}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`CompressionStream`](/de/nodejs/api/webstreams#class-compressionstream).

## `console` {#console}

**Hinzugefügt in: v0.1.100**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Wird verwendet, um in stdout und stderr auszugeben. Siehe den Abschnitt [`console`](/de/nodejs/api/console).

## Klasse: `CountQueuingStrategy` {#class-countqueuingstrategy}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`CountQueuingStrategy`](/de/nodejs/api/webstreams#class-countqueuingstrategy).


## `Crypto` {#crypto}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Nicht mehr experimentell. |
| v19.0.0 | Nicht mehr hinter dem `--experimental-global-webcrypto` CLI-Flag. |
| v17.6.0, v16.15.0 | Hinzugefügt in: v17.6.0, v16.15.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil.
:::

Eine browserkompatible Implementierung von [\<Crypto\>](/de/nodejs/api/webcrypto#class-crypto). Dieses globale Objekt ist nur verfügbar, wenn die Node.js-Binärdatei mit Unterstützung für das `node:crypto`-Modul kompiliert wurde.

## `crypto` {#crypto_1}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Nicht mehr experimentell. |
| v19.0.0 | Nicht mehr hinter dem `--experimental-global-webcrypto` CLI-Flag. |
| v17.6.0, v16.15.0 | Hinzugefügt in: v17.6.0, v16.15.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil.
:::

Eine browserkompatible Implementierung der [Web Crypto API](/de/nodejs/api/webcrypto).

## `CryptoKey` {#cryptokey}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Nicht mehr experimentell. |
| v19.0.0 | Nicht mehr hinter dem `--experimental-global-webcrypto` CLI-Flag. |
| v17.6.0, v16.15.0 | Hinzugefügt in: v17.6.0, v16.15.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil.
:::

Eine browserkompatible Implementierung von [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey). Dieses globale Objekt ist nur verfügbar, wenn die Node.js-Binärdatei mit Unterstützung für das `node:crypto`-Modul kompiliert wurde.

## `CustomEvent` {#customevent}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Nicht mehr experimentell. |
| v22.1.0, v20.13.0 | CustomEvent ist jetzt stabil. |
| v19.0.0 | Nicht mehr hinter dem `--experimental-global-customevent` CLI-Flag. |
| v18.7.0, v16.17.0 | Hinzugefügt in: v18.7.0, v16.17.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Eine browserkompatible Implementierung der [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent).


## Klasse: `DecompressionStream` {#class-decompressionstream}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`DecompressionStream`](/de/nodejs/api/webstreams#class-decompressionstream).

## `Event` {#event}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.4.0 | Nicht mehr experimentell. |
| v15.0.0 | Hinzugefügt in: v15.0.0 |
:::

Eine browserkompatible Implementierung der Klasse `Event`. Weitere Informationen finden Sie unter [`EventTarget` und `Event` API](/de/nodejs/api/events#eventtarget-and-event-api).

## `EventSource` {#eventsource}

**Hinzugefügt in: v22.3.0, v20.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell. Aktivieren Sie diese API mit dem CLI-Flag [`--experimental-eventsource`](/de/nodejs/api/cli#--experimental-eventsource).
:::

Eine browserkompatible Implementierung der Klasse [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource).

## `EventTarget` {#eventtarget}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.4.0 | Nicht mehr experimentell. |
| v15.0.0 | Hinzugefügt in: v15.0.0 |
:::

Eine browserkompatible Implementierung der Klasse `EventTarget`. Weitere Informationen finden Sie unter [`EventTarget` und `Event` API](/de/nodejs/api/events#eventtarget-and-event-api).

## `exports` {#exports}

Diese Variable scheint global zu sein, ist es aber nicht. Siehe [`exports`](/de/nodejs/api/modules#exports).

## `fetch` {#fetch}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.0.0 | Nicht mehr experimentell. |
| v18.0.0 | Nicht mehr hinter dem CLI-Flag `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Hinzugefügt in: v17.5.0, v16.15.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Eine browserkompatible Implementierung der Funktion [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch).

## Klasse: `File` {#class-file}

**Hinzugefügt in: v20.0.0**

Siehe [\<File\>](/de/nodejs/api/buffer#class-file).


## Klasse `FormData` {#class-formdata}

::: info [Historie]
| Version | Änderungen |
|---|---|
| v21.0.0 | Nicht mehr experimentell. |
| v18.0.0 | Nicht mehr hinter dem `--experimental-fetch` CLI-Flag. |
| v17.6.0, v16.15.0 | Hinzugefügt in: v17.6.0, v16.15.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Eine browserkompatible Implementierung von [\<FormData\>](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

## `global` {#global}

**Hinzugefügt in: v0.1.27**

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy. Verwenden Sie stattdessen [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis).
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das globale Namespace-Objekt.

In Browsern war der Gültigkeitsbereich der obersten Ebene traditionell der globale Gültigkeitsbereich. Dies bedeutet, dass `var something` eine neue globale Variable definiert, außer innerhalb von ECMAScript-Modulen. In Node.js ist dies anders. Der Gültigkeitsbereich der obersten Ebene ist nicht der globale Gültigkeitsbereich; `var something` innerhalb eines Node.js-Moduls ist lokal für dieses Modul, unabhängig davon, ob es sich um ein [CommonJS-Modul](/de/nodejs/api/modules) oder ein [ECMAScript-Modul](/de/nodejs/api/esm) handelt.

## Klasse `Headers` {#class-headers}

::: info [Historie]
| Version | Änderungen |
|---|---|
| v21.0.0 | Nicht mehr experimentell. |
| v18.0.0 | Nicht mehr hinter dem `--experimental-fetch` CLI-Flag. |
| v17.5.0, v16.15.0 | Hinzugefügt in: v17.5.0, v16.15.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Eine browserkompatible Implementierung von [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers).

## `localStorage` {#localstorage}

**Hinzugefügt in: v22.4.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).0 - Frühe Entwicklung.
:::

Eine browserkompatible Implementierung von [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Die Daten werden unverschlüsselt in der durch das CLI-Flag [`--localstorage-file`](/de/nodejs/api/cli#--localstorage-filefile) angegebene Datei gespeichert. Die maximale Datenmenge, die gespeichert werden kann, beträgt 10 MB. Jegliche Änderung dieser Daten außerhalb der Web Storage API wird nicht unterstützt. Aktivieren Sie diese API mit dem CLI-Flag [`--experimental-webstorage`](/de/nodejs/api/cli#--experimental-webstorage). `localStorage`-Daten werden nicht pro Benutzer oder pro Anfrage gespeichert, wenn sie im Kontext eines Servers verwendet werden, sondern werden von allen Benutzern und Anfragen gemeinsam genutzt.


## `MessageChannel` {#messagechannel}

**Hinzugefügt in: v15.0.0**

Die `MessageChannel`-Klasse. Siehe [`MessageChannel`](/de/nodejs/api/worker_threads#class-messagechannel) für weitere Details.

## `MessageEvent` {#messageevent}

**Hinzugefügt in: v15.0.0**

Die `MessageEvent`-Klasse. Siehe [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/MessageEvent) für weitere Details.

## `MessagePort` {#messageport}

**Hinzugefügt in: v15.0.0**

Die `MessagePort`-Klasse. Siehe [`MessagePort`](/de/nodejs/api/worker_threads#class-messageport) für weitere Details.

## `module` {#module}

Diese Variable mag global erscheinen, ist es aber nicht. Siehe [`module`](/de/nodejs/api/modules#module).

## `Navigator` {#navigator}

**Hinzugefügt in: v21.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung. Deaktivieren Sie diese API mit dem [`--no-experimental-global-navigator`](/de/nodejs/api/cli#--no-experimental-global-navigator) CLI-Flag.
:::

Eine partielle Implementierung der [Navigator API](https://html.spec.whatwg.org/multipage/system-state#the-navigator-object).

## `navigator` {#navigator_1}

**Hinzugefügt in: v21.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung. Deaktivieren Sie diese API mit dem [`--no-experimental-global-navigator`](/de/nodejs/api/cli#--no-experimental-global-navigator) CLI-Flag.
:::

Eine partielle Implementierung von [`window.navigator`](https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator).

### `navigator.hardwareConcurrency` {#navigatorhardwareconcurrency}

**Hinzugefügt in: v21.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die schreibgeschützte Eigenschaft `navigator.hardwareConcurrency` gibt die Anzahl der logischen Prozessoren zurück, die der aktuellen Node.js-Instanz zur Verfügung stehen.

```js [ESM]
console.log(`Dieser Prozess läuft auf ${navigator.hardwareConcurrency} logischen Prozessoren`);
```
### `navigator.language` {#navigatorlanguage}

**Hinzugefügt in: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die schreibgeschützte Eigenschaft `navigator.language` gibt eine Zeichenkette zurück, die die bevorzugte Sprache der Node.js-Instanz darstellt. Die Sprache wird von der ICU-Bibliothek bestimmt, die von Node.js zur Laufzeit verwendet wird, basierend auf der Standardsprache des Betriebssystems.

Der Wert repräsentiert die Sprachversion, wie in [RFC 5646](https://www.rfc-editor.org/rfc/rfc5646.txt) definiert.

Der Fallback-Wert bei Builds ohne ICU ist `'en-US'`.

```js [ESM]
console.log(`Die bevorzugte Sprache der Node.js-Instanz hat das Tag '${navigator.language}'`);
```

### `navigator.languages` {#navigatorlanguages}

**Hinzugefügt in: v21.2.0**

- {Array

Die schreibgeschützte Eigenschaft `navigator.languages` gibt ein Array von Zeichenketten zurück, das die bevorzugten Sprachen der Node.js-Instanz darstellt. Standardmäßig enthält `navigator.languages` nur den Wert von `navigator.language`, der von der von Node.js zur Laufzeit verwendeten ICU-Bibliothek basierend auf der Standardsprache des Betriebssystems ermittelt wird.

Der Fallback-Wert bei Builds ohne ICU ist `['en-US']`.

```js [ESM]
console.log(`Die bevorzugten Sprachen sind '${navigator.languages}'`);
```
### `navigator.platform` {#navigatorplatform}

**Hinzugefügt in: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die schreibgeschützte Eigenschaft `navigator.platform` gibt eine Zeichenkette zurück, die die Plattform identifiziert, auf der die Node.js-Instanz ausgeführt wird.

```js [ESM]
console.log(`Dieser Prozess läuft auf ${navigator.platform}`);
```
### `navigator.userAgent` {#navigatoruseragent}

**Hinzugefügt in: v21.1.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die schreibgeschützte Eigenschaft `navigator.userAgent` gibt einen User-Agent zurück, der aus dem Laufzeitnamen und der Hauptversionsnummer besteht.

```js [ESM]
console.log(`Der User-Agent ist ${navigator.userAgent}`); // Gibt "Node.js/21" aus
```
## `PerformanceEntry` {#performanceentry}

**Hinzugefügt in: v19.0.0**

Die `PerformanceEntry`-Klasse. Weitere Informationen finden Sie unter [`PerformanceEntry`](/de/nodejs/api/perf_hooks#class-performanceentry).

## `PerformanceMark` {#performancemark}

**Hinzugefügt in: v19.0.0**

Die `PerformanceMark`-Klasse. Weitere Informationen finden Sie unter [`PerformanceMark`](/de/nodejs/api/perf_hooks#class-performancemark).

## `PerformanceMeasure` {#performancemeasure}

**Hinzugefügt in: v19.0.0**

Die `PerformanceMeasure`-Klasse. Weitere Informationen finden Sie unter [`PerformanceMeasure`](/de/nodejs/api/perf_hooks#class-performancemeasure).

## `PerformanceObserver` {#performanceobserver}

**Hinzugefügt in: v19.0.0**

Die `PerformanceObserver`-Klasse. Weitere Informationen finden Sie unter [`PerformanceObserver`](/de/nodejs/api/perf_hooks#class-performanceobserver).

## `PerformanceObserverEntryList` {#performanceobserverentrylist}

**Hinzugefügt in: v19.0.0**

Die `PerformanceObserverEntryList`-Klasse. Weitere Informationen finden Sie unter [`PerformanceObserverEntryList`](/de/nodejs/api/perf_hooks#class-performanceobserverentrylist).


## `PerformanceResourceTiming` {#performanceresourcetiming}

**Hinzugefügt in: v19.0.0**

Die `PerformanceResourceTiming`-Klasse. Weitere Informationen finden Sie unter [`PerformanceResourceTiming`](/de/nodejs/api/perf_hooks#class-performanceresourcetiming).

## `performance` {#performance}

**Hinzugefügt in: v16.0.0**

Das [`perf_hooks.performance`](/de/nodejs/api/perf_hooks#perf_hooksperformance)-Objekt.

## `process` {#process}

**Hinzugefügt in: v0.1.7**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Das Prozessobjekt. Siehe den Abschnitt [`process`-Objekt](/de/nodejs/api/process#process).

## `queueMicrotask(callback)` {#queuemicrotaskcallback}

**Hinzugefügt in: v11.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funktion, die in die Warteschlange gestellt werden soll.

Die `queueMicrotask()`-Methode stellt eine Microtask in die Warteschlange, um `callback` aufzurufen. Wenn `callback` eine Ausnahme auslöst, wird das `'uncaughtException'`-Ereignis des [`process`-Objekts](/de/nodejs/api/process#process) ausgelöst.

Die Microtask-Warteschlange wird von V8 verwaltet und kann auf ähnliche Weise wie die [`process.nextTick()`-Warteschlange](/de/nodejs/api/process#processnexttickcallback-args) verwendet werden, die von Node.js verwaltet wird. Die `process.nextTick()`-Warteschlange wird immer vor der Microtask-Warteschlange in jeder Runde der Node.js-Ereignisschleife verarbeitet.

```js [ESM]
// Hier wird `queueMicrotask()` verwendet, um sicherzustellen, dass das 'load'-Ereignis immer
// asynchron und somit konsistent ausgelöst wird. Die Verwendung von
// `process.nextTick()` hier würde dazu führen, dass das 'load'-Ereignis immer
// vor allen anderen Promise-Jobs ausgelöst wird.

DataHandler.prototype.load = async function load(key) {
  const hit = this._cache.get(key);
  if (hit !== undefined) {
    queueMicrotask(() => {
      this.emit('load', hit);
    });
    return;
  }

  const data = await fetchData(key);
  this._cache.set(key, data);
  this.emit('load', data);
};
```
## Klasse: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`ReadableByteStreamController`](/de/nodejs/api/webstreams#class-readablebytestreamcontroller).


## Klasse: `ReadableStream` {#class-readablestream}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`ReadableStream`](/de/nodejs/api/webstreams#class-readablestream).

## Klasse: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`ReadableStreamBYOBReader`](/de/nodejs/api/webstreams#class-readablestreambyobreader).

## Klasse: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`ReadableStreamBYOBRequest`](/de/nodejs/api/webstreams#class-readablestreambyobrequest).

## Klasse: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`ReadableStreamDefaultController`](/de/nodejs/api/webstreams#class-readablestreamdefaultcontroller).

## Klasse: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`ReadableStreamDefaultReader`](/de/nodejs/api/webstreams#class-readablestreamdefaultreader).

## `require()` {#require}

Diese Variable scheint global zu sein, ist es aber nicht. Siehe [`require()`](/de/nodejs/api/modules#requireid).

## `Response` {#response}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.0.0 | Nicht mehr experimentell. |
| v18.0.0 | Nicht mehr hinter dem CLI-Flag `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Hinzugefügt in: v17.5.0, v16.15.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Eine browserkompatible Implementierung von [\<Response\>](https://developer.mozilla.org/en-US/docs/Web/API/Response).


## `Request` {#request}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v21.0.0 | Nicht mehr experimentell. |
| v18.0.0 | Nicht mehr hinter dem `--experimental-fetch` CLI-Flag. |
| v17.5.0, v16.15.0 | Hinzugefügt in: v17.5.0, v16.15.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Eine browserkompatible Implementierung von [\<Request\>](https://developer.mozilla.org/en-US/docs/Web/API/Request).

## `sessionStorage` {#sessionstorage}

**Hinzugefügt in: v22.4.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).0 - Frühe Entwicklung.
:::

Eine browserkompatible Implementierung von [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage). Daten werden im Speicher gespeichert, mit einem Speicherkontingent von 10 MB. `sessionStorage`-Daten bleiben nur innerhalb des aktuell laufenden Prozesses erhalten und werden nicht zwischen Workern ausgetauscht.

## `setImmediate(callback[, ...args])` {#setimmediatecallback-args}

**Hinzugefügt in: v0.9.1**

[`setImmediate`](/de/nodejs/api/timers#setimmediatecallback-args) wird im Abschnitt [timers](/de/nodejs/api/timers) beschrieben.

## `setInterval(callback, delay[, ...args])` {#setintervalcallback-delay-args}

**Hinzugefügt in: v0.0.1**

[`setInterval`](/de/nodejs/api/timers#setintervalcallback-delay-args) wird im Abschnitt [timers](/de/nodejs/api/timers) beschrieben.

## `setTimeout(callback, delay[, ...args])` {#settimeoutcallback-delay-args}

**Hinzugefügt in: v0.0.1**

[`setTimeout`](/de/nodejs/api/timers#settimeoutcallback-delay-args) wird im Abschnitt [timers](/de/nodejs/api/timers) beschrieben.

## Class: `Storage` {#class-storage}

**Hinzugefügt in: v22.4.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).0 - Frühe Entwicklung.
:::

Eine browserkompatible Implementierung von [`Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage). Aktivieren Sie diese API mit dem [`--experimental-webstorage`](/de/nodejs/api/cli#--experimental-webstorage) CLI-Flag.

## `structuredClone(value[, options])` {#structuredclonevalue-options}

**Hinzugefügt in: v17.0.0**

Die WHATWG [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) Methode.


## `SubtleCrypto` {#subtlecrypto}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Nicht mehr hinter dem CLI-Flag `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Hinzugefügt in: v17.6.0, v16.15.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil.
:::

Eine browserkompatible Implementierung von [\<SubtleCrypto\>](/de/nodejs/api/webcrypto#class-subtlecrypto). Diese globale Variable ist nur verfügbar, wenn die Node.js-Binärdatei mit Unterstützung für das `node:crypto`-Modul kompiliert wurde.

## `DOMException` {#domexception}

**Hinzugefügt in: v17.0.0**

Die WHATWG `DOMException`-Klasse. Weitere Informationen finden Sie unter [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException).

## `TextDecoder` {#textdecoder}

**Hinzugefügt in: v11.0.0**

Die WHATWG `TextDecoder`-Klasse. Siehe den Abschnitt [`TextDecoder`](/de/nodejs/api/util#class-utiltextdecoder).

## Klasse: `TextDecoderStream` {#class-textdecoderstream}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`TextDecoderStream`](/de/nodejs/api/webstreams#class-textdecoderstream).

## `TextEncoder` {#textencoder}

**Hinzugefügt in: v11.0.0**

Die WHATWG `TextEncoder`-Klasse. Siehe den Abschnitt [`TextEncoder`](/de/nodejs/api/util#class-utiltextencoder).

## Klasse: `TextEncoderStream` {#class-textencoderstream}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`TextEncoderStream`](/de/nodejs/api/webstreams#class-textencoderstream).

## Klasse: `TransformStream` {#class-transformstream}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`TransformStream`](/de/nodejs/api/webstreams#class-transformstream).

## Klasse: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`TransformStreamDefaultController`](/de/nodejs/api/webstreams#class-transformstreamdefaultcontroller).


## `URL` {#url}

**Hinzugefügt in: v10.0.0**

Die WHATWG `URL`-Klasse. Siehe den Abschnitt [`URL`](/de/nodejs/api/url#class-url).

## `URLSearchParams` {#urlsearchparams}

**Hinzugefügt in: v10.0.0**

Die WHATWG `URLSearchParams`-Klasse. Siehe den Abschnitt [`URLSearchParams`](/de/nodejs/api/url#class-urlsearchparams).

## `WebAssembly` {#webassembly}

**Hinzugefügt in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Das Objekt, das als Namensraum für alle W3C [WebAssembly](https://webassembly.org/) bezogenen Funktionalitäten dient. Siehe das [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/WebAssembly) für Nutzung und Kompatibilität.

## `WebSocket` {#websocket}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.4.0 | Nicht mehr experimentell. |
| v22.0.0 | Nicht mehr hinter dem CLI-Flag `--experimental-websocket`. |
| v21.0.0, v20.10.0 | Hinzugefügt in: v21.0.0, v20.10.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil.
:::

Eine browserkompatible Implementierung von [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket). Deaktivieren Sie diese API mit dem CLI-Flag [`--no-experimental-websocket`](/de/nodejs/api/cli#--no-experimental-websocket).

## Klasse: `WritableStream` {#class-writablestream}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`WritableStream`](/de/nodejs/api/webstreams#class-writablestream).

## Klasse: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`WritableStreamDefaultController`](/de/nodejs/api/webstreams#class-writablestreamdefaultcontroller).

## Klasse: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}

**Hinzugefügt in: v18.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell.
:::

Eine browserkompatible Implementierung von [`WritableStreamDefaultWriter`](/de/nodejs/api/webstreams#class-writablestreamdefaultwriter).

