---
title: Documentazione Node.js - Stringa di query
description: Questa sezione della documentazione di Node.js descrive in dettaglio il modulo querystring, che fornisce utilità per analizzare e formattare le stringhe di query URL. Include metodi per l'escape e l'unescape dei caratteri speciali, la gestione di oggetti annidati e la gestione della serializzazione delle stringhe di query.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Stringa di query | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Questa sezione della documentazione di Node.js descrive in dettaglio il modulo querystring, che fornisce utilità per analizzare e formattare le stringhe di query URL. Include metodi per l'escape e l'unescape dei caratteri speciali, la gestione di oggetti annidati e la gestione della serializzazione delle stringhe di query.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Stringa di query | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Questa sezione della documentazione di Node.js descrive in dettaglio il modulo querystring, che fornisce utilità per analizzare e formattare le stringhe di query URL. Include metodi per l'escape e l'unescape dei caratteri speciali, la gestione di oggetti annidati e la gestione della serializzazione delle stringhe di query.
---


# Query string {#query-string}

::: tip [Stable: 2 - Stabile]
[Stable: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/querystring.js](https://github.com/nodejs/node/blob/v23.5.0/lib/querystring.js)

Il modulo `node:querystring` fornisce utility per analizzare e formattare le query string degli URL. È possibile accedervi utilizzando:

```js [ESM]
const querystring = require('node:querystring');
```
`querystring` è più performante di [\<URLSearchParams\>](/it/nodejs/api/url#class-urlsearchparams) ma non è un'API standardizzata. Utilizzare [\<URLSearchParams\>](/it/nodejs/api/url#class-urlsearchparams) quando le prestazioni non sono critiche o quando è desiderabile la compatibilità con il codice del browser.

## `querystring.decode()` {#querystringdecode}

**Aggiunto in: v0.1.99**

La funzione `querystring.decode()` è un alias per `querystring.parse()`.

## `querystring.encode()` {#querystringencode}

**Aggiunto in: v0.1.99**

La funzione `querystring.encode()` è un alias per `querystring.stringify()`.

## `querystring.escape(str)` {#querystringescapestr}

**Aggiunto in: v0.1.25**

- `str` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `querystring.escape()` esegue la codifica URL percento sulla `str` fornita in un modo ottimizzato per i requisiti specifici delle query string degli URL.

Il metodo `querystring.escape()` viene utilizzato da `querystring.stringify()` e in genere non ci si aspetta che venga utilizzato direttamente. Viene esportato principalmente per consentire al codice dell'applicazione di fornire un'implementazione alternativa di codifica percento, se necessario, assegnando `querystring.escape` a una funzione alternativa.

## `querystring.parse(str[, sep[, eq[, options]]])` {#querystringparsestr-sep-eq-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Voci multiple vuote ora vengono analizzate correttamente (ad esempio `&=&=`). |
| v6.0.0 | L'oggetto restituito non eredita più da `Object.prototype`. |
| v6.0.0, v4.2.4 | Il parametro `eq` ora può avere una lunghezza superiore a `1`. |
| v0.1.25 | Aggiunto in: v0.1.25 |
:::

- `str` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La query string URL da analizzare
- `sep` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La sottostringa utilizzata per delimitare le coppie chiave e valore nella query string. **Predefinito:** `'&'`.
- `eq` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). La sottostringa utilizzata per delimitare le chiavi e i valori nella query string. **Predefinito:** `'='`.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `decodeURIComponent` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione da utilizzare durante la decodifica dei caratteri con codifica percento nella query string. **Predefinito:** `querystring.unescape()`.
    - `maxKeys` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica il numero massimo di chiavi da analizzare. Specificare `0` per rimuovere le limitazioni di conteggio delle chiavi. **Predefinito:** `1000`.
  
 

Il metodo `querystring.parse()` analizza una query string URL (`str`) in una raccolta di coppie chiave e valore.

Ad esempio, la query string `'foo=bar&abc=xyz&abc=123'` viene analizzata in:

```json [JSON]
{
  "foo": "bar",
  "abc": ["xyz", "123"]
}
```
L'oggetto restituito dal metodo `querystring.parse()` *non* eredita prototipicamente da `Object` di JavaScript. Ciò significa che i metodi tipici di `Object` come `obj.toString()`, `obj.hasOwnProperty()` e altri non sono definiti e *non funzioneranno*.

Per impostazione predefinita, si presume che i caratteri con codifica percento all'interno della query string utilizzino la codifica UTF-8. Se viene utilizzata una codifica dei caratteri alternativa, sarà necessario specificare un'opzione `decodeURIComponent` alternativa:

```js [ESM]
// Assuming gbkDecodeURIComponent function already exists...

querystring.parse('w=%D6%D0%CE%C4&foo=bar', null, null,
                  { decodeURIComponent: gbkDecodeURIComponent });
```

## `querystring.stringify(obj[, sep[, eq[, options]]])` {#querystringstringifyobj-sep-eq-options}

**Aggiunto in: v0.1.25**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'oggetto da serializzare in una stringa di query URL
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La sottostringa utilizzata per delimitare le coppie chiave e valore nella stringa di query. **Predefinito:** `'&'`.
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). La sottostringa utilizzata per delimitare chiavi e valori nella stringa di query. **Predefinito:** `'='`.
- `options`
    - `encodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione da utilizzare quando si convertono caratteri non sicuri per URL in codifica percentuale nella stringa di query. **Predefinito:** `querystring.escape()`.

Il metodo `querystring.stringify()` produce una stringa di query URL da un dato `obj` iterando attraverso le "proprietà proprie" dell'oggetto.

Serializza i seguenti tipi di valori passati in `obj`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) I valori numerici devono essere finiti. Qualsiasi altro valore di input verrà forzato in stringhe vuote.

```js [ESM]
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// Restituisce 'foo=bar&baz=qux&baz=quux&corge='

querystring.stringify({ foo: 'bar', baz: 'qux' }, ';', ':');
// Restituisce 'foo:bar;baz:qux'
```
Per impostazione predefinita, i caratteri che richiedono la codifica percentuale all'interno della stringa di query verranno codificati come UTF-8. Se è richiesta una codifica alternativa, è necessario specificare un'opzione `encodeURIComponent` alternativa:

```js [ESM]
// Supponendo che la funzione gbkEncodeURIComponent esista già,

querystring.stringify({ w: '中文', foo: 'bar' }, null, null,
                      { encodeURIComponent: gbkEncodeURIComponent });
```

## `querystring.unescape(str)` {#querystringunescapestr}

**Aggiunta in: v0.1.25**

- `str` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `querystring.unescape()` esegue la decodifica dei caratteri con codifica percentuale URL sulla `str` fornita.

Il metodo `querystring.unescape()` viene utilizzato da `querystring.parse()` e generalmente non ci si aspetta che venga utilizzato direttamente. Viene esportato principalmente per consentire al codice dell'applicazione di fornire un'implementazione di decodifica sostitutiva se necessario assegnando `querystring.unescape` a una funzione alternativa.

Per impostazione predefinita, il metodo `querystring.unescape()` tenterà di utilizzare il metodo integrato di JavaScript `decodeURIComponent()` per decodificare. Se ciò fallisce, verrà utilizzato un equivalente più sicuro che non genera eccezioni su URL non validi.

