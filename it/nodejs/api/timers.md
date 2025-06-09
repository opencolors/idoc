---
title: Documentazione dell'API Timer di Node.js
description: Il modulo Timer di Node.js fornisce funzioni per pianificare l'esecuzione di funzioni in un momento futuro. Include metodi come setTimeout, setInterval, setImmediate e i loro equivalenti di cancellazione, oltre a process.nextTick per eseguire codice nella prossima iterazione del ciclo degli eventi.
head:
  - - meta
    - name: og:title
      content: Documentazione dell'API Timer di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo Timer di Node.js fornisce funzioni per pianificare l'esecuzione di funzioni in un momento futuro. Include metodi come setTimeout, setInterval, setImmediate e i loro equivalenti di cancellazione, oltre a process.nextTick per eseguire codice nella prossima iterazione del ciclo degli eventi.
  - - meta
    - name: twitter:title
      content: Documentazione dell'API Timer di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo Timer di Node.js fornisce funzioni per pianificare l'esecuzione di funzioni in un momento futuro. Include metodi come setTimeout, setInterval, setImmediate e i loro equivalenti di cancellazione, oltre a process.nextTick per eseguire codice nella prossima iterazione del ciclo degli eventi.
---


# Timer {#timers}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/timers.js](https://github.com/nodejs/node/blob/v23.5.0/lib/timers.js)

Il modulo `timer` espone un'API globale per la pianificazione di funzioni da chiamare in un momento futuro. Poiché le funzioni del timer sono globali, non è necessario chiamare `require('node:timers')` per utilizzare l'API.

Le funzioni del timer all'interno di Node.js implementano un'API simile all'API dei timer fornita dai browser Web, ma utilizzano un'implementazione interna diversa che è costruita attorno al [Ciclo di eventi](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) di Node.js.

## Classe: `Immediate` {#class-immediate}

