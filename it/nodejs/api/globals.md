---
title: Oggetti globali di Node.js
description: Questa pagina documenta gli oggetti globali disponibili in Node.js, inclusi variabili globali, funzioni e classi accessibili da qualsiasi modulo senza necessità di importazione esplicita.
head:
  - - meta
    - name: og:title
      content: Oggetti globali di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Questa pagina documenta gli oggetti globali disponibili in Node.js, inclusi variabili globali, funzioni e classi accessibili da qualsiasi modulo senza necessità di importazione esplicita.
  - - meta
    - name: twitter:title
      content: Oggetti globali di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Questa pagina documenta gli oggetti globali disponibili in Node.js, inclusi variabili globali, funzioni e classi accessibili da qualsiasi modulo senza necessità di importazione esplicita.
---


# Oggetti globali {#global-objects}

Questi oggetti sono disponibili in tutti i moduli.

Le seguenti variabili potrebbero sembrare globali ma non lo sono. Esistono solo nell'ambito dei [moduli CommonJS](/it/nodejs/api/modules):

- [`__dirname`](/it/nodejs/api/modules#__dirname)
- [`__filename`](/it/nodejs/api/modules#__filename)
- [`exports`](/it/nodejs/api/modules#exports)
- [`module`](/it/nodejs/api/modules#module)
- [`require()`](/it/nodejs/api/modules#requireid)

Gli oggetti elencati qui sono specifici di Node.js. Esistono [oggetti incorporati](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects) che fanno parte del linguaggio JavaScript stesso, che sono anche accessibili globalmente.

## Classe: `AbortController` {#class-abortcontroller}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.4.0 | Non è più sperimentale. |
| v15.0.0, v14.17.0 | Aggiunto in: v15.0.0, v14.17.0 |
:::

Una classe di utilità utilizzata per segnalare l'annullamento in API basate su `Promise` selezionate. L'API è basata sull'API Web [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

```js [ESM]
const ac = new AbortController();

ac.signal.addEventListener('abort', () => console.log('Aborted!'),
                           { once: true });

ac.abort();

console.log(ac.signal.aborted);  // Stampa true
```
### `abortController.abort([reason])` {#abortcontrollerabortreason}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.2.0, v16.14.0 | Aggiunto il nuovo argomento reason opzionale. |
| v15.0.0, v14.17.0 | Aggiunto in: v15.0.0, v14.17.0 |
:::

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Un motivo facoltativo, recuperabile nella proprietà `reason` di `AbortSignal`.

Attiva il segnale di interruzione, facendo in modo che `abortController.signal` emetta l'evento `'abort'`.

### `abortController.signal` {#abortcontrollersignal}

**Aggiunto in: v15.0.0, v14.17.0**

- Tipo: [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal)

### Classe: `AbortSignal` {#class-abortsignal}

**Aggiunto in: v15.0.0, v14.17.0**

- Estende: [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget)

`AbortSignal` viene utilizzato per avvisare gli osservatori quando viene chiamato il metodo `abortController.abort()`.


#### Metodo statico: `AbortSignal.abort([reason])` {#static-method-abortsignalabortreason}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.2.0, v16.14.0 | Aggiunto il nuovo argomento opzionale reason. |
| v15.12.0, v14.17.0 | Aggiunto in: v15.12.0, v14.17.0 |
:::

- `reason`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal)

Restituisce un nuovo `AbortSignal` già interrotto.

#### Metodo statico: `AbortSignal.timeout(delay)` {#static-method-abortsignaltimeoutdelay}

**Aggiunto in: v17.3.0, v16.14.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi da attendere prima di attivare AbortSignal.

Restituisce un nuovo `AbortSignal` che verrà interrotto dopo `delay` millisecondi.

#### Metodo statico: `AbortSignal.any(signals)` {#static-method-abortsignalanysignals}

**Aggiunto in: v20.3.0, v18.17.0**

- `signals` [\<AbortSignal[]\>](/it/nodejs/api/globals#class-abortsignal) Gli `AbortSignal` da cui comporre un nuovo `AbortSignal`.

Restituisce un nuovo `AbortSignal` che verrà interrotto se uno qualsiasi dei segnali forniti viene interrotto. Il suo [`abortSignal.reason`](/it/nodejs/api/globals#abortsignalreason) sarà impostato su quello dei `signals` che ne ha causato l'interruzione.

#### Evento: `'abort'` {#event-abort}

**Aggiunto in: v15.0.0, v14.17.0**

L'evento `'abort'` viene emesso quando viene chiamato il metodo `abortController.abort()`. La callback viene invocata con un singolo argomento oggetto con una singola proprietà `type` impostata su `'abort'`:

```js [ESM]
const ac = new AbortController();

// Usa la proprietà onabort...
ac.signal.onabort = () => console.log('interrotto!');

// Oppure l'API EventTarget...
ac.signal.addEventListener('abort', (event) => {
  console.log(event.type);  // Stampa 'abort'
}, { once: true });

ac.abort();
```
L'`AbortController` a cui è associato l'`AbortSignal` attiverà l'evento `'abort'` una sola volta. Si consiglia che il codice verifichi che l'attributo `abortSignal.aborted` sia `false` prima di aggiungere un listener dell'evento `'abort'`.

Qualsiasi listener di eventi collegato all'`AbortSignal` deve utilizzare l'opzione `{ once: true }` (oppure, se si utilizzano le API `EventEmitter` per collegare un listener, utilizzare il metodo `once()`) per garantire che il listener di eventi venga rimosso non appena viene gestito l'evento `'abort'`. In caso contrario, potrebbero verificarsi perdite di memoria.


#### `abortSignal.aborted` {#abortsignalaborted}

**Aggiunto in: v15.0.0, v14.17.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) True dopo che `AbortController` è stato interrotto.

#### `abortSignal.onabort` {#abortsignalonabort}

**Aggiunto in: v15.0.0, v14.17.0**

- Tipo: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Una funzione di callback opzionale che può essere impostata dal codice utente per essere notificata quando la funzione `abortController.abort()` è stata chiamata.

#### `abortSignal.reason` {#abortsignalreason}

**Aggiunto in: v17.2.0, v16.14.0**

- Tipo: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Una motivazione opzionale specificata quando è stato attivato `AbortSignal`.

```js [ESM]
const ac = new AbortController();
ac.abort(new Error('boom!'));
console.log(ac.signal.reason);  // Error: boom!
```
#### `abortSignal.throwIfAborted()` {#abortsignalthrowifaborted}

**Aggiunto in: v17.3.0, v16.17.0**

Se `abortSignal.aborted` è `true`, lancia `abortSignal.reason`.

## Classe: `Blob` {#class-blob}

**Aggiunto in: v18.0.0**

Vedi [\<Blob\>](/it/nodejs/api/buffer#class-blob).

## Classe: `Buffer` {#class-buffer}

**Aggiunto in: v0.1.103**

- [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Utilizzato per gestire dati binari. Vedi la [sezione buffer](/it/nodejs/api/buffer).

## Classe: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}

**Aggiunto in: v18.0.0**

::: warning [Stable: 1 - Sperimentale]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`ByteLengthQueuingStrategy`](/it/nodejs/api/webstreams#class-bytelengthqueuingstrategy).

## `__dirname` {#__dirname}

Questa variabile può sembrare globale ma non lo è. Vedi [`__dirname`](/it/nodejs/api/modules#__dirname).

## `__filename` {#__filename}

Questa variabile può sembrare globale ma non lo è. Vedi [`__filename`](/it/nodejs/api/modules#__filename).

## `atob(data)` {#atobdata}

**Aggiunto in: v16.0.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy. Utilizza invece `Buffer.from(data, 'base64')`.
:::

Alias globale per [`buffer.atob()`](/it/nodejs/api/buffer#bufferatobdata).


## `BroadcastChannel` {#broadcastchannel}

**Aggiunto in: v18.0.0**

Vedi [\<BroadcastChannel\>](/it/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget).

## `btoa(data)` {#btoadata}

**Aggiunto in: v16.0.0**

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy. Usa `buf.toString('base64')` invece.
:::

Alias globale per [`buffer.btoa()`](/it/nodejs/api/buffer#bufferbtoadata).

## `clearImmediate(immediateObject)` {#clearimmediateimmediateobject}

**Aggiunto in: v0.9.1**

[`clearImmediate`](/it/nodejs/api/timers#clearimmediateimmediate) è descritto nella sezione [timers](/it/nodejs/api/timers).

## `clearInterval(intervalObject)` {#clearintervalintervalobject}

**Aggiunto in: v0.0.1**

[`clearInterval`](/it/nodejs/api/timers#clearintervaltimeout) è descritto nella sezione [timers](/it/nodejs/api/timers).

## `clearTimeout(timeoutObject)` {#cleartimeouttimeoutobject}

**Aggiunto in: v0.0.1**

[`clearTimeout`](/it/nodejs/api/timers#cleartimeouttimeout) è descritto nella sezione [timers](/it/nodejs/api/timers).

## `CloseEvent` {#closeevent}

**Aggiunto in: v23.0.0**

La classe `CloseEvent`. Vedi [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent) per maggiori dettagli.

Un'implementazione compatibile con il browser di [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent). Disabilita questa API con il flag CLI [`--no-experimental-websocket`](/it/nodejs/api/cli#--no-experimental-websocket).

## Classe: `CompressionStream` {#class-compressionstream}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`CompressionStream`](/it/nodejs/api/webstreams#class-compressionstream).

## `console` {#console}

**Aggiunto in: v0.1.100**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Usato per stampare su stdout e stderr. Vedi la sezione [`console`](/it/nodejs/api/console).

## Classe: `CountQueuingStrategy` {#class-countqueuingstrategy}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`CountQueuingStrategy`](/it/nodejs/api/webstreams#class-countqueuingstrategy).


## `Crypto` {#crypto}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Non più sperimentale. |
| v19.0.0 | Non più dietro il flag CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Aggiunto in: v17.6.0, v16.15.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile.
:::

Un'implementazione compatibile con il browser di [\<Crypto\>](/it/nodejs/api/webcrypto#class-crypto). Questa variabile globale è disponibile solo se il binario di Node.js è stato compilato includendo il supporto per il modulo `node:crypto`.

## `crypto` {#crypto_1}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Non più sperimentale. |
| v19.0.0 | Non più dietro il flag CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Aggiunto in: v17.6.0, v16.15.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile.
:::

Un'implementazione compatibile con il browser della [Web Crypto API](/it/nodejs/api/webcrypto).

## `CryptoKey` {#cryptokey}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Non più sperimentale. |
| v19.0.0 | Non più dietro il flag CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Aggiunto in: v17.6.0, v16.15.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile.
:::

Un'implementazione compatibile con il browser di [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey). Questa variabile globale è disponibile solo se il binario di Node.js è stato compilato includendo il supporto per il modulo `node:crypto`.

## `CustomEvent` {#customevent}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Non più sperimentale. |
| v22.1.0, v20.13.0 | CustomEvent è ora stabile. |
| v19.0.0 | Non più dietro il flag CLI `--experimental-global-customevent`. |
| v18.7.0, v16.17.0 | Aggiunto in: v18.7.0, v16.17.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Un'implementazione compatibile con il browser della [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent).


## Classe: `DecompressionStream` {#class-decompressionstream}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabile: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`DecompressionStream`](/it/nodejs/api/webstreams#class-decompressionstream).

## `Event` {#event}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.4.0 | Non più sperimentale. |
| v15.0.0 | Aggiunto in: v15.0.0 |
:::

Un'implementazione compatibile con il browser della classe `Event`. Vedi API [`EventTarget` e `Event`](/it/nodejs/api/events#eventtarget-and-event-api) per maggiori dettagli.

## `EventSource` {#eventsource}

**Aggiunto in: v22.3.0, v20.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabile: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale. Abilita questa API con il flag CLI [`--experimental-eventsource`](/it/nodejs/api/cli#--experimental-eventsource).
:::

Un'implementazione compatibile con il browser della classe [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource).

## `EventTarget` {#eventtarget}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.4.0 | Non più sperimentale. |
| v15.0.0 | Aggiunto in: v15.0.0 |
:::

Un'implementazione compatibile con il browser della classe `EventTarget`. Vedi API [`EventTarget` e `Event`](/it/nodejs/api/events#eventtarget-and-event-api) per maggiori dettagli.

## `exports` {#exports}

Questa variabile potrebbe sembrare globale ma non lo è. Vedi [`exports`](/it/nodejs/api/modules#exports).

## `fetch` {#fetch}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0 | Non più sperimentale. |
| v18.0.0 | Non più dietro il flag CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Aggiunto in: v17.5.0, v16.15.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabile: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Un'implementazione compatibile con il browser della funzione [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch).

## Classe: `File` {#class-file}

**Aggiunto in: v20.0.0**

Vedi [\<File\>](/it/nodejs/api/buffer#class-file).


## Classe `FormData` {#class-formdata}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0 | Non più sperimentale. |
| v18.0.0 | Non più dietro il flag CLI `--experimental-fetch`. |
| v17.6.0, v16.15.0 | Aggiunto in: v17.6.0, v16.15.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Un'implementazione compatibile con il browser di [\<FormData\>](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

## `global` {#global}

**Aggiunto in: v0.1.27**

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy. Utilizzare invece [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis).
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'oggetto namespace globale.

Nei browser, l'ambito di livello superiore è tradizionalmente l'ambito globale. Ciò significa che `var something` definirà una nuova variabile globale, ad eccezione dei moduli ECMAScript. In Node.js, è diverso. L'ambito di livello superiore non è l'ambito globale; `var something` all'interno di un modulo Node.js sarà locale a quel modulo, indipendentemente dal fatto che si tratti di un [modulo CommonJS](/it/nodejs/api/modules) o di un [modulo ECMAScript](/it/nodejs/api/esm).

## Classe `Headers` {#class-headers}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0 | Non più sperimentale. |
| v18.0.0 | Non più dietro il flag CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Aggiunto in: v17.5.0, v16.15.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Un'implementazione compatibile con il browser di [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers).

## `localStorage` {#localstorage}

**Aggiunto in: v22.4.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sviluppo iniziale.
:::

Un'implementazione compatibile con il browser di [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). I dati vengono archiviati non crittografati nel file specificato dal flag CLI [`--localstorage-file`](/it/nodejs/api/cli#--localstorage-filefile). La quantità massima di dati che può essere archiviata è di 10 MB. Qualsiasi modifica di questi dati al di fuori dell'API Web Storage non è supportata. Abilita questa API con il flag CLI [`--experimental-webstorage`](/it/nodejs/api/cli#--experimental-webstorage). I dati `localStorage` non vengono archiviati per utente o per richiesta quando vengono utilizzati nel contesto di un server, ma vengono condivisi tra tutti gli utenti e le richieste.


## `MessageChannel` {#messagechannel}

**Aggiunto in: v15.0.0**

La classe `MessageChannel`. Vedi [`MessageChannel`](/it/nodejs/api/worker_threads#class-messagechannel) per maggiori dettagli.

## `MessageEvent` {#messageevent}

**Aggiunto in: v15.0.0**

La classe `MessageEvent`. Vedi [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/MessageEvent) per maggiori dettagli.

## `MessagePort` {#messageport}

**Aggiunto in: v15.0.0**

La classe `MessagePort`. Vedi [`MessagePort`](/it/nodejs/api/worker_threads#class-messageport) per maggiori dettagli.

## `module` {#module}

Questa variabile può sembrare globale ma non lo è. Vedi [`module`](/it/nodejs/api/modules#module).

## `Navigator` {#navigator}

**Aggiunto in: v21.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo. Disabilita questa API con il flag CLI [`--no-experimental-global-navigator`](/it/nodejs/api/cli#--no-experimental-global-navigator).
:::

Un'implementazione parziale della [Navigator API](https://html.spec.whatwg.org/multipage/system-state#the-navigator-object).

## `navigator` {#navigator_1}

**Aggiunto in: v21.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo. Disabilita questa API con il flag CLI [`--no-experimental-global-navigator`](/it/nodejs/api/cli#--no-experimental-global-navigator).
:::

Un'implementazione parziale di [`window.navigator`](https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator).

### `navigator.hardwareConcurrency` {#navigatorhardwareconcurrency}

**Aggiunto in: v21.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La proprietà `navigator.hardwareConcurrency` di sola lettura restituisce il numero di processori logici disponibili per l'istanza Node.js corrente.

```js [ESM]
console.log(`Questo processo è in esecuzione su ${navigator.hardwareConcurrency} processori logici`);
```
### `navigator.language` {#navigatorlanguage}

**Aggiunto in: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà `navigator.language` di sola lettura restituisce una stringa che rappresenta la lingua preferita dell'istanza Node.js. La lingua sarà determinata dalla libreria ICU utilizzata da Node.js in fase di esecuzione in base alla lingua predefinita del sistema operativo.

Il valore rappresenta la versione della lingua come definita in [RFC 5646](https://www.rfc-editor.org/rfc/rfc5646.txt).

Il valore di fallback nelle build senza ICU è `'en-US'`.

```js [ESM]
console.log(`La lingua preferita dell'istanza Node.js ha il tag '${navigator.language}'`);
```

### `navigator.languages` {#navigatorlanguages}

**Aggiunto in: v21.2.0**

- {Array

La proprietà di sola lettura `navigator.languages` restituisce un array di stringhe che rappresentano le lingue preferite dell'istanza Node.js. Per impostazione predefinita, `navigator.languages` contiene solo il valore di `navigator.language`, che verrà determinato dalla libreria ICU utilizzata da Node.js in fase di esecuzione in base alla lingua predefinita del sistema operativo.

Il valore di fallback nelle build senza ICU è `['en-US']`.

```js [ESM]
console.log(`Le lingue preferite sono '${navigator.languages}'`);
```
### `navigator.platform` {#navigatorplatform}

**Aggiunto in: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà di sola lettura `navigator.platform` restituisce una stringa che identifica la piattaforma su cui è in esecuzione l'istanza Node.js.

```js [ESM]
console.log(`Questo processo è in esecuzione su ${navigator.platform}`);
```
### `navigator.userAgent` {#navigatoruseragent}

**Aggiunto in: v21.1.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà di sola lettura `navigator.userAgent` restituisce lo user agent costituito dal nome del runtime e dal numero di versione principale.

```js [ESM]
console.log(`Lo user-agent è ${navigator.userAgent}`); // Stampa "Node.js/21"
```
## `PerformanceEntry` {#performanceentry}

**Aggiunto in: v19.0.0**

La classe `PerformanceEntry`. Per maggiori dettagli, consulta [`PerformanceEntry`](/it/nodejs/api/perf_hooks#class-performanceentry).

## `PerformanceMark` {#performancemark}

**Aggiunto in: v19.0.0**

La classe `PerformanceMark`. Per maggiori dettagli, consulta [`PerformanceMark`](/it/nodejs/api/perf_hooks#class-performancemark).

## `PerformanceMeasure` {#performancemeasure}

**Aggiunto in: v19.0.0**

La classe `PerformanceMeasure`. Per maggiori dettagli, consulta [`PerformanceMeasure`](/it/nodejs/api/perf_hooks#class-performancemeasure).

## `PerformanceObserver` {#performanceobserver}

**Aggiunto in: v19.0.0**

La classe `PerformanceObserver`. Per maggiori dettagli, consulta [`PerformanceObserver`](/it/nodejs/api/perf_hooks#class-performanceobserver).

## `PerformanceObserverEntryList` {#performanceobserverentrylist}

**Aggiunto in: v19.0.0**

La classe `PerformanceObserverEntryList`. Per maggiori dettagli, consulta [`PerformanceObserverEntryList`](/it/nodejs/api/perf_hooks#class-performanceobserverentrylist).


## `PerformanceResourceTiming` {#performanceresourcetiming}

**Aggiunto in: v19.0.0**

La classe `PerformanceResourceTiming`. Consulta [`PerformanceResourceTiming`](/it/nodejs/api/perf_hooks#class-performanceresourcetiming) per maggiori dettagli.

## `performance` {#performance}

**Aggiunto in: v16.0.0**

L'oggetto [`perf_hooks.performance`](/it/nodejs/api/perf_hooks#perf_hooksperformance).

## `process` {#process}

**Aggiunto in: v0.1.7**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L'oggetto process. Vedere la sezione [`process` object](/it/nodejs/api/process#process).

## `queueMicrotask(callback)` {#queuemicrotaskcallback}

**Aggiunto in: v11.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione da accodare.

Il metodo `queueMicrotask()` accoda una microtask per invocare `callback`. Se `callback` genera un'eccezione, verrà emesso l'evento [`process` object](/it/nodejs/api/process#process) `'uncaughtException'`.

La coda microtask è gestita da V8 e può essere utilizzata in modo simile alla coda [`process.nextTick()`](/it/nodejs/api/process#processnexttickcallback-args), che è gestita da Node.js. La coda `process.nextTick()` viene sempre elaborata prima della coda microtask all'interno di ogni ciclo dell'event loop di Node.js.

```js [ESM]
// Qui, `queueMicrotask()` viene utilizzato per garantire che l'evento 'load' sia sempre
// emesso in modo asincrono, e quindi coerente. Utilizzando
// `process.nextTick()` qui risulterebbe nell'evento 'load' sempre emesso
// prima di qualsiasi altro job promise.

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
## Classe: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`ReadableByteStreamController`](/it/nodejs/api/webstreams#class-readablebytestreamcontroller).


## Classe: `ReadableStream` {#class-readablestream}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`ReadableStream`](/it/nodejs/api/webstreams#class-readablestream).

## Classe: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`ReadableStreamBYOBReader`](/it/nodejs/api/webstreams#class-readablestreambyobreader).

## Classe: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`ReadableStreamBYOBRequest`](/it/nodejs/api/webstreams#class-readablestreambyobrequest).

## Classe: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`ReadableStreamDefaultController`](/it/nodejs/api/webstreams#class-readablestreamdefaultcontroller).

## Classe: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`ReadableStreamDefaultReader`](/it/nodejs/api/webstreams#class-readablestreamdefaultreader).

## `require()` {#require}

Questa variabile potrebbe sembrare globale, ma non lo è. Vedere [`require()`](/it/nodejs/api/modules#requireid).

## `Response` {#response}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0 | Non è più sperimentale. |
| v18.0.0 | Non più dietro il flag CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Aggiunto in: v17.5.0, v16.15.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Un'implementazione compatibile con il browser di [\<Response\>](https://developer.mozilla.org/en-US/docs/Web/API/Response).


## `Request` {#request}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0 | Non è più sperimentale. |
| v18.0.0 | Non più dietro il flag CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Aggiunto in: v17.5.0, v16.15.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Un'implementazione compatibile con il browser di [\<Request\>](https://developer.mozilla.org/en-US/docs/Web/API/Request).

## `sessionStorage` {#sessionstorage}

**Aggiunto in: v22.4.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).0 - Sviluppo iniziale.
:::

Un'implementazione compatibile con il browser di [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage). I dati vengono memorizzati in memoria, con una quota di archiviazione di 10 MB. I dati `sessionStorage` persistono solo all'interno del processo in esecuzione e non sono condivisi tra i worker.

## `setImmediate(callback[, ...args])` {#setimmediatecallback-args}

**Aggiunto in: v0.9.1**

[`setImmediate`](/it/nodejs/api/timers#setimmediatecallback-args) è descritto nella sezione [timer](/it/nodejs/api/timers).

## `setInterval(callback, delay[, ...args])` {#setintervalcallback-delay-args}

**Aggiunto in: v0.0.1**

[`setInterval`](/it/nodejs/api/timers#setintervalcallback-delay-args) è descritto nella sezione [timer](/it/nodejs/api/timers).

## `setTimeout(callback, delay[, ...args])` {#settimeoutcallback-delay-args}

**Aggiunto in: v0.0.1**

[`setTimeout`](/it/nodejs/api/timers#settimeoutcallback-delay-args) è descritto nella sezione [timer](/it/nodejs/api/timers).

## Classe: `Storage` {#class-storage}

**Aggiunto in: v22.4.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).0 - Sviluppo iniziale.
:::

Un'implementazione compatibile con il browser di [`Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage). Abilita questa API con il flag CLI [`--experimental-webstorage`](/it/nodejs/api/cli#--experimental-webstorage).

## `structuredClone(value[, options])` {#structuredclonevalue-options}

**Aggiunto in: v17.0.0**

Il metodo WHATWG [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone).


## `SubtleCrypto` {#subtlecrypto}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Non più dietro il flag CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Aggiunto in: v17.6.0, v16.15.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile.
:::

Un'implementazione compatibile con il browser di [\<SubtleCrypto\>](/it/nodejs/api/webcrypto#class-subtlecrypto). Questo globale è disponibile solo se il binario Node.js è stato compilato includendo il supporto per il modulo `node:crypto`.

## `DOMException` {#domexception}

**Aggiunto in: v17.0.0**

La classe WHATWG `DOMException`. Vedere [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException) per maggiori dettagli.

## `TextDecoder` {#textdecoder}

**Aggiunto in: v11.0.0**

La classe WHATWG `TextDecoder`. Vedere la sezione [`TextDecoder`](/it/nodejs/api/util#class-utiltextdecoder).

## Classe: `TextDecoderStream` {#class-textdecoderstream}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`TextDecoderStream`](/it/nodejs/api/webstreams#class-textdecoderstream).

## `TextEncoder` {#textencoder}

**Aggiunto in: v11.0.0**

La classe WHATWG `TextEncoder`. Vedere la sezione [`TextEncoder`](/it/nodejs/api/util#class-utiltextencoder).

## Classe: `TextEncoderStream` {#class-textencoderstream}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`TextEncoderStream`](/it/nodejs/api/webstreams#class-textencoderstream).

## Classe: `TransformStream` {#class-transformstream}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`TransformStream`](/it/nodejs/api/webstreams#class-transformstream).

## Classe: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`TransformStreamDefaultController`](/it/nodejs/api/webstreams#class-transformstreamdefaultcontroller).


## `URL` {#url}

**Aggiunto in: v10.0.0**

La classe WHATWG `URL`. Vedere la sezione [`URL`](/it/nodejs/api/url#class-url).

## `URLSearchParams` {#urlsearchparams}

**Aggiunto in: v10.0.0**

La classe WHATWG `URLSearchParams`. Vedere la sezione [`URLSearchParams`](/it/nodejs/api/url#class-urlsearchparams).

## `WebAssembly` {#webassembly}

**Aggiunto in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L'oggetto che funge da spazio dei nomi per tutte le funzionalità relative a W3C [WebAssembly](https://webassembly.org/). Consultare il [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/WebAssembly) per l'utilizzo e la compatibilità.

## `WebSocket` {#websocket}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.4.0 | Non più sperimentale. |
| v22.0.0 | Non più dietro il flag CLI `--experimental-websocket`. |
| v21.0.0, v20.10.0 | Aggiunto in: v21.0.0, v20.10.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile.
:::

Un'implementazione compatibile con il browser di [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket). Disabilita questa API con il flag CLI [`--no-experimental-websocket`](/it/nodejs/api/cli#--no-experimental-websocket).

## Classe: `WritableStream` {#class-writablestream}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`WritableStream`](/it/nodejs/api/webstreams#class-writablestream).

## Classe: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`WritableStreamDefaultController`](/it/nodejs/api/webstreams#class-writablestreamdefaultcontroller).

## Classe: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}

**Aggiunto in: v18.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale.
:::

Un'implementazione compatibile con il browser di [`WritableStreamDefaultWriter`](/it/nodejs/api/webstreams#class-writablestreamdefaultwriter).

