---
title: Objetos Globais do Node.js
description: Esta página documenta os objetos globais disponíveis no Node.js, incluindo variáveis globais, funções e classes que são acessíveis de qualquer módulo sem a necessidade de importação explícita.
head:
  - - meta
    - name: og:title
      content: Objetos Globais do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta página documenta os objetos globais disponíveis no Node.js, incluindo variáveis globais, funções e classes que são acessíveis de qualquer módulo sem a necessidade de importação explícita.
  - - meta
    - name: twitter:title
      content: Objetos Globais do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta página documenta os objetos globais disponíveis no Node.js, incluindo variáveis globais, funções e classes que são acessíveis de qualquer módulo sem a necessidade de importação explícita.
---


# Objetos Globais {#global-objects}

Esses objetos estão disponíveis em todos os módulos.

As seguintes variáveis podem parecer globais, mas não são. Elas existem apenas no escopo dos [módulos CommonJS](/pt/nodejs/api/modules):

- [`__dirname`](/pt/nodejs/api/modules#__dirname)
- [`__filename`](/pt/nodejs/api/modules#__filename)
- [`exports`](/pt/nodejs/api/modules#exports)
- [`module`](/pt/nodejs/api/modules#module)
- [`require()`](/pt/nodejs/api/modules#requireid)

Os objetos listados aqui são específicos do Node.js. Existem [objetos integrados](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects) que fazem parte da própria linguagem JavaScript, que também são acessíveis globalmente.

## Classe: `AbortController` {#class-abortcontroller}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.4.0 | Não é mais experimental. |
| v15.0.0, v14.17.0 | Adicionado em: v15.0.0, v14.17.0 |
:::

Uma classe de utilidade usada para sinalizar o cancelamento em APIs selecionadas baseadas em `Promise`. A API é baseada na Web API [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

```js [ESM]
const ac = new AbortController();

ac.signal.addEventListener('abort', () => console.log('Abortado!'),
                           { once: true });

ac.abort();

console.log(ac.signal.aborted);  // Imprime true
```
### `abortController.abort([reason])` {#abortcontrollerabortreason}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.2.0, v16.14.0 | Adicionado o novo argumento opcional reason. |
| v15.0.0, v14.17.0 | Adicionado em: v15.0.0, v14.17.0 |
:::

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Um motivo opcional, recuperável na propriedade `reason` do `AbortSignal`.

Aciona o sinal de aborto, fazendo com que o `abortController.signal` emita o evento `'abort'`.

### `abortController.signal` {#abortcontrollersignal}

**Adicionado em: v15.0.0, v14.17.0**

- Tipo: [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal)

### Classe: `AbortSignal` {#class-abortsignal}

**Adicionado em: v15.0.0, v14.17.0**

- Estende: [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget)

O `AbortSignal` é usado para notificar os observadores quando o método `abortController.abort()` é chamado.


#### Método estático: `AbortSignal.abort([reason])` {#static-method-abortsignalabortreason}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.2.0, v16.14.0 | Adicionado o novo argumento opcional reason. |
| v15.12.0, v14.17.0 | Adicionado em: v15.12.0, v14.17.0 |
:::

- `reason`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal)

Retorna um novo `AbortSignal` já abortado.

#### Método estático: `AbortSignal.timeout(delay)` {#static-method-abortsignaltimeoutdelay}

**Adicionado em: v17.3.0, v16.14.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos a esperar antes de acionar o AbortSignal.

Retorna um novo `AbortSignal` que será abortado em `delay` milissegundos.

#### Método estático: `AbortSignal.any(signals)` {#static-method-abortsignalanysignals}

**Adicionado em: v20.3.0, v18.17.0**

- `signals` [\<AbortSignal[]\>](/pt/nodejs/api/globals#class-abortsignal) Os `AbortSignal`s dos quais compor um novo `AbortSignal`.

Retorna um novo `AbortSignal` que será abortado se algum dos sinais fornecidos for abortado. Seu [`abortSignal.reason`](/pt/nodejs/api/globals#abortsignalreason) será definido como aquele que causou o aborto dos `signals`.

#### Evento: `'abort'` {#event-abort}

**Adicionado em: v15.0.0, v14.17.0**

O evento `'abort'` é emitido quando o método `abortController.abort()` é chamado. O callback é invocado com um único argumento de objeto com uma única propriedade `type` definida como `'abort'`:

```js [ESM]
const ac = new AbortController();

// Use a propriedade onabort...
ac.signal.onabort = () => console.log('abortado!');

// Ou a API EventTarget...
ac.signal.addEventListener('abort', (event) => {
  console.log(event.type);  // Imprime 'abort'
}, { once: true });

ac.abort();
```
O `AbortController` com o qual o `AbortSignal` está associado só acionará o evento `'abort'` uma vez. Recomendamos que o código verifique se o atributo `abortSignal.aborted` é `false` antes de adicionar um ouvinte de evento `'abort'`.

Quaisquer listeners de evento anexados ao `AbortSignal` devem usar a opção `{ once: true }` (ou, se estiver usando as APIs `EventEmitter` para anexar um listener, use o método `once()`) para garantir que o listener de evento seja removido assim que o evento `'abort'` for tratado. Não fazer isso pode resultar em vazamentos de memória.


#### `abortSignal.aborted` {#abortsignalaborted}

**Adicionado em: v15.0.0, v14.17.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Verdadeiro após o `AbortController` ter sido abortado.

#### `abortSignal.onabort` {#abortsignalonabort}

**Adicionado em: v15.0.0, v14.17.0**

- Tipo: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Uma função de callback opcional que pode ser definida pelo código do usuário para ser notificada quando a função `abortController.abort()` for chamada.

#### `abortSignal.reason` {#abortsignalreason}

**Adicionado em: v17.2.0, v16.14.0**

- Tipo: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Uma razão opcional especificada quando o `AbortSignal` foi acionado.

```js [ESM]
const ac = new AbortController();
ac.abort(new Error('boom!'));
console.log(ac.signal.reason);  // Error: boom!
```
#### `abortSignal.throwIfAborted()` {#abortsignalthrowifaborted}

**Adicionado em: v17.3.0, v16.17.0**

Se `abortSignal.aborted` for `true`, lança `abortSignal.reason`.

## Classe: `Blob` {#class-blob}

**Adicionado em: v18.0.0**

Veja [\<Blob\>](/pt/nodejs/api/buffer#class-blob).

## Classe: `Buffer` {#class-buffer}

**Adicionado em: v0.1.103**

- [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Usado para manipular dados binários. Veja a [seção de buffer](/pt/nodejs/api/buffer).

## Classe: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`ByteLengthQueuingStrategy`](/pt/nodejs/api/webstreams#class-bytelengthqueuingstrategy).

## `__dirname` {#__dirname}

Esta variável pode parecer ser global, mas não é. Veja [`__dirname`](/pt/nodejs/api/modules#__dirname).

## `__filename` {#__filename}

Esta variável pode parecer ser global, mas não é. Veja [`__filename`](/pt/nodejs/api/modules#__filename).

## `atob(data)` {#atobdata}

**Adicionado em: v16.0.0**

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado. Use `Buffer.from(data, 'base64')` em vez disso.
:::

Alias global para [`buffer.atob()`](/pt/nodejs/api/buffer#bufferatobdata).


## `BroadcastChannel` {#broadcastchannel}

**Adicionado em: v18.0.0**

Veja [\<BroadcastChannel\>](/pt/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget).

## `btoa(data)` {#btoadata}

**Adicionado em: v16.0.0**

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado. Use `buf.toString('base64')` em vez disso.
:::

Alias global para [`buffer.btoa()`](/pt/nodejs/api/buffer#bufferbtoadata).

## `clearImmediate(immediateObject)` {#clearimmediateimmediateobject}

**Adicionado em: v0.9.1**

[`clearImmediate`](/pt/nodejs/api/timers#clearimmediateimmediate) é descrito na seção de [timers](/pt/nodejs/api/timers).

## `clearInterval(intervalObject)` {#clearintervalintervalobject}

**Adicionado em: v0.0.1**

[`clearInterval`](/pt/nodejs/api/timers#clearintervaltimeout) é descrito na seção de [timers](/pt/nodejs/api/timers).

## `clearTimeout(timeoutObject)` {#cleartimeouttimeoutobject}

**Adicionado em: v0.0.1**

[`clearTimeout`](/pt/nodejs/api/timers#cleartimeouttimeout) é descrito na seção de [timers](/pt/nodejs/api/timers).

## `CloseEvent` {#closeevent}

**Adicionado em: v23.0.0**

A classe `CloseEvent`. Veja [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent) para mais detalhes.

Uma implementação compatível com o navegador de [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent). Desative esta API com a flag CLI [`--no-experimental-websocket`](/pt/nodejs/api/cli#--no-experimental-websocket).

## Classe: `CompressionStream` {#class-compressionstream}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`CompressionStream`](/pt/nodejs/api/webstreams#class-compressionstream).

## `console` {#console}

**Adicionado em: v0.1.100**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Usado para imprimir para stdout e stderr. Veja a seção [`console`](/pt/nodejs/api/console).

## Classe: `CountQueuingStrategy` {#class-countqueuingstrategy}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`CountQueuingStrategy`](/pt/nodejs/api/webstreams#class-countqueuingstrategy).


## `Crypto` {#crypto}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | Não é mais experimental. |
| v19.0.0 | Não está mais atrás da flag CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Adicionado em: v17.6.0, v16.15.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável.
:::

Uma implementação compatível com navegador de [\<Crypto\>](/pt/nodejs/api/webcrypto#class-crypto). Este global está disponível apenas se o binário do Node.js foi compilado incluindo suporte para o módulo `node:crypto`.

## `crypto` {#crypto_1}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | Não é mais experimental. |
| v19.0.0 | Não está mais atrás da flag CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Adicionado em: v17.6.0, v16.15.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável.
:::

Uma implementação compatível com navegador da [Web Crypto API](/pt/nodejs/api/webcrypto).

## `CryptoKey` {#cryptokey}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | Não é mais experimental. |
| v19.0.0 | Não está mais atrás da flag CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Adicionado em: v17.6.0, v16.15.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável.
:::

Uma implementação compatível com navegador de [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey). Este global está disponível apenas se o binário do Node.js foi compilado incluindo suporte para o módulo `node:crypto`.

## `CustomEvent` {#customevent}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | Não é mais experimental. |
| v22.1.0, v20.13.0 | CustomEvent agora é estável. |
| v19.0.0 | Não está mais atrás da flag CLI `--experimental-global-customevent`. |
| v18.7.0, v16.17.0 | Adicionado em: v18.7.0, v16.17.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Uma implementação compatível com navegador da [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent).


## Classe: `DecompressionStream` {#class-decompressionstream}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`DecompressionStream`](/pt/nodejs/api/webstreams#class-decompressionstream).

## `Event` {#event}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v15.4.0 | Não é mais experimental. |
| v15.0.0 | Adicionado em: v15.0.0 |
:::

Uma implementação compatível com o navegador da classe `Event`. Veja [`EventTarget` e API `Event`](/pt/nodejs/api/events#eventtarget-and-event-api) para mais detalhes.

## `EventSource` {#eventsource}

**Adicionado em: v22.3.0, v20.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental. Habilite esta API com a flag de CLI [`--experimental-eventsource`](/pt/nodejs/api/cli#--experimental-eventsource).
:::

Uma implementação compatível com o navegador da classe [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource).

## `EventTarget` {#eventtarget}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v15.4.0 | Não é mais experimental. |
| v15.0.0 | Adicionado em: v15.0.0 |
:::

Uma implementação compatível com o navegador da classe `EventTarget`. Veja [`EventTarget` e API `Event`](/pt/nodejs/api/events#eventtarget-and-event-api) para mais detalhes.

## `exports` {#exports}

Esta variável pode parecer global, mas não é. Veja [`exports`](/pt/nodejs/api/modules#exports).

## `fetch` {#fetch}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v21.0.0 | Não é mais experimental. |
| v18.0.0 | Não está mais atrás da flag de CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Adicionado em: v17.5.0, v16.15.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Uma implementação compatível com o navegador da função [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch).

## Classe: `File` {#class-file}

**Adicionado em: v20.0.0**

Veja [\<File\>](/pt/nodejs/api/buffer#class-file).


## Classe `FormData` {#class-formdata}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v21.0.0 | Não é mais experimental. |
| v18.0.0 | Não está mais atrás do sinalizador CLI `--experimental-fetch`. |
| v17.6.0, v16.15.0 | Adicionado em: v17.6.0, v16.15.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Uma implementação compatível com o navegador de [\<FormData\>](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

## `global` {#global}

**Adicionado em: v0.1.27**

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado. Use [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) em vez disso.
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O objeto de namespace global.

Nos navegadores, o escopo de nível superior tem sido tradicionalmente o escopo global. Isso significa que `var something` definirá uma nova variável global, exceto em módulos ECMAScript. No Node.js, isso é diferente. O escopo de nível superior não é o escopo global; `var something` dentro de um módulo Node.js será local para esse módulo, independentemente de ser um [módulo CommonJS](/pt/nodejs/api/modules) ou um [módulo ECMAScript](/pt/nodejs/api/esm).

## Classe `Headers` {#class-headers}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v21.0.0 | Não é mais experimental. |
| v18.0.0 | Não está mais atrás do sinalizador CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Adicionado em: v17.5.0, v16.15.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Uma implementação compatível com o navegador de [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers).

## `localStorage` {#localstorage}

**Adicionado em: v22.4.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Desenvolvimento inicial.
:::

Uma implementação compatível com o navegador de [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Os dados são armazenados não criptografados no arquivo especificado pelo sinalizador CLI [`--localstorage-file`](/pt/nodejs/api/cli#--localstorage-filefile). A quantidade máxima de dados que pode ser armazenada é de 10 MB. Qualquer modificação desses dados fora da API Web Storage não é suportada. Ative esta API com o sinalizador CLI [`--experimental-webstorage`](/pt/nodejs/api/cli#--experimental-webstorage). Os dados de `localStorage` não são armazenados por usuário ou por solicitação quando usados no contexto de um servidor, eles são compartilhados entre todos os usuários e solicitações.


## `MessageChannel` {#messagechannel}

**Adicionado em: v15.0.0**

A classe `MessageChannel`. Consulte [`MessageChannel`](/pt/nodejs/api/worker_threads#class-messagechannel) para obter mais detalhes.

## `MessageEvent` {#messageevent}

**Adicionado em: v15.0.0**

A classe `MessageEvent`. Consulte [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/MessageEvent) para obter mais detalhes.

## `MessagePort` {#messageport}

**Adicionado em: v15.0.0**

A classe `MessagePort`. Consulte [`MessagePort`](/pt/nodejs/api/worker_threads#class-messageport) para obter mais detalhes.

## `module` {#module}

Esta variável pode parecer global, mas não é. Consulte [`module`](/pt/nodejs/api/modules#module).

## `Navigator` {#navigator}

**Adicionado em: v21.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo. Desative esta API com o sinalizador CLI [`--no-experimental-global-navigator`](/pt/nodejs/api/cli#--no-experimental-global-navigator).
:::

Uma implementação parcial da [API Navigator](https://html.spec.whatwg.org/multipage/system-state#the-navigator-object).

## `navigator` {#navigator_1}

**Adicionado em: v21.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo. Desative esta API com o sinalizador CLI [`--no-experimental-global-navigator`](/pt/nodejs/api/cli#--no-experimental-global-navigator).
:::

Uma implementação parcial de [`window.navigator`](https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator).

### `navigator.hardwareConcurrency` {#navigatorhardwareconcurrency}

**Adicionado em: v21.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A propriedade somente leitura `navigator.hardwareConcurrency` retorna o número de processadores lógicos disponíveis para a instância Node.js atual.

```js [ESM]
console.log(`Este processo está sendo executado em ${navigator.hardwareConcurrency} processadores lógicos`);
```
### `navigator.language` {#navigatorlanguage}

**Adicionado em: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade somente leitura `navigator.language` retorna uma string representando o idioma preferido da instância Node.js. O idioma será determinado pela biblioteca ICU usada pelo Node.js em tempo de execução com base no idioma padrão do sistema operacional.

O valor representa a versão do idioma conforme definido em [RFC 5646](https://www.rfc-editor.org/rfc/rfc5646.txt).

O valor de fallback em builds sem ICU é `'en-US'`.

```js [ESM]
console.log(`O idioma preferido da instância Node.js tem a tag '${navigator.language}'`);
```

### `navigator.languages` {#navigatorlanguages}

**Adicionado em: v21.2.0**

- {Array

A propriedade somente leitura `navigator.languages` retorna um array de strings representando os idiomas preferidos da instância Node.js. Por padrão, `navigator.languages` contém apenas o valor de `navigator.language`, que será determinado pela biblioteca ICU usada pelo Node.js em tempo de execução com base no idioma padrão do sistema operacional.

O valor de fallback em compilações sem ICU é `['en-US']`.

```js [ESM]
console.log(`Os idiomas preferidos são '${navigator.languages}'`);
```
### `navigator.platform` {#navigatorplatform}

**Adicionado em: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade somente leitura `navigator.platform` retorna uma string identificando a plataforma na qual a instância Node.js está sendo executada.

```js [ESM]
console.log(`Este processo está sendo executado em ${navigator.platform}`);
```
### `navigator.userAgent` {#navigatoruseragent}

**Adicionado em: v21.1.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade somente leitura `navigator.userAgent` retorna o user agent consistindo no nome do runtime e no número da versão principal.

```js [ESM]
console.log(`O user-agent é ${navigator.userAgent}`); // Imprime "Node.js/21"
```
## `PerformanceEntry` {#performanceentry}

**Adicionado em: v19.0.0**

A classe `PerformanceEntry`. Veja [`PerformanceEntry`](/pt/nodejs/api/perf_hooks#class-performanceentry) para mais detalhes.

## `PerformanceMark` {#performancemark}

**Adicionado em: v19.0.0**

A classe `PerformanceMark`. Veja [`PerformanceMark`](/pt/nodejs/api/perf_hooks#class-performancemark) para mais detalhes.

## `PerformanceMeasure` {#performancemeasure}

**Adicionado em: v19.0.0**

A classe `PerformanceMeasure`. Veja [`PerformanceMeasure`](/pt/nodejs/api/perf_hooks#class-performancemeasure) para mais detalhes.

## `PerformanceObserver` {#performanceobserver}

**Adicionado em: v19.0.0**

A classe `PerformanceObserver`. Veja [`PerformanceObserver`](/pt/nodejs/api/perf_hooks#class-performanceobserver) para mais detalhes.

## `PerformanceObserverEntryList` {#performanceobserverentrylist}

**Adicionado em: v19.0.0**

A classe `PerformanceObserverEntryList`. Veja [`PerformanceObserverEntryList`](/pt/nodejs/api/perf_hooks#class-performanceobserverentrylist) para mais detalhes.


## `PerformanceResourceTiming` {#performanceresourcetiming}

**Adicionado em: v19.0.0**

A classe `PerformanceResourceTiming`. Veja [`PerformanceResourceTiming`](/pt/nodejs/api/perf_hooks#class-performanceresourcetiming) para mais detalhes.

## `performance` {#performance}

**Adicionado em: v16.0.0**

O objeto [`perf_hooks.performance`](/pt/nodejs/api/perf_hooks#perf_hooksperformance).

## `process` {#process}

**Adicionado em: v0.1.7**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

O objeto process. Veja a seção [`process` object](/pt/nodejs/api/process#process).

## `queueMicrotask(callback)` {#queuemicrotaskcallback}

**Adicionado em: v11.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função a ser enfileirada.

O método `queueMicrotask()` enfileira uma microtarefa para invocar `callback`. Se `callback` lançar uma exceção, o evento `'uncaughtException'` do [`process` object](/pt/nodejs/api/process#process) será emitido.

A fila de microtarefas é gerenciada pelo V8 e pode ser usada de forma semelhante à fila [`process.nextTick()`](/pt/nodejs/api/process#processnexttickcallback-args), que é gerenciada pelo Node.js. A fila `process.nextTick()` é sempre processada antes da fila de microtarefas em cada turno do loop de eventos do Node.js.

```js [ESM]
// Aqui, `queueMicrotask()` é usado para garantir que o evento 'load' seja sempre
// emitido de forma assíncrona e, portanto, consistente. Usar
// `process.nextTick()` aqui resultaria no evento 'load' sempre sendo emitido
// antes de qualquer outro job de promessa.

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

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`ReadableByteStreamController`](/pt/nodejs/api/webstreams#class-readablebytestreamcontroller).


## Classe: `ReadableStream` {#class-readablestream}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`ReadableStream`](/pt/nodejs/api/webstreams#class-readablestream).

## Classe: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`ReadableStreamBYOBReader`](/pt/nodejs/api/webstreams#class-readablestreambyobreader).

## Classe: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`ReadableStreamBYOBRequest`](/pt/nodejs/api/webstreams#class-readablestreambyobrequest).

## Classe: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`ReadableStreamDefaultController`](/pt/nodejs/api/webstreams#class-readablestreamdefaultcontroller).

## Classe: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`ReadableStreamDefaultReader`](/pt/nodejs/api/webstreams#class-readablestreamdefaultreader).

## `require()` {#require}

Esta variável pode parecer global, mas não é. Consulte [`require()`](/pt/nodejs/api/modules#requireid).

## `Response` {#response}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v21.0.0 | Não é mais experimental. |
| v18.0.0 | Não está mais atrás da flag de CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Adicionado em: v17.5.0, v16.15.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Uma implementação compatível com o navegador de [\<Response\>](https://developer.mozilla.org/en-US/docs/Web/API/Response).


## `Request` {#request}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.0.0 | Não é mais experimental. |
| v18.0.0 | Não está mais atrás da flag `--experimental-fetch` da CLI. |
| v17.5.0, v16.15.0 | Adicionado em: v17.5.0, v16.15.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Uma implementação compatível com o navegador de [\<Request\>](https://developer.mozilla.org/en-US/docs/Web/API/Request).

## `sessionStorage` {#sessionstorage}

**Adicionado em: v22.4.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).0 - Desenvolvimento inicial.
:::

Uma implementação compatível com o navegador de [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage). Os dados são armazenados na memória, com uma quota de armazenamento de 10 MB. Os dados do `sessionStorage` persistem apenas dentro do processo em execução atual e não são compartilhados entre os workers.

## `setImmediate(callback[, ...args])` {#setimmediatecallback-args}

**Adicionado em: v0.9.1**

[`setImmediate`](/pt/nodejs/api/timers#setimmediatecallback-args) é descrito na seção [timers](/pt/nodejs/api/timers).

## `setInterval(callback, delay[, ...args])` {#setintervalcallback-delay-args}

**Adicionado em: v0.0.1**

[`setInterval`](/pt/nodejs/api/timers#setintervalcallback-delay-args) é descrito na seção [timers](/pt/nodejs/api/timers).

## `setTimeout(callback, delay[, ...args])` {#settimeoutcallback-delay-args}

**Adicionado em: v0.0.1**

[`setTimeout`](/pt/nodejs/api/timers#settimeoutcallback-delay-args) é descrito na seção [timers](/pt/nodejs/api/timers).

## Class: `Storage` {#class-storage}

**Adicionado em: v22.4.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).0 - Desenvolvimento inicial.
:::

Uma implementação compatível com o navegador de [`Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage). Habilite esta API com a flag da CLI [`--experimental-webstorage`](/pt/nodejs/api/cli#--experimental-webstorage).

## `structuredClone(value[, options])` {#structuredclonevalue-options}

**Adicionado em: v17.0.0**

O método WHATWG [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone).


## `SubtleCrypto` {#subtlecrypto}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Não está mais atrás da flag CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Adicionado em: v17.6.0, v16.15.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável.
:::

Uma implementação compatível com o navegador de [\<SubtleCrypto\>](/pt/nodejs/api/webcrypto#class-subtlecrypto). Este global está disponível apenas se o binário do Node.js foi compilado incluindo suporte para o módulo `node:crypto`.

## `DOMException` {#domexception}

**Adicionado em: v17.0.0**

A classe WHATWG `DOMException`. Veja [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException) para mais detalhes.

## `TextDecoder` {#textdecoder}

**Adicionado em: v11.0.0**

A classe WHATWG `TextDecoder`. Veja a seção [`TextDecoder`](/pt/nodejs/api/util#class-utiltextdecoder).

## Classe: `TextDecoderStream` {#class-textdecoderstream}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`TextDecoderStream`](/pt/nodejs/api/webstreams#class-textdecoderstream).

## `TextEncoder` {#textencoder}

**Adicionado em: v11.0.0**

A classe WHATWG `TextEncoder`. Veja a seção [`TextEncoder`](/pt/nodejs/api/util#class-utiltextencoder).

## Classe: `TextEncoderStream` {#class-textencoderstream}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`TextEncoderStream`](/pt/nodejs/api/webstreams#class-textencoderstream).

## Classe: `TransformStream` {#class-transformstream}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`TransformStream`](/pt/nodejs/api/webstreams#class-transformstream).

## Classe: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`TransformStreamDefaultController`](/pt/nodejs/api/webstreams#class-transformstreamdefaultcontroller).


## `URL` {#url}

**Adicionado em: v10.0.0**

A classe `URL` da WHATWG. Veja a seção [`URL`](/pt/nodejs/api/url#class-url).

## `URLSearchParams` {#urlsearchparams}

**Adicionado em: v10.0.0**

A classe `URLSearchParams` da WHATWG. Veja a seção [`URLSearchParams`](/pt/nodejs/api/url#class-urlsearchparams).

## `WebAssembly` {#webassembly}

**Adicionado em: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

O objeto que atua como o namespace para toda a funcionalidade relacionada ao [WebAssembly](https://webassembly.org/) da W3C. Consulte a [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/WebAssembly) para uso e compatibilidade.

## `WebSocket` {#websocket}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.4.0 | Não é mais experimental. |
| v22.0.0 | Não está mais atrás do sinalizador CLI `--experimental-websocket`. |
| v21.0.0, v20.10.0 | Adicionado em: v21.0.0, v20.10.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável.
:::

Uma implementação compatível com o navegador de [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket). Desative esta API com o sinalizador CLI [`--no-experimental-websocket`](/pt/nodejs/api/cli#--no-experimental-websocket).

## Classe: `WritableStream` {#class-writablestream}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`WritableStream`](/pt/nodejs/api/webstreams#class-writablestream).

## Classe: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`WritableStreamDefaultController`](/pt/nodejs/api/webstreams#class-writablestreamdefaultcontroller).

## Classe: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}

**Adicionado em: v18.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental.
:::

Uma implementação compatível com o navegador de [`WritableStreamDefaultWriter`](/pt/nodejs/api/webstreams#class-writablestreamdefaultwriter).