Questo oggetto viene creato internamente e viene restituito da [`setImmediate()`](/it/nodejs/api/timers#setimmediatecallback-args). Può essere passato a [`clearImmediate()`](/it/nodejs/api/timers#clearimmediateimmediate) per annullare le azioni pianificate.

Per impostazione predefinita, quando viene pianificato un immediate, il ciclo di eventi di Node.js continuerà a essere eseguito finché l'immediate è attivo. L'oggetto `Immediate` restituito da [`setImmediate()`](/it/nodejs/api/timers#setimmediatecallback-args) esporta entrambe le funzioni `immediate.ref()` e `immediate.unref()` che possono essere utilizzate per controllare questo comportamento predefinito.

### `immediate.hasRef()` {#immediatehasref}

**Aggiunto in: v11.0.0**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se true, l'oggetto `Immediate` manterrà attivo il ciclo di eventi di Node.js.

### `immediate.ref()` {#immediateref}

**Aggiunto in: v9.7.0**

- Restituisce: [\<Immediate\>](/it/nodejs/api/timers#class-immediate) un riferimento a `immediate`

Quando viene chiamata, richiede che il ciclo di eventi di Node.js *non* si chiuda fintanto che l'`Immediate` è attivo. Chiamare `immediate.ref()` più volte non avrà alcun effetto.

Per impostazione predefinita, tutti gli oggetti `Immediate` sono "ref'ed", rendendo normalmente non necessario chiamare `immediate.ref()` a meno che `immediate.unref()` non sia stato chiamato in precedenza.


### `immediate.unref()` {#immediateunref}

**Aggiunto in: v9.7.0**

- Restituisce: [\<Immediate\>](/it/nodejs/api/timers#class-immediate) un riferimento a `immediate`

Quando viene chiamato, l'oggetto `Immediate` attivo non richiederà che il ciclo di eventi di Node.js rimanga attivo. Se non ci sono altre attività che mantengono in esecuzione il ciclo di eventi, il processo potrebbe terminare prima che venga invocato il callback dell'oggetto `Immediate`. Chiamare `immediate.unref()` più volte non avrà alcun effetto.

### `immediate[Symbol.dispose]()` {#immediatesymboldispose}

**Aggiunto in: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Annulla l'immediate. Questo è simile alla chiamata a `clearImmediate()`.

## Classe: `Timeout` {#class-timeout}

Questo oggetto viene creato internamente e viene restituito da [`setTimeout()`](/it/nodejs/api/timers#settimeoutcallback-delay-args) e [`setInterval()`](/it/nodejs/api/timers#setintervalcallback-delay-args). Può essere passato a [`clearTimeout()`](/it/nodejs/api/timers#cleartimeouttimeout) o [`clearInterval()`](/it/nodejs/api/timers#clearintervaltimeout) per annullare le azioni pianificate.

Per impostazione predefinita, quando un timer viene pianificato utilizzando [`setTimeout()`](/it/nodejs/api/timers#settimeoutcallback-delay-args) o [`setInterval()`](/it/nodejs/api/timers#setintervalcallback-delay-args), il ciclo di eventi di Node.js continuerà a essere eseguito finché il timer è attivo. Ciascuno degli oggetti `Timeout` restituiti da queste funzioni esporta sia le funzioni `timeout.ref()` che `timeout.unref()` che possono essere utilizzate per controllare questo comportamento predefinito.

### `timeout.close()` {#timeoutclose}

**Aggiunto in: v0.9.1**

::: info [Stable: 3 - Legacy]
[Stable: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy: Utilizzare invece [`clearTimeout()`](/it/nodejs/api/timers#cleartimeouttimeout).
:::

- Restituisce: [\<Timeout\>](/it/nodejs/api/timers#class-timeout) un riferimento a `timeout`

Annulla il timeout.

### `timeout.hasRef()` {#timeouthasref}

**Aggiunto in: v11.0.0**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se vero, l'oggetto `Timeout` manterrà attivo il ciclo di eventi di Node.js.


### `timeout.ref()` {#timeoutref}

**Aggiunto in: v0.9.1**

- Restituisce: [\<Timeout\>](/it/nodejs/api/timers#class-timeout) un riferimento a `timeout`

Quando chiamata, richiede che il ciclo di eventi di Node.js *non* si chiuda fintanto che il `Timeout` è attivo. Chiamare `timeout.ref()` più volte non avrà alcun effetto.

Per impostazione predefinita, tutti gli oggetti `Timeout` sono "ref'ed", rendendo normalmente non necessario chiamare `timeout.ref()` a meno che `timeout.unref()` non sia stato chiamato in precedenza.

### `timeout.refresh()` {#timeoutrefresh}

**Aggiunto in: v10.2.0**

- Restituisce: [\<Timeout\>](/it/nodejs/api/timers#class-timeout) un riferimento a `timeout`

Imposta l'ora di inizio del timer all'ora corrente e riprogramma il timer per chiamare la sua callback alla durata specificata in precedenza, adattata all'ora corrente. Questo è utile per aggiornare un timer senza allocare un nuovo oggetto JavaScript.

Usare questo su un timer che ha già chiamato la sua callback riattiverà il timer.

### `timeout.unref()` {#timeoutunref}

**Aggiunto in: v0.9.1**

- Restituisce: [\<Timeout\>](/it/nodejs/api/timers#class-timeout) un riferimento a `timeout`

Quando chiamato, l'oggetto `Timeout` attivo non richiederà che il ciclo di eventi di Node.js rimanga attivo. Se non ci sono altre attività che mantengono attivo il ciclo di eventi, il processo potrebbe terminare prima che venga richiamata la callback dell'oggetto `Timeout`. Chiamare `timeout.unref()` più volte non avrà alcun effetto.

### `timeout[Symbol.toPrimitive]()` {#timeoutsymboltoprimitive}

**Aggiunto in: v14.9.0, v12.19.0**

- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) un numero che può essere usato per fare riferimento a questo `timeout`

Forza un `Timeout` a un primitivo. Il primitivo può essere usato per cancellare il `Timeout`. Il primitivo può essere usato solo nello stesso thread in cui è stato creato il timeout. Pertanto, per usarlo attraverso [`worker_threads`](/it/nodejs/api/worker_threads) deve prima essere passato al thread corretto. Ciò consente una maggiore compatibilità con le implementazioni di `setTimeout()` e `setInterval()` del browser.

### `timeout[Symbol.dispose]()` {#timeoutsymboldispose}

**Aggiunto in: v20.5.0, v18.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Annulla il timeout.


## Pianificazione dei timer {#scheduling-timers}

Un timer in Node.js è un costrutto interno che chiama una determinata funzione dopo un certo periodo di tempo. Il momento in cui viene chiamata la funzione di un timer varia a seconda del metodo utilizzato per creare il timer e del lavoro svolto dal ciclo di eventi di Node.js.

### `setImmediate(callback[, ...args])` {#setimmediatecallback-args}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v0.9.1 | Aggiunto in: v0.9.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione da chiamare alla fine di questo turno del [Ciclo di eventi](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) di Node.js
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argomenti opzionali da passare quando viene chiamata la `callback`.
- Restituisce: [\<Immediate\>](/it/nodejs/api/timers#class-immediate) per l'utilizzo con [`clearImmediate()`](/it/nodejs/api/timers#clearimmediateimmediate)

Pianifica l'esecuzione "immediata" della `callback` dopo le callback degli eventi I/O.

Quando vengono effettuate più chiamate a `setImmediate()`, le funzioni `callback` vengono accodate per l'esecuzione nell'ordine in cui vengono create. L'intera coda di callback viene elaborata a ogni iterazione del ciclo di eventi. Se un timer immediato viene accodato dall'interno di una callback in esecuzione, quel timer non verrà attivato fino alla successiva iterazione del ciclo di eventi.

Se `callback` non è una funzione, verrà generato un [`TypeError`](/it/nodejs/api/errors#class-typeerror).

Questo metodo ha una variante personalizzata per le promise che è disponibile utilizzando [`timersPromises.setImmediate()`](/it/nodejs/api/timers#timerspromisessetimmediatevalue-options).

### `setInterval(callback[, delay[, ...args]])` {#setintervalcallback-delay-args}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v0.0.1 | Aggiunto in: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione da chiamare quando il timer scade.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi da attendere prima di chiamare la `callback`. **Predefinito:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argomenti opzionali da passare quando viene chiamata la `callback`.
- Restituisce: [\<Timeout\>](/it/nodejs/api/timers#class-timeout) per l'utilizzo con [`clearInterval()`](/it/nodejs/api/timers#clearintervaltimeout)

Pianifica l'esecuzione ripetuta di `callback` ogni `delay` millisecondi.

Quando `delay` è maggiore di `2147483647` o inferiore a `1` o `NaN`, `delay` verrà impostato su `1`. I ritardi non interi vengono troncati a un intero.

Se `callback` non è una funzione, verrà generato un [`TypeError`](/it/nodejs/api/errors#class-typeerror).

Questo metodo ha una variante personalizzata per le promise che è disponibile utilizzando [`timersPromises.setInterval()`](/it/nodejs/api/timers#timerspromisessetintervaldelay-value-options).


### `setTimeout(callback[, delay[, ...args]])` {#settimeoutcallback-delay-args}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v0.0.1 | Aggiunto in: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione da chiamare quando il timer scade.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi da attendere prima di chiamare la `callback`. **Predefinito:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argomenti opzionali da passare quando viene chiamata la `callback`.
- Restituisce: [\<Timeout\>](/it/nodejs/api/timers#class-timeout) per l'uso con [`clearTimeout()`](/it/nodejs/api/timers#cleartimeouttimeout)

Pianifica l'esecuzione di una `callback` una tantum dopo `delay` millisecondi.

È probabile che la `callback` non venga richiamata esattamente dopo `delay` millisecondi. Node.js non fornisce garanzie sui tempi esatti di attivazione delle callback, né sul loro ordine. La callback verrà chiamata il più vicino possibile all'ora specificata.

Quando `delay` è maggiore di `2147483647` o inferiore a `1` o `NaN`, il `delay` verrà impostato su `1`. I ritardi non interi vengono troncati a un intero.

Se `callback` non è una funzione, verrà generato un [`TypeError`](/it/nodejs/api/errors#class-typeerror).

Questo metodo ha una variante personalizzata per le promise disponibile tramite [`timersPromises.setTimeout()`](/it/nodejs/api/timers#timerspromisessettimeoutdelay-value-options).

## Annullamento dei timer {#cancelling-timers}

I metodi [`setImmediate()`](/it/nodejs/api/timers#setimmediatecallback-args), [`setInterval()`](/it/nodejs/api/timers#setintervalcallback-delay-args) e [`setTimeout()`](/it/nodejs/api/timers#settimeoutcallback-delay-args) restituiscono ciascuno oggetti che rappresentano i timer pianificati. Questi possono essere utilizzati per annullare il timer e impedirne l'attivazione.

Per le varianti promesse di [`setImmediate()`](/it/nodejs/api/timers#setimmediatecallback-args) e [`setTimeout()`](/it/nodejs/api/timers#settimeoutcallback-delay-args), è possibile utilizzare un [`AbortController`](/it/nodejs/api/globals#class-abortcontroller) per annullare il timer. Quando viene annullato, le promise restituite verranno rifiutate con un `'AbortError'`.

Per `setImmediate()`:

::: code-group
```js [ESM]
import { setImmediate as setImmediatePromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// Non `await` la promise, quindi `ac.abort()` viene chiamato contemporaneamente.
setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('L'immediate è stato interrotto');
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
      console.error('L'immediate è stato interrotto');
  });

ac.abort();
```
:::

Per `setTimeout()`:

::: code-group
```js [ESM]
import { setTimeout as setTimeoutPromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// Non `await` la promise, quindi `ac.abort()` viene chiamato contemporaneamente.
setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('Il timeout è stato interrotto');
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
      console.error('Il timeout è stato interrotto');
  });

ac.abort();
```
:::


### `clearImmediate(immediate)` {#clearimmediateimmediate}

**Aggiunto in: v0.9.1**

- `immediate` [\<Immediate\>](/it/nodejs/api/timers#class-immediate) Un oggetto `Immediate` come restituito da [`setImmediate()`](/it/nodejs/api/timers#setimmediatecallback-args).

Annulla un oggetto `Immediate` creato da [`setImmediate()`](/it/nodejs/api/timers#setimmediatecallback-args).

### `clearInterval(timeout)` {#clearintervaltimeout}

**Aggiunto in: v0.0.1**

- `timeout` [\<Timeout\>](/it/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un oggetto `Timeout` come restituito da [`setInterval()`](/it/nodejs/api/timers#setintervalcallback-delay-args) o il [primitivo](/it/nodejs/api/timers#timeoutsymboltoprimitive) dell'oggetto `Timeout` come stringa o numero.

Annulla un oggetto `Timeout` creato da [`setInterval()`](/it/nodejs/api/timers#setintervalcallback-delay-args).

### `clearTimeout(timeout)` {#cleartimeouttimeout}

**Aggiunto in: v0.0.1**

- `timeout` [\<Timeout\>](/it/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un oggetto `Timeout` come restituito da [`setTimeout()`](/it/nodejs/api/timers#settimeoutcallback-delay-args) o il [primitivo](/it/nodejs/api/timers#timeoutsymboltoprimitive) dell'oggetto `Timeout` come stringa o numero.

Annulla un oggetto `Timeout` creato da [`setTimeout()`](/it/nodejs/api/timers#settimeoutcallback-delay-args).

## API Timer basate su Promise {#timers-promises-api}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | Uscito dalla fase sperimentale. |
| v15.0.0 | Aggiunto in: v15.0.0 |
:::

L'API `timers/promises` fornisce un set alternativo di funzioni timer che restituiscono oggetti `Promise`. L'API è accessibile tramite `require('node:timers/promises')`.

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

**Aggiunto in: v15.0.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi da attendere prima di soddisfare la promise. **Predefinito:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Un valore con cui la promise viene soddisfatta.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Imposta su `false` per indicare che il `Timeout` pianificato non dovrebbe richiedere che il ciclo di eventi di Node.js rimanga attivo. **Predefinito:** `true`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Un `AbortSignal` opzionale che può essere utilizzato per annullare il `Timeout` pianificato.





::: code-group
```js [ESM]
import {
  setTimeout,
} from 'node:timers/promises';

const res = await setTimeout(100, 'result');

console.log(res);  // Stampa 'result'
```

```js [CJS]
const {
  setTimeout,
} = require('node:timers/promises');

setTimeout(100, 'result').then((res) => {
  console.log(res);  // Stampa 'result'
});
```
:::

### `timersPromises.setImmediate([value[, options]])` {#timerspromisessetimmediatevalue-options}

**Aggiunto in: v15.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Un valore con cui la promise viene soddisfatta.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Imposta su `false` per indicare che l'`Immediate` pianificato non dovrebbe richiedere che il ciclo di eventi di Node.js rimanga attivo. **Predefinito:** `true`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Un `AbortSignal` opzionale che può essere utilizzato per annullare l'`Immediate` pianificato.





::: code-group
```js [ESM]
import {
  setImmediate,
} from 'node:timers/promises';

const res = await setImmediate('result');

console.log(res);  // Stampa 'result'
```

```js [CJS]
const {
  setImmediate,
} = require('node:timers/promises');

setImmediate('result').then((res) => {
  console.log(res);  // Stampa 'result'
});
```
:::


### `timersPromises.setInterval([delay[, value[, options]]])` {#timerspromisessetintervaldelay-value-options}

**Aggiunto in: v15.9.0**

Restituisce un iteratore asincrono che genera valori in un intervallo di `delay` ms. Se `ref` è `true`, è necessario chiamare `next()` dell'iteratore asincrono esplicitamente o implicitamente per mantenere attivo il ciclo di eventi.

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi da attendere tra le iterazioni. **Predefinito:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Un valore con cui l'iteratore restituisce.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Imposta su `false` per indicare che il `Timeout` pianificato tra le iterazioni non dovrebbe richiedere che il ciclo di eventi di Node.js rimanga attivo. **Predefinito:** `true`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Un `AbortSignal` opzionale che può essere utilizzato per annullare il `Timeout` pianificato tra le operazioni.

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

**Aggiunto in: v17.3.0, v16.14.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi da attendere prima di risolvere la promise.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Imposta su `false` per indicare che il `Timeout` pianificato non dovrebbe richiedere che il ciclo di eventi di Node.js rimanga attivo. **Predefinito:** `true`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Un `AbortSignal` opzionale che può essere utilizzato per annullare l'attesa.

- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Un'API sperimentale definita dalla bozza di [Scheduling APIs](https://github.com/WICG/scheduling-apis) in fase di sviluppo come API standard della piattaforma Web.

Chiamare `timersPromises.scheduler.wait(delay, options)` è equivalente a chiamare `timersPromises.setTimeout(delay, undefined, options)`.

```js [ESM]
import { scheduler } from 'node:timers/promises';

await scheduler.wait(1000); // Attendi un secondo prima di continuare
```

### `timersPromises.scheduler.yield()` {#timerspromisesscheduleryield}

**Aggiunto in: v17.3.0, v16.14.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Un'API sperimentale definita dalla bozza di specifica delle [Scheduling APIs](https://github.com/WICG/scheduling-apis) in fase di sviluppo come API standard della piattaforma Web.

Chiamare `timersPromises.scheduler.yield()` equivale a chiamare `timersPromises.setImmediate()` senza argomenti.

