---
title: Objets globaux de Node.js
description: Cette page documente les objets globaux disponibles dans Node.js, y compris les variables globales, fonctions et classes accessibles depuis n'importe quel module sans nécessiter d'importation explicite.
head:
  - - meta
    - name: og:title
      content: Objets globaux de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Cette page documente les objets globaux disponibles dans Node.js, y compris les variables globales, fonctions et classes accessibles depuis n'importe quel module sans nécessiter d'importation explicite.
  - - meta
    - name: twitter:title
      content: Objets globaux de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Cette page documente les objets globaux disponibles dans Node.js, y compris les variables globales, fonctions et classes accessibles depuis n'importe quel module sans nécessiter d'importation explicite.
---


# Objets globaux {#global-objects}

Ces objets sont disponibles dans tous les modules.

Les variables suivantes peuvent sembler globales, mais ne le sont pas. Elles existent uniquement dans la portée des [modules CommonJS](/fr/nodejs/api/modules) :

- [`__dirname`](/fr/nodejs/api/modules#__dirname)
- [`__filename`](/fr/nodejs/api/modules#__filename)
- [`exports`](/fr/nodejs/api/modules#exports)
- [`module`](/fr/nodejs/api/modules#module)
- [`require()`](/fr/nodejs/api/modules#requireid)

Les objets listés ici sont spécifiques à Node.js. Il existe des [objets intégrés](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects) qui font partie du langage JavaScript lui-même, qui sont également accessibles globalement.

## Classe : `AbortController` {#class-abortcontroller}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.4.0 | N’est plus expérimental. |
| v15.0.0, v14.17.0 | Ajouté dans : v15.0.0, v14.17.0 |
:::

Une classe utilitaire utilisée pour signaler une annulation dans certaines API basées sur `Promise`. L’API est basée sur l’API Web [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

```js [ESM]
const ac = new AbortController();

ac.signal.addEventListener('abort', () => console.log('Abandonné !'),
                           { once: true });

ac.abort();

console.log(ac.signal.aborted);  // Affiche true
```

### `abortController.abort([reason])` {#abortcontrollerabortreason}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.2.0, v16.14.0 | Ajout de l’argument de raison facultatif. |
| v15.0.0, v14.17.0 | Ajouté dans : v15.0.0, v14.17.0 |
:::

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Une raison facultative, récupérable sur la propriété `reason` de l’`AbortSignal`.

Déclenche le signal d’abandon, ce qui provoque l’émission de l’événement `'abort'` par `abortController.signal`.

### `abortController.signal` {#abortcontrollersignal}

**Ajouté dans : v15.0.0, v14.17.0**

- Type : [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal)

### Classe : `AbortSignal` {#class-abortsignal}

**Ajouté dans : v15.0.0, v14.17.0**

- Étend : [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget)

Le `AbortSignal` est utilisé pour notifier les observateurs lorsque la méthode `abortController.abort()` est appelée.


#### Méthode statique : `AbortSignal.abort([reason])` {#static-method-abortsignalabortreason}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.2.0, v16.14.0 | Ajout du nouvel argument optionnel reason. |
| v15.12.0, v14.17.0 | Ajouté dans : v15.12.0, v14.17.0 |
:::

- `reason` : [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Renvoie : [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal)

Renvoie un nouvel `AbortSignal` déjà annulé.

#### Méthode statique : `AbortSignal.timeout(delay)` {#static-method-abortsignaltimeoutdelay}

**Ajouté dans : v17.3.0, v16.14.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes à attendre avant de déclencher l'AbortSignal.

Renvoie un nouvel `AbortSignal` qui sera annulé dans `delay` millisecondes.

#### Méthode statique : `AbortSignal.any(signals)` {#static-method-abortsignalanysignals}

**Ajouté dans : v20.3.0, v18.17.0**

- `signals` [\<AbortSignal[]\>](/fr/nodejs/api/globals#class-abortsignal) Les `AbortSignal` à partir desquels composer un nouvel `AbortSignal`.

Renvoie un nouvel `AbortSignal` qui sera annulé si l'un des signaux fournis est annulé. Sa [`abortSignal.reason`](/fr/nodejs/api/globals#abortsignalreason) sera définie sur celui des `signals` qui a provoqué son annulation.

#### Événement : `'abort'` {#event-abort}

**Ajouté dans : v15.0.0, v14.17.0**

L'événement `'abort'` est émis lorsque la méthode `abortController.abort()` est appelée. Le callback est appelé avec un seul argument objet avec une seule propriété `type` définie sur `'abort'` :

```js [ESM]
const ac = new AbortController();

// Utiliser soit la propriété onabort...
ac.signal.onabort = () => console.log('annulé!');

// Soit l'API EventTarget...
ac.signal.addEventListener('abort', (event) => {
  console.log(event.type);  // Affiche 'abort'
}, { once: true });

ac.abort();
```
L'`AbortController` auquel l'`AbortSignal` est associé ne déclenchera qu'une seule fois l'événement `'abort'`. Nous recommandons que le code vérifie que l'attribut `abortSignal.aborted` est `false` avant d'ajouter un écouteur d'événements `'abort'`.

Tous les écouteurs d'événements attachés à l'`AbortSignal` doivent utiliser l'option `{ once: true }` (ou, si vous utilisez les API `EventEmitter` pour attacher un écouteur, utilisez la méthode `once()`) pour vous assurer que l'écouteur d'événements est supprimé dès que l'événement `'abort'` est géré. Ne pas le faire peut entraîner des fuites de mémoire.


#### `abortSignal.aborted` {#abortsignalaborted}

**Ajouté dans : v15.0.0, v14.17.0**

- Type : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Vrai après que l'`AbortController` a été interrompu.

#### `abortSignal.onabort` {#abortsignalonabort}

**Ajouté dans : v15.0.0, v14.17.0**

- Type : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Une fonction de rappel optionnelle qui peut être définie par le code utilisateur pour être notifiée lorsque la fonction `abortController.abort()` a été appelée.

#### `abortSignal.reason` {#abortsignalreason}

**Ajouté dans : v17.2.0, v16.14.0**

- Type : [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Une raison optionnelle spécifiée lorsque le `AbortSignal` a été déclenché.

```js [ESM]
const ac = new AbortController();
ac.abort(new Error('boom!'));
console.log(ac.signal.reason);  // Error: boom!
```
#### `abortSignal.throwIfAborted()` {#abortsignalthrowifaborted}

**Ajouté dans : v17.3.0, v16.17.0**

Si `abortSignal.aborted` est `true`, lance `abortSignal.reason`.

## Classe : `Blob` {#class-blob}

**Ajouté dans : v18.0.0**

Voir [\<Blob\>](/fr/nodejs/api/buffer#class-blob).

## Classe : `Buffer` {#class-buffer}

**Ajouté dans : v0.1.103**

- [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Utilisé pour gérer les données binaires. Voir la [section du buffer](/fr/nodejs/api/buffer).

## Classe : `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}

**Ajouté dans : v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`ByteLengthQueuingStrategy`](/fr/nodejs/api/webstreams#class-bytelengthqueuingstrategy).

## `__dirname` {#__dirname}

Cette variable peut sembler globale, mais elle ne l'est pas. Voir [`__dirname`](/fr/nodejs/api/modules#__dirname).

## `__filename` {#__filename}

Cette variable peut sembler globale, mais elle ne l'est pas. Voir [`__filename`](/fr/nodejs/api/modules#__filename).

## `atob(data)` {#atobdata}

**Ajouté dans : v16.0.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stabilité : 3](/fr/nodejs/api/documentation#stability-index) - Hérité. Utilisez `Buffer.from(data, 'base64')` à la place.
:::

Alias global pour [`buffer.atob()`](/fr/nodejs/api/buffer#bufferatobdata).


## `BroadcastChannel` {#broadcastchannel}

**Ajouté dans : v18.0.0**

Voir [\<BroadcastChannel\>](/fr/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget).

## `btoa(data)` {#btoadata}

**Ajouté dans : v16.0.0**

::: info [Stable: 3 - Hérité]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stabilité : 3](/fr/nodejs/api/documentation#stability-index) - Hérité. Utilisez plutôt `buf.toString('base64')`.
:::

Alias global pour [`buffer.btoa()`](/fr/nodejs/api/buffer#bufferbtoadata).

## `clearImmediate(immediateObject)` {#clearimmediateimmediateobject}

**Ajouté dans : v0.9.1**

[`clearImmediate`](/fr/nodejs/api/timers#clearimmediateimmediate) est décrit dans la section [timers](/fr/nodejs/api/timers).

## `clearInterval(intervalObject)` {#clearintervalintervalobject}

**Ajouté dans : v0.0.1**

[`clearInterval`](/fr/nodejs/api/timers#clearintervaltimeout) est décrit dans la section [timers](/fr/nodejs/api/timers).

## `clearTimeout(timeoutObject)` {#cleartimeouttimeoutobject}

**Ajouté dans : v0.0.1**

[`clearTimeout`](/fr/nodejs/api/timers#cleartimeouttimeout) est décrit dans la section [timers](/fr/nodejs/api/timers).

## `CloseEvent` {#closeevent}

**Ajouté dans : v23.0.0**

La classe `CloseEvent`. Voir [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent) pour plus de détails.

Une implémentation compatible avec le navigateur de [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent). Désactivez cette API avec l'indicateur CLI [`--no-experimental-websocket`](/fr/nodejs/api/cli#--no-experimental-websocket).

## Classe : `CompressionStream` {#class-compressionstream}

**Ajouté dans : v18.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`CompressionStream`](/fr/nodejs/api/webstreams#class-compressionstream).

## `console` {#console}

**Ajouté dans : v0.1.100**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Utilisé pour afficher dans stdout et stderr. Voir la section [`console`](/fr/nodejs/api/console).

## Classe : `CountQueuingStrategy` {#class-countqueuingstrategy}

**Ajouté dans : v18.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`CountQueuingStrategy`](/fr/nodejs/api/webstreams#class-countqueuingstrategy).


## `Crypto` {#crypto}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | N'est plus expérimental. |
| v19.0.0 | N'est plus derrière l'indicateur CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Ajouté dans : v17.6.0, v16.15.0 |
:::

::: tip [Stable : 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable.
:::

Une implémentation compatible avec le navigateur de [\<Crypto\>](/fr/nodejs/api/webcrypto#class-crypto). Cette variable globale est disponible uniquement si le binaire Node.js a été compilé en incluant la prise en charge du module `node:crypto`.

## `crypto` {#crypto_1}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | N'est plus expérimental. |
| v19.0.0 | N'est plus derrière l'indicateur CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Ajouté dans : v17.6.0, v16.15.0 |
:::

::: tip [Stable : 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable.
:::

Une implémentation compatible avec le navigateur de l'[API Web Crypto](/fr/nodejs/api/webcrypto).

## `CryptoKey` {#cryptokey}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | N'est plus expérimental. |
| v19.0.0 | N'est plus derrière l'indicateur CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Ajouté dans : v17.6.0, v16.15.0 |
:::

::: tip [Stable : 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable.
:::

Une implémentation compatible avec le navigateur de [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey). Cette variable globale est disponible uniquement si le binaire Node.js a été compilé en incluant la prise en charge du module `node:crypto`.

## `CustomEvent` {#customevent}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | N'est plus expérimental. |
| v22.1.0, v20.13.0 | CustomEvent est maintenant stable. |
| v19.0.0 | N'est plus derrière l'indicateur CLI `--experimental-global-customevent`. |
| v18.7.0, v16.17.0 | Ajouté dans : v18.7.0, v16.17.0 |
:::

::: tip [Stable : 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Une implémentation compatible avec le navigateur de l'[API Web `CustomEvent`](https://dom.spec.whatwg.org/#customevent).


## Classe : `DecompressionStream` {#class-decompressionstream}

**Ajoutée dans : v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`DecompressionStream`](/fr/nodejs/api/webstreams#class-decompressionstream).

## `Event` {#event}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.4.0 | N'est plus expérimental. |
| v15.0.0 | Ajoutée dans : v15.0.0 |
:::

Une implémentation compatible avec le navigateur de la classe `Event`. Consultez l'[API `EventTarget` et `Event`](/fr/nodejs/api/events#eventtarget-and-event-api) pour plus de détails.

## `EventSource` {#eventsource}

**Ajoutée dans : v22.3.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental. Activez cette API avec l'indicateur CLI [`--experimental-eventsource`](/fr/nodejs/api/cli#--experimental-eventsource).
:::

Une implémentation compatible avec le navigateur de la classe [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource).

## `EventTarget` {#eventtarget}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.4.0 | N'est plus expérimental. |
| v15.0.0 | Ajoutée dans : v15.0.0 |
:::

Une implémentation compatible avec le navigateur de la classe `EventTarget`. Consultez l'[API `EventTarget` et `Event`](/fr/nodejs/api/events#eventtarget-and-event-api) pour plus de détails.

## `exports` {#exports}

Cette variable peut sembler globale, mais elle ne l'est pas. Voir [`exports`](/fr/nodejs/api/modules#exports).

## `fetch` {#fetch}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0 | N'est plus expérimental. |
| v18.0.0 | N'est plus derrière l'indicateur CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Ajoutée dans : v17.5.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stable: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Une implémentation compatible avec le navigateur de la fonction [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch).

## Classe : `File` {#class-file}

**Ajoutée dans : v20.0.0**

Voir [\<File\>](/fr/nodejs/api/buffer#class-file).


## Classe `FormData` {#class-formdata}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0 | N'est plus expérimental. |
| v18.0.0 | N'est plus derrière l'indicateur CLI `--experimental-fetch`. |
| v17.6.0, v16.15.0 | Ajouté dans : v17.6.0, v16.15.0 |
:::

::: tip [Stable : 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Une implémentation compatible avec le navigateur de [\<FormData\>](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

## `global` {#global}

**Ajouté dans : v0.1.27**

::: info [Stable : 3 - Hérité]
[Stable : 3](/fr/nodejs/api/documentation#stability-index) [Stabilité : 3](/fr/nodejs/api/documentation#stability-index) - Hérité. Utilisez plutôt [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis).
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'objet d'espace de noms global.

Dans les navigateurs, la portée de premier niveau a traditionnellement été la portée globale. Cela signifie que `var something` définira une nouvelle variable globale, sauf dans les modules ECMAScript. Dans Node.js, c'est différent. La portée de premier niveau n'est pas la portée globale ; `var something` à l'intérieur d'un module Node.js sera local à ce module, qu'il s'agisse d'un [module CommonJS](/fr/nodejs/api/modules) ou d'un [module ECMAScript](/fr/nodejs/api/esm).

## Classe `Headers` {#class-headers}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0 | N'est plus expérimental. |
| v18.0.0 | N'est plus derrière l'indicateur CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Ajouté dans : v17.5.0, v16.15.0 |
:::

::: tip [Stable : 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Une implémentation compatible avec le navigateur de [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers).

## `localStorage` {#localstorage}

**Ajouté dans : v22.4.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Développement précoce.
:::

Une implémentation compatible avec le navigateur de [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Les données sont stockées non chiffrées dans le fichier spécifié par l'indicateur CLI [`--localstorage-file`](/fr/nodejs/api/cli#--localstorage-filefile). La quantité maximale de données pouvant être stockées est de 10 Mo. Toute modification de ces données en dehors de l'API Web Storage n'est pas prise en charge. Activez cette API avec l'indicateur CLI [`--experimental-webstorage`](/fr/nodejs/api/cli#--experimental-webstorage). Les données `localStorage` ne sont pas stockées par utilisateur ou par requête lorsqu'elles sont utilisées dans le contexte d'un serveur, elles sont partagées entre tous les utilisateurs et toutes les requêtes.


## `MessageChannel` {#messagechannel}

**Ajouté dans : v15.0.0**

La classe `MessageChannel`. Voir [`MessageChannel`](/fr/nodejs/api/worker_threads#class-messagechannel) pour plus de détails.

## `MessageEvent` {#messageevent}

**Ajouté dans : v15.0.0**

La classe `MessageEvent`. Voir [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/MessageEvent) pour plus de détails.

## `MessagePort` {#messageport}

**Ajouté dans : v15.0.0**

La classe `MessagePort`. Voir [`MessagePort`](/fr/nodejs/api/worker_threads#class-messageport) pour plus de détails.

## `module` {#module}

Cette variable peut sembler globale, mais elle ne l’est pas. Voir [`module`](/fr/nodejs/api/modules#module).

## `Navigator` {#navigator}

**Ajouté dans : v21.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif. Désactivez cette API avec l’indicateur CLI [`--no-experimental-global-navigator`](/fr/nodejs/api/cli#--no-experimental-global-navigator).
:::

Une implémentation partielle de l’[API Navigator](https://html.spec.whatwg.org/multipage/system-state#the-navigator-object).

## `navigator` {#navigator_1}

**Ajouté dans : v21.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif. Désactivez cette API avec l’indicateur CLI [`--no-experimental-global-navigator`](/fr/nodejs/api/cli#--no-experimental-global-navigator).
:::

Une implémentation partielle de [`window.navigator`](https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator).

### `navigator.hardwareConcurrency` {#navigatorhardwareconcurrency}

**Ajouté dans : v21.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La propriété en lecture seule `navigator.hardwareConcurrency` renvoie le nombre de processeurs logiques disponibles pour l’instance Node.js actuelle.

```js [ESM]
console.log(`Ce processus s’exécute sur ${navigator.hardwareConcurrency} processeurs logiques`);
```
### `navigator.language` {#navigatorlanguage}

**Ajouté dans : v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propriété en lecture seule `navigator.language` renvoie une chaîne représentant la langue préférée de l’instance Node.js. La langue sera déterminée par la bibliothèque ICU utilisée par Node.js au moment de l’exécution en fonction de la langue par défaut du système d’exploitation.

La valeur représente la version de langue telle que définie dans [RFC 5646](https://www.rfc-editor.org/rfc/rfc5646.txt).

La valeur de repli sur les builds sans ICU est `'en-US'`.

```js [ESM]
console.log(`La langue préférée de l’instance Node.js a la balise '${navigator.language}'`);
```

### `navigator.languages` {#navigatorlanguages}

**Ajouté dans : v21.2.0**

- {Array

La propriété en lecture seule `navigator.languages` renvoie un tableau de chaînes représentant les langues préférées de l’instance Node.js. Par défaut, `navigator.languages` ne contient que la valeur de `navigator.language`, qui sera déterminée par la bibliothèque ICU utilisée par Node.js au moment de l’exécution en fonction de la langue par défaut du système d’exploitation.

La valeur de repli sur les versions sans ICU est `['en-US']`.

```js [ESM]
console.log(`Les langues préférées sont '${navigator.languages}'`);
```
### `navigator.platform` {#navigatorplatform}

**Ajouté dans : v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propriété en lecture seule `navigator.platform` renvoie une chaîne identifiant la plate-forme sur laquelle l’instance Node.js s’exécute.

```js [ESM]
console.log(`Ce processus s’exécute sur ${navigator.platform}`);
```
### `navigator.userAgent` {#navigatoruseragent}

**Ajouté dans : v21.1.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propriété en lecture seule `navigator.userAgent` renvoie un user agent composé du nom de l’environnement d’exécution et du numéro de version majeur.

```js [ESM]
console.log(`L’user-agent est ${navigator.userAgent}`); // Affiche "Node.js/21"
```
## `PerformanceEntry` {#performanceentry}

**Ajouté dans : v19.0.0**

La classe `PerformanceEntry`. Voir [`PerformanceEntry`](/fr/nodejs/api/perf_hooks#class-performanceentry) pour plus de détails.

## `PerformanceMark` {#performancemark}

**Ajouté dans : v19.0.0**

La classe `PerformanceMark`. Voir [`PerformanceMark`](/fr/nodejs/api/perf_hooks#class-performancemark) pour plus de détails.

## `PerformanceMeasure` {#performancemeasure}

**Ajouté dans : v19.0.0**

La classe `PerformanceMeasure`. Voir [`PerformanceMeasure`](/fr/nodejs/api/perf_hooks#class-performancemeasure) pour plus de détails.

## `PerformanceObserver` {#performanceobserver}

**Ajouté dans : v19.0.0**

La classe `PerformanceObserver`. Voir [`PerformanceObserver`](/fr/nodejs/api/perf_hooks#class-performanceobserver) pour plus de détails.

## `PerformanceObserverEntryList` {#performanceobserverentrylist}

**Ajouté dans : v19.0.0**

La classe `PerformanceObserverEntryList`. Voir [`PerformanceObserverEntryList`](/fr/nodejs/api/perf_hooks#class-performanceobserverentrylist) pour plus de détails.


## `PerformanceResourceTiming` {#performanceresourcetiming}

**Ajouté dans : v19.0.0**

La classe `PerformanceResourceTiming`. Voir [`PerformanceResourceTiming`](/fr/nodejs/api/perf_hooks#class-performanceresourcetiming) pour plus de détails.

## `performance` {#performance}

**Ajouté dans : v16.0.0**

L'objet [`perf_hooks.performance`](/fr/nodejs/api/perf_hooks#perf_hooksperformance).

## `process` {#process}

**Ajouté dans : v0.1.7**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L'objet process. Voir la section [`process` object](/fr/nodejs/api/process#process).

## `queueMicrotask(callback)` {#queuemicrotaskcallback}

**Ajouté dans : v11.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction à mettre en file d'attente.

La méthode `queueMicrotask()` met en file d'attente une microtâche pour invoquer `callback`. Si `callback` lève une exception, l'événement `'uncaughtException'` de l'[`objet process`](/fr/nodejs/api/process#process) sera émis.

La file d'attente des microtâches est gérée par V8 et peut être utilisée de la même manière que la file d'attente [`process.nextTick()`](/fr/nodejs/api/process#processnexttickcallback-args), qui est gérée par Node.js. La file d'attente `process.nextTick()` est toujours traitée avant la file d'attente des microtâches à chaque tour de la boucle d'événements Node.js.

```js [ESM]
// Ici, `queueMicrotask()` est utilisé pour s'assurer que l'événement 'load' est toujours
// émis de manière asynchrone, et donc de manière cohérente. L'utilisation de
// `process.nextTick()` ici aurait pour conséquence que l'événement 'load' soit toujours émis
// avant toute autre tâche de promesse.

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
## Class: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

**Ajouté dans : v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`ReadableByteStreamController`](/fr/nodejs/api/webstreams#class-readablebytestreamcontroller).


## Classe : `ReadableStream` {#class-readablestream}

**Ajouté dans : v18.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`ReadableStream`](/fr/nodejs/api/webstreams#class-readablestream).

## Classe : `ReadableStreamBYOBReader` {#class-readablestreambyobreader}

**Ajouté dans : v18.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`ReadableStreamBYOBReader`](/fr/nodejs/api/webstreams#class-readablestreambyobreader).

## Classe : `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

**Ajouté dans : v18.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`ReadableStreamBYOBRequest`](/fr/nodejs/api/webstreams#class-readablestreambyobrequest).

## Classe : `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Ajouté dans : v18.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`ReadableStreamDefaultController`](/fr/nodejs/api/webstreams#class-readablestreamdefaultcontroller).

## Classe : `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

**Ajouté dans : v18.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`ReadableStreamDefaultReader`](/fr/nodejs/api/webstreams#class-readablestreamdefaultreader).

## `require()` {#require}

Cette variable peut sembler globale, mais elle ne l’est pas. Voir [`require()`](/fr/nodejs/api/modules#requireid).

## `Response` {#response}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0 | N’est plus expérimental. |
| v18.0.0 | N’est plus derrière l’indicateur CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Ajouté dans : v17.5.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stable: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Une implémentation compatible avec le navigateur de [\<Response\>](https://developer.mozilla.org/en-US/docs/Web/API/Response).


## `Request` {#request}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0 | N'est plus expérimental. |
| v18.0.0 | N'est plus masqué derrière l'indicateur CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Ajouté dans: v17.5.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Une implémentation compatible avec le navigateur de [\<Request\>](https://developer.mozilla.org/en-US/docs/Web/API/Request).

## `sessionStorage` {#sessionstorage}

**Ajouté dans: v22.4.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Développement précoce.
:::

Une implémentation compatible avec le navigateur de [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage). Les données sont stockées en mémoire, avec un quota de stockage de 10 Mo. Les données `sessionStorage` persistent uniquement dans le processus en cours d'exécution et ne sont pas partagées entre les workers.

## `setImmediate(callback[, ...args])` {#setimmediatecallback-args}

**Ajouté dans: v0.9.1**

[`setImmediate`](/fr/nodejs/api/timers#setimmediatecallback-args) est décrit dans la section [timers](/fr/nodejs/api/timers).

## `setInterval(callback, delay[, ...args])` {#setintervalcallback-delay-args}

**Ajouté dans: v0.0.1**

[`setInterval`](/fr/nodejs/api/timers#setintervalcallback-delay-args) est décrit dans la section [timers](/fr/nodejs/api/timers).

## `setTimeout(callback, delay[, ...args])` {#settimeoutcallback-delay-args}

**Ajouté dans: v0.0.1**

[`setTimeout`](/fr/nodejs/api/timers#settimeoutcallback-delay-args) est décrit dans la section [timers](/fr/nodejs/api/timers).

## Class: `Storage` {#class-storage}

**Ajouté dans: v22.4.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Développement précoce.
:::

Une implémentation compatible avec le navigateur de [`Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage). Activez cette API avec l'indicateur CLI [`--experimental-webstorage`](/fr/nodejs/api/cli#--experimental-webstorage).

## `structuredClone(value[, options])` {#structuredclonevalue-options}

**Ajouté dans: v17.0.0**

La méthode WHATWG [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone).


## `SubtleCrypto` {#subtlecrypto}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | N'est plus derrière l'indicateur CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Ajouté dans : v17.6.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable.
:::

Une implémentation compatible navigateur de [\<SubtleCrypto\>](/fr/nodejs/api/webcrypto#class-subtlecrypto). Cette variable globale n'est disponible que si le binaire Node.js a été compilé en incluant la prise en charge du module `node:crypto`.

## `DOMException` {#domexception}

**Ajouté dans : v17.0.0**

La classe WHATWG `DOMException`. Voir [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException) pour plus de détails.

## `TextDecoder` {#textdecoder}

**Ajouté dans : v11.0.0**

La classe WHATWG `TextDecoder`. Voir la section [`TextDecoder`](/fr/nodejs/api/util#class-utiltextdecoder).

## Classe : `TextDecoderStream` {#class-textdecoderstream}

**Ajouté dans : v18.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`TextDecoderStream`](/fr/nodejs/api/webstreams#class-textdecoderstream).

## `TextEncoder` {#textencoder}

**Ajouté dans : v11.0.0**

La classe WHATWG `TextEncoder`. Voir la section [`TextEncoder`](/fr/nodejs/api/util#class-utiltextencoder).

## Classe : `TextEncoderStream` {#class-textencoderstream}

**Ajouté dans : v18.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`TextEncoderStream`](/fr/nodejs/api/webstreams#class-textencoderstream).

## Classe : `TransformStream` {#class-transformstream}

**Ajouté dans : v18.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`TransformStream`](/fr/nodejs/api/webstreams#class-transformstream).

## Classe : `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}

**Ajouté dans : v18.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`TransformStreamDefaultController`](/fr/nodejs/api/webstreams#class-transformstreamdefaultcontroller).


## `URL` {#url}

**Ajoutée dans : v10.0.0**

La classe `URL` de WHATWG. Voir la section [`URL`](/fr/nodejs/api/url#class-url).

## `URLSearchParams` {#urlsearchparams}

**Ajoutée dans : v10.0.0**

La classe `URLSearchParams` de WHATWG. Voir la section [`URLSearchParams`](/fr/nodejs/api/url#class-urlsearchparams).

## `WebAssembly` {#webassembly}

**Ajoutée dans : v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L'objet qui sert d'espace de noms pour toutes les fonctionnalités liées à [WebAssembly](https://webassembly.org/) du W3C. Voir le [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/WebAssembly) pour l'utilisation et la compatibilité.

## `WebSocket` {#websocket}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.4.0 | N'est plus expérimental. |
| v22.0.0 | N'est plus masqué derrière l'indicateur CLI `--experimental-websocket`. |
| v21.0.0, v20.10.0 | Ajoutée dans : v21.0.0, v20.10.0 |
:::

::: tip [Stable : 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable.
:::

Une implémentation compatible avec le navigateur de [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket). Désactivez cette API avec l'indicateur CLI [`--no-experimental-websocket`](/fr/nodejs/api/cli#--no-experimental-websocket).

## Classe : `WritableStream` {#class-writablestream}

**Ajoutée dans : v18.0.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`WritableStream`](/fr/nodejs/api/webstreams#class-writablestream).

## Classe : `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

**Ajoutée dans : v18.0.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`WritableStreamDefaultController`](/fr/nodejs/api/webstreams#class-writablestreamdefaultcontroller).

## Classe : `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}

**Ajoutée dans : v18.0.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental.
:::

Une implémentation compatible avec le navigateur de [`WritableStreamDefaultWriter`](/fr/nodejs/api/webstreams#class-writablestreamdefaultwriter).

