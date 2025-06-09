---
title: Objetos globales de Node.js
description: Esta página documenta los objetos globales disponibles en Node.js, incluyendo variables globales, funciones y clases que son accesibles desde cualquier módulo sin necesidad de importación explícita.
head:
  - - meta
    - name: og:title
      content: Objetos globales de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta página documenta los objetos globales disponibles en Node.js, incluyendo variables globales, funciones y clases que son accesibles desde cualquier módulo sin necesidad de importación explícita.
  - - meta
    - name: twitter:title
      content: Objetos globales de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta página documenta los objetos globales disponibles en Node.js, incluyendo variables globales, funciones y clases que son accesibles desde cualquier módulo sin necesidad de importación explícita.
---


# Objetos globales {#global-objects}

Estos objetos están disponibles en todos los módulos.

Las siguientes variables pueden parecer globales, pero no lo son. Solo existen en el ámbito de los [módulos CommonJS](/es/nodejs/api/modules):

- [`__dirname`](/es/nodejs/api/modules#__dirname)
- [`__filename`](/es/nodejs/api/modules#__filename)
- [`exports`](/es/nodejs/api/modules#exports)
- [`module`](/es/nodejs/api/modules#module)
- [`require()`](/es/nodejs/api/modules#requireid)

Los objetos enumerados aquí son específicos de Node.js. Hay [objetos incorporados](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects) que forman parte del propio lenguaje JavaScript, que también son accesibles globalmente.

## Clase: `AbortController` {#class-abortcontroller}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.4.0 | Ya no es experimental. |
| v15.0.0, v14.17.0 | Agregado en: v15.0.0, v14.17.0 |
:::

Una clase de utilidad que se utiliza para señalar la cancelación en las API seleccionadas basadas en `Promise`. La API se basa en la API web [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

```js [ESM]
const ac = new AbortController();

ac.signal.addEventListener('abort', () => console.log('Aborted!'),
                           { once: true });

ac.abort();

console.log(ac.signal.aborted);  // Imprime true
```
### `abortController.abort([reason])` {#abortcontrollerabortreason}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.2.0, v16.14.0 | Se agregó el nuevo argumento de razón opcional. |
| v15.0.0, v14.17.0 | Agregado en: v15.0.0, v14.17.0 |
:::

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Una razón opcional, recuperable en la propiedad `reason` de `AbortSignal`.

Activa la señal de anulación, lo que provoca que `abortController.signal` emita el evento `'abort'`.

### `abortController.signal` {#abortcontrollersignal}

**Agregado en: v15.0.0, v14.17.0**

- Tipo: [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal)

### Clase: `AbortSignal` {#class-abortsignal}

**Agregado en: v15.0.0, v14.17.0**

- Se extiende: [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget)

`AbortSignal` se utiliza para notificar a los observadores cuando se llama al método `abortController.abort()`.


#### Método estático: `AbortSignal.abort([reason])` {#static-method-abortsignalabortreason}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.2.0, v16.14.0 | Se agregó el nuevo argumento opcional reason. |
| v15.12.0, v14.17.0 | Agregado en: v15.12.0, v14.17.0 |
:::

- `reason`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal)

Devuelve una nueva `AbortSignal` ya abortada.

#### Método estático: `AbortSignal.timeout(delay)` {#static-method-abortsignaltimeoutdelay}

**Agregado en: v17.3.0, v16.14.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos a esperar antes de activar AbortSignal.

Devuelve una nueva `AbortSignal` que se abortará en `delay` milisegundos.

#### Método estático: `AbortSignal.any(signals)` {#static-method-abortsignalanysignals}

**Agregado en: v20.3.0, v18.17.0**

- `signals` [\<AbortSignal[]\>](/es/nodejs/api/globals#class-abortsignal) Las `AbortSignal`s de las cuales componer una nueva `AbortSignal`.

Devuelve una nueva `AbortSignal` que se abortará si alguna de las señales proporcionadas se aborta. Su [`abortSignal.reason`](/es/nodejs/api/globals#abortsignalreason) se establecerá en la que causó que se abortara de las `signals`.

#### Evento: `'abort'` {#event-abort}

**Agregado en: v15.0.0, v14.17.0**

El evento `'abort'` se emite cuando se llama al método `abortController.abort()`. La función de devolución de llamada se invoca con un único argumento de objeto con una única propiedad `type` establecida en `'abort'`:

```js [ESM]
const ac = new AbortController();

// Use either the onabort property...
ac.signal.onabort = () => console.log('aborted!');

// Or the EventTarget API...
ac.signal.addEventListener('abort', (event) => {
  console.log(event.type);  // Prints 'abort'
}, { once: true });

ac.abort();
```
El `AbortController` con el que está asociado el `AbortSignal` solo activará el evento `'abort'` una vez. Recomendamos que el código verifique que el atributo `abortSignal.aborted` sea `false` antes de agregar un detector de eventos `'abort'`.

Cualquier detector de eventos adjunto al `AbortSignal` debe usar la opción `{ once: true }` (o, si usa las API de `EventEmitter` para adjuntar un detector, use el método `once()`) para garantizar que el detector de eventos se elimine tan pronto como se maneje el evento `'abort'`. No hacerlo puede provocar pérdidas de memoria.


#### `abortSignal.aborted` {#abortsignalaborted}

**Agregado en: v15.0.0, v14.17.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Verdadero después de que se haya abortado el `AbortController`.

#### `abortSignal.onabort` {#abortsignalonabort}

**Agregado en: v15.0.0, v14.17.0**

- Tipo: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Una función de devolución de llamada opcional que el código de usuario puede establecer para recibir una notificación cuando se haya llamado a la función `abortController.abort()`.

#### `abortSignal.reason` {#abortsignalreason}

**Agregado en: v17.2.0, v16.14.0**

- Tipo: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Una razón opcional especificada cuando se activó `AbortSignal`.

```js [ESM]
const ac = new AbortController();
ac.abort(new Error('¡boom!'));
console.log(ac.signal.reason);  // Error: ¡boom!
```
#### `abortSignal.throwIfAborted()` {#abortsignalthrowifaborted}

**Agregado en: v17.3.0, v16.17.0**

Si `abortSignal.aborted` es `true`, lanza `abortSignal.reason`.

## Clase: `Blob` {#class-blob}

**Agregado en: v18.0.0**

Ver [\<Blob\>](/es/nodejs/api/buffer#class-blob).

## Clase: `Buffer` {#class-buffer}

**Agregado en: v0.1.103**

- [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Se utiliza para manejar datos binarios. Ver la [sección del buffer](/es/nodejs/api/buffer).

## Clase: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}

**Agregado en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`ByteLengthQueuingStrategy`](/es/nodejs/api/webstreams#class-bytelengthqueuingstrategy).

## `__dirname` {#__dirname}

Esta variable puede parecer global pero no lo es. Ver [`__dirname`](/es/nodejs/api/modules#__dirname).

## `__filename` {#__filename}

Esta variable puede parecer global pero no lo es. Ver [`__filename`](/es/nodejs/api/modules#__filename).

## `atob(data)` {#atobdata}

**Agregado en: v16.0.0**

::: info [Estable: 3 - Legado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Legado. Utilice `Buffer.from(data, 'base64')` en su lugar.
:::

Alias global para [`buffer.atob()`](/es/nodejs/api/buffer#bufferatobdata).


## `BroadcastChannel` {#broadcastchannel}

**Añadido en: v18.0.0**

Ver [\<BroadcastChannel\>](/es/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget).

## `btoa(data)` {#btoadata}

**Añadido en: v16.0.0**

::: info [Estable: 3 - Legado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Legado. Use `buf.toString('base64')` en su lugar.
:::

Alias global para [`buffer.btoa()`](/es/nodejs/api/buffer#bufferbtoadata).

## `clearImmediate(immediateObject)` {#clearimmediateimmediateobject}

**Añadido en: v0.9.1**

[`clearImmediate`](/es/nodejs/api/timers#clearimmediateimmediate) se describe en la sección de [temporizadores](/es/nodejs/api/timers).

## `clearInterval(intervalObject)` {#clearintervalintervalobject}

**Añadido en: v0.0.1**

[`clearInterval`](/es/nodejs/api/timers#clearintervaltimeout) se describe en la sección de [temporizadores](/es/nodejs/api/timers).

## `clearTimeout(timeoutObject)` {#cleartimeouttimeoutobject}

**Añadido en: v0.0.1**

[`clearTimeout`](/es/nodejs/api/timers#cleartimeouttimeout) se describe en la sección de [temporizadores](/es/nodejs/api/timers).

## `CloseEvent` {#closeevent}

**Añadido en: v23.0.0**

La clase `CloseEvent`. Ver [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent) para más detalles.

Una implementación compatible con el navegador de [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent). Deshabilite esta API con el indicador de CLI [`--no-experimental-websocket`](/es/nodejs/api/cli#--no-experimental-websocket).

## Clase: `CompressionStream` {#class-compressionstream}

**Añadido en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`CompressionStream`](/es/nodejs/api/webstreams#class-compressionstream).

## `console` {#console}

**Añadido en: v0.1.100**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se utiliza para imprimir en stdout y stderr. Ver la sección [`console`](/es/nodejs/api/console).

## Clase: `CountQueuingStrategy` {#class-countqueuingstrategy}

**Añadido en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`CountQueuingStrategy`](/es/nodejs/api/webstreams#class-countqueuingstrategy).


## `Crypto` {#crypto}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Ya no es experimental. |
| v19.0.0 | Ya no está detrás del flag de CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Agregado en: v17.6.0, v16.15.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable.
:::

Una implementación compatible con el navegador de [\<Crypto\>](/es/nodejs/api/webcrypto#class-crypto). Esta global solo está disponible si el binario de Node.js fue compilado incluyendo soporte para el módulo `node:crypto`.

## `crypto` {#crypto_1}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Ya no es experimental. |
| v19.0.0 | Ya no está detrás del flag de CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Agregado en: v17.6.0, v16.15.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable.
:::

Una implementación compatible con el navegador de la [Web Crypto API](/es/nodejs/api/webcrypto).

## `CryptoKey` {#cryptokey}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Ya no es experimental. |
| v19.0.0 | Ya no está detrás del flag de CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Agregado en: v17.6.0, v16.15.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable.
:::

Una implementación compatible con el navegador de [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey). Esta global solo está disponible si el binario de Node.js fue compilado incluyendo soporte para el módulo `node:crypto`.

## `CustomEvent` {#customevent}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Ya no es experimental. |
| v22.1.0, v20.13.0 | CustomEvent ahora es estable. |
| v19.0.0 | Ya no está detrás del flag de CLI `--experimental-global-customevent`. |
| v18.7.0, v16.17.0 | Agregado en: v18.7.0, v16.17.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Una implementación compatible con el navegador de la [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent).


## Clase: `DecompressionStream` {#class-decompressionstream}

**Agregado en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`DecompressionStream`](/es/nodejs/api/webstreams#class-decompressionstream).

## `Event` {#event}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.4.0 | Ya no es experimental. |
| v15.0.0 | Agregado en: v15.0.0 |
:::

Una implementación compatible con el navegador de la clase `Event`. Consulte la API [`EventTarget` y `Event`](/es/nodejs/api/events#eventtarget-and-event-api) para obtener más detalles.

## `EventSource` {#eventsource}

**Agregado en: v22.3.0, v20.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental. Habilite esta API con el indicador CLI [`--experimental-eventsource`](/es/nodejs/api/cli#--experimental-eventsource).
:::

Una implementación compatible con el navegador de la clase [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource).

## `EventTarget` {#eventtarget}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.4.0 | Ya no es experimental. |
| v15.0.0 | Agregado en: v15.0.0 |
:::

Una implementación compatible con el navegador de la clase `EventTarget`. Consulte la API [`EventTarget` y `Event`](/es/nodejs/api/events#eventtarget-and-event-api) para obtener más detalles.

## `exports` {#exports}

Esta variable puede parecer global, pero no lo es. Consulte [`exports`](/es/nodejs/api/modules#exports).

## `fetch` {#fetch}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0 | Ya no es experimental. |
| v18.0.0 | Ya no está detrás del indicador CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Agregado en: v17.5.0, v16.15.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Una implementación compatible con el navegador de la función [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch).

## Clase: `File` {#class-file}

**Agregado en: v20.0.0**

Consulte [\<File\>](/es/nodejs/api/buffer#class-file).


## Clase `FormData` {#class-formdata}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0 | Ya no es experimental. |
| v18.0.0 | Ya no está detrás del flag CLI `--experimental-fetch`. |
| v17.6.0, v16.15.0 | Añadido en: v17.6.0, v16.15.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Una implementación compatible con el navegador de [\<FormData\>](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

## `global` {#global}

**Añadido en: v0.1.27**

::: info [Estable: 3 - Legado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Legado. Utilice [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) en su lugar.
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El objeto de espacio de nombres global.

En los navegadores, el alcance de nivel superior ha sido tradicionalmente el alcance global. Esto significa que `var algo` definirá una nueva variable global, excepto dentro de los módulos ECMAScript. En Node.js, esto es diferente. El alcance de nivel superior no es el alcance global; `var algo` dentro de un módulo Node.js será local a ese módulo, independientemente de si es un [módulo CommonJS](/es/nodejs/api/modules) o un [módulo ECMAScript](/es/nodejs/api/esm).

## Clase `Headers` {#class-headers}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0 | Ya no es experimental. |
| v18.0.0 | Ya no está detrás del flag CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Añadido en: v17.5.0, v16.15.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Una implementación compatible con el navegador de [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers).

## `localStorage` {#localstorage}

**Añadido en: v22.4.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).0 - Desarrollo temprano.
:::

Una implementación compatible con el navegador de [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Los datos se almacenan sin cifrar en el archivo especificado por el flag CLI [`--localstorage-file`](/es/nodejs/api/cli#--localstorage-filefile). La cantidad máxima de datos que se pueden almacenar es de 10 MB. No se admite ninguna modificación de estos datos fuera de la API de Web Storage. Habilite esta API con el flag CLI [`--experimental-webstorage`](/es/nodejs/api/cli#--experimental-webstorage). Los datos de `localStorage` no se almacenan por usuario o por solicitud cuando se utilizan en el contexto de un servidor, se comparten entre todos los usuarios y solicitudes.


## `MessageChannel` {#messagechannel}

**Añadido en: v15.0.0**

La clase `MessageChannel`. Ver [`MessageChannel`](/es/nodejs/api/worker_threads#class-messagechannel) para más detalles.

## `MessageEvent` {#messageevent}

**Añadido en: v15.0.0**

La clase `MessageEvent`. Ver [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/MessageEvent) para más detalles.

## `MessagePort` {#messageport}

**Añadido en: v15.0.0**

La clase `MessagePort`. Ver [`MessagePort`](/es/nodejs/api/worker_threads#class-messageport) para más detalles.

## `module` {#module}

Esta variable puede parecer global, pero no lo es. Ver [`module`](/es/nodejs/api/modules#module).

## `Navigator` {#navigator}

**Añadido en: v21.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo. Deshabilita esta API con el flag de la CLI [`--no-experimental-global-navigator`](/es/nodejs/api/cli#--no-experimental-global-navigator).
:::

Una implementación parcial de la [API Navigator](https://html.spec.whatwg.org/multipage/system-state#the-navigator-object).

## `navigator` {#navigator_1}

**Añadido en: v21.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo. Deshabilita esta API con el flag de la CLI [`--no-experimental-global-navigator`](/es/nodejs/api/cli#--no-experimental-global-navigator).
:::

Una implementación parcial de [`window.navigator`](https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator).

### `navigator.hardwareConcurrency` {#navigatorhardwareconcurrency}

**Añadido en: v21.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La propiedad de sólo lectura `navigator.hardwareConcurrency` devuelve el número de procesadores lógicos disponibles para la instancia actual de Node.js.

```js [ESM]
console.log(`Este proceso se está ejecutando en ${navigator.hardwareConcurrency} procesadores lógicos`);
```
### `navigator.language` {#navigatorlanguage}

**Añadido en: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad de sólo lectura `navigator.language` devuelve una cadena que representa el idioma preferido de la instancia de Node.js. El idioma será determinado por la biblioteca ICU utilizada por Node.js en tiempo de ejecución basándose en el idioma predeterminado del sistema operativo.

El valor representa la versión del idioma tal como se define en [RFC 5646](https://www.rfc-editor.org/rfc/rfc5646.txt).

El valor de reserva en compilaciones sin ICU es `'en-US'`.

```js [ESM]
console.log(`El idioma preferido de la instancia de Node.js tiene la etiqueta '${navigator.language}'`);
```

### `navigator.languages` {#navigatorlanguages}

**Añadido en: v21.2.0**

- {Array

La propiedad de solo lectura `navigator.languages` devuelve una array de cadenas que representan los idiomas preferidos de la instancia de Node.js. De forma predeterminada, `navigator.languages` contiene solo el valor de `navigator.language`, que será determinado por la biblioteca ICU utilizada por Node.js en tiempo de ejecución basándose en el idioma predeterminado del sistema operativo.

El valor de respaldo en compilaciones sin ICU es `['en-US']`.

```js [ESM]
console.log(`Los idiomas preferidos son '${navigator.languages}'`);
```
### `navigator.platform` {#navigatorplatform}

**Añadido en: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad de solo lectura `navigator.platform` devuelve una cadena que identifica la plataforma en la que se está ejecutando la instancia de Node.js.

```js [ESM]
console.log(`Este proceso se está ejecutando en ${navigator.platform}`);
```
### `navigator.userAgent` {#navigatoruseragent}

**Añadido en: v21.1.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad de solo lectura `navigator.userAgent` devuelve un agente de usuario que consiste en el nombre del tiempo de ejecución y el número de versión principal.

```js [ESM]
console.log(`El agente de usuario es ${navigator.userAgent}`); // Imprime "Node.js/21"
```
## `PerformanceEntry` {#performanceentry}

**Añadido en: v19.0.0**

La clase `PerformanceEntry`. Ver [`PerformanceEntry`](/es/nodejs/api/perf_hooks#class-performanceentry) para más detalles.

## `PerformanceMark` {#performancemark}

**Añadido en: v19.0.0**

La clase `PerformanceMark`. Ver [`PerformanceMark`](/es/nodejs/api/perf_hooks#class-performancemark) para más detalles.

## `PerformanceMeasure` {#performancemeasure}

**Añadido en: v19.0.0**

La clase `PerformanceMeasure`. Ver [`PerformanceMeasure`](/es/nodejs/api/perf_hooks#class-performancemeasure) para más detalles.

## `PerformanceObserver` {#performanceobserver}

**Añadido en: v19.0.0**

La clase `PerformanceObserver`. Ver [`PerformanceObserver`](/es/nodejs/api/perf_hooks#class-performanceobserver) para más detalles.

## `PerformanceObserverEntryList` {#performanceobserverentrylist}

**Añadido en: v19.0.0**

La clase `PerformanceObserverEntryList`. Ver [`PerformanceObserverEntryList`](/es/nodejs/api/perf_hooks#class-performanceobserverentrylist) para más detalles.


## `PerformanceResourceTiming` {#performanceresourcetiming}

**Agregado en: v19.0.0**

La clase `PerformanceResourceTiming`. Véase [`PerformanceResourceTiming`](/es/nodejs/api/perf_hooks#class-performanceresourcetiming) para más detalles.

## `performance` {#performance}

**Agregado en: v16.0.0**

El objeto [`perf_hooks.performance`](/es/nodejs/api/perf_hooks#perf_hooksperformance).

## `process` {#process}

**Agregado en: v0.1.7**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

El objeto process. Ver la sección [`process` object](/es/nodejs/api/process#process).

## `queueMicrotask(callback)` {#queuemicrotaskcallback}

**Agregado en: v11.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Función para ser encolada.

El método `queueMicrotask()` encola una microtarea para invocar `callback`. Si `callback` lanza una excepción, el evento `'uncaughtException'` del [`process` object](/es/nodejs/api/process#process) será emitido.

La cola de microtareas es gestionada por V8 y puede ser usada de manera similar a la cola [`process.nextTick()`](/es/nodejs/api/process#processnexttickcallback-args), la cual es gestionada por Node.js. La cola `process.nextTick()` siempre es procesada antes de la cola de microtareas dentro de cada vuelta del bucle de eventos de Node.js.

```js [ESM]
// Aquí, `queueMicrotask()` es usado para asegurar que el evento 'load' siempre
// es emitido asíncronamente, y por lo tanto consistentemente. Usar
// `process.nextTick()` aquí resultaría en que el evento 'load' siempre se emitiera
// antes de cualquier otro trabajo de promesa.

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
## Clase: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

**Agregado en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`ReadableByteStreamController`](/es/nodejs/api/webstreams#class-readablebytestreamcontroller).


## Clase: `ReadableStream` {#class-readablestream}

**Añadido en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`ReadableStream`](/es/nodejs/api/webstreams#class-readablestream).

## Clase: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}

**Añadido en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`ReadableStreamBYOBReader`](/es/nodejs/api/webstreams#class-readablestreambyobreader).

## Clase: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

**Añadido en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`ReadableStreamBYOBRequest`](/es/nodejs/api/webstreams#class-readablestreambyobrequest).

## Clase: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Añadido en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`ReadableStreamDefaultController`](/es/nodejs/api/webstreams#class-readablestreamdefaultcontroller).

## Clase: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

**Añadido en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`ReadableStreamDefaultReader`](/es/nodejs/api/webstreams#class-readablestreamdefaultreader).

## `require()` {#require}

Esta variable puede parecer global, pero no lo es. Consulte [`require()`](/es/nodejs/api/modules#requireid).

## `Response` {#response}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0 | Ya no es experimental. |
| v18.0.0 | Ya no está detrás del flag de la CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Añadido en: v17.5.0, v16.15.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Una implementación compatible con el navegador de [\<Response\>](https://developer.mozilla.org/en-US/docs/Web/API/Response).


## `Request` {#request}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0 | Ya no es experimental. |
| v18.0.0 | Ya no está detrás del flag `--experimental-fetch` de la CLI. |
| v17.5.0, v16.15.0 | Añadido en: v17.5.0, v16.15.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Una implementación compatible con el navegador de [\<Request\>](https://developer.mozilla.org/en-US/docs/Web/API/Request).

## `sessionStorage` {#sessionstorage}

**Añadido en: v22.4.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).0 - Desarrollo temprano.
:::

Una implementación compatible con el navegador de [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage). Los datos se almacenan en la memoria, con una cuota de almacenamiento de 10 MB. Los datos de `sessionStorage` persisten solo dentro del proceso en ejecución actual y no se comparten entre los workers.

## `setImmediate(callback[, ...args])` {#setimmediatecallback-args}

**Añadido en: v0.9.1**

[`setImmediate`](/es/nodejs/api/timers#setimmediatecallback-args) se describe en la sección de [timers](/es/nodejs/api/timers).

## `setInterval(callback, delay[, ...args])` {#setintervalcallback-delay-args}

**Añadido en: v0.0.1**

[`setInterval`](/es/nodejs/api/timers#setintervalcallback-delay-args) se describe en la sección de [timers](/es/nodejs/api/timers).

## `setTimeout(callback, delay[, ...args])` {#settimeoutcallback-delay-args}

**Añadido en: v0.0.1**

[`setTimeout`](/es/nodejs/api/timers#settimeoutcallback-delay-args) se describe en la sección de [timers](/es/nodejs/api/timers).

## Clase: `Storage` {#class-storage}

**Añadido en: v22.4.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).0 - Desarrollo temprano.
:::

Una implementación compatible con el navegador de [`Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage). Habilite esta API con el flag de la CLI [`--experimental-webstorage`](/es/nodejs/api/cli#--experimental-webstorage).

## `structuredClone(value[, options])` {#structuredclonevalue-options}

**Añadido en: v17.0.0**

El método WHATWG [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone).


## `SubtleCrypto` {#subtlecrypto}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v19.0.0 | Ya no está detrás del indicador de CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Añadido en: v17.6.0, v16.15.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable.
:::

Una implementación compatible con el navegador de [\<SubtleCrypto\>](/es/nodejs/api/webcrypto#class-subtlecrypto). Este global está disponible solo si el binario de Node.js se compiló incluyendo soporte para el módulo `node:crypto`.

## `DOMException` {#domexception}

**Añadido en: v17.0.0**

La clase `DOMException` de WHATWG. Consulte [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException) para obtener más detalles.

## `TextDecoder` {#textdecoder}

**Añadido en: v11.0.0**

La clase `TextDecoder` de WHATWG. Consulte la sección [`TextDecoder`](/es/nodejs/api/util#class-utiltextdecoder).

## Clase: `TextDecoderStream` {#class-textdecoderstream}

**Añadido en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`TextDecoderStream`](/es/nodejs/api/webstreams#class-textdecoderstream).

## `TextEncoder` {#textencoder}

**Añadido en: v11.0.0**

La clase `TextEncoder` de WHATWG. Consulte la sección [`TextEncoder`](/es/nodejs/api/util#class-utiltextencoder).

## Clase: `TextEncoderStream` {#class-textencoderstream}

**Añadido en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`TextEncoderStream`](/es/nodejs/api/webstreams#class-textencoderstream).

## Clase: `TransformStream` {#class-transformstream}

**Añadido en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`TransformStream`](/es/nodejs/api/webstreams#class-transformstream).

## Clase: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}

**Añadido en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`TransformStreamDefaultController`](/es/nodejs/api/webstreams#class-transformstreamdefaultcontroller).


## `URL` {#url}

**Añadido en: v10.0.0**

La clase `URL` de WHATWG. Vea la sección [`URL`](/es/nodejs/api/url#class-url).

## `URLSearchParams` {#urlsearchparams}

**Añadido en: v10.0.0**

La clase `URLSearchParams` de WHATWG. Vea la sección [`URLSearchParams`](/es/nodejs/api/url#class-urlsearchparams).

## `WebAssembly` {#webassembly}

**Añadido en: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

El objeto que actúa como espacio de nombres para toda la funcionalidad relacionada con [WebAssembly](https://webassembly.org/) de W3C. Consulte la [Red de Desarrolladores de Mozilla](https://developer.mozilla.org/en-US/docs/WebAssembly) para obtener información sobre el uso y la compatibilidad.

## `WebSocket` {#websocket}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.4.0 | Ya no es experimental. |
| v22.0.0 | Ya no está detrás del indicador CLI `--experimental-websocket`. |
| v21.0.0, v20.10.0 | Añadido en: v21.0.0, v20.10.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable.
:::

Una implementación compatible con el navegador de [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket). Deshabilite esta API con el indicador CLI [`--no-experimental-websocket`](/es/nodejs/api/cli#--no-experimental-websocket).

## Clase: `WritableStream` {#class-writablestream}

**Añadido en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`WritableStream`](/es/nodejs/api/webstreams#class-writablestream).

## Clase: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

**Añadido en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`WritableStreamDefaultController`](/es/nodejs/api/webstreams#class-writablestreamdefaultcontroller).

## Clase: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}

**Añadido en: v18.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental.
:::

Una implementación compatible con el navegador de [`WritableStreamDefaultWriter`](/es/nodejs/api/webstreams#class-writablestreamdefaultwriter).

